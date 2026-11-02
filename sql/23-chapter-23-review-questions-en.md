# Review Questions - Chapter 23: Procedures and Functions

> **Reference:** *OCP Oracle Database Program with PL/SQL Study Guide (Exam 1Z0-149)*  
> **Total Questions:** 25 multiple-choice questions aligned with the Oracle OCP 1Z0-149 exam, complete with detailed explanations.  
> **How to study:** Read each question carefully and choose your answer first, then click **"👉 View Answer & Detailed Explanation"** to verify your answer and review the exam traps.

---

### Question 1
**Which of the following `CREATE OR REPLACE FUNCTION` statements compiles SUCCESSFULLY in Oracle Database?**

* A. `CREATE OR REPLACE FUNCTION fn_get_name (p_id IN NUMBER(6)) RETURN VARCHAR2 IS BEGIN RETURN 'King'; END;`
* B. `CREATE OR REPLACE FUNCTION fn_get_name () RETURN VARCHAR2 IS BEGIN RETURN 'King'; END;`
* C. `CREATE OR REPLACE FUNCTION fn_get_name (p_id IN NUMBER) RETURN VARCHAR2(50) IS BEGIN RETURN 'King'; END;`
* D. `CREATE OR REPLACE FUNCTION fn_get_name (p_id IN employees.employee_id%TYPE DEFAULT 100) RETURN VARCHAR2 IS BEGIN RETURN 'King'; END;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** The formal parameter uses an anchored type (`%TYPE`) with a `DEFAULT 100` value, and the `RETURN VARCHAR2` clause specifies an unconstrained data type, which is valid PL/SQL syntax.
  * **A is incorrect:** Formal parameters cannot specify length, precision, or scale constraints directly (`NUMBER(6)` causes `PLS-00103`).
  * **B is incorrect:** When declaring a procedure or function with no parameters, empty parentheses `()` are not allowed.
  * **C is incorrect:** The `RETURN` data type cannot specify a length constraint (`RETURN VARCHAR2(50)` fails to compile).
</details>

---

### Question 2
**Why does the following stored procedure fail to compile?**

```sql
CREATE OR REPLACE PROCEDURE sp_update_dept (
    p_dept_id   IN NUMBER,
    p_dept_name IN VARCHAR2
) IS
DECLARE
    v_count NUMBER := 0;
BEGIN
    UPDATE departments
    SET department_name = p_dept_name
    WHERE department_id = p_dept_id;
END sp_update_dept;
```

* A. Because it is missing a `RETURN` clause in the procedure header.
* B. Because the `DECLARE` keyword is used immediately after `IS` (in a stored subprogram, `IS` or `AS` already begins the declarative section).
* C. Because local variable `v_count` cannot be initialized to `0` in its declaration.
* D. Because an `UPDATE` statement in a stored procedure must be followed by `COMMIT`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In a stored procedure, function, or package, the `IS` (or `AS`) keyword introduces the declarative section. Including the `DECLARE` keyword directly after `IS` causes **`PLS-00103: Encountered the symbol "DECLARE"`**. `DECLARE` is only used when starting an inner anonymous block inside the `BEGIN ... END` section.
  * **A, C, D are incorrect:** Procedures do not have a `RETURN` header clause, local variables can be initialized, and `COMMIT` is optional.
</details>

---

### Question 3
**Which two statements are TRUE when comparing `IN`, `OUT`, and `IN OUT` parameter modes in PL/SQL? (Choose two.)**

* A. `IN` parameters are passed by reference by default and act as read-only constants inside the subprogram.
* B. Both `OUT` and `IN OUT` parameters can be assigned default values using `DEFAULT` or `:=`.
* C. When calling a subprogram, the actual parameter passed to an `OUT` or `IN OUT` formal parameter must be a variable, not a literal or expression.
* D. If no mode is specified for a parameter, the default mode is `IN OUT`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, C**
* **Detailed Explanation:**
  * **A is correct:** By default, `IN` parameters are passed by reference and cannot be modified (assigned a new value) inside the subprogram body.
  * **C is correct:** Because `OUT` and `IN OUT` parameters return values to the caller, the actual argument must be a variable capable of receiving an assignment (`PLS-00363: expression cannot be used as an assignment target` if a literal or expression is passed).
  * **B is incorrect:** Only `IN` parameters can have `DEFAULT` values.
  * **D is incorrect:** The default parameter mode is `IN`.
</details>

---

### Question 4
**What is the output when the following PL/SQL block is executed?**

```sql
DECLARE
    v_num NUMBER := 500;

    PROCEDURE sp_reset (p_val OUT NUMBER) IS
    BEGIN
        DBMS_OUTPUT.PUT_LINE('Inside (before assignment): ' || NVL(TO_CHAR(p_val), 'NULL'));
        IF p_val IS NULL THEN
            p_val := 100;
        ELSE
            p_val := p_val + 100;
        END IF;
    END;
BEGIN
    sp_reset(v_num);
    DBMS_OUTPUT.PUT_LINE('Outside (after call): ' || v_num);
END;
```

* A. `Inside (before assignment): 500` and `Outside (after call): 600`
* B. `Inside (before assignment): NULL` and `Outside (after call): 100`
* C. `Inside (before assignment): NULL` and `Outside (after call): 500`
* D. It fails to compile because an `OUT` parameter cannot be read (`IF p_val IS NULL`) inside a procedure.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Even though the actual argument `v_num` has a value of `500` before the call, formal parameters of mode **`OUT`** (as opposed to `IN OUT`) are always initialized to **`NULL`** upon entering the subprogram!
    * The first output prints `Inside (before assignment): NULL`.
    * `IF p_val IS NULL` is true, so `p_val` is set to `100`.
    * Upon normal completion, `100` is copied to `v_num`, printing `Outside (after call): 100`.
  * **A, C, D are incorrect:** Reading an `OUT` parameter inside a subprogram is valid in modern Oracle releases, and its initial value inside the subprogram is always `NULL`.
</details>

---

### Question 5
**Examine the following PL/SQL block testing `OUT` and `IN OUT` parameter behavior when an unhandled exception occurs inside a subprogram. What is the output?**

```sql
DECLARE
    v_x NUMBER := 10;
    v_y NUMBER := 20;

    PROCEDURE sp_fail (
        p_a OUT    NUMBER,
        p_b IN OUT NUMBER
    ) IS
    BEGIN
        p_a := 99;
        p_b := 88;
        RAISE ZERO_DIVIDE;
    END;
BEGIN
    BEGIN
        sp_fail(v_x, v_y);
    EXCEPTION
        WHEN ZERO_DIVIDE THEN
            NULL;
    END;
    DBMS_OUTPUT.PUT_LINE('v_x = ' || NVL(TO_CHAR(v_x), 'NULL') || ', v_y = ' || v_y);
END;
```

* A. `v_x = 99, v_y = 88`
* B. `v_x = NULL, v_y = 20`
* C. `v_x = 10, v_y = 20`
* D. `v_x = 99, v_y = 20`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Without the `NOCOPY` hint, both `OUT` (`p_a`) and `IN OUT` (`p_b`) parameters are passed **by value** using temporary buffers. Values in the temporary buffers are copied back to the actual variables (`v_x`, `v_y`) **only when the subprogram finishes normally**.
    * Because `sp_fail` terminates with an unhandled `ZERO_DIVIDE` exception, the copy-out step never occurs.
    * Both `v_x` and `v_y` retain their original pre-call values: `v_x = 10, v_y = 20`.
  * **A, B, D are incorrect:** Modified values are only visible to the caller on unhandled exception if `NOCOPY` is used.
</details>

---

### Question 6
**If `sp_fail` in Question 5 is modified to add the `NOCOPY` hint to the second parameter (`p_b IN OUT NOCOPY NUMBER`), what is the output of the following block?**

```sql
DECLARE
    v_x NUMBER := 10;
    v_y NUMBER := 20;

    PROCEDURE sp_fail (
        p_a OUT           NUMBER,
        p_b IN OUT NOCOPY NUMBER
    ) IS
    BEGIN
        p_a := 99;
        p_b := 88;
        RAISE ZERO_DIVIDE;
    END;
BEGIN
    BEGIN
        sp_fail(v_x, v_y);
    EXCEPTION
        WHEN ZERO_DIVIDE THEN
            NULL;
    END;
    DBMS_OUTPUT.PUT_LINE('v_x = ' || v_x || ', v_y = ' || v_y);
END;
```

* A. `v_x = 10, v_y = 20`
* B. `v_x = 10, v_y = 88`
* C. `v_x = 99, v_y = 88`
* D. It fails to compile because `NOCOPY` cannot be used with `NUMBER` parameters.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * `p_a` (`OUT` without `NOCOPY`) uses pass-by-value, so when `ZERO_DIVIDE` escapes `sp_fail`, `v_x` retains its original value of **`10`**.
    * `p_b` (`IN OUT NOCOPY`) uses **pass-by-reference** (pointing directly to `v_y`'s memory location). As soon as `p_b := 88;` executes, `v_y` is modified in place to **`88`**. When `ZERO_DIVIDE` is raised afterward, `v_y` remains **`88`**.
  * **A, C, D are incorrect:** `NOCOPY` is valid for any data type in `OUT` or `IN OUT` mode.
</details>

---

### Question 7
**Which parameter declaration causes a COMPILATION ERROR when using the `NOCOPY` hint?**

* A. `p_emp_rec OUT NOCOPY employees%ROWTYPE`
* B. `p_emp_list IN OUT NOCOPY t_emp_tab_type`
* C. `p_emp_id IN NOCOPY NUMBER`
* D. `p_name OUT NOCOPY VARCHAR2`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct (Causes compilation error):** Because `IN` parameters are **always passed by reference** by default in PL/SQL, specifying `IN NOCOPY` is disallowed and causes **`PLS-00103: Encountered the symbol "NOCOPY"`**. `NOCOPY` can only be specified for `OUT` and `IN OUT` parameters.
  * **A, B, D are incorrect:** All three are valid `OUT NOCOPY` or `IN OUT NOCOPY` declarations.
</details>

---

### Question 8
**In which scenario will the PL/SQL compiler silently IGNORE the `NOCOPY` hint and fall back to pass-by-value without raising an error?**

* A. When the parameter is a large `RECORD` or `Nested Table`.
* B. When the subprogram call is a Remote Procedure Call (RPC over a Database Link) or when the actual parameter has a `NOT NULL` constraint.
* C. When the subprogram is declared inside a package.
* D. When the subprogram contains an `EXCEPTION` section.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Because `NOCOPY` is a compiler hint rather than a mandatory directive, PL/SQL silently falls back to pass-by-value whenever a memory pointer cannot be safely shared:
    1. Remote Procedure Calls (RPC over a Database Link).
    2. When the actual parameter has a `NOT NULL` constraint, a narrower size/scale constraint, requires implicit data type conversion, or is an element of an associative array.
  * **A, C, D are incorrect:** `NOCOPY` works normally and provides the greatest benefit with large collections and records in local/packaged subprograms.
</details>

---

### Question 9
**Examine the header of `sp_process` below. Which two procedure calls are VALID? (Choose two.)**

```sql
CREATE OR REPLACE PROCEDURE sp_process (
    p_a IN NUMBER,
    p_b IN NUMBER DEFAULT 10,
    p_c IN NUMBER,
    p_d IN NUMBER := 20
) IS
BEGIN
    NULL;
END;
```

* A. `sp_process(1, 2, 3);`
* B. `sp_process(1, , 3, 4);`
* C. `sp_process(1, p_c => 3);`
* D. `sp_process(p_a => 1, p_c => 3, 4);`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, C**
* **Detailed Explanation:**
  * **A is correct (Positional Notation):** `p_a` gets `1`, `p_b` gets `2`, `p_c` gets `3`, and trailing parameter `p_d` uses its default value `20`.
  * **C is correct (Mixed Notation):** `1` is passed positionally to `p_a`, followed by named notation `p_c => 3`. Both `p_b` and `p_d` have default values and are omitted cleanly.
  * **B is incorrect:** PL/SQL does not allow empty commas `(1, , 3, 4)` to skip middle arguments in positional notation.
  * **D is incorrect:** In mixed notation, once you switch to named notation (`=>`), **all subsequent arguments must also use named notation** (`PLS-00312`).
</details>

---

### Question 10
**What happens when the following PL/SQL block is executed?**

```sql
DECLARE
    FUNCTION fn_check (p_val NUMBER) RETURN VARCHAR2 IS
    BEGIN
        IF p_val > 0 THEN
            RETURN 'Positive';
        ELSIF p_val < 0 THEN
            RETURN 'Negative';
        END IF;
    END fn_check;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Result: ' || fn_check(0));
END;
```

* A. It prints `Result: ` (because the function automatically returns `NULL` when no `IF` branch matches).
* B. It fails to compile because the `IF` statement is missing an `ELSE` clause.
* C. It compiles successfully, but when called with `0` at runtime, it raises `ORA-06503: PL/SQL: Function returned without value`.
* D. It raises `NO_DATA_FOUND` (`ORA-01403`).

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** A PL/SQL function compiles even if some control paths lack a `RETURN` statement. However, at runtime when `p_val = 0` is passed, execution reaches the end of `fn_check` without executing any `RETURN` statement, causing PL/SQL to raise **`ORA-06503: PL/SQL: Function returned without value` (`FUNCTION_RETURNED_WITHOUT_VALUE`)**.
  * **A, B, D are incorrect:** PL/SQL functions never implicitly return `NULL` when falling off the end of the function body.
</details>

---

### Question 11
**Which statement is TRUE regarding the use of a `RETURN` statement inside a `PROCEDURE`?**

* A. It is strictly forbidden; using `RETURN` inside a `PROCEDURE` always causes a compilation error.
* B. A standalone `RETURN;` statement (without an expression) is valid inside a `PROCEDURE` and immediately exits the procedure, returning control to the caller.
* C. `RETURN 0;` or `RETURN TRUE;` can be used to return a status code from a `PROCEDURE`.
* D. Issuing `RETURN;` inside a `PROCEDURE` automatically rolls back uncommitted DML statements.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Inside a `PROCEDURE`, you can execute `RETURN;` (with no expression) to terminate the procedure early and return control to the caller.
  * **A, C are incorrect:** Including an expression (`RETURN 0;`) in a procedure causes `PLS-00372: In a procedure, RETURN statement cannot contain an expression`.
  * **D is incorrect:** `RETURN;` only transfers control flow and has no effect on transactions.
</details>

---

### Question 12
**Examine the following PL/SQL block containing a local function. Why does this block fail to compile?**

```sql
DECLARE
    v_rate NUMBER := 0.1;

    FUNCTION fn_calc (p_amt NUMBER) RETURN NUMBER IS
    BEGIN
        RETURN p_amt * v_rate;
    END fn_calc;

    v_result NUMBER;
BEGIN
    v_result := fn_calc(1000);
    DBMS_OUTPUT.PUT_LINE(v_result);
END;
```

* A. Because an anonymous block cannot contain a local `FUNCTION`.
* B. Because local function `fn_calc` cannot reference the outer variable `v_rate`.
* C. Because variable `v_result NUMBER;` is declared AFTER the local function `fn_calc` (all local subprograms must be declared at the very end of the declarative section).
* D. Because the `CREATE` keyword is missing before `FUNCTION fn_calc`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In any PL/SQL declarative section (`DECLARE` or `IS`/`AS`), all variables, constants, types, cursors, and exceptions **must be declared BEFORE any local subprograms (`PROCEDURE` / `FUNCTION`)**. Placing `v_result NUMBER;` after `END fn_calc;` causes **`PLS-00103: Encountered the symbol "V_RESULT"`**.
  * **A, B, D are incorrect:** Local subprograms are valid in `DECLARE` (without `CREATE`) and can reference variables declared above them in the enclosing block.
</details>

---

### Question 13
**When are you REQUIRED to use a Forward Declaration for local subprograms in PL/SQL?**

* A. Whenever you declare more than one local procedure in the same `DECLARE` section.
* B. When two local subprograms call each other (mutual recursion—for example, procedure `A` calls procedure `B`, and procedure `B` calls procedure `A`).
* C. When a local function needs to be called from a SQL `SELECT` statement.
* D. When a local procedure uses `OUT NOCOPY` parameters.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** PL/SQL requires every identifier (including subprogram names) to be declared before it is referenced. If `A` calls `B` and `B` calls `A`, you must declare the header of `B` first (`PROCEDURE B(p_x NUMBER);` — a **Forward Declaration**), then define the full body of `A`, and finally define the full body of `B`.
  * **A, C, D are incorrect:** One-way calls only require defining the callee before the caller, and local PL/SQL functions in `DECLARE` cannot be called from SQL.
</details>

---

### Question 14
**A stored function `fn_process` compiles successfully in the database. Which two conditions must `fn_process` satisfy to be callable inside a `SELECT` or `WHERE` clause of a SQL query? (Choose two.)**

* A. All formal parameters of the function must use `IN` mode (it cannot have `OUT` or `IN OUT` parameters).
* B. Its `RETURN` type and parameter types must be valid SQL data types (such as `NUMBER`, `VARCHAR2`, `DATE`), not PL/SQL-only types such as `RECORD` or `BOOLEAN` (in 19c/21c).
* C. All parameter names must start with `SQL_`.
* D. The function body must execute `COMMIT;` before `RETURN`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, B**
* **Detailed Explanation:**
  * **A is correct:** SQL queries cannot receive values back through `OUT` or `IN OUT` parameters (`ORA-06572: Function ... has out arguments`).
  * **B is correct:** The SQL engine must recognize the parameter and return data types. PL/SQL-specific types (`RECORD`, associative arrays, or `BOOLEAN` prior to 23ai) cause `PLS-00382: expression is of wrong type` when called from SQL.
  * **C, D are incorrect:** Functions called from SQL are forbidden from issuing `COMMIT` or `ROLLBACK` (unless autonomous).
</details>

---

### Question 15
**A developer creates the function `fn_audit_sal` and then executes the `SELECT` query shown below. What happens when the `SELECT` query is run?**

```sql
CREATE OR REPLACE FUNCTION fn_audit_sal (p_emp_id NUMBER, p_sal NUMBER)
RETURN NUMBER IS
BEGIN
    INSERT INTO salary_audit_log (emp_id, checked_date)
    VALUES (p_emp_id, SYSDATE);
    
    RETURN p_sal * 1.10;
END fn_audit_sal;
/

SELECT employee_id, fn_audit_sal(employee_id, salary)
FROM employees
WHERE department_id = 10;
```

* A. The `SELECT` query succeeds, returning the calculated salary and inserting audit rows into `salary_audit_log`.
* B. `fn_audit_sal` fails to compile during `CREATE OR REPLACE FUNCTION` because `INSERT` is not allowed inside a function.
* C. The function compiles successfully, but the `SELECT` query fails at runtime with `ORA-14551: cannot perform a DML operation inside a query`.
* D. The `SELECT` query succeeds and silently ignores the `INSERT` statement.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:**
    * A PL/SQL function is allowed to contain DML statements (`INSERT`, `UPDATE`, `DELETE`) when called from PL/SQL, so `CREATE FUNCTION` compiles without error.
    * However, when a function is invoked from a SQL **`SELECT` query**, it is forbidden from modifying database tables (side effects) unless declared with `PRAGMA AUTONOMOUS_TRANSACTION`. At runtime, the query fails with **`ORA-14551: cannot perform a DML operation inside a query`**.
  * **A, B, D are incorrect:** To perform audit logging inside a function called from `SELECT`, `fn_audit_sal` must use `PRAGMA AUTONOMOUS_TRANSACTION;` and `COMMIT;`.
</details>

---

### Question 16
**What happens when the following `UPDATE` statement calling `fn_get_max_sal` is executed?**

```sql
CREATE OR REPLACE FUNCTION fn_get_max_sal (p_dept_id NUMBER)
RETURN NUMBER IS
    v_max NUMBER;
BEGIN
    SELECT MAX(salary) INTO v_max
    FROM employees
    WHERE department_id = p_dept_id;
    RETURN v_max;
END;
/

UPDATE employees
SET salary = fn_get_max_sal(department_id)
WHERE department_id = 20;
```

* A. All employees in department 20 have their salary updated to the maximum salary of department 20.
* B. The `UPDATE` fails at runtime with `ORA-14551: cannot perform a DML operation inside a query`.
* C. The `UPDATE` fails at runtime with `ORA-04091: table is mutating, trigger/function may not see it` because a function invoked from a DML statement on `EMPLOYEES` queries the same `EMPLOYEES` table being modified.
* D. `fn_get_max_sal` fails to compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** According to SQL side-effect rules, a PL/SQL function called from a DML statement (`INSERT`, `UPDATE`, `DELETE`, `MERGE`) **cannot query (`SELECT`) or modify the same table being modified by that parent DML statement**. Because `UPDATE employees` is modifying `EMPLOYEES`, calling `fn_get_max_sal` which selects from `EMPLOYEES` raises **`ORA-04091: table is mutating, trigger/function may not see it`**.
  * **A, B, D are incorrect:** Mutating table errors apply to both row-level triggers and functions called from DML statements.
</details>

---

### Question 17
**Which keyword MUST be included in a stored function's header if you want to use that function in a Function-Based Index (FBI) or a Materialized View?**

* A. `RESULT_CACHE`
* B. `DETERMINISTIC`
* C. `PARALLEL_ENABLE`
* D. `AUTHID CURRENT_USER`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** To build a Function-Based Index (e.g., `CREATE INDEX idx_emp ON emp(fn_custom(name));`), Oracle requires the function to always return the exact same result for the same input arguments. Thus, the function must be declared **`DETERMINISTIC`** (otherwise `ORA-30553: The function is not deterministic` is raised).
  * **A, C, D are incorrect:** `RESULT_CACHE` caches results in the SGA but cannot substitute for `DETERMINISTIC` when creating a function-based index.
</details>

---

### Question 18
**What is the primary architectural difference between a `DETERMINISTIC` function and a `RESULT_CACHE` function?**

* A. `DETERMINISTIC` stores results on disk, whereas `RESULT_CACHE` stores results in the PGA.
* B. `DETERMINISTIC` caches results only within the scope of a single SQL statement execution in the current session, whereas `RESULT_CACHE` stores results in the Shared Pool (SGA) to be shared across all sessions and automatically invalidates cached entries when underlying dependent tables are modified and committed.
* C. `RESULT_CACHE` functions cannot contain `SELECT` statements, whereas `DETERMINISTIC` functions are designed to query volatile tables.
* D. `DETERMINISTIC` only works with `NUMBER` return types, whereas `RESULT_CACHE` works with all types.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * **`DETERMINISTIC`:** The SQL engine caches `(input -> output)` pairs in a small per-call PGA hash table only for the duration of **a single SQL query**.
    * **`RESULT_CACHE`:** Cached results are stored in the **PL/SQL Function Result Cache in the SGA**, shared across **all database sessions**, and automatically invalidated whenever any dependent table undergoes a committed DML change.
  * **A, C, D are incorrect:** A true `DETERMINISTIC` function should not depend on mutable table data, whereas `RESULT_CACHE` is ideal for functions querying read-mostly lookup tables.
</details>

---

### Question 19
**What is the purpose of placing `PRAGMA UDF;` inside the declarative section of a PL/SQL function (introduced in Oracle 12c)?**

* A. It allows the function to execute `UPDATE` and `DELETE` statements when called from a `SELECT` query.
* B. It instructs the compiler to optimize the function for invocation from SQL statements, significantly reducing the context-switching overhead between the SQL and PL/SQL engines.
* C. It automatically sets the function to `AUTHID CURRENT_USER`.
* D. It makes the function run in an autonomous transaction.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `PRAGMA UDF` (*User-Defined Function*) tells the PL/SQL compiler that the function is primarily invoked from **SQL statements**, enabling internal memory and data-representation optimizations that minimize SQL-to-PL/SQL context switch overhead.
  * **A, C, D are incorrect:** `PRAGMA UDF` is strictly a performance optimization and does not alter DML side-effect rules (`ORA-14551`), `AUTHID`, or transaction boundaries.
</details>

---

### Question 20
**Assume user `HR` owns the `EMPLOYEES` table (107 rows), creates the procedure `sp_count_emp` below, and grants `GRANT EXECUTE ON hr.sp_count_emp TO scott;`. User `SCOTT` has his own `SCOTT.EMPLOYEES` table (14 rows) and does NOT have direct `SELECT` privileges on `HR.EMPLOYEES`. When `SCOTT` executes `EXEC hr.sp_count_emp;`, what is the result?**

```sql
-- Created by user HR:
CREATE OR REPLACE PROCEDURE sp_count_emp IS
    v_cnt NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_cnt FROM employees;
    DBMS_OUTPUT.PUT_LINE('Count = ' || v_cnt);
END sp_count_emp;
```

* A. It prints `Count = 14` (the row count of `SCOTT.EMPLOYEES`).
* B. It prints `Count = 107` (the row count of `HR.EMPLOYEES`).
* C. It raises `ORA-00942: table or view does not exist` because `SCOTT` lacks `SELECT` privilege on `HR.EMPLOYEES`.
* D. It raises `ORA-01031: insufficient privileges`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** When `AUTHID` is omitted, the default mode is **`AUTHID DEFINER` (Definer's Rights)**.
    * Under `AUTHID DEFINER`, the procedure executes with the **privileges of the owner (`HR`)**, and unqualified object names (`FROM employees`) resolve to the **owner's schema (`HR.EMPLOYEES`)**.
    * `SCOTT` only needs `EXECUTE` privilege on `hr.sp_count_emp` and receives `Count = 107` from `HR.EMPLOYEES`.
  * **A, C, D are incorrect:** It would only resolve to `SCOTT.EMPLOYEES` (`14`) if `AUTHID CURRENT_USER` were specified.
</details>

---

### Question 21
**Continuing from Question 20, if user `HR` recreates `sp_count_emp` with `AUTHID CURRENT_USER` as shown below, what is the result when user `SCOTT` executes `EXEC hr.sp_count_emp;`?**

```sql
-- Created by user HR:
CREATE OR REPLACE PROCEDURE sp_count_emp
AUTHID CURRENT_USER IS
    v_cnt NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_cnt FROM employees;
    DBMS_OUTPUT.PUT_LINE('Count = ' || v_cnt);
END sp_count_emp;
```

* A. It prints `Count = 107` (the row count of `HR.EMPLOYEES`).
* B. It prints `Count = 14` (the row count of `SCOTT.EMPLOYEES`).
* C. It raises `ORA-00942` because `SCOTT` lacks privileges on `HR.EMPLOYEES`.
* D. It fails to compile because `AUTHID CURRENT_USER` can only be used on packages, not standalone procedures.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** With **`AUTHID CURRENT_USER` (Invoker's Rights)**:
    * The procedure executes using the **privileges and schema context of the current invoker (`SCOTT`)** at runtime.
    * The unqualified table name `employees` resolves to **`SCOTT.EMPLOYEES`**, which has 14 rows, printing `Count = 14`.
  * **A, C, D are incorrect:** `AUTHID CURRENT_USER` is valid on standalone procedures, functions, packages, and types.
</details>

---

### Question 22
**User `APP_DEV` was granted `SELECT` privilege on `HR.EMPLOYEES` via a database role named `EMP_READ_ROLE`. When `APP_DEV` runs `SELECT COUNT(*) FROM hr.employees;` in SQL\*Plus, it succeeds. However, when `APP_DEV` attempts to create the stored procedure below, compilation fails with `PL/SQL: ORA-00942: table or view does not exist`. Which two statements identify the cause and a valid solution? (Choose two.)**

```sql
-- Executed by user APP_DEV:
CREATE OR REPLACE PROCEDURE sp_read_hr_emp IS
    v_cnt NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_cnt FROM hr.employees;
END;
```

* A. The error occurs because in a Definer's Rights (`AUTHID DEFINER`) stored subprogram, all privileges granted through database roles are disabled during compilation and execution.
* B. Solution 1: Have `HR` (or a DBA) grant the `SELECT` privilege directly to user `APP_DEV` (`GRANT SELECT ON hr.employees TO app_dev;`) rather than through a role.
* C. Solution 2: Add `COMMIT;` at the end of `sp_read_hr_emp`.
* D. The error occurs because schema prefixes (`hr.`) are not allowed inside stored procedures.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, B**
* **Detailed Explanation:**
  * **A is correct:** In Oracle, **roles are disabled** during the compilation and execution of Definer's Rights (`AUTHID DEFINER`) stored PL/SQL units. Oracle only checks privileges granted **directly** to the definer user.
  * **B is correct:** Granting `SELECT ON hr.employees` directly to `app_dev` (or changing the procedure to `AUTHID CURRENT_USER`, where roles remain enabled) resolves the `ORA-00942` error.
  * **C, D are incorrect:** Schema prefixes are completely valid, and `COMMIT` has nothing to do with object privileges.
</details>

---

### Question 23
**Which statement shows the VALID syntax placement of the `AUTHID` clause when creating a stored function?**

* A. `CREATE OR REPLACE FUNCTION fn_test (p_id NUMBER) AUTHID CURRENT_USER RETURN NUMBER IS ...`
* B. `CREATE OR REPLACE FUNCTION fn_test (p_id NUMBER) RETURN NUMBER AUTHID CURRENT_USER IS ...`
* C. `CREATE OR REPLACE FUNCTION fn_test (p_id NUMBER) RETURN NUMBER IS AUTHID CURRENT_USER BEGIN ...`
* D. `CREATE OR REPLACE AUTHID CURRENT_USER FUNCTION fn_test (p_id NUMBER) RETURN NUMBER IS ...`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In a `CREATE FUNCTION` statement, options such as `AUTHID {DEFINER | CURRENT_USER}`, `DETERMINISTIC`, `RESULT_CACHE`, and `PARALLEL_ENABLE` must be placed **AFTER the `RETURN datatype` clause** and **BEFORE the `IS` / `AS` keyword**.
  * **A, C, D are incorrect:** Placing `AUTHID` before `RETURN`, after `IS`, or before `FUNCTION` causes a `PLS-00103` syntax error.
</details>

---

### Question 24
**Examine the following PL/SQL block demonstrating parameter aliasing (passing the same variable `v_n` to multiple parameters). What is printed?**

```sql
DECLARE
    v_n NUMBER := 10;

    PROCEDURE sp_alias (
        p_in  IN     NUMBER,
        p_out IN OUT NUMBER
    ) IS
    BEGIN
        p_out := p_in + 5;
        DBMS_OUTPUT.PUT_LINE('p_in = ' || p_in || ', p_out = ' || p_out);
    END;
BEGIN
    sp_alias(v_n, v_n);
    DBMS_OUTPUT.PUT_LINE('Final v_n = ' || v_n);
END;
```

* A. It fails to compile because the same variable `v_n` cannot be passed to two different parameters in the same call.
* B. It prints `p_in = 10, p_out = 15` and `Final v_n = 15`.
* C. It prints `p_in = 15, p_out = 15` and `Final v_n = 10`.
* D. It raises `VALUE_ERROR` at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * `p_in` is passed by reference (pointing to `v_n`, which is `10`), while `p_out` (`IN OUT` without `NOCOPY`) is passed **by value** (using a temporary buffer initialized to `10`).
    * When `p_out := p_in + 5;` executes, only the temporary buffer of `p_out` becomes `15`; `v_n` has not been overwritten yet, so `p_in` still reads `10`.
    * Inside the procedure, it prints `p_in = 10, p_out = 15`. Upon exit, `15` is copied to `v_n`, printing `Final v_n = 15`.
    * *(Note: If `p_out` used `NOCOPY`, both `p_in` and `p_out` would point directly to `v_n`, so assigning `p_out := 15` would immediately change `p_in` to `15` as well!)*
  * **A, C, D are incorrect:** Passing the same variable to multiple parameters is legal in PL/SQL.
</details>

---

### Question 25
**Which feature introduced in Oracle Database 12c allows you to declare and call a transient PL/SQL function directly inside a SQL `SELECT` statement WITHOUT creating a stored function in the schema?**

* A. Using the `WITH FUNCTION ... SELECT ...` clause (Subquery Factoring clause extended for PL/SQL declarations).
* B. Using the `DECLARE FUNCTION ... SELECT ...` clause.
* C. Using `DBMS_SQL.DEFINE_FUNCTION`.
* D. Using the `/*+ INLINE_PLSQL */` optimizer hint.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** Starting in Oracle 12c, the SQL `WITH` clause supports inline PL/SQL function and procedure declarations (`WITH FUNCTION fn_name ... IS BEGIN ... END; SELECT fn_name(col) FROM table;`). This is especially useful in read-only databases or when you do not want to create schema-level objects, and it also reduces context-switching overhead similarly to `PRAGMA UDF`.
  * **B, C, D are incorrect:** Only `WITH FUNCTION` is valid SQL syntax for inline PL/SQL subprogram declarations.
</details>

---
