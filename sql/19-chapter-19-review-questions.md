# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 19: Transaction và Concurrency Nâng Cao

> **Tài liệu tham chiếu:** *OCA/OCP Oracle Database SQL Exam Guide (Exam 1Z0-071)* & *Oracle Database Concepts (Data Concurrency and Consistency)*.  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle OCA/OCP & Tuyển dụng VNPT/Viettel/Banking kèm phân tích chuyên sâu.  
> **Cách học:** Tự đọc đề và chọn đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và nắm vững các bẫy thi.

---

### Câu 1 (Question 1)
**Trong Oracle Database, những mức cô lập giao dịch (Transaction Isolation Levels) nào được hỗ trợ trực tiếp thông qua lệnh `SET TRANSACTION`? (Chọn tất cả các đáp án đúng)**

* A. `READ UNCOMMITTED`
* B. `READ COMMITTED`
* C. `REPEATABLE READ`
* D. `SERIALIZABLE`
* E. `READ ONLY`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, D, E**
* **Giải thích chuyên sâu:**
  * **B, D, E đúng:** Oracle Database hỗ trợ đúng 3 chế độ cô lập giao dịch thông qua câu lệnh `SET TRANSACTION`:
    1. `SET TRANSACTION ISOLATION LEVEL READ COMMITTED;` (Mức mặc định của Oracle).
    2. `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;`
    3. `SET TRANSACTION READ ONLY;`
  * **A sai:** Oracle **không bao giờ cho phép đọc bẩn (Dirty Read)** nên không hỗ trợ `READ UNCOMMITTED`.
  * **C sai:** Oracle không có từ khóa `REPEATABLE READ` (chế độ `SERIALIZABLE` của Oracle đã bao hàm cả việc ngăn chặn Non-Repeatable Read lẫn Phantom Read).
</details>

---

### Câu 2 (Question 2)
**Giả sử bảng `ACCOUNTS` có dòng `account_id = 101` với `balance = 5000`. Tại thời điểm `T1`, `Session 1` thực hiện câu lệnh `UPDATE accounts SET balance = 9000 WHERE account_id = 101;` nhưng CHƯA `COMMIT`. Tại thời điểm `T2`, `Session 2` (ở chế độ mặc định `READ COMMITTED`) thực hiện câu lệnh dưới đây. Kết quả mà `Session 2` nhận được là gì?**

```sql
SELECT balance FROM accounts WHERE account_id = 101;
```

* A. `Session 2` bị treo (đứng chờ) cho đến khi `Session 1` thực hiện `COMMIT` hoặc `ROLLBACK`
* B. `Session 2` trả về ngay lập tức giá trị `9000`
* C. `Session 2` trả về ngay lập tức giá trị `5000` (được dựng lại từ dữ liệu Before Image trong Undo Segment) mà không hề bị chờ khóa
* D. `Session 2` nhận lỗi `ORA-00054: resource busy`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Theo nguyên lý **Multi-Version Read Consistency (MVCC)** của Oracle: *"Writers never block Readers"*. Khi `Session 2` thực hiện `SELECT` thông thường (không có `FOR UPDATE`), thấy block dữ liệu chứa `account_id = 101` đang có giao dịch chưa `COMMIT`, Oracle sẽ tự động đọc bản ảnh trước khi sửa (**Before Image**: `balance = 5000`) từ **Undo Segment** để trả kết quả ngay lập tức cho `Session 2`.
  * **A, D sai:** Câu lệnh `SELECT` thông thường không bao giờ yêu cầu khóa dòng nên không bị chặn hay báo lỗi `ORA-00054`.
  * **B sai:** Trả về `9000` khi `Session 1` chưa `COMMIT` là hiện tượng *Dirty Read* — điều không bao giờ xảy ra trong Oracle.
</details>

---

### Câu 3 (Question 3)
**Nguyên nhân gốc rễ nào dẫn đến lỗi kinh điển `ORA-01555: snapshot too old` khi một câu lệnh `SELECT` đang chạy?**

* A. Do câu lệnh `SELECT` cố gắng sửa đổi dữ liệu trong chế độ `READ ONLY`
* B. Do vùng nhớ Shared Pool bị đầy không thể thực hiện Hard Parse
* C. Do câu lệnh `SELECT` chạy kéo dài cần đọc lại bản ảnh dữ liệu cũ (Before Image) tại thời điểm `Query SCN` lúc bắt đầu câu lệnh, nhưng các khối dữ liệu cũ đó trong **Undo Tablespace** đã bị ghi đè bởi các giao dịch khác sau khi các giao dịch đó đã `COMMIT`
* D. Do hai phiên làm việc khóa chéo nhau tạo thành vòng lặp Deadlock

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Để đảm bảo **Statement-Level Read Consistency**, một câu lệnh `SELECT` bắt đầu tại `SCN = X` phải nhìn thấy toàn bộ dữ liệu đúng tại mốc `SCN = X`. Nếu trong lúc câu lệnh `SELECT` đang chạy chậm, các giao dịch khác `UPDATE` dữ liệu và **`COMMIT`**, các bản ghi Undo tương ứng chuyển sang trạng thái có thể tái sử dụng. Nếu Undo Tablespace nhỏ hoặc `UNDO_RETENTION` thấp (hoặc lập trình viên `COMMIT` ngay trong vòng lặp Cursor), dữ liệu Undo đó bị ghi đè. Khi câu lệnh `SELECT` đọc tới block đó và tìm vào Undo để dựng lại bản ảnh tại `SCN = X` mà không còn thấy nữa, Oracle sẽ quăng lỗi **`ORA-01555: snapshot too old`**.
</details>

---

### Câu 4 (Question 4)
**Hai phiên làm việc (`Session 1` và `Session 2`) thực hiện chuỗi câu lệnh theo đúng thứ tự thời gian dưới đây. Chuyện gì sẽ xảy ra ở bước cuối cùng (`T4`) của `Session 1`?**

```sql
-- [T1] Session 1:
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SELECT salary FROM employees WHERE employee_id = 200; -- Kết quả: 4400

-- [T2] Session 2:
UPDATE employees SET salary = 5000 WHERE employee_id = 200;
COMMIT;

-- [T3] Session 1:
SELECT salary FROM employees WHERE employee_id = 200; -- Kết quả vẫn là: 4400

-- [T4] Session 1:
UPDATE employees SET salary = 6000 WHERE employee_id = 200;
```

* A. Câu lệnh `UPDATE` ở `[T4]` chạy thành công và cập nhật `salary` thành `6000`
* B. `Session 1` bị treo vĩnh viễn tại `[T4]` dù `Session 2` đã `COMMIT`
* C. Câu lệnh `UPDATE` ở `[T4]` lập tức thất bại và văng lỗi `ORA-08177: can't serialize access for this transaction`
* D. Câu lệnh `UPDATE` ở `[T4]` văng lỗi `ORA-01555: snapshot too old`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong chế độ cô lập **`SERIALIZABLE`**, giao dịch của `Session 1` chỉ được phép cập nhật một dòng dữ liệu nếu dòng đó **chưa hề bị bất kỳ giao dịch nào khác sửa đổi và `COMMIT`** kể từ thời điểm giao dịch `SERIALIZABLE` của `Session 1` bắt đầu (`[T1]`). Vì tại `[T2]`, `Session 2` đã sửa dòng `employee_id = 200` và `COMMIT`, nên khi `Session 1` cố tình `UPDATE` chính dòng đó tại `[T4]`, Oracle lập tức từ chối và báo lỗi **`ORA-08177: can't serialize access for this transaction`**.
</details>

---

### Câu 5 (Question 5)
**Khi một giao dịch rơi vào tình trạng `Deadlock` (Khóa chết chéo) và Oracle Database ném ra lỗi `ORA-00060: deadlock detected while waiting for resource` cho một trong hai phiên làm việc, Oracle sẽ tự động thực hiện hành động Rollback ở phạm vi nào?**

* A. Tự động `ROLLBACK` toàn bộ giao dịch (Transaction-level Rollback) của cả hai phiên làm việc và giải phóng tất cả các khóa
* B. Tự động `ROLLBACK` toàn bộ giao dịch của phiên nhận lỗi `ORA-00060`
* C. Chỉ tự động `ROLLBACK` duy nhất **câu lệnh DML hiện tại (Statement-level Rollback)** đã gây ra việc phát hiện Deadlock; toàn bộ các câu lệnh DML chạy trước đó trong cùng giao dịch của phiên nhận lỗi vẫn được giữ nguyên và phiên đó vẫn đang nắm giữ các khóa cũ!
* D. Tự động tắt (Shutdown) Database Instance để bảo vệ dữ liệu

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là bẫy thi OCA/OCP rất nổi tiếng! Khi phát hiện Deadlock (`ORA-00060`), Oracle **KHÔNG rollback toàn bộ giao dịch (Transaction)** của phiên bị chọn làm nạn nhân, mà chỉ thực hiện **Statement-Level Rollback** (hủy đúng câu lệnh đang bị kẹt cuối cùng để phá vỡ vòng tròn chờ đợi). Các câu lệnh DML trước đó của phiên nhận lỗi vẫn còn hiệu lực và các khóa dòng (`TX Lock`) từ các bước trước vẫn bị giữ. Do đó, ứng dụng nhận lỗi `ORA-00060` cần chủ động gọi lệnh `ROLLBACK;` (hoặc `COMMIT;`) để giải phóng dứt điểm các khóa còn lại.
</details>

---

### Câu 6 (Question 6)
**Bảng `DEPARTMENTS (department_id PK)` là bảng cha và bảng `EMPLOYEES (department_id FK)` là bảng con. Cột khóa ngoại `EMPLOYEES.department_id` CHƯA được đánh Index. Điều gì sẽ xảy ra khi một phiên làm việc thực thi câu lệnh: `DELETE FROM departments WHERE department_id = 90;` (chưa `COMMIT`)?**

* A. Chỉ có dòng `department_id = 90` trên bảng `DEPARTMENTS` bị khóa, bảng `EMPLOYEES` hoàn toàn không bị ảnh hưởng gì
* B. Do cột khóa ngoại không có Index, Oracle sẽ đặt khóa cấp bảng (`TM Lock` ở chế độ Share / Share Sub-Exclusive) lên **TOÀN BỘ bảng con `EMPLOYEES`**, khiến mọi thao tác `INSERT`, `UPDATE`, `DELETE` trên bất kỳ phòng ban nào của bảng `EMPLOYEES` từ các phiên khác đều bị chặn đứng!
* C. Oracle tự động tạo một B-Tree Index trên cột `EMPLOYEES.department_id` ngay lúc chạy lệnh `DELETE`
* D. Oracle báo lỗi không cho phép xóa bảng cha nếu bảng con không có Index

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi xóa (`DELETE`) một dòng ở bảng cha hoặc cập nhật (`UPDATE`) giá trị cột khóa chính của bảng cha, nếu cột Foreign Key ở bảng con **không có Index**, Oracle buộc phải khóa toàn bộ bảng con (`TM Lock` mode 4 `Share` hoặc mode 5 `SSX`) trong suốt thời gian thực thi câu lệnh để ngăn các phiên khác chèn dòng con mới vi phạm tham chiếu, đồng thời phải quét `TABLE ACCESS FULL` bảng con để kiểm tra dòng con tồn tại. Nếu đánh Index trên cột Foreign Key (`EMPLOYEES.department_id`), hiện tượng khóa toàn bảng con này sẽ được loại bỏ hoàn toàn!
</details>

---

### Câu 7 (Question 7)
**Quan sát câu lệnh `SELECT ... FOR UPDATE` có kết nối (`JOIN`) hai bảng dưới đây. Khi câu lệnh này chạy thành công, những dòng dữ liệu nào sẽ bị đặt khóa độc quyền (`TX Lock`)?**

```sql
SELECT e.employee_id, e.last_name, e.salary, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id
WHERE e.department_id = 60
FOR UPDATE;
```

* A. Chỉ các dòng thỏa mãn điều kiện trong bảng `EMPLOYEES` bị khóa
* B. Chỉ dòng `department_id = 60` trong bảng `DEPARTMENTS` bị khóa
* C. Cả các dòng nhân viên thuộc phòng `60` trong bảng `EMPLOYEES` VÀ dòng phòng ban `60` trong bảng `DEPARTMENTS` đều bị khóa!
* D. Không có dòng nào bị khóa vì `FOR UPDATE` không có tác dụng khi dùng `JOIN`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khi sử dụng mệnh đề **`FOR UPDATE` không kèm `OF column_name`** trong một câu truy vấn kết nối (`JOIN`) nhiều bảng, Oracle sẽ đặt khóa dòng (`TX Lock`) lên **tất cả các dòng tham gia tạo nên tập kết quả ở TẤT CẢ các bảng trong mệnh đề `FROM`** (cả bảng `EMPLOYEES` lẫn bảng `DEPARTMENTS`).
</details>

---

### Câu 8 (Question 8)
**Tiếp tục tình huống ở Câu 7: Nếu lập trình viên sửa dòng cuối của câu truy vấn thành `FOR UPDATE OF e.salary NOWAIT;` như dưới đây, thì những dòng nào sẽ bị khóa?**

```sql
SELECT e.employee_id, e.last_name, e.salary, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id
WHERE e.department_id = 60
FOR UPDATE OF e.salary NOWAIT;
```

* A. Chỉ khóa riêng ô dữ liệu của cột `salary` (các cột khác trên cùng dòng của bảng `EMPLOYEES` vẫn cho phép Session khác sửa)
* B. Chỉ khóa các dòng thỏa mãn điều kiện của bảng `EMPLOYEES` (bảng có chứa cột `e.salary`), còn dòng của bảng `DEPARTMENTS` KHÔNG bị khóa
* C. Chỉ khóa bảng `DEPARTMENTS`, không khóa bảng `EMPLOYEES`
* D. Khóa toàn bộ tất cả các dòng của cả hai bảng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Mệnh đề `FOR UPDATE OF e.salary` sử dụng tên cột `e.salary` để chỉ định cho Oracle biết **chỉ đặt khóa dòng (Row-level lock) lên bảng nào sở hữu cột đó** — tức là chỉ khóa các dòng thỏa mãn của bảng `EMPLOYEES`, còn bảng `DEPARTMENTS` không bị khóa!
  * **A sai (Bẫy thi phổ biến):** Trong Oracle chỉ có khóa cấp độ dòng (Row-level lock), **không có khóa cấp độ cột (Column-level lock)**. Toàn bộ dòng nhân viên thuộc bảng `EMPLOYEES` sẽ bị khóa, chứ không phải chỉ riêng cột `salary`.
</details>

---

### Câu 9 (Question 9)
**Trong một hệ thống xử lý đơn hàng đa luồng (Multi-threaded Workers), có 10 Worker cùng truy vấn bảng `ORDER_QUEUE` để lấy ra các đơn hàng có `status = 'NEW'` nhằm xử lý song song mà không bị trùng lặp và không phải đứng chờ nhau. Mệnh đề nào sau đây là giải pháp tối ưu nhất trong Oracle?**

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
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Mệnh đề **`FOR UPDATE SKIP LOCKED`** chỉ dẫn cho Oracle: khi quét qua các dòng thỏa mãn điều kiện `WHERE`, nếu gặp dòng nào đang bị một Worker khác khóa thì **bỏ qua ngay dòng đó (không chờ và không báo lỗi)** để tìm và khóa những dòng tiếp theo đang rảnh. Đây là cơ chế nền tảng của Oracle Advanced Queuing (AQ) và các hệ thống xử lý hàng đợi hiệu năng cao.
  * **A sai:** `NOWAIT` sẽ ném lỗi `ORA-00054` ngay khi đụng phải dòng đầu tiên đang bị Worker khác khóa.
  * **B sai:** `WAIT 60` bắt các Worker phải đứng đợi nhau suốt 60 giây thay vì lấy việc khác làm ngay.
  * **D sai:** `CASCADE` không phải là cú pháp hợp lệ của `FOR UPDATE`.
</details>

---

### Câu 10 (Question 10)
**Chuyện gì sẽ xảy ra khi một giao dịch trong Oracle thực hiện câu lệnh `UPDATE` làm khóa 5,000,000 (5 triệu) dòng trong một bảng có 20 triệu dòng?**

* A. Do số lượng khóa dòng vượt quá ngưỡng bộ nhớ RAM, Oracle tự động thực hiện **Lock Escalation** (nâng cấp từ khóa dòng thành khóa độc quyền toàn bộ bảng `EXCLUSIVE TABLE LOCK`)
* B. Oracle **KHÔNG BAO GIỜ thực hiện Lock Escalation**; 5 triệu dòng đó vẫn chỉ bị khóa ở cấp độ dòng (`TX Lock` lưu trực tiếp trong từng Data Block) và 15 triệu dòng còn lại trong bảng vẫn cho phép các Session khác `UPDATE/DELETE` hoàn toàn bình thường
* C. Oracle báo lỗi `ORA-04031: unable to allocate shared memory` do hết RAM lưu khóa
* D. Oracle tự động `COMMIT` sau mỗi 10,000 dòng để giải phóng khóa

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong kiến trúc Oracle Database, thông tin khóa dòng (`TX Lock`) không được lưu trong một bảng quản lý khóa tập trung trên RAM như một số RDBMS khác, mà được ghi trực tiếp vào **Data Block Header (ITL - Interested Transaction List)** và byte khóa trên từng dòng. Do đó, dù khóa 1 dòng hay 5 triệu dòng cũng không làm tràn bộ nhớ quản lý khóa, và **Oracle KHÔNG BAO GIỜ có hiện tượng Lock Escalation** (không bao giờ biến Row Locks thành Table Lock).
</details>

---

### Câu 11 (Question 11)
**Một lập trình viên thực hiện tuần tự các câu lệnh sau trong cùng một phiên làm việc. Tại câu lệnh nào Oracle sẽ báo lỗi và vì sao?**

```sql
-- Dòng 1:
INSERT INTO logs(log_id, message) VALUES (1, 'Start job');
-- Dòng 2:
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- Dòng 3:
UPDATE accounts SET balance = balance + 100 WHERE account_id = 10;
-- Dòng 4:
COMMIT;
```

* A. Lỗi tại Dòng 1 vì chưa khai báo `BEGIN TRANSACTION`
* B. Lỗi tại Dòng 2 (`ORA-01453: SET TRANSACTION must be first statement of transaction`) vì lệnh `SET TRANSACTION` bắt buộc phải là câu lệnh đầu tiên của giao dịch, không được gọi sau khi đã thực hiện DML (`INSERT`)
* C. Lỗi tại Dòng 3 vì chế độ `SERIALIZABLE` không cho phép thực hiện lệnh `UPDATE`
* D. Không có dòng nào bị lỗi, cả 4 dòng chạy thành công

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong Oracle, một giao dịch tự động bắt đầu ngay khi câu lệnh DML đầu tiên (`INSERT` ở Dòng 1) được thực thi. Lệnh **`SET TRANSACTION`** thiết lập mức cô lập hoặc chế độ chỉ đọc cho toàn bộ giao dịch, nên nó **bắt buộc phải được gọi đầu tiên** trước bất kỳ lệnh DML hay `SELECT ... FOR UPDATE` nào trong giao dịch đó. Gọi ở Dòng 2 (sau `INSERT`) sẽ lập tức bị lỗi `ORA-01453`.
</details>

---

### Câu 12 (Question 12)
**Khi một phiên làm việc đã thiết lập chế độ `SET TRANSACTION READ ONLY;`, những câu lệnh nào dưới đây ĐƯỢC PHÉP thực thi thành công bên trong giao dịch đó?**

* A. `SELECT` (không có mệnh đề `FOR UPDATE`) trên bất kỳ bảng nào
* B. `SELECT ... FOR UPDATE`
* C. `INSERT`, `UPDATE`, `DELETE` và `MERGE`
* D. `TRUNCATE TABLE`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Chế độ `SET TRANSACTION READ ONLY;` cung cấp tính nhất quán đọc mức giao dịch (**Transaction-Level Read Consistency** - mọi câu lệnh `SELECT` trong giao dịch đều nhìn thấy dữ liệu tại cùng một mốc SCN lúc bắt đầu giao dịch) và chỉ cho phép thực hiện các truy vấn `SELECT` thuần túy.
  * **B, C, D sai:** Mọi thao tác sửa đổi dữ liệu hoặc đặt khóa dòng như `INSERT`, `UPDATE`, `DELETE`, `MERGE`, `SELECT ... FOR UPDATE`, hay DDL trong giao dịch `READ ONLY` đều sẽ bị từ chối với lỗi `ORA-01456: may not perform insert/delete/update operation inside a READ ONLY transaction`.
</details>

---

### Câu 13 (Question 13)
**Trong khi `Session 1` đang thực hiện câu lệnh `UPDATE employees SET salary = 8000 WHERE employee_id = 105;` (chưa `COMMIT`), `Session 2` cố gắng thực thi lệnh DDL: `ALTER TABLE employees DROP COLUMN commission_pct;`. Chuyện gì sẽ xảy ra với câu lệnh của `Session 2`?**

* A. Câu lệnh `ALTER TABLE` của `Session 2` xóa cột thành công ngay lập tức và tự động `COMMIT` giùm `Session 1`
* B. Nhờ khóa cấp bảng `TM Lock (Row Exclusive - RX)` mà `Session 1` đang nắm giữ trên bảng `EMPLOYEES`, câu lệnh DDL của `Session 2` bị từ chối và báo lỗi `ORA-00054: resource busy and acquire with NOWAIT specified or timeout expired`
* C. Câu lệnh của `Session 1` bị hủy bỏ để nhường quyền ưu tiên cho lệnh DDL của `Session 2`
* D. Bảng `EMPLOYEES` bị xóa khỏi Database

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây chính là vai trò cốt lõi của **`TM Lock` (DML Table-Level Lock)**. Khi `Session 1` sửa 1 dòng trong bảng `EMPLOYEES`, ngoài khóa dòng `TX Lock` trên dòng `105`, nó còn giữ một khóa `TM Lock` chế độ `RX` trên bảng `EMPLOYEES`. Khóa `TM` này ngăn không cho bất kỳ Session nào khác chiếm khóa độc quyền cấu trúc bảng để chạy các lệnh DDL phá hủy (như `DROP TABLE`, `TRUNCATE`, `ALTER TABLE ... DROP COLUMN`). Mặc định các lệnh DDL chạy với chế độ `NOWAIT`, nên `Session 2` sẽ lập tức nhận lỗi `ORA-00054`.
</details>

---

### Câu 14 (Question 14)
**Hai giao dịch viên ngân hàng cùng lúc mở màn hình thông tin của khách hàng `ID = 500` (có số dư ban đầu là `10,000,000đ`). Người thứ nhất thực hiện lưu thông tin cập nhật số dư thành `12,000,000đ` và `COMMIT`. Hai giây sau, người thứ hai (vẫn đang nhìn màn hình cũ có số dư `10,000,000đ`) bấm lưu cập nhật số dư thành `9,000,000đ` và `COMMIT`, làm mất hoàn toàn giao dịch cộng 2 triệu của người thứ nhất. Hiện tượng này trong cơ sở dữ liệu được gọi là gì?**

* A. Dirty Read (Đọc bẩn)
* B. Phantom Read (Đọc bóng ma)
* C. Lost Update (Mất dữ liệu cập nhật)
* D. Snapshot Too Old

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** **Lost Update (Mất dữ liệu cập nhật)** xảy ra khi hai giao dịch cùng đọc một giá trị gốc từ DB, sau đó giao dịch 1 cập nhật và `COMMIT`, rồi giao dịch 2 tiếp tục cập nhật đè lên dựa trên giá trị gốc cũ mà không kiểm tra xem dòng dữ liệu đã bị thay đổi kể từ lúc mình đọc hay chưa.
</details>

---

### Câu 15 (Question 15)
**Để phòng chống triệt để hiện tượng `Lost Update` trong các ứng dụng Web / RESTful API (nơi không thể giữ kết nối DB và không thể giữ khóa `SELECT ... FOR UPDATE` giữa các lần gọi HTTP Request), kỹ thuật `Optimistic Locking` (Khóa lạc quan) được triển khai như thế nào?**

* A. Khóa toàn bộ bảng bằng lệnh `LOCK TABLE accounts IN EXCLUSIVE MODE` mỗi khi có người dùng đăng nhập
* B. Bổ sung một cột định danh phiên bản (như `VERSION NUMBER` hoặc `LAST_UPDATED TIMESTAMP`); khi cập nhật sẽ kèm điều kiện `WHERE id = :id AND version = :old_version` đồng thời tăng `version = version + 1`. Nếu số dòng cập nhật được bằng `0`, báo lỗi dữ liệu đã bị thay đổi bởi người khác
* C. Tắt toàn bộ ràng buộc `PRIMARY KEY` của bảng
* D. Luôn thực hiện `ROLLBACK` sau mỗi câu lệnh `UPDATE`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** **Optimistic Locking** không giữ khóa DB trong lúc người dùng đang xem dữ liệu trên trình duyệt. Thay vào đó, lúc đọc dữ liệu ra, ứng dụng lưu lại số `version` (ví dụ `version = 5`). Lúc người dùng bấm Lưu, câu lệnh `UPDATE` kiểm tra `WHERE id = :id AND version = 5` và tăng `SET version = 6`. Nếu có người khác đã nhanh tay sửa trước đó (làm `version` trong DB nhảy lên `6`), câu lệnh `UPDATE` sẽ khớp `0` dòng (`SQL%ROWCOUNT = 0`), giúp ứng dụng phát hiện xung đột ngay lập tức mà không ghi đè làm mất dữ liệu!
</details>

---

### Câu 16 (Question 16)
**Trong Oracle Database, cột giả (Pseudocolumn) nào có thể được sử dụng để lấy mã System Change Number (SCN) gần nhất mà dòng dữ liệu (hoặc block chứa dòng dữ liệu) được `COMMIT`, hỗ trợ đắc lực cho kỹ thuật Optimistic Locking mà không cần tự thêm cột `VERSION` thủ công?**

* A. `ROWNUM`
* B. `ROWID`
* C. `ORA_ROWSCN` (đặc biệt chính xác ở cấp độ từng dòng khi bảng được tạo với từ khóa `ROWDEPENDENCIES`)
* D. `LEVEL`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Cột giả **`ORA_ROWSCN`** trả về mốc SCN của lần `COMMIT` gần nhất tác động lên dữ liệu.
    * Mặc định (`NOROWDEPENDENCIES`), Oracle lưu SCN ở cấp độ **Block Header**, nên `ORA_ROWSCN` là SCN mới nhất của cả Data Block đó.
    * Khi tạo bảng với tùy chọn **`CREATE TABLE ... ROWDEPENDENCIES`**, Oracle lưu mốc SCN riêng biệt trên **từng dòng dữ liệu (Row-level SCN)** (tốn thêm 6 bytes mỗi dòng), cho phép dùng `WHERE ORA_ROWSCN = :old_scn` để kiểm tra Optimistic Locking chính xác tuyệt đối trên từng dòng!
</details>

---

### Câu 17 (Question 17)
**Tại sao đoạn mã PL/SQL xử lý dữ liệu lớn dưới đây lại là một phản mẫu (Anti-Pattern) cực kỳ nguy hiểm trong Oracle Database? (Chọn 2 đáp án đúng)**

```sql
DECLARE
    CURSOR c_emp IS SELECT employee_id, salary FROM employees WHERE department_id = 50;
BEGIN
    FOR r IN c_emp LOOP
        UPDATE employees SET salary = r.salary * 1.05 WHERE employee_id = r.employee_id;
        COMMIT; -- Commit ngay bên trong vòng lặp!
    END LOOP;
END;
/
```

* A. Việc gọi `COMMIT` bên trong vòng lặp Cursor đang mở trên chính bảng bị `UPDATE` sẽ giải phóng các phân đoạn Undo đang cần thiết để duy trì Read Consistency cho Cursor `c_emp`, rất dễ gây ra lỗi **`ORA-01555: snapshot too old`**
* B. Gọi `COMMIT` lặp đi lặp lại hàng chục nghìn lần buộc tiến trình `LGWR` (Log Writer) phải đồng bộ đĩa liên tục (`log file sync` wait event), làm hiệu năng chậm hơn hàng chục lần so với 1 câu lệnh `UPDATE` tập hợp (Set-based) và làm mất tính nguyên tử (Atomicity) của toàn bộ tiến trình
* C. PL/SQL cấm hoàn toàn từ khóa `COMMIT` bên trong khối `BEGIN ... END`
* D. Lệnh `COMMIT` trong vòng lặp sẽ tự động xóa bảng `EMPLOYEES`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B**
* **Giải thích chuyên sâu:**
  * **A đúng:** Đây gọi là lỗi **Fetch Across Commits**. Con trỏ `c_emp` cần đọc dữ liệu nhất quán tại mốc SCN lúc mở Cursor. Khi bạn vừa `UPDATE` bảng `EMPLOYEES` vừa `COMMIT` liên tục trong vòng lặp, bạn tự cho phép Oracle ghi đè lên chính các khối Undo của bảng `EMPLOYEES` mà con trỏ `c_emp` sẽ cần đọc ở các bước lặp tiếp theo $\rightarrow$ Gây lỗi `ORA-01555`.
  * **B đúng:** Mỗi lần `COMMIT` phát sinh sự kiện chờ đồng bộ I/O xuống Redo Log (`log file sync`), đồng thời nếu lỗi ở dòng thứ 5,000 thì 4,999 dòng trước đã `COMMIT` không thể `ROLLBACK` lại được. Giải pháp chuẩn là dùng duy nhất 1 lệnh `UPDATE employees SET salary = salary * 1.05 WHERE department_id = 50; COMMIT;`.
</details>

---

### Câu 18 (Question 18)
**Trong chế độ cô lập mặc định `READ COMMITTED` của Oracle, nếu `Session 1` thực hiện CÙNG một câu lệnh `SELECT salary FROM employees WHERE employee_id = 100;` ở hai thời điểm `T1` và `T3` trong cùng một giao dịch, và ở thời điểm `T2` (nằm giữa `T1` và `T3`), `Session 2` đã `UPDATE` lương của nhân viên `100` từ `5000` lên `8000` và `COMMIT`. Kết quả `Session 1` nhận được ở `T1` và `T3` là gì?**

* A. Cả `T1` và `T3` đều nhận được `5000`
* B. Ở `T1` nhận được `5000`, còn ở `T3` nhận được `8000` (Vì mỗi câu lệnh `SELECT` mới trong chế độ `READ COMMITTED` sẽ lấy mốc `Query SCN` mới tại thời điểm câu lệnh đó bắt đầu chạy, nên nhìn thấy dữ liệu đã `COMMIT` của `Session 2`)
* C. Ở `T3` bị báo lỗi `ORA-08177`
* D. Cả `T1` và `T3` đều nhận được `8000`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Chế độ mặc định **`READ COMMITTED`** cung cấp tính nhất quán ở cấp độ câu lệnh (**Statement-Level Read Consistency**). Mỗi câu lệnh `SELECT` sẽ chụp một bức ảnh nhất quán tại mốc SCN lúc câu lệnh đó bắt đầu:
    * Tại `T1` (`SCN = 100`): Lương đang là `5000`.
    * Tại `T2` (`SCN = 105`): `Session 2` cập nhật thành `8000` và `COMMIT`.
    * Tại `T3` (`SCN = 110`): Câu lệnh `SELECT` thứ hai của `Session 1` bắt đầu tại `SCN = 110` nên đọc được dữ liệu đã `COMMIT` mới nhất là `8000`. Hiện tượng đọc 2 lần trong cùng giao dịch ra 2 kết quả khác nhau này gọi là **Non-Repeatable Read (Fuzzy Read)**, vốn được phép xảy ra ở mức `READ COMMITTED` (nhưng bị chặn ở mức `SERIALIZABLE` / `READ ONLY`).
</details>

---

### Câu 19 (Question 19)
**Khi `Session 1` đang giữ khóa độc quyền trên dòng `order_id = 555`, `Session 2` chạy câu lệnh dưới đây. Chuyện gì sẽ xảy ra với `Session 2`?**

```sql
SELECT order_id, total_amount
FROM orders
WHERE order_id = 555
FOR UPDATE WAIT 5;
```

* A. `Session 2` bỏ qua dòng `555` và trả về tập rỗng ngay lập tức
* B. `Session 2` chờ tối đa 5 giây; nếu trong vòng 5 giây đó `Session 1` thực hiện `COMMIT` hoặc `ROLLBACK` thì `Session 2` chiếm được khóa và chạy tiếp; nếu hết 5 giây mà `Session 1` vẫn chưa nhả khóa thì `Session 2` văng lỗi `ORA-00054`
* C. `Session 2` tự động hủy giao dịch của `Session 1` sau 5 giây
* D. `Session 2` báo lỗi cú pháp vì sau `WAIT` không được phép viết số nguyên

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Mệnh đề `FOR UPDATE WAIT n` cho phép chỉ định thời gian chờ tối đa (tính bằng giây). Nếu lấy được khóa trước khi hết `n` giây, câu lệnh thực thi thành công; nếu hết `n` giây vẫn bị chặn, Oracle ném lỗi `ORA-00054: resource busy and acquire with NOWAIT specified or timeout expired`.
</details>

---

### Câu 20 (Question 20)
**Sự kiện nào sau đây sẽ giải phóng toàn bộ các khóa dòng (`TX Lock`) và khóa bảng (`TM Lock`) mà một giao dịch đang nắm giữ trong Oracle Database? (Chọn tất cả các đáp án đúng)**

* A. Thực thi lệnh `COMMIT;`
* B. Thực thi lệnh `ROLLBACK;` (không kèm `TO SAVEPOINT`)
* C. Thực thi lệnh `SAVEPOINT sp_1;`
* D. Thực thi một câu lệnh DDL (như `CREATE TABLE`, `ALTER TABLE`, `TRUNCATE TABLE`) vì lệnh DDL tự động phát sinh `COMMIT` ngầm định trước và sau khi nó chạy
* E. Thực thi lệnh `ROLLBACK TO SAVEPOINT sp_1;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B, D**
* **Giải thích chuyên sâu:**
  * **A, B, D đúng:** Toàn bộ các khóa của một giao dịch được giải phóng hoàn toàn khi giao dịch đó kết thúc — tức là khi gặp `COMMIT`, `ROLLBACK` toàn bộ giao dịch, chạy một lệnh DDL (gây Auto-commit), hoặc phiên làm việc thoát (`EXIT` / mất kết nối).
  * **C sai:** Tạo `SAVEPOINT` chỉ đánh dấu một mốc trong giao dịch, hoàn toàn không kết thúc giao dịch và không nhả bất kỳ khóa nào.
  * **E sai:** `ROLLBACK TO SAVEPOINT sp_1` chỉ giải phóng các khóa được tạo ra **sau** mốc `sp_1`, còn các khóa được tạo ra **trước** mốc `sp_1` trong giao dịch đó vẫn tiếp tục được giữ nguyên!
</details>

---

### Câu 21 (Question 21)
**Trong một giao dịch, `Session 1` thực hiện tuần tự các bước sau:**
1. `UPDATE products SET price = 100 WHERE prod_id = 1;`
2. `SAVEPOINT sp_a;`
3. `UPDATE products SET price = 200 WHERE prod_id = 2;`
4. `ROLLBACK TO SAVEPOINT sp_a;`

**Ngay sau bước 4 (khi `Session 1` chưa `COMMIT`), trạng thái khóa trên dòng `prod_id = 1` và dòng `prod_id = 2` như thế nào?**

* A. Cả hai dòng `prod_id = 1` và `prod_id = 2` đều vẫn bị `Session 1` khóa
* B. Cả hai dòng `prod_id = 1` và `prod_id = 2` đều đã được giải phóng khóa
* C. Dòng `prod_id = 1` VẪN BỊ KHÓA bởi `Session 1`, còn dòng `prod_id = 2` ĐÃ ĐƯỢC GIẢI PHÓNG KHÓA (các Session khác có thể sửa `prod_id = 2` ngay lập tức)
* D. Dòng `prod_id = 2` vẫn bị khóa, còn dòng `prod_id = 1` được giải phóng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khi thực hiện `ROLLBACK TO SAVEPOINT sp_a;`, mọi thay đổi dữ liệu và **mọi khóa phát sinh SAU mốc `sp_a`** (tức là khóa trên dòng `prod_id = 2` ở bước 3) đều được hoàn tác và **giải phóng ngay lập tức**. Trong khi đó, câu lệnh ở bước 1 (trước mốc `sp_a`) vẫn còn hiệu lực nên `Session 1` **vẫn tiếp tục giữ khóa `TX`** trên dòng `prod_id = 1`.
</details>

---

### Câu 22 (Question 22)
**Hai phiên làm việc cùng lúc thực thi lệnh `INSERT` vào bảng `CUSTOMERS` có cột `EMAIL` được gắn ràng buộc `UNIQUE` (chưa có dòng nào chứa `'admin@vnpt.vn'` trước đó):**
* **Tại `T1`:** `Session 1` chạy: `INSERT INTO customers(id, email) VALUES (1, 'admin@vnpt.vn');` (Chưa `COMMIT`).
* **Tại `T2`:** `Session 2` chạy: `INSERT INTO customers(id, email) VALUES (2, 'admin@vnpt.vn');`.

**Chuyện gì sẽ xảy ra với câu lệnh của `Session 2` tại thời điểm `T2`?**

* A. `Session 2` văng lỗi `ORA-00001: unique constraint violated` ngay lập tức tại thời điểm `T2` dù `Session 1` chưa `COMMIT`
* B. `Session 2` bị **đứng chờ (Blocked / Wait on TX Lock mode 4)** tại thời điểm `T2` cho đến khi `Session 1` quyết định: nếu `Session 1` `COMMIT` thì `Session 2` mới văng lỗi `ORA-00001`; ngược lại nếu `Session 1` `ROLLBACK` thì câu lệnh `INSERT` của `Session 2` sẽ tiếp tục chạy thành công!
* C. Cả hai câu lệnh đều thành công vì `id` khác nhau (`1` và `2`)
* D. `Session 1` bị hủy để nhường cho `Session 2`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là câu hỏi phân loại rất hay trong đề thi OCP! Khi `Session 1` chèn giá trị `'admin@vnpt.vn'` vào Unique Index nhưng chưa `COMMIT`, Oracle chưa thể kết luận chắc chắn giá trị này sẽ tồn tại vĩnh viễn hay sẽ bị `ROLLBACK`. Do đó, tại thời điểm `T2`, `Session 2` **không thể báo lỗi ngay mà phải đứng chờ khóa `TX` ( ở chế độ Share - Mode 4)** trên mục Unique Index đó:
    * Nếu sau đó `Session 1` **`COMMIT`** $\rightarrow$ Giá trị `'admin@vnpt.vn'` chính thức tồn tại $\rightarrow$ `Session 2` lập tức văng lỗi **`ORA-00001: unique constraint violated`**.
    * Nếu sau đó `Session 1` **`ROLLBACK`** $\rightarrow$ Mục khóa được giải phóng $\rightarrow$ `Session 2` chiếm khóa và **`INSERT` thành công**!
</details>

---

### Câu 23 (Question 23)
**Làm thế nào để hai luồng xử lý (Threads / Sessions) thực hiện chuyển tiền qua lại giữa các cặp tài khoản ngân hàng (ví dụ: Luồng 1 chuyển từ Tài khoản `A` sang `B`; cùng lúc đó Luồng 2 chuyển từ Tài khoản `B` sang `A`) mà KHÔNG BAO GIỜ xảy ra `Deadlock (ORA-00060)`?**

* A. Luôn đặt khóa (`SELECT ... FOR UPDATE` hoặc `UPDATE`) theo **cùng một thứ tự quy ước cố định** (ví dụ: luôn khóa tài khoản có `account_id` nhỏ hơn trước, rồi mới khóa tài khoản có `account_id` lớn hơn sau, hoặc dùng `WHERE account_id IN (:acc1, :acc2) ORDER BY account_id FOR UPDATE`)
* B. Tăng dung lượng ổ cứng chứa Database
* C. Tạo thêm 5 Bitmap Index trên bảng `ACCOUNTS`
* D. Không dùng mệnh đề `WHERE` khi `UPDATE`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Nguyên nhân duy nhất gây ra Deadlock giữa 2 giao dịch khóa dòng là **thứ tự lấy khóa ngược chiều nhau** (Luồng 1 khóa `A` rồi chờ `B`; Luồng 2 khóa `B` rồi chờ `A`). Khi ép mọi luồng trong ứng dụng luôn phải khóa các tài khoản theo thứ tự `account_id` tăng dần (luôn khóa `A` trước rồi mới khóa `B`), Luồng 2 sẽ xếp hàng chờ ngay tại bước xin khóa `A`, loại bỏ 100% khả năng xảy ra vòng lặp chờ chéo (Deadlock)!
</details>

---

### Câu 24 (Question 24)
**Thông tin khóa dòng (`TX Lock`) của mỗi dòng dữ liệu đang bị sửa đổi trong Oracle Database được lưu trữ vật lý ở đâu?**

* A. Trong bảng `PLAN_TABLE`
* B. Trong vùng nhớ `Shared Pool` (Library Cache)
* C. Lưu trực tiếp ngay bên trong chính **Data Block** chứa dòng dữ liệu đó (gồm khe giao dịch trong **ITL - Interested Transaction List** ở phần Header của Block và byte trỏ khóa trên từng Row Header)
* D. Trong một file văn bản `.txt` nằm ở thư mục cài đặt hệ điều hành

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Mỗi Data Block của Oracle có một vùng Header chứa danh sách các giao dịch đang thao tác trên block đó gọi là **ITL (Interested Transaction List)** (điều khiển bởi tham số `INITRANS` và `MAXTRANS`). Mỗi dòng dữ liệu trong block có 1 byte (`Lock Byte`) trỏ tới đúng số thứ tự khe ITL của giao dịch đang khóa dòng đó. Nhờ thiết kế lưu khóa ngay trên Data Block này, Oracle không tốn bộ nhớ RAM tỷ lệ thuận với số dòng bị khóa và không bao giờ cần Lock Escalation.
</details>

---

### Câu 25 (Question 25)
**Tham số khởi tạo nào trong Oracle Database quy định khoảng thời gian tối thiểu (tính bằng giây) mà hệ thống cố gắng giữ lại dữ liệu Undo cũ sau khi giao dịch đã `COMMIT` nhằm phục vụ các câu truy vấn `SELECT` chạy lâu và tính năng Flashback Query (tránh lỗi `ORA-01555`)?**

* A. `DB_BLOCK_SIZE`
* B. `UNDO_RETENTION`
* C. `OPEN_CURSORS`
* D. `NLS_DATE_FORMAT`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Tham số **`UNDO_RETENTION`** (ví dụ `UNDO_RETENTION = 3600` tương đương 1 giờ) xác định mục tiêu thời gian tối thiểu (bằng giây) mà Oracle giữ lại các bản ghi Undo đã `COMMIT` (`UNEXPIRED`) trước khi cho phép ghi đè. Để bắt buộc Oracle tuyệt đối không bao giờ ghi đè Undo trước thời hạn `UNDO_RETENTION` (ngay cả khi các lệnh DML mới bị báo lỗi thiếu chỗ), DBA có thể bật thêm thuộc tính `ALTER TABLESPACE undotbs1 RETENTION GUARANTEE;`.
</details>

---
