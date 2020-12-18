const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");
const { check } = require("express-validator");

//Create users
//ENDPOINT=api/users

router.post(
  "/",

  //Validation data
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "Agrega un email validado").isEmail(),
    check("password", "El password debe ser de minimo 6 caracteres").isLength({
      min: 6,
    }),
    check("moderator", "El moderator es obligatorio").not().isEmpty(),
  ],

  usersController.createUser
);

module.exports = router;
