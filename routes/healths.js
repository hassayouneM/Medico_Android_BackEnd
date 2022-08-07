const express = require('express');
const router = express.Router();
const {Health} = require('../models/health');

//Show health
router.get(`/`, async (req, res) =>{
    const healthList = await Health.find();
    if(!healthList){
        res.status(500).json({success: false})
    }
    res.send(healthList);
})

module.exports = router;