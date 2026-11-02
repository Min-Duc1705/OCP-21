# Review Questions - Chapter 11: DDL and Schema Objects Management

> **Reference:** *OCA/OCP Oracle Database SQL Exam Guide (Exam 1Z0-071)* & VNPT IT Proficiency Assessment.  
> **Total Questions:** 25 standard Oracle certification multiple-choice questions with detailed explanations.  
> **How to study:** Read each question carefully and select your answer first, then click **"👉 View Answer & Detailed Explanation"** to check the correct answer and master key exam traps.

---

### Question 1
**Which of the following table names is a valid standard nonquoted identifier in Oracle Database?**

* A. `_EMP_HISTORY_2026`
* B. `2026_SALES_DATA`
* C. `EMP$SAL#INFO_1`
* D. `EMP-SALARY-TABLE`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** A nonquoted identifier in Oracle must begin with an alphabetic character (`A-Z`, `a-z`) and may subsequently contain letters, digits (`0-9`), and three special symbols: the underscore (`_`), dollar sign (`$`), and pound/hash sign (`#`). Thus `EMP$SAL#INFO_1` is completely valid.
  * **A, B are incorrect:** Nonquoted identifiers in Oracle **cannot start with an underscore (`_`) or a digit** (unlike Java or C identifiers).
  * **D is incorrect:** The hyphen (`-`) is interpreted as the subtraction operator and is not permitted in nonquoted identifiers.
</details>

---

### Question 2
**Within a single schema (user) in Oracle Database, which of the following objects CAN have the exact same name as an existing `TABLE`?**

* A. `VIEW`
* B. `SEQUENCE`
* C. `INDEX`
* D. `PRIVATE SYNONYM`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In Oracle Database, `INDEX` objects (as well as `CONSTRAINT` and `TRIGGER` objects) reside in their own separate **namespaces** within a schema. Therefore, an `INDEX` can have the exact same name as an existing `TABLE` in the same schema.
  * **A, B, D are incorrect:** `TABLE`, `VIEW`, `SEQUENCE`, and `PRIVATE SYNONYM` share the same schema namespace and cannot share the same name (`ORA-00955: name is already used by an existing object`).
</details>

---

### Question 3
**Examine the `CREATE TABLE` and two `INSERT` statements below. After execution, what are the values of `(col_a, col_b)` in the row where `id = 2`?**

```sql
CREATE TABLE test_def (
    id    NUMBER PRIMARY KEY,
    col_a NUMBER DEFAULT 10,
    col_b NUMBER DEFAULT ON NULL 20
);

INSERT INTO test_def (id) VALUES (1);
INSERT INTO test_def (id, col_a, col_b) VALUES (2, NULL, NULL);
```

* A. `(10, 20)`
* B. `(NULL, 20)`
* C. `(NULL, NULL)`
* D. The second `INSERT` statement fails because you cannot explicitly pass `NULL` to a column defined with `DEFAULT ON NULL`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * `col_a` is defined with a standard `DEFAULT 10`: the default value is applied only when the column is omitted from the `INSERT` column list (as in `id = 1`) or when the `DEFAULT` keyword is used. When `NULL` is explicitly supplied in `id = 2`, `col_a` stores `NULL`.
    * `col_b` is defined with `DEFAULT ON NULL 20`: even when `NULL` is explicitly passed in an `INSERT` statement, Oracle automatically substitutes the default value `20`.
    * Therefore, for `id = 2`, `(col_a, col_b)` is `(NULL, 20)`.
  * **A, C, D are incorrect:** They confuse standard `DEFAULT` behavior with `DEFAULT ON NULL` (introduced in Oracle 12c).
</details>

---

### Question 4
**Continuing with the `TEST_DEF` table from Question 3 (where `col_b NUMBER DEFAULT ON NULL 20`), what happens when you execute the `UPDATE` statement below?**

```sql
UPDATE test_def
SET col_b = NULL
WHERE id = 1;
```

* A. The value of `col_b` for `id = 1` is automatically set to `20`.
* B. The value of `col_b` for `id = 1` is updated to `NULL`.
* C. The statement fails and raises `ORA-01407: cannot update ("TEST_DEF"."COL_B") to NULL`.
* D. The statement succeeds without modifying any rows.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Defining a column with `DEFAULT ON NULL` **implicitly adds a `NOT NULL` constraint** to that column. Furthermore, `DEFAULT ON NULL` automatic substitution **only applies to `INSERT` operations**, NOT to `UPDATE` statements! Consequently, `UPDATE test_def SET col_b = NULL` does not assign `20`, and instead fails with `ORA-01407` due to the implicit `NOT NULL` constraint.
  * **A, B, D are incorrect:** This is a subtle OCP exam trap testing the difference between `INSERT` and `UPDATE` on `DEFAULT ON NULL` columns.
</details>

---

### Question 5
**The `CUSTOMERS` table is created using the statement below. Which of the following `INSERT` statements will execute SUCCESSFULLY?**

```sql
CREATE TABLE customers (
    cust_id   NUMBER GENERATED ALWAYS AS IDENTITY,
    cust_name VARCHAR2(50)
);
```

* A. `INSERT INTO customers VALUES (1, 'Nguyen Van A');`
* B. `INSERT INTO customers VALUES (NULL, 'Nguyen Van A');`
* C. `INSERT INTO customers (cust_name) VALUES ('Nguyen Van A');`
* D. Both A and C execute successfully.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** When an identity column is defined as `GENERATED ALWAYS AS IDENTITY`, its value is **always** generated by Oracle's internal sequence. Users must omit `cust_id` from the `INSERT` column list (or specify the `DEFAULT` keyword).
  * **A, B, D are incorrect:** Explicitly supplying any value (whether `1` or `NULL`) for a `GENERATED ALWAYS AS IDENTITY` column raises `ORA-32795: cannot insert into a generated always identity column`.
</details>

---

### Question 6
**Which of the following statements is TRUE regarding an `IDENTITY` column in Oracle Database?**

* A. A single table can contain up to 2 `IDENTITY` columns (one for the primary key and one for a surrogate key).
* B. Defining a column as `IDENTITY` automatically makes it the `PRIMARY KEY` of the table.
* C. An `IDENTITY` column must have a numeric data type, automatically receives a `NOT NULL` constraint, and a table can have at most one `IDENTITY` column.
* D. When creating a new table using `CREATE TABLE ... AS SELECT` (CTAS), the `IDENTITY` property is copied to the new table.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Each table can have **at most one `IDENTITY` column**, its data type must be numeric (`NUMBER`, `INTEGER`, etc.), and Oracle automatically applies `NOT NULL` and `NOT DEFERRABLE` constraints to it.
  * **A is incorrect:** A table can have only one `IDENTITY` column (`ORA-30673`).
  * **B is incorrect:** An `IDENTITY` column is **not automatically a `PRIMARY KEY` or `UNIQUE`**. If `GENERATED BY DEFAULT` is used without an explicit `PRIMARY KEY`/`UNIQUE` constraint, duplicate values can be inserted manually.
  * **D is incorrect:** CTAS does not copy the `IDENTITY` property to the target table (only the `NOT NULL` constraint is copied).
</details>

---

### Question 7
**The `EMPLOYEES` table has the following constraints and defaults: `EMP_ID` is `PRIMARY KEY`, `EMAIL` is `UNIQUE`, `FULL_NAME` is `NOT NULL`, `SALARY` has `CHECK (salary > 0)` and `DEFAULT 1000`, and `DEPT_ID` is `FOREIGN KEY`. You execute the CTAS statement below to create `EMP_COPY`. Which constraints or attributes are retained on `EMP_COPY`?**

```sql
CREATE TABLE emp_copy AS
SELECT emp_id, email, full_name, salary, dept_id
FROM employees;
```

* A. All `PRIMARY KEY`, `UNIQUE`, `NOT NULL`, `CHECK` constraints, and `DEFAULT` values are retained (except `FOREIGN KEY`).
* B. Only the `PRIMARY KEY` on `EMP_ID` and `NOT NULL` on `FULL_NAME` are retained.
* C. Only the `NOT NULL` constraints (on `FULL_NAME` and on `EMP_ID`, which inherited `NOT NULL` from the primary key) are retained; all `PRIMARY KEY`, `UNIQUE`, `FOREIGN KEY`, `CHECK` constraints, and `DEFAULT` values are NOT copied.
* D. No constraints of any kind (including `NOT NULL`) are copied to `EMP_COPY`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `CREATE TABLE ... AS SELECT` (CTAS) copies column names, data types, column lengths, the selected rows, and **only validated `NOT NULL` constraints**! All `PRIMARY KEY`, `UNIQUE`, `FOREIGN KEY`, and `CHECK` constraints, as well as `DEFAULT` values, `IDENTITY` properties, and `INDEX` structures, are omitted on the new table.
  * **A, B, D are incorrect:** This is one of the most frequently tested rules on the OCA 1Z0-071 exam.
</details>

---

### Question 8
**Why does the following `CREATE TABLE ... AS SELECT` statement fail when executed?**

```sql
CREATE TABLE emp_bonus_report AS
SELECT emp_id, full_name, salary * 0.15
FROM employees
WHERE dept_id = 20;
```

* A. A `WHERE` clause is not allowed in a `CREATE TABLE ... AS SELECT` statement.
* B. The expression `salary * 0.15` does not have a column alias, so Oracle cannot determine a valid column name for the third column (`ORA-00998`).
* C. The `INTO` keyword is missing after `emp_bonus_report`.
* D. Arithmetic operations cannot be performed inside a DDL statement.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In a CTAS statement, column names in the new table are derived from the `SELECT` list. Any expression (`salary * 0.15`) or function call **must** be given a column alias (`salary * 0.15 AS bonus`) or named in a column list right after `CREATE TABLE emp_bonus_report (id, name, bonus) AS ...`. Otherwise, Oracle raises `ORA-00998: must name this expression with a column alias`.
  * **A, C, D are incorrect:** `WHERE` clauses and arithmetic expressions are valid in CTAS, and CTAS uses `AS` rather than `INTO`.
</details>

---

### Question 9
**The `PRODUCTS` table currently contains `500` rows. You want to add a new column named `STATUS` of type `VARCHAR2(10)` with a `NOT NULL` constraint in a single `ALTER TABLE ... ADD` statement. Which of the following statements will execute SUCCESSFULLY?**

* A. `ALTER TABLE products ADD (status VARCHAR2(10) NOT NULL);`
* B. `ALTER TABLE products ADD (status VARCHAR2(10) DEFAULT 'ACTIVE' NOT NULL);`
* C. `ALTER TABLE products ADD COLUMN (status VARCHAR2(10) DEFAULT 'ACTIVE' NOT NULL);`
* D. You cannot add a `NOT NULL` column to a populated table under any circumstances without first truncating the table.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** When adding a `NOT NULL` column to a table that already contains rows, you **must specify a non-null `DEFAULT` value** so Oracle can populate the new column across all existing rows.
  * **A is incorrect:** Adding a `NOT NULL` column without a `DEFAULT` clause to a non-empty table raises `ORA-01758: table must be empty to add mandatory (NOT NULL) column`.
  * **C is incorrect:** In Oracle SQL, `ALTER TABLE ... ADD` does **not** use the `COLUMN` keyword!
  * **D is incorrect:** Including a `DEFAULT` clause allows adding a `NOT NULL` column to a populated table.
</details>

---

### Question 10
**The `EMPLOYEES` table currently contains `1,000` rows. The `JOB_TITLE` column is `VARCHAR2(50)` and the longest string currently stored in it is `18` characters. The `SALARY` column is `NUMBER(10,2)` and every row has a non-null salary. Which of the following statements is TRUE when using `ALTER TABLE employees MODIFY`?**

* A. You can decrease `JOB_TITLE` to `VARCHAR2(20)` successfully, but you CANNOT decrease `SALARY` to `NUMBER(8,2)`.
* B. Neither `JOB_TITLE` nor `SALARY` can be decreased in size because the table contains non-null data.
* C. Both `JOB_TITLE` (to `VARCHAR2(20)`) and `SALARY` (to `NUMBER(8,2)`) can be decreased as long as no existing salary exceeds 6 integer digits.
* D. You can change the data type of `JOB_TITLE` to `NUMBER(20)` without clearing the column data.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** Note the critical distinction between character and numeric columns in `ALTER TABLE ... MODIFY`:
    * For character columns (`VARCHAR2`, `CHAR`): Oracle **allows decreasing column length** even when rows contain data, provided every existing value has a length less than or equal to the new size (here, max length `18` $\le 20$).
    * For numeric columns (`NUMBER`): Decreasing precision or scale requires the column to be **`NULL` across all rows** (or the table to be empty), regardless of how small the existing numbers are (`ORA-01440: column to be modified must be empty to decrease precision or scale`).
  * **B, C, D are incorrect:** Changing data types also requires all rows to have `NULL` in that column.
</details>

---

### Question 11
**The `ORDERS` table has 4 columns: `ORDER_ID`, `ORDER_DATE`, `TEMP_NOTE1`, `TEMP_NOTE2`. You want to drop both `TEMP_NOTE1` and `TEMP_NOTE2` simultaneously in a single statement. Which statement uses VALID syntax in Oracle SQL?**

```sql
-- ORDERS (order_id, order_date, temp_note1, temp_note2)
```

* A. `ALTER TABLE orders DROP COLUMN temp_note1, temp_note2;`
* B. `ALTER TABLE orders DROP COLUMN (temp_note1, temp_note2);`
* C. `ALTER TABLE orders DROP (temp_note1, temp_note2);`
* D. `ALTER TABLE orders DELETE (temp_note1, temp_note2);`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** When dropping **multiple columns** at once in Oracle, the column list must be enclosed in parentheses `(col1, col2)` and **must NOT include the `COLUMN` keyword**: `ALTER TABLE orders DROP (temp_note1, temp_note2);`.
  * **A, B are incorrect:** The `DROP COLUMN` keyword form is valid only when dropping a **single** column without parentheses (`ALTER TABLE orders DROP COLUMN temp_note1;`). Writing `DROP COLUMN (c1, c2)` raises `ORA-00905: missing keyword`.
  * **D is incorrect:** `DELETE` removes rows, not columns.
</details>

---

### Question 12
**When you execute `ALTER TABLE employees SET UNUSED (commission_pct);`, which of the following occurs? (Choose the best answer)**

* A. `commission_pct` is temporarily hidden from `SELECT *` queries, and you can restore it later using `ALTER TABLE employees SET USED (commission_pct);`.
* B. The physical data for `commission_pct` is immediately removed from all data blocks on disk to free up storage space.
* C. `commission_pct` is marked as unused in the Data Dictionary (making it inaccessible and **permanently irrecoverable**), and you can immediately add a new column named `commission_pct` to `employees`.
* D. You can issue `ROLLBACK;` immediately afterward to recover the `commission_pct` column.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `SET UNUSED` updates only the Data Dictionary metadata, completing instantaneously. Once marked unused, the column disappears from `DESCRIBE` and `SELECT`, **cannot be restored by any command**, and a new column with the same name (`commission_pct`) can immediately be added to the table!
  * **A is incorrect:** There is no `SET USED` command in Oracle.
  * **B is incorrect:** Physical row data remains in the table blocks until `ALTER TABLE employees DROP UNUSED COLUMNS;` is executed.
  * **D is incorrect:** `ALTER TABLE` is a DDL statement and auto-commits.
</details>

---

### Question 13
**The `ARCHIVE_LOGS` table has been placed in read-only mode using `ALTER TABLE archive_logs READ ONLY;`. While the table is in `READ ONLY` mode, which of the following statements is STILL ALLOWED to execute successfully?**

```sql
ALTER TABLE archive_logs READ ONLY;
```

* A. `TRUNCATE TABLE archive_logs;`
* B. `ALTER TABLE archive_logs DROP COLUMN log_detail;`
* C. `DROP TABLE archive_logs;`
* D. `SELECT * FROM archive_logs FOR UPDATE;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** This is a classic OCP exam trap: `READ ONLY` mode blocks operations that modify the table's data blocks, but **`DROP TABLE archive_logs;`** only modifies the Data Dictionary (moving the table to the Recycle Bin or deallocating its segment) and is **completely permitted** on a `READ ONLY` table! (Similarly, `ALTER TABLE ... SET UNUSED` is also allowed).
  * **A, B, D are incorrect:** `TRUNCATE TABLE`, `ALTER TABLE ... DROP COLUMN` (which modifies physical data blocks), and `SELECT ... FOR UPDATE` (which acquires row locks) are all prohibited on a `READ ONLY` table and raise `ORA-12081: update operation not allowed on table`.
</details>

---

### Question 14
**The system parameter `RECYCLEBIN` is set to `ON`. You perform the following sequence of operations:**
1. Create a `SALES` table (with 100 rows) and execute `DROP TABLE sales;`.
2. Create a new `SALES` table (with 5 rows) and execute `DROP TABLE sales;`.
3. Execute `FLASHBACK TABLE sales TO BEFORE DROP;`.

**After step 3, how many rows are in the restored `SALES` table?**

* A. 100 rows (restores the oldest dropped table in FIFO order).
* B. 5 rows (restores the most recently dropped table in LIFO order).
* C. 105 rows (merges both dropped tables from the Recycle Bin).
* D. The `FLASHBACK TABLE` statement fails because there are two tables with `ORIGINAL_NAME = 'SALES'` in the Recycle Bin.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** When multiple dropped tables share the same original name in `USER_RECYCLEBIN`, executing `FLASHBACK TABLE sales TO BEFORE DROP;` (using the original name rather than the system-generated `BIN$...` name) always follows **LIFO (Last In, First Out)** order, restoring the most recently dropped `SALES` table (the one with 5 rows).
  * **A, C, D are incorrect:** You can still restore the older 100-row table afterward by running `FLASHBACK TABLE sales TO BEFORE DROP RENAME TO sales_old;` or specifying its `BIN$...` name.
</details>

---

### Question 15
**When a table is dropped using `DROP TABLE emp;` and subsequently recovered from the Recycle Bin using `FLASHBACK TABLE emp TO BEFORE DROP;`, which of the following dependent objects or constraints of `EMP` is NOT restored?**

* A. Indexes (`INDEX`) created on `EMP`.
* B. `PRIMARY KEY` and `CHECK` constraints on `EMP`.
* C. `FOREIGN KEY` (referential integrity) constraints defined on `EMP`.
* D. `NOT NULL` constraints on the columns of `EMP`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** When a table is restored via `FLASHBACK TABLE ... TO BEFORE DROP`, its data, indexes (except bitmap join indexes), triggers, and `PRIMARY KEY`, `UNIQUE`, `CHECK`, and `NOT NULL` constraints are all restored (with system-generated `BIN$...` names). However, **`FOREIGN KEY` constraints are permanently dropped** when `DROP TABLE` executes and are **never restored** from the Recycle Bin!
  * **A, B, D are incorrect:** All of these are preserved in the Recycle Bin and restored with the table.
</details>

---

### Question 16
**The `DEPARTMENTS` table has a primary key `DEPT_ID` and contains 10 rows. The `EMPLOYEES` table has an `ENABLED` foreign key `DEPT_ID` referencing `DEPARTMENTS(DEPT_ID)`, but `EMPLOYEES` is currently completely empty (`0` rows). What is the outcome of executing `TRUNCATE TABLE departments;`?**

```sql
-- DEPARTMENTS: 10 rows (PK: dept_id)
-- EMPLOYEES: 0 rows (FK: dept_id REFERENCES departments(dept_id) ENABLE)
TRUNCATE TABLE departments;
```

* A. It succeeds and removes all 10 departments because `EMPLOYEES` contains no child rows.
* B. It fails and raises `ORA-02266: unique/primary keys in table referenced by enabled foreign keys`.
* C. It succeeds and automatically drops the `EMPLOYEES` table.
* D. It succeeds and automatically disables the foreign key constraint on `EMPLOYEES`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Unlike `DELETE` (which checks actual row data), the DDL statement `TRUNCATE TABLE` checks metadata in the Data Dictionary. If any other table has an **`ENABLED` foreign key constraint** referencing `DEPARTMENTS`, `TRUNCATE TABLE departments;` fails immediately with `ORA-02266`, **even when the child table `EMPLOYEES` is completely empty (`0` rows)**!
  * **A, C, D are incorrect:** You must disable or drop the foreign key first (or define the foreign key with `ON DELETE CASCADE` and use `TRUNCATE TABLE departments CASCADE;`).
</details>

---

### Question 17
**You want to rename the table `EMP_OLD` to `EMP_NEW` in your schema. Which pair of statements below BOTH use VALID syntax in Oracle SQL?**

* A. `RENAME TABLE emp_old TO emp_new;` and `ALTER TABLE emp_old RENAME TO emp_new;`
* B. `RENAME emp_old TO emp_new;` and `ALTER TABLE emp_old RENAME TO emp_new;`
* C. `RENAME emp_old TO emp_new;` and `ALTER TABLE RENAME emp_old TO emp_new;`
* D. `ALTER RENAME TABLE emp_old TO emp_new;` and `RENAME TABLE emp_old TO emp_new;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** There are two valid ways to rename a table in Oracle SQL:
    1. Standalone `RENAME`: `RENAME emp_old TO emp_new;` (**without** the `TABLE` keyword!).
    2. `ALTER TABLE`: `ALTER TABLE emp_old RENAME TO emp_new;`.
  * **A, C, D are incorrect:** Writing `RENAME TABLE ...` is a classic syntax trap on the 1Z0-071 exam.
</details>

---

### Question 18
**A Global Temporary Table is created using the statement below (omitting the `ON COMMIT` clause). Session A inserts 5 rows into `TEMP_REPORT` and executes `COMMIT;`. Immediately afterward, Session A executes `SELECT COUNT(*) FROM temp_report;`. What result is returned?**

```sql
CREATE GLOBAL TEMPORARY TABLE temp_report (
    rep_id   NUMBER,
    rep_data VARCHAR2(100)
);
```

* A. `5`
* B. `0`
* C. An error is raised because `CREATE GLOBAL TEMPORARY TABLE` requires an explicit `ON COMMIT` clause.
* D. An error is raised because `COMMIT` cannot be called after inserting into a temporary table.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** When `CREATE GLOBAL TEMPORARY TABLE` omits the `ON COMMIT` clause, Oracle defaults to **`ON COMMIT DELETE ROWS`** (transaction-specific data). Therefore, as soon as Session A executes `COMMIT;`, all 5 rows are automatically deleted, and the subsequent `SELECT COUNT(*)` returns `0`!
  * **A is incorrect:** Rows persist across commits only if `ON COMMIT PRESERVE ROWS` is explicitly specified.
  * **C, D are incorrect:** `ON COMMIT` is optional (defaulting to `DELETE ROWS`) and `COMMIT` is completely valid.
</details>

---

### Question 19
**In Oracle 18c and later, assuming default system parameter settings, which of the following statements validly creates a Private Temporary Table (`PRIVATE TEMPORARY TABLE`)?**

* A. `CREATE PRIVATE TEMPORARY TABLE my_temp_tab (id NUMBER) ON COMMIT PRESERVE ROWS;`
* B. `CREATE PRIVATE TEMPORARY TABLE ora$ptt_my_temp (id NUMBER) ON COMMIT PRESERVE DEFINITION;`
* C. `CREATE PRIVATE TEMPORARY TABLE ora$ptt_my_temp (id NUMBER) ON COMMIT DELETE ROWS;`
* D. `CREATE PRIVATE TEMPORARY TABLE ptt_my_temp (id NUMBER) ON COMMIT DROP DEFINITION;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** A `PRIVATE TEMPORARY TABLE` (PTT) has two strict syntax rules that distinguish it from a GTT:
    1. Its table name must begin with the prefix defined by `PRIVATE_TEMP_TABLE_PREFIX`, which defaults to **`ORA$PTT_`** (`ora$ptt_my_temp`).
    2. Its `ON COMMIT` clause uses the keyword **`DEFINITION`** (`ON COMMIT DROP DEFINITION` by default, or `ON COMMIT PRESERVE DEFINITION`), NOT `ROWS`!
  * **A, C, D are incorrect:** A and D lack the required `ORA$PTT_` prefix; A and C use `ROWS` (which is only valid for `GLOBAL TEMPORARY TABLE`).
</details>

---

### Question 20
**Which of the following statements is TRUE regarding an `EXTERNAL TABLE` in Oracle Database?**

* A. You can create a `B-Tree Index` on the key column of an `EXTERNAL TABLE` to speed up queries against CSV files.
* B. You can execute `UPDATE` and `DELETE` statements on an `EXTERNAL TABLE` if it uses the `ORACLE_DATAPUMP` access driver.
* C. Executing `DROP TABLE` on an `EXTERNAL TABLE` deletes both the table metadata in the database and the physical flat file on the operating system.
* D. An `EXTERNAL TABLE` does not support any DML statements (`INSERT`, `UPDATE`, `DELETE`, `MERGE`) and cannot have indexes created on it.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** Because the data of an `EXTERNAL TABLE` resides in external operating system files, no DML operations (`INSERT`, `UPDATE`, `DELETE`, `MERGE`) and no `INDEX` creation are permitted on an external table (`ORA-30657: operation not supported on external organized table`).
  * **A, B are incorrect:** Neither indexing nor DML is supported regardless of the access driver (`ORACLE_LOADER` or `ORACLE_DATAPUMP`).
  * **C is incorrect:** `DROP TABLE` removes only the metadata definition in the Data Dictionary; the OS file remains untouched.
</details>

---

### Question 21
**When creating an Index-Organized Table (IOT) using the `ORGANIZATION INDEX` clause, which of the following is MANDATORY for the `CREATE TABLE` statement to succeed?**

```sql
CREATE TABLE countries_iot (
    country_id   CHAR(2) ...,
    country_name VARCHAR2(40)
) ORGANIZATION INDEX;
```

* A. The table must have at least one `NUMBER` column.
* B. The table must have a `PRIMARY KEY` constraint specified.
* C. The table must specify `TABLESPACE temp`.
* D. The table must have a `GENERATED ALWAYS AS IDENTITY` column.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In an Index-Organized Table (`ORGANIZATION INDEX`), all row data is stored directly inside the leaf blocks of a B-Tree index sorted by the primary key. Therefore, defining a **`PRIMARY KEY` constraint is mandatory** when creating an IOT (`ORA-25175: no PRIMARY KEY constraint found` if omitted).
  * **A, C, D are incorrect:** The primary key can be `CHAR`, `VARCHAR2`, `DATE`, or `NUMBER`, and IOTs are stored in regular permanent tablespaces.
</details>

---

### Question 22
**What is the most accurate distinction between `DELETE FROM emp;` (without a `WHERE` clause) and `TRUNCATE TABLE emp;`?**

* A. `DELETE` removes the table structure, whereas `TRUNCATE` keeps the table structure.
* B. `TRUNCATE` fires `AFTER DELETE` DML triggers on `EMP`, whereas `DELETE` does not.
* C. `DELETE` is a DML operation that generates row-level Undo data, can be rolled back, fires DML triggers, and does not reset the High Water Mark (HWM); `TRUNCATE` is a DDL operation that auto-commits, cannot be rolled back, does not fire DML triggers, and resets the HWM.
* D. `TRUNCATE` drops all indexes on `EMP`, whereas `DELETE` preserves all indexes.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** This accurately summarizes all architectural differences between `DELETE` (DML) and `TRUNCATE` (DDL).
  * **A is incorrect:** Both `DELETE` and `TRUNCATE` preserve the table structure (only `DROP TABLE` removes the structure).
  * **B is incorrect:** `DELETE` fires DML triggers, whereas `TRUNCATE` (being DDL) does not fire DML triggers.
  * **D is incorrect:** `TRUNCATE` truncates (empties) the table's indexes while keeping their definitions valid and intact.
</details>

---

### Question 23
**In the statement `TRUNCATE TABLE sales REUSE STORAGE;`, what is the effect of the `REUSE STORAGE` clause?**

* A. It retains existing rows in `SALES` and truncates only the indexes.
* B. It moves the deleted rows into the Recycle Bin so they can be recovered with `FLASHBACK TABLE`.
* C. It removes all rows from `SALES` and resets the High Water Mark, but keeps the allocated extents assigned to `SALES` for future inserts rather than deallocating them back to the tablespace.
* D. It immediately releases the freed extents so other tables in the same tablespace can use them.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** By default, `TRUNCATE TABLE` uses `DROP STORAGE`, which deallocates extents beyond `MINEXTENTS` back to the tablespace. Specifying `REUSE STORAGE` still removes 100% of the rows and resets the HWM, but keeps all allocated extents reserved for the `SALES` table to avoid re-allocation overhead when loading new rows.
  * **A, B, D are incorrect:** `TRUNCATE` never uses the Recycle Bin, and `DROP STORAGE` is the option that frees extents for other tables.
</details>

---

### Question 24
**The `ACCOUNTS (id NUMBER, name VARCHAR2(20))` table is currently empty (`0` rows). In the current schema, there is **NO table** named `NON_EXIST_TAB`. You execute the following statements sequentially in a single session. After the script finishes, how many rows are in the `ACCOUNTS` table?**

```sql
INSERT INTO accounts VALUES (1, 'Viettel');
INSERT INTO accounts VALUES (2, 'VNPT');
DROP TABLE non_exist_tab; -- Fails with ORA-00942: table or view does not exist!
ROLLBACK;
```

* A. `0` rows (because `DROP TABLE` failed, no commit occurred, and `ROLLBACK` undid both `INSERT` statements).
* B. `2` rows (because `DROP TABLE` had valid syntax, it issued an implicit `COMMIT` of the two `INSERT` statements before checking whether `non_exist_tab` existed).
* C. `1` row.
* D. The session hangs due to the DDL failure.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** This is one of the most famous traps on the OCA/OCP 1Z0-071 exam! Whenever a DDL statement (`DROP TABLE non_exist_tab;`) is **syntactically valid (passes the parse phase)**, Oracle executes an **implicit `COMMIT`** to finalize the current transaction **BEFORE** attempting to execute the DDL operation! Even though `DROP TABLE` subsequently fails with `ORA-00942`, rows `(1, 'Viettel')` and `(2, 'VNPT')` have already been permanently committed, so the final `ROLLBACK;` has nothing left to undo!
  * **A, C, D are incorrect:** Only a DDL statement that fails at the syntax parse stage (e.g., `DRP TABL non_exist_tab;`) skips the implicit commit.
</details>

---

### Question 25
**Again starting with an empty `ACCOUNTS` table (`0` rows), you execute the script below (notice that line 3 misspells `CREATE TABLE` as `CREAT TABL`). After `ROLLBACK;` on line 4 completes, how many rows are in `ACCOUNTS`?**

```sql
INSERT INTO accounts VALUES (1, 'FPT');
INSERT INTO accounts VALUES (2, 'CMC');
CREAT TABL test_syntax (id NUMBER); -- Syntax error ORA-00900: invalid SQL statement!
ROLLBACK;
```

* A. `0` rows
* B. `2` rows
* C. `1` row
* D. The `ROLLBACK` statement raises an error

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** Compare this directly with Question 24: On line 3, `CREAT TABL test_syntax (id NUMBER);` fails immediately during the **parse stage** with `ORA-00900: invalid SQL statement`. Because the SQL parser cannot even recognize it as a valid DDL command, **no implicit `COMMIT` is issued**! The transaction containing the 2 `INSERT` statements remains open, and `ROLLBACK;` on line 4 rolls back both `'FPT'` and `'CMC'`, leaving `0` rows in `ACCOUNTS`.
  * **B, C, D are incorrect:** Remember the rule: *Syntactically valid DDL that fails during execution* → **Auto-commits prior DML**; *Syntax error that fails during parsing* → **Does NOT auto-commit**.
</details>

---
