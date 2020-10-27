const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	console.log('Hello World!');
	res.send('MarkoVoice');
});

module.exports = router;
