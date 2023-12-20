const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../service/user.service");
const cors = require("cors");
require("dotenv").config();
router.get("/users", async (req, res) => {
  const users = await userService.getAllUsers();
  res.json({
    code: 200,
    users: users,
    message: "Users data found",
    meta: null,
  });
});
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    data.password = hashedPassword;
    const user = await userService.save(data);
    res.json({
      result: user,
      code: 200,
      meta: null,
    });
  } catch (error) {
    res.json({ code: 500, message: error, meta: null });
  }
});
router.post("/login", async (req, res) => {
  try {
    const data = req.body;
    const userData = await userService.getUserByFilter({ email: data.email });
    if (!userData) {
      res.json({ code: 404, message: "User not found", meta: null });
    }
    const passwordCorrect = await bcrypt.compare(
      data.password,
      userData.password
    );

    if (passwordCorrect) {
      var token = jwt.sign({ email: userData.email }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
    } else {
      res.json({ message: "Incorrect password", code: "401", meta: null });
    }

    userService.updateUser(userData.email, { token: token });
    res.json({
      userdetail: {
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
      token: token,
      code: 200,
      meta: null,
    });
  } catch (error) {
    res.status(500).send();
  }
});
router.get("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const tokenWithoutBearer = token.split(" ")[1];
    const { email } = await jwt.verify(
      tokenWithoutBearer,
      process.env.JWT_SECRET
    );
    await userService.logout(email);
    res.json({
      result: "User Logout Successfully",
      code: 200,
      meta: null,
    });
  } catch (error) {
    res.json({
      message: error,
      code: 500,
      meta: null,
    });
  }
});

module.exports = router;
