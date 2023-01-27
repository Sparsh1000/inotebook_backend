var jwt = require('jsonwebtoken');

const JWT_SECRET = "$parshAgrawalHere";

const fetchuser = (req, res, next) => {
  //get user from the jwt token and add user id to the req object
  const token = req.header('auth-token');
  if (!token) {
    res.status(401).send({ error: "Please send authentic token" })
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please send authentic token" })
  }

}
module.exports = fetchuser;