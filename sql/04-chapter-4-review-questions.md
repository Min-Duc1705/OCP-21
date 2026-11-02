# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 4: Điều Kiện Lọc Dữ Liệu và Logic Ba Giá Trị

> **Tài liệu tham chiếu:** *OCA/OCP Oracle Database SQL Study Guide (Exam 1Z0-071) & Ngân hàng câu hỏi sát hạch CNTT VNPT*.  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết.  
> **Cách học:** Bạn hãy tự đọc đề và chọn đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và nắm vững bẫy thi.

---

### Câu 1 (Question 1)
**Toán tử so sánh "Khác" (Not Equal) nào dưới đây KHÔNG HỢP LỆ trong Oracle SQL?**

* A. `<>`
* B. `!=`
* C. `^=`
* D. `! =` (có khoảng trắng ở giữa dấu chấm than và dấu bằng)

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng (Không hợp lệ):** Trong Oracle SQL, toán tử gồm 2 ký tự như `!=`, `<>`, `^=`, `>=`, `<=` bắt buộc phải được viết liền nhau, **tuyệt đối không được có khoảng trắng ở giữa**. Nếu viết `! =`, Oracle sẽ báo lỗi cú pháp `ORA-00920: invalid relational operator`.
  * **A, B, C sai (Đều hợp lệ):** Oracle hỗ trợ cả 3 cách viết toán tử "Khác" là `<>` (chuẩn ANSI SQL), `!=`, và `^=`.
</details>

---

### Câu 2 (Question 2)
**Giả sử bảng `EMPLOYEES` có 107 dòng, trong đó có 72 dòng có cột `COMMISSION_PCT` là `NULL` và 35 dòng có giá trị số cụ thể. Khi bạn thực thi câu truy vấn dưới đây, kết quả sẽ là gì?**

```sql
SELECT employee_id, last_name, commission_pct
FROM employees
WHERE commission_pct = NULL;
```

* A. Trả về `72` dòng có `commission_pct` là `NULL`.
* B. Trả về `0` dòng (không có dòng nào được chọn) và KHÔNG báo lỗi.
* C. Báo lỗi cú pháp vì không được phép dùng dấu `=` trước từ khóa `NULL`.
* D. Trả về toàn bộ `107` dòng trong bảng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng (`0` dòng và không báo lỗi):**
    1. Về mặt cú pháp, biểu thức `commission_pct = NULL` (hoặc `commission_pct <> NULL`) **hoàn toàn hợp lệ** và không gây lỗi biên dịch.
    2. Tuy nhiên, về mặt ngữ nghĩa trong Logic 3 giá trị (Three-Valued Logic), bất kỳ phép so sánh bằng `=` hay khác `<>` nào với `NULL` đều luôn trả về **`UNKNOWN`**.
    3. Vì mệnh đề `WHERE` chỉ giữ lại các dòng có điều kiện đánh giá ra `TRUE`, nên toàn bộ 107 dòng đều bị loại bỏ và câu lệnh trả về **0 dòng**. Để lấy 72 dòng `NULL`, bắt buộc phải viết `WHERE commission_pct IS NULL`.
  * **A, C, D sai:** Rất nhiều thí sinh chọn nhầm A (tưởng lấy được dòng `NULL`) hoặc C (tưởng báo lỗi cú pháp).
</details>

---

### Câu 3 (Question 3)
**Trong Logic ba giá trị (Three-Valued Logic) của SQL, kết quả của 3 biểu thức logic `(TRUE OR UNKNOWN)`, `(FALSE AND UNKNOWN)`, và `(NOT UNKNOWN)` lần lượt là gì?**

* A. `TRUE`, `FALSE`, `UNKNOWN`
* B. `UNKNOWN`, `UNKNOWN`, `TRUE`
* C. `TRUE`, `UNKNOWN`, `FALSE`
* D. `UNKNOWN`, `FALSE`, `UNKNOWN`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng (`TRUE`, `FALSE`, `UNKNOWN`):**
    1. **`TRUE OR UNKNOWN` = `TRUE`:** Trong phép tuyển (`OR`), chỉ cần 1 vế là `TRUE` thì cả biểu thức chắc chắn là `TRUE`, bất kể vế còn lại là gì.
    2. **`FALSE AND UNKNOWN` = `FALSE`:** Trong phép hội (`AND`), chỉ cần 1 vế là `FALSE` thì cả biểu thức chắc chắn là `FALSE`, bất kể vế còn lại là gì.
    3. **`NOT UNKNOWN` = `UNKNOWN`:** Phủ định của một giá trị chưa xác định (`UNKNOWN`) vẫn là chưa xác định (`UNKNOWN`)!
  * **B, C, D sai:** Đây là 3 quy tắc nền tảng của bảng chân trị SQL cần thuộc lòng để giải mọi bài toán về `NULL`.
</details>

---

### Câu 4 (Question 4)
**Cho bảng `EMPLOYEES` có nhân viên `Grant` với `department_id = NULL` và `salary = 7000`. Câu truy vấn nào dưới đây sẽ trả về dòng của nhân viên `Grant`?**

* A. `SELECT last_name FROM employees WHERE department_id = 80 AND salary = 7000;`
* B. `SELECT last_name FROM employees WHERE department_id <> 80 AND salary = 7000;`
* C. `SELECT last_name FROM employees WHERE department_id = 80 OR salary = 7000;`
* D. `SELECT last_name FROM employees WHERE NOT (department_id = 80);`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Với nhân viên `Grant` (`department_id = NULL`, `salary = 7000`):
    * Vế trái `department_id = 80` (`NULL = 80`) đánh giá ra **`UNKNOWN`**.
    * Vế phải `salary = 7000` (`7000 = 7000`) đánh giá ra **`TRUE`**.
    * Kết hợp bằng toán tử `OR`: `UNKNOWN OR TRUE` $\rightarrow$ **`TRUE`**! Do đó dòng của `Grant` được trả về.
  * **A và B sai:** Đều có dạng `UNKNOWN AND TRUE` $\rightarrow$ **`UNKNOWN`** (bị loại).
  * **D sai:** Có dạng `NOT (UNKNOWN)` $\rightarrow$ **`UNKNOWN`** (bị loại).
</details>

---

### Câu 5 (Question 5)
**Cho bảng `DEPARTMENTS` có 4 dòng dữ liệu với cột `DEPARTMENT_ID` lần lượt là `10`, `20`, `30`, `40`. Câu truy vấn dưới đây sẽ trả về bao nhiêu dòng?**

```sql
SELECT department_id
FROM departments
WHERE department_id IN (10, 20, NULL);
```

* A. `0` dòng (vì trong danh sách `IN` có chứa `NULL`)
* B. `2` dòng (`10` và `20`)
* C. `3` dòng (`10`, `20`, và `NULL`)
* D. Báo lỗi cú pháp vì không được viết trực tiếp từ khóa `NULL` bên trong mệnh đề `IN`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng (`2` dòng: `10` và `20`):**
    * Toán tử `IN` được Oracle khai triển thành chuỗi các phép toán **`OR`**:
      `WHERE department_id = 10 OR department_id = 20 OR department_id = NULL`
    * Với dòng `10`: `TRUE OR FALSE OR UNKNOWN` $\rightarrow$ **`TRUE`** (Được chọn!).
    * Với dòng `20`: `FALSE OR TRUE OR UNKNOWN` $\rightarrow$ **`TRUE`** (Được chọn!).
    * Với dòng `30` và `40`: `FALSE OR FALSE OR UNKNOWN` $\rightarrow$ **`UNKNOWN`** (Bị loại!).
    * Do đó, câu truy vấn vẫn trả về bình thường **2 dòng (`10` và `20`)**.
  * **A, C, D sai:** Thí sinh thường nhầm lẫn hành vi của `IN (..., NULL)` (vẫn trả về dòng khớp) với `NOT IN (..., NULL)` (trả về 0 dòng).
</details>

---

### Câu 6 (Question 6)
**Cũng với bảng `DEPARTMENTS` gồm 4 dòng có `DEPARTMENT_ID` là `10`, `20`, `30`, `40`. Câu truy vấn sử dụng `NOT IN` dưới đây sẽ trả về bao nhiêu dòng?**

```sql
SELECT department_id
FROM departments
WHERE department_id NOT IN (10, 20, NULL);
```

* A. `2` dòng (`30` và `40`)
* B. `4` dòng (`10`, `20`, `30`, `40`)
* C. `0` dòng (không có dòng nào được trả về)
* D. Báo lỗi `ORA-00932` khi thực thi.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (`0` dòng):** Đây là bẫy kinh điển nhất trong mọi kỳ thi Oracle SQL (OCA/OCP 1Z0-071 và sát hạch VNPT)!
    * Toán tử `NOT IN` được khai triển thành chuỗi các phép toán **`AND`**:
      `WHERE department_id <> 10 AND department_id <> 20 AND department_id <> NULL`
    * Xét dòng `30` (hoặc `40`):
      * `30 <> 10` $\rightarrow$ `TRUE`
      * `30 <> 20` $\rightarrow$ `TRUE`
      * `30 <> NULL` $\rightarrow$ **`UNKNOWN`**
      * Kết hợp lại: `TRUE AND TRUE AND UNKNOWN` = **`UNKNOWN`**!
    * Vì không có dòng nào đạt giá trị `TRUE`, toàn bộ các dòng đều bị loại bỏ và câu truy vấn trả về **0 dòng**!
  * **A, B, D sai:** Hãy luôn nhớ quy tắc: **`NOT IN` mà gặp `NULL` trong tập danh sách thì kết quả luôn luôn là 0 dòng!**
</details>

---

### Câu 7 (Question 7)
**Mệnh đề lọc `WHERE salary BETWEEN 4000 AND 8000` hoàn toàn tương đương với điều kiện nào dưới đây?**

* A. `WHERE salary > 4000 AND salary < 8000`
* B. `WHERE salary >= 4000 AND salary <= 8000`
* C. `WHERE salary >= 4000 OR salary <= 8000`
* D. `WHERE salary > 4000 OR salary < 8000`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Toán tử `BETWEEN low_value AND high_value` luôn **bao gồm cả hai giá trị đầu mút (inclusive)**, tức tương đương với `col >= low_value AND col <= high_value`. Những nhân viên có lương đúng bằng `4000` hoặc đúng bằng `8000` đều được lấy.
  * **A sai:** Thiếu dấu bằng ở hai đầu mút.
  * **C và D sai:** Dùng phép `OR` sẽ lấy toàn bộ mọi con số trên trục số thực.
</details>

---

### Câu 8 (Question 8)
**Khi một lập trình viên viết ngược cận lớn đứng trước cận nhỏ trong mệnh đề `BETWEEN` như câu truy vấn dưới đây, điều gì sẽ xảy ra?**

```sql
SELECT employee_id, last_name, salary
FROM employees
WHERE salary BETWEEN 10000 AND 5000;
```

* A. Oracle tự động đảo lại thành `BETWEEN 5000 AND 10000` và trả về các nhân viên có lương từ 5000 đến 10000.
* B. Báo lỗi cú pháp vì giá trị đầu tiên trong `BETWEEN` lớn hơn giá trị thứ hai.
* C. Thực thi thành công mà không báo lỗi, nhưng trả về `0` dòng dữ liệu.
* D. Trả về các nhân viên có lương ngoài khoảng từ 5000 đến 10000 (tương đương `NOT BETWEEN`).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (`0` dòng và không báo lỗi):** Oracle dịch máy móc biểu thức `salary BETWEEN A AND B` thành `salary >= A AND salary <= B`. Do đó, `salary BETWEEN 10000 AND 5000` được dịch thành:
    `WHERE salary >= 10000 AND salary <= 5000`.
    Về mặt cú pháp câu lệnh hoàn toàn hợp lệ, nhưng vì không có số nào vừa $\ge 10000$ vừa $\le 5000$, nên câu lệnh luôn trả về **0 dòng**.
  * **A, B, D sai:** Oracle không bao giờ tự động đổi chỗ hai cận của `BETWEEN`.
</details>

---

### Câu 9 (Question 9)
**Mệnh đề `WHERE NOT (salary BETWEEN 3000 AND 6000)` tương đương với biểu thức nào dưới đây?**

* A. `WHERE salary < 3000 AND salary > 6000`
* B. `WHERE salary <= 3000 OR salary >= 6000`
* C. `WHERE salary < 3000 OR salary > 6000`
* D. `WHERE salary <= 3000 AND salary >= 6000`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Theo định luật De Morgan:
    * `NOT (salary >= 3000 AND salary <= 6000)`
    * $\equiv$ `NOT (salary >= 3000) OR NOT (salary <= 6000)`
    * $\equiv$ **`salary < 3000 OR salary > 6000`**.
  * **A, D sai:** Dùng `AND` khiến không có số nào thỏa mãn.
  * **B sai:** Dư dấu `=` ở hai đầu mút (vì `3000` và `6000` nằm trong `BETWEEN`, nên khi phủ định `NOT BETWEEN` thì không lấy `3000` và `6000`).
</details>

---

### Câu 10 (Question 10)
**Bạn muốn tìm tất cả các nhân viên có tên (`FIRST_NAME`) mà chữ cái thứ hai là `'a'` (chữ a thường) và tên phải có độ dài ít nhất từ 3 ký tự trở lên. Điều kiện `LIKE` nào dưới đây đáp ứng chính xác yêu cầu này?**

* A. `WHERE first_name LIKE '_a%'`
* B. `WHERE first_name LIKE '_a_%'`
* C. `WHERE first_name LIKE '%a_'`
* D. `WHERE first_name LIKE '__a%'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng (`LIKE '_a_%'`):** Hãy đếm số ký tự tối thiểu:
    * Dấu `_` đầu tiên: Bắt buộc có **1 ký tự** ở vị trí thứ nhất.
    * Chữ `'a'`: Ký tự thứ hai bắt buộc là `'a'`.
    * Dấu `_` tiếp theo: Bắt buộc có thêm **ít nhất 1 ký tự** ở vị trí thứ ba!
    * Dấu `%` cuối cùng: Theo sau bởi 0 hoặc nhiều ký tự bất kỳ.
    $\rightarrow$ Tổng độ dài tối thiểu của chuỗi khớp với `'_a_%'` là `1 + 1 + 1 + 0 = 3` ký tự và chữ cái thứ 2 là `'a'`!
  * **A sai:** `'_a%'` khớp cả với chuỗi chỉ có 2 ký tự (ví dụ `'Ma'`), vì `%` có thể đại diện cho 0 ký tự.
  * **C sai:** `'%a_'` tìm chữ `'a'` ở vị trí áp chót (thứ 2 từ cuối lên).
  * **D sai:** `'__a%'` tìm chữ `'a'` ở vị trí thứ 3.
</details>

---

### Câu 11 (Question 11)
**Giả sử bảng `CUSTOMERS` có 100 dòng, trong đó có 15 dòng có cột `ADDRESS` là `NULL` và 85 dòng có địa chỉ cụ thể. Câu truy vấn dưới đây sẽ trả về bao nhiêu dòng?**

```sql
SELECT customer_id, address
FROM customers
WHERE address LIKE '%';
```

* A. `100` dòng (lấy tất cả các dòng kể cả `NULL`)
* B. `85` dòng (chỉ lấy các dòng khác `NULL`)
* C. `15` dòng (chỉ lấy các dòng `NULL`)
* D. `0` dòng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng (`85` dòng):** Đây là bẫy rất hay trong đề thi 1Z0-071:
    * Mặc dù ký tự `%` đại diện cho 0, 1 hoặc nhiều ký tự, nhưng toán tử `LIKE` vẫn là một toán tử so sánh.
    * Khi cột `address` mang giá trị **`NULL`**, biểu thức `NULL LIKE '%'` đánh giá ra **`UNKNOWN`** (không phải `TRUE`!) nên 15 dòng `NULL` bị loại bỏ!
    * Do đó, `WHERE address LIKE '%'` chỉ trả về **85 dòng khác `NULL`**.
  * **A, C, D sai:** Không nhận ra rằng `NULL LIKE '%'` trả về `UNKNOWN`.
</details>

---

### Câu 12 (Question 12)
**Bạn cần tìm các mã công việc (`JOB_ID`) trong bảng `JOBS` có chứa chuỗi ký tự thực tế là `'_M'` (dấu gạch dưới theo sau là chữ M hoa, ví dụ `'SA_MAN'`, `'AC_MGR'`). Câu truy vấn nào dưới đây thực hiện ĐÚNG yêu cầu này?**

* A. `SELECT job_id FROM jobs WHERE job_id LIKE '%_M%';`
* B. `SELECT job_id FROM jobs WHERE job_id LIKE '%\_M%';`
* C. `SELECT job_id FROM jobs WHERE job_id LIKE '%\_M%' ESCAPE '\';`
* D. `SELECT job_id FROM jobs WHERE job_id LIKE '%$_M%' ESCAPE '$_';`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Để coi dấu `_` là một ký tự gạch dưới bình thường thay vì ký tự đại diện (wildcard), bạn phải đặt một ký tự thoát (như `\`) ngay trước dấu `_` VÀ **bắt buộc phải khai báo mệnh đề `ESCAPE '\'`** ở cuối điều kiện `LIKE`.
  * **A sai:** Không có `ESCAPE`, dấu `_` sẽ khớp với bất kỳ ký tự nào đứng trước chữ `'M'` (ví dụ `'ADMIN'` cũng bị lấy!).
  * **B sai:** Trong Oracle SQL **không có ký tự escape mặc định**. Nếu viết `LIKE '%\_M%'` mà thiếu `ESCAPE '\'`, Oracle sẽ đi tìm các chuỗi có chứa dấu gạch chéo ngược `\` thật sự!
  * **D sai:** Chuỗi khai báo sau từ khóa `ESCAPE` chỉ được phép có độ dài **đúng 1 ký tự** (`ESCAPE '$_'` dài 2 ký tự sẽ báo lỗi `ORA-01425`).
</details>

---

### Câu 13 (Question 13)
**Cho câu truy vấn dưới đây sử dụng mệnh đề `ESCAPE` để tìm các chương trình khuyến mãi có chứa ký tự phần trăm `%` thực tế trong tên:**

```sql
SELECT promo_name
FROM promotions
WHERE promo_name LIKE '%##%%' ESCAPE '#';
```

**Mẫu chuỗi `'%##%%' ESCAPE '#'` ở trên thực sự sẽ tìm các `promo_name` có chứa chuỗi ký tự gì?**

* A. Có chứa một ký tự `%` ở bất kỳ vị trí nào.
* B. Có chứa hai ký tự `##` ở bất kỳ vị trí nào.
* C. Có chứa một ký tự `#` ở bất kỳ vị trí nào (không bắt buộc có ký tự `%`).
* D. Báo lỗi vì không được phép viết hai ký tự `##` liên tiếp khi `#` là ký tự `ESCAPE`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Hãy phân tách từng ký tự trong mẫu `'%##%%'` khi ký tự thoát là `'#'`:
    1. Dấu `%` đầu tiên: Ký tự đại diện (0 hoặc nhiều ký tự bất kỳ).
    2. Cặp `##` ở giữa: Ký tự `#` thứ nhất đóng vai trò là ký tự `ESCAPE` cho ký tự `#` thứ hai! Điều này biến `#` thứ hai thành **một ký tự dấu thăng `#` thực sự (literal `#`)**!
    3. Hai dấu `%%` ở cuối: Vì dấu `#` thứ hai đã bị tiêu thụ làm ký tự thường rồi, nên cả hai dấu `%` ở cuối đều là ký tự đại diện (wildcard)!
    $\rightarrow$ Kết quả: Mẫu `'%##%%' ESCAPE '#'` thực chất đang tìm các chuỗi **có chứa ký tự `'#'`**, chứ không phải tìm ký tự `'%'`! (Muốn tìm `'#%'` phải viết `'%###%%' ESCAPE '#'`, còn muốn tìm `'%'` chỉ cần viết `'%#%%' ESCAPE '#'`).
  * **A, B, D sai:** Đây là câu hỏi phân loại mức độ OCP cực hay về cách ký tự `ESCAPE` tự thoát chính nó.
</details>

---

### Câu 14 (Question 14)
**Thứ tự ưu tiên (Operator Precedence) nào dưới đây là ĐÚNG khi sắp xếp từ mức ưu tiên CAO NHẤT đến mức ưu tiên THẤP NHẤT trong Oracle SQL?**

* A. Toán tử số học (`*`, `/`, `+`, `-`) $\rightarrow$ Toán tử so sánh (`=`, `>`, `<`) $\rightarrow$ `AND` $\rightarrow$ `OR` $\rightarrow$ `NOT`
* B. Toán tử số học (`*`, `/`, `+`, `-`) $\rightarrow$ Toán tử so sánh (`=`, `>`, `<`) $\rightarrow$ `NOT` $\rightarrow$ `AND` $\rightarrow$ `OR`
* C. Toán tử so sánh (`=`, `>`, `<`) $\rightarrow$ Toán tử số học (`*`, `/`, `+`, `-`) $\rightarrow$ `NOT` $\rightarrow$ `OR` $\rightarrow$ `AND`
* D. `NOT` $\rightarrow$ `AND` $\rightarrow$ `OR` $\rightarrow$ Toán tử so sánh (`=`, `>`, `<`) $\rightarrow$ Toán tử số học (`*`, `/`, `+`, `-`)

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Thứ tự ưu tiên chuẩn từ cao xuống thấp (khi không có dấu ngoặc đơn `()`) luôn là:
    1. **Toán tử số học** (`*`, `/` trước, `+`, `-` sau) để tính ra giá trị các biểu thức.
    2. **Toán tử so sánh** (`=`, `<>`, `<`, `>`, `IN`, `BETWEEN`, `LIKE`, `IS NULL`) để tạo ra các mệnh đề logic `TRUE`/`FALSE`/`UNKNOWN`.
    3. **Toán tử phủ định `NOT`**.
    4. **Toán tử hội `AND`**.
    5. **Toán tử tuyển `OR`** (thấp nhất).
  * **A, C, D sai:** Sai thứ tự giữa các nhóm hoặc giữa `NOT`, `AND`, `OR`.
</details>

---

### Câu 15 (Question 15)
**Hãy xem xét câu truy vấn không có dấu ngoặc đơn dưới đây:**

```sql
SELECT employee_id, job_id, salary
FROM employees
WHERE job_id = 'IT_PROG' OR job_id = 'FI_ACCOUNT' AND salary > 8000;
```

**Nhân viên nào sau đây sẽ ĐƯỢC TRẢ VỀ trong kết quả của câu truy vấn trên? (Chọn tất cả các đáp án đúng)**

* A. Nhân viên có `job_id = 'IT_PROG'` và `salary = 4200`.
* B. Nhân viên có `job_id = 'FI_ACCOUNT'` và `salary = 6500`.
* C. Nhân viên có `job_id = 'FI_ACCOUNT'` và `salary = 9000`.
* D. Nhân viên có `job_id = 'SA_REP'` và `salary = 12000`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C**
* **Giải thích chuyên sâu:**
  * **A và C đúng:**
    * Vì toán tử **`AND` có độ ưu tiên cao hơn `OR`**, Oracle đánh giá cụm `AND` trước, tương đương với:
      `WHERE (job_id = 'IT_PROG') OR (job_id = 'FI_ACCOUNT' AND salary > 8000)`
    * **Đáp án A (`job_id = 'IT_PROG'`, `salary = 4200`):** Thỏa mãn ngay vế trái của phép `OR` (`job_id = 'IT_PROG'` là `TRUE`), không cần quan tâm mức lương là bao nhiêu $\rightarrow$ **Được chọn!**
    * **Đáp án C (`job_id = 'FI_ACCOUNT'`, `salary = 9000`):** Thỏa mãn vế phải của phép `OR` (vừa là `'FI_ACCOUNT'` vừa có lương `9000 > 8000`) $\rightarrow$ **Được chọn!**
  * **B sai:** Là `'FI_ACCOUNT'` nhưng lương `6500 <= 8000` nên cả hai vế của `OR` đều `FALSE`.
  * **D sai:** `job_id = 'SA_REP'` làm cả hai vế của `OR` đều `FALSE`.
</details>

---

### Câu 16 (Question 16)
**Cho bảng `PRODUCTS` gồm 3 dòng dữ liệu như sau:**

| PROD_ID | CATEGORY | PRICE |
| :---: | :--- | :---: |
| 1 | A | 100 |
| 2 | B | 200 |
| 3 | C | 300 |

**Khi thực thi câu truy vấn dưới đây, những `PROD_ID` nào sẽ được trả về?**

```sql
SELECT prod_id
FROM products
WHERE NOT category = 'A' AND price = 200 OR price = 300;
```

* A. Chỉ có `2`
* B. `2` và `3`
* C. `1`, `2` và `3`
* D. Chỉ có `3`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng (`2` và `3`):** Áp dụng đúng thứ tự ưu tiên `NOT` $\rightarrow$ `AND` $\rightarrow$ `OR`, biểu thức điều kiện được đóng ngoặc tương đương như sau:
    `WHERE ((NOT (category = 'A')) AND (price = 200)) OR (price = 300)`
    * **Dòng 1 (`A`, `100`):** `((NOT TRUE) AND FALSE) OR FALSE` = `FALSE` (Loại).
    * **Dòng 2 (`B`, `200`):** `((NOT FALSE) AND TRUE) OR FALSE` = `(TRUE AND TRUE) OR FALSE` = **`TRUE`** (Được chọn!).
    * **Dòng 3 (`C`, `300`):** Vế sau của `OR` là `price = 300` (`TRUE`), nên cả biểu thức `OR` là **`TRUE`** (Được chọn!).
  * **A, C, D sai:** Nhầm thứ tự áp dụng của `NOT`, `AND` và `OR`.
</details>

---

### Câu 17 (Question 17)
**Khi sử dụng toán tử `BETWEEN ... AND ...` cho kiểu dữ liệu chuỗi ký tự như `WHERE last_name BETWEEN 'A' AND 'C'`, tên nào dưới đây sẽ ĐƯỢC CHỌN vào kết quả?**

* A. `'Adams'` và `'Clark'`
* B. `'Adams'`, `'Bell'`, và `'C'` (nhưng KHÔNG chọn `'Clark'`)
* C. Chỉ chọn các tên có độ dài đúng 1 ký tự là `'A'`, `'B'`, `'C'`
* D. Báo lỗi vì `BETWEEN` chỉ dùng cho kiểu `NUMBER` và `DATE`, không dùng được cho `VARCHAR2`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Toán tử `BETWEEN 'A' AND 'C'` tương đương với `last_name >= 'A' AND last_name <= 'C'` theo thứ tự bảng chữ cái ASCII:
    * `'Adams'` $\ge$ `'A'` và `'Adams'` $\le$ `'C'` (vì ký tự đầu `'A'` < `'C'`) $\rightarrow$ **Khớp!**
    * `'Bell'` $\ge$ `'A'` và `'Bell'` $\le$ `'C'` (vì `'B'` nằm giữa `'A'` và `'C'`) $\rightarrow$ **Khớp!**
    * `'C'` $\ge$ `'A'` và `'C'` $\le$ `'C'` $\rightarrow$ **Khớp!**
    * **Tại sao `'Clark'` KHÔNG khớp?** Vì khi so sánh `'Clark'` với `'C'`, ký tự đầu tiên bằng nhau (`'C' = 'C'`), nhưng chuỗi `'Clark'` dài hơn `'C'` (có thêm `'lark'`), nên **`'Clark' > 'C'`**! Do đó `'Clark'` vượt ra ngoài cận trên `'C'` và bị loại!
  * **A, C, D sai:** Đây là bẫy thực tế cực kỳ phổ biến khi lọc chuỗi hoặc lọc ngày giờ có chứa giờ-phút-giây bằng `BETWEEN`.
</details>

---

### Câu 18 (Question 18)
**Cột `ORDER_DATE` trong bảng `ORDERS` có kiểu dữ liệu `DATE` và lưu cả thời gian giờ:phút:giây (ví dụ có đơn hàng lúc `15-MAY-2026 14:30:00`). Nếu bạn chạy câu truy vấn dưới đây, chuyện gì sẽ xảy ra với đơn hàng lúc `15-MAY-2026 14:30:00` đó?**

```sql
SELECT order_id, order_date
FROM orders
WHERE order_date BETWEEN TO_DATE('01-MAY-2026', 'DD-MON-YYYY')
                     AND TO_DATE('15-MAY-2026', 'DD-MON-YYYY');
```

* A. Đơn hàng đó được chọn bình thường vì ngày là `15-MAY-2026`.
* B. Đơn hàng đó BỊ BỎ SÓT (không được chọn) vì `TO_DATE('15-MAY-2026', 'DD-MON-YYYY')` có phần giờ mặc định là `00:00:00` (đầu ngày), trong khi đơn hàng phát sinh lúc `14:30:00` lớn hơn `00:00:00`!
* C. Câu truy vấn báo lỗi vì `BETWEEN` không chấp nhận hàm `TO_DATE`.
* D. Tất cả các đơn hàng trong ngày `01-MAY-2026` cũng bị bỏ sót.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Như đã học ở Chương 2, kiểu `DATE` trong Oracle luôn lưu cả giờ, phút, giây. Khi bạn gọi `TO_DATE('15-MAY-2026', 'DD-MON-YYYY')` mà không truyền giờ, Oracle gán phần giờ mặc định là **`00:00:00`** (nửa đêm đầu ngày 15/05).
  * Do đó, điều kiện `<= 15-MAY-2026 00:00:00` sẽ **bỏ sót toàn bộ các đơn hàng phát sinh từ `00:00:01` đến `23:59:59` trong ngày 15/05/2026** (bao gồm đơn lúc `14:30:00`)!
  * Để lấy trọn vẹn ngày 15/05, bạn nên viết: `WHERE order_date >= DATE '2026-05-01' AND order_date < DATE '2026-05-16'`.
  * **A, C, D sai:** Đây là lỗi logic kinh điển nhất trong các bài thi thực hành SQL tại doanh nghiệp.
</details>

---

### Câu 19 (Question 19)
**Câu truy vấn nào dưới đây là ĐÚNG về mặt cú pháp để tìm các nhân viên KHÔNG có tiền hoa hồng (`COMMISSION_PCT` là `NULL`)?**

* A. `SELECT last_name FROM employees WHERE commission_pct IS NULL;`
* B. `SELECT last_name FROM employees WHERE NOT (commission_pct IS NOT NULL);`
* C. `SELECT last_name FROM employees WHERE commission_pct = NULL;`
* D. Cả A và B đều đúng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng (Cả A và B đều đúng):**
    * Ở câu **A**: `commission_pct IS NULL` trả về `TRUE` khi cột là `NULL`.
    * Ở câu **B**: Khi cột là `NULL`, biểu thức bên trong `commission_pct IS NOT NULL` trả về **`FALSE`** (chú ý: toán tử `IS [NOT] NULL` luôn chỉ trả về `TRUE` hoặc `FALSE`, không bao giờ trả về `UNKNOWN`!). Khi đặt `NOT` phía trước: `NOT (FALSE)` $\rightarrow$ **`TRUE`**! Do đó cả A và B đều hoàn toàn hợp lệ và trả về kết quả giống hệt nhau.
  * **C sai:** `commission_pct = NULL` trả về `UNKNOWN` nên không lấy được dòng nào.
</details>

---

### Câu 20 (Question 20)
**Trong các cách viết phủ định dưới đây, cách viết nào sẽ BÁO LỖI cú pháp trên Oracle Database?**

* A. `WHERE department_id NOT IN (10, 20)`
* B. `WHERE NOT department_id IN (10, 20)`
* C. `WHERE department_id IS NOT NULL`
* D. `WHERE department_id NOT IS NULL`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng (Báo lỗi cú pháp):** Với toán tử kiểm tra `NULL`, cú pháp chuẩn là `col IS NOT NULL` hoặc đặt `NOT` ở đầu cả mệnh đề là `NOT (col IS NULL)` / `NOT col IS NULL`. Tuyệt đối **không được** viết `col NOT IS NULL` (sẽ báo lỗi `ORA-00908: missing NULL keyword`).
  * **A, B, C sai (Đều hợp lệ 100%):** Bạn có thể viết `col NOT IN (...)` hoặc `NOT col IN (...)`, `col NOT LIKE '...'` hoặc `NOT col LIKE '...'`, `col NOT BETWEEN ...` hoặc `NOT col BETWEEN ...` đều hợp lệ.
</details>

---

### Câu 21 (Question 21)
**Cho bảng `ITEMS` có cột `ITEM_CODE VARCHAR2(20)` chứa 4 dòng dữ liệu sau: `'A_100'`, `'A%100'`, `'AB100'`, `'A_200'`. Câu truy vấn dưới đây sẽ trả về những dòng nào?**

```sql
SELECT item_code
FROM items
WHERE item_code LIKE 'A_100';
```

* A. Chỉ trả về `'A_100'`.
* B. Trả về `'A_100'` và `'AB100'`.
* C. Trả về cả 3 dòng: `'A_100'`, `'A%100'`, và `'AB100'`.
* D. Trả về cả 4 dòng trong bảng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (`'A_100'`, `'A%100'`, và `'AB100'`):**
    * Vì câu truy vấn `WHERE item_code LIKE 'A_100'` **không có mệnh đề `ESCAPE`**, nên ký tự `_` ở vị trí thứ 2 là **ký tự đại diện (wildcard)** khớp với **bất kỳ 1 ký tự đơn nào** (bao gồm cả ký tự `'_'`, ký tự `'%'`, hay chữ cái `'B'`)!
    * Do đó, cả 3 chuỗi bắt đầu bằng `'A'`, có 1 ký tự ở giữa (`'_'`, `'%'`, `'B'`), và kết thúc bằng `'100'` đều khớp hoàn toàn!
  * **A, B, D sai:** Quên rằng dấu `_` đại diện cho 1 ký tự bất kỳ nên nó khớp luôn cả chính dấu `_` và dấu `%` nằm trong dữ liệu!
</details>

---

### Câu 22 (Question 22)
**Điều gì sẽ xảy ra khi bạn thực thi câu truy vấn dưới đây?**

```sql
SELECT employee_id, last_name
FROM employees
WHERE last_name = 'King' AND 1 = 0 OR 1 = 1;
```

* A. Chỉ trả về các nhân viên có họ là `'King'`.
* B. Trả về `0` dòng dữ liệu.
* C. Trả về TẤT CẢ các dòng trong bảng `EMPLOYEES`.
* D. Báo lỗi cú pháp vì không được so sánh hai hằng số `1 = 0` hay `1 = 1` trong `WHERE`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (Trả về tất cả các dòng trong bảng):**
    * Do `AND` có độ ưu tiên cao hơn `OR`, Oracle nhóm điều kiện thành:
      `WHERE (last_name = 'King' AND 1 = 0) OR (1 = 1)`
    * Vế trái `(last_name = 'King' AND FALSE)` luôn bằng `FALSE`.
    * Tuy nhiên, vế phải của phép `OR` là `1 = 1`, luôn luôn đánh giá ra **`TRUE`** cho mọi dòng!
    * Vì `FALSE OR TRUE` = **`TRUE`**, nên toàn bộ 107 dòng trong bảng `EMPLOYEES` đều thỏa mãn điều kiện `WHERE` và được trả về! (Đây cũng chính là nguyên lý của lỗ hổng bảo mật **SQL Injection** kinh điển `OR 1=1`).
  * **A, B, D sai:** Không áp dụng đúng độ ưu tiên của `AND` trước `OR`.
</details>

---

### Câu 23 (Question 23)
**Trong Oracle SQL, giới hạn số lượng phần tử tối đa được phép liệt kê trực tiếp bên trong một danh sách `IN (v1, v2, ..., vn)` (trước phiên bản 23ai) là bao nhiêu?**

* A. `255` phần tử
* B. `1000` phần tử
* C. `4000` phần tử
* D. Không giới hạn số lượng phần tử.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng (`1000` phần tử):** Trong Oracle Database (tất cả các phiên bản 11g, 12c, 19c, 21c thuộc phạm vi thi 1Z0-071 và vận hành thực tế), một danh sách biểu thức đơn trong mệnh đề `IN (v1, v2, ...)` chỉ được chứa **tối đa 1.000 phần tử**. Nếu truyền từ 1.001 phần tử trở lên, Oracle sẽ báo lỗi `ORA-01795: maximum number of expressions in a list is 1000`!
  * *(Mẹo xử lý thực tế tại VNPT khi danh sách > 1000 phần tử: Chia thành nhiều cụm `IN (...) OR col IN (...)`, dùng Tuple `(1, v1), (1, v2)` với `WHERE (1, col) IN (...)`, hoặc đẩy vào bảng tạm / Subquery vì `IN (SELECT ...)` không bị giới hạn 1.000 phần tử!).*
  * **A, C, D sai:** Con số `1000` của lỗi `ORA-01795` là kiến thức bắt buộc đối với mọi lập trình viên Oracle/Java.
</details>

---

### Câu 24 (Question 24)
**Cho câu truy vấn tìm kiếm nhân viên dưới đây. Điều kiện trong mệnh đề `WHERE` có thể được viết gọn lại bằng toán tử nào mà vẫn giữ nguyên 100% logic (kể cả khi `department_id` là `NULL`)?**

```sql
SELECT employee_id, last_name, department_id
FROM employees
WHERE department_id <> 10
  AND department_id <> 20
  AND department_id <> 30;
```

* A. `WHERE department_id IN (10, 20, 30)`
* B. `WHERE department_id NOT IN (10, 20, 30)`
* C. `WHERE department_id NOT BETWEEN 10 AND 30`
* D. `WHERE department_id IS NOT NULL`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Biểu thức `department_id NOT IN (10, 20, 30)` chính là cú pháp viết tắt tương đương 100% với `department_id <> 10 AND department_id <> 20 AND department_id <> 30`. (Lưu ý rằng nếu một nhân viên có `department_id IS NULL`, cả hai cách viết đều đánh giá ra `UNKNOWN` và đều không lấy nhân viên đó).
  * **A sai:** `IN` tương đương với chuỗi phép `=` nối bằng `OR`.
  * **C sai:** `NOT BETWEEN 10 AND 30` sẽ loại bỏ luôn cả các phòng ban như `15` hay `25` (nếu có), trong khi `NOT IN (10, 20, 30)` chỉ loại đúng 3 giá trị `10`, `20`, `30`.
  * **D sai:** `IS NOT NULL` vẫn lấy cả các phòng `10`, `20`, `30`.
</details>

---

### Câu 25 (Question 25)
**Cho bảng `EMPLOYEES` có nhân viên `King` với `salary = 24000` và `commission_pct = NULL`. Biểu thức điều kiện nào trong mệnh đề `WHERE` dưới đây sẽ đánh giá ra `TRUE` cho dòng của nhân viên `King`? (Chọn tất cả các đáp án đúng)**

* A. `WHERE salary > 20000 OR commission_pct > 0.1`
* B. `WHERE salary > 20000 AND commission_pct IS NULL`
* C. `WHERE salary > 20000 AND commission_pct <> 0.1`
* D. `WHERE NOT (commission_pct = 0.1)`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B**
* **Giải thích chuyên sâu:**
  * **A đúng:** `salary > 20000` (`24000 > 20000`) là `TRUE`; `commission_pct > 0.1` (`NULL > 0.1`) là `UNKNOWN`. Kết hợp bằng `OR`: `TRUE OR UNKNOWN` $\rightarrow$ **`TRUE`**!
  * **B đúng:** `salary > 20000` là `TRUE`; `commission_pct IS NULL` là `TRUE`. Kết hợp bằng `AND`: `TRUE AND TRUE` $\rightarrow$ **`TRUE`**!
  * **C sai:** `commission_pct <> 0.1` (`NULL <> 0.1`) là `UNKNOWN`. Kết hợp bằng `AND`: `TRUE AND UNKNOWN` $\rightarrow$ **`UNKNOWN`** (Bị loại!).
  * **D sai:** `commission_pct = 0.1` (`NULL = 0.1`) là `UNKNOWN`. Phủ định `NOT (UNKNOWN)` $\rightarrow$ **`UNKNOWN`** (Bị loại!).
</details>
