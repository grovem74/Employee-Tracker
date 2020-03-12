// Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var consoletable = require("console.table");

// SQL set up
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
    getRoles();
    getManagers();
    getEmployees();
    getInfo();
})

// Global variables
const departments = [];

const departmentIDs = [];

const roles = [];

const managers = [];

const managerIDs = [];

const employees = [];

const questions = [
    {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["View all employees", "View employees by department", "View employees by manager", "View departments", "Add a department", "Delete a department", "Add a role", "Update a role", "Add an employee", "Update an employee", "EXIT"]
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
        name: "managerChoice",
        message: "Select a manager:",
        choices: managers,
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
        name: "roleID",
        message: "Enter a new role ID:",

        when: function (answers) {
            return answers.action === "Add a role";
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
        type: "list",
        name: "roleDeptID",
        message: "Select a department ID for the new role:",
        choices: departmentIDs,
        when: function (answers) {
            return answers.action === "Add a role";
        }
    },
    {
        type: "list",
        name: "roleUpdate",
        message: "Select a role:",
        choices: roles,
        when: function (answers) {
            return answers.action === "Update a role";
        }
    },
    {
        type: "list",
        name: "roleUpdateChoice",
        message: "Select an action:",
        choices: ["Update", "Delete"],
        when: function (answers) {
            return answers.action === "Update a role";
        }
    },
    {
        type: "input",
        name: "updateTitle",
        message: "Enter new title:",
        when: function (answers) {
            return answers.roleUpdateChoice === "Update";
        }
    },
    {
        type: "input",
        name: "updateSalary",
        message: "Enter new salary:",
        when: function (answers) {
            return answers.roleUpdateChoice === "Update";
        }
    },
    {
        type: "input",
        name: "updateRoleDeptID",
        message: "Enter new department ID:",
        when: function (answers) {
            return answers.roleUpdateChoice === "Update";
        }
    },
    {
        type: "input",
        name: "employeeID",
        message: "Enter new employee ID:",
        when: function (answers) {
            return answers.action === "Add an employee";
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
        type: "list",
        name: "employeeRoleID",
        message: "Select a role ID:",
        choices: roles,
        when: function (answers) {
            return answers.action === "Add an employee";
        }
    },
    {
        type: "list",
        name: "employeeManagerID",
        message: "Select a manager ID:",
        choices: managerIDs,
        when: function (answers) {
            return answers.action === "Add an employee";
        }
    },
    {
        type: "list",
        name: "updatedEmployee",
        message: "Select an employee:",
        choices: employees,
        when: function (answers) {
            return answers.action === "Update an employee";
        }
    },
    {
        type: "list",
        name: "employeeUpdateChoice",
        message: "Select an action:",
        choices: ["Update", "Delete"],
        when: function (answers) {
            return answers.action === "Update an employee";
        }
    },
    {
        type: "input",
        name: "updatedFirstName",
        message: "Update employee's first name:",
        when: function (answers) {
            return answers.employeeUpdateChoice === "Update";
        }
    },
    {
        type: "input",
        name: "updatedLastName",
        message: "Update employee's last name:",
        when: function (answers) {
            return answers.employeeUpdateChoice === "Update";
        }
    },
    {
        type: "input",
        name: "updatedEmployeeRoleID",
        message: "Update employee's role ID:",
        when: function (answers) {
            return answers.employeeUpdateChoice === "Update";
        }
    },
    {
        type: "input",
        name: "updatedEmployeeManagerID",
        message: "Update employee's manager ID:",
        when: function (answers) {
            return answers.employeeUpdateChoice === "Update";
        }
    },
];

const advance = [
    {
        type: "confirm",
        name: "continue",
        message: "Would you like to make additional changes/queries?",
    }
]

// functions

function advancePrompts() {
    return inquirer.prompt(advance).then(answers => {

        if (answers.continue === true) {
            askQuestions();
        } else {
            connection.end();
        };
    });
};

async function getDepartments() {
    connection.query(`SELECT id, dept_name FROM companydb.departments;`, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            departments.push(res[i].dept_name);
            departmentIDs.push(res[i].id);
        }
    })
};

function getRoles() {
    connection.query(`SELECT id FROM companydb.roles;`, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            roles.push(res[i].id);
        }
    })
};

function getManagers() {
    connection.query(`SELECT mgr_last_name, id FROM companydb.managers;`, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            managers.push(res[i].mgr_last_name);
            managerIDs.push(res[i].id);
        }
    })
};

function getEmployees() {
    connection.query(`SELECT first_name, last_name FROM companydb.employees;`, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            employees.push(res[i].first_name + " " + res[i].last_name);
        }
    })
};

function askQuestions() {
    return inquirer.prompt(questions).then(answers => {
        departmentName = answers.deptName;
        deletedDepartmentName = answers.deptDeleteName;
        managerChoice = answers.managerChoice;
        title = answers.roleTitle;
        roleID = answers.roleID;
        salary = answers.roleSalary;
        roleDept = answers.roleDept;
        roleDeptID = answers.roleDeptID;
        updatedRole = answers.roleUpdate;
        updatedTitle = answers.updateTitle;
        updatedSalary = answers.updateSalary;
        updatedRoleDeptID = answers.updateRoleDeptID;
        departmentID = answers.deptID;
        departmentChoice = answers.deptChoice;
        employeeID = answers.employeeID;
        employeeRoleID = answers.employeeRoleID;
        employeeManagerID = answers.employeeManagerID;
        fname = answers.fname;
        lname = answers.lname;
        updatedEmployee = answers.updatedEmployee;
        updatedFirstName = answers.updatedFirstName;
        updatedLastName = answers.updatedLastName;
        updatedEmployeeRoleID = answers.updatedEmployeeRoleID;
        updatedEmployeeManagerID = answers.updatedEmployeeManagerID;

        if (answers.action === "View all employees") {
            viewAllEmployees();
        };

        if (answers.action === "View employees by department") {
            viewEmployeesByDepartment();
        };

        if (answers.action === "View employees by manager") {
            viewEmployeesByManager();
        };

        if (answers.action === "View departments") {
            var list = departments.toString();
            var splitList = list.split(",").join("\n");
            console.log(`\nDEPARTMENTS\n-----------\n\n${splitList}\n`);
            advancePrompts();
        };

        if (answers.action === "Add a department") {
            departments.push(answers.deptName);
            addDepartment();
        };

        if (answers.action === "Delete a department") {
            deleteDepartment();
        };

        if (answers.action === "Add a role") {
            addRole();
        };

        if (answers.action === "Update a role") {
            if (answers.roleUpdateChoice === "Update") {
                updateRole();
            } else if (answers.roleUpdateChoice === "Delete") {
                deleteRole();
            }
        };

        if (answers.action === "Add an employee") {
            addEmployee();
        };

        if (answers.action === "Update an employee") {
            if (answers.employeeUpdateChoice === "Update") {
                updateEmployee();
            } else {
                deleteEmployee();
            };
        };

        if (answers.action === "EXIT") {
            console.log("DONE!");
            connection.end();
        };
    });
};

function viewAllEmployees() {
    connection.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.dept_name, roles.salary, managers.mgr_first_name
    FROM departments
    INNER JOIN roles ON roles.dept_id = departments.id
    INNER JOIN employees ON employees.role_id = roles.id
    INNER JOIN managers ON managers.id = employees.manager_id`, function (err, res) {
        if (err) throw err;
        console.table(res);
        advancePrompts();
    });
};

function viewEmployeesByDepartment() {
    connection.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.dept_name, roles.salary, managers.mgr_first_name, managers.mgr_last_name
    FROM (((departments
    INNER JOIN roles ON roles.dept_id = departments.id)
    INNER JOIN employees ON employees.role_id = roles.id)
    INNER JOIN managers ON managers.id = employees.manager_id)
    WHERE departments.dept_name = "${departmentChoice}";`, function (err, res) {
        if (err) throw err;
        console.table(res);
        advancePrompts();
    });
};

function viewEmployeesByManager() {
    connection.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.dept_name, roles.salary, managers.mgr_first_name, managers.mgr_last_name
    FROM departments
    INNER JOIN roles ON roles.dept_id = departments.id
    INNER JOIN employees ON employees.role_id = roles.id
    INNER JOIN managers ON managers.id = employees.manager_id
    WHERE managers.mgr_last_name = "${managerChoice}";`, function (err, res) {
        if (err) throw err;
        console.table(res);
        advancePrompts();
    });
};

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

function addRole() {
    connection.query(`INSERT INTO roles (id, title, salary, dept_id)
    VALUES (${roleID}, "${title}", "${salary}", "${roleDeptID}");`, function (err, res) {
        if (err) throw err;
        advancePrompts();
    });
}

function updateRole() {
    connection.query(`UPDATE roles
    SET title = "${updatedTitle}", salary = "${updatedSalary}"
    WHERE id = "${updatedRole}";`, function (err, res) {
        if (err) throw err;
        advancePrompts();
    });
}

function deleteRole() {
    connection.query(`DELETE FROM roles
    WHERE id = ${updatedRole};`, function (err, res) {
        if (err) throw err;
        advancePrompts();
    });
}

function addEmployee() {
    connection.query(`INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
    VALUES (${employeeID}, "${fname}", "${lname}", ${employeeRoleID}, ${employeeManagerID});`, function (err, res) {
        if (err) throw err;
        updateFullName();
        advancePrompts();
    });
};

function updateEmployee() {
    connection.query(`UPDATE employees
    SET first_name = "${updatedFirstName}", last_name = "${updatedLastName}", role_id = ${updatedEmployeeRoleID}, manager_id = ${updatedEmployeeManagerID}
    WHERE full_name="${updatedEmployee}";`, function (err, res) {
        if (err) throw err;
        updateFullName();
        advancePrompts();
    });
};

function deleteEmployee() {
    connection.query(`DELETE FROM employees
    WHERE full_name = "${updatedEmployee}";`, function (err, res) {
        if (err) throw err;
        updateFullName();
        advancePrompts();
    });
};

async function getInfo() {
    askQuestions();
};


function updateFullName() {
    connection.query(`UPDATE employees
    SET full_name = CONCAT(first_name, " ", last_name);`, function (err, res) {
        if (err) throw err;
    })
};

