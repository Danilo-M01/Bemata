import { NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.ime || !data.telefon || !data.email) {
      return NextResponse.json({ error: 'Ime, telefon i email su obavezni.' }, { status: 400 });
    }

    // Construct the Telegram message
    const message = `
🍽️ <b>NOVI UPIT ZA KETERING</b> 🍽️

👤 <b>Ime:</b> ${data.ime}
📞 <b>Telefon:</b> ${data.telefon}
✉️ <b>Email:</b> ${data.email}
🎯 <b>Događaj:</b> ${data.dogadjaj || 'Nije navedeno'}
👥 <b>Broj gostiju:</b> ${data.broj_gostiju || 'Nije navedeno'}

📝 <b>Poruka/Napomena:</b>
${data.poruka || 'Nema dodatne poruke.'}
    `.trim();

    // Send to Telegram using existing bot
    const success = await sendTelegramNotification(message);

    if (!success) {
      throw new Error('Neuspelo slanje na Telegram.');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ketering API Error:', error);
    return NextResponse.json({ error: 'Došlo je do greške prilikom obrade upita.' }, { status: 500 });
  }
}
