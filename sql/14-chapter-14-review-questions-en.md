# Review Questions - Chapter 14: Advanced Subqueries & CTEs

> **Part II:** Advanced Oracle SQL for Developers  
> **Total Questions:** 25 multiple-choice questions aligned with the Oracle Database SQL (1Z0-071 / 1Z0-047) certification exams.  
> **How to study:** Read each question and analyze the SQL query carefully before expanding **"👉 View Answer & Detailed Explanation"**.

---

### Question 1
**When declaring multiple subquery blocks in the `WITH` clause (Subquery Factoring) of a single `SELECT` statement, which of the following statements is TRUE?**

* A. You must repeat the `WITH` keyword before each subquery block name.
* B. An earlier subquery block can directly reference the name of a subquery block declared after it.
* C. The `WITH` keyword appears only once at the beginning, the blocks are separated by commas, and a subsequent block can reference a block declared before it.
* D. Every subquery block declared in a `WITH` clause must permanently store its physical data in the `SYSTEM` tablespace.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In a multi-CTE `WITH` clause (`WITH cte1 AS (...), cte2 AS (...) SELECT ...`), the `WITH` keyword is written **only once**, and CTE definitions are separated by commas `,`. A later block (`cte2`) can reference any block defined before it (`cte1`).
  * **A is incorrect:** Repeating the `WITH` keyword for the second CTE raises `ORA-00928: missing SELECT keyword`.
  * **B is incorrect:** Forward references are not allowed—an earlier CTE cannot reference a CTE defined after it.
  * **D is incorrect:** CTE results are never permanently stored in the `SYSTEM` tablespace; if materialized (`MATERIALIZE`), temporary data resides in the `TEMP` tablespace only for the duration of the statement.
</details>

---

### Question 2
**Examine the following SQL statement. What happens when this statement is executed in an Oracle Database?**

```sql
WITH
    dept_sal AS (
        SELECT department_id, SUM(salary) AS total_sal
        FROM employees
        GROUP BY department_id
    ),
    unused_cte AS (
        SELECT job_id, COUNT(*) AS cnt
        FROM employees
        GROUP BY job_id
    )
SELECT department_id, total_sal
FROM dept_sal
WHERE total_sal > 15000;
```

* A. The statement executes successfully and automatically ignores `unused_cte` without raising an error.
* B. The statement fails with `ORA-32035: unreferenced query name defined in WITH clause` because `unused_cte` is not referenced anywhere.
* C. The statement fails because a `WITH` clause can contain at most one subquery block.
* D. The statement executes successfully and returns a Cartesian product of `dept_sal` and `unused_cte`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In Oracle SQL, every query name defined in the `WITH` clause must be referenced at least once (either in the main query or in another CTE that is ultimately used by the main query). Because `unused_cte` is never referenced, Oracle raises **`ORA-32035: unreferenced query name defined in WITH clause`**.
  * **A, C, D are incorrect:** Multiple CTEs are allowed, and unreferenced CTEs cause a compilation error rather than being silently ignored or cross-joined.
</details>

---

### Question 3
**In the Oracle Cost-Based Optimizer (CBO), what is the core difference between the `/*+ MATERIALIZE */` and `/*+ INLINE */` CTE processing strategies?**

* A. `MATERIALIZE` automatically creates a permanent Materialized View in the schema, whereas `INLINE` creates a normal View.
* B. `MATERIALIZE` executes the CTE once and stores its temporary result in an implicit Global Temporary Table in the `TEMP` tablespace, whereas `INLINE` merges the CTE query text directly into the main query.
* C. `MATERIALIZE` can only be used with `DELETE` statements, whereas `INLINE` can only be used with `SELECT` statements.
* D. `INLINE` is always faster than `MATERIALIZE` in all cases, even when a complex CTE is referenced 10 times.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Under the `MATERIALIZE` strategy (typically chosen by the CBO when a CTE is referenced $\ge 2$ times), Oracle performs a `TEMP TABLE TRANSFORMATION` (`LOAD AS SELECT`) to write the CTE result into a temporary segment in the `TEMP` tablespace so it can be read multiple times without recomputation. Conversely, `INLINE` substitutes the CTE's SQL definition directly into the outer query like a regular inline view.
  * **A, C, D are incorrect:** `MATERIALIZE` does not create a permanent data dictionary object, and it is significantly faster than `INLINE` when an expensive CTE is referenced multiple times.
</details>

---

### Question 4
**When writing a Recursive Common Table Expression (Recursive Subquery Factoring) in Oracle SQL, which set operator MUST be used to connect the Anchor Member and the Recursive Member?**

* A. `UNION`
* B. `UNION ALL`
* C. `INTERSECT`
* D. `MINUS`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Oracle syntax rules for a recursive `WITH` clause require that the anchor member and the recursive member **must be joined using `UNION ALL`**.
  * **A, C, D are incorrect:** Using `UNION`, `INTERSECT`, or `MINUS` immediately raises `ORA-32040: recursive WITH clause must use a UNION ALL operation`.
</details>

---

### Question 5
**Examine the following recursive CTE. Why does this statement fail when executed?**

```sql
WITH emp_hierarchy AS (
    SELECT employee_id, first_name, manager_id, 1 AS lvl
    FROM employees
    WHERE manager_id IS NULL
    UNION ALL
    SELECT e.employee_id, e.first_name, e.manager_id, eh.lvl + 1
    FROM employees e
    JOIN emp_hierarchy eh ON e.manager_id = eh.employee_id
)
SELECT * FROM emp_hierarchy;
```

* A. Because a recursive CTE must explicitly declare a column alias list in parentheses immediately after the CTE name `emp_hierarchy`.
* B. Because adding `1` to `eh.lvl` is not allowed in the recursive member.
* C. Because ANSI `JOIN ... ON` syntax is not permitted inside a recursive member.
* D. Because the `WHERE manager_id IS NULL` condition is not allowed in the anchor member.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** Unlike a non-recursive CTE (where the column list is optional), a **recursive CTE must explicitly specify a column alias list** right after the CTE name, e.g., `WITH emp_hierarchy (employee_id, first_name, manager_id, lvl) AS (...)`. Omitting it raises `ORA-32039: recursive WITH clause must have column alias list`.
  * **B, C, D are incorrect:** Incrementing `eh.lvl + 1`, using ANSI `JOIN ... ON`, and filtering roots in the anchor member are all valid.
</details>

---

### Question 6
**Which of the following constructs is PROHIBITED inside the Recursive Member of a recursive CTE in Oracle?**

* A. An `INNER JOIN` between a physical table and the recursive CTE name.
* B. A `WHERE` clause used to limit the recursion depth.
* C. The `DISTINCT` keyword, a `GROUP BY` clause, or analytic functions (`OVER(...)`).
* D. String concatenation (`||`) or arithmetic operators (`+`, `-`).

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Inside the recursive member of a recursive `WITH` clause, Oracle prohibits `DISTINCT`, `GROUP BY`, `HAVING`, aggregate functions (`SUM`, `COUNT`, etc.), and analytic functions (`ROW_NUMBER() OVER(...)`). If needed, apply those operations in the outer `SELECT` query that reads from the CTE.
  * **A, B, D are incorrect:** All of these are valid and commonly used inside a recursive member.
</details>

---

### Question 7
**In a recursive CTE, you want to traverse the hierarchy such that all descendant branches of a node are visited completely before moving to the next sibling node (matching the default traversal order of `CONNECT BY`). Which clause should you use?**

* A. `SEARCH BREADTH FIRST BY col_name SET order_col`
* B. `SEARCH DEPTH FIRST BY col_name SET order_col`
* C. `ORDER SIBLINGS BY col_name`
* D. `CYCLE col_name SET order_col TO 1 DEFAULT 0`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `SEARCH DEPTH FIRST BY ... SET order_col` specifies depth-first traversal, visiting each parent and all of its descendants before moving to the next sibling.
  * **A is incorrect:** `SEARCH BREADTH FIRST` visits all nodes at level 1, then all nodes at level 2, then level 3.
  * **C is incorrect:** `ORDER SIBLINGS BY` is specific to `CONNECT BY` hierarchical queries and cannot be used to control recursive CTE traversal.
  * **D is incorrect:** The `CYCLE` clause detects infinite loops rather than controlling traversal order.
</details>

---

### Question 8
**When using both the `SEARCH` and `CYCLE` clauses in a recursive CTE, which placement order is syntactically valid in Oracle SQL?**

```sql
WITH org_cte (emp_id, mgr_id, lvl) AS (
    SELECT employee_id, manager_id, 1 FROM employees WHERE manager_id IS NULL
    UNION ALL
    SELECT e.employee_id, e.manager_id, c.lvl + 1
    FROM employees e JOIN org_cte c ON e.manager_id = c.emp_id
)
-- [INSERT CLAUSES HERE]
SELECT * FROM org_cte ORDER BY seq_num;
```

* A. Place the `CYCLE` clause first, followed by the `SEARCH` clause immediately after the closing parenthesis `)` of the CTE.
* B. Place the `SEARCH` clause first, followed by the `CYCLE` clause immediately after the closing parenthesis `)` of the CTE.
* C. Place both `SEARCH` and `CYCLE` inside the Anchor Member.
* D. Place both `SEARCH` and `CYCLE` at the very end of the statement, after the outer `ORDER BY` clause.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In recursive subquery factoring, both `SEARCH` and `CYCLE` are placed immediately after the closing parenthesis `)` of the CTE definition, and **`SEARCH` must precede `CYCLE`**:
    ```sql
    SEARCH DEPTH FIRST BY emp_id SET seq_num
    CYCLE emp_id SET is_cycle TO 'Y' DEFAULT 'N'
    ```
  * **A, C, D are incorrect:** Placing `CYCLE` before `SEARCH` or placing them inside the subquery or after the outer `SELECT` causes a syntax error.
</details>

---

### Question 9
**The `EMPLOYEES` table has 100 rows with distinct values in the `SALARY` column. Which of the following queries accurately returns the 5 highest-paid employees?**

* A. `SELECT first_name, salary FROM employees WHERE ROWNUM <= 5 ORDER BY salary DESC;`
* B. `SELECT first_name, salary FROM employees ORDER BY salary DESC WHERE ROWNUM <= 5;`
* C. `SELECT first_name, salary FROM (SELECT first_name, salary FROM employees ORDER BY salary DESC) WHERE ROWNUM <= 5;`
* D. `SELECT first_name, salary FROM (SELECT first_name, salary FROM employees ORDER BY salary DESC) WHERE ROWNUM = 5;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** The inner inline view sorts all rows by `salary DESC` first, and the outer query filters `WHERE ROWNUM <= 5` to take the top 5 rows from the sorted result set.
  * **A is incorrect:** `ROWNUM` is assigned during the `WHERE` phase **before** `ORDER BY` is executed. Option A picks 5 arbitrary rows first and then sorts only those 5 rows.
  * **B is incorrect:** Syntax error because `WHERE` cannot appear after `ORDER BY`.
  * **D is incorrect:** `WHERE ROWNUM = 5` always returns **0 rows** because `ROWNUM` starts at `1` and only increments when a row passes the `WHERE` predicate.
</details>

---

### Question 10
**The `PRODUCTS` table contains 20 rows. You execute the following SQL statement. How many rows will be returned?**

```sql
SELECT product_id, product_name, list_price
FROM (
    SELECT product_id, product_name, list_price
    FROM products
    ORDER BY list_price DESC
)
WHERE ROWNUM BETWEEN 6 AND 10;
```

* A. 5 rows (the 6th through 10th most expensive products).
* B. 4 rows.
* C. 0 rows (no rows are returned).
* D. Syntax error `ORA-00936` because `ROWNUM` cannot be used with the `BETWEEN` operator.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `ROWNUM` is assigned starting at `1` and increments only after a row satisfies the `WHERE` clause. With `WHERE ROWNUM BETWEEN 6 AND 10`, the first row fetched from the inline view is assigned `ROWNUM = 1`, which fails `1 BETWEEN 6 AND 10` and is discarded. The next row is again assigned `ROWNUM = 1` and discarded. Thus, **0 rows** are returned.
  * **A, B, D are incorrect:** To paginate rows 6 to 10 using `ROWNUM`, you must alias `ROWNUM AS rnum` in an inner inline view and filter `WHERE rnum BETWEEN 6 AND 10` in the outermost query.
</details>

---

### Question 11
**The `SCORES` table contains 5 rows with `POINTS` values of `100`, `95`, `90`, `90`, and `85`. How many rows are returned when you execute the following query?**

```sql
SELECT points
FROM scores
ORDER BY points DESC
FETCH FIRST 3 ROWS WITH TIES;
```

* A. 3 rows (`100`, `95`, `90`).
* B. 4 rows (`100`, `95`, `90`, `90`).
* C. 5 rows (`100`, `95`, `90`, `90`, `85`).
* D. 2 rows (`100`, `95`).

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `FETCH FIRST 3 ROWS WITH TIES` retrieves the first 3 rows ordered by `points DESC` (`100`, `95`, `90`), and because of **`WITH TIES`**, it also includes any additional rows that have the same sort key value as the last (3rd) row (`points = 90`). Since two rows have `90`, a total of **4 rows** (`100`, `95`, `90`, `90`) are returned.
  * **A, C, D are incorrect:** Only `FETCH FIRST 3 ROWS ONLY` would stop strictly at 3 rows.
</details>

---

### Question 12
**Under the hood, when you execute a query containing `ORDER BY salary DESC FETCH FIRST 5 ROWS WITH TIES`, which analytic function does the Oracle Optimizer automatically use to rewrite the query?**

* A. `ROW_NUMBER() OVER (ORDER BY salary DESC)`
* B. `RANK() OVER (ORDER BY salary DESC)`
* C. `DENSE_RANK() OVER (ORDER BY salary DESC)`
* D. `NTILE(5) OVER (ORDER BY salary DESC)`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** When `FETCH FIRST n ROWS WITH TIES` is used, Oracle internally rewrites the query using `RANK() OVER (ORDER BY ...)` with a filter `<= n`. Conversely, `FETCH FIRST n ROWS ONLY` is rewritten using `ROW_NUMBER() OVER (ORDER BY ...)`.
  * **A, C, D are incorrect:** `ROW_NUMBER()` is used for `ONLY`, while `DENSE_RANK()` would return all rows across the top 5 distinct salary values rather than stopping at 5 rows plus boundary ties.
</details>

---

### Question 13
**Examine the following SQL statement. What is the result when it is executed in an Oracle Database?**

```sql
SELECT d.department_name, e_top.first_name, e_top.salary
FROM departments d,
     (SELECT first_name, salary
      FROM employees e
      WHERE e.department_id = d.department_id
      ORDER BY e.salary DESC
      FETCH FIRST 1 ROW ONLY) e_top;
```

* A. It returns each department along with the highest-paid employee in that department.
* B. It fails with `ORA-00904: "D"."DEPARTMENT_ID": invalid identifier` because a standard inline view in the `FROM` clause cannot reference columns from a preceding table in the same `FROM` clause.
* C. It fails because `FETCH FIRST 1 ROW ONLY` is not allowed inside an inline view.
* D. It returns a Cartesian product of the two tables.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Under standard SQL scoping rules, a regular inline view in the `FROM` clause cannot be left-correlated to sibling tables in the same `FROM` clause. Consequently, `d.department_id` is out of scope inside `e_top`, raising **`ORA-00904`**. To allow this reference, you must prefix the inline view with `LATERAL` or use `CROSS APPLY` / `OUTER APPLY`.
  * **A, C, D are incorrect:** `FETCH FIRST` is valid inside an inline view; the error is caused by the unallowed left-correlation.
</details>

---

### Question 14
**Which keyword introduced in Oracle 12c can be placed immediately before an inline view in the `FROM` clause so that the inline view can directly reference columns from tables listed to its left?**

* A. `CORRELATED`
* B. `LATERAL`
* C. `PRIOR`
* D. `EXTERNAL`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The **`LATERAL`** keyword (`FROM departments d, LATERAL (SELECT ... WHERE e.department_id = d.department_id)`) allows an inline view to reference columns from tables that appear to its left in the `FROM` clause.
  * **A, C, D are incorrect:** `CORRELATED` is not a SQL keyword; `PRIOR` is used in `CONNECT BY` queries; `EXTERNAL` is used for external tables.
</details>

---

### Question 15
**What is the difference between `CROSS APPLY` and `OUTER APPLY` when joining `DEPARTMENTS d` (on the left) with a correlated inline view that retrieves employees of that department (on the right)?**

* A. `CROSS APPLY` produces an unfiltered Cartesian product, whereas `OUTER APPLY` requires an `ON` clause.
* B. If a department has no employees (the inline view returns 0 rows), `CROSS APPLY` excludes that department from the result, whereas `OUTER APPLY` retains the department row and fills `NULL` for the inline view columns.
* C. `OUTER APPLY` excludes departments with no employees, whereas `CROSS APPLY` retains all departments.
* D. `CROSS APPLY` allows the inline view to return at most 1 row, whereas `OUTER APPLY` allows multiple rows.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * `CROSS APPLY` is equivalent to `INNER JOIN LATERAL (...) ON 1=1`: if the right-hand subquery returns no rows for a left-hand row, that left-hand row is eliminated.
    * `OUTER APPLY` is equivalent to `LEFT OUTER JOIN LATERAL (...) ON 1=1`: if the right-hand subquery returns no rows, the left-hand row is preserved with `NULL` values for the right-hand columns.
  * **A, C, D are incorrect:** Neither `CROSS APPLY` nor `OUTER APPLY` uses an `ON` clause, and both allow the subquery to return 0, 1, or multiple rows.
</details>

---

### Question 16
**Examine the following SQL statement. Why does this statement fail with a syntax/identifier error?**

```sql
SELECT d.department_name, emp_sub.first_name
FROM LATERAL (
    SELECT e.first_name
    FROM employees e
    WHERE e.department_id = d.department_id
) emp_sub
JOIN departments d ON 1 = 1;
```

* A. Because a `LATERAL` inline view can only reference tables listed **to its left (before it)** in the `FROM` clause, and cannot reference `departments d` listed **to its right (after it)**.
* B. Because the condition `ON 1 = 1` is invalid in Oracle SQL.
* C. Because a `LATERAL` inline view must always contain an `ORDER BY` clause.
* D. Because `LATERAL` can only be used with the `DUAL` table.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** `LATERAL`, `CROSS APPLY`, and `OUTER APPLY` strictly enforce left-to-right correlation (left-correlation): the inline view can only see tables declared **before it (to its left)** in the `FROM` clause. Because `LATERAL` is placed before `departments d`, `d.department_id` is not yet in scope, causing `ORA-00904`.
  * **B, C, D are incorrect:** `ON 1 = 1` is valid and `ORDER BY` is optional inside `LATERAL`.
</details>

---

### Question 17
**The `DEPARTMENTS` table has 4 departments (`10, 20, 30, 40`). The `EMPLOYEES` table has 10 employees in department `10`, 5 employees in department `20`, and no employees in departments `30` or `40`. How many rows will the following query return?**

```sql
SELECT d.department_id, d.department_name
FROM departments d
WHERE EXISTS (
    SELECT e.employee_id
    FROM employees e
    WHERE e.department_id = d.department_id
);
```

* A. 15 rows (because there are 10 employees in department 10 and 5 in department 20).
* B. 2 rows (department 10 and department 20).
* C. 4 rows (all 4 departments).
* D. An error because `e.employee_id` cannot be selected inside `EXISTS`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The `EXISTS` operator performs a **Semi-Join**. For each row in `DEPARTMENTS`, as soon as the **first matching row** is found in `EMPLOYEES`, `EXISTS` evaluates to `TRUE` and stops scanning further for that department. Rows from the outer table are never duplicated. Only departments `10` and `20` have matches, so **2 rows** are returned.
  * **A, C, D are incorrect:** Unlike an `INNER JOIN` (which would return 15 rows), a Semi-Join never duplicates outer rows, and any expression is valid in the `SELECT` list of `EXISTS`.
</details>

---

### Question 18
**What happens if you write `SELECT NULL` inside an `EXISTS` subquery, such as `WHERE EXISTS (SELECT NULL FROM employees e WHERE e.department_id = d.department_id)`?**

* A. The query always returns 0 rows because `SELECT NULL` evaluates to `UNKNOWN`.
* B. The query fails with a syntax error because `SELECT NULL` requires a column alias.
* C. The query executes normally and returns all departments that have employees, because `EXISTS` only checks whether at least one row is returned regardless of the `SELECT` list values.
* D. The query returns only departments where `department_id IS NULL`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** This is a classic Oracle OCA/OCP exam trap! The `EXISTS` operator only checks whether the subquery produces **at least one row**, completely ignoring the values in the subquery's `SELECT` list. Therefore, `SELECT 1`, `SELECT 'X'`, and `SELECT NULL` inside `EXISTS` produce **100% identical results**.
  * **A, B, D are incorrect:** `SELECT NULL` does not turn the `EXISTS` predicate into `NULL` or `UNKNOWN`.
</details>

---

### Question 19
**In the `EMPLOYEES` table, the `MANAGER_ID` column contains the values `{100, 101, 102, NULL}` (because the President has `MANAGER_ID IS NULL`). You want to find employees who are NOT managers of anyone using the query below. What is the result?**

```sql
SELECT employee_id, first_name
FROM employees
WHERE employee_id NOT IN (
    SELECT manager_id FROM employees
);
```

* A. It returns all subordinate employees who do not manage anyone.
* B. It returns only the row for the President (whose `manager_id IS NULL`).
* C. It returns no rows at all (0 rows returned).
* D. It fails at runtime with `ORA-01427: single-row subquery returns more than one row`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** This is the classic `NOT IN` with `NULL` trap! The subquery returns `(100, 101, 102, NULL)`. The expression `employee_id NOT IN (100, 101, 102, NULL)` is logically equivalent to:
    `employee_id != 100 AND employee_id != 101 AND employee_id != 102 AND employee_id != NULL`.
    For any employee (e.g., `employee_id = 105`), `105 != NULL` evaluates to **`UNKNOWN`**. In SQL three-valued logic, `TRUE AND UNKNOWN` evaluates to **`UNKNOWN`**. Because `WHERE` only returns rows where the predicate is `TRUE`, every row is filtered out and **0 rows** are returned!
  * **A, B, D are incorrect:** To fix the query, use `NOT EXISTS` or add `WHERE manager_id IS NOT NULL` inside the `NOT IN` subquery.
</details>

---

### Question 20
**To completely avoid the issue of returning 0 rows when the subquery result set contains `NULL` values (such as finding employees who are not managers), which of the following conditions is the SAFEST and most accurate?**

* A. `WHERE employee_id != ALL (SELECT manager_id FROM employees)`
* B. `WHERE NOT EXISTS (SELECT 1 FROM employees m WHERE m.manager_id = e.employee_id)`
* C. `WHERE employee_id NOT IN (SELECT NVL(manager_id, employee_id) FROM employees)`
* D. `WHERE employee_id = ANY (SELECT manager_id FROM employees)`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `NOT EXISTS` checks row existence per correlated row (`TRUE` or `FALSE`). Rows where `m.manager_id IS NULL` evaluate `NULL = e.employee_id` as `UNKNOWN` and are simply excluded inside the subquery without poisoning the outer result. Thus, `NOT EXISTS` handles `NULL` values safely and accurately.
  * **A is incorrect:** `!= ALL` (or `<> ALL`) is logically **100% identical to `NOT IN`**, so it also returns **0 rows** when the subquery contains `NULL`!
  * **C is incorrect:** Replacing `NULL` with `employee_id` substitutes the President's `employee_id` (`100`) or correlates every row to itself.
  * **D is incorrect:** `= ANY` is equivalent to `IN` (finding employees who ARE managers).
</details>

---

### Question 21
**In an Oracle Database Execution Plan, what does the term `Subquery Unnesting` mean?**

* A. The process where Oracle deletes the subquery condition completely to make the query run faster.
* B. The process where the Cost-Based Optimizer (CBO) transforms a nested subquery in the `WHERE` clause into an equivalent join operation (such as a `Semi-Join`, `Anti-Join`, or Inline View Join) with the outer query.
* C. The process of compiling a SQL query into a PL/SQL Stored Procedure.
* D. The process of splitting a single `SELECT` statement into multiple independent transactions.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** **Subquery Unnesting** is a key query transformation performed by the Oracle CBO: instead of executing a subquery repeatedly for each outer row using a `FILTER` operation, the CBO "unnests" the subquery into the `FROM` clause so it can be joined using efficient set-based algorithms like `HASH JOIN SEMI`, `HASH JOIN ANTI`, or `MERGE JOIN`.
  * **A, C, D are incorrect:** Query transformations always preserve semantic equivalence with the original query.
</details>

---

### Question 22
**When a correlated Scalar Subquery (a subquery returning at most 1 row and 1 column) is placed in the `SELECT` list as shown below, which built-in Oracle optimization minimizes repeated executions of the subquery when many employees share the same `department_id`?**

```sql
SELECT e.first_name,
       e.department_id,
       (SELECT d.department_name
        FROM departments d
        WHERE d.department_id = e.department_id) AS dept_name
FROM employees e;
```

* A. Partition Pruning.
* B. Scalar Subquery Caching (caching scalar subquery input/output pairs in an in-memory hash table in the PGA).
* C. Full Table Scan Parallelism.
* D. Star Transformation.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** When a correlated scalar subquery is used in the `SELECT` clause, Oracle automatically maintains a small in-memory hash table to perform **Scalar Subquery Caching**, storing `(input: e.department_id -> output: d.department_name)` pairs. When subsequent rows have the same `department_id`, Oracle retrieves the result directly from the cache without re-probing the `DEPARTMENTS` table.
  * **A, C, D are incorrect:** These features are unrelated to scalar subquery caching.
</details>

---

### Question 23
**What happens when a Scalar Subquery in the `SELECT` list returns:**
1. **0 rows (no matching row found)**
2. **2 or more rows**

* A. Case (1) raises `ORA-01403: no data found`; Case (2) returns the first row.
* B. Case (1) returns `NULL`; Case (2) raises runtime error `ORA-01427: single-row subquery returns more than one row`.
* C. Both cases return `NULL` without raising an error.
* D. Case (1) eliminates the outer query row (like an `INNER JOIN`); Case (2) duplicates the outer query row.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** A scalar subquery must return **at most 1 column and at most 1 row**:
    * If it returns **0 rows**: In SQL, it evaluates to **`NULL`** (behaving like a `LEFT OUTER JOIN`—it does **not** raise `NO_DATA_FOUND` as `SELECT INTO` does in PL/SQL).
    * If it returns **2 or more rows**: Oracle immediately raises runtime error **`ORA-01427: single-row subquery returns more than one row`**.
  * **A, C, D are incorrect:** This is a common distinction tested between pure SQL scalar subqueries and PL/SQL `SELECT INTO`.
</details>

---

### Question 24
**Examine the following query using a multiple-column subquery. What does this syntax accomplish?**

```sql
SELECT employee_id, first_name, department_id, salary
FROM employees
WHERE (department_id, salary) IN (
    SELECT department_id, MAX(salary)
    FROM employees
    GROUP BY department_id
);
```

* A. It fails with a syntax error because the `IN` operator allows only a single column on the left side.
* B. It performs a **Pairwise Comparison**: it finds all employees whose `(department_id, salary)` pair matches the department ID and highest salary of their own department (excluding employees whose `department_id IS NULL`).
* C. It performs a non-pairwise comparison, finding any employee whose salary matches the maximum salary of any department in the company.
* D. It fails because `GROUP BY` cannot be used inside an `IN` subquery.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Oracle supports **Multiple-Column Subqueries (Pairwise Comparison)** using `WHERE (col1, col2) IN (SELECT col1, col2 FROM ...)`. Both `department_id` and `salary` must simultaneously match the `(department_id, MAX(salary))` pair from the same row of the subquery. Note that if an employee has `department_id IS NULL`, `NULL = NULL` evaluates to `UNKNOWN`, so that row is not returned.
  * **A, C, D are incorrect:** Non-pairwise comparison occurs only when written as two separate `IN` predicates (`WHERE department_id IN (...) AND salary IN (...)`).
</details>

---

### Question 25
**In Oracle 11g and later, when you execute `SELECT * FROM departments WHERE department_id NOT IN (SELECT department_id FROM employees)` where `department_id` is nullable in both tables, which join algorithm in the Execution Plan was introduced by Oracle to perform a high-performance Anti-Join while still honoring `NULL` semantics?**

* A. `CARTESIAN MERGE JOIN`
* B. `HASH JOIN RIGHT ANTI NA` (or `HASH JOIN ANTI NA` — Null-Aware Anti-Join)
* C. `BITMAP INDEX SINGLE VALUE`
* D. `CONNECT BY WITHOUT FILTERING`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Prior to Oracle 11g, if columns in a `NOT IN` subquery were nullable, the CBO could not unnest the subquery into a standard Anti-Join and had to fall back to a slow `FILTER` plan. Starting in Oracle 11g, Oracle introduced the **Null-Aware Anti-Join** (shown in execution plans as **`HASH JOIN ANTI NA`**, **`HASH JOIN RIGHT ANTI NA`**, or **`HASH JOIN ANTI SNA`**), allowing fast hash anti-joins while still checking for `NULL` values properly.
  * **A, C, D are incorrect:** None of these are anti-join algorithms for nullable `NOT IN` subqueries.
</details>

---
