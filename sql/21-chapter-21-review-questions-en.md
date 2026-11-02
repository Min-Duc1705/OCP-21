# Review Questions - Chapter 21: PL/SQL Fundamentals

> **Reference:** *Oracle Database PL/SQL Language Reference* & *OCA/OCP Oracle Database SQL & PL/SQL Exam Guide*.  
> **Total Questions:** 25 multiple-choice questions modeled after the official Oracle OCA/OCP exam with detailed explanations.  
> **How to study:** Read each question carefully and choose your answer first, then click **"👉 View Answer & Detailed Explanation"** to check the official answer and understand key exam traps.

---

### Question 1
**In the structure of an anonymous PL/SQL block, which sections are MANDATORY for the block to compile successfully?**

* A. All 4 sections (`DECLARE`, `BEGIN`, `EXCEPTION`, and `END;`) are mandatory
* B. Only the executable `BEGIN` section (containing at least one valid statement or `NULL;`) and the closing `END;` keyword are mandatory; `DECLARE` and `EXCEPTION` are optional
* C. `DECLARE` and `BEGIN` are mandatory, while `END;` is optional
* D. A completely empty `BEGIN ... END;` block (with no statements inside) compiles without error

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In a PL/SQL block, `DECLARE` and `EXCEPTION` are optional. Only **`BEGIN ... END;`** is mandatory, and the `BEGIN` section must contain at least one executable statement (such as `NULL;`).
  * **D is incorrect:** An empty `BEGIN END;` block fails to compile with `PLS-00103: Encountered the symbol "END"`.
</details>

---

### Question 2
**Which of the following variable/constant declarations in the `DECLARE` section of a PL/SQL block will cause a COMPILATION ERROR? (Choose all that apply.)**

```sql
DECLARE
    v_a, v_b   NUMBER := 10;                  -- (1)
    v_name     VARCHAR2(50) NOT NULL;         -- (2)
    c_pi       NUMBER CONSTANT := 3.14;       -- (3)
    c_tax      CONSTANT NUMBER(4,2) := 0.10;  -- (4)
    v_active   BOOLEAN DEFAULT TRUE;          -- (5)
BEGIN
    NULL;
END;
```

* A. Line `(1)`: `v_a, v_b NUMBER := 10;`
* B. Line `(2)`: `v_name VARCHAR2(50) NOT NULL;`
* C. Line `(3)`: `c_pi NUMBER CONSTANT := 3.14;`
* D. Line `(4)`: `c_tax CONSTANT NUMBER(4,2) := 0.10;`
* E. Line `(5)`: `v_active BOOLEAN DEFAULT TRUE;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, B, C**
* **Detailed Explanation:**
  * **A fails to compile:** PL/SQL allows declaring **only one identifier per declaration statement** (comma-separated declarations like `v_a, v_b NUMBER` are illegal).
  * **B fails to compile (`PLS-00218`):** A variable declared with `NOT NULL` **must be initialized with a non-null value** at declaration time.
  * **C fails to compile:** The `CONSTANT` keyword must precede the data type (`c_pi CONSTANT NUMBER := 3.14;`).
  * **D and E are valid.**
</details>

---

### Question 3
**What is the output printed by the following PL/SQL block?**

```sql
DECLARE
    v_bonus  NUMBER;
    v_salary NUMBER := 5000;
    v_total  NUMBER;
BEGIN
    v_total := v_salary + v_bonus;
    DBMS_OUTPUT.PUT_LINE('Total = ' || NVL(TO_CHAR(v_total), 'IS_NULL'));
END;
/
```

* A. `Total = 5000`
* B. `Total = IS_NULL`
* C. `Total = 0`
* D. Compilation error because `v_bonus` is used before being initialized

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In PL/SQL, any uninitialized variable (without `NOT NULL`) defaults to **`NULL`**. Therefore, `v_bonus` is `NULL`, and `5000 + NULL` evaluates to **`NULL`**. `NVL(TO_CHAR(v_total), 'IS_NULL')` returns `'IS_NULL'`, printing **`Total = IS_NULL`**.
</details>

---

### Question 4
**What happens when you compile and execute the PL/SQL block below?**

```sql
DECLARE
    v_is_valid BOOLEAN := TRUE;
BEGIN
    DBMS_OUTPUT.PUT_LINE(v_is_valid);
END;
/
```

* A. It prints `'TRUE'`
* B. It prints `1`
* C. It fails to compile with `PLS-00306: wrong number or types of arguments in call to 'PUT_LINE'` because `DBMS_OUTPUT.PUT_LINE` has no overload that accepts a `BOOLEAN` argument
* D. It prints nothing and completes successfully

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `DBMS_OUTPUT.PUT_LINE` is not overloaded for `BOOLEAN` parameters, and PL/SQL does not implicitly convert `BOOLEAN` to `VARCHAR2`, resulting in compilation error **`PLS-00306`**.
</details>

---

### Question 5
**In the `EMPLOYEES` table, the `SALARY` column is defined as `SALARY NUMBER(8,2) NOT NULL DEFAULT 1000`. In a PL/SQL block, a developer declares: `v_sal employees.salary%TYPE;`. Which statement is TRUE regarding `v_sal`?**

* A. `v_sal` automatically inherits the default value `1000` and the `NOT NULL` constraint
* B. `v_sal` inherits the data type and precision `NUMBER(8,2)` from `employees.salary`, but **does NOT inherit the `NOT NULL` constraint** and **does NOT inherit the `DEFAULT 1000` value** (so `v_sal` is initialized to `NULL`)
* C. The declaration fails to compile because `%TYPE` cannot reference a `NOT NULL` column
* D. `v_sal` inherits `NOT NULL` but not `DEFAULT`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** When `%TYPE` (or `%ROWTYPE`) anchors to a database table column, it inherits **only the data type and size/precision**, and **never inherits the table column's `NOT NULL` constraint or `DEFAULT` value**.
</details>

---

### Question 6
**Examine the nested PL/SQL blocks below. What value is printed by `DBMS_OUTPUT.PUT_LINE`?**

```sql
<<outer_blk>>
DECLARE
    v_num NUMBER := 100;
BEGIN
    DECLARE
        v_num NUMBER := 200;
    BEGIN
        outer_blk.v_num := outer_blk.v_num + v_num;
    END;
    DBMS_OUTPUT.PUT_LINE(v_num);
END outer_blk;
/
```

* A. `100`
* B. `200`
* C. `300`
* D. Compilation error because the inner block cannot declare a variable with the same name `v_num`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Inside the inner block, unqualified `v_num` refers to the inner variable (`200`), while `outer_blk.v_num` qualifies the outer variable (`100`). Thus `outer_blk.v_num := 100 + 200` sets the outer `v_num` to **`300`**, which is then printed after the inner block exits.
</details>

---

### Question 7
**The `EMPLOYEES` table contains 107 rows (all with non-null `employee_id`). A developer runs the PL/SQL block below intending to delete only employee `999` (which does not exist). After executing this block, how many rows are deleted from `EMPLOYEES`?**

```sql
DECLARE
    employee_id NUMBER := 999;
BEGIN
    DELETE FROM employees
    WHERE employee_id = employee_id;
END;
/
```

* A. `0` rows deleted
* B. `1` row deleted
* C. **All 107 rows** in the `EMPLOYEES` table are deleted!
* D. Compilation error `ORA-00918: column ambiguously defined`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Inside an embedded SQL statement, **table column names take precedence over PL/SQL variable names** when they share the exact same identifier! Thus `WHERE employee_id = employee_id` is resolved as comparing the column `employees.employee_id` to itself (which is `TRUE` for all 107 rows), **deleting every row in the table**!
</details>

---

### Question 8
**In PL/SQL, which of the following functions CANNOT be called directly in a procedural assignment statement (e.g., `v_result := func(...);`), and can only be used inside a SQL statement? (Choose two.)**

* A. `NVL(v_a, 0)`
* B. `DECODE(v_status, 'A', 'Active', 'Inactive')`
* C. `NVL2(v_comm, 'Yes', 'No')`
* D. `COALESCE(v_a, v_b, 0)`
* E. `UPPER(v_name)`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B, C**
* **Detailed Explanation:**
  * **B, C are correct:** **`DECODE`** and **`NVL2`** are SQL-only functions and are not built into the procedural PL/SQL engine (`PLS-00204`). In PL/SQL procedural expressions, use `CASE` expressions instead. (`NVL`, `COALESCE`, `UPPER`, `SUBSTR`, `TO_CHAR`, etc. work directly in PL/SQL).
</details>

---

### Question 9
**Examine the `IF - ELSIF - ELSE` block below. What is printed to the output?**

```sql
DECLARE
    v_x NUMBER := 50;
    v_y NUMBER := NULL;
BEGIN
    IF v_x > v_y THEN
        DBMS_OUTPUT.PUT_LINE('Branch 1: v_x > v_y');
    ELSIF v_x <= v_y THEN
        DBMS_OUTPUT.PUT_LINE('Branch 2: v_x <= v_y');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Branch 3: ELSE');
    END IF;
END;
/
```

* A. `Branch 1: v_x > v_y`
* B. `Branch 2: v_x <= v_y`
* C. `Branch 3: ELSE`
* D. Runtime error because a number cannot be compared with `NULL`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Comparing any value to `NULL` using `>` or `<=` yields `NULL` (`UNKNOWN`), not `TRUE`. Since neither the `IF` condition nor the `ELSIF` condition evaluates to `TRUE`, execution falls through to the **`ELSE`** branch and prints **`Branch 3: ELSE`**.
</details>

---

### Question 10
**Which keyword is used for the "else-if" branch in a PL/SQL `IF` control structure?**

* A. `ELSE IF`
* B. `ELSEIF`
* C. `ELSIF`
* D. `ELIF`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** PL/SQL uses the keyword **`ELSIF`** (spelled without the second `E`).
</details>

---

### Question 11
**What is the key runtime difference between a `CASE Statement` and a `CASE Expression` in PL/SQL when there is NO `ELSE` clause and none of the `WHEN` conditions match?**

```sql
-- When no WHEN branch matches and ELSE is omitted:
```

* A. Both return `NULL` without raising an error
* B. Both raise `CASE_NOT_FOUND` (`ORA-06592`)
* C. A `CASE Expression` returns **`NULL`** without error, whereas a `CASE Statement` immediately raises the **`CASE_NOT_FOUND` (`ORA-06592`)** exception!
* D. A `CASE Statement` returns `NULL`, whereas a `CASE Expression` raises `ORA-06592`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** If no `WHEN` condition matches and `ELSE` is omitted:
    * A **`CASE Expression`** silently evaluates to **`NULL`**.
    * A **`CASE Statement`** raises **`CASE_NOT_FOUND` (`ORA-06592: CASE not found while executing CASE statement`)**.
</details>

---

### Question 12
**What output will the following PL/SQL block print?**

```sql
BEGIN
    FOR i IN REVERSE 4..1 LOOP
        DBMS_OUTPUT.PUT(i || ' ');
    END LOOP;
    DBMS_OUTPUT.NEW_LINE;
END;
/
```

* A. `4 3 2 1`
* B. `1 2 3 4`
* C. Nothing is printed (the loop executes `0` times because the lower bound `4` is greater than the upper bound `1`)
* D. Compilation error `PLS-00103`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Even with `REVERSE`, the range in a PL/SQL `FOR` loop must be written as `lower_bound..upper_bound` (`FOR i IN REVERSE 1..4 LOOP`). Writing `4..1` where the first number is greater than the second causes the loop body to execute **0 times** without error.
</details>

---

### Question 13
**What happens when you attempt to compile the PL/SQL block below?**

```sql
BEGIN
    FOR i IN 1..10 LOOP
        i := i + 1;
        DBMS_OUTPUT.PUT_LINE(i);
    END LOOP;
END;
/
```

* A. It prints odd or even numbers between 1 and 10
* B. It fails to compile with `PLS-00363: expression 'I' cannot be used as an assignment target` because the `FOR` loop counter `i` is implicitly declared as **read-only** and cannot be modified inside the loop!
* C. It enters an infinite loop
* D. It prints `11`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The loop index variable `i` of a numeric `FOR` loop is strictly **read-only** (behaving like a `CONSTANT` inside the loop body). Attempting to assign a value to `i` raises compilation error `PLS-00363`.
</details>

---

### Question 14
**What is the output of the following PL/SQL block using `CONTINUE WHEN`?**

```sql
DECLARE
    v_sum NUMBER := 0;
BEGIN
    FOR i IN 1..4 LOOP
        CONTINUE WHEN i = 3;
        v_sum := v_sum + i;
    END LOOP;
    DBMS_OUTPUT.PUT_LINE(v_sum);
END;
/
```

* A. `10`
* B. `7`
* C. `3`
* D. `6`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `CONTINUE WHEN i = 3` skips the rest of iteration `i = 3` and proceeds to `i = 4`. Thus `v_sum` accumulates `1 + 2 + 4 = 7`.
</details>

---

### Question 15
**In PL/SQL, when executing `SELECT ... INTO v_name FROM employees WHERE department_id = 50;` where department `50` contains **45 employees**, which exception is raised?**

* A. `NO_DATA_FOUND` (`ORA-01403`)
* B. `TOO_MANY_ROWS` (`ORA-01422`)
* C. `DUP_VAL_ON_INDEX` (`ORA-00001`)
* D. No exception is raised; `v_name` receives the first employee's name

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `SELECT ... INTO` must return **exactly 1 row**. If it returns `0` rows, it raises `NO_DATA_FOUND` (`ORA-01403`); if it returns `2` or more rows, it raises **`TOO_MANY_ROWS` (`ORA-01422`)**.
</details>

---

### Question 16
**In the `EMPLOYEES` table, no employee belongs to `department_id = 999`. What happens when the PL/SQL block below is executed?**

```sql
DECLARE
    v_max_sal NUMBER;
BEGIN
    SELECT MAX(salary)
    INTO   v_max_sal
    FROM   employees
    WHERE  department_id = 999;

    DBMS_OUTPUT.PUT_LINE('Max Sal = ' || NVL(TO_CHAR(v_max_sal), 'NULL_VAL'));
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Caught NO_DATA_FOUND');
END;
/
```

* A. It jumps to the `EXCEPTION` section and prints `'Caught NO_DATA_FOUND'`
* B. It completes normally without raising `NO_DATA_FOUND` and prints `'Max Sal = NULL_VAL'`
* C. It raises `TOO_MANY_ROWS`
* D. It prints `'Max Sal = 0'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** A `SELECT` query with an aggregate function (`MAX`, `MIN`, `SUM`, `AVG`, `COUNT`) and **no `GROUP BY` clause** always returns **exactly 1 row** (containing `NULL` for `MAX` when no rows match). Because 1 row is returned into `v_max_sal`, `NO_DATA_FOUND` is **never raised**, and the block prints **`Max Sal = NULL_VAL`**.
</details>

---

### Question 17
**Continuing with the `EMPLOYEES` table (where no employee has `department_id = 999`), what is the output of the PL/SQL block below?**

```sql
BEGIN
    UPDATE employees
    SET    salary = salary + 500
    WHERE  department_id = 999;

    DBMS_OUTPUT.PUT_LINE('Rows updated: ' || SQL%ROWCOUNT);
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('No rows found to UPDATE');
END;
/
```

* A. It jumps to `WHEN NO_DATA_FOUND` and prints `'No rows found to UPDATE'`
* B. The `UPDATE` completes normally without raising `NO_DATA_FOUND` and prints `'Rows updated: 0'`
* C. It aborts with `ORA-01403`
* D. It prints `'Rows updated: NULL'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** DML statements (`UPDATE`, `DELETE`) affecting `0` rows **never raise `NO_DATA_FOUND`**. Instead, `SQL%ROWCOUNT` is set to `0` (and `SQL%NOTFOUND` is `TRUE`), so it prints **`Rows updated: 0`**.
</details>

---

### Question 18
**A developer wants to increase the salary of `employee_id = 100` by 10% and retrieve both the employee's `last_name` and new `salary` into PL/SQL variables (`v_lname`, `v_new_sal`) in a SINGLE statement without running a separate `SELECT ... INTO`. Which syntax is valid in Oracle PL/SQL?**

```sql
-- Choose the valid statement:
```

* A. `UPDATE employees SET salary = salary * 1.1 WHERE employee_id = 100 INTO v_lname, v_new_sal;`
* B. `UPDATE employees SET salary = salary * 1.1 WHERE employee_id = 100 RETURNING last_name, salary INTO v_lname, v_new_sal;`
* C. `UPDATE employees SET salary = salary * 1.1 WHERE employee_id = 100 OUTPUT last_name, salary TO v_lname, v_new_sal;`
* D. `SELECT last_name, UPDATE(salary * 1.1) INTO v_lname, v_new_sal FROM employees WHERE employee_id = 100;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The **`RETURNING ... INTO ...`** clause on `INSERT`, `UPDATE`, or `DELETE` statements returns column values from the affected row directly into PL/SQL variables in a single round-trip.
</details>

---

### Question 19
**Given a record variable `r_dept departments%ROWTYPE;` populated with values for a department, which two DML statements using `r_dept` directly are VALID in PL/SQL? (Choose two.)**

* A. `INSERT INTO departments VALUES r_dept;` (without parentheses around `r_dept`)
* B. `INSERT INTO departments VALUES (r_dept);` (with parentheses around `r_dept`)
* C. `UPDATE departments SET ROW = r_dept WHERE department_id = r_dept.department_id;`
* D. `UPDATE departments SET r_dept WHERE department_id = 10;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, C**
* **Detailed Explanation:**
  * **A is correct:** Record-based `INSERT` uses `INSERT INTO table_name VALUES record_var;` (parentheses around `r_dept` are illegal and cause `ORA-00947`).
  * **C is correct:** Record-based `UPDATE` uses `UPDATE table_name SET ROW = record_var WHERE ...;`.
</details>

---

### Question 20
**Examine the PL/SQL block below. Why does it fail to compile?**

```sql
BEGIN
    FOR idx IN 1..5 LOOP
        NULL;
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Final idx: ' || idx);
END;
/
```

* A. Because `NULL;` is not allowed inside a `FOR` loop
* B. Because the loop counter `idx` is implicitly declared with a scope limited strictly to the `FOR` loop; referencing `idx` after `END LOOP;` causes compilation error `PLS-00201: identifier 'IDX' must be declared`
* C. Because `1..5` must be enclosed in parentheses `(1..5)`
* D. Because `idx` is a reserved keyword

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The loop variable `idx` is implicitly declared local to the `FOR` loop and ceases to exist after `END LOOP;`. Referencing it outside the loop raises `PLS-00201`.
</details>

---

### Question 21
**What happens when the following PL/SQL block is executed?**

```sql
DECLARE
    v_max PLS_INTEGER;
BEGIN
    FOR i IN 1..v_max LOOP
        DBMS_OUTPUT.PUT_LINE(i);
    END LOOP;
END;
/
```

* A. The loop executes 0 times and finishes normally
* B. The loop executes 1 time with `i = 1`
* C. It raises the runtime exception `VALUE_ERROR` (`ORA-06502: PL/SQL: numeric or value error`) because the upper bound `v_max` is `NULL`!
* D. It raises `NO_DATA_FOUND`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** If either the lower bound or upper bound of a numeric `FOR` loop evaluates to `NULL` at runtime, PL/SQL immediately raises **`VALUE_ERROR` (`ORA-06502`)**.
</details>

---

### Question 22
**What is the syntactic difference in the closing keywords between a `CASE Statement` and a `CASE Expression` in PL/SQL?**

* A. A `CASE Statement` ends with `END CASE;`, whereas a `CASE Expression` ends with `END`
* B. A `CASE Statement` ends with `END;`, whereas a `CASE Expression` ends with `END CASE`
* C. Both must end with `END CASE;`
* D. Both end with `END IF;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** A procedural **`CASE Statement`** terminates with **`END CASE;`**, whereas a value-returning **`CASE Expression`** terminates with **`END`**.
</details>

---

### Question 23
**In PL/SQL, which integer data type has an implicit `NOT NULL` constraint (requiring initialization at declaration) and performs hardware arithmetic without overflow checking for maximum execution speed?**

* A. `NUMBER`
* B. `PLS_INTEGER`
* C. `SIMPLE_INTEGER`
* D. `BINARY_FLOAT`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `SIMPLE_INTEGER` is a predefined subtype of `PLS_INTEGER` that disallows `NULL` values and skips overflow checking, providing the fastest integer arithmetic in PL/SQL.
</details>

---

### Question 24
**Examine the PL/SQL block using loop labels (`<<outer_loop>>`) below. After the block finishes executing, what is the value of `v_count`?**

```sql
DECLARE
    v_count PLS_INTEGER := 0;
BEGIN
    <<outer_loop>>
    FOR i IN 1..3 LOOP
        <<inner_loop>>
        FOR j IN 1..3 LOOP
            v_count := v_count + 1;
            EXIT outer_loop WHEN (i = 2 AND j = 2);
        END LOOP inner_loop;
    END LOOP outer_loop;
    DBMS_OUTPUT.PUT_LINE(v_count);
END;
/
```

* A. `9`
* B. `5`
* C. `4`
* D. `6`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** For `i = 1`, `j` runs 1, 2, 3 (`v_count` reaches `3`). For `i = 2`, `j = 1` increments `v_count` to `4`; then `j = 2` increments `v_count` to **`5`** and `EXIT outer_loop WHEN (i = 2 AND j = 2)` immediately terminates both the inner and outer loops!
</details>

---

### Question 25
**Which attribute of the implicit `SQL` cursor returns the `BOOLEAN` value `TRUE` if the most recently executed `INSERT`, `UPDATE`, `DELETE`, or `MERGE` statement affected AT LEAST ONE row?**

* A. `SQL%ROWCOUNT`
* B. `SQL%FOUND`
* C. `SQL%ISOPEN`
* D. `SQL%NOTFOUND`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `SQL%FOUND` returns `TRUE` when 1 or more rows were affected by the most recent DML statement (`SQL%NOTFOUND` returns `TRUE` when 0 rows were affected, `SQL%ROWCOUNT` returns the integer count, and `SQL%ISOPEN` is always `FALSE` for implicit cursors).
</details>

---
