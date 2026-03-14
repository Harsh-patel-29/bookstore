const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find({});
    console.log('All users in DB:');
    users.forEach(u => console.log(`- ${u.email} (Role: ${u.role})`));
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
};

checkUsers();
