function generateBillEmailFormat (customerName, companyName) {
    return `<!DOCTYPE html>
    <html>
    <head>
      <title>Your Billing Statement</title>
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
          <h2>Your Billing Statement</h2>
        </div>
        <div class="content">
          <p>Hello ${customerName},</p>
          <p>Your billing statement for the last billing cycle has been generated. Please find the attached PDF for detailed information.</p>
          <p>If you have any questions or concerns regarding the billing statement, please don't hesitate to contact us.</p>
          <p>Thank you for choosing our courier services!</p>
          <p>Sincerely,</p>
          <p>The ${companyName} Team</p>
     
        </div>
      </div>
    </body>
    </html>
    `
}


module.exports = {
    generateBillEmailFormat
  }