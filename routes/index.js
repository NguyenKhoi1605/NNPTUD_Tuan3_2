var express = require('express');
var router = express.Router();

/* GET home page. */
//localhost:3000
router.get('/', function(req, res, next) {
  res.send({
    message: 'Welcome to NNPTUD-S2 API',
    version: '1.0.0',
    endpoints: {
      products: '/products',
      users: '/users'
    }
  });
});
//localhost:3000
router.get('/home', function(req, res, next) {
  res.send({
    message: 'Welcome to NNPTUD-S2 API',
    version: '1.0.0',
    endpoints: {
      products: '/products',
      users: '/users'
    }
  });
});


module.exports = router;


//mongodb
