const User = require("../models/userModel")
const asynchandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");

const registerUser = asynchandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new Error("user alreday exist")
    }

    const user = await User.create({
        name, email, password, pic
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            password: user.password,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(400)
        throw new Error("error occured");
    }


    res.json({
        name,
        email,
    })
});

const authUser = asynchandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            password: user.password,
            pic: user.pic,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error("invalid email");
    }
})

const updateUserProfile= asynchandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.pic = req.body.pic || user.pic;
      if(req.body.password){
        user.password = req.body.password
      }
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        pic: updatedUser.pic,
        token: generateToken(updatedUser._id),
      });
    }else{
        res.status(404);
        throw new Error("user not found");
    }
});

module.exports = { registerUser, authUser, updateUserProfile };