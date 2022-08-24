const db = require('./db');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({extended: true,}));


//login
app.get('/api/login', (req, res) => {
    let sql = 'select * from sys_users where email = $1 and password = $2';
    let value = [req.body.email, req.body.password];
    let query = db.query(sql, value, (err, results) => {
        if (err) res.send(JSON.stringify({'status': false, 'message': err.message, 'payload': null}));
        else {
            if (results.rowCount == 0)
                res.send(JSON.stringify({'status': false, 'message': 'profile tidak ditemukan', 'payload': results.rows}));
            else res.send(JSON.stringify({'status': true, 'message': 'profile user ditemukan', 'payload': results.rows}));
        }
    });
});

//list user
app.get('/api/user', (req, res) => {
    let sql = 'select * from sys_users';
    let query = db.query(sql, (err, results) => {
        if (err) res.send(returnJson(false, err.message, null));
        else res.send(returnJson(true, 'data berhasil diload', results.rows));
    });
});

//add
app.post('/api/user',(req, res) => {
    var role_id = req.body.role_id, 
        name = req.body.name,
        password = req.body.password,
        email = req.body.email,
        hp = req.body.hp,
        date = new Date(),
        created_by = req.body.created_by;

    let sql = 'select count(*) total from sys_users where email = $1 ';
    let value = [email];
    let query = db.query(sql, value, (err, results) => {
        if (err) res.send(returnJson(false, err.message, null));
        else {
            let emailExist = Number(results.rows[0].total);
            if (emailExist > 0) res.send(returnJson(false, 'email sudah terdaftar', null));
            else {  
                sql =
                    'insert into sys_users (user_id, role_id, name, password, email, hp, created_on, created_by, modified_on, modified_by) ' +
                    'values ((select (coalesce(max(user_id),0)+1) user_id from sys_users), $1, $2, $3, $4, $5, $6, $7, $8, $9) ';
                value = [role_id, name, password, email, hp, date, created_by, date, created_by];
                query = db.query(sql, value, (err, results) => {
                    if (err) res.send(returnJson(false, err.message, null));
                    else res.send(returnJson(true, 'tambah user berhasil', null));
                });
            }
        }
    });
});

//edit
app.put('/api/user', (req, res) => {
    var role_id = req.body.role_id, 
        name = req.body.name,
        password = req.body.password,
        email = req.body.email,
        hp = req.body.hp,
        date = new Date(),
        modified_by = req.body.modified_by,
        user_id = req.body.user_id;

    let sql = 'select count(*) total from sys_users where email = $1 and user_id <> $2 ';
    let value = [email, user_id];
    let query = db.query(sql, value, (err, results) => {
        if (err) res.send(returnJson(false, err.message, null));
        else {
            let emailExist = Number(results.rows[0].total);
            if (emailExist > 0) res.send(returnJson(false, 'email sudah terdaftar', null));
            else {  
                sql = 
                    'update sys_users set role_id = $1, name = $2, password = $3, email = $4, hp = $5, modified_on = $6, modified_by = $7 ' +
                    'where user_id = $8';
                value = [role_id, name, password, email, hp, date, modified_by, user_id];
                query = db.query(sql, value, (err, results) => {
                    if (err) res.send(returnJson(false, err.message, null));
                    else res.send(returnJson(true, 'update berhasil', null));
                });
            }
        }
    });
});

//delete
app.delete('/api/user', (req, res) => {
    var user_id = req.body.user_id;

    let sql = 'delete from sys_users where user_id = $1';
    let value = [user_id];
    let query = db.query(sql, value, (err, results) => {
        if (err) res.send(returnJson(false, err.message, null));
        else res.send(returnJson(true, 'delete berhasil', null));
    });
});


function returnJson (status, message, payload) {
    return JSON.stringify({'status': status, 'message': message, 'payload': payload});
  }

app.listen(3000,() =>{console.log('Server started on port 3000...');});