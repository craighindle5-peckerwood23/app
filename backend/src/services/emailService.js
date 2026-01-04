// src/services/emailService.js - Resend Email Service
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender (Resend's testing domain - works without verification)
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'FileSolved <onboarding@resend.dev>';

// Email templates
const templates = {
  orderConfirmation: (order) => ({
    subject: `Order Confirmed - ${order.serviceName} | FileSolved`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 32px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">FileSolved</h1>
                    <p style="margin: 8px 0 0; color: #94a3b8; font-size: 14px;">Turn your proof into power</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 32px;">
                    <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px;">Order Confirmed! ✓</h2>
                    <p style="margin: 0 0 24px; color: #64748b; font-size: 16px; line-height: 1.6;">
                      Thank you for your order, <strong>${order.customerName}</strong>. We've received your request and will begin processing shortly.
                    </p>
                    
                    <!-- Order Details Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 12px; margin-bottom: 24px;">
                      <tr>
                        <td style="padding: 24px;">
                          <h3 style="margin: 0 0 16px; color: #1e293b; font-size: 16px; font-weight: 600;">Order Details</h3>
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Order ID</td>
                              <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-align: right; font-family: monospace;">${order.orderId}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Service</td>
                              <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-align: right;">${order.serviceName}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">File</td>
                              <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-align: right;">${order.fileName}</td>
                            </tr>
                            <tr>
                              <td colspan="2" style="padding-top: 16px; border-top: 1px solid #e2e8f0;"></td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #1e293b; font-size: 16px; font-weight: 600;">Total</td>
                              <td style="padding: 8px 0; color: #2563eb; font-size: 20px; font-weight: bold; text-align: right;">$${order.amount.toFixed(2)}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 0 0 24px; color: #64748b; font-size: 14px; line-height: 1.6;">
                      You'll receive another email once your file has been processed and is ready for download.
                    </p>
                    
                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="https://filesolved.com/orders/${order.orderId}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                            View Order Status
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                      © ${new Date().getFullYear()} FileSolved — Official Documentation & Evidence Platform
                    </p>
                    <p style="margin: 8px 0 0; color: #94a3b8; font-size: 12px;">
                      Not affiliated with FileSolve.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  }),

  paymentReceipt: (order, payment) => ({
    subject: `Payment Receipt - $${order.amount.toFixed(2)} | FileSolved`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 32px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Payment Successful!</h1>
                    <p style="margin: 8px 0 0; color: #d1fae5; font-size: 14px;">Your payment has been processed</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 32px;">
                    <p style="margin: 0 0 24px; color: #64748b; font-size: 16px; line-height: 1.6;">
                      Hi <strong>${order.customerName}</strong>, your payment of <strong>$${order.amount.toFixed(2)}</strong> has been successfully processed.
                    </p>
                    
                    <!-- Receipt Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 12px; border: 1px solid #bbf7d0; margin-bottom: 24px;">
                      <tr>
                        <td style="padding: 24px;">
                          <h3 style="margin: 0 0 16px; color: #166534; font-size: 16px; font-weight: 600;">Receipt Details</h3>
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Transaction ID</td>
                              <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-align: right; font-family: monospace;">${payment.paypalOrderId || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Date</td>
                              <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-align: right;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Service</td>
                              <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-align: right;">${order.serviceName}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Payment Method</td>
                              <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-align: right;">PayPal</td>
                            </tr>
                            <tr>
                              <td colspan="2" style="padding-top: 16px; border-top: 1px solid #bbf7d0;"></td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #166534; font-size: 16px; font-weight: 600;">Amount Paid</td>
                              <td style="padding: 8px 0; color: #166534; font-size: 20px; font-weight: bold; text-align: right;">$${order.amount.toFixed(2)}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 0 0 24px; color: #64748b; font-size: 14px; line-height: 1.6;">
                      We're now processing your file. You'll receive an email when it's ready for download.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                      © ${new Date().getFullYear()} FileSolved — Official Documentation & Evidence Platform
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  }),

  fileReady: (order, downloadUrl) => ({
    subject: `Your File is Ready! - ${order.serviceName} | FileSolved`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 32px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Your File is Ready! 🎉</h1>
                    <p style="margin: 8px 0 0; color: #bfdbfe; font-size: 14px;">Download your processed file</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 32px; text-align: center;">
                    <p style="margin: 0 0 24px; color: #64748b; font-size: 16px; line-height: 1.6;">
                      Great news, <strong>${order.customerName}</strong>! Your <strong>${order.serviceName}</strong> request has been completed.
                    </p>
                    
                    <!-- File Info Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border-radius: 12px; border: 1px solid #bfdbfe; margin-bottom: 24px;">
                      <tr>
                        <td style="padding: 24px; text-align: center;">
                          <div style="width: 64px; height: 64px; background-color: #2563eb; border-radius: 16px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 32px;">📄</span>
                          </div>
                          <p style="margin: 0 0 8px; color: #1e293b; font-size: 16px; font-weight: 600;">${order.fileName}</p>
                          <p style="margin: 0; color: #64748b; font-size: 14px;">Processed and ready for download</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Download Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="${downloadUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-size: 18px; font-weight: 600;">
                            Download File
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 24px 0 0; color: #94a3b8; font-size: 12px;">
                      This download link will expire in 7 days.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                      © ${new Date().getFullYear()} FileSolved — Official Documentation & Evidence Platform
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  })
};

// Send email function
const sendEmail = async (to, templateName, data) => {
  if (!process.env.RESEND_API_KEY) {
    console.log('Resend API key not configured, skipping email');
    return null;
  }

  try {
    const template = templates[templateName](data.order, data.payment || data.downloadUrl);
    
    const result = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [to],
      subject: template.subject,
      html: template.html
    });

    console.log(`Email sent successfully: ${templateName} to ${to}`, result);
    return result;
  } catch (error) {
    console.error(`Failed to send email: ${templateName}`, error);
    throw error;
  }
};

// Export functions
module.exports = {
  sendEmail,
  sendOrderConfirmation: (to, order) => sendEmail(to, 'orderConfirmation', { order }),
  sendPaymentReceipt: (to, order, payment) => sendEmail(to, 'paymentReceipt', { order, payment }),
  sendFileReady: (to, order, downloadUrl) => sendEmail(to, 'fileReady', { order, downloadUrl })
};
