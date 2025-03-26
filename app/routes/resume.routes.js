const { authJwt } = require("../middleware");
const controller = require("../controllers/resume.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/resume", [authJwt.verifyToken], controller.postResume);
  app.put("/api/resume", [authJwt.verifyToken], controller.updateResume);
  app.get("/api/resume", [authJwt.verifyToken], controller.getResumesByUser);
};
