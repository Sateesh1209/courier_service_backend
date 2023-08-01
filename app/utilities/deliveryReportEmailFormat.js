function deliveryReportEmailFormat({
  companyName,
  orderNumber,
  customerName,
  deliveryAddress,
  deliveryPersonName,
  deliveryStatus,
  deliveryTime,
  bonusAmount,
}) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Order Delivery Report - Admin Notification</title>
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
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h2>Order Delivery Report - Admin Notification</h2>
    </div>
    <div class="content">
      <p>Hello Admin,</p>
      <p>We hope this email finds you well.</p>
      <p>We are pleased to inform you that an order has been successfully delivered.</p>
      <p><strong>Order Details:</strong></p>
      <ul>
        <li><strong>Order Number:</strong> ${orderNumber}</li>
        <li><strong>Customer Name:</strong> ${customerName}</li>
        <li><strong>Delivery Address:</strong> ${deliveryAddress}</li>
      </ul>
      <p><strong>Delivered By:</strong> ${deliveryPersonName}</p>
      <p><strong>Delivery Status:</strong> ${deliveryStatus}</p>
      <p><strong>Delivery Time:</strong> ${deliveryTime}</p>
      <p><strong>Bonus:</strong> ${bonusAmount} (10% Bonus for delivering before time)</p>
      <p>Thank you for your attention to this matter.</p>
      <p>Sincerely,</p>
      <p>The ${companyName} Team</p>
    </div>
  </div>
</body>
</html>
`;
}

module.exports = {
  deliveryReportEmailFormat,
};
