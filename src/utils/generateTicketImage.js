import { createCanvas, loadImage } from 'canvas';
import QRCode from 'qrcode';

/**
 * Generates a ticket image with name, event, and QR code.
 * @param {Object} data
 * @param {string} data.userName
 * @param {string} data.eventName
 * @param {string} data.qrcodeURL
 * @returns {Promise<Buffer>} PNG image buffer
 */
export async function generateTicketImage({ userName, eventName, qrcodeURL }) {
  const width = 800;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#1a73e8';
  ctx.fillRect(0, 0, width, height);

  // Ticket white card
  ctx.fillStyle = '#fff';
  ctx.fillRect(40, 40, width - 80, height - 80);

  // Event Title
  ctx.fillStyle = '#1a73e8';
  ctx.font = 'bold 32px Arial';
  ctx.fillText('🎟️ Event Ticket', 60, 100);

  // User and Event Info
  ctx.fillStyle = '#333';
  ctx.font = '24px Arial';
  ctx.fillText(`Name: ${userName}`, 60, 180);
  ctx.fillText(`Event: ${eventName}`, 60, 230);

  ctx.fillStyle = '#888';
  ctx.font = 'italic 18px Arial';
  ctx.fillText('Show this ticket at the entrance.', 60, 280);

  // Generate QR Code Image
  const qrDataURL = await QRCode.toDataURL(qrcodeURL, { margin: 1 });
  const qrImage = await loadImage(qrDataURL);
  ctx.drawImage(qrImage, width - 200, 140, 120, 120); // place it on the right

  return canvas.toBuffer('image/png');
}
