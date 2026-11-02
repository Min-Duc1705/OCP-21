# Chương 16: Tổng Hợp Dữ Liệu Nâng Cao (Advanced Aggregation, LISTAGG & PIVOT/UNPIVOT)

> **Thuộc Phần II:** Oracle SQL Nâng Cao (Advanced Oracle SQL for Developers)  
> **Mục tiêu khảo thí:** Oracle Database SQL Certified Associate / Professional (1Z0-071 & 1Z0-047) & Tuyển dụng Kỹ sư CNTT (VNPT, Viettel, FPT, Ngân hàng)  
> **Trọng tâm:** `GROUP BY ROLLUP`, `CUBE`, `GROUPING SETS`, Composite Columns, Hàm `GROUPING()` & `GROUPING_ID()`, Hàm nối chuỗi `LISTAGG` nâng cao (`ON OVERFLOW TRUNCATE`), và Xoay bảng dữ liệu với `PIVOT` / `UNPIVOT`.

---

## 📑 Mục Lục Chi Tiết

1. [`GROUP BY ROLLUP` ($N + 1$ Cấp Tổng Hợp) & Partial Rollup](#1-group-by-rollup-n--1-cấp-tổng-hợp--partial-rollup)
2. [`GROUP BY CUBE` ($2^N$ Cấp Tổng Hợp) & Partial Cube](#2-group-by-cube-2n-cấp-tổng-hợp--partial-cube)
3. [`GROUP BY GROUPING SETS` & Tổ Hợp Cột (Composite Columns)](#3-group-by-grouping-sets--tổ-hợp-cột-composite-columns)
4. [Hàm `GROUPING()`, `GROUPING_ID()` & `GROUP_ID()`](#4-hàm-grouping-grouping_id--group_id)
5. [Hàm Nối Chuỗi `LISTAGG` Nâng Cao (Oracle 11gR2 / 12cR2 / 19c)](#5-hàm-nối-chuỗi-listagg-nâng-cao-oracle-11gr2--12cr2--19c)
6. [Xoay Bảng Dữ Liệu: `PIVOT` (Dòng Thành Cột) & `UNPIVOT` (Cột Thành Dòng)](#6-xoay-bảng-dữ-liệu-pivot-dòng-thành-cột--unpivot-cột-thành-dòng)
7. [Bài Tập Thực Hành Tự Luyện (Kèm Lời Giải Chi Tiết)](#7-bài-tập-thực-hành-tự-luyện-kèm-lời-giải-chi-tiết)
8. [Tổng Hợp Bẫy Thi OCA/OCP Cốt Lõi Cần Nhớ (Exam Essentials)](#8-tổng-hợp-bẫy-thi-ocaocp-cốt-lõi-cần-nhớ-exam-essentials)

---

## 🗂️ Dữ Liệu Mẫu Xuyên Suốt Chương

Để minh họa rõ ràng cách các hàm tổng hợp đa chiều hoạt động (đặc biệt là cách phân biệt giá trị `NULL` thật trong dữ liệu với giá trị `NULL` của dòng tổng cộng), ta sử dụng bảng `EMP_SUMMARY` dưới đây:

| EMP_ID | FIRST_NAME | DEPT_ID | JOB_ID | SALARY |
| :--- | :--- | :--- | :--- | :--- |
| 101 | Alice | 10 | AD_VP | 10000 |
| 102 | Bob | 10 | IT_PROG | 6000 |
| 103 | Charlie | 20 | IT_PROG | 8000 |
| 104 | David | 20 | SA_REP | 5000 |
| 105 | Eva | *NULL* | SA_REP | 4000 |

*(Chú ý: Nhân viên `Eva` có `DEPT_ID` là `NULL` gốc trong bảng dữ liệu — đây sẽ là trường hợp thử lửa cho hàm `GROUPING()` ở Mục 4!).*

---

## 1. `GROUP BY ROLLUP` ($N + 1$ Cấp Tổng Hợp) & Partial Rollup

### 1.1. Bản chất của `ROLLUP`
Mệnh đề `GROUP BY` truyền thống chỉ tạo ra **1 cấp tổng hợp duy nhất**. Nếu báo cáo kế toán yêu cầu hiển thị:
1. Tổng lương theo từng `(DEPT_ID, JOB_ID)`
2. Tổng lương tiểu mục (Subtotal) theo từng `DEPT_ID`
3. Tổng cộng toàn công ty (Grand Total)

Thay vì phải viết 3 câu `SELECT ... GROUP BY` nối nhau bằng `UNION ALL` (phải quét bảng 3 lần), **`GROUP BY ROLLUP(col1, col2, ..., colN)`** thực hiện cuốn chiếu từ phải sang trái chỉ trong 1 lần quét dữ liệu!

### 1.2. Công thức số cấp tổng hợp của `ROLLUP`
Với $N$ biểu thức bên trong `ROLLUP(c1, c2, ..., cN)`, Oracle tạo ra đúng **$N + 1$ cấp tổng hợp (grouping levels)** bằng cách lần lượt bỏ dần từng cột từ **phải sang trái**:
* Với `GROUP BY ROLLUP(dept_id, job_id)` ($N = 2 \implies 2 + 1 = 3$ cấp tổng hợp):
  1. **Cấp 1:** `GROUP BY (dept_id, job_id)` — Chi tiết theo từng Phòng ban & Công việc.
  2. **Cấp 2:** `GROUP BY (dept_id)` — Tiểu mục (Subtotal) theo từng Phòng ban (`job_id` được điền `NULL`).
  3. **Cấp 3:** `GROUP BY ()` — Tổng cộng toàn bảng (Grand Total — cả `dept_id` và `job_id` đều được điền `NULL`).

> [!IMPORTANT]
> **Thứ tự cột trong `ROLLUP` CỰC KỲ QUAN TRỌNG:**
> `ROLLUP(A, B)` **KHÔNG tương đương** với `ROLLUP(B, A)`!
> - `ROLLUP(dept_id, job_id)` tính Subtotal theo `dept_id` (không có Subtotal theo `job_id`).
> - `ROLLUP(job_id, dept_id)` tính Subtotal theo `job_id` (không có Subtotal theo `dept_id`).

### 1.3. Ví dụ thực tế với `GROUP BY ROLLUP(dept_id, job_id)`

```sql
SELECT dept_id,
       job_id,
       COUNT(*) AS emp_cnt,
       SUM(salary) AS total_sal
FROM emp_summary
WHERE dept_id IS NOT NULL -- Tạm lọc dòng Eva để quan sát 3 cấp của ROLLUP trước
GROUP BY ROLLUP(dept_id, job_id)
ORDER BY dept_id NULLS LAST, job_id NULLS LAST;
```

**Kết quả đầu ra:**

| DEPT_ID | JOB_ID | EMP_CNT | TOTAL_SAL | Giải thích cấp tổng hợp |
| :--- | :--- | :--- | :--- | :--- |
| 10 | AD_VP | 1 | 10000 | Cấp 1: `(dept_id, job_id)` |
| 10 | IT_PROG | 1 | 6000 | Cấp 1: `(dept_id, job_id)` |
| **10** | ***NULL*** | **2** | **16000** | **Cấp 2: Subtotal của `dept_id = 10`** |
| 20 | IT_PROG | 1 | 8000 | Cấp 1: `(dept_id, job_id)` |
| 20 | SA_REP | 1 | 5000 | Cấp 1: `(dept_id, job_id)` |
| **20** | ***NULL*** | **2** | **13000** | **Cấp 2: Subtotal của `dept_id = 20`** |
| ***NULL*** | ***NULL*** | **4** | **29000** | **Cấp 3: Grand Total `()` toàn công ty** |

### 1.4. Partial Rollup (Cuốn chiếu từng phần)
Khi bạn đặt một hoặc nhiều cột ở ngoài `ROLLUP`, ví dụ:
```sql
GROUP BY dept_id, ROLLUP(job_id)
```
* Cột `dept_id` nằm ngoài `ROLLUP` nên **luôn luôn xuất hiện trong mọi cấp tổng hợp**.
* `ROLLUP(job_id)` có $1$ cột nên sinh ra $1 + 1 = 2$ tổ hợp: `(job_id)` và `()`.
* Nhân với `dept_id` ở ngoài, ta thu được **2 cấp tổng hợp**:
  1. `(dept_id, job_id)`
  2. `(dept_id)` *(Subtotal cho từng phòng ban, **KHÔNG CÓ dòng Grand Total `()` toàn bảng!**)*

---

## 2. `GROUP BY CUBE` ($2^N$ Cấp Tổng Hợp) & Partial Cube

### 2.1. Bản chất và Công thức của `CUBE`
Nếu `ROLLUP` chỉ tính tổng cuốn chiếu một chiều từ phải sang trái, thì **`GROUP BY CUBE(c1, c2, ..., cN)`** tạo ra bảng tổng hợp chéo đa chiều (**Cross-Tabulation**) cho **MỌI TỔ HỢP CÓ THỂ CÓ** của $N$ biểu thức bên trong!

* Với $N$ cột độc lập trong `CUBE(c1, c2, ..., cN)`, tổng số cấp tổng hợp được tạo ra là **$2^N$ cấp**:
  * $N = 2$: `CUBE(dept_id, job_id)` $\implies 2^2 =$ **4 cấp tổng hợp**:
    1. `(dept_id, job_id)` — Chi tiết theo cả hai cột.
    2. `(dept_id)` — Subtotal theo từng phòng ban.
    3. `(job_id)` — Subtotal theo từng công việc *(điểm khác biệt so với `ROLLUP`!)*.
    4. `()` — Grand Total toàn bảng.
  * $N = 3$: `CUBE(region, dept_id, job_id)` $\implies 2^3 =$ **8 cấp tổng hợp**.
  * $N = 4$: `CUBE(c1, c2, c3, c4)` $\implies 2^4 =$ **16 cấp tổng hợp**.

*(Khác với `ROLLUP`, thứ tự cột bên trong `CUBE(A, B)` và `CUBE(B, A)` tạo ra tập các cấp tổng hợp **giống hệt nhau**).*

### 2.2. Partial Cube (Hình lập phương từng phần)
Tương tự Partial Rollup, nếu viết:
```sql
GROUP BY dept_id, CUBE(job_id, manager_id)
```
* `dept_id` cố định (1 trường hợp).
* `CUBE(job_id, manager_id)` có $2$ cột $\implies 2^2 = 4$ tổ hợp: `(job_id, manager_id)`, `(job_id)`, `(manager_id)`, và `()`.
* Kết hợp với `dept_id` ở ngoài tạo thành $1 \times 4 =$ **4 cấp tổng hợp**:
  1. `(dept_id, job_id, manager_id)`
  2. `(dept_id, job_id)`
  3. `(dept_id, manager_id)`
  4. `(dept_id)` *(Không có Grand Total `()` vì `dept_id` luôn có mặt).*

---

## 3. `GROUP BY GROUPING SETS` & Tổ Hợp Cột (Composite Columns)

### 3.1. Tại sao cần `GROUPING SETS`?
Khi số lượng cột tăng lên (ví dụ $N = 4$ cột), `CUBE` sinh ra tới $2^4 = 16$ cấp tổng hợp, trong khi báo cáo thực tế chỉ cần đúng 2 cấp là tổng theo `dept_id` và tổng theo `job_id`. Nếu dùng `CUBE` rồi lọc bỏ sẽ cực kỳ lãng phí CPU.
**`GROUP BY GROUPING SETS (...)`** cho phép bạn **chỉ định đích danh những cấp tổng hợp nào cần tính**, không thừa một cấp nào!

```sql
-- Chỉ tính tổng riêng theo dept_id, tổng riêng theo job_id, và Grand Total ()
SELECT dept_id, job_id, SUM(salary) AS total_sal
FROM emp_summary
GROUP BY GROUPING SETS (
    (dept_id),
    (job_id),
    ()          -- Cặp ngoặc đơn rỗng () đại diện cho Grand Total!
);
```

### 3.2. Bảng quy đổi tương đương giữa `ROLLUP`, `CUBE`, và `GROUPING SETS` (Rất hay ra thi OCP!)

| Mệnh đề viết gọn | Biểu thức `GROUPING SETS` tương đương 100% |
| :--- | :--- |
| `GROUP BY a, b` | `GROUP BY GROUPING SETS ((a, b))` *(1 cấp)* |
| `GROUP BY ROLLUP(a, b)` | `GROUP BY GROUPING SETS ((a, b), (a), ())` *(3 cấp)* |
| `GROUP BY a, ROLLUP(b, c)` | `GROUP BY GROUPING SETS ((a, b, c), (a, b), (a))` *(3 cấp)* |
| `GROUP BY CUBE(a, b)` | `GROUP BY GROUPING SETS ((a, b), (a), (b), ())` *(4 cấp)* |
| `GROUP BY GROUPING SETS (a, b)` | `GROUP BY GROUPING SETS ((a), (b))` *(2 cấp riêng biệt — chú ý dấu phẩy!)* |

> [!WARNING]
> **Bẫy ngoặc đơn cực hiểm trong `GROUPING SETS`:**
> - `GROUP BY GROUPING SETS (a, b)` (không có ngoặc đơn lồng bên trong) nghĩa là tính **2 cấp riêng rẽ**: cấp 1 là `GROUP BY (a)` và cấp 2 là `GROUP BY (b)`.
> - `GROUP BY GROUPING SETS ((a, b))` (có cặp ngoặc đơn bọc `(a, b)`) nghĩa là chỉ tính **1 cấp duy nhất**: `GROUP BY a, b`!

### 3.3. Composite Columns (Cột ghép đơn vị) trong `ROLLUP` và `CUBE`
Khi bạn bọc nhiều cột vào chung một cặp ngoặc đơn bổ sung bên trong `ROLLUP` hoặc `CUBE`, ví dụ `(a, b)`, Oracle coi cả cụm `(a, b)` là **1 đơn vị nguyên tử duy nhất (Composite Column)** — khi bỏ cột sẽ bỏ cả cụm `(a, b)` cùng lúc chứ không tách lẻ!

**Ví dụ phân tích đề thi OCP:**
```sql
GROUP BY ROLLUP(a, (b, c), d)
```
* Trong `ROLLUP` này không phải có 4 phần tử mà chỉ có **3 đơn vị**: Đơn vị 1 là `a`, Đơn vị 2 là cụm `(b, c)`, Đơn vị 3 là `d`.
* Do đó chỉ sinh ra $3 + 1 =$ **4 cấp tổng hợp** (bỏ dần từ phải sang trái):
  1. `(a, b, c, d)`
  2. `(a, b, c)` *(bỏ `d`)*
  3. `(a)` *(bỏ nguyên cụm `(b, c)` cùng lúc — **không có cấp `(a, b)`!**)*
  4. `()` *(bỏ `a`)*

---

## 4. Hàm `GROUPING()`, `GROUPING_ID()` & `GROUP_ID()`

### 4.1. Bài toán thực tế: Phân biệt `NULL` gốc trong dữ liệu với `NULL` do `ROLLUP`/`CUBE` sinh ra
Hãy quay lại bảng mẫu `EMP_SUMMARY` ở đầu chương, nơi nhân viên `Eva` có `DEPT_ID IS NULL` (`salary = 4000`). Nếu ta chạy `GROUP BY ROLLUP(dept_id)`, cả dòng của `Eva` (`dept_id` thật sự là `NULL`) và dòng Tổng cộng toàn công ty (Grand Total) đều hiển thị cột `DEPT_ID` là **`NULL`**! Làm sao phân biệt được?

### 4.2. Hàm `GROUPING(expr)`
Hàm `GROUPING(col)` nhận vào **duy nhất 1 cột** nằm trong `GROUP BY` và trả về `0` hoặc `1`:
* **Trả về `1`:** Nếu giá trị `NULL` tại cột `col` là **Super-aggregate `NULL`** (do `ROLLUP`, `CUBE`, hoặc `GROUPING SETS` tổng hợp sinh ra — nghĩa là cột `col` **không tham gia** vào cấp gom nhóm của dòng đó).
* **Trả về `0`:** Nếu cột `col` **có tham gia** vào cấp gom nhóm của dòng đó (kể cả khi giá trị dữ liệu gốc của `col` trong bảng là `NULL` như dòng của `Eva`!).

```sql
SELECT CASE WHEN GROUPING(dept_id) = 1 THEN 'ALL_DEPTS'
            ELSE NVL(TO_CHAR(dept_id), 'Unassigned_Dept')
       END AS dept_label,
       CASE WHEN GROUPING(job_id) = 1 THEN 'ALL_JOBS'
            ELSE job_id
       END AS job_label,
       GROUPING(dept_id) AS grp_dept,
       GROUPING(job_id)  AS grp_job,
       GROUPING_ID(dept_id, job_id) AS grp_id_dec,
       SUM(salary) AS total_sal
FROM emp_summary
GROUP BY ROLLUP(dept_id, job_id)
ORDER BY dept_id NULLS FIRST, job_id NULLS FIRST;
```

**Kết quả đầu ra (Chú ý sự khác biệt giữa dòng `Eva` và dòng `ALL_DEPTS`):**

| DEPT_LABEL | JOB_LABEL | GRP_DEPT | GRP_JOB | GRP_ID_DEC | TOTAL_SAL | Bản chất dòng |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unassigned_Dept** | SA_REP | **0** | **0** | **0** *(nhị phân `00`)* | 4000 | Dòng chi tiết của Eva (`dept_id` gốc là `NULL`!) |
| **Unassigned_Dept** | ALL_JOBS | **0** | **1** | **1** *(nhị phân `01`)* | 4000 | Subtotal của nhóm phòng ban `NULL` |
| 10 | AD_VP | 0 | 0 | 0 *(nhị phân `00`)* | 10000 | Dòng chi tiết phòng 10 |
| 10 | IT_PROG | 0 | 0 | 0 *(nhị phân `00`)* | 6000 | Dòng chi tiết phòng 10 |
| 10 | ALL_JOBS | 0 | 1 | **1** *(nhị phân `01`)* | 16000 | Subtotal phòng 10 |
| 20 | IT_PROG | 0 | 0 | 0 *(nhị phân `00`)* | 8000 | Dòng chi tiết phòng 20 |
| 20 | SA_REP | 0 | 0 | 0 *(nhị phân `00`)* | 5000 | Dòng chi tiết phòng 20 |
| 20 | ALL_JOBS | 0 | 1 | **1** *(nhị phân `01`)* | 13000 | Subtotal phòng 20 |
| **ALL_DEPTS** | **ALL_JOBS** | **1** | **1** | **3** *(nhị phân `11`)* | 33000 | Grand Total toàn công ty |

### 4.3. Hàm `GROUPING_ID(col1, col2, ..., colN)` (Vector nhị phân sang số thập phân)
Thay vì phải gọi rời rạc nhiều hàm `GROUPING(c1)`, `GROUPING(c2)`..., hàm **`GROUPING_ID(c1, c2, ..., cN)`** nhận nhiều cột, ghép kết quả bit `GROUPING(c1) || GROUPING(c2) || ... || GROUPING(cN)` thành một chuỗi nhị phân (Bit Vector) rồi **đổi sang số nguyên hệ thập phân (Base-10)**:

$$\text{GROUPING\_ID}(c_1, c_2) = 2^1 \times \text{GROUPING}(c_1) + 2^0 \times \text{GROUPING}(c_2)$$

| Tổ hợp đang gom nhóm | `GROUPING(dept_id)` | `GROUPING(job_id)` | Vector Nhị Phân | Giá trị `GROUPING_ID(dept_id, job_id)` |
| :--- | :---: | :---: | :---: | :---: |
| Chi tiết `(dept_id, job_id)` | `0` | `0` | `00` | **$0$** |
| Subtotal theo `dept_id` (`job_id` tổng hợp) | `0` | `1` | `01` | **$1$** |
| Subtotal theo `job_id` (`dept_id` tổng hợp) | `1` | `0` | `10` | **$2$** |
| Grand Total `()` (Cả 2 đều tổng hợp) | `1` | `1` | `11` | **$3$** |

*(Nếu truyền 3 cột `GROUPING_ID(a, b, c)` tại dòng Grand Total `()`, chuỗi nhị phân là `111` $\implies 4 + 2 + 1 = 7$).*

### 4.4. Hàm `GROUP_ID()` (Loại bỏ dòng tổng hợp trùng lặp)
Khi kết hợp nhiều `ROLLUP` / `GROUPING SETS` phức tạp (ví dụ `GROUP BY dept_id, ROLLUP(dept_id, job_id)`), cấp tổng hợp `(dept_id)` bị sinh ra **2 lần trùng lặp**.
* Hàm `GROUP_ID()` (không có tham số) trả về **`0`** cho bản ghi đầu tiên của mỗi cấp tổng hợp, và trả về `1, 2, ...` cho các bản sao bị trùng lặp của cấp đó.
* Để khử các dòng tổng hợp trùng lặp, ta chỉ cần thêm: **`HAVING GROUP_ID() = 0`**.

---

## 5. Hàm Nối Chuỗi `LISTAGG` Nâng Cao (Oracle 11gR2 / 12cR2 / 19c)

### 5.1. Cú pháp chuẩn của `LISTAGG`
Hàm `LISTAGG` dùng để nối giá trị chuỗi của nhiều dòng trong cùng một nhóm thành **1 chuỗi duy nhất ngăn cách bởi dấu phân cách (delimiter)** theo một thứ tự sắp xếp xác định bắt buộc trong **`WITHIN GROUP (ORDER BY ...)`**:

```sql
LISTAGG([ALL | DISTINCT] measure_expr [, 'delimiter']
        [ON OVERFLOW { ERROR | TRUNCATE ['truncation_indicator'] [{ WITH | WITHOUT } COUNT] }]
) WITHIN GROUP (ORDER BY order_by_clause)
[OVER (PARTITION BY ...)]
```

**Các đặc điểm quan trọng cần nhớ:**
1. Mệnh đề **`WITHIN GROUP (ORDER BY ...)` là BẮT BUỘC** đối với `LISTAGG`.
2. Giá trị `NULL` trong cột `measure_expr` sẽ **tự động bị bỏ qua** (không nối thêm dấu phẩy thừa cho dòng `NULL`).
3. Nếu bỏ qua tham số `'delimiter'`, mặc định Oracle nối liền các chuỗi lại với nhau không có dấu ngăn cách (`''`).
4. Từ **Oracle 19c**, bạn có thể dùng `LISTAGG(DISTINCT job_id, ', ') WITHIN GROUP (ORDER BY job_id)` để khử các giá trị trùng lặp trước khi nối chuỗi!

### 5.2. Xử lý lỗi tràn bộ đệm `ORA-01489` với `ON OVERFLOW TRUNCATE` (Oracle 12cR2+)
Trong SQL, kiểu trả về của `LISTAGG` là `VARCHAR2` (giới hạn tối đa `4000` bytes ở chế độ `STANDARD`, hoặc `32767` bytes nếu bật `MAX_STRING_SIZE = EXTENDED`). Khi nối hàng nghìn dòng, chuỗi vượt quá giới hạn sẽ văng lỗi **`ORA-01489: result of string concatenation is too long`** (hành vi mặc định là `ON OVERFLOW ERROR`).

Từ Oracle 12cR2, mệnh đề **`ON OVERFLOW TRUNCATE`** giúp cắt chuỗi an toàn tại ranh giới phần tử cuối cùng còn đủ chỗ mà không văng lỗi:

```sql
SELECT dept_id,
       LISTAGG(first_name, ', ' ON OVERFLOW TRUNCATE '...' WITH COUNT)
           WITHIN GROUP (ORDER BY salary DESC, first_name ASC) AS emp_list
FROM emp_summary
WHERE dept_id IS NOT NULL
GROUP BY dept_id;
```

* **`ON OVERFLOW TRUNCATE`** (mặc định nếu không ghi rõ đuôi): Tự động thêm dấu ba chấm `'...'` và kèm theo số lượng phần tử bị cắt bỏ trong ngoặc đơn `(n)` (vì mặc định là **`WITH COUNT`**). Ví dụ: `'Alice, Bob, ...(125)'`.
* **`ON OVERFLOW TRUNCATE '[more]' WITHOUT COUNT`**: Thay dấu `'...'` bằng chuỗi tùy chỉnh `'[more]'` và ẩn con số đếm đi.

---

## 6. Xoay Bảng Dữ Liệu: `PIVOT` (Dòng Thành Cột) & `UNPIVOT` (Cột Thành Dòng)

### 6.1. Toán tử `PIVOT` (Xoay giá trị dòng thành tiêu đề cột)
`PIVOT` biến các giá trị rời rạc của một cột (ví dụ `JOB_ID` có `'AD_VP'`, `'IT_PROG'`, `'SA_REP'`) thành các **cột riêng biệt** trên bảng kết quả, đồng thời tính toán hàm tổng hợp (`SUM`, `COUNT`, `MAX`...) tại giao điểm.

```sql
SELECT *
FROM (
    -- Bước 1 (CỰC KỲ QUAN TRỌNG): Chỉ chiếu (project) đúng các cột cần thiết trong Inline View!
    SELECT dept_id, job_id, salary
    FROM emp_summary
    WHERE dept_id IS NOT NULL
)
PIVOT (
    SUM(salary) AS sum_sal, COUNT(*) AS cnt      -- 1. Các hàm tổng hợp (Aggregate Functions)
    FOR job_id                                   -- 2. Cột chứa giá trị sẽ xoay thành tên cột mới
    IN ('AD_VP' AS vp, 'IT_PROG' AS it, 'SA_REP' AS sa) -- 3. Danh sách giá trị cố định (Static list)
)
ORDER BY dept_id;
```

**Kết quả đầu ra:**

| DEPT_ID | VP_SUM_SAL | VP_CNT | IT_SUM_SAL | IT_CNT | SA_SUM_SAL | SA_CNT |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 10 | 10000 | 1 | 6000 | 1 | *NULL* | 0 |
| 20 | *NULL* | 0 | 8000 | 1 | 5000 | 1 |

> [!CAUTION]
> **2 Bẫy Thi Cốt Tử Của `PIVOT`:**
> 1. **Cơ chế `GROUP BY` ngầm định (Implicit Grouping):** `PIVOT` tự động lấy **TẤT CẢ các cột còn lại không xuất hiện trong mệnh đề `PIVOT (AGG(...) FOR ...)`** để làm khóa `GROUP BY`! Nếu bạn viết `SELECT * FROM emp_summary PIVOT (...)` mà không bọc Inline View để loại bỏ cột khóa chính `EMP_ID` và `FIRST_NAME`, Oracle sẽ `GROUP BY (emp_id, first_name, dept_id)` khiến bảng kết quả không thể gộp theo từng phòng ban!
> 2. **Danh sách trong `IN (...)` bắt buộc phải cố định (Static literals):** Trong `PIVOT` thông thường, bạn **KHÔNG ĐƯỢC PHÉP** dùng câu truy vấn con `IN (SELECT DISTINCT job_id FROM ...)`! Truy vấn con trong `IN` chỉ được phép dùng khi đi kèm từ khóa **`PIVOT XML`** (trả về dữ liệu kiểu XML).

### 6.2. Toán tử `UNPIVOT` (Xoay nhiều cột thành các dòng)
Ngược lại với `PIVOT`, toán tử **`UNPIVOT`** gom nhiều cột đang nằm ngang (ví dụ `Q1_SALES`, `Q2_SALES`, `Q3_SALES`, `Q4_SALES`) chuyển thành 2 cột dọc: một cột lưu tên quý (`QUARTER`) và một cột lưu doanh số (`AMOUNT`).

Giả sử ta có bảng `QUARTERLY_REVENUE`:

| DEPT_ID | Q1 | Q2 | Q3 |
| :--- | :--- | :--- | :--- |
| 10 | 100 | *NULL* | 300 |

```sql
SELECT dept_id, quarter_name, revenue
FROM quarterly_revenue
UNPIVOT INCLUDE NULLS (
    revenue                             -- 1. Tên cột mới sẽ chứa GIÁ TRỊ số liệu
    FOR quarter_name                    -- 2. Tên cột mới sẽ chứa TÊN NHÃN của các cột cũ
    IN (q1 AS 'Quarter_1', q2 AS 'Quarter_2', q3 AS 'Quarter_3')
);
```

**Kết quả đầu ra (Khi có `INCLUDE NULLS`):**

| DEPT_ID | QUARTER_NAME | REVENUE |
| :--- | :--- | :--- |
| 10 | Quarter_1 | 100 |
| 10 | **Quarter_2** | ***NULL*** |
| 10 | Quarter_3 | 300 |

> [!WARNING]
> **Bẫy mặc định của `UNPIVOT` (`EXCLUDE NULLS` vs `INCLUDE NULLS`):**
> - Mặc định, `UNPIVOT` hoạt động ở chế độ **`EXCLUDE NULLS`**: nếu cột `Q2` mang giá trị `NULL`, dòng `Quarter_2` sẽ **tự động biến mất** khỏi kết quả (chỉ còn 2 dòng `Quarter_1` và `Quarter_3`)!
> - Nếu muốn giữ lại cả những dòng có giá trị `NULL`, bạn phải viết tường minh **`UNPIVOT INCLUDE NULLS (...)`**.

---

## 7. Bài Tập Thực Hành Tự Luyện (Kèm Lời Giải Chi Tiết)

### Bài tập 1: Báo cáo tổng hợp với `GROUPING SETS` và `GROUPING_ID`
**Đề bài:** Từ bảng `EMP_SUMMARY`, hãy viết một câu truy vấn duy nhất chỉ tạo ra **đúng 3 cấp tổng hợp**:
1. Tổng lương theo từng cặp `(dept_id, job_id)`
2. Tổng lương theo từng `job_id` (trên toàn công ty)
3. Tổng cộng toàn công ty `()`
Đồng thời hiển thị cột `LEVEL_TYPE` ghi rõ `'Detail'`, `'Job Subtotal'`, hoặc `'Grand Total'` dựa trên hàm `GROUPING_ID(dept_id, job_id)`.

<details>
<summary><b>💡 Xem Lời Giải & Phân Tích</b></summary>

```sql
SELECT dept_id,
       job_id,
       GROUPING_ID(dept_id, job_id) AS gid,
        DECODE(GROUPING_ID(dept_id, job_id),
              0, 'Detail (Dept & Job)',
              2, 'Job Subtotal',
              3, 'Grand Total') AS level_type,
       SUM(salary) AS total_sal
FROM emp_summary
GROUP BY GROUPING SETS (
    (dept_id, job_id),
    (job_id),
    ()
)
ORDER BY gid, dept_id, job_id;
```
* **Giải thích:**
  * Tại cấp `(dept_id, job_id)`: cả 2 cột đều tham gia gom nhóm $\implies$ nhị phân `00` $\implies$ `GROUPING_ID = 0`.
  * Tại cấp `(job_id)`: cột `dept_id` được tổng hợp (`1`), cột `job_id` giữ nguyên (`0`) $\implies$ nhị phân `10` $\implies$ `GROUPING_ID = 2`.
  * Tại cấp `()`: cả 2 cột đều được tổng hợp $\implies$ nhị phân `11` $\implies$ `GROUPING_ID = 3`.
</details>

---

### Bài tập 2: Nối danh sách nhân viên không trùng lặp chức danh bằng `LISTAGG`
**Đề bài:** Viết câu truy vấn hiển thị cho mỗi `dept_id`:
1. Danh sách tất cả nhân viên kèm mức lương theo định dạng `'Alice(10000) -> Bob(6000)'` sắp xếp theo lương giảm dần.
2. Danh sách các mã công việc (`job_id`) **không trùng lặp** trong phòng ban đó, ngăn cách bởi dấu `'; '`, sắp xếp theo thứ tự bảng chữ cái.

<details>
<summary><b>💡 Xem Lời Giải & Phân Tích</b></summary>

```sql
SELECT dept_id,
       LISTAGG(first_name || '(' || salary || ')', ' -> ')
           WITHIN GROUP (ORDER BY salary DESC, first_name ASC) AS emp_sal_chain,
       LISTAGG(DISTINCT job_id, '; ')
           WITHIN GROUP (ORDER BY job_id ASC) AS unique_jobs
FROM emp_summary
WHERE dept_id IS NOT NULL
GROUP BY dept_id
ORDER BY dept_id;
```
* **Giải thích:** Tính năng `LISTAGG(DISTINCT expr, delimiter) WITHIN GROUP (ORDER BY ...)` giúp loại bỏ các `job_id` trùng nhau ngay bên trong hàm nối chuỗi mà không cần phải dùng Subquery khử trùng trước.
</details>

---

## 8. Tổng Hợp Bẫy Thi OCA/OCP Cốt Lõi Cần Nhớ (Exam Essentials)

| Chủ đề | Điểm mấu chốt / Bẫy thi thường gặp trong đề OCA & OCP |
| :--- | :--- |
| **Số cấp của `ROLLUP` vs `CUBE`** | Với $N$ cột: `ROLLUP(c1..cN)` tạo ra **$N + 1$ cấp** (bỏ dần từ phải sang trái). `CUBE(c1..cN)` tạo ra **$2^N$ cấp** (mọi tổ hợp có thể). |
| **Partial Rollup / Cube** | `GROUP BY a, ROLLUP(b, c)`: cột `a` luôn xuất hiện ở mọi dòng $\implies$ chỉ có $2 + 1 = 3$ cấp: `(a,b,c)`, `(a,b)`, `(a)` — **không có dòng Grand Total `()`**! |
| **Composite Columns `(a, b)`** | `ROLLUP(a, (b, c))` coi `(b, c)` là 1 cột ghép duy nhất $\implies$ chỉ có $2 + 1 = 3$ cấp: `(a, b, c)`, `(a)`, và `()` (không bao giờ tách lẻ `b` khỏi `c`). |
| **`GROUPING SETS (a, b)` vs `((a, b))`** | `GROUPING SETS (a, b)` tạo 2 cấp riêng: `(a)` và `(b)`. Còn `GROUPING SETS ((a, b))` chỉ tạo 1 cấp kết hợp: `GROUP BY a, b`. |
| **`GROUPING(col)`** | Nhận **1 cột duy nhất**. Trả về **`1`** nếu dòng đó là dòng tổng hợp (Super-aggregate `NULL`), trả về **`0`** nếu là dòng chi tiết (kể cả khi dữ liệu gốc trong bảng là `NULL`). |
| **`GROUPING_ID(c1, c2, ...)`** | Nhận **nhiều cột**, ghép các bit `GROUPING(c1)...GROUPING(cN)` thành số nhị phân rồi đổi sang **số nguyên hệ thập phân** (ví dụ `10` nhị phân $\implies 2$, `11` nhị phân $\implies 3$). |
| **`LISTAGG`** | Bắt buộc có `WITHIN GROUP (ORDER BY ...)`. Tự động bỏ qua `NULL`. Quá 4000 bytes báo lỗi `ORA-01489` trừ khi dùng `ON OVERFLOW TRUNCATE '...' WITH COUNT`. |
| **`PIVOT` và `UNPIVOT`** | `PIVOT` tự động `GROUP BY` mọi cột thừa không nằm trong `PIVOT(...)`, và danh sách `IN (...)` phải cố định (trừ `PIVOT XML`). `UNPIVOT` mặc định là **`EXCLUDE NULLS`** (tự động xóa các dòng có giá trị `NULL`). |
