# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 10: DML và Quản Lý Giao Dịch (DML & Transaction Control)

> **Tài liệu tham chiếu:** *OCA/OCP Oracle Database SQL Exam Guide (Exam 1Z0-071)* & Đề thi sát hạch CNTT VNPT.  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết.  
> **Cách học:** Bạn hãy tự đọc đề và chọn đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và nắm vững bẫy thi.

---

### Câu 1 (Question 1)
**Bảng `DEPARTMENTS` có cấu trúc như sau: `DEPT_ID NUMBER(4) PRIMARY KEY`, `DEPT_NAME VARCHAR2(30) NOT NULL`, `MANAGER_ID NUMBER(6)`, `LOCATION_ID NUMBER(4) DEFAULT 1700`. Câu lệnh `INSERT` nào sau đây thực thi thành công?**

```sql
-- Cấu trúc bảng DEPARTMENTS:
-- DEPT_ID     NUMBER(4)     PRIMARY KEY
-- DEPT_NAME   VARCHAR2(30)  NOT NULL
-- MANAGER_ID  NUMBER(6)
-- LOCATION_ID NUMBER(4)     DEFAULT 1700
```

* A. `INSERT INTO departments VALUES (10, 'IT', DEFAULT);`
* B. `INSERT INTO departments (dept_id, dept_name, location_id) VALUES (10, 'IT', DEFAULT);`
* C. `INSERT INTO departments (dept_id, manager_id) VALUES (10, 100);`
* D. `INSERT INTO departments VALUES (10, 'IT', 100, 1800, NULL);`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Câu lệnh liệt kê tường minh 3 cột `(dept_id, dept_name, location_id)` và cung cấp đúng 3 giá trị tương ứng. Cột `manager_id` bị lược bỏ sẽ tự động nhận giá trị `NULL`, và từ khóa `DEFAULT` gán giá trị `1700` cho `location_id`.
  * **A sai:** Khi không liệt kê danh sách cột sau tên bảng, mệnh đề `VALUES` bắt buộc phải cung cấp đủ 4 giá trị tương ứng với 4 cột của bảng. Cung cấp 3 giá trị sẽ gây lỗi `ORA-00947: not enough values`.
  * **C sai:** Cột `dept_name` có ràng buộc `NOT NULL` và không có giá trị `DEFAULT`. Việc bỏ qua cột này trong danh sách cột sẽ khiến Oracle cố chèn `NULL` vào `dept_name` và báo lỗi `ORA-01400: cannot insert NULL into ("DEPARTMENTS"."DEPT_NAME")`.
  * **D sai:** Bảng chỉ có 4 cột nhưng `VALUES` truyền tới 5 giá trị, gây lỗi `ORA-00913: too many values`.
</details>

---

### Câu 2 (Question 2)
**Bạn muốn sao chép dữ liệu các nhân viên thuộc phòng ban `20` từ bảng `EMPLOYEES` sang bảng lưu trữ `EMP_ARCHIVE` (cả hai bảng đều có 3 cột `EMP_ID`, `FULL_NAME`, `SALARY`). Câu lệnh nào sau đây có cú pháp hợp lệ trong Oracle SQL?**

```sql
-- Bảng đích: EMP_ARCHIVE (emp_id, full_name, salary)
-- Bảng nguồn: EMPLOYEES (emp_id, full_name, salary, dept_id)
```

* A. `INSERT INTO emp_archive VALUES (SELECT emp_id, full_name, salary FROM employees WHERE dept_id = 20);`
* B. `INSERT INTO emp_archive (emp_id, full_name, salary) SELECT emp_id, full_name, salary FROM employees WHERE dept_id = 20;`
* C. `INSERT emp_archive SELECT emp_id, full_name, salary FROM employees WHERE dept_id = 20;`
* D. `INSERT INTO emp_archive AS SELECT emp_id, full_name, salary FROM employees WHERE dept_id = 20;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi chèn nhiều dòng từ một câu truy vấn con (`INSERT INTO ... SELECT`), ta nối trực tiếp câu lệnh `SELECT` ngay sau tên bảng (hoặc danh sách cột) mà không dùng từ khóa `VALUES` hay `AS`.
  * **A sai:** Dùng từ khóa `VALUES` trước một câu lệnh `SELECT` nhiều cột/nhiều dòng sẽ gây lỗi cú pháp `ORA-00936: missing expression`.
  * **C sai:** Trong lệnh `INSERT`, từ khóa `INTO` là bắt buộc (khác với lệnh `DELETE` nơi từ khóa `FROM` là tùy chọn).
  * **D sai:** Từ khóa `AS` chỉ dùng trong lệnh DDL `CREATE TABLE ... AS SELECT` (CTAS), không được dùng trong lệnh DML `INSERT INTO ... SELECT`.
</details>

---

### Câu 3 (Question 3)
**Cho bảng `EMP_SAL` đang chứa đúng 3 dòng dữ liệu với mức lương (`SALARY`) lần lượt là `1500`, `2500`, và `4000`. Các bảng đích `T_LOW`, `T_MID`, `T_HIGH` hiện đang rỗng. Sau khi thực thi câu lệnh `INSERT ALL` dưới đây, tổng cộng có bao nhiêu dòng được chèn vào cả 3 bảng đích?**

```sql
INSERT ALL
    WHEN salary <= 2500 THEN
        INTO t_low VALUES (emp_id, salary)
    WHEN salary BETWEEN 2000 AND 3500 THEN
        INTO t_mid VALUES (emp_id, salary)
    ELSE
        INTO t_high VALUES (emp_id, salary)
SELECT emp_id, salary FROM emp_sal;
```

* A. 3 dòng
* B. 4 dòng
* C. 5 dòng
* D. Câu lệnh báo lỗi vì một dòng không thể thỏa mãn hai nhánh `WHEN` cùng lúc

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Với `INSERT ALL` có điều kiện, Oracle kiểm tra **tất cả** các nhánh `WHEN` một cách độc lập cho từng dòng nguồn:
    * Dòng 1 (`salary = 1500`): Thỏa nhánh `WHEN salary <= 2500` (chèn 1 dòng vào `t_low`), không thỏa nhánh 2.
    * Dòng 2 (`salary = 2500`): Thỏa nhánh 1 `salary <= 2500` (chèn 1 dòng vào `t_low`) **VÀ** thỏa luôn nhánh 2 `salary BETWEEN 2000 AND 3500` (chèn thêm 1 dòng vào `t_mid`).
    * Dòng 3 (`salary = 4000`): Không thỏa cả hai nhánh `WHEN` trên nên rơi vào nhánh `ELSE` (chèn 1 dòng vào `t_high`).
    * Tổng số dòng được chèn là: `1 + 2 + 1 = 4` dòng.
  * **A, C, D sai:** Chỉ khi dùng `INSERT FIRST` thì tổng số dòng mới là 3 dòng (vì dòng `2500` sẽ dừng lại ngay sau khi khớp nhánh 1).
</details>

---

### Câu 4 (Question 4)
**Nếu thay từ khóa `INSERT ALL` ở Câu 3 bằng `INSERT FIRST` và giữ nguyên phần còn lại của câu lệnh trên cùng bộ dữ liệu (`1500`, `2500`, `4000`), bảng `T_MID` sẽ có bao nhiêu dòng được chèn vào?**

```sql
INSERT FIRST
    WHEN salary <= 2500 THEN
        INTO t_low VALUES (emp_id, salary)
    WHEN salary BETWEEN 2000 AND 3500 THEN
        INTO t_mid VALUES (emp_id, salary)
    ELSE
        INTO t_high VALUES (emp_id, salary)
SELECT emp_id, salary FROM emp_sal;
```

* A. 0 dòng
* B. 1 dòng
* C. 2 dòng
* D. 3 dòng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Với `INSERT FIRST`, Oracle đánh giá các nhánh `WHEN` từ trên xuống dưới và dừng lại ngay tại nhánh đầu tiên thỏa mãn:
    * Dòng `1500`: Khớp nhánh 1 (`salary <= 2500`) → vào `t_low` rồi dừng.
    * Dòng `2500`: Khớp nhánh 1 (`salary <= 2500`) → vào `t_low` rồi **dừng ngay lập tức**, bỏ qua nhánh 2 (`BETWEEN 2000 AND 3500`).
    * Dòng `4000`: Không khớp nhánh 1 và nhánh 2 → vào `ELSE` (`t_high`).
    * Do đó, không có bất kỳ dòng nào đi vào bảng `t_mid` (0 dòng).
  * **B, C, D sai:** Nhầm lẫn cơ chế khớp nhánh đầu tiên của `INSERT FIRST` với cơ chế đánh giá mọi nhánh của `INSERT ALL`.
</details>

---

### Câu 5 (Question 5)
**Xem xét câu lệnh Multi-table `INSERT` dưới đây. Tại sao câu lệnh này lại báo lỗi khi thực thi?**

```sql
INSERT ALL
    WHEN salary > 3000 THEN
        INTO high_earners VALUES (emp_id, full_name, salary)
    ELSE
        INTO regular_earners VALUES (emp_id, full_name, salary)
SELECT employee_id AS emp_id, last_name AS full_name, sal AS salary
FROM employees;
```

* A. Mệnh đề `ELSE` không được phép xuất hiện trong câu lệnh `INSERT ALL`.
* B. Không được sử dụng bí danh cột (Column Alias) trong câu lệnh `SELECT` của `INSERT ALL`.
* C. Câu lệnh không hề báo lỗi, nó thực thi hoàn toàn hợp lệ vì cả `WHEN` và `VALUES` đều đang sử dụng đúng tên Alias của `SELECT`.
* D. Thiếu từ khóa `THEN` ngay sau từ khóa `ELSE`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong câu lệnh Multi-table `INSERT`, khi câu truy vấn nguồn (`SELECT`) đặt bí danh (Alias) cho các cột (`employee_id AS emp_id`, `last_name AS full_name`, `sal AS salary`), thì các mệnh đề `WHEN` và `INTO ... VALUES` ở phía trên **bắt buộc phải tham chiếu theo tên Alias đó** (`emp_id`, `full_name`, `salary`). Câu lệnh trên đã tuân thủ hoàn toàn đúng quy tắc này và cú pháp `ELSE INTO ...` (không có `THEN` sau `ELSE`) là chuẩn xác.
  * **A, B sai:** Cả `ELSE` và Column Alias trong Subquery đều được hỗ trợ đầy đủ. Nếu ở phần `WHEN` hoặc `VALUES` ta viết tên cột gốc `sal` hay `employee_id` thì mới bị lỗi `ORA-00904: invalid identifier`.
  * **D sai:** Sau `WHEN condition` thì bắt buộc có `THEN`, nhưng sau `ELSE` thì đi thẳng vào `INTO` (viết `ELSE THEN` sẽ gây lỗi cú pháp).
</details>

---

### Câu 6 (Question 6)
**Bạn tạo một Sequence tên là `EMP_SEQ` bắt đầu từ `1` và tăng thêm `1` mỗi lần (`START WITH 1 INCREMENT BY 1`). Bảng `DEPARTMENTS` đang có `3` dòng. Bạn thực thi câu lệnh `INSERT ALL` sau đây vào hai bảng trống `TAB1(id)` và `TAB2(id)`. Các giá trị `id` nào sẽ được lưu trong `TAB1` và `TAB2`?**

```sql
INSERT ALL
    INTO tab1 VALUES (emp_seq.NEXTVAL)
    INTO tab2 VALUES (emp_seq.NEXTVAL)
SELECT dept_id FROM departments;
```

* A. `TAB1` chứa `(1, 3, 5)` và `TAB2` chứa `(2, 4, 6)`
* B. `TAB1` chứa `(1, 2, 3)` và `TAB2` chứa `(4, 5, 6)`
* C. Cả `TAB1` và `TAB2` đều chứa bộ giá trị giống hệt nhau là `(1, 2, 3)`
* D. Câu lệnh báo lỗi `ORA-02287: sequence number not allowed here`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong câu lệnh Multi-table `INSERT`, biểu thức `emp_seq.NEXTVAL` được đánh giá **một lần duy nhất cho mỗi dòng trả về từ câu truy vấn `SELECT` nguồn**, chứ không phải đánh giá riêng cho từng nhánh `INTO`! Vì `SELECT dept_id FROM departments` trả về 3 dòng:
    * Ở dòng thứ 1: `NEXTVAL` sinh ra `1` → chèn `1` vào `TAB1` và chèn luôn `1` vào `TAB2`.
    * Ở dòng thứ 2: `NEXTVAL` sinh ra `2` → chèn `2` vào `TAB1` và chèn luôn `2` vào `TAB2`.
    * Ở dòng thứ 3: `NEXTVAL` sinh ra `3` → chèn `3` vào `TAB1` và chèn luôn `3` vào `TAB2`.
  * **A, B, D sai:** Đây là bẫy kiến thức rất nổi tiếng của đề thi OCP khi kết hợp Sequence với `INSERT ALL`.
</details>

---

### Câu 7 (Question 7)
**Bảng `EMPLOYEES` có cột `SALARY NUMBER(8,2) NOT NULL` và đang có 100 nhân viên (từ `emp_id = 1` đến `100`). Bảng `BONUSES` chỉ chứa đúng 5 dòng của 5 nhân viên xuất sắc. Điều gì sẽ xảy ra khi bạn thực thi câu lệnh `UPDATE` dưới đây?**

```sql
UPDATE employees e
SET e.salary = (
    SELECT b.new_salary
    FROM bonuses b
    WHERE b.emp_id = e.emp_id
);
```

* A. Chỉ có 5 nhân viên có mặt trong bảng `BONUSES` được cập nhật mức lương mới, 95 nhân viên còn lại giữ nguyên lương cũ.
* B. 5 nhân viên được cập nhật lương mới, 95 nhân viên còn lại bị đổi lương thành `0`.
* C. Câu lệnh thất bại và toàn bộ 100 dòng không bị thay đổi vì Subquery trả về `NULL` cho 95 nhân viên không khớp, vi phạm ràng buộc `NOT NULL` của cột `SALARY`.
* D. Câu lệnh báo lỗi cú pháp vì không được dùng Correlated Subquery trong mệnh đề `SET`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Vì câu lệnh `UPDATE` bên ngoài **không có mệnh đề `WHERE`**, Oracle sẽ cập nhật toàn bộ 100 dòng của bảng `EMPLOYEES`. Đối với 95 nhân viên không tồn tại trong bảng `BONUSES`, câu truy vấn con trả về `NULL`. Khi cố gán `NULL` vào cột `SALARY` có ràng buộc `NOT NULL`, Oracle ném ra lỗi `ORA-01407: cannot update ("EMPLOYEES"."SALARY") to NULL` và thực hiện Statement-level Rollback hủy bỏ toàn bộ câu lệnh `UPDATE` đó.
  * **A sai:** Muốn đạt được hành vi như đáp án A, bắt buộc phải thêm mệnh đề `WHERE EXISTS (SELECT 1 FROM bonuses b WHERE b.emp_id = e.emp_id)` vào cuối câu lệnh `UPDATE`.
  * **B, D sai:** Correlated Subquery hoàn toàn hợp lệ trong mệnh đề `SET`, và khi không tìm thấy dòng thỏa mãn thì Subquery trả về `NULL` chứ không phải `0`.
</details>

---

### Câu 8 (Question 8)
**Những câu lệnh nào sau đây xóa thành công các dòng có `dept_id = 90` khỏi bảng `EMPLOYEES` (giả sử không có khóa ngoại nào tham chiếu ngược lại các dòng này)?**

```sql
-- Lệnh 1: DELETE FROM employees WHERE dept_id = 90;
-- Lệnh 2: DELETE employees WHERE dept_id = 90;
-- Lệnh 3: DELETE * FROM employees WHERE dept_id = 90;
```

* A. Chỉ Lệnh 1
* B. Chỉ Lệnh 1 và Lệnh 2
* C. Chỉ Lệnh 1 và Lệnh 3
* D. Cả Lệnh 1, Lệnh 2 và Lệnh 3

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong Oracle SQL, từ khóa `FROM` trong câu lệnh `DELETE` là **tùy chọn (optional)**. Do đó cả `DELETE FROM employees ...` (Lệnh 1) và `DELETE employees ...` (Lệnh 2) đều hoàn toàn hợp lệ và cho kết quả giống hệt nhau.
  * **A, C, D sai:** Lệnh 3 (`DELETE * FROM ...`) sai cú pháp (`ORA-00903: invalid table name`) vì `DELETE` luôn xóa nguyên dòng, tuyệt đối không viết dấu `*` hay tên cột sau từ khóa `DELETE`.
</details>

---

### Câu 9 (Question 9)
**Bảng `DEPARTMENTS` có khóa chính là `DEPT_ID` đang chứa các phòng ban `10`, `20`, `30`. Bảng `EMPLOYEES` có khóa ngoại `DEPT_ID` tham chiếu đến `DEPARTMENTS(DEPT_ID)` (được tạo với cấu hình mặc định, không có `ON DELETE CASCADE` hay `ON DELETE SET NULL`). Hiện tại trong bảng `EMPLOYEES` chỉ có các nhân viên thuộc phòng ban `10` và `20` (không có nhân viên nào thuộc phòng ban `30`). Kết quả của câu lệnh sau là gì?**

```sql
DELETE FROM departments WHERE dept_id = 30;
```

* A. Báo lỗi `ORA-02292: integrity constraint violated - child record found` vì bảng `EMPLOYEES` đang có khóa ngoại trỏ vào `DEPARTMENTS`.
* B. Xóa thành công phòng ban `30` khỏi bảng `DEPARTMENTS`.
* C. Xóa phòng ban `30` và tự động xóa luôn toàn bộ dữ liệu trong bảng `EMPLOYEES`.
* D. Báo lỗi vì không thể chạy `DELETE` trên bảng có khóa chính đang được tham chiếu nếu chưa `DISABLE` khóa ngoại.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Ràng buộc khóa ngoại chỉ ngăn cản việc xóa dòng ở bảng Cha khi **đang tồn tại ít nhất một dòng Con thực tế** tham chiếu đến giá trị khóa chính của dòng Cha đó. Vì phòng ban `30` hiện không có bất kỳ nhân viên nào trong bảng `EMPLOYEES` tham chiếu tới, câu lệnh `DELETE FROM departments WHERE dept_id = 30;` chạy thành công hoàn toàn bình thường!
  * **A, C, D sai:** Lỗi `ORA-02292` chỉ xảy ra nếu bạn cố xóa phòng ban `10` hoặc `20`. Việc xóa dòng Cha không có dòng Con không yêu cầu phải `DISABLE` khóa ngoại (chỉ khi `TRUNCATE` hoặc `DROP` bảng Cha thì mới bị chặn bất kể có dòng Con hay không).
</details>

---

### Câu 10 (Question 10)
**Xem xét câu lệnh `MERGE` dưới đây. Tại sao câu lệnh này lại báo lỗi khi thực thi?**

```sql
MERGE INTO products p
USING new_products np
ON (p.prod_id = np.prod_id)
WHEN MATCHED THEN
    UPDATE SET
        p.prod_id = np.prod_id,
        p.price = np.price
WHEN NOT MATCHED THEN
    INSERT (p.prod_id, p.prod_name, p.price)
    VALUES (np.prod_id, np.prod_name, np.price);
```

* A. Trong mệnh đề `WHEN NOT MATCHED`, không được phép viết tiền tố bí danh `p.` trong danh sách cột của `INSERT`.
* B. Không được phép cập nhật cột `p.prod_id` trong mệnh đề `UPDATE SET` vì cột này đang được sử dụng trong điều kiện kết nối `ON (p.prod_id = np.prod_id)`.
* C. Thiếu từ khóa `INTO products` ngay sau từ khóa `INSERT`.
* D. Thiếu tên bảng `products` ngay sau từ khóa `UPDATE`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Quy tắc bắt buộc của lệnh `MERGE` trong Oracle là **không bao giờ được phép `UPDATE` bất kỳ cột nào được tham chiếu trong mệnh đề `ON (...)`**, kể cả khi bạn gán lại chính giá trị cũ (`p.prod_id = np.prod_id`). Câu lệnh trên sẽ ném ra lỗi `ORA-38104: Columns referenced in the ON Clause cannot be updated: "P"."PROD_ID"`.
  * **A sai:** Tiền tố bí danh của bảng đích (`p.prod_id`) hoàn toàn được phép sử dụng trong danh sách cột của `INSERT` và `UPDATE SET`.
  * **C, D sai:** Trong cú pháp `MERGE`, ta chỉ viết `UPDATE SET ...` (không viết tên bảng sau `UPDATE`) và `INSERT (...) VALUES (...)` (không viết `INTO table_name` sau `INSERT`).
</details>

---

### Câu 11 (Question 11)
**Bảng đích `CUST_TARGET` đang có 3 dòng: `(id=1, status='ACTIVE')`, `(id=2, status='INACTIVE')`, `(id=3, status='INACTIVE')`. Bảng nguồn `CUST_SOURCE` chỉ có 2 dòng: `(id=1, status='INACTIVE')` và `(id=2, status='ACTIVE')`. Sau khi thực thi câu lệnh `MERGE` dưới đây, những dòng `id` nào còn tồn tại trong bảng `CUST_TARGET`?**

```sql
MERGE INTO cust_target t
USING cust_source s
ON (t.id = s.id)
WHEN MATCHED THEN
    UPDATE SET t.status = s.status
    DELETE WHERE (t.status = 'INACTIVE');
```

* A. Chỉ còn `id = 2`
* B. Còn `id = 2` và `id = 3`
* C. Chỉ còn `id = 1` và `id = 2`
* D. Câu lệnh báo lỗi vì thiếu mệnh đề `WHEN NOT MATCHED THEN INSERT`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Hãy phân tích từng dòng trong `CUST_TARGET`:
    * **`id = 1`**: Khớp điều kiện `ON` với bảng nguồn → Được `UPDATE` đổi `t.status` từ `'ACTIVE'` thành `'INACTIVE'`. Ngay sau khi cập nhật, mệnh đề `DELETE WHERE (t.status = 'INACTIVE')` kiểm tra giá trị **sau khi cập nhật** (*post-update value*), thấy thỏa mãn `'INACTIVE'` nên **xóa dòng `id = 1`**.
    * **`id = 2`**: Khớp điều kiện `ON` → Được `UPDATE` đổi `t.status` từ `'INACTIVE'` thành `'ACTIVE'`. Giá trị sau cập nhật là `'ACTIVE'` nên **không bị xóa**.
    * **`id = 3`**: Không tồn tại trong `CUST_SOURCE` nên **không khớp điều kiện `ON`** và không được `UPDATE` bởi lệnh `MERGE` này. Vì mệnh đề `DELETE WHERE` trong `MERGE` **chỉ đánh giá trên những dòng vừa được cập nhật bởi nhánh `WHEN MATCHED`**, dòng `id = 3` hoàn toàn không bị kiểm tra và **vẫn tồn tại nguyên vẹn** dù đang có `status = 'INACTIVE'`!
    * Vậy bảng `CUST_TARGET` còn lại 2 dòng là `id = 2` và `id = 3`.
  * **A, C sai:** Do hiểu nhầm rằng `DELETE WHERE` quét toàn bộ bảng đích hoặc kiểm tra giá trị trước khi `UPDATE`.
  * **D sai:** Trong lệnh `MERGE`, mệnh đề `WHEN MATCHED` và `WHEN NOT MATCHED` là độc lập; có thể chỉ viết 1 trong 2 mệnh đề.
</details>

---

### Câu 12 (Question 12)
**Khi thực thi câu lệnh `MERGE INTO target t USING source s ON (t.id = s.id) ...`, khi nào Oracle sẽ ném ra lỗi `ORA-30926: unable to get a stable set of rows in the source tables`?**

* A. Khi bảng nguồn `source` không có bất kỳ dòng dữ liệu nào (bảng rỗng).
* B. Khi 1 dòng trong bảng nguồn `source` khớp với nhiều dòng trong bảng đích `target`.
* C. Khi 1 dòng trong bảng đích `target` khớp với nhiều hơn 1 dòng trong bảng nguồn `source`.
* D. Khi một Session khác đang thực hiện câu lệnh `SELECT` trên bảng `source`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Lệnh `MERGE` yêu cầu tính tất định (deterministic): mỗi dòng trong bảng đích `target` chỉ được phép được cập nhật tối đa 1 lần trong một lệnh `MERGE`. Nếu 1 dòng trong `target` (ví dụ `t.id = 10`) lại khớp với 2 dòng đều có `s.id = 10` trong bảng nguồn `source`, Oracle không thể biết phải lấy giá trị của dòng nguồn nào để cập nhật cho `t.id = 10`, dẫn đến lỗi `ORA-30926: unable to get a stable set of rows in the source tables`.
  * **A sai:** Nếu bảng nguồn rỗng, lệnh `MERGE` chạy thành công với `0 rows merged`.
  * **B sai:** Nếu 1 dòng trong bảng nguồn khớp với nhiều dòng trong bảng đích (ví dụ 1 phòng ban nguồn cập nhật cho 10 nhân viên đích), Oracle cập nhật cả 10 dòng đích hoàn toàn bình thường.
  * **D sai:** Câu lệnh `SELECT` không bao giờ chặn các thao tác đọc hoặc ghi trong Oracle.
</details>

---

### Câu 13 (Question 13)
**Trong Oracle Database, một giao dịch (Transaction) mới sẽ chính thức bắt đầu tại thời điểm nào?**

* A. Ngay khi người dùng thực thi lệnh `BEGIN TRANSACTION;` trong SQL*Plus.
* B. Ngay khi người dùng đăng nhập (Connect) thành công vào cơ sở dữ liệu.
* C. Khi câu lệnh `SELECT` đầu tiên được thực thi sau khi đăng nhập.
* D. Khi câu lệnh DML đầu tiên (`INSERT`, `UPDATE`, `DELETE`, `MERGE`, hoặc `SELECT ... FOR UPDATE`) được thực thi sau khi kết nối hoặc sau khi giao dịch trước đó vừa kết thúc.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Oracle quản lý giao dịch theo cơ chế ngầm định (*Implicit Transaction Start*): một Transaction chỉ thực sự bắt đầu và được cấp Transaction ID khi câu lệnh DML đầu tiên (hoặc lệnh khóa dòng `SELECT ... FOR UPDATE` / `LOCK TABLE`) được thực thi.
  * **A sai:** Trong SQL chuẩn của Oracle không có câu lệnh `BEGIN TRANSACTION`.
  * **B, C sai:** Mới đăng nhập hoặc chỉ chạy các câu lệnh `SELECT` thông thường thì chưa khởi tạo Transaction (kiểm tra `V$TRANSACTION` sẽ thấy chưa có bản ghi giao dịch nào).
</details>

---

### Câu 14 (Question 14)
**Bảng `ITEMS (id NUMBER PRIMARY KEY, name VARCHAR2(20) NOT NULL)` hiện đang trống. Bạn thực thi tuần tự các câu lệnh dưới đây trong cùng một Session. Hỏi sau khi kết thúc đoạn kịch bản, bảng `ITEMS` có bao nhiêu dòng?**

```sql
INSERT INTO items VALUES (1, 'Pen');
INSERT INTO items VALUES (2, 'Book');
INSERT INTO items VALUES (2, 'Ruler'); -- Vi phạm PRIMARY KEY!
INSERT INTO items VALUES (3, NULL);    -- Vi phạm NOT NULL!
COMMIT;
```

* A. 0 dòng (vì có lỗi xảy ra nên toàn bộ Transaction bị Rollback tự động)
* B. 1 dòng
* C. 2 dòng
* D. 3 dòng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khi một câu lệnh DML gặp lỗi runtime (như vi phạm `PRIMARY KEY` ở dòng 3 hay vi phạm `NOT NULL` ở dòng 4), Oracle chỉ thực hiện **Statement-level Rollback** (tự động hủy bỏ đúng câu lệnh bị lỗi đó). Giao dịch hiện tại vẫn giữ nguyên hiệu lực đối với các câu lệnh DML đã thành công trước đó (`(1, 'Pen')` và `(2, 'Book')`). Khi lệnh `COMMIT;` cuối cùng chạy, cả 2 dòng hợp lệ này được lưu vĩnh viễn vào bảng.
  * **A, B, D sai:** Đây là bẫy rất phổ biến đánh vào sự hiểu lầm rằng tính nguyên tử (Atomicity) sẽ tự động Rollback toàn bộ Transaction ngay khi 1 câu lệnh lẻ bị lỗi cú pháp hoặc lỗi ràng buộc.
</details>

---

### Câu 15 (Question 15)
**Cho bảng `TEST_SP (val NUMBER)` đang trống. Hãy theo dõi kịch bản giao dịch dưới đây và cho biết những giá trị nào sẽ tồn tại trong bảng `TEST_SP` sau khi lệnh `COMMIT` cuối cùng hoàn tất?**

```sql
INSERT INTO test_sp VALUES (10);
SAVEPOINT sp_1;
INSERT INTO test_sp VALUES (20);
SAVEPOINT sp_2;
INSERT INTO test_sp VALUES (30);
ROLLBACK TO SAVEPOINT sp_1;
INSERT INTO test_sp VALUES (40);
ROLLBACK TO SAVEPOINT sp_2;
COMMIT;
```

* A. `10` và `40`
* B. `10`, `20` và `40`
* C. Chỉ có `10`
* D. `10`, `20`, `30` và `40`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Hãy truy vết từng bước một cách cẩn thận:
    1. Chèn `10` → Tạo mốc `sp_1`.
    2. Chèn `20` → Tạo mốc `sp_2`.
    3. Chèn `30`.
    4. `ROLLBACK TO SAVEPOINT sp_1;`: Hủy bỏ việc chèn `20` và `30`, đồng thời **xóa sổ hoàn toàn mốc `sp_2`** (vì `sp_2` được tạo sau `sp_1`)! Lúc này bảng chỉ còn `10`.
    5. Chèn `40`: Lúc này bảng đang có `10` và `40`.
    6. `ROLLBACK TO SAVEPOINT sp_2;`: Vì `sp_2` đã bị xóa sổ ở bước 4, câu lệnh này **bị lỗi `ORA-01086: savepoint 'SP_2' never established in this session or is invalid`**! Câu lệnh `ROLLBACK TO sp_2` thất bại nên **không có gì bị hoàn tác**, giá trị `40` vẫn còn nguyên!
    7. `COMMIT;`: Lưu vĩnh viễn các thay đổi hiện có, tức là `10` và `40`!
  * **B, C, D sai:** Không nhận ra rằng `ROLLBACK TO sp_1` đã xóa mất `sp_2`, khiến lệnh `ROLLBACK TO sp_2` báo lỗi và không thể hủy bỏ dòng `40`.
</details>

---

### Câu 16 (Question 16)
**Điều gì xảy ra nếu trong cùng một Transaction, bạn thực thi câu lệnh sau?**

```sql
INSERT INTO logs VALUES (1, 'Start');
SAVEPOINT my_sp;
INSERT INTO logs VALUES (2, 'Processing');
SAVEPOINT my_sp;
INSERT INTO logs VALUES (3, 'End');
ROLLBACK TO SAVEPOINT my_sp;
```

* A. Câu lệnh `SAVEPOINT my_sp;` thứ hai báo lỗi vì tên Savepoint phải là duy nhất trong một Transaction.
* B. Chỉ có dòng `(3, 'End')` bị hoàn tác; hai dòng `1` và `2` vẫn còn trong Transaction.
* C. Cả hai dòng `(2, 'Processing')` và `(3, 'End')` đều bị hoàn tác; chỉ còn dòng `1`.
* D. Toàn bộ 3 dòng đều bị hoàn tác.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Oracle cho phép khai báo lại một `SAVEPOINT` trùng tên với một `SAVEPOINT` đã có trong cùng Transaction. Khi đó, mốc `my_sp` cũ sẽ bị xóa và được **dời đến vị trí mới nhất** (ngay sau dòng `(2, 'Processing')`). Do đó, `ROLLBACK TO SAVEPOINT my_sp;` chỉ hủy bỏ các lệnh DML sau mốc mới nhất (tức là chỉ hủy dòng `(3, 'End')`), giữ lại dòng `1` và dòng `2`.
  * **A, C, D sai:** Đặt trùng tên Savepoint không bao giờ báo lỗi mà ghi đè lên mốc cũ.
</details>

---

### Câu 17 (Question 17)
**Sau khi thực thi lệnh `ROLLBACK TO SAVEPOINT sp_a;` thành công, phát biểu nào sau đây là ĐÚNG?**

* A. Toàn bộ các khóa dòng (Row Locks) của Transaction hiện tại đều được giải phóng.
* B. Bản thân mốc `sp_a` vẫn tiếp tục tồn tại và bạn có thể gọi lại `ROLLBACK TO SAVEPOINT sp_a;` thêm lần nữa sau khi chạy các lệnh DML mới.
* C. Mốc `sp_a` bị xóa ngay sau khi hoàn tác về nó, nhưng các mốc tạo sau `sp_a` vẫn được giữ lại.
* D. Giao dịch hiện tại đã kết thúc hoàn toàn.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi `ROLLBACK TO SAVEPOINT sp_a`, chỉ những thay đổi và những Savepoint được tạo **sau** `sp_a` mới bị hủy bỏ. Bản thân mốc `sp_a` (cùng các mốc tạo trước `sp_a`) vẫn còn hiệu lực và có thể tiếp tục được dùng để `ROLLBACK TO` nhiều lần nữa cho đến khi Transaction kết thúc.
  * **A sai:** Chỉ các khóa dòng được tạo bởi các lệnh DML nằm *sau* `sp_a` mới được giải phóng; các khóa dòng trước `sp_a` vẫn được giữ chặt.
  * **C, D sai:** Giao dịch vẫn đang mở, và các mốc tạo sau `sp_a` mới là thứ bị xóa.
</details>

---

### Câu 18 (Question 18)
**Sự kiện nào sau đây sẽ khiến Oracle tự động thực hiện `ROLLBACK` giao dịch hiện tại (thay vì `COMMIT`)?**

* A. Người dùng gõ lệnh `EXIT` hoặc `QUIT` để thoát khỏi SQL*Plus một cách bình thường.
* B. Người dùng thực thi một câu lệnh `ALTER TABLE` bị lỗi cú pháp.
* C. Phiên làm việc (Session) bị ngắt kết nối đột ngột do đứt cáp mạng hoặc bị DBA thực thi lệnh `ALTER SYSTEM KILL SESSION`.
* D. Người dùng thực thi câu lệnh `GRANT SELECT ON employees TO scott;`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khi một phiên làm việc kết thúc bất thường (mất mạng, ứng dụng client bị crash, hoặc bị `KILL SESSION`), tiến trình nền `PMON` của Oracle sẽ dọn dẹp phiên đó và tự động **ROLLBACK** mọi thay đổi chưa được Commit.
  * **A sai:** Thoát khỏi SQL*Plus bằng lệnh `EXIT` hoặc `QUIT` hợp lệ sẽ kích hoạt **Auto-COMMIT**!
  * **B sai:** Lệnh DDL bị lỗi cú pháp ngay ở bước Parse thì chưa thực thi nên không làm Rollback giao dịch (và nếu nó qua bước Parse thì DDL thực hiện Auto-COMMIT trước khi chạy chứ không bao giờ Rollback toàn bộ giao dịch cũ).
  * **D sai:** `GRANT` là lệnh DCL, sẽ tự động thực hiện **Auto-COMMIT** giao dịch hiện tại.
</details>

---

### Câu 19 (Question 19)
**Lúc 10:00, nhân viên `emp_id = 101` có `salary = 5000`. Lúc 10:01, Session 1 thực thi lệnh `UPDATE employees SET salary = 8000 WHERE emp_id = 101;` nhưng chưa `COMMIT`. Lúc 10:02, Session 2 thực thi lệnh `SELECT salary FROM employees WHERE emp_id = 101;`. Kết quả mà Session 2 nhận được là gì?**

* A. Session 2 bị treo (Wait) cho đến khi Session 1 thực hiện `COMMIT` hoặc `ROLLBACK`.
* B. Session 2 nhận được ngay kết quả `salary = 8000`.
* C. Session 2 nhận được ngay kết quả `salary = 5000` mà không phải chờ đợi, nhờ đọc hình ảnh trước khi sửa từ Undo Segments.
* D. Session 2 nhận thông báo lỗi `ORA-00054: resource busy`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Theo nguyên lý **Read Consistency (Đọc nhất quán)** của Oracle: *Ghi không bao giờ chặn Đọc (Writers do not block Readers)* và *Không bao giờ có Đọc bẩn (No Dirty Reads)*. Session 2 sẽ không bị khóa chờ mà ngay lập tức dùng dữ liệu trong **Undo Segments** để dựng lại bản sao nhất quán (CR Block) và đọc được giá trị đã Commit gần nhất là `5000`.
  * **A, B, D sai:** Chỉ bản thân Session 1 khi tự `SELECT` mới thấy `8000`. Session 2 chỉ bị treo hoặc lỗi `ORA-00054` nếu Session 2 cũng chạy lệnh ghi (`UPDATE`/`DELETE`) hoặc chạy `SELECT ... FOR UPDATE`.
</details>

---

### Câu 20 (Question 20)
**Nguyên nhân chính gây ra lỗi kinh điển `ORA-01555: snapshot too old` đối với một câu lệnh `SELECT` chạy lâu trong Oracle là gì?**

* A. Câu lệnh `SELECT` giữ khóa đọc quá lâu khiến vùng nhớ Shared Pool bị tràn.
* B. Trong lúc câu lệnh `SELECT` đang chạy, các Session khác đã sửa đổi dữ liệu và `COMMIT`, dẫn đến các khối dữ liệu hoàn tác (Undo blocks) cần thiết để tái tạo hình ảnh nhất quán tại thời điểm bắt đầu câu `SELECT` đã bị ghi đè.
* C. Bảng dữ liệu đang được đọc bị một Session khác thực hiện lệnh `DELETE` toàn bộ dòng.
* D. Câu lệnh `SELECT` sử dụng quá nhiều vùng nhớ tạm (Temporary Tablespace) để sắp xếp dữ liệu (`ORDER BY`).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Để đảm bảo tính đọc nhất quán ở cấp độ câu lệnh (*Statement-level Read Consistency*), một câu lệnh `SELECT` bắt đầu tại thời điểm $T_0$ phải nhìn thấy toàn bộ dữ liệu đúng như trạng thái tại mốc $T_0$. Nếu câu `SELECT` chạy quá lâu trong khi các giao dịch khác liên tục cập nhật và `COMMIT`, không gian trong Undo Tablespace của các giao dịch đã Commit đó có thể bị tái sử dụng (ghi đè). Khi câu `SELECT` cần tìm lại dữ liệu gốc ở mốc $T_0$ mà khối Undo đã mất, Oracle ném lỗi `ORA-01555: snapshot too old`.
  * **A sai:** Câu lệnh `SELECT` thông thường không đặt bất kỳ khóa nào lên dữ liệu.
  * **C, D sai:** Việc thiếu vùng nhớ tạm khi `ORDER BY` sẽ gây lỗi `ORA-01652: unable to extend temp segment`, không phải `ORA-01555`.
</details>

---

### Câu 21 (Question 21)
**Session 1 thực thi câu lệnh `UPDATE employees SET salary = 3000 WHERE dept_id = 10;` (tác động lên 3 nhân viên có `emp_id` là `101`, `102`, `103`) và chưa `COMMIT`. Ngay sau đó, câu lệnh nào dưới đây nếu được thực thi ở Session 2 sẽ bị treo (Blocked/Wait)?**

* A. `SELECT * FROM employees WHERE dept_id = 10;`
* B. `UPDATE employees SET salary = 4000 WHERE emp_id = 104;` (nhân viên `104` thuộc `dept_id = 20`)
* C. `INSERT INTO employees (emp_id, full_name, salary, dept_id) VALUES (205, 'New Emp', 2500, 10);`
* D. `DELETE FROM employees WHERE emp_id = 102;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Oracle áp dụng cơ chế khóa độc quyền ở **cấp độ dòng (Row-level Lock)**. Session 1 chỉ khóa đúng 3 dòng `101`, `102`, `103`. Khi Session 2 muốn `DELETE` dòng `102` (đang bị Session 1 giữ khóa), Session 2 sẽ bị treo (Wait) cho đến khi Session 1 `COMMIT` hoặc `ROLLBACK`.
  * **A sai:** Lệnh `SELECT` thông thường không bao giờ bị chặn bởi khóa dòng.
  * **B sai:** Nhân viên `104` là một dòng khác không bị Session 1 chạm tới, nên Session 2 cập nhật dòng `104` thành công ngay lập tức.
  * **C sai:** Do Session 1 chỉ khóa 3 dòng hiện hữu chứ không khóa toàn bộ bảng hay khóa phòng ban `10`, Session 2 vẫn chèn thêm nhân viên mới vào phòng ban `10` thành công bình thường.
</details>

---

### Câu 22 (Question 22)
**Bạn muốn truy vấn và đặt khóa trước trên các dòng nhân viên thuộc phòng ban `20` để chuẩn bị cập nhật. Yêu cầu đặt ra là: nếu có bất kỳ dòng nào trong số đó đang bị Session khác khóa, hệ thống phải chờ tối đa 3 giây; nếu sau 3 giây vẫn chưa lấy được khóa thì báo lỗi ngay. Câu lệnh nào sau đây đáp ứng đúng yêu cầu?**

* A. `SELECT emp_id, salary FROM employees WHERE dept_id = 20 FOR UPDATE WAIT 3;`
* B. `SELECT emp_id, salary FROM employees WHERE dept_id = 20 FOR UPDATE NOWAIT 3;`
* C. `SELECT emp_id, salary FROM employees WHERE dept_id = 20 FOR UPDATE TIMEOUT 3;`
* D. `SELECT emp_id, salary FROM employees WHERE dept_id = 20 LOCK WAIT 3;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Mệnh đề `FOR UPDATE WAIT n` chỉ định số giây tối đa (`n = 3`) mà Oracle sẽ chờ để lấy khóa dòng trước khi hủy lệnh và trả về lỗi `ORA-30006: resource busy; acquire with WAIT timeout expired`.
  * **B sai:** Từ khóa `NOWAIT` không đi kèm số giây (nó trả lỗi `ORA-00054` ngay tức khắc nếu dòng đang bận).
  * **C, D sai:** `TIMEOUT 3` và `LOCK WAIT 3` không phải là cú pháp hợp lệ của `SELECT ... FOR UPDATE` trong Oracle.
</details>

---

### Câu 23 (Question 23)
**Xem xét câu truy vấn kết nối hai bảng `EMPLOYEES` và `DEPARTMENTS` dưới đây. Khi câu lệnh này được thực thi thành công, những dòng dữ liệu nào sẽ bị đặt khóa (Row Lock)?**

```sql
SELECT e.emp_id, e.full_name, d.dept_name
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id
WHERE d.location_id = 1700
FOR UPDATE OF e.salary;
```

* A. Chỉ riêng cột `salary` của các dòng thỏa mãn điều kiện trong bảng `EMPLOYEES` bị khóa; các cột khác trên cùng dòng vẫn cho phép Session khác cập nhật.
* B. Các dòng thỏa mãn điều kiện ở cả hai bảng `EMPLOYEES` và `DEPARTMENTS` đều bị khóa.
* C. Toàn bộ các dòng thỏa mãn điều kiện trong bảng `EMPLOYEES` bị khóa, còn các dòng tương ứng trong bảng `DEPARTMENTS` KHÔNG bị khóa.
* D. Chỉ các dòng trong bảng `DEPARTMENTS` có `location_id = 1700` bị khóa vì điều kiện `WHERE` nằm trên bảng `DEPARTMENTS`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khi dùng `FOR UPDATE OF column_name` trong một câu truy vấn JOIN nhiều bảng, Oracle chỉ đặt khóa dòng (Row-level Lock) trên **bảng nào chứa cột được nêu tên sau từ khóa `OF`**. Vì `e.salary` thuộc bảng `EMPLOYEES`, chỉ các dòng được chọn thuộc bảng `EMPLOYEES` mới bị khóa, còn các dòng thuộc bảng `DEPARTMENTS` không hề bị khóa!
  * **A sai:** Đơn vị khóa nhỏ nhất của Oracle là **dòng (Row)**, không tồn tại khái niệm "khóa một cột đơn lẻ trên dòng". Tên cột `e.salary` chỉ đóng vai trò chỉ điểm bảng `EMPLOYEES`.
  * **B sai:** Chỉ khi viết `FOR UPDATE` trần (không có `OF ...`) thì Oracle mới khóa các dòng liên quan trên tất cả các bảng trong mệnh đề `FROM/JOIN`.
  * **D sai:** Điều kiện `WHERE` nằm trên bảng nào không quyết định bảng bị khóa; mệnh đề `OF` mới quyết định.
</details>

---

### Câu 24 (Question 24)
**Hai phiên làm việc (Session A và Session B) rơi vào trạng thái khóa chéo nhau (Deadlock): Session A đang giữ khóa dòng 1 và chờ dòng 2; Session B đang giữ khóa dòng 2 và chờ dòng 1. Cơ sở dữ liệu Oracle sẽ xử lý tình huống này như thế nào?**

* A. Cả hai Session sẽ chờ nhau mãi mãi cho đến khi quản trị viên (DBA) can thiệp bằng lệnh `KILL SESSION`.
* B. Oracle tự động phát hiện Deadlock, chọn một Session để ném lỗi `ORA-00060` và chỉ Rollback **câu lệnh DML đang bị kẹt gây ra Deadlock** của Session đó (giữ nguyên Transaction và các khóa trước đó của nó).
* C. Oracle tự động phát hiện Deadlock và thực hiện `ROLLBACK` toàn bộ Transaction của cả hai Session.
* D. Oracle tự động phát hiện Deadlock, ngắt kết nối (Disconnect) của Session gây ra Deadlock và giải phóng toàn bộ khóa của Session đó.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Oracle tự động phát hiện Deadlock sau vài giây và chọn một trong hai Session làm "nạn nhân" để trả về lỗi `ORA-00060: deadlock detected while waiting for resource`. Quan trọng nhất: Oracle **chỉ thực hiện Statement-level Rollback đối với đúng câu lệnh DML đang đứng chờ gây ra vòng lặp bế tắc**! Phiên làm việc đó không bị ngắt kết nối, Transaction của nó vẫn đang mở, và khóa trên dòng đầu tiên mà nó đã sửa trước đó vẫn được giữ nguyên.
  * **A, C, D sai:** Đây là bẫy kinh điển trong đề thi OCA/OCP nhằm kiểm tra xem thí sinh có phân biệt được Statement-level Rollback và Transaction-level Rollback khi xảy ra Deadlock hay không.
</details>

---

### Câu 25 (Question 25)
**Bảng `ORDERS` đang có 5 dòng với `status = 'PENDING'` (trong đó có 2 dòng đang bị khóa bởi Session 1 chưa Commit, và 3 dòng đang rảnh). Ở Session 2, bạn muốn truy vấn và khóa ngay lập tức những dòng `status = 'PENDING'` nào đang rảnh mà KHÔNG phải chờ Session 1 và cũng KHÔNG bị văng lỗi. Câu lệnh nào sau đây thực hiện đúng yêu cầu đó?**

```sql
-- Bảng ORDERS có 5 dòng status = 'PENDING':
-- 2 dòng đang bị Session 1 giữ Row Lock
-- 3 dòng không bị khóa
```

* A. `SELECT * FROM orders WHERE status = 'PENDING' FOR UPDATE NOWAIT;`
* B. `SELECT * FROM orders WHERE status = 'PENDING' FOR UPDATE SKIP LOCKED;`
* C. `SELECT * FROM orders WHERE status = 'PENDING' FOR UPDATE WAIT 0;`
* D. `SELECT * FROM orders WHERE status = 'PENDING' FOR UPDATE IGNORE LOCKS;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Mệnh đề `FOR UPDATE SKIP LOCKED` hướng dẫn Oracle lướt qua (bỏ qua) bất kỳ dòng nào đang bị khóa bởi giao dịch của Session khác mà không chờ đợi và không báo lỗi; nó sẽ khóa và trả về ngay lập tức 3 dòng `'PENDING'` đang rảnh. Tính năng này cực kỳ hữu ích khi xây dựng hệ thống hàng đợi xử lý công việc (Queue processing).
  * **A, C sai:** Cả `FOR UPDATE NOWAIT` và `FOR UPDATE WAIT 0` đều sẽ thất bại toàn bộ câu lệnh và ném ra lỗi (`ORA-00054` hoặc `ORA-30006`) ngay khi đụng phải 1 trong 2 dòng đang bị khóa bởi Session 1.
  * **D sai:** Cú pháp `IGNORE LOCKS` không tồn tại trong Oracle SQL.
</details>

---
