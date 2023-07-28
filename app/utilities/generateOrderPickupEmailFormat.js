function generateOrderPickupEmailFormat ({companyName, customerName}) {

    return `<!DOCTYPE html>
    <html>
    <head>
      <title>Order Status Update - ${companyName}</title>
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
          <h2>Order Status Update - ${companyName}</h2>
        </div>
        <div class="content">
          <p>Hello ${customerName},</p>
          <p>We are thrilled to share the latest update on your order.</p>
          <p>Your order has been picked up by our dedicated delivery person and is now on its way to reach you soon.</p>
         
          <p>Sincerely,</p>
          <p>The ${companyName} Team</p>
        </div>
      </div>
    </body>
    </html>
    `
}

module.exports = {
    generateOrderPickupEmailFormat
}