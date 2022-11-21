const Portfolio = require('./models/PortfolioModel');
const UserModel = require('./models/UserModel');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in!');
    return res.redirect('/login');
  }
  next();
};

module.exports.isSameUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await UserModel.findById(userId);
    if (!user._id.equals(req.user._id)) {
      req.flash('error', 'You cannot view portfolios owned by other users!');
      return res.redirect(`/`);
    }
  } catch (err) {
    req.flash('error', 'User does not exist!');
    return res.redirect('/');
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { userId, portfolioId } = req.params;
  const portfolio = await Portfolio.findById(portfolioId);
  if (!portfolio.owner.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/portfolio/${userId}/${portfolioId}`);
  }
  next();
};
