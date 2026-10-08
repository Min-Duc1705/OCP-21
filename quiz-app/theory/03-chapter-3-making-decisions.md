# Chương 3: Đưa Ra Quyết Định (Making Decisions) - OCP Java SE 21 (1Z0-830)

> **Tài liệu tham chiếu:** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Trang 224–292).  
> **Mục tiêu khảo thí:** Controlling Program Flow (if/else, switch statements & expressions, loops, break & continue, return); Pattern Matching with `instanceof` (Flow Scoping); Pattern Matching with `switch` (Java 21 JEP 441 - Type patterns, `when` guard clause, `case null`, Domination rules, Exhaustiveness).

---

## 📑 Mục Lục Chi Tiết

1. [Cấu Trúc Điều Kiện `if-else` & Bẫy Dangling Else](#1-cấu-trúc-điều-kiện-if-else--bẫy-dangling-else)
2. [Khớp Mẫu Với `instanceof` (Pattern Matching with `instanceof`)](#2-khớp-mẫu-với-instanceof-pattern-matching-with-instanceof)
   * 2.1. Bản chất & Cấu trúc của Khớp Mẫu
   * 2.2. Cơ chế Phạm Vi Luồng (Flow Scoping)
   * 2.3. Bẫy toán tử `&&` vs `||`
   * 2.4. Kỹ thuật Đảo Ngược Phạm Vi (Inverted Scoping)
   * 2.5. Bẫy kiểm tra kiểu thừa thãi (Subtype / Supertype)
3. [Câu Lệnh `switch` Truyền Thống vs Biểu Thức `switch` Hiện Đại](#3-câu-lệnh-switch-truyền-thống-vs-biểu-thức-switch-hiện-đại)
   * 3.1. Các kiểu dữ liệu được `switch` hỗ trợ
   * 3.2. Yêu cầu hằng số biên dịch (Compile-time Constants) trong `case`
   * 3.3. Switch Statement (`:`) vs Switch Expression (`->`)
   * 3.4. Từ khóa `yield` trong Switch Expression
   * 3.5. Tính Vét Cạn (Exhaustiveness)
4. [Khớp Mẫu Với `switch` Trong Java 21 (Pattern Matching for `switch` - JEP 441)](#4-khớp-mẫu-với-switch-trong-java-21-pattern-matching-for-switch---jep-441)
   * 4.1. Mẫu kiểu dữ liệu (Type Patterns)
   * 4.2. Mệnh đề bảo vệ với `when` (Guarded Patterns)
   * 4.3. Xử lý giá trị `null` (`case null` & `case null, default`)
   * 4.4. Quy Tắc Thống Trị (Domination Rules & Unreachable Code)
5. [Vòng Lặp `while` & `do-while`](#5-vòng-lặp-while--do-while)
   * 5.1. Cú pháp & Sự khác biệt cốt tử
   * 5.2. Bẫy mã không thể chạm tới (`while(false)`)
6. [Vòng Lặp `for` Cơ Bản & `for-each` Nâng Cao](#6-vòng-lặp-for-cơ-bản--for-each-nâng-cao)
   * 6.1. Cấu trúc 3 phần của `for` cơ bản & Quy tắc khai báo biến
   * 6.2. Vòng lặp nâng cao `for-each` (Enhanced for) & Bẫy `Iterable`
7. [Rẽ Nhánh Luồng: Nhãn (Labels), `break`, `continue`, `return`](#7-rẽ-nhánh-luồng-nhãn-labels-break-continue-return)
   * 7.1. Đặt nhãn cho câu lệnh (Labeled Statements)
   * 7.2. So sánh `break` vs `continue` (Có nhãn và Không nhãn)
   * 7.3. Bẫy Unreachable Code sau lệnh rẽ nhánh
8. [Bảng Tổng Hợp 12 Bẫy Thi OCP Chapter 3 Cần Nhớ (Exam Essentials)](#8-bảng-tổng-hợp-12-bẫy-thi-ocp-chapter-3-cần-nhớ-exam-essentials)

---

## 1. Cấu Trúc Điều Kiện `if-else` & Bẫy Dangling Else

### 1.1. Cú pháp cơ bản & Câu lệnh đơn vs Khối lệnh `{}`
* Biểu thức điều kiện trong `if(...)` **bắt buộc phải có kiểu trả về là `boolean`**. Không chấp nhận số nguyên (như `if (1)` trong C/C++ là lỗi biên dịch).
* Nếu không có dấu ngoặc nhọn `{}` bao bọc, câu lệnh `if` hoặc `else` chỉ kiểm soát **đúng duy nhất một câu lệnh đơn tiếp theo**:
  ```java
  int score = 4;
  if (score > 5)
      System.out.println("Pass");
      System.out.println("Good job"); // ⚠️ Dòng này NẰM NGOÀI if, LUÔN LUÔN ĐƯỢC CHẠY!
  ```

### 1.2. Bẫy Dangling Else (Nhầm lẫn nhánh `else`)
Khi có nhiều `if` lồng nhau mà không dùng dấu ngoặc nhọn `{}`:
> [!IMPORTANT]
> **Quy tắc của Java:** Nhánh `else` luôn luôn được ghép nối với **câu lệnh `if` gần nó nhất mà chưa có `else`**. Việc thụt đầu dòng (indentation) hoàn toàn bị trình biên dịch bỏ qua!

```java
int x = 10, y = 5;
if (x > 15)
    if (y > 2)
        System.out.println("A");
else
    System.out.println("B"); // ⚠️ Else này thuộc về if (y > 2), KHÔNG PHẢI if (x > 15)!
```
* **Phân tích:** Do `x > 15` là `false`, toàn bộ khối bên trong (gồm cả `if (y > 2)` và `else`) bị bỏ qua. Chương trình **không in ra bất kỳ chữ nào**!

---

## 2. Khớp Mẫu Với `instanceof` (Pattern Matching with `instanceof`)

Tính năng Khớp mẫu (Pattern Matching) được đưa vào chính thức từ Java 16, giúp loại bỏ hoàn toàn việc phải ép kiểu thủ công sau khi kiểm tra `instanceof`.

### 2.1. Bản chất & Cấu trúc của Khớp Mẫu
* **Cách viết truyền thống (Trước Java 16):**
  ```java
  void compare(Number number) {
      if (number instanceof Integer) {
          Integer data = (Integer) number; // Phải ép kiểu thủ công dư thừa!
          System.out.println(data.intValue());
      }
  }
  ```
* **Cách viết hiện đại với Khớp Mẫu:**
  ```java
  void compare(Number number) {
      if (number instanceof Integer data) {
          // 'data' được tự động tạo và ép kiểu thành Integer
          System.out.println(data.intValue());
      }
  }
  ```
  * `number`: Biến mục tiêu (*Target variable*).
  * `Integer`: Vị từ kiểu (*Type pattern predicate*).
  * `data`: Biến mẫu (*Pattern variable*). Có thể thêm `final` (`instanceof final Integer data`).

---

### 2.2. Cơ Chế Phạm Vi Luồng (Flow Scoping)
> [!NOTE]
> Không giống như các biến cục bộ thông thường có phạm vi gắn liền với khối ngoặc nhọn `{}` bao quanh, **biến mẫu (pattern variable) sử dụng cơ chế Flow Scoping** — phạm vi của biến phụ thuộc vào việc trình biên dịch có xác định được biến đó **chắc chắn khớp kiểu (definitely matched)** tại dòng code đó hay không.

* Biến `data` **chỉ tồn tại** bên trong nhánh mà điều kiện `instanceof` trả về `true`.
* Trong nhánh `else`, `data` **hoàn toàn không tồn tại**:
  ```java
  if (number instanceof Integer data) {
      System.out.println(data); // ✅ data in scope
  } else {
      System.out.println(data); // ❌ LỖI BIÊN DỊCH: cannot find symbol variable data
  }
  ```

---

### 2.3. Bẫy Toán Tử `&&` vs `||` Với Biến Mẫu
* **Với toán tử `&&`:**
  * Do cơ chế đoản mạch, nếu vế trái `true` thì vế phải mới được chạy. Khi đó, `data` chắc chắn đã được gán giá trị hợp lệ.
  * Do đó, **được phép sử dụng `data` ngay ở vế phải của `&&`**:
    ```java
    if (number instanceof Integer data && data.compareTo(5) > 0) { // ✅ HỢP LỆ!
        System.out.println(data);
    }
    ```
* **Với toán tử `||`:**
  * Nếu vế trái là `false`, Java sẽ chạy vế phải. Nhưng khi vế trái `false`, tức là `number` **không phải `Integer`**, `data` không tồn tại!
  * Do đó, **CẤM TUYỆT ĐỐI sử dụng `data` ở vế phải của `||`**:
    ```java
    if (number instanceof Integer data || data.compareTo(5) > 0) { // ❌ LỖI BIÊN DỊCH!
        // ...
    }
    ```

---

### 2.4. Kỹ Thuật Đảo Ngược Phạm Vi (Inverted Scoping)
Đây là câu hỏi rất hay xuất hiện trong đề thi OCP:

```java
public void printOnlyIntegers(Number number) {
    if (!(number instanceof Integer data))
        return; // Nếu KHÔNG PHẢI Integer thì thoát hàm ngay
    
    // Xuống được đến đây thì number CHẮC CHẮN LÀ Integer!
    System.out.println(data.intValue()); // ✅ BIÊN DỊCH HOÀN TOÀN HỢP LỆ!
}
```
* **Tại sao hợp lệ?** Vì nếu điều kiện `!(number instanceof Integer data)` là `true` (tức là không khớp), hàm đã bị `return` kết thúc ngay lập tức. Do đó, bất kỳ dòng code nào chạy bên dưới lệnh `if` này đều đảm bảo `data` đã khớp kiểu thành công, phạm vi của `data` kéo dài đến hết hàm!

---

### 2.5. Bẫy Kiểm Tra Kiểu Thừa Thãi (Redundant Pattern Matching)
Trong Pattern Matching, trình biên dịch **cấm kiểm tra nếu kiểu của biến đã chắc chắn là kiểu đó hoặc là lớp con của kiểu đó**:
```java
Integer value = 123;
if (value instanceof Integer data) {} // ❌ LỖI BIÊN DỊCH: expression type Integer is a subtype of pattern type Integer
if (value instanceof Number data) {}  // ❌ LỖI BIÊN DỊCH: value chắc chắn là Number rồi!
```
* Trình biên dịch yêu cầu biểu thức bên trái phải có khả năng thuộc kiểu khác (ví dụ `Object obj` hoặc `Number num`), không cho phép pattern matching thừa thãi.

---

## 3. Câu Lệnh `switch` Truyền Thống vs Biểu Thức `switch` Hiện Đại

### 3.1. Các Kiểu Dữ Liệu Được `switch` Hỗ Trợ

* **Trong cú pháp `switch` truyền thống (không dùng Pattern Matching):**
  * Kiểu số nguyên nhỏ: `byte`, `short`, `char`, `int`.
  * Các lớp Wrapper tương ứng: `Byte`, `Short`, `Character`, `Integer`.
  * Kiểu chuỗi: `String`.
  * Kiểu liệt kê: `enum`.
  * Biến `var` (nếu suy luận ra một trong các kiểu trên).
  * ❌ **CẤM dùng:** `boolean`, `long`, `float`, `double` (trừ khi dùng Pattern Matching trong Java 21).

---

### 3.2. Yêu Cầu Hằng Số Biên Dịch (Compile-Time Constants) Trong `case`
Trong `switch` truyền thống, giá trị sau từ khóa `case` **bắt buộc phải là hằng số xác định tại thời điểm biên dịch (Compile-time Constant)**:
```java
final int a = 10;          // Hằng số biên dịch hợp lệ
final int b; b = 20;       // ❌ KHÔNG PHẢI hằng số biên dịch (khởi tạo sau)
int c = 30;                // ❌ Không có final, không phải hằng số

switch (x) {
    case a: // ✅ Hợp lệ
    case b: // ❌ LỖI BIÊN DỊCH: constant expression required
    case c: // ❌ LỖI BIÊN DỊCH: constant expression required
}
```

#### Quy tắc với `enum` trong `case`:
Khi switch trên một biến `enum`, nhãn `case` **chỉ được ghi tên hằng số enum (unqualified name)**, cấm ghi kèm tên enum:
```java
Season s = Season.SUMMER;
switch (s) {
    case SUMMER:        // ✅ Hợp lệ
    case Season.WINTER: // ❌ LỖI BIÊN DỊCH: an enum switch case label must be the unqualified name of an enumeration constant
}
```

---

### 3.3. So Sánh Switch Statement (`:`) vs Switch Expression (`->`)

| Đặc điểm | Switch Statement truyền thống | Switch Expression hiện đại |
| :--- | :--- | :--- |
| **Ký hiệu nhãn** | Dấu hai chấm `:` (ví dụ `case 1:`) | Mũi tên `->` (ví dụ `case 1 ->`) |
| **Cơ chế Fall-through** | **Có!** Nếu không có `break`, code sẽ trôi tuột xuống các case bên dưới. | **Không bao giờ có fall-through!** Chỉ thực thi đúng nhánh khớp. |
| **Gom nhóm giá trị** | Xếp chồng `case 1: case 2:` | Dùng dấu phẩy: `case 1, 2, 3 ->` |
| **Trả về giá trị** | Không trả về giá trị (là câu lệnh) | **Có thể gán vào biến** (`var x = switch...`) |
| **Dấu chấm phẩy kết thúc**| Không cần sau dấu `}` đóng switch | **Bắt buộc có dấu `;` sau dấu `}`** khi gán biểu thức |
| **Tính vét cạn** | Không bắt buộc | **Bắt buộc phải vét cạn (Exhaustive)** |

---

### 3.4. Từ Khóa `yield` Trong Switch Expression
Khi một nhánh của Switch Expression mũi tên `->` cần thực hiện nhiều câu lệnh phức tạp trong một khối ngoặc nhọn `{ ... }`, ta dùng từ khóa **`yield`** để trả về giá trị:

```java
int measurement = 10;
int size = switch (measurement) {
    case 5  -> 1;
    case 10 -> {
        System.out.println("Calculating...");
        yield 2; // 👈 Trả về giá trị 2 cho biến size
    }
    default -> 0;
}; // 👈 Bắt buộc có dấu chấm phẩy ở đây!
```
* ⚠️ **Lưu ý thi cử:** Trong khối `{}` của switch expression, **cấm dùng từ khóa `return`** để trả về giá trị cho switch (từ khóa `return` sẽ thoát luôn phương thức bên ngoài). Bạn bắt buộc phải dùng `yield`.

---

### 3.5. Tính Vét Cạn (Exhaustiveness)
Mọi **Switch Expression** (biểu thức trả về giá trị) bắt buộc phải bao quát được tất cả các trường hợp có thể xảy ra:
1. Thêm nhánh `default`.
2. Hoặc bao phủ toàn bộ các giá trị của một `enum`.
3. Hoặc bao phủ toàn bộ các lớp con cho phép của một `sealed class/interface` (sẽ học chi tiết ở Chapter 7).

---

## 4. Khớp Mẫu Với `switch` Trong Java 21 (Pattern Matching for `switch` - JEP 441)

> [!IMPORTANT]
> Đây là tính năng mới và là trọng tâm khảo thí lớn nhất của kỳ thi **OCP Java SE 21 (1Z0-830)**.

Từ Java 21, `switch` có thể nhận **bất kỳ đối tượng nào** và khớp theo kiểu dữ liệu (*Type Pattern*) cùng điều kiện bảo vệ (*Guarded Pattern*).

### 4.1. Mẫu Kiểu Dữ Liệu (Type Patterns)
```java
void printType(Object obj) {
    String type = switch (obj) {
        case Integer i   -> "Số nguyên: " + i;
        case String s    -> "Chuỗi ký tự: " + s.toUpperCase();
        case Long l      -> "Số nguyên lớn: " + l;
        default          -> "Kiểu dữ liệu khác";
    };
    System.out.println(type);
}
```

---

### 4.2. Mệnh Đề Bảo Vệ Với `when` (Guarded Patterns)
Java 21 bổ sung từ khóa ngữ cảnh **`when`** đi kèm sau kiểu dữ liệu để kiểm tra điều kiện logic bổ sung:

```java
void checkNumber(Number n) {
    switch (n) {
        case Integer i when i < 0  -> System.out.println("Số nguyên âm");
        case Integer i when i == 0 -> System.out.println("Số không");
        case Integer i             -> System.out.println("Số nguyên dương: " + i);
        case Double d when d > 100.0 -> System.out.println("Số thực lớn");
        default                    -> System.out.println("Số khác");
    }
}
```

---

### 4.3. Xử Lý Giá Trị `null` Trong Switch (`case null`)
* **Trong Java truyền thống (Java 17 trở về trước):** Nếu biến truyền vào `switch` có giá trị `null`, chương trình lập tức ném ra ngoại lệ `NullPointerException` ngay tại dòng `switch (...)`, kể cả khi có nhánh `default`.
* **Trong Java 21:** Bạn có thể bắt trực tiếp giá trị `null` bằng:
  1. `case null -> "Bị rỗng";`
  2. Hoặc gộp chung: `case null, default -> "Không xác định hoặc rỗng";`

> ⚠️ **Quy tắc thi cử:** Bất cứ khi nào từ khóa `case null` xuất hiện trong `switch`, câu lệnh switch đó được tính là **sử dụng Pattern Matching**, và toàn bộ quy tắc về thứ tự thống trị sẽ được áp dụng!

---

### 4.4. Quy Tắc Thống Trị (Domination Rules & Unreachable Code)

> [!WARNING]
> Trình biên dịch Java 21 sẽ báo lỗi **`error: this case label is dominated by a preceding case label`** nếu một `case` đứng sau đã bị một `case` hoặc `default` đứng trước bao quát hoàn toàn!

#### 3 Quy tắc Thống trị bắt buộc phải nhớ:

1. **Lớp cha thống trị Lớp con (Subtype Domination):**
   * Mẫu lớp con phải luôn đứng **trước** mẫu lớp cha:
   ```java
   switch (obj) {
       case CharSequence cs -> ... // ❌ Bao quát toàn bộ String!
       case String s       -> ... // ❌ LỖI BIÊN DỊCH: dominated by preceding case label
   }
   ```
2. **Mẫu không điều kiện thống trị Mẫu có bảo vệ `when`:**
   * Mẫu có `when` phải đứng **trước** mẫu không có `when`:
   ```java
   switch (obj) {
       case Integer i             -> ... // ❌ Đã tóm gọn mọi Integer!
       case Integer i when i > 10 -> ... // ❌ LỖI BIÊN DỊCH: case này không bao giờ chạm tới được
   }
   ```
3. **`default` thống trị `case null` nếu đặt trước nó:**
   * Nếu có cả `default` và `case null`, thì `case null` **bắt buộc phải đặt trước `default`**:
   ```java
   switch (obj) {
       default   -> System.out.println("Default");
       case null -> System.out.println("Null"); // ❌ LỖI BIÊN DỊCH: dominated by default!
   }
   ```
   *(Đây chính là câu hỏi số 1 trong bài thi Assessment Test mà chúng ta đã giải đáp!)*

---

## 5. Vòng Lặp `while` & `do-while`

### 5.1. Cú pháp & Sự khác biệt cốt tử
* **`while` loop:** Kiểm tra điều kiện trước. Nếu điều kiện `false` ngay từ đầu, vòng lặp **không chạy lần nào**.
* **`do-while` loop:** Thực thi thân vòng lặp trước rồi mới kiểm tra điều kiện. **Luôn luôn chạy ít nhất 1 lần!**
* ⚠️ **Cú pháp:** Vòng lặp `do-while` **bắt buộc phải có dấu chấm phẩy `;`** sau biểu thức `while(...)`:
  ```java
  do {
      x++;
  } while (x < 10); // 👈 Bắt buộc có dấu ; ở đây!
  ```

### 5.2. Bẫy Mã Không Thể Chạm Tới (`while(false)`)
Java compiler có cơ chế phân tích luồng điều khiển cực kỳ nghiêm ngặt:

```java
// Trường hợp 1: Dùng hằng số literal trực tiếp
while (false) {
    System.out.println("Never reach"); // ❌ LỖI BIÊN DỊCH: unreachable statement
}

// Trường hợp 2: Dùng biến boolean thông thường
boolean keepRunning = false;
while (keepRunning) {
    System.out.println("Never reach"); // ✅ BIÊN DỊCH THÀNH CÔNG!
}
```
* **Tại sao trường hợp 2 lại biên dịch được?** Vì `keepRunning` là một biến (variable), trình biên dịch coi rằng giá trị của nó có thể bị thay đổi bởi luồng khác hoặc lúc runtime, nên không đánh dấu code bên trong là unreachable.

---

## 6. Vòng Lặp `for` Cơ Bản & `for-each` Nâng Cao

### 6.1. Cấu Trúc 3 Phần Của `for` Cơ Bản
```java
for (khởi_tạo; điều_kiện_lặp; bước_nhảy) {
    // thân vòng lặp
}
```

* **Quy tắc thi cử:**
  1. Cả 3 phần đều là **tùy chọn (optional)**. Vòng lặp vô hạn hợp lệ ngắn nhất là:
     ```java
     for ( ; ; ) { } // Hợp lệ, lặp vô tận
     ```
  2. **Khai báo nhiều biến trong phần khởi tạo:** Các biến phải **cùng một kiểu dữ liệu** và ngăn cách bằng dấu phẩy:
     ```java
     for (int i = 0, j = 10; i < j; i++, j--) {} // ✅ Hợp lệ
     for (int i = 0, long j = 10; i < 5; i++) {} // ❌ LỖI BIÊN DỊCH: không được khai báo 2 kiểu khác nhau
     ```
  3. **Tái khai báo biến đã tồn tại:**
     ```java
     int x = 0;
     for (int x = 0; x < 5; x++) {} // ❌ LỖI BIÊN DỊCH: variable x is already defined
     ```
  4. Biến khai báo trong phần đầu của `for` sẽ **hết phạm vi (out of scope)** ngay khi vòng lặp kết thúc:
     ```java
     for (int i = 0; i < 5; i++) {}
     System.out.println(i); // ❌ LỖI BIÊN DỊCH: cannot find symbol variable i
     ```

---

### 6.2. Vòng Lặp Nâng Cao `for-each` (Enhanced for loop)
```java
for (Datatype variable : targetCollectionOrArray)
```

* **Điều kiện bắt buộc của `targetCollectionOrArray`:**
  Toán hạng bên phải dấu `:` **bắt buộc phải là một Mảng (Array)** hoặc một Đối tượng cài đặt interface **`java.lang.Iterable`** (ví dụ: `List`, `Set`...).
* ⚠️ **Bẫy thi cực kỳ phổ biến:** Kiểu `String` **KHÔNG cài đặt interface `Iterable`**:
  ```java
  String name = "Java";
  for (char c : name) {} // ❌ LỖI BIÊN DỊCH: foreach not applicable to type java.lang.String
  
  // Sửa đúng:
  for (char c : name.toCharArray()) {} // ✅ Hợp lệ (vì trả về mảng char[])
  ```

---

## 7. Rẽ Nhánh Luồng: Nhãn (Labels), `break`, `continue`, `return`

### 7.1. Đặt Nhãn Cho Câu Lệnh (Labeled Statements)
* Nhãn là một định danh hợp lệ theo sau bởi dấu hai chấm `:` đặt trước một câu lệnh hoặc khối lệnh:
  ```java
  OUTER_LOOP: for (int i = 0; i < 5; i++) {
      INNER_LOOP: for (int j = 0; j < 5; j++) {
          // ...
      }
  }
  ```
* Bất kỳ khối lệnh nào trong Java cũng có thể gắn nhãn (kể cả khối `{}` đơn lẻ hoặc câu lệnh `if`), nhưng trong thực tế nhãn chủ yếu được dùng với vòng lặp.

---

### 7.2. So Sánh `break` vs `continue`

| Tiêu chí | `break` | `continue` |
| :--- | :--- | :--- |
| **Vị trí cho phép** | Bên trong vòng lặp (`for`, `while`, `do-while`) hoặc `switch`. | **CHỈ được phép nằm trong vòng lặp** (`for`, `while`, `do-while`). Không dùng được trong `switch` độc lập! |
| **Không có nhãn** | Thoát khỏi vòng lặp hoặc `switch` **trong cùng gần nhất**. | Bỏ qua phần còn lại của lần lặp hiện tại, nhảy đến lần lặp tiếp theo của vòng lặp **trong cùng**. |
| **Có nhãn (`LABEL;`)**| Thoát hoàn toàn khỏi cấu trúc vòng lặp/khối lệnh mang nhãn đó. | Bỏ qua phần còn lại và nhảy sang bước tiếp theo của vòng lặp mang nhãn đó. |

#### Bài toán phân tích luồng chạy (Exam Walkthrough):
```java
int count = 0;
ROW_LOOP: for (int row = 1; row <= 3; row++) {
    for (int col = 1; col <= 2; col++) {
        if (row * col % 2 == 0) continue ROW_LOOP;
        count++;
    }
}
System.out.println(count);
```
* **Diễn giải luồng chạy:**
  1. `row = 1, col = 1`: `1 * 1 % 2 == 0` là `false` $\rightarrow$ `count++` thành **1**.
  2. `row = 1, col = 2`: `1 * 2 % 2 == 0` là `true` $\rightarrow$ `continue ROW_LOOP` $\rightarrow$ Ngắt ngay vòng lặp `col`, nhảy thẳng sang `row = 2`.
  3. `row = 2, col = 1`: `2 * 1 % 2 == 0` là `true` $\rightarrow$ `continue ROW_LOOP` $\rightarrow$ Nhảy sang `row = 3`.
  4. `row = 3, col = 1`: `3 * 1 % 2 == 0` là `false` $\rightarrow$ `count++` thành **2**.
  5. `row = 3, col = 2`: `3 * 2 % 2 == 0` là `true` $\rightarrow$ `continue ROW_LOOP` $\rightarrow$ Kết thúc `row = 3`.
  * **Kết quả in ra:** `count = 2`.

---

### 7.3. Bẫy Unreachable Code Sau Lệnh Rẽ Nhánh
Bất kỳ dòng lệnh nào đặt ngay sau một lệnh `break`, `continue`, `return`, hoặc `throw` vô điều kiện bên trong cùng một khối lệnh đều khiến trình biên dịch báo lỗi:

```java
int check = 5;
while (check < 10) {
    break;
    check++; // ❌ LỖI BIÊN DỊCH: unreachable statement!
}
```

---

## 8. Bảng Tổng Hợp 12 Bẫy Thi OCP Chapter 3 Cần Nhớ (Exam Essentials)

| # | Bẫy thi thường gặp | Kết quả / Cách nhận diện |
| :---: | :--- | :--- |
| **1** | Mệnh đề `if (x = 5)` hoặc `if (flag = true)` | Dấu `=` là phép gán. `if (int)` báo lỗi biên dịch; `if (boolean)` luôn chạy nhánh `true`! |
| **2** | Dangling else không có `{}` | Nhánh `else` luôn gắn với `if` gần nó nhất phía trên. |
| **3** | Dùng biến mẫu ở vế phải của toán tử `\|\|` | **Lỗi biên dịch** vì khi vế trái `false`, biến mẫu chưa được khởi tạo. |
| **4** | Đảo ngược phạm vi: `if (!(x instanceof String s)) return; s.length();` | **Hợp lệ hoàn toàn** vì luồng code bên dưới đảm bảo `s` đã được khởi tạo. |
| **5** | Switch Expression trả về giá trị mà thiếu dấu chấm phẩy `;` ở cuối | **Lỗi biên dịch**: `var x = switch(...) { ... };` bắt buộc có dấu `;`. |
| **6** | Dùng từ khóa `return` bên trong khối `{}` của switch expression | **Lỗi biên dịch**: Bắt buộc phải dùng `yield` để trả về giá trị. |
| **7** | Không bảo đảm tính vét cạn (Exhaustiveness) cho switch expression | **Lỗi biên dịch**: Switch expression bắt buộc phải bao quát hết mọi giá trị (thường cần `default`). |
| **8** | Đặt `default` đứng trước `case null` trong switch Java 21 | **Lỗi biên dịch**: `default` thống trị `case null` khiến `case null` không thể chạm tới. |
| **9** | Đặt mẫu lớp cha đứng trước mẫu lớp con trong switch Java 21 | **Lỗi biên dịch**: Mẫu lớp cha thống trị lớp con (`CharSequence` dominate `String`). |
| **10**| Đặt mẫu không có `when` đứng trước mẫu có `when` | **Lỗi biên dịch**: Mẫu không điều kiện tóm hết dữ liệu, khiến mẫu có `when` bị dominate. |
| **11**| Duyệt chuỗi bằng for-each: `for (char c : "str")` | **Lỗi biên dịch** vì `String` không cài đặt interface `Iterable`. |
| **12**| Khai báo nhiều kiểu khác nhau trong phần đầu vòng `for` | **Lỗi biên dịch**: `for (int i=0, long j=1; ...)` không được phép. |
