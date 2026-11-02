# Chương 5: Các Hàm SQL Thông Dụng (Single-Row Functions)

> **Mục tiêu chương học (Exam Objectives — OCA 1Z0-071 & OCP Developer):**
> - Phân biệt cơ chế hoạt động giữa **Single-Row Functions** (Hàm đơn dòng) và **Multiple-Row Functions** (Hàm tổng hợp).
> - Làm chủ nhóm hàm xử lý chuỗi ký tự (`UPPER`, `LOWER`, `INITCAP`, `SUBSTR`, `INSTR`, `LENGTH`, `LPAD`, `RPAD`, `TRIM`, `LTRIM`, `RTRIM`, `REPLACE`, `TRANSLATE`).
> - Vận dụng chính xác nhóm hàm toán học (`ROUND`, `TRUNC`, `MOD`, `CEIL`, `FLOOR`, `ABS`, `SIGN`), đặc biệt là tham số âm trong `ROUND`/`TRUNC`.
> - Xử lý thành thạo dữ liệu thời gian (`SYSDATE`, `CURRENT_DATE`, `SYSTIMESTAMP`, `ADD_MONTHS`, `MONTHS_BETWEEN`, `LAST_DAY`, `NEXT_DAY`, `EXTRACT`, `ROUND(date)`, `TRUNC(date)`).
> - Kiểm soát giá trị `NULL` bằng `NVL`, `NVL2`, `NULLIF`, `COALESCE` và nắm vững quy tắc tương thích kiểu dữ liệu (Data Type Compatibility).
> - Triển khai logic rẽ nhánh trong SQL bằng `CASE WHEN` (Simple & Searched CASE) và hàm đặc trưng của Oracle `DECODE`.

---

## Mục Lục

1. [Tổng quan về Single-Row Functions](#1-tổng-quan-về-single-row-functions)
2. [Nhóm hàm xử lý chuỗi ký tự (Character Functions)](#2-nhóm-hàm-xử-lý-chuỗi-ký-tự-character-functions)
3. [Nhóm hàm xử lý số (Numeric Functions)](#3-nhóm-hàm-xử-lý-số-numeric-functions)
4. [Nhóm hàm xử lý ngày tháng (Date & Timestamp Functions)](#4-nhóm-hàm-xử-lý-ngày-tháng-date--timestamp-functions)
5. [Nhóm hàm xử lý giá trị NULL (General & NULL Functions)](#5-nhóm-hàm-xử-lý-giá-trị-null-general--null-functions)
6. [Biểu thức điều kiện: CASE WHEN và DECODE](#6-biểu-thức-điều-kiện-case-when-và-decode)
7. [Bài tập thực hành tự luyện (Kèm lời giải chi tiết)](#7-bài-tập-thực-hành-tự-luyện-kèm-lời-giải-chi-tiết)
8. [Tổng hợp Bẫy thi OCA/OCP (Exam Essentials)](#8-tổng-hợp-bẫy-thi-ocaocp-exam-essentials)

---

## 1. Tổng quan về Single-Row Functions

Trong Oracle SQL, các hàm tích hợp sẵn (Built-in Functions) được chia thành hai nhóm chính:
1. **Single-Row Functions (Hàm đơn dòng):** Tác động lên từng dòng (row) riêng lẻ của câu truy vấn và trả về **đúng 1 kết quả cho mỗi dòng** được xử lý.
2. **Multiple-Row / Aggregate Functions (Hàm đa dòng / tổng hợp):** Tác động lên một tập hợp nhiều dòng và trả về 1 kết quả duy nhất cho cả nhóm (sẽ học ở Chương 6).

### Đặc điểm cốt lõi của Single-Row Functions:
- **Vị trí xuất hiện:** Có thể sử dụng trong các mệnh đề `SELECT`, `WHERE`, `START WITH`, `CONNECT BY`, và `ORDER BY`.
- **Lồng hàm (Function Nesting):** Có thể lồng nhiều hàm đơn dòng vào nhau với độ sâu không giới hạn (trái ngược với hàm tổng hợp chỉ lồng được tối đa 2 cấp). Thứ tự thực thi luôn đi từ **trong ra ngoài** (`F3(F2(F1(col)))`).
- **Kiểu dữ liệu trả về:** Có thể khác với kiểu dữ liệu của đối số đầu vào (ví dụ: `LENGTH('Oracle')` nhận vào `VARCHAR2` nhưng trả về `NUMBER`; `MONTHS_BETWEEN(d1, d2)` nhận vào 2 giá trị `DATE` nhưng trả về `NUMBER`).
- **Quy tắc truyền `NULL` mặc định:** Hầu hết các hàm đơn dòng đều trả về `NULL` nếu bất kỳ đối số đầu vào nào của chúng là `NULL` (ngoại trừ các hàm chuyên xử lý `NULL` như `NVL`, `NVL2`, `COALESCE`, `DECODE`, và hàm nối chuỗi `CONCAT` / phép nối `||`).

---

## 2. Nhóm hàm xử lý chuỗi ký tự (Character Functions)

Nhóm hàm ký tự được chia làm hai phân nhóm nhỏ:
- **Case-Conversion Functions:** Chuyển đổi hoa/thường (`UPPER`, `LOWER`, `INITCAP`).
- **Character-Manipulation Functions:** Cắt, ghép, tìm kiếm, thay thế và căn lề chuỗi (`SUBSTR`, `INSTR`, `LENGTH`, `LPAD`, `RPAD`, `TRIM`, `LTRIM`, `RTRIM`, `REPLACE`, `TRANSLATE`).

### 2.1. Các hàm chuyển đổi chữ Hoa / Thường (`UPPER`, `LOWER`, `INITCAP`)

| Hàm | Cú pháp | Mô tả chi tiết | Ví dụ với bảng `DUAL` | Kết quả |
| :--- | :--- | :--- | :--- | :--- |
| **`UPPER`** | `UPPER(s)` | Chuyển toàn bộ ký tự chữ cái trong chuỗi `s` thành chữ IN HOA. | `UPPER('Oracle 21c')` | `'ORACLE 21C'` |
| **`LOWER`** | `LOWER(s)` | Chuyển toàn bộ ký tự chữ cái trong chuỗi `s` thành chữ in thường. | `LOWER('Oracle 21c')` | `'oracle 21c'` |
| **`INITCAP`** | `INITCAP(s)` | Viết HOA ký tự đầu tiên của **mỗi từ** và viết thường các ký tự còn lại. | `INITCAP('ngUYEN_vAn-a#12b')` | `'Nguyen_Van-A#12b'` |

> [!WARNING]
> **Bẫy thi về `INITCAP`:** Oracle định nghĩa "từ" (word) là một chuỗi các ký tự chữ hoặc số (alphanumeric) liên tiếp nhau. Bất kỳ ký tự nào **không phải chữ cái và không phải chữ số** (như khoảng trắng, dấu gạch dưới `_`, dấu gạch ngang `-`, dấu chấm `.`, ký tự `$`, `#`) đều được coi là dấu phân cách từ (word delimiter). Do đó:
> - `INITCAP('john_doe')` trả về `'John_Doe'` (chữ `D` sau dấu `_` được viết hoa).
> - `INITCAP('123abc')` trả về `'123abc'` vì ký tự đầu tiên của từ `'123abc'` là số `'1'`, nên các chữ cái phía sau (`abc`) bị chuyển thành chữ thường!
> - `INITCAP('123_abc')` trả về `'123_Abc'` vì dấu `_` là ký tự phân cách từ.

### 2.2. Hàm cắt chuỗi `SUBSTR` và tìm vị trí `INSTR`

#### a) Hàm `SUBSTR(string, position [, substring_length])`
Trích xuất một chuỗi con từ chuỗi `string`, bắt đầu tại vị trí `position` với độ dài `substring_length`.

- **Quy tắc chỉ số trong SQL:** Chuỗi trong Oracle bắt đầu từ vị trí **1** (1-based indexing), không phải 0 như Java/C.
- **Nếu `position = 0`:** Oracle tự động coi `position = 0` tương đương với **`position = 1`**.
- **Nếu `position > 0`:** Đếm từ **trái sang phải** bắt đầu từ ký tự đầu tiên (vị trí 1).
- **Nếu `position < 0`:** Đếm lùi từ **cuối chuỗi về phía đầu chuỗi** (`-1` là ký tự cuối cùng, `-2` là ký tự kế cuối...), nhưng sau khi xác định được điểm bắt đầu thì **luôn cắt chuỗi theo chiều từ trái sang phải**.
- **Nếu lược bỏ `substring_length`:** Lấy từ vị trí `position` cho đến **hết chuỗi**.
- **Nếu `substring_length <= 0` hoặc `position > LENGTH(string)`:** Trả về **`NULL`** (vì trong Oracle chuỗi rỗng `''` chính là `NULL`).

```sql
SELECT SUBSTR('ORACLE_SQL', 1, 6)  AS c1, -- Bắt đầu từ 1, lấy 6 ký tự
       SUBSTR('ORACLE_SQL', 0, 6)  AS c2, -- position = 0 được đối xử như position = 1
       SUBSTR('ORACLE_SQL', 8)     AS c3, -- Từ vị trí 8 đến hết chuỗi
       SUBSTR('ORACLE_SQL', -3, 2) AS c4, -- Đếm từ cuối lên 3 ký tự ('S'), cắt sang phải 2 ký tự
       SUBSTR('ORACLE_SQL', -3)    AS c5, -- Đếm từ cuối lên 3 ký tự, lấy đến hết chuỗi
       SUBSTR('ORACLE_SQL', 20, 3) AS c6  -- Vượt quá độ dài chuỗi -> trả về NULL
FROM dual;
```

**Kết quả đầu ra:**

| C1 | C2 | C3 | C4 | C5 | C6 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ORACLE` | `ORACLE` | `SQL` | `SQ` | `SQL` | *(NULL)* |

#### b) Hàm `INSTR(string, substring [, position [, occurrence]])`
Tìm kiếm chuỗi con `substring` bên trong `string` và trả về **vị trí (số nguyên >= 1) tính từ đầu chuỗi** nơi tìm thấy. Nếu không tìm thấy, hàm trả về **`0`** (không phải `NULL`, trừ khi đối số truyền vào là `NULL`).

- `position` (mặc định là `1`): Vị trí bắt đầu quét tìm kiếm.
  - Nếu `position > 0`: Quét từ trái sang phải bắt đầu tại vị trí `position`.
  - Nếu `position < 0`: Đếm từ cuối chuỗi ngược về đầu chuỗi `|position|` ký tự, rồi **quét ngược từ phải sang trái** để tìm `substring`. Dù quét ngược từ phải sang trái, **kết quả trả về vẫn luôn là vị trí đếm từ đầu chuỗi (từ trái sang, bắt đầu từ 1)**.
- `occurrence` (mặc định là `1`): Lần xuất hiện thứ mấy của `substring` tính từ điểm bắt đầu quét. `occurrence` bắt buộc phải là số nguyên dương (`>= 1`), nếu truyền `<= 0` sẽ báo lỗi `ORA-01428: argument '0' is out of range`.

```sql
-- Chuỗi mẫu: 'CORPORATE FLOOR' (Độ dài 15 ký tự)
-- Vị trí:     123456789012345
SELECT INSTR('CORPORATE FLOOR', 'OR')         AS i1, -- Mặc định pos=1, occ=1 -> 'OR' đầu tiên ở vị trí 2
       INSTR('CORPORATE FLOOR', 'OR', 3, 2)   AS i2, -- Quét từ vị trí 3 ('R'), tìm lần xuất hiện thứ 2 của 'OR'
       INSTR('CORPORATE FLOOR', 'OR', -3, 2)  AS i3, -- Đứng ở ký tự thứ 3 từ cuối ('O' tại vị trí 13), quét ngược sang trái tìm lần thứ 2
       INSTR('CORPORATE FLOOR', 'XYZ')        AS i4  -- Không tìm thấy -> trả về 0
FROM dual;
```

**Phân tích chi tiết cột `I2` và `I3`:**
- Chuỗi `'CORPORATE FLOOR'` có `'OR'` tại các vị trí: `2` (`C[OR]PORATE`), `5` (`CORP[OR]ATE`), và `14` (`FLO[OR]`).
- Với `I2`: Quét từ vị trí 3 sang phải. Lần gặp `'OR'` thứ 1 là ở vị trí `5`, lần gặp thứ 2 là ở vị trí **`14`**.
- Với `I3`: Vị trí `-3` tính từ cuối chuỗi (`15 - 3 + 1 = 13`, tức chữ `'O'` đầu của từ `FLOOR`). Tại vị trí 13 ghép với 14 tạo thành `'OR'` nhưng khi quét ngược từ 13 sang trái:
  - Chuỗi con `'OR'` bắt đầu tại vị trí `14` nằm bên phải vị trí 13 nên không tính.
  - Quét ngược từ vị trí 13 về 1: Lần gặp `'OR'` thứ 1 là tại vị trí `5`, lần gặp thứ 2 là tại vị trí **`2`**.

**Kết quả đầu ra:**

| I1 | I2 | I3 | I4 |
| :--- | :--- | :--- | :--- |
| `2` | `14` | `2` | `0` |

### 2.3. Hàm độ dài `LENGTH` và căn lề `LPAD`, `RPAD`

- **`LENGTH(string)`:** Trả về số lượng ký tự của chuỗi (bao gồm cả khoảng trắng). Nếu `string` là `NULL`, trả về `NULL`. (Lưu ý: `LENGTHB` trả về số byte).
- **`LPAD(string, total_length [, pad_string])`:** Đệm thêm chuỗi `pad_string` (mặc định là 1 khoảng trắng `' '`) vào **bên trái** của `string` sao cho tổng độ dài chuỗi kết quả đúng bằng `total_length`.
- **`RPAD(string, total_length [, pad_string])`:** Đệm thêm chuỗi `pad_string` vào **bên phải** của `string` sao cho tổng độ dài đúng bằng `total_length`.

> [!IMPORTANT]
> **Bẫy thi cực kỳ phổ biến với `LPAD` / `RPAD`:**
> Nếu `total_length` **nhỏ hơn** độ dài hiện tại của `string` (`total_length < LENGTH(string)`), cả `LPAD` lẫn `RPAD` đều sẽ **cắt bớt (truncate) chuỗi gốc từ bên phải**, chỉ giữ lại `total_length` ký tự đầu tiên tính từ bên trái!

```sql
SELECT LPAD('5000', 8, '*')    AS lpad_norm,
       RPAD('5000', 8, '*#')   AS rpad_norm,
       LPAD('ORACLE_DB', 6, '*') AS lpad_trunc,
       RPAD('ORACLE_DB', 6, '*') AS rpad_trunc
FROM dual;
```

**Kết quả đầu ra:**

| LPAD_NORM | RPAD_NORM | LPAD_TRUNC | RPAD_TRUNC |
| :--- | :--- | :--- | :--- |
| `****5000` | `5000*#*#` | `ORACLE` | `ORACLE` |

### 2.4. Nhóm hàm cắt ký tự thừa: `TRIM`, `LTRIM`, `RTRIM`

Nhiều thí sinh nhầm lẫn rằng `TRIM`, `LTRIM`, `RTRIM` hoạt động giống hệt nhau. Thực tế trong Oracle SQL, cú pháp và khả năng của chúng có sự khác biệt rất lớn:

#### a) Hàm chuẩn ANSI `TRIM`
```sql
TRIM([ { LEADING | TRAILING | BOTH } [ trim_character ] FROM ] trim_source)
-- Hoặc viết gọn (mặc định là BOTH):
TRIM([ trim_character FROM ] trim_source)
-- Hoặc cắt khoảng trắng 2 đầu:
TRIM(trim_source)
```
- `LEADING`: Chỉ cắt ở đầu chuỗi (bên trái).
- `TRAILING`: Chỉ cắt ở cuối chuỗi (bên phải).
- `BOTH` (mặc định): Cắt ở cả hai đầu.

> [!WARNING]
> **Bẫy thi chí mạng của `TRIM`:** `trim_character` trong hàm `TRIM` chỉ được phép chứa **ĐÚNG 1 KÝ TỰ DUY NHẤT**! Nếu bạn truyền một chuỗi có từ 2 ký tự trở lên (ví dụ: `TRIM('ab' FROM 'abOracleab')`), Oracle sẽ lập tức báo lỗi runtime:
> `ORA-30001: trim set should have only one character`.

#### b) Hàm `LTRIM(string [, set_of_chars])` và `RTRIM(string [, set_of_chars])`
Khác với `TRIM`, đối số thứ hai của `LTRIM` và `RTRIM` là một **tập hợp các ký tự rời rạc (`set_of_chars`)**, không phải là một chuỗi cố định và cũng không bị giới hạn 1 ký tự!
- Cơ chế hoạt động: `LTRIM(s, 'abc')` sẽ duyệt từ trái sang phải của chuỗi `s`. Chừng nào ký tự đang xét còn thuộc tập hợp `{'a', 'b', 'c'}` (bất kể thứ tự), nó sẽ xóa ký tự đó đi. Ngay khi gặp một ký tự **không nằm trong tập `{'a', 'b', 'c'}`**, hàm sẽ dừng lại ngay lập tức.

```sql
SELECT TRIM(LEADING '0' FROM '0001200')     AS t1,
       TRIM(TRAILING '0' FROM '0001200')    AS t2,
       TRIM('0' FROM '0001200')             AS t3,
       LTRIM('xyxzyxORACLExzy', 'xyz')      AS lt1,
       RTRIM('xyxzyxORACLExzy', 'xyz')      AS rt1
FROM dual;
```

**Kết quả đầu ra:**

| T1 | T2 | T3 | LT1 | RT1 |
| :--- | :--- | :--- | :--- | :--- |
| `1200` | `00012` | `12` | `ORACLExzy` | `xyxzyxORACLE` |

### 2.5. Phân biệt `REPLACE` (Thay thế theo chuỗi) và `TRANSLATE` (Thay thế từng ký tự 1-1)

Đây là cặp hàm hay bị hỏi đối chiếu nhất trong đề thi OCA 1Z0-071 và tuyển dụng VNPT:

#### a) `REPLACE(text, search_string [, replacement_string])`
- Tìm kiếm sự xuất hiện của **cả cụm chuỗi** `search_string` trong `text` và thay thế bằng `replacement_string`.
- Nếu lược bỏ `replacement_string` (hoặc truyền `NULL`), mọi cụm `search_string` xuất hiện trong `text` sẽ bị **xóa bỏ hoàn toàn**.

#### b) `TRANSLATE(text, from_string, to_string)`
- Thực hiện ánh xạ và thay thế **từng ký tự đơn lẻ theo vị trí tương ứng (1-đối-1)** từ bảng ký tự `from_string` sang bảng ký tự `to_string`.
- **Quy tắc ánh xạ:**
  1. Ký tự thứ `i` trong `from_string` sẽ được đổi thành ký tự thứ `i` trong `to_string`.
  2. Nếu `from_string` **dài hơn** `to_string`: Các ký tự thừa ở cuối `from_string` (không có ký tự đối ứng bên `to_string`) sẽ bị **xóa sạch** khỏi chuỗi `text`.
  3. Nếu `to_string` **dài hơn** `from_string`: Các ký tự thừa ở cuối `to_string` bị bỏ qua.
  4. **Bẫy `NULL`:** Khác với `REPLACE` (bỏ đối số thứ 3 thì xóa chuỗi tìm thấy), `TRANSLATE` bắt buộc phải có đủ 3 đối số. Nếu `to_string` là chuỗi rỗng `''` (tức `NULL`), `TRANSLATE` trả về **`NULL`** cho toàn bộ biểu thức!

```sql
SELECT REPLACE('JACK AND JUE', 'J', 'BL')          AS rep_1,
       REPLACE('JACK AND JUE', 'JU')               AS rep_del,
       TRANSLATE('123-456-789', '123-', 'ABC')     AS trans_1,
       TRANSLATE('A1B2C3D4', '0123456789', ' ')    AS trans_keep_alpha,
       TRANSLATE('ORACLE', 'OR', '')               AS trans_null
FROM dual;
```

**Giải thích từng cột:**
- `rep_1`: Thay mọi chữ `'J'` bằng `'BL'` -> `'BLACK AND BLUE'`.
- `rep_del`: Không truyền đối số 3 -> Xóa cụm `'JU'` -> `'JACK AND E'`.
- `trans_1`: `'1'->'A'`, `'2'->'B'`, `'3'->'C'`, còn dấu `'-'` ở vị trí thứ 4 trong `from_string` không có ký tự tương ứng trong `'ABC'` nên bị xóa bỏ -> `'ABC456789'`.
- `trans_keep_alpha`: `'0'` đổi thành `' '` (khoảng trắng), còn các chữ số từ `'1'` đến `'9'` không có ký tự đối ứng nên bị xóa sạch -> `'ABCD'`.
- `trans_null`: Đối số thứ 3 là `''` (`NULL`) -> Trả về `NULL`.

**Kết quả đầu ra:**

| REP_1 | REP_DEL | TRANS_1 | TRANS_KEEP_ALPHA | TRANS_NULL |
| :--- | :--- | :--- | :--- | :--- |
| `BLACK AND BLUE` | `JACK AND E` | `ABC456789` | `ABCD` | *(NULL)* |

---

## 3. Nhóm hàm xử lý số (Numeric Functions)

### 3.1. Hàm làm tròn `ROUND(n [, m])` và cắt phần dư `TRUNC(n [, m])`

- **`ROUND(n [, m])`:** Làm tròn số `n` đến `m` chữ số thập phân (quy tắc: chữ số ngay sau vị trí làm tròn `>= 5` thì làm tròn lên theo trị tuyệt đối, `< 5` thì giữ nguyên).
- **`TRUNC(n [, m])`:** Cắt bỏ phần dư của số `n` ở vị trí `m` chữ số thập phân mà **không bao giờ làm tròn lên**.

**Ý nghĩa của tham số `m` (số vị trí làm tròn):**
1. **Không truyền `m` (hoặc `m = 0`):** Làm tròn / cắt đến hàng đơn vị (trả về số nguyên).
2. **`m > 0`:** Làm tròn / cắt đến chữ số thứ `m` **bên phải** dấu chấm thập phân.
3. **`m < 0` (Bẫy thi rất hay hỏi!):** Làm tròn / cắt ở vị trí thứ `|m|` **bên trái** dấu chấm thập phân:
   - `m = -1`: Làm tròn / cắt đến **hàng chục** (chữ số hàng đơn vị trở thành `0`).
   - `m = -2`: Làm tròn / cắt đến **hàng trăm** (2 chữ số cuối trước dấu phẩy trở thành `00`).
   - `m = -3`: Làm tròn / cắt đến **hàng nghìn**.
   - Nếu `|m|` lớn hơn hoặc bằng số chữ số phần nguyên của `n`, `TRUNC` luôn trả về `0`, còn `ROUND` trả về `0` (nếu chữ số ngoài cùng `< 5`) hoặc `10^|m|` (nếu chữ số tại vị trí xét `>= 5`).

```sql
SELECT ROUND(45.926, 2)   AS r1, -- Làm tròn 2 chữ số thập phân (sau số 2 là 6 >= 5)
       TRUNC(45.926, 2)   AS t1, -- Cắt ở 2 chữ số thập phân
       ROUND(45.926)      AS r2, -- Mặc định m = 0 (sau dấu chấm là 9 >= 5)
       TRUNC(45.926)      AS t2, -- Mặc định m = 0
       ROUND(45.926, -1)  AS r3, -- Hàng chục: chữ số hàng đơn vị là 5 >= 5 -> lên 50
       TRUNC(45.926, -1)  AS t3, -- Hàng chục: cắt bỏ hàng đơn vị -> 40
       ROUND(45.926, -2)  AS r4, -- Hàng trăm: chữ số hàng chục là 4 < 5 -> về 0
       ROUND(55.926, -2)  AS r5  -- Hàng trăm: chữ số hàng chục là 5 >= 5 -> lên 100
FROM dual;
```

**Kết quả đầu ra:**

| R1 | T1 | R2 | T2 | R3 | T3 | R4 | R5 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `45.93` | `45.92` | `46` | `45` | `50` | `40` | `0` | `100` |

### 3.2. Các hàm số học khác: `MOD`, `CEIL`, `FLOOR`, `ABS`, `SIGN`

| Hàm | Cú pháp | Quy tắc hoạt động | Ví dụ với số dương & số âm |
| :--- | :--- | :--- | :--- |
| **`MOD`** | `MOD(m, n)` | Trả về phần dư của phép chia `m` cho `n` theo công thức: `m - n * FLOOR(m/n)` (trong Oracle, dấu của kết quả `MOD(m, n)` **luôn mang dấu của số bị chia `m`**). **Đặc biệt: Nếu `n = 0`, `MOD(m, 0)` KHÔNG báo lỗi chia cho 0 mà trả về chính `m`!** | `MOD(11, 4) = 3`<br>`MOD(-11, 4) = -3`<br>`MOD(11, -4) = 3`<br>`MOD(15, 0) = 15` |
| **`CEIL`** | `CEIL(n)` | Trả về số nguyên **nhỏ nhất mà lớn hơn hoặc bằng `n`** (làm tròn tiến về phía $+\infty$). | `CEIL(4.1) = 5`<br>`CEIL(-4.8) = -4` |
| **`FLOOR`** | `FLOOR(n)` | Trả về số nguyên **lớn nhất mà nhỏ hơn hoặc bằng `n`** (làm tròn lùi về phía $-\infty$). | `FLOOR(4.9) = 4`<br>`FLOOR(-4.1) = -5` |
| **`ABS`** | `ABS(n)` | Trả về giá trị tuyệt đối của `n` (`|n| >= 0`). | `ABS(-25.5) = 25.5` |
| **`SIGN`** | `SIGN(n)` | Kiểm tra dấu của số `n`: Trả về **`1`** nếu `n > 0`, **`-1`** nếu `n < 0`, và **`0`** nếu `n = 0`. | `SIGN(-99) = -1`<br>`SIGN(0) = 0`<br>`SIGN(42) = 1` |

> [!TIP]
> **Mẹo nhớ nhanh `CEIL` và `FLOOR` với số âm:**
> Hãy tưởng tượng trục số nằm ngang từ trái sang phải. Với số âm `-4.2` (nằm giữa `-5` và `-4`):
> - `CEIL(-4.2)` nhìn lên "trần nhà" (bên phải, lớn hơn) $\rightarrow$ **`-4`**.
> - `FLOOR(-4.2)` nhìn xuống "sàn nhà" (bên trái, nhỏ hơn) $\rightarrow$ **`-5`**.
> - Trong khi đó, `TRUNC(-4.2)` chỉ cắt bỏ phần thập phân `.2` $\rightarrow$ **`-4`**.

---

## 4. Nhóm hàm xử lý ngày tháng (Date & Timestamp Functions)

Kiểu dữ liệu `DATE` chuẩn của Oracle luôn lưu trữ đầy đủ 7 thành phần: **Thế kỷ, Năm, Tháng, Ngày, Giờ, Phút, Giây** (dù khi hiển thị mặc định chỉ thấy `DD-MON-RR`).

### 4.1. Các hàm lấy thời gian hiện tại: `SYSDATE`, `CURRENT_DATE`, `SYSTIMESTAMP`

| Hàm | Kiểu dữ liệu trả về | Múi giờ tham chiếu (Time Zone) | Cú pháp lưu ý |
| :--- | :--- | :--- | :--- |
| **`SYSDATE`** | `DATE` | Múi giờ của **Hệ điều hành máy chủ Database (DB Server OS)**. | Không có dấu ngoặc đơn `()` |
| **`CURRENT_DATE`** | `DATE` | Múi giờ của **Phiên làm việc hiện tại của người dùng (Session Time Zone)**. | Không có dấu ngoặc đơn `()` |
| **`SYSTIMESTAMP`** | `TIMESTAMP WITH TIME ZONE` | Múi giờ của **DB Server OS** (kèm phần lẻ của giây — fractional seconds và offset múi giờ). | Không có dấu ngoặc đơn `()` |
| **`CURRENT_TIMESTAMP`** | `TIMESTAMP WITH TIME ZONE` | Múi giờ của **Session** (kèm fractional seconds và offset múi giờ). | Không có dấu ngoặc đơn `()` |

### 4.2. Phép toán số học trên kiểu `DATE` (Date Arithmetic)

| Phép toán | Kiểu trả về | Ý nghĩa | Ví dụ |
| :--- | :--- | :--- | :--- |
| `date + number` | `DATE` | Cộng thêm `number` ngày vào `date` (`1/24` là 1 giờ, `1/1440` là 1 phút). | `SYSDATE + 7` (7 ngày sau) |
| `date - number` | `DATE` | Trừ đi `number` ngày từ `date`. | `SYSDATE - 1/24` (1 giờ trước) |
| `date1 - date2` | `NUMBER` | Trả về số ngày chênh lệch giữa hai mốc thời gian (có thể là số thực nếu khác giờ/phút/giây). | `DATE '2025-03-10' - DATE '2025-03-01'` = `9` |
| `date1 + date2` | **Lỗi ORA-00975** | **Không hợp lệ!** Không thể cộng hai giá trị kiểu `DATE` với nhau. | `SYSDATE + hire_date` $\rightarrow$ Lỗi! |

### 4.3. Các hàm thao tác ngày tháng chuyên dụng

#### a) `ADD_MONTHS(date, integer)`
Cộng (hoặc trừ nếu `integer < 0`) một số tháng nguyên vào `date`.
- **Quy tắc Cuối Tháng (End-of-Month Rule):** Nếu `date` đầu vào là **ngày cuối cùng của tháng** (ví dụ: `28-FEB-2025` hoặc `31-JAN-2025`), thì kết quả trả về của `ADD_MONTHS` **luôn luôn là ngày cuối cùng của tháng đích**! Ngược lại, nếu ngày của `date` lớn hơn tổng số ngày của tháng đích (ví dụ: `30-JAN-2025` cộng 1 tháng sang tháng 2 chỉ có 28 ngày), nó cũng tự động lùi về ngày cuối tháng đích (`28-FEB-2025`).

```sql
SELECT ADD_MONTHS(DATE '2025-01-31', 1)  AS jan31_plus_1m,  -- Cuối tháng 1 -> Cuối tháng 2 (28/02/2025)
       ADD_MONTHS(DATE '2025-02-28', 1)  AS feb28_plus_1m,  -- Cuối tháng 2 -> Cuối tháng 3 (31/03/2025)!
       ADD_MONTHS(DATE '2024-02-28', 1)  AS leap_feb28      -- Năm 2024 nhuận (tháng 2 có 29 ngày), nên 28/02 KHÔNG phải cuối tháng -> 28/03/2024!
FROM dual;
```

**Kết quả đầu ra:**

| JAN31_PLUS_1M | FEB28_PLUS_1M | LEAP_FEB28 |
| :--- | :--- | :--- |
| `2025-02-28` | `2025-03-31` | `2024-03-28` |

#### b) `MONTHS_BETWEEN(date1, date2)`
Trả về số tháng chênh lệch (`date1 - date2`).
- Nếu `date1 > date2`: Kết quả dương. Nếu `date1 < date2`: Kết quả âm.
- Nếu cả `date1` và `date2` có cùng ngày trong tháng (ví dụ cùng ngày 15) **HOẶC cả hai đều là ngày cuối cùng của tháng** (ví dụ `28-FEB-2025` và `31-MAR-2025`), kết quả trả về là một **số nguyên tròn chĩnh** (`1` hoặc `-1`).
- Nếu khác ngày, phần lẻ được tính trên cơ sở **1 tháng chuẩn = 31 ngày** (`(day1 - day2) / 31`).

#### c) `LAST_DAY(date)` và `NEXT_DAY(date, char)`
- **`LAST_DAY(date)`:** Trả về ngày cuối cùng của tháng chứa `date` (giữ nguyên phần giờ/phút/giây của `date`).
- **`NEXT_DAY(date, day_of_week)`:** Trả về ngày của thứ `day_of_week` **tiếp theo sau `date`** (không bao giờ trả về chính `date` kể cả khi `date` trùng thứ đó; nếu trùng thì trả về đúng 7 ngày sau). `day_of_week` có thể là tên thứ (`'MONDAY'`, `'MON'`, `'FRIDAY'`) hoặc số thứ tự ngày trong tuần theo `NLS_TERRITORY`.

#### d) `EXTRACT(field FROM datetime_value)`
Trích xuất một thành phần cụ thể (trả về kiểu `NUMBER`) từ giá trị `DATE` hoặc `TIMESTAMP`.

> [!WARNING]
> **Bẫy thi cực hiểm về `EXTRACT`:**
> - Với kiểu **`DATE`**, bạn **CHỈ** được phép `EXTRACT` 3 thành phần: **`YEAR`**, **`MONTH`**, **`DAY`**.
> - Nếu bạn gọi `EXTRACT(HOUR FROM SYSDATE)` hoặc `MINUTE`, `SECOND` trên một cột/hàm kiểu `DATE`, Oracle sẽ báo lỗi biên dịch: `ORA-30076: invalid extract field for extract source`!
> - Để lấy `HOUR`, `MINUTE`, `SECOND`, `TIMEZONE_HOUR`, `TIMEZONE_MINUTE`, nguồn dữ liệu bắt buộc phải là kiểu **`TIMESTAMP`** (ví dụ: `EXTRACT(HOUR FROM SYSTIMESTAMP)` hoặc `EXTRACT(HOUR FROM CAST(SYSDATE AS TIMESTAMP))`).

#### e) Làm tròn `ROUND(date [, fmt])` và Cắt `TRUNC(date [, fmt])`

| Định dạng (`fmt`) | Quy tắc `ROUND(date, fmt)` | Quy tắc `TRUNC(date, fmt)` |
| :--- | :--- | :--- |
| **Lược bỏ `fmt`** (hoặc `'DD'`) | Làm tròn theo **Giờ trong ngày**:<br>- Trước `12:00:00` trưa (`00:00:00` – `11:59:59`): Về `00:00:00` ngày hiện tại.<br>- Từ `12:00:00` trưa trở đi (`12:00:00` – `23:59:59`): Lên `00:00:00` của **ngày hôm sau**. | Luôn cắt bỏ phần giờ/phút/giây, đưa về `00:00:00` của **ngày hiện tại**. |
| **`'MM'` / `'MON'` / `'MONTH'`** | Làm tròn theo **Ngày trong tháng** (Mốc chuẩn là **ngày 16**):<br>- Từ ngày `1` đến `15`: Về ngày `01` của tháng hiện tại.<br>- Từ ngày `16` đến `31`: Lên ngày `01` của **tháng tiếp theo** (bất kể tháng đó có 28, 30 hay 31 ngày!). | Luôn đưa về ngày `01` lúc `00:00:00` của **tháng hiện tại**. |
| **`'YY'` / `'YYYY'` / `'YEAR'`** | Làm tròn theo **Tháng trong năm** (Mốc chuẩn là **tháng 7 - July**):<br>- Từ tháng `1` đến tháng `6` (`01-JAN` đến `30-JUN`): Về `01-JAN` năm hiện tại.<br>- Từ tháng `7` đến tháng `12` (`01-JUL` đến `31-DEC`): Lên `01-JAN` của **năm tiếp theo**. | Luôn đưa về ngày `01-JAN` lúc `00:00:00` của **năm hiện tại**. |

```sql
-- Giả sử ngày kiểm tra là: 15-FEB-2025 (Tháng 2 chỉ có 28 ngày, quá nửa tháng là 14.5 nhưng mốc cứng của Oracle vẫn là ngày 16!)
SELECT ROUND(DATE '2025-02-15', 'MONTH') AS r_feb15, -- Ngày 15 < 16 -> Về 01-FEB-2025
       ROUND(DATE '2025-02-16', 'MONTH') AS r_feb16, -- Ngày 16 >= 16 -> Lên 01-MAR-2025
       TRUNC(DATE '2025-02-25', 'MONTH') AS t_feb25, -- Cắt về đầu tháng -> 01-FEB-2025
       ROUND(DATE '2025-06-30', 'YEAR')  AS r_jun30, -- Tháng 6 < 7 -> Về 01-JAN-2025
       ROUND(DATE '2025-07-01', 'YEAR')  AS r_jul01, -- Tháng 7 >= 7 -> Lên 01-JAN-2026
       TRUNC(DATE '2025-12-31', 'YEAR')  AS t_dec31  -- Cắt về đầu năm -> 01-JAN-2025
FROM dual;
```

**Kết quả đầu ra:**

| R_FEB15 | R_FEB16 | T_FEB25 | R_JUN30 | R_JUL01 | T_DEC31 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `2025-02-01` | `2025-03-01` | `2025-02-01` | `2025-01-01` | `2026-01-01` | `2025-01-01` |

---

## 5. Nhóm hàm xử lý giá trị NULL (General & NULL Functions)

Trong các phép tính toán học (ví dụ: `salary + commission_pct`), nếu bất kỳ toán hạng nào là `NULL` thì kết quả của cả phép tính sẽ trở thành `NULL`. Oracle cung cấp 4 hàm quan trọng để kiểm soát `NULL`:

### 5.1. Bảng so sánh 4 hàm xử lý `NULL`

| Hàm | Cú pháp | Cơ chế hoạt động | Quy tắc ép kiểu & Kiểu dữ liệu trả về |
| :--- | :--- | :--- | :--- |
| **`NVL`** | `NVL(expr1, expr2)` | Nếu `expr1` là `NULL` thì trả về `expr2`; ngược lại trả về `expr1`. | Trả về kiểu dữ liệu của **`expr1`**. Nếu `expr1` và `expr2` khác kiểu, Oracle cố gắng ép kiểu ngầm định (implicit conversion) `expr2` sang kiểu của `expr1`. Ví dụ: `NVL(commission_pct, 'No Comm')` sẽ báo lỗi **`ORA-01722: invalid number`** vì cột `commission_pct` là `NUMBER`, không thể ép chuỗi `'No Comm'` thành số! |
| **`NVL2`** | `NVL2(expr1, expr2, expr3)` | Nếu `expr1` **KHÔNG phải `NULL`** (`IS NOT NULL`) thì trả về **`expr2`**; nếu `expr1` **là `NULL`** thì trả về **`expr3`**. | `expr1` có thể thuộc bất kỳ kiểu dữ liệu nào! Kiểu trả về được quyết định bởi **`expr2`**. `expr2` và `expr3` phải tương thích kiểu với nhau (trừ khi `expr2` là literal `NULL`). |
| **`NULLIF`** | `NULLIF(expr1, expr2)` | So sánh `expr1` và `expr2`: Nếu **`expr1 = expr2`** thì trả về **`NULL`**; ngược lại trả về **`expr1`**. Tương đương với: `CASE WHEN expr1 = expr2 THEN NULL ELSE expr1 END`. | `expr1` và `expr2` phải cùng nhóm kiểu dữ liệu. **Bẫy thi:** Đối số đầu tiên **`expr1` KHÔNG ĐƯỢC PHÉP là literal `NULL`** (`NULLIF(NULL, 'A')` báo lỗi **`ORA-00932: inconsistent datatypes`**). |
| **`COALESCE`** | `COALESCE(expr1, expr2, ..., exprN)` | Duyệt từ trái sang phải và trả về **biểu thức đầu tiên `NOT NULL`**. Nếu tất cả đều `NULL`, trả về `NULL`. | Hỗ trợ **Short-circuit evaluation** (đánh giá đoản mạch: dừng ngay khi gặp phần tử đầu tiên `NOT NULL`, không tính toán các biểu thức phía sau). **Nghiêm ngặt về kiểu:** Tất cả các đối số không phải `NULL` trong `COALESCE` **bắt buộc phải cùng kiểu dữ liệu** (không tự động ép kiểu giữa `NUMBER`, `VARCHAR2`, `DATE` — vi phạm sẽ báo lỗi **`ORA-00932`**). |

### 5.2. Ví dụ minh họa thực tế

Giả sử bảng `EMPLOYEES` có dữ liệu mẫu sau:

| EMP_ID | ENAME | SALARY | COMM | MANAGER_ID |
| :--- | :--- | :--- | :--- | :--- |
| `101` | `KING` | `10000` | *(NULL)* | *(NULL)* |
| `102` | `BLAKE` | `5000` | `0` | `101` |
| `103` | `TURNER` | `3000` | `500` | `102` |

```sql
SELECT emp_id,
       ename,
       NVL(comm, 100)                              AS nvl_comm,
       NVL2(comm, salary + comm, salary)           AS total_income,
       NULLIF(comm, 0)                             AS null_if_zero,
       COALESCE(comm, manager_id, -1)              AS first_not_null
FROM employees;
```

**Kết quả đầu ra:**

| EMP_ID | ENAME | NVL_COMM | TOTAL_INCOME | NULL_IF_ZERO | FIRST_NOT_NULL |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `101` | `KING` | `100` | `10000` | *(NULL)* | `-1` |
| `102` | `BLAKE` | `0` | `5000` | *(NULL)* | `0` |
| `103` | `TURNER` | `500` | `3500` | `500` | `500` |

> [!IMPORTANT]
> **Tại sao `COALESCE` tối ưu hiệu năng hơn `NVL`?**
> Hàm `NVL(expr1, expr2)` **luôn tính toán giá trị của cả `expr1` và `expr2`** trước khi kiểm tra `NULL`. Ngược lại, `COALESCE(expr1, expr2)` sử dụng cơ chế **Short-circuit**: nếu `expr1` đã `NOT NULL`, nó trả về `expr1` ngay lập tức mà không hề gọi hay tính toán `expr2`. Ví dụ:
> - `NVL(10, 1/0)` $\rightarrow$ Báo lỗi **`ORA-01476: divisor is equal to zero`** vì `1/0` vẫn bị thực thi!
> - `COALESCE(10, 1/0)` $\rightarrow$ Chạy thành công và trả về **`10`** vì `1/0` bị bỏ qua!

---

## 6. Biểu thức điều kiện: CASE WHEN và DECODE

Để hiện thực hóa cấu trúc rẽ nhánh `IF ... THEN ... ELSIF ... ELSE` ngay trong câu lệnh SQL, chúng ta sử dụng biểu thức chuẩn ANSI **`CASE`** hoặc hàm độc quyền của Oracle là **`DECODE`**.

### 6.1. Biểu thức `CASE` (Simple CASE vs. Searched CASE)

#### a) Simple CASE Expression (Biểu thức CASE đơn giản)
So sánh một biểu thức đầu vào (`expr`) với các giá trị cụ thể bằng phép so sánh bằng (`=`):
```sql
CASE expr
    WHEN comparison_expr1 THEN return_expr1
    WHEN comparison_expr2 THEN return_expr2
    [ ELSE else_expr ]
END
```

#### b) Searched CASE Expression (Biểu thức CASE tìm kiếm)
Đánh giá các điều kiện boolean độc lập (hỗ trợ `>`, `<`, `BETWEEN`, `LIKE`, `IN`, `IS NULL`, `AND`/`OR`):
```sql
CASE
    WHEN condition1 THEN return_expr1
    WHEN condition2 THEN return_expr2
    [ ELSE else_expr ]
END
```

**Các quy tắc sống còn của `CASE` trong phòng thi:**
1. Nếu không có nhánh `WHEN` nào thỏa mãn và không viết mệnh đề `ELSE`, biểu thức `CASE` tự động trả về **`NULL`**.
2. **Nghiêm ngặt về kiểu dữ liệu:** Tất cả các biểu thức sau `THEN` (`return_expr1`, `return_expr2`...) và `ELSE` (`else_expr`) **bắt buộc phải cùng kiểu dữ liệu**, nếu lệch kiểu (ví dụ một nhánh trả về `NUMBER`, một nhánh trả về `VARCHAR2`) sẽ báo lỗi **`ORA-00932: inconsistent datatypes`**. Cùng quy tắc này cũng áp dụng cho `expr` và các `comparison_expr` trong Simple CASE.
3. **Bẫy `WHEN NULL` trong Simple CASE:** Trong Simple CASE, `CASE col WHEN NULL THEN ...` được Oracle dịch ngầm thành `col = NULL`. Mà trong SQL, `col = NULL` luôn có giá trị chân lý là `UNKNOWN` (không bao giờ `TRUE`)! Do đó nhánh `WHEN NULL` trong Simple CASE **không bao giờ được chạy**. Để kiểm tra `NULL`, bạn bắt buộc phải dùng **Searched CASE**: `CASE WHEN col IS NULL THEN ...`.

### 6.2. Hàm `DECODE` và Sự khác biệt với `CASE`

```sql
DECODE(expression, search1, result1 [, search2, result2, ...] [, default])
```
Hàm `DECODE` so sánh `expression` lần lượt với `search1`, `search2`... Nếu khớp sẽ trả về `result` tương ứng. Nếu không khớp bất kỳ giá trị nào thì trả về `default` (hoặc trả về `NULL` nếu lược bỏ `default`).

> [!WARNING]
> **BẪY THI KINH ĐIỂN: `DECODE` đối xử với `NULL` khác hoàn toàn `CASE`!**
> Trong toàn bộ ngôn ngữ Oracle SQL, `NULL` không bao giờ bằng `NULL` (`NULL = NULL` là `UNKNOWN`), **NGOẠI TRỪ hàm `DECODE` (và toán tử tập hợp / `GROUP BY`)**.
> Hàm `DECODE` coi hai giá trị `NULL` là **BẰNG NHAU**!

Hãy xem ví dụ đối chiếu trực tiếp dưới đây:

```sql
SELECT CASE NULL
           WHEN NULL THEN 'Match in Simple CASE'
           ELSE 'NO Match in Simple CASE'
       END AS simple_case_null,
       CASE
           WHEN NULL IS NULL THEN 'Match in Searched CASE'
           ELSE 'NO Match'
       END AS searched_case_null,
       DECODE(NULL, NULL, 'Match in DECODE', 'NO Match') AS decode_null
FROM dual;
```

**Kết quả đầu ra:**

| SIMPLE_CASE_NULL | SEARCHED_CASE_NULL | DECODE_NULL |
| :--- | :--- | :--- |
| `NO Match in Simple CASE` | `Match in Searched CASE` | `Match in DECODE` |

**Lưu ý thêm về ép kiểu trong `DECODE`:**
Kiểu dữ liệu trả về của `DECODE` được quyết định bởi kiểu dữ liệu của **`result1`** (kết quả đầu tiên). Đặc biệt, nếu `result1` là literal `NULL`, Oracle sẽ ép kiểu trả về của toàn hàm `DECODE` thành **`VARCHAR2`**!

---

## 7. Bài tập thực hành tự luyện (Kèm lời giải chi tiết)

### Bài tập 1: Xử lý chuỗi nâng cao (Trích xuất tên miền và chuẩn hóa tên)
Cho bảng `CUSTOMERS` có cột `FULL_NAME` (ví dụ `'  nguyen_van   an  '`) và cột `EMAIL` (ví dụ `'an.nv@vnpt.vn'`). Hãy viết câu truy vấn trả về:
1. `CLEAN_NAME`: Cắt bỏ khoảng trắng hai đầu, thay dấu `_` bằng khoảng trắng, và viết hoa chữ cái đầu mỗi từ.
2. `USERNAME`: Phần tài khoản đứng trước ký tự `'@'` trong `EMAIL`.
3. `DOMAIN`: Phần tên miền đứng sau ký tự `'@'` trong `EMAIL`.

<details>
<summary><b>👉 Xem Lời Giải Chi Tiết Bài Tập 1</b></summary>

```sql
SELECT INITCAP(REPLACE(TRIM(full_name), '_', ' ')) AS clean_name,
       SUBSTR(email, 1, INSTR(email, '@') - 1)     AS username,
       SUBSTR(email, INSTR(email, '@') + 1)        AS domain
FROM customers;
```
- **Giải thích:**
  - `INSTR(email, '@')` trả về vị trí của ký tự `'@'`.
  - `SUBSTR(email, 1, INSTR(email, '@') - 1)` lấy từ đầu chuỗi đến ngay trước ký tự `'@'`.
  - `SUBSTR(email, INSTR(email, '@') + 1)` lấy từ ký tự ngay sau `'@'` đến hết chuỗi (do lược bỏ đối số thứ 3).
</details>

### Bài tập 2: Tính toán mốc thời gian thử việc và đánh giá lương
Cho bảng `EMPLOYEES(emp_id, ename, hire_date, salary, comm)`. Hãy viết câu lệnh SQL hiển thị:
1. `REVIEW_DATE`: Ngày thứ Hai đầu tiên sau khi nhân viên làm việc tròn 6 tháng.
2. `TENURE_MONTHS`: Số tháng làm việc tính đến ngày hiện tại, làm tròn xuống số nguyên gần nhất.
3. `TAX_RATE`: Nếu tổng thu nhập (`salary + comm`, coi `comm` bị `NULL` là `0`) `< 5000` thì thuế `0%`, từ `5000` đến `< 10000` thì thuế `10%`, từ `10000` trở lên thì thuế `20%`.

<details>
<summary><b>👉 Xem Lời Giải Chi Tiết Bài Tập 2</b></summary>

```sql
SELECT emp_id,
       ename,
       NEXT_DAY(ADD_MONTHS(hire_date, 6), 'MONDAY') AS review_date,
       TRUNC(MONTHS_BETWEEN(SYSDATE, hire_date))    AS tenure_months,
       CASE
           WHEN salary + NVL(comm, 0) < 5000  THEN '0%'
           WHEN salary + NVL(comm, 0) < 10000 THEN '10%'
           ELSE '20%'
       END AS tax_rate
FROM employees;
```
- **Giải thích:**
  - `ADD_MONTHS(hire_date, 6)` cộng đúng 6 tháng vào ngày tuyển dụng, sau đó bọc `NEXT_DAY(..., 'MONDAY')` để tìm ngày thứ Hai kế tiếp.
  - Vì `CASE WHEN` duyệt tuần tự từ trên xuống dưới (short-circuit), nếu dòng nào đã lọt xuống nhánh `WHEN` thứ hai thì chắc chắn tổng thu nhập đã `>= 5000`, nên chỉ cần viết `< 10000`.
</details>

---

## 8. Tổng hợp Bẫy thi OCA/OCP (Exam Essentials)

| STT | Chủ đề | Bẫy thi thường gặp trong đề OCA 1Z0-071 / VNPT | Cách xử lý đúng |
| :--- | :--- | :--- | :--- |
| **1** | `SUBSTR(s, 0, n)` | Nghĩ rằng vị trí `0` gây lỗi hoặc trả về `NULL`. | Trong `SUBSTR`, vị trí `0` được Oracle đối xử **giống hệt vị trí `1`**. |
| **2** | `LPAD` / `RPAD` | Nghĩ rằng `LPAD('ABCDEF', 3, '*')` giữ nguyên `'ABCDEF'`. | Nếu độ dài đích nhỏ hơn độ dài chuỗi gốc, cả `LPAD` và `RPAD` đều **cắt cụt chuỗi gốc** còn `'ABC'`. |
| **3** | `TRIM` vs `LTRIM` | Viết `TRIM('ab' FROM 'abXYZab')` để cắt `'ab'`. | `TRIM` chỉ cho phép cắt **1 ký tự duy nhất** (`ORA-30001`). Muốn cắt tập nhiều ký tự phải dùng `LTRIM`/`RTRIM`. |
| **4** | `REPLACE` vs `TRANSLATE` | Nhầm lẫn cơ chế thay thế của 2 hàm. | `REPLACE` thay thế theo **cả cụm chuỗi**; `TRANSLATE` ánh xạ **từng ký tự 1-1** theo vị trí. |
| **5** | `ROUND(n, -2)` | Nhầm lẫn số âm trong `ROUND`/`TRUNC` là làm tròn phần thập phân. | Tham số âm làm tròn **bên trái** dấu thập phân: `-1` là hàng chục, `-2` là hàng trăm, `-3` là hàng nghìn. |
| **6** | `MOD(m, 0)` | Nghĩ rằng chia lấy dư cho `0` sẽ báo lỗi `zero divide`. | `MOD(m, 0)` hoàn toàn hợp lệ và trả về chính **`m`**. |
| **7** | `EXTRACT` trên `DATE` | Gọi `EXTRACT(HOUR FROM SYSDATE)`. | Báo lỗi `ORA-30076`! Kiểu `DATE` chỉ cho phép `EXTRACT` 3 trường: `YEAR`, `MONTH`, `DAY`. |
| **8** | `ROUND(date, 'MONTH')` | Nghĩ rằng tháng 2 (28 ngày) làm tròn lên từ ngày 15. | Mốc làm tròn tháng của `ROUND(date, 'MONTH')` **luôn cố định là ngày 16** cho mọi tháng (1–15 xuống, 16–31 lên). |
| **9** | `NVL` vs `COALESCE` | Truyền khác kiểu dữ liệu vào `COALESCE(num_col, 'N/A')`. | Báo lỗi `ORA-00932`! Mọi đối số của `COALESCE` phải cùng kiểu; `NVL` cũng lỗi `ORA-01722` nếu không ép `'N/A'` thành số được. |
| **10** | `CASE` vs `DECODE` với `NULL` | Viết `CASE col WHEN NULL THEN ...` để bắt giá trị `NULL`. | Simple `CASE` dùng phép `=`, nên `WHEN NULL` không bao giờ khớp. Ngược lại, `DECODE(col, NULL, ...)` coi **`NULL` bằng `NULL`**. |
