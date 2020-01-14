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

router.post('/donation',auth, function(req, res){
    // console.log(req.decoded);
    var userId = req.decoded.userId
    var countnum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = "T991605500U" + countnum;
    var finUseNum = req.body.fin_use_num;
    var bankCode = req.body.bank_code;
    var accountNum = req.body.account_num;
    var tranAmt = req.body.tran_amt;
    var traineeId = req.body.trainee_id;
    var sql = 'SELECT * FROM user WHERE id = ?';
    dbConnection.query(sql, [userId], function (error, results, fields) {
        if (error) throw error;
        var option = {
            method : "post",
            url : "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
            headers : {
                Authorization : "Bearer " + results[0].accesstoken
            },
            json : {
                "bank_tran_id" :  transId,
                "cntr_account_type" :  "N",
                "cntr_account_num":  "5859040285", // 받는사람 계좌
                "dps_print_content":"힘내세요",
                "fintech_use_num":  finUseNum,
                "wd_print_content":  "오픈뱅킹출금",
                "tran_amt":tranAmt,
                "tran_dtime":  "20190910101921", 
                "req_client_name":"박세은",
                "req_client_bank_code":bankCode,
                "req_client_account_num": accountNum,
                "req_client_fintech_use _num":finUseNum,
                "req_client_num":"HONGGILDONG1234",
                "transfer_purpose": "TR",
                "sub_frnc_name":"하위가맹점",
                "sub_frnc_num":  "123456789012",
                "sub_frnc_business_num": "1234567890",
                "recv_client_name": "INVEST101",
                "recv_client_bank_code": "035",
                "recv_client_account_num": "5859040285" // 최종으로 받는사람 계좌
            }
        }
        request(option, function (error, response, body) {
            // console.log(body);
            var resultObject = body;
            var bankName = resultObject.bank_name;
            var accountNum = resultObject.account_num_masked;

            if(resultObject.rsp_code == "A0000"){
                var sql = "INSERT INTO donation (user_idx, trainee_idx, money, bank_name, account_num) VALUES (?, ?, ?, ?, ?)"
                dbConnection.query(sql, [userId, traineeId, tranAmt, bankName, accountNum], function(err, result){
                    if(err){
                        console.error(err);
                        throw err;
                    }
                    else {
                        res.json(resultObject);      
                    }
                })
            } 
            else {
                const data = {
                    "err_message" : resultObject.rsp_message
                }
                res.json(data);
            }
    
        });
    });
});
module.exports = router;
