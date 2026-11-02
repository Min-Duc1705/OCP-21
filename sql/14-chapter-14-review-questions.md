# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 14: Truy Vấn Con Nâng Cao & CTE

> **Thuộc Phần II:** Oracle SQL Nâng Cao (Advanced Oracle SQL for Developers)  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle OCA/OCP & Tuyển dụng VNPT/Viettel/Ngân hàng.  
> **Cách học:** Hãy đọc kỹ đề bài và phân tích mã lệnh SQL trước khi mở phần **"👉 Xem Đáp Án & Giải Thích Chi Tiết"**.

---

### Câu 1 (Question 1)
**Khi khai báo nhiều khối truy vấn con trong mệnh đề `WITH` (Subquery Factoring) của một câu lệnh `SELECT`, phát biểu nào sau đây là ĐÚNG?**

* A. Phải lặp lại từ khóa `WITH` trước mỗi tên khối truy vấn con.
* B. Khối truy vấn con đứng trước có thể tham chiếu trực tiếp đến tên của khối truy vấn con được khai báo đứng sau nó.
* C. Từ khóa `WITH` chỉ xuất hiện một lần ở đầu, các khối ngăn cách nhau bằng dấu phẩy và khối đứng sau có thể tham chiếu đến khối đứng trước nó.
* D. Mọi khối truy vấn con được khai báo trong mệnh đề `WITH` đều bắt buộc phải lưu dữ liệu vật lý vĩnh viễn vào `SYSTEM` tablespace.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong một mệnh đề `WITH` chứa nhiều CTE (`WITH cte1 AS (...), cte2 AS (...) SELECT ...`), từ khóa `WITH` chỉ được viết **duy nhất 1 lần**, các CTE phân tách nhau bằng dấu phẩy `,`. Khối khai báo sau (`cte2`) hoàn toàn có quyền truy vấn từ khối đã khai báo phía trước nó (`cte1`).
  * **A sai:** Viết lặp lại từ khóa `WITH` cho CTE thứ hai sẽ gây lỗi cú pháp `ORA-00928: missing SELECT keyword`.
  * **B sai:** Oracle không cho phép tham chiếu tiến (forward reference) — khối đứng trước không thể gọi khối khai báo sau nó.
  * **D sai:** Kết quả của CTE không bao giờ lưu vĩnh viễn vào `SYSTEM` tablespace; nếu được vật chất hóa (`MATERIALIZE`), dữ liệu tạm chỉ nằm trên `TEMP` tablespace trong phạm vi thực thi câu lệnh.
</details>

---

### Câu 2 (Question 2)
**Xem xét câu lệnh SQL dưới đây. Điều gì sẽ xảy ra khi thực thi câu lệnh này trên Oracle Database?**

```sql
WITH
    dept_sal AS (
        SELECT department_id, SUM(salary) AS total_sal
        FROM employees
        GROUP BY department_id
    ),
    unused_cte AS (
        SELECT job_id, COUNT(*) AS cnt
        FROM employees
        GROUP BY job_id
    )
SELECT department_id, total_sal
FROM dept_sal
WHERE total_sal > 15000;
```

* A. Câu lệnh thực thi thành công và tự động bỏ qua `unused_cte` mà không báo lỗi.
* B. Câu lệnh báo lỗi `ORA-32035: unreferenced query name defined in WITH clause` vì `unused_cte` không được tham chiếu ở đâu.
* C. Câu lệnh báo lỗi vì một mệnh đề `WITH` chỉ được phép chứa tối đa 1 khối truy vấn con.
* D. Câu lệnh thực thi thành công và trả về kết quả gộp (Cartesian Product) của cả `dept_sal` và `unused_cte`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong Oracle SQL, mọi CTE được định nghĩa trong mệnh đề `WITH` bắt buộc phải được tham chiếu ít nhất 1 lần (trong câu truy vấn chính hoặc trong một CTE khác mà cuối cùng được dùng bởi truy vấn chính). Vì `unused_cte` hoàn toàn không được gọi tới, Oracle ném lỗi biên dịch **`ORA-32035: unreferenced query name defined in WITH clause`**.
  * **A, C, D sai:** Đây là bẫy rất phổ biến khi lập trình viên viết nháp nhiều CTE để test rồi quên xóa CTE thừa.
</details>

---

### Câu 3 (Question 3)
**Trong bộ tối ưu hóa chi phí của Oracle (CBO), sự khác biệt cốt lõi giữa hai chiến lược xử lý CTE là `/*+ MATERIALIZE */` và `/*+ INLINE */` là gì?**

* A. `MATERIALIZE` tự động tạo một Materialized View vĩnh viễn trong schema, còn `INLINE` tạo một Normal View.
* B. `MATERIALIZE` thực thi CTE một lần và lưu kết quả tạm thời vào Global Temporary Table ngầm định trên `TEMP` tablespace, còn `INLINE` gộp trực tiếp câu lệnh của CTE vào câu truy vấn chính.
* C. `MATERIALIZE` chỉ dùng được cho câu lệnh `DELETE`, còn `INLINE` chỉ dùng được cho câu lệnh `SELECT`.
* D. `INLINE` luôn chạy nhanh hơn `MATERIALIZE` trong mọi trường hợp kể cả khi CTE được gọi 10 lần.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi dùng chiến lược `MATERIALIZE` (thường được CBO tự chọn khi CTE được tham chiếu $\ge 2$ lần), Oracle thực hiện `TEMP TABLE TRANSFORMATION` (`LOAD AS SELECT`) ghi kết quả CTE vào bảng tạm trên `TEMP` tablespace để đọc lại nhiều lần mà không phải tính toán lại. Ngược lại, `INLINE` trộn thẳng định nghĩa SQL của CTE vào truy vấn chính như một Inline View thông thường.
  * **A sai:** `MATERIALIZE` trong CTE hoàn toàn không tạo đối tượng `MATERIALIZED VIEW` trong Data Dictionary.
  * **C, D sai:** Khi CTE phức tạp được gọi nhiều lần, `MATERIALIZE` giúp tránh phải quét bảng và `GROUP BY` lặp lại nhiều lần nên nhanh hơn rất nhiều so với `INLINE`.
</details>

---

### Câu 4 (Question 4)
**Khi viết một CTE đệ quy (Recursive Subquery Factoring) trong Oracle SQL, toán tử tập hợp nào BẮT BUỘC phải được sử dụng để nối giữa nhánh khởi tạo (Anchor Member) và nhánh đệ quy (Recursive Member)?**

* A. `UNION`
* B. `UNION ALL`
* C. `INTERSECT`
* D. `MINUS`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Theo quy định cú pháp của Oracle cho Recursive WITH clause, nhánh Anchor Member và nhánh Recursive Member **bắt buộc phải được nối với nhau bằng `UNION ALL`**.
  * **A, C, D sai:** Nếu dùng `UNION`, `INTERSECT` hoặc `MINUS` để nối nhánh đệ quy, Oracle sẽ lập tức báo lỗi `ORA-32040: recursive WITH clause must use a UNION ALL operation`.
</details>

---

### Câu 5 (Question 5)
**Xem xét đoạn mã CTE đệ quy dưới đây. Tại sao câu lệnh này lại báo lỗi khi thực thi?**

```sql
WITH emp_hierarchy AS (
    SELECT employee_id, first_name, manager_id, 1 AS lvl
    FROM employees
    WHERE manager_id IS NULL
    UNION ALL
    SELECT e.employee_id, e.first_name, e.manager_id, eh.lvl + 1
    FROM employees e
    JOIN emp_hierarchy eh ON e.manager_id = eh.employee_id
)
SELECT * FROM emp_hierarchy;
```

* A. Vì CTE đệ quy bắt buộc phải khai báo danh sách bí danh cột (column alias list) trong cặp ngoặc đơn ngay sau tên `emp_hierarchy`.
* B. Vì không được phép cộng thêm `1` vào cột `eh.lvl` trong nhánh đệ quy.
* C. Vì trong nhánh đệ quy không được phép sử dụng cú pháp ANSI `JOIN ... ON`.
* D. Vì điều kiện `WHERE manager_id IS NULL` không được phép xuất hiện trong nhánh Anchor Member.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Khác với CTE thông thường (danh sách cột là tùy chọn), một **CTE đệ quy bắt buộc phải khai báo danh sách tên cột** ngay sau tên CTE, ví dụ: `WITH emp_hierarchy (employee_id, first_name, manager_id, lvl) AS (...)`. Nếu bỏ quên, Oracle sẽ báo lỗi `ORA-32039: recursive WITH clause must have column alias list`.
  * **B, C, D sai:** Cộng cấp bậc `eh.lvl + 1`, dùng `JOIN ... ON` và lọc `WHERE manager_id IS NULL` ở nhánh neo đều hoàn toàn chuẩn xác.
</details>

---

### Câu 6 (Question 6)
**Thành phần nào sau đây BỊ CẤM xuất hiện bên trong nhánh đệ quy (Recursive Member) của một Recursive CTE trong Oracle?**

* A. Phép kết nối nội (`INNER JOIN`) giữa bảng vật lý và tên CTE đệ quy.
* B. Mệnh đề lọc `WHERE` để giới hạn độ sâu của cây đệ quy.
* C. Từ khóa `DISTINCT`, mệnh đề `GROUP BY`, hoặc các hàm phân tích (`Analytic Functions`).
* D. Các biểu thức nối chuỗi (`||`) hoặc phép toán số học (`+`, `-`).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong nhánh Recursive Member, Oracle cấm sử dụng `DISTINCT`, `GROUP BY`, `HAVING`, các hàm tổng hợp (`SUM`, `COUNT`...), và các hàm phân tích (`ROW_NUMBER() OVER(...)`). Nếu cần dùng các hàm này, bạn phải đặt chúng ở câu truy vấn `SELECT` ngoài cùng đọc từ CTE.
  * **A, B, D sai:** Đều là các thành phần hợp lệ và thường xuyên được dùng trong nhánh đệ quy.
</details>

---

### Câu 7 (Question 7)
**Trong một CTE đệ quy, bạn muốn duyệt cây phân cấp theo nguyên tắc: đi sâu hết toàn bộ các nhánh con cháu của một nút rồi mới quay lại duyệt sang nút anh em kế tiếp (giống thứ tự mặc định của `CONNECT BY`). Bạn cần sử dụng mệnh đề nào?**

* A. `SEARCH BREADTH FIRST BY col_name SET order_col`
* B. `SEARCH DEPTH FIRST BY col_name SET order_col`
* C. `ORDER SIBLINGS BY col_name`
* D. `CYCLE col_name SET order_col TO 1 DEFAULT 0`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** `SEARCH DEPTH FIRST BY ... SET order_col` chỉ định thứ tự duyệt theo **chiều sâu** (Depth-First Search), giúp hiển thị cấu trúc cây phân cấp chuẩn từ cha xuống con cháu trực thuộc trước khi chuyển sang nhánh ngang hàng.
  * **A sai:** `SEARCH BREADTH FIRST` duyệt theo **chiều rộng** (hết toàn bộ tầng 1, rồi hết toàn bộ tầng 2, rồi mới tới tầng 3).
  * **C sai:** `ORDER SIBLINGS BY` là cú pháp dành riêng cho truy vấn `CONNECT BY`, không dùng trực tiếp để điều khiển thứ tự duyệt của Recursive CTE.
  * **D sai:** Mệnh đề `CYCLE` dùng để phát hiện vòng lặp vô hạn chứ không phải điều khiển thứ tự duyệt cây.
</details>

---

### Câu 8 (Question 8)
**Khi sử dụng đồng thời cả hai mệnh đề `SEARCH` và `CYCLE` trong một Recursive CTE, thứ tự đặt vị trí nào sau đây là hợp lệ theo cú pháp Oracle SQL?**

```sql
WITH org_cte (emp_id, mgr_id, lvl) AS (
    SELECT employee_id, manager_id, 1 FROM employees WHERE manager_id IS NULL
    UNION ALL
    SELECT e.employee_id, e.manager_id, c.lvl + 1
    FROM employees e JOIN org_cte c ON e.manager_id = c.emp_id
)
-- [VỊ TRÍ CẦN ĐIỀN]
SELECT * FROM org_cte ORDER BY seq_num;
```

* A. Đặt mệnh đề `CYCLE` trước, sau đó mới đến mệnh đề `SEARCH` ngay bên dưới dấu đóng ngoặc `)` của CTE.
* B. Đặt mệnh đề `SEARCH` trước, sau đó đến mệnh đề `CYCLE` ngay bên dưới dấu đóng ngoặc `)` của CTE.
* C. Đặt cả `SEARCH` và `CYCLE` vào bên trong nhánh Anchor Member.
* D. Đặt cả `SEARCH` và `CYCLE` ở cuối cùng của câu lệnh, sau mệnh đề `ORDER BY`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong cấu trúc Recursive Subquery Factoring, cả `SEARCH` và `CYCLE` đều được đặt ngay sau dấu đóng ngoặc `)` của khối CTE (trước từ khóa `SELECT` của truy vấn chính), và **`SEARCH` bắt buộc phải đứng trước `CYCLE`**:
    ```sql
    SEARCH DEPTH FIRST BY emp_id SET seq_num
    CYCLE emp_id SET is_cycle TO 'Y' DEFAULT 'N'
    ```
  * **A, C, D sai:** Đặt sai vị trí hoặc đảo `CYCLE` lên trước `SEARCH` sẽ gây lỗi cú pháp SQL.
</details>

---

### Câu 9 (Question 9)
**Bảng `EMPLOYEES` có 100 dòng dữ liệu với cột `SALARY` có các giá trị khác nhau. Câu truy vấn nào dưới đây trả về ĐÚNG 5 nhân viên có mức lương cao nhất?**

* A. `SELECT first_name, salary FROM employees WHERE ROWNUM <= 5 ORDER BY salary DESC;`
* B. `SELECT first_name, salary FROM employees ORDER BY salary DESC WHERE ROWNUM <= 5;`
* C. `SELECT first_name, salary FROM (SELECT first_name, salary FROM employees ORDER BY salary DESC) WHERE ROWNUM <= 5;`
* D. `SELECT first_name, salary FROM (SELECT first_name, salary FROM employees ORDER BY salary DESC) WHERE ROWNUM = 5;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Inline View bên trong thực hiện sắp xếp toàn bộ bảng theo `salary DESC` trước, sau đó truy vấn bên ngoài dùng `WHERE ROWNUM <= 5` để cắt lấy đúng 5 dòng đầu tiên của tập đã sắp xếp.
  * **A sai:** Đây là bẫy kinh điển! `ROWNUM` được gán trong pha `WHERE` **trước khi** `ORDER BY` chạy. Câu A sẽ lấy 5 dòng bất kỳ đầu tiên đọc được từ bảng rồi mới sắp xếp 5 dòng đó.
  * **B sai:** Lỗi cú pháp vì mệnh đề `WHERE` không bao giờ được đứng sau `ORDER BY`.
  * **D sai:** `WHERE ROWNUM = 5` luôn trả về **0 dòng** vì `ROWNUM` luôn bắt đầu gán từ `1`; khi dòng đầu tiên (`ROWNUM = 1`) bị loại do `1 != 5`, dòng tiếp theo lại được thử gán `ROWNUM = 1` và bị loại tiếp.
</details>

---

### Câu 10 (Question 10)
**Bảng `PRODUCTS` có 20 dòng dữ liệu. Bạn thực thi câu lệnh dưới đây. Kết quả trả về sẽ có bao nhiêu dòng?**

```sql
SELECT product_id, product_name, list_price
FROM (
    SELECT product_id, product_name, list_price
    FROM products
    ORDER BY list_price DESC
)
WHERE ROWNUM BETWEEN 6 AND 10;
```

* A. 5 dòng (từ dòng thứ 6 đến dòng thứ 10 có giá cao nhất).
* B. 4 dòng.
* C. 0 dòng (Không có dòng nào được trả về).
* D. Lỗi cú pháp `ORA-00936` vì `ROWNUM` không được dùng với toán tử `BETWEEN`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** `ROWNUM` là giả cột được đánh số tăng dần từ `1` chỉ khi dòng trước đó đã thỏa mãn điều kiện `WHERE`. Với điều kiện `ROWNUM BETWEEN 6 AND 10`, dòng đầu tiên đọc ra từ Inline View được gán tạm `ROWNUM = 1`, kiểm tra `1 BETWEEN 6 AND 10` $\rightarrow$ `FALSE` nên bị loại bỏ. Dòng thứ hai đọc ra lại được gán tạm `ROWNUM = 1` và tiếp tục bị loại bỏ. Do đó kết quả trả về **0 dòng**!
  * **A, B, D sai:** Để phân trang lấy từ dòng 6 đến 10 bằng `ROWNUM`, bắt buộc phải gán bí danh `ROWNUM AS rnum` bên trong một Inline View rồi mới lọc `WHERE rnum BETWEEN 6 AND 10` ở truy vấn ngoài cùng.
</details>

---

### Câu 11 (Question 11)
**Cho bảng `SCORES` gồm 5 dòng dữ liệu có điểm số (`POINTS`) lần lượt là: `100`, `95`, `90`, `90`, `85`. Khi thực thi câu lệnh dưới đây, có bao nhiêu dòng được trả về?**

```sql
SELECT points
FROM scores
ORDER BY points DESC
FETCH FIRST 3 ROWS WITH TIES;
```

* A. 3 dòng (`100`, `95`, `90`).
* B. 4 dòng (`100`, `95`, `90`, `90`).
* C. 5 dòng (`100`, `95`, `90`, `90`, `85`).
* D. 2 dòng (`100`, `95`).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Mệnh đề `FETCH FIRST 3 ROWS WITH TIES` lấy 3 dòng đầu tiên theo thứ tự `points DESC` (`100`, `95`, `90`), đồng thời nhờ tùy chọn **`WITH TIES`**, tất cả các dòng tiếp theo có cùng giá trị khóa sắp xếp (`points = 90`) với dòng thứ 3 đều được lấy kèm. Vì có hai dòng mang giá trị `90`, tổng số dòng trả về là **4 dòng** (`100`, `95`, `90`, `90`).
  * **A sai:** Chỉ trả về 3 dòng nếu dùng `FETCH FIRST 3 ROWS ONLY`.
  * **C, D sai:** Dòng `85` không đồng hạng với dòng thứ 3 nên không được lấy.
</details>

---

### Câu 12 (Question 12)
**Về mặt cơ chế thực thi bên dưới (Under the Hood), khi bạn chạy một câu truy vấn có mệnh đề `ORDER BY salary DESC FETCH FIRST 5 ROWS WITH TIES`, Oracle Optimizer sẽ tự động biến đổi (transform) câu lệnh này thành hàm phân tích nào?**

* A. `ROW_NUMBER() OVER (ORDER BY salary DESC)`
* B. `RANK() OVER (ORDER BY salary DESC)`
* C. `DENSE_RANK() OVER (ORDER BY salary DESC)`
* D. `NTILE(5) OVER (ORDER BY salary DESC)`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi dùng `FETCH FIRST n ROWS WITH TIES`, Oracle tự động viết lại truy vấn sử dụng hàm `RANK() OVER (ORDER BY ...)` với điều kiện lọc `<= n`. Trong khi đó, nếu dùng `FETCH FIRST n ROWS ONLY`, Oracle sẽ biến đổi thành `ROW_NUMBER() OVER (ORDER BY ...)`.
  * **A sai:** `ROW_NUMBER()` dùng cho `ONLY`, không giữ các dòng đồng hạng ở vị trí thứ `n`.
  * **C sai:** `DENSE_RANK() <= 5` sẽ lấy 5 mức giá trị lương cao nhất (có thể trả về 20 dòng nếu nhiều người trùng lương ở các hạng 1, 2, 3, 4), khác với `WITH TIES` chỉ lấy thêm các dòng đồng hạng tại ranh giới dòng thứ 5.
  * **D sai:** `NTILE(5)` chia bảng thành 5 nhóm bằng nhau.
</details>

---

### Câu 13 (Question 13)
**Xem xét câu lệnh SQL dưới đây. Kết quả khi thực thi trên Oracle Database là gì?**

```sql
SELECT d.department_name, e_top.first_name, e_top.salary
FROM departments d,
     (SELECT first_name, salary
      FROM employees e
      WHERE e.department_id = d.department_id
      ORDER BY e.salary DESC
      FETCH FIRST 1 ROW ONLY) e_top;
```

* A. Trả về danh sách các phòng ban cùng với nhân viên có lương cao nhất của từng phòng ban đó.
* B. Báo lỗi `ORA-00904: "D"."DEPARTMENT_ID": invalid identifier` vì một Inline View thông thường trong mệnh đề `FROM` không thể tham chiếu cột của bảng đứng trước nó.
* C. Báo lỗi vì `FETCH FIRST 1 ROW ONLY` không được phép đặt bên trong một Inline View.
* D. Trả về tích Đề-các (Cartesian Product) của hai bảng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Theo quy tắc phạm vi chuẩn của SQL, một Inline View thông thường trong mệnh đề `FROM` hoàn toàn độc lập và **không được phép tương quan trái (left-correlation)** tới các bảng đứng cùng cấp trong mệnh đề `FROM`. Do đó `d.department_id` bên trong Inline View không được nhận diện, gây lỗi **`ORA-00904`**. Để khắc phục, phải thêm từ khóa `LATERAL` trước Inline View hoặc dùng `CROSS APPLY` / `OUTER APPLY`.
  * **A, C, D sai:** `FETCH FIRST` dùng trong Inline View hoàn toàn hợp lệ, lỗi nằm ở phạm vi tham chiếu cột `d.department_id`.
</details>

---

### Câu 14 (Question 14)
**Từ khóa nào được giới thiệu từ Oracle 12c cho phép đặt ngay trước một Inline View trong mệnh đề `FROM` để Inline View đó có thể tham chiếu trực tiếp đến các cột của bảng đứng bên trái nó?**

* A. `CORRELATED`
* B. `LATERAL`
* C. `PRIOR`
* D. `EXTERNAL`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Từ khóa **`LATERAL`** (`FROM departments d, LATERAL (SELECT ... WHERE e.department_id = d.department_id)`) cho phép một Inline View truy cập các cột của những bảng xuất hiện phía bên trái nó trong mệnh đề `FROM`.
  * **A, C, D sai:** Không có cú pháp `CORRELATED (...)` trong SQL; `PRIOR` dùng cho truy vấn phân cấp `CONNECT BY`; `EXTERNAL` dùng cho External Table.
</details>

---

### Câu 15 (Question 15)
**Sự khác biệt giữa `CROSS APPLY` và `OUTER APPLY` khi kết nối bảng `DEPARTMENTS d` (bên trái) với một Inline View lấy nhân viên của phòng ban đó (bên phải) là gì?**

* A. `CROSS APPLY` tạo tích Đề-các không có điều kiện lọc, còn `OUTER APPLY` bắt buộc phải có từ khóa `ON`.
* B. Nếu một phòng ban không có nhân viên nào (Inline View trả về 0 dòng), `CROSS APPLY` sẽ loại bỏ phòng ban đó khỏi kết quả, trong khi `OUTER APPLY` vẫn giữ lại phòng ban đó và điền `NULL` cho các cột của Inline View.
* C. `OUTER APPLY` loại bỏ các phòng ban không có nhân viên, còn `CROSS APPLY` giữ lại tất cả các phòng ban.
* D. `CROSS APPLY` chỉ cho phép Inline View trả về tối đa 1 dòng, còn `OUTER APPLY` cho phép trả về nhiều dòng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * `CROSS APPLY` hoạt động tương đương với `INNER JOIN LATERAL (...) ON 1=1`: nếu truy vấn con bên phải không trả về dòng nào cho một dòng của bảng bên trái, dòng bảng bên trái đó sẽ bị loại bỏ.
    * `OUTER APPLY` hoạt động tương đương với `LEFT OUTER JOIN LATERAL (...) ON 1=1`: nếu truy vấn con bên phải trả về tập rỗng, dòng của bảng bên trái vẫn được giữ nguyên và các cột thuộc Inline View sẽ nhận giá trị `NULL`.
  * **A, C, D sai:** Cả `CROSS APPLY` và `OUTER APPLY` đều **không sử dụng mệnh đề `ON`** và đều cho phép Inline View trả về 0, 1 hoặc nhiều dòng.
</details>

---

### Câu 16 (Question 16)
**Xem xét câu lệnh SQL dưới đây. Tại sao câu lệnh này lại báo lỗi cú pháp?**

```sql
SELECT d.department_name, emp_sub.first_name
FROM LATERAL (
    SELECT e.first_name
    FROM employees e
    WHERE e.department_id = d.department_id
) emp_sub
JOIN departments d ON 1 = 1;
```

* A. Vì `LATERAL` Inline View chỉ có thể tham chiếu tới các bảng đứng **bên trái (phía trước)** nó trong mệnh đề `FROM`, không thể tham chiếu tới bảng `departments d` đứng **bên phải (phía sau)** nó.
* B. Vì điều kiện `ON 1 = 1` không hợp lệ trong Oracle SQL.
* C. Vì bên trong `LATERAL` bắt buộc phải có mệnh đề `ORDER BY`.
* D. Vì `LATERAL` chỉ được dùng với bảng `DUAL`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Quy tắc bất di bất dịch của `LATERAL`, `CROSS APPLY`, và `OUTER APPLY` là tính tương quan một chiều từ trái sang phải (Left-Correlation): Inline View chỉ nhìn thấy các bảng được khai báo **trước nó (bên trái)** trong mệnh đề `FROM`. Ở câu lệnh trên, `LATERAL` được viết trước bảng `departments d`, nên tại thời điểm biên dịch `LATERAL`, định danh `d.department_id` chưa tồn tại $\rightarrow$ báo lỗi `ORA-00904`.
  * **B, C, D sai:** `ON 1 = 1` hoàn toàn hợp lệ và `LATERAL` không bắt buộc phải có `ORDER BY`.
</details>

---

### Câu 17 (Question 17)
**Trong bảng `DEPARTMENTS` có 4 phòng ban (`10, 20, 30, 40`). Trong bảng `EMPLOYEES` có 10 nhân viên thuộc phòng `10`, 5 nhân viên thuộc phòng `20`, và không có nhân viên nào thuộc phòng `30, 40`. Câu truy vấn dưới đây sẽ trả về bao nhiêu dòng?**

```sql
SELECT d.department_id, d.department_name
FROM departments d
WHERE EXISTS (
    SELECT e.employee_id
    FROM employees e
    WHERE e.department_id = d.department_id
);
```

* A. 15 dòng (vì có 10 nhân viên phòng 10 và 5 nhân viên phòng 20).
* B. 2 dòng (phòng ban 10 và phòng ban 20).
* C. 4 dòng (cả 4 phòng ban).
* D. Báo lỗi vì trong `EXISTS` không được chọn cột `e.employee_id`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Toán tử `EXISTS` thực hiện phép **Semi-Join (Bán kết nối)**. Với mỗi dòng của bảng `DEPARTMENTS`, ngay khi tìm thấy **dòng đầu tiên khớp** trong bảng `EMPLOYEES`, `EXISTS` lập tức trả về `TRUE` và dừng quét tiếp cho phòng ban đó. Nhờ vậy, các dòng của bảng `DEPARTMENTS` không bao giờ bị nhân bản (duplicate). Chỉ có phòng `10` và phòng `20` thỏa mãn nên kết quả trả về đúng **2 dòng**.
  * **A sai:** Nhầm lẫn giữa `Semi-Join` (`EXISTS` / `IN`) với `INNER JOIN` thông thường (sẽ nhân bản thành 15 dòng).
  * **C, D sai:** Danh sách `SELECT` bên trong `EXISTS` viết gì cũng được (`SELECT 1`, `SELECT *`, `SELECT e.employee_id`, thậm chí `SELECT NULL` đều cho kết quả như nhau).
</details>

---

### Câu 18 (Question 18)
**Điều gì xảy ra nếu bạn viết `SELECT NULL` bên trong một mệnh đề `WHERE EXISTS (SELECT NULL FROM employees e WHERE e.department_id = d.department_id)`?**

* A. Câu truy vấn luôn trả về 0 dòng vì `SELECT NULL` mang giá trị `UNKNOWN`.
* B. Câu truy vấn báo lỗi cú pháp vì không thể `SELECT NULL` mà không có bí danh cột.
* C. Câu truy vấn hoạt động hoàn toàn bình thường và trả về các phòng ban có nhân viên, vì `EXISTS` chỉ kiểm tra sự tồn tại của dòng trả về chứ không quan tâm giá trị cột trong `SELECT` là gì.
* D. Câu truy vấn chỉ trả về các phòng ban có `department_id IS NULL`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là câu hỏi kinh điển trong đề thi chứng chỉ Oracle OCA/OCP! Toán tử `EXISTS` chỉ kiểm tra xem truy vấn con có sinh ra **ít nhất 1 dòng (row)** hay không, hoàn toàn phớt lờ giá trị biểu thức trong danh sách `SELECT` của truy vấn con. Do đó `SELECT 1`, `SELECT 'X'`, hay `SELECT NULL` bên trong `EXISTS` đều cho kết quả **giống hệt nhau 100%**.
  * **A, B, D sai:** Đều mắc bẫy tưởng rằng `SELECT NULL` làm cho biểu thức `EXISTS` trở thành `NULL` / `UNKNOWN`.
</details>

---

### Câu 19 (Question 19)
**Bảng `EMPLOYEES` có cột `MANAGER_ID` chứa các giá trị: `{100, 101, 102, NULL}` (vì Tổng giám đốc có `MANAGER_ID` là `NULL`). Bạn muốn tìm danh sách các nhân viên KHÔNG PHẢI là quản lý của bất kỳ ai bằng câu lệnh sau. Kết quả sẽ là gì?**

```sql
SELECT employee_id, first_name
FROM employees
WHERE employee_id NOT IN (
    SELECT manager_id FROM employees
);
```

* A. Trả về danh sách tất cả các nhân viên cấp dưới không làm quản lý.
* B. Chỉ trả về duy nhất dòng của Tổng giám đốc (người có `manager_id IS NULL`).
* C. Không trả về bất kỳ dòng nào (0 rows returned).
* D. Báo lỗi runtime `ORA-01427: single-row subquery returns more than one row`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Bẫy sinh tử của `NOT IN` với `NULL`! Tập kết quả của truy vấn con là `(100, 101, 102, NULL)`. Biểu thức `employee_id NOT IN (100, 101, 102, NULL)` được diễn giải thành:
    `employee_id != 100 AND employee_id != 101 AND employee_id != 102 AND employee_id != NULL`.
    Với một nhân viên không làm quản lý (ví dụ `employee_id = 105`), ba điều kiện đầu là `TRUE`, nhưng điều kiện cuối `105 != NULL` trả về **`UNKNOWN`**.
    Theo bảng chân trị SQL: `TRUE AND UNKNOWN` $\rightarrow$ **`UNKNOWN`**. Mệnh đề `WHERE` chỉ lấy các dòng đạt giá trị `TRUE`, nên toàn bộ các dòng đều bị loại bỏ $\rightarrow$ trả về **0 dòng**!
  * **A, B, D sai:** Để câu lệnh chạy đúng, phải dùng `NOT EXISTS` hoặc thêm `WHERE manager_id IS NOT NULL` vào bên trong truy vấn con của `NOT IN`.
</details>

---

### Câu 20 (Question 20)
**Để khắc phục triệt để vấn đề trả về 0 dòng khi tập dữ liệu đối chiếu có chứa `NULL` (như ở bài toán tìm các nhân viên không làm quản lý), cách viết nào sau đây là AN TOÀN và CHUẨN XÁC nhất?**

* A. Dùng `WHERE employee_id != ALL (SELECT manager_id FROM employees)`
* B. Dùng `WHERE NOT EXISTS (SELECT 1 FROM employees m WHERE m.manager_id = e.employee_id)`
* C. Dùng `WHERE employee_id NOT IN (SELECT NVL(manager_id, employee_id) FROM employees)`
* D. Dùng `WHERE employee_id = ANY (SELECT manager_id FROM employees)`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Toán tử `NOT EXISTS` xử lý tương quan từng dòng và chỉ đánh giá xem truy vấn con có trả về dòng nào không (`TRUE` hoặc `FALSE`). Các dòng có `m.manager_id IS NULL` khi so sánh `NULL = e.employee_id` sẽ ra `UNKNOWN` và bị loại ngay bên trong truy vấn con, không làm ảnh hưởng đến các dòng khác. Nhờ vậy `NOT EXISTS` trả về kết quả chính xác tuyệt đối ngay cả khi cột `manager_id` chứa `NULL`.
  * **A sai:** `!= ALL` (hay `<> ALL`) về mặt toán học **hoàn toàn tương đương 100% với `NOT IN`**, nên khi gặp `NULL` trong subquery cũng trả về **0 dòng**!
  * **C sai:** Nếu thay `NULL` bằng `employee_id` của dòng đó thì Tổng giám đốc sẽ có `manager_id = 100`, hoặc nếu tham chiếu `e.employee_id` của bảng ngoài thì luôn khớp chính nó và trả về 0 dòng.
  * **D sai:** `= ANY` tương đương với `IN` (tìm những người LÀ quản lý chứ không phải KHÔNG làm quản lý).
</details>

---

### Câu 21 (Question 21)
**Trong kế hoạch thực thi (Execution Plan) của Oracle Database, thuật ngữ `Subquery Unnesting` có ý nghĩa là gì?**

* A. Quá trình Oracle xóa bỏ hoàn toàn điều kiện của truy vấn con để câu lệnh chạy nhanh hơn.
* B. Quá trình bộ tối ưu hóa (CBO) biến đổi một truy vấn con lồng bên trong `WHERE` thành một phép kết nối ngang hàng (như `Semi-Join`, `Anti-Join`, hoặc Inline View Join) với truy vấn cha.
* C. Quá trình biên dịch một câu lệnh SQL thành một Stored Procedure trong PL/SQL.
* D. Quá trình tách một câu lệnh `SELECT` thành nhiều transaction độc lập.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** **Subquery Unnesting** là kỹ thuật Query Transformation quan trọng bậc nhất của Oracle CBO: thay vì thực thi truy vấn con lặp đi lặp lại cho từng dòng của bảng ngoài theo kiểu `FILTER`, CBO "mở tổ" (unnest) truy vấn con để đưa bảng bên trong ra kết nối ngang hàng với bảng ngoài bằng các thuật toán tối ưu như `HASH JOIN SEMI`, `HASH JOIN ANTI`, hoặc `MERGE JOIN`.
  * **A, C, D sai:** Query Transformation luôn đảm bảo kết quả trả về tương đương mặt ngữ nghĩa (semantically equivalent) với câu truy vấn gốc.
</details>

---

### Câu 22 (Question 22)
**Khi một truy vấn con vô hướng (Scalar Subquery — truy vấn con trả về tối đa 1 dòng, 1 cột) được đặt trong danh sách `SELECT` như câu lệnh dưới đây, cơ chế tối ưu hóa đặc biệt nào của Oracle giúp giảm thiểu số lần thực thi truy vấn con khi có nhiều nhân viên thuộc cùng một `department_id`?**

```sql
SELECT e.first_name,
       e.department_id,
       (SELECT d.department_name
        FROM departments d
        WHERE d.department_id = e.department_id) AS dept_name
FROM employees e;
```

* A. Partition Pruning.
* B. Scalar Subquery Caching (Bộ nhớ đệm kết quả truy vấn con vô hướng trong bộ nhớ PGA).
* C. Full Table Scan Parallelism.
* D. Star Transformation.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi dùng một Correlated Scalar Subquery trong mệnh đề `SELECT`, Oracle tự động sử dụng một bảng băm nhỏ trong bộ nhớ thực thi (In-memory Hash Table) để thực hiện **Scalar Subquery Caching**: lưu cặp `(input: e.department_id -> output: d.department_name)`. Khi dòng tiếp theo có cùng `department_id` (đặc biệt hiệu quả nếu dữ liệu được sắp xếp theo `department_id`), Oracle lấy ngay kết quả từ bộ nhớ đệm mà không cần đọc lại bảng `DEPARTMENTS`!
  * **A, C, D sai:** Không liên quan đến cơ chế cache của Scalar Subquery.
</details>

---

### Câu 23 (Question 23)
**Điều gì sẽ xảy ra khi một Scalar Subquery nằm trong danh sách `SELECT` trả về:**
1. **0 dòng (Không tìm thấy dòng khớp)**
2. **2 dòng trở lên**

* A. Trường hợp (1) báo lỗi `ORA-01403: no data found`; Trường hợp (2) lấy dòng đầu tiên.
* B. Trường hợp (1) trả về giá trị `NULL`; Trường hợp (2) báo lỗi runtime `ORA-01427: single-row subquery returns more than one row`.
* C. Cả hai trường hợp đều trả về `NULL` mà không báo lỗi.
* D. Trường hợp (1) loại bỏ luôn dòng của truy vấn cha (giống `INNER JOIN`); Trường hợp (2) nhân đôi dòng của truy vấn cha.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Một Scalar Subquery là biểu thức bắt buộc chỉ được trả về **tối đa 1 cột và tối đa 1 dòng**:
    * Nếu trả về **0 dòng**: Trong SQL, nó tự động đánh giá thành giá trị **`NULL`** (hành xử giống hệt `LEFT OUTER JOIN`, **không** văng lỗi `NO_DATA_FOUND` như `SELECT INTO` trong PL/SQL!).
    * Nếu trả về **từ 2 dòng trở lên**: Oracle lập tức ném lỗi runtime **`ORA-01427: single-row subquery returns more than one row`**.
  * **A, C, D sai:** Đây là câu hỏi phân loại rất hay giữa SQL thuần và PL/SQL.
</details>

---

### Câu 24 (Question 24)
**Xem xét câu truy vấn sử dụng truy vấn con so sánh đa cột (Multiple-Column Subquery) dưới đây. Cú pháp này thực hiện điều gì?**

```sql
SELECT employee_id, first_name, department_id, salary
FROM employees
WHERE (department_id, salary) IN (
    SELECT department_id, MAX(salary)
    FROM employees
    GROUP BY department_id
);
```

* A. Báo lỗi cú pháp vì toán tử `IN` chỉ cho phép so sánh duy nhất 1 cột ở vế trái.
* B. Thực hiện so sánh theo cặp (Pairwise Comparison): tìm tất cả các nhân viên có mức lương bằng đúng mức lương cao nhất trong chính phòng ban của họ (loại trừ các nhân viên có `department_id IS NULL`).
* C. Tìm tất cả các nhân viên có mức lương bằng mức lương cao nhất của bất kỳ phòng ban nào trong công ty (Non-pairwise comparison).
* D. Báo lỗi vì không được dùng `GROUP BY` bên trong truy vấn con của `IN`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Oracle hỗ trợ đầy đủ **Multiple-Column Subquery (Pairwise Comparison)** với cú pháp `WHERE (col1, col2) IN (SELECT col1, col2 FROM ...)`. Cả `department_id` và `salary` của nhân viên phải đồng thời khớp với cặp `(department_id, MAX(salary))` của cùng một dòng kết quả trong truy vấn con. Lưu ý: nếu nhân viên có `department_id IS NULL`, phép so sánh `NULL = NULL` trong `IN` trả về `UNKNOWN` nên dòng đó không được chọn.
  * **A, C, D sai:** So sánh không theo cặp (Non-pairwise) là khi viết tách rời: `WHERE department_id IN (SELECT ...) AND salary IN (SELECT ...)`, sẽ dẫn đến sai lệch kết quả (nhân viên phòng 10 nhưng có lương trùng với mức lương cao nhất của phòng 30 vẫn bị lấy nhầm).
</details>

---

### Câu 25 (Question 25)
**Trong Oracle 11g trở lên, khi bạn thực thi câu truy vấn `SELECT * FROM departments WHERE department_id NOT IN (SELECT department_id FROM employees)` mà cột `department_id` của cả hai bảng đều không có ràng buộc `NOT NULL`, thuật toán kết nối nào trong Execution Plan đã được Oracle bổ sung để thực hiện Anti-Join hiệu năng cao mà vẫn xử lý đúng ngữ nghĩa của `NULL`?**

* A. `CARTESIAN MERGE JOIN`
* B. `HASH JOIN RIGHT ANTI NA` (hoặc `HASH JOIN ANTI NA` — Null-Aware Anti-Join)
* C. `BITMAP INDEX SINGLE VALUE`
* D. `CONNECT BY WITHOUT FILTERING`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trước Oracle 11g, nếu cột trong `NOT IN` có thể mang giá trị `NULL` (nullable), CBO không dám thực hiện `Subquery Unnesting` thành Anti-Join thông thường mà phải dùng `FILTER` (quét lặp bảng con cho từng dòng bảng cha, cực kỳ chậm!). Từ Oracle 11g, Oracle giới thiệu thuật toán **Null-Aware Anti-Join** (ký hiệu trên Execution Plan là **`HASH JOIN ANTI NA`**, **`HASH JOIN RIGHT ANTI NA`**, hoặc **`HASH JOIN ANTI SNA` - Single Null-Aware**), cho phép dùng Hash Anti-Join tốc độ cao nhưng vẫn kiểm tra chính xác sự xuất hiện của `NULL` để trả về 0 dòng khi có `NULL` theo đúng chuẩn SQL.
  * **A, C, D sai:** Không phải thuật toán xử lý `NOT IN` với cột nullable.
</details>

---
