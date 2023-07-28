function generateEmployeeOnboardingEmailFormat ({companyName, position, employeeName, userName, password}) {
    return `<!DOCTYPE html>
    <html>
    <head>
      <title>Welcome to ${companyName}</title>
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
          <h2>Welcome to ${companyName}</h2>
        </div>
        <div class="content">
          <p>Hello ${employeeName},</p>
          <p>Congratulations on your successful selection for the position of ${position} at ${companyName}. We are thrilled to have you onboard as a valuable addition to our team.</p>
          </ul>
          <p>Your credentials for accessing company resources are provided below:</p>
          <ul>
            <li><strong>Username:</strong> ${userName}</li>
            <li><strong>Password:</strong> ${password}</li>
    
          </ul>
          <p>We believe that your skills and experience will make a significant contribution to the success of ${companyName}. If you have any questions or need assistance during the onboarding process, feel free to reach out to the HR team or your manager.</p>
          <p>We look forward to embarking on this journey together and wish you a successful and fulfilling career at ${companyName}.</p>
          <p>Once again, welcome aboard!</p>
          <p>Sincerely,</p>
          <p>The ${companyName} Team</p>
        </div>
      </div>
    </body>
    </html>
    `
}

module.exports = {
    generateEmployeeOnboardingEmailFormat
  }