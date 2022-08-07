const express = require('express');
const router = express.Router();
const {Patient} = require('../models/patient');
const mongoose = require('mongoose');

//Get the patients list
router.get(`/`, async (req, res) =>{
    const patientList = await Patient.find().select('name');
    if(!patientList){
        res.status(500).json({success: false})
    }
    res.send(patientList);
})

//Get a patient
router.get(`/:id`, async (req, res) =>{
    const patient = await Patient.findById(req.params.id);
    if(!patient) {
        res.status(500).json({message: 'The patient with the given ID was not found'})
    }
    res.status(200).send(patient);
})

//Add a patient
router.post(`/register`, async (req, res) =>{
    let patient = new Patient({
        userName: req.body.userName,
        age: req.body.age,
        bloodType: req.body.bloodType,
        address: req.body.address,
        assistantPhone: req.body.assistantPhone,
        assistantName: req.body.assistantName,
        emergencyNum: req.body.emergencyNum
    })
    patient = await patient.save();
    if(!patient) {
        return res.status(404).send('The patient cannot be added')
    }
    res.send(patient);
})

//Update a patient
router.put('/:id', async (req, res)=>{
    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid patient ID')
    }

    let patient = await Patient.findByIdAndUpdate(
        req.params.id,
        {   userName: req.body.userName,
            age: req.body.age,
            bloodType: req.body.bloodType,
            address: req.body.address,
            assistantPhone: req.body.assistantPhone,
            assistantName: req.body.assistantName,
            emergencyNum: req.body.emergencyNum
        },
        { new: true })
    if(!patient) {
        return res.status(404).send('The patient cannot be updated')
    }
    res.send(patient);   
})

//Delete a patient
router.delete('/:id',(req, res)=>{
    Patient.findByIdAndRemove(req.params.id).then(patient =>{
        if(patient){
            return res.status(200).json({success: true, message: 'The patient is deleted'})
        } else {
            return res.status(404).json({success: false, message: 'The patient is not found'})
        }
    }).catch(err =>{
        return res.status(400).json({success: false, error: err})
    })
})

module.exports = router;