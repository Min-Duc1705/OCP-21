# Review Questions - Chapter 8: Subqueries

> **Objective:** Assess your mastery of Chapter 8 (Single-row, Multiple-row, and Multiple-column subqueries, `IN`, `NOT IN` & the `NULL` trap, `ANY`/`SOME`, `ALL`, `EXISTS`, `NOT EXISTS`, Correlated subqueries, Scalar subqueries, and Inline views) aligned with the **Oracle Database SQL (1Z0-071)** certification exam.  
> **Total Questions:** 25 multiple-choice questions with detailed answers and explanations.  
> **How to study:** Analyze each question and choose your answer before clicking **"👉 View Answer & Detailed Explanation"**.

---

### Question 1
**In the `EMPLOYEES` table, two employees have `LAST_NAME = 'King'`. What happens when you execute the following query?**

```sql
SELECT employee_id, last_name, salary
FROM employees
WHERE salary > (SELECT salary
                FROM employees
                WHERE last_name = 'King');
```

* A. It automatically compares against the higher salary of the two `'King'` employees.
* B. It automatically compares against the first `'King'` row found.
* C. It fails with `ORA-01427: single-row subquery returns more than one row`.
* D. It returns `0` rows (`No rows selected`).

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** The `>` operator is a **single-row comparison operator** and requires its subquery to return at most 1 row. Because two rows match `last_name = 'King'`, Oracle raises `ORA-01427: single-row subquery returns more than one row`.
  * **A, B, D are incorrect:** You must use `> ALL`, `> ANY`, or an aggregate function like `MAX(salary)` when the subquery can return multiple rows.
</details>

---

### Question 2
**What happens if the single-row subquery in the `WHERE` clause below returns `0` rows (no employee has `last_name = 'Zorro'`)?**

```sql
SELECT employee_id, last_name, salary
FROM employees
WHERE salary = (SELECT salary
                FROM employees
                WHERE last_name = 'Zorro');
```

* A. It fails with `ORA-01403: no data found`.
* B. It executes without error and returns `0` rows (`No rows selected`).
* C. It returns employees whose `salary IS NULL`.
* D. It fails with `ORA-01427`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In SQL, a single-row or scalar subquery that returns `0` rows evaluates to **`NULL`** without raising an error. The condition `WHERE salary = NULL` evaluates to `UNKNOWN` for all rows, so the outer query returns **`0` rows (`No rows selected`)**.
  * **A, C, D are incorrect:** `ORA-01403: no data found` is a PL/SQL `SELECT ... INTO` exception, not a SQL subquery error.
</details>

---

### Question 3
**The `EMPLOYEES` table has 107 employees. The company President has `MANAGER_ID IS NULL`, and 18 employees are managers of other employees. How many rows are returned by the following query intended to find employees who are NOT managers?**

```sql
SELECT employee_id, last_name
FROM employees
WHERE employee_id NOT IN (SELECT manager_id FROM employees);
```

* A. `89` rows (`107 - 18`)
* B. `88` rows
* C. `0` rows (`No rows selected`)
* D. An error is raised because `manager_id` contains `NULL`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** This is the #1 classic SQL exam trap!
    * Because the subquery `SELECT manager_id FROM employees` includes a `NULL` value, `employee_id NOT IN (100, 101, ..., NULL)` is evaluated as `employee_id <> 100 AND employee_id <> 101 AND ... AND employee_id <> NULL`.
    * Since `employee_id <> NULL` is always `UNKNOWN`, and `TRUE AND UNKNOWN` evaluates to `UNKNOWN`, the `WHERE` clause never evaluates to `TRUE` for any row, returning **`0` rows**!
  * **A, B, D are incorrect:** To get 89 rows, filter out `NULL` in the subquery (`WHERE manager_id IS NOT NULL`) or use `NOT EXISTS`.
</details>

---

### Question 4
**In contrast to Question 3, if `IN` is used instead of `NOT IN` on the same `EMPLOYEES` table (where `SELECT manager_id FROM employees` contains `NULL`), what happens when the following query is executed?**

```sql
SELECT employee_id, last_name
FROM employees
WHERE employee_id IN (SELECT manager_id FROM employees);
```

* A. It returns `0` rows because the subquery result contains `NULL`.
* B. It executes normally and returns all `18` employees who are managers.
* C. It returns `19` rows (including the row with `employee_id IS NULL`).
* D. It fails with a runtime error.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `employee_id IN (100, 101, ..., NULL)` expands using **`OR`**: `(employee_id = 100) OR (employee_id = 101) OR ... OR (employee_id = NULL)`. In three-valued logic, **`TRUE OR UNKNOWN` is `TRUE`**, so all 18 matching managers are returned normally.
  * **A, C, D are incorrect:** `NULL` in a subquery only breaks `NOT IN` and `ALL`, not `IN` or `ANY`.
</details>

---

### Question 5
**Suppose the subquery `(SELECT salary FROM employees WHERE job_id = 'IT_PROG')` returns three values: `4000`, `6000`, and `9000`. Which condition is equivalent to `WHERE salary > ANY (SELECT salary FROM employees WHERE job_id = 'IT_PROG')`?**

* A. `WHERE salary > 9000`
* B. `WHERE salary > 4000`
* C. `WHERE salary BETWEEN 4000 AND 9000`
* D. `WHERE salary < 4000`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `> ANY (4000, 6000, 9000)` means greater than **at least one** value in the set (`salary > 4000 OR salary > 6000 OR salary > 9000`), which is equivalent to being greater than the minimum value (**`> MIN`**, i.e., `salary > 4000`).
  * **A, C, D are incorrect:** `salary > 9000` (`> MAX`) corresponds to `> ALL`.
</details>

---

### Question 6
**Using the same subquery result set `(4000, 6000, 9000)`, what are `WHERE salary < ALL (SELECT salary ...)` and `WHERE salary < SOME (SELECT salary ...)` equivalent to, respectively?**

* A. `salary < 4000` and `salary < 9000`
* B. `salary < 9000` and `salary < 4000`
* C. `salary < 4000` and `salary < 4000`
* D. `salary > 9000` and `salary < 4000`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:**
    * `< ALL (4000, 6000, 9000)` means less than **every** value in the set (`< MIN`), which is **`salary < 4000`**.
    * `SOME` is an exact synonym for `ANY`. `< SOME (4000, 6000, 9000)` means less than **at least one** value in the set (`< MAX`), which is **`salary < 9000`**.
  * **B, C, D are incorrect:** They confuse `< ALL` (`< MIN`) with `< SOME`/`< ANY` (`< MAX`).
</details>

---

### Question 7
**If the subquery `(SELECT bonus FROM emp_bonus)` returns 3 rows with values `(500, 1000, NULL)`, which of the following queries can still return matching rows (i.e., is NOT forced to return 0 rows)?**

* A. `SELECT * FROM employees WHERE salary > ALL (SELECT bonus FROM emp_bonus);`
* B. `SELECT * FROM employees WHERE salary < ALL (SELECT bonus FROM emp_bonus);`
* C. `SELECT * FROM employees WHERE salary > ANY (SELECT bonus FROM emp_bonus);`
* D. `SELECT * FROM employees WHERE salary NOT IN (SELECT bonus FROM emp_bonus);`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `> ANY` uses `OR` logic (`salary > 500 OR salary > 1000 OR salary > NULL`), so any row with `salary > 500` evaluates to `TRUE`.
  * **A, B, D are incorrect:** `> ALL`, `< ALL`, and `NOT IN` (`<> ALL`) all use `AND` logic, which evaluates to `UNKNOWN` (returning 0 rows) whenever the subquery contains a `NULL`.
</details>

---

### Question 8
**Which of the following `WHERE` clauses has INVALID syntax in Oracle SQL?**

* A. `WHERE department_id = ANY (SELECT department_id FROM departments)`
* B. `WHERE department_id IN ANY (SELECT department_id FROM departments)`
* C. `WHERE department_id <> ALL (SELECT department_id FROM departments)`
* D. `WHERE department_id = SOME (SELECT department_id FROM departments)`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct (invalid syntax):** `ANY`, `SOME`, and `ALL` must be preceded by a standard comparison operator (`=`, `>`, `<`, `>=`, `<=`, `<>`, `!=`). Combining `IN ANY` or `IN ALL` is a syntax error.
  * **A, C, D are incorrect:** All three are valid (`= ANY` is equivalent to `IN`, `<> ALL` is equivalent to `NOT IN`, and `= SOME` is equivalent to `= ANY`).
</details>

---

### Question 9
**Examine the following query using `EXISTS`. What happens when it is executed?**

```sql
SELECT d.department_id, d.department_name
FROM departments d
WHERE EXISTS (SELECT NULL
              FROM employees e
              WHERE e.department_id = d.department_id);
```

* A. It returns `0` rows because `SELECT NULL` always evaluates to `NULL`.
* B. It fails with a syntax error because `SELECT NULL` has no column alias.
* C. It executes successfully and returns all departments that have at least one employee.
* D. It returns all departments that have no employees.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `EXISTS` only checks whether the subquery returns **at least one row**, completely ignoring what expression is in the subquery's `SELECT` list. Whether you write `SELECT 1`, `SELECT *`, or `SELECT NULL`, `EXISTS` returns `TRUE` whenever a matching row exists in `employees`.
  * **A, B, D are incorrect:** `SELECT NULL` inside `EXISTS` is a classic Oracle SQL convention and exam question.
</details>

---

### Question 10
**Building on Question 9, what happens when you execute the following query (assuming matching departments exist)?**

```sql
SELECT d.department_id, d.department_name
FROM departments d
WHERE EXISTS (SELECT 1/0
              FROM employees e
              WHERE e.department_id = d.department_id);
```

* A. It fails with `ORA-01476: divisor is equal to zero`.
* B. It executes successfully WITHOUT raising a divide-by-zero error and returns departments that have employees.
* C. It returns `0` rows.
* D. It fails with a compilation error.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Because `EXISTS` only checks row existence, the Oracle Optimizer does not evaluate the expressions in the `SELECT` list of the `EXISTS` subquery (`1/0` is never computed), so the query succeeds without error!
  * **A, C, D are incorrect:** `1/0` inside `SELECT` of an `EXISTS` subquery is bypassed by the engine.
</details>

---

### Question 11
**Which SQL query correctly finds all employees who earn more than the average salary of their own department?**

* A. `SELECT e1.last_name, e1.salary FROM employees e1 WHERE e1.salary > (SELECT AVG(e2.salary) FROM employees e2 GROUP BY e2.department_id);`
* B. `SELECT e1.last_name, e1.salary FROM employees e1 WHERE e1.salary > (SELECT AVG(e2.salary) FROM employees e2 WHERE e2.department_id = e1.department_id);`
* C. `SELECT e1.last_name, e1.salary FROM employees e1 WHERE e1.salary > AVG(e1.salary) GROUP BY e1.department_id;`
* D. `SELECT e1.last_name, e1.salary FROM employees e1 HAVING e1.salary > (SELECT AVG(salary) FROM employees);`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** A **correlated subquery** computes `AVG(e2.salary)` specifically for the outer employee's department (`WHERE e2.department_id = e1.department_id`).
  * **A, C, D are incorrect:** A raises `ORA-01427` (subquery returns one row per department); C puts `AVG` in `WHERE` (`ORA-00934`); D is invalid syntax and compares against the company-wide average.
</details>

---

### Question 12
**What is the difference between Pairwise Comparison (Query 1) and Non-Pairwise Comparison (Query 2) in the following multiple-column subqueries?**

```sql
-- Query 1 (Pairwise):
SELECT last_name FROM employees
WHERE (manager_id, department_id) IN (SELECT manager_id, department_id
                                      FROM employees WHERE employee_id IN (141, 174));

-- Query 2 (Non-Pairwise):
SELECT last_name FROM employees
WHERE manager_id    IN (SELECT manager_id    FROM employees WHERE employee_id IN (141, 174))
  AND department_id IN (SELECT department_id FROM employees WHERE employee_id IN (141, 174));
```

* A. Query 1 fails with a syntax error because Oracle does not allow two columns in parentheses before `IN`.
* B. Both queries always return the exact same result set under all data conditions.
* C. Query 1 requires both `manager_id` and `department_id` to match the same employee (`141` or `174`) simultaneously, whereas Query 2 also matches cross-combinations (such as employee `141`'s `manager_id` with employee `174`'s `department_id`), so Query 2 may return more rows than Query 1.
* D. Query 1 may return more rows than Query 2.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Pairwise comparison `WHERE (col1, col2) IN (SELECT col1, col2 ...)` enforces that `(col1, col2)` match as a pair from the same row, whereas non-pairwise comparison checks `col1` and `col2` independently, allowing cross-matched combinations.
  * **A, B, D are incorrect:** Pairwise comparisons are more restrictive than non-pairwise comparisons.
</details>

---

### Question 13
**In the following query using a Scalar Subquery in the `SELECT` list, what happens if an employee has a `department_id` that does not match any row in `DEPARTMENTS` (the scalar subquery returns `0` rows)?**

```sql
SELECT e.last_name,
       (SELECT d.department_name
        FROM departments d
        WHERE d.department_id = e.department_id) AS dept_name
FROM employees e;
```

* A. That employee's row is eliminated from the result set (like an `INNER JOIN`).
* B. That employee's row is still returned, and `DEPT_NAME` is `NULL` (behaving like a `LEFT OUTER JOIN`).
* C. It fails with `ORA-01403: no data found`.
* D. It fails with `ORA-01427`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** When a scalar subquery in the `SELECT` list returns `0` rows for a given outer row, it evaluates to **`NULL`**, preserving the outer row just like a `LEFT OUTER JOIN`.
  * **A, C, D are incorrect:** Scalar subqueries only raise an error if they return more than 1 row (`ORA-01427`) or more than 1 column (`ORA-00913`).
</details>

---

### Question 14
**In which of the following SQL clauses is a Scalar Subquery NOT allowed?**

* A. `SELECT` clause
* B. `ORDER BY` clause
* C. `GROUP BY` clause
* D. `CASE WHEN ... THEN ... END` expression

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In Oracle SQL, scalar subqueries are valid in `SELECT`, `WHERE`, `HAVING`, `ORDER BY`, and `CASE` expressions, but they are **not allowed in the `GROUP BY` clause**.
  * **A, B, D are incorrect:** All three support scalar subqueries.
</details>

---

### Question 15
**Why does the following query using an Inline View (a subquery in the `FROM` clause) fail to compile in Oracle Database?**

```sql
SELECT dept_stats.department_id, dept_stats.avg_sal
FROM (SELECT department_id, AVG(salary) AS avg_sal
      FROM employees
      GROUP BY department_id) AS dept_stats
WHERE dept_stats.avg_sal > 8000;
```

* A. Because `GROUP BY` cannot be used inside an inline view.
* B. Because in Oracle SQL, a table or inline view alias (`dept_stats`) in the `FROM` clause CANNOT be preceded by the `AS` keyword.
* C. Because the column alias `avg_sal` defined inside the inline view cannot be referenced in the outer `WHERE` clause.
* D. Because an inline view requires an `ORDER BY` clause.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In Oracle SQL, the `AS` keyword is allowed **only for column aliases**, never for table aliases or inline view aliases in the `FROM` clause! Writing `) AS dept_stats` raises `ORA-00933: SQL command not properly ended`. It must be written as `) dept_stats`.
  * **A, C, D are incorrect:** Note that column aliases defined inside an inline view (`avg_sal`) *can* be referenced in the outer query's `WHERE` clause.
</details>

---

### Question 16
**Which query correctly retrieves the top 5 highest-paid employees from the `EMPLOYEES` table using the `ROWNUM` pseudocolumn?**

* A. `SELECT last_name, salary FROM employees WHERE ROWNUM <= 5 ORDER BY salary DESC;`
* B. `SELECT last_name, salary FROM (SELECT last_name, salary FROM employees ORDER BY salary DESC) WHERE ROWNUM <= 5;`
* C. `SELECT last_name, salary FROM employees ORDER BY salary DESC WHERE ROWNUM <= 5;`
* D. `SELECT ROWNUM, last_name, salary FROM employees GROUP BY salary HAVING ROWNUM <= 5;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Because `ROWNUM` is assigned **before** `ORDER BY` in the same query block, you must sort the rows inside an inline view (`FROM (SELECT ... ORDER BY salary DESC)`) first and apply `WHERE ROWNUM <= 5` in the outer query.
  * **A, C, D are incorrect:** Option A picks 5 arbitrary rows first and then sorts those 5 rows.
</details>

---

### Question 17
**Which of the following SQL statements will fail because the `ORDER BY` clause is placed in an invalid subquery location?**

* A. `SELECT * FROM (SELECT last_name, salary FROM employees ORDER BY salary DESC) WHERE ROWNUM <= 10;`
* B. `SELECT last_name FROM employees WHERE department_id IN (SELECT department_id FROM departments WHERE location_id = 1700 ORDER BY department_id);`
* C. `SELECT last_name FROM employees WHERE department_id IN (SELECT department_id FROM departments WHERE location_id = 1700) ORDER BY last_name;`
* D. Both A and B fail.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct (fails with an error):** An `ORDER BY` clause is **not allowed inside a subquery in a `WHERE` or `HAVING` clause** (`ORA-00907: missing right parenthesis`). It *is* allowed inside an inline view in the `FROM` clause (Option A) and at the end of the outer query (Option C).
  * **A, C, D are incorrect:** Options A and C are valid.
</details>

---

### Question 18
**Given `DEPARTMENTS (d)` and `EMPLOYEES (e)` where a department can have multiple employees, compare the results of the following two queries:**

```sql
-- Query 1 (INNER JOIN):
SELECT d.department_id, d.department_name
FROM departments d
INNER JOIN employees e ON d.department_id = e.department_id;

-- Query 2 (IN / Semi-Join):
SELECT d.department_id, d.department_name
FROM departments d
WHERE d.department_id IN (SELECT e.department_id FROM employees e);
```

* A. Both queries always return the exact same number of rows.
* B. Query 1 can return duplicate department rows (if a department has more than 1 employee), whereas Query 2 returns each matching department at most once.
* C. Query 2 returns more rows than Query 1.
* D. Query 2 allows selecting columns from `employees` in the outer `SELECT` list.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `INNER JOIN` multiplies each department row by the number of matching employees in that department (requiring `DISTINCT` to deduplicate), whereas a semi-join (`IN` or `EXISTS`) checks each `departments` row once and never duplicates outer rows.
  * **A, C, D are incorrect:** Columns from a subquery in `WHERE` cannot be referenced in the outer `SELECT` list.
</details>

---

### Question 19
**Given `EMP(emp_id, dept_id)` and `DEPT(dept_id, dname, loc_id)`, suppose the column `LOC_ID` exists ONLY in `DEPT` and does NOT exist in `EMP`. What happens when you execute the following query?**

```sql
SELECT dname
FROM dept
WHERE dept_id IN (SELECT loc_id FROM emp);
```

* A. It fails with `ORA-00904: "LOC_ID": invalid identifier` because `EMP` has no `LOC_ID` column.
* B. It does NOT fail! Oracle resolves the unqualified `loc_id` column from the outer table (`DEPT`), turning the subquery into a correlated subquery!
* C. It returns `0` rows because `loc_id` does not exist in `EMP`.
* D. It automatically selects the first column of `EMP`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** By SQL column scoping rules, if an unqualified column (`loc_id`) in a subquery is not found in the subquery's table (`emp`), Oracle searches the enclosing outer query's table (`dept`). Because `dept.loc_id` exists, the query compiles without error as a correlated subquery! Always qualify columns with table aliases inside subqueries to prevent this silent bug.
  * **A, C, D are incorrect:** They miss SQL's inner-to-outer name resolution rule.
</details>

---

### Question 20
**Examine the following query with a subquery in the `HAVING` clause. What does this query do?**

```sql
SELECT department_id, AVG(salary)
FROM employees
GROUP BY department_id
HAVING AVG(salary) > (SELECT MAX(salary)
                      FROM employees
                      WHERE department_id = 30);
```

* A. It displays departments whose average salary is greater than the average salary of department 30.
* B. It displays departments whose average salary is greater than the maximum salary in department 30.
* C. It fails because `MAX` cannot be used inside a `HAVING` clause that already uses `AVG`.
* D. It fails with `ORA-00937: not a single-group group function`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The subquery returns the maximum salary in department 30, and the outer query filters grouped departments via `HAVING` to keep only those whose `AVG(salary)` exceeds that value.
  * **A, C, D are incorrect:** Subqueries in `HAVING` are completely valid.
</details>

---

### Question 21
**In Oracle SQL, what is the benefit of using the `WITH` clause (Subquery Factoring / Common Table Expression - CTE) as shown below?**

```sql
WITH dept_costs AS (
    SELECT d.department_name, SUM(e.salary) AS dept_total
    FROM employees e JOIN departments d ON e.department_id = d.department_id
    GROUP BY d.department_name
)
SELECT * FROM dept_costs
WHERE dept_total > (SELECT AVG(dept_total) FROM dept_costs);
```

* A. It improves readability only and never has any performance impact.
* B. It improves query readability and maintainability, and allows the Oracle Optimizer to materialize the `WITH` query block into an internal temporary table when referenced multiple times.
* C. It creates a permanent physical table in the schema like `CREATE TABLE`.
* D. It requires the `CREATE VIEW` privilege to execute.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The `WITH` clause avoids repeating the same inline view definition and enables the Oracle Optimizer to compute the result once (`TEMP TABLE TRANSFORMATION`) and reuse it across multiple references.
  * **A, C, D are incorrect:** `WITH` is scoped to the single query and requires no DDL privileges.
</details>

---

### Question 22
**What does the following correlated `UPDATE` statement do to departments in `DEPARTMENTS` that currently have NO employees in `EMPLOYEES`?**

```sql
UPDATE departments d
SET d.total_salary = (SELECT SUM(e.salary)
                      FROM employees e
                      WHERE e.department_id = d.department_id);
```

* A. It leaves their existing `total_salary` unchanged.
* B. It sets their `total_salary` to `0`.
* C. It sets their `total_salary` to `NULL` (because there is no `WHERE` clause on the outer `UPDATE` statement).
* D. It fails with an error and rolls back the statement.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Because the outer `UPDATE` has no `WHERE` clause, every row in `departments` is updated. For departments with no matching employees, `SELECT SUM(e.salary) ...` returns `NULL`, overwriting `d.total_salary` with `NULL`.
  * **A, B, D are incorrect:** Wrap the subquery in `NVL(..., 0)` or add `WHERE EXISTS (...)` to avoid setting unmatched rows to `NULL`.
</details>

---

### Question 23
**Given `PRODUCTS(prod_id, category_id, price)`, which query uses an Inline View and a `JOIN` to display each product's ID, price, and the average price of its category?**

* A. `SELECT p.prod_id, p.price, c.avg_price FROM products p JOIN (SELECT category_id, AVG(price) AS avg_price FROM products GROUP BY category_id) c ON p.category_id = c.category_id;`
* B. `SELECT p.prod_id, p.price, AVG(p.price) FROM products p GROUP BY p.category_id;`
* C. `SELECT p.prod_id, p.price, c.avg_price FROM products p JOIN (SELECT category_id, AVG(price) AS avg_price FROM products) c ON p.category_id = c.category_id;`
* D. `SELECT p.prod_id, p.price FROM products p WHERE p.price = (SELECT category_id, AVG(price) FROM products GROUP BY category_id);`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** The inline view `c` computes `AVG(price) AS avg_price` grouped by `category_id`, and joining `products p` to `c` on `category_id` displays both the individual product details and its category average.
  * **B, C, D are incorrect:** B raises `ORA-00979`; C raises `ORA-00937` inside the inline view; D raises `ORA-00913: too many values`.
</details>

---

### Question 24
**Which error is raised when you execute the following SQL statement?**

```sql
SELECT employee_id, last_name
FROM employees
WHERE department_id = (SELECT department_id, department_name
                       FROM departments
                       WHERE department_id = 10);
```

* A. `ORA-01427: single-row subquery returns more than one row`
* B. `ORA-00913: too many values`
* C. `ORA-00904: invalid identifier`
* D. No error is raised; Oracle automatically compares against the first column (`department_id`)

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Comparing a single expression (`department_id`) against a subquery that returns **2 columns** (`department_id, department_name`) raises `ORA-00913: too many values`.
  * **A, C, D are incorrect:** `ORA-01427` is for too many rows; `ORA-00913` is for too many columns.
</details>

---

### Question 25
**To find all `department_id` values in `DEPARTMENTS` that do not appear in `EMPLOYEES` (even when `EMPLOYEES.DEPARTMENT_ID` contains `NULL` values), which of the following queries are ACCURATE and NULL-SAFE?**

```sql
-- Query 1:
SELECT department_id FROM departments d
WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.department_id);

-- Query 2:
SELECT department_id FROM departments
WHERE department_id NOT IN (SELECT department_id FROM employees);

-- Query 3:
SELECT department_id FROM departments
WHERE department_id NOT IN (SELECT department_id FROM employees WHERE department_id IS NOT NULL);
```

* A. Query 1 only
* B. Queries 1 and 2 only
* C. Queries 1 and 3 only
* D. Queries 1, 2, and 3

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct (Queries 1 and 3):** `NOT EXISTS` (Query 1) is naturally immune to `NULL` values in the subquery, and `NOT IN` with `WHERE department_id IS NOT NULL` (Query 3) explicitly removes `NULL` values from the subquery list.
  * **A, B, D are incorrect:** Query 2 (`NOT IN` without filtering out `NULL`s) returns `0` rows whenever `employees.department_id` contains a `NULL`.
</details>

---
