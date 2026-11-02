# Chương 1: Tổng Quan Oracle Database và Ngôn Ngữ SQL - Oracle SQL OCA/OCP (1Z0-071)

> **Tài liệu tham chiếu:** *OCA Oracle Database SQL Certified Associate Study Guide (Exam 1Z0-071)* & *Oracle Database SQL Language Reference*.  
> **Mục tiêu khảo thí:** Relational Database Concepts (RDBMS, Tables, Rows, Columns, Schema); Entity-Relationship Model & Constraints (Primary Key, Foreign Key, Unique, Not Null, Check); SQL Statement Categories (DDL, DML, DQL, TCL, DCL); Oracle Tools (SQL\*Plus, Oracle SQL Developer, SQLcl); Bảng hệ thống `DUAL`; Cấu trúc và quy tắc cú pháp của câu lệnh SQL trong Oracle.

---

## 📑 Mục Lục Chi Tiết

1. [Kiến Trúc Cơ Sở Dữ Liệu Quan Hệ (RDBMS) & Oracle Database](#1-kiến-trúc-cơ-sở-dữ-liệu-quan-hệ-rdbms--oracle-database)
2. [Các Khái Niệm Cốt Lõi: Schema, Table, Row, Column](#2-các-khái-niệm-cốt-lõi-schema-table-row-column)
3. [Toàn Vẹn Dữ Liệu: Primary Key, Foreign Key & Các Ràng Buộc](#3-toàn-vẹn-dữ-liệu-primary-key-foreign-key--các-ràng-buộc)
4. [Ngôn Ngữ SQL & Phân Loại 5 Nhóm Lệnh (DQL, DML, DDL, TCL, DCL)](#4-ngôn-ngữ-sql--phân-loại-5-nhóm-lệnh-dql-dml-ddl-tcl-dcl)
5. [Công Cụ Làm Việc: Oracle SQL Developer, SQL\*Plus & Bảng `DUAL`](#5-công-cụ-làm-việc-oracle-sql-developer-sqlplus--bảng-dual)
6. [Cấu Trúc Cơ Bản & Quy Tắc Viết Câu Lệnh SQL Trong Oracle](#6-cấu-trúc-cơ-bản--quy-tắc-viết-câu-lệnh-sql-trong-oracle)
7. [Bài Tập Thực Hành Tự Luyện (Hands-on Labs)](#7-bài-tập-thực-hành-tự-luyện-hands-on-labs)
8. [Tổng Hợp Bẫy Thi OCA/OCP Cốt Lõi Cần Nhớ (Exam Essentials)](#8-tổng-hợp-bẫy-thi-ocaocp-cốt-lõi-cần-nhớ-exam-essentials)

---

## 1. Kiến Trúc Cơ Sở Dữ Liệu Quan Hệ (RDBMS) & Oracle Database

### 1.1. Mô hình Cơ sở dữ liệu Quan hệ (Relational Database Management System - RDBMS)
Được Tiến sĩ **E.F. Codd** đề xuất vào năm 1970, mô hình quan hệ tổ chức dữ liệu thành các **bảng hai chiều (two-dimensional tables)** gọi là các *quan hệ (relations)*. Một hệ quản trị cơ sở dữ liệu quan hệ (**RDBMS**) như **Oracle Database** đảm nhiệm việc lưu trữ, truy xuất, bảo mật và đảm bảo tính toàn vẹn dữ liệu (ACID) ở quy mô doanh nghiệp.

Ba thành phần nền tảng của mô hình quan hệ:
1. **Cấu trúc dữ liệu (Data Structures):** Dữ liệu được tổ chức trong các bảng (*Tables*) gồm các hàng (*Rows / Tuples*) và các cột (*Columns / Attributes*).
2. **Toàn vẹn dữ liệu (Data Integrity):** Các quy tắc nghiệp vụ và ràng buộc (*Constraints*) đảm bảo dữ liệu luôn chính xác, nhất quán (Entity Integrity, Referential Integrity, Domain Integrity).
3. **Thao tác dữ liệu (Data Manipulation):** Sử dụng phép toán đại số quan hệ thông qua ngôn ngữ truy vấn có cấu trúc **SQL (Structured Query Language)** như:
   * **Phép chọn (Selection):** Lọc ra một tập con các **dòng (rows)** thỏa mãn điều kiện (tương ứng mệnh đề `WHERE`).
   * **Phép chiếu (Projection):** Chọn ra một tập con các **cột (columns)** từ bảng (tương ứng danh sách cột trong mệnh đề `SELECT`).
   * **Phép kết (Joining):** Ghép nối dữ liệu từ hai hay nhiều bảng dựa trên các cột liên kết chung (tương ứng mệnh đề `JOIN`).

> [!IMPORTANT]
> **Ghi nhớ thuật ngữ thi 1Z0-071:** Đề thi quốc tế rất hay hỏi định nghĩa của 3 năng lực cốt lõi trong câu lệnh `SELECT`:
> * **Projection (Phép chiếu):** Giới hạn các **cột (columns)** trả về.
> * **Selection (Phép chọn):** Giới hạn các **dòng (rows)** trả về bằng mệnh đề `WHERE`.
> * **Joining (Phép kết):** Liên kết dữ liệu từ nhiều **bảng (tables)** khác nhau.

### 1.2. Kiến trúc tổng quan của Oracle Database Server
Trong môi trường Oracle, một **Oracle Database Server** bao gồm 2 phần tách biệt rõ rệt:
* **Oracle Instance (Bộ nhớ & Tiến trình):** Gồm vùng nhớ chia sẻ **SGA (System Global Area)** (chứa *Shared Pool* để parse/cache câu lệnh SQL và *Database Buffer Cache* để lưu các khối dữ liệu đang làm việc trên RAM) cùng với các tiến trình nền (*Background Processes* như DBWn, LGWR, CKPT, SMON, PMON).
* **Oracle Database (Lưu trữ vật lý trên đĩa):** Bao gồm các tập tin vật lý lưu trên ổ cứng: *Datafiles* (chứa dữ liệu thực tế của bảng và index), *Control files* (chứa metadata cấu trúc vật lý của DB), và *Online Redo Log files* (lưu nhật ký thay đổi phục vụ khôi phục dữ liệu).

---

## 2. Các Khái Niệm Cốt Lõi: Schema, Table, Row, Column

### 2.1. User và Schema trong Oracle Database
Trong nhiều hệ quản trị CSDL khác (như PostgreSQL hay SQL Server), một User có thể tạo nhiều Schema độc lập. Tuy nhiên, trong **Oracle Database**, khái niệm **User** và **Schema** có mối quan hệ **1-1 (một-một)**:
* **User:** Là tài khoản dùng để đăng nhập (xác thực và phân quyền) vào Oracle Database (ví dụ: `HR`, `SCOTT`, `SYS`).
* **Schema:** Là tập hợp tất cả các **đối tượng cơ sở dữ liệu (Database Objects / Schema Objects)** thuộc sở hữu của một User cụ thể. Tên của Schema trùng khớp 100% với tên của User đó.
* **Các Schema Objects phổ biến:**
  * `TABLE`: Đơn vị lưu trữ dữ liệu cơ bản gồm hàng và cột.
  * `VIEW`: Bảng ảo (không lưu dữ liệu vật lý trừ *Materialized View*) được định nghĩa bởi một câu truy vấn `SELECT`.
  * `INDEX`: Cấu trúc cây (B-Tree) hoặc Bitmap giúp tăng tốc độ tìm kiếm dòng dữ liệu.
  * `SEQUENCE`: Bộ sinh số tự động tăng/giảm duy nhất trong bộ nhớ, thường dùng để cấp giá trị cho khóa chính.
  * `SYNONYM`: Bí danh (tên gọi thay thế) cho một bảng, view hoặc đối tượng khác.
  * `PROCEDURE`, `FUNCTION`, `PACKAGE`, `TRIGGER`: Các khối mã lập trình PL/SQL được lưu trữ trong Database.

Khi truy cập một bảng thuộc Schema khác (nếu đã được cấp quyền), bạn dùng cú pháp tiền tố: `schema_name.object_name`:
```sql
SELECT employee_id, first_name, salary
FROM hr.employees;
```
Nếu không ghi tên Schema, Oracle mặc định tìm đối tượng trong **Schema hiện tại** của phiên đăng nhập (Current Schema).

### 2.2. Cấu trúc Bảng (Table), Dòng (Row) và Cột (Column)
Hãy quan sát bảng mẫu `DEPARTMENTS` trong Schema `HR`:

| DEPARTMENT_ID (PK) | DEPARTMENT_NAME | MANAGER_ID | LOCATION_ID (FK) |
| :---: | :--- | :---: | :---: |
| 10 | Administration | 200 | 1700 |
| 20 | Marketing | 201 | 1800 |
| 60 | IT | 103 | 1400 |
| 90 | Executive | 100 | 1700 |
| 110 | Accounting | 205 | 1700 |

* **Table (Bảng / Relation):** Tập hợp các dòng dữ liệu có cùng cấu trúc thuộc tính (ở đây là bảng `DEPARTMENTS`).
* **Row (Dòng / Bản ghi / Record / Tuple):** Một hàng ngang đại diện cho một thực thể cụ thể (ví dụ: phòng ban `IT` có mã `60`, trưởng phòng `103`, đặt tại địa điểm `1400`). Thứ tự các dòng lưu trữ vật lý trong bảng là **không xác định** nếu không dùng mệnh đề `ORDER BY`.
* **Column (Cột / Trường / Field / Attribute):** Một cột dọc đại diện cho một thuộc tính của thực thể, bắt buộc phải có **tên cột (Column Name)** và **kiểu dữ liệu (Data Type)** cố định (ví dụ cột `DEPARTMENT_NAME` có kiểu `VARCHAR2(30)`).
* **Field / Cell (Ô dữ liệu):** Giao điểm của 1 dòng và 1 cột, chứa tối đa **1 giá trị đơn nguyên (atomic value)** hoặc trạng thái rỗng `NULL`.

> [!WARNING]
> **Bẫy quy tắc đặt tên đối tượng (Object Naming Rules) trong Oracle:**
> 1. Tên bảng và tên cột truyền thống (trước Oracle 12cR2) dài tối đa **30 bytes**; từ Oracle 12.2 trở đi được mở rộng lên tối đa **128 bytes**.
> 2. Tên không đặt trong dấu nháy kép (**Unquoted Identifier**) **bắt buộc phải bắt đầu bằng một chữ cái** (`A-Z`, `a-z`), chỉ được chứa chữ cái, chữ số (`0-9`), và 3 ký tự đặc biệt: dấu gạch dưới (`_`), dấu đô la (`$`), dấu thăng (`#`).
> 3. Oracle tự động chuyển các tên không đặt trong nháy kép thành **CHỮ HOA (UPPERCASE)** trong Data Dictionary.
> 4. Nếu đặt tên trong dấu nháy kép (`"My Table!"`), bạn có thể bắt đầu bằng ký tự bất kỳ, chứa khoảng trắng và phân biệt hoa thường, nhưng mọi câu lệnh sau đó **bắt buộc** phải dùng đúng cặp dấu nháy kép và đúng chữ hoa/thường đó.

---

## 3. Toàn Vẹn Dữ Liệu: Primary Key, Foreign Key & Các Ràng Buộc

Trong Oracle RDBMS, có 5 loại ràng buộc toàn vẹn (Constraints) cốt lõi:

| Loại Ràng Buộc | Từ khóa SQL | Ý nghĩa & Quy tắc hoạt động |
| :--- | :--- | :--- |
| **Khóa chính** | `PRIMARY KEY` | Định danh duy nhất mỗi dòng trong bảng. Kết hợp của `UNIQUE` + `NOT NULL`. Mỗi bảng chỉ có **tối đa 1 Primary Key** (có thể gồm 1 cột hoặc tổ hợp nhiều cột gọi là *Composite Primary Key*). |
| **Khóa ngoại** | `FOREIGN KEY` (`REFERENCES`) | Thiết lập mối quan hệ cha-con giữa 2 bảng (hoặc tự tham chiếu chính bảng đó). Giá trị của cột FK phải khớp với một giá trị đang tồn tại ở cột PK/Unique của bảng cha, **hoặc có thể nhận giá trị `NULL`**. |
| **Khóa duy nhất** | `UNIQUE` | Đảm bảo không có 2 dòng nào trùng giá trị trên cột (hoặc nhóm cột). Một bảng có thể có **nhiều** ràng buộc `UNIQUE`. Khác với PK, cột `UNIQUE` **cho phép chứa nhiều giá trị `NULL`** (trừ khi kết hợp thêm `NOT NULL`). |
| **Không rỗng** | `NOT NULL` | Bắt buộc cột phải có giá trị (không được để `NULL`). Chỉ khai báo được ở mức cột (Column-level) khi tạo bảng. |
| **Kiểm tra miền** | `CHECK` | Quy định điều kiện biểu thức logic (ví dụ `CHECK (salary > 0)`). Lưu ý: Nếu biểu thức trả về `TRUE` hoặc `UNKNOWN` (do cột là `NULL`), dữ liệu vẫn vượt qua được `CHECK`! |

### 3.1. Phân tích sâu về Primary Key (Khóa chính)
* Khi tạo một `PRIMARY KEY` (hoặc `UNIQUE`), Oracle sẽ **tự động tạo một Unique Index** ngầm định trên cột (hoặc tập cột) đó (nếu chưa có index sẵn) để kiểm tra tính duy nhất tức thời và tối ưu hóa phép kết (`JOIN`).
* Trong trường hợp **Composite Primary Key** (Khóa chính phức hợp gồm nhiều cột, ví dụ `(order_id, product_id)` trong bảng `ORDER_ITEMS`):
  * Vẫn chỉ được tính là **1 Primary Key duy nhất** của bảng.
  * Không một cột thành phần nào trong Composite PK được phép nhận giá trị `NULL`.

### 3.2. Phân tích sâu về Foreign Key (Khóa ngoại) và Toàn vẹn tham chiếu
Hãy xem ví dụ quan hệ giữa bảng cha `DEPARTMENTS` và bảng con `EMPLOYEES`:

```sql
CREATE TABLE departments (
    department_id   NUMBER(4)    CONSTRAINT dept_id_pk PRIMARY KEY,
    department_name VARCHAR2(30) CONSTRAINT dept_name_nn NOT NULL
);

CREATE TABLE employees (
    employee_id     NUMBER(6)    CONSTRAINT emp_id_pk PRIMARY KEY,
    last_name       VARCHAR2(25) CONSTRAINT emp_lname_nn NOT NULL,
    salary          NUMBER(8,2)  CONSTRAINT emp_sal_ck CHECK (salary > 0),
    department_id   NUMBER(4)    CONSTRAINT emp_dept_fk REFERENCES departments(department_id)
);
```

**Các quy tắc sống còn của Foreign Key trong đề thi:**
1. **Foreign Key có được phép `NULL` không?** **CÓ!** Trừ khi cột đó được gắn thêm ràng buộc `NOT NULL`. Ví dụ trong bảng `EMPLOYEES` của schema `HR`, nhân viên `Kimberely Grant` (mã `178`) chưa được phân vào phòng ban nào nên có `department_id = NULL` — điều này hoàn toàn hợp lệ với ràng buộc Foreign Key.
2. **Foreign Key phải tham chiếu đến cột nào ở bảng cha?** Cột được tham chiếu ở bảng cha **bắt buộc** phải là `PRIMARY KEY` hoặc `UNIQUE KEY` của bảng cha. Không thể tham chiếu tới một cột bình thường không có ràng buộc duy nhất.
3. **Chuyện gì xảy ra khi xóa dòng ở bảng cha?**
   * **Mặc định (`NO ACTION` / Restrict):** Oracle **chặn không cho xóa** dòng ở bảng cha nếu đang có ít nhất một dòng ở bảng con tham chiếu tới nó (báo lỗi `ORA-02292: integrity constraint violated - child record found`).
   * **`ON DELETE CASCADE`:** Khi xóa dòng ở bảng cha, Oracle tự động xóa luôn tất cả các dòng con liên quan ở bảng con.
   * **`ON DELETE SET NULL`:** Khi xóa dòng ở bảng cha, Oracle giữ lại dòng con nhưng tự động cập nhật cột khóa ngoại ở bảng con thành `NULL`.

> [!TIP]
> **Bẫy kinh điển:** Khác với Primary Key và Unique Key, khi bạn tạo một **Foreign Key**, Oracle **KHÔNG tự động tạo Index** trên cột khóa ngoại đó! Trong thực tế vận hành (và các câu hỏi tình huống OCP), DBA/Developer phải chủ động tạo Index trên cột Foreign Key để tránh hiện tượng khóa toàn bộ bảng con (*Full Table Lock*) khi bảng cha thực hiện `DELETE` hoặc cập nhật khóa chính.

---

## 4. Ngôn Ngữ SQL & Phân Loại 5 Nhóm Lệnh (DQL, DML, DDL, TCL, DCL)

SQL (Structured Query Language) là ngôn ngữ phi thủ tục (non-procedural / declarative language): bạn chỉ mô tả **cái gì (what)** cần lấy hoặc thay đổi, còn **cách thức (how)** thực thi tối ưu sẽ do bộ **Cost-Based Optimizer (CBO)** của Oracle quyết định.

Trong tài liệu chuẩn của Oracle và đề thi 1Z0-071, các câu lệnh SQL được chia thành các nhóm chức năng sau:

```
                        ┌────────────────────────────────────┐
                        │     CÁC NHÓM LỆNH TRONG ORACLE     │
                        └─────────────────┬──────────────────┘
          ┌───────────────┬───────────────┼───────────────┬───────────────┐
          ▼               ▼               ▼               ▼               ▼
    ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐
    │    DQL    │   │    DML    │   │    DDL    │   │    TCL    │   │    DCL    │
    ├───────────┤   ├───────────┤   ├───────────┤   ├───────────┤   ├───────────┤
    │ • SELECT  │   │ • INSERT  │   │ • CREATE  │   │ • COMMIT  │   │ • GRANT   │
    └───────────┘   │ • UPDATE  │   │ • ALTER   │   │ • ROLLBACK│   │ • REVOKE  │
                    │ • DELETE  │   │ • DROP    │   │ • SAVEPOINT   └───────────┘
                    │ • MERGE   │   │ • TRUNCATE│   └───────────┘
                    └───────────┘   │ • RENAME  │
                                    │ • COMMENT │
                                    └───────────┘
```

### 4.1. Bảng phân tích chi tiết các nhóm lệnh SQL

| Nhóm lệnh | Tên đầy đủ | Các lệnh tiêu biểu | Cơ chế Transaction (Giao dịch) |
| :--- | :--- | :--- | :--- |
| **DQL** *(Đôi khi gộp chung vào DML trong tài liệu Oracle)* | **Data Query Language** (Ngôn ngữ truy vấn dữ liệu) | `SELECT` | Chỉ đọc dữ liệu (trừ `SELECT ... FOR UPDATE` có khóa dòng). Đảm bảo tính nhất quán tại thời điểm đọc (*Read Consistency*) nhờ Undo Segments. |
| **DML** | **Data Manipulation Language** (Ngôn ngữ thao tác dữ liệu) | `INSERT`, `UPDATE`, `DELETE`, `MERGE` | Làm thay đổi dữ liệu bên trong bảng. **KHÔNG tự động Commit**. Thay đổi có thể được hoàn tác bằng `ROLLBACK` hoặc lưu vĩnh viễn bằng `COMMIT`. |
| **DDL** | **Data Definition Language** (Ngôn ngữ định nghĩa dữ liệu) | `CREATE`, `ALTER`, `DROP`, `TRUNCATE`, `RENAME`, `COMMENT` | Định nghĩa hoặc thay đổi cấu trúc đối tượng trong Data Dictionary. **Tự động thực hiện `COMMIT` ngầm định (Implicit Commit)** cả trước và sau khi chạy lệnh! |
| **TCL** | **Transaction Control Language** (Ngôn ngữ điều khiển giao dịch) | `COMMIT`, `ROLLBACK`, `SAVEPOINT`, `SET TRANSACTION` | Quản lý các thay đổi do lệnh DML tạo ra, gom chúng thành các đơn vị giao dịch logic (Transaction). |
| **DCL** | **Data Control Language** (Ngôn ngữ điều khiển quyền truy cập) | `GRANT`, `REVOKE` | Cấp phát hoặc thu hồi quyền hệ thống (*System Privileges*) và quyền đối tượng (*Object Privileges*). Cũng **tự động `COMMIT`** ngay khi thực thi. |

> [!WARNING]
> **3 Bẫy Thi "Chết Người" Về Phân Loại Lệnh SQL Trong Đề 1Z0-071 & VNPT:**
> 1. **`TRUNCATE` vs `DELETE`:**
>    * `DELETE` là lệnh **DML** (xóa từng dòng theo điều kiện `WHERE`, sinh nhiều dữ liệu Undo, **có thể `ROLLBACK`**).
>    * `TRUNCATE TABLE` là lệnh **DDL** (giải phóng ngay các trang dữ liệu - *deallocates space/resets High Water Mark*, không có mệnh đề `WHERE`, thực hiện Implicit Commit nên **KHÔNG THỂ `ROLLBACK`**!).
> 2. **Bẫy Implicit Commit của DDL/DCL:**
>    * Giả sử bạn chạy lệnh `INSERT INTO emp ...;` rồi chưa `COMMIT`. Ngay sau đó bạn chạy lệnh `CREATE TABLE test_tbl (id NUMBER);` — kể cả khi lệnh `CREATE TABLE` này **bị lỗi cú pháp hay lỗi trùng tên bảng và thất bại**, Oracle vẫn đã thực hiện một lệnh `COMMIT` ngầm định trước khi thực thi DDL! Do đó dòng `INSERT` trước đó đã được lưu vĩnh viễn và không thể `ROLLBACK` được nữa.
> 3. **Trong tài liệu Oracle chính thức:** Đôi khi câu lệnh `SELECT` được xếp chung vào nhóm **DML** (nếu câu hỏi chỉ chia làm 4 nhóm: DML, DDL, TCL, DCL). Nếu câu hỏi tách riêng **DQL**, hãy chọn DQL cho `SELECT`.

---

## 5. Công Cụ Làm Việc: Oracle SQL Developer, SQL\*Plus & Bảng `DUAL`

### 5.1. So sánh Oracle SQL Developer và SQL\*Plus
Oracle cung cấp hai công cụ phổ biến nhất cho lập trình viên và quản trị viên:

| Tiêu chí | Oracle SQL Developer | SQL\*Plus |
| :--- | :--- | :--- |
| **Giao diện** | Giao diện đồ họa (**GUI**) viết bằng Java, trực quan, đa nền tảng. | Giao diện dòng lệnh (**CLI - Command Line Interface**) truyền thống, siêu nhẹ, có sẵn trên mọi máy chủ cài đặt Oracle. |
| **Duyệt đối tượng** | Có cây thư mục duyệt trực tiếp Tables, Views, Indexes, Packages. | Phải dùng lệnh `DESCRIBE` hoặc truy vấn các Data Dictionary Views (`USER_TABLES`, `ALL_TAB_COLUMNS`). |
| **Dấu kết thúc lệnh SQL** | Có thể dùng dấu chấm phẩy `;` hoặc dấu gạch chéo `/` trên dòng mới (khi chạy *Run Script - F5*). Khi bấm *Run Statement (Ctrl+Enter)* thì dấu `;` là tùy chọn. | **Bắt buộc** phải kết thúc lệnh SQL bằng dấu `;` ở cuối dòng, hoặc dấu `/` nằm một mình trên dòng mới để thực thi lệnh trong SQL Buffer. |
| **Lệnh đặc thù của công cụ** | Hỗ trợ hầu hết các lệnh của SQL\*Plus. | Có bộ lệnh riêng của công cụ (**SQL\*Plus Commands**) như `SET PAGESIZE`, `SET LINESIZE`, `SPOOL`, `COLUMN`, `DESCRIBE`. |

### 5.2. Phân biệt Lệnh SQL (SQL Statements) và Lệnh SQL\*Plus (SQL\*Plus Commands)
Đây là câu hỏi lý thuyết rất hay xuất hiện trong phần đầu đề thi OCA:

* **SQL Statements (`SELECT`, `INSERT`, `CREATE`, ...):**
  * Được gửi tới **Oracle Database Server** để thực thi.
  * Được lưu trữ trong bộ đệm lệnh (**SQL Buffer**) cho đến khi có lệnh SQL mới ghi đè lên.
  * Bắt buộc phải có dấu kết thúc lệnh (`;` hoặc `/`).
  * Từ khóa **không thể viết tắt** (ví dụ không thể viết `SEL * FROM emp`).
* **SQL\*Plus Commands (`DESCRIBE`, `SET`, `SPOOL`, `SHOW`, `EDIT`, ...):**
  * Chỉ xử lý ở phía **Client (trình SQL\*Plus)** để định dạng kết quả hiển thị hoặc điều khiển môi trường.
  * **KHÔNG** được lưu vào SQL Buffer.
  * **Không bắt buộc** phải có dấu chấm phẩy `;` ở cuối dòng (nhưng nếu có cũng không sao ở nhiều lệnh như `DESC`).
  * Từ khóa **có thể viết tắt** (ví dụ: `DESCRIBE` có thể viết gọn là `DESC`, `DEFINE` viết tắt là `DEF`).

```sql
-- Ví dụ lệnh DESCRIBE (hoặc DESC) để xem cấu trúc bảng EMPLOYEES:
DESC employees
```

**Kết quả đầu ra của lệnh `DESC employees`:**
```text
Name           Null?    Type
-------------- -------- ------------
EMPLOYEE_ID    NOT NULL NUMBER(6)
FIRST_NAME              VARCHAR2(20)
LAST_NAME      NOT NULL VARCHAR2(25)
EMAIL          NOT NULL VARCHAR2(25)
HIRE_DATE      NOT NULL DATE
JOB_ID         NOT NULL VARCHAR2(10)
SALARY                  NUMBER(8,2)
DEPARTMENT_ID           NUMBER(4)
```

### 5.3. Bảng hệ thống `DUAL` (The `DUAL` Table)
Trong Oracle SQL, mọi câu lệnh `SELECT` **bắt buộc phải có mệnh đề `FROM`** (khác với MySQL hay SQL Server cho phép viết `SELECT 1 + 1;` không cần `FROM` — lưu ý từ Oracle 23ai mới bổ sung tùy chọn bỏ `FROM`, nhưng trong chuẩn thi OCA/OCP 1Z0-071 (12c/19c/21c), **`SELECT` thiếu `FROM` sẽ báo lỗi `ORA-00923: FROM keyword not found where expected`**).

Vậy khi muốn tính toán biểu thức số học, gọi hàm hệ thống (`SYSDATE`, `USER`, `UPPER(...)`) hoặc in ra một hằng chuỗi mà không lấy dữ liệu từ bảng nghiệp vụ nào, ta dùng bảng gì? Đó chính là bảng **`DUAL`**.

**Đặc điểm cốt lõi của bảng `DUAL`:**
1. **Chủ sở hữu (Owner):** Thuộc sở hữu của schema quản trị cao nhất **`SYS`** (`SYS.DUAL`).
2. **Quyền truy cập:** Có một **Public Synonym** tên là `DUAL` và được cấp quyền `SELECT` cho `PUBLIC`, nên **mọi User** trong Database đều có thể truy vấn `SELECT ... FROM dual;` mà không cần viết `sys.dual`.
3. **Cấu trúc bảng `DUAL`:**
   * Chỉ có **duy nhất 1 cột** tên là `DUMMY` với kiểu dữ liệu `VARCHAR2(1)`.
   * Chỉ chứa **duy nhất 1 dòng dữ liệu** có giá trị là `'X'`.

**Ví dụ thực tế với bảng `DUAL`:**
```sql
-- 1. Xem cấu trúc và dữ liệu gốc của bảng DUAL
SELECT * FROM dual;

-- 2. Dùng DUAL để tính toán biểu thức và lấy ngày giờ hệ thống
SELECT (1500 * 12) + 500 AS annual_comp,
       UPPER('oracle ocp') AS course_title,
       USER AS current_user
FROM dual;
```

**Kết quả đầu ra (Truy vấn 1):**
| DUMMY |
| :---: |
| X |

**Kết quả đầu ra (Truy vấn 2):**
| ANNUAL_COMP | COURSE_TITLE | CURRENT_USER |
| :---: | :--- | :--- |
| 18500 | ORACLE OCP | HR |

> [!IMPORTANT]
> Vì bảng `DUAL` chỉ có đúng **1 dòng**, bất kỳ biểu thức hằng hoặc hàm đơn dòng nào chạy trên `FROM dual` cũng sẽ trả về chính xác **1 dòng kết quả**. Nếu bạn chạy `SELECT 'Hello' FROM employees;` trên bảng `EMPLOYEES` có 107 dòng, kết quả sẽ in ra chữ `'Hello'` lặp lại **107 lần**!

---

## 6. Cấu Trúc Cơ Bản & Quy Tắc Viết Câu Lệnh SQL Trong Oracle

### 6.1. Cú pháp tổng quát của câu lệnh SQL
```sql
SELECT [DISTINCT | ALL] { * | column_expression [AS alias], ... }
FROM schema.table_name
[WHERE condition]
[GROUP BY group_by_expression]
[HAVING group_condition]
[ORDER BY column_or_expr [ASC | DESC]]
[FETCH FIRST n ROWS ONLY];
```

### 6.2. 6 Quy tắc cú pháp vàng khi viết SQL trong Oracle
1. **Tính phân biệt chữ hoa/thường (Case-Sensitivity):**
   * Các từ khóa SQL (`SELECT`, `FROM`, `WHERE`), tên bảng (`employees`), tên cột (`salary`) **KHÔNG phân biệt chữ hoa/thường** (trừ khi tên đối tượng được tạo trong dấu nháy kép `"..."`).
   * **Dữ liệu chuỗi ký tự (Character Literals)** nằm trong dấu nháy đơn `'...'` **PHÂN BIỆT CHỮ HOA/THƯỜNG tuyệt đối**! Ví dụ: `'King'` khác hoàn toàn với `'KING'` hay `'king'`.
2. **Viết trên một hoặc nhiều dòng:**
   * Câu lệnh SQL có thể viết trên 1 dòng hoặc ngắt thành nhiều dòng để dễ đọc.
   * **Từ khóa (Keywords) không được phép ngắt đôi xuống dòng** hoặc viết tắt (ví dụ không được ngắt chữ `SE-` ở dòng 1 và `LECT` ở dòng 2).
3. **Cách viết Hằng chuỗi (String Literals) và Hằng số (Numeric Literals):**
   * Chuỗi ký tự và ngày tháng **bắt buộc** đặt trong cặp dấu nháy đơn `'...'` (ví dụ `'IT_PROG'`, `'01-JAN-2025'`).
   * Dấu nháy kép `"..."` **CHỈ** dùng cho tên định danh (Column Alias hoặc tên bảng/cột có ký tự đặc biệt), tuyệt đối không dùng để bao quanh giá trị chuỗi trong mệnh đề `WHERE`!
4. **Cách viết Chú thích (Comments) trong SQL:**
   * **Comment 1 dòng:** Bắt đầu bằng hai dấu gạch ngang liên tiếp `--` cho đến hết dòng.
   * **Comment nhiều dòng (hoặc inline hint):** Bắt đầu bằng `/*` và kết thúc bằng `*/`.

```sql
/* Truy vấn lấy thông tin nhân viên phòng IT (Mã 60)
   Tác giả: Quản trị viên CSDL */
SELECT employee_id,
       last_name, -- Họ của nhân viên
       salary
FROM employees
WHERE department_id = 60;
```

**Bảng dữ liệu mẫu `EMPLOYEES` (trích xuất phòng 60):**
| EMPLOYEE_ID | FIRST_NAME | LAST_NAME | JOB_ID | SALARY | DEPARTMENT_ID |
| :---: | :--- | :--- | :--- | :---: | :---: |
| 103 | Alexander | Hunold | IT_PROG | 9000 | 60 |
| 104 | Bruce | Ernst | IT_PROG | 6000 | 60 |
| 105 | David | Austin | IT_PROG | 4800 | 60 |

**Kết quả đầu ra của câu truy vấn trên:**
| EMPLOYEE_ID | LAST_NAME | SALARY |
| :---: | :--- | :---: |
| 103 | Hunold | 9000 |
| 104 | Ernst | 6000 |
| 105 | Austin | 4800 |

---

## 7. Bài Tập Thực Hành Tự Luyện (Hands-on Labs)

### Bài tập 1: Nhận diện Phép toán Quan hệ & Ràng buộc Khóa
**Đề bài:** Cho bảng `PROJECTS` (`project_id` PK, `project_name`, `budget`) và bảng `ASSIGNMENTS` (`assignment_id` PK, `project_id` FK tham chiếu `PROJECTS(project_id)`, `emp_id`, `hours_worked`).
1. Hãy viết câu lệnh SQL thực hiện đồng thời cả **Phép chiếu (Projection)** lấy 2 cột `project_name`, `budget` và **Phép chọn (Selection)** lấy các dự án có ngân sách lớn hơn `50000`.
2. Giả sử bảng `ASSIGNMENTS` chưa bật `ON DELETE CASCADE` hay `ON DELETE SET NULL`. Điều gì xảy ra nếu ta:
   * Chèn một dòng vào `ASSIGNMENTS` với `project_id = NULL`?
   * Xóa một dự án có `project_id = 10` trong bảng `PROJECTS` khi đang có 3 nhân viên được gán vào `project_id = 10` trong bảng `ASSIGNMENTS`?

<details>
<summary><b>👉 Xem Lời Giải Chi Tiết Bài Tập 1</b></summary>

1. **Câu lệnh SQL kết hợp Projection và Selection:**
```sql
SELECT project_name, budget   -- Projection: Chỉ lấy 2 cột từ bảng
FROM projects
WHERE budget > 50000;         -- Selection: Chỉ lọc các dòng thỏa điều kiện
```
2. **Phân tích hành vi của Foreign Key:**
   * **Khi chèn `project_id = NULL` vào `ASSIGNMENTS`:** Câu lệnh **THÀNH CÔNG** bình thường (trừ khi cột `project_id` có khai báo thêm `NOT NULL`). Ràng buộc `FOREIGN KEY` mặc định cho phép giá trị `NULL`.
   * **Khi xóa `project_id = 10` ở bảng cha `PROJECTS`:** Câu lệnh **THẤT BẠI** và văng lỗi `ORA-02292: integrity constraint violated - child record found` vì hành vi mặc định của khóa ngoại là `NO ACTION` (Restrict), ngăn không cho xóa bản ghi cha khi bản ghi con vẫn đang tồn tại.
</details>

---

### Bài tập 2: Phân tích kịch bản Transaction với DDL và DML
**Đề bài:** Một lập trình viên thực thi tuần tự các câu lệnh sau trong cùng một phiên làm việc (Session) trên bảng `DEPARTMENTS` (giả sử ban đầu chưa có phòng ban 300 và 310):
```sql
INSERT INTO departments (department_id, department_name) VALUES (300, 'AI Research');
SAVEPOINT sp1;
INSERT INTO departments (department_id, department_name) VALUES (310, 'Cloud Ops');
CREATE TABLE temp_log (log_id NUMBER PRIMARY KEY, log_date DATE);
ROLLBACK TO sp1;
ROLLBACK;
SELECT department_id, department_name FROM departments WHERE department_id IN (300, 310);
```
Hỏi câu lệnh `SELECT` cuối cùng trả về những dòng nào? Tại sao?

<details>
<summary><b>👉 Xem Lời Giải Chi Tiết Bài Tập 2</b></summary>

* **Kết quả trả về:** Cả **2 dòng** (`300 - AI Research` và `310 - Cloud Ops`) đều được hiển thị trong kết quả của lệnh `SELECT`!
* **Giải thích chi tiết:**
  1. Hai lệnh `INSERT` đầu tiên là lệnh **DML**, chèn dữ liệu vào bộ đệm giao dịch hiện tại và tạo điểm lưu `sp1`.
  2. Khi thực thi lệnh `CREATE TABLE temp_log ...`, đây là một lệnh **DDL (Data Definition Language)**. Trong Oracle, mọi lệnh DDL đều tự động phát sinh một lệnh **`COMMIT` ngầm định (Implicit Commit)** ngay trước và sau khi nó chạy.
  3. Lệnh `COMMIT` ngầm định này đã lưu vĩnh viễn cả hai phòng ban `300` và `310` vào Database, đồng thời **xóa bỏ toàn bộ các `SAVEPOINT` trước đó** (bao gồm `sp1`).
  4. Do đó, lệnh `ROLLBACK TO sp1;` sẽ báo lỗi `ORA-01086: savepoint 'SP1' never established`, và lệnh `ROLLBACK;` tiếp theo không còn gì để hoàn tác. Cả hai dòng `300` và `310` vẫn tồn tại bền vững trong bảng.
</details>

---

### Bài tập 3: Khắc phục lỗi cú pháp SQL & Sử dụng bảng `DUAL`
**Đề bài:** Đoạn script dưới đây chứa **3 lỗi sai** khiến Oracle báo lỗi hoặc chạy sai kết quả mong muốn. Hãy chỉ rõ từng lỗi và viết lại thành các câu lệnh SQL đúng chuẩn:
```sql
-- Câu 1: Tính thuế 10% của mức lương 5000
SELECT 5000 * 0.10 AS "Tax Amount";

-- Câu 2: Tìm nhân viên có họ là King
SELECT employee_id, first_name, last_name
FROM employees
WHERE last_name = "King";

-- Câu 3: Xem cấu trúc bảng departments bằng câu lệnh SQL lưu trong SQL Buffer
DESCRIBE departments;
```

<details>
<summary><b>👉 Xem Lời Giải Chi Tiết Bài Tập 3</b></summary>

* **Phân tích 3 lỗi sai:**
  1. **Ở Câu 1:** Thiếu mệnh đề `FROM`. Trong Oracle SQL (chuẩn thi 1Z0-071), mọi câu lệnh `SELECT` bắt buộc phải có `FROM`. Khi tính biểu thức độc lập, phải dùng `FROM dual;`.
  2. **Ở Câu 2:** Trong mệnh đề `WHERE last_name = "King"`, tác giả dùng dấu nháy kép `"King"` thay vì dấu nháy đơn `'King'`. Oracle hiểu `"King"` là tên một **cột (identifier)** chứ không phải hằng chuỗi ký tự, dẫn đến lỗi `ORA-00904: "King": invalid identifier`.
  3. **Ở Câu 3:** `DESCRIBE` là lệnh của công cụ **SQL\*Plus**, nó **không phải là lệnh SQL chuẩn** và **không được lưu vào SQL Buffer** (nếu gõ `/` sau lệnh `DESC`, SQL\*Plus sẽ chạy lại lệnh SQL trước đó chứ không chạy lại `DESC`).

* **Code sửa lại đúng chuẩn:**
```sql
-- Câu 1 đúng: Bổ sung FROM dual
SELECT 5000 * 0.10 AS "Tax Amount"
FROM dual;

-- Câu 2 đúng: Dùng dấu nháy đơn cho hằng chuỗi ký tự
SELECT employee_id, first_name, last_name
FROM employees
WHERE last_name = 'King';
```
</details>

---

## 8. Tổng Hợp Bẫy Thi OCA/OCP Cốt Lõi Cần Nhớ (Exam Essentials)

| # | Khía cạnh / Chủ đề | Quy tắc chuẩn & Bẫy thường gặp trong đề thi 1Z0-071 |
| :---: | :--- | :--- |
| **1** | **Projection vs Selection** | **Projection** lọc theo **cột** (`SELECT col1, col2`); **Selection** lọc theo **dòng** (`WHERE condition`); **Joining** nối nhiều bảng. |
| **2** | **Primary Key vs Unique** | Mỗi bảng chỉ có **tối đa 1 `PRIMARY KEY`** (không nhận `NULL`), nhưng có thể có **nhiều `UNIQUE`** (cho phép chứa nhiều giá trị `NULL`). |
| **3** | **Foreign Key & `NULL`** | Cột `FOREIGN KEY` **hoàn toàn được phép nhận giá trị `NULL`** (trừ khi có khai báo thêm `NOT NULL`). |
| **4** | **`DELETE` vs `TRUNCATE`** | `DELETE` là **DML** (có thể `WHERE`, có thể `ROLLBACK`). `TRUNCATE` là **DDL** (không có `WHERE`, tự động `COMMIT`, không thể `ROLLBACK`). |
| **5** | **DDL thất bại có Commit?** | **CÓ!** Ngay cả khi lệnh DDL (`CREATE`, `ALTER`, `DROP`) bị lỗi và thực thi thất bại, Oracle vẫn đã phát lệnh `COMMIT` ngầm định trước khi chạy DDL đó. |
| **6** | **Bảng `DUAL`** | Thuộc schema `SYS`, có **1 cột `DUMMY` (`VARCHAR2(1)`)** và **1 dòng chứa `'X'`**. Mọi User đều truy vấn được nhờ Public Synonym. |
| **7** | **Nháy đơn `' '` vs Nháy kép `" "`** | Nháy đơn `'abc'` dùng cho **hằng chuỗi/ngày tháng** (phân biệt hoa thường). Nháy kép `"Abc"` chỉ dùng cho **tên định danh / Alias**. |
| **8** | **Quy tắc đặt tên đối tượng** | Bắt đầu bằng chữ cái (nếu không có nháy kép), dài tối đa 30 bytes (cũ) / 128 bytes (từ 12.2+), chỉ chứa `A-Z`, `0-9`, `_`, `$`, `#`. |
| **9** | **Lệnh `DESCRIBE` (`DESC`)** | Là lệnh của client **SQL\*Plus / SQL Developer**, **không phải lệnh SQL**, có thể viết tắt là `DESC`, không lưu vào SQL Buffer. |
| **10** | **Schema trong Oracle** | Gắn kết 1-1 với **User**. Khi tạo một User và User đó tạo các đối tượng (Table, View, Sequence...), tập hợp các đối tượng đó chính là Schema cùng tên với User. |
