# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 8: Subquery — Truy Vấn Con

> **Mục tiêu:** Đánh giá toàn diện kiến thức Chương 8 (Single-row & Multiple-row Subquery, Multiple-column Subquery, `IN`, `NOT IN` & bẫy `NULL`, `ANY`/`SOME`, `ALL`, `EXISTS`, `NOT EXISTS`, Correlated Subquery, Scalar Subquery, Inline View) theo chuẩn đề thi **Oracle Database SQL (1Z0-071)** và kỳ thi sát hạch **VNPT**.  
> **Số lượng:** 25 câu hỏi trắc nghiệm kèm đáp án và phân tích chuyên sâu.  
> **Cách học:** Hãy tự phân tích và chọn đáp án trước khi bấm vào **"👉 Xem Đáp Án & Giải Thích Chi Tiết"**.

---

### Câu 1 (Question 1)
**Cho bảng `EMPLOYEES` trong đó có 2 nhân viên cùng có `LAST_NAME = 'King'`. Điều gì sẽ xảy ra khi bạn thực thi câu truy vấn dưới đây?**

```sql
SELECT employee_id, last_name, salary
FROM employees
WHERE salary > (SELECT salary
                FROM employees
                WHERE last_name = 'King');
```

* A. Câu lệnh tự động lấy mức lương cao hơn trong 2 người tên `'King'` để so sánh.
* B. Câu lệnh tự động lấy mức lương của người tên `'King'` đầu tiên tìm thấy.
* C. Báo lỗi `ORA-01427: single-row subquery returns more than one row`.
* D. Trả về `0` dòng (`No rows selected`).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Toán tử `>` là toán tử so sánh đơn dòng (**Single-Row Operator**), yêu cầu truy vấn con bên phải chỉ được trả về **tối đa 1 dòng**. Vì có 2 nhân viên tên `'King'`, truy vấn con trả về 2 dòng nên Oracle ném ra lỗi runtime `ORA-01427: single-row subquery returns more than one row`. Để khắc phục, phải đổi `>` thành `> ALL` hoặc `> ANY` (hoặc dùng `MAX(salary)` trong Subquery).
  * **A, B, D sai:** Oracle không bao giờ tự đoán ý người dùng khi Subquery đơn dòng trả về nhiều hơn 1 dòng.
</details>

---

### Câu 2 (Question 2)
**Điều gì sẽ xảy ra nếu câu truy vấn con (Single-Row Subquery) trong mệnh đề `WHERE` dưới đây trả về `0` dòng (không có nhân viên nào tên `'Zorro'`)?**

```sql
SELECT employee_id, last_name, salary
FROM employees
WHERE salary = (SELECT salary
                FROM employees
                WHERE last_name = 'Zorro');
```

* A. Báo lỗi `ORA-01403: no data found`.
* B. Câu lệnh chạy thành công mà không báo lỗi và trả về `0` dòng (`No rows selected`).
* C. Trả về các nhân viên có `salary IS NULL`.
* D. Báo lỗi `ORA-01427`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong SQL (khác với `SELECT ... INTO` trong PL/SQL), khi một Single-Row Subquery hoặc Scalar Subquery không tìm thấy dòng nào (`0` rows), nó **không báo lỗi `NO_DATA_FOUND`** mà tự động trả về giá trị **`NULL`**. Khi đó điều kiện trở thành `WHERE salary = NULL`, có giá trị chân lý là `UNKNOWN` cho mọi dòng (kể cả dòng có `salary IS NULL`), dẫn đến kết quả cuối cùng là **`0` dòng (`No rows selected`)**.
  * **A, C, D sai:** A nhầm với ngoại lệ `NO_DATA_FOUND` của PL/SQL; C nhầm rằng `salary = NULL` khớp được với các dòng `NULL`.
</details>

---

### Câu 3 (Question 3)
**Cho bảng `EMPLOYEES` gồm 107 nhân viên, trong đó Chủ tịch công ty có `MANAGER_ID IS NULL` và có 18 người đang là quản lý của người khác. Khi chạy câu truy vấn dưới đây để tìm những nhân viên KHÔNG phải là quản lý của ai, kết quả trả về sẽ có bao nhiêu dòng?**

```sql
SELECT employee_id, last_name
FROM employees
WHERE employee_id NOT IN (SELECT manager_id FROM employees);
```

* A. `89` dòng (`107 - 18`)
* B. `88` dòng
* C. `0` dòng (`No rows selected`)
* D. Báo lỗi vì cột `manager_id` chứa giá trị `NULL`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là bẫy kinh điển nhất trong đề thi OCA 1Z0-071 và phỏng vấn SQL!
    * Tập kết quả của `SELECT manager_id FROM employees` có chứa giá trị **`NULL`** (do dòng của Chủ tịch có `manager_id IS NULL`), ví dụ: `(100, 101, 102, ..., NULL)`.
    * Toán tử `employee_id NOT IN (100, 101, ..., NULL)` tương đương với chuỗi phép **`AND`**: `employee_id <> 100 AND employee_id <> 101 AND ... AND employee_id <> NULL`.
    * Vì `employee_id <> NULL` luôn trả về **`UNKNOWN`**, và trong logic 3 giá trị `TRUE AND UNKNOWN` luôn bằng **`UNKNOWN`**, nên không có bất kỳ dòng nào thỏa mãn điều kiện `WHERE`! Kết quả trả về **`0` dòng**.
  * **A, B, D sai:** Muốn lấy ra 89 dòng, bắt buộc phải thêm `WHERE manager_id IS NOT NULL` vào bên trong Subquery hoặc đổi sang dùng `NOT EXISTS`.
</details>

---

### Câu 4 (Question 4)
**Ngược lại với Câu 3, nếu sử dụng toán tử `IN` thay vì `NOT IN` trên cùng bảng `EMPLOYEES` (trong đó tập `SELECT manager_id FROM employees` có chứa giá trị `NULL`), kết quả của câu lệnh dưới đây sẽ như thế nào?**

```sql
SELECT employee_id, last_name
FROM employees
WHERE employee_id IN (SELECT manager_id FROM employees);
```

* A. Trả về `0` dòng vì tập Subquery có chứa `NULL`.
* B. Thực thi bình thường và trả về đầy đủ `18` nhân viên đang là quản lý của người khác.
* C. Trả về `19` dòng (bao gồm cả dòng có `employee_id IS NULL`).
* D. Báo lỗi runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Toán tử `employee_id IN (100, 101, ..., NULL)` được dịch thành chuỗi phép **`OR`**: `(employee_id = 100) OR (employee_id = 101) OR ... OR (employee_id = NULL)`.
  * Trong logic 3 giá trị của SQL, **`TRUE OR UNKNOWN` luôn trả về `TRUE`**! Do đó, đối với các nhân viên có mã nằm trong danh sách quản lý (`100, 101...`), vế đầu đã là `TRUE` nên vế `OR UNKNOWN` do `NULL` gây ra hoàn toàn không làm hỏng kết quả. Câu lệnh trả về đúng 18 người quản lý.
  * **A, C, D sai:** Chỉ có `NOT IN` và `ALL` mới bị vô hiệu hóa bởi `NULL`, còn `IN` và `ANY` vẫn hoạt động bình thường với các giá trị khớp khác `NULL`.
</details>

---

### Câu 5 (Question 5)
**Giả sử truy vấn con `(SELECT salary FROM employees WHERE job_id = 'IT_PROG')` trả về 3 mức lương là: `4000`, `6000`, và `9000`. Điều kiện `WHERE salary > ANY (SELECT salary FROM employees WHERE job_id = 'IT_PROG')` tương đương với điều kiện nào sau đây?**

* A. `WHERE salary > 9000`
* B. `WHERE salary > 4000`
* C. `WHERE salary BETWEEN 4000 AND 9000`
* D. `WHERE salary < 4000`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** `salary > ANY (4000, 6000, 9000)` có nghĩa là mức lương chỉ cần **lớn hơn ít nhất 1 phần tử** trong tập hợp (`salary > 4000 OR salary > 6000 OR salary > 9000`). Một số chỉ cần lớn hơn số nhỏ nhất (`MIN = 4000`) là đã thỏa mãn điều kiện lớn hơn ít nhất 1 phần tử trong tập hợp! Do đó `> ANY` luôn tương đương với **`> MIN`** (`salary > 4000`).
  * **A, C, D sai:** A (`salary > 9000`, tức `> MAX`) là ý nghĩa của `salary > ALL (...)`.
</details>

---

### Câu 6 (Question 6)
**Vẫn với tập kết quả của truy vấn con gồm 3 giá trị `(4000, 6000, 9000)`. Điều kiện `WHERE salary < ALL (SELECT salary ...)` và `WHERE salary < SOME (SELECT salary ...)` lần lượt tương đương với điều kiện nào?**

* A. `salary < 4000` và `salary < 9000`
* B. `salary < 9000` và `salary < 4000`
* C. `salary < 4000` và `salary < 4000`
* D. `salary > 9000` và `salary < 4000`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:**
    * `salary < ALL (4000, 6000, 9000)`: Phải nhỏ hơn **tất cả mọi phần tử** trong tập hợp, tức là phải nhỏ hơn cả phần tử bé nhất (`< MIN`) $\rightarrow$ **`salary < 4000`**.
    * Từ khóa `SOME` là từ đồng nghĩa 100% của `ANY`. Do đó `salary < SOME (4000, 6000, 9000)` có nghĩa là nhỏ hơn **ít nhất 1 phần tử** trong tập hợp, tức là chỉ cần nhỏ hơn phần tử lớn nhất (`< MAX`) $\rightarrow$ **`salary < 9000`**.
  * **B, C, D sai:** Nhầm lẫn giữa `< ALL` (`< MIN`) và `< SOME` / `< ANY` (`< MAX`).
</details>

---

### Câu 7 (Question 7)
**Nếu truy vấn con `(SELECT bonus FROM emp_bonus)` trả về 3 dòng có giá trị là `(500, 1000, NULL)`, thì câu lệnh nào dưới đây vẫn có thể trả về các dòng dữ liệu (KHÔNG bị rơi vào trạng thái luôn trả về 0 dòng)?**

* A. `SELECT * FROM employees WHERE salary > ALL (SELECT bonus FROM emp_bonus);`
* B. `SELECT * FROM employees WHERE salary < ALL (SELECT bonus FROM emp_bonus);`
* C. `SELECT * FROM employees WHERE salary > ANY (SELECT bonus FROM emp_bonus);`
* D. `SELECT * FROM employees WHERE salary NOT IN (SELECT bonus FROM emp_bonus);`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Toán tử `> ANY (500, 1000, NULL)` được nối bằng phép **`OR`**: `(salary > 500) OR (salary > 1000) OR (salary > NULL)`. Với bất kỳ nhân viên nào có `salary > 500`, vế đầu đã là `TRUE` nên toàn bộ biểu thức `OR` trả về `TRUE` bất chấp giá trị `NULL`.
  * **A, B, D sai:** Tất cả các toán tử dùng **`ALL`** (`> ALL`, `< ALL`, `<> ALL`) và **`NOT IN`** đều được nối bằng phép **`AND`**. Khi tập con chứa `NULL`, phép `AND UNKNOWN` làm cho mọi dòng đều nhận giá trị `UNKNOWN` và trả về **0 dòng**.
</details>

---

### Câu 8 (Question 8)
**Biểu thức nào sau đây là SAI CÚ PHÁP trong Oracle SQL?**

* A. `WHERE department_id = ANY (SELECT department_id FROM departments)`
* B. `WHERE department_id IN ANY (SELECT department_id FROM departments)`
* C. `WHERE department_id <> ALL (SELECT department_id FROM departments)`
* D. `WHERE department_id = SOME (SELECT department_id FROM departments)`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng (là biểu thức sai cú pháp):** Các từ khóa `ANY`, `SOME`, `ALL` bắt buộc phải đứng ngay sau một **toán tử so sánh chuẩn** (`=`, `>`, `<`, `>=`, `<=`, `<>`, `!=`). Không bao giờ được phép kết hợp `IN ANY` hay `IN ALL` (vì bản thân `IN` đã chính là `= ANY`).
  * **A, C, D sai:** Đều đúng cú pháp (`= ANY` tương đương `IN`, `<> ALL` tương đương `NOT IN`, `= SOME` tương đương `= ANY`).
</details>

---

### Câu 9 (Question 9)
**Xét câu truy vấn sử dụng `EXISTS` dưới đây. Kết quả thực thi sẽ như thế nào?**

```sql
SELECT d.department_id, d.department_name
FROM departments d
WHERE EXISTS (SELECT NULL
              FROM employees e
              WHERE e.department_id = d.department_id);
```

* A. Trả về `0` dòng vì mệnh đề `SELECT NULL` luôn trả về `NULL`.
* B. Báo lỗi cú pháp vì không thể `SELECT NULL` mà không có tên cột.
* C. Thực thi thành công và trả về danh sách các phòng ban có ít nhất 1 nhân viên đang làm việc.
* D. Trả về danh sách các phòng ban không có nhân viên nào.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Toán tử `EXISTS` **chỉ kiểm tra xem truy vấn con có trả về ít nhất 1 dòng hay không**, hoàn toàn không quan tâm giá trị hay biểu thức được viết sau từ khóa `SELECT` bên trong Subquery là gì! Dù bạn viết `SELECT 1`, `SELECT 'X'`, `SELECT *`, hay `SELECT NULL`, chỉ cần tìm thấy 1 dòng trong `employees` có `e.department_id = d.department_id`, `EXISTS` lập tức trả về **`TRUE`**.
  * **A, B, D sai:** Đề thi OCA 1Z0-071 rất hay viết `SELECT NULL` hoặc `SELECT 1/0` bên trong `EXISTS` để bẫy thí sinh!
</details>

---

### Câu 10 (Question 10)
**Tiếp nối Câu 9, điều gì sẽ xảy ra khi thực thi câu lệnh SQL dưới đây (biết có các phòng ban thỏa mãn điều kiện nối)?**

```sql
SELECT d.department_id, d.department_name
FROM departments d
WHERE EXISTS (SELECT 1/0
              FROM employees e
              WHERE e.department_id = d.department_id);
```

* A. Báo lỗi `ORA-01476: divisor is equal to zero`.
* B. Thực thi thành công mà KHÔNG báo lỗi chia cho 0, trả về các phòng ban có nhân viên.
* C. Trả về `0` dòng.
* D. Báo lỗi biên dịch.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi xử lý `EXISTS (subquery)`, bộ tối ưu hóa của Oracle (Optimizer) bỏ qua hoàn toàn việc tính toán danh sách biểu thức trong mệnh đề `SELECT` của Subquery (nó chỉ kiểm tra sự tồn tại của row trong index/table). Do đó biểu thức `1/0` không bao giờ bị tính toán và câu lệnh chạy thành công mỹ mãn!
  * **A, C, D sai:** Bất ngờ nhưng hoàn toàn có thật trong Oracle Database Engine.
</details>

---

### Câu 11 (Question 11)
**Cho câu truy vấn tìm các nhân viên có mức lương cao hơn mức lương trung bình của chính phòng ban họ đang làm việc. Câu lệnh nào dưới đây giải quyết ĐÚNG bài toán này?**

* A. `SELECT e1.last_name, e1.salary FROM employees e1 WHERE e1.salary > (SELECT AVG(e2.salary) FROM employees e2 GROUP BY e2.department_id);`
* B. `SELECT e1.last_name, e1.salary FROM employees e1 WHERE e1.salary > (SELECT AVG(e2.salary) FROM employees e2 WHERE e2.department_id = e1.department_id);`
* C. `SELECT e1.last_name, e1.salary FROM employees e1 WHERE e1.salary > AVG(e1.salary) GROUP BY e1.department_id;`
* D. `SELECT e1.last_name, e1.salary FROM employees e1 HAVING e1.salary > (SELECT AVG(salary) FROM employees);`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Sử dụng **Correlated Subquery** (Truy vấn con tương quan). Với mỗi nhân viên `e1` ở câu lệnh ngoài, truy vấn con tính mức lương trung bình `AVG(e2.salary)` của những nhân viên `e2` có cùng mã phòng ban với `e1` (`WHERE e2.department_id = e1.department_id`).
  * **A sai:** Truy vấn con `SELECT AVG(e2.salary) FROM employees e2 GROUP BY e2.department_id` trả về nhiều dòng (mỗi phòng ban 1 dòng), khi đi với toán tử đơn dòng `>` sẽ báo lỗi `ORA-01427: single-row subquery returns more than one row`.
  * **C sai:** Dùng `AVG` trong `WHERE` gây lỗi `ORA-00934`.
  * **D sai:** Lỗi cú pháp và so sánh với trung bình toàn công ty chứ không phải từng phòng ban.
</details>

---

### Câu 12 (Question 12)
**Sự khác biệt giữa Pairwise Comparison (Câu 1) và Non-Pairwise Comparison (Câu 2) trong Multiple-Column Subquery dưới đây là gì?**

```sql
-- Câu 1 (Pairwise):
SELECT last_name FROM employees
WHERE (manager_id, department_id) IN (SELECT manager_id, department_id
                                      FROM employees WHERE employee_id IN (141, 174));

-- Câu 2 (Non-Pairwise):
SELECT last_name FROM employees
WHERE manager_id    IN (SELECT manager_id    FROM employees WHERE employee_id IN (141, 174))
  AND department_id IN (SELECT department_id FROM employees WHERE employee_id IN (141, 174));
```

* A. Câu 1 báo lỗi cú pháp vì Oracle không cho phép đặt 2 cột trong ngoặc đơn trước toán tử `IN`.
* B. Cả hai câu luôn luôn trả về tập kết quả giống hệt nhau trong mọi trường hợp.
* C. Câu 1 yêu cầu cả `manager_id` và `department_id` phải khớp đồng thời với cùng một nhân viên (`141` hoặc `174`), trong khi Câu 2 cho phép ghép chéo `manager_id` của người `141` với `department_id` của người `174` (nên Câu 2 có thể trả về nhiều dòng hơn Câu 1).
* D. Câu 1 có thể trả về nhiều dòng hơn Câu 2.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Giả sử nhân viên `141` có `(mgr=124, dept=50)` và nhân viên `174` có `(mgr=149, dept=80)`.
    * **Câu 1 (Pairwise):** Chỉ lấy nhân viên có đúng cặp `(124, 50)` hoặc `(149, 80)`.
    * **Câu 2 (Non-Pairwise):** Lấy nhân viên có `mgr IN (124, 149)` VÀ `dept IN (50, 80)`, tức là chấp nhận cả các cặp ghép chéo **`(124, 80)`** và **`(149, 50)`**! Do đó tập kết quả của Câu 2 có thể rộng hơn Câu 1.
  * **A, B, D sai:** Oracle hỗ trợ đầy đủ Pairwise Multiple-Column Subquery.
</details>

---

### Câu 13 (Question 13)
**Khi sử dụng một Scalar Subquery (Truy vấn con vô hướng) bên trong danh sách `SELECT` như dưới đây, điều gì sẽ xảy ra nếu có một nhân viên mà `e.department_id` không khớp với bất kỳ dòng nào trong bảng `DEPARTMENTS` (tức Scalar Subquery trả về `0` dòng)?**

```sql
SELECT e.last_name,
       (SELECT d.department_name
        FROM departments d
        WHERE d.department_id = e.department_id) AS dept_name
FROM employees e;
```

* A. Dòng của nhân viên đó bị loại bỏ khỏi tập kết quả (giống `INNER JOIN`).
* B. Dòng của nhân viên đó vẫn được hiển thị và cột `DEPT_NAME` nhận giá trị `NULL` (hành vi giống hệt `LEFT OUTER JOIN`).
* C. Báo lỗi `ORA-01403: no data found`.
* D. Báo lỗi `ORA-01427`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Scalar Subquery đặt trên mệnh đề `SELECT` được đánh giá cho từng dòng của câu truy vấn ngoài (`employees e`). Nếu với một dòng `e`, Scalar Subquery trả về `0` dòng, thì giá trị của biểu thức Scalar Subquery đó sẽ là **`NULL`**, còn bản thân dòng `e` vẫn được giữ nguyên! Về mặt kết quả, nó tương đương với việc `employees e LEFT OUTER JOIN departments d`.
  * **A, C, D sai:** Scalar Subquery trên `SELECT` chỉ báo lỗi khi trả về **nhiều hơn 1 dòng** (`ORA-01427`) hoặc **nhiều hơn 1 cột** (`ORA-00913`).
</details>

---

### Câu 14 (Question 14)
**Mệnh đề nào dưới đây trong câu lệnh SQL KHÔNG ĐƯỢC PHÉP chứa một Scalar Subquery?**

* A. Mệnh đề `SELECT`
* B. Mệnh đề `ORDER BY`
* C. Mệnh đề `GROUP BY`
* D. Biểu thức `CASE WHEN ... THEN ... END`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Theo tài liệu chính thức của Oracle SQL, **Scalar Subquery KHÔNG hợp lệ** trong mệnh đề `GROUP BY`, trong mệnh đề `RETURNING`, trong giá trị `DEFAULT` của cột, hoặc làm điều kiện của `CHECK constraint` (viết `GROUP BY (SELECT ...)` sẽ báo lỗi `ORA-22806` hoặc `ORA-00936`).
  * **A, B, D sai:** Scalar Subquery hoàn toàn hợp lệ khi đặt trong `SELECT`, `WHERE`, `HAVING`, `ORDER BY`, và `CASE WHEN`.
</details>

---

### Câu 15 (Question 15)
**Tại sao câu lệnh sử dụng Inline View (Subquery trong mệnh đề `FROM`) dưới đây lại báo lỗi biên dịch trong Oracle Database?**

```sql
SELECT dept_stats.department_id, dept_stats.avg_sal
FROM (SELECT department_id, AVG(salary) AS avg_sal
      FROM employees
      GROUP BY department_id) AS dept_stats
WHERE dept_stats.avg_sal > 8000;
```

* A. Vì không được phép dùng `GROUP BY` bên trong một Inline View.
* B. Vì trong Oracle SQL, bí danh của bảng hoặc Inline View (`dept_stats`) trong mệnh đề `FROM` KHÔNG ĐƯỢC PHÉP có từ khóa `AS` đứng trước.
* C. Vì không được phép tham chiếu đến bí danh cột `avg_sal` của Inline View ở mệnh đề `WHERE` bên ngoài.
* D. Vì thiếu mệnh đề `ORDER BY` trong Inline View.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là quy tắc cú pháp cực kỳ quan trọng của Oracle SQL:
    * Từ khóa **`AS`** chỉ được phép dùng cho **Column Alias** (bí danh cột trên `SELECT`: `AVG(salary) AS avg_sal`).
    * Đối với **Table Alias / Inline View Alias** trong mệnh đề `FROM`, Oracle **TUYỆT ĐỐI CẤM dùng từ khóa `AS`**! Viết `) AS dept_stats` sẽ lập tức báo lỗi `ORA-00933: SQL command not properly ended`. Phải viết là `) dept_stats`.
  * **A, C, D sai:** Đặc biệt lưu ý ở C: bí danh cột `avg_sal` được định nghĩa bên trong Inline View đã trở thành tên cột chính thức của bảng ảo `dept_stats`, nên câu truy vấn bên ngoài hoàn toàn dùng được `dept_stats.avg_sal` trong `WHERE`!
</details>

---

### Câu 16 (Question 16)
**Bạn muốn lấy ra 5 nhân viên có mức lương cao nhất trong bảng `EMPLOYEES` bằng cách sử dụng cột giả `ROWNUM`. Câu lệnh nào dưới đây cho kết quả ĐÚNG?**

* A. `SELECT last_name, salary FROM employees WHERE ROWNUM <= 5 ORDER BY salary DESC;`
* B. `SELECT last_name, salary FROM (SELECT last_name, salary FROM employees ORDER BY salary DESC) WHERE ROWNUM <= 5;`
* C. `SELECT last_name, salary FROM employees ORDER BY salary DESC WHERE ROWNUM <= 5;`
* D. `SELECT ROWNUM, last_name, salary FROM employees GROUP BY salary HAVING ROWNUM <= 5;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong Oracle, `ROWNUM` được gán cho các dòng ngay trong bước đọc dữ liệu và lọc `WHERE`, tức là **TRƯỚC KHI** mệnh đề `ORDER BY` của cùng câu lệnh đó được thực thi! Do đó, để lấy Top-5 lương cao nhất bằng `ROWNUM`, bạn bắt buộc phải sắp xếp `ORDER BY salary DESC` **bên trong một Inline View (`FROM (SELECT ... ORDER BY salary DESC)`) trước**, rồi mới lọc `WHERE ROWNUM <= 5` ở truy vấn ngoài!
  * **A sai:** Câu A sẽ lấy 5 dòng ngẫu nhiên đầu tiên mà Oracle đọc được từ bảng, sau đó mới sắp xếp 5 dòng ngẫu nhiên đó theo lương giảm dần!
  * **C và D sai:** Lỗi cú pháp SQL.
</details>

---

### Câu 17 (Question 17)
**Câu lệnh nào dưới đây sẽ báo lỗi vì đặt mệnh đề `ORDER BY` không đúng vị trí cho phép trong Subquery?**

* A. `SELECT * FROM (SELECT last_name, salary FROM employees ORDER BY salary DESC) WHERE ROWNUM <= 10;`
* B. `SELECT last_name FROM employees WHERE department_id IN (SELECT department_id FROM departments WHERE location_id = 1700 ORDER BY department_id);`
* C. `SELECT last_name FROM employees WHERE department_id IN (SELECT department_id FROM departments WHERE location_id = 1700) ORDER BY last_name;`
* D. Cả A và B đều báo lỗi.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng (là câu lệnh báo lỗi):** Mệnh đề `ORDER BY` **bị cấm đặt bên trong một Subquery của mệnh đề `WHERE` hoặc `HAVING`** (việc sắp xếp một tập hợp chỉ dùng để kiểm tra `IN` là vô nghĩa và gây lỗi `ORA-00907: missing right parenthesis`).
  * **A và C sai:** `ORDER BY` hoàn toàn hợp lệ khi đặt trong Inline View ở mệnh đề `FROM` (Câu A) hoặc đặt ở cuối cùng của Outer Query (Câu C).
</details>

---

### Câu 18 (Question 18)
**Cho bảng `DEPARTMENTS (d)` và `EMPLOYEES (e)`. Một phòng ban có thể có nhiều nhân viên. Hãy so sánh kết quả của hai câu truy vấn sau:**

```sql
-- Truy vấn 1 (Dùng INNER JOIN):
SELECT d.department_id, d.department_name
FROM departments d
INNER JOIN employees e ON d.department_id = e.department_id;

-- Truy vấn 2 (Dùng IN / EXISTS):
SELECT d.department_id, d.department_name
FROM departments d
WHERE d.department_id IN (SELECT e.department_id FROM employees e);
```

* A. Hai truy vấn luôn trả về số lượng dòng giống hệt nhau.
* B. Truy vấn 1 có thể trả về các dòng phòng ban bị lặp lại nhiều lần (nếu phòng ban có nhiều hơn 1 nhân viên), trong khi Truy vấn 2 mỗi phòng ban chỉ xuất hiện tối đa 1 lần duy nhất.
* C. Truy vấn 2 trả về nhiều dòng hơn Truy vấn 1.
* D. Truy vấn 2 hiển thị được cả các cột của bảng `employees` trên mệnh đề `SELECT` ngoài cùng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * **Truy vấn 1 (`INNER JOIN`):** Nếu phòng ban `10` có `5` nhân viên, phép `INNER JOIN` sẽ ghép phòng ban `10` với từng nhân viên, làm phòng ban `10` bị **nhân bản thành 5 dòng** (muốn khử trùng phải thêm `SELECT DISTINCT`).
    * **Truy vấn 2 (`IN` / `EXISTS` — Semi-Join):** Chỉ kiểm tra điều kiện cho từng dòng của bảng `departments`. Dù phòng ban `10` có 1 hay 1000 nhân viên thì điều kiện `IN` cũng chỉ trả về `TRUE` một lần cho dòng phòng ban đó $\rightarrow$ **Không bao giờ làm nhân bản dòng của bảng ngoài**!
  * **A, C, D sai:** D sai vì bảng `employees` chỉ nằm trong Subquery của `WHERE`, nên không thể đem cột `e.last_name` lên mệnh đề `SELECT` của Outer Query.
</details>

---

### Câu 19 (Question 19)
**Cho bảng `EMP(emp_id, dept_id)` và bảng `DEPT(dept_id, dname)`. Giả sử cột `LOC_ID` CHỈ tồn tại trong bảng `DEPT` mà KHÔNG tồn tại trong bảng `EMP`. Điều gì sẽ xảy ra khi bạn chạy câu lệnh dưới đây (chú ý trong Subquery viết `SELECT loc_id FROM emp` không có tiền tố bảng)?**

```sql
SELECT dname
FROM dept
WHERE dept_id IN (SELECT loc_id FROM emp);
```

* A. Báo lỗi `ORA-00904: "LOC_ID": invalid identifier` vì bảng `EMP` không có cột `LOC_ID`.
* B. Câu lệnh KHÔNG báo lỗi! Oracle tự động tìm cột `loc_id` ở bảng ngoài (`DEPT`), biến Subquery thành một Correlated Subquery (so sánh `dept.dept_id = dept.loc_id` nếu bảng `emp` có ít nhất 1 dòng)!
* C. Trả về `0` dòng vì cột `loc_id` không tồn tại.
* D. Tự động lấy cột đầu tiên của bảng `emp`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là một quy tắc phân giải phạm vi tên cột (**Column Name Resolution / Scoping Rule**) cực kỳ nổi tiếng trong SQL chuẩn và Oracle OCP!
    * Khi một tên cột không có tiền tố (`loc_id`) được gọi bên trong Subquery, Oracle tìm trong bảng của Subquery (`emp`) trước.
    * Nếu bảng `emp` không có cột `loc_id`, Oracle **KHÔNG báo lỗi ngay** mà tiếp tục tìm ra phạm vi của **Outer Query (`dept`)**!
    * Vì bảng `dept` có cột `loc_id`, câu lệnh biên dịch thành công và biến thành truy vấn tương quan lấy giá trị `dept.loc_id` của dòng bên ngoài!
    * **Bài học xương máu:** Luôn luôn gắn tiền tố Table Alias (`e.loc_id`) cho mọi cột trong Subquery để nếu gõ nhầm tên cột thì trình biên dịch sẽ bắt lỗi ngay lập tức!
  * **A, C, D sai:** Không biết quy tắc tìm kiếm tên cột từ trong ra ngoài (Inner-to-Outer scoping) của Subquery.
</details>

---

### Câu 20 (Question 20)
**Xét câu truy vấn có Subquery đặt trong mệnh đề `HAVING` dưới đây. Câu lệnh này thực hiện công việc gì?**

```sql
SELECT department_id, AVG(salary)
FROM employees
GROUP BY department_id
HAVING AVG(salary) > (SELECT MAX(salary)
                      FROM employees
                      WHERE department_id = 30);
```

* A. Hiển thị các phòng ban có mức lương trung bình lớn hơn mức lương trung bình của phòng ban 30.
* B. Hiển thị các phòng ban có mức lương trung bình lớn hơn mức lương cao nhất của phòng ban 30.
* C. Báo lỗi vì không được phép dùng hàm `MAX` bên trong mệnh đề `HAVING` đang chứa hàm `AVG`.
* D. Báo lỗi `ORA-00937: not a single-group group function`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * Subquery `(SELECT MAX(salary) FROM employees WHERE department_id = 30)` chạy trước và trả về 1 giá trị duy nhất là mức lương cao nhất của phòng ban 30.
    * Outer Query gom nhóm các nhân viên theo `department_id`, tính `AVG(salary)` cho từng phòng ban, và dùng `HAVING` để chỉ giữ lại những phòng ban có mức lương trung bình lớn hơn con số `MAX(salary)` của phòng 30.
  * **A, C, D sai:** Câu lệnh hoàn toàn hợp lệ và rất phổ biến trong các bài toán phân tích dữ liệu.
</details>

---

### Câu 21 (Question 21)
**Trong Oracle SQL, mệnh đề `WITH` (Subquery Factoring / Common Table Expression - CTE) mang lại lợi ích gì so với việc viết lặp đi lặp lại cùng một Inline View nhiều lần trong câu truy vấn?**

```sql
WITH dept_costs AS (
    SELECT d.department_name, SUM(e.salary) AS dept_total
    FROM employees e JOIN departments d ON e.department_id = d.department_id
    GROUP BY d.department_name
)
SELECT * FROM dept_costs
WHERE dept_total > (SELECT AVG(dept_total) FROM dept_costs);
```

* A. Chỉ giúp câu lệnh dễ đọc hơn nhưng hoàn toàn không có tác dụng gì về mặt hiệu năng trong mọi trường hợp.
* B. Giúp câu truy vấn rõ ràng, dễ bảo trì hơn, và cho phép Oracle Optimizer tính toán kết quả của khối `WITH` một lần rồi lưu vào bảng tạm toàn cục nội bộ (Materialize) khi khối đó được tham chiếu nhiều lần.
* C. Tạo ra một bảng vật lý vĩnh viễn trong Database giống như `CREATE TABLE`.
* D. Bắt buộc người dùng phải có quyền `CREATE VIEW` mới chạy được câu lệnh `SELECT` có `WITH`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Mệnh đề `WITH` (Subquery Factoring Clause) vừa giúp tái sử dụng code SQL sạch sẽ (thay vì copy-paste cùng một Inline View ở nhiều nơi), vừa giúp Oracle Cost-Based Optimizer có thể thực hiện `TEMP TABLE TRANSFORMATION` (tính toán 1 lần và tái sử dụng kết quả) khi CTE được gọi từ 2 lần trở lên.
  * **A, C, D sai:** `WITH` chỉ có phạm vi trong câu lệnh `SELECT` hiện tại, không tạo đối tượng vĩnh viễn trong Schema và không yêu cầu quyền `CREATE VIEW`.
</details>

---

### Câu 22 (Question 22)
**Câu lệnh `UPDATE` sử dụng Correlated Subquery dưới đây sẽ làm gì đối với những phòng ban trong bảng `DEPARTMENTS` mà hiện tại KHÔNG có nhân viên nào trong bảng `EMPLOYEES`?**

```sql
UPDATE departments d
SET d.total_salary = (SELECT SUM(e.salary)
                      FROM employees e
                      WHERE e.department_id = d.department_id);
```

* A. Giữ nguyên giá trị `total_salary` cũ của các phòng ban không có nhân viên.
* B. Cập nhật cột `total_salary` của các phòng ban không có nhân viên thành `0`.
* C. Cập nhật cột `total_salary` của các phòng ban không có nhân viên thành `NULL` (do không có mệnh đề `WHERE` ở câu lệnh `UPDATE` ngoài cùng).
* D. Báo lỗi và rollback toàn bộ câu lệnh.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Vì câu lệnh `UPDATE departments d` **không có mệnh đề `WHERE` ở ngoài cùng**, nó sẽ cập nhật **tất cả các dòng** trong bảng `departments`. Đối với những phòng ban không có nhân viên nào, truy vấn con `SELECT SUM(e.salary) ...` trả về **`NULL`**, dẫn đến việc cột `d.total_salary` của các phòng ban đó bị ghi đè thành `NULL`! Để tránh lỗi logic này, phải bọc `NVL(..., 0)` hoặc thêm `WHERE EXISTS (...)` cho câu lệnh `UPDATE`.
  * **A, B, D sai:** `SUM` trên tập rỗng trả về `NULL` chứ không phải `0`.
</details>

---

### Câu 23 (Question 23)
**Cho bảng `PRODUCTS(prod_id, category_id, price)`. Câu lệnh nào dưới đây sử dụng Inline View kết hợp với `JOIN` để hiển thị tên sản phẩm, giá sản phẩm, và giá trung bình của danh mục chứa sản phẩm đó?**

* A. `SELECT p.prod_id, p.price, c.avg_price FROM products p JOIN (SELECT category_id, AVG(price) AS avg_price FROM products GROUP BY category_id) c ON p.category_id = c.category_id;`
* B. `SELECT p.prod_id, p.price, AVG(p.price) FROM products p GROUP BY p.category_id;`
* C. `SELECT p.prod_id, p.price, c.avg_price FROM products p JOIN (SELECT category_id, AVG(price) AS avg_price FROM products) c ON p.category_id = c.category_id;`
* D. `SELECT p.prod_id, p.price FROM products p WHERE p.price = (SELECT category_id, AVG(price) FROM products GROUP BY category_id);`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Inline View `c` tính `AVG(price) AS avg_price` gom nhóm theo `GROUP BY category_id`. Sau đó bảng `products p` thực hiện `JOIN` với Inline View `c` qua `p.category_id = c.category_id`, giúp hiển thị chi tiết từng sản phẩm đi kèm giá trung bình của danh mục tương ứng trên cùng một dòng.
  * **B sai:** Báo lỗi `ORA-00979` vì `prod_id` và `price` không nằm trong `GROUP BY`.
  * **C sai:** Bên trong Inline View thiếu `GROUP BY category_id` (lỗi `ORA-00937`).
  * **D sai:** So sánh 1 cột `p.price` với Subquery trả về 2 cột (lỗi `ORA-00913: too many values`) và nhiều dòng (`ORA-01427`).
</details>

---

### Câu 24 (Question 24)
**Khi thực thi câu lệnh SQL dưới đây, Oracle sẽ báo lỗi gì?**

```sql
SELECT employee_id, last_name
FROM employees
WHERE department_id = (SELECT department_id, department_name
                       FROM departments
                       WHERE department_id = 10);
```

* A. `ORA-01427: single-row subquery returns more than one row`
* B. `ORA-00913: too many values`
* C. `ORA-00904: invalid identifier`
* D. Không báo lỗi, tự động lấy cột đầu tiên là `department_id` để so sánh

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Ở vế trái của dấu `=` chỉ có **1 cột** (`department_id`), nhưng Subquery ở vế phải lại trả về **2 cột** (`department_id, department_name`). Sự lệch số lượng cột giữa hai vế của phép so sánh Subquery sẽ gây ra lỗi biên dịch **`ORA-00913: too many values`** (hoặc `ORA-00947: not enough values` nếu vế trái có 2 cột mà Subquery chỉ trả về 1 cột).
  * **A, C, D sai:** Phân biệt rõ: Nhiều dòng hơn mức cho phép $\rightarrow$ `ORA-01427`; Nhiều cột hơn mức cho phép $\rightarrow$ `ORA-00913`.
</details>

---

### Câu 25 (Question 25)
**Để tìm tất cả các phòng ban trong bảng `DEPARTMENTS` không xuất hiện trong bảng `EMPLOYEES` (kể cả khi cột `EMPLOYEES.DEPARTMENT_ID` có chứa nhiều giá trị `NULL`), những cách viết nào dưới đây là ĐÚNG và AN TOÀN tuyệt đối với `NULL`?**

```sql
-- Cách 1:
SELECT department_id FROM departments d
WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.department_id);

-- Cách 2:
SELECT department_id FROM departments
WHERE department_id NOT IN (SELECT department_id FROM employees);

-- Cách 3:
SELECT department_id FROM departments
WHERE department_id NOT IN (SELECT department_id FROM employees WHERE department_id IS NOT NULL);
```

* A. Chỉ Cách 1
* B. Chỉ Cách 1 và Cách 2
* C. Chỉ Cách 1 và Cách 3
* D. Cả Cách 1, Cách 2 và Cách 3

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (Cách 1 và Cách 3):**
    * **Cách 1 (`NOT EXISTS`):** Kiểm tra điều kiện tương quan `e.department_id = d.department_id`. Các dòng có `e.department_id IS NULL` làm phép `=` trả về `UNKNOWN` (không khớp), nên không được trả về từ Subquery và hoàn toàn không ảnh hưởng đến các phòng ban khác.
    * **Cách 3 (`NOT IN` có lọc `WHERE department_id IS NOT NULL`):** Đã chủ động loại bỏ hoàn toàn các giá trị `NULL` khỏi danh sách của Subquery trước khi thực hiện `NOT IN`, nên trả về kết quả chính xác.
  * **A, B, D sai:** Cách 2 (`NOT IN` không lọc `NULL`) sẽ trả về `0` dòng ngay lập tức khi bảng `employees` có nhân viên chưa thuộc phòng ban nào (`department_id IS NULL`).
</details>

---
