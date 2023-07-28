function generateOrderDeliveredEmailFormat ({companyName, customerName, companyPhone}) {
    return `<!DOCTYPE html>
    <html>
    <head>
      <title>Order Delivery Confirmation - ${companyName}</title>
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
          <h2>Order Delivery Confirmation - ${companyName}</h2>
        </div>
        <div class="content">
          <p>Hello ${customerName},</p>
          <p>We are excited to share the great news with you!</p>
          <p>Your order has been successfully delivered</p>
          <p>We trust that your package has reached you in perfect condition and that you are satisfied with our service.</p>
          <p>If you have any feedback or need any further assistance, please do not hesitate to contact our customer support team at ${companyPhone}. We value your input and are always here to assist you.</p>
          <p>Thank you for choosing ${companyName}. It was a pleasure serving you, and we hope to have the opportunity to do so again in the future.</p>
          <p>Sincerely,</p>
          <p>The ${companyName} Team</p>
        </div>
      </div>
    </body>
    </html>
    `
}

module.exports = {
    generateOrderDeliveredEmailFormat
}