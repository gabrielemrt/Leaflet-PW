var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

//GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const db_path = path.join(__dirname,'../db/db.json');

router.get('/markers', function(req, res, next) {
  fs.readFile(db_path, (err, data) => {
    console.log(data);
    res.send(JSON.parse(data));
  });

});


module.exports = router;
