# Review Questions - Chapter 4: Filtering Data and Three-Valued Logic

> **Reference:** *OCA/OCP Oracle Database SQL Study Guide (Exam 1Z0-071)*.  
> **Total Questions:** 25 multiple-choice questions matching the Oracle SQL certification exam format with detailed explanations.  
> **How to study:** Read each question and select your answer first, then click **"👉 View Answer & Detailed Explanation"** to verify your choice and master the exam traps.

---

### Question 1
**Which of the following "Not Equal" comparison operators is INVALID in Oracle SQL?**

* A. `<>`
* B. `!=`
* C. `^=`
* D. `! =` (with a space between the exclamation mark and the equals sign)

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct (Invalid):** In Oracle SQL, two-character relational operators (`!=`, `<>`, `^=`, `>=`, `<=`) must be written without any whitespace between the two symbols. Writing `! =` raises `ORA-00920: invalid relational operator`.
  * **A, B, C are incorrect (All valid):** Oracle supports all three "Not Equal" operators: `<>` (ANSI standard), `!=`, and `^=`.
</details>

---

### Question 2
**Suppose the `EMPLOYEES` table has 107 rows, where 72 rows have `COMMISSION_PCT` as `NULL` and 35 rows have non-null numbers. What is the result when you execute the following query?**

```sql
SELECT employee_id, last_name, commission_pct
FROM employees
WHERE commission_pct = NULL;
```

* A. It returns the `72` rows where `commission_pct` is `NULL`.
* B. It returns `0` rows (no rows selected) and does NOT raise an error.
* C. It fails with a syntax error because the `=` operator cannot precede the `NULL` keyword.
* D. It returns all `107` rows in the table.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct (`0` rows and no error):**
    1. Syntactically, `commission_pct = NULL` (or `commission_pct <> NULL`) is **valid** and does not raise a syntax error.
    2. However, under SQL Three-Valued Logic, any equality `=` or inequality `<>` comparison with `NULL` always evaluates to **`UNKNOWN`**.
    3. Because the `WHERE` clause only returns rows where the condition evaluates to `TRUE`, all 107 rows are filtered out and **0 rows** are returned. To find `NULL` values, you must use `WHERE commission_pct IS NULL`.
  * **A, C, D are incorrect:** Expecting either 72 rows or a syntax error is a very common exam trap.
</details>

---

### Question 3
**Under SQL Three-Valued Logic, what are the results of the three boolean expressions `(TRUE OR UNKNOWN)`, `(FALSE AND UNKNOWN)`, and `(NOT UNKNOWN)`, respectively?**

* A. `TRUE`, `FALSE`, `UNKNOWN`
* B. `UNKNOWN`, `UNKNOWN`, `TRUE`
* C. `TRUE`, `UNKNOWN`, `FALSE`
* D. `UNKNOWN`, `FALSE`, `UNKNOWN`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct (`TRUE`, `FALSE`, `UNKNOWN`):**
    1. **`TRUE OR UNKNOWN` = `TRUE`:** In an `OR` disjunction, if one operand is `TRUE`, the entire expression is guaranteed to be `TRUE` regardless of the other operand.
    2. **`FALSE AND UNKNOWN` = `FALSE`:** In an `AND` conjunction, if one operand is `FALSE`, the entire expression is guaranteed to be `FALSE` regardless of the other operand.
    3. **`NOT UNKNOWN` = `UNKNOWN`:** The negation of an unknown value remains **`UNKNOWN`**!
  * **B, C, D are incorrect:** Memorize these three rules of Three-Valued Logic to solve any `NULL` filtering question.
</details>

---

### Question 4
**In the `EMPLOYEES` table, employee `Grant` has `department_id = NULL` and `salary = 7000`. Which of the following queries will return the row for `Grant`?**

* A. `SELECT last_name FROM employees WHERE department_id = 80 AND salary = 7000;`
* B. `SELECT last_name FROM employees WHERE department_id <> 80 AND salary = 7000;`
* C. `SELECT last_name FROM employees WHERE department_id = 80 OR salary = 7000;`
* D. `SELECT last_name FROM employees WHERE NOT (department_id = 80);`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** For `Grant` (`department_id = NULL`, `salary = 7000`):
    * `department_id = 80` (`NULL = 80`) evaluates to **`UNKNOWN`**.
    * `salary = 7000` (`7000 = 7000`) evaluates to **`TRUE`**.
    * Combined with `OR`: `UNKNOWN OR TRUE` $\rightarrow$ **`TRUE`**! Thus `Grant` is returned.
  * **A and B are incorrect:** Both evaluate to `UNKNOWN AND TRUE` $\rightarrow$ **`UNKNOWN`** (filtered out).
  * **D is incorrect:** Evaluates to `NOT (UNKNOWN)` $\rightarrow$ **`UNKNOWN`** (filtered out).
</details>

---

### Question 5
**Suppose the `DEPARTMENTS` table has 4 rows with `DEPARTMENT_ID` values `10`, `20`, `30`, and `40`. How many rows will the following query return?**

```sql
SELECT department_id
FROM departments
WHERE department_id IN (10, 20, NULL);
```

* A. `0` rows (because the `IN` list contains `NULL`)
* B. `2` rows (`10` and `20`)
* C. `3` rows (`10`, `20`, and `NULL`)
* D. A syntax error occurs because `NULL` cannot appear directly inside an `IN` list.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct (`2` rows: `10` and `20`):**
    * The `IN` operator expands into a series of **`OR`** conditions:
      `WHERE department_id = 10 OR department_id = 20 OR department_id = NULL`
    * For `10`: `TRUE OR FALSE OR UNKNOWN` $\rightarrow$ **`TRUE`** (Selected!).
    * For `20`: `FALSE OR TRUE OR UNKNOWN` $\rightarrow$ **`TRUE`** (Selected!).
    * For `30` and `40`: `FALSE OR FALSE OR UNKNOWN` $\rightarrow$ **`UNKNOWN`** (Filtered out!).
    * Thus, the query returns the **2 matching rows (`10` and `20`)**.
  * **A, C, D are incorrect:** Do not confuse `IN (..., NULL)` (which still returns matching non-null values) with `NOT IN (..., NULL)` (which returns 0 rows).
</details>

---

### Question 6
**Using the same `DEPARTMENTS` table with 4 rows (`DEPARTMENT_ID` values `10`, `20`, `30`, `40`), how many rows will the following `NOT IN` query return?**

```sql
SELECT department_id
FROM departments
WHERE department_id NOT IN (10, 20, NULL);
```

* A. `2` rows (`30` and `40`)
* B. `4` rows (`10`, `20`, `30`, `40`)
* C. `0` rows (no rows selected)
* D. Fails with `ORA-00932` at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct (`0` rows):** This is the most famous exam trap in Oracle SQL (Exam 1Z0-071):
    * The `NOT IN` operator expands into a series of **`AND`** conditions:
      `WHERE department_id <> 10 AND department_id <> 20 AND department_id <> NULL`
    * Consider row `30` (or `40`):
      * `30 <> 10` $\rightarrow$ `TRUE`
      * `30 <> 20` $\rightarrow$ `TRUE`
      * `30 <> NULL` $\rightarrow$ **`UNKNOWN`**
      * Combined with `AND`: `TRUE AND TRUE AND UNKNOWN` = **`UNKNOWN`**!
    * Because no row evaluates to `TRUE`, every row is rejected and the query returns **0 rows**!
  * **A, B, D are incorrect:** Golden rule: **Whenever a `NOT IN` list or subquery contains `NULL`, the condition NEVER returns `TRUE` and the query returns 0 rows!**
</details>

---

### Question 7
**The filter condition `WHERE salary BETWEEN 4000 AND 8000` is completely equivalent to which of the following conditions?**

* A. `WHERE salary > 4000 AND salary < 8000`
* B. `WHERE salary >= 4000 AND salary <= 8000`
* C. `WHERE salary >= 4000 OR salary <= 8000`
* D. `WHERE salary > 4000 OR salary < 8000`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The `BETWEEN low_value AND high_value` operator is always **inclusive of both endpoints**, making it equivalent to `col >= low_value AND col <= high_value`. Both `4000` and `8000` are included.
  * **A is incorrect:** Excludes the boundary values `4000` and `8000`.
  * **C and D are incorrect:** Using `OR` matches every number.
</details>

---

### Question 8
**What happens when a developer writes the higher bound before the lower bound in a `BETWEEN` condition as shown below?**

```sql
SELECT employee_id, last_name, salary
FROM employees
WHERE salary BETWEEN 10000 AND 5000;
```

* A. Oracle automatically swaps the bounds to `BETWEEN 5000 AND 10000` and returns employees earning between 5000 and 10000.
* B. A syntax error occurs because the first value in `BETWEEN` is greater than the second value.
* C. The query executes without error and returns `0` rows.
* D. It returns employees whose salary is outside the 5000 to 10000 range (equivalent to `NOT BETWEEN`).

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct (`0` rows and no error):** Oracle translates `salary BETWEEN A AND B` literally into `salary >= A AND salary <= B`. Thus `salary BETWEEN 10000 AND 5000` becomes:
    `WHERE salary >= 10000 AND salary <= 5000`.
    The query is syntactically valid, but since no number can be simultaneously $\ge 10000$ and $\le 5000$, it returns **0 rows**.
  * **A, B, D are incorrect:** Oracle never automatically reorders the bounds of `BETWEEN`.
</details>

---

### Question 9
**The condition `WHERE NOT (salary BETWEEN 3000 AND 6000)` is equivalent to which of the following expressions?**

* A. `WHERE salary < 3000 AND salary > 6000`
* B. `WHERE salary <= 3000 OR salary >= 6000`
* C. `WHERE salary < 3000 OR salary > 6000`
* D. `WHERE salary <= 3000 AND salary >= 6000`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** By De Morgan's laws:
    * `NOT (salary >= 3000 AND salary <= 6000)`
    * $\equiv$ `NOT (salary >= 3000) OR NOT (salary <= 6000)`
    * $\equiv$ **`salary < 3000 OR salary > 6000`**.
  * **A, D are incorrect:** Using `AND` makes the condition impossible to satisfy.
  * **B is incorrect:** Since `3000` and `6000` are included in `BETWEEN`, they are excluded from `NOT BETWEEN`.
</details>

---

### Question 10
**You want to find all employees whose `FIRST_NAME` has `'a'` (lowercase) as the second character AND has a total length of at least 3 characters. Which `LIKE` condition meets this requirement?**

* A. `WHERE first_name LIKE '_a%'`
* B. `WHERE first_name LIKE '_a_%'`
* C. `WHERE first_name LIKE '%a_'`
* D. `WHERE first_name LIKE '__a%'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct (`LIKE '_a_%'`):** Counting the minimum required characters:
    * First `_`: Requires **1 character** at position 1.
    * `'a'`: Requires `'a'` at position 2.
    * Second `_`: Requires **at least 1 character** at position 3.
    * `%`: Matches 0 or more trailing characters.
    $\rightarrow$ Minimum length is `1 + 1 + 1 + 0 = 3` characters, with `'a'` as the 2nd character!
  * **A is incorrect:** `'_a%'` also matches 2-character names (such as `'Ma'`) because `%` can match 0 characters.
  * **C is incorrect:** `'%a_'` matches `'a'` as the second-to-last character.
  * **D is incorrect:** `'__a%'` matches `'a'` as the third character.
</details>

---

### Question 11
**Suppose the `CUSTOMERS` table has 100 rows, where 15 rows have `ADDRESS` as `NULL` and 85 rows have non-null addresses. How many rows will the following query return?**

```sql
SELECT customer_id, address
FROM customers
WHERE address LIKE '%';
```

* A. `100` rows (all rows including `NULL`)
* B. `85` rows (only non-null rows)
* C. `15` rows (only `NULL` rows)
* D. `0` rows

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct (`85` rows):** Even though `%` matches 0 or more characters, `LIKE` is still a comparison operator. When `address` is **`NULL`**, `NULL LIKE '%'` evaluates to **`UNKNOWN`** (not `TRUE`), so all 15 `NULL` rows are excluded and only the **85 non-null rows** are returned.
  * **A, C, D are incorrect:** `LIKE '%'` never matches `NULL`.
</details>

---

### Question 12
**You need to find all `JOB_ID` values in the `JOBS` table that contain the literal substring `'_M'` (an underscore followed by an uppercase M, such as `'SA_MAN'` or `'AC_MGR'`). Which query accomplishes this accurately?**

* A. `SELECT job_id FROM jobs WHERE job_id LIKE '%_M%';`
* B. `SELECT job_id FROM jobs WHERE job_id LIKE '%\_M%';`
* C. `SELECT job_id FROM jobs WHERE job_id LIKE '%\_M%' ESCAPE '\';`
* D. `SELECT job_id FROM jobs WHERE job_id LIKE '%$_M%' ESCAPE '$_';`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** To treat `_` as a literal underscore rather than a single-character wildcard, you must place an escape character (such as `\`) immediately before `_` AND **explicitly specify the `ESCAPE '\'` clause**.
  * **A is incorrect:** Without `ESCAPE`, `_` acts as a wildcard matching any single character before `'M'` (e.g., `'ADMIN'`).
  * **B is incorrect:** Oracle SQL has **no default escape character** for `LIKE`. Without `ESCAPE '\'`, Oracle looks for a literal backslash `\` in the string.
  * **D is incorrect:** The escape string in `ESCAPE 'c'` must be **exactly 1 character long** (`ESCAPE '$_'` raises `ORA-01425: escape character must be character string of length 1`).
</details>

---

### Question 13
**Examine the following query that uses the `ESCAPE` clause:**

```sql
SELECT promo_name
FROM promotions
WHERE promo_name LIKE '%##%%' ESCAPE '#';
```

**What pattern does `'%##%%' ESCAPE '#'` actually search for in `promo_name`?**

* A. Any `promo_name` containing a literal `%` character anywhere in the string.
* B. Any `promo_name` containing two consecutive `##` characters anywhere in the string.
* C. Any `promo_name` containing a single literal `#` character anywhere in the string (a `%` character is not required).
* D. An error occurs because two `##` characters cannot appear consecutively when `#` is the `ESCAPE` character.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Let's parse `'%##%%'` character by character with `'#'` as the escape character:
    1. First `%`: Wildcard (0 or more characters).
    2. Middle `##`: The first `#` escapes the second `#`, turning it into **a single literal `#` character**!
    3. Last `%%`: Because the second `#` was already consumed as a literal character, both trailing `%` symbols act as wildcards!
    $\rightarrow$ Therefore, `'%##%%' ESCAPE '#'` searches for strings containing a **literal `'#'`**, not `'%'`! (To search for literal `'#%'`, you would write `'%###%%' ESCAPE '#'`; to search for literal `'%'`, you would write `'%#%%' ESCAPE '#'`).
  * **A, B, D are incorrect:** An escape character can escape itself (`##` $\rightarrow$ literal `#`).
</details>

---

### Question 14
**Which sequence shows the CORRECT Operator Precedence from HIGHEST precedence to LOWEST precedence in Oracle SQL?**

* A. Arithmetic operators (`*`, `/`, `+`, `-`) $\rightarrow$ Comparison operators (`=`, `>`, `<`) $\rightarrow$ `AND` $\rightarrow$ `OR` $\rightarrow$ `NOT`
* B. Arithmetic operators (`*`, `/`, `+`, `-`) $\rightarrow$ Comparison operators (`=`, `>`, `<`) $\rightarrow$ `NOT` $\rightarrow$ `AND` $\rightarrow$ `OR`
* C. Comparison operators (`=`, `>`, `<`) $\rightarrow$ Arithmetic operators (`*`, `/`, `+`, `-`) $\rightarrow$ `NOT` $\rightarrow$ `OR` $\rightarrow$ `AND`
* D. `NOT` $\rightarrow$ `AND` $\rightarrow$ `OR` $\rightarrow$ Comparison operators (`=`, `>`, `<`) $\rightarrow$ Arithmetic operators (`*`, `/`, `+`, `-`)

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Without parentheses `()`, Oracle evaluates operators from highest to lowest precedence in this order:
    1. **Arithmetic operators** (`*`, `/` before `+`, `-`).
    2. **Comparison operators** (`=`, `<>`, `<`, `>`, `IN`, `BETWEEN`, `LIKE`, `IS NULL`).
    3. **`NOT`** (logical negation).
    4. **`AND`** (logical conjunction).
    5. **`OR`** (logical disjunction — lowest precedence).
  * **A, C, D are incorrect:** Always remember the logical precedence order: **`NOT` $\rightarrow$ `AND` $\rightarrow$ `OR`**.
</details>

---

### Question 15
**Examine the following query written without parentheses:**

```sql
SELECT employee_id, job_id, salary
FROM employees
WHERE job_id = 'IT_PROG' OR job_id = 'FI_ACCOUNT' AND salary > 8000;
```

**Which of the following employees will be RETURNED by this query? (Choose all that apply.)**

* A. An employee with `job_id = 'IT_PROG'` and `salary = 4200`.
* B. An employee with `job_id = 'FI_ACCOUNT'` and `salary = 6500`.
* C. An employee with `job_id = 'FI_ACCOUNT'` and `salary = 9000`.
* D. An employee with `job_id = 'SA_REP'` and `salary = 12000`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, C**
* **Detailed Explanation:**
  * **A and C are correct:**
    * Because **`AND` has higher precedence than `OR`**, Oracle evaluates the `AND` expression first, equivalent to:
      `WHERE (job_id = 'IT_PROG') OR (job_id = 'FI_ACCOUNT' AND salary > 8000)`
    * **Option A (`job_id = 'IT_PROG'`, `salary = 4200`):** Satisfies the left side of `OR` (`job_id = 'IT_PROG'`), regardless of salary $\rightarrow$ **Returned!**
    * **Option C (`job_id = 'FI_ACCOUNT'`, `salary = 9000`):** Satisfies the right side of `OR` (`'FI_ACCOUNT'` and `9000 > 8000`) $\rightarrow$ **Returned!**
  * **B is incorrect:** Has `job_id = 'FI_ACCOUNT'` but `salary = 6500 <= 8000`, so both sides of `OR` are `FALSE`.
  * **D is incorrect:** `job_id = 'SA_REP'` makes both sides of `OR` `FALSE`.
</details>

---

### Question 16
**Suppose the `PRODUCTS` table contains the following 3 rows:**

| PROD_ID | CATEGORY | PRICE |
| :---: | :--- | :---: |
| 1 | A | 100 |
| 2 | B | 200 |
| 3 | C | 300 |

**When the following query is executed, which `PROD_ID` values are returned?**

```sql
SELECT prod_id
FROM products
WHERE NOT category = 'A' AND price = 200 OR price = 300;
```

* A. Only `2`
* B. `2` and `3`
* C. `1`, `2`, and `3`
* D. Only `3`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct (`2` and `3`):** Applying operator precedence (`NOT` $\rightarrow$ `AND` $\rightarrow$ `OR`), the condition is grouped as:
    `WHERE ((NOT (category = 'A')) AND (price = 200)) OR (price = 300)`
    * **Row 1 (`A`, `100`):** `((NOT TRUE) AND FALSE) OR FALSE` = `FALSE` (Excluded).
    * **Row 2 (`B`, `200`):** `((NOT FALSE) AND TRUE) OR FALSE` = `(TRUE AND TRUE) OR FALSE` = **`TRUE`** (Selected!).
    * **Row 3 (`C`, `300`):** The right operand of `OR` (`price = 300`) is `TRUE`, so the entire `OR` expression is **`TRUE`** (Selected!).
  * **A, C, D are incorrect:** Always parenthesize according to `NOT` first, `AND` second, `OR` last.
</details>

---

### Question 17
**When using `BETWEEN ... AND ...` with character strings such as `WHERE last_name BETWEEN 'A' AND 'C'`, which of the following names will be SELECTED?**

* A. `'Adams'` and `'Clark'`
* B. `'Adams'`, `'Bell'`, and `'C'` (but NOT `'Clark'`)
* C. Only single-character names `'A'`, `'B'`, and `'C'`
* D. An error occurs because `BETWEEN` only works with `NUMBER` and `DATE`, not `VARCHAR2`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `last_name BETWEEN 'A' AND 'C'` is equivalent to `last_name >= 'A' AND last_name <= 'C'` in ASCII/dictionary order:
    * `'Adams'` is $\ge$ `'A'` and $\le$ `'C'` $\rightarrow$ **Matches!**
    * `'Bell'` is $\ge$ `'A'` and $\le$ `'C'` $\rightarrow$ **Matches!**
    * `'C'` is $\ge$ `'A'` and $\le$ `'C'` $\rightarrow$ **Matches!**
    * **Why does `'Clark'` NOT match?** When comparing `'Clark'` to `'C'`, the first character `'C'` is equal, but `'Clark'` has additional characters (`'lark'`), making **`'Clark' > 'C'`**! Thus `'Clark'` exceeds the upper bound `'C'` and is excluded.
  * **A, C, D are incorrect:** Keep this string upper-bound behavior in mind whenever using `BETWEEN` on `VARCHAR2` columns.
</details>

---

### Question 18
**The `ORDER_DATE` column in the `ORDERS` table is of type `DATE` and stores time components as well (for example, an order placed at `15-MAY-2026 14:30:00`). What happens to that `15-MAY-2026 14:30:00` order when you execute the following query?**

```sql
SELECT order_id, order_date
FROM orders
WHERE order_date BETWEEN TO_DATE('01-MAY-2026', 'DD-MON-YYYY')
                     AND TO_DATE('15-MAY-2026', 'DD-MON-YYYY');
```

* A. The order is returned normally because its date is `15-MAY-2026`.
* B. The order is MISSED (not returned) because `TO_DATE('15-MAY-2026', 'DD-MON-YYYY')` defaults its time component to `00:00:00` (midnight at the start of the day), and `14:30:00` is greater than `00:00:00`!
* C. The query fails with an error because `BETWEEN` does not accept `TO_DATE` calls.
* D. All orders placed on `01-MAY-2026` are also missed.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** When `TO_DATE('15-MAY-2026', 'DD-MON-YYYY')` is called without a time component, Oracle defaults the time to **`00:00:00`** (midnight at the very beginning of May 15).
  * Consequently, `<= 15-MAY-2026 00:00:00` **excludes every order placed between `00:00:01` and `23:59:59` on May 15, 2026** (including the order at `14:30:00`)!
  * To include the entire day of May 15, write: `WHERE order_date >= DATE '2026-05-01' AND order_date < DATE '2026-05-16'`.
  * **A, C, D are incorrect:** This is one of the most common real-world date filtering bugs in Oracle SQL.
</details>

---

### Question 19
**Which of the following queries is syntactically and logically VALID for finding employees who do NOT have a commission (`COMMISSION_PCT` is `NULL`)?**

* A. `SELECT last_name FROM employees WHERE commission_pct IS NULL;`
* B. `SELECT last_name FROM employees WHERE NOT (commission_pct IS NOT NULL);`
* C. `SELECT last_name FROM employees WHERE commission_pct = NULL;`
* D. Both A and B are correct.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct (Both A and B are correct):**
    * In **A**, `commission_pct IS NULL` evaluates to `TRUE` when the column is `NULL`.
    * In **B**, `IS [NOT] NULL` always returns either `TRUE` or `FALSE` (never `UNKNOWN`). When `commission_pct` is `NULL`, `commission_pct IS NOT NULL` evaluates to `FALSE`, and `NOT (FALSE)` evaluates to **`TRUE`**! Thus both A and B return the exact same rows.
  * **C is incorrect:** `commission_pct = NULL` evaluates to `UNKNOWN` and returns 0 rows.
</details>

---

### Question 20
**Which of the following negated `WHERE` clauses will FAIL with a syntax error in an Oracle Database?**

* A. `WHERE department_id NOT IN (10, 20)`
* B. `WHERE NOT department_id IN (10, 20)`
* C. `WHERE department_id IS NOT NULL`
* D. `WHERE department_id NOT IS NULL`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct (Fails with syntax error):** For null checks, the valid forms are `col IS NOT NULL` or `NOT (col IS NULL)` / `NOT col IS NULL`. Writing `col NOT IS NULL` is invalid syntax and raises `ORA-00908: missing NULL keyword`.
  * **A, B, C are incorrect (All valid):** Both `col NOT IN (...)` and `NOT col IN (...)` are completely valid in Oracle SQL.
</details>

---

### Question 21
**Suppose the `ITEMS` table has a column `ITEM_CODE VARCHAR2(20)` containing 4 rows: `'A_100'`, `'A%100'`, `'AB100'`, and `'A_200'`. Which rows will be returned by the following query?**

```sql
SELECT item_code
FROM items
WHERE item_code LIKE 'A_100';
```

* A. Only `'A_100'`.
* B. `'A_100'` and `'AB100'`.
* C. All 3 rows: `'A_100'`, `'A%100'`, and `'AB100'`.
* D. All 4 rows in the table.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct (`'A_100'`, `'A%100'`, and `'AB100'`):**
    * Because `WHERE item_code LIKE 'A_100'` has **no `ESCAPE` clause**, the `_` at the 2nd character position is a **wildcard** that matches **any single character** (including a literal `'_'`, a literal `'%'`, or `'B'`)!
    * Therefore, `'A_100'`, `'A%100'`, and `'AB100'` all match `'A' + <any 1 char> + '100'`.
  * **A, B, D are incorrect:** Remember that an unescaped `_` wildcard matches literal `_` and `%` characters in data too.
</details>

---

### Question 22
**What happens when you execute the following query?**

```sql
SELECT employee_id, last_name
FROM employees
WHERE last_name = 'King' AND 1 = 0 OR 1 = 1;
```

* A. It returns only employees whose last name is `'King'`.
* B. It returns `0` rows.
* C. It returns ALL rows in the `EMPLOYEES` table.
* D. It fails with a syntax error because constant comparisons like `1 = 0` or `1 = 1` are not allowed in `WHERE`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct (Returns all rows in the table):**
    * Because `AND` has higher precedence than `OR`, Oracle groups the predicate as:
      `WHERE (last_name = 'King' AND 1 = 0) OR (1 = 1)`
    * The left side `(last_name = 'King' AND FALSE)` is always `FALSE`.
    * However, the right side of `OR` is `1 = 1`, which is always **`TRUE`** for every row!
    * Since `FALSE OR TRUE` = **`TRUE`**, every row in `EMPLOYEES` is returned!
  * **A, B, D are incorrect:** Failing to account for `AND` binding tighter than `OR` leads to choosing B or A.
</details>

---

### Question 23
**In Oracle SQL (versions 11g, 12c, 19c, 21c covered by Exam 1Z0-071), what is the maximum number of literal expressions allowed inside a single `IN (v1, v2, ..., vn)` list?**

* A. `255` expressions
* B. `1000` expressions
* C. `4000` expressions
* D. Unlimited expressions

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct (`1000` expressions):** In Oracle Database (11g through 21c), a single `IN (v1, v2, ...)` list can contain at most **1,000 expressions**. Exceeding 1,000 items raises `ORA-01795: maximum number of expressions in a list is 1000`. (Note: A subquery `IN (SELECT ...)` or multi-column tuple list `(1, col) IN ((1, v1), ...)` is not subject to the 1,000-element limit).
  * **A, C, D are incorrect:** The 1,000-item limit (`ORA-01795`) is an essential Oracle SQL limitation to know.
</details>

---

### Question 24
**Examine the following query. Which alternative `WHERE` clause is 100% logically equivalent to the original `WHERE` clause (including its behavior when `department_id` is `NULL`)?**

```sql
SELECT employee_id, last_name, department_id
FROM employees
WHERE department_id <> 10
  AND department_id <> 20
  AND department_id <> 30;
```

* A. `WHERE department_id IN (10, 20, 30)`
* B. `WHERE department_id NOT IN (10, 20, 30)`
* C. `WHERE department_id NOT BETWEEN 10 AND 30`
* D. `WHERE department_id IS NOT NULL`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `department_id NOT IN (10, 20, 30)` is the exact shorthand equivalent of `department_id <> 10 AND department_id <> 20 AND department_id <> 30` (both also evaluate to `UNKNOWN` and exclude rows where `department_id IS NULL`).
  * **A is incorrect:** `IN` expands to `=` joined by `OR`.
  * **C is incorrect:** `NOT BETWEEN 10 AND 30` would also exclude values like `15` or `25`.
  * **D is incorrect:** `IS NOT NULL` still includes departments `10`, `20`, and `30`.
</details>

---

### Question 25
**In the `EMPLOYEES` table, employee `King` has `salary = 24000` and `commission_pct = NULL`. Which of the following `WHERE` clauses will evaluate to `TRUE` for `King`'s row? (Choose all that apply.)**

* A. `WHERE salary > 20000 OR commission_pct > 0.1`
* B. `WHERE salary > 20000 AND commission_pct IS NULL`
* C. `WHERE salary > 20000 AND commission_pct <> 0.1`
* D. `WHERE NOT (commission_pct = 0.1)`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, B**
* **Detailed Explanation:**
  * **A is correct:** `salary > 20000` (`24000 > 20000`) is `TRUE`, and `commission_pct > 0.1` (`NULL > 0.1`) is `UNKNOWN`. With `OR`: `TRUE OR UNKNOWN` $\rightarrow$ **`TRUE`**!
  * **B is correct:** `salary > 20000` is `TRUE`, and `commission_pct IS NULL` is `TRUE`. With `AND`: `TRUE AND TRUE` $\rightarrow$ **`TRUE`**!
  * **C is incorrect:** `commission_pct <> 0.1` (`NULL <> 0.1`) is `UNKNOWN`. With `AND`: `TRUE AND UNKNOWN` $\rightarrow$ **`UNKNOWN`** (Excluded!).
  * **D is incorrect:** `commission_pct = 0.1` (`NULL = 0.1`) is `UNKNOWN`. Negating it with `NOT (UNKNOWN)` $\rightarrow$ **`UNKNOWN`** (Excluded!).
</details>
