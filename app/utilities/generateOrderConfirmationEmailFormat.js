function generateOrderConfirmationEmailFormat ({companyName, companyPhone, customerName}) {
    return `<!DOCTYPE html>
    <html>
    <head>
      <title>Order Confirmation - ${companyName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
    
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
        }
    
        .header {
          background-color: #f2f2f2;
          padding: 10px;
          text-align: center;
        }
    
        .content {
          padding: 20px;
        }
    
        .order-details {
          border: 1px solid #ccc;
          padding: 10px;
          margin-bottom: 10px;
        }
    
        .button {
          display: inline-block;
          background-color: #007bff;
          color: #fff;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h2>Order Confirmation - ${companyName}</h2>
        </div>
        <div class="content">
          <p>Hello ${customerName},</p>
          <p>We are excited to confirm that your order has been successfully placed with ${companyName}.</p>
     
          <p>Your package is in safe hands, and we'll ensure a timely and secure delivery to the destination.</p>
          <p>If you have any questions or need to make any changes to your order, please contact our customer support team at ${companyPhone}.</p>
          <p>Thank you for choosing ${companyName}. We look forward to serving you with excellence!</p>
          <p>Sincerely,</p>
          <p>The ${companyName} Team</p>
        </div>
      </div>
    </body>
    </html>
    `
}


module.exports = {
    generateOrderConfirmationEmailFormat
  }