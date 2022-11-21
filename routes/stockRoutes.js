const express = require('express');
const router = express.Router();

const { isLoggedIn, isOwner } = require('../middleware');
const stockController = require('../controllers/stockController');
// starts with /stock

const { Stocks } = require('../controllers/stockController');
const stocks = new Stocks();

router.route('/').get(stocks.getAllStocks);

router
  .route('/:stockId/:userId')
  .get(isLoggedIn, stocks.viewStock)
  .post(isLoggedIn, stocks.addStock);

router
  .route('/remove/:stockId/:portfolioId/:userId')
  .delete(isLoggedIn, stocks.removeStock);

module.exports = router;
