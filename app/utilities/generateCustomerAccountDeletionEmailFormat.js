function generateCustomerAccountDeletionEmailFormat ({companyName, companyPhone, customerName}) {

    return `<!DOCTYPE html>
    <html>
    <head>
      <title>Account Deletion - ${companyName}</title>
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
          <h2>Account Deletion - ${companyName}</h2>
        </div>
        <div class="content">
          <p>Hello ${customerName},</p>
          <p>We hope this email finds you well.</p>
          <p>We are sorry to see you go and to inform you that your account with ${companyName} has been deleted as per your request.</p>
          <p>If you ever wish to rejoin our courier service in the future, please know that you are always welcome back. Simply give us a call at ${companyPhone}, and we will be delighted to assist you in creating a new account.</p>
          <p>If there's anything we can do to improve our services, please feel free to share your feedback with us.</p>
          <p>Thank you for choosing ${companyName}. We appreciate the opportunity to have served you.</p>
          <p>Wishing you all the best in your future endeavors!</p>
          <p>Sincerely,</p>
          <p>The ${companyName} Team</p>
        </div>
      </div>
    </body>
    </html>
    `
}

module.exports = {
    generateCustomerAccountDeletionEmailFormat
  }