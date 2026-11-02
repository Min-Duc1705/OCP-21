# Review Questions - Chapter 19: Advanced Transactions and Concurrency

> **Reference:** *OCA/OCP Oracle Database SQL Exam Guide (Exam 1Z0-071)* & *Oracle Database Concepts (Data Concurrency and Consistency)*.  
> **Total Questions:** 25 multiple-choice questions modeled after the official Oracle OCA/OCP exam with detailed explanations.  
> **How to study:** Read each question carefully and choose your answer first, then click **"👉 View Answer & Detailed Explanation"** to check the official answer and understand key exam traps.

---

### Question 1
**In Oracle Database, which transaction isolation modes are directly supported via the `SET TRANSACTION` statement? (Choose all that apply.)**

* A. `READ UNCOMMITTED`
* B. `READ COMMITTED`
* C. `REPEATABLE READ`
* D. `SERIALIZABLE`
* E. `READ ONLY`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B, D, E**
* **Detailed Explanation:**
  * **B, D, E are correct:** Oracle supports three transaction modes via `SET TRANSACTION`:
    1. `SET TRANSACTION ISOLATION LEVEL READ COMMITTED;` (Default).
    2. `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
    3. `SET TRANSACTION READ ONLY;`
  * **A, C are incorrect:** Oracle never permits dirty reads (so `READ UNCOMMITTED` is not supported) and does not have a `REPEATABLE READ` keyword (`SERIALIZABLE` prevents both non-repeatable reads and phantom reads).
</details>

---

### Question 2
**Suppose the `ACCOUNTS` table contains a row `account_id = 101` with `balance = 5000`. At time `T1`, `Session 1` executes `UPDATE accounts SET balance = 9000 WHERE account_id = 101;` without committing. At time `T2`, `Session 2` (in the default `READ COMMITTED` mode) executes the query below. What happens in `Session 2`?**

```sql
SELECT balance FROM accounts WHERE account_id = 101;
```

* A. `Session 2` hangs (waits) until `Session 1` executes `COMMIT` or `ROLLBACK`
* B. `Session 2` immediately returns `9000`
* C. `Session 2` immediately returns `5000` (reconstructed from the Before Image in the Undo Segment) without waiting for any lock
* D. `Session 2` receives `ORA-00054: resource busy`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Under Oracle's **Multi-Version Read Consistency (MVCC)** model, *"Writers never block Readers"*. When `Session 2` runs a regular `SELECT` and encounters uncommitted changes from `Session 1`, Oracle reads the pre-update **Before Image** (`balance = 5000`) from the **Undo Segment** to construct a Consistent Read (CR) block and returns `5000` immediately.
</details>

---

### Question 3
**What is the root cause of the classic `ORA-01555: snapshot too old` error during the execution of a `SELECT` query?**

* A. The `SELECT` statement attempts to modify data inside a `READ ONLY` transaction
* B. The Shared Pool runs out of memory for Hard Parsing
* C. A long-running `SELECT` query needs to read old Before Images as of its starting `Query SCN` to maintain read consistency, but those undo records in the **Undo Tablespace** have already been overwritten by other committed transactions
* D. Two sessions lock each other in a circular Deadlock

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** To guarantee **Statement-Level Read Consistency**, a query starting at `SCN = X` must see all data as it existed at `SCN = X`. If other transactions modify rows and `COMMIT` while the query is still running, their undo blocks become eligible for reuse. If those undo blocks are overwritten before the query reaches the modified table blocks, Oracle cannot reconstruct the consistent snapshot at `SCN = X` and raises **`ORA-01555: snapshot too old`**.
</details>

---

### Question 4
**Two sessions (`Session 1` and `Session 2`) execute the following sequence of statements in chronological order. What happens at step `T4` in `Session 1`?**

```sql
-- [T1] Session 1:
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SELECT salary FROM employees WHERE employee_id = 200; -- Returns: 4400

-- [T2] Session 2:
UPDATE employees SET salary = 5000 WHERE employee_id = 200;
COMMIT;

-- [T3] Session 1:
SELECT salary FROM employees WHERE employee_id = 200; -- Still returns: 4400

-- [T4] Session 1:
UPDATE employees SET salary = 6000 WHERE employee_id = 200;
```

* A. The `UPDATE` at `[T4]` succeeds and updates `salary` to `6000`
* B. `Session 1` hangs indefinitely at `[T4]` even though `Session 2` committed
* C. The `UPDATE` at `[T4]` immediately fails and raises `ORA-08177: can't serialize access for this transaction`
* D. The `UPDATE` at `[T4]` raises `ORA-01555: snapshot too old`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** A **`SERIALIZABLE`** transaction is only permitted to modify a row if no other transaction has modified and committed changes to that row since the `SERIALIZABLE` transaction began (`[T1]`). Because `Session 2` updated and committed `employee_id = 200` at `[T2]`, `Session 1`'s attempt to update the same row at `[T4]` immediately fails with **`ORA-08177: can't serialize access for this transaction`**.
</details>

---

### Question 5
**When a circular `Deadlock` occurs between two sessions and Oracle raises `ORA-00060: deadlock detected while waiting for resource` in one of the sessions, what scope of rollback does Oracle automatically perform?**

* A. It automatically rolls back the entire transactions of both sessions and releases all locks
* B. It automatically rolls back the entire transaction of the session that received `ORA-00060`
* C. It automatically performs only a **Statement-Level Rollback** of the single current DML statement that triggered the deadlock detection; all earlier DML statements and locks acquired previously in that session's transaction remain intact!
* D. It shuts down the database instance to protect data integrity

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** When Oracle detects a deadlock (`ORA-00060`), it **does NOT roll back the entire transaction** of the victim session. It performs only a **Statement-Level Rollback** of the single deadlocked statement to break the wait cycle. Previous DML changes and their row locks (`TX` locks) in that transaction remain active until the session explicitly issues `ROLLBACK` or `COMMIT`.
</details>

---

### Question 6
**`DEPARTMENTS (department_id PK)` is the parent table and `EMPLOYEES (department_id FK)` is the child table. The foreign key column `EMPLOYEES.department_id` is NOT indexed. What happens when a session executes `DELETE FROM departments WHERE department_id = 90;` (before committing)?**

* A. Only the `department_id = 90` row in `DEPARTMENTS` is locked; the `EMPLOYEES` table is completely unaffected
* B. Because the foreign key column is unindexed, Oracle acquires a restrictive table-level lock (`TM Lock` in Share / Share Sub-Exclusive mode) on the **ENTIRE child table `EMPLOYEES`**, blocking any `INSERT`, `UPDATE`, or `DELETE` on any department in `EMPLOYEES` by other sessions!
* C. Oracle automatically creates a B-Tree index on `EMPLOYEES.department_id` during the `DELETE`
* D. Oracle raises an error refusing to delete from a parent table if the child table lacks a foreign key index

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** When a parent row is deleted (`DELETE`) or its primary key column is updated (`UPDATE`), if the child table's Foreign Key column is **unindexed**, Oracle must acquire a table-level `TM` lock (mode 4 `Share` or mode 5 `SSX`) on the **entire child table** for the duration of the statement, blocking all concurrent DML on the child table and forcing a full table scan of the child table. Indexing the foreign key column eliminates this table-wide lock.
</details>

---

### Question 7
**Examine the `SELECT ... FOR UPDATE` statement joining two tables below. When this statement executes successfully, which rows are locked with exclusive row locks (`TX` locks)?**

```sql
SELECT e.employee_id, e.last_name, e.salary, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id
WHERE e.department_id = 60
FOR UPDATE;
```

* A. Only the qualifying rows in the `EMPLOYEES` table are locked
* B. Only the `department_id = 60` row in the `DEPARTMENTS` table is locked
* C. Both the qualifying employee rows in `EMPLOYEES` AND the department `60` row in `DEPARTMENTS` are locked!
* D. No rows are locked because `FOR UPDATE` does not work with `JOIN`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** When `FOR UPDATE` is specified **without an `OF column_name` clause** in a multi-table join query, Oracle places row-level locks (`TX` locks) on the qualifying rows of **all joined tables** referenced in the `FROM` clause (`EMPLOYEES` and `DEPARTMENTS`).
</details>

---

### Question 8
**Continuing from Question 7: If the developer changes the last line of the query to `FOR UPDATE OF e.salary NOWAIT;` as shown below, which rows will be locked?**

```sql
SELECT e.employee_id, e.last_name, e.salary, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id
WHERE e.department_id = 60
FOR UPDATE OF e.salary NOWAIT;
```

* A. Only the `salary` column cells are locked (other columns on the same rows of `EMPLOYEES` can still be updated by other sessions)
* B. Only the qualifying rows of the `EMPLOYEES` table (which owns the `e.salary` column) are locked, while rows in `DEPARTMENTS` are NOT locked
* C. Only the `DEPARTMENTS` table is locked, not `EMPLOYEES`
* D. All rows of both tables are locked

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Specifying `FOR UPDATE OF e.salary` instructs Oracle to lock **only the qualifying rows of the table that contains `e.salary`** (`EMPLOYEES`), leaving the joined row in `DEPARTMENTS` unlocked.
  * **A is incorrect:** Oracle locks entire rows (row-level locking), never individual columns.
</details>

---

### Question 9
**In a multi-threaded order processing system, 10 worker threads concurrently query the `ORDER_QUEUE` table to fetch and lock rows with `status = 'NEW'` so they can process different orders in parallel without blocking each other or failing with lock errors. Which clause is the best solution in Oracle?**

```sql
SELECT order_id, payload
FROM order_queue
WHERE status = 'NEW'
FOR UPDATE _____________;
```

* A. `NOWAIT`
* B. `WAIT 60`
* C. `SKIP LOCKED`
* D. `CASCADE`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** **`FOR UPDATE SKIP LOCKED`** skips over any rows currently locked by other sessions without waiting and without raising `ORA-00054`, immediately locking and returning the next available unlocked rows.
</details>

---

### Question 10
**What happens when a single transaction in Oracle executes an `UPDATE` statement that locks 5,000,000 (5 million) rows in a 20-million-row table?**

* A. Because the number of row locks exceeds RAM limits, Oracle automatically performs **Lock Escalation** (converting the row locks into an `EXCLUSIVE TABLE LOCK`)
* B. Oracle **NEVER performs Lock Escalation**; those 5 million rows remain locked at the row level (`TX` locks stored directly inside the data blocks), and the remaining 15 million rows in the table can still be updated/deleted concurrently by other sessions
* C. Oracle raises `ORA-04031: unable to allocate shared memory` due to lock manager memory exhaustion
* D. Oracle automatically commits every 10,000 rows to free locks

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Because Oracle stores row-level lock metadata (`TX` locks) directly inside the **Data Block Header (ITL - Interested Transaction List)** and row lock bytes rather than in a centralized in-memory lock table, locking millions of rows adds no lock-table memory overhead and **Oracle NEVER performs Lock Escalation**.
</details>

---

### Question 11
**A developer executes the following statements sequentially in a single session. At which line will Oracle raise an error, and why?**

```sql
-- Line 1:
INSERT INTO logs(log_id, message) VALUES (1, 'Start job');
-- Line 2:
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- Line 3:
UPDATE accounts SET balance = balance + 100 WHERE account_id = 10;
-- Line 4:
COMMIT;
```

* A. Error at Line 1 because `BEGIN TRANSACTION` was not declared
* B. Error at Line 2 (`ORA-01453: SET TRANSACTION must be first statement of transaction`) because `SET TRANSACTION` must be the very first statement of a transaction before any DML (`INSERT`) is executed
* C. Error at Line 3 because `SERIALIZABLE` mode does not allow `UPDATE` statements
* D. No error occurs; all 4 lines succeed

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** In Oracle, a transaction begins implicitly with the first executable DML statement (`INSERT` on Line 1). `SET TRANSACTION` **must be the first statement of a transaction** (immediately after session startup, `COMMIT`, or `ROLLBACK`). Executing it after an `INSERT` raises `ORA-01453`.
</details>

---

### Question 12
**Once a session has executed `SET TRANSACTION READ ONLY;`, which of the following statements is PERMITTED to execute inside that transaction?**

* A. `SELECT` statements (without the `FOR UPDATE` clause) on any table
* B. `SELECT ... FOR UPDATE`
* C. `INSERT`, `UPDATE`, `DELETE`, and `MERGE`
* D. `TRUNCATE TABLE`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** `SET TRANSACTION READ ONLY;` provides transaction-level read consistency across multiple `SELECT` queries and only permits read-only `SELECT` statements (without `FOR UPDATE`). Any DML or locking statement raises `ORA-01456`.
</details>

---

### Question 13
**While `Session 1` is in the middle of an uncommitted transaction (`UPDATE employees SET salary = 8000 WHERE employee_id = 105;`), `Session 2` attempts to execute the DDL statement: `ALTER TABLE employees DROP COLUMN commission_pct;`. What happens to `Session 2`'s statement?**

* A. `Session 2`'s `ALTER TABLE` drops the column immediately and auto-commits `Session 1`'s transaction
* B. Due to the table-level `TM Lock (Row Exclusive - RX)` held by `Session 1` on `EMPLOYEES`, `Session 2`'s DDL statement is blocked/rejected and raises `ORA-00054: resource busy and acquire with NOWAIT specified or timeout expired`
* C. `Session 1`'s transaction is aborted to give priority to `Session 2`'s DDL
* D. The `EMPLOYEES` table is dropped

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** When `Session 1` updates a row in `EMPLOYEES`, it holds both an exclusive row lock (`TX`) on row `105` and a shared table lock (`TM Lock` in `RX` mode) on `EMPLOYEES`. This `TM` lock prevents any concurrent session from acquiring an exclusive DDL lock to alter or drop the table structure, raising `ORA-00054` (by default `DDL_LOCK_TIMEOUT = 0`).
</details>

---

### Question 14
**Two bank tellers simultaneously open the account screen for customer `ID = 500` (initial balance `10,000,000`). Teller 1 updates the balance to `12,000,000` and commits. Two seconds later, Teller 2 (still viewing the old `10,000,000` balance on screen) saves an update setting the balance to `9,000,000` and commits, completely overwriting Teller 1's `+2,000,000` deposit. What is this concurrency phenomenon called?**

* A. Dirty Read
* B. Phantom Read
* C. Lost Update
* D. Snapshot Too Old

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** A **Lost Update** occurs when two concurrent transactions read the same initial state, and the second transaction's update blindly overwrites the first transaction's committed update without detecting that the row had changed in the meantime.
</details>

---

### Question 15
**To prevent `Lost Updates` in stateless Web / RESTful API applications (where database connections and `SELECT ... FOR UPDATE` locks cannot be held across HTTP requests), how is `Optimistic Locking` implemented?**

* A. Lock the entire table using `LOCK TABLE accounts IN EXCLUSIVE MODE` whenever a user logs in
* B. Add a version-tracking column (such as `VERSION NUMBER` or `LAST_UPDATED TIMESTAMP`); when updating, include `WHERE id = :id AND version = :old_version` while incrementing `SET version = version + 1`. If `0` rows are updated, alert the user that the record was modified by another user
* C. Disable all `PRIMARY KEY` constraints on the table
* D. Execute `ROLLBACK` after every `UPDATE` statement

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** **Optimistic Locking** avoids holding database locks during user think-time. Instead, it verifies at `UPDATE` time that the row's `version` (or timestamp/`ORA_ROWSCN`) still matches the value read earlier (`WHERE id = :id AND version = :old_version`). If another user modified the row in the interim, `version` will have changed, causing the `UPDATE` to affect `0` rows (`SQL%ROWCOUNT = 0`) and preventing a lost update.
</details>

---

### Question 16
**In Oracle Database, which pseudocolumn returns the conservative System Change Number (SCN) of the most recent commit affecting a row (or block), supporting Optimistic Locking without adding a custom `VERSION` column?**

* A. `ROWNUM`
* B. `ROWID`
* C. `ORA_ROWSCN` (which tracks exact row-level SCNs when the table is created with `ROWDEPENDENCIES`)
* D. `LEVEL`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** The **`ORA_ROWSCN`** pseudocolumn returns the commit SCN of the last modification. When a table is created with **`ROWDEPENDENCIES`**, Oracle tracks the SCN at the individual row level rather than the block header level, making `ORA_ROWSCN` ideal for optimistic locking checks.
</details>

---

### Question 17
**Why is the following PL/SQL batch processing code considered a dangerous anti-pattern in Oracle Database? (Choose two.)**

```sql
DECLARE
    CURSOR c_emp IS SELECT employee_id, salary FROM employees WHERE department_id = 50;
BEGIN
    FOR r IN c_emp LOOP
        UPDATE employees SET salary = r.salary * 1.05 WHERE employee_id = r.employee_id;
        COMMIT; -- Committing inside the cursor loop!
    END LOOP;
END;
/
```

* A. Issuing `COMMIT` inside an open cursor loop on the same table being updated releases undo segments needed to maintain read consistency for `c_emp`, frequently causing **`ORA-01555: snapshot too old`**
* B. Committing thousands of times in a row forces `LGWR` to perform synchronous disk writes (`log file sync` waits) on every iteration, drastically degrading performance compared to a single set-based `UPDATE` and breaking transactional atomicity
* C. PL/SQL prohibits the `COMMIT` keyword inside a `BEGIN ... END` block
* D. `COMMIT` inside a loop automatically drops the `EMPLOYEES` table

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, B**
* **Detailed Explanation:**
  * **A is correct:** Fetching across commits on the same table being modified allows Oracle to overwrite undo blocks required by the open cursor `c_emp` to reconstruct consistent blocks as of the cursor's open SCN, triggering **`ORA-01555: snapshot too old`**.
  * **B is correct:** Row-by-row commits incur massive `log file sync` overhead and leave the table in a partially updated state if the job fails mid-loop.
</details>

---

### Question 18
**In Oracle's default `READ COMMITTED` isolation level, if `Session 1` executes the exact same query `SELECT salary FROM employees WHERE employee_id = 100;` at times `T1` and `T3` within the same transaction, and at time `T2` (between `T1` and `T3`) `Session 2` updates employee `100`'s salary from `5000` to `8000` and commits, what values does `Session 1` see at `T1` and `T3`?**

* A. Both `T1` and `T3` return `5000`
* B. `T1` returns `5000`, and `T3` returns `8000` (because in `READ COMMITTED` mode, each individual `SELECT` statement establishes a fresh `Query SCN` when it begins, seeing all changes committed prior to that statement)
* C. `T3` raises `ORA-08177`
* D. Both `T1` and `T3` return `8000`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `READ COMMITTED` guarantees **Statement-Level Read Consistency**, meaning each `SELECT` statement takes a new snapshot SCN when that statement starts. Since `Session 2` committed at `T2`, `Session 1`'s second `SELECT` at `T3` sees the newly committed value `8000` (a non-repeatable read, which is normal in `READ COMMITTED` mode).
</details>

---

### Question 19
**While `Session 1` holds an exclusive row lock on `order_id = 555`, `Session 2` executes the statement below. What happens to `Session 2`?**

```sql
SELECT order_id, total_amount
FROM orders
WHERE order_id = 555
FOR UPDATE WAIT 5;
```

* A. `Session 2` skips row `555` and returns an empty result set immediately
* B. `Session 2` waits up to 5 seconds; if `Session 1` commits or rolls back within 5 seconds, `Session 2` acquires the lock and succeeds; if the lock is still held after 5 seconds, `Session 2` raises `ORA-00054`
* C. `Session 2` automatically aborts `Session 1`'s transaction after 5 seconds
* D. `Session 2` raises a syntax error because an integer cannot follow `WAIT`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** `FOR UPDATE WAIT n` waits up to `n` seconds for locked rows to be released. If the timeout expires before the lock is acquired, Oracle raises `ORA-00054: resource busy and acquire with NOWAIT specified or timeout expired`.
</details>

---

### Question 20
**Which of the following events will release ALL row locks (`TX` locks) and table locks (`TM` locks) currently held by a transaction in Oracle Database? (Choose all that apply.)**

* A. Executing `COMMIT;`
* B. Executing `ROLLBACK;` (without `TO SAVEPOINT`)
* C. Executing `SAVEPOINT sp_1;`
* D. Executing a DDL statement (such as `CREATE TABLE`, `ALTER TABLE`, `TRUNCATE TABLE`), because DDL statements issue an implicit `COMMIT` before and after execution
* E. Executing `ROLLBACK TO SAVEPOINT sp_1;`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A, B, D**
* **Detailed Explanation:**
  * **A, B, D are correct:** All locks held by a transaction are released when the transaction ends via `COMMIT`, a full `ROLLBACK`, or an implicit commit triggered by any DDL statement.
  * **C is incorrect:** Creating a savepoint does not release any locks.
  * **E is incorrect:** `ROLLBACK TO SAVEPOINT sp_1` releases only locks acquired *after* `sp_1`; locks acquired *before* `sp_1` remain held.
</details>

---

### Question 21
**Inside a transaction, `Session 1` executes the following steps in order:**
1. `UPDATE products SET price = 100 WHERE prod_id = 1;`
2. `SAVEPOINT sp_a;`
3. `UPDATE products SET price = 200 WHERE prod_id = 2;`
4. `ROLLBACK TO SAVEPOINT sp_a;`

**Immediately after step 4 (before `Session 1` commits), what is the lock status of rows `prod_id = 1` and `prod_id = 2`?**

* A. Both `prod_id = 1` and `prod_id = 2` remain locked by `Session 1`
* B. Both `prod_id = 1` and `prod_id = 2` are unlocked
* C. Row `prod_id = 1` REMAINS LOCKED by `Session 1`, while row `prod_id = 2` IS UNLOCKED (other sessions can immediately update `prod_id = 2`)
* D. Row `prod_id = 2` remains locked, while `prod_id = 1` is unlocked

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Rolling back to savepoint `sp_a` undoes all DML changes and **releases all locks acquired after `sp_a`** (unlocking `prod_id = 2`), while preserving changes and locks acquired prior to `sp_a` (`prod_id = 1` stays locked).
</details>

---

### Question 22
**Two sessions concurrently insert into the `CUSTOMERS` table, which has a `UNIQUE` constraint on `EMAIL` (and `'admin@vnpt.vn'` does not yet exist in the table):**
* **At `T1`:** `Session 1` runs `INSERT INTO customers(id, email) VALUES (1, 'admin@vnpt.vn');` (Uncommitted).
* **At `T2`:** `Session 2` runs `INSERT INTO customers(id, email) VALUES (2, 'admin@vnpt.vn');`.

**What happens to `Session 2`'s statement at time `T2`?**

* A. `Session 2` immediately fails with `ORA-00001: unique constraint violated` at `T2` even though `Session 1` has not committed
* B. `Session 2` **waits (is blocked on a `TX` lock in mode 4)** at `T2` until `Session 1` finishes: if `Session 1` executes `COMMIT`, `Session 2` then raises `ORA-00001`; if `Session 1` executes `ROLLBACK`, `Session 2`'s `INSERT` proceeds and succeeds!
* C. Both statements succeed because the `id` values (`1` and `2`) are different
* D. `Session 1` is rolled back to let `Session 2` succeed

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** Because `Session 1` has not yet committed or rolled back, Oracle cannot immediately determine whether `'admin@vnpt.vn'` will permanently exist. Therefore, `Session 2` **blocks waiting on the unique index entry (`TX` lock mode 4)**. If `Session 1` commits, `Session 2` raises `ORA-00001`; if `Session 1` rolls back, `Session 2` acquires the lock and completes its `INSERT` successfully!
</details>

---

### Question 23
**How can two concurrent threads transferring money between bank accounts (e.g., Thread 1 transfers from Account `A` to `B`, while Thread 2 simultaneously transfers from Account `B` to `A`) completely prevent `Deadlocks (ORA-00060)`?**

* A. Always acquire row locks (`SELECT ... FOR UPDATE` or `UPDATE`) in a **consistent, deterministic order** across all threads (e.g., always lock the lower `account_id` first and the higher `account_id` second, or use `WHERE account_id IN (:acc1, :acc2) ORDER BY account_id FOR UPDATE`)
* B. Increase disk storage capacity
* C. Create 5 Bitmap indexes on the `ACCOUNTS` table
* D. Omit the `WHERE` clause from `UPDATE` statements

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **A**
* **Detailed Explanation:**
  * **A is correct:** Deadlocks occur when sessions lock resources in opposing orders. Enforcing a strict global locking order (such as ascending `account_id`) ensures that Thread 2 waits for Account `A` before locking Account `B`, making circular wait conditions impossible.
</details>

---

### Question 24
**Where is the row-level lock (`TX` lock) information for a modified row physically stored in Oracle Database?**

* A. In the `PLAN_TABLE`
* B. In the `Shared Pool` (Library Cache)
* C. Directly inside the **Data Block** containing the row (specifically in an **ITL - Interested Transaction List** slot in the block header and the lock byte in the row header)
* D. In an external `.txt` file in the OS directory

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **C**
* **Detailed Explanation:**
  * **C is correct:** Oracle stores row lock information directly inside the **Data Block** itself: the block header contains the **Interested Transaction List (ITL)**, and each locked row's header has a lock byte pointing to the ITL slot of the transaction holding the lock.
</details>

---

### Question 25
**Which initialization parameter in Oracle Database specifies the minimum target time (in seconds) that the system attempts to retain committed undo data to support long-running `SELECT` queries and Flashback Query (preventing `ORA-01555`)?**

* A. `DB_BLOCK_SIZE`
* B. `UNDO_RETENTION`
* C. `OPEN_CURSORS`
* D. `NLS_DATE_FORMAT`

<details>
<summary><b>👉 View Answer & Detailed Explanation</b></summary>

* **Correct Answer:** **B**
* **Detailed Explanation:**
  * **B is correct:** The **`UNDO_RETENTION`** parameter specifies the target duration in seconds for which Oracle retains committed undo information in the Undo Tablespace before allowing it to be overwritten.
</details>

---
