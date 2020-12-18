const User = require("../../models/Users");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.authUser = async (req, res) => {
  //Check errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    //User register email

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msn: "Usuario inexistente!" });
    }

    //Check password
    const passwordCorrect = await bcryptjs.compare(password, user.password);
    if (!passwordCorrect) {
      return res.status(400).json({ msn: "Password incorrecto" });
    }

    //Sign successfully
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
    console.log("error authUser =>", error);
    res.status(500).json({ msn: "Hubo un error" });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    res.json({ user });
  } catch (error) {
    console.log("error login =>", error);
    res.status(500).json({ msn: "Hubo un error" });
  }
};
