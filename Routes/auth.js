const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');


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
    console.log(user)
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
    res.send(user)
  }
  catch (error) {
    res.status(500).send("There is some error.")
  }

})

module.exports = router;