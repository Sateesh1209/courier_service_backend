var nodemailer = require("nodemailer");
const db = require("../models");
const {
  generateEmployeeOnboardingEmailFormat,
} = require("./generateEmployeeOnboardingEmailFormat");
const { generateCustomerOnboardEmailFormat } = require("./generateCustomerOnboardEmailFormat");
const { generateEmployeeTerminationEmailFormat } = require("./generateEmployeeTerminationEmailFormat");
const { generateCustomerAccountDeletionEmailFormat } = require("./generateCustomerAccountDeletionEmailFormat");
const { generateOrderAssignedEmailFormat } = require("./generateOrderAssignedEmailFormat");
const { generateOrderPickupEmailFormat } = require("./generateOrderPickupEmailFormat");
const { generateOrderCancelEmailFormat } = require("./generateOrderCancelEmailFormat");
const { generateOrderDeliveredEmailFormat } = require("./generateOrderDeliveredEmailFormat");
const { generateOrderDelayEmailFormat } = require("./generateOrderDelayEmailFormat");
const { generateOrderRejectedEmailFormat } = require("./generateOrderRejectedEmailFormat");
const { generateOrderConfirmationEmailFormat } = require("./generateOrderConfirmationEmailFormat");
const Company = db.companyInfo;

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shvdjtravel@gmail.com",
    pass: "avielwexphutyczr",
  },
});

exports.sendMail = async (receivers, subject, content, payload) => {
  const mailSettings = await generateEmailTemplate(
    receivers,
    subject,
    content,
    payload
  );
  transporter.sendMail(mailSettings, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const generateEmailTemplate = async (receivers, subject, content, payload) => {
  const company = await Company.findOne({
    where: {
      id: 1,
    },
  });
  const companyName = company?.name
  const companyPhone = company?.phone
  const html = htmlCollect[content]({...payload, companyName: companyName, companyPhone: companyPhone});
  return {
    from: "shvdjtravel@gmail.com",
    to: receivers,
    subject: subject,
    html: html,
  };
};

const htmlCollect = {
  customerOnBoard: (payload) => generateCustomerOnboardEmailFormat(payload),
  customerAccountDeletion: (payload) => generateCustomerAccountDeletionEmailFormat(payload),
  employeeOnBoard: (payload) => generateEmployeeOnboardingEmailFormat(payload),
  employeeTermination: (payload) => generateEmployeeTerminationEmailFormat(payload),
  orderConfirmation: (payload) => generateOrderConfirmationEmailFormat(payload),
  orderAssigned: (payload) => generateOrderAssignedEmailFormat(payload),
  orderPickup: (payload) => generateOrderPickupEmailFormat(payload),
  orderCancel: (payload) => generateOrderCancelEmailFormat(payload),
  orderDelivered: (payload) => generateOrderDeliveredEmailFormat(payload),
  orderDelay: (payload) => generateOrderDelayEmailFormat(payload),
  orderReject: (payload) => generateOrderRejectedEmailFormat(payload),
  deliveryReport: (payload) => deliveryReportEmailFormat(payload)
};
