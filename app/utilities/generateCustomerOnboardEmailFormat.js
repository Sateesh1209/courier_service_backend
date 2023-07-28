function generateCustomerOnboardEmailFormat ({ companyName, customerName, companyPhone }) {
    return (
        `<!DOCTYPE html>
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
              <p>Hello ${customerName},</p>
              <p>We are thrilled to see you join ${companyName}! As a valued customer, we are committed to providing you with top-notch courier services for all your delivery needs.</p>
              <p>Our dedicated team is ready to ensure your packages reach their destination safely and efficiently. With a wide range of delivery options and excellent customer support, we aim to make your courier experience smooth and hassle-free.</p>
              <p>Thank you for choosing ${companyName}. We look forward to serving you and building a long-lasting partnership.</p>
              <p>If you have any questions or need assistance, feel free to reach out to our friendly support team.</p>
              <p>Once again, welcome aboard!</p>
              <p>For new courier orders, simply call our hotline at ${companyPhone}. Our team will be delighted to assist you in creating a new courier order.</p>
              <p>Sincerely,</p>
              <p>The ${companyName} Team</p>
            </div>
          </div>
        </body>
        </html>
        `
    )
}



module.exports = {
  generateCustomerOnboardEmailFormat
}