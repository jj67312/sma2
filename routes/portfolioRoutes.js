const express = require('express');
const router = express.Router();

const { isLoggedIn, isOwner, isSameUser } = require('../middleware');
const { Portfolios } = require('../controllers/portfolioController');
const portfolios = new Portfolios();
const catchAsync = require('../utils/catchAsync');

// starts with /portfolio

// Original Routes:

router
  .route('/:userId')
  .get(isLoggedIn, isSameUser, portfolios.allPortfolios)
  .post(isLoggedIn, portfolios.createPortfolio);

// TEST
router
  .route('/test/:userId')
  .get(portfolios.allPortfolios2)
  .post(portfolios.createPortfolio2);

router
  .route('/:userId/:portfolioId')
  .get(isLoggedIn, isSameUser, isOwner, portfolios.viewPortfolio)
  .put(isLoggedIn, isSameUser, isOwner, portfolios.updatePortfolio)
  .delete(isOwner, portfolios.deletePortfolio);

router
  .route('/:userId/:portfolioId/edit')
  .get(isLoggedIn, isOwner, portfolios.renderEditForm);

// Testing Routes:

router
  .route('/test/:userId/:portfolioId')
  .get(portfolios.viewPortfolio2)
  .delete(portfolios.deletePortfolio2);

module.exports = router;
