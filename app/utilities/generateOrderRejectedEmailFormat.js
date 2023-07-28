function generateOrderRejectedEmailFormat ({companyName, customerName, companyPhone}) {
    return `<!DOCTYPE html>
    <html>
    <head>
      <title>Order Rejection - ${companyName}</title>
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
          <h2>Order Rejection - ${companyName}</h2>
        </div>
        <div class="content">
          <p>Hello ${customerName},</p>
          <p>The receiver has declined to accept the delivery for the specified order.</p>
          <p>If you believe this is a mistake or have any questions regarding the rejection, please don't hesitate to contact our customer support team at ${companyPhone}. We are here to assist you in resolving any concerns.</p>
          <p>We apologize for any inconvenience this may have caused and assure you that we'll handle the situation promptly.</p>
          <p>If you wish to place a new order or need any further assistance, please don't hesitate to reach out.</p>
          <p>Thank you for choosing ${companyName}, and we hope to have the opportunity to serve you better in the future.</p>
          <p>Sincerely,</p>
          <p>The ${companyName} Team</p>
        </div>
      </div>
    </body>
    </html>
    `
}

module.exports = {
    generateOrderRejectedEmailFormat
}