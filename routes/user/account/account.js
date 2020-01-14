var express = require('express');
var router = express.Router();
var request = require('request');
var auth = require('../../../lib/auth');
var dbConnection = require('../../../config/dbConfig')
dbConnection.connect();
router.post('/list', auth, function(req, res) {
    
    var userData = req.decoded;
    var sql = "SELECT * FROM user WHERE id = ?"
    dbConnection.query(sql, [userData.userId], function(err, result){
        if(err){
            console.error(err);
            throw err;
        }
        else {
            var option = {
                method : "get",
                url : "https://testapi.openbanking.or.kr/v2.0/account/list",
                headers : {
                    "Authorization" : "Bearer "+result[0].accesstoken 
                },
                qs : {
                    'user_seq_no' : result[0].userseqno,
                    'include_cancel_yn' : 'Y',
                    'sort_order' : 'D'
                }
            }
            request(option, function(error,response, body){
                // console.log(body);
                var parseData = JSON.parse(body);
                res.json(parseData);
            })        
        }
    })    


});


router.post('/balance', auth, function(req, res){
    var userData = req.decoded;
    var finusenum = req.body.fin_use_num; 
    var sql = "SELECT * FROM user WHERE id = ?"
    dbConnection.query(sql, [userData.userId], function(err, result){
        if(err){
            console.error(err);
            throw err;
        }
        else {
            // console.log(result)
            var countnum = Math.floor(Math.random() * 1000000000) + 1;
            var transId = "T991605500U" + countnum;
        
            var option = {
                method : "get",
                url : "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num",
                headers : {
                    "Authorization" : "Bearer " + result[0].accesstoken
                },
                qs : {
                    bank_tran_id: transId,
                    fintech_use_num: finusenum,
                    tran_dtime: '20200108145630'
                }
            } 
            request(option, function(err,response, body){
                if(err) {
                    console.error(err);
                    throw err;
                }
                else {
                    var parseData = JSON.parse(body);
                    // console.log(parseData);
                    const data = {
                        "balance_amt": parseData.balance_amt,
                        "available_amt": parseData.available_amt,
                    }
                    res.json(data);
                }
            })                    
        }
    })
})

module.exports = router;
