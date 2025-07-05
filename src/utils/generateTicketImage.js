import { createCanvas, loadImage, registerFont } from 'canvas';
import QRCode from 'qrcode';

export async function generateTicketImage({
  userName,
  eventName,
  qrcodeURL,
  eventToken,
  eventPic,
  eventDate,
  eventTime,
  eventLocation
}) {
  const width = 800;
  const height = 500;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#1a73e8';
  ctx.fillRect(0, 0, width, height);

  // Ticket white area
  ctx.fillStyle = '#fff';
  ctx.fillRect(40, 40, width - 80, height - 80);

  const logo = await loadImage('https://yourcdn.com/logo.png'); // Replace with your actual logo URL
  ctx.drawImage(logo, width - 160, 60, 100, 100);

  // Title
  ctx.fillStyle = '#1a73e8';
  ctx.font = 'bold 32px Arial';
  ctx.fillText('🎟️ Event Ticket', 60, 100);

  // Details
  ctx.fillStyle = '#333';
  ctx.font = '22px Arial';
  ctx.fillText(`Name: ${userName}`, 60, 160);
  ctx.fillText(`Event: ${eventName}`, 60, 200);
  ctx.fillText(`Date: ${eventDate}`, 60, 240);
  ctx.fillText(`Time: ${eventTime}`, 60, 280);
  ctx.fillText(`Venue: ${eventLocation}`, 60, 320);
  ctx.fillText(`Token: ${eventToken}`, 60, 360);

  ctx.fillStyle = '#888';
  ctx.font = 'italic 18px Arial';
  ctx.fillText('Show this ticket at the entrance.', 60, 400);

  // QR Code
  const qrDataURL = await QRCode.toDataURL(qrcodeURL, { margin: 1 });
  const qrImage = await loadImage(qrDataURL);
  ctx.drawImage(qrImage, width - 180, 300, 100, 100);

  return canvas.toBuffer('image/png');
}
