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
    };
    console.log(data)
  });
  viewEmployee();
});

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
          break;
      };
    });
};

add = () => {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to add?",
      name: "add",
      choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "DONE"]

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
        case "DONE":
          start();
          break;
      };
    });
};


view = () => {
  inquirer
    .prompt({
      type: "list",
      message: "Please select what you would like to view: ",
      choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "DONE"],
      name: "view"
    }).then(answer => {
      const option = answer.view;
      switch (option) {
        case "DEPARTMENTS":
          viewDepartment();
          break;
        case "ROLES":
          viewRole();
          break;
        case "EMPLOYEES":
          viewEmployee();
          break;
        case "DONE":
          start();
          break;
      };
    });
};

addDepartment = () => {
  inquirer
    .prompt({
      type: "Input",
      message: "Please input the NAME of the Department: ",
      name: "name"
    }).then(answer => {
      console.log("Inserting a new department...\n");
      const newDept = answer.name;
      const query = connection.query("INSERT INTO department SET ?",
        {
          name: newDept
        }, (err, res) => {
          if (err) throw err;
          console.log(res.affectedRows + " department added!\n")
          start();
        });

      console.log(query.sql);
    });
}

addRole = async () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please input the TITLE of the role: ",
        name: "title"
      },
      {
        type: "number",
        message: "Please input the SALARY of the role: ",
        name: "salary"
      },
      {
        type: "list",
        message: "Please select the DEPARTMENT of the role: ",
        choices: await departmentQuery(),
        name: "department"
      }])
    .then(async answer => {
      console.log("Inserting a new role...\n");
      const newRole = answer.title;
      const newSalary = answer.salary;
      const departmentId = await departmentIdQuery(answer.department);
      const query = connection.query("INSERT INTO role SET ?",
        {
          title: newRole,
          salary: newSalary,
          department_id: departmentId
        }, (err, res) => {
          if (err) throw err;
          console.log(res.affectedRows + " role added!\n")
          start();
        });
      console.log(query.sql);
    });
};

addEmployee = async () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please input your employee's FIRST name: ",
        name: "firstName"
      },
      {
        type: "input",
        message: "Please input your employee's LAST name: ",
        name: "lastName"
      },
      {
        type: "list",
        message: "Please select the ROLE of your employee: ",
        choices: await roleQuery(),
        name: "role"
      },
      {
        type: "list",
        message: "Please select the MANAGER of the employee, if applicable: ",
        choices: await managerQuery(),
        name: "manager"
      }])
    .then(async answer => {
      console.log("Inserting a new employee...\n");
      const firstName = answer.firstName;
      const lastName = answer.lastName;
      const roleId = await roleIdQuery(answer.role);
      const managerId = answer.manager === "None" ? null : await managerIdQuery(answer.manager);
      const query = connection.query("INSERT INTO employee SET ?",
        {
          first_name: firstName,
          last_name: lastName,
          role_id: roleId,
          manager_id: managerId
        }, (err, res) => {
          if (err) throw err;
          console.log(res.affectedRows + " employee added!\n")
          start();
        });
      console.log(query.sql);
    });
};

departmentQuery = () => {
  return new Promise((resolve, reject) => {
    const deptArr = [];
    connection.query("SELECT * FROM department", (err, res) => {
      if (err) throw err;
      res.forEach(department => {
        deptArr.push(department.name)
        return err ? reject(err) : resolve(deptArr);
      });
    });
  });
};


departmentIdQuery = dept => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM department WHERE name=?", [dept], async (err, res) => {
      if (err) throw err;
      console.log(res)
      return err ? reject(err) : resolve(res[0].id);
    });
  });
};

roleQuery = () => {
  return new Promise((resolve, reject) => {
    const roleArr = [];
    connection.query("SELECT * FROM role", (err, res) => {
      if (err) throw err;
      res.forEach(role => {
        roleArr.push(role.title)
        return err ? reject(err) : resolve(roleArr);
      });
    });
  });
};

managerQuery = () => {
  return new Promise((resolve, reject) => {
    const managerArr = ["None"]
    connection.query('SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS employee, role.title FROM employee RIGHT JOIN role ON employee.role_id = role.id WHERE role.title = "General Manager" OR role.title = "Assistant Manager" OR role.title = "Sales Lead" OR role.title = "HR Specialist"', (err, res) => {
      if (err) throw err;
      res.forEach(manager => {
        managerArr.push(manager.employee)
        return err ? reject(err) : resolve(managerArr);
      });
    })
  });
};

roleIdQuery = role => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM role WHERE title=?", [role], async (err, res) => {
      if (err) throw err;
      return err ? reject(err) : resolve(res[0].id);
    });
  });
};

managerIdQuery = manager => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM employee WHERE CONCAT(first_name, " ", last_name)=?', [manager], async (err, res) => {
      if (err) throw err;
      return err ? reject(err) : resolve(res[0].id);
    });
  });
};

viewDepartment = () => {
  connection.query("Select * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

viewRole = () => {
  connection.query("Select role.id, title, salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id", (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

viewEmployee = () => {
  connection.query('SELECT e.id, CONCAT(e.first_name, " ", e.last_name) AS employee, role.title, department.name AS department, salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e INNER JOIN role ON e.role_id=role.id INNER JOIN department on role.department_id=department.id LEFT JOIN employee m ON m.id = e.manager_id', (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

update = async () => {
  inquirer
    .prompt([{
      type: "list",
      message: "Please select the EMPLOYEE you'd like to update: ",
      choices: await employeeQuery(),
      name: "employee"
    },
    {
      type: "list",
      message: "Please select the employee's updated ROLE: ",
      choices: await roleQuery(),
      name: "role"
    },
    {
      type: "list",
      message: "Please select the employee's new MANAGER, if applicable: ",
      choices: await managerQuery(),
      name: "manager"
    }])
    .then(async answer => {
      console.log("Updating employee role...\n")
      const employeeId = await employeeIdQuery(answer.employee);
      const newRoleID = await roleIdQuery(answer.role);
      const newManagerID = answer.manager === "None" ? null : await managerIdQuery(answer.manager);
      const query = connection.query("UPDATE employee SET ?, ? WHERE id=?",
        [{
          role_id: newRoleID
        },
        {
          manager_id: newManagerID
        },
          employeeId],
        (err, res) => {
          if (err) throw err;
          console.log(res.affectedRows + " employee updated!\n")
          start();
        });
      console.log(query.sql);
    });
};

employeeQuery = () => {
  return new Promise((resolve, reject) => {
    const employeeArr = [];
    connection.query("SELECT * FROM employee", (err, res) => {
      if (err) throw err;
      res.forEach(employee => {
        let fullName = employee.first_name + " " + employee.last_name;
        employeeArr.push(fullName)
        return err ? reject(err) : resolve(employeeArr);
      });
    });
  });
};

employeeIdQuery = (employee) => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM employee WHERE CONCAT(first_name, ' ', last_name)=?", [employee], async (err, res) => {
      if (err) throw err;
      return err ? reject(err) : resolve(res[0].id);
    });
  });

}