# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 21: PL/SQL Fundamentals (Nhập Môn Lập Trình PL/SQL)

> **Tài liệu tham chiếu:** *Oracle Database PL/SQL Language Reference* & *OCA/OCP Oracle Database SQL & PL/SQL Exam Guide*.  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle OCA/OCP & Tuyển dụng VNPT/Viettel/Banking kèm phân tích chuyên sâu.  
> **Cách học:** Tự đọc đề và chọn đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và nắm vững các bẫy thi.

---

### Câu 1 (Question 1)
**Trong cấu trúc của một khối lệnh PL/SQL vô danh (Anonymous Block), những thành phần nào là BẮT BUỘC phải có để khối lệnh biên dịch thành công?**

* A. Cả 4 phần `DECLARE`, `BEGIN`, `EXCEPTION`, và `END;` đều bắt buộc
* B. Chỉ có phần thực thi `BEGIN` (chứa ít nhất một câu lệnh hợp lệ hoặc `NULL;`) và từ khóa kết thúc `END;` là bắt buộc; còn `DECLARE` và `EXCEPTION` là tùy chọn
* C. Phần `DECLARE` và `BEGIN` là bắt buộc, `END;` là tùy chọn
* D. Một khối `BEGIN ... END;` hoàn toàn trống rỗng (không có bất kỳ câu lệnh nào bên trong) vẫn biên dịch thành công

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong PL/SQL, phần `DECLARE` (khai báo biến) và phần `EXCEPTION` (bắt lỗi) là **tùy chọn (optional)**. Chỉ có cặp **`BEGIN ... END;`** là **bắt buộc (mandatory)**, và bên trong `BEGIN ... END;` bắt buộc phải có ít nhất 1 câu lệnh thực thi (nếu chưa làm gì thì dùng câu lệnh giữ chỗ `NULL;`).
  * **D sai:** Một khối `BEGIN END;` hoàn toàn rỗng sẽ bị lỗi biên dịch `PLS-00103: Encountered the symbol "END"`.
</details>

---

### Câu 2 (Question 2)
**Những dòng khai báo biến/hằng nào dưới đây trong phần `DECLARE` của PL/SQL sẽ gây ra LỖI BIÊN DỊCH? (Chọn tất cả các đáp án đúng)**

```sql
DECLARE
    v_a, v_b   NUMBER := 10;                  -- (1)
    v_name     VARCHAR2(50) NOT NULL;         -- (2)
    c_pi       NUMBER CONSTANT := 3.14;       -- (3)
    c_tax      CONSTANT NUMBER(4,2) := 0.10;  -- (4)
    v_active   BOOLEAN DEFAULT TRUE;          -- (5)
BEGIN
    NULL;
END;
```

* A. Dòng `(1)`: `v_a, v_b NUMBER := 10;`
* B. Dòng `(2)`: `v_name VARCHAR2(50) NOT NULL;`
* C. Dòng `(3)`: `c_pi NUMBER CONSTANT := 3.14;`
* D. Dòng `(4)`: `c_tax CONSTANT NUMBER(4,2) := 0.10;`
* E. Dòng `(5)`: `v_active BOOLEAN DEFAULT TRUE;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B, C**
* **Giải thích chuyên sâu:**
  * **A là lỗi biên dịch:** PL/SQL chỉ cho phép khai báo **tối đa 1 biến trên mỗi câu lệnh khai báo** (không được dùng dấu phẩy `v_a, v_b NUMBER`).
  * **B là lỗi biên dịch (`PLS-00218`):** Biến được gắn ràng buộc `NOT NULL` **bắt buộc phải được gán giá trị khởi tạo khác `NULL` ngay tại lúc khai báo** (vì mặc định biến chưa khởi tạo sẽ bằng `NULL`, vi phạm ngay `NOT NULL`).
  * **C là lỗi biên dịch:** Từ khóa `CONSTANT` bắt buộc phải đứng **trước** tên kiểu dữ liệu (`c_pi CONSTANT NUMBER := 3.14;`), không được đứng sau kiểu dữ liệu.
  * **D và E hoàn toàn hợp lệ.**
</details>

---

### Câu 3 (Question 3)
**Kết quả in ra màn hình của khối lệnh PL/SQL dưới đây là gì?**

```sql
DECLARE
    v_bonus  NUMBER;
    v_salary NUMBER := 5000;
    v_total  NUMBER;
BEGIN
    v_total := v_salary + v_bonus;
    DBMS_OUTPUT.PUT_LINE('Total = ' || NVL(TO_CHAR(v_total), 'IS_NULL'));
END;
/
```

* A. `Total = 5000`
* B. `Total = IS_NULL`
* C. `Total = 0`
* D. Báo lỗi biên dịch vì biến `v_bonus` chưa được khởi tạo giá trị

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong PL/SQL, mọi biến không có ràng buộc `NOT NULL` nếu không được gán giá trị khởi tạo lúc khai báo sẽ **tự động được gán giá trị mặc định là `NULL`** (khác với Java nơi biến cục bộ chưa khởi tạo sẽ báo lỗi biên dịch!). Do đó `v_bonus` có giá trị là `NULL`. Khi tính `v_total := 5000 + NULL;`, kết quả của phép cộng với `NULL` là **`NULL`**. Hàm `NVL(TO_CHAR(v_total), 'IS_NULL')` sẽ trả về `'IS_NULL'`, nên in ra **`Total = IS_NULL`**.
</details>

---

### Câu 4 (Question 4)
**Chuyện gì sẽ xảy ra khi biên dịch và chạy khối lệnh PL/SQL dưới đây?**

```sql
DECLARE
    v_is_valid BOOLEAN := TRUE;
BEGIN
    DBMS_OUTPUT.PUT_LINE(v_is_valid);
END;
/
```

* A. In ra chuỗi `'TRUE'`
* B. In ra số `1`
* C. Báo lỗi biên dịch `PLS-00306: wrong number or types of arguments in call to 'PUT_LINE'` vì thủ tục `DBMS_OUTPUT.PUT_LINE` không hỗ trợ nhận tham số kiểu `BOOLEAN`
* D. Không in ra gì nhưng chạy thành công

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (Bẫy thi OCA/OCP kinh điển):** Trong gói `DBMS_OUTPUT`, thủ tục `PUT_LINE` chỉ được nạp chồng (overloaded) cho các kiểu chuỗi/số/ngày (chuyển đổi ngầm sang `VARCHAR2`), nhưng **KHÔNG có hàm `PUT_LINE` nào nhận kiểu `BOOLEAN`** và PL/SQL cũng không tự động ép kiểu ngầm định từ `BOOLEAN` sang `VARCHAR2`! Do đó gọi `DBMS_OUTPUT.PUT_LINE(v_is_valid);` sẽ lập tức bị **lỗi biên dịch `PLS-00306`**. Muốn in phải dùng `CASE WHEN v_is_valid THEN 'TRUE' ... END` hoặc `sys.diutil.bool_to_int`.
</details>

---

### Câu 5 (Question 5)
**Trên bảng `EMPLOYEES`, cột `SALARY` được định nghĩa là `SALARY NUMBER(8,2) NOT NULL DEFAULT 1000`. Trong khối lệnh PL/SQL, lập trình viên khai báo biến: `v_sal employees.salary%TYPE;`. Phát biểu nào sau đây là ĐÚNG về biến `v_sal`?**

* A. Biến `v_sal` tự động nhận giá trị khởi tạo mặc định là `1000` và có ràng buộc `NOT NULL`
* B. Biến `v_sal` kế thừa kiểu dữ liệu `NUMBER(8,2)` từ cột `employees.salary`, nhưng **KHÔNG kế thừa ràng buộc `NOT NULL`** và **KHÔNG kế thừa giá trị `DEFAULT 1000`** (do đó giá trị ban đầu của `v_sal` là `NULL`)
* C. Khai báo trên bị lỗi biên dịch vì không được dùng `%TYPE` trên cột có ràng buộc `NOT NULL`
* D. Biến `v_sal` kế thừa ràng buộc `NOT NULL` nhưng không kế thừa `DEFAULT`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Quy tắc vàng của thuộc tính neo kiểu **`%TYPE`** và **`%ROWTYPE`** khi tham chiếu đến cột của bảng trong Database:
    * Nó **CHỈ sao chép Kiểu dữ liệu (Data Type) và Kích thước (Precision/Scale/Length)** (`NUMBER(8,2)`).
    * Nó **KHÔNG sao chép ràng buộc `NOT NULL`** và **KHÔNG sao chép giá trị `DEFAULT`** của cột bảng! Do đó biến `v_sal` khởi đầu bằng `NULL` hoàn toàn hợp lệ.
</details>

---

### Câu 6 (Question 6)
**Quan sát khối lệnh PL/SQL lồng nhau (Nested Blocks) dưới đây. Giá trị được in ra bởi câu lệnh `DBMS_OUTPUT.PUT_LINE` là gì?**

```sql
<<outer_blk>>
DECLARE
    v_num NUMBER := 100;
BEGIN
    DECLARE
        v_num NUMBER := 200;
    BEGIN
        outer_blk.v_num := outer_blk.v_num + v_num;
    END;
    DBMS_OUTPUT.PUT_LINE(v_num);
END outer_blk;
/
```

* A. `100`
* B. `200`
* C. `300`
* D. Báo lỗi biên dịch vì không được đặt trùng tên biến `v_num` trong khối con

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khác với Java (cấm khai báo biến cục bộ trong khối con trùng tên với biến của khối bao ngoài), **PL/SQL hoàn toàn cho phép khối con khai báo biến trùng tên với biến của khối ngoài** (biến trong sẽ che khuất biến ngoài). Nhờ gắn nhãn `<<outer_blk>>`, bên trong khối con:
    * `outer_blk.v_num` tham chiếu tới biến `v_num` của khối ngoài (`100`).
    * `v_num` (không có tiền tố) tham chiếu tới biến `v_num` của khối trong (`200`).
    * Phép gán `outer_blk.v_num := 100 + 200;` cập nhật biến `v_num` của khối ngoài thành **`300`**. Khi thoát khỏi khối con và in `v_num` ở khối ngoài, kết quả là **`300`**.
</details>

---

### Câu 7 (Question 7)
**Bảng `EMPLOYEES` có 107 dòng (mọi dòng đều có `employee_id IS NOT NULL`). Một lập trình viên viết khối lệnh PL/SQL dưới đây để xóa duy nhất nhân viên có mã `999` (không tồn tại trong bảng). Sau khi chạy khối lệnh này, có bao nhiêu dòng trong bảng `EMPLOYEES` bị xóa?**

```sql
DECLARE
    employee_id NUMBER := 999;
BEGIN
    DELETE FROM employees
    WHERE employee_id = employee_id;
END;
/
```

* A. `0` dòng bị xóa
* B. `1` dòng bị xóa
* C. **Toàn bộ 107 dòng** trong bảng `EMPLOYEES` bị xóa sạch!
* D. Báo lỗi biên dịch `ORA-00918: column ambiguously defined`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (Bẫy thực chiến & đề thi cực kỳ nguy hiểm):** Khi một tên định danh (`employee_id`) vừa là tên cột của bảng trong câu lệnh SQL, vừa là tên biến PL/SQL, **trình biên dịch luôn ưu tiên giải nghĩa định danh đó là TÊN CỘT CỦA BẢNG trước**!
  * Do đó, mệnh đề `WHERE employee_id = employee_id` được hiểu là so sánh cột `employees.employee_id` với chính cột `employees.employee_id` (tương đương `WHERE 1 = 1` cho mọi dòng khác `NULL`) $\rightarrow$ **Xóa sạch toàn bộ 107 dòng của bảng `EMPLOYEES`**!
  * Bài học: Tuyệt đối không đặt tên biến PL/SQL trùng với tên cột bảng (luôn dùng tiền tố như `v_employee_id`).
</details>

---

### Câu 8 (Question 8)
**Trong PL/SQL, hàm nào dưới đây KHÔNG THỂ gọi trực tiếp trong một câu lệnh gán thủ tục (ví dụ: `v_result := tên_hàm(...);`), mà chỉ được phép sử dụng bên trong câu lệnh SQL? (Chọn 2 đáp án đúng)**

* A. `NVL(v_a, 0)`
* B. `DECODE(v_status, 'A', 'Active', 'Inactive')`
* C. `NVL2(v_comm, 'Yes', 'No')`
* D. `COALESCE(v_a, v_b, 0)`
* E. `UPPER(v_name)`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, C**
* **Giải thích chuyên sâu:**
  * **B, C đúng:** Trong kiến trúc PL/SQL, hai hàm **`DECODE`** và **`NVL2`** là các hàm đặc thù chỉ có trong SQL Engine, **không được tích hợp thành hàm dựng sẵn của ngôn ngữ thủ tục PL/SQL**. Nếu bạn viết `v_res := DECODE(...);` hoặc `v_res := NVL2(...);` trực tiếp trong PL/SQL, trình biên dịch sẽ báo lỗi ngay (`PLS-00204: function or pseudo-column 'DECODE' may be used inside a SQL statement only`). Trong PL/SQL, bạn phải dùng biểu thức `CASE WHEN ... END` để thay thế cho `DECODE` và `NVL2`.
  * **A, D, E sai:** Các hàm `NVL`, `COALESCE`, `UPPER`, `SUBSTR`, `TO_CHAR`, `ROUND`, `TRUNC` đều dùng trực tiếp trong phép gán PL/SQL hoàn toàn bình thường.
</details>

---

### Câu 9 (Question 9)
**Quan sát đoạn mã PL/SQL kiểm tra điều kiện `IF - ELSIF - ELSE` dưới đây. Kết quả in ra màn hình là gì?**

```sql
DECLARE
    v_x NUMBER := 50;
    v_y NUMBER := NULL;
BEGIN
    IF v_x > v_y THEN
        DBMS_OUTPUT.PUT_LINE('Nhánh 1: v_x > v_y');
    ELSIF v_x <= v_y THEN
        DBMS_OUTPUT.PUT_LINE('Nhánh 2: v_x <= v_y');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Nhánh 3: ELSE');
    END IF;
END;
/
```

* A. `Nhánh 1: v_x > v_y`
* B. `Nhánh 2: v_x <= v_y`
* C. `Nhánh 3: ELSE`
* D. Báo lỗi Runtime vì không thể so sánh số với `NULL`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Theo quy tắc logic 3 giá trị (Three-valued logic) của SQL và PL/SQL, mọi phép so sánh bằng toán tử `>`, `<`, `<=`, `>=`, `=`, `!=` với giá trị `NULL` đều trả về kết quả là **`NULL` (UNKNOWN)**, không phải `TRUE` cũng không phải `FALSE`:
    * `v_x > v_y` (`50 > NULL`) $\rightarrow$ `NULL` (Không phải `TRUE` nên bỏ qua Nhánh 1).
    * `v_x <= v_y` (`50 <= NULL`) $\rightarrow$ `NULL` (Không phải `TRUE` nên bỏ qua Nhánh 2).
    * Do cả `IF` và `ELSIF` đều không phải `TRUE`, luồng điều khiển rơi vào nhánh **`ELSE`** và in ra **`Nhánh 3: ELSE`**!
</details>

---

### Câu 10 (Question 10)
**Từ khóa nào được sử dụng để viết nhánh "ngược lại nếu" trong cấu trúc điều khiển `IF` của PL/SQL?**

* A. `ELSE IF`
* B. `ELSEIF`
* C. `ELSIF`
* D. `ELIF`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong PL/SQL, từ khóa chuẩn viết liền và **lược bỏ chữ `E` đầu tiên** là **`ELSIF`** (`IF ... THEN ... ELSIF ... THEN ... ELSE ... END IF;`).
  * **A sai:** Nếu viết tách rời `ELSE IF`, PL/SQL coi đó là mở một khối `IF` mới lồng bên trong nhánh `ELSE`, đòi hỏi bạn phải đóng tới **2 lần `END IF;`** ở cuối!
  * **B, D sai:** `ELSEIF` và `ELIF` không tồn tại trong PL/SQL và sẽ gây lỗi cú pháp.
</details>

---

### Câu 11 (Question 11)
**Sự khác biệt quan trọng nhất về mặt hành vi Runtime giữa `CASE Statement` (Câu lệnh CASE) và `CASE Expression` (Biểu thức CASE) khi KHÔNG có nhánh `ELSE` và không có nhánh `WHEN` nào thỏa mãn điều kiện là gì?**

```sql
-- Khi không khớp nhánh WHEN nào và không có nhánh ELSE:
```

* A. Cả hai đều tự động trả về `NULL` và không báo lỗi
* B. Cả hai đều ném ngoại lệ `CASE_NOT_FOUND` (`ORA-06592`)
* C. `CASE Expression` tự động trả về giá trị **`NULL`** mà không báo lỗi; trong khi `CASE Statement` sẽ lập tức ném ngoại lệ Runtime **`CASE_NOT_FOUND` (`ORA-06592`)**!
* D. `CASE Statement` trả về `NULL`; còn `CASE Expression` ném lỗi `ORA-06592`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (Bẫy thi rất hay hỏi):**
    * **`CASE Expression`** (dùng để trả về một giá trị, kết thúc bằng `END`): Nếu không khớp nhánh `WHEN` nào và không có `ELSE`, nó hoạt động giống hệt trong câu lệnh SQL — tức là **trả về `NULL` một cách bình thường**.
    * **`CASE Statement`** (dùng để thực thi các câu lệnh thủ tục, kết thúc bằng `END CASE;`): Nếu không khớp nhánh `WHEN` nào và bạn quên viết nhánh `ELSE`, PL/SQL sẽ lập tức quăng ngoại lệ **`CASE_NOT_FOUND` (`ORA-06592: CASE not found while executing CASE statement`)**!
</details>

---

### Câu 12 (Question 12)
**Khối lệnh PL/SQL dưới đây sẽ in ra màn hình dãy số nào?**

```sql
BEGIN
    FOR i IN REVERSE 4..1 LOOP
        DBMS_OUTPUT.PUT(i || ' ');
    END LOOP;
    DBMS_OUTPUT.NEW_LINE;
END;
/
```

* A. `4 3 2 1`
* B. `1 2 3 4`
* C. Không in ra bất kỳ số nào (Vòng lặp chạy `0` lần vì cận dưới `4` lớn hơn cận trên `1`)
* D. Báo lỗi biên dịch `PLS-00103`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (Bẫy thi kinh điển):** Trong vòng lặp `FOR i IN [REVERSE] lower_bound..upper_bound LOOP`, quy tắc cú pháp của PL/SQL quy định **`lower_bound` (số đứng trước dấu `..`) luôn phải nhỏ hơn hoặc bằng `upper_bound` (số đứng sau dấu `..`)**, cho dù có từ khóa `REVERSE` hay không!
  * Muốn chạy lùi từ `4` về `1`, bắt buộc phải viết: **`FOR i IN REVERSE 1..4 LOOP`**.
  * Khi viết `FOR i IN REVERSE 4..1 LOOP`, PL/SQL thấy `lower_bound (4) > upper_bound (1)` nên **thoát khỏi vòng lặp ngay lập tức mà không chạy lần nào (0 lần)** và cũng không báo lỗi!
</details>

---

### Câu 13 (Question 13)
**Chuyện gì sẽ xảy ra khi biên dịch khối lệnh PL/SQL dưới đây?**

```sql
BEGIN
    FOR i IN 1..10 LOOP
        i := i + 1;
        DBMS_OUTPUT.PUT_LINE(i);
    END LOOP;
END;
/
```

* A. In ra các số lẻ hoặc số chẵn từ 1 đến 10
* B. Báo lỗi biên dịch `PLS-00363: expression 'I' cannot be used as an assignment target` vì biến đếm `i` của vòng lặp `FOR` được khai báo ngầm định là **chỉ đọc (Read-only)**, tuyệt đối không được phép gán lại giá trị bên trong vòng lặp!
* C. Vòng lặp chạy vô tận
* D. Chỉ in ra số `11`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Biến chạy `i` trong vòng lặp `FOR i IN a..b LOOP` được trình biên dịch PL/SQL quản lý tự động và khóa ở chế độ **Read-only (tương đương một hằng số `CONSTANT` trong mỗi lượt lặp)**. Mọi hành vi cố tình thay đổi giá trị của `i` (như `i := i + 1;` hoặc truyền `i` vào tham số `OUT`/`IN OUT` của một Procedure) đều bị chặn ngay lúc biên dịch với lỗi `PLS-00363`.
</details>

---

### Câu 14 (Question 14)
**Kết quả in ra của đoạn mã PL/SQL sử dụng câu lệnh `CONTINUE WHEN` dưới đây là gì?**

```sql
DECLARE
    v_sum NUMBER := 0;
BEGIN
    FOR i IN 1..4 LOOP
        CONTINUE WHEN i = 3;
        v_sum := v_sum + i;
    END LOOP;
    DBMS_OUTPUT.PUT_LINE(v_sum);
END;
/
```

* A. `10`
* B. `7`
* C. `3`
* D. `6`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Vòng lặp `FOR` chạy `i` từ `1` đến `4`:
    * `i = 1`: `v_sum = 0 + 1 = 1`.
    * `i = 2`: `v_sum = 1 + 2 = 3`.
    * `i = 3`: Điều kiện `CONTINUE WHEN i = 3` đúng $\rightarrow$ Bỏ qua lệnh cộng `v_sum` ở lượt `i = 3` và nhảy thẳng sang lượt `i = 4`!
    * `i = 4`: `v_sum = 3 + 4 = 7`.
    * Kết thúc vòng lặp, in ra **`7`**. (Lưu ý phân biệt: `CONTINUE` chỉ bỏ qua lượt lặp hiện tại, còn `EXIT` mới là thoát hẳn khỏi vòng lặp!).
</details>

---

### Câu 15 (Question 15)
**Trong PL/SQL, khi thực thi một câu lệnh `SELECT ... INTO v_name FROM employees WHERE department_id = 50;` mà phòng ban `50` có tới **45 nhân viên**, ngoại lệ (Exception) nào sẽ bị ném ra?**

* A. `NO_DATA_FOUND` (`ORA-01403`)
* B. `TOO_MANY_ROWS` (`ORA-01422`)
* C. `DUP_VAL_ON_INDEX` (`ORA-00001`)
* D. Không có lỗi gì, biến `v_name` sẽ tự động lấy tên của nhân viên đầu tiên trong 45 nhân viên đó

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Câu lệnh `SELECT ... INTO` (Implicit Cursor) trong PL/SQL đòi hỏi truy vấn phải trả về **chính xác 1 dòng (1 row)**:
    * Nếu trả về `0` dòng $\rightarrow$ Ném ngoại lệ **`NO_DATA_FOUND` (`ORA-01403`)**.
    * Nếu trả về từ `2` dòng trở lên (ở đây là 45 dòng) $\rightarrow$ Ném ngoại lệ **`TOO_MANY_ROWS` (`ORA-01422: exact fetch returns more than requested number of rows`)**.
</details>

---

### Câu 16 (Question 16)
**Trong bảng `EMPLOYEES`, không có bất kỳ nhân viên nào thuộc `department_id = 999`. Khi thực thi khối lệnh PL/SQL dưới đây, chuyện gì sẽ xảy ra?**

```sql
DECLARE
    v_max_sal NUMBER;
BEGIN
    SELECT MAX(salary)
    INTO   v_max_sal
    FROM   employees
    WHERE  department_id = 999;

    DBMS_OUTPUT.PUT_LINE('Max Sal = ' || NVL(TO_CHAR(v_max_sal), 'NULL_VAL'));
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Bat duoc loi NO_DATA_FOUND');
END;
/
```

* A. Nhảy vào khối `EXCEPTION` và in ra `'Bat duoc loi NO_DATA_FOUND'`
* B. Chạy thành công hoàn toàn (KHÔNG ném lỗi `NO_DATA_FOUND`) và in ra `'Max Sal = NULL_VAL'`
* C. Báo lỗi `TOO_MANY_ROWS`
* D. In ra `'Max Sal = 0'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng (Bẫy thi OCA/OCP cực hay):** Khi câu lệnh `SELECT ... INTO` sử dụng hàm tổng hợp (**Aggregate Function** như `MAX`, `MIN`, `SUM`, `AVG`, `COUNT`) và **KHÔNG có mệnh đề `GROUP BY`**, câu truy vấn SQL đó **luôn luôn trả về ĐÚNG 1 DÒNG kết quả** (cho dù không có dòng dữ liệu nào thỏa mãn điều kiện `WHERE`)!
  * Cụ thể, `SELECT MAX(salary) FROM employees WHERE department_id = 999` trả về **1 dòng** chứa giá trị `NULL`. Vì trả về đúng 1 dòng nên `SELECT ... INTO` hoàn toàn thành công, gán `v_max_sal = NULL`, **không bao giờ kích hoạt `NO_DATA_FOUND`**, và in ra **`Max Sal = NULL_VAL`**!
</details>

---

### Câu 17 (Question 17)
**Tiếp tục trên bảng `EMPLOYEES` (không có nhân viên nào thuộc `department_id = 999`). Khi chạy khối lệnh `UPDATE` dưới đây trong PL/SQL, kết quả sẽ là gì?**

```sql
BEGIN
    UPDATE employees
    SET    salary = salary + 500
    WHERE  department_id = 999;

    DBMS_OUTPUT.PUT_LINE('Rows updated: ' || SQL%ROWCOUNT);
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Khong tim thay dong nao de UPDATE');
END;
/
```

* A. Nhảy vào nhánh `WHEN NO_DATA_FOUND` và in ra `'Khong tim thay dong nao de UPDATE'`
* B. Câu lệnh `UPDATE` hoàn tất bình thường mà KHÔNG ném ngoại lệ `NO_DATA_FOUND`, và in ra `'Rows updated: 0'`
* C. Báo lỗi `ORA-01403` dừng chương trình
* D. In ra `'Rows updated: NULL'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Ngoại lệ `NO_DATA_FOUND` chỉ được ném ra bởi câu lệnh **`SELECT ... INTO`** (hoặc khi đọc phần tử chưa tồn tại của Associative Array), **KHÔNG BAO GIỜ được ném ra bởi các câu lệnh DML (`UPDATE`, `DELETE`, `INSERT`, `MERGE`)** khi không có dòng nào khớp điều kiện `WHERE`!
  * Khi `UPDATE` hoặc `DELETE` tác động lên `0` dòng, câu lệnh vẫn thành công, thuộc tính con trỏ ngầm định `SQL%ROWCOUNT` trả về `0` (và `SQL%NOTFOUND` trả về `TRUE`), nên chương trình in ra **`Rows updated: 0`**.
</details>

---

### Câu 18 (Question 18)
**Lập trình viên muốn tăng lương thêm 10% cho nhân viên có `employee_id = 100` và lấy ngay mức lương mới cùng họ tên của nhân viên đó vào 2 biến PL/SQL (`v_lname`, `v_new_sal`) chỉ trong DUY NHẤT 1 câu lệnh (không cần chạy thêm lệnh `SELECT ... INTO`). Cú pháp nào dưới đây là đúng chuẩn Oracle PL/SQL?**

```sql
-- Chọn câu lệnh đúng:
```

* A. `UPDATE employees SET salary = salary * 1.1 WHERE employee_id = 100 INTO v_lname, v_new_sal;`
* B. `UPDATE employees SET salary = salary * 1.1 WHERE employee_id = 100 RETURNING last_name, salary INTO v_lname, v_new_sal;`
* C. `UPDATE employees SET salary = salary * 1.1 WHERE employee_id = 100 OUTPUT last_name, salary TO v_lname, v_new_sal;`
* D. `SELECT last_name, UPDATE(salary * 1.1) INTO v_lname, v_new_sal FROM employees WHERE employee_id = 100;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Mệnh đề **`RETURNING col1, col2 INTO var1, var2`** (hoặc `RETURN ... INTO ...`) ở cuối câu lệnh `INSERT`, `UPDATE`, hoặc `DELETE` cho phép trích xuất trực tiếp giá trị của các cột vừa bị tác động (sau khi `INSERT`/`UPDATE`, hoặc trước khi `DELETE`) đưa thẳng vào biến PL/SQL mà không tốn thêm 1 lần Context Switch hay 1 lần quét Index cho câu lệnh `SELECT` thứ hai!
</details>

---

### Câu 19 (Question 19)
**Cho biến bản ghi `r_dept departments%ROWTYPE;` đã chứa đầy đủ dữ liệu cho một phòng ban mới. Những câu lệnh DML nào dưới đây sử dụng trực tiếp biến Record `r_dept` là HỢP LỆ trong PL/SQL? (Chọn 2 đáp án đúng)**

* A. `INSERT INTO departments VALUES r_dept;` (Không có dấu ngoặc đơn quanh `r_dept`)
* B. `INSERT INTO departments VALUES (r_dept);` (Có dấu ngoặc đơn quanh `r_dept`)
* C. `UPDATE departments SET ROW = r_dept WHERE department_id = r_dept.department_id;`
* D. `UPDATE departments SET r_dept WHERE department_id = 10;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C**
* **Giải thích chuyên sâu:**
  * **A đúng:** Khi chèn toàn bộ một biến Record (`%ROWTYPE`) vào bảng, cú pháp chuẩn là `INSERT INTO table_name VALUES record_variable;` (**tuyệt đối không bọc `r_dept` trong dấu ngoặc đơn**!).
  * **B sai (Bẫy cú pháp):** Nếu viết `VALUES (r_dept)`, Oracle hiểu rằng bạn đang truyền 1 biểu thức đơn lẻ cho cột đầu tiên của bảng và sẽ báo lỗi `ORA-00947: not enough values`!
  * **C đúng:** Để cập nhật toàn bộ dòng của bảng bằng một biến Record, cú pháp chuẩn là `UPDATE table_name SET ROW = record_variable WHERE ...;` (từ khóa `ROW` đại diện cho toàn bộ dòng).
</details>

---

### Câu 20 (Question 20)
**Quan sát khối lệnh PL/SQL dưới đây. Tại sao khối lệnh này bị lỗi biên dịch?**

```sql
BEGIN
    FOR idx IN 1..5 LOOP
        NULL;
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('Gia tri cuoi cung cua idx: ' || idx);
END;
/
```

* A. Vì bên trong vòng lặp `FOR` không được phép viết lệnh `NULL;`
* B. Vì biến đếm `idx` được khai báo ngầm định bởi vòng lặp `FOR` chỉ có phạm vi (Scope) tồn tại bên trong vòng lặp đó; khi ra ngoài `END LOOP;`, biến `idx` không còn tồn tại nên dòng `DBMS_OUTPUT.PUT_LINE(... || idx)` bị lỗi biên dịch `PLS-00201: identifier 'IDX' must be declared`
* C. Vì `1..5` phải viết trong dấu ngoặc đơn `(1..5)`
* D. Vì tên biến không được đặt là `idx`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Biến chạy `idx` của vòng lặp `FOR` là biến cục bộ riêng của vòng lặp đó (có phạm vi từ từ khóa `FOR` cho đến hết `END LOOP;`). Ngay sau `END LOOP;`, biến `idx` bị hủy. Do phần `DECLARE` bên ngoài không khai báo biến nào tên là `idx`, việc truy cập `idx` sau `END LOOP;` sẽ gây lỗi biên dịch `PLS-00201: identifier 'IDX' must be declared`.
</details>

---

### Câu 21 (Question 21)
**Trong PL/SQL, điều gì sẽ xảy ra khi thực thi đoạn mã dưới đây?**

```sql
DECLARE
    v_max PLS_INTEGER;
BEGIN
    FOR i IN 1..v_max LOOP
        DBMS_OUTPUT.PUT_LINE(i);
    END LOOP;
END;
/
```

* A. Vòng lặp chạy 0 lần và kết thúc êm đẹp
* B. Vòng lặp chạy 1 lần với `i = 1`
* C. Ném ngoại lệ Runtime `VALUE_ERROR` (`ORA-06502: PL/SQL: numeric or value error`) vì cận trên `v_max` đang có giá trị là `NULL`!
* D. Ném ngoại lệ `NO_DATA_FOUND`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong vòng lặp `FOR i IN lower_bound..upper_bound LOOP`, cả hai cận `lower_bound` và `upper_bound` đều phải đánh giá ra một số nguyên hợp lệ (khác `NULL`). Vì biến `v_max` chưa được khởi tạo nên có giá trị là `NULL`. Khi gặp `1..NULL` tại thời điểm chạy, PL/SQL sẽ lập tức quăng lỗi **`VALUE_ERROR` (`ORA-06502`)**!
</details>

---

### Câu 22 (Question 22)
**Sự khác nhau về cú pháp kết thúc giữa `CASE Statement` (Câu lệnh CASE) và `CASE Expression` (Biểu thức CASE) trong PL/SQL là gì?**

* A. `CASE Statement` kết thúc bằng `END CASE;`, còn `CASE Expression` kết thúc bằng `END`
* B. `CASE Statement` kết thúc bằng `END;`, còn `CASE Expression` kết thúc bằng `END CASE`
* C. Cả hai đều bắt buộc kết thúc bằng `END CASE;`
* D. Cả hai đều kết thúc bằng `END IF;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Đây là điểm nhận diện cú pháp cực kỳ quan trọng trong đề thi:
    * **`CASE Statement`** (câu lệnh điều khiển độc lập tương đương `IF ... END IF;`) bắt buộc kết thúc bằng **`END CASE;`**.
    * **`CASE Expression`** (biểu thức trả về giá trị nằm bên trong một câu lệnh gán `v_x := CASE ... END;` hoặc bên trong lệnh `SELECT`/`PUT_LINE`) kết thúc chỉ bằng từ khóa **`END`**! Nếu viết `END CASE` cho một `CASE Expression`, trình biên dịch sẽ báo lỗi cú pháp ngay!
</details>

---

### Câu 23 (Question 23)
**Trong PL/SQL, kiểu dữ liệu số nguyên nào dưới đây có ràng buộc `NOT NULL` tự động (bắt buộc phải khởi tạo giá trị ngay khi khai báo) và thực hiện các phép toán số học trên phần cứng mà không kiểm tra tràn số (Overflow checking) để đạt tốc độ thực thi nhanh nhất?**

* A. `NUMBER`
* B. `PLS_INTEGER`
* C. `SIMPLE_INTEGER`
* D. `BINARY_FLOAT`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** `SIMPLE_INTEGER` (được giới thiệu từ Oracle 11g) là một kiểu con (subtype) đặc biệt của `PLS_INTEGER` có cùng miền giá trị 32-bit có dấu, nhưng có 2 đặc tính tối ưu hóa tốc độ:
    1. **Không bao giờ chứa `NULL`** (bắt buộc phải gán giá trị khác `NULL` ngay khi khai báo).
    2. **Không tốn chu kỳ CPU để kiểm tra tràn số (No overflow checking)** — nếu vượt quá cận trên sẽ tự động xoay vòng bit (wrap around).
</details>

---

### Câu 24 (Question 24)
**Quan sát khối lệnh sử dụng nhãn vòng lặp (`<<outer_loop>>`) dưới đây. Sau khi khối lệnh chạy xong, giá trị của biến `v_count` là bao nhiêu?**

```sql
DECLARE
    v_count PLS_INTEGER := 0;
BEGIN
    <<outer_loop>>
    FOR i IN 1..3 LOOP
        <<inner_loop>>
        FOR j IN 1..3 LOOP
            v_count := v_count + 1;
            EXIT outer_loop WHEN (i = 2 AND j = 2);
        END LOOP inner_loop;
    END LOOP outer_loop;
    DBMS_OUTPUT.PUT_LINE(v_count);
END;
/
```

* A. `9`
* B. `5`
* C. `4`
* D. `6`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Theo dõi từng lượt lặp:
    * Khi `i = 1`: Vòng lặp trong chạy đủ `j = 1, 2, 3` $\rightarrow$ `v_count` tăng 3 lần (`v_count = 3`).
    * Khi `i = 2`:
      * Lượt `j = 1`: `v_count` tăng lên **`4`**. Điều kiện `(i = 2 AND j = 2)` sai.
      * Lượt `j = 2`: `v_count` tăng lên **`5`**. Ngay sau đó, câu lệnh `EXIT outer_loop WHEN (i = 2 AND j = 2);` thỏa mãn và vì chỉ định nhãn **`outer_loop`**, nó **thoát thẳng ra khỏi cả vòng lặp ngoài cùng (`outer_loop`)** ngay lập tức!
    * Do đó giá trị cuối cùng của `v_count` là **`5`**. (Nếu chỉ viết `EXIT WHEN ...` không có nhãn `outer_loop`, nó chỉ thoát vòng lặp trong `inner_loop` rồi tiếp tục chạy `i = 3`).
</details>

---

### Câu 25 (Question 25)
**Thuộc tính nào của con trỏ ngầm định (`SQL` Implicit Cursor) trả về giá trị kiểu `BOOLEAN` là `TRUE` nếu câu lệnh `INSERT`, `UPDATE`, `DELETE`, hoặc `MERGE` vừa thực thi ngay trước đó tác động được lên ÍT NHẤT 1 DÒNG dữ liệu?**

* A. `SQL%ROWCOUNT`
* B. `SQL%FOUND`
* C. `SQL%ISOPEN`
* D. `SQL%NOTFOUND`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Các thuộc tính của con trỏ ngầm định `SQL`:
    * **`SQL%FOUND`** (`BOOLEAN`): Trả về `TRUE` nếu lệnh DML gần nhất tác động được $\ge 1$ dòng.
    * **`SQL%NOTFOUND`** (`BOOLEAN`): Trả về `TRUE` nếu lệnh DML gần nhất tác động `0` dòng (không có dòng nào thỏa mãn).
    * **`SQL%ROWCOUNT`** (`PLS_INTEGER`): Trả về số lượng dòng bị tác động (kiểu số nguyên, không phải `BOOLEAN`).
    * **`SQL%ISOPEN`** (`BOOLEAN`): Luôn trả về **`FALSE`** đối với con trỏ ngầm định `SQL` vì Oracle tự động đóng con trỏ ngầm định ngay sau khi câu lệnh SQL thực thi xong!
</details>

---
