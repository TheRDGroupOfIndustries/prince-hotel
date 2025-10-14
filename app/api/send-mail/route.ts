
import nodemailer from "nodemailer";

type Guest = {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      roomName,
      plan,
      checkIn,
      checkOut,
      nights,
      guests,
      totalAmount,
      currency,
    }: {
      name: string;
      email: string;
      roomName: string;
      plan: string;
      checkIn: string;
      checkOut: string;
      nights: number;
      guests: Guest[];
      totalAmount: number;
      currency: string;
    } = await req.json();

    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const guestList = guests
      .map(
        (g) =>
          `<li>${g.title} ${g.firstName} ${g.lastName} (${g.email}${
            g.phone ? `, ${g.phone}` : ""
          })</li>`
      )
      .join("");

    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #007bff;">Booking Confirmation</h2>
        <p>Dear ${name},</p>
        <p>Thank you for booking with <strong>Hotel Prince Diamond Varanasi</strong>.</p>

        <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin-top: 12px;">
          <p><strong>Room:</strong> ${roomName}</p>
          <p><strong>Plan:</strong> ${plan}</p>
          <p><strong>Check-In:</strong> ${new Date(checkIn).toLocaleDateString()}</p>
          <p><strong>Check-Out:</strong> ${new Date(checkOut).toLocaleDateString()}</p>
          <p><strong>Nights:</strong> ${nights}</p>
          <p><strong>Total Amount:</strong> ${currency} ${totalAmount}</p>
        </div>

        <h4 style="margin-top: 20px;">Guest Details:</h4>
        <ul>${guestList}</ul>

        <p>We look forward to hosting you soon!</p>

        <p style="margin-top: 24px;">
          Warm regards,<br/>
          <strong>Hotel Prince Diamond</strong>
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Hotel Prince Diamond" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Booking Confirmation - ${roomName}`,
      html,
    });

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Email send error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to send email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
