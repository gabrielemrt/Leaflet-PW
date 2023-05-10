var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const { requiresAuth } = require('express-openid-connect') //auth0
const mysql = require("mysql2");
require("dotenv").config()

/* GET home page. */
router.get('/', requiresAuth(), function(req, res, next) {
  console.log(req.oidc.isAuthenticated()); //auth0
  res.render('index', { 
    title: 'Express',
    isAuthenticated: req.oidc.isAuthenticated(), //auth0
    user: req.oidc.user, //auth0
  });
});

// Creating connection
let connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

router.get('/markers', (req, res) => {
  connection.query(
    'SELECT * FROM progetti;',
    function(error, results, fields) {
      if (error) throw error;
      res.json(results)});
});

const form_path = path.join(__dirname,'../form/form.html');
router.get('/form', function(req, res, next) {
  res.sendFile(form_path);
});

const style_path = path.join(__dirname,'../form/style.css');
router.get('/style.css', function(req, res, next) {
  res.sendFile(style_path);
});

router.post('/form', async (req, res) => {
  connection.query(
    "INSERT INTO progetti (nome_progetto, data_inizio_progetto, data_fine_progetto, latitudine, longitudine, note) VALUES (?, ?, ?, ?, ?, ?)", [
      req.body.nome_progetto,
      req.body.data_inizio_progetto, 
      req.body.data_fine_progetto, 
      req.body.latitudine, 
      req.body.longitudine, 
      req.body.note, 
    ]),
    function(error, results, fields) {
      if (error) throw error;
      //res.redirect('/');
      //res.send("<script>window.close();</script>");
    };
    res.redirect('/');
});

router.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM progetti WHERE id = ?", [id], 
  function(error, results, fields) {
      if (error) throw error;
      res.redirect('/');
    }
  );
  res.redirect('/');
});



module.exports = router;

//  jrcBwuTFU@Bm8D8g9RPksG@jo9xLFrh@