var express = require('express');
var request = require('request');
var auth = require('../../lib/auth');
var router = express.Router();
var connection = require('../../config/dbConfig');


router.get('/list', function(req, res){
    var sql = "SELECT * FROM invest101.trainee"
    connection.query(sql, [], function(err, result){
        if(err){
            console.error(err);
            throw err;
        }
        else {
            res.json(result);      
        }
    })
});

module.exports = router;
