# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 17: Truy Vấn Phân Cấp (Hierarchical Queries)

> **Thuộc Phần II:** Oracle SQL Nâng Cao (Advanced Oracle SQL for Developers)  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle OCA/OCP & Tuyển dụng VNPT/Viettel/Ngân hàng.  
> **Cách học:** Hãy đọc kỹ đề bài, chú ý vị trí của từ khóa `PRIOR` và vị trí mệnh đề lọc (`WHERE` vs `CONNECT BY`) trước khi mở phần **"👉 Xem Đáp Án & Giải Thích Chi Tiết"**.

---

### Câu 1 (Question 1)
**Trong bảng `EMPLOYEES` có cột khóa chính là `EMPLOYEE_ID` và cột mã người quản lý trực tiếp là `MANAGER_ID`. Để duyệt cây phân cấp theo hướng từ trên xuống (Top-Down: từ Tổng giám đốc xuống các nhân viên cấp dưới), mệnh đề `CONNECT BY` nào sau đây là ĐÚNG?**

* A. `CONNECT BY PRIOR manager_id = employee_id`
* B. `CONNECT BY PRIOR employee_id = manager_id`
* C. `CONNECT BY employee_id = PRIOR employee_id`
* D. `CONNECT BY manager_id = PRIOR manager_id`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Để duyệt **Top-Down (từ Cha xuống Con)**, dòng ở bước tiếp theo là nhân viên cấp dưới (Con), nên cột `manager_id` của dòng tiếp theo phải bằng cột `employee_id` của dòng quản lý vừa tìm được ở bước trước (`PRIOR employee_id`). Do đó ta viết: `CONNECT BY PRIOR employee_id = manager_id` (hoặc viết ngược vế là `CONNECT BY manager_id = PRIOR employee_id`).
  * **A sai:** `PRIOR manager_id = employee_id` là hướng duyệt **Bottom-Up** (từ nhân viên cấp dưới tìm ngược lên các cấp sếp phía trên).
  * **C, D sai:** Không kết nối khóa chính với khóa ngoại nên không tạo thành quan hệ cha-con.
</details>

---

### Câu 2 (Question 2)
**Xem xét câu truy vấn phân cấp dưới đây. Câu truy vấn này thực hiện duyệt cây theo hướng nào và trả về những ai?**

```sql
SELECT employee_id, first_name, manager_id, LEVEL
FROM employees
START WITH employee_id = 104
CONNECT BY employee_id = PRIOR manager_id;
```

* A. Duyệt từ trên xuống (Top-Down): tìm nhân viên `104` và tất cả các nhân viên cấp dưới trực thuộc `104`.
* B. Duyệt từ dưới lên (Bottom-Up): bắt đầu từ nhân viên `104`, tìm người quản lý trực tiếp của `104`, rồi tìm tiếp quản lý của người đó cho đến tận Tổng giám đốc (Root).
* C. Báo lỗi cú pháp vì từ khóa `PRIOR` bắt buộc phải đứng ngay sau `CONNECT BY`.
* D. Chỉ trả về duy nhất dòng của nhân viên `104`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đừng để vị trí vế trái/vế phải của dấu `=` đánh lừa! Hãy nhìn xem từ khóa **`PRIOR` đang gắn với cột nào**: ở đây `PRIOR` gắn với cột **`manager_id`** (`employee_id = PRIOR manager_id` hoàn toàn tương đương với `PRIOR manager_id = employee_id`). Nghĩa là ở bước tiếp theo, Oracle đi tìm dòng có `employee_id` bằng với mã quản lý (`manager_id`) của dòng hiện tại $\implies$ đây là hướng duyệt **Bottom-Up (từ Con ngược lên Cha/Ông)**.
  * **A, C, D sai:** Từ khóa `PRIOR` có thể đặt ở vế trái hoặc vế phải của dấu `=` đều hoàn toàn hợp lệ.
</details>

---

### Câu 3 (Question 3)
**Trong một câu truy vấn phân cấp (`CONNECT BY`), giả cột `LEVEL` mang giá trị bằng bao nhiêu đối với các dòng khởi tạo thỏa mãn điều kiện trong mệnh đề `START WITH`?**

* A. `0`
* B. `1`
* C. `NULL`
* D. Phụ thuộc vào số lượng dòng trong bảng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong Oracle SQL, giả cột `LEVEL` luôn bắt đầu từ **`1`** cho các nút gốc (Root nodes — những dòng thỏa mãn điều kiện `START WITH`). Các nút con trực tiếp của Root có `LEVEL = 2`, cháu có `LEVEL = 3`, v.v.
  * **A, C, D sai:** `LEVEL` trong Oracle không bao giờ bắt đầu từ `0`.
</details>

---

### Câu 4 (Question 4)
**Điều gì sẽ xảy ra nếu bạn viết một câu truy vấn có mệnh đề `CONNECT BY PRIOR employee_id = manager_id` nhưng KHÔNG viết mệnh đề `START WITH`?**

* A. Câu lệnh báo lỗi cú pháp `ORA-01788: START WITH clause is required`.
* B. Câu lệnh trả về 0 dòng vì không tìm được điểm bắt đầu.
* C. Câu lệnh thực thi thành công: Oracle sẽ lần lượt lấy **tất cả các dòng trong bảng** làm nút gốc (`LEVEL = 1`) và xây dựng cây phân cấp cho từng dòng đó.
* D. Câu lệnh tự động hiểu ngầm định `START WITH manager_id IS NULL`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trong cú pháp Hierarchical Query của Oracle, mệnh đề `START WITH` là **tùy chọn (optional)**. Khi bỏ qua `START WITH`, Oracle coi **mọi dòng trong bảng đều là một Root node (`LEVEL = 1`)** và duyệt toàn bộ các nhánh con bên dưới từng dòng đó (khiến các nhân viên cấp dưới xuất hiện lặp lại trong nhiều cây con khác nhau).
  * **A, B, D sai:** Oracle không báo lỗi và cũng không tự suy diễn điều kiện `IS NULL`.
</details>

---

### Câu 5 (Question 5)
**Trong một truy vấn phân cấp, có thể đặt mệnh đề `START WITH` đứng SAU mệnh đề `CONNECT BY` được hay không? Ví dụ:**

```sql
SELECT employee_id, first_name, LEVEL
FROM employees
CONNECT BY PRIOR employee_id = manager_id
START WITH manager_id IS NULL;
```

* A. Hoàn toàn hợp lệ và cho kết quả giống hệt như khi viết `START WITH` trước `CONNECT BY`.
* B. Báo lỗi cú pháp vì `START WITH` bắt buộc luôn phải đứng trước `CONNECT BY`.
* C. Thực thi được nhưng đảo ngược thứ tự cây từ dưới lên.
* D. Chỉ hợp lệ khi dùng trên bảng `DUAL`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Theo tài liệu Oracle SQL Language Reference, hai mệnh đề `START WITH` và `CONNECT BY` có thể viết theo thứ tự **`START WITH ... CONNECT BY ...`** hoặc **`CONNECT BY ... START WITH ...`** đều hoàn toàn hợp lệ về mặt cú pháp và cho kết quả giống hệt nhau 100%!
  * **B, C, D sai:** Nhiều thí sinh chỉ quen nhìn `START WITH` đứng trước nên dễ chọn nhầm đáp án B khi gặp câu hỏi bẫy cú pháp này trong đề thi OCA/OCP.
</details>

---

### Câu 6 (Question 6)
**Xem xét sơ đồ cây nhân sự: `King (100)` quản lý `De Haan (102)`; `De Haan (102)` quản lý `Hunold (103)`; `Hunold (103)` quản lý `Ernst (104)`. Khi thực thi câu truy vấn dưới đây (điều kiện `employee_id != 102` đặt ở mệnh đề `WHERE`), những nhân viên nào trong nhánh này sẽ xuất hiện trong kết quả?**

```sql
SELECT employee_id, first_name, manager_id, LEVEL
FROM employees
WHERE employee_id != 102
START WITH employee_id = 100
CONNECT BY PRIOR employee_id = manager_id;
```

* A. Chỉ còn `King (100)`; các nhân viên `102`, `103`, `104` đều bị loại bỏ.
* B. Chỉ loại bỏ duy nhất dòng của `De Haan (102)`, còn `King (100)`, `Hunold (103)`, và `Ernst (104)` VẪN XUẤT HIỆN trong kết quả!
* C. Báo lỗi vì không được dùng mệnh đề `WHERE` chung với `CONNECT BY`.
* D. Không có dòng nào được trả về.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là bẫy quan trọng nhất của Chương 17! Khi điều kiện lọc đơn bảng (`WHERE employee_id != 102`) được đặt ở mệnh đề **`WHERE`**, Oracle thực hiện theo 2 bước:
    1. Bước 1: Dựng **toàn bộ cây phân cấp** bằng `START WITH ... CONNECT BY ...` (lấy ra đầy đủ `100 -> 102 -> 103 -> 104`).
    2. Bước 2: Áp dụng bộ lọc `WHERE employee_id != 102` lên tập kết quả đã dựng xong $\implies$ chỉ cắt bỏ **đúng 1 nút `102`**, trong khi các nút con cháu của `102` là **`103 (Hunold)` và `104 (Ernst)` vẫn còn nguyên**!
  * **A sai:** Kết quả ở đáp án A chỉ xảy ra khi đặt điều kiện `AND employee_id != 102` vào bên trong mệnh đề **`CONNECT BY`**.
  * **C, D sai:** `WHERE` hoàn toàn hợp lệ trong truy vấn phân cấp.
</details>

---

### Câu 7 (Question 7)
**Vẫn với sơ đồ cây nhân sự: `King (100) -> De Haan (102) -> Hunold (103) -> Ernst (104)`. Nếu bạn muốn CẮT BỎ TOÀN BỘ NHÁNH bắt đầu từ `De Haan (102)` (tức là loại bỏ cả `102`, `103`, và `104` khỏi kết quả), bạn phải viết câu lệnh như thế nào?**

* A. Đặt `WHERE employee_id != 102` trước mệnh đề `START WITH`.
* B. Đặt `AND employee_id != 102` ngay bên trong mệnh đề `CONNECT BY`: `CONNECT BY PRIOR employee_id = manager_id AND employee_id != 102`.
* C. Đặt `HAVING employee_id != 102` ở cuối câu lệnh.
* D. Đặt `START WITH employee_id != 102`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Khi đặt điều kiện `AND employee_id != 102` trực tiếp vào trong mệnh đề **`CONNECT BY`**, điều kiện này được kiểm tra **ngay trong quá trình leo cây**. Khi từ `King (100)` tìm các con trực tiếp, nút `102` bị chặn lại ngay lập tức, nên Oracle không bao giờ duyệt tiếp xuống các nút con cháu `103` và `104` $\implies$ **cắt đứt toàn bộ nhánh (Branch Pruning)**!
  * **A sai:** Chỉ loại bỏ nút `102`, vẫn giữ lại `103` và `104`.
  * **C sai:** Không dùng `HAVING` khi không có `GROUP BY`.
  * **D sai:** `START WITH employee_id != 102` sẽ biến tất cả các nhân viên khác (ngoài 102) thành nút gốc `LEVEL = 1`.
</details>

---

### Câu 8 (Question 8)
**Giả cột (Pseudocolumn) nào trong Oracle trả về giá trị `1` nếu dòng hiện tại trong cây phân cấp là một nút lá (không có bất kỳ dòng con nào bên dưới nó) và trả về `0` nếu nó là một nút cha?**

* A. `IS_LEAF`
* B. `CONNECT_BY_ISLEAF`
* C. `LEVEL_LEAF`
* D. `CONNECT_BY_LEAF`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Giả cột chuẩn của Oracle là **`CONNECT_BY_ISLEAF`**: trả về `1` nếu nút hiện tại không có con trong cây kết quả (Leaf node), và trả về `0` nếu nút hiện tại có ít nhất 1 nút con (Parent/Internal node).
  * **A, C, D sai:** Tên giả cột không tồn tại trong Oracle SQL.
</details>

---

### Câu 9 (Question 9)
**Nếu trong bảng dữ liệu có sự cố tham chiếu vòng tròn (ví dụ: nhân viên `A` quản lý `B`, và `B` lại được cập nhật là quản lý của `A`), khi bạn chạy truy vấn `CONNECT BY PRIOR emp_id = mgr_id` thông thường (không có `NOCYCLE`), điều gì sẽ xảy ra?**

* A. Oracle tự động bỏ qua dòng bị lặp và trả về kết quả bình thường.
* B. Câu lệnh chạy lặp vô tận cho đến khi tràn bộ nhớ `TEMP` tablespace.
* C. Oracle phát hiện vòng lặp và lập tức dừng câu lệnh, ném ra lỗi runtime `ORA-01436: CONNECT BY loop in user data`.
* D. Oracle tự động xóa dòng gây lặp khỏi bảng vật lý.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khi duyệt cây bằng `CONNECT BY` (mà không có từ khóa `NOCYCLE`), nếu một nút con trỏ ngược lại một nút tổ tiên đã đi qua trên cùng đường dẫn đó, Oracle phát hiện ngay lập tức và ném lỗi **`ORA-01436: CONNECT BY loop in user data`**.
  * **A, B, D sai:** Chỉ khi có từ khóa `NOCYCLE` thì Oracle mới không báo lỗi và dừng nhánh bị lặp.
</details>

---

### Câu 10 (Question 10)
**Xem xét câu truy vấn dưới đây. Tại sao câu lệnh này lại báo lỗi biên dịch `ORA-30930: NOCYCLE keyword is required with CONNECT_BY_ISCYCLE pseudocolumn`?**

```sql
SELECT employee_id, first_name, CONNECT_BY_ISCYCLE
FROM employees
START WITH manager_id IS NULL
CONNECT BY PRIOR employee_id = manager_id;
```

* A. Vì giả cột `CONNECT_BY_ISCYCLE` chỉ được phép sử dụng khi trong mệnh đề `CONNECT BY` có khai báo tường minh từ khóa `NOCYCLE` (`CONNECT BY NOCYCLE PRIOR ...`).
* B. Vì từ khóa `NOCYCLE` phải được đặt trong mệnh đề `SELECT`.
* C. Vì `CONNECT_BY_ISCYCLE` là một hàm nên bắt buộc phải có cặp ngoặc đơn `CONNECT_BY_ISCYCLE()`.
* D. Vì `START WITH manager_id IS NULL` không thể gây ra vòng lặp.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Quy tắc bắt buộc của Oracle: giả cột **`CONNECT_BY_ISCYCLE` chỉ có thể được sử dụng khi và chỉ khi bạn đã viết từ khóa `NOCYCLE`** trong mệnh đề `CONNECT BY` (`CONNECT BY NOCYCLE PRIOR employee_id = manager_id`). Nếu không có `NOCYCLE`, ngay khi gặp vòng lặp câu lệnh đã văng lỗi `ORA-01436` rồi nên giả cột `CONNECT_BY_ISCYCLE` không có ý nghĩa và bị chặn ngay lúc parse với lỗi **`ORA-30930`**.
  * **B, C, D sai:** `CONNECT_BY_ISCYCLE` là một giả cột (không có dấu ngoặc đơn `()`).
</details>

---

### Câu 11 (Question 11)
**Toán tử một ngôi nào trong truy vấn phân cấp cho phép bạn lấy giá trị cột của Nút gốc (`LEVEL = 1`) đứng đầu nhánh của dòng hiện tại?**

* A. `PRIOR`
* B. `CONNECT_BY_ROOT`
* C. `ROOT_VALUE`
* D. `FIRST_VALUE`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Toán tử **`CONNECT_BY_ROOT expr`** (ví dụ: `CONNECT_BY_ROOT first_name` hoặc `CONNECT_BY_ROOT salary`) luôn trả về giá trị của biểu thức `expr` tại dòng Nút gốc (`LEVEL = 1`) đã sinh ra nhánh chứa dòng hiện tại.
  * **A sai:** `PRIOR expr` chỉ lấy giá trị của **nút cha trực tiếp** (cách dòng hiện tại đúng 1 cấp), chứ không lấy nút gốc `LEVEL = 1` khi đang ở tầng sâu `LEVEL 3, 4`.
  * **C, D sai:** `ROOT_VALUE` không tồn tại; `FIRST_VALUE` là hàm phân tích dùng với `OVER(...)`.
</details>

---

### Câu 12 (Question 12)
**Xem xét câu truy vấn dưới đây. Tại dòng của nhân viên `Ernst` ở tầng `LEVEL = 4` (với nhánh cây `King -> De Haan -> Hunold -> Ernst`), hai cột `boss_1` và `boss_2` sẽ hiển thị tên của ai?**

```sql
SELECT first_name,
       LEVEL,
       PRIOR first_name           AS boss_1,
       CONNECT_BY_ROOT first_name AS boss_2
FROM org_emp
START WITH first_name = 'King'
CONNECT BY PRIOR emp_id = mgr_id;
```

* A. `boss_1 = 'King'` và `boss_2 = 'Hunold'`
* B. `boss_1 = 'Hunold'` và `boss_2 = 'King'`
* C. `boss_1 = 'De Haan'` và `boss_2 = 'King'`
* D. Cả `boss_1` và `boss_2` đều là `'King'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Câu hỏi này giúp phân biệt cực kỳ rõ ràng giữa `PRIOR` và `CONNECT_BY_ROOT` trong danh sách `SELECT`:
    * `PRIOR first_name` (`boss_1`): Trả về tên của dòng đứng ở **bước duyệt liền trước (cha trực tiếp)** của `Ernst`, chính là **`'Hunold'`**.
    * `CONNECT_BY_ROOT first_name` (`boss_2`): Trả về tên của dòng **Nút gốc (`LEVEL = 1`)** của nhánh, chính là **`'King'`**.
  * **A, C, D sai:** Nhầm lẫn giữa cha trực tiếp (`PRIOR`) và gốc cao nhất của nhánh (`CONNECT_BY_ROOT`).
</details>

---

### Câu 13 (Question 13)
**Hàm `SYS_CONNECT_BY_PATH(first_name, '/')` trả về kết quả như thế nào cho nút gốc `'King'` (`LEVEL = 1`) và nút con trực tiếp `'Kochhar'` (`LEVEL = 2`)?**

* A. `'King'` và `'King/Kochhar'`
* B. `'/King'` và `'/King/Kochhar'`
* C. `'King/'` và `'King/Kochhar/'`
* D. `NULL` và `'/Kochhar'`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Hàm `SYS_CONNECT_BY_PATH(column, 'delimiter')` luôn đặt chuỗi phân cách `'delimiter'` **ở phía trước mỗi giá trị cột kể cả nút gốc (`LEVEL = 1`)**! Do đó:
    * Tại `LEVEL = 1` (`King`): trả về **`'/King'`**.
    * Tại `LEVEL = 2` (`Kochhar`): trả về **`'/King/Kochhar'`**.
    *(Mẹo thực tế: Nếu muốn bỏ dấu `'/'` ở đầu chuỗi, lập trình viên thường bọc thêm hàm `LTRIM(SYS_CONNECT_BY_PATH(first_name, '/'), '/')`).*
  * **A, C, D sai:** Quên mất rằng `SYS_CONNECT_BY_PATH` luôn bắt đầu chuỗi bằng ký tự phân cách `delimiter`.
</details>

---

### Câu 14 (Question 14)
**Khi sử dụng hàm `SYS_CONNECT_BY_PATH(department_name, '/')`, nếu có một phòng ban có tên là `'R&D/Innovation'` (tức là bên trong giá trị dữ liệu của cột `department_name` có chứa dấu gạch chéo `'/'` trùng với ký tự phân cách), điều gì sẽ xảy ra?**

* A. Oracle tự động thêm ký tự thoát `\'` thành `'R&D\/Innovation'`.
* B. Oracle tự động xóa dấu `'/'` trong tên phòng ban.
* C. Câu lệnh văng lỗi runtime `ORA-30004: when using SYS_CONNECT_BY_PATH function, cannot have separator as part of column value`.
* D. Câu lệnh chạy bình thường không có bất kỳ lỗi hay thay đổi nào.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là bẫy rất nổi tiếng trong đề thi OCP! Hàm `SYS_CONNECT_BY_PATH(col, 'sep')` nghiêm cấm giá trị của cột `col` chứa chuỗi con trùng với chuỗi phân cách `'sep'`. Nếu dữ liệu chứa `'/'` mà bạn dùng `'/'` làm dấu phân cách, Oracle sẽ ném lỗi **`ORA-30004`**. Cách xử lý là chọn một chuỗi phân cách khác không xuất hiện trong dữ liệu (như `' -> '` hoặc `'|'`) hoặc dùng `REPLACE(department_name, '/', '-')` bên trong đối số thứ nhất.
  * **A, B, D sai:** Oracle không tự động escape ký tự phân cách trong `SYS_CONNECT_BY_PATH`.
</details>

---

### Câu 15 (Question 15)
**Trong một câu truy vấn phân cấp, tại sao bạn nên sử dụng mệnh đề `ORDER SIBLINGS BY salary DESC` thay vì `ORDER BY salary DESC` thông thường?**

* A. Vì `ORDER BY` thông thường bị cấm hoàn toàn trong câu lệnh có `CONNECT BY` (báo lỗi cú pháp).
* B. Vì `ORDER BY` thông thường sẽ sắp xếp phẳng toàn bộ các dòng kết quả theo lương mà phớt lờ quan hệ cha-con (làm vỡ cấu trúc cây), trong khi `ORDER SIBLINGS BY` bảo toàn nguyên vẹn cấu trúc cây phân cấp và chỉ sắp xếp thứ tự giữa các nút anh em có cùng cha trực tiếp.
* C. Vì `ORDER SIBLINGS BY` chỉ sắp xếp các nút lá (`CONNECT_BY_ISLEAF = 1`), giữ nguyên các nút cha.
* D. Vì `ORDER SIBLINGS BY` giúp tự động khử vòng lặp dữ liệu giống `NOCYCLE`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * Nếu dùng `ORDER BY salary DESC` thông thường: câu lệnh vẫn chạy (không báo lỗi cú pháp), nhưng nó sẽ gom mọi dòng ở mọi tầng bậc lại và xếp chung từ lương cao xuống lương thấp, làm **phá vỡ hoàn toàn thứ tự hiển thị cha-con của cây phân cấp**.
    * Khi dùng **`ORDER SIBLINGS BY salary DESC`**: Oracle giữ nguyên cấu trúc duyệt theo chiều sâu (cha đứng trên, ngay dưới là các con cháu của cha đó), và chỉ so sánh `salary DESC` giữa các nút anh em ruột (cùng `manager_id`) để quyết định nhánh anh em nào được in ra trước!
  * **A, C, D sai:** `ORDER BY` thường không gây lỗi cú pháp mà gây lỗi logic hiển thị cây.
</details>

---

### Câu 16 (Question 16)
**Điều gì sẽ xảy ra nếu bạn sử dụng mệnh đề `ORDER SIBLINGS BY first_name` trong một câu lệnh `SELECT` thông thường KHÔNG CÓ mệnh đề `CONNECT BY`?**

* A. Câu lệnh thực thi bình thường giống như `ORDER BY first_name`.
* B. Câu lệnh báo lỗi `ORA-30929: ORDER SIBLINGS BY clause not allowed here` vì `ORDER SIBLINGS BY` chỉ hợp lệ trong truy vấn phân cấp có `CONNECT BY`.
* C. Câu lệnh tự động nhóm các dòng theo chữ cái đầu tiên của `first_name`.
* D. Câu lệnh chỉ sắp xếp được nếu có mệnh đề `GROUP BY`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Từ khóa `SIBLINGS` trong `ORDER SIBLINGS BY` chỉ có ý nghĩa khi tồn tại cây phân cấp được tạo bởi `CONNECT BY` (thậm chí với Recursive CTE dùng mệnh đề `WITH`, bạn cũng dùng `SEARCH DEPTH FIRST BY ... SET order_col` chứ không dùng `ORDER SIBLINGS BY`). Dùng `ORDER SIBLINGS BY` mà không có `CONNECT BY` sẽ báo lỗi **`ORA-30929`**.
  * **A, C, D sai:** Vi phạm quy tắc ngữ cảnh của `ORDER SIBLINGS BY`.
</details>

---

### Câu 17 (Question 17)
**Thành phần nào sau đây KHÔNG ĐƯỢC PHÉP xuất hiện trực tiếp bên trong biểu thức điều kiện của mệnh đề `CONNECT BY`?**

* A. Toán tử `AND` kết hợp nhiều điều kiện cột.
* B. Một câu truy vấn con (Subquery), ví dụ: `CONNECT BY PRIOR emp_id = mgr_id AND dept_id IN (SELECT dept_id FROM departments WHERE ...)`.
* C. Các phép so sánh khác bằng như `!=`, `>`, `<`.
* D. Từ khóa `NOCYCLE`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Theo quy định của Oracle SQL, bạn **KHÔNG ĐƯỢC PHÉP đặt một câu truy vấn con (Subquery) bên trong mệnh đề `CONNECT BY`** (nếu vi phạm sẽ báo lỗi `ORA-01437` hoặc lỗi không cho phép subquery tại đây). Tuy nhiên, bạn hoàn toàn **được phép** đặt Subquery trong mệnh đề **`START WITH`** (ví dụ: `START WITH emp_id = (SELECT ...)` là hoàn toàn hợp lệ!).
  * **A, C, D sai:** Đều được phép sử dụng hợp lệ bên trong mệnh đề `CONNECT BY`.
</details>

---

### Câu 18 (Question 18)
**Xem xét câu lệnh SQL ngắn gọn thường được các lập trình viên Oracle sử dụng dưới đây. Câu lệnh này trả về kết quả gì?**

```sql
SELECT LEVEL AS num
FROM dual
CONNECT BY LEVEL <= 10;
```

* A. Báo lỗi vì bảng `DUAL` không có cột `LEVEL` và không có từ khóa `PRIOR`.
* B. Chỉ trả về 1 dòng duy nhất có giá trị `1` vì bảng `DUAL` chỉ có 1 dòng.
* C. Sinh ra 10 dòng dữ liệu chứa các số nguyên liên tiếp từ `1` đến `10` (Kỹ thuật Row Generator).
* D. Báo lỗi vòng lặp `ORA-01436: CONNECT BY loop in user data`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** `SELECT LEVEL FROM dual CONNECT BY LEVEL <= n` là kỹ thuật **Row Generator (Sinh dòng dữ liệu ảo)** kinh điển nhất trong Oracle SQL! Vì bảng `DUAL` chỉ có 1 dòng, ở bước 1 dòng đó có `LEVEL = 1`; bước 2 điều kiện `LEVEL <= 10` vẫn đúng nên kết nối lại chính dòng đó ở `LEVEL = 2`... cho đến khi `LEVEL = 10`, tổng cộng sinh ra **10 dòng từ `1` đến `10`**.
  * **A, B, D sai:** Khi dùng `CONNECT BY LEVEL <= n` trên bảng 1 dòng `DUAL`, Oracle cho phép không cần từ khóa `PRIOR` và không báo lỗi vòng lặp.
</details>

---

### Câu 19 (Question 19)
**Nếu bạn thực hiện một phép kết nối hai bảng (`SELECT e.first_name, d.department_name FROM employees e JOIN departments d ON e.department_id = d.department_id`) kết hợp với `START WITH ... CONNECT BY PRIOR e.employee_id = e.manager_id` và thêm điều kiện lọc ở mệnh đề `WHERE d.department_name = 'IT'`, thứ tự xử lý giữa `CONNECT BY` và `WHERE` sẽ diễn ra như thế nào?**

* A. Oracle lọc `WHERE d.department_name = 'IT'` trước rồi mới chạy `CONNECT BY`, nên cắt đứt các nhánh không thuộc phòng IT.
* B. Oracle thực hiện phép Join và xây dựng cây phân cấp `CONNECT BY` trước, **sau đó mới áp dụng điều kiện lọc单 `WHERE`** để giữ lại các nút có `department_name = 'IT'`.
* C. Không được phép dùng phép `JOIN` trong câu truy vấn có `CONNECT BY`.
* D. Phải đặt điều kiện `ON` sau mệnh đề `CONNECT BY`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Trong một câu truy vấn phân cấp có chứa phép `JOIN`, các điều kiện kết nối (`ON` hoặc điều kiện join giữa 2 bảng trong `WHERE`) được thực hiện để ghép bảng, tiếp theo Oracle dựng toàn bộ cây phân cấp theo `START WITH ... CONNECT BY`, và **cuối cùng mới áp dụng các vị từ lọc (filter predicates) trong mệnh đề `WHERE`** lên các nút của cây đã dựng.
  * **A, C, D sai:** Oracle hỗ trợ đầy đủ phép `JOIN` trong truy vấn phân cấp.
</details>

---

### Câu 20 (Question 20)
**Giả sử nhân viên `Hunold (103)` là quản lý của `Ernst (104)` và `Lorentz (105)`, còn `Ernst` và `Lorentz` không quản lý ai cả. Nhưng trong câu truy vấn dưới đây, bạn thêm điều kiện chặn ở `CONNECT BY` để chỉ duyệt đến `LEVEL <= 2` (tức là dừng lại ở `Hunold (103)` tại `LEVEL = 2`, không duyệt xuống `Ernst` và `Lorentz` ở `LEVEL = 3`). Hỏi giá trị của `CONNECT_BY_ISLEAF` tại dòng `Hunold (103)` trong kết quả của câu truy vấn này sẽ là bao nhiêu?**

```sql
SELECT emp_id, first_name, LEVEL, CONNECT_BY_ISLEAF AS is_leaf
FROM org_emp
START WITH emp_id = 102 -- De Haan (LEVEL 1)
CONNECT BY PRIOR emp_id = mgr_id
       AND LEVEL <= 2;  -- Dừng ở Hunold (LEVEL 2)
```

* A. `0` (vì trong bảng vật lý `ORG_EMP`, `Hunold` vẫn có nhân viên cấp dưới là `Ernst` và `Lorentz`).
* B. `1` (vì `CONNECT_BY_ISLEAF` đánh giá dựa trên **cây kết quả thực tế được dựng bởi `CONNECT BY`**; do nhánh bên dưới `Hunold` đã bị cắt tại `CONNECT BY AND LEVEL <= 2`, nên trong cây kết quả này `Hunold` trở thành nút lá!).
* C. `NULL`
* D. Báo lỗi vì không thể dùng `LEVEL <= 2` bên trong `CONNECT BY`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là một câu hỏi mức độ khó của kỳ thi OCP! Giả cột `CONNECT_BY_ISLEAF` kiểm tra xem một nút có sinh ra nút con nào **bên trong cây phân cấp được tạo bởi mệnh đề `CONNECT BY` hiện hành** hay không (chứ không phải kiểm tra dữ liệu thô trong bảng). Vì điều kiện `AND LEVEL <= 2` nằm ngay trong `CONNECT BY` đã chặn không cho `Hunold (LEVEL = 2)` sinh ra bất kỳ nút con `LEVEL = 3` nào, nên tại dòng `Hunold`, `CONNECT_BY_ISLEAF` trả về **`1`**!
  * *(Lưu ý ngược lại: Nếu đặt `WHERE LEVEL <= 2` ở mệnh đề `WHERE`, thì lúc dựng cây `Hunold` đã sinh ra con ở `LEVEL 3` rồi mới bị `WHERE` lọc sau, nên khi đó `CONNECT_BY_ISLEAF` của `Hunold` sẽ là **`0`**!).*
  * **A, C, D sai:** Không nắm được thời điểm đánh giá `CONNECT_BY_ISLEAF` trong quá trình dựng cây.
</details>

---

### Câu 21 (Question 21)
**Ngược lại với Câu 20, nếu bạn chuyển điều kiện `LEVEL <= 2` từ mệnh đề `CONNECT BY` sang mệnh đề `WHERE` như câu lệnh dưới đây, thì tại dòng của `Hunold (103)` (`LEVEL = 2`), giá trị của `CONNECT_BY_ISLEAF` sẽ là bao nhiêu?**

```sql
SELECT emp_id, first_name, LEVEL, CONNECT_BY_ISLEAF AS is_leaf
FROM org_emp
WHERE LEVEL <= 2
START WITH emp_id = 102 -- De Haan (LEVEL 1) -> Hunold (LEVEL 2) -> Ernst (LEVEL 3)
CONNECT BY PRIOR emp_id = mgr_id;
```

* A. `0` (vì khi dựng cây ở bước `CONNECT BY`, `Hunold` vẫn có con là `Ernst` ở `LEVEL 3` nên `Hunold` được đánh dấu `CONNECT_BY_ISLEAF = 0`; sau đó bước `WHERE LEVEL <= 2` mới cắt bỏ dòng `Ernst`).
* B. `1`
* C. `2`
* D. Báo lỗi vì `WHERE LEVEL <= 2` không hợp lệ.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** So sánh Câu 20 và Câu 21 cho thấy sự thống nhất tuyệt đối về cơ chế hoạt động của Oracle:
    1. Bước `CONNECT BY` dựng toàn bộ cây tới tận `LEVEL 3` (`Ernst`, `Lorentz`) và xác định `CONNECT_BY_ISLEAF` ngay trên cây đầy đủ đó $\implies$ `Hunold` có con nên `CONNECT_BY_ISLEAF = 0`.
    2. Bước `WHERE LEVEL <= 2` chạy sau cùng, chỉ ẩn các dòng `LEVEL 3` đi mà không tính lại `CONNECT_BY_ISLEAF` của `Hunold` $\implies$ `Hunold` vẫn mang `is_leaf = 0`!
  * **B, C, D sai:** Nhưng lưu ý thực tế về hiệu năng: để giới hạn độ sâu của cây, luôn đặt `AND LEVEL <= n` ở trong `CONNECT BY` để dừng leo cây sớm thay vì đặt ở `WHERE`!
</details>

---

### Câu 22 (Question 22)
**Toán tử `CONNECT_BY_ROOT` và hàm `SYS_CONNECT_BY_PATH` được phép xuất hiện ở những mệnh đề nào của một câu truy vấn phân cấp?**

* A. Chỉ được phép xuất hiện duy nhất trong mệnh đề `CONNECT BY`.
* B. Chỉ được phép xuất hiện trong mệnh đề `START WITH`.
* C. Được phép xuất hiện trong mệnh đề `SELECT`, `WHERE`, và `ORDER BY` (hoặc `ORDER SIBLINGS BY`) của câu truy vấn có `CONNECT BY`, nhưng KHÔNG được phép dùng bên trong chính điều kiện của `START WITH` hay `CONNECT BY`.
* D. Dùng được trong mọi câu lệnh `SELECT` kể cả khi không có `CONNECT BY`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Cả `CONNECT_BY_ROOT` và `SYS_CONNECT_BY_PATH` đều cần thông tin đường đi từ gốc sau khi nút đã được xác định trong cây, nên chúng được phép dùng ở `SELECT`, `WHERE`, `GROUP BY` / `HAVING`, và `ORDER [SIBLINGS] BY`, nhưng **bị cấm dùng bên trong điều kiện của `CONNECT BY` hoặc `START WITH`**.
  * **A, B, D sai:** Nếu dùng `CONNECT_BY_ROOT` trong `CONNECT BY` sẽ báo lỗi `ORA-30007: CONNECT_BY_ROOT operator is not supported in the START WITH or the CONNECT BY condition`.
</details>

---

### Câu 23 (Question 23)
**Hàm chuẩn để thụt lề (indent) tên nhân viên theo từng bậc độ sâu `LEVEL` trong báo cáo cây phân cấp (ví dụ: `LEVEL = 1` thụt 0 dấu cách, `LEVEL = 2` thụt 2 dấu cách, `LEVEL = 3` thụt 4 dấu cách...) được viết như thế nào?**

* A. `LPAD(first_name, (LEVEL - 1) * 2, ' ')`
* B. `LPAD(' ', (LEVEL - 1) * 2, ' ') || first_name` (hoặc `LPAD(first_name, LENGTH(first_name) + (LEVEL - 1) * 2, ' ')`)
* C. `INDENT(first_name, LEVEL * 2)`
* D. `SUBSTR(' ', 1, LEVEL) || first_name`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Hãy cẩn thận với tham số thứ hai của hàm `LPAD(str, total_length, pad_char)`: tham số thứ hai là **tổng độ dài chuỗi kết quả sau khi đệm**, chứ không phải số lượng ký tự đệm thêm!
    * Do đó, bạn phải viết `LPAD(' ', (LEVEL - 1) * 2, ' ') || first_name` (tạo chuỗi khoảng trắng có độ dài `(LEVEL - 1) * 2` rồi ghép với `first_name`), **hoặc** `LPAD(first_name, LENGTH(first_name) + (LEVEL - 1) * 2, ' ')`.
  * **A sai:** Đây là bẫy cực kỳ phổ biến! Tại `LEVEL = 1`, `(LEVEL - 1) * 2 = 0`, nên `LPAD(first_name, 0, ' ')` sẽ cắt cụt mất tên nhân viên thành **`NULL`**! Tại `LEVEL = 2`, `LPAD('Alexander', 2, ' ')` sẽ cắt cụt tên thành `'Al'`!
  * **C, D sai:** Không có hàm `INDENT`; `SUBSTR(' ', 1, LEVEL)` chỉ có tối đa 1 khoảng trắng.
</details>

---

### Câu 24 (Question 24)
**So sánh giữa hai phương pháp truy vấn dữ liệu phân cấp trong Oracle: Cú pháp truyền thống `START WITH ... CONNECT BY` và Cú pháp `WITH` đệ quy (Recursive Subquery Factoring), phát biểu nào sau đây là ĐÚNG?**

* A. `CONNECT BY` là chuẩn ANSI SQL quốc tế chạy được trên mọi hệ quản trị CSDL (PostgreSQL, SQL Server, MySQL), còn Recursive `WITH` là cú pháp độc quyền của riêng Oracle.
* B. Recursive `WITH` là chuẩn ANSI SQL:1999 tương thích đa nền tảng và linh hoạt hơn, trong khi `START WITH ... CONNECT BY` là cú pháp đặc trưng của Oracle (rất ngắn gọn với các giả cột dựng sẵn như `LEVEL`, `CONNECT_BY_ISLEAF`, `SYS_CONNECT_BY_PATH`).
* C. Từ Oracle 19c, mệnh đề `CONNECT BY` đã bị xóa bỏ hoàn toàn.
* D. Recursive `WITH` không thể phát hiện vòng lặp dữ liệu, chỉ có `CONNECT BY NOCYCLE` mới làm được.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * `START WITH ... CONNECT BY PRIOR` là cú pháp truyền thống độc quyền của Oracle (có từ Oracle 2), cực kỳ ngắn gọn và tiện lợi nhờ hệ sinh thái `LEVEL`, `CONNECT_BY_ISLEAF`, `CONNECT_BY_ROOT`, `SYS_CONNECT_BY_PATH`, `ORDER SIBLINGS BY`.
    * `Recursive Subquery Factoring (WITH)` là chuẩn **ANSI SQL:1999** (bổ sung từ Oracle 11gR2), có đầy đủ khả năng tương đương (`SEARCH DEPTH/BREADTH FIRST`, `CYCLE`) và dễ dàng chuyển đổi sang các RDBMS khác.
  * **A, C, D sai:** Đảo ngược tính chuẩn ANSI và tính năng của 2 phương pháp.
</details>

---

### Câu 25 (Question 25)
**Xem xét câu truy vấn dưới đây. Nếu nhân viên `King (100)` ở `LEVEL = 1`, tại dòng của `King`, biểu thức `PRIOR first_name` trong danh sách `SELECT` sẽ trả về giá trị gì?**

```sql
SELECT emp_id,
       first_name,
       LEVEL,
       PRIOR first_name AS parent_name
FROM org_emp
START WITH emp_id = 100
CONNECT BY PRIOR emp_id = mgr_id;
```

* A. Trả về `'King'` (chính tên của nút gốc).
* B. Trả về giá trị `NULL` (vì nút gốc ở `LEVEL = 1` không có dòng cha đứng trước nó trong nhánh duyệt).
* C. Báo lỗi runtime vì không thể gọi `PRIOR` tại dòng `LEVEL = 1`.
* D. Trả về chuỗi rỗng `'ROOT'`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Toán tử `PRIOR expr` lấy giá trị của biểu thức `expr` từ dòng **cha trực tiếp (dòng ở bước `LEVEL - 1`)**. Đối với mọi dòng Nút gốc (`LEVEL = 1`), không có bước duyệt nào đứng trước nó nên mọi biểu thức `PRIOR column_name` tại dòng `LEVEL = 1` đều luôn luôn trả về **`NULL`**!
  * **A, C, D sai:** Chỉ có `CONNECT_BY_ROOT first_name` mới trả về `'King'` tại dòng `LEVEL = 1`, còn `PRIOR first_name` tại `LEVEL = 1` trả về `NULL`.
</details>

---
