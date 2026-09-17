import { NextRequest, NextResponse } from 'next/server';
import { subscribeEmail, isValidEmail } from '@/lib/newsletter';
import { sendConfirmationEmail } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body?.email;

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Proszę podać poprawny adres e-mail.' },
        { status: 400 }
      );
    }

    const { token, alreadyActive } = await subscribeEmail(email);

    if (alreadyActive) {
      return NextResponse.json({
        success: true,
        alreadyActive: true,
        message: 'Twój adres jest już aktywny w gronie czytelników.',
      });
    }

    // Wysyłamy e-mail aktywacyjny
    const emailResult = await sendConfirmationEmail({
      to: email,
      token,
    });

    return NextResponse.json({
      success: true,
      alreadyActive: false,
      message: 'Na Twój adres wysłaliśmy link potwierdzający. Sprawdź skrzynkę odbiorczą (oraz folder SPAM/Powiadomienia).',
      mode: emailResult.mode,
      devConfirmUrl: emailResult.mode === 'dev' ? emailResult.confirmUrl : undefined,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Wystąpił błąd podczas zapisu.';
    console.error('Błąd w /api/newsletter/subscribe:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
