var mysql = require("mysql");
var inquirer = require("inquirer");
const dotenv = require('dotenv').config();

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.CLIENT_PASS,
  database: "employee_db"
});

connection.connect(function (err) {
  if (err) throw err;

  console.log("connected as id " + connection.threadId);
  connection.end();
});