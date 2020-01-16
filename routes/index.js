var express = require('express');
var router = express.Router();

router.use('/user', require('./user/index'));
router.use('/trainee', require('./trainee/index'));
router.use('/auth', require('./auth/index'));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main', { title: 'Express' });
});

router.get('/traineeList', function(req, res, next) {
  res.render('traineeList', { title: 'Express' });
});

router.get('/login', function(req,res){
  res.render('login');
})

router.get('/signup', function(req,res){
  res.render('signup');
})

router.get('/main', function(req, res){
  res.render('main');
})

router.get('/traineeInfo', function(req, res){
  res.render('traineeInfo');
})

router.get('/traineeList', function(req, res){
  res.render('traineeList');
})

router.get('/traineeDona', function(req, res){
  res.render('traineeDona');
})

router.get('/myDona', function(req, res){
  res.render('myDona');
})

router.get('/donaUse', function(req, res){
  res.render('donaUse');
})

router.get('/donaStatus', function(req, res){
  res.render('donaStatus');
})

router.get('/donation', function(req, res){
  res.render('donation');
})


module.exports = router;
