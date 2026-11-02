# Chương 3: Truy Vấn và Sắp Xếp Dữ Liệu Với SELECT - Oracle SQL OCA/OCP (1Z0-071)

> **Tài liệu tham chiếu:** *OCA/OCP Oracle Database SQL Certified Associate Study Guide (Exam 1Z0-071)* & *Oracle Database SQL Language Reference*.  
> **Mục tiêu khảo thí:** Cấu trúc `SELECT`, `FROM`, `WHERE`; Loại bỏ trùng lặp với `DISTINCT` / `UNIQUE`; Bí danh cột (Column Alias) & Bí danh bảng (Table Alias); Biểu thức số học, toán tử nối chuỗi `||` và toán tử trích dẫn thay thế `q'[...]'`; Sắp xếp dữ liệu với `ORDER BY`, `ASC`, `DESC`, `NULLS FIRST`, `NULLS LAST`; Phân trang dữ liệu hiện đại với `OFFSET ... FETCH` (`ONLY` vs `WITH TIES`) và so sánh với giả cột `ROWNUM`; Thứ tự xử lý logic của câu lệnh SQL.

---

## 📑 Mục Lục Chi Tiết

1. [Cấu Trúc Nền Tảng: `SELECT`, `FROM`, `WHERE`](#1-cấu-trúc-nền-tảng-select-from-where)
2. [Loại Bỏ Dòng Trùng Lặp Với `DISTINCT` và `UNIQUE`](#2-loại-bỏ-dòng-trùng-lặp-với-distinct-và-unique)
3. [Bí Danh Cột (Column Alias) và Bí Danh Bảng (Table Alias)](#3-bí-danh-cột-column-alias-và-bí-danh-bảng-table-alias)
4. [Toán Tử Số Học, Nối Chuỗi `||` và Toán Tử Trích Dẫn `q'[...]'`](#4-toán-tử-số-học-nối-chuỗi--và-toán-tử-trích-dẫn-q)
5. [Sắp Xếp Dữ Liệu: `ORDER BY`, `ASC`/`DESC`, `NULLS FIRST`/`NULLS LAST`](#5-sắp-xếp-dữ-liệu-order-by-ascdesc-nulls-firstnulls-last)
6. [Giới Hạn Dòng Trả Về: `OFFSET ... FETCH` vs Giả Cột `ROWNUM`](#6-giới-hạn-dòng-trả-về-offset--fetch-vs-giả-cột-rownum)
7. [Thứ Tự Xử Lý Logic Của Câu Lệnh SQL (Logical Query Processing Order)](#7-thứ-tự-xử-lý-logic-của-câu-lệnh-sql-logical-query-processing-order)
8. [Bài Tập Thực Hành Tự Luyện (Hands-on Labs)](#8-bài-tập-thực-hành-tự-luyện-hands-on-labs)
9. [Tổng Hợp Bẫy Thi OCA/OCP Cốt Lõi Cần Nhớ (Exam Essentials)](#9-tổng-hợp-bẫy-thi-ocaocp-cốt-lõi-cần-nhớ-exam-essentials)

---

## 1. Cấu Trúc Nền Tảng: `SELECT`, `FROM`, `WHERE`

Câu lệnh `SELECT` dùng để truy xuất dữ liệu từ một hoặc nhiều bảng/view trong cơ sở dữ liệu:
* **`SELECT` (Phép chiếu - Projection):** Xác định những cột hoặc biểu thức nào sẽ xuất hiện trong tập kết quả.
  * Sử dụng dấu sao `*` để lấy tất cả các cột theo đúng thứ tự định nghĩa trong bảng: `SELECT * FROM employees;`.
  * Có thể kết hợp `table_alias.*` với các cột hoặc biểu thức tính toán bổ sung:
    ```sql
    -- ✅ HỢP LỆ khi có tiền tố tên bảng/bí danh bảng trước dấu *:
    SELECT e.*, e.salary * 12 AS annual_sal
    FROM employees e;
    ```
    *(⚠️ **Bẫy thi:** Nếu viết `SELECT *, salary * 12 FROM employees;` mà **không có tiền tố bảng** trước dấu `*` khi đi kèm cột khác, Oracle (trước 23ai) sẽ báo lỗi `ORA-00923: FROM keyword not found where expected`!)*
* **`FROM`:** Chỉ định bảng, view hoặc subquery cung cấp dữ liệu nguồn.
* **`WHERE` (Phép chọn - Selection):** Lọc các dòng dữ liệu thỏa mãn điều kiện logic (chỉ những dòng làm cho điều kiện `WHERE` đánh giá ra **`TRUE`** mới được giữ lại; các dòng ra `FALSE` hoặc `UNKNOWN` đều bị loại bỏ).

---

## 2. Loại Bỏ Dòng Trùng Lặp Với `DISTINCT` và `UNIQUE`

Mặc định, câu lệnh `SELECT` sử dụng tùy chọn ngầm định là **`ALL`** (giữ lại tất cả các dòng, kể cả các dòng trùng lặp hoàn toàn). Để loại bỏ các dòng trùng lặp trong tập kết quả, Oracle cung cấp hai từ khóa hoàn toàn tương đương nhau:
* **`DISTINCT`** (Chuẩn ANSI SQL — khuyên dùng)
* **`UNIQUE`** (Từ khóa đặc trưng của Oracle — hoạt động giống hệt `DISTINCT` 100%)

### 2.1. 4 Quy tắc sống còn của `DISTINCT` / `UNIQUE` trong đề thi
1. **Vị trí đặt từ khóa:** `DISTINCT` (hoặc `UNIQUE`) **bắt buộc phải đứng ngay sau từ khóa `SELECT`** và đứng trước danh sách tất cả các cột.
   * ✅ Đúng: `SELECT DISTINCT department_id, job_id FROM employees;`
   * ❌ Sai: `SELECT department_id, DISTINCT job_id FROM employees;` $\rightarrow$ Báo lỗi `ORA-00936: missing expression`!
2. **Phạm vi tác dụng:** `DISTINCT` chỉ được viết **tối đa 1 lần** trong một mệnh đề `SELECT` và luôn áp dụng lên **TỔ HỢP TẤT CẢ CÁC CỘT** được liệt kê trong mệnh đề `SELECT` đó (chứ không phải chỉ áp dụng cho cột đầu tiên!).
3. **Cách `DISTINCT` xử lý giá trị `NULL`:**
   * Mặc dù trong phép so sánh điều kiện `WHERE`, `NULL = NULL` là `UNKNOWN`, nhưng trong `DISTINCT` (và `GROUP BY`), Oracle **coi các giá trị `NULL` là trùng nhau (duplicates)**!
   * Do đó, nếu cột `department_id` có 5 dòng mang giá trị `NULL`, thì `SELECT DISTINCT department_id FROM employees;` chỉ trả về **duy nhất 1 dòng `NULL`**.

**Ví dụ minh họa `DISTINCT` trên nhiều cột:**
Cho bảng mẫu `EMP_JOBS` gồm 5 dòng:

| DEPT_ID | JOB_ID |
| :---: | :--- |
| 10 | AD_ASST |
| 20 | MK_MAN |
| 20 | MK_REP |
| 20 | MK_REP |
| *(null)* | SA_REP |
| *(null)* | SA_REP |

```sql
SELECT DISTINCT dept_id, job_id
FROM emp_jobs;
```

**Kết quả đầu ra (4 dòng):**
| DEPT_ID | JOB_ID |
| :---: | :--- |
| 10 | AD_ASST |
| 20 | MK_MAN |
| 20 | MK_REP |
| *(null)* | SA_REP |

---

## 3. Bí Danh Cột (Column Alias) và Bí Danh Bảng (Table Alias)

### 3.1. Bí danh cột (Column Alias)
Dùng để đổi tên tiêu đề cột hiển thị trong kết quả đầu ra (rất hữu ích cho các cột tính toán biểu thức).
* **Cú pháp:** `column_or_expression [AS] alias_name` (Từ khóa `AS` là **tùy chọn**).
* Mặc định, nếu không đặt trong dấu nháy kép `"..."`, tiêu đề cột hiển thị ra màn hình sẽ luôn được chuyển thành **CHỮ IN HOA (UPPERCASE)**.
* **Khi nào BẮT BUỘC phải đặt Column Alias trong dấu nháy kép `"..."`?**
  1. Khi bí danh có chứa **khoảng trắng** (ví dụ: `"Annual Salary"`).
  2. Khi muốn **giữ nguyên chữ hoa/thường** (ví dụ: `"EmpName"`).
  3. Khi bí danh chứa **ký tự đặc biệt** ngoài `_`, `$`, `#` (như dấu `-`, `%`, `@`) hoặc bắt đầu bằng chữ số (`"2026_Target"`).
  4. Khi bí danh trùng với **từ khóa dành riêng của SQL** (như `"FROM"`, `"SELECT"`, `"DATE"`).

```sql
SELECT last_name AS name,                  -- Hiển thị tiêu đề: NAME
       salary * 12 annual_sal,             -- Hiển thị tiêu đề: ANNUAL_SAL (không cần AS)
       salary * 12 AS "Annual Salary ($)"  -- Hiển thị đúng: Annual Salary ($)
FROM employees;
```

### 3.2. Bí danh bảng (Table Alias) và Bẫy Từ Khóa `AS`!
Dùng để đặt tên viết tắt cho bảng trong mệnh đề `FROM` nhằm giúp câu truy vấn ngắn gọn và phân biệt các cột trùng tên khi `JOIN` nhiều bảng.

> [!CAUTION]
> **BẪY THI SỐ 1 VỀ TABLE ALIAS TRONG ORACLE:**
> * Đối với **Column Alias** (ở mệnh đề `SELECT`): Bạn **CÓ THỂ** dùng hoặc bỏ từ khóa `AS` (`SELECT salary AS sal` hoặc `SELECT salary sal`).
> * Đối với **Table Alias** (ở mệnh đề `FROM`): Trong Oracle SQL (chuẩn thi 1Z0-071), bạn **TUYỆT ĐỐI KHÔNG ĐƯỢC DÙNG TỪ KHÓA `AS`**!
>   * ✅ **Đúng:** `SELECT e.last_name FROM employees e;`
>   * ❌ **Sai:** `SELECT e.last_name FROM employees AS e;` $\rightarrow$ Báo lỗi **`ORA-00933: SQL command not properly ended`**!
> *(Đây là lỗi mà hầu hết lập trình viên quen dùng PostgreSQL, MySQL, SQL Server đều mắc phải khi thi Oracle!)*

**Quy tắc thứ hai của Table Alias:**
Một khi bạn đã khai báo Table Alias cho một bảng trong mệnh đề `FROM` (ví dụ `FROM employees e`), nếu muốn dùng tiền tố bảng ở `SELECT`, `WHERE`, `ORDER BY`, bạn **BẮT BUỘC phải dùng Table Alias (`e.salary`)**, **không được phép** dùng lại tên bảng gốc (`employees.salary`) trong câu truy vấn đó nữa (nếu dùng lại tên bảng gốc sẽ báo lỗi `ORA-00904: "EMPLOYEES"."SALARY": invalid identifier`)!

---

## 4. Toán Tử Số Học, Nối Chuỗi `||` và Toán Tử Trích Dẫn `q'[...]'`

### 4.1. Toán tử số học và Thứ tự ưu tiên
Oracle hỗ trợ 4 toán tử số học cơ bản: `+` (cộng), `-` (trừ), `*` (nhân), `/` (chia) —*(Lưu ý: Trong Oracle SQL, dấu `%` KHÔNG PHẢI là phép chia lấy dư! Muốn chia lấy dư trong Oracle phải dùng hàm **`MOD(m, n)`**)*.
* **Thứ tự ưu tiên:** Nhân `*` và Chia `/` có độ ưu tiên cao hơn Cộng `+` và Trừ `-`. Các toán tử cùng mức ưu tiên được tính từ **trái sang phải**. Dấu ngoặc đơn `(...)` có độ ưu tiên cao nhất dùng để thay đổi thứ tự tính toán.

### 4.2. Toán tử nối chuỗi `||` và cách xử lý dấu nháy đơn `'` bên trong chuỗi
Để ghép nối nhiều cột hoặc hằng chuỗi thành một chuỗi duy nhất, ta dùng toán tử `||` (hoặc hàm `CONCAT(s1, s2)` — lưu ý hàm `CONCAT` của Oracle chỉ nhận đúng **2 tham số**, trong khi toán tử `||` có thể nối vô hạn chuỗi!).

Khi bên trong chuỗi ký tự cần hiển thị có chứa dấu nháy đơn `'` (ví dụ: `Department's Manager`), ta có **2 cách xử lý**:
1. **Cách truyền thống (Nhân đôi dấu nháy đơn `''`):** Viết 2 dấu nháy đơn liên tiếp bên trong chuỗi để biểu diễn 1 dấu nháy đơn:
   ```sql
   SELECT last_name || '''s job is ' || job_id AS emp_detail
   FROM employees;
   ```
2. **Cách hiện đại & an toàn: Toán tử trích dẫn thay thế `q'[...]'` (Alternative Quote Operator):**
   * Cú pháp: `q'` + `ký_tự_mở` + `nội dung chuỗi (thoải mái chứa dấu ')` + `ký_tự_đóng` + `'` (có thể dùng `q` thường hoặc `Q` hoa).
   * **Quy tắc chọn ký tự phân cách (Delimiter) của `q'...'`:**
     * Nếu ký tự mở là một trong **4 dấu ngoặc có cặp**: `[`, `{`, `<`, `(` $\rightarrow$ Ký tự đóng **bắt buộc phải là dấu ngoặc đóng tương ứng**: `]`, `}`, `>`, `)`!
     * Nếu ký tự mở là bất kỳ ký tự đơn nào khác (như `!`, `#`, `~`, `@`, `A`) $\rightarrow$ Ký tự đóng phải là **chính ký tự đó**!

```sql
-- Tất cả 4 cách dùng q'...' dưới đây đều HỢP LỆ và cho cùng một kết quả:
SELECT q'[Department's Manager]' AS way1,
       q'{Department's Manager}' AS way2,
       q'<Department's Manager>' AS way3,
       q'!Department's Manager!' AS way4
FROM dual;
```

**Kết quả đầu ra:**
| WAY1 | WAY2 | WAY3 | WAY4 |
| :--- | :--- | :--- | :--- |
| `Department's Manager` | `Department's Manager` | `Department's Manager` | `Department's Manager` |

> [!WARNING]
> **Bẫy thi với `q'[...]'`:** Nếu bạn chọn dấu ngoặc mở là `[` nhưng lại đóng bằng `[` (ví dụ `q'[Hello['`), câu lệnh sẽ **BÁO LỖI** `ORA-01756: quoted string not properly terminated` vì với dấu ngoặc `[`, `{`, `<`, `(`, ký tự đóng bắt buộc phải là dấu ngoặc đối xứng `]`, `}`, `>`, `)`!

---

## 5. Sắp Xếp Dữ Liệu: `ORDER BY`, `ASC`/`DESC`, `NULLS FIRST`/`NULLS LAST`

Mệnh đề `ORDER BY` luôn nằm ở cuối câu lệnh `SELECT` (chỉ đứng trước mệnh đề `OFFSET / FETCH`), dùng để sắp xếp các dòng kết quả:
* **`ASC` (Ascending - Mặc định):** Sắp xếp tăng dần (Số: nhỏ $\rightarrow$ lớn; Ngày: cũ $\rightarrow$ mới; Chuỗi: A $\rightarrow$ Z theo mã ASCII/binary).
* **`DESC` (Descending):** Sắp xếp giảm dần.

### 5.1. 3 Cách chỉ định cột cần sắp xếp trong `ORDER BY`
1. **Theo tên cột hoặc biểu thức** (kể cả cột **KHÔNG** nằm trong mệnh đề `SELECT`, miễn câu truy vấn không dùng `DISTINCT` hay toán tử tập hợp `UNION`).
2. **Theo Bí danh cột (Column Alias)** đã định nghĩa ở mệnh đề `SELECT`.
3. **Theo Số thứ tự vị trí cột (Column Position)** trong mệnh đề `SELECT` (bắt đầu từ `1`, `2`, `3`...).
   * ⚠️ *Bẫy thi:* Nếu `SELECT` chỉ có 3 cột mà bạn viết `ORDER BY 4`, Oracle sẽ báo lỗi `ORA-01785: ORDER BY item must be the number of a SELECT-list expression`!

### 5.2. Quy tắc vàng về thứ tự của `NULL` trong Oracle `ORDER BY`
> [!IMPORTANT]
> **QUY TẮC BẮT BUỘC THUỘC LÒNG KHI THI 1Z0-071:**
> Trong Oracle Database, khi sắp xếp dữ liệu, **giá trị `NULL` được coi là LỚN NHẤT (hơn mọi giá trị số, chữ, ngày tháng)**!
> Do đó:
> * Khi sắp xếp tăng dần **`ASC` (mặc định)**: `NULL` sẽ nằm ở **CUỐI CÙNG (`NULLS LAST`)**!
> * Khi sắp xếp giảm dần **`DESC`**: Vì `NULL` là lớn nhất nên `NULL` sẽ nhảy lên nằm ở **ĐẦU TIÊN (`NULLS FIRST`)**!
> * Để ghi đè hành vi mặc định này, bạn sử dụng từ khóa **`NULLS FIRST`** hoặc **`NULLS LAST`** ngay sau `ASC` / `DESC` của từng cột.

**Ví dụ minh họa `ORDER BY` với `NULL`:**
Cho bảng `SALES_REPS` có 4 dòng:

| EMP_ID | LAST_NAME | COMMISSION_PCT |
| :---: | :--- | :---: |
| 101 | Kochhar | *(null)* |
| 145 | Russell | 0.4 |
| 149 | Zlotkey | 0.2 |
| 178 | Grant | 0.15 |

```sql
-- Sắp xếp giảm dần theo hoa hồng (DESC), nhưng ép các dòng NULL xuống dưới cùng:
SELECT emp_id, last_name, commission_pct
FROM sales_reps
ORDER BY commission_pct DESC NULLS LAST;
```

**Kết quả đầu ra:**
| EMP_ID | LAST_NAME | COMMISSION_PCT |
| :---: | :--- | :---: |
| 145 | Russell | 0.4 |
| 149 | Zlotkey | 0.2 |
| 178 | Grant | 0.15 |
| 101 | Kochhar | *(null)* |
*(Nếu không viết `NULLS LAST`, dòng `101 - Kochhar (null)` sẽ nằm ở dòng đầu tiên khi `ORDER BY commission_pct DESC`!)*

---

## 6. Giới Hạn Dòng Trả Về: `OFFSET ... FETCH` vs Giả Cột `ROWNUM`

### 6.1. Mệnh đề chuẩn ANSI (Oracle 12c+): `OFFSET ... FETCH` (Row Limiting Clause)
Từ Oracle 12c trở đi, bạn có thể phân trang và lấy Top-N dòng cực kỳ trực quan ngay sau mệnh đề `ORDER BY`:

**Cú pháp chuẩn:**
```sql
[OFFSET offset { ROW | ROWS }]
[FETCH { FIRST | NEXT } [ { rowcount | percent PERCENT } ] { ROW | ROWS } { ONLY | WITH TIES }]
```

**Các quy tắc cú pháp quan trọng:**
1. Từ khóa **`ROW`** và **`ROWS`** hoàn toàn tương đương và có thể thay thế cho nhau (dù lấy 1 dòng hay 10 dòng).
2. Từ khóa **`FIRST`** và **`NEXT`** hoàn toàn tương đương và có thể thay thế cho nhau.
3. **`ONLY` vs `WITH TIES`:**
   * **`ONLY`:** Trả về **đúng chính xác** số lượng dòng được yêu cầu (`rowcount`).
   * **`WITH TIES`:** Nếu ở vị trí dòng cuối cùng được lấy có các dòng tiếp theo **bằng điểm nhau (cùng giá trị trên cột `ORDER BY`)**, Oracle sẽ **lấy thêm tất cả các dòng đồng hạng đó** (nên tổng số dòng trả về có thể nhiều hơn `rowcount`)!
4. Nếu truyền `offset` là số âm $\rightarrow$ Oracle tự động coi `offset = 0`. Nếu `offset` hoặc `rowcount` là `NULL` $\rightarrow$ câu truy vấn trả về **0 dòng**.

**Ví dụ minh họa sự khác biệt giữa `ONLY` và `WITH TIES`:**
Cho bảng `EMP_SCORES` đã sắp xếp giảm dần theo `SALARY`:

| EMP_ID | LAST_NAME | SALARY |
| :---: | :--- | :---: |
| 100 | King | 24000 |
| 101 | Kochhar | 17000 |
| 102 | De Haan | 17000 |
| 103 | Hunold | 9000 |

```sql
-- Truy vấn 1: Dùng ONLY (Lấy đúng 2 dòng đầu)
SELECT emp_id, last_name, salary FROM emp_scores
ORDER BY salary DESC
FETCH FIRST 2 ROWS ONLY;

-- Truy vấn 2: Dùng WITH TIES (Lấy 2 dòng đầu + các dòng đồng hạng với dòng thứ 2)
SELECT emp_id, last_name, salary FROM emp_scores
ORDER BY salary DESC
FETCH FIRST 2 ROWS WITH TIES;
```
* **Kết quả Truy vấn 1 (`ONLY`):** Trả về đúng **2 dòng** (`100 - King - 24000` và 1 trong 2 người có lương `17000`).
* **Kết quả Truy vấn 2 (`WITH TIES`):** Trả về cả **3 dòng** (`100 - King - 24000`, `101 - Kochhar - 17000`, và `102 - De Haan - 17000`) vì dòng thứ 3 có cùng mức lương `17000` với dòng thứ 2!

### 6.2. So sánh với Giả cột truyền thống `ROWNUM` và 2 Bẫy Kinh Điển!
Trước Oracle 12c, lập trình viên thường dùng giả cột **`ROWNUM`** để giới hạn số dòng. `ROWNUM` hoạt động theo cơ chế đánh số tuần tự `1, 2, 3...` ngay khi dòng dữ liệu đi qua bước lọc `WHERE`:

> [!CAUTION]
> **2 BẪY KINH ĐIỂN CỦA `ROWNUM` TRONG ĐỀ THI 1Z0-071 & VNPT:**
>
> **Bẫy 1: Điều kiện `WHERE ROWNUM = 2` hoặc `WHERE ROWNUM > 1` LUÔN TRẢ VỀ 0 DÒNG!**
> * Tại sao? Khi dòng đầu tiên được đọc từ bảng lên, Oracle tạm gán `ROWNUM = 1` rồi kiểm tra điều kiện `WHERE ROWNUM > 1` $\rightarrow$ Kết quả là `FALSE` nên dòng này bị loại bỏ! Khi dòng thứ hai được đọc lên, vì dòng thứ nhất chưa được nhận nên dòng thứ hai **lại bị gán `ROWNUM = 1`** $\rightarrow$ Lại bị loại bỏ! Cứ thế không có dòng nào vượt qua được mốc `1`, kết quả trả về **0 dòng**!
> * `ROWNUM` trong cùng cấp `WHERE` chỉ hoạt động đúng với điều kiện `<`, `<=`, hoặc `= 1` (ví dụ `WHERE ROWNUM <= 5`).
>
> **Bẫy 2: `ROWNUM` được đánh số TRƯỚC khi thực hiện `ORDER BY`!**
> * Nếu bạn viết:
>   ```sql
>   -- ❌ SAI LOGIC: Lấy 5 dòng bất kỳ trước rồi mới sắp xếp 5 dòng đó!
>   SELECT last_name, salary FROM employees
>   WHERE ROWNUM <= 5
>   ORDER BY salary DESC;
>   ```
>   Câu lệnh trên **KHÔNG** lấy 5 người lương cao nhất công ty, mà chỉ bốc đại 5 dòng đầu tiên đọc được từ đĩa rồi sắp xếp 5 người đó với nhau! Muốn dùng `ROWNUM` lấy Top-5 đúng chuẩn, bắt buộc phải dùng **Subquery** sắp xếp trước, hoặc chuyển sang dùng **`ORDER BY salary DESC FETCH FIRST 5 ROWS ONLY`**.

---

## 7. Thứ Tự Xử Lý Logic Của Câu Lệnh SQL (Logical Query Processing Order)

Khi bạn viết một câu lệnh SQL, thứ tự các từ khóa bạn **gõ (Lexical Order)** khác hoàn toàn với thứ tự mà bộ máy SQL thực sự **xử lý về mặt logic (Logical Execution Order)**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                THỨ TỰ XỬ LÝ LOGIC CỦA CÂU LỆNH SQL                      │
├─────────────────────────────────────────────────────────────────────────┤
│  Bước 1: FROM / JOIN   ──► Xác định bảng nguồn và ghép nối dữ liệu      │
│  Bước 2: WHERE         ──► Lọc từng dòng (CHƯA biết Column Alias!)      │
│  Bước 3: GROUP BY      ──► Gom nhóm dữ liệu (CHƯA biết Column Alias!)   │
│  Bước 4: HAVING        ──► Lọc nhóm sau gom (CHƯA biết Column Alias!)   │
│  Bước 5: SELECT        ──► Tính biểu thức, DISTINCT & GÁN COLUMN ALIAS  │
│  Bước 6: ORDER BY      ──► Sắp xếp kết quả (ĐÃ DÙNG ĐƯỢC Column Alias!) │
│  Bước 7: OFFSET / FETCH──► Bỏ qua và cắt số lượng dòng trả về cuối cùng │
└─────────────────────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Hệ quả cực kỳ quan trọng từ Thứ tự xử lý logic:**
> Vì mệnh đề **`SELECT` (Bước 5)** được thực thi **SAU** các mệnh đề `FROM` (Bước 1), `WHERE` (Bước 2), `GROUP BY` (Bước 3) và `HAVING` (Bước 4):
> * Bạn **KHÔNG BAO GIỜ** được sử dụng **Column Alias (Bí danh cột)** bên trong mệnh đề **`WHERE`**, **`GROUP BY`**, hay **`HAVING`**! Nếu cố dùng sẽ bị báo lỗi `ORA-00904: invalid identifier`.
> * Ngược lại, vì **`ORDER BY` (Bước 6)** chạy **SAU** `SELECT` (Bước 5), nên bạn **HOÀN TOÀN ĐƯỢC PHÉP** sử dụng Column Alias trong mệnh đề **`ORDER BY`**!

```sql
-- ❌ LỖI ORA-00904: Không được dùng Column Alias 'annual_sal' trong WHERE!
SELECT last_name, salary * 12 AS annual_sal
FROM employees
WHERE annual_sal > 100000;

-- ✅ ĐÚNG CHUẨN: Dùng biểu thức gốc trong WHERE, và dùng Column Alias trong ORDER BY:
SELECT last_name, salary * 12 AS annual_sal
FROM employees
WHERE salary * 12 > 100000
ORDER BY annual_sal DESC;
```

---

## 8. Bài Tập Thực Hành Tự Luyện (Hands-on Labs)

### Bài tập 1: Phát hiện và sửa lỗi cú pháp Alias, `DISTINCT` và `q'[...]'`
**Đề bài:** Câu truy vấn dưới đây có **4 lỗi cú pháp**. Hãy tìm ra cả 4 lỗi đó và viết lại câu truy vấn đúng:
```sql
SELECT department_id, DISTINCT job_id,
       q'[Role's Title[' AS role_desc,
       salary * 12 AS annual_sal
FROM employees AS e
WHERE annual_sal > 60000
ORDER BY annual_sal DESC;
```

<details>
<summary><b>👉 Xem Lời Giải Chi Tiết Bài Tập 1</b></summary>

* **4 lỗi cú pháp trong câu lệnh trên:**
  1. **Lỗi 1 (`DISTINCT` đặt sai vị trí):** Từ khóa `DISTINCT` phải đứng ngay sau `SELECT`, không được đặt ở cột thứ hai (`SELECT department_id, DISTINCT job_id`).
  2. **Lỗi 2 (Sai ký tự đóng của `q'[...]'`):** Khi mở bằng dấu ngoặc vuông `[`, ký tự đóng bắt buộc phải là dấu ngoặc vuông đóng `]`, không được dùng `[` (`q'[Role's Title]'`).
  3. **Lỗi 3 (Dùng `AS` cho Table Alias):** Trong Oracle SQL, không được dùng từ khóa `AS` khi đặt bí danh cho bảng ở mệnh đề `FROM` (`FROM employees e`, không viết `FROM employees AS e`).
  4. **Lỗi 4 (Dùng Column Alias trong `WHERE`):** Mệnh đề `WHERE` chạy trước `SELECT` nên chưa biết `annual_sal` là gì. Phải viết `WHERE e.salary * 12 > 60000`.

* **Câu lệnh đã sửa hoàn chỉnh:**
```sql
SELECT DISTINCT e.department_id, e.job_id,
       q'[Role's Title]' AS role_desc,
       e.salary * 12 AS annual_sal
FROM employees e
WHERE e.salary * 12 > 60000
ORDER BY annual_sal DESC;
```
</details>

---

### Bài tập 2: Dự đoán thứ tự sắp xếp với `NULL` và kết quả phân trang `WITH TIES`
**Đề bài:** Cho bảng `PRODUCTS` có đúng 6 dòng dữ liệu như sau:

| PROD_ID | PROD_NAME | DISCOUNT |
| :---: | :--- | :---: |
| 1 | Router | 10 |
| 2 | Switch | *(null)* |
| 3 | Firewall | 25 |
| 4 | Server | 20 |
| 5 | Storage | 20 |
| 6 | Cable | 5 |

Hãy xác định chính xác các dòng (theo đúng thứ tự từ trên xuống dưới) được trả về bởi câu truy vấn sau:
```sql
SELECT prod_id, prod_name, discount
FROM products
ORDER BY discount DESC
OFFSET 1 ROW FETCH NEXT 2 ROWS WITH TIES;
```

<details>
<summary><b>👉 Xem Lời Giải Chi Tiết Bài Tập 2</b></summary>

* **Bước 1: Xác định thứ tự của 6 dòng sau khi `ORDER BY discount DESC`:**
  Vì trong Oracle giá trị `NULL` là **lớn nhất**, nên khi sắp xếp giảm dần (`DESC`) mà không chỉ định `NULLS LAST`, dòng có `discount IS NULL` sẽ đứng ở **vị trí đầu tiên (dòng số 1)**:
  1. `2 | Switch   | (null)`  $\leftarrow$ *(Bị bỏ qua bởi `OFFSET 1 ROW`!)*
  2. `3 | Firewall | 25`      $\leftarrow$ *(Được lấy: dòng thứ 1 của FETCH)*
  3. `4 | Server   | 20`      $\leftarrow$ *(Được lấy: dòng thứ 2 của FETCH)*
  4. `5 | Storage  | 20`      $\leftarrow$ *(Được lấy thêm nhờ `WITH TIES` vì có cùng `discount = 20` với dòng số 3!)*
  5. `1 | Router   | 10`
  6. `6 | Cable    | 5`

* **Kết quả cuối cùng trả về (3 dòng):**
| PROD_ID | PROD_NAME | DISCOUNT |
| :---: | :--- | :---: |
| 3 | Firewall | 25 |
| 4 | Server | 20 |
| 5 | Storage | 20 |
</details>

---

### Bài tập 3: Khắc phục bẫy `ROWNUM` khi phân trang / lấy Top-N
**Đề bài:** Một lập trình viên muốn lấy danh sách 3 nhân viên có mức lương cao thứ 4, thứ 5 và thứ 6 trong bảng `EMPLOYEES`. Lập trình viên đó viết câu truy vấn sau nhưng kết quả luôn trả về **0 dòng**:
```sql
SELECT employee_id, last_name, salary
FROM employees
WHERE ROWNUM BETWEEN 4 AND 6
ORDER BY salary DESC;
```
Hãy giải thích 2 nguyên nhân tại sao câu lệnh trên hoàn toàn sai và viết lại bằng cú pháp `OFFSET ... FETCH` chuẩn hiện đại.

<details>
<summary><b>👉 Xem Lời Giải Chi Tiết Bài Tập 3</b></summary>

* **2 nguyên nhân khiến câu lệnh trên sai:**
  1. **Điều kiện `WHERE ROWNUM BETWEEN 4 AND 6` luôn trả về 0 dòng:** Vì `ROWNUM` chỉ bắt đầu đếm từ `1` cho dòng đầu tiên thỏa mãn `WHERE`. Khi dòng đầu tiên có `ROWNUM = 1` không thỏa mãn `BETWEEN 4 AND 6`, nó bị loại bỏ ngay, dẫn đến không bao giờ có dòng nào đạt tới `ROWNUM = 4`.
  2. **`ROWNUM` được gán TRƯỚC khi `ORDER BY`:** Kể cả khi sửa thành `ROWNUM <= 6`, Oracle cũng sẽ lấy 6 dòng ngẫu nhiên trước rồi mới sắp xếp `ORDER BY salary DESC`.

* **Câu lệnh viết lại chuẩn xác bằng `OFFSET ... FETCH`:**
```sql
SELECT employee_id, last_name, salary
FROM employees
ORDER BY salary DESC
OFFSET 3 ROWS FETCH NEXT 3 ROWS ONLY;
```
</details>

---

## 9. Tổng Hợp Bẫy Thi OCA/OCP Cốt Lõi Cần Nhớ (Exam Essentials)

| # | Chủ đề | Quy tắc chuẩn & Bẫy thường gặp trong đề thi 1Z0-071 |
| :---: | :--- | :--- |
| **1** | **Từ khóa `DISTINCT` / `UNIQUE`** | Chỉ viết 1 lần ngay sau `SELECT`, áp dụng lên **toàn bộ các cột** trong `SELECT`. Nhiều dòng `NULL` được gom lại thành **1 dòng `NULL`**. |
| **2** | **Table Alias & từ khóa `AS`** | Column Alias có thể dùng `AS`, nhưng **Table Alias TUYỆT ĐỐI KHÔNG được dùng `AS`** (`FROM emp AS e` $\rightarrow$ lỗi `ORA-00933`). |
| **3** | **Phạm vi dùng Column Alias** | **CHỈ** dùng được trong mệnh đề **`ORDER BY`**. Cấm dùng trong `WHERE`, `GROUP BY`, `HAVING` (vì chúng chạy trước `SELECT`). |
| **4** | **Đã đặt Table Alias** | Khi đã đặt `FROM employees e`, bắt buộc phải gọi `e.salary`, nếu gọi `employees.salary` sẽ báo lỗi `ORA-00904`. |
| **5** | **Toán tử `q'[...]'`** | Nếu mở bằng `[`, `{`, `<`, `(` thì bắt buộc đóng bằng dấu đối xứng `]`, `}`, `>`, `)`. Các ký tự khác thì mở gì đóng nấy (`q'!...!'`). |
| **6** | **Thứ tự của `NULL` trong `ORDER BY`** | Trong Oracle, **`NULL` là lớn nhất**: `ASC` $\rightarrow$ `NULL` ở cuối (`NULLS LAST`); `DESC` $\rightarrow$ `NULL` ở đầu (`NULLS FIRST`). |
| **7** | **`FETCH ... ONLY` vs `WITH TIES`** | `ONLY` lấy đúng số dòng yêu cầu; `WITH TIES` lấy thêm tất cả các dòng có giá trị `ORDER BY` bằng với dòng cuối cùng được lấy. |
| **8** | **Bẫy `ROWNUM`** | `WHERE ROWNUM = 2` hoặc `WHERE ROWNUM > 1` luôn trả về **0 dòng**. Ngoài ra `ROWNUM` được gán **trước** bước `ORDER BY`. |
| **9** | **Phép chia lấy dư trong Oracle** | Oracle **không dùng** toán tử `%` cho phép chia lấy dư, mà bắt buộc dùng hàm **`MOD(m, n)`**. |
| **10** | **Thứ tự xử lý logic SQL** | `FROM` $\rightarrow$ `WHERE` $\rightarrow$ `GROUP BY` $\rightarrow$ `HAVING` $\rightarrow$ `SELECT` $\rightarrow$ `ORDER BY` $\rightarrow$ `OFFSET / FETCH`. |
