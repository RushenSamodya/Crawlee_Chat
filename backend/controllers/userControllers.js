const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

//registering users
const registerUser = asyncHandler(async(req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please fill all the fields'.red);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists'.red);
    }

    const user = await User.create({
        name,
        email,
        password,
        pic
    });

    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email:user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }else {
        res.status(400);
        throw new Error('Failed to create the user'.red);
    }
});

//login users
const authUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email:user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }

});

//to search users
const allUsers = asyncHandler(async(req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
        ],
    }: {}
    const users = await User.find(keyword ).find({ _id: { $ne: req.user._id } });
    //finding all the ids except the logged in user
    res.send(users);
});

// Get all users
// const getUsers = asyncHandler(async (req, res) => {
//   const users = await User.find({});
//   const userArray = users.map((user) => ({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     pic: user.pic,
//   }));
//   res.send(userArray);
// });
const getUsers = asyncHandler(async(req, res) => {
  const { username } = req.body;

  const users = await User.find({ username });

  if (users.length === 0) {
    res.status(404);
    throw new Error('Username does not exist'.red);
  } else {
    res.status(200).json({
      success: true
    });
  }
});



module.exports = { registerUser, authUser, allUsers,getUsers };
