# Review Questions - Chapter 22: Cursors in PL/SQL

> **Reference:** *OCP Oracle Database Program with PL/SQL Study Guide (Exam 1Z0-149)*  
> **Total Questions:** 25 multiple-choice questions aligned with the Oracle OCP 1Z0-149 exam, complete with detailed explanations.  
> **How to study:** Read each question carefully and choose your answer first, then click **"👉 View Answer & Detailed Explanation"** to verify your answer and review the exam traps.

---

### Question 1
**Which statement is TRUE regarding the `SQL%ISOPEN` attribute of an implicit cursor in PL/SQL?**

* A. It returns `TRUE` if the most recently executed DML statement affected at least one row.
* B. It always returns `FALSE` at any point inside a PL/SQL block because Oracle automatically opens and closes the implicit cursor during SQL statement execution.
* C. It returns `NULL` before the first DML statement is executed in the session.
* D. It raises `ORA-01001: invalid cursor` if evaluated after a `SELECT ... INTO` statement completes.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** For the implicit cursor (`SQL`), the PL/SQL engine automatically opens the cursor when the SQL statement starts and automatically closes it before returning control to the next PL/SQL statement. Therefore, evaluating `SQL%ISOPEN` anywhere in PL/SQL always yields `FALSE`.
  * **A is incorrect:** That describes `SQL%FOUND`, not `SQL%ISOPEN`.
  * **C is incorrect:** `SQL%FOUND`, `SQL%NOTFOUND`, and `SQL%ROWCOUNT` return `NULL` before any SQL statement is run, whereas `SQL%ISOPEN` always returns `FALSE`.
  * **D is incorrect:** The `%ISOPEN` attribute never raises `ORA-01001: invalid cursor`.
</details>

---

### Question 2
**Assume the `EMPLOYEES` table contains no row with `employee_id = 9999`. What is the result of executing the following PL/SQL block?**

```sql
DECLARE
    v_sal employees.salary%TYPE;
BEGIN
    SELECT salary INTO v_sal
    FROM employees
    WHERE employee_id = 9999;

    IF SQL%NOTFOUND THEN
        DBMS_OUTPUT.PUT_LINE('Employee not found!');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Salary: ' || v_sal);
    END IF;
END;
```

* A. It displays `'Employee not found!'`.
* B. It displays `'Salary: '`.
* C. The block fails with an unhandled `NO_DATA_FOUND` (`ORA-01403`) exception, and the `IF SQL%NOTFOUND` statement is never reached.
* D. The block fails with an unhandled `INVALID_CURSOR` (`ORA-01001`) exception.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** When an implicit `SELECT ... INTO` statement returns zero rows, the PL/SQL engine immediately raises the predefined `NO_DATA_FOUND` (`ORA-01403`) exception at the `SELECT` statement and transfers control to the `EXCEPTION` section. Consequently, `IF SQL%NOTFOUND` is never executed.
  * **A, B, D are incorrect:** To check `%NOTFOUND` without raising `NO_DATA_FOUND`, you must use an explicit cursor (`OPEN` -> `FETCH` -> `IF cur%NOTFOUND`) or handle `WHEN NO_DATA_FOUND THEN`.
</details>

---

### Question 3
**Assume the `DEPARTMENTS` table has exactly 3 rows with `location_id = 1700`, and their department names are `'Admin'`, `'IT'`, and `'Sales'`. What is the output of the following PL/SQL block?**

```sql
DECLARE
    CURSOR c_dept IS
        SELECT department_name FROM departments WHERE location_id = 1700 ORDER BY 1;
    v_name departments.department_name%TYPE;
BEGIN
    OPEN c_dept;
    LOOP
        FETCH c_dept INTO v_name;
        DBMS_OUTPUT.PUT_LINE(v_name);
        EXIT WHEN c_dept%NOTFOUND;
    END LOOP;
    CLOSE c_dept;
END;
```

* A. It prints 3 lines: `Admin`, `IT`, `Sales`.
* B. It prints 4 lines: `Admin`, `IT`, `Sales`, and a `NULL` line.
* C. It prints 4 lines: `Admin`, `IT`, `Sales`, `Sales`.
* D. It enters an infinite loop because `c_dept%NOTFOUND` never evaluates to `TRUE`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** This is a classic OCP exam trap regarding the placement of `EXIT WHEN c_dept%NOTFOUND`:
    * Iterations 1, 2, and 3 fetch and print `Admin`, `IT`, and `Sales`.
    * On iteration 4, `FETCH c_dept INTO v_name;` finds no more rows and sets `c_dept%NOTFOUND := TRUE`, but **does NOT overwrite `v_name` with `NULL`**—it retains its previous value (`'Sales'`).
    * Because `DBMS_OUTPUT.PUT_LINE(v_name);` is placed **before** `EXIT WHEN c_dept%NOTFOUND;`, `'Sales'` is printed a second time before the loop exits.
  * **A, B, D are incorrect:** `EXIT WHEN c_dept%NOTFOUND;` must be placed immediately after `FETCH`.
</details>

---

### Question 4
**Assume the `EMPLOYEES` table contains 107 rows. What is the result of executing the following PL/SQL block?**

```sql
DECLARE
    CURSOR c_emp IS SELECT first_name FROM employees;
    v_name employees.first_name%TYPE;
BEGIN
    OPEN c_emp;
    WHILE c_emp%FOUND LOOP
        FETCH c_emp INTO v_name;
        DBMS_OUTPUT.PUT_LINE(v_name);
    END LOOP;
    CLOSE c_emp;
END;
```

* A. It prints the first names of all 107 employees.
* B. It prints nothing because immediately after `OPEN c_emp`, the `c_emp%FOUND` attribute evaluates to `NULL`.
* C. It enters an infinite loop printing the last employee's name.
* D. It raises `ORA-01001: invalid cursor` at `WHILE c_emp%FOUND LOOP`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Immediately after `OPEN c_emp;` and before the first `FETCH` is executed, both `c_emp%FOUND` and `c_emp%NOTFOUND` are **`NULL`**. Because `WHILE c_emp%FOUND` evaluates to `NULL` (not `TRUE`), the `WHILE` loop body is never entered.
  * **A, C, D are incorrect:** To use `WHILE c_emp%FOUND LOOP`, you must perform an initial `FETCH` before the `WHILE` loop and another `FETCH` at the bottom of the loop body.
</details>

---

### Question 5
**What is the value of `c_emp%ROWCOUNT` immediately after executing `OPEN c_emp;` (before any `FETCH` statement has been executed)?**

* A. `NULL`
* B. `0`
* C. The total number of rows in the active set of the `SELECT` query.
* D. It raises `ORA-01001: invalid cursor`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** According to the explicit cursor attribute state matrix:
    * Before `OPEN`: `%ROWCOUNT` raises `ORA-01001: invalid cursor`.
    * Immediately after `OPEN` (before the first `FETCH`): `%FOUND` is `NULL`, `%NOTFOUND` is `NULL`, and **`%ROWCOUNT` is `0`**.
    * After each successful single-row `FETCH`: `%ROWCOUNT` increments by `1`.
  * **A, C, D are incorrect:** `%ROWCOUNT` tracks the number of rows **fetched so far**, not the total count of the query, and is initialized to `0` upon opening the cursor.
</details>

---

### Question 6
**What happens when you attempt to compile and execute the following PL/SQL block?**

```sql
DECLARE
    CURSOR c_emp IS SELECT employee_id, salary * 12 FROM employees;
    v_rec c_emp%ROWTYPE;
BEGIN
    OPEN c_emp;
    FETCH c_emp INTO v_rec;
    CLOSE c_emp;
END;
```

* A. It executes successfully and fetches the first row into `v_rec`.
* B. It fails to compile because the calculated expression `salary * 12` in the cursor's `SELECT` list does not have a column alias when referenced by `%ROWTYPE`.
* C. It fails at runtime with `ORA-06502: PL/SQL: numeric or value error`.
* D. It fails to compile because `%ROWTYPE` can only reference a database table, not an explicit cursor.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** When declaring a record variable anchored to a cursor (`v_rec c_emp%ROWTYPE`), PL/SQL uses the column names in the cursor's `SELECT` list as the record's field names. Because `salary * 12` is an expression without a column alias, compilation fails with `PLS-00402: alias required in SELECT list of cursor to avoid duplicate column names`. You must specify an alias such as `SELECT employee_id, salary * 12 AS annual_sal`.
  * **A, C, D are incorrect:** `%ROWTYPE` is valid for tables, views, and explicit cursors as long as expressions have column aliases.
</details>

---

### Question 7
**Examine the following PL/SQL block. What is the result of its execution?**

```sql
DECLARE
    CURSOR c_dept IS SELECT department_id, department_name FROM departments;
BEGIN
    FOR r_dept IN c_dept LOOP
        NULL;
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Total departments: ' || c_dept%ROWCOUNT);
END;
```

* A. It prints the total number of rows in the `DEPARTMENTS` table.
* B. It prints `Total departments: 0`.
* C. It raises a runtime exception `ORA-01001: invalid cursor` at the `DBMS_OUTPUT.PUT_LINE` statement.
* D. It fails to compile because `NULL;` is not allowed inside a `Cursor FOR Loop`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** A `Cursor FOR Loop` (`FOR r_dept IN c_dept LOOP ... END LOOP;`) **automatically closes `c_dept`** as soon as the loop terminates at `END LOOP;`. Once a cursor is closed, referencing `%ROWCOUNT`, `%FOUND`, or `%NOTFOUND` raises **`INVALID_CURSOR` (`ORA-01001`)**.
  * **A, B, D are incorrect:** Only `c_dept%ISOPEN` can be safely referenced after `END LOOP;` (returning `FALSE`).
</details>

---

### Question 8
**Which two statements are TRUE regarding a `Cursor FOR Loop` in PL/SQL? (Choose two.)**

* A. The loop record variable must be explicitly declared in the `DECLARE` section using `%ROWTYPE`.
* B. The loop record variable is implicitly declared by PL/SQL and is scoped locally to the `FOR ... END LOOP` body.
* C. If an exception is raised inside the `Cursor FOR Loop` body and control transfers to the `EXCEPTION` section, the cursor is still automatically closed by the PL/SQL engine.
* D. You must explicitly issue `CLOSE cursor_name;` after `END LOOP;` to prevent memory leaks (`ORA-01000`).

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B, C**
* **Detailed Explanation:**
  * **B is correct:** In `FOR r_emp IN c_emp LOOP`, the record variable `r_emp` is implicitly declared as `c_emp%ROWTYPE` and exists only inside the loop body.
  * **C is correct:** Whether a `Cursor FOR Loop` completes normally or exits abruptly via `EXIT`, `RETURN`, `GOTO`, or an unhandled exception, the PL/SQL engine guarantees that the cursor is automatically closed.
  * **A is incorrect:** No explicit declaration of `r_emp` is needed in `DECLARE`.
  * **D is incorrect:** Issuing `CLOSE` after `END LOOP` causes `ORA-01001: invalid cursor` because the cursor is already closed.
</details>

---

### Question 9
**Which two parameterized cursor declarations are VALID in PL/SQL? (Choose two.)**

* A. `CURSOR c_emp (p_dept IN NUMBER(4), p_sal VARCHAR2(20)) IS SELECT * FROM employees WHERE department_id = p_dept;`
* B. `CURSOR c_emp (p_dept NUMBER DEFAULT 10, p_sal IN NUMBER := 5000) IS SELECT * FROM employees WHERE department_id = p_dept AND salary > p_sal;`
* C. `CURSOR c_emp (p_dept IN NUMBER, p_count OUT NUMBER) IS SELECT * FROM employees WHERE department_id = p_dept;`
* D. `CURSOR c_emp (p_dept employees.department_id%TYPE, p_job VARCHAR2) IS SELECT * FROM employees WHERE department_id = p_dept AND job_id = p_job;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B, D**
* **Detailed Explanation:**
  * **B and D are correct:** Cursor parameters use unconstrained data types (`NUMBER`, `VARCHAR2`) or anchored types (`%TYPE`), default to `IN` mode, and support default values using either `DEFAULT` or `:=`.
  * **A is incorrect:** Formal parameters of a cursor **cannot have length or precision constraints** such as `NUMBER(4)` or `VARCHAR2(20)` (`PLS-00103`).
  * **C is incorrect:** Cursor parameters can only be `IN` parameters; `OUT` and `IN OUT` modes are not allowed.
</details>

---

### Question 10
**Examine the following PL/SQL block. Why does it fail at runtime?**

```sql
DECLARE
    CURSOR c_emp IS SELECT employee_id, first_name FROM employees;
    v_rec c_emp%ROWTYPE;
BEGIN
    OPEN c_emp;
    FOR r IN c_emp LOOP
        DBMS_OUTPUT.PUT_LINE(r.first_name);
    END LOOP;
    CLOSE c_emp;
END;
```

* A. It fails to compile because `v_rec` is declared but never used.
* B. It raises the runtime exception `ORA-06511: PL/SQL: cursor already open` at `FOR r IN c_emp LOOP`.
* C. It raises the runtime exception `ORA-01001: invalid cursor` at `OPEN c_emp;`.
* D. It executes successfully without error.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The cursor `c_emp` is explicitly opened by `OPEN c_emp;`. Immediately afterward, `FOR r IN c_emp LOOP` attempts to **automatically open `c_emp` again**, which raises **`CURSOR_ALREADY_OPEN` (`ORA-06511: PL/SQL: cursor already open`)**.
  * **A, C, D are incorrect:** When using a `Cursor FOR Loop`, you must not manually `OPEN` or `CLOSE` the cursor.
</details>

---

### Question 11
**Examine the following PL/SQL block that references a local variable inside an explicit cursor query. Which value of `v_dept_id` is used to determine the cursor's active set?**

```sql
DECLARE
    v_dept_id NUMBER := 10;
    CURSOR c_emp IS
        SELECT first_name FROM employees WHERE department_id = v_dept_id;
    v_name employees.first_name%TYPE;
BEGIN
    v_dept_id := 20;
    OPEN c_emp;
    v_dept_id := 30;
    FETCH c_emp INTO v_name;
    CLOSE c_emp;
END;
```

* A. `10` (the value when `CURSOR c_emp` was declared).
* B. `20` (the value when `OPEN c_emp;` was executed).
* C. `30` (the value when `FETCH c_emp INTO v_name;` was executed).
* D. It fails to compile because local variables cannot be referenced inside a cursor declaration without formal parameters.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Variable binding and evaluation of the **Active Set** occur **at the exact moment `OPEN c_emp;` is executed**. At that point, `v_dept_id` equals `20`. Changing `v_dept_id` to `30` after `OPEN` has no effect on the already-opened cursor's active set.
  * **A, C, D are incorrect:** A cursor declaration only defines the query structure; variable values are bound at `OPEN` time.
</details>

---

### Question 12
**In a cursor query that joins the `EMPLOYEES e` and `DEPARTMENTS d` tables, how should you write the `FOR UPDATE` clause if you want to lock only the matching rows in `EMPLOYEES` without locking the corresponding rows in `DEPARTMENTS`?**

```sql
CURSOR c_emp_dept IS
    SELECT e.employee_id, e.salary, d.department_name
    FROM employees e JOIN departments d
      ON e.department_id = d.department_id
    WHERE e.department_id = 60
    /* INSERT CLAUSE HERE */;
```

* A. `FOR UPDATE;`
* B. `FOR UPDATE TABLE employees;`
* C. `FOR UPDATE OF e.salary;` (or any column belonging to the `employees` table).
* D. `FOR UPDATE ONLY employees;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** When a cursor joins multiple tables:
    * `FOR UPDATE` without `OF` locks matching rows across **all tables** in the `FROM` clause.
    * `FOR UPDATE OF column_name` locks rows **only in the table(s) containing the specified column(s)**. Because `e.salary` belongs to `employees`, only rows in `employees` are locked.
  * **A is incorrect:** Locks rows in both `employees` and `departments`.
  * **B, D are incorrect:** Invalid SQL syntax.
</details>

---

### Question 13
**What happens when the following PL/SQL block is executed (assuming department 50 has 45 employees)?**

```sql
DECLARE
    CURSOR c_sal IS
        SELECT employee_id, salary
        FROM employees
        WHERE department_id = 50
        FOR UPDATE;
BEGIN
    FOR r IN c_sal LOOP
        UPDATE employees
        SET salary = salary * 1.05
        WHERE CURRENT OF c_sal;
        
        COMMIT;
    END LOOP;
END;
```

* A. All 45 employees receive a 5% salary increase, committed one row at a time.
* B. The first row is updated and committed, but when the loop attempts to fetch the second row, it raises `ORA-01002: fetch out of sequence`.
* C. It fails to compile because `COMMIT` is not allowed inside a `FOR` loop.
* D. It raises `ORA-00054: resource busy` on the second row.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** When a `FOR UPDATE` cursor is opened, Oracle acquires exclusive row locks on the active set. Issuing a `COMMIT` or `ROLLBACK` inside the loop **releases all row locks and invalidates the `FOR UPDATE` cursor position**. When the next iteration attempts to `FETCH` from `c_sal`, Oracle immediately raises **`ORA-01002: fetch out of sequence`**.
  * **A, C, D are incorrect:** `COMMIT` must be placed **after** the `FOR UPDATE` cursor loop finishes.
</details>

---

### Question 14
**When an explicit cursor is declared with the `FOR UPDATE` clause, at what point are the qualifying rows locked?**

* A. When the cursor is declared in the `DECLARE` section.
* B. Immediately when the `OPEN cursor_name` statement is executed (before the first `FETCH`).
* C. One row at a time as each `FETCH` statement retrieves a row.
* D. Only when the `UPDATE ... WHERE CURRENT OF` statement is executed.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In Oracle, `SELECT ... FOR UPDATE` identifies the active set and **acquires exclusive row-level locks (`TX`) on all qualifying rows when the `OPEN` statement executes**.
  * **A, C, D are incorrect:** Locking happens all at once during `OPEN`, not incrementally during `FETCH`.
</details>

---

### Question 15
**What are the two key differences between a Strong `REF CURSOR` (restrictive) and a Weak `REF CURSOR` (non-restrictive / `SYS_REFCURSOR`)? (Choose two.)**

* A. A Strong `REF CURSOR` specifies a `RETURN` clause defining the row structure, whereas a Weak `REF CURSOR` has no `RETURN` clause.
* B. Only a Strong `REF CURSOR` can be passed as an `OUT` parameter to a Java JDBC client.
* C. Only a Weak `REF CURSOR` (such as `SYS_REFCURSOR`) can be opened with a dynamic SQL query string (`OPEN rc FOR v_sql_string`), whereas a Strong `REF CURSOR` cannot be used with dynamic SQL.
* D. A Weak `REF CURSOR` executes twice as fast as a Strong `REF CURSOR`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, C**
* **Detailed Explanation:**
  * **A is correct:** A Strong `REF CURSOR` includes a `RETURN` type (`TYPE t_rc IS REF CURSOR RETURN emp%ROWTYPE;`), enabling compile-time type checking. A Weak `REF CURSOR` omits `RETURN` (`TYPE t_rc IS REF CURSOR;` or `SYS_REFCURSOR`).
  * **C is correct:** Because dynamic SQL strings (`OPEN rc FOR 'SELECT ...'`) are parsed only at runtime, the compiler cannot verify the return type at compile time. Using a Strong `REF CURSOR` with a dynamic SQL string fails with **`PLS-00455: cursor '...' cannot be used in dynamic SQL OPEN statement`**.
  * **B, D are incorrect:** Both can be passed as `OUT` parameters, and their runtime performance is identical.
</details>

---

### Question 16
**What happens when the following PL/SQL block using `SYS_REFCURSOR` is executed?**

```sql
DECLARE
    v_rc   SYS_REFCURSOR;
    v_name VARCHAR2(100);
BEGIN
    OPEN v_rc FOR SELECT department_name FROM departments WHERE department_id = 10;
    FETCH v_rc INTO v_name;
    DBMS_OUTPUT.PUT_LINE('1: ' || v_name);

    OPEN v_rc FOR SELECT first_name FROM employees WHERE employee_id = 100;
    FETCH v_rc INTO v_name;
    DBMS_OUTPUT.PUT_LINE('2: ' || v_name);

    CLOSE v_rc;
END;
```

* A. It raises `ORA-06511: PL/SQL: cursor already open` at the second `OPEN v_rc FOR` statement because `CLOSE v_rc;` was not called after the first query.
* B. It fails to compile because a `SYS_REFCURSOR` variable cannot be opened for two different tables.
* C. It executes successfully and prints the department name for department 10 followed by the first name of employee 100 without error.
* D. It raises `ROWTYPE_MISMATCH` (`ORA-06504`).

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Unlike a static explicit cursor (which raises `ORA-06511: cursor already open` if opened again before closing), a **`REF CURSOR` variable can be reopened (`OPEN v_rc FOR ...`) for a new query without closing it first**. Oracle automatically closes the previous query work area and associates the cursor variable with the new query.
  * **A, B, D are incorrect:** Both queries return a single `VARCHAR2`-compatible column into `v_name`, so no `ROWTYPE_MISMATCH` occurs.
</details>

---

### Question 17
**Examine the following PL/SQL block that assigns one cursor variable to another. Assuming the `DEPARTMENTS` table has more than 10 rows, what is the output?**

```sql
DECLARE
    v_rc1  SYS_REFCURSOR;
    v_rc2  SYS_REFCURSOR;
    v_id   departments.department_id%TYPE;
BEGIN
    OPEN v_rc1 FOR SELECT department_id FROM departments ORDER BY 1;
    v_rc2 := v_rc1;

    FETCH v_rc1 INTO v_id;
    FETCH v_rc2 INTO v_id;

    CLOSE v_rc1;

    IF v_rc2%ISOPEN THEN
        DBMS_OUTPUT.PUT_LINE('RC2 is open, Rowcount = ' || v_rc2%ROWCOUNT);
    ELSE
        DBMS_OUTPUT.PUT_LINE('RC2 is closed!');
    END IF;
END;
```

* A. `RC2 is open, Rowcount = 1`
* B. `RC2 is open, Rowcount = 2`
* C. `RC2 is closed!`
* D. It fails to compile because the assignment operator `:=` cannot be used between two `SYS_REFCURSOR` variables.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** A `REF CURSOR` variable is a pointer to a context area. When `v_rc2 := v_rc1;` executes, both `v_rc1` and `v_rc2` **point to the exact same underlying context area**.
    * Fetching from `v_rc1` fetches row 1; fetching from `v_rc2` fetches row 2 (`%ROWCOUNT` becomes `2` for both).
    * When `CLOSE v_rc1;` is executed, the shared context area is closed. Therefore, `v_rc2%ISOPEN` immediately evaluates to **`FALSE`**, and `'RC2 is closed!'` is printed.
  * **A, B, D are incorrect:** Cursor variable assignment creates a pointer alias, not an independent copy.
</details>

---

### Question 18
**A developer writes the following stored procedure to return a result set of employees to a Java JDBC application. What happens when the Java application calls this procedure and attempts to read the `ResultSet`?**

```sql
CREATE OR REPLACE PROCEDURE get_emp_list (
    p_dept_id IN  NUMBER,
    p_rc      OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN p_rc FOR
        SELECT employee_id, first_name, salary
        FROM employees
        WHERE department_id = p_dept_id;
    CLOSE p_rc;
END;
```

* A. The Java application reads all employees in `p_dept_id` normally.
* B. The procedure fails to compile because a `SYS_REFCURSOR` parameter must be `IN OUT`, not `OUT`.
* C. The procedure compiles successfully, but when the Java client attempts to fetch from the `ResultSet`, it receives `ORA-01001: invalid cursor` (or `Cursor is closed`) because `CLOSE p_rc;` closed the cursor before returning it to the client.
* D. The Java client receives an empty `ResultSet` (0 rows) without error.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** When returning a `REF CURSOR` to a client application via an `OUT` parameter, the PL/SQL procedure must **only `OPEN` the cursor and leave it open**. The client application is responsible for fetching the rows and closing the `ResultSet`/cursor. Calling `CLOSE p_rc;` inside the procedure destroys the context area before the client can read it (`ORA-01001`).
  * **A, B, D are incorrect:** `OUT` is completely valid for `SYS_REFCURSOR` parameters.
</details>

---

### Question 19
**Which two actions are INVALID when working with `REF CURSOR` / `SYS_REFCURSOR` variables in PL/SQL? (Choose two.)**

* A. Iterating over a `REF CURSOR` variable directly using a `Cursor FOR Loop` (e.g., `FOR r IN v_ref_cursor LOOP ... END LOOP;`).
* B. Declaring a package-level variable of type `SYS_REFCURSOR` in a `PACKAGE SPECIFICATION` to persist the cursor across calls in a session.
* C. Passing a `SYS_REFCURSOR` variable as a parameter from one stored procedure to another.
* D. Using `BULK COLLECT INTO` when fetching from a `SYS_REFCURSOR` variable.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, B**
* **Detailed Explanation:**
  * **A is invalid (Correct):** A `Cursor FOR Loop` cannot be used with a `REF CURSOR` variable; you must use an explicit `LOOP ... FETCH v_rc INTO ... EXIT WHEN v_rc%NOTFOUND; END LOOP;`.
  * **B is invalid (Correct):** Cursor variables (`REF CURSOR`) **cannot be declared at the package level** (in a `PACKAGE SPECIFICATION` or global section of a `PACKAGE BODY`), which causes **`PLS-00994: Cursor Variables cannot be declared as part of a package`**. (You can declare a `TYPE ... IS REF CURSOR` in a package spec, but variables of that type must be local to subprograms).
  * **C and D are valid:** `REF CURSOR` variables can be passed between subprograms and used with `FETCH ... BULK COLLECT INTO`.
</details>

---

### Question 20
**When using a Weak `REF CURSOR` (`SYS_REFCURSOR`), what happens if the columns in the `OPEN v_rc FOR SELECT ...` query are incompatible in number or data type with the target variables in the `FETCH v_rc INTO ...` statement?**

* A. The compiler reports an error when compiling the procedure.
* B. Compilation succeeds, but at runtime when the `FETCH` statement executes, PL/SQL raises the predefined `ROWTYPE_MISMATCH` (`ORA-06504`) exception.
* C. Incompatible columns are automatically assigned `NULL` without raising an error.
* D. It raises `INVALID_CURSOR` (`ORA-01001`) at the `OPEN` statement.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Because a Weak `REF CURSOR` has no `RETURN` type, type compatibility cannot be checked at compile time. At runtime, when `FETCH v_rc INTO ...` executes and the query's return structure does not match the target variable(s), PL/SQL raises **`ROWTYPE_MISMATCH` (`ORA-06504: PL/SQL: Return types of Result Set variables or query do not match`)**.
  * **A, C, D are incorrect:** Only Strong `REF CURSOR` variables catch return-type mismatches at compile time.
</details>

---

### Question 21
**Examine the following PL/SQL block. What is the result of its execution?**

```sql
DECLARE
    v_count NUMBER;
BEGIN
    UPDATE employees SET salary = salary WHERE 1 = 2;
    
    SELECT SQL%ROWCOUNT INTO v_count FROM dual;
    DBMS_OUTPUT.PUT_LINE('Count = ' || v_count);
END;
```

* A. It prints `Count = 0`.
* B. It prints `Count = 1`.
* C. It prints `Count = NULL`.
* D. It fails to compile because cursor attributes (`SQL%ROWCOUNT`, `SQL%FOUND`, etc.) cannot be used directly inside a SQL statement (`SELECT ... FROM dual`).

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** Cursor attributes (`%FOUND`, `%NOTFOUND`, `%ROWCOUNT`, `%ISOPEN`) are procedural constructs of the **PL/SQL engine** and are not recognized by the SQL engine. Referencing `SQL%ROWCOUNT` inside `SELECT SQL%ROWCOUNT INTO v_count FROM dual;` causes a compilation error (`PLS-00201` / `ORA-00911`). You must assign it in PL/SQL: `v_count := SQL%ROWCOUNT;`.
  * **A, B, C are incorrect:** Always check whether a cursor attribute is being used inside a SQL statement.
</details>

---

### Question 22
**Assume Session A executes `UPDATE employees SET salary = 9000 WHERE department_id = 10;` and has NOT committed yet. Immediately afterward, Session B executes the following PL/SQL block. What happens in Session B?**

```sql
DECLARE
    CURSOR c_lock IS
        SELECT employee_id, salary
        FROM employees
        WHERE department_id = 10
        FOR UPDATE NOWAIT;
BEGIN
    OPEN c_lock;
    CLOSE c_lock;
END;
```

* A. Session B hangs and waits until Session A commits or rolls back.
* B. Session B opens the cursor successfully and reads the pre-update data from Undo segments without blocking.
* C. The `OPEN c_lock;` statement in Session B immediately fails and raises `ORA-00054: resource busy and acquire with NOWAIT specified`.
* D. The `OPEN c_lock;` statement succeeds and automatically skips the rows locked by Session A.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Because `c_lock` specifies `FOR UPDATE NOWAIT`, executing `OPEN c_lock;` attempts to acquire exclusive row locks on department 10's rows immediately. Since Session A holds locks on those rows, `NOWAIT` instructs Oracle not to wait and immediately raises **`ORA-00054: resource busy and acquire with NOWAIT specified`**.
  * **A is incorrect:** Waiting indefinitely only happens when `FOR UPDATE` is specified without `NOWAIT` or `WAIT n`.
  * **B is incorrect:** Only a normal `SELECT` (without `FOR UPDATE`) does a non-blocking consistent read from Undo.
  * **D is incorrect:** Skipping locked rows requires `FOR UPDATE SKIP LOCKED`.
</details>

---

### Question 23
**Assume the `DEPARTMENTS` table currently has 27 rows. Based on Oracle's Read Consistency model for cursors, what is the output of the following PL/SQL block?**

```sql
DECLARE
    CURSOR c_dept IS SELECT department_id FROM departments;
    v_id    departments.department_id%TYPE;
    v_count PLS_INTEGER := 0;
BEGIN
    OPEN c_dept;
    
    -- Insert a new department after the cursor is already OPEN
    INSERT INTO departments (department_id, department_name, location_id)
    VALUES (999, 'New Testing Dept', 1700);
    COMMIT;

    LOOP
        FETCH c_dept INTO v_id;
        EXIT WHEN c_dept%NOTFOUND;
        v_count := v_count + 1;
    END LOOP;
    CLOSE c_dept;

    DBMS_OUTPUT.PUT_LINE('Rows fetched: ' || v_count);
END;
```

* A. `Rows fetched: 28`
* B. `Rows fetched: 27`
* C. It raises `ORA-01002: fetch out of sequence` due to the `COMMIT` after `OPEN`.
* D. It raises `ORA-04091: table is mutating`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Oracle's **Statement-level Read Consistency** guarantees that the active set of a cursor is fixed at the System Change Number (**SCN**) when `OPEN c_dept;` is executed. At the moment `OPEN` ran, the table had 27 rows. Even though row 28 is inserted and committed immediately after `OPEN`, `c_dept` reads from the consistent snapshot taken at `OPEN` time and fetches exactly **27** rows.
  * **A is incorrect:** The 28th row would only be visible if the cursor were closed and reopened after the `INSERT`.
  * **C is incorrect:** `c_dept` does not have a `FOR UPDATE` clause, so committing while it is open does not cause `ORA-01002`.
  * **D is incorrect:** Mutating table errors (`ORA-04091`) occur in row-level DML triggers.
</details>

---

### Question 24
**Examine the following PL/SQL block using an inline `Cursor FOR Loop`. Assuming department 10 has 1 employee and department 20 has 2 employees, what is printed?**

```sql
BEGIN
    UPDATE employees SET salary = salary WHERE department_id = 10;

    FOR r IN (SELECT first_name FROM employees WHERE department_id = 20) LOOP
        NULL;
    END LOOP;

    DBMS_OUTPUT.PUT_LINE('Result = ' || SQL%ROWCOUNT);
    ROLLBACK;
END;
```

* A. `Result = 1`
* B. `Result = 2`
* C. `Result = 0`
* D. `Result =` (i.e., `SQL%ROWCOUNT` is `NULL`).

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** After the `FOR r IN (SELECT ...)` loop finishes and closes its internal cursor, `SQL%ROWCOUNT` no longer holds the count from the earlier `UPDATE` statement, nor does `SQL%ROWCOUNT` report the row count of a `Cursor FOR Loop` after the loop ends—it evaluates to `NULL`.
  * **A, B, C are incorrect:** If you need to preserve `SQL%ROWCOUNT` from a DML statement, you must assign it to a local variable **immediately after the DML statement** before executing any other SQL or cursor loop.
</details>

---

### Question 25
**Which statement correctly opens a `SYS_REFCURSOR` variable for a dynamic SQL query using bind variables?**

```sql
DECLARE
    v_rc      SYS_REFCURSOR;
    v_dept_id NUMBER := 60;
    v_min_sal NUMBER := 5000;
BEGIN
    /* INSERT OPEN STATEMENT HERE */
    CLOSE v_rc;
END;
```

* A. `OPEN v_rc FOR 'SELECT * FROM employees WHERE department_id = :1 AND salary > :2' USING v_dept_id, v_min_sal;`
* B. `OPEN v_rc USING v_dept_id, v_min_sal FOR 'SELECT * FROM employees WHERE department_id = :1 AND salary > :2';`
* C. `EXECUTE IMMEDIATE 'SELECT * FROM employees WHERE department_id = :1 AND salary > :2' INTO v_rc USING v_dept_id, v_min_sal;`
* D. `OPEN v_rc(v_dept_id, v_min_sal) FOR 'SELECT * FROM employees WHERE department_id = :1 AND salary > :2';`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** The syntax for opening a weak `REF CURSOR` (`SYS_REFCURSOR`) with a dynamic query string and bind arguments is:
    `OPEN cursor_variable FOR dynamic_query_string [USING bind_arg1, bind_arg2, ...];`
  * **B is incorrect:** The `USING` clause must come **after** `FOR dynamic_query_string`.
  * **C is incorrect:** `EXECUTE IMMEDIATE ... INTO` is not used to open a `SELECT` query into a `REF CURSOR`.
  * **D is incorrect:** Cursor variables do not accept parameter lists in parentheses like `v_rc(...)`.
</details>

---
