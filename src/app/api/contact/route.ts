import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Az űrlap mezőinek validációs sémája
const ContactSchema = z.object({
  // Név mező legalább 2 karakterrel
  name: z.string().min(2, "Name to short"),
  // Érvényes e-mail cím
  email: z.string().email("Invalid email"),
  // Üzenet mező legalább 10 karakterrel
  message: z.string().min(10, "To short message"),
  // Honey pot mező opcionális robotok kiszűrésére
  trap: z.string().optional(),
});

// POST endpoint a kapcsolatfelvételi űrlap beküldéséhez
export async function POST(request: Request) {
  try {
    // A kérés törzsének JSON-ként történő beolvasása
    const body = await request.json();
    // A bejövő adatok validálása a sémával
    const { name, email, message, trap } = ContactSchema.parse(body);

    // Ha a honeypot mező ki van töltve, spamnek minősítjük és sikerrel térünk vissza
    if (trap && trap.length > 0) {
      console.log(`Spam bot blocked!`);
      return NextResponse.json({ success: true });
    }

    // SMTP kapcsolat létrehozása a környezeti változókból
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    // E-mail küldése a beérkezett adatokkal
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      replyTo: email,
      to: process.env.CONTACT_EMAIL,
      subject: `Új üzenet: ${name}`,
      text: `Név: ${name}\nEmail: ${email}\n\nÜzenet:\n${message}`,
      html: `
        <p><strong>Név:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Üzenet:</strong><br/>${message}</p>
      `,
    });

    // Sikeres küldés esetén visszajelzés
    return NextResponse.json({ success: true });

  } catch (err) {
    //Zod validációs hiba kezelése
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }

    // Egyéb szerver hiba 
    console.error('SMTP error', err);
    return NextResponse.json({ error: 'SMTP error' }, { status: 500 });
  }
}