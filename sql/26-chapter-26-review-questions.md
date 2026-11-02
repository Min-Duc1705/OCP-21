# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 26: PL/SQL Nâng Cao & Tối Ưu Hiệu Năng

> **Tài liệu tham chiếu:** *OCP Oracle Database Program with PL/SQL Study Guide (Exam 1Z0-149)*  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle OCP 1Z0-149 & VNPT kèm phân tích & đáp án chi tiết.  
> **Cách học:** Bạn hãy tự đọc đề và chọn đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và nắm vững bẫy thi.

---

### Câu 1 (Question 1)
**Những phát biểu nào sau đây là ĐÚNG khi so sánh ba loại Collection (`Associative Array`, `Nested Table`, và `VARRAY`) trong PL/SQL? (Chọn 2 đáp án đúng)**

* A. Chỉ có `Associative Array (INDEX BY)` mới cho phép sử dụng kiểu chuỗi ký tự (`VARCHAR2`) hoặc số nguyên âm làm chỉ mục (Index/Key), và nó chỉ có thể được khai báo trong PL/SQL chứ không thể tạo ở cấp Schema bằng lệnh `CREATE TYPE`.
* B. Cả 3 loại Collection đều bắt buộc phải được khởi tạo bằng hàm tạo (Constructor) trước khi có thể gán phần tử đầu tiên.
* C. `VARRAY` luôn luôn là một mảng đặc (Always Dense — không bao giờ có khoảng trống giữa các phần tử) và có kích thước tối đa cố định ngay từ lúc khai báo kiểu.
* D. Chỉ có `VARRAY` mới có thể được lưu trữ làm kiểu dữ liệu của một cột trong bảng Database, còn `Nested Table` thì không thể.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C**
* **Giải thích chuyên sâu:**
  * **A đúng:** `Associative Array` (`TYPE ... IS TABLE OF ... INDEX BY VARCHAR2(n) | PLS_INTEGER`) là loại duy nhất hỗ trợ chỉ mục kiểu chuỗi `VARCHAR2` hoặc số nguyên âm/0/dương bất kỳ, và là kiểu thuần PL/SQL (không thể tạo bằng `CREATE OR REPLACE TYPE` ở mức Schema SQL).
  * **C đúng:** `VARRAY` có giới hạn phần tử tối đa (`LIMIT`) cố định và không cho phép xóa từng phần tử ở giữa (`.DELETE(n)`), do đó các phần tử của `VARRAY` luôn liên tục từ `1` đến `COUNT`.
  * **B sai:** `Associative Array` khi vừa khai báo biến đã tự động ở trạng thái Rỗng (Empty, không phải `NULL`), có thể gán ngay `v_aa(10) := 'A'` mà không cần Constructor (trước 18c thậm chí không có Constructor cho Associative Array). Chỉ có `Nested Table` và `VARRAY` mới khởi đầu bằng `NULL` và bắt buộc cần Constructor.
  * **D sai:** Cả `Nested Table` và `VARRAY` (khi được tạo ở cấp Schema bằng `CREATE TYPE`) đều có thể dùng làm kiểu dữ liệu cho cột của bảng Database.
</details>

---

### Câu 2 (Question 2)
**Giả sử biến `v_nt` thuộc kiểu `Nested Table` vừa mới được khai báo nhưng CHƯA được khởi tạo bằng Constructor (`v_nt` đang là `NULL`). Phương thức Collection duy nhất nào dưới đây khi gọi trên `v_nt` sẽ KHÔNG ném ra ngoại lệ `COLLECTION_IS_NULL` (`ORA-06531`)?**

* A. `v_nt.COUNT`
* B. `v_nt.FIRST`
* C. `v_nt.EXISTS(1)`
* D. `v_nt.EXTEND(1)`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong 10 phương thức của Collection, **`EXISTS(n)`** là phương thức **DUY NHẤT** không bao giờ ném ra ngoại lệ `COLLECTION_IS_NULL` (`ORA-06531`) khi được gọi trên một `Nested Table` hoặc `VARRAY` chưa được khởi tạo (`NULL`), mà nó trả về giá trị **`FALSE`** một cách an toàn!
  * **A, B, D sai:** Gọi `.COUNT`, `.FIRST`, `.LAST`, `.LIMIT`, `.EXTEND`, `.TRIM`, hoặc `.DELETE` trên một Collection đang là `NULL` đều lập tức ném ra ngoại lệ `COLLECTION_IS_NULL` (`ORA-06531`).
</details>

---

### Câu 3 (Question 3)
**Thao tác gọi phương thức Collection nào dưới đây sẽ gây ra LỖI BIÊN DỊCH?**

* A. Gọi `v_varray.DELETE;` (không có tham số) trên một biến kiểu `VARRAY` để xóa toàn bộ các phần tử.
* B. Gọi `v_varray.DELETE(2);` (có tham số vị trí) trên một biến kiểu `VARRAY` để xóa phần tử thứ 2.
* C. Gọi `v_nested_tab.LIMIT` trên một biến kiểu `Nested Table`.
* D. Gọi `v_assoc_arr.DELETE(-5);` trên một biến kiểu `Associative Array`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng (Gây lỗi biên dịch):** Vì `VARRAY` bắt buộc phải luôn luôn đặc (Dense — không được có khoảng trống ở giữa), Oracle **CẤM sử dụng phương thức `.DELETE(n)` hoặc `.DELETE(m, n)` có tham số** trên `VARRAY`! Trình biên dịch sẽ báo lỗi **`PLS-00306: wrong number or types of arguments in call to 'DELETE'`**. Muốn bớt phần tử ở cuối `VARRAY`, bạn phải dùng `.TRIM(n)`.
  * **A sai (Hợp lệ):** `v_varray.DELETE;` (không có tham số) hoàn toàn hợp lệ trên `VARRAY` vì nó xóa sạch cả mảng (`COUNT = 0`), không tạo ra khoảng trống ở giữa.
  * **C sai (Hợp lệ):** Gọi `.LIMIT` trên `Nested Table` hoặc `Associative Array` không báo lỗi mà trả về giá trị **`NULL`**.
  * **D sai (Hợp lệ):** `Associative Array` hỗ trợ chỉ số âm và cho phép `.DELETE(n)` tại bất kỳ chỉ số nào.
</details>

---

### Câu 4 (Question 4)
**Hãy xác định kết quả in ra màn hình khi thực thi đoạn mã thao tác trên `Nested Table` dưới đây:**

```sql
DECLARE
    TYPE t_list IS TABLE OF NUMBER;
    v_nums t_list := t_list(10, 20, 30, 40);
BEGIN
    v_nums.DELETE(2);
    v_nums.TRIM(1);
    DBMS_OUTPUT.PUT_LINE(
        'COUNT=' || v_nums.COUNT ||
        ', FIRST=' || v_nums.FIRST ||
        ', LAST=' || v_nums.LAST
    );
END;
```

* A. `COUNT=2, FIRST=1, LAST=3`
* B. `COUNT=2, FIRST=1, LAST=2`
* C. `COUNT=3, FIRST=1, LAST=3`
* D. Ném ra ngoại lệ `SUBSCRIPT_BEYOND_COUNT`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:**
    1. Ban đầu `v_nums` có 4 phần tử tại các chỉ số `1` (`10`), `2` (`20`), `3` (`30`), `4` (`40`).
    2. Lệnh `v_nums.DELETE(2);` xóa phần tử ở vị trí số `2`. Lúc này các vị trí còn tồn tại là `1` (`10`), `3` (`30`), `4` (`40`). (`COUNT = 3`).
    3. Lệnh `v_nums.TRIM(1);` cắt bỏ 1 vị trí ở cuối mảng (tức xóa vị trí số `4`).
    4. Lúc này trong `v_nums` chỉ còn tồn tại phần tử tại vị trí số **`1`** (`10`) và vị trí số **`3`** (`30`)!
    5. Do đó: Số lượng phần tử hiện có **`COUNT = 2`**, chỉ số đầu tiên **`FIRST = 1`**, và chỉ số cuối cùng **`LAST = 3`**!
  * **B, C, D sai:** Hãy nhớ đối với mảng thưa (`Nested Table` đã bị `.DELETE` phần tử ở giữa), giá trị của `.LAST` có thể lớn hơn `.COUNT`! (Trong khi đối với `VARRAY` không rỗng thì `.LAST` luôn luôn bằng `.COUNT`).
</details>

---

### Câu 5 (Question 5)
**Cùng với biến `v_nums` ở Câu 4 (sau khi đã gọi `v_nums.DELETE(2);`, chỉ còn các vị trí `1`, `3`, `4` tồn tại), điều gì sẽ xảy ra nếu bạn duyệt `v_nums` bằng vòng lặp `FOR i IN v_nums.FIRST .. v_nums.LAST LOOP DBMS_OUTPUT.PUT_LINE(v_nums(i)); END LOOP;`?**

* A. In ra `10`, `NULL`, `30`, `40`.
* B. In ra `10`, `30`, `40` (vòng lặp `FOR` tự động bỏ qua vị trí số 2 đã xóa).
* C. In ra `10` ở vòng lặp `i = 1`, sau đó khi `i = 2` chương trình ném ra ngoại lệ Runtime `NO_DATA_FOUND` (`ORA-01403`) vì cố đọc phần tử tại vị trí số 2 đã bị xóa.
* D. Ném ra ngoại lệ `SUBSCRIPT_BEYOND_COUNT` (`ORA-06533`) khi `i = 2`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Vòng lặp số nguyên `FOR i IN 1 .. 4 LOOP` sẽ chạy lần lượt qua tất cả các số nguyên `1, 2, 3, 4`. Khi `i = 2`, câu lệnh `DBMS_OUTPUT.PUT_LINE(v_nums(2));` cố gắng đọc một phần tử ở giữa `Nested Table` đã bị xóa bằng `.DELETE(2)`. Khi truy xuất vào một lỗ hổng đã bị xóa (hoặc chưa gán trong `Associative Array`), PL/SQL sẽ ném ra ngoại lệ **`NO_DATA_FOUND` (`ORA-01403`)**!
  * **Cách duyệt mảng thưa đúng:** Phải dùng phương thức `.FIRST` và `.NEXT(idx)` trong vòng lặp `WHILE`, hoặc kiểm tra `IF v_nums.EXISTS(i) THEN` bên trong vòng lặp `FOR`.
  * **A, B, D sai:** `SUBSCRIPT_BEYOND_COUNT` chỉ xảy ra khi chỉ số vượt quá số lượng vị trí đã cấp phát ở phía cuối mảng (`> LAST`), còn lỗ trống ở giữa mảng thì ném `NO_DATA_FOUND`.
</details>

---

### Câu 6 (Question 6)
**Giả sử bảng `EMPLOYEES` không có nhân viên nào thuộc phòng ban `department_id = 999`. Kết quả khi thực thi khối lệnh sử dụng `SELECT ... BULK COLLECT INTO` dưới đây là gì?**

```sql
DECLARE
    TYPE t_name_tab IS TABLE OF employees.first_name%TYPE;
    v_names t_name_tab;
BEGIN
    SELECT first_name
    BULK COLLECT INTO v_names
    FROM employees
    WHERE department_id = 999;

    DBMS_OUTPUT.PUT_LINE('Count = ' || v_names.COUNT);
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Bắt được lỗi NO_DATA_FOUND!');
END;
```

* A. In ra `Bắt được lỗi NO_DATA_FOUND!`.
* B. Ném ra ngoại lệ `COLLECTION_IS_NULL` vì biến `v_names` chưa được khởi tạo bằng Constructor trước câu lệnh `SELECT`.
* C. Không ném ra bất kỳ ngoại lệ nào và in ra màn hình `Count = 0`.
* D. In ra `Count = NULL`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là hai đặc điểm cực kỳ quan trọng của `BULK COLLECT` trong đề thi OCP:
    1. **Tự động khởi tạo Collection:** Khi dùng `BULK COLLECT INTO v_names`, PL/SQL Engine tự động khởi tạo biến `v_names` (không cần gọi Constructor `t_name_tab()` trước đó).
    2. **Không bao giờ ném `NO_DATA_FOUND`:** Khác với `SELECT ... INTO` đơn lẻ, khi câu truy vấn `SELECT ... BULK COLLECT INTO` trả về **0 dòng**, nó **KHÔNG ném ngoại lệ `NO_DATA_FOUND`**, mà trả về một Collection rỗng đã khởi tạo hợp lệ với **`v_names.COUNT = 0`**!
  * **A, B, D sai:** Muốn kiểm tra câu lệnh `BULK COLLECT` có lấy được dữ liệu hay không, bạn luôn phải kiểm tra `IF v_names.COUNT = 0 THEN` (hoặc `IF v_names.FIRST IS NULL THEN`), không dùng `WHEN NO_DATA_FOUND`.
</details>

---

### Câu 7 (Question 7)
**Cho bảng `EMPLOYEES` có đúng 107 dòng dữ liệu. Lập trình viên viết vòng lặp `FETCH ... BULK COLLECT INTO ... LIMIT 50` như dưới đây.Tổng cộng có bao nhiêu nhân viên sẽ được xử lý bởi thủ tục `process_emp`?**

```sql
DECLARE
    CURSOR c_emp IS SELECT employee_id FROM employees;
    TYPE t_id_list IS TABLE OF employees.employee_id%TYPE;
    v_ids t_id_list;
BEGIN
    OPEN c_emp;
    LOOP
        FETCH c_emp BULK COLLECT INTO v_ids LIMIT 50;
        EXIT WHEN c_emp%NOTFOUND;

        FOR i IN 1 .. v_ids.COUNT LOOP
            process_emp(v_ids(i));
        END LOOP;
    END LOOP;
    CLOSE c_emp;
END;
```

* A. `107` nhân viên.
* B. `100` nhân viên (bỏ sót mất 7 nhân viên cuối cùng).
* C. `50` nhân viên.
* D. `0` nhân viên.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là bẫy kinh điển nhất khi kết hợp `FETCH ... BULK COLLECT INTO ... LIMIT n` với `EXIT WHEN c_emp%NOTFOUND;`!
    * **Lần lặp 1:** `FETCH ... LIMIT 50` lấy dòng 1..50 (`v_ids.COUNT = 50`). Con trỏ vẫn còn dòng nên `c_emp%NOTFOUND = FALSE` $\rightarrow$ Xử lý 50 nhân viên.
    * **Lần lặp 2:** `FETCH ... LIMIT 50` lấy dòng 51..100 (`v_ids.COUNT = 50`). Con trỏ vẫn còn dòng nên `c_emp%NOTFOUND = FALSE` $\rightarrow$ Xử lý thêm 50 nhân viên (tổng cộng 100).
    * **Lần lặp 3:** Chỉ còn 7 dòng cuối (101..107). Lệnh `FETCH ... LIMIT 50` nạp 7 dòng này vào `v_ids` (`v_ids.COUNT = 7`), nhưng vì không đủ 50 dòng yêu cầu (đã chạm đáy con trỏ!), Oracle lập tức bật cờ **`c_emp%NOTFOUND := TRUE` ngay tại lần FETCH thứ 3 này**!
    * Vì câu lệnh `EXIT WHEN c_emp%NOTFOUND;` nằm ngay dưới `FETCH`, vòng lặp lập tức thoát ra và **bỏ qua hoàn toàn 7 nhân viên cuối cùng** đang nằm trong `v_ids`!
  * **Cách sửa chuẩn:** Thay `EXIT WHEN c_emp%NOTFOUND;` bằng **`EXIT WHEN v_ids.COUNT = 0;`**!
</details>

---

### Câu 8 (Question 8)
**Phát biểu nào sau đây là ĐÚNG về cấu trúc câu lệnh `FORALL` trong PL/SQL?**

* A. `FORALL` là một vòng lặp nên bắt buộc phải kết thúc bằng từ khóa `END LOOP;`.
* B. Bên trong một câu lệnh `FORALL`, bạn có thể đặt nhiều câu lệnh DML (`INSERT`, `UPDATE`, `DELETE`) và câu lệnh `IF ... THEN` liên tiếp nhau.
* C. `FORALL` không phải là vòng lặp mà là một chỉ thị gắn kết hàng loạt (Bulk Bind statement); nó không có `LOOP ... END LOOP` và chỉ được phép chứa **duy nhất một câu lệnh DML** (hoặc một câu lệnh `EXECUTE IMMEDIATE`) ngay theo sau nó.
* D. `FORALL` có thể sử dụng cho cả câu lệnh `SELECT` để đọc dữ liệu hàng loạt.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** `FORALL` chỉ đóng gói toàn bộ mảng Collection gửi xuống SQL Engine trong 1 lần chuyển ngữ cảnh để thực thi **duy nhất một câu lệnh DML** (`INSERT`, `UPDATE`, `DELETE`, `MERGE`) hoặc một lệnh `EXECUTE IMMEDIATE`. Nó hoàn toàn không có từ khóa `LOOP` hay `END LOOP`.
  * **A, B, D sai:** Để đọc dữ liệu hàng loạt với `SELECT`, ta dùng `BULK COLLECT`, không dùng `FORALL`.
</details>

---

### Câu 9 (Question 9)
**Xem xét đoạn mã sử dụng `FORALL` trên một `Nested Table` có phần tử ở giữa đã bị xóa bằng `.DELETE(2)` dưới đây. Khi thực thi, hiện tượng gì sẽ xảy ra?**

```sql
DECLARE
    TYPE t_id_list IS TABLE OF NUMBER;
    v_ids t_id_list := t_id_list(101, 102, 103, 104);
BEGIN
    v_ids.DELETE(2); -- Xóa phần tử thứ 2 -> tạo mảng thưa!

    FORALL i IN v_ids.FIRST .. v_ids.LAST
        UPDATE employees SET salary = salary * 1.1 WHERE employee_id = v_ids(i);
END;
```

* A. Cập nhật thành công cho 3 nhân viên `101`, `103`, `104`.
* B. Câu lệnh `FORALL` thất bại và ném ra lỗi Runtime `ORA-22160: element at index [2] does not exist` vì mệnh đề `lower_bound .. upper_bound` yêu cầu mảng phải đặc (Dense — mọi phần tử trong dải phải tồn tại liên tục).
* C. Ném ra ngoại lệ `NO_DATA_FOUND` (`ORA-01403`).
* D. Báo lỗi biên dịch tại dòng `FORALL`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi dùng cú pháp dải liên tục `FORALL i IN low .. high`, tất cả các phần tử từ `low` đến `high` bắt buộc phải tồn tại (Dense Collection). Vì phần tử tại chỉ số `2` đã bị xóa bằng `v_ids.DELETE(2)`, câu lệnh `FORALL` sẽ báo lỗi **`ORA-22160: element at index [2] does not exist`** và hủy bỏ thao tác!
  * **Cách khắc phục cho mảng thưa:** Phải đổi sang mệnh đề **`FORALL i IN INDICES OF v_ids`**!
  * **A, C, D sai:** Hãy phân biệt rõ: Đọc mảng thưa trong vòng lặp `FOR` thường thì ném `NO_DATA_FOUND` (`ORA-01403`), nhưng đọc mảng thưa trong `FORALL i IN low..high` thì ném **`ORA-22160`**!
</details>

---

### Câu 10 (Question 10)
**Trong câu lệnh `FORALL`, khi nào bạn nên sử dụng mệnh đề `INDICES OF` và khi nào nên sử dụng mệnh đề `VALUES OF`?**

* A. Dùng `INDICES OF` cho `VARRAY` và dùng `VALUES OF` cho `Nested Table`.
* B. Dùng `INDICES OF collection_A` để `FORALL` tự động lặp qua các chỉ số (index) hiện đang tồn tại của mảng thưa `collection_A` (bỏ qua các phần tử đã bị `.DELETE`); còn dùng `VALUES OF pointer_collection` khi bạn muốn lấy **giá trị của các phần tử** nằm trong mảng chỉ số phụ `pointer_collection` làm vị trí truy xuất vào mảng dữ liệu chính.
* C. Hai mệnh đề `INDICES OF` và `VALUES OF` hoàn toàn giống hệt nhau, có thể thay thế cho nhau trong mọi trường hợp.
* D. `INDICES OF` chỉ dùng được cho câu lệnh `DELETE`, còn `VALUES OF` chỉ dùng được cho câu lệnh `INSERT`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * **`FORALL i IN INDICES OF v_data`:** Biến chạy `i` sẽ nhận lần lượt các **chỉ số (subscripts)** đang tồn tại của `v_data` (nhảy qua các vị trí đã bị xóa).
    * **`FORALL i IN VALUES OF v_index_pointers`:** Mảng `v_index_pointers` phải là một Collection có kiểu phần tử là `PLS_INTEGER` hoặc `BINARY_INTEGER`. Biến chạy `i` sẽ nhận lần lượt **giá trị phần tử `v_index_pointers(k)`** để chỉ định những phần tử cụ thể nào trong mảng dữ liệu `v_data(i)` sẽ được thực thi DML!
  * **A, C, D sai:** Cả hai mệnh đề này đều dùng được cho mọi lệnh DML (`INSERT`, `UPDATE`, `DELETE`, `MERGE`).
</details>

---

### Câu 11 (Question 11)
**Sau khi thực thi thành công một câu lệnh `FORALL i IN 1 .. v_depts.COUNT UPDATE employees SET salary = salary + 100 WHERE department_id = v_depts(i);`, bạn dùng thuộc tính nào để biết được riêng phần tử thứ 3 (`v_depts(3)`) đã cập nhật bao nhiêu dòng dữ liệu?**

* A. `SQL%ROWCOUNT(3)`
* B. `SQL%BULK_ROWCOUNT(3)`
* C. `v_depts(3)%ROWCOUNT`
* D. `SQL%BULK_EXCEPTIONS(3).ROWCOUNT`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * Thuộc tính `SQL%ROWCOUNT` trả về một số nguyên duy nhất là **tổng số dòng** bị tác động bởi toàn bộ câu lệnh `FORALL`.
    * Thuộc tính **`SQL%BULK_ROWCOUNT(i)`** hoạt động giống như một mảng kết hợp (`Associative Array`), lưu giữ **số lượng dòng bị tác động bởi lần thực thi tương ứng với chỉ số thứ `i`** của `FORALL`!
  * **A, C, D sai:** Đều là các cú pháp không hợp lệ.
</details>

---

### Câu 12 (Question 12)
**Khi sử dụng mệnh đề `SAVE EXCEPTIONS` trong câu lệnh `FORALL` (`FORALL i IN 1..v_arr.COUNT SAVE EXCEPTIONS INSERT ...`), nếu có 3 phần tử trong mảng gồm 100 phần tử gặp lỗi ràng buộc dữ liệu, điều gì sẽ xảy ra?**

* A. Toàn bộ 100 phần tử đều bị Rollback ngay lập tức và chương trình kết thúc mà không ném ngoại lệ nào.
* B. Cả 97 phần tử hợp lệ đều được chèn thành công, thông tin của 3 phần tử lỗi được ghi vào `SQL%BULK_EXCEPTIONS`, và ngay sau khi kết thúc câu lệnh `FORALL`, PL/SQL tự động ném ra ngoại lệ tổng hợp có mã lỗi `ORA-24381: error(s) in array DML`.
* C. Câu lệnh `FORALL` dừng lại ngay tại phần tử lỗi đầu tiên, các phần tử phía sau không được chạy.
* D. Thông tin lỗi được lưu vào bảng `USER_ERRORS` và không có ngoại lệ nào được ném ra.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Nhờ có `SAVE EXCEPTIONS`, SQL Engine không dừng lại khi gặp phần tử lỗi mà tiếp tục xử lý hết toàn bộ 97 phần tử hợp lệ còn lại. Sau khi hoàn tất toàn bộ mẻ xử lý, PL/SQL Engine gom tất cả các lỗi xảy ra vào bộ sưu tập `SQL%BULK_EXCEPTIONS` và ném ra ngoại lệ tổng hợp **`ORA-24381: error(s) in array DML`** để nhảy xuống khối `EXCEPTION` cho lập trình viên duyệt lỗi.
  * **A, C, D sai:** Để bắt đích danh ngoại lệ của `SAVE EXCEPTIONS`, lập trình viên dùng `PRAGMA EXCEPTION_INIT(e_bulk_err, -24381);`.
</details>

---

### Câu 13 (Question 13)
**Trong khối `EXCEPTION` xử lý lỗi của `FORALL ... SAVE EXCEPTIONS`, tại sao khi truyền mã lỗi từ `SQL%BULK_EXCEPTIONS(i).ERROR_CODE` vào hàm `SQLERRM` ta bắt buộc phải thêm dấu trừ đằng trước: `SQLERRM(-SQL%BULK_EXCEPTIONS(i).ERROR_CODE)`?**

* A. Vì hàm `SQLERRM` chỉ chấp nhận tham số kiểu chuỗi `VARCHAR2`.
* B. Vì trường `SQL%BULK_EXCEPTIONS(i).ERROR_CODE` lưu mã lỗi Oracle dưới dạng **số nguyên dương** (ví dụ `1400` thay vì `-1400`), trong khi hàm `SQLERRM` yêu cầu truyền mã lỗi Oracle dưới dạng **số nguyên âm** (như `-1400`) mới trả về đúng thông điệp lỗi chuẩn.
* C. Vì dấu trừ dùng để xóa lỗi đó khỏi bộ sưu tập `SQL%BULK_EXCEPTIONS`.
* D. Không cần dấu trừ, truyền số dương hay số âm vào `SQLERRM` đều cho kết quả giống hệt nhau.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là một chi tiết cực kỳ hay xuất hiện trong câu hỏi trắc nghiệm code của OCP 1Z0-149!
    * Khác với hàm `SQLCODE` (trả về số âm như `-1400`, `-1`), thuộc tính **`SQL%BULK_EXCEPTIONS(i).ERROR_CODE` lại lưu mã lỗi dưới dạng số nguyên dương không dấu** (`1400`, `1`).
    * Trong khi đó, hàm `SQLERRM(n)` đòi hỏi tham số `n` phải là số âm (trừ `+100` của `NO_DATA_FOUND`). Nếu bạn truyền số dương `SQLERRM(1400)`, nó sẽ trả về ` -1400: non-ORACLE exception`! Vì vậy bắt buộc phải đổi dấu thành âm: **`SQLERRM(-SQL%BULK_EXCEPTIONS(i).ERROR_CODE)`**.
  * **A, C, D sai:** Hai trường duy nhất của một phần tử `SQL%BULK_EXCEPTIONS(i)` là `.ERROR_INDEX` và `.ERROR_CODE`.
</details>

---

### Câu 14 (Question 14)
**Trong những tác vụ nào dưới đây bên trong một Stored Procedure, bạn BẮT BUỘC phải sử dụng Dynamic SQL (`EXECUTE IMMEDIATE` hoặc `DBMS_SQL`) thay vì viết câu lệnh SQL tĩnh thông thường? (Chọn 2 đáp án đúng)**

* A. Thực thi một câu lệnh DDL như `TRUNCATE TABLE temp_sales` hoặc `CREATE TABLE ...` bên trong thủ tục PL/SQL.
* B. Thực thi câu lệnh `SELECT` có tên bảng hoặc tên cột trong mệnh đề `WHERE` chỉ được truyền vào qua tham số `VARCHAR2` tại thời điểm chạy (Runtime).
* C. Thực thi câu lệnh `UPDATE` có giá trị lọc trong mệnh đề `WHERE` được truyền vào qua tham số của Procedure (`WHERE employee_id = p_emp_id`).
* D. Thực thi câu lệnh `COMMIT` hoặc `ROLLBACK` bên trong thủ tục.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B**
* **Giải thích chuyên sâu:**
  * **A đúng:** Trình biên dịch PL/SQL không hỗ trợ trực tiếp các câu lệnh **DDL (`CREATE`, `ALTER`, `DROP`, `TRUNCATE`)** hoặc **DCL (`GRANT`, `REVOKE`)** dưới dạng SQL tĩnh. Muốn chạy `TRUNCATE TABLE` trong PL/SQL, bắt buộc phải dùng `EXECUTE IMMEDIATE 'TRUNCATE TABLE temp_sales';`.
  * **B đúng:** Trong Static SQL, tên bảng và tên cột phải cố định ngay lúc biên dịch để trình biên dịch kiểm tra Data Dictionary. Nếu tên bảng/tên cột thay đổi linh hoạt lúc Runtime, bắt buộc phải dùng Dynamic SQL.
  * **C và D sai:** Static SQL hỗ trợ trực tiếp DML với biến PL/SQL (`WHERE employee_id = p_emp_id`) và hỗ trợ trực tiếp các lệnh TCL (`COMMIT`, `ROLLBACK`, `SAVEPOINT`).
</details>

---

### Câu 15 (Question 15)
**Câu lệnh `EXECUTE IMMEDIATE` nào dưới đây viết ĐÚNG cú pháp và thứ tự các mệnh đề để thực thi một câu truy vấn `SELECT` động có chứa biến liên kết (Bind Variable)?**

```sql
DECLARE
    v_sql    VARCHAR2(200) := 'SELECT salary FROM employees WHERE employee_id = :emp_id';
    v_sal    employees.salary%TYPE;
    v_id     NUMBER := 100;
BEGIN
    /* CHÈN CÂU LỆNH EXECUTE IMMEDIATE TẠI ĐÂY */
END;
```

* A. `EXECUTE IMMEDIATE v_sql USING v_id INTO v_sal;`
* B. `EXECUTE IMMEDIATE v_sql INTO v_sal USING v_id;`
* C. `EXECUTE IMMEDIATE 'SELECT salary FROM employees WHERE employee_id = :emp_id;' INTO v_sal USING v_id;`
* D. `EXECUTE IMMEDIATE v_sql RETURNING INTO v_sal USING v_id;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi kết hợp cả `INTO` (hoặc `BULK COLLECT INTO`) và `USING` trong câu lệnh `EXECUTE IMMEDIATE`, thứ tự bắt buộc luôn là:
    **`EXECUTE IMMEDIATE dynamic_string INTO variable_list USING bind_argument_list;`** (`INTO` đứng trước `USING`!).
  * **A sai:** Đặt `USING` trước `INTO` sẽ gây lỗi biên dịch `PLS-00103`.
  * **C sai:** Chuỗi câu lệnh SQL động (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE`) **không được phép có dấu chấm phẩy `;` ở cuối chuỗi** bên trong cặp dấu nháy đơn (sẽ gây lỗi Runtime `ORA-00911: invalid character`).
  * **D sai:** `RETURNING INTO` chỉ dùng cho các câu lệnh DML (`INSERT`, `UPDATE`, `DELETE`) có mệnh đề `RETURNING`, không dùng cho câu lệnh `SELECT`.
</details>

---

### Câu 16 (Question 16)
**Tại sao khối lệnh PL/SQL dưới đây lại gặp lỗi khi biên dịch và cách sửa đúng là gì?**

```sql
BEGIN
    EXECUTE IMMEDIATE 'UPDATE employees SET commission_pct = :1 WHERE employee_id = :2'
        USING NULL, 100;
END;
```

* A. Lỗi vì không được dùng số `:1`, `:2` làm tên Placeholder.
* B. Báo lỗi biên dịch `PLS-00457: expressions have to be of SQL types` vì không được truyền trực tiếp từ khóa hằng `NULL` (không có kiểu dữ liệu) vào mệnh đề `USING`; phải khai báo một biến kiểu `NUMBER` có giá trị `NULL` (`v_comm NUMBER := NULL;`) rồi truyền biến đó vào `USING v_comm, 100;`.
* C. Lỗi vì câu lệnh `UPDATE` bắt buộc phải có mệnh đề `INTO`.
* D. Lỗi vì thiếu dấu chấm phẩy `;` ở cuối chuỗi `UPDATE`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là bẫy rất nổi tiếng của `EXECUTE IMMEDIATE ... USING`: Từ khóa `NULL` đứng một mình là một untyped literal (không xác định được kiểu dữ liệu SQL là `NUMBER`, `VARCHAR2` hay `DATE`). Do đó, viết `USING NULL` trực tiếp sẽ bị trình biên dịch chặn lại với lỗi **`PLS-00457: expressions have to be of SQL types`**. Bạn bắt buộc phải truyền thông qua một biến đã khai báo kiểu dữ liệu (mang giá trị `NULL`).
  * **A, C, D sai:** Tên Placeholder trong chuỗi SQL động có thể đặt là `:1`, `:2` hoặc `:a`, `:b` tùy ý (vì SQL động gắn biến theo vị trí chứ không theo số thứ tự).
</details>

---

### Câu 17 (Question 17)
**Hãy so sánh số lượng đối số cần truyền trong mệnh đề `USING` giữa Câu lệnh 1 (Chuỗi SQL động) và Câu lệnh 2 (Khối PL/SQL động) khi cùng có 2 vị trí xuất hiện của Placeholder `:val`:**

```sql
-- Câu lệnh 1 (Dynamic SQL statement):
v_sql := 'UPDATE employees SET salary = :val, commission_pct = :val * 0.00001 WHERE employee_id = 100';

-- Câu lệnh 2 (Dynamic PL/SQL block):
v_plsql := 'BEGIN sp_test(:val, :val); END;';
```

* A. Cả Câu lệnh 1 và Câu lệnh 2 đều chỉ cần truyền 1 biến duy nhất (`USING v_num;`).
* B. Cả Câu lệnh 1 và Câu lệnh 2 đều bắt buộc phải truyền 2 biến (`USING v_num, v_num;`).
* C. Câu lệnh 1 (SQL động) gắn kết theo **Vị trí (By Position)** nên bắt buộc phải truyền **2 đối số** (`USING v_num, v_num;`); trong khi Câu lệnh 2 (Khối PL/SQL động `BEGIN ... END;`) gắn kết theo **Tên (By Name)** nên chỉ được truyền **1 đối số duy nhất** (`USING v_num;`).
* D. Câu lệnh 1 chỉ cần truyền 1 đối số, còn Câu lệnh 2 phải truyền 2 đối số.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Quy tắc liên kết biến (Bind Variable Association) của `EXECUTE IMMEDIATE` phụ thuộc vào loại câu lệnh trong chuỗi:
    1. **Nếu chuỗi là một câu lệnh SQL (`SELECT`, `INSERT`, `UPDATE`, `DELETE`):** Oracle liên kết các Placeholder thuần túy theo **VỊ TRÍ xuất hiện** (không quan tâm tên `:val` có trùng nhau hay không). Có 2 dấu `:val` thì bắt buộc phải truyền **2 đối số** trong `USING` (thiếu sẽ lỗi `ORA-01008: not all variables bound`).
    2. **Nếu chuỗi là một khối PL/SQL (`DECLARE ... BEGIN ... END;` hoặc `CALL ...`):** Oracle liên kết các Placeholder theo **TÊN định danh duy nhất**. Dù `:val` xuất hiện 2 hay 10 lần trong khối `BEGIN ... END;`, bạn **chỉ truyền đúng 1 đối số** cho tên `:val` đó trong `USING`!
  * **A, B, D sai:** Đây là câu hỏi phân loại cực kỳ sắc bén trong đề thi OCP 1Z0-149!
</details>

---

### Câu 18 (Question 18)
**Trong trường hợp nào sau đây bạn BẮT BUỘC phải sử dụng gói `DBMS_SQL` thay vì sử dụng `EXECUTE IMMEDIATE` (Native Dynamic SQL)?**

* A. Khi câu lệnh `SELECT` động trả về nhiều hơn 1 dòng dữ liệu.
* B. Khi câu lệnh SQL động là một câu lệnh DDL (`CREATE TABLE`).
* C. Khi thực thi Dynamic SQL Method 4 — tức là tại thời điểm viết code (Compile-time), bạn hoàn toàn **không biết trước số lượng cột** trong danh sách `SELECT` hoặc **không biết trước số lượng biến liên kết (Bind Variables)** cần truyền vào câu lệnh.
* D. Khi câu lệnh DML động có sử dụng mệnh đề `RETURNING INTO`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Với `EXECUTE IMMEDIATE` (hoặc `OPEN ref_cursor FOR`), danh sách các biến trong `INTO` và `USING` phải được viết cố định trong mã nguồn lúc biên dịch. Nếu số lượng cột cần lấy ra hoặc số lượng biến bind đầu vào thay đổi động tùy theo cấu hình lúc Runtime (**Dynamic SQL Method 4**), bạn bắt buộc phải dùng **`DBMS_SQL`** (với `DBMS_SQL.DESCRIBE_COLUMNS`, `DBMS_SQL.DEFINE_COLUMN`, `DBMS_SQL.BIND_VARIABLE` trong vòng lặp).
  * **A sai:** Truy vấn nhiều dòng hoàn toàn dùng được `EXECUTE IMMEDIATE ... BULK COLLECT INTO` hoặc `OPEN ref_cursor FOR`.
  * **B, D sai:** `EXECUTE IMMEDIATE` hỗ trợ tốt cả DDL và `RETURNING INTO`.
</details>

---

### Câu 19 (Question 19)
**Để phòng chống lỗ hổng bảo mật SQL Injection khi bắt buộc phải nối chuỗi tên bảng (`p_table_name`) vào một câu lệnh Dynamic SQL, hàm nào của gói `DBMS_ASSERT` sẽ kiểm tra xem chuỗi `p_table_name` có thực sự là tên của một đối tượng hợp lệ đang tồn tại trong Database hay không?**

* A. `DBMS_ASSERT.NOOP(p_table_name)`
* B. `DBMS_ASSERT.ENQUOTE_LITERAL(p_table_name)`
* C. `DBMS_ASSERT.SQL_OBJECT_NAME(p_table_name)`
* D. `DBMS_ASSERT.SCHEMA_NAME(p_table_name)`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Hàm **`DBMS_ASSERT.SQL_OBJECT_NAME(str)`** tra cứu trực tiếp trong Data Dictionary để xác nhận `str` là tên hợp lệ của một đối tượng cơ sở dữ liệu hiện đang tồn tại (nếu không tồn tại hoặc chứa mã độc SQL Injection, hàm lập tức ném lỗi **`ORA-44002: invalid object name`**).
  * **A sai:** `DBMS_ASSERT.NOOP` không thực hiện bất kỳ kiểm tra nào cả (No Operation).
  * **B sai:** `ENQUOTE_LITERAL` dùng cho hằng chuỗi giá trị nằm trong dấu nháy đơn `'...'`, không dùng cho tên bảng.
  * **D sai:** `SCHEMA_NAME` chỉ kiểm tra tên User/Schema (`ORA-44001`), không kiểm tra tên bảng.
</details>

---

### Câu 20 (Question 20)
**Sự khác biệt giữa hàm `DBMS_ASSERT.SIMPLE_SQL_NAME(str)` và hàm `DBMS_ASSERT.SQL_OBJECT_NAME(str)` là gì?**

* A. Không có sự khác biệt nào, hai hàm là bí danh của nhau.
* B. `SIMPLE_SQL_NAME` chỉ kiểm tra xem chuỗi `str` có tuân thủ quy tắc đặt tên định danh SQL cơ bản hay không (không chứa khoảng trắng, dấu chấm phẩy, toán tử...) mà **không kiểm tra** đối tượng đó có tồn tại trong Database hay không; trong khi `SQL_OBJECT_NAME` kiểm tra đối tượng phải **thực sự tồn tại** trong Database.
* C. `SIMPLE_SQL_NAME` dùng cho tên bảng, còn `SQL_OBJECT_NAME` chỉ dùng cho tên cột.
* D. `SIMPLE_SQL_NAME` tự động bọc chuỗi trong dấu ngoặc kép `"..."`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * **`SIMPLE_SQL_NAME`:** Chỉ kiểm tra cú pháp hình thức của một tên định danh SQL đơn giản (chữ cái, chữ số, `_`, `$`, `#`, hoặc nằm trong ngoặc kép hợp lệ). Ví dụ dùng để kiểm tra **tên cột (Column Name)** hoặc bí danh cột truyền vào mệnh đề `ORDER BY` (nếu sai cú pháp ném `ORA-44003`).
    * **`SQL_OBJECT_NAME`:** Kiểm tra tên đó phải là một Schema Object đang tồn tại thực tế trong Database (nếu không tồn tại ném `ORA-44002`).
  * **A, C, D sai:** Hàm tự động bọc tên định danh trong dấu ngoặc kép là `DBMS_ASSERT.ENQUOTE_NAME`.
</details>

---

### Câu 21 (Question 21)
**Cho bảng `TEST_LOG(msg VARCHAR2(50))` đang rỗng (0 dòng). Hãy xác định kết quả của đoạn mã sử dụng `PRAGMA AUTONOMOUS_TRANSACTION` dưới đây:**

```sql
DECLARE
    PROCEDURE sp_auto_log (p_msg VARCHAR2) IS
        PRAGMA AUTONOMOUS_TRANSACTION;
    BEGIN
        INSERT INTO test_log VALUES (p_msg);
        COMMIT;
    END sp_auto_log;
BEGIN
    INSERT INTO test_log VALUES ('Main Step 1');
    sp_auto_log('Autonomous Step 2');
    INSERT INTO test_log VALUES ('Main Step 3');
    ROLLBACK;
END;
/

SELECT msg FROM test_log;
```

* A. Bảng `TEST_LOG` không có dòng nào vì câu lệnh cuối cùng là `ROLLBACK;`.
* B. Bảng `TEST_LOG` có 2 dòng là `'Main Step 1'` và `'Autonomous Step 2'` (vì lệnh `COMMIT` trong `sp_auto_log` đã lưu luôn cả `'Main Step 1'`).
* C. Bảng `TEST_LOG` chỉ có duy nhất 1 dòng là `'Autonomous Step 2'`.
* D. Bảng `TEST_LOG` có cả 3 dòng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:**
    1. Giao dịch chính thực hiện `INSERT 'Main Step 1'` (chưa Commit).
    2. Khi gọi `sp_auto_log('Autonomous Step 2')`, vì thủ tục này có **`PRAGMA AUTONOMOUS_TRANSACTION;`**, giao dịch chính tạm dừng và một giao dịch con độc lập được mở ra.
    3. Lệnh `INSERT 'Autonomous Step 2'` và `COMMIT;` bên trong `sp_auto_log` **chỉ lưu bền vững riêng dòng `'Autonomous Step 2'`**, hoàn toàn **không commit** dòng `'Main Step 1'` của giao dịch chính!
    4. Khi quay về giao dịch chính, nó chạy tiếp `INSERT 'Main Step 3'` rồi gọi **`ROLLBACK;`**. Lệnh `ROLLBACK;` này hủy bỏ cả `'Main Step 1'` và `'Main Step 3'` của giao dịch chính, nhưng dòng **`'Autonomous Step 2'`** (đã được commit ở giao dịch độc lập) vẫn còn nguyên vẹn!
  * **A, B, D sai:** Đây chính là lý do `PRAGMA AUTONOMOUS_TRANSACTION` được ứng dụng để viết các thủ tục Audit Log và Error Log.
</details>

---

### Câu 22 (Question 22)
**Điều gì sẽ xảy ra khi thực thi thủ tục `sp_bad_auto` dưới đây?**

```sql
CREATE OR REPLACE PROCEDURE sp_bad_auto IS
    PRAGMA AUTONOMOUS_TRANSACTION;
BEGIN
    INSERT INTO test_log VALUES ('Testing without commit');
END sp_bad_auto;
/

BEGIN
    sp_bad_auto;
END;
```

* A. Dòng dữ liệu được tự động `COMMIT` khi thủ tục `sp_bad_auto` kết thúc.
* B. Dòng dữ liệu được gộp vào giao dịch chính bên ngoài để chờ giao dịch chính `COMMIT`.
* C. Thủ tục `sp_bad_auto` ném ra lỗi Runtime `ORA-06519: active autonomous transaction detected and rolled back` và tự động Rollback dòng vừa chèn, vì một giao dịch độc lập có phát sinh DML bắt buộc phải kết thúc tường minh bằng `COMMIT` hoặc `ROLLBACK` trước khi thoát khỏi thủ tục.
* D. Báo lỗi biên dịch ngay khi chạy lệnh `CREATE OR REPLACE PROCEDURE`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Quy tắc bắt buộc của `PRAGMA AUTONOMOUS_TRANSACTION`: Trước khi quyền điều khiển thoát khỏi đơn vị chương trình độc lập để quay về giao dịch chính, mọi giao dịch đang hoạt động trong đơn vị độc lập đó **bắt buộc phải được đóng lại tường minh bằng `COMMIT;` hoặc `ROLLBACK;`**! Nếu bạn thực hiện DML (`INSERT`) mà quên `COMMIT`/`ROLLBACK` trước khi kết thúc hàm, Oracle sẽ tự động rollback giao dịch con đó và ném lỗi Runtime **`ORA-06519: active autonomous transaction detected and rolled back`**.
  * **A, B, D sai:** Lúc biên dịch (`CREATE PROCEDURE`), trình biên dịch không báo lỗi vì lệnh `COMMIT` có thể nằm trong một thủ tục con được gọi bên trong; lỗi chỉ nổ lúc Runtime (`ORA-06519`).
</details>

---

### Câu 23 (Question 23)
**Ở vị trí nào sau đây bạn KHÔNG ĐƯỢC PHÉP khai báo chỉ thị `PRAGMA AUTONOMOUS_TRANSACTION;`?**

* A. Trong phần khai báo của một Stored Procedure hoặc Stored Function độc lập.
* B. Trong phần khai báo của một Database Trigger.
* C. Trong phần khai báo của toàn bộ một `PACKAGE SPECIFICATION` (để đánh dấu mọi hàm trong Package đều là Autonomous) hoặc trong một Khối vô danh lồng bên trong (Nested Anonymous Block).
* D. Trong phần khai báo của một Khối vô danh ở cấp cao nhất (Top-level Anonymous Block).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (Vị trí bị cấm):**
    1. Bạn **không thể** đặt `PRAGMA AUTONOMOUS_TRANSACTION;` ở cấp độ toàn bộ `PACKAGE` (sẽ gây lỗi biên dịch `PLS-00710: Pragma AUTONOMOUS_TRANSACTION cannot be declared here`); thay vào đó bạn phải đặt nó bên trong từng `PROCEDURE` hoặc `FUNCTION` cụ thể của Package Body!
    2. Đối với Anonymous Block: Chỉ có **Top-level Anonymous Block** (khối ngoài cùng) mới được phép dùng `PRAGMA AUTONOMOUS_TRANSACTION;`. Các khối vô danh lồng bên trong (**Nested Anonymous Blocks**) bị cấm sử dụng chỉ thị này!
  * **A, B, D sai:** Đều là các đơn vị chương trình hoàn toàn được phép khai báo `PRAGMA AUTONOMOUS_TRANSACTION;`.
</details>

---

### Câu 24 (Question 24)
**Quan sát đoạn mã dưới đây khi Giao dịch chính cập nhật một dòng trên bảng `EMPLOYEES` (chưa `COMMIT`), rồi gọi ngay một thủ tục `AUTONOMOUS_TRANSACTION` cũng cố gắng cập nhật chính dòng đó. Hiện tượng gì sẽ xảy ra?**

```sql
DECLARE
    PROCEDURE sp_auto_update IS
        PRAGMA AUTONOMOUS_TRANSACTION;
    BEGIN
        UPDATE employees SET salary = 9000 WHERE employee_id = 100;
        COMMIT;
    END;
BEGIN
    UPDATE employees SET salary = 8000 WHERE employee_id = 100;
    sp_auto_update;
    COMMIT;
END;
```

* A. Nhân viên 100 sẽ có mức lương cuối cùng là `8000`.
* B. Nhân viên 100 sẽ có mức lương cuối cùng là `9000`.
* C. Xảy ra tình trạng tự khóa chéo nhau (**Self-Deadlock**) và Oracle ném ra lỗi Runtime `ORA-00060: deadlock detected while waiting for resource`!
* D. Ném ra lỗi `ORA-06519`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:**
    1. Giao dịch chính chạy `UPDATE ... WHERE employee_id = 100;` $\rightarrow$ Đặt khóa độc quyền cấp dòng (Row Lock) lên dòng `employee_id = 100`.
    2. Giao dịch chính gọi `sp_auto_update` và chuyển sang trạng thái **Tạm dừng (Suspended)** để chờ `sp_auto_update` chạy xong.
    3. Bên trong `sp_auto_update` (là một giao dịch hoàn toàn độc lập!), nó cũng chạy `UPDATE ... WHERE employee_id = 100;` $\rightarrow$ Nó phải chờ Giao dịch chính nhả khóa trên dòng `100`!
    4. Giao dịch con chờ Giao dịch chính nhả khóa, trong khi Giao dịch chính lại đang tạm dừng chờ Giao dịch con kết thúc $\rightarrow$ Tạo thành vòng lặp chờ vô tận (**Self-Deadlock**)! Sau vài giây, Oracle phát hiện Deadlock và ném lỗi **`ORA-00060: deadlock detected while waiting for resource`**!
  * **A, B, D sai:** Đây là bẫy thực tế cực kỳ nguy hiểm khi lạm dụng `AUTONOMOUS_TRANSACTION` thao tác trên cùng bảng dữ liệu nghiệp vụ với giao dịch chính.
</details>

---

### Câu 25 (Question 25)
**Trong Oracle 11g trở lên, nếu một câu lệnh SQL động phức tạp đã được phân tích, gắn biến và thực thi bằng gói `DBMS_SQL` (với con trỏ `v_cur_id INTEGER := DBMS_SQL.OPEN_CURSOR;`), hàm nào cho phép bạn chuyển đổi con trỏ `v_cur_id` đó thành một biến `SYS_REFCURSOR` để trả về cho ứng dụng Client (Java/.NET)?**

* A. `v_ref_cur := DBMS_SQL.TO_REFCURSOR(v_cur_id);`
* B. `v_ref_cur := DBMS_SQL.CAST_TO_REFCURSOR(v_cur_id);`
* C. `v_ref_cur := DBMS_UTILITY.TO_REFCURSOR(v_cur_id);`
* D. `OPEN v_ref_cur FOR v_cur_id;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Gói `DBMS_SQL` cung cấp hai hàm cầu nối (Interoperability functions) cực kỳ hữu ích giữa `DBMS_SQL` và Native Dynamic SQL:
    1. **`DBMS_SQL.TO_REFCURSOR(cursor_number)`:** Chuyển một con trỏ `DBMS_SQL` (kiểu `INTEGER` đã được `PARSE`, `BIND_VARIABLE`, và **`EXECUTE`**) thành một biến Weak Ref Cursor (`SYS_REFCURSOR`) để có thể `FETCH` hoặc trả về cho ứng dụng Java/.NET Client. *(Lưu ý: Sau khi đã chuyển sang `SYS_REFCURSOR`, bạn không dùng `DBMS_SQL.CLOSE_CURSOR` nữa mà đóng bằng `CLOSE v_ref_cur;` hoặc để Client đóng).*
    2. **`DBMS_SQL.TO_CURSOR_NUMBER(ref_cursor)`:** Chuyển ngược từ một biến `REF CURSOR` đã mở sang số hiệu con trỏ `DBMS_SQL` (`INTEGER`) để có thể dùng `DBMS_SQL.DESCRIBE_COLUMNS` khảo sát cấu trúc các cột của `REF CURSOR` đó!
  * **B, C, D sai:** Đều là tên hàm hoặc cú pháp không tồn tại.
</details>

---
