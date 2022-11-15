const express = require('express');
const router = express.Router()

const postamatsRoute = require('./postamat')
router.use('/postamat', postamatsRoute);

module.exports = router;