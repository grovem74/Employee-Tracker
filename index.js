var mysql = require("mysql");
var inquirer = require("inquirer");
var consoletable = require("console.table");
// var Functions = require("./js/functions");

let departmentChoice;
let departmentID;
let departmentName;
let deletedDepartmentName;


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
    getDepartments();
    getInfo();
})

const departments = [];

const questions = [
    {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["View all employees", "View employees by department", "View employees by manager", "View departments","Add a department", "Delete a department", "Add a role", "Update a role", "Add an employee", "Update an employee", "EXIT"]
    },
    {
        type: "list",
        name: "deptChoice",
        message: "Select a department:",
        choices: departments,
        when: function (answers) {
            return answers.action === "View employees by department";
        }
    },
    {
        type: "list",
        name: "deptChoice",
        message: "Select a manager:",
        choices: departments,
        when: function (answers) {
            return answers.action === "View employees by manager";
        }
    },
    {
        type: "input",
        name: "deptID",
        message: "Enter a department ID:",
        when: function (answers) {
            return answers.action === "Add a department";
        }
    },
    {
        type: "input",
        name: "deptName",
        message: "Enter the department name:",
        when: function (answers) {
            return answers.action === "Add a department";
        }
    },
    {
        type: "list",
        name: "deptDeleteName",
        message: "Select department to delete:",
        choices: departments,
        when: function (answers) {
            return answers.action === "Delete a department";
        }
    },
    {
        type: "input",
        name: "roleTitle",
        message: "Enter a title for the new role:",

        when: function (answers) {
            return answers.action === "Add a role";
        }
    },
    {
        type: "input",
        name: "roleSalary",
        message: "Enter a salary for the new role:",
        when: function (answers) {
            return answers.action === "Add a role";
        }
    },
    {
        type: "input",
        name: "roleDeptID",
        message: "Enter a department ID for the new role:",
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
];

const advance =[
    {
        type: "confirm",
        name: "continue",
        message: "Would you like to make additional changes/queries?",
    }
]
const data = [];

function advancePrompts() {
    return inquirer.prompt(advance).then(answers => {
        
        if (answers.continue === true) {
            askQuestions();
        } else {
            connection.end();
        };
    });
};

function askQuestions() {
    return inquirer.prompt(questions).then(answers => {
        departmentName = answers.deptName;
        deletedDepartmentName = answers.deptDeleteName;
        let role = answers.roleTitle;
        let salary = answers.roleSalary;
        departmentID = answers.deptID;
        departmentChoice = answers.deptChoice;
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
            advancePrompts();
        }

        if (answers.action === "View departments") {
            var list = departments.toString();
            var splitList = list.split(",").join("\n");
            console.log(`\nDEPARTMENTS\n-----------\n\n${splitList}\n`);
            advancePrompts();
        }

        if (answers.action === "Add a department") {
            departments.push(answers.deptName);
            addDepartment();
        }

        if (answers.action === "Delete a department") {
            deleteDepartment();
        }

        if (answers.action === "EXIT") {
            console.log("DONE!");
        };
    });
};


async function getDepartments() {
    connection.query(`SELECT dept_name FROM companydb.departments;`, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            departments.push(res[i].dept_name);
        }
    })
};

function viewAllEmployees() {
    connection.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.dept_name, roles.salary, managers.manager_name
    FROM departments
    INNER JOIN roles ON roles.dept_id = departments.id
    INNER JOIN employees ON employees.role_id = roles.id
    INNER JOIN managers ON managers.id = employees.manager_id`, function (err, res) {
        if (err) throw err;
        console.table(res);
        advancePrompts();
        // connection.end();
    });
};

function viewEmployeesByDepartment() {
    connection.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.dept_name, roles.salary, managers.manager_name
    FROM (((departments
    INNER JOIN roles ON roles.dept_id = departments.id)
    INNER JOIN employees ON employees.role_id = roles.id)
    INNER JOIN managers ON managers.id = employees.manager_id)
    WHERE departments.dept_name = "${departmentChoice}";`, function (err, res) {
        if (err) throw err;
        console.table(res);
        advancePrompts();
        // connection.end();
    });
}

function addDepartment() {
    connection.query(`INSERT INTO departments (id, dept_name)
    VALUES (${departmentID}, "${departmentName}");`, function (err, res) {
        if (err) throw err;
        advancePrompts();
    });
}

function deleteDepartment() {
    connection.query(`DELETE FROM departments
    WHERE dept_name = "${deletedDepartmentName}";`, function (err, res) {
        if (err) throw err;
        advancePrompts();
    });
}

async function getInfo() {
    askQuestions();
};
