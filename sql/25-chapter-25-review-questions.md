# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chương 25: Package và Trigger

> **Tài liệu tham chiếu:** *OCP Oracle Database Program with PL/SQL Study Guide (Exam 1Z0-149)*  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle OCP 1Z0-149 & VNPT kèm phân tích & đáp án chi tiết.  
> **Cách học:** Bạn hãy tự đọc đề và chọn đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và nắm vững bẫy thi.

---

### Câu 1 (Question 1)
**Trong trường hợp nào sau đây bạn có thể tạo một `PACKAGE SPECIFICATION` hoạt động hoàn toàn bình thường mà KHÔNG CẦN phải tạo `PACKAGE BODY` (Bodiless Package)?**

* A. Khi `PACKAGE SPECIFICATION` chỉ chứa các khai báo hằng số (`CONSTANT`), biến toàn cục, kiểu dữ liệu (`TYPE`), ngoại lệ (`EXCEPTION`), hoặc con trỏ (`CURSOR`) đã có đầy đủ câu lệnh `SELECT`.
* B. Khi `PACKAGE SPECIFICATION` chỉ chứa tối đa một `FUNCTION` và không có `PROCEDURE` nào.
* C. Khi `PACKAGE SPECIFICATION` được khai báo với quyền `AUTHID CURRENT_USER`.
* D. Không có trường hợp nào; mọi `PACKAGE SPECIFICATION` bắt buộc phải đi kèm một `PACKAGE BODY`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Một **Bodiless Package** (Package không có phần Body) hoàn toàn hợp lệ và rất phổ biến trong thực tế khi phần `PACKAGE SPECIFICATION` không chứa bất kỳ khai báo chương trình con (`PROCEDURE`/`FUNCTION`) hay `CURSOR` ẩn câu truy vấn nào cần được cài đặt chi tiết. Nó thường được dùng để lưu trữ tập trung các hằng số cấu hình, kiểu dữ liệu `RECORD`/`COLLECTION` dùng chung, hoặc các ngoại lệ gắn `PRAGMA EXCEPTION_INIT`.
  * **B, C, D sai:** Chỉ cần có 1 `FUNCTION` hoặc 1 `PROCEDURE` trong Spec thì bắt buộc phải có `PACKAGE BODY` để định nghĩa phần thân thực thi cho nó.
</details>

---

### Câu 2 (Question 2)
**Giả sử Thủ tục độc lập `PROC_A` gọi tới hàm `PKG_HR.FN_GET_SAL` nằm trong gói `PKG_HR`. Điều gì sẽ xảy ra với trạng thái của `PROC_A` nếu lập trình viên chỉnh sửa câu lệnh SQL bên trong `PACKAGE BODY PKG_HR` và biên dịch lại chỉ phần `PACKAGE BODY` (giữ nguyên `PACKAGE SPECIFICATION`)?**

* A. `PROC_A` lập tức bị đánh dấu thành `INVALID` và phải được biên dịch lại thủ công.
* B. `PROC_A` vẫn giữ nguyên trạng thái `VALID` vì các đối tượng bên ngoài chỉ phụ thuộc vào `PACKAGE SPECIFICATION` chứ không phụ thuộc vào `PACKAGE BODY`.
* C. Cả `PROC_A` và `PACKAGE SPECIFICATION PKG_HR` đều bị chuyển sang trạng thái `INVALID`.
* D. Oracle từ chối biên dịch `PACKAGE BODY` cho đến khi xóa `PROC_A`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là lợi ích lớn nhất của Package về mặt **Quản lý phụ thuộc (Dependency Management)**:
    * Trong mô hình phụ thuộc của Oracle: `PROC_A` phụ thuộc vào `PACKAGE SPECIFICATION PKG_HR`, và `PACKAGE BODY PKG_HR` cũng phụ thuộc vào `PACKAGE SPECIFICATION PKG_HR`.
    * Hoàn toàn **không có** mũi tên phụ thuộc từ `PROC_A` sang `PACKAGE BODY PKG_HR`!
    * Vì vậy, bạn có thể sửa lỗi, tối ưu hóa câu lệnh SQL và biên dịch lại `PACKAGE BODY` bao nhiêu lần tùy ý mà **không bao giờ làm `INVALID`** bất kỳ thủ tục, hàm, hay view nào gọi tới Package đó (miễn là không chạm vào `PACKAGE SPECIFICATION`).
  * **A, C, D sai:** Chỉ khi bạn biên dịch lại `CREATE OR REPLACE PACKAGE pkg_hr` (phần Specification) thì `PROC_A` mới bị ảnh hưởng.
</details>

---

### Câu 3 (Question 3)
**Khi bạn muốn khai báo quyền thực thi của người gọi (`AUTHID CURRENT_USER`) cho một Package có cả Specification và Body, bạn phải đặt mệnh đề `AUTHID CURRENT_USER` ở vị trí nào?**

* A. Đặt ở cả `CREATE OR REPLACE PACKAGE` và `CREATE OR REPLACE PACKAGE BODY`.
* B. Chỉ đặt duy nhất ở `CREATE OR REPLACE PACKAGE` (phần Specification), không được phép đặt ở `PACKAGE BODY` hay ở từng Procedure/Function bên trong Package.
* C. Chỉ đặt ở `CREATE OR REPLACE PACKAGE BODY`.
* D. Đặt riêng lẻ ở từng `PROCEDURE` và `FUNCTION` bên trong `PACKAGE SPECIFICATION`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Mệnh đề `AUTHID {DEFINER | CURRENT_USER}` là thuộc tính của toàn bộ Package và **chỉ được phép xuất hiện duy nhất trong phần Header của `PACKAGE SPECIFICATION`** (`CREATE OR REPLACE PACKAGE pkg_name AUTHID CURRENT_USER IS ...`). Nếu bạn viết `AUTHID` trong `PACKAGE BODY` hoặc trong từng hàm con của Package, trình biên dịch sẽ báo lỗi cú pháp `PLS-00103`.
  * **A, C, D sai:** Ngược lại với `AUTHID` (chỉ đặt ở Spec), chỉ thị `PRAGMA SERIALLY_REUSABLE;` thì lại bắt buộc phải đặt ở cả Spec và Body! Đừng nhầm lẫn hai quy tắc này.
</details>

---

### Câu 4 (Question 4)
**Xem xét `PACKAGE SPECIFICATION` dưới đây sử dụng kỹ thuật Nạp chồng hàm (`Overloading`). Cặp khai báo nào dưới đây sẽ gây LỖI khi biên dịch hoặc khi gọi hàm do vi phạm quy tắc Overloading trong PL/SQL? (Chọn 2 đáp án đúng)**

* A. `PROCEDURE calc(p_id IN NUMBER);` và `PROCEDURE calc(p_id IN NUMBER, p_rate IN NUMBER);`
* B. `FUNCTION get_val(p_x NUMBER) RETURN VARCHAR2;` và `FUNCTION get_val(p_x NUMBER) RETURN NUMBER;`
* C. `PROCEDURE set_data(p_a IN VARCHAR2);` và `PROCEDURE set_data(p_a OUT VARCHAR2);`
* D. `PROCEDURE process(p_date DATE, p_num NUMBER);` và `PROCEDURE process(p_num NUMBER, p_date DATE);`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, C**
* **Giải thích chuyên sâu:**
  * **B là cặp không thể nạp chồng (Đúng):** Hai `FUNCTION` có cùng tên và cùng danh sách tham số đầu vào (`(p_x NUMBER)`) nhưng **chỉ khác nhau về kiểu trả về (`RETURN VARCHAR2` vs `RETURN NUMBER`)** không thể phân biệt được tại nơi gọi, nên không thể Overloading.
  * **C là cặp không thể nạp chồng (Đúng):** Hai `PROCEDURE` có cùng tên và cùng kiểu dữ liệu tham số nhưng **chỉ khác nhau về chế độ tham số (`IN` vs `OUT` / `IN OUT`)** hoặc chỉ khác tên tham số thì không thể phân biệt được khi gọi `pkg.set_data(v_str);`.
  * **A và D là nạp chồng hợp lệ:** Cặp A khác nhau về số lượng tham số (1 vs 2); cặp D khác nhau về thứ tự họ kiểu dữ liệu (`(DATE, NUMBER)` vs `(NUMBER, DATE)`).
</details>

---

### Câu 5 (Question 5)
**Cho `PACKAGE` và `PACKAGE BODY` dưới đây. Chuyện gì sẽ xảy ra khi biên dịch Package này và khi thực thi khối lệnh gọi `pkg_overload.print_val(100);`?**

```sql
CREATE OR REPLACE PACKAGE pkg_overload IS
    PROCEDURE print_val(p_n NUMBER);
    PROCEDURE print_val(p_n INTEGER);
END pkg_overload;
/

CREATE OR REPLACE PACKAGE BODY pkg_overload IS
    PROCEDURE print_val(p_n NUMBER) IS
    BEGIN
        DBMS_OUTPUT.PUT_LINE('NUMBER: ' || p_n);
    END;

    PROCEDURE print_val(p_n INTEGER) IS
    BEGIN
        DBMS_OUTPUT.PUT_LINE('INTEGER: ' || p_n);
    END;
END pkg_overload;
/

BEGIN
    pkg_overload.print_val(100);
END;
```

* A. Lệnh `CREATE PACKAGE` báo lỗi biên dịch ngay lập tức vì `NUMBER` và `INTEGER` thuộc cùng một họ kiểu dữ liệu.
* B. Cả `PACKAGE` và `PACKAGE BODY` đều biên dịch thành công, và khối lệnh vô danh in ra `INTEGER: 100`.
* C. Cả `PACKAGE` và `PACKAGE BODY` đều biên dịch thành công, và khối lệnh vô danh in ra `NUMBER: 100`.
* D. Cả `PACKAGE` và `PACKAGE BODY` đều biên dịch thành công mà không báo lỗi, nhưng khi biên dịch khối lệnh gọi `pkg_overload.print_val(100);` sẽ báo lỗi `PLS-00307: too many declarations of 'PRINT_VAL' match this call`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu:**
  * **D đúng:** Đây là bẫy cực kỳ tinh vi trong đề thi OCP 1Z0-149!
    1. Trong PL/SQL, kiểu `INTEGER` thực chất chỉ là một kiểu con có ràng buộc (`SUBTYPE`) của kiểu **`NUMBER`** (cùng một họ kiểu dữ liệu - Datatype Family). Tương tự, `VARCHAR2` và `CHAR` cũng thuộc cùng một họ.
    2. Khi bạn chạy lệnh `CREATE PACKAGE` và `CREATE PACKAGE BODY`, trình biên dịch PL/SQL **vẫn cho phép biên dịch thành công 100%** mà không báo lỗi!
    3. Tuy nhiên, khi bạn viết lệnh gọi `pkg_overload.print_val(100);`, số `100` khớp với cả `NUMBER` lẫn `INTEGER`, khiến trình biên dịch rơi vào trạng thái nhập nhằng (Ambiguous Call) và báo lỗi **`PLS-00307: too many declarations of 'PRINT_VAL' match this call`**!
  * **A, B, C sai:** Hãy nhớ: Lỗi nạp chồng cùng họ kiểu dữ liệu (`NUMBER`/`INTEGER` hoặc `VARCHAR2`/`CHAR`) không nổ lúc tạo Package mà nổ **lúc gọi hàm (`PLS-00307`)**!
</details>

---

### Câu 6 (Question 6)
**Khối khởi tạo của Package (Package Initialization Block — phần `BEGIN ... END` nằm ở cuối `PACKAGE BODY`) được thực thi khi nào và bao nhiêu lần (đối với Package thông thường không có `SERIALLY_REUSABLE`)?**

* A. Thực thi mỗi lần bất kỳ một Procedure hoặc Function nào trong Package được gọi.
* B. Thực thi đúng 1 lần duy nhất cho toàn bộ Database Instance ngay khi Database khởi động (`STARTUP`).
* C. Thực thi đúng 1 lần duy nhất trong mỗi phiên làm việc (Session), ngay tại lần đầu tiên phiên làm việc đó tham chiếu đến bất kỳ thành phần nào của Package.
* D. Chỉ thực thi khi người dùng gọi tường minh thủ tục `DBMS_SESSION.INITIALIZE_PACKAGE`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Khi một Session lần đầu tiên gọi một hàm/thủ tục hoặc truy cập một biến/hằng số của Package, PL/SQL Engine sẽ nạp Package vào bộ nhớ, cấp phát vùng trạng thái UGA cho Session đó, và **chạy khối `BEGIN ... END` ở cuối `PACKAGE BODY` đúng 1 lần**. Trong các lần gọi tiếp theo từ cùng Session đó, khối khởi tạo sẽ không chạy lại nữa.
  * **A, B, D sai:** Mỗi Session mới kết nối vào Database và gọi Package sẽ chạy khối khởi tạo của riêng Session đó 1 lần.
</details>

---

### Câu 7 (Question 7)
**Cho Package `PKG_STATE` có một biến toàn cục `g_val NUMBER := 10;` khai báo trong `PACKAGE SPECIFICATION`.
- Tại thời điểm T1: Session A thực thi `BEGIN pkg_state.g_val := 50; COMMIT; END;`.
- Tại thời điểm T2: Session B kết nối vào Database với cùng tài khoản User và thực thi `BEGIN DBMS_OUTPUT.PUT_LINE(pkg_state.g_val); END;`.
Giá trị mà Session B in ra màn hình là bao nhiêu?**

* A. `50` (vì Session A đã thực hiện `COMMIT` và hai Session đăng nhập cùng một User).
* B. `10` (vì trạng thái biến toàn cục của Package được lưu riêng biệt trong vùng nhớ UGA của từng Session, hoàn toàn không chia sẻ giữa các Session dù đăng nhập cùng một User).
* C. `NULL`.
* D. Báo lỗi `ORA-04068: existing state of packages has been discarded`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Biến toàn cục của Package (Package-level variables) có phạm vi là **Session-specific (Riêng biệt theo từng phiên làm việc)**, không phải Database-wide và cũng không chia sẻ theo User! Khi Session B chạm vào `pkg_state` lần đầu tiên, Session B nhận một bản sao biến `g_val` hoàn toàn mới trong UGA của riêng nó với giá trị khởi tạo ban đầu là **`10`**.
  * **A, C, D sai:** Lệnh `COMMIT` chỉ áp dụng cho dữ liệu trong bảng Database, không bao giờ đồng bộ biến PL/SQL sang Session khác.
</details>

---

### Câu 8 (Question 8)
**Khi sử dụng chỉ thị trình biên dịch `PRAGMA SERIALLY_REUSABLE;` cho một Package có cả Specification và Body, những quy tắc nào sau đây là ĐÚNG? (Chọn 2 đáp án đúng)**

* A. Chỉ thị `PRAGMA SERIALLY_REUSABLE;` bắt buộc phải được khai báo ở cả hai nơi: trong `PACKAGE SPECIFICATION` và trong `PACKAGE BODY`.
* B. Trạng thái các biến toàn cục của Package chỉ tồn tại trong phạm vi một lần gọi Server (Single Call / Unit of work) rồi được giải phóng ngay về vùng nhớ SGA, không giữ lại suốt cả Session.
* C. Các hàm trong một Package có `PRAGMA SERIALLY_REUSABLE` được khuyến khích gọi trực tiếp bên trong các câu lệnh SQL `SELECT` và bên trong các DML Trigger để tăng tốc độ.
* D. Chỉ được đặt `PRAGMA SERIALLY_REUSABLE;` trong `PACKAGE BODY`, nếu đặt trong `PACKAGE SPECIFICATION` sẽ báo lỗi biên dịch.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B**
* **Giải thích chuyên sâu:**
  * **A đúng:** Đối với một Package có Body, `PRAGMA SERIALLY_REUSABLE;` **phải xuất hiện ở cả Specification và Body**. Nếu chỉ viết ở 1 trong 2 nơi, trình biên dịch sẽ báo lỗi `PLS-00709: pragma SERIALLY_REUSABLE must be declared in both package specification and body`.
  * **B đúng:** Nhờ `SERIALLY_REUSABLE`, vùng nhớ của Package được đặt trong SGA và được thu hồi ngay sau mỗi lần gọi từ Client kết thúc. Nếu gọi lại Package ở khối lệnh tiếp theo, các biến toàn cục sẽ quay về giá trị mặc định ban đầu và Khối khởi tạo sẽ chạy lại!
  * **C sai:** Ngược lại hoàn toàn! Một Package có `PRAGMA SERIALLY_REUSABLE` **BỊ CẤM** gọi từ câu lệnh SQL hoặc từ bên trong DML Trigger (sẽ ném lỗi `ORA-06534: Cannot access Serially Reusable package`).
  * **D sai:** Trái với quy tắc A.
</details>

---

### Câu 9 (Question 9)
**Giả sử trên bảng `EMPLOYEES` (hiện có 107 dòng, trong đó không có nhân viên nào thuộc `department_id = 999`) có gắn 2 Trigger:
- `TRG_BEFORE_STMT`: Trigger mức câu lệnh (`BEFORE UPDATE ON employees`).
- `TRG_BEFORE_ROW`: Trigger mức dòng (`BEFORE UPDATE ON employees FOR EACH ROW`).
Khi người dùng thực thi câu lệnh: `UPDATE employees SET salary = salary * 1.1 WHERE department_id = 999;` (câu lệnh cập nhật 0 dòng), mỗi Trigger sẽ kích hoạt bao nhiêu lần?**

* A. Cả `TRG_BEFORE_STMT` và `TRG_BEFORE_ROW` đều kích hoạt `0` lần.
* B. `TRG_BEFORE_STMT` kích hoạt `1` lần, còn `TRG_BEFORE_ROW` kích hoạt `0` lần.
* C. `TRG_BEFORE_STMT` kích hoạt `0` lần, còn `TRG_BEFORE_ROW` kích hoạt `1` lần.
* D. Cả hai Trigger đều kích hoạt `1` lần.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * **Statement-level Trigger (`TRG_BEFORE_STMT`):** Luôn luôn kích hoạt **đúng 1 lần** cho mỗi câu lệnh DML hợp lệ được thực thi, **ngay cả khi câu lệnh DML đó tác động lên 0 dòng dữ liệu**!
    * **Row-level Trigger (`TRG_BEFORE_ROW` có `FOR EACH ROW`):** Kích hoạt một lần cho **mỗi dòng bị tác động**. Vì không có dòng nào có `department_id = 999`, nên Row-level Trigger kích hoạt **`0` lần**.
  * **A, C, D sai:** Đây là câu hỏi kinh điển để kiểm tra sự khác biệt giữa Statement-level và Row-level Trigger khi câu lệnh `UPDATE`/`DELETE` không khớp dòng nào.
</details>

---

### Câu 10 (Question 10)
**Giá trị của giả bản ghi `:OLD` và `:NEW` bên trong một Row-level Trigger (`FOR EACH ROW`) là gì đối với từng loại câu lệnh DML?**

* A. Trong lệnh `INSERT`, cả `:OLD` và `:NEW` đều chứa giá trị mới; trong lệnh `DELETE`, cả `:OLD` và `:NEW` đều là `NULL`.
* B. Trong lệnh `INSERT`, `:OLD` là `NULL` và `:NEW` chứa giá trị mới; trong lệnh `DELETE`, `:OLD` chứa giá trị trước khi xóa và `:NEW` là `NULL`; trong lệnh `UPDATE`, `:OLD` chứa giá trị cũ và `:NEW` chứa giá trị mới.
* C. Trong lệnh `INSERT`, truy cập `:OLD` sẽ báo lỗi biên dịch; trong lệnh `DELETE`, truy cập `:NEW` sẽ báo lỗi biên dịch.
* D. `:OLD` và `:NEW` có thể truy cập được ở cả Statement-level Trigger và Row-level Trigger.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:**
    * Với **`INSERT`**: Dòng dữ liệu chưa từng tồn tại trước đó nên mọi cột của `:OLD` đều bằng `NULL`, còn `:NEW` chứa các giá trị sắp/vừa được chèn.
    * Với **`DELETE`**: Sau khi xóa dòng không còn nữa nên mọi cột của `:NEW` đều bằng `NULL`, còn `:OLD` chứa giá trị của dòng trước khi bị xóa.
    * Với **`UPDATE`**: `:OLD` chứa giá trị trước khi sửa và `:NEW` chứa giá trị sau khi sửa.
  * **A, C sai:** Truy cập `:OLD.col` trong `INSERT` trigger hay `:NEW.col` trong `DELETE` trigger **không** báo lỗi biên dịch mà chỉ trả về giá trị `NULL`.
  * **D sai:** `:OLD` và `:NEW` chỉ tồn tại trong Row-level Trigger (`FOR EACH ROW`).
</details>

---

### Câu 11 (Question 11)
**Tại sao câu lệnh tạo Trigger dưới đây lại báo lỗi biên dịch `ORA-04084: cannot change NEW values for this trigger type`?**

```sql
CREATE OR REPLACE TRIGGER trg_upper_name
AFTER INSERT OR UPDATE ON employees
FOR EACH ROW
BEGIN
    :NEW.last_name := UPPER(:NEW.last_name);
END;
```

* A. Vì không được dùng hàm `UPPER` trong Trigger.
* B. Vì bạn không được phép thay đổi (gán giá trị mới cho) các trường của `:NEW` ở bên trong một `AFTER EACH ROW` Trigger; việc sửa đổi `:NEW` chỉ được phép thực hiện trong `BEFORE EACH ROW` Trigger.
* C. Vì thiếu mệnh đề `WHEN (NEW.last_name IS NOT NULL)`.
* D. Vì trong thân Trigger không được có dấu hai chấm `:` trước `NEW`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Tại thời điểm **`AFTER EACH ROW`**, dòng dữ liệu mới đã được ghi vào khối dữ liệu của bảng rồi! Do đó, Oracle cấm mọi hành vi gán sửa đổi `:NEW.column := ...` trong `AFTER` Trigger và báo lỗi biên dịch **`ORA-04084: cannot change NEW values for this trigger type`**. Nếu muốn chuẩn hóa dữ liệu hoặc tự động gán giá trị cột trước khi lưu vào bảng, bạn **bắt buộc phải dùng `BEFORE INSERT OR UPDATE ... FOR EACH ROW`**.
  * **A, C, D sai:** Trong thân `BEGIN ... END` của Trigger thì bắt buộc phải có dấu `:`.
</details>

---

### Câu 12 (Question 12)
**Câu lệnh tạo Trigger nào dưới đây sử dụng ĐÚNG cú pháp của mệnh đề điều kiện `WHEN` và giả bản ghi `NEW` / `OLD`?**

```sql
-- Chọn phương án có cú pháp ĐÚNG:
```

* A. `CREATE OR REPLACE TRIGGER trg_sal BEFORE UPDATE ON employees FOR EACH ROW WHEN (:NEW.salary > :OLD.salary) BEGIN :NEW.commission_pct := 0.1; END;`
* B. `CREATE OR REPLACE TRIGGER trg_sal BEFORE UPDATE ON employees FOR EACH ROW WHEN (NEW.salary > OLD.salary) BEGIN NEW.commission_pct := 0.1; END;`
* C. `CREATE OR REPLACE TRIGGER trg_sal BEFORE UPDATE ON employees FOR EACH ROW WHEN (NEW.salary > OLD.salary) BEGIN :NEW.commission_pct := 0.1; END;`
* D. `CREATE OR REPLACE TRIGGER trg_sal BEFORE UPDATE ON employees WHEN (NEW.salary > OLD.salary) BEGIN NULL; END;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Quy tắc cú pháp của `NEW` và `OLD` trong Trigger cực kỳ rõ ràng:
    1. Bên trong biểu thức điều kiện của mệnh đề **`WHEN (...)`** (nằm ở phần Header, ngoài khối PL/SQL): **TUYỆT ĐỐI KHÔNG CÓ dấu hai chấm `:`** (`WHEN (NEW.salary > OLD.salary)`).
    2. Bên trong khối lệnh PL/SQL (`DECLARE ... BEGIN ... END`): **BẮT BUỘC PHẢI CÓ dấu hai chấm `:`** (`:NEW.commission_pct := 0.1;`).
  * **A sai:** Dùng `:NEW` và `:OLD` có dấu `:` trong mệnh đề `WHEN` sẽ gây lỗi `ORA-04076: invalid NEW or OLD specification`.
  * **B sai:** Thiếu dấu `:` trước `NEW.commission_pct` trong phần `BEGIN`.
  * **D sai:** Mệnh đề `WHEN (...)` chỉ được phép dùng cho Row-level Trigger (thiếu `FOR EACH ROW` sẽ gây lỗi `ORA-04077: WHEN clause cannot be used with table level triggers`).
</details>

---

### Câu 13 (Question 13)
**Trong một DML Trigger được định nghĩa là `BEFORE INSERT OR UPDATE OR DELETE ON employees`, bạn có thể sử dụng những vị từ điều kiện (Conditional Predicates) nào dưới đây để kiểm tra loại câu lệnh DML đang kích hoạt Trigger? (Chọn 2 đáp án đúng)**

* A. `IF INSERTING THEN ... ELSIF UPDATING('SALARY') THEN ... ELSIF DELETING THEN ...`
* B. `IF IS_INSERT THEN ... ELSIF IS_UPDATE('SALARY') THEN ...`
* C. `IF UPDATING THEN ...` (kiểm tra câu lệnh `UPDATE` trên bất kỳ cột nào của bảng).
* D. `IF SQL%INSERTING THEN ...`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C**
* **Giải thích chuyên sâu:**
  * **A và C đúng:** PL/SQL cung cấp sẵn 3 vị từ kiểu `BOOLEAN` dùng trong thân DML Trigger là:
    * **`INSERTING`**: `TRUE` khi câu lệnh là `INSERT`.
    * **`DELETING`**: `TRUE` khi câu lệnh là `DELETE`.
    * **`UPDATING`** (không tham số): `TRUE` khi câu lệnh là `UPDATE` bất kỳ cột nào; hoặc **`UPDATING('COLUMN_NAME')`**: `TRUE` khi câu lệnh `UPDATE` có cập nhật cột `'COLUMN_NAME'`.
  * **B, D sai:** Không có từ khóa `IS_INSERT` hay `SQL%INSERTING`.
</details>

---

### Câu 14 (Question 14)
**Những phát biểu nào sau đây là ĐÚNG về `INSTEAD OF` Trigger trong Oracle Database? (Chọn 2 đáp án đúng)**

* A. `INSTEAD OF` Trigger chỉ có thể được tạo trên khung nhìn (`VIEW`), tuyệt đối không thể tạo trên bảng vật lý (`TABLE`).
* B. Bạn có thể tạo `INSTEAD OF` Trigger ở mức câu lệnh (Statement-level) hoặc mức dòng (Row-level) tùy ý.
* C. Mọi `INSTEAD OF` Trigger luôn luôn hoạt động ở mức dòng (Row-level Trigger), ngay cả khi bạn lược bỏ không viết mệnh đề `FOR EACH ROW` trong câu lệnh `CREATE TRIGGER`.
* D. Bạn có thể dùng mệnh đề `WHEN (NEW.id > 0)` trên một `INSTEAD OF` Trigger để lọc các dòng cần xử lý.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C**
* **Giải thích chuyên sâu:**
  * **A đúng:** `INSTEAD OF` Trigger được thiết kế chuyên biệt để cho phép thực hiện các thao tác DML thông qua các Complex View (vốn không thể sửa trực tiếp). Nếu cố tạo `INSTEAD OF` Trigger trên một `TABLE`, Oracle sẽ báo lỗi **`ORA-25002: cannot create INSTEAD OF triggers on tables`**.
  * **C đúng:** `INSTEAD OF` Trigger **luôn luôn là Row-level Trigger**. Dù bạn có viết `FOR EACH ROW` hay không viết, Oracle vẫn tự động coi nó là Row-level Trigger và cho phép truy cập `:OLD` / `:NEW`.
  * **B sai:** Không tồn tại Statement-level `INSTEAD OF` Trigger.
  * **D sai:** `INSTEAD OF` Trigger **không hỗ trợ** mệnh đề điều kiện `WHEN (...)`.
</details>

---

### Câu 15 (Question 15)
**Xem xét Trigger `trg_check_sal` được tạo trên bảng `EMPLOYEES` như dưới đây. Điều gì sẽ xảy ra khi người dùng thực thi câu lệnh: `UPDATE employees SET salary = salary * 1.1 WHERE department_id = 30;` (giả sử phòng ban 30 có 6 nhân viên)?**

```sql
CREATE OR REPLACE TRIGGER trg_check_sal
AFTER UPDATE OF salary ON employees
FOR EACH ROW
DECLARE
    v_min_sal NUMBER;
BEGIN
    SELECT MIN(salary) INTO v_min_sal
    FROM employees
    WHERE department_id = :NEW.department_id;

    IF :NEW.salary > v_min_sal * 5 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Lương quá cao so với lương thấp nhất phòng!');
    END IF;
END;
```

* A. Câu lệnh `UPDATE` thực thi thành công cho cả 6 nhân viên nếu không ai vi phạm điều kiện.
* B. Trigger báo lỗi biên dịch ngay khi chạy lệnh `CREATE TRIGGER` vì không được viết câu lệnh `SELECT` bên trong Trigger.
* C. Trigger biên dịch thành công, nhưng khi chạy câu lệnh `UPDATE` sẽ thất bại ngay lập tức với lỗi Runtime `ORA-04091: table HR.EMPLOYEES is mutating, trigger/function may not see it`.
* D. Trigger ném ra lỗi `ORA-04092: cannot COMMIT in a trigger`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là trường hợp kinh điển nhất gây ra lỗi **Mutating Table (`ORA-04091`)**:
    * Trigger `trg_check_sal` là một **Row-level Trigger (`FOR EACH ROW`)** gắn trên bảng `EMPLOYEES`.
    * Khi câu lệnh `UPDATE employees ...` đang thực thi dở dang từng dòng, bảng `EMPLOYEES` đang ở trạng thái biến đổi (Mutating).
    * Việc thân của Row-level Trigger thực hiện câu lệnh **`SELECT MIN(salary) ... FROM employees`** (đọc chính bảng đang bị `UPDATE`) sẽ bị Oracle chặn lại lúc Runtime bằng lỗi **`ORA-04091: table HR.EMPLOYEES is mutating, trigger/function may not see it`**.
  * **A, B, D sai:** Lúc `CREATE TRIGGER`, trình biên dịch không cấm viết `SELECT`, lỗi chỉ nổ ra lúc Runtime khi bảng thực sự bị DML tác động.
</details>

---

### Câu 16 (Question 16)
**Cũng với Trigger `trg_check_sal` (nếu đổi thành `AFTER INSERT OR UPDATE ON employees FOR EACH ROW` và bên trong có `SELECT COUNT(*) FROM employees;`), câu lệnh DML nào dưới đây chạy trên bảng `EMPLOYEES` sẽ KHÔNG gây ra lỗi `ORA-04091: table is mutating`?**

* A. `UPDATE employees SET salary = 5000 WHERE employee_id = 100;`
* B. `INSERT INTO employees (employee_id, last_name, email, hire_date, job_id, salary) VALUES (999, 'Smith', 'JSMITH', SYSDATE, 'IT_PROG', 5000);` (Lệnh `INSERT ... VALUES` chèn 1 dòng đơn lẻ).
* C. `INSERT INTO employees SELECT * FROM temp_employees;` (Lệnh `INSERT ... SELECT` chèn từ bảng khác).
* D. `DELETE FROM employees WHERE employee_id = 100;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Đây là một ngoại lệ đặc biệt trong kiến trúc Oracle mà đề thi OCP rất hay hỏi:
    * Nếu câu lệnh kích hoạt Row-level Trigger là một câu lệnh **`INSERT INTO table VALUES (...)` đơn dòng (Single-row INSERT VALUES)**, Oracle biết chắc chắn chỉ có đúng 1 dòng mới đang được thêm vào nên bảng không rơi vào trạng thái bất nhất giữa các dòng. Do đó, Row-level Trigger được phép `SELECT` chính bảng đó mà **KHÔNG bị lỗi `ORA-04091`**!
    * Ngược lại, mọi câu lệnh `UPDATE` (dù chỉ sửa 1 dòng), `DELETE` (dù chỉ xóa 1 dòng), hoặc `INSERT INTO ... SELECT ...` (kể cả khi `SELECT` chỉ trả về 1 dòng) đều sẽ kích hoạt lỗi **`ORA-04091`**!
  * **A, C, D sai:** Đều gây lỗi `ORA-04091: table is mutating`.
</details>

---

### Câu 17 (Question 17)
**Cách thiết kế nào dưới đây là giải pháp chuẩn mực và triệt để nhất trong Oracle (từ 11g trở lên) để giải quyết lỗi `ORA-04091: table is mutating` khi cần kiểm tra dữ liệu vừa sửa (`:NEW`) so với dữ liệu tổng hợp trên toàn bảng?**

* A. Thêm lệnh `COMMIT;` vào đầu Row-level Trigger trước khi chạy câu lệnh `SELECT`.
* B. Sử dụng một **`COMPOUND TRIGGER`**: lưu tạm thông tin từ `:NEW` vào một biến Collection ở phần `AFTER EACH ROW`, sau đó thực hiện câu lệnh `SELECT` kiểm tra trên bảng ở phần `AFTER STATEMENT`.
* C. Đặt `PRAGMA SERIALLY_REUSABLE;` vào trong Trigger.
* D. Đổi Trigger từ `AFTER EACH ROW` sang `BEFORE EACH ROW`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Tại phần `AFTER EACH ROW` của `COMPOUND TRIGGER`, bạn có quyền đọc `:NEW` và `:OLD` để lưu vào một mảng Collection khai báo chung ở đầu Compound Trigger (mà không thực hiện `SELECT` bảng). Sau khi tất cả các dòng đã được cập nhật xong, phần **`AFTER STATEMENT`** sẽ chạy 1 lần: tại thời điểm này bảng đã hết trạng thái Mutating, bạn có thể duyệt Collection và chạy câu lệnh `SELECT` trên bảng an toàn tuyệt đối!
  * **A sai:** Dùng `COMMIT` trong Trigger bị cấm (`ORA-04092`). (Và nếu dùng `PRAGMA AUTONOMOUS_TRANSACTION` trong Trigger để né `ORA-04091`, câu lệnh `SELECT` trong giao dịch độc lập sẽ **không nhìn thấy** dữ liệu vừa sửa chưa commit của giao dịch chính, dẫn đến sai lệch logic nghiêm trọng!).
  * **C, D sai:** Cả `BEFORE EACH ROW` và `AFTER EACH ROW` đều bị lỗi `ORA-04091` như nhau.
</details>

---

### Câu 18 (Question 18)
**Trong một `COMPOUND TRIGGER`, bốn phần thời điểm (Timing-point sections) có thể được khai báo bên trong thân Trigger bao gồm những phần nào?**

* A. `BEFORE STATEMENT`, `BEFORE EACH ROW`, `AFTER EACH ROW`, `AFTER STATEMENT`
* B. `INIT STATEMENT`, `FOR EACH ROW`, `INSTEAD OF ROW`, `FINAL STATEMENT`
* C. `START TRIGGER`, `BEFORE ROW`, `AFTER ROW`, `END TRIGGER`
* D. `DECLARE`, `BEGIN`, `EXCEPTION`, `END`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A đúng:** Một `COMPOUND TRIGGER` trên bảng hỗ trợ tối đa 4 phần thời điểm thực thi (bạn chỉ cần viết những phần nào thực sự sử dụng, không bắt buộc phải viết đủ cả 4):
    1. `BEFORE STATEMENT IS ... END BEFORE STATEMENT;`
    2. `BEFORE EACH ROW IS ... END BEFORE EACH ROW;`
    3. `AFTER EACH ROW IS ... END AFTER EACH ROW;`
    4. `AFTER STATEMENT IS ... END AFTER STATEMENT;`
  * **B, C, D sai:** Đối với `COMPOUND TRIGGER` tạo trên View, nó chỉ có phần `INSTEAD OF EACH ROW IS ... END INSTEAD OF EACH ROW;`.
</details>

---

### Câu 19 (Question 19)
**Nếu trên cùng một bảng `EMPLOYEES` có tạo nhiều Trigger cùng loại (ví dụ: hai Trigger `TRG_A` và `TRG_B` cùng là `BEFORE INSERT ON employees FOR EACH ROW`), làm thế nào để bạn đảm bảo `TRG_B` luôn luôn được kích hoạt SAU `TRG_A`?**

* A. Oracle luôn chạy các Trigger theo thứ tự bảng chữ cái tên Trigger nên `TRG_A` mặc định luôn chạy trước `TRG_B`.
* B. Sử dụng mệnh đề **`FOLLOWS trg_a`** trong câu lệnh `CREATE OR REPLACE TRIGGER trg_b` (hoặc dùng mệnh đề `PRECEDES trg_b` trong `trg_a`).
* C. Không có cách nào kiểm soát thứ tự chạy của các Trigger cùng thời điểm trong Oracle.
* D. Sử dụng mệnh đề `ORDER BY 2` trong câu lệnh `CREATE TRIGGER`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Mặc định, nếu trên một bảng có nhiều Trigger ở cùng một thời điểm (cùng là `BEFORE EACH ROW`), Oracle **không đảm bảo** thứ tự kích hoạt giữa chúng. Tuy nhiên, từ Oracle 11g trở đi, bạn có thể chỉ định rõ thứ tự thực thi bằng mệnh đề **`FOLLOWS <trigger_name>`** (chạy sau Trigger kia) hoặc **`PRECEDES <trigger_name>`** (chạy trước Trigger kia).
  * **A, C, D sai:** Không bao giờ được giả định Trigger chạy theo thứ tự ABC hay thứ tự thời gian tạo nếu không có từ khóa `FOLLOWS` / `PRECEDES`.
</details>

---

### Câu 20 (Question 20)
**Điều gì sẽ xảy ra khi một Trigger đang thực thi và gặp một ngoại lệ không được xử lý (Unhandled Exception) hoặc gọi `RAISE_APPLICATION_ERROR`?**

* A. Chỉ có thân của Trigger dừng lại, còn câu lệnh DML (`INSERT`/`UPDATE`/`DELETE`) kích hoạt Trigger đó vẫn thành công bình thường.
* B. Toàn bộ giao dịch (Transaction) từ đầu phiên làm việc bị `ROLLBACK` hoàn toàn.
* C. Câu lệnh DML kích hoạt Trigger đó (cùng mọi thay đổi dữ liệu do chính Trigger đó thực hiện) sẽ bị **Statement-level Rollback** (hủy bỏ hoàn toàn tác dụng của câu lệnh DML đó), nhưng các câu lệnh DML đã chạy thành công trước đó trong cùng Transaction vẫn được giữ nguyên.
* D. Trigger tự động bị chuyển sang trạng thái `DISABLED`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:** Trigger và câu lệnh DML kích hoạt nó thuộc cùng một đơn vị nguyên tử cấp câu lệnh (**Statement-level Atomicity**). Khi một ngoại lệ văng ra khỏi Trigger mà không được bắt (ví dụ khi bạn dùng `RAISE_APPLICATION_ERROR` để chặn một thao tác `UPDATE` trái phép), Oracle sẽ tự động **Rollback toàn bộ câu lệnh DML đó** cùng mọi thay đổi phát sinh trong Trigger, trả bảng về trạng thái ngay trước khi câu lệnh DML đó bắt đầu. Các lệnh DML của những câu lệnh trước đó trong cùng Session vẫn còn nguyên.
  * **A, B, D sai:** Ngược lại, nếu ngoại lệ được bắt trọn vẹn (`WHEN ... THEN NULL;`) ở bên trong Trigger và không được ném lại, câu lệnh DML sẽ thành công bình thường!
</details>

---

### Câu 21 (Question 21)
**Trong một `PACKAGE BODY`, nếu Thủ tục riêng tư `priv_proc_A` (không có trong `PACKAGE SPECIFICATION`) được định nghĩa ở đầu `PACKAGE BODY` và bên trong nó cần gọi một Thủ tục công khai `pub_proc_B` được định nghĩa ở cuối `PACKAGE BODY`, thì bạn có bắt buộc phải viết Forward Declaration cho `pub_proc_B` ở đầu `PACKAGE BODY` hay không?**

* A. Bắt buộc phải viết Forward Declaration cho `pub_proc_B` ở đầu `PACKAGE BODY`, nếu không sẽ bị lỗi biên dịch.
* B. Không cần viết Forward Declaration cho `pub_proc_B` vì chữ ký của `pub_proc_B` đã được khai báo công khai trong `PACKAGE SPECIFICATION` rồi (chỉ những Private Subprogram chưa có trong Spec mới cần đặt lên trước hoặc dùng Forward Declaration).
* C. Một Private Procedure không được phép gọi một Public Procedure trong cùng Package.
* D. Bắt buộc phải đưa tất cả Public Procedures lên đầu `PACKAGE BODY`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Mọi chương trình con đã được khai báo trong **`PACKAGE SPECIFICATION`** thì bản thân khai báo đó đã đóng vai trò là một **Forward Declaration** toàn cục cho toàn bộ `PACKAGE BODY`! Do đó, bất kỳ hàm/thủ tục nào trong `PACKAGE BODY` (dù đứng trên hay đứng dưới `pub_proc_B`) đều có thể gọi trực tiếp `pub_proc_B` mà không cần khai báo lại.
  * **A, C, D sai:** Bạn chỉ cần đặt lên trên (hoặc viết Forward Declaration) đối với các **Private Subprograms** (những hàm/thủ tục chỉ tồn tại trong `PACKAGE BODY` mà không có mặt trong `PACKAGE SPECIFICATION`).
</details>

---

### Câu 22 (Question 22)
**Lập trình viên muốn ghi lịch sử kiểm toán (Audit Log) vào bảng `AUDIT_LOGS` mỗi khi có người dùng cố tình thực hiện lệnh `UPDATE` lương trên bảng `EMPLOYEES`, sao cho ngay cả khi câu lệnh `UPDATE` đó bị chặn lại bởi lỗi hoặc người dùng sau đó thực hiện `ROLLBACK`, bản ghi kiểm toán trong bảng `AUDIT_LOGS` VẪN PHẢI ĐƯỢC LƯU LẠI. Giải pháp kỹ thuật đúng đắn nhất là gì?**

* A. Viết lệnh `INSERT INTO audit_logs ...; COMMIT;` trực tiếp bên trong thân của Trigger `BEFORE UPDATE ON employees`.
* B. Tạo một thủ tục ghi log có khai báo chỉ thị `PRAGMA AUTONOMOUS_TRANSACTION;` (bên trong có `INSERT INTO audit_logs` và `COMMIT;`), sau đó gọi thủ tục này từ bên trong Trigger (hoặc khai báo trực tiếp `PRAGMA AUTONOMOUS_TRANSACTION;` trong Trigger).
* C. Sử dụng `AFTER UPDATE` Trigger thay vì `BEFORE UPDATE` Trigger.
* D. Sử dụng mệnh đề `KEEP LOGS ON ROLLBACK` khi tạo Trigger.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Mặc định, Trigger chạy trong cùng giao dịch (Transaction) với câu lệnh DML kích hoạt nó:
    1. Không được phép gọi `COMMIT` trong Trigger thường (`ORA-04092`).
    2. Nếu câu lệnh DML bị lỗi hoặc người dùng gọi `ROLLBACK`, mọi lệnh `INSERT` mà Trigger đã thực hiện cũng sẽ bị `ROLLBACK` theo!
    * Khi sử dụng **`PRAGMA AUTONOMOUS_TRANSACTION;`**, Trigger (hoặc thủ tục ghi log mà nó gọi) sẽ mở một **giao dịch con hoàn toàn độc lập**, cho phép thực hiện `INSERT` vào `audit_logs` và **`COMMIT;`** hợp lệ mà không ảnh hưởng (và không bị hủy) bởi lệnh `ROLLBACK` của giao dịch chính!
  * **A, C, D sai:** Viết `COMMIT` trực tiếp trong Trigger không có `AUTONOMOUS_TRANSACTION` sẽ gây lỗi `ORA-04092`.
</details>

---

### Câu 23 (Question 23)
**Khi nào một phiên làm việc (Session 1) đang chạy ứng dụng sẽ gặp lỗi Runtime `ORA-04068: existing state of packages has been discarded`?**

* A. Khi Session 1 gọi một Bodiless Package.
* B. Khi Session 1 đã khởi tạo trạng thái của một Stateful Package (Package có chứa biến hoặc hằng số toàn cục), sau đó Session 2 biên dịch lại (`CREATE OR REPLACE`) Package đó, và tiếp theo Session 1 gọi lại Package đó.
* C. Khi Session 1 thực hiện lệnh `ROLLBACK` sau khi gọi Package.
* D. Khi một Package không có biến toàn cục nào (Stateless Package) được gọi đồng thời bởi hai Session.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Một Package được coi là **Stateful (Có trạng thái)** nếu trong Spec hoặc Body của nó có khai báo ít nhất một biến toàn cục, hằng số, hoặc con trỏ cấp gói.
    * Khi Session 1 gọi Package, vùng nhớ trạng thái của Package được tạo trong UGA của Session 1.
    * Nếu một Session khác biên dịch lại Package (Spec hoặc Body), dấu thời gian/chữ ký của Package thay đổi khiến vùng trạng thái cũ trong UGA của Session 1 trở nên mất hiệu lực.
    * Ở lần gọi kế tiếp của Session 1, Oracle bắt buộc phải cảnh báo rằng dữ liệu biến toàn cục của Session 1 đã bị mất bằng cách ném lỗi **`ORA-04068: existing state of packages has been discarded`**!
  * **A, C, D sai:** Nếu Package hoàn toàn không có biến/hằng toàn cục nào (Stateless Package), việc biên dịch lại `PACKAGE BODY` sẽ được áp dụng êm thấm mà không gây lỗi `ORA-04068`!
</details>

---

### Câu 24 (Question 24)
**Nếu một `CONSTRUCTOR` hoặc biểu thức khởi tạo của một biến toàn cục trong `PACKAGE SPECIFICATION` hoặc câu lệnh trong `PACKAGE INITIALIZATION BLOCK` bị văng ngoại lệ không được xử lý (Unhandled Exception) ở lần gọi đầu tiên của Session, chuyện gì sẽ xảy ra ở lần gọi thứ hai tới Package đó trong cùng Session?**

* A. Package bị khóa vĩnh viễn và không thể gọi lại cho đến khi khởi động lại Database.
* B. Ở lần gọi thứ hai, Oracle coi như Package chưa được khởi tạo thành công nên sẽ thực hiện chạy lại quá trình khởi tạo biến toàn cục và Khối khởi tạo Package từ đầu.
* C. Ở lần gọi thứ hai, Oracle bỏ qua Khối khởi tạo và chạy thẳng vào hàm được gọi với các biến bằng `NULL`.
* D. Package tự động bị đánh dấu `INVALID` trong `USER_OBJECTS`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Giải thích chuyên sâu:**
  * **B đúng:** Một Package chỉ được đánh dấu là *"Đã khởi tạo trong Session hiện tại"* sau khi toàn bộ các biến cấp gói và **Khối khởi tạo (`BEGIN ... END` ở cuối Body) hoàn tất thành công mà không bị Unhandled Exception**. Nếu ở lần gọi đầu tiên, Khối khởi tạo bị văng ngoại lệ giữa chừng, quá trình khởi tạo bị hủy bỏ. Do đó, ở lần gọi tiếp theo trong cùng Session, Oracle sẽ **chạy lại Khối khởi tạo từ đầu**!
  * **A, C, D sai:** Lỗi Runtime trong Khối khởi tạo không làm đối tượng Package bị `INVALID` trong Data Dictionary.
</details>

---

### Câu 25 (Question 25)
**Cú pháp nào dưới đây dùng để TẮT (vô hiệu hóa tạm thời) tất cả các Trigger đang gắn trên bảng `EMPLOYEES` chỉ bằng một câu lệnh SQL duy nhất?**

* A. `DROP ALL TRIGGERS ON employees;`
* B. `ALTER TRIGGER ALL ON employees DISABLE;`
* C. `ALTER TABLE employees DISABLE ALL TRIGGERS;`
* D. `DISABLE TRIGGERS FROM employees;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * **C đúng:**
    * Để bật/tắt **một Trigger đơn lẻ**: Dùng lệnh `ALTER TRIGGER trigger_name DISABLE;` (hoặc `ENABLE`).
    * Để bật/tắt **tất cả các Trigger trên một bảng** cùng lúc: Dùng lệnh `ALTER TABLE table_name DISABLE ALL TRIGGERS;` (và `ALTER TABLE table_name ENABLE ALL TRIGGERS;`).
  * **A, B, D sai:** Đều là các cú pháp không tồn tại trong Oracle SQL.
</details>

---
