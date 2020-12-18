const User = require("../../models/Users");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  console.log("createUser =>");

  //Check errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(500).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    //Validate user exist
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(500)
        .json({ msn: "Correo en uso, ya existe un usuario con este email" });
    }
    //Create user
    user = new User(req.body);

    //Hashear password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);

    //Save user
    await user.save();

    //Create JWT
    const payload = {
      id: user.id,
    };
    //Sign token
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 3600, // 1 Hour expired token
      },
      (error, token) => {
        if (error) {
          throw error;
        } else {
          res.json({ token });
        }
      }
    );
  } catch (error) {
    console.log("error createUser =>", error);
    res.status(500).json({ msn: "Hubo un error" });
  }
};
