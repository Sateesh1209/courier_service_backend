module.exports = (app) => {
    const CompanyInfo = require("../controllers/companyInfo.controller.js");
    const { authenticateRoute } = require("../authentication/authentication.js");
    var router = require("express").Router();
  
  //   Retrieve all CompanyInfo
    router.get("/companyInfo/", [authenticateRoute], CompanyInfo.findAll);
  
    // Update a CompanyInfo with id
    router.put("/companyInfo/:id", [authenticateRoute], CompanyInfo.update);
  
    app.use("/courierapi", router);
  };
  