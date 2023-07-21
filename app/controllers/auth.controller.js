const db = require("../models");
const { authenticate } = require("../authentication/authentication");
const Employee = db.employee;
const Session = db.session;
const Op = db.Sequelize.Op;
const { encrypt } = require("../authentication/crypto");

exports.login = async (req, res) => {
  let { userId } = await authenticate(req, res, "credentials");
  try {
    if (userId !== undefined) {
      let user = {};
      await Employee.findByPk(userId).then((data) => {
        user = data;
      });
      let expireTime = new Date();
      expireTime.setDate(expireTime.getDate() + 1);

      const session = {
        email: user.email,
        employeeEmpId: userId,
        expirationDate: expireTime,
      };
      const roleName = await db.roles.findByPk(user.roleId);
      await Session.create(session).then(async (data) => {
        let sessionId = data.id;
        let token = await encrypt(sessionId);
        let companyInfo = await db.companyInfo.findOne();
        let userInfo = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roleId: user.roleId,
          roleName: roleName.roleName,
          token: token,
          companyInfo: companyInfo,
        };
        res.send({
          status: "Success",
          message: "Logged in successfully",
          data: userInfo,
        });
      });
    }
  } catch (e) {
    return res.status(401).send({
      status: "Failed",
      message: "Employee not found!",
      data: null,
    });
  }
};

exports.logout = async (req, res) => {
  let auth = req.get("authorization");
  console.log(auth);
  if (
    auth != null &&
    auth.startsWith("Bearer ") &&
    (typeof require !== "string" || require === "token")
  ) {
    let token = auth.slice(7);
    let sessionId = await decrypt(token);
    if (sessionId == null) return;
    return await Session.destroy({ where: { id: sessionId } }).catch(
      (error) => {
        console.log(error);
      }
    );
  }
};
