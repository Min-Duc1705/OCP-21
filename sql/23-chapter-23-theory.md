# Chương 23: Procedure và Function (Subprograms, Tham Số, SQL Call Rules & AUTHID) - OCP PL/SQL (1Z0-149)

> **Tài liệu tham chiếu:** *OCA/OCP Oracle Database 12c/19c/21c Program with PL/SQL Exam Guide (Exam 1Z0-149)* & *Oracle Database PL/SQL Language Reference*.  
> **Mục tiêu khảo thí:** Phân biệt Anonymous Block và Stored Subprograms (`PROCEDURE` / `FUNCTION`); Nắm vững cơ chế truyền tham số `IN`, `OUT`, `IN OUT` (Pass-by-Reference vs Pass-by-Value) và tối ưu hóa `NOCOPY`; Thành thạo Positional, Named (`=>`), và Mixed Notation; Hiểu sâu Local Subprograms & Forward Declaration; Áp dụng các quy tắc gọi PL/SQL Function trong SQL (`ORA-14551`, `DETERMINISTIC`, `RESULT_CACHE`, `PRAGMA UDF`); Quản lý quyền thực thi với `AUTHID DEFINER` và `AUTHID CURRENT_USER`.

---

## 📑 Mục Lục Chi Tiết

1. [Tổng Quan Về Subprograms: Anonymous Block vs Stored Procedure/Function](#1-tổng-quan-về-subprograms-anonymous-block-vs-stored-procedurefunction)
2. [Cú Pháp Khởi Tạo `PROCEDURE` & `FUNCTION` Chuẩn OCP](#2-cú-pháp-khởi-tạo-procedure--function-chuẩn-ocp)
3. [Chế Độ Tham Số (`IN`, `OUT`, `IN OUT`) & Cơ Chế `NOCOPY`](#3-chế-độ-tham-số-in-out-in-out--cơ-chế-nocopy)
4. [Các Ký Pháp Truyền Đối Số Khi Gọi Subprogram (Positional, Named, Mixed)](#4-các-ký-pháp-truyền-đối-số-khi-gọi-subprogram-positional-named-mixed)
5. [Câu Lệnh `RETURN` Trong Procedure vs Function](#5-câu-lệnh-return-trong-procedure-vs-function)
6. [Local Subprograms (Chương Trình Con Cục Bộ) & Forward Declaration](#6-local-subprograms-chương-trình-con-cục-bộ--forward-declaration)
7. [Quy Tắc Gọi PL/SQL Function Trong Câu Lệnh SQL & Tối Ưu Hóa](#7-quy-tắc-gọi-plsql-function-trong-câu-lệnh-sql--tối-ưu-hóa)
8. [Mô Hình Quyền Thực Thi: `AUTHID DEFINER` vs `AUTHID CURRENT_USER`](#8-mô-hình-quyền-thực-thi-authid-definer-vs-authid-current_user)
9. [Bài Tập Thực Hành Tự Luyện (Kèm Lời Giải Chi Tiết)](#9-bài-tập-thực-hành-tự-luyện-kèm-lời-giải-chi-tiết)
10. [Tổng Hợp Bẫy Thi OCP Cốt Lõi Cần Nhớ (Exam Essentials)](#10-tổng-hợp-bẫy-thi-ocp-cốt-lõi-cần-nhớ-exam-essentials)

---

## 1. Tổng Quan Về Subprograms: Anonymous Block vs Stored Procedure/Function

Trong PL/SQL, các khối mã được chia thành hai nhóm lớn: **Anonymous Blocks** (Khối vô danh) và **Named Subprograms** (Chương trình con có tên — bao gồm `PROCEDURE` và `FUNCTION`).

### Bảng so sánh Anonymous Block và Stored Subprogram

| Tiêu chí | Anonymous Block (`DECLARE ... BEGIN ... END;`) | Stored Subprogram (`PROCEDURE` / `FUNCTION`) |
| :--- | :--- | :--- |
| **Tên định danh** | Không có tên. | Có tên định danh duy nhất trong Schema (hoặc nạp chồng trong Package). |
| **Thời điểm biên dịch** | Biên dịch lại **mỗi lần** được gửi lên thực thi. | Biên dịch **1 lần** khi tạo (`CREATE`) và lưu mã máy P-code trong Data Dictionary. |
| **Lưu trữ trong DB** | Không lưu trong Database. | Lưu trữ lâu dài như một Schema Object (xem trong `USER_OBJECTS`, `USER_SOURCE`). |
| **Tham số đầu vào/ra** | Không hỗ trợ danh sách tham số (chỉ dùng Bind Variable của môi trường). | Hỗ trợ đầy đủ tham số `IN`, `OUT`, `IN OUT`. |
| **Gọi từ ứng dụng khác** | Không thể gọi theo tên từ chương trình khác. | Gọi trực tiếp từ PL/SQL khác, SQL (với Function), Java, .NET, Trigger. |

### Phân biệt `PROCEDURE` và `FUNCTION`

| Tiêu chí | `PROCEDURE` (Thủ tục) | `FUNCTION` (Hàm) |
| :--- | :--- | :--- |
| **Mục đích thiết kế chính** | Thực thi một chuỗi hành động / nghiệp vụ (có thể trả về 0, 1 hoặc nhiều giá trị qua tham số `OUT`/`IN OUT`). | Tính toán và **bắt buộc trả về đúng 1 giá trị** thông qua mệnh đề `RETURN`. |
| **Mệnh đề `RETURN datatype` ở Header** | ❌ **Cấm** có mệnh đề `RETURN datatype` ở phần Header. | ✅ **Bắt buộc** có `RETURN datatype` ở phần Header. |
| **Lệnh `RETURN` ở phần Body** | Không bắt buộc. Nếu dùng, chỉ viết `RETURN;` (không kèm biểu thức) để thoát sớm. | **Bắt buộc** có ít nhất 1 lệnh `RETURN biểu_thức;` trả về giá trị khớp kiểu ở Header. |
| **Cách thức lời gọi** | Gọi như một câu lệnh PL/SQL độc lập (`sp_calc_tax(100);`). | Phải gọi như một phần của **biểu thức** (`v_tax := fn_tax(100);` hoặc trong lệnh `SELECT`). |
| **Gọi bên trong câu lệnh SQL** | ❌ Không thể gọi Procedure trong câu lệnh `SELECT`/`WHERE`. | ✅ Có thể gọi trực tiếp trong `SELECT`, `WHERE`, `ORDER BY` (nếu tuân thủ quy tắc SQL). |

---

## 2. Cú Pháp Khởi Tạo `PROCEDURE` & `FUNCTION` Chuẩn OCP

### 2.1. Cú pháp `CREATE [OR REPLACE] PROCEDURE`

```sql
CREATE [OR REPLACE] PROCEDURE procedure_name
    [(param1 [IN | OUT | IN OUT] [NOCOPY] datatype [{:= | DEFAULT} expr],
      param2 [IN | OUT | IN OUT] [NOCOPY] datatype ...)]
    [AUTHID {DEFINER | CURRENT_USER}]
{IS | AS}
    -- Phần khai báo biến cục bộ, hằng số, cursor, kiểu dữ liệu, subprogram cục bộ
    -- (LƯU Ý: KHÔNG viết từ khóa DECLARE ở đây!)
BEGIN
    -- Phần câu lệnh thực thi (Executable statements)
[EXCEPTION
    -- Phần xử lý ngoại lệ]
END [procedure_name];
/
```

### 2.2. Cú pháp `CREATE [OR REPLACE] FUNCTION`

```sql
CREATE [OR REPLACE] FUNCTION function_name
    [(param1 [IN | OUT | IN OUT] [NOCOPY] datatype [{:= | DEFAULT} expr], ...)]
    RETURN return_datatype
    [AUTHID {DEFINER | CURRENT_USER}]
    [DETERMINISTIC]
    [PARALLEL_ENABLE]
    [RESULT_CACHE [RELIES_ON (table_name, ...)]]
{IS | AS}
    -- Phần khai báo cục bộ (KHÔNG có từ khóa DECLARE!)
BEGIN
    -- Phần thực thi
    RETURN expression;
[EXCEPTION
    WHEN ... THEN
        RETURN fallback_expression;]
END [function_name];
/
```

> [!WARNING]
> **3 Bẫy Cú Pháp Biên Dịch Cực Phổ Biến Trong Đề Thi OCP:**
> 1. **Viết từ khóa `DECLARE` sau `IS` / `AS`:** Trong Procedure và Function, từ khóa `IS` hoặc `AS` đã đóng vai trò mở đầu vùng khai báo. Nếu viết thêm `DECLARE` sau `IS`/`AS`, trình biên dịch sẽ báo lỗi **`PLS-00103: Encountered the symbol "DECLARE"`**! (Trừ khi bạn mở một khối vô danh lồng bên trong phần `BEGIN ... END`).
> 2. **Khai báo độ dài/kích thước cho kiểu dữ liệu của Tham số hoặc kiểu `RETURN`:**
>    * ❌ **SAI (Lỗi biên dịch `PLS-00103`):**
>      `CREATE FUNCTION fn_name (p_id NUMBER(6), p_name VARCHAR2(50)) RETURN VARCHAR2(100) IS ...`
>    * ✅ **ĐÚNG:** Chỉ viết tên kiểu dữ liệu không kèm kích thước (`NUMBER`, `VARCHAR2`, `DATE`) hoặc dùng kiểu neo có kích thước gián tiếp thông qua `%TYPE` / `SUBTYPE` (ví dụ: `p_name employees.first_name%TYPE`).
> 3. **Dùng dấu ngoặc đơn rỗng `()` khi không có tham số:**
>    * Trong PL/SQL, nếu Procedure/Function không có tham số nào, khi **khai báo (`CREATE`)** bạn **KHÔNG ĐƯỢC viết cặp dấu ngoặc rỗng `()`** (ví dụ: `CREATE PROCEDURE p_test() IS` -> ❌ **Lỗi biên dịch**!). Phải viết: `CREATE PROCEDURE p_test IS`.
>    * Tuy nhiên, khi **gọi thực thi** một Procedure/Function không có tham số, bạn có thể viết `p_test;` hoặc `p_test();` đều hợp lệ!

---

## 3. Chế Độ Tham Số (`IN`, `OUT`, `IN OUT`) & Cơ Chế `NOCOPY`

 Trước tiên cần phân biệt hai khái niệm:
* **Formal Parameter (Tham số hình thức):** Biến được khai báo trong phần Header của Subprogram (`p_emp_id`, `p_sal`).
* **Actual Parameter / Argument (Đối số thực tế):** Giá trị hoặc biến được truyền vào tại nơi gọi Subprogram (`100`, `v_current_sal`).

### 3.1. Bảng So Sánh Chuyên Sâu 3 Chế Độ Tham Số (`IN`, `OUT`, `IN OUT`)

| Đặc điểm kỹ thuật | Chế độ `IN` (Mặc định) | Chế độ `OUT` | Chế độ `IN OUT` |
| :--- | :--- | :--- | :--- |
| **Hướng truyền dữ liệu** | Từ môi trường gọi **vào** Subprogram. | Từ Subprogram trả **ra** môi trường gọi. | Truyền giá trị **vào**, xử lý rồi trả giá trị mới **ra**. |
| **Cơ chế truyền mặc định** | **Pass by Reference** (Truyền địa chỉ vùng nhớ - cực nhanh, không tốn bộ nhớ copy). | **Pass by Value** (Copy giá trị từ biến tạm ra đối số khi Subprogram kết thúc thành công). | **Pass by Value** (Copy giá trị từ đối số vào biến tạm khi gọi, và copy ngược ra khi kết thúc). |
| **Quyền đọc/ghi trong Subprogram** | **Read-Only (Chỉ đọc, giống hằng số `CONSTANT`)**. Không thể xuất hiện ở vế trái phép gán `:=` hay `INTO`. | Đọc và Ghi. **Lưu ý:** Khi mới bước vào Subprogram, tham số `OUT` luôn bị khởi tạo về **`NULL`** (bỏ qua mọi giá trị ban đầu của đối số!). | Đọc và Ghi. Giữ nguyên giá trị ban đầu của đối số truyền vào. |
| **Đối số thực tế (Actual Parameter) khi gọi** | Có thể là **Hằng số (Literal), Biểu thức, hoặc Biến** đã khởi tạo. | **BẮT BUỘC phải là một Biến (Variable)** có thể gán giá trị! (Truyền hằng số/biểu thức sẽ lỗi biên dịch `PLS-00363`). | **BẮT BUỘC phải là một Biến (Variable)**! |
| **Hỗ trợ giá trị mặc định (`DEFAULT` / `:=`)** | ✅ **Có hỗ trợ.** | ❌ **CẤM** khai báo giá trị mặc định (lỗi `PLS-00230`). | ❌ **CẤM** khai báo giá trị mặc định (lỗi `PLS-00230`). |
| **Hỗ trợ gợi ý `NOCOPY`** | ❌ **Không áp dụng** (vì `IN` bản chất đã luôn là Pass by Reference!). Viết `IN NOCOPY` sẽ lỗi biên dịch! | ✅ Hỗ trợ `OUT NOCOPY`. | ✅ Hỗ trợ `IN OUT NOCOPY`. |

### 3.2. Hành vi của `OUT` / `IN OUT` khi xảy ra Ngoại lệ (Exception) & Bẫy `NOCOPY`

Đây là một trong những câu hỏi phân loại thí sinh xuất sắc nhất trong đề thi **OCP 1Z0-149**:

#### A. Hành vi mặc định (Không có `NOCOPY` — Pass by Value)
1. Khi gọi Subprogram có tham số `OUT` hoặc `IN OUT`: PL/SQL tạo một **biến đệm tạm thời (temporary buffer)** bên trong Subprogram.
   * Với `OUT`: Biến đệm này bắt đầu bằng **`NULL`**.
   * Với `IN OUT`: Biến đệm này được sao chép giá trị từ biến đối số bên ngoài vào.
2. Trong suốt quá trình Subprogram chạy, mọi thay đổi trên tham số `OUT`/`IN OUT` chỉ diễn ra trên biến đệm tạm thời.
3. **Khi Subprogram kết thúc:**
   * Nếu kết thúc **bình thường** (hoặc Exception đã được bắt trọn vẹn bên trong Subprogram): Giá trị từ biến đệm tạm thời mới được **copy ngược ra** biến đối số bên ngoài.
   * Nếu xảy ra **Unhandled Exception** (Ngoại lệ văng ra khỏi Subprogram): Quá trình copy ngược **KHÔNG diễn ra**! Biến đối số thực tế ở bên ngoài **GIỮ NGUYÊN GIÁ TRỊ BAN ĐẦU** trước khi gọi hàm!

#### B. Khi sử dụng gợi ý `NOCOPY` (`OUT NOCOPY` / `IN OUT NOCOPY` — Pass by Reference)
Khi truyền một cấu trúc dữ liệu lớn (như `Collection`, `VARRAY`, `Nested Table`, `CLOB`, `Record` lớn) qua `OUT` hoặc `IN OUT`, việc sao chép vùng nhớ (Pass by Value) gây tốn RAM và giảm hiệu năng. Từ khóa **`NOCOPY`** yêu cầu trình biên dịch chuyển sang truyền bằng địa chỉ tham chiếu (**Pass by Reference**):

```sql
CREATE OR REPLACE PROCEDURE sp_test_nocopy (
    p_normal IN OUT NUMBER,
    p_nocopy IN OUT NOCOPY NUMBER
) IS
BEGIN
    p_normal := 999;
    p_nocopy := 999;
    -- Cố tình gây lỗi chia cho 0 (ZERO_DIVIDE) chưa được bắt tại đây!
    IF 1 / 0 = 1 THEN NULL; END IF;
END;
/

DECLARE
    v_a NUMBER := 10;
    v_b NUMBER := 10;
BEGIN
    BEGIN
        sp_test_nocopy(v_a, v_b);
    EXCEPTION
        WHEN ZERO_DIVIDE THEN
            DBMS_OUTPUT.PUT_LINE('Bắt lỗi ZERO_DIVIDE ở chương trình gọi!');
    END;
    DBMS_OUTPUT.PUT_LINE('v_a (IN OUT thường) = ' || v_a);
    DBMS_OUTPUT.PUT_LINE('v_b (IN OUT NOCOPY) = ' || v_b);
END;
/
```
**Kết quả đầu ra:**
```text
Bắt lỗi ZERO_DIVIDE ở chương trình gọi!
v_a (IN OUT thường) = 10
v_b (IN OUT NOCOPY) = 999
```

> [!IMPORTANT]
> **2 Điểm Cốt Lõi Về `NOCOPY` Cần Thuộc Lòng:**
> 1. **Khi có Unhandled Exception:** Tham số `OUT` / `IN OUT` thường sẽ **rollback về giá trị cũ** (`v_a = 10`), còn tham số có **`NOCOPY`** vì ghi trực tiếp vào địa chỉ ô nhớ gốc nên **vẫn giữ giá trị đã bị sửa dở dang** trước khi lỗi (`v_b = 999`)!
> 2. **`NOCOPY` chỉ là một gợi ý cho trình biên dịch (Compiler Hint), không phải lệnh cưỡng bức:** Trong các trường hợp sau, PL/SQL sẽ **phớt lờ `NOCOPY`** và âm thầm quay về cơ chế Pass by Value mà không báo lỗi:
>    * Đối số thực tế cần chuyển đổi kiểu dữ liệu ngầm định (Implicit datatype conversion) hoặc có ràng buộc `NOT NULL` / độ dài chuỗi hẹp hơn, hoặc là phần tử của mảng Associative Array.
>    * Cuộc gọi Subprogram đi qua kết nối mạng từ xa (**Remote Procedure Call qua Database Link**).

---

## 4. Các Ký Pháp Truyền Đối Số Khi Gọi Subprogram (Positional, Named, Mixed)

Giả sử ta có thủ tục sau:
```sql
CREATE OR REPLACE PROCEDURE sp_add_emp (
    p_id   IN NUMBER,
    p_name IN VARCHAR2 DEFAULT 'Unknown',
    p_sal  IN NUMBER   := 1000,
    p_dept IN NUMBER   DEFAULT 10
) IS
BEGIN
    DBMS_OUTPUT.PUT_LINE(p_id || ' - ' || p_name || ' - ' || p_sal || ' - ' || p_dept);
END;
/
```

Khi gọi `sp_add_emp`, PL/SQL hỗ trợ **3 cách truyền đối số**:

1. **Positional Notation (Truyền theo vị trí):**
   * Truyền các giá trị theo đúng thứ tự khai báo tham số: `sp_add_emp(101, 'Alice', 5000, 20);`.
   * Bạn chỉ có thể lược bỏ các tham số có giá trị mặc định tính từ **bên phải sang bên trái**. Bạn **không thể** nhảy cóc bỏ qua `p_name` để truyền `p_sal` nếu chỉ dùng Positional Notation (ví dụ: `sp_add_emp(101, , 5000);` là **lỗi cú pháp**!).
2. **Named Notation (Truyền theo tên với toán tử liên kết `=>`):**
   * Chỉ định rõ tên tham số hình thức kèm dấu `=>`:
     `sp_add_emp(p_dept => 30, p_id => 102);`
   * **Ưu điểm:** Thứ tự truyền tùy ý, dễ đọc, và có thể nhảy cóc bỏ qua bất kỳ tham số nào có giá trị mặc định ở giữa (`p_name` và `p_sal` tự nhận Default).
3. **Mixed Notation (Kết hợp cả vị trí và tên):**
   * Bắt đầu bằng Positional Notation (theo vị trí), sau đó chuyển sang Named Notation (`=>`):
     `sp_add_emp(103, p_dept => 40);` (Trong đó `103` gắn cho `p_id`, bỏ qua `p_name` và `p_sal`, truyền `p_dept => 40`).

> [!WARNING]
> **QUY TẮC BẤT DI BẤT DỊCH CỦA MIXED NOTATION:**
> Trong Mixed Notation, tất cả các đối số truyền theo vị trí (**Positional**) **BẮT BUỘC phải đứng TRƯỚC** các đối số truyền theo tên (**Named `=>`**)!
> **Một khi bạn đã sử dụng ký pháp tên `=>` cho một đối số, toàn bộ các đối số đứng phía sau nó trong cùng lời gọi hàm BẮT BUỘC cũng phải dùng ký pháp tên `=>`!**
> * ✅ Hợp lệ: `sp_add_emp(101, 'Bob', p_dept => 20, p_sal => 3000);`
> * ❌ **LỖI BIÊN DỊCH (`PLS-00312`):** `sp_add_emp(p_id => 101, 'Bob', 3000, 20);` (Vì sau `p_id => 101` lại quay về truyền theo vị trí `'Bob'`).

---

## 5. Câu Lệnh `RETURN` Trong Procedure vs Function

1. **Trong `FUNCTION`:**
   * Lệnh `RETURN expression;` vừa kết thúc hàm ngay lập tức, vừa trả giá trị của `expression` về cho nơi gọi.
   * Nếu một `FUNCTION` chạy đến dòng `END;` cuối cùng mà **không gặp bất kỳ lệnh `RETURN expression;` nào** (ví dụ do rẽ nhánh `IF` thiếu `ELSE`, hoặc trong khối `EXCEPTION` bắt lỗi nhưng quên viết `RETURN`), PL/SQL sẽ:
     * Cảnh báo lúc biên dịch (nếu bật `PLSQL_WARNINGS`).
     * Ném ra ngoại lệ Runtime nghiêm trọng: **`ORA-06503: PL/SQL: Function returned without value` (`FUNCTION_RETURNED_WITHOUT_VALUE`)**!
2. **Trong `PROCEDURE`:**
   * Lệnh `RETURN;` (đứng một mình, **không kèm theo bất kỳ giá trị hay biểu thức nào**) hoàn toàn hợp lệ trong Procedure! Nó có tác dụng thoát khỏi Procedure ngay lập tức và trả quyền điều khiển về cho nơi gọi.
   * Nếu viết `RETURN 10;` bên trong một Procedure, trình biên dịch sẽ báo lỗi **`PLS-00372: In a procedure, RETURN statement cannot contain an expression`**.

---

## 6. Local Subprograms (Chương Trình Con Cục Bộ) & Forward Declaration

Bạn có thể khai báo các Procedure và Function cục bộ (**Local / Nested Subprograms**) ngay bên trong phần khai báo (`DECLARE` của Anonymous Block, hoặc sau `IS`/`AS` của một Procedure/Function khác).

### 6.1. Quy tắc vị trí khai báo của Local Subprogram
> [!IMPORTANT]
> **QUY TẮC VÀNG VỀ VỊ TRÍ KHAI BÁO:**
> Trong bất kỳ phần khai báo (`DECLARE` hoặc `IS`/`AS`) nào, **tất cả các Local Subprograms (`PROCEDURE` / `FUNCTION`) BẮT BUỘC phải được đặt ở CUỐI CÙNG của phần khai báo** — tức là phải nằm **SAU tất cả** các khai báo biến, hằng số, kiểu dữ liệu (`TYPE`), con trỏ (`CURSOR`), và ngoại lệ (`EXCEPTION`)!
> Nếu bạn khai báo một biến `v_x NUMBER;` nằm **phía dưới** một Local Procedure trong cùng khối `DECLARE`, trình biên dịch sẽ báo lỗi **`PLS-00103: Encountered the symbol "..."`**!

```sql
DECLARE
    -- 1. Khai báo biến, hằng, cursor PHẢI ĐỨNG TRƯỚC
    v_bonus_rate CONSTANT NUMBER := 0.15;
    v_total      NUMBER;

    -- 2. Khai báo Local Function/Procedure PHẢI ĐỨNG CUỐI CÙNG trước BEGIN
    FUNCTION fn_calc_bonus(p_sal NUMBER) RETURN NUMBER IS
    BEGIN
        RETURN p_sal * v_bonus_rate;
    END fn_calc_bonus;

    -- ❌ NẾU KHAI BÁO THÊM BIẾN Ở ĐÂY (v_err NUMBER;) SẼ BỊ LỖI BIÊN DỊCH NGAY!
BEGIN
    v_total := fn_calc_bonus(2000);
    DBMS_OUTPUT.PUT_LINE('Bonus = ' || v_total);
END;
/
```

### 6.2. Khai báo tiền định (Forward Declaration) cho Đệ quy tương hỗ (Mutual Recursion)
PL/SQL biên dịch từ trên xuống dưới: một Local Subprogram phải được khai báo trước khi nó được gọi. Vậy nếu thủ tục `proc_A` gọi `proc_B`, và `proc_B` lại gọi ngược lại `proc_A` thì sao?
Giải pháp là dùng **Forward Declaration** (Khai báo trước phần Header kết thúc bằng dấu `;` cho `proc_B`, sau đó mới định nghĩa thân của `proc_A` và `proc_B`):

```sql
DECLARE
    -- Forward Declaration: Chỉ khai báo chữ ký (Header) của proc_B trước
    PROCEDURE proc_B(p_n IN NUMBER);

    -- Định nghĩa proc_A (bây giờ proc_A đã biết proc_B tồn tại để gọi!)
    PROCEDURE proc_A(p_n IN NUMBER) IS
    BEGIN
        IF p_n > 0 THEN
            DBMS_OUTPUT.PUT_LINE('A: ' || p_n);
            proc_B(p_n - 1);
        END IF;
    END proc_A;

    -- Định nghĩa chi tiết thân (Body) của proc_B (chữ ký phải khớp 100% với Forward Declaration)
    PROCEDURE proc_B(p_n IN NUMBER) IS
    BEGIN
        IF p_n > 0 THEN
            DBMS_OUTPUT.PUT_LINE('B: ' || p_n);
            proc_A(p_n - 1);
        END IF;
    END proc_B;
BEGIN
    proc_A(3);
END;
/
```

---

## 7. Quy Tắc Gọi PL/SQL Function Trong Câu Lệnh SQL & Tối Ưu Hóa

Một `FUNCTION` được lưu trữ trong Database (Stored Function hoặc Package Function) có thể được gọi trực tiếp bên trong các câu lệnh SQL (`SELECT`, `WHERE`, `GROUP BY`, `ORDER BY`, `VALUES` của `INSERT`, `SET` của `UPDATE`). Tuy nhiên, vì SQL Engine khác với PL/SQL Engine, một Function muốn gọi được từ SQL phải tuân thủ **6 quy tắc nghiêm ngặt** sau:

### 7.1. Sáu Quy Tắc Bắt Buộc Khi Gọi Function Trong Câu Lệnh SQL

| # | Quy tắc bắt buộc | Lỗi xảy ra nếu vi phạm |
| :---: | :--- | :--- |
| **1** | Phải là **Stored Function** (hoặc khai báo trong mệnh đề `WITH FUNCTION` của Oracle 12c+). Local Function trong `DECLARE` của PL/SQL không thể gọi từ câu lệnh SQL. | `ORA-00904: invalid identifier` hoặc `PLS-00231: function may not be used in SQL`. |
| **2** | Tất cả các tham số bắt buộc phải ở chế độ **`IN`**. Không được phép có bất kỳ tham số **`OUT`** hoặc **`IN OUT`** nào. | `ORA-06572: Function ... has out arguments`. |
| **3** | Kiểu dữ liệu của tất cả tham số và kiểu trả về **`RETURN`** phải là **kiểu dữ liệu hợp lệ của SQL Engine** (`NUMBER`, `VARCHAR2`, `DATE`, ...). **Cấm** trả về các kiểu đặc thù chỉ có trong PL/SQL như **`BOOLEAN`**, `RECORD`, Associative Array. | `ORA-06552: PL/SQL: Statement ignored` / `PLS-00382: expression is of wrong type`. *(Lưu ý: Oracle 23ai mới bắt đầu hỗ trợ `BOOLEAN` trong SQL, nhưng trong chuẩn thi 19c/21c `1Z0-149`, `BOOLEAN` vẫn là kiểu thuần PL/SQL không dùng được trong SQL SELECT!)* |
| **4** | Nếu Function được gọi từ câu lệnh **`SELECT`** (hoặc truy vấn song song): Function **KHÔNG ĐƯỢC PHÉP thực hiện lệnh DML (`INSERT`, `UPDATE`, `DELETE`, `MERGE`)** làm thay đổi dữ liệu trong Database! | **`ORA-14551: cannot perform a DML operation inside a query`** *(Trừ khi Function được đánh dấu là `PRAGMA AUTONOMOUS_TRANSACTION` và có `COMMIT`)*. |
| **5** | Nếu Function được gọi từ câu lệnh DML (`UPDATE T SET ... WHERE col = fn()`): Function **không được phép đọc (`SELECT`) hoặc sửa đổi chính bảng `T`** đang bị câu lệnh DML đó tác động. | **`ORA-04091: table is mutating, trigger/function may not see it`**. |
| **6** | Function được gọi từ SQL **không được phép** kết thúc giao dịch (`COMMIT`, `ROLLBACK`, `SAVEPOINT`), không được gọi `ALTER SESSION` / `ALTER SYSTEM`, hoặc thực thi lệnh DDL (`EXECUTE IMMEDIATE 'CREATE...'`). | `ORA-14552: cannot perform a DDL, commit or rollback inside a query or DML`. |

> [!TIP]
> **Mẹo truyền đối số khi gọi Function trong SQL:**
> Từ Oracle 11g trở đi, bên trong câu lệnh SQL, bạn **được phép** gọi PL/SQL Function bằng cả **Positional**, **Named (`=>`)**, và **Mixed Notation**! (Ví dụ: `SELECT fn_calc(p_sal => salary, p_rate => 0.1) FROM employees;` hoàn toàn hợp lệ!).

### 7.2. Ba Kỹ Thuật Tăng Tốc PL/SQL Function Trong SQL

Khi gọi một PL/SQL Function trên bảng có 1 triệu dòng, việc chuyển ngữ cảnh (**Context Switching**) giữa SQL Engine và PL/SQL Engine sẽ diễn ra 1 triệu lần. Oracle cung cấp 3 cơ chế tối ưu hóa:

1. **`DETERMINISTIC` (Hàm tất định):**
   * Khai báo rằng với cùng một bộ tham số đầu vào `IN`, hàm luôn trả về **cùng một kết quả đầu ra** và không phụ thuộc vào dữ liệu bảng hay biến toàn cục.
   * **Ứng dụng:** Bắt buộc phải có từ khóa `DETERMINISTIC` nếu bạn muốn tạo **Function-Based Index (FBI)** trên hàm đó (ví dụ: `CREATE INDEX idx_emp_tax ON employees(fn_calc_tax(salary));`), hoặc dùng trong Materialized View. Đồng thời giúp SQL Engine cache kết quả trong phạm vi **một câu truy vấn đơn lẻ (Single-Query Execution)**.
2. **`RESULT_CACHE` (Bộ đệm kết quả xuyên Session trong SGA):**
   * Lưu cặp `(Tham số đầu vào -> Kết quả trả về)` vào vùng nhớ **PL/SQL Function Result Cache** nằm trong **Shared Pool (SGA)**.
   * Khác với `DETERMINISTIC` (chỉ nhớ tạm trong 1 lệnh SQL của 1 Session), **`RESULT_CACHE` chia sẻ kết quả đã tính cho TẤT CẢ các Session trên toàn bộ Database Instance**! Nếu dữ liệu bảng gốc mà hàm truy vấn bị thay đổi (`COMMIT`), Oracle tự động xóa (invalidate) kết quả cache cũ ngay lập tức.
3. **`PRAGMA UDF` (User-Defined Function - Từ Oracle 12c+):**
   * Đặt `PRAGMA UDF;` trong phần khai báo của Function để báo cho trình biên dịch rằng hàm này chủ yếu được gọi từ các câu lệnh **SQL**. Trình biên dịch sẽ tối ưu hóa cấu trúc bộ nhớ gọi hàm để giảm thiểu chi phí Context Switch giữa SQL Engine và PL/SQL Engine.
4. **Mệnh đề `WITH FUNCTION` (Inline PL/SQL Function trong SQL - Từ Oracle 12c+):**
   * Cho phép định nghĩa một hàm PL/SQL tạm thời ngay trong mệnh đề `WITH` của câu lệnh `SELECT` mà không cần quyền `CREATE PROCEDURE` để lưu hàm vào Database:
     ```sql
     WITH
       FUNCTION fn_net_sal(p_sal NUMBER) RETURN NUMBER IS
       BEGIN
           RETURN p_sal * 0.9;
       END;
     SELECT employee_id, fn_net_sal(salary) AS net_salary
     FROM employees
     WHERE department_id = 10;
     /
     ```

---

## 8. Mô Hình Quyền Thực Thi: `AUTHID DEFINER` vs `AUTHID CURRENT_USER`

Đây là chủ đề cực kỳ quan trọng trong kỳ thi **OCP 1Z0-149**. Khi User **A** (`HR`) tạo một Stored Procedure/Function/Package và cấp quyền `GRANT EXECUTE` cho User **B** (`SCOTT`), khi **B** chạy thủ tục đó, Oracle sẽ kiểm tra quyền truy cập bảng và phân giải tên bảng theo ai?

### 8.1. Bảng So Sánh `AUTHID DEFINER` và `AUTHID CURRENT_USER`

| Tiêu chí so sánh | `AUTHID DEFINER` (Definer's Rights — **MẶC ĐỊNH**) | `AUTHID CURRENT_USER` (Invoker's Rights) |
| :--- | :--- | :--- |
| **Cách khai báo** | Không ghi gì (Mặc định) hoặc ghi `AUTHID DEFINER` trước `IS`/`AS`. | Ghi tường minh `AUTHID CURRENT_USER` trước `IS`/`AS`. |
| **Chạy bằng quyền (Privileges) của ai?** | Chạy bằng quyền của **Người sở hữu/tạo ra thủ tục (Owner / Definer - User A)**. Người gọi (User B) chỉ cần duy nhất quyền `EXECUTE` trên thủ tục, không cần quyền trực tiếp trên các bảng bên trong! | Chạy bằng quyền của **Người đang gọi thủ tục lúc Runtime (Invoker - User B)**. Nếu User B không có quyền `SELECT`/`UPDATE` trên bảng bên trong, thủ tục sẽ báo lỗi `ORA-00942` / `ORA-01031`. |
| **Phân giải tên đối tượng không có Schema (`SELECT * FROM emp`)** | Luôn trỏ vào bảng `A.emp` thuộc Schema của **Người tạo (Definer - User A)**. | Trỏ vào bảng `B.emp` thuộc Schema của **Người đang gọi (Invoker - User B)** tại thời điểm Runtime! |
| **Thời điểm kiểm tra quyền** | Kiểm tra tại **thời điểm biên dịch (Compile time)** và khi chạy (dựa trên quyền trực tiếp của Definer). | Kiểm tra tại **thời điểm thực thi (Runtime)** dựa trên quyền của Invoker. |
| **Vai trò của `ROLE` (Quyền cấp qua Role)** | ❌ **BỊ VÔ HIỆU HÓA HOÀN TOÀN (`ROLES ARE DISABLED`)!** Người tạo (Definer) bắt buộc phải được cấp quyền **trực tiếp (`GRANT SELECT ON ... TO user_A`)**, quyền có được thông qua `ROLE` không có tác dụng khi biên dịch Stored Subprogram `AUTHID DEFINER`! | ✅ **CÓ HIỆU LỰC (`ROLES ARE ENABLED`)!** Người gọi (Invoker) có thể sử dụng các quyền được cấp thông qua `ROLE` đang kích hoạt trong Session của họ (trừ trường hợp thủ tục `AUTHID CURRENT_USER` được gọi gián tiếp từ bên trong một thủ tục `AUTHID DEFINER`). |
| **Ứng dụng thực tế** | Bảo mật dữ liệu tập trung: Đóng gói logic nghiệp vụ, không cho User chạm trực tiếp vào bảng gốc mà chỉ cho phép sửa dữ liệu thông qua Procedure kiểm soát sẵn. | Viết các thủ tục tiện ích dùng chung (Utility / Audit / Dynamic SQL) chạy trên bảng riêng của từng Schema người gọi. |

```mermaid
flowchart TD
    Call["User SCOTT gọi lệnh:<br/>EXEC hr.sp_update_emp();"] --> Check{"Khai báo AUTHID của<br/>hr.sp_update_emp?"}
    Check -->|AUTHID DEFINER<br/>(Mặc định)| Def["1. Dùng quyền trực tiếp của HR (Vô hiệu hóa ROLE)<br/>2. Bảng 'employees' hiểu là HR.EMPLOYEES"]
    Check -->|AUTHID CURRENT_USER<br/>(Invoker's Rights)| Inv["1. Dùng quyền của SCOTT (Kể cả quyền qua ROLE)<br/>2. Bảng 'employees' hiểu là SCOTT.EMPLOYEES"]
```

> [!WARNING]
> **BẪY THI KINH ĐIỂN VỀ `ROLE` VÀ `ORA-00942` TRONG STORED PROCEDURE:**
> Giả sử User `DEV1` chạy câu lệnh `SELECT * FROM hr.employees;` trực tiếp trong SQL*Plus hoặc trong một **Anonymous Block** `BEGIN ... END;` thì **chạy thành công mỹ mãn**. Nhưng khi `DEV1` đưa đúng câu lệnh đó vào trong `CREATE PROCEDURE sp_test IS ...`, trình biên dịch lại báo lỗi **`ORA-00942: table or view does not exist`**!
> **Tại sao?**
> * Vì `DEV1` nhận quyền `SELECT` trên bảng `hr.employees` thông qua một **`ROLE`** (chứ không phải được `GRANT` trực tiếp).
> * Trong SQL và Anonymous Block (hoặc Subprogram `AUTHID CURRENT_USER`), `ROLE` có hiệu lực.
> * Nhưng trong Stored Subprogram mặc định (`AUTHID DEFINER`), toàn bộ **`ROLE` bị vô hiệu hóa (`SET ROLE NONE`)**! Để biên dịch thành công thủ tục `AUTHID DEFINER`, `HR` bắt buộc phải cấp quyền trực tiếp: `GRANT SELECT ON hr.employees TO dev1;`, hoặc `DEV1` phải thêm `AUTHID CURRENT_USER` vào thủ tục!

---

## 9. Bài Tập Thực Hành Tự Luyện (Kèm Lời Giải Chi Tiết)

### Bài tập 1: Phân tích giá trị biến qua `IN`, `OUT`, `IN OUT` và `NOCOPY` khi có Exception
Hãy xác định chính xác kết quả in ra màn hình của đoạn mã dưới đây:
```sql
CREATE OR REPLACE PROCEDURE sp_calc (
    p_in     IN            NUMBER DEFAULT 5,
    p_out    OUT           NUMBER,
    p_inout  IN OUT        NUMBER,
    p_nocopy IN OUT NOCOPY NUMBER
) IS
BEGIN
    DBMS_OUTPUT.PUT_LINE('Inside Start: p_out=' || NVL(TO_CHAR(p_out), 'NULL') || ', p_inout=' || p_inout);
    p_out    := p_in * 10;
    p_inout  := p_inout + p_out;
    p_nocopy := p_nocopy + 100;

    IF p_inout > 50 THEN
        RAISE VALUE_ERROR;
    END IF;
END sp_calc;
/

DECLARE
    v_out    NUMBER := 99;
    v_inout  NUMBER := 20;
    v_nocopy NUMBER := 20;
BEGIN
    sp_calc(p_out => v_out, p_inout => v_inout, p_nocopy => v_nocopy);
EXCEPTION
    WHEN VALUE_ERROR THEN
        DBMS_OUTPUT.PUT_LINE('After Exception: v_out=' || NVL(TO_CHAR(v_out), 'NULL')
                             || ', v_inout=' || v_inout
                             || ', v_nocopy=' || v_nocopy);
END;
/
```

<details>
<summary><b>👉 Xem Lời Giải Chi Tiết Bài Tập 1</b></summary>

1. Khi gọi `sp_calc`, tham số `p_in` không được truyền nên lấy giá trị mặc định là `5`.
2. Ngay khi bước vào `sp_calc`:
   * Mặc dù biến `v_out` bên ngoài có giá trị `99`, tham số chế độ **`OUT`** (`p_out`) luôn bị khởi tạo về **`NULL`** khi bắt đầu thủ tục!
   * `p_inout` nhận giá trị `20`.
   * Do đó dòng đầu tiên in ra: **`Inside Start: p_out=NULL, p_inout=20`**.
3. Tiếp theo trong thân thủ tục:
   * `p_out := 5 * 10 = 50`.
   * `p_inout := 20 + 50 = 70` (Ghi trên vùng đệm tạm vì không có `NOCOPY`).
   * `p_nocopy := 20 + 100 = 120` (Ghi **trực tiếp** vào biến `v_nocopy` bên ngoài vì có `NOCOPY`!).
4. Vì `p_inout` (`70`) > `50`, thủ tục ném ngoại lệ `VALUE_ERROR` chưa được bắt bên trong `sp_calc`.
5. Khi thoát ra khối `EXCEPTION` bên ngoài:
   * Vì `sp_calc` kết thúc bởi Unhandled Exception, các tham số Pass-by-Value (`p_out` và `p_inout`) **không được copy ngược ra ngoài**, nên `v_out` giữ nguyên giá trị gốc ban đầu là **`99`** và `v_inout` giữ nguyên giá trị gốc là **`20`**.
   * Riêng `v_nocopy` dùng Pass-by-Reference (`NOCOPY`) nên đã bị sửa trực tiếp thành **`120`**!
   * Dòng thứ hai in ra: **`After Exception: v_out=99, v_inout=20, v_nocopy=120`**.
</details>

---

### Bài tập 2: Viết Stored Function tính thuế tối ưu hóa cho SQL
Hãy viết một Stored Function `fn_get_tax` nhận vào mức lương `p_salary` (mặc định là `0`), sử dụng cả `DETERMINISTIC`, `RESULT_CACHE` và `PRAGMA UDF` để trả về mức thuế (`0` nếu lương `< 5000`, `10%` nếu lương từ `5000` đến `10000`, và `20%` nếu lương `> 10000`).

<details>
<summary><b>👉 Xem Lời Giải Chi Tiết Bài Tập 2</b></summary>

```sql
CREATE OR REPLACE FUNCTION fn_get_tax (
    p_salary IN NUMBER DEFAULT 0
) RETURN NUMBER
DETERMINISTIC
RESULT_CACHE
IS
    PRAGMA UDF;
    v_tax NUMBER;
BEGIN
    IF p_salary < 5000 THEN
        v_tax := 0;
    ELSIF p_salary <= 10000 THEN
        v_tax := p_salary * 0.10;
    ELSE
        v_tax := p_salary * 0.20;
    END IF;

    RETURN v_tax;
END fn_get_tax;
/

-- Gọi thử trong câu lệnh SQL bằng Named Notation:
SELECT employee_id, first_name, salary, fn_get_tax(p_salary => salary) AS tax
FROM employees
WHERE department_id = 90;
```
</details>

---

## 10. Tổng Hợp Bẫy Thi OCP Cốt Lõi Cần Nhớ (Exam Essentials)

| # | Chủ đề / Tình huống bẫy trong đề thi OCP 1Z0-149 | Kết quả / Quy tắc chuẩn xác |
| :---: | :--- | :--- |
| **1** | Khai báo `CREATE PROCEDURE p(x VARCHAR2(20)) IS` hoặc `RETURN VARCHAR2(50)` | **Lỗi biên dịch `PLS-00103`**. Không được ghi độ dài/độ chính xác cho kiểu dữ liệu của tham số và `RETURN`. |
| **2** | Khai báo `CREATE FUNCTION f() RETURN NUMBER IS` (dùng cặp ngoặc rỗng `()` khi không có tham số) | **Lỗi biên dịch `PLS-00103`**. Khi tạo Subprogram không có tham số, cấm viết `()`. |
| **3** | Viết từ khóa `DECLARE` ngay dưới `CREATE PROCEDURE p IS` | **Lỗi biên dịch**. `IS` / `AS` đã thay thế cho `DECLARE`. |
| **4** | Gán giá trị cho tham số `IN` hoặc gắn `DEFAULT` cho tham số `OUT` / `IN OUT` | **Lỗi biên dịch**. Tham số `IN` là Read-only; `OUT` và `IN OUT` không được phép có giá trị `DEFAULT`. |
| **5** | Viết `p_x IN NOCOPY VARCHAR2` | **Lỗi biên dịch**. `NOCOPY` chỉ áp dụng cho `OUT` và `IN OUT` (vì `IN` luôn là Pass by Reference sẵn rồi). |
| **6** | Truyền biến `v_x := 100` vào tham số `OUT` (không có `IN OUT`), hỏi giá trị của tham số đó ngay đầu Subprogram | Bằng **`NULL`**! Tham số `OUT` luôn bị reset về `NULL` ngay khi bước vào Subprogram. |
| **7** | Subprogram bị văng Unhandled Exception ra ngoài: giá trị của đối số `OUT` thường vs `OUT NOCOPY` | Đối số `OUT` thường **giữ nguyên giá trị cũ trước khi gọi**; đối số `OUT NOCOPY` **bị thay đổi theo giá trị đã gán trước lúc lỗi**. |
| **8** | Gọi `my_proc(p_a => 10, 20, 30);` (Mixed Notation đặt Positional sau Named `=>`) | **Lỗi biên dịch `PLS-00312`**. Đã dùng `=>` thì mọi đối số phía sau bắt buộc phải dùng `=>`. |
| **9** | Khai báo biến `v_num NUMBER;` nằm **phía dưới** một Local Procedure trong khối `DECLARE` | **Lỗi biên dịch**. Mọi Local Subprograms bắt buộc phải nằm ở **cuối cùng** của phần khai báo `DECLARE`. |
| **10** | Gọi một Function trong câu lệnh `SELECT` mà bên trong Function đó có lệnh `UPDATE` / `INSERT` | Lỗi Runtime **`ORA-14551: cannot perform a DML operation inside a query`** (trừ khi dùng `PRAGMA AUTONOMOUS_TRANSACTION`). |
| **11** | Gọi một Function trong câu lệnh `SELECT` mà Function đó có tham số `OUT` hoặc trả về `BOOLEAN` | Lỗi biên dịch/Runtime (`ORA-06572` / `PLS-00382`). Hàm gọi trong SQL chỉ được có tham số `IN` và trả về kiểu dữ liệu SQL. |
| **12** | User chạy `SELECT * FROM hr.emp` trong Anonymous Block thì được, nhưng tạo Stored Procedure (`AUTHID DEFINER`) thì báo lỗi `ORA-00942` | Do quyền `SELECT` được cấp qua **`ROLE`**. Trong `AUTHID DEFINER`, mọi `ROLE` bị vô hiệu hóa; phải cấp quyền trực tiếp hoặc dùng `AUTHID CURRENT_USER`. |
