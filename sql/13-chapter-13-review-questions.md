# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 13: Các Database Objects & Phân Quyền (Views, Sequences, Indexes, Synonyms, Data Dictionary & DCL)

> **Tài liệu tham chiếu:** *OCA/OCP Oracle Database SQL Exam Guide (Exam 1Z0-071)* & Đề thi sát hạch CNTT VNPT.  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết.  
> **Cách học:** Bạn hãy tự đọc đề và chọn đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và nắm vững bẫy thi.

---

### Câu 1 (Question 1)
**Bạn muốn tạo một khung nhìn (`VIEW`) tên là `V_FUTURE_SALES` dựa trên bảng `SALES_2027`, nhưng hiện tại bảng `SALES_2027` vẫn chưa được tạo trong cơ sở dữ liệu. Câu lệnh nào sau đây cho phép tạo trước định nghĩa View này vào Data Dictionary mà không bị hủy lệnh?**

* A. `CREATE VIEW v_future_sales AS SELECT * FROM sales_2027 WITH DEFERRED;`
* B. `CREATE FORCE VIEW v_future_sales AS SELECT * FROM sales_2027;`
* C. `CREATE NOFORCE VIEW v_future_sales AS SELECT * FROM sales_2027;`
* D. Không thể tạo View trong mọi trường hợp nếu bảng cơ sở chưa tồn tại.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Tùy chọn **`FORCE`** trong câu lệnh `CREATE [OR REPLACE] FORCE VIEW ...` cho phép tạo View ngay cả khi các bảng cơ sở (Base Tables) chưa tồn tại hoặc người tạo chưa có quyền truy cập vào bảng cơ sở. View sẽ được tạo ra kèm cảnh báo (`Warning: View created with compilation errors`) và mang trạng thái `INVALID` trong `USER_OBJECTS`. Khi bảng `SALES_2027` được tạo về sau, View sẽ tự động biên dịch sang `VALID` ở lần truy vấn đầu tiên.
  * **A sai:** Cú pháp `WITH DEFERRED` không tồn tại trong `CREATE VIEW`.
  * **C, D sai:** `NOFORCE` là chế độ mặc định, sẽ từ chối tạo View và báo lỗi `ORA-00942` nếu bảng `SALES_2027` chưa tồn tại.
</details>

---

### Câu 2 (Question 2)
**Bảng `EMPLOYEES` có 4 cột: `EMP_ID` (Primary Key), `FULL_NAME` (`NOT NULL`), `SALARY`, và `DEPT_ID`. Bạn tạo một View tên là `V_EMP_SAL` bằng câu lệnh dưới đây (và không tạo bất kỳ `INSTEAD OF` Trigger nào). Những thao tác DML nào sau đây có thể thực hiện THÀNH CÔNG thông qua View `V_EMP_SAL`?**

```sql
CREATE OR REPLACE VIEW v_emp_sal AS
SELECT emp_id, full_name, salary, salary * 12 AS annual_salary
FROM employees
WHERE dept_id = 10;
```

* A. Chỉ thực hiện được `DELETE`; không thể `UPDATE` hay `INSERT` bất kỳ cột nào.
* B. Thực hiện được `DELETE` và `UPDATE` trên các cột `emp_id`, `full_name`, `salary` (nhưng không `UPDATE` được cột `annual_salary`), và KHÔNG THỂ thực hiện `INSERT` vào View này.
* C. Thực hiện được cả `DELETE`, `UPDATE` (trên cột `salary`) và `INSERT` (nếu chỉ liệt kê 3 cột `emp_id, full_name, salary`).
* D. Không thể thực hiện bất kỳ lệnh `DELETE`, `UPDATE` hay `INSERT` nào vì View có chứa biểu thức số học.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là quy tắc 3 tầng kinh điển của DML trên View trong đề thi 1Z0-071:
    1. **`DELETE`:** Hoàn toàn **được phép** vì View không chứa `GROUP BY`, Group functions (`SUM`, `AVG`...), `DISTINCT` hay `ROWNUM`.
    2. **`UPDATE`:** Hoàn toàn **được phép** cập nhật các cột cơ sở bình thường (`emp_id`, `full_name`, `salary`), chỉ cấm cập nhật trực tiếp cột biểu thức ảo `annual_salary`.
    3. **`INSERT`:** **Bị cấm hoàn toàn (`ORA-01733: virtual column not allowed here`)**! Quy tắc của Oracle là: chỉ cần trong định nghĩa của View xuất hiện bất kỳ một cột biểu thức nào (`salary * 12`), bạn không thể thực hiện lệnh `INSERT` qua View đó, ngay cả khi câu lệnh `INSERT` của bạn bỏ qua không nhắc tới cột `annual_salary`!
  * **A, C, D sai:** C là cái bẫy mà rất nhiều thí sinh mắc phải khi nghĩ rằng không chèn vào cột biểu thức thì vẫn `INSERT` qua View được.
</details>

---

### Câu 3 (Question 3)
**Bảng `EMPLOYEES` có cột `HIRE_DATE DATE NOT NULL` (không có giá trị `DEFAULT`). Bạn tạo một View đơn giản như sau: `CREATE VIEW v_emp_basic AS SELECT emp_id, full_name, salary FROM employees;`. Điều gì sẽ xảy ra khi bạn chạy lệnh `INSERT INTO v_emp_basic VALUES (501, 'Tran Van K', 3000);`?**

* A. Dòng mới được chèn thành công và cột `HIRE_DATE` trong bảng `EMPLOYEES` tự động nhận giá trị `SYSDATE`.
* B. Dòng mới được chèn thành công và cột `HIRE_DATE` nhận giá trị `NULL`.
* C. Câu lệnh `INSERT` thất bại và báo lỗi `ORA-01400: cannot insert NULL into ("EMPLOYEES"."HIRE_DATE")` vì cột `HIRE_DATE` có ràng buộc `NOT NULL` (không có `DEFAULT`) nhưng không có mặt trong View.
* D. Bản thân câu lệnh `CREATE VIEW` đã báo lỗi ngay từ đầu vì không đưa hết các cột `NOT NULL` vào View.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khi thực hiện `INSERT` thông qua một View, mọi cột không xuất hiện trong View sẽ tự động được truyền giá trị `DEFAULT` (hoặc `NULL` nếu không có `DEFAULT`) xuống bảng cơ sở `EMPLOYEES`. Vì cột `HIRE_DATE` ở bảng gốc có ràng buộc `NOT NULL` và không có `DEFAULT`, nên việc chèn qua View `v_emp_basic` sẽ cố chèn `NULL` vào `HIRE_DATE` và bị chặn bởi lỗi `ORA-01400`! (Tuy nhiên, lệnh `UPDATE` và `DELETE` qua `v_emp_basic` vẫn chạy bình thường).
  * **A, B, D sai:** Câu lệnh `CREATE VIEW` không bắt buộc phải chứa các cột `NOT NULL` của bảng gốc.
</details>

---

### Câu 4 (Question 4)
**Xem xét View `V_IT_EMP` được tạo với mệnh đề `WITH CHECK OPTION` dưới đây. Nhân viên có `emp_id = 103` hiện đang thuộc `dept_id = 30`. Câu lệnh nào dưới đây sẽ bị TỪ CHỐI với lỗi `ORA-01402: view WITH CHECK OPTION where-clause violation`?**

```sql
CREATE OR REPLACE VIEW v_it_emp AS
SELECT emp_id, full_name, salary, dept_id
FROM employees
WHERE dept_id = 30
WITH CHECK OPTION;
```

* A. `UPDATE v_it_emp SET salary = 9000 WHERE emp_id = 103;`
* B. `DELETE FROM v_it_emp WHERE emp_id = 103;`
* C. `UPDATE employees SET dept_id = 10 WHERE emp_id = 103;`
* D. `UPDATE v_it_emp SET dept_id = 10 WHERE emp_id = 103;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Mệnh đề `WITH CHECK OPTION` bắt buộc mọi thao tác `INSERT` hoặc `UPDATE` thực hiện **thông qua View `v_it_emp`** phải giữ cho dòng dữ liệu tiếp tục thỏa mãn điều kiện `WHERE dept_id = 30` của View. Khi câu lệnh D cập nhật `dept_id = 10` thông qua `v_it_emp`, dòng dữ liệu không còn thỏa mãn `dept_id = 30` nữa nên bị chặn với lỗi `ORA-01402`.
  * **A sai:** Cập nhật `salary = 9000` không làm thay đổi `dept_id = 30` nên hoàn toàn hợp lệ.
  * **B sai:** `WITH CHECK OPTION` không bao giờ ngăn cản lệnh `DELETE` qua View.
  * **C sai:** Câu lệnh C cập nhật trực tiếp trên **bảng gốc `employees`** chứ không đi qua View `v_it_emp`, nên `WITH CHECK OPTION` của View không hề kiểm tra và câu lệnh C chạy thành công!
</details>

---

### Câu 5 (Question 5)
**Trong một hệ thống Kho dữ liệu (Data Warehouse) ít có giao dịch cập nhật đồng thời, bảng `CUSTOMERS` có 50 triệu dòng. Cột `MARITAL_STATUS` chỉ chứa 3 giá trị phân biệt (`'SINGLE'`, `'MARRIED'`, `'DIVORCED'`) và thường xuyên được kết hợp với cột `GENDER` (`'M'`, `'F'`) bằng các toán tử `AND` / `OR` trong mệnh đề `WHERE`. Loại chỉ mục (`INDEX`) nào sau đây là lựa chọn tối ưu nhất cho hai cột này?**

* A. `Unique B-Tree Index`
* B. `Bitmap Index`
* C. `Function-Based Index`
* D. `Reverse Key Index`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** **`Bitmap Index`** (`CREATE BITMAP INDEX ...`) được thiết kế chuyên biệt cho các cột có **độ chọn lọc thấp (Low Cardinality)** — tức là số lượng giá trị riêng biệt rất ít so với tổng số dòng của bảng (như Giới tính, Tình trạng hôn nhân, Trạng thái, Vùng miền), đặc biệt hiệu quả khi thực hiện các phép toán logic bit (`AND`, `OR`, `NOT`, `COUNT`) trong môi trường **Data Warehouse** (ít DML đồng thời). Además, Bitmap Index còn lưu trữ cả các dòng có giá trị `NULL`.
  * **A sai:** Cột chỉ có 2–3 giá trị lặp lại trên 50 triệu dòng thì không thể tạo `Unique Index`, và `B-Tree Index` thông thường chỉ phù hợp cho các cột có độ chọn lọc cao (High Cardinality).
  * **C, D sai:** Không phù hợp với bài toán kết hợp các cột Low Cardinality.
</details>

---

### Câu 6 (Question 6)
**Bạn chuyển một chỉ mục trên bảng `EMPLOYEES` sang trạng thái ẩn bằng câu lệnh: `ALTER INDEX idx_emp_dept INVISIBLE;`. Với cấu hình tham số phiên làm việc mặc định, phát biểu nào sau đây là ĐÚNG về chỉ mục `idx_emp_dept`?**

* A. Chỉ mục `idx_emp_dept` bị ngừng cập nhật khi thực hiện các lệnh `INSERT`, `UPDATE`, `DELETE` trên bảng `EMPLOYEES` để tăng tốc độ DML.
* B. Trình tối ưu hóa truy vấn (Cost-Based Optimizer) sẽ bỏ qua không sử dụng `idx_emp_dept` khi thực thi câu lệnh `SELECT`, nhưng Oracle **vẫn tiếp tục cập nhật (duy trì)** chỉ mục này trong mọi thao tác `INSERT`, `UPDATE`, `DELETE` trên bảng `EMPLOYEES`.
* C. Chỉ mục `idx_emp_dept` tự động chuyển sang trạng thái `UNUSABLE` và phải được `REBUILD` trước khi chuyển lại thành `VISIBLE`.
* D. Không ai có thể nhìn thấy tên `idx_emp_dept` trong từ điển dữ liệu `USER_INDEXES`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Một `INVISIBLE` Index chỉ "vô hình" đối với bộ tối ưu hóa truy vấn (**Optimizer**) khi lập kế hoạch thực thi câu lệnh `SELECT` (nhằm giúp DBA kiểm thử xem việc xóa Index có làm chậm hệ thống không trước khi xóa thật). Trong suốt thời gian ở trạng thái `INVISIBLE`, mọi câu lệnh DML (`INSERT`, `UPDATE`, `DELETE`) trên bảng **vẫn luôn cập nhật cấu trúc của `INVISIBLE` Index đó** theo thời gian thực! Nhờ vậy, nếu phát hiện truy vấn bị chậm, DBA chỉ cần chạy `ALTER INDEX idx_emp_dept VISIBLE;` là Optimizer dùng lại được ngay tức khắc mà không cần `REBUILD`.
  * **A, C, D sai:** Chỉ khi Index ở trạng thái `UNUSABLE` thì nó mới ngừng được duy trì bởi DML và cần phải `REBUILD`.
</details>

---

### Câu 7 (Question 7)
**Từ Oracle 12c trở đi, trên cột `DEPT_ID` của bảng `EMPLOYEES` hiện đã có sẵn một chỉ mục `B-Tree Index` tên là `IDX_DEPT_BTREE` (đang ở trạng thái `VISIBLE` mặc định). Trong trường hợp nào sau đây bạn có thể tạo thêm một chỉ mục thứ hai trên chính cột `DEPT_ID` đó mà không cần xóa `IDX_DEPT_BTREE`?**

* A. Tạo thêm một `B-Tree Index` khác tên là `IDX_DEPT_BTREE2` với tùy chọn `INVISIBLE`.
* B. Tạo thêm một `Bitmap Index` tên là `IDX_DEPT_BITMAP` với tùy chọn `VISIBLE`.
* C. Tạo thêm một `Bitmap Index` tên là `IDX_DEPT_BITMAP` với tùy chọn `INVISIBLE`.
* D. Oracle tuyệt đối không bao giờ cho phép tồn tại 2 Index trên cùng một cột trong mọi trường hợp.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Từ Oracle 12c+, bạn được phép tạo nhiều Index trên cùng một cột (hoặc cùng danh sách cột) khi và chỉ khi thỏa mãn đồng thời **2 điều kiện**:
    1. Các Index phải **khác nhau về loại hoặc tính chất** (ở đây 1 cái là `B-Tree Index`, cái mới là `Bitmap Index`).
    2. Tại một thời điểm, **chỉ được phép có tối đa 1 Index ở trạng thái `VISIBLE`**, nên chỉ mục `IDX_DEPT_BITMAP` tạo thêm bắt buộc phải có từ khóa **`INVISIBLE`**!
  * **A sai:** Hai Index cùng là Non-Unique B-Tree giống hệt nhau trên cùng cột thì kể cả cái thứ hai là `INVISIBLE` vẫn bị từ chối (`ORA-01408: such column list already indexed`).
  * **B sai:** Không thể có 2 Index cùng `VISIBLE` trên cùng một cột tại cùng một thời điểm.
  * **D sai:** Tính năng này đã được hỗ trợ chính thức từ Oracle 12c.
</details>

---

### Câu 8 (Question 8)
**Trên cột `FULL_NAME` của bảng `EMPLOYEES` đang có một `B-Tree Index` thông thường: `CREATE INDEX idx_emp_name ON employees(full_name);`. Tuy nhiên, ứng dụng thường xuyên chạy câu truy vấn: `SELECT * FROM employees WHERE UPPER(full_name) = 'NGUYEN VAN A';` và bị chậm do không dùng được Index trên. Giải pháp nào sau đây giúp câu truy vấn sử dụng được Index mà không cần sửa câu lệnh `SELECT` của ứng dụng?**

* A. Chạy lệnh `ALTER INDEX idx_emp_name UPPERCASE;`.
* B. Tạo một `Function-Based Index` bằng câu lệnh: `CREATE INDEX idx_emp_upper_name ON employees(UPPER(full_name));`.
* C. Tạo một `Bitmap Index` trên cột `full_name`.
* D. Chuyển `idx_emp_name` sang trạng thái `INVISIBLE`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi bạn bọc một cột bên trong một hàm (như `UPPER(full_name)`, `TRUNC(hire_date)`) hoặc một biểu thức trong mệnh đề `WHERE`, chỉ mục B-Tree thông thường trên cột gốc sẽ bị vô hiệu hóa (trừ khi quét toàn bộ Index). Bằng cách tạo một **`Function-Based Index`** khớp với biểu thức hàm (`CREATE INDEX idx_emp_upper_name ON employees(UPPER(full_name));`), Oracle sẽ tính trước và lưu kết quả `UPPER(full_name)` vào cây B-Tree, giúp câu truy vấn tìm kiếm tức thì!
  * **A, C, D sai:** Không giải quyết được việc hàm `UPPER()` vô hiệu hóa Index cột gốc.
</details>

---

### Câu 9 (Question 9)
**Một Sequence tên là `INV_SEQ` vừa được tạo bằng câu lệnh: `CREATE SEQUENCE inv_seq START WITH 10 INCREMENT BY 1;`. Bạn mở một phiên làm việc (Session) mới và thực thi ngay câu lệnh đầu tiên là: `SELECT inv_seq.CURRVAL FROM dual;`. Kết quả sẽ là gì?**

* A. Trả về `10`.
* B. Trả về `9`.
* C. Trả về `NULL`.
* D. Báo lỗi `ORA-08002: sequence INV_SEQ.CURRVAL is not yet defined in this session`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Giá trị của `CURRVAL` luôn gắn với từng phiên làm việc cụ thể (Session-specific): nó lưu giữ con số cuối cùng mà **chính Session đó** vừa yêu cầu thông qua `NEXTVAL`. Do đó, trong bất kỳ Session nào, bạn **bắt buộc phải gọi `inv_seq.NEXTVAL` ít nhất một lần trước khi có thể gọi `inv_seq.CURRVAL`**! Nếu gọi `CURRVAL` trước, Oracle sẽ ném lỗi `ORA-08002`.
  * **A, B, C sai:** Đây là câu hỏi bẫy kinh điển nhất về Sequence trong mọi đề thi OCA 1Z0-071.
</details>

---

### Câu 10 (Question 10)
**Xem xét câu lệnh tạo Sequence `TEST_SEQ` dưới đây. Giả sử bạn thực thi câu lệnh `SELECT test_seq.NEXTVAL FROM dual;` liên tiếp **4 lần**. Giá trị trả về ở **lần chạy thứ 4** là bao nhiêu?**

```sql
CREATE SEQUENCE test_seq
START WITH 5
INCREMENT BY 5
MAXVALUE 15
CYCLE
NOCACHE;
```

* A. `5`
* B. `1`
* C. `0`
* D. Báo lỗi `ORA-08004: sequence TEST_SEQ.NEXTVAL exceeds MAXVALUE`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Hãy theo dõi từng lần gọi `NEXTVAL` và chú ý bẫy `MINVALUE` mặc định khi quay vòng `CYCLE`:
    * Lần 1: Trả về **`5`** (`START WITH 5`).
    * Lần 2: Trả về **`10`** (`5 + 5`).
    * Lần 3: Trả về **`15`** (`10 + 5` — chạm ngưỡng `MAXVALUE 15`).
    * Lần 4: Vì có tùy chọn `CYCLE`, Sequence sẽ quay vòng về giá trị **`MINVALUE`** (chứ **KHÔNG quay về `START WITH 5`**!). Và vì khi tạo Sequence ta không khai báo tường minh `MINVALUE`, nên giá trị mặc định của `MINVALUE` đối với một Sequence tăng dần là **`1`**! Do đó lần chạy thứ 4 trả về **`1`**!
  * **A sai:** Đây là cái bẫy khiến hơn 80% thí sinh chọn nhầm vì tưởng `CYCLE` sẽ quay lại `START WITH 5`. Muốn nó quay lại `5`, lúc tạo Sequence bắt buộc phải ghi thêm `MINVALUE 5`!
  * **C, D sai:** Có `CYCLE` nên không báo lỗi vượt `MAXVALUE`.
</details>

---

### Câu 11 (Question 11)
**Trong một Session, giá trị tiếp theo của `my_seq.NEXTVAL` là `50`. Bạn thực thi câu lệnh `SELECT` dưới đây. Kết quả hiển thị của 3 cột sẽ là gì?**

```sql
SELECT my_seq.NEXTVAL, my_seq.NEXTVAL, my_seq.CURRVAL
FROM dual;
```

* A. `50, 51, 51`
* B. `50, 50, 50`
* C. `50, 51, 50`
* D. Báo lỗi vì không được gọi `NEXTVAL` hai lần trong cùng một câu lệnh `SELECT`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong một câu lệnh SQL đơn, cho dù `my_seq.NEXTVAL` và `my_seq.CURRVAL` xuất hiện bao nhiêu lần trong danh sách `SELECT`, Oracle cũng **chỉ tăng Sequence đúng 1 lần duy nhất cho mỗi dòng kết quả**! Vì bảng `dual` chỉ có 1 dòng, `my_seq.NEXTVAL` sinh ra số `50` một lần và dùng chung con số `50` đó cho cả 3 biểu thức trên dòng kết quả: `50, 50, 50`.
  * **A, C, D sai:** Chỉ khi truy vấn trên một bảng có nhiều dòng thì `NEXTVAL` mới tăng thêm 1 nhịp khi chuyển sang dòng tiếp theo.
</details>

---

### Câu 12 (Question 12)
**Bạn muốn sửa đổi Sequence `EMP_SEQ` đã tồn tại bằng câu lệnh `ALTER SEQUENCE`. Câu lệnh nào dưới đây sẽ bị BÁO LỖI?**

* A. `ALTER SEQUENCE emp_seq INCREMENT BY 10;`
* B. `ALTER SEQUENCE emp_seq MAXVALUE 999999 CACHE 50;`
* C. `ALTER SEQUENCE emp_seq START WITH 500;`
* D. `ALTER SEQUENCE emp_seq NOCYCLE NOCACHE;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong câu lệnh `ALTER SEQUENCE`, tùy chọn **`START WITH`** bị cấm sửa đổi trực tiếp (`ORA-02283: cannot alter starting sequence number`)! Để bắt đầu từ một số mới, bạn phải `DROP SEQUENCE` rồi `CREATE SEQUENCE` lại (hoặc dùng `ALTER SEQUENCE ... RESTART WITH ...` nếu đề bài hỏi cú pháp mở rộng mới, còn viết `ALTER SEQUENCE ... START WITH ...` luôn luôn báo lỗi `ORA-02283`).
  * **A, B, D sai:** Các thuộc tính `INCREMENT BY`, `MAXVALUE`, `MINVALUE`, `CYCLE`/`NOCYCLE`, `CACHE`/`NOCACHE`, `ORDER`/`NOORDER` đều sửa được bình thường bằng `ALTER SEQUENCE`.
</details>

---

### Câu 13 (Question 13)
**Ở vị trí nào sau đây bạn ĐƯỢC PHÉP sử dụng biểu thức `seq_name.NEXTVAL` trong Oracle Database (từ phiên bản 12c trở đi)?**

* A. Trong mệnh đề `DEFAULT` của cột khi thực hiện lệnh `CREATE TABLE` (ví dụ: `id NUMBER DEFAULT seq_name.NEXTVAL PRIMARY KEY`).
* B. Trong danh sách `SELECT` của một câu truy vấn có từ khóa `DISTINCT`.
* C. Trong biểu thức điều kiện của ràng buộc `CHECK` (ví dụ: `CHECK (id <= seq_name.NEXTVAL)`).
* D. Trong mệnh đề `ORDER BY` hoặc `GROUP BY` của câu lệnh `SELECT`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Kể từ Oracle 12c+, bạn hoàn toàn có thể gán trực tiếp `seq_name.NEXTVAL` (hoặc `CURRVAL`) làm giá trị `DEFAULT` (hoặc `DEFAULT ON NULL`) cho cột khi tạo bảng: `id NUMBER DEFAULT seq_name.NEXTVAL`.
  * **B, C, D sai:** `NEXTVAL` và `CURRVAL` bị cấm tuyệt đối trong câu lệnh `SELECT` có `DISTINCT`, `GROUP BY`, `HAVING`, `ORDER BY`, `UNION`/`INTERSECT`/`MINUS`, mệnh đề `WHERE`, định nghĩa `VIEW` và ràng buộc `CHECK` (`ORA-02287: sequence number not allowed here`).
</details>

---

### Câu 14 (Question 14)
**Bảng `ORDERS` sử dụng `ord_seq.NEXTVAL` để cấp mã đơn hàng. Hiện tại đơn hàng mới nhất có mã là `100`. Bạn thực thi câu lệnh `INSERT INTO orders VALUES (ord_seq.NEXTVAL, 'New Order');` (nhận mã `101`), nhưng ngay sau đó bạn thực thi lệnh `ROLLBACK;`. Tiếp theo, bạn chạy lại `INSERT INTO orders VALUES (ord_seq.NEXTVAL, 'Valid Order');` và `COMMIT;`. Hỏi đơn hàng `'Valid Order'` sẽ mang mã số bao nhiêu?**

* A. `101` (vì lệnh `ROLLBACK` đã trả lại số `101` về cho Sequence `ord_seq`).
* B. `102` (vì việc tăng số của Sequence độc lập với Transaction nên lệnh `ROLLBACK` không hoàn trả lại số `101`, tạo ra khoảng hổng Gap tại số `101`).
* C. `100`.
* D. Báo lỗi vì không thể gọi `NEXTVAL` ngay sau lệnh `ROLLBACK`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Cơ chế cấp số của `SEQUENCE` nằm ngoài phạm vi kiểm soát hoàn tác của Transaction nhằm đảm bảo hiệu năng đồng thời cao nhất (các Session khác không phải chờ bạn Commit mới lấy được số tiếp theo). Do đó, một khi `ord_seq.NEXTVAL` đã cấp ra số `101`, dù giao dịch của bạn bị **`ROLLBACK`** (hoặc câu lệnh `INSERT` bị lỗi), số `101` sẽ **mất vĩnh viễn** và lần gọi `NEXTVAL` kế tiếp sẽ trả về **`102`**! Đây là nguyên nhân phổ biến nhất gây ra hiện tượng nhảy số (Sequence Gap).
  * **A, C, D sai:** `ROLLBACK` không bao giờ lùi giá trị của Sequence về số cũ.
</details>

---

### Câu 15 (Question 15)
**Trong cơ sở dữ liệu hiện đang có:**
1. Một bảng `HR.CUSTOMERS` có **500 dòng** (và đã cấp quyền `SELECT` cho `PUBLIC`).
2. Một `PUBLIC SYNONYM` tên là **`CUST`** trỏ tới bảng `HR.CUSTOMERS`.
3. User `SCOTT` tự tạo trong Schema của mình một bảng tên là `SCOTT.LOCAL_CUST` có **10 dòng**, và tạo một `PRIVATE SYNONYM` cũng tên là **`CUST`** trỏ tới `SCOTT.LOCAL_CUST`.

**Khi User `SCOTT` đăng nhập và thực thi câu lệnh `SELECT COUNT(*) FROM cust;`, kết quả trả về sẽ là bao nhiêu?**

```sql
-- PUBLIC SYNONYM: CUST -> HR.CUSTOMERS (500 dòng)
-- SCOTT's PRIVATE SYNONYM: CUST -> SCOTT.LOCAL_CUST (10 dòng)
-- User SCOTT chạy:
SELECT COUNT(*) FROM cust;
```

* A. `500` (vì `PUBLIC SYNONYM` luôn được ưu tiên cao hơn `PRIVATE SYNONYM`).
* B. `10` (vì đối tượng thuộc Schema của chính User hiện tại — bao gồm cả `PRIVATE SYNONYM` — luôn được ưu tiên phân giải trước `PUBLIC SYNONYM`).
* C. `510` (tổng hợp cả hai).
* D. Báo lỗi `ORA-00918: column ambiguously defined` vì trùng tên `CUST`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Theo quy tắc **Thứ tự ưu tiên phân giải tên đối tượng (Name Resolution Precedence)** của Oracle: Khi một câu lệnh SQL tham chiếu đến một tên không có tiền tố Schema (`cust`), Oracle luôn tìm kiếm trong **Namespace của chính Schema hiện tại (`SCOTT`) trước tiên**! Vì trong Schema `SCOTT` có một `PRIVATE SYNONYM` tên là `CUST` (trỏ tới `SCOTT.LOCAL_CUST` có 10 dòng), Oracle sẽ chọn ngay đối tượng này và trả về **`10`**, hoàn toàn bỏ qua `PUBLIC SYNONYM` cùng tên!Chỉ khi trong Schema `SCOTT` không có Table, View, Sequence hay Private Synonym nào tên là `CUST` thì Oracle mới tìm đến `PUBLIC SYNONYM`.
  * **A, C, D sai:** `PRIVATE SYNONYM` và `PUBLIC SYNONYM` nằm ở 2 Namespace khác nhau nên được phép trùng tên, và Private luôn thắng Public.
</details>

---

### Câu 16 (Question 16)
**Quản trị viên (DBA) thực thi câu lệnh: `CREATE PUBLIC SYNONYM emp_pub FOR hr.employees;`. User `ALICE` chỉ mới được cấp quyền `CREATE SESSION` (chưa được cấp bất kỳ quyền đối tượng nào trên `hr.employees`). Điều gì sẽ xảy ra khi `ALICE` đăng nhập và chạy lệnh `SELECT * FROM emp_pub;`?**

* A. `ALICE` xem được toàn bộ dữ liệu của bảng `hr.employees` vì `PUBLIC SYNONYM` tự động cho phép mọi người dùng đọc dữ liệu.
* B. Câu lệnh thất bại và báo lỗi `ORA-00942: table or view does not exist` vì `PUBLIC SYNONYM` chỉ là tên gọi tắt chứ hoàn toàn không cấp quyền truy cập vào bảng gốc `hr.employees`.
* C. `ALICE` chỉ xem được cấu trúc cột của bảng nhưng thấy `0` dòng dữ liệu.
* D. `ALICE` phải thêm tiền tố `PUBLIC.emp_pub` thì mới truy vấn được.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Một `SYNONYM` (dù là `PRIVATE` hay `PUBLIC`) chỉ đơn thuần là một con trỏ định danh (bí danh), **không bao giờ thay thế cho việc phân quyền (`GRANT`)**! Để `ALICE` có thể truy vấn qua `emp_pub`, chủ sở hữu `HR` (hoặc DBA) bắt buộc phải cấp quyền `GRANT SELECT ON hr.employees TO alice;` (hoặc `TO PUBLIC`). Nếu chưa có quyền trên bảng đích, `ALICE` sẽ nhận lỗi `ORA-00942`.
  * **A, C, D sai:** Không bao giờ viết tiền tố `PUBLIC.` trước tên của một `PUBLIC SYNONYM`.
</details>

---

### Câu 17 (Question 17)
**Sự khác biệt chính xác nhất giữa hai từ điển dữ liệu `USER_TABLES` và `ALL_TABLES` là gì?**

* A. `USER_TABLES` hiển thị các bảng của người dùng hiện tại, còn `ALL_TABLES` hiển thị toàn bộ tất cả các bảng có trong cơ sở dữ liệu (tương đương `DBA_TABLES`).
* B. `USER_TABLES` chỉ hiển thị các bảng do User hiện tại sở hữu (và không có cột `OWNER`), còn `ALL_TABLES` hiển thị các bảng do User hiện tại sở hữu **CỘNG VỚI** các bảng của Schema khác mà User hiện tại được cấp quyền truy cập (và có cột `OWNER`).
* C. `ALL_TABLES` chỉ hiển thị các bảng của người khác mà User hiện tại được cấp quyền, không bao gồm các bảng do chính User hiện tại sở hữu.
* D. `USER_TABLES` có cột `OWNER`, còn `ALL_TABLES` không có cột `OWNER`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * **`USER_TABLES`**: Chứa danh sách các bảng thuộc sở hữu của riêng Schema hiện tại. Vì tất cả đều thuộc chính bạn nên `USER_TABLES` **không có cột `OWNER`**.
    * **`ALL_TABLES`**: Chứa tập hợp tất cả các bảng mà bạn có quyền thao tác, bao gồm **cả các bảng của chính bạn (`USER_TABLES`) lẫn các bảng của User khác mà bạn được Grant quyền** (trực tiếp, qua Role, hoặc qua `PUBLIC`). Do đến từ nhiều Schema nên `ALL_TABLES` luôn có cột **`OWNER`**.
  * **A sai:** Chỉ `DBA_TABLES` mới chứa toàn bộ các bảng trong toàn Database.
  * **C sai:** Tập kết quả của `USER_TABLES` luôn là một tập con của `ALL_TABLES`!
  * **D sai:** Ngược lại hoàn toàn về cột `OWNER`.
</details>

---

### Câu 18 (Question 18)
**Nhóm View nào trong Oracle Database dùng để theo dõi trạng thái hoạt động thời gian thực của Instance (như các phiên kết nối hiện tại, các khóa đang giữ, các câu lệnh SQL đang chạy trong bộ nhớ) và được cập nhật liên tục bởi hệ thống trong quá trình cơ sở dữ liệu vận hành?**

* A. Các View có tiền tố `USER_*`
* B. Các View có tiền tố `ALL_*`
* C. Các View có tiền tố `V$*` (Dynamic Performance Views)
* D. View `DICTIONARY` (`DICT`)

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Các **Dynamic Performance Views** có tiền tố **`V$`** (như `V$SESSION`, `V$TRANSACTION`, `V$LOCK`, `V$SQL`, `V$INSTANCE`, `V$DATABASE`) đọc dữ liệu trực tiếp từ các cấu trúc bộ nhớ nội bộ của Instance (`X$` tables) và Control File. Chúng phản ánh trạng thái vận hành theo thời gian thực và dữ liệu thống kê của chúng được khởi tạo lại mỗi khi Instance khởi động.
  * **A, B, D sai:** `USER_*`, `ALL_*`, `DBA_*` và `DICTIONARY` là các Data Dictionary Views tĩnh lưu trữ metadata cấu trúc trên đĩa (trong `SYSTEM`/`SYSAUX` tablespace).
</details>

---

### Câu 19 (Question 19)
**Một tài khoản người dùng mới tên là `DEV01` vừa được tạo bằng câu lệnh `CREATE USER dev01 IDENTIFIED BY secret123;`. Quyền hệ thống (System Privilege) tối thiểu nào BẮT BUỘC phải được cấp cho `DEV01` để người dùng này có thể đăng nhập (kết nối) vào cơ sở dữ liệu Oracle?**

* A. `CREATE USER`
* B. `CREATE CONNECTION`
* C. `CREATE SESSION`
* D. `CONNECT DATABASE`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Một User mới tạo bằng `CREATE USER` chưa có bất kỳ quyền gì, kể cả quyền đăng nhập! Để có thể kết nối vào Oracle Database, User bắt buộc phải được cấp quyền hệ thống **`CREATE SESSION`** (`GRANT CREATE SESSION TO dev01;`). Nếu chưa có quyền này, khi đăng nhập sẽ bị lỗi `ORA-01045: user DEV01 lacks CREATE SESSION privilege; logon denied`.
  * **A, B, D sai:** `CREATE CONNECTION` và `CONNECT DATABASE` không phải là tên quyền hợp lệ trong Oracle.
</details>

---

### Câu 20 (Question 20)
**User `DEV01` đã được cấp quyền hệ thống `CREATE TABLE` và đã được cấp hạn ngạch dung lượng (`QUOTA UNLIMITED ON users`). `DEV01` tạo bảng `ORDERS` trong Schema của mình. Bây giờ `DEV01` muốn tạo thêm một chỉ mục `B-Tree Index` trên bảng `ORDERS` đó. `DEV01` cần được cấp thêm quyền nào nữa không?**

* A. Cần được cấp thêm quyền hệ thống `CREATE INDEX`.
* B. Cần được cấp thêm quyền đối tượng `INDEX ON orders`.
* C. Không cần cấp thêm quyền nào cả; quyền hệ thống `CREATE TABLE` đã tự động cho phép chủ sở hữu tạo `INDEX` (cũng như `ALTER` và `DROP`) trên các bảng thuộc Schema của chính mình.
* D. Cần được cấp thêm quyền `CREATE ANY INDEX`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là một bẫy rất hay trong đề thi OCA 1Z0-071! Trong Oracle Database **KHÔNG TỒN TẠI quyền hệ thống tên là `CREATE INDEX`**! Một khi bạn sở hữu một bảng trong Schema của mình (nhờ quyền `CREATE TABLE`), bạn nghiễm nhiên có toàn quyền tạo `INDEX` trên bảng đó, sửa cấu trúc (`ALTER TABLE`), xóa bảng (`DROP TABLE`), làm rỗng bảng (`TRUNCATE TABLE`), cũng như toàn quyền DML (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) trên bảng của mình.
  * **A sai:** Không có quyền hệ thống `CREATE INDEX`.
  * **B, D sai:** Quyền đối tượng `GRANT INDEX ON tab` và quyền hệ thống `CREATE ANY INDEX` chỉ dùng khi một User muốn tạo Index trên bảng thuộc sở hữu của **User khác**!
</details>

---

### Câu 21 (Question 21)
**Chủ sở hữu bảng `EMPLOYEES` muốn phân quyền cho User `INTERN` trên một số cột cụ thể của bảng `EMPLOYEES`. Câu lệnh `GRANT` nào dưới đây là HỢP LỆ về mặt cú pháp trong Oracle SQL?**

```sql
-- Bảng EMPLOYEES (emp_id, full_name, email, salary, phone)
```

* A. `GRANT SELECT (emp_id, full_name, email) ON employees TO intern;`
* B. `GRANT UPDATE (email, phone), INSERT (emp_id, full_name) ON employees TO intern;`
* C. `GRANT DELETE (phone) ON employees TO intern;`
* D. Cả A và B đều hợp lệ.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong Oracle Database, việc cấp quyền đối tượng ở **mức cột (Column-level Object Privileges)** chỉ được hỗ trợ cho đúng **3 quyền**: **`INSERT (cols)`**, **`UPDATE (cols)`**, và **`REFERENCES (cols)`**! Do đó câu lệnh B hoàn toàn hợp lệ.
  * **A, C, D sai:** Oracle **TUYỆT ĐỐI KHÔNG cho phép cấp quyền `SELECT` hay `DELETE` ở mức cột**! Nếu viết `GRANT SELECT (emp_id, full_name) ON employees TO intern;`, Oracle sẽ báo lỗi cú pháp `ORA-00969: missing ON keyword`. Để giới hạn các cột mà `intern` được phép đọc (`SELECT`), bạn bắt buộc phải tạo một **`VIEW`** chỉ chứa các cột đó rồi cấp quyền `GRANT SELECT ON view_name TO intern;`.
</details>

---

### Câu 22 (Question 22)
**Xem xét kịch bản cấp và thu hồi quyền hệ thống (System Privilege) dưới đây:**
1. `DBA` thực thi: `GRANT CREATE VIEW TO manager WITH ADMIN OPTION;`
2. `MANAGER` thực thi: `GRANT CREATE VIEW TO staff;`
3. `STAFF` tạo một View tên là `V_REPORT`.
4. `DBA` thực thi: `REVOKE CREATE VIEW FROM manager;`

**Sau khi bước 4 hoàn tất, phát biểu nào sau đây là ĐÚNG về quyền của `STAFF` và View `V_REPORT`?**

* A. `STAFF` bị mất quyền `CREATE VIEW` và View `V_REPORT` bị xóa tự động.
* B. `STAFF` bị mất quyền `CREATE VIEW`, nhưng View `V_REPORT` vẫn tồn tại.
* C. `STAFF` **vẫn giữ nguyên quyền `CREATE VIEW`** (có thể tiếp tục tạo các View mới) và View `V_REPORT` vẫn tồn tại hoàn toàn bình thường.
* D. Câu lệnh `REVOKE` ở bước 4 bị báo lỗi vì `MANAGER` đã cấp quyền cho người khác.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Quy tắc vàng bắt buộc phải nhớ: Khi thu hồi một **System Privilege** (hoặc một **Role**) đã được cấp kèm mệnh đề **`WITH ADMIN OPTION`**, việc thu hồi **KHÔNG BAO GIỜ có hiệu ứng dây chuyền (No Cascading Revoke)**! Do đó, khi `DBA` thu hồi quyền `CREATE VIEW` từ `MANAGER`, chỉ một mình `MANAGER` mất quyền `CREATE VIEW`, còn `STAFF` **vẫn giữ nguyên quyền `CREATE VIEW`** và các đối tượng đã tạo (`V_REPORT`) hoàn toàn không bị ảnh hưởng.
  * **A, B, D sai:** Nhầm lẫn với hành vi thu hồi dây chuyền của `WITH GRANT OPTION` (vốn chỉ dành cho Object Privileges).
</details>

---

### Câu 23 (Question 23)
**Ngược lại với Câu 22, hãy xem xét kịch bản cấp và thu hồi quyền đối tượng (Object Privilege) dưới đây:**
1. User `HR` thực thi: `GRANT SELECT, UPDATE ON hr.employees TO manager WITH GRANT OPTION;`
2. User `MANAGER` thực thi: `GRANT SELECT, UPDATE ON hr.employees TO staff;`
3. User `HR` thực thi: `REVOKE SELECT, UPDATE ON hr.employees FROM manager;`

**Sau khi bước 3 hoàn tất, điều gì xảy ra với quyền của `STAFF` trên bảng `hr.employees`?**

* A. `STAFF` vẫn giữ nguyên quyền `SELECT` và `UPDATE` trên bảng `hr.employees`.
* B. `STAFF` vẫn giữ quyền `SELECT`, chỉ bị mất quyền `UPDATE`.
* C. `STAFF` **bị thu hồi tự động (mất hoàn toàn)** cả quyền `SELECT` và `UPDATE` trên bảng `hr.employees` theo cơ chế thu hồi dây chuyền (Cascading Revoke).
* D. Chỉ riêng `MANAGER` mới có quyền thu hồi quyền từ `STAFF`, nên lệnh của `HR` ở bước 3 bị từ chối.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đối với **Object Privileges** được chuyển tiếp thông qua mệnh đề **`WITH GRANT OPTION`**, khi quyền bị thu hồi (`REVOKE`) từ người trung gian (`MANAGER`), Oracle sẽ **tự động thực hiện thu hồi dây chuyền (Cascading Revoke)** đối với tất cả những người dùng đã nhận quyền từ `MANAGER` (kể cả `STAFF` và bất kỳ ai nhận tiếp từ `STAFF`)!
  * **A, B, D sai:** Sự đối lập giữa Câu 22 (`WITH ADMIN OPTION` → Không dây chuyền) và Câu 23 (`WITH GRANT OPTION` → Có dây chuyền) là nội dung trọng tâm bậc nhất của chương Phân quyền trong đề thi 1Z0-071.
</details>

---

### Câu 24 (Question 24)
**Phát biểu nào sau đây là ĐÚNG khi nói về Nhóm quyền (`ROLE`) trong Oracle Database?**

* A. Một `ROLE` chỉ có thể chứa các System Privileges, không thể chứa các Object Privileges.
* B. Bạn có thể cấp một Object Privilege cho một `ROLE` kèm theo mệnh đề `WITH GRANT OPTION` (ví dụ: `GRANT SELECT ON emp TO my_role WITH GRANT OPTION;`).
* C. Một `ROLE` có thể chứa cả System Privileges, Object Privileges, và có thể được gán cho một `ROLE` khác; nhưng không được phép cấp quyền với `WITH GRANT OPTION` cho một `ROLE`.
* D. Tên của một `ROLE` có thể đặt trùng với tên của một `USER` đang tồn tại trong cơ sở dữ liệu.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Một `ROLE` cực kỳ linh hoạt: nó có thể gom nhóm cả System Privileges, Object Privileges, và thậm chí chứa các `ROLE` con khác (trừ việc không được tạo vòng lặp cấp ngược lại cho chính nó). Tuy nhiên, Oracle cấm cấp một Object Privilege kèm mệnh đề `WITH GRANT OPTION` cho một `ROLE` (`ORA-01926: cannot GRANT to a role WITH GRANT OPTION`).
  * **A, B sai:** Role chứa được Object Privileges nhưng không được kèm `WITH GRANT OPTION`.
  * **D sai:** Tên `USER` và tên `ROLE` dùng chung một Namespace cấp toàn cục (Database-level), nên không bao giờ được phép đặt tên `ROLE` trùng với tên `USER` đã có.
</details>

---

### Câu 25 (Question 25)
**User `SCOTT` đã được cấp quyền hệ thống `CREATE VIEW` trực tiếp. Кроме đó, `SCOTT` được gán một Role tên là `HR_READ_ROLE` (trong đó `HR_READ_ROLE` đã được cấp quyền `SELECT ON hr.employees`). Tuy nhiên, khi `SCOTT` chạy câu lệnh: `CREATE VIEW v_emp_scott AS SELECT * FROM hr.employees;`, Oracle lại báo lỗi `ORA-01031: insufficient privileges` (trong khi `SCOTT` chạy `SELECT * FROM hr.employees;` đơn lẻ thì vẫn xem được dữ liệu bình thường). Nguyên nhân của lỗi này là gì?**

* A. Role `HR_READ_ROLE` chưa được kích hoạt trong phiên làm việc của `SCOTT`.
* B. Không thể tạo View dựa trên bảng thuộc Schema của người dùng khác.
* C. Để tạo một đối tượng lưu trữ cố định như `VIEW` (hoặc PL/SQL Definer's Rights Procedure) tham chiếu đến bảng của người khác, User bắt buộc phải được cấp quyền `SELECT ON hr.employees` **trực tiếp cho chính User đó** (hoặc cho `PUBLIC`), chứ không thể dùng quyền đối tượng nhận thông qua một `ROLE`.
* D. `SCOTT` thiếu quyền `CREATE ANY VIEW`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong kiến trúc bảo mật của Oracle, các quyền nhận được thông qua `ROLE` có tính chất biến động (có thể bật/tắt theo phiên bằng `SET ROLE`), nên khi biên dịch và lưu trữ các đối tượng cố định như **`VIEW`** (hoặc các khối thủ tục PL/SQL mặc định), Oracle không chấp nhận quyền đối tượng kế thừa qua `ROLE`! Để `SCOTT` tạo được View `v_emp_scott` truy vấn bảng `hr.employees`, chủ sở hữu `HR` (hoặc DBA) bắt buộc phải cấp trực tiếp: `GRANT SELECT ON hr.employees TO scott;` (hoặc `TO PUBLIC`).
  * **A sai:** Vì đề bài đã nêu rõ `SCOTT` vẫn chạy `SELECT * FROM hr.employees;` xem được dữ liệu bình thường, chứng tỏ Role đang bật.
  * **B, D sai:** Hoàn toàn tạo được View trên bảng của Schema khác nếu được Grant trực tiếp, và tạo View trong chính Schema của `SCOTT` chỉ cần quyền `CREATE VIEW` chứ không cần `CREATE ANY VIEW`.
</details>

---
