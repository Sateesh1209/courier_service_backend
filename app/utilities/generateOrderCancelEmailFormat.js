function generateOrderCancelEmailFormat ({companyName, companyPhone, customerName}) {
    return `<!DOCTYPE html>
    <html>
    <head>
      <title>Order Cancellation - ${companyName}</title>
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
          <h2>Order Cancellation - ${companyName}</h2>
        </div>
        <div class="content">
          <p>Hello ${customerName},</p>
          <p>We have processed your request, and your order has been successfully canceled. Any associated payment will be refunded as per our refund policy.</p>
          <p>If you have any questions or need further assistance, please contact our customer support team at ${companyPhone}</p>
          <p>We apologize for any inconvenience caused and hope to serve you again in the future.</p>
          <p>Sincerely,</p>
          <p>The ${companyName} Team</p>
        </div>
      </div>
    </body>
    </html>
    `
}

module.exports = {
    generateOrderCancelEmailFormat
}