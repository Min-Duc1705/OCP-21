# Review Questions - Chapter 6: Aggregate Functions and GROUP BY

> **Objective:** Assess your mastery of Chapter 6 (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `LISTAGG`, `GROUP BY`, `HAVING`, `NULL` handling in group functions, and 2-level nested aggregate functions) aligned with the **Oracle Database SQL (1Z0-071)** certification exam.  
> **Total Questions:** 25 multiple-choice questions with detailed answers and explanations.  
> **How to study:** Analyze each question and choose your answer before clicking **"👉 View Answer & Detailed Explanation"**.

---

### Question 1
**The `EMPLOYEES` table contains the columns `LAST_NAME` (`VARCHAR2`), `HIRE_DATE` (`DATE`), and `SALARY` (`NUMBER`). Which of the following SQL statements will execute SUCCESSFULLY without error?**

* A. `SELECT SUM(hire_date), AVG(salary) FROM employees;`
* B. `SELECT MIN(last_name), MAX(hire_date), COUNT(salary) FROM employees;`
* C. `SELECT AVG(last_name), MIN(salary) FROM employees;`
* D. `SELECT MAX(hire_date), AVG(hire_date) FROM employees;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `MIN`, `MAX`, and `COUNT` accept arguments of any comparable data type (`NUMBER`, `VARCHAR2`, `DATE`, `TIMESTAMP`).
  * **A, C, D are incorrect:** `SUM` and `AVG` **only accept numeric (`NUMBER`) arguments**. Passing `DATE` (`hire_date`) or `VARCHAR2` (`last_name`) raises `ORA-00932` or `ORA-01722`.
</details>

---

### Question 2
**The `SALES_BONUS` table has exactly 4 rows with `BONUS` values of `100`, `200`, `300`, and `NULL`. What is the output of the following query?**

```sql
SELECT AVG(bonus)          AS a1,
       AVG(NVL(bonus, 0))  AS a2,
       COUNT(bonus)        AS c1,
       COUNT(*)            AS c2
FROM sales_bonus;
```

* A. `A1 = 150`, `A2 = 150`, `C1 = 3`, `C2 = 4`
* B. `A1 = 200`, `A2 = 150`, `C1 = 3`, `C2 = 4`
* C. `A1 = NULL`, `A2 = 150`, `C1 = 3`, `C2 = 4`
* D. `A1 = 200`, `A2 = 200`, `C1 = 4`, `C2 = 4`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Aggregate functions (except `COUNT(*)`) **ignore `NULL` values**:
    * `AVG(bonus)` averages only the 3 non-null rows: `(100 + 200 + 300) / 3 = 200`.
    * `AVG(NVL(bonus, 0))` converts the `NULL` to `0` first, averaging all 4 rows: `(100 + 200 + 300 + 0) / 4 = 150`.
    * `COUNT(bonus)` counts non-null values (`3`), while `COUNT(*)` counts all rows (`4`).
  * **A, C, D are incorrect:** They misapply `NULL` handling in `AVG` and `COUNT(col)`.
</details>

---

### Question 3
**The `TEST_DATA` table contains 5 rows where the `VAL` column has the values: `10`, `10`, `20`, `NULL`, `NULL`. What is returned by the following SQL statement?**

```sql
SELECT COUNT(*)            AS r1,
       COUNT(1)            AS r2,
       COUNT(val)          AS r3,
       COUNT(DISTINCT val) AS r4,
       SUM(DISTINCT val)   AS r5
FROM test_data;
```

* A. `R1 = 5`, `R2 = 5`, `R3 = 3`, `R4 = 2`, `R5 = 30`
* B. `R1 = 5`, `R2 = 5`, `R3 = 3`, `R4 = 3`, `R5 = 40`
* C. `R1 = 5`, `R2 = 3`, `R3 = 3`, `R4 = 2`, `R5 = 30`
* D. `R1 = 3`, `R2 = 3`, `R3 = 3`, `R4 = 2`, `R5 = 30`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:**
    * `COUNT(*)` and `COUNT(1)` count all 5 rows (`R1 = 5`, `R2 = 5`).
    * `COUNT(val)` counts the 3 non-null values (`10, 10, 20`) $\rightarrow$ `R3 = 3`.
    * `COUNT(DISTINCT val)` counts unique non-null values (`10` and `20`) $\rightarrow$ `R4 = 2`.
    * `SUM(DISTINCT val)` sums the unique non-null values (`10 + 20`) $\rightarrow$ `R5 = 30`.
  * **B, C, D are incorrect:** `COUNT(1)` does not refer to the first column, and `DISTINCT` inside aggregate functions ignores `NULL`.
</details>

---

### Question 4
**Which statement is TRUE regarding the difference between `COUNT(*)` and `COUNT(1)` in Oracle Database?**

* A. `COUNT(1)` is faster than `COUNT(*)` because it only reads the first column of the table instead of all columns.
* B. `COUNT(1)` counts non-null values in the first column of the table.
* C. `COUNT(*)` and `COUNT(1)` produce identical results and are executed with the exact same execution plan by the Oracle Cost-Based Optimizer (CBO).
* D. `COUNT(1)` is invalid if the table does not have a Primary Key.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In `COUNT(1)`, `1` is a non-null literal constant, not a column position. The Oracle Optimizer internally rewrites `COUNT(1)` to `COUNT(*)`, resulting in the exact same execution plan and performance.
  * **A, B, D are incorrect:** These are common SQL myths.
</details>

---

### Question 5
**What happens when you execute the following SQL statement?**

```sql
SELECT department_id, job_id, AVG(salary)
FROM employees
GROUP BY department_id;
```

* A. It succeeds and displays the first `job_id` found for each `department_id`.
* B. It succeeds and displays `NULL` for the `job_id` column.
* C. It fails with `ORA-00979: not a GROUP BY expression`.
* D. It fails with `ORA-00934: group function is not allowed here`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Every non-aggregated column in the `SELECT` list (`department_id` and `job_id`) **must** be included in the `GROUP BY` clause. Because `job_id` is missing from `GROUP BY department_id`, Oracle raises `ORA-00979: not a GROUP BY expression`.
  * **A, B, D are incorrect:** Oracle strictly enforces `GROUP BY` column rules.
</details>

---

### Question 6
**Examine the following query on the `EMPLOYEES` table. What happens when it is executed?**

```sql
SELECT COUNT(*), SUM(salary)
FROM employees
GROUP BY department_id;
```

* A. It fails because `department_id` is in the `GROUP BY` clause but not in the `SELECT` list.
* B. It returns only 1 summary row for the entire `EMPLOYEES` table.
* C. It executes successfully and returns the employee count and total salary for each `department_id` (one row per department, without displaying the `department_id`).
* D. It fails with `ORA-00937: not a single-group group function`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** While non-aggregated columns in the `SELECT` list must appear in `GROUP BY`, columns in the `GROUP BY` clause **do not have to appear in the `SELECT` list**. The query still groups by `department_id` and returns one row per group.
  * **A, B, D are incorrect:** Omitting the grouping column from the `SELECT` list is completely legal in Oracle SQL.
</details>

---

### Question 7
**Why does the following SQL statement fail when executed?**

```sql
SELECT department_id AS dept_no, AVG(salary) AS avg_sal
FROM employees
GROUP BY dept_no
ORDER BY avg_sal DESC;
```

* A. Because column aliases (`avg_sal`) cannot be used in the `ORDER BY` clause.
* B. Because column aliases (`dept_no`) cannot be used in the `GROUP BY` clause.
* C. Because `AVG(salary)` must be wrapped in `ROUND` before sorting.
* D. Because a `HAVING` clause is required whenever `GROUP BY` is used.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Logically, `GROUP BY` is evaluated **before** `SELECT`, so the column alias `dept_no` is not yet recognized in `GROUP BY`, raising `ORA-00904: "DEPT_NO": invalid identifier`.
  * **A, C, D are incorrect:** Column aliases are valid in `ORDER BY` because `ORDER BY` is evaluated after `SELECT`.
</details>

---

### Question 8
**The `EMPLOYEES` table has 107 rows, including 3 employees who are not assigned to any department (`DEPARTMENT_ID IS NULL`). How are those 3 rows handled by the following query?**

```sql
SELECT department_id, COUNT(*)
FROM employees
GROUP BY department_id;
```

* A. The `GROUP BY` clause automatically ignores all rows where `DEPARTMENT_ID IS NULL`.
* B. Each row with `DEPARTMENT_ID IS NULL` forms its own separate group (3 rows with `COUNT(*) = 1`) because `NULL` never equals `NULL`.
* C. All 3 rows with `DEPARTMENT_ID IS NULL` are placed into a single `NULL` group, returning 1 row with `department_id = NULL` and `COUNT(*) = 3`.
* D. The query fails because a `GROUP BY` column cannot contain `NULL` values.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** The `GROUP BY` clause treats all `NULL` values in the grouping column as **equal**, grouping all 3 unassigned employees into one group with `department_id = NULL` and `COUNT(*) = 3`.
  * **A, B, D are incorrect:** `GROUP BY` never discards `NULL` groups.
</details>

---

### Question 9
**Which SQL statement correctly retrieves departments with a total salary (`SUM(salary)`) greater than `50000`, considering only departments whose `department_id` is greater than `20`?**

* A. `SELECT department_id, SUM(salary) FROM employees WHERE department_id > 20 AND SUM(salary) > 50000 GROUP BY department_id;`
* B. `SELECT department_id, SUM(salary) FROM employees WHERE department_id > 20 GROUP BY department_id HAVING SUM(salary) > 50000;`
* C. `SELECT department_id, SUM(salary) FROM employees HAVING SUM(salary) > 50000 AND salary > 20 GROUP BY department_id;`
* D. `SELECT department_id, SUM(salary) FROM employees GROUP BY department_id WHERE department_id > 20 HAVING SUM(salary) > 50000;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Row-level conditions (`department_id > 20`) belong in the `WHERE` clause (before `GROUP BY`), while group-level conditions involving aggregate functions (`SUM(salary) > 50000`) must be placed in the `HAVING` clause.
  * **A, C, D are incorrect:** A puts `SUM` in `WHERE` (`ORA-00934`); C references ungrouped `salary` in `HAVING` (`ORA-00979`); D places `WHERE` after `GROUP BY`.
</details>

---

### Question 10
**What happens when you execute the following SQL query in Oracle Database?**

```sql
SELECT department_id, COUNT(*)
FROM employees
HAVING COUNT(*) >= 5
GROUP BY department_id;
```

* A. It fails with a syntax error because `HAVING` must be written after `GROUP BY`.
* B. It executes successfully and returns departments with 5 or more employees.
* C. It fails because `COUNT(*)` in `HAVING` does not have an alias.
* D. It returns all departments because `HAVING` executes before `GROUP BY`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In Oracle SQL syntax, `HAVING` can be written **either before or after** `GROUP BY`. Regardless of syntactic order, Oracle logically groups the rows via `GROUP BY` first and applies the `HAVING` filter afterward.
  * **A, C, D are incorrect:** Placing `HAVING` immediately before `GROUP BY` is a classic 1Z0-071 exam trap that is completely valid in Oracle.
</details>

---

### Question 11
**Which of the following SQL statements is VALID when using the `HAVING` clause?**

```sql
-- Table structure: EMPLOYEES(employee_id, last_name, job_id, department_id, salary)
```

* A. `SELECT department_id, AVG(salary) FROM employees GROUP BY department_id HAVING MAX(salary) > 12000;`
* B. `SELECT department_id, AVG(salary) FROM employees GROUP BY department_id HAVING salary > 12000;`
* C. `SELECT department_id, AVG(salary) FROM employees GROUP BY department_id HAVING job_id = 'IT_PROG';`
* D. `SELECT department_id, AVG(salary) AS avg_sal FROM employees GROUP BY department_id HAVING avg_sal > 8000;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** The aggregate function in `HAVING` (`MAX(salary)`) does not need to appear in the `SELECT` list (`AVG(salary)`).
  * **B and C are incorrect:** `salary` and `job_id` are neither aggregated nor included in `GROUP BY department_id` (`ORA-00979`).
  * **D is incorrect:** Column aliases (`avg_sal`) cannot be used in `HAVING` (`ORA-00904`).
</details>

---

### Question 12
**In Oracle SQL, up to how many levels deep can aggregate (group) functions be nested?**

* A. Aggregate functions cannot be nested (1 level only).
* B. Up to **2 levels** (for example, `MAX(AVG(salary))`).
* C. Up to **3 levels** (for example, `SUM(MAX(AVG(salary)))`).
* D. Unlimited levels, just like single-row functions.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Oracle SQL allows nesting group functions up to **2 levels deep** (e.g., `MAX(AVG(salary))`). Attempting a 3rd level raises `ORA-00935: group function is nested too deeply`.
  * **A, C, D are incorrect:** Only single-row functions can be nested to arbitrary depth.
</details>

---

### Question 13
**What happens when you execute the following SQL statement?**

```sql
SELECT department_id, MAX(AVG(salary))
FROM employees
GROUP BY department_id;
```

* A. It displays the `department_id` with the highest average salary along with that average salary.
* B. It displays all `department_id` values with the highest average salary repeated on every row.
* C. It fails with `ORA-00937: not a single-group group function`.
* D. It fails with `ORA-00978: nested group function without GROUP BY`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** When aggregate functions are nested 2 levels deep (`MAX(AVG(salary))`), the outer function collapses all group results into a **single summary value**. Therefore, no individual column (not even the `GROUP BY` column `department_id`) can appear in the `SELECT` list! Including `department_id` raises `ORA-00937: not a single-group group function`.
  * **A, B, D are incorrect:** To get simply the value, write `SELECT MAX(AVG(salary)) FROM employees GROUP BY department_id;`.
</details>

---

### Question 14
**What happens when you execute the following SQL statement?**

```sql
SELECT MAX(AVG(salary))
FROM employees;
```

* A. It returns the average salary of the entire `EMPLOYEES` table.
* B. It fails with `ORA-00978: nested group function without GROUP BY`.
* C. It fails with `ORA-00934: group function is not allowed here`.
* D. It returns `NULL`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Nesting two aggregate functions (`MAX(AVG(salary))`) **requires** a `GROUP BY` clause. Omitting `GROUP BY` raises `ORA-00978: nested group function without GROUP BY`.
  * **A, C, D are incorrect:** Nested group functions cannot execute without a `GROUP BY` clause.
</details>

---

### Question 15
**The `EMPLOYEES` table contains data, but no employee has a salary greater than `999999` (the `WHERE` clause matches 0 rows). What is returned by the following query?**

```sql
SELECT COUNT(*) AS cnt, SUM(salary) AS total_sal, MAX(salary) AS max_sal
FROM employees
WHERE salary > 999999;
```

* A. **0 rows** (`No rows selected`).
* B. **1 row** with: `CNT = 0`, `TOTAL_SAL = 0`, `MAX_SAL = 0`.
* C. **1 row** with: `CNT = 0`, `TOTAL_SAL = NULL`, `MAX_SAL = NULL`.
* D. **1 row** with: `CNT = NULL`, `TOTAL_SAL = NULL`, `MAX_SAL = NULL`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** An aggregate query **without a `GROUP BY` clause** always returns **exactly 1 row**, even if the `WHERE` clause filters out all rows. On an empty set, `COUNT` returns `0`, while `SUM`, `AVG`, `MIN`, `MAX`, and `LISTAGG` return `NULL`.
  * **A, B, D are incorrect:** `SUM` and `MAX` return `NULL` (not `0`) when no rows match.
</details>

---

### Question 16
**In contrast to Question 15, if a `GROUP BY department_id` clause is added while `WHERE salary > 999999` still matches 0 rows, what does the query return?**

```sql
SELECT department_id, COUNT(*) AS cnt, SUM(salary) AS total_sal
FROM employees
WHERE salary > 999999
GROUP BY department_id;
```

* A. **0 rows** (`No rows selected`).
* B. **1 row** with: `DEPARTMENT_ID = NULL`, `CNT = 0`, `TOTAL_SAL = NULL`.
* C. All `department_id` values with `CNT = 0` and `TOTAL_SAL = 0`.
* D. A runtime error.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** Because the `WHERE` clause filters out all rows before `GROUP BY` executes, zero groups are formed by `GROUP BY department_id`, so the query returns **0 rows (`No rows selected`)**.
  * **B, C, D are incorrect:** Only aggregate queries without `GROUP BY` guarantee 1 row on an empty set.
</details>

---

### Question 17
**The `STAFF` table has 3 rows in department `10`: `('AN', 3000)`, `('BINH', 5000)`, and `('CUONG', NULL)`. What is the result of `LISTAGG` in the following query?**

```sql
SELECT LISTAGG(ename, '-') WITHIN GROUP (ORDER BY salary DESC NULLS LAST) AS staff_names
FROM staff
WHERE dept_id = 10;
```

* A. `'BINH-AN-CUONG'`
* B. `'BINH-AN-'`
* C. `'AN-BINH-CUONG'`
* D. `NULL` because one row has `salary IS NULL`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** `LISTAGG(ename, '-')` concatenates non-null `ename` values ordered by `salary DESC NULLS LAST`: `'BINH'` (`5000`), `'AN'` (`3000`), and `'CUONG'` (`NULL` salary sorted last) $\rightarrow$ `'BINH-AN-CUONG'`. (Only rows where `ename` itself is `NULL` would be skipped by `LISTAGG`).
  * **B, C, D are incorrect:** A `NULL` in the `ORDER BY` column does not cause `LISTAGG` to skip a non-null `ename`.
</details>

---

### Question 18
**Can single-row functions and aggregate functions be combined in the same `SELECT` query? Which of the following statements is/are VALID?**

* A. `SELECT department_id, ROUND(AVG(NVL(commission_pct, 0)), 2) FROM employees GROUP BY department_id;`
* B. `SELECT UPPER(last_name), AVG(salary) FROM employees;`
* C. `SELECT SUBSTR(job_id, 1, 2), SUM(salary) FROM employees GROUP BY job_id;`
* D. Both A and C are valid.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct (Both A and C are valid):**
    * In **A**, `NVL` executes per row, `AVG` aggregates per group, and `ROUND` formats each group's average.
    * In **C**, because `job_id` is in `GROUP BY job_id`, applying any single-row function to `job_id` in the `SELECT` list (`SUBSTR(job_id, 1, 2)`) is completely valid!
  * **B is incorrect:** Mixing a single-row expression `UPPER(last_name)` with `AVG(salary)` without `GROUP BY` raises `ORA-00937`.
</details>

---

### Question 19
**Examine the following SQL query. What happens when it is executed?**

```sql
SELECT SUBSTR(job_id, 1, 2) AS job_prefix, COUNT(*)
FROM employees
GROUP BY SUBSTR(job_id, 1, 2);
```

* A. It fails because single-row functions (`SUBSTR`) are not allowed in `GROUP BY`.
* B. It fails because the standalone column `job_id` is missing from `GROUP BY`.
* C. It executes successfully and groups employees by the first 2 characters of `job_id`.
* D. It executes successfully only if the `AS job_prefix` alias is removed.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `GROUP BY` can group by any single-row expression (`SUBSTR(job_id, 1, 2)`), and as long as the `SELECT` list uses that exact expression (not the raw ungrouped `job_id`), the query succeeds.
  * **A, B, D are incorrect:** Single-row functions are allowed in `GROUP BY`.
</details>

---

### Question 20
**In contrast to Question 19, what happens when you execute the following SQL statement?**

```sql
SELECT job_id, COUNT(*)
FROM employees
GROUP BY SUBSTR(job_id, 1, 2);
```

* A. It succeeds because `job_id` is referenced inside `SUBSTR` in `GROUP BY`.
* B. It fails with `ORA-00979: not a GROUP BY expression`.
* C. It succeeds and displays the first 2 characters of `job_id`.
* D. It fails with `ORA-00937: not a single-group group function`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Grouping by `SUBSTR(job_id, 1, 2)` combines multiple distinct `job_id` values (e.g., `'AD_PRES'` and `'AD_VP'`) into a single `'AD'` group. Therefore, selecting the full ungrouped `job_id` in the `SELECT` list raises `ORA-00979: not a GROUP BY expression`.
  * **A, C, D are incorrect:** Grouping by `FUNC(col)` does not allow selecting standalone `col`.
</details>

---

### Question 21
**Compare the following two SQL queries. Which statement is TRUE?**

```sql
-- Query 1:
SELECT department_id, AVG(salary)
FROM employees
WHERE department_id IN (10, 20, 30)
GROUP BY department_id;

-- Query 2:
SELECT department_id, AVG(salary)
FROM employees
GROUP BY department_id
HAVING department_id IN (10, 20, 30);
```

* A. Query 2 fails because `HAVING` must contain an aggregate function such as `COUNT`, `SUM`, or `AVG`.
* B. Both queries are valid and return identical results, and Query 1 is more efficient logically because it filters out rows not in `(10, 20, 30)` before grouping.
* C. Both queries are valid but return different results.
* D. Query 2 is more efficient because filtering after grouping uses less CPU.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `HAVING` can reference any grouping column (`department_id`) even without an aggregate function, so both queries are valid and produce the same result. However, filtering rows via `WHERE` before grouping (Query 1) reduces the number of rows that must be grouped.
  * **A, C, D are incorrect:** `HAVING` does not strictly require an aggregate function if it only references `GROUP BY` columns.
</details>

---

### Question 22
**The `ORDERS` table has columns `ORDER_ID`, `CUST_ID`, and `ORDER_TOTAL`. Which statement finds the highest customer total order amount across all customers?**

* A. `SELECT cust_id, MAX(SUM(order_total)) FROM orders GROUP BY cust_id;`
* B. `SELECT MAX(SUM(order_total)) FROM orders GROUP BY cust_id;`
* C. `SELECT MAX(SUM(order_total)) FROM orders;`
* D. `SELECT cust_id, SUM(MAX(order_total)) FROM orders GROUP BY cust_id;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `SUM(order_total)` calculates each customer's total via `GROUP BY cust_id`, and `MAX(...)` finds the maximum of those totals without any unaggregated column in the `SELECT` list.
  * **A and D are incorrect:** Including `cust_id` in `SELECT` with a 2-level nested aggregate raises `ORA-00937`.
  * **C is incorrect:** Omitting `GROUP BY` raises `ORA-00978`.
</details>

---

### Question 23
**What is the result of executing the following SQL query?**

```sql
SELECT COUNT(*)
FROM dual
WHERE 1 = 2
GROUP BY dummy;
```

* A. It returns 1 row with the value `0`.
* B. It returns 1 row with the value `NULL`.
* C. It returns 0 rows (`No rows selected`).
* D. It fails because `GROUP BY` cannot be used on `DUAL`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Because `WHERE 1 = 2` filters out all rows and the query includes a `GROUP BY` clause, zero groups are created and the query returns **0 rows (`No rows selected`)**.
  * **A, B, D are incorrect:** Only without `GROUP BY` would `SELECT COUNT(*) FROM dual WHERE 1 = 2` return 1 row with `0`.
</details>

---

### Question 24
**Examine the following SQL query. Which clause causes a compilation error?**

```sql
SELECT department_id, job_id, COUNT(*), MIN(salary)
FROM employees
WHERE salary >= 3000
GROUP BY department_id, job_id
HAVING AVG(salary) > 5000
ORDER BY MAX(salary) DESC;
```

* A. The `HAVING` clause fails because `AVG(salary)` is not in the `SELECT` list.
* B. The `ORDER BY` clause fails because `MAX(salary)` is not in the `SELECT` list.
* C. The `GROUP BY` clause fails because it groups by two columns.
* D. None of the clauses fail — the statement is completely valid and executes successfully.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** All non-aggregated `SELECT` columns (`department_id, job_id`) are in `GROUP BY`, and both `HAVING` and `ORDER BY` can use any valid aggregate function (`AVG(salary)`, `MAX(salary)`) even if those functions do not appear in the `SELECT` list.
  * **A, B, C are incorrect:** The query is 100% valid.
</details>

---

### Question 25
**The `PRODUCTS` table has `CATEGORY_ID` and `PRICE` columns. Which query returns categories where the difference between the highest-priced and lowest-priced product in that category exceeds `500`?**

* A. `SELECT category_id FROM products WHERE MAX(price) - MIN(price) > 500 GROUP BY category_id;`
* B. `SELECT category_id FROM products GROUP BY category_id HAVING MAX(price) - MIN(price) > 500;`
* C. `SELECT category_id, MAX(price) - MIN(price) AS diff FROM products GROUP BY category_id HAVING diff > 500;`
* D. `SELECT category_id FROM products HAVING MAX(price) - MIN(price) > 500;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Group by `category_id` and filter groups using `HAVING MAX(price) - MIN(price) > 500`.
  * **A, C, D are incorrect:** A uses aggregate functions in `WHERE` (`ORA-00934`); C uses a column alias in `HAVING` (`ORA-00904`); D omits `GROUP BY category_id` (`ORA-00937`).
</details>

---
