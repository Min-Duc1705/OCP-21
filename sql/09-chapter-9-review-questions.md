# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 9: Set Operators (Toán Tử Tập Hợp)

> **Mục tiêu:** Đánh giá toàn diện kiến thức Chương 9 (`UNION`, `UNION ALL`, `INTERSECT`, `MINUS`, `EXCEPT` trong Oracle 21c, quy tắc tương thích cột & kiểu dữ liệu, xử lý trùng lặp & `NULL`, quy tắc `Column Alias` và `ORDER BY`) theo chuẩn đề thi **Oracle Database SQL (1Z0-071)** và kỳ thi sát hạch **VNPT**.  
> **Số lượng:** 25 câu hỏi trắc nghiệm kèm đáp án và phân tích chuyên sâu.  
> **Cách học:** Hãy tự phân tích và chọn đáp án trước khi bấm vào **"👉 Xem Đáp Án & Giải Thích Chi Tiết"**.

---

### Câu 1 (Question 1)
**Cho bảng `TABLE_A` gồm 4 dòng có giá trị cột `ID` là: `(1, 1, 2, 3)` và bảng `TABLE_B` gồm 3 dòng có giá trị cột `ID` là: `(2, 3, 4)`. Số lượng dòng trả về của 4 câu lệnh sử dụng `UNION ALL`, `UNION`, `INTERSECT`, và `MINUS` (`TABLE_A MINUS TABLE_B`) lần lượt là bao nhiêu?**

* A. `7`, `4`, `2`, `2`
* B. `7`, `4`, `2`, `1`
* C. `7`, `5`, `2`, `1`
* D. `6`, `4`, `2`, `2`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * **`UNION ALL`:** Ghép tất cả các dòng của 2 bảng mà không khử trùng lặp: $4 + 3 =$ **`7` dòng** `(1, 1, 2, 3, 2, 3, 4)`.
    * **`UNION`:** Hợp hai bảng và loại bỏ mọi dòng trùng lặp: còn **`4` dòng** `(1, 2, 3, 4)`.
    * **`INTERSECT`:** Lấy các giá trị xuất hiện ở cả hai bảng và khử trùng lặp: còn **`2` dòng** `(2, 3)`.
    * **`TABLE_A MINUS TABLE_B`:** Lấy các giá trị có trong `TABLE_A` mà không có trong `TABLE_B` (loại bỏ `2` và `3`), đồng thời **tự động khử trùng lặp hai dòng số `1` trong `TABLE_A`** thành một dòng số `1` duy nhất $\rightarrow$ chỉ còn đúng **`1` dòng** `(1)`!
  * **A, C, D sai:** A mắc bẫy kinh điển khi quên rằng toán tử `MINUS` cũng tự động khử trùng lặp các dòng giống nhau (`(1, 1)` $\rightarrow$ `(1)`) ngay bên trong bảng thứ nhất!
</details>

---

### Câu 2 (Question 2)
**Toán tử tập hợp nào dưới đây KHÔNG thực hiện việc loại bỏ các bản ghi trùng lặp (duplicate rows) khỏi tập kết quả cuối cùng?**

* A. `UNION`
* B. `INTERSECT`
* C. `MINUS`
* D. `UNION ALL`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Trong 4 toán tử tập hợp truyền thống (`UNION`, `UNION ALL`, `INTERSECT`, `MINUS`), chỉ có duy nhất **`UNION ALL`** giữ nguyên toàn bộ các bản ghi trùng lặp và không thực hiện bước `SORT UNIQUE` / `HASH UNIQUE`. Nhờ đó `UNION ALL` có tốc độ thực thi nhanh nhất.
  * **A, B, C sai:** Cả 3 toán tử này đều tự động loại bỏ các dòng trùng lặp để trả về tập kết quả gồm các dòng duy nhất (`DISTINCT`).
</details>

---

### Câu 3 (Question 3)
**Trong phiên bản Oracle Database 21c, từ khóa chuẩn ANSI SQL nào dưới đây được hỗ trợ để thực hiện phép hiệu hai tập hợp và hoàn toàn tương đương về mặt chức năng với toán tử `MINUS`?**

* A. `DIFFERENCE`
* B. `SUBTRACT`
* C. `EXCEPT`
* D. `NOT UNION`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Bắt đầu từ Oracle Database 21c, Oracle chính thức bổ sung từ khóa chuẩn ANSI SQL **`EXCEPT`** (cùng với `EXCEPT ALL`, `MINUS ALL`, `INTERSECT ALL`). Câu lệnh `SELECT ... EXCEPT SELECT ...` hoạt động giống hệt 100% với `SELECT ... MINUS SELECT ...`.
  * **A, B, D sai:** Không phải là từ khóa toán tử tập hợp hợp lệ trong SQL.
</details>

---

### Câu 4 (Question 4)
**Cho bảng `T1` có 3 dòng: `(10, 'A')`, `(20, NULL)`, `(NULL, NULL)` và bảng `T2` có 2 dòng: `(20, NULL)`, `(NULL, NULL)`. Khi thực thi câu lệnh `INTERSECT` dưới đây, kết quả trả về sẽ có bao nhiêu dòng?**

```sql
SELECT id, code FROM t1
INTERSECT
SELECT id, code FROM t2;
```

* A. `0` dòng (vì trong SQL giá trị `NULL` không bao giờ bằng `NULL`)
* B. `1` dòng
* C. `2` dòng: `(20, NULL)` và `(NULL, NULL)`
* D. Báo lỗi vì cột trong `INTERSECT` không được phép chứa toàn giá trị `NULL`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trái ngược với phép so sánh `=` trong mệnh đề `WHERE` hay `JOIN`, **tất cả các toán tử tập hợp (`UNION`, `INTERSECT`, `MINUS`) đều coi hai giá trị `NULL` ở cùng vị trí cột là TƯƠNG ĐƯƠNG NHAU (bằng nhau)**! Do đó:
    * Dòng `(20, NULL)` của `T1` khớp hoàn toàn với dòng `(20, NULL)` của `T2`.
    * Dòng `(NULL, NULL)` của `T1` cũng khớp hoàn toàn với dòng `(NULL, NULL)` của `T2`.
    * Kết quả của `INTERSECT` trả về đầy đủ cả **2 dòng** này!
  * **A, B, D sai:** Nhầm lẫn quy tắc xử lý `NULL` của `WHERE`/`JOIN` sang Set Operators.
</details>

---

### Câu 5 (Question 5)
**Vẫn với bảng `T1` có 3 dòng `(10, 'A')`, `(20, NULL)`, `(NULL, NULL)` và bảng `T2` có 2 dòng `(20, NULL)`, `(NULL, NULL)` ở Câu 4. Nếu thực thi câu lệnh `MINUS` dưới đây thì kết quả trả về là gì?**

```sql
SELECT id, code FROM t1
MINUS
SELECT id, code FROM t2;
```

* A. Chỉ trả về `1` dòng duy nhất là `(10, 'A')`.
* B. Trả về `3` dòng vì các dòng có `NULL` ở `T2` không trừ được các dòng có `NULL` ở `T1`.
* C. Trả về `2` dòng là `(10, 'A')` và `(NULL, NULL)`.
* D. Trả về `0` dòng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Vì toán tử `MINUS` coi hai giá trị `NULL` là bằng nhau, nên dòng `(20, NULL)` và dòng `(NULL, NULL)` trong `T1` đều tìm thấy bản ghi trùng khớp trong `T2` và bị loại bỏ hoàn toàn. Kết quả chỉ còn lại duy nhất **1 dòng** là `(10, 'A')`.
  * **B, C, D sai:** Không nắm vững quy tắc coi `NULL` bằng `NULL` của `MINUS`.
</details>

---

### Câu 6 (Question 6)
**Khi thực thi câu lệnh SQL dưới đây, kết quả sẽ như thế nào?**

```sql
SELECT employee_id, last_name, salary
FROM employees
UNION
SELECT department_id, department_name
FROM departments;
```

* A. Thực thi thành công và tự động điền giá trị `NULL` vào cột thứ 3 cho các dòng lấy từ bảng `departments`.
* B. Thực thi thành công và chỉ hiển thị 2 cột đầu tiên.
* C. Báo lỗi `ORA-01789: query block has incorrect number of result columns`.
* D. Báo lỗi `ORA-01790: expression must have same datatype as corresponding expression`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Quy tắc bắt buộc số 1 của Set Operators: Tất cả các câu lệnh `SELECT` thành phần trong một Compound Query **phải có cùng số lượng cột**! Câu `SELECT` đầu tiên có 3 cột nhưng câu `SELECT` thứ hai chỉ có 2 cột, dẫn đến lỗi `ORA-01789: query block has incorrect number of result columns`.
  * **A, B, D sai:** Oracle không bao giờ tự động bù thêm cột `NULL` nếu người lập trình không viết tường minh trên `SELECT`.
</details>

---

### Câu 7 (Question 7)
**Để sửa lỗi thiếu cột thứ 3 (tương ứng với cột `salary` kiểu `NUMBER` ở câu `SELECT` đầu tiên) cho câu lệnh ở Câu 6, những cách viết nào dưới đây cho câu `SELECT` thứ hai là HỢP LỆ?**

```sql
-- Xét câu SELECT đầu tiên: SELECT employee_id, last_name, salary FROM employees UNION ...
```

* A. `SELECT department_id, department_name, 0 FROM departments;`
* B. `SELECT department_id, department_name, TO_NUMBER(NULL) FROM departments;`
* C. `SELECT department_id, department_name, NULL FROM departments;`
* D. Tất cả các phương án A, B, và C đều hợp lệ!

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Trong Oracle SQL, để bù một cột kiểu `NUMBER` trong câu lệnh `UNION`:
    * Dùng hằng số kiểu số như `0` (**Câu A**) hoàn toàn hợp lệ.
    * Dùng `TO_NUMBER(NULL)` hoặc `CAST(NULL AS NUMBER)` (**Câu B**) là cách viết chuẩn mực và rõ ràng nhất.
    * Dùng trực tiếp từ khóa `NULL` (**Câu C**) cũng hoàn toàn hợp lệ vì literal `NULL` tương thích với mọi kiểu dữ liệu của cột tương ứng ở câu `SELECT` trên!
  * **A, B, C đơn lẻ chưa đủ:** Cả 3 cách đều chạy thành công trên Oracle Database.
</details>

---

### Câu 8 (Question 8)
**Điều gì sẽ xảy ra khi bạn thực thi câu truy vấn dưới đây trong Oracle Database?**

```sql
SELECT 100 AS val FROM dual
UNION
SELECT '100' AS val FROM dual;
```

* A. Thực thi thành công, Oracle tự động ép kiểu ngầm định `'100'` thành số `100` và trả về 1 dòng có giá trị `100`.
* B. Thực thi thành công và trả về 2 dòng: một dòng số `100` và một dòng chuỗi `'100'`.
* C. Báo lỗi `ORA-01790: expression must have same datatype as corresponding expression`.
* D. Báo lỗi `ORA-01722: invalid number`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là bẫy rất nổi tiếng trong đề thi OCA 1Z0-071! Mặc dù trong biểu thức thông thường (`WHERE id = '100'`), Oracle tự động ép kiểu ngầm định (implicit conversion) giữa `VARCHAR2` và `NUMBER`, nhưng **trong các toán tử tập hợp (`UNION`, `UNION ALL`, `INTERSECT`, `MINUS`), Oracle KHÔNG thực hiện ép kiểu ngầm định giữa các nhóm kiểu dữ liệu khác nhau** (`NUMBER` vs `VARCHAR2` vs `DATE`)! Việc ghép số `100` (`NUMBER`) với chuỗi `'100'` (`VARCHAR2`) sẽ lập tức báo lỗi `ORA-01790`.
  * **A, B, D sai:** Không nắm được quy tắc cấm ép kiểu ngầm định giữa các nhóm kiểu khác nhau trong Set Operators.
</details>

---

### Câu 9 (Question 9)
**Trong các cặp kiểu dữ liệu ở cùng vị trí cột giữa hai câu lệnh `SELECT` được nối bằng `UNION` dưới đây, cặp nào là HỢP LỆ và KHÔNG báo lỗi `ORA-01790`?**

* A. Cột 1 của `SELECT` đầu là `DATE`, cột 1 của `SELECT` sau là `VARCHAR2(20)`.
* B. Cột 1 của `SELECT` đầu là `NUMBER(6)`, cột 1 của `SELECT` sau là `VARCHAR2(6)`.
* C. Cột 1 của `SELECT` đầu là `CHAR(5)`, cột 1 của `SELECT` sau là `VARCHAR2(100)`, và cột 2 của `SELECT` đầu là `DATE`, cột 2 của `SELECT` sau là `TIMESTAMP`.
* D. Cột 1 của `SELECT` đầu là `CLOB`, cột 1 của `SELECT` sau là `NUMBER`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Set Operators yêu cầu các cột tương ứng phải thuộc **cùng nhóm kiểu dữ liệu (Data Type Group)**, không bắt buộc phải trùng khít độ dài hay kiểu con:
    * `CHAR(5)` và `VARCHAR2(100)` cùng thuộc nhóm chuỗi ký tự (Character group) $\rightarrow$ Hợp lệ (kết quả trả về kiểu `VARCHAR2(100)`).
    * `DATE` và `TIMESTAMP` cùng thuộc nhóm thời gian (Datetime group) $\rightarrow$ Hợp lệ (kết quả được nâng lên `TIMESTAMP`).
  * **A, B, D sai:** Khác nhóm kiểu dữ liệu nên đều báo lỗi `ORA-01790`.
</details>

---

### Câu 10 (Question 10)
**Khi thực thi câu truy vấn dưới đây, tên tiêu đề của hai cột trong bảng kết quả trả về sẽ là gì?**

```sql
SELECT employee_id AS emp_no, last_name AS emp_name
FROM employees
WHERE department_id = 10
UNION
SELECT department_id AS dept_no, department_name AS dept_title
FROM departments;
```

* A. `EMP_NO` và `EMP_NAME`
* B. `DEPT_NO` và `DEPT_TITLE`
* C. `EMPLOYEE_ID` và `LAST_NAME`
* D. Báo lỗi vì hai câu `SELECT` đặt bí danh cột khác nhau

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Quy tắc bất di bất dịch của Set Operators: Tên cột hiển thị ở tập kết quả cuối cùng **luôn luôn được lấy theo tên cột hoặc bí danh cột (Column Alias) của câu lệnh `SELECT` ĐẦU TIÊN** (`EMP_NO` và `EMP_NAME`). Các bí danh được đặt ở các câu `SELECT` phía sau (`dept_no`, `dept_title`) hoàn toàn hợp lệ về cú pháp nhưng bị bỏ qua khi tạo tiêu đề cột.
  * **B, C, D sai:** Nhầm quy tắc lấy tiêu đề cột của Compound Query.
</details>

---

### Câu 11 (Question 11)
**Xét câu truy vấn hợp có mệnh đề `ORDER BY` dưới đây. Tại sao câu lệnh này lại báo lỗi khi thực thi?**

```sql
SELECT employee_id AS id_code, last_name AS full_name
FROM employees
WHERE department_id = 10
UNION ALL
SELECT employee_id, last_name
FROM employees
WHERE department_id = 20
ORDER BY employee_id;
```

* A. Vì `UNION ALL` không cho phép sử dụng mệnh đề `ORDER BY`.
* B. Vì ở câu `SELECT` đầu tiên, cột `employee_id` đã được đặt bí danh là `id_code`, nên trong mệnh đề `ORDER BY` bắt buộc phải gọi theo bí danh `id_code` (hoặc số thứ tự `1`), không được gọi lại tên gốc `employee_id`.
* C. Vì ở câu `SELECT` thứ hai không đặt bí danh `AS id_code`.
* D. Vì thiếu từ khóa `ASC` sau `ORDER BY employee_id`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là bẫy cú pháp rất hay gặp trong đề thi OCA 1Z0-071!
    * Tập kết quả của Compound Query chỉ nhận biết các cột thông qua **tên hiển thị được định nghĩa ở câu `SELECT` đầu tiên**.
    * Khi câu `SELECT` đầu tiên đã đổi tên cột `employee_id` thành bí danh `id_code`, thì đối với mệnh đề `ORDER BY` ở cuối cùng, cái tên `employee_id` không còn tồn tại nữa (dù câu `SELECT` thứ 2 có viết `employee_id`)!
    * Do đó `ORDER BY employee_id` sẽ báo lỗi **`ORA-00904: "EMPLOYEE_ID": invalid identifier`**. Phải sửa thành `ORDER BY id_code` hoặc `ORDER BY 1`.
  * **A, C, D sai:** Không nhận diện được việc Column Alias ở câu `SELECT` 1 che khuất tên cột gốc đối với `ORDER BY`.
</details>

---

### Câu 12 (Question 12)
**Cho câu truy vấn dưới đây. Những mệnh đề `ORDER BY` nào có thể điền vào dòng cuối cùng để câu lệnh thực thi THÀNH CÔNG?**

```sql
SELECT employee_id, last_name AS lname
FROM employees
UNION
SELECT department_id AS dept_id, department_name AS dname
FROM departments
-- Điền mệnh đề ORDER BY vào đây:
```

* A. `ORDER BY dept_id;`
* B. `ORDER BY last_name;`
* C. `ORDER BY employee_id, 2 DESC;`
* D. `ORDER BY dname;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Ở câu `SELECT` đầu tiên:
    * Cột thứ 1 không có Alias nên tên của nó là `employee_id` (có thể gọi là `employee_id` hoặc `1`).
    * Cột thứ 2 có Alias là `lname` (chỉ có thể gọi là `lname` hoặc vị trí `2`).
    * Do đó `ORDER BY employee_id, 2 DESC;` hoàn toàn hợp lệ!
  * **A và D sai:** `dept_id` và `dname` là bí danh của câu `SELECT` thứ hai, không được phép dùng trong `ORDER BY` (`ORA-00904`).
  * **B sai:** Cột `last_name` ở câu `SELECT` đầu tiên đã bị đặt Alias là `lname`, nên gọi `ORDER BY last_name` sẽ báo lỗi `ORA-00904`.
</details>

---

### Câu 13 (Question 13)
**Điều gì sẽ xảy ra khi bạn chạy câu lệnh SQL dưới đây?**

```sql
SELECT employee_id, last_name
FROM employees
WHERE department_id = 10
ORDER BY last_name
UNION
SELECT employee_id, last_name
FROM employees
WHERE department_id = 20
ORDER BY last_name;
```

* A. Sắp xếp riêng từng nhóm phòng ban 10 và 20 theo `last_name` rồi mới gộp lại.
* B. Báo lỗi `ORA-00933: SQL command not properly ended` vì mệnh đề `ORDER BY` không được phép xuất hiện ở câu `SELECT` đầu tiên trước từ khóa `UNION`.
* C. Bỏ qua mệnh đề `ORDER BY` đầu tiên và chỉ thực hiện mệnh đề `ORDER BY` thứ hai.
* D. Thực thi thành công bình thường.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong một Compound Query, mệnh đề `ORDER BY` **chỉ được phép đặt một lần duy nhất ở cuối cùng của toàn bộ câu truy vấn** (sau câu `SELECT` cuối cùng). Việc đặt `ORDER BY last_name` ngay trước từ khóa `UNION` sẽ gây lỗi cú pháp `ORA-00933: SQL command not properly ended`.
  * **A, C, D sai:** Không được đặt `ORDER BY` trực tiếp ở các truy vấn thành phần phía trên (trừ khi bọc truy vấn thành phần đó vào trong một Inline View `SELECT * FROM (SELECT ... ORDER BY ...)`).
</details>

---

### Câu 14 (Question 14)
**Khi thực thi câu lệnh SQL dưới đây, kết quả sẽ như thế nào?**

```sql
SELECT employee_id, last_name
FROM employees
WHERE department_id = 10
UNION
SELECT employee_id, last_name
FROM employees
WHERE department_id = 20
ORDER BY salary DESC;
```

* A. Thực thi thành công và sắp xếp kết quả theo cột `salary` giảm dần.
* B. Báo lỗi `ORA-00904: "SALARY": invalid identifier` (hoặc `ORA-01785`) vì trong Compound Query, mệnh đề `ORDER BY` không được phép sắp xếp theo một cột không nằm trong danh sách `SELECT`.
* C. Sắp xếp theo cột đầu tiên là `employee_id`.
* D. Chỉ sắp xếp các nhân viên thuộc phòng ban 20 theo `salary`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong một câu lệnh `SELECT` đơn lẻ thông thường (không có `DISTINCT` hay Set Operators), bạn có thể `ORDER BY salary` dù không đưa `salary` lên `SELECT`. Nhưng **khi đã sử dụng Set Operators (`UNION`, `UNION ALL`, `INTERSECT`, `MINUS`), tập kết quả hợp nhất chỉ còn chứa các cột được liệt kê trên `SELECT`** (`employee_id` và `last_name`). Do đó việc gọi `ORDER BY salary` (một cột không có mặt trong `SELECT`) sẽ báo lỗi `ORA-00904: "SALARY": invalid identifier`!
  * **A, C, D sai:** Quên giới hạn của `ORDER BY` đối với các cột không nằm trong `SELECT` khi dùng Set Operators.
</details>

---

### Câu 15 (Question 15)
**Cho 3 tập hợp dữ liệu: Tập `A` có các số `(1, 2, 3)`, Tập `B` có các số `(3, 4)`, và Tập `C` có các số `(1, 4)`. Kết quả của câu truy vấn kết hợp nhiều toán tử tập hợp dưới đây là gì?**

```sql
SELECT num FROM set_a
UNION ALL
SELECT num FROM set_b
MINUS
SELECT num FROM set_c;
```

* A. `(2, 3)`
* B. `(1, 2, 3)`
* C. `(2, 3, 3)`
* D. `(2)`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Trong Oracle SQL, các toán tử tập hợp (`UNION`, `UNION ALL`, `INTERSECT`, `MINUS`) có **cùng mức độ ưu tiên** và được thực thi tuần tự **từ trên xuống dưới (từ trái sang phải)**:
    1. **Bước 1 (`set_a UNION ALL set_b`):** Ghép `(1, 2, 3)` và `(3, 4)` giữ nguyên trùng lặp $\rightarrow$ thu được tập trung gian gồm 5 phần tử: **`(1, 2, 3, 3, 4)`**.
    2. **Bước 2 (`Tập trung gian MINUS set_c`):** Lấy `(1, 2, 3, 3, 4)` trừ đi `(1, 4)` $\rightarrow$ loại bỏ `1` và `4`, còn lại `(2, 3, 3)`. Đồng thời toán tử `MINUS` tự động **khử trùng lặp** hai số `3` thành một số `3` duy nhất $\rightarrow$ kết quả cuối cùng là **`(2, 3)`**!
  * **B, C, D sai:**
    * **B sai** vì thực hiện `set_b MINUS set_c` trước (tưởng `MINUS` ưu tiên hơn `UNION ALL`).
    * **C sai** vì quên rằng `MINUS` ở bước cuối sẽ khử trùng lặp cặp `(3, 3)` do `UNION ALL` tạo ra ở bước trước!
</details>

---

### Câu 16 (Question 16)
**Vẫn với 3 tập hợp ở Câu 15: `A = (1, 2, 3)`, `B = (3, 4)`, `C = (1, 4)`. Nếu đặt cặp dấu ngoặc đơn bao quanh phép `MINUS` như dưới đây thì kết quả trả về sẽ là gì?**

```sql
SELECT num FROM set_a
UNION ALL
(SELECT num FROM set_b
 MINUS
 SELECT num FROM set_c);
```

* A. `(2, 3)`
* B. `(1, 2, 3)`
* C. `(1, 2, 3, 3)`
* D. Báo lỗi vì Oracle không cho phép dùng dấu ngoặc đơn trong Set Operators

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Cặp dấu ngoặc đơn `(...)` buộc Oracle thực thi phép toán bên trong ngoặc trước:
    1. **Trong ngoặc (`set_b MINUS set_c`):** Lấy `(3, 4)` trừ đi `(1, 4)` $\rightarrow$ còn lại **`(3)`**.
    2. **Ngoài ngoặc (`set_a UNION ALL (3)`):** Ghép `(1, 2, 3)` với `(3)` bằng `UNION ALL` (không khử trùng lặp) $\rightarrow$ thu được 4 dòng: **`(1, 2, 3, 3)`**!
  * **A, B, D sai:** B quên rằng phép toán thực hiện sau cùng là `UNION ALL` nên số `3` không bị khử trùng lặp.
</details>

---

### Câu 17 (Question 17)
**Ngược lại, nếu một câu lệnh thực hiện `UNION` trước rồi thực hiện `UNION ALL` sau như dưới đây, với `A = (1, 1, 2)`, `B = (2, 3)`, `C = (3, 4)`, thì kết quả sẽ có bao nhiêu dòng?**

```sql
SELECT num FROM set_a
UNION
SELECT num FROM set_b
UNION ALL
SELECT num FROM set_c;
```

* A. `4` dòng: `(1, 2, 3, 4)`
* B. `5` dòng: `(1, 2, 3, 3, 4)`
* C. `6` dòng: `(1, 1, 2, 3, 3, 4)`
* D. `7` dòng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Thực thi từ trên xuống dưới:
    1. **Bước 1 (`set_a UNION set_b`):** Hợp `(1, 1, 2)` và `(2, 3)` kèm khử trùng lặp $\rightarrow$ còn 3 dòng: **`(1, 2, 3)`**.
    2. **Bước 2 (`(1, 2, 3) UNION ALL set_c`):** Ghép nối trực tiếp `(1, 2, 3)` với `(3, 4)` mà không khử trùng lặp $\rightarrow$ thu được **5 dòng: `(1, 2, 3, 3, 4)`**!
  * **A, C, D sai:** A tưởng `UNION` ở đầu sẽ khử trùng cho cả `UNION ALL` phía sau; C quên `UNION` ở bước 1 đã khử trùng `(1, 1)`.
</details>

---

### Câu 18 (Question 18)
**Cho bảng `EMPLOYEES` trong đó cột `RESUME` có kiểu dữ liệu là `CLOB` (hoặc `BLOB`). Câu lệnh nào dưới đây sẽ thực thi THÀNH CÔNG mà không báo lỗi?**

* A. `SELECT employee_id, resume FROM employees WHERE department_id = 10 UNION SELECT employee_id, resume FROM employees WHERE department_id = 20;`
* B. `SELECT employee_id, resume FROM employees WHERE department_id = 10 INTERSECT SELECT employee_id, resume FROM employees WHERE department_id = 20;`
* C. `SELECT employee_id, resume FROM employees WHERE department_id = 10 MINUS SELECT employee_id, resume FROM employees WHERE department_id = 20;`
* D. `SELECT employee_id, resume FROM employees WHERE department_id = 10 UNION ALL SELECT employee_id, resume FROM employees WHERE department_id = 20;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Các kiểu dữ liệu Large Object (`BLOB`, `CLOB`, `NCLOB`, `BFILE`) và `LONG` không hỗ trợ phép so sánh trực tiếp để sắp xếp / khử trùng lặp (`SORT UNIQUE`). Vì `UNION ALL` không thực hiện so sánh hay khử trùng lặp mà chỉ nối các dòng lại với nhau, nên **`UNION ALL` là toán tử tập hợp duy nhất cho phép chứa cột `CLOB` / `BLOB`**!
  * **A, B, C sai:** Cả `UNION`, `INTERSECT`, và `MINUS` đều đòi hỏi phải so sánh giá trị để khử trùng lặp, nên khi gặp cột `CLOB`/`BLOB` sẽ báo lỗi `ORA-00932: inconsistent datatypes: expected - got CLOB`.
</details>

---

### Câu 19 (Question 19)
**Giả sử bạn muốn hiển thị một báo cáo gồm danh sách lương của từng phòng ban, dòng tiếp theo là lương của từng công việc (`job_id`), và dòng cuối cùng là tổng lương toàn công ty bằng cách nối 3 câu lệnh `SELECT` qua `UNION ALL`. Làm thế nào để đảm bảo các dòng của phần 1 luôn đứng trên phần 2, và phần 2 luôn đứng trên phần 3?**

* A. Không cần làm gì cả vì `UNION ALL` trong mọi trường hợp và mọi phiên bản đều được chuẩn SQL cam kết bảo toàn thứ tự vĩnh viễn kể cả khi chạy Parallel Query.
* B. Đặt mệnh đề `ORDER BY` riêng ở cuối mỗi câu `SELECT` thành phần.
* C. Thêm một cột hằng số đánh số thứ tự nhóm (ví dụ `1 AS sort_group` ở `SELECT` 1, `2 AS sort_group` ở `SELECT` 2, `3 AS sort_group` ở `SELECT` 3) và đặt `ORDER BY sort_group` ở cuối cùng của toàn bộ câu truy vấn.
* D. Đổi `UNION ALL` thành `UNION` để Oracle tự sắp xếp theo thứ tự câu lệnh.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Kỹ thuật chuẩn trong lập trình SQL để kiểm soát thứ tự hiển thị giữa các khối `SELECT` trong Compound Query là tạo thêm một cột giả đánh số thứ tự khối (`1 AS sort_order`, `2 AS sort_order`, `3 AS sort_order`) rồi dùng `ORDER BY sort_order` ở cuối cùng của câu truy vấn.
  * **A sai:** Về mặt lý thuyết tập hợp và khi thực thi song song (Parallel Execution), thứ tự dòng không bao giờ được đảm bảo nếu không có `ORDER BY`.
  * **B sai:** Đặt `ORDER BY` ở từng câu `SELECT` thành phần gây lỗi cú pháp `ORA-00933`.
  * **D sai:** `UNION` sắp xếp theo giá trị dữ liệu của các cột từ trái sang phải chứ không sắp xếp theo thứ tự câu lệnh `SELECT`.
</details>

---

### Câu 20 (Question 20)
**Cho bảng `EMP_DEPT10` có 3 dòng (không có dòng nào trùng nhau) và bảng `EMP_DEPT20` có 5 dòng (không có dòng nào trùng nhau). Biết rằng một nhân viên chỉ thuộc duy nhất 1 phòng ban (hai bảng hoàn toàn rời nhau, không có dòng nào chung). Phát biểu nào dưới đây là ĐÚNG?**

* A. `SELECT * FROM emp_dept10 UNION SELECT * FROM emp_dept20` và `SELECT * FROM emp_dept10 UNION ALL SELECT * FROM emp_dept20` đều trả về đúng 8 dòng dữ liệu như nhau, nhưng `UNION ALL` chạy nhanh hơn vì không phải thực hiện bước kiểm tra khử trùng lặp.
* B. `UNION` chạy nhanh hơn `UNION ALL`.
* C. `SELECT * FROM emp_dept10 INTERSECT SELECT * FROM emp_dept20` trả về 8 dòng.
* D. `SELECT * FROM emp_dept10 MINUS SELECT * FROM emp_dept20` trả về 0 dòng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Khi người lập trình biết chắc chắn từ logic nghiệp vụ rằng hai tập dữ liệu hoàn toàn rời nhau (mutually exclusive — không thể có bản ghi trùng nhau giữa hai tập và bản thân mỗi tập cũng không có dòng trùng), thì `UNION` và `UNION ALL` đều cho ra tập kết quả gồm 8 dòng giống nhau. Tuy nhiên, sử dụng **`UNION ALL` là Best Practice về hiệu năng** vì tránh được phép toán `SORT UNIQUE` / `HASH UNIQUE` không cần thiết của `UNION`.
  * **B, C, D sai:** `INTERSECT` của hai tập rời nhau trả về `0` dòng; `emp_dept10 MINUS emp_dept20` trả về nguyên vẹn `3` dòng của `emp_dept10`.
</details>

---

### Câu 21 (Question 21)
**Xét câu truy vấn dưới đây. Điều gì sẽ xảy ra khi thực thi?**

```sql
SELECT department_id, COUNT(*) AS total
FROM employees
GROUP BY department_id
UNION
SELECT NULL, COUNT(*)
FROM employees;
```

* A. Báo lỗi vì không được phép sử dụng mệnh đề `GROUP BY` trong các câu lệnh `SELECT` thành phần của `UNION`.
* B. Báo lỗi vì từ khóa `NULL` ở câu `SELECT` thứ hai không khớp kiểu dữ liệu `NUMBER` với `department_id`.
* C. Thực thi thành công: hiển thị số lượng nhân viên của từng phòng ban kèm theo dòng tổng số nhân viên toàn công ty (nhưng chú ý nếu trong bảng `employees` đã có sẵn một nhóm nhân viên có `department_id IS NULL` và có cùng số lượng với tổng công ty thì `UNION` sẽ gộp 2 dòng đó lại!).
* D. Báo lỗi vì câu `SELECT` thứ hai không có `GROUP BY`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Mỗi câu lệnh `SELECT` thành phần trong một Compound Query là một câu truy vấn hoàn chỉnh độc lập: nó hoàn toàn có thể có mệnh đề `WHERE`, `GROUP BY`, `HAVING`, `JOIN` riêng biệt của mình! Hơn nữa, literal `NULL` ở câu `SELECT` 2 hoàn toàn tương thích với cột `department_id` (`NUMBER`) ở câu `SELECT` 1.
  * **A, B, D sai:** Đều là các nhận định sai về cú pháp của Compound Query.
</details>

---

### Câu 22 (Question 22)
**Cho bảng `A` có các dòng `(1, 1, 1, 2)` và bảng `B` có các dòng `(1, 2, 2)`. Trong Oracle 21c, sự khác biệt giữa kết quả của `A MINUS B` và `A MINUS ALL B` (hoặc `A EXCEPT ALL B`) là gì?**

* A. Cả hai đều trả về `0` dòng.
* B. `A MINUS B` trả về `0` dòng, còn `A MINUS ALL B` trả về `2` dòng có giá trị là `(1, 1)`.
* C. `A MINUS B` trả về `1` dòng `(1)`, còn `A MINUS ALL B` trả về `0` dòng.
* D. Oracle 21c không hỗ trợ từ khóa `ALL` sau `MINUS` hoặc `EXCEPT`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * Với **`A MINUS B`** (khử trùng lặp theo tập hợp): Mọi giá trị `1` và `2` trong `A` đều có mặt trong `B`, nên bị loại bỏ hết $\rightarrow$ trả về **`0` dòng**.
    * Với **`A MINUS ALL B`** (hoặc `A EXCEPT ALL B` trong Oracle 21c — trừ theo số lần xuất hiện / Multiset): Số `1` xuất hiện **3 lần** trong `A` và xuất hiện **1 lần** trong `B`, nên hiệu số lần xuất hiện là $3 - 1 =$ **`2` dòng có giá trị `1`**! Còn số `2` xuất hiện 1 lần trong `A` và 2 lần trong `B` nên bị trừ hết.
  * **A, C, D sai:** Đây là tính năng mới rất hay của chuẩn SQL được bổ sung trong Oracle 21c.
</details>

---

### Câu 23 (Question 23)
**Tương tự Câu 22, với bảng `A` có `(1, 1, 1, 2)` và bảng `B` có `(1, 1, 2, 2)` trên Oracle 21c, kết quả của `A INTERSECT B` và `A INTERSECT ALL B` lần lượt có bao nhiêu dòng?**

* A. `2` dòng `(1, 2)` và `3` dòng `(1, 1, 2)`
* B. `2` dòng `(1, 2)` và `2` dòng `(1, 2)`
* C. `3` dòng `(1, 1, 2)` và `4` dòng `(1, 1, 2, 2)`
* D. `2` dòng `(1, 2)` và `4` dòng `(1, 1, 1, 2)`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:**
    * **`A INTERSECT B`:** Khử trùng lặp hoàn toàn, chỉ giữ lại mỗi giá trị chung 1 lần $\rightarrow$ **2 dòng** `(1, 2)`.
    * **`A INTERSECT ALL B`:** Giữ lại số lần xuất hiện chung tối thiểu ($\min(\text{count}_A, \text{count}_B)$) của mỗi phần tử:
      * Số `1` xuất hiện 3 lần ở `A` và 2 lần ở `B` $\rightarrow$ lấy $\min(3, 2) = 2$ lần.
      * Số `2` xuất hiện 1 lần ở `A` và 2 lần ở `B` $\rightarrow$ lấy $\min(1, 2) = 1$ lần.
      * Tổng cộng trả về **3 dòng**: `(1, 1, 2)`.
  * **B, C, D sai:** Tính sai công thức $\min(\text{count}_A, \text{count}_B)$ của `INTERSECT ALL`.
</details>

---

### Câu 24 (Question 24)
**Bạn muốn kiểm tra xem hai bảng `EMP_BACKUP` và `EMP_CURRENT` (có cùng cấu trúc cột) có chứa dữ liệu giống hệt nhau hoàn toàn (về mặt tập hợp các dòng duy nhất) hay không. Câu truy vấn nào dưới đây sẽ trả về `0` dòng khi và chỉ khi hai bảng có tập các dòng duy nhất giống hệt nhau?**

```sql
-- Giả sử mỗi bảng không có dòng trùng lặp nội bộ
```

* A. `(SELECT * FROM emp_backup MINUS SELECT * FROM emp_current) UNION ALL (SELECT * FROM emp_current MINUS SELECT * FROM emp_backup);`
* B. `SELECT * FROM emp_backup MINUS SELECT * FROM emp_current;`
* C. `SELECT * FROM emp_backup INTERSECT SELECT * FROM emp_current;`
* D. `SELECT * FROM emp_backup UNION SELECT * FROM emp_current;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Đây là mẫu truy vấn đối soát dữ liệu (Data Reconciliation / Symmetric Difference $(A \setminus B) \cup (B \setminus A)$) kinh điển trong thực tế tại VNPT và các hệ thống ngân hàng/viễn thông!
    * Nếu chỉ kiểm tra một chiều `emp_backup MINUS emp_current` (**Câu B**), khi `emp_backup` là tập con của `emp_current` (tức `emp_current` có dư thêm 100 dòng mới), phép `MINUS` một chiều vẫn trả về `0` dòng!
    * Do đó, bắt buộc phải kết hợp cả hai chiều: `(A MINUS B) UNION ALL (B MINUS A)` để phát hiện cả dòng thừa ở `A` lẫn dòng thừa ở `B`.
  * **B, C, D sai:** Không đảm bảo tính đối xứng khi đối soát hai bảng.
</details>

---

### Câu 25 (Question 25)
**Xét câu truy vấn hợp dưới đây. Phát biểu nào mô tả ĐÚNG NHẤT về câu truy vấn này?**

```sql
SELECT department_id, job_id
FROM employees
INTERSECT
SELECT department_id, job_id
FROM job_history
ORDER BY 1, job_id DESC;
```

* A. Báo lỗi vì trong mệnh đề `ORDER BY` không được phép trộn lẫn cách viết vị trí số (`1`) và tên cột (`job_id`).
* B. Thực thi thành công: tìm tất cả các nhân viên hiện đang làm đúng công việc và đúng phòng ban mà họ đã từng làm trong quá khứ.
* C. Thực thi thành công: tìm các cặp `(department_id, job_id)` vừa xuất hiện trong bảng `employees` vừa xuất hiện trong bảng `job_history`, sắp xếp theo `department_id` tăng dần và `job_id` giảm dần.
* D. Báo lỗi vì thiếu bí danh cột ở câu `SELECT` đầu tiên.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:**
    * Trong mệnh đề `ORDER BY` (kể cả của Compound Query), việc kết hợp vị trí số thứ tự cột (`1`) và tên cột của câu `SELECT` đầu tiên (`job_id`) là **hoàn toàn hợp lệ**.
    * Về mặt ngữ nghĩa: Vì danh sách `SELECT` chỉ có 2 cột là `department_id` và `job_id` (không có cột `employee_id`), nên phép `INTERSECT` chỉ tìm các cặp `(department_id, job_id)` xuất hiện ở cả hai bảng (không nhất thiết của cùng một nhân viên!).
  * **A, D sai:** Cú pháp hoàn toàn hợp lệ.
  * **B sai:** B mắc bẫy đọc hiểu ngữ nghĩa — muốn tìm đúng nhân viên làm lại công việc cũ ở phòng ban cũ thì danh sách `SELECT` của cả hai bảng phải có mặt cột `employee_id`: `SELECT employee_id, department_id, job_id ...`!
</details>

---
