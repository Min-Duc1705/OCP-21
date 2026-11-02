# Chương 18: Index và Tối Ưu Hóa Hiệu Năng SQL (Index & SQL Performance Tuning) - Oracle SQL OCA & OCP

> **Tài liệu tham chiếu:** *OCA/OCP Oracle Database SQL Exam Guide (Exam 1Z0-071)* & *Oracle Database SQL Tuning Guide*.  
> **Mục tiêu khảo thí & thực chiến:** Hiểu sâu kiến trúc lưu trữ `B-Tree Index` và `Bitmap Index`; nắm vững `Composite Index`, `Function-Based Index`, `Invisible Index`; đọc hiểu Execution Plan (`EXPLAIN PLAN`, `DBMS_XPLAN`); phân biệt các phương pháp quét Index (`UNIQUE SCAN`, `RANGE SCAN`, `FULL SCAN`, `FAST FULL SCAN`, `SKIP SCAN`) và các thuật toán Join vật lý (`NESTED LOOPS`, `HASH JOIN`, `SORT MERGE JOIN`); nắm vững `Selectivity`, `Cardinality`, `Clustering Factor`, `DBMS_STATS` và các nguyên tắc tối ưu SQL thực chiến trong các hệ thống Enterprise / Viễn thông (VNPT, Viettel, Banking).

---

## 📑 Mục Lục Chi Tiết

1. [Kiến Trúc Index Trong Oracle: B-Tree Index vs. Bitmap Index](#1-kiến-trúc-index-trong-oracle-b-tree-index-vs-bitmap-index)
2. [Composite Index, Function-Based Index & Các Loại Index Đặc Biệt](#2-composite-index-function-based-index--các-loại-index-đặc-biệt)
3. [Các Phương Pháp Truy Cập Dữ Liệu (Access Paths)](#3-các-phương-pháp-truy-cập-dữ-liệu-access-paths)
4. [Các Thuật Toán Join Vật Lý (Physical Join Methods)](#4-các-thuật-toán-join-vật-lý-physical-join-methods)
5. [Selectivity, Cardinality & Clustering Factor](#5-selectivity-cardinality--clustering-factor)
6. [Đọc Hiểu Execution Plan Với EXPLAIN PLAN & DBMS_XPLAN](#6-đọc-hiểu-execution-plan-với-explain-plan--dbms_xplan)
7. [Cost-Based Optimizer (CBO) & Quản Trị Statistics (DBMS_STATS)](#7-cost-based-optimizer-cbo--quản-trị-statistics-dbms_stats)
8. [Các Nguyên Tắc SQL Tuning Thực Chiến (Best Practices)](#8-các-nguyên-tắc-sql-tuning-thực-chiến-best-practices)
9. [Bài Tập Thực Hành Tự Luyện (Kèm Lời Giải Chi Tiết)](#9-bài-tập-thực-hành-tự-luyện-kèm-lời-giải-chi-tiết)
10. [Tổng Hợp Bẫy Thi OCA/OCP & Phỏng Vấn Cốt Lõi (Exam Essentials)](#10-tổng-hợp-bẫy-thi-ocaocp--phỏng-vấn-cốt-lõi-exam-essentials)

---

## 1. Kiến Trúc Index Trong Oracle: B-Tree Index vs. Bitmap Index

Index (Chỉ mục) là một đối tượng schema độc lập về mặt vật lý (chiếm không gian lưu trữ Segment riêng trong Tablespace) nhưng phụ thuộc về mặt logic vào bảng (Table). Khi bảng bị xóa (`DROP TABLE`), toàn bộ các Index gắn với bảng đó sẽ tự động bị xóa theo.

Trong Oracle Database, hai cấu trúc Index quan trọng nhất là **B-Tree Index** (Balanced Tree - Mặc định) và **Bitmap Index**.

### 1.1. B-Tree Index (Balanced Tree Index)

B-Tree Index được tổ chức dưới dạng cây cân bằng gồm:
* **Root Block (Khối gốc):** Đỉnh của cây, chứa các con trỏ trỏ xuống các Branch Block.
* **Branch Blocks (Khối nhánh):** Chứa phạm vi giá trị khóa (key ranges) để điều hướng tìm kiếm xuống đúng Leaf Block.
* **Leaf Blocks (Khối lá):** Nơi thực sự chứa dữ liệu chỉ mục. Mỗi mục (Index Entry) trong Leaf Block gồm:
  * **Key Value:** Giá trị của cột (hoặc tổ hợp cột) được đánh Index.
  * **ROWID:** Địa chỉ vật lý chính xác của dòng dữ liệu trong bảng (gồm `Data Object Number`, `Relative File Number`, `Block Number`, và `Row Slot Number`).
  * Các Leaf Blocks được liên kết với nhau bằng **danh sách liên kết kép (Doubly Linked List)** theo thứ tự sắp xếp tăng dần của khóa, giúp việc quét theo dải (`RANGE SCAN`) hoặc quét ngược chiều (`DESCENDING`) cực kỳ nhanh chóng mà không cần quay ngược lên nhánh trên.

```sql
-- Cú pháp tạo B-Tree Index chuẩn (Mặc định)
CREATE INDEX idx_emp_last_name ON employees(last_name);

-- Cú pháp tạo Unique B-Tree Index
CREATE UNIQUE INDEX idx_emp_email ON employees(email);
```

#### Hành vi với giá trị `NULL` trong B-Tree Index:
* **Nguyên tắc vàng:** B-Tree Index **KHÔNG lưu trữ các dòng mà tất cả các cột trong Index đều là `NULL`** (All-NULL entries).
* Hệ quả: Nếu cột `commission_pct` có đánh B-Tree Index đơn (`CREATE INDEX idx_comm ON employees(commission_pct)`), câu truy vấn sau sẽ **KHÔNG THỂ** dùng Index đó mà buộc phải quét toàn bộ bảng (`TABLE ACCESS FULL`):
  ```sql
  -- ❌ B-Tree Index đơn KHÔNG lưu giá trị NULL -> Phải dùng TABLE ACCESS FULL
  SELECT employee_id, first_name
  FROM employees
  WHERE commission_pct IS NULL;
  ```
* Tuy nhiên, với `WHERE commission_pct IS NOT NULL`, Oracle **CÓ THỂ** sử dụng B-Tree Index vì mọi dòng khác `NULL` đều nằm trong Leaf Blocks!

> [!TIP]
> **Mẹo buộc B-Tree Index lưu cả dòng `NULL`:**  
> Vì B-Tree Index chỉ bỏ qua khi **TẤT CẢ** các cột trong khóa đều `NULL`, bạn có thể tạo một Composite Index kết hợp cột có thể `NULL` với một hằng số (ví dụ `0` hoặc `'X'`) hoặc một cột `NOT NULL`:
> ```sql
> CREATE INDEX idx_comm_include_null ON employees(commission_pct, 0);
> -- Lúc này mục chỉ mục là (NULL, 0) -> không phải hoàn toàn NULL nên được lưu vào B-Tree!
> -- Truy vấn WHERE commission_pct IS NULL sẽ dùng được INDEX RANGE SCAN!
> ```

---

### 1.2. Bitmap Index

Thay vì lưu danh sách `ROWID` cho từng dòng, **Bitmap Index** lưu một chuỗi bit (`0` và `1` - gọi là *Bitmap*) cho mỗi giá trị phân biệt (distinct value) của cột, cùng với dải `Start ROWID` đến `End ROWID`. Một hàm ánh xạ (Mapping Function) sẽ chuyển vị trí của bit `1` thành `ROWID` tương ứng.

```sql
-- Cú pháp tạo Bitmap Index (Chỉ hỗ trợ trên bản Oracle Enterprise Edition)
CREATE BITMAP INDEX bmp_cust_gender ON customers(gender);
CREATE BITMAP INDEX bmp_cust_region ON customers(region_code);
```

#### Ví dụ minh họa cấu trúc Bitmap:
Giả sử bảng `CUSTOMERS` có 6 dòng với cột `GENDER`:

| Row | ROWID | GENDER | MARITAL_STATUS |
| :---: | :--- | :---: | :---: |
| 1 | `AAAR3sAAEAAAACXAAA` | `M` | `SINGLE` |
| 2 | `AAAR3sAAEAAAACXAAB` | `F` | `MARRIED` |
| 3 | `AAAR3sAAEAAAACXAAC` | `F` | `SINGLE` |
| 4 | `AAAR3sAAEAAAACXAAD` | `M` | `MARRIED` |
| 5 | `AAAR3sAAEAAAACXAAE` | `NULL` | `SINGLE` |
| 6 | `AAAR3sAAEAAAACXAAF` | `F` | `MARRIED` |

Bitmap Index trên cột `GENDER` sẽ lưu 3 chuỗi bit:
* Giá trị `'M'`: `1 0 0 1 0 0`
* Giá trị `'F'`: `0 1 1 0 0 1`
* Giá trị `NULL`: `0 0 0 0 1 0`

#### Ưu điểm vượt trội của Bitmap Index:
1. **Có lưu trữ giá trị `NULL`:** Khác với B-Tree Index, Bitmap Index tạo một bitmap riêng cho giá trị `NULL`. Do đó truy vấn `WHERE gender IS NULL` sử dụng được Bitmap Index cực nhanh!
2. **Kết hợp nhiều điều kiện `AND` / `OR` / `NOT` siêu tốc:** Khi câu lệnh `WHERE` kết hợp nhiều cột có độ phân tán thấp (ví dụ: `WHERE gender = 'F' AND marital_status = 'MARRIED'`), Oracle chỉ cần thực hiện phép toán luận lý `BITAND` / `BITOR` trực tiếp trên các chuỗi bit ở cấp CPU trước khi giải mã ra `ROWID`.
3. **Đếm số lượng (`COUNT(*)`) cực nhanh:** Không cần truy cập vào bảng dữ liệu gốc (Table).

#### Tác động khóa (Locking) chết người khi thực hiện DML trên Bitmap Index:
> [!WARNING]
> **Tại sao TUYỆT ĐỐI KHÔNG dùng Bitmap Index cho hệ thống OLTP có nhiều giao dịch `INSERT/UPDATE/DELETE` đồng thời?**  
> * Trong **B-Tree Index**, khi sửa 1 dòng, Oracle chỉ khóa đúng 1 Index Entry của dòng đó (Row-level lock).  
> * Trong **Bitmap Index**, một phân đoạn chuỗi bit (Bitmap piece) có thể đại diện cho **hàng trăm đến hàng nghìn dòng dữ liệu** cùng lúc. Khi một giao dịch thực hiện `INSERT`, `UPDATE`, hoặc `DELETE` làm thay đổi giá trị cột có Bitmap Index, Oracle sẽ **khóa toàn bộ Bitmap piece đó**!  
> * Hệ quả: Hàng trăm phiên làm việc (sessions) khác đang cố gắng `INSERT/UPDATE` các dòng hoàn toàn khác nhau nhưng vô tình nằm chung trong cùng một Bitmap piece sẽ bị **treo cứng (Wait on TX Lock - mode 4 / Enqueue)**, gây tắc nghẽn nghiêm trọng toàn hệ thống!

### 1.3. Bảng So Sánh B-Tree Index vs. Bitmap Index

| Tiêu chí | B-Tree Index (Mặc định) | Bitmap Index |
| :--- | :--- | :--- |
| **Độ phân biệt dữ liệu (Cardinality)** | **Cao (High Cardinality)**: Mã KH, SĐT, Email, Số hóa đơn, Ngày giờ. | **Thấp (Low Cardinality)**: Giới tính, Trạng thái đơn, Mã tỉnh, Loại thuê bao. |
| **Môi trường phù hợp** | Hệ thống **OLTP** (Giao dịch thời gian thực, đọc/ghi liên tục). | Hệ thống **OLAP / Data Warehouse** (Đọc báo cáo lớn, ít cập nhật). |
| **Lưu trữ giá trị `NULL`** | **Không** lưu nếu toàn bộ các cột trong Index đều là `NULL`. | **Có** lưu trữ các dòng `NULL` như một bitmap riêng. |
| **Tác động khóa khi DML** | Chỉ khóa dòng đơn lẻ (Row-level lock), độ đồng thời cao. | Khóa cả đoạn Bitmap (chứa hàng trăm/nghìn dòng), gây nghẽn DML nặng. |
| **Kết hợp nhiều Index cùng lúc** | Phức tạp và tốn kém (`BITMAP CONVERSION FROM ROWIDS`). | Cực kỳ hiệu quả nhờ phép toán bit `BITMAP AND`, `BITMAP OR`. |

---

## 2. Composite Index, Function-Based Index & Các Loại Index Đặc Biệt

### 2.1. Composite Index (Concatenated Index - Chỉ mục ghép)

**Composite Index** là Index được tạo trên từ 2 cột trở lên (tối đa 32 cột cho B-Tree Index).

```sql
CREATE INDEX idx_emp_dept_job_sal ON employees(department_id, job_id, salary);
```

#### Quy tắc Thứ tự cột & Cột dẫn đầu (Leading Column):
Trong Composite Index `(A, B, C)`, dữ liệu trong các Leaf Blocks được sắp xếp trước tiên theo cột `A` (cột dẫn đầu - **Leading Edge / Leading Column**). Nếu `A` bằng nhau mới sắp xếp theo `B`; nếu cả `A` và `B` bằng nhau mới sắp xếp theo `C`.

1. **Khi nào Composite Index `(A, B, C)` được tận dụng tối ưu (`INDEX RANGE SCAN`)?**
   * Khi mệnh đề `WHERE` có chứa cột dẫn đầu `A`:
     * `WHERE A = 10` ✅ (Dùng cột `A`)
     * `WHERE A = 10 AND B = 'IT_PROG'` ✅ (Dùng cột `A` và `B`)
     * `WHERE A = 10 AND B = 'IT_PROG' AND C > 5000` ✅ (Dùng cả 3 cột `A, B, C`)
     * `WHERE A = 10 AND C = 5000` ⚠️ (Dùng `A` làm **Access Predicate** để thu hẹp phạm vi quét Index, còn `C = 5000` chỉ đóng vai trò **Filter Predicate** lọc trên các mục Index đã quét qua vì bị khuyết cột `B` ở giữa!).
2. **Nếu điều kiện trên cột đứng trước là phép toán khoảng (`>`, `<`, `BETWEEN`, `LIKE`) thì sao?**
   * Ví dụ: `WHERE A > 10 AND B = 'IT_PROG'`
   * Khi cột `A` dùng toán tử khoảng (`A > 10`), các giá trị của `B` bên trong dải `A > 10` không còn nằm liền kề nhau nữa. Do đó, Oracle chỉ dùng `A > 10` để định vị điểm bắt đầu quét Index, còn `B = 'IT_PROG'` sẽ trở thành điều kiện lọc (`Filter`) trên từng Leaf Entry.
   * **Quy tắc thiết kế thứ tự cột Composite Index:**
     * Đặt các cột thường xuyên xuất hiện với toán tử **bằng (`=`)** lên đầu.
     * Đặt các cột dùng toán tử **khoảng (`>`, `<`, `BETWEEN`)** ở phía sau.
     * Nếu hai cột đều dùng dấu `=`, cột nào được truy vấn độc lập nhiều hơn (hoặc có độ chọn lọc cao hơn trong hầu hết truy vấn) thì đặt làm Leading Column.

---

### 2.2. Function-Based Index (FBI - Chỉ mục dựa trên hàm/biểu thức)

Khi bạn bọc một hàm hoặc biểu thức tính toán quanh cột được đánh Index chuẩn trong mệnh đề `WHERE`, Index chuẩn sẽ bị **vô hiệu hóa**:

```sql
-- Giả sử có Index chuẩn: CREATE INDEX idx_emp_lname ON employees(last_name);
-- ❌ Câu lệnh dưới đây KHÔNG dùng được idx_emp_lname (phải quét TABLE ACCESS FULL)
SELECT * FROM employees WHERE UPPER(last_name) = 'KING';

-- ❌ Biểu thức số học trên cột cũng làm mất tác dụng Index chuẩn:
SELECT * FROM employees WHERE salary * 12 > 120000;
```

**Giải pháp 1 (Ưu tiên sửa SQL nếu được):** Chuyển phép toán sang vế hằng số:
```sql
-- ✅ Giữ nguyên cột salary trần -> Dùng được Index trên cột salary!
SELECT * FROM employees WHERE salary > 120000 / 12;
```

**Giải pháp 2 (Tạo Function-Based Index):** Nếu bắt buộc phải dùng hàm trên cột (như `UPPER`, `TRUNC`, `NVL`, hoặc biểu thức):
```sql
-- Tạo Function-Based Index lưu sẵn kết quả UPPER(last_name) vào Leaf Blocks
CREATE INDEX idx_emp_upper_lname ON employees(UPPER(last_name));

-- Tạo Function-Based Index cho biểu thức thu nhập năm
CREATE INDEX idx_emp_annual_sal ON employees(salary * 12 + NVL(commission_pct, 0));
```

> [!IMPORTANT]
> **Quy tắc với Function-Based Index:**  
> 1. Biểu thức trong mệnh đề `WHERE` của câu truy vấn phải **khớp với biểu thức lúc tạo Function-Based Index**.  
> 2. Nếu bạn tạo Function-Based Index gọi một **Hàm tự định nghĩa (User-Defined PL/SQL Function)**, hàm đó **BẮT BUỘC** phải được khai báo với từ khóa **`DETERMINISTIC`** (đảm bảo với cùng một đầu vào luôn trả về cùng một đầu ra, không phụ thuộc thời gian hay dữ liệu trong bảng khác). Nếu thiếu `DETERMINISTIC`, Oracle sẽ báo lỗi `ORA-30553: The function is not deterministic`.

---

### 2.3. Các Loại Index Đặc Biệt Khác Cần Nhớ Cho Kỳ Thi OCP

1. **Invisible Index (Chỉ mục tàng hình - Từ Oracle 11g+):**
   * Được duy trì bình thường khi có DML (`INSERT/UPDATE/DELETE`), nhưng Cost-Based Optimizer (CBO) **mặc định phớt lờ** không sử dụng nó (trừ khi bật tham số session `OPTIMIZER_USE_INVISIBLE_INDEXES = TRUE`).
   * **Ứng dụng thực tế:** Trước khi xóa (`DROP`) một Index lớn trên Production, DBA chuyển nó sang `INVISIBLE` để theo dõi xem có câu lệnh SQL nào bị chậm đi không. Nếu có sự cố, chỉ mất 1 giây để `VISIBLE` lại thay vì mất hàng giờ rebuild Index. Hoặc dùng để test một Index mới cho 1 session cụ thể mà không làm ảnh hưởng đến kế hoạch thực thi của toàn bộ ứng dụng.
   ```sql
   CREATE INDEX idx_test ON orders(order_date) INVISIBLE;
   ALTER INDEX idx_test VISIBLE;
   ALTER INDEX idx_test INVISIBLE;
   ```

2. **Unique vs. Non-Unique Index & Ràng buộc `PRIMARY KEY` / `UNIQUE`:**
   * Khi bạn tạo ràng buộc `PRIMARY KEY` hoặc `UNIQUE`, nếu trên cột đó chưa có Index, Oracle sẽ **tự động tạo một `UNIQUE` B-Tree Index** cùng tên.
   * Nếu trên cột đó đã có sẵn một Index (kể cả `NON-UNIQUE` Index), hoặc bạn chỉ định mệnh đề `USING INDEX`, Oracle có thể dùng một **Non-Unique Index** để kiểm tra và bảo vệ ràng buộc `PRIMARY KEY` / `UNIQUE` (hữu ích đối với ràng buộc `DEFERRABLE`).
   * Khi `DROP` hoặc `DISABLE` ràng buộc `PRIMARY KEY`/`UNIQUE`: Index do Oracle tự tạo ngầm định sẽ bị xóa theo; còn Index do người dùng tạo tường minh (`CREATE INDEX`) trước đó mặc định được giữ lại (trừ khi kèm từ khóa `DROP INDEX`).

3. **Multiple Indexes on the Same Column List (Từ Oracle 12c+):**
   * Oracle cho phép tạo **nhiều Index trên cùng một tập hợp cột (theo đúng cùng thứ tự)** chỉ khi và chỉ khi:
     * Các Index đó **khác loại vật lý** (ví dụ: 1 cái là B-Tree Index, 1 cái là Bitmap Index), **VÀ**
     * Tại một thời điểm, **chỉ có tối đa 1 Index ở trạng thái `VISIBLE`**, các Index còn lại phải là `INVISIBLE`.

---

## 3. Các Phương Pháp Truy Cập Dữ Liệu (Access Paths)

Khi thực thi một câu lệnh SQL, Optimizer phải quyết định cách đọc dữ liệu từ bảng hoặc Index. Dưới đây là 6 phương pháp truy cập cốt lõi:

### 3.1. `TABLE ACCESS FULL` (Full Table Scan - FTS)
* **Cơ chế:** Đọc tuần tự toàn bộ các Data Blocks của bảng từ đầu cho tới **High Water Mark (HWM)** bằng cơ chế đọc nhiều block cùng lúc (**Multi-block I/O** - điều khiển bởi tham số `DB_FILE_MULTIBLOCK_READ_COUNT`).
* **Khi nào xảy ra?**
  * Không có Index phù hợp trên các cột trong `WHERE`.
  * Câu truy vấn lấy tỷ lệ lớn số dòng trong bảng (Selectivity kém, thường > 10% - 20% số dòng tùy thuộc Clustering Factor).
  * Bảng quá nhỏ (chỉ vài block dữ liệu, đọc 1 lần Multi-block I/O là xong).
  * Cột có Index bị bọc hàm, ép kiểu ngầm định, hoặc so sánh `IS NULL` (trên B-Tree đơn), hoặc dùng toán tử phủ định (`<>`, `!=`, `NOT LIKE '%abc'`).

> [!WARNING]
> **Bẫy thi về High Water Mark (HWM):**  
> Lệnh `DELETE FROM table_name;` xóa toàn bộ các dòng nhưng **KHÔNG hạ thấp High Water Mark (HWM)**. Do đó, nếu một bảng từng có 10 triệu dòng bị `DELETE` hết sạch (còn 0 dòng), lệnh `SELECT COUNT(*) FROM table_name` sử dụng `TABLE ACCESS FULL` vẫn phải quét qua hàng trăm nghìn block rỗng cho đến mốc HWM cũ nên cực kỳ chậm! Chỉ có `TRUNCATE TABLE` hoặc `ALTER TABLE ... SHRINK SPACE` / `ALTER TABLE ... MOVE` mới reset lại HWM.

---

### 3.2. `INDEX UNIQUE SCAN`
* **Cơ chế:** Duyệt từ Root -> Branch -> Leaf Block để tìm **tối đa 1 `ROWID` duy nhất**. Ngay khi tìm thấy 1 bản ghi khớp, quá trình tìm kiếm dừng lại ngay lập tức.
* **Khi nào xảy ra?**
  * Khi mệnh đề `WHERE` chỉ định đầy đủ tất cả các cột của một **`UNIQUE` Index** hoặc **`PRIMARY KEY`** bằng toán tử bằng (`=`).
  * Ví dụ: `WHERE employee_id = 100`.

---

### 3.3. `INDEX RANGE SCAN`
* **Cơ chế:** Đi từ Root -> Branch -> Leaf Block đầu tiên thỏa mãn điều kiện, sau đó đi ngang qua danh sách liên kết kép (Doubly Linked List) của các Leaf Blocks để lấy tất cả các `ROWID` thỏa mãn. Đọc theo cơ chế **Single-block I/O**.
* **Khi nào xảy ra?**
  * Dùng toán tử bằng (`=`) trên một **Non-Unique Index** (ví dụ: `WHERE department_id = 50`).
  * Dùng toán tử khoảng (`>`, `<`, `>=`, `<=`, `BETWEEN`, `LIKE 'ABC%'`) trên cả Unique hoặc Non-Unique Index.
  * Dùng một phần các cột đầu (Leading Columns) của một Composite Unique Index.
* **Đặc điểm:** Kết quả trả về từ `INDEX RANGE SCAN` **đã được sắp xếp sẵn** theo thứ tự của khóa Index, nên có thể giúp Oracle bỏ qua bước `SORT ORDER BY`!

---

### 3.4. `INDEX FULL SCAN`
* **Cơ chế:** Đi từ Root -> Branch xuống **Leaf Block đầu tiên bên trái nhất (hoặc phải nhất)**, sau đó duyệt tuần tự qua toàn bộ chuỗi Leaf Blocks từ đầu đến cuối bằng **Single-block I/O**.
* **Khi nào xảy ra?**
  * Truy vấn cần kết quả được sắp xếp (`ORDER BY` hoặc `GROUP BY`) trùng khớp với cột Index (và có ít nhất 1 cột trong Index là `NOT NULL`), giúp loại bỏ hoàn toàn chi phí `SORT` đắt đỏ.
* **Đặc điểm:** Đọc từng block một (Single-block I/O) nhưng **đảm bảo thứ tự sắp xếp (Ordered)**.

---

### 3.5. `INDEX FAST FULL SCAN` (FFS)
* **Cơ chế:** Coi toàn bộ Index Segment như một "bảng nhỏ" (Skinny Table). Nó bỏ qua Root và Branch Blocks, dùng **Multi-block I/O** quét sạch toàn bộ các Leaf Blocks trên đĩa từ đầu đến cuối mà không theo liên kết con trỏ.
* **Khi nào xảy ra?**
  * Khi tất cả các cột xuất hiện trong `SELECT` và `WHERE` đều đã nằm trọn bên trong Index (**Covering Index**), và có ít nhất 1 cột có ràng buộc `NOT NULL`.
  * Ví dụ: `SELECT department_id, COUNT(*) FROM employees GROUP BY department_id;`
* **Điểm khác biệt cốt lõi với `INDEX FULL SCAN`:**
  * `INDEX FAST FULL SCAN` đọc rất nhanh nhờ **Multi-block I/O**, nhưng dữ liệu trả về **KHÔNG theo thứ tự sắp xếp** (Unordered), nên không thể dùng để triệt tiêu phép `SORT ORDER BY`!

---

### 3.6. `INDEX SKIP SCAN`
* **Cơ chế:** Cho phép sử dụng một **Composite Index** ngay cả khi mệnh đề `WHERE` **KHÔNG chứa cột dẫn đầu (Leading Column)**!
* **Khi nào xảy ra?**
  * Giả sử có Composite Index trên `(gender, salary)` hoặc `(region_id, customer_email)`.
  * Truy vấn là: `SELECT * FROM customers WHERE customer_email = 'an.nguyen@vnpt.vn';` (thiếu cột dẫn đầu `region_id`).
  * Nếu cột dẫn đầu (`region_id` hoặc `gender`) có **rất ít giá trị phân biệt (Low Cardinality)**, Oracle sẽ tự động tách ngầm câu truy vấn thành nhiều lần dò `INDEX RANGE SCAN` cho từng giá trị phân biệt của cột dẫn đầu (ví dụ: dò `gender = 'M' AND ...` rồi nhảy cóc sang `gender = 'F' AND ...`).
* **Lưu ý:** Nếu cột dẫn đầu có quá nhiều giá trị phân biệt (ví dụ `customer_id`), `INDEX SKIP SCAN` sẽ không hiệu quả và CBO sẽ chọn `TABLE ACCESS FULL`.

---

### 3.7. Bảng Tóm Tắt Các Phương Pháp Quét Index

| Phương pháp quét | Kiểu đọc I/O | Kết quả có thứ tự (Ordered)? | Điều kiện kích hoạt điển hình |
| :--- | :---: | :---: | :--- |
| **`INDEX UNIQUE SCAN`** | Single-block | Không áp dụng (tối đa 1 dòng) | `=` trên đầy đủ cột của `PRIMARY KEY` / `UNIQUE INDEX`. |
| **`INDEX RANGE SCAN`** | Single-block | **Có** (Tăng/Giảm dần) | `=` trên Non-Unique Index, hoặc `>`, `<`, `BETWEEN`, `LIKE 'A%'`. |
| **`INDEX FULL SCAN`** | Single-block | **Có** | Cần tận dụng thứ tự để tránh `SORT ORDER BY` / `GROUP BY`. |
| **`INDEX FAST FULL SCAN`** | **Multi-block** | **Không** | Covering Index (chỉ đọc từ Index, không cần chạm vào Table). |
| **`INDEX SKIP SCAN`** | Single-block | Có (trong từng nhánh) | Composite Index bị thiếu Leading Column (Leading Column ít giá trị distinct). |

---

## 4. Các Thuật Toán Join Vật Lý (Physical Join Methods)

Khi bạn viết `FROM table_A JOIN table_B ON ...`, đó chỉ là cú pháp logic. Bên dưới tầng vật lý, Cost-Based Optimizer (CBO) phải chọn **1 trong 3 thuật toán Join vật lý** (mỗi phép Join vật lý luôn thực hiện giữa đúng 2 tập dữ liệu tại một thời điểm):

### 4.1. `NESTED LOOPS JOIN` (Vòng lặp lồng nhau)
* **Nguyên lý hoạt động:** Giống hệt 2 vòng lặp `FOR` lồng nhau trong lập trình:
  1. Chọn một bảng làm **Outer Table (Driving Table / Bảng dẫn xuất)** — thường là bảng nhỏ hoặc sau khi lọc `WHERE` chỉ còn rất ít dòng.
  2. Với **mỗi dòng** lấy ra từ Driving Table, Oracle dùng giá trị cột Join để tra cứu sang **Inner Table (Probed Table / Bảng bị dò)** — thông thường qua một **Index (`UNIQUE SCAN` hoặc `RANGE SCAN`)** trên cột Join của bảng thứ hai.
```text
FOR r_outer IN (SELECT * FROM driving_table WHERE ...) LOOP
    FOR r_inner IN (SELECT * FROM inner_table WHERE inner_table.id = r_outer.id) LOOP
        OUTPUT(r_outer, r_inner);
    END LOOP;
END LOOP;
```
* **Khi nào tối ưu nhất?**
  * Khi **Driving Table trả về ít dòng** (Small row source) VÀ **Inner Table có Index hiệu quả** trên cột Join.
  * Tối ưu cho hệ thống **OLTP** và các truy vấn cần trả về những dòng đầu tiên cực nhanh (`FIRST_ROWS` optimization / Pagination).
  * Hỗ trợ mọi loại điều kiện Join (cả `=`, `>`, `<`, `!=`).

---

### 4.2. `HASH JOIN` (Kết nối băm)
* **Nguyên lý hoạt động:**
  1. **Build Phase (Pha tạo bảng băm):** Oracle chọn tập dữ liệu nhỏ hơn (về dung lượng byte sau khi lọc `WHERE`) làm **Build Input**, đọc toàn bộ và dùng hàm băm (Hash Function) trên cột Join để dựng một **Hash Table** lưu trong bộ nhớ **PGA (`Work Area`)**.
  2. **Probe Phase (Pha dò):** Oracle đọc tập dữ liệu lớn hơn (**Probe Input**). Với mỗi dòng, nó áp dụng cùng hàm băm lên cột Join để nhảy thẳng vào đúng Hash Bucket trong bộ nhớ PGA nhằm kiểm tra khớp nối.
* **Khi nào tối ưu nhất?**
  * Khi Join các tập dữ liệu **lớn** (hoặc trung bình - lớn) mà không có Index trên cột Join, hoặc lấy tỷ lệ lớn số dòng của bảng.
  * Là "vua" của các truy vấn báo cáo, tổng hợp dữ liệu lớn (Batch Job, DWH).
* **Giới hạn bắt buộc (Bẫy thi OCP):**
  * `HASH JOIN` **CHỈ hoạt động với điều kiện Join bằng (`=` - Equijoin)**! Nếu điều kiện Join là `>`, `<`, `BETWEEN`, Oracle **không thể** dùng `HASH JOIN`.
  * Nếu bảng Build quá lớn không vừa bộ nhớ PGA, Oracle sẽ phải tràn (spill) ra `TEMP tablespace` trên đĩa (One-pass hoặc Multi-pass Hash Join), làm giảm tốc độ.

---

### 4.3. `SORT MERGE JOIN` (Sắp xếp và Trộn)
* **Nguyên lý hoạt động:**
  1. **Sort Phase:** Sắp xếp cả hai tập dữ liệu `A` và `B` theo cột Join (nếu tập dữ liệu đã được sắp xếp sẵn nhờ `INDEX FULL/RANGE SCAN` phía trước thì bỏ qua bước Sort của tập đó).
  2. **Merge Phase:** Dùng 2 con trỏ trượt song song từ trên xuống dưới trên 2 danh sách đã sắp xếp để ghép các dòng khớp nhau (chỉ cần duyệt 1 lượt).
* **Khi nào tối ưu nhất?**
  * Khi điều kiện Join là **không bằng (Non-Equijoin)** như `A.sal BETWEEN B.losal AND B.hisal`, `A.created_at >= B.start_date` (nơi mà `HASH JOIN` không thể chạy được!).
  * Khi cả hai nguồn dữ liệu đã được sắp xếp sẵn theo khóa Join từ bước trước đó, hoặc khi bộ nhớ PGA quá hẹp không đủ tạo Hash Table nhưng dữ liệu đã có thứ tự.

---

### 4.4. Bảng So Sánh 3 Thuật Toán Join Vật Lý

| Tiêu chí | `NESTED LOOPS` | `HASH JOIN` | `SORT MERGE JOIN` |
| :--- | :--- | :--- | :--- |
| **Kích thước dữ liệu phù hợp** | Nhỏ $\times$ Bất kỳ (có Index ở bảng trong). | Lớn $\times$ Lớn, hoặc Nhỏ $\times$ Lớn (không có Index). | Trung bình/Lớn khi đã sắp xếp sẵn hoặc Non-equijoin. |
| **Điều kiện Join hỗ trợ** | Mọi điều kiện (`=`, `>`, `<`, `BETWEEN`). | **Chỉ hỗ trợ dấu bằng (`=` - Equijoin)**. | Hỗ trợ `=`, `>`, `<`, `>=`, `<=`, `BETWEEN` (trừ `<>`). |
| **Yêu cầu Index trên cột Join** | **Rất cần** trên bảng Inner (Probed Table). | **Không cần** Index trên cột Join. | Không bắt buộc (có Index giúp tránh bước Sort). |
| **Tiêu tốn bộ nhớ PGA / TEMP** | Rất thấp (xử lý cuốn chiếu từng dòng). | Cao (cần PGA lưu Hash Table của bảng nhỏ). | Cao (cần PGA/TEMP để Sort cả 2 tập dữ liệu). |
| **Tốc độ trả về dòng đầu tiên** | **Cực nhanh** (Phù hợp phân trang UI). | Chậm (Phải chờ Build xong toàn bộ bảng đầu). | Chậm (Phải chờ Sort xong cả 2 bảng). |

---

## 5. Selectivity, Cardinality & Clustering Factor

Ba khái niệm toán học nền tảng mà Cost-Based Optimizer (CBO) sử dụng để tính toán chi phí (`Cost`) của mọi Execution Plan:

### 5.1. Selectivity (Độ chọn lọc)
* **Định nghĩa:** Tỷ lệ phần trăm số dòng dự kiến thỏa mãn một điều kiện lọc, nằm trong khoảng từ **`0.0` đến `1.0`**.
* Công thức cơ bản (khi dữ liệu phân bố đều với toán tử `=` và không có `NULL`):
  $$\text{Selectivity} = \frac{1}{\text{NDV (Number of Distinct Values)}}$$
* **Lưu ý thuật ngữ:**
  * **High Selectivity (Độ chọn lọc cao):** Giá trị Selectivity **nhỏ** (gần `0`, ví dụ `0.0001`), nghĩa là chỉ có **rất ít dòng** thỏa mãn điều kiện (lọc rất gắt) $\rightarrow$ **Rất thích hợp dùng B-Tree Index**!
  * **Low Selectivity (Độ chọn lọc thấp):** Giá trị Selectivity **lớn** (gần `1`, ví dụ `0.85`), nghĩa là hầu hết các dòng trong bảng đều thỏa mãn $\rightarrow$ **Nên dùng `TABLE ACCESS FULL`**.

### 5.2. Cardinality (Số lượng dòng ước tính - `Rows` / `E-Rows`)
* **Định nghĩa:** Số lượng dòng dự kiến trả về từ một bước thực thi trong Execution Plan.
  $$\text{Cardinality} = \text{Total Rows (NUM\_ROWS)} \times \text{Selectivity}$$
* **Ví dụ:** Bảng `SUBSCRIBERS` có `1,000,000` dòng (`NUM_ROWS = 1000000`). Cột `PROVINCE_CODE` có `50` tỉnh thành phân bố đều (`NDV = 50`).
  * $\text{Selectivity} = \frac{1}{50} = 0.02$ (2%).
  * $\text{Cardinality} = 1,000,000 \times 0.02 = 20,000 \text{ dòng}$.
* Nếu CBO ước tính sai Cardinality (do Statistics cũ hoặc dữ liệu bị lệch - Data Skew mà thiếu Histogram), CBO sẽ chọn sai thuật toán Join (ví dụ ước tính ra 1 dòng nên chọn `NESTED LOOPS`, nhưng thực tế trả về 2 triệu dòng khiến câu lệnh chạy treo hàng giờ!).

### 5.3. Clustering Factor (Hệ số gom cụm của Index)
* **Định nghĩa:** Đo lường mức độ **đồng bộ về thứ tự vật lý** giữa các mục trong **B-Tree Index** (luôn được sắp xếp theo khóa Index) và thứ tự lưu trữ thực tế của các dòng trong **Table Blocks** trên đĩa.
* Khi quét từ đầu đến cuối Leaf Blocks của Index, Oracle đếm số lần phải **nhảy sang một Data Block khác của bảng** để đọc dòng dữ liệu tiếp theo.
* **Hai ngưỡng giới hạn của Clustering Factor:**
  1. **Clustering Factor TỐT NHẤT (Thấp - Xấp xỉ bằng số lượng `Blocks` của bảng):**
     * Các dòng có khóa Index gần nhau cũng nằm chung trong cùng một Data Block của bảng.
     * Khi thực hiện `INDEX RANGE SCAN` lấy 1,000 dòng, Oracle chỉ cần đọc vài chục Data Blocks $\rightarrow$ Chi phí đọc bảng qua Index rất rẻ!
  2. **Clustering Factor XẤU NHẤT (Cao - Xấp xỉ bằng số lượng `Rows` của bảng):**
     * Dữ liệu trong bảng nằm rải rác ngẫu nhiên hoàn toàn so với thứ tự Index. Mỗi lần đọc 1 dòng tiếp theo trên Index là phải nhảy sang 1 Data Block khác của bảng.
     * Khi đó, ngay cả khi chỉ lấy 5% số dòng của bảng, CBO vẫn có thể từ chối dùng Index và chọn `TABLE ACCESS FULL` vì chi phí nhảy block ngẫu nhiên (`TABLE ACCESS BY INDEX ROWID`) quá đắt!

---

## 6. Đọc Hiểu Execution Plan Với EXPLAIN PLAN & DBMS_XPLAN

### 6.1. Cách sinh và xem Execution Plan

#### Cách 1: Dùng `EXPLAIN PLAN FOR` (Chỉ là kế hoạch dự kiến - Estimated Plan, KHÔNG chạy câu lệnh thật)
```sql
EXPLAIN PLAN FOR
SELECT e.employee_id, e.last_name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id
WHERE e.department_id = 60;

-- Hiển thị kế hoạch từ bảng PLAN_TABLE
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY());
```

#### Cách 2: Dùng `DBMS_XPLAN.DISPLAY_CURSOR` (Xem kế hoạch thực tế - Actual Plan sau khi câu lệnh đã chạy)
```sql
-- Thêm hint /*+ GATHER_plan_statistics */ để thu thập số liệu thực tế lúc chạy
SELECT /*+ GATHER_PLAN_STATISTICS */ e.employee_id, e.last_name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id
WHERE e.department_id = 60;

-- Xem kế hoạch thực tế vừa chạy kèm so sánh E-Rows vs A-Rows
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY_CURSOR(NULL, NULL, 'ALLSTATS LAST'));
```

### 6.2. Phân tích một bảng Execution Plan thực tế

```text
-----------------------------------------------------------------------------------------------------------
| Id  | Operation                    | Name              | Starts | E-Rows | A-Rows |   A-Time   | Buffers |
-----------------------------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT             |                   |      1 |        |      5 |00:00:00.01 |       4 |
|   1 |  NESTED LOOPS                |                   |      1 |      5 |      5 |00:00:00.01 |       4 |
|   2 |   TABLE ACCESS BY INDEX ROWID| DEPARTMENTS       |      1 |      1 |      1 |00:00:00.01 |       2 |
|*  3 |    INDEX UNIQUE SCAN         | DEPT_ID_PK        |      1 |      1 |      1 |00:00:00.01 |       1 |
|   4 |   TABLE ACCESS BY INDEX ROWID| EMPLOYEES         |      1 |      5 |      5 |00:00:00.01 |       2 |
|*  5 |    INDEX RANGE SCAN          | EMP_DEPARTMENT_IX |      1 |      5 |      5 |00:00:00.01 |       1 |
-----------------------------------------------------------------------------------------------------------

Predicate Information (identified by operation id):
---------------------------------------------------
   3 - access("D"."DEPARTMENT_ID"=60)
   5 - access("E"."DEPARTMENT_ID"=60)
```

#### Quy tắc đọc thứ tự thực thi trong Execution Plan:
> **"Thụt lề sâu nhất (Trong cùng) trước $\rightarrow$ Từ trên xuống dưới (Cùng cấp thụt lề thì đọc dòng trên trước dòng dưới)"**  
> Ở kế hoạch trên:
> 1. Bước `3` (`INDEX UNIQUE SCAN` trên `DEPT_ID_PK`) chạy đầu tiên.
> 2. Bước `2` (`TABLE ACCESS BY INDEX ROWID` trên `DEPARTMENTS`) lấy thông tin phòng 60 (1 dòng). Đây là **Driving Table** của `NESTED LOOPS`.
> 3. Bước `5` (`INDEX RANGE SCAN` trên `EMP_DEPARTMENT_IX`) chạy cho mỗi dòng của bước 2 (`Starts = 1`), tìm ra 5 `ROWID`.
> 4. Bước `4` (`TABLE ACCESS BY INDEX ROWID` trên `EMPLOYEES`) đọc 5 dòng nhân viên.
> 5. Bước `1` (`NESTED LOOPS`) ghép kết quả và trả lên bước `0`.

#### Ý nghĩa các cột quan trọng trong `ALLSTATS LAST`:
* **`Starts`:** Số lần bước đó được kích hoạt lặp lại. Nếu một bước bên trong `NESTED LOOPS` có `Starts = 500,000`, nghĩa là bảng ngoài trả về 500,000 dòng và bắt bảng trong phải dò lại 500,000 lần!
* **`E-Rows` (Estimated Rows):** Số dòng CBO dự đoán trước khi chạy (Cardinality).
* **`A-Rows` (Actual Rows):** Số dòng thực tế trả về sau khi chạy. **Dấu hiệu cốt lõi của bệnh SQL chậm:** Khi `E-Rows` và `A-Rows` chênh lệch nhau hàng trăm, hàng nghìn lần (ví dụ `E-Rows = 1` nhưng `A-Rows = 850K`)!
* **`Buffers`:** Số lượng Logical Reads (số lần đọc block trên bộ nhớ Buffer Cache). Đây là thước đo chính xác nhất để đánh giá câu SQL nặng hay nhẹ (không bị nhiễu bởi tải hệ thống như thời gian chạy).

#### Phân biệt `access()` vs. `filter()` trong `Predicate Information`:
> [!IMPORTANT]
> Đây là câu hỏi kinh điển trong đề thi OCP và phỏng vấn SQL Tuning:
> * **`access(...)` (Access Predicate):** Điều kiện được dùng để **xác định điểm bắt đầu và điểm kết thúc** khi tìm kiếm trong cấu trúc Index (hoặc băm trong Hash Join). Nó trực tiếp **thu hẹp số lượng block phải đọc**.
> * **`filter(...)` (Filter Predicate):** Điều kiện chỉ được kiểm tra **sau khi block dữ liệu đã được đọc lên bộ nhớ** để loại bỏ các dòng không thỏa mãn. Nó **KHÔNG làm giảm số block phải đọc** ở bước đó!
> * **Ví dụ:** Với Composite Index `(dept_id, job_id, salary)` và điều kiện `WHERE dept_id = 50 AND salary > 8000` (thiếu cột giữa `job_id`):
>   * `access("DEPT_ID"=50)`: Chỉ quét các Leaf Blocks của phòng 50.
>   * `filter("SALARY">8000)`: Đọc toàn bộ các mục Index của phòng 50 rồi mới kiểm tra xem lương có `> 8000` hay không.

---

## 7. Cost-Based Optimizer (CBO) & Quản Trị Statistics (DBMS_STATS)

### 7.1. Cost-Based Optimizer (CBO) hoạt động như thế nào?
Một câu lệnh SQL qua 3 giai đoạn trước khi thực thi:
1. **Parse (Phân tích):**
   * Kiểm tra cú pháp (Syntax Check) và quyền hạn/đối tượng (Semantic Check).
   * Tìm kiếm mã băm của câu SQL trong vùng nhớ **Shared Pool (Library Cache)**:
     * Nếu đã có sẵn Execution Plan dùng lại được $\rightarrow$ **Soft Parse** (Nhanh, tiết kiệm CPU).
     * Nếu chưa có $\rightarrow$ **Hard Parse**: Kích hoạt **CBO** sinh ra hàng chục phương án thực thi, tính `Cost` dựa trên **Optimizer Statistics**, chọn phương án có `Cost` thấp nhất và lưu vào Library Cache. Hard Parse rất tốn CPU và gây tranh chấp bộ nhớ (Latch contention).
2. **Execute (Thực thi)** và 3. **Fetch (Lấy dữ liệu trả về)**.

### 7.2. Thu thập thống kê với gói `DBMS_STATS`
CBO "mù" nếu không có số liệu thống kê (Statistics) chính xác về bảng, cột và Index (`NUM_ROWS`, `BLOCKS`, `AVG_ROW_LEN`, `NUM_DISTINCT`, `LOW_VALUE`, `HIGH_VALUE`, `NUM_NULLS`, `CLUSTERING_FACTOR`).

```sql
-- Thu thập thống kê cho một bảng và toàn bộ các Index của nó
BEGIN
    DBMS_STATS.GATHER_table_stats(
        ownname          => 'HR',
        tabname          => 'EMPLOYEES',
        estimate_percent => DBMS_STATS.AUTO_SAMPLE_SIZE,
        method_opt       => 'FOR ALL COLUMNS SIZE AUTO',
        cascade          => TRUE -- Thu thập luôn cho các Index của bảng
    );
END;
/
```

#### Khi nào cần Histogram (Biểu đồ phân bố dữ liệu)?
* Mặc định, CBO giả định dữ liệu trong cột phân bố **đồng đều (Uniform Distribution)**.
* Giả sử bảng `ORDERS` có 1 triệu đơn hàng, cột `STATUS` có 2 giá trị: `'COMPLETED'` (`999,900` đơn) và `'PENDING'` (`100` đơn).
  * Nếu **không có Histogram**, CBO lấy $\frac{1,000,000}{2} = 500,000$ dòng cho cả 2 trạng thái $\rightarrow$ Khi truy vấn `WHERE status = 'PENDING'`, CBO tưởng trả về 500,000 dòng nên chọn `TABLE ACCESS FULL` thay vì dùng Index (dù thực tế chỉ có 100 dòng)!
  * Khi **có Histogram** (Frequency Histogram / Top-Frequency / Hybrid Histogram), CBO biết chính xác `'PENDING'` chỉ có 100 dòng $\rightarrow$ Chọn `INDEX RANGE SCAN`; còn `'COMPLETED'` có 999,900 dòng $\rightarrow$ Chọn `TABLE ACCESS FULL`.

---

## 8. Các Nguyên Tắc SQL Tuning Thực Chiến (Best Practices)

### 8.1. Tránh bọc hàm hoặc phép toán lên cột có Index (Left-Hand Side Manipulation)
```sql
-- ❌ SAI (Làm mù Index chuẩn trên cột hire_date):
SELECT * FROM employees WHERE TO_CHAR(hire_date, 'YYYY') = '2025';
SELECT * FROM employees WHERE TRUNC(hire_date) = DATE '2025-05-15';

-- ✅ ĐÚNG (Biến đổi thành điều kiện khoảng trên cột nguyên bản -> Dùng INDEX RANGE SCAN cực nhanh!):
SELECT * FROM employees
WHERE hire_date >= DATE '2025-01-01'
  AND hire_date <  DATE '2026-01-01';

SELECT * FROM employees
WHERE hire_date >= DATE '2025-05-15'
  AND hire_date <  DATE '2025-05-16';
```

### 8.2. Tránh ép kiểu ngầm định (Implicit Data Type Conversion)
> [!CAUTION]
> **Bẫy chết người trong các hệ thống Viễn thông / Ngân hàng:**  
> Giả sử cột `phone_number` hoặc `account_no` có kiểu `VARCHAR2(20)` và đã được đánh Index `idx_phone`. Nếu lập trình viên truyền vào một số nguyên (Number):
> ```sql
> -- ❌ NGUY HIỂM: phone_number là VARCHAR2 nhưng truyền số 912345678
> SELECT * FROM subscribers WHERE phone_number = 912345678;
> ```
> Theo quy tắc ưu tiên kiểu dữ liệu của Oracle, kiểu `VARCHAR2` có độ ưu tiên thấp hơn `NUMBER`, nên Oracle sẽ **ép kiểu cột `VARCHAR2` sang `NUMBER`**:
> ```sql
> -- Bên dưới hậu trường, Oracle biến câu lệnh thành:
> SELECT * FROM subscribers WHERE TO_NUMBER(phone_number) = 912345678;
> ```
> Hậu quả kép:
> 1. Cột `phone_number` bị bọc bởi hàm `TO_NUMBER()` $\rightarrow$ **Mất hoàn toàn tác dụng của B-Tree Index**, buộc phải `TABLE ACCESS FULL` bảng hàng chục triệu thuê bao!
> 2. Nếu trong bảng có bất kỳ dòng nào chứa ký tự chữ (ví dụ `'+84912...'` hoặc `'UNKNOWN'`), câu lệnh sẽ văng lỗi **`ORA-01722: invalid number`** ngay lập tức!
>
> **Cách viết đúng:** Luôn truyền đúng kiểu chuỗi `'0912345678'`.

### 8.3. Sử dụng Bind Variables để triệt tiêu Hard Parse
```sql
-- ❌ SAI: Ghép chuỗi trực tiếp (Literal SQL) làm ngập Shared Pool và ép Oracle phải Hard Parse liên tục:
SELECT * FROM accounts WHERE account_id = 10001;
SELECT * FROM accounts WHERE account_id = 10002;
SELECT * FROM accounts WHERE account_id = 10003;

-- ✅ ĐÚNG: Dùng Bind Variable (:b_acc_id trong PL/SQL hoặc dấu ? trong JDBC PreparedStatement):
SELECT * FROM accounts WHERE account_id = :b_acc_id;
```

### 8.4. Các nguyên tắc quan trọng khác
* **Dùng `UNION ALL` thay vì `UNION`** nếu biết chắc dữ liệu không trùng hoặc không cần khử trùng (vì `UNION` bắt buộc phải thực hiện `SORT UNIQUE` tốn CPU và TEMP).
* **Cẩn thận với `LIKE '%abc'`:** Dấu `%` ở đầu chuỗi khiến Oracle không thể biết điểm bắt đầu trong B-Tree Index (không thể `INDEX RANGE SCAN` theo tiền tố), chỉ có `LIKE 'abc%'` mới dùng được `INDEX RANGE SCAN`.
* **Thay `SELECT *` bằng danh sách cột cụ thể:** Giảm dung lượng mạng, giảm bộ nhớ PGA khi Sort/Hash Join, và tạo cơ hội cho Oracle chạy **Covering Index (`INDEX FAST FULL SCAN` / `INDEX RANGE SCAN`)** mà không cần đọc xuống bảng (`TABLE ACCESS BY INDEX ROWID`).

---

## 9. Bài Tập Thực Hành Tự Luyện (Kèm Lời Giải Chi Tiết)

### Đề bài thực hành:
Cho bảng giao dịch cước viễn thông `BILLING_RECORDS` (50 triệu dòng) có cấu trúc và các Index sau:
```sql
CREATE TABLE billing_records (
    bill_id        NUMBER PRIMARY KEY,
    sub_code       VARCHAR2(20) NOT NULL,
    billing_cycle  DATE NOT NULL,
    status         VARCHAR2(10),  -- Chỉ có 3 giá trị: 'PAID' (98%), 'UNPAID' (1.9%), 'DISPUTE' (0.1%)
    amount         NUMBER(12, 2)
);

CREATE INDEX idx_bill_sub_cycle ON billing_records(sub_code, billing_cycle);
CREATE INDEX idx_bill_status    ON billing_records(status);
```

Hãy phân tích vì sao 3 câu truy vấn dưới đây chạy chậm và viết lại câu truy vấn (hoặc đề xuất Index) để tối ưu:
1. `SELECT bill_id, amount FROM billing_records WHERE sub_code = 987654321 AND TRUNC(billing_cycle) = DATE '2026-10-01';`
2. `SELECT bill_id, sub_code, amount FROM billing_records WHERE billing_cycle = DATE '2026-10-01';`
3. `SELECT COUNT(*) FROM billing_records WHERE status IS NULL;`

<details>
<summary><b>👉 Xem Lời Giải Chi Tiết</b></summary>

1. **Phân tích & Tối ưu Câu 1:**
   * **Nguyên nhân chậm:**
     * Lỗi 1 (Nghiêm trọng nhất): `sub_code` có kiểu `VARCHAR2(20)` nhưng so sánh với số `987654321` $\rightarrow$ Oracle tự động ép kiểu thành `TO_NUMBER(sub_code) = 987654321`, làm **vô hiệu hóa hoàn toàn cột dẫn đầu** của `idx_bill_sub_cycle`.
     * Lỗi 2: `TRUNC(billing_cycle)` bọc hàm quanh cột thứ hai trong Index, khiến cột `billing_cycle` không thể làm Access Predicate mà chỉ làm Filter Predicate.
   * **Viết lại chuẩn tối ưu:**
     ```sql
     SELECT bill_id, amount
     FROM billing_records
     WHERE sub_code = '987654321'
       AND billing_cycle >= DATE '2026-10-01'
       AND billing_cycle <  DATE '2026-10-02';
     ```
   * Lúc này cả 2 cột `sub_code` và `billing_cycle` đều đóng vai trò **Access Predicate** trong `INDEX RANGE SCAN` trên `idx_bill_sub_cycle`.

2. **Phân tích & Tối ưu Câu 2:**
   * **Nguyên nhân chậm:** Mệnh đề `WHERE` chỉ lọc theo `billing_cycle` mà **thiếu cột dẫn đầu `sub_code`** của Composite Index `(sub_code, billing_cycle)`. Vì `sub_code` có độ phân biệt rất cao (hàng triệu thuê bao), `INDEX SKIP SCAN` cũng không khả thi $\rightarrow$ Phải quét `TABLE ACCESS FULL` 50 triệu dòng.
   * **Giải pháp:** Nếu truy vấn tìm theo `billing_cycle` độc lập chạy thường xuyên, cần tạo một Index riêng trên `(billing_cycle)` (hoặc phân vùng bảng `PARTITION BY RANGE (billing_cycle)`).

3. **Phân tích & Tối ưu Câu 3:**
   * **Nguyên nhân chậm:** `idx_bill_status` là B-Tree Index đơn trên cột `status` (có thể `NULL`). B-Tree Index không lưu các dòng toàn `NULL`, nên `WHERE status IS NULL` buộc phải quét `TABLE ACCESS FULL`.
   * **Giải pháp:** Đổi Index thành Composite Index kèm hằng số để lưu cả dòng `NULL`:
     ```sql
     DROP INDEX idx_bill_status;
     CREATE INDEX idx_bill_status ON billing_records(status, 1);
     ```
     (Không nên dùng Bitmap Index nếu bảng `BILLING_RECORDS` có giao dịch thanh toán `UPDATE status = 'PAID'` liên tục trong ngày).
</details>

---

## 10. Tổng Hợp Bẫy Thi OCA/OCP & Phỏng Vấn Cốt Lõi (Exam Essentials)

| # | Tình huống / Bẫy thường gặp trong đề thi | Quy tắc chuẩn Oracle / Cách nhận diện |
| :---: | :--- | :--- |
| **1** | Truy vấn `WHERE col IS NULL` trên cột có B-Tree Index đơn | **Không dùng được B-Tree Index** (vì B-Tree không lưu mục hoàn toàn `NULL`). Nhưng **Bitmap Index thì dùng được**! |
| **2** | Truy vấn `WHERE col IS NOT NULL` trên cột có B-Tree Index | **Dùng được B-Tree Index** (`INDEX RANGE SCAN` hoặc `INDEX FAST FULL SCAN`) vì mọi dòng khác `NULL` đều có mặt trong Index. |
| **3** | Tạo nhiều Index trên cùng một cột (hoặc cùng tập cột theo đúng thứ tự) | Hợp lệ từ Oracle 12c+ nếu các Index **khác kiểu vật lý** (ví dụ B-Tree vs Bitmap) và **chỉ có tối đa 1 Index là `VISIBLE`**. |
| **4** | Điều kiện Join là `ON a.sal BETWEEN b.min_sal AND b.max_sal` | Là Non-Equijoin $\rightarrow$ **Không bao giờ dùng được `HASH JOIN`**, chỉ có thể dùng `SORT MERGE JOIN` hoặc `NESTED LOOPS`. |
| **5** | Sự khác biệt giữa `INDEX FULL SCAN` và `INDEX FAST FULL SCAN` | `INDEX FULL SCAN` dùng Single-block I/O và **giữ nguyên thứ tự sắp xếp**; `INDEX FAST FULL SCAN` dùng Multi-block I/O nhưng **không giữ thứ tự**. |
| **6** | Khi `DROP TABLE` hoặc `TRUNCATE TABLE`, chuyện gì xảy ra với Index? | `DROP TABLE` xóa luôn mọi Index của bảng. `TRUNCATE TABLE` giữ lại cấu trúc Index nhưng xóa rỗng dữ liệu Index và reset High Water Mark. |
| **7** | So sánh cột `VARCHAR2` với giá trị kiểu `NUMBER` (`WHERE code = 100`) | Oracle ép kiểu ngầm định thành `TO_NUMBER(code) = 100` $\rightarrow$ **Mất Index** trên cột `code` và có nguy cơ lỗi `ORA-01722`. |
| **8** | Invisible Index có được cập nhật khi thực hiện `INSERT/UPDATE/DELETE` không? | **Có!** Invisible Index vẫn được duy trì đầy đủ khi DML, chỉ có Optimizer mặc định không chọn nó khi lập Execution Plan. |
| **9** | Composite Index `(A, B, C)` với truy vấn `WHERE B = 10 AND C = 20` | Thiếu cột dẫn đầu `A` $\rightarrow$ Không thể `INDEX RANGE SCAN` thông thường; chỉ có thể `INDEX SKIP SCAN` (nếu `A` có ít giá trị phân biệt) hoặc `INDEX FAST FULL SCAN`. |
| **10** | Bảng bị `DELETE` hết dữ liệu nhưng `SELECT COUNT(*)` vẫn rất chậm | Do `DELETE` **không hạ thấp High Water Mark (HWM)**, khiến `TABLE ACCESS FULL` vẫn phải đọc toàn bộ các block rỗng đến HWM. |
