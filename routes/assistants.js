const express = require('express');
const router = express.Router();
const {Assistant} = require('../models/assistant');
const mongoose = require('mongoose');

//Get an assistant
router.get(`/get/:id`, async (req, res) =>{
    const assistant = await Assistant.findById(req.params.id).select('-passwordHash');
    if(!assistant) {
        res.status(500).json({message: 'The assistant with the given ID was not found'})
    }
    res.status(200).send(assistant);
})

//Add an assistant
router.post(`/add`, async (req, res) =>{
    let assistant = new Assistant({
        userNameame: req.body.name,
        passwordHash: req.body.passwordHash,
        phone: req.body.phone,
    })
    assistant = await assistant.save();
    if(!assistant) {
        return res.status(404).send('The assistant cannot be added')
    }
    res.send(assistant);
})

//Update an assistant
router.put('/:id', async (req, res)=>{
    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid assistant ID')
    }

    let assistant = await Assistant.findByIdAndUpdate(
        req.params.id,
        {   userNameame: req.body.name,
            passwordHash: req.body.passwordHash,
            phone: req.body.phone,
        },
        { new: true })
    if(!assistant) {
        return res.status(404).send('The assistant cannot be updated')
    }
    res.send(assistant);   
})

//Delete an assistant
router.delete('/:id',(req, res)=>{
    Assistant.findByIdAndRemove(req.params.id).then(assistant =>{
        if(assistant){
            return res.status(200).json({message: 'The assistant is deleted'})
        } else {
            return res.status(404).json({message: 'The assistant is not found'})
        }
    }).catch(err =>{
        return res.status(400).json({success: false, error: err})
    })
})

module.exports = router;
