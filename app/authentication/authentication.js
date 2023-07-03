const db = require("../models");
const { hashPassword } = require("./crypto");
const Session = db.session;
const Employee = db.employee;

/**
 * Gets the authentication for this request. Throws an error if there is an authentcation problem.
 * If require is false, makes authentication optional.
 * If require is a string, enforces a specific type of authentication (credentials or token).
 * @return {{type: string, userId: string}}
 */
authenticate = async (req, res, require = true) => {
  let auth = req.get("authorization");
  console.log(auth);
  if (auth != null) {
    if (
      auth.startsWith("Basic ") &&
      (typeof require !== "string" || require === "credentials")
    ) {
      let credentials = auth.slice(6);
      credentials = Buffer.from(credentials, "base64").toString("utf8");
      let i = credentials.indexOf(":");
      let email = credentials.slice(0, i);
      let password = credentials.slice(i + 1);
      let user = {};
      await Employee.findAll({ where: { email: email } })
        .then((data) => {
          user = data[0];
        })
        .catch((error) => {
          console.log(error);
        });
      if (user != null) {
        let hash = await hashPassword(password, user.salt);
        if (Buffer.compare(user.password, hash) !== 0) {
          return res.status(401).send({
            status: "Failure",
            message: "Invalid password!",
            data: null,
          });
        }
        return {
          type: "credentials",
          userId: user.empId,
        };
      } else {
        return res.status(401).send({
          status: "Failure",
          message: "Employee not found!",
          data: null,
        });
      }
    }
    if (
      auth.startsWith("Bearer ") &&
      (typeof require !== "string" || require === "token")
    ) {
      let token = auth.slice(7);
      let sessionId = await decrypt(token);
      let session = {};
      await Session.findAll({ where: { id: sessionId } })
        .then((data) => {
          session = data[0];
        })
        .catch((error) => {
          console.log(error);
        });
      if (session != null) {
        if (session.expirationDate >= Date.now()) {
          return {
            type: "token",
            userId: session.userId,
            sessionId: session.id,
          };
        } else {
          return res.status(401).send({
            status: "Failure",
            message: "Session has expired.",
            data: null,
          });
        }
      } else {
        return res.status(401).send({
          status: "Failure",
          message: "Invalid session",
          data: null,
        });
      }
    }
  }
  if (require) {
    return res.status(401).send({
      status: "Failure",
      message: "Authentication required",
      data: null,
    });
  }
  return { type: "none", userId: null };
};

authenticateRoute = async (req, res, next) => {
  let auth = req.get("authorization");
  console.log(auth);
  if (auth != null) {
    if (
      auth.startsWith("Bearer ") &&
      (typeof require !== "string" || require === "token")
    ) {
      let token = auth.slice(7);
      let sessionId = await decrypt(token);
      let session = {};
      await Session.findAll({ where: { id: sessionId } })
        .then((data) => {
          session = data[0];
        })
        .catch((error) => {
          console.log(error);
        });
      if (session != null) {
        console.log(session >= Date.now());
        console.log(Date.now());
        if (session.expirationDate >= Date.now()) {
          next();
          return;
        } else {
          return res.status(401).send({
            status: "Failure",
            message: "Unauthorized! Expired Token, Logout and Login again",
            data: null,
          });
        }
      } else {
        return res.status(401).send({
          status: "Failure",
          message: "Unauthorized! Expired Token, Logout and Login again",
          data: null,
        });
      }
    }
  } else {
    return res.status(401).send({
      status: "Failure",
      message: "Unauthorized! No Auth Header",
      data: null,
    });
  }
};

const auth = {
  authenticate: authenticate,
  authenticateRoute: authenticateRoute,
};

module.exports = auth;
