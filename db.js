const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoURI = "mongodb+srv://learner:12345@cluster0.0qsjr.mongodb.net/Notebook?retryWrites=true&w=majority";

const connectToMongo = () => {
  mongoose.connect(mongoURI).then(() => {
    console.log('Connected to the database ')
  })
    .catch((err) => {
      console.error(`Error connecting to the database. n${err}`);
    })
}

module.exports = connectToMongo;