var express = require('express');
var request = require('request');
var auth = require('../../lib/auth');
var router = express.Router();
var connection = require('../../config/dbConfig');
var jwt = require('jsonwebtoken');
var tokenKey = "fintechAcademy0$1#0@6!";

router.get('/token', function(req, res){
    var authCode = req.query.code;
    console.log(authCode);
    var option = {
        method : "POST",
        url : "https://testapi.openbanking.or.kr/oauth/2.0/token",
        headers : "",
        form : {
            code : authCode,
            client_id : 'ln6q4u3zmpl5g0JkTbATwGtDuz8boyV7DgTyIEU9',
            client_secret : 'Nwj5rUlly0omSwbgtpje39ecd9zbb5WTf9K85oFX',
            redirect_uri : 'http://localhost:3000/auth/token',
            grant_type : 'authorization_code'
        }
    }
    request(option, function (error, response, body) {
        console.log(body);
        var accessRequestResult = JSON.parse(body);
        res.render('resultChild',{data : accessRequestResult})
    });
})

router.post('/signUp', function(req, res){
    console.log(req.body);
    var name = req.body.name;
    var password = req.body.password;
    var email = req.body.email;
    var accessToken = req.body.accessToken
    var refreshToken = req.body.refreshToken
    var userSeqNo = req.body.userSeqNo

    console.log(accessToken , "에세스 토큰 확인")
    console.log(refreshToken)
    // 3개 변수 추가

    var sql = "INSERT INTO invest101.user (name, email, password, accesstoken, refreshtoken, userseqno) VALUES (?, ?, ?, ?, ?, ?)"
    // SQL 구문 변경 DB 구조 확인 바람

    connection.query(sql,[name, email, password, accessToken, refreshToken, userSeqNo], function (error, results, fields) {
        // [] 배열 정보 변경 -> 변수추가
        if (error) throw error;
        console.log('The result is: ', results);
        console.log('sql is ', this.sql);        
        res.json(1);
    });
})

router.post('/signIn', function(req, res){
    var email = req.body.email;
    var userPassword = req.body.password;
    var sql = "SELECT * FROM invest101.user WHERE email = ?";
    connection.query(sql, [email], function (error, results, fields) {
        if (error) throw error;
        console.log(results[0].password, userPassword) ;
        if(results[0].password == userPassword){
            jwt.sign(
                {
                    userName : results[0].name,
                    userId : results[0].user_idx,
                    userEmail : results[0].email
                },
                tokenKey,
                {
                    expiresIn : '90d',
                    issuer : 'fintech.admin',
                    subject : 'user.login.info'
                },
                function(err, token){
                    console.log('로그인 성공', token)
                    res.json(token)
                }
            )
        }
        else{
            console.log('비밀번호 틀렸습니다.');
            res.json(0);
        }    
    });
})


module.exports = router;