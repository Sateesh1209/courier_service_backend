function generateOrderDelayEmailFormat ({companyName, companyPhone, customerName}) {
    return `<!DOCTYPE html>
    <html>
    <head>
      <title>Order Delay Notification - ${companyName}</title>
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
          <h2>Order Delay Notification - ${companyName}</h2>
        </div>
        <div class="content">
          <p>Hello ${customerName},</p>
          <p>We regret to inform you that there has been a delay in the delivery of your order.</p>
          <p>The delay is due to unforeseen circumstances beyond our control, and we sincerely apologize for any inconvenience this may cause you.</p>
          <p>Rest assured, our team is working diligently to expedite the delivery, and we expect your order to be delivered as soon as possible.</p>
          <p>If you have any questions or concerns regarding your order, please feel free to contact our customer support team at ${companyPhone}</p>
          <p>We value your business and appreciate your understanding during this time. Thank you for choosing ${companyName}.</p>
          <p>Sincerely,</p>
          <p>The ${companyName} Team</p>
        </div>
      </div>
    </body>
    </html>
    `
}

module.exports = {
    generateOrderDelayEmailFormat
}