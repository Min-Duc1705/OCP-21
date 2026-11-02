# Chương 15: Hàm Phân Tích & Khung Cửa Sổ (Analytic / Window Functions)

> **Thuộc Phần II:** Oracle SQL Nâng Cao (Advanced Oracle SQL for Developers)  
> **Mục tiêu khảo thí:** Oracle Database SQL Certified Associate / Professional (1Z0-071 & 1Z0-047) & Tuyển dụng Kỹ sư CNTT (VNPT, Viettel, FPT, Ngân hàng)  
> **Trọng tâm:** Thứ tự thực thi của Analytic Functions, Cấu trúc mệnh đề `OVER (...)`, Nhóm hàm xếp hạng (`ROW_NUMBER`, `RANK`, `DENSE_RANK`, `NTILE`, `PERCENT_RANK`, `CUME_DIST`), Nhóm hàm dịch chuyển (`LAG`, `LEAD`), Nhóm hàm biên cửa sổ (`FIRST_VALUE`, `LAST_VALUE`, `NTH_VALUE`), Tổng lũy kế / Trung bình trượt và Window Frame chuyên sâu (`ROWS` vs `RANGE`).

---

## 📑 Mục Lục Chi Tiết

1. [Cơ Chế Hoạt Động & Kiến Trúc Của Analytic Functions](#1-cơ-chế-hoạt-động--kiến-trúc-của-analytic-functions)
2. [Nhóm Hàm Xếp Hạng (Ranking Functions)](#2-nhóm-hàm-xếp-hạng-ranking-functions)
3. [Nhóm Hàm Dịch Chuyển Dòng (`LAG` & `LEAD`)](#3-nhóm-hàm-dịch-chuyển-dòng-lag--lead)
4. [Nhóm Hàm Đầu / Cuối Khung Cửa Sổ (`FIRST_VALUE`, `LAST_VALUE`, `NTH_VALUE`)](#4-nhóm-hàm-đầu--cuối-khung-cửa-sổ-first_value-last_value-nth_value)
5. [Khung Cửa Sổ Chuyên Sâu (`ROWS` vs `RANGE`) & Tổng Lũy Kế / Trung Bình Trượt](#5-khung-cửa-sổ-chuyên-sâu-rows-vs-range--tổng-lũy-kế--trung-bình-trượt)
6. [Bài Tập Thực Hành Tự Luyện (Kèm Lời Giải Chi Tiết)](#6-bài-tập-thực-hành-tự-luyện-kèm-lời-giải-chi-tiết)
7. [Tổng Hợp Bẫy Thi OCA/OCP Cốt Lõi Cần Nhớ (Exam Essentials)](#7-tổng-hợp-bẫy-thi-ocaocp-cốt-lõi-cần-nhớ-exam-essentials)

---

## 🗂️ Dữ Liệu Mẫu Xuyên Suốt Chương

Để minh họa trực quan và chính xác từng con số đầu ra, toàn bộ các ví dụ trong chương này sử dụng bảng `EMP_SALES` gồm 7 nhân viên thuộc 2 phòng ban (`10` và `20`):

| EMP_ID | FIRST_NAME | DEPT_ID | HIRE_DATE | SALARY |
| :--- | :--- | :--- | :--- | :--- |
| 101 | Alice | 10 | 2023-01-10 | 5000 |
| 102 | Bob | 10 | 2023-03-15 | 7000 |
| 103 | Charlie | 10 | 2023-05-20 | 7000 |
| 104 | David | 10 | 2023-08-01 | 9000 |
| 201 | Eva | 20 | 2023-02-01 | 6000 |
| 202 | Frank | 20 | 2023-06-10 | 8000 |
| 203 | Grace | 20 | 2023-09-25 | 8000 |

---

## 1. Cơ Chế Hoạt Động & Kiến Trúc Của Analytic Functions

### 1.1. Sự khác biệt giữa Aggregate Functions (`GROUP BY`) và Analytic Functions (`OVER`)
* **Aggregate Functions (`SUM`, `AVG`, `COUNT` với `GROUP BY`):** Gom nhiều dòng chi tiết lại thành **1 dòng tổng hợp duy nhất** cho mỗi nhóm, làm mất đi thông tin chi tiết của từng dòng ban đầu.
* **Analytic Functions (Hàm phân tích / Window Functions):** Tính toán giá trị tổng hợp, xếp hạng hoặc thống kê trên một nhóm dòng (gọi là một **Window / Partition**), nhưng **GIỮ NGUYÊN toàn bộ các dòng chi tiết ban đầu**! Nhờ đó, bạn có thể hiển thị lương của từng nhân viên đứng cạnh lương trung bình của cả phòng ban ngay trên cùng một dòng mà không cần phải Self-Join.

### 1.2. Thứ tự thực thi trong câu lệnh `SELECT` (Logical Query Processing Order)
Đây là kiến thức nền tảng quyết định rất nhiều câu hỏi bẫy trong đề thi OCA/OCP:

```mermaid
flowchart LR
    A["1. FROM / JOIN"] --> B["2. WHERE"]
    B --> C["3. GROUP BY"]
    C --> D["4. HAVING"]
    D --> E["5. ANALYTIC FUNCTIONS (OVER)"]
    E --> F["6. SELECT / DISTINCT"]
    F --> G["7. ORDER BY"]
    G --> H["8. OFFSET / FETCH"]
```

> [!WARNING]
> **Bẫy thi số 1 về Vị trí xuất hiện của Analytic Functions:**
> Vì Analytic Functions được tính toán ở **Bước 5** (sau khi `WHERE`, `GROUP BY`, và `HAVING` đã chạy xong), nên:
> - Hàm phân tích **CHỈ ĐƯỢC PHÉP xuất hiện ở mệnh đề `SELECT` và mệnh đề `ORDER BY`**!
> - Tuyệt đối **KHÔNG ĐƯỢC PHÉP** đặt hàm phân tích trong mệnh đề `WHERE`, `GROUP BY`, hoặc `HAVING`. Nếu vi phạm, Oracle sẽ báo lỗi **`ORA-30483: window functions are not allowed here`**.
> - Muốn lọc kết quả dựa trên giá trị của một hàm phân tích (ví dụ: lấy người có `ROW_NUMBER() = 1`), bạn **bắt buộc phải bọc câu truy vấn trong một CTE (`WITH`) hoặc một Inline View (`FROM (...)`)**, rồi mới lọc ở mệnh đề `WHERE` của truy vấn cha!

### 1.3. Giải phẫu mệnh đề `OVER (...)`
Mọi hàm phân tích đều được nhận diện bởi từ khóa **`OVER`** đi kèm theo 3 mệnh đề thành phần (cả 3 đều là tùy chọn tùy theo loại hàm):

```sql
analytic_function([arguments]) OVER (
    [PARTITION BY expr1, expr2, ...]
    [ORDER BY expr3 [ASC|DESC] [NULLS FIRST|NULLS LAST]]
    [ROWS | RANGE BETWEEN start_point AND end_point]
)
```

1. **`PARTITION BY` (Phân vùng dữ liệu):** Chia tập kết quả thành các nhóm độc lập (tương tự `GROUP BY` nhưng không gộp dòng). Hàm phân tích sẽ tính toán lại từ đầu (reset) khi bước sang một `PARTITION` mới. Nếu bỏ qua `PARTITION BY`, toàn bộ tập kết quả của truy vấn được coi là **1 phân vùng duy nhất**.
2. **`ORDER BY` (Sắp xếp trong phân vùng):** Quy định thứ tự các dòng bên trong mỗi `PARTITION`.
   * Bắt buộc phải có đối với các hàm xếp hạng (`ROW_NUMBER`, `RANK`, `DENSE_RANK`, `NTILE`, `LAG`, `LEAD`).
   * Với các hàm tổng hợp phân tích (`SUM`, `AVG`, `COUNT`, `MIN`, `MAX`, `FIRST_VALUE`, `LAST_VALUE`), việc thêm `ORDER BY` vào trong `OVER(...)` sẽ **kích hoạt khung cửa sổ mặc định chạy lũy kế từ đầu phân vùng đến dòng hiện tại** (`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`)!
3. **Windowing Clause (`ROWS | RANGE BETWEEN ...`):** Xác định khung cửa sổ trượt động (sliding window) gồm những dòng nào xung quanh dòng hiện tại sẽ được đưa vào tính toán.

---

## 2. Nhóm Hàm Xếp Hạng (Ranking Functions)

### 2.1. Bộ tứ xếp hạng cốt lõi: `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `NTILE(n)`

| Hàm phân tích | Cơ chế xử lý khi gặp các dòng đồng hạng (Ties / Cùng giá trị `ORDER BY`) | Ví dụ với dãy lương: `9000, 7000, 7000, 5000` |
| :--- | :--- | :--- |
| **`ROW_NUMBER()`** | Đánh số thứ tự tăng dần duy nhất (`1, 2, 3, 4...`). **Không bao giờ trùng số**, kể cả khi 2 dòng có cùng mức lương (thứ tự giữa 2 dòng trùng lương là không xác định nếu không có cột sắp xếp phụ). | `1, 2, 3, 4` |
| **`RANK()`** | Xếp hạng kiểu thể thao Olympic: các dòng bằng nhau nhận **cùng thứ hạng**, và thứ hạng tiếp theo sẽ **bị nhảy cóc (leave gaps)** bằng đúng số lượng dòng đồng hạng đứng trước. | `1, 2, 2, 4` *(mất hạng 3!)* |
| **`DENSE_RANK()`** | Xếp hạng đặc (liên tục): các dòng bằng nhau nhận **cùng thứ hạng**, nhưng thứ hạng tiếp theo **tăng liên tiếp thêm 1, KHÔNG nhảy cóc (no gaps)**. | `1, 2, 2, 3` |
| **`NTILE(n)`** | Chia các dòng trong mỗi phân vùng thành **`n` nhóm (buckets)** có kích thước xấp xỉ bằng nhau và gán số hiệu nhóm từ `1` đến `n`. Nếu số dòng không chia hết cho `n` (dư $r$ dòng), thì **$r$ nhóm đầu tiên** (từ bucket 1 đến bucket $r$) mỗi nhóm sẽ được **cộng thêm 1 dòng**. | Với 4 dòng chia `NTILE(3)`: dư $1$ dòng $\rightarrow$ Bucket 1 có 2 dòng, Bucket 2 và 3 có 1 dòng: `1, 1, 2, 3` |

### 2.2. Nhóm hàm xếp hạng tương đối: `PERCENT_RANK()` và `CUME_DIST()`
Hai hàm này luôn trả về một số thực trong đoạn $[0, 1]$:
1. **`PERCENT_RANK()` (Thứ hạng phần trăm tương đối):**
   $$\text{PERCENT\_RANK} = \frac{\text{RANK}() - 1}{\text{Tổng số dòng trong Partition} - 1}$$
   * Dòng có `RANK() = 1` **luôn luôn có `PERCENT_RANK() = 0`**. (Nếu Partition chỉ có 1 dòng thì trả về `0`).
2. **`CUME_DIST()` (Phân phối tích lũy - Cumulative Distribution):**
   $$\text{CUME\_DIST} = \frac{\text{Số dòng có giá trị } \le \text{ giá trị dòng hiện tại (theo thứ tự ORDER BY)}}{\text{Tổng số dòng trong Partition}}$$
   * Giá trị `CUME_DIST()` luôn $> 0$ và dòng cuối cùng luôn bằng $1$.

### 2.3. Ví dụ tổng hợp 6 hàm xếp hạng trên phòng ban 10 (`DEPT_ID = 10` có 4 nhân viên)

```sql
SELECT first_name,
       salary,
       ROW_NUMBER()   OVER (ORDER BY salary DESC) AS row_num,
       RANK()         OVER (ORDER BY salary DESC) AS rnk,
       DENSE_RANK()   OVER (ORDER BY salary DESC) AS dense_rnk,
       NTILE(3)       OVER (ORDER BY salary DESC) AS tile_3,
       ROUND(PERCENT_RANK() OVER (ORDER BY salary DESC), 2) AS pct_rnk,
       ROUND(CUME_DIST()    OVER (ORDER BY salary DESC), 2) AS cume_dst
FROM emp_sales
WHERE dept_id = 10;
```

**Kết quả đầu ra:**

| FIRST_NAME | SALARY | ROW_NUM | RNK | DENSE_RNK | TILE_3 | PCT_RNK | CUME_DST |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| David | 9000 | 1 | 1 | 1 | 1 | 0.00 | 0.25 |
| Bob | 7000 | 2 | 2 | 2 | 1 | 0.33 | 0.75 |
| Charlie | 7000 | 3 | 2 | 2 | 2 | 0.33 | 0.75 |
| Alice | 5000 | 4 | 4 | 3 | 3 | 1.00 | 1.00 |

* **Giải thích chi tiết cho dòng `Bob` và `Charlie` (`salary = 7000`):**
  * `RNK = 2`: Cả hai đồng hạng 2.
  * `PCT_RNK`: $(2 - 1) / (4 - 1) = 1 / 3 \approx 0.33$.
  * `CUME_DST`: Có 3 dòng (`David: 9000`, `Bob: 7000`, `Charlie: 7000`) có mức lương từ `9000` xuống `7000` (tức $\le$ vị trí của `7000` theo chiều `DESC`), chia cho tổng số $4$ dòng $\rightarrow 3 / 4 = 0.75$.

### 2.4. Hàm `KEEP (DENSE_RANK FIRST / LAST ORDER BY ...)` đặc trưng của Oracle
Khi bạn muốn trả lời câu hỏi: *"Trong mỗi phòng ban, nhân viên có ngày vào làm sớm nhất (`HIRE_DATE` nhỏ nhất) đang hưởng mức lương bao nhiêu?"*, thay vì dùng subquery phức tạp, Oracle cung cấp mệnh đề `KEEP`:

```sql
SELECT dept_id,
       MIN(salary) KEEP (DENSE_RANK FIRST ORDER BY hire_date ASC) AS sal_of_oldest_emp,
       MAX(salary) KEEP (DENSE_RANK LAST  ORDER BY hire_date ASC) AS sal_of_newest_emp
FROM emp_sales
GROUP BY dept_id;
```
* **Cơ chế:** Oracle lọc ra những dòng có `DENSE_RANK = 1` theo chiều `ORDER BY hire_date ASC` (`FIRST`) hoặc ngược lại (`LAST`), sau đó nếu có nhiều dòng cùng ngày `hire_date` thì áp dụng hàm tổng hợp `MIN(salary)` hoặc `MAX(salary)` bên ngoài để phá thế đồng hạng (tie-breaker). Hàm này dùng được cả với `GROUP BY` và với `OVER (PARTITION BY ...)`.

---

## 3. Nhóm Hàm Dịch Chuyển Dòng (`LAG` & `LEAD`)

### 3.1. Cú pháp và ý nghĩa
Trong báo cáo phân tích chuỗi thời gian (Time-Series Analysis), ta thường xuyên phải so sánh doanh thu/lương của dòng hiện tại với **dòng liền trước (`LAG`)** hoặc **dòng liền sau (`LEAD`)** mà không cần phải Self-Join bảng.

```sql
LAG  (expr [, offset [, default_value]]) [IGNORE NULLS | RESPECT NULLS] OVER ([PARTITION BY ...] ORDER BY ...)
LEAD (expr [, offset [, default_value]]) [IGNORE NULLS | RESPECT NULLS] OVER ([PARTITION BY ...] ORDER BY ...)
```

* **`expr`:** Cột hoặc biểu thức cần lấy giá trị từ dòng trước (`LAG`) hoặc dòng sau (`LEAD`).
* **`offset`:** Khoảng cách số dòng cần nhảy (số nguyên dương, **mặc định là `1`** nếu bỏ qua).
* **`default_value`:** Giá trị trả về khi bước nhảy vượt ra ngoài biên của Partition (ví dụ dòng đầu tiên gọi `LAG` hoặc dòng cuối cùng gọi `LEAD`). Nếu bỏ qua, **mặc định trả về `NULL`** (phải cùng kiểu dữ liệu hoặc ép kiểu tương thích với `expr`).
* **`IGNORE NULLS` vs `RESPECT NULLS` (mặc định):** Nếu dùng `LAG(commission_pct IGNORE NULLS, 1) OVER (...)`, khi dòng liền trước có `commission_pct` là `NULL`, Oracle sẽ tự động lùi tiếp về các dòng trước đó nữa cho đến khi tìm được giá trị khác `NULL`!

### 3.2. Ví dụ thực tế: So sánh lương nhân viên với người vào làm liền trước và liền sau trong cùng phòng ban

```sql
SELECT dept_id,
       first_name,
       hire_date,
       salary,
       LAG(salary, 1, 0)  OVER (PARTITION BY dept_id ORDER BY hire_date) AS prev_emp_sal,
       LEAD(salary, 1, 0) OVER (PARTITION BY dept_id ORDER BY hire_date) AS next_emp_sal,
       salary - LAG(salary, 1, salary) OVER (PARTITION BY dept_id ORDER BY hire_date) AS diff_from_prev
FROM emp_sales
ORDER BY dept_id, hire_date;
```

**Kết quả đầu ra:**

| DEPT_ID | FIRST_NAME | HIRE_DATE | SALARY | PREV_EMP_SAL | NEXT_EMP_SAL | DIFF_FROM_PREV |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 10 | Alice | 2023-01-10 | 5000 | **0** | 7000 | 0 |
| 10 | Bob | 2023-03-15 | 7000 | 5000 | 7000 | 2000 |
| 10 | Charlie | 2023-05-20 | 7000 | 7000 | 9000 | 0 |
| 10 | David | 2023-08-01 | 9000 | 7000 | **0** | 2000 |
| 20 | Eva | 2023-02-01 | 6000 | **0** | 8000 | 0 |
| 20 | Frank | 2023-06-10 | 8000 | 6000 | 8000 | 2000 |
| 20 | Grace | 2023-09-25 | 8000 | 8000 | **0** | 0 |

*(Chú ý: Tại dòng của `Eva` thuộc phòng `20`, nhờ có `PARTITION BY dept_id`, hàm `LAG` không lấy lương `9000` của `David` ở phòng `10` mà trả về giá trị mặc định `0`!).*

---

## 4. Nhóm Hàm Đầu / Cuối Khung Cửa Sổ (`FIRST_VALUE`, `LAST_VALUE`, `NTH_VALUE`)

### 4.1. Cú pháp của `FIRST_VALUE`, `LAST_VALUE`, và `NTH_VALUE`
Ba hàm này dùng để trích xuất giá trị của một cột tại vị trí **đầu tiên**, **cuối cùng**, hoặc **thứ `N`** bên trong **Khung cửa sổ hiện hành (Window Frame)**:
* `FIRST_VALUE(expr) [IGNORE NULLS | RESPECT NULLS] OVER (...)`
* `LAST_VALUE(expr)  [IGNORE NULLS | RESPECT NULLS] OVER (...)`
* `NTH_VALUE(expr, n) [FROM FIRST | FROM LAST] [IGNORE NULLS | RESPECT NULLS] OVER (...)`

### 4.2. BẪY KINH ĐIỂN NHẤT TRONG ĐỀ THI OCP: Khung cửa sổ mặc định của `LAST_VALUE` và `NTH_VALUE`!

> [!CAUTION]
> **Bẫy tử thần với `LAST_VALUE()` khi có `ORDER BY` trong `OVER(...)`:**
> Khi bạn viết `OVER (PARTITION BY dept_id ORDER BY salary)` mà **KHÔNG khai báo tường minh mệnh đề `ROWS/RANGE BETWEEN`**, Oracle tự động áp dụng khung cửa sổ mặc định là:
> **`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`** *(Từ dòng đầu tiên của Partition cho đến **DÒNG HIỆN TẠI**)*!
>
> Hệ quả là:
> - Với `FIRST_VALUE(first_name)`: Đỉnh đầu của khung luôn là dòng số 1 của Partition $\rightarrow$ chạy **ĐÚNG** như kỳ vọng!
> - Với `LAST_VALUE(first_name)`: Đáy cuối của khung mặc định chính là **`CURRENT ROW` (dòng hiện tại)**! Do đó, `LAST_VALUE(first_name) OVER (PARTITION BY dept_id ORDER BY salary)` sẽ chỉ trả về tên của **chính nhân viên ở dòng hiện tại** (trừ khi có đồng hạng), chứ **KHÔNG PHẢI** người có lương cao nhất ở cuối phòng ban!

#### Minh họa trực tiếp sự khác biệt giữa `LAST_VALUE` bị bẫy mặc định và `LAST_VALUE` chuẩn:

```sql
SELECT first_name,
       salary,
       FIRST_VALUE(first_name) OVER (
           PARTITION BY dept_id ORDER BY salary ASC
       ) AS lowest_paid_emp,
       -- ❌ SAI: Bị dính khung mặc định RANGE ... AND CURRENT ROW
       LAST_VALUE(first_name) OVER (
           PARTITION BY dept_id ORDER BY salary ASC
       ) AS wrong_last_val,
       -- ✅ ĐÚNG: Mở rộng khung cửa sổ tới dòng cuối cùng của Partition
       LAST_VALUE(first_name) OVER (
           PARTITION BY dept_id ORDER BY salary ASC
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS correct_last_val
FROM emp_sales
WHERE dept_id = 10;
```

**Kết quả đầu ra:**

| FIRST_NAME | SALARY | LOWEST_PAID_EMP | WRONG_LAST_VAL (Bẫy!) | CORRECT_LAST_VAL (Đúng!) |
| :--- | :--- | :--- | :--- | :--- |
| Alice | 5000 | Alice | **Alice** | **David** |
| Bob | 7000 | Alice | **Charlie** *(do RANGE gộp cả 2 dòng 7000)* | **David** |
| Charlie | 7000 | Alice | **Charlie** | **David** |
| David | 9000 | Alice | **David** | **David** |

> [!TIP]
> **Quy tắc vàng:** Mỗi khi sử dụng `LAST_VALUE()` hoặc `NTH_VALUE()` để lấy phần tử cuối cùng / thứ $N$ của toàn bộ Partition, bạn **BẮT BUỘC** phải viết tường minh:
> `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` (hoặc dùng `FIRST_VALUE` nhưng đảo ngược chiều `ORDER BY ... DESC`).

---

## 5. Khung Cửa Sổ Chuyên Sâu (`ROWS` vs `RANGE`) & Tổng Lũy Kế / Trung Bình Trượt

### 5.1. Các mốc xác định biên của Khung cửa sổ (Window Frame Bounds)
Một khung cửa sổ được định nghĩa theo cú pháp:
`{ ROWS | RANGE } BETWEEN <start_bound> AND <end_bound>`

Các mốc `<start_bound>` và `<end_bound>` hợp lệ:
* **`UNBOUNDED PRECEDING`:** Bắt đầu từ dòng đầu tiên của Partition (chỉ dùng cho `<start_bound>`).
* **`n PRECEDING`:** Lùi về phía trước $n$ dòng (với `ROWS`) hoặc lùi đi một khoảng giá trị bằng $n$ (với `RANGE`).
* **`CURRENT ROW`:** Tại vị trí dòng hiện tại.
* **`n FOLLOWING`:** Tiến về phía sau $n$ dòng (với `ROWS`) hoặc cộng thêm một khoảng giá trị bằng $n$ (với `RANGE`).
* **`UNBOUNDED FOLLOWING`:** Kéo dài đến tận dòng cuối cùng của Partition (chỉ dùng cho `<end_bound>`).

**Hai trạng thái mặc định cực kỳ quan trọng cần nhớ:**
1. Nếu trong `OVER(...)` **KHÔNG CÓ `ORDER BY`**: Khung cửa sổ bao trùm **toàn bộ Partition** (`RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`). Ví dụ: `SUM(salary) OVER (PARTITION BY dept_id)` trả về tổng lương của cả phòng ban.
2. Nếu trong `OVER(...)` **CÓ `ORDER BY`** nhưng **không viết `ROWS/RANGE`**: Khung cửa sổ mặc định là **`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`** (Tính lũy kế từ đầu phân vùng đến giá trị của dòng hiện tại).

### 5.2. So sánh chuyên sâu: `ROWS` vs `RANGE` (Sự khác biệt chí mạng khi có dòng trùng giá trị `ORDER BY`)

| Tiêu chí | `ROWS BETWEEN ...` (Đếm dòng vật lý) | `RANGE BETWEEN ...` (Khoảng giá trị logic) |
| :--- | :--- | :--- |
| **Đơn vị đo lường** | Đếm chính xác **số lượng dòng vật lý (physical row offsets)** trước/sau dòng hiện tại. | Dựa trên **giá trị thực tế (logical value range)** của cột nằm trong mệnh đề `ORDER BY`. |
| **Hành vi tại `CURRENT ROW` khi có các dòng trùng giá trị (Duplicate Ties)** | Chỉ tính đến **đúng dòng vật lý hiện tại**. Hai dòng có cùng mức lương `7000` sẽ có tổng lũy kế khác nhau! | **Gộp tất cả các dòng đồng hạng (peers/ties) có cùng giá trị với dòng hiện tại vào chung khung cửa sổ!** Hai dòng có cùng mức lương `7000` sẽ nhận cùng một tổng lũy kế! |
| **Yêu cầu khi dùng `n PRECEDING` / `n FOLLOWING`** | Cột trong `ORDER BY` có thể thuộc **bất kỳ kiểu dữ liệu nào** (Số, Chuỗi `VARCHAR2`, Ngày tháng) và có thể sắp xếp theo **nhiều cột**. | Cột trong `ORDER BY` **bắt buộc chỉ được có 1 biểu thức duy nhất** và phải thuộc kiểu **Số (`NUMBER`)** hoặc **Ngày giờ (`DATE` / `TIMESTAMP`)**! |

#### Ví dụ chứng minh sự khác biệt giữa `ROWS` và `RANGE` khi tính Tổng Lũy Kế (Running Total):
Hãy nhìn vào phòng ban `10` có hai nhân viên `Bob` và `Charlie` cùng nhận mức lương `7000`:

```sql
SELECT first_name,
       salary,
       -- 1. Mặc định (tương đương RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
       SUM(salary) OVER (
           PARTITION BY dept_id ORDER BY salary ASC
       ) AS running_sum_range,
       -- 2. Dùng ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       SUM(salary) OVER (
           PARTITION BY dept_id ORDER BY salary ASC, emp_id ASC
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_sum_rows
FROM emp_sales
WHERE dept_id = 10;
```

**Kết quả đầu ra:**

| FIRST_NAME | SALARY | RUNNING_SUM_RANGE (Gộp dòng trùng!) | RUNNING_SUM_ROWS (Tách từng dòng!) |
| :--- | :--- | :--- | :--- |
| Alice | 5000 | 5000 | 5000 |
| **Bob** | **7000** | **19000** *(5000 + 7000 + 7000)* | **12000** *(5000 + 7000)* |
| **Charlie** | **7000** | **19000** *(5000 + 7000 + 7000)* | **19000** *(5000 + 7000 + 7000)* |
| David | 9000 | 28000 | 28000 |

> [!IMPORTANT]
> **Hãy quan sát dòng của `Bob` (`salary = 7000`) ở bảng trên:**
> - Với **`RANGE`** (cũng là hành vi **mặc định** khi chỉ viết `SUM(salary) OVER (ORDER BY salary)`): Vì cả `Bob` và `Charlie` đều có `salary = 7000`, `RANGE ... AND CURRENT ROW` lấy mọi dòng có `salary <= 7000`, nên ngay tại dòng của `Bob`, tổng lũy kế đã cộng gộp cả lương của `Charlie` ($5000 + 7000 + 7000 = 19000$)!
> - Với **`ROWS`**: Chỉ cộng đúng từng dòng vật lý từ trên xuống, nên tại `Bob` tổng là $12000$, sang `Charlie` mới lên $19000$.

### 5.3. Tính Trung Bình Trượt (Moving Average) với `ROWS` và `RANGE`
1. **Trung bình trượt 3 dòng vật lý liên tiếp (dòng trước, dòng hiện tại, dòng sau):**
   ```sql
   SELECT first_name,
          hire_date,
          salary,
          ROUND(AVG(salary) OVER (
              PARTITION BY dept_id
              ORDER BY hire_date
              ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
          ), 2) AS moving_avg_3_rows
   FROM emp_sales
   WHERE dept_id = 10;
   ```
   * Tại `Alice` (dòng 1): chỉ có dòng 1 và dòng 2 $\rightarrow (5000 + 7000) / 2 = 6000$.
   * Tại `Bob` (dòng 2): trung bình của dòng 1, 2, 3 $\rightarrow (5000 + 7000 + 7000) / 3 = 6333.33$.

2. **Tổng lương của các nhân viên có mức lương chênh lệch trong khoảng $\pm 1500$ so với dòng hiện tại (Dùng `RANGE` trên cột `NUMBER`):**
   ```sql
   SELECT first_name,
          salary,
          SUM(salary) OVER (
              PARTITION BY dept_id
              ORDER BY salary
              RANGE BETWEEN 1500 PRECEDING AND 1500 FOLLOWING
          ) AS sal_within_1500_range
   FROM emp_sales
   WHERE dept_id = 10;
   ```
   * Tại `Alice` (`5000`): khoảng giá trị là $[3500, 6500]$ $\rightarrow$ chỉ có `Alice` ($5000$).
   * Tại `Bob` (`7000`): khoảng giá trị là $[5500, 8500]$ $\rightarrow$ có `Bob` và `Charlie` ($7000 + 7000 = 14000$).

3. **Dùng `RANGE` trên cột `DATE` kết hợp từ khóa `INTERVAL`:**
   ```sql
   -- Tính tổng lương của các nhân viên được tuyển trong vòng 90 ngày trước ngày tuyển của dòng hiện tại
   SELECT first_name,
          hire_date,
          salary,
          SUM(salary) OVER (
              ORDER BY hire_date
              RANGE BETWEEN INTERVAL '90' DAY PRECEDING AND CURRENT ROW
          ) AS sum_sal_90_days
   FROM emp_sales;
   ```

---

## 6. Bài Tập Thực Hành Tự Luyện (Kèm Lời Giải Chi Tiết)

### Bài tập 1: Tìm các nhân viên có lương nằm trong Top 2 mức lương cao nhất của từng phòng ban
**Đề bài:** Viết câu truy vấn lấy ra các nhân viên thuộc Top 2 mức lương cao nhất trong mỗi phòng ban (`dept_id`) từ bảng `EMP_SALES`. Nếu có nhiều người đồng hạng ở cùng một mức lương thì lấy tất cả những người đó, và mức lương cao thứ hai phải được tính tiếp ngay sau mức cao thứ nhất (không bị nhảy cóc hạng).

<details>
<summary><b>💡 Xem Lời Giải & Phân Tích</b></summary>

```sql
WITH ranked_emp AS (
    SELECT emp_id,
           first_name,
           dept_id,
           salary,
           DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS sal_dense_rnk
    FROM emp_sales
)
SELECT emp_id, first_name, dept_id, salary, sal_dense_rnk
FROM ranked_emp
WHERE sal_dense_rnk <= 2
ORDER BY dept_id, sal_dense_rnk, emp_id;
```
* **Giải thích:**
  1. Vì đề bài yêu cầu lấy "Top 2 **mức lương** cao nhất" và không bị nhảy cóc hạng khi có người trùng lương, ta phải dùng `DENSE_RANK()` thay vì `RANK()` hay `ROW_NUMBER()`.
  2. Vì không được đặt hàm phân tích trực tiếp trong `WHERE`, ta đặt `DENSE_RANK()` bên trong CTE `ranked_emp` rồi lọc `WHERE sal_dense_rnk <= 2` ở truy vấn ngoài.
</details>

---

### Bài tập 2: Tính tỷ trọng phần trăm lương và chênh lệch so với người lương cao nhất phòng
**Đề bài:** Trên bảng `EMP_SALES`, hãy viết một câu truy vấn hiển thị cho mỗi nhân viên:
1. Tỷ lệ phần trăm lương của nhân viên đó so với tổng quỹ lương của phòng ban mình (làm tròn 2 chữ số thập phân, gợi ý: có thể dùng `SUM` hoặc hàm `RATIO_TO_REPORT`).
2. Khoảng chênh lệch giữa lương của nhân viên đó với mức lương cao nhất trong phòng ban của họ, sử dụng hàm `LAST_VALUE`.

<details>
<summary><b>💡 Xem Lời Giải & Phân Tích</b></summary>

```sql
SELECT dept_id,
       first_name,
       salary,
       -- Cách 1: Dùng hàm chuyên dụng RATIO_TO_REPORT(salary) OVER (PARTITION BY dept_id)
       ROUND(RATIO_TO_REPORT(salary) OVER (PARTITION BY dept_id) * 100, 2) AS pct_of_dept_sal,
       -- Chênh lệch so với người lương cao nhất phòng (dùng LAST_VALUE có mở full khung cửa sổ)
       LAST_VALUE(salary) OVER (
           PARTITION BY dept_id
           ORDER BY salary ASC
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) - salary AS diff_from_max_sal
FROM emp_sales
ORDER BY dept_id, salary DESC;
```
* **Giải thích:**
  * Hàm `RATIO_TO_REPORT(expr) OVER (PARTITION BY ...)` là hàm phân tích dựng sẵn của Oracle tương đương với `expr / SUM(expr) OVER (PARTITION BY ...)` (không cho phép có `ORDER BY` bên trong `OVER` của `RATIO_TO_REPORT`).
  * Khi dùng `LAST_VALUE(salary)` với `ORDER BY salary ASC`, bắt buộc phải có `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` để lấy đúng mức lương cao nhất ở cuối phân vùng.
</details>

---

## 7. Tổng Hợp Bẫy Thi OCA/OCP Cốt Lõi Cần Nhớ (Exam Essentials)

| Chủ đề | Điểm mấu chốt / Bẫy thi thường gặp trong đề OCA & OCP |
| :--- | :--- |
| **Vị trí hợp lệ của Analytic Function** | Chỉ được xuất hiện trong mệnh đề **`SELECT`** và **`ORDER BY`**. Đặt trong `WHERE`, `GROUP BY`, `HAVING` sẽ gây lỗi **`ORA-30483`**. |
| **`ROW_NUMBER` vs `RANK` vs `DENSE_RANK`** | Với dãy điểm `100, 90, 90, 80`: `ROW_NUMBER` $\rightarrow$ `1, 2, 3, 4`; `RANK` $\rightarrow$ `1, 2, 2, 4` (nhảy cóc mất 3); `DENSE_RANK` $\rightarrow$ `1, 2, 2, 3` (liên tiếp không nhảy cóc). |
| **Chia nhóm với `NTILE(n)`** | Nếu tổng số dòng $M$ chia cho $n$ dư $r$ ($r > 0$), thì **$r$ bucket đầu tiên** (từ bucket $1$ đến bucket $r$) sẽ có nhiều hơn các bucket sau **1 dòng**. |
| **`LAG` và `LEAD`** | Tham số: `LAG(col, offset, default)`. Mặc định `offset = 1`, `default = NULL`. Không hỗ trợ mệnh đề Window Frame (`ROWS/RANGE BETWEEN`). |
| **Bẫy `LAST_VALUE()`** | Nếu có `ORDER BY` trong `OVER(...)` mà quên viết Window Frame, khung mặc định là `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` $\rightarrow$ `LAST_VALUE` trả về giá trị của chính dòng hiện tại! Phải thêm `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`. |
| **Khung mặc định khi có vs không có `ORDER BY`** | - Không có `ORDER BY`: Toàn bộ Partition (`RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`).<br>- Có `ORDER BY`: Lũy kế từ đầu đến dòng hiện tại (`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`). |
| **`ROWS` vs `RANGE` khi trùng khóa `ORDER BY`** | `ROWS` tính đến đúng dòng vật lý hiện tại; `RANGE` gom tất cả các dòng có cùng giá trị `ORDER BY` với dòng hiện tại vào chung một bước tính lũy kế. |
| **Ràng buộc của `RANGE n PRECEDING`** | Chỉ cho phép sắp xếp theo **duy nhất 1 biểu thức** trong `ORDER BY`, và biểu thức đó bắt buộc phải có kiểu **Số (`NUMBER`)** hoặc **Ngày giờ (`DATE`/`TIMESTAMP`)**. |
