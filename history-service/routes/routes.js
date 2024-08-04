const express = require('express');
const router = express.Router();
const History = require('../controllers/historyControllers')
const Middleware = require('../middleware/middleware')

router.post('/',Middleware.authenticationMiddleware, History.createHistory);
router.get('/', History.getAllHistory);
router.get('/:id', Middleware.authenticationMiddleware, History.getHistoryById);
router.delete('/', Middleware.authenticationMiddleware, History.deleteHistory);


module.exports = router;
