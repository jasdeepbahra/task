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
  
Before the postman collection is run there is a variable called URL which needs to be resolved. This vairable should be resolved with the server URL the api is runing on.
  
  eg: localhost:3000
  
  
# Endpoints

# /create [http post] 

The create endpoint uses a HTTP Post method and expects a body as below: 

{
    "email": "example@example.com",
    "firstName":"Phil",
    "lastName": "Jones"
}

On Confirmation, if the post is successful, the response will contain the user ID of the added record. This ID can then be used to interact with the other Posts (Get/Delete/Update)

# /user/ [http get] 

Get User
This is a HTTP GET request which, when given a user ID, returns a record matching the ID. it users the URL paramater userID

eg. /user?userID=1

# /delete/ [http delete] 

Delete User
A HTTP Delete method, which when given a user ID deletes a record

eg. /delete?userID=1

# /update/ [http put] 

Update User
A HTTP PUT method which, when given a user ID, it will update that record. If the user ID dose not exist, it will create a new user record.

eg. /update?userID=1

This endpoint needs a body as below:

{
    "email": "example@example.com",
    "firstName":"Phil",
    "lastName": "Jones"
}

# /list/ [http get] 

Get Users
A HTTP GET request, which will return all user records in the database. Any user IDs returned in the list can be used to interact with the other request (Get User / Update User / Delete User)

eg. /list








