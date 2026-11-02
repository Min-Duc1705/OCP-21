# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 11: DDL và Quản Lý Table (DDL & Schema Objects Management)

> **Tài liệu tham chiếu:** *OCA/OCP Oracle Database SQL Exam Guide (Exam 1Z0-071)* & Đề thi sát hạch CNTT VNPT.  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết.  
> **Cách học:** Bạn hãy tự đọc đề và chọn đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và nắm vững bẫy thi.

---

### Câu 1 (Question 1)
**Tên bảng nào sau đây là một định danh chuẩn hợp lệ (Nonquoted Identifier - không dùng dấu ngoặc kép) trong Oracle Database?**

* A. `_EMP_HISTORY_2026`
* B. `2026_SALES_DATA`
* C. `EMP$SAL#INFO_1`
* D. `EMP-SALARY-TABLE`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Một định danh không đặt trong dấu ngoặc kép (Nonquoted Identifier) trong Oracle phải bắt đầu bằng một chữ cái (`A-Z`, `a-z`), và các ký tự tiếp theo được phép chứa chữ cái, chữ số (`0-9`), cùng 3 ký tự đặc biệt là dấu gạch dưới (`_`), ký hiệu đô la (`$`), và dấu thăng (`#`). Do đó `EMP$SAL#INFO_1` hoàn toàn hợp lệ.
  * **A, B sai:** Định danh không bọc ngoặc kép trong Oracle **không được phép bắt đầu bằng dấu `_` hoặc chữ số** (khác với ngôn ngữ lập trình Java hay C nơi tên biến có thể bắt đầu bằng `_`).
  * **D sai:** Dấu gạch ngang (`-`) bị hiểu là toán tử trừ, không được phép xuất hiện trong Nonquoted Identifier.
</details>

---

### Câu 2 (Question 2)
**Trong cùng một Schema (User) của Oracle Database, đối tượng nào sau đây CÓ THỂ được đặt tên trùng với tên của một bảng (`TABLE`) đã tồn tại?**

* A. `VIEW`
* B. `SEQUENCE`
* C. `INDEX`
* D. `PRIVATE SYNONYM`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong Oracle, `INDEX` (cùng với `CONSTRAINT` và `TRIGGER`) nằm trong không gian tên (**Namespace**) riêng biệt so với bảng. Vì vậy, nếu bạn đã có bảng tên là `EMPLOYEES`, bạn vẫn có thể tạo một Index tên là `EMPLOYEES` hoặc một Constraint tên là `EMPLOYEES` trong cùng Schema đó.
  * **A, B, D sai:** `TABLE`, `VIEW`, `SEQUENCE`, và `PRIVATE SYNONYM` dùng chung một Namespace trong cùng một Schema, nên không bao giờ được phép đặt trùng tên với nhau (`ORA-00955: name is already used by an existing object`).
</details>

---

### Câu 3 (Question 3)
**Xem xét câu lệnh tạo bảng và 2 câu lệnh `INSERT` dưới đây. Sau khi thực thi xong, giá trị của `(col_a, col_b)` ở dòng `id = 2` là bao nhiêu?**

```sql
CREATE TABLE test_def (
    id    NUMBER PRIMARY KEY,
    col_a NUMBER DEFAULT 10,
    col_b NUMBER DEFAULT ON NULL 20
);

INSERT INTO test_def (id) VALUES (1);
INSERT INTO test_def (id, col_a, col_b) VALUES (2, NULL, NULL);
```

* A. `(10, 20)`
* B. `(NULL, 20)`
* C. `(NULL, NULL)`
* D. Câu lệnh `INSERT` thứ hai báo lỗi vì không thể truyền `NULL` vào cột có `DEFAULT ON NULL`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * Cột `col_a` được khai báo với `DEFAULT 10` thông thường: giá trị mặc định chỉ được áp dụng khi cột bị lược bỏ khỏi danh sách cột (như ở dòng `id = 1`) hoặc khi truyền từ khóa `DEFAULT`. Khi người dùng truyền tường minh `NULL` ở dòng `id = 2`, `col_a` sẽ nhận giá trị `NULL`.
    * Cột `col_b` được khai báo với `DEFAULT ON NULL 20`: ngay cả khi người dùng truyền tường minh `NULL` trong câu lệnh `INSERT`, Oracle sẽ tự động thay thế `NULL` bằng giá trị mặc định `20`.
    * Do đó tại dòng `id = 2`, bộ giá trị của `(col_a, col_b)` là `(NULL, 20)`.
  * **A, C, D sai:** Nhầm lẫn giữa hành vi của `DEFAULT` truyền thống và `DEFAULT ON NULL` (tính năng từ Oracle 12c+).
</details>

---

### Câu 4 (Question 4)
**Tiếp tục với bảng `TEST_DEF` ở Câu 3 (trong đó `col_b NUMBER DEFAULT ON NULL 20`). Điều gì sẽ xảy ra khi bạn thực thi câu lệnh `UPDATE` sau đây?**

```sql
UPDATE test_def
SET col_b = NULL
WHERE id = 1;
```

* A. Giá trị của `col_b` tại dòng `id = 1` tự động được cập nhật thành `20`.
* B. Giá trị của `col_b` tại dòng `id = 1` được cập nhật thành `NULL`.
* C. Câu lệnh thất bại và báo lỗi `ORA-01407: cannot update ("TEST_DEF"."COL_B") to NULL`.
* D. Câu lệnh chạy thành công nhưng không có dòng nào bị thay đổi.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khi khai báo một cột với mệnh đề `DEFAULT ON NULL`, Oracle **tự động thêm ràng buộc `NOT NULL` ngầm định** lên cột đó. Hơn nữa, cơ chế tự động biến `NULL` thành giá trị mặc định của `DEFAULT ON NULL` **chỉ hoạt động đối với thao tác `INSERT`**, không hoạt động khi `UPDATE`! Vì vậy khi chạy `UPDATE test_def SET col_b = NULL`, cột không được gán `20` mà bị chặn bởi ràng buộc `NOT NULL` với lỗi `ORA-01407`.
  * **A, B, D sai:** Đây là bẫy rất hiểm trong đề thi OCP khi hỏi về sự khác biệt giữa `INSERT` và `UPDATE` trên cột `DEFAULT ON NULL`.
</details>

---

### Câu 5 (Question 5)
**Bảng `CUSTOMERS` được tạo bằng câu lệnh dưới đây. Câu lệnh `INSERT` nào sau đây sẽ thực thi THÀNH CÔNG?**

```sql
CREATE TABLE customers (
    cust_id   NUMBER GENERATED ALWAYS AS IDENTITY,
    cust_name VARCHAR2(50)
);
```

* A. `INSERT INTO customers VALUES (1, 'Nguyen Van A');`
* B. `INSERT INTO customers VALUES (NULL, 'Nguyen Van A');`
* C. `INSERT INTO customers (cust_name) VALUES ('Nguyen Van A');`
* D. Cả A và C đều thực thi thành công.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Với cột được khai báo là `GENERATED ALWAYS AS IDENTITY`, giá trị của cột **luôn luôn** do hệ thống tự sinh ra từ Sequence nội bộ. Người dùng bắt buộc phải lược bỏ cột `cust_id` khỏi danh sách cột khi `INSERT` (hoặc truyền từ khóa `DEFAULT`).
  * **A, B, D sai:** Nếu cố tình truyền bất kỳ giá trị nào (dù là số `1` hay `NULL`) vào cột `GENERATED ALWAYS AS IDENTITY`, Oracle sẽ lập tức báo lỗi `ORA-32795: cannot insert into a generated always identity column`.
</details>

---

### Câu 6 (Question 6)
**Phát biểu nào sau đây là ĐÚNG về cột tự tăng `IDENTITY` trong Oracle Database?**

* A. Một bảng có thể chứa tối đa 2 cột `IDENTITY` (một cột làm khóa chính và một cột làm khóa phụ).
* B. Khi khai báo một cột là `IDENTITY`, Oracle tự động biến cột đó thành `PRIMARY KEY` của bảng.
* C. Cột `IDENTITY` bắt buộc phải có kiểu dữ liệu số (Numeric data type), tự động mang ràng buộc `NOT NULL`, và mỗi bảng chỉ được có tối đa 1 cột `IDENTITY`.
* D. Khi tạo bảng mới bằng lệnh `CREATE TABLE ... AS SELECT` (CTAS), thuộc tính `IDENTITY` sẽ được sao chép nguyên vẹn sang bảng mới.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong Oracle, mỗi bảng chỉ được phép có **duy nhất 1 cột `IDENTITY`**, kiểu dữ liệu của cột bắt buộc phải là kiểu số (`NUMBER`, `INTEGER`...), và Oracle tự động áp đặt ràng buộc `NOT NULL` (cùng `NOT DEFERRABLE`) cho cột này.
  * **A sai:** Mỗi bảng chỉ có tối đa 1 cột `IDENTITY` (`ORA-30673` nếu tạo cột thứ 2).
  * **B sai:** Cột `IDENTITY` **không tự động là `PRIMARY KEY` hay `UNIQUE`**. Nếu dùng `GENERATED BY DEFAULT` mà không khai báo thêm `PRIMARY KEY`, bảng hoàn toàn có thể chứa các giá trị trùng nhau.
  * **D sai:** Lệnh CTAS không sao chép thuộc tính `IDENTITY` sang bảng mới (cột ở bảng mới chỉ còn là cột số có ràng buộc `NOT NULL`).
</details>

---

### Câu 7 (Question 7)
**Bảng `EMPLOYEES` có các ràng buộc sau: `EMP_ID` là `PRIMARY KEY`, `EMAIL` là `UNIQUE`, `FULL_NAME` là `NOT NULL`, `SALARY` có `CHECK (salary > 0)` và `DEFAULT 1000`, `DEPT_ID` là `FOREIGN KEY`. Bạn thực thi câu lệnh CTAS dưới đây để tạo bảng `EMP_COPY`. Hỏi trên bảng `EMP_COPY`, những ràng buộc hoặc thuộc tính nào được giữ lại?**

```sql
CREATE TABLE emp_copy AS
SELECT emp_id, email, full_name, salary, dept_id
FROM employees;
```

* A. Tất cả các ràng buộc `PRIMARY KEY`, `UNIQUE`, `NOT NULL`, `CHECK` và `DEFAULT` đều được giữ lại (chỉ trừ `FOREIGN KEY`).
* B. Chỉ có `PRIMARY KEY` trên `EMP_ID` và `NOT NULL` trên `FULL_NAME` được giữ lại.
* C. Chỉ có ràng buộc `NOT NULL` (trên cột `FULL_NAME` và cột `EMP_ID` vốn kế thừa tính `NOT NULL` từ khóa chính) được giữ lại; toàn bộ `PRIMARY KEY`, `UNIQUE`, `FOREIGN KEY`, `CHECK` và `DEFAULT` đều không được sao chép.
* D. Không có bất kỳ ràng buộc nào (kể cả `NOT NULL`) được sao chép sang bảng `EMP_COPY`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Quy tắc bất di bất dịch của lệnh `CREATE TABLE ... AS SELECT` (CTAS) là **chỉ sao chép cấu trúc cột (tên cột, kiểu dữ liệu, kích thước) và duy nhất ràng buộc `NOT NULL`**! Mọi ràng buộc `PRIMARY KEY`, `UNIQUE`, `FOREIGN KEY`, `CHECK`, giá trị `DEFAULT`, thuộc tính `IDENTITY` và các `INDEX` đều bị lược bỏ hoàn toàn trên bảng mới.
  * **A, B, D sai:** Đây là câu hỏi kinh điển xuất hiện gần như 100% trong các đề thi OCA 1Z0-071.
</details>

---

### Câu 8 (Question 8)
**Tại sao câu lệnh `CREATE TABLE ... AS SELECT` dưới đây lại thất bại khi thực thi?**

```sql
CREATE TABLE emp_bonus_report AS
SELECT emp_id, full_name, salary * 0.15
FROM employees
WHERE dept_id = 20;
```

* A. Không được phép sử dụng mệnh đề `WHERE` trong câu lệnh `CREATE TABLE ... AS SELECT`.
* B. Biểu thức tính toán `salary * 0.15` không có bí danh cột (Column Alias), khiến Oracle không biết đặt tên gì cho cột thứ 3 của bảng mới (`ORA-00998`).
* C. Thiếu từ khóa `INTO` sau tên bảng `emp_bonus_report`.
* D. Không thể thực hiện phép nhân số học trực tiếp trong câu lệnh DDL.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong lệnh CTAS, tên các cột của bảng mới được lấy tự động từ tên các cột trong câu lệnh `SELECT`. Nếu trong `SELECT` có chứa một biểu thức tính toán (`salary * 0.15`) hoặc hàm (`UPPER(full_name)`), bạn **bắt buộc** phải đặt bí danh cột (ví dụ `salary * 0.15 AS bonus`) hoặc khai báo danh sách tên cột ngay sau tên bảng `CREATE TABLE emp_bonus_report (id, name, bonus) AS SELECT ...`. Nếu không sẽ bị lỗi `ORA-00998: must name this expression with a column alias`.
  * **A, C, D sai:** Mệnh đề `WHERE` và các phép toán đều hợp lệ trong CTAS, và CTAS dùng từ khóa `AS` chứ không dùng `INTO`.
</details>

---

### Câu 9 (Question 9)
**Bảng `PRODUCTS` hiện đang có `500` dòng dữ liệu. Bạn muốn thêm một cột mới tên là `STATUS` có kiểu `VARCHAR2(10)` và bắt buộc phải có ràng buộc `NOT NULL` ngay trong câu lệnh `ALTER TABLE ... ADD`. Câu lệnh nào sau đây sẽ thực thi THÀNH CÔNG?**

* A. `ALTER TABLE products ADD (status VARCHAR2(10) NOT NULL);`
* B. `ALTER TABLE products ADD (status VARCHAR2(10) DEFAULT 'ACTIVE' NOT NULL);`
* C. `ALTER TABLE products ADD COLUMN (status VARCHAR2(10) DEFAULT 'ACTIVE' NOT NULL);`
* D. Không thể thêm cột `NOT NULL` vào bảng đang có dữ liệu trong mọi trường hợp; bắt buộc phải xóa trắng bảng trước.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi bảng đã có dữ liệu (500 dòng), nếu thêm một cột mới có ràng buộc `NOT NULL`, bạn **bắt buộc phải khai báo kèm giá trị `DEFAULT`** (khác `NULL`) để Oracle tự động điền giá trị mặc định đó cho toàn bộ 500 dòng hiện hữu.
  * **A sai:** Thêm cột `NOT NULL` mà không có `DEFAULT` vào bảng đang có dữ liệu sẽ bị lỗi `ORA-01758: table must be empty to add mandatory (NOT NULL) column`.
  * **C sai:** Trong Oracle SQL, cú pháp thêm cột là `ALTER TABLE ... ADD (...)`, **không có từ khóa `COLUMN`** sau chữ `ADD`!
  * **D sai:** Có thể thêm trực tiếp nếu đi kèm `DEFAULT`, hoặc thêm cột cho phép `NULL` trước rồi `UPDATE` dữ liệu xong mới `MODIFY` thành `NOT NULL`.
</details>

---

### Câu 10 (Question 10)
**Bảng `EMPLOYEES` hiện đang có `1,000` dòng dữ liệu. Cột `JOB_TITLE` có kiểu `VARCHAR2(50)` và độ dài chuỗi lớn nhất hiện đang lưu trong cột này trên toàn bảng là `18` ký tự. Cột `SALARY` có kiểu `NUMBER(10,2)` và mọi dòng đều đang có lương khác `NULL`. Phát biểu nào sau đây là ĐÚNG khi sử dụng lệnh `ALTER TABLE employees MODIFY`?**

* A. Bạn có thể giảm kích thước cột `JOB_TITLE` xuống `VARCHAR2(20)` thành công, nhưng KHÔNG THỂ giảm độ rộng cột `SALARY` xuống `NUMBER(8,2)`.
* B. Cả hai cột `JOB_TITLE` và `SALARY` đều không thể giảm kích thước vì bảng đang có dữ liệu khác `NULL`.
* C. Bạn có thể giảm độ rộng của cả `JOB_TITLE` xuống `VARCHAR2(20)` và `SALARY` xuống `NUMBER(8,2)` miễn là không có số lương nào vượt quá 6 chữ số phần nguyên.
* D. Bạn có thể đổi kiểu dữ liệu của cột `JOB_TITLE` sang `NUMBER(20)` mà không cần xóa dữ liệu.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Đây là điểm khác biệt rất quan trọng giữa kiểu chuỗi và kiểu số khi dùng `ALTER TABLE ... MODIFY`:
    * Đối với kiểu chuỗi (`VARCHAR2`, `CHAR`): Oracle **cho phép giảm độ rộng cột** ngay cả khi cột đang chứa dữ liệu, miễn là mọi giá trị hiện có đều có độ dài $\le$ kích thước mới (ở đây lớn nhất là `18` ký tự $\le 20$ nên thành công!).
    * Đối với kiểu số (`NUMBER`): Để giảm độ chính xác (Precision) hoặc phần thập phân (Scale), cột đó **bắt buộc phải chứa toàn giá trị `NULL` trên mọi dòng** (hoặc bảng phải rỗng), bất kể giá trị số hiện tại nhỏ đến đâu (`ORA-01440: column to be modified must be empty to decrease precision or scale`).
  * **B, C, D sai:** Đổi kiểu dữ liệu (`VARCHAR2` sang `NUMBER`) cũng bắt buộc cột đó phải đang rỗng (`NULL` toàn bộ).
</details>

---

### Câu 11 (Question 11)
**Bảng `ORDERS` có 4 cột: `ORDER_ID`, `ORDER_DATE`, `TEMP_NOTE1`, `TEMP_NOTE2`. Bạn muốn xóa cùng lúc 2 cột `TEMP_NOTE1` và `TEMP_NOTE2` bằng một câu lệnh duy nhất. Câu lệnh nào sau đây có cú pháp HỢP LỆ trong Oracle SQL?**

```sql
-- Bảng ORDERS (order_id, order_date, temp_note1, temp_note2)
```

* A. `ALTER TABLE orders DROP COLUMN temp_note1, temp_note2;`
* B. `ALTER TABLE orders DROP COLUMN (temp_note1, temp_note2);`
* C. `ALTER TABLE orders DROP (temp_note1, temp_note2);`
* D. `ALTER TABLE orders DELETE (temp_note1, temp_note2);`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khi xóa **nhiều cột** cùng lúc trong Oracle, danh sách tên cột bắt buộc phải đặt trong cặp ngoặc đơn `(col1, col2)` và **tuyệt đối KHÔNG có từ khóa `COLUMN`** sau chữ `DROP`: `ALTER TABLE orders DROP (temp_note1, temp_note2);`.
  * **A, B sai:** Từ khóa `DROP COLUMN` chỉ dùng khi xóa **1 cột đơn lẻ** và không có ngoặc đơn (`ALTER TABLE orders DROP COLUMN temp_note1;`). Nếu viết `DROP COLUMN (c1, c2)` sẽ báo lỗi `ORA-00905: missing keyword`.
  * **D sai:** `DELETE` dùng để xóa dòng dữ liệu, không dùng để xóa cột trong `ALTER TABLE`.
</details>

---

### Câu 12 (Question 12)
**Khi bạn thực thi câu lệnh `ALTER TABLE employees SET UNUSED (commission_pct);`, những điều nào sau đây sẽ xảy ra? (Chọn đáp án chính xác nhất)**

* A. Cột `commission_pct` bị ẩn tạm thời khỏi lệnh `SELECT *`, và bạn có thể khôi phục lại cột này bất cứ lúc nào bằng lệnh `ALTER TABLE employees SET USED (commission_pct);`.
* B. Dữ liệu vật lý của cột `commission_pct` được xóa khỏi mọi Data Block ngay lập tức để giải phóng dung lượng ổ đĩa.
* C. Cột `commission_pct` bị đánh dấu không sử dụng trong Data Dictionary (không thể truy vấn và **không bao giờ khôi phục lại được**), đồng thời cho phép bạn tạo ngay một cột mới khác mang tên `commission_pct` trên bảng `employees`.
* D. Bạn có thể dùng lệnh `ROLLBACK;` ngay sau đó để lấy lại cột `commission_pct`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Lệnh `SET UNUSED` chỉ cập nhật metadata trong Data Dictionary nên chạy xong ngay tức khắc. Kể từ giây phút đó, cột `commission_pct` coi như đã bị xóa về mặt logic: không xuất hiện khi `DESCRIBE` hay `SELECT`, **không thể khôi phục lại bằng bất kỳ lệnh nào**, và bạn hoàn toàn có thể `ALTER TABLE employees ADD (commission_pct NUMBER)` để thêm cột mới trùng tên!
  * **A sai:** Trong Oracle không tồn tại câu lệnh `SET USED`.
  * **B sai:** Dữ liệu vật lý vẫn còn nằm trong các Data Block cho đến khi chạy lệnh `ALTER TABLE employees DROP UNUSED COLUMNS;`.
  * **D sai:** `ALTER TABLE` là lệnh DDL nên tự động `COMMIT`, không thể `ROLLBACK`.
</details>

---

### Câu 13 (Question 13)
**Bảng `ARCHIVE_LOGS` vừa được chuyển sang chế độ chỉ đọc bằng câu lệnh `ALTER TABLE archive_logs READ ONLY;`. Trong khi bảng đang ở trạng thái `READ ONLY`, câu lệnh nào dưới đây VẪN ĐƯỢC PHÉP thực thi thành công?**

```sql
ALTER TABLE archive_logs READ ONLY;
```

* A. `TRUNCATE TABLE archive_logs;`
* B. `ALTER TABLE archive_logs DROP COLUMN log_detail;`
* C. `DROP TABLE archive_logs;`
* D. `SELECT * FROM archive_logs FOR UPDATE;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là bẫy kinh điển nhất về bảng `READ ONLY`: Chế độ `READ ONLY` chỉ ngăn chặn các thao tác làm thay đổi nội dung dữ liệu bên trong các Data Block của bảng. Trong khi đó, câu lệnh **`DROP TABLE archive_logs;`** chỉ thao tác trên Data Dictionary (đưa bảng vào Recycle Bin hoặc giải phóng toàn bộ Segment) nên **hoàn toàn được phép thực thi thành công** trên bảng `READ ONLY`! (Tương tự, `ALTER TABLE ... SET UNUSED` và `ALTER TABLE ... ADD` cột không cập nhật block cũng được phép).
  * **A, B, D sai:** `TRUNCATE TABLE`, `ALTER TABLE ... DROP COLUMN` (xóa vật lý dữ liệu cột trên block), và `SELECT ... FOR UPDATE` (đặt khóa dòng để sửa) đều bị cấm trên bảng `READ ONLY` và sẽ ném lỗi `ORA-12081: update operation not allowed on table`.
</details>

---

### Câu 14 (Question 14)
**Tham số hệ thống `RECYCLEBIN` đang được bật (`ON`). Bạn thực hiện tuần tự các thao tác sau:**
1. Tạo bảng `SALES` (có 100 dòng) rồi chạy `DROP TABLE sales;`.
2. Tạo lại một bảng `SALES` mới (có 5 dòng) rồi lại chạy `DROP TABLE sales;`.
3. Chạy câu lệnh `FLASHBACK TABLE sales TO BEFORE DROP;`.

**Hỏi sau bước 3, bảng `SALES` được khôi phục sẽ có bao nhiêu dòng?**

* A. 100 dòng (khôi phục bảng đầu tiên bị xóa theo quy tắc FIFO).
* B. 5 dòng (khôi phục bảng vừa bị xóa gần nhất theo quy tắc LIFO).
* C. 105 dòng (hợp nhất cả 2 bảng trong thùng rác).
* D. Câu lệnh `FLASHBACK TABLE` báo lỗi vì trong Recycle Bin đang có 2 bảng trùng tên `SALES`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi có nhiều phiên bản của cùng một tên bảng nằm trong `USER_RECYCLEBIN`, câu lệnh `FLASHBACK TABLE sales TO BEFORE DROP;` (khi gọi theo tên gốc `sales` thay vì tên hệ thống `BIN$...`) sẽ luôn tuân theo nguyên tắc **LIFO (Last In, First Out — Xóa sau Khôi phục trước)**, tức là khôi phục bảng `SALES` vừa bị xóa gần đây nhất (bảng có 5 dòng).
  * **A, C, D sai:** Nếu muốn khôi phục bảng 100 dòng đầu tiên, bạn vẫn có thể gọi tiếp `FLASHBACK TABLE sales TO BEFORE DROP RENAME TO sales_old;` hoặc chỉ định trực tiếp tên hệ thống `FLASHBACK TABLE "BIN$..." TO BEFORE DROP`.
</details>

---

### Câu 15 (Question 15)
**Khi một bảng bị xóa bằng lệnh `DROP TABLE emp;` và sau đó được khôi phục lại từ thùng rác bằng lệnh `FLASHBACK TABLE emp TO BEFORE DROP;`, thành phần nào sau đây của bảng `EMP` sẽ KHÔNG được khôi phục lại?**

* A. Các chỉ mục (`INDEX`) được tạo trên bảng `EMP`.
* B. Ràng buộc khóa chính (`PRIMARY KEY`) và ràng buộc `CHECK` của bảng `EMP`.
* C. Ràng buộc khóa ngoại (`FOREIGN KEY`) của bảng `EMP`.
* D. Ràng buộc `NOT NULL` trên các cột của bảng `EMP`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khi một bảng bị đưa vào Recycle Bin và sau đó được khôi phục bằng `FLASHBACK TABLE ... TO BEFORE DROP`, toàn bộ dữ liệu, các `INDEX` (trừ Bitmap Join Index), cùng các ràng buộc `PRIMARY KEY`, `UNIQUE`, `CHECK`, `NOT NULL` và `TRIGGER` đều được khôi phục lại (nhưng mang tên hệ thống `BIN$...`). Duy nhất các ràng buộc **Khóa ngoại (`FOREIGN KEY` / Referential Integrity Constraints)** là bị xóa vĩnh viễn ngay lúc `DROP TABLE` và **không được khôi phục lại**!
  * **A, B, D sai:** Các thành phần này đều được bảo toàn trong Recycle Bin và khôi phục cùng bảng.
</details>

---

### Câu 16 (Question 16)
**Bảng `DEPARTMENTS` có khóa chính là `DEPT_ID` và đang có 10 phòng ban. Bảng `EMPLOYEES` có khóa ngoại `DEPT_ID` tham chiếu đến `DEPARTMENTS(DEPT_ID)` đang ở trạng thái `ENABLED`, nhưng hiện tại bảng `EMPLOYEES` hoàn toàn trống (`0` dòng). Bạn thực thi câu lệnh `TRUNCATE TABLE departments;`. Kết quả sẽ là gì?**

```sql
-- DEPARTMENTS: 10 dòng (PK: dept_id)
-- EMPLOYEES: 0 dòng (FK: dept_id REFERENCES departments(dept_id) ENABLE)
TRUNCATE TABLE departments;
```

* A. Thực thi thành công và xóa sạch 10 phòng ban vì bảng `EMPLOYEES` không có dòng dữ liệu con nào.
* B. Thất bại và báo lỗi `ORA-02266: unique/primary keys in table referenced by enabled foreign keys`.
* C. Thực thi thành công và tự động xóa luôn bảng `EMPLOYEES`.
* D. Thực thi thành công nhưng tự động chuyển khóa ngoại trên bảng `EMPLOYEES` sang trạng thái `DISABLED`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khác với lệnh DML `DELETE` (vốn kiểm tra từng dòng xem có dòng con thực tế hay không), lệnh DDL `TRUNCATE TABLE` chỉ kiểm tra trong Data Dictionary! Chỉ cần phát hiện có bất kỳ bảng nào khác đang có ràng buộc `FOREIGN KEY` ở trạng thái **`ENABLED`** trỏ vào bảng `DEPARTMENTS`, lệnh `TRUNCATE TABLE departments;` sẽ bị từ chối ngay lập tức với lỗi `ORA-02266`, **bất chấp bảng con `EMPLOYEES` đang trống 0 dòng**!
  * **A, C, D sai:** Để `TRUNCATE` được `DEPARTMENTS`, bạn bắt buộc phải `DISABLE` (hoặc `DROP`) khóa ngoại ở bảng `EMPLOYEES` trước (hoặc khóa ngoại đó phải được tạo với `ON DELETE CASCADE` và dùng lệnh `TRUNCATE TABLE departments CASCADE;`).
</details>

---

### Câu 17 (Question 17)
**Bạn muốn đổi tên bảng `EMP_OLD` thành `EMP_NEW` trong Schema của mình. Cặp câu lệnh nào dưới đây đều có cú pháp HỢP LỆ trong Oracle SQL?**

* A. `RENAME TABLE emp_old TO emp_new;` và `ALTER TABLE emp_old RENAME TO emp_new;`
* B. `RENAME emp_old TO emp_new;` và `ALTER TABLE emp_old RENAME TO emp_new;`
* C. `RENAME emp_old TO emp_new;` và `ALTER TABLE RENAME emp_old TO emp_new;`
* D. `ALTER RENAME TABLE emp_old TO emp_new;` và `RENAME TABLE emp_old TO emp_new;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong Oracle SQL có đúng 2 cách đổi tên bảng hợp lệ:
    1. Dùng câu lệnh `RENAME` độc lập: `RENAME emp_old TO emp_new;` (Lưu ý: **Tuyệt đối không có từ khóa `TABLE`** sau chữ `RENAME`!).
    2. Dùng câu lệnh `ALTER TABLE`: `ALTER TABLE emp_old RENAME TO emp_new;`.
  * **A, C, D sai:** Viết `RENAME TABLE ...` là bẫy cú pháp rất hay gặp khiến thí sinh mất điểm.
</details>

---

### Câu 18 (Question 18)
**Một bảng tạm toàn cục (`GLOBAL TEMPORARY TABLE`) được tạo bằng câu lệnh dưới đây (không chỉ định mệnh đề `ON COMMIT`). Session A chèn 5 dòng vào bảng `TEMP_REPORT` rồi thực thi lệnh `COMMIT;`. Ngay sau đó, Session A chạy `SELECT COUNT(*) FROM temp_report;`. Kết quả trả về là bao nhiêu?**

```sql
CREATE GLOBAL TEMPORARY TABLE temp_report (
    rep_id   NUMBER,
    rep_data VARCHAR2(100)
);
```

* A. `5`
* B. `0`
* C. Báo lỗi vì không thể tạo `GLOBAL TEMPORARY TABLE` mà thiếu mệnh đề `ON COMMIT`.
* D. Báo lỗi vì không được phép gọi lệnh `COMMIT` sau khi chèn dữ liệu vào bảng tạm.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi tạo `GLOBAL TEMPORARY TABLE` mà không ghi tường minh mệnh đề `ON COMMIT`, Oracle sẽ áp dụng chế độ mặc định là **`ON COMMIT DELETE ROWS`** (dữ liệu chỉ tồn tại trong phạm vi một Transaction). Do đó, ngay khi Session A thực thi lệnh `COMMIT;`, toàn bộ 5 dòng vừa chèn sẽ tự động bị xóa sạch, và câu lệnh `SELECT COUNT(*)` tiếp theo trả về `0`!
  * **A sai:** Chỉ khi khai báo tường minh `ON COMMIT PRESERVE ROWS` thì dữ liệu mới được giữ lại qua các lần `COMMIT` (cho đến khi thoát Session).
  * **C, D sai:** Mệnh đề `ON COMMIT` là tùy chọn (mặc định `DELETE ROWS`) và lệnh `COMMIT` hoàn toàn hợp lệ.
</details>

---

### Câu 19 (Question 19)
**Từ Oracle 18c trở đi, khi tạo một bảng tạm riêng tư (`PRIVATE TEMPORARY TABLE`) với cấu hình tham số hệ thống mặc định, câu lệnh nào sau đây là HỢP LỆ?**

* A. `CREATE PRIVATE TEMPORARY TABLE my_temp_tab (id NUMBER) ON COMMIT PRESERVE ROWS;`
* B. `CREATE PRIVATE TEMPORARY TABLE ora$ptt_my_temp (id NUMBER) ON COMMIT PRESERVE DEFINITION;`
* C. `CREATE PRIVATE TEMPORARY TABLE ora$ptt_my_temp (id NUMBER) ON COMMIT DELETE ROWS;`
* D. `CREATE PRIVATE TEMPORARY TABLE ptt_my_temp (id NUMBER) ON COMMIT DROP DEFINITION;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đối với `PRIVATE TEMPORARY TABLE` (PTT), có 2 quy tắc cú pháp bắt buộc phải phân biệt rõ với GTT:
    1. Tên bảng bắt buộc phải bắt đầu bằng tiền tố trong tham số `PRIVATE_TEMP_TABLE_PREFIX`, mặc định là **`ORA$PTT_`** (`ora$ptt_my_temp`).
    2. Mệnh đề `ON COMMIT` của PTT sử dụng từ khóa **`DEFINITION`** (`ON COMMIT DROP DEFINITION` mặc định hoặc `ON COMMIT PRESERVE DEFINITION`), chứ không dùng chữ `ROWS` như GTT!
  * **A, C, D sai:** A và D thiếu tiền tố bắt buộc `ORA$PTT_`; A và C dùng sai từ khóa `ROWS` (vốn chỉ dành cho `GLOBAL TEMPORARY TABLE`).
</details>

---

### Câu 20 (Question 20)
**Phát biểu nào sau đây là ĐÚNG khi nói về Bảng Ngoại (`EXTERNAL TABLE`) trong Oracle Database?**

* A. Bạn có thể tạo `B-Tree Index` trên cột khóa của `EXTERNAL TABLE` để tăng tốc độ tìm kiếm dữ liệu trong file CSV.
* B. Bạn có thể dùng câu lệnh `UPDATE` và `DELETE` trên `EXTERNAL TABLE` nếu sử dụng driver `ORACLE_DATAPUMP`.
* C. Khi bạn thực thi lệnh `DROP TABLE` trên một `EXTERNAL TABLE`, cả định nghĩa bảng trong Database lẫn file dữ liệu vật lý trên hệ điều hành đều bị xóa.
* D. `EXTERNAL TABLE` không cho phép thực hiện bất kỳ câu lệnh DML (`INSERT`, `UPDATE`, `DELETE`, `MERGE`) nào và không hỗ trợ tạo `INDEX`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Dữ liệu của `EXTERNAL TABLE` nằm ở file bên ngoài hệ điều hành (OS file), nên trong Oracle Database bạn chỉ có thể truy vấn `SELECT` (hoặc tạo file xuất dữ liệu một lần lúc chạy `CREATE TABLE ... ORGANIZATION EXTERNAL ... AS SELECT` với driver `ORACLE_DATAPUMP`). Mọi thao tác DML (`INSERT`, `UPDATE`, `DELETE`, `MERGE`) và việc tạo `INDEX` trên `EXTERNAL TABLE` đều bị cấm hoàn toàn (`ORA-30657: operation not supported on external organized table`).
  * **A, B sai:** Không thể tạo Index hay chạy DML trên External Table với bất kỳ driver nào.
  * **C sai:** Lệnh `DROP TABLE` trên External Table chỉ xóa metadata trong Data Dictionary của Oracle, tuyệt đối không xóa file vật lý trên hệ điều hành.
</details>

---

### Câu 21 (Question 21)
**Khi tạo một bảng tổ chức theo chỉ mục (`Index-Organized Table - IOT`) bằng mệnh đề `ORGANIZATION INDEX`, yêu cầu nào sau đây là BẮT BUỘC để câu lệnh `CREATE TABLE` không bị báo lỗi?**

```sql
CREATE TABLE countries_iot (
    country_id   CHAR(2) ...,
    country_name VARCHAR2(40)
) ORGANIZATION INDEX;
```

* A. Bảng bắt buộc phải có ít nhất một cột kiểu số (`NUMBER`).
* B. Bảng bắt buộc phải được khai báo ràng buộc khóa chính (`PRIMARY KEY`).
* C. Bảng bắt buộc phải có mệnh đề `TABLESPACE temp`.
* D. Bảng bắt buộc phải có ít nhất một cột `GENERATED ALWAYS AS IDENTITY`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong bảng `Index-Organized Table (IOT)`, toàn bộ các dòng dữ liệu được lưu trữ trực tiếp bên trong cấu trúc cây B-Tree Index và được sắp xếp vật lý theo giá trị của khóa chính. Do đó, việc khai báo **`PRIMARY KEY` là bắt buộc** ngay khi tạo bảng IOT. Nếu thiếu `PRIMARY KEY`, Oracle sẽ báo lỗi `ORA-25175: no PRIMARY KEY constraint found`.
  * **A, C, D sai:** Khóa chính của IOT có thể là `CHAR`, `VARCHAR2`, `DATE` hoặc `NUMBER`, và IOT được lưu trong Permanent Tablespace thông thường chứ không phải `TEMP`.
</details>

---

### Câu 22 (Question 22)
**Điểm khác biệt chính xác nhất giữa câu lệnh `DELETE FROM emp;` (không có `WHERE`) và `TRUNCATE TABLE emp;` là gì?**

* A. `DELETE` xóa cả cấu trúc bảng còn `TRUNCATE` giữ lại cấu trúc bảng.
* B. `TRUNCATE` kích hoạt các `AFTER DELETE` DML Triggers trên bảng `EMP`, còn `DELETE` thì không.
* C. `DELETE` là lệnh DML sinh nhiều dữ liệu Undo, có thể `ROLLBACK`, kích hoạt DML Triggers và không hạ vạch High Water Mark (HWM); trong khi `TRUNCATE` là lệnh DDL tự động `COMMIT`, không thể `ROLLBACK`, không kích hoạt DML Triggers và đặt lại HWM về đầu bảng.
* D. `TRUNCATE` xóa luôn tất cả các `INDEX` đã tạo trên bảng `EMP`, còn `DELETE` giữ nguyên các `INDEX`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là tổng hợp chuẩn xác nhất mọi sự khác biệt cốt lõi giữa `DELETE` (DML) và `TRUNCATE` (DDL).
  * **A sai:** Cả `DELETE` và `TRUNCATE` đều giữ nguyên cấu trúc bảng (chỉ `DROP TABLE` mới xóa cấu trúc bảng).
  * **B sai:** Ngược lại: `DELETE` mới kích hoạt DML Triggers, còn `TRUNCATE` là lệnh DDL nên không kích hoạt DML Triggers.
  * **D sai:** `TRUNCATE` chỉ làm rỗng dữ liệu trong các `INDEX` của bảng chứ không xóa định nghĩa `INDEX` (các Index vẫn tồn tại và ở trạng thái `VALID`).
</details>

---

### Câu 23 (Question 23)
**Trong câu lệnh `TRUNCATE TABLE sales REUSE STORAGE;`, mệnh đề `REUSE STORAGE` có tác dụng gì?**

* A. Giữ nguyên các dòng dữ liệu cũ trong bảng `SALES` và chỉ xóa các Index.
* B. Đưa các dòng dữ liệu bị xóa vào Recycle Bin để có thể khôi phục bằng `FLASHBACK TABLE`.
* C. Xóa toàn bộ các dòng trong bảng `SALES` nhưng không trả các vùng không gian (Extents) đã cấp phát về lại cho Tablespace, mà giữ lại để tái sử dụng cho các lần `INSERT` mới vào chính bảng `SALES`.
* D. Cho phép các bảng khác trong cùng Tablespace lấy ngay không gian trống vừa giải phóng của bảng `SALES`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Mặc định, `TRUNCATE TABLE` sử dụng tùy chọn `DROP STORAGE` (thu hồi tất cả các Extents vượt quá `MINEXTENTS` trả về cho Tablespace để bảng khác có thể dùng). Khi chỉ định `REUSE STORAGE`, Oracle vẫn xóa sạch 100% dòng và kéo HWM về đầu bảng, nhưng giữ nguyên toàn bộ các Extents đã cấp phát cho riêng bảng `SALES` nhằm tránh chi phí cấp phát lại Extent khi nạp dữ liệu mới.
  * **A, B, D sai:** `TRUNCATE` không bao giờ đưa dữ liệu vào Recycle Bin, và `DROP STORAGE` mới là tùy chọn cho phép bảng khác dùng không gian vừa giải phóng.
</details>

---

### Câu 24 (Question 24)
**Bảng `ACCOUNTS (id NUMBER, name VARCHAR2(20))` hiện đang trống (`0` dòng). Trong Schema hiện tại **KHÔNG tồn tại** bảng nào tên là `NON_EXIST_TAB`. Bạn thực thi tuần tự các câu lệnh dưới đây trong cùng một Session. Hỏi sau khi kết thúc kịch bản, bảng `ACCOUNTS` có bao nhiêu dòng?**

```sql
INSERT INTO accounts VALUES (1, 'Viettel');
INSERT INTO accounts VALUES (2, 'VNPT');
DROP TABLE non_exist_tab; -- Báo lỗi ORA-00942: table or view does not exist!
ROLLBACK;
```

* A. `0` dòng (vì lệnh `DROP TABLE` bị lỗi nên chưa Commit, và lệnh `ROLLBACK` đã hủy bỏ 2 dòng vừa `INSERT`).
* B. `2` dòng (vì lệnh `DROP TABLE` đúng cú pháp nên đã thực hiện Auto-COMMIT cho 2 lệnh `INSERT` trước khi phát hiện bảng không tồn tại).
* C. `1` dòng.
* D. Phiên làm việc bị treo do lỗi DDL.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là bẫy kinh điển bậc nhất trong đề thi OCA/OCP 1Z0-071! Khi thực thi bất kỳ câu lệnh DDL nào (`DROP TABLE non_exist_tab;`), miễn là câu lệnh đó **đúng cú pháp (vượt qua bước Parse)**, Oracle sẽ lập tức thực thi một lệnh **`COMMIT` ngầm định (Implicit Commit)** để chốt toàn bộ giao dịch hiện tại **TRƯỚC KHI** bắt đầu thực thi lệnh DDL! Dù sau đó lệnh `DROP TABLE` thất bại với lỗi `ORA-00942` (bảng không tồn tại), 2 dòng `(1, 'Viettel')` và `(2, 'VNPT')` đã được Commit vĩnh viễn từ trước đó rồi, nên lệnh `ROLLBACK;` ở dòng cuối cùng không còn tác dụng gì nữa!
  * **A, C, D sai:** Chỉ khi câu lệnh DDL bị lỗi cú pháp ngay từ bước Parse (ví dụ gõ sai thành `DRP TABL non_exist_tab;`) thì mới không kích hoạt Implicit Commit.
</details>

---

### Câu 25 (Question 25)
**Cũng trên bảng `ACCOUNTS` đang trống (`0` dòng), bạn thực thi kịch bản dưới đây (lưu ý dòng thứ 3 bị gõ sai cú pháp từ khóa `CREATE TABLE` thành `CREAT TABL`). Hỏi sau khi lệnh `ROLLBACK;` ở dòng 4 chạy xong, bảng `ACCOUNTS` có bao nhiêu dòng?**

```sql
INSERT INTO accounts VALUES (1, 'FPT');
INSERT INTO accounts VALUES (2, 'CMC');
CREAT TABL test_syntax (id NUMBER); -- Lỗi cú pháp ORA-00900: invalid SQL statement!
ROLLBACK;
```

* A. `0` dòng
* B. `2` dòng
* C. `1` dòng
* D. Câu lệnh `ROLLBACK` bị báo lỗi

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Hãy đối chiếu câu này với Câu 24 để nắm trọn vẹn quy tắc: Ở dòng 3, chuỗi `CREAT TABL test_syntax (id NUMBER);` bị lỗi cú pháp ngay từ đầu (`ORA-00900: invalid SQL statement`). Bộ phân tích cú pháp (SQL Parser) từ chối câu lệnh ngay lập tức và không thể nhận diện đây là một câu lệnh DDL hợp lệ để đưa vào bước thực thi, nên **KHÔNG phát sinh Implicit Commit**! Giao dịch chứa 2 dòng `INSERT` vẫn đang mở, và khi chạy `ROLLBACK;` ở dòng 4, cả 2 dòng `FPT` và `CMC` đều bị hoàn tác, bảng `ACCOUNTS` quay về `0` dòng!
  * **B, C, D sai:** Phải phân biệt rõ giữa *DDL đúng cú pháp nhưng lỗi lúc thực thi (Semantic/Execution error)* → **Có Auto-COMMIT**, và *Lỗi cú pháp không nhận diện được lệnh (Syntax error)* → **Không Auto-COMMIT**.
</details>

---
