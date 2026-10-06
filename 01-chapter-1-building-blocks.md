# Chương 1: Khối Xây Dựng Cơ Bản (Building Blocks) - OCP Java SE 21 (1Z0-830)

> **Tài liệu tham chiếu:** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff.  
> **Mục tiêu khảo thí:** Handling Date, Time, Text, Numeric, and Boolean Values; Java Environment; Structure of Java Class; Scope of Variables; Primitive vs Reference types; `var`; Garbage Collection.

---

## 📑 Mục Lục Chi Tiết

1. [Môi Trường Phát Triển & Tính Năng Single-File Source Code](#1-môi-trường-phát-triển--tính-năng-single-file-source-code)
2. [Cấu Trúc Lớp (Class Structure) & Quy Tắc File Source Code](#2-cấu-trúc-lớp-class-structure--quy-tắc-file-source-code)
3. [Phương Thức `main()` & Tham Số Dòng Lệnh (`args`)](#3-phương-thức-main--tham-số-dòng-lệnh-args)
4. [Khai Báo Package & Cơ Chế Import](#4-khai-báo-package--cơ-chế-import)
5. [Tạo Đối Tượng & Thứ Tự Khởi Tạo (Order of Initialization)](#5-tạo-đối-tượng--thứ-tự-khởi-tạo-order-of-initialization)
6. [Kiểu Dữ Liệu Nguyên Thủy (Primitives) & Hằng Số (Literals)](#6-kiểu-dữ-liệu-nguyên-thủy-primitives--hằng-số-literals)
7. [Chuỗi Khối Văn Bản Hiện Đại (Text Blocks)](#7-chuỗi-khối-văn-bản-hiện-đại-text-blocks)
8. [Khai Báo Biến & Quy Tắc Đặt Tên (Identifiers)](#8-khai-báo-biến--quy-tắc-đặt-tên-identifiers)
9. [Khởi Tạo Biến & Suy Luận Kiểu Cục Bộ với `var`](#9-khởi-tạo-biến--suy-luận-kiểu-cục-bộ-với-var)
10. [Quản Lý Phạm Vi Biến (Variable Scope)](#10-quản-lý-phạm-vi-biến-variable-scope)
11. [Vòng Đời Đối Tượng & Bộ Thu Dọn Rác (Garbage Collection)](#11-vòng-đời-đối-tượng--bộ-thu-dọn-rác-garbage-collection)
12. [Tổng Hợp Bẫy Thi OCP Cốt Lõi Cần Nhớ (Exam Essentials)](#12-tổng-hợp-bẫy-thi-ocp-cốt-lõi-cần-nhớ-exam-essentials)

---

## 1. Môi Trường Phát Triển & Tính Năng Single-File Source Code

### 1.1. JDK vs JRE trong kỷ nguyên mới
* **JDK (Java Development Kit):** Cung cấp đầy đủ công cụ để viết, biên dịch (`javac`), chạy (`java`), đóng gói (`jar`), phân tích (`javap`, `jdeps`), và debug Java.
* **JRE (Java Runtime Environment):** Chỉ cung cấp môi trường thực thi (JVM + thư viện chuẩn).
* ⚠️ **Bẫy thi:** Kể từ **Java 11**, Oracle **không còn cung cấp bản cài đặt JRE độc lập**. Nếu một câu hỏi trắc nghiệm phát biểu rằng *"Lập trình viên cần tải bản JRE riêng lẻ từ website của Oracle để chạy ứng dụng Java 21"* $\rightarrow$ **Sai hoàn toàn**.

### 1.2. Tính năng chạy file đơn trực tiếp (Single-File Source Code)
Từ Java 11+, bạn có thể chạy một file mã nguồn Java trực tiếp mà không cần dùng lệnh `javac` trước:
```bash
# Cách truyền thống (tạo ra file Zoo.class trên ổ đĩa):
javac Zoo.java
java Zoo Bronx Zoo

# Cách hiện đại (Single-file source code - KHÔNG sinh file .class trên đĩa):
java Zoo.java Bronx Zoo
```
* **Quy tắc thi:**
  1. Khi chạy file `.class` biên dịch sẵn: **không** kèm đuôi `.class` (`java Zoo`).
  2. Khi chạy mã nguồn trực tiếp: **bắt buộc** phải kèm đuôi `.java` (`java Zoo.java`).
  3. Lệnh này chỉ áp dụng cho chương trình gói gọn trong **1 file đơn**. Nếu chương trình phụ thuộc vào các file mã nguồn khác chưa biên dịch nằm ở thư mục khác, lệnh sẽ báo lỗi.

---

## 2. Cấu Trúc Lớp (Class Structure) & Quy Tắc File Source Code

Mọi chương trình Java đều được xây dựng từ các Class (hoặc Interface, Record, Enum). Class bao gồm hai thành phần cốt lõi:
1. **Fields (Trường dữ liệu):** Lưu giữ trạng thái (State).
2. **Methods (Phương thức):** Thực thi hành vi / logic (Behavior).

```java
public class Animal {
    // Field (Instance variable)
    String name;

    // Method
    public String getName() {
        return name;
    }
}
```

### 2.1. Các kiểu Comment trong Java
Java hỗ trợ 3 kiểu chú thích:
1. `// Chú thích một dòng (Single-line)`
2. `/* Chú thích nhiều dòng (Multiple-line) */`
3. `/** Chú thích Javadoc */`

> ⚠️ **Bẫy thi:** Comment nhiều dòng `/* ... */` **không được phép lồng nhau**:
> ```java
> /* Line 1
>    /* Nested comment */  // LỖI: dấu */ ở đây sẽ đóng luôn comment ngoài cùng!
>    Line 2 */             // Lỗi biên dịch: Line 2 */ nằm trơ trọi bên ngoài
> ```

### 2.2. Quy tắc khai báo lớp và đặt tên file `.java`
Trong một file mã nguồn `.java`:
* Có thể chứa **tối đa duy nhất một `public` class**.
* Nếu file có chứa một lớp `public`, thì **tên file phải trùng khớp hoàn toàn** với tên lớp `public` đó (phân biệt hoa thường - case-sensitive). Ví dụ: `public class Animal` phải lưu trong `Animal.java`.
* Một file có thể chứa **nhiều class không có từ khóa `public` (package-private)**.
* Một file **không bắt buộc phải có lớp `public` nào**. Khi đó, tên file có thể đặt tùy ý, không cần trùng tên bất kỳ class nào bên trong (ví dụ file `OtherName.java` chứa hai lớp `class Dog {}` và `class Cat {}` vẫn biên dịch hoàn toàn bình thường).

---

## 3. Phương Thức `main()` & Tham Số Dòng Lệnh (`args`)

Điểm khởi đầu thực thi của một ứng dụng Java độc lập là phương thức `main()`.

### 3.1. Chữ ký chuẩn của `main()`
```java
public static void main(String[] args)
```
Các quy tắc thi bắt buộc phải thuộc:
1. **Bắt buộc có `public`:** Nếu là `private`, `protected`, hoặc mặc định $\rightarrow$ Code biên dịch được nhưng khi chạy sẽ văng lỗi runtime: `Main method not found in class`.
2. **Bắt buộc có `static`:** JVM không cần tạo instance của class để gọi `main`.
3. **Bắt buộc có kiểu trả về `void`:** `main()` không được trả về `int` hay `boolean`.
4. **Tên phương thức bắt buộc là `main`** (chữ thường).
5. **Tham số mảng chuỗi:** Mảng chuỗi nhận đối số dòng lệnh. Các cách viết sau đây đều hoàn toàn tương đương và hợp lệ:
   * `String[] args` (chuẩn khuyến nghị)
   * `String args[]` (hợp lệ)
   * `String... args` (varargs - hoàn toàn hợp lệ)
   * Tên tham số không bắt buộc phải là `args`, có thể là `String[] options`, `String[] info`.
6. **Thứ tự bổ từ (Modifiers):** `public static` hoặc `static public` đều hợp lệ. Thậm chí có thể thêm `final`:
   ```java
   final public static void main(String... options) // ✅ Hoàn toàn hợp lệ!
   ```

### 3.2. Truy cập tham số dòng lệnh (`args`)
Giả sử ta thực thi lệnh:
```bash
java Zoo "San Diego Zoo" Bronx 100
```
* `args[0]` $\rightarrow$ `"San Diego Zoo"` (dấu ngoặc kép gom chuỗi có khoảng trắng thành 1 phần tử).
* `args[1]` $\rightarrow$ `"Bronx"`
* `args[2]` $\rightarrow$ `"100"` (kiểu `String`, không phải kiểu `int`!).
* `args.length` $\rightarrow$ `3`.

> ⚠️ **Bẫy thi cực kỳ phổ biến:**
> Nếu chạy `java Zoo` (không truyền tham số nào):
> * `args` **không bao giờ là `null`**!
> * `args` là một mảng rỗng: `args.length == 0`.
> * Việc truy cập `args[0]` sẽ ném ra ngoại lệ: `ArrayIndexOutOfBoundsException` tại runtime!

---

## 4. Khai Báo Package & Cơ Chế Import

### 4.1. Thứ tự khai báo trong 1 file mã nguồn
Mọi file Java phải tuân thủ nghiêm ngặt theo thứ tự **P - I - C**:
1. **P**ackage: Dòng đầu tiên (nếu có, tối đa 1 dòng).
2. **I**mport: Nằm sau `package` và trước `class` (nếu có, số lượng tùy ý).
3. **C**lass (hoặc Interface / Record / Enum): Khai báo lớp.

```java
// 1. Package (nếu có)
package zoo.animal;

// 2. Imports (nếu có)
import java.util.List;
import java.util.ArrayList;

// 3. Class definition
public class Lion {
    // code
}
```
* ❌ Đảo ngược thứ tự `import` trước `package` $\rightarrow$ **Compiler Error**.
* ❌ Khai báo field/method bên ngoài thân `class` $\rightarrow$ **Compiler Error**.

### 4.2. Cơ chế Wildcard (`*`)
* `import java.util.*;` $\rightarrow$ Import tất cả các class nằm trực tiếp trong package `java.util`.
* ⚠️ **Wildcard không import đệ quy các sub-package:**
  * `import java.util.*;` **KHÔNG** import các class trong `java.util.concurrent.*`. Muốn dùng `AtomicInteger`, bạn phải viết thêm `import java.util.concurrent.*;`.

### 4.3. Xung đột tên Class (Naming Conflicts)
Giả sử cả package `java.util` và `java.sql` đều có class `Date`:

* **Trường hợp 1: Hai lệnh import cụ thể trùng tên:**
  ```java
  import java.util.Date;
  import java.sql.Date; // ❌ LỖI BIÊN DỊCH: Date is already defined in a single-type import
  ```
* **Trường hợp 2: Một cụ thể, một Wildcard:**
  ```java
  import java.util.Date; // Ưu tiên cao nhất
  import java.sql.*;     // Wildcard ưu tiên thấp hơn
  
  public class Test {
      Date d; // ✅ Hiểu là java.util.Date!
  }
  ```
* **Trường hợp 3: Cả hai đều dùng Wildcard:**
  ```java
  import java.util.*;
  import java.sql.*;
  
  public class Test {
      Date d; // ❌ LỖI BIÊN DỊCH khi sử dụng: reference to Date is ambiguous
  }
  ```
  * *Cách giải quyết:* Dùng tên đầy đủ (Fully Qualified Class Name - FQCN):
    ```java
    java.util.Date d1 = new java.util.Date();
    java.sql.Date d2 = new java.sql.Date(1000L);
    ```

---

## 5. Tạo Đối Tượng & Thứ Tự Khởi Tạo (Order of Initialization)

### 5.1. Constructor (Hàm khởi tạo)
* Là phương thức đặc biệt dùng để tạo mới một đối tượng.
* **Quy tắc bắt buộc:**
  1. Tên constructor phải **trùng khớp 100%** với tên Class.
  2. **Không có kiểu trả về** (thậm chí không có cả `void`).

> ⚠️ **Bẫy thi kinh điển:**
> ```java
> public class Chicken {
>     public void Chicken() { } // ⚠️ ĐÂY LÀ METHOD, KHÔNG PHẢI CONSTRUCTOR!
> }
> ```
> Code trên hoàn toàn hợp lệ nhưng trình biên dịch xem nó là một method thông thường có tên là `Chicken`. Khi bạn gọi `new Chicken()`, Java sẽ gọi Default Constructor do compiler ngầm tạo ra, chứ **không** chạy method này!

### 5.2. Thứ tự khởi tạo của một Object (Rất hay thi!)
Khi một instance được tạo qua toán tử `new`:
1. **Fields và Instance Initializer blocks (`{ ... }`)** được thực thi theo đúng **thứ tự xuất hiện từ trên xuống dưới** trong mã nguồn.
2. **Constructor** được thực thi **sau cùng** (sau khi toàn bộ fields và khối initializer đã chạy xong).

```java
public class Egg {
    public Egg() {
        number = 5;
    }
    public static void main(String[] args) {
        Egg egg = new Egg();
        System.out.println(egg.number); // In ra: 5
    }
    private int number = 3;
    { number = 4; }
}
```
* **Diễn giải luồng chạy:**
  * Bước 1: `number` gán bằng `3`.
  * Bước 2: Khối initializer chạy, gán `number` bằng `4`.
  * Bước 3: Constructor `Egg()` chạy cuối cùng, gán `number` bằng `5`.
  * Kết quả in ra màn hình là `5`.

---

## 6. Kiểu Dữ Liệu Nguyên Thủy (Primitives) & Hằng Số (Literals)

Java có đúng **8 kiểu dữ liệu nguyên thủy**:

| Kiểu dữ liệu | Số bit | Giá trị mặc định (khi là field) | Miền giá trị | Ghi chú |
| :--- | :---: | :---: | :--- | :--- |
| `boolean` | JVM định nghĩa | `false` | `true` hoặc `false` | Không thể cast sang số |
| `byte` | 8 | `0` | `-128` đến `127` | |
| `short` | 16 | `0` | `-32,768` đến `32,767` | |
| `int` | 32 | `0` | `-2^31` đến `2^31 - 1` | Kiểu số nguyên mặc định |
| `long` | 64 | `0L` | `-2^63` đến `2^63 - 1` | Cần hậu tố `L` |
| `float` | 32 | `0.0f` | Số thực dấu phẩy động | Cần hậu tố `F` hoặc `f` |
| `double` | 64 | `0.0d` | Số thực độ chính xác kép | Kiểu số thực mặc định |
| `char` | 16 | `'\u0000'` | `0` đến `65,535` | Số nguyên không dấu, biểu diễn ký tự Unicode |

### 6.1. Hằng số số học & Các hệ cơ số
* **Hệ thập lục phân (Hexadecimal - cơ số 16):** Tiền tố `0x` hoặc `0X` (ví dụ: `0xFF` = 255).
* **Hệ bát phân (Octal - cơ số 8):** Tiền tố số `0` (ví dụ: `017` = 1*8 + 7 = 15).
* **Hệ nhị phân (Binary - cơ số 2):** Tiền tố `0b` hoặc `0B` (ví dụ: `0b1011` = 11).

### 6.2. Quy tắc dấu gạch dưới (`_`) trong số học (Underscore Rules)

> [!TIP]
> **Nguyên tắc vàng duy nhất:** Dấu gạch dưới `_` **CHỈ ĐƯỢC PHÉP ĐỨNG GIỮA HAI CHỮ SỐ** (*between two digits*) thuộc hệ cơ số tương ứng. Mọi vị trí khác đều không hợp lệ.

#### 1. Các vị trí BỊ CẤM (Compile Error & Bẫy thi OCP)
* ❌ **Đầu số:** `_100` $\rightarrow$ Trình biên dịch xem đây là tên biến/định danh (identifier), không phải số. Sẽ báo lỗi `cannot find symbol: variable _100`.
* ❌ **Cuối số:** `100_` $\rightarrow$ Lỗi biên dịch (`illegal underscore`).
* ❌ **Cạnh dấu chấm thập phân (`.`):** `3._14` hay `3_.14` $\rightarrow$ Lỗi biên dịch (vì `.` không phải chữ số).
* ❌ **Cạnh hậu tố chỉ kiểu (`L`, `F`, `D`):** `100_L` hay `2.5_F` $\rightarrow$ Lỗi biên dịch (vì ký tự hậu tố không phải chữ số).
* ❌ **Cạnh tiền tố hệ đếm (`0b`, `0x`):** `0b_10`, `0_b10`, `0x_52`, `0_x52` $\rightarrow$ Lỗi biên dịch (vì `b`, `x` không phải chữ số).
* ❌ **Cạnh ký hiệu số mũ khoa học (`e`, `E`):** `1_e2` hay `1e_2` $\rightarrow$ Lỗi biên dịch (vì `e`/`E` không phải chữ số).

#### 2. Các trường hợp HỢP LỆ đặc biệt (Rất hay xuất hiện trong đề thi)
* ✅ **Nhiều dấu `_` liên tiếp:** `1___000` $\rightarrow$ Hợp lệ (vì toàn bộ dấu `_` đều nằm giữa hai chữ số `1` và `0`).
* ✅ **Chữ số trong hệ Thập lục phân (A–F):** `0x1_F`, `0xCA_FE` $\rightarrow$ Hợp lệ (vì `A`–`F` chính là các chữ số hợp lệ của hệ 16).
* ✅ **Hệ bát phân (Octal):** `0_17` $\rightarrow$ **Hợp lệ** (in ra `15`). *Lưu ý:* `0` và `1` đều là chữ số, nên dấu `_` ở đây hoàn toàn hợp lệ, không bị lỗi như `0b_` hay `0x_`.


---

## 7. Chuỗi Khối Văn Bản Hiện Đại (Text Blocks)

Text Blocks (chuỗi nhiều dòng dùng `"""`) là tính năng chuẩn từ Java 15+:

```java
String eye = """
    "line 1"
    line 2
    """;
```

### 7.1. Quy tắc bắt buộc khi mở Text Block
* Dấu mở `"""` **bắt buộc phải có một ký tự xuống dòng (line break) ngay sau nó**.
* ❌ Viết code trên cùng dòng với `"""` mở là **lỗi biên dịch**:
  ```java
  String bad = """hello"""; // ❌ LỖI BIÊN DỊCH: illegal text block start: missing new line
  ```

### 7.2. Khoảng trắng bản chất (Essential) vs Khoảng trắng ngẫu nhiên (Incidental)
* Java tự động loại bỏ các khoảng trắng lề trái chung (incidental whitespace).
* Vị trí thụt lề của **dấu đóng `"""`** quyết định lề trái của toàn bộ khối văn bản:
  ```java
  String block = """
          doe
          deer
      """; // Dấu đóng thụt lề 4 space -> doe và deer sẽ có thêm 4 space ở đầu
  ```

### 7.3. Ký tự thoát đặc biệt trong Text Block
* `\` ở cuối dòng: **Hủy bỏ ký tự xuống dòng** (nối liền dòng kế tiếp vào dòng hiện tại).
* `\s`: **Bảo toàn khoảng trắng** (ngăn Java tự động trim khoảng trắng thừa ở cuối dòng).

---

## 8. Khai Báo Biến & Quy Tắc Đặt Tên (Identifiers)

### 8.1. Quy tắc đặt tên định danh hợp lệ
Tên của biến, phương thức, class phải tuân thủ:
1. Ký tự đầu tiên **bắt buộc** phải là: một chữ cái (Letter), ký tự `$`, hoặc dấu gạch dưới `_`.
2. Ký tự đầu tiên **không bao giờ được là chữ số** (`123name` ❌).
3. Các ký tự tiếp theo có thể chứa chữ cái, chữ số, `$`, hoặc `_`.
4. Không được trùng với **từ khóa dành riêng (reserved keywords)** của Java (`class`, `public`, `int`, `true`, `false`, `null`, `goto`, `const`...).
5. ⚠️ **Bẫy Java 9+:** Một dấu gạch dưới đơn lẻ `_` **không được phép làm tên biến** (đã trở thành reserved keyword).

| Tên biến | Hợp lệ? | Lý do |
| :--- | :---: | :--- |
| `_value` | ✅ | Bắt đầu bằng `_` |
| `$amount` | ✅ | Bắt đầu bằng `$` |
| `3DPoint` | ❌ | Bắt đầu bằng số |
| `my-var` | ❌ | Dấu `-` là toán tử trừ |
| `_` | ❌ | Dấu gạch dưới đơn lẻ bị cấm từ Java 9 |
| `Public` | ✅ | Phân biệt hoa thường (`Public` khác `public`) |

### 8.2. Khai báo nhiều biến trên một dòng
* Các biến cùng kiểu có thể khai báo cách nhau bằng dấu phẩy `,`:
  ```java
  int a = 1, b = 2; // ✅ Hợp lệ
  int c, d = 4;     // ✅ Hợp lệ, nhưng CHỈ CÓ d ĐƯỢC GÁN GIÁ TRỊ, c CHƯA KHỞI TẠO!
  ```
* ❌ Không được lặp lại kiểu dữ liệu:
  ```java
  int a, int b; // ❌ LỖI BIÊN DỊCH
  ```
* ❌ Không được khai báo nhiều kiểu khác nhau trong cùng một câu lệnh:
  ```java
  int a, boolean b; // ❌ LỖI BIÊN DỊCH
  ```

---

## 9. Khởi Tạo Biến & Suy Luận Kiểu Cục Bộ với `var`

### 9.1. Biến cục bộ (Local Variables) vs Biến thực thể (Instance Variables)
* **Instance variables / Static variables:**
  * Được JVM **tự động gán giá trị mặc định** ngay khi tạo đối tượng (`0`, `0.0`, `false`, `null`).
* **Local variables (Biến cục bộ trong hàm / block):**
  * **KHÔNG CÓ GIÁ TRỊ MẶC ĐỊNH**.
  * Phải được gán giá trị rõ ràng trước khi đọc/sử dụng. Nếu cố tình đọc một biến cục bộ chưa khởi tạo $\rightarrow$ **Lỗi biên dịch: variable might not have been initialized**.
  * Nếu khai báo mà không bao giờ dùng đến $\rightarrow$ Hoàn toàn hợp lệ, không bị lỗi.

### 9.2. Quy tắc bất biến khi dùng `var` (Local Variable Type Inference)
Từ Java 10+, từ khóa `var` cho phép compiler tự suy luận kiểu dữ liệu dựa trên giá trị khởi tạo.

* **7 Điều Cấm Kỵ với `var`:**
  1. `var` **chỉ dùng cho biến cục bộ** bên trong method, constructor, hoặc khối khởi tạo.
  2. ❌ Không dùng cho: thuộc tính class (instance/static fields), tham số method, kiểu trả về của method, hoặc tham số constructor.
  3. ❌ Không được khai báo mà không khởi tạo:
     ```java
     var x; // ❌ LỖI: cannot infer type for local variable x (không có giá trị để suy luận)
     ```
  4. ❌ Không được gán trực tiếp bằng `null`:
     ```java
     var x = null; // ❌ LỖI: cannot infer type
     ```
     *(Nhưng nếu đã có kiểu, gán `null` sau đó thì hợp lệ: `var s = "hi"; s = null;` ✅)*
  5. ❌ Không dùng `var` để khai báo nhiều biến bằng dấu phẩy:
     ```java
     var a = 1, b = 2; // ❌ LỖI BIÊN DỊCH
     ```
  6. Kiểu của `var` được **xác định tại thời điểm biên dịch và cố định**:
     ```java
     var count = 10; // count là int
     count = "ten";  // ❌ LỖI: incompatible types (String cannot be converted to int)
     ```
  7. ⚠️ `var` là một **reserved type name**, **KHÔNG PHẢI keyword**:
     ```java
     int var = 5; // ✅ Hoàn toàn hợp lệ! Tên biến có thể đặt là var
     ```

---

## 10. Quản Lý Phạm Vi Biến (Variable Scope)

1. **Local variables:** Bắt đầu từ dòng khai báo và kết thúc tại dấu đóng ngoặc nhọn `}` của khối lệnh chứa nó.
2. **Method parameters:** Có phạm vi trong toàn bộ thân phương thức.
3. **Instance variables:** Tồn tại cùng vòng đời của Object trên Heap.
4. **Class (`static`) variables:** Tồn tại trong suốt vòng đời của chương trình / ClassLoader.

### Hiện tượng Che Biến (Variable Shadowing)
* Trong Java, bạn **không thể** khai báo 2 biến cục bộ trùng tên trong cùng một phạm vi hoặc trong khối con lồng nhau:
  ```java
  public void test() {
      int x = 1;
      {
          int x = 2; // ❌ LỖI BIÊN DỊCH: variable x is already defined in method test()
      }
  }
  ```
* Nhưng biến cục bộ **có thể trùng tên với biến instance** (gọi là Shadowing):
  ```java
  public class Person {
      int age = 10;
      public void setAge(int age) { // 'age' ở đây che 'this.age'
          this.age = age;
      }
  }
  ```

---

## 11. Vòng Đời Đối Tượng & Bộ Thu Dọn Rác (Garbage Collection)

### 11.1. Bộ nhớ Stack vs Heap
* **Stack:** Lưu trữ các frame hàm, biến cục bộ nguyên thủy và địa chỉ tham chiếu (con trỏ). Stack tự động giải phóng khi kết thúc hàm.
* **Heap:** Vùng nhớ chứa tất cả **Đối tượng (Objects)** được tạo ra bằng `new`. Được quản lý bởi Garbage Collector.

### 11.2. Khi nào một đối tượng đủ điều kiện dọn rác (Eligible for GC)?
Một đối tượng trên Heap đủ điều kiện để GC thu hồi khi:
> **Không còn bất kỳ tham chiếu còn sống (reachable reference) nào trỏ tới nó.**

Có 2 cách phổ biến khiến object đủ điều kiện GC:
1. Tất cả biến tham chiếu trỏ đến nó bị gán thành `null` hoặc trỏ sang đối tượng khác.
2. Biến tham chiếu đi ra khỏi phạm vi (scope) khi hàm kết thúc.
3. **Đảo cô lập (Island of Isolation):** Hai đối tượng tham chiếu chéo lẫn nhau, nhưng không còn bất kỳ biến ngoài nào trỏ vào nhóm đó $\rightarrow$ Cả hai đều đủ điều kiện thu gom rác!

### 11.3. Phương thức `System.gc()`
* Lệnh `System.gc()` chỉ đóng vai trò là một **lời đề xuất (suggestion)** tới JVM.
* ⚠️ **Quy tắc thi:** `System.gc()` **không đảm bảo** rằng Garbage Collector sẽ chạy ngay lập tức hay thu dọn bất kỳ đối tượng nào.
* Phương thức `finalize()` đã bị đánh dấu **Deprecated for Removal** từ Java 18 và không còn được khuyến khích sử dụng.

---

## 12. Tổng Hợp Bẫy Thi OCP Cốt Lõi Cần Nhớ (Exam Essentials)

| # | Bẫy thường gặp trong đề thi | Kết quả / Cách nhận diện |
| :---: | :--- | :--- |
| **1** | Constructor có khai báo kiểu trả về (ví dụ `void MyClass()`) | Là **method**, không phải constructor! |
| **2** | Đổi chỗ `import` trước `package` | **Lỗi biên dịch** (thứ tự đúng: Package $\rightarrow$ Import $\rightarrow$ Class). |
| **3** | Hai file `.java` có nhiều hơn 1 class `public` | **Lỗi biên dịch** (tối đa 1 class `public` và phải trùng tên file). |
| **4** | Không truyền tham số dòng lệnh mà gọi `args[0]` | Ném ngoại lệ `ArrayIndexOutOfBoundsException` tại runtime. |
| **5** | Đọc biến cục bộ chưa khởi tạo giá trị | **Lỗi biên dịch** (`variable might not have been initialized`). |
| **6** | Dấu `_` đặt cạnh dấu chấm hoặc hậu tố số (`100_L`, `3._14`) | **Lỗi biên dịch** (vị trí đặt underscore không hợp lệ). |
| **7** | `var` gán trực tiếp bằng `null` (`var x = null;`) | **Lỗi biên dịch** (compiler không thể suy luận kiểu). |
| **8** | Dùng `var` cho instance field hoặc parameter | **Lỗi biên dịch** (`var` chỉ dùng cho biến cục bộ). |
| **9** | Đặt tên biến là `_` đơn lẻ | **Lỗi biên dịch** (`_` là từ khóa dành riêng từ Java 9). |
| **10** | Mở Text Block mà không xuống dòng ngay (`"""abc"""`) | **Lỗi biên dịch** (`missing newline after open quote`). |
| **11** | Bài toán đếm số lượng object đủ điều kiện GC tại dòng X | Vẽ sơ đồ tham chiếu: đếm số object trên Heap **mất toàn bộ liên kết** tới các biến tham chiếu còn sống. |
