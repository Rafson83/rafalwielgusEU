import Link from 'next/link';
import { AdminPost } from '@/lib/posts-server';
import { formatPolishDateWithWeekday } from '@/lib/posts';

interface RelatedPostsProps {
  posts: AdminPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto mt-16 max-w-4xl border-t border-[#181817] pt-12 sm:pt-16">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#e85d3f]">
            Dalsza lektura
          </span>
          <h2 className="mt-2 font-serif text-2xl sm:text-4xl font-black tracking-tight text-[#181817]">
            Przeczytaj również
          </h2>
        </div>
        <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#514f49]">
          Starannie dobrane eseje uzupełniające
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((item) => {
          const readingTime = Math.max(
            1,
            Math.ceil((item.content || '').trim().split(/\s+/).length / 200)
          );

          return (
            <article
              key={item.slug}
              className="group flex flex-col justify-between border border-[#181817] bg-[#ede7dc]/40 p-6 sm:p-7 shadow-[4px_4px_0_#181817] transition-all hover:-translate-y-1 hover:border-[#e85d3f] hover:shadow-[6px_6px_0_#e85d3f]"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="bg-[#181817] px-2.5 py-1 font-sans text-[11px] font-bold uppercase tracking-wider text-white">
                    {item.category}
                  </span>
                  <span className="font-sans text-xs text-[#514f49]">
                    {readingTime} min czytania
                  </span>
                </div>

                <h3 className="mt-4 font-serif text-xl sm:text-2xl font-bold leading-snug tracking-tight text-[#181817] transition-colors group-hover:text-[#e85d3f]">
                  <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                </h3>

                <p className="mt-3 font-sans text-xs leading-relaxed text-[#514f49] line-clamp-3">
                  {item.seoDescription || item.content.split('\n\n')[0].slice(0, 160) + '...'}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#181817]/15 pt-4">
                <span className="font-sans text-[11px] font-medium text-[#514f49]">
                  {formatPolishDateWithWeekday(item.createdAt)}
                </span>
                <Link
                  href={`/blog/${item.slug}`}
                  className="font-sans text-xs font-bold uppercase tracking-wider text-[#181817] transition-colors group-hover:text-[#e85d3f]"
                >
                  Czytaj &rarr;
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
