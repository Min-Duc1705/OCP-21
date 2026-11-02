# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 24: Exception Handling (Xử Lý Ngoại Lệ)

> **Tài liệu tham chiếu:** *OCP Oracle Database Program with PL/SQL Study Guide (Exam 1Z0-149)*  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle OCP 1Z0-149 & VNPT kèm phân tích & đáp án chi tiết.  
> **Cách học:** Bạn hãy tự đọc đề và chọn đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và nắm vững bẫy thi.

---

### Câu 1 (Question 1)
**Cú pháp khối `EXCEPTION` nào dưới đây là HỢP LỆ trong PL/SQL?**

* A. `WHEN NO_DATA_FOUND, TOO_MANY_ROWS THEN DBMS_OUTPUT.PUT_LINE('Error');`
* B. `WHEN OTHERS OR ZERO_DIVIDE THEN DBMS_OUTPUT.PUT_LINE('Error');`
* C. `WHEN NO_DATA_FOUND OR TOO_MANY_ROWS THEN DBMS_OUTPUT.PUT_LINE('Error');`
* D. `WHEN SQLCODE = -1403 THEN DBMS_OUTPUT.PUT_LINE('Error');`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Để gộp nhiều ngoại lệ vào chung một nhánh xử lý `WHEN`, PL/SQL bắt buộc sử dụng từ khóa **`OR`** (`WHEN ex1 OR ex2 THEN`).
  * **A sai:** Dùng dấu phẩy `,` giữa các tên ngoại lệ sẽ gây lỗi biên dịch `PLS-00103`.
  * **B sai:** Mệnh đề `WHEN OTHERS` bắt buộc phải đứng độc lập một mình ở nhánh cuối cùng, không được phép kết hợp với ngoại lệ khác bằng từ khóa `OR` (`PLS-00370: OTHERS handler must be last among the exception handlers`).
  * **D sai:** Sau `WHEN` trong khối `EXCEPTION` phải là tên định danh của ngoại lệ (Exception identifier) hoặc `OTHERS`, không được viết biểu thức so sánh điều kiện như `SQLCODE = -1403`.
</details>

---

### Câu 2 (Question 2)
**Hãy xác định sự khác biệt về ngoại lệ được ném ra giữa Khối lệnh 1 và Khối lệnh 2 dưới đây:**

```sql
-- Khối lệnh 1:
DECLARE
    v_num NUMBER;
BEGIN
    v_num := TO_NUMBER('123A');
END;
/

-- Khối lệnh 2:
DECLARE
    v_num NUMBER;
BEGIN
    SELECT TO_NUMBER('123A') INTO v_num FROM dual;
END;
```

* A. Cả hai khối lệnh đều ném ra ngoại lệ `INVALID_NUMBER` (`ORA-01722`).
* B. Cả hai khối lệnh đều ném ra ngoại lệ `VALUE_ERROR` (`ORA-06502`).
* C. Khối lệnh 1 ném ra `VALUE_ERROR` (`ORA-06502`), còn Khối lệnh 2 ném ra `INVALID_NUMBER` (`ORA-01722`).
* D. Khối lệnh 1 ném ra `INVALID_NUMBER` (`ORA-01722`), còn Khối lệnh 2 ném ra `VALUE_ERROR` (`ORA-06502`).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là bẫy phân biệt kinh điển trong đề thi OCP 1Z0-149:
    * ở **Khối lệnh 1**, hàm `TO_NUMBER('123A')` được thực thi hoàn toàn bên trong một **câu lệnh gán của PL/SQL Engine**. Khi PL/SQL Engine gặp lỗi ép kiểu hoặc tràn kích thước biến, nó luôn ném ra ngoại lệ **`VALUE_ERROR` (`ORA-06502`)**.
    * Ở **Khối lệnh 2**, hàm `TO_NUMBER('123A')` nằm bên trong câu truy vấn `SELECT ... FROM dual`, do **SQL Engine** thực thi. Khi SQL Engine không thể chuyển chuỗi thành số, nó ném ra lỗi `ORA-01722`, tương ứng với Predefined Exception là **`INVALID_NUMBER`**!
  * **A, B, D sai:** Nếu ở Khối 2 bạn chỉ viết `WHEN VALUE_ERROR THEN`, bạn sẽ không bắt được lỗi `ORA-01722` từ câu lệnh `SELECT`!
</details>

---

### Câu 3 (Question 3)
**Những thao tác nào dưới đây sẽ kích hoạt ngoại lệ định nghĩa sẵn `NO_DATA_FOUND` (`ORA-01403`) trong PL/SQL? (Chọn 2 đáp án đúng)**

* A. Thực thi câu lệnh `UPDATE employees SET salary = 5000 WHERE employee_id = -999;` (không có dòng nào thỏa điều kiện `WHERE`).
* B. Thực thi câu lệnh `SELECT first_name INTO v_name FROM employees WHERE employee_id = -999;` (không có dòng nào thỏa điều kiện `WHERE`).
* C. Thực thi câu lệnh `FETCH c_emp INTO v_rec;` khi con trỏ tường minh `c_emp` đã đọc hết toàn bộ các dòng dữ liệu.
* D. Đọc giá trị của một phần tử tại vị trí chỉ mục (key/index) chưa từng được gán trong một mảng kết hợp `Associative Array (INDEX BY)`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, D**
* **Giải thích chuyên sâu:**
  * **B đúng:** Câu lệnh `SELECT ... INTO` bắt buộc phải trả về đúng 1 dòng. Nếu trả về 0 dòng, nó lập tức ném `NO_DATA_FOUND`.
  * **D đúng:** Khi truy xuất phần tử chưa tồn tại trong mảng `Associative Array` (ví dụ `v_x := v_assoc_arr(99);` khi chỉ số `99` chưa được khởi tạo), PL/SQL sẽ ném ngoại lệ `NO_DATA_FOUND` (`ORA-01403`). (Lưu ý: với Nested Table hoặc VARRAY thì lại ném `SUBSCRIPT_BEYOND_COUNT` hoặc `COLLECTION_IS_NULL`).
  * **A sai:** Các câu lệnh DML (`UPDATE`, `DELETE`) tác động lên 0 dòng hoàn toàn hợp lệ, **không bao giờ** ném `NO_DATA_FOUND` mà chỉ bật cờ `SQL%NOTFOUND := TRUE` và `SQL%ROWCOUNT := 0`.
  * **C sai:** Lệnh `FETCH` của Explicit Cursor khi không còn dòng nào sẽ **không** ném ngoại lệ, mà chỉ bật cờ `c_emp%NOTFOUND := TRUE`.
</details>

---

### Câu 4 (Question 4)
**Giá trị trả về của hàm `SQLCODE` là bao nhiêu khi chương trình đang xử lý ngoại lệ `NO_DATA_FOUND` (`ORA-01403`) và khi xử lý một `User-Defined Exception` (không dùng `PRAGMA EXCEPTION_INIT`)?**

* A. `-1403` cho `NO_DATA_FOUND` và `-1` cho `User-Defined Exception`.
* B. `+100` cho `NO_DATA_FOUND` và `+1` cho `User-Defined Exception`.
* C. `-100` cho `NO_DATA_FOUND` và `0` cho `User-Defined Exception`.
* D. `+1403` cho `NO_DATA_FOUND` và `-20000` cho `User-Defined Exception`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Hầu hết mọi lỗi `ORA-xxxxx` trong Oracle đều có `SQLCODE` là số nguyên âm tương ứng, ngoại trừ **2 trường hợp trả về số nguyên dương**:
    1. Ngoại lệ **`NO_DATA_FOUND`** (`ORA-01403`): Theo chuẩn ANSI SQL, hàm `SQLCODE` trả về số dương **`+100`** (chứ không phải `-1403`!).
    2. Ngoại lệ do người dùng tự định nghĩa (**`User-Defined Exception`** không gắn `PRAGMA EXCEPTION_INIT`): Hàm `SQLCODE` luôn trả về số dương **`+1`** (và `SQLERRM` trả về `'User-Defined Exception'`).
  * **A, C, D sai:** Mã `-1` là của ngoại lệ `DUP_VAL_ON_INDEX` (`ORA-00001`), còn `0` là giá trị của `SQLCODE` khi không có ngoại lệ nào xảy ra.
</details>

---

### Câu 5 (Question 5)
**Khi một câu lệnh `CASE` (CASE Statement — không phải CASE Expression) trong PL/SQL được thực thi mà không có nhánh `WHEN` nào khớp với điều kiện và câu lệnh `CASE` đó cũng không có mệnh đề `ELSE`, ngoại lệ nào sẽ được ném ra?**

* A. `NO_DATA_FOUND` (`ORA-01403`)
* B. `VALUE_ERROR` (`ORA-06502`)
* C. `CASE_NOT_FOUND` (`ORA-06592`)
* D. Không ném ngoại lệ nào cả, chương trình tự động bỏ qua câu lệnh `CASE` và chạy dòng tiếp theo.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong PL/SQL, cần phân biệt rõ:
    * **Biểu thức `CASE` (`v_res := CASE WHEN ... END;`):** Nếu không có nhánh `WHEN` nào đúng và không có `ELSE`, biểu thức trả về giá trị **`NULL`** mà không báo lỗi.
    * **Câu lệnh `CASE` (`CASE WHEN ... THEN ... END CASE;`):** Nếu không có nhánh `WHEN` nào đúng và không có nhánh `ELSE`, PL/SQL Engine sẽ lập tức ném ra ngoại lệ chuẩn **`CASE_NOT_FOUND` (`ORA-06592: CASE not found while executing CASE statement`)**!
  * **A, B, D sai:** Đây là điểm khác biệt rất đặc trưng giữa `IF ... END IF` (không có `ELSE` vẫn chạy qua bình thường) và `CASE ... END CASE` (không có `ELSE` mà không khớp nhánh nào sẽ văng lỗi `CASE_NOT_FOUND`).
</details>

---

### Câu 6 (Question 6)
**Mã lỗi Oracle `ORA-01400: cannot insert NULL into (...)` xảy ra khi câu lệnh `INSERT` cố tình chèn giá trị `NULL` vào một cột có ràng buộc `NOT NULL`. Làm thế nào để bắt đích danh lỗi này trong PL/SQL mà KHÔNG sử dụng `WHEN OTHERS`?**

* A. Viết trực tiếp `WHEN CANNOT_INSERT_NULL THEN` vì đây là một Predefined Exception có sẵn.
* B. Viết `WHEN ORA_01400 THEN` trong khối `EXCEPTION`.
* C. Khai báo một ngoại lệ `e_null_err EXCEPTION;` kèm chỉ thị `PRAGMA EXCEPTION_INIT(e_null_err, -1400);` trong phần `DECLARE`, sau đó bắt bằng `WHEN e_null_err THEN`.
* D. Khai báo `e_null_err EXCEPTION;` trong `DECLARE`, dùng lệnh `RAISE e_null_err;` sau câu lệnh `INSERT`, rồi bắt bằng `WHEN e_null_err THEN`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Lỗi `ORA-01400` (cũng như `ORA-02291`, `ORA-02292`) là các lỗi **Non-Predefined Oracle Exception** (có mã lỗi `ORA-` nhưng chưa được đặt tên định danh trong gói `STANDARD`). Để bắt đích danh chúng, bạn phải khai báo một biến `EXCEPTION` và dùng chỉ thị trình biên dịch **`PRAGMA EXCEPTION_INIT(tên_exception, -1400);`** để liên kết tên đó với mã `-1400`. Khi lệnh `INSERT` gặp lỗi `ORA-01400`, Oracle sẽ tự động kích hoạt `e_null_err`.
  * **A, B sai:** Không tồn tại Predefined Exception tên là `CANNOT_INSERT_NULL` hay `ORA_01400`.
  * **D sai:** Khi câu lệnh `INSERT` bị lỗi `ORA-01400`, luồng thực thi nhảy thẳng xuống khối `EXCEPTION` ngay tại dòng `INSERT`, nên dòng lệnh `RAISE e_null_err;` đặt phía dưới `INSERT` sẽ không bao giờ được chạy tới!
</details>

---

### Câu 7 (Question 7)
**Quan sát đoạn mã xử lý lỗi trong khối `EXCEPTION` dưới đây. Tại sao đoạn mã này lại gặp LỖI BIÊN DỊCH?**

```sql
DECLARE
    v_sal NUMBER;
BEGIN
    SELECT salary INTO v_sal FROM employees WHERE employee_id = -1;
EXCEPTION
    WHEN OTHERS THEN
        INSERT INTO err_audit_table (err_date, err_code, err_msg)
        VALUES (SYSDATE, SQLCODE, SQLERRM);
        COMMIT;
END;
```

* A. Vì không được phép thực hiện câu lệnh `INSERT` hay `COMMIT` bên trong khối `EXCEPTION`.
* B. Vì hai hàm `SQLCODE` và `SQLERRM` là hàm riêng của PL/SQL Engine, không được phép gọi trực tiếp bên trong một câu lệnh SQL (`INSERT INTO ... VALUES (..., SQLCODE, SQLERRM)`).
* C. Vì `WHEN OTHERS` không thể bắt được lỗi `NO_DATA_FOUND`.
* D. Vì hàm `SQLERRM` bắt buộc phải có tham số truyền vào là `SQLERRM(SQLCODE)`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là một trong những bẫy thực hành và thi cử phổ biến nhất! `SQLCODE` và `SQLERRM` là các hàm thủ tục nội bộ của PL/SQL, **không tồn tại trong SQL Engine**. Khi bạn đặt trực tiếp `SQLCODE` và `SQLERRM` vào mệnh đề `VALUES (...)` của câu lệnh `INSERT`, SQL Engine sẽ báo lỗi biên dịch **`ORA-00904: "SQLERRM": invalid identifier`** / **`PLS-00231: function 'SQLCODE' may not be used in SQL`**.
  * **Cách sửa đúng:** Phải gán `v_code := SQLCODE;` và `v_msg := SQLERRM;` vào hai biến PL/SQL trước, rồi viết `VALUES (SYSDATE, v_code, v_msg);`.
  * **A, C, D sai:** Trong khối `EXCEPTION` hoàn toàn được phép chạy `INSERT`, `COMMIT`, và gọi `SQLERRM` không tham số trong câu lệnh PL/SQL.
</details>

---

### Câu 8 (Question 8)
**Hãy xác định kết quả in ra màn hình khi thực thi khối lệnh PL/SQL có các khối lồng nhau dưới đây:**

```sql
BEGIN
    DBMS_OUTPUT.PUT_LINE('Start Outer');
    DECLARE
        v_code VARCHAR2(3) := 'ORACLE';
    BEGIN
        DBMS_OUTPUT.PUT_LINE('Inside Inner: ' || v_code);
    EXCEPTION
        WHEN VALUE_ERROR THEN
            DBMS_OUTPUT.PUT_LINE('Caught VALUE_ERROR in Inner');
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Caught OTHERS in Inner');
    END;
    DBMS_OUTPUT.PUT_LINE('End Outer');
EXCEPTION
    WHEN VALUE_ERROR THEN
        DBMS_OUTPUT.PUT_LINE('Caught VALUE_ERROR in Outer');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Caught OTHERS in Outer');
END;
```

* A. `Start Outer` -> `Caught VALUE_ERROR in Inner` -> `End Outer`
* B. `Start Outer` -> `Caught OTHERS in Inner` -> `End Outer`
* C. `Start Outer` -> `Caught VALUE_ERROR in Outer`
* D. `Start Outer` -> `Caught VALUE_ERROR in Inner` -> `Caught VALUE_ERROR in Outer`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là bẫy **Exception Propagation trong phần `DECLARE`** kinh điển của kỳ thi OCP!
    1. Chương trình in ra `Start Outer`.
    2. Khi bắt đầu khởi tạo khối con bên trong (Inner Block), phép gán `v_code VARCHAR2(3) := 'ORACLE';` (chuỗi 6 ký tự gán vào biến dài tối đa 3 ký tự) lập tức gây ra ngoại lệ **`VALUE_ERROR` (`ORA-06502`) ngay tại phần `DECLARE` của khối con**.
    3. **Quy tắc cốt lõi:** Khối `EXCEPTION` của một khối lệnh **CHỈ bắt được ngoại lệ xảy ra trong phần `BEGIN` của chính nó**, hoàn toàn **KHÔNG bắt được ngoại lệ xảy ra trong phần `DECLARE` của chính nó**!
    4. Do đó, toàn bộ phần `BEGIN` và phần `EXCEPTION` của khối con bị bỏ qua, ngoại lệ `VALUE_ERROR` văng thẳng ra khối bao ngoài (bỏ qua luôn dòng `End Outer`) và bị bắt bởi nhánh `WHEN VALUE_ERROR` của khối ngoài, in ra `Caught VALUE_ERROR in Outer`.
  * **A, B, D sai:** Thí sinh rất dễ chọn nhầm A nếu không để ý lỗi xảy ra ở dòng khai báo `DECLARE` chứ không phải trong `BEGIN`.
</details>

---

### Câu 9 (Question 9)
**Quan sát đoạn mã dưới đây khi một ngoại lệ mới phát sinh ngay bên trong phần `EXCEPTION` của khối con. Kết quả in ra màn hình sẽ là gì?**

```sql
BEGIN
    BEGIN
        RAISE ZERO_DIVIDE;
    EXCEPTION
        WHEN ZERO_DIVIDE THEN
            DBMS_OUTPUT.PUT_LINE('1. Bắt ZERO_DIVIDE ở khối trong');
            RAISE NO_DATA_FOUND;
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('2. Bắt NO_DATA_FOUND ở khối trong');
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('3. Bắt OTHERS ở khối trong');
    END;
    DBMS_OUTPUT.PUT_LINE('4. Tiếp tục khối ngoài');
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('5. Bắt NO_DATA_FOUND ở khối ngoài');
END;
```

* A. In ra dòng `1`, dòng `2`, và dòng `4`.
* B. In ra dòng `1`, dòng `3`, và dòng `4`.
* C. In ra dòng `1` và dòng `5`.
* D. Báo lỗi biên dịch vì không được dùng lệnh `RAISE` bên trong khối `EXCEPTION`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:**
    1. Trong `BEGIN` của khối con, lệnh `RAISE ZERO_DIVIDE;` kích hoạt nhánh `WHEN ZERO_DIVIDE THEN`, in ra: **`1. Bắt ZERO_DIVIDE ở khối trong`**.
    2. Ngay sau đó, câu lệnh `RAISE NO_DATA_FOUND;` được gọi **bên trong chính phần `EXCEPTION` của khối con**.
    3. **Quy tắc cốt lõi:** Khi một ngoại lệ phát sinh ở bên trong phần `EXCEPTION`, PL/SQL **KHÔNG BAO GIỜ tìm kiếm các nhánh `WHEN` khác trong cùng khối `EXCEPTION` đó** (nên cả nhánh `WHEN NO_DATA_FOUND` số 2 lẫn `WHEN OTHERS` số 3 cùng cấp đều bị bỏ qua!). Ngoại lệ lập tức lan truyền thẳng ra phần `EXCEPTION` của **khối bao ngoài**, bỏ qua dòng số 4 và nhảy vào nhánh số 5, in ra: **`5. Bắt NO_DATA_FOUND ở khối ngoài`**.
  * **A, B, D sai:** Muốn bắt một ngoại lệ phát sinh bên trong nhánh `WHEN`, bạn phải mở một khối con `BEGIN ... EXCEPTION ... END;` lồng ngay bên trong nhánh `WHEN` đó.
</details>

---

### Câu 10 (Question 10)
**Về câu lệnh `RAISE;` (đứng một mình, không kèm theo tên ngoại lệ), những phát biểu nào sau đây là ĐÚNG? (Chọn 2 đáp án đúng)**

* A. Có thể đặt câu lệnh `RAISE;` ở bất kỳ đâu trong phần `BEGIN` hoặc phần `EXCEPTION` của khối PL/SQL.
* B. Câu lệnh `RAISE;` chỉ được phép xuất hiện bên trong phần xử lý ngoại lệ (`EXCEPTION`); nếu đặt trong phần `BEGIN` sẽ gây lỗi biên dịch `PLS-00367`.
* C. Câu lệnh `RAISE;` có tác dụng ném lại (Re-raise) chính xác ngoại lệ hiện đang được xử lý ra cho khối bao ngoài (hoặc môi trường gọi) mà không cần chỉ định lại tên ngoại lệ.
* D. Câu lệnh `RAISE;` sẽ xóa sạch ngăn xếp lỗi hiện tại và đặt `SQLCODE` về `0`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, C**
* **Giải thích chuyên sâu:**
  * **B đúng:** Nếu viết `RAISE;` không tên ở ngoài khối `EXCEPTION` (tức ở trong phần `BEGIN`), trình biên dịch không biết phải ném lại ngoại lệ nào nên sẽ báo lỗi **`PLS-00367: a RAISE statement with no exception name must be inside an exception handler`**.
  * **C đúng:** Đặt `RAISE;` trong nhánh `WHEN ... THEN` (đặc biệt là trong `WHEN OTHERS THEN` sau khi đã ghi log lỗi) là kỹ thuật chuẩn để bảo toàn nguyên vẹn mã lỗi và vị trí lỗi gốc rồi chuyển tiếp ngoại lệ đó ra tầng ngoài.
  * **A, D sai:** `RAISE;` giữ nguyên toàn bộ thông tin `SQLCODE` và `SQLERRM` của ngoại lệ hiện tại.
</details>

---

### Câu 11 (Question 11)
**Khi sử dụng thủ tục dựng sẵn `RAISE_APPLICATION_ERROR(error_number, message [, keep_errors])`, dải giá trị hợp lệ của tham số `error_number` là gì, và điều gì xảy ra nếu bạn truyền số `-19999` vào tham số này?**

* A. Dải hợp lệ là từ `-20000` đến `-20999`. Nếu truyền `-19999`, chương trình sẽ ném lỗi Runtime `ORA-21000: error number argument to raise_application_error of -19999 is out of range`.
* B. Dải hợp lệ là từ `-1` đến `-20999`. Truyền `-19999` hoàn toàn hợp lệ.
* C. Dải hợp lệ là từ `20000` đến `20999` (số dương). Truyền số âm sẽ báo lỗi biên dịch.
* D. Dải hợp lệ là từ `-20000` đến `-29999`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Oracle dành riêng đúng 1.000 mã lỗi âm từ **`-20000` đến `-20999`** cho lập trình viên định nghĩa lỗi ứng dụng thông qua `RAISE_APPLICATION_ERROR`. Nếu truyền bất kỳ số nào nằm ngoài khoảng này (như `-19999`, `-21000`, hay số dương `20001`), tại thời điểm Runtime Oracle sẽ ném ra ngoại lệ **`ORA-21000: error number argument to raise_application_error of ... is out of range`**.
  * **B, C, D sai:** Hãy nhớ kỹ con số `-20000 .. -20999` (không phải `-29999` và không phải số dương).
</details>

---

### Câu 12 (Question 12)
**Tham số thứ ba `keep_errors` (kiểu `BOOLEAN`, mặc định là `FALSE`) trong thủ tục `RAISE_APPLICATION_ERROR(error_number, message, keep_errors)` có ý nghĩa gì khi được truyền giá trị `TRUE` bên trong một khối `EXCEPTION`?**

* A. Tự động lưu thông báo lỗi vào bảng hệ thống `USER_ERRORS`.
* B. Giữ lại toàn bộ các thay đổi DML đã thực hiện trước đó mà không bị Rollback khi lỗi văng ra Client.
* C. Nối thêm lỗi mới (`-20xxx`) lên đầu ngăn xếp lỗi hiện có (Error Stack) thay vì ghi đè, giúp người dùng nhìn thấy cả thông báo lỗi mới lẫn nguyên nhân lỗi gốc ban đầu.
* D. Cho phép chương trình tiếp tục chạy các dòng lệnh phía sau `RAISE_APPLICATION_ERROR` mà không bị dừng lại.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khi gọi `RAISE_APPLICATION_ERROR(-20001, 'Lỗi xử lý đơn hàng', TRUE)` ở trong nhánh `EXCEPTION` (ví dụ khi đang bắt lỗi gốc `ORA-00001: unique constraint violated`):
    * Nếu `keep_errors = FALSE` (mặc định): Lỗi gốc `ORA-00001` bị xóa mất, Client chỉ thấy `ORA-20001: Lỗi xử lý đơn hàng`.
    * Nếu `keep_errors = TRUE`: Client sẽ nhận được toàn bộ chuỗi ngăn xếp gồm cả `ORA-20001: Lỗi xử lý đơn hàng` kèm theo dòng lỗi gốc `ORA-00001: unique constraint violated` ở bên dưới!
  * **A, B, D sai:** `RAISE_APPLICATION_ERROR` luôn luôn ném ngoại lệ và dừng luồng chạy hiện tại ngay lập tức.
</details>

---

### Câu 13 (Question 13)
**Cho hàm PL/SQL `fn_find_dept` như dưới đây. Giả sử bảng `DEPARTMENTS` không có phòng ban nào có `department_id = 999`. Khi thực thi câu lệnh SQL `SELECT fn_find_dept(999) FROM dual;`, kết quả sẽ là gì?**

```sql
CREATE OR REPLACE FUNCTION fn_find_dept (p_id NUMBER)
RETURN VARCHAR2 IS
    v_name departments.department_name%TYPE;
BEGIN
    SELECT department_name INTO v_name
    FROM departments
    WHERE department_id = p_id;
    RETURN v_name;
END fn_find_dept;
```

* A. Câu lệnh `SELECT` báo lỗi `ORA-01403: no data found`.
* B. Câu lệnh `SELECT` chạy thành công và trả về 1 dòng có giá trị là `NULL` (vì khi ngoại lệ `NO_DATA_FOUND` văng từ hàm PL/SQL ra môi trường SQL Engine, SQL Engine coi đó là kết thúc dữ liệu và biến kết quả hàm thành `NULL`).
* C. Câu lệnh `SELECT` báo lỗi `ORA-06503: PL/SQL: Function returned without value`.
* D. Câu lệnh `SELECT` trả về 0 dòng dữ liệu.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là một đặc tính cực kỳ thú vị (và là bẫy thi nổi tiếng) giữa SQL Engine và PL/SQL Engine:
    * Nếu bạn gọi `v_x := fn_find_dept(999);` trong một khối **PL/SQL**, chương trình sẽ bị dừng và báo lỗi **`ORA-01403: no data found`**.
    * Nhưng nếu bạn gọi `SELECT fn_find_dept(999) FROM dual;` trong một câu lệnh **SQL**, khi ngoại lệ `NO_DATA_FOUND` thoát khỏi hàm PL/SQL về tới tầng SQL Engine, SQL Engine hiểu tín hiệu `ORA-01403` là *"Không còn dữ liệu để nạp"*, nên nó **không báo lỗi** mà trả về giá trị **`NULL`** cho cột đó!
  * **A, C, D sai:** Các ngoại lệ khác như `TOO_MANY_ROWS` hay `ZERO_DIVIDE` thì vẫn báo lỗi trong câu lệnh `SELECT` bình thường; chỉ riêng `NO_DATA_FOUND` bị SQL Engine nuốt lỗi và trả về `NULL`.
</details>

---

### Câu 14 (Question 14)
**Cho bảng `LOGS(step_no NUMBER)` đang rỗng (0 dòng). Sau khi thực thi khối lệnh PL/SQL dưới đây, bảng `LOGS` sẽ chứa những dòng dữ liệu nào?**

```sql
BEGIN
    INSERT INTO logs VALUES (1);
    BEGIN
        INSERT INTO logs VALUES (2);
        RAISE ZERO_DIVIDE;
        INSERT INTO logs VALUES (3);
    EXCEPTION
        WHEN ZERO_DIVIDE THEN
            INSERT INTO logs VALUES (4);
    END;
    INSERT INTO logs VALUES (5);
END;
```

* A. Chỉ chứa `4` và `5` (vì `1` và `2` bị tự động Rollback khi xảy ra `ZERO_DIVIDE`).
* B. Chỉ chứa `1`, `4`, và `5` (vì `2` nằm trong khối con bị lỗi nên bị Rollback).
* C. Chứa `1`, `2`, `4`, và `5` (vì việc phát sinh và bắt ngoại lệ trong PL/SQL hoàn toàn KHÔNG tự động Rollback các câu lệnh DML đã chạy thành công trước thời điểm lỗi).
* D. Bảng `LOGS` không có dòng nào vì chưa có lệnh `COMMIT`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Một ngoại lệ phát sinh trong PL/SQL (và đã được bắt bởi khối `EXCEPTION`) **không bao giờ tự động `ROLLBACK`** các câu lệnh DML đã chạy thành công trước đó!
    * `INSERT 1` chạy thành công.
    * Bước vào khối con: `INSERT 2` chạy thành công.
    * Lệnh `RAISE ZERO_DIVIDE;` nhảy thẳng xuống `WHEN ZERO_DIVIDE` (bỏ qua `INSERT 3`), chạy `INSERT 4`.
    * Thoát khỏi khối con êm đẹp, chạy tiếp câu lệnh kế tiếp của khối ngoài là `INSERT 5`.
    * Kết quả trong phiên hiện tại, bảng `LOGS` có đầy đủ 4 dòng: **`1`, `2`, `4`, `5`**!
  * **A, B, D sai:** Chỉ khi câu lệnh DML tự nó thất bại thì bản thân câu lệnh DML đó mới bị rollback cấp câu lệnh (Statement-level rollback), hoặc khi Unhandled Exception văng ra khỏi khối ngoài cùng về Client thì toàn bộ khối mới bị rollback.
</details>

---

### Câu 15 (Question 15)
**Tiếp nối tình huống về Transaction ở Câu 14: Giả sử bạn chạy các câu lệnh dưới đây trong cùng một Session. Sau khi khối PL/SQL thứ hai bị văng lỗi `ZERO_DIVIDE` không được bắt (Unhandled Exception), bảng `LOGS` trong Session hiện tại sẽ còn lại những dòng nào?**

```sql
-- Câu lệnh 1 (Chạy thành công):
INSERT INTO logs VALUES (10);

-- Câu lệnh 2 (Khối PL/SQL bị Unhandled Exception):
BEGIN
    INSERT INTO logs VALUES (20);
    INSERT INTO logs VALUES (30);
    RAISE ZERO_DIVIDE;
END;
/
```

* A. Bảng `LOGS` trống rỗng (0 dòng) vì lỗi Unhandled Exception sẽ Rollback toàn bộ Transaction của Session từ đầu.
* B. Bảng `LOGS` chỉ còn dòng `10` (vì Unhandled Exception văng ra khỏi khối PL/SQL ngoài cùng chỉ tự động Rollback tại điểm bắt đầu của chính khối PL/SQL đó — tức xóa `20` và `30`, nhưng giữ nguyên `10` của câu lệnh trước).
* C. Bảng `LOGS` có đầy đủ cả `10`, `20`, và `30`.
* D. Bảng `LOGS` có `10` và `20`, chỉ có dòng `30` ngay trước `RAISE` bị Rollback.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Oracle luôn đặt một `SAVEPOINT` ngầm định trước mỗi câu lệnh gửi từ Client (bao gồm cả một khối Anonymous Block ngoài cùng).
    * Khi Câu lệnh 1 (`INSERT 10`) chạy xong, dòng `10` nằm trong Transaction hiện tại.
    * Khi Câu lệnh 2 (Khối `BEGIN ... END;`) chạy, nó chèn `20` và `30` rồi bị chết bởi **Unhandled Exception (`ZERO_DIVIDE`)**. Vì cả khối PL/SQL được coi là một câu lệnh đơn lẻ bị thất bại, Oracle tự động thực hiện **Statement-level Rollback** quay về thời điểm bắt đầu khối `BEGIN ... END;`.
    * Kết quả: Hai dòng `20` và `30` bị hủy bỏ, nhưng dòng **`10`** của câu lệnh trước đó vẫn còn nguyên trong Transaction!
  * **A, C, D sai:** Hiểu rõ ranh giới của Statement-level Rollback là kiến thức bắt buộc trong kỳ thi OCP.
</details>

---

### Câu 16 (Question 16)
**Khi một ngoại lệ được ném ra từ một thủ tục nằm sâu ở tầng thứ 3 và được bắt bởi nhánh `WHEN OTHERS` ở thủ tục tầng thứ 1, hàm nào của gói `DBMS_UTILITY` sẽ giúp bạn biết chính xác TÊN ĐỐI TƯỢNG và SỐ DÒNG CODE (Line Number) ở tầng thứ 3 nơi ngoại lệ được phát sinh ban đầu?**

* A. `DBMS_UTILITY.FORMAT_ERROR_STACK`
* B. `DBMS_UTILITY.FORMAT_CALL_STACK`
* C. `DBMS_UTILITY.FORMAT_ERROR_BACKTRACE`
* D. `SQLERRM`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Hàm **`DBMS_UTILITY.FORMAT_ERROR_BACKTRACE`** trả về chuỗi truy vết ngược từ vị trí dòng lệnh đầu tiên nơi ngoại lệ được ném ra cho đến vị trí nơi nó được bắt (ví dụ: `ORA-06512: at "HR.PROC_LEVEL_3", line 14`).
  * **A sai:** `FORMAT_ERROR_STACK` chỉ trả về mã lỗi và nội dung thông báo lỗi (giống `SQLERRM` nhưng không bị cắt ở 512 bytes), **không** chứa số dòng code gây lỗi.
  * **B sai:** `FORMAT_CALL_STACK` trả về ngăn xếp gọi hàm tại thời điểm hiện tại (tức chỉ thấy dòng hiện tại ở tầng 1 chứ không thấy dòng đã thoát ở tầng 3).
  * **D sai:** `SQLERRM` không trả về số dòng code nơi phát sinh ngoại lệ.
</details>

---

### Câu 17 (Question 17)
**Quan sát đoạn mã có 2 ngoại lệ cùng tên `e_my_err` được khai báo ở cả khối ngoài và khối trong (Exception Scoping / Shadowing). Kết quả thực thi đoạn mã sau là gì?**

```sql
DECLARE
    e_my_err EXCEPTION;
BEGIN
    DECLARE
        e_my_err EXCEPTION;
    BEGIN
        RAISE e_my_err;
    END;
EXCEPTION
    WHEN e_my_err THEN
        DBMS_OUTPUT.PUT_LINE('Bắt được e_my_err ở khối ngoài!');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Bắt được bằng WHEN OTHERS ở khối ngoài!');
END;
```

* A. In ra `Bắt được e_my_err ở khối ngoài!`.
* B. In ra `Bắt được bằng WHEN OTHERS ở khối ngoài!`.
* C. Báo lỗi biên dịch vì không được khai báo hai ngoại lệ trùng tên `e_my_err` trong các khối lồng nhau.
* D. Chương trình kết thúc mà không in ra dòng nào.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là câu hỏi bẫy kinh điển về **Phạm vi của User-Defined Exception (Exception Scope & Visibility)**:
    * Mặc dù cùng có tên là `e_my_err`, nhưng `e_my_err` khai báo ở khối ngoài và `e_my_err` khai báo ở khối trong là **hai ngoại lệ hoàn toàn khác nhau** trong bộ nhớ!
    * Khi ở bên trong khối con gọi `RAISE e_my_err;`, nó ném ra **ngoại lệ `e_my_err` của khối con** (vì biến cục bộ che khuất biến ngoài).
    * Khối con không có phần `EXCEPTION`, nên ngoại lệ `e_my_err` (của khối con) văng ra khối ngoài.
    * Tại phần `EXCEPTION` của khối ngoài, nhánh `WHEN e_my_err THEN` chỉ kiểm tra **`e_my_err` của khối ngoài**, nên không khớp! Do đó, ngoại lệ rơi xuống nhánh **`WHEN OTHERS THEN`** và in ra `Bắt được bằng WHEN OTHERS ở khối ngoài!`!
    * *(Lưu ý: Nếu không có nhánh `WHEN OTHERS` ở khối ngoài, chương trình sẽ bị chết bởi lỗi `ORA-06510: PL/SQL: unhandled user-defined exception`!).*
  * **A, C, D sai:** Để khối trong ném đúng ngoại lệ của khối ngoài, khối ngoài phải được gắn nhãn `<<outer_lbl>>` và khối trong phải gọi `RAISE outer_lbl.e_my_err;`.
</details>

---

### Câu 18 (Question 18)
**Ngoại lệ định nghĩa sẵn (Predefined Exception) nào sẽ được ném ra trong đoạn mã dưới đây?**

```sql
DECLARE
    TYPE t_num_list IS TABLE OF NUMBER;
    v_list t_num_list; -- Chưa khởi tạo bằng Constructor t_num_list()
BEGIN
    v_list(1) := 100;
END;
```

* A. `ACCESS_INTO_NULL` (`ORA-06530`)
* B. `COLLECTION_IS_NULL` (`ORA-06531`)
* C. `SUBSCRIPT_BEYOND_COUNT` (`ORA-06533`)
* D. `NO_DATA_FOUND` (`ORA-01403`)

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Biến `v_list` có kiểu là một **Nested Table** (`IS TABLE OF NUMBER` không có `INDEX BY`). Khi mới khai báo mà chưa gọi hàm khởi tạo (`v_list := t_num_list();`), biến `v_list` đang ở trạng thái nguyên tử `NULL` (Atomically NULL). Mọi thao tác gán phần tử hoặc gọi phương thức (ngoại trừ `.EXISTS`) trên một Nested Table / VARRAY đang là `NULL` sẽ lập tức ném ra ngoại lệ **`COLLECTION_IS_NULL` (`ORA-06531: Reference to uninitialized collection`)**.
  * **A sai:** `ACCESS_INTO_NULL` (`ORA-06530`) xảy ra khi gán thuộc tính cho một **Object Type (`CREATE TYPE ... AS OBJECT`)** chưa khởi tạo, không phải Collection.
  * **C sai:** `SUBSCRIPT_BEYOND_COUNT` (`ORA-06533`) xảy ra khi Collection **đã được khởi tạo** (`v_list := t_num_list();`) nhưng chưa `EXTEND` mà đã truy cập `v_list(1)`.
  * **D sai:** `NO_DATA_FOUND` xảy ra khi đọc phần tử chưa tồn tại của `Associative Array`.
</details>

---

### Câu 19 (Question 19)
**Nếu biến `v_list` ở Câu 18 đã được khởi tạo rỗng bằng constructor `v_list := t_num_list();` nhưng bạn quên gọi `v_list.EXTEND;` trước khi thực hiện gán `v_list(1) := 100;`, ngoại lệ nào sẽ được ném ra?**

* A. `COLLECTION_IS_NULL` (`ORA-06531`)
* B. `SUBSCRIPT_OUTSIDE_LIMIT` (`ORA-06532`)
* C. `SUBSCRIPT_BEYOND_COUNT` (`ORA-06533`)
* D. `VALUE_ERROR` (`ORA-06502`)

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khi đã khởi tạo `v_list := t_num_list();`, tập hợp không còn là `NULL` nữa mà là một tập hợp rỗng có số lượng phần tử hiện tại `v_list.COUNT = 0`. Việc truy cập vào vị trí chỉ số `1` (lớn hơn `COUNT` hiện tại là `0`) khi chưa cấp phát thêm ô nhớ bằng `.EXTEND` sẽ ném ra ngoại lệ **`SUBSCRIPT_BEYOND_COUNT` (`ORA-06533: Subscript beyond count`)**.
  * **A, B, D sai:** Còn nếu truyền chỉ số âm hoặc `0` (ví dụ `v_list(0)` hoặc `v_list(-1)`), hoặc vượt quá `LIMIT` của `VARRAY`, lúc đó mới ném `SUBSCRIPT_OUTSIDE_LIMIT` (`ORA-06532`).
</details>

---

### Câu 20 (Question 20)
**Quan sát đoạn mã gán nhiều ngoại lệ cho cùng một mã lỗi bằng `PRAGMA EXCEPTION_INIT` hoặc bắt trùng ngoại lệ dưới đây. Đoạn mã này sẽ gặp hiện tượng gì?**

```sql
DECLARE
    e_dup_1 EXCEPTION;
    e_dup_2 EXCEPTION;
    PRAGMA EXCEPTION_INIT(e_dup_1, -1);
    PRAGMA EXCEPTION_INIT(e_dup_2, -1);
BEGIN
    NULL;
EXCEPTION
    WHEN e_dup_1 THEN
        DBMS_OUTPUT.PUT_LINE('Handler 1');
    WHEN e_dup_2 THEN
        DBMS_OUTPUT.PUT_LINE('Handler 2');
END;
```

* A. Thực thi thành công không có lỗi.
* B. Báo lỗi biên dịch ở dòng `PRAGMA EXCEPTION_INIT` thứ hai.
* C. Báo lỗi biên dịch ở phần `EXCEPTION` (`PLS-00483: exception 'E_DUP_2' may appear in at most one exception handler`) vì cả `e_dup_1` và `e_dup_2` đều cùng đại diện cho một mã lỗi `ORA-00001` (`-1`), không được phép xuất hiện ở hai nhánh `WHEN` riêng biệt trong cùng một khối `EXCEPTION`.
* D. Ném lỗi Runtime `PROGRAM_ERROR`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong phần `DECLARE`, bạn có thể gắn nhiều tên biến `EXCEPTION` khác nhau vào cùng một mã lỗi `-1` (hoặc gắn trùng với mã `-1` của `DUP_VAL_ON_INDEX`). Tuy nhiên, trong cùng một khối `EXCEPTION`, hai ngoại lệ đại diện cho **cùng một mã lỗi `ORA-xxxxx`** (ví dụ: `WHEN DUP_VAL_ON_INDEX THEN ... WHEN e_dup_1 THEN ...` hoặc `WHEN e_dup_1 THEN ... WHEN e_dup_2 THEN ...`) **không được phép đứng ở hai nhánh `WHEN` khác nhau**! Trình biên dịch sẽ phát hiện sự trùng lặp mã lỗi và báo lỗi **`PLS-00483: exception '...' may appear in at most one exception handler`**. (Nếu gộp chung `WHEN e_dup_1 OR e_dup_2 THEN` thì lại hợp lệ!).
  * **A, B, D sai:** Đây là bẫy kiểm tra trùng mã lỗi giữa Predefined Exception và Non-Predefined Exception trong cùng khối `EXCEPTION`.
</details>

---

### Câu 21 (Question 21)
**Khi gọi hàm `SQLCODE` và `SQLERRM` ở bên trong phần thực thi `BEGIN` (khi KHÔNG có bất kỳ ngoại lệ nào đang xảy ra), kết quả trả về của hai hàm này là gì?**

* A. `SQLCODE` trả về `NULL` và `SQLERRM` trả về `NULL`.
* B. `SQLCODE` trả về `0` và `SQLERRM` trả về chuỗi `'ORA-0000: normal, successful completion'`.
* C. Báo lỗi biên dịch vì `SQLCODE` và `SQLERRM` chỉ được phép gọi bên trong phần `EXCEPTION`.
* D. `SQLCODE` trả về `100` và `SQLERRM` trả về `'No Error'`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Hai hàm `SQLCODE` và `SQLERRM` hoàn toàn có thể được gọi ở bên trong phần `BEGIN` (không bị lỗi biên dịch). Khi không có ngoại lệ nào đang hoạt động, `SQLCODE` trả về **`0`** và `SQLERRM` trả về thông báo tương ứng với mã `0` là **`'ORA-0000: normal, successful completion'`**.
  * **A, C, D sai:** Chỉ câu lệnh `RAISE;` không đối số mới bị cấm đặt trong phần `BEGIN`, còn `SQLCODE` và `SQLERRM` đặt trong `BEGIN` vẫn biên dịch bình thường.
</details>

---

### Câu 22 (Question 22)
**Câu lệnh khai báo chỉ thị `PRAGMA EXCEPTION_INIT` nào dưới đây là HỢP LỆ?**

* A. `PRAGMA EXCEPTION_INIT(-2292, e_child_record);`
* B. `PRAGMA EXCEPTION_INIT(e_no_data, 100);`
* C. `PRAGMA EXCEPTION_INIT(e_custom, 0);`
* D. `PRAGMA EXCEPTION_INIT(e_custom, 20001);`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Cú pháp chuẩn là `PRAGMA EXCEPTION_INIT(exception_name, error_number);`. Tham số thứ hai (`error_number`) chấp nhận số dương **`100`** (mã ANSI của `NO_DATA_FOUND` / `ORA-01403`) hoặc các mã lỗi nguyên **âm** hợp lệ của Oracle (như `-2292`, `-20001`, ...).
  * **A sai:** Sai thứ tự tham số (tên biến ngoại lệ phải đứng trước, mã số lỗi đứng sau).
  * **C và D sai:** Không được truyền số `0` hoặc các số nguyên dương khác ngoài `100` (truyền `0` hoặc `20001` dương sẽ gây lỗi biên dịch **`PLS-00701: illegal ORACLE error number for PRAGMA EXCEPTION_INIT`**).
</details>

---

### Câu 23 (Question 23)
**Cho đoạn mã PL/SQL dưới đây. Khi thực thi, kết quả in ra màn hình là gì?**

```sql
DECLARE
    v_x NUMBER := 0;
BEGIN
    FOR i IN 1..3 LOOP
        BEGIN
            IF i = 2 THEN
                v_x := 10 / 0;
            END IF;
            v_x := v_x + i;
        EXCEPTION
            WHEN ZERO_DIVIDE THEN
                v_x := v_x + 10;
        END;
    END LOOP;
    DBMS_OUTPUT.PUT_LINE('v_x = ' || v_x);
END;
```

* A. `v_x = 1`
* B. `v_x = 11`
* C. `v_x = 14`
* D. `v_x = 16`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Vì bên trong thân vòng lặp `FOR i IN 1..3 LOOP` được bọc một khối con `BEGIN ... EXCEPTION ... END;` riêng biệt, nên khi ngoại lệ xảy ra ở vòng lặp `i = 2`, nó được xử lý gọn bên trong khối con và vòng lặp `FOR` vẫn tiếp tục chạy sang `i = 3`! Cụ thể:
    * **`i = 1`:** Không vào `IF`, chạy `v_x := 0 + 1 = 1`.
    * **`i = 2`:** Vào `IF`, phép chia `10 / 0` ném `ZERO_DIVIDE` -> Bỏ qua dòng `v_x := v_x + i;` phía dưới `IF`, nhảy vào `WHEN ZERO_DIVIDE` của khối con: `v_x := 1 + 10 = 11`. Khối con kết thúc bình thường.
    * **`i = 3`:** Vòng lặp tiếp tục với `i = 3`. Không vào `IF`, chạy `v_x := 11 + 3 = 14`.
    * Kết thúc vòng lặp, in ra **`v_x = 14`**.
  * **A, B, D sai:** Đây là mẫu thiết kế chuẩn (*Enclosing loop body in a sub-block*) khi bạn muốn một dòng bị lỗi trong vòng lặp không làm dừng toàn bộ vòng lặp.
</details>

---

### Câu 24 (Question 24)
**Điều gì xảy ra nếu bạn sử dụng lệnh `RAISE NO_DATA_FOUND;` để chủ động ném một Predefined Exception của Oracle trong phần `BEGIN`?**

* A. Báo lỗi biên dịch vì lệnh `RAISE` chỉ được dùng cho `User-Defined Exception` do lập trình viên tự khai báo, không được dùng cho Predefined Exception của Oracle.
* B. Hoàn toàn hợp lệ; PL/SQL sẽ kích hoạt ngoại lệ `NO_DATA_FOUND` (`SQLCODE = 100`) giống hệt như khi một câu lệnh `SELECT ... INTO` không tìm thấy dữ liệu.
* C. Hợp lệ nhưng `SQLCODE` sẽ bị đổi thành `+1` giống như `User-Defined Exception`.
* D. Hợp lệ nhưng chỉ bắt được bằng nhánh `WHEN OTHERS`, không bắt được bằng `WHEN NO_DATA_FOUND`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Lệnh `RAISE exception_name;` trong PL/SQL có thể dùng để chủ động ném **bất kỳ ngoại lệ nào có tên** — bao gồm cả `User-Defined Exception`, `Non-Predefined Exception` (đã gắn Pragma), và cả các **`Predefined Exception`** có sẵn của hệ thống như `RAISE NO_DATA_FOUND;`, `RAISE VALUE_ERROR;`, `RAISE ZERO_DIVIDE;`. Khi được ném ra, nó mang đầy đủ mã `SQLCODE` và `SQLERRM` chuẩn của ngoại lệ đó và được bắt bởi nhánh `WHEN NO_DATA_FOUND THEN` bình thường.
  * **A, C, D sai:** Việc chủ động `RAISE NO_DATA_FOUND;` hoặc `RAISE VALUE_ERROR;` rất phổ biến trong thực tế khi kiểm tra tham số đầu vào.
</details>

---

### Câu 25 (Question 25)
**Cho một Object Type được tạo bằng lệnh `CREATE OR REPLACE TYPE t_address AS OBJECT (city VARCHAR2(50), zip VARCHAR2(10));`. Khi chạy khối lệnh dưới đây, ngoại lệ nào sẽ được ném ra?**

```sql
DECLARE
    v_addr t_address; -- Chưa gọi hàm khởi tạo t_address(NULL, NULL)
BEGIN
    v_addr.city := 'Hanoi';
END;
```

* A. `COLLECTION_IS_NULL` (`ORA-06531`)
* B. `VALUE_ERROR` (`ORA-06502`)
* C. `ACCESS_INTO_NULL` (`ORA-06530`)
* D. Không có ngoại lệ nào xảy ra, giống như biến `RECORD` của PL/SQL, thuộc tính `v_addr.city` được gán `'Hanoi'` thành công.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Cần phân biệt rõ giữa biến kiểu **PL/SQL `RECORD`** và biến kiểu **SQL Object Type (`CREATE TYPE ... AS OBJECT`)**:
    * Với biến `RECORD` (ví dụ `v_rec emp%ROWTYPE;` hoặc `TYPE t_rec IS RECORD (...)`): Bạn có thể gán ngay `v_rec.city := 'Hanoi';` mà không cần khởi tạo.
    * Với biến **Object Type (`v_addr t_address;`)**: Nếu chưa được khởi tạo bằng Constructor (`v_addr := t_address(NULL, NULL);` hoặc `NEW t_address(...)`), toàn bộ đối tượng `v_addr` đang là `NULL` (Atomically NULL). Cố tình gán giá trị cho một thuộc tính của Object đang `NULL` (`v_addr.city := 'Hanoi';`) sẽ lập tức ném ra ngoại lệ **`ACCESS_INTO_NULL` (`ORA-06530: Reference to uninitialized composite`)**!
  * **A, B, D sai:** Hãy nhớ cặp bài trùng: Object chưa khởi tạo $\rightarrow$ **`ACCESS_INTO_NULL`** (`ORA-06530`); Collection chưa khởi tạo $\rightarrow$ **`COLLECTION_IS_NULL`** (`ORA-06531`).
</details>

---
