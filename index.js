var mysql = require("mysql");
var inquirer = require("inquirer");
var consoletable = require("console.table");
// var Functions = require("./js/functions");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "myPassroot4sql$",
    database: "companyDB"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    getInfo();
})
const departments = [];
const questions = [
    {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["View all employees", "View employees by department", "View employees by manager", "Add a department", "Add a role", "Update a role", "Add an employee", "Update an employee", "EXIT"]
    },
    {
        type: "list",
        name: "deptName",
        message: "Choose a department:",
        choices: departments,
        when: function (answers) {
            return answers.action === "View employees by department";
        }
    },
    {
        type: "input",
        name: "deptName",
        message: "Enter the name of the department:",
        when: function (answers) {
            return answers.action === "Add a department";
        }
    },
    {
        type: "input",
        name: "roleTitle",
        message: "Enter the title for the new role:",
        when: function (answers) {
            return answers.action === "Add a role";
        }
    },
    {
        type: "input",
        name: "roleSalary",
        message: "Enter the salary for the new role:",
        when: function (answers) {
            return answers.action === "Add a role";
        }
    },
    {
        type: "input",
        name: "roleDeptID",
        message: "Enter the department ID for the new role:",
        when: function (answers) {
            return answers.action === "Add a role";
        }
    },
    {
        type: "input",
        name: "fname",
        message: "Enter the employee's first name:",
        when: function (answers) {
            return answers.action === "Add an employee";
        }
    },
    {
        type: "input",
        name: "lname",
        message: "Enter the employee's last name:",
        when: function (answers) {
            return answers.action === "Add an employee";
        }
    },
    {
        type: "input",
        name: "employeeRoleID",
        message: "Enter the employee's role ID:",
        when: function (answers) {
            return answers.action === "Add an employee";
        }
    },
    {
        type: "input",
        name: "employeeManagerID",
        message: "Enter the employee's manager ID:",
        when: function (answers) {
            return answers.action === "Add an employee";
        }
    },
    {
        type: "confirm",
        name: "continue",
        message: "Would you like to continue?",
        when: function (answers) {
            return answers.action != "EXIT"
        }
    }
];

const data = [];

function askQuestions() {
    return inquirer.prompt(questions).then(answers => {
        let departmentName = answers.deptName;
        let role = answers.roleTitle;
        let salary = answers.roleSalary;
        let departmentID = answers.deptID;
        let firstName = answers.fname;
        let lastName = answers.lname;
        let roleDepartmentID = answers.roleDeptID;
        let managerID = answers.managerID;

        data.push(answers);

        if (answers.action === "View all employees") {
            viewAllEmployees();
        }

        if (answers.action === "View employees by department") {
            viewEmployeesByDepartment();
        }

        if (answers.action === "View employees by manager") {
            viewEmployeesByManager();
        }

        if (answers.action === "Add a department") {
            departments.push(answers.deptName);
            console.log("Departments:")
        }

        if (answers.action === "EXIT") {
            console.log("Your changes:");
            console.log("--------------");
            console.table(data)
        };

        if (answers.continue === true) {
            askQuestions();
        } else {
            console.log("Your changes:");
            console.log("--------------");
            console.table(data);
        };
    });
};


function viewAllEmployees() {
    connection.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.dept_name, roles.salary
        FROM ((departments
        INNER JOIN roles ON roles.dept_id = departments.id)
        INNER JOIN employees ON employees.role_id = roles.id)`, function (err, res) {
        if (err) throw err;
        console.table(res);
        connection.end();
    });
};

function viewEmployeesByDepartment() {
    connection.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.dept_name, roles.salary, employees.manager_id
        FROM ((departments
        INNER JOIN roles ON roles.dept_id = departments.id)
        INNER JOIN employees ON employees.role_id = roles.id)
        WHERE roles.dept_id = ${deptID};`, function (err, res) {
        if (err) throw err;
        console.table(res);
        connection.end();
    });
}

async function getInfo() {
    askQuestions();
};
