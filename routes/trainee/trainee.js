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

router.get('/sumAll', function(req,res){
    connection.query('SELECT sum(money) as sumall FROM invest101.donation;', function (error, results, fields) {
        if (error) throw error;
        console.log('The result is: ', results);
        res.json(results);
    });
})


router.get('/getMainData', function(req,res){
    connection.query('SELECT * FROM invest101.trainee', function (error, results, fields) {
        if (error) throw error;
        console.log('The result is: ', results);
        res.json(results);
    });
})



router.post('/supportMoney', function (req, res) {
    var traineeId = req.body.trainee_idx;
    var sql = "SELECT sum(money) as support FROM invest101.donation WHERE trainee_idx = ?";
    connection.query(sql, [traineeId],function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
})

router.post('/supportPeople', function (req, res) {
    var traineeId = req.body.trainee_idx;
    var sql = "SELECT count(*) as people FROM invest101.donation WHERE trainee_idx = ?";
    connection.query(sql, [traineeId],function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
})


router.get('/:trainee_idx/detail', function(req, res){
    var traineeId = req.params.trainee_idx;
    var detail_sql = "SELECT t.*, sum(d.money) as donation_sum FROM invest101.trainee as t JOIN invest101.donation as d ON t.trainee_idx = d.trainee_idx where t.trainee_idx = ?"
    connection.query(detail_sql, [traineeId], function(err, result){
        if(err){
            console.error(err);
            throw err;
        }
        else {
            var resultObject = result[0];
            if(resultObject.donation_sum == null) {
                resultObject.donation_sum = 0;
            }
            res.json(resultObject);      
        }
    })

});


router.get('/listByDonation', function(req, res){
    var traineeId = req.params.trainee_idx;
    var detail_sql = "SELECT sum(d.money) as donation_sum, t.* FROM invest101.donation as d, invest101.trainee as t where t.trainee_idx = d.trainee_idx GROUP BY d.trainee_idx ORDER BY donation_sum DESC";
    connection.query(detail_sql, [traineeId], function(err, result){
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
