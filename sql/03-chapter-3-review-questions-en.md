# Review Questions - Chapter 3: Retrieving and Sorting Data with SELECT

> **Reference:** *OCA/OCP Oracle Database SQL Study Guide (Exam 1Z0-071)*.  
> **Total Questions:** 25 multiple-choice questions matching the Oracle SQL certification exam format with detailed explanations.  
> **How to study:** Read each question and select your answer first, then click **"👉 View Answer & Detailed Explanation"** to verify your choice and master the exam traps.

---

### Question 1
**Which of the following queries is VALID when using the `DISTINCT` keyword in Oracle SQL?**

* A. `SELECT department_id, DISTINCT job_id FROM employees;`
* B. `SELECT DISTINCT department_id, DISTINCT job_id FROM employees;`
* C. `SELECT DISTINCT department_id, job_id FROM employees;`
* D. `SELECT department_id, job_id DISTINCT FROM employees;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In a `SELECT` statement, the `DISTINCT` (or `UNIQUE`) keyword **must be placed immediately after the `SELECT` keyword** (before all columns) and can appear **at most once**. It eliminates duplicate combinations across all columns in the `SELECT` list (`(department_id, job_id)`).
  * **A, B, D are incorrect:** Placing `DISTINCT` before the second column, repeating `DISTINCT`, or placing it at the end of the `SELECT` list causes a syntax error (`ORA-00936: missing expression` or `ORA-00923`).
</details>

---

### Question 2
**Suppose the `CUSTOMERS` table has 5 rows where the `STATE_PROVINCE` column contains the values `'CA'`, `'TX'`, `NULL`, `'CA'`, and `NULL`. How many rows will the following query return?**

```sql
SELECT UNIQUE state_province
FROM customers;
```

* A. `2` rows (`'CA'`, `'TX'`)
* B. `3` rows (`'CA'`, `'TX'`, and 1 `NULL` row)
* C. `4` rows (`'CA'`, `'TX'`, and 2 `NULL` rows)
* D. A syntax error occurs because `UNIQUE` can only be used in `CREATE TABLE` constraints, not in `SELECT`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct (`3` rows):**
    1. In Oracle SQL, **`UNIQUE`** placed after `SELECT` is 100% synonymous with **`DISTINCT`**.
    2. When deduplicating rows with `DISTINCT` or `UNIQUE`, Oracle **treats multiple `NULL` values as duplicates of each other** and collapses them into **a single `NULL` row**.
    3. Thus, from the 5 rows (`'CA'`, `'TX'`, `NULL`, `'CA'`, `NULL`), the query returns **3 rows**: `'CA'`, `'TX'`, and `NULL`.
  * **A, C, D are incorrect:** Remember both that `SELECT UNIQUE` is valid in Oracle and that `DISTINCT`/`UNIQUE` groups multiple `NULL` values into one row.
</details>

---

### Question 3
**Which of the following queries using a Column Alias will FAIL with a syntax error in an Oracle Database?**

* A. `SELECT last_name AS "Employee Name" FROM employees;`
* B. `SELECT last_name "Employee_Name" FROM employees;`
* C. `SELECT last_name AS Employee Name FROM employees;`
* D. `SELECT last_name AS emp_name FROM employees;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct (Fails with syntax error):** When a Column Alias contains a **space** (`Employee Name`), it **must be enclosed in double quotation marks (`"Employee Name"`)**. Without double quotes (`AS Employee Name`), the SQL parser treats `Employee` as the alias and fails when it encounters `Name` before the `FROM` keyword (`ORA-00923: FROM keyword not found where expected`).
  * **A, B, D are incorrect (All valid):** The `AS` keyword is optional for column aliases, and double quotes `"..."` are required only when the alias contains spaces, special characters, or case sensitivity.
</details>

---

### Question 4
**Examine the following SQL query. Why does it fail with `ORA-00933: SQL command not properly ended` when executed in an Oracle Database?**

```sql
SELECT e.employee_id, e.last_name, e.salary
FROM employees AS e
WHERE e.department_id = 90;
```

* A. Because the table alias `e` is too short (Oracle requires table aliases to be at least 2 characters long).
* B. Because Oracle SQL does not allow the `AS` keyword when defining a Table Alias in the `FROM` clause.
* C. Because the `WHERE` clause cannot use the table alias prefix `e.department_id`.
* D. Because the table name `employees` must be written in uppercase (`EMPLOYEES`).

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** This is one of the most frequently tested Oracle SQL syntax rules on Exam 1Z0-071:
    * The **`AS`** keyword is optional and valid for **Column Aliases** in the `SELECT` list (`SELECT salary AS sal`).
    * However, for **Table Aliases** in the `FROM` clause, Oracle **forbids the `AS` keyword**! You must write `FROM employees e` (separated by whitespace). Writing `FROM employees AS e` raises `ORA-00933: SQL command not properly ended`.
  * **A, C, D are incorrect:** Single-character table aliases (`e`) and prefixed column references in `WHERE` (`e.department_id`) are completely valid.
</details>

---

### Question 5
**What happens when you execute the following query?**

```sql
SELECT employees.employee_id, e.last_name
FROM employees e
WHERE e.department_id = 60;
```

* A. It executes successfully and returns the employees in department 60.
* B. It fails with `ORA-00904: "EMPLOYEES"."EMPLOYEE_ID": invalid identifier` because once a table alias `e` is defined in the `FROM` clause, you cannot use the original table name `employees` as a column prefix in that query.
* C. It fails because the `AS` keyword is missing between `employees` and `e`.
* D. It displays only `last_name` and returns `NULL` for `employee_id`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In Oracle SQL, once you assign a Table Alias in the `FROM` clause (`FROM employees e`), that alias **replaces** the table name for the entire query. All qualified column references must use the alias (`e.employee_id`); qualifying a column with the original table name (`employees.employee_id`) raises `ORA-00904: invalid identifier`.
  * **A, C, D are incorrect:** Never mix a table alias and the original table name as column prefixes in the same query block.
</details>

---

### Question 6
**In a SQL query, a Column Alias defined in the `SELECT` list can be validly referenced in which of the following clauses?**

* A. The `WHERE` clause
* B. The `GROUP BY` clause
* C. The `HAVING` clause
* D. The `ORDER BY` clause

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** Based on the **Logical Query Processing Order**:
    `FROM` $\rightarrow$ `WHERE` $\rightarrow$ `GROUP BY` $\rightarrow$ `HAVING` $\rightarrow$ **`SELECT`** $\rightarrow$ **`ORDER BY`** $\rightarrow$ `OFFSET / FETCH`.
    Because Column Aliases are defined during the `SELECT` step (Step 5), only the **`ORDER BY`** clause (Step 6, evaluated after `SELECT`) can recognize and reference a Column Alias!
  * **A, B, C are incorrect:** `WHERE`, `GROUP BY`, and `HAVING` are all evaluated **before** `SELECT`, so referencing a Column Alias in any of them raises `ORA-00904: invalid identifier`.
</details>

---

### Question 7
**When the following query is executed, what column headings will be displayed in the output of SQL\*Plus / SQL Developer?**

```sql
SELECT first_name || ' ' || last_name AS emp_full_name,
       salary * 12 AS "Annual Salary"
FROM employees;
```

* A. `emp_full_name` and `Annual Salary`
* B. `EMP_FULL_NAME` and `ANNUAL SALARY`
* C. `EMP_FULL_NAME` and `Annual Salary`
* D. `emp_full_name` and `ANNUAL SALARY`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:**
    * The first alias `emp_full_name` is **unquoted**, so Oracle automatically converts it to all uppercase: **`EMP_FULL_NAME`**.
    * The second alias `"Annual Salary"` is **enclosed in double quotation marks `"..."`**, so Oracle preserves its exact case and spaces: **`Annual Salary`**.
  * **A, B, D are incorrect:** Unquoted aliases are always uppercased, whereas double-quoted aliases preserve exact casing.
</details>

---

### Question 8
**Suppose an employee has `salary = 2000`. What are the results of the two calculated expressions in the following query?**

```sql
SELECT salary + 100 * 12 AS expr1,
       (salary + 100) * 12 AS expr2
FROM employees
WHERE employee_id = 198;
```

* A. `EXPR1 = 25200`, `EXPR2 = 25200`
* B. `EXPR1 = 3200`, `EXPR2 = 25200`
* C. `EXPR1 = 25200`, `EXPR2 = 3200`
* D. `EXPR1 = 24100`, `EXPR2 = 25200`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Following arithmetic operator precedence:
    * **In `expr1` (`2000 + 100 * 12`):** Multiplication `*` has higher precedence than addition `+`, so `100 * 12 = 1200` is evaluated first, and `2000 + 1200` = **`3200`**.
    * **In `expr2` (`(2000 + 100) * 12`):** Parentheses `(...)` have the highest precedence, so `2000 + 100 = 2100` is evaluated first, and `2100 * 12` = **`25200`**.
  * **A, C, D are incorrect:** Always apply multiplication/division before addition/subtraction unless overridden by parentheses.
</details>

---

### Question 9
**To represent the character string `Manager's [Team] Report` containing both a single quote `'` and square brackets `[...]`, which of the following uses of the alternative quote operator `q'...'` are VALID? (Choose all that apply.)**

* A. `SELECT q'{Manager's [Team] Report}' FROM dual;`
* B. `SELECT q'!Manager's [Team] Report!' FROM dual;`
* C. `SELECT q'[Manager's [Team] Report]' FROM dual;`
* D. `SELECT q'<Manager's [Team] Report<' FROM dual;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, B**
* **Detailed Explanation:**
  * **A and B are correct:**
    * **A** uses paired curly braces `q'{...}'`, which is completely valid and avoids any conflict with `[...]`.
    * **B** uses matching exclamation marks `q'!...!'`, which is also completely valid.
  * **C is incorrect/unsafe:** Choosing `[` as the delimiter when `]` appears inside the string risks premature termination if `]'` occurs, and **D is invalid** because when the opening delimiter is one of `[`, `{`, `<`, `(`, the closing delimiter **must be the matching closing bracket** `]`, `}`, `>`, `)` (`q'<...>'`), so `q'<...<'` raises `ORA-01756: quoted string not properly terminated`.
</details>

---

### Question 10
**Which of the following statements will return the string `It's a sunny day` WITHOUT raising a syntax error in Oracle SQL? (Choose all that apply.)**

* A. `SELECT 'It''s a sunny day' FROM dual;`
* B. `SELECT q'[It's a sunny day]' FROM dual;`
* C. `SELECT 'It\'s a sunny day' FROM dual;`
* D. `SELECT "It's a sunny day" FROM dual;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, B**
* **Detailed Explanation:**
  * **A is correct:** Two consecutive single quotes `''` inside a string literal represent a single quote character `'`.
  * **B is correct:** The alternative quote operator `q'[...]'` allows single quotes to be written directly inside the string.
  * **C is incorrect:** Unlike C/Java/MySQL, backslash `\` is **not** an escape character for single quotes in Oracle SQL string literals; `'It\'s a sunny day'` raises `ORA-01756: quoted string not properly terminated`.
  * **D is incorrect:** Double quotes `"..."` denote an identifier, not a string literal (`ORA-00904: invalid identifier`).
</details>

---

### Question 11
**In an Oracle Database, when you execute `ORDER BY commission_pct` (without specifying `ASC`, `DESC`, `NULLS FIRST`, or `NULLS LAST`), where do rows with a `NULL` value in `commission_pct` appear in the output?**

* A. First (before all rows with numeric values).
* B. Last (after all rows with numeric values).
* C. They are automatically excluded from the result set when `ORDER BY` is used.
* D. They are sorted in the same position as the number `0`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    1. When no sort direction is specified in `ORDER BY`, the default direction is **`ASC` (Ascending)**.
    2. In Oracle Database, **`NULL` values are considered greater than all non-null values** for sorting purposes.
    3. Therefore, in ascending order (`ASC`), `NULL` values appear **LAST (`NULLS LAST`)** by default!
  * **A is incorrect:** `NULL` values appear first by default only when sorting in descending order (`ORDER BY commission_pct DESC`) or when `NULLS FIRST` is explicitly specified.
  * **C, D are incorrect:** `ORDER BY` never filters out `NULL` rows nor treats `NULL` as `0`.
</details>

---

### Question 12
**You want to display employees sorted by `COMMISSION_PCT` in descending order (highest to lowest), while placing all employees who have no commission (`COMMISSION_PCT IS NULL`) at the bottom of the list. Which `ORDER BY` clause is CORRECT?**

* A. `ORDER BY commission_pct DESC`
* B. `ORDER BY commission_pct DESC NULLS FIRST`
* C. `ORDER BY commission_pct DESC NULLS LAST`
* D. `ORDER BY commission_pct NULLS LAST DESC`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct (`ORDER BY commission_pct DESC NULLS LAST`):** Because `NULL` values sort to the top by default in a `DESC` sort (`NULLS FIRST`), you must explicitly specify `NULLS LAST` **immediately after** `DESC` to place `NULL` rows at the bottom.
  * **A and B are incorrect:** Both place `NULL` values at the top of the result set.
  * **D is incorrect:** Invalid syntax order! `NULLS FIRST` / `NULLS LAST` must appear **after** `ASC` / `DESC`; writing `NULLS LAST DESC` raises `ORA-00933`.
</details>

---

### Question 13
**Examine the following multi-column `ORDER BY` query. Which statement accurately describes how Oracle sorts the rows?**

```sql
SELECT department_id, job_id, salary
FROM employees
ORDER BY department_id, salary DESC;
```

* A. Both `department_id` and `salary` are sorted in descending order (`DESC`).
* B. `department_id` is sorted in descending order (`DESC`), and `salary` is sorted in ascending order (`ASC`).
* C. `department_id` is sorted in ascending order (`ASC`), and within each `department_id`, `salary` is sorted in descending order (`DESC`).
* D. A syntax error occurs because `department_id` does not specify `ASC` or `DESC`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In a multi-column `ORDER BY` clause, `ASC` and `DESC` apply **individually to each column**:
    * `department_id` has no modifier, so it defaults to **`ASC` (ascending)**.
    * For rows with the same `department_id`, `salary` is sorted in **`DESC` (descending)** order.
  * **A, B, D are incorrect:** `DESC` after the second column never applies backward to earlier columns in the `ORDER BY` list.
</details>

---

### Question 14
**Examine the following query that uses column position notation in the `ORDER BY` clause. What happens when it is executed?**

```sql
SELECT employee_id, last_name, salary
FROM employees
ORDER BY 4;
```

* A. It sorts the output by the 4th column of the `EMPLOYEES` table definition (`EMAIL`).
* B. It wraps around and sorts by the 1st column (`employee_id`).
* C. It executes successfully without sorting the rows.
* D. It fails with `ORA-01785: ORDER BY item must be the number of a SELECT-list expression`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** When an integer is used in the `ORDER BY` clause (positional notation), it refers to the **position of the expression in the `SELECT` list** (not the column position in the table!). Because the `SELECT` list has only **3 expressions** (`1: employee_id`, `2: last_name`, `3: salary`), `ORDER BY 4` is out of range and raises `ORA-01785`.
  * **A, B, C are incorrect:** To sort by a column not in the `SELECT` list, you must write the column name explicitly (`ORDER BY email`).
</details>

---

### Question 15
**Given the `EMPLOYEES` table, which of the following queries is VALID even though the column in the `ORDER BY` clause does not appear in the `SELECT` list?**

* A. `SELECT first_name, last_name FROM employees ORDER BY salary DESC;`
* B. `SELECT DISTINCT first_name, last_name FROM employees ORDER BY salary DESC;`
* C. `SELECT first_name, last_name FROM employees ORDER BY 3 DESC;`
* D. None of the above, because every column in `ORDER BY` must appear in the `SELECT` list.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** In a standard `SELECT` query (without `DISTINCT` or set operators like `UNION`), you **can** sort by any column in the queried table (`salary`) even if that column is not included in the `SELECT` list.
  * **B is incorrect:** When **`DISTINCT`** is specified in the `SELECT` clause, every column in `ORDER BY` **must** appear in the `SELECT` list (otherwise Oracle raises `ORA-01791: not a SELECTed expression`).
  * **C is incorrect:** There are only 2 columns in `SELECT`, so `ORDER BY 3` raises `ORA-01785`.
  * **D is incorrect:** Option A is valid.
</details>

---

### Question 16
**In Oracle's row-limiting clause (`OFFSET ... FETCH`), which of the following pairs of keywords are completely interchangeable without changing the meaning of the query? (Choose all that apply.)**

* A. `ROW` and `ROWS`
* B. `FIRST` and `NEXT`
* C. `ONLY` and `WITH TIES`
* D. `OFFSET` and `FETCH`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, B**
* **Detailed Explanation:**
  * **A and B are correct:** In the row-limiting clause (`OFFSET ... FETCH`), Oracle treats two pairs of keywords as 100% interchangeable synonyms for grammatical readability:
    1. **`ROW`** $\equiv$ **`ROWS`** (e.g., `OFFSET 1 ROWS` or `FETCH FIRST 5 ROW ONLY` are both valid).
    2. **`FIRST`** $\equiv$ **`NEXT`** (e.g., `FETCH NEXT 5 ROWS ONLY` without `OFFSET`, or `OFFSET 10 ROWS FETCH FIRST 5 ROWS ONLY` are both valid).
  * **C is incorrect:** `ONLY` and `WITH TIES` produce different results when duplicate sort values exist at the cutoff boundary.
  * **D is incorrect:** `OFFSET` skips rows, whereas `FETCH` retrieves rows.
</details>

---

### Question 17
**Suppose the `SCORES` table contains 6 rows with `POINTS` sorted in descending order: `100`, `95`, `90`, `90`, `90`, `85`. How many rows will the following query return?**

```sql
SELECT student_id, points
FROM scores
ORDER BY points DESC
FETCH FIRST 3 ROWS WITH TIES;
```

* A. `3` rows
* B. `4` rows
* C. `5` rows
* D. `6` rows

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct (`5` rows):**
    * `FETCH FIRST 3 ROWS` selects the first 3 rows with points `100`, `95`, and `90` (the 3rd row has `points = 90`).
    * Because **`WITH TIES`** is specified, Oracle also includes all subsequent rows that tie with the last fetched row (3rd row, `points = 90`) on the `ORDER BY` key.
    * Since the 4th row (`90`) and 5th row (`90`) also have `points = 90`, both are included, returning a total of **5 rows** (`100, 95, 90, 90, 90`).
  * **A, B, D are incorrect:** `FETCH FIRST 3 ROWS ONLY` would return exactly 3 rows.
</details>

---

### Question 18
**If you specify `FETCH FIRST 5 ROWS WITH TIES` in a query that does NOT have an `ORDER BY` clause, what happens?**

* A. A syntax error occurs because `WITH TIES` requires an `ORDER BY` clause.
* B. The query returns 0 rows.
* C. The query returns all rows in the table because without `ORDER BY`, all rows are considered tied.
* D. The query behaves identically to `FETCH FIRST 5 ROWS ONLY` (returning only the first 5 rows).

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** According to the Oracle SQL Language Reference, if you specify `WITH TIES` without an `ORDER BY` clause, no additional tied rows are returned — the clause behaves identically to `FETCH FIRST 5 ROWS ONLY` and returns 5 rows.
  * **A, B, C are incorrect:** No syntax error is raised when `WITH TIES` is used without `ORDER BY`.
</details>

---

### Question 19
**Suppose the `EMPLOYEES` table has 107 rows. How many rows will be returned when the following query is executed?**

```sql
SELECT employee_id, first_name, salary
FROM employees
WHERE ROWNUM = 5;
```

* A. `1` row (the 5th row in the table)
* B. `5` rows (rows 1 through 5)
* C. `0` rows (no rows selected)
* D. A syntax error occurs because `ROWNUM` cannot be used with the `=` operator.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct (`0` rows):** This is the most famous `ROWNUM` trap in Oracle SQL:
    * `ROWNUM` is assigned dynamically starting at `1` as each candidate row is fetched.
    * For the very first row fetched, `ROWNUM` is `1`. Oracle tests `WHERE ROWNUM = 5` (`1 = 5` $\rightarrow$ `FALSE`), so the row is discarded!
    * Because the first row was discarded, the next row fetched is also assigned `ROWNUM = 1`, which again fails `1 = 5`. Consequently, no row ever reaches `ROWNUM = 5`, and **0 rows** are returned.
  * **A, B, D are incorrect:** A top-level `WHERE` clause on `ROWNUM` only returns rows for `<`, `<=`, or `= 1`.
</details>

---

### Question 20
**Suppose the `EMPLOYEES` table contains exactly 100 rows. How many rows will the following query return?**

```sql
SELECT employee_id, last_name, salary
FROM employees
ORDER BY salary DESC
OFFSET 10 ROWS FETCH NEXT 5 PERCENT ROWS ONLY;
```

* A. `5` rows
* B. `4` rows
* C. `10` rows
* D. An error occurs because `OFFSET` (row count) cannot be combined with `FETCH ... PERCENT`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct (`5` rows):**
    1. `OFFSET n ROWS` can be freely combined with `FETCH NEXT p PERCENT ROWS ONLY`.
    2. Importantly, `5 PERCENT` is calculated as a percentage of the **total number of rows in the underlying query result set (100 rows)**, NOT the 90 rows remaining after the `OFFSET`!
    3. Therefore, `5%` of `100` rows = **`5` rows** (skipping rows 1–10 and returning rows 11–15).
  * **B, C, D are incorrect:** Note also that if the percentage calculation produces a fractional row count, Oracle rounds up (`CEIL`) to the next integer.
</details>

---

### Question 21
**What happens when you execute the following query containing `NULL` in the `FETCH` clause?**

```sql
SELECT employee_id, last_name
FROM employees
FETCH FIRST NULL ROWS ONLY;
```

* A. It returns all rows from the `EMPLOYEES` table.
* B. It returns only the first 1 row.
* C. It executes successfully and returns `0` rows.
* D. It fails with a syntax error because `NULL` is not allowed in the `FETCH` clause.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct (`0` rows):** According to Oracle's row-limiting clause specification, if the `rowcount` or `percent` expression in `FETCH` (or `offset` in `OFFSET`) evaluates to **`NULL`**, the query executes without error and **returns 0 rows**.
  * **A, B, D are incorrect:** Contrast this with omitting the number entirely (`FETCH FIRST ROW ONLY`), which defaults to `1` row.
</details>

---

### Question 22
**How many rows will the following query return when executed against the `EMPLOYEES` table (which has 107 rows)?**

```sql
SELECT employee_id, last_name, salary
FROM employees
ORDER BY salary DESC
FETCH FIRST ROW ONLY;
```

* A. `0` rows
* B. `1` row
* C. `107` rows
* D. A syntax error occurs because the number of rows is missing after the `FIRST` keyword.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct (`1` row):** In `FETCH { FIRST | NEXT } [ rowcount | percent PERCENT ] { ROW | ROWS } { ONLY | WITH TIES }`, the `rowcount` parameter is **optional**. When omitted (`FETCH FIRST ROW ONLY` or `FETCH NEXT ROWS ONLY`), Oracle defaults to **`1` row**!
  * **A, C, D are incorrect:** Omitting `rowcount` in `FETCH` is completely valid and returns 1 row.
</details>

---

### Question 23
**In Oracle SQL, if you want to calculate the remainder of dividing the `SALARY` column by `1000`, which query is CORRECT?**

* A. `SELECT salary % 1000 FROM employees;`
* B. `SELECT MOD(salary, 1000) FROM employees;`
* C. `SELECT salary MOD 1000 FROM employees;`
* D. `SELECT REMAINDER_DIV(salary, 1000) FROM employees;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In Oracle SQL, you must use the **`MOD(m, n)`** function (or `REMAINDER(m, n)`) to compute the remainder of a division.
  * **A is incorrect:** The `%` symbol in Oracle SQL is used **only** as a wildcard in `LIKE` (or `%TYPE`/`%ROWTYPE` attributes in PL/SQL), never as a modulo operator! Writing `salary % 1000` raises `ORA-00911: invalid character`.
  * **C, D are incorrect:** Neither an infix `MOD` operator nor `REMAINDER_DIV` exists in Oracle SQL.
</details>

---

### Question 24
**Which sequence represents the CORRECT Logical Query Processing Order of clauses in an Oracle SQL `SELECT` statement?**

* A. `SELECT` $\rightarrow$ `FROM` $\rightarrow$ `WHERE` $\rightarrow$ `GROUP BY` $\rightarrow$ `HAVING` $\rightarrow$ `ORDER BY` $\rightarrow$ `FETCH`
* B. `FROM` $\rightarrow$ `WHERE` $\rightarrow$ `GROUP BY` $\rightarrow$ `HAVING` $\rightarrow$ `SELECT` $\rightarrow$ `ORDER BY` $\rightarrow$ `FETCH`
* C. `FROM` $\rightarrow$ `SELECT` $\rightarrow$ `WHERE` $\rightarrow$ `GROUP BY` $\rightarrow$ `HAVING` $\rightarrow$ `ORDER BY` $\rightarrow$ `FETCH`
* D. `FROM` $\rightarrow$ `WHERE` $\rightarrow$ `SELECT` $\rightarrow$ `GROUP BY` $\rightarrow$ `HAVING` $\rightarrow$ `FETCH` $\rightarrow$ `ORDER BY`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The logical execution order of a SQL query is always:
    1. `FROM` (and `JOIN`): Identify and join source tables.
    2. `WHERE`: Filter individual rows.
    3. `GROUP BY`: Group filtered rows.
    4. `HAVING`: Filter aggregated groups.
    5. `SELECT`: Evaluate expressions, assign Column Aliases, and apply `DISTINCT`.
    6. `ORDER BY`: Sort the result set.
    7. `OFFSET / FETCH`: Skip and limit the final rows returned.
  * **A, C, D are incorrect:** Do not confuse the lexical order in which clauses are written with the logical order in which they are evaluated.
</details>

---

### Question 25
**What is the limitation of the `CONCAT` function compared to the concatenation operator `||` in Oracle SQL?**

* A. `CONCAT` cannot concatenate `VARCHAR2` columns; it only works with `CHAR`.
* B. `CONCAT(s1, s2)` accepts exactly 2 arguments (concatenating 3 strings requires nesting `CONCAT(CONCAT(s1, s2), s3)`), whereas `||` can chain any number of strings together.
* C. When passed a `NULL` argument, `CONCAT` returns `NULL`, whereas `||` ignores `NULL`.
* D. `CONCAT` can only be used in the `WHERE` clause, not in the `SELECT` clause.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In Oracle Database, the `CONCAT(char1, char2)` function **accepts strictly 2 arguments**! Passing 3 arguments such as `CONCAT(first_name, ' ', last_name)` raises `ORA-00909: invalid number of arguments`. In contrast, the `||` operator (`first_name || ' ' || last_name`) can concatenate any number of expressions.
  * **A, D are incorrect:** `CONCAT` works with all string types in both `SELECT` and `WHERE`.
  * **C is incorrect:** In Oracle, both `CONCAT('A', NULL)` and `'A' || NULL` ignore `NULL` and return `'A'` (unlike MySQL where `CONCAT('A', NULL)` returns `NULL`).
</details>
