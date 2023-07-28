function generateEmployeeTerminationEmailFormat ({companyName, employeeName, companyPhone}) {

    return `<!DOCTYPE html>
    <html>
    <head>
      <title>Email Access Disabled - ${companyName}</title>
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
          <h2>Email Access Disabled - ${companyName}</h2>
        </div>
        <div class="content">
          <p>Hello ${employeeName},</p>
          <p>We hope this email finds you well.</p>
          <p>Effective immediately, we want to inform you that your email access at ${companyName} has been disabled due to your termination/resignation from the company.</p>
          <p>Please note that you will no longer have access to your company email account and any associated resources.</p>
          <p>Additionally, please ensure to return any company-owned equipment or property you may have in your possession.</p>
          <p>If you have any questions or need further information, please reach out to Admin at ${companyPhone}.</p>
          <p>Thank you for your contributions during your time with us, and we wish you the best in your future endeavors.</p>
          <p>Sincerely,</p>
          <p>The ${companyName} Team</p>
        </div>
      </div>
    </body>
    </html>
    `
}

module.exports = {
    generateEmployeeTerminationEmailFormat
  }