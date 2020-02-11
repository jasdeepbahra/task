/*
* @Author: bahraja
* @Date:   2020-02-09 22:01:53
 * @Last Modified by: Jasdeep Bahra
 * @Last Modified time: 2020-02-11 13:51:51
* 
*/

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const port = 3000;
const ConnectionPool = require('tedious-connection-pool');
const Request = require('tedious').Request;
const db = require('tedious-promises');
const TYPES = require('tedious').TYPES;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const poolConfig = {
    min: 1,
    max: 1,
    log: false
};

const connectionConfig = {
    userName: '',
    password: '',
    server: '',
    options: {
        encrypt: true,
        database: ''
    }
};
  
const dbPool = new ConnectionPool(poolConfig, connectionConfig);
dbPool.on('error', function(err) {
    console.error(err);
});

db.setConnectionPool(dbPool);

function addNewUser(data){
    console.log('-- Adding New User --');
    return new Promise(function(resolve,reject){
        let currentDT = new Date();
        currentDT = currentDT.toISOString().split('.')[0];
        currentDT = currentDT.replace('T',' '); 
		db.sql("INSERT INTO userData (first_name,surname,email,created) VALUES (@name,@surname,@email,@createdDate)")
			.parameter('name', TYPES.VarChar, data.firstName)
			.parameter('surname', TYPES.VarChar, data.lastName)
            .parameter('email', TYPES.VarChar, data.email)
            .parameter('createdDate', TYPES.VarChar, currentDT)
			.execute()
			.then(function(results){
                db.sql("SELECT ID from userData ORDER BY ID DESC")
                .execute()
                .then(function(results){
                    console.log('-- User Added With ID '+results[0].ID+' --');	
                    resolve({
                        error: false,
                        userID: results[0].ID,
                        message: 'UserID '+results[0].ID+' Added'
                    });
                })
                .catch(function(error){	
                    reject({
                        error: true,
                        error
                    });	
                });
			})
			.catch(function(error){		
				reject({
                    error: true,
                    error
                });
			});
	});
}

function listUsers(){
    console.log('-- Getting All Users --');
    return new Promise(function(resolve,reject){
        db.sql("SELECT ID,first_name,surname,created, email from userData")
			.execute()
			.then(function(results){
                if (results.length === 0){
                    console.log('-- No Users Found In DB --');
                    resolve({
                        "error": false,
                        "message": "No Users Found"
                    })
                } else {
                    console.log('-- ' + results.length +' Users Found --');
                    resolve(results);
                }
			})
			.catch(function(error){		
                reject({
                    status: error
                });
			});
    });
}

function getUser(userID){
    console.log('-- Getting User With ID '+userID+' --');
    return new Promise(function(resolve,reject){
        db.sql("SELECT ID,first_name,surname,created, email from userData WHERE ID = @ID")
			.parameter('ID', TYPES.Int, userID)
			.execute()
			.then(function(results){
                if (results.length ===0){
                    console.log('-- -User ID '+userID+ ' Not Found --');
                    resolve({
                        "error": false,
                        "message": "User ID Not Found"
                    })
                } else {
                    console.log('-- User ID '+ userID +' Found --');
                    resolve(results[0]);
                }
			})
			.catch(function(error){		
                reject({
                    status: error
                });
			});
    });
}

function updateUser (userID,data){
    return new Promise(function(resolve,reject){
        db.sql("SELECT ID from userData WHERE ID = @ID")
			.parameter('ID', TYPES.Int, userID)
			.execute()
			.then(function(results){
                if (results.length === 0){
                    console.log('-- [PUT] User Not Found, Adding New User');
                    addNewUser(data).then(function(results){
                        resolve(results);
                    });
                } else {
                    console.log('-- User Found With ID '+ userID +', Updating User --');
                    db.sql("UPDATE userData SET first_name = @firstName, surname = @lastName, email = @email WHERE ID = @ID")
                    .parameter('ID', TYPES.Int, userID)
                    .parameter('firstName', TYPES.VarChar, data.firstName)
                    .parameter('lastName', TYPES.VarChar, data.lastName)
                    .parameter('email', TYPES.VarChar, data.email)
                    .execute()
                    .then(function(results){
                       resolve({
                           error: false,
                           message: 'User Updated'
                       })
                    })
                    .catch(function(error){		
                        reject({
                            error: true,
                            error
                        });
                    });
                }
			})
			.catch(function(error){		
                reject({
                    error: true,
                    error
                });
			});
    });
}

function deleteUser(userID){
    return new Promise(function(resolve,reject){
        db.sql("SELECT ID from userData WHERE ID = @ID")
			.parameter('ID', TYPES.Int, userID)
			.execute()
			.then(function(results){
                if (results.length === 0){
                    console.log('-- User ID '+ userID +' Not Found --');
                    resolve({
                        error: false,
                        message: "User ID not found"
                    })
                } else {
                    console.log('-- Deleting User ID ' +results[0].ID +' --');
                    db.sql("DELETE from userData WHERE ID = @ID")
                        .parameter('ID', TYPES.Int, results[0].ID)
                        .execute()
                        .then(function(results){
                            resolve({
                                error: false,
                                message: 'User Deleted'
                            })
                        })
                        .catch(function(error){		
                            reject({
                                error: true,
                                error
                            });
                        });
                }
			})
			.catch(function(error){		
                reject({
                    error: true,
                    error
                });
            });
    });
}


function validateUser(user){
    return new Promise(function(resolve,reject){
        if ((!user.email) || (!user.firstName) || (!user.lastName)){
            resolve({
                error: true,
                message: 'please ensure email, firstName & lastName are present in request body'
            })
        } 
        resolve({
            error: false,
            status: 'valid'
        })
    });
};

console.log('-- Starting API --');

//Get User
app.get('/user', (req, res) => {
    if (!req.query.userID || req.query.userID.length === 0){
        return res.send({
                    error: true,
                    message: 'No user ID sent in request'
                })
    }
    getUser(req.query.userID).then(function(result) {
        return res.send(result);
    }).catch(function(reason){
        res.send({
            error: true,
            message: reason
        })
    });
});

//Post New User
app.post('/create', (req, res) => {
    validateUser(req.body).then(function(result) {
        if (result.error === true){
            return res.send(result)
        }
    }).then(addNewUser(req.body).then(function(result) {
            return res.send(result);
    }).catch(function(reason){
        res.send({
            error: true,
            message: reason
        })
    }));
});

//Put user
app.put('/update', (req, res) => {
    if (!req.query.userID || req.query.userID.length === 0){
        return res.send({
                    error: true,
                    message: 'No user ID sent in request'
                })
    }

    updateUser(req.query.userID,req.body).then(function(result) {
        return res.send(result);
    }).catch(function(reason){
        res.send({
            error: true,
            message: reason
        })
    })
});

// Delete user
app.delete('/delete', (req, res) => {
    if (!req.query.userID || req.query.userID.length === 0){
        res.send({
            error: true,
            message: 'No user ID sent in request'
        })
    }
    deleteUser(req.query.userID).then(function(result) {
        return res.send(result);
    }).catch(function(reason){
        res.send({
            error: true,
            message: reason
        })
    })
});

//List All Users
app.get('/list', (req, res) => {
    listUsers().then(function(result) {
        return res.send(result)
    })
});

app.listen(port);