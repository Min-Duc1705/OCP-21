# Review Questions - Chapter 5: Single-Row Functions

> **Objective:** Assess your mastery of Chapter 5 (Character, Numeric, Date/Timestamp, NULL-handling functions, `CASE WHEN`, and `DECODE`) aligned with the **Oracle Database SQL (1Z0-071)** certification exam.  
> **Total Questions:** 25 multiple-choice questions with detailed answers and explanations.  
> **How to study:** Analyze each question and choose your answer before clicking **"👉 View Answer & Detailed Explanation"**.

---

### Question 1
**What is the output of the following SQL statement?**

```sql
SELECT INITCAP('ngUYEN_vAn-a#12b c$d') AS result FROM dual;
```

* A. `Nguyen_van-a#12b C$d`
* B. `Nguyen_Van-A#12b C$D`
* C. `Nguyen_Van-A#12B C$D`
* D. `Nguyen_van-a#12B C$d`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `INITCAP` converts the first letter of each word to uppercase and all remaining characters in the word to lowercase. In Oracle SQL, a "word" is a contiguous sequence of alphanumeric characters; any non-alphanumeric character (`_`, `-`, `#`, space, `$`) acts as a word delimiter:
    * `'ngUYEN'` $\rightarrow$ `'Nguyen'`, `'vAn'` $\rightarrow$ `'Van'`, `'a'` $\rightarrow$ `'A'`.
    * After `#` is the word `'12b'`: its first character is the digit `'1'`, so `'b'` is inside the word and becomes lowercase (`'12b'`).
    * `'c'` after space and `'d'` after `$` both start new words $\rightarrow$ `'C$D'`.
  * **A, C, D are incorrect:** They fail to treat `_`, `-`, `$` as word delimiters or mistakenly capitalize `'b'` after `'12'`.
</details>

---

### Question 2
**Which output is produced by executing the following SQL query?**

```sql
SELECT SUBSTR('ORACLE_21C_SQL', 0, 6) AS s1,
       SUBSTR('ORACLE_21C_SQL', -3, 2) AS s2
FROM dual;
```

* A. `S1 = NULL`, `S2 = 'SQ'`
* B. `S1 = 'ORACLE'`, `S2 = 'LS'`
* C. `S1 = 'ORACLE'`, `S2 = 'SQ'`
* D. An error is raised because the starting position in `SUBSTR` cannot be `0`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:**
    * In `SUBSTR(string, position, length)`, a `position` of `0` is treated identically to `1`. Thus `SUBSTR('ORACLE_21C_SQL', 0, 6)` extracts the first 6 characters: `'ORACLE'`.
    * A negative `position` (`-3`) counts 3 characters backward from the end of the string (landing on `'S'` in `'SQL'`), and then extracts 2 characters left-to-right: `'SQ'`.
  * **A, B, D are incorrect:** Position `0` is valid in `SUBSTR`, and extraction direction is always left-to-right.
</details>

---

### Question 3
**Examine the following SQL statement. What value is returned?**

```sql
SELECT INSTR('MISSISSIPPI', 'IS', -2, 2) AS pos FROM dual;
```

* A. `2`
* B. `5`
* C. `6`
* D. `0`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** In `'MISSISSIPPI'` (length 11), `'IS'` occurs at positions `2` and `5`.
    * `position = -2` starts at the 2nd character from the end (position 10, `'P'`) and **scans backward from right to left**.
    * `occurrence = 2` finds the 2nd match while scanning right-to-left: the 1st match encountered is at position `5`, and the 2nd match is at position **`2`**. The returned index is always 1-based from the beginning of the string.
  * **B, C, D are incorrect:** `5` is the first occurrence when scanning backward from position `-2`.
</details>

---

### Question 4
**What is the result of the following query?**

```sql
SELECT LPAD('ORACLE_SQL', 6, '*') || '-' || RPAD('ORACLE_SQL', 6, '*') AS output
FROM dual;
```

* A. `******ORACLE_SQL-ORACLE_SQL******`
* B. `ORACLE-ORACLE`
* C. `ORACLE-C_SQL*`
* D. `*ORACL-ORACLE`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In both `LPAD(str, n, pad)` and `RPAD(str, n, pad)`, the second argument (`6`) specifies the exact total length of the returned string. Because `'ORACLE_SQL'` has 10 characters (`> 6`), both `LPAD` and `RPAD` truncate the original string from the right to 6 characters (`'ORACLE'`), resulting in `'ORACLE-ORACLE'`.
  * **A, C, D are incorrect:** `n` is the target total length, not the number of pad characters to add.
</details>

---

### Question 5
**What happens when you execute the following SQL statement?**

```sql
SELECT TRIM('xy' FROM 'xyxyORACLExy') AS result FROM dual;
```

* A. It returns `'ORACLE'`
* B. It returns `'xyORACLE'`
* C. It fails with `ORA-30001: trim set should have only one character`
* D. It fails with a syntax error because the `BOTH` keyword is missing

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** The ANSI `TRIM` function in Oracle only allows a **single character** in the trim set (`trim_character`). Passing a 2-character string `'xy'` raises `ORA-30001: trim set should have only one character`. To strip multiple characters from both ends, use `LTRIM(RTRIM(..., 'xy'), 'xy')`.
  * **A, B, D are incorrect:** `BOTH` is the default and optional, but `TRIM` cannot accept multi-character trim sets.
</details>

---

### Question 6
**What is the output of the following query using `LTRIM` and `RTRIM`?**

```sql
SELECT LTRIM('1232123ORACLE', '123') || '_' || RTRIM('123ORACLE32143', '123') AS res
FROM dual;
```

* A. `ORACLE_123ORACLE3214`
* B. `2123ORACLE_123ORACLE32143`
* C. `ORACLE_123ORACLE`
* D. `ORACLE_123ORACLE321`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** The second argument of `LTRIM` and `RTRIM` specifies a **set of individual characters** `{'1', '2', '3'}`:
    * `LTRIM('1232123ORACLE', '123')` strips any `'1'`, `'2'`, or `'3'` from the left until it hits `'O'`, returning `'ORACLE'`.
    * `RTRIM('123ORACLE32143', '123')` strips `'3'` at the far right, then encounters `'4'` (which is not in `{'1', '2', '3'}`) and stops immediately, returning `'123ORACLE3214'`.
  * **B, C, D are incorrect:** `RTRIM` cannot skip over `'4'` to remove `'321'` behind it.
</details>

---

### Question 7
**Compare the results of `REPLACE` and `TRANSLATE` in the following query:**

```sql
SELECT REPLACE('123-132-231', '12', 'AB')   AS col_rep,
       TRANSLATE('123-132-231', '123-', 'AB') AS col_trans
FROM dual;
```

* A. `COL_REP = 'AB3-132-231'`, `COL_TRANS = 'AB-A2-B1'`
* B. `COL_REP = 'AB3-132-231'`, `COL_TRANS = 'ABABBA'`
* C. `COL_REP = 'AB3-AB2-BA1'`, `COL_TRANS = 'AB3-A3B-B3A'`
* D. `COL_REP = 'AB3-132-231'`, `COL_TRANS = 'AB3-A3B-B3A'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * `REPLACE` replaces the entire substring `'12'` with `'AB'`. Only the first segment `'123'` contains `'12'` contiguously, yielding `'AB3-132-231'`.
    * `TRANSLATE` performs a **1-to-1 character mapping** from `'123-'` to `'AB'`: `'1'` $\rightarrow$ `'A'`, `'2'` $\rightarrow$ `'B'`, while `'3'` and `'-'` have no corresponding characters in `'AB'` and are **removed completely**, yielding `'ABABBA'`.
  * **A, C, D are incorrect:** Extra characters in `from_string` of `TRANSLATE` are deleted from the source string.
</details>

---

### Question 8
**What is returned by the following SQL statement?**

```sql
SELECT ROUND(154.78, -2) AS r1,
       TRUNC(154.78, -2) AS t1,
       ROUND(149.99, -2) AS r2
FROM dual;
```

* A. `R1 = 200`, `T1 = 100`, `R2 = 100`
* B. `R1 = 200`, `T1 = 100`, `R2 = 200`
* C. `R1 = 150`, `T1 = 150`, `R2 = 150`
* D. `R1 = 0`, `T1 = 0`, `R2 = 0`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** A second argument of `-2` rounds or truncates two places to the **left** of the decimal point (hundreds place, inspecting the tens digit):
    * `ROUND(154.78, -2)`: Tens digit is `5` (`>= 5`) $\rightarrow$ `200`.
    * `TRUNC(154.78, -2)`: Truncates to hundreds $\rightarrow$ `100`.
    * `ROUND(149.99, -2)`: Only the tens digit (`4 < 5`) is inspected (no cascading rounding from `9.99`), so it rounds down to `100`.
  * **B, C, D are incorrect:** Rounding never cascades across digits in `ROUND`.
</details>

---

### Question 9
**What is the output of the following SQL statement?**

```sql
SELECT CEIL(-14.2)  AS c_val,
       FLOOR(-14.2) AS f_val,
       TRUNC(-14.8) AS t_val
FROM dual;
```

* A. `C_VAL = -15`, `F_VAL = -14`, `T_VAL = -14`
* B. `C_VAL = -14`, `F_VAL = -15`, `T_VAL = -14`
* C. `C_VAL = -14`, `F_VAL = -15`, `T_VAL = -15`
* D. `C_VAL = -15`, `F_VAL = -14`, `T_VAL = -15`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * `CEIL(-14.2)` returns the smallest integer greater than or equal to `-14.2`, which is **`-14`**.
    * `FLOOR(-14.2)` returns the largest integer less than or equal to `-14.2`, which is **`-15`**.
    * `TRUNC(-14.8)` strips the fractional part `.8`, leaving **`-14`**.
  * **A, C, D are incorrect:** They confuse negative number ordering for `CEIL`, `FLOOR`, and `TRUNC`.
</details>

---

### Question 10
**What is the result of executing the following SQL query?**

```sql
SELECT MOD(-17, 5) AS m1,
       MOD(17, -5) AS m2,
       MOD(25, 0)  AS m3
FROM dual;
```

* A. It raises `ORA-01476: divisor is equal to zero` due to `MOD(25, 0)`
* B. `M1 = -2`, `M2 = 2`, `M3 = 25`
* C. `M1 = 3`, `M2 = -3`, `M3 = 0`
* D. `M1 = -2`, `M2 = -2`, `M3 = NULL`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * In Oracle SQL, the sign of `MOD(m, n)` always matches the sign of the **dividend `m`**: `MOD(-17, 5) = -2` and `MOD(17, -5) = 2`.
    * Classic exam trap: when the divisor `n` is `0`, `MOD(m, 0)` does **not** raise a divide-by-zero error; it returns `m` (`25`).
  * **A, C, D are incorrect:** `MOD(m, 0)` is specifically designed in Oracle to return `m` rather than raising `ORA-01476`.
</details>

---

### Question 11
**Which statement accurately describes the difference between `SYSDATE` and `CURRENT_DATE` in Oracle Database?**

* A. `SYSDATE` returns a `DATE` value, whereas `CURRENT_DATE` returns a `TIMESTAMP WITH TIME ZONE` value.
* B. `SYSDATE` returns the current date and time in the database server operating system's time zone, whereas `CURRENT_DATE` returns the current date and time in the user session's time zone (`SESSIONTIMEZONE`).
* C. `SYSDATE` stores only the year, month, and day, whereas `CURRENT_DATE` also stores hours, minutes, and seconds.
* D. Both functions require empty parentheses `SYSDATE()` and `CURRENT_DATE()` when called in a `SELECT` list.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Both return a `DATE` data type (including date and time down to seconds), but `SYSDATE` uses the database host OS clock, whereas `CURRENT_DATE` adjusts to the current session's time zone.
  * **A, C, D are incorrect:** `CURRENT_TIMESTAMP` returns `TIMESTAMP WITH TIME ZONE`; both `SYSDATE` and `CURRENT_DATE` include time components and must be called without parentheses `()`.
</details>

---

### Question 12
**Note that 2024 is a leap year (February has 29 days) and 2025 is not a leap year (February has 28 days). Which column in the following query returns `'2024-03-28'`?**

```sql
SELECT ADD_MONTHS(DATE '2024-02-28', 1) AS d1,
       ADD_MONTHS(DATE '2024-02-29', 1) AS d2,
       ADD_MONTHS(DATE '2025-02-28', 1) AS d3
FROM dual;
```

* A. Only `D1` returns March 28 (`2024-03-28`), while both `D2` and `D3` return March 31.
* B. Both `D1` and `D3` return March 28, while `D2` returns March 29.
* C. All three (`D1`, `D2`, `D3`) return March 31 due to the End-of-Month rule of `ADD_MONTHS`.
* D. `D1` returns `2024-03-28`, `D2` returns `2024-03-29`, and `D3` returns `2025-03-28`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** Under the End-of-Month rule of `ADD_MONTHS`, if the input date is the **last day of the month**, the result is the **last day of the target month**:
    * `2024-02-29` (`D2`) and `2025-02-28` (`D3`) are both the last day of February in their respective years, so adding 1 month yields `2024-03-31` and `2025-03-31`.
    * `2024-02-28` (`D1`) is **not** the last day of February 2024 (since 2024 is a leap year), so adding 1 month preserves the 28th day: **`2024-03-28`**.
  * **B, C, D are incorrect:** They overlook how leap years affect the End-of-Month rule in `ADD_MONTHS`.
</details>

---

### Question 13
**What is the result of executing the following SQL query?**

```sql
SELECT ROUND(DATE '2025-02-15', 'MONTH') AS r_month,
       ROUND(DATE '2025-07-01', 'YEAR')  AS r_year,
       TRUNC(DATE '2025-11-29', 'YEAR')  AS t_year
FROM dual;
```

* A. `R_MONTH = 2025-03-01`, `R_YEAR = 2026-01-01`, `T_YEAR = 2025-01-01`
* B. `R_MONTH = 2025-02-01`, `R_YEAR = 2026-01-01`, `T_YEAR = 2025-01-01`
* C. `R_MONTH = 2025-02-01`, `R_YEAR = 2025-01-01`, `T_YEAR = 2025-01-01`
* D. `R_MONTH = 2025-03-01`, `R_YEAR = 2025-01-01`, `T_YEAR = 2025-11-01`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * `ROUND(date, 'MONTH')` always uses the **16th day of the month** as the cutoff (days 1–15 round down to the 1st of the current month; days 16–31 round up to the 1st of the next month), even in February! Thus `2025-02-15` rounds down to **`2025-02-01`**.
    * `ROUND(date, 'YEAR')` uses **July 1 (`01-JUL`)** as the cutoff (Jan–Jun round down; Jul–Dec round up). Thus `2025-07-01` rounds up to **`2026-01-01`**.
    * `TRUNC(date, 'YEAR')` always truncates to January 1 of the current year: **`2025-01-01`**.
  * **A, C, D are incorrect:** `ROUND(..., 'MONTH')` never changes its cutoff from the 16th for 28-day months.
</details>

---

### Question 14
**Which of the following SQL statements will fail with an error in Oracle Database?**

* A. `SELECT EXTRACT(YEAR FROM SYSDATE) FROM dual;`
* B. `SELECT EXTRACT(MONTH FROM CURRENT_DATE) FROM dual;`
* C. `SELECT EXTRACT(SECOND FROM SYSTIMESTAMP) FROM dual;`
* D. `SELECT EXTRACT(HOUR FROM SYSDATE) FROM dual;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct (raises an error):** From an Oracle `DATE` source (`SYSDATE`), `EXTRACT` can **only** extract `YEAR`, `MONTH`, or `DAY`. Attempting to extract `HOUR`, `MINUTE`, or `SECOND` from a `DATE` raises `ORA-30076: invalid extract field for extract source`. You must use a `TIMESTAMP` source (such as `SYSTIMESTAMP` or `CAST(SYSDATE AS TIMESTAMP)`).
  * **A, B, C are incorrect:** All three are valid and execute without error.
</details>

---

### Question 15
**In the `EMPLOYEES` table, the `COMMISSION_PCT` column is of data type `NUMBER(2,2)`. What happens when you execute the following query?**

```sql
SELECT emp_id, NVL(commission_pct, 'Not Applicable') AS comm_status
FROM employees;
```

* A. Numeric values of `commission_pct` are displayed, and `NULL` rows display `'Not Applicable'`.
* B. Oracle implicitly converts the entire `comm_status` column to `VARCHAR2` and succeeds.
* C. It fails with `ORA-01722: invalid number`.
* D. It returns `NULL` for rows where data type conversion fails.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** In `NVL(expr1, expr2)`, the return data type is determined by `expr1` (`NUMBER`). Oracle attempts to implicitly convert `expr2` (`'Not Applicable'`) into a `NUMBER`, which fails with `ORA-01722: invalid number`. You must explicitly convert `expr1` first: `NVL(TO_CHAR(commission_pct), 'Not Applicable')`.
  * **A, B, D are incorrect:** `NVL` never converts `expr1` from `NUMBER` to `VARCHAR2` to match `expr2`.
</details>

---

### Question 16
**What is the output of the following query using `NVL2` and `NULLIF`?**

```sql
SELECT NVL2(NULL, 'A', 'B')     AS col1,
       NVL2('X', 100, 200)      AS col2,
       NULLIF(50, 50)           AS col3,
       NULLIF(50, 100)          AS col4
FROM dual;
```

* A. `COL1 = 'A'`, `COL2 = 100`, `COL3 = NULL`, `COL4 = 50`
* B. `COL1 = 'B'`, `COL2 = 100`, `COL3 = NULL`, `COL4 = 50`
* C. `COL1 = 'B'`, `COL2 = 200`, `COL3 = 50`, `COL4 = NULL`
* D. `COL1 = 'B'`, `COL2 = 100`, `COL3 = NULL`, `COL4 = 100`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * `NVL2(expr1, expr2, expr3)` returns `expr2` if `expr1` is **not null**, and `expr3` if `expr1` **is null**. Thus `NVL2(NULL, 'A', 'B')` returns `'B'`, and `NVL2('X', 100, 200)` returns `100`.
    * `NULLIF(expr1, expr2)` returns `NULL` if `expr1 = expr2`, and returns **`expr1`** otherwise. Thus `NULLIF(50, 50)` is `NULL` and `NULLIF(50, 100)` is `50`.
  * **A, C, D are incorrect:** They reverse the arguments of `NVL2` or `NULLIF`.
</details>

---

### Question 17
**Examine the following two SQL statements. Which statement accurately describes their execution?**

```sql
-- Statement 1:
SELECT NVL(100, 1/0) FROM dual;

-- Statement 2:
SELECT COALESCE(100, 1/0) FROM dual;
```

* A. Both statements return `100` because the first argument is not null.
* B. Both statements fail with `ORA-01476: divisor is equal to zero`.
* C. Statement 1 fails with `ORA-01476: divisor is equal to zero`, whereas Statement 2 succeeds and returns `100`.
* D. Statement 1 returns `100`, whereas Statement 2 fails with `ORA-01476`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:**
    * `NVL(expr1, expr2)` evaluates **both arguments** before executing the function, so `1/0` is evaluated and raises `ORA-01476: divisor is equal to zero`.
    * `COALESCE(expr1, expr2, ...)` uses **short-circuit evaluation** from left to right. Since the first argument (`100`) is not null, `COALESCE` returns `100` immediately without evaluating `1/0`.
  * **A, B, D are incorrect:** They miss the short-circuit evaluation difference between `COALESCE` and `NVL`.
</details>

---

### Question 18
**Which of the following SQL statements using `COALESCE` or `NULLIF` is VALID and executes without error?**

* A. `SELECT NULLIF(NULL, 100) FROM dual;`
* B. `SELECT COALESCE(NULL, 100, 'None') FROM dual;`
* C. `SELECT COALESCE(NULL, TO_CHAR(100), 'None') FROM dual;`
* D. `SELECT NULLIF(100, '100') FROM dual;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** All non-null arguments in `COALESCE(NULL, TO_CHAR(100), 'None')` have the same data type (`VARCHAR2`), so it succeeds and returns `'100'`.
  * **A is incorrect:** The first argument of `NULLIF` cannot be a literal `NULL` (`ORA-00932`).
  * **B and D are incorrect:** Neither `COALESCE` nor `NULLIF` allows mixing `NUMBER` and `VARCHAR2` arguments (`ORA-00932: inconsistent datatypes`).
</details>

---

### Question 19
**What is the output of the following query comparing `CASE` and `DECODE` with `NULL`?**

```sql
SELECT CASE NULL
           WHEN NULL THEN 'Match'
           ELSE 'No Match'
       END AS c_res,
       DECODE(NULL, NULL, 'Match', 'No Match') AS d_res
FROM dual;
```

* A. `C_RES = 'Match'`, `D_RES = 'Match'`
* B. `C_RES = 'No Match'`, `D_RES = 'No Match'`
* C. `C_RES = 'No Match'`, `D_RES = 'Match'`
* D. `C_RES = 'Match'`, `D_RES = 'No Match'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:**
    * A **Simple `CASE`** expression uses standard SQL equality (`NULL = NULL`), which evaluates to `UNKNOWN` (not `TRUE`), so it falls through to `ELSE 'No Match'`.
    * **`DECODE`** is a notable exception in Oracle SQL: it treats two `NULL` values as **equal**, so `DECODE(NULL, NULL, 'Match', 'No Match')` returns `'Match'`.
  * **A, B, D are incorrect:** They fail to distinguish how Simple `CASE` and `DECODE` evaluate `NULL`.
</details>

---

### Question 20
**What happens when you execute the following SQL query?**

```sql
SELECT CASE 10
           WHEN 5  THEN 'Five'
           WHEN 10 THEN 100
           ELSE 'Other'
       END AS result
FROM dual;
```

* A. It returns the number `100`
* B. It returns the string `'100'`
* C. It fails with `ORA-00932: inconsistent datatypes: expected CHAR got NUMBER`
* D. It returns `NULL`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** All result expressions (`THEN ...` and `ELSE ...`) in a `CASE` expression must be of the **same data type**. Mixing `'Five'` (`CHAR`/`VARCHAR2`) and `100` (`NUMBER`) raises `ORA-00932: inconsistent datatypes`.
  * **A, B, D are incorrect:** `CASE` does not implicitly convert return branches to a common data type.
</details>

---

### Question 21
**What value is returned for `GRADE` by the following SQL query?**

```sql
SELECT CASE
           WHEN salary > 3000 THEN 'Level 1'
           WHEN salary > 5000 THEN 'Level 2'
           WHEN salary > 7000 THEN 'Level 3'
           ELSE 'Level 0'
       END AS grade
FROM (SELECT 8000 AS salary FROM dual);
```

* A. `'Level 1'`
* B. `'Level 3'`
* C. `'Level 0'`
* D. An error is raised because `salary = 8000` satisfies multiple `WHEN` conditions

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** A `CASE` expression evaluates its `WHEN` clauses **top-to-bottom** and stops at the **first `WHEN` condition that evaluates to `TRUE`**. Since `8000 > 3000` is `TRUE` in the very first branch, `'Level 1'` is returned immediately.
  * **B, C, D are incorrect:** Later `WHEN` branches are never evaluated once an earlier branch matches.
</details>

---

### Question 22
**Assume `DATE '2025-10-10'` is a Friday. What are the results of `NEXT_DAY(DATE '2025-10-10', 'FRIDAY')` and `LAST_DAY(DATE '2025-10-10')`, respectively?**

* A. `2025-10-10` and `2025-10-31`
* B. `2025-10-17` and `2025-10-31`
* C. `2025-10-17` and `2025-10-30`
* D. `2025-10-10` and `2025-10-30`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * `NEXT_DAY(date, day)` always returns the next occurrence of the specified weekday **strictly after** `date` (7 days later if `date` falls on that weekday), giving `2025-10-17`.
    * `LAST_DAY(DATE '2025-10-10')` returns the last day of October, which is `2025-10-31`.
  * **A, C, D are incorrect:** `NEXT_DAY` never returns the input date itself.
</details>

---

### Question 23
**What is the output of the following nested single-row function query?**

```sql
SELECT SUBSTR(REPLACE(TRIM('   oracle_db_21c   '), '_', ''), -5, 3) AS res
FROM dual;
```

* A. `'db2'`
* B. `'b21'`
* C. `'21c'`
* D. `'le_d'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** Evaluating from the innermost function outward:
    1. `TRIM('   oracle_db_21c   ')` $\rightarrow$ `'oracle_db_21c'`.
    2. `REPLACE('oracle_db_21c', '_', '')` removes all underscores $\rightarrow$ `'oracledb21c'` (11 characters).
    3. `SUBSTR('oracledb21c', -5, 3)` starts at the 5th character from the end (`'d'`) and takes 3 characters to the right $\rightarrow$ **`'db2'`**.
  * **B, C, D are incorrect:** They miscount `-5` or forget that `_` was removed by `REPLACE`.
</details>

---

### Question 24
**What are the values returned by `MONTHS_BETWEEN(DATE '2025-03-31', DATE '2025-02-28')` and `MONTHS_BETWEEN(DATE '2025-02-01', DATE '2025-03-01')`, respectively?**

* A. `1.09677` and `-1`
* B. `1` and `-1`
* C. `1` and `1`
* D. `0.90322` and `-1`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * When both dates in `MONTHS_BETWEEN(d1, d2)` are the **last day of their respective months** (`2025-03-31` and `2025-02-28`), Oracle returns an exact integer difference: **`1`**.
    * When `d1 < d2` with the same day of the month (`2025-02-01` and `2025-03-01`), `MONTHS_BETWEEN` returns **`-1`**.
  * **A, C, D are incorrect:** They miss the End-of-Month integer rule or the negative sign when `d1 < d2`.
</details>

---

### Question 25
**What is the output of the following query combining `SIGN` and `DECODE`?**

```sql
SELECT DECODE(SIGN(50 - 80),
              1,  'Positive',
              -1, 'Negative',
              0,  'Zero') AS status
FROM dual;
```

* A. `'Positive'`
* B. `'Negative'`
* C. `'Zero'`
* D. An error is raised because `DECODE` cannot evaluate inequality ranges

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `50 - 80 = -30`, and `SIGN(-30)` returns `-1`. `DECODE` matches `-1` and returns `'Negative'`. Combining `SIGN` with `DECODE` is a classic Oracle SQL idiom for range comparisons.
  * **A, C, D are incorrect:** `SIGN` returns `-1` for any negative number, `1` for positive, and `0` for zero.
</details>

---
