# Review Questions - Chapter 13: Database Objects, Data Dictionary, and Privileges

> **Reference:** *OCA/OCP Oracle Database SQL Exam Guide (Exam 1Z0-071)* & VNPT IT Proficiency Assessment.  
> **Total Questions:** 25 standard Oracle certification multiple-choice questions with detailed explanations.  
> **How to study:** Read each question carefully and select your answer first, then click **"👉 View Answer & Detailed Explanation"** to check the correct answer and master key exam traps.

---

### Question 1
**You want to create a view named `V_FUTURE_SALES` based on the `SALES_2027` table, but the `SALES_2027` table has not yet been created in the database. Which statement allows you to create and store this view definition in the Data Dictionary without aborting?**

* A. `CREATE VIEW v_future_sales AS SELECT * FROM sales_2027 WITH DEFERRED;`
* B. `CREATE FORCE VIEW v_future_sales AS SELECT * FROM sales_2027;`
* C. `CREATE NOFORCE VIEW v_future_sales AS SELECT * FROM sales_2027;`
* D. A view cannot be created under any circumstances if its base table does not yet exist.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The **`FORCE`** keyword in `CREATE [OR REPLACE] FORCE VIEW ...` creates the view in the Data Dictionary even if the underlying base tables do not exist yet or the creator lacks privileges on them. Oracle outputs `Warning: View created with compilation errors` and marks the view `INVALID` in `USER_OBJECTS`. Once `SALES_2027` is created, Oracle automatically recompiles the view to `VALID` when it is first queried.
  * **A is incorrect:** `WITH DEFERRED` is not valid syntax in `CREATE VIEW`.
  * **C, D are incorrect:** `NOFORCE` is the default mode and fails with `ORA-00942` if `SALES_2027` does not exist.
</details>

---

### Question 2
**The `EMPLOYEES` table has 4 columns: `EMP_ID` (Primary Key), `FULL_NAME` (`NOT NULL`), `SALARY`, and `DEPT_ID`. You create a view named `V_EMP_SAL` using the statement below (with no `INSTEAD OF` triggers defined). Which DML operations can be executed SUCCESSFULLY through `V_EMP_SAL`?**

```sql
CREATE OR REPLACE VIEW v_emp_sal AS
SELECT emp_id, full_name, salary, salary * 12 AS annual_salary
FROM employees
WHERE dept_id = 10;
```

* A. Only `DELETE` is allowed; neither `UPDATE` nor `INSERT` can be performed on any column.
* B. `DELETE` is allowed, `UPDATE` is allowed on `emp_id`, `full_name`, and `salary` (but NOT on `annual_salary`), and `INSERT` is NOT allowed on this view at all.
* C. `DELETE`, `UPDATE` (on `salary`), and `INSERT` (if specifying only `emp_id, full_name, salary`) are all allowed.
* D. Neither `DELETE`, `UPDATE`, nor `INSERT` is allowed because the view contains an arithmetic expression.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Memorize the three-tier rule for DML on views on the 1Z0-071 exam:
    1. **`DELETE`:** **Allowed**, because the view does not contain `GROUP BY`, group functions (`SUM`, `AVG`, etc.), `DISTINCT`, or `ROWNUM`.
    2. **`UPDATE`:** **Allowed** on regular base columns (`emp_id`, `full_name`, `salary`), and prohibited only on the virtual expression column `annual_salary`.
    3. **`INSERT`:** **Completely prohibited (`ORA-01733: virtual column not allowed here`)**! In Oracle, if a view definition contains **any** expression column (`salary * 12`), no `INSERT` statement can be executed through that view, even if the `INSERT` column list omits `annual_salary`!
  * **A, C, D are incorrect:** Option C is a classic trap that catches candidates who assume omitting the expression column in `INSERT` makes the insert legal.
</details>

---

### Question 3
**The `EMPLOYEES` table has a column `HIRE_DATE DATE NOT NULL` (with no `DEFAULT` value). You create a simple view: `CREATE VIEW v_emp_basic AS SELECT emp_id, full_name, salary FROM employees;`. What happens when you execute `INSERT INTO v_emp_basic VALUES (501, 'Tran Van K', 3000);`?**

* A. The row is inserted successfully and `HIRE_DATE` in `EMPLOYEES` automatically receives `SYSDATE`.
* B. The row is inserted successfully and `HIRE_DATE` receives `NULL`.
* C. The `INSERT` statement fails with `ORA-01400: cannot insert NULL into ("EMPLOYEES"."HIRE_DATE")` because `HIRE_DATE` is `NOT NULL` (without a `DEFAULT` value) and is excluded from the view.
* D. The `CREATE VIEW` statement itself fails initially because a view must include all `NOT NULL` columns of its base table.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** When inserting through a view, any base table column not included in the view implicitly receives its `DEFAULT` value, or `NULL` if no default exists. Because `HIRE_DATE` is `NOT NULL` with no `DEFAULT`, inserting through `v_emp_basic` attempts to insert `NULL` into `HIRE_DATE` and fails with `ORA-01400`! (Note that `UPDATE` and `DELETE` through `v_emp_basic` still work normally).
  * **A, B, D are incorrect:** Creating a view does not require including all `NOT NULL` base columns.
</details>

---

### Question 4
**Examine the `V_IT_EMP` view created with `WITH CHECK OPTION` below. Employee `emp_id = 103` currently belongs to `dept_id = 30`. Which of the following statements will be REJECTED with `ORA-01402: view WITH CHECK OPTION where-clause violation`?**

```sql
CREATE OR REPLACE VIEW v_it_emp AS
SELECT emp_id, full_name, salary, dept_id
FROM employees
WHERE dept_id = 30
WITH CHECK OPTION;
```

* A. `UPDATE v_it_emp SET salary = 9000 WHERE emp_id = 103;`
* B. `DELETE FROM v_it_emp WHERE emp_id = 103;`
* C. `UPDATE employees SET dept_id = 10 WHERE emp_id = 103;`
* D. `UPDATE v_it_emp SET dept_id = 10 WHERE emp_id = 103;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** `WITH CHECK OPTION` ensures that any `INSERT` or `UPDATE` performed **through the view `v_it_emp`** produces rows that continue to satisfy the view's `WHERE dept_id = 30` condition. Updating `dept_id = 10` through `v_it_emp` violates `WHERE dept_id = 30` and raises `ORA-01402`.
  * **A is incorrect:** Updating `salary = 9000` leaves `dept_id = 30` unchanged, so it succeeds.
  * **B is incorrect:** `WITH CHECK OPTION` never restricts `DELETE` operations.
  * **C is incorrect:** Statement C updates the **base table `employees` directly** rather than going through `v_it_emp`, so the view's `WITH CHECK OPTION` is not invoked and Statement C succeeds!
</details>

---

### Question 5
**In a Data Warehouse environment with minimal concurrent DML, the `CUSTOMERS` table contains 50 million rows. The `MARITAL_STATUS` column contains only 3 distinct values (`'SINGLE'`, `'MARRIED'`, `'DIVORCED'`) and is frequently combined with `GENDER` (`'M'`, `'F'`) using `AND` / `OR` predicates in `WHERE` clauses. Which type of index is most appropriate for these two columns?**

* A. `Unique B-Tree Index`
* B. `Bitmap Index`
* C. `Function-Based Index`
* D. `Reverse Key Index`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** **`Bitmap Index`** (`CREATE BITMAP INDEX ...`) is specifically designed for **low-cardinality columns** (columns with very few distinct values relative to total rows, such as gender, marital status, or status codes) that are frequently combined with `AND`/`OR`/`NOT` operators in **Data Warehouse** environments with low concurrent DML. Additionally, bitmap indexes index `NULL` values as well.
  * **A, C, D are incorrect:** `B-Tree` indexes are suited for high-cardinality columns and OLTP systems.
</details>

---

### Question 6
**You make an index on the `EMPLOYEES` table invisible by executing `ALTER INDEX idx_emp_dept INVISIBLE;`. Assuming default session parameter settings, which statement is TRUE regarding `idx_emp_dept`?**

* A. Oracle stops updating `idx_emp_dept` during `INSERT`, `UPDATE`, and `DELETE` statements on `EMPLOYEES` to improve DML performance.
* B. The Cost-Based Optimizer ignores `idx_emp_dept` for `SELECT` execution plans, but Oracle **continues to maintain and update** the index during all `INSERT`, `UPDATE`, and `DELETE` operations on `EMPLOYEES`.
* C. `idx_emp_dept` automatically becomes `UNUSABLE` and must be rebuilt before it can be made `VISIBLE` again.
* D. `idx_emp_dept` is hidden from the `USER_INDEXES` data dictionary view.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** An `INVISIBLE` index is ignored by the Cost-Based Optimizer when generating execution plans (unless `OPTIMIZER_USE_INVISIBLE_INDEXES = TRUE`), allowing DBAs to safely test the impact of dropping an index. However, **all DML operations (`INSERT`, `UPDATE`, `DELETE`) continue to maintain an `INVISIBLE` index** in real time! Thus it can be switched back to `VISIBLE` instantaneously without rebuilding.
  * **A, C, D are incorrect:** Only an `UNUSABLE` index stops being maintained by DML and requires a `REBUILD`.
</details>

---

### Question 7
**In Oracle 12c and later, the `DEPT_ID` column of the `EMPLOYEES` table already has a `B-Tree Index` named `IDX_DEPT_BTREE` (which is currently `VISIBLE`). Under which condition can you create a second index on the exact same `DEPT_ID` column without dropping `IDX_DEPT_BTREE`?**

* A. Create another `B-Tree Index` named `IDX_DEPT_BTREE2` with the `INVISIBLE` keyword.
* B. Create a `Bitmap Index` named `IDX_DEPT_BITMAP` with the `VISIBLE` keyword.
* C. Create a `Bitmap Index` named `IDX_DEPT_BITMAP` with the `INVISIBLE` keyword.
* D. Oracle never allows two indexes on the exact same column list under any circumstances.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Starting in Oracle 12c, multiple indexes are permitted on the exact same column list if and only if **both** conditions are met:
    1. The indexes differ in type or properties (here, one is a `B-Tree Index` and the other is a `Bitmap Index`).
    2. At most **one** index on that column list is **`VISIBLE`** at any given time, meaning the new index (`IDX_DEPT_BITMAP`) must be created as **`INVISIBLE`**!
  * **A is incorrect:** Two identical non-unique B-Tree indexes on the same column are rejected (`ORA-01408: such column list already indexed`) even if one is invisible.
  * **B, D are incorrect:** Two indexes on the same column cannot both be `VISIBLE` simultaneously.
</details>

---

### Question 8
**A standard B-Tree index exists on `FULL_NAME` in `EMPLOYEES`: `CREATE INDEX idx_emp_name ON employees(full_name);`. However, an application frequently executes `SELECT * FROM employees WHERE UPPER(full_name) = 'NGUYEN VAN A';` and performs a full table scan. Which solution enables the query to use an index without modifying the application's `SELECT` statement?**

* A. Execute `ALTER INDEX idx_emp_name UPPERCASE;`.
* B. Create a `Function-Based Index` using `CREATE INDEX idx_emp_upper_name ON employees(UPPER(full_name));`.
* C. Create a `Bitmap Index` on `full_name`.
* D. Change `idx_emp_name` to `INVISIBLE`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Applying a function (`UPPER(full_name)`) to an indexed column in the `WHERE` clause prevents the optimizer from using a standard B-Tree index on `full_name` for an index range scan. Creating a **`Function-Based Index`** on `UPPER(full_name)` pre-computes and indexes the uppercase values, allowing the query to perform a fast index lookup.
  * **A, C, D are incorrect:** None of these resolve the function expression mismatch.
</details>

---

### Question 9
**A sequence named `INV_SEQ` has just been created using `CREATE SEQUENCE inv_seq START WITH 10 INCREMENT BY 1;`. You open a brand-new database session and immediately execute `SELECT inv_seq.CURRVAL FROM dual;` as your very first statement. What is the result?**

* A. Returns `10`.
* B. Returns `9`.
* C. Returns `NULL`.
* D. Raises `ORA-08002: sequence INV_SEQ.CURRVAL is not yet defined in this session`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** `CURRVAL` is session-specific and returns the last value generated by `NEXTVAL` **within the current session**. Therefore, `inv_seq.NEXTVAL` **must be referenced at least once in a session before `inv_seq.CURRVAL` can be referenced**! Calling `CURRVAL` first raises `ORA-08002`.
  * **A, B, C are incorrect:** This is the #1 sequence trap on the OCA 1Z0-071 exam.
</details>

---

### Question 10
**Examine the `CREATE SEQUENCE` statement for `TEST_SEQ` below. Suppose you execute `SELECT test_seq.NEXTVAL FROM dual;` **4 times** in succession. What value is returned on the **4th execution**?**

```sql
CREATE SEQUENCE test_seq
START WITH 5
INCREMENT BY 5
MAXVALUE 15
CYCLE
NOCACHE;
```

* A. `5`
* B. `1`
* C. `0`
* D. Raises `ORA-08004: sequence TEST_SEQ.NEXTVAL exceeds MAXVALUE`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Trace each call to `NEXTVAL` and watch out for the default `MINVALUE` on `CYCLE`:
    * 1st call: Returns **`5`** (`START WITH 5`).
    * 2nd call: Returns **`10`** (`5 + 5`).
    * 3rd call: Returns **`15`** (`10 + 5` — reaches `MAXVALUE 15`).
    * 4th call: Because `CYCLE` is specified, the ascending sequence wraps around to **`MINVALUE`** (NOT `START WITH 5`!). Because `MINVALUE` was not explicitly specified in `CREATE SEQUENCE`, the default `MINVALUE` for an ascending sequence is **`1`**! Therefore, the 4th execution returns **`1`**!
  * **A is incorrect:** Most candidates mistakenly assume `CYCLE` restarts at `START WITH 5`. To cycle back to `5`, you must explicitly specify `MINVALUE 5`.
  * **C, D are incorrect:** `CYCLE` prevents `ORA-08004`.
</details>

---

### Question 11
**In your session, the next value to be generated by `my_seq.NEXTVAL` is `50`. You execute the `SELECT` statement below. What values are returned across the 3 columns?**

```sql
SELECT my_seq.NEXTVAL, my_seq.NEXTVAL, my_seq.CURRVAL
FROM dual;
```

* A. `50, 51, 51`
* B. `50, 50, 50`
* C. `50, 51, 50`
* D. Raises an error because `NEXTVAL` cannot be referenced twice in the same `SELECT` list.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Regardless of how many times `my_seq.NEXTVAL` and `my_seq.CURRVAL` appear in a single `SELECT` list, Oracle increments the sequence **only once per row returned**! Since `dual` returns 1 row, `my_seq.NEXTVAL` increments to `50` once and returns `50, 50, 50`.
  * **A, C, D are incorrect:** `NEXTVAL` only increments again when advancing to a subsequent row.
</details>

---

### Question 12
**You want to modify an existing sequence `EMP_SEQ` using `ALTER SEQUENCE`. Which of the following statements will FAIL with an error?**

* A. `ALTER SEQUENCE emp_seq INCREMENT BY 10;`
* B. `ALTER SEQUENCE emp_seq MAXVALUE 999999 CACHE 50;`
* C. `ALTER SEQUENCE emp_seq START WITH 500;`
* D. `ALTER SEQUENCE emp_seq NOCYCLE NOCACHE;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** You **cannot use `START WITH` in an `ALTER SEQUENCE` statement** (`ORA-02283: cannot alter starting sequence number`)! To start at a different number, you must drop and recreate the sequence (or use `ALTER SEQUENCE ... RESTART WITH ...` in newer syntax, whereas `ALTER SEQUENCE ... START WITH ...` always raises `ORA-02283`).
  * **A, B, D are incorrect:** `INCREMENT BY`, `MAXVALUE`, `MINVALUE`, `CYCLE`/`NOCYCLE`, `CACHE`/`NOCACHE`, and `ORDER`/`NOORDER` can all be modified with `ALTER SEQUENCE`.
</details>

---

### Question 13
**In which of the following places is `seq_name.NEXTVAL` ALLOWED in Oracle Database (12c and later)?**

* A. In the `DEFAULT` clause of a column definition in `CREATE TABLE` (e.g., `id NUMBER DEFAULT seq_name.NEXTVAL PRIMARY KEY`).
* B. In the `SELECT` list of a query that uses the `DISTINCT` keyword.
* C. In the condition of a `CHECK` constraint (e.g., `CHECK (id <= seq_name.NEXTVAL)`).
* D. In the `ORDER BY` or `GROUP BY` clause of a `SELECT` query.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** Starting in Oracle 12c, `seq_name.NEXTVAL` (and `CURRVAL`) can be assigned directly as the `DEFAULT` (or `DEFAULT ON NULL`) expression of a table column.
  * **B, C, D are incorrect:** `NEXTVAL` and `CURRVAL` are prohibited in queries with `DISTINCT`, `GROUP BY`, `HAVING`, `ORDER BY`, set operators (`UNION`/`INTERSECT`/`MINUS`), `WHERE` clauses, `VIEW` definitions, and `CHECK` constraints (`ORA-02287: sequence number not allowed here`).
</details>

---

### Question 14
**The `ORDERS` table uses `ord_seq.NEXTVAL` for its primary key. The last generated number was `100`. You execute `INSERT INTO orders VALUES (ord_seq.NEXTVAL, 'New Order');` (which generates `101`), and then immediately execute `ROLLBACK;`. Next, you execute `INSERT INTO orders VALUES (ord_seq.NEXTVAL, 'Valid Order');` and `COMMIT;`. What order ID is assigned to `'Valid Order'`?**

* A. `101` (because `ROLLBACK` returns `101` back to `ord_seq`).
* B. `102` (because sequence increments are independent of transactions, so `ROLLBACK` does not roll back the sequence value, leaving a gap at `101`).
* C. `100`.
* D. Raises an error because `NEXTVAL` cannot be called immediately after `ROLLBACK`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Sequence generation happens independently of transaction control so that concurrent sessions are never blocked waiting for a sequence number. Once `ord_seq.NEXTVAL` generates `101`, rolling back the transaction **does NOT roll back the sequence**! The value `101` is permanently consumed (creating a gap), and the next call to `ord_seq.NEXTVAL` returns **`102`**.
  * **A, C, D are incorrect:** `ROLLBACK` never decrements a sequence.
</details>

---

### Question 15
**In the database, the following objects currently exist:**
1. A table `HR.CUSTOMERS` containing **500 rows** (with `SELECT` granted to `PUBLIC`).
2. A `PUBLIC SYNONYM` named **`CUST`** pointing to `HR.CUSTOMERS`.
3. User `SCOTT` creates a table `SCOTT.LOCAL_CUST` containing **10 rows**, and creates a `PRIVATE SYNONYM` also named **`CUST`** pointing to `SCOTT.LOCAL_CUST`.

**When user `SCOTT` connects and executes `SELECT COUNT(*) FROM cust;`, what result is returned?**

```sql
-- PUBLIC SYNONYM: CUST -> HR.CUSTOMERS (500 rows)
-- SCOTT's PRIVATE SYNONYM: CUST -> SCOTT.LOCAL_CUST (10 rows)
-- User SCOTT executes:
SELECT COUNT(*) FROM cust;
```

* A. `500` (because a `PUBLIC SYNONYM` always takes precedence over a `PRIVATE SYNONYM`).
* B. `10` (because objects in the user's own schema—including a `PRIVATE SYNONYM`—always take precedence over a `PUBLIC SYNONYM`).
* C. `510` (the sum of both tables).
* D. Raises `ORA-00918: column ambiguously defined` due to the duplicate name `CUST`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** According to Oracle's **Name Resolution Precedence** rules, when an unqualified object name (`cust`) is referenced, Oracle searches the **current schema's namespace (`SCOTT`) first**! Because `SCOTT` owns a `PRIVATE SYNONYM` named `CUST` (pointing to `SCOTT.LOCAL_CUST` with 10 rows), Oracle resolves `cust` to `SCOTT.CUST` and returns **`10`**, completely ignoring the `PUBLIC SYNONYM` of the same name! Oracle checks `PUBLIC` synonyms only if no matching object (table, view, sequence, or private synonym) exists in the current schema.
  * **A, C, D are incorrect:** Private objects/synonyms always override public synonyms of the same name.
</details>

---

### Question 16
**The DBA executes `CREATE PUBLIC SYNONYM emp_pub FOR hr.employees;`. User `ALICE` has been granted only the `CREATE SESSION` privilege (and has not been granted any object privileges on `hr.employees`). What happens when `ALICE` connects and executes `SELECT * FROM emp_pub;`?**

* A. `ALICE` sees all rows in `hr.employees` because a `PUBLIC SYNONYM` automatically grants read access to all users.
* B. The statement fails with `ORA-00942: table or view does not exist` because a `PUBLIC SYNONYM` merely provides an alias and does NOT grant any access privileges on the underlying `hr.employees` table.
* C. `ALICE` sees the column headers of the table but `0` rows.
* D. `ALICE` must qualify the synonym as `PUBLIC.emp_pub` to query it.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** A `SYNONYM` (whether `PRIVATE` or `PUBLIC`) is purely a name alias and **never bypasses or grants object privileges**! For `ALICE` to query `emp_pub`, she must be granted `SELECT` on `hr.employees` (directly, via a role, or via `PUBLIC`). Without that privilege, `SELECT * FROM emp_pub;` fails with `ORA-00942`.
  * **A, C, D are incorrect:** Public synonyms are never prefixed with `PUBLIC.`.
</details>

---

### Question 17
**What is the most accurate distinction between the `USER_TABLES` and `ALL_TABLES` data dictionary views?**

* A. `USER_TABLES` shows tables owned by the current user, whereas `ALL_TABLES` shows all tables in the entire database (equivalent to `DBA_TABLES`).
* B. `USER_TABLES` shows only tables owned by the current user (and has no `OWNER` column), whereas `ALL_TABLES` shows tables owned by the current user **PLUS** tables in other schemas on which the current user has privileges (and includes an `OWNER` column).
* C. `ALL_TABLES` shows only tables owned by other users on which the current user has privileges, excluding tables owned by the current user.
* D. `USER_TABLES` includes an `OWNER` column, whereas `ALL_TABLES` does not.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * **`USER_TABLES`**: Lists relational tables owned by the current user's schema. Because all rows belong to the current user, `USER_TABLES` **does not have an `OWNER` column**.
    * **`ALL_TABLES`**: Lists all relational tables accessible to the current user—including **both tables owned by the current user (`USER_TABLES`) and tables in other schemas on which the user has privileges**. Because rows span multiple schemas, `ALL_TABLES` includes an **`OWNER` column**.
  * **A, C, D are incorrect:** `USER_TABLES` is always a subset of `ALL_TABLES`, and only `DBA_TABLES` lists every table in the entire database.
</details>

---

### Question 18
**Which category of views in Oracle Database provides real-time operational metrics of the running database instance (such as active sessions, locks held, and SQL statements in memory) and is continuously updated by the instance while the database is open?**

* A. `USER_*` views
* B. `ALL_*` views
* C. `V$*` views (Dynamic Performance Views)
* D. The `DICTIONARY` (`DICT`) view

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** **Dynamic Performance Views** prefixed with **`V$`** (such as `V$SESSION`, `V$TRANSACTION`, `V$LOCK`, `V$SQL`, `V$INSTANCE`, `V$DATABASE`) expose virtual memory structures (`X$` tables) and control file data reflecting real-time instance activity.
  * **A, B, D are incorrect:** `USER_*`, `ALL_*`, `DBA_*`, and `DICTIONARY` are static Data Dictionary views stored on disk.
</details>

---

### Question 19
**A new database user named `DEV01` has just been created with `CREATE USER dev01 IDENTIFIED BY secret123;`. What is the minimum system privilege that MUST be granted to `DEV01` so that this user can log in (connect) to the Oracle Database?**

* A. `CREATE USER`
* B. `CREATE CONNECTION`
* C. `CREATE SESSION`
* D. `CONNECT DATABASE`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** A newly created user has no privileges whatsoever and cannot even log in until granted the **`CREATE SESSION`** system privilege (`GRANT CREATE SESSION TO dev01;`). Without it, connecting raises `ORA-01045: user DEV01 lacks CREATE SESSION privilege; logon denied`.
  * **A, B, D are incorrect:** `CREATE CONNECTION` and `CONNECT DATABASE` do not exist in Oracle.
</details>

---

### Question 20
**User `DEV01` has been granted the `CREATE TABLE` system privilege and `QUOTA UNLIMITED ON users`. `DEV01` creates the `ORDERS` table in their own schema. Now `DEV01` wants to create a `B-Tree Index` on `ORDERS`. Does `DEV01` need any additional privileges?**

* A. Yes, `DEV01` must be granted the `CREATE INDEX` system privilege.
* B. Yes, `DEV01` must be granted the `INDEX ON orders` object privilege.
* C. No additional privilege is needed; the `CREATE TABLE` privilege automatically allows the owner to create indexes (as well as `ALTER` and `DROP`) on tables in their own schema.
* D. Yes, `DEV01` must be granted the `CREATE ANY INDEX` system privilege.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** This is a classic OCA 1Z0-071 exam trap! There is **NO system privilege named `CREATE INDEX`** in Oracle Database! Owning a table via `CREATE TABLE` automatically gives the schema owner full rights to create indexes on that table, alter or drop the table, and perform all DML on it.
  * **A is incorrect:** `CREATE INDEX` does not exist as a system privilege.
  * **B, D are incorrect:** The `INDEX` object privilege and `CREATE ANY INDEX` system privilege are only needed when creating an index on a table owned by **another user's schema**.
</details>

---

### Question 21
**The owner of the `EMPLOYEES` table wants to grant column-specific object privileges on `EMPLOYEES` to user `INTERN`. Which of the following `GRANT` statements is syntactically VALID in Oracle SQL?**

```sql
-- EMPLOYEES (emp_id, full_name, email, salary, phone)
```

* A. `GRANT SELECT (emp_id, full_name, email) ON employees TO intern;`
* B. `GRANT UPDATE (email, phone), INSERT (emp_id, full_name) ON employees TO intern;`
* C. `GRANT DELETE (phone) ON employees TO intern;`
* D. Both A and B are valid.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In Oracle Database, column-level object privileges can be granted **only** for **`INSERT (cols)`**, **`UPDATE (cols)`**, and **`REFERENCES (cols)`**! Therefore, Statement B is completely valid.
  * **A, C, D are incorrect:** Oracle **does NOT allow column-level `SELECT` or `DELETE` grants**! Writing `GRANT SELECT (emp_id, full_name) ON employees TO intern;` raises `ORA-00969: missing ON keyword`. To restrict which columns a user can query with `SELECT`, you must create a **`VIEW`** containing only those columns and grant `SELECT` on the view.
</details>

---

### Question 22
**Examine the following sequence of system privilege grants and revocations:**
1. `DBA` executes: `GRANT CREATE VIEW TO manager WITH ADMIN OPTION;`
2. `MANAGER` executes: `GRANT CREATE VIEW TO staff;`
3. `STAFF` creates a view named `V_REPORT`.
4. `DBA` executes: `REVOKE CREATE VIEW FROM manager;`

**After step 4 completes, which statement is TRUE regarding `STAFF`'s privileges and the `V_REPORT` view?**

* A. `STAFF` loses the `CREATE VIEW` privilege and `V_REPORT` is automatically dropped.
* B. `STAFF` loses the `CREATE VIEW` privilege, but `V_REPORT` remains intact.
* C. `STAFF` **retains the `CREATE VIEW` privilege** (and can continue creating new views), and `V_REPORT` remains completely intact.
* D. The `REVOKE` statement in step 4 fails because `MANAGER` has already granted the privilege to another user.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Memorize this golden rule: Revoking a **System Privilege** (or a **Role**) that was granted with **`WITH ADMIN OPTION` does NOT cascade**! When `DBA` revokes `CREATE VIEW` from `MANAGER`, only `MANAGER` loses the privilege; `STAFF` **retains `CREATE VIEW`** and any objects already created (`V_REPORT`) remain valid and intact.
  * **A, B, D are incorrect:** Cascading revocation applies only to Object Privileges granted with `WITH GRANT OPTION`.
</details>

---

### Question 23
**In contrast to Question 22, examine the following sequence of object privilege grants and revocations:**
1. User `HR` executes: `GRANT SELECT, UPDATE ON hr.employees TO manager WITH GRANT OPTION;`
2. User `MANAGER` executes: `GRANT SELECT, UPDATE ON hr.employees TO staff;`
3. User `HR` executes: `REVOKE SELECT, UPDATE ON hr.employees FROM manager;`

**After step 3 completes, what happens to `STAFF`'s privileges on `hr.employees`?**

* A. `STAFF` retains both `SELECT` and `UPDATE` privileges on `hr.employees`.
* B. `STAFF` retains `SELECT` but loses `UPDATE`.
* C. Both `SELECT` and `UPDATE` privileges on `hr.employees` are **automatically revoked from `STAFF`** via cascading revocation.
* D. Only `MANAGER` can revoke privileges from `STAFF`, so `HR`'s `REVOKE` statement in step 3 is rejected.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** For **Object Privileges** granted with **`WITH GRANT OPTION`**, revoking the privilege from the intermediate grantor (`MANAGER`) **automatically cascades** and revokes the privilege from all downstream recipients (`STAFF` and anyone `STAFF` granted it to)!
  * **A, B, D are incorrect:** Contrasting Question 22 (`WITH ADMIN OPTION` → No cascade) with Question 23 (`WITH GRANT OPTION` → Cascades) is one of the highest-yield topics on the 1Z0-071 exam.
</details>

---

### Question 24
**Which of the following statements is TRUE regarding a `ROLE` in Oracle Database?**

* A. A `ROLE` can contain only system privileges and cannot contain object privileges.
* B. You can grant an object privilege to a `ROLE` with the `WITH GRANT OPTION` clause (e.g., `GRANT SELECT ON emp TO my_role WITH GRANT OPTION;`).
* C. A `ROLE` can contain both system privileges and object privileges, and can be granted to another `ROLE`; however, object privileges cannot be granted to a `ROLE` with `WITH GRANT OPTION`.
* D. A `ROLE` can have the same name as an existing `USER` in the database.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** A `ROLE` can bundle system privileges, object privileges, and other roles (as long as no circular hierarchy is created). However, Oracle prohibits granting an object privilege with `WITH GRANT OPTION` to a `ROLE` (`ORA-01926: cannot GRANT to a role WITH GRANT OPTION`).
  * **A, B are incorrect:** Roles can hold object privileges, just not with `WITH GRANT OPTION`.
  * **D is incorrect:** Users and roles share the same database-wide namespace, so a role name cannot collide with an existing user name.
</details>

---

### Question 25
**User `SCOTT` has been granted the `CREATE VIEW` system privilege directly. In addition, `SCOTT` has been granted a role named `HR_READ_ROLE` (which contains the `SELECT ON hr.employees` privilege). However, when `SCOTT` executes `CREATE VIEW v_emp_scott AS SELECT * FROM hr.employees;`, Oracle raises `ORA-01031: insufficient privileges` (even though `SCOTT` can run `SELECT * FROM hr.employees;` directly without issue). Why does this error occur?**

* A. `HR_READ_ROLE` is not enabled in `SCOTT`'s session.
* B. Views cannot reference tables in another user's schema.
* C. To create a stored schema object such as a `VIEW` (or a definer's rights PL/SQL procedure) that references another user's object, the creator must be granted the required object privilege (`SELECT ON hr.employees`) **directly** (or via `PUBLIC`), rather than through a `ROLE`.
* D. `SCOTT` lacks the `CREATE ANY VIEW` system privilege.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Because privileges acquired through roles can be dynamically enabled or disabled at the session level (`SET ROLE`), Oracle does not allow stored compiled objects such as **`VIEW`** definitions (or definer's rights PL/SQL units) to rely on object privileges granted via a `ROLE`! For `SCOTT` to create `v_emp_scott` on `hr.employees`, `SELECT ON hr.employees` must be granted **directly to `SCOTT`** (or `TO PUBLIC`).
  * **A is incorrect:** `SCOTT` can already run standalone `SELECT * FROM hr.employees;`, proving the role is enabled.
  * **B, D are incorrect:** Cross-schema views are valid when privileges are granted directly, and creating a view in one's own schema requires only `CREATE VIEW`.
</details>

---
