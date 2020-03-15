var mysql = require("mysql");
var inquirer = require("inquirer");
const dotenv = require('dotenv').config();
var figlet = require('figlet');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.CLIENT_PASS,
  database: "employee_db"
});

connection.connect(function (err) {
  if (err) throw err;
  figlet('Employee Tracker', function (err, data) {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(data)
  });
  init();
});

