# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 6: Hàm Tổng Hợp và GROUP BY

> **Mục tiêu:** Đánh giá toàn diện kiến thức Chương 6 (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `LISTAGG`, `GROUP BY`, `HAVING`, xử lý `NULL`, lồng hàm tổng hợp 2 cấp) theo chuẩn đề thi **Oracle Database SQL (1Z0-071)** và kỳ thi sát hạch **VNPT**.  
> **Số lượng:** 25 câu hỏi trắc nghiệm kèm đáp án và phân tích chuyên sâu.  
> **Cách học:** Hãy tự phân tích và chọn đáp án trước khi bấm vào **"👉 Xem Đáp Án & Giải Thích Chi Tiết"**.

---

### Câu 1 (Question 1)
**Cho bảng `EMPLOYEES` với các cột: `LAST_NAME` (`VARCHAR2`), `HIRE_DATE` (`DATE`), và `SALARY` (`NUMBER`). Câu lệnh SQL nào dưới đây sẽ thực thi THÀNH CÔNG mà không báo lỗi?**

* A. `SELECT SUM(hire_date), AVG(salary) FROM employees;`
* B. `SELECT MIN(last_name), MAX(hire_date), COUNT(salary) FROM employees;`
* C. `SELECT AVG(last_name), MIN(salary) FROM employees;`
* D. `SELECT MAX(hire_date), AVG(hire_date) FROM employees;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Các hàm `MIN`, `MAX` và `COUNT` có thể nhận đối số thuộc mọi kiểu dữ liệu có thể so sánh được (bao gồm `NUMBER`, `VARCHAR2`, `DATE`, `TIMESTAMP`).
    * `MIN(last_name)` trả về tên nhân viên đứng đầu theo thứ tự bảng chữ cái.
    * `MAX(hire_date)` trả về ngày tuyển dụng gần đây nhất (mới nhất).
    * `COUNT(salary)` trả về số dòng có lương khác `NULL`.
  * **A, C, D sai:** Hai hàm `SUM` và `AVG` **chỉ chấp nhận đối số kiểu số (`NUMBER`)**. Việc truyền cột `hire_date` (`DATE`) hoặc `last_name` (`VARCHAR2`) vào `SUM`/`AVG` sẽ gây lỗi `ORA-00932: inconsistent datatypes` hoặc `ORA-01722: invalid number`.
</details>

---

### Câu 2 (Question 2)
**Cho bảng `SALES_BONUS` có đúng 4 dòng dữ liệu với giá trị cột `BONUS` lần lượt là: `100`, `200`, `300`, và `NULL`. Kết quả của câu truy vấn dưới đây là gì?**

```sql
SELECT AVG(bonus)          AS a1,
       AVG(NVL(bonus, 0))  AS a2,
       COUNT(bonus)        AS c1,
       COUNT(*)            AS c2
FROM sales_bonus;
```

* A. `A1 = 150`, `A2 = 150`, `C1 = 3`, `C2 = 4`
* B. `A1 = 200`, `A2 = 150`, `C1 = 3`, `C2 = 4`
* C. `A1 = NULL`, `A2 = 150`, `C1 = 3`, `C2 = 4`
* D. `A1 = 200`, `A2 = 200`, `C1 = 4`, `C2 = 4`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Mọi hàm tổng hợp (ngoại trừ `COUNT(*)`) đều **bỏ qua hoàn toàn các giá trị `NULL`**:
    * `AVG(bonus)`: Bỏ qua dòng `NULL`, chỉ tính trung bình trên 3 dòng có giá trị: `(100 + 200 + 300) / 3 = 200`.
    * `AVG(NVL(bonus, 0))`: Hàm đơn dòng `NVL` chạy trước trên từng dòng, biến dòng `NULL` thành `0`. Khi đó cả 4 dòng đều khác `NULL`: `(100 + 200 + 300 + 0) / 4 = 150`.
    * `COUNT(bonus)`: Đếm các dòng có `bonus IS NOT NULL` $\rightarrow$ `3`.
    * `COUNT(*)`: Đếm toàn bộ số dòng trong bảng (bao gồm cả dòng `NULL`) $\rightarrow$ `4`.
  * **A, C, D sai:** Nhầm lẫn quy tắc bỏ qua `NULL` của `AVG` và `COUNT(column)`.
</details>

---

### Câu 3 (Question 3)
**Cho bảng `TEST_DATA` gồm 5 dòng, trong đó cột `VAL` có các giá trị: `10`, `10`, `20`, `NULL`, `NULL`. Kết quả trả về của câu lệnh SQL sau là gì?**

```sql
SELECT COUNT(*)            AS r1,
       COUNT(1)            AS r2,
       COUNT(val)          AS r3,
       COUNT(DISTINCT val) AS r4,
       SUM(DISTINCT val)   AS r5
FROM test_data;
```

* A. `R1 = 5`, `R2 = 5`, `R3 = 3`, `R4 = 2`, `R5 = 30`
* B. `R1 = 5`, `R2 = 5`, `R3 = 3`, `R4 = 3`, `R5 = 40`
* C. `R1 = 5`, `R2 = 3`, `R3 = 3`, `R4 = 2`, `R5 = 30`
* D. `R1 = 3`, `R2 = 3`, `R3 = 3`, `R4 = 2`, `R5 = 30`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:**
    * `COUNT(*)` và `COUNT(1)` đều đếm tổng số dòng của bảng (vì hằng số `1` luôn khác `NULL` trên cả 5 dòng) $\rightarrow$ `R1 = 5`, `R2 = 5`.
    * `COUNT(val)` bỏ qua 2 dòng `NULL`, đếm 3 dòng (`10`, `10`, `20`) $\rightarrow$ `R3 = 3`.
    * `COUNT(DISTINCT val)` bỏ qua `NULL` và loại bỏ giá trị trùng lặp, chỉ còn 2 giá trị phân biệt là `10` và `20` $\rightarrow$ `R4 = 2`.
    * `SUM(DISTINCT val)` chỉ cộng các giá trị phân biệt khác `NULL` (`10 + 20`) $\rightarrow$ `R5 = 30`.
  * **B, C, D sai:** B tính cả `NULL` vào `COUNT(DISTINCT val)`; C hiểu nhầm `COUNT(1)` đếm cột thứ nhất.
</details>

---

### Câu 4 (Question 4)
**Phát biểu nào sau đây là ĐÚNG khi nói về sự khác biệt giữa `COUNT(*)` và `COUNT(1)` trong Oracle Database?**

* A. `COUNT(1)` chạy nhanh hơn `COUNT(*)` vì nó chỉ đọc cột đầu tiên của bảng thay vì đọc tất cả các cột.
* B. `COUNT(1)` có nghĩa là đếm giá trị của cột thứ nhất trong bảng (nếu cột thứ nhất bị `NULL` thì không đếm).
* C. `COUNT(*)` và `COUNT(1)` cho kết quả giống hệt nhau và được bộ tối ưu hóa của Oracle (Cost-Based Optimizer) thực thi với cùng một kế hoạch thực thi (Execution Plan).
* D. `COUNT(1)` không hợp lệ khi bảng không có khóa chính (Primary Key).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong `COUNT(1)`, số `1` là một **biểu thức hằng số (literal number)**, hoàn toàn không phải số thứ tự cột! Vì hằng số `1` không bao giờ là `NULL`, Oracle Cost-Based Optimizer (CBO) tự động chuyển đổi `COUNT(1)` thành `COUNT(*)` ở tầng nội bộ. Cả hai có tốc độ và Execution Plan giống hệt nhau 100%.
  * **A, B, D sai:** Đây là những lầm tưởng (myths) rất phổ biến. `COUNT(*)` trong Oracle không hề đọc dữ liệu của tất cả các cột mà chỉ đếm row header hoặc quét index nhỏ nhất có `NOT NULL`.
</details>

---

### Câu 5 (Question 5)
**Khi thực thi câu lệnh SQL dưới đây, điều gì sẽ xảy ra?**

```sql
SELECT department_id, job_id, AVG(salary)
FROM employees
GROUP BY department_id;
```

* A. Câu lệnh chạy thành công và hiển thị `job_id` đầu tiên tìm thấy của mỗi `department_id`.
* B. Câu lệnh chạy thành công và hiển thị `NULL` ở cột `job_id`.
* C. Báo lỗi `ORA-00979: not a GROUP BY expression`.
* D. Báo lỗi `ORA-00934: group function is not allowed here`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Quy tắc bắt buộc của mệnh đề `GROUP BY` trong Oracle SQL: Mọi cột hoặc biểu thức xuất hiện trong danh sách `SELECT` mà **không nằm trong hàm tổng hợp** thì **bắt buộc phải được liệt kê trong mệnh đề `GROUP BY`**. Ở đây cột `job_id` nằm trên `SELECT` nhưng lại vắng mặt trong `GROUP BY department_id`, dẫn đến lỗi `ORA-00979: not a GROUP BY expression`.
  * **A, B, D sai:** Oracle tuân thủ nghiêm ngặt chuẩn SQL và không bao giờ tự ý chọn một giá trị ngẫu nhiên cho cột không nằm trong `GROUP BY`.
</details>

---

### Câu 6 (Question 6)
**Xét câu truy vấn sau đây trên bảng `EMPLOYEES`. Kết quả thực thi sẽ như thế nào?**

```sql
SELECT COUNT(*), SUM(salary)
FROM employees
GROUP BY department_id;
```

* A. Báo lỗi vì cột `department_id` có trong `GROUP BY` nhưng không xuất hiện trong mệnh đề `SELECT`.
* B. Chỉ trả về đúng 1 dòng tổng hợp cho toàn bộ bảng `EMPLOYEES`.
* C. Thực thi thành công và trả về số lượng nhân viên cùng tổng lương cho mỗi `department_id` (mỗi phòng ban 1 dòng, nhưng không hiển thị mã phòng ban).
* D. Báo lỗi `ORA-00937: not a single-group group function`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Mặc dù cột đơn lẻ trên `SELECT` bắt buộc phải có trong `GROUP BY`, nhưng **chiều ngược lại thì không bắt buộc**! Một cột xuất hiện trong mệnh đề `GROUP BY` (`department_id`) hoàn toàn không cần phải xuất hiện trên mệnh đề `SELECT`. Câu lệnh vẫn chia bảng thành các nhóm theo từng `department_id` và trả về một dòng kết quả (`COUNT(*)`, `SUM(salary)`) cho mỗi nhóm.
  * **A, B, D sai:** Đây là bẫy rất hay gặp trong đề thi OCA 1Z0-071 nhằm kiểm tra xem thí sinh có nắm vững quy tắc một chiều giữa `SELECT` và `GROUP BY` hay không.
</details>

---

### Câu 7 (Question 7)
**Tại sao câu lệnh SQL dưới đây lại báo lỗi khi thực thi?**

```sql
SELECT department_id AS dept_no, AVG(salary) AS avg_sal
FROM employees
GROUP BY dept_no
ORDER BY avg_sal DESC;
```

* A. Vì không được phép dùng bí danh cột (`avg_sal`) trong mệnh đề `ORDER BY`.
* B. Vì không được phép dùng bí danh cột (`dept_no`) trong mệnh đề `GROUP BY`.
* C. Vì hàm `AVG(salary)` phải được làm tròn bằng `ROUND` trước khi sắp xếp.
* D. Vì thiếu mệnh đề `HAVING` đi kèm với `GROUP BY`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Theo thứ tự thực thi logic của câu lệnh SQL (`FROM` $\rightarrow$ `WHERE` $\rightarrow$ `GROUP BY` $\rightarrow$ `HAVING` $\rightarrow$ `SELECT` $\rightarrow$ `ORDER BY`), mệnh đề `GROUP BY` được thực thi **trước** mệnh đề `SELECT`. Tại thời điểm `GROUP BY` chạy, bí danh cột `dept_no` chưa được khởi tạo nên Oracle báo lỗi `ORA-00904: "DEPT_NO": invalid identifier`.
  * **A, C, D sai:** Mệnh đề `ORDER BY` chạy cuối cùng (sau `SELECT`) nên việc dùng bí danh `avg_sal` trong `ORDER BY` là hoàn toàn hợp lệ.
</details>

---

### Câu 8 (Question 8)
**Cho bảng `EMPLOYEES` có 107 dòng, trong đó có 3 nhân viên chưa được phân vào phòng ban nào (`DEPARTMENT_ID IS NULL`). Nếu thực thi câu lệnh sau thì các dòng có `DEPARTMENT_ID IS NULL` sẽ được xử lý như thế nào?**

```sql
SELECT department_id, COUNT(*)
FROM employees
GROUP BY department_id;
```

* A. Mệnh đề `GROUP BY` tự động bỏ qua tất cả các dòng có `DEPARTMENT_ID IS NULL`.
* B. Mỗi dòng có `DEPARTMENT_ID IS NULL` sẽ tạo thành một nhóm riêng biệt (3 dòng kết quả có `COUNT(*) = 1`) vì `NULL` không bằng `NULL`.
* C. Tất cả 3 dòng có `DEPARTMENT_ID IS NULL` được gom chung vào một nhóm `NULL` duy nhất và trả về 1 dòng có `department_id = NULL`, `COUNT(*) = 3`.
* D. Câu lệnh báo lỗi vì cột dùng trong `GROUP BY` không được phép chứa giá trị `NULL`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong mệnh đề `GROUP BY` (cũng như `ORDER BY`, `DISTINCT` và toán tử tập hợp), Oracle coi các giá trị `NULL` là **thuộc cùng một nhóm tương đương nhau**. Do đó cả 3 nhân viên có `department_id IS NULL` được gom lại thành 1 nhóm duy nhất với kết quả đếm `COUNT(*) = 3`.
  * **A, B, D sai:** Chỉ có hàm tổng hợp như `COUNT(department_id)` mới bỏ qua `NULL`, còn bản thân mệnh đề `GROUP BY department_id` không bao giờ loại bỏ các dòng `NULL` khỏi tập kết quả.
</details>

---

### Câu 9 (Question 9)
**Câu lệnh SQL nào dưới đây là ĐÚNG để lấy ra các phòng ban có tổng quỹ lương (`SUM(salary)`) lớn hơn `50000` ở những phòng ban có mã phòng ban lớn hơn `20`?**

* A. `SELECT department_id, SUM(salary) FROM employees WHERE department_id > 20 AND SUM(salary) > 50000 GROUP BY department_id;`
* B. `SELECT department_id, SUM(salary) FROM employees WHERE department_id > 20 GROUP BY department_id HAVING SUM(salary) > 50000;`
* C. `SELECT department_id, SUM(salary) FROM employees HAVING SUM(salary) > 50000 AND salary > 20 GROUP BY department_id;`
* D. `SELECT department_id, SUM(salary) FROM employees GROUP BY department_id WHERE department_id > 20 HAVING SUM(salary) > 50000;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Điều kiện lọc trên cột đơn (`department_id > 20`) được đặt trong mệnh đề `WHERE` để loại bỏ sớm các dòng không cần thiết trước khi gom nhóm; sau đó gom nhóm bằng `GROUP BY department_id` và lọc điều kiện hàm tổng hợp (`SUM(salary) > 50000`) bằng mệnh đề `HAVING`.
  * **A sai:** Đặt hàm tổng hợp `SUM(salary)` trong mệnh đề `WHERE` gây lỗi `ORA-00934: group function is not allowed here`.
  * **C sai:** Trong `HAVING` không được phép tham chiếu đến cột đơn `salary` không nằm trong `GROUP BY` và không bọc hàm tổng hợp (`ORA-00979`).
  * **D sai:** Sai thứ tự cú pháp SQL: mệnh đề `WHERE` bắt buộc phải đứng **trước** `GROUP BY`.
</details>

---

### Câu 10 (Question 10)
**Xét câu truy vấn sau trong Oracle Database. Điều gì sẽ xảy ra khi thực thi?**

```sql
SELECT department_id, COUNT(*)
FROM employees
HAVING COUNT(*) >= 5
GROUP BY department_id;
```

* A. Báo lỗi cú pháp vì mệnh đề `HAVING` bắt buộc phải viết sau mệnh đề `GROUP BY`.
* B. Thực thi thành công và trả về các phòng ban có từ 5 nhân viên trở lên.
* C. Báo lỗi vì hàm `COUNT(*)` trong `HAVING` không có bí danh.
* D. Trả về tất cả các phòng ban vì `HAVING` chạy trước `GROUP BY` nên điều kiện bị vô hiệu hóa.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong cú pháp Oracle SQL, mệnh đề `HAVING` và `GROUP BY` có thể **hoán đổi vị trí cho nhau** (viết `GROUP BY ... HAVING ...` hay `HAVING ... GROUP BY ...` đều hoàn toàn hợp lệ về mặt cú pháp!). Dù viết `HAVING` trước hay sau, về mặt logic, Oracle Engine vẫn luôn thực hiện `GROUP BY` (chia nhóm) trước rồi mới áp dụng điều kiện lọc `HAVING`.
  * **A, C, D sai:** Đề thi OCA 1Z0-071 rất hay đảo `HAVING` lên trước `GROUP BY` để bẫy những thí sinh chỉ học thuộc lòng thứ tự viết thông thường.
</details>

---

### Câu 11 (Question 11)
**Câu lệnh SQL nào dưới đây là HỢP LỆ khi sử dụng mệnh đề `HAVING`?**

```sql
-- Xét cấu trúc bảng EMPLOYEES(employee_id, last_name, job_id, department_id, salary)
```

* A. `SELECT department_id, AVG(salary) FROM employees GROUP BY department_id HAVING MAX(salary) > 12000;`
* B. `SELECT department_id, AVG(salary) FROM employees GROUP BY department_id HAVING salary > 12000;`
* C. `SELECT department_id, AVG(salary) FROM employees GROUP BY department_id HAVING job_id = 'IT_PROG';`
* D. `SELECT department_id, AVG(salary) AS avg_sal FROM employees GROUP BY department_id HAVING avg_sal > 8000;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Hàm tổng hợp được sử dụng trong mệnh đề `HAVING` (`MAX(salary)`) **không bắt buộc phải giống** với hàm tổng hợp được hiển thị trên mệnh đề `SELECT` (`AVG(salary)`). Với mỗi nhóm `department_id`, Oracle hoàn toàn có thể kiểm tra xem lương cao nhất của nhóm đó có `> 12000` hay không, nếu thỏa mãn thì hiển thị lương trung bình `AVG(salary)` của nhóm đó.
  * **B và C sai:** Cột `salary` và `job_id` trong `HAVING` không nằm trong hàm tổng hợp và cũng không có trong `GROUP BY department_id`, gây lỗi `ORA-00979`.
  * **D sai:** Không được sử dụng bí danh cột (`avg_sal`) trong mệnh đề `HAVING` (`ORA-00904`).
</details>

---

### Câu 12 (Question 12)
**Trong Oracle SQL, hàm tổng hợp (Aggregate Function) có thể được lồng vào nhau tối đa bao nhiêu cấp?**

* A. Không được phép lồng hàm tổng hợp vào nhau (chỉ 1 cấp).
* B. Tối đa **2 cấp** (ví dụ: `MAX(AVG(salary))`).
* C. Tối đa **3 cấp** (ví dụ: `SUM(MAX(AVG(salary)))`).
* D. Không giới hạn số cấp lồng nhau, giống như Single-Row Functions.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong khi Single-Row Functions có thể lồng nhau không giới hạn cấp độ, thì Aggregate Functions trong Oracle SQL chỉ cho phép lồng nhau **tối đa 2 cấp** (ví dụ `MAX(AVG(salary))`, `MIN(COUNT(*))`). Nếu lồng từ 3 cấp trở lên sẽ gặp lỗi `ORA-00935: group function is nested too deeply`.
  * **A, C, D sai:** Sai giới hạn độ sâu lồng hàm tổng hợp của Oracle SQL.
</details>

---

### Câu 13 (Question 13)
**Khi thực thi câu lệnh SQL dưới đây, kết quả sẽ là gì?**

```sql
SELECT department_id, MAX(AVG(salary))
FROM employees
GROUP BY department_id;
```

* A. Hiển thị mã phòng ban có mức lương trung bình cao nhất kèm giá trị trung bình đó.
* B. Hiển thị tất cả các mã phòng ban kèm mức lương trung bình cao nhất lặp lại ở mọi dòng.
* C. Báo lỗi `ORA-00937: not a single-group group function`.
* D. Báo lỗi `ORA-00978: nested group function without GROUP BY`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khi lồng hàm tổng hợp 2 cấp (`MAX(AVG(salary))`) đi kèm `GROUP BY department_id`, hàm bên trong `AVG(salary)` gom các dòng theo từng phòng ban, còn hàm bên ngoài `MAX(...)` lại gom tiếp tất cả các kết quả trung bình của các phòng ban thành **một giá trị duy nhất cho toàn bảng**. Do đó, mệnh đề `SELECT` **tuyệt đối không được phép chứa thêm bất kỳ cột đơn nào** (kể cả cột `department_id` đã có trong `GROUP BY`). Việc để `department_id` trên `SELECT` gây ra lỗi kinh điển `ORA-00937: not a single-group group function`.
  * **A, B, D sai:** D chỉ xảy ra khi quên viết `GROUP BY`; ở đây đã có `GROUP BY` nhưng dư cột `department_id` trên `SELECT`.
</details>

---

### Câu 14 (Question 14)
**Điều gì sẽ xảy ra khi chạy câu lệnh SQL sau đây?**

```sql
SELECT MAX(AVG(salary))
FROM employees;
```

* A. Trả về mức lương trung bình của toàn bộ bảng `EMPLOYEES`.
* B. Báo lỗi `ORA-00978: nested group function without GROUP BY`.
* C. Báo lỗi `ORA-00934: group function is not allowed here`.
* D. Trả về `NULL`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Để lồng hàm tổng hợp 2 cấp (`MAX(AVG(salary))`), câu lệnh SQL **bắt buộc phải có mệnh đề `GROUP BY`**. Nếu không có `GROUP BY`, Oracle báo lỗi `ORA-00978: nested group function without GROUP BY`.
  * **A, C, D sai:** Không thể lồng 2 hàm tổng hợp mà thiếu `GROUP BY`.
</details>

---

### Câu 15 (Question 15)
**Cho bảng `EMPLOYEES` có dữ liệu. Nếu thực thi câu truy vấn dưới đây mà không có nhân viên nào có lương lớn hơn `999999` (tức điều kiện `WHERE` lọc ra 0 dòng), kết quả trả về sẽ gồm bao nhiêu dòng và giá trị là gì?**

```sql
SELECT COUNT(*) AS cnt, SUM(salary) AS total_sal, MAX(salary) AS max_sal
FROM employees
WHERE salary > 999999;
```

* A. Trả về **0 dòng** (`No rows selected`).
* B. Trả về **1 dòng** với: `CNT = 0`, `TOTAL_SAL = 0`, `MAX_SAL = 0`.
* C. Trả về **1 dòng** với: `CNT = 0`, `TOTAL_SAL = NULL`, `MAX_SAL = NULL`.
* D. Trả về **1 dòng** với: `CNT = NULL`, `TOTAL_SAL = NULL`, `MAX_SAL = NULL`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khi câu truy vấn sử dụng hàm tổng hợp trên `SELECT` mà **không có mệnh đề `GROUP BY`**, nó **luôn luôn trả về đúng 1 dòng kết quả** (kể cả khi bảng rỗng hoặc điều kiện `WHERE` không khớp dòng nào!). Trên tập rỗng đó:
    * Hàm `COUNT(*)` (và `COUNT(col)`) trả về **`0`**.
    * Tất cả các hàm tổng hợp khác (`SUM`, `AVG`, `MIN`, `MAX`, `LISTAGG`) đều trả về **`NULL`** (chứ không phải `0`!).
  * **A, B, D sai:** Chỉ khi câu lệnh **có `GROUP BY`** mà `WHERE` lọc hết sạch các dòng thì kết quả mới trả về 0 dòng (`No rows selected`).
</details>

---

### Câu 16 (Question 16)
**Ngược lại với câu 15, nếu thêm mệnh đề `GROUP BY department_id` vào câu truy vấn mà điều kiện `WHERE salary > 999999` vẫn không khớp với bất kỳ dòng nào, thì kết quả trả về là gì?**

```sql
SELECT department_id, COUNT(*) AS cnt, SUM(salary) AS total_sal
FROM employees
WHERE salary > 999999
GROUP BY department_id;
```

* A. Trả về **0 dòng** (`No rows selected`).
* B. Trả về **1 dòng** với: `DEPARTMENT_ID = NULL`, `CNT = 0`, `TOTAL_SAL = NULL`.
* C. Trả về danh sách tất cả các `department_id` với `CNT = 0` và `TOTAL_SAL = 0`.
* D. Báo lỗi runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Vì mệnh đề `WHERE` chạy trước `GROUP BY` và loại bỏ toàn bộ các dòng, nên bước `GROUP BY department_id` nhận đầu vào là 0 dòng và không thể tạo ra bất kỳ nhóm `department_id` nào. Do không có nhóm nào được hình thành, câu truy vấn trả về **0 dòng (`No rows selected`)**.
  * **B, C, D sai:** Đây là sự khác biệt tinh tế nhưng rất quan trọng giữa câu truy vấn tổng hợp toàn bảng (không `GROUP BY` $\rightarrow$ luôn ra 1 dòng) và câu truy vấn có `GROUP BY` (có thể ra 0 dòng).
</details>

---

### Câu 17 (Question 17)
**Cho bảng `STAFF` có 3 nhân viên thuộc phòng ban `10`: `('AN', 3000)`, `('BINH', 5000)`, `('CUONG', NULL)`. Kết quả của hàm `LISTAGG` trong câu lệnh dưới đây là gì?**

```sql
SELECT LISTAGG(ename, '-') WITHIN GROUP (ORDER BY salary DESC NULLS LAST) AS staff_names
FROM staff
WHERE dept_id = 10;
```

* A. `'BINH-AN-CUONG'`
* B. `'BINH-AN-'`
* C. `'AN-BINH-CUONG'`
* D. `NULL` vì có một dòng chứa `salary IS NULL`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Hàm `LISTAGG(ename, '-')` nối giá trị của cột `ename` (cột này có đủ 3 tên `'AN'`, `'BINH'`, `'CUONG'` đều khác `NULL`), được sắp xếp theo `salary` giảm dần và đẩy `NULL` xuống cuối (`ORDER BY salary DESC NULLS LAST`). Thứ tự lương sẽ là: `5000` (`'BINH'`) $\rightarrow$ `3000` (`'AN'`) $\rightarrow$ `NULL` (`'CUONG'`). Kết quả ghép chuỗi là `'BINH-AN-CUONG'`. (Lưu ý: chỉ khi bản thân cột `ename` bị `NULL` thì giá trị `ename` đó mới bị `LISTAGG` bỏ qua).
  * **B, C, D sai:** Nhầm giữa việc cột sắp xếp (`salary`) bị `NULL` với việc cột hiển thị (`ename`) bị `NULL`.
</details>

---

### Câu 18 (Question 18)
**Trong câu lệnh SQL có thể kết hợp hàm đơn dòng (Single-Row Function) và hàm tổng hợp (Aggregate Function) trong cùng một biểu thức được không? Hãy chọn câu lệnh HỢP LỆ dưới đây:**

* A. `SELECT department_id, ROUND(AVG(NVL(commission_pct, 0)), 2) FROM employees GROUP BY department_id;`
* B. `SELECT UPPER(last_name), AVG(salary) FROM employees;`
* C. `SELECT SUBSTR(job_id, 1, 2), SUM(salary) FROM employees GROUP BY job_id;`
* D. Cả A và C đều hợp lệ.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng (Cả A và C đều hợp lệ):**
    * **Câu A hợp lệ:** Hàm đơn dòng `NVL` chạy bên trong từng dòng trước, sau đó hàm tổng hợp `AVG` tính trung bình cho mỗi nhóm `department_id`, rồi hàm đơn dòng `ROUND` làm tròn kết quả của từng nhóm.
    * **Câu C hợp lệ:** Vì cột gốc `job_id` đã có mặt đầy đủ trong `GROUP BY job_id`, nên trên mệnh đề `SELECT` ta hoàn toàn có thể áp dụng bất kỳ hàm đơn dòng nào lên `job_id` (như `SUBSTR(job_id, 1, 2)`) mà không vi phạm lỗi `ORA-00979`! (Lưu ý: chiều ngược lại nếu `GROUP BY SUBSTR(job_id, 1, 2)` thì trên `SELECT` không được viết `job_id` đứng riêng lẻ).
  * **B sai:** Kết hợp hàm đơn dòng `UPPER(last_name)` với hàm tổng hợp `AVG(salary)` nhưng thiếu `GROUP BY` sẽ gây lỗi `ORA-00937`.
</details>

---

### Câu 19 (Question 19)
**Xét câu truy vấn dưới đây. Kết quả thực thi sẽ như thế nào?**

```sql
SELECT SUBSTR(job_id, 1, 2) AS job_prefix, COUNT(*)
FROM employees
GROUP BY SUBSTR(job_id, 1, 2);
```

* A. Báo lỗi vì không được phép đặt hàm `SUBSTR` trong mệnh đề `GROUP BY`.
* B. Báo lỗi vì thiếu cột `job_id` đứng độc lập trong `GROUP BY`.
* C. Thực thi thành công và gom nhóm các nhân viên có cùng 2 ký tự đầu của `job_id`.
* D. Thực thi thành công nhưng chỉ khi xóa bí danh `AS job_prefix`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Mệnh đề `GROUP BY` hoàn toàn cho phép gom nhóm theo một **biểu thức hoặc hàm đơn dòng** (`SUBSTR(job_id, 1, 2)`). Miễn là biểu thức trên `SELECT` (`SUBSTR(job_id, 1, 2)`) khớp chính xác với biểu thức trong `GROUP BY`, câu lệnh chạy thành công 100%.
  * **A, B, D sai:** Single-row functions được phép dùng trong `GROUP BY`; chỉ có Aggregate functions và Column Aliases mới bị cấm trong `GROUP BY`.
</details>

---

### Câu 20 (Question 20)
**Ngược lại với câu 19, điều gì sẽ xảy ra khi thực thi câu lệnh SQL sau?**

```sql
SELECT job_id, COUNT(*)
FROM employees
GROUP BY SUBSTR(job_id, 1, 2);
```

* A. Thực thi thành công vì `job_id` đã xuất hiện bên trong hàm `SUBSTR` của `GROUP BY`.
* B. Báo lỗi `ORA-00979: not a GROUP BY expression`.
* C. Thực thi thành công và hiển thị 2 ký tự đầu của `job_id`.
* D. Báo lỗi `ORA-00937: not a single-group group function`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi bạn gom nhóm theo `GROUP BY SUBSTR(job_id, 1, 2)`, nhiều mã công việc khác nhau có cùng 2 ký tự đầu (ví dụ `'AD_PRES'`, `'AD_VP'`, `'AD_ASST'`) sẽ bị gộp chung vào một nhóm `'AD'`. Do đó, trên mệnh đề `SELECT`, Oracle không thể biết phải hiển thị giá trị `job_id` đầy đủ nào cho nhóm `'AD'`, dẫn đến lỗi `ORA-00979: not a GROUP BY expression`.
  * **A, C, D sai:** Hãy nhớ quy tắc: ग्रुप theo cột gốc (`GROUP BY col`) thì `SELECT FUNC(col)` được; nhưng nhóm theo biểu thức (`GROUP BY FUNC(col)`) thì **không** thể `SELECT col` đứng trơ trọi!
</details>

---

### Câu 21 (Question 21)
**Hai câu truy vấn dưới đây có cho kết quả giống nhau không, và câu nào tối ưu hiệu năng hơn?**

```sql
-- Truy vấn 1:
SELECT department_id, AVG(salary)
FROM employees
WHERE department_id IN (10, 20, 30)
GROUP BY department_id;

-- Truy vấn 2:
SELECT department_id, AVG(salary)
FROM employees
GROUP BY department_id
HAVING department_id IN (10, 20, 30);
```

* A. Truy vấn 2 báo lỗi vì `HAVING` bắt buộc phải chứa hàm tổng hợp như `COUNT`, `SUM`, `AVG`.
* B. Cả hai truy vấn đều hợp lệ, trả về kết quả giống hệt nhau, và Truy vấn 1 tối ưu hơn về mặt logic vì lọc bỏ các dòng không thuộc phòng ban `10, 20, 30` ngay trước khi thực hiện gom nhóm.
* C. Cả hai truy vấn đều hợp lệ nhưng trả về kết quả khác nhau.
* D. Truy vấn 2 chạy nhanh hơn Truy vấn 1 vì lọc sau khi gom nhóm ít tốn CPU hơn.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * Mệnh đề `HAVING` **không bắt buộc** phải chứa hàm tổng hợp; nó có thể chứa điều kiện kiểm tra trên chính các cột đã được liệt kê trong `GROUP BY` (`department_id`). Do đó cả hai truy vấn đều hợp lệ và cho kết quả giống hệt nhau.
    * Tuy nhiên, về nguyên tắc viết SQL chuẩn và hiệu năng, **Truy vấn 1 tốt hơn** vì mệnh đề `WHERE` loại bỏ ngay các dòng của các phòng ban khác (40, 50, 60...) trước khi thực hiện phép toán `GROUP BY` đắt đỏ.
  * **A, C, D sai:** A hiểu sai rằng `HAVING` bắt buộc phải có hàm tổng hợp.
</details>

---

### Câu 22 (Question 22)
**Cho bảng `ORDERS` gồm 3 cột: `ORDER_ID`, `CUST_ID`, `ORDER_TOTAL`. Câu lệnh nào dưới đây tìm được mức tổng giá trị đơn hàng cao nhất trong số các tổng giá trị đơn hàng của từng khách hàng?**

* A. `SELECT cust_id, MAX(SUM(order_total)) FROM orders GROUP BY cust_id;`
* B. `SELECT MAX(SUM(order_total)) FROM orders GROUP BY cust_id;`
* C. `SELECT MAX(SUM(order_total)) FROM orders;`
* D. `SELECT cust_id, SUM(MAX(order_total)) FROM orders GROUP BY cust_id;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đầu tiên `GROUP BY cust_id` kết hợp với hàm trong `SUM(order_total)` sẽ tính tổng tiền đơn hàng của từng khách hàng. Sau đó hàm ngoài `MAX(...)` lấy giá trị lớn nhất trong các tổng đó. Vì trên `SELECT` không chứa cột đơn `cust_id` nên câu lệnh hoàn toàn hợp lệ.
  * **A và D sai:** Báo lỗi `ORA-00937` do đặt cột đơn `cust_id` cùng với hàm tổng hợp lồng 2 cấp trên `SELECT`.
  * **C sai:** Báo lỗi `ORA-00978` do lồng hàm tổng hợp mà không có `GROUP BY`.
</details>

---

### Câu 23 (Question 23)
**Kết quả của câu lệnh SQL dưới đây là gì?**

```sql
SELECT COUNT(*)
FROM dual
WHERE 1 = 2
GROUP BY dummy;
```

* A. Trả về 1 dòng có giá trị là `0`.
* B. Trả về 1 dòng có giá trị là `NULL`.
* C. Không trả về dòng nào (`No rows selected`).
* D. Báo lỗi vì bảng `DUAL` không cho phép dùng `GROUP BY`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Điều kiện `WHERE 1 = 2` luôn sai (`FALSE`), nên 0 dòng được đưa vào bước `GROUP BY dummy`. Khi có mệnh đề `GROUP BY`, nếu không có nhóm nào được tạo ra thì toàn bộ câu truy vấn trả về **0 dòng (`No rows selected`)** (trái ngược với `SELECT COUNT(*) FROM dual WHERE 1 = 2;` không có `GROUP BY` thì trả về 1 dòng chứa số `0`).
  * **A, B, D sai:** Quên tác động của mệnh đề `GROUP BY` lên tập kết quả rỗng.
</details>

---

### Câu 24 (Question 24)
**Xét câu lệnh SQL dưới đây. Mệnh đề nào đang gây ra lỗi biên dịch?**

```sql
SELECT department_id, job_id, COUNT(*), MIN(salary)
FROM employees
WHERE salary >= 3000
GROUP BY department_id, job_id
HAVING AVG(salary) > 5000
ORDER BY MAX(salary) DESC;
```

* A. Mệnh đề `HAVING` gây lỗi vì hàm `AVG(salary)` không có trong danh sách `SELECT`.
* B. Mệnh đề `ORDER BY` gây lỗi vì hàm `MAX(salary)` không có trong danh sách `SELECT`.
* C. Mệnh đề `GROUP BY` gây lỗi vì gom nhóm theo 2 cột cùng lúc.
* D. Không có mệnh đề nào lỗi — câu lệnh hoàn toàn hợp lệ và thực thi thành công.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Câu lệnh này **hoàn toàn hợp lệ 100%**!
    * Cả hai cột đơn trên `SELECT` (`department_id`, `job_id`) đều có mặt đầy đủ trong `GROUP BY`.
    * Mệnh đề `HAVING` được quyền dùng bất kỳ hàm tổng hợp nào (`AVG(salary)`) dù hàm đó không xuất hiện trên `SELECT`.
    * Mệnh đề `ORDER BY` cũng được quyền sắp xếp các nhóm theo bất kỳ hàm tổng hợp hợp lệ nào (`MAX(salary)`) dù hàm đó không hiển thị trên `SELECT`.
  * **A, B, C sai:** Đều là các tính năng hợp lệ của Oracle SQL.
</details>

---

### Câu 25 (Question 25)
**Cho bảng `PRODUCTS` có cột `CATEGORY_ID` và `PRICE`. Bạn muốn tìm các danh mục (`CATEGORY_ID`) mà chênh lệch giữa sản phẩm đắt nhất và sản phẩm rẻ nhất trong danh mục đó lớn hơn `500`. Câu lệnh nào sau đây đáp ứng đúng yêu cầu?**

* A. `SELECT category_id FROM products WHERE MAX(price) - MIN(price) > 500 GROUP BY category_id;`
* B. `SELECT category_id FROM products GROUP BY category_id HAVING MAX(price) - MIN(price) > 500;`
* C. `SELECT category_id, MAX(price) - MIN(price) AS diff FROM products GROUP BY category_id HAVING diff > 500;`
* D. `SELECT category_id FROM products HAVING MAX(price) - MIN(price) > 500;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Gom nhóm theo `GROUP BY category_id` và kiểm tra biểu thức toán học giữa hai hàm tổng hợp `MAX(price) - MIN(price) > 500` ngay trong mệnh đề `HAVING`. Lưu ý rằng biểu thức `MAX(price) - MIN(price)` không cần phải xuất hiện trên `SELECT`.
  * **A sai:** Dùng `MAX` và `MIN` trong `WHERE` gây lỗi `ORA-00934`.
  * **C sai:** Dùng Column Alias `diff` trong `HAVING` gây lỗi `ORA-00904`.
  * **D sai:** Có cột `category_id` trên `SELECT` và có `HAVING` nhưng thiếu mệnh đề `GROUP BY category_id` gây lỗi `ORA-00937`.
</details>

---
