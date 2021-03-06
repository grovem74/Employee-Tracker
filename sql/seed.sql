INSERT INTO departments (id, dept_name)
VALUES (11, "R&D");

INSERT INTO departments (id, dept_name)
VALUES (37, "Human Resources");

INSERT INTO departments (id, dept_name)
VALUES (93, "Finance");

INSERT INTO departments (id, dept_name)
VALUES (67, "Customer Service");


INSERT INTO roles (id, title, salary, dept_id)
VALUES (4944, "HR Rep", 63000, 37);

INSERT INTO roles (id, title, salary, dept_id)
VALUES (3898, "Analyst 1", 55000, 93);

INSERT INTO roles (id, title, salary, dept_id)
VALUES (3788, "Analyst 2", 60000, 93);

INSERT INTO roles (id, title, salary, dept_id)
VALUES (2946, "Customer Service Rep", 48000, 67);

INSERT INTO roles (id, title, salary, dept_id)
VALUES (3635, "Sr Engineer", 70000, 11);


INSERT INTO mgr_roles (id, title, salary, dept_id)
VALUES (6794, "Human Resources Manager", 65000, 37);

INSERT INTO mgr_roles (id, title, salary, dept_id)
VALUES (7813, "Finance Manager", 65000, 93);

INSERT INTO mgr_roles (id, title, salary, dept_id)
VALUES (2701, "Customer Service Manager", 65000, 67);

INSERT INTO mgr_roles (id, title, salary, dept_id)
VALUES (1947, "R&D Manager", 71000, 11);


INSERT INTO managers (id, mgr_first_name, mgr_last_name, role_id)
VALUES (284662, "Fred", "Thompson", 6794 );

INSERT INTO managers (id, mgr_first_name, mgr_last_name, role_id)
VALUES (329569, "Julia", "Fuego", 7813);

INSERT INTO managers (id, mgr_first_name, mgr_last_name, role_id)
VALUES (103645, "Sammy", "Alexander", 2701);

INSERT INTO managers (id, mgr_first_name, mgr_last_name, role_id)
VALUES (470465, "Richard", "Morris", 1947);


INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (265583, "Jessica", "Long", 2946, 103645);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (146395, "Mia", "Johnson", 3898, 329569);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (825469, "Mike", "Lewis", 4944, 284662);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (357829, "Carole", "Anderson", 3635, 470465);


UPDATE employees
SET full_name = CONCAT(first_name, " ", last_name);

UPDATE managers
SET mgr_full_name = CONCAT(mgr_first_name, " ", mgr_last_name)
