// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

  if (!name || !email) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // SMTP konfiguráció
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER, // a bejelentkezett Gmail-címed
      replyTo: email, // ide érkezik a válasz, ha válaszolnak
      to: process.env.CONTACT_EMAIL, // hová küldöd a levelet
      subject: `Új üzenet: ${name}`,
      text: `Név: ${name}\nEmail: ${email}\n\nÜzenet:\n${message}`,
      html: `
        <p><strong>Név:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Üzenet:</strong><br/>${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('SMTP error', err);
    return NextResponse.json({ error: 'SMTP error' }, { status: 500 });
  }
}
