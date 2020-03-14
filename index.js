// Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var consoletable = require("console.table");
var colors = require("colors");

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
    console.log(appName.green);
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

const roleIDs = [];

const managers = [];

const managerIDs = [];

const employees = [];

const questions = [
    {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["View Employees", "View Employees By Department", "View Employees By Manager", "View Managers", "View Departments", "Add Department", "Delete Department".red, "View Roles", "Add Role", "Update Role", "Add Employee", "Update Employee", "View Budgets", "EXIT".red]
    },
    {
        type: "list",
        name: "deptChoice",
        message: "Select a department:",
        choices: departments,
        when: function (answers) {
            return answers.action === "View Employees By Department";
        }
    },
    {
        type: "list",
        name: "managerChoice",
        message: "Select a manager:",
        choices: managers,
        when: function (answers) {
            return answers.action === "View Employees By Manager";
        }
    },
    {
        type: "input",
        name: "deptID",
        message: "Enter a department ID:",
        when: function (answers) {
            return answers.action === "Add Department";
        }
    },
    {
        type: "input",
        name: "deptName",
        message: "Enter the department name:",
        when: function (answers) {
            return answers.action === "Add Department";
        }
    },
    {
        type: "list",
        name: "deptDeleteName",
        message: "Select department to delete:",
        choices: departments,
        when: function (answers) {
            return answers.action === "Delete Department";
        }
    },
    {
        type: "input",
        name: "roleID",
        message: "Enter a new role ID:",

        when: function (answers) {
            return answers.action === "Add Role";
        }
    },
    {
        type: "input",
        name: "roleTitle",
        message: "Enter a title for the new role:",

        when: function (answers) {
            return answers.action === "Add Role";
        }
    },
    {
        type: "input",
        name: "roleSalary",
        message: "Enter a salary for the new role:",
        when: function (answers) {
            return answers.action === "Add Role";
        }
    },
    {
        type: "list",
        name: "roleDeptID",
        message: "Select a department ID for the new role:",
        choices: departmentIDs,
        when: function (answers) {
            return answers.action === "Add Role";
        }
    },
    {
        type: "list",
        name: "roleUpdate",
        message: "Select a role:",
        choices: roles,
        when: function (answers) {
            return answers.action === "Update Role";
        }
    },
    {
        type: "list",
        name: "roleUpdateChoice",
        message: "Select an action:",
        choices: ["Update", "Delete".red],
        when: function (answers) {
            return answers.action === "Update Role";
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
        choices: roleIDs,
        when: function (answers) {
            return answers.roleUpdateChoice === "Update";
        }
    },
    {
        type: "input",
        name: "employeeID",
        message: "Enter new employee ID:",
        when: function (answers) {
            return answers.action === "Add Employee";
        }
    },
    {
        type: "input",
        name: "fname",
        message: "Enter the employee's first name:",
        when: function (answers) {
            return answers.action === "Add Employee";
        }
    },
    {
        type: "input",
        name: "lname",
        message: "Enter the employee's last name:",
        when: function (answers) {
            return answers.action === "Add Employee";
        }
    },
    {
        type: "list",
        name: "employeeRoleID",
        message: "Select a role:",
        choices: roleIDs,
        when: function (answers) {
            return answers.action === "Add Employee";
        }
    },
    {
        type: "list",
        name: "employeeManagerID",
        message: "Select a manager ID:",
        choices: managerIDs,
        when: function (answers) {
            return answers.action === "Add Employee";
        }
    },
    {
        type: "list",
        name: "updatedEmployee",
        message: "Select an employee:",
        choices: employees,
        when: function (answers) {
            return answers.action === "Update Employee";
        }
    },
    {
        type: "list",
        name: "employeeUpdateChoice",
        message: "Select an action:",
        choices: ["Update", "Delete".red],
        when: function (answers) {
            return answers.action === "Update Employee";
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
        choices: roleIDs,
        when: function (answers) {
            return answers.employeeUpdateChoice === "Update";
        }
    },
    {
        type: "list",
        name: "updatedEmployeeManagerID",
        message: "Update employee's manager ID:",
        choices: managerIDs,
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
    connection.query(`SELECT title, id FROM companydb.roles;`, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            roles.push(res[i].title);
            roleIDs.push(res[i].id);
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
            departments.push(answers.deptName);
            addDepartment();
        };

        if (answers.action === "Delete Department") {
            deleteDepartment();
        };

        if (answers.action === "Add Role") {
            addRole();
        };

        if (answers.action === "Update Role") {
            if (answers.roleUpdateChoice === "Update") {
                updateRole();
            } else if (answers.roleUpdateChoice === "Delete") {
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

        if (answers.action === "EXIT") {
            console.log("GOODBYE...");
            connection.end();
        };
    });
};

function viewEmployees() {
    connection.query(`SELECT managers.id AS ID, mgr_full_name AS NAME, roles.title AS ROLE, dept_name AS DEPARTMENT, CONCAT('$', FORMAT(salary, "C")) AS SALARY, "NA" AS MANAGER FROM managers
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
    connection.query(`SELECT employees.id AS ID, employees.full_name AS NAME, roles.title AS ROLE, departments.dept_name AS DEPARTMENT, CONCAT('$', FORMAT(salary, "C")) AS SALARY, managers.mgr_full_name AS MANAGER
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
    connection.query(`SELECT employees.id AS ID, employees.full_name AS NAME, roles.title AS ROLE, departments.dept_name AS DEPARTMENT, CONCAT('$', FORMAT(salary, "C")) AS SALARY
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

function viewManagers() {
    connection.query(`SELECT managers.id AS ID, managers.mgr_full_name AS NAME, departments.dept_name AS DEPARTMENT
    FROM managers
    INNER JOIN roles ON roles.id = managers.role_id
    INNER JOIN departments ON departments.id = roles.dept_id`, function (err, res) {
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
    SET title = "${updatedTitle}", salary = ${updatedSalary}
    WHERE title = "${updatedRole}";`, function (err, res) {
        if (err) throw err;
        advancePrompts();
    });
}

function deleteRole() {
    connection.query(`DELETE FROM roles
    WHERE title = "${updatedRole}";`, function (err, res) {
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

const appName =`
TTTTTTTTTTTTTTTTTTTTTTT                                                                                                                             
T:::::::::::::::::::::T                                                                              ,@&@&@@* 
T:::::::::::::::::::::T                                                                             &........@ 
T:::::TT:::::::TT:::::T                                                                             @........& 
TTTTTT  T:::::T  TTTTTTeeeeeeeeeeee    aaaaaaaaaaaaa      mmmmmmm    mmmmmmm                        ,........,
        T:::::T      ee::::::::::::ee  a::::::::::::a   mm:::::::m  m:::::::mm                       .......                           
        T:::::T     e::::::eeeee:::::eeaaaaaaaaa:::::a m::::::::::mm::::::::::m                      % .,.. %                             
        T:::::T    e::::::e     e:::::e         a::::a m::::::::::::::::::::::m                   &&&%,./* (@&&&                               
        T:::::T    e:::::::eeeee::::::e  aaaaaaa:::::a m:::::mmm::::::mmm:::::m                  &&&&%  /  (%&&&&                               
        T:::::T    e:::::::::::::::::e aa::::::::::::a m::::m   m::::m   m::::m                 &&&&&%  // (&&&&&                                
        T:::::T    e::::::eeeeeeeeeee a::::aaaa::::::a m::::m   m::::m   m::::m                 &&&&&&  // #&&&&&                                
        T:::::T    e:::::::e         a::::a    a:::::a m::::m   m::::m   m::::m                 &&&@&&, (. #&&@&&,                                
      TT:::::::TT  e::::::::e        a::::a    a:::::a m::::m   m::::m   m::::m                  ,&@&&@&&&&@&&@&(/                                 
      T:::::::::T   e::::::::eeeeeeeea:::::aaaa::::::a m::::m   m::::m   m::::m                 , . &&&&%&&&&& ./.                                 
      T:::::::::T    ee:::::::::::::e a::::::::::aa:::am::::m   m::::m   m::::m                     &&&&(&&&&&%&&%%                             
      TTTTTTTTTTT      eeeeeeeeeeeeee  aaaaaaaaaa  aaaammmmmm   mmmmmm   mmmmmm                     &&&&*&&&&&%#&%%
                                                                                                    &&&&.&&&&&%#%%%
TTTTTTTTTTTTTTTTTTTTTTT                                                       kkkkkkkk              &&&&.&&&&&                             
T:::::::::::::::::::::T                                                       k::::::k              %%#& &&&&&                             
T:::::::::::::::::::::T                                                       k::::::k           &&&&&&& &&&&&&&                                 
T:::::TT:::::::TT:::::T                                                       k::::::k                                                
TTTTTT  T:::::T  TTTTTTrrrrr   rrrrrrrrr   aaaaaaaaaaaaa      cccccccccccccccc k:::::k    kkkkkkk eeeeeeeeeeee    rrrrr   rrrrrrrrr   
        T:::::T        r::::rrr:::::::::r  a::::::::::::a   cc:::::::::::::::c k:::::k   k:::::kee::::::::::::ee  r::::rrr:::::::::r  
        T:::::T        r:::::::::::::::::r aaaaaaaaa:::::a c:::::::::::::::::c k:::::k  k:::::ke::::::eeeee:::::eer:::::::::::::::::r 
        T:::::T        rr::::::rrrrr::::::r         a::::ac:::::::cccccc:::::c k:::::k k:::::ke::::::e     e:::::err::::::rrrrr::::::r
        T:::::T         r:::::r     r:::::r  aaaaaaa:::::ac::::::c     ccccccc k::::::k:::::k e:::::::eeeee::::::e r:::::r     r:::::r
        T:::::T         r:::::r     rrrrrrraa::::::::::::ac:::::c              k:::::::::::k  e:::::::::::::::::e  r:::::r     rrrrrrr
        T:::::T         r:::::r           a::::aaaa::::::ac:::::c              k:::::::::::k  e::::::eeeeeeeeeee   r:::::r            
        T:::::T         r:::::r          a::::a    a:::::ac::::::c     ccccccc k::::::k:::::k e:::::::e            r:::::r            
      TT:::::::TT       r:::::r          a::::a    a:::::ac:::::::cccccc:::::ck::::::k k:::::ke::::::::e           r:::::r            
      T:::::::::T       r:::::r          a:::::aaaa::::::a c:::::::::::::::::ck::::::k  k:::::ke::::::::eeeeeeee   r:::::r            
      T:::::::::T       r:::::r           a::::::::::aa:::a cc:::::::::::::::ck::::::k   k:::::kee:::::::::::::e   r:::::r            
      TTTTTTTTTTT       rrrrrrr            aaaaaaaaaa  aaaa   cccccccccccccccckkkkkkkk    kkkkkkk eeeeeeeeeeeeee   rrrrrrr
`

function updateFullName() {
    connection.query(`UPDATE employees
    SET full_name = CONCAT(first_name, " ", last_name);`, function (err, res) {
        if (err) throw err;
    })
};

