const db = require("../models");
const { authenticate } = require("../authentication/authentication");
const Employee = db.employee;
const Session = db.session;
const Op = db.Sequelize.Op;
const { encrypt } = require("../authentication/crypto");

exports.login = async (req, res) => {
  let { userId } = await authenticate(req, res, "credentials");

  if (userId !== undefined) {
    let user = {};
    await Employee.findByPk(userId).then((data) => {
      user = data;
    });
    if (req.body.isAdmin === user.isAdmin) {
      let expireTime = new Date();
      expireTime.setDate(expireTime.getDate() + 1);

      const session = {
        email: user.email,
        userId: userId,
        expirationDate: expireTime,
      };
      await Session.create(session).then(async (data) => {
        let sessionId = data.id;
        let token = await encrypt(sessionId);
        let userInfo = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          id: user.id,
          isAdmin: user.isAdmin,
          token: token,
        };
        res.send(userInfo);
      });
    } else {
      return res.status(401).send({
        message: "Employee not found!",
      });
    }
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
