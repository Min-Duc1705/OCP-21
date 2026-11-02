# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 5: Các Hàm SQL Thông Dụng (Single-Row Functions)

> **Mục tiêu:** Đánh giá toàn diện kiến thức Chương 5 (Hàm chuỗi, Hàm số, Hàm ngày tháng, Xử lý `NULL`, `CASE WHEN` & `DECODE`) theo chuẩn đề thi **Oracle Database SQL (1Z0-071)** và kỳ thi sát hạch **VNPT**.  
> **Số lượng:** 25 câu hỏi trắc nghiệm kèm đáp án và phân tích chuyên sâu.  
> **Cách học:** Hãy tự phân tích và chọn đáp án trước khi bấm vào **"👉 Xem Đáp Án & Giải Thích Chi Tiết"**.

---

### Câu 1 (Question 1)
**Kết quả trả về của câu lệnh SQL sau đây là gì?**

```sql
SELECT INITCAP('ngUYEN_vAn-a#12b c$d') AS result FROM dual;
```

* A. `Nguyen_van-a#12b C$d`
* B. `Nguyen_Van-A#12b C$D`
* C. `Nguyen_Van-A#12B C$D`
* D. `Nguyen_van-a#12B C$d`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Hàm `INITCAP` viết hoa ký tự đầu tiên của mỗi từ (word) và viết thường các ký tự còn lại. Trong Oracle SQL, một "từ" là chuỗi các ký tự chữ hoặc số (alphanumeric) liên tiếp; mọi ký tự không phải chữ và số (như `_`, `-`, `#`, khoảng trắng, `$`) đều đóng vai trò là dấu phân cách từ:
    * `'ngUYEN'` $\rightarrow$ `'Nguyen'`
    * Sau `_` là `'vAn'` $\rightarrow$ `'Van'`
    * Sau `-` là `'a'` $\rightarrow$ `'A'`
    * Sau `#` là từ `'12b'`: ký tự đầu tiên của từ này là chữ số `'1'`, nên chữ cái `'b'` phía sau là ký tự thứ 3 của từ và bị chuyển thành chữ thường $\rightarrow$ `'12b'`.
    * Sau khoảng trắng là `'c'`, sau `$` là `'d'` $\rightarrow$ `'C$D'`.
  * **A, C, D sai:** Sai ở quy tắc nhận diện dấu phân cách từ (`_`, `-`, `$`) hoặc hiểu nhầm chữ `'b'` sau số `'12'` được viết hoa.
</details>

---

### Câu 2 (Question 2)
**Thực thi câu lệnh SQL dưới đây sẽ cho kết quả nào?**

```sql
SELECT SUBSTR('ORACLE_21C_SQL', 0, 6) AS s1,
       SUBSTR('ORACLE_21C_SQL', -3, 2) AS s2
FROM dual;
```

* A. `S1 = NULL`, `S2 = 'SQ'`
* B. `S1 = 'ORACLE'`, `S2 = 'LS'`
* C. `S1 = 'ORACLE'`, `S2 = 'SQ'`
* D. Câu lệnh báo lỗi do vị trí bắt đầu trong `SUBSTR` không được bằng `0`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:**
    * Trong hàm `SUBSTR(string, position, length)`, khi `position = 0`, Oracle tự động xử lý giống hệt như `position = 1`. Do đó `SUBSTR('ORACLE_21C_SQL', 0, 6)` lấy 6 ký tự đầu tiên là `'ORACLE'`.
    * Khi `position = -3`, Oracle đếm lùi 3 ký tự từ cuối chuỗi lên (chữ `'S'` trong `'SQL'`), sau đó luôn cắt sang bên phải 2 ký tự, thu được `'SQ'`.
  * **A, B, D sai:** Vị trí `0` hoàn toàn hợp lệ trong `SUBSTR` và hướng cắt chuỗi luôn từ trái sang phải (không bao giờ cắt ngược thành `'LS'`).
</details>

---

### Câu 3 (Question 3)
**Cho chuỗi `'MISSISSIPPI'`. Câu lệnh SQL dưới đây trả về giá trị bao nhiêu?**

```sql
SELECT INSTR('MISSISSIPPI', 'IS', -2, 2) AS pos FROM dual;
```

* A. `2`
* B. `5`
* C. `6`
* D. `0`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Chuỗi `'MISSISSIPPI'` có độ dài 11 ký tự, trong đó `'IS'` xuất hiện tại vị trí `2` (`M[IS]SISSIPPI`) và vị trí `5` (`MISS[IS]SIPPI`).
    * Tham số `position = -2`: Bắt đầu đứng tại ký tự thứ 2 tính từ cuối chuỗi (tức chữ `'P'` ở vị trí 10) và **quét ngược từ phải sang trái**.
    * Tham số `occurrence = 2`: Tìm lần xuất hiện thứ 2 khi quét từ phải sang trái. Lần gặp `'IS'` đầu tiên (từ phải sang) là ở vị trí `5`, và lần gặp thứ 2 là ở vị trí **`2`**. Lưu ý: giá trị trả về của `INSTR` luôn đếm từ đầu chuỗi bên trái (1-based).
  * **B, C, D sai:** `5` là lần xuất hiện thứ nhất khi quét ngược từ phải sang trái; `2` mới là lần xuất hiện thứ hai.
</details>

---

### Câu 4 (Question 4)
**Kết quả của câu truy vấn sau đây là gì?**

```sql
SELECT LPAD('ORACLE_SQL', 6, '*') || '-' || RPAD('ORACLE_SQL', 6, '*') AS output
FROM dual;
```

* A. `******ORACLE_SQL-ORACLE_SQL******`
* B. `ORACLE-ORACLE`
* C. `ORACLE-C_SQL*`
* D. `*ORACL-ORACLE`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong cả hai hàm `LPAD(string, total_length, pad_str)` và `RPAD(string, total_length, pad_str)`, đối số thứ hai (`6`) quy định **tổng độ dài chính xác** của chuỗi kết quả trả về. Vì chuỗi gốc `'ORACLE_SQL'` dài 10 ký tự (lớn hơn 6), cả `LPAD` và `RPAD` đều sẽ cắt bớt chuỗi gốc từ bên phải để chỉ giữ lại đúng 6 ký tự đầu tiên là `'ORACLE'`. Ghép lại qua dấu `'-'` ta được `'ORACLE-ORACLE'`.
  * **A, C, D sai:** Nhầm lẫn rằng `6` là số lượng dấu `'*'` được thêm vào hoặc nghĩ rằng `LPAD` cắt từ bên trái.
</details>

---

### Câu 5 (Question 5)
**Khi thực thi câu lệnh SQL sau, điều gì sẽ xảy ra?**

```sql
SELECT TRIM('xy' FROM 'xyxyORACLExy') AS result FROM dual;
```

* A. Trả về `'ORACLE'`
* B. Trả về `'xyORACLE'`
* C. Báo lỗi `ORA-30001: trim set should have only one character`
* D. Báo lỗi cú pháp vì thiếu từ khóa `BOTH`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Hàm chuẩn ANSI `TRIM` trong Oracle chỉ cho phép cắt **đúng 1 ký tự duy nhất** (`trim_character` phải có độ dài bằng 1). Việc truyền chuỗi `'xy'` (2 ký tự) vào `TRIM` sẽ gây lỗi `ORA-30001: trim set should have only one character`. Nếu muốn cắt một tập nhiều ký tự ở hai đầu, phải kết hợp `LTRIM(RTRIM('xyxyORACLExy', 'xy'), 'xy')`.
  * **A, B, D sai:** Từ khóa `BOTH` là mặc định nên không bắt buộc, nhưng lỗi xảy ra do `'xy'` có 2 ký tự.
</details>

---

### Câu 6 (Question 6)
**Kết quả của câu lệnh sử dụng `LTRIM` và `RTRIM` dưới đây là gì?**

```sql
SELECT LTRIM('1232123ORACLE', '123') || '_' || RTRIM('123ORACLE32143', '123') AS res
FROM dual;
```

* A. `ORACLE_123ORACLE3214`
* B. `2123ORACLE_123ORACLE32143`
* C. `ORACLE_123ORACLE`
* D. `ORACLE_123ORACLE321`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Đối số thứ hai của `LTRIM` và `RTRIM` là một **tập hợp các ký tự rời rạc** `{'1', '2', '3'}`:
    * `LTRIM('1232123ORACLE', '123')`: Quét từ trái sang phải, xóa mọi ký tự thuộc tập `{'1', '2', '3'}` cho đến khi gặp chữ `'O'` thì dừng lại $\rightarrow$ `'ORACLE'`.
    * `RTRIM('123ORACLE32143', '123')`: Quét từ phải sang trái, xóa ký tự `'3'` ở cuối cùng, nhưng tiếp theo gặp ký tự `'4'` (không thuộc tập `{'1', '2', '3'}`) nên **dừng lại ngay lập tức**, giữ nguyên toàn bộ phần phía trước $\rightarrow$ `'123ORACLE3214'`.
    * Nối hai chuỗi với `'_'` thu được `'ORACLE_123ORACLE3214'`.
  * **B, C, D sai:** Hiểu nhầm `LTRIM`/`RTRIM` tìm kiếm theo cụm chuỗi cố định `'123'` hoặc xóa xuyên qua ký tự `'4'`.
</details>

---

### Câu 7 (Question 7)
**So sánh kết quả của hai hàm `REPLACE` và `TRANSLATE` trong câu truy vấn sau:**

```sql
SELECT REPLACE('123-132-231', '12', 'AB')   AS col_rep,
       TRANSLATE('123-132-231', '123-', 'AB') AS col_trans
FROM dual;
```

* A. `COL_REP = 'AB3-132-231'`, `COL_TRANS = 'AB-A2-B1'`
* B. `COL_REP = 'AB3-132-231'`, `COL_TRANS = 'ABABBA'`
* C. `COL_REP = 'AB3-AB2-BA1'`, `COL_TRANS = 'AB3-A3B-B3A'`
* D. `COL_REP = 'AB3-132-231'`, `COL_TRANS = 'AB3-A3B-B3A'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * Với `REPLACE('123-132-231', '12', 'AB')`: Tìm chính xác **cụm chuỗi `'12'`** và thay bằng `'AB'`. Trong chuỗi gốc chỉ có đoạn đầu tiên `'123'` là chứa cụm `'12'` liền nhau, nên kết quả là `'AB3-132-231'`.
    * Với `TRANSLATE('123-132-231', '123-', 'AB')`: Ánh xạ **từng ký tự 1-đối-1** theo vị trí giữa `'123-'` và `'AB'`:
      * `'1'` $\rightarrow$ `'A'`
      * `'2'` $\rightarrow$ `'B'`
      * `'3'` và `'-'` không có ký tự tương ứng trong `'AB'` nên bị **xóa bỏ hoàn toàn**!
      * Do đó: `'123-132-231'` sau khi bỏ hết `'3'` và `'-'` còn `'121221'`, đổi thành `'ABABBA'`.
  * **A, C, D sai:** Không nắm được quy tắc xóa ký tự thừa khi `from_string` dài hơn `to_string` trong hàm `TRANSLATE`.
</details>

---

### Câu 8 (Question 8)
**Kết quả của câu lệnh SQL sau đây là gì?**

```sql
SELECT ROUND(154.78, -2) AS r1,
       TRUNC(154.78, -2) AS t1,
       ROUND(149.99, -2) AS r2
FROM dual;
```

* A. `R1 = 200`, `T1 = 100`, `R2 = 100`
* B. `R1 = 200`, `T1 = 100`, `R2 = 200`
* C. `R1 = 150`, `T1 = 150`, `R2 = 150`
* D. `R1 = 0`, `T1 = 0`, `R2 = 0`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Khi tham số thứ hai là `-2`, `ROUND` và `TRUNC` tác động lên vị trí thứ 2 bên trái dấu chấm thập phân (tức **hàng trăm**, dựa vào chữ số hàng chục để xét làm tròn):
    * `ROUND(154.78, -2)`: Chữ số hàng chục là `5` (`>= 5`) nên làm tròn lên hàng trăm thành **`200`**.
    * `TRUNC(154.78, -2)`: Cắt bỏ từ hàng chục trở về sau (đưa về `00`), không làm tròn, thu được **`100`**.
    * `ROUND(149.99, -2)`: Khi làm tròn hàng trăm, Oracle **chỉ xét duy nhất chữ số hàng chục** (là `4 < 5`), tuyệt đối không làm tròn dây chuyền từ `.99` lên `9` rồi lên `5`! Vì `4 < 5`, kết quả làm tròn xuống **`100`**.
  * **B, C, D sai:** B mắc bẫy làm tròn dây chuyền (`149.99` $\rightarrow$ `150` $\rightarrow$ `200`); C nhầm `-2` là hàng chục (`-1`).
</details>

---

### Câu 9 (Question 9)
**Thực thi câu lệnh SQL sau đây sẽ trả về kết quả nào?**

```sql
SELECT CEIL(-14.2)  AS c_val,
       FLOOR(-14.2) AS f_val,
       TRUNC(-14.8) AS t_val
FROM dual;
```

* A. `C_VAL = -15`, `F_VAL = -14`, `T_VAL = -14`
* B. `C_VAL = -14`, `F_VAL = -15`, `T_VAL = -14`
* C. `C_VAL = -14`, `F_VAL = -15`, `T_VAL = -15`
* D. `C_VAL = -15`, `F_VAL = -14`, `T_VAL = -15`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * `CEIL(-14.2)`: Tìm số nguyên nhỏ nhất mà **lớn hơn hoặc bằng** `-14.2`. Trên trục số âm, `-14 > -14.2 > -15`, nên kết quả là **`-14`**.
    * `FLOOR(-14.2)`: Tìm số nguyên lớn nhất mà **nhỏ hơn hoặc bằng** `-14.2`, kết quả là **`-15`**.
    * `TRUNC(-14.8)`: Cắt bỏ phần thập phân `.8` mà không quan tâm dấu, giữ lại phần nguyên là **`-14`**.
  * **A, C, D sai:** Nhầm lẫn chiều lớn/nhỏ trên trục số âm giữa `CEIL`, `FLOOR` và `TRUNC`.
</details>

---

### Câu 10 (Question 10)
**Kết quả của câu lệnh SQL dưới đây là gì?**

```sql
SELECT MOD(-17, 5) AS m1,
       MOD(17, -5) AS m2,
       MOD(25, 0)  AS m3
FROM dual;
```

* A. Báo lỗi `ORA-01476: divisor is equal to zero` do `MOD(25, 0)`
* B. `M1 = -2`, `M2 = 2`, `M3 = 25`
* C. `M1 = 3`, `M2 = -3`, `M3 = 0`
* D. `M1 = -2`, `M2 = -2`, `M3 = NULL`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * Trong Oracle SQL, dấu của kết quả hàm `MOD(m, n)` luôn theo dấu của **số bị chia `m`**: `MOD(-17, 5) = -2` và `MOD(17, -5) = 2`.
    * Đặc biệt, khi số chia `n = 0`, hàm `MOD(m, 0)` **không gây lỗi chia cho 0** mà trả về chính giá trị `m` (ở đây `MOD(25, 0) = 25`) để tránh lỗi runtime trong các thuật toán tính toán.
  * **A, C, D sai:** `MOD(25, 0)` là một bẫy kinh điển trong đề thi OCA 1Z0-071 vì hầu hết thí sinh đều chọn đáp án báo lỗi chia cho 0.
</details>

---

### Câu 11 (Question 11)
**Phát biểu nào sau đây là ĐÚNG khi so sánh giữa `SYSDATE` và `CURRENT_DATE` trong Oracle Database?**

* A. `SYSDATE` trả về kiểu `DATE`, còn `CURRENT_DATE` trả về kiểu `TIMESTAMP WITH TIME ZONE`.
* B. `SYSDATE` trả về ngày giờ theo múi giờ của hệ điều hành máy chủ Database (DB Server OS), còn `CURRENT_DATE` trả về ngày giờ theo múi giờ của phiên làm việc hiện tại (`SESSIONTIMEZONE`).
* C. `SYSDATE` chỉ lưu Ngày-Tháng-Năm, còn `CURRENT_DATE` lưu cả Giờ-Phút-Giây.
* D. Cả hai hàm đều yêu cầu phải có cặp dấu ngoặc đơn rỗng `SYSDATE()` và `CURRENT_DATE()` khi gọi trong mệnh đề `SELECT`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Cả `SYSDATE` và `CURRENT_DATE` đều trả về kiểu dữ liệu `DATE` (chứa cả ngày, tháng, năm, giờ, phút, giây), nhưng `SYSDATE` lấy theo đồng hồ của máy chủ vật lý cài đặt Database, trong khi `CURRENT_DATE` tự động quy đổi sang múi giờ của phiên kết nối người dùng (`ALTER SESSION SET TIME_ZONE = ...`).
  * **A sai:** Hàm trả về `TIMESTAMP WITH TIME ZONE` theo session là `CURRENT_TIMESTAMP`, không phải `CURRENT_DATE`.
  * **C sai:** Kiểu `DATE` của cả hai hàm luôn bao gồm đầy đủ giờ, phút, giây.
  * **D sai:** Trong Oracle SQL, thêm dấu `()` sau `SYSDATE` hoặc `CURRENT_DATE` sẽ gây lỗi cú pháp!
</details>

---

### Câu 12 (Question 12)
**Giả sử năm 2024 là năm nhuận (tháng 2 có 29 ngày) và năm 2025 không phải năm nhuận (tháng 2 có 28 ngày). Câu lệnh SQL nào sau đây trả về kết quả là ngày `'2024-03-28'`?**

```sql
SELECT ADD_MONTHS(DATE '2024-02-28', 1) AS d1,
       ADD_MONTHS(DATE '2024-02-29', 1) AS d2,
       ADD_MONTHS(DATE '2025-02-28', 1) AS d3
FROM dual;
```

* A. Chỉ có `D1` trả về ngày 28 tháng 3 (`2024-03-28`), còn `D2` và `D3` đều trả về ngày 31 tháng 3.
* B. Cả `D1` và `D3` đều trả về ngày 28 tháng 3, còn `D2` trả về ngày 29 tháng 3.
* C. Cả `D1`, `D2`, `D3` đều trả về ngày 31 tháng 3 do quy tắc cuối tháng của `ADD_MONTHS`.
* D. `D1` trả về `2024-03-28`, `D2` trả về `2024-03-29`, `D3` trả về `2025-03-28`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Theo Quy tắc Cuối Tháng (End-of-Month Rule) của hàm `ADD_MONTHS`:
    * Nếu ngày đầu vào là **ngày cuối cùng của tháng**, kết quả bắt buộc phải là **ngày cuối cùng của tháng đích**.
    * Ở `D2` (`2024-02-29` là ngày cuối tháng 2 năm nhuận 2024) và `D3` (`2025-02-28` là ngày cuối tháng 2 năm thường 2025), khi cộng 1 tháng sang tháng 3, cả hai đều tự động nhảy về ngày cuối cùng của tháng 3 là **`31/03`** (`2024-03-31` và `2025-03-31`).
    * Ngược lại, ở `D1` (`2024-02-28`), vì năm 2024 là năm nhuận nên ngày 28/02 **không phải** là ngày cuối tháng! Do đó `ADD_MONTHS` giữ nguyên số ngày 28 và trả về **`2024-03-28`**.
  * **B, C, D sai:** Không phân biệt được ngày 28/02 trong năm nhuận và năm không nhuận khi áp dụng `ADD_MONTHS`.
</details>

---

### Câu 13 (Question 13)
**Kết quả khi chạy câu lệnh SQL dưới đây là gì?**

```sql
SELECT ROUND(DATE '2025-02-15', 'MONTH') AS r_month,
       ROUND(DATE '2025-07-01', 'YEAR')  AS r_year,
       TRUNC(DATE '2025-11-29', 'YEAR')  AS t_year
FROM dual;
```

* A. `R_MONTH = 2025-03-01`, `R_YEAR = 2026-01-01`, `T_YEAR = 2025-01-01`
* B. `R_MONTH = 2025-02-01`, `R_YEAR = 2026-01-01`, `T_YEAR = 2025-01-01`
* C. `R_MONTH = 2025-02-01`, `R_YEAR = 2025-01-01`, `T_YEAR = 2025-01-01`
* D. `R_MONTH = 2025-03-01`, `R_YEAR = 2025-01-01`, `T_YEAR = 2025-11-01`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * Với `ROUND(date, 'MONTH')`: Mốc làm tròn lên tháng tiếp theo của Oracle **luôn cố định là ngày 16** (từ ngày 1 đến 15 làm tròn xuống ngày 01 tháng hiện tại; từ ngày 16 trở đi làm tròn lên ngày 01 tháng sau), bất kể tháng 2 chỉ có 28 ngày! Do đó ngày `15-FEB-2025` làm tròn xuống thành **`2025-02-01`**.
    * Với `ROUND(date, 'YEAR')`: Mốc làm tròn lên năm tiếp theo là **ngày 01 tháng 7 (`01-JUL`)** (tháng 1–6 xuống đầu năm hiện tại, tháng 7–12 lên đầu năm sau). Vì vậy `'2025-07-01'` được làm tròn lên **`2026-01-01`**.
    * Với `TRUNC(date, 'YEAR')`: Luôn cắt về ngày đầu tiên của năm hiện tại là **`2025-01-01`**.
  * **A, C, D sai:** A bị lừa vì nghĩ tháng 2 có 28 ngày nên ngày 15 đã quá nửa tháng; C nhầm mốc làm tròn năm của ngày `01-JUL`.
</details>

---

### Câu 14 (Question 14)
**Câu lệnh SQL nào dưới đây sẽ báo lỗi khi thực thi trong Oracle Database?**

* A. `SELECT EXTRACT(YEAR FROM SYSDATE) FROM dual;`
* B. `SELECT EXTRACT(MONTH FROM CURRENT_DATE) FROM dual;`
* C. `SELECT EXTRACT(SECOND FROM SYSTIMESTAMP) FROM dual;`
* D. `SELECT EXTRACT(HOUR FROM SYSDATE) FROM dual;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng (là câu lệnh báo lỗi):** Mặc dù kiểu `DATE` (`SYSDATE`) trong Oracle có lưu giờ, phút, giây bên trong, nhưng hàm chuẩn ANSI `EXTRACT(field FROM source)` **chỉ cho phép trích xuất `YEAR`, `MONTH`, `DAY` từ một giá trị kiểu `DATE`**. Nếu cố tình trích xuất `HOUR`, `MINUTE`, hoặc `SECOND` từ `SYSDATE`, Oracle sẽ ném lỗi `ORA-30076: invalid extract field for extract source`. Muốn lấy giờ/phút/giây bằng `EXTRACT`, nguồn dữ liệu phải là `TIMESTAMP` (như `SYSTIMESTAMP` hoặc `CAST(SYSDATE AS TIMESTAMP)`).
  * **A, B, C sai:** Đều là các câu lệnh hợp lệ và chạy thành công.
</details>

---

### Câu 15 (Question 15)
**Cho bảng `EMPLOYEES` trong đó cột `COMMISSION_PCT` có kiểu dữ liệu là `NUMBER(2,2)`. Khi chạy câu truy vấn sau, kết quả sẽ như thế nào?**

```sql
SELECT emp_id, NVL(commission_pct, 'Not Applicable') AS comm_status
FROM employees;
```

* A. Hiển thị giá trị số của `commission_pct`, còn các dòng `NULL` sẽ hiển thị chuỗi `'Not Applicable'`.
* B. Tự động chuyển toàn bộ cột `comm_status` sang kiểu `VARCHAR2` và chạy thành công.
* C. Báo lỗi `ORA-01722: invalid number` khi gặp dòng có hoặc không có `NULL`.
* D. Trả về `NULL` cho các dòng không thể ép kiểu.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong hàm `NVL(expr1, expr2)`, kiểu dữ liệu trả về của toàn hàm được quyết định bởi kiểu dữ liệu của đối số thứ nhất (`expr1`). Vì `commission_pct` có kiểu `NUMBER`, Oracle sẽ cố gắng ép kiểu ngầm định (implicit conversion) đối số thứ hai là chuỗi `'Not Applicable'` sang kiểu `NUMBER`, dẫn đến lỗi `ORA-01722: invalid number`. Để khắc phục, phải chủ động chuyển `expr1` thành chuỗi trước: `NVL(TO_CHAR(commission_pct), 'Not Applicable')`.
  * **A, B, D sai:** Oracle không bao giờ tự động ép ngược `expr1` từ `NUMBER` sang `VARCHAR2` để chiều theo `expr2` trong hàm `NVL`.
</details>

---

### Câu 16 (Question 16)
**Cho câu truy vấn sử dụng `NVL2` và `NULLIF` như sau. Kết quả trả về là gì?**

```sql
SELECT NVL2(NULL, 'A', 'B')     AS col1,
       NVL2('X', 100, 200)      AS col2,
       NULLIF(50, 50)           AS col3,
       NULLIF(50, 100)          AS col4
FROM dual;
```

* A. `COL1 = 'A'`, `COL2 = 100`, `COL3 = NULL`, `COL4 = 50`
* B. `COL1 = 'B'`, `COL2 = 100`, `COL3 = NULL`, `COL4 = 50`
* C. `COL1 = 'B'`, `COL2 = 200`, `COL3 = 50`, `COL4 = NULL`
* D. `COL1 = 'B'`, `COL2 = 100`, `COL3 = NULL`, `COL4 = 100`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * `NVL2(expr1, expr2, expr3)`: Nếu `expr1` **KHÔNG `NULL`** thì trả về `expr2`; nếu `expr1` **LÀ `NULL`** thì trả về `expr3`. Do đó `NVL2(NULL, 'A', 'B')` trả về `'B'`, và `NVL2('X', 100, 200)` trả về `100`.
    * `NULLIF(expr1, expr2)`: Nếu `expr1 = expr2` thì trả về `NULL`; ngược lại trả về **`expr1`**. Do đó `NULLIF(50, 50)` trả về `NULL`, còn `NULLIF(50, 100)` trả về `50`.
  * **A, C, D sai:** Nhầm thứ tự trả về của `NVL2` hoặc nhầm rằng `NULLIF` trả về đối số thứ hai khi hai đối số khác nhau.
</details>

---

### Câu 17 (Question 17)
**Xét hai câu lệnh SQL dưới đây. Phát biểu nào mô tả chính xác nhất kết quả thực thi của chúng?**

```sql
-- Câu lệnh 1:
SELECT NVL(100, 1/0) FROM dual;

-- Câu lệnh 2:
SELECT COALESCE(100, 1/0) FROM dual;
```

* A. Cả hai câu lệnh đều trả về `100` vì đối số đầu tiên đã khác `NULL`.
* B. Cả hai câu lệnh đều báo lỗi `ORA-01476: divisor is equal to zero`.
* C. Câu lệnh 1 báo lỗi `ORA-01476: divisor is equal to zero`, còn Câu lệnh 2 chạy thành công và trả về `100`.
* D. Câu lệnh 1 trả về `100`, còn Câu lệnh 2 báo lỗi `ORA-01476`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:**
    * Hàm `NVL(expr1, expr2)` là hàm thông thường nên Oracle **luôn tính toán giá trị của tất cả các đối số truyền vào** trước khi gọi hàm. Vì thế biểu thức `1/0` bị thực thi và ném ra lỗi chia cho 0 (`ORA-01476`).
    * Ngược lại, `COALESCE(expr1, expr2, ...)` sử dụng cơ chế **Short-circuit evaluation** (đánh giá đoản mạch từ trái sang phải). Ngay khi thấy đối số thứ nhất (`100`) khác `NULL`, `COALESCE` lập tức trả về `100` và **bỏ qua hoàn toàn** không tính toán các đối số phía sau (`1/0`).
  * **A, B, D sai:** Không nắm được cơ chế Short-circuit của `COALESCE` so với `NVL`.
</details>

---

### Câu 18 (Question 18)
**Câu lệnh nào sau đây sử dụng `COALESCE` hoặc `NULLIF` là HỢP LỆ và không báo lỗi trong Oracle SQL?**

* A. `SELECT NULLIF(NULL, 100) FROM dual;`
* B. `SELECT COALESCE(NULL, 100, 'Khong co') FROM dual;`
* C. `SELECT COALESCE(NULL, TO_CHAR(100), 'Khong co') FROM dual;`
* D. `SELECT NULLIF(100, '100') FROM dual;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong `COALESCE(NULL, TO_CHAR(100), 'Khong co')`, các đối số khác `NULL` đều có cùng kiểu dữ liệu là `VARCHAR2`, câu lệnh chạy thành công và trả về chuỗi `'100'`.
  * **A sai:** Trong `NULLIF(expr1, expr2)`, đối số đầu tiên `expr1` **không bao giờ được phép là literal `NULL`** (báo lỗi `ORA-00932: inconsistent datatypes`).
  * **B sai:** `COALESCE` yêu cầu mọi đối số không phải `NULL` phải cùng kiểu dữ liệu; trộn lẫn `100` (`NUMBER`) và `'Khong co'` (`VARCHAR2`) sẽ báo lỗi `ORA-00932`.
  * **D sai:** `NULLIF` không tự động ép kiểu giữa `NUMBER` (`100`) và `VARCHAR2` (`'100'`), gây lỗi `ORA-00932`.
</details>

---

### Câu 19 (Question 19)
**Kết quả trả về của câu lệnh SQL so sánh `CASE` và `DECODE` khi xử lý giá trị `NULL` dưới đây là gì?**

```sql
SELECT CASE NULL
           WHEN NULL THEN 'Match'
           ELSE 'No Match'
       END AS c_res,
       DECODE(NULL, NULL, 'Match', 'No Match') AS d_res
FROM dual;
```

* A. `C_RES = 'Match'`, `D_RES = 'Match'`
* B. `C_RES = 'No Match'`, `D_RES = 'No Match'`
* C. `C_RES = 'No Match'`, `D_RES = 'Match'`
* D. `C_RES = 'Match'`, `D_RES = 'No Match'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là câu hỏi phân loại kinh điển trong đề thi OCA 1Z0-071:
    * Biểu thức **Simple `CASE`** (`CASE expr WHEN val THEN ...`) thực hiện phép so sánh bằng chuẩn SQL: `NULL = NULL`. Vì `NULL = NULL` luôn trả về `UNKNOWN` (không phải `TRUE`), nên nhánh `WHEN NULL` không khớp và rơi xuống `ELSE 'No Match'`.
    * Ngược lại, hàm **`DECODE`** là ngoại lệ đặc biệt của Oracle: nó coi hai giá trị `NULL` là **tương đương nhau** (`NULL` khớp với `NULL`), do đó trả về `'Match'`.
  * **A, B, D sai:** Nhầm lẫn cách đối xử với `NULL` giữa Simple `CASE` và `DECODE`.
</details>

---

### Câu 20 (Question 20)
**Khi thực thi câu truy vấn dưới đây, kết quả nào sẽ xảy ra?**

```sql
SELECT CASE 10
           WHEN 5  THEN 'Five'
           WHEN 10 THEN 100
           ELSE 'Other'
       END AS result
FROM dual;
```

* A. Trả về số `100`
* B. Trả về chuỗi `'100'`
* C. Báo lỗi `ORA-00932: inconsistent datatypes: expected CHAR got NUMBER`
* D. Trả về `NULL`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong biểu thức `CASE`, tất cả các giá trị trả về sau từ khóa `THEN` và `ELSE` **bắt buộc phải có cùng kiểu dữ liệu**. Nhánh `WHEN 5 THEN 'Five'` xác lập kiểu trả về là `CHAR`/`VARCHAR2`, nhưng nhánh `WHEN 10 THEN 100` lại trả về kiểu `NUMBER`. Biểu thức `CASE` không tự động ép kiểu ngầm định giữa các nhánh kết quả nên trình biên dịch SQL báo lỗi `ORA-00932: inconsistent datatypes`.
  * **A, B, D sai:** `CASE` kiểm tra tính đồng nhất kiểu dữ liệu của mọi nhánh ngay tại thời điểm parse câu lệnh.
</details>

---

### Câu 21 (Question 21)
**Cho nhân viên có mức lương `salary = 8000`. Câu lệnh SQL dưới đây sẽ trả về giá trị gì cho cột `GRADE`?**

```sql
SELECT CASE
           WHEN salary > 3000 THEN 'Level 1'
           WHEN salary > 5000 THEN 'Level 2'
           WHEN salary > 7000 THEN 'Level 3'
           ELSE 'Level 0'
       END AS grade
FROM (SELECT 8000 AS salary FROM dual);
```

* A. `'Level 1'`
* B. `'Level 3'`
* C. `'Level 0'`
* D. Báo lỗi vì một giá trị `salary` thỏa mãn nhiều nhánh `WHEN` cùng lúc

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Biểu thức `CASE` đánh giá các nhánh `WHEN` **tuần tự từ trên xuống dưới** và dừng lại ngay tại nhánh `WHEN` **đầu tiên** có điều kiện đúng (`TRUE`). Với `salary = 8000`, ngay ở nhánh đầu tiên `WHEN salary > 3000` (`8000 > 3000` là `TRUE`), biểu thức lập tức trả về `'Level 1'` và bỏ qua toàn bộ các nhánh bên dưới! Để phân loại đúng từ cao xuống thấp, người lập trình phải sắp xếp điều kiện `> 7000` lên trước `> 5000` và `> 3000`.
  * **B, C, D sai:** B quên mất thứ tự ưu tiên từ trên xuống của `CASE WHEN`.
</details>

---

### Câu 22 (Question 22)
**Giả sử hôm nay là Thứ Sáu, ngày `10-OCT-2025` (`DATE '2025-10-10'`). Kết quả của biểu thức `NEXT_DAY(DATE '2025-10-10', 'FRIDAY')` và `LAST_DAY(DATE '2025-10-10')` lần lượt là gì?**

* A. `2025-10-10` và `2025-10-31`
* B. `2025-10-17` và `2025-10-31`
* C. `2025-10-17` và `2025-10-30`
* D. `2025-10-10` và `2025-10-30`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * Hàm `NEXT_DAY(date, day_of_week)` luôn trả về ngày của thứ được chỉ định **nằm строго sau `date`** (tức là trong tương lai, không bao giờ trả về chính `date`). Vì ngày `10-OCT-2025` đã là Thứ Sáu, nên Thứ Sáu tiếp theo phải cộng thêm 7 ngày là **`2025-10-17`**.
    * Tháng 10 có 31 ngày, nên `LAST_DAY(DATE '2025-10-10')` trả về **`2025-10-31`**.
  * **A, C, D sai:** A và D nhầm rằng `NEXT_DAY` trả về chính ngày hiện tại nếu trùng thứ; C và D nhầm số ngày của tháng 10.
</details>

---

### Câu 23 (Question 23)
**Kết quả của câu truy vấn lồng nhiều hàm đơn dòng dưới đây là gì?**

```sql
SELECT SUBSTR(REPLACE(TRIM('   oracle_db_21c   '), '_', ''), -5, 3) AS res
FROM dual;
```

* A. `'db2'`
* B. `'b21'`
* C. `'21c'`
* D. `'le_d'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Thực hiện giải các hàm lồng nhau theo thứ tự **từ trong ra ngoài**:
    1. Trong cùng: `TRIM('   oracle_db_21c   ')` cắt sạch khoảng trắng hai đầu $\rightarrow$ `'oracle_db_21c'`.
    2. Tiếp theo: `REPLACE('oracle_db_21c', '_', '')` (hoặc lược bỏ đối số thứ 3) xóa toàn bộ dấu gạch dưới `'_'` $\rightarrow$ `'oracledb21c'` (độ dài 11 ký tự).
    3. Ngoài cùng: `SUBSTR('oracledb21c', -5, 3)` đếm lùi 5 ký tự từ cuối chuỗi `'oracledb21c'` (`'c'` là -1, `'1'` là -2, `'2'` là -3, `'b'` là -4, `'d'` là -5), rồi lấy sang phải 3 ký tự bắt đầu từ `'d'` $\rightarrow$ **`'db2'`**.
  * **B, C, D sai:** Đếm sai vị trí `-5` hoặc quên rằng dấu `'_'` đã bị hàm `REPLACE` xóa mất.
</details>

---

### Câu 24 (Question 24)
**Cho biểu thức `MONTHS_BETWEEN(DATE '2025-03-31', DATE '2025-02-28')` và `MONTHS_BETWEEN(DATE '2025-02-01', DATE '2025-03-01')`. Kết quả trả về của hai biểu thức này lần lượt là gì?**

* A. `1.09677` và `-1`
* B. `1` và `-1`
* C. `1` và `1`
* D. `0.90322` và `-1`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * Trong hàm `MONTHS_BETWEEN(date1, date2)`, nếu cả `date1` và `date2` **đều là ngày cuối cùng của tháng** (`31/03/2025` là ngày cuối tháng 3 và `28/02/2025` là ngày cuối tháng 2 năm không nhuận), Oracle không tính phần lẻ theo 31 ngày mà trả về đúng số tháng nguyên chênh lệch là **`1`**.
    * Với `MONTHS_BETWEEN(DATE '2025-02-01', DATE '2025-03-01')`, hai ngày có cùng số ngày trong tháng (cùng ngày `01`), nhưng `date1 < date2` nên kết quả trả về số nguyên âm **`-1`**.
  * **A, C, D sai:** A và D quên quy tắc hai ngày cuối tháng trong `MONTHS_BETWEEN`; C quên dấu âm khi `date1 < date2`.
</details>

---

### Câu 25 (Question 25)
**Kết quả của câu lệnh SQL kết hợp hàm `SIGN`, `ABS` và `DECODE` dưới đây là gì?**

```sql
SELECT DECODE(SIGN(50 - 80),
              1,  'Positive',
              -1, 'Negative',
              0,  'Zero') AS status
FROM dual;
```

* A. `'Positive'`
* B. `'Negative'`
* C. `'Zero'`
* D. Báo lỗi vì `DECODE` không hỗ trợ so sánh lớn hơn hay nhỏ hơn

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Bản thân hàm `DECODE` chỉ so sánh bằng (`=`), không thể viết trực tiếp `DECODE(a > b, ...)`. Do đó, kỹ thuật chuẩn trong Oracle SQL để kiểm tra lớn hơn / nhỏ hơn bên trong `DECODE` là kết hợp với hàm **`SIGN(a - b)`**:
    * `50 - 80 = -30`.
    * `SIGN(-30)` trả về **`-1`** (vì `-30 < 0`).
    * `DECODE(-1, 1, 'Positive', -1, 'Negative', 0, 'Zero')` khớp với giá trị `-1` và trả về **`'Negative'`**.
  * **A, C, D sai:** Đây là mẫu thiết kế (idiom) kinh điển của lập trình viên Oracle SQL khi dùng `DECODE` để so sánh khoảng giá trị.
</details>

---
