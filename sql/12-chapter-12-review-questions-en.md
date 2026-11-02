# Review Questions - Chapter 12: Data Integrity Constraints

> **Reference:** *OCA/OCP Oracle Database SQL Exam Guide (Exam 1Z0-071)* & VNPT IT Proficiency Assessment.  
> **Total Questions:** 25 standard Oracle certification multiple-choice questions with detailed explanations.  
> **How to study:** Read each question carefully and select your answer first, then click **"👉 View Answer & Detailed Explanation"** to check the correct answer and master key exam traps.

---

### Question 1
**In the `USER_CONSTRAINTS` data dictionary view in Oracle Database, the `CONSTRAINT_TYPE` column stores a single-character code for each constraint type. Which codes correspond to `FOREIGN KEY` and `NOT NULL` constraints?**

* A. `FOREIGN KEY` is `'F'`, `NOT NULL` is `'N'`
* B. `FOREIGN KEY` is `'R'`, `NOT NULL` is `'N'`
* C. `FOREIGN KEY` is `'R'`, `NOT NULL` is `'C'`
* D. `FOREIGN KEY` is `'F'`, `NOT NULL` is `'C'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In `USER_CONSTRAINTS`, Oracle uses the following codes in `CONSTRAINT_TYPE`:
    * `'P'`: `PRIMARY KEY`
    * `'U'`: `UNIQUE`
    * `'R'`: `FOREIGN KEY` (*Referential integrity*)
    * `'C'`: Used for both **`CHECK`** and **`NOT NULL`** constraints (because Oracle internally stores `NOT NULL` as a check constraint).
  * **A, B, D are incorrect:** Neither `'F'` nor `'N'` is used in `USER_CONSTRAINTS.CONSTRAINT_TYPE`.
</details>

---

### Question 2
**Which type of constraint MUST be defined at the column level (inline) and CANNOT be declared directly using its keyword at the table level (out-of-line)?**

* A. `PRIMARY KEY`
* B. `UNIQUE`
* C. `NOT NULL`
* D. `CHECK`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** A `NOT NULL` constraint can only be declared inline at the column level (e.g., `emp_name VARCHAR2(50) NOT NULL`). You cannot write `CONSTRAINT nn_emp NOT NULL (emp_name)` at the table level (unless you express it as a `CHECK (emp_name IS NOT NULL)` constraint).
  * **A, B, D are incorrect:** `PRIMARY KEY`, `UNIQUE`, `FOREIGN KEY`, and `CHECK` constraints can all be defined at either the column level or the table level.
</details>

---

### Question 3
**The `EMPLOYEES` table already exists, and its `EMAIL` column currently allows `NULL` values (though all existing rows currently have non-null email addresses). Which of the following statements validly adds a `NOT NULL` constraint named `EMP_EMAIL_NN` to the `EMAIL` column?**

```sql
-- Existing table EMPLOYEES has column EMAIL VARCHAR2(100)
```

* A. `ALTER TABLE employees ADD CONSTRAINT emp_email_nn NOT NULL (email);`
* B. `ALTER TABLE employees MODIFY (email CONSTRAINT emp_email_nn NOT NULL);`
* C. `ALTER TABLE employees ADD NOT NULL (email) CONSTRAINT emp_email_nn;`
* D. `ALTER TABLE employees RENAME COLUMN email TO NOT NULL;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Because `NOT NULL` is an inline column-level constraint, adding `NOT NULL` to an existing column requires **`ALTER TABLE ... MODIFY (column_name [CONSTRAINT constraint_name] NOT NULL)`**.
  * **A, C are incorrect:** You cannot use `ALTER TABLE ... ADD CONSTRAINT ... NOT NULL (col)` (unless written as `ADD CONSTRAINT emp_email_nn CHECK (email IS NOT NULL)`).
  * **D is incorrect:** `RENAME COLUMN` only changes a column's identifier.
</details>

---

### Question 4
**Examine the two `CREATE TABLE` statements below that define a foreign key referencing `DEPT(dept_id)`. Which statement is TRUE?**

```sql
-- Statement 1:
CREATE TABLE emp1 (
    emp_id  NUMBER PRIMARY KEY,
    dept_id NUMBER CONSTRAINT fk_dept1 FOREIGN KEY REFERENCES dept(dept_id)
);

-- Statement 2:
CREATE TABLE emp2 (
    emp_id  NUMBER PRIMARY KEY,
    dept_id NUMBER,
    CONSTRAINT fk_dept2 FOREIGN KEY (dept_id) REFERENCES dept(dept_id)
);
```

* A. Both Statement 1 and Statement 2 execute successfully.
* B. Statement 1 succeeds, whereas Statement 2 fails with a syntax error.
* C. Statement 1 fails with a syntax error because the `FOREIGN KEY` keywords are used at the column level, whereas Statement 2 executes successfully.
* D. Both Statement 1 and Statement 2 fail because the `ON DELETE` clause is missing.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** This is a classic syntax trap on the 1Z0-071 exam:
    * When defining a foreign key inline at the **column level** (Statement 1), you **must NOT include the `FOREIGN KEY` keywords**; you write only `dept_id NUMBER CONSTRAINT fk_dept1 REFERENCES dept(dept_id)`. Including `FOREIGN KEY` inline raises `ORA-02253: constraint specification not allowed here`.
    * When defining a foreign key out-of-line at the **table level** (Statement 2), you **must include `FOREIGN KEY (dept_id)`** before `REFERENCES`. Thus Statement 2 succeeds.
  * **A, B, D are incorrect:** The `ON DELETE` clause is always optional.
</details>

---

### Question 5
**The `SUBSCRIBERS` table is created with a composite `UNIQUE` constraint on `(city_code, phone_no)` as shown below, followed by 4 sequential `INSERT` statements. Which `INSERT` statement will FAIL due to a `UNIQUE` constraint violation?**

```sql
CREATE TABLE subscribers (
    sub_id    NUMBER PRIMARY KEY,
    city_code VARCHAR2(10),
    phone_no  VARCHAR2(20),
    CONSTRAINT uk_city_phone UNIQUE (city_code, phone_no)
);

-- (1) INSERT INTO subscribers VALUES (1, NULL, NULL);
-- (2) INSERT INTO subscribers VALUES (2, NULL, NULL);
-- (3) INSERT INTO subscribers VALUES (3, 'HN', NULL);
-- (4) INSERT INTO subscribers VALUES (4, 'HN', NULL);
```

* A. Statement `(2)` fails because two rows cannot both have `(NULL, NULL)`.
* B. Statement `(3)` fails because columns in a composite `UNIQUE` constraint cannot contain `NULL`.
* C. Statement `(4)` fails with `ORA-00001` because in a composite `UNIQUE` constraint, once at least one column is non-null (`'HN'`), the combination `('HN', NULL)` cannot be duplicated.
* D. None of the statements fail; all 4 rows are inserted successfully.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In Oracle Database, a composite `UNIQUE` constraint behaves as follows with `NULL` values:
    * If **all columns in the composite key are `NULL`**—as in statements `(1)` and `(2)` `(NULL, NULL)`—the key is not indexed in the B-Tree index, so any number of `(NULL, NULL)` rows can be inserted!
    * However, if **at least one column in the composite key is non-null**—as in statement `(3)` `('HN', NULL)`—that tuple is stored in the unique index. When statement `(4)` attempts to insert a second `('HN', NULL)` tuple, Oracle detects a duplicate key entry and raises `ORA-00001: unique constraint (UK_CITY_PHONE) violated`!
  * **A, B, D are incorrect:** This is a critical Oracle-specific rule for composite `UNIQUE` constraints on the OCP exam.
</details>

---

### Question 6
**You want to create an `ORDER_DETAILS` table with a composite primary key consisting of `ORDER_ID` and `PRODUCT_ID`. Which statement is VALID?**

* A. `CREATE TABLE order_details (order_id NUMBER PRIMARY KEY, product_id NUMBER PRIMARY KEY, qty NUMBER);`
* B. `CREATE TABLE order_details (order_id NUMBER, product_id NUMBER, qty NUMBER, CONSTRAINT pk_od PRIMARY KEY (order_id, product_id));`
* C. `CREATE TABLE order_details (order_id NUMBER, product_id NUMBER, qty NUMBER, PRIMARY KEY (order_id) AND (product_id));`
* D. `CREATE TABLE order_details (order_id NUMBER COMPOSITE KEY, product_id NUMBER COMPOSITE KEY, qty NUMBER);`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Because a table can have at most one `PRIMARY KEY`, a composite primary key spanning two or more columns **must be defined at the table level (out-of-line)**: `CONSTRAINT pk_od PRIMARY KEY (order_id, product_id)`.
  * **A is incorrect:** Specifying `PRIMARY KEY` inline on two separate columns attempts to create two primary keys on the same table, raising `ORA-02260: table can have only one primary key`.
  * **C, D are incorrect:** Invalid SQL syntax.
</details>

---

### Question 7
**The `PARENT_DEPT` table is created with `CREATE TABLE parent_dept (dept_id NUMBER, dept_name VARCHAR2(30));` (with no constraints defined). You then create a standard index: `CREATE INDEX idx_dept_id ON parent_dept(dept_id);`. What happens when you execute the statement below to create `CHILD_EMP` with a foreign key referencing `parent_dept(dept_id)`?**

```sql
CREATE TABLE child_emp (
    emp_id  NUMBER PRIMARY KEY,
    dept_id NUMBER REFERENCES parent_dept(dept_id)
);
```

* A. It succeeds because an index already exists on `parent_dept(dept_id)`.
* B. It succeeds and Oracle automatically promotes `idx_dept_id` to a `PRIMARY KEY`.
* C. It fails with `ORA-02270: no matching unique or primary key for this column-list` because the referenced column in the parent table must be constrained by a `PRIMARY KEY` or `UNIQUE` constraint.
* D. It succeeds provided `PARENT_DEPT` is currently empty.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** A `FOREIGN KEY` constraint can only reference a parent column (or set of columns) that has an active **`PRIMARY KEY` or `UNIQUE` constraint** defined on the parent table. Merely having an index (even a `UNIQUE INDEX` without a `PRIMARY KEY` or `UNIQUE` constraint) is not sufficient and raises `ORA-02270`.
  * **A, B, D are incorrect:** An index alone cannot serve as the parent key of a referential integrity constraint.
</details>

---

### Question 8
**In Oracle Database, when defining a `FOREIGN KEY` constraint, which of the following referential action clauses are syntactically VALID?**

* A. `ON DELETE CASCADE`, `ON DELETE SET NULL`, and `ON UPDATE CASCADE`
* B. `ON DELETE CASCADE`, `ON DELETE SET NULL`, and `ON DELETE RESTRICT`
* C. `ON DELETE CASCADE`, `ON DELETE SET NULL`, and `ON DELETE SET DEFAULT`
* D. Only `ON DELETE CASCADE` and `ON DELETE SET NULL` (or omitting the `ON DELETE` clause altogether).

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** This is a major exam trap on both 1Z0-071 and VNPT assessments! In Oracle SQL, foreign keys support only:
    1. Omitting `ON DELETE` (which defaults to restrict/no action behavior—preventing parent deletion if child rows exist).
    2. `ON DELETE CASCADE` (automatically deletes matching child rows).
    3. `ON DELETE SET NULL` (automatically sets the foreign key column in matching child rows to `NULL`).
  * **A, B, C are incorrect:** Oracle SQL **does NOT support** `ON UPDATE CASCADE`, `ON DELETE RESTRICT`, `ON DELETE NO ACTION`, or `ON DELETE SET DEFAULT`! Including any of those clauses in `CREATE/ALTER TABLE` raises a syntax error.
</details>

---

### Question 9
**The `DEPARTMENTS` table contains a row with `dept_id = 10`. The `EMPLOYEES` table is successfully created using the statement below and contains 1 employee in `dept_id = 10`. What happens when you execute `DELETE FROM departments WHERE dept_id = 10;`?**

```sql
CREATE TABLE employees (
    emp_id  NUMBER PRIMARY KEY,
    dept_id NUMBER NOT NULL
            CONSTRAINT fk_dept REFERENCES departments(dept_id) ON DELETE SET NULL
);
```

* A. The `CREATE TABLE employees` statement itself fails initially because `NOT NULL` cannot be combined with `ON DELETE SET NULL`.
* B. The row `dept_id = 10` in `DEPARTMENTS` is deleted and the employee's `dept_id` is set to `0`.
* C. The `DELETE FROM departments WHERE dept_id = 10;` statement fails with `ORA-01407: cannot update ("EMPLOYEES"."DEPT_ID") to NULL` because `dept_id` has a `NOT NULL` constraint.
* D. Both department `10` and the employee in department `10` are deleted from the database.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:**
    * First, Oracle **allows creating a table** where a column has both `NOT NULL` and `ON DELETE SET NULL` without raising an error at DDL time.
    * However, when `DELETE FROM departments WHERE dept_id = 10;` is executed, `ON DELETE SET NULL` attempts to update `EMPLOYEES.DEPT_ID` to `NULL` for the child row. That recursive update violates the `NOT NULL` constraint on `EMPLOYEES.DEPT_ID`, raising `ORA-01407` and rolling back the `DELETE` statement!
  * **A, B, D are incorrect:** Only `ON DELETE CASCADE` deletes child rows (D).
</details>

---

### Question 10
**The `PRODUCTS` table is created with a `CHECK` constraint as shown below, followed by 3 `INSERT` statements. Which of the `INSERT` statements will execute SUCCESSFULLY?**

```sql
CREATE TABLE products (
    prod_id NUMBER PRIMARY KEY,
    price   NUMBER CONSTRAINT chk_price CHECK (price >= 100 AND price <= 5000)
);

-- Statement 1: INSERT INTO products VALUES (1, 500);
-- Statement 2: INSERT INTO products VALUES (2, 50);
-- Statement 3: INSERT INTO products VALUES (3, NULL);
```

* A. Statement 1 only
* B. Statements 1 and 3 only
* C. Statements 1 and 2 only
* D. All 3 statements succeed

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Under Oracle's three-valued logic, a `CHECK` constraint rejects a row **only when its condition evaluates to `FALSE`**; rows that evaluate to **`TRUE` or `UNKNOWN` (`NULL`)** are accepted:
    * **Statement 1 (`price = 500`):** Evaluates to `TRUE` → Succeeds.
    * **Statement 2 (`price = 50`):** Evaluates to `FALSE` → Fails with `ORA-02290: check constraint violated`.
    * **Statement 3 (`price = NULL`):** `NULL >= 100 AND NULL <= 5000` evaluates to `UNKNOWN` (not `FALSE`), and `price` has no `NOT NULL` constraint → **Succeeds!**
  * **A, C, D are incorrect:** A `CHECK` constraint does not prevent `NULL` values unless `IS NOT NULL` or a `NOT NULL` constraint is also specified.
</details>

---

### Question 11
**Which of the following table-level `CHECK` constraint definitions is VALID in a `CREATE TABLE employees` statement?**

* A. `CONSTRAINT chk_hire CHECK (hire_date <= SYSDATE)`
* B. `CONSTRAINT chk_comp CHECK (salary + NVL(commission, 0) > 1000)`
* C. `CONSTRAINT chk_dept CHECK (dept_id IN (SELECT dept_id FROM departments))`
* D. `CONSTRAINT chk_row CHECK (ROWNUM <= 1000)`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** A table-level (out-of-line) `CHECK` constraint can reference multiple columns from the same row (`salary`, `commission`) and use deterministic built-in SQL functions such as `NVL`, `UPPER`, `LOWER`, `ROUND`, etc.
  * **A is incorrect:** Non-deterministic environment/date functions such as `SYSDATE`, `CURRENT_DATE`, `USER`, and `UID` are prohibited in `CHECK` constraints (`ORA-02436`).
  * **C is incorrect:** Subqueries are prohibited in `CHECK` constraints (`ORA-02251`).
  * **D is incorrect:** Pseudocolumns (`ROWNUM`, `ROWID`, `LEVEL`, `NEXTVAL`, `CURRVAL`) are prohibited in `CHECK` constraints.
</details>

---

### Question 12
**Why does the `CREATE TABLE` statement below fail when executed?**

```sql
CREATE TABLE project_tasks (
    task_id    NUMBER PRIMARY KEY,
    start_date DATE,
    end_date   DATE CONSTRAINT chk_task_dates CHECK (end_date >= start_date)
);
```

* A. Two `DATE` columns cannot be compared using the `>=` operator.
* B. The `chk_task_dates` constraint is defined inline at the column level on `end_date`, but it references another column (`start_date`) (`ORA-02438`).
* C. Constraint names cannot contain underscores (`_`).
* D. The `TO_DATE` function is required when comparing two date columns.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** An inline **column-level `CHECK` constraint** can reference **only the column on which it is defined**! Because there is no comma after `end_date DATE`, `chk_task_dates` is parsed as an inline constraint on `end_date` that illegally references `start_date`, raising `ORA-02438: Column check constraint cannot reference other columns`. Placing a comma after `end_date DATE` turns it into a table-level constraint and makes it valid.
  * **A, C, D are incorrect:** Comparing two `DATE` columns with `>=` is completely valid in a table-level `CHECK` constraint.
</details>

---

### Question 13
**The `DEPARTMENTS` table has a primary key `DEPT_ID` that is referenced by a foreign key in the `EMPLOYEES` table. Which statement drops the primary key of `DEPARTMENTS` and automatically drops the dependent foreign key constraint in `EMPLOYEES`?**

* A. `ALTER TABLE departments DROP PRIMARY KEY CASCADE;`
* B. `ALTER TABLE departments DROP PRIMARY KEY FORCE;`
* C. `ALTER TABLE departments DELETE PRIMARY KEY CASCADE CONSTRAINTS;`
* D. `ALTER TABLE departments DROP PRIMARY KEY ON DELETE CASCADE;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** When dropping a `PRIMARY KEY` or `UNIQUE` constraint (or `DROP CONSTRAINT pk_name`) that is referenced by foreign keys in child tables, appending **`CASCADE`** (`ALTER TABLE departments DROP PRIMARY KEY CASCADE;`) automatically drops the dependent `FOREIGN KEY` constraints on the child tables without deleting child table data.
  * **B, C, D are incorrect:** `FORCE` and `ON DELETE CASCADE` are invalid syntax in `ALTER TABLE ... DROP PRIMARY KEY`.
</details>

---

### Question 14
**The `ORDERS` table currently contains `10,000` historical rows, including several old rows where `order_total < 0`. Going forward, you want to add a `CHECK (order_total >= 0)` constraint on `ORDERS` such that existing historical rows with `order_total < 0` remain in the table without raising an error, while all future `INSERT` and `UPDATE` operations must strictly satisfy `order_total >= 0`. Which constraint state should you use?**

* A. `ENABLE VALIDATE`
* B. `ENABLE NOVALIDATE`
* C. `DISABLE VALIDATE`
* D. `DISABLE NOVALIDATE`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** **`ENABLE NOVALIDATE`** is designed specifically for this scenario:
    * `NOVALIDATE`: Does not scan or validate existing rows already in the table (allowing historical rows with `order_total < 0` to remain).
    * `ENABLE`: Strictly enforces the constraint on all new or modified rows produced by future `INSERT` and `UPDATE` statements.
  * **A is incorrect:** `ENABLE VALIDATE` scans all 10,000 existing rows and fails immediately upon encountering an old row with `order_total < 0` (`ORA-02293`).
  * **C, D are incorrect:** `DISABLE` does not enforce the check rule on new DML operations.
</details>

---

### Question 15
**A `CHECK` constraint on the `SALES_DATA` table is placed into the `DISABLE VALIDATE` state using the statement below. What happens when a user executes `INSERT INTO sales_data VALUES (101, 500);`?**

```sql
ALTER TABLE sales_data MODIFY CONSTRAINT chk_sales DISABLE VALIDATE;
```

* A. The row is inserted without checking the `chk_sales` condition.
* B. The row is validated against `chk_sales` and then inserted.
* C. The `INSERT` statement is rejected with `ORA-25128` because a `DISABLE VALIDATE` constraint prohibits all `INSERT`, `UPDATE`, and `DELETE` operations on the table.
* D. Oracle automatically switches the constraint to `ENABLE VALIDATE` and inserts the row.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In the **`DISABLE VALIDATE`** state, the constraint check is disabled (`DISABLE`), yet Oracle guarantees that all data in the table remains 100% valid (`VALIDATE`). To preserve that guarantee while enforcement is disabled, Oracle **blocks all DML (`INSERT`, `UPDATE`, `DELETE`) on the table** with `ORA-25128: No insert/update/delete on table with constraint disabled and validated`!
  * **A, B, D are incorrect:** This is a classic OCP exam question testing the four constraint states.
</details>

---

### Question 16
**You create a new table with a standard `PRIMARY KEY` constraint (without specifying an index clause or `DEFERRABLE`). Later, you execute `ALTER TABLE emp DISABLE PRIMARY KEY;` (without the `KEEP INDEX` clause). What happens to the `Unique Index` that Oracle automatically created for that primary key?**

* A. The `Unique Index` remains intact and continues to prevent duplicate values.
* B. The `Unique Index` is automatically dropped from the database.
* C. The `Unique Index` is marked `UNUSABLE`.
* D. The `Unique Index` is converted into a `Bitmap Index`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** When a `PRIMARY KEY` or `UNIQUE` constraint creates a system-generated `Unique Index`, executing `DISABLE` (or `DROP`) on that constraint without `KEEP INDEX` causes Oracle to **automatically drop the underlying `Unique Index`**! Re-enabling the primary key later will build a brand-new `Unique Index`.
  * **A, C, D are incorrect:** To retain the index when disabling or dropping a PK/UK, you must specify `ALTER TABLE emp DISABLE PRIMARY KEY KEEP INDEX;`.
</details>

---

### Question 17
**You create a table using: `CREATE TABLE test_def (id NUMBER CONSTRAINT pk_test PRIMARY KEY, name VARCHAR2(20));`. Later, inside a transaction, you want to defer checking `pk_test` until `COMMIT` time. What must you do?**

* A. Execute `SET CONSTRAINT pk_test DEFERRED;` at the start of the transaction.
* B. Execute `ALTER TABLE test_def MODIFY CONSTRAINT pk_test INITIALLY DEFERRED;` before starting the transaction.
* C. Execute `ALTER TABLE test_def MODIFY CONSTRAINT pk_test DEFERRABLE;` before starting the transaction.
* D. Drop the `pk_test` constraint (`DROP CONSTRAINT`) and recreate it (`ADD CONSTRAINT`) with the `DEFERRABLE` keyword, because a `NOT DEFERRABLE` (default) constraint cannot be converted to `DEFERRABLE` via `ALTER TABLE` or `SET CONSTRAINT`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** By default, constraints created without the `DEFERRABLE` keyword are **`NOT DEFERRABLE`**. Whether a constraint is `DEFERRABLE` or `NOT DEFERRABLE` is fixed at creation time and **cannot be altered using `ALTER TABLE ... MODIFY CONSTRAINT`**! The only way to make it deferrable is to drop the constraint and recreate it with `DEFERRABLE`.
  * **A, B, C are incorrect:** Executing A or B on a `NOT DEFERRABLE` constraint raises `ORA-02447: cannot defer a constraint that is not deferrable`. Executing C raises a syntax error.
</details>

---

### Question 18
**If you specify the `DEFERRABLE` keyword when creating a constraint without explicitly specifying `INITIALLY IMMEDIATE` or `INITIALLY DEFERRED`, what is the default behavior of the constraint?**

```sql
CREATE TABLE emp_check (
    emp_id NUMBER PRIMARY KEY,
    salary NUMBER CONSTRAINT chk_sal CHECK (salary > 0) DEFERRABLE
);
```

* A. It defaults to `DEFERRABLE INITIALLY DEFERRED` (always waits until `COMMIT` to validate).
* B. It defaults to `DEFERRABLE INITIALLY IMMEDIATE` (validates at the end of each DML statement, but allows `SET CONSTRAINT` to switch it to `DEFERRED` when needed).
* C. The statement fails with a syntax error because `DEFERRABLE` requires an `INITIALLY` clause.
* D. It defaults to `NOT DEFERRABLE`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Specifying `DEFERRABLE` alone defaults to **`DEFERRABLE INITIALLY IMMEDIATE`**. The constraint is checked immediately after each DML statement by default, but can be switched to `DEFERRED` within a transaction using `SET CONSTRAINT chk_sal DEFERRED;` (or `SET CONSTRAINTS ALL DEFERRED;`).
  * **A, C, D are incorrect:** To defer validation by default without issuing `SET CONSTRAINT`, you must explicitly specify `DEFERRABLE INITIALLY DEFERRED`.
</details>

---

### Question 19
**When you create a `PRIMARY KEY` or `UNIQUE` constraint with the `DEFERRABLE` clause on a new table that has no existing indexes, what type of index does Oracle automatically create to enforce the constraint?**

```sql
CREATE TABLE invoices (
    inv_id NUMBER CONSTRAINT pk_inv PRIMARY KEY DEFERRABLE INITIALLY DEFERRED,
    amount NUMBER
);
```

* A. A `Unique B-Tree Index`.
* B. A `Non-Unique B-Tree Index`.
* C. A `Bitmap Index`.
* D. No index is created.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Because a **`DEFERRABLE`** `PRIMARY KEY` or `UNIQUE` constraint allows duplicate key values to exist temporarily inside an active transaction prior to `COMMIT`, a `Unique Index` would prematurely reject duplicate rows during `INSERT`/`UPDATE`. Therefore, Oracle automatically creates a **`Non-Unique B-Tree Index`** to support any `DEFERRABLE` `PRIMARY KEY` or `UNIQUE` constraint!
  * **A is incorrect:** Oracle creates a `Unique Index` only when the PK/UK is `NOT DEFERRABLE` (the default).
  * **C, D are incorrect:** PK/UK constraints always use a B-Tree index.
</details>

---

### Question 20
**The `PRODUCTS (id NUMBER CONSTRAINT pk_prod PRIMARY KEY DEFERRABLE INITIALLY DEFERRED, name VARCHAR2(20))` table is currently empty (`0` rows). You execute the script below in a session. After the script finishes, how many rows are in `PRODUCTS`?**

```sql
INSERT INTO products VALUES (10, 'Phone');
INSERT INTO products VALUES (20, 'Tablet');
INSERT INTO products VALUES (20, 'Laptop'); -- Duplicate id = 20!
COMMIT;
```

* A. `2` rows (`10` and one of the `20` rows)
* B. `1` row (only row `10`)
* C. `0` rows (because when `COMMIT` detects a violation of a `DEFERRED` constraint, Oracle raises an error and automatically rolls back the **entire transaction**!)
* D. `3` rows (because `DEFERRED` skips duplicate checks during `COMMIT`)

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Contrast `IMMEDIATE` vs `DEFERRED` constraint violations carefully:
    * While executing the 3 `INSERT` statements, because `pk_prod` is `INITIALLY DEFERRED`, all 3 statements succeed (`1 row created`) without checking for duplicates.
    * When **`COMMIT;`** is issued, Oracle validates all deferred constraints. Detecting duplicate `id = 20` values, the `COMMIT` fails with `ORA-02091: transaction rolled back` and `ORA-00001: unique constraint violated`, and **Oracle automatically rolls back the ENTIRE transaction** (undoing row `10` as well as both `20` rows)! Thus `0` rows remain in `PRODUCTS`.
  * **A, B, D are incorrect:** Whereas an `IMMEDIATE` constraint violation causes only a *statement-level rollback*, a `DEFERRED` constraint violation detected at `COMMIT` time causes a **full transaction-level rollback**!
</details>

---

### Question 21
**What is the scope and duration of the statement `SET CONSTRAINTS ALL DEFERRED;`?**

* A. It remains in effect permanently across all sessions in the database until the instance is restarted.
* B. It remains in effect for all transactions in the current session until the user disconnects.
* C. It applies **only to the current transaction** in the session; as soon as `COMMIT` or `ROLLBACK` is executed, constraint checking automatically reverts to each constraint's default `INITIALLY` mode.
* D. It applies only to the single next DML statement.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `SET CONSTRAINT(S) {constraint_name | ALL} {IMMEDIATE | DEFERRED};` is a **transaction-level** command. Once the current transaction ends via `COMMIT` or `ROLLBACK`, the setting resets to each constraint's defined `INITIALLY IMMEDIATE` or `INITIALLY DEFERRED` state.
  * **A, B, D are incorrect:** To change the behavior for the entire session across multiple transactions, use `ALTER SESSION SET CONSTRAINTS = DEFERRED;`. To change the permanent default for the table, use `ALTER TABLE ... MODIFY CONSTRAINT ... INITIALLY DEFERRED;`.
</details>

---

### Question 22
**The `EMP` table has a primary key `EMP_ID` and a self-referencing foreign key `MGR_ID` (`FOREIGN KEY (mgr_id) REFERENCES emp(emp_id)`). Currently, `EMP` is completely empty (`0` rows). Which of the following first `INSERT` statements into `EMP` will execute SUCCESSFULLY (assuming default `IMMEDIATE` constraint checking)?**

```sql
CREATE TABLE emp (
    emp_id NUMBER PRIMARY KEY,
    mgr_id NUMBER REFERENCES emp(emp_id)
);
```

* A. `INSERT INTO emp (emp_id, mgr_id) VALUES (100, 101);`
* B. `INSERT INTO emp (emp_id, mgr_id) VALUES (100, NULL);`
* C. `INSERT INTO emp (emp_id, mgr_id) VALUES (100, 100);`
* D. Both B and C will execute successfully!

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** With a self-referencing foreign key (`mgr_id REFERENCES emp(emp_id)`), when inserting the first row into an empty table:
    * **Option B (`100, NULL`):** Foreign key columns accept `NULL` values unless `NOT NULL` is also specified.
    * **Option C (`100, 100`):** Oracle evaluates the foreign key constraint at the end of the `INSERT` statement—after `emp_id = 100` has been inserted by that same row. Thus a row referencing its own `emp_id = 100` is completely valid and succeeds!
  * **A is incorrect:** Because `emp_id = 101` does not exist in `EMP`, Option A fails with `ORA-02291: integrity constraint violated - parent key not found`.
</details>

---

### Question 23
**When you execute an `INSERT` into a child table (`EMPLOYEES`) with a `dept_id = 999` that does not exist in the parent table (`DEPARTMENTS`), which error message does Oracle raise? Conversely, when you execute a `DELETE` on the parent table (`DEPARTMENTS`) for a department that currently has child rows in `EMPLOYEES`, which error message does Oracle raise?**

* A. `INSERT` into the child table raises `parent key not found` (`ORA-02291`); `DELETE` from the parent table raises `child record found` (`ORA-02292`).
* B. `INSERT` into the child table raises `child record found` (`ORA-02292`); `DELETE` from the parent table raises `parent key not found` (`ORA-02291`).
* C. Both operations raise `unique constraint violated` (`ORA-00001`).
* D. `INSERT` into the child table automatically creates a parent row; `DELETE` from the parent table raises `child record found`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** Memorize the two referential integrity error messages:
    * Inserting/updating a child row with a foreign key value not present in the parent table → **`ORA-02291: integrity constraint violated - parent key not found`**.
    * Deleting/updating a parent row when matching child rows exist (without `CASCADE` or `SET NULL`) → **`ORA-02292: integrity constraint violated - child record found`**.
  * **B, C, D are incorrect:** Option B reverses the parent and child error messages.
</details>

---

### Question 24
**The `CUSTOMERS` table has a column `CUST_CODE VARCHAR2(10)`. You perform the following two steps sequentially:**
1. Create a non-unique index: `CREATE INDEX idx_cust_code ON customers(cust_code);`
2. Add a primary key constraint: `ALTER TABLE customers ADD CONSTRAINT pk_cust PRIMARY KEY (cust_code);`

**After step 2 completes, what happens to the index on `CUST_CODE`?**

* A. Step 2 fails with an error because `CUST_CODE` already has a non-unique index.
* B. Oracle creates a second `Unique Index` named `PK_CUST` alongside `IDX_CUST_CODE`.
* C. Oracle automatically reuses the existing non-unique index `IDX_CUST_CODE` to enforce the `PRIMARY KEY` constraint without creating a new index.
* D. Oracle drops `IDX_CUST_CODE` and creates a new `Unique Index` named `PK_CUST`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In Oracle Database, a `PRIMARY KEY` or `UNIQUE` constraint can be enforced using an existing **Non-Unique Index**! When you add `PRIMARY KEY (cust_code)`, Oracle detects that `IDX_CUST_CODE` already indexes `cust_code` and **reuses `IDX_CUST_CODE`** to enforce uniqueness without creating a duplicate index. (Furthermore, because `IDX_CUST_CODE` was explicitly created by a user beforehand, disabling the primary key later will NOT automatically drop `IDX_CUST_CODE`!).
  * **A, B, D are incorrect:** Oracle reuses existing matching indexes rather than failing or creating redundant indexes.
</details>

---

### Question 25
**You want to query the exact column names and their ordinal positions participating in each constraint (for example, to see which columns make up the composite primary key `PK_ORDER_ITEMS`) in your schema. Which Data Dictionary view must you query?**

* A. `USER_CONSTRAINTS`
* B. `USER_CONS_COLUMNS`
* C. `USER_TAB_COLUMNS`
* D. `USER_INDEXES`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * **`USER_CONSTRAINTS`** stores constraint-level metadata (`CONSTRAINT_NAME`, `CONSTRAINT_TYPE`, `TABLE_NAME`, `SEARCH_CONDITION`, `STATUS`, `DEFERRABLE`, `VALIDATED`), but it **does NOT contain a `COLUMN_NAME` column**!
    * To see which specific columns (`COLUMN_NAME`) belong to a constraint and their order (`POSITION`), you must query **`USER_CONS_COLUMNS`** (or `ALL_CONS_COLUMNS` / `DBA_CONS_COLUMNS`).
  * **A, C, D are incorrect:** Remembering that `USER_CONSTRAINTS` lacks `COLUMN_NAME` while `USER_CONS_COLUMNS` provides it is a classic OCA 1Z0-071 exam point.
</details>

---
