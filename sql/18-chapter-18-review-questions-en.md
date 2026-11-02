# Review Questions - Chapter 18: Indexes and SQL Performance Tuning

> **Reference:** *OCA/OCP Oracle Database SQL Exam Guide (Exam 1Z0-071)* & *Oracle Database SQL Tuning Guide*.  
> **Total Questions:** 25 multiple-choice questions modeled after the official Oracle OCA/OCP exam with detailed explanations.  
> **How to study:** Read each question carefully and choose your answer first, then click **"👉 View Answer & Detailed Explanation"** to check the official answer and understand key exam traps.

---

### Question 1
**In the `EMPLOYEES` table, the `COMMISSION_PCT` column allows `NULL` values and has a single-column B-Tree index defined as: `CREATE INDEX idx_emp_comm ON employees(commission_pct);`. When executing the query below, which access path will the Cost-Based Optimizer (CBO) choose?**

```sql
SELECT employee_id, last_name, salary
FROM employees
WHERE commission_pct IS NULL;
```

* A. `INDEX UNIQUE SCAN` on `IDX_EMP_COMM`
* B. `INDEX RANGE SCAN` on `IDX_EMP_COMM`
* C. `TABLE ACCESS FULL` on the `EMPLOYEES` table
* D. `INDEX SKIP SCAN` on `IDX_EMP_COMM`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** A standard **B-Tree index** in Oracle **does not store index entries where all indexed columns are `NULL`** (all-NULL entries). Because `IDX_EMP_COMM` is a single-column index on `commission_pct`, rows where `commission_pct IS NULL` do not exist in the index leaf blocks. Therefore, to retrieve those rows, Oracle must perform a **`TABLE ACCESS FULL`** (Full Table Scan).
  * **A, B, D are incorrect:** A single-column B-Tree index cannot satisfy an `IS NULL` predicate. (Tip: To index `NULL` values in a B-Tree index, create a composite index with a constant such as `CREATE INDEX idx_emp_comm ON employees(commission_pct, 0);` or use a Bitmap index).
</details>

---

### Question 2
**Why is it strongly discouraged to use a `BITMAP INDEX` on frequently modified columns in high-concurrency OLTP systems with heavy `INSERT`, `UPDATE`, and `DELETE` activity?**

* A. Because Bitmap indexes do not support `SELECT` statements with a `WHERE` clause
* B. Because a single Bitmap index entry (bitmap piece) maps to hundreds or thousands of table rows; modifying a single row locks the entire bitmap piece, blocking many other concurrent DML sessions
* C. Because Bitmap indexes consume 10 times more disk space than B-Tree indexes on low-cardinality columns
* D. Because Oracle automatically drops Bitmap indexes whenever an `UPDATE` statement is executed on the table

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In a **B-Tree index**, each leaf entry points to a single `ROWID`, so DML locks only affect individual rows. In contrast, a single **Bitmap index** entry (bitmap piece) covers a range of `ROWID`s representing **hundreds or thousands of rows**. When a session performs `INSERT`, `UPDATE`, or `DELETE` affecting that bitmap piece, the **entire bitmap piece is locked** (`TX` lock contention), blocking other sessions trying to modify completely different rows mapped within the same bitmap piece.
  * **A, C, D are incorrect:** Bitmap indexes excel at complex `WHERE` predicates (`AND`/`OR`/`COUNT`) in Data Warehouses (OLAP) and are highly compressed on low-cardinality columns.
</details>

---

### Question 3
**The `SUBSCRIBERS` table (50 million rows) has a `PHONE_NUMBER` column of data type `VARCHAR2(15)` with a B-Tree index `IDX_SUB_PHONE`. A developer executes the following query and notices severe performance degradation and potential runtime errors. What is the exact root cause?**

```sql
SELECT sub_id, full_name, status
FROM subscribers
WHERE phone_number = 912345678;
```

* A. Oracle implicitly converts the number `912345678` into `'912345678'` and uses `INDEX UNIQUE SCAN` normally; the query is slow only because it lacks an `ORDER BY` clause
* B. Oracle performs an implicit data type conversion on the `VARCHAR2` column to `NUMBER` as `TO_NUMBER(phone_number) = 912345678`, which disables the `IDX_SUB_PHONE` B-Tree index (forcing a `TABLE ACCESS FULL`) and risks raising `ORA-01722: invalid number`
* C. `VARCHAR2` columns cannot be indexed using B-Tree indexes in Oracle
* D. Oracle raises a syntax error at parse time because `=` cannot compare a string column with a numeric literal

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** According to Oracle's data type precedence rules, `NUMBER` has higher precedence than `VARCHAR2`. When comparing `varchar2_col = number_literal`, Oracle implicitly converts the column using **`TO_NUMBER(phone_number) = 912345678`**. Applying a function to the indexed column invalidates the standard B-Tree index `IDX_SUB_PHONE`, forcing a `TABLE ACCESS FULL` across 50 million rows, and will throw `ORA-01722: invalid number` if any row contains non-numeric characters (e.g., `'+84...'`).
  * **A, C, D are incorrect:** Always pass string literals (`'0912345678'`) when querying `VARCHAR2` columns.
</details>

---

### Question 4
**On the `ORDERS` table, a DBA created a composite B-Tree index as follows:**

```sql
CREATE INDEX idx_ord_comp ON orders(customer_id, status, order_date);
```

**Which of the following queries can most effectively use all 3 columns of `idx_ord_comp` as `Access Predicates` during an `INDEX RANGE SCAN`?**

* A. `SELECT * FROM orders WHERE status = 'PAID' AND order_date = DATE '2026-01-01';`
* B. `SELECT * FROM orders WHERE customer_id = 105 AND order_date = DATE '2026-01-01';`
* C. `SELECT * FROM orders WHERE customer_id = 105 AND status = 'PAID' AND order_date >= DATE '2026-01-01';`
* D. `SELECT * FROM orders WHERE customer_id > 100 AND status = 'PAID' AND order_date = DATE '2026-01-01';`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In the composite index `(customer_id, status, order_date)`, when the leading columns (`customer_id` and `status`) are filtered with equality (`=`) and the trailing column (`order_date`) uses a range operator (`>=`), all three columns serve as **Access Predicates** to bound the exact start and stop leaf blocks of the `INDEX RANGE SCAN`.
  * **A is incorrect:** Missing the leading column (`customer_id`).
  * **B is incorrect:** Missing the second column (`status`), so only `customer_id = 105` acts as an access predicate while `order_date` is only an index filter predicate.
  * **D is incorrect:** Because the leading column `customer_id > 100` uses a range condition, subsequent columns (`status`, `order_date`) cannot be used to narrow the contiguous key range as access predicates.
</details>

---

### Question 5
**What are the key differences between `INDEX FULL SCAN` and `INDEX FAST FULL SCAN` in Oracle Database? (Choose two.)**

* A. `INDEX FULL SCAN` reads leaf blocks in sorted key order using single-block I/O and returns rows in the order of the index keys
* B. `INDEX FAST FULL SCAN` reads all index blocks using multi-block I/O, but the returned rows are NOT guaranteed to be in sorted order
* C. `INDEX FAST FULL SCAN` reads only the root block without reading leaf blocks
* D. `INDEX FULL SCAN` deletes all index entries after scanning them

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, B**
* **Detailed Explanation:**
  * **A is correct:** `INDEX FULL SCAN` traverses from the root to the first leaf block and follows the doubly linked list of leaf blocks using **single-block I/O**, preserving the sorted key order (which can eliminate a `SORT ORDER BY` or `GROUP BY` operation).
  * **B is correct:** `INDEX FAST FULL SCAN` scans the entire index segment like a skinny table using **multi-block I/O** up to the index High Water Mark, ignoring the linked list order. It is very fast when the index covers all requested columns, but the output is **unordered**.
  * **C, D are incorrect:** Both scans read all leaf blocks and never delete data.
</details>

---

### Question 6
**When is the Cost-Based Optimizer (CBO) likely to choose an `INDEX SKIP SCAN` on a composite index `(col1, col2)`?**

* A. When the `WHERE` clause filters only on `col1` and omits `col2`
* B. When the `WHERE` clause filters only on `col2` (omitting the leading column `col1`), and the leading column `col1` has very few distinct values (low cardinality)
* C. When the table has no indexes at all but has a `CHECK` constraint
* D. When both `col1` and `col2` are wrapped in the `LOWER()` function

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `INDEX SKIP SCAN` enables Oracle to use a composite index even when the **leading column (`col1`) is omitted** from the `WHERE` clause, provided `col1` has **very few distinct values** (e.g., `gender` or `status`). Oracle logically splits the index scan into multiple sub-scans for each distinct prefix of `col1`.
  * **A is incorrect:** Filtering on `col1` uses a standard `INDEX RANGE SCAN` or `INDEX UNIQUE SCAN`.
  * **C, D are incorrect:** `INDEX SKIP SCAN` requires a usable composite index.
</details>

---

### Question 7
**Examine the SQL query joining the `EMPLOYEES` and `JOB_GRADES` tables below. Which physical join method can NEVER be used by the Cost-Based Optimizer for this join?**

```sql
SELECT e.employee_id, e.last_name, e.salary, g.grade_level
FROM employees e
JOIN job_grades g
  ON e.salary BETWEEN g.lowest_sal AND g.highest_sal;
```

* A. `NESTED LOOPS JOIN`
* B. `SORT MERGE JOIN`
* C. `HASH JOIN`
* D. Neither `NESTED LOOPS` nor `SORT MERGE JOIN` can be used

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** A **`HASH JOIN`** hashes the join column values into buckets and probes for exact hash matches, which means it **ONLY works with equijoins (`=`)**. Because the join condition here is `BETWEEN ... AND ...` (a non-equijoin / range join), the optimizer **cannot** use a `HASH JOIN`.
  * **A, B are incorrect:** Both `NESTED LOOPS JOIN` and `SORT MERGE JOIN` support non-equijoin range conditions (`>`, `<`, `>=`, `<=`, `BETWEEN`).
</details>

---

### Question 8
**Under which of the following circumstances does a `NESTED LOOPS JOIN` typically outperform a `HASH JOIN`?**

* A. When both tables contain hundreds of millions of rows with no `WHERE` filters and no indexes on the join columns
* B. When the driving (outer) row source returns a small number of rows and the probed (inner) table has an efficient index on the join column
* C. When aggregating 10 years of historical data across two massive unindexed Data Warehouse fact tables
* D. When the PGA memory is hundreds of gigabytes and full scans of both tables are required

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `NESTED LOOPS JOIN` is ideal when the outer (driving) row source produces a **small number of rows** and the inner (probed) table can be probed quickly via an **index (`UNIQUE SCAN` or `RANGE SCAN`)** on the join key. It also returns the first rows immediately without waiting to build an in-memory hash table.
  * **A, C, D are incorrect:** Joining large unindexed row sources is the ideal use case for `HASH JOIN`.
</details>

---

### Question 9
**What does the `CLUSTERING_FACTOR` of a B-Tree index measure, and what value indicates a GOOD clustering factor (making the CBO favor using the index)?**

* A. It measures the number of columns in the index; a larger value is always better
* B. It measures how well the physical order of rows in the table blocks matches the sorted order of the index keys; a good clustering factor is low and close to the number of `BLOCKS` in the table
* C. It measures the synchronization between the index and table; a good clustering factor is high and close to the total `NUM_ROWS` in the table
* D. It measures the branch depth (`BLEVEL`) of the B-Tree and is always `0`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `CLUSTERING_FACTOR` counts how many times Oracle must switch from one table data block to another while scanning the index leaf blocks sequentially:
    * If adjacent index entries point to rows stored in the same table block, `CLUSTERING_FACTOR` is **low and close to the number of table `BLOCKS` (Very Good)**.
    * If table rows are randomly scattered relative to the index order, `CLUSTERING_FACTOR` is **high and close to `NUM_ROWS` (Very Poor)**, making `TABLE ACCESS BY INDEX ROWID` expensive.
</details>

---

### Question 10
**Examine the Execution Plan below. Identify the exact execution order of the steps (`Id`) from the FIRST step executed to the LAST step executed:**

```sql
--------------------------------------------------------------------------------------
| Id  | Operation                    | Name              | Rows  | Bytes | Cost (%CPU)|
--------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT             |                   |    10 |   390 |     4   (0)|
|   1 |  NESTED LOOPS                |                   |    10 |   390 |     4   (0)|
|   2 |   TABLE ACCESS BY INDEX ROWID| DEPARTMENTS       |     1 |    19 |     2   (0)|
|*  3 |    INDEX UNIQUE SCAN         | DEPT_ID_PK        |     1 |       |     1   (0)|
|   4 |   TABLE ACCESS BY INDEX ROWID| EMPLOYEES         |    10 |   200 |     2   (0)|
|*  5 |    INDEX RANGE SCAN          | EMP_DEPARTMENT_IX |    10 |       |     1   (0)|
--------------------------------------------------------------------------------------
```

* A. `0 -> 1 -> 2 -> 3 -> 4 -> 5`
* B. `5 -> 4 -> 3 -> 2 -> 1 -> 0`
* C. `3 -> 2 -> 5 -> 4 -> 1 -> 0`
* D. `3 -> 5 -> 2 -> 4 -> 1 -> 0`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Execution plans are read **most indented first, and top-to-bottom for sibling operations at the same indentation level**:
    1. Under `Id = 1` (`NESTED LOOPS`), there are two child branches: `Id = 2` (outer/driving branch) and `Id = 4` (inner/probed branch).
    2. Starting with the top branch (`Id = 2`), its deepest child is **`Id = 3`** (`INDEX UNIQUE SCAN` on `DEPT_ID_PK`), which executes first.
    3. Its parent **`Id = 2`** (`TABLE ACCESS BY INDEX ROWID` on `DEPARTMENTS`) executes second.
    4. Next, the second branch (`Id = 4`) is probed, starting at its deepest child **`Id = 5`** (`INDEX RANGE SCAN` on `EMP_DEPARTMENT_IX`).
    5. Its parent **`Id = 4`** (`TABLE ACCESS BY INDEX ROWID` on `EMPLOYEES`) executes fourth.
    6. Both branches feed into **`Id = 1`** (`NESTED LOOPS`) and finally return to **`Id = 0`** (`SELECT STATEMENT`).
    * Exact order: **`3 -> 2 -> 5 -> 4 -> 1 -> 0`**.
</details>

---

### Question 11
**When inspecting the `Predicate Information` section below an execution plan generated by `DBMS_XPLAN.DISPLAY_CURSOR`, what is the difference between `access(...)` and `filter(...)`?**

* A. `access(...)` specifies predicates used to locate the start and stop bounds in an index (or hash buckets in a Hash Join), directly reducing the number of blocks read; `filter(...)` specifies predicates evaluated only after the blocks have been read into memory to discard non-matching rows
* B. `access(...)` is shown only for DBA users, whereas `filter(...)` is shown for regular users
* C. `filter(...)` is always faster than `access(...)` because it does not use indexes
* D. They are identical in meaning and only differ by Oracle version

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:**
    * **Access Predicates (`access`)** determine the search range within an access structure (such as B-Tree leaf block bounds or Hash Join buckets), directly reducing I/O (`Buffers`).
    * **Filter Predicates (`filter`)** are applied *after* blocks are read to discard non-qualifying rows and do not reduce the number of blocks visited at that step.
</details>

---

### Question 12
**The `TRANSACTIONS` table contains 20 million rows stored across 500,000 data blocks (its High Water Mark is at block 500,000). A developer executes `DELETE FROM transactions; COMMIT;` to remove all 20 million rows. Immediately afterward, the developer runs `SELECT COUNT(*) FROM transactions;` (which uses a `TABLE ACCESS FULL`). What will happen?**

* A. `SELECT COUNT(*)` returns `0` instantaneously (in 0.001 seconds) without reading any data blocks
* B. `SELECT COUNT(*)` still sequentially scans all 500,000 empty data blocks up to the High Water Mark (HWM), taking nearly the same time as when the table had 20 million rows
* C. Oracle raises `ORA-01403: no data found`
* D. The `DELETE` statement automatically resets the High Water Mark to `0`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** A `DELETE` statement marks rows as deleted so space can be reused, but it **NEVER lowers the High Water Mark (HWM)** of the table segment. During a `TABLE ACCESS FULL`, Oracle must read every formatted block up to the **HWM** (all 500,000 empty blocks). To reset the HWM, you must use `TRUNCATE TABLE`, `ALTER TABLE ... MOVE`, or `ALTER TABLE ... SHRINK SPACE`.
</details>

---

### Question 13
**On the `CUSTOMERS` table, the `EMAIL` column has a standard B-Tree index: `CREATE INDEX idx_cust_email ON customers(email);`. To enable the case-insensitive query below to use an index without modifying the table structure or query logic, what is the best solution?**

```sql
SELECT customer_id, full_name
FROM customers
WHERE LOWER(email) = 'support@vnpt.vn';
```

* A. Run `DBMS_STATS.GATHER_TABLE_STATS` so `idx_cust_email` automatically understands `LOWER`
* B. Create a **Function-Based Index**: `CREATE INDEX idx_cust_lower_email ON customers(LOWER(email));`
* C. Rewrite the query as `WHERE email LIKE '%support@vnpt.vn%'`
* D. Create a sequence on the `email` column

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Wrapping the `email` column in `LOWER(email)` prevents the optimizer from using a standard index on `(email)`. Creating a **Function-Based Index (FBI)** matching the exact expression `LOWER(email)` pre-computes and stores the lowercase values in the B-Tree leaf blocks, allowing an `INDEX RANGE SCAN`.
</details>

---

### Question 14
**When creating a Function-Based Index that invokes a user-defined PL/SQL function, which keyword MUST be included in the PL/SQL function declaration?**

```sql
CREATE INDEX idx_calc_tax ON invoices(fn_calculate_tax(amount, tax_code));
```

* A. `PARALLEL_ENABLE`
* B. `PIPELINED`
* C. `DETERMINISTIC`
* D. `AUTONOMOUS_TRANSACTION`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Any user-defined function used in a Function-Based Index (or Virtual Column) **must be declared as `DETERMINISTIC`**, guaranteeing that it always returns the exact same output for given inputs without side effects. Otherwise, Oracle raises **`ORA-30553: The function is not deterministic`**.
</details>

---

### Question 15
**In the `PRODUCTS` table, the `EXEC_DATE` column is of type `DATE` (storing both date and time components) and has a B-Tree index `IDX_PROD_DATE`. Which `WHERE` clause retrieves all records from October 15, 2026 while fully utilizing an `INDEX RANGE SCAN` on `IDX_PROD_DATE`?**

* A. `WHERE TRUNC(exec_date) = DATE '2026-10-15'`
* B. `WHERE TO_CHAR(exec_date, 'DD/MM/YYYY') = '15/10/2026'`
* C. `WHERE exec_date >= DATE '2026-10-15' AND exec_date < DATE '2026-10-16'`
* D. `WHERE exec_date BETWEEN DATE '2026-10-15' AND DATE '2026-10-16'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Using the half-open interval `exec_date >= DATE '2026-10-15' AND exec_date < DATE '2026-10-16'` keeps the indexed column `exec_date` bare on the left-hand side (enabling an optimal `INDEX RANGE SCAN`) while accurately covering `2026-10-15 00:00:00` through `2026-10-15 23:59:59`.
  * **A, B are incorrect:** Wrapping `exec_date` in `TRUNC()` or `TO_CHAR()` disables the standard B-Tree index on `exec_date`.
  * **D is incorrect:** `BETWEEN` is inclusive of both endpoints and would erroneously include rows at `2026-10-16 00:00:00`.
</details>

---

### Question 16
**Which two statements are TRUE regarding an `INVISIBLE INDEX` in Oracle Database? (Choose two.)**

* A. During `INSERT`, `UPDATE`, and `DELETE` operations on the table, an `INVISIBLE INDEX` is automatically maintained and updated just like a `VISIBLE INDEX`
* B. By default, the Cost-Based Optimizer (CBO) ignores an `INVISIBLE INDEX` when generating execution plans unless `OPTIMIZER_USE_INVISIBLE_INDEXES` is set to `TRUE`
* C. An `INVISIBLE INDEX` consumes zero disk space
* D. Making an index `INVISIBLE` purges all its entries, requiring a full `REBUILD` before making it `VISIBLE` again

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, B**
* **Detailed Explanation:**
  * **A, B are correct:** An `INVISIBLE INDEX` is fully maintained by all DML statements and still enforces uniqueness (if unique), but it is ignored by the Cost-Based Optimizer unless `OPTIMIZER_USE_INVISIBLE_INDEXES = TRUE`. Because it stays up to date during DML, toggling `ALTER INDEX ... VISIBLE` takes effect instantaneously without rebuilding.
</details>

---

### Question 17
**Starting in Oracle Database 12c, under what conditions can you create TWO indexes on the exact same column list (e.g., both on `EMPLOYEES(DEPARTMENT_ID)`)?**

* A. Anytime, without any restrictions
* B. Never under any circumstances
* C. When the two indexes have different physical characteristics (e.g., one B-Tree index and one Bitmap index) AND at most one of them is `VISIBLE` at any given time (the other must be `INVISIBLE`)
* D. When both indexes are `VISIBLE` and both are non-unique B-Tree indexes

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Oracle 12c+ allows multiple indexes on the exact same set and order of columns only if:
    1. They differ in type/properties (e.g., B-Tree vs. Bitmap, Unique vs. Non-Unique, Partitioned vs. Non-Partitioned), **AND**
    2. **Only one index is `VISIBLE`** at a time while all others on the same column list are **`INVISIBLE`**.
</details>

---

### Question 18
**While examining an actual execution plan using `DBMS_XPLAN.DISPLAY_CURSOR(NULL, NULL, 'ALLSTATS LAST')`, you observe that step `Id = 4` shows `E-Rows = 2` but `A-Rows = 1500K` (1.5 million rows). What does this discrepancy indicate?**

* A. The query executed 750,000 times faster than expected
* B. The Cost-Based Optimizer severely underestimated the cardinality (estimating 2 rows when 1.5 million rows were actually produced), typically caused by stale statistics, missing histograms on skewed data, or complex predicates, leading to a suboptimal join method (such as choosing `NESTED LOOPS` instead of `HASH JOIN`)
* C. The table data blocks are physically corrupted
* D. The `DB_BLOCK_SIZE` parameter is misconfigured

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** A massive gap between **`E-Rows` (Estimated Rows / Cardinality)** and **`A-Rows` (Actual Rows)** is the primary indicator of an suboptimal execution plan. Thinking only 2 rows will be returned (`E-Rows = 2`), the CBO chooses `NESTED LOOPS`, which then has to iterate 1.5 million times (`A-Rows = 1500K`) at runtime!
</details>

---

### Question 19
**In a Java or .NET application connecting to Oracle Database, if a developer constructs SQL queries by concatenating literals directly: `"SELECT * FROM orders WHERE order_id = " + orderId` (instead of using a Bind Variable `WHERE order_id = ?`), what severe impact does this have on Oracle's memory and CPU?**

* A. It overflows the Undo Tablespace and raises `ORA-01555`
* B. Every distinct `orderId` generates a unique SQL string, forcing Oracle to perform repeated **Hard Parses** (re-running the CBO from scratch) and flooding/fragmenting the **Shared Pool (Library Cache)**, causing severe latch/mutex contention and 100% CPU spikes
* C. It deletes all data in the `ORDERS` table
* D. It automatically converts all B-Tree indexes into Bitmap indexes

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Literal concatenation forces Oracle to treat every execution (`order_id = 101`, `order_id = 102`, ...) as a brand-new SQL statement requiring a costly **Hard Parse** and allocating a separate cursor in the **Shared Pool (Library Cache)**. Using **Bind Variables** (`:b1` or `?`) allows Oracle to Hard Parse once and reuse the execution plan via **Soft Parses**.
</details>

---

### Question 20
**The `TICKETS` table has 10 million rows. The `STATUS` column is indexed by `IDX_TICKET_STATUS` and has extreme data skew: `'CLOSED'` accounts for `9,999,500` rows (99.995%), while `'OPEN'` accounts for only `500` rows (0.005%). To allow the CBO to recognize this skew so it chooses `INDEX RANGE SCAN` for `'OPEN'` and `TABLE ACCESS FULL` for `'CLOSED'`, what statistics object must the DBA gather on `STATUS`?**

* A. A new Sequence
* B. A **Histogram** gathered via `DBMS_STATS.GATHER_TABLE_STATS` using the `METHOD_OPT` parameter
* C. A Synonym for the `TICKETS` table
* D. A `WITH READ ONLY` view

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Without a **Histogram**, the CBO assumes a uniform distribution across the 2 distinct values ($\frac{10,000,000}{2} = 5,000,000$ rows each), causing it to choose a `TABLE ACCESS FULL` even when querying `'OPEN'`. Gathering a **Histogram** on `STATUS` records the exact frequency distribution of skewed values so the CBO can pick the optimal plan for each value.
</details>

---

### Question 21
**The `EMPLOYEES` table has a `NOT NULL` constraint on `EMPLOYEE_ID` and a composite index `IDX_EMP_DEPT_SAL` on `(DEPARTMENT_ID, SALARY)`. When executing the query below, why can Oracle return the result WITHOUT performing `TABLE ACCESS BY INDEX ROWID` (without touching the `EMPLOYEES` table)?**

```sql
SELECT department_id, AVG(salary)
FROM employees
WHERE department_id IS NOT NULL
GROUP BY department_id;
```

* A. Because Oracle reads the result from the Recycle Bin
* B. Because all columns referenced in the query (`department_id` and `salary`) are contained within `IDX_EMP_DEPT_SAL` (a Covering Index), allowing Oracle to satisfy the query purely via an `INDEX FAST FULL SCAN` or `INDEX FULL SCAN`
* C. Because `AVG()` never reads data from tables or indexes
* D. Because `GROUP BY` caches results in `PLAN_TABLE`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Because every column needed by `SELECT`, `WHERE`, and `GROUP BY` (`department_id` and `salary`) is stored inside `IDX_EMP_DEPT_SAL` and `department_id IS NOT NULL` is guaranteed, the index acts as a **Covering Index** (Index-Only Scan), eliminating the need to access the underlying table blocks.
</details>

---

### Question 22
**Which of the following string predicates CAN use an `INDEX RANGE SCAN` on a standard B-Tree index created on the `CUSTOMER_NAME` column?**

* A. `WHERE customer_name LIKE '%NGUYEN%'`
* B. `WHERE customer_name LIKE '_NGUYEN%'`
* C. `WHERE customer_name LIKE 'NGUYEN%'`
* D. `WHERE SUBSTR(customer_name, 1, 6) = 'NGUYEN'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `LIKE 'NGUYEN%'` has a fixed leading prefix (`'NGUYEN'`), allowing Oracle to navigate the B-Tree index and perform an **`INDEX RANGE SCAN`** (`access("CUSTOMER_NAME" LIKE 'NGUYEN%')`).
  * **A, B are incorrect:** Leading wildcards (`%` or `_` at the start) prevent B-Tree range boundary positioning.
  * **D is incorrect:** Applying `SUBSTR()` to the column disables a standard B-Tree index unless a Function-Based Index exists.
</details>

---

### Question 23
**Suppose you create the `DEPARTMENTS` table with an inline primary key: `CREATE TABLE departments (dept_id NUMBER PRIMARY KEY, dept_name VARCHAR2(50));` (which causes Oracle to implicitly create a Unique Index for the primary key). You then execute `ALTER TABLE departments DISABLE PRIMARY KEY;`. What happens to that Unique Index?**

* A. The implicitly created Unique Index is automatically dropped by Oracle
* B. The Unique Index remains intact and converts into a `BITMAP INDEX`
* C. `DISABLE PRIMARY KEY` fails unless the table is dropped first
* D. The Unique Index is renamed to `SYS_TEMP_INDEX`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** When a Unique Index is **implicitly created** by Oracle during the creation of a `PRIMARY KEY` or `UNIQUE` constraint, disabling or dropping that constraint (without specifying `KEEP INDEX`) **automatically drops the underlying Unique Index**. (Conversely, an explicitly pre-created index is retained by default).
</details>

---

### Question 24
**Which operator in the SQL query below causes an unnecessary `SORT UNIQUE` (or `HASH UNIQUE`) operation if the developer already knows that rows from the two partitioned tables are mutually exclusive?**

```sql
SELECT trans_id, amount, trans_date FROM trans_2025
UNION
SELECT trans_id, amount, trans_date FROM trans_2026;
```

* A. The `UNION` operator (which should be replaced with `UNION ALL` to eliminate the expensive sort/deduplication step)
* B. The `SELECT` keyword
* C. The `trans_date` column
* D. The trailing semicolon `;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** The **`UNION`** operator forces Oracle to sort/hash the combined rows to eliminate duplicates (`SORT UNIQUE`), consuming extra CPU, PGA memory, and TEMP space. Replacing it with **`UNION ALL`** streams both result sets directly with zero deduplication overhead.
</details>

---

### Question 25
**The `EMPLOYEES` table contains `10,000` rows (`NUM_ROWS = 10000`). The `DEPARTMENT_ID` column contains no `NULL` values and has `20` uniformly distributed distinct values (`NUM_DISTINCT = 20`, no histogram). When executing a query with `WHERE department_id = 50`, what `Selectivity` and `Cardinality` will the Cost-Based Optimizer (CBO) calculate?**

* A. `Selectivity = 20`, `Cardinality = 500`
* B. `Selectivity = 0.05`, `Cardinality = 500`
* C. `Selectivity = 0.50`, `Cardinality = 5000`
* D. `Selectivity = 0.005`, `Cardinality = 50`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Using the standard CBO formulas for an equality predicate on a uniform column without `NULL`s:
    * $\text{Selectivity} = \frac{1}{\text{NUM\_DISTINCT}} = \frac{1}{20} = 0.05$ (5%).
    * $\text{Cardinality (E-Rows)} = \text{NUM\_ROWS} \times \text{Selectivity} = 10,000 \times 0.05 = 500\text{ rows}$.
</details>

---
