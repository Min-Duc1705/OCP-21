# Review Questions - Chapter 26: Advanced PL/SQL & Performance Optimization

> **Reference:** *OCP Oracle Database Program with PL/SQL Study Guide (Exam 1Z0-149)*  
> **Total Questions:** 25 multiple-choice questions aligned with the Oracle OCP 1Z0-149 exam, complete with detailed explanations.  
> **How to study:** Read each question carefully and choose your answer first, then click **"👉 View Answer & Detailed Explanation"** to verify your answer and review the exam traps.

---

### Question 1
**Which two statements are TRUE when comparing the three collection types (`Associative Array`, `Nested Table`, and `VARRAY`) in PL/SQL? (Choose two.)**

* A. Only an `Associative Array (INDEX BY)` allows string keys (`VARCHAR2`) or negative integer subscripts, and it can only be declared in PL/SQL (never created at the schema level with `CREATE TYPE`).
* B. All three collection types must be initialized with a constructor before any element can be assigned.
* C. A `VARRAY` is always dense (never has gaps between elements) and has a fixed maximum size (`LIMIT`) specified in its type definition.
* D. Only a `VARRAY` can be stored as a column in a database table; a `Nested Table` cannot.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, C**
* **Detailed Explanation:**
  * **A is correct:** `Associative Array` (`TYPE ... IS TABLE OF ... INDEX BY VARCHAR2(n) | PLS_INTEGER`) is the only collection type supporting `VARCHAR2` keys or negative integer subscripts, and it is a PL/SQL-only type (cannot be defined via schema-level `CREATE TYPE`).
  * **C is correct:** A `VARRAY` has a fixed upper bound (`LIMIT`) and does not allow deleting individual middle elements (`.DELETE(n)`), so it is always dense (`1..COUNT`).
  * **B is incorrect:** An `Associative Array` variable is automatically initialized as empty (not `NULL`) upon declaration and does not require a constructor or `.EXTEND`.
  * **D is incorrect:** Both schema-level `Nested Table` and `VARRAY` types can be used as database table column types.
</details>

---

### Question 2
**Assume `v_nt` is a `Nested Table` variable that has been declared but NOT yet initialized with a constructor (`v_nt` is atomically `NULL`). Which collection method is the ONLY one that will NOT raise `COLLECTION_IS_NULL` (`ORA-06531`) when called on `v_nt`?**

* A. `v_nt.COUNT`
* B. `v_nt.FIRST`
* C. `v_nt.EXISTS(1)`
* D. `v_nt.EXTEND(1)`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Among all collection methods, **`EXISTS(n)`** is the **ONLY** method that never raises `COLLECTION_IS_NULL` (`ORA-06531`) when called on an uninitialized (`NULL`) nested table or varray—it safely returns **`FALSE`**.
  * **A, B, D are incorrect:** Calling `.COUNT`, `.FIRST`, `.LAST`, `.LIMIT`, `.EXTEND`, `.TRIM`, or `.DELETE` on a `NULL` collection raises `COLLECTION_IS_NULL` (`ORA-06531`).
</details>

---

### Question 3
**Which collection method call causes a COMPILATION ERROR?**

* A. Calling `v_varray.DELETE;` (with no arguments) on a `VARRAY` variable to remove all elements.
* B. Calling `v_varray.DELETE(2);` (with an index argument) on a `VARRAY` variable to remove the second element.
* C. Calling `v_nested_tab.LIMIT` on a `Nested Table` variable.
* D. Calling `v_assoc_arr.DELETE(-5);` on an `Associative Array` variable.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct (Causes compilation error):** Because a `VARRAY` must always remain dense, Oracle **prohibits calling `.DELETE(n)` or `.DELETE(m, n)` with arguments on a `VARRAY`**, failing with **`PLS-00306: wrong number or types of arguments in call to 'DELETE'`**. To remove elements from the end of a `VARRAY`, use `.TRIM(n)`.
  * **A is incorrect (Valid):** `v_varray.DELETE;` (without arguments) is valid on a `VARRAY` because it removes all elements (`COUNT = 0`).
  * **C is incorrect (Valid):** Calling `.LIMIT` on a `Nested Table` or `Associative Array` is valid and returns **`NULL`**.
  * **D is incorrect (Valid):** `Associative Array` supports negative subscripts and `.DELETE(n)`.
</details>

---

### Question 4
**What is the output when the following PL/SQL block manipulating a `Nested Table` is executed?**

```sql
DECLARE
    TYPE t_list IS TABLE OF NUMBER;
    v_nums t_list := t_list(10, 20, 30, 40);
BEGIN
    v_nums.DELETE(2);
    v_nums.TRIM(1);
    DBMS_OUTPUT.PUT_LINE(
        'COUNT=' || v_nums.COUNT ||
        ', FIRST=' || v_nums.FIRST ||
        ', LAST=' || v_nums.LAST
    );
END;
```

* A. `COUNT=2, FIRST=1, LAST=3`
* B. `COUNT=2, FIRST=1, LAST=2`
* C. `COUNT=3, FIRST=1, LAST=3`
* D. It raises `SUBSCRIPT_BEYOND_COUNT`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:**
    1. Initially `v_nums` has 4 elements at subscripts `1` (`10`), `2` (`20`), `3` (`30`), and `4` (`40`).
    2. `v_nums.DELETE(2);` deletes element `2`, leaving elements at subscripts `1`, `3`, and `4` (`COUNT = 3`).
    3. `v_nums.TRIM(1);` removes the last slot (subscript `4`).
    4. Now `v_nums` has elements only at subscripts **`1`** (`10`) and **`3`** (`30`).
    5. Therefore: **`COUNT = 2`**, **`FIRST = 1`**, and **`LAST = 3`**!
  * **B, C, D are incorrect:** In a sparse nested table, `.LAST` can be greater than `.COUNT`.
</details>

---

### Question 5
**In Question 4, after `v_nums.DELETE(2);` is executed (leaving subscripts `1`, `3`, and `4`), what happens if you iterate over `v_nums` using `FOR i IN v_nums.FIRST .. v_nums.LAST LOOP DBMS_OUTPUT.PUT_LINE(v_nums(i)); END LOOP;`?**

* A. It prints `10`, `NULL`, `30`, `40`.
* B. It prints `10`, `30`, `40` (the `FOR` loop automatically skips deleted index 2).
* C. It prints `10` for `i = 1`, and then raises `NO_DATA_FOUND` (`ORA-01403`) when `i = 2` because element 2 was deleted.
* D. It raises `SUBSCRIPT_BEYOND_COUNT` (`ORA-06533`) when `i = 2`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** A numeric `FOR i IN 1 .. 4 LOOP` steps through every integer `1, 2, 3, 4`. When `i = 2`, referencing `v_nums(2)` attempts to read a deleted element gap in the nested table, which immediately raises **`NO_DATA_FOUND` (`ORA-01403`)**.
  * **Correct way to iterate a sparse collection:** Use a `WHILE` loop with `.FIRST` and `.NEXT(idx)`, or check `IF v_nums.EXISTS(i) THEN` inside the `FOR` loop.
  * **A, B, D are incorrect:** `SUBSCRIPT_BEYOND_COUNT` occurs only when referencing an index beyond the highest allocated slot (`> LAST`).
</details>

---

### Question 6
**Assume the `EMPLOYEES` table has no rows with `department_id = 999`. What is the result of executing the following PL/SQL block using `SELECT ... BULK COLLECT INTO`?**

```sql
DECLARE
    TYPE t_name_tab IS TABLE OF employees.first_name%TYPE;
    v_names t_name_tab;
BEGIN
    SELECT first_name
    BULK COLLECT INTO v_names
    FROM employees
    WHERE department_id = 999;

    DBMS_OUTPUT.PUT_LINE('Count = ' || v_names.COUNT);
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Caught NO_DATA_FOUND!');
END;
```

* A. It prints `Caught NO_DATA_FOUND!`.
* B. It raises `COLLECTION_IS_NULL` because `v_names` was not initialized with a constructor before the `SELECT` statement.
* C. It raises no exception and prints `Count = 0`.
* D. It prints `Count = NULL`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Two essential rules of `BULK COLLECT` on the OCP exam:
    1. **Automatic initialization:** `BULK COLLECT INTO v_names` automatically initializes the target collection (no prior constructor call is needed).
    2. **Never raises `NO_DATA_FOUND`:** Unlike a single-row `SELECT ... INTO`, when `SELECT ... BULK COLLECT INTO` fetches **0 rows**, it **does NOT raise `NO_DATA_FOUND`**; instead, it leaves `v_names` as an initialized, empty collection with **`v_names.COUNT = 0`**.
  * **A, B, D are incorrect:** Always check `v_names.COUNT = 0` after `BULK COLLECT`.
</details>

---

### Question 7
**Assume the `EMPLOYEES` table contains exactly 107 rows. A developer writes the `FETCH ... BULK COLLECT INTO ... LIMIT 50` loop shown below. How many employees will be processed by `process_emp`?**

```sql
DECLARE
    CURSOR c_emp IS SELECT employee_id FROM employees;
    TYPE t_id_list IS TABLE OF employees.employee_id%TYPE;
    v_ids t_id_list;
BEGIN
    OPEN c_emp;
    LOOP
        FETCH c_emp BULK COLLECT INTO v_ids LIMIT 50;
        EXIT WHEN c_emp%NOTFOUND;

        FOR i IN 1 .. v_ids.COUNT LOOP
            process_emp(v_ids(i));
        END LOOP;
    END LOOP;
    CLOSE c_emp;
END;
```

* A. `107` employees.
* B. `100` employees (the last 7 employees are skipped).
* C. `50` employees.
* D. `0` employees.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** This is the #1 exam trap when combining `FETCH ... BULK COLLECT INTO ... LIMIT n` with `EXIT WHEN c_emp%NOTFOUND;`:
    * **Iteration 1:** Fetches rows 1..50 (`v_ids.COUNT = 50`). More rows remain, so `c_emp%NOTFOUND = FALSE` $\rightarrow$ Processes 50 employees.
    * **Iteration 2:** Fetches rows 51..100 (`v_ids.COUNT = 50`). More rows remain, so `c_emp%NOTFOUND = FALSE` $\rightarrow$ Processes 50 more employees (100 total).
    * **Iteration 3:** Only 7 rows remain (101..107). `FETCH ... LIMIT 50` loads those 7 rows into `v_ids` (`v_ids.COUNT = 7`), but because the cursor reached the end of the active set before filling all 50 slots, Oracle **immediately sets `c_emp%NOTFOUND := TRUE` on this 3rd fetch**!
    * Because `EXIT WHEN c_emp%NOTFOUND;` is placed right after `FETCH`, the loop exits immediately and **skips the last 7 rows** in `v_ids`!
  * **Correct pattern:** Always use **`EXIT WHEN v_ids.COUNT = 0;`** immediately after `FETCH ... BULK COLLECT INTO`!
</details>

---

### Question 8
**Which statement is TRUE regarding the `FORALL` statement in PL/SQL?**

* A. `FORALL` is a loop construct and must end with `END LOOP;`.
* B. Inside a `FORALL` construct, you can include multiple DML statements and `IF ... THEN` control statements.
* C. `FORALL` is not a loop; it has no `LOOP ... END LOOP` keywords and can contain **only a single DML statement** (or a single `EXECUTE IMMEDIATE` statement) immediately following the header.
* D. `FORALL` can be used with a `SELECT` statement to fetch rows in bulk.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `FORALL` is a bulk-bind declarative statement that sends all collection elements to the SQL engine in a single context switch to execute **exactly one DML statement** (`INSERT`, `UPDATE`, `DELETE`, `MERGE`) or one `EXECUTE IMMEDIATE` statement. It does not use `LOOP` or `END LOOP`.
  * **A, B, D are incorrect:** Bulk `SELECT` operations use `BULK COLLECT`, not `FORALL`.
</details>

---

### Question 9
**Examine the following PL/SQL block that runs `FORALL` over a `Nested Table` where element 2 has been deleted with `.DELETE(2)`. What happens when this block executes?**

```sql
DECLARE
    TYPE t_id_list IS TABLE OF NUMBER;
    v_ids t_id_list := t_id_list(101, 102, 103, 104);
BEGIN
    v_ids.DELETE(2); -- Makes v_ids sparse!

    FORALL i IN v_ids.FIRST .. v_ids.LAST
        UPDATE employees SET salary = salary * 1.1 WHERE employee_id = v_ids(i);
END;
```

* A. It updates employees `101`, `103`, and `104` successfully.
* B. The `FORALL` statement fails at runtime with `ORA-22160: element at index [2] does not exist` because the `lower_bound .. upper_bound` syntax requires a dense collection.
* C. It raises `NO_DATA_FOUND` (`ORA-01403`).
* D. It fails to compile at the `FORALL` line.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** When using the contiguous range syntax `FORALL i IN low .. high`, every element from `low` to `high` must exist. Because index `2` was deleted, `FORALL` fails at runtime with **`ORA-22160: element at index [2] does not exist`**.
  * **Solution for sparse collections:** Use **`FORALL i IN INDICES OF v_ids`**!
  * **A, C, D are incorrect:** Accessing a missing element in a normal PL/SQL `FOR` loop raises `NO_DATA_FOUND` (`ORA-01403`), whereas a missing element in `FORALL i IN low..high` raises **`ORA-22160`**.
</details>

---

### Question 10
**In a `FORALL` statement, when should you use the `INDICES OF` clause versus the `VALUES OF` clause?**

* A. Use `INDICES OF` for `VARRAY`s and `VALUES OF` for `Nested Table`s.
* B. Use `INDICES OF collection_A` to iterate over the populated subscripts of a sparse collection `collection_A` (skipping deleted elements); use `VALUES OF pointer_collection` when you want `FORALL` to use the **element values** stored inside `pointer_collection` as the subscripts into the main data collection.
* C. `INDICES OF` and `VALUES OF` are synonyms and behave identically.
* D. `INDICES OF` is only valid for `DELETE`, whereas `VALUES OF` is only valid for `INSERT`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * **`FORALL i IN INDICES OF v_data`:** `i` takes each existing **index/subscript** of `v_data` (skipping gaps).
    * **`FORALL i IN VALUES OF v_index_pointers`:** `v_index_pointers` is a collection of `PLS_INTEGER` / `BINARY_INTEGER` values, and `i` takes each **value `v_index_pointers(k)`** as the index into `v_data(i)`.
  * **A, C, D are incorrect:** Both clauses work with any DML statement (`INSERT`, `UPDATE`, `DELETE`, `MERGE`).
</details>

---

### Question 11
**After executing `FORALL i IN 1 .. v_depts.COUNT UPDATE employees SET salary = salary + 100 WHERE department_id = v_depts(i);`, which attribute tells you how many rows were updated specifically by the 3rd element (`v_depts(3)`)?**

* A. `SQL%ROWCOUNT(3)`
* B. `SQL%BULK_ROWCOUNT(3)`
* C. `v_depts(3)%ROWCOUNT`
* D. `SQL%BULK_EXCEPTIONS(3).ROWCOUNT`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * `SQL%ROWCOUNT` returns the **total number of rows** affected across all iterations of the `FORALL` statement.
    * **`SQL%BULK_ROWCOUNT(i)`** acts like an associative array that stores the **number of rows affected by the $i$-th execution** of the `FORALL` statement.
  * **A, C, D are incorrect:** Invalid attribute syntax.
</details>

---

### Question 12
**When using `SAVE EXCEPTIONS` in a `FORALL` statement (`FORALL i IN 1..v_arr.COUNT SAVE EXCEPTIONS INSERT ...`), what happens if 3 out of 100 elements fail with constraint violations?**

* A. All 100 elements are rolled back and no exception is raised.
* B. All 97 valid elements are inserted, details of the 3 failed elements are recorded in `SQL%BULK_EXCEPTIONS`, and once the `FORALL` statement completes, PL/SQL automatically raises the aggregate exception `ORA-24381: error(s) in array DML`.
* C. `FORALL` stops immediately at the first failing element, and subsequent elements are not processed.
* D. Errors are written to `USER_ERRORS` and no exception is raised.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** With `SAVE EXCEPTIONS`, the SQL engine continues processing all remaining elements when a row fails, records each failure in `SQL%BULK_EXCEPTIONS`, and then raises **`ORA-24381: error(s) in array DML`** after the entire batch finishes.
  * **A, C, D are incorrect:** You can trap `ORA-24381` specifically by declaring `PRAGMA EXCEPTION_INIT(e_bulk_err, -24381);`.
</details>

---

### Question 13
**Inside an `EXCEPTION` handler for `FORALL ... SAVE EXCEPTIONS`, why must you prepend a minus sign `-` when passing `SQL%BULK_EXCEPTIONS(i).ERROR_CODE` to `SQLERRM`: `SQLERRM(-SQL%BULK_EXCEPTIONS(i).ERROR_CODE)`?**

* A. Because `SQLERRM` only accepts `VARCHAR2` arguments.
* B. Because `SQL%BULK_EXCEPTIONS(i).ERROR_CODE` stores the Oracle error number as a **positive integer** (e.g., `1400` instead of `-1400`), whereas `SQLERRM` expects a **negative integer** (e.g., `-1400`) to look up the standard Oracle error message.
* C. Because the minus sign deletes the entry from `SQL%BULK_EXCEPTIONS`.
* D. The minus sign is optional; passing positive or negative numbers to `SQLERRM` returns the same message.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Unlike `SQLCODE` (which returns negative numbers like `-1400`), **`SQL%BULK_EXCEPTIONS(i).ERROR_CODE` stores Oracle error codes as unsigned positive integers** (`1400`). Because `SQLERRM(n)` requires a negative number (except `+100`), you must negate it: **`SQLERRM(-SQL%BULK_EXCEPTIONS(i).ERROR_CODE)`**.
  * **A, C, D are incorrect:** Passing positive `1400` to `SQLERRM(1400)` returns `non-ORACLE exception`.
</details>

---

### Question 14
**For which two tasks inside a stored procedure are you REQUIRED to use Dynamic SQL (`EXECUTE IMMEDIATE` or `DBMS_SQL`) rather than static SQL? (Choose two.)**

* A. Executing a DDL statement such as `TRUNCATE TABLE temp_sales` or `CREATE TABLE ...` inside PL/SQL.
* B. Executing a `SELECT` query where the table name or column name in the `WHERE` clause is passed dynamically as a `VARCHAR2` parameter at runtime.
* C. Executing an `UPDATE` statement where the filter value in the `WHERE` clause is passed via a procedure parameter (`WHERE employee_id = p_emp_id`).
* D. Executing `COMMIT` or `ROLLBACK` inside a procedure.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, B**
* **Detailed Explanation:**
  * **A is correct:** PL/SQL does not directly support static DDL (`CREATE`, `ALTER`, `DROP`, `TRUNCATE`) or DCL (`GRANT`, `REVOKE`) statements; they must be executed dynamically.
  * **B is correct:** Static SQL requires table and column identifiers to be fixed at compile time.
  * **C and D are incorrect:** Static SQL supports PL/SQL variables as bind values (`WHERE employee_id = p_emp_id`) and directly supports TCL (`COMMIT`, `ROLLBACK`, `SAVEPOINT`).
</details>

---

### Question 15
**Which `EXECUTE IMMEDIATE` statement uses the VALID syntax and clause order to execute a dynamic `SELECT` query with a bind variable?**

```sql
DECLARE
    v_sql    VARCHAR2(200) := 'SELECT salary FROM employees WHERE employee_id = :emp_id';
    v_sal    employees.salary%TYPE;
    v_id     NUMBER := 100;
BEGIN
    /* INSERT EXECUTE IMMEDIATE STATEMENT HERE */
END;
```

* A. `EXECUTE IMMEDIATE v_sql USING v_id INTO v_sal;`
* B. `EXECUTE IMMEDIATE v_sql INTO v_sal USING v_id;`
* C. `EXECUTE IMMEDIATE 'SELECT salary FROM employees WHERE employee_id = :emp_id;' INTO v_sal USING v_id;`
* D. `EXECUTE IMMEDIATE v_sql RETURNING INTO v_sal USING v_id;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** When both `INTO` (or `BULK COLLECT INTO`) and `USING` are present in `EXECUTE IMMEDIATE`, the **`INTO` clause MUST precede the `USING` clause**:
    `EXECUTE IMMEDIATE dynamic_string INTO variable_list USING bind_argument_list;`.
  * **A is incorrect:** Putting `USING` before `INTO` causes a compilation error (`PLS-00103`).
  * **C is incorrect:** A dynamic SQL statement string (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE`) **must NOT end with a semicolon `;`** inside the string (`ORA-00911: invalid character`).
  * **D is incorrect:** `RETURNING INTO` is used for DML statements with a `RETURNING` clause, not `SELECT`.
</details>

---

### Question 16
**Why does the following PL/SQL block fail to compile, and how should it be fixed?**

```sql
BEGIN
    EXECUTE IMMEDIATE 'UPDATE employees SET commission_pct = :1 WHERE employee_id = :2'
        USING NULL, 100;
END;
```

* A. Numeric placeholders `:1` and `:2` are not allowed in dynamic SQL.
* B. It fails with `PLS-00457: expressions have to be of SQL types` because the untyped literal `NULL` cannot be passed directly in a `USING` clause; you must declare a typed variable initialized to `NULL` (`v_comm NUMBER := NULL;`) and pass `USING v_comm, 100;`.
* C. An `UPDATE` statement in `EXECUTE IMMEDIATE` requires an `INTO` clause.
* D. The `UPDATE` string is missing a trailing semicolon `;`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The keyword `NULL` by itself has no SQL data type. Passing `USING NULL` directly in `EXECUTE IMMEDIATE` causes compilation error **`PLS-00457: expressions have to be of SQL types`**. You must pass a typed variable whose value is `NULL`.
  * **A, C, D are incorrect:** `:1` and `:2` are valid placeholder names.
</details>

---

### Question 17
**Compare the number of bind arguments required in the `USING` clause for Statement 1 (a dynamic SQL statement) versus Statement 2 (a dynamic PL/SQL block) when the placeholder `:val` appears twice:**

```sql
-- Statement 1 (Dynamic SQL statement):
v_sql := 'UPDATE employees SET salary = :val, commission_pct = :val * 0.00001 WHERE employee_id = 100';

-- Statement 2 (Dynamic PL/SQL block):
v_plsql := 'BEGIN sp_test(:val, :val); END;';
```

* A. Both Statement 1 and Statement 2 require only 1 bind argument (`USING v_num;`).
* B. Both Statement 1 and Statement 2 require 2 bind arguments (`USING v_num, v_num;`).
* C. Statement 1 (dynamic SQL) binds **by position** and therefore requires **2 bind arguments** (`USING v_num, v_num;`), whereas Statement 2 (dynamic PL/SQL block `BEGIN ... END;`) binds **by name** and therefore requires **only 1 bind argument** (`USING v_num;`).
* D. Statement 1 requires 1 bind argument, whereas Statement 2 requires 2 bind arguments.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:**
    1. **Dynamic SQL statements (`SELECT`, `INSERT`, `UPDATE`, `DELETE`):** Placeholders are bound **by position**, regardless of their names. Because `:val` appears twice in `v_sql`, you must supply **2 arguments** in `USING v_num, v_num;`.
    2. **Dynamic PL/SQL blocks (`DECLARE ... BEGIN ... END;` or `CALL`):** Placeholders are bound **by unique name**. Even though `:val` appears twice in `v_plsql`, you supply **only 1 argument** in `USING v_num;`.
  * **A, B, D are incorrect:** This positional-vs-named placeholder binding rule is a classic OCP 1Z0-149 exam topic.
</details>

---

### Question 18
**In which scenario are you REQUIRED to use the `DBMS_SQL` package instead of `EXECUTE IMMEDIATE` (Native Dynamic SQL)?**

* A. When a dynamic `SELECT` query returns multiple rows.
* B. When executing a dynamic DDL statement (`CREATE TABLE`).
* C. When executing Dynamic SQL Method 4—where the **number of selected columns** or the **number of bind variables** is unknown until runtime.
* D. When executing a dynamic DML statement with a `RETURNING INTO` clause.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `EXECUTE IMMEDIATE` and `OPEN ref_cursor FOR` require the number and types of variables in `INTO` and `USING` to be known at compile time. When the number of `SELECT` list columns or bind variables is determined dynamically at runtime (**Dynamic SQL Method 4**), you must use **`DBMS_SQL`**.
  * **A, B, D are incorrect:** All three are supported by Native Dynamic SQL (`EXECUTE IMMEDIATE` / `OPEN FOR`).
</details>

---

### Question 19
**To prevent SQL Injection when concatenating a dynamic table name (`p_table_name`) into a dynamic SQL string, which `DBMS_ASSERT` function verifies that `p_table_name` refers to an existing database object?**

* A. `DBMS_ASSERT.NOOP(p_table_name)`
* B. `DBMS_ASSERT.ENQUOTE_LITERAL(p_table_name)`
* C. `DBMS_ASSERT.SQL_OBJECT_NAME(p_table_name)`
* D. `DBMS_ASSERT.SCHEMA_NAME(p_table_name)`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** **`DBMS_ASSERT.SQL_OBJECT_NAME(str)`** checks the data dictionary to verify that `str` is a valid, existing database object name (raising **`ORA-44002: invalid object name`** if it does not exist or contains injected SQL).
  * **A is incorrect:** `NOOP` performs no validation at all.
  * **B is incorrect:** `ENQUOTE_LITERAL` encloses string literals in single quotes `'...'`.
  * **D is incorrect:** `SCHEMA_NAME` only checks whether the string is an existing schema/username (`ORA-44001`).
</details>

---

### Question 20
**What is the difference between `DBMS_ASSERT.SIMPLE_SQL_NAME(str)` and `DBMS_ASSERT.SQL_OBJECT_NAME(str)`?**

* A. None; they are synonyms.
* B. `SIMPLE_SQL_NAME` only verifies that `str` conforms to the lexical rules of a simple SQL identifier (no spaces, semicolons, or SQL operators) **without checking** whether an object of that name exists in the database; `SQL_OBJECT_NAME` verifies that the object **actually exists** in the database.
* C. `SIMPLE_SQL_NAME` is for table names, whereas `SQL_OBJECT_NAME` is for column names.
* D. `SIMPLE_SQL_NAME` automatically wraps the identifier in double quotes `"..."`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * **`SIMPLE_SQL_NAME`:** Validates that the input string is a syntactically valid simple SQL identifier (useful for column names or aliases), raising `ORA-44003` if invalid.
    * **`SQL_OBJECT_NAME`:** Validates that the input string matches an existing database object in the data dictionary, raising `ORA-44002` if not found.
  * **A, C, D are incorrect:** Wrapping an identifier in double quotes is done by `DBMS_ASSERT.ENQUOTE_NAME`.
</details>

---

### Question 21
**Assume the `TEST_LOG(msg VARCHAR2(50))` table is empty (0 rows). What is the result of executing the following PL/SQL block and query?**

```sql
DECLARE
    PROCEDURE sp_auto_log (p_msg VARCHAR2) IS
        PRAGMA AUTONOMOUS_TRANSACTION;
    BEGIN
        INSERT INTO test_log VALUES (p_msg);
        COMMIT;
    END sp_auto_log;
BEGIN
    INSERT INTO test_log VALUES ('Main Step 1');
    sp_auto_log('Autonomous Step 2');
    INSERT INTO test_log VALUES ('Main Step 3');
    ROLLBACK;
END;
/

SELECT msg FROM test_log;
```

* A. `TEST_LOG` has 0 rows because the block ends with `ROLLBACK;`.
* B. `TEST_LOG` has 2 rows (`'Main Step 1'` and `'Autonomous Step 2'`) because the `COMMIT` inside `sp_auto_log` also committed `'Main Step 1'`.
* C. `TEST_LOG` has exactly 1 row: `'Autonomous Step 2'`.
* D. `TEST_LOG` has all 3 rows.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:**
    1. The main transaction inserts `'Main Step 1'` (uncommitted).
    2. Calling `sp_auto_log('Autonomous Step 2')` suspends the main transaction and starts an independent autonomous transaction.
    3. `INSERT 'Autonomous Step 2'` and `COMMIT;` inside `sp_auto_log` **commit only `'Autonomous Step 2'`**, without affecting `'Main Step 1'`.
    4. Control returns to the main transaction, which inserts `'Main Step 3'` and issues **`ROLLBACK;`**, rolling back `'Main Step 1'` and `'Main Step 3'` while leaving **`'Autonomous Step 2'`** permanently committed!
  * **A, B, D are incorrect:** Autonomous transactions isolate their `COMMIT`/`ROLLBACK` operations from the parent transaction.
</details>

---

### Question 22
**What happens when the following procedure `sp_bad_auto` is executed?**

```sql
CREATE OR REPLACE PROCEDURE sp_bad_auto IS
    PRAGMA AUTONOMOUS_TRANSACTION;
BEGIN
    INSERT INTO test_log VALUES ('Testing without commit');
END sp_bad_auto;
/

BEGIN
    sp_bad_auto;
END;
```

* A. The inserted row is automatically committed when `sp_bad_auto` finishes.
* B. The inserted row is merged into the caller's main transaction.
* C. `sp_bad_auto` raises the runtime error `ORA-06519: active autonomous transaction detected and rolled back` and rolls back the insert because an autonomous transaction that performs DML must explicitly `COMMIT` or `ROLLBACK` before exiting.
* D. `CREATE OR REPLACE PROCEDURE` fails to compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Any autonomous transaction unit that has an active transaction (such as an uncommitted DML statement) **must explicitly execute `COMMIT;` or `ROLLBACK;` before exiting** back to the calling context. Exiting with an uncommitted autonomous transaction raises **`ORA-06519: active autonomous transaction detected and rolled back`**.
  * **A, B, D are incorrect:** `ORA-06519` is a runtime exception, not a compile-time error.
</details>

---

### Question 23
**Where is `PRAGMA AUTONOMOUS_TRANSACTION;` NOT allowed to be declared?**

* A. In the declarative section of a standalone stored procedure or function.
* B. In the declarative section of a database trigger.
* C. At the package level in a `PACKAGE SPECIFICATION` (to mark all subprograms in the package as autonomous) or inside a nested anonymous block.
* D. In the declarative section of a top-level anonymous block.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct (Not allowed):**
    1. `PRAGMA AUTONOMOUS_TRANSACTION;` **cannot** be declared at the package level (`PLS-00710: Pragma AUTONOMOUS_TRANSACTION cannot be declared here`); it must be declared inside individual procedures/functions within the package body.
    2. Among anonymous blocks, only a **top-level anonymous block** can declare `PRAGMA AUTONOMOUS_TRANSACTION;`; nested anonymous blocks cannot.
  * **A, B, D are incorrect:** All three are valid places for `PRAGMA AUTONOMOUS_TRANSACTION;`.
</details>

---

### Question 24
**Examine the following PL/SQL block where the main transaction updates a row in `EMPLOYEES` (without committing) and then calls an `AUTONOMOUS_TRANSACTION` procedure that attempts to update the exact same row. What happens?**

```sql
DECLARE
    PROCEDURE sp_auto_update IS
        PRAGMA AUTONOMOUS_TRANSACTION;
    BEGIN
        UPDATE employees SET salary = 9000 WHERE employee_id = 100;
        COMMIT;
    END;
BEGIN
    UPDATE employees SET salary = 8000 WHERE employee_id = 100;
    sp_auto_update;
    COMMIT;
END;
```

* A. Employee 100 ends up with a salary of `8000`.
* B. Employee 100 ends up with a salary of `9000`.
* C. A **self-deadlock** occurs and Oracle raises `ORA-00060: deadlock detected while waiting for resource`!
* D. It raises `ORA-06519`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:**
    1. The main transaction executes `UPDATE ... WHERE employee_id = 100;`, acquiring an exclusive lock on row `100`.
    2. The main transaction calls `sp_auto_update` and becomes **suspended** waiting for `sp_auto_update` to return.
    3. The autonomous transaction `sp_auto_update` attempts to update the same row `100` and waits for the main transaction to release its lock.
    4. Because the child transaction is waiting for the suspended parent transaction, a **self-deadlock** occurs, raising **`ORA-00060: deadlock detected while waiting for resource`**.
  * **A, B, D are incorrect:** Always avoid contending for the same locked rows between a parent transaction and an autonomous child transaction.
</details>

---

### Question 25
**In Oracle 11g and later, if a complex dynamic SQL query has been parsed, bound, and executed using `DBMS_SQL` (with cursor ID `v_cur_id INTEGER := DBMS_SQL.OPEN_CURSOR;`), which function converts `v_cur_id` into a `SYS_REFCURSOR` variable so it can be returned to a client application?**

* A. `v_ref_cur := DBMS_SQL.TO_REFCURSOR(v_cur_id);`
* B. `v_ref_cur := DBMS_SQL.CAST_TO_REFCURSOR(v_cur_id);`
* C. `v_ref_cur := DBMS_UTILITY.TO_REFCURSOR(v_cur_id);`
* D. `OPEN v_ref_cur FOR v_cur_id;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** `DBMS_SQL` provides two interoperability functions between `DBMS_SQL` and Native Dynamic SQL:
    1. **`DBMS_SQL.TO_REFCURSOR(cursor_number)`:** Converts an open, executed `DBMS_SQL` cursor ID (`INTEGER`) into a weak `REF CURSOR` (`SYS_REFCURSOR`).
    2. **`DBMS_SQL.TO_CURSOR_NUMBER(ref_cursor)`:** Converts an open `REF CURSOR` variable into a `DBMS_SQL` cursor ID (`INTEGER`) so you can inspect its column metadata with `DBMS_SQL.DESCRIBE_COLUMNS`.
  * **B, C, D are incorrect:** Invalid function names or syntax.
</details>

---
