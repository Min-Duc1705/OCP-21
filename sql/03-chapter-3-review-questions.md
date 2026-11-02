# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 3: Truy Vấn và Sắp Xếp Dữ Liệu Với SELECT

> **Tài liệu tham chiếu:** *OCA/OCP Oracle Database SQL Study Guide (Exam 1Z0-071) & Ngân hàng câu hỏi sát hạch CNTT VNPT*.  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết.  
> **Cách học:** Bạn hãy tự đọc đề và chọn đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và nắm vững bẫy thi.

---

### Câu 1 (Question 1)
**Câu truy vấn nào dưới đây là HỢP LỆ khi sử dụng từ khóa `DISTINCT` trong Oracle SQL?**

* A. `SELECT department_id, DISTINCT job_id FROM employees;`
* B. `SELECT DISTINCT department_id, DISTINCT job_id FROM employees;`
* C. `SELECT DISTINCT department_id, job_id FROM employees;`
* D. `SELECT department_id, job_id DISTINCT FROM employees;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong câu lệnh `SELECT`, từ khóa `DISTINCT` (hoặc `UNIQUE`) **bắt buộc phải đứng ngay sau từ khóa `SELECT`** (trước tất cả các cột) và chỉ được xuất hiện **duy nhất 1 lần**. Khi đó, `DISTINCT` sẽ loại bỏ các dòng có tổ hợp `(department_id, job_id)` trùng nhau.
  * **A, B, D sai:** Đặt `DISTINCT` ở cột thứ hai, lặp lại `DISTINCT` hai lần, hoặc đặt ở cuối danh sách cột đều vi phạm cú pháp và gây lỗi `ORA-00936: missing expression` hoặc `ORA-00923`.
</details>

---

### Câu 2 (Question 2)
**Giả sử bảng `CUSTOMERS` có 5 dòng dữ liệu, trong đó cột `STATE_PROVINCE` có các giá trị lần lượt là: `'CA'`, `'TX'`, `NULL`, `'CA'`, và `NULL`. Câu truy vấn dưới đây sẽ trả về bao nhiêu dòng?**

```sql
SELECT UNIQUE state_province
FROM customers;
```

* A. `2` dòng (`'CA'`, `'TX'`)
* B. `3` dòng (`'CA'`, `'TX'`, và 1 dòng `NULL`)
* C. `4` dòng (`'CA'`, `'TX'`, và 2 dòng `NULL`)
* D. Báo lỗi cú pháp vì `UNIQUE` chỉ dùng khi tạo ràng buộc bảng (`CREATE TABLE`), không dùng được trong `SELECT`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng (`3` dòng):**
    1. Trong Oracle SQL, từ khóa **`UNIQUE`** đặt sau `SELECT` hoàn toàn hợp lệ và là từ đồng nghĩa 100% với từ khóa **`DISTINCT`**.
    2. Khi thực hiện loại bỏ trùng lặp bằng `DISTINCT` hoặc `UNIQUE`, Oracle **xem tất cả các giá trị `NULL` là trùng nhau (duplicates)** và gom chúng lại thành **1 dòng `NULL` duy nhất**.
    3. Do đó, từ 5 dòng ban đầu (`'CA'`, `'TX'`, `NULL`, `'CA'`, `NULL`), kết quả trả về gồm đúng **3 dòng**: `'CA'`, `'TX'`, và `NULL`.
  * **A, C, D sai:** Đây là bẫy rất phổ biến kiểm tra đồng thời từ khóa `UNIQUE` trong `SELECT` và cách `DISTINCT` xử lý `NULL`.
</details>

---

### Câu 3 (Question 3)
**Trong các câu truy vấn sử dụng bí danh cột (Column Alias) dưới đây, câu truy vấn nào sẽ BÁO LỖI cú pháp trên Oracle Database?**

* A. `SELECT last_name AS "Employee Name" FROM employees;`
* B. `SELECT last_name "Employee_Name" FROM employees;`
* C. `SELECT last_name AS Employee Name FROM employees;`
* D. `SELECT last_name AS emp_name FROM employees;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (Báo lỗi):** Khi một Column Alias có chứa **khoảng trắng (space)** ở giữa (như `Employee Name`), bạn **bắt buộc phải bao quanh toàn bộ bí danh đó bằng cặp dấu nháy kép `"Employee Name"`**. Nếu viết không có dấu nháy kép (`AS Employee Name`), trình phân tích cú pháp của Oracle sẽ hiểu `Employee` là bí danh và không biết từ `Name` tiếp theo là gì, dẫn đến lỗi `ORA-00923: FROM keyword not found where expected`.
  * **A, B, D sai (Đều chạy thành công):** Từ khóa `AS` là tùy chọn đối với Column Alias, và dấu nháy kép `"..."` dùng khi có khoảng trắng hoặc muốn giữ chữ hoa/thường.
</details>

---

### Câu 4 (Question 4)
**Hãy xem xét câu lệnh SQL dưới đây. Tại sao câu lệnh này lại báo lỗi `ORA-00933: SQL command not properly ended` khi thực thi trên Oracle Database?**

```sql
SELECT e.employee_id, e.last_name, e.salary
FROM employees AS e
WHERE e.department_id = 90;
```

* A. Vì bí danh bảng `e` quá ngắn (Oracle yêu cầu Table Alias phải có ít nhất 2 ký tự).
* B. Vì trong Oracle SQL, không được phép sử dụng từ khóa `AS` khi đặt bí danh cho bảng (Table Alias) trong mệnh đề `FROM`.
* C. Vì mệnh đề `WHERE` không được phép sử dụng tiền tố bí danh bảng `e.department_id`.
* D. Vì tên bảng `employees` bắt buộc phải viết hoa thành `EMPLOYEES`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là một trong những quy tắc cú pháp đặc trưng nhất của Oracle SQL thường xuyên xuất hiện trong đề thi 1Z0-071:
    * Từ khóa **`AS`** được phép dùng cho **Column Alias** ở mệnh đề `SELECT` (`SELECT salary AS sal`).
    * Nhưng đối với **Table Alias** ở mệnh đề `FROM`, Oracle **cấm dùng từ khóa `AS`**! Bạn bắt buộc phải viết cách ra trực tiếp: `FROM employees e`. Viết `FROM employees AS e` sẽ lập tức báo lỗi `ORA-00933`.
  * **A, C, D sai:** Bí danh bảng 1 ký tự (`e`) và sử dụng `e.department_id` trong `WHERE` là hoàn toàn chuẩn xác.
</details>

---

### Câu 5 (Question 5)
**Điều gì sẽ xảy ra khi bạn thực thi câu truy vấn dưới đây?**

```sql
SELECT employees.employee_id, e.last_name
FROM employees e
WHERE e.department_id = 60;
```

* A. Thực thi thành công và trả về danh sách nhân viên phòng 60.
* B. Báo lỗi `ORA-00904: "EMPLOYEES"."EMPLOYEE_ID": invalid identifier` vì một khi đã đặt bí danh bảng `e` trong mệnh đề `FROM`, bạn không được phép dùng lại tên bảng gốc `employees` làm tiền tố cột trong câu truy vấn đó nữa.
* C. Báo lỗi vì thiếu từ khóa `AS` giữa `employees` và `e`.
* D. Chỉ hiển thị cột `last_name`, cột `employee_id` trả về `NULL`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong Oracle SQL, ngay khi bạn khai báo một bí danh bảng (Table Alias) trong mệnh đề `FROM` (ở đây là `FROM employees e`), bí danh `e` sẽ **thay thế hoàn toàn** tên bảng `employees` trong phạm vi của câu lệnh `SELECT` đó. Mọi tham chiếu có tiền tố đến các cột của bảng bắt buộc phải dùng `e.employee_id`, việc gọi lại `employees.employee_id` sẽ gây lỗi `ORA-00904: invalid identifier`.
  * **A, C, D sai:** Không nắm vững quy tắc phạm vi hiệu lực của Table Alias.
</details>

---

### Câu 6 (Question 6)
**Trong câu lệnh SQL, một bí danh cột (Column Alias) được định nghĩa ở mệnh đề `SELECT` có thể được tham chiếu hợp lệ ở mệnh đề nào dưới đây?**

* A. Mệnh đề `WHERE`
* B. Mệnh đề `GROUP BY`
* C. Mệnh đề `HAVING`
* D. Mệnh đề `ORDER BY`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Dựa trên **Thứ tự xử lý logic của câu lệnh SQL (Logical Query Processing Order)**:
    `FROM` $\rightarrow$ `WHERE` $\rightarrow$ `GROUP BY` $\rightarrow$ `HAVING` $\rightarrow$ **`SELECT`** $\rightarrow$ **`ORDER BY`** $\rightarrow$ `OFFSET / FETCH`.
    Vì Column Alias được định nghĩa tại bước `SELECT` (Bước 5), nên chỉ có mệnh đề **`ORDER BY`** (Bước 6, chạy sau `SELECT`) mới nhận biết và sử dụng được Column Alias!
  * **A, B, C sai:** Các mệnh đề `WHERE`, `GROUP BY`, `HAVING` đều được xử lý **trước** mệnh đề `SELECT`, nên tại thời điểm đó Column Alias chưa tồn tại. Nếu dùng Column Alias ở 3 mệnh đề này sẽ văng lỗi `ORA-00904: invalid identifier`.
</details>

---

### Câu 7 (Question 7)
**Khi thực thi câu truy vấn dưới đây, tiêu đề cột (Column Heading) hiển thị trên màn hình kết quả của SQL\*Plus / SQL Developer sẽ là gì?**

```sql
SELECT first_name || ' ' || last_name AS emp_full_name,
       salary * 12 AS "Annual Salary"
FROM employees;
```

* A. `emp_full_name` và `Annual Salary`
* B. `EMP_FULL_NAME` và `ANNUAL SALARY`
* C. `EMP_FULL_NAME` và `Annual Salary`
* D. `emp_full_name` và `ANNUAL SALARY`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:**
    * Cột thứ nhất có bí danh `emp_full_name` **không đặt trong dấu nháy kép**, nên Oracle tự động chuyển thành chữ in hoa toàn bộ: **`EMP_FULL_NAME`**.
    * Cột thứ hai có bí danh `"Annual Salary"` **được đặt trong dấu nháy kép `"..."`**, nên Oracle giữ nguyên chính xác chữ hoa/thường và khoảng trắng như đã viết: **`Annual Salary`**.
  * **A, B, D sai:** Không phân biệt được hành vi hiển thị giữa Unquoted Alias và Quoted Alias.
</details>

---

### Câu 8 (Question 8)
**Giả sử nhân viên có `salary = 2000`. Kết quả của hai biểu thức tính toán trong câu truy vấn dưới đây là bao nhiêu?**

```sql
SELECT salary + 100 * 12 AS expr1,
       (salary + 100) * 12 AS expr2
FROM employees
WHERE employee_id = 198;
```

* A. `EXPR1 = 25200`, `EXPR2 = 25200`
* B. `EXPR1 = 3200`, `EXPR2 = 25200`
* C. `EXPR1 = 25200`, `EXPR2 = 3200`
* D. `EXPR1 = 24100`, `EXPR2 = 25200`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Theo quy tắc độ ưu tiên toán tử số học (Operator Precedence):
    * **Ở `expr1` (`2000 + 100 * 12`):** Phép nhân `*` có độ ưu tiên cao hơn phép cộng `+`, nên Oracle tính `100 * 12 = 1200` trước, sau đó lấy `2000 + 1200` = **`3200`**.
    * **Ở `expr2` (`(2000 + 100) * 12`):** Dấu ngoặc đơn `(...)` có độ ưu tiên cao nhất, nên Oracle tính `2000 + 100 = 2100` trước, sau đó lấy `2100 * 12` = **`25200`**.
  * **A, C, D sai:** Tính sai thứ tự ưu tiên nhân chia trước, cộng trừ sau.
</details>

---

### Câu 9 (Question 9)
**Để biểu diễn chuỗi ký tự `Manager's [Team] Report` có chứa cả dấu nháy đơn `'` và dấu ngoặc vuông `[...]`, cách sử dụng toán tử trích dẫn thay thế `q'...'` (Alternative Quote Operator) nào dưới đây là HỢP LỆ? (Chọn tất cả các đáp án đúng)**

* A. `SELECT q'{Manager's [Team] Report}' FROM dual;`
* B. `SELECT q'!Manager's [Team] Report!' FROM dual;`
* C. `SELECT q'[Manager's [Team] Report]' FROM dual;`
* D. `SELECT q'<Manager's [Team] Report<' FROM dual;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B**
* **Giải thích chuyên sâu:**
  * **A và B đúng:**
    * Trong chuỗi cần hiển thị `Manager's [Team] Report` đã có chứa ký tự `]` kèm theo dấu `'`, hoặc ta nên chọn bộ ký tự phân cách (delimiter) không xung đột:
    * **A** dùng cặp ngoặc nhọn đối xứng `q'{...}'` $\rightarrow$ Hoàn toàn hợp lệ!
    * **B** dùng cặp dấu chấm than `q'!...!'` $\rightarrow$ Hoàn toàn hợp lệ!
  * **C sai (Nguy hiểm):** Mặc dù `q'[...]'` mở bằng `[` và đóng bằng `]`, nếu bên trong chuỗi không có `]'` liền nhau thì có thể chạy, nhưng nếu chuỗi kết thúc hoặc có `]'` sẽ cắt chuỗi sớm. Tuy nhiên lý do **D sai chắc chắn** là vì khi mở bằng dấu ngoặc nhọn `<`, ký tự đóng **bắt buộc phải là dấu ngoặc đóng đối xứng `>`** (`q'<...>'`), việc đóng bằng `<'` (`q'<...<'`) sẽ gây lỗi cú pháp `ORA-01756: quoted string not properly terminated`!
</details>

---

### Câu 10 (Question 10)
**Cách viết nào dưới đây sẽ trả về chuỗi ký tự `It's a sunny day` mà KHÔNG gây lỗi cú pháp trong Oracle SQL? (Chọn tất cả các đáp án đúng)**

* A. `SELECT 'It''s a sunny day' FROM dual;`
* B. `SELECT q'[It's a sunny day]' FROM dual;`
* C. `SELECT 'It\'s a sunny day' FROM dual;`
* D. `SELECT "It's a sunny day" FROM dual;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B**
* **Giải thích chuyên sâu:**
  * **A đúng:** Sử dụng hai dấu nháy đơn liên tiếp `''` bên trong chuỗi để biểu diễn một ký tự nháy đơn `'`.
  * **B đúng:** Sử dụng toán tử trích dẫn thay thế `q'[...]'` giúp viết trực tiếp dấu nháy đơn `'` bên trong mà không cần nhân đôi.
  * **C sai:** Khác với C/Java/MySQL, trong Oracle SQL dấu gạch chéo ngược `\` **không phải** là ký tự thoát (escape character) mặc định cho dấu nháy đơn trong hằng chuỗi! Viết `'It\'s a sunny day'` sẽ báo lỗi `ORA-01756: quoted string not properly terminated`.
  * **D sai:** Dấu nháy kép `"..."` dùng cho tên định danh (Identifier), không dùng cho hằng chuỗi (sẽ báo lỗi `ORA-00904: invalid identifier`).
</details>

---

### Câu 11 (Question 11)
**Trong Oracle Database, khi thực thi mệnh đề `ORDER BY commission_pct` (không ghi `ASC` hay `DESC`, cũng không ghi `NULLS FIRST` hay `NULLS LAST`), các dòng có giá trị `commission_pct` là `NULL` sẽ xuất hiện ở đâu trong kết quả đầu ra?**

* A. Xuất hiện ở đầu tiên (trước tất cả các dòng có giá trị số).
* B. Xuất hiện ở cuối cùng (sau tất cả các dòng có giá trị số).
* C. Bị loại bỏ tự động khỏi tập kết quả khi có mệnh đề `ORDER BY`.
* D. Xuất hiện xen kẽ ở vị trí tương đương với giá trị `0`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    1. Khi không chỉ định hướng sắp xếp trong `ORDER BY`, thứ tự mặc định luôn là **`ASC` (Tăng dần - Ascending)**.
    2. Trong Oracle Database, giá trị **`NULL` được coi là lớn hơn mọi giá trị khác (kể cả số dương lớn nhất)**.
    3. Do đó, khi sắp xếp tăng dần (`ASC` - từ nhỏ đến lớn), các giá trị `NULL` (lớn nhất) sẽ mặc định nằm ở **CUỐI CÙNG (`NULLS LAST`)**!
  * **A sai:** `NULL` chỉ nằm ở đầu tiên khi bạn sắp xếp giảm dần (`ORDER BY commission_pct DESC`) hoặc chỉ định tường minh `ORDER BY commission_pct ASC NULLS FIRST`.
  * **C, D sai:** `ORDER BY` không bao giờ làm mất dòng `NULL` và không bao giờ coi `NULL` bằng `0`.
</details>

---

### Câu 12 (Question 12)
**Bạn muốn hiển thị danh sách nhân viên sắp xếp theo cột hoa hồng `COMMISSION_PCT` giảm dần (từ cao xuống thấp), đồng thời đưa tất cả các nhân viên chưa có hoa hồng (`COMMISSION_PCT IS NULL`) xuống dưới cùng của danh sách. Mệnh đề `ORDER BY` nào sau đây là ĐÚNG?**

* A. `ORDER BY commission_pct DESC`
* B. `ORDER BY commission_pct DESC NULLS FIRST`
* C. `ORDER BY commission_pct DESC NULLS LAST`
* D. `ORDER BY commission_pct NULLS LAST DESC`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (`ORDER BY commission_pct DESC NULLS LAST`):** Vì mặc định khi sắp xếp `DESC` trong Oracle, các giá trị `NULL` sẽ nổi lên đầu tiên (`NULLS FIRST`), nên muốn đẩy `NULL` xuống cuối danh sách khi sắp xếp giảm dần, bạn phải chỉ định tường minh từ khóa `NULLS LAST` đặt **ngay sau** từ khóa `DESC`.
  * **A và B sai:** Đều làm cho các dòng `NULL` xuất hiện ở đầu danh sách.
  * **D sai:** Sai thứ tự cú pháp! Từ khóa `NULLS FIRST` / `NULLS LAST` bắt buộc phải đứng **SAU** `ASC` / `DESC`, nếu viết `NULLS LAST DESC` sẽ báo lỗi `ORA-00933: SQL command not properly ended`.
</details>

---

### Câu 13 (Question 13)
**Cho câu truy vấn sắp xếp theo nhiều cột dưới đây. Nhận định nào mô tả ĐÚNG cách thức sắp xếp của Oracle?**

```sql
SELECT department_id, job_id, salary
FROM employees
ORDER BY department_id, salary DESC;
```

* A. Cả hai cột `department_id` và `salary` đều được sắp xếp giảm dần (`DESC`).
* B. Cột `department_id` được sắp xếp giảm dần (`DESC`), sau đó cột `salary` được sắp xếp tăng dần (`ASC`).
* C. Cột `department_id` được sắp xếp tăng dần (`ASC`), và trong từng phòng ban có cùng `department_id`, cột `salary` được sắp xếp giảm dần (`DESC`).
* D. Báo lỗi cú pháp vì cột `department_id` không chỉ định từ khóa `ASC` hay `DESC`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong mệnh đề `ORDER BY` có nhiều cột, bổ từ `ASC` hoặc `DESC` **áp dụng độc lập cho từng cột một** (không áp dụng dây chuyền cho các cột đứng trước nó!).
    * Cột thứ nhất `department_id` không ghi gì nên nhận giá trị mặc định là **`ASC` (tăng dần)**.
    * Khi các dòng có cùng `department_id`, Oracle mới xét đến cột thứ hai là `salary` và sắp xếp theo hướng **`DESC` (giảm dần)**.
  * **A, B, D sai:** Đây là bẫy rất hay gặp khi thí sinh lầm tưởng chữ `DESC` ở cuối áp dụng cho toàn bộ danh sách cột trong `ORDER BY`.
</details>

---

### Câu 14 (Question 14)
**Hãy xem xét câu truy vấn sử dụng số thứ tự vị trí cột trong `ORDER BY` dưới đây. Điều gì sẽ xảy ra khi thực thi?**

```sql
SELECT employee_id, last_name, salary
FROM employees
ORDER BY 4;
```

* A. Sắp xếp kết quả theo cột thứ 4 trong cấu trúc bảng `EMPLOYEES` (cột `EMAIL`).
* B. Sắp xếp kết quả theo cột thứ 1 (`employee_id`) theo cơ chế xoay vòng.
* C. Thực thi thành công nhưng không sắp xếp dữ liệu.
* D. Báo lỗi `ORA-01785: ORDER BY item must be the number of a SELECT-list expression`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Khi sử dụng một số nguyên dương trong mệnh đề `ORDER BY` (Positional Notation), con số đó chỉ định **vị trí thứ tự của cột trong danh sách `SELECT`** (chứ không phải vị trí cột trong bảng vật lý!). Vì mệnh đề `SELECT` ở trên chỉ liệt kê **3 cột** (`1: employee_id`, `2: last_name`, `3: salary`), nên việc gọi `ORDER BY 4` vượt quá số lượng cột của `SELECT` và gây ra lỗi `ORA-01785`.
  * **A, B, C sai:** Nếu muốn sắp xếp theo một cột không nằm trong mệnh đề `SELECT` (như cột `email`), bạn phải viết rõ **tên cột** (`ORDER BY email`), không thể dùng số thứ tự `4`.
</details>

---

### Câu 15 (Question 15)
**Cho bảng `EMPLOYEES` (không dùng `DISTINCT`). Câu truy vấn nào dưới đây là HỢP LỆ dù cột trong `ORDER BY` không xuất hiện trong mệnh đề `SELECT`?**

* A. `SELECT first_name, last_name FROM employees ORDER BY salary DESC;`
* B. `SELECT DISTINCT first_name, last_name FROM employees ORDER BY salary DESC;`
* C. `SELECT first_name, last_name FROM employees ORDER BY 3 DESC;`
* D. Không có câu nào hợp lệ vì mọi cột trong `ORDER BY` bắt buộc phải có mặt trong `SELECT`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Trong một câu truy vấn `SELECT` thông thường (không có `DISTINCT` và không có toán tử tập hợp `UNION`/`INTERSECT`/`MINUS`), bạn **hoàn toàn được phép** sắp xếp kết quả theo một cột của bảng trong `FROM` (`salary`) ngay cả khi cột đó không được hiển thị trong danh sách `SELECT`.
  * **B sai:** Khi đã sử dụng từ khóa **`DISTINCT`** trong `SELECT`, bạn **bắt buộc** chỉ được `ORDER BY` các cột có xuất hiện trong danh sách `SELECT` (nếu không sẽ báo lỗi `ORA-01791: not a SELECTed expression`).
  * **C sai:** `SELECT` chỉ có 2 cột nên `ORDER BY 3` báo lỗi `ORA-01785`.
  * **D sai:** Vì A hoàn toàn hợp lệ.
</details>

---

### Câu 16 (Question 16)
**Trong cú pháp phân trang dữ liệu hiện đại của Oracle (từ 12c trở đi), những cặp từ khóa nào dưới đây có thể thay thế hoàn toàn cho nhau mà không làm thay đổi ý nghĩa của câu lệnh? (Chọn tất cả các đáp án đúng)**

* A. `ROW` và `ROWS`
* B. `FIRST` và `NEXT`
* C. `ONLY` và `WITH TIES`
* D. `OFFSET` và `FETCH`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B**
* **Giải thích chuyên sâu:**
  * **A và B đúng:** Trong mệnh đề Row Limiting (`OFFSET ... FETCH`), Oracle thiết kế hai cặp từ khóa đồng nghĩa hoàn toàn để giúp câu văn tiếng Anh tự nhiên hơn:
    1. **`ROW`** $\equiv$ **`ROWS`** (bạn có thể viết `OFFSET 1 ROWS` hoặc `FETCH FIRST 5 ROW ONLY` đều hợp lệ 100%).
    2. **`FIRST`** $\equiv$ **`NEXT`** (bạn có thể viết `FETCH NEXT 5 ROWS ONLY` ngay cả khi không có `OFFSET`, hoặc viết `OFFSET 10 ROWS FETCH FIRST 5 ROWS ONLY` đều hợp lệ 100%).
  * **C sai:** `ONLY` và `WITH TIES` khác nhau hoàn toàn về kết quả khi có các dòng đồng hạng ở vị trí cắt cuối cùng.
  * **D sai:** `OFFSET` dùng để bỏ qua số dòng đầu, còn `FETCH` dùng để lấy số dòng tiếp theo.
</details>

---

### Câu 17 (Question 17)
**Cho bảng `SCORES` gồm 6 dòng dữ liệu đã được sắp xếp theo `POINTS DESC` như sau: `100`, `95`, `90`, `90`, `90`, `85`. Câu truy vấn dưới đây sẽ trả về bao nhiêu dòng?**

```sql
SELECT student_id, points
FROM scores
ORDER BY points DESC
FETCH FIRST 3 ROWS WITH TIES;
```

* A. `3` dòng
* B. `4` dòng
* C. `5` dòng
* D. `6` dòng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (`5` dòng):**
    * Mệnh đề `FETCH FIRST 3 ROWS` lấy 3 dòng đầu tiên có điểm số là: dòng 1 (`100`), dòng 2 (`95`), và dòng 3 (`90`).
    * Vì sử dụng tùy chọn **`WITH TIES`**, Oracle kiểm tra xem có dòng nào tiếp theo bằng điểm với dòng thứ 3 (`points = 90`) hay không.
    * Do dòng thứ 4 (`90`) và dòng thứ 5 (`90`) đều có cùng giá trị `90` với dòng thứ 3, nên Oracle lấy thêm cả dòng 4 và dòng 5!
    * Tổng cộng kết quả trả về là **5 dòng** (`100, 95, 90, 90, 90`).
  * **A, B, D sai:** Nếu dùng `FETCH FIRST 3 ROWS ONLY` thì mới trả về đúng 3 dòng.
</details>

---

### Câu 18 (Question 18)
**Nếu bạn sử dụng mệnh đề `FETCH FIRST 5 ROWS WITH TIES` nhưng trong câu truy vấn KHÔNG CÓ mệnh đề `ORDER BY`, điều gì sẽ xảy ra?**

* A. Báo lỗi cú pháp vì `WITH TIES` bắt buộc phải đi kèm với `ORDER BY`.
* B. Câu lệnh trả về 0 dòng dữ liệu.
* C. Câu lệnh trả về toàn bộ tất cả các dòng trong bảng vì khi không có `ORDER BY`, mọi dòng được xem là đồng hạng (tied) với nhau.
* D. Câu lệnh hoạt động giống hệt như `FETCH FIRST 5 ROWS ONLY` (chỉ trả về 5 dòng đầu tiên).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Theo tài liệu chính thức của Oracle SQL Language Reference: Nếu bạn chỉ định `WITH TIES` nhưng **không chỉ định mệnh đề `ORDER BY`**, Oracle sẽ không biết dùng tiêu chí cột nào để so sánh đồng hạng, nên sẽ **không có dòng đồng hạng bổ sung nào được trả về** — hành vi lúc này giống hệt như `FETCH FIRST 5 ROWS ONLY` (chỉ trả về đúng 5 dòng).
  * **A, B, C sai:** Đây là một câu hỏi bẫy lý thuyết rất hay trong đề thi 1Z0-071 để kiểm tra xem thí sinh có đọc kỹ đặc tả của `WITH TIES` hay không.
</details>

---

### Câu 19 (Question 19)
**Cho bảng `EMPLOYEES` có 107 dòng dữ liệu. Khi thực thi câu truy vấn dưới đây, kết quả trả về sẽ có bao nhiêu dòng?**

```sql
SELECT employee_id, first_name, salary
FROM employees
WHERE ROWNUM = 5;
```

* A. `1` dòng (dòng thứ 5 trong bảng)
* B. `5` dòng (từ dòng 1 đến dòng 5)
* C. `0` dòng (không có dòng nào được trả về)
* D. Báo lỗi cú pháp vì `ROWNUM` không được phép dùng với toán tử `=`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (`0` dòng):** Đây là bẫy kinh điển nhất về giả cột `ROWNUM` trong Oracle:
    * `ROWNUM` được cấp phát động bắt đầu từ `1` khi dòng dữ liệu đầu tiên được đọc lên.
    * Với dòng đầu tiên, `ROWNUM` đang là `1`. Oracle kiểm tra điều kiện `WHERE ROWNUM = 5` (`1 = 5` $\rightarrow$ `FALSE`), nên dòng đầu tiên bị loại bỏ!
    * Vì dòng đầu tiên bị loại, dòng thứ hai đọc lên lại được gán `ROWNUM = 1`, kiểm tra `1 = 5` lại bị loại! Quá trình lặp lại đến hết 107 dòng và kết quả trả về là **0 dòng (no rows selected)**.
  * **A, B, D sai:** Với toán tử `=`, chỉ duy nhất điều kiện `WHERE ROWNUM = 1` là trả về 1 dòng, còn `WHERE ROWNUM = n` (với `n > 1`) hoặc `WHERE ROWNUM > n` luôn luôn trả về 0 dòng!
</details>

---

### Câu 20 (Question 20)
**Giả sử bảng `EMPLOYEES` có 100 dòng dữ liệu. Kết quả của câu truy vấn dưới đây là bao nhiêu dòng?**

```sql
SELECT employee_id, last_name, salary
FROM employees
ORDER BY salary DESC
OFFSET 10 ROWS FETCH NEXT 5 PERCENT ROWS ONLY;
```

* A. `5` dòng
* B. `4` dòng
* C. `10` dòng
* D. Báo lỗi vì không được kết hợp `OFFSET` (theo số dòng) với `FETCH ... PERCENT` (theo phần trăm).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng (`5` dòng):**
    1. Oracle hoàn toàn cho phép kết hợp `OFFSET n ROWS` với `FETCH NEXT p PERCENT ROWS ONLY`.
    2. Quan trọng hơn: Tỷ lệ `5 PERCENT` được tính trên **TỔNG SỐ DÒNG CỦA TẬP KẾT QUẢ GỐC (100 dòng)**, chứ không phải tính trên 90 dòng còn lại sau khi trừ `OFFSET 10`!
    3. Do đó: `5%` của `100` dòng = **`5` dòng** (Oracle bỏ qua 10 dòng đầu tiên từ dòng 1 đến dòng 10, và lấy 5 dòng tiếp theo từ dòng 11 đến dòng 15).
  * **B, C, D sai:** Nếu số dòng tính theo phần trăm ra số lẻ (ví dụ `5%` của 90 dòng = `4.5`), Oracle sẽ tự động làm tròn lên (`CEIL`) thành `5` dòng.
</details>

---

### Câu 21 (Question 21)
**Điều gì sẽ xảy ra khi thực thi câu truy vấn có chứa `NULL` trong mệnh đề `FETCH` dưới đây?**

```sql
SELECT employee_id, last_name
FROM employees
FETCH FIRST NULL ROWS ONLY;
```

* A. Trả về toàn bộ các dòng của bảng `EMPLOYEES`.
* B. Trả về đúng 1 dòng đầu tiên.
* C. Thực thi thành công nhưng trả về `0` dòng dữ liệu.
* D. Báo lỗi cú pháp vì không được truyền `NULL` vào mệnh đề `FETCH`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng (`0` dòng):** Theo đặc tả Row Limiting Clause của Oracle: Nếu biểu thức số lượng dòng hoặc phần trăm trong `FETCH` (hoặc số dòng trong `OFFSET`) đánh giá ra giá trị **`NULL`**, câu truy vấn vẫn hợp lệ (không báo lỗi) nhưng sẽ **trả về 0 dòng (no rows returned)**.
  * **A, B, D sai:** Ngược lại, nếu bạn **bỏ trống hoàn toàn** con số trong `FETCH` (tức viết `FETCH FIRST ROW ONLY` hoặc `FETCH FIRST ROWS ONLY`), khi đó mặc định số dòng được lấy sẽ là **`1` dòng**!
</details>

---

### Câu 22 (Question 22)
**Câu truy vấn dưới đây sẽ trả về bao nhiêu dòng khi thực thi trên bảng `EMPLOYEES` (có 107 dòng)?**

```sql
SELECT employee_id, last_name, salary
FROM employees
ORDER BY salary DESC
FETCH FIRST ROW ONLY;
```

* A. `0` dòng
* B. `1` dòng
* C. `107` dòng
* D. Báo lỗi cú pháp vì thiếu con số chỉ định số lượng dòng sau từ khóa `FIRST`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng (`1` dòng):** Trong cú pháp `FETCH { FIRST | NEXT } [ rowcount | percent PERCENT ] { ROW | ROWS } { ONLY | WITH TIES }`, tham số `rowcount` là **tùy chọn (optional)**. Nếu bạn bỏ qua `rowcount` (viết `FETCH FIRST ROW ONLY` hoặc `FETCH NEXT ROWS ONLY`), Oracle mặc định hiểu `rowcount = 1` và trả về đúng **1 dòng đầu tiên**!
  * **A, C, D sai:** Rất nhiều thí sinh thấy thiếu số `1` trong `FETCH FIRST ROW ONLY` nên chọn nhầm đáp án "Báo lỗi cú pháp".
</details>

---

### Câu 23 (Question 23)
**Trong Oracle SQL, nếu bạn muốn tính phần dư của phép chia cột `SALARY` cho `1000`, biểu thức nào dưới đây là ĐÚNG?**

* A. `SELECT salary % 1000 FROM employees;`
* B. `SELECT MOD(salary, 1000) FROM employees;`
* C. `SELECT salary MOD 1000 FROM employees;`
* D. `SELECT REMAINDER_DIV(salary, 1000) FROM employees;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong Oracle SQL, để lấy phần dư của phép chia hai số, bạn bắt buộc phải dùng hàm **`MOD(m, n)`** (hoặc hàm `REMAINDER(m, n)`).
  * **A sai:** Dấu phần trăm `%` trong Oracle SQL **CHỈ** là ký tự đại diện (wildcard) dùng trong toán tử `LIKE` (hoặc thuộc tính `%TYPE`, `%ROWTYPE` trong PL/SQL), tuyệt đối **không phải** là toán tử chia lấy dư! Viết `salary % 1000` sẽ báo lỗi `ORA-00911: invalid character`.
  * **C, D sai:** Không tồn tại toán tử trung tố `MOD` hay hàm `REMAINDER_DIV` trong SQL.
</details>

---

### Câu 24 (Question 24)
**Thứ tự nào dưới đây phản ánh ĐÚNG trình tự xử lý logic (Logical Query Processing Order) của các mệnh đề trong một câu lệnh `SELECT` của Oracle SQL?**

* A. `SELECT` $\rightarrow$ `FROM` $\rightarrow$ `WHERE` $\rightarrow$ `GROUP BY` $\rightarrow$ `HAVING` $\rightarrow$ `ORDER BY` $\rightarrow$ `FETCH`
* B. `FROM` $\rightarrow$ `WHERE` $\rightarrow$ `GROUP BY` $\rightarrow$ `HAVING` $\rightarrow$ `SELECT` $\rightarrow$ `ORDER BY` $\rightarrow$ `FETCH`
* C. `FROM` $\rightarrow$ `SELECT` $\rightarrow$ `WHERE` $\rightarrow$ `GROUP BY` $\rightarrow$ `HAVING` $\rightarrow$ `ORDER BY` $\rightarrow$ `FETCH`
* D. `FROM` $\rightarrow$ `WHERE` $\rightarrow$ `SELECT` $\rightarrow$ `GROUP BY` $\rightarrow$ `HAVING` $\rightarrow$ `FETCH` $\rightarrow$ `ORDER BY`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trình tự xử lý logic chuẩn của một câu truy vấn SQL luôn là:
    1. `FROM` (và `JOIN`): Lấy dữ liệu từ các bảng nguồn.
    2. `WHERE`: Lọc các dòng dữ liệu chi tiết.
    3. `GROUP BY`: Gom nhóm các dòng đã lọc.
    4. `HAVING`: Lọc các nhóm sau khi đã gom.
    5. `SELECT`: Đánh giá các biểu thức cột, gán Column Alias và xử lý `DISTINCT`.
    6. `ORDER BY`: Sắp xếp tập kết quả.
    7. `OFFSET / FETCH`: Bỏ qua và giới hạn số lượng dòng trả về cuối cùng.
  * **A, C, D sai:** Nhầm thứ tự viết câu lệnh (Lexical Order) với thứ tự xử lý logic (Logical Execution Order).
</details>

---

### Câu 25 (Question 25)
**Hàm nối chuỗi `CONCAT` trong Oracle SQL có điểm hạn chế gì khi so sánh với toán tử nối chuỗi `||`?**

* A. Hàm `CONCAT` không thể nối các cột có kiểu dữ liệu `VARCHAR2`, chỉ nối được kiểu `CHAR`.
* B. Hàm `CONCAT(s1, s2)` chỉ nhận đúng 2 tham số đầu vào (nếu muốn nối 3 chuỗi phải lồng `CONCAT(CONCAT(s1, s2), s3)`), trong khi toán tử `||` có thể nối số lượng chuỗi tùy ý liên tiếp nhau.
* C. Khi gặp một tham số là `NULL`, hàm `CONCAT` trả về `NULL`, còn toán tử `||` bỏ qua `NULL`.
* D. Hàm `CONCAT` chỉ dùng được trong mệnh đề `WHERE`, không dùng được trong mệnh đề `SELECT`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong Oracle Database, hàm `CONCAT(char1, char2)` **chỉ chấp nhận đúng 2 đối số**! Nếu bạn truyền 3 đối số vào `CONCAT(first_name, ' ', last_name)`, Oracle sẽ lập tức báo lỗi `ORA-00909: invalid number of arguments`. Ngược lại, toán tử `||` (`first_name || ' ' || last_name`) cho phép nối bao nhiêu chuỗi tùy ý.
  * **A, D sai:** `CONCAT` hoạt động bình thường với mọi kiểu chuỗi trong cả `SELECT` và `WHERE`.
  * **C sai:** Trong Oracle, cả hàm `CONCAT('A', NULL)` lẫn `'A' || NULL` đều bỏ qua `NULL` và trả về `'A'` (khác với MySQL nơi `CONCAT('A', NULL)` trả về `NULL`).
</details>
