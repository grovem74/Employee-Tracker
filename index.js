var mysql = require("mysql");
var inquirer = require("inquirer");
var consoletable = require("console.table");
var Functions = require("./js/functions");


var connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user: "root",
    password: "myPassroot4sql$",
    database: "companyDB"
});

connection.connect((err)=> {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
})

const questions = [
    {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["View all employees", "View employees by department","View employees by manager","Add a department", "Add a role", "Update a role","Add an employee", "Update an employee","EXIT"]
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
            return answers.action != "Exit"
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

        if (answers.action === "View all employees") {
            viewAllEmployees(); 
        }
    });
};


function viewAllEmployees() {
    connection.query(`SELECT departments.dept_name, employees.first_name, employees.last_name, roles.title
        FROM ((departments
        INNER JOIN roles ON roles.department_id = departments.id)
        INNER JOIN employees ON employees.role_id = roles.id)`, function (err, res) {
        if (err) throw err;
        console.log(res);
        connection.end();
    });
 
}
async function getInfo() {
    askQuestions();
};

getInfo();