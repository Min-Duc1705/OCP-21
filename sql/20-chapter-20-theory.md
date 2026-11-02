# Chương 20: Oracle SQL Nâng Cao Trong Thực Tế (Advanced Practical SQL for Developers) - Oracle SQL OCA & OCP

> **Tài liệu tham chiếu:** *OCA/OCP Oracle Database SQL Exam Guide (Exam 1Z0-071)* & *Oracle Database SQL Language Reference*.  
> **Mục tiêu khảo thí & thực chiến:** Làm chủ câu lệnh `MERGE` nâng cao (quy tắc `DELETE WHERE`, lỗi `ORA-30926`, `ORA-38104`, và `DBMS_ERRLOG` với `LOG ERRORS INTO`); nắm vững kỹ thuật phân trang hiệu năng cao (`FETCH FIRST ... WITH TIES`, `Offset Pagination` vs. `Keyset/Seek Pagination`); thành thạo `Conditional Aggregation`, khử trùng dữ liệu bằng `ROWID` và `ROW_NUMBER()`; làm chủ bộ 5 hàm `Regular Expressions` (`REGEXP_LIKE`, `REGEXP_SUBSTR`, `REGEXP_INSTR`, `REGEXP_REPLACE`, `REGEXP_COUNT`) và lý thuyết chuẩn hóa CSDL (`1NF`, `2NF`, `3NF`, `BCNF`, `Denormalization`).

---

## 📑 Mục Lục Chi Tiết

1. [Câu Lệnh MERGE Nâng Cao & Xử Lý Lỗi Hàng Loạt Với DBMS_ERRLOG](#1-câu-lệnh-merge-nâng-cao--xử-lý-lỗi-hàng-loạt-với-dbms_errlog)
2. [Các Mẫu Top-N Query & Kỹ Thuật Phân Trang Hiệu Năng Cao (Keyset vs. Offset)](#2-các-mẫu-top-n-query--kỹ-thuật-phân-trang-hiệu-năng-cao-keyset-vs-offset)
3. [Conditional Aggregation (Tổng Hợp Có Điều Kiện) Trong Báo Cáo](#3-conditional-aggregation-tổng-hợp-có-điều-kiện-trong-báo-cáo)
4. [Kỹ Thuật Phát Hiện và Xóa Dữ Liệu Trùng Lặp (Deduplication với ROWID)](#4-kỹ-thuật-phát-hiện-và-xóa-dữ-liệu-trùng-lặp-deduplication-với-rowid)
5. [Biểu Thức Chính Quy (Regular Expressions) Trong Oracle SQL](#5-biểu-thức-chính-quy-regular-expressions-trong-oracle-sql)
6. [Chuẩn Hóa Cơ Sở Dữ Liệu (1NF, 2NF, 3NF, BCNF) & Denormalization](#6-chuẩn-hóa-cơ-sở-dữ-liệu-1nf-2nf-3nf-bcnf--denormalization)
7. [Bài Tập Thực Hành Tự Luyện (Kèm Lời Giải Chi Tiết)](#7-bài-tập-thực-hành-tự-luyện-kèm-lời-giải-chi-tiết)
8. [Tổng Hợp Bẫy Thi OCA/OCP & Phỏng Vấn Cốt Lõi (Exam Essentials)](#8-tổng-hợp-bẫy-thi-ocaocp--phỏng-vấn-cốt-lõi-exam-essentials)

---

## 1. Câu Lệnh MERGE Nâng Cao & Xử Lý Lỗi Hàng Loạt Với DBMS_ERRLOG

Câu lệnh **`MERGE`** (còn gọi là **Upsert**) cho phép đồng bộ dữ liệu từ một nguồn (Bảng, View, hoặc Subquery) vào một bảng đích: nếu khớp điều kiện thì `UPDATE` (và có thể kết hợp `DELETE`), nếu không khớp thì `INSERT` — tất cả gói gọn trong **duy nhất 1 lần quét dữ liệu**.

### 1.1. Cú pháp đầy đủ của `MERGE`

```sql
MERGE INTO target_products t
USING source_products s
   ON (t.product_id = s.product_id)
WHEN MATCHED THEN
    UPDATE SET
        t.product_name = s.product_name,
        t.unit_price   = s.unit_price,
        t.status       = s.status
    WHERE s.status IS NOT NULL
    DELETE WHERE (t.status = 'OBSOLETE' OR t.unit_price = 0)
WHEN NOT MATCHED THEN
    INSERT (t.product_id, t.product_name, t.unit_price, t.status)
    VALUES (s.product_id, s.product_name, s.unit_price, s.status)
    WHERE s.status != 'OBSOLETE';
```

### 1.2. Bốn Quy Tắc & Bẫy Thi Sống Còn Về `MERGE`

#### Quy tắc 1: Hai nhánh `WHEN MATCHED` và `WHEN NOT MATCHED` là tùy chọn (Từ Oracle 10g+)
* Một câu lệnh `MERGE` có thể có cả hai nhánh, hoặc **chỉ có nhánh `WHEN MATCHED THEN UPDATE`**, hoặc **chỉ có nhánh `WHEN NOT MATCHED THEN INSERT`**.

#### Quy tắc 2: Cấm `UPDATE` cột xuất hiện trong mệnh đề `ON (...)` (`ORA-38104`)
> [!WARNING]
> Bạn **TUYỆT ĐỐI KHÔNG ĐƯỢC PHÉP** cập nhật bất kỳ cột nào được tham chiếu bên trong điều kiện kết nối `ON (...)`!  
> ```sql
> MERGE INTO emp t USING src s ON (t.emp_id = s.emp_id)
> WHEN MATCHED THEN
>     UPDATE SET t.emp_id = s.new_id; -- ❌ LỖI: ORA-38104: Columns referenced in the ON Clause cannot be updated
> ```

#### Quy tắc 3: Cơ chế đặc biệt của `DELETE WHERE` bên trong nhánh `WHEN MATCHED`
> [!IMPORTANT]
> **Bẫy thi cực kỳ hiểm hóc trong đề thi OCA/OCP:**  
> 1. Trong `MERGE`, mệnh đề `DELETE WHERE ...` **không thể đứng độc lập**, mà **BẮT BUỘC phải đi kèm ngay bên dưới `WHEN MATCHED THEN UPDATE SET ...`**.  
> 2. Mệnh đề `DELETE WHERE` **CHỈ đánh giá và xóa những dòng trên bảng đích ĐÃ BỊ CHẠM TỚI (ĐÃ ĐƯỢC CẬP NHẬT) bởi lệnh `UPDATE` ngay phía trên nó**! Những dòng ở bảng đích không khớp với nguồn `USING`, hoặc khớp `ON` nhưng bị loại bỏ bởi điều kiện `UPDATE ... WHERE`, sẽ **KHÔNG BAO GIỜ bị xóa** bởi `DELETE WHERE`!  
> 3. Điều kiện trong `DELETE WHERE` kiểm tra giá trị của cột **SAU KHI ĐÃ ĐƯỢC `UPDATE`** (Post-update value), không phải giá trị cũ trước khi `UPDATE`!

#### Quy tắc 4: Lỗi kinh điển `ORA-30926: unable to get a stable set of rows in the source tables`
* **Khi nào xảy ra?**
  * Khi trong tập dữ liệu nguồn (`USING`) có **từ 2 dòng trở lên cùng khớp (`MATCH`) với 1 dòng duy nhất trong bảng đích** theo điều kiện `ON (...)`!
  * Ví dụ: Bảng đích `CUSTOMERS` có 1 dòng `cust_id = 100`. Nhưng bảng tạm `STAGING_LOGS` ở mệnh đề `USING` lại có **2 dòng** cùng mang `cust_id = 100` (1 dòng sửa tên thành `'An'`, 1 dòng sửa tên thành `'Bình'`). Oracle không biết phải lấy dòng nào để `UPDATE` vào dòng `cust_id = 100` của bảng đích, nên lập tức ném lỗi:
    **`ORA-30926: unable to get a stable set of rows in the source tables`**!
* **Cách khắc phục triệt để:**
  * Phải khử trùng bảng nguồn bên trong một Subquery ở mệnh đề `USING` (dùng `GROUP BY` hoặc `ROW_NUMBER() OVER (PARTITION BY cust_id ORDER BY updated_at DESC) rn WHERE rn = 1`) trước khi `MERGE`!

---

### 1.3. Bẫyエラー DML Hàng Loạt với `DBMS_ERRLOG` và `LOG ERRORS INTO`

Trong mặc định của Oracle, một câu lệnh DML (`INSERT INTO ... SELECT`, `UPDATE`, `MERGE`) là **nguyên tử ở cấp câu lệnh (Statement-level Atomicity)**: nếu bạn `MERGE` 5 triệu dòng mà đến dòng thứ `4,999,999` có 1 bản ghi bị lỗi `NOT NULL`, `CHECK`, `UNIQUE`, hoặc giá trị quá độ dài cột (`ORA-12899`), toàn bộ 5 triệu dòng của câu lệnh đó sẽ bị **Rollback sạch sẽ**!

Để cho phép 4,999,999 dòng hợp lệ vẫn được nạp vào bảng đích và đẩy riêng 1 dòng bị lỗi sang bảng Log lỗi để kiểm tra sau, Oracle cung cấp tính năng **DML Error Logging**:

```sql
-- Bước 1: Dùng gói DBMS_ERRLOG tạo bảng chứa lỗi (mặc định có tên ERR$_<TÊN_BẢNG>)
BEGIN
    DBMS_ERRLOG.CREATE_ERROR_LOG(
        dml_table_name      => 'TARGET_PRODUCTS',
        err_log_table_name  => 'ERR$_TARGET_PRODUCTS'
    );
END;
/

-- Bước 2: Thêm mệnh đề LOG ERRORS INTO ... REJECT LIMIT UNLIMITED vào cuối câu lệnh DML/MERGE
INSERT INTO target_products (product_id, product_name, unit_price)
SELECT product_id, product_name, unit_price
FROM staging_products
LOG ERRORS INTO err$_target_products ('BATCH_2026_11_02') REJECT LIMIT UNLIMITED;

-- Bước 3: Truy vấn các dòng bị lỗi từ bảng ERR$_TARGET_PRODUCTS
SELECT ora_err_number$, ora_err_mesg$, ora_err_tag$, product_id, unit_price
FROM err$_target_products;
```

> [!TIP]
> **Lưu ý về `REJECT LIMIT`:**  
> Nếu bạn không ghi `REJECT LIMIT UNLIMITED`, giá trị mặc định của `REJECT LIMIT` là **`0`** (tức là gặp dòng lỗi đầu tiên sẽ vẫn dừng và Rollback câu lệnh sau khi ghi dòng lỗi đó). Vì vậy trong thực tế luôn phải chỉ định `REJECT LIMIT UNLIMITED` (hoặc một con số ngưỡng cụ thể như `REJECT LIMIT 100`).

---

## 2. Các Mẫu Top-N Query & Kỹ Thuật Phân Trang Hiệu Năng Cao (Keyset vs. Offset)

### 2.1. Phân trang với `OFFSET ... FETCH` (Từ Oracle 12c+) và bẫy `WITH TIES`

```sql
-- Lấy 10 nhân viên lương cao nhất (Trang 1: dòng 1 -> 10)
SELECT employee_id, first_name, salary
FROM employees
ORDER BY salary DESC
FETCH FIRST 10 ROWS ONLY;

-- Lấy 10 nhân viên có lương cao nhất, NHƯNG nếu người thứ 11, 12 có mức lương BẰNG HỆT người thứ 10 thì lấy luôn!
SELECT employee_id, first_name, salary
FROM employees
ORDER BY salary DESC
FETCH FIRST 10 ROWS WITH TIES;

-- Phân trang truyền thống (Trang 3, mỗi trang 10 dòng -> Bỏ qua 20 dòng đầu, lấy 10 dòng kế tiếp):
SELECT employee_id, first_name, salary
FROM employees
ORDER BY salary DESC, employee_id ASC
OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;
```

> [!WARNING]
> **2 Bẫy thi OCA/OCP về `ROWNUM` và `FETCH FIRST`:**  
> 1. Nếu viết theo kiểu cũ trước Oracle 12c:  
>    `SELECT * FROM employees WHERE ROWNUM <= 5 ORDER BY salary DESC;`  
>    $\rightarrow$ **SAI NGHIỆP VỤ!** Vì Oracle gán `ROWNUM` (`1..5`) cho 5 dòng ngẫu nhiên đọc được đầu tiên ở bước `WHERE`, rồi mới sắp xếp 5 dòng ngẫu nhiên đó ở bước `ORDER BY`! Muốn dùng `ROWNUM` đúng thì phải bọc `ORDER BY` vào trong một Inline View trước.  
> 2. Với `ROWNUM`, điều kiện `WHERE ROWNUM = 2` hoặc `WHERE ROWNUM > 5` luôn trả về **0 dòng (Tập rỗng)** vì `ROWNUM` chỉ tăng lên `2` sau khi dòng `1` đã được chấp nhận vào tập kết quả!

---

### 2.2. Tại sao `Offset Pagination` chết đứng trên bảng lớn & Giải pháp `Keyset (Seek) Pagination`

Giả sử bảng lịch sử cuộc gọi `CALL_LOGS` của VNPT có **100 triệu dòng**, được đánh Index trên `(call_date DESC, call_id DESC)`.

#### Vấn đề của `Offset Pagination` (`OFFSET n ROWS FETCH NEXT m ROWS ONLY`):
Khi người dùng hoặc tiến trình đồng bộ nhảy tới trang thứ `50,000` (mỗi trang 20 dòng, tức `OFFSET 1000000 ROWS`):
```sql
-- ❌ CHẬM KINH HOÀNG KHI OFFSET LỚN:
SELECT call_id, caller_num, call_date, duration
FROM call_logs
ORDER BY call_date DESC, call_id DESC
OFFSET 1000000 ROWS FETCH NEXT 20 ROWS ONLY;
```
* Để lấy ra 20 dòng từ vị trí `1,000,001` đến `1,000,020`, Oracle **BẮT BUỘC phải quét và đếm qua toàn bộ 1,000,020 dòng đầu tiên**, sau đó vứt bỏ 1,000,000 dòng đầu đi! Càng về những trang cuối, câu truy vấn càng chậm theo cấp số cộng!

#### Giải pháp: `Keyset Pagination` (Seek Method / Cursor-based Pagination)
Thay vì đếm số dòng cần bỏ qua (`OFFSET`), ứng dụng nhớ giá trị **`(call_date, call_id)` của dòng cuối cùng ở trang trước** (ví dụ: `:last_date` và `:last_id`) và truyền vào mệnh đề `WHERE` để nhảy thẳng vào đúng vị trí trong B-Tree Index:

```sql
-- ✅ TỐC ĐỘ 0.001 GIÂY Ở BẤT KỲ TRANG NÀO (DÙ LÀ TRANG 1 HAY TRANG 5 TRIỆU!):
SELECT call_id, caller_num, call_date, duration
FROM call_logs
WHERE (call_date < :last_date)
   OR (call_date = :last_date AND call_id < :last_id)
ORDER BY call_date DESC, call_id DESC
FETCH FIRST 20 ROWS ONLY;
```

| Tiêu chí | Offset Pagination (`OFFSET N ROWS`) | Keyset / Seek Pagination (`WHERE key < :last_key`) |
| :--- | :--- | :--- |
| **Độ phức tạp I/O** | $O(N + M)$ — Phải đọc qua toàn bộ $N$ dòng bị bỏ qua. | $O(\log(\text{Total}) + M)$ — Nhảy thẳng tới vị trí khóa trong B-Tree Index, chỉ đọc đúng $M$ dòng! |
| **Tốc độ ở trang thứ 100,000** | Cực chậm (hàng giây đến hàng chục giây). | **Nhanh tức thì** (~1ms), không suy giảm theo số trang. |
| **Tính ổn định khi có `INSERT` mới** | Dễ bị lặp dòng hoặc sót dòng giữa 2 lần chuyển trang. | **Tuyệt đối ổn định**, không bao giờ lặp hay sót dòng. |

---

## 3. Conditional Aggregation (Tổng Hợp Có Điều Kiện) Trong Báo Cáo

Trong thực tế làm báo cáo tài chính/viễn thông, bạn rất thường xuyên phải thống kê nhiều chỉ tiêu có điều kiện khác nhau (Tổng cước trả trước, Tổng cước trả sau, Số lượng giao dịch thành công, Số lượng giao dịch thất bại...) trên cùng một dòng kết quả chỉ với **1 lần đọc bảng duy nhất**.

### 3.1. Cú pháp chuẩn với `SUM(CASE WHEN ...)` và `COUNT(CASE WHEN ...)`

```sql
SELECT
    department_id,
    COUNT(*) AS total_emp,
    -- Đếm có điều kiện: Cách 1 dùng COUNT(CASE WHEN ...) -> KHÔNG ĐƯỢC CÓ ELSE 0!
    COUNT(CASE WHEN salary >= 10000 THEN 1 END) AS high_sal_count,
    -- Đếm có điều kiện: Cách 2 dùng SUM(CASE WHEN ... THEN 1 ELSE 0 END)
    SUM(CASE WHEN job_id = 'IT_PROG' THEN 1 ELSE 0 END) AS it_prog_count,
    -- Tính tổng có điều kiện (luôn bọc NVL hoặc ELSE 0 để tránh trả về NULL khi không có dòng nào khớp)
    SUM(CASE WHEN salary >= 10000 THEN salary ELSE 0 END) AS high_sal_total_budget
FROM employees
GROUP BY department_id
ORDER BY department_id;
```

> [!CAUTION]
> **Bẫy kinh điển với `COUNT(CASE WHEN ... ELSE 0 END)`:**  
> Hàm `COUNT(expr)` trong SQL đếm tất cả các dòng mà **`expr IS NOT NULL`** (nó không quan tâm giá trị là `1` hay `0`!).  
> Do đó, nếu bạn viết:  
> ```sql
> -- ❌ SAI NGHIỆP VỤ: Số 0 KHÔNG PHẢI LÀ NULL, nên COUNT() sẽ đếm luôn cả các dòng rơi vào ELSE 0!
> COUNT(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END)
> ```
> Kết quả của biểu thức trên sẽ luôn bằng `COUNT(*)` (đếm toàn bộ các dòng)!  
> **Quy tắc bất biến:**  
> * Dùng `COUNT` thì **bỏ `ELSE`** (mặc định là `ELSE NULL`): `COUNT(CASE WHEN status = 'SUCCESS' THEN 1 END)`.  
> * Hoặc dùng `SUM` thì mới có `ELSE 0`: `SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END)`.

---

## 4. Kỹ Thuật Phát Hiện và Xóa Dữ Liệu Trùng Lặp (Deduplication với ROWID)

Giả sử bảng `SUBSCRIBER_CONTACTS` bị lỗi đồng bộ khiến một số thuê bao (`phone_number`, `email`) bị chèn lặp thành 2, 3 dòng giống hệt nhau. Làm thế nào để **chỉ giữ lại 1 dòng duy nhất** cho mỗi cặp `(phone_number, email)` và xóa sạch các bản sao dư thừa?

### 4.1. Cách 1: Sử dụng cột giả `ROWID` kết hợp `MIN(ROWID)` / `MAX(ROWID)` (Nhanh và gọn nhất)
Mỗi dòng vật lý trên đĩa trong Oracle đều có một địa chỉ **`ROWID` duy nhất tuyệt đối** (dù toàn bộ các cột dữ liệu của 2 dòng có giống hệt nhau 100%, `ROWID` của chúng vẫn khác nhau!).

```sql
-- Xóa tất cả các dòng trùng lặp, chỉ giữ lại dòng có ROWID nhỏ nhất cho mỗi bộ (phone_number, email):
DELETE FROM subscriber_contacts
WHERE rowid NOT IN (
    SELECT MIN(rowid)
    FROM subscriber_contacts
    GROUP BY phone_number, email
);
```

### 4.2. Cách 2: Sử dụng Analytic Function `ROW_NUMBER() OVER (PARTITION BY ...)`
Khi bạn muốn kiểm soát chính xác dòng nào được giữ lại (ví dụ: giữ lại dòng có `created_at` mới nhất, nếu `created_at` bằng nhau thì giữ dòng có `id` lớn nhất):

```sql
-- B1: Kiểm tra các dòng bị trùng lặp (rn > 1 là các bản sao cần xóa)
SELECT rowid, phone_number, email, created_at,
       ROW_NUMBER() OVER (
           PARTITION BY phone_number, email
           ORDER BY created_at DESC, contact_id DESC
       ) AS rn
FROM subscriber_contacts;

-- B2: Xóa chính xác các dòng có rn > 1 thông qua ROWID:
DELETE FROM subscriber_contacts
WHERE rowid IN (
    SELECT rid
    FROM (
        SELECT rowid AS rid,
               ROW_NUMBER() OVER (
                   PARTITION BY phone_number, email
                   ORDER BY created_at DESC, contact_id DESC
               ) AS rn
        FROM subscriber_contacts
    )
    WHERE rn > 1
);
```

---

## 5. Biểu Thức Chính Quy (Regular Expressions) Trong Oracle SQL

Oracle cung cấp 5 hàm xử lý Biểu thức chính quy cực mạnh tuân chuẩn POSIX ERE và Perl-influenced extensions:

### 5.1. Bảng Ký Hiệu Meta-characters & POSIX Character Classes Cần Nhớ

| Ký hiệu | Ý nghĩa | Ví dụ |
| :---: | :--- | :--- |
| `^` và `$` | Đầu chuỗi (`^`) và Cuối chuỗi (`$`) | `^VNPT` (Bắt đầu bằng `VNPT`) |
| `.` | Khớp bất kỳ 1 ký tự đơn nào (trừ ký tự xuống dòng `\n`, trừ khi bật cờ `'n'`) | `a.c` khớp `'abc'`, `'a1c'` |
| `*`, `+`, `?` | `*`: $\ge 0$ lần; `+`: $\ge 1$ lần; `?`: $0$ hoặc $1$ lần | `\d+` (1 hoặc nhiều chữ số) |
| `{m}`, `{m,n}` | Lặp đúng `m` lần, hoặc từ `m` đến `n` lần | `^\d{10}$` (Đúng 10 chữ số) |
| `[...]` và `[^...]` | Tập ký tự cho phép (`[abc]`) và Tập ký tự phủ định (`[^0-9]`: không phải số) | `[^0-9]` khớp chữ cái/ký tự đặc biệt |
| `\d` hoặc `[[:digit:]]` | Chữ số (`0-9`) | `[[:digit:]]{4}` |
| `\w` hoặc `[[:alnum:]]` | Chữ cái hoặc chữ số (`a-z`, `A-Z`, `0-9`, `_` với `\w`) | `[[:alpha:]]` (Chỉ chữ cái) |
| `\s` hoặc `[[:space:]]` | Khoảng trắng (Space, Tab, Newline) | `\s+` |
| `(...)` và `\1`, `\2` | Nhóm con (Subexpression / Capturing Group) và Tham chiếu ngược (Backreference) | `(\d{3})-(\d{4})` |

#### Các tham số khớp (`match_parameter`) dùng chung cho cả 5 hàm:
* `'i'`: **Case-insensitive** (Không phân biệt chữ hoa/thường).
* `'c'`: **Case-sensitive** (Phân biệt chữ hoa/thường).
* `'n'`: Cho phép dấu chấm (`.`) khớp luôn cả ký tự xuống dòng (`Newline`).
* `'m'`: **Multi-line mode** (Coi chuỗi có nhiều dòng; `^` và `$` khớp đầu/cuối của từng dòng bên trong chuỗi).
* `'x'`: Bỏ qua các khoảng trắng (whitespace) bên trong biểu thức mẫu regex để viết pattern dễ đọc hơn.

---

### 5.2. Chi Tiết 5 Hàm Regular Expression & Ví Dụ Thực Chiến

#### 1. `REGEXP_LIKE(source_char, pattern [, match_param])` — Kiểm tra điều kiện trong `WHERE` / `CHECK`
```sql
-- Tìm các thuê bao có số điện thoại di động VNPT hợp lệ (10 chữ số, bắt đầu bằng 088, 091, hoặc 094)
SELECT sub_id, full_name, phone_number
FROM subscribers
WHERE REGEXP_LIKE(phone_number, '^0(88|91|94)[0-9]{7}$');
```

#### 2. `REGEXP_SUBSTR(source_char, pattern [, position [, occurrence [, match_param [, subexpr]]]])` — Trích xuất chuỗi con
```sql
-- Trích xuất tên miền (domain) từ địa chỉ email (tham số subexpr = 1 lấy nhóm ngoặc tròn thứ nhất)
SELECT email,
       REGEXP_SUBSTR(email, '@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$', 1, 1, 'i', 1) AS domain_name
FROM users;
-- Ví dụ: 'dev@vnpt.vn' -> 'vnpt.vn'

-- Kỹ thuật kinh điển: Tách chuỗi phân cách bởi dấu phẩy ('JAVA,SQL,PLSQL') thành nhiều dòng!
SELECT TRIM(REGEXP_SUBSTR('JAVA,SQL,PLSQL', '[^,]+', 1, LEVEL)) AS skill_item
FROM dual
CONNECT BY LEVEL <= REGEXP_COUNT('JAVA,SQL,PLSQL', ',') + 1;
```

#### 3. `REGEXP_REPLACE(source_char, pattern [, replace_str [, position [, occurrence [, match_param]]]])` — Thay thế & Che giấu dữ liệu (Masking)
```sql
-- Che số điện thoại (Giữ 3 số đầu và 3 số cuối, thay 4 số giữa bằng '****') dùng Backreference \1 và \2:
SELECT phone_number,
       REGEXP_REPLACE(phone_number, '^(\d{3})\d{4}(\d{3})$', '\1****\2') AS masked_phone
FROM subscribers;
-- Kết quả: '0912345678' -> '091****678'

-- Chuẩn hóa khoảng trắng thừa (thay từ 2 khoảng trắng liên tiếp trở lên thành 1 khoảng trắng):
SELECT REGEXP_REPLACE('Nguyen    Van   An', '\s+', ' ') AS clean_name FROM dual;
-- Kết quả: 'Nguyen Van An'
```

#### 4. `REGEXP_INSTR(source_char, pattern [, position [, occurrence [, return_opt [, match_param [, subexpr]]]]])` — Tìm vị trí xuất hiện
* Đặc biệt chú ý tham số thứ 5 (`return_option`):
  * `return_option = 0` (Mặc định): Trả về vị trí ký tự **bắt đầu** của đoạn khớp.
  * `return_option = 1`: Trả về vị trí ký tự **ngay sau khi kết thúc** đoạn khớp!

#### 5. `REGEXP_COUNT(source_char, pattern [, position [, match_param]])` — Đếm số lần khớp mẫu
```sql
-- Đếm xem trong chuỗi log có bao nhiêu địa chỉ IP hoặc bao nhiêu từ 'ERROR' (không phân biệt hoa thường):
SELECT REGEXP_COUNT('Error 101: network error occurred. ERROR code 500.', 'error', 1, 'i') AS err_cnt
FROM dual;
-- Kết quả: 3
```

---

## 6. Chuẩn Hóa Cơ Sở Dữ Liệu (1NF, 2NF, 3NF, BCNF) & Denormalization

Kiến thức cốt lõi luôn xuất hiện trong các kỳ thi tuyển dụng Kỹ sư CNTT (VNPT, Viettel, Ngân hàng) và thiết kế Schema thực tế:

| Dạng chuẩn | Điều kiện bắt buộc | Dấu hiệu vi phạm & Cách khắc phục |
| :--- | :--- | :--- |
| **1NF** *(Dạng chuẩn 1)* | Mọi thuộc tính đều phải mang **giá trị nguyên tố (Atomic)**; không có nhóm lặp (Repeating groups) hoặc mảng nhiều giá trị trong 1 ô. | Một ô cột `PHONES` lưu `'0912345678, 0948889999'` $\rightarrow$ Tách thành bảng riêng hoặc tách từng dòng. |
| **2NF** *(Dạng chuẩn 2)* | Đạt **1NF** + Mọi thuộc tính không khóa phải **phụ thuộc hàm đầy đủ** vào toàn bộ Khóa chính (Không có **Phụ thuộc bộ phận - Partial Dependency** vào một phần của khóa chính ghép). | Bảng `ORDER_ITEMS(order_id, product_id, qty, product_name)` có PK là `(order_id, product_id)`, nhưng `product_name` chỉ phụ thuộc vào `product_id` $\rightarrow$ Tách `product_name` về bảng `PRODUCTS`. |
| **3NF** *(Dạng chuẩn 3)* | Đạt **2NF** + Không có thuộc tính không khóa nào phụ thuộc bắc cầu (**Transitive Dependency**) vào khóa chính thông qua một thuộc tính không khóa khác ($PK \rightarrow A \rightarrow B$). | Bảng `EMPLOYEES(emp_id PK, dept_id, dept_name)`: `emp_id -> dept_id -> dept_name` $\rightarrow$ Tách `dept_name` sang bảng `DEPARTMENTS`. |
| **BCNF** *(Boyce-Codd)* | Đạt **3NF** + Với mọi phụ thuộc hàm không tầm thường $X \rightarrow Y$, vế trái **$X$ bắt buộc phải là một Siêu khóa (Superkey)**. | Khắc phục các trường hợp bảng có nhiều khóa ứng viên (Candidate Keys) chồng lấn nhau. |

### Khi nào áp dụng Phi chuẩn hóa (Denormalization)?
* **Chuẩn hóa (`3NF`/`BCNF`)** giúp triệt tiêu dư thừa dữ liệu và tránh dị thường khi `INSERT/UPDATE/DELETE` (tối ưu cho **OLTP**).
* **Phi chuẩn hóa (`Denormalization`)** chủ động chấp nhận lưu dư thừa một số cột (ví dụ: lưu sẵn `customer_name`, `total_amount` ngay trên bảng `INVOICES` hoặc tạo Materialized View) nhằm **giảm số phép `JOIN` đắt đỏ**, giúp tăng tốc độ đọc báo cáo lớn (**OLAP / Data Warehouse / High-Read Systems**).

---

## 7. Bài Tập Thực Hành Tự Luyện (Kèm Lời Giải Chi Tiết)

### Đề bài thực hành:
Cho bảng `CUSTOMERS_RAW` chứa dữ liệu khách hàng nạp từ file Excel bị bẩn:
* Một số khách hàng bị trùng lặp `cccd_number` (cần giữ lại dòng có `updated_at` mới nhất, nếu trùng `updated_at` thì giữ dòng có `rowid` lớn nhất).
* Cột `full_name` bị dư nhiều khoảng trắng ở giữa các từ.
* Cần kiểm tra xem `cccd_number` có đúng định dạng 12 chữ số hay không.

Hãy viết:
1. Câu lệnh `SELECT` lọc ra các bản ghi có `cccd_number` KHÔNG phải là chuỗi đúng 12 chữ số.
2. Câu lệnh `DELETE` xóa sạch các bản ghi trùng `cccd_number` (chỉ giữ lại 1 bản ghi mới nhất cho mỗi `cccd_number`).

<details>
<summary><b>👉 Xem Lời Giải Chi Tiết</b></summary>

1. **Tìm các bản ghi có `cccd_number` sai định dạng 12 chữ số:**
```sql
SELECT customer_id, full_name, cccd_number
FROM customers_raw
WHERE NOT REGEXP_LIKE(cccd_number, '^\d{12}$')
   OR cccd_number IS NULL;
```

2. **Xóa dữ liệu trùng lặp `cccd_number` giữ lại dòng có `updated_at` mới nhất:**
```sql
DELETE FROM customers_raw
WHERE rowid IN (
    SELECT rid
    FROM (
        SELECT rowid AS rid,
               ROW_NUMBER() OVER (
                   PARTITION BY cccd_number
                   ORDER BY updated_at DESC NULLS LAST, rowid DESC
               ) AS rn
        FROM customers_raw
        WHERE cccd_number IS NOT NULL
    )
    WHERE rn > 1
);
```
</details>

---

## 8. Tổng Hợp Bẫy Thi OCA/OCP & Phỏng Vấn Cốt Lõi (Exam Essentials)

| # | Tình huống / Bẫy thường gặp trong đề thi | Quy tắc chuẩn Oracle / Cách nhận diện |
| :---: | :--- | :--- |
| **1** | Khi nào lệnh `MERGE` báo lỗi `ORA-30926: unable to get a stable set of rows`? | Khi bảng nguồn (`USING`) có **nhiều hơn 1 dòng cùng khớp** với 1 dòng trong bảng đích theo điều kiện `ON`. |
| **2** | Cập nhật cột nằm trong mệnh đề `ON (t.id = s.id)` của lệnh `MERGE` | **Báo lỗi `ORA-38104`** (Tuyệt đối cấm `UPDATE` bất kỳ cột nào xuất hiện trong điều kiện `ON`). |
| **3** | Mệnh đề `DELETE WHERE` trong `MERGE` xóa những dòng nào? | **Chỉ xóa các dòng trên bảng đích vừa được chạm tới bởi nhánh `UPDATE`**, và kiểm tra giá trị **sau khi đã `UPDATE`**. |
| **4** | Dùng `LOG ERRORS INTO err$_tab` nhưng quên ghi `REJECT LIMIT` | Giá trị mặc định là `REJECT LIMIT 0` $\rightarrow$ Gặp dòng lỗi đầu tiên câu lệnh DML vẫn bị dừng và Rollback! Cần ghi `REJECT LIMIT UNLIMITED`. |
| **5** | Viết `COUNT(CASE WHEN sal > 5000 THEN 1 ELSE 0 END)` | **Bẫy cực lớn:** Hàm `COUNT` đếm cả số `0` (vì `0` khác `NULL`) nên kết quả bằng `COUNT(*)`! Phải bỏ `ELSE 0` hoặc đổi `COUNT` thành `SUM`. |
| **6** | Kết quả của `SELECT * FROM emp WHERE ROWNUM = 2;` | Luôn trả về **0 dòng (No rows selected)** vì `ROWNUM` bắt đầu từ `1` và chỉ tăng lên `2` khi dòng `1` đã thỏa mãn `WHERE`. |
| **7** | Khác biệt giữa `FETCH FIRST 5 ROWS ONLY` và `FETCH FIRST 5 ROWS WITH TIES` | `ONLY` trả về tối đa đúng 5 dòng; `WITH TIES` trả về thêm cả các dòng thứ 6, 7... nếu chúng có cùng giá trị `ORDER BY` với dòng thứ 5. |
| **8** | Tại sao Keyset Pagination nhanh hơn Offset Pagination ở các trang sâu? | `OFFSET N` phải quét và đếm bỏ qua $N$ dòng; còn Keyset Pagination (`WHERE id < :last_id`) dùng B-Tree Index nhảy thẳng tới vị trí cần lấy. |
| **9** | Tham số `match_param` trong `REGEXP_LIKE(col, pattern, 'i')` | `'i'`: Không phân biệt hoa thường; `'c'`: Phân biệt hoa thường; `'n'`: Dấu `.` khớp cả xuống dòng; `'m'`: Đa dòng. |
| **10** | Bảng có khóa chính ghép `(A, B)` mà cột không khóa `C` chỉ phụ thuộc vào `A` | Vi phạm **Dạng chuẩn 2 (2NF)** do tồn tại phụ thuộc hàm bộ phận (Partial Dependency). |
