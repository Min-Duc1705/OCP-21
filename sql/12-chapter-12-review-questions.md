# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 12: Constraints — Ràng Buộc Toàn Vẹn Dữ Liệu

> **Tài liệu tham chiếu:** *OCA/OCP Oracle Database SQL Exam Guide (Exam 1Z0-071)* & Đề thi sát hạch CNTT VNPT.  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết.  
> **Cách học:** Bạn hãy tự đọc đề và chọn đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và nắm vững bẫy thi.

---

### Câu 1 (Question 1)
**Trong từ điển dữ liệu `USER_CONSTRAINTS` của Oracle Database, cột `CONSTRAINT_TYPE` lưu ký hiệu viết tắt cho từng loại ràng buộc. Ký hiệu nào sau đây tương ứng với ràng buộc `FOREIGN KEY` và `NOT NULL`?**

* A. `FOREIGN KEY` là `'F'`, `NOT NULL` là `'N'`
* B. `FOREIGN KEY` là `'R'`, `NOT NULL` là `'N'`
* C. `FOREIGN KEY` là `'R'`, `NOT NULL` là `'C'`
* D. `FOREIGN KEY` là `'F'`, `NOT NULL` là `'C'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong view `USER_CONSTRAINTS`, Oracle sử dụng các ký tự mã hóa sau cho cột `CONSTRAINT_TYPE`:
    * `'P'`: `PRIMARY KEY`
    * `'U'`: `UNIQUE`
    * `'R'`: `FOREIGN KEY` (*Referential Integrity*)
    * `'C'`: Dùng chung cho cả **`CHECK`** và **`NOT NULL`** (vì nội bộ Oracle lưu `NOT NULL` như một ràng buộc kiểm tra `IS NOT NULL`).
  * **A, B, D sai:** Trong `USER_CONSTRAINTS` không có mã `'F'` hay `'N'`.
</details>

---

### Câu 2 (Question 2)
**Loại ràng buộc (Constraint) nào sau đây BẮT BUỘC phải được khai báo ở mức Cột (Column-level / Inline) và KHÔNG ĐƯỢC PHÉP khai báo bằng từ khóa trực tiếp ở mức Bảng (Table-level / Out-of-line)?**

* A. `PRIMARY KEY`
* B. `UNIQUE`
* C. `NOT NULL`
* D. `CHECK`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Ràng buộc `NOT NULL` chỉ được phép khai báo trực tiếp ở mức Cột (ví dụ: `emp_name VARCHAR2(50) NOT NULL`). Bạn không bao giờ được viết `CONSTRAINT nn_emp NOT NULL (emp_name)` ở mức Bảng (trừ khi viết lại dưới dạng ràng buộc kiểm tra `CHECK (emp_name IS NOT NULL)`).
  * **A, B, D sai:** `PRIMARY KEY`, `UNIQUE`, `FOREIGN KEY` và `CHECK` đều có thể khai báo ở cả mức Cột lẫn mức Bảng (và bắt buộc khai báo ở mức Bảng nếu ràng buộc liên quan đến từ 2 cột trở lên).
</details>

---

### Câu 3 (Question 3)
**Bảng `EMPLOYEES` đã được tạo từ trước nhưng cột `EMAIL` hiện đang cho phép chứa giá trị `NULL` (và hiện tại tất cả các dòng trong bảng đều đã có địa chỉ email khác `NULL`). Câu lệnh nào sau đây thêm ràng buộc `NOT NULL` có tên `EMP_EMAIL_NN` vào cột `EMAIL` một cách hợp lệ?**

```sql
-- Bảng EMPLOYEES đang có cột EMAIL VARCHAR2(100)
```

* A. `ALTER TABLE employees ADD CONSTRAINT emp_email_nn NOT NULL (email);`
* B. `ALTER TABLE employees MODIFY (email CONSTRAINT emp_email_nn NOT NULL);`
* C. `ALTER TABLE employees ADD NOT NULL (email) CONSTRAINT emp_email_nn;`
* D. `ALTER TABLE employees RENAME COLUMN email TO NOT NULL;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Vì `NOT NULL` là ràng buộc mức cột (Inline), nên khi muốn bổ sung `NOT NULL` vào một cột đã tồn tại, bạn bắt buộc phải dùng mệnh đề **`ALTER TABLE ... MODIFY (column_name [CONSTRAINT constraint_name] NOT NULL)`**.
  * **A, C sai:** Không thể dùng `ALTER TABLE ... ADD CONSTRAINT ... NOT NULL (col)` vì `ADD CONSTRAINT` là cú pháp mức bảng (trừ khi viết `ADD CONSTRAINT emp_email_nn CHECK (email IS NOT NULL)`).
  * **D sai:** `RENAME COLUMN` chỉ dùng để đổi tên cột.
</details>

---

### Câu 4 (Question 4)
**Xem xét 2 câu lệnh `CREATE TABLE` dưới đây để tạo bảng `EMP` có khóa ngoại tham chiếu đến bảng `DEPT(dept_id)`. Phát biểu nào sau đây là ĐÚNG?**

```sql
-- Lệnh 1:
CREATE TABLE emp1 (
    emp_id  NUMBER PRIMARY KEY,
    dept_id NUMBER CONSTRAINT fk_dept1 FOREIGN KEY REFERENCES dept(dept_id)
);

-- Lệnh 2:
CREATE TABLE emp2 (
    emp_id  NUMBER PRIMARY KEY,
    dept_id NUMBER,
    CONSTRAINT fk_dept2 FOREIGN KEY (dept_id) REFERENCES dept(dept_id)
);
```

* A. Cả Lệnh 1 và Lệnh 2 đều thực thi thành công.
* B. Lệnh 1 thành công, nhưng Lệnh 2 báo lỗi cú pháp.
* C. Lệnh 1 báo lỗi cú pháp vì xuất hiện từ khóa `FOREIGN KEY` ở mức cột, còn Lệnh 2 thực thi thành công.
* D. Cả Lệnh 1 và Lệnh 2 đều báo lỗi vì thiếu mệnh đề `ON DELETE`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là bẫy cú pháp cực kỳ phổ biến trong đề thi 1Z0-071:
    * Khi khai báo khóa ngoại ở **mức Cột (Inline)** như Lệnh 1, bạn **tuyệt đối KHÔNG được viết từ khóa `FOREIGN KEY`**, mà chỉ viết thẳng `dept_id NUMBER CONSTRAINT fk_dept1 REFERENCES dept(dept_id)`. Việc viết thêm chữ `FOREIGN KEY` ở mức cột gây lỗi `ORA-02253: constraint specification not allowed here`.
    * Khi khai báo khóa ngoại ở **mức Bảng (Out-of-line)** như Lệnh 2, bạn **bắt buộc phải viết `FOREIGN KEY (dept_id)`** trước `REFERENCES`. Do đó Lệnh 2 hoàn toàn hợp lệ.
  * **A, B, D sai:** Mệnh đề `ON DELETE` là tùy chọn, không bắt buộc.
</details>

---

### Câu 5 (Question 5)
**Bảng `SUBSCRIBERS` được tạo với ràng buộc `UNIQUE` ghép trên 2 cột `(city_code, phone_no)` như dưới đây. Sau đó, 4 câu lệnh `INSERT` được thực thi tuần tự. Câu lệnh `INSERT` nào sẽ bị BÁO LỖI vi phạm ràng buộc `UNIQUE`?**

```sql
CREATE TABLE subscribers (
    sub_id    NUMBER PRIMARY KEY,
    city_code VARCHAR2(10),
    phone_no  VARCHAR2(20),
    CONSTRAINT uk_city_phone UNIQUE (city_code, phone_no)
);

-- (1) INSERT INTO subscribers VALUES (1, NULL, NULL);
-- (2) INSERT INTO subscribers VALUES (2, NULL, NULL);
-- (3) INSERT INTO subscribers VALUES (3, 'HN', NULL);
-- (4) INSERT INTO subscribers VALUES (4, 'HN', NULL);
```

* A. Câu lệnh `(2)` báo lỗi vì không thể có hai dòng cùng mang `(NULL, NULL)`.
* B. Câu lệnh `(3)` báo lỗi vì cột nằm trong Composite `UNIQUE` không được phép chứa `NULL`.
* C. Câu lệnh `(4)` báo lỗi `ORA-00001` vì trong Composite `UNIQUE`, khi có ít nhất một cột khác `NULL` (`'HN'`), tổ hợp `('HN', NULL)` không được phép lặp lại lần thứ hai.
* D. Không có câu lệnh nào báo lỗi; cả 4 dòng đều được chèn thành công.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong Oracle Database, đối với một ràng buộc `UNIQUE` ghép trên nhiều cột (`Composite UNIQUE`):
    * Nếu **tất cả các cột thành phần đều là `NULL`** như ở câu lệnh `(1)` và `(2)` `(NULL, NULL)`, Oracle không đưa khóa đó vào B-Tree Index nên cho phép chèn lặp lại bao nhiêu dòng `(NULL, NULL)` cũng được!
    * Tuy nhiên, nếu **có ít nhất một cột thành phần khác `NULL`** như ở câu lệnh `(3)` `('HN', NULL)`, bộ giá trị này sẽ được đánh chỉ mục trong Unique Index. Khi câu lệnh `(4)` cố chèn thêm một dòng `('HN', NULL)` nữa, Oracle xác định hai bộ `('HN', NULL)` là trùng lặp và ném ra lỗi `ORA-00001: unique constraint (UK_CITY_PHONE) violated`!
  * **A, B, D sai:** Đây là điểm khác biệt rất đặc trưng của Oracle đối với Composite Unique Key mà thí sinh thi OCP bắt buộc phải nhớ.
</details>

---

### Câu 6 (Question 6)
**Bạn muốn tạo bảng `ORDER_DETAILS` có khóa chính ghép (Composite Primary Key) bao gồm hai cột `ORDER_ID` và `PRODUCT_ID`. Câu lệnh nào sau đây là HỢP LỆ?**

* A. `CREATE TABLE order_details (order_id NUMBER PRIMARY KEY, product_id NUMBER PRIMARY KEY, qty NUMBER);`
* B. `CREATE TABLE order_details (order_id NUMBER, product_id NUMBER, qty NUMBER, CONSTRAINT pk_od PRIMARY KEY (order_id, product_id));`
* C. `CREATE TABLE order_details (order_id NUMBER, product_id NUMBER, qty NUMBER, PRIMARY KEY (order_id) AND (product_id));`
* D. `CREATE TABLE order_details (order_id NUMBER COMPOSITE KEY, product_id NUMBER COMPOSITE KEY, qty NUMBER);`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Vì mỗi bảng chỉ được phép có tối đa 1 `PRIMARY KEY`, nên khi khóa chính được tạo từ 2 cột trở lên (Composite Primary Key), bạn **bắt buộc phải khai báo ở mức Bảng (Table-level)**: `CONSTRAINT pk_od PRIMARY KEY (order_id, product_id)`.
  * **A sai:** Viết `PRIMARY KEY` ở từng cột riêng lẻ sẽ khiến Oracle hiểu rằng bạn đang cố tạo 2 khóa chính khác nhau trên cùng một bảng, dẫn đến lỗi `ORA-02260: table can have only one primary key`.
  * **C, D sai:** Cú pháp hoàn toàn không tồn tại trong SQL.
</details>

---

### Câu 7 (Question 7)
**Bảng `PARENT_DEPT` được tạo bằng câu lệnh: `CREATE TABLE parent_dept (dept_id NUMBER, dept_name VARCHAR2(30));` (không khai báo bất kỳ Constraint nào). Sau đó bạn tạo một chỉ mục thường: `CREATE INDEX idx_dept_id ON parent_dept(dept_id);`. Điều gì sẽ xảy ra khi bạn tạo bảng con `CHILD_EMP` có khóa ngoại tham chiếu đến `parent_dept(dept_id)`?**

```sql
CREATE TABLE child_emp (
    emp_id  NUMBER PRIMARY KEY,
    dept_id NUMBER REFERENCES parent_dept(dept_id)
);
```

* A. Thực thi thành công vì trên cột `parent_dept(dept_id)` đã có sẵn một Index.
* B. Thực thi thành công và Oracle tự động nâng cấp `idx_dept_id` thành `PRIMARY KEY`.
* C. Thất bại và báo lỗi `ORA-02270: no matching unique or primary key for this column-list` vì cột được tham chiếu ở bảng Cha bắt buộc phải có ràng buộc `PRIMARY KEY` hoặc `UNIQUE`.
* D. Thực thi thành công nếu bảng `PARENT_DEPT` đang trống.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Một ràng buộc khóa ngoại (`FOREIGN KEY`) chỉ được phép tham chiếu đến một cột (hoặc bộ cột) ở bảng Cha đang được bảo vệ bởi một **Constraint `PRIMARY KEY` hoặc `UNIQUE`**. Việc chỉ có một Index (thậm chí kể cả là `Unique Index` nhưng chưa tạo Constraint `UNIQUE` hay `PRIMARY KEY`) trên bảng Cha vẫn không đủ điều kiện, và Oracle sẽ báo lỗi `ORA-02270`.
  * **A, B, D sai:** Index không thể thay thế cho Constraint khi thiết lập toàn vẹn tham chiếu.
</details>

---

### Câu 8 (Question 8)
**Trong Oracle Database, khi định nghĩa ràng buộc khóa ngoại (`FOREIGN KEY`), những mệnh đề xử lý sự kiện nào sau đây là HỢP LỆ về mặt cú pháp?**

* A. `ON DELETE CASCADE`, `ON DELETE SET NULL`, và `ON UPDATE CASCADE`
* B. `ON DELETE CASCADE`, `ON DELETE SET NULL`, và `ON DELETE RESTRICT`
* C. `ON DELETE CASCADE`, `ON DELETE SET NULL`, và `ON DELETE SET DEFAULT`
* D. Chỉ có `ON DELETE CASCADE` và `ON DELETE SET NULL` (hoặc lược bỏ không viết mệnh đề `ON DELETE`).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Đây là bẫy cực lớn trong đề thi OCA/OCP 1Z0-071 và đề thi tuyển dụng VNPT! Trong Oracle SQL, đối với ràng buộc `FOREIGN KEY`, bạn chỉ có thể:
    1. Không viết mệnh đề `ON DELETE` (áp dụng hành vi mặc định là cấm xóa dòng Cha nếu đang có dòng Con).
    2. Viết `ON DELETE CASCADE` (xóa dòng Cha thì xóa luôn dòng Con).
    3. Viết `ON DELETE SET NULL` (xóa dòng Cha thì đặt cột khóa ngoại ở dòng Con thành `NULL`).
  * **A, B, C sai:** Trong Oracle SQL **hoàn toàn KHÔNG TỒN TẠI** các cú pháp `ON UPDATE CASCADE`, `ON DELETE RESTRICT`, `ON DELETE NO ACTION`, hay `ON DELETE SET DEFAULT`! Viết bất kỳ cụm từ nào trong số này vào câu lệnh `CREATE/ALTER TABLE` sẽ lập tức bị báo lỗi cú pháp.
</details>

---

### Câu 9 (Question 9)
**Bảng `DEPARTMENTS` có dòng `dept_id = 10`. Bảng `EMPLOYEES` được tạo thành công bằng câu lệnh dưới đây và đang có 1 nhân viên thuộc `dept_id = 10`. Điều gì xảy ra khi bạn thực thi câu lệnh `DELETE FROM departments WHERE dept_id = 10;`?**

```sql
CREATE TABLE employees (
    emp_id  NUMBER PRIMARY KEY,
    dept_id NUMBER NOT NULL
            CONSTRAINT fk_dept REFERENCES departments(dept_id) ON DELETE SET NULL
);
```

* A. Bản thân câu lệnh `CREATE TABLE employees` đã bị lỗi ngay từ đầu vì không thể kết hợp `NOT NULL` với `ON DELETE SET NULL`.
* B. Dòng `dept_id = 10` trong `DEPARTMENTS` bị xóa và cột `dept_id` của nhân viên được đổi thành `0`.
* C. Câu lệnh `DELETE FROM departments WHERE dept_id = 10;` thất bại và báo lỗi `ORA-01407: cannot update ("EMPLOYEES"."DEPT_ID") to NULL` vì cột `dept_id` có ràng buộc `NOT NULL`.
* D. Cả phòng ban `10` và nhân viên thuộc phòng ban `10` đều bị xóa khỏi cơ sở dữ liệu.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:**
    * Đầu tiên, Oracle **cho phép tạo bảng** có cột vừa mang `NOT NULL` vừa mang `ON DELETE SET NULL` mà không báo lỗi lúc chạy `CREATE TABLE`.
    * Tuy nhiên, khi bạn thực thi `DELETE FROM departments WHERE dept_id = 10;`, cơ chế `ON DELETE SET NULL` sẽ kích hoạt lệnh cập nhật ngầm định để gán `dept_id = NULL` cho các dòng con trong bảng `EMPLOYEES`. Ngay lúc này, ràng buộc `NOT NULL` trên cột `EMPLOYEES.DEPT_ID` chặn lại và ném ra lỗi `ORA-01407: cannot update ("EMPLOYEES"."DEPT_ID") to NULL`, làm hủy bỏ lệnh `DELETE`!
  * **A, B, D sai:** Chỉ `ON DELETE CASCADE` mới xóa dòng con (D).
</details>

---

### Câu 10 (Question 10)
**Bảng `PRODUCTS` được tạo với ràng buộc `CHECK` như dưới đây. Sau đó bạn thực thi 3 câu lệnh `INSERT`. Những câu lệnh `INSERT` nào sẽ thực thi THÀNH CÔNG?**

```sql
CREATE TABLE products (
    prod_id NUMBER PRIMARY KEY,
    price   NUMBER CONSTRAINT chk_price CHECK (price >= 100 AND price <= 5000)
);

-- Lệnh 1: INSERT INTO products VALUES (1, 500);
-- Lệnh 2: INSERT INTO products VALUES (2, 50);
-- Lệnh 3: INSERT INTO products VALUES (3, NULL);
```

* A. Chỉ Lệnh 1
* B. Chỉ Lệnh 1 và Lệnh 3
* C. Chỉ Lệnh 1 và Lệnh 2
* D. Cả 3 lệnh đều thành công

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Ràng buộc `CHECK` trong Oracle hoạt động theo logic 3 giá trị: nó chỉ từ chối dòng dữ liệu khi biểu thức điều kiện trả về **`FALSE`**, và cho phép mọi dòng có điều kiện trả về **`TRUE` hoặc `UNKNOWN` (`NULL`)**:
    * **Lệnh 1 (`price = 500`):** Biểu thức trả về `TRUE` → Thành công.
    * **Lệnh 2 (`price = 50`):** Biểu thức trả về `FALSE` → Báo lỗi `ORA-02290: check constraint violated`.
    * **Lệnh 3 (`price = NULL`):** Biểu thức `NULL >= 100 AND NULL <= 5000` trả về `UNKNOWN` (không phải `FALSE`), và cột `price` không có ràng buộc `NOT NULL` → **Chèn `NULL` hoàn toàn thành công!**
  * **A, C, D sai:** Nhiều thí sinh quên mất rằng `CHECK (price >= 100)` vẫn cho phép chèn `NULL` nếu cột đó không khai báo `NOT NULL`.
</details>

---

### Câu 11 (Question 11)
**Biểu thức ràng buộc `CHECK` nào dưới đây là HỢP LỆ khi khai báo ở mức Bảng (Table-level) trong lệnh `CREATE TABLE employees`?**

* A. `CONSTRAINT chk_hire CHECK (hire_date <= SYSDATE)`
* B. `CONSTRAINT chk_comp CHECK (salary + NVL(commission, 0) > 1000)`
* C. `CONSTRAINT chk_dept CHECK (dept_id IN (SELECT dept_id FROM departments))`
* D. `CONSTRAINT chk_row CHECK (ROWNUM <= 1000)`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi khai báo ở mức Bảng (Out-of-line), ràng buộc `CHECK` được phép tham chiếu đến nhiều cột trên cùng một dòng của bảng đó (`salary`, `commission`) và sử dụng các hàm SQL chuẩn có tính tất định (deterministic) như `NVL`, `UPPER`, `LOWER`, `ROUND`...
  * **A sai:** Cấm sử dụng các hàm thời gian động hoặc môi trường như `SYSDATE`, `CURRENT_DATE`, `USER`, `UID` trong `CHECK` (`ORA-02436: date or system variable wrongly specified in CHECK constraint`).
  * **C sai:** Cấm sử dụng câu truy vấn con (`Subquery`) trong `CHECK` (`ORA-02251: subquery not allowed here`).
  * **D sai:** Cấm sử dụng các cột giả (`ROWNUM`, `ROWID`, `LEVEL`, `NEXTVAL`, `CURRVAL`) trong `CHECK`.
</details>

---

### Câu 12 (Question 12)
**Tại sao câu lệnh `CREATE TABLE` dưới đây lại báo lỗi khi thực thi?**

```sql
CREATE TABLE project_tasks (
    task_id    NUMBER PRIMARY KEY,
    start_date DATE,
    end_date   DATE CONSTRAINT chk_task_dates CHECK (end_date >= start_date)
);
```

* A. Không thể so sánh hai giá trị kiểu `DATE` bằng toán tử `>=`.
* B. Ràng buộc `chk_task_dates` đang được khai báo ở mức Cột (Inline) của cột `end_date`, nhưng lại tham chiếu đến một cột khác là `start_date` (`ORA-02438`).
* C. Tên của Constraint không được chứa dấu gạch dưới `_`.
* D. Bắt buộc phải có hàm `TO_DATE` khi so sánh hai cột ngày tháng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Một ràng buộc `CHECK` khi được khai báo ở **mức Cột (Inline)** chỉ được phép tham chiếu đến **duy nhất chính cột đó**! Ở đây `chk_task_dates` viết ngay trên dòng định nghĩa của `end_date` (không có dấu phẩy ngăn cách trước chữ `CONSTRAINT`) nhưng lại nhắc đến cột `start_date`, nên Oracle sẽ báo lỗi `ORA-02438: Column check constraint cannot reference other columns`. Để sửa đúng, chỉ cần thêm một dấu phẩy `,` sau `end_date DATE` để đưa `CONSTRAINT chk_task_dates CHECK (end_date >= start_date)` xuống mức Bảng (Out-of-line)!
  * **A, C, D sai:** Hai cột kiểu `DATE` so sánh trực tiếp bằng `>=` hoàn toàn hợp lệ khi khai báo `CHECK` ở mức Bảng.
</details>

---

### Câu 13 (Question 13)
**Bảng `DEPARTMENTS` có khóa chính `DEPT_ID` đang được tham chiếu bởi khóa ngoại của bảng `EMPLOYEES`. Câu lệnh nào sau đây cho phép xóa khóa chính của bảng `DEPARTMENTS` đồng thời tự động xóa luôn ràng buộc khóa ngoại phụ thuộc ở bảng `EMPLOYEES`?**

* A. `ALTER TABLE departments DROP PRIMARY KEY CASCADE;`
* B. `ALTER TABLE departments DROP PRIMARY KEY FORCE;`
* C. `ALTER TABLE departments DELETE PRIMARY KEY CASCADE CONSTRAINTS;`
* D. `ALTER TABLE departments DROP PRIMARY KEY ON DELETE CASCADE;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Khi xóa một `PRIMARY KEY` hoặc `UNIQUE` (hoặc `DROP CONSTRAINT pk_name`) mà đang có các ràng buộc `FOREIGN KEY` ở bảng khác tham chiếu vào nó, bạn phải thêm từ khóa **`CASCADE`** ở cuối lệnh: `ALTER TABLE departments DROP PRIMARY KEY CASCADE;`. Oracle sẽ tự động xóa các ràng buộc `FOREIGN KEY` phụ thuộc ở bảng con (nhưng không xóa dữ liệu của bảng con).
  * **B, C, D sai:** `FORCE` và `ON DELETE CASCADE` không phải là cú pháp hợp lệ của `ALTER TABLE ... DROP PRIMARY KEY`.
</details>

---

### Câu 14 (Question 14)
**Bảng `ORDERS` hiện đang có `10,000` dòng dữ liệu lịch sử, trong đó có một số dòng cũ có `order_total < 0`. Từ hôm nay trở đi, bạn muốn thêm một ràng buộc `CHECK (order_total >= 0)` trên bảng `ORDERS` sao cho: các dòng lịch sử cũ có `order_total < 0` vẫn được giữ nguyên không báo lỗi, nhưng mọi câu lệnh `INSERT` hoặc `UPDATE` mới từ nay về sau bắt buộc phải thỏa mãn `order_total >= 0`. Bạn nên dùng trạng thái Constraint nào?**

* A. `ENABLE VALIDATE`
* B. `ENABLE NOVALIDATE`
* C. `DISABLE VALIDATE`
* D. `DISABLE NOVALIDATE`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trạng thái **`ENABLE NOVALIDATE`** được thiết kế chính xác cho tình huống này:
    * `NOVALIDATE`: Không quét kiểm tra dữ liệu cũ đang nằm sẵn trong bảng (nhờ đó lệnh bật Constraint chạy xong tức thì và không bị lỗi bởi các dòng lịch sử có `order_total < 0`).
    * `ENABLE`: Áp dụng kiểm tra nghiêm ngặt cho mọi thao tác DML (`INSERT`, `UPDATE`) diễn ra kể từ thời điểm bật Constraint trở đi.
  * **A sai:** `ENABLE VALIDATE` sẽ kiểm tra toàn bộ 10,000 dòng hiện có và báo lỗi ngay khi gặp dòng cũ có `order_total < 0` (`ORA-02293: cannot validate - check constraint violated`).
  * **C, D sai:** `DISABLE` sẽ không kiểm tra các dòng mới theo quy tắc của Constraint.
</details>

---

### Câu 15 (Question 15)
**Một ràng buộc `CHECK` trên bảng `SALES_DATA` được chuyển sang trạng thái `DISABLE VALIDATE` bằng câu lệnh dưới đây. Điều gì sẽ xảy ra khi một người dùng thực thi câu lệnh `INSERT INTO sales_data VALUES (101, 500);`?**

```sql
ALTER TABLE sales_data MODIFY CONSTRAINT chk_sales DISABLE VALIDATE;
```

* A. Dòng dữ liệu được chèn thành công mà không cần kiểm tra điều kiện `chk_sales`.
* B. Dòng dữ liệu được kiểm tra theo điều kiện `chk_sales` rồi mới chèn.
* C. Câu lệnh `INSERT` bị từ chối và báo lỗi `ORA-25128` vì trạng thái `DISABLE VALIDATE` cấm toàn bộ các thao tác `INSERT`, `UPDATE`, `DELETE` trên bảng.
* D. Oracle tự động chuyển trạng thái Constraint sang `ENABLE VALIDATE` rồi chèn dòng mới.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trạng thái **`DISABLE VALIDATE`** có nghĩa là: ràng buộc kiểm tra đã bị tắt (`DISABLE`), nhưng Oracle vẫn cam kết toàn bộ dữ liệu trong bảng là hợp lệ 100% (`VALIDATE`). Để duy trì cam kết đó khi bộ kiểm tra đã tắt, Oracle **khóa chặt bảng đối với mọi thao tác DML (`INSERT`, `UPDATE`, `DELETE`)**! Mọi lệnh DML chạy trên bảng có Constraint `DISABLE VALIDATE` đều bị chặn với lỗi `ORA-25128: No insert/update/delete on table with constraint disabled and validated`.
  * **A, B, D sai:** Đây là câu hỏi phân loại thí sinh rất điển hình trong đề thi OCP.
</details>

---

### Câu 16 (Question 16)
**Khi bạn tạo mới một bảng và khai báo `PRIMARY KEY` (không truyền thêm tùy chọn Index và không dùng `DEFERRABLE`), sau đó bạn thực thi lệnh `ALTER TABLE emp DISABLE PRIMARY KEY;` (không có mệnh đề `KEEP INDEX`). Điều gì sẽ xảy ra với `Unique Index` mà Oracle đã tự động tạo cho khóa chính đó?**

* A. `Unique Index` đó vẫn tồn tại bình thường và tiếp tục chặn dữ liệu trùng lặp.
* B. `Unique Index` đó tự động bị xóa (Dropped) khỏi cơ sở dữ liệu.
* C. `Unique Index` đó được chuyển sang trạng thái `UNUSABLE`.
* D. `Unique Index` đó được chuyển thành `Bitmap Index`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi một `PRIMARY KEY` hoặc `UNIQUE` constraint tạo ra một `Unique Index` hệ thống đi kèm, việc thực thi lệnh `DISABLE` (hoặc `DROP`) constraint đó mà không chỉ định tùy chọn `KEEP INDEX` sẽ khiến Oracle **tự động xóa luôn `Unique Index` đó**! Khi bạn `ENABLE` lại khóa chính về sau, Oracle sẽ phải tạo lại một `Unique Index` mới từ đầu.
  * **A, C, D sai:** Nếu muốn giữ lại Index khi tắt hoặc xóa PK/UK, bạn phải viết tường minh: `ALTER TABLE emp DISABLE PRIMARY KEY KEEP INDEX;`.
</details>

---

### Câu 17 (Question 17)
**Bạn tạo bảng `TEST_DEF` với câu lệnh sau: `CREATE TABLE test_def (id NUMBER CONSTRAINT pk_test PRIMARY KEY, name VARCHAR2(20));`. Sau đó trong một giao dịch, bạn muốn trì hoãn việc kiểm tra khóa chính `pk_test` cho đến lúc gọi `COMMIT`. Bạn nên làm gì?**

* A. Chạy lệnh `SET CONSTRAINT pk_test DEFERRED;` ngay đầu giao dịch.
* B. Chạy lệnh `ALTER TABLE test_def MODIFY CONSTRAINT pk_test INITIALLY DEFERRED;` rồi thực hiện giao dịch.
* C. Chạy lệnh `ALTER TABLE test_def MODIFY CONSTRAINT pk_test DEFERRABLE;` rồi thực hiện giao dịch.
* D. Phải xóa ràng buộc `pk_test` (`DROP CONSTRAINT`) và tạo lại nó (`ADD CONSTRAINT`) với từ khóa `DEFERRABLE`, vì một Constraint mặc định (`NOT DEFERRABLE`) không thể được chuyển sang `DEFERRABLE` bằng `ALTER TABLE` hay `SET CONSTRAINT`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Khi tạo một Constraint mà không ghi từ khóa `DEFERRABLE`, trạng thái mặc định của nó là **`NOT DEFERRABLE`**. Thuộc tính `DEFERRABLE` / `NOT DEFERRABLE` được cố định ngay từ lúc tạo Constraint và **tuyệt đối không thể sửa đổi bằng lệnh `ALTER TABLE ... MODIFY CONSTRAINT`**! Để có thể trì hoãn kiểm tra, cách duy nhất là `DROP CONSTRAINT pk_test` rồi `ADD CONSTRAINT pk_test PRIMARY KEY (id) DEFERRABLE`.
  * **A, B, C sai:** Thực hiện A hoặc B trên một Constraint `NOT DEFERRABLE` sẽ lập tức văng lỗi `ORA-02447: cannot defer a constraint that is not deferrable`. Thực hiện C sẽ báo lỗi cú pháp.
</details>

---

### Câu 18 (Question 18)
**Nếu khi tạo một Constraint bạn chỉ định từ khóa `DEFERRABLE` nhưng KHÔNG ghi rõ `INITIALLY IMMEDIATE` hay `INITIALLY DEFERRED`, thì hành vi mặc định của Constraint đó sẽ là gì?**

```sql
CREATE TABLE emp_check (
    emp_id NUMBER PRIMARY KEY,
    salary NUMBER CONSTRAINT chk_sal CHECK (salary > 0) DEFERRABLE
);
```

* A. Mặc định là `DEFERRABLE INITIALLY DEFERRED` (luôn chờ đến khi `COMMIT` mới kiểm tra).
* B. Mặc định là `DEFERRABLE INITIALLY IMMEDIATE` (kiểm tra ngay sau mỗi câu lệnh DML, nhưng cho phép dùng `SET CONSTRAINT` để chuyển sang `DEFERRED` khi cần).
* C. Câu lệnh báo lỗi cú pháp vì từ khóa `DEFERRABLE` bắt buộc phải đi kèm `INITIALLY`.
* D. Mặc định là `NOT DEFERRABLE`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi bạn khai báo `DEFERRABLE` mà lược bỏ phần `INITIALLY ...`, Oracle mặc định thiết lập là **`DEFERRABLE INITIALLY IMMEDIATE`**. Nghĩa là bình thường nó vẫn kiểm tra ngay tại cuối mỗi câu lệnh DML, nhưng bất kỳ lúc nào trong phiên làm việc bạn cũng có thể gọi `SET CONSTRAINT chk_sal DEFERRED;` (hoặc `SET CONSTRAINTS ALL DEFERRED;`) để hoãn kiểm tra đến lúc `COMMIT`.
  * **A, C, D sai:** Muốn mặc định hoãn ngay từ đầu mà không cần gọi `SET CONSTRAINT`, bạn phải ghi đầy đủ `DEFERRABLE INITIALLY DEFERRED`.
</details>

---

### Câu 19 (Question 19)
**Khi bạn tạo một ràng buộc `PRIMARY KEY` hoặc `UNIQUE` với tùy chọn `DEFERRABLE` trên một bảng mới chưa có Index nào, Oracle sẽ tự động tạo loại Index nào để phục vụ cho Constraint đó?**

```sql
CREATE TABLE invoices (
    inv_id NUMBER CONSTRAINT pk_inv PRIMARY KEY DEFERRABLE INITIALLY DEFERRED,
    amount NUMBER
);
```

* A. Tạo một `Unique B-Tree Index`.
* B. Tạo một `Non-Unique B-Tree Index`.
* C. Tạo một `Bitmap Index`.
* D. Không tạo bất kỳ Index nào.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Vì một `PRIMARY KEY` hoặc `UNIQUE` thuộc loại **`DEFERRABLE`** cho phép người dùng chèn các dòng có khóa trùng lặp tạm thời trong suốt quá trình Transaction đang chạy (chỉ kiểm tra tính duy nhất tại thời điểm gọi `COMMIT`), nên nếu dùng `Unique Index` thì tầng Index sẽ chặn ngay lập tức lúc `INSERT`! Do đó, đối với mọi PK/UK có thuộc tính `DEFERRABLE`, Oracle bắt buộc phải tự động tạo một **`Non-Unique B-Tree Index`**!
  * **A sai:** Chỉ khi PK/UK là `NOT DEFERRABLE` (mặc định) thì Oracle mới tự động tạo `Unique Index`.
  * **C, D sai:** PK/UK luôn cần B-Tree Index để thực thi kiểm tra nhanh.
</details>

---

### Câu 20 (Question 20)
**Bảng `PRODUCTS (id NUMBER CONSTRAINT pk_prod PRIMARY KEY DEFERRABLE INITIALLY DEFERRED, name VARCHAR2(20))` hiện đang trống (`0` dòng). Bạn thực thi kịch bản dưới đây trong một Session. Hỏi sau khi kết thúc kịch bản, bảng `PRODUCTS` có bao nhiêu dòng?**

```sql
INSERT INTO products VALUES (10, 'Phone');
INSERT INTO products VALUES (20, 'Tablet');
INSERT INTO products VALUES (20, 'Laptop'); -- Trùng id = 20!
COMMIT;
```

* A. `2` dòng (`10` và một trong hai dòng `20`)
* B. `1` dòng (chỉ còn dòng `10`)
* C. `0` dòng (vì khi `COMMIT` phát hiện vi phạm Constraint `DEFERRED`, Oracle báo lỗi và tự động `ROLLBACK` toàn bộ Transaction!)
* D. `3` dòng (vì `DEFERRED` bỏ qua kiểm tra trùng lặp khi `COMMIT`)

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Hãy phân biệt thật kỹ hành vi của `IMMEDIATE` và `DEFERRED`:
    * Trong lúc chạy 3 câu lệnh `INSERT`, vì `pk_prod` là `INITIALLY DEFERRED`, cả 3 câu lệnh đều báo `1 row created` mà không kiểm tra trùng lặp.
    * Ngay khi người dùng gọi lệnh **`COMMIT;`**, Oracle tiến hành kiểm tra toàn bộ các ràng buộc `DEFERRED`. Phát hiện hai dòng cùng có `id = 20` vi phạm khóa chính `pk_prod`, lệnh `COMMIT` thất bại với lỗi `ORA-02091: transaction rolled back` kèm `ORA-00001: unique constraint violated`, và **Oracle TỰ ĐỘNG `ROLLBACK` TOÀN BỘ TRANSACTION** (hủy sạch cả dòng `10` lẫn hai dòng `20`)! Do đó bảng quay về trạng thái `0` dòng.
  * **A, B, D sai:** Nếu `pk_prod` là `IMMEDIATE` (mặc định), thì dòng thứ 3 bị lỗi ngay lúc `INSERT` (Statement-level Rollback) và lệnh `COMMIT` ở cuối sẽ lưu lại 2 dòng đầu tiên (đáp án A). Nhưng vì ở đây là `DEFERRED` nên lỗi xảy ra lúc `COMMIT`, kéo theo **Transaction-level Rollback**!
</details>

---

### Câu 21 (Question 21)
**Câu lệnh `SET CONSTRAINTS ALL DEFERRED;` có phạm vi ảnh hưởng trong bao lâu?**

* A. Có hiệu lực vĩnh viễn cho mọi Session trong toàn bộ cơ sở dữ liệu cho đến khi khởi động lại DB.
* B. Có hiệu lực cho toàn bộ các Transaction trong Session hiện tại cho đến khi người dùng đăng xuất (Disconnect).
* C. Chỉ có hiệu lực đối với **duy nhất Transaction hiện tại** của Session đó; ngay khi thực thi `COMMIT` hoặc `ROLLBACK`, chế độ kiểm tra sẽ tự động quay về trạng thái mặc định ban đầu (`INITIALLY ...`) của từng Constraint.
* D. Chỉ có hiệu lực đối với duy nhất câu lệnh DML tiếp theo.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Câu lệnh `SET CONSTRAINT(S) {constraint_name | ALL} {IMMEDIATE | DEFERRED};` là một lệnh thiết lập ở **cấp độ Giao dịch (Transaction-level)**. Ngay khi Transaction hiện tại kết thúc (bằng `COMMIT` hoặc `ROLLBACK`), thiết lập này hết hiệu lực và các Constraint quay trở về chế độ `INITIALLY IMMEDIATE` hoặc `INITIALLY DEFERRED` đã định nghĩa trong Data Dictionary.
  * **A, B, D sai:** Nếu muốn đổi ở cấp độ Session cho nhiều Transaction liên tiếp, phải dùng `ALTER SESSION SET CONSTRAINTS = DEFERRED;`. Nếu muốn đổi mặc định vĩnh viễn của Constraint cho mọi người dùng, phải dùng `ALTER TABLE ... MODIFY CONSTRAINT ... INITIALLY DEFERRED;`.
</details>

---

### Câu 22 (Question 22)
**Bảng `EMP` có cột `EMP_ID` là `PRIMARY KEY` và cột `MGR_ID` là một khóa ngoại tự tham chiếu (`FOREIGN KEY (mgr_id) REFERENCES emp(emp_id)`). Hiện tại bảng `EMP` đang hoàn toàn trống (`0` dòng). Câu lệnh `INSERT` đầu tiên nào sau đây vào bảng `EMP` sẽ thực thi THÀNH CÔNG (giả sử các Constraint đều ở chế độ `IMMEDIATE` mặc định)?**

```sql
CREATE TABLE emp (
    emp_id NUMBER PRIMARY KEY,
    mgr_id NUMBER REFERENCES emp(emp_id)
);
```

* A. `INSERT INTO emp (emp_id, mgr_id) VALUES (100, 101);`
* B. `INSERT INTO emp (emp_id, mgr_id) VALUES (100, NULL);`
* C. `INSERT INTO emp (emp_id, mgr_id) VALUES (100, 100);`
* D. Cả B và C đều thực thi thành công!

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Với khóa ngoại tự tham chiếu (`mgr_id REFERENCES emp(emp_id)`), khi chèn dòng đầu tiên vào bảng trống:
    * **Phương án B (`100, NULL`):** Cột khóa ngoại `mgr_id` không có ràng buộc `NOT NULL` nên hoàn toàn chấp nhận giá trị `NULL` (nhân viên cao nhất / Giám đốc không có người quản lý).
    * **Phương án C (`100, 100`):** Oracle kiểm tra ràng buộc khóa ngoại ở thời điểm kết thúc câu lệnh `INSERT` (sau khi giá trị `emp_id = 100` của chính dòng đó đã được đưa vào bảng). Do đó, một dòng tự tham chiếu đến chính `emp_id = 100` của nó hoàn toàn hợp lệ và thành công!
  * **A sai:** Vì `emp_id = 101` chưa tồn tại trong bảng `EMP` nên sẽ báo lỗi `ORA-02291: integrity constraint violated - parent key not found`.
</details>

---

### Câu 23 (Question 23)
**Khi thực thi câu lệnh `INSERT` vào bảng Con (`EMPLOYEES`) với một mã phòng ban `dept_id = 999` không tồn tại trong bảng Cha (`DEPARTMENTS`), Oracle sẽ báo lỗi nào? Và ngược lại, khi thực thi câu lệnh `DELETE` trên bảng Cha (`DEPARTMENTS`) đối với một phòng ban đang có nhân viên trong bảng Con tham chiếu tới, Oracle sẽ báo lỗi nào?**

* A. Khi `INSERT` bảng Con báo lỗi `parent key not found` (`ORA-02291`); khi `DELETE` bảng Cha báo lỗi `child record found` (`ORA-02292`).
* B. Khi `INSERT` bảng Con báo lỗi `child record found` (`ORA-02292`); khi `DELETE` bảng Cha báo lỗi `parent key not found` (`ORA-02291`).
* C. Cả hai trường hợp đều báo lỗi `unique constraint violated` (`ORA-00001`).
* D. Khi `INSERT` bảng Con thì tự động thêm dòng mới vào bảng Cha; khi `DELETE` bảng Cha thì báo lỗi `child record found`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Hai thông báo lỗi kinh điển của toàn vẹn tham chiếu (`FOREIGN KEY`):
    * Chèn vào bảng Con (hoặc sửa FK bảng Con) thành một giá trị không có trong bảng Cha → **`ORA-02291: integrity constraint violated - parent key not found`** (Không tìm thấy khóa Cha).
    * Xóa dòng ở bảng Cha (hoặc sửa PK bảng Cha) khi đang có dòng ở bảng Con trỏ tới (và không dùng `CASCADE` / `SET NULL`) → **`ORA-02292: integrity constraint violated - child record found`** (Tìm thấy bản ghi Con đang phụ thuộc).
  * **B, C, D sai:** Đảo ngược thông báo lỗi giữa bảng Cha và bảng Con.
</details>

---

### Câu 24 (Question 24)
**Bảng `CUSTOMERS` có cột `CUST_CODE VARCHAR2(10)`. Bạn thực hiện tuần tự 2 bước sau:**
1. Tạo một chỉ mục không duy nhất (Non-Unique Index): `CREATE INDEX idx_cust_code ON customers(cust_code);`
2. Thêm ràng buộc khóa chính: `ALTER TABLE customers ADD CONSTRAINT pk_cust PRIMARY KEY (cust_code);`

**Hỏi sau khi bước 2 hoàn tất, điều gì xảy ra với chỉ mục trên cột `CUST_CODE`?**

* A. Câu lệnh ở bước 2 báo lỗi vì cột `CUST_CODE` đã có sẵn một Non-Unique Index.
* B. Oracle tạo thêm một `Unique Index` thứ hai tên là `PK_CUST` song song với `IDX_CUST_CODE`.
* C. Oracle tự động sử dụng luôn chỉ mục `IDX_CUST_CODE` đang có sẵn để thực thi ràng buộc `PRIMARY KEY` mà không tạo thêm Index mới.
* D. Oracle xóa `IDX_CUST_CODE` và tạo mới `Unique Index` tên là `PK_CUST`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong Oracle Database, một ràng buộc `PRIMARY KEY` hoặc `UNIQUE` hoàn toàn có thể được bảo vệ bởi một **Non-Unique Index**! Khi bạn thêm `PRIMARY KEY` (hoặc `UNIQUE`) vào cột `cust_code`, Oracle phát hiện trên cột này đã tồn tại sẵn chỉ mục `IDX_CUST_CODE` nên sẽ **tái sử dụng ngay chỉ mục `IDX_CUST_CODE`** để kiểm tra tính duy nhất cho khóa chính mà không tạo thêm bất kỳ Index dư thừa nào nữa. (Và vì `IDX_CUST_CODE` là Index do người dùng tự tạo trước đó, nên nếu sau này bạn `DISABLE PRIMARY KEY`, chỉ mục `IDX_CUST_CODE` vẫn được giữ nguyên chứ không bị xóa tự động!).
  * **A, B, D sai:** Oracle không cho phép tạo 2 Index có cùng danh sách cột giống hệt nhau, và luôn ưu tiên tái sử dụng Index hiện có.
</details>

---

### Câu 25 (Question 25)
**Bạn muốn xem danh sách tên các cột cụ thể đang tham gia vào từng Constraint (ví dụ để biết khóa ghép `PK_ORDER_ITEMS` gồm những cột nào và theo thứ tự vị trí nào) trong Schema của mình. Bạn cần truy vấn Data Dictionary View nào sau đây?**

* A. `USER_CONSTRAINTS`
* B. `USER_CONS_COLUMNS`
* C. `USER_TAB_COLUMNS`
* D. `USER_INDEXES`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * View **`USER_CONSTRAINTS`** lưu thông tin chung của từng Constraint (`CONSTRAINT_NAME`, `CONSTRAINT_TYPE`, `TABLE_NAME`, `SEARCH_CONDITION`, `STATUS`, `DEFERRABLE`, `VALIDATED`...), nhưng **KHÔNG có cột `COLUMN_NAME`**!
    * Để biết chính xác từng Constraint gắn với những cột nào (`COLUMN_NAME`) và thứ tự của cột trong khóa ghép (`POSITION`), bạn bắt buộc phải truy vấn view **`USER_CONS_COLUMNS`** (hoặc `ALL_CONS_COLUMNS` / `DBA_CONS_COLUMNS`).
  * **A, C, D sai:** Đây là câu hỏi thực tế rất hay gặp trong phần Data Dictionary của đề thi OCA 1Z0-071: nhớ kỹ rằng `USER_CONSTRAINTS` không chứa tên cột, mà phải xem trong `USER_CONS_COLUMNS`!
</details>

---
