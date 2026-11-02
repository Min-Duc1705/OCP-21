# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 2: Kiểu Dữ Liệu và Hàm Chuyển Đổi Trong Oracle

> **Tài liệu tham chiếu:** *OCA/OCP Oracle Database SQL Study Guide (Exam 1Z0-071) & Ngân hàng câu hỏi sát hạch CNTT VNPT*.  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết.  
> **Cách học:** Bạn hãy tự đọc đề và chọn đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và nắm vững bẫy thi.

---

### Câu 1 (Question 1)
**Câu lệnh tạo bảng nào dưới đây sẽ báo lỗi cú pháp khi thực thi trên Oracle Database?**

* A. `CREATE TABLE t1 (c1 CHAR);`
* B. `CREATE TABLE t2 (c1 NUMBER);`
* C. `CREATE TABLE t3 (c1 VARCHAR2);`
* D. `CREATE TABLE t4 (c1 TIMESTAMP);`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (Báo lỗi):** Trong Oracle SQL, kiểu dữ liệu `VARCHAR2(size)` (và `NVARCHAR2(size)`, `RAW(size)`) **bắt buộc phải khai báo độ dài tối đa `size`** (ví dụ `VARCHAR2(20)`). Nếu chỉ viết `VARCHAR2` mà không có ngoặc đơn chỉ định kích thước, Oracle sẽ báo lỗi `ORA-00906: missing left parenthesis`.
  * **A sai (Hợp lệ):** Kiểu `CHAR` nếu không khai báo kích thước sẽ tự động lấy giá trị mặc định là **`CHAR(1)`**.
  * **B sai (Hợp lệ):** Kiểu `NUMBER` không khai báo `(p, s)` sẽ lưu số thực dấu phẩy động với độ chính xác tối đa 38 chữ số.
  * **D sai (Hợp lệ):** Kiểu `TIMESTAMP` không khai báo `(p)` sẽ mặc định lấy độ chính xác phần lẻ giây là `TIMESTAMP(6)`.
</details>

---

### Câu 2 (Question 2)
**Cho bảng `TEST_PAD` có cột `col_char CHAR(5)` và cột `col_vchar VARCHAR2(5)`. Sau khi thực thi câu lệnh `INSERT INTO test_pad VALUES ('VN', 'VN');`, câu truy vấn nào dưới đây trả về kết quả đúng?**

```sql
SELECT LENGTH(col_char) AS len_c,
       LENGTH(col_vchar) AS len_v
FROM test_pad;
```

* A. `LEN_C = 2`, `LEN_V = 2`
* B. `LEN_C = 5`, `LEN_V = 2`
* C. `LEN_C = 5`, `LEN_V = 5`
* D. `LEN_C = 2`, `LEN_V = 5`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * `CHAR(5)` là kiểu dữ liệu chuỗi có **độ dài cố định (fixed-length)**. Khi chèn chuỗi `'VN'` (2 ký tự) vào cột `CHAR(5)`, Oracle tự động đệm thêm 3 khoảng trắng vào bên phải thành `'VN   '`, nên `LENGTH(col_char)` trả về **`5`**.
    * `VARCHAR2(5)` là kiểu dữ liệu chuỗi có **độ dài biến đổi (variable-length)**. Khi chèn `'VN'`, Oracle chỉ lưu đúng 2 ký tự `'VN'`, nên `LENGTH(col_vchar)` trả về **`2`**.
  * **A, C, D sai:** Không nắm được cơ chế tự động đệm khoảng trắng (*blank-padding*) của kiểu `CHAR`.
</details>

---

### Câu 3 (Question 3)
**Một cột `PRICE` trong bảng `PRODUCTS` được khai báo với kiểu dữ liệu `NUMBER(6, 2)`. Điều gì sẽ xảy ra khi bạn thực thi hai câu lệnh `INSERT` dưới đây?**

```sql
-- Lệnh 1:
INSERT INTO products (price) VALUES (1234.567);
-- Lệnh 2:
INSERT INTO products (price) VALUES (12345.6);
```

* A. Cả hai lệnh đều thành công; Lệnh 1 lưu `1234.57`, Lệnh 2 lưu `12345.60`.
* B. Cả hai lệnh đều thất bại và báo lỗi `ORA-01438` vì vượt quá độ chính xác cho phép.
* C. Lệnh 1 thành công và lưu giá trị `1234.57`; Lệnh 2 thất bại và báo lỗi `ORA-01438`.
* D. Lệnh 1 thất bại vì có 3 chữ số thập phân; Lệnh 2 thành công vì chỉ có 6 chữ số tất cả.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Với khai báo `NUMBER(6, 2)`:
    * Tổng số chữ số tối đa (`p`) là `6`, số chữ số phần thập phân (`s`) là `2`. Do đó, **số chữ số tối đa ở phần nguyên là `p - s = 6 - 2 = 4` chữ số**.
    * **Ở Lệnh 1 (`1234.567`):** Phần nguyên có 4 chữ số (`1234`) $\rightarrow$ Hợp lệ! Phần thập phân `.567` dài hơn `2` chữ số nên được Oracle **tự động làm tròn (round)** thành `.57`. Giá trị lưu vào DB là **`1234.57`**.
    * **Ở Lệnh 2 (`12345.6`):** Mặc dù tổng cộng chỉ có 6 chữ số, nhưng phần nguyên có tới **5 chữ số** (`12345` > 4), vượt quá giới hạn `p - s = 4` chữ số phần nguyên. Oracle lập tức ném lỗi `ORA-01438: value larger than specified precision allowed for this column`.
  * **A, B, D sai:** Đây là bẫy kinh điển: thí sinh thường đếm tổng số chữ số của `12345.6` thấy bằng 6 nên tưởng hợp lệ với `NUMBER(6, 2)`.
</details>

---

### Câu 4 (Question 4)
**Cột `POPULATION` trong bảng `CITIES` được khai báo với kiểu dữ liệu có Scale âm là `NUMBER(7, -3)`. Nếu bạn chèn giá trị `1234567.89` vào cột `POPULATION`, giá trị thực tế được lưu trong bảng sẽ là bao nhiêu?**

* A. `1234568`
* B. `1234000`
* C. `1235000`
* D. Báo lỗi vì tham số Scale (`s`) trong `NUMBER(p, s)` không được phép là số âm.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (`1235000`):** Trong Oracle, tham số `s` (Scale) của `NUMBER(p, s)` có thể nhận giá trị từ **`-84` đến `127`**. Khi `s` là một số âm (`-3`), Oracle sẽ **làm tròn sang bên trái dấu thập phân `3` hàng** (tức làm tròn đến hàng nghìn).
  * Với số `1234567.89`, chữ số hàng trăm là `5` (`567.89 >= 500`), nên khi làm tròn đến hàng nghìn sẽ tăng lên thành **`1235000`**.
  * **A sai:** Đây là kết quả của `NUMBER(7, 0)` hoặc `NUMBER(7)`.
  * **B sai:** Đây là kết quả cắt bỏ (`TRUNC`) chứ không phải làm tròn (`ROUND`).
  * **D sai:** Scale âm hoàn toàn hợp lệ trong Oracle SQL.
</details>

---

### Câu 5 (Question 5)
**Cột `RATIO` được khai báo là `NUMBER(2, 4)`. Giá trị nào dưới đây có thể được chèn (`INSERT`) thành công vào cột `RATIO` mà KHÔNG gây ra lỗi `ORA-01438`?**

* A. `12.3456`
* B. `0.12`
* C. `0.012`
* D. `0.0012`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng (`0.0012`):** Khi khai báo `NUMBER(p, s)` mà **`s > p`** (ở đây `p = 2, s = 4`):
    * `s = 4` quy định có 4 chữ số sau dấu thập phân.
    * Vì độ chính xác `p` chỉ cho phép tối đa `2` chữ số khác không (significant digits), nên **`s - p = 4 - 2 = 2` chữ số đầu tiên ngay sau dấu thập phân BẮT BUỘC phải là chữ số `0`**!
    * Do đó, giá trị tuyệt đối của số lưu vào phải nhỏ hơn `0.01`. Trong 4 đáp án, chỉ có `0.0012` có 2 số `0` sau dấu thập phân và 2 chữ số có nghĩa (`12`) là hợp lệ.
  * **A, B, C sai:** Đều vượt quá độ chính xác cho phép (`0.012` tương đương `0.0120` có 3 chữ số tính từ chữ số khác 0 đầu tiên đến vị trí thứ 4 thập phân, vượt quá `p = 2`).
</details>

---

### Câu 6 (Question 6)
**Phát biểu nào sau đây là ĐÚNG về kiểu dữ liệu `DATE` chuẩn trong Oracle Database?**

* A. Kiểu `DATE` chỉ lưu trữ Năm, Tháng, Ngày; nếu muốn lưu Giờ, Phút, Giây thì bắt buộc phải dùng kiểu `TIMESTAMP`.
* B. Kiểu `DATE` luôn lưu trữ đầy đủ 7 thông tin: Thế kỷ, Năm, Tháng, Ngày, Giờ, Phút, và Giây (nhưng không lưu phần lẻ của giây và không lưu múi giờ).
* C. Kiểu `DATE` lưu trữ cả phần lẻ của giây (microseconds) và độ lệch múi giờ (`TIME ZONE`).
* D. Bạn có thể cộng hai giá trị kiểu `DATE` với nhau (`date1 + date2`) để tính tổng thời gian.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khác với chuẩn ANSI SQL ở một số hệ CSDL khác, kiểu `DATE` trong Oracle luôn luôn chiếm 7 bytes và lưu trữ cả **Ngày lẫn Giờ** gồm: **Century, Year, Month, Day, Hour, Minute, Second**.
  * **A sai:** `DATE` đã có sẵn Giờ, Phút, Giây. `TIMESTAMP` chỉ mở rộng `DATE` để lưu thêm phần lẻ của giây (*fractional seconds*).
  * **C sai:** Lưu phần lẻ của giây là `TIMESTAMP`, lưu thêm múi giờ là `TIMESTAMP WITH TIME ZONE`.
  * **D sai:** Phép cộng hai giá trị `DATE` (`date1 + date2`) là vô nghĩa và sẽ báo lỗi `ORA-00975: date + date not allowed`. Bạn chỉ có thể trừ 2 `DATE` (`date1 - date2`) để lấy số ngày chênh lệch, hoặc cộng/trừ một số (`NUMBER`) vào `DATE`.
</details>

---

### Câu 7 (Question 7)
**Một ứng dụng thương mại điện tử toàn cầu cần lưu thời điểm đặt hàng (`ORDER_DATE`) sao cho khi khách hàng hoặc nhân viên ở bất kỳ quốc gia nào truy vấn, thời gian hiển thị sẽ tự động được quy đổi sang múi giờ phiên làm việc hiện tại (`SESSIONTIMEZONE`) của người đang xem. Bạn nên chọn kiểu dữ liệu nào cho cột `ORDER_DATE`?**

* A. `DATE`
* B. `TIMESTAMP`
* C. `TIMESTAMP WITH TIME ZONE`
* D. `TIMESTAMP WITH LOCAL TIME ZONE`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** `TIMESTAMP WITH LOCAL TIME ZONE` tự động chuẩn hóa giá trị thời gian về múi giờ của cơ sở dữ liệu (`DBTIMEZONE`) khi lưu xuống đĩa, và khi người dùng thực hiện `SELECT`, Oracle sẽ **tự động quy đổi giá trị đó sang múi giờ của phiên làm việc hiện tại (`SESSIONTIMEZONE`)** của người dùng đó.
  * **A, B sai:** Không có khả năng nhận biết hay chuyển đổi múi giờ.
  * **C sai:** `TIMESTAMP WITH TIME ZONE` lưu cứng độ lệch múi giờ lúc chèn vào dữ liệu và giữ nguyên múi giờ đó khi hiển thị cho mọi người dùng, chứ không tự động quy đổi sang `SESSIONTIMEZONE` của người xem.
</details>

---

### Câu 8 (Question 8)
**Câu truy vấn nào sau đây sử dụng đúng cú pháp hằng `INTERVAL` để cộng thêm một khoảng thời gian là "2 năm và 6 tháng" vào ngày hiện tại (`SYSDATE`)?**

```sql
-- Chọn câu lệnh chạy thành công trên Oracle Database:
```

* A. `SELECT SYSDATE + INTERVAL '2-6' YEAR TO MONTH FROM dual;`
* B. `SELECT SYSDATE + INTERVAL '2:6' YEAR TO MONTH FROM dual;`
* C. `SELECT SYSDATE + INTERVAL '2 6' DAY TO SECOND FROM dual;`
* D. `SELECT SYSDATE + INTERVAL '30' YEAR TO MONTH FROM dual;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Cú pháp chuẩn của hằng `INTERVAL YEAR TO MONTH` khi truyền cả năm và tháng là sử dụng dấu gạch ngang `-` nối giữa số năm và số tháng: `INTERVAL 'năm-tháng' YEAR TO MONTH` (ở đây là `INTERVAL '2-6' YEAR TO MONTH`).
  * **B sai:** Dấu hai chấm `:` dùng cho `HOUR TO MINUTE` / `DAY TO SECOND`, không dùng cho `YEAR TO MONTH`.
  * **C sai:** `'2 6'` với `DAY TO SECOND` thiếu định dạng giờ:phút:giây và mang ý nghĩa Ngày-Giờ chứ không phải Năm-Tháng.
  * **D sai:** Nếu chỉ truyền một con số `'30'`, bạn chỉ được viết `INTERVAL '30' MONTH` hoặc `INTERVAL '30' YEAR`, nếu dùng `YEAR TO MONTH` thì bắt buộc phải có định dạng `'Y-M'`.
</details>

---

### Câu 9 (Question 9)
**Tại sao câu lệnh dưới đây lại báo lỗi `ORA-01873: the leading precision of the interval is too small` khi thực thi?**

```sql
SELECT SYSDATE + INTERVAL '120' YEAR
FROM dual;
```

* A. Vì Oracle không cho phép cộng quá 100 năm vào kiểu `DATE`.
* B. Vì độ chính xác mặc định của phần `YEAR` trong `INTERVAL` là 2 chữ số (`YEAR(2)`), không chứa được số `120` (3 chữ số); phải viết là `INTERVAL '120' YEAR(3)`.
* C. Vì bắt buộc phải viết đầy đủ là `INTERVAL '120-0' YEAR TO MONTH`.
* D. Vì `SYSDATE` trả về kiểu `DATE` nên không thể cộng với kiểu `INTERVAL`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong cả `INTERVAL YEAR[(p)] TO MONTH` và `INTERVAL DAY[(p)] TO SECOND`, độ chính xác mặc định của thành phần dẫn đầu (`YEAR` hoặc `DAY`) là **`2` chữ số** (tức tối đa từ `00` đến `99`). Vì số `120` có **3 chữ số**, nó vượt quá giới hạn mặc định `YEAR(2)` và gây lỗi `ORA-01873`. Để chạy thành công, bạn phải khai báo tường minh độ chính xác là: `INTERVAL '120' YEAR(3)`.
  * **A, C, D sai:** Oracle hỗ trợ cộng `DATE` với `INTERVAL` lên tới hàng nghìn năm nếu khai báo đủ độ chính xác `YEAR(p)`.
</details>

---

### Câu 10 (Question 10)
**Trong Oracle Database, khi bạn cần lưu trữ nội dung các tài liệu văn bản JSON/XML hoặc bài viết có độ dài lên tới hàng trăm Megabytes ngay bên trong bảng dữ liệu (có hỗ trợ đầy đủ Transaction `COMMIT`/`ROLLBACK`), kiểu dữ liệu nào là phù hợp và được khuyến nghị nhất?**

* A. `VARCHAR2(4000)`
* B. `LONG`
* C. `CLOB`
* D. `BFILE`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** **`CLOB` (Character Large Object)** được thiết kế để lưu trữ dữ liệu văn bản dung lượng cực lớn (từ 8TB đến 128TB) ngay bên trong cơ sở dữ liệu, hỗ trợ đầy đủ giao dịch ACID và một bảng có thể chứa nhiều cột `CLOB`.
  * **A sai:** `VARCHAR2` chỉ lưu tối đa 4.000 bytes (hoặc 32.767 bytes ở chế độ EXTENDED), không thể lưu hàng trăm MB.
  * **B sai:** Kiểu `LONG` (tối đa 2GB, mỗi bảng chỉ tối đa 1 cột) đã bị Oracle đánh dấu **Deprecated** và khuyến cáo tuyệt đối không dùng cho bảng mới.
  * **D sai:** `BFILE` chỉ lưu con trỏ tới file nhị phân nằm ngoài hệ điều hành, chỉ đọc (Read-only) và không tham gia vào Transaction của Database.
</details>

---

### Câu 11 (Question 11)
**Trong Oracle SQL, kết quả của câu truy vấn dưới đây là gì?**

```sql
SELECT CASE WHEN '' IS NULL THEN 'YES_NULL' ELSE 'NOT_NULL' END AS check_empty,
       CASE WHEN ' ' IS NULL THEN 'YES_NULL' ELSE 'NOT_NULL' END AS check_space
FROM dual;
```

* A. `CHECK_EMPTY = 'NOT_NULL'`, `CHECK_SPACE = 'NOT_NULL'`
* B. `CHECK_EMPTY = 'YES_NULL'`, `CHECK_SPACE = 'YES_NULL'`
* C. `CHECK_EMPTY = 'YES_NULL'`, `CHECK_SPACE = 'NOT_NULL'`
* D. `CHECK_EMPTY = 'NOT_NULL'`, `CHECK_SPACE = 'YES_NULL'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:**
    * Trong Oracle Database, **chuỗi rỗng `''` (hai dấu nháy đơn sát nhau không có ký tự nào ở giữa) được coi là hoàn toàn tương đương với `NULL`**. Do đó biểu thức `'' IS NULL` trả về **`TRUE`**, in ra `'YES_NULL'`.
    * Ngược lại, chuỗi `' '` có chứa **1 ký tự khoảng trắng (ASCII 32)** nên nó có độ dài là `1` và **KHÔNG PHẢI là `NULL`**. Biểu thức `' ' IS NULL` trả về **`FALSE`**, in ra `'NOT_NULL'`.
  * **A, B, D sai:** Nhầm lẫn quy tắc chuỗi rỗng `''` của Oracle với các hệ quản trị CSDL khác như MySQL hay PostgreSQL.
</details>

---

### Câu 12 (Question 12)
**Cho nhân viên có `salary = 10000`, `commission_pct = NULL` và `first_name = 'Steven'`. Kết quả của câu truy vấn dưới đây là gì?**

```sql
SELECT salary + (salary * commission_pct) AS total_income,
       'Emp: ' || first_name || commission_pct AS emp_label
FROM employees
WHERE employee_id = 100;
```

* A. `TOTAL_INCOME = 10000`, `EMP_LABEL = 'Emp: Steven'`
* B. `TOTAL_INCOME = NULL`, `EMP_LABEL = 'Emp: Steven'`
* C. `TOTAL_INCOME = NULL`, `EMP_LABEL = NULL`
* D. `TOTAL_INCOME = 10000`, `EMP_LABEL = 'Emp: StevenNULL'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Câu hỏi này kiểm tra sự đối lập giữa phép toán số học và phép nối chuỗi khi gặp `NULL`:
    1. **Phép toán số học (`+`, `-`, `*`, `/`):** Bất kỳ phép tính số học nào chứa toán hạng `NULL` đều trả về **`NULL`**. Do đó: `10000 + (10000 * NULL)` = `10000 + NULL` = **`NULL`**.
    2. **Phép nối chuỗi (`||`):** Trong Oracle, toán tử nối chuỗi `||` bỏ qua `NULL` (coi `NULL` như chuỗi rỗng không có ký tự). Do đó `'Emp: ' || 'Steven' || NULL` trả về **`'Emp: Steven'`**.
  * **A, C, D sai:** Nếu muốn `TOTAL_INCOME` trả về `10000`, lập trình viên phải dùng hàm `NVL(commission_pct, 0)`.
</details>

---

### Câu 13 (Question 13)
**Giả sử bảng `SUBSCRIBERS` có 30 triệu dòng. Cột `MSISDN` (số thuê bao) có kiểu dữ liệu `VARCHAR2(15)` và đã được tạo một B-Tree Index tên là `IDX_SUB_MSISDN`. Tại sao câu truy vấn dưới đây lại chạy rất chậm (thực hiện Full Table Scan thay vì dùng Index `IDX_SUB_MSISDN`)?**

```sql
SELECT sub_id, sub_name
FROM subscribers
WHERE msisdn = 84912345678;
```

* A. Vì Oracle không hỗ trợ B-Tree Index trên các cột có kiểu dữ liệu `VARCHAR2`.
* B. Vì khi so sánh cột `VARCHAR2` với hằng số `NUMBER`, Oracle tự động ép kiểu ngầm định thành `TO_NUMBER(msisdn) = 84912345678`, làm vô hiệu hóa B-Tree Index trên cột `msisdn`.
* C. Vì số `84912345678` vượt quá giới hạn của kiểu `NUMBER` nên không dùng được Index.
* D. Vì mệnh đề `SELECT` không chọn cột `msisdn` nên Index không được kích hoạt.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Theo ma trận độ ưu tiên kiểu dữ liệu (Data Type Precedence) của Oracle, **`NUMBER` có độ ưu tiên cao hơn `VARCHAR2`**. Khi gặp biểu thức `msisdn = 84912345678`, Oracle sẽ tự động chuyển đổi kiểu dữ liệu của cột `VARCHAR2` sang `NUMBER` bằng cách biến điều kiện lọc thành:
    `WHERE TO_NUMBER(msisdn) = 84912345678`.
    Vì cột `msisdn` bị bọc trong hàm `TO_NUMBER()`, bộ tối ưu hóa (CBO) không thể tra cứu trên cây B-Tree Index `IDX_SUB_MSISDN` (vốn được sắp xếp theo thứ tự chuỗi ký tự), dẫn đến phải quét toàn bộ bảng (**Full Table Scan**). Ngoài ra, nếu trong bảng có dòng nào chứa ký tự không phải số (như `'+84...'`), câu lệnh sẽ báo lỗi `ORA-01722: invalid number`.
  * **A, C, D sai:** Để sử dụng được Index, chỉ cần thêm dấu nháy đơn: `WHERE msisdn = '84912345678'`.
</details>

---

### Câu 14 (Question 14)
**Biểu thức nào dưới đây thực hiện chuyển đổi kiểu dữ liệu ngầm định (Implicit Conversion) THÀNH CÔNG trên Oracle Database?**

```sql
-- Giả sử tham số NLS_DATE_FORMAT hiện tại là 'DD-MON-RR'
```

* A. `SELECT '150.5' + 49.5 FROM dual;`
* B. `SELECT '$150' + 50 FROM dual;`
* C. `SELECT '150,000' + 100 FROM dual;`
* D. `SELECT SYSDATE + '01-JAN-26' FROM dual;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Trong phép cộng `'150.5' + 49.5`, toán tử `+` yêu cầu toán hạng số, và chuỗi `'150.5'` chỉ chứa các chữ số và dấu chấm thập phân hợp lệ nên Oracle tự động chuyển ngầm định `'150.5'` thành số `150.5` và trả về kết quả **`200`**.
  * **B và C sai:** Chuỗi chứa ký hiệu tiền tệ `'$'` hoặc dấu phẩy ngăn cách hàng nghìn `','` **không thể** chuyển đổi ngầm định sang `NUMBER` (sẽ báo lỗi `ORA-01722: invalid number`). Với các chuỗi có định dạng này, bắt buộc phải dùng hàm tường minh `TO_NUMBER('$150', '$999')`.
  * **D sai:** Không thể cộng một ngày (`SYSDATE`) với một chuỗi ngày (`'01-JAN-26'`), Oracle sẽ cố ép `'01-JAN-26'` thành `NUMBER` để cộng số ngày vào `SYSDATE` và văng lỗi `ORA-01722: invalid number`.
</details>

---

### Câu 15 (Question 15)
**Giả sử năm hiện tại trên máy chủ Oracle Database là `2026`. Hãy cho biết kết quả của câu truy vấn dưới đây:**

```sql
SELECT TO_CHAR(TO_DATE('27-OCT-98', 'DD-MON-RR'), 'YYYY') AS year_rr,
       TO_CHAR(TO_DATE('27-OCT-98', 'DD-MON-YY'), 'YYYY') AS year_yy,
       TO_CHAR(TO_DATE('27-OCT-15', 'DD-MON-RR'), 'YYYY') AS year_rr2
FROM dual;
```

* A. `YEAR_RR = '1998'`, `YEAR_YY = '2098'`, `YEAR_RR2 = '2015'`
* B. `YEAR_RR = '2098'`, `YEAR_YY = '1998'`, `YEAR_RR2 = '2015'`
* C. `YEAR_RR = '1998'`, `YEAR_YY = '1998'`, `YEAR_RR2 = '1915'`
* D. `YEAR_RR = '2098'`, `YEAR_YY = '2098'`, `YEAR_RR2 = '2015'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Năm hiện tại là **`2026`** (2 chữ số cuối là `26`, nằm trong nửa đầu thế kỷ `00–49`):
    1. Với định dạng **`RR`** và năm nhập vào là `98` (thuộc nửa sau `50–99`): Quy tắc `RR` lấy **thế kỷ trước (`19xx`)**, nên kết quả `YEAR_RR` là **`'1998'`**.
    2. Với định dạng **`YY`** và năm nhập vào là `98`: Quy tắc `YY` **luôn luôn lấy thế kỷ hiện tại (`20xx`)**, nên kết quả `YEAR_YY` là **`'2098'`**.
    3. Với định dạng **`RR`** và năm nhập vào là `15` (thuộc nửa đầu `00–49`): Quy tắc `RR` lấy **cùng thế kỷ hiện tại (`20xx`)**, nên kết quả `YEAR_RR2` là **`'2015'`**.
  * **B, C, D sai:** Nhầm lẫn ma trận thế kỷ của định dạng `RR` và `YY`.
</details>

---

### Câu 16 (Question 16)
**Giả sử trong tương lai, năm hiện tại của hệ thống là `2052` (2 chữ số cuối là `52`, thuộc khoảng `50–99`). Khi đó, biểu thức `TO_CHAR(TO_DATE('10-JAN-15', 'DD-MON-RR'), 'YYYY')` sẽ trả về năm nào?**

* A. `'1915'`
* B. `'2015'`
* C. `'2115'`
* D. `'2052'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (`'2115'`):** Theo bảng quy tắc định dạng `RR`:
    * Khi 2 chữ số cuối của năm hiện tại nằm trong khoảng **`50–99`** (ví dụ năm `2052`), và 2 chữ số của năm đưa vào nằm trong khoảng **`00–49`** (ở đây là `'15'`), thì thế kỷ trả về sẽ là **thế kỷ TIẾP THEO (`21xx`)**, tức năm **`2115`**.
  * **A, B, D sai:** Nếu năm nhập vào thuộc khoảng `50–99` (ví dụ `'85'`) trong năm hiện tại `2052`, thì kết quả mới là cùng thế kỷ `'2085'`.
</details>

---

### Câu 17 (Question 17)
**Khi thực thi câu lệnh SQL dưới đây, kết quả trả về sẽ là gì?**

```sql
SELECT TO_CHAR(DATE '2026-05-03', 'fmMonth DD, YYYY') AS formatted_date
FROM dual;
```

* A. `'May       03, 2026'`
* B. `'May 03, 2026'`
* C. `'May 3, 2026'`
* D. `'MAY 3, 2026'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (`'May 3, 2026'`):**
    * Bổ từ **`fm` (Fill Mode)** đặt ở đầu mẫu định dạng có hai tác dụng đồng thời:
      1. Xóa toàn bộ khoảng trắng đệm ở cuối tên tháng `Month` (`'May      '` thành `'May'`).
      2. Xóa các chữ số `0` đứng đầu (leading zeroes) của ngày `DD` (`'03'` thành `'3'`).
    * Vì mẫu viết là `'Month'` (chữ M hoa, các chữ sau viết thường) nên kết quả hiển thị kiểu Initcap là `'May'`.
  * **A sai:** Đây là kết quả khi **không có** bổ từ `fm`.
  * **B sai:** Quên rằng `fm` cũng loại bỏ số `0` đứng trước của `DD` (`03` $\rightarrow$ `3`).
  * **D sai:** Chỉ in hoa toàn bộ `'MAY'` khi mẫu định dạng viết hoa là `'MONTH'`.
</details>

---

### Câu 18 (Question 18)
**Trong câu lệnh `TO_CHAR` định dạng ngày giờ dưới đây, tại sao kết quả của ngày (`DD`) lại hiển thị lại số `0` ở đầu là `'03'`?**

```sql
SELECT TO_CHAR(DATE '2026-05-03', 'fmMonth fmDD, YYYY') AS result
FROM dual;
```

* A. Vì `fm` không bao giờ có tác dụng lên phần tử `DD`.
* B. Vì bổ từ `fm` hoạt động như một công tắc bật/tắt (toggle): chữ `fm` thứ nhất bật chế độ Fill Mode cho `Month`, và chữ `fm` thứ hai TẮT chế độ Fill Mode từ `DD` trở đi!
* C. Vì câu lệnh có hai chữ `fm` nên Oracle bỏ qua cả hai chữ `fm`.
* D. Câu lệnh báo lỗi cú pháp vì không được viết `fm` hai lần trong cùng một chuỗi định dạng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là câu hỏi phân loại mức độ OCP rất thú vị trong tài liệu Oracle: Bổ từ **`FM` hoạt động theo cơ chế công tắc đảo trạng thái (Toggle Switch)** trong cùng một chuỗi format model:
    * Chữ `fm` đầu tiên trước `Month`: **BẬT** Fill Mode $\rightarrow$ `'May'` không bị đệm khoảng trắng.
    * Chữ `fm` thứ hai trước `DD`: **TẮT** Fill Mode $\rightarrow$ `DD` quay về chế độ mặc định có số `0` đứng đầu (`'03'`). Kết quả trả về là **`'May 03, 2026'`**.
  * **A, C, D sai:** Hiểu rõ cơ chế toggle của `FM` giúp bạn xử lý chính xác các yêu cầu vừa muốn cắt khoảng trắng của `Month`, vừa muốn giữ số `0` ở đầu của `DD`!
</details>

---

### Câu 19 (Question 19)
**Kết quả của câu truy vấn định dạng số dưới đây là gì?**

```sql
SELECT TO_CHAR(12345.67, '$9,999.99') AS formatted_num
FROM dual;
```

* A. `'$12,345.67'`
* B. `'$2,345.67'`
* C. `'##########'`
* D. Báo lỗi `ORA-01481: invalid number format model`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (`'##########'`):**
    * Số cần định dạng là `12345.67` có **5 chữ số ở phần nguyên** (`12345`).
    * Tuy nhiên, mẫu định dạng `'$9,999.99'` chỉ cung cấp **4 vị trí chữ số `9` ở phần nguyên**.
    * Khi số chữ số phần nguyên vượt quá số lượng ký tự định dạng cho phép, hàm `TO_CHAR` **không báo lỗi**, cũng không cắt bớt số, mà trả về một chuỗi gồm toàn các dấu thăng **`'##########'`** để cảnh báo tràn độ rộng hiển thị.
  * **A, B, D sai:** Lưu ý nếu tràn ở phần thập phân (ví dụ `TO_CHAR(123.456, '999.99')`), Oracle sẽ tự động **làm tròn** phần thập phân thành `' 123.46'`, chỉ khi tràn ở **phần nguyên** mới biến thành `'####'`.
</details>

---

### Câu 20 (Question 20)
**Kết quả trả về của câu lệnh SQL dưới đây là gì?**

```sql
SELECT TO_CHAR(DATE '2026-03-02', 'Ddspth "of" fmMonth') AS date_in_words
FROM dual;
```

* A. `'Second of March'`
* B. `'2nd of March'`
* C. `'Two of March'`
* D. Báo lỗi vì không được phép dùng từ `"of"` bên trong chuỗi định dạng ngày.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng (`'Second of March'`):**
    * `Dd`: Ngày trong tháng (`02`), viết hoa chữ cái đầu (Initcap).
    * `sp` (*Spelled out*): Đánh vần con số bằng chữ tiếng Anh (`Two`).
    * `th` (*Ordinal*): Chuyển thành số thứ tự (`Second`). Kết hợp `Ddspth` (hoặc `Ddthsp`) cho ngày `02` sẽ trả về **`'Second'`**.
    * `"of"`: Chuỗi ký tự tĩnh đặt trong dấu nháy kép `"..."` được in nguyên văn ra kết quả.
    * `fmMonth`: Tên tháng có chữ cái đầu viết hoa và đã xóa khoảng trắng thừa $\rightarrow$ **`'March'`**.
  * **B sai:** `'2nd'` là kết quả của `'fmDDth'`, không có `sp`.
  * **C sai:** `'Two'` là kết quả của `'Ddsp'`, không có `th`.
  * **D sai:** Oracle cho phép nhúng chuỗi văn bản tĩnh đặt trong cặp dấu nháy kép `"..."` vào bên trong format model của `TO_CHAR` / `TO_DATE`.
</details>

---

### Câu 21 (Question 21)
**Để chuyển đổi chuỗi ký tự `'$12,500.50'` sang kiểu dữ liệu `NUMBER` nhằm thực hiện tính toán số học, câu lệnh nào dưới đây là ĐÚNG?**

* A. `SELECT CAST('$12,500.50' AS NUMBER) FROM dual;`
* B. `SELECT TO_NUMBER('$12,500.50') FROM dual;`
* C. `SELECT TO_NUMBER('$12,500.50', '$99,999.99') FROM dual;`
* D. `SELECT TO_CHAR('$12,500.50', '99999.99') FROM dual;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Vì chuỗi đầu vào `'$12,500.50'` có chứa ký hiệu tiền tệ `$` và dấu phẩy phân cách hàng nghìn `,`, bạn **bắt buộc** phải sử dụng hàm `TO_NUMBER(char, 'format_model')` với mẫu định dạng khớp các ký hiệu đó (`'$99,999.99'`) để Oracle phân tích thành số `12500.5`.
  * **A và B sai:** Cả `CAST('$12,500.50' AS NUMBER)` và `TO_NUMBER('$12,500.50')` không có format model đều sẽ văng lỗi `ORA-01722: invalid number` do gặp ký tự `$` và `,`.
  * **D sai:** `TO_CHAR` dùng để chuyển sang chuỗi chứ không chuyển chuỗi định dạng tiền tệ sang số.
</details>

---

### Câu 22 (Question 22)
**Hàm `CAST` chuẩn ANSI nào dưới đây là HỢP LỆ trong Oracle SQL? (Chọn tất cả các đáp án đúng)**

* A. `SELECT CAST('2500.75' AS NUMBER(6, 1)) FROM dual;`
* B. `SELECT CAST(SYSDATE AS TIMESTAMP) FROM dual;`
* C. `SELECT CAST(12345 AS DATE) FROM dual;`
* D. `SELECT CAST(98765 AS VARCHAR2(10)) FROM dual;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B, D**
* **Giải thích chuyên sâu:**
  * **A đúng:** `CAST('2500.75' AS NUMBER(6, 1))` chuyển chuỗi số hợp lệ sang `NUMBER(6, 1)` và tự động làm tròn phần thập phân thành `2500.8`.
  * **B đúng:** `CAST(SYSDATE AS TIMESTAMP)` chuyển giá trị `DATE` sang `TIMESTAMP` (thêm phần lẻ của giây `.000000`).
  * **D đúng:** `CAST(98765 AS VARCHAR2(10))` chuyển số `98765` sang chuỗi `'98765'`.
  * **C sai:** Trong Oracle SQL, **không thể** chuyển đổi trực tiếp giữa kiểu `NUMBER` và kiểu `DATE` bằng `CAST` (sẽ báo lỗi `ORA-00932: inconsistent datatypes: expected DATE got NUMBER`).
</details>

---

### Câu 23 (Question 23)
**Cho bảng `EVENTS` có cột `START_TIME` và `END_TIME` đều thuộc kiểu dữ liệu `DATE`. Khi thực hiện phép trừ `END_TIME - START_TIME`, kiểu dữ liệu của kết quả trả về là gì? Và kết quả của phép trừ này nếu cả hai cột đều thuộc kiểu `TIMESTAMP` là gì?**

* A. Cả hai phép trừ đều trả về kiểu `NUMBER` (số ngày).
* B. Cả hai phép trừ đều trả về kiểu `INTERVAL DAY TO SECOND`.
* C. `DATE - DATE` trả về kiểu `NUMBER` (số ngày chênh lệch); còn `TIMESTAMP - TIMESTAMP` trả về kiểu `INTERVAL DAY TO SECOND`.
* D. `DATE - DATE` trả về kiểu `INTERVAL DAY TO SECOND`; còn `TIMESTAMP - TIMESTAMP` trả về kiểu `NUMBER`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là điểm khác biệt cực kỳ quan trọng thường được hỏi trong kỳ thi 1Z0-071:
    1. Khi lấy **`DATE - DATE`**, kết quả trả về là một con số thuộc kiểu **`NUMBER`** biểu thị số ngày chênh lệch (ví dụ `1.5` nghĩa là 1 ngày và 12 giờ).
    2. Khi lấy **`TIMESTAMP - TIMESTAMP`**, kết quả trả về KHÔNG PHẢI là `NUMBER`, mà là một giá trị thuộc kiểu **`INTERVAL DAY TO SECOND`** (ví dụ `+000000001 12:00:00.000000`).
  * **A, B, D sai:** Không phân biệt được kiểu trả về của phép trừ trên `DATE` so với `TIMESTAMP`.
</details>

---

### Câu 24 (Question 24)
**Cơ sở dữ liệu Oracle đang được cấu hình với bộ mã ký tự `AL32UTF8` (UTF-8, trong đó ký tự tiếng Việt có dấu chiếm từ 2 đến 3 bytes) và tham số `NLS_LENGTH_SEMANTICS = BYTE`. Một lập trình viên tạo bảng với cột `FULL_NAME VARCHAR2(10)`. Phát biểu nào sau đây là ĐÚNG?**

* A. Cột `FULL_NAME` luôn lưu được đúng 10 ký tự bất kỳ, kể cả 10 chữ cái tiếng Việt có dấu như `'Nguyễn Văn'`.
* B. Vì mặc định tính theo `BYTE`, cột `FULL_NAME` chỉ chứa được tối đa 10 bytes, nên chuỗi `'Nguyễn Văn'` (nhiều hơn 10 bytes) sẽ gây lỗi `ORA-12899: value too large for column`.Để lưu chắc chắn 10 ký tự, nên khai báo là `VARCHAR2(10 CHAR)`.
* C. Oracle sẽ tự động cắt bớt chuỗi `'Nguyễn Văn'` cho vừa 10 bytes và lưu vào bảng mà không báo lỗi.
* D. Bộ mã `AL32UTF8` không cho phép dùng kiểu `VARCHAR2`, bắt buộc phải dùng `NVARCHAR2`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi `NLS_LENGTH_SEMANTICS` là `BYTE` (mặc định của Oracle), khai báo `VARCHAR2(10)` tương đương với `VARCHAR2(10 BYTE)`. Trong bảng mã UTF-8 (`AL32UTF8`), chữ `'ễ'` chiếm 3 bytes, chữ `'ă'` chiếm 2 bytes, nên chuỗi `'Nguyễn Văn'` dù chỉ có 10 ký tự nhưng chiếm tới **13 bytes** (> 10 bytes) và sẽ bị chặn với lỗi `ORA-12899`. Để quy định độ dài theo số lượng ký tự không phụ thuộc số byte mỗi ký tự, lập trình viên cần khai báo tường minh `VARCHAR2(10 CHAR)`.
  * **A sai:** Chỉ đúng khi khai báo `VARCHAR2(10 CHAR)` hoặc `NVARCHAR2(10)`.
  * **C sai:** Oracle không bao giờ tự động cắt chuỗi khi vượt độ dài cột mà luôn báo lỗi `ORA-12899`.
  * **D sai:** `VARCHAR2` trên `AL32UTF8` hỗ trợ đầy đủ Unicode.
</details>

---

### Câu 25 (Question 25)
**Khi sử dụng hàm `TO_CHAR` để định dạng thời gian của một giá trị `DATE`, mẫu định dạng nào dưới đây là ĐÚNG để hiển thị "Giờ (hệ 24h) : Phút : Giây"?**

* A. `'HH24:MM:SS'`
* B. `'HH24:MI:SS'`
* C. `'HH:MI:SS'`
* D. `'24HH:MI:SS'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng (`'HH24:MI:SS'`):** Trong Oracle SQL, ký hiệu định dạng cho **Giờ hệ 24h** là `HH24`, cho **Phút** là **`MI`**, và cho **Giây** là `SS`.
  * **A sai (Bẫy kinh điển):** Ký hiệu `MM` trong Oracle luôn luôn đại diện cho **Tháng (Month `01`–`12`)**, không phải Phút! Nếu viết `'HH24:MM:SS'`, Oracle vẫn chạy mà không báo lỗi nhưng ở vị trí phút sẽ in ra con số của **Tháng hiện tại**!
  * **C sai:** `HH` (tương đương `HH12`) chỉ hiển thị giờ theo hệ 12 giờ (`01`–`12`), không phải hệ 24 giờ.
  * **D sai:** Sai tên phần tử định dạng (`24HH` không tồn tại, sẽ báo lỗi `ORA-01821: date format not recognized`).
</details>
