//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express();

// Body Parser Middleware
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
  //Enabling CORS 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
  next();
});

//Setting up server
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});


//Initiallising connection string
var dbConfig = {
  user: "<dbUserName>",
  password: "<dbPassword>",
  server: "<dbHost_URL>",
  database: " <dbName>"
};

const config = {
  driver: 'msnodesqlv8',
  connectionString: 'Driver={SQL Server Native Client 11.0};Server={Q01WDB01.navidev.local\\RCDB,14433};Database={transitions_anon};Trusted_Connection={yes}',
};
//Function to connect to database and execute query
var executeQuery = function (res, query) {
  sql.connect(config, function (err) {
    if (err) {
      console.log("Error while connecting database :- " + err);
      res.send(err);
    }
    else {
      // create Request object
      var request = new sql.Request();
      // query to the database
      request.query(query, function (err, data) {
        if (err) {
          console.log("Error while querying database :- " + err);
          res.send(err);
        }
        else {
          res.send(data);
        }
      });
    }
  });
}

app.get("/api/HelloWorld", function (req, res) {
  var retText = "HelloWorld !!!";
  retText += "<br/>Try this url for more help : /api/Help";
  res.send(retText);  
});

app.get("/api/Help", function (req, res) {
  var retText = "<br/>Help";
  retText += "<br/>List of Api with Url";
  retText += "<br/>GET Top 10 Facilities Successfull Faxes : /api/GetTop10FaxesSuccessfull/:Duration";
  retText += "<br/>GET Top 10 Facilities Failed Faxes : /api/GetTop10FaxesFailed/:Duration";
  retText += "<br/>Get Fax Status Daywise : /api/GetFaxStatusDaywise/:Days";
  retText += "<br/>Get Fax Status Monthwise : /api/GetFaxStatusMonthwise/:Months";
  res.send(retText);
});

//GET Top 10 Facilities Successfull Faxes
app.get("/api/GetTop10FaxesSuccessfull/:Duration", function (req, res) {
  var query = "Exec spGetTop10FacilitiesByFaxStatus 3, " + req.params.Duration;
  executeQuery(res, query);
});

//GET Top 10 Facilities Failed Faxes
app.get("/api/GetTop10FaxesFailed/:Duration", function (req, res) {
  var query = "Exec spGetTop10FacilitiesByFaxStatus 4, " + req.params.Duration;
  executeQuery(res, query);
});

//Get Fax Status Daywise
app.get("/api/GetFaxStatusDaywise/:Days", function (req, res) {
  var query = "Exec spGetFaxStatusDaywise " + req.params.Days;
  executeQuery(res, query);
});

//Get Fax Status Monthwise
app.get("/api/GetFaxStatusMonthwise/:Months", function (req, res) {
  var query = "Exec spGetFaxStatusMonthwise " + req.params.Months;
  executeQuery(res, query);
});

//Get Referral Count by PACareType
app.get("/api/GetReferrlaCountsForPACareType/:Duration", function (req, res) {
  var query = "Exec spGetReferrlaCountsForPACareType " + req.params.Duration;
  executeQuery(res, query);
});