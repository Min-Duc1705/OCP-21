# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 7: JOIN Nhiều Bảng

> **Mục tiêu:** Đánh giá toàn diện kiến thức Chương 7 (`INNER JOIN`, `OUTER JOIN`, `CROSS JOIN`, `SELF JOIN`, `NATURAL JOIN`, `USING`, `ON`, toán tử `(+)` của Oracle, bẫy điều kiện `ON` vs `WHERE`) theo chuẩn đề thi **Oracle Database SQL (1Z0-071)** và kỳ thi sát hạch **VNPT**.  
> **Số lượng:** 25 câu hỏi trắc nghiệm kèm đáp án và phân tích chuyên sâu.  
> **Cách học:** Hãy tự phân tích và chọn đáp án trước khi bấm vào **"👉 Xem Đáp Án & Giải Thích Chi Tiết"**.

---

### Câu 1 (Question 1)
**Cho hai bảng `EMPLOYEES` (có các cột `EMPLOYEE_ID`, `LAST_NAME`, `DEPARTMENT_ID`, `MANAGER_ID`) và `DEPARTMENTS` (có các cột `DEPARTMENT_ID`, `DEPARTMENT_NAME`, `MANAGER_ID`, `LOCATION_ID`). Khi thực thi câu lệnh dưới đây, điều gì sẽ xảy ra?**

```sql
SELECT e.last_name, d.department_name, d.department_id
FROM employees e
JOIN departments d USING (department_id);
```

* A. Thực thi thành công và trả về danh sách nhân viên kèm tên và mã phòng ban của họ.
* B. Báo lỗi `ORA-25154: column part of USING clause cannot have qualifier` do viết `d.department_id` trên mệnh đề `SELECT`.
* C. Báo lỗi vì hai bảng còn có chung cột `MANAGER_ID` nhưng không được đưa vào `USING`.
* D. Báo lỗi vì thiếu từ khóa `INNER` trước từ khóa `JOIN`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Quy tắc bắt buộc của mệnh đề `USING` trong Oracle SQL: Cột được liệt kê bên trong `USING (department_id)` **không được phép có tiền tố bảng hoặc bí danh bảng (qualifier)** ở bất kỳ đâu trong toàn bộ câu truy vấn (`SELECT`, `WHERE`, `GROUP BY`, `ORDER BY`). Việc viết `d.department_id` trên `SELECT` gây lỗi `ORA-25154`. Phải sửa thành `department_id` không có tiền tố.
  * **A, C, D sai:** Cột `MANAGER_ID` không nằm trong `USING` thì hoàn toàn không ảnh hưởng (trừ khi bạn gọi `manager_id` trên `SELECT` mà quên gắn tiền tố `e.` hoặc `d.`).
</details>

---

### Câu 2 (Question 2)
**Vẫn với hai bảng `EMPLOYEES` và `DEPARTMENTS` (cùng có 2 cột trùng tên là `DEPARTMENT_ID` và `MANAGER_ID`). Câu truy vấn nào dưới đây là HỢP LỆ và thực thi thành công?**

* A. `SELECT last_name, department_name, manager_id FROM employees JOIN departments USING (department_id);`
* B. `SELECT e.last_name, d.department_name, e.manager_id, department_id FROM employees e JOIN departments d USING (department_id);`
* C. `SELECT e.last_name, d.department_name, e.manager_id, d.department_id FROM employees e NATURAL JOIN departments d;`
* D. `SELECT e.last_name, d.department_name FROM employees e JOIN departments d USING (e.department_id);`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong câu B:
    * Cột nằm trong `USING (department_id)` được gọi trên `SELECT` là `department_id` (không có tiền tố bảng $\rightarrow$ đúng quy tắc `USING`).
    * Cột trùng tên giữa 2 bảng nhưng **không** nằm trong `USING` là `manager_id` được gắn tiền tố `e.manager_id` ($\rightarrow$ tránh được lỗi mơ hồ cột).
  * **A sai:** Cột `manager_id` có ở cả 2 bảng nhưng không nằm trong `USING (department_id)`, nên khi viết `manager_id` không có tiền tố sẽ báo lỗi `ORA-00918: column ambiguously defined`.
  * **C sai:** Trong `NATURAL JOIN`, cả `department_id` lẫn `manager_id` đều là cột nối chung nên việc viết `e.manager_id` và `d.department_id` gây lỗi `ORA-25154`.
  * **D sai:** Không được dùng tiền tố `e.` bên trong `USING (e.department_id)`.
</details>

---

### Câu 3 (Question 3)
**Cho bảng `EMPLOYEES` (có cột `DEPARTMENT_ID`, `MANAGER_ID`) và bảng `DEPARTMENTS` (cũng có cột `DEPARTMENT_ID`, `MANAGER_ID`). Câu lệnh `NATURAL JOIN` dưới đây tương đương với câu lệnh `INNER JOIN ... ON` nào?**

```sql
SELECT last_name, department_name
FROM employees
NATURAL JOIN departments;
```

* A. `SELECT e.last_name, d.department_name FROM employees e INNER JOIN departments d ON e.department_id = d.department_id;`
* B. `SELECT e.last_name, d.department_name FROM employees e INNER JOIN departments d ON e.department_id = d.department_id AND e.manager_id = d.manager_id;`
* C. `SELECT e.last_name, d.department_name FROM employees e INNER JOIN departments d ON e.department_id = d.department_id OR e.manager_id = d.manager_id;`
* D. `SELECT e.last_name, d.department_name FROM employees e CROSS JOIN departments d;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** `NATURAL JOIN` tự động tìm **tất cả các cột có cùng tên** giữa hai bảng và kết nối chúng bằng phép `AND` của các điều kiện bằng (`=`). Vì cả `DEPARTMENT_ID` và `MANAGER_ID` đều xuất hiện ở cả hai bảng, Oracle chỉ trả về những nhân viên không những thuộc phòng ban đó mà còn có người quản lý trực tiếp trùng với trưởng phòng của phòng ban đó!
  * **A, C, D sai:** A chỉ đúng khi hai bảng có duy nhất 1 cột trùng tên là `DEPARTMENT_ID`.
</details>

---

### Câu 4 (Question 4)
**Điều gì sẽ xảy ra khi bạn thực hiện phép `NATURAL JOIN` giữa hai bảng `TABLE_A` (có 10 dòng) và `TABLE_B` (có 20 dòng), biết rằng giữa hai bảng này KHÔNG có bất kỳ cột nào trùng tên?**

* A. Báo lỗi biên dịch vì `NATURAL JOIN` bắt buộc hai bảng phải có ít nhất 1 cột cùng tên.
* B. Trả về 0 dòng (`No rows selected`).
* C. Tự động thực hiện phép Tích Đề-các (`CROSS JOIN`) và trả về `200` dòng (`10 x 20`).
* D. Trả về `30` dòng (`10 + 20`).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là một bẫy rất hiểm trong đề thi OCA 1Z0-071! Khi hai bảng hoàn toàn không có cột nào trùng tên, `NATURAL JOIN` **không hề báo lỗi** mà sẽ kết nối hai bảng mà không có điều kiện lọc nào, tức là trở thành một phép **`CROSS JOIN` (Cartesian Product)** và trả về $10 \times 20 = 200$ dòng!
  * **A, B, D sai:** Không nắm được hành vi fallback sang `CROSS JOIN` của `NATURAL JOIN`.
</details>

---

### Câu 5 (Question 5)
**Khi thực thi câu lệnh SQL dưới đây, kết quả sẽ là gì?**

```sql
SELECT employees.last_name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id;
```

* A. Thực thi thành công bình thường vì `employees` là tên thật của bảng.
* B. Báo lỗi `ORA-00904: "EMPLOYEES"."LAST_NAME": invalid identifier`.
* C. Báo lỗi `ORA-00918: column ambiguously defined`.
* D. Chỉ cảnh báo nhưng vẫn hiển thị dữ liệu.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Quy tắc về Bí danh bảng (Table Alias) trong SQL: Một khi bạn đã đặt bí danh cho bảng trong mệnh đề `FROM` (`FROM employees e`), bí danh `e` sẽ **thay thế hoàn toàn tên bảng gốc `employees`** trong phạm vi của câu truy vấn đó. Bạn bắt buộc phải dùng `e.last_name`, không được phép quay lại dùng `employees.last_name` nữa!
  * **A, C, D sai:** Đây là câu hỏi kiểm tra cú pháp rất phổ biến trong đề thi OCA.
</details>

---

### Câu 6 (Question 6)
**Cho bảng `EMPS` có 4 dòng (3 nhân viên thuộc phòng `10` và `20`, 1 nhân viên có `DEPT_ID IS NULL`) và bảng `DEPTS` có 3 dòng (phòng `10`, `20`, và phòng `30` chưa có nhân viên nào). Số dòng trả về của 3 câu lệnh `LEFT JOIN`, `RIGHT JOIN`, và `FULL OUTER JOIN` dưới đây lần lượt là bao nhiêu?**

```sql
-- 1. SELECT * FROM emps e LEFT JOIN depts d ON e.dept_id = d.dept_id;
-- 2. SELECT * FROM emps e RIGHT JOIN depts d ON e.dept_id = d.dept_id;
-- 3. SELECT * FROM emps e FULL OUTER JOIN depts d ON e.dept_id = d.dept_id;
```

* A. `4`, `3`, `7`
* B. `4`, `4`, `5`
* C. `3`, `3`, `5`
* D. `4`, `3`, `5`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * Số dòng khớp giữa hai bảng (`INNER JOIN` ở phòng `10` và `20`) là **3 dòng** (2 nhân viên phòng 10 + 1 nhân viên phòng 20).
    * **Câu 1 (`LEFT JOIN`):** Giữ lại 3 dòng khớp + 1 nhân viên không có phòng ban ở bảng trái `emps` = **`4` dòng**.
    * **Câu 2 (`RIGHT JOIN`):** Giữ lại 3 dòng khớp + 1 phòng ban số `30` chưa có nhân viên ở bảng phải `depts` = **`4` dòng** (lưu ý: phòng 10 có 2 nhân viên nên chiếm 2 dòng, phòng 20 có 1 nhân viên chiếm 1 dòng, cộng thêm phòng 30 không có nhân viên chiếm 1 dòng $\rightarrow$ tổng cộng là $2 + 1 + 1 = 4$ dòng, không phải 3 dòng!).
    * **Câu 3 (`FULL OUTER JOIN`):** Giữ lại 3 dòng khớp + 1 dòng dư bên `emps` + 1 dòng dư bên `depts` = **`5` dòng**.
  * **A, C, D sai:** D mắc bẫy cộng nhầm số dòng của `RIGHT JOIN` thành số lượng phòng ban (3) mà quên rằng phòng ban 10 có 2 nhân viên.
</details>

---

### Câu 7 (Question 7)
**Vẫn với bảng `EMPS` (4 dòng: 2 người phòng `10`, 1 người phòng `20`, 1 người phòng `NULL`) và `DEPTS` (phòng `10, 20, 30`). Hãy so sánh số dòng kết quả của hai câu truy vấn sau:**

```sql
-- Truy vấn 1 (Điều kiện phụ trong ON):
SELECT e.emp_id, d.dname
FROM emps e
LEFT JOIN depts d ON (e.dept_id = d.dept_id AND d.dept_id = 10);

-- Truy vấn 2 (Điều kiện phụ trong WHERE):
SELECT e.emp_id, d.dname
FROM emps e
LEFT JOIN depts d ON (e.dept_id = d.dept_id)
WHERE d.dept_id = 10;
```

* A. Cả hai truy vấn đều trả về `2` dòng.
* B. Cả hai truy vấn đều trả về `4` dòng.
* C. Truy vấn 1 trả về `4` dòng, còn Truy vấn 2 chỉ trả về `2` dòng.
* D. Truy vấn 1 trả về `2` dòng, còn Truy vấn 2 trả về `4` dòng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:**
    * Ở **Truy vấn 1**, điều kiện `AND d.dept_id = 10` nằm trong mệnh đề `ON` của `LEFT JOIN`. Bản chất của `LEFT JOIN` là **luôn bảo toàn 100% các dòng của bảng bên trái (`emps`)**, bất kể điều kiện trong `ON` đúng hay sai! Do đó cả **4 nhân viên** đều được hiển thị (2 người phòng 10 có `dname`, còn người phòng 20 và người phòng `NULL` có `dname = NULL`).
    * Ở **Truy vấn 2**, điều kiện `WHERE d.dept_id = 10` chạy **sau** khi `LEFT JOIN` hoàn tất. Nó loại bỏ tất cả các dòng có `d.dept_id` khác `10` hoặc `IS NULL`, biến phép nối thành `INNER JOIN` và chỉ trả về đúng **2 dòng** của phòng 10!
  * **A, B, D sai:** Không phân biệt được thời điểm và phạm vi tác động của `ON` so với `WHERE` trong `OUTER JOIN`.
</details>

---

### Câu 8 (Question 8)
**Tiếp tục xét bẫy điều kiện trên BẢNG TRÁI đặt trong mệnh đề `ON` của `LEFT JOIN`. Với bảng `EMPS` gồm 4 nhân viên (trong đó chỉ có 1 nhân viên có `salary > 8000`), câu truy vấn dưới đây sẽ trả về bao nhiêu dòng?**

```sql
SELECT e.emp_id, e.salary, d.dname
FROM emps e
LEFT JOIN depts d
       ON (e.dept_id = d.dept_id AND e.salary > 8000);
```

* A. Chỉ trả về `1` dòng (nhân viên có `salary > 8000`).
* B. Trả về tất cả **`4` dòng** của bảng `emps` (nhưng chỉ nhân viên có `salary > 8000` mới được ghép `d.dname`, còn 3 nhân viên có `salary <= 8000` sẽ có `d.dname = NULL`).
* C. Báo lỗi vì trong mệnh đề `ON` không được phép viết điều kiện lọc của một bảng đơn lẻ (`e.salary > 8000`).
* D. Trả về `0` dòng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Dù điều kiện `e.salary > 8000` là điều kiện kiểm tra trên chính bảng trái `emps`, nhưng vì nó được đặt bên trong mệnh đề **`ON`** của `LEFT JOIN`, nên nó chỉ đóng vai trò là điều kiện quyết định **có nối với bảng phải `depts` hay không**, chứ **không hề lọc bỏ dòng nào của bảng trái `emps`**! Do đó toàn bộ **4 dòng** của `emps` vẫn xuất hiện trong tập kết quả. Nếu muốn lọc chỉ lấy 1 dòng có `salary > 8000`, bắt buộc phải đặt `WHERE e.salary > 8000`.
  * **A, C, D sai:** Hầu hết thí sinh đều mắc bẫy chọn A vì nghĩ `e.salary > 8000` trong `ON` sẽ lọc bớt bảng `emps`.
</details>

---

### Câu 9 (Question 9)
**Câu lệnh sử dụng toán tử Outer Join truyền thống `(+)` của Oracle dưới đây tương đương với câu lệnh chuẩn ANSI SQL nào?**

```sql
SELECT e.last_name, d.department_name
FROM employees e, departments d
WHERE e.department_id(+) = d.department_id;
```

* A. `SELECT e.last_name, d.department_name FROM employees e LEFT OUTER JOIN departments d ON e.department_id = d.department_id;`
* B. `SELECT e.last_name, d.department_name FROM employees e RIGHT OUTER JOIN departments d ON e.department_id = d.department_id;`
* C. `SELECT e.last_name, d.department_name FROM employees e FULL OUTER JOIN departments d ON e.department_id = d.department_id;`
* D. `SELECT e.last_name, d.department_name FROM employees e INNER JOIN departments d ON e.department_id = d.department_id;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Toán tử `(+)` trong Oracle luôn được đặt ở phía **bảng bị thiếu dữ liệu (bảng sẽ sinh thêm các dòng `NULL`)**. Ở đây dấu `(+)` nằm bên cạnh `e.department_id(+)` (bảng trái `employees`), có nghĩa là bảng phải `departments` được giữ lại toàn bộ 100% các dòng, còn bảng trái `employees` sẽ điền `NULL` nếu phòng ban chưa có nhân viên. Điều này tương đương chính xác với **`employees e RIGHT OUTER JOIN departments d`** (hoặc `departments d LEFT OUTER JOIN employees e`).
  * **A, C, D sai:** A nhầm vị trí dấu `(+)` ở bên trái là `LEFT JOIN`.
</details>

---

### Câu 10 (Question 10)
**Câu lệnh nào dưới đây sử dụng toán tử `(+)` của Oracle là HỢP LỆ và không báo lỗi?**

* A. `SELECT * FROM emps e, depts d WHERE e.dept_id(+) = d.dept_id(+);`
* B. `SELECT * FROM emps e, depts d WHERE e.dept_id = d.dept_id(+) AND d.loc_id(+) = 1700;`
* C. `SELECT * FROM emps e, depts d WHERE e.dept_id = d.dept_id(+) OR d.loc_id = 1700;`
* D. `SELECT * FROM emps e, depts d WHERE e.dept_id(+) IN (10, 20);`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi nối `Outer Join` bằng `(+)` mà cần lọc thêm điều kiện hằng số trên bảng thiếu dữ liệu (`d.loc_id(+) = 1700`), việc gắn `(+)` vào cả hai điều kiện nối bằng `AND` là hoàn toàn hợp lệ và giúp giữ nguyên tính chất của `LEFT JOIN`.
  * **A sai:** Không thể đặt `(+)` ở cả hai vế của phép so sánh để làm `FULL OUTER JOIN` (`ORA-01468`).
  * **C và D sai:** Toán tử `(+)` bị cấm kết hợp với toán tử `OR` hoặc `IN` (`ORA-01719: outer join operator (+) not allowed in operand of OR or IN`).
</details>

---

### Câu 11 (Question 11)
**Cho bảng `EMPLOYEES` chứa cả nhân viên và người quản lý (cột `EMPLOYEE_ID` là mã nhân viên, cột `MANAGER_ID` lưu `EMPLOYEE_ID` của người quản lý trực tiếp). Câu lệnh nào dưới đây hiển thị tên nhân viên kèm tên người quản lý của họ, bao gồm cả Chủ tịch công ty (người có `MANAGER_ID IS NULL`)?**

* A. `SELECT w.last_name, m.last_name FROM employees w JOIN employees m ON w.manager_id = m.employee_id;`
* B. `SELECT w.last_name, m.last_name FROM employees w LEFT JOIN employees m ON w.manager_id = m.employee_id;`
* C. `SELECT w.last_name, m.last_name FROM employees w LEFT JOIN employees m ON w.employee_id = m.manager_id;`
* D. `SELECT w.last_name, m.last_name FROM employees w RIGHT JOIN employees m ON w.manager_id = m.employee_id;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong kỹ thuật `SELF JOIN` trên bảng `EMPLOYEES`:
    * Đóng vai trò nhân viên là bảng `w` (`worker`), đóng vai trò người quản lý là bảng `m` (`manager`).
    * Điều kiện nối chuẩn là: mã quản lý của nhân viên bằng mã nhân viên của sếp (`w.manager_id = m.employee_id`).
    * Để giữ lại cả Chủ tịch công ty (dòng trong bảng `w` có `w.manager_id IS NULL`), ta phải bảo toàn toàn bộ bảng bên trái `w` bằng **`LEFT JOIN`**.
  * **A sai:** Dùng `INNER JOIN` sẽ làm mất dòng của Chủ tịch công ty.
  * **C sai:** Nối ngược khóa (`w.employee_id = m.manager_id`) sẽ ghép nhân viên với cấp dưới của họ thay vì cấp trên.
  * **D sai:** `RIGHT JOIN` bảo toàn bảng `m`, sẽ liệt kê cả những nhân viên không quản lý ai ở cột sếp và làm mất Chủ tịch ở cột nhân viên.
</details>

---

### Câu 12 (Question 12)
**Cho 3 bảng `A` (5 dòng), `B` (6 dòng), và `C` (10 dòng). Để thực hiện phép kết nối (JOIN) cả 3 bảng này lại với nhau mà KHÔNG sinh ra Tích Đề-các (Cartesian Product), bạn cần tối thiểu bao nhiêu điều kiện kết nối (`JOIN` conditions)?**

* A. `1` điều kiện
* B. `2` điều kiện
* C. `3` điều kiện
* D. `4` điều kiện

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Quy tắc tổng quát trong cơ sở dữ liệu quan hệ: Để kết nối **$N$ bảng** mà không tạo ra Tích Đề-các (Cartesian Product), câu truy vấn cần tối thiểu **$N - 1$ điều kiện JOIN**. Với $N = 3$ bảng (`A`, `B`, `C`), cần tối thiểu $3 - 1 = 2$ điều kiện JOIN.
  * **A, C, D sai:** Sai công thức $N - 1$.
</details>

---

### Câu 13 (Question 13)
**Nếu bạn chạy câu lệnh dưới đây với bảng `A` có `5` dòng, bảng `B` có `6` dòng, và bảng `C` có `10` dòng (biết mỗi dòng của `A` khớp với đúng 1 dòng của `B`), kết quả trả về sẽ có bao nhiêu dòng?**

```sql
SELECT *
FROM a
JOIN b ON a.id = b.a_id
CROSS JOIN c;
```

* A. `30` dòng
* B. `50` dòng
* C. `300` dòng
* D. `60` dòng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * Bước 1: `a JOIN b ON a.id = b.a_id`: Vì mỗi dòng trong 5 dòng của `A` khớp với đúng 1 dòng của `B`, nên kết quả trung gian của phép `INNER JOIN` này có **`5` dòng**.
    * Bước 2: Tập kết quả trung gian (5 dòng) thực hiện `CROSS JOIN c` (10 dòng) sẽ nhân tích Đề-các: $5 \times 10 =$ **`50` dòng**.
  * **A, C, D sai:** C lấy $5 \times 6 \times 10 = 300$ (quên mất `A` và `B` có điều kiện `INNER JOIN`); D lấy $6 \times 10 = 60$.
</details>

---

### Câu 14 (Question 14)
**Cho bảng `EMPLOYEES(employee_id, last_name, salary)` và bảng `SALARY_GRADES(grade_id, min_sal, max_sal)`. Câu lệnh nào dưới đây thực hiện đúng phép Non-Equijoin để xếp loại bậc lương cho từng nhân viên?**

* A. `SELECT e.last_name, s.grade_id FROM employees e NATURAL JOIN salary_grades s;`
* B. `SELECT e.last_name, s.grade_id FROM employees e JOIN salary_grades s USING (min_sal, max_sal);`
* C. `SELECT e.last_name, s.grade_id FROM employees e JOIN salary_grades s ON e.salary BETWEEN s.min_sal AND s.max_sal;`
* D. `SELECT e.last_name, s.grade_id FROM employees e JOIN salary_grades s WHERE e.salary >= s.min_sal AND e.salary <= s.max_sal;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Phép kết nối không bằng (**Non-Equijoin** sử dụng `BETWEEN ... AND ...`) trong cú pháp ANSI `JOIN` bắt buộc phải được viết bằng mệnh đề **`ON`**.
  * **A và B sai:** `NATURAL JOIN` và `USING` chỉ hỗ trợ phép so sánh bằng (`=`) trên các cột có cùng tên.
  * **D sai:** Khi sử dụng từ khóa `JOIN` chuẩn ANSI (không phải `CROSS JOIN` hay `NATURAL JOIN`), câu lệnh bắt buộc phải có mệnh đề `ON` hoặc `USING` đi kèm ngay sau tên bảng; nếu bỏ `ON` mà viết thẳng `WHERE` sẽ báo lỗi cú pháp `ORA-00905: missing keyword`!
</details>

---

### Câu 15 (Question 15)
**Xét câu lệnh SQL dưới đây. Tại sao câu lệnh này lại báo lỗi biên dịch?**

```sql
SELECT e.last_name, d.department_name
FROM employees e
JOIN departments d
WHERE e.department_id = d.department_id;
```

* A. Vì thiếu từ khóa `INNER` trước `JOIN`.
* B. Vì trong cú pháp ANSI `JOIN`, điều kiện kết nối bắt buộc phải dùng từ khóa `ON` (hoặc `USING`), không được bỏ trống `ON` để đẩy xuống `WHERE`.
* C. Vì hai bảng có cột trùng tên nên bắt buộc phải dùng `NATURAL JOIN`.
* D. Câu lệnh hoàn toàn không báo lỗi và chạy bình thường.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong Oracle SQL, cú pháp `FROM table1 JOIN table2` bắt buộc phải đi kèm ngay sau đó là mệnh đề **`ON (...)`** hoặc **`USING (...)`**. Việc viết `JOIN` mà thiếu `ON`/`USING` (rồi viết thẳng `WHERE`) sẽ lập tức báo lỗi cú pháp `ORA-00905: missing keyword`. (Chỉ khi dùng dấu phẩy `,` theo cú pháp cũ `FROM employees e, departments d WHERE ...` thì mới đặt điều kiện nối ở `WHERE`).
  * **A, C, D sai:** Đề thi OCA 1Z0-071 rất hay gài lỗi cú pháp trộn lẫn giữa `JOIN` (ANSI) và `WHERE` (Legacy) như câu này.
</details>

---

### Câu 16 (Question 16)
**Bạn muốn nối 3 bảng: `EMPLOYEES (e)`, `DEPARTMENTS (d)`, và `LOCATIONS (l)` để lấy ra **tất cả các nhân viên** (kể cả những người chưa có phòng ban), kèm tên phòng ban và thành phố (nếu có). Câu lệnh nào sau đây là ĐÚNG?**

* A. `SELECT e.last_name, d.department_name, l.city FROM employees e LEFT JOIN departments d ON e.department_id = d.department_id INNER JOIN locations l ON d.location_id = l.location_id;`
* B. `SELECT e.last_name, d.department_name, l.city FROM employees e LEFT JOIN departments d ON e.department_id = d.department_id LEFT JOIN locations l ON d.location_id = l.location_id;`
* C. `SELECT e.last_name, d.department_name, l.city FROM employees e RIGHT JOIN departments d ON e.department_id = d.department_id RIGHT JOIN locations l ON d.location_id = l.location_id;`
* D. `SELECT e.last_name, d.department_name, l.city FROM employees e JOIN departments d ON e.department_id = d.department_id LEFT JOIN locations l ON d.location_id = l.location_id;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Để giữ lại tất cả nhân viên từ bảng gốc `employees e` xuyên suốt chuỗi kết nối:
    * Bước 1: `employees e LEFT JOIN departments d` giữ lại nhân viên chưa có phòng ban (khi đó `d.location_id` sẽ là `NULL`).
    * Bước 2: Phép nối tiếp theo sang bảng `locations l` **bắt buộc cũng phải là `LEFT JOIN`** (`LEFT JOIN locations l ON d.location_id = l.location_id`) để những dòng đang có `d.location_id IS NULL` không bị loại bỏ!
  * **A sai:** Đây là lỗi thực tế cực kỳ phổ biến! Dù bước 1 dùng `LEFT JOIN`, nhưng bước 2 lại dùng `INNER JOIN locations l ON d.location_id = l.location_id`. Vì `NULL = l.location_id` luôn sai, phép `INNER JOIN` ở bước 2 sẽ xóa sạch các nhân viên không có phòng ban mà bước 1 vừa giữ lại!
  * **C và D sai:** Làm mất các nhân viên chưa có phòng ban ngay từ bước đầu.
</details>

---

### Câu 17 (Question 17)
**Khi sử dụng `SELECT *` trong câu truy vấn `JOIN ... USING` và `JOIN ... ON` giữa bảng `DEPTS(dept_id, dname)` và `EMPS(emp_id, ename, dept_id)`, số lượng cột trả về của hai câu lệnh dưới đây khác nhau như thế nào?**

```sql
-- Câu 1:
SELECT * FROM depts d JOIN emps e USING (dept_id);

-- Câu 2:
SELECT * FROM depts d JOIN emps e ON d.dept_id = e.dept_id;
```

* A. Cả hai câu lệnh đều trả về `5` cột.
* B. Cả hai câu lệnh đều trả về `4` cột.
* C. Câu 1 trả về `4` cột (cột `DEPT_ID` chỉ xuất hiện 1 lần ở vị trí đầu tiên), còn Câu 2 trả về `5` cột (cột `DEPT_ID` xuất hiện 2 lần).
* D. Câu 1 báo lỗi vì `SELECT *` không được dùng chung với `USING`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:**
    * Khi dùng `USING (dept_id)` (hoặc `NATURAL JOIN`), Oracle hợp nhất hai cột `dept_id` của hai bảng thành **1 cột chung duy nhất** và đặt nó ở vị trí đầu tiên khi `SELECT *` $\rightarrow$ gồm 4 cột: `DEPT_ID, DNAME, EMP_ID, ENAME`.
    * Khi dùng `ON d.dept_id = e.dept_id`, hai cột `d.dept_id` và `e.dept_id` vẫn tồn tại độc lập nhau khi `SELECT *` $\rightarrow$ gồm 5 cột: `DEPT_ID, DNAME, EMP_ID, ENAME, DEPT_ID`.
  * **A, B, D sai:** Không nắm được cơ chế gộp cột (coalescing common columns) của `USING` và `NATURAL JOIN`.
</details>

---

### Câu 18 (Question 18)
**Cú pháp nào dưới đây là HỢP LỆ trong Oracle SQL?**

* A. `SELECT * FROM employees NATURAL LEFT OUTER JOIN departments;`
* B. `SELECT * FROM employees NATURAL JOIN departments ON employee_id = manager_id;`
* C. `SELECT * FROM employees NATURAL JOIN departments USING (department_id);`
* D. `SELECT * FROM employees JOIN departments ON (department_id);`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Chuẩn ANSI SQL và Oracle hoàn toàn hỗ trợ kết hợp `NATURAL` với các loại Outer Join: `NATURAL LEFT [OUTER] JOIN`, `NATURAL RIGHT [OUTER] JOIN`, và `NATURAL FULL [OUTER] JOIN`!
  * **B và C sai:** Từ khóa `NATURAL JOIN` đã tự động xác định điều kiện nối, nên **tuyệt đối không được phép** viết thêm `ON` hoặc `USING` phía sau `NATURAL JOIN` (gây lỗi cú pháp).
  * **D sai:** Mệnh đề `ON` yêu cầu một biểu thức điều kiện logic đầy đủ (`a = b`), không thể chỉ truyền tên cột như `USING`.
</details>

---

### Câu 19 (Question 19)
**Cho bảng `DEPARTMENTS` và `EMPLOYEES`. Bạn muốn tìm danh sách các phòng ban hiện tại KHÔNG có bất kỳ nhân viên nào làm việc. Câu truy vấn nào dưới đây thực hiện đúng yêu cầu này bằng phép `JOIN`?**

```sql
-- Biết EMPLOYEE_ID là khóa chính (Primary Key - NOT NULL) của bảng EMPLOYEES
```

* A. `SELECT d.department_id, d.department_name FROM departments d LEFT JOIN employees e ON (d.department_id = e.department_id AND e.employee_id IS NULL);`
* B. `SELECT d.department_id, d.department_name FROM departments d LEFT JOIN employees e ON d.department_id = e.department_id WHERE e.employee_id IS NULL;`
* C. `SELECT d.department_id, d.department_name FROM departments d INNER JOIN employees e ON d.department_id = e.department_id WHERE e.employee_id IS NULL;`
* D. `SELECT d.department_id, d.department_name FROM departments d RIGHT JOIN employees e ON d.department_id = e.department_id WHERE e.employee_id IS NULL;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Kỹ thuật tìm bản ghi bên bảng A không tồn tại bên bảng B bằng `LEFT JOIN`:
    1. Thực hiện `departments d LEFT JOIN employees e ON d.department_id = e.department_id`. Những phòng ban không có nhân viên nào sẽ được giữ lại và cột khóa chính `e.employee_id` sẽ bị điền giá trị `NULL`.
    2. Đặt điều kiện lọc **`WHERE e.employee_id IS NULL`** ở mệnh đề `WHERE` (chạy sau khi `LEFT JOIN` xong) để chỉ giữ lại đúng các phòng ban không có nhân viên.
  * **A sai:** Đặt `AND e.employee_id IS NULL` vào bên trong `ON` sẽ làm điều kiện nối luôn sai cho mọi phòng ban, dẫn đến việc trả về **tất cả các phòng ban** trong công ty!
  * **C và D sai:** `INNER JOIN` và `RIGHT JOIN` đều loại bỏ các phòng ban không có nhân viên.
</details>

---

### Câu 20 (Question 20)
**Cho bảng `COLORS` có 3 dòng (`'Red'`, `'Green'`, `'Blue'`) và bảng `SIZES` có 2 dòng (`'M'`, `'L'`). Câu lệnh nào dưới đây KHÔNG tạo ra kết quả gồm 6 dòng (Tích Đề-các)?**

* A. `SELECT * FROM colors CROSS JOIN sizes;`
* B. `SELECT * FROM colors, sizes;`
* C. `SELECT * FROM colors JOIN sizes ON 1 = 1;`
* D. `SELECT * FROM colors JOIN sizes ON 1 = 2;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Câu lệnh `SELECT * FROM colors JOIN sizes ON 1 = 2;` là một phép `INNER JOIN` hợp lệ về mặt cú pháp (không nhất thiết phải có tên cột trong `ON`), nhưng vì điều kiện `1 = 2` luôn sai (`FALSE`), nên không có cặp dòng nào khớp nhau và kết quả trả về **`0` dòng**!
  * **A, B, C sai:** Cả 3 cách viết (`CROSS JOIN`, dấu phẩy `,` không có `WHERE`, và `JOIN ... ON 1 = 1`) đều ghép mọi dòng của `COLORS` với mọi dòng của `SIZES`, trả về đúng $3 \times 2 = 6$ dòng.
</details>

---

### Câu 21 (Question 21)
**Xét hai câu lệnh sử dụng toán tử `(+)` của Oracle dưới đây. Sự khác biệt về kết quả giữa chúng là gì?**

```sql
-- Câu 1:
SELECT e.ename, d.dname
FROM emps e, depts d
WHERE e.dept_id = d.dept_id(+)
  AND d.loc_id(+) = 1700;

-- Câu 2:
SELECT e.ename, d.dname
FROM emps e, depts d
WHERE e.dept_id = d.dept_id(+)
  AND d.loc_id = 1700;
```

* A. Câu 1 báo lỗi cú pháp vì không được dùng `(+)` cho điều kiện so sánh với hằng số `1700`.
* B. Cả hai câu đều trả về kết quả giống hệt nhau.
* C. Câu 1 giữ nguyên bản chất `LEFT OUTER JOIN` (giữ lại tất cả nhân viên của bảng `emps`), còn Câu 2 bị mất tính chất `OUTER JOIN` và biến thành `INNER JOIN` (chỉ trả về nhân viên thuộc phòng ban có `loc_id = 1700`).
* D. Câu 1 là `INNER JOIN`, còn Câu 2 là `LEFT OUTER JOIN`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong cú pháp Oracle Legacy Outer Join `(+)`:
    * Ở **Câu 1**, việc thêm `(+)` vào `d.loc_id(+) = 1700` báo cho Oracle biết điều kiện này thuộc về phép nối `Outer Join` (tương đương với việc đặt `AND d.loc_id = 1700` bên trong mệnh đề **`ON`** của `LEFT JOIN`). Do đó mọi nhân viên của `emps` vẫn được giữ lại.
    * Ở **Câu 2**, vì `d.loc_id = 1700` **không có dấu `(+)`**, nó hoạt động giống như mệnh đề **`WHERE`** chạy sau khi nối: các dòng không khớp (có `d.loc_id` là `NULL`) bị loại bỏ hoàn toàn, biến toàn bộ câu truy vấn thành `INNER JOIN`!
  * **A, B, D sai:** Đây là câu hỏi phân loại mức độ khó (OCP / VNPT Senior) về toán tử `(+)`.
</details>

---

### Câu 22 (Question 22)
**Cho bảng `DEPARTMENTS` (`1` phòng ban mã `10`), bảng `EMPLOYEES` (phòng `10` có `2` nhân viên, mỗi người lương `5000`), và bảng `PROJECTS` (phòng `10` có `4` dự án). Nếu thực thi câu truy vấn dưới đây thì giá trị của `TOTAL_SAL` sẽ là bao nhiêu?**

```sql
SELECT d.department_id, SUM(e.salary) AS total_sal
FROM departments d
JOIN employees e ON d.department_id = e.department_id
JOIN projects  p ON d.department_id = p.department_id
GROUP BY d.department_id;
```

* A. `10000`
* B. `20000`
* C. `40000`
* D. `5000`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là hiện tượng nhân bản dữ liệu (**Fan Trap**) khi JOIN hai bảng chi tiết (`EMPLOYEES` và `PROJECTS`) cùng có quan hệ `1 - N` với bảng `DEPARTMENTS`:
    * Tổng lương thực tế của 2 nhân viên phòng 10 là `5000 + 5000 = 10000`.
    * Tuy nhiên, khi JOIN thêm bảng `PROJECTS` (có 4 dòng thuộc phòng 10) qua `department_id`, mỗi nhân viên sẽ bị nhân bản thành 4 dòng (tổng cộng $2 \times 4 = 8$ dòng).
    * Hệ quả là hàm `SUM(e.salary)` cộng lương của 8 dòng đó: $8 \times 5000 =$ **`40000`** (gấp 4 lần thực tế!).
  * **A, B, D sai:** Không nhận diện được việc nhân bản dòng trước khi hàm `SUM` thực thi.
</details>

---

### Câu 23 (Question 23)
**Để khắc phục triệt để lỗi nhân bản dữ liệu ở Câu 22 khi cần lấy đồng thời tổng lương (`SUM(salary)`) và số lượng dự án (`COUNT(proj_id)`) của từng phòng ban, cách viết nào dưới đây là ĐÚNG và AN TOÀN nhất trong mọi trường hợp?**

* A. Dùng `SUM(DISTINCT e.salary)` và `COUNT(DISTINCT p.proj_id)` trong câu lệnh JOIN trực tiếp 3 bảng.
* B. Thực hiện gom nhóm trước (Pre-aggregation) `SUM(salary) ... GROUP BY department_id` trên bảng `EMPLOYEES` và `COUNT(*) ... GROUP BY department_id` trên bảng `PROJECTS` trong các truy vấn con (Inline Views), sau đó mới `LEFT JOIN` hai kết quả đó với bảng `DEPARTMENTS`.
* C. Thay `INNER JOIN` bằng `FULL OUTER JOIN`.
* D. Thêm mệnh đề `HAVING COUNT(*) > 1`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi gom nhóm trước từng bảng `EMPLOYEES` và `PROJECTS` theo `department_id` bên trong Inline View, mỗi bảng kết quả trung gian chỉ còn tối đa **1 dòng cho mỗi `department_id`** (quan hệ `1 - 1` với `DEPARTMENTS`). Khi JOIN các tập đã gom nhóm này lại, dữ liệu không bao giờ bị nhân bản và tổng lương luôn chính xác tuyệt đối.
  * **A sai:** Mặc dù `COUNT(DISTINCT p.proj_id)` đếm đúng số dự án (vì `proj_id` là khóa chính duy nhất), nhưng **`SUM(DISTINCT e.salary)` sẽ tính SAI** nếu trong cùng một phòng ban có 2 nhân viên khác nhau cùng hưởng mức lương `5000` (nó sẽ khử mất 1 người và chỉ ra `5000` thay vì `10000`)!
  * **C và D sai:** Không giải quyết được bài toán Fan Trap.
</details>

---

### Câu 24 (Question 24)
**Cho bảng `T1(id, val)` có 2 dòng: `(1, 'A')`, `(NULL, 'B')` và bảng `T2(id, name)` có 2 dòng: `(1, 'X')`, `(NULL, 'Y')`. Câu lệnh `INNER JOIN` dưới đây sẽ trả về bao nhiêu dòng?**

```sql
SELECT *
FROM t1
INNER JOIN t2 ON t1.id = t2.id;
```

* A. `1` dòng
* B. `2` dòng (vì dòng `id IS NULL` của `T1` sẽ khớp với dòng `id IS NULL` của `T2`)
* C. `4` dòng
* D. `0` dòng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Điều kiện kết nối `ON t1.id = t2.id` sử dụng toán tử so sánh bằng (`=`). Trong SQL, phép so sánh `NULL = NULL` luôn trả về `UNKNOWN` (không bao giờ là `TRUE`). Do đó dòng `(NULL, 'B')` của `T1` **không bao giờ khớp** với dòng `(NULL, 'Y')` của `T2`. Chỉ có duy nhất cặp dòng có `id = 1` khớp nhau, nên kết quả trả về đúng **`1` dòng**.
  * **B, C, D sai:** B nhầm rằng `JOIN` coi `NULL` bằng `NULL` giống như `GROUP BY` hay `DECODE`.
</details>

---

### Câu 25 (Question 25)
**Vẫn với bảng `T1` và `T2` ở Câu 24: `T1` có `(1, 'A')`, `(NULL, 'B')` và `T2` có `(1, 'X')`, `(NULL, 'Y')`. Nếu đổi sang `FULL OUTER JOIN` như dưới đây thì kết quả sẽ có bao nhiêu dòng?**

```sql
SELECT *
FROM t1
FULL OUTER JOIN t2 ON t1.id = t2.id;
```

* A. `2` dòng
* B. `3` dòng
* C. `4` dòng
* D. Báo lỗi vì cột nối chứa giá trị `NULL`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * Dòng `(1, 'A')` của `T1` khớp với `(1, 'X')` của `T2` tạo thành **1 dòng**.
    * Dòng `(NULL, 'B')` của `T1` không khớp với dòng nào của `T2` (vì `NULL = NULL` là `UNKNOWN`), nên được `FULL OUTER JOIN` giữ lại thành **1 dòng riêng** `(NULL, 'B', NULL, NULL)`.
    * Dòng `(NULL, 'Y')` của `T2` cũng không khớp với dòng nào của `T1`, nên được giữ lại thành **1 dòng riêng** `(NULL, NULL, NULL, 'Y')`.
    * Tổng cộng kết quả có $1 + 1 + 1 =$ **`3` dòng**!
  * **A, C, D sai:** A tưởng hai dòng `NULL` ghép chung với nhau thành 1 dòng.
</details>

---
