const express = require('express');
const router = express.Router();
const Postamat = require('../models/Postamat')


//Creating one postamat 
router.post('/', async (req, res) => {
    try {
        const newPostamat = await Postamat.create(req.body)
        res.status(201).json(newPostamat)
    } catch (err) {
        res.status(400).json({message:err.message})
    }
})

//Getting postamats based on circle query
router.get('/circle', circleHandler, async (req, res) => {
    try{
        res.json(res.postamat)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

//Getting postamats based on circle query
router.get('/district', districtHandler, async (req, res) => {
    try{
        res.json(res.postamat)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

//Getting postamats based on query
router.get('/admin', adminHandler, async (req, res) => {
    try{
        res.json(res.postamat)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})



//Updating one postamat
router.put('/:id', async (req, res) => {
    try {
        const x = await Postamat.findByIdAndUpdate(req.params.id, req.body)
        const updatedPostamat = await Postamat.findById(req.params.id).select("-__v").exec()
        if(updatedPostamat == null){
            res.status(404).json({message: 'Cannot Find Postamats'})
        }
        else{
            res.status(200).json(updatedPostamat)
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Deleting one postamat
router.delete('/:id', async (req, res) => {
    try {
        const deletedPostamat = await Postamat.findByIdAndDelete({_id: req.params.id}).select("-__v").exec()
        if(deletedPostamat == null){
            res.status(404).json({message: 'Cannot Find Postamats'})
        }
        else{
            res.status(200).json(deletedPostamat)
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

async function circleHandler(req, res, next){
    let postamat
    let types = req.query.type
    let lon = parseFloat(req.query.lon)
    let lat = parseFloat(req.query.lat)
    let radius = parseFloat(req.query.radius)
    let model = req.query.model
    try {
        Postamat.ensureIndexes({'geometry.coordinates': '2dsphere'})
        postamat = await Postamat.find({
            'geometry.coordinates': {
                $nearSphere: {
                    $maxDistance: radius,
                    $geometry: {
                        type: 'Point',
                        coordinates: [lon,lat]
                    }
                }
            }
        }).find({type: types}).find({model: model}).sort({rating: 'desc'}).select("-__v").exec()
        if(postamat == null){
            return res.status(404).json({message: 'Cannot Find Postamats'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.postamat = postamat
    next()
}

async function districtHandler(req, res, next){
    let postamat
    let types = req.query.type
    let districts = req.query.district
    let model = req.query.model
    try {
        postamat = await Postamat.find({type: {$in: types}}).find({district: {$in: districts}}).find({model: model}).sort({rating: 'desc'}).select("-__v").exec()
        if(postamat == null){
            return res.status(404).json({message: 'Cannot Find Postamats'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.postamat = postamat
    next()
}

async function adminHandler(req, res, next){
    let postamat
    let types = req.query.type
    let admin = req.query.admin
    let model = req.query.model
    try {
        postamat = await Postamat.find({type: {$in: types}}).find({adminstrativeDistrict: {$in: admin}}).find({model: model}).sort({rating: 'desc'}).select("-__v").exec()
        if(postamat == null){
            return res.status(404).json({message: 'Cannot Find Postamats'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.postamat = postamat
    next()
}

module.exports = router
