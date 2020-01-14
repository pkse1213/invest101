var express = require('express');
var request = require('request');
var auth = require('../../lib/auth');
var router = express.Router();
var dbConnection = require('../../config/dbConfig')

router.get('/myDonation',auth, function(req, res){
    var userId = req.decoded.userId
    var sql = "SELECT * FROM donation WHERE user_idx = ?"
    dbConnection.query(sql, [userId], function(err, result){
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