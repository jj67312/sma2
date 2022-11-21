const User = require('../models/UserModel');
const Stock = require('../models/StockModel');
const Portfolio = require('../models/PortfolioModel');

class Users {
  renderHome = async (req, res) => {
    const stocks = await Stock.find({});
    const user = await User.findById(req.user._id).populate({
      path: 'portfolios',
      populate: {
        path: 'stocks',
      },
    });

    const userPortfolios = await Portfolio.find({ owner: user._id }).populate(
      'stocks'
    );

    const allPs = await Portfolio.find({});

    let lF = [];
    for (let p of userPortfolios) {
      let l = [];
      for (let st of p.stocks) {
        l.push(st.name);
      }
      lF.push(l);
    }

    //[ [ 'Microsoft', 'Amazon', 'Apple' ], [ 'Tata', 'Amazon', 'Google' ] ]
    // console.log(lF);

    const stockNames = stocks.map((stock) => stock.name);
    // console.log(stockNames);

    let availableStocks = [];
    for (let p of lF) {
      let dupStocks = stockNames.slice(0);
      let arr = dupStocks.filter(function (el) {
        return p.indexOf(el) < 0;
      });
      availableStocks.push(arr);
    }

    // [ [ 'Tata', 'Google' ], [ 'Microsoft', 'Apple' ] ]
    // console.log(availableStocks);

    // userPortfolios.stocks
    // if st.name is in as -->

    function contains(a, obj) {
      for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
          return true;
        }
      }
      return false;
    }

    let fList = [];
    for (let st of stockNames) {
      let list = [];
      for (let i = 0; i < availableStocks.length; i++) {
        if (contains(availableStocks[i], st)) {
          list.push(i);
        }
      }
      // console.log(list);
      fList.push(list);
    }

    // console.log(fList);
    // userPortfolios conains all the portfolios for the curr user
    let availablePortfoliosForEachStock = [];
    for (let list of fList) {
      let tempPorts = [];
      for (let ele of list) {
        tempPorts.push(userPortfolios[ele]);
      }
      availablePortfoliosForEachStock.push(tempPorts);
    }

    // console.log(availablePortfoliosForEachStock);

    res.render('home', { stocks, user, availablePortfoliosForEachStock });
  };

  register = async (req, res) => {
    try {
      const { email, password, username } = req.body.user;
      // Create new user instance by passing the email and the username
      const newUser = new User({ email, username });
      // Takes the the new user and the password
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        } else {
          req.flash('success', `Welcome ${registeredUser.username}!`);
          res.redirect('/');
        }
      });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/register');
    }
  };

  login = async (req, res) => {
    req.flash('success', `Welcome back ${req.user.username}`);
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  };

  logout = (req, res) => {
    const username = req.user.username;
    req.logout(function (err) {
      req.flash('success', `See you soon ${username}!`);
      res.redirect('/');
    });
  };

  renderRegister = (req, res) => {
    res.render('users/register');
  };

  renderLogin = (req, res) => {
    res.render('users/login');
  };
}

module.exports = { Users };
