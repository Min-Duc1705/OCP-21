# Review Questions - Chapter 24: Exception Handling in PL/SQL

> **Reference:** *OCP Oracle Database Program with PL/SQL Study Guide (Exam 1Z0-149)*  
> **Total Questions:** 25 multiple-choice questions aligned with the Oracle OCP 1Z0-149 exam, complete with detailed explanations.  
> **How to study:** Read each question carefully and choose your answer first, then click **"👉 View Answer & Detailed Explanation"** to verify your answer and review the exam traps.

---

### Question 1
**Which `EXCEPTION` handler syntax is VALID in PL/SQL?**

* A. `WHEN NO_DATA_FOUND, TOO_MANY_ROWS THEN DBMS_OUTPUT.PUT_LINE('Error');`
* B. `WHEN OTHERS OR ZERO_DIVIDE THEN DBMS_OUTPUT.PUT_LINE('Error');`
* C. `WHEN NO_DATA_FOUND OR TOO_MANY_ROWS THEN DBMS_OUTPUT.PUT_LINE('Error');`
* D. `WHEN SQLCODE = -1403 THEN DBMS_OUTPUT.PUT_LINE('Error');`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Multiple exceptions in a single `WHEN` handler must be separated by the **`OR`** keyword (`WHEN ex1 OR ex2 THEN`).
  * **A is incorrect:** Separating exception names with a comma `,` causes a compilation error (`PLS-00103`).
  * **B is incorrect:** `WHEN OTHERS` must appear alone as the very last handler and cannot be combined with any other exception using `OR` (`PLS-00370`).
  * **D is incorrect:** Boolean expressions such as `SQLCODE = -1403` are not valid in a `WHEN` exception clause.
</details>

---

### Question 2
**What is the difference between the exceptions raised by Block 1 and Block 2 below?**

```sql
-- Block 1:
DECLARE
    v_num NUMBER;
BEGIN
    v_num := TO_NUMBER('123A');
END;
/

-- Block 2:
DECLARE
    v_num NUMBER;
BEGIN
    SELECT TO_NUMBER('123A') INTO v_num FROM dual;
END;
```

* A. Both blocks raise `INVALID_NUMBER` (`ORA-01722`).
* B. Both blocks raise `VALUE_ERROR` (`ORA-06502`).
* C. Block 1 raises `VALUE_ERROR` (`ORA-06502`), whereas Block 2 raises `INVALID_NUMBER` (`ORA-01722`).
* D. Block 1 raises `INVALID_NUMBER` (`ORA-01722`), whereas Block 2 raises `VALUE_ERROR` (`ORA-06502`).

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** This is a classic OCP 1Z0-149 exam distinction:
    * In **Block 1**, `TO_NUMBER('123A')` is evaluated inside a **procedural PL/SQL assignment statement**. Conversion or size-overflow errors in the PL/SQL engine always raise **`VALUE_ERROR` (`ORA-06502`)**.
    * In **Block 2**, `TO_NUMBER('123A')` is evaluated inside a **SQL `SELECT` statement** by the SQL engine. When the SQL engine fails to convert a string to a number, it raises `ORA-01722`, which maps to the predefined exception **`INVALID_NUMBER`**.
  * **A, B, D are incorrect:** Handling only `WHEN VALUE_ERROR` in Block 2 will fail to catch `INVALID_NUMBER` (`ORA-01722`).
</details>

---

### Question 3
**Which two operations raise the predefined `NO_DATA_FOUND` (`ORA-01403`) exception in PL/SQL? (Choose two.)**

* A. Executing `UPDATE employees SET salary = 5000 WHERE employee_id = -999;` (when no rows match the `WHERE` clause).
* B. Executing `SELECT first_name INTO v_name FROM employees WHERE employee_id = -999;` (when no rows match the `WHERE` clause).
* C. Executing `FETCH c_emp INTO v_rec;` when the explicit cursor `c_emp` has already fetched all rows.
* D. Reading an element at an unpopulated index/key in an `Associative Array (INDEX BY)` collection.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B, D**
* **Detailed Explanation:**
  * **B is correct:** An implicit `SELECT ... INTO` statement must return exactly 1 row; returning 0 rows immediately raises `NO_DATA_FOUND`.
  * **D is correct:** Referencing a non-existent index key in an associative array (e.g., `v_x := v_assoc_arr(99);`) raises `NO_DATA_FOUND` (`ORA-01403`).
  * **A is incorrect:** DML statements (`UPDATE`, `DELETE`) affecting 0 rows never raise `NO_DATA_FOUND`; they simply set `SQL%NOTFOUND := TRUE` and `SQL%ROWCOUNT := 0`.
  * **C is incorrect:** Fetching past the last row of an explicit cursor does not raise an exception; it sets `c_emp%NOTFOUND := TRUE`.
</details>

---

### Question 4
**What values are returned by the `SQLCODE` function when handling the predefined `NO_DATA_FOUND` (`ORA-01403`) exception versus a `User-Defined Exception` (without `PRAGMA EXCEPTION_INIT`)?**

* A. `-1403` for `NO_DATA_FOUND` and `-1` for a `User-Defined Exception`.
* B. `+100` for `NO_DATA_FOUND` and `+1` for a `User-Defined Exception`.
* C. `-100` for `NO_DATA_FOUND` and `0` for a `User-Defined Exception`.
* D. `+1403` for `NO_DATA_FOUND` and `-20000` for a `User-Defined Exception`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Almost all Oracle errors return a negative number from `SQLCODE`, with two notable **positive** exceptions:
    1. **`NO_DATA_FOUND`** (`ORA-01403`): Per the ANSI SQL standard, `SQLCODE` returns **`+100`** (not `-1403`).
    2. **`User-Defined Exception`** (not associated with `PRAGMA EXCEPTION_INIT`): `SQLCODE` returns **`+1`** (and `SQLERRM` returns `'User-Defined Exception'`).
  * **A, C, D are incorrect:** `-1` is `DUP_VAL_ON_INDEX` (`ORA-00001`), and `0` is returned when no exception is active.
</details>

---

### Question 5
**When a PL/SQL `CASE` statement (not a `CASE` expression) is executed, no `WHEN` condition matches, and there is no `ELSE` clause, which exception is raised?**

* A. `NO_DATA_FOUND` (`ORA-01403`)
* B. `VALUE_ERROR` (`ORA-06502`)
* C. `CASE_NOT_FOUND` (`ORA-06592`)
* D. No exception is raised; execution continues with the next statement.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:**
    * A **`CASE` expression** (`v_res := CASE WHEN ... END;`) without a matching branch and without `ELSE` simply returns **`NULL`**.
    * A **`CASE` statement** (`CASE WHEN ... THEN ... END CASE;`) without a matching branch and without `ELSE` raises the predefined exception **`CASE_NOT_FOUND` (`ORA-06592: CASE not found while executing CASE statement`)**.
  * **A, B, D are incorrect:** Unlike an `IF` statement without `ELSE`, a `CASE` statement without `ELSE` raises `CASE_NOT_FOUND` if no condition is met.
</details>

---

### Question 6
**Oracle error `ORA-01400: cannot insert NULL into (...)` occurs when an `INSERT` statement attempts to insert `NULL` into a `NOT NULL` column. How can you trap this specific error in PL/SQL WITHOUT using `WHEN OTHERS`?**

* A. Write `WHEN CANNOT_INSERT_NULL THEN` directly because it is a predefined exception.
* B. Write `WHEN ORA_01400 THEN` in the `EXCEPTION` section.
* C. Declare `e_null_err EXCEPTION;` and `PRAGMA EXCEPTION_INIT(e_null_err, -1400);` in the `DECLARE` section, then handle it with `WHEN e_null_err THEN`.
* D. Declare `e_null_err EXCEPTION;` in `DECLARE`, place `RAISE e_null_err;` after the `INSERT` statement, and handle `WHEN e_null_err THEN`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `ORA-01400` (along with `ORA-02291` and `ORA-02292`) is an internally defined **Non-Predefined Oracle Exception** (it has an `ORA-` code but no predefined name in `STANDARD`). To catch it by name, declare an `EXCEPTION` identifier and associate it with `-1400` using **`PRAGMA EXCEPTION_INIT(e_null_err, -1400);`**. Oracle then raises `e_null_err` implicitly whenever `ORA-01400` occurs.
  * **A, B are incorrect:** Neither `CANNOT_INSERT_NULL` nor `ORA_01400` exists in `STANDARD`.
  * **D is incorrect:** When `INSERT` fails with `ORA-01400`, control jumps immediately to `EXCEPTION`, skipping any `RAISE` statement after `INSERT`.
</details>

---

### Question 7
**Examine the following `EXCEPTION` block. Why does this PL/SQL block fail to compile?**

```sql
DECLARE
    v_sal NUMBER;
BEGIN
    SELECT salary INTO v_sal FROM employees WHERE employee_id = -1;
EXCEPTION
    WHEN OTHERS THEN
        INSERT INTO err_audit_table (err_date, err_code, err_msg)
        VALUES (SYSDATE, SQLCODE, SQLERRM);
        COMMIT;
END;
```

* A. Because `INSERT` and `COMMIT` statements are not allowed inside an `EXCEPTION` block.
* B. Because `SQLCODE` and `SQLERRM` are procedural PL/SQL functions that cannot be called directly inside a SQL statement (`INSERT INTO ... VALUES (..., SQLCODE, SQLERRM)`).
* C. Because `WHEN OTHERS` cannot catch `NO_DATA_FOUND`.
* D. Because `SQLERRM` requires `SQLERRM(SQLCODE)` as an argument.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `SQLCODE` and `SQLERRM` are built-in PL/SQL functions that **cannot be referenced directly inside a SQL statement** (`ORA-00904` / `PLS-00231: function 'SQLCODE' may not be used in SQL`).
  * **Correct approach:** Assign `v_code := SQLCODE;` and `v_msg := SQLERRM;` to local PL/SQL variables first, then use `VALUES (SYSDATE, v_code, v_msg);`.
  * **A, C, D are incorrect:** `INSERT`, `COMMIT`, and parameterless `SQLERRM` (in PL/SQL expressions) are all valid in an `EXCEPTION` block.
</details>

---

### Question 8
**What is the output when the following nested PL/SQL block is executed?**

```sql
BEGIN
    DBMS_OUTPUT.PUT_LINE('Start Outer');
    DECLARE
        v_code VARCHAR2(3) := 'ORACLE';
    BEGIN
        DBMS_OUTPUT.PUT_LINE('Inside Inner: ' || v_code);
    EXCEPTION
        WHEN VALUE_ERROR THEN
            DBMS_OUTPUT.PUT_LINE('Caught VALUE_ERROR in Inner');
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Caught OTHERS in Inner');
    END;
    DBMS_OUTPUT.PUT_LINE('End Outer');
EXCEPTION
    WHEN VALUE_ERROR THEN
        DBMS_OUTPUT.PUT_LINE('Caught VALUE_ERROR in Outer');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Caught OTHERS in Outer');
END;
```

* A. `Start Outer` -> `Caught VALUE_ERROR in Inner` -> `End Outer`
* B. `Start Outer` -> `Caught OTHERS in Inner` -> `End Outer`
* C. `Start Outer` -> `Caught VALUE_ERROR in Outer`
* D. `Start Outer` -> `Caught VALUE_ERROR in Inner` -> `Caught VALUE_ERROR in Outer`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** This tests the **Declaration Exception Propagation rule**:
    1. `Start Outer` is printed.
    2. In the `DECLARE` section of the inner block, initializing `v_code VARCHAR2(3) := 'ORACLE';` raises **`VALUE_ERROR` (`ORA-06502`)**.
    3. **Key Rule:** A block's `EXCEPTION` section **only catches exceptions raised in its own `BEGIN` (executable) section**—it **never** catches exceptions raised in its own `DECLARE` section!
    4. Therefore, the inner block's `EXCEPTION` section is bypassed completely, and `VALUE_ERROR` propagates directly to the **outer block's `EXCEPTION` section** (skipping `End Outer`), printing `Caught VALUE_ERROR in Outer`.
  * **A, B, D are incorrect:** Always check whether an initialization error occurs in `DECLARE` or `BEGIN`.
</details>

---

### Question 9
**Examine the following PL/SQL block where a new exception is raised inside the inner block's `EXCEPTION` section. What is the output?**

```sql
BEGIN
    BEGIN
        RAISE ZERO_DIVIDE;
    EXCEPTION
        WHEN ZERO_DIVIDE THEN
            DBMS_OUTPUT.PUT_LINE('1. Caught ZERO_DIVIDE in inner');
            RAISE NO_DATA_FOUND;
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('2. Caught NO_DATA_FOUND in inner');
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('3. Caught OTHERS in inner');
    END;
    DBMS_OUTPUT.PUT_LINE('4. Continue outer');
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('5. Caught NO_DATA_FOUND in outer');
END;
```

* A. Lines `1`, `2`, and `4`.
* B. Lines `1`, `3`, and `4`.
* C. Lines `1` and `5`.
* D. It fails to compile because `RAISE` is not allowed inside an `EXCEPTION` handler.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:**
    1. `RAISE ZERO_DIVIDE;` enters `WHEN ZERO_DIVIDE THEN` in the inner block, printing **`1. Caught ZERO_DIVIDE in inner`**.
    2. Next, `RAISE NO_DATA_FOUND;` is executed **inside the inner block's `EXCEPTION` handler**.
    3. **Key Rule:** An exception raised inside an `EXCEPTION` handler **cannot be caught by sibling `WHEN` handlers in the same `EXCEPTION` section** (so handlers `2` and `3` are skipped). It propagates immediately to the **enclosing block's `EXCEPTION` section**, skipping line `4` and printing **`5. Caught NO_DATA_FOUND in outer`**.
  * **A, B, D are incorrect:** Only one `WHEN` branch can ever execute in a given `EXCEPTION` section.
</details>

---

### Question 10
**Which two statements are TRUE regarding the standalone `RAISE;` statement (without an exception name)? (Choose two.)**

* A. `RAISE;` can be placed anywhere in the `BEGIN` or `EXCEPTION` section of a PL/SQL block.
* B. `RAISE;` is only valid inside an `EXCEPTION` handler; placing it in the `BEGIN` section causes compilation error `PLS-00367`.
* C. `RAISE;` re-raises the current active exception and propagates it to the enclosing block (or caller) without requiring the exception name to be specified.
* D. `RAISE;` clears the error stack and resets `SQLCODE` to `0`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B, C**
* **Detailed Explanation:**
  * **B is correct:** Using `RAISE;` with no exception name outside an `EXCEPTION` handler causes **`PLS-00367: a RAISE statement with no exception name must be inside an exception handler`**.
  * **C is correct:** Inside a `WHEN ... THEN` handler (especially `WHEN OTHERS`), `RAISE;` re-raises the exact same exception to the outer block after local logging or cleanup.
  * **A, D are incorrect:** `RAISE;` preserves the original `SQLCODE` and error stack.
</details>

---

### Question 11
**When calling `RAISE_APPLICATION_ERROR(error_number, message [, keep_errors])`, what is the valid range for `error_number`, and what happens if you pass `-19999`?**

* A. The valid range is `-20000` to `-20999`. Passing `-19999` raises the runtime error `ORA-21000: error number argument to raise_application_error of -19999 is out of range`.
* B. The valid range is `-1` to `-20999`. Passing `-19999` is valid.
* C. The valid range is `20000` to `20999` (positive integers). Passing a negative number causes a compilation error.
* D. The valid range is `-20000` to `-29999`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** Oracle reserves the integer range **`-20000` through `-20999`** for user-defined application errors via `RAISE_APPLICATION_ERROR`. Passing any number outside this range (such as `-19999`, `-21000`, or positive `20001`) raises **`ORA-21000: error number argument to raise_application_error of ... is out of range`** at runtime.
  * **B, C, D are incorrect:** Memorize the exact range `-20000 .. -20999`.
</details>

---

### Question 12
**What is the effect of passing `TRUE` for the third parameter `keep_errors` (default `FALSE`) in `RAISE_APPLICATION_ERROR(error_number, message, keep_errors)` inside an `EXCEPTION` handler?**

* A. It automatically logs the error to the `USER_ERRORS` dictionary view.
* B. It prevents prior DML statements from being rolled back when the exception escapes to the client.
* C. It places the new user-defined error (`-20xxx`) on top of the existing error stack rather than replacing it, preserving the original underlying error cause.
* D. It allows execution to continue with the statement immediately following `RAISE_APPLICATION_ERROR`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:**
    * When `keep_errors => FALSE` (the default), the new `-20xxx` error replaces any prior errors on the stack.
    * When `keep_errors => TRUE`, the new `-20xxx` error is prepended to the existing error stack so the caller sees both the high-level application message and the underlying root-cause `ORA-` error.
  * **A, B, D are incorrect:** `RAISE_APPLICATION_ERROR` always raises an exception and halts normal execution of the current block.
</details>

---

### Question 13
**Examine the stored function `fn_find_dept` below. Assume the `DEPARTMENTS` table has no row with `department_id = 999`. What happens when you execute the SQL query `SELECT fn_find_dept(999) FROM dual;`?**

```sql
CREATE OR REPLACE FUNCTION fn_find_dept (p_id NUMBER)
RETURN VARCHAR2 IS
    v_name departments.department_name%TYPE;
BEGIN
    SELECT department_name INTO v_name
    FROM departments
    WHERE department_id = p_id;
    RETURN v_name;
END fn_find_dept;
```

* A. The `SELECT` statement fails with `ORA-01403: no data found`.
* B. The `SELECT` statement succeeds and returns 1 row with a `NULL` value (because when an unhandled `NO_DATA_FOUND` exception escapes a PL/SQL function into the SQL engine, the SQL engine treats it as end-of-fetch and evaluates the function result to `NULL`).
* C. The `SELECT` statement fails with `ORA-06503: PL/SQL: Function returned without value`.
* D. The `SELECT` statement returns 0 rows.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** This is a famous SQL-to-PL/SQL boundary behavior tested on the OCP exam:
    * Calling `v_x := fn_find_dept(999);` inside a **PL/SQL block** raises `ORA-01403: no data found`.
    * Calling `SELECT fn_find_dept(999) FROM dual;` inside a **SQL query** causes the SQL engine to intercept `ORA-01403` (`NO_DATA_FOUND`) and substitute **`NULL`** as the function's return value without raising an error!
  * **A, C, D are incorrect:** Other unhandled exceptions (such as `TOO_MANY_ROWS` or `ZERO_DIVIDE`) still cause the SQL query to fail; only `NO_DATA_FOUND` is silently converted to `NULL` by the SQL engine.
</details>

---

### Question 14
**Assume the `LOGS(step_no NUMBER)` table is empty (0 rows). After executing the following PL/SQL block, which rows are present in the `LOGS` table?**

```sql
BEGIN
    INSERT INTO logs VALUES (1);
    BEGIN
        INSERT INTO logs VALUES (2);
        RAISE ZERO_DIVIDE;
        INSERT INTO logs VALUES (3);
    EXCEPTION
        WHEN ZERO_DIVIDE THEN
            INSERT INTO logs VALUES (4);
    END;
    INSERT INTO logs VALUES (5);
END;
```

* A. Only `4` and `5` (because `1` and `2` are automatically rolled back when `ZERO_DIVIDE` is raised).
* B. Only `1`, `4`, and `5` (because `2` is inside the failed inner block and is rolled back).
* C. `1`, `2`, `4`, and `5` (because raising and catching a PL/SQL exception does NOT roll back previously executed DML statements).
* D. No rows, because there is no `COMMIT` statement.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Raising and handling an exception in PL/SQL **never automatically rolls back** DML statements that already succeeded prior to the exception!
    * `INSERT 1` succeeds.
    * Inside the inner block, `INSERT 2` succeeds.
    * `RAISE ZERO_DIVIDE;` skips `INSERT 3` and jumps to `WHEN ZERO_DIVIDE`, executing `INSERT 4`.
    * The inner block completes normally, and the outer block executes `INSERT 5`.
    * Within the current session's transaction, `LOGS` contains **`1`, `2`, `4`, and `5`**.
  * **A, B, D are incorrect:** Automatic statement-level rollback of the entire PL/SQL block only happens if an **unhandled** exception escapes the outermost PL/SQL block back to the client/host environment.
</details>

---

### Question 15
**Continuing from Question 14, suppose you run the following two statements sequentially in the same session. After Statement 2 fails with an unhandled `ZERO_DIVIDE` exception, which rows remain in the `LOGS` table in the current session?**

```sql
-- Statement 1 (Succeeds):
INSERT INTO logs VALUES (10);

-- Statement 2 (PL/SQL block fails with an unhandled exception):
BEGIN
    INSERT INTO logs VALUES (20);
    INSERT INTO logs VALUES (30);
    RAISE ZERO_DIVIDE;
END;
/
```

* A. `LOGS` is empty (0 rows) because an unhandled exception rolls back the entire session transaction.
* B. `LOGS` contains only `10` (because an unhandled exception escaping an outermost PL/SQL block triggers a statement-level rollback of that PL/SQL block only—rolling back `20` and `30` while preserving `10` from the earlier statement).
* C. `LOGS` contains `10`, `20`, and `30`.
* D. `LOGS` contains `10` and `20`; only `30` is rolled back.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Oracle establishes an implicit savepoint before each top-level statement sent by the client (including an anonymous PL/SQL block).
    * Statement 1 (`INSERT 10`) succeeds.
    * Statement 2 (`BEGIN ... END;`) inserts `20` and `30`, then fails with an **unhandled `ZERO_DIVIDE` exception**. Oracle performs a **statement-level rollback** back to the implicit savepoint at the start of Statement 2.
    * Thus, `20` and `30` are rolled back, while **`10`** remains in the active transaction.
  * **A, C, D are incorrect:** Statement-level rollback undoes only the failed top-level call, not the entire transaction.
</details>

---

### Question 16
**When an exception is raised in a level-3 subprogram and caught by a `WHEN OTHERS` handler in a level-1 subprogram, which function in `DBMS_UTILITY` returns the exact subprogram name and LINE NUMBER in level 3 where the exception was originally raised?**

* A. `DBMS_UTILITY.FORMAT_ERROR_STACK`
* B. `DBMS_UTILITY.FORMAT_CALL_STACK`
* C. `DBMS_UTILITY.FORMAT_ERROR_BACKTRACE`
* D. `SQLERRM`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** **`DBMS_UTILITY.FORMAT_ERROR_BACKTRACE`** returns the call trace starting from the exact subprogram and line number where the exception was originally raised (e.g., `ORA-06512: at "HR.PROC_LEVEL_3", line 14`).
  * **A is incorrect:** `FORMAT_ERROR_STACK` returns the error code and message text (without the 512-byte truncation of `SQLERRM`), but not line numbers.
  * **B is incorrect:** `FORMAT_CALL_STACK` shows the current execution stack at the point where it is called (level 1), not where the exception originated (level 3).
  * **D is incorrect:** `SQLERRM` does not include line numbers.
</details>

---

### Question 17
**Examine the following PL/SQL block where two user-defined exceptions with the same name (`e_my_err`) are declared in both the outer and inner blocks (Exception Shadowing). What is the output?**

```sql
DECLARE
    e_my_err EXCEPTION;
BEGIN
    DECLARE
        e_my_err EXCEPTION;
    BEGIN
        RAISE e_my_err;
    END;
EXCEPTION
    WHEN e_my_err THEN
        DBMS_OUTPUT.PUT_LINE('Caught e_my_err in outer block!');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Caught by WHEN OTHERS in outer block!');
END;
```

* A. `Caught e_my_err in outer block!`
* B. `Caught by WHEN OTHERS in outer block!`
* C. It fails to compile because two exceptions cannot share the same name `e_my_err` in nested blocks.
* D. It terminates without printing anything.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** This is a classic **Exception Scope & Visibility** exam trap:
    * Although both are named `e_my_err`, the outer `e_my_err` and the inner `e_my_err` are **two distinct exceptions**.
    * Inside the inner block, `RAISE e_my_err;` raises the **inner block's `e_my_err`** (which shadows the outer one).
    * Because the inner block has no `EXCEPTION` section, the inner `e_my_err` propagates to the outer block.
    * In the outer block, `WHEN e_my_err THEN` only matches the **outer `e_my_err`**, not the inner `e_my_err`! Consequently, it falls through to **`WHEN OTHERS THEN`**, printing `Caught by WHEN OTHERS in outer block!`.
  * **A, C, D are incorrect:** To raise the outer exception from the inner block, the outer block must be labeled `<<outer_lbl>>` and referenced as `RAISE outer_lbl.e_my_err;`.
</details>

---

### Question 18
**Which predefined exception is raised when the following PL/SQL block is executed?**

```sql
DECLARE
    TYPE t_num_list IS TABLE OF NUMBER;
    v_list t_num_list; -- Not initialized with constructor t_num_list()
BEGIN
    v_list(1) := 100;
END;
```

* A. `ACCESS_INTO_NULL` (`ORA-06530`)
* B. `COLLECTION_IS_NULL` (`ORA-06531`)
* C. `SUBSCRIPT_BEYOND_COUNT` (`ORA-06533`)
* D. `NO_DATA_FOUND` (`ORA-01403`)

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `v_list` is a **Nested Table** (`IS TABLE OF NUMBER` without `INDEX BY`). Until initialized via its constructor (`v_list := t_num_list();`), `v_list` is atomically `NULL`. Assigning to an element or calling any method (other than `.EXISTS`) on a `NULL` nested table or varray raises **`COLLECTION_IS_NULL` (`ORA-06531: Reference to uninitialized collection`)**.
  * **A is incorrect:** `ACCESS_INTO_NULL` (`ORA-06530`) occurs when assigning to an attribute of an uninitialized **Object Type (`CREATE TYPE ... AS OBJECT`)** instance.
  * **C is incorrect:** `SUBSCRIPT_BEYOND_COUNT` (`ORA-06533`) occurs when the collection is initialized (`v_list := t_num_list();`) but not extended before accessing `v_list(1)`.
  * **D is incorrect:** `NO_DATA_FOUND` occurs when reading a non-existent element of an associative array or a deleted element of a nested table.
</details>

---

### Question 19
**If `v_list` in Question 18 is initialized as an empty collection (`v_list := t_num_list();`), but you forget to call `v_list.EXTEND;` before executing `v_list(1) := 100;`, which exception is raised?**

* A. `COLLECTION_IS_NULL` (`ORA-06531`)
* B. `SUBSCRIPT_OUTSIDE_LIMIT` (`ORA-06532`)
* C. `SUBSCRIPT_BEYOND_COUNT` (`ORA-06533`)
* D. `VALUE_ERROR` (`ORA-06502`)

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Once initialized with `v_list := t_num_list();`, the collection is no longer `NULL`, and `v_list.COUNT` is `0`. Referencing index `1` (which exceeds the current `COUNT` of `0`) without calling `.EXTEND` raises **`SUBSCRIPT_BEYOND_COUNT` (`ORA-06533: Subscript beyond count`)**.
  * **A, B, D are incorrect:** `SUBSCRIPT_OUTSIDE_LIMIT` (`ORA-06532`) is raised when an index is $\le 0$ or exceeds the maximum `LIMIT` of a `VARRAY`.
</details>

---

### Question 20
**Examine the following PL/SQL block that associates two exception identifiers with the same Oracle error code `-1` (`ORA-00001`). What happens when you attempt to compile and run this block?**

```sql
DECLARE
    e_dup_1 EXCEPTION;
    e_dup_2 EXCEPTION;
    PRAGMA EXCEPTION_INIT(e_dup_1, -1);
    PRAGMA EXCEPTION_INIT(e_dup_2, -1);
BEGIN
    NULL;
EXCEPTION
    WHEN e_dup_1 THEN
        DBMS_OUTPUT.PUT_LINE('Handler 1');
    WHEN e_dup_2 THEN
        DBMS_OUTPUT.PUT_LINE('Handler 2');
END;
```

* A. It compiles and executes without error.
* B. It fails to compile at the second `PRAGMA EXCEPTION_INIT` line.
* C. It fails to compile in the `EXCEPTION` section (`PLS-00483: exception 'E_DUP_2' may appear in at most one exception handler`) because both `e_dup_1` and `e_dup_2` map to the same Oracle error code `-1` and cannot appear in separate `WHEN` clauses of the same `EXCEPTION` block.
* D. It raises `PROGRAM_ERROR` at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** While you can associate multiple exception identifiers with `-1` in `DECLARE`, two exceptions mapped to the **exact same `ORA-` error code** (including `DUP_VAL_ON_INDEX` and `e_dup_1`, or `e_dup_1` and `e_dup_2`) **cannot appear in separate `WHEN` handlers of the same `EXCEPTION` block**. The compiler rejects it with **`PLS-00483: exception '...' may appear in at most one exception handler`** (combining them in a single handler `WHEN e_dup_1 OR e_dup_2 THEN` is allowed).
  * **A, B, D are incorrect:** Duplicate handler detection applies across predefined and pragma-initialized exceptions sharing the same error number.
</details>

---

### Question 21
**What do `SQLCODE` and `SQLERRM` return when called inside the `BEGIN` section while NO exception is active?**

* A. `SQLCODE` returns `NULL` and `SQLERRM` returns `NULL`.
* B. `SQLCODE` returns `0` and `SQLERRM` returns `'ORA-0000: normal, successful completion'`.
* C. It fails to compile because `SQLCODE` and `SQLERRM` are only allowed inside an `EXCEPTION` section.
* D. `SQLCODE` returns `100` and `SQLERRM` returns `'No Error'`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Calling `SQLCODE` and `SQLERRM` inside the `BEGIN` section is syntactically valid. When no exception is active, `SQLCODE` returns **`0`** and `SQLERRM` returns **`'ORA-0000: normal, successful completion'`**.
  * **A, C, D are incorrect:** Only standalone `RAISE;` is restricted to the `EXCEPTION` section.
</details>

---

### Question 22
**Which `PRAGMA EXCEPTION_INIT` declaration is VALID?**

* A. `PRAGMA EXCEPTION_INIT(-2292, e_child_record);`
* B. `PRAGMA EXCEPTION_INIT(e_no_data, 100);`
* C. `PRAGMA EXCEPTION_INIT(e_custom, 0);`
* D. `PRAGMA EXCEPTION_INIT(e_custom, 20001);`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The syntax is `PRAGMA EXCEPTION_INIT(exception_name, error_number);`, where `error_number` must be either positive **`100`** (`NO_DATA_FOUND`) or a valid **negative** Oracle error code (such as `-2292`, `-20001`, etc.).
  * **A is incorrect:** Arguments are reversed.
  * **C and D are incorrect:** Passing `0` or any positive integer other than `100` causes **`PLS-00701: illegal ORACLE error number for PRAGMA EXCEPTION_INIT`**.
</details>

---

### Question 23
**What is the output when the following PL/SQL block is executed?**

```sql
DECLARE
    v_x NUMBER := 0;
BEGIN
    FOR i IN 1..3 LOOP
        BEGIN
            IF i = 2 THEN
                v_x := 10 / 0;
            END IF;
            v_x := v_x + i;
        EXCEPTION
            WHEN ZERO_DIVIDE THEN
                v_x := v_x + 10;
        END;
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('v_x = ' || v_x);
END;
```

* A. `v_x = 1`
* B. `v_x = 11`
* C. `v_x = 14`
* D. `v_x = 16`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Because the body of `FOR i IN 1..3 LOOP` is wrapped in an inner `BEGIN ... EXCEPTION ... END;` block, the exception on iteration `i = 2` is handled locally inside the inner block, allowing the `FOR` loop to continue to `i = 3`:
    * **`i = 1`:** `v_x := 0 + 1 = 1`.
    * **`i = 2`:** `10 / 0` raises `ZERO_DIVIDE` -> skips `v_x := v_x + i;`, jumps to `WHEN ZERO_DIVIDE`: `v_x := 1 + 10 = 11`.
    * **`i = 3`:** `v_x := 11 + 3 = 14`.
    * Prints **`v_x = 14`**.
  * **A, B, D are incorrect:** Wrapping loop bodies in an inner block is the standard pattern for continuing a loop after an exception.
</details>

---

### Question 24
**What happens if you execute `RAISE NO_DATA_FOUND;` explicitly inside a `BEGIN` section?**

* A. It fails to compile because `RAISE` can only be used with user-defined exceptions, not predefined Oracle exceptions.
* B. It is completely valid; PL/SQL raises `NO_DATA_FOUND` (`SQLCODE = 100`) just as if a `SELECT ... INTO` statement had returned zero rows.
* C. It is valid, but `SQLCODE` becomes `+1` like a user-defined exception.
* D. It is valid, but it can only be caught by `WHEN OTHERS`, not `WHEN NO_DATA_FOUND`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `RAISE exception_name;` can explicitly raise **any named exception**—including user-defined exceptions, pragma-initialized exceptions, and **predefined Oracle exceptions** (`RAISE NO_DATA_FOUND;`, `RAISE VALUE_ERROR;`, `RAISE ZERO_DIVIDE;`). It retains its normal `SQLCODE` (`100`) and is caught by `WHEN NO_DATA_FOUND THEN`.
  * **A, C, D are incorrect:** Explicitly raising predefined exceptions is a common and valid practice in PL/SQL.
</details>

---

### Question 25
**Given an Object Type created with `CREATE OR REPLACE TYPE t_address AS OBJECT (city VARCHAR2(50), zip VARCHAR2(10));`, which exception is raised when the following PL/SQL block is executed?**

```sql
DECLARE
    v_addr t_address; -- Not initialized with constructor t_address(NULL, NULL)
BEGIN
    v_addr.city := 'Hanoi';
END;
```

* A. `COLLECTION_IS_NULL` (`ORA-06531`)
* B. `VALUE_ERROR` (`ORA-06502`)
* C. `ACCESS_INTO_NULL` (`ORA-06530`)
* D. No exception is raised; `v_addr.city` is assigned `'Hanoi'` just like a PL/SQL `RECORD`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Unlike a PL/SQL `RECORD` variable (whose fields can be assigned immediately without a constructor), an **Object Type variable (`v_addr t_address;`)** is atomically `NULL` until initialized with its constructor (`v_addr := t_address(NULL, NULL);`). Attempting to assign a value to an attribute of a `NULL` object raises **`ACCESS_INTO_NULL` (`ORA-06530: Reference to uninitialized composite`)**.
  * **A, B, D are incorrect:** Uninitialized Object Type $\rightarrow$ **`ACCESS_INTO_NULL`** (`ORA-06530`); Uninitialized Collection $\rightarrow$ **`COLLECTION_IS_NULL`** (`ORA-06531`).
</details>

---
