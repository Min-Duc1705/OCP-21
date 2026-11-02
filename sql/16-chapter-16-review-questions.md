# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 16: Tổng Hợp Dữ Liệu Nâng Cao (Advanced Aggregation)

> **Thuộc Phần II:** Oracle SQL Nâng Cao (Advanced Oracle SQL for Developers)  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle OCA/OCP & Tuyển dụng VNPT/Viettel/Ngân hàng.  
> **Cách học:** Hãy đọc kỹ đề bài và tự tính số cấp tổng hợp trước khi mở phần **"👉 Xem Đáp Án & Giải Thích Chi Tiết"**.

---

### Câu 1 (Question 1)
**Khi sử dụng mệnh đề `GROUP BY ROLLUP(region_id, country_id, department_id)` với 3 cột độc lập, Oracle sẽ tạo ra tổng cộng bao nhiêu cấp tổng hợp dữ liệu (grouping levels)?**

* A. 3 cấp tổng hợp.
* B. 4 cấp tổng hợp.
* C. 8 cấp tổng hợp.
* D. 6 cấp tổng hợp.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Công thức số cấp tổng hợp của `ROLLUP` với $N$ biểu thức đơn là **$N + 1$**. Với $N = 3$ (`region_id`, `country_id`, `department_id`), `ROLLUP` tạo ra $3 + 1 =$ **4 cấp tổng hợp** bằng cách bỏ dần từng cột từ phải sang trái:
    1. `(region_id, country_id, department_id)`
    2. `(region_id, country_id)`
    3. `(region_id)`
    4. `()` (Grand Total toàn bảng)
  * **A, C, D sai:** $8$ cấp ($2^3$) là số cấp của `CUBE(region_id, country_id, department_id)`.
</details>

---

### Câu 2 (Question 2)
**Khi sử dụng mệnh đề `GROUP BY CUBE(region_id, country_id, department_id)` với 3 cột độc lập, Oracle sẽ tạo ra tổng cộng bao nhiêu cấp tổng hợp dữ liệu?**

* A. 4 cấp tổng hợp.
* B. 6 cấp tổng hợp.
* C. 8 cấp tổng hợp.
* D. 9 cấp tổng hợp.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Công thức số cấp tổng hợp của `CUBE` với $N$ biểu thức độc lập là **$2^N$**. Với $N = 3$, số cấp tổng hợp là $2^3 =$ **8 cấp tổng hợp**:
    1. `(region_id, country_id, department_id)`
    2. `(region_id, country_id)`
    3. `(region_id, department_id)`
    4. `(country_id, department_id)`
    5. `(region_id)`
    6. `(country_id)`
    7. `(department_id)`
    8. `()` (Grand Total)
  * **A, B, D sai:** Sai công thức tổ hợp $2^N$ của `CUBE`.
</details>

---

### Câu 3 (Question 3)
**Cấp tổng hợp nào dưới đây ĐƯỢC TẠO RA bởi `GROUP BY CUBE(department_id, job_id)` nhưng KHÔNG ĐƯỢC TẠO RA bởi `GROUP BY ROLLUP(department_id, job_id)`?**

* A. Cấp chi tiết `(department_id, job_id)`.
* B. Cấp tiểu mục theo phòng ban `(department_id)`.
* C. Cấp tiểu mục theo công việc `(job_id)`.
* D. Cấp tổng cộng toàn bảng `()` (Grand Total).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:**
    * `ROLLUP(department_id, job_id)` bỏ dần cột từ phải sang trái nên chỉ tạo ra 3 cấp: `(department_id, job_id)`, `(department_id)`, và `()`. Hoàn toàn **không có cấp `(job_id)`**!
    * `CUBE(department_id, job_id)` tạo ra mọi tổ hợp $2^2 = 4$ cấp: `(department_id, job_id)`, `(department_id)`, **`(job_id)`**, và `()`.
  * **A, B, D sai:** Cả 3 cấp này đều có mặt trong cả `ROLLUP` lẫn `CUBE`.
</details>

---

### Câu 4 (Question 4)
**Xem xét mệnh đề Partial Rollup sau đây: `GROUP BY department_id, ROLLUP(job_id, manager_id)`. Các cấp tổng hợp nào sẽ được tạo ra bởi mệnh đề này?**

* A. `(department_id, job_id, manager_id)`, `(department_id, job_id)`, `(department_id)`, và `()`
* B. `(department_id, job_id, manager_id)`, `(department_id, job_id)`, và `(department_id)`
* C. `(department_id, job_id, manager_id)`, `(job_id, manager_id)`, `(job_id)`, và `()`
* D. `(department_id, job_id)` và `(department_id, manager_id)`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là một **Partial Rollup** vì cột `department_id` nằm bên ngoài `ROLLUP(...)`.
    * `ROLLUP(job_id, manager_id)` tạo ra 3 tổ hợp: `(job_id, manager_id)`, `(job_id)`, và `()`.
    * Ghép cột cố định `department_id` vào cả 3 tổ hợp trên, ta thu được **3 cấp tổng hợp**:
      1. `(department_id, job_id, manager_id)`
      2. `(department_id, job_id)`
      3. `(department_id)`
    * Đặc biệt chú ý: **KHÔNG CÓ dòng Grand Total `()` toàn công ty** vì `department_id` không nằm trong `ROLLUP`!
  * **A, C, D sai:** Đáp án A mắc bẫy thừa cấp Grand Total `()`.
</details>

---

### Câu 5 (Question 5)
**Xem xét câu lệnh sử dụng Composite Column (cột ghép đơn vị) bên trong `ROLLUP` như sau. Có bao nhiêu cấp tổng hợp được tạo ra và đó là những cấp nào?**

```sql
SELECT a, b, c, SUM(sales)
FROM sales_tab
GROUP BY ROLLUP(a, (b, c));
```

* A. 4 cấp: `(a, b, c)`, `(a, b)`, `(a)`, và `()`
* B. 3 cấp: `(a, b, c)`, `(a)`, và `()`
* C. 2 cấp: `(a, b, c)` và `()`
* D. 3 cấp: `(a, b, c)`, `(b, c)`, và `()`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi `(b, c)` được đặt trong cặp ngoặc đơn lồng bên trong `ROLLUP(a, (b, c))`, Oracle coi `(b, c)` là **1 cột ghép duy nhất (Composite Column)**. Vì vậy `ROLLUP` này chỉ có **2 đơn vị** là `a` và `(b, c)`, sinh ra $2 + 1 =$ **3 cấp tổng hợp** (bỏ dần từ phải sang trái):
    1. Giữ cả 2 đơn vị: `(a, b, c)`
    2. Bỏ đơn vị bên phải `(b, c)`: còn lại `(a)` *(không bao giờ tách lẻ `b` khỏi `c` nên không có cấp `(a, b)`!)*
    3. Bỏ nốt đơn vị `a`: còn lại `()` (Grand Total)
  * **A, C, D sai:** Đáp án A nhầm với `ROLLUP(a, b, c)` thông thường không có ngoặc ghép.
</details>

---

### Câu 6 (Question 6)
**Mệnh đề `GROUP BY GROUPING SETS (department_id, job_id)` (chú ý: không có ngoặc đơn lồng quanh `department_id, job_id`) tương đương với câu lệnh nào sau đây?**

* A. `SELECT department_id, job_id, SUM(salary) FROM employees GROUP BY department_id, job_id`
* B. Kết hợp `UNION ALL` của hai câu truy vấn: một câu `GROUP BY department_id` (với `job_id` là `NULL`) và một câu `GROUP BY job_id` (với `department_id` là `NULL`).
* C. `SELECT department_id, job_id, SUM(salary) FROM employees GROUP BY ROLLUP(department_id, job_id)`
* D. `SELECT department_id, job_id, SUM(salary) FROM employees GROUP BY CUBE(department_id, job_id)`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong `GROUPING SETS (department_id, job_id)`, dấu phẩy tách 2 phần tử riêng biệt tương đương với `GROUPING SETS ((department_id), (job_id))`. Do đó Oracle chỉ tính **2 cấp tổng hợp độc lập**:
    1. Tổng theo từng `department_id`
    2. Tổng theo từng `job_id`
    (Hoàn toàn không tính cấp kết hợp `(department_id, job_id)` và cũng không tính dòng Grand Total `()`!).
  * **A sai:** Muốn tương đương với `GROUP BY department_id, job_id` thì phải có **2 lớp ngoặc đơn**: `GROUP BY GROUPING SETS ((department_id, job_id))`.
  * **C, D sai:** `ROLLUP` có 3 cấp, `CUBE` có 4 cấp.
</details>

---

### Câu 7 (Question 7)
**Trong `GROUP BY GROUPING SETS (...)`, ký hiệu nào được sử dụng để yêu cầu Oracle tính thêm dòng Tổng cộng toàn bảng (Grand Total)?**

* A. `TOTAL`
* B. `NULL`
* C. `()` *(Cặp ngoặc đơn rỗng)*
* D. `ALL`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong `GROUPING SETS`, cặp ngoặc đơn rỗng **`()`** đại diện cho tập gom nhóm không có cột phân mảnh nào, tức là tính tổng cộng trên toàn bộ bảng (**Grand Total**). Ví dụ: `GROUP BY GROUPING SETS ((dept_id), (job_id), ())`.
  * **A, B, D sai:** Viết `NULL`, `ALL`, hay `TOTAL` vào `GROUPING SETS` sẽ gây lỗi cú pháp.
</details>

---

### Câu 8 (Question 8)
**Biểu thức `GROUP BY ROLLUP(a, b)` tương đương hoàn toàn 100% với biểu thức `GROUPING SETS` nào dưới đây?**

* A. `GROUP BY GROUPING SETS (a, b, ())`
* B. `GROUP BY GROUPING SETS ((a, b), (a), (b), ())`
* C. `GROUP BY GROUPING SETS ((a, b), (a), ())`
* D. `GROUP BY GROUPING SETS ((a, b), (b), ())`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** `ROLLUP(a, b)` bỏ dần cột từ phải sang trái nên tạo ra 3 cấp: `(a, b)`, `(a)`, và `()`. Viết dưới dạng `GROUPING SETS` chính là `GROUP BY GROUPING SETS ((a, b), (a), ())`.
  * **A sai:** `GROUPING SETS (a, b, ())` tạo ra `(a)`, `(b)`, và `()`, thiếu mất cấp chi tiết `(a, b)`.
  * **B sai:** Đây là biểu thức tương đương của `CUBE(a, b)`.
  * **D sai:** `ROLLUP(a, b)` giữ lại cột bên trái `(a)` chứ không giữ cột bên phải `(b)`.
</details>

---

### Câu 9 (Question 9)
**Hàm `GROUPING(column_name)` trả về giá trị `1` trong trường hợp nào sau đây?**

* A. Khi giá trị dữ liệu gốc của `column_name` được lưu trong bảng vật lý là `NULL`.
* B. Khi dòng hiện tại là một dòng chi tiết thông thường có giá trị khác `NULL`.
* C. Khi cột `column_name` được tổng hợp (không tham gia vào cấp gom nhóm của dòng hiện tại) và giá trị `NULL` hiển thị ở cột đó là một Super-aggregate `NULL` do `ROLLUP`, `CUBE`, hoặc `GROUPING SETS` sinh ra.
* D. Khi có từ 2 dòng trùng lặp trở lên trong cùng một nhóm.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Quy tắc nhớ nhanh hàm `GROUPING(col)`:
    * **`GROUPING(col) = 1`**: Cột `col` đã bị "cuốn/gộp" thành tổng (Super-aggregate row — giá trị `NULL` giả đại diện cho *Tất cả các giá trị của cột `col`*).
    * **`GROUPING(col) = 0`**: Cột `col` đang hiển thị giá trị nhóm thật sự của nó (kể cả khi giá trị gốc trong bảng của nhóm đó là `NULL`!).
  * **A, B, D sai:** Nếu dữ liệu gốc trong bảng là `NULL` (như nhân viên chưa được phân phòng ban), thì ở dòng chi tiết của nhóm đó `GROUPING(department_id)` vẫn trả về **`0`**!
</details>

---

### Câu 10 (Question 10)
**Xem xét câu truy vấn dưới đây. Tại dòng hiển thị Tổng tiểu mục (Subtotal) của từng phòng ban `department_id` (tức là gộp tất cả các `job_id` của phòng ban đó lại), giá trị của `GROUPING(department_id)`, `GROUPING(job_id)`, và `GROUPING_ID(department_id, job_id)` lần lượt là bao nhiêu?**

```sql
SELECT department_id,
       job_id,
       GROUPING(department_id) AS g_dept,
       GROUPING(job_id)        AS g_job,
       GROUPING_ID(department_id, job_id) AS gid,
       SUM(salary)
FROM employees
GROUP BY CUBE(department_id, job_id);
```

* A. `g_dept = 1`, `g_job = 0`, `gid = 2`
* B. `g_dept = 0`, `g_job = 1`, `gid = 1`
* C. `g_dept = 1`, `g_job = 1`, `gid = 3`
* D. `g_dept = 0`, `g_job = 0`, `gid = 0`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Tại dòng Subtotal của từng `department_id` (cấp gom nhóm `(department_id)`):
    * Cột `department_id` có mặt trong cấp gom nhóm $\implies$ `GROUPING(department_id) = 0`.
    * Cột `job_id` được gộp tổng (hiển thị Super-aggregate `NULL`) $\implies$ `GROUPING(job_id) = 1`.
    * Hàm `GROUPING_ID(department_id, job_id)` ghép hai bit thành vector nhị phân `01`, đổi sang hệ thập phân là **$0 \times 2^1 + 1 \times 2^0 = 1$**.
  * **A sai:** `1`, `0`, `2` (nhị phân `10`) là tại dòng Subtotal theo từng `job_id` (gộp tất cả các phòng ban).
  * **C sai:** `1`, `1`, `3` (nhị phân `11`) là tại dòng Grand Total `()`.
  * **D sai:** `0`, `0`, `0` (nhị phân `00`) là tại dòng chi tiết `(department_id, job_id)`.
</details>

---

### Câu 11 (Question 11)
**Trong một câu truy vấn có mệnh đề `GROUP BY CUBE(a, b, c)`, tại dòng Tổng cộng toàn bảng (Grand Total `()`), hàm `GROUPING_ID(a, b, c)` sẽ trả về giá trị số nguyên là bao nhiêu?**

* A. `3`
* B. `6`
* C. `7`
* D. `8`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Tại dòng Grand Total `()`, cả 3 cột `a`, `b`, `c` đều được tổng hợp nên:
    * `GROUPING(a) = 1`, `GROUPING(b) = 1`, `GROUPING(c) = 1`.
    * Vector nhị phân là `111`.
    * Đổi `111` từ hệ nhị phân sang hệ thập phân: $1 \times 2^2 + 1 \times 2^1 + 1 \times 2^0 = 4 + 2 + 1 =$ **`7`**.
  * **A, B, D sai:** Với $N$ cột truyền vào `GROUPING_ID`, giá trị lớn nhất tại dòng Grand Total luôn là $2^N - 1$ (với $N=3 \implies 2^3 - 1 = 7$).
</details>

---

### Câu 12 (Question 12)
**Xem xét câu truy vấn sử dụng `GROUP BY ROLLUP(a, b, c)`. Nếu bạn thêm mệnh đề lọc `HAVING GROUPING_ID(a, b, c) > 0` vào câu truy vấn này, những dòng nào sẽ được giữ lại trong kết quả cuối cùng?**

* A. Chỉ giữ lại các dòng chi tiết `(a, b, c)` và loại bỏ toàn bộ các dòng tổng hợp.
* B. Loại bỏ các dòng chi tiết `(a, b, c)` và chỉ giữ lại các dòng tổng hợp tiểu mục (Subtotals: `(a, b)`, `(a)`) cùng dòng tổng cộng (Grand Total: `()`).
* C. Chỉ giữ lại duy nhất dòng Grand Total `()`.
* D. Báo lỗi vì hàm `GROUPING_ID` không được phép xuất hiện trong mệnh đề `HAVING`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Các hàm `GROUPING()`, `GROUPING_ID()`, và `GROUP_ID()` hoàn toàn được phép sử dụng trong các mệnh đề `SELECT`, **`HAVING`**, và `ORDER BY`!
    * Tại dòng chi tiết `(a, b, c)`: vector nhị phân là `000` $\implies$ `GROUPING_ID(a, b, c) = 0`.
    * Tại mọi dòng Subtotal (`001 = 1`, `011 = 3`) và Grand Total (`111 = 7`): `GROUPING_ID` đều $> 0$.
    * Do đó điều kiện `HAVING GROUPING_ID(a, b, c) > 0` giúp lọc lấy **chỉ các dòng tổng hợp (Subtotals & Grand Total)** và loại bỏ các dòng chi tiết!
  * **A, C, D sai:** Đây là kỹ thuật cực kỳ phổ biến trong thực tế khi chỉ muốn xuất các dòng tổng hợp mà không cần dòng chi tiết.
</details>

---

### Câu 13 (Question 13)
**Khi bạn kết hợp hai mệnh đề gom nhóm trong cùng một `GROUP BY` (Concatenated Grouping Sets), ví dụ: `GROUP BY ROLLUP(a, b), ROLLUP(c, d)`, số lượng cấp tổng hợp được tạo ra sẽ được tính như thế nào?**

* A. Cộng số cấp của hai `ROLLUP`: $(2 + 1) + (2 + 1) = 6$ cấp tổng hợp.
* B. Nhân tích Đề-các số cấp của hai `ROLLUP`: $(2 + 1) \times (2 + 1) = 3 \times 3 = 9$ cấp tổng hợp.
* C. Luôn bằng $2^4 = 16$ cấp tổng hợp.
* D. Báo lỗi cú pháp vì trong một `GROUP BY` chỉ được phép có tối đa một từ khóa `ROLLUP`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi đặt nhiều `ROLLUP`, `CUBE`, hoặc `GROUPING SETS` cách nhau bởi dấu phẩy trong cùng một mệnh đề `GROUP BY` (**Concatenated Grouping Sets**), Oracle sẽ lấy **Tích Đề-các (Cartesian Product)** giữa các tập gom nhóm!
    * `ROLLUP(a, b)` tạo ra 3 cấp: `(a, b)`, `(a)`, `()`.
    * `ROLLUP(c, d)` tạo ra 3 cấp: `(c, d)`, `(c)`, `()`.
    * Ghép từng cấp của vế trái với từng cấp của vế phải tạo ra $3 \times 3 =$ **9 cấp tổng hợp**: `(a,b,c,d)`, `(a,b,c)`, `(a,b)`, `(a,c,d)`, `(a,c)`, `(a)`, `(c,d)`, `(c)`, và `()`.
  * **A, C, D sai:** Hãy nhớ: dấu phẩy `,` nằm **ngoài** các khối `ROLLUP(...) / GROUPING SETS(...)` là phép **nhân tổ hợp (Cartesian Product)**, còn dấu phẩy `,` nằm **bên trong** một `GROUPING SETS(...)` mới là phép **cộng (Union)** các cấp!
</details>

---

### Câu 14 (Question 14)
**Trong một câu truy vấn phức tạp như `GROUP BY a, ROLLUP(a, b)`, cấp tổng hợp `(a)` bị sinh ra lặp lại 2 lần (do `a` kết hợp với `(a)` và `a` kết hợp với `()`). Bạn nên thêm điều kiện nào vào mệnh đề `HAVING` để loại bỏ các dòng tổng hợp bị trùng lặp mà vẫn giữ lại bản ghi đầu tiên của mỗi cấp?**

* A. `HAVING GROUPING(a) = 0`
* B. `HAVING GROUPING_ID(a, b) = 0`
* C. `HAVING GROUP_ID() = 0`
* D. `HAVING COUNT(DISTINCT a) = 1`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Hàm `GROUP_ID()` (không nhận đối số) được thiết kế chuyên biệt để phát hiện và loại bỏ các cấp gom nhóm bị trùng lặp (duplicate grouping sets):
    * Bản xuất hiện đầu tiên của bất kỳ cấp gom nhóm nào luôn có `GROUP_ID() = 0`.
    * Nếu cấp gom nhóm đó bị sinh lặp lại lần thứ 2, 3..., các dòng bản sao sẽ có `GROUP_ID()` bằng `1`, `2`,...
    * Vì vậy, `HAVING GROUP_ID() = 0` sẽ loại bỏ sạch sẽ mọi dòng tổng hợp bị lặp thừa!
  * **A, B, D sai:** Không phân biệt được dòng gốc với dòng bản sao của cùng một cấp gom nhóm `(a)`.
</details>

---

### Câu 15 (Question 15)
**Xem xét câu lệnh sử dụng hàm `LISTAGG` dưới đây. Tại sao câu lệnh này lại báo lỗi cú pháp?**

```sql
SELECT department_id,
       LISTAGG(first_name, ', ') AS employee_names
FROM employees
GROUP BY department_id;
```

* A. Vì hàm `LISTAGG` bắt buộc phải đi kèm với mệnh đề `WITHIN GROUP (ORDER BY ...)`.
* B. Vì dấu phân cách `', '` không được phép có khoảng trắng.
* C. Vì hàm `LISTAGG` không được phép dùng chung với mệnh đề `GROUP BY`.
* D. Vì hàm `LISTAGG` chỉ nhận cột kiểu `NUMBER`, không nhận cột kiểu `VARCHAR2`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Trong Oracle SQL, hàm `LISTAGG` là một *Ordered-Set Aggregate Function*, nên mệnh đề **`WITHIN GROUP (ORDER BY ...)` là BẮT BUỘC** trong mọi trường hợp để xác định thứ tự ghép nối các phần tử chuỗi. Nếu thiếu `WITHIN GROUP (ORDER BY ...)`, Oracle sẽ báo lỗi `ORA-02000: missing WITHIN keyword`.
  * **B, C, D sai:** Nếu không muốn sắp xếp theo cột cụ thể nào, bạn vẫn phải viết tối thiểu là `LISTAGG(first_name, ', ') WITHIN GROUP (ORDER BY NULL)`.
</details>

---

### Câu 16 (Question 16)
**Trong bảng `EMP_TEST` có 3 nhân viên thuộc phòng ban `10` với tên (`FIRST_NAME`) và mã thưởng (`BONUS_CODE`) như sau:**
- **Alice: `'GOLD'`**
- **Bob: `NULL`**
- **Charlie: `'SILVER'`**

**Khi thực thi biểu thức `LISTAGG(bonus_code, '-') WITHIN GROUP (ORDER BY first_name ASC)` cho phòng ban `10`, chuỗi kết quả trả về sẽ là gì?**

* A. `'GOLD--SILVER'`
* B. `'GOLD-NULL-SILVER'`
* C. `'GOLD-SILVER'`
* D. `NULL` (vì có một phần tử là `NULL`).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Giống như các hàm tổng hợp khác (`SUM`, `AVG`, `COUNT(col)`), hàm `LISTAGG` **hoàn toàn bỏ qua các dòng có giá trị `NULL`** ở cột biểu thức đầu vào (`bonus_code`). Do đó dòng của `Bob` bị bỏ qua hoàn toàn (không sinh ra dấu gạch ngang thừa `--`), kết quả trả về là `'GOLD-SILVER'`. (Nếu toàn bộ các dòng trong nhóm đều có `bonus_code IS NULL` thì `LISTAGG` mới trả về `NULL`).
  * **A, B, D sai:** Đều hiểu sai cơ chế xử lý `NULL` tự động của `LISTAGG`.
</details>

---

### Câu 17 (Question 17)
**Khi hàm `LISTAGG` nối quá nhiều dòng khiến độ dài chuỗi kết quả vượt quá giới hạn tối đa của kiểu `VARCHAR2` (4000 bytes ở chế độ chuẩn) và bạn không khai báo mệnh đề `ON OVERFLOW`, điều gì sẽ xảy ra? Và làm thế nào để cắt chuỗi an toàn từ Oracle 12cR2+?**

* A. Mặc định Oracle tự động cắt bớt chuỗi về 4000 bytes mà không báo lỗi.
* B. Mặc định Oracle văng lỗi `ORA-01489: result of string concatenation is too long`; để cắt chuỗi an toàn không báo lỗi, ta dùng mệnh đề `ON OVERFLOW TRUNCATE` bên trong `LISTAGG`.
* C. Mặc định Oracle tự động chuyển kiểu trả về của `LISTAGG` sang `CLOB`.
* D. Mặc định trả về chuỗi rỗng `NULL`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Hành vi mặc định của `LISTAGG` là `ON OVERFLOW ERROR`, sẽ ném lỗi runtime **`ORA-01489: result of string concatenation is too long`** ngay khi tổng số byte vượt quá giới hạn `VARCHAR2`. Từ Oracle 12cR2, việc thêm `ON OVERFLOW TRUNCATE '...' WITH COUNT` (hoặc `WITHOUT COUNT`) bên trong `LISTAGG(col, ', ' ON OVERFLOW TRUNCATE)` giúp cắt chuỗi tại phần tử nguyên vẹn cuối cùng và hiển thị dấu `'...(số phần tử bị cắt)'` mà không bị lỗi.
  * **A, C, D sai:** `LISTAGG` không bao giờ tự động trả về kiểu `CLOB`.
</details>

---

### Câu 18 (Question 18)
**Khi bạn viết `LISTAGG(first_name, ', ' ON OVERFLOW TRUNCATE) WITHIN GROUP (ORDER BY first_name)` mà không chỉ định chuỗi thay thế hay tùy chọn `WITH/WITHOUT COUNT`, giá trị mặc định mà Oracle áp dụng ở cuối chuỗi bị cắt là gì?**

* A. Chỉ nối thêm dấu ba chấm `'...'` và không hiển thị số lượng phần tử bị cắt (`WITHOUT COUNT`).
* B. Nối thêm dấu ba chấm `'...'` kèm theo số lượng các giá trị bị cắt bỏ nằm trong cặp ngoặc đơn, ví dụ `', ...(42)'` (mặc định là `truncation_indicator = '...'` và `WITH COUNT`).
* C. Không nối thêm ký tự nào cả.
* D. Báo lỗi cú pháp vì bắt buộc phải ghi rõ `WITH COUNT` hoặc `WITHOUT COUNT`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong cú pháp `ON OVERFLOW TRUNCATE ['indicator'] [{WITH | WITHOUT} COUNT]`, nếu bạn chỉ viết ngắn gọn `ON OVERFLOW TRUNCATE`, hai giá trị mặc định được Oracle sử dụng là:
    1. Chuỗi chỉ báo cắt (`truncation_indicator`): dấu ba chấm **`'...'`**.
    2. Chế độ đếm: **`WITH COUNT`** (hiển thị số lượng phần tử bị lược bỏ trong ngoặc đơn `(n)` ở cuối).
  * **A, C, D sai:** Muốn tắt số đếm `(n)`, phải viết tường minh `ON OVERFLOW TRUNCATE '...' WITHOUT COUNT`.
</details>

---

### Câu 19 (Question 19)
**Hàm `LISTAGG` có thể được sử dụng như một hàm phân tích (Analytic Function) với mệnh đề `OVER (PARTITION BY ...)` mà không cần mệnh đề `GROUP BY` hay không? Hãy xem xét câu lệnh sau:**

```sql
SELECT first_name,
       department_id,
       LISTAGG(first_name, ', ') WITHIN GROUP (ORDER BY first_name)
           OVER (PARTITION BY department_id) AS dept_colleagues
FROM employees;
```

* A. Báo lỗi vì `LISTAGG` chỉ là hàm tổng hợp (`GROUP BY`), không bao giờ được đi kèm với từ khóa `OVER`.
* B. Báo lỗi vì không thể có cả `WITHIN GROUP` và `OVER` trong cùng một hàm.
* C. Hoàn toàn hợp lệ! Câu lệnh giữ nguyên mọi dòng nhân viên và hiển thị thêm cột `dept_colleagues` chứa danh sách tên tất cả đồng nghiệp trong cùng phòng ban đó.
* D. Chỉ hợp lệ nếu bên trong `OVER(...)` có thêm mệnh đề `ORDER BY`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** `LISTAGG` vừa là hàm tổng hợp (Aggregate Function), vừa là **hàm phân tích (Analytic Function)** khi thêm mệnh đề `OVER (PARTITION BY ...)` ở ngay sau `WITHIN GROUP (ORDER BY ...)`. Lưu ý: thứ tự nối chuỗi đã được quy định trong `WITHIN GROUP (ORDER BY ...)`, nên bên trong `OVER (PARTITION BY ...)` chỉ chứa `PARTITION BY`, **không có** `ORDER BY`!
  * **A, B, D sai:** Nếu viết thêm `ORDER BY` vào bên trong `OVER(...)` của `LISTAGG` mới là lỗi cú pháp!
</details>

---

### Câu 20 (Question 20)
**Xem xét câu truy vấn `PIVOT` dưới đây trên bảng `EMPLOYEES` (bảng gốc có nhiều cột: `EMPLOYEE_ID`, `FIRST_NAME`, `HIRE_DATE`, `DEPARTMENT_ID`, `JOB_ID`, `SALARY`). Tại sao kết quả của câu truy vấn này lại KHÔNG gom nhóm gọn thành từng dòng cho mỗi `DEPARTMENT_ID`, mà lại trả về hàng trăm dòng rời rạc?**

```sql
SELECT *
FROM employees
PIVOT (
    SUM(salary)
    FOR job_id IN ('IT_PROG' AS it, 'SA_REP' AS sa, 'AD_VP' AS vp)
);
```

* A. Vì hàm `SUM(salary)` không được phép dùng trong `PIVOT`.
* B. Vì toán tử `PIVOT` tự động thực hiện `GROUP BY` ngầm định trên **tất cả các cột của bảng nguồn không được nhắc tới trong mệnh đề `PIVOT`** (bao gồm cả `EMPLOYEE_ID`, `FIRST_NAME`, `HIRE_DATE`...), làm mỗi nhân viên trở thành một nhóm riêng!
* C. Vì thiếu mệnh đề `GROUP BY department_id` ở cuối câu lệnh `PIVOT`.
* D. Vì trong mệnh đề `IN` chỉ liệt kê có 3 mã công việc.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là lỗi thực tế phổ biến nhất và cũng là bẫy thi kinh điển về `PIVOT`! Toán tử `PIVOT` không có mệnh đề `GROUP BY` tường minh; thay vào đó, nó tự động lấy **mọi cột còn lại trong nguồn dữ liệu (ngoài cột trong `AGG(...)` và cột sau `FOR`)** để làm khóa gom nhóm (`Implicit GROUP BY`). Khi viết `FROM employees` trực tiếp, các cột như `EMPLOYEE_ID` (khóa chính duy nhất cho từng dòng), `FIRST_NAME`, `EMAIL`... đều bị đưa vào khóa gom nhóm!
    * **Cách viết đúng:** Luôn bọc một Inline View chỉ `SELECT department_id, job_id, salary FROM employees` làm nguồn cho `PIVOT`!
  * **A, C, D sai:** Không được viết thêm `GROUP BY` tường minh cho cùng khối `PIVOT`.
</details>

---

### Câu 21 (Question 21)
**Trong mệnh đề `PIVOT (SUM(salary) FOR department_id IN (...))`, khi nào bạn được phép sử dụng một câu truy vấn con (`SELECT DISTINCT department_id FROM ...`) hoặc từ khóa `ANY` bên trong mệnh đề `IN (...)`?**

* A. Luôn luôn được phép trong mọi câu lệnh `PIVOT` thông thường.
* B. Chỉ được phép khi sử dụng cú pháp **`PIVOT XML`** (khi đó kết quả các cột xoay được trả về dưới dạng một cột kiểu dữ liệu `XMLTYPE`).
* C. Chỉ được phép khi kết hợp với `UNPIVOT`.
* D. Hoàn toàn không bao giờ được phép trong Oracle SQL.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong một câu lệnh `PIVOT` chuẩn trả về các cột quan hệ thông thường, SQL Engine bắt buộc phải biết chính xác số lượng cột và tên cột ngay tại **thời điểm biên dịch (compile/parse time)**, nên danh sách trong `IN (...)` bắt buộc phải là các hằng số tĩnh (static literals). Chỉ khi bạn dùng **`PIVOT XML (...)`**, Oracle mới cho phép viết `IN (SELECT ...)` hoặc `IN (ANY)` vì toàn bộ các cột động được gói gọn vào duy nhất 1 cột `XMLTYPE`!
  * **A, C, D sai:** Dùng subquery trong `IN` của `PIVOT` thường sẽ báo lỗi `ORA-56901: non-constant expression is not allowed for pivot|unpivot values`.
</details>

---

### Câu 22 (Question 22)
**Trong mệnh đề `PIVOT` có khai báo **2 hàm tổng hợp** và **3 giá trị cột xoay** như dưới đây, kèm theo 1 cột khóa gom nhóm `dept_id`. Hỏi bảng kết quả trả về sẽ có tổng cộng bao nhiêu cột?**

```sql
SELECT *
FROM (SELECT dept_id, job_id, salary FROM emp_summary)
PIVOT (
    SUM(salary) AS sum_s,
    COUNT(*)    AS cnt_e
    FOR job_id IN ('AD_VP' AS vp, 'IT_PROG' AS it, 'SA_REP' AS sa)
);
```

* A. 4 cột.
* B. 6 cột.
* C. 7 cột (`dept_id` + $3 \times 2 = 6$ cột xoay).
* D. Báo lỗi vì `PIVOT` chỉ cho phép tối đa 1 hàm tổng hợp.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** `PIVOT` hoàn toàn cho phép khai báo **nhiều hàm tổng hợp** cách nhau bởi dấu phẩy (khi có từ 2 hàm tổng hợp trở lên thì bắt buộc mỗi hàm phải đặt bí danh `AS alias`).
    * Số cột xoay sinh ra bằng: $(\text{Số giá trị trong } \text{IN}) \times (\text{Số hàm tổng hợp}) = 3 \times 2 = 6$ cột (`VP_SUM_S`, `VP_CNT_E`, `IT_SUM_S`, `IT_CNT_E`, `SA_SUM_S`, `SA_CNT_E`).
    * Cộng thêm 1 cột khóa gom nhóm `DEPT_ID` ở đầu $\implies$ tổng cộng có **$1 + 6 = 7$ cột**!
  * **A, B, D sai:** Tính thiếu cột khóa gom nhóm hoặc không nhân số hàm tổng hợp với số giá trị trong `IN`.
</details>

---

### Câu 23 (Question 23)
**Cho bảng `EMP_CONTACTS` chỉ có 1 dòng duy nhất: `EMP_ID = 101`, `WORK_PHONE = '090111'`, `HOME_PHONE = NULL`, `CELL_PHONE = '098999'`. Khi thực thi câu lệnh `UNPIVOT` dưới đây, có bao nhiêu dòng được trả về?**

```sql
SELECT emp_id, phone_type, phone_num
FROM emp_contacts
UNPIVOT (
    phone_num
    FOR phone_type IN (work_phone AS 'WORK', home_phone AS 'HOME', cell_phone AS 'CELL')
);
```

* A. 3 dòng (dòng `'HOME'` có `phone_num` là `NULL`).
* B. 2 dòng (chỉ có dòng `'WORK'` và dòng `'CELL'`; dòng `'HOME'` bị loại bỏ vì chế độ mặc định của `UNPIVOT` là `EXCLUDE NULLS`).
* C. 1 dòng.
* D. 0 dòng (vì có 1 cột bị `NULL` nên cả dòng bị loại bỏ).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Hành vi mặc định của toán tử `UNPIVOT` trong Oracle là **`EXCLUDE NULLS`**. Khi chuyển 3 cột `work_phone`, `home_phone`, `cell_phone` thành các dòng, vì cột `home_phone` mang giá trị `NULL` nên dòng `'HOME'` tự động bị lọc bỏ, kết quả chỉ trả về **2 dòng** (`'WORK'` và `'CELL'`).
  * **A, C, D sai:** Muốn kết quả trả về đủ 3 dòng (giữ cả dòng `'HOME'` có `phone_num IS NULL`), bạn phải viết tường minh: `UNPIVOT INCLUDE NULLS (...)`.
</details>

---

### Câu 24 (Question 24)
**Khi sử dụng toán tử `UNPIVOT (value_col FOR name_col IN (col1, col2, col3))`, điều kiện nào về kiểu dữ liệu của các cột `col1`, `col2`, `col3` BẮT BUỘC phải được thỏa mãn?**

* A. Các cột `col1`, `col2`, `col3` có thể thuộc các kiểu dữ liệu hoàn toàn khác nhau (ví dụ `col1` kiểu `NUMBER`, `col2` kiểu `DATE`, `col3` kiểu `VARCHAR2`) mà không cần ép kiểu.
* B. Tất cả các cột được liệt kê trong danh sách `IN (col1, col2, col3)` bắt buộc phải có **cùng kiểu dữ liệu** (vì giá trị của chúng sẽ được gộp chung vào một cột kết quả duy nhất là `value_col`).
* C. Tất cả các cột trong `IN (...)` bắt buộc phải là khóa chính (`PRIMARY KEY`) của bảng.
* D. Tất cả các cột trong `IN (...)` bắt buộc phải có ràng buộc `NOT NULL`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Vì `UNPIVOT` gom giá trị của cả 3 cột `col1`, `col2`, `col3` đổ chung vào một cột dọc duy nhất là `value_col`, nên `col1`, `col2`, `col3` **bắt buộc phải cùng kiểu dữ liệu** (ví dụ cùng là `NUMBER` hoặc cùng là `VARCHAR2`). Nếu khác kiểu dữ liệu, Oracle sẽ báo lỗi `ORA-01790: expression must have same datatype as corresponding expression` (khi đó bạn phải dùng `TO_CHAR` trong một Inline View trước khi `UNPIVOT`).
  * **A, C, D sai:** Vi phạm nguyên tắc đồng nhất kiểu dữ liệu trên một cột của bảng quan hệ.
</details>

---

### Câu 25 (Question 25)
**Từ phiên bản Oracle 19c, cải tiến cú pháp quan trọng nào đã được bổ sung trực tiếp vào hàm `LISTAGG` để giúp lập trình viên không còn phải viết Subquery hay dùng biểu thức chính quy `REGEXP_REPLACE` để xóa các chuỗi trùng nhau?**

* A. Từ khóa `UNIQUE_ONLY` đặt ở cuối mệnh đề `WITHIN GROUP`.
* B. Từ khóa `DISTINCT` đặt ngay trước biểu thức cột bên trong `LISTAGG(DISTINCT col_name, ', ') WITHIN GROUP (ORDER BY col_name)`.
* C. Hàm mới tên là `LISTAGG_DISTINCT()`.
* D. Mệnh đề `ON DUPLICATE REMOVE`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Bắt đầu từ **Oracle 19c**, hàm `LISTAGG` chính thức hỗ trợ từ khóa **`DISTINCT`** ngay bên trong đối số đầu tiên: `LISTAGG(DISTINCT job_id, ', ') WITHIN GROUP (ORDER BY job_id)`. Lưu ý rằng khi dùng `LISTAGG(DISTINCT expr, ...)`, biểu thức sắp xếp trong `WITHIN GROUP (ORDER BY ...)` phải khớp với biểu thức `expr`.
  * **A, C, D sai:** Là các cú pháp không tồn tại trong Oracle SQL.
</details>

---
