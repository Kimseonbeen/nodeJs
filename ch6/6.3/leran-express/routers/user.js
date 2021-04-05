const express = require('express');

const router = express.Router();

// GET / 라우터
router.get('/', (req, res) => { //GET /user/ 가 되는거
    res.send('Hello Express');
});

module.exports = router