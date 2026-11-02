# Review Questions - Chapter 20: Advanced Practical SQL in Oracle

> **Reference:** *OCA/OCP Oracle Database SQL Exam Guide (Exam 1Z0-071)* & *Oracle Database SQL Language Reference*.  
> **Total Questions:** 25 multiple-choice questions modeled after the official Oracle OCA/OCP exam with detailed explanations.  
> **How to study:** Read each question carefully and choose your answer first, then click **"👉 View Answer & Detailed Explanation"** to check the official answer and understand key exam traps.

---

### Question 1
**When executing a `MERGE INTO target_tab t USING source_tab s ON (t.id = s.id) ...` statement, under what circumstance will Oracle raise `ORA-30926: unable to get a stable set of rows in the source tables`?**

* A. When the target table `target_tab` is empty (contains zero rows)
* B. When the source table `source_tab` contains two or more rows that match a single row in the target table `target_tab` according to the `ON (t.id = s.id)` join condition
* C. When a row in the target table `target_tab` has no matching row in the source table `source_tab`
* D. When the `MERGE` statement omits the `WHEN NOT MATCHED THEN INSERT` clause

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `MERGE` requires deterministic updates: each row in the target table may match **at most one row** from the `USING` source dataset. If multiple source rows match the same target row in the `ON` condition, Oracle cannot determine which source row's values should win the update and raises **`ORA-30926: unable to get a stable set of rows in the source tables`**.
</details>

---

### Question 2
**Examine the `MERGE` statement below. Why does this statement fail with an error?**

```sql
MERGE INTO employees_target t
USING employees_source s
   ON (t.employee_id = s.employee_id)
WHEN MATCHED THEN
    UPDATE SET
        t.employee_id = s.new_employee_id,
        t.salary      = s.salary;
```

* A. Because a `MERGE` statement must always include a `WHEN NOT MATCHED THEN INSERT` clause
* B. Because you cannot `UPDATE` a column that is referenced in the `ON` condition (`t.employee_id`), which raises `ORA-38104: Columns referenced in the ON Clause cannot be updated`
* C. Because table aliases (`t.`) are not allowed after `UPDATE SET`
* D. Because the `ON` condition must not be enclosed in parentheses

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In Oracle SQL, **any column referenced in the `ON (...)` join condition of a `MERGE` statement cannot be updated** in the `WHEN MATCHED THEN UPDATE SET` clause (`ORA-38104`).
</details>

---

### Question 3
**The target table `INVENTORY` currently contains 3 rows: `(id=1, qty=10)`, `(id=2, qty=0)`, and `(id=3, qty=5)`. The source table `SHIPMENTS` contains 2 rows: `(id=1, delta=-10)` and `(id=3, delta=5)` (no row for `id=2`). After executing the `MERGE` statement below, which row(s) will be deleted by `DELETE WHERE (t.qty = 0)`?**

```sql
MERGE INTO inventory t
USING shipments s
   ON (t.id = s.id)
WHEN MATCHED THEN
    UPDATE SET t.qty = t.qty + s.delta
    DELETE WHERE (t.qty = 0);
```

* A. Both `id=1` and `id=2` are deleted
* B. Only `id=2` is deleted (because its initial `qty` was `0`)
* C. Only `id=1` is deleted; row `id=2` REMAINS intact in the `INVENTORY` table!
* D. No rows are deleted

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** The `DELETE WHERE` clause inside `WHEN MATCHED THEN UPDATE` obeys two strict rules:
    1. It **ONLY evaluates and deletes target rows that were actively updated by the `MERGE`'s `UPDATE` operation**. Because row `id=2` was not matched by `SHIPMENTS` and was never updated, `DELETE WHERE` ignores row `id=2` (even though its `qty` is `0`)!
    2. It evaluates the **post-update values**. Row `id=1` is matched and updated to `qty = 10 + (-10) = 0`, so it satisfies `t.qty = 0` and is deleted.
</details>

---

### Question 4
**A developer wants to insert 1 million rows from `STAGING_CUST` into `CUSTOMERS`. To prevent the entire `INSERT INTO customers SELECT * FROM staging_cust` statement from rolling back when a few rows violate `NOT NULL` or `UNIQUE` constraints, the developer created an error logging table `ERR$_CUSTOMERS` using `DBMS_ERRLOG`. Which statement logs ALL failing rows into `ERR$_CUSTOMERS` while allowing all valid rows to be inserted?**

* A. `INSERT INTO customers SELECT * FROM staging_cust LOG ERRORS INTO err$_customers;`
* B. `INSERT INTO customers SELECT * FROM staging_cust LOG ERRORS INTO err$_customers REJECT LIMIT UNLIMITED;`
* C. `INSERT INTO customers SELECT * FROM staging_cust IGNORE ERRORS;`
* D. `INSERT INTO customers SELECT * FROM staging_cust EXCEPTION WHEN OTHERS THEN NULL;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** To continue processing regardless of how many error rows are encountered, you must specify **`REJECT LIMIT UNLIMITED`**.
  * **A is incorrect:** If `REJECT LIMIT` is omitted, the default is **`REJECT LIMIT 0`**, which logs the first error row and then immediately aborts and rolls back the entire DML statement!
</details>

---

### Question 5
**A developer writes the following query intending to retrieve the 5 highest-paid employees in the company. What actually happens when this query runs?**

```sql
SELECT employee_id, first_name, salary
FROM employees
WHERE ROWNUM <= 5
ORDER BY salary DESC;
```

* A. It accurately returns the 5 highest-paid employees in descending order of salary
* B. It fails with a syntax error because `ROWNUM` cannot be used with `ORDER BY`
* C. Oracle fetches the first 5 arbitrary rows encountered from the table (assigning `ROWNUM` 1 to 5 during the `WHERE` step) and only then sorts those 5 arbitrary rows by `salary DESC` (producing an incorrect Top-5 result!)
* D. It returns all rows in the table

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In SQL query processing order, the `WHERE` clause (`ROWNUM <= 5`) is evaluated **before** the `ORDER BY` clause! Thus, Oracle picks 5 arbitrary rows first and sorts only those 5 rows. To get the true Top-5, use `ORDER BY salary DESC FETCH FIRST 5 ROWS ONLY` (Oracle 12c+) or sort inside an inline view before filtering `WHERE ROWNUM <= 5` in the outer query.
</details>

---

### Question 6
**The `EMPLOYEES` table contains 107 rows. How many rows are returned when the following query is executed?**

```sql
SELECT employee_id, last_name
FROM employees
WHERE ROWNUM = 2;
```

* A. `1` row (the second row in the table)
* B. `2` rows
* C. `0` rows (No rows selected)
* D. Raises `ORA-00936: missing expression`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `ROWNUM` starts at `1` for the first candidate row fetched and is incremented to `2` **only after** row `1` passes the `WHERE` predicate. Because the first candidate row has `ROWNUM = 1`, the condition `ROWNUM = 2` evaluates to `FALSE` and the row is discarded. Every subsequent candidate row is again assigned `ROWNUM = 1` and discarded, resulting in **0 rows returned**.
</details>

---

### Question 7
**The `SCORES` table stores exam scores for 10 students in descending order: `100, 98, 95, 95, 95, 90, 85, 80, 75, 70`. When the query below is executed, how many rows are returned?**

```sql
SELECT student_id, score
FROM scores
ORDER BY score DESC
FETCH FIRST 3 ROWS WITH TIES;
```

* A. `3` rows (`100, 98, 95`)
* B. `5` rows (`100, 98, 95, 95, 95`)
* C. `2` rows (`100, 98`)
* D. `10` rows

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `FETCH FIRST 3 ROWS WITH TIES` retrieves the first 3 rows (`100`, `98`, `95`) plus any additional rows that tie with the `ORDER BY` key of the 3rd row (`score = 95`). Since two more students also scored `95`, all 3 tied rows at `95` are included, returning **5 rows** in total.
</details>

---

### Question 8
**On a 100-million-row `TRANSACTIONS` table (indexed on `(created_at DESC, trans_id DESC)`), why is `Keyset (Seek) Pagination` thousands of times faster than `Offset Pagination` (`OFFSET 5000000 ROWS FETCH NEXT 20 ROWS ONLY`) when fetching deep pages?**

* A. Because `Offset Pagination` cannot use an `ORDER BY` clause
* B. Because `OFFSET 5000000 ROWS` forces Oracle to scan and count through all 5,000,020 rows and discard the first 5,000,000 rows, whereas `Keyset Pagination` uses `WHERE (created_at, trans_id) < (:last_date, :last_id)` to seek directly to the exact position in the B-Tree index and read only 20 rows
* C. Because `Keyset Pagination` caches all 100 million rows on a floppy disk
* D. Because `OFFSET` drops all indexes on the table

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `OFFSET N ROWS` must traverse and count $N$ rows before returning the next page ($O(N + M)$ work). **Keyset / Seek Pagination** passes the last seen sort key (`:last_date, :last_id`) into the `WHERE` clause, allowing an $O(\log N)$ B-Tree index range scan to jump straight to the next 20 rows in ~1ms regardless of page depth.
</details>

---

### Question 9
**The `ORDERS` table contains 1,000 rows: `300` rows with `status = 'PAID'`, `500` rows with `status = 'PENDING'`, and `200` rows with `status = 'CANCELLED'`. A developer runs the query below to count the `'PAID'` orders. What value is returned for `paid_cnt`?**

```sql
SELECT COUNT(CASE WHEN status = 'PAID' THEN 1 ELSE 0 END) AS paid_cnt
FROM orders;
```

* A. `300`
* B. `1000`
* C. `0`
* D. `700`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `COUNT(expr)` counts every row where **`expr IS NOT NULL`**. Because `0` is a non-null number (`0 IS NOT NULL`), `COUNT` counts both the `1`s (300 rows) and the `0`s (700 rows), returning **`1000`**! To count only matching rows, omit `ELSE 0` (`COUNT(CASE WHEN status = 'PAID' THEN 1 END)`) or use `SUM(CASE WHEN status = 'PAID' THEN 1 ELSE 0 END)`.
</details>

---

### Question 10
**The `CONTACTS` table has no primary key and contains duplicate rows with identical `(phone, email)` pairs. Which `DELETE` statement removes all duplicate copies while keeping exactly 1 unique row for each `(phone, email)` pair?**

```sql
-- Which statement is valid in Oracle SQL?
```

* A. `DELETE FROM contacts GROUP BY phone, email HAVING COUNT(*) > 1;`
* B. `DELETE FROM contacts WHERE rowid NOT IN (SELECT MIN(rowid) FROM contacts GROUP BY phone, email);`
* C. `DELETE DISTINCT phone, email FROM contacts;`
* D. `DELETE FROM contacts WHERE ROWNUM > 1 GROUP BY phone, email;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Every physical row in an Oracle heap table has a unique `ROWID`. The subquery `SELECT MIN(rowid) FROM contacts GROUP BY phone, email` selects one survivor `ROWID` per distinct `(phone, email)` group, and the outer `DELETE` removes all other duplicate rows.
</details>

---

### Question 11
**If the `SUBSCRIBERS` table has duplicate rows per `SUB_CODE` and business rules require keeping the row with the **latest `UPDATED_AT` timestamp** (breaking ties by keeping the highest `ID`) while deleting older duplicates, which approach inside `WHERE rowid IN (...)` is most accurate?**

* A. Use the analytic function `ROW_NUMBER() OVER (PARTITION BY sub_code ORDER BY updated_at DESC, id DESC) AS rn` inside an inline view and delete rows where `rn > 1`
* B. Use `RANK() OVER (PARTITION BY sub_code ORDER BY updated_at ASC) AS rn` and delete where `rn = 1`
* C. Use `MIN(rowid)` with `GROUP BY sub_code`
* D. Use `COUNT(*) OVER ()`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** `ROW_NUMBER() OVER (PARTITION BY sub_code ORDER BY updated_at DESC, id DESC)` assigns `rn = 1` to the newest record per `sub_code` and `rn > 1` to all older duplicates, allowing precise deletion of `rn > 1`.
</details>

---

### Question 12
**Among Oracle's Regular Expression functions, which one is a boolean condition designed specifically for use in `WHERE` clauses or `CHECK` constraints (similar to the `LIKE` operator)?**

* A. `REGEXP_SUBSTR`
* B. `REGEXP_INSTR`
* C. `REGEXP_LIKE`
* D. `REGEXP_MATCH`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `REGEXP_LIKE(source_char, pattern [, match_param])` is a boolean predicate function used in `WHERE`, `HAVING`, `CHECK`, or `CASE WHEN` conditions.
</details>

---

### Question 13
**Examine the `REGEXP_SUBSTR` query below. What is the returned result?**

```sql
SELECT REGEXP_SUBSTR('VNPT-IT-2026-OCP', '[^-]+', 1, 3) AS result
FROM dual;
```

* A. `'VNPT'`
* B. `'IT'`
* C. `'2026'`
* D. `'OCP'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** The pattern `[^-]+` matches contiguous non-hyphen tokens. Starting at position `1`, the 1st occurrence is `'VNPT'`, the 2nd is `'IT'`, and the **3rd occurrence (`occurrence = 3`) is `'2026'`**.
</details>

---

### Question 14
**What is the output of the following `REGEXP_REPLACE` query using backreferences (`\1`, `\2`)?**

```sql
SELECT REGEXP_REPLACE('0912345678', '^(\d{3})\d{4}(\d{3})$', '\1-****-\2') AS masked
FROM dual;
```

* A. `'091-****-678'`
* B. `'***-2345-***'`
* C. `'\1-****-\2'`
* D. `'0912-****-5678'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** Capture group 1 `(\d{3})` captures `'091'` (`\1`), the middle `\d{4}` matches `'2345'`, and capture group 2 `(\d{3})` captures `'678'` (`\2`). The replacement string `'\1-****-\2'` produces **`'091-****-678'`**.
</details>

---

### Question 15
**In `REGEXP_INSTR(source_char, pattern, position, occurrence, return_option, match_param)`, when the 5th argument (`return_option`) is set to `1` (instead of the default `0`), what does the function return?**

```sql
SELECT REGEXP_INSTR('Oracle_21c_DB', '\d+c', 1, 1, 1) AS pos FROM dual;
```

* A. The starting character position of the match (`8` — the position of `'2'`)
* B. The character position **immediately following the end** of the match (`11` — the position of the second `'_'` after `'21c'`)
* C. The length of the matched substring (`3`)
* D. Always `1`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In `'Oracle_21c_DB'`, `\d+c` matches `'21c'` at positions 8..10. With `return_option = 0`, it returns `8` (start of match). With **`return_option = 1`**, it returns **`11`** (the position of the character immediately after the match).
</details>

---

### Question 16
**Which `match_param` flag in Oracle's `REGEXP_*` functions allows the period (`.`) metacharacter to match the newline character (`CHR(10)`)?**

* A. `'i'`
* B. `'c'`
* C. `'n'`
* D. `'x'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** By default, `.` matches any single character except newline. Passing `'n'` enables `.` to match newline characters as well. (`'i'` = case-insensitive, `'c'` = case-sensitive, `'x'` = ignore whitespace in pattern).
</details>

---

### Question 17
**Examine the `REGEXP_COUNT` query below. What value does it return?**

```sql
SELECT REGEXP_COUNT('abababa', 'aba', 1) AS cnt FROM dual;
```

* A. `3`
* B. `2`
* C. `1`
* D. `0`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `REGEXP_COUNT` counts **non-overlapping** occurrences from left to right. The first match consumes positions 1..3 (**`aba`**`baba`). Searching resumes at position 4 (`baba`), where a second match is found at positions 5..7 (`b`**`aba`**), yielding **`2`**.
</details>

---

### Question 18
**In Oracle POSIX regular expressions, what is the character class `[[:digit:]]` equivalent to?**

* A. `[a-zA-Z]`
* B. `[0-9]` (or `\d`)
* C. `[^0-9]`
* D. `[ \t\r\n]`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The POSIX character class `[:digit:]` inside bracket expression `[[:digit:]]` matches any single numeric digit (`[0-9]` or `\d`).
</details>

---

### Question 19
**The `ENROLLMENTS` table has columns `(student_id, course_id, student_name, grade)` with a composite primary key `(student_id, course_id)`. The non-key attribute `student_name` depends only on `student_id` and not on `course_id`. Which Normal Form does this table directly violate?**

* A. First Normal Form (`1NF`)
* B. Second Normal Form (`2NF`) due to a Partial Functional Dependency of a non-key attribute on part of a composite primary key
* C. Only `BCNF`, while satisfying `3NF`
* D. It satisfies `3NF`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** **Second Normal Form (`2NF`)** requires that the table be in `1NF` and that every non-key attribute be fully functionally dependent on the **entire** primary key. Because `student_name` depends only on `student_id` (a proper subset of the composite key `(student_id, course_id)`), it exhibits a **Partial Dependency**, violating `2NF`.
</details>

---

### Question 20
**The `EMPLOYEES` table has a single-column primary key `emp_id` and columns `(emp_id PK, emp_name, dept_id, dept_name, dept_location)`, where `emp_id -> dept_id` and `dept_id -> (dept_name, dept_location)`. Which Normal Form does this table satisfy, and which Normal Form does it violate?**

* A. Violates `1NF`
* B. Satisfies `1NF` but violates `2NF`
* C. Satisfies `2NF` (since the primary key is a single column `emp_id`, partial dependencies cannot exist), but **violates `3NF`** due to a Transitive Dependency (`emp_id -> dept_id -> dept_name`)
* D. Satisfies `BCNF`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Because the primary key is a single column (`emp_id`) and all values are atomic, the table is automatically in `2NF`. However, non-key attributes `dept_name` and `dept_location` depend on another non-key attribute `dept_id` (`emp_id -> dept_id -> dept_name`), which is a **Transitive Dependency** that violates **Third Normal Form (`3NF`)**.
</details>

---

### Question 21
**In a `MERGE` statement, if you only want to update existing matching rows without inserting any new rows when no match is found, is it legal to write a `MERGE` statement containing ONLY the `WHEN MATCHED THEN UPDATE` clause (omitting `WHEN NOT MATCHED` entirely)?**

* A. Yes, it is completely LEGAL (since Oracle 10g, `WHEN MATCHED` and `WHEN NOT MATCHED` are optional and independent; a `MERGE` statement can include both or either one alone)
* B. No, both `WHEN MATCHED` and `WHEN NOT MATCHED` are mandatory
* C. You can omit `WHEN MATCHED`, but you can never omit `WHEN NOT MATCHED`
* D. You must write `WHEN NOT MATCHED THEN NULL;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** In modern Oracle SQL, a `MERGE` statement can contain both clauses, only `WHEN MATCHED THEN UPDATE`, or only `WHEN NOT MATCHED THEN INSERT`.
</details>

---

### Question 22
**What practical problem does the following hierarchical `CONNECT BY LEVEL <= ...` query combined with `REGEXP_SUBSTR` solve?**

```sql
SELECT TRIM(REGEXP_SUBSTR('HN,HCM,DN,HP', '[^,]+', 1, LEVEL)) AS city_code
FROM dual
CONNECT BY LEVEL <= REGEXP_COUNT('HN,HCM,DN,HP', ',') + 1;
```

* A. Concatenating 4 rows into a single comma-delimited string
* B. Splitting a comma-delimited string (`'HN,HCM,DN,HP'`) into **4 separate rows** (`'HN'`, `'HCM'`, `'DN'`, `'HP'`)
* C. Dropping the `DUAL` table
* D. Counting the number of letters in the string

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** This is the classic Oracle SQL idiom for splitting a CSV string into rows: `REGEXP_COUNT(..., ',') + 1` calculates the number of tokens (`4`), `CONNECT BY LEVEL <= 4` generates 4 rows (`LEVEL` 1..4), and `REGEXP_SUBSTR(..., '[^,]+', 1, LEVEL)` extracts the $N$-th token for each row.
</details>

---

### Question 23
**When using DML Error Logging (`LOG ERRORS INTO err$_table REJECT LIMIT UNLIMITED`), which of the following errors will STILL cause the entire `MERGE` or `UPDATE` statement to abort and roll back?**

* A. A `NOT NULL` constraint violation (`ORA-01400` / `ORA-01407`)
* B. Value too large for column (`ORA-12899`)
* C. Division by zero (`ORA-01476`)
* D. Unstable set of source rows in `MERGE` (`ORA-30926: unable to get a stable set of rows`) or running out of tablespace storage (`ORA-01653`)

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** DML Error Logging captures row-level data/constraint errors (`NOT NULL`, `CHECK`, `FOREIGN KEY`, string length, division by zero, `UNIQUE` on `INSERT`), but statement-level structural errors like **`ORA-30926`** in `MERGE` or space exhaustion errors still abort the entire statement.
</details>

---

### Question 24
**What is the primary purpose of `Denormalization` when designing schemas for large Reporting / Data Warehouse systems?**

* A. To minimize disk space usage
* B. To speed up small single-row `INSERT`, `UPDATE`, and `DELETE` transactions
* C. To intentionally introduce controlled data redundancy (such as pre-joined attributes or summary columns) to **reduce expensive multi-table `JOIN`s** and **accelerate read (`SELECT`) query performance**
* D. To remove all `PRIMARY KEY` constraints from the database

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** While normalization (`3NF`/`BCNF`) optimizes write integrity and eliminates redundancy in OLTP systems, **Denormalization** trades controlled redundancy and extra write maintenance for significantly faster **`SELECT` query performance** by avoiding costly multi-table joins.
</details>

---

### Question 25
**For which of the following `code` values will `REGEXP_LIKE(code, '^[A-Z]{2}-[0-9]{4}$', 'c')` return `TRUE`?**

* A. `'vn-2026'`
* B. `'VN-2026'`
* C. `'VNP-2026'`
* D. `'VN-2026-A'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** With `'c'` (case-sensitive matching), `^[A-Z]{2}-[0-9]{4}$` requires the string to start (`^`) with exactly 2 uppercase letters, followed by a hyphen `-`, followed by exactly 4 digits, and end (`$`). Only `'VN-2026'` matches.
</details>

---
