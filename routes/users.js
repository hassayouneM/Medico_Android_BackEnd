const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//Get the users list
router.get(`/`, async (req, res) =>{
    const userList = await User.find().select('name email');
    if(!userList){
        res.status(500).json({success: false})
    }
    res.send(userList);
})

//Get a user
router.get(`/:id`, async (req, res) =>{
    const user = await User.findById(req.params.id).select('-passwordHash');
    if(!user) {
        res.status(500).json({message: 'The user with the given ID was not found'})
    }
    res.status(200).send(user);
})

//Update a user
router.put('/:id', async (req, res)=>{
    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid user ID')
    }

    let user = await User.findByIdAndUpdate(
        req.params.id,
        {   name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            address: req.body.address,
            isAssistant: req.body.isAssistant,
            age: req.body.age,
            bloodType: req.body.bloodType,
            assistantPhone: req.body.assistantPhone, 
            assistantName: req.body.assistantName,
            emergencyNum: req.body.emergencyNum,
        },
        { new: true })
    if(!user) {
        return res.status(404).send('The user cannot be updated')
    }
    res.send(user);   
})

//Delete a user
router.delete('/:id',(req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user){
            return res.status(200).json({message: 'The user is deleted'})
        } else {
            return res.status(404).json({message: 'The user is not found'})
        }
    }).catch(err =>{
        return res.status(400).json({success: false, error: err})
    })
})

//LogIn
router.post(`/login`, async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.secret;
    if(!user) {
        res.status(400).send('The USER is not found');
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAssistant: user.isAssistant
            },
            secret,
            {expiresIn: '1d'}
        ) 
        res.status(200).send({user: user.email, token: token})
    } else {
        res.status(400).send('wrong password')
    }
})

//Register a user
router.post(`/register`, async (req, res) =>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        address: req.body.address,
        isAssistant: req.body.isAssistant,
        age: req.body.age,
        bloodType: req.body.bloodType,
        assistantPhone: req.body.assistantPhone, 
        assistantName: req.body.assistantName,
        emergencyNum: req.body.emergencyNum,
       
    })
    user = await user.save();
    if(!user) {
        return res.status(404).send('The user cannot be added')
    }
    res.send(user);
})

module.exports = router;