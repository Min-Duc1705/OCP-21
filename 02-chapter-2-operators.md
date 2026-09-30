# Chương 2: Toán Tử Trong Java (Operators) - OCP Java SE 21 (1Z0-830)

> **Tài liệu tham chiếu:** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Trang 169–223).  
> **Mục tiêu khảo thí:** Use primitives and wrapper classes; Evaluate arithmetic and boolean expressions; Apply operator precedence rules; Type promotion and casting; Logical & short-circuit evaluation; Equality and `instanceof`.

---

## 📑 Mục Lục Chi Tiết

1. [Tổng Quan Về Toán Tử & Bảng Thứ Tự Ưu Tiên (Operator Precedence)](#1-tổng-quan-về-toán-tử--bảng-thứ-tự-ưu-tiên-operator-precedence)
2. [Toán Tử Một Ngôi (Unary Operators)](#2-toán-tử-một-ngôi-unary-operators)
3. [Toán Tử Số Học Hai Ngôi (Binary Arithmetic Operators)](#3-toán-tử-số-học-hai-ngôi-binary-arithmetic-operators)
4. [4 Quy Tắc Thăng Hạng Kiểu Số Học (Numeric Promotion Rules)](#4-4-quy-tắc-thăng-hạng-kiểu-số-học-numeric-promotion-rules)
5. [Toán Tử Gán (Assignment) & Cơ Chế Ép Kiểu (Casting)](#5-toán-tử-gán-assignment--cơ-chế-ép-kiểu-casting)
6. [Toán Tử Gán Phức Hợp (Compound Assignment) & Ép Kiểu Ngầm Định](#6-toán-tử-gán-phức-hợp-compound-assignment--ép-kiểu-ngầm-định)
7. [Toán Tử So Sánh (Relational & Equality) & Toán Tử `instanceof`](#7-toán-tử-so-sánh-relational--equality--toán-tử-instanceof)
8. [Toán Tử Logic (`&`, `|`, `^`) vs Toán Tử Đoản Mạch (`&&`, `||`)](#8-toán-tử-logic---vs-toán-tử-đoản-mạch--)
9. [Toán Tử Ba Ngôi (Ternary Operator `? :`)](#9-toán-tử-ba-ngôi-ternary-operator--)
10. [Tổng Hợp Bẫy Thi OCP Chapter 2 Cần Nhớ (Exam Essentials)](#10-tổng-hợp-bẫy-thi-ocp-chapter-2-cần-nhớ-exam-essentials)

---

## 1. Tổng Quan Về Toán Tử & Bảng Thứ Tự Ưu Tiên (Operator Precedence)

Toán tử trong Java là các ký hiệu đặc biệt dùng để thực hiện phép toán trên 1, 2 hoặc 3 toán hạng (operands):
* **Toán tử một ngôi (Unary operator):** Cần đúng 1 toán hạng (ví dụ: `++x`, `!flag`, `-y`).
* **Toán tử hai ngôi (Binary operator):** Cần đúng 2 toán hạng (ví dụ: `x + y`, `a * b`, `p && q`).
* **Toán tử ba ngôi (Ternary operator):** Cần đúng 3 toán hạng (`condition ? expr1 : expr2`).

---

### 1.1. Bảng Thứ Tự Ưu Tiên Các Toán Tử (Table 2.1 - Bắt Buộc Ghi Nhớ Khi Đi Thi)

Khi một biểu thức phức tạp không có dấu ngoặc đơn `()`, Java sẽ đánh giá theo thứ tự ưu tiên từ trên xuống dưới. Nếu hai toán tử có cùng mức ưu tiên, Java sẽ xét hướng đánh giá (*Left-to-right* hoặc *Right-to-left*):

| Mức ưu tiên | Loại toán tử | Ký hiệu / Ví dụ | Hướng đánh giá |
| :---: | :--- | :--- | :---: |
| **1 (Cao nhất)** | Hậu tố một ngôi (Post-unary) | `expr++`, `expr--` | Trái sang phải |
| **2** | Tiền tố một ngôi (Pre-unary) | `++expr`, `--expr` | Phải sang trái |
| **3** | Một ngôi khác (Other unary) | `+`, `-`, `!`, `~`, `(Type)` (cast) | Phải sang trái |
| **4** | Nhân, Chia, Chia lấy dư | `*`, `/`, `%` | Trái sang phải |
| **5** | Cộng, Trừ | `+`, `-` | Trái sang phải |
| **6** | Dịch bit (Shift) | `<<`, `>>`, `>>>` | Trái sang phải |
| **7** | Quan hệ (Relational) | `<`, `>`, `<=`, `>=`, `instanceof` | Trái sang phải |
| **8** | So sánh bằng / Khác nhau | `==`, `!=` | Trái sang phải |
| **9** | AND thao tác bit / logic | `&` | Trái sang phải |
| **10** | XOR loại trừ bit / logic | `^` | Trái sang phải |
| **11** | OR bao hàm bit / logic | `\|` | Trái sang phải |
| **12** | AND điều kiện (Đoản mạch) | `&&` | Trái sang phải |
| **13** | OR điều kiện (Đoản mạch) | `\|\|` | Trái sang phải |
| **14** | Ba ngôi (Ternary) | `booleanExpr ? expr1 : expr2` | **Phải sang trái** |
| **15 (Thấp nhất)**| Gán & Gán phức hợp | `=`, `+=`, `-=`, `*=`, `/=`, `%=`, v.v. | **Phải sang trái** |
| — | Mũi tên (Arrow) | `->` (dùng trong Switch & Lambda) | **Phải sang trái** |

> [!TIP]
> **Quy tắc nhớ nhanh:**
> 1. `++` / `--` luôn được ưu tiên xử lý trước phép tính số học.
> 2. Nhân / Chia (`* / %`) đi trước Cộng / Trừ (`+ -`).
> 3. Phép tính số học đi trước phép so sánh (`< > == !=`).
> 4. So sánh đi trước logic (`&& ||`).
> 5. Phép gán (`=`) và phép ba ngôi (`? :`) luôn có độ ưu tiên thấp nhất và được tính từ **Phải sang Trái**!

---

## 2. Toán Tử Một Ngôi (Unary Operators)

### 2.1. Phủ Định Logic (`!`) & Đảo Bit (`~`)
* **Toán tử `!` (Logical Complement):** Chỉ áp dụng cho kiểu `boolean`. Nó đảo ngược giá trị:
  ```java
  boolean isActive = false;
  boolean isRunning = !isActive; // true
  ```
  ❌ *Cấm tuyệt đối:* Áp dụng `!` cho số nguyên (như trong ngôn ngữ C/C++ `!0` là hợp lệ, nhưng trong Java `!0` là **Lỗi biên dịch**).
* **Toán tử `~` (Bitwise Complement):** Chỉ áp dụng cho các kiểu số nguyên (`byte`, `short`, `char`, `int`, `long`).
  * Cơ chế: Đảo toàn bộ bit từ `0` thành `1` và ngược lại.
  * 💡 **Công thức phản xạ thi cử:** `~x = -x - 1` (hoặc `~x = -(x + 1)`)
    * `~3` $\rightarrow$ `-4`
    * `~0` $\rightarrow$ `-1`
    * `~(-5)` $\rightarrow$ `4`
  ❌ *Cấm tuyệt đối:* Áp dụng `~` cho kiểu `boolean` hoặc số thực `float`/`double`.

### 2.2. Dấu Dương (`+`) & Dấu Âm (`-`) Số Học
* `+a`: Cho biết giá trị là số dương (thường dư thừa). Tuy nhiên, nếu áp dụng cho `byte`, `short`, `char`, nó sẽ tự động kích hoạt ép lên `int`!
* `-a`: Đổi dấu của biểu thức số học (`- (-5)` thành `5`).

### 2.3. Tăng Giảm Tiền Tố (Prefix) vs Hậu Tố (Postfix)
Đây là dạng bài tập tính toán xuất hiện rất nhiều trong đề thi Oracle:

* **Tiền tố (`++x`, `--x`):** Giá trị được tăng/giảm **ngay lập tức**, sau đó mới dùng giá trị mới này để thực hiện biểu thức tiếp theo.
* **Hậu tố (`x++`, `x--`):** Giá trị **cũ (chưa tăng)** được lấy ra để thực hiện biểu thức trước, sau đó biến mới được tăng/giảm lên 1 đơn vị.

#### Ví dụ phân tích luồng chạy (Exam Walkthrough):
```java
int lion = 3;
int tiger = ++lion * 5 / lion--;
System.out.println("lion=" + lion);   // lion=3
System.out.println("tiger=" + tiger); // tiger=5
```
* **Các bước phân tích của JVM:**
  1. `++lion`: `lion` tăng từ 3 lên 4. Giá trị trả về của `++lion` là `4`. (Biểu thức thành: `4 * 5 / lion--`).
  2. `4 * 5`: Thực hiện nhân $\rightarrow$ `20`. (Biểu thức thành: `20 / lion--`).
  3. `lion--`: Lấy giá trị hiện tại của `lion` là `4` đưa vào phép chia. Sau đó `lion` mới giảm xuống `3`.
  4. `20 / 4`: Thực hiện chia $\rightarrow$ `5`. Gán `tiger = 5`.
  5. Kết thúc: `tiger = 5`, `lion = 3`.

---

## 3. Toán Tử Số Học Hai Ngôi (Binary Arithmetic Operators)

Bao gồm: Cộng (`+`), Trừ (`-`), Nhân (`*`), Chia (`/`), và Chia lấy dư (`%`).

### 3.1. Phép Chia Nguyên (`/`) vs Phép Chia Thực
* Phép chia giữa 2 số nguyên (`int / int`) luôn loại bỏ hoàn toàn phần thập phân (lấy phần nguyên, không làm tròn):
  ```java
  System.out.println(9 / 3);  // 3
  System.out.println(10 / 3); // 3 (không phải 3.333)
  System.out.println(1 / 2);  // 0
  ```

### 3.2. Phép Chia Lấy Dư (`%` - Modulus / Remainder)
Toán tử `%` trả về phần dư của phép chia:
* `9 % 3` $\rightarrow$ `0` (chia hết)
* `11 % 3` $\rightarrow$ `2` (11 = 3 * 3 + 2)

#### Quy tắc dấu trong phép Modulus (`%`) (Rất hay lừa!):
* **Dấu của số chia (bên phải `%`) hoàn toàn bị bỏ qua:**
  * `7 % 5` $\rightarrow$ `2`
  * `7 % -5` $\rightarrow$ `2` (dấu âm bên phải không ảnh hưởng đến kết quả)
* **Dấu của số bị chia (bên trái `%`) quyết định dấu của kết quả:**
  * `-7 % 5` $\rightarrow$ `-2`
  * `-7 % -5` $\rightarrow$ `-2`

### 3.3. Phép Chia Cho Số 0 (Division by Zero)
Trong Java, có sự khác biệt rất lớn giữa số nguyên và số thực khi chia cho 0:
* **Số nguyên chia cho 0 (`int / 0` hoặc `int % 0`):**
  * Ném ra ngoại lệ tại Runtime: `java.lang.ArithmeticException: / by zero`.
* **Số thực chia cho 0 (`double` hoặc `float`):**
  * **KHÔNG ném ngoại lệ!** Thay vào đó trả về giá trị đặc biệt:
    ```java
    System.out.println(1.0 / 0.0);  // Infinity (Dương vô cùng)
    System.out.println(-1.0 / 0.0); // -Infinity (Âm vô cùng)
    System.out.println(0.0 / 0.0);  // NaN (Not a Number)
    ```

---

## 4. 4 Quy Tắc Thăng Hạng Kiểu Số Học (Numeric Promotion Rules)

> [!IMPORTANT]
> Đây là một trong những phần quan trọng nhất của Chapter 2. Đề thi OCP luôn lồng ghép các quy tắc này vào mọi câu hỏi code để đánh lừa thí sinh.

Bất cứ khi nào hai toán hạng tham gia vào một toán tử hai ngôi số học (`+`, `-`, `*`, `/`, `%`), Java tuân thủ nghiêm ngặt **4 quy tắc sau theo đúng thứ tự**:

1. **Quy tắc 1 (Khác kiểu dữ liệu):** Nếu 2 toán hạng có kiểu dữ liệu khác nhau, Java sẽ tự động thăng hạng (*promote*) toán hạng có kiểu nhỏ hơn lên kiểu lớn hơn của toán hạng kia.
   * Ví dụ: `int + long` $\rightarrow$ Cả hai được nâng lên thành `long` $\rightarrow$ Kết quả là `long`.
2. **Quy tắc 2 (Nguyên kết hợp với Số thực):** Nếu một trong các toán hạng là số nguyên (*integral*) và toán hạng kia là số thực (*floating-point*), Java sẽ tự động thăng hạng toán hạng số nguyên lên thành kiểu số thực.
   * Ví dụ: `int * float` $\rightarrow$ `float * float` $\rightarrow$ Kết quả là `float`.
   * Ví dụ: `long + double` $\rightarrow$ `double + double` $\rightarrow$ Kết quả là `double`.
3. **Quy tắc 3 (Các kiểu nhỏ hơn `int` luôn bị ép lên `int` trước):**
   * Các kiểu dữ liệu nhỏ gồm: `byte`, `short`, và `char` **LUÔN LUÔN được tự động thăng hạng lên thành `int`** ngay khi chúng xuất hiện trong bất kỳ toán tử hai ngôi số học nào, kể cả khi cả hai toán hạng đều là `short` hoặc `byte`!
   ```java
   short x = 10;
   short y = 20;
   short z = x + y; // ❌ LỖI BIÊN DỊCH: possible loss of precision (found int, required short)
   int ok = x + y;  // ✅ Hợp lệ!
   ```
4. **Quy tắc 4 (Kiểu kết quả cuối cùng):** Sau khi toàn bộ các toán hạng đã được thăng hạng theo 3 quy tắc trên, kiểu dữ liệu của biểu thức kết quả sẽ chính là kiểu của các toán hạng đã được thăng hạng.

#### Bài tập ví dụ tổng hợp từ sách:
```java
short a = 14;
float b = 13;
double c = 30;
var result = a * b / c;
```
* **Hỏi: Kiểu dữ liệu của `result` là gì?**
  1. `a` là `short`, gặp phép nhân `*` $\rightarrow$ Quy tắc 3: `a` thăng hạng lên `int`.
  2. Phép tính `a * b` là `int * float` $\rightarrow$ Quy tắc 2: `int` thăng hạng lên `float`. Kết quả của `a * b` là kiểu `float`.
  3. Biểu thức còn lại: `(float) / c`. Do `c` là `double`, theo Quy tắc 1: `float` thăng hạng lên `double`.
  4. Kết quả cuối cùng của `result` là kiểu `double`.

---

## 5. Toán Tử Gán (Assignment) & Cơ Chế Ép Kiểu (Casting)

### 5.1. Phép Gán Đơn Giản (`=`) & Chiều Đánh Giá
* Toán tử gán được đánh giá từ **Phải sang Trái**:
  ```java
  int x = 1, y = 2, z = 3;
  x = y = z = 10; // z thành 10 -> y thành 10 -> x thành 10
  ```
* Java cho phép tự động chuyển đổi từ kiểu nhỏ sang kiểu lớn hơn (*Widening Conversion*):
  ```java
  int a = 10;
  long b = a; // Tự động (implicit widening)
  ```
* Nhưng chuyển từ kiểu lớn về kiểu nhỏ hơn (*Narrowing Conversion*) **bắt buộc phải có cú pháp ép kiểu tường minh (Explicit Casting)**:
  ```java
  int x = 10;
  short y = x;        // ❌ LỖI BIÊN DỊCH
  short y = (short)x; // ✅ Hợp lệ
  ```

### 5.2. Hiện Tượng Tràn Số (Overflow & Underflow)
Khi bạn ép một số quá lớn vào một kiểu dữ liệu có giới hạn nhỏ hơn, Java sẽ cắt bỏ các bit bậc cao và gây ra hiện tượng tràn số:
```java
byte b = (byte) 130;
System.out.println(b); // In ra: -126 (bị tràn từ cực dương sang cực âm)
```
* Giá trị cực đại của `byte` là `127`. Khi gán `128` $\rightarrow$ thành `-128`; `129` $\rightarrow$ `-127`; `130` $\rightarrow$ `-126`.

### 5.3. Bẫy Ép Kiểu Phép Tính
Casting là một toán tử một ngôi có độ ưu tiên cao hơn phép nhân chia cộng trừ:
```java
short mouse = 10;
short hamster = 3;
short capybara = (short) mouse * hamster; // ❌ LỖI BIÊN DỊCH!
```
* **Lý do lỗi:** Dấu `(short)` chỉ áp dụng cho riêng biến `mouse` đứng cạnh nó. Sau khi `mouse` được ép kiểu xong, nó lại tham gia phép nhân `*` với `hamster`. Cả hai lại tự động thăng hạng lên `int` (Quy tắc 3). Kết quả trả về là `int`, không thể gán lại vào `short capybara`!
* **Cách sửa đúng:** Bọc ngoặc toàn bộ phép tính:
  ```java
  short capybara = (short)(mouse * hamster); // ✅ Hợp lệ
  ```

---

## 6. Toán Tử Gán Phức Hợp (Compound Assignment) & Ép Kiểu Ngầm Định

Java hỗ trợ các toán tử gán kết hợp: `+=`, `-=`, `*=`, `/=`, `%=`, v.v.

### 6.1. Quy Tắc Cơ Bản
* Biến bên trái **phải đã được khai báo trước**, không được dùng toán tử phức hợp để khai báo biến mới:
  ```java
  int a = 5;
  a += 3; // Tương đương a = a + 3 (a = 8)
  ```

### 6.2. Tính Năng "Tự Động Ép Kiểu" Của Compound Operator (Cực Kỳ Hay Thi)
> [!WARNING]
> Đây là điểm khác biệt cốt tử giữa phép gán thường và gán phức hợp:
> **Toán tử gán phức hợp sẽ TỰ ĐỘNG ÉP KIỂU kết quả về đúng kiểu của biến bên trái!**

Xét ví dụ kinh điển:
```java
long goat = 10;
int sheep = 5;

sheep = sheep * goat; // ❌ LỖI BIÊN DỊCH: sheep * goat ra long, không thể gán vào int sheep

sheep *= goat;        // ✅ BIÊN DỊCH THÀNH CÔNG!
```
* **Bản chất ngầm định:**
  `sheep *= goat;` được compiler tự động dịch tương đương thành:
  ```java
  sheep = (int)(sheep * goat);
  ```
  Nhờ đó code biên dịch bình thường mà không cần lập trình viên phải viết `(int)`.

### 6.3. Giá Trị Trả Về Của Phép Gán (Assignment Return Value)
Trong Java, bản thân **phép gán là một biểu thức có giá trị trả về**. Giá trị trả về chính là giá trị được gán cho biến bên trái:
```java
long wolf = 5;
long coyote = (wolf = 3);
System.out.println(wolf);   // 3
System.out.println(coyote); // 3
```

> ⚠️ **Bẫy thi nguy hiểm với kiểu boolean trong câu lệnh `if`:**
> ```java
> boolean healthy = false;
> if (healthy = true) { // ⚠️ Dấu = (phép gán), KHÔNG PHẢI dấu == (so sánh)
>     System.out.println("Good!");
> }
> ```
> * Lệnh này gán `true` cho `healthy`, sau đó toàn bộ biểu thức `(healthy = true)` trả về giá trị `true`.
> * Khối lệnh `if` sẽ luôn được thực thi và in ra `"Good!"`!

---

## 7. Toán Tử So Sánh (Relational & Equality) & Toán Tử `instanceof`

### 7.1. Toán Tử Quan Hệ (`<`, `<=`, `>`, `>=`)
* Chỉ áp dụng cho các kiểu dữ liệu **số nguyên và số thực** (`byte`, `short`, `char`, `int`, `long`, `float`, `double`).
* ❌ Không thể áp dụng cho `boolean` hay kiểu tham chiếu `Object` (`true < false` $\rightarrow$ Lỗi biên dịch).

### 7.2. Toán Tử So Sánh Bằng (`==`) & Khác Bằng (`!=`)
* **Với kiểu nguyên thủy:** So sánh **giá trị** thực sự của dữ liệu. Nếu khác kiểu, Java tự thăng hạng trước khi so sánh (`5 == 5.0` là `true`).
* **Với kiểu tham chiếu (Objects):** So sánh **địa chỉ ô nhớ (Memory Reference Equality)**. Trả về `true` khi và chỉ khi cả 2 biến cùng trỏ vào một đối tượng duy nhất trên Heap.
* **Quy tắc với `null`:**
  ```java
  System.out.println(null == null); // true
  ```

### 7.3. Toán Tử `instanceof`
Dùng để kiểm tra xem một đối tượng có thuộc về một Class/Interface cụ thể hay không:
```java
a instanceof B
```

* **4 Quy Tắc Cốt Lõi Khi Thi:**
  1. Nếu biến bên trái trỏ tới `null`, biểu thức `instanceof` **luôn luôn trả về `false`**:
     ```java
     System.out.println(null instanceof Object); // false
     String text = null;
     System.out.println(text instanceof String); // false
     ```
  2. Toán hạng bên phải **bắt buộc phải là tên một Class, Interface hoặc Type**, không được là `null`, không được là kiểu nguyên thủy:
     ```java
     x instanceof null; // ❌ LỖI BIÊN DỊCH
     x instanceof int;  // ❌ LỖI BIÊN DỊCH
     ```
  3. **Quy tắc tương thích kiểu (Compile-time Type Incompatibility):** Nếu trình biên dịch nhận thấy hai kiểu dữ liệu hoàn toàn không có mối quan hệ cha-con trong cây kế thừa thì sẽ báo **Lỗi biên dịch**:
     ```java
     Number time = 10;
     if (time instanceof String) // ❌ LỖI BIÊN DỊCH: Incompatible types (Number và String không cùng nhánh kế thừa)
     ```

---

## 8. Toán Tử Logic (`&`, `|`, `^`) vs Toán Tử Đoản Mạch (`&&`, `||`)

### 8.1. Bảng Chân Trị (Truth Table)
Áp dụng cho 2 toán hạng kiểu `boolean`:

| `a` | `b` | AND (`a & b`) | Inclusive OR (`a \| b`) | Exclusive OR / XOR (`a ^ b`) |
| :---: | :---: | :---: | :---: | :---: |
| `true` | `true` | **`true`** | **`true`** | `false` |
| `true` | `false`| `false` | **`true`** | **`true`** |
| `false`| `true` | `false` | **`true`** | **`true`** |
| `false`| `false`| `false` | `false` | `false` |

* **AND (`&`):** Chỉ `true` khi **cả hai cùng `true`**.
* **OR (`|`):** Chỉ `false` khi **cả hai cùng `false`**.
* **XOR (`^`):** Chỉ `true` khi **hai toán hạng có giá trị khác nhau**.

### 8.2. Sự Khác Biệt Giữa Logic (`&`, `|`) vs Đoản Mạch (`&&`, `||`)
* **Toán tử Logic thuần (`&`, `|`):** **LUÔN LUÔN đánh giá cả 2 vế** (trái và phải), bất kể vế trái là gì.
* **Toán tử Đoản Mạch (`&&`, `||` - Short-Circuit Operators):**
  * Với `&&`: Nếu vế trái là `false`, kết quả chắc chắn là `false` $\rightarrow$ **JVM dừng lại ngay, không thèm chạy vế phải!**
  * Với `||`: Nếu vế trái là `true`, kết quả chắc chắn là `true` $\rightarrow$ **JVM dừng lại ngay, không thèm chạy vế phải!**

### 8.3. Bẫy Tác Dụng Phụ Chưa Được Thực Thi (Unperformed Side Effects)
Trong đề thi OCP, Oracle rất thích lồng toán tử tăng giảm (`++`, `--`) vào vế bên phải của toán tử đoản mạch:

```java
int rabbit = 6;
boolean bunny = (rabbit >= 6) || (++rabbit <= 7);
System.out.println(rabbit); // In ra bao nhiêu?
```
* **Phân tích:**
  1. Vế trái: `rabbit >= 6` $\rightarrow$ `6 >= 6` là `true`.
  2. Vì toán tử là `||` (đoản mạch) và vế trái đã là `true`, JVM **bỏ qua hoàn toàn vế phải**!
  3. Lệnh `++rabbit` **không bao giờ được thực thi**.
  4. Kết quả in ra: `rabbit = 6` (không phải 7!).

---

## 9. Toán Tử Ba Ngôi (Ternary Operator `? :`)

### 9.1. Cú Pháp & Chiều Đánh Giá
```java
booleanExpression ? expression1 : expression2
```
* Nếu `booleanExpression` là `true` $\rightarrow$ thực thi và trả về giá trị của `expression1`.
* Nếu `booleanExpression` là `false` $\rightarrow$ thực thi và trả về giá trị của `expression2`.
* Đánh giá từ **Phải sang Trái**.

### 9.2. Tác Dụng Phụ Chưa Thực Thi Trong Toán Tử Ba Ngôi
Giống như toán tử đoản mạch, tại một thời điểm chạy **chỉ có 1 trong 2 nhánh `expression1` hoặc `expression2` được thực thi**:
```java
int sheep = 1;
int zzz = 1;
int sleep = (zzz < 10) ? sheep++ : zzz++;
System.out.println(sheep + "," + zzz); // In ra: 2,1 (zzz++ không hề chạy!)
```

### 9.3. Quy Tắc Tương Thích Kiểu Dữ Liệu
* **Khi gán vào một biến cụ thể:** Cả 2 nhánh phải có kiểu dữ liệu tương thích với biến nhận kết quả:
  ```java
  int food = (owl < 2) ? 3 : "Horse"; // ❌ LỖI BIÊN DỊCH: "Horse" là String không gán được cho int
  ```
* **Khi dùng trực tiếp trong lệnh in (không gán):** Hoàn toàn hợp lệ vì `System.out.print` nhận kiểu `Object`:
  ```java
  System.out.println((owl < 2) ? 3 : "Horse"); // ✅ Hợp lệ!
  ```

### 9.4. Toán Tử Ba Ngôi Lồng Nhau (Nested Ternary)
```java
int score = 85;
String grade = (score >= 90) ? "A" : (score >= 80) ? "B" : "C";
// grade = "B"
```
Khi gặp toán tử ba ngôi lồng nhau, hãy luôn bổ sung dấu ngoặc đơn `()` từ phải sang trái để tránh nhầm lẫn.

---

## 10. Tổng Hợp Bẫy Thi OCP Chapter 2 Cần Nhớ (Exam Essentials)

| # | Bẫy thi thường gặp | Kết quả / Cách nhận diện |
| :---: | :--- | :--- |
| **1** | Phép toán trên `short`, `byte`, `char` (ví dụ `short c = a + b;`) | **Lỗi biên dịch** vì chúng tự động bị nâng lên `int`. Bắt buộc phải cast: `(short)(a + b)`. |
| **2** | Compound Assignment (ví dụ `y += x;`) | **Luôn tự động ép kiểu ngầm định**, không bao giờ bị lỗi mất độ chính xác kiểu số. |
| **3** | Chia số nguyên cho 0 (`10 / 0`) vs Chia số thực cho 0 (`10.0 / 0`) | Số nguyên ném ngoại lệ `ArithmeticException`. Số thực in ra `Infinity` (không có lỗi). |
| **4** | Phép gán trong điều kiện `if` (ví dụ `if (flag = true)`) | Luôn gán giá trị và trả về `true` $\rightarrow$ Khối `if` luôn chạy! |
| **5** | Đảo bit `~x` | Áp dụng công thức phản xạ nhanh: `~x = -x - 1`. |
| **6** | Đoản mạch (`&&`, `||`) bỏ qua vế phải | Chú ý các biến có `++` hoặc `--` ở vế phải có thể không bao giờ được tăng/giảm. |
| **7** | `null instanceof Anything` | Luôn luôn trả về `false`. Không bao giờ quăng ngoại lệ `NullPointerException`. |
| **8** | `instanceof` với 2 kiểu không liên quan kế thừa | **Lỗi biên dịch** ngay tại compile time (ví dụ `Number instanceof String`). |
| **9** | Modulus số âm (`-7 % -5` và `7 % -5`) | Dấu của số chia bên phải bị bỏ qua. Dấu của kết quả lấy theo dấu của số bên trái: `-7 % -5 = -2`, `7 % -5 = 2`. |
| **10**| Thứ tự tiền tố `++x` vs hậu tố `x++` | Tiền tố: tăng ngay rồi mới dùng; Hậu tố: dùng giá trị cũ rồi mới tăng. |
