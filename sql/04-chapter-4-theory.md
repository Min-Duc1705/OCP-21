# Chương 4: Điều Kiện Lọc Dữ Liệu và Logic Ba Giá Trị - Oracle SQL OCA/OCP (1Z0-071)

> **Tài liệu tham chiếu:** *OCA/OCP Oracle Database SQL Certified Associate Study Guide (Exam 1Z0-071)* & *Oracle Database SQL Language Reference*.  
> **Mục tiêu khảo thí:** Các toán tử so sánh trong mệnh đề `WHERE`; Toán tử logic `AND`, `OR`, `NOT` và Logic ba giá trị (Three-Valued Logic: `TRUE`, `FALSE`, `UNKNOWN`); Toán tử `IN` và bẫy kinh điển của `NOT IN` khi gặp `NULL`; Toán tử khoảng `BETWEEN ... AND ...`; So khớp mẫu chuỗi với `LIKE`, ký tự đại diện `%`, `_` và mệnh đề `ESCAPE`; Kiểm tra `IS NULL` / `IS NOT NULL`; Thứ tự ưu tiên của các toán tử (Operator Precedence).

---

## 📑 Mục Lục Chi Tiết

1. [Các Toán Tử So Sánh Cơ Bản Trong Mệnh Đề `WHERE`](#1-các-toán-tử-so-sánh-cơ-bản-trong-mệnh-đề-where)
2. [So Sánh Với `NULL`, `IS NULL` và Logic Ba Giá Trị (Three-Valued Logic)](#2-so-sánh-với-null-is-null-và-logic-ba-giá-trị-three-valued-logic)
3. [Toán Tử Tập Hợp: `IN`, `NOT IN` và Bẫy Kinh Điển `NOT IN (..., NULL)`](#3-toán-tử-tập-hợp-in-not-in-và-bẫy-kinh-điển-not-in--null)
4. [Toán Tử Khoảng Giá Trị: `BETWEEN ... AND ...`](#4-toán-tử-khoảng-giá-trị-between--and-)
5. [Tìm Kiếm Theo Mẫu Chuỗi: `LIKE`, `%`, `_` và Mệnh Đề `ESCAPE`](#5-tìm-kiếm-theo-mẫu-chuỗi-like--_-và-mệnh-đề-escape)
6. [Độ Ưu Tiên Của Các Toán Tử (Operator Precedence: `NOT` $\rightarrow$ `AND` $\rightarrow$ `OR`)](#6-độ-ưu-tiên-của-các-toán-tử-operator-precedence-not--and--or)
7. [Bài Tập Thực Hành Tự Luyện (Hands-on Labs)](#7-bài-tập-thực-hành-tự-luyện-hands-on-labs)
8. [Tổng Hợp Bẫy Thi OCA/OCP Cốt Lõi Cần Nhớ (Exam Essentials)](#8-tổng-hợp-bẫy-thi-ocaocp-cốt-lõi-cần-nhớ-exam-essentials)

---

## 1. Các Toán Tử So Sánh Cơ Bản Trong Mệnh Đề `WHERE`

Mệnh đề `WHERE` nằm ngay sau mệnh đề `FROM`, dùng để lọc các dòng dữ liệu thỏa mãn điều kiện trước khi gom nhóm hoặc hiển thị.

| Toán tử | Ý nghĩa | Lưu ý trong đề thi Oracle 1Z0-071 |
| :---: | :--- | :--- |
| `=` | Bằng | Trong SQL dùng **1 dấu bằng `=`** (không dùng `==` như Java/C). |
| `<>`, `!=`, `^=` | Khác (Không bằng) | Cả 3 cách viết `<>`, `!=`, `^=` đều hợp lệ trong Oracle (chuẩn ANSI là `<>`). Không được có khoảng trắng giữa `!` và `=`. |
| `>`, `<` | Lớn hơn, Nhỏ hơn | Áp dụng cho cả Số (`NUMBER`), Ngày giờ (`DATE`/`TIMESTAMP`) và Chuỗi (`VARCHAR2`/`CHAR` theo thứ tự mã ASCII/binary). |
| `>=`, `<=` | Lớn hơn hoặc bằng, Nhỏ hơn hoặc bằng | Không được đảo ngược thành `=>` hay `=<`. |

**Quy tắc chọn dòng của mệnh đề `WHERE`:**
> Một dòng dữ liệu **CHỈ** được trả về trong tập kết quả của `WHERE` khi biểu thức điều kiện đánh giá ra đúng giá trị **`TRUE`**. Nếu biểu thức đánh giá ra **`FALSE`** hoặc **`UNKNOWN`**, dòng đó sẽ bị loại bỏ!

---

## 2. So Sánh Với `NULL`, `IS NULL` và Logic Ba Giá Trị (Three-Valued Logic)

### 2.1. Tại sao không thể dùng `= NULL` hoặc `<> NULL`?
Vì `NULL` đại diện cho một giá trị **chưa xác định (unknown)**, ta không thể biết hai giá trị chưa xác định có bằng nhau hay khác nhau hay không.
* Mọi phép so sánh thông thường (`=`, `<>`, `!=`, `<`, `>`, `<=`, `>=`) với `NULL` **LUÔN LUÔN trả về giá trị logic thứ ba là `UNKNOWN`**!
  * `salary = NULL` $\rightarrow$ **`UNKNOWN`**
  * `salary <> NULL` $\rightarrow$ **`UNKNOWN`**
  * `NULL = NULL` $\rightarrow$ **`UNKNOWN`**

> [!WARNING]
> **Bẫy thi cực kỳ phổ biến:**
> Câu truy vấn `SELECT * FROM employees WHERE commission_pct = NULL;` hoặc `WHERE commission_pct != NULL;` có báo lỗi cú pháp không?
> **KHÔNG BÁO LỖI!** Câu lệnh hoàn toàn hợp lệ về mặt cú pháp và thực thi thành công, nhưng sẽ luôn luôn trả về **0 dòng (no rows selected)** vì điều kiện luôn ra `UNKNOWN`!
> Để kiểm tra `NULL`, bạn **bắt buộc** phải dùng toán tử **`IS NULL`** hoặc **`IS NOT NULL`**.

### 2.2. Bảng Chân Trị của Logic Ba Giá Trị (Three-Valued Logic: `TRUE`, `FALSE`, `UNKNOWN`)
Trong ngôn ngữ lập trình thông thường chỉ có Logic 2 giá trị (`TRUE` / `FALSE`), nhưng trong SQL luôn là **Logic 3 giá trị (`TRUE`, `FALSE`, `UNKNOWN`)**. Bạn bắt buộc phải nắm vững bảng chân trị của `AND`, `OR`, `NOT` khi kết hợp với `UNKNOWN`:

#### 1. Toán tử `NOT` (Phủ định)
* `NOT (TRUE)` $\rightarrow$ **`FALSE`**
* `NOT (FALSE)` $\rightarrow$ **`TRUE`**
* **`NOT (UNKNOWN)` $\rightarrow$ `UNKNOWN`** *(Phủ định của cái chưa biết vẫn là chưa biết!)*

#### 2. Toán tử `AND` (Chỉ cần 1 vế `FALSE` là kết quả chắc chắn `FALSE`)
| `AND` | `TRUE` | `FALSE` | `UNKNOWN` |
| :---: | :---: | :---: | :---: |
| **`TRUE`** | `TRUE` | `FALSE` | **`UNKNOWN`** |
| **`FALSE`** | `FALSE` | `FALSE` | **`FALSE`** |
| **`UNKNOWN`** | **`UNKNOWN`** | **`FALSE`** | **`UNKNOWN`** |

* **Mẹo nhớ nhanh cho `AND`:**
  * `TRUE AND UNKNOWN` $\rightarrow$ **`UNKNOWN`** (phụ thuộc vào vế chưa biết nên kết quả là chưa biết).
  * `FALSE AND UNKNOWN` $\rightarrow$ **`FALSE`** (vì trong phép `AND`, hễ có một vế `FALSE` thì dù vế kia là gì kết quả vẫn chắc chắn là `FALSE`!).

#### 3. Toán tử `OR` (Chỉ cần 1 vế `TRUE` là kết quả chắc chắn `TRUE`)
| `OR` | `TRUE` | `FALSE` | `UNKNOWN` |
| :---: | :---: | :---: | :---: |
| **`TRUE`** | `TRUE` | `TRUE` | **`TRUE`** |
| **`FALSE`** | `TRUE` | `FALSE` | **`UNKNOWN`** |
| **`UNKNOWN`** | **`TRUE`** | **`UNKNOWN`** | **`UNKNOWN`** |

* **Mẹo nhớ nhanh cho `OR`:**
  * `TRUE OR UNKNOWN` $\rightarrow$ **`TRUE`** (vì trong phép `OR`, chỉ cần 1 vế `TRUE` là cả biểu thức chắc chắn `TRUE` bất chấp vế kia là `NULL`/chưa biết!).
  * `FALSE OR UNKNOWN` $\rightarrow$ **`UNKNOWN`** (do vế đầu đã `FALSE`, kết quả phụ thuộc vế thứ hai đang `UNKNOWN`, nên dòng này sẽ bị loại bỏ trong `WHERE`!).

**Ví dụ thực tế minh họa `TRUE OR UNKNOWN` vs `FALSE AND UNKNOWN`:**
Cho nhân viên `Grant` có `department_id = NULL` và `salary = 7000`:
```sql
-- Truy vấn 1: Grant CÓ xuất hiện không? -> CÓ!
-- Vì (department_id = 80) là UNKNOWN, nhưng (salary = 7000) là TRUE.
-- UNKNOWN OR TRUE ===> TRUE!
SELECT last_name FROM employees
WHERE department_id = 80 OR salary = 7000;

-- Truy vấn 2: Grant CÓ xuất hiện không? -> KHÔNG!
-- Vì NOT (department_id = 80) là NOT (UNKNOWN) ===> UNKNOWN!
SELECT last_name FROM employees
WHERE NOT (department_id = 80);
```

---

## 3. Toán Tử Tập Hợp: `IN`, `NOT IN` và Bẫy Kinh Điển `NOT IN (..., NULL)`

### 3.1. Bản chất của toán tử `IN`
Toán tử `IN (v1, v2, ..., vn)` kiểm tra xem giá trị của cột có bằng **bất kỳ** giá trị nào trong danh sách hay không. Nó chính là cách viết gọn của chuỗi phép toán **`OR`**:
```sql
WHERE department_id IN (10, 20, 30)
-- Hoàn toàn tương đương với:
WHERE (department_id = 10 OR department_id = 20 OR department_id = 30)
```

**Chuyện gì xảy ra khi trong danh sách `IN` có chứa `NULL`?**
Giả sử ta viết:
```sql
SELECT employee_id, last_name, department_id
FROM employees
WHERE department_id IN (10, 20, NULL);
```
Hãy khai triển theo phép **`OR`**:
`WHERE (department_id = 10) OR (department_id = 20) OR (department_id = NULL)`
* Với nhân viên thuộc phòng `10`: `TRUE OR FALSE OR UNKNOWN` $\rightarrow$ **`TRUE`** (Được lấy!).
* Với nhân viên thuộc phòng `20`: `FALSE OR TRUE OR UNKNOWN` $\rightarrow$ **`TRUE`** (Được lấy!).
* Với nhân viên có `department_id IS NULL`: `UNKNOWN OR UNKNOWN OR UNKNOWN` $\rightarrow$ **`UNKNOWN`** (Bị loại! Vì `NULL = NULL` là `UNKNOWN`).
* **Kết luận cho `IN (10, 20, NULL)`:** Câu lệnh **vẫn trả về bình thường các dòng có giá trị `10` và `20`** (nhưng không trả về dòng có giá trị `NULL`).

### 3.2. Bẫy Kinh Điển "Sát Thủ": `NOT IN` gặp `NULL` trả về 0 dòng!
Toán tử `NOT IN (v1, v2, ..., vn)` tương đương với chuỗi phép toán **`AND`** các điều kiện khác (`<>`):
```sql
WHERE department_id NOT IN (10, 20)
-- Hoàn toàn tương đương với:
WHERE (department_id <> 10 AND department_id <> 20)
```

> [!CAUTION]
> **BẪY THI KINH ĐIỂN NHẤT MỌI THỜI ĐẠI TRONG ORACLE SQL (1Z0-071 & VNPT):**
> Điều gì xảy ra khi bên trong danh sách (hoặc Subquery) của **`NOT IN` có chứa dù chỉ 1 giá trị `NULL`**?
> ```sql
> SELECT employee_id, last_name, department_id
> FROM employees
> WHERE department_id NOT IN (10, 20, NULL);
> ```
> Hãy khai triển theo phép **`AND`**:
> `WHERE (department_id <> 10) AND (department_id <> 20) AND (department_id <> NULL)`
> * Xét một nhân viên thuộc phòng `90`:
>   * `90 <> 10` $\rightarrow$ `TRUE`
>   * `90 <> 20` $\rightarrow$ `TRUE`
>   * `90 <> NULL` $\rightarrow$ **`UNKNOWN`**
>   * Ghép lại bằng `AND`: `TRUE AND TRUE AND UNKNOWN` $\rightarrow$ **`UNKNOWN`**!
> * Vì mệnh đề `WHERE` chỉ lấy dòng có kết quả `TRUE`, nên nhân viên phòng `90` (và mọi phòng ban khác!) đều bị đánh giá là `UNKNOWN` và bị loại bỏ sạch sẽ!
> * **QUY TẮC VÀNG:** **Bất kỳ điều kiện `WHERE col NOT IN (...)` nào mà bên trong danh sách (hoặc kết quả Subquery) có chứa `NULL` thì sẽ LUÔN LUÔN TRẢ VỀ 0 DÒNG (No rows selected)!**

**Bảng đối chiếu trực quan `IN` vs `NOT IN` khi có `NULL`:**

| Biểu thức điều kiện | Khai triển tương đương | Kết quả với dòng có `col = 90` | Kết quả tổng thể của câu truy vấn |
| :--- | :--- | :---: | :--- |
| `col IN (10, 20, NULL)` | `col = 10 OR col = 20 OR col = NULL` | `FALSE` (`FALSE OR FALSE OR UNKNOWN` = `UNKNOWN`) | Trả về các dòng có **`col = 10` hoặc `col = 20`**. |
| **`col NOT IN (10, 20, NULL)`** | `col <> 10 AND col <> 20 AND col <> NULL` | `TRUE AND TRUE AND UNKNOWN` = **`UNKNOWN`** | **LUÔN TRẢ VỀ 0 DÒNG!** |

---

## 4. Toán Tử Khoảng Giá Trị: `BETWEEN ... AND ...`

Toán tử `BETWEEN low_value AND high_value` dùng để kiểm tra một giá trị có nằm trong đoạn từ `low_value` đến `high_value` hay không (áp dụng cho cả Số, Ngày tháng và Chuỗi ký tự).

### 4.1. 3 Quy tắc bắt buộc phải nhớ về `BETWEEN ... AND ...`
1. **Tính bao gồm hai đầu mút (Inclusive):**
   * `salary BETWEEN 5000 AND 10000` hoàn toàn tương đương với:
     `salary >= 5000 AND salary <= 10000` (Lấy **cả** dòng có lương đúng bằng `5000` và dòng có lương đúng bằng `10000`!).
2. **Thứ tự bắt buộc: Giá trị nhỏ (`low_value`) phải đứng trước, giá trị lớn (`high_value`) phải đứng sau!**
   * ⚠️ **Bẫy thi:** Chuyện gì xảy ra nếu bạn viết ngược giá trị lớn đứng trước giá trị nhỏ:
     ```sql
     SELECT employee_id, salary FROM employees
     WHERE salary BETWEEN 10000 AND 5000;
     ```
     Oracle **KHÔNG báo lỗi cú pháp**, mà dịch thẳng thành: `WHERE salary >= 10000 AND salary <= 5000`. Vì không có con số nào vừa $\ge 10000$ lại vừa $\le 5000$, câu truy vấn chạy thành công và trả về **0 dòng**!
3. **Phủ định `NOT BETWEEN low AND high`:**
   * Tương đương với: `col < low OR col > high` (không bao gồm 2 đầu mút).

---

## 5. Tìm Kiếm Theo Mẫu Chuỗi: `LIKE`, `%`, `_` và Mệnh Đề `ESCAPE`

Khi cần tìm kiếm chuỗi theo mẫu ký tự gần đúng (Pattern Matching), ta sử dụng toán tử **`LIKE`** (hoặc phủ định **`NOT LIKE`**) đi kèm với 2 ký tự đại diện (Wildcards):

| Ký tự đại diện | Ý nghĩa | Ví dụ mẫu `LIKE` | Các chuỗi khớp |
| :---: | :--- | :--- | :--- |
| **`%`** (Phần trăm) | Đại diện cho **0, 1 hoặc nhiều ký tự bất kỳ** (bất kể độ dài). | `LIKE 'S%'`<br>`LIKE '%a%'` | `'S'`, `'Steven'`, `'Smith'`<br>`'King'` *(không khớp)*, `'Grant'`, `'De Haan'` |
| **`_`** (Gạch dưới) | Đại diện cho **ĐÚNG 1 ký tự đơn bất kỳ** (bắt buộc phải có mặt 1 ký tự ở vị trí đó). | `LIKE '_a%'`<br>`LIKE '___'` (3 dấu `_`) | `'David'`, `'Pat'` *(chữ cái thứ 2 là `'a'`)*<br>Chỉ khớp chuỗi có **đúng 3 ký tự** (như `'Lex'`, `'Pat'`). |

> [!TIP]
> **Mẹo phân tích đề thi kết hợp `_` và `%`:**
> * Mẫu `LIKE '_A%'`: Ký tự đầu tiên là gì cũng được (1 ký tự), ký tự thứ hai **bắt buộc là `'A'`**, theo sau là 0 hoặc nhiều ký tự bất kỳ.
> * Mẫu `LIKE '%A_'`: Kết thúc bằng `'A'` + **đúng 1 ký tự** ở cuối (tức chữ `'A'` là ký tự áp chót / thứ 2 từ cuối lên).
> * Mẫu `LIKE '%'`: Khớp với **tất cả các chuỗi khác `NULL`** (nhưng **KHÔNG khớp với dòng có giá trị `NULL`**!).

### 5.1. Tìm kiếm chính ký tự `%` hoặc `_` bằng mệnh đề `ESCAPE`
Trong bảng `JOBS` của Oracle, các mã công việc luôn chứa dấu gạch dưới `_` thực sự trong dữ liệu (như `'IT_PROG'`, `'SA_REP'`, `'SA_MAN'`, `'ST_CLERK'`).
Nếu bạn viết:
```sql
-- ❌ SAI: Dấu '_' bị hiểu là ký tự đại diện cho 1 ký tự bất kỳ (khớp luôn cả 'SACP', 'SA123'!)
SELECT job_id FROM jobs WHERE job_id LIKE 'SA_%';
```
Để báo cho Oracle biết dấu `_` (hoặc `%`) trong mẫu tìm kiếm là **ký tự thường (literal character)** chứ không phải ký tự đại diện, bạn dùng mệnh đề **`ESCAPE 'ký_tự_thoát'`**:

```sql
-- ✅ ĐÚNG CHUẨN: Khai báo '\' (hoặc bất kỳ ký tự 1-byte nào như '#', '$', '!') làm ký tự ESCAPE:
SELECT job_id, job_title
FROM jobs
WHERE job_id LIKE 'SA\_%' ESCAPE '\';

-- Hoặc dùng '#' làm ký tự ESCAPE đều hoàn toàn hợp lệ:
SELECT job_id, job_title
FROM jobs
WHERE job_id LIKE 'SA#_%' ESCAPE '#';
```

**Bảng dữ liệu mẫu `JOBS`:**
| JOB_ID | JOB_TITLE |
| :--- | :--- |
| `SA_MAN` | Sales Manager |
| `SA_REP` | Sales Representative |
| `ST_MAN` | Stock Manager |
| `SACP` | Fake Job Code (không có dấu `_`) |

**Kết quả đầu ra của câu truy vấn có `ESCAPE`:**
| JOB_ID | JOB_TITLE |
| :--- | :--- |
| `SA_MAN` | Sales Manager |
| `SA_REP` | Sales Representative |
*(Dòng `'SACP'` bị loại bỏ vì ký tự thứ 3 không phải là dấu gạch dưới `_` thật sự!)*

> [!WARNING]
> **Bẫy thi với `ESCAPE`:**
> 1. Trong Oracle SQL, **không có ký tự `ESCAPE` mặc định**! Nếu bạn viết `WHERE job_id LIKE 'SA\_%'` mà **quên viết `ESCAPE '\'` ở cuối**, Oracle sẽ hiểu `\` là một ký tự chữ bình thường và đi tìm chuỗi có cả dấu `\` ở giữa!
> 2. Biểu thức đi sau từ khóa `ESCAPE` bắt buộc phải là một chuỗi có **độ dài đúng bằng 1 ký tự** (nếu viết `ESCAPE '\\'` gồm 2 ký tự sẽ báo lỗi `ORA-01425: escape character must be character string of length 1`).

---

## 6. Độ Ưu Tiên Của Các Toán Tử (Operator Precedence: `NOT` $\rightarrow$ `AND` $\rightarrow$ `OR`)

Khi một mệnh đề `WHERE` kết hợp nhiều toán tử số học, so sánh và logic mà không có dấu ngoặc đơn `(...)`, Oracle sẽ thực thi theo thứ tự độ ưu tiên từ cao xuống thấp như bảng sau:

| Mức ưu tiên | Nhóm toán tử | Các toán tử cụ thể |
| :---: | :--- | :--- |
| **1 (Cao nhất)** | Dấu ngoặc đơn | `( ... )` |
| **2** | Toán tử một ngôi (Dấu âm/dương) | `+`, `-` (unary) |
| **3** | Nhân / Chia | `*`, `/` |
| **4** | Cộng / Trừ / Nối chuỗi | `+`, `-`, `\|\|` |
| **5** | Toán tử so sánh & Kiểm tra | `=`, `!=`, `<>`, `<`, `>`, `<=`, `>=`, `IS [NOT] NULL`, `LIKE`, `[NOT] BETWEEN`, `[NOT] IN` |
| **6** | Phủ định logic | **`NOT`** |
| **7** | Hội logic (Và) | **`AND`** |
| **8 (Thấp nhất)** | Tuyển logic (Hoặc) | **`OR`** |

> [!IMPORTANT]
> **Bẫy Thi Kinh Điển Về Độ Ưu Tiên Giữa `AND` và `OR`:**
> Hãy nhớ thần chú: **`NOT` trước $\rightarrow$ `AND` giữa $\rightarrow$ `OR` cuối cùng!** (`AND` luôn có độ ưu tiên **CAO HƠN** `OR`!).
> Hãy xem hai câu truy vấn dưới đây khác nhau một trời một vực chỉ vì thiếu dấu ngoặc đơn:

```sql
-- Truy vấn 1 (KHÔNG có ngoặc đơn):
SELECT last_name, job_id, salary
FROM employees
WHERE job_id = 'SA_REP'
   OR job_id = 'AD_PRES'
  AND salary > 15000;
```
**Oracle hiểu Truy vấn 1 như thế nào?**
Vì **`AND` có độ ưu tiên cao hơn `OR`**, Oracle tự động gom cụm `AND` trước, tương đương với:
```sql
WHERE job_id = 'SA_REP'
   OR (job_id = 'AD_PRES' AND salary > 15000);
```
$\rightarrow$ Kết quả: Lấy **TẤT CẢ nhân viên có `job_id = 'SA_REP'` (bất kể lương bao nhiêu, kể cả lương 6000!)**, cộng với những nhân viên vừa là `'AD_PRES'` vừa có lương `> 15000`!

Nếu yêu cầu đề bài là: *"Tìm các nhân viên thuộc một trong hai chức danh `'SA_REP'` hoặc `'AD_PRES'`, và những người này phải có mức lương trên `15000`"*, bạn **BẮT BUỘC phải dùng dấu ngoặc đơn `(...)` bao quanh phép `OR`**:
```sql
-- Truy vấn 2 (CÓ ngoặc đơn - Đúng ý đồ nghiệp vụ):
SELECT last_name, job_id, salary
FROM employees
WHERE (job_id = 'SA_REP' OR job_id = 'AD_PRES')
  AND salary > 15000;
```

---

## 7. Bài Tập Thực Hành Tự Luyện (Hands-on Labs)

### Bài tập 1: Phân tích kết quả lọc với `AND`, `OR` và Độ ưu tiên toán tử
**Đề bài:** Cho bảng `EMPLOYEES` gồm 4 dòng dữ liệu như sau:

| EMP_ID | LAST_NAME | DEPT_ID | JOB_ID | SALARY |
| :---: | :--- | :---: | :--- | :---: |
| 1 | An | 10 | IT_PROG | 4000 |
| 2 | Binh | 20 | IT_PROG | 9000 |
| 3 | Cuong | 10 | SA_REP | 9000 |
| 4 | Dung | 20 | SA_REP | 4000 |

Hãy xác định chính xác những `EMP_ID` nào sẽ được trả về bởi mỗi câu truy vấn dưới đây:
```sql
-- Truy vấn A:
SELECT emp_id FROM employees
WHERE dept_id = 10 OR dept_id = 20 AND salary >= 8000;

-- Truy vấn B:
SELECT emp_id FROM employees
WHERE (dept_id = 10 OR dept_id = 20) AND salary >= 8000;
```

<details>
<summary><b>👉 Xem Lời Giải Chi Tiết Bài Tập 1</b></summary>

* **Kết quả của Truy vấn A:** Trả về **`EMP_ID = 1, 2, 3`** (3 dòng).
  * *Giải thích:* Vì `AND` có độ ưu tiên cao hơn `OR`, Truy vấn A tương đương với: `WHERE dept_id = 10 OR (dept_id = 20 AND salary >= 8000)`.
  * Dòng 1 (`An`) và Dòng 3 (`Cuong`) có `dept_id = 10` $\rightarrow$ Thỏa mãn vế đầu của `OR` (không cần xét lương!).
  * Dòng 2 (`Binh`) có `dept_id = 20` và `salary = 9000 >= 8000` $\rightarrow$ Thỏa mãn vế sau của `OR`.
  * Dòng 4 (`Dung`) có `dept_id = 20` nhưng `salary = 4000 < 8000` $\rightarrow$ Bị loại.
* **Kết quả của Truy vấn B:** Trả về **`EMP_ID = 2, 3`** (2 dòng).
  * *Giải thích:* Có dấu ngoặc đơn nên cả hai điều kiện (thuộc phòng 10 hoặc 20, VÀ lương $\ge 8000$) đều phải thỏa mãn. Chỉ có `Binh` (2) và `Cuong` (3) có lương `9000 >= 8000`.
</details>

---

### Bài tập 2: Giải mã bẫy Three-Valued Logic (`NULL`, `IN`, `NOT IN`)
**Đề bài:** Cho bảng `DEPARTMENTS` có 3 phòng ban với cột `MANAGER_ID` lần lượt là: `100`, `200`, và `NULL`. Trong bảng `EMPLOYEES` đang có nhân viên `employee_id = 105` (không phải là trưởng phòng của bất kỳ phòng ban nào).
Hãy cho biết nhân viên `105` có xuất hiện trong kết quả của 2 câu truy vấn dưới đây hay không? Giải thích tại sao và viết lại Truy vấn 2 để chạy đúng:
```sql
-- Truy vấn 1:
SELECT employee_id, last_name FROM employees
WHERE employee_id IN (100, 105, NULL);

-- Truy vấn 2: Tìm các nhân viên KHÔNG nằm trong danh sách MANAGER_ID
SELECT employee_id, last_name FROM employees
WHERE employee_id NOT IN (100, 200, NULL);
```

<details>
<summary><b>👉 Xem Lời Giải Chi Tiết Bài Tập 2</b></summary>

1. **Ở Truy vấn 1:** Nhân viên `105` **CÓ XUẤT HIỆN**!
   * *Giải thích:* `employee_id IN (100, 105, NULL)` tương đương với `(105 = 100) OR (105 = 105) OR (105 = NULL)` $\rightarrow$ `FALSE OR TRUE OR UNKNOWN` $\rightarrow$ **`TRUE`**.
2. **Ở Truy vấn 2:** Nhân viên `105` **KHÔNG XUẤT HIỆN** (câu truy vấn trả về **0 dòng**)!
   * *Giải thích:* `employee_id NOT IN (100, 200, NULL)` tương đương với `(105 <> 100) AND (105 <> 200) AND (105 <> NULL)` $\rightarrow$ `TRUE AND TRUE AND UNKNOWN` $\rightarrow$ **`UNKNOWN`**.
3. **Cách sửa Truy vấn 2 trong thực tế (khi dùng `NOT IN` với cột/subquery có thể chứa `NULL`):**
   Luôn lọc bỏ `NULL` hoặc dùng hàm `NVL` trước khi đưa vào `NOT IN` (hoặc chuyển sang dùng `NOT EXISTS`):
   ```sql
   SELECT employee_id, last_name
   FROM employees
   WHERE employee_id NOT IN (
       SELECT manager_id FROM departments WHERE manager_id IS NOT NULL
   );
   ```
</details>

---

### Bài tập 3: Viết điều kiện `LIKE` kết hợp `ESCAPE` và `BETWEEN`
**Đề bài:** Hãy viết một câu truy vấn duy nhất trên bảng `PROMOTIONS` (`promo_id`, `promo_code`, `discount_rate`, `start_date`) để tìm tất cả các chương trình khuyến mãi thỏa mãn đồng thời 3 điều kiện sau:
1. Mã khuyến mãi (`promo_code`) bắt đầu bằng đúng 1 ký tự bất kỳ, theo sau là chuỗi `'20%_'` (trong đó cả dấu `%` và dấu `_` đều là ký tự thực tế nằm trong mã khuyến mãi!), rồi theo sau là các ký tự bất kỳ.
2. Mức giảm giá (`discount_rate`) nằm trong đoạn từ `10` đến `30` (bao gồm cả `10` và `30`).
3. Cột `start_date` không bị để trống (`NULL`).

<details>
<summary><b>👉 Xem Lời Giải Chi Tiết Bài Tập 3</b></summary>

```sql
SELECT promo_id, promo_code, discount_rate, start_date
FROM promotions
WHERE promo_code LIKE '_20\%\_%' ESCAPE '\'
  AND discount_rate BETWEEN 10 AND 30
  AND start_date IS NOT NULL;
```
* **Giải thích chi tiết mẫu `'_20\%\_%' ESCAPE '\'`:**
  * Dấu `_` đầu tiên không có `\` đứng trước $\rightarrow$ Là ký tự đại diện cho **đúng 1 ký tự bất kỳ** ở vị trí đầu.
  * `'20'` $\rightarrow$ Khớp chính xác chuỗi `'20'`.
  * `'\%'` $\rightarrow$ Nhờ `ESCAPE '\'`, dấu `%` ở đây được hiểu là **ký tự phần trăm `%` thực sự**.
  * `'\_'` $\rightarrow$ Nhờ `ESCAPE '\'`, dấu `_` ở đây được hiểu là **ký tự gạch dưới `_` thực sự**.
  * Dấu `%` cuối cùng không có `\` đứng trước $\rightarrow$ Đại diện cho **0 hoặc nhiều ký tự bất kỳ** ở phần đuôi.
</details>

---

## 8. Tổng Hợp Bẫy Thi OCA/OCP Cốt Lõi Cần Nhớ (Exam Essentials)

| # | Chủ đề | Quy tắc chuẩn & Bẫy thường gặp trong đề thi 1Z0-071 |
| :---: | :--- | :--- |
| **1** | **`WHERE col = NULL` / `<> NULL`** | **Không báo lỗi cú pháp**, nhưng luôn đánh giá ra `UNKNOWN` và trả về **0 dòng**. Phải dùng `IS NULL` / `IS NOT NULL`. |
| **2** | **`TRUE OR UNKNOWN`** | Luôn trả về **`TRUE`** (vì phép `OR` chỉ cần 1 vế `TRUE` là đủ). |
| **3** | **`FALSE AND UNKNOWN`** | Luôn trả về **`FALSE`** (vì phép `AND` chỉ cần 1 vế `FALSE` là sai). |
| **4** | **`TRUE AND UNKNOWN` / `FALSE OR UNKNOWN`** | Đều trả về **`UNKNOWN`** (và trong mệnh đề `WHERE`, dòng có kết quả `UNKNOWN` sẽ bị **loại bỏ**). |
| **5** | **`NOT (UNKNOWN)`** | Vẫn trả về **`UNKNOWN`** (không bao giờ biến thành `TRUE`!). |
| **6** | **`IN (10, 20, NULL)`** | Khai triển bằng `OR`, nên **vẫn trả về bình thường** các dòng có giá trị `10` hoặc `20`. |
| **7** | **`NOT IN (10, 20, NULL)`** | Khai triển bằng `AND`, nên dính `<> NULL` (`UNKNOWN`) $\rightarrow$ **LUÔN LUÔN TRẢ VỀ 0 DÒNG!** |
| **8** | **`BETWEEN 100 AND 50` (Ngược cận)** | Cận lớn viết trước cận nhỏ **không báo lỗi**, nhưng luôn trả về **0 dòng**. `BETWEEN 50 AND 100` lấy cả 2 đầu mút `50` và `100`. |
| **9** | **`LIKE` và `ESCAPE`** | `%` khớp $\ge 0$ ký tự, `_` khớp đúng 1 ký tự. Không có ký tự `ESCAPE` mặc định; ký tự trong `ESCAPE 'c'` phải dài đúng 1 ký tự. |
| **10** | **Thứ tự ưu tiên Logic** | `(...)` $\rightarrow$ Toán tử số học $\rightarrow$ Toán tử so sánh $\rightarrow$ **`NOT`** $\rightarrow$ **`AND`** $\rightarrow$ **`OR`**. (`AND` luôn chạy trước `OR`!). |
