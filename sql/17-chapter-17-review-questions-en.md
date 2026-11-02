# Review Questions - Chapter 17: Hierarchical Queries (`CONNECT BY`)

> **Part II:** Advanced Oracle SQL for Developers  
> **Total Questions:** 25 multiple-choice questions aligned with the Oracle Database SQL (1Z0-071 / 1Z0-047) certification exams.  
> **How to study:** Pay close attention to the placement of the `PRIOR` operator and whether filter predicates appear in `WHERE` versus `CONNECT BY` before expanding **"👉 View Answer & Detailed Explanation"**.

---

### Question 1
**In the `EMPLOYEES` table, `EMPLOYEE_ID` is the primary key and `MANAGER_ID` is the foreign key referencing the employee's direct manager. To traverse the hierarchy Top-Down (from the President down to subordinates), which `CONNECT BY` clause is CORRECT?**

* A. `CONNECT BY PRIOR manager_id = employee_id`
* B. `CONNECT BY PRIOR employee_id = manager_id`
* C. `CONNECT BY employee_id = PRIOR employee_id`
* D. `CONNECT BY manager_id = PRIOR manager_id`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** To traverse **Top-Down (Parent to Child)**, the next row is the child (subordinate), so the child's `manager_id` must match the parent's `employee_id` (`PRIOR employee_id`). Thus, `CONNECT BY PRIOR employee_id = manager_id` (or `CONNECT BY manager_id = PRIOR employee_id`) traverses from parent to child.
  * **A is incorrect:** `PRIOR manager_id = employee_id` traverses **Bottom-Up** (from subordinate up to managers).
  * **C, D are incorrect:** Neither connects the primary key to the foreign key.
</details>

---

### Question 2
**Examine the following hierarchical query. In which direction does this query traverse the tree, and which rows does it return?**

```sql
SELECT employee_id, first_name, manager_id, LEVEL
FROM employees
START WITH employee_id = 104
CONNECT BY employee_id = PRIOR manager_id;
```

* A. Top-Down: it finds employee `104` and all subordinates who report directly or indirectly to `104`.
* B. Bottom-Up: starting at employee `104`, it finds `104`'s direct manager, then that manager's manager, continuing up to the root (President).
* C. It fails with a syntax error because the `PRIOR` keyword must appear immediately after `CONNECT BY`.
* D. It returns only the single row for employee `104`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Look at which column the **`PRIOR`** operator is attached to: here `PRIOR` modifies **`manager_id`** (`employee_id = PRIOR manager_id` is identical to `PRIOR manager_id = employee_id`). At each step, Oracle finds the row whose `employee_id` equals the current row's `manager_id` $\implies$ **Bottom-Up traversal (from Child up to Parent/Ancestors)**.
  * **A, C, D are incorrect:** `PRIOR` can validly appear on either the left-hand side or the right-hand side of the `=` sign.
</details>

---

### Question 3
**In a hierarchical query (`CONNECT BY`), what value does the `LEVEL` pseudocolumn have for the starting root rows that satisfy the `START WITH` condition?**

* A. `0`
* B. `1`
* C. `NULL`
* D. It depends on the total number of rows in the table.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In Oracle SQL, the `LEVEL` pseudocolumn always starts at **`1`** for root nodes (rows satisfying the `START WITH` clause). Direct children of a root have `LEVEL = 2`, grandchildren have `LEVEL = 3`, and so on.
  * **A, C, D are incorrect:** `LEVEL` never starts at `0` in Oracle.
</details>

---

### Question 4
**What happens if you execute a hierarchical query with `CONNECT BY PRIOR employee_id = manager_id` but OMIT the `START WITH` clause?**

* A. It fails with syntax error `ORA-01788: START WITH clause is required`.
* B. It returns 0 rows because no starting point is defined.
* C. It executes successfully: Oracle treats **every row in the table** as a separate root node (`LEVEL = 1`) and builds a hierarchy tree starting from each row.
* D. It implicitly assumes `START WITH manager_id IS NULL`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In Oracle's hierarchical query syntax, the `START WITH` clause is **optional**. When omitted, Oracle uses **every row in the table as a root node (`LEVEL = 1`)** in turn and traverses all descendants beneath each row.
  * **A, B, D are incorrect:** Omitting `START WITH` does not raise an error and does not default to `IS NULL`.
</details>

---

### Question 5
**In a hierarchical query, is it syntactically valid to place the `START WITH` clause AFTER the `CONNECT BY` clause, as shown below?**

```sql
SELECT employee_id, first_name, LEVEL
FROM employees
CONNECT BY PRIOR employee_id = manager_id
START WITH manager_id IS NULL;
```

* A. Yes, it is completely valid and produces the exact same result as placing `START WITH` before `CONNECT BY`.
* B. No, it fails with a syntax error because `START WITH` must always precede `CONNECT BY`.
* C. It executes, but reverses the hierarchy order from bottom to top.
* D. It is valid only when querying the `DUAL` table.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** According to the Oracle SQL Language Reference, `START WITH` can appear either **before** or **after** the `CONNECT BY` clause (`START WITH ... CONNECT BY ...` or `CONNECT BY ... START WITH ...`) with 100% identical behavior and results.
  * **B, C, D are incorrect:** Many test-takers are only familiar with `START WITH` appearing first and fall for Option B on the exam.
</details>

---

### Question 6
**Consider the hierarchy chain: `King (100)` manages `De Haan (102)`; `De Haan (102)` manages `Hunold (103)`; `Hunold (103)` manages `Ernst (104)`. When you execute the query below (where `employee_id != 102` is in the `WHERE` clause), which employees from this chain appear in the output?**

```sql
SELECT employee_id, first_name, manager_id, LEVEL
FROM employees
WHERE employee_id != 102
START WITH employee_id = 100
CONNECT BY PRIOR employee_id = manager_id;
```

* A. Only `King (100)` appears; `102`, `103`, and `104` are all eliminated.
* B. Only the single node `De Haan (102)` is eliminated, while `King (100)`, `Hunold (103)`, and `Ernst (104)` STILL APPEAR in the output!
* C. It fails because a `WHERE` clause cannot be used with `CONNECT BY`.
* D. No rows are returned.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** This is the most famous exam trap in Chapter 17! A single-table filter predicate in the **`WHERE` clause** is evaluated **AFTER** the entire hierarchy tree has already been constructed by `START WITH ... CONNECT BY`:
    1. First, Oracle builds the full tree (`100 -> 102 -> 103 -> 104`).
    2. Second, Oracle applies `WHERE employee_id != 102`, which removes **only node `102`**, leaving its descendants **`103 (Hunold)` and `104 (Ernst)` intact**!
  * **A is incorrect:** Pruning the entire branch (`102`, `103`, and `104`) only happens when `AND employee_id != 102` is placed inside the **`CONNECT BY`** clause.
  * **C, D are incorrect:** `WHERE` is valid in hierarchical queries.
</details>

---

### Question 7
**Using the same hierarchy chain (`King (100) -> De Haan (102) -> Hunold (103) -> Ernst (104)`), if you want to PRUNE THE ENTIRE BRANCH starting at `De Haan (102)` (removing `102`, `103`, and `104` from the result), how should you write the query?**

* A. Place `WHERE employee_id != 102` before the `START WITH` clause.
* B. Add `AND employee_id != 102` directly inside the `CONNECT BY` clause: `CONNECT BY PRIOR employee_id = manager_id AND employee_id != 102`.
* C. Add `HAVING employee_id != 102` at the end of the query.
* D. Write `START WITH employee_id != 102`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Placing `AND employee_id != 102` inside the **`CONNECT BY`** clause evaluates the condition **during tree traversal**. When stepping from `King (100)` to its children, node `102` is rejected immediately, so Oracle never visits `102` or any of its descendants (`103`, `104`) $\implies$ **pruning the entire branch**!
  * **A is incorrect:** Removes only node `102`, keeping `103` and `104`.
  * **C, D are incorrect:** `HAVING` requires `GROUP BY`, and changing `START WITH` changes the root nodes.
</details>

---

### Question 8
**Which Oracle pseudocolumn returns `1` if the current row in a hierarchical query is a leaf node (has no children beneath it in the hierarchy tree) and returns `0` if it is a parent node?**

* A. `IS_LEAF`
* B. `CONNECT_BY_ISLEAF`
* C. `LEVEL_LEAF`
* D. `CONNECT_BY_LEAF`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** **`CONNECT_BY_ISLEAF`** returns `1` if the current row is a leaf node in the constructed hierarchy tree, and `0` if it has one or more child rows.
  * **A, C, D are incorrect:** None of these pseudocolumn names exist in Oracle SQL.
</details>

---

### Question 9
**If user data contains a circular reference loop (for example, employee `A` manages `B`, and `B` is recorded as managing `A`), what happens when you execute a standard `CONNECT BY PRIOR emp_id = mgr_id` query (without `NOCYCLE`)?**

* A. Oracle silently skips the looping row and returns the remaining rows.
* B. The query loops infinitely until the `TEMP` tablespace fills up.
* C. Oracle detects the loop and immediately terminates the query with runtime error `ORA-01436: CONNECT BY loop in user data`.
* D. Oracle automatically deletes the offending row from the base table.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** During a standard `CONNECT BY` traversal without `NOCYCLE`, if a child node points back to an ancestor node already visited along the current path, Oracle immediately raises **`ORA-01436: CONNECT BY loop in user data`**.
  * **A, B, D are incorrect:** You must specify `CONNECT BY NOCYCLE` to suppress `ORA-01436` and stop expanding the cycling path.
</details>

---

### Question 10
**Examine the following query. Why does it fail to compile with `ORA-30930: NOCYCLE keyword is required with CONNECT_BY_ISCYCLE pseudocolumn`?**

```sql
SELECT employee_id, first_name, CONNECT_BY_ISCYCLE
FROM employees
START WITH manager_id IS NULL
CONNECT BY PRIOR employee_id = manager_id;
```

* A. Because the `CONNECT_BY_ISCYCLE` pseudocolumn can only be used when the `NOCYCLE` keyword is explicitly specified in the `CONNECT BY` clause (`CONNECT BY NOCYCLE PRIOR ...`).
* B. Because the `NOCYCLE` keyword must be placed in the `SELECT` list.
* C. Because `CONNECT_BY_ISCYCLE` is a function and requires parentheses `CONNECT_BY_ISCYCLE()`.
* D. Because `START WITH manager_id IS NULL` cannot produce a cycle.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** In Oracle SQL, the **`CONNECT_BY_ISCYCLE` pseudocolumn is only valid when `NOCYCLE` is specified** in the `CONNECT BY` clause (`CONNECT BY NOCYCLE PRIOR employee_id = manager_id`). Without `NOCYCLE`, any loop would immediately abort the query with `ORA-01436`, so Oracle rejects `CONNECT_BY_ISCYCLE` at parse time with **`ORA-30930`**.
  * **B, C, D are incorrect:** `CONNECT_BY_ISCYCLE` is a pseudocolumn (no parentheses).
</details>

---

### Question 11
**Which unary operator in a hierarchical query returns the column value of the Root node (`LEVEL = 1`) at the top of the current row's hierarchy branch?**

* A. `PRIOR`
* B. `CONNECT_BY_ROOT`
* C. `ROOT_VALUE`
* D. `FIRST_VALUE`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The **`CONNECT_BY_ROOT expr`** unary operator (e.g., `CONNECT_BY_ROOT first_name`) returns the value of `expr` from the root row (`LEVEL = 1`) of the current row's hierarchy tree.
  * **A is incorrect:** `PRIOR expr` returns the value from the **immediate parent row** (`LEVEL - 1`), not the top root (`LEVEL = 1`).
  * **C, D are incorrect:** `ROOT_VALUE` does not exist; `FIRST_VALUE` is an analytic window function.
</details>

---

### Question 12
**Examine the query below. On the row for employee `Ernst` at `LEVEL = 4` (along the path `King -> De Haan -> Hunold -> Ernst`), what names will be displayed in `boss_1` and `boss_2`?**

```sql
SELECT first_name,
       LEVEL,
       PRIOR first_name           AS boss_1,
       CONNECT_BY_ROOT first_name AS boss_2
FROM org_emp
START WITH first_name = 'King'
CONNECT BY PRIOR emp_id = mgr_id;
```

* A. `boss_1 = 'King'` and `boss_2 = 'Hunold'`
* B. `boss_1 = 'Hunold'` and `boss_2 = 'King'`
* C. `boss_1 = 'De Haan'` and `boss_2 = 'King'`
* D. Both `boss_1` and `boss_2` display `'King'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * `PRIOR first_name` (`boss_1`): Returns the `first_name` of the **immediate parent row** (`LEVEL 3`) of `Ernst`, which is **`'Hunold'`**.
    * `CONNECT_BY_ROOT first_name` (`boss_2`): Returns the `first_name` of the **Root node (`LEVEL 1`)** of the branch, which is **`'King'`**.
  * **A, C, D are incorrect:** They confuse the immediate parent (`PRIOR`) with the root ancestor (`CONNECT_BY_ROOT`).
</details>

---

### Question 13
**What does `SYS_CONNECT_BY_PATH(first_name, '/')` return for the root node `'King'` (`LEVEL = 1`) and its direct child `'Kochhar'` (`LEVEL = 2`)?**

* A. `'King'` and `'King/Kochhar'`
* B. `'/King'` and `'/King/Kochhar'`
* C. `'King/'` and `'King/Kochhar/'`
* D. `NULL` and `'/Kochhar'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `SYS_CONNECT_BY_PATH(column, 'delimiter')` prepends the `'delimiter'` string **before every node's value, including the root node (`LEVEL = 1`)**:
    * At `LEVEL = 1` (`King`): **`'/King'`**.
    * At `LEVEL = 2` (`Kochhar`): **`'/King/Kochhar'`**.
  * **A, C, D are incorrect:** `SYS_CONNECT_BY_PATH` always starts the returned string with the delimiter character.
</details>

---

### Question 14
**When using `SYS_CONNECT_BY_PATH(department_name, '/')`, what happens if one of the rows has a `department_name` value of `'R&D/Innovation'` (meaning the column value itself contains the delimiter character `'/'`)?**

* A. Oracle automatically escapes it as `'R&D\/Innovation'`.
* B. Oracle automatically strips the `'/'` from the department name.
* C. The query fails at runtime with `ORA-30004: when using SYS_CONNECT_BY_PATH function, cannot have separator as part of column value`.
* D. The query executes normally without any error or modification.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `SYS_CONNECT_BY_PATH(col, 'sep')` strictly forbids the column value from containing the separator string `'sep'`. If a column value contains `'/'` while `'/'` is used as the separator, Oracle raises **`ORA-30004: when using SYS_CONNECT_BY_PATH function, cannot have separator as part of column value`**.
  * **A, B, D are incorrect:** To avoid `ORA-30004`, choose a delimiter that does not appear in the data or wrap the column in `REPLACE(department_name, '/', '-')`.
</details>

---

### Question 15
**In a hierarchical query, why should you use `ORDER SIBLINGS BY salary DESC` instead of a standard `ORDER BY salary DESC` clause?**

* A. Because a standard `ORDER BY` clause is syntactically prohibited in a `CONNECT BY` query.
* B. Because a standard `ORDER BY` sorts all rows flatly by salary across the entire result set and destroys the parent-child tree structure, whereas `ORDER SIBLINGS BY` preserves the hierarchical tree structure while sorting only sibling nodes that share the same parent.
* C. Because `ORDER SIBLINGS BY` sorts only leaf nodes (`CONNECT_BY_ISLEAF = 1`) and leaves parent nodes unsorted.
* D. Because `ORDER SIBLINGS BY` automatically prevents circular loops like `NOCYCLE`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * A standard `ORDER BY salary DESC` is syntactically valid, but it flattens the hierarchy by sorting all rows together regardless of `LEVEL` or parent-child relationships.
    * **`ORDER SIBLINGS BY salary DESC`** preserves the depth-first parent-child tree hierarchy and sorts only sibling rows under the same parent.
  * **A, C, D are incorrect:** Regular `ORDER BY` is not a syntax error, but it scrambles the visual tree display.
</details>

---

### Question 16
**What happens if you use `ORDER SIBLINGS BY first_name` in a standard `SELECT` statement that does NOT contain a `CONNECT BY` clause?**

* A. It executes normally just like `ORDER BY first_name`.
* B. It fails with `ORA-30929: ORDER SIBLINGS BY clause not allowed here` because `ORDER SIBLINGS BY` is valid only in a hierarchical query containing a `CONNECT BY` clause.
* C. It groups rows by the first letter of `first_name`.
* D. It works only if a `GROUP BY` clause is present.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The `SIBLINGS` keyword in `ORDER SIBLINGS BY` is only allowed in queries that contain a `CONNECT BY` clause. Using it in a normal `SELECT` query (or even a recursive `WITH` query without `CONNECT BY`) raises **`ORA-30929: ORDER SIBLINGS BY clause not allowed here`**.
  * **A, C, D are incorrect:** `ORDER SIBLINGS BY` strictly requires `CONNECT BY`.
</details>

---

### Question 17
**Which of the following constructs is PROHIBITED directly inside the condition of a `CONNECT BY` clause?**

* A. The `AND` operator combining multiple conditions.
* B. A subquery, such as `CONNECT BY PRIOR emp_id = mgr_id AND dept_id IN (SELECT dept_id FROM departments WHERE ...)`.
* C. Inequality comparison operators such as `!=`, `>`, or `<`.
* D. The `NOCYCLE` keyword.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Oracle SQL **does not allow subqueries inside the `CONNECT BY` clause**. (Note: subqueries *are* allowed inside the `START WITH` clause, e.g., `START WITH emp_id = (SELECT ...)`, just not inside `CONNECT BY`.)
  * **A, C, D are incorrect:** Compound `AND` conditions, inequality comparisons, and `NOCYCLE` are all valid in `CONNECT BY`.
</details>

---

### Question 18
**Examine the following idiomatic Oracle SQL query. What does it return?**

```sql
SELECT LEVEL AS num
FROM dual
CONNECT BY LEVEL <= 10;
```

* A. It fails because the `DUAL` table has no `LEVEL` column and `PRIOR` is omitted.
* B. It returns only 1 row with the value `1` because `DUAL` has only 1 row.
* C. It generates 10 rows containing the consecutive integers from `1` to `10` (the classic Oracle Row Generator pattern).
* D. It fails with `ORA-01436: CONNECT BY loop in user data`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `SELECT LEVEL FROM dual CONNECT BY LEVEL <= n` is the classic **Row Generator** idiom in Oracle SQL, generating `n` consecutive rows numbered `1` through `n` (`1` to `10` here).
  * **A, B, D are incorrect:** Oracle permits `CONNECT BY LEVEL <= n` against the single-row `DUAL` table without `PRIOR` and without raising a cycle error.
</details>

---

### Question 19
**If you join two tables (`SELECT e.first_name, d.department_name FROM employees e JOIN departments d ON e.department_id = d.department_id`) in a hierarchical query with `START WITH ... CONNECT BY PRIOR e.employee_id = e.manager_id` and include a filter `WHERE d.department_name = 'IT'`, in what order are `CONNECT BY` and `WHERE` evaluated?**

* A. Oracle filters `WHERE d.department_name = 'IT'` first and then runs `CONNECT BY`, pruning any non-IT branches.
* B. Oracle performs the join and constructs the `CONNECT BY` hierarchy tree first, and **then applies the `WHERE` filter predicate** to retain only nodes with `department_name = 'IT'`.
* C. Joins are not allowed in a query that contains a `CONNECT BY` clause.
* D. The `ON` clause must be placed after the `CONNECT BY` clause.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In a hierarchical query involving joins, Oracle evaluates the join condition, builds the full hierarchy tree using `START WITH ... CONNECT BY`, and **then applies filter predicates in the `WHERE` clause** to the resulting hierarchy rows.
  * **A, C, D are incorrect:** Joins are supported in hierarchical queries, and `WHERE` filter predicates are evaluated after `CONNECT BY` tree construction.
</details>

---

### Question 20
**Suppose `Hunold (103)` manages `Ernst (104)` and `Lorentz (105)` in the `ORG_EMP` table. In the query below, you add `AND LEVEL <= 2` inside the `CONNECT BY` clause so traversal stops at `Hunold (103)` (`LEVEL = 2`) without visiting `Ernst` or `Lorentz` (`LEVEL = 3`). What value will `CONNECT_BY_ISLEAF` return on the row for `Hunold (103)`?**

```sql
SELECT emp_id, first_name, LEVEL, CONNECT_BY_ISLEAF AS is_leaf
FROM org_emp
START WITH emp_id = 102 -- De Haan (LEVEL 1)
CONNECT BY PRIOR emp_id = mgr_id
       AND LEVEL <= 2;  -- Stops at Hunold (LEVEL 2)
```

* A. `0` (because in the underlying `ORG_EMP` table, `Hunold` still has subordinates `Ernst` and `Lorentz`).
* B. `1` (because `CONNECT_BY_ISLEAF` is evaluated based on **the hierarchy tree actually constructed by `CONNECT BY`**; since `AND LEVEL <= 2` inside `CONNECT BY` prevented `Hunold` from expanding any child nodes, `Hunold` is a leaf in this constructed tree!).
* C. `NULL`
* D. It fails because `LEVEL <= 2` cannot be used inside `CONNECT BY`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `CONNECT_BY_ISLEAF` checks whether a node has any children **in the hierarchy tree constructed by the `CONNECT BY` clause** (not in the raw table). Because `AND LEVEL <= 2` is inside `CONNECT BY`, Oracle prunes all `LEVEL 3` children during tree construction, making `Hunold (LEVEL = 2)` a leaf node (`CONNECT_BY_ISLEAF = 1`).
  * **A, C, D are incorrect:** If `LEVEL <= 2` were placed in the `WHERE` clause instead, `CONNECT_BY_ISLEAF` for `Hunold` would be `0`!
</details>

---

### Question 21
**In contrast to Question 20, if you move the `LEVEL <= 2` condition from the `CONNECT BY` clause into the `WHERE` clause as shown below, what value will `CONNECT_BY_ISLEAF` return on the row for `Hunold (103)` (`LEVEL = 2`)?**

```sql
SELECT emp_id, first_name, LEVEL, CONNECT_BY_ISLEAF AS is_leaf
FROM org_emp
WHERE LEVEL <= 2
START WITH emp_id = 102 -- De Haan (LEVEL 1) -> Hunold (LEVEL 2) -> Ernst (LEVEL 3)
CONNECT BY PRIOR emp_id = mgr_id;
```

* A. `0` (because during the `CONNECT BY` tree-building phase, `Hunold` still expands its child `Ernst` at `LEVEL 3` and is marked `CONNECT_BY_ISLEAF = 0` before the `WHERE LEVEL <= 2` filter removes the `LEVEL 3` rows).
* B. `1`
* C. `2`
* D. It fails because `WHERE LEVEL <= 2` is invalid.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** Comparing Question 20 and Question 21 highlights the exact execution order:
    1. `CONNECT BY` builds the full tree down to `LEVEL 3` (`Ernst`, `Lorentz`) and assigns `CONNECT_BY_ISLEAF = 0` to `Hunold` because `Hunold` has children in the constructed tree.
    2. Afterward, `WHERE LEVEL <= 2` filters out the `LEVEL 3` rows without recomputing `CONNECT_BY_ISLEAF`, so `Hunold` retains `is_leaf = 0`.
  * **B, C, D are incorrect:** Always put `AND LEVEL <= n` inside `CONNECT BY` rather than `WHERE` to stop tree traversal early and improve performance.
</details>

---

### Question 22
**In which clauses of a hierarchical query are the `CONNECT_BY_ROOT` operator and the `SYS_CONNECT_BY_PATH` function allowed to appear?**

* A. Only inside the `CONNECT BY` clause.
* B. Only inside the `START WITH` clause.
* C. In the `SELECT`, `WHERE`, and `ORDER BY` (or `ORDER SIBLINGS BY`) clauses of a `CONNECT BY` query, but NOT inside the `START WITH` or `CONNECT BY` conditions themselves.
* D. In any `SELECT` statement even without a `CONNECT BY` clause.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Both `CONNECT_BY_ROOT` and `SYS_CONNECT_BY_PATH` depend on the completed path from the root node, so they are valid in `SELECT`, `WHERE`, `GROUP BY`/`HAVING`, and `ORDER [SIBLINGS] BY`, but are **prohibited inside the `START WITH` and `CONNECT BY` clauses** (`ORA-30007`).
  * **A, B, D are incorrect:** They cannot be used inside `CONNECT BY` / `START WITH` or in non-hierarchical queries.
</details>

---

### Question 23
**What is the correct expression to indent `first_name` by 2 spaces per hierarchy `LEVEL` (e.g., 0 spaces at `LEVEL = 1`, 2 spaces at `LEVEL = 2`, 4 spaces at `LEVEL = 3`)?**

* A. `LPAD(first_name, (LEVEL - 1) * 2, ' ')`
* B. `LPAD(' ', (LEVEL - 1) * 2, ' ') || first_name` (or `LPAD(first_name, LENGTH(first_name) + (LEVEL - 1) * 2, ' ')`)
* C. `INDENT(first_name, LEVEL * 2)`
* D. `SUBSTR(' ', 1, LEVEL) || first_name`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The second argument of `LPAD(str, total_length, pad_char)` specifies the **total target length of the returned string**, not the number of padding characters to add! Therefore, you must either pad a space string and concatenate (`LPAD(' ', (LEVEL - 1) * 2, ' ') || first_name`) or add `LENGTH(first_name)` to the target length (`LPAD(first_name, LENGTH(first_name) + (LEVEL - 1) * 2, ' ')`).
  * **A is incorrect:** At `LEVEL = 1`, `(LEVEL - 1) * 2 = 0`, so `LPAD(first_name, 0, ' ')` truncates the name to `NULL`! At `LEVEL = 2`, it truncates the name to 2 characters!
  * **C, D are incorrect:** `INDENT` does not exist, and `SUBSTR(' ', 1, LEVEL)` has at most 1 space.
</details>

---

### Question 24
**Comparing Oracle's traditional `START WITH ... CONNECT BY` syntax with Recursive Subquery Factoring (Recursive `WITH` clause), which statement is TRUE?**

* A. `CONNECT BY` is the cross-database ANSI SQL standard supported by PostgreSQL, SQL Server, and MySQL, whereas Recursive `WITH` is proprietary to Oracle.
* B. Recursive `WITH` is the ANSI SQL:1999 standard and is portable across modern relational databases, whereas `START WITH ... CONNECT BY` is Oracle's concise proprietary hierarchical syntax with built-in pseudocolumns like `LEVEL` and `CONNECT_BY_ISLEAF`.
* C. Starting in Oracle 19c, the `CONNECT BY` clause has been deprecated and removed.
* D. Recursive `WITH` cannot detect cycles in data; only `CONNECT BY NOCYCLE` can.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * `START WITH ... CONNECT BY PRIOR` is Oracle's classic proprietary syntax, offering concise built-in tools (`LEVEL`, `CONNECT_BY_ISLEAF`, `CONNECT_BY_ROOT`, `SYS_CONNECT_BY_PATH`, `ORDER SIBLINGS BY`).
    * Recursive `WITH` (introduced in Oracle 11gR2) implements the **ANSI SQL:1999** standard (`SEARCH DEPTH/BREADTH FIRST`, `CYCLE`) and is portable across RDBMS platforms.
  * **A, C, D are incorrect:** Recursive `WITH` supports cycle detection via the `CYCLE` clause, and `CONNECT BY` remains fully supported in Oracle.
</details>

---

### Question 25
**Examine the query below. If `King (100)` is at `LEVEL = 1`, what value will the expression `PRIOR first_name` in the `SELECT` list return on the row for `King`?**

```sql
SELECT emp_id,
       first_name,
       LEVEL,
       PRIOR first_name AS parent_name
FROM org_emp
START WITH emp_id = 100
CONNECT BY PRIOR emp_id = mgr_id;
```

* A. `'King'` (the root node's own name).
* B. `NULL` (because a root node at `LEVEL = 1` has no parent row preceding it in the hierarchy traversal).
* C. It raises a runtime error because `PRIOR` cannot be evaluated at `LEVEL = 1`.
* D. `'ROOT'`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In the `SELECT` list, `PRIOR expr` evaluates `expr` from the **immediate parent row (`LEVEL - 1`)**. Because a root node (`LEVEL = 1`) has no parent row in the hierarchy traversal, `PRIOR first_name` always evaluates to **`NULL`** at `LEVEL = 1`.
  * **A, C, D are incorrect:** Only `CONNECT_BY_ROOT first_name` returns `'King'` on the root row; `PRIOR first_name` returns `NULL`.
</details>

---
