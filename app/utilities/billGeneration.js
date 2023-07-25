const db = require("../models");
var cron = require("node-cron");
var nodemailer = require("nodemailer");
const { jsPDF } = require("jspdf");
require("jspdf-autotable");
const fs = require("fs");
const { generateBillEmailFormat } = require("./generateBillEmailFormat");
const Company = db.companyInfo;
const Customer = db.customers;
const scheduleRef = {};
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shvdjtravel@gmail.com",
    pass: "avielwexphutyczr",
  },
});
let isTaskRunning = false;

// Function to generate the PDF bill
function generatePDF(customer, orders, company) {
  const doc = new jsPDF();

  const companyName = company?.name;

  // Calculate the total fare
  const totalFare = orders.reduce(
    (total, order) => total + parseFloat(order.totalPrice),
    0
  );

  // Footer company details
  const companyDetails = `${company?.name} | Address: ${company?.avenue}, ${company.street}, ${company?.block}`;

  // Title and layout customization
  doc.setFontSize(16);
  doc.text("Monthly Courier Bill", 105, 30, { align: "center" });

  // Print company name
  // doc.setFont("times", "normal");
  doc.setFontSize(24); // Larger font size for company name
  doc.setTextColor("#2a87d3"); // Blue text color for company name
  doc.text(companyName, 105, 20, { align: "center" });

  // doc.setFont("Roboto", "normal");
  // Customer details section
  doc.setFontSize(16);
  doc.setTextColor("#111");

  doc.text("Customer Details", 15, 45);

  doc.setFontSize(12);
  doc.setTextColor("#444");
  // Print customer details side by side
  doc.text(`Name: ${customer.name}`, 15, 55);
  doc.text(`Phone: ${customer.phone}`, 125, 55);
  doc.text(`Email: ${customer.email}`, 15, 60);
  doc.text(`Address: ${customer.address}`, 125, 60);
  // Orders history table
  const tableHeaders = [
    "Order ID",
    "Receiver",
    "Pickup",
    "Drop",
    "Status",
    "Quoted Price",
    "Total Price",
  ];
  const tableData = orders.map((order) => [
    order.id,
    order.receiverDetails.firstName + " " + order.receiverDetails.lastName,
    order.pickupPoint.split("/")[1],
    order.dropoffPoint.split("/")[1],
    order.status.statusName,
    order.quotedPrice,
    order.totalPrice,
  ]);
  tableData.push([
    "",
    "",
    "",
    "",
    "",
    "Bill Amount:",
    `$${totalFare.toFixed(2)}`,
  ]);

  doc.autoTable({
    head: [tableHeaders],
    body: tableData,
    startY: 70,
    styles: {
      fontSize: 10,
      cellPadding: 5,
      valign: "middle",
      halign: "center",
      textColor: "#444", // Darker text color for better visibility
      fillColor: "#f2f2f2", // Light gray background color for the header row
    },
    headStyles: {
      fontSize: 8,
      textColor: "#fff", // White text color for header cells
      fillColor: "#2a87d3", // Blue background color for the header cells
    },
  });
  // Footer company details
  doc.setFontSize(10);
  doc.text(companyDetails, 105, doc.internal.pageSize.height - 20, {
    align: "center",
  });

  // Save the PDF as a data URI
  const pdfDataUri = doc.output("datauristring");

  // Return the PDF data URI
  return pdfDataUri;
}

const triggerRunBillGeneration = async (schedule) => {
  Company.findOne({
    attributes: ["billingExpression"],
  })
    .then(async (data) => {
      const billingCycle = data?.billingExpression;
      console.log("billing Cycle", data);
      if (scheduleRef.billGeneration && isTaskRunning) {
        scheduleRef.billGeneration.stop();
        console.log("Previous schedule is stopped");
      }
      if (schedule) {
        scheduleRef.billGeneration = cron.schedule(billingCycle, async () => {
          // Generate the PDF
          try {
            await generatePDFAndSendEmail();
          } catch (e) {
            console.log("Error occured", e);
          }
        });
        isTaskRunning = true;
      } else {
        try {
          await generatePDFAndSendEmail();
        } catch (e) {
          console.log("Error occured", e);
        }
      }
    })
    .catch((e) => {
      console.log("billing Cycle", e);
    });
};

const generatePDFAndSendEmail = async () => {
  const customerWithOrders = await Customer.findAll({
    where: { isActive: true },
    include: {
      model: db.order,
      as: "sentOrders",
      where: {
        statusId: [4, 5, 7],
      },
      include: [
        {
          model: db.customers,
          as: "receiverDetails",
        },
        {
          model: db.status,
          as: "status",
        },
      ],
    },
  });
  const company = await Company.findOne({
    where: {
      id: 1,
    },
  });
  customerWithOrders?.map(async (customer) => {
    const ordersMadeByCustomer = customer?.sentOrders;
    const filterByLastBillGenerated = company.lastBillGenerated
      ? ordersMadeByCustomer.filter(
          (order) => new Date(order.lastStatusUpdate) > new Date(company.lastBillGenerated)
        )
      : ordersMadeByCustomer;
    if (filterByLastBillGenerated?.length > 0) {
      const customerDetails = {
        name: customer?.firstName + " " + customer?.lastName,
        phone: customer?.phone,
        email: customer?.email,
        address:
          customer?.avenue + " " + customer?.street + " " + customer?.block,
      };

      const pdfDataUri = generatePDF(
        customerDetails,
        ordersMadeByCustomer,
        company
      );
      const customerName = customer?.firstName + " " + customer?.lastName;
      transporter.sendMail(
        {
          from: "shvdjtravel@gmail.com",
          to: customer?.email,
          subject: "Important: Download Your Latest Billing Statement",
          html: generateBillEmailFormat(customerName, company?.name),
          attachments: [
            {
              filename: "monthly_courier_bill.pdf",
              content: pdfDataUri.split(";base64,").pop(), // Extract base64 data from the data URI
              encoding: "base64",
            },
          ],
        },
        async function (error, info) {
          if (error) {
            console.log(error);
          } else {
            await Company.update(
              { lastBillGenerated: db.Sequelize.literal("CURRENT_TIMESTAMP") },
              { where: { id: 1 } }
            );
            console.log("Email sent: " + info.response);
          }
        }
      );
      console.log("Triggered");
    }
  });
};
module.exports = { triggerRunBillGeneration, scheduleRef };
