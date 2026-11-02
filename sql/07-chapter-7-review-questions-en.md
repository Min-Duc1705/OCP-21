# Review Questions - Chapter 7: Joining Multiple Tables

> **Objective:** Assess your mastery of Chapter 7 (`INNER JOIN`, `LEFT/RIGHT/FULL OUTER JOIN`, `CROSS JOIN`, `SELF JOIN`, `NATURAL JOIN`, `USING`, `ON`, Oracle's legacy `(+)` operator, and `ON` vs. `WHERE` filtering traps) aligned with the **Oracle Database SQL (1Z0-071)** certification exam.  
> **Total Questions:** 25 multiple-choice questions with detailed answers and explanations.  
> **How to study:** Analyze each question and choose your answer before clicking **"👉 View Answer & Detailed Explanation"**.

---

### Question 1
**Given the `EMPLOYEES` table (`EMPLOYEE_ID`, `LAST_NAME`, `DEPARTMENT_ID`, `MANAGER_ID`) and the `DEPARTMENTS` table (`DEPARTMENT_ID`, `DEPARTMENT_NAME`, `MANAGER_ID`, `LOCATION_ID`), what happens when you execute the following SQL statement?**

```sql
SELECT e.last_name, d.department_name, d.department_id
FROM employees e
JOIN departments d USING (department_id);
```

* A. It executes successfully and returns employees along with their department name and ID.
* B. It fails with `ORA-25154: column part of USING clause cannot have qualifier` because `d.department_id` is qualified in the `SELECT` list.
* C. It fails because both tables also share the `MANAGER_ID` column, which is not listed in `USING`.
* D. It fails because the `INNER` keyword is missing before `JOIN`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Any column listed in a `USING (department_id)` clause **cannot be qualified** with a table name or table alias (`d.department_id`) anywhere in the query (`SELECT`, `WHERE`, `GROUP BY`, `ORDER BY`). Qualifying it raises `ORA-25154`.
  * **A, C, D are incorrect:** `department_id` must be written without any prefix.
</details>

---

### Question 2
**Using the same `EMPLOYEES` and `DEPARTMENTS` tables (which share both `DEPARTMENT_ID` and `MANAGER_ID`), which of the following queries is VALID and executes successfully?**

* A. `SELECT last_name, department_name, manager_id FROM employees JOIN departments USING (department_id);`
* B. `SELECT e.last_name, d.department_name, e.manager_id, department_id FROM employees e JOIN departments d USING (department_id);`
* C. `SELECT e.last_name, d.department_name, e.manager_id, d.department_id FROM employees e NATURAL JOIN departments d;`
* D. `SELECT e.last_name, d.department_name FROM employees e JOIN departments d USING (e.department_id);`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The `USING` column (`department_id`) is referenced without a qualifier, while the other shared column not in `USING` (`e.manager_id`) is properly qualified with a table alias to avoid ambiguity.
  * **A is incorrect:** `manager_id` exists in both tables and is not in `USING`, raising `ORA-00918: column ambiguously defined`.
  * **C and D are incorrect:** They illegally qualify columns used in `NATURAL JOIN` or `USING` (`ORA-25154`).
</details>

---

### Question 3
**Both `EMPLOYEES` and `DEPARTMENTS` contain the columns `DEPARTMENT_ID` and `MANAGER_ID`. Which `INNER JOIN ... ON` query is logically equivalent to the following `NATURAL JOIN` query?**

```sql
SELECT last_name, department_name
FROM employees
NATURAL JOIN departments;
```

* A. `SELECT e.last_name, d.department_name FROM employees e INNER JOIN departments d ON e.department_id = d.department_id;`
* B. `SELECT e.last_name, d.department_name FROM employees e INNER JOIN departments d ON e.department_id = d.department_id AND e.manager_id = d.manager_id;`
* C. `SELECT e.last_name, d.department_name FROM employees e INNER JOIN departments d ON e.department_id = d.department_id OR e.manager_id = d.manager_id;`
* D. `SELECT e.last_name, d.department_name FROM employees e CROSS JOIN departments d;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `NATURAL JOIN` automatically joins **all columns with matching names** across both tables using equality (`=`) combined with `AND` (`e.department_id = d.department_id AND e.manager_id = d.manager_id`).
  * **A, C, D are incorrect:** `NATURAL JOIN` does not stop at the first matching column name.
</details>

---

### Question 4
**What happens when you perform a `NATURAL JOIN` between `TABLE_A` (10 rows) and `TABLE_B` (20 rows) if the two tables have NO column names in common?**

* A. It fails with a compilation error because `NATURAL JOIN` requires at least one common column name.
* B. It returns 0 rows (`No rows selected`).
* C. It automatically performs a Cartesian product (`CROSS JOIN`) and returns `200` rows (`10 x 20`).
* D. It returns `30` rows (`10 + 20`).

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Classic 1Z0-071 exam trap! If two tables joined via `NATURAL JOIN` share no column names, Oracle does **not** raise an error; instead, it performs a Cartesian product (`CROSS JOIN`), returning $10 \times 20 = 200$ rows.
  * **A, B, D are incorrect:** `NATURAL JOIN` silently degrades into a `CROSS JOIN` when no common columns exist.
</details>

---

### Question 5
**What happens when you execute the following SQL statement?**

```sql
SELECT employees.last_name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id;
```

* A. It executes normally because `employees` is the actual table name.
* B. It fails with `ORA-00904: "EMPLOYEES"."LAST_NAME": invalid identifier`.
* C. It fails with `ORA-00918: column ambiguously defined`.
* D. It displays a warning but still returns the rows.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Once a table alias (`e`) is defined for `employees` in the `FROM` clause, you **must** use the alias `e` instead of the table name `employees` throughout the entire query. Referencing `employees.last_name` raises `ORA-00904`.
  * **A, C, D are incorrect:** Table aliases hide the original table name for qualification within that query block.
</details>

---

### Question 6
**The `EMPS` table has 4 rows (2 employees in dept `10`, 1 employee in dept `20`, and 1 employee with `DEPT_ID IS NULL`). The `DEPTS` table has 3 rows (depts `10`, `20`, and `30` which has no employees). How many rows are returned by the following `LEFT JOIN`, `RIGHT JOIN`, and `FULL OUTER JOIN` queries, respectively?**

```sql
-- 1. SELECT * FROM emps e LEFT JOIN depts d ON e.dept_id = d.dept_id;
-- 2. SELECT * FROM emps e RIGHT JOIN depts d ON e.dept_id = d.dept_id;
-- 3. SELECT * FROM emps e FULL OUTER JOIN depts d ON e.dept_id = d.dept_id;
```

* A. `4`, `3`, `7`
* B. `4`, `4`, `5`
* C. `3`, `3`, `5`
* D. `4`, `3`, `5`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * There are **3 matched rows** (2 employees in dept `10` + 1 employee in dept `20`).
    * **Query 1 (`LEFT JOIN`):** 3 matched rows + 1 unmatched employee (`DEPT_ID IS NULL`) = **`4` rows**.
    * **Query 2 (`RIGHT JOIN`):** 3 matched rows + 1 unmatched department (`dept_id = 30`) = **`4` rows**.
    * **Query 3 (`FULL OUTER JOIN`):** 3 matched rows + 1 unmatched employee + 1 unmatched department = **`5` rows**.
  * **A, C, D are incorrect:** In `RIGHT JOIN`, department `10` matches 2 employees, producing 2 rows for dept `10` plus 1 for dept `20` plus 1 for dept `30` = 4 rows.
</details>

---

### Question 7
**Using the same `EMPS` (4 rows: 2 in dept `10`, 1 in dept `20`, 1 with `NULL`) and `DEPTS` (depts `10, 20, 30`) tables, compare the row counts returned by the following two queries:**

```sql
-- Query 1 (Additional condition in ON):
SELECT e.emp_id, d.dname
FROM emps e
LEFT JOIN depts d ON (e.dept_id = d.dept_id AND d.dept_id = 10);

-- Query 2 (Additional condition in WHERE):
SELECT e.emp_id, d.dname
FROM emps e
LEFT JOIN depts d ON (e.dept_id = d.dept_id)
WHERE d.dept_id = 10;
```

* A. Both queries return `2` rows.
* B. Both queries return `4` rows.
* C. Query 1 returns `4` rows, whereas Query 2 returns only `2` rows.
* D. Query 1 returns `2` rows, whereas Query 2 returns `4` rows.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:**
    * In **Query 1**, `AND d.dept_id = 10` is inside the `ON` clause of a `LEFT JOIN`. `LEFT JOIN` **always preserves all 4 rows of the left table (`emps`)**, filling `d.dname` with `NULL` for rows not matching dept `10` $\rightarrow$ **`4` rows**.
    * In **Query 2**, `WHERE d.dept_id = 10` executes **after** the `LEFT JOIN` and filters out any row where `d.dept_id` is not `10` (including `NULL`s), turning the outer join into an `INNER JOIN` $\rightarrow$ **`2` rows**.
  * **A, B, D are incorrect:** Placing a filter on the outer-joined table in `WHERE` eliminates unmatched outer rows.
</details>

---

### Question 8
**Continuing with `LEFT JOIN`, suppose `EMPS` has 4 employees, and only 1 employee has `salary > 8000`. How many rows are returned by the following query where the filter on the LEFT table (`e.salary > 8000`) is placed inside the `ON` clause?**

```sql
SELECT e.emp_id, e.salary, d.dname
FROM emps e
LEFT JOIN depts d
       ON (e.dept_id = d.dept_id AND e.salary > 8000);
```

* A. Only `1` row (the employee with `salary > 8000`).
* B. All **`4` rows** of the `emps` table (only the employee with `salary > 8000` gets a matching `d.dname`, while the other 3 employees have `d.dname = NULL`).
* C. An error is raised because a single-table filter (`e.salary > 8000`) is not allowed inside `ON`.
* D. `0` rows.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Because `e.salary > 8000` is placed inside the `ON` clause of a `LEFT JOIN`, it only determines whether a row from `emps` joins to `depts` — it **never filters out rows from the preserved left table (`emps`)**! Thus all **4 rows** of `emps` are returned.
  * **A, C, D are incorrect:** To filter rows of the left table, `e.salary > 8000` must be placed in the `WHERE` clause.
</details>

---

### Question 9
**Which ANSI SQL statement is equivalent to the following query using Oracle's legacy outer join operator `(+)`?**

```sql
SELECT e.last_name, d.department_name
FROM employees e, departments d
WHERE e.department_id(+) = d.department_id;
```

* A. `SELECT e.last_name, d.department_name FROM employees e LEFT OUTER JOIN departments d ON e.department_id = d.department_id;`
* B. `SELECT e.last_name, d.department_name FROM employees e RIGHT OUTER JOIN departments d ON e.department_id = d.department_id;`
* C. `SELECT e.last_name, d.department_name FROM employees e FULL OUTER JOIN departments d ON e.department_id = d.department_id;`
* D. `SELECT e.last_name, d.department_name FROM employees e INNER JOIN departments d ON e.department_id = d.department_id;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The `(+)` operator is placed on the **deficient side** (the table where `NULL` rows are generated to match the preserved table). Since `(+)` is on `e.department_id(+)` (left table), all rows of `departments d` (right table) are preserved, which is `employees e RIGHT OUTER JOIN departments d`.
  * **A, C, D are incorrect:** `e.department_id = d.department_id(+)` would be a `LEFT OUTER JOIN`.
</details>

---

### Question 10
**Which of the following SQL statements using the Oracle `(+)` outer join operator is VALID and executes without error?**

* A. `SELECT * FROM emps e, depts d WHERE e.dept_id(+) = d.dept_id(+);`
* B. `SELECT * FROM emps e, depts d WHERE e.dept_id = d.dept_id(+) AND d.loc_id(+) = 1700;`
* C. `SELECT * FROM emps e, depts d WHERE e.dept_id = d.dept_id(+) OR d.loc_id = 1700;`
* D. `SELECT * FROM emps e, depts d WHERE e.dept_id(+) IN (10, 20);`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Applying `(+)` to both the join condition and additional constant filter on the deficient table (`d.loc_id(+) = 1700`) with `AND` is valid and preserves the outer join.
  * **A is incorrect:** `(+)` cannot be placed on both sides (`ORA-01468`).
  * **C and D are incorrect:** `(+)` cannot be combined with `OR` or `IN` (`ORA-01719`).
</details>

---

### Question 11
**In the `EMPLOYEES` table, `EMPLOYEE_ID` is the employee's ID and `MANAGER_ID` references the `EMPLOYEE_ID` of the employee's direct manager. Which query displays all employees and their manager's name, including the company President (whose `MANAGER_ID IS NULL`)?**

* A. `SELECT w.last_name, m.last_name FROM employees w JOIN employees m ON w.manager_id = m.employee_id;`
* B. `SELECT w.last_name, m.last_name FROM employees w LEFT JOIN employees m ON w.manager_id = m.employee_id;`
* C. `SELECT w.last_name, m.last_name FROM employees w LEFT JOIN employees m ON w.employee_id = m.manager_id;`
* D. `SELECT w.last_name, m.last_name FROM employees w RIGHT JOIN employees m ON w.manager_id = m.employee_id;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Using a `SELF JOIN` where `w` represents the worker and `m` represents the manager (`ON w.manager_id = m.employee_id`), a `LEFT JOIN` preserves the President in `w` whose `w.manager_id IS NULL`.
  * **A, C, D are incorrect:** A drops the President; C reverses the hierarchy; D preserves managers instead of workers.
</details>

---

### Question 12
**Given 3 tables `A` (5 rows), `B` (6 rows), and `C` (10 rows), what is the minimum number of `JOIN` conditions required to join all 3 tables without producing a Cartesian product?**

* A. `1` condition
* B. `2` conditions
* C. `3` conditions
* D. `4` conditions

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Joining $N$ tables without a Cartesian product requires at least **$N - 1$ join conditions**. For $N = 3$ tables, $3 - 1 = 2$ join conditions are required.
  * **A, C, D are incorrect:** They misapply the $N - 1$ rule.
</details>

---

### Question 13
**Table `A` has `5` rows, table `B` has `6` rows, and table `C` has `10` rows. Every row in `A` matches exactly 1 row in `B`. How many rows are returned by the following query?**

```sql
SELECT *
FROM a
JOIN b ON a.id = b.a_id
CROSS JOIN c;
```

* A. `30` rows
* B. `50` rows
* C. `300` rows
* D. `60` rows

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `a JOIN b ON a.id = b.a_id` produces `5` matched rows. Performing `CROSS JOIN c` (10 rows) multiplies those 5 rows by 10: $5 \times 10 =$ **`50` rows**.
  * **A, C, D are incorrect:** `A` and `B` are inner-joined (5 rows), not cross-joined.
</details>

---

### Question 14
**Given `EMPLOYEES(employee_id, last_name, salary)` and `SALARY_GRADES(grade_id, min_sal, max_sal)`, which SQL statement performs a valid Non-Equijoin to determine each employee's salary grade?**

* A. `SELECT e.last_name, s.grade_id FROM employees e NATURAL JOIN salary_grades s;`
* B. `SELECT e.last_name, s.grade_id FROM employees e JOIN salary_grades s USING (min_sal, max_sal);`
* C. `SELECT e.last_name, s.grade_id FROM employees e JOIN salary_grades s ON e.salary BETWEEN s.min_sal AND s.max_sal;`
* D. `SELECT e.last_name, s.grade_id FROM employees e JOIN salary_grades s WHERE e.salary >= s.min_sal AND e.salary <= s.max_sal;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** A Non-Equijoin (`BETWEEN ... AND ...`) using ANSI `JOIN` syntax must use the **`ON`** clause.
  * **A and B are incorrect:** `NATURAL JOIN` and `USING` only support equality (`=`) on identically named columns.
  * **D is incorrect:** The ANSI `JOIN` keyword requires an `ON` or `USING` clause before `WHERE` (`ORA-00905: missing keyword`).
</details>

---

### Question 15
**Why does the following SQL statement fail to compile?**

```sql
SELECT e.last_name, d.department_name
FROM employees e
JOIN departments d
WHERE e.department_id = d.department_id;
```

* A. Because the `INNER` keyword is missing before `JOIN`.
* B. Because in ANSI `JOIN` syntax, `JOIN` must be followed by an `ON` or `USING` clause; you cannot omit `ON` and place the join condition in `WHERE`.
* C. Because the two tables share column names, requiring `NATURAL JOIN`.
* D. The statement does not fail and executes normally.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In ANSI SQL, `FROM table1 JOIN table2` requires an **`ON`** or **`USING`** clause immediately following the joined table. Omitting `ON` and jumping straight to `WHERE` raises `ORA-00905: missing keyword`.
  * **A, C, D are incorrect:** Only comma-separated legacy joins (`FROM employees e, departments d WHERE ...`) put the join condition in `WHERE` without `ON`.
</details>

---

### Question 16
**You want to join 3 tables — `EMPLOYEES (e)`, `DEPARTMENTS (d)`, and `LOCATIONS (l)` — to display **all employees** (including those without a department), along with their department name and city if available. Which query is CORRECT?**

* A. `SELECT e.last_name, d.department_name, l.city FROM employees e LEFT JOIN departments d ON e.department_id = d.department_id INNER JOIN locations l ON d.location_id = l.location_id;`
* B. `SELECT e.last_name, d.department_name, l.city FROM employees e LEFT JOIN departments d ON e.department_id = d.department_id LEFT JOIN locations l ON d.location_id = l.location_id;`
* C. `SELECT e.last_name, d.department_name, l.city FROM employees e RIGHT JOIN departments d ON e.department_id = d.department_id RIGHT JOIN locations l ON d.location_id = l.location_id;`
* D. `SELECT e.last_name, d.department_name, l.city FROM employees e JOIN departments d ON e.department_id = d.department_id LEFT JOIN locations l ON d.location_id = l.location_id;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Once you use `LEFT JOIN` from `employees` to `departments` (producing `d.location_id = NULL` for unassigned employees), the subsequent join to `locations` **must also be a `LEFT JOIN`** so those `NULL` rows are not eliminated!
  * **A, C, D are incorrect:** In A, the second `INNER JOIN` eliminates all rows where `d.location_id IS NULL`.
</details>

---

### Question 17
**Given `DEPTS(dept_id, dname)` and `EMPS(emp_id, ename, dept_id)`, how does the number of columns returned by `SELECT *` differ between the following two queries?**

```sql
-- Query 1:
SELECT * FROM depts d JOIN emps e USING (dept_id);

-- Query 2:
SELECT * FROM depts d JOIN emps e ON d.dept_id = e.dept_id;
```

* A. Both queries return `5` columns.
* B. Both queries return `4` columns.
* C. Query 1 returns `4` columns (`DEPT_ID` appears only once as the first column), whereas Query 2 returns `5` columns (`DEPT_ID` appears twice).
* D. Query 1 fails because `SELECT *` cannot be used with `USING`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `USING (dept_id)` coalesces the common join column into a **single column** placed first in `SELECT *` (`4` columns total), whereas `ON d.dept_id = e.dept_id` keeps both tables' `dept_id` columns separate (`5` columns total).
  * **A, B, D are incorrect:** They miss the column-coalescing behavior of `USING` and `NATURAL JOIN`.
</details>

---

### Question 18
**Which of the following join syntaxes is VALID in Oracle SQL?**

* A. `SELECT * FROM employees NATURAL LEFT OUTER JOIN departments;`
* B. `SELECT * FROM employees NATURAL JOIN departments ON employee_id = manager_id;`
* C. `SELECT * FROM employees NATURAL JOIN departments USING (department_id);`
* D. `SELECT * FROM employees JOIN departments ON (department_id);`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** `NATURAL` can be combined with `LEFT [OUTER] JOIN`, `RIGHT [OUTER] JOIN`, or `FULL [OUTER] JOIN`.
  * **B and C are incorrect:** `NATURAL JOIN` cannot be combined with `ON` or `USING`.
  * **D is incorrect:** `ON` requires a boolean condition (`a = b`), not just a column name.
</details>

---

### Question 19
**You want to find all departments in `DEPARTMENTS` that currently have NO employees in `EMPLOYEES` (where `EMPLOYEE_ID` is the Primary Key of `EMPLOYEES`). Which `JOIN` query accomplishes this?**

```sql
-- EMPLOYEE_ID is the NOT NULL Primary Key of EMPLOYEES
```

* A. `SELECT d.department_id, d.department_name FROM departments d LEFT JOIN employees e ON (d.department_id = e.department_id AND e.employee_id IS NULL);`
* B. `SELECT d.department_id, d.department_name FROM departments d LEFT JOIN employees e ON d.department_id = e.department_id WHERE e.employee_id IS NULL;`
* C. `SELECT d.department_id, d.department_name FROM departments d INNER JOIN employees e ON d.department_id = e.department_id WHERE e.employee_id IS NULL;`
* D. `SELECT d.department_id, d.department_name FROM departments d RIGHT JOIN employees e ON d.department_id = e.department_id WHERE e.employee_id IS NULL;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `departments d LEFT JOIN employees e` preserves departments with no employees (setting `e.employee_id` to `NULL`), and `WHERE e.employee_id IS NULL` filters the result to keep only those unmatched departments.
  * **A, C, D are incorrect:** Putting `AND e.employee_id IS NULL` inside `ON` (Option A) makes the join condition false for all rows and returns **every** department in the table!
</details>

---

### Question 20
**The `COLORS` table has 3 rows and the `SIZES` table has 2 rows. Which of the following queries does NOT return 6 rows (a Cartesian product)?**

* A. `SELECT * FROM colors CROSS JOIN sizes;`
* B. `SELECT * FROM colors, sizes;`
* C. `SELECT * FROM colors JOIN sizes ON 1 = 1;`
* D. `SELECT * FROM colors JOIN sizes ON 1 = 2;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** `ON 1 = 2` is always `FALSE` for an `INNER JOIN`, so **0 rows** are returned.
  * **A, B, C are incorrect:** All three match every row of `COLORS` with every row of `SIZES`, returning $3 \times 2 = 6$ rows.
</details>

---

### Question 21
**Compare the following two queries using the Oracle `(+)` operator. How do their results differ?**

```sql
-- Query 1:
SELECT e.ename, d.dname
FROM emps e, depts d
WHERE e.dept_id = d.dept_id(+)
  AND d.loc_id(+) = 1700;

-- Query 2:
SELECT e.ename, d.dname
FROM emps e, depts d
WHERE e.dept_id = d.dept_id(+)
  AND d.loc_id = 1700;
```

* A. Query 1 fails with a syntax error because `(+)` cannot be used with a constant literal `1700`.
* B. Both queries return the exact same result set.
* C. Query 1 preserves the `LEFT OUTER JOIN` behavior (returning all rows of `emps`), whereas Query 2 degrades into an `INNER JOIN` (returning only employees in departments with `loc_id = 1700`).
* D. Query 1 is an `INNER JOIN`, whereas Query 2 is a `LEFT OUTER JOIN`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In legacy `(+)` syntax, omitting `(+)` on an additional filter referencing the deficient table (`d.loc_id = 1700` in Query 2) filters out the `NULL`-padded outer rows, turning the join into an `INNER JOIN`. Including `d.loc_id(+) = 1700` (Query 1) applies the filter as part of the outer join condition (like `ON ... AND d.loc_id = 1700`).
  * **A, B, D are incorrect:** This is a classic OCP/1Z0-071 trap on `(+)` predicates.
</details>

---

### Question 22
**In the `DEPARTMENTS` table, department `10` has `2` employees in `EMPLOYEES` (each earning `5000`) and `4` projects in `PROJECTS`. What value is returned for `TOTAL_SAL` by the following query?**

```sql
SELECT d.department_id, SUM(e.salary) AS total_sal
FROM departments d
JOIN employees e ON d.department_id = e.department_id
JOIN projects  p ON d.department_id = p.department_id
GROUP BY d.department_id;
```

* A. `10000`
* B. `20000`
* C. `40000`
* D. `5000`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Joining two independent 1-to-many child tables (`EMPLOYEES` and `PROJECTS`) to `DEPARTMENTS` creates a **Fan Trap** (Cartesian multiplication within each department): each of the 2 employees is paired with all 4 projects ($2 \times 4 = 8$ rows), so `SUM(e.salary)` adds `5000` eight times = **`40000`**!
  * **A, B, D are incorrect:** They overlook row multiplication across two 1-to-many joins.
</details>

---

### Question 23
**To prevent the Fan Trap row duplication in Question 22 when retrieving both total salary (`SUM(salary)`) and project count (`COUNT(proj_id)`) per department, which approach is always ACCURATE and SAFE?**

* A. Use `SUM(DISTINCT e.salary)` and `COUNT(DISTINCT p.proj_id)` in the 3-table join.
* B. Pre-aggregate `SUM(salary) ... GROUP BY department_id` on `EMPLOYEES` and `COUNT(*) ... GROUP BY department_id` on `PROJECTS` inside separate inline views (subqueries) before joining them to `DEPARTMENTS`.
* C. Replace `INNER JOIN` with `FULL OUTER JOIN`.
* D. Add a `HAVING COUNT(*) > 1` clause.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Pre-aggregating each 1-to-many child table by `department_id` in inline views reduces them to 1 row per department before joining, completely eliminating row duplication.
  * **A, C, D are incorrect:** `SUM(DISTINCT e.salary)` is buggy because two different employees in the same department can legitimately earn the same `5000` salary!
</details>

---

### Question 24
**Table `T1(id, val)` has 2 rows: `(1, 'A')`, `(NULL, 'B')`, and table `T2(id, name)` has 2 rows: `(1, 'X')`, `(NULL, 'Y')`. How many rows are returned by the following `INNER JOIN`?**

```sql
SELECT *
FROM t1
INNER JOIN t2 ON t1.id = t2.id;
```

* A. `1` row
* B. `2` rows (because `id IS NULL` in `T1` matches `id IS NULL` in `T2`)
* C. `4` rows
* D. `0` rows

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** In join conditions (`ON t1.id = t2.id`), `NULL = NULL` evaluates to `UNKNOWN` (not `TRUE`), so the `NULL` rows do not match each other. Only `id = 1` matches, returning **`1` row**.
  * **B, C, D are incorrect:** Standard equality joins never match `NULL` with `NULL`.
</details>

---

### Question 25
**Using the same `T1` (`(1, 'A')`, `(NULL, 'B')`) and `T2` (`(1, 'X')`, `(NULL, 'Y')`) tables from Question 24, how many rows are returned by the following `FULL OUTER JOIN`?**

```sql
SELECT *
FROM t1
FULL OUTER JOIN t2 ON t1.id = t2.id;
```

* A. `2` rows
* B. `3` rows
* C. `4` rows
* D. An error is raised because the join key contains `NULL`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * `(1, 'A')` matches `(1, 'X')` $\rightarrow$ **1 row**.
    * `(NULL, 'B')` in `T1` does not match `(NULL, 'Y')` in `T2`, so `FULL OUTER JOIN` preserves `(NULL, 'B', NULL, NULL)` as **1 row** and `(NULL, NULL, NULL, 'Y')` as **1 row**.
    * Total = $1 + 1 + 1 =$ **`3` rows**.
  * **A, C, D are incorrect:** The two unmatched `NULL` rows remain separate in a `FULL OUTER JOIN`.
</details>

---
