import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const ContactSchema = z.object({
  name: z.string().min(2, "Name to short"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "To short message"),
  trap: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, trap } = ContactSchema.parse(body);

    if (trap && trap.length > 0) {
      console.log(`Spam bot blocked!`);
      return NextResponse.json({ success: true });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

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

    return NextResponse.json({ success: true });

  } catch (err) {
    // 🟢 Zod validációs hiba kezelése
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }

    // Egyéb szerver hiba (pl. SMTP)
    console.error('SMTP error', err);
    return NextResponse.json({ error: 'SMTP error' }, { status: 500 });
  }
}