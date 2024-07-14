const express = require('express');
const router = express.Router();
const History = require('../controllers/historyControllers')
const Middleware = require('../middleware/middleware')

router.get('/', History.getAllHistory);
router.get('/:id', Middleware.authenticationMiddleware, History.getHistoryById);
router.post('/',Middleware.authenticationMiddleware, History.createHistory);
router.delete('/:id', Middleware.authenticationMiddleware, History.deleteHistory);


module.exports = router;
