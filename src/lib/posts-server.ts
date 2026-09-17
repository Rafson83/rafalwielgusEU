import fs from 'fs/promises';
import path from 'path';
import { FALLBACK_POSTS, Post, ensurePostsTable } from './posts';
import { db } from './db';
import { RowDataPacket } from 'mysql2';

const DATA_DIR = path.join(process.cwd(), 'data');
const POSTS_OVERRIDE_FILE = path.join(DATA_DIR, 'posts_override.json');
const CUSTOM_POSTS_FILE = path.join(DATA_DIR, 'custom_posts.json');

export interface PostOverride {
  published?: number | boolean;
  createdAt?: string;
  category?: string;
  title?: string;
}

export interface AdminPost extends Post {
  postStatus: 'draft' | 'scheduled' | 'published';
  statusLabel: string;
}

export function computePostStatus(post: Post, refDate: Date = new Date()): {
  postStatus: 'draft' | 'scheduled' | 'published';
  statusLabel: string;
} {
  const isPub = post.published === 1 || post.published === true;
  if (!isPub) {
    return {
      postStatus: 'draft',
      statusLabel: 'Szkic (niewidoczny)',
    };
  }

  const postTime = new Date(post.createdAt).getTime();
  const nowTime = refDate.getTime();

  if (postTime > nowTime) {
    return {
      postStatus: 'scheduled',
      statusLabel: 'Zapowiedź (zaplanowany)',
    };
  }

  return {
    postStatus: 'published',
    statusLabel: 'Opublikowany',
  };
}

async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Błąd zapisu do pliku ${filePath}:`, err);
  }
}

export async function getAllPostsForAdmin(refDate: Date = new Date()): Promise<AdminPost[]> {
  const overrides = await readJsonFile<Record<string, PostOverride>>(POSTS_OVERRIDE_FILE, {});
  const customPosts = await readJsonFile<Post[]>(CUSTOM_POSTS_FILE, []);

  let dbPosts: Post[] = [];
  try {
    await ensurePostsTable();
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM posts ORDER BY createdAt DESC');
    if (rows && rows.length > 0) {
      dbPosts = rows as Post[];
    }
  } catch {
    // MySQL nieosiągalna w lokalnym środowisku
  }

  // Połączenie bazy, postów użytkownika i fallbacku (bez duplikatów po slug)
  const postsMap = new Map<string, Post>();

  // 1. Domyślne wpisy
  for (const post of FALLBACK_POSTS) {
    postsMap.set(post.slug, { ...post });
  }

  // 2. Wpisy z bazy danych
  for (const post of dbPosts) {
    postsMap.set(post.slug, { ...post });
  }

  // 3. Własne wpisy z pliku lokalnego
  for (const post of customPosts) {
    postsMap.set(post.slug, { ...post });
  }

  // 4. Zaaplikowanie nadpisań
  const result: AdminPost[] = [];
  for (const post of postsMap.values()) {
    const override = overrides[post.slug];
    const effectivePost: Post = {
      ...post,
      published: override?.published !== undefined ? override.published : post.published,
      createdAt: override?.createdAt || post.createdAt,
      category: override?.category || post.category,
      title: override?.title || post.title,
    };

    const { postStatus, statusLabel } = computePostStatus(effectivePost, refDate);

    result.push({
      ...effectivePost,
      postStatus,
      statusLabel,
      isScheduled: postStatus === 'scheduled',
    });
  }

  return result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function updatePostStatus(
  slug: string,
  newStatus: 'draft' | 'scheduled' | 'published',
  customDate?: string
): Promise<AdminPost | null> {
  const overrides = await readJsonFile<Record<string, PostOverride>>(POSTS_OVERRIDE_FILE, {});
  const current = overrides[slug] || {};

  let published = 1;
  let createdAt = customDate;

  if (newStatus === 'draft') {
    published = 0;
  } else if (newStatus === 'scheduled') {
    published = 1;
    if (!createdAt) {
      // Domyślnie za 7 dni
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 7);
      nextDate.setHours(9, 0, 0, 0);
      createdAt = nextDate.toISOString();
    }
  } else {
    // published
    published = 1;
    createdAt = new Date().toISOString();
  }

  overrides[slug] = {
    ...current,
    published,
    ...(createdAt ? { createdAt } : {}),
  };

  await writeJsonFile(POSTS_OVERRIDE_FILE, overrides);

  // Zapis do MySQL jeśli aktywna
  try {
    await db.query(
      'UPDATE posts SET published = ?, createdAt = COALESCE(?, createdAt) WHERE slug = ?',
      [published, createdAt || null, slug]
    );
  } catch {
    // fallback
  }

  const all = await getAllPostsForAdmin();
  return all.find((p) => p.slug === slug) || null;
}

export async function createNewPost(postData: {
  title: string;
  slug: string;
  content: string;
  category: string;
  tags?: string;
  seoTitle?: string;
  seoDescription?: string;
  thumbnailUrl?: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduledDate?: string;
}): Promise<AdminPost> {
  const isPublished = postData.status === 'draft' ? 0 : 1;
  let createdAt = new Date().toISOString();
  if (postData.status === 'scheduled' && postData.scheduledDate) {
    createdAt = new Date(postData.scheduledDate).toISOString();
  }

  const newPost: Post = {
    id: Date.now(),
    title: postData.title,
    slug: postData.slug,
    content: postData.content,
    category: postData.category,
    tags: postData.tags,
    seoTitle: postData.seoTitle,
    seoDescription: postData.seoDescription,
    thumbnailUrl: postData.thumbnailUrl,
    published: isPublished,
    createdAt,
  };

  // Zapis do pliku custom_posts.json
  const customPosts = await readJsonFile<Post[]>(CUSTOM_POSTS_FILE, []);
  customPosts.unshift(newPost);
  await writeJsonFile(CUSTOM_POSTS_FILE, customPosts);

  // Zapis do bazy danych MySQL
  try {
    await ensurePostsTable();
    await db.query(
      'INSERT INTO posts (title, slug, content, category, tags, seoTitle, seoDescription, thumbnailUrl, published, publishedAt, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newPost.title,
        newPost.slug,
        newPost.content,
        newPost.category,
        newPost.tags || null,
        newPost.seoTitle || null,
        newPost.seoDescription || null,
        newPost.thumbnailUrl || null,
        isPublished,
        isPublished ? new Date() : null,
        createdAt,
      ]
    );
  } catch {
    // fallback
  }

  const { postStatus, statusLabel } = computePostStatus(newPost);
  return {
    ...newPost,
    postStatus,
    statusLabel,
    isScheduled: postStatus === 'scheduled',
  };
}
