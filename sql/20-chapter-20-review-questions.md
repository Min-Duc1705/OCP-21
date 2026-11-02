# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 20: Oracle SQL Nâng Cao Trong Thực Tế

> **Tài liệu tham chiếu:** *OCA/OCP Oracle Database SQL Exam Guide (Exam 1Z0-071)* & *Oracle Database SQL Language Reference*.  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle OCA/OCP & Tuyển dụng VNPT/Viettel/Banking kèm phân tích chuyên sâu.  
> **Cách học:** Tự đọc đề và chọn đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và nắm vững các bẫy thi.

---

### Câu 1 (Question 1)
**Khi thực thi một câu lệnh `MERGE INTO target_tab t USING source_tab s ON (t.id = s.id) ...`, trong trường hợp nào Oracle sẽ ném ra lỗi `ORA-30926: unable to get a stable set of rows in the source tables`?**

* A. Khi bảng đích `target_tab` đang rỗng (không có dòng nào)
* B. Khi bảng nguồn `source_tab` có từ 2 dòng trở lên cùng khớp (`MATCH`) với 1 dòng duy nhất của bảng đích `target_tab` theo điều kiện kết nối `ON (t.id = s.id)`
* C. Khi một dòng trong bảng đích `target_tab` không tìm thấy dòng nào tương ứng trong bảng nguồn `source_tab`
* D. Khi câu lệnh `MERGE` thiếu nhánh `WHEN NOT MATCHED THEN INSERT`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Câu lệnh `MERGE` yêu cầu tính tất định (deterministic): mỗi dòng trong bảng đích `target_tab` chỉ được phép khớp với **tối đa 1 dòng** từ bảng nguồn `source_tab`. Nếu trong `source_tab` có 2 dòng cùng mang `id = 10` và bảng đích có 1 dòng `id = 10`, Oracle không biết phải lấy giá trị của dòng nào trong 2 dòng nguồn để `UPDATE` vào bảng đích, dẫn đến lỗi **`ORA-30926: unable to get a stable set of rows in the source tables`**.
  * **A, C sai:** Bảng đích rỗng hoặc có dòng không khớp là hoàn toàn bình thường trong `MERGE`.
  * **D sai:** Nhánh `WHEN NOT MATCHED` là tùy chọn (optional), không bắt buộc phải có.
</details>

---

### Câu 2 (Question 2)
**Quan sát câu lệnh `MERGE` dưới đây. Tại sao câu lệnh này lại báo lỗi ngay khi biên dịch/thực thi?**

```sql
MERGE INTO employees_target t
USING employees_source s
   ON (t.employee_id = s.employee_id)
WHEN MATCHED THEN
    UPDATE SET
        t.employee_id = s.new_employee_id,
        t.salary      = s.salary;
```

* A. Vì câu lệnh `MERGE` bắt buộc phải có nhánh `WHEN NOT MATCHED THEN INSERT`
* B. Vì không được phép `UPDATE` cột nằm trong điều kiện kết nối `ON` (`t.employee_id`), sẽ gây ra lỗi `ORA-38104: Columns referenced in the ON Clause cannot be updated`
* C. Vì sau từ khóa `UPDATE SET` không được phép viết tên bí danh `t.`
* D. Vì điều kiện `ON` không được đặt trong dấu ngoặc đơn

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Quy tắc bất biến của câu lệnh `MERGE` trong Oracle: **Bất kỳ cột nào đã được tham chiếu trong mệnh đề điều kiện kết nối `ON (...)` thì tuyệt đối không được phép xuất hiện ở vế trái của mệnh đề `UPDATE SET`**! Ở đây `t.employee_id` nằm trong `ON (t.employee_id = s.employee_id)` nên việc cập nhật `t.employee_id = ...` sẽ lập tức văng lỗi `ORA-38104`.
  * **D sai:** Trong `MERGE`, điều kiện sau `ON` **bắt buộc phải đặt trong dấu ngoặc đơn** `ON (...)`.
</details>

---

### Câu 3 (Question 3)
**Cho bảng đích `INVENTORY` đang có 3 dòng dữ liệu: `(id=1, qty=10)`, `(id=2, qty=0)`, `(id=3, qty=5)`. Bảng nguồn `SHIPMENTS` chỉ có 2 dòng: `(id=1, delta=-10)` và `(id=3, delta=5)` (không có `id=2`). Sau khi thực thi câu lệnh `MERGE` dưới đây, những dòng nào sẽ bị xóa bởi mệnh đề `DELETE WHERE (t.qty = 0)`?**

```sql
MERGE INTO inventory t
USING shipments s
   ON (t.id = s.id)
WHEN MATCHED THEN
    UPDATE SET t.qty = t.qty + s.delta
    DELETE WHERE (t.qty = 0);
```

* A. Cả dòng `id=1` và dòng `id=2` đều bị xóa
* B. Chỉ có dòng `id=2` bị xóa (vì `qty` ban đầu bằng `0`)
* C. Chỉ có dòng `id=1` bị xóa; còn dòng `id=2` VẪN TỒN TẠI nguyên vẹn trong bảng `INVENTORY`!
* D. Không có dòng nào bị xóa

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (Bẫy thi OCA/OCP kinh điển):** Mệnh đề `DELETE WHERE` bên trong nhánh `WHEN MATCHED THEN UPDATE` của câu lệnh `MERGE` tuân theo 2 quy tắc sống còn:
    1. Nó **CHỈ kiểm tra và xóa những dòng vừa được cập nhật (touched) bởi nhánh `WHEN MATCHED THEN UPDATE`**! Dòng `id=2` không có mặt trong bảng nguồn `SHIPMENTS` nên không khớp (`NOT MATCHED`) và không được `UPDATE`, do đó `DELETE WHERE` hoàn toàn không đụng tới dòng `id=2` (dù `id=2` có `qty = 0`)!
    2. Nó kiểm tra giá trị **SAU KHI ĐÃ `UPDATE`**. Dòng `id=1` khớp với bảng nguồn, được cập nhật `qty = 10 + (-10) = 0`. Vì giá trị sau cập nhật bằng `0` nên dòng `id=1` bị `DELETE WHERE (t.qty = 0)` xóa bỏ!
</details>

---

### Câu 4 (Question 4)
**Lập trình viên muốn chèn 1 triệu dòng từ bảng `STAGING_CUST` sang bảng `CUSTOMERS`. Để câu lệnh `INSERT INTO customers SELECT * FROM staging_cust` không bị Rollback toàn bộ khi gặp một vài dòng vi phạm ràng buộc `NOT NULL` hoặc `UNIQUE`, lập trình viên đã tạo bảng log lỗi `ERR$_CUSTOMERS` bằng gói `DBMS_ERRLOG`. Câu lệnh nào dưới đây cho phép bỏ qua MỌI dòng lỗi (ghi vào bảng `ERR$_CUSTOMERS`) và tiếp tục chèn toàn bộ các dòng hợp lệ còn lại?**

* A. `INSERT INTO customers SELECT * FROM staging_cust LOG ERRORS INTO err$_customers;`
* B. `INSERT INTO customers SELECT * FROM staging_cust LOG ERRORS INTO err$_customers REJECT LIMIT UNLIMITED;`
* C. `INSERT INTO customers SELECT * FROM staging_cust IGNORE ERRORS;`
* D. `INSERT INTO customers SELECT * FROM staging_cust EXCEPTION WHEN OTHERS THEN NULL;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi sử dụng mệnh đề `LOG ERRORS INTO err$_customers`, nếu bạn muốn câu lệnh tiếp tục chạy đến hết bất kể có bao nhiêu dòng lỗi, bạn **bắt buộc phải thêm `REJECT LIMIT UNLIMITED`**.
  * **A sai (Bẫy thi):** Nếu chỉ viết `LOG ERRORS INTO err$_customers` mà bỏ qua mệnh đề `REJECT LIMIT`, giá trị mặc định của Oracle là **`REJECT LIMIT 0`**! Nghĩa là ngay khi gặp dòng lỗi đầu tiên, Oracle ghi dòng lỗi đó vào bảng `err$_customers` rồi **vẫn ném lỗi và Rollback toàn bộ câu lệnh `INSERT`**!
  * **C, D sai:** Sai cú pháp SQL của Oracle.
</details>

---

### Câu 5 (Question 5)
**Một lập trình viên viết câu lệnh truy vấn sau đây với mong muốn lấy ra 5 nhân viên có mức lương (`salary`) cao nhất công ty. Điều gì sẽ thực sự xảy ra?**

```sql
SELECT employee_id, first_name, salary
FROM employees
WHERE ROWNUM <= 5
ORDER BY salary DESC;
```

* A. Trả về chính xác 5 nhân viên có lương cao nhất công ty theo thứ tự giảm dần
* B. Báo lỗi cú pháp vì `ROWNUM` không được đi kèm với `ORDER BY`
* C. Câu lệnh lấy ngẫu nhiên 5 dòng đầu tiên mà Oracle đọc được từ bảng (hoặc Index), gán `ROWNUM` từ 1 đến 5, rồi mới đem 5 dòng ngẫu nhiên đó đi sắp xếp giảm dần theo `salary` (dẫn đến kết quả sai nghiệp vụ!)
* D. Trả về tất cả các nhân viên trong bảng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Theo thứ tự thực thi câu lệnh SQL: `FROM` $\rightarrow$ `WHERE` (gán và lọc `ROWNUM <= 5` ngay tại đây!) $\rightarrow$ `SELECT` $\rightarrow$ `ORDER BY` (chạy cuối cùng!). Do đó, Oracle lấy ra 5 dòng bất kỳ đọc được trước tiên, rồi mới sắp xếp 5 dòng đó theo lương giảm dần.
  * Để lấy đúng 5 người lương cao nhất, phải dùng cú pháp chuẩn từ Oracle 12c+: `SELECT ... FROM employees ORDER BY salary DESC FETCH FIRST 5 ROWS ONLY;` hoặc bọc câu lệnh có `ORDER BY salary DESC` vào một Subquery (Inline View) rồi mới lọc `WHERE ROWNUM <= 5` ở câu lệnh bên ngoài.
</details>

---

### Câu 6 (Question 6)
**Bảng `EMPLOYEES` có 107 dòng dữ liệu. Khi thực thi câu truy vấn dưới đây, số lượng dòng trả về là bao nhiêu?**

```sql
SELECT employee_id, last_name
FROM employees
WHERE ROWNUM = 2;
```

* A. `1` dòng (dòng thứ hai trong bảng)
* B. `2` dòng
* C. `0` dòng (Không có dòng nào được trả về)
* D. Báo lỗi `ORA-00936: missing expression`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Cột giả `ROWNUM` được cấp phát động trong lúc đọc dữ liệu bắt đầu từ số `1`. Khi dòng đầu tiên được đọc lên, nó được gán tạm `ROWNUM = 1`. Kiểm tra điều kiện `WHERE ROWNUM = 2` thấy `1 = 2` là **SAI (False)** $\rightarrow$ Dòng đầu tiên bị loại bỏ! Khi dòng thứ hai được đọc lên, vì chưa có dòng thứ nhất nào được giữ lại trong tập kết quả nên dòng thứ hai này lại được gán tạm `ROWNUM = 1` $\rightarrow$ Kiểm tra `1 = 2` lại **SAI** và bị loại tiếp! Quá trình cứ thế lặp lại đến hết bảng và trả về **0 dòng**.
  * Quy tắc nhớ nhanh: Điều kiện `WHERE ROWNUM = n` (với $n > 1$) hoặc `WHERE ROWNUM > n` (với $n \ge 1$) **luôn luôn trả về 0 dòng**!
</details>

---

### Câu 7 (Question 7)
**Bảng `SCORES` lưu điểm thi của 10 thí sinh đã sắp xếp giảm dần theo điểm: `100, 98, 95, 95, 95, 90, 85, 80, 75, 70`. Khi thực thi câu truy vấn dưới đây, có bao nhiêu dòng dữ liệu được trả về?**

```sql
SELECT student_id, score
FROM scores
ORDER BY score DESC
FETCH FIRST 3 ROWS WITH TIES;
```

* A. `3` dòng (`100, 98, 95`)
* B. `5` dòng (`100, 98, 95, 95, 95`)
* C. `2` dòng (`100, 98`)
* D. `10` dòng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Mệnh đề `FETCH FIRST 3 ROWS WITH TIES` lấy ra 3 dòng đầu tiên (`100`, `98`, và người đầu tiên đạt `95`). Tuy nhiên, vì có từ khóa **`WITH TIES`** (lấy kèm các dòng đồng hạng), Oracle kiểm tra tiếp các dòng phía sau xem có ai bằng điểm với dòng thứ 3 (`score = 95`) hay không. Vì dòng thứ 4 và dòng thứ 5 cũng có `score = 95`, Oracle lấy luôn cả hai dòng này, tổng cộng trả về **5 dòng**! (Nếu dùng `FETCH FIRST 3 ROWS ONLY` thì chỉ trả về đúng 3 dòng).
</details>

---

### Câu 8 (Question 8)
**Trong một bảng giao dịch `TRANSACTIONS` có 100 triệu dòng (đã đánh Index trên `(created_at DESC, trans_id DESC)`), tại sao kỹ thuật `Keyset (Seek) Pagination` lại nhanh hơn gấp hàng nghìn lần so với `Offset Pagination` (`OFFSET 5000000 ROWS FETCH NEXT 20 ROWS ONLY`) khi truy vấn các trang ở sâu?**

* A. Vì `Offset Pagination` không sử dụng được lệnh `ORDER BY`
* B. Vì `OFFSET 5000000 ROWS` bắt buộc Oracle phải quét và đếm qua toàn bộ 5,000,020 dòng đầu tiên rồi vứt bỏ 5,000,000 dòng; trong khi `Keyset Pagination` dùng điều kiện `WHERE (created_at, trans_id) < (:last_date, :last_id)` nhảy thẳng vào đúng vị trí khóa trên B-Tree Index và chỉ đọc đúng 20 dòng cần thiết
* C. Vì `Keyset Pagination` lưu toàn bộ 100 triệu dòng vào ổ đĩa mềm
* D. Vì `OFFSET` tự động xóa Index của bảng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong cơ sở dữ liệu quan hệ, các dòng trên B-Tree Index không được đánh số thứ tự cố định từ 1 đến 100 triệu. Do đó, khi bạn yêu cầu `OFFSET 5000000 ROWS`, dù có dùng Index thì Oracle vẫn phải bước đi tuần tự qua 5 triệu mục chỉ mục đầu tiên để đếm đủ 5 triệu dòng rồi mới lấy 20 dòng tiếp theo. Ngược lại, **Keyset / Seek Pagination** truyền mốc khóa của dòng cuối trang trước vào mệnh đề `WHERE`, giúp cây B-Tree định vị điểm bắt đầu trong $O(\log N)$ (chỉ 3-4 bước đọc block) và lấy ra ngay 20 dòng tiếp theo với tốc độ không đổi (~1ms) ở mọi trang!
</details>

---

### Câu 9 (Question 9)
**Bảng `ORDERS` có 1,000 dòng, trong đó có `300` dòng có `status = 'PAID'`, `500` dòng có `status = 'PENDING'`, và `200` dòng có `status = 'CANCELLED'`. Một lập trình viên viết câu truy vấn dưới đây để đếm số đơn hàng `'PAID'`. Kết quả trả về của cột `paid_cnt` là bao nhiêu?**

```sql
SELECT COUNT(CASE WHEN status = 'PAID' THEN 1 ELSE 0 END) AS paid_cnt
FROM orders;
```

* A. `300`
* B. `1000`
* C. `0`
* D. `700`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng (Bẫy kinh điển trong đề thi và thực tế):** Hàm tổng hợp **`COUNT(biểu_thức)`** trong SQL đếm tất cả các dòng mà **`biểu_thức IS NOT NULL`**. Trong câu lệnh trên:
    * Với 300 dòng `'PAID'`, biểu thức `CASE` trả về số `1` (`NOT NULL` $\rightarrow$ được đếm).
    * Với 700 dòng còn lại, nhánh `ELSE 0` trả về số `0`. Mà **số `0` cũng là một giá trị `NOT NULL`** $\rightarrow$ cũng được hàm `COUNT()` đếm luôn!
    * Tổng cộng `COUNT` đếm cả 1,000 dòng và trả về **`1000`**!
  * Để ra đúng kết quả `300`, phải viết:
    * Cách 1 (Bỏ `ELSE 0` để mặc định là `ELSE NULL`): `COUNT(CASE WHEN status = 'PAID' THEN 1 END)`
    * Cách 2 (Đổi `COUNT` thành `SUM`): `SUM(CASE WHEN status = 'PAID' THEN 1 ELSE 0 END)`.
</details>

---

### Câu 10 (Question 10)
**Bảng `CONTACTS` không có khóa chính và bị chèn trùng lặp nhiều dòng có cùng giá trị `(phone, email)`. Câu lệnh `DELETE` nào dưới đây xóa sạch mọi bản sao trùng lặp và chỉ giữ lại đúng 1 dòng duy nhất cho mỗi bộ `(phone, email)`?**

```sql
-- Câu lệnh nào đúng chuẩn Oracle?
```

* A. `DELETE FROM contacts GROUP BY phone, email HAVING COUNT(*) > 1;`
* B. `DELETE FROM contacts WHERE rowid NOT IN (SELECT MIN(rowid) FROM contacts GROUP BY phone, email);`
* C. `DELETE DISTINCT phone, email FROM contacts;`
* D. `DELETE FROM contacts WHERE ROWNUM > 1 GROUP BY phone, email;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Mỗi dòng vật lý trong bảng đều có địa chỉ `ROWID` duy nhất. Subquery `SELECT MIN(rowid) FROM contacts GROUP BY phone, email` tìm ra đúng 1 `ROWID` nhỏ nhất đại diện cho mỗi cặp `(phone, email)`. Câu lệnh `DELETE ... WHERE rowid NOT IN (...)` bên ngoài sẽ xóa toàn bộ các dòng bản sao có `ROWID` không nằm trong danh sách giữ lại đó!
  * **A, C, D sai:** Lệnh `DELETE` trong SQL không hỗ trợ mệnh đề `GROUP BY` trực tiếp hay từ khóa `DELETE DISTINCT`.
</details>

---

### Câu 11 (Question 11)
**Nếu bảng `SUBSCRIBERS` bị trùng lặp theo cột `SUB_CODE` và yêu cầu nghiệp vụ bắt buộc phải **giữ lại dòng có ngày cập nhật (`UPDATED_AT`) mới nhất** (nếu trùng cả `UPDATED_AT` thì giữ dòng có `ID` lớn nhất) và xóa các dòng cũ hơn, cách viết truy vấn nào trong mệnh đề `WHERE rowid IN (...)` là chính xác nhất?**

* A. Sử dụng hàm phân tích `ROW_NUMBER() OVER (PARTITION BY sub_code ORDER BY updated_at DESC, id DESC) AS rn` trong Inline View rồi lọc xóa các dòng có `rn > 1`
* B. Sử dụng hàm `RANK() OVER (PARTITION BY sub_code ORDER BY updated_at ASC) AS rn` rồi lọc `rn = 1`
* C. Sử dụng `MIN(rowid)` với `GROUP BY sub_code`
* D. Sử dụng `COUNT(*) OVER ()`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Khi cần giữ lại bản ghi theo tiêu chí ưu tiên nghiệp vụ (như `updated_at DESC, id DESC`), hàm `ROW_NUMBER() OVER (PARTITION BY sub_code ORDER BY updated_at DESC, id DESC)` sẽ đánh số `rn = 1` cho bản ghi mới nhất của mỗi `sub_code`, và đánh số `rn = 2, 3, ...` cho các bản ghi trùng lặp cũ hơn. Sau đó chỉ cần xóa các dòng có `rn > 1`.
  * **B sai:** Sắp xếp `ASC` và xóa `rn = 1` sẽ xóa mất dòng cũ nhất chứ không xóa hết các bản sao, hơn nữa `RANK()` có thể sinh nhiều số `1` nếu trùng `updated_at`.
  * **C sai:** `MIN(rowid)` chỉ lấy theo vị trí vật lý trên đĩa, không đảm bảo đó là dòng có `updated_at` mới nhất.
</details>

---

### Câu 12 (Question 12)
**Trong bộ hàm Regular Expression của Oracle, hàm nào được thiết kế chuyên biệt để dùng làm điều kiện lọc trong mệnh đề `WHERE` hoặc ràng buộc `CHECK` (tương tự toán tử `LIKE` nhưng hỗ trợ mẫu Regex)?**

* A. `REGEXP_SUBSTR`
* B. `REGEXP_INSTR`
* C. `REGEXP_LIKE`
* D. `REGEXP_MATCH`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** `REGEXP_LIKE(source_char, pattern [, match_param])` là một điều kiện vị từ (Boolean Condition) dùng trực tiếp trong mệnh đề `WHERE`, `HAVING`, `CHECK`, hoặc biểu thức `CASE WHEN`.
  * **A, B sai:** `REGEXP_SUBSTR` trả về chuỗi con (`VARCHAR2`), `REGEXP_INSTR` trả về vị trí số nguyên (`NUMBER`).
  * **D sai:** Trong Oracle không có hàm `REGEXP_MATCH`.
</details>

---

### Câu 13 (Question 13)
**Cho câu truy vấn sử dụng `REGEXP_SUBSTR` dưới đây. Kết quả trả về của câu truy vấn này là gì?**

```sql
SELECT REGEXP_SUBSTR('VNPT-IT-2026-OCP', '[^-]+', 1, 3) AS result
FROM dual;
```

* A. `'VNPT'`
* B. `'IT'`
* C. `'2026'`
* D. `'OCP'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Phân tích các tham số của `REGEXP_SUBSTR('VNPT-IT-2026-OCP', '[^-]+', 1, 3)`:
    * Chuỗi nguồn: `'VNPT-IT-2026-OCP'`.
    * Mẫu `[^-]+`: Một hoặc nhiều ký tự liên tiếp **không phải là dấu gạch ngang `-`** (tức là các từ phân cách bởi dấu `-`).
    * Tham số thứ 3 (`position = 1`): Bắt đầu tìm từ ký tự thứ 1.
    * Tham số thứ 4 (`occurrence = 3`): Lấy **lần khớp thứ 3**.
    * Lần khớp 1 là `'VNPT'`, lần khớp 2 là `'IT'`, **lần khớp 3 là `'2026'`**, lần khớp 4 là `'OCP'`. Do đó kết quả là `'2026'`.
</details>

---

### Câu 14 (Question 14)
**Kết quả trả về của câu lệnh `REGEXP_REPLACE` sử dụng kỹ thuật tham chiếu ngược (Backreference `\1`, `\2`) dưới đây là gì?**

```sql
SELECT REGEXP_REPLACE('0912345678', '^(\d{3})\d{4}(\d{3})$', '\1-****-\2') AS masked
FROM dual;
```

* A. `'091-****-678'`
* B. `'***-2345-***'`
* C. `'\1-****-\2'`
* D. `'0912-****-5678'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Trong mẫu `^(\d{3})\d{4}(\d{3})$`:
    * Nhóm ngoặc tròn thứ nhất `(\d{3})` khớp với 3 chữ số đầu `'091'` $\rightarrow$ được lưu vào **`\1`**.
    * `\d{4}` ở giữa khớp với 4 chữ số `'2345'` (không nằm trong ngoặc tròn).
    * Nhóm ngoặc tròn thứ hai `(\d{3})` khớp với 3 chữ số cuối `'678'` $\rightarrow$ được lưu vào **`\2`**.
    * Chuỗi thay thế `'\1-****-\2'` sẽ ghép `\1` (`'091'`) + `'-****-'` + `\2` (`'678'`) thành **`'091-****-678'`**.
</details>

---

### Câu 15 (Question 15)
**Trong hàm `REGEXP_INSTR(source_char, pattern, position, occurrence, return_option, match_param)`, nếu tham số thứ 5 (`return_option`) được truyền giá trị là `1` (thay vì mặc định là `0`), hàm sẽ trả về giá trị gì?**

```sql
SELECT REGEXP_INSTR('Oracle_21c_DB', '\d+c', 1, 1, 1) AS pos FROM dual;
```

* A. Vị trí ký tự bắt đầu của đoạn khớp (`8` - vị trí chữ số `'2'`)
* B. Vị trí của ký tự **ngay sau khi kết thúc** đoạn khớp (`11` - vị trí dấu `'_'` thứ hai sau chuỗi `'21c'`)
* C. Số lượng ký tự của đoạn khớp (`3`)
* D. Luôn trả về `1`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong `'Oracle_21c_DB'`, mẫu `\d+c` khớp với đoạn `'21c'` nằm từ vị trí `8` đến vị trí `10`:
    * Nếu `return_option = 0` (mặc định): Trả về vị trí bắt đầu đoạn khớp là **`8`**.
    * Nếu `return_option = 1`: Trả về vị trí ký tự kế tiếp ngay sau đoạn khớp là **`11`** (`8 + 3 = 11`).
</details>

---

### Câu 16 (Question 16)
**Tham số `match_param` nào trong các hàm `REGEXP_*` của Oracle cho phép dấu chấm (`.`) khớp được với cả ký tự xuống dòng (`Newline` / `CHR(10)`)?**

* A. `'i'`
* B. `'c'`
* C. `'n'`
* D. `'x'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Theo mặc định trong POSIX/Oracle Regex, dấu chấm (`.`) khớp với mọi ký tự đơn **trừ ký tự xuống dòng (`\n`)**. Khi truyền cờ **`'n'`** (*Newline-matching*), dấu chấm (`.`) sẽ khớp được với cả ký tự xuống dòng.
  * **A sai:** `'i'` là Case-insensitive (không phân biệt hoa/thường).
  * **B sai:** `'c'` là Case-sensitive (phân biệt hoa/thường).
  * **D sai:** `'x'` là bỏ qua khoảng trắng trong mẫu pattern.
</details>

---

### Câu 17 (Question 17)
**Cho câu truy vấn sử dụng `REGEXP_COUNT` dưới đây. Kết quả trả về là bao nhiêu?**

```sql
SELECT REGEXP_COUNT('abababa', 'aba', 1) AS cnt FROM dual;
```

* A. `3`
* B. `2`
* C. `1`
* D. `0`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Hàm `REGEXP_COUNT` đếm số lần xuất hiện **không chồng lấn nhau (Non-overlapping occurrences)** của mẫu trong chuỗi nguồn từ trái sang phải:
    * Lần khớp thứ 1 lấy 3 ký tự đầu tiên (vị trí 1..3): **`aba`**`baba`.
    * Sau khi khớp xong vị trí 1..3, việc tìm kiếm tiếp theo bắt đầu từ **vị trí thứ 4** (phần còn lại là `'baba'`).
    * Trong phần `'baba'` còn lại, mẫu `'aba'` khớp thêm 1 lần nữa ở vị trí 5..7 (`b`**`aba`**).
    * Tổng cộng có **`2`** lần khớp không chồng lấn!
</details>

---

### Câu 18 (Question 18)
**Trong biểu thức chính quy chuẩn POSIX của Oracle, lớp ký tự `[[:digit:]]` tương đương với mẫu viết tắt nào?**

* A. `[a-zA-Z]`
* B. `[0-9]` (hoặc `\d`)
* C. `[^0-9]`
* D. `[ \t\r\n]`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Lớp ký tự POSIX `[:digit:]` (khi đặt trong tập hợp ngoặc vuông thành `[[:digit:]]`) đại diện cho một chữ số bất kỳ từ `0` đến `9`, tương đương với `[0-9]` hoặc `\d`.
  * Lưu ý bẫy cú pháp: `[:digit:]` là tên lớp POSIX nên khi đứng một mình phải được bọc trong một cặp ngoặc vuông nữa: **`[[:digit:]]`**! Nếu chỉ viết `[:digit:]` (1 cặp ngoặc vuông) thì Oracle sẽ hiểu nhầm là khớp 1 trong các chữ cái `:`, `d`, `i`, `g`, `t`!
</details>

---

### Câu 19 (Question 19)
**Cho bảng `ENROLLMENTS` có cấu trúc: `(student_id, course_id, student_name, grade)`, trong đó khóa chính ghép (Composite Primary Key) là `(student_id, course_id)`. Thuộc tính `student_name` chỉ phụ thuộc vào `student_id` mà không phụ thuộc vào `course_id`. Thiết kế bảng này đang vi phạm trực tiếp dạng chuẩn nào?**

* A. Dạng chuẩn 1 (`1NF`)
* B. Dạng chuẩn 2 (`2NF`) do tồn tại phụ thuộc hàm bộ phận (Partial Dependency) của thuộc tính không khóa vào một phần của khóa chính ghép
* C. Chỉ vi phạm `BCNF`, nhưng đã đạt `3NF`
* D. Đã đạt chuẩn `3NF` hoàn hảo

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Một bảng đạt **Dạng chuẩn 2 (`2NF`)** khi nó đã đạt `1NF` và **mọi thuộc tính không khóa đều phải phụ thuộc hàm đầy đủ vào toàn bộ khóa chính**. Ở đây khóa chính là cặp `(student_id, course_id)`, nhưng thuộc tính không khóa `student_name` chỉ phụ thuộc vào một bộ phận của khóa chính là `student_id` ($\text{student\_id} \rightarrow \text{student\_name}$). Đây chính là **Phụ thuộc bộ phận (Partial Functional Dependency)**, vi phạm `2NF`!
</details>

---

### Câu 20 (Question 20)
**Cho bảng `EMPLOYEES` có khóa chính đơn là `emp_id`, và các cột: `(emp_id PK, emp_name, dept_id, dept_name, dept_location)`. Trong đó `emp_id -> dept_id` và `dept_id -> (dept_name, dept_location)`. Bảng này đã đạt dạng chuẩn nào và vi phạm dạng chuẩn nào?**

* A. Chưa đạt `1NF`
* B. Đạt `1NF` nhưng vi phạm `2NF`
* C. Đạt `2NF` (vì khóa chính chỉ có 1 cột đơn `emp_id` nên không thể có phụ thuộc bộ phận), nhưng **vi phạm `3NF`** do tồn tại phụ thuộc hàm bắc cầu (`Transitive Dependency`: `emp_id -> dept_id -> dept_name`)
* D. Đã đạt `BCNF`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:**
    * Vì khóa chính `emp_id` là **khóa đơn (chỉ gồm 1 cột)** và các ô dữ liệu đều nguyên tố (`1NF`), nên mọi thuộc tính phụ thuộc vào khóa chính chắc chắn là phụ thuộc đầy đủ $\rightarrow$ Bảng **tự động đạt `2NF`**.
    * Tuy nhiên, thuộc tính không khóa `dept_name` và `dept_location` lại phụ thuộc vào một thuộc tính không khóa khác là `dept_id` ($\text{emp\_id} \rightarrow \text{dept\_id} \rightarrow \text{dept\_name}$). Đây là **Phụ thuộc bắc cầu (Transitive Dependency)**, làm bảng **vi phạm `3NF`**!
</details>

---

### Câu 21 (Question 21)
**Trong câu lệnh `MERGE`, nếu bạn chỉ muốn cập nhật các dòng đã tồn tại mà KHÔNG muốn chèn thêm bất kỳ dòng mới nào khi không khớp (`NOT MATCHED`), bạn có thể viết câu lệnh `MERGE` chỉ có duy nhất nhánh `WHEN MATCHED THEN UPDATE` (bỏ qua hoàn toàn nhánh `WHEN NOT MATCHED`) được không?**

* A. Hoàn toàn ĐƯỢC PHÉP (Từ Oracle 10g trở đi, hai nhánh `WHEN MATCHED` và `WHEN NOT MATCHED` độc lập với nhau; câu lệnh `MERGE` có thể chứa cả hai hoặc chỉ chứa một trong hai nhánh)
* B. KHÔNG ĐƯỢC PHÉP, bắt buộc phải có đủ cả `WHEN MATCHED` và `WHEN NOT MATCHED`
* C. Chỉ được phép bỏ nhánh `WHEN MATCHED`, không được bỏ nhánh `WHEN NOT MATCHED`
* D. Phải viết `WHEN NOT MATCHED THEN NULL;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Trong chuẩn SQL của Oracle hiện đại, câu lệnh `MERGE` cho phép chỉ khai báo `WHEN MATCHED THEN UPDATE ...` (dùng `MERGE` như một cách viết `UPDATE` có `JOIN` cực kỳ thanh thoát và hiệu quả!), hoặc chỉ khai báo `WHEN NOT MATCHED THEN INSERT ...`, hoặc khai báo cả hai. (Lưu ý: PL/SQL có lệnh `NULL;`, nhưng trong `MERGE` của SQL không có cú pháp `THEN NULL`).
</details>

---

### Câu 22 (Question 22)
**Kỹ thuật sử dụng câu truy vấn phân cấp `CONNECT BY LEVEL <= ...` kết hợp `REGEXP_SUBSTR` dưới đây dùng để giải quyết bài toán thực tế nào?**

```sql
SELECT TRIM(REGEXP_SUBSTR('HN,HCM,DN,HP', '[^,]+', 1, LEVEL)) AS city_code
FROM dual
CONNECT BY LEVEL <= REGEXP_COUNT('HN,HCM,DN,HP', ',') + 1;
```

* A. Ghép 4 dòng thành 1 chuỗi ngăn cách bởi dấu phẩy
* B. Tách một chuỗi văn bản ngăn cách bởi dấu phẩy (`'HN,HCM,DN,HP'`) thành **4 dòng dữ liệu riêng biệt** (`'HN'`, `'HCM'`, `'DN'`, `'HP'`)
* C. Xóa bảng `DUAL`
* D. Đếm số lượng chữ cái trong chuỗi

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là mẫu SQL kinh điển trong Oracle để chuyển đổi chuỗi CSV thành các dòng (Ngược lại với hàm `LISTAGG`):
    * `REGEXP_COUNT('HN,HCM,DN,HP', ',') + 1` tính ra số phần tử là `3 + 1 = 4`.
    * `CONNECT BY LEVEL <= 4` trên bảng `DUAL` sinh ra 4 dòng có `LEVEL` lần lượt là `1, 2, 3, 4`.
    * Với mỗi dòng `LEVEL`, `REGEXP_SUBSTR(..., '[^,]+', 1, LEVEL)` trích xuất phần tử thứ `1, 2, 3, 4` tương ứng!
</details>

---

### Câu 23 (Question 23)
**Khi sử dụng tính năng DML Error Logging (`LOG ERRORS INTO err$_table REJECT LIMIT UNLIMITED`), loại lỗi nào dưới đây VẪN làm toàn bộ câu lệnh `MERGE` hoặc `UPDATE` bị dừng và Rollback (không thể bỏ qua bằng `LOG ERRORS` ở chế độ mặc định)?**

* A. Lỗi vi phạm ràng buộc `NOT NULL` (`ORA-01400` / `ORA-01407`)
* B. Lỗi dữ liệu vượt quá độ dài cột (`ORA-12899: value too large for column`)
* C. Lỗi chia cho 0 (`ORA-01476: divisor is equal to zero`)
* D. Lỗi không ổn định tập nguồn trong `MERGE` (`ORA-30926: unable to get a stable set of rows`) hoặc lỗi hết không gian lưu trữ Tablespace (`ORA-01653`)

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Tính năng `LOG ERRORS INTO` được thiết kế để bắt các lỗi dữ liệu ở cấp độ từng dòng (như vi phạm `NOT NULL`, `CHECK`, `FOREIGN KEY`, `UNIQUE` khi `INSERT`, lỗi ép kiểu số/ngày, chuỗi quá dài, chia cho 0). Tuy nhiên, các lỗi ở cấp độ cấu trúc câu lệnh hoặc tài nguyên hệ thống như **`ORA-30926`** (1 dòng đích khớp nhiều dòng nguồn trong `MERGE`) hoặc lỗi đầy Tablespace / hết Undo vẫn sẽ làm dừng toàn bộ câu lệnh.
</details>

---

### Câu 24 (Question 24)
**Mục đích chính của kỹ thuật Phi chuẩn hóa (`Denormalization`) trong thiết kế cơ sở dữ liệu cho các hệ thống Báo cáo lớn / Data Warehouse là gì?**

* A. Tiết kiệm tối đa dung lượng ổ đĩa cứng
* B. Tăng tốc độ cho các câu lệnh `INSERT`, `UPDATE`, `DELETE` nhỏ lẻ
* C. Chủ động chấp nhận lưu trữ dư thừa dữ liệu có kiểm soát (ví dụ thêm cột tổng hợp hoặc gộp bảng) nhằm **giảm bớt số lượng phép kết nối (`JOIN`) phức tạp**, từ đó **tăng tốc độ truy vấn đọc (`SELECT`)** cho các báo cáo lớn
* D. Để xóa bỏ toàn bộ các khóa chính (`PRIMARY KEY`) trong hệ thống

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Chuẩn hóa (`3NF`/`BCNF`) tối ưu cho việc ghi (`INSERT/UPDATE/DELETE`) và chống dư thừa dữ liệu, nhưng khi lên báo cáo phải `JOIN` 10-15 bảng lớn lại với nhau gây chậm. **Denormalization** đánh đổi thêm một chút không gian lưu trữ và công sức đồng bộ khi ghi để đổi lấy **tốc độ đọc (`SELECT`) cực nhanh** nhờ dữ liệu đã được đặt sẵn cùng chỗ.
</details>

---

### Câu 25 (Question 25)
**Biểu thức `REGEXP_LIKE(code, '^[A-Z]{2}-[0-9]{4}$', 'c')` sẽ trả về `TRUE` cho giá trị `code` nào dưới đây?**

* A. `'vn-2026'`
* B. `'VN-2026'`
* C. `'VNP-2026'`
* D. `'VN-2026-A'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Phân tích mẫu `^[A-Z]{2}-[0-9]{4}$` với tham số `'c'` (Case-sensitive — phân biệt chữ hoa/thường):
    * `^`: Bắt đầu chuỗi.
    * `[A-Z]{2}`: Đúng 2 chữ cái **IN HOA** từ `A` đến `Z`.
    * `-`: Dấu gạch ngang.
    * `[0-9]{4}`: Đúng 4 chữ số từ `0` đến `9`.
    * `$`: Kết thúc chuỗi.
    * Do đó chỉ có `'VN-2026'` khớp hoàn toàn.
  * **A sai:** Vì cờ `'c'` phân biệt hoa thường nên `'vn'` (chữ thường) không khớp `[A-Z]`.
  * **C sai:** `'VNP'` có 3 chữ cái (yêu cầu đúng 2).
  * **D sai:** Dư hậu tố `'-A'` ở cuối (vi phạm mốc kết thúc chuỗi `$`).
</details>

---
