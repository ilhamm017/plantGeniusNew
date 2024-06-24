const express = require('express');
const router = express.Router();
const History = require('../controllers/historyControllers')

router.get('/', History.getAllHistory);
router.get('/:id', History.getHistoryById);
router.post('/', History.createHistory);
router.delete('/:id', History.deleteHistory);


module.exports = router;
