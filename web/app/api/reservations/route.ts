import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { sendTelegramNotification } from '@/lib/telegram';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const id = searchParams.get('id');

    // Check auth status
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin_token')?.value === 'bemata_admin_secret';

    // If public is checking a specific ID
    if (id && !isAdmin) {
      const { data, error } = await supabase
        .from('reservations')
        .select('name, date, time, status')
        .eq('id', id)
        .single();
      
      if (error || !data) {
        return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
      }
      return NextResponse.json(data);
    }

    // Build Supabase query
    let query = supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    // Public map should only see reservations that are NOT cancelled
    if (!isAdmin) {
      query = query.neq('status', 'cancelled');
    }

    if (date) {
      query = query.eq('date', date);
    }

    const { data: reservations, error } = await query;

    if (error) {
      throw error;
    }

    // If not admin, ONLY return a list of booked table IDs (for availability checking)
    if (!isAdmin) {
      const bookedTables = reservations?.map((r: any) => r.tableId).filter(Boolean) || [];
      return NextResponse.json(bookedTables);
    }

    // Admin gets full data
    return NextResponse.json(reservations || []);
  } catch (error) {
    console.error('Error reading reservations from Supabase:', error);
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.phone || !body.date || !body.time || !body.guests) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Availability Check: If a table is selected, verify it's not already booked for that date
    if (body.tableId) {
      const { data: existingReservations, error: checkError } = await supabase
        .from('reservations')
        .select('id')
        .eq('date', body.date)
        .eq('tableId', body.tableId)
        .neq('status', 'cancelled');

      if (checkError) {
        throw checkError;
      }

      if (existingReservations && existingReservations.length > 0) {
        return NextResponse.json({ error: 'Žao nam je, ovaj sto je već rezervisan za izabrani datum.' }, { status: 409 });
      }
    }

    // Create new reservation in Supabase
    const { data: newReservation, error: insertError } = await supabase
      .from('reservations')
      .insert([
        {
          name: body.name,
          phone: body.phone,
          date: body.date,
          time: body.time,
          guests: body.guests,
          tableId: body.tableId || null,
          diet: body.diet || null,
          note: body.note || null,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Send Telegram Notification
    try {
      const adminLink = 'http://localhost:3000/admin/rezervacije'; // In production this would be the real domain
      const message = `
⏳ <b>Imate novu rezervaciju, čeka na potvrdu</b>
━━━━━━━━━━━━━━━━━━

👤 <b>Ime:</b> ${body.name}
📞 <b>Telefon:</b> ${body.phone}
📅 <b>Datum:</b> ${body.date} u ${body.time}
👥 <b>Gosti:</b> ${body.guests}
🪑 <b>Sto:</b> ${body.tableId || 'Nije izabran'}
🥦 <b>Ishrana:</b> ${body.diet || 'Sve'}
📝 <b>Napomena:</b> ${body.note || '/'}

👉 <a href="${adminLink}">KLIKNI OVDE DA POTVRDIŠ</a>
`;
      await sendTelegramNotification(message);
    } catch (telegramError) {
      console.error('Failed to send Telegram notification (reservation was still saved):', telegramError);
    }

    return NextResponse.json({ success: true, reservation: newReservation }, { status: 201 });
  } catch (error) {
    console.error('Error saving reservation to Supabase:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    // Check admin auth
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin_token')?.value === 'bemata_admin_secret';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, reservation: data });
  } catch (error) {
    console.error('Error updating reservation status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
