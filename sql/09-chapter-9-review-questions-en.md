# Review Questions - Chapter 9: Set Operators

> **Objective:** Assess your mastery of Chapter 9 (`UNION`, `UNION ALL`, `INTERSECT`, `MINUS`, `EXCEPT` in Oracle 21c, column & data type compatibility, duplicate & `NULL` handling, column aliases, and `ORDER BY` rules in compound queries) aligned with the **Oracle Database SQL (1Z0-071)** certification exam.  
> **Total Questions:** 25 multiple-choice questions with detailed answers and explanations.  
> **How to study:** Analyze each question and choose your answer before clicking **"👉 View Answer & Detailed Explanation"**.

---

### Question 1
**`TABLE_A` has 4 rows with `ID` values `(1, 1, 2, 3)`, and `TABLE_B` has 3 rows with `ID` values `(2, 3, 4)`. How many rows are returned by queries combining `TABLE_A` and `TABLE_B` using `UNION ALL`, `UNION`, `INTERSECT`, and `MINUS` (`TABLE_A MINUS TABLE_B`), respectively?**

* A. `7`, `4`, `2`, `2`
* B. `7`, `4`, `2`, `1`
* C. `7`, `5`, `2`, `1`
* D. `6`, `4`, `2`, `2`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * **`UNION ALL`:** Keeps all rows including duplicates: $4 + 3 =$ **`7` rows**.
    * **`UNION`:** Combines and eliminates duplicates: **`4` rows** `(1, 2, 3, 4)`.
    * **`INTERSECT`:** Keeps common unique rows: **`2` rows** `(2, 3)`.
    * **`TABLE_A MINUS TABLE_B`:** Removes `2` and `3`, and **deduplicates `(1, 1)`** into a single row `(1)` $\rightarrow$ **`1` row**!
  * **A, C, D are incorrect:** Option A forgets that `MINUS` also eliminates duplicate rows within the first query.
</details>

---

### Question 2
**Which of the following set operators does NOT eliminate duplicate rows from the final result set?**

* A. `UNION`
* B. `INTERSECT`
* C. `MINUS`
* D. `UNION ALL`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** Among the four traditional set operators (`UNION`, `UNION ALL`, `INTERSECT`, `MINUS`), only **`UNION ALL`** retains all duplicate rows without performing a deduplication sort/hash.
  * **A, B, C are incorrect:** `UNION`, `INTERSECT`, and `MINUS` all eliminate duplicate rows.
</details>

---

### Question 3
**In Oracle Database 21c, which ANSI SQL keyword is supported as a direct functional synonym for the `MINUS` set operator?**

* A. `DIFFERENCE`
* B. `SUBTRACT`
* C. `EXCEPT`
* D. `NOT UNION`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Starting in Oracle Database 21c, Oracle supports the ANSI SQL **`EXCEPT`** (and `EXCEPT ALL`, `MINUS ALL`, `INTERSECT ALL`) set operator, which is 100% functionally equivalent to `MINUS`.
  * **A, B, D are incorrect:** They are not valid SQL set operators.
</details>

---

### Question 4
**Table `T1` has 3 rows: `(10, 'A')`, `(20, NULL)`, `(NULL, NULL)`, and table `T2` has 2 rows: `(20, NULL)`, `(NULL, NULL)`. How many rows are returned by the following `INTERSECT` query?**

```sql
SELECT id, code FROM t1
INTERSECT
SELECT id, code FROM t2;
```

* A. `0` rows (because `NULL` never equals `NULL` in SQL)
* B. `1` row
* C. `2` rows: `(20, NULL)` and `(NULL, NULL)`
* D. An error is raised because a row in `INTERSECT` cannot contain all `NULL` values

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Unlike `WHERE` and `JOIN` conditions, **all set operators (`UNION`, `INTERSECT`, `MINUS`) treat two `NULL` values in the same column position as EQUAL**! Therefore, both `(20, NULL)` and `(NULL, NULL)` match across `T1` and `T2`, returning **`2` rows**.
  * **A, B, D are incorrect:** Set operators do not ignore `NULL` values.
</details>

---

### Question 5
**Using the same `T1` (`(10, 'A')`, `(20, NULL)`, `(NULL, NULL)`) and `T2` (`(20, NULL)`, `(NULL, NULL)`) tables from Question 4, what is returned by the following `MINUS` query?**

```sql
SELECT id, code FROM t1
MINUS
SELECT id, code FROM t2;
```

* A. Only `1` row: `(10, 'A')`.
* B. `3` rows because `NULL` rows in `T2` cannot subtract `NULL` rows in `T1`.
* C. `2` rows: `(10, 'A')` and `(NULL, NULL)`.
* D. `0` rows.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** Because `MINUS` treats `NULL` as equal to `NULL`, both `(20, NULL)` and `(NULL, NULL)` in `T1` match the rows in `T2` and are subtracted, leaving only **`1` row**: `(10, 'A')`.
  * **B, C, D are incorrect:** `NULL` rows are matched and removed by `MINUS`.
</details>

---

### Question 6
**What happens when you execute the following SQL statement?**

```sql
SELECT employee_id, last_name, salary
FROM employees
UNION
SELECT department_id, department_name
FROM departments;
```

* A. It succeeds and automatically fills the 3rd column with `NULL` for rows from `departments`.
* B. It succeeds and displays only the first 2 columns.
* C. It fails with `ORA-01789: query block has incorrect number of result columns`.
* D. It fails with `ORA-01790: expression must have same datatype as corresponding expression`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Every component query in a compound query **must have the exact same number of columns** in its `SELECT` list. Having 3 columns in the first query and 2 columns in the second query raises `ORA-01789: query block has incorrect number of result columns`.
  * **A, B, D are incorrect:** Oracle never pads missing columns automatically.
</details>

---

### Question 7
**To fix the missing 3rd column (corresponding to `salary` of type `NUMBER` in the first `SELECT`) in Question 6, which of the following second `SELECT` statements is/are VALID?**

```sql
-- First SELECT: SELECT employee_id, last_name, salary FROM employees UNION ...
```

* A. `SELECT department_id, department_name, 0 FROM departments;`
* B. `SELECT department_id, department_name, TO_NUMBER(NULL) FROM departments;`
* C. `SELECT department_id, department_name, NULL FROM departments;`
* D. All of A, B, and C are valid!

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** You can pad a missing `NUMBER` column in a compound query using a numeric literal (`0`), an explicitly typed null (`TO_NUMBER(NULL)` or `CAST(NULL AS NUMBER)`), or a bare `NULL` keyword. All three are valid in Oracle SQL.
  * **A, B, C alone are incomplete:** All three options execute without error.
</details>

---

### Question 8
**What happens when you execute the following query in Oracle Database?**

```sql
SELECT 100 AS val FROM dual
UNION
SELECT '100' AS val FROM dual;
```

* A. It succeeds; Oracle implicitly converts `'100'` to the number `100` and returns 1 row.
* B. It succeeds and returns 2 rows: one with the number `100` and one with the string `'100'`.
* C. It fails with `ORA-01790: expression must have same datatype as corresponding expression`.
* D. It fails with `ORA-01722: invalid number`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Set operators (`UNION`, `UNION ALL`, `INTERSECT`, `MINUS`) **do NOT perform implicit data type conversion across different data type groups** (`NUMBER` vs. `VARCHAR2` vs. `DATE`)! Combining `100` (`NUMBER`) and `'100'` (`VARCHAR2`) in the same column position raises `ORA-01790`.
  * **A, B, D are incorrect:** You must use explicit conversion (`TO_CHAR(100)` or `TO_NUMBER('100')`).
</details>

---

### Question 9
**Which pair of data types at corresponding positions across two `SELECT` statements joined by `UNION` is VALID and does NOT raise `ORA-01790`?**

* A. Column 1 of Query 1 is `DATE`; Column 1 of Query 2 is `VARCHAR2(20)`.
* B. Column 1 of Query 1 is `NUMBER(6)`; Column 1 of Query 2 is `VARCHAR2(6)`.
* C. Column 1 of Query 1 is `CHAR(5)` and Column 1 of Query 2 is `VARCHAR2(100)`; Column 2 of Query 1 is `DATE` and Column 2 of Query 2 is `TIMESTAMP`.
* D. Column 1 of Query 1 is `CLOB`; Column 1 of Query 2 is `NUMBER`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Corresponding columns in a compound query must belong to the **same data type group**: `CHAR(5)` and `VARCHAR2(100)` are both in the Character group, and `DATE` and `TIMESTAMP` are both in the Datetime group.
  * **A, B, D are incorrect:** Mixing different data type groups raises `ORA-01790`.
</details>

---

### Question 10
**When the following compound query is executed, what will the column headers of the output be?**

```sql
SELECT employee_id AS emp_no, last_name AS emp_name
FROM employees
WHERE department_id = 10
UNION
SELECT department_id AS dept_no, department_name AS dept_title
FROM departments;
```

* A. `EMP_NO` and `EMP_NAME`
* B. `DEPT_NO` and `DEPT_TITLE`
* C. `EMPLOYEE_ID` and `LAST_NAME`
* D. An error is raised because the two `SELECT` statements define different column aliases

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** In any compound query, the output column names are **always taken from the first `SELECT` statement** (`EMP_NO` and `EMP_NAME`). Aliases in subsequent `SELECT` statements are allowed syntactically but ignored for the result header.
  * **B, C, D are incorrect:** Only the first `SELECT` list determines the output column names.
</details>

---

### Question 11
**Examine the following compound query with an `ORDER BY` clause. Why does it fail when executed?**

```sql
SELECT employee_id AS id_code, last_name AS full_name
FROM employees
WHERE department_id = 10
UNION ALL
SELECT employee_id, last_name
FROM employees
WHERE department_id = 20
ORDER BY employee_id;
```

* A. Because `UNION ALL` does not allow an `ORDER BY` clause.
* B. Because in the first `SELECT` statement, `employee_id` was given the alias `id_code`, so the `ORDER BY` clause must reference `id_code` (or position `1`) instead of `employee_id`.
* C. Because the second `SELECT` statement does not specify `AS id_code`.
* D. Because the `ASC` keyword is missing after `ORDER BY employee_id`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The `ORDER BY` clause of a compound query can only reference column names or aliases as exposed by the **first `SELECT` statement** (or positional numbers). Because the first `SELECT` aliases `employee_id` as `id_code`, referencing `ORDER BY employee_id` raises `ORA-00904: "EMPLOYEE_ID": invalid identifier`.
  * **A, C, D are incorrect:** Use `ORDER BY id_code` or `ORDER BY 1`.
</details>

---

### Question 12
**Examine the incomplete compound query below. Which `ORDER BY` clause can be placed on the last line so that the query executes SUCCESSFULLY?**

```sql
SELECT employee_id, last_name AS lname
FROM employees
UNION
SELECT department_id AS dept_id, department_name AS dname
FROM departments
-- Insert ORDER BY clause here:
```

* A. `ORDER BY dept_id;`
* B. `ORDER BY last_name;`
* C. `ORDER BY employee_id, 2 DESC;`
* D. `ORDER BY dname;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** The first column of Query 1 is unaliased (`employee_id`), and the second column is aliased as `lname` (which can be referenced as `lname` or by position `2`). Thus `ORDER BY employee_id, 2 DESC;` is completely valid.
  * **A, B, D are incorrect:** `dept_id` and `dname` belong to Query 2, and `last_name` in Query 1 was overridden by its alias `lname` (`ORA-00904`).
</details>

---

### Question 13
**What happens when you execute the following SQL statement?**

```sql
SELECT employee_id, last_name
FROM employees
WHERE department_id = 10
ORDER BY last_name
UNION
SELECT employee_id, last_name
FROM employees
WHERE department_id = 20
ORDER BY last_name;
```

* A. It sorts department 10 and department 20 separately by `last_name` before combining them.
* B. It fails with `ORA-00933: SQL command not properly ended` because an `ORDER BY` clause cannot appear in the first `SELECT` statement before `UNION`.
* C. It ignores the first `ORDER BY` clause and only applies the second `ORDER BY` clause.
* D. It executes normally without error.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In a compound query, an `ORDER BY` clause can only appear **once, at the very end of the entire compound statement**. Placing `ORDER BY` before `UNION` raises `ORA-00933: SQL command not properly ended`.
  * **A, C, D are incorrect:** Individual component queries cannot have their own top-level `ORDER BY` clauses.
</details>

---

### Question 14
**What happens when you execute the following SQL statement?**

```sql
SELECT employee_id, last_name
FROM employees
WHERE department_id = 10
UNION
SELECT employee_id, last_name
FROM employees
WHERE department_id = 20
ORDER BY salary DESC;
```

* A. It executes successfully and sorts the combined rows by `salary` descending.
* B. It fails with `ORA-00904: "SALARY": invalid identifier` because in a compound query, the `ORDER BY` clause cannot reference a column that is not in the `SELECT` list.
* C. It sorts by the first column (`employee_id`).
* D. It sorts only the rows from department 20 by `salary`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Unlike a simple single-table `SELECT`, a compound query using set operators **cannot `ORDER BY` a column that is not in the `SELECT` list**. Because only `employee_id` and `last_name` are projected, `ORDER BY salary DESC` raises `ORA-00904: "SALARY": invalid identifier`.
  * **A, C, D are incorrect:** Unselected columns do not exist in the compound result set.
</details>

---

### Question 15
**Given three sets: `SET_A = (1, 2, 3)`, `SET_B = (3, 4)`, and `SET_C = (1, 4)`. What is the result of the following compound query?**

```sql
SELECT num FROM set_a
UNION ALL
SELECT num FROM set_b
MINUS
SELECT num FROM set_c;
```

* A. `(2, 3)`
* B. `(1, 2, 3)`
* C. `(2, 3, 3)`
* D. `(2)`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** In Oracle SQL, set operators have **equal precedence** and are evaluated **from top to bottom**:
    1. `set_a UNION ALL set_b` produces `(1, 2, 3, 3, 4)`.
    2. `(1, 2, 3, 3, 4) MINUS (1, 4)` removes `1` and `4` AND **eliminates duplicates** (`(3, 3)` $\rightarrow$ `3`), returning **`(2, 3)`**!
  * **B, C, D are incorrect:** C forgets that `MINUS` deduplicates the final output.
</details>

---

### Question 16
**Using the same three sets from Question 15 (`SET_A = (1, 2, 3)`, `SET_B = (3, 4)`, `SET_C = (1, 4)`), what is the result if parentheses are placed around the `MINUS` operation as shown below?**

```sql
SELECT num FROM set_a
UNION ALL
(SELECT num FROM set_b
 MINUS
 SELECT num FROM set_c);
```

* A. `(2, 3)`
* B. `(1, 2, 3)`
* C. `(1, 2, 3, 3)`
* D. An error is raised because parentheses are not allowed with set operators

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Parentheses override top-to-bottom evaluation:
    1. `(set_b MINUS set_c)` is evaluated first: `(3, 4) MINUS (1, 4)` = `(3)`.
    2. `set_a UNION ALL (3)` combines `(1, 2, 3)` and `(3)` without deduplication, returning **`(1, 2, 3, 3)`**!
  * **A, B, D are incorrect:** Because `UNION ALL` executes last, the duplicate `3` is preserved.
</details>

---

### Question 17
**Given `SET_A = (1, 1, 2)`, `SET_B = (2, 3)`, and `SET_C = (3, 4)`, how many rows are returned when `UNION` is followed by `UNION ALL` as shown below?**

```sql
SELECT num FROM set_a
UNION
SELECT num FROM set_b
UNION ALL
SELECT num FROM set_c;
```

* A. `4` rows: `(1, 2, 3, 4)`
* B. `5` rows: `(1, 2, 3, 3, 4)`
* C. `6` rows: `(1, 1, 2, 3, 3, 4)`
* D. `7` rows

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Evaluating top to bottom:
    1. `set_a UNION set_b` combines `(1, 1, 2)` and `(2, 3)` and deduplicates them to `3` rows: `(1, 2, 3)`.
    2. `(1, 2, 3) UNION ALL (3, 4)` appends `(3, 4)` without deduplication, yielding **`5` rows: `(1, 2, 3, 3, 4)`**.
  * **A, C, D are incorrect:** `UNION` deduplicates step 1, while `UNION ALL` preserves the duplicate `3` in step 2.
</details>

---

### Question 18
**In the `EMPLOYEES` table, the `RESUME` column is of data type `CLOB` (or `BLOB`). Which of the following compound queries will execute SUCCESSFULLY without error?**

* A. `SELECT employee_id, resume FROM employees WHERE department_id = 10 UNION SELECT employee_id, resume FROM employees WHERE department_id = 20;`
* B. `SELECT employee_id, resume FROM employees WHERE department_id = 10 INTERSECT SELECT employee_id, resume FROM employees WHERE department_id = 20;`
* C. `SELECT employee_id, resume FROM employees WHERE department_id = 10 MINUS SELECT employee_id, resume FROM employees WHERE department_id = 20;`
* D. `SELECT employee_id, resume FROM employees WHERE department_id = 10 UNION ALL SELECT employee_id, resume FROM employees WHERE department_id = 20;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** LOB columns (`CLOB`, `BLOB`, `NCLOB`, `BFILE`) cannot be compared or sorted for deduplication. Because **`UNION ALL`** does not deduplicate rows, it is the only set operator that supports `CLOB`/`BLOB` columns!
  * **A, B, C are incorrect:** `UNION`, `INTERSECT`, and `MINUS` raise `ORA-00932: inconsistent datatypes: expected - got CLOB`.
</details>

---

### Question 19
**You are combining 3 `SELECT` statements with `UNION ALL` to produce a report with department subtotals first, job subtotals second, and a grand total last. How can you guarantee that the rows from Query 1 appear first, Query 2 second, and Query 3 last?**

* A. Do nothing, because SQL guarantees `UNION ALL` row order even under parallel execution.
* B. Place a separate `ORDER BY` clause at the end of each individual `SELECT` statement.
* C. Include a literal sort-key column in each `SELECT` list (e.g., `1 AS sort_group` in Query 1, `2 AS sort_group` in Query 2, `3 AS sort_group` in Query 3) and place `ORDER BY sort_group` at the very end of the compound query.
* D. Replace `UNION ALL` with `UNION`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Adding a synthetic numeric sort column (`1 AS sort_group`, `2`, `3`) and sorting by `ORDER BY sort_group` at the end of the compound query is the standard SQL pattern to control section ordering.
  * **A, B, D are incorrect:** B raises `ORA-00933`, and D sorts by data values rather than query block order.
</details>

---

### Question 20
**`EMP_DEPT10` has 3 distinct rows and `EMP_DEPT20` has 5 distinct rows. No employee belongs to both departments (the two tables are completely disjoint). Which statement is TRUE?**

* A. `SELECT * FROM emp_dept10 UNION SELECT * FROM emp_dept20` and `SELECT * FROM emp_dept10 UNION ALL SELECT * FROM emp_dept20` both return the exact same 8 rows, but `UNION ALL` is faster because it avoids an unnecessary deduplication operation.
* B. `UNION` is faster than `UNION ALL`.
* C. `SELECT * FROM emp_dept10 INTERSECT SELECT * FROM emp_dept20` returns 8 rows.
* D. `SELECT * FROM emp_dept10 MINUS SELECT * FROM emp_dept20` returns 0 rows.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** When two sets have no internal duplicates and no overlap, `UNION` and `UNION ALL` return the same rows, but `UNION ALL` avoids the overhead of `SORT UNIQUE` / `HASH UNIQUE`.
  * **B, C, D are incorrect:** `INTERSECT` returns `0` rows, and `emp_dept10 MINUS emp_dept20` returns `3` rows.
</details>

---

### Question 21
**Examine the following compound query. What happens when it is executed?**

```sql
SELECT department_id, COUNT(*) AS total
FROM employees
GROUP BY department_id
UNION
SELECT NULL, COUNT(*)
FROM employees;
```

* A. It fails because `GROUP BY` cannot be used inside a component query of `UNION`.
* B. It fails because `NULL` in the second `SELECT` does not match the `NUMBER` data type of `department_id`.
* C. It executes successfully, returning the employee count per department along with the total company headcount row (though `UNION` would merge them if an unassigned `NULL` department had the exact same count as the entire company).
* D. It fails because the second `SELECT` does not have a `GROUP BY` clause.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Each component `SELECT` in a compound query can independently use `GROUP BY`, `HAVING`, `WHERE`, and `JOIN`, and a `NULL` literal matches any data type (`NUMBER`).
  * **A, B, D are incorrect:** The statement is syntactically and semantically valid.
</details>

---

### Question 22
**Table `A` has rows `(1, 1, 1, 2)` and table `B` has rows `(1, 2, 2)`. In Oracle Database 21c, what is the difference between `A MINUS B` and `A MINUS ALL B` (or `A EXCEPT ALL B`)?**

* A. Both return `0` rows.
* B. `A MINUS B` returns `0` rows, whereas `A MINUS ALL B` returns `2` rows with values `(1, 1)`.
* C. `A MINUS B` returns `1` row `(1)`, whereas `A MINUS ALL B` returns `0` rows.
* D. Oracle 21c does not support the `ALL` keyword with `MINUS` or `EXCEPT`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * **`A MINUS B`** performs set difference with deduplication: since both `1` and `2` exist in `B`, `0` rows remain.
    * **`A MINUS ALL B`** (introduced in Oracle 21c) performs multiset (bag) difference based on cardinality ($\max(0, \text{count}_A - \text{count}_B)$): `1` appears 3 times in `A` and 1 time in `B`, leaving $3 - 1 =$ **`2` rows of `1`**!
  * **A, C, D are incorrect:** `MINUS ALL` and `EXCEPT ALL` are supported in Oracle 21c.
</details>

---

### Question 23
**Similarly, given table `A` with `(1, 1, 1, 2)` and table `B` with `(1, 1, 2, 2)` in Oracle Database 21c, how many rows are returned by `A INTERSECT B` and `A INTERSECT ALL B`, respectively?**

* A. `2` rows `(1, 2)` and `3` rows `(1, 1, 2)`
* B. `2` rows `(1, 2)` and `2` rows `(1, 2)`
* C. `3` rows `(1, 1, 2)` and `4` rows `(1, 1, 2, 2)`
* D. `2` rows `(1, 2)` and `4` rows `(1, 1, 1, 2)`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:**
    * **`A INTERSECT B`** deduplicates to **2 rows**: `(1, 2)`.
    * **`A INTERSECT ALL B`** retains $\min(\text{count}_A, \text{count}_B)$ for each distinct row: $\min(3, 2) = 2$ occurrences of `1` and $\min(1, 2) = 1$ occurrence of `2`, totaling **3 rows**: `(1, 1, 2)`.
  * **B, C, D are incorrect:** They miscalculate $\min(\text{count}_A, \text{count}_B)$.
</details>

---

### Question 24
**You want to verify whether two tables with identical column structures, `EMP_BACKUP` and `EMP_CURRENT` (each having no internal duplicate rows), contain the exact same set of rows. Which query returns `0` rows if and only if both tables contain the exact same set of unique rows?**

```sql
-- Assume each table has a Primary Key (no internal duplicates)
```

* A. `(SELECT * FROM emp_backup MINUS SELECT * FROM emp_current) UNION ALL (SELECT * FROM emp_current MINUS SELECT * FROM emp_backup);`
* B. `SELECT * FROM emp_backup MINUS SELECT * FROM emp_current;`
* C. `SELECT * FROM emp_backup INTERSECT SELECT * FROM emp_current;`
* D. `SELECT * FROM emp_backup UNION SELECT * FROM emp_current;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** Symmetric difference `(A MINUS B) UNION ALL (B MINUS A)` checks both for rows in `A` missing from `B` and rows in `B` missing from `A`. It returns `0` rows if and only if the two sets are identical.
  * **B, C, D are incorrect:** Option B only checks one direction (`A \ B`), which would falsely return `0` rows if `A` were a proper subset of `B`.
</details>

---

### Question 25
**Examine the following compound query. Which statement accurately describes its behavior?**

```sql
SELECT department_id, job_id
FROM employees
INTERSECT
SELECT department_id, job_id
FROM job_history
ORDER BY 1, job_id DESC;
```

* A. It fails because the `ORDER BY` clause cannot mix positional notation (`1`) and column names (`job_id`).
* B. It succeeds and finds all employees who are currently working in the exact same job and department that they worked in previously.
* C. It succeeds and finds all `(department_id, job_id)` pairs that appear in both `employees` and `job_history`, sorted by `department_id` ascending and `job_id` descending.
* D. It fails because the first `SELECT` statement does not define column aliases.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Mixing positional numbers (`1`) and column names from the first `SELECT` (`job_id`) in `ORDER BY` is valid. Because `employee_id` is not in the `SELECT` lists, `INTERSECT` matches `(department_id, job_id)` pairs across the two tables regardless of which employee held them.
  * **A, B, D are incorrect:** Option B would require including `employee_id` in both `SELECT` lists.
</details>

---
