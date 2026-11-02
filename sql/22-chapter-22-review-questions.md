# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 22: Cursor trong PL/SQL

> **Tài liệu tham chiếu:** *OCP Oracle Database Program with PL/SQL Study Guide (Exam 1Z0-149)*  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle OCP 1Z0-149 & VNPT kèm phân tích & đáp án chi tiết.  
> **Cách học:** Bạn hãy tự đọc đề và chọn đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và nắm vững bẫy thi.

---

### Câu 1 (Question 1)
**Phát biểu nào sau đây là ĐÚNG khi nói về thuộc tính `SQL%ISOPEN` của con trỏ ngầm định (Implicit Cursor) trong PL/SQL?**

* A. Trả về `TRUE` nếu câu lệnh DML vừa thực thi tác động lên ít nhất 1 dòng dữ liệu.
* B. Luôn trả về `FALSE` tại mọi thời điểm kiểm tra trong thân chương trình PL/SQL vì Oracle tự động mở và đóng con trỏ ngầm định ngay trong quá trình thực thi câu lệnh SQL.
* C. Trả về `NULL` trước khi câu lệnh DML đầu tiên được thực thi trong phiên làm việc (Session).
* D. Ném ra ngoại lệ `ORA-01001: invalid cursor` nếu kiểm tra sau khi câu lệnh `SELECT ... INTO` đã hoàn tất.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đối với Implicit Cursor (`SQL`), PL/SQL Engine tự động mở con trỏ khi bắt đầu câu lệnh SQL và tự động đóng ngay lập tức trước khi trả quyền điều khiển về cho dòng lệnh PL/SQL kế tiếp. Vì vậy, tại bất kỳ dòng lệnh PL/SQL nào bạn kiểm tra `SQL%ISOPEN`, kết quả luôn luôn là `FALSE`.
  * **A sai:** Đây là ý nghĩa của thuộc tính `SQL%FOUND`, không phải `SQL%ISOPEN`.
  * **C sai:** `SQL%FOUND`, `SQL%NOTFOUND`, và `SQL%ROWCOUNT` trả về `NULL` trước khi có lệnh SQL nào chạy, nhưng riêng `SQL%ISOPEN` luôn trả về `FALSE` ngay cả khi chưa chạy lệnh SQL nào.
  * **D sai:** Thuộc tính `%ISOPEN` không bao giờ ném lỗi `ORA-01001: invalid cursor`.
</details>

---

### Câu 2 (Question 2)
**Giả sử bảng `EMPLOYEES` không có nhân viên nào có `employee_id = 9999`. Kết quả khi thực thi khối lệnh PL/SQL dưới đây là gì?**

```sql
DECLARE
    v_sal employees.salary%TYPE;
BEGIN
    SELECT salary INTO v_sal
    FROM employees
    WHERE employee_id = 9999;

    IF SQL%NOTFOUND THEN
        DBMS_OUTPUT.PUT_LINE('Không tìm thấy nhân viên!');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Lương: ' || v_sal);
    END IF;
END;
```

* A. In ra màn hình chuỗi `'Không tìm thấy nhân viên!'`.
* B. In ra màn hình chuỗi `'Lương: '`.
* C. Khối lệnh thất bại và ném ra ngoại lệ `NO_DATA_FOUND` (`ORA-01403`) chưa được bắt, câu lệnh `IF SQL%NOTFOUND` không bao giờ được thực thi.
* D. Khối lệnh thất bại và ném ra ngoại lệ `INVALID_CURSOR` (`ORA-01001`).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khi câu lệnh `SELECT ... INTO` (Implicit Cursor) không tìm thấy dòng dữ liệu nào, PL/SQL Engine sẽ lập tức ném ra ngoại lệ `NO_DATA_FOUND` (`ORA-01403`) ngay tại dòng lệnh `SELECT` và chuyển luồng điều khiển xuống phần `EXCEPTION` (hoặc thoát khỏi khối nếu không có `EXCEPTION`). Do đó, dòng kiểm tra `IF SQL%NOTFOUND` phía sau `SELECT ... INTO` là vô tác dụng và không bao giờ chạy tới.
  * **A, B, D sai:** Muốn kiểm tra `%NOTFOUND` mà không bị văng ngoại lệ `NO_DATA_FOUND`, lập trình viên bắt buộc phải dùng Explicit Cursor (`OPEN` -> `FETCH` -> `IF cur%NOTFOUND`) hoặc bắt ngoại lệ `WHEN NO_DATA_FOUND THEN`.
</details>

---

### Câu 3 (Question 3)
**Cho bảng `DEPARTMENTS` có đúng 3 dòng dữ liệu thỏa mãn `location_id = 1700` với tên phòng ban lần lượt là `'Admin'`, `'IT'`, `'Sales'`. Kết quả thực thi khối lệnh sau là gì?**

```sql
DECLARE
    CURSOR c_dept IS
        SELECT department_name FROM departments WHERE location_id = 1700 ORDER BY 1;
    v_name departments.department_name%TYPE;
BEGIN
    OPEN c_dept;
    LOOP
        FETCH c_dept INTO v_name;
        DBMS_OUTPUT.PUT_LINE(v_name);
        EXIT WHEN c_dept%NOTFOUND;
    END LOOP;
    CLOSE c_dept;
END;
```

* A. In ra 3 dòng: `Admin`, `IT`, `Sales`.
* B. In ra 4 dòng: `Admin`, `IT`, `Sales`, và một dòng `NULL`.
* C. In ra 4 dòng: `Admin`, `IT`, `Sales`, `Sales`.
* D. Vòng lặp chạy vô hạn (Infinite Loop) vì `c_dept%NOTFOUND` không bao giờ trả về `TRUE`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là bẫy vị trí đặt lệnh `EXIT WHEN c_dept%NOTFOUND` kinh điển nhất trong kỳ thi OCP:
    * Ở lần lặp 1, 2, 3: `FETCH` lấy lần lượt `Admin`, `IT`, `Sales` và in ra màn hình.
    * Ở lần lặp thứ 4: Lệnh `FETCH c_dept INTO v_name;` cố gắng đọc dòng thứ 4 nhưng đã hết dữ liệu. Lúc này, Oracle bật cờ `c_dept%NOTFOUND := TRUE`, nhưng **KHÔNG xóa giá trị của biến `v_name` về `NULL`** mà giữ nguyên giá trị của lần `FETCH` thứ 3 là `'Sales'`.
    * Vì lệnh `DBMS_OUTPUT.PUT_LINE(v_name);` được đặt **TRƯỚC** `EXIT WHEN c_dept%NOTFOUND;`, nên `'Sales'` bị in ra thêm một lần nữa trước khi thoát vòng lặp!
  * **A, B, D sai:** Để chỉ in đúng 3 dòng, bắt buộc phải đặt `EXIT WHEN c_dept%NOTFOUND;` ngay sát sau lệnh `FETCH`.
</details>

---

### Câu 4 (Question 4)
**Cho bảng `EMPLOYEES` có 107 dòng dữ liệu. Hãy xác định kết quả khi chạy đoạn mã PL/SQL dưới đây:**

```sql
DECLARE
    CURSOR c_emp IS SELECT first_name FROM employees;
    v_name employees.first_name%TYPE;
BEGIN
    OPEN c_emp;
    WHILE c_emp%FOUND LOOP
        FETCH c_emp INTO v_name;
        DBMS_OUTPUT.PUT_LINE(v_name);
    END LOOP;
    CLOSE c_emp;
END;
```

* A. In ra tên của toàn bộ 107 nhân viên.
* B. Không in ra bất kỳ dòng nào vì ngay sau lệnh `OPEN c_emp`, thuộc tính `c_emp%FOUND` có giá trị là `NULL`.
* C. Rơi vào vòng lặp vô hạn in ra tên nhân viên cuối cùng.
* D. Báo lỗi Runtime `ORA-01001: invalid cursor` tại dòng `WHILE c_emp%FOUND LOOP`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Ngay sau khi thực thi lệnh `OPEN c_emp;` và trước khi thực hiện lệnh `FETCH` đầu tiên, cả hai thuộc tính `c_emp%FOUND` và `c_emp%NOTFOUND` đều mang giá trị **`NULL`** (chưa xác định). Do điều kiện `WHILE c_emp%FOUND` đánh giá biểu thức `NULL` (không phải `TRUE`), thân vòng lặp `WHILE` không được thực thi bất kỳ lần nào.
  * **A, C, D sai:** Để sử dụng `WHILE c_emp%FOUND LOOP`, bắt buộc phải có một câu lệnh `FETCH c_emp INTO v_name;` ngay trước dòng `WHILE`, và một câu lệnh `FETCH` nữa ở cuối thân vòng lặp `WHILE`.
</details>

---

### Câu 5 (Question 5)
**Giá trị của thuộc tính `c_emp%ROWCOUNT` ngay sau khi thực thi câu lệnh `OPEN c_emp;` (khi chưa thực hiện lệnh `FETCH` nào) là bao nhiêu?**

* A. `NULL`
* B. `0`
* C. Tổng số dòng dữ liệu có trong Active Set của câu truy vấn `SELECT`.
* D. Ném ra ngoại lệ `ORA-01001: invalid cursor`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Theo ma trận trạng thái của Explicit Cursor trong Oracle:
    * Trước khi `OPEN`: `%ROWCOUNT` ném ngoại lệ `ORA-01001: invalid cursor`.
    * Ngay sau khi `OPEN` (chưa `FETCH`): `%FOUND` là `NULL`, `%NOTFOUND` là `NULL`, nhưng **`%ROWCOUNT` bằng `0`**.
    * Sau mỗi lần `FETCH` thành công 1 dòng: `%ROWCOUNT` tăng thêm `1`.
  * **A, C, D sai:** Nhiều thí sinh nhầm lẫn `%ROWCOUNT` trả về tổng số dòng của câu `SELECT` (như `COUNT(*)`) hoặc trả về `NULL` giống `%FOUND`. Thực chất `%ROWCOUNT` chỉ đếm số dòng **đã được `FETCH` ra**, nên lúc vừa mở con trỏ thì số dòng đã lấy bằng `0`.
</details>

---

### Câu 6 (Question 6)
**Khi thực thi đoạn mã PL/SQL dưới đây, điều gì sẽ xảy ra?**

```sql
DECLARE
    CURSOR c_emp IS SELECT employee_id, salary * 12 FROM employees;
    v_rec c_emp%ROWTYPE;
BEGIN
    OPEN c_emp;
    FETCH c_emp INTO v_rec;
    CLOSE c_emp;
END;
```

* A. Thực thi thành công và nạp dòng đầu tiên vào biến `v_rec`.
* B. Báo lỗi biên dịch vì biểu thức tính toán `salary * 12` trong câu lệnh `SELECT` của Cursor không được đặt bí danh cột (Column Alias) khi sử dụng với `%ROWTYPE`.
* C. Báo lỗi Runtime `ORA-06502: PL/SQL: numeric or value error`.
* D. Báo lỗi biên dịch vì không được phép dùng `%ROWTYPE` trên một Cursor mà chỉ được dùng trên tên bảng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi bạn khai báo một biến Record dựa trên con trỏ (`v_rec c_emp%ROWTYPE`), PL/SQL sẽ lấy tên các cột trong danh sách `SELECT` của Cursor để đặt tên cho các trường (fields) của Record. Vì `salary * 12` là một biểu thức chứ không phải tên cột hợp lệ, trình biên dịch sẽ báo lỗi `PLS-00402: alias required in SELECT list of cursor to avoid duplicate column names`. Bạn bắt buộc phải viết `SELECT employee_id, salary * 12 AS annual_sal`.
  * **A, C, D sai:** `%ROWTYPE` hoàn toàn dùng được cho cả Table, View và Explicit Cursor, miễn là mọi biểu thức trong Cursor đều có Column Alias.
</details>

---

### Câu 7 (Question 7)
**Quan sát khối lệnh PL/SQL dưới đây. Kết quả khi thực thi là gì?**

```sql
DECLARE
    CURSOR c_dept IS SELECT department_id, department_name FROM departments;
BEGIN
    FOR r_dept IN c_dept LOOP
        NULL;
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Tổng số phòng ban: ' || c_dept%ROWCOUNT);
END;
```

* A. In ra tổng số dòng của bảng `DEPARTMENTS`.
* B. In ra `Tổng số phòng ban: 0`.
* C. Ném ra ngoại lệ Runtime `ORA-01001: invalid cursor` tại dòng `DBMS_OUTPUT.PUT_LINE`.
* D. Báo lỗi biên dịch vì không được dùng lệnh `NULL;` bên trong `Cursor FOR Loop`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Vòng lặp `Cursor FOR Loop` (`FOR r_dept IN c_dept LOOP ... END LOOP;`) sẽ **tự động đóng (`CLOSE`) con trỏ `c_dept`** ngay khi vòng lặp kết thúc tại `END LOOP;`. Khi con trỏ đã đóng, mọi hành vi truy cập tới các thuộc tính `%ROWCOUNT`, `%FOUND`, hoặc `%NOTFOUND` ở bên ngoài vòng lặp đều lập tức kích hoạt ngoại lệ **`INVALID_CURSOR` (`ORA-01001`)**.
  * **A, B, D sai:** Chỉ có thuộc tính `c_dept%ISOPEN` là có thể truy cập sau `END LOOP;` (trả về `FALSE`) mà không bị lỗi `ORA-01001`.
</details>

---

### Câu 8 (Question 8)
**Những phát biểu nào sau đây là ĐÚNG về vòng lặp `Cursor FOR Loop` trong PL/SQL? (Chọn 2 đáp án đúng)**

* A. Biến bản ghi (Record index variable) của vòng lặp phải được khai báo tường minh trong phần `DECLARE` bằng thuộc tính `%ROWTYPE`.
* B. Biến bản ghi của vòng lặp được PL/SQL tự động khai báo ngầm định và chỉ có phạm vi truy cập cục bộ bên trong thân vòng lặp `FOR ... END LOOP`.
* C. Nếu một ngoại lệ (Exception) xảy ra bên trong thân vòng lặp `Cursor FOR Loop` khiến luồng thực thi nhảy xuống khối `EXCEPTION`, con trỏ vẫn được PL/SQL Engine tự động đóng (`CLOSE`) an toàn.
* D. Bạn bắt buộc phải gọi lệnh `CLOSE cursor_name;` sau `END LOOP;` để tránh rò rỉ bộ nhớ (`ORA-01000`).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, C**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong `FOR r_emp IN c_emp LOOP`, biến `r_emp` được khai báo ngầm định theo kiểu `c_emp%ROWTYPE` và chỉ tồn tại bên trong vòng lặp.
  * **C đúng:** Một trong những ưu điểm lớn nhất của `Cursor FOR Loop` là dù vòng lặp kết thúc bình thường hay thoát đột ngột do `EXIT`, `RETURN`, `GOTO`, hoặc văng `EXCEPTION`, PL/SQL Engine vẫn đảm bảo đóng con trỏ tự động.
  * **A sai:** Bạn không cần (và không nên) khai báo biến `r_emp` ở phần `DECLARE`. Nếu khai báo ở ngoài, biến bên trong vòng lặp sẽ che khuất (shadow) biến bên ngoài.
  * **D sai:** Gọi `CLOSE` sau `END LOOP` của `Cursor FOR Loop` sẽ gây lỗi `ORA-01001: invalid cursor` vì con trỏ đã tự động đóng rồi.
</details>

---

### Câu 9 (Question 9)
**Cách khai báo Con trỏ có tham số (Parameterized Cursor) nào dưới đây là HỢP LỆ trong PL/SQL? (Chọn 2 đáp án đúng)**

* A. `CURSOR c_emp (p_dept IN NUMBER(4), p_sal VARCHAR2(20)) IS SELECT * FROM employees WHERE department_id = p_dept;`
* B. `CURSOR c_emp (p_dept NUMBER DEFAULT 10, p_sal IN NUMBER := 5000) IS SELECT * FROM employees WHERE department_id = p_dept AND salary > p_sal;`
* C. `CURSOR c_emp (p_dept IN NUMBER, p_count OUT NUMBER) IS SELECT * FROM employees WHERE department_id = p_dept;`
* D. `CURSOR c_emp (p_dept employees.department_id%TYPE, p_job VARCHAR2) IS SELECT * FROM employees WHERE department_id = p_dept AND job_id = p_job;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, D**
* **Giải thích chuyên sâu:**
  * **B và D đúng:** Tham số của Cursor dùng kiểu dữ liệu không kèm kích thước (`NUMBER`, `VARCHAR2`) hoặc kiểu neo (`%TYPE`), chế độ mặc định là `IN` (có thể ghi tường minh từ khóa `IN` hoặc lược bỏ), và hỗ trợ gán giá trị mặc định bằng cả từ khóa `DEFAULT` lẫn toán tử `:=`.
  * **A sai:** Khai báo tham số của Cursor **không được phép chỉ định độ dài/độ chính xác** như `NUMBER(4)` hay `VARCHAR2(20)` (sẽ báo lỗi biên dịch `PLS-00103`).
  * **C sai:** Tham số của Cursor chỉ dùng để truyền giá trị lọc vào câu lệnh `SELECT`, do đó **chỉ chấp nhận chế độ `IN`**, tuyệt đối không chấp nhận chế độ `OUT` hay `IN OUT`.
</details>

---

### Câu 10 (Question 10)
**Xem xét đoạn mã PL/SQL sau. Tại sao đoạn mã này gặp lỗi khi thực thi?**

```sql
DECLARE
    CURSOR c_emp IS SELECT employee_id, first_name FROM employees;
    v_rec c_emp%ROWTYPE;
BEGIN
    OPEN c_emp;
    FOR r IN c_emp LOOP
        DBMS_OUTPUT.PUT_LINE(r.first_name);
    END LOOP;
    CLOSE c_emp;
END;
```

* A. Lỗi biên dịch vì khai báo `v_rec` nhưng không sử dụng.
* B. Ném ra ngoại lệ Runtime `ORA-06511: PL/SQL: cursor already open` tại dòng `FOR r IN c_emp LOOP`.
* C. Ném ra ngoại lệ Runtime `ORA-01001: invalid cursor` tại dòng `OPEN c_emp;`.
* D. Chạy thành công không có lỗi.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Con trỏ `c_emp` đã được mở tường minh bằng lệnh `OPEN c_emp;`. Ngay sau đó, câu lệnh `FOR r IN c_emp LOOP` lại cố gắng **tự động thực hiện `OPEN c_emp`** thêm một lần nữa trên con trỏ đang mở. Điều này lập tức dẫn đến ngoại lệ Runtime **`CURSOR_ALREADY_OPEN` (`ORA-06511: PL/SQL: cursor already open`)**.
  * **A, C, D sai:** Khi đã dùng `Cursor FOR Loop`, bạn không được gọi `OPEN` trước vòng lặp và không được gọi `CLOSE` sau vòng lặp.
</details>

---

### Câu 11 (Question 11)
**Cho đoạn mã PL/SQL sử dụng biến trong câu truy vấn của Explicit Cursor như sau. Giá trị nào sẽ được truyền vào điều kiện lọc của con trỏ `c_emp` khi duyệt dữ liệu?**

```sql
DECLARE
    v_dept_id NUMBER := 10;
    CURSOR c_emp IS
        SELECT first_name FROM employees WHERE department_id = v_dept_id;
    v_name employees.first_name%TYPE;
BEGIN
    v_dept_id := 20;
    OPEN c_emp;
    v_dept_id := 30;
    FETCH c_emp INTO v_name;
    CLOSE c_emp;
END;
```

* A. `10` (Giá trị tại thời điểm khai báo `CURSOR` trong phần `DECLARE`).
* B. `20` (Giá trị tại thời điểm thực thi câu lệnh `OPEN c_emp;`).
* C. `30` (Giá trị tại thời điểm thực thi câu lệnh `FETCH c_emp INTO v_name;`).
* D. Báo lỗi biên dịch vì không được dùng biến cục bộ trong `CURSOR` mà bắt buộc phải dùng Parameterized Cursor.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong vòng đời của Explicit Cursor, việc liên kết giá trị biến (Variable Binding) và xác định tập kết quả **Active Set** diễn ra **ngay tại thời điểm câu lệnh `OPEN` được thực thi**. Tại dòng `OPEN c_emp;`, biến `v_dept_id` đang có giá trị là `20`, nên con trỏ sẽ truy vấn các nhân viên thuộc phòng ban `20`. Việc đổi `v_dept_id := 30;` sau khi đã `OPEN` không làm thay đổi Active Set của con trỏ đang mở (trừ khi bạn `CLOSE` và `OPEN` lại).
  * **A, C, D sai:** Khai báo `CURSOR` ở `DECLARE` chỉ là định nghĩa văn bản câu truy vấn, chưa đọc giá trị biến.
</details>

---

### Câu 12 (Question 12)
**Trong một câu truy vấn Cursor nối (JOIN) hai bảng `EMPLOYEES e` và `DEPARTMENTS d`, nếu bạn muốn chỉ khóa các dòng thỏa mãn điều kiện trên bảng `EMPLOYEES` mà KHÔNG khóa các dòng tương ứng trên bảng `DEPARTMENTS`, bạn phải viết mệnh đề `FOR UPDATE` như thế nào?**

```sql
CURSOR c_emp_dept IS
    SELECT e.employee_id, e.salary, d.department_name
    FROM employees e JOIN departments d
      ON e.department_id = d.department_id
    WHERE e.department_id = 60
    /* CHÈN MỆNH ĐỀ TẠI ĐÂY */;
```

* A. `FOR UPDATE;`
* B. `FOR UPDATE TABLE employees;`
* C. `FOR UPDATE OF e.salary;` (hoặc bất kỳ cột nào thuộc bảng `employees`).
* D. `FOR UPDATE ONLY employees;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khi câu lệnh `SELECT` trong Cursor thực hiện `JOIN` nhiều bảng:
    * Nếu chỉ viết `FOR UPDATE` không kèm `OF`: Oracle sẽ đặt khóa dòng (Row-level lock) lên **tất cả các bảng** xuất hiện trong mệnh đề `FROM` (`employees` và `departments`).
    * Nếu viết `FOR UPDATE OF column_name`: Oracle sẽ **chỉ khóa các dòng của bảng nào chứa cột `column_name` đó**. Vì cột `e.salary` thuộc bảng `employees`, chỉ các dòng trên bảng `employees` bị khóa.
  * **A sai:** Khóa cả hai bảng `employees` và `departments`.
  * **B, D sai:** Cú pháp `FOR UPDATE TABLE` hoặc `FOR UPDATE ONLY` không tồn tại trong Oracle SQL.
</details>

---

### Câu 13 (Question 13)
**Điều gì sẽ xảy ra khi thực thi đoạn mã PL/SQL dưới đây (giả sử phòng ban 50 có 45 nhân viên)?**

```sql
DECLARE
    CURSOR c_sal IS
        SELECT employee_id, salary
        FROM employees
        WHERE department_id = 50
        FOR UPDATE;
BEGIN
    FOR r IN c_sal LOOP
        UPDATE employees
        SET salary = salary * 1.05
        WHERE CURRENT OF c_sal;
        
        COMMIT;
    END LOOP;
END;
```

* A. Tất cả 45 nhân viên được tăng lương 5% và được `COMMIT` từng dòng thành công.
* B. Dòng đầu tiên được cập nhật và `COMMIT`, nhưng ngay khi vòng lặp chuyển sang lấy dòng thứ 2, chương trình ném ra ngoại lệ Runtime `ORA-01002: fetch out of sequence`.
* C. Báo lỗi biên dịch vì không được phép đặt lệnh `COMMIT` bên trong vòng lặp `FOR`.
* D. Ném ra ngoại lệ `ORA-00054: resource busy` ở dòng thứ 2.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là bẫy kinh điển về Transaction và Cursor `FOR UPDATE`. Khi mở con trỏ `FOR UPDATE`, Oracle đặt khóa độc quyền (Row locks) lên toàn bộ 45 dòng. Khi dòng thứ 1 được cập nhật và chạy lệnh `COMMIT;` bên trong vòng lặp, Oracle **giải phóng toàn bộ khóa dòng** và làm mất hiệu lực con trỏ `FOR UPDATE` hiện tại. Do đó, khi vòng lặp quay lên thực hiện lần `FETCH` thứ 2, Oracle lập tức ném lỗi **`ORA-01002: fetch out of sequence`**.
  * **A, C, D sai:** Lệnh `COMMIT` đặt trong vòng lặp của một Cursor bình thường (không có `FOR UPDATE`) thì không gây lỗi `ORA-01002` (dù có thể gây `ORA-01555: snapshot too old` nếu chạy quá lâu), nhưng với Cursor `FOR UPDATE` thì bắt buộc phải `COMMIT` **sau khi đã thoát khỏi vòng lặp**.
</details>

---

### Câu 14 (Question 14)
**Khi khai báo một Cursor với mệnh đề `FOR UPDATE`, các dòng dữ liệu thỏa mãn câu truy vấn sẽ bị khóa (Row-level Lock) tại thời điểm nào?**

* A. Tại thời điểm khai báo `CURSOR` trong phần `DECLARE`.
* B. Ngay tại thời điểm thực thi câu lệnh `OPEN cursor_name` (trước cả khi lệnh `FETCH` đầu tiên được gọi).
* C. Khóa cuốn chiếu từng dòng một tại thời điểm mỗi câu lệnh `FETCH` đọc tới dòng đó.
* D. Chỉ khóa dòng tại thời điểm câu lệnh `UPDATE ... WHERE CURRENT OF` được thực thi.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong Oracle, câu lệnh `SELECT ... FOR UPDATE` xác định Active Set và **đặt khóa độc quyền cấp dòng (TX Row-level Lock) lên toàn bộ các dòng trong Active Set ngay lúc lệnh `OPEN` được thực thi**.
  * **A, C, D sai:** Việc khóa không diễn ra từng dòng lúc `FETCH`. Đó cũng là lý do nếu có bất kỳ dòng nào trong tập kết quả đang bị Session khác giữ khóa, câu lệnh `OPEN` (với `NOWAIT` hoặc `WAIT n`) sẽ lập tức báo lỗi `ORA-00054` / `ORA-30006` ngay tại dòng `OPEN` chứ không phải đợi tới lúc `FETCH`.
</details>

---

### Câu 15 (Question 15)
**Điểm khác biệt cốt lõi giữa Strong `REF CURSOR` (Restrictive) và Weak `REF CURSOR` (Non-restrictive / `SYS_REFCURSOR`) là gì? (Chọn 2 đáp án đúng)**

* A. Strong `REF CURSOR` có mệnh đề `RETURN` quy định cấu trúc kiểu bản ghi trả về, trong khi Weak `REF CURSOR` không có mệnh đề `RETURN`.
* B. Chỉ có Strong `REF CURSOR` mới có thể dùng làm tham số `OUT` của Stored Procedure trả về cho Java JDBC.
* C. Chỉ có Weak `REF CURSOR` (như `SYS_REFCURSOR`) mới có thể mở cho một chuỗi câu lệnh SQL động (`OPEN rc FOR v_sql_string`), còn Strong `REF CURSOR` không thể dùng với Dynamic SQL.
* D. Weak `REF CURSOR` chạy nhanh hơn gấp đôi so với Strong `REF CURSOR`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C**
* **Giải thích chuyên sâu:**
  * **A đúng:** Strong `REF CURSOR` khai báo dạng `TYPE t_rc IS REF CURSOR RETURN emp%ROWTYPE;`, giúp trình biên dịch kiểm tra kiểu dữ liệu ngay lúc Compile. Weak `REF CURSOR` khai báo dạng `TYPE t_rc IS REF CURSOR;` (hoặc dùng kiểu dựng sẵn `SYS_REFCURSOR`).
  * **C đúng:** Vì câu lệnh Dynamic SQL (`OPEN rc FOR 'SELECT ...'`) chỉ được phân tích tại thời điểm Runtime, trình biên dịch không thể kiểm tra kiểu trả về lúc Compile. Do đó, dùng Strong `REF CURSOR` với chuỗi SQL động sẽ bị lỗi biên dịch **`PLS-00455: cursor '...' cannot be used in dynamic SQL OPEN statement`**.
  * **B sai:** Cả Strong và Weak `REF CURSOR` đều có thể làm tham số `OUT` / `IN OUT`, thậm chí `SYS_REFCURSOR` (Weak) là chuẩn phổ biến nhất khi giao tiếp với Java/.NET.
  * **D sai:** Hiệu năng thực thi giữa hai loại là tương đương nhau.
</details>

---

### Câu 16 (Question 16)
**Điều gì xảy ra khi thực thi đoạn mã PL/SQL dưới đây với biến `SYS_REFCURSOR`?**

```sql
DECLARE
    v_rc   SYS_REFCURSOR;
    v_name VARCHAR2(100);
BEGIN
    OPEN v_rc FOR SELECT department_name FROM departments WHERE department_id = 10;
    FETCH v_rc INTO v_name;
    DBMS_OUTPUT.PUT_LINE('1: ' || v_name);

    OPEN v_rc FOR SELECT first_name FROM employees WHERE employee_id = 100;
    FETCH v_rc INTO v_name;
    DBMS_OUTPUT.PUT_LINE('2: ' || v_name);

    CLOSE v_rc;
END;
```

* A. Ném ra ngoại lệ Runtime `ORA-06511: PL/SQL: cursor already open` tại câu lệnh `OPEN v_rc FOR` thứ hai vì chưa gọi `CLOSE v_rc;` sau câu lệnh thứ nhất.
* B. Báo lỗi biên dịch vì một biến `SYS_REFCURSOR` không thể mở cho 2 bảng có cấu trúc khác nhau.
* C. Thực thi thành công và in ra tên phòng ban 10 cùng tên nhân viên có mã 100 mà không gặp bất kỳ lỗi nào.
* D. Ném ra ngoại lệ `ROWTYPE_MISMATCH` (`ORA-06504`).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là điểm khác biệt cực kỳ quan trọng giữa Explicit Cursor tĩnh và `REF CURSOR`:
    * Với Explicit Cursor tĩnh: Gọi `OPEN` lần 2 khi chưa `CLOSE` sẽ ném lỗi **`ORA-06511: cursor already open`**.
    * Với `REF CURSOR` (`SYS_REFCURSOR`): Bạn được phép gọi `OPEN v_rc FOR ...` lại nhiều lần cho các câu truy vấn hoàn toàn khác nhau mà **không cần `CLOSE` trước**. Oracle sẽ tự động giải phóng truy vấn cũ và gắn biến con trỏ vào truy vấn mới!
  * **A, B, D sai:** Vì cả `department_name` và `first_name` đều tương thích với biến `v_name VARCHAR2(100)`, nên không xảy ra lỗi `ROWTYPE_MISMATCH`.
</details>

---

### Câu 17 (Question 17)
**Quan sát đoạn mã gán biến con trỏ (`REF CURSOR`) dưới đây. Kết quả in ra màn hình là gì (giả sử bảng `DEPARTMENTS` có hơn 10 dòng)?**

```sql
DECLARE
    v_rc1  SYS_REFCURSOR;
    v_rc2  SYS_REFCURSOR;
    v_id   departments.department_id%TYPE;
BEGIN
    OPEN v_rc1 FOR SELECT department_id FROM departments ORDER BY 1;
    v_rc2 := v_rc1;

    FETCH v_rc1 INTO v_id;
    FETCH v_rc2 INTO v_id;

    CLOSE v_rc1;

    IF v_rc2%ISOPEN THEN
        DBMS_OUTPUT.PUT_LINE('RC2 đang mở, Rowcount = ' || v_rc2%ROWCOUNT);
    ELSE
        DBMS_OUTPUT.PUT_LINE('RC2 đã đóng!');
    END IF;
END;
```

* A. `RC2 đang mở, Rowcount = 1`
* B. `RC2 đang mở, Rowcount = 2`
* C. `RC2 đã đóng!`
* D. Báo lỗi biên dịch vì không được phép dùng phép gán `:=` giữa hai biến `SYS_REFCURSOR`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Biến `REF CURSOR` là một con trỏ tham chiếu (Reference/Pointer). Khi thực hiện phép gán `v_rc2 := v_rc1;`, cả `v_rc1` và `v_rc2` đều **trỏ chung tới duy nhất một vùng nhớ Context Area** trên Server (chứ không phải sao chép ra 2 con trỏ độc lập).
    * Khi `FETCH v_rc1`, dòng 1 được đọc (`%ROWCOUNT` của cả hai là `1`).
    * Khi `FETCH v_rc2`, dòng 2 tiếp theo được đọc (`%ROWCOUNT` của cả hai là `2`).
    * Khi gọi `CLOSE v_rc1;`, vùng nhớ Context Area chung bị đóng lại. Do đó, `v_rc2%ISOPEN` lập tức trở thành **`FALSE`** và chương trình in ra `'RC2 đã đóng!'`.
  * **A, B, D sai:** Mọi thao tác trạng thái (`OPEN`, `FETCH`, `CLOSE`) trên một biến sẽ tác động trực tiếp lên biến con trỏ đồng danh (alias) còn lại.
</details>

---

### Câu 18 (Question 18)
**Lập trình viên viết một Stored Procedure để trả danh sách nhân viên về cho ứng dụng Java Backend qua JDBC như sau. Khi phía Java gọi Procedure này và đọc `ResultSet`, hiện tượng gì sẽ xảy ra?**

```sql
CREATE OR REPLACE PROCEDURE get_emp_list (
    p_dept_id IN  NUMBER,
    p_rc      OUT SYS_REFCURSOR
) IS
BEGIN
    OPEN p_rc FOR
        SELECT employee_id, first_name, salary
        FROM employees
        WHERE department_id = p_dept_id;
    CLOSE p_rc;
END;
```

* A. Ứng dụng Java đọc được đầy đủ danh sách nhân viên của phòng ban `p_dept_id`.
* B. Thủ tục báo lỗi biên dịch vì tham số `SYS_REFCURSOR` bắt buộc phải có chế độ `IN OUT`, không được là `OUT`.
* C. Thủ tục biên dịch thành công, nhưng khi ứng dụng Java cố gắng đọc dữ liệu từ `ResultSet` sẽ nhận được lỗi `ORA-01001: invalid cursor` (hoặc `Cursor is closed`) vì con trỏ đã bị đóng bởi lệnh `CLOSE p_rc;` trước khi trả về Client.
* D. Ứng dụng Java nhận được một `ResultSet` rỗng (0 dòng) mà không báo lỗi.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khi truyền một `REF CURSOR` ra ngoài qua tham số `OUT` cho Client (Java JDBC, .NET, SQL*Plus), thủ tục PL/SQL chỉ được phép thực hiện lệnh **`OPEN p_rc FOR ...`** và giữ nguyên con trỏ ở trạng thái mở. Ứng dụng Client sau khi `FETCH` hết dữ liệu sẽ chịu trách nhiệm đóng `ResultSet` (tương ứng với việc đóng con trỏ). Nếu gọi `CLOSE p_rc;` ngay trong Procedure, vùng Context Area bị hủy ngay lập tức khiến Client nhận một con trỏ đã đóng (`ORA-01001`).
  * **A, B, D sai:** Tham số `REF CURSOR` hoàn toàn có thể là `OUT` hoặc `IN OUT`.
</details>

---

### Câu 19 (Question 19)
**Hành động nào sau đây là KHÔNG HỢP LỆ khi làm việc với biến con trỏ (`REF CURSOR` / `SYS_REFCURSOR`) trong PL/SQL? (Chọn 2 đáp án đúng)**

* A. Duyệt trực tiếp biến `REF CURSOR` bằng vòng lặp `Cursor FOR Loop` (ví dụ: `FOR r IN v_ref_cursor LOOP ... END LOOP;`).
* B. Khai báo một biến toàn cục có kiểu `SYS_REFCURSOR` trong phần `PACKAGE SPECIFICATION` để lưu giữ trạng thái con trỏ xuyên suốt Session.
* C. Truyền biến `SYS_REFCURSOR` làm tham số từ một Stored Procedure này sang một Stored Procedure khác.
* D. Sử dụng mệnh đề `BULK COLLECT INTO` khi `FETCH` dữ liệu từ một biến `SYS_REFCURSOR`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B**
* **Giải thích chuyên sâu:**
  * **A là hành động KHÔNG hợp lệ (Đúng):** Vòng lặp `Cursor FOR Loop` chỉ làm việc với Explicit Cursor tĩnh hoặc câu lệnh `SELECT` nội tuyến. Bạn **không thể** viết `FOR r IN v_rc LOOP` với một biến `REF CURSOR` (bắt buộc phải dùng `LOOP ... FETCH v_rc INTO ... END LOOP`).
  * **B là hành động KHÔNG hợp lệ (Đúng):** Oracle cấm khai báo **biến** `REF CURSOR` ở cấp độ Package (`PACKAGE SPECIFICATION` hoặc phần toàn cục của `PACKAGE BODY`) — sẽ gây lỗi biên dịch **`PLS-00994: Cursor Variables cannot be declared as part of a package`**. (Lưu ý: Bạn được phép khai báo kiểu `TYPE t_rc IS REF CURSOR;` trong Package Spec, nhưng biến thuộc kiểu đó chỉ được khai báo cục bộ bên trong Procedure/Function!).
  * **C và D là hợp lệ:** `REF CURSOR` hoàn toàn truyền được làm tham số giữa các Subprograms và hỗ trợ `FETCH v_rc BULK COLLECT INTO v_collection`.
</details>

---

### Câu 20 (Question 20)
**Khi sử dụng Weak `REF CURSOR` (`SYS_REFCURSOR`), nếu số lượng cột hoặc kiểu dữ liệu của các cột trong câu lệnh `OPEN v_rc FOR SELECT ...` không tương thích với các biến đích trong câu lệnh `FETCH v_rc INTO ...`, chuyện gì sẽ xảy ra?**

* A. Trình biên dịch báo lỗi ngay khi biên dịch thủ tục.
* B. Trình biên dịch không báo lỗi, nhưng tại thời điểm chạy (Runtime) khi thực thi lệnh `FETCH`, PL/SQL sẽ ném ra ngoại lệ chuẩn `ROWTYPE_MISMATCH` (`ORA-06504`).
* C. Các cột không khớp sẽ tự động được gán giá trị `NULL` mà không báo lỗi.
* D. Ném ra ngoại lệ `INVALID_CURSOR` (`ORA-01001`) tại dòng lệnh `OPEN`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Vì Weak `REF CURSOR` không có mệnh đề `RETURN` nên trình biên dịch không kiểm tra tính tương thích giữa câu lệnh `SELECT` (trong `OPEN`) và biến nhận (trong `FETCH`) tại thời điểm Compile. Tại thời điểm Runtime, khi lệnh `FETCH` được thực thi, nếu cấu trúc dòng trả về không thể chuyển đổi ngầm định sang biến đích trong `INTO`, Oracle sẽ ném ra ngoại lệ **`ROWTYPE_MISMATCH` (`ORA-06504: PL/SQL: Return types of Result Set variables or query do not match`)**.
  * **A, C, D sai:** Chỉ Strong `REF CURSOR` mới phát hiện lỗi lệch kiểu ngay lúc Compile.
</details>

---

### Câu 21 (Question 21)
**Cho khối lệnh PL/SQL dưới đây. Kết quả thực thi là gì?**

```sql
DECLARE
    v_count NUMBER;
BEGIN
    UPDATE employees SET salary = salary WHERE 1 = 2;
    
    SELECT SQL%ROWCOUNT INTO v_count FROM dual;
    DBMS_OUTPUT.PUT_LINE('Count = ' || v_count);
END;
```

* A. In ra `Count = 0`.
* B. In ra `Count = 1`.
* C. In ra `Count = NULL`.
* D. Báo lỗi biên dịch vì không được phép sử dụng các thuộc tính con trỏ (`SQL%ROWCOUNT`, `SQL%FOUND`, ...) trực tiếp bên trong một câu lệnh SQL (`SELECT ... FROM dual`).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Các thuộc tính con trỏ (`%FOUND`, `%NOTFOUND`, `%ROWCOUNT`, `%ISOPEN`) là cấu trúc của **PL/SQL Engine**, SQL Engine không hiểu các thuộc tính này. Do đó, viết `SELECT SQL%ROWCOUNT INTO v_count FROM dual;` sẽ gây lỗi biên dịch **`PLS-00201`** hoặc **`ORA-00911`**. Bạn chỉ được phép gán trực tiếp bằng lệnh PL/SQL: `v_count := SQL%ROWCOUNT;`.
  * **A, B, C sai:** Đây là bẫy cú pháp rất hay gặp khi thí sinh không để ý thuộc tính con trỏ bị đặt vào bên trong câu lệnh `SELECT` hoặc `UPDATE`.
</details>

---

### Câu 22 (Question 22)
**Giả sử có 2 phiên làm việc (Session A và Session B) cùng truy cập bảng `EMPLOYEES`. Session A thực thi lệnh `UPDATE employees SET salary = 9000 WHERE department_id = 10;` nhưng CHƯA `COMMIT`. Ngay lúc đó, Session B thực thi đoạn mã sau. Điều gì sẽ xảy ra ở Session B?**

```sql
DECLARE
    CURSOR c_lock IS
        SELECT employee_id, salary
        FROM employees
        WHERE department_id = 10
        FOR UPDATE NOWAIT;
BEGIN
    OPEN c_lock;
    CLOSE c_lock;
END;
```

* A. Session B sẽ treo và chờ cho đến khi Session A thực hiện `COMMIT` hoặc `ROLLBACK`.
* B. Session B mở con trỏ thành công và đọc dữ liệu cũ từ Undo Segments mà không bị chặn.
* C. Câu lệnh `OPEN c_lock;` ở Session B lập tức thất bại và ném ra lỗi `ORA-00054: resource busy and acquire with NOWAIT specified`.
* D. Câu lệnh `OPEN c_lock;` thành công và tự động bỏ qua các dòng đang bị Session A khóa.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Do con trỏ `c_lock` có mệnh đề `FOR UPDATE NOWAIT`, ngay khi gọi `OPEN c_lock;`, Session B yêu cầu khóa độc quyền trên các dòng của phòng ban 10. Vì các dòng này đang bị Session A giữ khóa, tùy chọn `NOWAIT` yêu cầu Oracle không chờ đợi mà lập tức trả về lỗi **`ORA-00054: resource busy and acquire with NOWAIT specified`**.
  * **A sai:** Chỉ treo chờ vô thời hạn khi viết `FOR UPDATE` mà không có `NOWAIT` hay `WAIT n`.
  * **B sai:** Chỉ `SELECT` thường (không có `FOR UPDATE`) mới đọc dữ liệu cũ từ Undo mà không bị chặn bởi khóa ghi.
  * **D sai:** Muốn bỏ qua các dòng đang bị khóa thì phải dùng `FOR UPDATE SKIP LOCKED`.
</details>

---

### Câu 23 (Question 23)
**Cho bảng `DEPARTMENTS` hiện đang có 27 dòng. Hãy xác định kết quả của đoạn mã PL/SQL sau (lưu ý tính nhất quán đọc - Read Consistency của Cursor):**

```sql
DECLARE
    CURSOR c_dept IS SELECT department_id FROM departments;
    v_id    departments.department_id%TYPE;
    v_count PLS_INTEGER := 0;
BEGIN
    OPEN c_dept;
    
    -- Thêm 1 phòng ban mới ngay sau khi đã OPEN con trỏ
    INSERT INTO departments (department_id, department_name, location_id)
    VALUES (999, 'New Testing Dept', 1700);
    COMMIT;

    LOOP
        FETCH c_dept INTO v_id;
        EXIT WHEN c_dept%NOTFOUND;
        v_count := v_count + 1;
    END LOOP;
    CLOSE c_dept;

    DBMS_OUTPUT.PUT_LINE('Số dòng duyệt được: ' || v_count);
END;
```

* A. `Số dòng duyệt được: 28`
* B. `Số dòng duyệt được: 27`
* C. Ném ra ngoại lệ `ORA-01002: fetch out of sequence` do có lệnh `COMMIT` sau khi `OPEN`.
* D. Ném ra ngoại lệ `ORA-04091: table is mutating`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong Oracle, cơ chế **Statement-level Read Consistency (Nhất quán đọc theo SCN)** đảm bảo rằng tập kết quả (Active Set) của một con trỏ được chốt cố định tại thời điểm (**SCN**) câu lệnh `OPEN c_dept;` được thực thi. Tại thời điểm `OPEN`, bảng chỉ có 27 dòng. Do đó, dù ngay sau khi `OPEN` có thêm lệnh `INSERT` và `COMMIT` dòng thứ 28, con trỏ `c_dept` vẫn chỉ nhìn thấy ảnh chụp 27 dòng tại thời điểm nó được mở!
  * **A sai:** Dòng thứ 28 chỉ được nhìn thấy nếu bạn `CLOSE c_dept` rồi `OPEN c_dept` lại sau khi `INSERT`.
  * **C sai:** Con trỏ `c_dept` không sử dụng mệnh đề `FOR UPDATE`, nên việc `COMMIT` trong khi con trỏ đang mở hoàn toàn hợp lệ và không gây lỗi `ORA-01002`.
  * **D sai:** Lỗi Mutating Table (`ORA-04091`) chỉ xảy ra trong Row-level DML Trigger.
</details>

---

### Câu 24 (Question 24)
**Xem xét đoạn mã sử dụng vòng lặp `Cursor FOR Loop` với câu truy vấn nội tuyến (Inline Subquery) dưới đây. Kết quả in ra màn hình là gì (giả sử phòng ban 10 có 1 nhân viên và phòng ban 20 có 2 nhân viên)?**

```sql
BEGIN
    UPDATE employees SET salary = salary WHERE department_id = 10;

    FOR r IN (SELECT first_name FROM employees WHERE department_id = 20) LOOP
        NULL;
    END LOOP;

    DBMS_OUTPUT.PUT_LINE('Result = ' || SQL%ROWCOUNT);
    ROLLBACK;
END;
```

* A. `Result = 1`
* B. `Result = 2`
* C. `Result = 0`
* D. `Result =` (tức `SQL%ROWCOUNT` bằng `NULL`).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Mặc dù câu truy vấn `SELECT` trong `FOR r IN (SELECT ...) LOOP` không có tên tường minh, bên dưới PL/SQL Engine vẫn xử lý nó như một con trỏ riêng và khi vòng lặp kết thúc, con trỏ ẩn đó đã đóng lại. Sau khi vòng lặp `FOR r IN (SELECT ...)` chạy xong, câu lệnh SQL gần nhất không còn là lệnh `UPDATE` ban đầu nữa mà là con trỏ của vòng lặp `FOR` đã đóng, khiến `SQL%ROWCOUNT` sau `END LOOP` không giữ giá trị `1` của lệnh `UPDATE` cũng không trả về `2` của vòng lặp `FOR`, mà trả về `NULL` (hoặc không thể dùng `SQL%ROWCOUNT` để lấy số dòng của `Cursor FOR Loop`).
  * **A, B, C sai:** Nếu muốn lưu số dòng của lệnh `UPDATE`, bạn bắt buộc phải gán `v_cnt := SQL%ROWCOUNT;` **ngay sau lệnh `UPDATE`** trước khi bước vào bất kỳ vòng lặp Cursor nào khác!
</details>

---

### Câu 25 (Question 25)
**Cách viết nào dưới đây là ĐÚNG để mở một biến `SYS_REFCURSOR` sử dụng câu lệnh SQL động (Dynamic SQL) có truyền biến liên kết (Bind Variable)?**

```sql
DECLARE
    v_rc      SYS_REFCURSOR;
    v_dept_id NUMBER := 60;
    v_min_sal NUMBER := 5000;
BEGIN
    /* CHÈN CÂU LỆNH OPEN TẠI ĐÂY */
    CLOSE v_rc;
END;
```

* A. `OPEN v_rc FOR 'SELECT * FROM employees WHERE department_id = :1 AND salary > :2' USING v_dept_id, v_min_sal;`
* B. `OPEN v_rc USING v_dept_id, v_min_sal FOR 'SELECT * FROM employees WHERE department_id = :1 AND salary > :2';`
* C. `EXECUTE IMMEDIATE 'SELECT * FROM employees WHERE department_id = :1 AND salary > :2' INTO v_rc USING v_dept_id, v_min_sal;`
* D. `OPEN v_rc(v_dept_id, v_min_sal) FOR 'SELECT * FROM employees WHERE department_id = :1 AND salary > :2';`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Cú pháp chuẩn để mở một Weak `REF CURSOR` (`SYS_REFCURSOR`) với chuỗi truy vấn động có chứa Bind Variables là:
    `OPEN cursor_variable FOR dynamic_query_string [USING bind_argument_1, bind_argument_2, ...];`
  * **B sai:** Mệnh đề `USING` bắt buộc phải đặt **sau** chuỗi truy vấn `FOR '...'`, không được đặt trước `FOR`.
  * **C sai:** Không dùng `EXECUTE IMMEDIATE ... INTO v_rc` để mở một câu lệnh `SELECT` cho biến con trỏ (trừ khi chuỗi động là một khối `BEGIN OPEN :rc FOR ...; END;`).
  * **D sai:** Biến `REF CURSOR` không nhận danh sách tham số trong dấu ngoặc đơn `v_rc(...)` như Parameterized Explicit Cursor.
</details>

---
