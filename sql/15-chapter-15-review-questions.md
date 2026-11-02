# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 15: Hàm Phân Tích & Khung Cửa Sổ (Analytic Functions)

> **Thuộc Phần II:** Oracle SQL Nâng Cao (Advanced Oracle SQL for Developers)  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle OCA/OCP & Tuyển dụng VNPT/Viettel/Ngân hàng.  
> **Cách học:** Hãy đọc kỹ đề bài và tự tính toán kết quả trước khi mở phần **"👉 Xem Đáp Án & Giải Thích Chi Tiết"**.

---

### Câu 1 (Question 1)
**Theo thứ tự xử lý logic của một câu lệnh `SELECT` trong Oracle SQL, các hàm phân tích (Analytic Functions có mệnh đề `OVER`) được thực thi tại thời điểm nào?**

* A. Trước mệnh đề `WHERE` và trước mệnh đề `GROUP BY`.
* B. Sau mệnh đề `WHERE`, nhưng trước mệnh đề `GROUP BY` và `HAVING`.
* C. Sau khi các mệnh đề `FROM`, `WHERE`, `GROUP BY`, và `HAVING` đã hoàn tất, nhưng trước mệnh đề `ORDER BY` của câu truy vấn.
* D. Sau cùng, sau cả mệnh đề `ORDER BY` và `FETCH FIRST`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Thứ tự xử lý logic chuẩn trong SQL là: `FROM/JOIN` $\rightarrow$ `WHERE` $\rightarrow$ `GROUP BY` $\rightarrow$ `HAVING` $\rightarrow$ **Analytic Functions (`OVER`)** $\rightarrow$ `SELECT / DISTINCT` $\rightarrow$ `ORDER BY` $\rightarrow$ `OFFSET / FETCH`. Chính vì chạy sau `WHERE`, `GROUP BY`, `HAVING` nên hàm phân tích không bao giờ được phép xuất hiện trực tiếp trong 3 mệnh đề đó.
  * **A, B, D sai:** Sai thứ tự xử lý của bộ thực thi SQL.
</details>

---

### Câu 2 (Question 2)
**Xem xét câu lệnh SQL dưới đây. Điều gì sẽ xảy ra khi thực thi câu lệnh này?**

```sql
SELECT employee_id, first_name, department_id, salary
FROM employees
WHERE RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) = 1;
```

* A. Trả về danh sách các nhân viên có mức lương cao nhất trong từng phòng ban.
* B. Chỉ trả về duy nhất 1 nhân viên có lương cao nhất toàn công ty.
* C. Báo lỗi `ORA-30483: window functions are not allowed here` vì hàm phân tích không được phép đặt trong mệnh đề `WHERE`.
* D. Báo lỗi vì hàm `RANK()` bắt buộc phải có tham số truyền vào trong cặp ngoặc đơn.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Các hàm phân tích (`RANK() OVER (...)`) chỉ được phép xuất hiện trong mệnh đề **`SELECT`** và mệnh đề **`ORDER BY`**. Đặt `RANK() OVER (...)` trực tiếp trong mệnh đề `WHERE` (hoặc `GROUP BY`, `HAVING`) sẽ lập tức gây lỗi **`ORA-30483: window functions are not allowed here`**. Để lọc điều kiện này, bạn phải đặt hàm phân tích vào bên trong một Inline View hoặc CTE (`WITH`), rồi lọc ở `WHERE` của truy vấn ngoài.
  * **A, B, D sai:** `RANK()` không nhận tham số trong ngoặc đơn, và lỗi xảy ra do đặt sai mệnh đề.
</details>

---

### Câu 3 (Question 3)
**Cho 5 nhân viên trong cùng một phòng ban có mức lương (`SALARY`) lần lượt theo thứ tự giảm dần là: `10000`, `8000`, `8000`, `8000`, `6000`. Giá trị trả về của hai hàm `RANK() OVER (ORDER BY salary DESC)` và `DENSE_RANK() OVER (ORDER BY salary DESC)` cho nhân viên có mức lương `6000` lần lượt là bao nhiêu?**

* A. `RANK = 5` và `DENSE_RANK = 3`
* B. `RANK = 3` và `DENSE_RANK = 5`
* C. `RANK = 4` và `DENSE_RANK = 3`
* D. `RANK = 5` và `DENSE_RANK = 5`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Hãy xét thứ hạng của 5 dòng (`10000`, `8000`, `8000`, `8000`, `6000`):
    * Với `RANK()` (nhảy cóc khi đồng hạng): `10000` $\rightarrow$ hạng `1`; ba dòng `8000` đồng hạng `2` (`2, 2, 2` — chiếm các vị trí thứ 2, 3, 4); dòng tiếp theo `6000` nhảy thẳng lên hạng **`5`**.
    * Với `DENSE_RANK()` (xếp hạng đặc, không nhảy cóc): `10000` $\rightarrow$ hạng `1`; ba dòng `8000` đồng hạng `2` (`2, 2, 2`); dòng tiếp theo `6000` nhận hạng liền kề là **`3`**.
  * **B, C, D sai:** Nhầm lẫn cơ chế nhảy bậc giữa `RANK` và `DENSE_RANK`.
</details>

---

### Câu 4 (Question 4)
**Một phân vùng dữ liệu có tổng cộng 10 dòng được sắp xếp theo `salary DESC`. Khi sử dụng hàm `NTILE(4) OVER (ORDER BY salary DESC)`, số lượng dòng được phân bổ vào 4 nhóm (Bucket 1, Bucket 2, Bucket 3, Bucket 4) lần lượt là bao nhiêu?**

* A. `2, 2, 3, 3`
* B. `3, 3, 2, 2`
* C. `4, 4, 2, 0`
* D. `2.5, 2.5, 2.5, 2.5`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi chia $10$ dòng thành $4$ bucket bằng `NTILE(4)`:
    * Thương nguyên: $\lfloor 10 / 4 \rfloor = 2$ dòng mỗi bucket.
    * Số dư: $10 \bmod 4 = 2$ dòng dư.
    * Theo quy tắc của `NTILE(n)`, **$r$ dòng dư sẽ được cộng thêm mỗi bucket 1 dòng cho $r$ bucket đầu tiên** (từ Bucket 1 đến Bucket $r$). Vì dư $2$ dòng nên Bucket 1 và Bucket 2 mỗi nhóm có $2 + 1 = 3$ dòng; Bucket 3 và Bucket 4 mỗi nhóm có $2$ dòng $\rightarrow$ phân bổ là **`3, 3, 2, 2`**.
  * **A, C, D sai:** `NTILE` luôn ưu tiên cộng phần dư vào các bucket đầu tiên chứ không phải các bucket cuối.
</details>

---

### Câu 5 (Question 5)
**Cho bảng `TEST_SCORES` có 4 thí sinh với điểm số (`SCORE`) lần lượt là: `90`, `80`, `80`, `70`. Khi thực thi câu truy vấn dưới đây, giá trị của cột `PCT_RNK` và `CUME_DST` tại dòng đầu tiên (`SCORE = 90`) lần lượt là bao nhiêu?**

```sql
SELECT score,
       PERCENT_RANK() OVER (ORDER BY score DESC) AS pct_rnk,
       CUME_DIST()    OVER (ORDER BY score DESC) AS cume_dst
FROM test_scores;
```

* A. `pct_rnk = 0.25` và `cume_dst = 0.25`
* B. `pct_rnk = 0` và `cume_dst = 0.25`
* C. `pct_rnk = 0` và `cume_dst = 0`
* D. `pct_rnk = 1` và `cume_dst = 0.25`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * Công thức của `PERCENT_RANK()` là $\frac{\text{RANK}() - 1}{N - 1}$. Tại dòng đầu tiên (`score = 90`), `RANK() = 1`, nên `PERCENT_RANK() = (1 - 1) / (4 - 1) = 0 / 3 = 0`. (Dòng hạng 1 luôn có `PERCENT_RANK` bằng `0`!).
    * Công thức của `CUME_DIST()` là $\frac{\text{Số dòng đứng từ đầu đến hết nhóm giá trị hiện tại}}{N}$. Tại `score = 90`, chỉ có 1 dòng có điểm $\ge 90$ trên tổng số 4 dòng, nên `CUME_DIST() = 1 / 4 = 0.25`.
  * **A, C, D sai:** `CUME_DIST()` không bao giờ nhận giá trị `0`, còn `PERCENT_RANK()` tại hạng 1 luôn bằng `0`.
</details>

---

### Câu 6 (Question 6)
**Vẫn với bảng `TEST_SCORES` gồm 4 dòng điểm số: `90`, `80`, `80`, `70` ở Câu 5. Tại hai dòng có cùng điểm số `SCORE = 80`, giá trị của `CUME_DIST() OVER (ORDER BY score DESC)` sẽ trả về là bao nhiêu?**

* A. Dòng `80` thứ nhất trả về `0.50`, dòng `80` thứ hai trả về `0.75`.
* B. Cả hai dòng `80` đều trả về `0.50`.
* C. Cả hai dòng `80` đều trả về `0.75`.
* D. Cả hai dòng `80` đều trả về `0.33`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Hàm `CUME_DIST()` tính tỷ lệ số dòng có giá trị đứng trước hoặc **bằng** giá trị của dòng hiện tại theo thứ tự `ORDER BY`. Với thứ tự giảm dần (`90, 80, 80, 70`), tính đến giá trị `80` có tổng cộng **3 dòng** (`90, 80, 80`) trên tổng số **4 dòng**. Do đó cả hai dòng mang điểm `80` đều có `CUME_DIST() = 3 / 4 = 0.75`.
  * **A, B, D sai:** Các dòng đồng hạng (peers) luôn nhận cùng một giá trị `CUME_DIST()` và tính tới vị trí cuối cùng của nhóm đồng hạng đó (`3/4 = 0.75`). Còn `0.33` ($1/3$) là giá trị của `PERCENT_RANK()`.
</details>

---

### Câu 7 (Question 7)
**Khi sử dụng hàm `LAG(salary, 2, -1) OVER (PARTITION BY department_id ORDER BY hire_date ASC)`, ý nghĩa của các tham số `2` và `-1` là gì?**

* A. Lấy giá trị `salary` của dòng đứng trước dòng hiện tại `2` vị trí trong cùng phòng ban; nếu không có dòng đó (vượt biên phân vùng) thì trả về giá trị `-1`.
* B. Lấy giá trị `salary` của dòng đứng trước `1` vị trí rồi trừ đi `2`.
* C. Lấy giá trị `salary` của dòng đứng sau dòng hiện tại `2` vị trí; nếu giá trị đó là `NULL` thì thay bằng `-1`.
* D. Chia phân vùng thành `2` nhóm và giảm bậc xếp hạng đi `1`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Cú pháp chuẩn của `LAG` là `LAG(expr, offset, default_value) OVER (...)`:
    * `offset = 2`: Lùi về phía trước **2 dòng** trong cùng một `department_id` theo thứ tự `hire_date ASC`.
    * `default_value = -1`: Với dòng thứ 1 và dòng thứ 2 của mỗi phòng ban (khi lùi 2 dòng sẽ bị vượt ra ngoài biên trên của phân vùng), hàm sẽ trả về giá trị mặc định là **`-1`** thay vì `NULL`.
  * **B, C, D sai:** Lưu ý rằng `default_value` chỉ kích hoạt khi bước nhảy `offset` **vượt ra ngoài phạm vi Partition**, chứ không thay thế cho một dòng tồn tại nhưng có cột `salary` mang giá trị `NULL`!
</details>

---

### Câu 8 (Question 8)
**Trong một phân vùng của bảng `EMP`, có 3 dòng theo thứ tự `hire_date` như sau:**
- **Dòng 1: `emp_id = 1`, `commission_pct = 0.1`**
- **Dòng 2: `emp_id = 2`, `commission_pct = NULL`**
- **Dòng 3: `emp_id = 3`, `commission_pct = 0.2`**

**Tại Dòng 3 (`emp_id = 3`), hai biểu thức `LAG(commission_pct, 1, 0.99) OVER (ORDER BY emp_id)` và `LAG(commission_pct IGNORE NULLS, 1, 0.99) OVER (ORDER BY emp_id)` trả về kết quả lần lượt là gì?**

* A. `0.99` và `0.1`
* B. `NULL` và `0.1`
* C. `NULL` và `0.99`
* D. `0.1` và `0.1`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là một bẫy cực kỳ tinh tế trong đề thi OCP!
    * Ở biểu thức thứ nhất `LAG(commission_pct, 1, 0.99)`: Tại Dòng 3, lùi 1 dòng là Dòng 2. Dòng 2 **có tồn tại** (không vượt biên Partition), và giá trị `commission_pct` của Dòng 2 là **`NULL`**. Tham số `default = 0.99` chỉ được dùng khi không có dòng trước đó (như tại Dòng 1), chứ không phải hàm `NVL`! Do đó kết quả trả về tại Dòng 3 là **`NULL`**.
    * Ở biểu thức thứ hai có **`IGNORE NULLS`**: Tại Dòng 3, lùi 1 dòng gặp Dòng 2 bị `NULL` nên nó bỏ qua Dòng 2 và lùi tiếp về Dòng 1, lấy được giá trị **`0.1`**.
  * **A, C, D sai:** Mắc bẫy nhầm lẫn tham số `default` của `LAG/LEAD` với hàm `NVL()`.
</details>

---

### Câu 9 (Question 9)
**Cho bảng `EMP_DEPT10` có 3 nhân viên với mức lương (`SALARY`) tăng dần là: `Alice (5000)`, `Bob (7000)`, `David (9000)`. Khi thực thi câu truy vấn dưới đây, giá trị cột `HIGHEST_SAL` tại dòng của `Alice (5000)` sẽ là bao nhiêu?**

```sql
SELECT first_name,
       salary,
       LAST_VALUE(salary) OVER (ORDER BY salary ASC) AS highest_sal
FROM emp_dept10;
```

* A. `9000`
* B. `5000`
* C. `7000`
* D. `NULL`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là **bẫy số 1 của hàm `LAST_VALUE` trong kỳ thi Oracle**! Khi có mệnh đề `ORDER BY salary ASC` trong `OVER(...)` mà không chỉ định tường minh mệnh đề Window Frame (`ROWS/RANGE BETWEEN`), Oracle tự động áp dụng khung cửa sổ mặc định là:
    `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` *(từ đầu phân vùng đến dòng hiện tại)*.
    Vì vậy, tại dòng của `Alice (5000)`, khung cửa sổ chỉ chứa duy nhất dòng của `Alice` (từ đầu đến `Alice`). Giá trị cuối cùng (`LAST_VALUE`) trong khung cửa sổ đó tại thời điểm ấy chính là **`5000`** (chứ không phải `9000`)!
  * **A, C, D sai:** Muốn nhận được `9000` ở mọi dòng, bắt buộc phải viết `LAST_VALUE(salary) OVER (ORDER BY salary ASC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)`.
</details>

---

### Câu 10 (Question 10)
**Để hàm `LAST_VALUE(first_name) OVER (PARTITION BY department_id ORDER BY salary ASC ...)` luôn trả về tên của nhân viên có lương cao nhất trong toàn bộ phòng ban cho mọi dòng, bạn cần bổ sung mệnh đề khung cửa sổ (Windowing Clause) nào vào dấu `...`?**

* A. `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`
* B. `ROWS BETWEEN CURRENT ROW AND 1 FOLLOWING`
* C. `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`
* D. `RANGE BETWEEN UNBOUNDED FOLLOWING AND UNBOUNDED PRECEDING`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` (hoặc `RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`) mở rộng biên dưới của khung cửa sổ đến tận dòng cuối cùng của phân vùng (`UNBOUNDED FOLLOWING`), giúp `LAST_VALUE()` luôn nhìn thấy dòng cuối cùng của cả phòng ban.
  * **A sai:** Đây chính là khung kết thúc tại dòng hiện tại (`CURRENT ROW`), nguyên nhân gây ra lỗi logic ở Câu 9.
  * **B sai:** Chỉ nhìn tới 1 dòng kế tiếp.
  * **D sai:** Lỗi cú pháp `ORA-30487` vì `UNBOUNDED FOLLOWING` không bao giờ được đứng ở điểm bắt đầu (`start_point`) của `BETWEEN`.
</details>

---

### Câu 11 (Question 11)
**Sự khác biệt giữa khung cửa sổ mặc định của `SUM(salary) OVER (PARTITION BY department_id)` (không có `ORDER BY`) và `SUM(salary) OVER (PARTITION BY department_id ORDER BY employee_id)` (có `ORDER BY`) là gì?**

* A. Không có sự khác biệt nào, cả hai đều trả về tổng lương của toàn bộ phòng ban.
* B. Câu không có `ORDER BY` tính tổng lương của toàn bộ phòng ban, còn câu có `ORDER BY` tính tổng lương lũy kế (Running Total) từ dòng đầu tiên của phòng ban đến dòng hiện tại.
* C. Câu không có `ORDER BY` báo lỗi cú pháp vì mọi hàm `OVER()` đều bắt buộc phải có `ORDER BY`.
* D. Câu có `ORDER BY` chỉ lấy lương của dòng hiện tại mà không cộng dồn.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * Khi **không có `ORDER BY`** trong `OVER(PARTITION BY department_id)`, khung cửa sổ mặc định là toàn bộ phân vùng (`RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`) $\rightarrow$ trả về **tổng lương của cả phòng ban** giống nhau cho mọi dòng trong phòng đó.
    * Khi **có `ORDER BY`** trong `OVER(PARTITION BY department_id ORDER BY employee_id)`, khung cửa sổ mặc định lập tức chuyển thành `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` $\rightarrow$ trả về **tổng lương lũy kế (Running Total)** tăng dần theo từng dòng!
  * **A, C, D sai:** Với các hàm tổng hợp (`SUM`, `AVG`, `COUNT`, `MIN`, `MAX`), `ORDER BY` trong `OVER()` là tùy chọn nhưng làm thay đổi hoàn toàn khung cửa sổ mặc định.
</details>

---

### Câu 12 (Question 12)
**Cho bảng `ITEMS` có 4 dòng dữ liệu được sắp xếp theo cột `PRICE` tăng dần như sau:**
- **Dòng 1: `item_id = 1`, `price = 100`**
- **Dòng 2: `item_id = 2`, `price = 200`**
- **Dòng 3: `item_id = 3`, `price = 200`**
- **Dòng 4: `item_id = 4`, `price = 300`**

**Khi thực thi câu truy vấn dưới đây, tại Dòng 2 (`item_id = 2`, `price = 200`), giá trị của `sum_default` và `sum_rows` lần lượt là bao nhiêu?**

```sql
SELECT item_id,
       price,
       SUM(price) OVER (ORDER BY price) AS sum_default,
       SUM(price) OVER (ORDER BY price, item_id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS sum_rows
FROM items;
```

* A. `sum_default = 300` và `sum_rows = 300`
* B. `sum_default = 500` và `sum_rows = 300`
* C. `sum_default = 300` và `sum_rows = 500`
* D. `sum_default = 500` và `sum_rows = 500`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Câu hỏi này kiểm tra sự khác biệt cốt lõi giữa `RANGE` (mặc định) và `ROWS` khi có các dòng trùng giá trị khóa sắp xếp (`price = 200` ở cả Dòng 2 và Dòng 3):
    * Cột `sum_default`: Do không khai báo `ROWS/RANGE`, Oracle dùng mặc định **`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`**. Vì `RANGE` hoạt động theo khoảng giá trị logic (`price <= 200`), nên ngay tại Dòng 2 (`price = 200`), nó gộp tất cả các dòng đồng hạng có `price = 200` (cả Dòng 2 và Dòng 3) vào khung cửa sổ: $100 + 200 + 200 =$ **`500`**!
    * Cột `sum_rows`: Dùng **`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`**, chỉ cộng đúng từ dòng vật lý số 1 đến dòng vật lý số 2: $100 + 200 =$ **`300`**.
  * **A, C, D sai:** Không nắm được cơ chế gộp các dòng đồng hạng (peers) của `RANGE`.
</details>

---

### Câu 13 (Question 13)
**Khi sử dụng mệnh đề khung cửa sổ theo khoảng giá trị với bước nhảy số học, ví dụ: `RANGE BETWEEN 100 PRECEDING AND 100 FOLLOWING`, quy tắc nào sau đây BẮT BUỘC phải thỏa mãn trong mệnh đề `ORDER BY` của `OVER(...)`?**

* A. Mệnh đề `ORDER BY` có thể chứa bao nhiêu cột tùy ý và thuộc bất kỳ kiểu dữ liệu nào (kể cả `VARCHAR2`).
* B. Mệnh đề `ORDER BY` chỉ được phép chứa **duy nhất 1 biểu thức** và biểu thức đó phải có kiểu dữ liệu **Số (`NUMBER`)** hoặc **Ngày giờ (`DATE` / `TIMESTAMP`)**.
* C. Mệnh đề `ORDER BY` bắt buộc phải sắp xếp theo chiều giảm dần (`DESC`).
* D. Không được phép có mệnh đề `PARTITION BY` đi kèm khi đã dùng `RANGE`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi dùng `RANGE` với một khoảng dịch chuyển giá trị cụ thể (`n PRECEDING` hoặc `n FOLLOWING`), Oracle phải thực hiện phép cộng/trừ toán học `col_value - n` và `col_value + n`. Do đó, mệnh đề `ORDER BY` bên trong `OVER(...)` **chỉ được phép có đúng 1 cột/biểu thức duy nhất**, và kiểu dữ liệu của nó bắt buộc phải là **Số (`NUMBER`)** hoặc **Ngày giờ (`DATE`/`TIMESTAMP`)**. Nếu đặt cột `VARCHAR2` hoặc đặt 2 cột vào `ORDER BY`, Oracle sẽ báo lỗi `ORA-30486: invalid window aggregation group in the window specification`.
  * **A, C, D sai:** Chỉ có `ROWS BETWEEN n PRECEDING ...` (đếm dòng vật lý) mới cho phép sắp xếp theo nhiều cột hoặc cột kiểu chuỗi `VARCHAR2`.
</details>

---

### Câu 14 (Question 14)
**Bạn muốn tính trung bình trượt (Moving Average) mức lương của mỗi nhân viên cùng với 2 nhân viên được tuyển liền trước và 2 nhân viên được tuyển liền sau họ trong cùng phòng ban (tổng cộng tối đa 5 dòng vật lý). Cú pháp nào sau đây là ĐÚNG?**

* A. `AVG(salary) OVER (PARTITION BY department_id ORDER BY hire_date ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING)`
* B. `AVG(salary) OVER (PARTITION BY department_id ORDER BY hire_date RANGE BETWEEN 2 PRECEDING AND 2 FOLLOWING)`
* C. `AVG(salary) OVER (PARTITION BY department_id ORDER BY hire_date ROWS BETWEEN 2 FOLLOWING AND 2 PRECEDING)`
* D. `AVG(salary) OVER (PARTITION BY department_id ORDER BY hire_date WINDOW 2 PRECEDING TO 2 FOLLOWING)`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Để lấy 2 dòng vật lý đứng trước, dòng hiện tại, và 2 dòng vật lý đứng sau theo thứ tự `hire_date`, ta sử dụng từ khóa **`ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING`**.
  * **B sai:** Nếu dùng `RANGE BETWEEN 2 PRECEDING AND 2 FOLLOWING` trên cột `hire_date` (kiểu `DATE`), nó sẽ tính trung bình lương của các nhân viên có ngày tuyển dụng nằm trong khoảng **$\pm 2$ ngày** so với ngày tuyển của dòng hiện tại, chứ không phải 2 người trước và 2 người sau!
  * **C sai:** Điểm bắt đầu `2 FOLLOWING` đứng sau điểm kết thúc `2 PRECEDING` là sai thứ tự logic, gây lỗi `ORA-30487`.
  * **D sai:** Sai cú pháp SQL.
</details>

---

### Câu 15 (Question 15)
**Cú pháp viết tắt `SUM(salary) OVER (ORDER BY hire_date ROWS 3 PRECEDING)` (không có từ khóa `BETWEEN`) tương đương hoàn toàn với cú pháp đầy đủ nào sau đây?**

* A. `SUM(salary) OVER (ORDER BY hire_date ROWS BETWEEN 3 PRECEDING AND UNBOUNDED FOLLOWING)`
* B. `SUM(salary) OVER (ORDER BY hire_date ROWS BETWEEN 3 PRECEDING AND CURRENT ROW)`
* C. `SUM(salary) OVER (ORDER BY hire_date ROWS BETWEEN UNBOUNDED PRECEDING AND 3 PRECEDING)`
* D. Báo lỗi cú pháp vì bắt buộc lúc nào cũng phải có từ khóa `BETWEEN`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong Oracle SQL, khi bạn chỉ viết mốc bắt đầu mà lược bỏ từ khóa `BETWEEN` (ví dụ: `ROWS 3 PRECEDING`, `ROWS UNBOUNDED PRECEDING`, hoặc `RANGE INTERVAL '7' DAY PRECEDING`), Oracle tự động hiểu mốc kết thúc mặc định là **`AND CURRENT ROW`**. Do đó `ROWS 3 PRECEDING` tương đương 100% với `ROWS BETWEEN 3 PRECEDING AND CURRENT ROW` (gồm tổng cộng tối đa 4 dòng: 3 dòng trước + 1 dòng hiện tại).
  * **A, C, D sai:** Lưu ý rằng cú pháp viết tắt không có `BETWEEN` chỉ áp dụng cho `PRECEDING` và `CURRENT ROW`, không được viết tắt kiểu `ROWS 3 FOLLOWING` (sẽ báo lỗi).
</details>

---

### Câu 16 (Question 16)
**Hàm phân tích nào sau đây trong Oracle tự động tính tỷ trọng của giá trị dòng hiện tại so với tổng (`SUM`) của toàn bộ phân vùng (tương đương với công thức `salary / SUM(salary) OVER (PARTITION BY department_id)`)?**

* A. `PERCENT_RANK(salary) OVER (PARTITION BY department_id)`
* B. `RATIO_TO_REPORT(salary) OVER (PARTITION BY department_id)`
* C. `CUME_DIST(salary) OVER (PARTITION BY department_id)`
* D. `NTILE(salary) OVER (PARTITION BY department_id)`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Hàm `RATIO_TO_REPORT(expr) OVER ([PARTITION BY ...])` là hàm phân tích chuyên dụng của Oracle dùng để tính tỷ lệ đóng góp của `expr` tại dòng hiện tại chia cho tổng `SUM(expr)` của cả phân vùng. Đặc biệt lưu ý: bên trong `OVER(...)` của hàm `RATIO_TO_REPORT` **không được phép có mệnh đề `ORDER BY`**!
  * **A, C sai:** `PERCENT_RANK()` và `CUME_DIST()` là hàm xếp hạng vị trí tương đối (không nhận đối số `salary` trong ngoặc đơn khi dùng làm hàm phân tích), không tính tỷ trọng giá trị trên tổng.
  * **D sai:** `NTILE(n)` dùng để chia phân vùng thành `n` nhóm.
</details>

---

### Câu 17 (Question 17)
**Xem xét câu lệnh SQL dưới đây. Điều gì sẽ xảy ra khi thực thi?**

```sql
SELECT first_name,
       salary,
       ROW_NUMBER() OVER (
           PARTITION BY department_id
           ORDER BY salary DESC
           ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
       ) AS rn
FROM employees;
```

* A. Đánh số thứ tự từ 1 đến 3 lặp lại cho mỗi khung 3 dòng.
* B. Báo lỗi cú pháp vì các hàm xếp hạng thuần túy như `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()` không cho phép sử dụng mệnh đề Windowing (`ROWS / RANGE BETWEEN ...`) bên trong `OVER(...)`.
* C. Thực thi thành công và phớt lờ mệnh đề `ROWS BETWEEN`.
* D. Báo lỗi vì `ROW_NUMBER()` không cho phép dùng `PARTITION BY`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Các hàm xếp hạng (`ROW_NUMBER`, `RANK`, `DENSE_RANK`, `NTILE`, `PERCENT_RANK`, `CUME_DIST`) và các hàm dịch chuyển (`LAG`, `LEAD`) luôn hoạt động trên phạm vi toàn bộ Partition. Chúng **KHÔNG HỖ TRỢ** mệnh đề khung cửa sổ trượt (`ROWS | RANGE BETWEEN ...`). Nếu viết thêm `ROWS BETWEEN ...` vào `ROW_NUMBER() OVER (...)`, Oracle sẽ báo lỗi cú pháp `ORA-30484: missing window specification for this function` / lỗi cú pháp tại từ khóa `ROWS`.
  * **A, C, D sai:** Chỉ các hàm tổng hợp phân tích (`SUM`, `AVG`, `COUNT`, `MIN`, `MAX`...) và nhóm hàm biên cửa sổ (`FIRST_VALUE`, `LAST_VALUE`, `NTH_VALUE`) mới sử dụng mệnh đề `ROWS / RANGE BETWEEN`.
</details>

---

### Câu 18 (Question 18)
**Bạn muốn lấy mức lương của nhân viên có lương cao thứ 2 trong từng phòng ban và hiển thị nó trên mọi dòng của phòng ban đó bằng hàm `NTH_VALUE`. Câu lệnh nào dưới đây là ĐÚNG?**

* A. `NTH_VALUE(salary, 2) OVER (PARTITION BY department_id ORDER BY salary DESC)`
* B. `NTH_VALUE(salary, 2) OVER (PARTITION BY department_id ORDER BY salary DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)`
* C. `NTH_VALUE(2, salary) OVER (PARTITION BY department_id ORDER BY salary DESC)`
* D. `NTH_VALUE(salary, 2) WITHIN GROUP (ORDER BY salary DESC)`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Giống như `LAST_VALUE`, hàm `NTH_VALUE(measure_expr, n)` chịu ảnh hưởng của khung cửa sổ mặc định (`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`). Nếu không mở rộng khung cửa sổ bằng `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`, thì tại dòng thứ 1 của mỗi phòng ban, khung cửa sổ chỉ có 1 dòng nên chưa có dòng thứ 2 $\rightarrow$ `NTH_VALUE(salary, 2)` tại dòng thứ 1 sẽ trả về **`NULL`**! Khi thêm `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`, mọi dòng kể cả dòng số 1 đều nhận được đúng giá trị của dòng thứ 2.
  * **A sai:** Tại dòng đầu tiên của mỗi phòng ban sẽ bị trả về `NULL` do khung mặc định dừng ở `CURRENT ROW`.
  * **C sai:** Ngược thứ tự tham số; tham số thứ nhất phải là cột giá trị `salary`, tham số thứ hai mới là vị trí `n = 2`.
  * **D sai:** `NTH_VALUE` dùng mệnh đề `OVER(...)` chứ không dùng `WITHIN GROUP`.
</details>

---

### Câu 19 (Question 19)
**Mệnh đề đặc biệt `KEEP (DENSE_RANK FIRST ORDER BY ...)` và `KEEP (DENSE_RANK LAST ORDER BY ...)` trong Oracle SQL hoạt động như thế nào trong câu truy vấn dưới đây?**

```sql
SELECT department_id,
       MAX(salary) KEEP (DENSE_RANK FIRST ORDER BY hire_date ASC) AS result_sal
FROM employees
GROUP BY department_id;
```

* A. Tìm nhân viên có mức lương cao nhất trong phòng ban, sau đó trả về ngày `hire_date` của họ.
* B. Trong mỗi phòng ban, lọc ra (các) nhân viên có ngày vào làm sớm nhất (`hire_date` nhỏ nhất — `DENSE_RANK FIRST`), và nếu có nhiều nhân viên cùng vào làm vào ngày sớm nhất đó thì lấy mức lương lớn nhất (`MAX(salary)`) trong số họ.
* C. Báo lỗi vì không thể kết hợp hàm `MAX(salary)` với mệnh đề `ORDER BY hire_date` trên một cột khác.
* D. Sắp xếp kết quả đầu ra theo `hire_date ASC`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Hàm `FIRST / LAST` đi kèm từ khóa `KEEP` là một tính năng cực mạnh của Oracle:
    1. Đầu tiên, trong mỗi nhóm `department_id`, nó xếp hạng theo `ORDER BY hire_date ASC` và giữ lại (`KEEP`) những dòng đứng hạng đầu tiên (`DENSE_RANK FIRST` — tức những người vào làm sớm nhất phòng).
    2. Tiếp theo, trên tập con những người cùng vào làm ngày sớm nhất đó, nó áp dụng hàm tổng hợp đứng ở đầu là `MAX(salary)` để trả về 1 giá trị duy nhất cho mỗi nhóm.
  * **A, C, D sai:** Nhờ `KEEP (DENSE_RANK FIRST/LAST)`, ta có thể xếp hạng theo cột `A` (`hire_date`) nhưng lại lấy giá trị của cột `B` (`salary`) ngay trong một phép `GROUP BY` mà không cần dùng Subquery hay Inline View!
</details>

---

### Câu 20 (Question 20)
**Có thể sử dụng đồng thời cả `GROUP BY` và hàm phân tích (`Analytic Function`) trong cùng một khối `SELECT` hay không? Hãy xem xét câu lệnh sau:**

```sql
SELECT department_id,
       SUM(salary) AS dept_total_sal,
       RANK() OVER (ORDER BY SUM(salary) DESC) AS dept_sal_rank
FROM employees
GROUP BY department_id;
```

* A. Không thể, vì `GROUP BY` và `OVER(...)` không được phép xuất hiện trong cùng một câu lệnh `SELECT`.
* B. Không thể, vì không được phép lồng hàm tổng hợp `SUM(salary)` vào bên trong mệnh đề `OVER (ORDER BY ...)`.
* C. Hoàn toàn hợp lệ! Oracle thực hiện `GROUP BY department_id` và tính `SUM(salary)` cho từng phòng ban trước, sau đó hàm phân tích `RANK() OVER (ORDER BY SUM(salary) DESC)` sẽ chạy trên tập kết quả đã gom nhóm để xếp hạng các phòng ban theo tổng quỹ lương giảm dần.
* D. Chỉ hợp lệ nếu thay `RANK()` bằng `ROWNUM`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Nhớ lại thứ tự thực thi SQL: `GROUP BY` chạy ở **Bước 3**, còn `Analytic Functions` chạy ở **Bước 5** (trên tập các dòng kết quả sau khi đã `GROUP BY` và `HAVING`). Vì vậy, việc lồng một hàm tổng hợp (`SUM(salary)`, `COUNT(*)`, `AVG(salary)`) vào bên trong `OVER (PARTITION BY ... ORDER BY SUM(salary) DESC)` khi truy vấn có `GROUP BY` là **hoàn toàn hợp lệ và cực kỳ hữu ích** trong thực tế!
  * **A, B, D sai:** Điều bị cấm là lồng một hàm phân tích vào bên trong một hàm phân tích khác (ví dụ `SUM(RANK() OVER (...)) OVER (...)` là bị cấm), chứ lồng hàm Aggregate vào trong hàm Analytic thì hoàn toàn hợp lệ!
</details>

---

### Câu 21 (Question 21)
**Xem xét câu lệnh SQL dưới đây. Điều gì sẽ xảy ra khi thực thi?**

```sql
SELECT first_name,
       department_id,
       salary,
       AVG(SUM(salary) OVER (PARTITION BY department_id)) OVER () AS avg_of_dept_sums
FROM employees;
```

* A. Thực thi thành công và tính trung bình của các tổng lương phòng ban.
* B. Báo lỗi `ORA-30483: window functions are not allowed here` vì Oracle SQL không cho phép lồng một hàm phân tích bên trong một hàm phân tích khác.
* C. Báo lỗi vì mệnh đề `OVER ()` rỗng không có `PARTITION BY` là sai cú pháp.
* D. Trả về giá trị `NULL` cho mọi dòng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Mặc dù bạn có thể lồng hàm Aggregate (`SUM(salary)`) vào bên trong hàm Analytic (`RANK() OVER (ORDER BY SUM(salary))`), nhưng bạn **TUYỆT ĐỐI KHÔNG ĐƯỢC PHÉP lồng hai hàm Analytic vào nhau** (`Analytic(Analytic() OVER (...)) OVER (...)`). Nếu muốn tính toán phân tích tầng thứ hai trên kết quả của hàm phân tích tầng thứ nhất, bắt buộc phải đẩy hàm phân tích tầng thứ nhất vào một CTE (`WITH`) hoặc Inline View.
  * **A, C, D sai:** Mệnh đề `OVER ()` rỗng là hoàn toàn hợp lệ (coi toàn bộ bảng là 1 phân vùng duy nhất), lỗi ở đây là do lồng 2 hàm `OVER()` vào nhau.
</details>

---

### Câu 22 (Question 22)
**Trong bảng `EMPLOYEES`, có một số nhân viên có cột `COMMISSION_PCT` là `NULL`. Khi bạn thực hiện sắp xếp `ORDER BY commission_pct DESC` bên trong mệnh đề `OVER (ORDER BY commission_pct DESC)` mà không ghi rõ `NULLS FIRST` hay `NULLS LAST`, các dòng có `COMMISSION_PCT IS NULL` sẽ được xếp ở đâu và nhận thứ hạng mấy đối với hàm `RANK()`?**

* A. Xếp ở cuối cùng và nhận thứ hạng lớn nhất.
* B. Xếp ở đầu tiên (trên cùng) và cùng nhận thứ hạng `1` (`RANK = 1`), vì trong Oracle mặc định `NULL` được coi là lớn nhất khi sắp xếp giảm dần (`DESC`).
* C. Các dòng có `COMMISSION_PCT IS NULL` bị bỏ qua và nhận `RANK = NULL`.
* D. Báo lỗi vì không thể dùng `RANK()` trên cột có chứa giá trị `NULL`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong Oracle SQL, đối với mọi mệnh đề `ORDER BY` (cả ở cuối câu truy vấn lẫn bên trong `OVER(...)`), các giá trị **`NULL` mặc định được coi là LỚN NHẤT** (`ASC` thì `NULLS LAST`, còn **`DESC` thì `NULLS FIRST`**). Ngoài ra, trong các hàm xếp hạng (`RANK`, `DENSE_RANK`), các giá trị `NULL` được coi là đồng hạng (bằng nhau). Do đó khi `ORDER BY commission_pct DESC`, toàn bộ các dòng `NULL` sẽ nhảy lên đầu tiên và cùng nhận **`RANK = 1`**! Để đẩy `NULL` xuống cuối khi sắp xếp giảm dần, bạn phải viết tường minh: `ORDER BY commission_pct DESC NULLS LAST`.
  * **A, C, D sai:** Đây là bẫy rất thực tế khi xếp hạng các cột có chứa `NULL` trong Oracle.
</details>

---

### Câu 23 (Question 23)
**Cho bảng `DAILY_SALES` có cột `SALE_DATE` (kiểu `DATE`) và cột `AMOUNT` (kiểu `NUMBER`). Bạn muốn tính tổng doanh thu của ngày hiện tại cộng với các giao dịch phát sinh trong vòng 7 ngày trước đó (theo lịch ngày tháng thực tế, kể cả khi có những ngày không phát sinh giao dịch nào). Cú pháp Window Frame nào sau đây đáp ứng chính xác yêu cầu?**

* A. `SUM(amount) OVER (ORDER BY sale_date ROWS BETWEEN 7 PRECEDING AND CURRENT ROW)`
* B. `SUM(amount) OVER (ORDER BY sale_date RANGE BETWEEN INTERVAL '7' DAY PRECEDING AND CURRENT ROW)`
* C. `SUM(amount) OVER (PARTITION BY sale_date ROWS 7 PRECEDING)`
* D. `SUM(amount) OVER (ORDER BY sale_date ROWS BETWEEN INTERVAL '7' DAY PRECEDING AND CURRENT ROW)`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Vì có những ngày không phát sinh giao dịch (khuyết ngày) hoặc một ngày có nhiều giao dịch, ta phải tính theo **khoảng giá trị ngày tháng thực tế (`RANGE`)** thay vì đếm số dòng vật lý (`ROWS`). Với cột `sale_date` kiểu `DATE`, cú pháp `RANGE BETWEEN INTERVAL '7' DAY PRECEDING AND CURRENT ROW` (hoặc `RANGE BETWEEN 7 PRECEDING AND CURRENT ROW`) sẽ cộng chính xác các dòng có `sale_date` nằm trong đoạn `[current_sale_date - 7 days, current_sale_date]`.
  * **A sai:** `ROWS BETWEEN 7 PRECEDING` đếm 7 dòng vật lý trước đó (có thể kéo dài tới 1 tháng trước nếu ít giao dịch, hoặc chỉ trong cùng 1 ngày nếu ngày đó có 10 giao dịch).
  * **C sai:** `PARTITION BY sale_date` sẽ tách mỗi ngày thành một nhóm riêng biệt, không thể cộng sang các ngày trước.
  * **D sai:** Từ khóa `ROWS` không thể đi kèm với `INTERVAL '7' DAY`.
</details>

---

### Câu 24 (Question 24)
**Ngoài việc sử dụng như một hàm phân tích (`OVER`), các hàm `RANK`, `DENSE_RANK`, `PERCENT_RANK`, và `CUME_DIST` còn có thể được dùng như một hàm tổng hợp giả định (Hypothetical Set Aggregate Function) với mệnh đề `WITHIN GROUP`. Câu lệnh dưới đây trả về kết quả gì?**

```sql
SELECT RANK(7500) WITHIN GROUP (ORDER BY salary DESC) AS hypo_rank
FROM emp_sales
WHERE dept_id = 10;
```
*(Biết phòng `10` có 4 nhân viên với mức lương: `9000`, `7000`, `7000`, `5000`).*

* A. Trả về `2` (thứ hạng giả định của một nhân viên nếu người đó có mức lương `7500` được chèn vào phòng ban `10`).
* B. Trả về `7500`.
* C. Báo lỗi vì mức lương `7500` không tồn tại trong bảng `EMP_SALES`.
* D. Báo lỗi vì `RANK` chỉ được đi kèm với từ khóa `OVER`, không bao giờ đi với `WITHIN GROUP`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Cú pháp `RANK(constant_expr) WITHIN GROUP (ORDER BY col)` là dạng **Aggregate (Hypothetical Rank)** của hàm `RANK`: nó trả lời câu hỏi *"Nếu chèn một dòng giả định có lương bằng `7500` vào tập dữ liệu hiện tại (`9000, 7000, 7000, 5000`), thì dòng `7500` đó sẽ đứng hạng mấy theo thứ tự giảm dần?"*. Vì `9000` đứng hạng 1, nên `7500` sẽ đứng ngay sau `9000` và nhận **hạng `2`**.
  * **B, C, D sai:** Lưu ý phân biệt 2 dạng cú pháp:
    * Dạng Analytic: `RANK() OVER (ORDER BY salary DESC)` — **không có tham số** trong `RANK()`.
    * Dạng Aggregate: `RANK(7500) WITHIN GROUP (ORDER BY salary DESC)` — **có tham số** trong `RANK(...)` và đi với `WITHIN GROUP`.
</details>

---

### Câu 25 (Question 25)
**Trong một câu truy vấn có sử dụng đồng thời nhiều hàm phân tích với các mệnh đề `PARTITION BY` và `ORDER BY` khác nhau, mệnh đề `ORDER BY` cuối cùng của toàn bộ câu truy vấn (nếu không được viết tường minh) sẽ được đảm bảo theo thứ tự nào?**

```sql
SELECT emp_id,
       ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn_sal,
       ROW_NUMBER() OVER (PARTITION BY job_id  ORDER BY hire_date ASC) AS rn_hire
FROM employees;
```

* A. Luôn được đảm bảo sắp xếp theo `ORDER BY` của hàm phân tích đầu tiên (`dept_id, salary DESC`).
* B. Luôn được đảm bảo sắp xếp theo `ORDER BY` của hàm phân tích cuối cùng (`job_id, hire_date ASC`).
* C. Không được đảm bảo theo một thứ tự cố định nào! Mệnh đề `ORDER BY` bên trong `OVER(...)` chỉ phục vụ việc tính toán cho riêng hàm phân tích đó; muốn đảm bảo thứ tự hiển thị kết quả cuối cùng bắt buộc phải có mệnh đề `ORDER BY` ở cuối câu lệnh `SELECT`.
* D. Luôn được sắp xếp theo khóa chính (`PRIMARY KEY`) của bảng `EMPLOYEES`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là câu hỏi lý thuyết rất hay gặp trong đề thi chứng chỉ Oracle! Mệnh đề `ORDER BY` nằm bên trong `OVER(...)` chỉ xác định thứ tự các dòng bên trong phân vùng để tính giá trị của riêng hàm phân tích đó. Khi có nhiều hàm phân tích khác nhau (hoặc khi dùng thực thi song song - Parallel Execution / Hash Partitioning), thứ tự các dòng trả về ra màn hình là **không xác định (non-deterministic)** trừ khi bạn viết mệnh đề **`ORDER BY` ở cấp ngoài cùng** của câu lệnh `SELECT`.
  * **A, B, D sai:** Trong SQL, chỉ duy nhất mệnh đề `ORDER BY` của truy vấn ngoài cùng mới cam kết thứ tự hiển thị kết quả đầu ra.
</details>

---
