const User = require('../models/user.model.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function registerUser(req,res){

    try {
    
    const {name,email,password,role} = req.body;

    const existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({
            message:"User Already exists"
        })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role
    })

    res.status(201).json({
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
    })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

async function loginUser(req,res){
    try {
        const {email,password} = req.body;
        
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"Invalid Credentials"})
        }

        const isMatch = bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }

        const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET);

        res.json({
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        })

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

module.exports = {loginUser,registerUser}