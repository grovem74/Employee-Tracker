function viewAllEmployees() {
    console.log("view employees function");
    connection.query(`SELECT departments.dept_name, employees.first_name, employees.last_name, roles.title
        FROM ((departments
        INNER JOIN roles ON roles.department_id = departments.id)
        INNER JOIN employees ON employees.role_id = roles.id)`, function (err, res) {
        if (err) throw err;
        console.log(res);
        connection.end();
    });
}

function viewEmployeesByDepartment() { };

function viewEmployeesByManager() { };

function createEmployee() { };

function createRole() { };

module.exports = viewAllEmployees;