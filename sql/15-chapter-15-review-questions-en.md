# Review Questions - Chapter 15: Analytic / Window Functions

> **Part II:** Advanced Oracle SQL for Developers  
> **Total Questions:** 25 multiple-choice questions aligned with the Oracle Database SQL (1Z0-071 / 1Z0-047) certification exams.  
> **How to study:** Read each question and calculate the window result carefully before expanding **"👉 View Answer & Detailed Explanation"**.

---

### Question 1
**According to the logical query processing order of a `SELECT` statement in Oracle SQL, when are Analytic Functions (functions with an `OVER` clause) evaluated?**

* A. Before the `WHERE` clause and before the `GROUP BY` clause.
* B. After the `WHERE` clause, but before the `GROUP BY` and `HAVING` clauses.
* C. After the `FROM`, `WHERE`, `GROUP BY`, and `HAVING` clauses have completed, but before the outer `ORDER BY` clause.
* D. Last of all, after both the `ORDER BY` and `FETCH FIRST` clauses.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** The standard logical processing order in SQL is: `FROM/JOIN` $\rightarrow$ `WHERE` $\rightarrow$ `GROUP BY` $\rightarrow$ `HAVING` $\rightarrow$ **Analytic Functions (`OVER`)** $\rightarrow$ `SELECT / DISTINCT` $\rightarrow$ `ORDER BY` $\rightarrow$ `OFFSET / FETCH`. Because analytic functions are evaluated after `WHERE`, `GROUP BY`, and `HAVING`, they can never appear directly inside those three clauses.
  * **A, B, D are incorrect:** They do not reflect the actual SQL evaluation order.
</details>

---

### Question 2
**Examine the following SQL statement. What happens when this statement is executed?**

```sql
SELECT employee_id, first_name, department_id, salary
FROM employees
WHERE RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) = 1;
```

* A. It returns the highest-paid employee(s) in each department.
* B. It returns only the single highest-paid employee in the entire company.
* C. It fails with `ORA-30483: window functions are not allowed here` because analytic functions cannot be placed in the `WHERE` clause.
* D. It fails because the `RANK()` function requires an argument inside its parentheses.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Analytic functions (`RANK() OVER (...)`) are allowed only in the **`SELECT`** list and the **`ORDER BY`** clause. Placing `RANK() OVER (...)` directly in a `WHERE`, `GROUP BY`, or `HAVING` clause raises **`ORA-30483: window functions are not allowed here`**. To filter by a window function result, wrap the query in a CTE (`WITH`) or an inline view and filter in the outer `WHERE` clause.
  * **A, B, D are incorrect:** Analytic `RANK()` takes no arguments, and fails here due to appearing in the `WHERE` clause.
</details>

---

### Question 3
**Five employees in the same department have `SALARY` values in descending order: `10000`, `8000`, `8000`, `8000`, `6000`. What values are returned by `RANK() OVER (ORDER BY salary DESC)` and `DENSE_RANK() OVER (ORDER BY salary DESC)` for the employee earning `6000`?**

* A. `RANK = 5` and `DENSE_RANK = 3`
* B. `RANK = 3` and `DENSE_RANK = 5`
* C. `RANK = 4` and `DENSE_RANK = 3`
* D. `RANK = 5` and `DENSE_RANK = 5`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** For the 5 salaries (`10000`, `8000`, `8000`, `8000`, `6000`):
    * With `RANK()` (leaves gaps after ties): `10000` is rank `1`; the three `8000` rows tie for rank `2` (`2, 2, 2`—occupying positions 2, 3, and 4); the next row (`6000`) receives rank **`5`**.
    * With `DENSE_RANK()` (consecutive ranks with no gaps): `10000` is rank `1`; the three `8000` rows tie for rank `2` (`2, 2, 2`); the next row (`6000`) receives the next consecutive integer rank, **`3`**.
  * **B, C, D are incorrect:** They confuse gap handling between `RANK` and `DENSE_RANK`.
</details>

---

### Question 4
**A data partition contains 10 rows ordered by `salary DESC`. When you apply `NTILE(4) OVER (ORDER BY salary DESC)`, how many rows are assigned to each of the 4 buckets (Bucket 1, Bucket 2, Bucket 3, Bucket 4), respectively?**

* A. `2, 2, 3, 3`
* B. `3, 3, 2, 2`
* C. `4, 4, 2, 0`
* D. `2.5, 2.5, 2.5, 2.5`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** When dividing $10$ rows into $4$ buckets with `NTILE(4)`:
    * Base rows per bucket: $\lfloor 10 / 4 \rfloor = 2$.
    * Remainder: $10 \bmod 4 = 2$ extra rows.
    * `NTILE(n)` distributes the $r$ remainder rows **one each to the first $r$ buckets** (from Bucket 1 through Bucket $r$). With remainder $2$, Bucket 1 and Bucket 2 each get $2 + 1 = 3$ rows, while Bucket 3 and Bucket 4 each get $2$ rows $\rightarrow$ **`3, 3, 2, 2`**.
  * **A, C, D are incorrect:** Extra rows are always added starting from Bucket 1, never from the last bucket.
</details>

---

### Question 5
**The `TEST_SCORES` table has 4 candidates with `SCORE` values of `90`, `80`, `80`, and `70`. When the query below is executed, what are the values of `PCT_RNK` and `CUME_DST` for the first row (`SCORE = 90`)?**

```sql
SELECT score,
       PERCENT_RANK() OVER (ORDER BY score DESC) AS pct_rnk,
       CUME_DIST()    OVER (ORDER BY score DESC) AS cume_dst
FROM test_scores;
```

* A. `pct_rnk = 0.25` and `cume_dst = 0.25`
* B. `pct_rnk = 0` and `cume_dst = 0.25`
* C. `pct_rnk = 0` and `cume_dst = 0`
* D. `pct_rnk = 1` and `cume_dst = 0.25`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * `PERCENT_RANK()` is calculated as $\frac{\text{RANK}() - 1}{N - 1}$. For the first row (`score = 90`), `RANK() = 1`, so `PERCENT_RANK() = (1 - 1) / (4 - 1) = 0`. (A row ranked 1 always has `PERCENT_RANK = 0`.)
    * `CUME_DIST()` is calculated as $\frac{\text{Number of rows preceding or peer with current row}}{N}$. At `score = 90`, 1 row out of 4 has a score $\ge 90$, so `CUME_DIST() = 1 / 4 = 0.25`.
  * **A, C, D are incorrect:** `CUME_DIST()` is strictly positive ($> 0$), and `PERCENT_RANK()` for rank 1 is always `0`.
</details>

---

### Question 6
**Using the same `TEST_SCORES` table with 4 rows (`90`, `80`, `80`, `70`) from Question 5, what value does `CUME_DIST() OVER (ORDER BY score DESC)` return for the two tied rows where `SCORE = 80`?**

* A. The first `80` row returns `0.50`, and the second `80` row returns `0.75`.
* B. Both `80` rows return `0.50`.
* C. Both `80` rows return `0.75`.
* D. Both `80` rows return `0.33`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `CUME_DIST()` counts all rows whose sort key is earlier than **or equal to (peer with)** the current row divided by total rows in the partition. In descending order (`90, 80, 80, 70`), there are **3 rows** (`90, 80, 80`) down through `80` out of **4 total rows**. Therefore, both tied rows with `SCORE = 80` receive `CUME_DIST() = 3 / 4 = 0.75`.
  * **A, B, D are incorrect:** Tied rows always receive the exact same `CUME_DIST()` value (`0.75`), whereas `0.33` ($1/3$) is their `PERCENT_RANK()`.
</details>

---

### Question 7
**When using `LAG(salary, 2, -1) OVER (PARTITION BY department_id ORDER BY hire_date ASC)`, what do the arguments `2` and `-1` specify?**

* A. Retrieve the `salary` from the row `2` positions prior to the current row within the same department; if no such row exists (out of partition bounds), return `-1`.
* B. Retrieve the `salary` from `1` row prior and subtract `2` from it.
* C. Retrieve the `salary` from `2` rows after the current row; if that `salary` is `NULL`, replace it with `-1`.
* D. Divide the partition into `2` buckets and decrement the rank by `1`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** In `LAG(expr, offset, default_value) OVER (...)`:
    * `offset = 2`: Looks back **2 physical rows** prior to the current row in the same `department_id` partition ordered by `hire_date ASC`.
    * `default_value = -1`: Returned when looking back `2` rows goes beyond the start of the partition (i.e., for the 1st and 2nd rows of each department).
  * **B, C, D are incorrect:** Note that `default_value` is only used when the offset falls **outside the partition boundaries**, not when a prior row exists with a `NULL` column value.
</details>

---

### Question 8
**Within a partition of the `EMP` table, there are 3 rows ordered by `emp_id`:**
- **Row 1: `emp_id = 1`, `commission_pct = 0.1`**
- **Row 2: `emp_id = 2`, `commission_pct = NULL`**
- **Row 3: `emp_id = 3`, `commission_pct = 0.2`**

**At Row 3 (`emp_id = 3`), what values do `LAG(commission_pct, 1, 0.99) OVER (ORDER BY emp_id)` and `LAG(commission_pct IGNORE NULLS, 1, 0.99) OVER (ORDER BY emp_id)` return, respectively?**

* A. `0.99` and `0.1`
* B. `NULL` and `0.1`
* C. `NULL` and `0.99`
* D. `0.1` and `0.1`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** This is a subtle OCP exam trap!
    * For `LAG(commission_pct, 1, 0.99)`: At Row 3, 1 row prior is Row 2. Row 2 **exists** (it is within the partition bounds), and its `commission_pct` value is **`NULL`**. Because the `default_value` (`0.99`) only applies when no prior row exists (such as at Row 1) and does not act like `NVL()`, the expression returns **`NULL`**.
    * For `LAG(commission_pct IGNORE NULLS, 1, 0.99)`: At Row 3, it skips over Row 2 because `commission_pct` is `NULL` and continues backward to Row 1, returning **`0.1`**.
  * **A, C, D are incorrect:** They confuse the `LAG` out-of-bounds default value with `NVL()`.
</details>

---

### Question 9
**The `EMP_DEPT10` table contains 3 employees with ascending salaries: `Alice (5000)`, `Bob (7000)`, and `David (9000)`. When you execute the query below, what is the value of `HIGHEST_SAL` on the row for `Alice (5000)`?**

```sql
SELECT first_name,
       salary,
       LAST_VALUE(salary) OVER (ORDER BY salary ASC) AS highest_sal
FROM emp_dept10;
```

* A. `9000`
* B. `5000`
* C. `7000`
* D. `NULL`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** This is the **#1 `LAST_VALUE` trap on Oracle SQL exams**! When an `ORDER BY` clause is present inside `OVER(...)` without an explicit windowing clause (`ROWS/RANGE BETWEEN`), Oracle uses the default window frame:
    `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`.
    Therefore, when evaluating `Alice (5000)`, the window frame only extends from the start of the partition up to `Alice` (`5000`). The last value in that frame is **`5000`**, not `9000`!
  * **A, C, D are incorrect:** To get `9000` on every row, you must explicitly specify `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`.
</details>

---

### Question 10
**To ensure that `LAST_VALUE(first_name) OVER (PARTITION BY department_id ORDER BY salary ASC ...)` always returns the name of the highest-paid employee in the entire department for every row, which windowing clause should you add in place of `...`?**

* A. `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`
* B. `ROWS BETWEEN CURRENT ROW AND 1 FOLLOWING`
* C. `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`
* D. `RANGE BETWEEN UNBOUNDED FOLLOWING AND UNBOUNDED PRECEDING`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` extends the end of the window frame all the way to the last row of the partition (`UNBOUNDED FOLLOWING`), allowing `LAST_VALUE()` to see the final row of the department from every row.
  * **A is incorrect:** Stopping at `CURRENT ROW` causes `LAST_VALUE` to return the current row's value.
  * **B is incorrect:** It only looks 1 row ahead.
  * **D is incorrect:** `UNBOUNDED FOLLOWING` cannot be the starting bound (`ORA-30487`).
</details>

---

### Question 11
**What is the difference between the default window frame of `SUM(salary) OVER (PARTITION BY department_id)` (without `ORDER BY`) and `SUM(salary) OVER (PARTITION BY department_id ORDER BY employee_id)` (with `ORDER BY`)?**

* A. There is no difference; both return the total salary of the entire department.
* B. The expression without `ORDER BY` computes the grand total salary for the entire department partition, whereas the expression with `ORDER BY` computes a cumulative running total from the first row of the department up to the current row.
* C. The expression without `ORDER BY` fails with a syntax error because every `OVER()` clause requires an `ORDER BY`.
* D. The expression with `ORDER BY` returns only the current row's salary without summing.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * **Without `ORDER BY`** in `OVER(PARTITION BY department_id)`, the default window frame is the entire partition (`RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`), returning the department total on every row.
    * **With `ORDER BY`** in `OVER(PARTITION BY department_id ORDER BY employee_id)`, the default window frame becomes `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`, producing a **Running Total**.
  * **A, C, D are incorrect:** `ORDER BY` is optional for analytic aggregates (`SUM`, `AVG`, `COUNT`, `MIN`, `MAX`), but adding it changes the default window frame.
</details>

---

### Question 12
**The `ITEMS` table has 4 rows ordered by `PRICE` ascending:**
- **Row 1: `item_id = 1`, `price = 100`**
- **Row 2: `item_id = 2`, `price = 200`**
- **Row 3: `item_id = 3`, `price = 200`**
- **Row 4: `item_id = 4`, `price = 300`**

**When you execute the query below, what are the values of `sum_default` and `sum_rows` on Row 2 (`item_id = 2`, `price = 200`)?**

```sql
SELECT item_id,
       price,
       SUM(price) OVER (ORDER BY price) AS sum_default,
       SUM(price) OVER (ORDER BY price, item_id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS sum_rows
FROM items;
```

* A. `sum_default = 300` and `sum_rows = 300`
* B. `sum_default = 500` and `sum_rows = 300`
* C. `sum_default = 300` and `sum_rows = 500`
* D. `sum_default = 500` and `sum_rows = 500`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** This tests the critical difference between `RANGE` (the default) and `ROWS` when duplicate sort keys (ties) exist (`price = 200` on both Row 2 and Row 3):
    * `sum_default`: Uses the default **`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`**. Because `RANGE` operates on logical values (`price <= 200`), at Row 2 (`price = 200`) it includes **all peer rows** with `price = 200` (both Row 2 and Row 3): $100 + 200 + 200 =$ **`500`**!
    * `sum_rows`: Uses **`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`**, summing strictly physical rows 1 and 2: $100 + 200 =$ **`300`**.
  * **A, C, D are incorrect:** They miss how `RANGE` groups peer rows with identical `ORDER BY` values.
</details>

---

### Question 13
**When using a value-based window frame with a numeric offset, such as `RANGE BETWEEN 100 PRECEDING AND 100 FOLLOWING`, which requirement MUST be satisfied by the `ORDER BY` clause inside `OVER(...)`?**

* A. The `ORDER BY` clause can contain any number of columns of any data type (including `VARCHAR2`).
* B. The `ORDER BY` clause must contain **only a single expression**, and that expression must have a **numeric (`NUMBER`)** or **datetime (`DATE` / `TIMESTAMP`)** data type.
* C. The `ORDER BY` clause must sort in descending (`DESC`) order.
* D. A `PARTITION BY` clause is not allowed when `RANGE` is used.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** When `RANGE` uses a numeric or interval offset (`n PRECEDING` or `n FOLLOWING`), Oracle must compute `col_value - n` and `col_value + n`. Consequently, the `ORDER BY` clause inside `OVER(...)` is restricted to **exactly one expression**, and its data type must be **`NUMBER`** or **`DATE`/`TIMESTAMP`**. Sorting by a `VARCHAR2` column or multiple columns raises `ORA-30486: invalid window aggregation group in the window specification`.
  * **A, C, D are incorrect:** Only `ROWS BETWEEN n PRECEDING ...` permits multiple sort columns or character data types.
</details>

---

### Question 14
**You want to calculate a Moving Average of `salary` for each employee together with the 2 employees hired immediately before them and the 2 employees hired immediately after them in the same department (up to 5 physical rows total). Which syntax is CORRECT?**

* A. `AVG(salary) OVER (PARTITION BY department_id ORDER BY hire_date ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING)`
* B. `AVG(salary) OVER (PARTITION BY department_id ORDER BY hire_date RANGE BETWEEN 2 PRECEDING AND 2 FOLLOWING)`
* C. `AVG(salary) OVER (PARTITION BY department_id ORDER BY hire_date ROWS BETWEEN 2 FOLLOWING AND 2 PRECEDING)`
* D. `AVG(salary) OVER (PARTITION BY department_id ORDER BY hire_date WINDOW 2 PRECEDING TO 2 FOLLOWING)`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** To include 2 physical rows before, the current row, and 2 physical rows after ordered by `hire_date`, use **`ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING`**.
  * **B is incorrect:** Using `RANGE BETWEEN 2 PRECEDING AND 2 FOLLOWING` on a `DATE` column averages employees hired within **$\pm 2$ calendar days** of the current employee's `hire_date`, not 2 physical rows before and after.
  * **C is incorrect:** Starting with `2 FOLLOWING` and ending with `2 PRECEDING` is invalid (`ORA-30487`).
  * **D is incorrect:** Invalid SQL syntax.
</details>

---

### Question 15
**The shorthand syntax `SUM(salary) OVER (ORDER BY hire_date ROWS 3 PRECEDING)` (without the `BETWEEN` keyword) is 100% equivalent to which full windowing clause?**

* A. `SUM(salary) OVER (ORDER BY hire_date ROWS BETWEEN 3 PRECEDING AND UNBOUNDED FOLLOWING)`
* B. `SUM(salary) OVER (ORDER BY hire_date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW)`
* C. `SUM(salary) OVER (ORDER BY hire_date ROWS BETWEEN UNBOUNDED PRECEDING AND 3 PRECEDING)`
* D. It fails with a syntax error because the `BETWEEN` keyword is always mandatory.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** When `BETWEEN` is omitted and only a single bound is specified (e.g., `ROWS 3 PRECEDING` or `ROWS UNBOUNDED PRECEDING`), Oracle implicitly sets the upper bound to **`AND CURRENT ROW`**. Thus, `ROWS 3 PRECEDING` is equivalent to `ROWS BETWEEN 3 PRECEDING AND CURRENT ROW` (up to 4 rows: 3 preceding + current row).
  * **A, C, D are incorrect:** Short-form window specifications are valid and always end at `CURRENT ROW`.
</details>

---

### Question 16
**Which built-in Oracle analytic function computes the ratio of a value in the current row to the sum (`SUM`) of values across the entire partition (equivalent to `salary / SUM(salary) OVER (PARTITION BY department_id)`)?**

* A. `PERCENT_RANK(salary) OVER (PARTITION BY department_id)`
* B. `RATIO_TO_REPORT(salary) OVER (PARTITION BY department_id)`
* C. `CUME_DIST(salary) OVER (PARTITION BY department_id)`
* D. `NTILE(salary) OVER (PARTITION BY department_id)`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `RATIO_TO_REPORT(expr) OVER ([PARTITION BY ...])` computes the ratio of `expr` for the current row to `SUM(expr)` for the partition. Note that `ORDER BY` is **not allowed** inside the `OVER(...)` clause of `RATIO_TO_REPORT`.
  * **A, C, D are incorrect:** `PERCENT_RANK()` and `CUME_DIST()` compute relative rank/distribution positions (and take no arguments as analytic functions), while `NTILE(n)` divides rows into `n` buckets.
</details>

---

### Question 17
**Examine the following SQL statement. What happens when it is executed?**

```sql
SELECT first_name,
       salary,
       ROW_NUMBER() OVER (
           PARTITION BY department_id
           ORDER BY salary DESC
           ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
       ) AS rn
FROM employees;
```

* A. It numbers rows from 1 to 3 repeatedly for each 3-row sliding window.
* B. It fails with a syntax error because pure ranking functions such as `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()` do not allow a windowing clause (`ROWS / RANGE BETWEEN ...`) inside `OVER(...)`.
* C. It executes successfully and ignores the `ROWS BETWEEN` clause.
* D. It fails because `ROW_NUMBER()` does not allow `PARTITION BY`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Ranking functions (`ROW_NUMBER`, `RANK`, `DENSE_RANK`, `NTILE`, `PERCENT_RANK`, `CUME_DIST`) and offset functions (`LAG`, `LEAD`) always operate over the entire partition and **do not support** a windowing clause (`ROWS | RANGE BETWEEN ...`). Including one causes a syntax error (`ORA-30484` / syntax error at `ROWS`).
  * **A, C, D are incorrect:** Only analytic aggregates (`SUM`, `AVG`, `COUNT`, etc.) and `FIRST_VALUE` / `LAST_VALUE` / `NTH_VALUE` support `ROWS / RANGE BETWEEN`.
</details>

---

### Question 18
**You want to retrieve the 2nd highest salary in each department and display it on every row of that department using `NTH_VALUE`. Which expression is CORRECT?**

* A. `NTH_VALUE(salary, 2) OVER (PARTITION BY department_id ORDER BY salary DESC)`
* B. `NTH_VALUE(salary, 2) OVER (PARTITION BY department_id ORDER BY salary DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)`
* C. `NTH_VALUE(2, salary) OVER (PARTITION BY department_id ORDER BY salary DESC)`
* D. `NTH_VALUE(salary, 2) WITHIN GROUP (ORDER BY salary DESC)`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Like `LAST_VALUE`, `NTH_VALUE(measure_expr, n)` is subject to the default window frame (`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`). Without `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`, on the 1st row of each department the window frame contains only 1 row, so `NTH_VALUE(salary, 2)` returns **`NULL`** on the first row! Specifying `UNBOUNDED FOLLOWING` ensures every row sees the 2nd row of the partition.
  * **A is incorrect:** Returns `NULL` on the first row of each department.
  * **C is incorrect:** Reverses the arguments (`measure_expr` must come first, `n` second).
  * **D is incorrect:** `NTH_VALUE` uses `OVER(...)`, not `WITHIN GROUP`.
</details>

---

### Question 19
**How does Oracle's `KEEP (DENSE_RANK FIRST ORDER BY ...)` clause work in the following query?**

```sql
SELECT department_id,
       MAX(salary) KEEP (DENSE_RANK FIRST ORDER BY hire_date ASC) AS result_sal
FROM employees
GROUP BY department_id;
```

* A. It finds the highest-paid employee in each department and returns their `hire_date`.
* B. Within each department, it identifies the employee(s) with the earliest `hire_date` (`DENSE_RANK FIRST` ordered by `hire_date ASC`), and if multiple employees tied for that earliest `hire_date`, it returns the maximum `salary` (`MAX(salary)`) among them.
* C. It fails because `MAX(salary)` cannot be combined with `ORDER BY hire_date` on a different column.
* D. It sorts the final query output by `hire_date ASC`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The `FIRST` / `LAST` aggregate functions with `KEEP` work in two steps:
    1. Within each `department_id` group, rows are ranked by `ORDER BY hire_date ASC` and only the rows with `DENSE_RANK = 1` (`FIRST`—the earliest hired employee(s) in that department) are kept.
    2. Across those kept rows, the outer aggregate function `MAX(salary)` is applied as a tie-breaker to return a single value per department.
  * **A, C, D are incorrect:** `KEEP (DENSE_RANK FIRST/LAST)` is specifically designed to rank by one column (`hire_date`) and aggregate another column (`salary`).
</details>

---

### Question 20
**Can `GROUP BY` and an Analytic Function (`OVER`) be used together in the same `SELECT` block? Examine the following query:**

```sql
SELECT department_id,
       SUM(salary) AS dept_total_sal,
       RANK() OVER (ORDER BY SUM(salary) DESC) AS dept_sal_rank
FROM employees
GROUP BY department_id;
```

* A. No, because `GROUP BY` and `OVER(...)` cannot appear in the same `SELECT` statement.
* B. No, because an aggregate function like `SUM(salary)` cannot be nested inside `OVER (ORDER BY ...)`.
* C. Yes! Oracle executes `GROUP BY department_id` and calculates `SUM(salary)` for each department first, and then the analytic function `RANK() OVER (ORDER BY SUM(salary) DESC)` ranks the grouped department rows by their total salary descending.
* D. Only if `RANK()` is replaced with `ROWNUM`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Because `GROUP BY` is evaluated at **Step 3** and Analytic Functions are evaluated at **Step 5** (operating on the rows produced after `GROUP BY` and `HAVING`), nesting an aggregate function (`SUM(salary)`) inside the `OVER(...)` clause of an analytic function is **completely valid** and very useful!
  * **A, B, D are incorrect:** While nesting an analytic function inside another analytic function is prohibited, nesting an aggregate function inside an analytic function's `OVER` clause is valid.
</details>

---

### Question 21
**Examine the following SQL statement. What happens when it is executed?**

```sql
SELECT first_name,
       department_id,
       salary,
       AVG(SUM(salary) OVER (PARTITION BY department_id)) OVER () AS avg_of_dept_sums
FROM employees;
```

* A. It executes successfully and calculates the average of the department salary totals.
* B. It fails with `ORA-30483: window functions are not allowed here` because Oracle SQL does not allow nesting one analytic function inside another analytic function.
* C. It fails because an empty `OVER ()` clause without `PARTITION BY` is a syntax error.
* D. It returns `NULL` for every row.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Oracle SQL **does not allow nesting an analytic function directly inside another analytic function** (`AVG(SUM(salary) OVER (...)) OVER ()`). To compute a second-level analytic calculation over a first-level analytic result, place the inner analytic function in a CTE (`WITH`) or an inline view first.
  * **A, C, D are incorrect:** An empty `OVER ()` clause is valid (treating the whole result set as one partition); the error is caused by nesting two `OVER()` functions.
</details>

---

### Question 22
**In the `EMPLOYEES` table, several employees have `COMMISSION_PCT IS NULL`. When you specify `ORDER BY commission_pct DESC` inside `OVER (ORDER BY commission_pct DESC)` without explicitly specifying `NULLS FIRST` or `NULLS LAST`, where are the rows with `COMMISSION_PCT IS NULL` placed, and what rank do they receive from `RANK()`?**

* A. They are placed last and receive the highest rank number.
* B. They are placed first (at the top) and all tie for rank `1` (`RANK = 1`), because in Oracle `NULL` values are considered the largest values by default when sorting in descending (`DESC`) order.
* C. Rows with `COMMISSION_PCT IS NULL` are ignored and receive `RANK = NULL`.
* D. An error is raised because `RANK()` cannot be used on a nullable column.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In Oracle SQL, for any `ORDER BY` clause (both query-level and analytic `OVER`), **`NULL` values sort as the HIGHEST values by default** (`ASC` implies `NULLS LAST`, whereas **`DESC` implies `NULLS FIRST`**). Furthermore, ranking functions treat `NULL` values as equal peers. Thus, with `ORDER BY commission_pct DESC`, all `NULL` rows appear first and tie at **`RANK = 1`**! Use `ORDER BY commission_pct DESC NULLS LAST` to push `NULL`s to the bottom.
  * **A, C, D are incorrect:** This is a classic Oracle sorting trap with nullable columns.
</details>

---

### Question 23
**The `DAILY_SALES` table has a `SALE_DATE` column (`DATE` type) and an `AMOUNT` column (`NUMBER` type). You want to calculate the sum of `AMOUNT` for the current row's date plus all transactions occurring within the preceding 7 calendar days (even if some calendar days have no transactions or multiple transactions). Which Window Frame syntax satisfies this requirement?**

* A. `SUM(amount) OVER (ORDER BY sale_date ROWS BETWEEN 7 PRECEDING AND CURRENT ROW)`
* B. `SUM(amount) OVER (ORDER BY sale_date RANGE BETWEEN INTERVAL '7' DAY PRECEDING AND CURRENT ROW)`
* C. `SUM(amount) OVER (PARTITION BY sale_date ROWS 7 PRECEDING)`
* D. `SUM(amount) OVER (ORDER BY sale_date ROWS BETWEEN INTERVAL '7' DAY PRECEDING AND CURRENT ROW)`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Because some days may have zero transactions or multiple transactions, you must use a **logical date range (`RANGE`)** rather than counting physical rows (`ROWS`). On a `DATE` column, `RANGE BETWEEN INTERVAL '7' DAY PRECEDING AND CURRENT ROW` (or `RANGE BETWEEN 7 PRECEDING AND CURRENT ROW`) sums all rows whose `sale_date` falls within `[current_sale_date - 7 days, current_sale_date]`.
  * **A is incorrect:** `ROWS BETWEEN 7 PRECEDING` always counts 7 physical rows regardless of their dates.
  * **C is incorrect:** `PARTITION BY sale_date` isolates each date into a separate partition.
  * **D is incorrect:** The `ROWS` keyword cannot be used with `INTERVAL`.
</details>

---

### Question 24
**In addition to being used as analytic functions (`OVER`), `RANK`, `DENSE_RANK`, `PERCENT_RANK`, and `CUME_DIST` can also be used as Hypothetical-Set Aggregate Functions with the `WITHIN GROUP` clause. What does the following query return?**

```sql
SELECT RANK(7500) WITHIN GROUP (ORDER BY salary DESC) AS hypo_rank
FROM emp_sales
WHERE dept_id = 10;
```
*(Assume department `10` has 4 employees with salaries: `9000`, `7000`, `7000`, `5000`.)*

* A. It returns `2` (the hypothetical rank that a row with a salary of `7500` would receive if inserted into department `10`).
* B. It returns `7500`.
* C. It fails because the salary `7500` does not exist in the `EMP_SALES` table.
* D. It fails because `RANK` can only be used with `OVER`, never with `WITHIN GROUP`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** `RANK(constant_expr) WITHIN GROUP (ORDER BY col)` is the **Hypothetical-Set Aggregate** form of `RANK`. It answers: *"If a hypothetical row with `salary = 7500` were inserted into the group (`9000, 7000, 7000, 5000`), what rank would it have in descending order?"* Since `9000` is rank 1, `7500` would sit immediately after `9000` at **rank `2`**.
  * **B, C, D are incorrect:** Notice the two distinct forms:
    * Analytic form: `RANK() OVER (ORDER BY salary DESC)` — takes **no argument**.
    * Aggregate form: `RANK(7500) WITHIN GROUP (ORDER BY salary DESC)` — takes **an argument** and uses `WITHIN GROUP`.
</details>

---

### Question 25
**When a query contains multiple analytic functions with different `PARTITION BY` and `ORDER BY` clauses inside their `OVER(...)` specifications, and the query itself does NOT have a final query-level `ORDER BY` clause, in what order are the final output rows guaranteed to be returned?**

```sql
SELECT emp_id,
       ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn_sal,
       ROW_NUMBER() OVER (PARTITION BY job_id  ORDER BY hire_date ASC) AS rn_hire
FROM employees;
```

* A. Always ordered by the first analytic function's `ORDER BY` clause (`dept_id, salary DESC`).
* B. Always ordered by the last analytic function's `ORDER BY` clause (`job_id, hire_date ASC`).
* C. No specific row order is guaranteed! An `ORDER BY` clause inside `OVER(...)` only orders rows within the partition to compute that specific window function; guaranteeing final display order requires an explicit `ORDER BY` clause at the end of the `SELECT` statement.
* D. Always ordered by the `PRIMARY KEY` of the `EMPLOYEES` table.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** An `ORDER BY` clause inside `OVER(...)` only defines the ordering of rows inside the window partition for evaluating that specific analytic function. Without a query-level **`ORDER BY` clause at the end of the outer `SELECT` statement**, the final display order of rows returned to the client is **not guaranteed**.
  * **A, B, D are incorrect:** Only a top-level `ORDER BY` guarantees result set presentation order in SQL.
</details>

---
