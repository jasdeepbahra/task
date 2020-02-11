# Developer API Task

# Database Connectivity

Within the app.js file there is a connection object which needs to be populated with credentials to connect to a database.
Please populate the db username, password, server and database name as below:

const connectionConfig = {
    userName: 'DATABASE USERNAME',
    password: 'DATABASE PASSWORD',
    server: 'DATABASE SERVER',
    options: {
        encrypt: true,
        database: 'DATABASE TABLE NAME'
    }
};

# Database Setup
This API uses a table called userData
There is a schema folder within the root containing the create schema for the userData table. 
Run this statement to create the table needed to run CRUD operations using the provided API.

Launch API
To Launch the API please follow the below:
1)	Run npm-install to install the api dependencies  
2)	Import Attached postman into postman
3)	The imported postman assumes this api is running on localhost:3000 – the port can be changed in app.js if different to 3000


# Postman Collection
In the repo i have provided a postman collection that will allow interaction with the API.

It allows the below operations:
  Create
  Update
  Delete
  Read

