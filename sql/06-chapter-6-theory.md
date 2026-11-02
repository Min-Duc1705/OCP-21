# Chương 6: Hàm Tổng Hợp và Nhóm Dữ Liệu (Aggregate Functions & GROUP BY)

> **Mục tiêu chương học (Exam Objectives — OCA 1Z0-071 & OCP Developer):**
> - Nắm vững cơ chế hoạt động và kiểu dữ liệu cho phép của các hàm tổng hợp (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `LISTAGG`).
> - Hiểu rõ quy tắc xử lý giá trị `NULL` và từ khóa `DISTINCT` / `ALL` bên trong hàm tổng hợp.
> - Phân biệt bản chất, ngữ nghĩa và hiệu năng giữa `COUNT(*)`, `COUNT(1)`, `COUNT(column)` và `COUNT(DISTINCT column)`.
> - Làm chủ mệnh đề `GROUP BY`, quy tắc cột xuất hiện trong `SELECT` (lỗi kinh điển `ORA-00979`), và cách `GROUP BY` gom nhóm giá trị `NULL`.
> - Phân biệt rạch ròi giữa mệnh đề lọc dòng `WHERE` và mệnh đề lọc nhóm `HAVING`.
> - Vận dụng quy tắc lồng hàm tổng hợp tối đa 2 cấp trong Oracle SQL (ví dụ: `MAX(AVG(salary))`).

---

## Mục Lục

1. [Tổng quan về Hàm Tổng Hợp (Aggregate / Group Functions)](#1-tổng-quan-về-hàm-tổng-hợp-aggregate--group-functions)
2. [Chi tiết các hàm tổng hợp thông dụng (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `LISTAGG`)](#2-chi-tiết-các-hàm-tổng-hợp-thông-dụng-count-sum-avg-min-max-listagg)
3. [Xử lý giá trị `NULL` và Phân biệt các biến thể của `COUNT`](#3-xử-lý-giá-trị-null-và-phân-biệt-các-biến-thể-của-count)
4. [Gom nhóm dữ liệu với mệnh đề `GROUP BY`](#4-gom-nhóm-dữ-liệu-với-mệnh-đề-group-by)
5. [Lọc dữ liệu sau gom nhóm với `HAVING` và So sánh `WHERE` vs `HAVING`](#5-lọc-dữ-liệu-sau-gom-nhóm-với-having-và-so-sánh-where-vs-having)
6. [Lồng hàm tổng hợp 2 cấp (Nesting Group Functions) trong Oracle](#6-lồng-hàm-tổng-hợp-2-cấp-nesting-group-functions-trong-oracle)
7. [Bài tập thực hành tự luyện (Kèm lời giải chi tiết)](#7-bài-tập-thực-hành-tự-luyện-kèm-lời-giải-chi-tiết)
8. [Tổng hợp Bẫy thi OCA/OCP (Exam Essentials)](#8-tổng-hợp-bẫy-thi-ocaocp-exam-essentials)

---

## 1. Tổng quan về Hàm Tổng Hợp (Aggregate / Group Functions)

Khác với **Single-Row Functions** (trả về 1 kết quả cho mỗi dòng), **Aggregate Functions** (còn gọi là **Multiple-Row Functions** hoặc **Group Functions**) thao tác trên một tập hợp các dòng (toàn bộ bảng hoặc từng nhóm dòng được chia bởi `GROUP BY`) và trả về **một kết quả tổng hợp duy nhất cho mỗi nhóm**.

### Các nguyên tắc nền tảng cần ghi nhớ:
1. **Vị trí được phép xuất hiện:** Hàm tổng hợp **CHỈ** được phép xuất hiện trong các mệnh đề:
   - `SELECT` list (Danh sách cột hiển thị)
   - `HAVING` clause (Điều kiện lọc nhóm)
   - `ORDER BY` clause (Sắp xếp kết quả cuối cùng)
   - **Tuyệt đối CẤM** đặt hàm tổng hợp trong mệnh đề `WHERE` hoặc `GROUP BY` (vi phạm sẽ gây lỗi **`ORA-00934: group function is not allowed here`**).
2. **Tùy chọn `DISTINCT` vs `ALL`:**
   - Hầu hết các hàm tổng hợp đều chấp nhận cú pháp: `FUNC([DISTINCT | ALL] expr)`.
   - `ALL` là mặc định: Tính toán trên tất cả các giá trị khác `NULL` (bao gồm cả các giá trị trùng lặp).
   - `DISTINCT`: Loại bỏ các giá trị trùng lặp (chỉ giữ lại các giá trị duy nhất khác `NULL`) trước khi thực hiện phép tính tổng hợp.
3. **Khi bảng không có dòng nào thỏa mãn điều kiện `WHERE` (Empty Set):**
   - Nếu câu truy vấn **không có `GROUP BY`**:
     - `COUNT(*)` và `COUNT(expr)` trả về **`0`**.
     - Tất cả các hàm tổng hợp còn lại (`SUM`, `AVG`, `MIN`, `MAX`, `LISTAGG`) đều trả về **`NULL`** (vẫn trả về đúng 1 dòng chứa giá trị `NULL`).
   - Nếu câu truy vấn **có `GROUP BY`** mà `WHERE` lọc hết sạch các dòng: Kết quả trả về **0 dòng (No rows selected)**!

---

## 2. Chi tiết các hàm tổng hợp thông dụng (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `LISTAGG`)

### 2.1. Bảng phân loại và Kiểu dữ liệu hỗ trợ

| Hàm | Cú pháp | Kiểu dữ liệu đầu vào hợp lệ | Ý nghĩa & Lưu ý đặc biệt |
| :--- | :--- | :--- | :--- |
| **`COUNT`** | `COUNT(* \| [DISTINCT \| ALL] expr)` | **Mọi kiểu dữ liệu** (`NUMBER`, `VARCHAR2`, `DATE`, `CLOB`...) | Trả về số lượng dòng (`NUMBER`). Không bao giờ trả về `NULL` (tối thiểu là `0`). |
| **`SUM`** | `SUM([DISTINCT \| ALL] n)` | **Chỉ kiểu số (`NUMBER`)** | Tính tổng các giá trị khác `NULL`. Nếu truyền chuỗi/ngày tháng (không ép kiểu thành số được) sẽ báo lỗi `ORA-01722` hoặc `ORA-00932`. |
| **`AVG`** | `AVG([DISTINCT \| ALL] n)` | **Chỉ kiểu số (`NUMBER`)** | Tính trung bình cộng của các giá trị khác `NULL`: `SUM(n) / COUNT(n)`. |
| **`MIN`** | `MIN([DISTINCT \| ALL] expr)` | **Mọi kiểu dữ liệu có thể so sánh** (`NUMBER`, `VARCHAR2`, `DATE`, `TIMESTAMP`) | Tìm giá trị nhỏ nhất: Số nhỏ nhất, Ngày xa nhất trong quá khứ (cũ nhất), Chuỗi đứng đầu bảng mã ASCII/NLS. |
| **`MAX`** | `MAX([DISTINCT \| ALL] expr)` | **Mọi kiểu dữ liệu có thể so sánh** (`NUMBER`, `VARCHAR2`, `DATE`, `TIMESTAMP`) | Tìm giá trị lớn nhất: Số lớn nhất, Ngày gần nhất/mới nhất, Chuỗi đứng cuối bảng mã ASCII/NLS. |
| **`LISTAGG`** | `LISTAGG([ALL \| DISTINCT] expr [, delimiter]) WITHIN GROUP (ORDER BY sort_expr)` | Chuỗi ký tự (`VARCHAR2`) hoặc kiểu có thể ép sang chuỗi | Nối các giá trị trên nhiều dòng trong cùng một nhóm thành **1 chuỗi duy nhất** ngăn cách bởi `delimiter`, được sắp xếp theo `ORDER BY` nội bộ. (Từ Oracle 19c/21c hỗ trợ cả `LISTAGG(DISTINCT ...)`). |

> [!WARNING]
> **Bẫy thi về kiểu dữ liệu của `MIN`/`MAX` so với `SUM`/`AVG`:**
> Đề thi OCA 1Z0-071 rất hay hỏi câu lệnh nào hợp lệ trên cột `HIRE_DATE` (`DATE`) hoặc `LAST_NAME` (`VARCHAR2`). Hãy nhớ:
> - `MIN(hire_date)`, `MAX(last_name)`, `COUNT(hire_date)` $\rightarrow$ **Hoàn toàn HỢP LỆ!**
> - `SUM(hire_date)`, `AVG(last_name)` $\rightarrow$ **LỖI BIÊN DỊCH** vì `SUM` và `AVG` chỉ nhận tham số kiểu số (`NUMBER`)!

### 2.2. Hàm nối chuỗi theo nhóm `LISTAGG`

Trong thực tế phát triển phần mềm tại doanh nghiệp (như hệ thống báo cáo VNPT), `LISTAGG` được sử dụng cực kỳ phổ biến để gom danh sách tên nhân viên, số điện thoại hoặc mã dịch vụ của cùng một phòng ban/khách hàng lên cùng 1 dòng:

```sql
SELECT department_id,
       LISTAGG(last_name, ', ') WITHIN GROUP (ORDER BY salary DESC, last_name ASC) AS emp_list
FROM employees
GROUP BY department_id;
```
- **Lưu ý cú pháp:** Mệnh đề `WITHIN GROUP (ORDER BY ...)` là **bắt buộc** đối với `LISTAGG` chuẩn để xác định thứ tự ghép các phần tử trong chuỗi kết quả. Các giá trị `NULL` của cột `last_name` sẽ tự động bị bỏ qua (không tạo ra dấu phẩy thừa).

---

## 3. Xử lý giá trị `NULL` và Phân biệt các biến thể của `COUNT`

### 3.1. Quy tắc Vàng về `NULL` trong hàm tổng hợp

> [!IMPORTANT]
> **Tất cả các hàm tổng hợp trong SQL đều BỎ QUA hoàn toàn giá trị `NULL` (Ignore NULL values), NGOẠI TRỪ duy nhất `COUNT(*)` (và `COUNT(hằng_số_khác_null)` như `COUNT(1)`).**

Sự bỏ qua `NULL` này gây ảnh hưởng lớn nhất tới hàm tính trung bình cộng **`AVG`**:
- `AVG(comm)` **KHÔNG PHẢI** là `SUM(comm) / COUNT(*)` (tổng chia cho tổng số nhân viên).
- `AVG(comm)` **CHÍNH LÀ** `SUM(comm) / COUNT(comm)` (tổng chia cho số nhân viên **có giá trị `comm` khác `NULL`**!).
- Nếu bạn muốn tính trung bình trên toàn bộ nhân viên (coi người có `comm IS NULL` là `0`), bạn **bắt buộc phải bọc hàm `NVL` vào bên trong `AVG`**: **`AVG(NVL(comm, 0))`**.

### 3.2. Minh họa trực quan trên bảng dữ liệu mẫu

Cho bảng `EMP_BONUS` gồm **5 dòng** như sau:

| EMP_ID | DEPT_ID | BONUS |
| :--- | :--- | :--- |
| `1` | `10` | `100` |
| `2` | `10` | `100` |
| `3` | `10` | `400` |
| `4` | `20` | *(NULL)* |
| `5` | *(NULL)* | *(NULL)* |

Hãy xem kết quả của câu truy vấn dưới đây:

```sql
SELECT COUNT(*)                AS cnt_all,
       COUNT(1)                AS cnt_one,
       COUNT(bonus)            AS cnt_bonus,
       COUNT(DISTINCT bonus)   AS cnt_dist_bonus,
       AVG(bonus)              AS avg_ignore_null,
       AVG(NVL(bonus, 0))      AS avg_include_null,
       AVG(DISTINCT bonus)     AS avg_dist_bonus
FROM emp_bonus;
```

**Phân tích chi tiết từng cột:**
1. `COUNT(*)`: Đếm tổng số dòng vật lý của bảng (kể cả dòng toàn `NULL`) = **`5`**.
2. `COUNT(1)`: Đánh giá biểu thức hằng số `1` trên từng dòng. Vì số `1` luôn `NOT NULL` trên mọi dòng, kết quả luôn bằng `COUNT(*)` = **`5`**.
3. `COUNT(bonus)`: Chỉ đếm các dòng mà `bonus IS NOT NULL` (`100, 100, 400`) = **`3`**.
4. `COUNT(DISTINCT bonus)`: Chỉ đếm các giá trị **duy nhất và khác `NULL`** của `bonus` (`100` và `400`) = **`2`**.
5. `AVG(bonus)`: Bỏ qua 2 dòng `NULL`, chỉ tính trên 3 dòng: `(100 + 100 + 400) / 3` = **`200`**.
6. `AVG(NVL(bonus, 0))`: Biến 2 dòng `NULL` thành `0`, tính trên cả 5 dòng: `(100 + 100 + 400 + 0 + 0) / 5` = **`120`**.
7. `AVG(DISTINCT bonus)`: Loại bỏ `NULL` và loại bỏ giá trị trùng `100`, chỉ còn `100` và `400`: `(100 + 400) / 2` = **`250`**.

**Kết quả đầu ra:**

| CNT_ALL | CNT_ONE | CNT_BONUS | CNT_DIST_BONUS | AVG_IGNORE_NULL | AVG_INCLUDE_NULL | AVG_DIST_BONUS |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `5` | `5` | `3` | `2` | `200` | `120` | `250` |

### 3.3. Bảng so sánh `COUNT(*)`, `COUNT(1)`, `COUNT(column)`, `COUNT(DISTINCT column)`

| Biểu thức | Có đếm dòng `NULL` không? | Có đếm giá trị trùng lặp không? | Sự thật về hiệu năng trong Oracle Optimizer |
| :--- | :--- | :--- | :--- |
| **`COUNT(*)`** | **CÓ** (Đếm mọi dòng) | **CÓ** | Chuẩn ANSI SQL. Bộ tối ưu hóa của Oracle (Cost-Based Optimizer - CBO) xử lý `COUNT(*)` và `COUNT(1)` **hoàn toàn giống hệt nhau** (cùng Execution Plan, không hề có chuyện `COUNT(1)` nhanh hơn `COUNT(*)` như lời đồn!). |
| **`COUNT(1)`** | **CÓ** (Vì literal `1` luôn `NOT NULL`) | **CÓ** | Được Oracle CBO tự động viết lại (rewrite) thành `COUNT(*)` ở tầng nội bộ. |
| **`COUNT(col)`** | **KHÔNG** (Bỏ qua dòng có `col IS NULL`) | **CÓ** | Phải đọc giá trị thực tế của cột `col` (trừ khi cột `col` có ràng buộc `NOT NULL` thì CBO tự chuyển thành `COUNT(*)`). |
| **`COUNT(DISTINCT col)`** | **KHÔNG** (Bỏ qua dòng có `col IS NULL`) | **KHÔNG** (Chỉ đếm mỗi giá trị khác `NULL` 1 lần) | Tốn chi phí thêm bước `HASH UNIQUE` hoặc `SORT GROUP BY` để khử trùng lặp. |

---

## 4. Gom nhóm dữ liệu với mệnh đề `GROUP BY`

Khi bạn muốn tính toán các hàm tổng hợp theo từng phân nhóm nhỏ (ví dụ: tổng lương của *từng phòng ban*, số lượng nhân viên của *từng chức danh công việc*), bạn sử dụng mệnh đề **`GROUP BY`**.

### 4.1. Thứ tự viết câu lệnh (Syntax Order) vs Thứ tự thực thi (Logical Execution Order)

```sql
SELECT   department_id, job_id, COUNT(*), ROUND(AVG(salary), 2) -- Bước 5: Tính kết quả hiển thị
FROM     employees                                              -- Bước 1: Xác định bảng nguồn
WHERE    salary > 2000                                          -- Bước 2: Lọc từng dòng thô trước khi nhóm
GROUP BY department_id, job_id                                  -- Bước 3: Chia các dòng còn lại thành từng nhóm
HAVING   COUNT(*) >= 2                                          -- Bước 4: Lọc giữ lại các nhóm thỏa điều kiện
ORDER BY department_id ASC;                                     -- Bước 6: Sắp xếp tập kết quả cuối cùng
```

### 4.2. Các quy tắc bắt buộc của `GROUP BY` (Trọng tâm đề thi!)

1. **Quy tắc đồng bộ giữa `SELECT` và `GROUP BY` (Lỗi `ORA-00979: not a GROUP BY expression`):**
   - Bất kỳ cột hoặc biểu thức đơn lẻ nào xuất hiện trong mệnh đề `SELECT` mà **KHÔNG nằm bên trong hàm tổng hợp** thì **BẮT BUỘC phải xuất hiện trong mệnh đề `GROUP BY`**!
   - **Chiều ngược lại KHÔNG bắt buộc:** Một cột xuất hiện trong `GROUP BY` **không nhất thiết** phải được đưa lên mệnh đề `SELECT`!
     ```sql
     -- HỢP LỆ 100%: Nhóm theo department_id nhưng chỉ SELECT mỗi AVG(salary)
     SELECT AVG(salary)
     FROM employees
     GROUP BY department_id;
     ```
2. **Cấm dùng Column Alias trong `GROUP BY`:**
   - Do `GROUP BY` (Bước 3) được thực thi **trước** mệnh đề `SELECT` (Bước 5 — nơi định nghĩa bí danh cột `AS alias`), bạn **không được phép dùng Column Alias trong `GROUP BY`** (sẽ báo lỗi **`ORA-00904: invalid identifier`**). Tuy nhiên, bạn **được phép dùng Table Alias** (ví dụ `GROUP BY e.department_id`).
3. **Cách `GROUP BY` xử lý giá trị `NULL`:**
   - Mặc dù trong điều kiện `WHERE`, `NULL` không bằng `NULL`, nhưng trong mệnh đề `GROUP BY`, Oracle coi **tất cả các dòng có giá trị `NULL` ở cột gom nhóm là thuộc về CÙNG MỘT NHÓM DUY NHẤT (nhóm `NULL`)**!
   - Ví dụ trong bảng `EMP_BONUS` ở mục 3.2: Nếu `GROUP BY dept_id`, sẽ có 3 nhóm được tạo ra: Nhóm `10` (3 dòng), Nhóm `20` (1 dòng), và Nhóm `NULL` (1 dòng).

---

## 5. Lọc dữ liệu sau gom nhóm với `HAVING` và So sánh `WHERE` vs `HAVING`

### 5.1. Tại sao cần `HAVING`?
Giả sử bài toán yêu cầu: *"Tìm các phòng ban có mức lương trung bình lớn hơn 8000"*.
Nhiều người mới học thường viết nhầm như sau:
```sql
-- SAI! Báo lỗi ORA-00934: group function is not allowed here
SELECT department_id, AVG(salary)
FROM employees
WHERE AVG(salary) > 8000
GROUP BY department_id;
```
**Lý do lỗi:** Mệnh đề `WHERE` chạy ở Bước 2 (trên từng dòng riêng lẻ **trước khi** các dòng được gom thành nhóm ở Bước 3). Tại thời điểm `WHERE` chạy, Oracle chưa hề biết nhóm phòng ban gồm những ai nên không thể tính `AVG(salary)`. Để lọc **sau khi đã gom nhóm**, bắt buộc phải dùng mệnh đề **`HAVING`**!

```sql
-- ĐÚNG CHUẨN:
SELECT department_id, AVG(salary)
FROM employees
GROUP BY department_id
HAVING AVG(salary) > 8000;
```

### 5.2. Bảng đối chiếu toàn diện `WHERE` và `HAVING`

| Tiêu chí so sánh | Mệnh đề `WHERE` | Mệnh đề `HAVING` |
| :--- | :--- | :--- |
| **Đối tượng tác động** | Lọc trên **từng dòng riêng lẻ (Row-level filter)**. | Lọc trên **từng nhóm đã gom (Group-level filter)**. |
| **Thời điểm thực thi** | Chạy **TRƯỚC** khi gom nhóm (`GROUP BY`) và trước khi tính hàm tổng hợp. | Chạy **SAU** khi đã gom nhóm (`GROUP BY`) và đã tính xong hàm tổng hợp. |
| **Chứa hàm tổng hợp (`SUM`, `AVG`, `COUNT`...)?** | **TUYỆT ĐỐI CẤM** (Báo lỗi `ORA-00934`). | **CHO PHÉP** (Mục đích thiết kế chính của `HAVING`). |
| **Vị trí cú pháp** | Luôn đứng sau `FROM` và đứng trước `GROUP BY`. | Trong Oracle SQL, `HAVING` có thể viết **sau `GROUP BY` HOẶC ngay trước `GROUP BY`** (cả 2 thứ tự đều hợp lệ trong Oracle!), nhưng chuẩn nhất là viết sau `GROUP BY`. |
| **Tối ưu hiệu năng** | Nên lọc tối đa các điều kiện cột đơn (như `department_id IN (10, 20)`) ở `WHERE` để **giảm số lượng dòng** phải đem đi gom nhóm. | Nếu đưa điều kiện cột đơn (`HAVING department_id IN (10, 20)`) vào `HAVING`, câu lệnh vẫn chạy đúng (nếu cột đó có trong `GROUP BY`), nhưng **kém hiệu năng hơn** vì phải gom nhóm toàn bộ bảng xong mới vứt bỏ các nhóm thừa! |

> [!TIP]
> **Bẫy thi OCA 1Z0-071 về vị trí của `HAVING` và `GROUP BY`:**
> Trong Oracle Database, hai cách viết sau đây **ĐỀU HỢP LỆ VÀ CHẠY RA KẾT QUẢ GIỐNG HỆT NHAU**:
> - Cách 1 (Phổ biến): `SELECT dept_id, COUNT(*) FROM emp GROUP BY dept_id HAVING COUNT(*) > 5;`
> - Cách 2 (Đảo vị trí): `SELECT dept_id, COUNT(*) FROM emp HAVING COUNT(*) > 5 GROUP BY dept_id;`
> Đừng chọn đáp án "Báo lỗi cú pháp" khi thấy đề thi đặt `HAVING` ngay trước `GROUP BY`! Tuy nhiên, dù viết trước hay sau thì về mặt logic, `GROUP BY` vẫn luôn được thực thi trước `HAVING`.

---

## 6. Lồng hàm tổng hợp 2 cấp (Nesting Group Functions) trong Oracle

Trong khi Single-Row Functions có thể lồng nhau không giới hạn cấp độ, thì trong Oracle SQL, **Hàm tổng hợp (Aggregate Functions) chỉ được phép lồng nhau tối đa 2 cấp (2 levels deep)**, ví dụ: `MAX(AVG(salary))`, `MIN(SUM(salary))`, `AVG(COUNT(*))`.

### Các quy tắc khắc nghiệt khi lồng hàm tổng hợp 2 cấp:

1. **Bắt buộc phải có mệnh đề `GROUP BY`:**
   - Hàm tổng hợp bên trong (`AVG(salary)`) tính trung bình cho từng nhóm của `GROUP BY`, sau đó hàm tổng hợp bên ngoài (`MAX(...)`) tìm giá trị lớn nhất trong các kết quả trung bình đó.
   - Nếu không có `GROUP BY`, việc gọi `SELECT MAX(AVG(salary)) FROM employees;` sẽ báo lỗi **`ORA-00978: nested group function without GROUP BY`**.
2. **Mệnh đề `SELECT` KHÔNG ĐƯỢC PHÉP chứa bất kỳ cột đơn lẻ nào (kể cả cột đã có trong `GROUP BY`!):**
   - Tại sao? Vì `AVG(salary)` theo `GROUP BY department_id` trả về $N$ dòng (mỗi phòng ban 1 dòng), nhưng khi bọc thêm `MAX(AVG(salary))` ở ngoài thì toàn bộ $N$ dòng đó đã bị gom lại thành **1 dòng kết quả duy nhất (Grand Total)**!
   - Do đó, nếu bạn viết `SELECT department_id, MAX(AVG(salary)) FROM employees GROUP BY department_id;`, Oracle sẽ báo lỗi **`ORA-00937: not a single-group group function`**!
3. **Không được lồng từ cấp thứ 3 trở lên:**
   - `SELECT SUM(MAX(AVG(salary))) FROM employees GROUP BY department_id;` $\rightarrow$ Báo lỗi **`ORA-00935: group function is nested too deeply`**.

```sql
-- SAI (Lỗi ORA-00937 vì có mặt cột department_id trong SELECT khi đã lồng 2 cấp hàm tổng hợp):
-- SELECT department_id, MAX(AVG(salary)) FROM employees GROUP BY department_id;

-- ĐÚNG (Chỉ trả về 1 giá trị duy nhất là mức lương trung bình phòng ban cao nhất):
SELECT ROUND(MAX(AVG(salary)), 2) AS highest_avg_dept_sal
FROM employees
GROUP BY department_id;
```

> [!TIP]
> **Vậy nếu muốn lấy cả `department_id` lẫn mức lương trung bình cao nhất đó thì làm thế nào?**
> Bạn phải dùng **Subquery / `HAVING`** (Chương 8) hoặc mệnh đề `FETCH FIRST`:
> ```sql
> SELECT department_id, AVG(salary) AS avg_sal
> FROM employees
> GROUP BY department_id
> HAVING AVG(salary) = (SELECT MAX(AVG(salary)) FROM employees GROUP BY department_id);
> ```

---

## 7. Bài tập thực hành tự luyện (Kèm lời giải chi tiết)

### Bài tập 1: Phân tích thống kê nhân sự theo phòng ban
Cho bảng `EMPLOYEES(employee_id, last_name, department_id, job_id, salary, commission_pct, hire_date)`.
Hãy viết một câu truy vấn duy nhất hiển thị các thông tin sau cho các phòng ban có **từ 3 nhân viên trở lên**, chỉ tính những nhân viên được tuyển dụng từ năm `2015` trở lại đây (`hire_date >= DATE '2015-01-01'`):
1. `DEPARTMENT_ID`
2. `TOTAL_EMPS`: Tổng số nhân viên thỏa mãn điều kiện trong phòng ban.
3. `EMPS_WITH_COMM`: Số lượng nhân viên được hưởng hoa hồng (`commission_pct IS NOT NULL`).
4. `DISTINCT_JOBS`: Số lượng mã công việc (`job_id`) khác nhau trong phòng ban đó.
5. `AVG_TOTAL_COMP`: Trung bình tổng thu nhập (`salary + salary * commission_pct`) của tất cả nhân viên trong nhóm (nhân viên không có hoa hồng thì phần hoa hồng tính là `0`), làm tròn 2 chữ số thập phân.
Sắp xếp kết quả theo `AVG_TOTAL_COMP` giảm dần.

<details>
<summary><b>👉 Xem Lời Giải Chi Tiết Bài Tập 1</b></summary>

```sql
SELECT department_id,
       COUNT(*)                                              AS total_emps,
       COUNT(commission_pct)                                 AS emps_with_comm,
       COUNT(DISTINCT job_id)                                AS distinct_jobs,
       ROUND(AVG(salary + salary * NVL(commission_pct, 0)), 2) AS avg_total_comp
FROM employees
WHERE hire_date >= DATE '2015-01-01'
GROUP BY department_id
HAVING COUNT(*) >= 3
ORDER BY avg_total_comp DESC;
```
- **Giải thích:**
  - Điều kiện `hire_date >= DATE '2015-01-01'` lọc từng nhân viên nên đặt ở `WHERE`.
  - `COUNT(commission_pct)` tự động bỏ qua `NULL`, đếm đúng số người có hoa hồng.
  - Trong `AVG(...)`, bắt buộc dùng `NVL(commission_pct, 0)` để những người không có hoa hồng không làm cả biểu thức `salary + salary * commission_pct` biến thành `NULL` (nếu thành `NULL` sẽ bị `AVG` bỏ qua mất).
  - Trong `ORDER BY` (chạy ở bước cuối cùng sau `SELECT`), ta hoàn toàn được phép sử dụng Column Alias `avg_total_comp`.
</details>

### Bài tập 2: Tìm lỗi sai trong các câu lệnh SQL
Giải thích tại sao 3 câu lệnh SQL dưới đây đều báo lỗi khi chạy trên Oracle và sửa lại cho đúng:
```sql
-- Câu A:
SELECT department_id, job_id, COUNT(*)
FROM employees
GROUP BY department_id;

-- Câu B:
SELECT department_id AS dept, SUM(salary)
FROM employees
GROUP BY dept
HAVING SUM(salary) > 20000;

-- Câu C:
SELECT department_id, MIN(AVG(salary))
FROM employees
GROUP BY department_id;
```

<details>
<summary><b>👉 Xem Lời Giải Chi Tiết Bài Tập 2</b></summary>

1. **Câu A:** Báo lỗi **`ORA-00979: not a GROUP BY expression`** vì cột `job_id` nằm trên `SELECT` (ngoài hàm tổng hợp) nhưng lại thiếu trong `GROUP BY`.
   - *Cách sửa:* `GROUP BY department_id, job_id`.
2. **Câu B:** Báo lỗi **`ORA-00904: "DEPT": invalid identifier`** vì không được phép dùng Column Alias (`dept`) trong mệnh đề `GROUP BY`.
   - *Cách sửa:* Đổi thành `GROUP BY department_id`.
3. **Câu C:** Báo lỗi **`ORA-00937: not a single-group group function`** vì khi lồng hàm tổng hợp 2 cấp (`MIN(AVG(salary))`), kết quả thu gọn về 1 dòng duy nhất cho cả bảng nên không được phép để cột `department_id` trên `SELECT`.
   - *Cách sửa:* Bỏ `department_id` khỏi mệnh đề `SELECT`: `SELECT MIN(AVG(salary)) FROM employees GROUP BY department_id;`.
</details>

---

## 8. Tổng hợp Bẫy thi OCA/OCP (Exam Essentials)

| STT | Chủ đề | Bẫy thi thường gặp trong đề OCA 1Z0-071 / VNPT | Quy tắc chuẩn cần nhớ |
| :--- | :--- | :--- | :--- |
| **1** | `SUM` / `AVG` vs `MIN` / `MAX` | Gọi `AVG(hire_date)` hoặc `SUM(last_name)`. | `SUM` và `AVG` **chỉ nhận kiểu `NUMBER`**. `MIN`, `MAX`, `COUNT` nhận được cả `NUMBER`, `VARCHAR2`, `DATE`. |
| **2** | Xử lý `NULL` trong `AVG` | Nghĩ rằng `AVG(col)` chia cho tổng số dòng của bảng. | `AVG(col)` bỏ qua các dòng `NULL` (chỉ chia cho số dòng `col IS NOT NULL`). Muốn tính cả dòng `NULL` như số `0`, phải viết `AVG(NVL(col, 0))`. |
| **3** | `COUNT(*)` vs `COUNT(col)` | Nghĩ rằng `COUNT(*)` bỏ qua dòng `NULL`. | `COUNT(*)` và `COUNT(1)` đếm **tất cả các dòng** (kể cả dòng toàn `NULL`). `COUNT(col)` chỉ đếm dòng mà `col IS NOT NULL`. |
| **4** | Cột trên `SELECT` và `GROUP BY` | Đặt cột đơn trên `SELECT` nhưng quên đưa vào `GROUP BY`. | Báo lỗi `ORA-00979`. Mọi cột không bọc hàm tổng hợp ở `SELECT` phải có mặt trong `GROUP BY` (nhưng cột ở `GROUP BY` không bắt buộc có trên `SELECT`). |
| **5** | Dùng Alias trong `GROUP BY` / `HAVING` | Viết `SELECT dept_id d, COUNT(*) FROM emp GROUP BY d`. | Báo lỗi `ORA-00904`. Column Alias **chỉ được dùng trong `ORDER BY`**, cấm dùng trong `WHERE`, `GROUP BY`, `HAVING`. |
| **6** | Hàm tổng hợp trong `WHERE` | Viết `WHERE COUNT(*) > 5` hoặc `WHERE AVG(sal) > 1000`. | Báo lỗi `ORA-00934: group function is not allowed here`. Phải chuyển sang mệnh đề `HAVING`. |
| **7** | Thứ tự `HAVING` và `GROUP BY` | Thấy `HAVING ... GROUP BY ...` liền chọn đáp án "Lỗi cú pháp". | Trong Oracle SQL, `HAVING` đặt ngay trước hay ngay sau `GROUP BY` **đều hợp lệ**. |
| **8** | Lồng hàm tổng hợp (`MAX(AVG(sal))`) | Viết `SELECT dept_id, MAX(AVG(sal)) FROM emp GROUP BY dept_id`. | Báo lỗi `ORA-00937`. Khi lồng hàm tổng hợp 2 cấp, **bắt buộc phải có `GROUP BY`** và **cấm đặt thêm bất kỳ cột đơn nào trên `SELECT`**. |
