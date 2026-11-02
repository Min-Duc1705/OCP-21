# Review Questions - Chapter 25: Packages and Triggers

> **Reference:** *OCP Oracle Database Program with PL/SQL Study Guide (Exam 1Z0-149)*  
> **Total Questions:** 25 multiple-choice questions aligned with the Oracle OCP 1Z0-149 exam, complete with detailed explanations.  
> **How to study:** Read each question carefully and choose your answer first, then click **"👉 View Answer & Detailed Explanation"** to verify your answer and review the exam traps.

---

### Question 1
**Under which circumstance can you create a valid, fully functional `PACKAGE SPECIFICATION` WITHOUT creating a `PACKAGE BODY` (a Bodiless Package)?**

* A. When the `PACKAGE SPECIFICATION` contains only declarations of constants (`CONSTANT`), global variables, data types (`TYPE`), exceptions (`EXCEPTION`), or explicit cursors (`CURSOR`) that include their full `SELECT` query.
* B. When the `PACKAGE SPECIFICATION` contains at most one `FUNCTION` and no `PROCEDURE`.
* C. When the `PACKAGE SPECIFICATION` is declared with `AUTHID CURRENT_USER`.
* D. Never; every `PACKAGE SPECIFICATION` must have a corresponding `PACKAGE BODY`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** A **Bodiless Package** is completely valid when the `PACKAGE SPECIFICATION` declares no subprograms (`PROCEDURE`/`FUNCTION`) and no cursor headers without queries that require implementation. It is widely used for centralizing application-wide constants, shared `RECORD`/`COLLECTION` types, and pragma-initialized exceptions.
  * **B, C, D are incorrect:** Any `PROCEDURE` or `FUNCTION` declared in the specification requires a `PACKAGE BODY`.
</details>

---

### Question 2
**Assume standalone procedure `PROC_A` calls packaged function `PKG_HR.FN_GET_SAL`. What happens to the status of `PROC_A` if a developer modifies a SQL query inside `PACKAGE BODY PKG_HR` and recompiles ONLY the `PACKAGE BODY` (leaving the `PACKAGE SPECIFICATION` unchanged)?**

* A. `PROC_A` is immediately marked `INVALID` and must be recompiled.
* B. `PROC_A` remains `VALID` because external callers depend only on the `PACKAGE SPECIFICATION`, not the `PACKAGE BODY`.
* C. Both `PROC_A` and `PACKAGE SPECIFICATION PKG_HR` become `INVALID`.
* D. Oracle refuses to recompile `PACKAGE BODY PKG_HR` until `PROC_A` is dropped.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** One of the greatest dependency-management benefits of packages is that **dependent objects (`PROC_A`) depend on the `PACKAGE SPECIFICATION`, and the `PACKAGE BODY` also depends on the `PACKAGE SPECIFICATION`**. Because `PROC_A` has no direct dependency on the `PACKAGE BODY`, recompiling `CREATE OR REPLACE PACKAGE BODY pkg_hr` never invalidates `PROC_A` or any other external caller.
  * **A, C, D are incorrect:** `PROC_A` is invalidated only if the `PACKAGE SPECIFICATION` itself is recompiled.
</details>

---

### Question 3
**If you want to specify Invoker's Rights (`AUTHID CURRENT_USER`) for a package that has both a specification and a body, where must the `AUTHID CURRENT_USER` clause be placed?**

* A. In both `CREATE OR REPLACE PACKAGE` and `CREATE OR REPLACE PACKAGE BODY`.
* B. Only in `CREATE OR REPLACE PACKAGE` (the specification header); it cannot appear in the `PACKAGE BODY` or in individual subprograms inside the package.
* C. Only in `CREATE OR REPLACE PACKAGE BODY`.
* D. On each individual `PROCEDURE` and `FUNCTION` inside the `PACKAGE SPECIFICATION`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The `AUTHID {DEFINER | CURRENT_USER}` clause applies to the entire package and **can only be specified in the `PACKAGE SPECIFICATION` header** (`CREATE OR REPLACE PACKAGE pkg_name AUTHID CURRENT_USER IS ...`). Placing `AUTHID` in the `PACKAGE BODY` or on individual packaged subprograms causes `PLS-00103`.
  * **A, C, D are incorrect:** Contrast this with `PRAGMA SERIALLY_REUSABLE;`, which must appear in both the specification and body.
</details>

---

### Question 4
**Examine the overloaded subprogram declarations in a `PACKAGE SPECIFICATION` below. Which two pairs of declarations are INVALID for subprogram overloading in PL/SQL? (Choose two.)**

* A. `PROCEDURE calc(p_id IN NUMBER);` and `PROCEDURE calc(p_id IN NUMBER, p_rate IN NUMBER);`
* B. `FUNCTION get_val(p_x NUMBER) RETURN VARCHAR2;` and `FUNCTION get_val(p_x NUMBER) RETURN NUMBER;`
* C. `PROCEDURE set_data(p_a IN VARCHAR2);` and `PROCEDURE set_data(p_a OUT VARCHAR2);`
* D. `PROCEDURE process(p_date DATE, p_num NUMBER);` and `PROCEDURE process(p_num NUMBER, p_date DATE);`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B, C**
* **Detailed Explanation:**
  * **B is invalid for overloading (Correct):** Two functions with the same name and identical parameter types that **differ only in their `RETURN` data type** cannot be overloaded.
  * **C is invalid for overloading (Correct):** Two subprograms with the same name and parameter types that **differ only in parameter mode (`IN` vs `OUT` / `IN OUT`)** or parameter names cannot be overloaded.
  * **A and D are valid overloads:** Pair A differs in the number of parameters; Pair D differs in the order of parameter data type families.
</details>

---

### Question 5
**Examine the `PACKAGE` and `PACKAGE BODY` below. What happens when you compile this package and then execute the anonymous block calling `pkg_overload.print_val(100);`?**

```sql
CREATE OR REPLACE PACKAGE pkg_overload IS
    PROCEDURE print_val(p_n NUMBER);
    PROCEDURE print_val(p_n INTEGER);
END pkg_overload;
/

CREATE OR REPLACE PACKAGE BODY pkg_overload IS
    PROCEDURE print_val(p_n NUMBER) IS
    BEGIN
        DBMS_OUTPUT.PUT_LINE('NUMBER: ' || p_n);
    END;

    PROCEDURE print_val(p_n INTEGER) IS
    BEGIN
        DBMS_OUTPUT.PUT_LINE('INTEGER: ' || p_n);
    END;
END pkg_overload;
/

BEGIN
    pkg_overload.print_val(100);
END;
```

* A. `CREATE PACKAGE` fails to compile immediately because `NUMBER` and `INTEGER` belong to the same data type family.
* B. Both the package and anonymous block compile and print `INTEGER: 100`.
* C. Both the package and anonymous block compile and print `NUMBER: 100`.
* D. Both `PACKAGE` and `PACKAGE BODY` compile without error, but compiling the anonymous block calling `pkg_overload.print_val(100);` fails with `PLS-00307: too many declarations of 'PRINT_VAL' match this call`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** This is a subtle OCP 1Z0-149 trap:
    1. In PL/SQL, `INTEGER` is a constrained `SUBTYPE` of **`NUMBER`** (they belong to the same data type family, just like `VARCHAR2` and `CHAR`).
    2. `CREATE PACKAGE` and `CREATE PACKAGE BODY` **compile without any error**.
    3. However, when you invoke `pkg_overload.print_val(100);`, the argument `100` matches both `NUMBER` and `INTEGER`, causing compilation of the caller to fail with **`PLS-00307: too many declarations of 'PRINT_VAL' match this call`**.
  * **A, B, C are incorrect:** Overloads differing only by subtypes in the same family compile in the package but fail at the call site (`PLS-00307`).
</details>

---

### Question 6
**When and how many times is a Package Initialization Block (the `BEGIN ... END` block at the end of a `PACKAGE BODY`) executed for a standard package (without `PRAGMA SERIALLY_REUSABLE`)?**

* A. Every time any procedure or function in the package is called.
* B. Exactly once per database instance when the database starts up.
* C. Exactly once per session, the very first time that session references any element of the package.
* D. Only when `DBMS_SESSION.INITIALIZE_PACKAGE` is called explicitly.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** The first time a session references any package element (calling a subprogram or reading/writing a package variable), PL/SQL instantiates the package state in the session's UGA and **executes the initialization block at the end of the `PACKAGE BODY` once**. Subsequent calls in the same session do not re-run the initialization block unless the package state is reset or recompiled.
  * **A, B, D are incorrect:** Package initialization is once per session upon first reference.
</details>

---

### Question 7
**Package `PKG_STATE` declares a public variable `g_val NUMBER := 10;` in its specification.
- At time T1: Session A executes `BEGIN pkg_state.g_val := 50; COMMIT; END;`.
- At time T2: Session B connects as the same database user and executes `BEGIN DBMS_OUTPUT.PUT_LINE(pkg_state.g_val); END;`.
What value does Session B display?**

* A. `50` (because Session A committed and both sessions connect as the same user).
* B. `10` (because package variable state is private to each individual session in its own UGA memory and is never shared across sessions).
* C. `NULL`.
* D. It raises `ORA-04068: existing state of packages has been discarded`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Package-level variables are **session-specific** (stored in each session's private UGA/PGA memory), not shared across sessions—even if two sessions log in with the same username! When Session B references `pkg_state` for the first time, its own copy of `g_val` is initialized to **`10`**.
  * **A, C, D are incorrect:** `COMMIT` applies only to database table changes, never to PL/SQL package variables.
</details>

---

### Question 8
**Which two statements are TRUE when using `PRAGMA SERIALLY_REUSABLE;` on a package that has both a specification and a body? (Choose two.)**

* A. `PRAGMA SERIALLY_REUSABLE;` must be declared in both the `PACKAGE SPECIFICATION` and the `PACKAGE BODY`.
* B. The package's global variable state persists only for the duration of a single server call (unit of work) and is then returned to the SGA pool rather than persisting for the entire session.
* C. Functions in a `SERIALLY_REUSABLE` package can be called directly from SQL `SELECT` statements and DML triggers.
* D. `PRAGMA SERIALLY_REUSABLE;` can only be placed in the `PACKAGE BODY`, not in the specification.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, B**
* **Detailed Explanation:**
  * **A is correct:** When a package has both a specification and a body, `PRAGMA SERIALLY_REUSABLE;` **must appear in both**. Putting it in only one causes `PLS-00709: pragma SERIALLY_REUSABLE must be declared in both package specification and body`.
  * **B is correct:** With `SERIALLY_REUSABLE`, package state is allocated from the SGA for a single server call and freed/reset immediately when the call completes. The next server call re-initializes the package variables and re-runs the initialization block.
  * **C is incorrect:** Subprograms in a `SERIALLY_REUSABLE` package **cannot** be called from SQL statements or database triggers (`ORA-06534: Cannot access Serially Reusable package`).
  * **D is incorrect:** Contradicts rule A.
</details>

---

### Question 9
**Assume the `EMPLOYEES` table has 107 rows and no employee has `department_id = 999`. Two triggers are enabled on `EMPLOYEES`:
- `TRG_BEFORE_STMT`: A statement-level trigger (`BEFORE UPDATE ON employees`).
- `TRG_BEFORE_ROW`: A row-level trigger (`BEFORE UPDATE ON employees FOR EACH ROW`).
When the statement `UPDATE employees SET salary = salary * 1.1 WHERE department_id = 999;` (which updates 0 rows) is executed, how many times does each trigger fire?**

* A. Both `TRG_BEFORE_STMT` and `TRG_BEFORE_ROW` fire `0` times.
* B. `TRG_BEFORE_STMT` fires `1` time, and `TRG_BEFORE_ROW` fires `0` times.
* C. `TRG_BEFORE_STMT` fires `0` times, and `TRG_BEFORE_ROW` fires `1` time.
* D. Both triggers fire `1` time.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * **Statement-level trigger (`TRG_BEFORE_STMT`):** Always fires **once** per DML statement execution, **even if the DML statement affects 0 rows**.
    * **Row-level trigger (`TRG_BEFORE_ROW` with `FOR EACH ROW`):** Fires once for each affected row. Since 0 rows match `department_id = 999`, it fires **`0` times**.
  * **A, C, D are incorrect:** Remember that statement-level triggers still fire once when 0 rows are affected.
</details>

---

### Question 10
**What are the values of the `:OLD` and `:NEW` pseudorecords inside a row-level trigger (`FOR EACH ROW`) for each DML event?**

* A. For `INSERT`, both `:OLD` and `:NEW` contain the new values; for `DELETE`, both `:OLD` and `:NEW` are `NULL`.
* B. For `INSERT`, `:OLD` fields are `NULL` and `:NEW` contains the new values; for `DELETE`, `:OLD` contains the pre-delete values and `:NEW` fields are `NULL`; for `UPDATE`, `:OLD` contains the pre-update values and `:NEW` contains the post-update values.
* C. Referencing `:OLD` in an `INSERT` trigger or `:NEW` in a `DELETE` trigger causes a compilation error.
* D. `:OLD` and `:NEW` can be referenced in both statement-level and row-level triggers.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * **`INSERT`:** All `:OLD` fields are `NULL`; `:NEW` holds the values being inserted.
    * **`DELETE`:** `:OLD` holds the values of the row being deleted; all `:NEW` fields are `NULL`.
    * **`UPDATE`:** `:OLD` holds the original values; `:NEW` holds the new values.
  * **A, C, D are incorrect:** `:OLD` and `:NEW` are only valid in row-level triggers (`FOR EACH ROW`).
</details>

---

### Question 11
**Why does the following `CREATE TRIGGER` statement fail to compile with `ORA-04084: cannot change NEW values for this trigger type`?**

```sql
CREATE OR REPLACE TRIGGER trg_upper_name
AFTER INSERT OR UPDATE ON employees
FOR EACH ROW
BEGIN
    :NEW.last_name := UPPER(:NEW.last_name);
END;
```

* A. Because the `UPPER` function cannot be used inside a trigger.
* B. Because you cannot modify (assign values to) `:NEW` fields inside an `AFTER EACH ROW` trigger; modifying `:NEW` is only allowed in a `BEFORE EACH ROW` trigger.
* C. Because it is missing a `WHEN (NEW.last_name IS NOT NULL)` clause.
* D. Because the colon `:` prefix before `NEW` is not allowed in the trigger body.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** By the time an **`AFTER EACH ROW`** trigger fires, the row has already been written to the table block. Therefore, assigning to `:NEW.column` in an `AFTER` trigger is prohibited and fails with **`ORA-04084: cannot change NEW values for this trigger type`**. To modify `:NEW` column values, you **must use a `BEFORE INSERT OR UPDATE ... FOR EACH ROW` trigger**.
  * **A, C, D are incorrect:** Inside the `BEGIN ... END` block, the colon prefix `:NEW` is required.
</details>

---

### Question 12
**Which `CREATE TRIGGER` statement uses the VALID syntax for both the `WHEN` condition clause and the `NEW` / `OLD` pseudorecords?**

```sql
-- Choose the option with valid syntax:
```

* A. `CREATE OR REPLACE TRIGGER trg_sal BEFORE UPDATE ON employees FOR EACH ROW WHEN (:NEW.salary > :OLD.salary) BEGIN :NEW.commission_pct := 0.1; END;`
* B. `CREATE OR REPLACE TRIGGER trg_sal BEFORE UPDATE ON employees FOR EACH ROW WHEN (NEW.salary > OLD.salary) BEGIN NEW.commission_pct := 0.1; END;`
* C. `CREATE OR REPLACE TRIGGER trg_sal BEFORE UPDATE ON employees FOR EACH ROW WHEN (NEW.salary > OLD.salary) BEGIN :NEW.commission_pct := 0.1; END;`
* D. `CREATE OR REPLACE TRIGGER trg_sal BEFORE UPDATE ON employees WHEN (NEW.salary > OLD.salary) BEGIN NULL; END;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:**
    1. Inside the trigger header's **`WHEN (...)` clause**: You **must NOT use a colon `:`** before `NEW` or `OLD` (`WHEN (NEW.salary > OLD.salary)`).
    2. Inside the PL/SQL body (`DECLARE ... BEGIN ... END`): You **MUST use a colon `:`** (`:NEW.commission_pct := 0.1;`).
  * **A is incorrect:** Using `:NEW` and `:OLD` with colons inside `WHEN (...)` causes `ORA-04076: invalid NEW or OLD specification`.
  * **B is incorrect:** Missing the colon `:` before `NEW.commission_pct` in the PL/SQL body.
  * **D is incorrect:** The `WHEN` clause is only allowed on row-level triggers (`FOR EACH ROW` is missing, causing `ORA-04077`).
</details>

---

### Question 13
**Inside a multi-event DML trigger defined as `BEFORE INSERT OR UPDATE OR DELETE ON employees`, which two conditional predicate usages are VALID for checking the triggering event? (Choose two.)**

* A. `IF INSERTING THEN ... ELSIF UPDATING('SALARY') THEN ... ELSIF DELETING THEN ...`
* B. `IF IS_INSERT THEN ... ELSIF IS_UPDATE('SALARY') THEN ...`
* C. `IF UPDATING THEN ...` (checks whether the triggering statement is an `UPDATE` on any column).
* D. `IF SQL%INSERTING THEN ...`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, C**
* **Detailed Explanation:**
  * **A and C are correct:** PL/SQL provides the built-in Boolean conditional predicates **`INSERTING`**, **`DELETING`**, **`UPDATING`** (any column), and **`UPDATING('COLUMN_NAME')`** (specific column).
  * **B, D are incorrect:** `IS_INSERT` and `SQL%INSERTING` do not exist.
</details>

---

### Question 14
**Which two statements are TRUE regarding `INSTEAD OF` triggers in Oracle Database? (Choose two.)**

* A. `INSTEAD OF` triggers can only be created on views (`VIEW`), never on database tables (`TABLE`).
* B. `INSTEAD OF` triggers can be either statement-level or row-level triggers.
* C. Every `INSTEAD OF` trigger is always a row-level trigger, even if `FOR EACH ROW` is omitted from the `CREATE TRIGGER` statement.
* D. You can specify a `WHEN (NEW.id > 0)` clause on an `INSTEAD OF` trigger to filter rows.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, C**
* **Detailed Explanation:**
  * **A is correct:** `INSTEAD OF` triggers can only be defined on views (or nested table columns of views). Attempting to create an `INSTEAD OF` trigger on a table raises **`ORA-25002: cannot create INSTEAD OF triggers on tables`**.
  * **C is correct:** `INSTEAD OF` triggers are **always row-level triggers**, whether or not `FOR EACH ROW` is explicitly written.
  * **B is incorrect:** Statement-level `INSTEAD OF` triggers do not exist.
  * **D is incorrect:** `INSTEAD OF` triggers do not support the `WHEN (...)` clause.
</details>

---

### Question 15
**Examine the `trg_check_sal` trigger on the `EMPLOYEES` table below. What happens when a user executes `UPDATE employees SET salary = salary * 1.1 WHERE department_id = 30;` (assuming department 30 has 6 employees)?**

```sql
CREATE OR REPLACE TRIGGER trg_check_sal
AFTER UPDATE OF salary ON employees
FOR EACH ROW
DECLARE
    v_min_sal NUMBER;
BEGIN
    SELECT MIN(salary) INTO v_min_sal
    FROM employees
    WHERE department_id = :NEW.department_id;

    IF :NEW.salary > v_min_sal * 5 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Salary exceeds 5x minimum salary in department!');
    END IF;
END;
```

* A. The `UPDATE` succeeds for all 6 employees if none violate the condition.
* B. `CREATE TRIGGER` fails to compile because `SELECT` statements are not allowed inside triggers.
* C. The trigger compiles successfully, but executing the `UPDATE` statement fails at runtime with `ORA-04091: table HR.EMPLOYEES is mutating, trigger/function may not see it`.
* D. The trigger raises `ORA-04092: cannot COMMIT in a trigger`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Because `trg_check_sal` is a **row-level trigger (`FOR EACH ROW`)** on `EMPLOYEES`, the `EMPLOYEES` table is in the middle of being modified (mutating) while the `UPDATE` runs. Issuing `SELECT MIN(salary) ... FROM employees` against the same mutating table inside a row-level trigger raises **`ORA-04091: table HR.EMPLOYEES is mutating, trigger/function may not see it`** at runtime.
  * **A, B, D are incorrect:** The trigger compiles cleanly; `ORA-04091` is a runtime error.
</details>

---

### Question 16
**If `trg_check_sal` is defined as `AFTER INSERT OR UPDATE ON employees FOR EACH ROW` and queries `SELECT COUNT(*) FROM employees;`, which DML statement on `EMPLOYEES` will NOT raise `ORA-04091: table is mutating`?**

* A. `UPDATE employees SET salary = 5000 WHERE employee_id = 100;`
* B. `INSERT INTO employees (employee_id, last_name, email, hire_date, job_id, salary) VALUES (999, 'Smith', 'JSMITH', SYSDATE, 'IT_PROG', 5000);` (a single-row `INSERT ... VALUES` statement).
* C. `INSERT INTO employees SELECT * FROM temp_employees;` (an `INSERT ... SELECT` statement).
* D. `DELETE FROM employees WHERE employee_id = 100;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Oracle makes a special exception for a **single-row `INSERT INTO table VALUES (...)` statement**: a row-level trigger fired by a single-row `INSERT ... VALUES` is permitted to query the triggering table without raising `ORA-04091`.
  * **A, C, D are incorrect:** Any `UPDATE`, `DELETE`, or `INSERT INTO ... SELECT ...` (even if the `SELECT` returns only 1 row) raises **`ORA-04091`**.
</details>

---

### Question 17
**What is the recommended modern solution in Oracle (11g and later) to avoid `ORA-04091: table is mutating` when you need to validate row-level `:NEW` values against aggregate data queried from the same table?**

* A. Add `COMMIT;` at the beginning of the row-level trigger before running the `SELECT` query.
* B. Use a **`COMPOUND TRIGGER`**: store the relevant `:NEW` data in a collection variable during the `AFTER EACH ROW` section, and then query the table to validate the business rule in the `AFTER STATEMENT` section.
* C. Add `PRAGMA SERIALLY_REUSABLE;` to the trigger.
* D. Change the trigger from `AFTER EACH ROW` to `BEFORE EACH ROW`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In a **`COMPOUND TRIGGER`**, you capture `:NEW` values into a shared collection inside the `AFTER EACH ROW` section (without querying the table), and then perform the `SELECT` query against the table inside the **`AFTER STATEMENT`** section (where the table is no longer mutating).
  * **A, C, D are incorrect:** `COMMIT` is illegal in a trigger (`ORA-04092`), and both `BEFORE EACH ROW` and `AFTER EACH ROW` suffer from `ORA-04091`.
</details>

---

### Question 18
**What are the four timing-point sections that can be defined inside a table-level `COMPOUND TRIGGER`?**

* A. `BEFORE STATEMENT`, `BEFORE EACH ROW`, `AFTER EACH ROW`, `AFTER STATEMENT`
* B. `INIT STATEMENT`, `FOR EACH ROW`, `INSTEAD OF ROW`, `FINAL STATEMENT`
* C. `START TRIGGER`, `BEFORE ROW`, `AFTER ROW`, `END TRIGGER`
* D. `DECLARE`, `BEGIN`, `EXCEPTION`, `END`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** A `COMPOUND TRIGGER` on a table can include any combination of the four timing-point sections:
    1. `BEFORE STATEMENT IS ... END BEFORE STATEMENT;`
    2. `BEFORE EACH ROW IS ... END BEFORE EACH ROW;`
    3. `AFTER EACH ROW IS ... END AFTER EACH ROW;`
    4. `AFTER STATEMENT IS ... END AFTER STATEMENT;`
  * **B, C, D are incorrect:** On a view, a compound trigger supports `INSTEAD OF EACH ROW`.
</details>

---

### Question 19
**If two triggers `TRG_A` and `TRG_B` on the `EMPLOYEES` table have the exact same timing point (`BEFORE INSERT ON employees FOR EACH ROW`), how can you guarantee that `TRG_B` always fires AFTER `TRG_A`?**

* A. Oracle automatically fires triggers in alphabetical order by name, so `TRG_A` always fires before `TRG_B`.
* B. Specify the **`FOLLOWS trg_a`** clause in `CREATE OR REPLACE TRIGGER trg_b` (or `PRECEDES trg_b` in `trg_a`).
* C. Trigger firing order for the same timing point cannot be controlled in Oracle.
* D. Specify `ORDER BY 2` in `CREATE TRIGGER`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** By default, Oracle does not guarantee the firing order of multiple triggers at the same timing point. Using the **`FOLLOWS <trigger_name>`** (or **`PRECEDES <trigger_name>`**) clause in `CREATE TRIGGER` explicitly enforces the execution sequence.
  * **A, C, D are incorrect:** Never assume alphabetical or creation-time ordering without `FOLLOWS` / `PRECEDES`.
</details>

---

### Question 20
**What happens when an unhandled exception (or `RAISE_APPLICATION_ERROR`) is raised inside a DML trigger?**

* A. Only the trigger body terminates; the triggering DML statement still succeeds.
* B. The entire session transaction is rolled back to the beginning of the session.
* C. The triggering DML statement (along with any DML changes made by the trigger itself) undergoes a **statement-level rollback**, while DML changes from earlier statements in the same transaction remain intact.
* D. The trigger is automatically set to `DISABLED`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** A trigger executes as part of the same atomic statement as its triggering DML statement. If an unhandled exception escapes the trigger, Oracle performs a **statement-level rollback** of the triggering DML statement and any work done by the trigger, leaving prior statements in the transaction untouched.
  * **A, B, D are incorrect:** If the exception is caught and handled inside the trigger without re-raising, the triggering DML succeeds.
</details>

---

### Question 21
**Inside a `PACKAGE BODY`, private procedure `priv_proc_A` (not declared in the specification) is defined at the top of the `PACKAGE BODY` and calls public procedure `pub_proc_B`, which is defined at the bottom of the `PACKAGE BODY`. Is a Forward Declaration required for `pub_proc_B` at the top of the `PACKAGE BODY`?**

* A. Yes, a forward declaration for `pub_proc_B` is required at the top of the `PACKAGE BODY`, or compilation will fail.
* B. No forward declaration is required for `pub_proc_B` because its header is already declared in the `PACKAGE SPECIFICATION` (forward declarations are only needed for mutually recursive private subprograms not listed in the specification).
* C. A private procedure cannot call a public procedure in the same package.
* D. All public procedures must be placed before private procedures in a `PACKAGE BODY`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Every subprogram declared in the **`PACKAGE SPECIFICATION`** automatically acts as a forward declaration visible throughout the entire `PACKAGE BODY`. Thus, `priv_proc_A` can call `pub_proc_B` regardless of their order in the `PACKAGE BODY`.
  * **A, C, D are incorrect:** Forward declarations inside a `PACKAGE BODY` are only needed for **private** subprograms called before their body definition.
</details>

---

### Question 22
**A developer wants to write an audit record to `AUDIT_LOGS` whenever a user attempts an `UPDATE` on `EMPLOYEES.SALARY`, such that the audit record is preserved EVEN IF the `UPDATE` fails or the user subsequently issues a `ROLLBACK`. What is the correct implementation?**

* A. Put `INSERT INTO audit_logs ...; COMMIT;` directly inside a normal `BEFORE UPDATE ON employees` trigger.
* B. Create a logging procedure declared with `PRAGMA AUTONOMOUS_TRANSACTION;` (containing `INSERT INTO audit_logs` and `COMMIT;`) and call it from the trigger (or declare `PRAGMA AUTONOMOUS_TRANSACTION;` in the trigger itself).
* C. Use an `AFTER UPDATE` trigger instead of a `BEFORE UPDATE` trigger.
* D. Use the `KEEP LOGS ON ROLLBACK` clause when creating the trigger.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** By default, a trigger runs in the main transaction and cannot issue `COMMIT` (`ORA-04092`), and any `INSERT` it performs is rolled back if the main transaction rolls back. Using **`PRAGMA AUTONOMOUS_TRANSACTION;`** executes the audit `INSERT` and `COMMIT;` in an independent child transaction that persists even if the main statement rolls back.
  * **A, C, D are incorrect:** Issuing `COMMIT` in a non-autonomous trigger raises `ORA-04092: cannot COMMIT in a trigger`.
</details>

---

### Question 23
**When does an active database session (Session 1) encounter the runtime error `ORA-04068: existing state of packages has been discarded`?**

* A. Whenever Session 1 calls a bodiless package without variables.
* B. When Session 1 has already instantiated a stateful package (a package with global variables, constants, or cursors), Session 2 recompiles (`CREATE OR REPLACE`) that package, and Session 1 subsequently calls the package again.
* C. Whenever Session 1 issues a `ROLLBACK` after calling a package.
* D. When a stateless package is called concurrently by two sessions.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** A package is **stateful** if its specification or body declares at least one package-level variable, constant, or cursor. If Session 1 has instantiated that state in its UGA and another session recompiles the package, Session 1's cached state becomes invalid, raising **`ORA-04068: existing state of packages has been discarded`** on Session 1's next call to the package.
  * **A, C, D are incorrect:** Stateless packages (with no package-level variables/constants/cursors) do not raise `ORA-04068` when recompiled.
</details>

---

### Question 24
**If an unhandled exception is raised inside a Package Initialization Block (`BEGIN ... END` at the end of the `PACKAGE BODY`) during the first call to the package in a session, what happens on the second call to the package in the same session?**

* A. The package is permanently locked for the rest of the session.
* B. Because the first initialization attempt failed before completing, the package is considered uninitialized, and Oracle re-executes the variable initializations and the Package Initialization Block on the second call.
* C. On the second call, Oracle skips the initialization block and runs the called subprogram with all package variables set to `NULL`.
* D. The package is marked `INVALID` in `USER_OBJECTS`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** A package is only marked as initialized in a session once its variable declarations and initialization block **complete without an unhandled exception**. If initialization fails with an unhandled exception on the first call, Oracle attempts to initialize the package again on the next call in that session.
  * **A, C, D are incorrect:** A runtime exception in the initialization block does not invalidate the compiled object in the data dictionary.
</details>

---

### Question 25
**Which SQL statement disables ALL triggers on the `EMPLOYEES` table at once?**

* A. `DROP ALL TRIGGERS ON employees;`
* B. `ALTER TRIGGER ALL ON employees DISABLE;`
* C. `ALTER TABLE employees DISABLE ALL TRIGGERS;`
* D. `DISABLE TRIGGERS FROM employees;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:**
    * To disable a single trigger: `ALTER TRIGGER trigger_name DISABLE;`
    * To disable all triggers on a table simultaneously: **`ALTER TABLE table_name DISABLE ALL TRIGGERS;`** (and `ALTER TABLE table_name ENABLE ALL TRIGGERS;`).
  * **A, B, D are incorrect:** Invalid SQL syntax.
</details>

---
