# Review Questions - Chapter 2: Oracle Data Types and Conversion Functions

> **Reference:** *OCA/OCP Oracle Database SQL Study Guide (Exam 1Z0-071)*.  
> **Total Questions:** 25 multiple-choice questions matching the Oracle SQL certification exam format with detailed explanations.  
> **How to study:** Read each question and select your answer first, then click **"👉 View Answer & Detailed Explanation"** to verify your choice and master the exam traps.

---

### Question 1
**Which of the following `CREATE TABLE` statements will fail with a syntax error when executed in an Oracle Database?**

* A. `CREATE TABLE t1 (c1 CHAR);`
* B. `CREATE TABLE t2 (c1 NUMBER);`
* C. `CREATE TABLE t3 (c1 VARCHAR2);`
* D. `CREATE TABLE t4 (c1 TIMESTAMP);`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct (Fails with syntax error):** In Oracle SQL, the `VARCHAR2(size)` data type (as well as `NVARCHAR2(size)` and `RAW(size)`) **requires a maximum length `size` to be explicitly specified** (e.g., `VARCHAR2(20)`). Omitting the parenthesized size raises `ORA-00906: missing left parenthesis`.
  * **A is incorrect (Valid):** `CHAR` without a specified size defaults to **`CHAR(1)`**.
  * **B is incorrect (Valid):** `NUMBER` without `(p, s)` stores a floating-point number with up to 38 digits of precision.
  * **D is incorrect (Valid):** `TIMESTAMP` without `(p)` defaults to `TIMESTAMP(6)`.
</details>

---

### Question 2
**The `TEST_PAD` table has two columns: `col_char CHAR(5)` and `col_vchar VARCHAR2(5)`. After executing `INSERT INTO test_pad VALUES ('VN', 'VN');`, what output is returned by the following query?**

```sql
SELECT LENGTH(col_char) AS len_c,
       LENGTH(col_vchar) AS len_v
FROM test_pad;
```

* A. `LEN_C = 2`, `LEN_V = 2`
* B. `LEN_C = 5`, `LEN_V = 2`
* C. `LEN_C = 5`, `LEN_V = 5`
* D. `LEN_C = 2`, `LEN_V = 5`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:**
    * `CHAR(5)` is a **fixed-length** character data type. When `'VN'` (2 characters) is inserted into `CHAR(5)`, Oracle automatically right-pads the value with 3 trailing spaces (`'VN   '`), so `LENGTH(col_char)` returns **`5`**.
    * `VARCHAR2(5)` is a **variable-length** character data type. When `'VN'` is inserted, only the 2 characters `'VN'` are stored without padding, so `LENGTH(col_vchar)` returns **`2`**.
  * **A, C, D are incorrect:** Remember that `CHAR` always blank-pads shorter strings to the declared column length.
</details>

---

### Question 3
**The `PRICE` column in the `PRODUCTS` table is defined as `NUMBER(6, 2)`. What happens when you execute the following two `INSERT` statements?**

```sql
-- Statement 1:
INSERT INTO products (price) VALUES (1234.567);
-- Statement 2:
INSERT INTO products (price) VALUES (12345.6);
```

* A. Both statements succeed; Statement 1 stores `1234.57` and Statement 2 stores `12345.60`.
* B. Both statements fail with `ORA-01438` because they exceed the allowed precision.
* C. Statement 1 succeeds and stores `1234.57`; Statement 2 fails with `ORA-01438`.
* D. Statement 1 fails because it has 3 decimal places; Statement 2 succeeds because it has 6 total digits.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** With `NUMBER(6, 2)`:
    * Total precision (`p`) is `6` and scale (`s`) is `2`. Thus, the **maximum number of digits allowed to the left of the decimal point (integer part) is `p - s = 6 - 2 = 4` digits**.
    * **Statement 1 (`1234.567`):** The integer part has 4 digits (`1234`), which is valid. The fractional part `.567` exceeds scale `2`, so Oracle **automatically rounds** it to `.57` and stores **`1234.57`**.
    * **Statement 2 (`12345.6`):** Although it has 6 digits in total, the integer part has **5 digits** (`12345` > 4), exceeding the maximum `p - s = 4` integer digits and raising `ORA-01438: value larger than specified precision allowed for this column`.
  * **A, B, D are incorrect:** Counting total digits without checking `p - s` for the integer part is a classic `NUMBER(p, s)` exam trap.
</details>

---

### Question 4
**The `POPULATION` column in the `CITIES` table is defined with a negative scale as `NUMBER(7, -3)`. If you insert the value `1234567.89` into `POPULATION`, what value is actually stored in the table?**

* A. `1234568`
* B. `1234000`
* C. `1235000`
* D. An error occurs because the scale (`s`) parameter in `NUMBER(p, s)` cannot be negative.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct (`1235000`):** In Oracle, the scale `s` of `NUMBER(p, s)` can range from **`-84` to `127`**. When `s` is negative (`-3`), Oracle **rounds the number `3` places to the left of the decimal point** (i.e., to the nearest thousand).
  * For `1234567.89`, the hundreds digit is `5` (`567.89 >= 500`), so rounding to the nearest thousand yields **`1235000`**.
  * **A is incorrect:** That would be the result of `NUMBER(7, 0)` or `NUMBER(7)`.
  * **B is incorrect:** Negative scale rounds rather than truncates.
  * **D is incorrect:** Negative scale is completely valid in Oracle SQL.
</details>

---

### Question 5
**A column named `RATIO` is defined as `NUMBER(2, 4)`. Which of the following values can be inserted into `RATIO` WITHOUT raising `ORA-01438`?**

* A. `12.3456`
* B. `0.12`
* C. `0.012`
* D. `0.0012`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct (`0.0012`):** When `NUMBER(p, s)` has **`s > p`** (here `p = 2, s = 4`):
    * `s = 4` specifies 4 digits after the decimal point.
    * Because precision `p = 2` allows at most 2 significant digits, **the first `s - p = 4 - 2 = 2` digits immediately after the decimal point MUST be zeros (`0`)**!
    * Therefore, the absolute value must be less than `0.01`. Among the choices, only `0.0012` has two leading zeros after the decimal point followed by 2 significant digits (`12`).
  * **A, B, C are incorrect:** All of them require more than 2 significant digits when represented to 4 decimal places (e.g., `0.0120` has 3 digits from the first non-zero digit to the 4th decimal place).
</details>

---

### Question 6
**Which statement is TRUE regarding the standard `DATE` data type in Oracle Database?**

* A. `DATE` stores only Year, Month, and Day; to store Hour, Minute, and Second, you must use `TIMESTAMP`.
* B. `DATE` always stores 7 components: Century, Year, Month, Day, Hour, Minute, and Second (but does not store fractional seconds or time zone).
* C. `DATE` stores fractional seconds (microseconds) as well as a time zone offset (`TIME ZONE`).
* D. You can add two `DATE` values together (`date1 + date2`) to calculate combined time.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Unlike ANSI `DATE` in some other databases, Oracle's `DATE` data type always occupies 7 bytes and stores both **date and time** down to the second: **Century, Year, Month, Day, Hour, Minute, and Second**.
  * **A is incorrect:** `DATE` already includes Hour, Minute, and Second.
  * **C is incorrect:** Fractional seconds require `TIMESTAMP`, and time zone offsets require `TIMESTAMP WITH TIME ZONE`.
  * **D is incorrect:** Adding two dates (`date1 + date2`) is invalid and raises `ORA-00975: date + date not allowed`. You can subtract two dates (`date1 - date2`) or add/subtract a `NUMBER` of days to/from a `DATE`.
</details>

---

### Question 7
**A global e-commerce application needs to store the order timestamp (`ORDER_DATE`) so that when customers or staff in any country query the column, the displayed time is automatically converted to the querying user's current session time zone (`SESSIONTIMEZONE`). Which data type should you choose for `ORDER_DATE`?**

* A. `DATE`
* B. `TIMESTAMP`
* C. `TIMESTAMP WITH TIME ZONE`
* D. `TIMESTAMP WITH LOCAL TIME ZONE`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **D**
* **Detailed Explanation:**
  * **D is correct:** `TIMESTAMP WITH LOCAL TIME ZONE` normalizes the timestamp to the database time zone (`DBTIMEZONE`) when stored on disk, and **automatically converts it to the querying user's `SESSIONTIMEZONE`** whenever it is retrieved.
  * **A, B are incorrect:** Neither is time-zone aware.
  * **C is incorrect:** `TIMESTAMP WITH TIME ZONE` preserves and displays the original time zone offset that was inserted rather than converting it to the viewer's `SESSIONTIMEZONE`.
</details>

---

### Question 8
**Which query uses valid `INTERVAL` literal syntax to add a duration of "2 years and 6 months" to `SYSDATE`?**

```sql
-- Choose the query that executes successfully in Oracle Database:
```

* A. `SELECT SYSDATE + INTERVAL '2-6' YEAR TO MONTH FROM dual;`
* B. `SELECT SYSDATE + INTERVAL '2:6' YEAR TO MONTH FROM dual;`
* C. `SELECT SYSDATE + INTERVAL '2 6' DAY TO SECOND FROM dual;`
* D. `SELECT SYSDATE + INTERVAL '30' YEAR TO MONTH FROM dual;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** The standard syntax for an `INTERVAL YEAR TO MONTH` literal specifying both years and months uses a hyphen `-` between years and months: `INTERVAL 'years-months' YEAR TO MONTH` (`INTERVAL '2-6' YEAR TO MONTH`).
  * **B is incorrect:** A colon `:` is used for time fields (`HOUR TO MINUTE` / `DAY TO SECOND`), not `YEAR TO MONTH`.
  * **C is incorrect:** `'2 6'` with `DAY TO SECOND` lacks the required `HH:MI:SS` format and represents days/hours rather than years/months.
  * **D is incorrect:** A single number `'30'` requires `INTERVAL '30' MONTH` or `INTERVAL '30' YEAR`; `YEAR TO MONTH` requires the `'Y-M'` format.
</details>

---

### Question 9
**Why does the following query fail with `ORA-01873: the leading precision of the interval is too small`?**

```sql
SELECT SYSDATE + INTERVAL '120' YEAR
FROM dual;
```

* A. Because Oracle does not allow adding more than 100 years to a `DATE` value.
* B. Because the default precision of the `YEAR` field in an `INTERVAL` is 2 digits (`YEAR(2)`), which cannot hold the 3-digit number `120`; it must be written as `INTERVAL '120' YEAR(3)`.
* C. Because it must be written as `INTERVAL '120-0' YEAR TO MONTH`.
* D. Because `SYSDATE` returns a `DATE` and cannot be added to an `INTERVAL`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In both `INTERVAL YEAR[(p)] TO MONTH` and `INTERVAL DAY[(p)] TO SECOND`, the default leading field precision (`YEAR` or `DAY`) is **`2` digits** (`00` to `99`). Because `120` has **3 digits**, it exceeds the default `YEAR(2)` precision and raises `ORA-01873`. To succeed, you must explicitly specify `INTERVAL '120' YEAR(3)`.
  * **A, C, D are incorrect:** Oracle supports adding intervals of ratusan/thousands of years to `DATE` values as long as the leading precision `YEAR(p)` is specified.
</details>

---

### Question 10
**In an Oracle Database, when you need to store large JSON/XML documents or articles up to hundreds of Megabytes directly inside a database table (with full ACID transaction support for `COMMIT`/`ROLLBACK`), which data type is recommended?**

* A. `VARCHAR2(4000)`
* B. `LONG`
* C. `CLOB`
* D. `BFILE`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** **`CLOB` (Character Large Object)** stores massive character data (8 TB to 128 TB) directly inside the database with full transaction support, and a table can contain multiple `CLOB` columns.
  * **A is incorrect:** `VARCHAR2` holds at most 4,000 bytes (or 32,767 bytes with `MAX_STRING_SIZE = EXTENDED`).
  * **B is incorrect:** `LONG` (up to 2 GB, limited to 1 column per table) is **deprecated** and should not be used for new tables.
  * **D is incorrect:** `BFILE` stores only a locator pointing to an external operating system file, is read-only, and does not participate in database transactions.
</details>

---

### Question 11
**In Oracle SQL, what is the output of the following query?**

```sql
SELECT CASE WHEN '' IS NULL THEN 'YES_NULL' ELSE 'NOT_NULL' END AS check_empty,
       CASE WHEN ' ' IS NULL THEN 'YES_NULL' ELSE 'NOT_NULL' END AS check_space
FROM dual;
```

* A. `CHECK_EMPTY = 'NOT_NULL'`, `CHECK_SPACE = 'NOT_NULL'`
* B. `CHECK_EMPTY = 'YES_NULL'`, `CHECK_SPACE = 'YES_NULL'`
* C. `CHECK_EMPTY = 'YES_NULL'`, `CHECK_SPACE = 'NOT_NULL'`
* D. `CHECK_EMPTY = 'NOT_NULL'`, `CHECK_SPACE = 'YES_NULL'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:**
    * In Oracle Database, **an empty string literal `''` (two single quotes with nothing between them) is treated as `NULL`**. Therefore, `'' IS NULL` evaluates to **`TRUE`**, returning `'YES_NULL'`.
    * Conversely, `' '` contains **1 space character (ASCII 32)**, has a length of `1`, and is **NOT `NULL`**. Thus `' ' IS NULL` evaluates to **`FALSE`**, returning `'NOT_NULL'`.
  * **A, B, D are incorrect:** Remember that Oracle treats `''` as `NULL`, unlike PostgreSQL or MySQL.
</details>

---

### Question 12
**An employee row has `salary = 10000`, `commission_pct = NULL`, and `first_name = 'Steven'`. What is the output of the following query?**

```sql
SELECT salary + (salary * commission_pct) AS total_income,
       'Emp: ' || first_name || commission_pct AS emp_label
FROM employees
WHERE employee_id = 100;
```

* A. `TOTAL_INCOME = 10000`, `EMP_LABEL = 'Emp: Steven'`
* B. `TOTAL_INCOME = NULL`, `EMP_LABEL = 'Emp: Steven'`
* C. `TOTAL_INCOME = NULL`, `EMP_LABEL = NULL`
* D. `TOTAL_INCOME = 10000`, `EMP_LABEL = 'Emp: StevenNULL'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** This question contrasts arithmetic operations with string concatenation when `NULL` is involved:
    1. **Arithmetic operators (`+`, `-`, `*`, `/`):** Any arithmetic expression containing a `NULL` operand evaluates to **`NULL`**. Thus `10000 + (10000 * NULL)` = **`NULL`**.
    2. **String concatenation (`||`):** In Oracle, the `||` operator ignores `NULL` (treats `NULL` as an empty string). Thus `'Emp: ' || 'Steven' || NULL` evaluates to **`'Emp: Steven'`**.
  * **A, C, D are incorrect:** To get `10000` for `TOTAL_INCOME`, you must wrap `commission_pct` in `NVL(commission_pct, 0)`.
</details>

---

### Question 13
**Suppose the `SUBSCRIBERS` table has 30 million rows. The `MSISDN` (phone number) column is of type `VARCHAR2(15)` and has a B-Tree index named `IDX_SUB_MSISDN`. Why does the following query run very slowly (performing a Full Table Scan instead of using `IDX_SUB_MSISDN`)?**

```sql
SELECT sub_id, sub_name
FROM subscribers
WHERE msisdn = 84912345678;
```

* A. Because Oracle does not support B-Tree indexes on `VARCHAR2` columns.
* B. Because comparing a `VARCHAR2` column to a `NUMBER` literal causes Oracle to implicitly convert the column via `TO_NUMBER(msisdn) = 84912345678`, which disables the B-Tree index on `msisdn`.
* C. Because `84912345678` exceeds the maximum precision of `NUMBER`, preventing index usage.
* D. Because the `SELECT` list does not include the `msisdn` column.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** According to Oracle's Data Type Precedence rules, **`NUMBER` has higher precedence than `VARCHAR2`**. When evaluating `msisdn = 84912345678`, Oracle implicitly applies `TO_NUMBER` to the column:
    `WHERE TO_NUMBER(msisdn) = 84912345678`.
    Wrapping the indexed column `msisdn` inside `TO_NUMBER()` prevents the optimizer from using the standard B-Tree index `IDX_SUB_MSISDN`, forcing a costly **Full Table Scan** (and risking `ORA-01722: invalid number` if any row contains non-numeric characters).
  * **A, C, D are incorrect:** Enclosing the literal in single quotes (`WHERE msisdn = '84912345678'`) avoids implicit conversion and allows an Index Range/Unique Scan.
</details>

---

### Question 14
**Which of the following expressions performs an implicit data type conversion SUCCESSFULLY in an Oracle Database?**

```sql
-- Assume the session's NLS_DATE_FORMAT is 'DD-MON-RR'
```

* A. `SELECT '150.5' + 49.5 FROM dual;`
* B. `SELECT '$150' + 50 FROM dual;`
* C. `SELECT '150,000' + 100 FROM dual;`
* D. `SELECT SYSDATE + '01-JAN-26' FROM dual;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** In `'150.5' + 49.5`, the `+` operator requires numbers, and `'150.5'` contains only valid numeric digits and a decimal point, so Oracle implicitly converts `'150.5'` to the number `150.5` and returns **`200`**.
  * **B and C are incorrect:** Strings containing currency symbols (`'$'`) or group separators (`','`) **cannot** be implicitly converted to `NUMBER` (they raise `ORA-01722: invalid number`); they require `TO_NUMBER('$150', '$999')`.
  * **D is incorrect:** You cannot add a date string to `SYSDATE`; Oracle attempts to convert `'01-JAN-26'` to a `NUMBER` of days and raises `ORA-01722: invalid number`.
</details>

---

### Question 15
**Assume the current year on the Oracle Database server is `2026`. What is the result of the following query?**

```sql
SELECT TO_CHAR(TO_DATE('27-OCT-98', 'DD-MON-RR'), 'YYYY') AS year_rr,
       TO_CHAR(TO_DATE('27-OCT-98', 'DD-MON-YY'), 'YYYY') AS year_yy,
       TO_CHAR(TO_DATE('27-OCT-15', 'DD-MON-RR'), 'YYYY') AS year_rr2
FROM dual;
```

* A. `YEAR_RR = '1998'`, `YEAR_YY = '2098'`, `YEAR_RR2 = '2015'`
* B. `YEAR_RR = '2098'`, `YEAR_YY = '1998'`, `YEAR_RR2 = '2015'`
* C. `YEAR_RR = '1998'`, `YEAR_YY = '1998'`, `YEAR_RR2 = '1915'`
* D. `YEAR_RR = '2098'`, `YEAR_YY = '2098'`, `YEAR_RR2 = '2015'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** The current year is **`2026`** (the last 2 digits `26` fall in `00–49`):
    1. With **`RR`** and input year `98` (`50–99`): `RR` assigns the **previous century (`19xx`)**, returning **`'1998'`**.
    2. With **`YY`** and input year `98`: `YY` **always assigns the current century (`20xx`)**, returning **`'2098'`**.
    3. With **`RR`** and input year `15` (`00–49`): `RR` assigns the **current century (`20xx`)**, returning **`'2015'`**.
  * **B, C, D are incorrect:** Memorize the `RR` 50-year window matrix vs `YY` for the exam.
</details>

---

### Question 16
**Suppose in the future the current system year is `2052` (last two digits `52`, falling in `50–99`). What year will the expression `TO_CHAR(TO_DATE('10-JAN-15', 'DD-MON-RR'), 'YYYY')` return?**

* A. `'1915'`
* B. `'2015'`
* C. `'2115'`
* D. `'2052'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct (`'2115'`):** According to the `RR` format rule:
    * When the last two digits of the current year are in **`50–99`** (such as `2052`) and the specified two-digit year is in **`00–49`** (here `'15'`), the century returned is the **NEXT century (`21xx`)**, giving **`'2115'`**.
  * **A, B, D are incorrect:** If the specified year were in `50–99` (e.g., `'85'`) during `2052`, `RR` would return the current century `'2085'`.
</details>

---

### Question 17
**What is the result when the following SQL statement is executed?**

```sql
SELECT TO_CHAR(DATE '2026-05-03', 'fmMonth DD, YYYY') AS formatted_date
FROM dual;
```

* A. `'May       03, 2026'`
* B. `'May 03, 2026'`
* C. `'May 3, 2026'`
* D. `'MAY 3, 2026'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct (`'May 3, 2026'`):**
    * The **`fm` (Fill Mode)** modifier at the start of the format model does two things:
      1. It strips trailing blank-padding from `Month` (`'May      '` becomes `'May'`).
      2. It strips leading zeroes from `DD` (`'03'` becomes `'3'`).
    * Because `'Month'` is capitalized (Initcap), the month name is formatted as `'May'`.
  * **A is incorrect:** This is the output without `fm`.
  * **B is incorrect:** `fm` also suppresses the leading zero in `03`.
  * **D is incorrect:** `'MAY'` in all caps only appears if the format element is written as `'MONTH'`.
</details>

---

### Question 18
**In the following `TO_CHAR` query, why does the day (`DD`) display its leading zero again as `'03'`?**

```sql
SELECT TO_CHAR(DATE '2026-05-03', 'fmMonth fmDD, YYYY') AS result
FROM dual;
```

* A. Because `fm` never affects the `DD` format element.
* B. Because the `fm` modifier acts as a toggle switch: the first `fm` turns Fill Mode ON for `Month`, and the second `fm` turns Fill Mode OFF starting at `DD`!
* C. Because specifying `fm` twice causes Oracle to ignore both `fm` modifiers.
* D. The statement fails with a syntax error because `fm` cannot appear twice in the same format string.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In Oracle format models, **`FM` acts as a toggle switch**:
    * The first `fm` before `Month` turns Fill Mode **ON**, removing trailing spaces from `'May'`.
    * The second `fm` before `DD` turns Fill Mode **OFF**, restoring leading zeroes for `DD` (`'03'`). Thus the result is **`'May 03, 2026'`**.
  * **A, C, D are incorrect:** Understanding `FM` as a toggle allows fine-grained control over padding and leading zeroes within a single `TO_CHAR` call.
</details>

---

### Question 19
**What is the output of the following numeric formatting query?**

```sql
SELECT TO_CHAR(12345.67, '$9,999.99') AS formatted_num
FROM dual;
```

* A. `'$12,345.67'`
* B. `'$2,345.67'`
* C. `'##########'`
* D. Fails with `ORA-01481: invalid number format model`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct (`'##########'`):**
    * The number `12345.67` has **5 integer digits** (`12345`), whereas the format model `'$9,999.99'` provides only **4 digit placeholders (`9`)** to the left of the decimal point.
    * When the integer part of a number exceeds the format model's width, `TO_CHAR` does not raise an error or truncate digits; instead, it returns a string of pound/hash signs **`'##########'`** to indicate format overflow.
  * **A, B, D are incorrect:** Note that excess fractional digits are rounded, whereas excess integer digits produce `'#####'`.
</details>

---

### Question 20
**What is returned by the following SQL statement?**

```sql
SELECT TO_CHAR(DATE '2026-03-02', 'Ddspth "of" fmMonth') AS date_in_words
FROM dual;
```

* A. `'Second of March'`
* B. `'2nd of March'`
* C. `'Two of March'`
* D. An error occurs because `"of"` is not allowed inside a date format model.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct (`'Second of March'`):**
    * `Dd`: Day of the month (`02`) in Initcap case.
    * `sp` (*Spelled out*): Spells out the number in words (`Two`).
    * `th` (*Ordinal*): Uses the ordinal form (`Second`). Combining `Ddspth` (or `Ddthsp`) for day `02` yields **`'Second'`**.
    * `"of"`: Literal text enclosed in double quotes `"..."` is output as-is.
    * `fmMonth`: Month name in Initcap without trailing spaces $\rightarrow$ **`'March'`**.
  * **B is incorrect:** `'2nd'` is produced by `'fmDDth'` without `sp`.
  * **C is incorrect:** `'Two'` is produced by `'Ddsp'` without `th`.
  * **D is incorrect:** Double-quoted string literals are valid inside `TO_CHAR` date format models.
</details>

---

### Question 21
**Which statement accurately converts the formatted string `'$12,500.50'` into a `NUMBER` value for arithmetic calculations?**

* A. `SELECT CAST('$12,500.50' AS NUMBER) FROM dual;`
* B. `SELECT TO_NUMBER('$12,500.50') FROM dual;`
* C. `SELECT TO_NUMBER('$12,500.50', '$99,999.99') FROM dual;`
* D. `SELECT TO_CHAR('$12,500.50', '99999.99') FROM dual;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Because the input string `'$12,500.50'` contains a currency symbol (`$`) and a group separator (`,`), you **must** use `TO_NUMBER(char, 'format_model')` with a matching format model (`'$99,999.99'`) to parse it into `12500.5`.
  * **A and B are incorrect:** Both `CAST('$12,500.50' AS NUMBER)` and `TO_NUMBER('$12,500.50')` without a format model fail with `ORA-01722: invalid number`.
  * **D is incorrect:** `TO_CHAR` converts values to character strings, not to `NUMBER`.
</details>

---

### Question 22
**Which of the following ANSI `CAST` expressions are VALID in Oracle SQL? (Choose all that apply.)**

* A. `SELECT CAST('2500.75' AS NUMBER(6, 1)) FROM dual;`
* B. `SELECT CAST(SYSDATE AS TIMESTAMP) FROM dual;`
* C. `SELECT CAST(12345 AS DATE) FROM dual;`
* D. `SELECT CAST(98765 AS VARCHAR2(10)) FROM dual;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, B, D**
* **Detailed Explanation:**
  * **A is correct:** `CAST('2500.75' AS NUMBER(6, 1))` converts the numeric string to `NUMBER(6, 1)` and rounds it to `2500.8`.
  * **B is correct:** `CAST(SYSDATE AS TIMESTAMP)` converts a `DATE` value to `TIMESTAMP` (with `.000000` fractional seconds).
  * **D is correct:** `CAST(98765 AS VARCHAR2(10))` converts the number `98765` to the string `'98765'`.
  * **C is incorrect:** Oracle SQL **does not allow** direct casting between `NUMBER` and `DATE` (`ORA-00932: inconsistent datatypes: expected DATE got NUMBER`).
</details>

---

### Question 23
**In the `EVENTS` table, both `START_TIME` and `END_TIME` are of type `DATE`. What is the data type returned by `END_TIME - START_TIME`? And what is the data type returned if both columns are of type `TIMESTAMP` instead?**

* A. Both subtractions return `NUMBER` (number of days).
* B. Both subtractions return `INTERVAL DAY TO SECOND`.
* C. `DATE - DATE` returns `NUMBER` (number of days); `TIMESTAMP - TIMESTAMP` returns `INTERVAL DAY TO SECOND`.
* D. `DATE - DATE` returns `INTERVAL DAY TO SECOND`; `TIMESTAMP - TIMESTAMP` returns `NUMBER`.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** This is a key distinction tested on Exam 1Z0-071:
    1. Subtracting two **`DATE`** values (`DATE - DATE`) returns a **`NUMBER`** representing the difference in days (including a fractional part for hours/minutes/seconds).
    2. Subtracting two **`TIMESTAMP`** values (`TIMESTAMP - TIMESTAMP`) returns an **`INTERVAL DAY TO SECOND`** value (e.g., `+000000001 12:00:00.000000`).
  * **A, B, D are incorrect:** Do not confuse the return type of `DATE - DATE` with `TIMESTAMP - TIMESTAMP`.
</details>

---

### Question 24
**An Oracle Database uses the `AL32UTF8` (UTF-8) character set (where accented Vietnamese characters occupy 2 to 3 bytes each) and `NLS_LENGTH_SEMANTICS = BYTE`. A developer creates a table with a column defined as `FULL_NAME VARCHAR2(10)`. Which statement is TRUE?**

* A. `FULL_NAME` can always store any 10 characters, including 10 accented Vietnamese characters such as `'Nguyễn Văn'`.
* B. Because the default length semantics is `BYTE`, `FULL_NAME` can store at most 10 bytes, so inserting `'Nguyễn Văn'` (which takes 13 bytes) fails with `ORA-12899: value too large for column`. To guarantee storing 10 characters, it should be declared as `VARCHAR2(10 CHAR)`.
* C. Oracle automatically truncates `'Nguyễn Văn'` to fit within 10 bytes without raising an error.
* D. The `AL32UTF8` character set does not support `VARCHAR2`; `NVARCHAR2` must be used instead.

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** When `NLS_LENGTH_SEMANTICS` is `BYTE` (the default), `VARCHAR2(10)` means `VARCHAR2(10 BYTE)`. In UTF-8 (`AL32UTF8`), `'ễ'` takes 3 bytes and `'ă'` takes 2 bytes, so `'Nguyễn Văn'` (10 characters) requires **13 bytes** (> 10 bytes) and fails with `ORA-12899`. Specifying `VARCHAR2(10 CHAR)` allocates space for up to 10 characters regardless of byte length per character.
  * **A is incorrect:** Only true when declared as `VARCHAR2(10 CHAR)` or `NVARCHAR2(10)`.
  * **C is incorrect:** Oracle never silently truncates oversized strings on insert; it raises `ORA-12899`.
  * **D is incorrect:** `VARCHAR2` in an `AL32UTF8` database fully supports Unicode.
</details>

---

### Question 25
**When using `TO_CHAR` to format the time portion of a `DATE` value, which format model accurately displays "24-hour Hour : Minute : Second"?**

* A. `'HH24:MM:SS'`
* B. `'HH24:MI:SS'`
* C. `'HH:MI:SS'`
* D. `'24HH:MI:SS'`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct (`'HH24:MI:SS'`):** In Oracle SQL date format models, **24-hour Hour** is `HH24`, **Minute** is **`MI`**, and **Second** is `SS`.
  * **A is incorrect (Classic Trap):** `MM` represents the **Month (`01`–`12`)**, not Minutes! Writing `'HH24:MM:SS'` executes without error but prints the month number in place of minutes.
  * **C is incorrect:** `HH` (equivalent to `HH12`) displays 12-hour time (`01`–`12`).
  * **D is incorrect:** `24HH` is invalid and raises `ORA-01821: date format not recognized`.
</details>
