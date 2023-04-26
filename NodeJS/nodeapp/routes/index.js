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

const form_path = path.join(__dirname,'../form/form.html')

router.get('/form', function(req, res, next) {
  res.sendFile(form_path);
});

const style_path = path.join(__dirname,'../form/style.css')
router.get('/style.css', function(req, res, next) {
  res.sendFile(style_path);
});

router.post('/form', (req, res) => {

  //res.send(req.body);
  console.log(req.body);
  res.write('Dati del form inviati correttamente');
  res.end();

});


module.exports = router;
