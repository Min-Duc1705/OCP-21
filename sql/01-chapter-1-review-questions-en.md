# Review Questions - Chapter 1: Overview of Oracle Database and SQL

> **Reference:** *OCA/OCP Oracle Database SQL Study Guide (Exam 1Z0-071)*.  
> **Total Questions:** 25 multiple-choice questions matching the Oracle SQL certification exam format with detailed explanations.  
> **How to study:** Read each question and select your answer first, then click **"👉 View Answer & Detailed Explanation"** to verify your choice and master the exam traps.

---

### Question 1
**In a Relational Database Management System (RDBMS) and SQL, which capability of the `SELECT` statement allows you to restrict which columns are returned from a table?**

* A. Selection
* B. Projection
* C. Joining
* D. Intersection

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In relational algebra and Oracle 1Z0-071 terminology, **Projection** is the capability of choosing a subset of **columns** from a table by listing them in the `SELECT` clause.
  * **A is incorrect:** **Selection** restricts the **rows** returned from a table using the `WHERE` clause. Do not confuse the keyword `SELECT` with the relational operation *Selection*.
  * **C is incorrect:** **Joining** brings together data stored in different tables by specifying a link between common columns.
  * **D is incorrect:** **Intersection** (`INTERSECT`) is a set operator that returns common rows from two separate queries.
</details>

---

### Question 2
**Which statement accurately describes the relationship between a User and a Schema in an Oracle Database?**

* A. A single User can create and own multiple independent Schemas within the same Oracle Database.
* B. A single Schema can be jointly owned by multiple database Users at the same time.
* C. Each User is associated with exactly one Schema that has the same name as the User and contains all database objects owned by that User.
* D. A Schema is a physical storage file on disk equivalent to an Oracle Datafile.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In Oracle Database architecture, a **User** is the account used to connect to the database, and a **Schema** is the collection of database objects (Tables, Views, Indexes, Sequences, Procedures, etc.) owned by that User. There is a strict **1-to-1 relationship** between a User and a Schema, and they share the exact same name.
  * **A, B are incorrect:** Unlike PostgreSQL or SQL Server, an Oracle user cannot create multiple schemas under their own account, nor can multiple users co-own a single schema.
  * **D is incorrect:** Logical storage is a **Tablespace** and physical storage is a **Datafile**, not a Schema.
</details>

---

### Question 3
**Examine the following `CREATE TABLE` statement executed in an Oracle Database. Which statement is true regarding the constraints on the `EMPLOYEES` table?**

```sql
CREATE TABLE employees (
    emp_id      NUMBER(6)    PRIMARY KEY,
    email       VARCHAR2(50) UNIQUE,
    dept_id     NUMBER(4)    REFERENCES departments(dept_id)
);
```

* A. The `email` column cannot contain any `NULL` values because it has a `UNIQUE` constraint.
* B. The `dept_id` column must be non-null in every row because it is a `FOREIGN KEY`.
* C. The `emp_id` column cannot contain `NULL` values and cannot contain duplicate values across rows.
* D. An Oracle table can have up to two `PRIMARY KEY` constraints if one is used internally and one is used for foreign key references.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** A `PRIMARY KEY` constraint enforces entity integrity and combines the rules of `UNIQUE` and `NOT NULL`. Therefore, `emp_id` can never be `NULL` and can never have duplicate values.
  * **A is incorrect:** In Oracle, a `UNIQUE` constraint prevents duplicate non-null values, but **allows multiple `NULL` values** unless the column also has a `NOT NULL` constraint.
  * **B is incorrect:** A `FOREIGN KEY` (`REFERENCES`) column **allows `NULL` values** unless a `NOT NULL` constraint is explicitly added.
  * **D is incorrect:** A table can have **at most one `PRIMARY KEY`** (even though that single primary key may be a composite key spanning multiple columns).
</details>

---

### Question 4
**Suppose the parent table `DEPARTMENTS` has a row with `dept_id = 10` and the child table `EMPLOYEES` has 5 employees with `dept_id = 10` (the foreign key constraint was created with default behavior, without an `ON DELETE` clause). What happens when you execute the following statement?**

```sql
DELETE FROM departments WHERE dept_id = 10;
```

* A. The statement deletes the row with `dept_id = 10` from `DEPARTMENTS` and automatically deletes the 5 matching employees from `EMPLOYEES`.
* B. The statement deletes the row with `dept_id = 10` from `DEPARTMENTS` and automatically sets `dept_id = NULL` for the 5 employees in `EMPLOYEES`.
* C. The statement fails with an integrity constraint violation error (`ORA-02292: child record found`) and no rows are deleted.
* D. The statement deletes the row from `DEPARTMENTS` and leaves `dept_id = 10` unchanged in `EMPLOYEES`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** By default (when neither `ON DELETE CASCADE` nor `ON DELETE SET NULL` is specified), a `FOREIGN KEY` constraint enforces the **Restrict (`NO ACTION`)** rule. As long as child rows exist that reference the parent row, Oracle prevents deleting the parent row and raises `ORA-02292: integrity constraint violated - child record found`.
  * **A is incorrect:** This only happens when `ON DELETE CASCADE` is defined on the foreign key.
  * **B is incorrect:** This only happens when `ON DELETE SET NULL` is defined on the foreign key.
  * **D is incorrect:** Oracle never leaves orphan child records when a foreign key is enabled and validated.
</details>

---

### Question 5
**Which of the following lists contains ONLY Data Definition Language (DDL) statements in Oracle SQL?**

* A. `CREATE`, `ALTER`, `DROP`, `TRUNCATE`, `RENAME`
* B. `CREATE`, `ALTER`, `DELETE`, `TRUNCATE`, `DROP`
* C. `INSERT`, `UPDATE`, `DELETE`, `MERGE`
* D. `CREATE`, `GRANT`, `REVOKE`, `COMMIT`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** **DDL (Data Definition Language)** statements include `CREATE`, `ALTER`, `DROP`, `TRUNCATE`, `RENAME`, and `COMMENT`. They modify object definitions in the Data Dictionary and always issue an **implicit `COMMIT`** before and after execution.
  * **B is incorrect:** `DELETE` is a **DML (Data Manipulation Language)** statement, not DDL.
  * **C is incorrect:** `INSERT`, `UPDATE`, `DELETE`, and `MERGE` are all **DML** statements.
  * **D is incorrect:** `GRANT` and `REVOKE` are **DCL (Data Control Language)** statements, while `COMMIT` is a **TCL (Transaction Control Language)** statement.
</details>

---

### Question 6
**What is the fundamental difference between `DELETE FROM emp;` and `TRUNCATE TABLE emp;` in an Oracle Database?**

* A. `TRUNCATE` is a DML statement that supports a `WHERE` clause, whereas `DELETE` is a DDL statement that does not support a `WHERE` clause.
* B. `DELETE` is a DML statement that can be undone with `ROLLBACK`, whereas `TRUNCATE` is a DDL statement that performs an implicit `COMMIT` and cannot be rolled back.
* C. `TRUNCATE` removes both the data and the table structure of `emp` from the Data Dictionary (equivalent to `DROP TABLE`).
* D. `DELETE` immediately deallocates physical storage space and resets the High Water Mark, whereas `TRUNCATE` does not.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `DELETE` is a **DML** operation that removes rows one by one, generates Undo data, and can be undone using `ROLLBACK` before a `COMMIT`. In contrast, `TRUNCATE TABLE` is a **DDL** operation that issues an implicit `COMMIT` immediately and cannot be rolled back.
  * **A is incorrect:** `DELETE` (DML) supports a `WHERE` clause; `TRUNCATE` (DDL) never accepts a `WHERE` clause.
  * **C is incorrect:** `TRUNCATE` removes all rows but preserves the table structure, columns, constraints, and indexes. `DROP TABLE` removes the structure.
  * **D is incorrect:** `TRUNCATE` resets the High Water Mark and deallocates space by default, whereas `DELETE` does not lower the High Water Mark.
</details>

---

### Question 7
**A developer executes the following sequence of SQL statements in a single session (assume the `PRODUCTS` table is initially empty and the `ORDERS` table ALREADY EXISTS in the schema):**

```sql
INSERT INTO products VALUES (1, 'Laptop', 1500);
INSERT INTO products VALUES (2, 'Mouse', 25);
CREATE TABLE orders (order_id NUMBER PRIMARY KEY);
ROLLBACK;
SELECT COUNT(*) FROM products;
```

**What value is returned by the `SELECT COUNT(*) FROM products;` statement at the end?**

* A. `0`
* B. `1`
* C. `2`
* D. An error occurs because the transaction remains locked after the failed `CREATE TABLE` statement.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct (`2`):** This is a classic Oracle 1Z0-071 exam trap:
    1. The two `INSERT` statements insert 2 rows into `PRODUCTS` within the active transaction.
    2. Next, `CREATE TABLE orders ...` is a **DDL** statement. Before executing any DDL statement, Oracle automatically issues an **implicit `COMMIT`** to end the current transaction.
    3. Even though `CREATE TABLE orders` fails with `ORA-00955: name is already used by an existing object` (because `ORDERS` already exists), the implicit `COMMIT` **before** the DDL statement has already permanently committed the two inserted rows!
    4. Consequently, the subsequent `ROLLBACK;` has nothing to undo, and `SELECT COUNT(*) FROM products;` returns **`2`**.
  * **A, B, D are incorrect:** Remember that Oracle issues an implicit `COMMIT` both before and after any DDL statement, even if the DDL statement itself fails.
</details>

---

### Question 8
**Which statement is TRUE regarding the `DUAL` table in an Oracle Database?**

* A. The `DUAL` table is owned by the `HR` schema and contains 2 columns used for testing table joins.
* B. The `DUAL` table is owned by the `SYS` schema, consists of a single column named `DUMMY` of type `VARCHAR2(1)`, and contains a single row with the value `'X'`.
* C. Only administrative users (`SYS` or `SYSTEM`) have privileges to query the `DUAL` table.
* D. The `DUAL` table is a temporary in-memory table created only when a user opens Oracle SQL Developer.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `DUAL` is a real dictionary table owned by the **`SYS`** user, having **1 column named `DUMMY` (`VARCHAR2(1)`)** and **1 row with the value `'X'`**.
  * **A is incorrect:** It is owned by `SYS` (not `HR`) and has only 1 column and 1 row.
  * **C is incorrect:** A **Public Synonym** named `DUAL` points to `SYS.DUAL` and `SELECT` privilege is granted to `PUBLIC`, so every database user can query `DUAL`.
  * **D is incorrect:** `DUAL` is a permanent table stored in the database.
</details>

---

### Question 9
**Suppose the `DEPARTMENTS` table currently contains exactly 27 rows. How many rows will the following query return?**

```sql
SELECT 'Hello Oracle!' AS greeting
FROM departments;
```

* A. `1` row
* B. `0` rows
* C. `27` rows
* D. A syntax error occurs because the `SELECT` list does not reference any column from the `DEPARTMENTS` table.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct (`27` rows):** When you select a literal constant from a table without a `WHERE` clause or `DISTINCT`, Oracle evaluates the `SELECT` list once for **each row** in the source table. Because `DEPARTMENTS` has 27 rows, `'Hello Oracle!'` is returned **27 times** (27 rows).
  * **A is incorrect:** It would only return 1 row if queried `FROM dual` or with `SELECT DISTINCT 'Hello Oracle!' FROM departments;`.
  * **B, D are incorrect:** Selecting a constant literal without referencing table columns is completely valid SQL.
</details>

---

### Question 10
**Which of the following identifiers is VALID for naming a table in an Oracle Database WITHOUT enclosing it in double quotation marks `"..."`?**

* A. `2026_SALES_DATA`
* B. `EMP_SAL#_$1`
* C. `DEPT-HISTORY`
* D. `TABLE`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct (`EMP_SAL#_$1`):** Under Oracle's naming rules for unquoted identifiers:
    1. It must begin with a letter (`E`).
    2. It can only contain letters, digits (`1`), and three special characters: underscore (`_`), hash (`#`), and dollar sign (`$`).
  * **A is incorrect:** An unquoted identifier cannot start with a digit (`2`).
  * **C is incorrect:** A hyphen/minus sign (`-`) is not allowed in unquoted identifiers.
  * **D is incorrect:** `TABLE` is an Oracle SQL reserved word and cannot be used as an unquoted identifier.
</details>

---

### Question 11
**A table is created using double quotation marks in the following DDL statement:**

```sql
CREATE TABLE "Emp_Info" (
    emp_id NUMBER PRIMARY KEY,
    emp_name VARCHAR2(50)
);
```

**Which `SELECT` statement will execute SUCCESSFULLY without raising `ORA-00942: table or view does not exist`?**

* A. `SELECT * FROM emp_info;`
* B. `SELECT * FROM EMP_INFO;`
* C. `SELECT * FROM "EMP_INFO";`
* D. `SELECT * FROM "Emp_Info";`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** Because the table was created using a quoted mixed-case identifier `"Emp_Info"`, Oracle stores the exact case-sensitive name `Emp_Info` in the Data Dictionary instead of converting it to uppercase. Consequently, every subsequent query referencing this table **must enclose the name in double quotation marks with the exact same case**: `"Emp_Info"`.
  * **A, B are incorrect:** Without double quotes, Oracle converts both `emp_info` and `EMP_INFO` to uppercase `EMP_INFO`, which does not match `Emp_Info` in the Data Dictionary.
  * **C is incorrect:** `"EMP_INFO"` does not match the lowercase letters in `"Emp_Info"`.
</details>

---

### Question 12
**Which of the following is a client-side SQL\*Plus command rather than a standard SQL statement?**

* A. `SELECT`
* B. `DESCRIBE`
* C. `MERGE`
* D. `RENAME`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `DESCRIBE` (which can be abbreviated as `DESC`) is a **SQL\*Plus command** (also supported in SQL Developer and SQLcl) used to display column definitions of a table or view. SQL\*Plus commands can be abbreviated, are not stored in the SQL Buffer, and do not require a terminating semicolon `;`.
  * **A, C, D are incorrect:** `SELECT` (DQL), `MERGE` (DML), and `RENAME` (DDL) are standard SQL statements executed by the Oracle Database Server and stored in the SQL Buffer.
</details>

---

### Question 13
**Examine the following SQL query. What happens when it is executed in an Oracle Database?**

```sql
SELECT employee_id, first_name, salary
FROM employees
WHERE first_name = "Steven";
```

* A. It returns all employees whose first name is `Steven`.
* B. It returns 0 rows without error because no column named `"Steven"` exists.
* C. It fails with `ORA-00904: "Steven": invalid identifier` because the character literal is enclosed in double quotation marks instead of single quotation marks.
* D. It fails with a syntax error because the `WHERE` clause does not support the `=` operator with character strings.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In Oracle SQL:
    * Character and date literals must be enclosed in **single quotation marks** (`'Steven'`).
    * Double quotation marks (`"Steven"`) denote an **identifier** (such as a column name). Because the `EMPLOYEES` table has no column named `"Steven"`, Oracle raises `ORA-00904: "Steven": invalid identifier`.
  * **A, B, D are incorrect:** Confusing `"..."` (identifiers) with `'...'` (string literals) is a frequent exam trap.
</details>

---

### Question 14
**To which category of SQL statements do `GRANT` and `REVOKE` belong?**

* A. DDL (Data Definition Language)
* B. DML (Data Manipulation Language)
* C. TCL (Transaction Control Language)
* D. DCL (Data Control Language)

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** **DCL (Data Control Language)** manages security and access permissions in the database and consists of `GRANT` (assigning privileges/roles) and `REVOKE` (removing privileges/roles).
  * **A, B, C are incorrect:** DDL defines structures (`CREATE`, `ALTER`, `DROP`), DML manipulates data (`INSERT`, `UPDATE`, `DELETE`, `MERGE`), and TCL manages transactions (`COMMIT`, `ROLLBACK`, `SAVEPOINT`).
</details>

---

### Question 15
**When you define a `PRIMARY KEY` constraint on the `EMPLOYEE_ID` column of a brand-new `EMPLOYEES` table (which has no existing indexes), what action does Oracle Database automatically perform behind the scenes?**

* A. It automatically creates a `SEQUENCE` to generate numbers for `EMPLOYEE_ID`.
* B. It automatically creates a `UNIQUE INDEX` on the `EMPLOYEE_ID` column.
* C. It automatically creates a `BITMAP INDEX` on all columns of the `EMPLOYEES` table.
* D. It automatically creates a `TRIGGER` to check for duplicate values before every `INSERT`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** To enforce uniqueness efficiently without performing a Full Table Scan on every insert, Oracle automatically creates a **B-Tree Unique Index** on the `PRIMARY KEY` (or `UNIQUE`) column(s) if an index does not already exist on those columns.
  * **A is incorrect:** A primary key does not auto-generate numbers unless you use a `SEQUENCE` or declare the column as `GENERATED AS IDENTITY`.
  * **C, D are incorrect:** Oracle uses a B-Tree index, not a bitmap index or trigger, to enforce a primary key.
</details>

---

### Question 16
**In the SQL\*Plus command-line utility, which character placed alone on a new line instructs SQL\*Plus to execute the SQL statement currently stored in the SQL Buffer?**

* A. A semicolon `;`
* B. A forward slash `/`
* C. A backslash `\`
* D. Two hyphens `--`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In SQL\*Plus (and SQL Developer's Script Runner), a forward slash `/` placed on its own line executes the SQL statement or PL/SQL block currently held in the **SQL Buffer**.
  * **A is incorrect:** A semicolon `;` terminates and executes a SQL statement as you type it, rather than re-running the SQL Buffer on a standalone line after blank lines or PL/SQL blocks.
  * **C is incorrect:** A backslash `\` is not a SQL Buffer execution command.
  * **D is incorrect:** Two hyphens `--` start a single-line comment.
</details>

---

### Question 17
**Which of the following comment syntaxes are VALID inside an Oracle SQL statement? (Choose all that apply.)**

* A. Using `--` at the beginning of the comment text for a single-line comment.
* B. Using `/* ... */` to enclose single-line or multi-line comments.
* C. Using `//` at the beginning of the comment text as in Java/C++.
* D. Using `#` at the beginning of the comment line as in Python/MySQL.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, B**
* **Detailed Explanation:**
  * **A and B are correct:** Standard ANSI SQL and Oracle SQL support two comment formats inside SQL statements:
    1. `-- Single-line comment` (from `--` to the end of the line).
    2. `/* Multi-line or inline comment */`.
  * **C is incorrect:** `//` is Java/C++ comment syntax and causes a syntax error in Oracle SQL.
  * **D is incorrect:** `#` is not a comment character in Oracle SQL (in fact, `#` is a valid character inside unquoted Oracle identifiers).
</details>

---

### Question 18
**To which SQL category does the `MERGE` statement belong, and what is its primary purpose?**

* A. DDL; used to merge the physical structures of two tables into a single table.
* B. DML; used to conditionally `INSERT`, `UPDATE` (and optionally `DELETE`) rows in a target table based on matching rows from a source table (an *UPSERT* operation).
* C. TCL; used to combine two independent transactions into a single transaction.
* D. DCL; used to merge the privileges of two database users.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `MERGE` is a **DML (Data Manipulation Language)** statement (commonly called an **UPSERT**). It compares a target table with a source table/query: if a match is found (`WHEN MATCHED`), it performs an `UPDATE` (with an optional `DELETE WHERE`); if no match is found (`WHEN NOT MATCHED`), it performs an `INSERT`. Like all DML statements, its changes require a `COMMIT` to become permanent.
  * **A, C, D are incorrect:** `MERGE` manipulates row data in the target table; it does not merge table structures, transactions, or user privileges.
</details>

---

### Question 19
**When you execute `DESCRIBE employees` in Oracle SQL Developer or SQL\*Plus, which information is displayed in the output?**

* A. Column names, whether each column is `NOT NULL`, and the data type (with precision/length) of each column.
* B. Column names, all rows of data in the table, and a list of indexes on the table.
* C. Column names, `DEFAULT` values, and the exact `CHECK` constraint expressions for each column.
* D. The physical disk space (in Megabytes) currently consumed by the `EMPLOYEES` table.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** The `DESCRIBE` (`DESC`) command outputs 3 columns describing the table or view structure:
    1. `Name`: The column name.
    2. `Null?`: Displays `NOT NULL` if the column disallows nulls (or blank if nulls are allowed).
    3. `Type`: The data type and size/precision (e.g., `NUMBER(6)`, `VARCHAR2(25)`).
  * **B, C, D are incorrect:** `DESCRIBE` does not display row data, indexes, `CHECK` constraint conditions, or disk space usage.
</details>

---

### Question 20
**In an Oracle Database (Exam 1Z0-071 versions: 12c / 19c / 21c), what happens when you execute the following SQL statement?**

```sql
SELECT 25 * 4 AS result;
```

* A. It returns 1 row and 1 column named `RESULT` with the value `100`.
* B. It returns 1 row and 1 column named `25*4` with the value `100`.
* C. It fails with `ORA-00923: FROM keyword not found where expected` because the `FROM` clause is missing.
* D. It returns `NULL` because no source table is specified.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In Oracle SQL (12c, 19c, 21c covered by Exam 1Z0-071), every `SELECT` statement **must include both a `SELECT` clause and a `FROM` clause**. Omitting `FROM` raises `ORA-00923: FROM keyword not found where expected`. To evaluate a standalone expression, you must query `FROM dual`: `SELECT 25 * 4 AS result FROM dual;`.
  * **A, B, D are incorrect:** Always check that every `SELECT` statement on the 1Z0-071 exam has a `FROM` clause.
</details>

---

### Question 21
**Suppose the `EMPLOYEES` table contains the following 3 rows:**

| EMPLOYEE_ID | FIRST_NAME | LAST_NAME | JOB_ID |
| :---: | :--- | :--- | :--- |
| 100 | Steven | King | AD_PRES |
| 101 | Neena | Kochhar | AD_VP |
| 102 | Lex | De Haan | AD_VP |

**How many rows will be returned when the following query is executed?**

```sql
select employee_id, first_name, last_name
from EMPLOYEES
where job_id = 'ad_vp';
```

* A. `2` rows (`employee_id` 101 and 102)
* B. `0` rows (no rows selected, no error)
* C. A syntax error occurs because the keywords `select`, `from`, and `where` are written in lowercase.
* D. An error occurs because the table name `EMPLOYEES` is uppercase while the column names are lowercase.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct (`0` rows):**
    * SQL keywords (`select`, `from`, `where`) and unquoted table/column names (`EMPLOYEES`, `job_id`) are **case-insensitive**, so the query is syntactically valid.
    * However, **character string literals enclosed in single quotes (`'ad_vp'`) are strictly case-sensitive**! Because the table stores `'AD_VP'` in uppercase and the query filters for `'ad_vp'` in lowercase, no rows match and **0 rows** are returned.
  * **A, C, D are incorrect:** Distinguishing case-insensitive SQL identifiers from case-sensitive string literals is a classic exam question.
</details>

---

### Question 22
**Regarding indexing and locking behavior in Oracle Database, which statement is TRUE when comparing `PRIMARY KEY` and `FOREIGN KEY` constraints?**

* A. Oracle automatically creates an index for both `PRIMARY KEY` and `FOREIGN KEY` constraints upon creation.
* B. Oracle automatically creates an index for `FOREIGN KEY` constraints, but not for `PRIMARY KEY` constraints.
* C. Oracle automatically creates a Unique Index for a `PRIMARY KEY` (if the column is not already indexed), but does NOT automatically create an index for a `FOREIGN KEY` column.
* D. Oracle never automatically creates an index for any constraint; developers must always run `CREATE INDEX` manually.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** When you define a `PRIMARY KEY` or `UNIQUE` constraint, Oracle automatically creates a B-Tree Unique Index on the column(s) if none exists. Conversely, defining a **`FOREIGN KEY`** constraint **does NOT automatically create an index** on the foreign key column in the child table.
  * **A, B, D are incorrect:** Unindexed foreign keys are a well-known cause of slow joins and child table locks when parent primary keys are deleted or updated.
</details>

---

### Question 23
**Which schema object in Oracle Database is specifically designed to generate unique, sequential integers (typically used to populate primary key columns) and can be shared across multiple tables?**

* A. `SYNONYM`
* B. `SEQUENCE`
* C. `VIEW`
* D. `INDEX`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** A **`SEQUENCE`** is an independent schema object that generates unique sequential numbers accessed via the `NEXTVAL` and `CURRVAL` pseudocolumns.
  * **A is incorrect:** A `SYNONYM` is an alias for another database object.
  * **C is incorrect:** A `VIEW` is a stored `SELECT` query acting as a virtual table.
  * **D is incorrect:** An `INDEX` is a structure used to speed up row retrieval.
</details>

---

### Question 24
**A developer wants to create a temporary marker inside a long transaction so that subsequent DML statements can be rolled back to that marker without losing earlier DML changes in the same transaction. Which TCL statement creates this marker?**

* A. `COMMIT WORK`
* B. `CHECKPOINT`
* C. `SAVEPOINT`
* D. `SET TRANSACTION`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** The `SAVEPOINT <savepoint_name>;` **TCL (Transaction Control Language)** statement creates an intermediate marker within a transaction. You can then execute `ROLLBACK TO [SAVEPOINT] <savepoint_name>;` to undo only the DML changes made after that marker while keeping prior DML changes intact.
  * **A is incorrect:** `COMMIT WORK` (equivalent to `COMMIT`) permanently saves the entire transaction.
  * **B is incorrect:** `CHECKPOINT` is a database background event where DBWn writes dirty buffers to disk, not a transaction marker for DML rollback.
  * **D is incorrect:** `SET TRANSACTION` configures transaction properties (such as `READ ONLY` or isolation level) at the start of a transaction.
</details>

---

### Question 25
**The `EMPLOYEES` table has a Check Constraint on the salary column defined as: `CONSTRAINT emp_sal_ck CHECK (salary >= 5000)`. Assuming the `salary` column does NOT have a `NOT NULL` constraint, which of the following `INSERT` statements will execute SUCCESSFULLY? (Choose all that apply.)**

* A. `INSERT INTO employees (employee_id, last_name, salary) VALUES (201, 'Nguyen', 5000);`
* B. `INSERT INTO employees (employee_id, last_name, salary) VALUES (202, 'Tran', 4999);`
* C. `INSERT INTO employees (employee_id, last_name, salary) VALUES (203, 'Le', NULL);`
* D. `INSERT INTO employees (employee_id, last_name, salary) VALUES (204, 'Pham', 0);`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, C**
* **Detailed Explanation:**
  * **A is correct:** With `salary = 5000`, the condition `5000 >= 5000` evaluates to `TRUE`, satisfying the `CHECK` constraint.
  * **C is correct (Classic Exam Trap):** In Oracle Database, a `CHECK (<condition>)` constraint only rejects a row when `<condition>` evaluates to **`FALSE`**. When `salary` is `NULL`, the condition `NULL >= 5000` evaluates to **`UNKNOWN`** (not `FALSE`!). Therefore, a `NULL` value **passes the `CHECK` constraint** unless a `NOT NULL` constraint is also present.
  * **B and D are incorrect:** Both `4999` and `0` cause `salary >= 5000` to evaluate to `FALSE`, raising `ORA-02290: check constraint (EMP_SAL_CK) violated`.
</details>
