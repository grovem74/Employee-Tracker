// Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");
var colors = require("colors");
var title = require("./title");
var fs = require("fs");
// var functions= require("./js/functions");

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
    console.log(title.appName.green);
    getDepartments();
    getRoles();
    getManagerRoles();
    getManagers();
    getEmployees();
    getInfo();

    // code to use use imported functions

    // functions.getDepartments;
    // functions.getRoles;
    // functions.getManagers;
    // functions.getEmployees;
    // functions.getInfo;
})

// Global variables
const departments = [];

const roles = [];

const managerRoles = [];

const managers = [];

const employees = [];

const questions = [
    {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["View All Employees", "View Employees By Department", "View Employees By Manager", "View Managers", "Add Managers","Update/Delete Managers", "View Departments", "Add Departments", "Delete Departments".red, "View Roles", "Add Roles", "Update/Delete Roles", "View Manager Roles", "Add Manager Roles", "Update/Delete Manager Roles","Add Employees", "Update/Delete Employees", "View Budgets", "EXIT".red]
    },
    {
        type: "list",
        name: "deptChoice",
        message: "Select a department:",
        choices: departments,
        when: function (answers) {
            return answers.action === "View Employees By Department";
        },
        filter: function (val) {
            var splitList = val.split(" ").pop().slice(0, -1);
            return splitList;
        }
    },
    {
        type: "list",
        name: "managerChoice",
        message: "Select a manager:",
        choices: managers,
        when: function (answers) {
            return answers.action === "View Employees By Manager";
        },
        filter: function (val) {
            var splitList = val.split(" ").pop().slice(0, -1);
            return splitList;
        }
    },

    // Add a manager
    {
        type: "input",
        name: "managerID",
        message: "Enter new manager ID:",
        when: function (answers) {
            return answers.action === "Add Managers";
        }
    },
    {
        type: "input",
        name: "managerFname",
        message: "Enter the manager's first name:",
        when: function (answers) {
            return answers.action === "Add Managers";
        }
    },
    {
        type: "input",
        name: "managerLname",
        message: "Enter the manager's last name:",
        when: function (answers) {
            return answers.action === "Add Managers";
        }
    },
    {
        type: "list",
        name: "managerRoleID",
        message: "Select a role:",
        choices: managerRoles,
        when: function (answers) {
            return answers.action === "Add Managers";
        },
        filter: function (val) {
            var splitList = val.split(" ").pop().slice(0, -1);
            return splitList;
        }
    },

    // Update/delete a manager
    {
        type: "list",
        name: "updatedManager",
        message: "Select an manager:",
        choices: managers,
        when: function (answers) {
            return answers.action === "Update/Delete Managers";
        }
    },
    {
        type: "list",
        name: "managerUpdateChoice",
        message: "Select an action:",
        choices: ["Update", "Delete".red],
        when: function (answers) {
            return answers.action === "Update/Delete Managers";
        }
    },
    {
        type: "input",
        name: "updatedManagerFirstName",
        message: "Update manager's first name:",
        when: function (answers) {
            return answers.managerUpdateChoice === "Update";
        }
    },
    {
        type: "input",
        name: "updatedManagerLastName",
        message: "Update manager's last name:",
        when: function (answers) {
            return answers.managerUpdateChoice === "Update";
        }
    },
    {
        type: "list",
        name: "updatedManagerRoleID",
        message: "Update manager's role ID:",
        choices: managerRoles,
        when: function (answers) {
            return answers.managerUpdateChoice === "Update";
        },
        filter: function (val) {
            var splitList = val.split(" ").pop().slice(0, -1);
            return splitList;
        }
    },

    // Add a department
    {
        type: "input",
        name: "deptID",
        message: "Enter a department ID:",
        when: function (answers) {
            return answers.action === "Add Departments";
        }
    },
    {
        type: "input",
        name: "deptName",
        message: "Enter the department name:",
        when: function (answers) {
            return answers.action === "Add Departments";
        }
    },

    // Delete a department
    {
        type: "list",
        name: "deptDeleteName",
        message: "Select department to delete:",
        choices: departments,
        when: function (answers) {
            return answers.action === "Delete Departments".red;
        },
        filter: function (val) {
            var splitList = val.split(" ").pop().slice(0, -1);
            return splitList;
        }
    },

    // Add a role
    {
        type: "input",
        name: "roleID",
        message: "Enter a new role ID:",

        when: function (answers) {
            return answers.action === "Add Roles";
        }
    },
    {
        type: "input",
        name: "roleTitle",
        message: "Enter a title for the new role:",

        when: function (answers) {
            return answers.action === "Add Roles";
        }
    },
    {
        type: "input",
        name: "roleSalary",
        message: "Enter a salary for the new role:",
        when: function (answers) {
            return answers.action === "Add Roles";
        }
    },
    {
        type: "list",
        name: "roleDeptID",
        message: "Select a department ID for the new role:",
        choices: departments,
        when: function (answers) {
            return answers.action === "Add Roles";
        },
        filter: function (val) {
            var splitList = val.split(" ").pop().slice(0, -1);
            return splitList;
        }
    },

    // Update/delete a role
    {
        type: "list",
        name: "roleUpdate",
        message: "Select a role:",
        choices: roles,
        when: function (answers) {
            return answers.action === "Update/Delete Roles";
        },
        filter: function (val) {
            var splitList = val.split(" ").pop().slice(0, -1);
            return splitList;
        }
    },
    {
        type: "list",
        name: "roleUpdateChoice",
        message: "Select an action:",
        choices: ["Update", "Delete".red],
        when: function (answers) {
            return answers.action === "Update/Delete Roles";
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
        type: "list",
        name: "updateRoleDeptID",
        message: "Enter new department ID:",
        choices: departments,
        when: function (answers) {
            return answers.roleUpdateChoice === "Update";
        },
        filter: function (val) {
            var splitList = val.split(" ").pop().slice(0, -1);
            return splitList;
        }
    },

    // Add a manager role
    {
        type: "input",
        name: "managerRoleID",
        message: "Enter a new manager role ID:",

        when: function (answers) {
            return answers.action === "Add Manager Roles";
        }
    },
    {
        type: "input",
        name: "managerRoleTitle",
        message: "Enter a title for the new manager role:",

        when: function (answers) {
            return answers.action === "Add Manager Roles";
        }
    },
    {
        type: "input",
        name: "managerRoleSalary",
        message: "Enter a salary for the new manager role:",
        when: function (answers) {
            return answers.action === "Add Manager Roles";
        }
    },
    {
        type: "list",
        name: "managerRoleDeptID",
        message: "Select a department ID for the new manager role:",
        choices: departments,
        when: function (answers) {
            return answers.action === "Add Manager Roles";
        },
        filter: function (val) {
            var splitList = val.split(" ").pop().slice(0, -1);
            return splitList;
        }
    },

    // Update/delete a manager role
    {
        type: "list",
        name: "managerRoleUpdate",
        message: "Select a role:",
        choices: managerRoles,
        when: function (answers) {
            return answers.action === "Update/Delete Manager Roles";
        },
        filter: function (val) {
            var splitList = val.split(" ").pop().slice(0, -1);
            return splitList;
        }
    },
    {
        type: "list",
        name: "managerRoleUpdateChoice",
        message: "Select an action:",
        choices: ["Update", "Delete".red],
        when: function (answers) {
            return answers.action === "Update/Delete Manager Roles";
        }
    },
    {
        type: "input",
        name: "updateManagerTitle",
        message: "Enter new title:",
        when: function (answers) {
            return answers.managerRoleUpdateChoice === "Update";
        }
    },
    {
        type: "input",
        name: "updateManagerSalary",
        message: "Enter new salary:",
        when: function (answers) {
            return answers.managerRoleUpdateChoice === "Update";
        }
    },
    {
        type: "list",
        name: "updateManagerRoleDeptID",
        message: "Enter new department ID:",
        choices: departments,
        when: function (answers) {
            return answers.managerRoleUpdateChoice === "Update";
        },
        filter: function (val) {
            var splitList = val.split(" ").pop().slice(0, -1);
            return splitList;
        }
    },

    // Add an employee
    {
        type: "input",
        name: "employeeID",
        message: "Enter new employee ID:",
        when: function (answers) {
            return answers.action === "Add Employees";
        }
    },
    {
        type: "input",
        name: "fname",
        message: "Enter the employee's first name:",
        when: function (answers) {
            return answers.action === "Add Employees";
        }
    },
    {
        type: "input",
        name: "lname",
        message: "Enter the employee's last name:",
        when: function (answers) {
            return answers.action === "Add Employees";
        }
    },
    {
        type: "list",
        name: "employeeRoleID",
        message: "Select a role:",
        choices: roles,
        when: function (answers) {
            return answers.action === "Add Employees";
        },
        filter: function (val) {
            var splitList = val.split(" ").pop().slice(0, -1);
            return splitList;
        }
    },
    {
        type: "list",
        name: "employeeManagerID",
        message: "Select a manager ID:",
        choices: managers,
        when: function (answers) {
            return answers.action === "Add Employees";
        },
        filter: function (val) {
            var splitList = val.split(" ").pop().slice(0, -1);
            return splitList;
        }
    },

    // Update/delete an employee
    {
        type: "list",
        name: "updatedEmployee",
        message: "Select an employee:",
        choices: employees,
        when: function (answers) {
            return answers.action === "Update/Delete Employees";
        }
    },
    {
        type: "list",
        name: "employeeUpdateChoice",
        message: "Select an action:",
        choices: ["Update", "Delete".red],
        when: function (answers) {
            return answers.action === "Update/Delete Employees";
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
        type: "list",
        name: "updatedEmployeeRoleID",
        message: "Update employee's role ID:",
        choices: roles,
        when: function (answers) {
            return answers.employeeUpdateChoice === "Update";
        },
        filter: function (val) {
            var splitList = val.split(" ").pop().slice(0, -1);
            return splitList;
        }
    },
    {
        type: "list",
        name: "updatedEmployeeManagerID",
        message: "Update employee's manager ID:",
        choices: managers,
        when: function (answers) {
            return answers.employeeUpdateChoice === "Update";
        },
        filter: function (val) {
            var splitList = val.split(" ").pop().slice(0, -1);
            return splitList;
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
            departments.push(`${res[i].dept_name} (ID ${res[i].id})`);
        }
    })
};

function getRoles() {
    connection.query(`SELECT title, id FROM companydb.roles;`, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            roles.push(`${res[i].title} (ID ${res[i].id})`);
        }
    })
};

function getManagerRoles() {
    connection.query(`SELECT title, id FROM companydb.mgr_roles;`, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            managerRoles.push(`${res[i].title} (ID ${res[i].id})`);
        }
    })
};

function getManagers() {
    connection.query(`SELECT mgr_full_name, id FROM companydb.managers;`, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            managers.push(`${res[i].mgr_full_name} (ID ${res[i].id})`);
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
        managerTitle = answers.managerRoleTitle;
        roleID = answers.roleID;
        managerRoleID = answers.managerRoleID;
        salary = answers.roleSalary;
        managerSalary = answers.managerRoleSalary;
        roleDept = answers.roleDept;
        roleDeptID = answers.roleDeptID;
        managerRoleDeptID = answers.managerRoleDeptID;
        updatedRole = answers.roleUpdate;
        updatedManagerRole = answers.managerRoleUpdate;
        updatedTitle = answers.updateTitle;
        updatedManagerTitle = answers.updateManagerTitle;
        updatedSalary = answers.updateSalary;
        updatedManagerSalary = answers.updateManagerSalary;
        updatedRoleDeptID = answers.updateRoleDeptID;
        departmentID = answers.deptID;
        departmentChoice = answers.deptChoice;
        employeeID = answers.employeeID;
        managerID = answers.managerID;
        employeeRole = answers.employeeRole;
        managerRole = answers.managerRole;
        employeeRoleID = answers.employeeRoleID;
        managerRoleID = answers.managerRoleID;
        employeeManagerID = answers.employeeManagerID;
        fname = answers.fname;
        lname = answers.lname;
        managerFname = answers.managerFname;
        managerLname = answers.managerLname;
        updatedEmployee = answers.updatedEmployee;
        updatedManager = answers.updatedManager;
        updatedFirstName = answers.updatedFirstName;
        updatedLastName = answers.updatedLastName;
        updatedManagerFirstName = answers.updatedManagerFirstName;
        updatedManagerLastName = answers.updatedManagerLastName;
        updatedEmployeeRoleID = answers.updatedEmployeeRoleID;
        updatedManagerRoleID = answers.updatedManagerRoleID;
        updatedEmployeeManagerID = answers.updatedEmployeeManagerID;

        if (answers.action === "View All Employees") {
            viewAllEmployees();
        };

        if (answers.action === "View Employees By Department") {
            viewEmployeesByDepartment();
        };

        if (answers.action === "View Employees By Manager") {
            console.log(managerChoice);
            viewEmployeesByManager();
        };

        if (answers.action === "View Managers") {
            viewManagers();
        };

        if (answers.action === "Add Managers") {
            addManager();
        };

        if (answers.action === "Update/Delete Managers") {
            if (answers.managerUpdateChoice === "Update") {
                updateManager();
            } else {
                deleteManager();
            };
        };

        if (answers.action === "View Departments") {
            viewDepartments();
        };

        if (answers.action === "Add Departments") {
            departments.push(`${answers.deptName} - ${answers.deptID}`);
            addDepartment();
        };

        if (answers.action === "Delete Departments".red) {
            deleteDepartment();
        };

        if (answers.action === "View Roles") {
            viewRoles();
        };

        if (answers.action === "Add Roles") {
            addRole();
        };

        if (answers.action === "Update/Delete Roles") {
            if (answers.roleUpdateChoice === "Update") {
                updateRole();
            } else {
                deleteRole();
            }
        };

        if (answers.action === "View Manager Roles") {
            viewManagerRoles();
        };
        
        if (answers.action === "Add Manager Roles") {
            managerRoles.push(`${answers.deptName} - ${answers.deptID}`);
            addManagerRole();
        };

        if (answers.action === "Update/Delete Manager Roles") {
            if (answers.roleUpdateChoice === "Update") {
                updateManagerRole();
            } else {
                deleteManagerRole();
            }
        };

        if (answers.action === "Add Employees") {
            employees.push(`${answers.fname} ${answers.lname}`);
            addEmployee();
        };

        if (answers.action === "Update/Delete Employees") {
            if (answers.employeeUpdateChoice === "Update") {
                updateEmployee();
            } else {
                deleteEmployee();
            };
        };

        if (answers.action === "View Budgets") {
            viewBudgets();
        };

        if (answers.action === "EXIT".red) {
            console.log("GOODBYE...");
            connection.end();
        };
    });
};

function viewAllEmployees() {
    connection.query(`SELECT managers.id AS ID, mgr_full_name AS NAME, mgr_roles.title AS ROLE, departments.dept_name AS DEPARTMENT, CONCAT('$', FORMAT(mgr_roles.salary, "C")) AS SALARY, "NA" AS MANAGER FROM managers
    INNER JOIN mgr_roles ON mgr_roles.id = managers.role_id
    INNER JOIN departments ON departments.id = mgr_roles.dept_id
    UNION
    SELECT employees.id AS ID, full_name AS NAME, roles.title AS ROLE, dept_name AS DEPARTMENT, CONCAT('$', FORMAT(roles.salary, "C")) AS SALARY, mgr_full_name AS MANAGER FROM employees
    INNER JOIN roles ON roles.id = employees.role_id
    INNER JOIN managers ON managers.id = employees.manager_id
    INNER JOIN departments ON departments.id = roles.dept_id
    ORDER BY ID;`, function (err, res) {
        if (err) throw err;
        console.table(res);
        advancePrompts();
    });
};

function viewEmployeesByDepartment() {
    connection.query(`SELECT managers.id AS ID, mgr_full_name AS NAME, mgr_roles.title AS ROLE, dept_name AS DEPARTMENT, CONCAT('$', FORMAT(salary, "C")) AS SALARY, "NA" AS MANAGER FROM managers
    INNER JOIN mgr_roles ON mgr_roles.id = managers.role_id
    INNER JOIN departments ON departments.id = mgr_roles.dept_id
    WHERE departments.id = ${departmentChoice}
    UNION
    SELECT employees.id AS ID, employees.full_name AS NAME, roles.title AS ROLE, departments.dept_name AS DEPARTMENT, CONCAT('$', FORMAT(salary, "C")) AS SALARY, managers.mgr_full_name AS MANAGER
    FROM (((departments
    INNER JOIN roles ON roles.dept_id = departments.id)
    INNER JOIN employees ON employees.role_id = roles.id)
    INNER JOIN managers ON managers.id = employees.manager_id)
    WHERE departments.id = ${departmentChoice};`, function (err, res) {
        if (err) throw err;
        console.table(res);
        advancePrompts();
    });
};

function viewEmployeesByManager() {
    connection.query(`SELECT employees.id AS ID, employees.full_name AS NAME, roles.title AS ROLE, departments.dept_name AS DEPARTMENT, CONCAT('$', FORMAT(salary, "C")) AS SALARY
    FROM departments
    INNER JOIN roles ON roles.dept_id = departments.id
    INNER JOIN employees ON employees.role_id = roles.id
    INNER JOIN managers ON managers.id = employees.manager_id
    WHERE managers.id = "${managerChoice}";`, function (err, res) {
        if (err) throw err;
        console.table(res);
        advancePrompts();
    });
};

function viewManagers() {
    connection.query(`SELECT managers.id AS ID, managers.mgr_full_name AS NAME, departments.dept_name AS DEPARTMENT
    FROM managers
    INNER JOIN mgr_roles ON mgr_roles.id = managers.role_id
    INNER JOIN departments ON departments.id = mgr_roles.dept_id`, function (err, res) {
        if (err) throw err;
        console.table(res);
        advancePrompts();
    });
};

function viewDepartments() {
    connection.query(`SELECT departments.id AS ID, departments.dept_name AS DEPARTMENT FROM companydb.departments;`, function (err, res) {
        if (err) throw err;
        console.table(res);
        advancePrompts();
    });
};

function viewRoles() {
    connection.query(`SELECT roles.id AS ID, roles.title AS ROLE, CONCAT('$', FORMAT(salary, "C")) AS SALARY, departments.dept_name AS DEPARTMENT FROM companydb.departments
	INNER JOIN roles ON roles.dept_id = departments.id`, function (err, res) {
        if (err) throw err;
        console.table(res);
        advancePrompts();
    });
};

function viewManagerRoles() {
    connection.query(`SELECT mgr_roles.id AS ID, mgr_roles.title AS ROLE, CONCAT('$', FORMAT(salary, "C")) AS SALARY, departments.dept_name AS DEPARTMENT FROM companydb.departments
	INNER JOIN mgr_roles ON mgr_roles.dept_id = departments.id`, function (err, res) {
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

function deleteDepartment() { console.log(deletedDepartmentName);
    connection.query(`DELETE FROM departments
    WHERE id = "${deletedDepartmentName}";`, function (err, res) {
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
};

function addManagerRole() {
    connection.query(`INSERT INTO mgr_roles (id, title, salary, dept_id)
    VALUES (${managerRoleID}, "${managerTitle}", "${managerSalary}", "${managerRoleDeptID}");`, function (err, res) {
        if (err) throw err;
        advancePrompts();
    });
}

function updateRole() {
    connection.query(`UPDATE roles
    SET title = "${updatedTitle}", salary = ${updatedSalary} 
    WHERE id = "${updatedRole}";`, function (err, res) {
        if (err) throw err;
        console.log(updatedTitle);
        console.log(updatedSalary);
        console.log(updatedRole);
        advancePrompts();
    });
}

function updateManagerRole() {
    connection.query(`UPDATE mgr_roles
    SET title = "${updatedManagerTitle}", salary = ${updatedManagerSalary} 
    WHERE id = "${updatedManagerRole}";`, function (err, res) {
        if (err) throw err;
        advancePrompts();
    });
};

function deleteRole() {
    connection.query(`DELETE FROM roles
    WHERE id = "${updatedRole}";`, function (err, res) {
        if (err) throw err;
        advancePrompts();
    });
}

function deleteManagerRole() {
    connection.query(`DELETE FROM mgr_roles
    WHERE id = "${updatedManagerRole}";`, function (err, res) {
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

function addManager() {
    connection.query(`INSERT INTO managers (id, mgr_first_name, mgr_last_name, role_id)
    VALUES (${managerID}, "${managerFname}", "${managerLname}", ${managerRoleID});`, function (err, res) {
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

function updateManager() {
    connection.query(`UPDATE managers
    SET mgr_first_name = "${updatedManagerFirstName}", mgr_last_name = "${updatedManagerLastName}", role_id = ${updatedManagerRoleID}
    WHERE mgr_full_name ="${updatedManager}";`, function (err, res) {
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

function deleteManager() {
    connection.query(`DELETE FROM managers
    WHERE mgr_full_name = "${updatedManager}";`, function (err, res) {
        if (err) throw err;
        updateFullName();
        advancePrompts();
    });
};

function viewBudgets() {
    connection.query(`SELECT roles.id AS ID, dept_name AS DEPARTMENT, CONCAT('$', FORMAT(SUM(salary), "C")) AS BUDGET, COUNT(dept_name) AS EMPLOYEES FROM companydb.departments 
    INNER JOIN roles ON roles.dept_id = departments.id
    WHERE departments.dept_name = "Customer Service"
    UNION
    SELECT roles.id AS ID, dept_name AS DEPARTMENT, CONCAT('$', FORMAT(SUM(salary), "C")) AS BUDGET, COUNT(dept_name) AS EMPLOYEES FROM companydb.departments 
    INNER JOIN roles ON roles.dept_id = departments.id
    WHERE departments.dept_name = "Finance"
    UNION
    SELECT roles.id AS ID, dept_name AS DEPARTMENT, CONCAT('$', FORMAT(SUM(salary), "C")) AS BUDGET, COUNT(dept_name) AS EMPLOYEES FROM companydb.departments 
    INNER JOIN roles ON roles.dept_id = departments.id
    WHERE departments.dept_name = "R&D"
    UNION
    SELECT roles.id AS ID, dept_name AS DEPARTMENT, CONCAT('$', FORMAT(SUM(salary), "C")) AS BUDGET, COUNT(dept_name) AS EMPLOYEES FROM companydb.departments 
    INNER JOIN roles ON roles.dept_id = departments.id
    WHERE departments.dept_name = "Human Resources";`, function (err, res) {
        if (err) throw err;
        console.table(res);
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

// make connection variable available to functions in external file
    //exports.connection = connection;