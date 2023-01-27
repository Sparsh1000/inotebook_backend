const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = "$parshAgrawalHere";

//ROUTE 1:create a user
router.post('/createuser', [
  body('email', 'Enter valid Email').isEmail(),
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('password', 'Password must be 5 characters long').isLength({ min: 5 }),

], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let user = await User.findOne({ email: req.body.email })
    // console.log(user)
    if (user) {
      return res.status(400).json({ error: "Enter a unique email address" })
    }
    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    })

    // .then(user => res.json(user)).catch(err => {
    //   console.log(err)
    //   res.json("Enter unique values")
    // })
    // res.send(user)
    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    res.send({ authToken });

  }
  catch (error) {
    res.status(500).send("There is some error.")
  }

})

//ROUTE 2 : Authenticate the user
router.post('/login', [
  body('email', 'Enter valid Email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }
    const passwCompare = await bcrypt.compare(password, user.password);
    if (!passwCompare) {
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    res.send({ authToken });
  }

  catch (error) {
    res.status(500).send("There is internal server error.");
  }
})
//ROUTE 3 : Get logined user details

router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    res.status(500).send("There is internal server error.");
  }

})

module.exports = router;