const express = require('express');
const router = express.Router();
const {Medication} = require('../models/medication');
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

//Upload image
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('INVALID IMAGE TYPE');
        if(isValid) {
            uploadError = null
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})
const uploadOptions = multer({ storage: storage })

//Get the medications list
router.get(`/`, async (req, res) =>{
    const medicationList = await Medication.find().select('name dose');
    if(!medicationList){
        res.status(500).json({success: false})
    }
    res.send(medicationList);
})

//Get a medication
router.get(`/:id`, async (req, res) =>{
    const medication = await Medication.findById(req.params.id);
    if(!medication) {
        res.status(500).json({message: 'The medication with the given ID was not found'})
    }
    res.status(200).send(medication);
})

//Add a medication
router.post(`/add`, uploadOptions.single('image'), async (req, res) =>{
    const file = req.file;
    if(!file) return res.status(400).send('image is not uploaded')//validate if the file is uploaded

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    
    let medication = new Medication({
        ref:req.body.ref,
        name: req.body.name,
        description: req.body.description,
        dose: req.body.dose,
        period: req.body.period,
        quantity: req.body.quantity,
        expDate: req.body.expDate,
        image: `${basePath}${fileName}`
    })
    medication = await medication.save();
    if(!medication) {
        return res.status(404).send('The medication cannot be added')
    }
    res.send(medication);
})

//upload medication image
router.put('/medication-image/:id', uploadOptions.array('images',10), async (req, res) => {

    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Medication ID')
    }

    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if(files) {
        files.map(file => {
            imagesPaths.push(`${basePath}${file.fileName}`);
        })
    }

    let medication = await Medication.findByIdAndUpdate(
        req.params.id,
        { image: imagesPaths },
        { new: true }
    )

    if(!medication) {
        return res.status(404).send('The medication cannot be updated')
    }
    res.send(medication);   
})

//Update a medication
router.put('/:id', async (req, res)=>{
    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid medication ID')
    }

    let medication = await Medication.findByIdAndUpdate(
        req.params.id,
        {   ref:req.body.ref,
            name: req.body.name,
            description: req.body.description,
            dose: req.body.dose,
            period: req.body.period,
            quantity: req.body.quantity,
            expDate: req.body.expDate,
            image: req.body.image 
        },
        { new: true })
    if(!medication) {
        return res.status(404).send('The medication cannot be updated')
    }
    res.send(medication);   
})


//Delete a medication
router.delete('/:id',(req, res)=>{
    Medication.findByIdAndRemove(req.params.id).then(medication =>{
        if(medication){
            return res.status(200).json({message: 'The medication is deleted'})
        } else {
            return res.status(404).json({message: 'The medication is not found'})
        }
    }).catch(err =>{
        return res.status(400).json({success: false, error: err})
    })
})

module.exports = router;