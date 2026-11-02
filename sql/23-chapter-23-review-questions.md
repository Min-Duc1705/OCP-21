# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 23: Procedure và Function

> **Tài liệu tham chiếu:** *OCP Oracle Database Program with PL/SQL Study Guide (Exam 1Z0-149)*  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle OCP 1Z0-149 & VNPT kèm phân tích & đáp án chi tiết.  
> **Cách học:** Bạn hãy tự đọc đề và chọn đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và nắm vững bẫy thi.

---

### Câu 1 (Question 1)
**Câu lệnh tạo Stored Function nào dưới đây biên dịch THÀNH CÔNG trong Oracle Database?**

* A. `CREATE OR REPLACE FUNCTION fn_get_name (p_id IN NUMBER(6)) RETURN VARCHAR2 IS BEGIN RETURN 'King'; END;`
* B. `CREATE OR REPLACE FUNCTION fn_get_name () RETURN VARCHAR2 IS BEGIN RETURN 'King'; END;`
* C. `CREATE OR REPLACE FUNCTION fn_get_name (p_id IN NUMBER) RETURN VARCHAR2(50) IS BEGIN RETURN 'King'; END;`
* D. `CREATE OR REPLACE FUNCTION fn_get_name (p_id IN employees.employee_id%TYPE DEFAULT 100) RETURN VARCHAR2 IS BEGIN RETURN 'King'; END;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Tham số hình thức sử dụng kiểu neo `%TYPE` có giá trị mặc định `DEFAULT 100` và kiểu trả về `RETURN VARCHAR2` không chỉ định kích thước độ dài là hoàn toàn đúng chuẩn cú pháp PL/SQL.
  * **A sai:** Không được chỉ định độ chính xác/độ dài trực tiếp cho tham số hình thức (`NUMBER(6)` gây lỗi `PLS-00103`).
  * **B sai:** Khi khai báo Procedure hoặc Function không có tham số, không được phép viết cặp dấu ngoặc đơn rỗng `()`.
  * **C sai:** Không được chỉ định kích thước độ dài cho kiểu dữ liệu ở mệnh đề `RETURN` (`RETURN VARCHAR2(50)` gây lỗi biên dịch).
</details>

---

### Câu 2 (Question 2)
**Tại sao đoạn mã khởi tạo Stored Procedure dưới đây lại gặp lỗi khi biên dịch?**

```sql
CREATE OR REPLACE PROCEDURE sp_update_dept (
    p_dept_id   IN NUMBER,
    p_dept_name IN VARCHAR2
) IS
DECLARE
    v_count NUMBER := 0;
BEGIN
    UPDATE departments
    SET department_name = p_dept_name
    WHERE department_id = p_dept_id;
END sp_update_dept;
```

* A. Vì thiếu mệnh đề `RETURN` trong phần Header của Procedure.
* B. Vì sử dụng từ khóa `DECLARE` ngay sau từ khóa `IS` (trong Stored Subprogram, `IS` hoặc `AS` đã thay thế cho `DECLARE`).
* C. Vì không được phép khởi tạo giá trị `:= 0` cho biến cục bộ `v_count`.
* D. Vì câu lệnh `UPDATE` trong Procedure bắt buộc phải đi kèm lệnh `COMMIT`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong cú pháp của Stored Procedure, Function hoặc Package, từ khóa `IS` (hoặc `AS`) đã đánh dấu sự bắt đầu của vùng khai báo (Declarative Section). Việc viết thêm từ khóa `DECLARE` ngay dưới `IS` sẽ gây lỗi biên dịch **`PLS-00103: Encountered the symbol "DECLARE"`**. Từ khóa `DECLARE` chỉ dùng khi bạn bắt đầu một khối vô danh (Anonymous Block) mới bên trong phần `BEGIN ... END`.
  * **A, C, D sai:** Procedure không có mệnh đề `RETURN` ở Header, biến cục bộ hoàn toàn có thể khởi tạo `:= 0`, và `COMMIT` là tùy chọn theo thiết kế giao dịch.
</details>

---

### Câu 3 (Question 3)
**Những phát biểu nào sau đây là ĐÚNG khi so sánh các chế độ tham số `IN`, `OUT`, và `IN OUT` trong PL/SQL? (Chọn 2 đáp án đúng)**

* A. Tham số chế độ `IN` được truyền theo cơ chế tham chiếu (Pass by Reference) và hoạt động như một hằng số chỉ đọc (Read-only) bên trong Subprogram.
* B. Tham số chế độ `OUT` và `IN OUT` đều được phép khai báo giá trị mặc định bằng từ khóa `DEFAULT` hoặc `:=`.
* C. Khi gọi một Subprogram, đối số thực tế (Actual Parameter) truyền vào cho vị trí tham số `OUT` hoặc `IN OUT` bắt buộc phải là một biến (Variable), không thể là hằng số hay biểu thức.
* D. Chế độ tham số mặc định nếu không ghi rõ trong khai báo Procedure là `IN OUT`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C**
* **Giải thích chuyên sâu:**
  * **A đúng:** Mặc định, tham số `IN` luôn truyền bằng con trỏ tham chiếu (Pass by Reference) và không được phép gán lại giá trị ở bên trong thân Subprogram.
  * **C đúng:** Vì tham số `OUT` và `IN OUT` dùng để nhận giá trị trả ra từ Subprogram, đối số truyền vào khi gọi bắt buộc phải là một biến có vùng nhớ để lưu giá trị (nếu truyền số `100` hoặc biểu thức `v_a + 1` sẽ bị lỗi biên dịch `PLS-00363: expression cannot be used as an assignment target`).
  * **B sai:** Chỉ duy nhất tham số chế độ `IN` mới được phép có giá trị `DEFAULT` / `:=`. `OUT` và `IN OUT` cấm khai báo Default.
  * **D sai:** Chế độ mặc định khi không ghi rõ luôn là `IN`.
</details>

---

### Câu 4 (Question 4)
**Hãy xác định kết quả in ra màn hình khi thực thi đoạn mã PL/SQL dưới đây:**

```sql
DECLARE
    v_num NUMBER := 500;

    PROCEDURE sp_reset (p_val OUT NUMBER) IS
    BEGIN
        DBMS_OUTPUT.PUT_LINE('Trong thủ tục (trước khi gán): ' || NVL(TO_CHAR(p_val), 'NULL'));
        IF p_val IS NULL THEN
            p_val := 100;
        ELSE
            p_val := p_val + 100;
        END IF;
    END;
BEGIN
    sp_reset(v_num);
    DBMS_OUTPUT.PUT_LINE('Ngoài thủ tục (sau khi gọi): ' || v_num);
END;
```

* A. `Trong thủ tục (trước khi gán): 500` và `Ngoài thủ tục (sau khi gọi): 600`
* B. `Trong thủ tục (trước khi gán): NULL` và `Ngoài thủ tục (sau khi gọi): 100`
* C. `Trong thủ tục (trước khi gán): NULL` và `Ngoài thủ tục (sau khi gọi): 500`
* D. Báo lỗi biên dịch vì không được phép đọc giá trị của tham số chế độ `OUT` (`IF p_val IS NULL`) ở bên trong thủ tục.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Mặc dù biến đối số `v_num` bên ngoài đang có giá trị là `500`, nhưng vì tham số `p_val` được khai báo ở chế độ **`OUT`** (không phải `IN OUT`), nên ngay khi bước vào thủ tục `sp_reset`, biến đệm của `p_val` được khởi tạo mới hoàn toàn với giá trị **`NULL`**!
    * Do đó, câu lệnh in đầu tiên xuất ra: `Trong thủ tục (trước khi gán): NULL`.
    * Điều kiện `IF p_val IS NULL` đúng nên `p_val` được gán bằng `100`.
    * Khi thủ tục kết thúc thành công, giá trị `100` được copy ra biến `v_num`, in ra: `Ngoài thủ tục (sau khi gọi): 100`.
  * **A, C, D sai:** Kể từ các phiên bản Oracle hiện đại, tham số `OUT` hoàn toàn được phép đọc giá trị ở bên trong thân Subprogram (nhưng giá trị ban đầu của nó khi mới vào hàm luôn là `NULL`).
</details>

---

### Câu 5 (Question 5)
**Xem xét đoạn mã kiểm tra hành vi của tham số `OUT` và `IN OUT` khi xảy ra ngoại lệ không được xử lý (Unhandled Exception) bên trong thủ tục con. Kết quả in ra màn hình là gì?**

```sql
DECLARE
    v_x NUMBER := 10;
    v_y NUMBER := 20;

    PROCEDURE sp_fail (
        p_a OUT    NUMBER,
        p_b IN OUT NUMBER
    ) IS
    BEGIN
        p_a := 99;
        p_b := 88;
        RAISE ZERO_DIVIDE;
    END;
BEGIN
    BEGIN
        sp_fail(v_x, v_y);
    EXCEPTION
        WHEN ZERO_DIVIDE THEN
            NULL;
    END;
    DBMS_OUTPUT.PUT_LINE('v_x = ' || NVL(TO_CHAR(v_x), 'NULL') || ', v_y = ' || v_y);
END;
```

* A. `v_x = 99, v_y = 88`
* B. `v_x = NULL, v_y = 20`
* C. `v_x = 10, v_y = 20`
* D. `v_x = 99, v_y = 20`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Mặc định (khi không có gợi ý `NOCOPY`), cả tham số `OUT` (`p_a`) và `IN OUT` (`p_b`) đều được truyền theo cơ chế **Pass by Value** (sử dụng biến đệm tạm thời). Quá trình sao chép giá trị từ biến đệm tạm thời ra các biến đối số thực tế (`v_x`, `v_y`) **chỉ diễn ra khi thủ tục `sp_fail` kết thúc bình thường**.
    * Vì `sp_fail` bị thoát đột ngột bởi ngoại lệ `ZERO_DIVIDE` (chưa được bắt bên trong `sp_fail`), việc sao chép ngược bị hủy bỏ hoàn toàn!
    * Do đó, cả `v_x` và `v_y` đều bảo toàn nguyên vẹn giá trị gốc trước khi gọi thủ tục là `v_x = 10, v_y = 20`.
  * **A, B, D sai:** Chỉ khi dùng `NOCOPY` (hoặc bắt ngoại lệ ngay bên trong `sp_fail`), giá trị `99` và `88` mới xuất hiện ở biến bên ngoài.
</details>

---

### Câu 6 (Question 6)
**Nếu sửa lại thủ tục `sp_fail` ở Câu 5 bằng cách thêm từ khóa `NOCOPY` vào tham số thứ hai (`p_b IN OUT NOCOPY NUMBER`), thì kết quả in ra của đoạn mã dưới đây sẽ là gì?**

```sql
DECLARE
    v_x NUMBER := 10;
    v_y NUMBER := 20;

    PROCEDURE sp_fail (
        p_a OUT           NUMBER,
        p_b IN OUT NOCOPY NUMBER
    ) IS
    BEGIN
        p_a := 99;
        p_b := 88;
        RAISE ZERO_DIVIDE;
    END;
BEGIN
    BEGIN
        sp_fail(v_x, v_y);
    EXCEPTION
        WHEN ZERO_DIVIDE THEN
            NULL;
    END;
    DBMS_OUTPUT.PUT_LINE('v_x = ' || v_x || ', v_y = ' || v_y);
END;
```

* A. `v_x = 10, v_y = 20`
* B. `v_x = 10, v_y = 88`
* C. `v_x = 99, v_y = 88`
* D. Báo lỗi biên dịch vì không được dùng `NOCOPY` cho kiểu dữ liệu `NUMBER`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * Tham số `p_a` (`OUT` không có `NOCOPY`) dùng cơ chế Pass by Value, nên khi văng ngoại lệ `ZERO_DIVIDE`, biến `v_x` giữ nguyên giá trị cũ là **`10`**.
    * Tham số `p_b` (`IN OUT NOCOPY`) dùng cơ chế **Pass by Reference** (trỏ trực tiếp vào địa chỉ ô nhớ của biến `v_y`). Ngay khi dòng lệnh `p_b := 88;` thực thi, biến `v_y` đã bị ghi đè thành **`88`**. Khi ngoại lệ `ZERO_DIVIDE` xảy ra ở dòng sau đó, giá trị của `v_y` không thể khôi phục lại mà giữ nguyên là **`88`**.
  * **A, C, D sai:** `NOCOPY` hợp lệ với mọi kiểu dữ liệu ở chế độ `OUT` và `IN OUT`.
</details>

---

### Câu 7 (Question 7)
**Khai báo tham số nào dưới đây sẽ gây ra LỖI BIÊN DỊCH khi sử dụng từ khóa `NOCOPY`?**

* A. `p_emp_rec OUT NOCOPY employees%ROWTYPE`
* B. `p_emp_list IN OUT NOCOPY t_emp_tab_type`
* C. `p_emp_id IN NOCOPY NUMBER`
* D. `p_name OUT NOCOPY VARCHAR2`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (Gây lỗi biên dịch):** Trong PL/SQL, tham số chế độ **`IN`** mặc định luôn luôn được truyền theo cơ chế **Pass by Reference** (không bao giờ sao chép vùng nhớ). Do đó, Oracle không cho phép viết `IN NOCOPY` và sẽ báo lỗi biên dịch **`PLS-00103: Encountered the symbol "NOCOPY"`**. Từ khóa `NOCOPY` chỉ được phép đi kèm với `OUT` hoặc `IN OUT`.
  * **A, B, D sai:** Đều là các khai báo `OUT NOCOPY` và `IN OUT NOCOPY` hoàn toàn hợp lệ.
</details>

---

### Câu 8 (Question 8)
**Trong trường hợp nào dưới đây, trình biên dịch PL/SQL sẽ PHỚT LỜ gợi ý `NOCOPY` và tự động quay về cơ chế truyền theo giá trị (Pass by Value) mà KHÔNG báo lỗi?**

* A. Khi tham số là một kiểu `RECORD` hoặc `Nested Table` có kích thước lớn.
* B. Khi cuộc gọi thủ tục là một cuộc gọi từ xa qua kết nối mạng (Remote Procedure Call - RPC qua Database Link) hoặc khi đối số thực tế có ràng buộc `NOT NULL`.
* C. Khi thủ tục nằm bên trong một Package.
* D. Khi thủ tục có sử dụng khối bắt lỗi `EXCEPTION`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Vì `NOCOPY` là một gợi ý biên dịch (Compiler Hint) chứ không phải chỉ thị bắt buộc, PL/SQL sẽ tự động bỏ qua `NOCOPY` và dùng Pass by Value trong các tình huống không thể truyền trực tiếp con trỏ bộ nhớ:
    1. Gọi thủ tục từ xa qua Database Link (RPC) — vì hai Server không dùng chung bộ nhớ RAM.
    2. Đối số thực tế là một biến có ràng buộc `NOT NULL`, có ràng buộc độ dài/scale hẹp hơn, cần chuyển đổi kiểu ngầm định, hoặc là phần tử của một Associative Array.
  * **A, C, D sai:** `NOCOPY` hoạt động bình thường và phát huy hiệu quả cao nhất với `RECORD` / `Collection` lớn trong các Package nội bộ.
</details>

---

### Câu 9 (Question 9)
**Cho thủ tục `sp_process` có phần Header như sau. Những lời gọi thủ tục nào dưới đây là HỢP LỆ? (Chọn 2 đáp án đúng)**

```sql
CREATE OR REPLACE PROCEDURE sp_process (
    p_a IN NUMBER,
    p_b IN NUMBER DEFAULT 10,
    p_c IN NUMBER,
    p_d IN NUMBER := 20
) IS
BEGIN
    NULL;
END;
```

* A. `sp_process(1, 2, 3);`
* B. `sp_process(1, , 3, 4);`
* C. `sp_process(1, p_c => 3);`
* D. `sp_process(p_a => 1, p_c => 3, 4);`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C**
* **Giải thích chuyên sâu:**
  * **A đúng (Positional Notation):** `p_a` nhận `1`, `p_b` nhận `2`, `p_c` nhận `3`, và tham số cuối cùng `p_d` được lược bỏ nên tự động nhận giá trị mặc định `20`.
  * **C đúng (Mixed Notation):** Đối số thứ nhất `1` truyền theo vị trí cho `p_a`; sau đó chuyển sang ký pháp tên `p_c => 3`. Cả `p_b` và `p_d` đều có giá trị mặc định nên được lược bỏ hợp lệ!
  * **B sai:** Trong PL/SQL, bạn không thể để trống giữa hai dấu phẩy `(1, , 3, 4)` để bỏ qua tham số ở giữa.
  * **D sai:** Vi phạm quy tắc của Mixed Notation: Một khi đã dùng ký pháp tên (`p_a => 1, p_c => 3`), tuyệt đối **không được quay lại dùng ký pháp vị trí** (`4`) ở phía sau (lỗi `PLS-00312`).
</details>

---

### Câu 10 (Question 10)
**Điều gì xảy ra khi thực thi đoạn mã PL/SQL dưới đây?**

```sql
DECLARE
    FUNCTION fn_check (p_val NUMBER) RETURN VARCHAR2 IS
    BEGIN
        IF p_val > 0 THEN
            RETURN 'Positive';
        ELSIF p_val < 0 THEN
            RETURN 'Negative';
        END IF;
    END fn_check;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Kết quả: ' || fn_check(0));
END;
```

* A. In ra màn hình `Kết quả: ` (vì hàm tự động trả về `NULL` nếu không rơi vào nhánh `IF` nào).
* B. Báo lỗi biên dịch và từ chối chạy vì thiếu nhánh `ELSE` trong hàm.
* C. Biên dịch thành công, nhưng khi chạy với đối số `0` sẽ ném ra ngoại lệ Runtime `ORA-06503: PL/SQL: Function returned without value`.
* D. Ném ra ngoại lệ Runtime `NO_DATA_FOUND` (`ORA-01403`).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khác với nhiều ngôn ngữ lập trình khác, trong PL/SQL nếu có ít nhất một lệnh `RETURN` trong thân `FUNCTION`, trình biên dịch vẫn cho phép biên dịch thành công (chỉ đưa ra cảnh báo `PLW-05005` nếu bật Warning). Tuy nhiên, tại thời điểm **Runtime**, khi truyền `p_val = 0`, luồng thực thi đi hết cả hai nhánh `IF/ELSIF` và chạm tới `END fn_check;` mà không gặp bất kỳ lệnh `RETURN` nào. Lúc này PL/SQL Engine sẽ ném ra ngoại lệ nghiêm trọng **`ORA-06503: PL/SQL: Function returned without value` (`FUNCTION_RETURNED_WITHOUT_VALUE`)**!
  * **A, B, D sai:** Hàm PL/SQL không bao giờ tự động trả về `NULL` nếu chạm `END` mà không có lệnh `RETURN`.
</details>

---

### Câu 11 (Question 11)
**Phát biểu nào sau đây là ĐÚNG về việc sử dụng câu lệnh `RETURN` bên trong một `PROCEDURE`?**

* A. Hoàn toàn bị cấm; sử dụng từ khóa `RETURN` trong `PROCEDURE` sẽ luôn gây lỗi biên dịch.
* B. Được phép sử dụng câu lệnh `RETURN;` (không kèm theo biểu thức giá trị) để kết thúc sớm việc thực thi của `PROCEDURE` và trả quyền điều khiển về cho nơi gọi.
* C. Được phép sử dụng `RETURN 0;` hoặc `RETURN TRUE;` để trả mã trạng thái của `PROCEDURE`.
* D. Lệnh `RETURN;` trong `PROCEDURE` sẽ tự động `ROLLBACK` mọi câu lệnh DML trước đó.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong một `PROCEDURE`, bạn hoàn toàn có thể viết câu lệnh `RETURN;` đứng một mình (không có biểu thức theo sau) để thoát ngay lập tức khỏi thủ tục mà không cần chạy các câu lệnh còn lại phía dưới.
  * **A, C sai:** Nếu viết `RETURN biểu_thức;` trong Procedure sẽ báo lỗi `PLS-00372: In a procedure, RETURN statement cannot contain an expression`.
  * **D sai:** Lệnh `RETURN;` chỉ điều khiển luồng chương trình, hoàn toàn không tự động `COMMIT` hay `ROLLBACK` giao dịch.
</details>

---

### Câu 12 (Question 12)
**Quan sát khối lệnh PL/SQL có chứa chương trình con cục bộ (Local Subprogram) dưới đây. Tại sao khối lệnh này lại báo lỗi biên dịch?**

```sql
DECLARE
    v_rate NUMBER := 0.1;

    FUNCTION fn_calc (p_amt NUMBER) RETURN NUMBER IS
    BEGIN
        RETURN p_amt * v_rate;
    END fn_calc;

    v_result NUMBER;
BEGIN
    v_result := fn_calc(1000);
    DBMS_OUTPUT.PUT_LINE(v_result);
END;
```

* A. Vì một khối vô danh (`DECLARE ... BEGIN ... END`) không được phép chứa `FUNCTION` bên trong.
* B. Vì hàm cục bộ `fn_calc` không được phép truy cập biến `v_rate` của khối bao ngoài.
* C. Vì biến `v_result NUMBER;` được khai báo phía SAU định nghĩa hàm cục bộ `fn_calc` (trong PL/SQL, mọi Local Subprograms bắt buộc phải được đặt ở cuối cùng của phần `DECLARE`).
* D. Vì thiếu từ khóa `CREATE` trước `FUNCTION fn_calc`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Quy tắc cấu trúc phần khai báo (`DECLARE` hoặc `IS`/`AS`) của PL/SQL quy định: Tất cả các biến, hằng số, kiểu (`TYPE`), con trỏ (`CURSOR`), và ngoại lệ (`EXCEPTION`) **bắt buộc phải được khai báo TRƯỚC**, và tất cả các chương trình con cục bộ (`PROCEDURE`, `FUNCTION`) **bắt buộc phải nằm ở CUỐI CÙNG** của vùng khai báo (ngay trước từ khóa `BEGIN`). Việc đặt `v_result NUMBER;` sau `END fn_calc;` gây lỗi biên dịch **`PLS-00103: Encountered the symbol "V_RESULT"`**.
  * **A, B, D sai:** Local Subprogram hoàn toàn hợp lệ trong phần `DECLARE` (không dùng từ khóa `CREATE`) và có toàn quyền đọc/ghi các biến của khối bao ngoài khai báo phía trên nó.
</details>

---

### Câu 13 (Question 13)
**Khi nào bạn BẮT BUỘC phải sử dụng kỹ thuật Khai báo tiền định (Forward Declaration) cho các Local Subprograms trong PL/SQL?**

* A. Bất cứ khi nào bạn khai báo nhiều hơn một Local Procedure trong cùng một khối `DECLARE`.
* B. Khi hai Local Subprograms gọi chéo lẫn nhau (Đệ quy tương hỗ - Mutual Recursion, ví dụ: Thủ tục `A` gọi thủ tục `B`, và thủ tục `B` cũng gọi lại thủ tục `A`).
* C. Khi một Local Function cần được gọi từ bên trong một câu lệnh SQL `SELECT`.
* D. Khi một Local Procedure có sử dụng tham số chế độ `OUT NOCOPY`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** PL/SQL yêu cầu mọi định danh (bao gồm cả tên Subprogram) phải được khai báo trước khi được gọi. Nếu `A` gọi `B` và `B` gọi `A`, dù bạn đặt hàm nào lên trước thì hàm đó cũng gọi một hàm chưa được định nghĩa ở phía dưới. Giải pháp duy nhất là đặt **Forward Declaration** (`PROCEDURE B(p_x NUMBER);`) ở đầu danh sách Subprogram, sau đó viết thân của `A`, rồi viết thân của `B`.
  * **A sai:** Nếu chỉ `B` gọi `A` (một chiều), bạn chỉ cần định nghĩa `A` trước `B` là đủ, không cần Forward Declaration.
  * **C sai:** Local Function khai báo trong `DECLARE` của PL/SQL không thể gọi từ câu lệnh SQL dù có Forward Declaration hay không.
  * **D sai:** `NOCOPY` không liên quan đến thứ tự khai báo.
</details>

---

### Câu 14 (Question 14)
**Một Stored Function `fn_process` được tạo thành công trong Database. Tuy nhiên, để hàm này có thể được gọi hợp lệ bên trong mệnh đề `SELECT` hoặc `WHERE` của một câu truy vấn SQL, hàm `fn_process` phải thỏa mãn những điều kiện nào sau đây? (Chọn 2 đáp án đúng)**

* A. Tất cả các tham số của hàm phải ở chế độ `IN` (không được có tham số `OUT` hoặc `IN OUT`).
* B. Kiểu trả về (`RETURN`) của hàm bắt buộc phải là kiểu dữ liệu được SQL Engine hỗ trợ (như `NUMBER`, `VARCHAR2`, `DATE`), không được trả về kiểu thuần PL/SQL như `RECORD` hay `BOOLEAN` (theo chuẩn 19c/21c).
* C. Tên của tất cả các tham số trong hàm phải bắt đầu bằng tiền tố `SQL_`.
* D. Trong thân hàm bắt buộc phải có câu lệnh `COMMIT;` ở trước câu lệnh `RETURN`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B**
* **Giải thích chuyên sâu:**
  * **A đúng:** Câu lệnh SQL không hỗ trợ nhận giá trị trả ra từ tham số `OUT` hoặc `IN OUT` của một hàm (nếu có sẽ báo lỗi `ORA-06572: Function ... has out arguments`).
  * **B đúng:** SQL Engine phải hiểu được kiểu dữ liệu trả về của hàm. Các kiểu đặc thù của PL/SQL như `RECORD`, Associative Array (`INDEX BY`), hay `BOOLEAN` (trước 23ai) sẽ gây lỗi `PLS-00382: expression is of wrong type` khi gọi trong câu lệnh `SELECT`.
  * **C sai:** Tên tham số đặt tùy ý.
  * **D sai:** Ngược lại hoàn toàn! Hàm gọi từ SQL bị **cấm** thực hiện `COMMIT` hoặc `ROLLBACK` (trừ khi là Autonomous Transaction).
</details>

---

### Câu 15 (Question 15)
**Lập trình viên tạo hàm `fn_audit_sal` và sau đó chạy câu lệnh `SELECT` như bên dưới. Điều gì sẽ xảy ra khi thực thi câu lệnh `SELECT` này?**

```sql
CREATE OR REPLACE FUNCTION fn_audit_sal (p_emp_id NUMBER, p_sal NUMBER)
RETURN NUMBER IS
BEGIN
    INSERT INTO salary_audit_log (emp_id, checked_date)
    VALUES (p_emp_id, SYSDATE);
    
    RETURN p_sal * 1.10;
END fn_audit_sal;
/

SELECT employee_id, fn_audit_sal(employee_id, salary)
FROM employees
WHERE department_id = 10;
```

* A. Câu lệnh `SELECT` chạy thành công, vừa trả về lương mới vừa chèn dòng lịch sử vào bảng `salary_audit_log`.
* B. Hàm `fn_audit_sal` báo lỗi biên dịch ngay lúc chạy lệnh `CREATE OR REPLACE FUNCTION` vì không được viết lệnh `INSERT` trong một `FUNCTION`.
* C. Hàm biên dịch thành công, nhưng câu lệnh `SELECT` thất bại lúc Runtime với lỗi `ORA-14551: cannot perform a DML operation inside a query`.
* D. Câu lệnh `SELECT` chạy thành công nhưng tự động bỏ qua lệnh `INSERT` bên trong hàm.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:**
    * Bản thân một `FUNCTION` trong PL/SQL hoàn toàn được phép chứa các lệnh DML (`INSERT`, `UPDATE`, `DELETE`) nếu bạn chỉ gọi hàm đó trong khối lệnh PL/SQL (`v_x := fn_audit_sal(100, 5000);`). Vì vậy, bước `CREATE FUNCTION` **biên dịch thành công 100%**.
    * Tuy nhiên, khi bạn gọi hàm đó từ bên trong một câu truy vấn **`SELECT`**, quy tắc toàn vẹn đọc của SQL Engine cấm câu lệnh `SELECT` làm thay đổi dữ liệu trong Database (Side effects). Do đó, tại thời điểm Runtime, câu lệnh `SELECT` lập tức ném lỗi **`ORA-14551: cannot perform a DML operation inside a query`**!
  * **A, B, D sai:** Nếu muốn ghi log DML bên trong một hàm được gọi từ `SELECT`, bạn bắt buộc phải khai báo `PRAGMA AUTONOMOUS_TRANSACTION;` kèm `COMMIT;` bên trong hàm `fn_audit_sal`.
</details>

---

### Câu 16 (Question 16)
**Điều gì sẽ xảy ra khi thực thi câu lệnh `UPDATE` dưới đây gọi hàm `fn_get_max_sal`?**

```sql
CREATE OR REPLACE FUNCTION fn_get_max_sal (p_dept_id NUMBER)
RETURN NUMBER IS
    v_max NUMBER;
BEGIN
    SELECT MAX(salary) INTO v_max
    FROM employees
    WHERE department_id = p_dept_id;
    RETURN v_max;
END;
/

UPDATE employees
SET salary = fn_get_max_sal(department_id)
WHERE department_id = 20;
```

* A. Tất cả nhân viên phòng 20 được cập nhật lương bằng mức lương cao nhất của phòng 20.
* B. Câu lệnh `UPDATE` thất bại lúc Runtime với lỗi `ORA-14551: cannot perform a DML operation inside a query`.
* C. Câu lệnh `UPDATE` thất bại lúc Runtime với lỗi `ORA-04091: table is mutating, trigger/function may not see it` vì hàm được gọi từ câu lệnh `UPDATE` trên bảng `EMPLOYEES` lại thực hiện `SELECT` đọc chính bảng `EMPLOYEES` đang bị thay đổi.
* D. Báo lỗi biên dịch ở hàm `fn_get_max_sal`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Quy tắc kiểm soát tác dụng phụ (Side-effect rule) của SQL quy định: Một PL/SQL Function được gọi từ một câu lệnh DML (`INSERT`, `UPDATE`, `DELETE`, `MERGE`) **không được phép đọc (`SELECT`) hoặc sửa đổi chính bảng dữ liệu đang bị câu lệnh DML đó tác động**! Vì câu lệnh `UPDATE` đang sửa bảng `EMPLOYEES` (có nhiều dòng ở phòng 20), việc hàm `fn_get_max_sal` chạy lệnh `SELECT ... FROM employees` sẽ nhìn thấy dữ liệu đang biến đổi dở dang và lập tức kích hoạt lỗi **`ORA-04091: table is mutating, trigger/function may not see it`**.
  * **A, B, D sai:** Lỗi Mutating Table (`ORA-04091`) không chỉ xảy ra ở Row-level Trigger mà còn xảy ra ở PL/SQL Function được gọi từ câu lệnh DML!
</details>

---

### Câu 17 (Question 17)
**Từ khóa nào bắt buộc phải được thêm vào phần Header của một Stored Function nếu bạn muốn sử dụng hàm đó để tạo một Chỉ mục dựa trên hàm (Function-Based Index - FBI) hoặc Materialized View?**

* A. `RESULT_CACHE`
* B. `DETERMINISTIC`
* C. `PARALLEL_ENABLE`
* D. `AUTHID CURRENT_USER`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Để tạo một Function-Based Index (ví dụ: `CREATE INDEX idx_upper_name ON emp(fn_custom_format(name));`), Oracle đòi hỏi hàm đó phải luôn trả về cùng một kết quả cố định cho cùng một giá trị đầu vào ở mọi thời điểm lưu trữ chỉ mục. Do đó, hàm bắt buộc phải được khai báo với từ khóa **`DETERMINISTIC`** (nếu thiếu sẽ bị lỗi `ORA-30553: The function is not deterministic`).
  * **A, C, D sai:** `RESULT_CACHE` dùng để lưu đệm kết quả trong SGA nhưng không thể thay thế cho `DETERMINISTIC` khi tạo Function-Based Index.
</details>

---

### Câu 18 (Question 18)
**Sự khác biệt quan trọng nhất giữa một hàm sử dụng `DETERMINISTIC` và một hàm sử dụng `RESULT_CACHE` là gì?**

* A. `DETERMINISTIC` lưu kết quả vào ổ cứng, còn `RESULT_CACHE` lưu vào PGA.
* B. `DETERMINISTIC` chỉ lưu đệm kết quả trong phạm vi một câu truy vấn SQL đơn lẻ của phiên hiện tại, trong khi `RESULT_CACHE` lưu kết quả trong vùng nhớ Shared Pool (SGA) để chia sẻ dùng chung cho tất cả các phiên làm việc (Sessions) và tự động làm mới khi bảng dữ liệu gốc có thay đổi (`COMMIT`).
* C. `RESULT_CACHE` không được phép chứa câu lệnh `SELECT` truy vấn bảng bên trong thân hàm, còn `DETERMINISTIC` thì được khuyến khích truy vấn bảng.
* D. `DETERMINISTIC` chỉ dùng được cho kiểu `NUMBER`, còn `RESULT_CACHE` dùng được cho mọi kiểu dữ liệu.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * Với **`DETERMINISTIC`**: SQL Engine chỉ giữ một bảng băm nhỏ trong PGA cho **một câu lệnh SQL đang chạy**. Ngay khi câu lệnh `SELECT` đó kết thúc, bộ nhớ đệm này bị xóa sạch và không chia sẻ cho câu lệnh sau hay Session khác.
    * Với **`RESULT_CACHE`**: Kết quả được lưu trữ tập trung trong vùng nhớ **Result Cache của SGA**. Mọi Session khác khi gọi hàm với cùng tham số sẽ lấy ngay kết quả từ SGA mà không cần thực thi lại thân hàm. Hơn nữa, Oracle tự động theo dõi sự phụ thuộc (Dependency Tracking): nếu bảng dữ liệu mà hàm đọc có thay đổi được `COMMIT`, Oracle tự động đánh dấu hủy (invalidate) các mục cache liên quan!
  * **A, C, D sai:** Thực tế, một hàm `DETERMINISTIC` chuẩn mực không nên truy vấn bảng dữ liệu (vì dữ liệu bảng có thể thay đổi theo thời gian), trong khi `RESULT_CACHE` sinh ra để tối ưu các hàm đọc bảng tra cứu ít biến động (Lookup/Config tables).
</details>

---

### Câu 19 (Question 19)
**Chỉ thị trình biên dịch `PRAGMA UDF;` (được giới thiệu từ Oracle 12c) đặt bên trong phần khai báo của một PL/SQL Function có tác dụng gì?**

* A. Cho phép hàm thực hiện câu lệnh `UPDATE` và `DELETE` trực tiếp khi được gọi từ câu lệnh `SELECT`.
* B. Báo cho trình biên dịch tối ưu hóa mã máy của hàm để giảm thiểu chi phí chuyển ngữ cảnh (Context Switching overhead) khi hàm được gọi từ bên trong các câu lệnh SQL.
* C. Tự động chuyển quyền thực thi của hàm sang `AUTHID CURRENT_USER`.
* D. Biến hàm đó thành một giao dịch độc lập (`AUTONOMOUS_TRANSACTION`).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** `PRAGMA UDF` (*User-Defined Function*) thông báo cho trình biên dịch PL/SQL rằng hàm này được thiết kế để gọi chủ yếu từ các câu lệnh **SQL** (thay vì gọi từ PL/SQL). Trình biên dịch sẽ chuẩn bị sẵn cấu trúc khung ngăn xếp và chuyển đổi kiểu dữ liệu tương thích trực tiếp với SQL Engine, giúp tốc độ gọi hàm trong câu lệnh `SELECT` trên tập dữ liệu lớn nhanh hơn đáng kể.
  * **A, C, D sai:** `PRAGMA UDF` là tối ưu hóa hiệu năng gọi hàm từ SQL, không thay đổi quy tắc cấm DML (`ORA-14551`), không đổi `AUTHID` và không tạo giao dịch độc lập.
</details>

---

### Câu 20 (Question 20)
**Giả sử User `HR` sở hữu bảng `EMPLOYEES` (có 107 dòng) và tạo thủ tục `sp_count_emp` như sau, rồi cấp quyền `GRANT EXECUTE ON hr.sp_count_emp TO scott;`. Bản thân User `SCOTT` cũng có một bảng `EMPLOYEES` riêng trong Schema `SCOTT` (chỉ có 14 dòng) và `SCOTT` KHÔNG có quyền `SELECT` trực tiếp trên bảng `HR.EMPLOYEES`. Khi `SCOTT` chạy lệnh `EXEC hr.sp_count_emp;`, kết quả sẽ là gì?**

```sql
-- Được tạo bởi User HR:
CREATE OR REPLACE PROCEDURE sp_count_emp IS
    v_cnt NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_cnt FROM employees;
    DBMS_OUTPUT.PUT_LINE('Count = ' || v_cnt);
END sp_count_emp;
```

* A. In ra `Count = 14` (số dòng của bảng `SCOTT.EMPLOYEES`).
* B. In ra `Count = 107` (số dòng của bảng `HR.EMPLOYEES`).
* C. Báo lỗi `ORA-00942: table or view does not exist` vì `SCOTT` không có quyền `SELECT` trên bảng `HR.EMPLOYEES`.
* D. Báo lỗi `ORA-01031: insufficient privileges`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi tạo một Stored Procedure mà không khai báo mệnh đề `AUTHID`, chế độ mặc định luôn là **`AUTHID DEFINER` (Definer's Rights — Quyền của người định nghĩa)**.
    * Dưới chế độ `AUTHID DEFINER`, thủ tục chạy bằng **quyền của người sở hữu (`HR`)** và mọi tên bảng không có tiền tố Schema (`FROM employees`) đều được phân giải về **Schema của người sở hữu (`HR.EMPLOYEES`)**.
    * User `SCOTT` chỉ cần quyền `EXECUTE` trên `hr.sp_count_emp` là chạy được và nhận kết quả `Count = 107` của bảng `HR.EMPLOYEES` mà không cần có quyền `SELECT` trực tiếp trên bảng đó!
  * **A, C, D sai:** Chỉ khi khai báo `AUTHID CURRENT_USER`, thủ tục mới trỏ vào bảng `SCOTT.EMPLOYEES` và trả về `14`.
</details>

---

### Câu 21 (Question 21)
**Cũng với tình huống ở Câu 20, nếu User `HR` sửa lại thủ tục thành `AUTHID CURRENT_USER` như dưới đây, thì khi User `SCOTT` gọi `EXEC hr.sp_count_emp;`, kết quả sẽ là gì?**

```sql
-- Được tạo bởi User HR:
CREATE OR REPLACE PROCEDURE sp_count_emp
AUTHID CURRENT_USER IS
    v_cnt NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_cnt FROM employees;
    DBMS_OUTPUT.PUT_LINE('Count = ' || v_cnt);
END sp_count_emp;
```

* A. In ra `Count = 107` (số dòng của bảng `HR.EMPLOYEES`).
* B. In ra `Count = 14` (số dòng của bảng `SCOTT.EMPLOYEES`).
* C. Báo lỗi `ORA-00942` vì `SCOTT` không có quyền trên `HR.EMPLOYEES`.
* D. Báo lỗi biên dịch vì `AUTHID CURRENT_USER` chỉ được dùng cho `PACKAGE`, không dùng được cho `PROCEDURE` độc lập.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi thủ tục được khai báo với **`AUTHID CURRENT_USER` (Invoker's Rights — Quyền của người gọi)**:
    * Thủ tục thực thi dưới **quyền hạn và ngữ cảnh Schema của người đang gọi tại thời điểm Runtime (`CURRENT_USER` = `SCOTT`)**.
    * Tên bảng `employees` không có Schema đi kèm sẽ được phân giải thành **`SCOTT.EMPLOYEES`**. Vì `SCOTT` sở hữu bảng `SCOTT.EMPLOYEES` có 14 dòng, kết quả in ra là `Count = 14`!
  * **A, C, D sai:** `AUTHID CURRENT_USER` dùng được cho cả `PROCEDURE`, `FUNCTION`, `PACKAGE`, và `TYPE`.
</details>

---

### Câu 22 (Question 22)
**User `APP_DEV` được quản trị viên DBA cấp quyền `SELECT` trên bảng `HR.EMPLOYEES` thông qua một Role tên là `EMP_READ_ROLE`. Khi `APP_DEV` chạy câu lệnh `SELECT COUNT(*) FROM hr.employees;` trong SQL\*Plus thì thành công. Nhưng khi `APP_DEV` tạo thủ tục dưới đây thì lại bị báo lỗi `PL/SQL: ORA-00942: table or view does not exist`. Nguyên nhân và cách khắc phục đúng là gì? (Chọn 2 đáp án đúng)**

```sql
-- Được chạy bởi User APP_DEV:
CREATE OR REPLACE PROCEDURE sp_read_hr_emp IS
    v_cnt NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_cnt FROM hr.employees;
END;
```

* A. Nguyên nhân là vì trong một Stored Subprogram dùng chế độ mặc định (`AUTHID DEFINER`), tất cả các quyền được cấp thông qua `ROLE` đều bị vô hiệu hóa (`ROLES` bị tắt) tại thời điểm biên dịch và thực thi.
* B. Cách khắc phục 1: Yêu cầu `HR` (hoặc DBA) cấp quyền `SELECT` trực tiếp cho User `APP_DEV` (`GRANT SELECT ON hr.employees TO app_dev;`) mà không thông qua Role.
* C. Cách khắc phục 2: Thêm lệnh `COMMIT;` vào cuối thủ tục `sp_read_hr_emp`.
* D. Nguyên nhân là vì không được phép viết tiền tố tên Schema (`hr.`) bên trong một Stored Procedure.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B**
* **Giải thích chuyên sâu:**
  * **A đúng:** Đây là quy tắc bảo mật cốt lõi của Oracle: Khi biên dịch và chạy các đơn vị chương trình lưu trữ theo quyền người định nghĩa (`AUTHID DEFINER`), toàn bộ các `ROLE` đều bị vô hiệu hóa. Oracle chỉ kiểm tra các quyền được cấp **trực tiếp (`DIRECT GRANT`)** cho User đó.
  * **B đúng:** Để biên dịch thành công thủ tục `AUTHID DEFINER`, User `APP_DEV` phải được cấp quyền trực tiếp `GRANT SELECT ON hr.employees TO app_dev;` (hoặc một cách khác là đổi thủ tục sang `AUTHID CURRENT_USER`, vì Invoker's Rights cho phép sử dụng quyền từ `ROLE`).
  * **C, D sai:** Tiền tố `hr.` hoàn toàn hợp lệ và `COMMIT` không liên quan đến quyền truy cập đối tượng.
</details>

---

### Câu 23 (Question 23)
**Trong mệnh đề `AUTHID`, vị trí đặt cú pháp nào dưới đây là ĐÚNG khi tạo một Stored Function?**

* A. `CREATE OR REPLACE FUNCTION fn_test (p_id NUMBER) AUTHID CURRENT_USER RETURN NUMBER IS ...`
* B. `CREATE OR REPLACE FUNCTION fn_test (p_id NUMBER) RETURN NUMBER AUTHID CURRENT_USER IS ...`
* C. `CREATE OR REPLACE FUNCTION fn_test (p_id NUMBER) RETURN NUMBER IS AUTHID CURRENT_USER BEGIN ...`
* D. `CREATE OR REPLACE AUTHID CURRENT_USER FUNCTION fn_test (p_id NUMBER) RETURN NUMBER IS ...`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đối với một `FUNCTION`, mệnh đề `AUTHID {DEFINER | CURRENT_USER}` (cũng như `DETERMINISTIC`, `RESULT_CACHE`, `PARALLEL_ENABLE`) phải được đặt **SAU mệnh đề `RETURN datatype`** và **TRƯỚC từ khóa `IS` / `AS`**.
  * **A sai:** Đặt `AUTHID` trước `RETURN` sẽ gây lỗi cú pháp `PLS-00103`.
  * **C sai:** Không được đặt `AUTHID` sau từ khóa `IS` (sau `IS` chỉ đặt được các `PRAGMA` và khai báo biến).
  * **D sai:** Không được đặt `AUTHID` trước từ khóa `FUNCTION`.
</details>

---

### Câu 24 (Question 24)
**Xem xét đoạn mã sử dụng một biến cùng lúc truyền vào nhiều tham số của một thủ tục (Parameter Aliasing). Kết quả in ra màn hình có gì đặc biệt?**

```sql
DECLARE
    v_n NUMBER := 10;

    PROCEDURE sp_alias (
        p_in  IN     NUMBER,
        p_out IN OUT NUMBER
    ) IS
    BEGIN
        p_out := p_in + 5;
        DBMS_OUTPUT.PUT_LINE('p_in = ' || p_in || ', p_out = ' || p_out);
    END;
BEGIN
    sp_alias(v_n, v_n);
    DBMS_OUTPUT.PUT_LINE('Final v_n = ' || v_n);
END;
```

* A. Báo lỗi biên dịch vì không được truyền cùng một biến `v_n` vào hai tham số khác nhau trong cùng một lời gọi thủ tục.
* B. In ra `p_in = 10, p_out = 15` và `Final v_n = 15`.
* C. In ra `p_in = 15, p_out = 15` và `Final v_n = 10`.
* D. Ném ra ngoại lệ Runtime `VALUE_ERROR`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * Ở đây `p_in` được truyền theo cơ chế Pass by Reference (trỏ tới `v_n`, đang bằng `10`), còn `p_out` (`IN OUT` không có `NOCOPY`) được truyền theo cơ chế **Pass by Value** (tạo biến đệm tạm thời chứa bản sao `10`).
    * Khi thực hiện `p_out := p_in + 5;`, chỉ có biến đệm tạm thời của `p_out` tăng lên `15`, biến gốc `v_n` chưa bị thay đổi trong lúc thủ tục đang chạy nên `p_in` vẫn đọc được giá trị `10`!
    * Kết quả trong thủ tục in ra: `p_in = 10, p_out = 15`. Khi thủ tục kết thúc, `15` được copy ra `v_n`, in ra `Final v_n = 15`.
    * *(Lưu ý nâng cao: Nếu `p_out` có thêm `NOCOPY`, cả `p_in` và `p_out` sẽ cùng trỏ trực tiếp vào `v_n`, nên ngay khi `p_out := 15`, giá trị của `p_in` cũng lập tức biến thành `15` — đó gọi là hiện tượng Parameter Aliasing với `NOCOPY`!)*
  * **A, C, D sai:** PL/SQL hoàn toàn cho phép truyền cùng một biến vào nhiều đối số của một lời gọi hàm.
</details>

---

### Câu 25 (Question 25)
**Tính năng nào từ Oracle Database 12c trở đi cho phép bạn khai báo và sử dụng một hàm PL/SQL cục bộ ngay bên trong một câu lệnh `SELECT` mà KHÔNG cần phải tạo Stored Function bằng lệnh `CREATE FUNCTION` trong Schema?**

* A. Sử dụng mệnh đề `WITH FUNCTION ... SELECT ...` (Common Table Expression mở rộng cho PL/SQL Subprogram).
* B. Sử dụng mệnh đề `DECLARE FUNCTION ... SELECT ...`.
* C. Sử dụng hàm `DBMS_SQL.DEFINE_FUNCTION`.
* D. Sử dụng gợi ý `/*+ INLINE_PLSQL */` trong câu lệnh `SELECT`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Từ Oracle 12c, mệnh đề Subquery Factoring (`WITH`) được mở rộng cho phép khai báo trực tiếp các hàm và thủ tục PL/SQL tạm thời (`WITH FUNCTION fn_name ... IS BEGIN ... END; SELECT fn_name(col) FROM table;`). Tính năng này cực kỳ hữu ích khi làm việc trên các môi trường Database chỉ có quyền đọc (Read-only / Standby DB) hoặc khi không có quyền `CREATE PROCEDURE`, đồng thời giảm chi phí Context Switch tương tự như `PRAGMA UDF`.
  * **B, C, D sai:** Cú pháp chuẩn trong SQL là `WITH FUNCTION` (và kết thúc câu lệnh SQL bằng dấu `/` trong SQL*Plus / SQL Developer).
</details>

---
