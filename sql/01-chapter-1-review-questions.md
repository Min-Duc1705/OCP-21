# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 1: Tổng Quan Oracle Database và Ngôn Ngữ SQL

> **Tài liệu tham chiếu:** *OCA/OCP Oracle Database SQL Study Guide (Exam 1Z0-071) & Ngân hàng câu hỏi sát hạch CNTT VNPT*.  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết.  
> **Cách học:** Bạn hãy tự đọc đề và chọn đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và nắm vững bẫy thi.

---

### Câu 1 (Question 1)
**Trong mô hình cơ sở dữ liệu quan hệ (RDBMS) và ngôn ngữ SQL, khả năng nào của câu lệnh `SELECT` cho phép giới hạn các cột (columns) được trả về từ một bảng?**

* A. Selection (Phép chọn)
* B. Projection (Phép chiếu)
* C. Joining (Phép kết)
* D. Intersection (Phép giao)

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong đại số quan hệ và tài liệu chuẩn Oracle 1Z0-071, **Projection (Phép chiếu)** là thao tác chọn ra một tập con các **cột (columns)** từ một bảng bằng cách liệt kê tên các cột sau từ khóa `SELECT`.
  * **A sai:** **Selection (Phép chọn)** là thao tác lọc và giới hạn các **dòng (rows)** trả về thông qua mệnh đề `WHERE`. Đây là bẫy từ vựng kinh điển vì nhiều thí sinh thấy từ `SELECT` nên nhầm với `Selection`.
  * **C sai:** **Joining (Phép kết)** là thao tác liên kết dữ liệu từ hai hay nhiều bảng với nhau dựa trên các cột chung.
  * **D sai:** **Intersection (Phép giao)** là toán tử tập hợp (`INTERSECT`) lấy các dòng chung giữa hai câu truy vấn độc lập.
</details>

---

### Câu 2 (Question 2)
**Phát biểu nào sau đây mô tả chính xác nhất mối quan hệ giữa User và Schema trong Oracle Database?**

* A. Một User có thể tạo và sở hữu nhiều Schema khác nhau trong cùng một Oracle Database.
* B. Một Schema có thể thuộc quyền sở hữu đồng thời của nhiều User khác nhau.
* C. Mỗi User gắn liền với duy nhất một Schema có cùng tên với User đó, chứa tất cả các đối tượng do User đó sở hữu.
* D. Schema là một vùng không gian lưu trữ vật lý trên đĩa cứng tương đương với một Datafile.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong kiến trúc Oracle Database, **User** là tài khoản xác thực đăng nhập, còn **Schema** là tập hợp các đối tượng cơ sở dữ liệu (Tables, Views, Indexes, Sequences, Procedures...) thuộc sở hữu của User đó. Quan hệ giữa User và Schema trong Oracle là **1-1** và có cùng tên.
  * **A, B sai:** Khác với SQL Server hay PostgreSQL (nơi 1 User có thể sở hữu nhiều Schema), trong Oracle một User không thể tạo nhiều Schema mang tên khác nhau cho riêng mình.
  * **D sai:** Không gian lưu trữ logic là **Tablespace** và lưu trữ vật lý là **Datafile**, không phải Schema.
</details>

---

### Câu 3 (Question 3)
**Cho câu lệnh tạo bảng sau đây trong Oracle Database. Phát biểu nào là đúng về các ràng buộc (Constraints) trên bảng `EMPLOYEES`?**

```sql
CREATE TABLE employees (
    emp_id      NUMBER(6)    PRIMARY KEY,
    email       VARCHAR2(50) UNIQUE,
    dept_id     NUMBER(4)    REFERENCES departments(dept_id)
);
```

* A. Cột `email` không được phép chứa bất kỳ giá trị `NULL` nào vì có ràng buộc `UNIQUE`.
* B. Cột `dept_id` bắt buộc phải khác `NULL` ở mọi dòng vì nó là khóa ngoại (`FOREIGN KEY`).
* C. Cột `emp_id` không được phép chứa giá trị `NULL` và không được phép trùng lặp giá trị giữa các dòng.
* D. Một bảng trong Oracle có thể khai báo tối đa 2 ràng buộc `PRIMARY KEY` nếu một khóa dùng cho nội bộ và một khóa dùng để tham chiếu.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Ràng buộc `PRIMARY KEY` (Khóa chính) đảm bảo tính toàn vẹn thực thể (*Entity Integrity*), tương đương sự kết hợp của `UNIQUE` và `NOT NULL`. Do đó `emp_id` không bao giờ được trùng lặp và không bao giờ được nhận giá trị `NULL`.
  * **A sai:** Trong Oracle, ràng buộc `UNIQUE` chỉ cấm các giá trị khác `NULL` trùng nhau, nhưng **cho phép chứa nhiều dòng có giá trị `NULL`** (nếu cột đó không khai báo thêm `NOT NULL`).
  * **B sai:** Cột khóa ngoại (`FOREIGN KEY` / `REFERENCES`) hoàn toàn **được phép nhận giá trị `NULL`** trừ khi được gắn thêm ràng buộc `NOT NULL`.
  * **D sai:** Mỗi bảng chỉ được phép có **tối đa duy nhất 1 `PRIMARY KEY`** (dù khóa chính đó có thể ghép từ nhiều cột - *Composite Primary Key*).
</details>

---

### Câu 4 (Question 4)
**Khi một bảng cha `DEPARTMENTS` đang có dòng dữ liệu `dept_id = 10` và bảng con `EMPLOYEES` đang có 5 nhân viên thuộc `dept_id = 10` (ràng buộc khóa ngoại được tạo với cấu hình mặc định, không có mệnh đề `ON DELETE`). Chuyện gì sẽ xảy ra khi bạn thực thi câu lệnh sau?**

```sql
DELETE FROM departments WHERE dept_id = 10;
```

* A. Câu lệnh xóa thành công dòng `dept_id = 10` ở bảng `DEPARTMENTS` và tự động xóa luôn 5 nhân viên ở bảng `EMPLOYEES`.
* B. Câu lệnh xóa thành công dòng `dept_id = 10` ở bảng `DEPARTMENTS` và tự động gán `dept_id = NULL` cho 5 nhân viên ở bảng `EMPLOYEES`.
* C. Câu lệnh báo lỗi vi phạm ràng buộc toàn vẹn (`ORA-02292: child record found`) và không có dòng nào bị xóa.
* D. Câu lệnh xóa thành công dòng ở bảng `DEPARTMENTS`, giữ nguyên giá trị `dept_id = 10` ở bảng `EMPLOYEES`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Hành vi mặc định của ràng buộc `FOREIGN KEY` trong Oracle khi không khai báo `ON DELETE CASCADE` hay `ON DELETE SET NULL` là **Restrict (`NO ACTION`)**. Khi còn tồn tại bản ghi con tham chiếu đến bản ghi cha, mọi nỗ lực xóa bản ghi cha đều bị chặn lại với lỗi `ORA-02292: integrity constraint violated - child record found`.
  * **A sai:** Chỉ xảy ra khi khóa ngoại được khai báo tường minh với tùy chọn `ON DELETE CASCADE`.
  * **B sai:** Chỉ xảy ra khi khóa ngoại được khai báo tường minh với tùy chọn `ON DELETE SET NULL`.
  * **D sai:** Sẽ làm phát sinh bản ghi mồ côi (*orphan records*), vi phạm toàn vẹn tham chiếu (*Referential Integrity*).
</details>

---

### Câu 5 (Question 5)
**Tập hợp nào sau đây CHỈ bao gồm các câu lệnh thuộc nhóm DDL (Data Definition Language) trong Oracle SQL?**

* A. `CREATE`, `ALTER`, `DROP`, `TRUNCATE`, `RENAME`
* B. `CREATE`, `ALTER`, `DELETE`, `TRUNCATE`, `DROP`
* C. `INSERT`, `UPDATE`, `DELETE`, `MERGE`
* D. `CREATE`, `GRANT`, `REVOKE`, `COMMIT`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Các lệnh **DDL (Data Definition Language)** bao gồm `CREATE`, `ALTER`, `DROP`, `TRUNCATE`, `RENAME`, và `COMMENT`. Điểm chung của tất cả các lệnh này là tác động lên định nghĩa/cấu trúc trong Data Dictionary và **tự động thực hiện `COMMIT` ngầm định (Implicit Commit)**.
  * **B sai:** Vì chứa lệnh `DELETE` — đây là lệnh thuộc nhóm **DML (Data Manipulation Language)**, không phải DDL.
  * **C sai:** Toàn bộ `INSERT`, `UPDATE`, `DELETE`, `MERGE` đều là các lệnh thuộc nhóm **DML**.
  * **D sai:** `GRANT` và `REVOKE` thuộc nhóm **DCL (Data Control Language)**; `COMMIT` thuộc nhóm **TCL (Transaction Control Language)**.
</details>

---

### Câu 6 (Question 6)
**Sự khác biệt cốt lõi giữa câu lệnh `DELETE FROM emp;` và `TRUNCATE TABLE emp;` trong Oracle Database là gì?**

* A. `TRUNCATE` là lệnh DML nên có thể sử dụng mệnh đề `WHERE`, còn `DELETE` là lệnh DDL nên không thể dùng `WHERE`.
* B. `DELETE` là lệnh DML có thể hoàn tác bằng `ROLLBACK`, trong khi `TRUNCATE` là lệnh DDL tự động `COMMIT` nên không thể `ROLLBACK`.
* C. `TRUNCATE` xóa cả dữ liệu lẫn cấu trúc bảng `emp` khỏi Data Dictionary (tương đương `DROP TABLE`).
* D. `DELETE` giải phóng ngay lập tức không gian lưu trữ vật lý và đặt lại High Water Mark, còn `TRUNCATE` thì không.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** `DELETE` thuộc nhóm **DML**, xóa từng dòng và ghi thông tin vào Undo Segments nên hoàn toàn có thể khôi phục bằng `ROLLBACK` trước khi `COMMIT`. Ngược lại, `TRUNCATE TABLE` thuộc nhóm **DDL**, thực hiện `COMMIT` ngầm định ngay lập tức và không sinh dữ liệu Undo cho từng dòng, do đó **không thể `ROLLBACK`** (trừ trường hợp dùng công nghệ Flashback Database ở mức quản trị).
  * **A sai:** Ngược lại hoàn toàn: `DELETE` (DML) mới dùng được mệnh đề `WHERE`, còn `TRUNCATE` (DDL) không bao giờ có mệnh đề `WHERE`.
  * **C sai:** `TRUNCATE` chỉ xóa toàn bộ các dòng dữ liệu bên trong bảng, cấu trúc bảng (cột, ràng buộc, index) vẫn được giữ nguyên. Lệnh xóa cả cấu trúc bảng là `DROP TABLE`.
  * **D sai:** `TRUNCATE` mới là lệnh giải phóng không gian lưu trữ (reset *High Water Mark*) mặc định, trong khi `DELETE` chỉ đánh dấu các vùng chứa dòng là trống chứ không hạ High Water Mark.
</details>

---

### Câu 7 (Question 7)
**Một lập trình viên thực thi tuần tự đoạn kịch bản SQL sau trong một phiên làm việc duy nhất (giả sử bảng `PRODUCTS` đang trống và bảng `ORDERS` ĐÃ TỒN TẠI sẵn từ trước trong Schema):**

```sql
INSERT INTO products VALUES (1, 'Laptop', 1500);
INSERT INTO products VALUES (2, 'Mouse', 25);
CREATE TABLE orders (order_id NUMBER PRIMARY KEY);
ROLLBACK;
SELECT COUNT(*) FROM products;
```

**Kết quả trả về của câu lệnh `SELECT COUNT(*) FROM products;` ở dòng cuối cùng là bao nhiêu?**

* A. `0`
* B. `1`
* C. `2`
* D. Báo lỗi vì giao dịch bị treo sau khi lệnh `CREATE TABLE` thất bại.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (`2`):** Đây là một trong những bẫy thi nổi tiếng nhất của chứng chỉ Oracle SQL 1Z0-071!
    1. Hai lệnh `INSERT` đầu tiên chèn 2 dòng vào bảng `PRODUCTS` trong giao dịch hiện tại.
    2. Tiếp theo, câu lệnh `CREATE TABLE orders ...` là một câu lệnh **DDL**. Theo cơ chế của Oracle, **trước khi thực thi bất kỳ lệnh DDL nào**, Oracle tự động phát ra một lệnh **`COMMIT` ngầm định (Implicit Commit)** để kết thúc giao dịch hiện hành.
    3. Mặc dù câu lệnh `CREATE TABLE orders` bị thất bại với lỗi `ORA-00955: name is already used by an existing object` (do bảng `ORDERS` đã tồn tại), nhưng lệnh `COMMIT` ngầm định **TRƯỚC ĐÓ** đã được thực hiện thành công!
    4. Do đó, 2 dòng trong bảng `PRODUCTS` đã được lưu vĩnh viễn. Lệnh `ROLLBACK;` sau đó không có tác dụng gì đối với 2 dòng đã commit này. Kết quả `COUNT(*)` trả về **`2`**.
  * **A, B, D sai:** Do không nắm được quy tắc Oracle thực hiện `COMMIT` ngầm định **cả trước và sau** lệnh DDL, bất kể lệnh DDL đó thành công hay thất bại.
</details>

---

### Câu 8 (Question 8)
**Phát biểu nào sau đây là ĐÚNG khi nói về bảng `DUAL` trong Oracle Database?**

* A. Bảng `DUAL` thuộc sở hữu của schema `HR` và chứa 2 cột dùng để kiểm thử phép nối bảng.
* B. Bảng `DUAL` thuộc sở hữu của schema `SYS`, gồm duy nhất 1 cột tên là `DUMMY` (kiểu `VARCHAR2(1)`) và chứa 1 dòng có giá trị `'X'`.
* C. Chỉ có người dùng quản trị (`SYS` hoặc `SYSTEM`) mới có quyền truy vấn bảng `DUAL`.
* D. Bảng `DUAL` là một bảng tạm chỉ được tạo ra trong bộ nhớ RAM mỗi khi người dùng mở Oracle SQL Developer.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Bảng `DUAL` là bảng hệ thống thực sự nằm trong Data Dictionary, thuộc sở hữu của user **`SYS`**, có cấu trúc gồm đúng **1 cột `DUMMY` kiểu `VARCHAR2(1)`** và **1 dòng dữ liệu mang giá trị `'X'`**.
  * **A sai:** Không thuộc schema `HR` và chỉ có 1 cột, 1 dòng (tên `DUAL` xuất phát từ lịch sử ban đầu dùng để nhân đôi dòng, nhưng sau đó được rút gọn còn 1 dòng).
  * **C sai:** Oracle tạo sẵn một **Public Synonym** tên là `DUAL` trỏ tới `SYS.DUAL` và cấp quyền `SELECT` cho `PUBLIC`, nên mọi User đều có thể truy vấn trực tiếp.
  * **D sai:** `DUAL` là đối tượng tồn tại thường trực trong Database, không phụ thuộc công cụ kết nối.
</details>

---

### Câu 9 (Question 9)
**Giả sử bảng `DEPARTMENTS` hiện đang có đúng 27 dòng dữ liệu. Kết quả của câu truy vấn dưới đây sẽ trả về bao nhiêu dòng?**

```sql
SELECT 'Hello Oracle!' AS greeting
FROM departments;
```

* A. `1` dòng
* B. `0` dòng
* C. `27` dòng
* D. Báo lỗi cú pháp vì mệnh đề `SELECT` không chứa bất kỳ cột nào của bảng `DEPARTMENTS`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (`27` dòng):** Khi thực thi câu lệnh `SELECT <biểu_thức_hằng> FROM <tên_bảng>;` mà không có mệnh đề `WHERE` hay `DISTINCT`, Oracle sẽ duyệt qua từng dòng của bảng trong mệnh đề `FROM` và đánh giá biểu thức ở mệnh đề `SELECT` một lần cho mỗi dòng đó. Vì bảng `DEPARTMENTS` có 27 dòng, chuỗi `'Hello Oracle!'` sẽ được lặp lại đúng **27 lần** (27 dòng).
  * **A sai:** Chỉ trả về 1 dòng nếu bạn truy vấn `FROM dual` hoặc thêm từ khóa `SELECT DISTINCT 'Hello Oracle!' FROM departments;`.
  * **B, D sai:** Việc chọn một hằng số hoặc biểu thức không chứa cột của bảng trong mệnh đề `SELECT` là hoàn toàn hợp lệ trong SQL.
</details>

---

### Câu 10 (Question 10)
**Trong các tên định danh (Identifiers) dưới đây, tên nào là HỢP LỆ khi đặt tên cho một bảng trong Oracle Database mà KHÔNG sử dụng dấu nháy kép `"..."`?**

* A. `2026_SALES_DATA`
* B. `EMP_SAL#_$1`
* C. `DEPT-HISTORY`
* D. `TABLE`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng (`EMP_SAL#_$1`):** Theo quy tắc đặt tên đối tượng không có dấu nháy kép (*Unquoted Identifiers*) của Oracle:
    1. Bắt buộc phải bắt đầu bằng một chữ cái (`E`).
    2. Chỉ được phép chứa chữ cái, chữ số (`1`), và ba ký tự đặc biệt: dấu gạch dưới (`_`), dấu thăng (`#`), và dấu đô la (`$`).
  * **A sai:** Không được bắt đầu bằng chữ số (`2`).
  * **C sai:** Dấu gạch ngang / dấu trừ (`-`) không được phép xuất hiện trong tên định danh không có nháy kép (Oracle sẽ hiểu là phép toán trừ).
  * **D sai:** `TABLE` là từ khóa dành riêng (*Reserved Word*) của Oracle SQL, không được dùng làm tên bảng nếu không đặt trong dấu nháy kép.
</details>

---

### Câu 11 (Question 11)
**Một bảng được tạo bằng câu lệnh DDL có sử dụng dấu nháy kép như sau:**

```sql
CREATE TABLE "Emp_Info" (
    emp_id NUMBER PRIMARY KEY,
    emp_name VARCHAR2(50)
);
```

**Câu lệnh `SELECT` nào dưới đây sẽ thực thi THÀNH CÔNG mà không báo lỗi `ORA-00942: table or view does not exist`?**

* A. `SELECT * FROM emp_info;`
* B. `SELECT * FROM EMP_INFO;`
* C. `SELECT * FROM "EMP_INFO";`
* D. `SELECT * FROM "Emp_Info";`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Khi bạn tạo một bảng với tên nằm trong dấu nháy kép `"Emp_Info"` có chứa chữ thường, Oracle sẽ lưu chính xác chuỗi `"Emp_Info"` (phân biệt chữ hoa/thường) vào Data Dictionary thay vì chuyển thành chữ in hoa như mặc định. Do đó, mọi câu lệnh tham chiếu tới bảng này về sau **bắt buộc phải đặt trong dấu nháy kép và viết đúng từng ký tự hoa/thường** là `"Emp_Info"`.
  * **A, B sai:** Khi không có dấu nháy kép, Oracle tự động chuyển `emp_info` và `EMP_INFO` thành `EMP_INFO` (in hoa toàn bộ) để tìm trong Data Dictionary. Vì tên lưu trong từ điển là `Emp_Info` nên không khớp, dẫn tới lỗi `ORA-00942`.
  * **C sai:** `"EMP_INFO"` không khớp chữ hoa/thường với `"Emp_Info"`.
</details>

---

### Câu 12 (Question 12)
**Lệnh nào dưới đây là lệnh của công cụ client SQL\*Plus (SQL\*Plus Command) chứ KHÔNG PHẢI là một câu lệnh SQL chuẩn (SQL Statement)?**

* A. `SELECT`
* B. `DESCRIBE`
* C. `MERGE`
* D. `RENAME`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** `DESCRIBE` (có thể viết tắt là `DESC`) là một lệnh của trình client **SQL\*Plus** (và được hỗ trợ tương thích trên SQL Developer / SQLcl) dùng để hiển thị cấu trúc cột của bảng/view. Đặc điểm của lệnh SQL\*Plus là có thể viết tắt từ khóa, không lưu vào SQL Buffer và không bắt buộc kết thúc bằng dấu chấm phẩy `;`.
  * **A, C, D sai:** `SELECT` (DQL), `MERGE` (DML), và `RENAME` (DDL) đều là các câu lệnh SQL chuẩn được gửi tới Oracle Database Server để phân tích và thực thi, bắt buộc phải viết đầy đủ từ khóa và lưu trong SQL Buffer.
</details>

---

### Câu 13 (Question 13)
**Hãy xem xét câu lệnh SQL dưới đây. Khi thực thi trên Oracle Database, điều gì sẽ xảy ra?**

```sql
SELECT employee_id, first_name, salary
FROM employees
WHERE first_name = "Steven";
```

* A. Trả về danh sách tất cả nhân viên có tên là `Steven`.
* B. Trả về 0 dòng dữ liệu nhưng không báo lỗi vì không tìm thấy cột `"Steven"`.
* C. Báo lỗi `ORA-00904: "Steven": invalid identifier` vì chuỗi ký tự được đặt trong dấu nháy kép thay vì dấu nháy đơn.
* D. Báo lỗi cú pháp vì từ khóa `WHERE` không hỗ trợ so sánh bằng `=` với kiểu dữ liệu chuỗi.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong chuẩn SQL của Oracle:
    * Hằng chuỗi ký tự (*Character Literals*) bắt buộc phải đặt trong **dấu nháy đơn** (`'Steven'`).
    * Khi bạn viết `"Steven"` bằng **dấu nháy kép**, trình phân tích cú pháp (Parser) của Oracle sẽ hiểu `"Steven"` là **tên của một cột (Column Identifier)** trong bảng `EMPLOYEES`. Vì bảng `EMPLOYEES` không có cột nào tên là `"Steven"`, Oracle lập tức ném lỗi `ORA-00904: "Steven": invalid identifier`.
  * **A, B, D sai:** Đây là lỗi rất phổ biến với lập trình viên chuyển từ Java, C#, Python hoặc MySQL sang Oracle SQL.
</details>

---

### Câu 14 (Question 14)
**Hai câu lệnh `GRANT` và `REVOKE` thuộc nhóm ngôn ngữ nào của SQL?**

* A. DDL (Data Definition Language)
* B. DML (Data Manipulation Language)
* C. TCL (Transaction Control Language)
* D. DCL (Data Control Language)

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** **DCL (Data Control Language)** là nhóm lệnh kiểm soát bảo mật và phân quyền truy cập dữ liệu, bao gồm 2 lệnh cốt lõi:
    * `GRANT`: Cấp quyền hệ thống hoặc quyền truy cập đối tượng cho User / Role.
    * `REVOKE`: Thu hồi quyền đã cấp.
  * **A, B, C sai:** DDL định nghĩa cấu trúc (`CREATE`, `ALTER`, `DROP`), DML thao tác dữ liệu (`INSERT`, `UPDATE`, `DELETE`, `MERGE`), TCL điều khiển giao dịch (`COMMIT`, `ROLLBACK`, `SAVEPOINT`).
</details>

---

### Câu 15 (Question 15)
**Khi bạn tạo một ràng buộc `PRIMARY KEY` trên cột `EMPLOYEE_ID` của bảng `EMPLOYEES` mới tinh (chưa có bất kỳ Index nào trước đó), Oracle Database sẽ tự động thực hiện hành động nào sau đây ở tầng dưới?**

* A. Tự động tạo một `SEQUENCE` để sinh số tự động cho cột `EMPLOYEE_ID`.
* B. Tự động tạo một `UNIQUE INDEX` (chỉ mục duy nhất) trên cột `EMPLOYEE_ID`.
* C. Tự động tạo một `BITMAP INDEX` trên toàn bộ các cột của bảng `EMPLOYEES`.
* D. Tự động tạo một `TRIGGER` để kiểm tra dữ liệu trùng lặp trước khi `INSERT`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Để kiểm tra tính duy nhất của dữ liệu với tốc độ cao (tránh phải quét toàn bộ bảng *Full Table Scan* mỗi khi chèn dòng mới), Oracle tự động tạo một **B-Tree Unique Index** có cùng tên với tên ràng buộc `PRIMARY KEY` (hoặc `UNIQUE`) trên cột tương ứng.
  * **A sai:** Khóa chính trong Oracle không tự động sinh số nếu bạn không gán `SEQUENCE` hoặc khai báo mệnh đề `GENERATED AS IDENTITY` (từ Oracle 12c+).
  * **C, D sai:** Oracle dùng Unique Index chứ không dùng Bitmap Index hay Trigger để cưỡng chế ràng buộc khóa chính.
</details>

---

### Câu 16 (Question 16)
**Trong công cụ dòng lệnh SQL\*Plus, ký tự nào được đặt một mình trên một dòng mới để yêu cầu thực thi lại câu lệnh SQL đang nằm trong bộ đệm (SQL Buffer)?**

* A. Dấu chấm phẩy `;`
* B. Dấu gạch chéo thuận `/` (Forward slash)
* C. Dấu gạch chéo ngược `\` (Backslash)
* D. Hai dấu gạch ngang `--`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong SQL\*Plus (và cửa sổ Script của SQL Developer), dấu gạch chéo thuận `/` đặt trên một dòng riêng biệt sẽ thực thi câu lệnh SQL hoặc khối lệnh PL/SQL hiện đang lưu trong **SQL Buffer**.
  * **A sai:** Dấu `;` dùng để kết thúc và chạy ngay câu lệnh SQL vừa gõ, chứ không dùng đứng một mình trên dòng mới để chạy lại bộ đệm.
  * **C sai:** Dấu `\` không phải ký tự điều khiển thực thi SQL Buffer.
  * **D sai:** Hai dấu `--` dùng để bắt đầu một dòng chú thích (Single-line comment).
</details>

---

### Câu 17 (Question 17)
**Cách viết chú thích (Comment) nào sau đây là HỢP LỆ trong một câu lệnh Oracle SQL? (Chọn tất cả các đáp án đúng)**

* A. Sử dụng `--` ở đầu phần chú thích cho chú thích trên một dòng.
* B. Sử dụng cặp `/* ... */` cho chú thích trên một hoặc nhiều dòng.
* C. Sử dụng `//` ở đầu phần chú thích giống như trong ngôn ngữ Java/C++.
* D. Sử dụng ký tự `#` ở đầu dòng chú thích giống như trong Python/MySQL.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B**
* **Giải thích chuyên sâu:**
  * **A và B đúng:** Chuẩn ANSI SQL và Oracle SQL hỗ trợ đúng 2 kiểu chú thích bên trong câu lệnh SQL:
    1. `-- Chú thích 1 dòng` (từ vị trí dấu `--` đến hết dòng đó).
    2. `/* Chú thích nhiều dòng hoặc giữa dòng */`.
  * **C sai:** `//` là cú pháp của C++/Java/JavaScript, sẽ gây lỗi cú pháp nếu viết trong câu lệnh Oracle SQL.
  * **D sai:** `#` không phải ký tự comment của Oracle SQL (trong Oracle, `#` thậm chí là ký tự hợp lệ bên trong tên bảng/cột!).
</details>

---

### Câu 18 (Question 18)
**Câu lệnh `MERGE` trong Oracle SQL thuộc nhóm lệnh nào và thường được sử dụng vào mục đích gì?**

* A. Thuộc nhóm DDL; dùng để gộp cấu trúc của hai bảng vật lý thành một bảng duy nhất.
* B. Thuộc nhóm DML; dùng để thực hiện đồng thời thao tác `INSERT`, `UPDATE` (và tùy chọn `DELETE`) trên bảng đích dựa vào kết quả đối chiếu với bảng nguồn (còn gọi là thao tác *UPSERT*).
* C. Thuộc nhóm TCL; dùng để gộp hai giao dịch (Transactions) độc lập thành một giao dịch.
* D. Thuộc nhóm DCL; dùng để gộp quyền của hai User lại với nhau.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** `MERGE` là một câu lệnh thuộc nhóm **DML (Data Manipulation Language)** (thường gọi là lệnh **UPSERT**). Nó cho phép so khớp dữ liệu giữa bảng nguồn và bảng đích: nếu khớp (`WHEN MATCHED`) thì thực hiện `UPDATE` (và có thể kèm `DELETE WHERE`), nếu không khớp (`WHEN NOT MATCHED`) thì thực hiện `INSERT`. Vì là DML, thay đổi của `MERGE` chỉ được lưu vĩnh viễn sau khi `COMMIT`.
  * **A, C, D sai:** `MERGE` chỉ thao tác trên dữ liệu dòng của bảng đích, không gộp cấu trúc bảng (DDL), giao dịch (TCL) hay quyền hạn (DCL).
</details>

---

### Câu 19 (Question 19)
**Khi thực thi lệnh `DESCRIBE employees` trong Oracle SQL Developer hoặc SQL\*Plus, những thông tin nào sau đây sẽ được hiển thị trong kết quả đầu ra?**

* A. Tên các cột, trạng thái `NOT NULL` (nếu có), và kiểu dữ liệu kèm kích thước của từng cột.
* B. Tên các cột, toàn bộ các dòng dữ liệu trong bảng, và danh sách các Index của bảng.
* C. Tên các cột, giá trị mặc định (`DEFAULT`), và câu lệnh `CHECK` constraint chi tiết của từng cột.
* D. Dung lượng vật lý (tính bằng Megabytes) mà bảng `EMPLOYEES` đang chiếm dụng trên đĩa cứng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Lệnh `DESCRIBE` (`DESC`) trả về 3 cột thông tin mô tả cấu trúc bảng/view:
    1. `Name`: Tên của cột.
    2. `Null?`: Hiển thị `NOT NULL` nếu cột đó bắt buộc phải có giá trị (hoặc để trống nếu cột cho phép `NULL`).
    3. `Type`: Kiểu dữ liệu và độ dài/độ chính xác (ví dụ `NUMBER(6)`, `VARCHAR2(25)`).
  * **B, C, D sai:** `DESCRIBE` không hiển thị dữ liệu trong bảng, không liệt kê danh sách Index, không hiển thị biểu thức `CHECK` constraint hay dung lượng vật lý trên đĩa.
</details>

---

### Câu 20 (Question 20)
**Trong Oracle Database (phiên bản thi OCA/OCP 1Z0-071: 12c / 19c / 21c), điều gì sẽ xảy ra khi bạn chạy câu lệnh SQL dưới đây?**

```sql
SELECT 25 * 4 AS result;
```

* A. Trả về 1 dòng, 1 cột có tên `RESULT` với giá trị `100`.
* B. Trả về 1 dòng, 1 cột có tên `25*4` với giá trị `100`.
* C. Báo lỗi `ORA-00923: FROM keyword not found where expected` vì thiếu mệnh đề `FROM`.
* D. Trả về giá trị `NULL` vì không chỉ định bảng dữ liệu nguồn.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong chuẩn thi Oracle SQL 1Z0-071 (Oracle 12c, 19c, 21c), một câu lệnh `SELECT` hợp lệ bắt buộc phải có tối thiểu **2 mệnh đề**: mệnh đề `SELECT` và mệnh đề `FROM`. Việc bỏ qua `FROM` sẽ gây ra lỗi biên dịch cú pháp `ORA-00923: FROM keyword not found where expected`. Để chạy đúng, bạn phải viết: `SELECT 25 * 4 AS result FROM dual;`.
  * **A, B, D sai:** (Lưu ý mở rộng: Dù Oracle 23ai mới nhất đã bổ sung tính năng cho phép `SELECT` không cần `FROM`, nhưng trong phạm vi bài thi 1Z0-071 và các hệ thống Oracle 19c/21c hiện hành tại doanh nghiệp như VNPT, mệnh đề `FROM` luôn là bắt buộc).
</details>

---

### Câu 21 (Question 21)
**Cho bảng `EMPLOYEES` có 3 dòng dữ liệu như sau:**

| EMPLOYEE_ID | FIRST_NAME | LAST_NAME | JOB_ID |
| :---: | :--- | :--- | :--- |
| 100 | Steven | King | AD_PRES |
| 101 | Neena | Kochhar | AD_VP |
| 102 | Lex | De Haan | AD_VP |

**Khi thực thi câu truy vấn dưới đây, kết quả trả về sẽ có bao nhiêu dòng?**

```sql
select employee_id, first_name, last_name
from EMPLOYEES
where job_id = 'ad_vp';
```

* A. `2` dòng (`employee_id` 101 và 102)
* B. `0` dòng (không có dòng nào được trả về, không báo lỗi)
* C. Báo lỗi cú pháp vì các từ khóa `select`, `from`, `where` viết bằng chữ thường.
* D. Báo lỗi vì tên bảng `EMPLOYEES` viết hoa nhưng tên cột viết thường.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng (`0` dòng):**
    * Từ khóa SQL (`select`, `from`, `where`) và tên bảng/cột (`EMPLOYEES`, `job_id`) **không phân biệt chữ hoa/thường**, nên câu lệnh hoàn toàn hợp lệ về mặt cú pháp.
    * Tuy nhiên, **giá trị chuỗi ký tự đặt trong dấu nháy đơn (`'ad_vp'`) phân biệt chữ hoa/thường tuyệt đối (case-sensitive)**! Trong bảng, dữ liệu lưu là `'AD_VP'` (chữ hoa), còn điều kiện lọc tìm `'ad_vp'` (chữ thường) nên không có dòng nào khớp. Câu lệnh chạy thành công và trả về **0 dòng (no rows selected)**.
  * **A, C, D sai:** Đây là bẫy kinh điển kiểm tra sự khác biệt về tính phân biệt hoa/thường giữa SQL Keywords/Identifiers và String Literals.
</details>

---

### Câu 22 (Question 22)
**Về mặt hiệu năng và cơ chế khóa (Locking) trong Oracle Database, phát biểu nào sau đây là ĐÚNG khi so sánh giữa `PRIMARY KEY` và `FOREIGN KEY`?**

* A. Oracle tự động tạo Index cho cả `PRIMARY KEY` và `FOREIGN KEY` ngay khi khai báo ràng buộc.
* B. Oracle tự động tạo Index cho `FOREIGN KEY`, nhưng không tự động tạo Index cho `PRIMARY KEY`.
* C. Oracle tự động tạo Unique Index cho `PRIMARY KEY` (nếu cột chưa được đánh index), nhưng KHÔNG tự động tạo Index cho cột `FOREIGN KEY`.
* D. Oracle không bao giờ tự động tạo Index cho bất kỳ loại ràng buộc nào; người dùng luôn phải chạy lệnh `CREATE INDEX` thủ công.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khi tạo ràng buộc `PRIMARY KEY` hoặc `UNIQUE`, Oracle tự động tạo một Unique Index trên cột đó (nếu cột chưa có index) để đảm bảo kiểm tra tính duy nhất. Ngược lại, khi tạo ràng buộc **`FOREIGN KEY`**, Oracle **KHÔNG tự động tạo Index** trên cột khóa ngoại ở bảng con.
  * **A, B, D sai:** Việc thiếu Index trên cột `FOREIGN KEY` là nguyên nhân hàng đầu gây chậm phép `JOIN` và gây khóa toàn bảng con (*Table-level Share Lock*) khi bảng cha thực hiện xóa hoặc cập nhật khóa chính.
</details>

---

### Câu 23 (Question 23)
**Đối tượng cơ sở dữ liệu (Schema Object) nào trong Oracle được thiết kế chuyên biệt để sinh ra chuỗi các con số nguyên duy nhất, tuần tự (thường dùng để tạo giá trị cho cột khóa chính) và có thể dùng chung cho nhiều bảng?**

* A. `SYNONYM`
* B. `SEQUENCE`
* C. `VIEW`
* D. `INDEX`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** **`SEQUENCE`** là một Schema Object độc lập với bảng, dùng để sinh ra các con số tuần tự duy nhất thông qua hai giả cột (pseudocolumns) là `NEXTVAL` và `CURRVAL`.
  * **A sai:** `SYNONYM` là tên gọi thay thế (bí danh) cho một đối tượng khác trong Database.
  * **C sai:** `VIEW` là bảng ảo lưu trữ câu truy vấn `SELECT`.
  * **D sai:** `INDEX` là cấu trúc dữ liệu giúp tăng tốc độ truy xuất dòng trong bảng.
</details>

---

### Câu 24 (Question 24)
**Lập trình viên muốn đặt một điểm đánh dấu tạm thời bên trong một giao dịch (Transaction) dài để khi cần có thể hoàn tác (`ROLLBACK`) một phần các lệnh DML về đúng vị trí đó mà không làm mất các thay đổi DML trước điểm đánh dấu. Câu lệnh TCL nào dùng để tạo điểm đánh dấu này?**

* A. `COMMIT WORK`
* B. `CHECKPOINT`
* C. `SAVEPOINT`
* D. `SET TRANSACTION`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Lệnh `SAVEPOINT <tên_savepoint>;` thuộc nhóm **TCL (Transaction Control Language)** cho phép tạo một mốc đánh dấu giữa giao dịch. Sau đó, lập trình viên có thể dùng lệnh `ROLLBACK TO [SAVEPOINT] <tên_savepoint>;` để chỉ hủy bỏ các lệnh DML phát sinh sau mốc đó, giữ nguyên các lệnh DML trước mốc đó.
  * **A sai:** `COMMIT WORK` (tương đương `COMMIT`) kết thúc toàn bộ giao dịch và lưu vĩnh viễn mọi thay đổi.
  * **B sai:** `CHECKPOINT` là sự kiện hệ thống nơi tiến trình DBWn ghi các khối dữ liệu bẩn (*dirty buffers*) từ RAM xuống Datafile trên đĩa, không phải mốc hoàn tác DML của lập trình viên.
  * **D sai:** `SET TRANSACTION` dùng để thiết lập thuộc tính cho giao dịch (như `READ ONLY`, `READ WRITE` hoặc mức cô lập `ISOLATION LEVEL`), chỉ được gọi ở đầu giao dịch.
</details>

---

### Câu 25 (Question 25)
**Cho bảng `EMPLOYEES` có ràng buộc kiểm tra (Check Constraint) trên cột lương như sau: `CONSTRAINT emp_sal_ck CHECK (salary >= 5000)`. Nếu cột `salary` KHÔNG có ràng buộc `NOT NULL`, câu lệnh `INSERT` nào dưới đây sẽ thực thi THÀNH CÔNG? (Chọn tất cả các đáp án đúng)**

* A. `INSERT INTO employees (employee_id, last_name, salary) VALUES (201, 'Nguyen', 5000);`
* B. `INSERT INTO employees (employee_id, last_name, salary) VALUES (202, 'Tran', 4999);`
* C. `INSERT INTO employees (employee_id, last_name, salary) VALUES (203, 'Le', NULL);`
* D. `INSERT INTO employees (employee_id, last_name, salary) VALUES (204, 'Pham', 0);`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C**
* **Giải thích chuyên sâu:**
  * **A đúng:** Giá trị `salary = 5000` làm cho biểu thức `salary >= 5000` (`5000 >= 5000`) trả về `TRUE`, thỏa mãn ràng buộc `CHECK`.
  * **C đúng (Bẫy thi rất hay gặp):** Trong Oracle Database, một ràng buộc `CHECK (<điều_kiện>)` chỉ chặn dữ liệu khi `<điều_kiện>` đánh giá ra kết quả **`FALSE`**. Khi chèn `salary = NULL`, biểu thức `NULL >= 5000` đánh giá ra giá trị logic thứ ba là **`UNKNOWN`** (không phải `FALSE`!). Do đó, giá trị `NULL` **hoàn toàn vượt qua được ràng buộc `CHECK`** nếu cột đó không có ràng buộc `NOT NULL` hoặc điều kiện `IS NOT NULL`.
  * **B và D sai:** Giá trị `4999` và `0` làm cho biểu thức `salary >= 5000` trả về `FALSE`, vi phạm ràng buộc `CHECK` và bị chặn lại với lỗi `ORA-02290: check constraint (EMP_SAL_CK) violated`.
</details>
