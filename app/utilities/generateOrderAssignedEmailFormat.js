function generateOrderAssignedEmailFormat ({companyName, customerName, deliveryAgentName, deliveryAgentPhone }) {
    return  `<!DOCTYPE html>
    <html>
    <head>
      <title>Order Delivery Update - ${companyName}</title>
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
    
        .delivery-details {
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
          <h2>Order Delivery Update - ${companyName}</h2>
        </div>
        <div class="content">
          <p>Hello ${customerName},</p>
          <p>We are delighted to inform you that a dedicated delivery person has been assigned to deliver your order.</p>
          <div class="delivery-details">
            <p><strong>Delivery Details:</strong></p>
            <ul>
              <li><strong>Delivery Person:</strong> ${deliveryAgentName}</li>
              <li><strong>Contact Number:</strong> ${deliveryAgentPhone}</li>
              <!-- Add more delivery person details as needed -->
            </ul>
          </div>
          <p>Your order is on its way, and we will deliver it to your specified address soon.</p>
          <p>If you have any questions or need assistance during the delivery process, please feel free to reach out to the delivery person directly at the provided contact number.</p>
          <p>Thank you for choosing ${companyName}. We hope you have a pleasant delivery experience!</p>
          <p>Sincerely,</p>
          <p>The ${companyName} Team</p>
        </div>
      </div>
    </body>
    </html>
    `
}

module.exports = {
    generateOrderAssignedEmailFormat
}