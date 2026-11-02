# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 18: Index và SQL Performance

> **Tài liệu tham chiếu:** *OCA/OCP Oracle Database SQL Exam Guide (Exam 1Z0-071)* & *Oracle Database SQL Tuning Guide*.  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle OCA/OCP & Tuyển dụng VNPT/Viettel/Banking kèm phân tích chuyên sâu.  
> **Cách học:** Tự đọc đề và chọn đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và nắm vững các bẫy thi.

---

### Câu 1 (Question 1)
**Trên bảng `EMPLOYEES`, cột `COMMISSION_PCT` cho phép chứa giá trị `NULL` và được đánh một B-Tree Index đơn: `CREATE INDEX idx_emp_comm ON employees(commission_pct);`. Khi thực thi câu truy vấn dưới đây, Cost-Based Optimizer (CBO) sẽ chọn phương pháp truy cập nào?**

```sql
SELECT employee_id, last_name, salary
FROM employees
WHERE commission_pct IS NULL;
```

* A. `INDEX UNIQUE SCAN` trên `IDX_EMP_COMM`
* B. `INDEX RANGE SCAN` trên `IDX_EMP_COMM`
* C. `TABLE ACCESS FULL` trên bảng `EMPLOYEES`
* D. `INDEX SKIP SCAN` trên `IDX_EMP_COMM`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Cấu trúc **B-Tree Index** trong Oracle **không lưu trữ các mục chỉ mục mà toàn bộ các cột cấu thành đều là `NULL`** (All-NULL entries). Do chỉ mục `IDX_EMP_COMM` chỉ có 1 cột `commission_pct`, các dòng có `commission_pct IS NULL` hoàn toàn không tồn tại trong Leaf Blocks của Index. Vì vậy, để lấy đầy đủ `employee_id`, `last_name`, `salary` của các nhân viên có `commission_pct IS NULL`, Oracle bắt buộc phải quét toàn bộ bảng (`TABLE ACCESS FULL`).
  * **A, B, D sai:** B-Tree Index đơn không chứa các dòng `NULL` nên không thể dùng bất kỳ kiểu quét Index nào trên `IDX_EMP_COMM` để tìm các dòng `IS NULL`. (Mẹo: Nếu muốn B-Tree Index lưu cả dòng `NULL`, phải tạo Composite Index kèm một hằng số như `CREATE INDEX idx_emp_comm ON employees(commission_pct, 0);` hoặc dùng Bitmap Index).
</details>

---

### Câu 2 (Question 2)
**Tại sao trong các hệ thống giao dịch trực tuyến (OLTP) có tần suất `INSERT`, `UPDATE`, `DELETE` đồng thời cao, người ta tuyệt đối tránh sử dụng `BITMAP INDEX` trên các cột thường xuyên thay đổi?**

* A. Vì Bitmap Index không hỗ trợ câu lệnh `SELECT` có mệnh đề `WHERE`
* B. Vì mỗi phân đoạn Bitmap (Bitmap piece) ánh xạ tới hàng trăm hoặc hàng nghìn dòng dữ liệu; khi thực hiện DML trên 1 dòng, Oracle sẽ khóa toàn bộ phân đoạn Bitmap đó, làm treo hàng loạt phiên giao dịch (sessions) khác
* C. Vì Bitmap Index chiếm dung lượng đĩa lớn gấp 10 lần so với B-Tree Index trên các cột ít giá trị phân biệt
* D. Vì Oracle tự động xóa (`DROP`) Bitmap Index mỗi khi có câu lệnh `UPDATE` chạy trên bảng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong **B-Tree Index**, mỗi Index Entry trỏ tới đúng 1 `ROWID`, nên khi DML chỉ khóa dòng tương ứng. Ngược lại, trong **Bitmap Index**, một mục chỉ mục (Bitmap piece) chứa chuỗi bit đại diện cho **nhiều dòng dữ liệu cùng lúc**. Khi một giao dịch sửa đổi 1 dòng làm thay đổi chuỗi bit, toàn bộ Bitmap piece bị khóa (`TX Lock`), khiến các giao dịch khác muốn `INSERT/UPDATE/DELETE` các dòng khác nằm trong cùng phạm vi Bitmap piece đó bị khóa cứng (Lock Contention / Deadlock).
  * **A sai:** Bitmap Index hỗ trợ `SELECT ... WHERE` cực kỳ mạnh mẽ, đặc biệt khi kết hợp nhiều điều kiện `AND / OR / NOT` hoặc đếm `COUNT(*)`.
  * **C sai:** Trên các cột có độ phân biệt thấp (Low Cardinality), Bitmap Index được nén rất gọn và tốn ít dung lượng hơn nhiều so với B-Tree Index.
  * **D sai:** Oracle không tự động xóa Index khi `UPDATE`.
</details>

---

### Câu 3 (Question 3)
**Cho bảng `SUBSCRIBERS` (50 triệu thuê bao) có cột `PHONE_NUMBER` kiểu `VARCHAR2(15)` và đã được tạo B-Tree Index `IDX_SUB_PHONE`. Lập trình viên viết câu truy vấn sau đây và phát hiện câu lệnh chạy cực kỳ chậm kèm lỗi tiềm ẩn. Nguyên nhân chính xác là gì?**

```sql
SELECT sub_id, full_name, status
FROM subscribers
WHERE phone_number = 912345678;
```

* A. Oracle tự động ép kiểu hằng số `912345678` sang `'912345678'` nên dùng `INDEX UNIQUE SCAN` bình thường, câu lệnh chậm là do thiếu mệnh đề `ORDER BY`
* B. Oracle thực hiện ép kiểu ngầm định cột `VARCHAR2` sang `NUMBER` thành `TO_NUMBER(phone_number) = 912345678`, làm vô hiệu hóa B-Tree Index `IDX_SUB_PHONE` (dẫn đến `TABLE ACCESS FULL`) và có nguy cơ văng lỗi `ORA-01722: invalid number`
* C. Cột `VARCHAR2` không được phép tạo B-Tree Index trong Oracle
* D. Oracle báo lỗi cú pháp ngay ở bước Parse vì không cho phép đặt dấu `=` giữa cột chuỗi và số

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Theo quy tắc độ ưu tiên kiểu dữ liệu (Data Type Precedence) của Oracle, kiểu `NUMBER` có độ ưu tiên cao hơn `VARCHAR2`. Khi so sánh `varchar2_col = number_literal`, Oracle sẽ **ép kiểu ngầm định cột `VARCHAR2` sang `NUMBER`** bằng cách bọc hàm `TO_NUMBER(phone_number) = 912345678`. Vì cột Index bị bọc hàm `TO_NUMBER()`, B-Tree Index chuẩn `IDX_SUB_PHONE` bị vô hiệu hóa hoàn toàn, buộc CBO phải chọn `TABLE ACCESS FULL` 50 triệu dòng. Hơn nữa, nếu có bất kỳ dòng nào chứa ký tự không phải số (như `'+84912...'`), truy vấn sẽ chết với lỗi `ORA-01722: invalid number`.
  * **A, C, D sai:** Oracle không ép số sang chuỗi trong phép so sánh này, mà ép chuỗi sang số.
</details>

---

### Câu 4 (Question 4)
**Trên bảng `ORDERS`, DBA đã tạo một Composite B-Tree Index như sau:**

```sql
CREATE INDEX idx_ord_comp ON orders(customer_id, status, order_date);
```

**Câu truy vấn nào dưới đây có thể tận dụng hiệu quả nhất cả 3 cột của `idx_ord_comp` làm điều kiện định vị phạm vi quét (`Access Predicate` trong `INDEX RANGE SCAN`)?**

* A. `SELECT * FROM orders WHERE status = 'PAID' AND order_date = DATE '2026-01-01';`
* B. `SELECT * FROM orders WHERE customer_id = 105 AND order_date = DATE '2026-01-01';`
* C. `SELECT * FROM orders WHERE customer_id = 105 AND status = 'PAID' AND order_date >= DATE '2026-01-01';`
* D. `SELECT * FROM orders WHERE customer_id > 100 AND status = 'PAID' AND order_date = DATE '2026-01-01';`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong Composite Index `(customer_id, status, order_date)`, khi hai cột đầu (`customer_id` và `status`) được lọc bằng toán tử bằng (`=`), và cột thứ ba (`order_date`) dùng toán tử khoảng (`>=`), cả 3 cột đều được dùng liên hoàn làm **Access Predicate** để khoanh vùng chính xác lát cắt Leaf Blocks cần đọc.
  * **A sai:** Thiếu cột dẫn đầu (`customer_id` - Leading Column).
  * **B sai:** Bị khuyết cột ở giữa (`status`). Khi đó chỉ có `customer_id = 105` làm Access Predicate, còn `order_date` chỉ đóng vai trò Filter Predicate trên các mục Index của `customer_id = 105`.
  * **D sai:** Vì cột đầu tiên `customer_id > 100` đã là điều kiện khoảng (Range), các giá trị của `status` và `order_date` bên trong khoảng đó không còn nằm liền kề nhau nữa, nên `status` và `order_date` không thể làm Access Predicate thu hẹp điểm đầu-cuối mà chỉ làm Filter Predicate.
</details>

---

### Câu 5 (Question 5)
**Sự khác biệt cốt lõi giữa hai phương pháp quét chỉ mục `INDEX FULL SCAN` và `INDEX FAST FULL SCAN` trong Oracle là gì? (Chọn 2 đáp án đúng)**

* A. `INDEX FULL SCAN` đọc các Leaf Blocks theo thứ tự liên kết bằng Single-block I/O và kết quả trả về giữ nguyên thứ tự sắp xếp của khóa Index
* B. `INDEX FAST FULL SCAN` đọc toàn bộ các block của Index bằng Multi-block I/O nhưng kết quả trả về KHÔNG đảm bảo thứ tự sắp xếp
* C. `INDEX FAST FULL SCAN` chỉ đọc Root Block mà không cần đọc Leaf Blocks
* D. `INDEX FULL SCAN` xóa toàn bộ dữ liệu trong Index sau khi đọc xong

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B**
* **Giải thích chuyên sâu:**
  * **A đúng:** `INDEX FULL SCAN` đi từ Root xuống Leaf Block ngoài cùng bên trái (hoặc phải) rồi lần theo danh sách liên kết kép giữa các Leaf Blocks bằng **Single-block I/O**. Nhờ đó, dữ liệu lấy ra đã được **sắp xếp sẵn (Ordered)**, giúp loại bỏ bước `SORT ORDER BY` hoặc `SORT GROUP BY`.
  * **B đúng:** `INDEX FAST FULL SCAN` coi Index như một bảng thu nhỏ, dùng **Multi-block I/O** đọc tuần tự các block trên đĩa từ đầu đến High Water Mark của Index mà không đi theo con trỏ liên kết, do đó tốc độ đọc rất nhanh nhưng **không giữ được thứ tự sắp xếp**.
  * **C, D sai:** Mọi phép quét Index lấy dữ liệu đều phải đọc Leaf Blocks và không bao giờ xóa dữ liệu.
</details>

---

### Câu 6 (Question 6)
**Khi nào Cost-Based Optimizer (CBO) có khả năng chọn phương pháp `INDEX SKIP SCAN` trên một Composite Index `(col1, col2)`?**

* A. Khi mệnh đề `WHERE` chỉ lọc trên `col1` và không có `col2`
* B. Khi mệnh đề `WHERE` chỉ lọc trên `col2` (thiếu cột dẫn đầu `col1`), và cột dẫn đầu `col1` có rất ít giá trị phân biệt (Low Cardinality / Few Distinct Values)
* C. Khi bảng không có bất kỳ Index nào nhưng có ràng buộc `CHECK`
* D. Khi cả `col1` và `col2` đều bị bọc trong hàm `LOWER()`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** `INDEX SKIP SCAN` xảy ra khi truy vấn **bỏ qua cột dẫn đầu (`col1`)** và chỉ lọc theo cột phía sau (`col2`), với điều kiện cột dẫn đầu `col1` có **rất ít giá trị phân biệt** (ví dụ `gender` chỉ có `'M'`, `'F'`, hoặc `status` chỉ có 3 trạng thái). Khi đó Oracle chia nhỏ việc tìm kiếm thành vài lần dò nhảy cóc qua từng giá trị distinct của `col1`.
  * **A sai:** Khi lọc theo cột dẫn đầu `col1`, Oracle sẽ dùng `INDEX RANGE SCAN` (hoặc `UNIQUE SCAN`) trực tiếp, không cần Skip Scan.
  * **C, D sai:** Không có Index hoặc bọc hàm làm mất Index thì không thể `INDEX SKIP SCAN`.
</details>

---

### Câu 7 (Question 7)
**Quan sát đoạn câu lệnh SQL thực hiện kết nối hai bảng `EMPLOYEES` và `JOB_GRADES` dưới đây. Thuật toán Join vật lý nào KHÔNG BAO GIỜ được Cost-Based Optimizer sử dụng cho phép Join này?**

```sql
SELECT e.employee_id, e.last_name, e.salary, g.grade_level
FROM employees e
JOIN job_grades g
  ON e.salary BETWEEN g.lowest_sal AND g.highest_sal;
```

* A. `NESTED LOOPS JOIN`
* B. `SORT MERGE JOIN`
* C. `HASH JOIN`
* D. Cả `NESTED LOOPS` và `SORT MERGE JOIN` đều không dùng được

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Thuật toán **`HASH JOIN`** dựa trên việc tính giá trị hàm băm (Hash Value) của cột Join để tra cứu khớp chính xác trong Hash Bucket, do đó `HASH JOIN` **CHỈ hoạt động với điều kiện Join bằng (`=` - Equijoin)**. Trong câu truy vấn trên, điều kiện Join là `BETWEEN ... AND ...` (Non-Equijoin / Điều kiện khoảng), nên CBO **tuyệt đối không thể** dùng `HASH JOIN`.
  * **A, B sai:** Cả `NESTED LOOPS JOIN` và `SORT MERGE JOIN` đều hỗ trợ tốt các điều kiện Non-Equijoin (`>`, `<`, `>=`, `<=`, `BETWEEN`).
</details>

---

### Câu 8 (Question 8)
**Trong những trường hợp nào sau đây, thuật toán `NESTED LOOPS JOIN` thường mang lại hiệu năng tối ưu vượt trội so với `HASH JOIN`?**

* A. Khi cả hai bảng đều có hàng trăm triệu dòng, không có điều kiện lọc `WHERE` và không có Index trên cột Join
* B. Khi tập dữ liệu dẫn xuất (Driving / Outer Row Source) trả về số lượng dòng ít và bảng bị dò (Probed / Inner Table) có Index hiệu quả trên cột Join
* C. Khi cần tổng hợp toàn bộ dữ liệu lịch sử 10 năm của hai bảng lớn trong hệ thống Data Warehouse mà không có bất kỳ Index nào
* D. Khi bộ nhớ PGA trống hàng trăm GB và cần quét toàn bộ hai bảng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** `NESTED LOOPS JOIN` hoạt động tối ưu nhất khi bảng ngoài (Driving Table) sau khi lọc chỉ còn **ít dòng**, và với mỗi dòng đó Oracle có thể tra cứu cực nhanh sang bảng trong (Inner Table) thông qua **Index (`UNIQUE SCAN` hoặc `RANGE SCAN`)** trên cột Join. Đồng thời nó trả về những dòng kết quả đầu tiên tức thì mà không cần đợi dựng Hash Table.
  * **A, C, D sai:** Khi Join hai tập dữ liệu khổng lồ mà không có Index hoặc cần đọc tỷ lệ lớn của cả 2 bảng, `HASH JOIN` sẽ vượt trội hơn hẳn vì chỉ cần đọc mỗi bảng 1 lần thay vì lặp lại hàng triệu lần dò Index.
</details>

---

### Câu 9 (Question 9)
**Hệ số gom cụm (`CLUSTERING_FACTOR`) của một B-Tree Index phản ánh điều gì và giá trị như thế nào được coi là TỐT (giúp CBO ưu tiên chọn Index đó)?**

* A. Phản ánh số lượng cột trong Index; giá trị càng lớn càng tốt
* B. Phản ánh mức độ đồng bộ về thứ tự sắp xếp vật lý giữa Index và các Data Blocks của bảng; giá trị tốt nhất là khi nó thấp và xấp xỉ bằng tổng số `BLOCKS` của bảng
* C. Phản ánh mức độ đồng bộ giữa Index và bảng; giá trị tốt nhất là khi nó cao và xấp xỉ bằng tổng số dòng (`NUM_ROWS`) của bảng
* D. Phản ánh số lượng nhánh (`BLEVEL`) của cây B-Tree; luôn bằng `0` với mọi bảng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** `CLUSTERING_FACTOR` cho biết khi quét tuần tự các mục trên Leaf Blocks của Index, Oracle phải chuyển đổi (nhảy) qua lại giữa các Data Blocks của bảng bao nhiêu lần:
    * Nếu các dòng có khóa Index liền kề nhau cũng nằm chung trong cùng Data Block trên bảng $\rightarrow$ **`CLUSTERING_FACTOR` thấp, tiến sát về số lượng `BLOCKS` của bảng (Rất tốt)**.
    * Nếu các dòng trên bảng bị xáo trộn ngẫu nhiên so với thứ tự Index $\rightarrow$ **`CLUSTERING_FACTOR` cao, tiến sát về số lượng `NUM_ROWS` của bảng (Rất xấu)**, khiến việc đọc bảng qua Index (`TABLE ACCESS BY INDEX ROWID`) cực kỳ tốn I/O.
  * **A, C, D sai:** Ngược với bản chất vật lý của Clustering Factor.
</details>

---

### Câu 10 (Question 10)
**Quan sát Execution Plan dưới đây. Hãy xác định thứ tự thực thi các bước (`Id`) từ bước chạy ĐẦU TIÊN đến bước chạy CUỐI CÙNG:**

```sql
--------------------------------------------------------------------------------------
| Id  | Operation                    | Name              | Rows  | Bytes | Cost (%CPU)|
--------------------------------------------------------------------------------------
|   0 | SELECT STATEMENT             |                   |    10 |   390 |     4   (0)|
|   1 |  NESTED LOOPS                |                   |    10 |   390 |     4   (0)|
|   2 |   TABLE ACCESS BY INDEX ROWID| DEPARTMENTS       |     1 |    19 |     2   (0)|
|*  3 |    INDEX UNIQUE SCAN         | DEPT_ID_PK        |     1 |       |     1   (0)|
|   4 |   TABLE ACCESS BY INDEX ROWID| EMPLOYEES         |    10 |   200 |     2   (0)|
|*  5 |    INDEX RANGE SCAN          | EMP_DEPARTMENT_IX |    10 |       |     1   (0)|
--------------------------------------------------------------------------------------
```

* A. `0 -> 1 -> 2 -> 3 -> 4 -> 5`
* B. `5 -> 4 -> 3 -> 2 -> 1 -> 0`
* C. `3 -> 2 -> 5 -> 4 -> 1 -> 0`
* D. `3 -> 5 -> 2 -> 4 -> 1 -> 0`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Quy tắc đọc cây Execution Plan là **Trong cùng trước, Trên xuống dưới (Most indented first, top to bottom for siblings)**:
    1. Dưới `Id = 1` (`NESTED LOOPS`) có hai nhánh con cùng cấp thụt lề là `Id = 2` (nhánh trên - Driving) và `Id = 4` (nhánh dưới - Probed).
    2. Đi sâu vào nhánh trên (`Id = 2`), con sâu nhất của nó là **`Id = 3`** (`INDEX UNIQUE SCAN` trên `DEPT_ID_PK`) $\rightarrow$ Chạy đầu tiên!
    3. Kết quả `ROWID` từ `Id = 3` trả lên cha của nó là **`Id = 2`** (`TABLE ACCESS BY INDEX ROWID` trên `DEPARTMENTS`).
    4. Tiếp theo, với dòng lấy được từ `Id = 2`, `NESTED LOOPS` kích hoạt nhánh con thứ hai (`Id = 4`), đi xuống lá sâu nhất của nhánh này là **`Id = 5`** (`INDEX RANGE SCAN` trên `EMP_DEPARTMENT_IX`).
    5. Kết quả `ROWID` từ `Id = 5` trả lên **`Id = 4`** (`TABLE ACCESS BY INDEX ROWID` trên `EMPLOYEES`).
    6. Hai nhánh `2` và `4` hội tụ tại **`Id = 1`** (`NESTED LOOPS`) và trả kết quả cuối cùng về **`Id = 0`** (`SELECT STATEMENT`).
    * Thứ tự chuẩn: **`3 -> 2 -> 5 -> 4 -> 1 -> 0`**.
</details>

---

### Câu 11 (Question 11)
**Khi đọc phần `Predicate Information` bên dưới bảng Execution Plan từ `DBMS_XPLAN.DISPLAY_CURSOR`, sự khác nhau giữa `access(...)` và `filter(...)` là gì?**

* A. `access(...)` là điều kiện định vị điểm bắt đầu và kết thúc khi tìm kiếm trong Index (hoặc băm trong Hash Join) giúp giảm số lượng block phải đọc; còn `filter(...)` là điều kiện kiểm tra loại bỏ dòng sau khi block dữ liệu đã được đọc lên bộ nhớ
* B. `access(...)` chỉ xuất hiện khi người dùng có quyền DBA; `filter(...)` xuất hiện cho người dùng thường
* C. `filter(...)` luôn nhanh hơn `access(...)` vì không cần dùng Index
* D. Hai ký hiệu này hoàn toàn giống nhau, chỉ khác cách viết tùy phiên bản Oracle

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:**
    * **Access Predicate (`access`)**: Quyết định phạm vi truy cập vật lý (chỉ đọc các block nằm trong vùng thỏa mãn điều kiện khóa), trực tiếp làm giảm số lượng I/O (`Buffers`).
    * **Filter Predicate (`filter`)**: Chỉ lọc bỏ các bản ghi không thỏa mãn **sau khi block đã bị đọc lên**. Nếu một bước quét Index có `access` rất rộng nhưng `filter` loại bỏ 99% số dòng, chứng tỏ Index đang bị thiếu cột hoặc thứ tự cột trong Composite Index chưa tối ưu!
  * **B, C, D sai:** Không liên quan đến quyền DBA và `access` mới là cơ chế giảm tải I/O thực sự.
</details>

---

### Câu 12 (Question 12)
**Bảng `TRANSACTIONS` có 20 triệu dòng được lưu trữ chiếm 500,000 Data Blocks (High Water Mark ở block thứ 500,000). Một lập trình viên chạy lệnh `DELETE FROM transactions; COMMIT;` để xóa sạch cả 20 triệu dòng. Ngay sau đó, người này chạy lệnh `SELECT COUNT(*) FROM transactions;` (giả sử bảng không có Index nào nên dùng `TABLE ACCESS FULL`). Chuyện gì sẽ xảy ra?**

* A. Câu lệnh `SELECT COUNT(*)` trả về kết quả `0` ngay lập tức (trong 0.001 giây) mà không cần đọc bất kỳ Data Block nào
* B. Câu lệnh `SELECT COUNT(*)` vẫn phải đọc tuần tự qua toàn bộ 500,000 Data Blocks rỗng cho tới mốc High Water Mark (HWM), nên thời gian chạy vẫn chậm gần tương đương lúc bảng còn 20 triệu dòng
* C. Oracle báo lỗi `ORA-01403: no data found`
* D. Lệnh `DELETE` đã tự động reset High Water Mark về `0`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Lệnh DML `DELETE` chỉ đánh dấu các dòng trong block là đã xóa (giải phóng không gian trống bên trong block để tái sử dụng cho `INSERT` sau này), nhưng **TUYỆT ĐỐI KHÔNG hạ thấp High Water Mark (HWM)** của Segment. Khi thực hiện `TABLE ACCESS FULL`, Oracle luôn đọc toàn bộ các block từ đầu Segment cho tới tận mốc **HWM** (500,000 blocks) dù bên trong không còn dòng nào!
  * Để hạ HWM về đầu và giải phóng không gian, phải dùng `TRUNCATE TABLE transactions;` hoặc `ALTER TABLE transactions ENABLE ROW MOVEMENT;` kèm `ALTER TABLE transactions SHRINK SPACE;`.
</details>

---

### Câu 13 (Question 13)
**Trên bảng `CUSTOMERS`, cột `EMAIL` đã có một B-Tree Index thông thường: `CREATE INDEX idx_cust_email ON customers(email);`. Để câu truy vấn tìm kiếm không phân biệt hoa thường dưới đây sử dụng được Index mà không phải sửa đổi cấu trúc bảng, giải pháp nào là đúng đắn nhất?**

```sql
SELECT customer_id, full_name
FROM customers
WHERE LOWER(email) = 'support@vnpt.vn';
```

* A. Chạy lệnh `DBMS_STATS.GATHER_TABLE_STATS` là đủ để `idx_cust_email` tự hiểu hàm `LOWER`
* B. Tạo một **Function-Based Index**: `CREATE INDEX idx_cust_lower_email ON customers(LOWER(email));`
* C. Đổi câu truy vấn thành `WHERE email LIKE '%support@vnpt.vn%'`
* D. Tạo một Sequence trên cột `email`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi cột `email` bị bọc trong hàm `LOWER(email)`, B-Tree Index chuẩn trên cột `(email)` không thể sử dụng được vì thứ tự sắp xếp của `LOWER(email)` khác với `email` gốc. Giải pháp chuẩn của Oracle là tạo một **Function-Based Index (FBI)** khớp chính xác với biểu thức hàm: `CREATE INDEX idx_cust_lower_email ON customers(LOWER(email));`.
  * **A sai:** Thu thập thống kê không giúp Index chuẩn đọc xuyên qua hàm `LOWER()`.
  * **C sai:** `LIKE '%...'` vừa không giải quyết được chữ hoa/thường, vừa làm mất khả năng `INDEX RANGE SCAN` do có dấu `%` ở đầu.
</details>

---

### Câu 14 (Question 14)
**Khi tạo một Function-Based Index gọi tới một hàm PL/SQL do người dùng tự định nghĩa (User-Defined Function), hàm PL/SQL đó BẮT BUỘC phải được khai báo với từ khóa nào?**

```sql
CREATE INDEX idx_calc_tax ON invoices(fn_calculate_tax(amount, tax_code));
```

* A. `PARALLEL_ENABLE`
* B. `PIPELINED`
* C. `DETERMINISTIC`
* D. `AUTONOMOUS_TRANSACTION`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Giá trị lưu trong Function-Based Index được tính toán ngay tại thời điểm `INSERT/UPDATE` dòng dữ liệu và lưu cố định vào Leaf Block. Do đó, hàm được dùng trong Index **bắt buộc phải trả về kết quả hoàn toàn giống nhau cho cùng một bộ tham số đầu vào ở mọi thời điểm** — tức là phải khai báo từ khóa **`DETERMINISTIC`**. Nếu thiếu từ khóa này, Oracle sẽ lập tức từ chối tạo Index với lỗi **`ORA-30553: The function is not deterministic`**.
</details>

---

### Câu 15 (Question 15)
**Trên bảng `PRODUCTS`, cột `EXEC_DATE` có kiểu `DATE` (lưu cả ngày lẫn giờ-phút-giây) và đã được đánh B-Tree Index `IDX_PROD_DATE`. Cách viết điều kiện `WHERE` nào sau đây để lấy tất cả các bản ghi phát sinh trong ngày `15/10/2026` mà VẪN TẬN DỤNG TỐI ĐA `INDEX RANGE SCAN` trên `IDX_PROD_DATE`?**

* A. `WHERE TRUNC(exec_date) = DATE '2026-10-15'`
* B. `WHERE TO_CHAR(exec_date, 'DD/MM/YYYY') = '15/10/2026'`
* C. `WHERE exec_date >= DATE '2026-10-15' AND exec_date < DATE '2026-10-16'`
* D. `WHERE exec_date BETWEEN DATE '2026-10-15' AND DATE '2026-10-16'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Biến đổi điều kiện thành khoảng nửa mở `exec_date >= DATE '2026-10-15' AND exec_date < DATE '2026-10-16'` (tức là từ `00:00:00` ngày `15/10` đến `23:59:59` ngày `15/10`). Cột `exec_date` được giữ nguyên bản không bọc hàm nên tận dụng hoàn hảo `INDEX RANGE SCAN` trên `IDX_PROD_DATE`, đồng thời chính xác tuyệt đối về mặt dữ liệu!
  * **A, B sai:** Bọc hàm `TRUNC()` hoặc `TO_CHAR()` trực tiếp lên cột `exec_date` làm vô hiệu hóa B-Tree Index chuẩn `IDX_PROD_DATE`.
  * **D sai về mặt nghiệp vụ:** `BETWEEN DATE '2026-10-15' AND DATE '2026-10-16'` tương đương với `<= 2026-10-16 00:00:00`, sẽ lấy thừa mất các bản ghi phát sinh đúng thời khắc `00:00:00` của ngày hôm sau (`16/10/2026`).
</details>

---

### Câu 16 (Question 16)
**Phát biểu nào sau đây là ĐÚNG về `INVISIBLE INDEX` (Chỉ mục tàng hình) trong Oracle Database? (Chọn 2 đáp án đúng)**

* A. Khi thực hiện `INSERT`, `UPDATE`, `DELETE` trên bảng, `INVISIBLE INDEX` vẫn được Oracle tự động cập nhật và duy trì giống hệt như `VISIBLE INDEX`
* B. Theo mặc định, Cost-Based Optimizer (CBO) sẽ bỏ qua `INVISIBLE INDEX` khi lập Execution Plan, trừ khi tham số `OPTIMIZER_USE_INVISIBLE_INDEXES` được bật thành `TRUE`
* C. `INVISIBLE INDEX` không chiếm bất kỳ dung lượng lưu trữ nào trên đĩa
* D. Khi chuyển một Index sang `INVISIBLE`, mọi dữ liệu bên trong Index bị xóa trắng và phải `REBUILD` lại khi chuyển về `VISIBLE`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B**
* **Giải thích chuyên sâu:**
  * **A đúng:** Một `INVISIBLE INDEX` vẫn là một Segment vật lý đầy đủ và **luôn được cập nhật đồng bộ trong mọi thao tác DML** (`INSERT/UPDATE/DELETE`) cũng như bảo vệ ràng buộc `UNIQUE` (nếu là Unique Index).
  * **B đúng:** Chữ "Invisible" có nghĩa là **tàng hình đối với Cost-Based Optimizer (CBO)** khi chọn kế hoạch thực thi mặc định. Nhờ luôn được cập nhật ngầm, khi DBA gõ `ALTER INDEX idx_name VISIBLE;`, Index có hiệu lực ngay tức khắc mà không cần Rebuild.
  * **C, D sai:** Invisible Index vẫn chiếm dung lượng bình thường và luôn chứa dữ liệu mới nhất.
</details>

---

### Câu 17 (Question 17)
**Từ phiên bản Oracle Database 12c trở đi, trong điều kiện nào bạn được phép tạo HAI Index trên cùng một cột (ví dụ cùng trên cột `DEPARTMENT_ID` của bảng `EMPLOYEES`)?**

* A. Bất kỳ lúc nào, không có điều kiện ràng buộc gì
* B. Không bao giờ được phép dưới mọi hình thức
* C. Khi hai Index đó khác nhau về loại cấu trúc vật lý (ví dụ 1 B-Tree Index và 1 Bitmap Index) VÀ tại một thời điểm chỉ có tối đa 1 Index ở trạng thái `VISIBLE` (Index còn lại phải là `INVISIBLE`)
* D. Khi cả hai Index đều là `VISIBLE` và cùng là B-Tree Non-Unique Index

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Từ Oracle 12c+, bạn có thể tạo nhiều Index trên cùng một danh sách cột (theo đúng cùng thứ tự) nếu thỏa mãn đồng thời 2 điều kiện:
    1. Các Index phải **khác đặc tính vật lý** (ví dụ: B-Tree vs. Bitmap, Unique vs. Non-Unique, Partitioned vs. Non-Partitioned).
    2. Tại một thời điểm, **chỉ duy nhất 1 Index được phép `VISIBLE`**, tất cả các Index còn lại trên cùng tập cột đó phải ở trạng thái **`INVISIBLE`**.
  * **A, B, D sai:** Nếu cố tạo 2 Index cùng `VISIBLE` trên cùng cột, Oracle sẽ báo lỗi `ORA-01408: such column list already indexed`.
</details>

---

### Câu 18 (Question 18)
**Khi kiểm tra kế hoạch thực thi thực tế bằng `DBMS_XPLAN.DISPLAY_CURSOR(NULL, NULL, 'ALLSTATS LAST')`, bạn thấy tại bước `Id = 4` có thông số: `E-Rows = 2` nhưng `A-Rows = 1500K` (1.5 triệu dòng). Điều này cho biết vấn đề gì đang xảy ra?**

* A. Câu truy vấn đang chạy nhanh gấp 750,000 lần so với dự kiến
* B. Cost-Based Optimizer đã ước tính sai nghiêm trọng Cardinality (số lượng dòng dự kiến chỉ là 2 dòng trong khi thực tế là 1.5 triệu dòng), thường do Statistics đã quá cũ (Stale Stats), thiếu Histogram trên cột bị lệch dữ liệu (Data Skew), hoặc điều kiện lọc phức tạp khiến CBO chọn sai thuật toán Join (như chọn `NESTED LOOPS` thay vì `HASH JOIN`)
* C. Bảng dữ liệu đã bị hỏng vật lý (Corrupted Block)
* D. Tham số `DB_BLOCK_SIZE` bị cấu hình sai

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Sự chênh lệch khổng lồ giữa **`E-Rows` (Estimated Rows - Cardinality dự kiến)** và **`A-Rows` (Actual Rows - Số dòng thực tế)** là nguyên nhân số 1 khiến CBO chọn sai Execution Plan. Khi CBO tưởng bước đó chỉ trả về 2 dòng (`E-Rows = 2`), nó sẽ tự tin chọn `NESTED LOOPS` để dò bảng tiếp theo. Nhưng thực tế trả về 1.5 triệu dòng (`A-Rows = 1500K`), làm vòng lặp bên trong bị chạy lặp lại (`Starts`) 1.5 triệu lần khiến câu lệnh treo cứng!
</details>

---

### Câu 19 (Question 19)
**Trong ứng dụng Java/Spring Boot hoặc .NET kết nối vào Oracle Database, nếu lập trình viên viết câu lệnh SQL bằng cách cộng chuỗi trực tiếp: `"SELECT * FROM orders WHERE order_id = " + orderId` (thay vì dùng Bind Variable `WHERE order_id = ?`), hệ quả nghiêm trọng nào sẽ xảy ra đối với kiến trúc bộ nhớ và CPU của Oracle?**

* A. Gây tràn vùng nhớ Undo Tablespace và báo lỗi `ORA-01555`
* B. Mỗi giá trị `orderId` khác nhau tạo ra một chuỗi văn bản SQL khác nhau, buộc Oracle phải thực hiện **Hard Parse** liên tục (chạy lại CBO từ đầu) và làm phân mảnh/tràn vùng nhớ **Shared Pool (Library Cache)**, gây tranh chấp Latch/Mutex đẩy CPU lên 100%
* C. Làm mất toàn bộ dữ liệu trong bảng `ORDERS`
* D. Tự động chuyển toàn bộ B-Tree Index sang Bitmap Index

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Oracle nhận diện câu lệnh SQL trong **Shared Pool (Library Cache)** bằng mã băm (SQL ID) của chuỗi văn bản câu lệnh. Khi ghép hằng số trực tiếp (`order_id = 101`, `order_id = 102`, ...), Oracle coi đây là hàng nghìn câu SQL hoàn toàn mới và phải thực hiện **Hard Parse** cho từng câu một. Hard Parse tiêu tốn cực nhiều CPU để tính toán lại Execution Plan và giữ khóa độc quyền (Library Cache Latch / Mutex) trên Shared Pool. Khi dùng **Bind Variable** (`WHERE order_id = :b1`), Oracle chỉ **Hard Parse đúng 1 lần đầu tiên**, còn hàng triệu lần sau đều là **Soft Parse** (tái sử dụng Plan có sẵn).
</details>

---

### Câu 20 (Question 20)
**Bảng `TICKETS` có 10 triệu bản ghi. Cột `STATUS` được đánh Index `IDX_TICKET_STATUS` và có phân bố dữ liệu cực kỳ lệch (Data Skew): giá trị `'CLOSED'` chiếm `9,999,500` dòng (99.995%), còn giá trị `'OPEN'` chỉ chiếm `500` dòng (0.005%). Để CBO biết chính xác sự chênh lệch này nhằm chọn `INDEX RANGE SCAN` khi tìm `'OPEN'` và chọn `TABLE ACCESS FULL` khi tìm `'CLOSED'`, DBA cần thu thập thành phần thống kê nào trên cột `STATUS`?**

* A. Một Sequence mới
* B. Một **Histogram** (Biểu đồ tần suất phân bố dữ liệu) thông qua `DBMS_STATS.GATHER_TABLE_STATS` với tham số `METHOD_OPT`
* C. Một Synonym cho bảng `TICKETS`
* D. Một View chỉ đọc (`WITH READ ONLY`)

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi không có **Histogram**, CBO luôn chia đều tổng số dòng cho số lượng giá trị phân biệt ($\text{Cardinality} = \frac{10,000,000}{2} = 5,000,000$ dòng cho cả `'OPEN'` và `'CLOSED'`), dẫn đến việc CBO luôn chọn `TABLE ACCESS FULL` ngay cả khi tìm `'OPEN'` (chỉ có 500 dòng). Khi tạo **Histogram** trên cột `STATUS` (qua `DBMS_STATS`), CBO nắm được phân phối tần suất thực tế của từng giá trị để chọn kế hoạch tối ưu cho từng trường hợp.
</details>

---

### Câu 21 (Question 21)
**Cho bảng `EMPLOYEES` có ràng buộc `NOT NULL` trên cột `EMPLOYEE_ID`, và có một Composite Index `IDX_EMP_DEPT_SAL` trên `(DEPARTMENT_ID, SALARY)`. Khi thực thi câu truy vấn dưới đây, tại sao Oracle có thể trả về kết quả mà KHÔNG CẦN thực hiện bước `TABLE ACCESS BY INDEX ROWID` (không cần đọc vào bảng `EMPLOYEES`)?**

```sql
SELECT department_id, AVG(salary)
FROM employees
WHERE department_id IS NOT NULL
GROUP BY department_id;
```

* A. Vì Oracle lấy kết quả từ Recycle Bin
* B. Vì toàn bộ các cột được tham chiếu trong câu truy vấn (`department_id` và `salary`) đều đã nằm sẵn bên trong chỉ mục `IDX_EMP_DEPT_SAL` (Covering Index), nên Oracle chỉ cần quét Index (`INDEX FAST FULL SCAN` hoặc `INDEX FULL SCAN`) là đủ dữ liệu
* C. Vì hàm `AVG()` không bao giờ đọc dữ liệu từ bảng hay Index
* D. Vì mệnh đề `GROUP BY` tự động lưu kết quả trong `PLAN_TABLE`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là kỹ thuật **Covering Index (Index-Only Access)**. Khi tất cả các cột xuất hiện trong `SELECT`, `WHERE`, `GROUP BY` (`department_id`, `salary`) đều đã có mặt trong các Leaf Blocks của Index `IDX_EMP_DEPT_SAL` và điều kiện `department_id IS NOT NULL` đảm bảo không bỏ sót dòng `NULL`, Oracle chỉ cần đọc trực tiếp từ Index (`INDEX FULL SCAN` hoặc `INDEX FAST FULL SCAN`) mà **không cần nhảy sang đọc Data Blocks của bảng `EMPLOYEES`** (`TABLE ACCESS BY INDEX ROWID` hoàn toàn biến mất khỏi Execution Plan).
</details>

---

### Câu 22 (Question 22)
**Điều kiện tìm kiếm chuỗi nào dưới đây CÓ THỂ sử dụng `INDEX RANGE SCAN` trên một B-Tree Index chuẩn được đánh trên cột `CUSTOMER_NAME`?**

* A. `WHERE customer_name LIKE '%NGUYEN%'`
* B. `WHERE customer_name LIKE '_NGUYEN%'`
* C. `WHERE customer_name LIKE 'NGUYEN%'`
* D. `WHERE SUBSTR(customer_name, 1, 6) = 'NGUYEN'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong B-Tree Index, các chuỗi ký tự được sắp xếp theo thứ tự từ điển từ trái sang phải. Với `LIKE 'NGUYEN%'`, tiền tố `'NGUYEN'` cố định ở đầu chuỗi giúp Oracle xác định chính xác điểm bắt đầu và điểm kết thúc trong Leaf Blocks để thực hiện **`INDEX RANGE SCAN`** (`access("CUSTOMER_NAME" LIKE 'NGUYEN%')`).
  * **A, B sai:** Khi ký tự đại diện `%` hoặc `_` đứng ngay ở vị trí đầu tiên (`'%NGUYEN%'` hoặc `'_NGUYEN%'`), Oracle không biết ký tự đầu tiên là chữ cái nào để định vị nhánh cây B-Tree, nên không thể dùng `INDEX RANGE SCAN`.
  * **D sai:** Bọc hàm `SUBSTR()` lên cột làm mất tác dụng của B-Tree Index chuẩn (trừ khi tạo Function-Based Index).
</details>

---

### Câu 23 (Question 23)
**Giả sử bạn tạo bảng `DEPARTMENTS` với khóa chính: `CREATE TABLE departments (dept_id NUMBER PRIMARY KEY, dept_name VARCHAR2(50));` (Oracle tự động tạo ngầm một Unique Index cho `PRIMARY KEY`). Sau đó bạn thực thi câu lệnh: `ALTER TABLE departments DISABLE PRIMARY KEY;`. Điều gì sẽ xảy ra với Unique Index đó?**

* A. Unique Index đó tự động bị Oracle xóa (`DROP`) khỏi cơ sở dữ liệu
* B. Unique Index đó vẫn giữ nguyên và chuyển sang trạng thái `BITMAP INDEX`
* C. Lệnh `DISABLE PRIMARY KEY` bị báo lỗi không thể chạy nếu không xóa bảng trước
* D. Unique Index đó được đổi tên thành `SYS_TEMP_INDEX`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Quy tắc chuẩn trong kỳ thi OCA/OCP:
    * Nếu Unique Index được Oracle **tự động tạo ngầm định (implicitly created)** khi khai báo ràng buộc `PRIMARY KEY` hoặc `UNIQUE`, thì khi bạn `DISABLE` hoặc `DROP` ràng buộc đó (mà không chỉ định `KEEP INDEX`), Oracle sẽ **tự động `DROP` luôn Unique Index đó**.
    * Ngược lại, nếu Index đã được người dùng tạo tường minh (`CREATE INDEX`) từ trước rồi mới gán cho `PRIMARY KEY`, thì khi `DISABLE`/`DROP` ràng buộc, Index đó mặc định được giữ lại.
</details>

---

### Câu 24 (Question 24)
**Mệnh đề nào trong câu lệnh SQL dưới đây gây ra phép toán `SORT UNIQUE` không cần thiết nếu người lập trình đã biết chắc chắn hai tập dữ liệu từ hai bảng không bao giờ trùng lặp nhau?**

```sql
SELECT trans_id, amount, trans_date FROM trans_2025
UNION
SELECT trans_id, amount, trans_date FROM trans_2026;
```

* A. Toán tử `UNION` (nên thay bằng `UNION ALL` để bỏ qua bước sắp xếp và khử trùng lặp đắt đỏ)
* B. Mệnh đề `SELECT`
* C. Cột `trans_date`
* D. Dấu chấm phẩy `;` ở cuối câu lệnh

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Toán tử tập hợp **`UNION`** bắt buộc Oracle phải gộp hai tập kết quả lại rồi thực hiện phép **`SORT UNIQUE`** (hoặc `HASH UNIQUE`) để tìm và loại bỏ các dòng trùng nhau, gây tốn rất nhiều CPU, bộ nhớ PGA và `TEMP tablespace`. Khi dữ liệu thuộc 2 bảng phân mảnh theo năm (`trans_2025` và `trans_2026`) vốn dĩ đã rời nhau (hoặc nghiệp vụ không cần khử trùng), việc dùng **`UNION ALL`** sẽ ghép nối và trả kết quả ngay tức khắc mà không tốn bất kỳ chi phí Sort/Unique nào!
</details>

---

### Câu 25 (Question 25)
**Cho bảng `EMPLOYEES` có `10,000` dòng (`NUM_ROWS = 10000`). Cột `DEPARTMENT_ID` không có giá trị `NULL` và có `20` giá trị phân biệt (`NUM_DISTINCT = 20`) phân bố đồng đều (không có Histogram). Khi thực thi câu truy vấn có điều kiện `WHERE department_id = 50`, giá trị `Selectivity` và `Cardinality` mà Cost-Based Optimizer (CBO) tính toán ra lần lượt là bao nhiêu?**

* A. `Selectivity = 20`, `Cardinality = 500`
* B. `Selectivity = 0.05`, `Cardinality = 500`
* C. `Selectivity = 0.50`, `Cardinality = 5000`
* D. `Selectivity = 0.005`, `Cardinality = 50`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Áp dụng công thức chuẩn của Cost-Based Optimizer cho điều kiện bằng (`=`) trên cột phân bố đều không có `NULL`:
    * $\text{Selectivity} = \frac{1}{\text{NUM\_DISTINCT}} = \frac{1}{20} = 0.05$ (tức 5%).
    * $\text{Cardinality (E-Rows)} = \text{NUM\_ROWS} \times \text{Selectivity} = 10,000 \times 0.05 = 500 \text{ dòng}$.
  * **A sai:** `Selectivity` luôn là một số thực nằm trong đoạn `[0.0, 1.0]`, không bao giờ bằng `20`.
  * **C, D sai:** Tính sai tỷ lệ phép chia $\frac{1}{20}$.
</details>

---
