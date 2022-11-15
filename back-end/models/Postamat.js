const mongoose = require('mongoose')

const GeoSchema = new mongoose.Schema({
    type: {
        type: String,
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        index: "2dsphere"
    }
}, {_id: false})

const PostamatSchema = new mongoose.Schema({
    address: {
        type: String
    },
    type: {
        type: String,
        required: true
    },
    district: {
        type: String
    },
    adminstrativeDistrict: {
        type: String
    },
    model: {
        type: String
    },
    rating: {
        type: Number
    },
    geometry: GeoSchema
})

module.exports = mongoose.model('postamat', PostamatSchema)