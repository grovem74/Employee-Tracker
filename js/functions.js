var index = require("../index");

function advancePrompts() {
    return inquirer.prompt(advance).then(answers => {

        if (answers.continue === true) {
            askQuestions();
        } else {
            index.connection.end();
        };
    });
};

async function getDepartments() {
    index.connection.query(`SELECT id, dept_name FROM companydb.departments;`, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            departments.push(`${res[i].dept_name} - ${res[i].id}`);
        }
    })
};

function getRoles() {
    index.connection.query(`SELECT title, id FROM companydb.roles;`, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            roles.push(`${res[i].title} - ${res[i].id}`);
        }
    })
};

function getManagers() {
    index.connection.query(`SELECT mgr_full_name, id FROM companydb.managers;`, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            managers.push(`${res[i].mgr_full_name} - ${res[i].id}`);
        }
    })
};

function getEmployees() {
    index.connection.query(`SELECT first_name, last_name FROM companydb.employees;`, function (err, res) {
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
        employeeRole = answers.employeeRole;
        employeeRoleID = answers.employeeRoleID;
        employeeManagerID = answers.employeeManagerID;
        fname = answers.fname;
        lname = answers.lname;
        updatedEmployee = answers.updatedEmployee;
        updatedFirstName = answers.updatedFirstName;
        updatedLastName = answers.updatedLastName;
        updatedEmployeeRoleID = answers.updatedEmployeeRoleID;
        updatedEmployeeManagerID = answers.updatedEmployeeManagerID;

        if (answers.action === "View Employees") {
            viewEmployees();
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

        if (answers.action === "View Departments") {
            viewDepartments();
        };

        if (answers.action === "View Roles") {
            viewRoles();
        };

        if (answers.action === "Add Department") {
            departments.push(`${answers.deptName} - ${answers.deptID}`);
            addDepartment();
        };

        if (answers.action === "Delete Department".red) {
            deleteDepartment();
        };

        if (answers.action === "Add Role") {
            addRole();
        };

        if (answers.action === "Update Role") {
            if (answers.roleUpdateChoice === "Update") {
                updateRole();
            } else {
                deleteRole();
            }
        };

        if (answers.action === "Add Employee") {
            addEmployee();
        };

        if (answers.action === "Update Employee") {
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
            index.connection.end();
        };
    });
};

function viewEmployees() {
    index.connection.query(`SELECT managers.id AS ID, mgr_full_name AS NAME, roles.title AS ROLE, dept_name AS DEPARTMENT, CONCAT('$', FORMAT(salary, "C")) AS SALARY, "NA" AS MANAGER FROM managers
    INNER JOIN employees ON employees.manager_id = managers.id
    INNER JOIN roles ON roles.id = managers.role_id
    INNER JOIN departments ON departments.id = roles.dept_id
    UNION
    SELECT employees.id AS ID, full_name AS NAME, roles.title AS ROLE, dept_name AS DEPARTMENT, CONCAT('$', FORMAT(salary, "C")) AS SALARY, mgr_full_name AS MANAGER FROM employees
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
    index.connection.query(`SELECT employees.id AS ID, employees.full_name AS NAME, roles.title AS ROLE, departments.dept_name AS DEPARTMENT, CONCAT('$', FORMAT(salary, "C")) AS SALARY, managers.mgr_full_name AS MANAGER
    FROM (((departments
    INNER JOIN roles ON roles.dept_id = departments.id)
    INNER JOIN employees ON employees.role_id = roles.id)
    INNER JOIN managers ON managers.id = employees.manager_id)
    WHERE departments.id = "${departmentChoice}";`, function (err, res) {
        if (err) throw err;
        console.table(res);
        advancePrompts();
    });
};

function viewEmployeesByManager() {
    index.connection.query(`SELECT employees.id AS ID, employees.full_name AS NAME, roles.title AS ROLE, departments.dept_name AS DEPARTMENT, CONCAT('$', FORMAT(salary, "C")) AS SALARY
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
    index.connection.query(`SELECT managers.id AS ID, managers.mgr_full_name AS NAME, departments.dept_name AS DEPARTMENT
    FROM managers
    INNER JOIN roles ON roles.id = managers.role_id
    INNER JOIN departments ON departments.id = roles.dept_id`, function (err, res) {
        if (err) throw err;
        console.table(res);
        advancePrompts();
    });
};

function viewDepartments() {
    index.connection.query(`SELECT departments.id AS ID, departments.dept_name AS DEPARTMENT FROM companydb.departments;`, function (err, res) {
        if (err) throw err;
        console.table(res);
        advancePrompts();
    });
};

function viewRoles() {
    index.connection.query(`SELECT roles.id AS ID, roles.title AS ROLE, CONCAT('$', FORMAT(salary, "C")) AS SALARY, departments.dept_name AS DEPARTMENT FROM companydb.departments
	INNER JOIN roles ON roles.dept_id = departments.id`, function (err, res) {
        if (err) throw err;
        console.table(res);
        advancePrompts();
    });
};

function addDepartment() {
    index.connection.query(`INSERT INTO departments (id, dept_name)
    VALUES (${departmentID}, "${departmentName}");`, function (err, res) {
        if (err) throw err;
        advancePrompts();
    });
}

function deleteDepartment() { console.log(deletedDepartmentName);
    index.connection.query(`DELETE FROM departments
    WHERE id = "${deletedDepartmentName}";`, function (err, res) {
        if (err) throw err;
        advancePrompts();
    });
}

function addRole() {
    index.connection.query(`INSERT INTO roles (id, title, salary, dept_id)
    VALUES (${roleID}, "${title}", "${salary}", "${roleDeptID}");`, function (err, res) {
        if (err) throw err;
        advancePrompts();
    });
}

function updateRole() {
    index.connection.query(`UPDATE roles
    SET title = "${updatedTitle}", salary = ${updatedSalary} 
    WHERE id = "${updatedRole}";`, function (err, res) {
        if (err) throw err;
        console.log(updatedTitle);
        console.log(updatedSalary);
        console.log(updatedRole);
        advancePrompts();
    });
}

function deleteRole() {
    index.connection.query(`DELETE FROM roles
    WHERE id = "${updatedRole}";`, function (err, res) {
        if (err) throw err;
        advancePrompts();
    });
}

function addEmployee() {
    index.connection.query(`INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
    VALUES (${employeeID}, "${fname}", "${lname}", ${employeeRoleID}, ${employeeManagerID});`, function (err, res) {
        if (err) throw err;
        updateFullName();
        advancePrompts();
    });
};

function updateEmployee() {
    index.connection.query(`UPDATE employees
    SET first_name = "${updatedFirstName}", last_name = "${updatedLastName}", role_id = ${updatedEmployeeRoleID}, manager_id = ${updatedEmployeeManagerID}
    WHERE full_name="${updatedEmployee}";`, function (err, res) {
        if (err) throw err;
        updateFullName();
        advancePrompts();
    });
};

function deleteEmployee() {
    index.connection.query(`DELETE FROM employees
    WHERE full_name = "${updatedEmployee}";`, function (err, res) {
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

module.exports = {
    advancePrompts: advancePrompts,
    getDepartments: getDepartments,
    getRoles: getRoles,
    getManagers: getManagers,
    getEmployees: getEmployees,
    askQuestions: askQuestions,
    viewEmployees: viewEmployees,
    viewEmployeesByDepartment: viewEmployeesByDepartment,
    viewEmployeesByManager: viewEmployeesByManager,
    viewManagers: viewManagers,
    viewDepartments: viewDepartments,
    viewRoles: viewRoles,
    addDepartment: addDepartment,
    deleteDepartment: deleteDepartment,
    addRole: addRole,
    updateRole: updateRole,
    deleteRole: deleteRole,
    addEmployee: addEmployee,
    updateEmployee: updateEmployee,
    deleteEmployee: deleteEmployee,
    viewBudgets: viewBudgets,
    getInfo: getInfo,
    updateFullName: updateFullName
};