# Chương 2: Kiểu Dữ Liệu và Hàm Chuyển Đổi Trong Oracle - Oracle SQL OCA/OCP (1Z0-071)

> **Tài liệu tham chiếu:** *OCA/OCP Oracle Database SQL Certified Associate Study Guide (Exam 1Z0-071)* & *Oracle Database SQL Language Reference*.  
> **Mục tiêu khảo thí:** Oracle Built-in Data Types (`VARCHAR2`, `CHAR`, `NVARCHAR2`, `NUMBER(p,s)`, `DATE`, `TIMESTAMP`, `TIMESTAMP WITH TIME ZONE`, `TIMESTAMP WITH LOCAL TIME ZONE`, `INTERVAL YEAR TO MONTH`, `INTERVAL DAY TO SECOND`, `CLOB`, `BLOB`, `RAW`); Xử lý `NULL` và chuỗi rỗng `''`; Chuyển đổi kiểu dữ liệu ngầm định (Implicit) và tường minh (Explicit) cùng bẫy hiệu năng Index; Các hàm chuyển đổi `TO_CHAR`, `TO_DATE`, `TO_NUMBER`, `CAST`; Định dạng `RR` vs `YY` và bổ từ `FM`.

---

## 📑 Mục Lục Chi Tiết

1. [Nhóm Kiểu Dữ Liệu Chuỗi Ký Tự (`VARCHAR2`, `CHAR`, `NVARCHAR2`)](#1-nhóm-kiểu-dữ-liệu-chuỗi-ký-tự-varchar2-char-nvarchar2)
2. [Kiểu Dữ Liệu Số Học: `NUMBER(p, s)` & Các Trường Hợp Đặc Biệt](#2-kiểu-dữ-liệu-số-học-numberp-s--các-trường-hợp-đặc-biệt)
3. [Nhóm Kiểu Dữ Liệu Ngày Giờ (`DATE`, `TIMESTAMP`, Múi Giờ & `INTERVAL`)](#3-nhóm-kiểu-dữ-liệu-ngày-giờ-date-timestamp-múi-giờ--interval)
4. [Nhóm Dữ Liệu Lớn (LOBs) & Nhị Phân (`CLOB`, `BLOB`, `RAW`)](#4-nhóm-dữ-liệu-lớn-lobs--nhị-phân-clob-blob-raw)
5. [Bản Chất Của `NULL` và Quy Tắc Chuỗi Rỗng `'' IS NULL` Trong Oracle](#5-bản-chất-của-null-và-quy-tắc-chuỗi-rỗng--is-null-trong-oracle)
6. [Chuyển Đổi Kiểu Dữ Liệu Ngầm Định vs Tường Minh & Bẫy Hiệu Năng Index](#6-chuyển-đổi-kiểu-dữ-liệu-ngầm-định-vs-tường-minh--bẫy-hiệu-năng-index)
7. [Các Hàm Chuyển Đổi: `TO_CHAR`, `TO_DATE`, `TO_NUMBER`, `CAST`, `RR` vs `YY`, `FM`](#7-các-hàm-chuyển-đổi-to_char-to_date-to_number-cast-rr-vs-yy-fm)
8. [Bài Tập Thực Hành Tự Luyện (Hands-on Labs)](#8-bài-tập-thực-hành-tự-luyện-hands-on-labs)
9. [Tổng Hợp Bẫy Thi OCA/OCP Cốt Lõi Cần Nhớ (Exam Essentials)](#9-tổng-hợp-bẫy-thi-ocaocp-cốt-lõi-cần-nhớ-exam-essentials)

---

## 1. Nhóm Kiểu Dữ Liệu Chuỗi Ký Tự (`VARCHAR2`, `CHAR`, `NVARCHAR2`)

### 1.1. So sánh chi tiết `VARCHAR2`, `CHAR`, `NVARCHAR2`, `NCHAR`

| Kiểu dữ liệu | Cú pháp khai báo | Đặc điểm lưu trữ | Kích thước tối đa |
| :--- | :--- | :--- | :--- |
| **`VARCHAR2(size [BYTE \| CHAR])`** | **Bắt buộc** phải chỉ định `size` (ví dụ `VARCHAR2(50)`). | Độ dài **biến đổi (Variable-length)**. Chỉ chiếm đúng số byte thực tế của chuỗi lưu vào. Không tự động đệm khoảng trắng. | **4.000 bytes** (chuẩn `STANDARD`) hoặc **32.767 bytes** (khi bật `MAX_STRING_SIZE = EXTENDED` từ Oracle 12c+). |
| **`CHAR[(size [BYTE \| CHAR])]`** | `size` là tùy chọn; nếu bỏ qua `CHAR`, mặc định là **`CHAR(1)`**. | Độ dài **cố định (Fixed-length)**. Nếu chuỗi ngắn hơn `size`, Oracle **tự động đệm thêm khoảng trắng (blank-padded)** vào bên phải cho đủ độ dài `size`. | **2.000 bytes**. |
| **`NVARCHAR2(size)`** | **Bắt buộc** chỉ định `size` (luôn tính theo **số lượng ký tự - characters**). | Độ dài biến đổi, sử dụng bộ mã quốc tế **National Character Set** (AL16UTF16 hoặc UTF8) để lưu đa ngôn ngữ (tiếng Việt, Nhật, Trung...). | **4.000 bytes** (STANDARD) hoặc **32.767 bytes** (EXTENDED). Với AL16UTF16 (2 bytes/ký tự), chuẩn STANDARD lưu tối đa 2.000 ký tự. |
| **`NCHAR[(size)]`** | Mặc định `NCHAR(1)`, `size` luôn tính theo **ký tự**. | Độ dài cố định theo bộ mã Unicode (`AL16UTF16` / `UTF8`), tự động đệm khoảng trắng. | **2.000 bytes**. |

> [!TIP]
> **Tại sao dùng `VARCHAR2` thay vì `VARCHAR`?** Trong Oracle, `VARCHAR` hiện tại là từ đồng nghĩa của `VARCHAR2`, nhưng Oracle khuyến cáo **luôn luôn dùng `VARCHAR2`** vì `VARCHAR` được hãng giữ chỗ để có thể thay đổi hành vi trong tương lai (ví dụ phân biệt chuỗi rỗng và `NULL` theo chuẩn ANSI).

### 1.2. Đơn vị đo `BYTE` vs `CHAR` trong `VARCHAR2` và `CHAR`
Khi khai báo `VARCHAR2(10)`, mặc định Oracle hiểu là `10 BYTE` hay `10 CHAR` phụ thuộc vào tham số `NLS_LENGTH_SEMANTICS` (mặc định là `BYTE`).
* Với bộ mã UTF-8 (`AL32UTF8`), các ký tự tiếng Việt có dấu (như `'ệ'`, `'ư'`) chiếm từ **2 đến 3 bytes/ký tự**.
* Nếu cột khai báo là `VARCHAR2(5 BYTE)`, bạn **không thể** lưu chuỗi `'Việt'` (vì `'V'`=1, `'i'`=1, `'ệ'`=3, `'t'`=1 → tổng cộng **6 bytes** > 5 bytes, gây lỗi `ORA-12899: value too large for column`).
* Nếu khai báo tường minh là `VARCHAR2(5 CHAR)`, cột sẽ lưu được tối đa **5 ký tự** bất kể mỗi ký tự chiếm mấy byte (miễn tổng số byte không vượt trần 4.000 bytes).

### 1.3. Minh họa sự khác biệt giữa `CHAR` và `VARCHAR2`
```sql
CREATE TABLE test_strings (
    col_char     CHAR(6),
    col_varchar2 VARCHAR2(6)
);

INSERT INTO test_strings VALUES ('ABC', 'ABC');

SELECT col_char,
       LENGTH(col_char)     AS len_char,
       col_varchar2,
       LENGTH(col_varchar2) AS len_varchar2
FROM test_strings;
```

**Kết quả đầu ra:**
| COL_CHAR | LEN_CHAR | COL_VARCHAR2 | LEN_VARCHAR2 |
| :--- | :---: | :--- | :---: |
| `'ABC   '` | 6 | `'ABC'` | 3 |

> [!WARNING]
> **Bẫy thi so sánh `CHAR` và `VARCHAR2`:**
> * Khi so sánh một cột `CHAR(6)` chứa `'ABC   '` với một cột hoặc hằng `VARCHAR2` `'ABC'`:
>   * Nếu so sánh hai giá trị kiểu `CHAR`, Oracle dùng quy tắc **Blank-Padded Comparison**: `'ABC' = 'ABC   '` trả về **`TRUE`**.
>   * Nhưng nếu ít nhất một vế là **`VARCHAR2`**, Oracle dùng quy tắc **Nonpadded Comparison** (so sánh từng ký tự kể cả khoảng trắng): `'ABC   '` (từ cột `CHAR(6)`) so sánh với biến `VARCHAR2` chứa `'ABC'` sẽ trả về **`FALSE`** vì `LENGTH` khác nhau (6 vs 3)!
>   * Đặc biệt lưu ý: một hằng chuỗi literal `'ABC'` trong câu lệnh SQL được xem là kiểu `CHAR` cố định nên `col_char = 'ABC'` vẫn khớp, nhưng `col_char = col_varchar2` sẽ trả về **`FALSE`**!

---

## 2. Kiểu Dữ Liệu Số Học: `NUMBER(p, s)` & Các Trường Hợp Đặc Biệt

Kiểu dữ liệu `NUMBER(p, s)` lưu trữ số nguyên, số thực dấu phẩy tĩnh (fixed-point) và dấu phẩy động (floating-point) với độ chính xác tuyệt đối, rất quan trọng cho các bài toán tài chính – viễn thông.

### 2.1. Ý nghĩa của Precision (`p`) và Scale (`s`)
* **`p` (Precision - Độ chính xác / Tổng số chữ số có nghĩa):** Tổng số chữ số tối đa (cả trước và sau dấu thập phân, không tính dấu chấm và dấu âm). Giá trị của `p` nằm trong khoảng từ **`1` đến `38`**.
* **`s` (Scale - Phần thập phân / Độ lệch làm tròn):** Số chữ số bên phải dấu thập phân. Giá trị của `s` nằm trong khoảng từ **`-84` đến `127`**.
* Nếu chỉ viết `NUMBER` (không truyền `p, s`): Lưu số thực dấu phẩy động với độ chính xác tối đa 38 chữ số.
* Nếu viết `NUMBER(p)` (không truyền `s`): Tương đương `NUMBER(p, 0)`, tức là **số nguyên** (nếu chèn số có phần thập phân sẽ tự động làm tròn thành số nguyên!).

### 2.2. Bảng phân tích các kịch bản `NUMBER(p, s)` (Cực kỳ hay ra thi!)

Số chữ số tối đa được phép có ở **phần nguyên (bên trái dấu chấm)** được tính bằng công thức: **`p - s`**.
* Nếu số chữ số phần nguyên sau khi làm tròn **vượt quá `p - s`** → Oracle **BÁO LỖI** `ORA-01438: value larger than specified precision allowed for this column`.
* Nếu số chữ số phần thập phân **vượt quá `s`** → Oracle **KHÔNG báo lỗi**, mà **TỰ ĐỘNG LÀM TRÒN (Round)** tới `s` chữ số thập phân!

| Khai báo cột | Giá trị đưa vào (`INSERT`) | Giá trị lưu thực tế trong DB | Giải thích chi tiết |
| :--- | :---: | :---: | :--- |
| `NUMBER(6, 2)` | `1234.56` | `1234.56` | Phần nguyên tối đa `6 - 2 = 4` chữ số (`1234`), thập phân 2 chữ số (`56`). Hợp lệ! |
| `NUMBER(6, 2)` | `1234.567` | **`1234.57`** | Phần thập phân `.567` dài hơn 2 nên tự động **làm tròn** thành `.57`. |
| `NUMBER(6, 2)` | `12345.6` | **LỖI `ORA-01438`** | Phần nguyên có `5` chữ số (`12345`), vượt quá giới hạn `6 - 2 = 4` chữ số phần nguyên! |
| `NUMBER(6, 2)` | `9999.999` | **LỖI `ORA-01438`** | Khi làm tròn `.999` thành `1.00`, số biến thành `10000.00` (5 chữ số phần nguyên > 4). |
| `NUMBER(5)` | `123.89` | **`124`** | `NUMBER(5)` tương đương `NUMBER(5, 0)`. Làm tròn phần thập phân `.89` lên `124`. |
| **`NUMBER(5, -2)`** | `12345.67` | **`12300`** | **Scale âm (`s = -2`):** Làm tròn **sang bên trái dấu thập phân** `2` hàng (hàng chục và hàng đơn vị, tức làm tròn đến hàng trăm)! |
| **`NUMBER(5, -2)`** | `12367` | **`12400`** | Làm tròn đến hàng trăm gần nhất (`67 >= 50` nên tăng lên `400`). |
| **`NUMBER(2, 4)`** | `0.0012` | **`0.0012`** | **`s > p`:** Chỉ lưu được các số nhỏ hơn `0.01` (phải có ít nhất `s - p = 4 - 2 = 2` chữ số `0` ngay sau dấu chấm thập phân!). |
| **`NUMBER(2, 4)`** | `0.012` | **LỖI `ORA-01438`** | Chỉ có 1 chữ số `0` sau dấu chấm (thiếu số 0 bắt buộc khi `s > p`). |

---

## 3. Nhóm Kiểu Dữ Liệu Ngày Giờ (`DATE`, `TIMESTAMP`, Múi Giờ & `INTERVAL`)

### 3.1. Kiểu `DATE` truyền thống của Oracle
> [!IMPORTANT]
> **Khác biệt lớn nhất của Oracle `DATE` so với ANSI SQL / MySQL:**
> Trong Oracle Database, kiểu dữ liệu **`DATE` LUÔN LUÔN lưu trữ cả NGÀY lẫn GIỜ** (chi tiết đến từng giây)!
> Cụ thể, một giá trị `DATE` chiếm cố định **7 bytes**, lưu đủ 7 thành phần:
> **Thế kỷ (Century), Năm (Year), Tháng (Month), Ngày (Day), Giờ (Hour), Phút (Minute), và Giây (Second).**
> Mặc dù khi hiển thị trên màn hình (theo mặc định `NLS_DATE_FORMAT = 'DD-MON-RR'`), bạn chỉ thấy `'15-MAY-26'`, nhưng bên dưới cơ sở dữ liệu vẫn đang lưu cả giờ-phút-giây (nếu khi `INSERT` chỉ truyền ngày mà không truyền giờ, phần giờ mặc định là `00:00:00` tức nửa đêm).

### 3.2. Các kiểu `TIMESTAMP` và Múi giờ (Time Zone)

| Kiểu dữ liệu | Cú pháp & Mặc định | Đặc điểm & Hành vi xử lý múi giờ |
| :--- | :--- | :--- |
| **`TIMESTAMP[(p)]`** | `p` từ `0` đến `9`, mặc định **`p = 6`** (microseconds). | Mở rộng kiểu `DATE`, lưu thêm **phần lẻ của giây (Fractional Seconds)** tới độ chính xác nanosecond (`p=9`). Không lưu múi giờ. |
| **`TIMESTAMP[(p)] WITH TIME ZONE`** | Lưu cả ngày giờ, phần lẻ giây và **độ lệch múi giờ (Time Zone Offset / Region)** (ví dụ `+07:00` hoặc `'Asia/Ho_Chi_Minh'`). | Giữ nguyên chính xác múi giờ gốc lúc đưa dữ liệu vào. Hai người dùng ở hai quốc gia khác nhau truy vấn sẽ thấy cùng một chuỗi múi giờ đã lưu. |
| **`TIMESTAMP[(p)] WITH LOCAL TIME ZONE`** | Lưu ngày giờ + phần lẻ giây, **KHÔNG lưu múi giờ trực tiếp kèm theo giá trị**. | Khi `INSERT`, Oracle tự động quy đổi thời gian về múi giờ chuẩn của Database (`DBTIMEZONE`) để lưu. Khi `SELECT`, Oracle **tự động quy đổi ngược lại sang múi giờ phiên làm việc của người dùng hiện tại (`SESSIONTIMEZONE`)**! |

**Ví dụ minh họa `TIMESTAMP WITH LOCAL TIME ZONE`:**
Giả sử Database đặt tại Singapore (`DBTIMEZONE = '+08:00'`):
1. Lập trình viên A ở Hà Nội (`SESSIONTIMEZONE = '+07:00'`) chèn lúc `09:00:00` sáng giờ Hà Nội vào cột `TIMESTAMP WITH LOCAL TIME ZONE`.
2. Oracle chuyển đổi thành `10:00:00` (giờ DB `+08:00`) để lưu xuống đĩa.
3. Lập trình viên B ở Tokyo (`SESSIONTIMEZONE = '+09:00'`) thực hiện `SELECT` cột đó → Oracle tự động hiển thị trên màn hình của B là **`11:00:00`**!

### 3.3. Nhóm kiểu khoảng thời gian `INTERVAL`
Trong khi `DATE` và `TIMESTAMP` lưu một **mốc thời gian cụ thể (point in time)**, kiểu `INTERVAL` lưu một **khoảng độ dài thời gian (duration)**:

1. **`INTERVAL YEAR[(year_precision)] TO MONTH`:**
   * Lưu khoảng thời gian tính bằng **Năm và Tháng** (mặc định `year_precision = 2`, tức tối đa 99 năm).
   * Ví dụ hằng: `INTERVAL '3-6' YEAR TO MONTH` (3 năm và 6 tháng), hoặc `INTERVAL '200' YEAR(3)` (200 năm — phải khai báo `YEAR(3)` vì `200` có 3 chữ số!).
2. **`INTERVAL DAY[(day_precision)] TO SECOND[(fractional_seconds_precision)]`:**
   * Lưu khoảng thời gian tính bằng **Ngày, Giờ, Phút, Giây** (mặc định `day_precision = 2` tức tối đa 99 ngày, `fractional_seconds_precision = 6`).
   * Ví dụ hằng: `INTERVAL '5 12:30:00' DAY TO SECOND` (5 ngày, 12 giờ, 30 phút, 0 giây).

```sql
-- Cộng khoảng thời gian vào một ngày dùng INTERVAL:
SELECT DATE '2026-01-15' + INTERVAL '1-2' YEAR TO MONTH AS future_date,
       TIMESTAMP '2026-01-15 08:00:00' + INTERVAL '10 04:30:00' DAY TO SECOND AS future_ts
FROM dual;
```

**Kết quả đầu ra:**
| FUTURE_DATE | FUTURE_TS |
| :--- | :--- |
| `2027-03-15 00:00:00` | `2026-01-25 12:30:00` |

### 3.4. Phép toán số học trên kiểu `DATE` (Date Arithmetic)
| Phép toán | Kiểu dữ liệu trả về | Ý nghĩa |
| :--- | :--- | :--- |
| `date + number` | `DATE` | Cộng thêm `number` **ngày** vào mốc `date` (ví dụ `SYSDATE + 1` là ngày mai, `SYSDATE + 1/24` là 1 giờ sau). |
| `date - number` | `DATE` | Trừ bớt `number` **ngày** khỏi mốc `date`. |
| `date1 - date2` | `NUMBER` | Trả về **số ngày chênh lệch** giữa hai mốc ngày (có cả phần thập phân nếu lệch giờ). |
| `date1 + date2` | **LỖI (`ORA-00975`)** | Không bao giờ được cộng hai mốc ngày với nhau! |

---

## 4. Nhóm Dữ Liệu Lớn (LOBs) & Nhị Phân (`CLOB`, `BLOB`, `RAW`)

Khi dữ liệu văn bản hoặc nhị phân vượt quá giới hạn của `VARCHAR2` (4.000 / 32.767 bytes), Oracle cung cấp các kiểu dữ liệu **LOB (Large Objects)** có khả năng lưu trữ từ **8 Terabytes đến 128 Terabytes** (tùy kích thước Database Block):

| Kiểu dữ liệu | Tên đầy đủ | Mục đích sử dụng | Lưu ý và Hạn chế trong SQL |
| :--- | :--- | :--- | :--- |
| **`CLOB`** | **Character Large Object** | Lưu trữ văn bản dung lượng cực lớn (tài liệu XML, JSON, HTML, bài viết dài, log hệ thống) theo bộ mã Database Character Set. | Một bảng có thể chứa **nhiều cột `CLOB`/`BLOB`**. Không thể dùng cột `CLOB` trực tiếp trong mệnh đề `GROUP BY`, `ORDER BY`, `DISTINCT` hoặc làm `PRIMARY KEY`. |
| **`NCLOB`** | **National Character Large Object** | Giống `CLOB` nhưng lưu theo bộ mã Unicode quốc gia (National Character Set). | Tương tự `CLOB`. |
| **`BLOB`** | **Binary Large Object** | Lưu trữ dữ liệu nhị phân phi cấu trúc dung lượng lớn (file ảnh, video, âm thanh, PDF, file nén). | Lưu trữ hoàn toàn bên trong Database (có tham gia Transaction và Backup). |
| **`BFILE`** | **Binary File** | Chỉ lưu **con trỏ (pointer / locator)** trỏ tới một file nhị phân nằm trên hệ điều hành bên ngoài Database. | **Chỉ đọc (Read-only)**, không tham gia vào Transaction (`COMMIT`/`ROLLBACK`) của Oracle. |
| **`RAW(size)`** | **Raw Binary Data** | Lưu chuỗi byte nhị phân kích thước nhỏ (như mã băm MD5/SHA-256, khóa mã hóa, UUID dạng byte). Kích thước tối đa **2.000 bytes** (STANDARD) hoặc **32.767 bytes** (EXTENDED). | Không bị Oracle tự động chuyển đổi bộ mã ký tự (character set conversion) khi truyền qua mạng giữa Client và Server. |

> [!WARNING]
> **Bẫy thi Kiểu dữ liệu cũ `LONG` và `LONG RAW`:**
> Trong các phiên bản cũ, Oracle có kiểu `LONG` và `LONG RAW` (tối đa 2GB), mỗi bảng chỉ được phép có **tối đa 1 cột `LONG`**. Hiện nay cả hai đã bị **Deprecated** và chỉ giữ lại để tương thích ngược; Oracle yêu cầu luôn dùng **`CLOB`** và **`BLOB`** (một bảng có thể có nhiều cột `CLOB`/`BLOB`).

---

## 5. Bản Chất Của `NULL` và Quy Tắc Chuỗi Rỗng `'' IS NULL` Trong Oracle

### 5.1. Định nghĩa `NULL`
* `NULL` đại diện cho một giá trị **chưa biết (unknown)**, **không tồn tại (unavailable)**, hoặc **chưa được gán (unassigned)**.
* **`NULL` KHÔNG PHẢI là số `0`**, cũng **KHÔNG PHẢI là khoảng trắng `' '`**.

### 5.2. Quy tắc đặc trưng của Oracle: Chuỗi rỗng `''` chính là `NULL`!
Trong nhiều ngôn ngữ lập trình (Java, Python) hoặc các hệ quản trị CSDL khác (PostgreSQL, MySQL, SQL Server), chuỗi rỗng `''` (chuỗi có độ dài bằng 0) là một giá trị khác với `NULL`.
> [!CAUTION]
> **QUY TẮC BẤT DI BẤT DỊCH TRONG ORACLE SQL:**
> Trong Oracle Database, **chuỗi rỗng `''` (hai dấu nháy đơn viết liền nhau không có khoảng trắng ở giữa) được đối xử HOÀN TOÀN ĐỒNG NHẤT với `NULL`!**
> * Biểu thức `'' IS NULL` luôn luôn trả về **`TRUE`**.
> * Biểu thức `'' = ''` tương đương `NULL = NULL`, trả về **`UNKNOWN`** (không phải `TRUE`!).
> * Ngược lại, chuỗi chứa một dấu cách `' '` (Space) là một chuỗi có độ dài bằng 1 (`LENGTH(' ') = 1`) và **`' ' IS NOT NULL`**.

### 5.3. Quy tắc `NULL` trong Phép toán số học vs Phép nối chuỗi `||`
Đây là sự tương phản cực kỳ quan trọng trong đề thi:
1. **Trong phép toán số học (`+`, `-`, `*`, `/`):**
   * Bất kỳ phép tính số học nào có sự tham gia của `NULL` đều cho kết quả là **`NULL`**!
   * Ví dụ: `1000 + NULL` → **`NULL`**; `500 * NULL` → **`NULL`**; `NULL / 0` → **`NULL`** (thậm chí không báo lỗi chia cho 0 vì biểu thức trả về `NULL` ngay lập tức!).
2. **Trong phép nối chuỗi (`||`) hoặc hàm `CONCAT`:**
   * Oracle xem `NULL` trong phép nối chuỗi như một chuỗi rỗng (bỏ qua `NULL`) và nối các chuỗi còn lại bình thường!
   * Ví dụ: `'Oracle' || NULL || 'SQL'` → **`'OracleSQL'`**.
   * Chỉ khi nối hoàn toàn các giá trị `NULL` với nhau (`NULL || NULL`) thì kết quả mới là **`NULL`**.

```sql
SELECT 5000 + NULL                   AS math_with_null,
       'Hello ' || NULL || 'World!'  AS concat_with_null,
       LENGTH('')                    AS len_empty_str,
       LENGTH(' ')                   AS len_space_str
FROM dual;
```

**Kết quả đầu ra:**
| MATH_WITH_NULL | CONCAT_WITH_NULL | LEN_EMPTY_STR | LEN_SPACE_STR |
| :---: | :--- | :---: | :---: |
| *(null)* | `Hello World!` | *(null)* | `1` |

---

## 6. Chuyển Đổi Kiểu Dữ Liệu Ngầm Định vs Tường Minh & Bẫy Hiệu Năng Index

Khi một biểu thức có sự lệch kiểu dữ liệu, Oracle hỗ trợ hai cơ chế chuyển đổi:
1. **Implicit Data Type Conversion (Chuyển đổi ngầm định):** Oracle tự động ép kiểu ngầm bên dưới.
2. **Explicit Data Type Conversion (Chuyển đổi tường minh):** Lập trình viên chủ động gọi các hàm `TO_CHAR`, `TO_NUMBER`, `TO_DATE`, `CAST`.

### 6.1. Quy tắc chuyển đổi ngầm định của Oracle
Oracle có thể tự động chuyển đổi hai chiều giữa:
* `VARCHAR2` / `CHAR` $\leftrightarrow$ `NUMBER` (nếu chuỗi chỉ chứa các ký tự số hợp lệ, ví dụ `'1500' + 500` $\rightarrow$ `2000`).
* `VARCHAR2` / `CHAR` $\leftrightarrow$ `DATE` (nếu chuỗi khớp chính xác với định dạng `NLS_DATE_FORMAT` của phiên làm việc hiện tại).
* ⚠️ **Lưu ý:** Không có chuyển đổi ngầm định trực tiếp giữa `DATE` và `NUMBER`!

### 6.2. Bẫy Hiệu Năng "Sát Thủ" (Index Suppression Trap) khi ép kiểu ngầm định!
Hãy xét một tình huống thực tế kinh điển tại các hệ thống viễn thông / ngân hàng (cũng là câu hỏi tủ trong đề thi tuyển dụng/sát hạch VNPT và OCP):

Giả sử bảng `CUSTOMERS` có 50 triệu thuê bao. Cột số điện thoại `PHONE_NUMBER` được khai báo kiểu **`VARCHAR2(15)`** và đã được đánh **B-Tree Index** (`idx_cust_phone`).
Một lập trình viên vô tình viết câu truy vấn tìm thuê bao bằng hằng số (quên cặp dấu nháy đơn):

```sql
-- ❌ TRUY VẤN THẢM HỌA HIỆU NĂNG (Truyền NUMBER vào cột VARCHAR2):
SELECT customer_id, full_name
FROM customers
WHERE phone_number = 912345678;
```

**Tại sao câu truy vấn trên làm treo hệ thống (Không dùng được Index)?**
* Trong thứ tự ưu tiên kiểu dữ liệu của Oracle, kiểu **`NUMBER` có độ ưu tiên cao hơn kiểu `VARCHAR2`**.
* Do đó, khi so sánh `varchar2_col = number_literal`, Oracle **KHÔNG** biến số `912345678` thành chuỗi `'912345678'`, mà ngược lại, bộ Optimizer sẽ viết lại câu truy vấn thành:
  ```sql
  WHERE TO_NUMBER(phone_number) = 912345678
  ```
* Việc bọc hàm `TO_NUMBER(...)` lên trên cột `phone_number` làm **vô hiệu hóa hoàn toàn B-Tree Index** thông thường trên cột đó! Oracle buộc phải thực hiện **Full Table Scan (Quét toàn bộ 50 triệu dòng)**. Hơn nữa, nếu trong 50 triệu dòng có bất kỳ dòng nào chứa ký tự chữ (như `'+84912...'` hoặc `'N/A'`), câu truy vấn sẽ lập tức chết giữa chừng với lỗi **`ORA-01722: invalid number`**!

**Cách viết đúng chuẩn (Tận dụng Index Range Scan / Unique Scan):**
```sql
-- ✅ TRUY VẤN CHUẨN (Truyền đúng kiểu VARCHAR2 bằng dấu nháy đơn):
SELECT customer_id, full_name
FROM customers
WHERE phone_number = '0912345678';
```

---

## 7. Các Hàm Chuyển Đổi: `TO_CHAR`, `TO_DATE`, `TO_NUMBER`, `CAST`, `RR` vs `YY`, `FM`

```
        to_date / to_timestamp                 to_number
      ────────────────────────►              ◄────────────────────────
DATE /                         VARCHAR2 /                             NUMBER
TIMESTAMP                      CHAR
      ◄────────────────────────              ────────────────────────►
               to_char                                to_char
```

### 7.1. Hàm `TO_CHAR(datetime, 'format_model', 'nlsparam')`
Chuyển đổi giá trị `DATE` hoặc `TIMESTAMP` sang chuỗi `VARCHAR2` theo mẫu định dạng:

| Phần tử định dạng | Ý nghĩa | Ví dụ (với ngày `05-MAY-2026 14:08:09`) |
| :--- | :--- | :--- |
| `YYYY` | Năm đầy đủ 4 chữ số | `'2026'` |
| `YEAR` | Năm viết bằng chữ tiếng Anh | `'TWENTY TWENTY-SIX'` |
| `MM` | Tháng dạng 2 chữ số (`01`–`12`) | `'05'` |
| `MONTH` | Tên tháng đầy đủ (**mặc định đệm khoảng trắng cho đủ 9 ký tự!**) | `'MAY      '` (dài 9 ký tự) |
| `MON` | Tên tháng viết tắt 3 chữ cái | `'MAY'` |
| `DD` | Ngày trong tháng (`01`–`31`) | `'05'` |
| `DAY` | Tên thứ trong tuần (**mặc định đệm khoảng trắng cho đủ 9 ký tự!**) | `'TUESDAY  '` |
| `DY` | Tên thứ viết tắt 3 chữ cái | `'TUE'` |
| `HH24` / `HH` (`HH12`) | Giờ hệ 24h (`00`–`23`) / Giờ hệ 12h (`01`–`12`) | `'14'` / `'02'` |
| `MI` | Phút (`00`–`59`) — *(Lưu ý: dùng `MI` chứ không dùng `MM`!)* | `'08'` |
| `SS` | Giây (`00`–`59`) | `'09'` |
| `TH` / `SP` / `SPTH` | Hậu tố số thứ tự (`05TH`) / Đánh vần số (`FIVE`) / Số thứ tự đánh vần (`FIFTH`) | `'05TH'` / `'FIVE'` / `'FIFTH'` |
| `"text"` | Chèn chuỗi văn bản tĩnh vào giữa định dạng ngày (đặt trong **nháy kép**) | `'DD "of" MONTH'` $\rightarrow$ `'05 of MAY      '` |

### 7.2. Bổ từ `FM` (Fill Mode) trong `TO_CHAR`
Mặc định, định dạng `MONTH` và `DAY` luôn đệm thêm khoảng trắng bên phải cho đủ 9 ký tự (chiều dài của từ `SEPTEMBER` / `WEDNESDAY`), và các số như `DD`, `MM` luôn có số `0` đứng đầu (`05`).
Khi thêm tiền tố **`FM` (Fill Mode)** vào chuỗi định dạng:
1. **Xóa toàn bộ khoảng trắng đệm thừa (trailing blanks)** của `MONTH`, `DAY`.
2. **Xóa số `0` đứng đầu (leading zeroes)** của các thành phần số như `DD`, `MM`, `HH`.
3. ⚠️ *Lưu ý nâng cao:* `FM` hoạt động như một công tắc bật/tắt (toggle): xuất hiện lần 1 trong chuỗi định dạng là BẬT chế độ gọn, nếu xuất hiện lần 2 trong cùng chuỗi định dạng sẽ TẮT chế độ gọn!

```sql
SELECT '[' || TO_CHAR(DATE '2026-05-05', 'Month DD, YYYY')   || ']' AS without_fm,
       '[' || TO_CHAR(DATE '2026-05-05', 'fmMonth DD, YYYY') || ']' AS with_fm
FROM dual;
```

**Kết quả đầu ra:**
| WITHOUT_FM | WITH_FM |
| :--- | :--- |
| `[May       05, 2026]` | `[May 5, 2026]` |

### 7.3. Hàm `TO_CHAR(number, 'format_model')` và `TO_NUMBER(char, 'format_model')`

| Ký hiệu định dạng số | Ý nghĩa | Ví dụ `TO_CHAR(value, format)` | Kết quả |
| :--- | :--- | :--- | :--- |
| `9` | Đại diện cho 1 chữ số (nếu phần nguyên không có thì để khoảng trắng, không hiện số `0` vô nghĩa). | `TO_CHAR(125, '99999')` | `'   125'` (có khoảng trắng đầu cho dấu dương và chữ số trống) |
| `0` | Bắt buộc hiển thị số `0` ở đầu (Leading zero). | `TO_CHAR(125, '09999')` | `' 00125'` |
| `$` / `L` | Ký hiệu đô la `$` / Ký hiệu tiền tệ nội tệ (`NLS_CURRENCY`). | `TO_CHAR(1250, '$9,999.00')` | `' $1,250.00'` |
| `.` / `D` | Dấu chấm thập phân / Dấu phân cách thập phân theo NLS. | `TO_CHAR(12.3, '99.99')` | `' 12.30'` |
| `,` / `G` | Dấu phẩy phân cách hàng nghìn / Dấu phân cách nhóm theo NLS. | `TO_CHAR(1234567, '9,999,999')` | `' 1,234,567'` |

> [!WARNING]
> **Bẫy tràn định dạng số (`######`) trong `TO_CHAR`:**
> Nếu số chữ số ở **phần nguyên** của con số lớn hơn số lượng ký tự `9` (hoặc `0`) bạn khai báo trong chuỗi format của `TO_CHAR`, Oracle **KHÔNG báo lỗi**, mà trả về một chuỗi toàn các dấu thăng **`'######'`**!
> Ví dụ: `TO_CHAR(12345, '999.99')` $\rightarrow$ **`'#######'`** (vì format chỉ cho phép tối đa 3 chữ số phần nguyên nhưng số đầu vào có 5 chữ số).

### 7.4. Hàm `TO_DATE` và Quy tắc Thế kỷ `RR` vs `YY` (Cực kỳ quan trọng!)
Khi chuyển một chuỗi ngày chỉ có **2 chữ số của năm** (ví dụ `'27-OCT-95'` hoặc `'27-OCT-18'`) sang kiểu `DATE`:
* Định dạng **`YY`:** Luôn lấy **cùng thế kỷ với năm hiện tại của hệ thống (`SYSDATE`)**!
  * Năm hiện tại là **2026** (thế kỷ 21, đầu `20xx`). Nếu dùng `'DD-MON-YY'`, thì `'95'` sẽ biến thành năm **`2095`**, và `'18'` biến thành năm **`2018`**.
* Định dạng **`RR`:** Tính thế kỷ dựa trên **sự kết hợp giữa 2 chữ số cuối của năm hiện tại** và **2 chữ số của năm đưa vào** theo bảng ma trận 50 năm sau:

| Năm hiện tại (2 số cuối) | Năm nhập vào `00` – `49` | Năm nhập vào `50` – `99` |
| :--- | :--- | :--- |
| **`00` – `49`** *(Ví dụ năm hiện tại là **2026**)* | **Cùng thế kỷ hiện tại (`20xx`)**<br>Ví dụ: `'18'` $\rightarrow$ **`2018`** | **Thế kỷ TRƯỚC (`19xx`)**<br>Ví dụ: `'95'` $\rightarrow$ **`1995`** |
| **`50` – `99`** *(Ví dụ năm hiện tại là **2055**)* | **Thế kỷ TIẾP THEO (`21xx`)**<br>Ví dụ: `'18'` $\rightarrow$ **`2118`** | **Cùng thế kỷ hiện tại (`20xx`)**<br>Ví dụ: `'95'` $\rightarrow$ **`2095`** |

```sql
-- Giả sử năm hệ thống hiện tại là 2026 (thuộc khoảng 00-49):
SELECT TO_CHAR(TO_DATE('15-OCT-95', 'DD-MON-YY'), 'YYYY') AS yy_95,
       TO_CHAR(TO_DATE('15-OCT-95', 'DD-MON-RR'), 'YYYY') AS rr_95,
       TO_CHAR(TO_DATE('15-OCT-25', 'DD-MON-RR'), 'YYYY') AS rr_25
FROM dual;
```

**Kết quả đầu ra:**
| YY_95 | RR_95 | RR_25 |
| :---: | :---: | :---: |
| `2095` | `1995` | `2025` |

### 7.5. Hàm chuẩn ANSI `CAST(expression AS data_type)`
Hàm `CAST` là hàm chuyển đổi kiểu dữ liệu theo chuẩn ANSI SQL, cho phép ép kiểu tường minh giữa các kiểu dữ liệu (kể cả `TIMESTAMP`, `INTERVAL`, `VARCHAR2(n)`, `NUMBER(p,s)`):
```sql
SELECT CAST('1234.567' AS NUMBER(6,1))        AS cast_num,
       CAST(12345 AS VARCHAR2(10))            AS cast_str,
       CAST(DATE '2026-05-20' AS TIMESTAMP)   AS cast_ts
FROM dual;
```

**Kết quả đầu ra:**
| CAST_NUM | CAST_STR | CAST_TS |
| :---: | :--- | :--- |
| `1234.6` | `'12345'` | `2026-05-20 00:00:00.000000` |

---

## 8. Bài Tập Thực Hành Tự Luyện (Hands-on Labs)

### Bài tập 1: Tính toán kết quả lưu trữ của `NUMBER(p, s)`
**Đề bài:** Cho bảng `METRICS` có 4 cột số như sau:
```sql
CREATE TABLE metrics (
    c1 NUMBER(5, 2),
    c2 NUMBER(5),
    c3 NUMBER(5, -2),
    c4 NUMBER(3, 5)
);
```
Hãy xác định giá trị thực tế được lưu vào DB (hoặc cho biết bị lỗi `ORA-01438`) với từng trường hợp sau:
1. Gán `456.789` vào `c1`.
2. Gán `1234.5` vào `c1`.
3. Gán `789.65` vào `c2`.
4. Gán `45678.9` vào `c3`.
5. Gán `0.004567` vào `c4`.

<details>
<summary><b>👉 Xem Lời Giải Chi Tiết Bài Tập 1</b></summary>

1. **`456.789` vào `c1` (`NUMBER(5, 2)`):** Lưu thành công giá trị **`456.79`**. Phần nguyên cho phép tối đa `5 - 2 = 3` chữ số (`456` hợp lệ), phần thập phân `.789` làm tròn thành `.79`.
2. **`1234.5` vào `c1` (`NUMBER(5, 2)`):** **BÁO LỖI `ORA-01438`** vì phần nguyên có 4 chữ số (`1234`), vượt quá giới hạn `5 - 2 = 3` chữ số phần nguyên.
3. **`789.65` vào `c2` (`NUMBER(5)`):** `NUMBER(5)` tương đương `NUMBER(5, 0)`. Lưu thành công giá trị **`790`** (tự động làm tròn tới hàng đơn vị).
4. **`45678.9` vào `c3` (`NUMBER(5, -2)`):** Scale `-2` làm tròn sang bên trái dấu chấm 2 chữ số (đến hàng trăm). Kết quả lưu thành công là **`45700`**.
5. **`0.004567` vào `c4` (`NUMBER(3, 5)`):** Vì `s > p` (`5 > 3`), số bắt buộc phải có ít nhất `5 - 3 = 2` chữ số `0` ngay sau dấu chấm thập phân và được làm tròn đến 5 chữ số thập phân. Kết quả lưu thành công là **`0.00457`**.
</details>

---

### Bài tập 2: Phân tích đầu ra của `TO_CHAR`, `TO_DATE`, `RR` vs `YY` và `NULL`
**Đề bài:** Giả sử năm hiện tại của máy chủ là **2026**. Hãy cho biết kết quả chính xác của từng cột trong câu truy vấn dưới đây:
```sql
SELECT TO_CHAR(TO_DATE('20-DEC-89', 'DD-MON-RR'), 'YYYY') AS col1,
       TO_CHAR(TO_DATE('20-DEC-89', 'DD-MON-YY'), 'YYYY') AS col2,
       TO_CHAR(15000, '$9,999.00')                        AS col3,
       'VNPT' || '' || '-IT'                              AS col4,
       100 * NULL                                         AS col5
FROM dual;
```

<details>
<summary><b>👉 Xem Lời Giải Chi Tiết Bài Tập 2</b></summary>

* **`col1`:** **`'1989'`**. Năm hiện tại là `2026` (2 số cuối `26` thuộc khoảng `00–49`), năm nhập vào là `89` (thuộc khoảng `50–99`) $\rightarrow$ Quy tắc `RR` lùi về thế kỷ trước (`19xx`), tức năm `1989`.
* **`col2`:** **`'2089'`**. Quy tắc `YY` luôn lấy thế kỷ hiện tại (`20xx`), nên `89` biến thành `2089`.
* **`col3`:** **`'##########'`** (10 dấu thăng). Số `15000` có 5 chữ số phần nguyên, nhưng định dạng `'$9,999.00'` chỉ cung cấp 4 chữ số `9` ở phần nguyên $\rightarrow$ Bị tràn định dạng, Oracle trả về chuỗi dấu `#`.
* **`col4`:** **`'VNPT-IT'`**. Trong Oracle, `''` là `NULL`, nhưng toán tử nối chuỗi `||` bỏ qua `NULL` và nối hai chuỗi `'VNPT'` với `'-IT'`.
* **`col5`:** **`NULL`**. Mọi phép toán số học với `NULL` đều trả về `NULL`.
</details>

---

### Bài tập 3: Tối ưu hóa truy vấn gặp bẫy ép kiểu ngầm định (Implicit Conversion)
**Đề bài:** Bảng `INVOICES` có 20 triệu bản ghi, gồm cột `INVOICE_CODE VARCHAR2(20)` (có B-Tree Index `IDX_INV_CODE`) và cột `CREATED_DATE DATE` (có B-Tree Index `IDX_INV_DATE`). Hai câu truy vấn dưới đây đang chạy rất chậm vì không sử dụng được Index (Full Table Scan). Hãy giải thích nguyên nhân và viết lại cả hai câu truy vấn để tận dụng tối đa B-Tree Index:

```sql
-- Truy vấn A:
SELECT invoice_id, amount FROM invoices WHERE invoice_code = 202600159;

-- Truy vấn B: Tìm tất cả hóa đơn phát sinh trong ngày 15/05/2026
SELECT invoice_id, amount FROM invoices WHERE TO_CHAR(created_date, 'YYYY-MM-DD') = '2026-05-15';
```

<details>
<summary><b>👉 Xem Lời Giải Chi Tiết Bài Tập 3</b></summary>

* **Nguyên nhân gây mất Index:**
  1. **Ở Truy vấn A:** So sánh cột `VARCHAR2` (`invoice_code`) với hằng số `NUMBER` (`202600159`). Oracle tự động ép kiểu ngầm định thành `TO_NUMBER(invoice_code) = 202600159`, làm vô hiệu hóa Index `IDX_INV_CODE` (và có nguy cơ lỗi `ORA-01722` nếu có mã hóa đơn chứa chữ cái).
  2. **Ở Truy vấn B:** Bọc hàm `TO_CHAR(created_date, ...)` trực tiếp lên cột `created_date` ở vế trái mệnh đề `WHERE`, khiến B-Tree Index thông thường `IDX_INV_DATE` trên cột `created_date` không thể sử dụng được.

* **Cách viết lại chuẩn xác (Tận dụng 100% Index Range Scan):**
```sql
-- Truy vấn A đã tối ưu: Truyền chuỗi đặt trong nháy đơn
SELECT invoice_id, amount
FROM invoices
WHERE invoice_code = '202600159';

-- Truy vấn B đã tối ưu: Giữ nguyên cột created_date độc lập, lọc theo khoảng thời gian trong ngày
SELECT invoice_id, amount
FROM invoices
WHERE created_date >= TO_DATE('2026-05-15 00:00:00', 'YYYY-MM-DD HH24:MI:SS')
  AND created_date <  TO_DATE('2026-05-16 00:00:00', 'YYYY-MM-DD HH24:MI:SS');
```
</details>

---

## 9. Tổng Hợp Bẫy Thi OCA/OCP Cốt Lõi Cần Nhớ (Exam Essentials)

| # | Chủ đề | Quy tắc chuẩn & Bẫy thường gặp trong đề thi 1Z0-071 |
| :---: | :--- | :--- |
| **1** | **`CHAR` vs `VARCHAR2`** | `CHAR` không ghi độ dài mặc định là `CHAR(1)` và đệm khoảng trắng; `VARCHAR2` bắt buộc phải khai báo độ dài (`VARCHAR2(n)`), không có độ dài mặc định! |
| **2** | **`NUMBER(p, s)` vượt giới hạn** | Vượt số chữ số phần nguyên (`p - s`) $\rightarrow$ **Lỗi `ORA-01438`**. Vượt số chữ số phần thập phân (`s`) $\rightarrow$ **Không lỗi, tự động làm tròn (Round)**. |
| **3** | **`NUMBER(p, -s)` (Scale âm)** | Làm tròn sang **bên trái dấu thập phân** `s` chữ số (ví dụ `s = -2` làm tròn đến hàng trăm). |
| **4** | **Kiểu `DATE` của Oracle** | Luôn lưu đủ **7 thành phần** (Thế kỷ, Năm, Tháng, Ngày, Giờ, Phút, Giây). Có thể cộng/trừ số ngày vào `DATE`, trừ 2 `DATE` ra số ngày, nhưng **không thể cộng 2 `DATE`**. |
| **5** | **`TIMESTAMP WITH LOCAL TIME ZONE`** | Không lưu múi giờ kèm dữ liệu; tự động quy đổi về múi giờ DB khi lưu và quy đổi sang **`SESSIONTIMEZONE`** của người dùng khi hiển thị. |
| **6** | **Chuỗi rỗng `''` trong Oracle** | Trong Oracle, **`''` chính là `NULL`**. Do đó `'' IS NULL` là `TRUE`, và `LENGTH('')` là `NULL` (không phải `0`). |
| **7** | **`NULL` trong Số học vs Nối chuỗi** | `100 + NULL` $\rightarrow$ **`NULL`**; nhưng `'A' || NULL || 'B'` $\rightarrow$ **`'AB'`** (nối chuỗi xem `NULL` như chuỗi rỗng). |
| **8** | **Ép kiểu ngầm định & Index** | So sánh `varchar2_col = 123` khiến Oracle biến thành `TO_NUMBER(varchar2_col) = 123`, làm **mất tác dụng của B-Tree Index** và dễ văng lỗi `ORA-01722`. |
| **9** | **Định dạng `RR` vs `YY`** | Với năm hiện tại là 2026 (`00–49`): `'95'` theo `YY` là **`2095`**, còn theo `RR` là **`1995`**. |
| **10** | **`TO_CHAR` tràn phần nguyên** | Khi số cần định dạng có nhiều chữ số phần nguyên hơn mẫu format (`TO_CHAR(1000, '999')`), kết quả trả về chuỗi **`'####'`** chứ không báo lỗi. |
