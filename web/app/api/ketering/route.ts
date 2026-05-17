import { NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Construct the Telegram message based on type
    const isContact = data.type === 'kontakt';
    const title = isContact ? '📩 <b>NOVA PORUKA (KONTAKT)</b> 📩' : '🍽️ <b>NOVI UPIT ZA KETERING</b> 🍽️';
    
    // Validate required fields
    if (isContact) {
      if (!data.ime || !data.telefon || !data.email) {
        return NextResponse.json({ error: 'Ime, telefon i email su obavezni.' }, { status: 400 });
      }
    } else {
      if (!data.ime || !data.telefon || !data.dogadjaj || !data.broj_gostiju) {
        return NextResponse.json({ error: 'Sva polja osim dodatnih informacija su obavezna.' }, { status: 400 });
      }
    }
    
    const message = `
${title}

👤 <b>Ime:</b> ${data.ime || data.name}
📞 <b>Telefon:</b> ${data.telefon || data.phone}
${data.email ? `✉️ <b>Email:</b> ${data.email}` : ''}
${!isContact ? `🎯 <b>Događaj:</b> ${data.dogadjaj || 'Nije navedeno'}` : ''}
${!isContact ? `👥 <b>Broj gostiju:</b> ${data.broj_gostiju || 'Nije navedeno'}` : ''}

📝 <b>Poruka/Napomena:</b>
${data.poruka || data.message || 'Nema dodatne poruke.'}
    `.trim();

    // Send to Telegram using existing bot
    try {
      await sendTelegramNotification(message);
    } catch (telegramError) {
      console.error('Failed to send Telegram notification:', telegramError);
      return NextResponse.json({ error: 'Greška pri slanju obaveštenja' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error saving catering request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
