import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'we.designarc@gmail.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?\d{7,15}$/;

export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    phone?: string;
    projectType?: string;
    comments?: string;
    company?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { name, email, phone, projectType, comments, company } = body;

  // Honeypot: a field real visitors never see or fill; bots fill everything.
  if (company) {
    return NextResponse.json({ ok: true });
  }

  if (!name?.trim() || !email?.trim() || !phone?.trim() || !comments?.trim()) {
    return NextResponse.json({ error: 'Please fill in all fields.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  // Deliberately loose: Indian landline/mobile, with or without +91, spaces or
  // dashes. Enough to catch typos without rejecting a real number.
  if (PHONE_RE.test(phone.replace(/[\s-]/g, '')) === false) {
    return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set — cannot send contact form emails.');
    return NextResponse.json(
      { error: 'Something went wrong on our end. Please email us directly.' },
      { status: 500 }
    );
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: 'We Design Architects <onboarding@resend.dev>',
      to: TO_EMAIL,
      replyTo: email,
      subject: `New enquiry — ${projectType?.trim() || 'General'} — ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Project type: ${projectType?.trim() || 'Not specified'}`,
        '',
        comments,
      ].join('\n'),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Something went wrong on our end. Please email us directly.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json(
      { error: 'Something went wrong on our end. Please email us directly.' },
      { status: 500 }
    );
  }
}
