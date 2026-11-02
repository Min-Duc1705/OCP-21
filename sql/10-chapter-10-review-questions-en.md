# Review Questions - Chapter 10: DML and Transaction Control

> **Reference:** *OCA/OCP Oracle Database SQL Exam Guide (Exam 1Z0-071)* & VNPT IT Proficiency Assessment.  
> **Total Questions:** 25 standard Oracle certification multiple-choice questions with detailed explanations.  
> **How to study:** Read each question carefully and select your answer first, then click **"👉 View Answer & Detailed Explanation"** to check the correct answer and master key exam traps.

---

### Question 1
**The `DEPARTMENTS` table has the following structure: `DEPT_ID NUMBER(4) PRIMARY KEY`, `DEPT_NAME VARCHAR2(30) NOT NULL`, `MANAGER_ID NUMBER(6)`, `LOCATION_ID NUMBER(4) DEFAULT 1700`. Which of the following `INSERT` statements executes successfully?**

```sql
-- Structure of DEPARTMENTS:
-- DEPT_ID     NUMBER(4)     PRIMARY KEY
-- DEPT_NAME   VARCHAR2(30)  NOT NULL
-- MANAGER_ID  NUMBER(6)
-- LOCATION_ID NUMBER(4)     DEFAULT 1700
```

* A. `INSERT INTO departments VALUES (10, 'IT', DEFAULT);`
* B. `INSERT INTO departments (dept_id, dept_name, location_id) VALUES (10, 'IT', DEFAULT);`
* C. `INSERT INTO departments (dept_id, manager_id) VALUES (10, 100);`
* D. `INSERT INTO departments VALUES (10, 'IT', 100, 1800, NULL);`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The statement explicitly lists 3 columns `(dept_id, dept_name, location_id)` and provides 3 matching values. The omitted `manager_id` column implicitly receives `NULL`, and the `DEFAULT` keyword assigns `1700` to `location_id`.
  * **A is incorrect:** Omitting the column list requires supplying values for all 4 columns in the table. Supplying only 3 values raises `ORA-00947: not enough values`.
  * **C is incorrect:** The `dept_name` column is defined as `NOT NULL` without a `DEFAULT` value. Omitting it causes Oracle to attempt inserting `NULL`, raising `ORA-01400: cannot insert NULL into ("DEPARTMENTS"."DEPT_NAME")`.
  * **D is incorrect:** Providing 5 values for a 4-column table raises `ORA-00913: too many values`.
</details>

---

### Question 2
**You want to copy employee records in department `20` from the `EMPLOYEES` table into the `EMP_ARCHIVE` table (both tables have the columns `EMP_ID`, `FULL_NAME`, `SALARY`). Which statement has valid syntax in Oracle SQL?**

```sql
-- Target table: EMP_ARCHIVE (emp_id, full_name, salary)
-- Source table: EMPLOYEES (emp_id, full_name, salary, dept_id)
```

* A. `INSERT INTO emp_archive VALUES (SELECT emp_id, full_name, salary FROM employees WHERE dept_id = 20);`
* B. `INSERT INTO emp_archive (emp_id, full_name, salary) SELECT emp_id, full_name, salary FROM employees WHERE dept_id = 20;`
* C. `INSERT emp_archive SELECT emp_id, full_name, salary FROM employees WHERE dept_id = 20;`
* D. `INSERT INTO emp_archive AS SELECT emp_id, full_name, salary FROM employees WHERE dept_id = 20;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In an `INSERT INTO ... SELECT` subquery insert, the `SELECT` clause directly follows the table name (or optional column list) without the `VALUES` or `AS` keyword.
  * **A is incorrect:** Using the `VALUES` keyword before a multi-column/multi-row subquery causes `ORA-00936: missing expression`.
  * **C is incorrect:** Unlike `DELETE` (where `FROM` is optional), the `INTO` keyword is mandatory in `INSERT` statements.
  * **D is incorrect:** The `AS` keyword is used in DDL `CREATE TABLE ... AS SELECT` (CTAS), not in `INSERT INTO ... SELECT`.
</details>

---

### Question 3
**The `EMP_SAL` table contains exactly 3 rows with `SALARY` values of `1500`, `2500`, and `4000`. The target tables `T_LOW`, `T_MID`, and `T_HIGH` are currently empty. After executing the conditional `INSERT ALL` statement below, how many total rows are inserted across all three target tables?**

```sql
INSERT ALL
    WHEN salary <= 2500 THEN
        INTO t_low VALUES (emp_id, salary)
    WHEN salary BETWEEN 2000 AND 3500 THEN
        INTO t_mid VALUES (emp_id, salary)
    ELSE
        INTO t_high VALUES (emp_id, salary)
SELECT emp_id, salary FROM emp_sal;
```

* A. 3 rows
* B. 4 rows
* C. 5 rows
* D. The statement fails because a single source row cannot satisfy two `WHEN` conditions simultaneously

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** With a conditional `INSERT ALL`, Oracle evaluates **every** `WHEN` clause independently for each source row:
    * Row 1 (`salary = 1500`): Matches `salary <= 2500` (1 row into `t_low`).
    * Row 2 (`salary = 2500`): Matches `salary <= 2500` (1 row into `t_low`) **AND** also matches `salary BETWEEN 2000 AND 3500` (1 row into `t_mid`).
    * Row 3 (`salary = 4000`): Matches neither `WHEN` condition and falls into the `ELSE` branch (1 row into `t_high`).
    * Total rows inserted: `1 + 2 + 1 = 4` rows.
  * **A, C, D are incorrect:** Only `INSERT FIRST` stops at the first matching `WHEN` branch (which would insert 3 rows).
</details>

---

### Question 4
**If you replace `INSERT ALL` in Question 3 with `INSERT FIRST` and execute the statement against the same 3 rows (`1500`, `2500`, `4000`), how many rows will be inserted into the `T_MID` table?**

```sql
INSERT FIRST
    WHEN salary <= 2500 THEN
        INTO t_low VALUES (emp_id, salary)
    WHEN salary BETWEEN 2000 AND 3500 THEN
        INTO t_mid VALUES (emp_id, salary)
    ELSE
        INTO t_high VALUES (emp_id, salary)
SELECT emp_id, salary FROM emp_sal;
```

* A. 0 rows
* B. 1 row
* C. 2 rows
* D. 3 rows

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** With `INSERT FIRST`, Oracle evaluates `WHEN` conditions from top to bottom and stops at the **first** condition that evaluates to `TRUE` for a given row:
    * Row `1500`: Matches branch 1 (`salary <= 2500`) → inserted into `t_low`, skips remaining branches.
    * Row `2500`: Matches branch 1 (`salary <= 2500`) → inserted into `t_low` and **immediately skips** branch 2 (`BETWEEN 2000 AND 3500`).
    * Row `4000`: Matches neither `WHEN` branch → inserted into `t_high` via `ELSE`.
    * Consequently, `0` rows are inserted into `t_mid`.
  * **B, C, D are incorrect:** They confuse `INSERT FIRST` with `INSERT ALL`.
</details>

---

### Question 5
**Examine the multi-table `INSERT` statement below. Why would this statement fail when executed?**

```sql
INSERT ALL
    WHEN salary > 3000 THEN
        INTO high_earners VALUES (emp_id, full_name, salary)
    ELSE
        INTO regular_earners VALUES (emp_id, full_name, salary)
SELECT employee_id AS emp_id, last_name AS full_name, sal AS salary
FROM employees;
```

* A. An `ELSE` clause is not permitted in a conditional `INSERT ALL` statement.
* B. Column aliases cannot be used in the `SELECT` subquery of a multi-table `INSERT`.
* C. The statement does NOT fail; it executes successfully because both the `WHEN` and `VALUES` clauses properly reference the column aliases defined in the `SELECT` list.
* D. The `THEN` keyword is missing immediately after `ELSE`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In a multi-table `INSERT`, when column aliases are defined in the source `SELECT` query (`employee_id AS emp_id`, `last_name AS full_name`, `sal AS salary`), the upper `WHEN` and `INTO ... VALUES` clauses **must** reference those aliases (`emp_id`, `full_name`, `salary`) rather than the original base column names. In addition, the syntax `ELSE INTO ...` (without `THEN`) is completely valid.
  * **A, B, D are incorrect:** Referencing the original column names (`sal`, `employee_id`) when aliases are present would raise `ORA-00904: invalid identifier`, and writing `ELSE THEN` is a syntax error.
</details>

---

### Question 6
**You create a sequence named `EMP_SEQ` with `START WITH 1 INCREMENT BY 1`. The `DEPARTMENTS` table currently contains `3` rows. You execute the unconditional `INSERT ALL` statement below into two empty tables `TAB1(id)` and `TAB2(id)`. Which values will be stored in `TAB1` and `TAB2`?**

```sql
INSERT ALL
    INTO tab1 VALUES (emp_seq.NEXTVAL)
    INTO tab2 VALUES (emp_seq.NEXTVAL)
SELECT dept_id FROM departments;
```

* A. `TAB1` contains `(1, 3, 5)` and `TAB2` contains `(2, 4, 6)`
* B. `TAB1` contains `(1, 2, 3)` and `TAB2` contains `(4, 5, 6)`
* C. Both `TAB1` and `TAB2` contain the exact same values `(1, 2, 3)`
* D. The statement fails with `ORA-02287: sequence number not allowed here`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In a multi-table `INSERT` statement, `emp_seq.NEXTVAL` is incremented **once per row returned by the source `SELECT` subquery**, NOT once per `INTO` branch! Because `SELECT dept_id FROM departments` returns 3 rows, `NEXTVAL` generates `1` for the first row (inserting `1` into both `TAB1` and `TAB2`), `2` for the second row, and `3` for the third row.
  * **A, B, D are incorrect:** This is a classic OCP exam trap testing how `NEXTVAL` behaves across multiple `INTO` clauses for a single subquery row.
</details>

---

### Question 7
**The `EMPLOYEES` table has a column `SALARY NUMBER(8,2) NOT NULL` and currently contains 100 employees (`emp_id = 1` to `100`). The `BONUSES` table contains rows for only 5 top-performing employees. What happens when you execute the correlated `UPDATE` statement below?**

```sql
UPDATE employees e
SET e.salary = (
    SELECT b.new_salary
    FROM bonuses b
    WHERE b.emp_id = e.emp_id
);
```

* A. Only the 5 employees present in `BONUSES` have their salaries updated; the other 95 employees keep their current salaries.
* B. The 5 employees get their new salaries, and the remaining 95 employees have their salaries set to `0`.
* C. The statement fails and rolls back all 100 updates because the subquery returns `NULL` for the 95 unmatched employees, violating the `NOT NULL` constraint on `SALARY`.
* D. The statement fails with a syntax error because correlated subqueries are not allowed in the `SET` clause.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Because the outer `UPDATE` statement lacks a `WHERE` clause, Oracle attempts to update all 100 rows in `EMPLOYEES`. For the 95 employees not found in `BONUSES`, the correlated subquery returns `NULL`. Attempting to assign `NULL` to `SALARY` (`NOT NULL`) raises `ORA-01407: cannot update ("EMPLOYEES"."SALARY") to NULL`, causing a statement-level rollback of the entire `UPDATE`.
  * **A is incorrect:** To update only matching rows, you must add `WHERE EXISTS (SELECT 1 FROM bonuses b WHERE b.emp_id = e.emp_id)` to the outer `UPDATE`.
  * **B, D are incorrect:** Unmatched subqueries return `NULL` (not `0`), and correlated subqueries are valid in the `SET` clause.
</details>

---

### Question 8
**Which of the following statements successfully delete rows where `dept_id = 90` from the `EMPLOYEES` table (assuming no child records reference these rows)?**

```sql
-- Statement 1: DELETE FROM employees WHERE dept_id = 90;
-- Statement 2: DELETE employees WHERE dept_id = 90;
-- Statement 3: DELETE * FROM employees WHERE dept_id = 90;
```

* A. Statement 1 only
* B. Statements 1 and 2 only
* C. Statements 1 and 3 only
* D. Statements 1, 2, and 3

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In Oracle SQL, the `FROM` keyword in a `DELETE` statement is **optional**. Both `DELETE FROM employees ...` (Statement 1) and `DELETE employees ...` (Statement 2) are valid and identical in behavior.
  * **A, C, D are incorrect:** Statement 3 (`DELETE * FROM ...`) fails with `ORA-00903: invalid table name` because `DELETE` always removes entire rows and never accepts `*` or column names after `DELETE`.
</details>

---

### Question 9
**The `DEPARTMENTS` table has a primary key `DEPT_ID` and contains departments `10`, `20`, and `30`. The `EMPLOYEES` table has a foreign key `DEPT_ID` referencing `DEPARTMENTS(DEPT_ID)` (created with default behavior, without `ON DELETE CASCADE` or `ON DELETE SET NULL`). Currently, `EMPLOYEES` contains employees only in departments `10` and `20` (no employee is in department `30`). What is the result of executing the following statement?**

```sql
DELETE FROM departments WHERE dept_id = 30;
```

* A. It fails with `ORA-02292: integrity constraint violated - child record found` because `EMPLOYEES` has an enabled foreign key referencing `DEPARTMENTS`.
* B. It successfully deletes department `30` from `DEPARTMENTS`.
* C. It deletes department `30` and automatically deletes all rows in `EMPLOYEES`.
* D. It fails because you cannot run `DELETE` on a parent table without first disabling the foreign key constraint.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** A foreign key constraint prevents deleting a parent row only if **at least one actual child row** currently references that specific parent key value. Since no employee in `EMPLOYEES` references `dept_id = 30`, `DELETE FROM departments WHERE dept_id = 30;` succeeds without error.
  * **A, C, D are incorrect:** `ORA-02292` would occur only when deleting department `10` or `20`. Unlike `TRUNCATE` or `DROP`, `DELETE` checks row-level data rather than blocking unconditionally on enabled foreign keys.
</details>

---

### Question 10
**Examine the `MERGE` statement below. Why does this statement fail when executed?**

```sql
MERGE INTO products p
USING new_products np
ON (p.prod_id = np.prod_id)
WHEN MATCHED THEN
    UPDATE SET
        p.prod_id = np.prod_id,
        p.price = np.price
WHEN NOT MATCHED THEN
    INSERT (p.prod_id, p.prod_name, p.price)
    VALUES (np.prod_id, np.prod_name, np.price);
```

* A. Table alias prefixes (`p.`) are not allowed in the `INSERT` column list of `WHEN NOT MATCHED`.
* B. You cannot update `p.prod_id` in the `UPDATE SET` clause because `prod_id` is referenced in the `ON (p.prod_id = np.prod_id)` join condition.
* C. The `INTO products` clause is missing after the `INSERT` keyword.
* D. The table name `products` is missing after the `UPDATE` keyword.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Oracle strictly prohibits updating any column that is referenced in the `ON (...)` condition of a `MERGE` statement, even if you assign it the same value (`p.prod_id = np.prod_id`). Doing so raises `ORA-38104: Columns referenced in the ON Clause cannot be updated: "P"."PROD_ID"`.
  * **A is incorrect:** Qualifying target columns with the target table alias (`p.prod_id`) is completely valid in both `UPDATE SET` and `INSERT`.
  * **C, D are incorrect:** Inside a `MERGE` statement, you write `UPDATE SET ...` (without a table name) and `INSERT (...) VALUES (...)` (without `INTO table_name`).
</details>

---

### Question 11
**The target table `CUST_TARGET` contains 3 rows: `(id=1, status='ACTIVE')`, `(id=2, status='INACTIVE')`, `(id=3, status='INACTIVE')`. The source table `CUST_SOURCE` contains 2 rows: `(id=1, status='INACTIVE')` and `(id=2, status='ACTIVE')`. After executing the `MERGE` statement below, which `id` rows remain in `CUST_TARGET`?**

```sql
MERGE INTO cust_target t
USING cust_source s
ON (t.id = s.id)
WHEN MATCHED THEN
    UPDATE SET t.status = s.status
    DELETE WHERE (t.status = 'INACTIVE');
```

* A. `id = 2` only
* B. `id = 2` and `id = 3`
* C. `id = 1` and `id = 2` only
* D. The statement fails because the `WHEN NOT MATCHED THEN INSERT` clause is missing

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Let's trace each row in `CUST_TARGET`:
    * **`id = 1`**: Matches `ON` → updated from `'ACTIVE'` to `'INACTIVE'`. Next, `DELETE WHERE (t.status = 'INACTIVE')` evaluates the **post-update value** (`'INACTIVE'`), which matches, so **`id = 1` is deleted**.
    * **`id = 2`**: Matches `ON` → updated from `'INACTIVE'` to `'ACTIVE'`. Its post-update value is `'ACTIVE'`, so it is **not deleted**.
    * **`id = 3`**: Does not exist in `CUST_SOURCE`, so it **does not match `ON`** and is not updated by `WHEN MATCHED`. Because `DELETE WHERE` in a `MERGE` statement **only evaluates rows that were updated by the `MERGE` operation**, `id = 3` is never evaluated by `DELETE WHERE` and **remains intact** in `CUST_TARGET` despite having `status = 'INACTIVE'`!
  * **A, C, D are incorrect:** `WHEN NOT MATCHED` is optional in `MERGE`, and `DELETE WHERE` never touches target rows that were not updated during the `MERGE`.
</details>

---

### Question 12
**When executing `MERGE INTO target t USING source s ON (t.id = s.id) ...`, under which condition will Oracle raise `ORA-30926: unable to get a stable set of rows in the source tables`?**

* A. When the `source` table is completely empty (`0` rows).
* B. When a single row in `source` matches multiple rows in `target`.
* C. When a single row in `target` matches more than one row in `source`.
* D. When another session is concurrently executing a `SELECT` query against `source`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `MERGE` is a deterministic statement: each row in the `target` table can be updated at most once during a single `MERGE` execution. If one row in `target` (e.g., `t.id = 10`) matches two or more rows in `source` with `s.id = 10`, Oracle cannot determine which source row's values should win, raising `ORA-30926: unable to get a stable set of rows in the source tables`.
  * **A is incorrect:** If `source` is empty, `MERGE` succeeds with `0 rows merged`.
  * **B is incorrect:** One source row matching multiple target rows is completely valid and updates all matching target rows.
  * **D is incorrect:** Readers never block writers or other readers in Oracle.
</details>

---

### Question 13
**In an Oracle Database session, when does a new transaction officially begin?**

* A. When the user executes `BEGIN TRANSACTION;` in SQL*Plus.
* B. Immediately when the user connects and authenticates to the database.
* C. When the first `SELECT` statement is executed after connecting.
* D. When the first DML statement (`INSERT`, `UPDATE`, `DELETE`, `MERGE`, or `SELECT ... FOR UPDATE`) is executed after connecting or after the previous transaction has ended.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** Oracle starts transactions implicitly when the first executable DML statement (or row-locking statement such as `SELECT ... FOR UPDATE` / `LOCK TABLE`) is issued following a connection or the completion (`COMMIT`/`ROLLBACK`) of a prior transaction.
  * **A is incorrect:** There is no `BEGIN TRANSACTION` statement in standard Oracle SQL.
  * **B, C are incorrect:** Merely connecting or executing regular `SELECT` queries does not allocate a transaction entry in `V$TRANSACTION`.
</details>

---

### Question 14
**The `ITEMS (id NUMBER PRIMARY KEY, name VARCHAR2(20) NOT NULL)` table is currently empty. You execute the following statements sequentially in a single session. How many rows are in `ITEMS` after the script finishes?**

```sql
INSERT INTO items VALUES (1, 'Pen');
INSERT INTO items VALUES (2, 'Book');
INSERT INTO items VALUES (2, 'Ruler'); -- Violates PRIMARY KEY!
INSERT INTO items VALUES (3, NULL);    -- Violates NOT NULL!
COMMIT;
```

* A. 0 rows (because runtime errors automatically roll back the entire transaction)
* B. 1 row
* C. 2 rows
* D. 3 rows

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** When a DML statement encounters a constraint violation or runtime error (such as the `PRIMARY KEY` error on line 3 or `NOT NULL` error on line 4), Oracle performs an automatic **statement-level rollback** of only the failed statement. The current transaction remains active and preserves all previously succeeded DML statements (`(1, 'Pen')` and `(2, 'Book')`). When `COMMIT;` executes on line 5, those 2 valid rows are permanently saved.
  * **A, B, D are incorrect:** Runtime DML errors do not roll back the entire transaction.
</details>

---

### Question 15
**The `TEST_SP (val NUMBER)` table is currently empty. Trace the transaction script below and determine which values will exist in `TEST_SP` after the final `COMMIT` completes.**

```sql
INSERT INTO test_sp VALUES (10);
SAVEPOINT sp_1;
INSERT INTO test_sp VALUES (20);
SAVEPOINT sp_2;
INSERT INTO test_sp VALUES (30);
ROLLBACK TO SAVEPOINT sp_1;
INSERT INTO test_sp VALUES (40);
ROLLBACK TO SAVEPOINT sp_2;
COMMIT;
```

* A. `10` and `40`
* B. `10`, `20`, and `40`
* C. `10` only
* D. `10`, `20`, `30`, and `40`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** Let's trace each step carefully:
    1. Insert `10` → establish `sp_1`.
    2. Insert `20` → establish `sp_2`.
    3. Insert `30`.
    4. `ROLLBACK TO SAVEPOINT sp_1;`: Undoes the insertion of `20` and `30`, and **erases savepoint `sp_2`** (because `sp_2` was created after `sp_1`). Only `10` remains pending.
    5. Insert `40`: Now `10` and `40` are pending in the transaction.
    6. `ROLLBACK TO SAVEPOINT sp_2;`: Because `sp_2` was erased in step 4, this statement **fails with `ORA-01086: savepoint 'SP_2' never established in this session or is invalid`**! Because the rollback statement fails, nothing is undone and `40` remains intact!
    7. `COMMIT;`: Permanently saves `10` and `40`.
  * **B, C, D are incorrect:** Rolling back to an earlier savepoint invalidates all savepoints created after it, causing the subsequent `ROLLBACK TO sp_2` to fail without rolling back `40`.
</details>

---

### Question 16
**What happens if you execute the following statements within a single transaction?**

```sql
INSERT INTO logs VALUES (1, 'Start');
SAVEPOINT my_sp;
INSERT INTO logs VALUES (2, 'Processing');
SAVEPOINT my_sp;
INSERT INTO logs VALUES (3, 'End');
ROLLBACK TO SAVEPOINT my_sp;
```

* A. The second `SAVEPOINT my_sp;` statement fails with an error because savepoint names must be unique within a transaction.
* B. Only row `(3, 'End')` is rolled back; rows `1` and `2` remain in the transaction.
* C. Both rows `(2, 'Processing')` and `(3, 'End')` are rolled back; only row `1` remains.
* D. All 3 rows are rolled back.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Creating a savepoint with a name that already exists in the current transaction does not raise an error; instead, it **overwrites and moves `my_sp` to the new point** in the transaction (after row `2`). Consequently, `ROLLBACK TO SAVEPOINT my_sp;` only rolls back DML statements executed after the second `SAVEPOINT my_sp;` (i.e., row `3`), leaving rows `1` and `2` intact.
  * **A, C, D are incorrect:** Reusing a savepoint name simply relocates that savepoint to the latest position.
</details>

---

### Question 17
**After `ROLLBACK TO SAVEPOINT sp_a;` executes successfully, which of the following statements is TRUE?**

* A. All row locks held by the entire transaction are released.
* B. Savepoint `sp_a` itself remains active, and you can issue `ROLLBACK TO SAVEPOINT sp_a;` again later in the same transaction.
* C. Savepoint `sp_a` is deleted immediately upon rolling back to it, while savepoints created after `sp_a` are preserved.
* D. The current transaction is completely terminated.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Rolling back to `sp_a` undoes changes and removes savepoints created *after* `sp_a`, but savepoint `sp_a` itself (along with any earlier savepoints) remains defined and can be rolled back to again as long as the transaction remains open.
  * **A is incorrect:** Only locks acquired after `sp_a` are released; locks acquired before `sp_a` are still held.
  * **C, D are incorrect:** The transaction stays open, and savepoints after `sp_a` are removed while `sp_a` is retained.
</details>

---

### Question 18
**Which of the following events causes Oracle Database to automatically perform an implicit `ROLLBACK` of the current transaction (rather than an implicit `COMMIT`)?**

* A. The user types `EXIT` or `QUIT` to close SQL*Plus normally.
* B. The user executes an `ALTER TABLE` statement that fails with a syntax error.
* C. The session terminates abnormally due to a network drop or a DBA executing `ALTER SYSTEM KILL SESSION`.
* D. The user executes `GRANT SELECT ON employees TO scott;`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** When a session disconnects abnormally (network failure, client crash, or `KILL SESSION`), Oracle's background process (`PMON`) cleans up the session and automatically **rolls back** all uncommitted changes.
  * **A is incorrect:** Exiting SQL*Plus normally via `EXIT` or `QUIT` triggers an automatic **`COMMIT`**.
  * **B is incorrect:** A syntax error during parsing does not roll back or commit existing uncommitted DML.
  * **D is incorrect:** `GRANT` is a DCL statement, which triggers an automatic **`COMMIT`**.
</details>

---

### Question 19
**At 10:00, employee `emp_id = 101` has `salary = 5000`. At 10:01, Session 1 executes `UPDATE employees SET salary = 8000 WHERE emp_id = 101;` without committing. At 10:02, Session 2 executes `SELECT salary FROM employees WHERE emp_id = 101;`. What result does Session 2 receive?**

* A. Session 2 waits (is blocked) until Session 1 issues `COMMIT` or `ROLLBACK`.
* B. Session 2 immediately receives `salary = 8000`.
* C. Session 2 immediately receives `salary = 5000` without waiting, by reading the before-image from Undo segments.
* D. Session 2 receives `ORA-00054: resource busy`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Under Oracle's **Read Consistency** architecture, *writers do not block readers* and *dirty reads are impossible*. Session 2 does not wait; instead, Oracle uses the before-image stored in **Undo segments** to construct a Consistent Read (CR) block in memory and immediately returns the last committed value (`5000`).
  * **A, B, D are incorrect:** Only Session 1 sees its own uncommitted value `8000`. Session 2 would only wait or get `ORA-00054` if it attempted a write (`UPDATE`/`DELETE`) or `SELECT ... FOR UPDATE`.
</details>

---

### Question 20
**What is the primary cause of the classic `ORA-01555: snapshot too old` error during a long-running `SELECT` query in Oracle?**

* A. The `SELECT` statement holds read locks for too long, exhausting the Shared Pool.
* B. While the `SELECT` query is running, other sessions modify data and `COMMIT`, causing the Undo blocks needed to reconstruct a read-consistent image as of the query's start time to be overwritten.
* C. Another session deletes all rows from the table being queried.
* D. The `SELECT` query runs out of space in the Temporary Tablespace while sorting (`ORDER BY`).

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Statement-level read consistency requires a query starting at SCN $T_0$ to see all data as it existed at $T_0$. If the query runs for a long time while other transactions update rows and `COMMIT`, their Undo extents become expired and eligible for reuse. When the long-running query later tries to read an Undo block that has been overwritten, Oracle raises `ORA-01555: snapshot too old`.
  * **A, C, D are incorrect:** Regular `SELECT` statements do not acquire read locks, and running out of temporary sort space raises `ORA-01652`.
</details>

---

### Question 21
**Session 1 executes `UPDATE employees SET salary = 3000 WHERE dept_id = 10;` (which updates 3 employees with `emp_id` `101`, `102`, and `103`) and has not committed. Immediately afterward, which of the following statements executed in Session 2 will be blocked (forced to wait)?**

* A. `SELECT * FROM employees WHERE dept_id = 10;`
* B. `UPDATE employees SET salary = 4000 WHERE emp_id = 104;` (where employee `104` belongs to `dept_id = 20`)
* C. `INSERT INTO employees (emp_id, full_name, salary, dept_id) VALUES (205, 'New Emp', 2500, 10);`
* D. `DELETE FROM employees WHERE emp_id = 102;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** Oracle locks data at the **row level** (`TX` lock). Session 1 holds exclusive row locks only on rows `101`, `102`, and `103`. When Session 2 attempts to `DELETE` row `102`, it must wait until Session 1 commits or rolls back.
  * **A is incorrect:** Regular `SELECT` queries are never blocked by row locks.
  * **B is incorrect:** Row `104` is not locked by Session 1, so Session 2 updates it immediately.
  * **C is incorrect:** Because Session 1 only locks the 3 existing rows (not the entire table or department `10`), Session 2 can freely insert a new employee into department `10`.
</details>

---

### Question 22
**You want to query and lock employee rows in department `20` prior to updating them. If any of those rows are currently locked by another session, your statement must wait up to 3 seconds; if the lock is still not released after 3 seconds, it must abort with an error. Which statement accomplishes this?**

* A. `SELECT emp_id, salary FROM employees WHERE dept_id = 20 FOR UPDATE WAIT 3;`
* B. `SELECT emp_id, salary FROM employees WHERE dept_id = 20 FOR UPDATE NOWAIT 3;`
* C. `SELECT emp_id, salary FROM employees WHERE dept_id = 20 FOR UPDATE TIMEOUT 3;`
* D. `SELECT emp_id, salary FROM employees WHERE dept_id = 20 LOCK WAIT 3;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** The `FOR UPDATE WAIT n` clause instructs Oracle to wait up to `n` seconds (`3` seconds) for locked rows to be released before aborting with `ORA-30006: resource busy; acquire with WAIT timeout expired`.
  * **B is incorrect:** `NOWAIT` does not accept a numeric argument and fails immediately with `ORA-00054`.
  * **C, D are incorrect:** `TIMEOUT 3` and `LOCK WAIT 3` are invalid syntax in Oracle SQL.
</details>

---

### Question 23
**Examine the join query below with a `FOR UPDATE` clause. When this statement executes successfully, which rows are locked?**

```sql
SELECT e.emp_id, e.full_name, d.dept_name
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id
WHERE d.location_id = 1700
FOR UPDATE OF e.salary;
```

* A. Only the `salary` column of matching rows in `EMPLOYEES` is locked; other columns in those same rows can still be updated by other sessions.
* B. Matching rows in both the `EMPLOYEES` and `DEPARTMENTS` tables are locked.
* C. Matching rows in the `EMPLOYEES` table are locked, while the corresponding rows in the `DEPARTMENTS` table are NOT locked.
* D. Only rows in `DEPARTMENTS` with `location_id = 1700` are locked because the `WHERE` condition references `DEPARTMENTS`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** When `FOR UPDATE OF column_name` is used in a multi-table join query, Oracle locks only the selected rows in the **table that contains the specified column**. Because `e.salary` belongs to `EMPLOYEES`, only the matching rows in `EMPLOYEES` are locked, while rows in `DEPARTMENTS` remain unlocked!
  * **A is incorrect:** Oracle's smallest locking unit is a **row**, never an individual column.
  * **B is incorrect:** Both tables are locked only if you write `FOR UPDATE` without the `OF column_name` clause.
  * **D is incorrect:** The `OF` clause—not the `WHERE` clause—determines which table's rows are locked.
</details>

---

### Question 24
**Two sessions (Session A and Session B) encounter a deadlock: Session A holds a lock on row 1 and waits for row 2, while Session B holds a lock on row 2 and waits for row 1. How does Oracle Database resolve this situation?**

* A. Both sessions wait indefinitely until a DBA manually kills one of the sessions.
* B. Oracle automatically detects the deadlock, raises `ORA-00060` in one of the sessions, and rolls back **only the single DML statement that detected the deadlock** (keeping that session's transaction and earlier locks intact).
* C. Oracle automatically detects the deadlock and rolls back the entire transaction in both sessions.
* D. Oracle automatically disconnects the session that caused the deadlock and releases all of its locks.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Oracle automatically detects deadlocks within seconds and chooses one session to receive `ORA-00060: deadlock detected while waiting for resource`. Crucially, Oracle performs a **statement-level rollback** of only the currently waiting DML statement that triggered the deadlock! The session remains connected, its transaction stays open, and the lock on its previously modified row is still held until the session explicitly commits or rolls back.
  * **A, C, D are incorrect:** This is a favorite OCA/OCP exam trap testing whether candidates know that deadlock resolution performs a statement-level rollback rather than a transaction-level rollback.
</details>

---

### Question 25
**The `ORDERS` table has 5 rows with `status = 'PENDING'` (2 of these rows are currently locked by Session 1, and 3 rows are unlocked). In Session 2, you want to query and immediately lock only the `status = 'PENDING'` rows that are currently unlocked, without waiting for Session 1 and without raising an error. Which statement achieves this?**

```sql
-- ORDERS has 5 rows with status = 'PENDING':
-- 2 rows are locked by Session 1
-- 3 rows are unlocked
```

* A. `SELECT * FROM orders WHERE status = 'PENDING' FOR UPDATE NOWAIT;`
* B. `SELECT * FROM orders WHERE status = 'PENDING' FOR UPDATE SKIP LOCKED;`
* C. `SELECT * FROM orders WHERE status = 'PENDING' FOR UPDATE WAIT 0;`
* D. `SELECT * FROM orders WHERE status = 'PENDING' FOR UPDATE IGNORE LOCKS;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The `FOR UPDATE SKIP LOCKED` clause instructs Oracle to bypass any rows currently locked by another session without waiting and without throwing an error, immediately locking and returning the 3 available `'PENDING'` rows.
  * **A, C are incorrect:** Both `FOR UPDATE NOWAIT` and `FOR UPDATE WAIT 0` abort the entire query and raise an error (`ORA-00054` or `ORA-30006`) as soon as they encounter one of the 2 locked rows.
  * **D is incorrect:** `IGNORE LOCKS` is not valid Oracle SQL syntax.
</details>

---
