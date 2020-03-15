const mysql = require("mysql");
const inquirer = require("inquirer");
const dotenv = require('dotenv').config();
const figlet = require('figlet');
const cTable = require('console.table');

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

init = () => {
  connection.query('SELECT e.id, CONCAT(e.first_name, " ", e.last_name) AS employee, role.title, department.name AS department, salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e INNER JOIN role ON e.role_id=role.id INNER JOIN department on role.department_id=department.id LEFT JOIN employee m ON m.id = e.manager_id', (err, res) => {
    console.table(res);
    start();
  })

}

start = () => {

  inquirer
    .prompt({
      type: "list",
      message: "Please select an option",
      name: "option",
      choices: ["ADD", "VIEW", "UPDATE", "EXIT"]
    }).then(answer => {
      const option = answer.option;

      switch (option) {
        case "ADD":
          add();
          break;
        case "VIEW":
          view();
          break;
        case "UPDATE":
          update();
          break;
        case "EXIT":
          connection.end();
      }


    })

}

add = () => {

  inquirer
    .prompt({
      type: "list",
      message: "What would you like to add?",
      name: "add",
      choices: ["DEPARTMENT", "ROLE", "EMPLOYEE"]

    }).then(answer => {
      const option = answer.add;

      switch (option) {

        case "DEPARTMENT":
          addDepartment();
          break;
        case "ROLE":
          addRole();
          break;
        case "EMPLOYEE":
          addEmployee();
          break;
      }
    })

}