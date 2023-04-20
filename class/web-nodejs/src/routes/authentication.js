const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("../lib/auth");
const { encryptPassword, matchPassword } = require("../lib/helpers");

const pool = require("../database");

router.get("/signin", isNotLoggedIn, (req, res) => {
  res.render("auth/signin");
});

router.post("/signin", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local.signin", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
    failureFlash: true,
  })(req, res, next);
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile");
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logOut();
  res.redirect("/signin");
});

router.post("/change-password", isLoggedIn, async (req, res) => {
  const { newPassword, repeatPassword } = req.body;
  if (newPassword !== repeatPassword) {
    req.flash("message", "Las contraseñas no coinciden");
    res.redirect("/profile");
  } else {
    const newUser = {
      password: await encryptPassword(newPassword),
    };
    await pool.query("UPDATE user set ? WHERE id = ?", [newUser, req.user.id]);
    req.flash("success", "Contraseña actualizada correctamente");
    res.redirect("/profile");
  }
});

router.get("/signup", isNotLoggedIn, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", isNotLoggedIn, async (req, res, next) => {
  const { username, password, repeatPassword } = req.body;
  if (password !== repeatPassword) {
    req.flash("message", "Las contraseñas no coinciden");
    res.redirect("/signup");
  } else {
    const newUser = {
      username: username,
      password: await encryptPassword(password),
    };
    await pool.query("INSERT INTO user SET ?", [newUser]);
    req.flash("success", "Usuario registrado correctamente");
    res.redirect("/signin");
  }
});

module.exports = router;
