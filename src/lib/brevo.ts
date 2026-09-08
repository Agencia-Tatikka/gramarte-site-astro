/**
 * Módulo Brevo (Sendinblue API v3)
 * Padrão "Peça de Lego" do Relay
 */

export interface BrevoSendEmailParams {
  toEmail: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  senderEmail?: string;
  senderName?: string;
}

export async function sendBrevoEmail(params: BrevoSendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = import.meta.env.BREVO_API_KEY;

  if (!apiKey || apiKey.includes('exemplo')) {
    console.warn('⚠️ [BrevoService] Chave de API não configurada no .env. Simulação em dev.');
    return { success: true, messageId: 'mock-dev-id' };
  }

  const url = 'https://api.brevo.com/v3/smtp/email';
  const payload = {
    sender: {
      email: params.senderEmail || 'notificacoes@tatikka.com.br',
      name: params.senderName || 'Tatikka Digital'
    },
    to: [
      {
        email: params.toEmail,
        name: params.toName || params.toEmail
      }
    ],
    subject: params.subject,
    htmlContent: params.htmlContent
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('❌ [BrevoService] Erro ao enviar e-mail:', res.status, errText);
      return { success: false, error: errText };
    }

    const data = await res.json();
    return { success: true, messageId: data.messageId };
  } catch (err: any) {
    console.error('❌ [BrevoService] Exceção de rede:', err);
    return { success: false, error: err.message };
  }
}
