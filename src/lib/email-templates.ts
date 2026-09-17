import { Resend } from 'resend';

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  return new Resend(apiKey);
}

export function generateConfirmationEmailHtml(params: {
  confirmUrl: string;
  unsubscribeUrl: string;
}): string {
  const { confirmUrl, unsubscribeUrl } = params;

  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Potwierdź subskrypcję — Rafał Wielgus</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f0e9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #181817; line-height: 1.6;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f0e9; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 2px solid #181817; box-shadow: 8px 8px 0px #181817;">
          <!-- Header Bar -->
          <tr>
            <td style="padding: 24px 32px; border-bottom: 2px solid #181817; background-color: #ede7dc;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: #181817; color: #f4f0e9; font-size: 16px; font-weight: bold; padding: 6px 12px; font-family: Georgia, serif; letter-spacing: -0.02em;">
                      RW<span style="color: #e85d3f;">.</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; color: #514f49;">
                      Wtorki & Czwartki • 09:00
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px;">
              <span style="display: inline-block; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.18em; color: #e85d3f; margin-bottom: 12px;">
                Potwierdzenie adresu
              </span>
              <h1 style="font-family: Georgia, serif; font-size: 26px; line-height: 1.15; font-weight: bold; color: #181817; margin: 0 0 20px 0; letter-spacing: -0.03em;">
                Dołącz do grona czytelników esejów.
              </h1>
              <p style="font-size: 15px; line-height: 1.65; color: #33312e; margin: 0 0 16px 0;">
                Cześć! Otrzymujesz tę wiadomość, ponieważ Twój adres został wprowadzony w formularzu na stronie <strong>rafalwielgus.eu</strong>.
              </p>
              <p style="font-size: 15px; line-height: 1.65; color: #33312e; margin: 0 0 28px 0;">
                W każdy wtorek i czwartek o 09:00 dzielę się konkretnymi esejami o technologii, automatyzacji przemysłowej, psychologii decyzji oraz idei <strong>Long-Life Learning</strong>. Żadnego spamu i taniej motywacji — tylko rzetelne rzemiosło i wnioski z pierwszej linii.
              </p>

              <!-- CTA Button -->
              <table border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center" style="background-color: #181817; border: 2px solid #181817;">
                    <a href="${confirmUrl}" target="_blank" style="display: inline-block; padding: 16px 32px; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.12em; color: #ffffff; text-decoration: none;">
                      Potwierdź subskrypcję &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; color: #6b6860; line-height: 1.5; margin: 24px 0 0 0;">
                Jeśli link w przycisku nie działa, skopiuj poniższy adres i wklej go w przeglądarce:<br>
                <a href="${confirmUrl}" style="color: #e85d3f; word-break: break-all; text-decoration: underline;">${confirmUrl}</a>
              </p>

              <hr style="border: none; border-top: 1px solid #181817; opacity: 0.2; margin: 32px 0 20px 0;">

              <p style="font-size: 12px; color: #737067; margin: 0; line-height: 1.5;">
                Jeśli to nie Ty podałeś ten adres, po prostu zignoruj tę wiadomość. Twój adres nie zostanie dodany do bazy bez kliknięcia w powyższy link.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #ede7dc; border-top: 2px solid #181817; font-size: 12px; color: #514f49; line-height: 1.5;">
              <p style="margin: 0 0 6px 0; font-weight: bold; color: #181817;">
                Rafał Wielgus &bull; Notatnik osobisty & Eseje
              </p>
              <p style="margin: 0 0 8px 0;">
                Technik elektronik, automatyka przemysłowa & pasjonat IT.<br>
                Wrocław, Polska &bull; <a href="https://rafalwielgus.eu" style="color: #181817; text-decoration: underline;">rafalwielgus.eu</a>
              </p>
              <p style="margin: 0; font-size: 11px;">
                Chcesz zrezygnować? <a href="${unsubscribeUrl}" style="color: #e85d3f; text-decoration: underline;">Wypisz się z newslettera</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Wysyła wiadomość z linkiem potwierdzającym (Double Opt-In).
 * W przypadku braku klucza RESEND_API_KEY wypisuje link do konsoli w trybie dev.
 */
export async function sendConfirmationEmail(params: {
  to: string;
  token: string;
}): Promise<{
  success: boolean;
  mode: 'resend' | 'dev';
  confirmUrl: string;
  error?: string;
}> {
  const { to, token } = params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const confirmUrl = `${baseUrl}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;
  const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;

  const resend = getResendClient();

  if (!resend) {
    console.log('\n======================================================');
    console.log('[NEWSLETTER DEV] Brak klucza RESEND_API_KEY w .env.local');
    console.log(`[NEWSLETTER DEV] Odbiorca: ${to}`);
    console.log(`[NEWSLETTER DEV] Link potwierdzający subskrypcję:`);
    console.log(confirmUrl);
    console.log('======================================================\n');

    return {
      success: true,
      mode: 'dev',
      confirmUrl,
    };
  }

  try {
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'Rafał Wielgus <onboarding@resend.dev>';
    const html = generateConfirmationEmailHtml({ confirmUrl, unsubscribeUrl });

    await resend.emails.send({
      from: fromAddress,
      to,
      subject: 'Potwierdź subskrypcję esejów — Rafał Wielgus',
      html,
    });

    return {
      success: true,
      mode: 'resend',
      confirmUrl,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Błąd wysyłki e-maila przez Resend:', errorMsg);
    return {
      success: false,
      mode: 'resend',
      confirmUrl,
      error: errorMsg,
    };
  }
}
