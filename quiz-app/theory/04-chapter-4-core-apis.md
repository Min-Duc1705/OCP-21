# Chương 4: Core APIs (Các API Cốt Lõi)

> **Tài liệu tham khảo chính:** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff.  
> **Mục tiêu kỳ thi Oracle 1Z0-830:**
> * Sử dụng và thao tác trên chuỗi ký tự (`String`, `StringBuilder`, `Text Blocks`).
> * Phân biệt chính xác giữa so sánh đẳng thức đối tượng (`==`) và so sánh ngữ nghĩa (`equals()`), cơ chế String Pool và phương thức `intern()`.
> * Khai báo, khởi tạo, thao tác với mảng một chiều và đa chiều; sử dụng các phương thức tiện ích `Arrays.sort()`, `Arrays.binarySearch()`, `Arrays.compare()`, `Arrays.mismatch()`.
> * Sử dụng các API toán học `Math` và các kiểu dữ liệu số độ chính xác cao `BigInteger`, `BigDecimal`.
> * Khởi tạo, thao tác và tính toán ngày giờ (`LocalDate`, `LocalTime`, `LocalDateTime`, `ZonedDateTime`, `Instant`, `Period`, `Duration`), xử lý hiện tượng đổi giờ mùa hè (*Daylight Saving Time - DST*).

---

## 1. Tạo và Thao Tác Chuỗi (Creating and Manipulating Strings)

### 1.1. Bản Chất của Lớp `String`
* Trong Java, `String` là một chuỗi ký tự được bọc trong cặp nháy kép `""`.
* `String` là một **lớp bất biến (Immutable Class)** và được đánh dấu là `final` (không thể kế thừa). Một khi đối tượng `String` đã được tạo trên bộ nhớ Heap, trạng thái và nội dung bên trong của nó **không bao giờ có thể bị thay đổi**.
* `String` hiện thực các interface quan trọng: `CharSequence`, `Comparable<String>`, `Serializable`.

---

### 1.2. Nối Chuỗi (String Concatenation)
Phép toán nối chuỗi bằng toán tử `+` và `+=` tuân thủ các quy tắc nghiêm ngặt sau:

1. **Quy tắc kiểu dữ liệu:** Nếu ít nhất một trong hai toán hạng là `String`, toán tử `+` sẽ đóng vai trò là **nối chuỗi**. Nếu cả hai toán hạng đều là số nguyên hoặc số thực, toán tử `+` sẽ đóng vai trò là **phép cộng số học**.
2. **Quy tắc thứ tự đánh giá:** Phép toán được thực hiện theo thứ tự từ **trái sang phải**.

#### Ví dụ Phân Tích Thứ Tự Thực Thi:
```java
System.out.println(1 + 2 + "c");     // In ra: "3c"   (1 + 2 = 3 trước, sau đó 3 + "c" = "3c")
System.out.println("c" + 1 + 2);     // In ra: "c12"  ("c" + 1 = "c1", sau đó "c1" + 2 = "c12")
System.out.println("c" + (1 + 2));   // In ra: "c3"   (Dấu ngoặc tròn được ưu tiên tính trước)
System.out.println(null + "abc");    // In ra: "nullabc" (Giá trị null được chuyển thành chuỗi "null")
```

> [!WARNING]
> **Bẫy phòng thi với `null`:**  
> * Nối biến chứa `null` với chuỗi: `String s = null; s += "abc";` $\rightarrow$ Biến `s` mang giá trị `"nullabc"`.
> * Gọi bất kỳ phương thức nào trên biến mang giá trị `null`: `String s = null; s.length();` $\rightarrow$ Ném ngay ngoại lệ **`NullPointerException`** tại thời điểm runtime.

---

### 1.3. Tính Bất Biến (Immutability) và Bẫy Phổ Biến Nhất
Do `String` là bất biến, mọi phương thức của lớp `String` thực hiện thao tác biến đổi chuỗi đều **không thay đổi chuỗi ban đầu**, mà sẽ tạo và **trả về một đối tượng `String` hoàn toàn mới**.

```java
String s1 = "1";
String s2 = s1.concat("2");
s2.concat("3");

System.out.println(s1); // In ra: 1
System.out.println(s2); // In ra: 12 (Vì s2.concat("3") không được gán lại vào biến s2!)
```

> [!IMPORTANT]
> **Quy tắc thi OCP:** Nếu một dòng code gọi `s.toUpperCase()`, `s.trim()`, `s.replace(...)` mà kết quả trả về **không được gán vào một biến**, đối tượng chuỗi ban đầu vẫn giữ nguyên giá trị cũ!

---

### 1.4. Các Phương Thức String Quan Trọng

#### 1.4.1. Lấy thông tin cơ bản: `length()` và `charAt()`
* `public int length()`: Trả về số ký tự trong chuỗi.
* `public char charAt(int index)`: Trả về ký tự tại vị trí chỉ định (chỉ số đánh số từ `0` đến `length() - 1`).

```java
var prime = "2357";
System.out.println(prime.length());     // 4
System.out.println(prime.charAt(2));    // '5'
System.out.println(prime.charAt(4));    // Ném StringIndexOutOfBoundsException!
```

---

#### 1.4.2. Tìm kiếm: `indexOf()` và `lastIndexOf()`
Tìm kiếm vị trí xuất hiện của một ký tự hoặc chuỗi con. Nếu không tìm thấy, phương thức trả về `-1`.

```java
public int indexOf(int ch)
public int indexOf(int ch, int fromIndex)
public int indexOf(String str)
public int indexOf(String str, int fromIndex)
public int lastIndexOf(String str)
public int lastIndexOf(String str, int fromIndex)
```

```java
var animals = "animals";
System.out.println(animals.indexOf('a'));       // 0
System.out.println(animals.indexOf("al"));      // 4
System.out.println(animals.indexOf('a', 4));    // 4 (Bắt đầu tìm từ vị trí index 4)
System.out.println(animals.indexOf("123"));     // -1 (Không tìm thấy)
System.out.println(animals.lastIndexOf('a'));   // 4 (Ký tự 'a' xuất hiện cuối cùng)
```

---

#### 1.4.3. Cắt chuỗi: `substring()`
* `public String substring(int beginIndex)`: Lấy chuỗi con từ `beginIndex` đến hết chuỗi.
* `public String substring(int beginIndex, int endIndex)`: Lấy chuỗi con từ `beginIndex` đến `endIndex - 1` (nửa khoảng đóng mở `[beginIndex, endIndex)`).

```java
var animals = "animals";
System.out.println(animals.substring(3));       // "mals"
System.out.println(animals.substring(animals.indexOf('m'))); // "mals"
System.out.println(animals.substring(3, 4));    // "m"
System.out.println(animals.substring(3, 7));    // "mals"
System.out.println(animals.substring(3, 3));    // "" (Chuỗi rỗng - hợp lệ!)
System.out.println(animals.substring(3, 2));    // Ném StringIndexOutOfBoundsException (begin > end)
System.out.println(animals.substring(3, 8));    // Ném StringIndexOutOfBoundsException (end > length)
```

---

#### 1.4.4. Chuyển đổi chữ hoa / chữ thường: `toLowerCase()` và `toUpperCase()`
```java
var name = "AniMaL123";
System.out.println(name.toUpperCase()); // "ANIMAL123"
System.out.println(name.toLowerCase()); // "animal123"
// Các ký tự không phải chữ cái (chữ số, ký tự đặc biệt) được giữ nguyên không đổi.
```

---

#### 1.4.5. So sánh nội dung: `equals()` và `equalsIgnoreCase()`
* `public boolean equals(Object anObject)`: So sánh chính xác từng ký tự (phân biệt hoa thường). Chấp nhận đối số là bất kỳ `Object` nào (trả về `false` nếu đối số khác kiểu `String`).
* `public boolean equalsIgnoreCase(String anotherString)`: So sánh không phân biệt hoa thường.

```java
System.out.println("abc".equals("ABC"));            // false
System.out.println("ABC".equals("ABC"));            // true
System.out.println("abc".equalsIgnoreCase("ABC"));  // true
System.out.println("ABC".equals(123));              // false (Khác kiểu dữ liệu, không lỗi biên dịch)
```

---

#### 1.4.6. Kiểm tra tiền tố, hậu tố và chứa chuỗi con
* `public boolean startsWith(String prefix)`
* `public boolean startsWith(String prefix, int toOffset)`
* `public boolean endsWith(String suffix)`
* `public boolean contains(CharSequence s)`

```java
System.out.println("abc".startsWith("a"));      // true
System.out.println("abc".startsWith("A"));      // false (Phân biệt hoa thường!)
System.out.println("abc".endsWith("bc"));       // true
System.out.println("abc".contains("B"));        // false
System.out.println("abc".contains("b"));        // true
```

---

#### 1.4.7. Thay thế giá trị: `replace()`
Lớp `String` cung cấp 2 overload phổ biến:
* `public String replace(char oldChar, char newChar)`
* `public String replace(CharSequence target, CharSequence replacement)`

```java
System.out.println("abcabc".replace('a', 'A')); // "AbcAbc" (Thay thế TẤT CẢ các ký tự khớp)
System.out.println("abcabc".replace("ab", "X"));// "XcXc"
```

---

#### 1.4.8. Cắt khoảng trắng: `trim()` vs `strip()`
Sự khác biệt quan trọng giữa `trim()` (có từ Java 1.0) và họ phương thức `strip()` (ra mắt từ Java 11):

| Phương Thức | Đối Tượng Xử Lý | Phạm Vi Khoảng Trắng |
| :--- | :--- | :--- |
| `trim()` | Xóa khoảng trắng ở cả hai đầu chuỗi | Chỉ nhận diện các ký tự ASCII $\le$ `\u0020` (`' '`, `\t`, `\n`, `\r`, `\f`). |
| `strip()` | Xóa khoảng trắng ở cả hai đầu chuỗi | Hỗ trợ toàn diện chuẩn **Unicode whitespace** (bao gồm cả các ký tự như `\u2000`). |
| `stripLeading()` | Chỉ xóa khoảng trắng ở **đầu** chuỗi | Hỗ trợ toàn diện chuẩn Unicode whitespace. |
| `stripTrailing()`| Chỉ xóa khoảng trắng ở **cuối** chuỗi | Hỗ trợ toàn diện chuẩn Unicode whitespace. |

```java
String text = " \t abc \n ";
System.out.println(text.trim());          // "abc"
System.out.println(text.strip());         // "abc"
System.out.println(text.stripLeading());  // "abc \n "
System.out.println(text.stripTrailing()); // " \t abc"
```

---

#### 1.4.9. Xử lý thụt lề: `indent()` và `stripIndent()`
Hỗ trợ mạnh mẽ cho các khối văn bản nhiều dòng (*Text Blocks*).

##### BẢNG 4.1: Quy tắc hoạt động của `indent()` và `stripIndent()` (TABLE 4.1 in book)
| Phương Thức | Thay Đổi Độ Thụt Lề (Indent change) | Chuẩn Hóa Dấu Xuống Dòng Thành `\n`? | Tự Động Thêm `\n` Ở Cuối Nếu Chưa Có? |
| :--- | :--- | :---: | :---: |
| **`indent(n)`** với `n > 0` | Thêm `n` dấu cách vào đầu mỗi dòng | **Có (Yes)** | **Có (Yes)** |
| **`indent(n)`** với `n == 0`| Không thay đổi thụt lề | **Có (Yes)** | **Có (Yes)** |
| **`indent(n)`** với `n < 0` | Xóa tối đa $\|n\|$ dấu cách từ đầu mỗi dòng không rỗng | **Có (Yes)** | **Có (Yes)** |
| **`stripIndent()`** | Xóa toàn bộ khoảng trắng thừa chung (*incidental whitespace*) ở đầu các dòng | **Có (Yes)** | **Không (No)** |

```java
var block = """
            a
             b
            c""";
var concat = " a\n"
           + "  b\n"
           + " c";

System.out.println(block.length());                 // 6  ('a', '\n', ' ', 'b', '\n', 'c')
System.out.println(concat.length());                // 9  (' ', 'a', '\n', ' ', ' ', 'b', '\n', ' ', 'c')
System.out.println(block.indent(1).length());       // 10 (Thêm 3 dấu cách + 1 dấu '\n' ở cuối!)
System.out.println(concat.indent(-1).length());     // 7  (Bớt 3 dấu cách + 1 dấu '\n' ở cuối)
System.out.println(concat.indent(-4).length());     // 6  (Xóa hết khoảng trắng đầu dòng + 1 dấu '\n')
System.out.println(concat.stripIndent().length());  // 6  (Xóa 1 khoảng trắng chung, KHÔNG thêm '\n')
```

---

#### 1.4.10. Kiểm tra chuỗi rỗng: `isEmpty()` vs `isBlank()`
* `public boolean isEmpty()`: Trả về `true` khi và chỉ khi `length() == 0`.
* `public boolean isBlank()`: Trả về `true` nếu `length() == 0` **HOẶC** chuỗi chỉ chứa toàn bộ các ký tự khoảng trắng (*whitespace*).

```java
System.out.println(" ".isEmpty());  // false (Độ dài là 1)
System.out.println("".isEmpty());   // true  (Độ dài là 0)
System.out.println(" ".isBlank());  // true  (Chỉ chứa khoảng trắng)
System.out.println("".isBlank());   // true  (Độ dài là 0)
```

---

#### 1.4.11. Định dạng chuỗi: `format()` và `formatted()`
Từ Java 15, phương thức thể hiện tiện lợi `formatted()` được giới thiệu bên cạnh phương thức tĩnh `String.format()`:

```java
var name = "Kate";
var orderId = 5;

// Ba cách sau cho kết quả giống hệt nhau: "Hello Kate, order 5 is ready"
System.out.println("Hello " + name + ", order " + orderId + " is ready");
System.out.println(String.format("Hello %s, order %d is ready", name, orderId));
System.out.println("Hello %s, order %d is ready".formatted(name, orderId));
```

##### BẢNG 4.2: Các ký hiệu định dạng thông dụng (TABLE 4.2 in book)
| Ký Hiệu (*Symbol*) | Kiểu Dữ Liệu Tương Thích | Ví Dụ |
| :---: | :--- | :--- |
| **`%s`** | Bất kỳ kiểu dữ liệu nào (thường dùng cho `String`) | `"Hello %s" -> "Hello Duke"` |
| **`%d`** | Số nguyên nguyên thủy và đối tượng bao gói (`int`, `long`, `short`, `byte`, `Integer`) | `"ID: %d" -> "ID: 42"` |
| **`%f`** | Số thực dấu phẩy động (`float`, `double`). Mặc định in **6 chữ số thập phân** và **có làm tròn**. | `"Score: %f" -> "Score: 90.250000"` |
| **`%n`** | Chèn ký tự xuống dòng phụ thuộc vào hệ điều hành (`\r\n` trên Windows, `\n` trên Unix/Mac). | `"A%nB"` |

> [!CAUTION]
> **Bẫy Runtime Mismatch Kiểu:**  
> Nếu bạn truyền số thực dấu phẩy động vào vị trí yêu cầu số nguyên `%d`:  
> `String.format("Food: %d tons", 2.0);` $\rightarrow$ Ném ngoại lệ **`IllegalFormatConversionException`** tại runtime!

##### Sử dụng Cờ Định Dạng (Formatting Flags):
* `%.1f`: Hiển thị chính xác 1 chữ số thập phân (thực hiện **làm tròn số**).
* `[%12.2f]`: Căn chỉnh tổng độ rộng tối thiểu là 12 ký tự, 2 chữ số thập phân, phần dư bù bằng khoảng trắng.
* `[%012f]`: Tổng độ rộng 12 ký tự, phần dư phía trước được bù bằng các chữ số `0`.

```java
var pi = 3.14159265359;
System.out.format("[%f]%n", pi);      // [3.141593]   (Mặc định 6 chữ số thập phân, có làm tròn)
System.out.format("[%12.8f]%n", pi);  // [  3.14159265] (12 ký tự, bù khoảng trắng bên trái)
System.out.format("[%012f]%n", pi);   // [00003.141593] (12 ký tự, bù số 0 bên trái)
System.out.format("[%12.2f]%n", pi);  // [        3.14]
System.out.format("[%.3f]%n", pi);    // [3.142]
```

---

## 2. Lớp `StringBuilder` (Using the StringBuilder Class)

### 2.1. Tại Sao Cần `StringBuilder`?
* Khi thực hiện các vòng lặp nối chuỗi liên tục, việc dùng `String` sẽ tạo ra hàng nghìn đối tượng rác trên Heap, gây suy giảm nghiêm trọng hiệu năng bộ nhớ.
* `StringBuilder` là **lớp khả biến (Mutable)**. Khi bạn thay đổi nội dung (thêm, chèn, xóa ký tự), nó thao tác trực tiếp trên mảng ký tự nội bộ mà **không tạo ra đối tượng mới**.
* Hầu hết các phương thức của `StringBuilder` đều trả về `this` (tham chiếu của chính đối tượng đó) để hỗ trợ kỹ thuật xâu chuỗi phương thức (*Method Chaining*).

---

### 2.2. Khởi Tạo `StringBuilder`
1. `new StringBuilder()`: Tạo bộ đệm rỗng với sức chứa mặc định (**capacity = 16**).
2. `new StringBuilder(int capacity)`: Khởi tạo với sức chứa xác định trước.
3. `new StringBuilder(CharSequence seq)` hoặc `new StringBuilder(String str)`: Khởi tạo chứa chuỗi ban đầu, capacity mặc định sẽ là `str.length() + 16`.

```java
var sb1 = new StringBuilder();          // length = 0, capacity = 16
var sb2 = new StringBuilder("animal");  // length = 6, capacity = 22 (6 + 16)
```

---

### 2.3. Các Phương Thức Quan Trọng của `StringBuilder`

#### 2.3.1. `append()`
Nối thêm dữ liệu vào cuối chuỗi hiện tại và trả về tham chiếu đến chính `StringBuilder` đó.
```java
var sb = new StringBuilder().append(1).append('c');
sb.append("-").append(true);
System.out.println(sb); // In ra: "1c-true"
```

---

#### 2.3.2. `insert()`
Chèn dữ liệu vào một vị trí chỉ số xác định.
```java
var sb = new StringBuilder("animals");
sb.insert(7, "-");  // Chèn vào cuối (vị trí index 7 là hợp lệ)
sb.insert(0, "-");  // Chèn vào đầu
sb.insert(4, "-");  // Chèn vào giữa
System.out.println(sb); // In ra: "-ani-mals-"

// Bẫy lỗi:
sb.insert(100, "X"); // Ném StringIndexOutOfBoundsException! (Chỉ số chèn > sb.length())
```

---

#### 2.3.3. `delete()` và `deleteCharAt()`
* `public StringBuilder delete(int start, int end)`: Xóa các ký tự từ `start` đến `end - 1`.
* `public StringBuilder deleteCharAt(int index)`: Xóa duy nhất một ký tự tại vị trí `index`.

> [!TIP]
> **Điểm đặc biệt của `delete(start, end)` trong OCP:**  
> Nếu tham số `end` lớn hơn độ dài thực tế của chuỗi (`end >= sb.length()`), Java **không ném ngoại lệ** mà sẽ tự động điều chỉnh `end = sb.length()` và xóa đến hết chuỗi!  
> Ngược lại, `deleteCharAt(index)` sẽ **ném ngoại lệ ngay lập tức** nếu `index >= sb.length()`!

```java
var sb = new StringBuilder("abcdef");
sb.delete(1, 3);        // Xóa index 1 và 2 -> sb còn "adef"
sb.deleteCharAt(5);     // Ném StringIndexOutOfBoundsException! (Độ dài hiện tại chỉ là 4)
sb.delete(1, 100);      // Hợp lệ! Tự động xóa từ index 1 đến hết chuỗi -> sb còn "a"
```

---

#### 2.3.4. `replace()` trong `StringBuilder` vs `String`
> [!WARNING]
> **Bẫy thi cực kỳ nguy hiểm:**  
> * Trong `String`: `replace(CharSequence target, CharSequence replacement)` thay thế các ký tự khớp.
> * Trong `StringBuilder`: `replace(int start, int end, String newStr)` nhận chỉ số bắt đầu và kết thúc để thay thế dải ký tự `[start, end)` bằng một chuỗi mới (độ dài chuỗi mới không nhất thiết phải bằng độ dài dải bị xóa!).

```java
var sb = new StringBuilder("pigeon dirty");
sb.replace(3, 6, "sty"); // Thay thế index 3, 4, 5 ("eon") bằng "sty"
System.out.println(sb);  // In ra: "pigsty dirty"

sb.replace(3, 100, "");  // Xóa từ index 3 đến hết chuỗi
System.out.println(sb);  // In ra: "pig"
```

---

#### 2.3.5. `substring()` trên `StringBuilder` — BẪY PHÒNG THI KINH ĐIỂN!
> [!CAUTION]
> **CỰC KỲ QUAN TRỌNG TRONG KỲ THI ORACLE:**  
> Phương thức `substring()` trong lớp `StringBuilder` trả về một đối tượng **`String`** và **KHÔNG HỀ làm biến đổi nội dung bên trong của `StringBuilder`**!

```java
var sb = new StringBuilder("animals");
String sub = sb.substring(1, 4); // sub mang giá trị "nim"
System.out.println(sb);          // VẪN LÀ "animals" (Không hề bị cắt thành "nim"!)
```

---

#### 2.3.6. `reverse()` và `toString()`
* `sb.reverse()`: Đảo ngược các ký tự trong `StringBuilder` ngay tại chỗ.
* `sb.toString()`: Chuyển đổi nội dung của `StringBuilder` thành một đối tượng `String` bất biến.

---

### 2.4. `StringBuilder` vs `StringBuffer`
| Đặc Điểm | `StringBuilder` (Java 5+) | `StringBuffer` (Java 1.0) |
| :--- | :--- | :--- |
| **Độ an toàn đa luồng (*Thread-safety*)** | Không (*Not thread-safe*) | **Có (*Thread-safe*)** nhờ các phương thức `synchronized`. |
| **Tốc độ thực thi** | Rất nhanh (Khuyên dùng trong môi trường đơn luồng) | Chậm hơn do chi phí khóa đồng bộ hóa. |
| **Hệ thống API** | Hoàn toàn tương đồng nhau | Hoàn toàn tương đồng nhau |

---

## 3. Bản Chất So Sánh Bằng (Understanding Equality)

### 3.1. Toán Tử `==` vs Phương Thức `equals()`
* **Toán tử `==`:** Luôn luôn so sánh **đẳng thức tham chiếu** (*reference equality*). Trả về `true` khi và chỉ khi hai biến tham chiếu cùng trỏ tới một vị trí ô nhớ đối tượng duy nhất trên Heap.
* **Phương thức `equals()`:** So sánh **nội dung logic** (*logical equality*) do lớp đó định nghĩa và override.

```java
var s1 = new String("Hello");
var s2 = new String("Hello");
System.out.println(s1 == s2);      // false (Hai đối tượng riêng biệt trên Heap)
System.out.println(s1.equals(s2));  // true  (Lớp String đã override equals() để so sánh ký tự)
```

---

### 3.2. Bẫy Tử Thần: `StringBuilder.equals()`
> [!CAUTION]
> **Lớp `StringBuilder` KHÔNG hề override phương thức `equals()` từ `java.lang.Object`!**  
> Do đó, khi bạn gọi `sb1.equals(sb2)`, Java sẽ sử dụng triển khai mặc định của lớp `Object` (chính là so sánh tham chiếu `==`)!

```java
var sb1 = new StringBuilder("lion");
var sb2 = new StringBuilder("lion");
System.out.println(sb1 == sb2);      // false
System.out.println(sb1.equals(sb2)); // false! (Dù hai chuỗi có nội dung giống hệt nhau!)

// Để so sánh nội dung logic của 2 StringBuilder:
System.out.println(sb1.toString().equals(sb2.toString())); // true
System.out.println(sb1.compareTo(sb2) == 0);               // true (Từ Java 11)
```

---

### 3.3. Bể Chứa Chuỗi (The String Pool) và Phương Thức `intern()`
Để tối ưu hóa bộ nhớ, JVM dành riêng một vùng nhớ đặc biệt trong Heap gọi là **String Pool** để lưu trữ và tái sử dụng các chuỗi ký tự cố định (*String Literals*).

```
HEAP MEMORY
┌────────────────────────────────────────────────────────┐
│  STRING POOL                                           │
│  ┌───────────────────────┐                             │
│  │ "hello" <─────────────┼────────── s1 ("hello")      │
│  └───────────────────────┘          s2 ("hello")       │
│                                                        │
│  NON-POOL HEAP OBJECTS                                 │
│  ┌───────────────────────┐                             │
│  │ Object: "hello" <─────┼────────── s3 (new String)   │
│  └───────────────────────┘                             │
└────────────────────────────────────────────────────────┘
```

#### Các Quy Tắc Nhận Diện String Pool Trong Bài Thi:
1. **Hằng số lúc biên dịch (*Compile-time constants*):** Mọi chuỗi ký tự cố định hoặc các biểu thức ghép chuỗi được tính toán xong ngay trong giai đoạn biên dịch sẽ tự động được đưa vào String Pool.
2. **Biểu thức lúc thực thi (*Runtime expressions*):** Việc tạo chuỗi bằng từ khóa `new String(...)` hoặc các phép nối chuỗi chứa biến thông thường (không phải `final`) sẽ tạo đối tượng mới độc lập trên Heap bên ngoài String Pool.
3. **Phương thức `intern()`:** Kiểm tra xem chuỗi có nội dung tương đương đã tồn tại trong String Pool chưa:
   * Nếu đã có: Trả về tham chiếu của đối tượng chuỗi trong String Pool.
   * Nếu chưa có: Đưa chuỗi hiện tại vào String Pool và trả về tham chiếu đó.

```java
String x = "Hello World";
String y = "Hello World";
System.out.println(x == y); // true (Cùng trỏ vào một literal duy nhất trong String Pool)

String z = " Hello World".trim(); // Tính toán lúc runtime!
System.out.println(x == z); // false (z là đối tượng mới ngoài Heap)

String w = new String("Hello World");
System.out.println(x == w);          // false (new luôn tạo đối tượng mới trên Heap)
System.out.println(x == w.intern()); // true  (w.intern() trả về tham chiếu từ String Pool!)

// Bẫy hằng số final:
final String f1 = "Hello ";
final String f2 = "World";
String f3 = f1 + f2; // Trình biên dịch tối ưu hóa trực tiếp thành "Hello World"
System.out.println(x == f3); // true!
```

---

## 4. Mảng (Understanding Arrays)

### 4.1. Khởi Tạo và Cú Pháp Khai Báo Mảng
Mảng là một đối tượng có kích thước cố định (*fixed size*) trên Heap, chứa các phần tử có cùng một kiểu dữ liệu.

```java
// Các cú pháp khai báo hợp lệ:
int[] arr1;
int arr2[];
int []arr3;

// Bẫy khai báo nhiều biến trên một dòng:
int[] a, b; // Cả a và b đều là mảng int[]
int c[], d; // c là mảng int[], còn d chỉ là một số nguyên int thông thường!
```

#### Các Cách Khởi Tạo Mảng:
```java
// Cách 1: Khởi tạo với kích thước xác định
int[] numbers = new int[3]; 

// Cách 2: Khởi tạo mảng vô danh (Anonymous Array)
int[] numbers2 = new int[] {42, 55, 99};

// Cách 3: Cú pháp viết tắt (Chỉ được phép dùng đồng thời lúc KHAI BÁO biến)
int[] numbers3 = {42, 55, 99};

// LỖI BIÊN DỊCH PHỔ BIẾN:
int[] bad1 = new int[3] {1, 2, 3}; // LỖI! Không được vừa ghi kích thước vừa điền danh sách!
int[] bad2;
bad2 = {1, 2, 3};                  // LỖI! Cú pháp viết tắt không được gán sau khi khai báo!
bad2 = new int[] {1, 2, 3};        // HỢP LỆ!
```

#### Giá Trị Khởi Tạo Mặc Định của Phần Tử Mảng:
Khi tạo mảng bằng `new Type[size]`, các phần tử tự động mang giá trị mặc định:
* Số nguyên (`byte`, `short`, `int`, `long`): `0`
* Số thực (`float`, `double`): `0.0`
* Ký tự (`char`): `\u0000` (ký tự NUL)
* Kiểu luận lý (`boolean`): `false`
* Mọi kiểu đối tượng tham chiếu (`Object`, `String`,...): `null`

---

### 4.2. Truy Cập Phần Tử và Thuộc Tính `length`
* Mảng sử dụng thuộc tính **`length`** (không có dấu ngoặc tròn `()`, khác với `String.length()`).
* Chỉ số hợp lệ từ `0` đến `arr.length - 1`. Truy cập ngoài khoảng này sẽ ném ngoại lệ **`ArrayIndexOutOfBoundsException`**.

```java
String[] birds = new String[6];
System.out.println(birds.length);  // 6 (Thuộc tính public final của mảng)
System.out.println(birds[0]);       // null
birds[6] = "Hawk";                  // Ném ArrayIndexOutOfBoundsException!
```

---

### 4.3. Sắp Xếp Mảng: `Arrays.sort()`
* `Arrays.sort()` sắp xếp các phần tử theo thứ tự tăng dần trực tiếp trên mảng gốc (*in-place*).
* Cần import `java.util.Arrays`.

> [!IMPORTANT]
> **Quy tắc thứ tự sắp xếp chuỗi ("7Up Rule"):**  
> 1. **7 (Numbers):** Các ký tự số sắp xếp trước (`'0'` đến `'9'`).
> 2. **U (Uppercase):** Các chữ cái in HOA sắp xếp tiếp theo (`'A'` đến `'Z'`).
> 3. **p (lowercase):** Các chữ cái thường sắp xếp sau cùng (`'a'` đến `'z'`).

#### Bẫy Sắp Xếp Chuỗi Số:
```java
String[] strings = { "10", "9", "100" };
Arrays.sort(strings);
for (String s : strings) System.out.print(s + " ");
// In ra: "10 100 9 " (Vì so sánh theo thứ tự từ điển, ký tự '1' đứng trước '9'!)
```

---

### 4.4. Tìm Kiếm Nhị Phân: `Arrays.binarySearch()`

##### BẢNG 4.3: Các quy tắc tìm kiếm nhị phân (TABLE 4.3 in book)
| Kịch Bản (*Scenario*) | Kết Quả Trả Về (*Result*) |
| :--- | :--- |
| **Phần tử mục tiêu được tìm thấy trong mảng đã sắp xếp** | Trả về **chỉ số (index) chính xác** của vị trí tìm thấy. |
| **Phần tử mục tiêu KHÔNG có trong mảng đã sắp xếp** | Trả về một **số âm** theo công thức:  $$\text{Result} = -(\text{insertion\_point}) - 1$$ Trong đó `insertion_point` là vị trí chỉ số mà phần tử đó cần được chèn vào để mảng vẫn bảo toàn tính tăng dần. |
| **Mảng CHƯA được sắp xếp** | **Không xác định (*Unpredictable / Undefined*)**. Không thể đoán trước được giá trị trả về! |

```java
int[] numbers = {2, 4, 6, 8}; // Mảng đã sắp xếp
System.out.println(Arrays.binarySearch(numbers, 2)); // 0  (Tìm thấy tại index 0)
System.out.println(Arrays.binarySearch(numbers, 4)); // 1  (Tìm thấy tại index 1)
System.out.println(Arrays.binarySearch(numbers, 1)); // -1 (Cần chèn tại index 0 -> -0 - 1 = -1)
System.out.println(Arrays.binarySearch(numbers, 3)); // -2 (Cần chèn tại index 1 -> -1 - 1 = -2)
System.out.println(Arrays.binarySearch(numbers, 9)); // -5 (Cần chèn tại index 4 -> -4 - 1 = -5)

// BẪY MẢNG CHƯA SẮP XẾP:
int[] unsorted = {3, 2, 1};
System.out.println(Arrays.binarySearch(unsorted, 2)); // Kết quả không xác định (Undefined)!
```

---

### 4.5. So Sánh Mảng: `equals()`, `compare()`, `mismatch()` (Java 9+)

#### 4.5.1. `Arrays.equals()`
Kiểm tra xem hai mảng có cùng độ dài và tất cả các phần tử tại các vị trí tương ứng có bằng nhau hay không (dùng `==` cho kiểu nguyên thủy và `equals()` cho kiểu đối tượng).

```java
System.out.println(new int[]{1} == new int[]{1});             // false (Hai mảng độc lập)
System.out.println(Arrays.equals(new int[]{1}, new int[]{1})); // true  (Cùng phần tử)
```

---

#### 4.5.2. `Arrays.compare()`
So sánh hai mảng theo thứ tự từ điển (*lexicographical order*):
* Trả về **`0`**: Hai mảng bằng nhau hoàn toàn.
* Trả về **số âm (`< 0`)**: Mảng thứ nhất nhỏ hơn mảng thứ hai.
* Trả về **số dương (`> 0`)**: Mảng thứ nhất lớn hơn mảng thứ hai.

##### Quy Tắc Phân Định "Nhỏ Hơn" Khi So Sánh:
1. `null` nhỏ hơn bất kỳ giá trị nào khác.
2. Với số: Áp dụng thứ tự số học tự nhiên thông thường.
3. Với chuỗi/ký tự: Áp dụng quy tắc "7Up" (Số $<$ Chữ Hoa $<$ Chữ Thường).
4. Nếu một mảng là tiền tố tiền đề của mảng kia: **Mảng ngắn hơn sẽ nhỏ hơn mảng dài hơn**.

##### BẢNG 4.4: Các ví dụ `Arrays.compare()` (TABLE 4.4 in book)
| Mảng Thứ Nhất | Mảng Thứ Hai | Kết Quả | Nguyên Nhân Giải Thích |
| :--- | :--- | :---: | :--- |
| `new int[] {1, 2}` | `new int[] {1}` | **Số dương (`> 0`)** | Phần tử đầu giống nhau, nhưng mảng 1 dài hơn mảng 2. |
| `new int[] {1, 2}` | `new int[] {1, 2}`| **`0`** | Khớp chính xác hoàn toàn. |
| `new String[] {"a"}` | `new String[] {"aa"}`| **Số âm (`< 0`)** | `"a"` là tiền tố của `"aa"`, mảng 1 ngắn hơn. |
| `new String[] {"a"}` | `new String[] {"A"}` | **Số dương (`> 0`)** | Chữ thường `'a'` lớn hơn chữ HOA `'A'`. |
| `new String[] {"a"}` | `new String[] {null}`| **Số dương (`> 0`)** | Chữ cái luôn lớn hơn giá trị `null`. |

> [!CAUTION]
> **Bẫy biên dịch:** Hai mảng truyền vào `Arrays.compare()` bắt buộc phải có cùng kiểu mảng!  
> `Arrays.compare(new int[]{1}, new String[]{"a"});` $\rightarrow$ **DOES NOT COMPILE!**

---

#### 4.5.3. `Arrays.mismatch()`
* Trả về **`-1`** nếu hai mảng bằng nhau hoàn toàn.
* Trả về **chỉ số (index) đầu tiên ($\ge 0$) mà tại đó hai mảng có sự khác biệt**.

```java
System.out.println(Arrays.mismatch(new int[]{1}, new int[]{1}));       // -1 (Giống nhau)
System.out.println(Arrays.mismatch(new String[]{"a"}, new String[]{"A"})); // 0 (Khác tại index 0)
System.out.println(Arrays.mismatch(new int[]{1, 2}, new int[]{1}));    // 1 (Khác tại index 1)
```

##### BẢNG 4.5: Bảng tổng hợp so sánh mảng (TABLE 4.5 in book)
| Phương Thức | Khi Hai Mảng Giống Hệt Nhau | Khi Hai Mảng Khác Nhau |
| :--- | :---: | :---: |
| **`Arrays.equals()`** | `true` | `false` |
| **`Arrays.compare()`** | `0` | Số âm hoặc số dương |
| **`Arrays.mismatch()`** | **`-1`** | Chỉ số `0` hoặc chỉ số dương (`>= 0`) |

---

### 4.6. Mảng Đa Chiều (Multidimensional Arrays)
Trong Java, mảng 2 chiều thực chất là **mảng của các mảng**. Các hàng không nhất thiết phải có cùng độ dài (gọi là **mảng răng cưa / asymmetric array**).

```java
// Mảng đối xứng hình chữ nhật (3 hàng, 2 cột):
int[][] matrix = new int[3][2];

// Mảng răng cưa:
int[][] ragged = new int[3][];
ragged[0] = new int[2];
ragged[1] = new int[4];
ragged[2] = new int[1];

// Duyệt mảng 2 chiều bằng vòng lặp lồng nhau:
for (int[] row : ragged) {
    for (int val : row) {
        System.out.print(val + " ");
    }
    System.out.println();
}
```

---

## 5. Tính Toán Với Các API Math (Calculating with Math APIs)

Lớp `java.lang.Math` cung cấp các phương thức tĩnh phục vụ tính toán toán học. Mọi phương thức đều là `static`.

### 5.1. `Math.min()` và `Math.max()`
So sánh hai số và trả về số nhỏ hơn hoặc lớn hơn. Có 4 phiên bản nạp chồng (`int`, `long`, `float`, `double`).
```java
int minInt = Math.min(5, 10);       // 5
double maxDouble = Math.max(3.14, 2.71); // 3.14
```

---

### 5.2. Làm Tròn Số: `Math.round()`
> [!WARNING]
> **Bẫy kiểu dữ liệu trả về của `Math.round()`:**  
> * `Math.round(float)` $\rightarrow$ Trả về kiểu **`int`**.  
> * `Math.round(double)` $\rightarrow$ Trả về kiểu **`long`**.  
> Công thức toán học: Cộng thêm `0.5` rồi lấy phần sàn (`floor`).

```java
long roundDouble = Math.round(123.45);  // Trả về 123 (kiểu long)
long roundUp = Math.round(123.50);      // Trả về 124 (kiểu long)
int fromFloat = Math.round(123.45f);    // Trả về 123 (kiểu int)
```

---

### 5.3. `Math.ceil()` và `Math.floor()`
* `Math.ceil(double a)`: Làm tròn lên số nguyên tiếp theo gần nhất. **Luôn trả về kiểu `double`!**
* `Math.floor(double a)`: Làm tròn xuống số nguyên tiếp theo gần nhất. **Luôn trả về kiểu `double`!**

```java
double c = Math.ceil(3.14);   // 4.0 (kiểu double)
double f = Math.floor(3.14);  // 3.0 (kiểu double)
```

---

### 5.4. `Math.pow()` và `Math.random()`
* `public static double pow(double base, double exponent)`: Tính lũy thừa $base^{exponent}$. **Luôn trả về kiểu `double`**.
* `public static double random()`: Trả về một số thực ngẫu nhiên trong nửa khoảng $[0.0, 1.0)$ (luôn $\ge 0.0$ và $< 1.0$).

```java
double sq = Math.pow(5, 2); // In ra: 25.0 (Không phải số nguyên 25!)
```

---

### 5.5. `BigInteger` và `BigDecimal`
Khi số nguyên vượt qua giới hạn của `long` hoặc số thực cần độ chính xác tuyệt đối không bị sai số dấu phẩy động (đặc biệt là tính toán tiền tệ, tài chính):
* Thuộc gói `java.math.*`.
* Là **các lớp bất biến (Immutable)**. Mọi phép toán `add()`, `subtract()`, `multiply()`, `divide()` đều trả về một đối tượng mới!
* Khuyến nghị dùng phương thức tĩnh `valueOf()` thay vì constructor:

```java
import java.math.*;

var bigInt = BigInteger.valueOf(5_000_000_000L);
var bigDec = BigDecimal.valueOf(5000.50);

// Tính toán bất biến:
var total = bigDec.add(BigDecimal.valueOf(100.25)); // Phải gán lại vào biến!
```

---

## 6. Làm Việc Với Ngày và Giờ (Working with Dates and Times)

Từ Java 8, gói **`java.time.*`** cung cấp hệ thống API ngày giờ hiện đại, **bất biến (immutable)** và **an toàn đa luồng (thread-safe)**.

### 6.1. Các Lớp Cốt Lõi Trong `java.time`
* **`LocalDate`**: Chỉ chứa ngày (năm, tháng, ngày). Không có giờ, không có múi giờ. Ví dụ: Ngày sinh nhật.
* **`LocalTime`**: Chỉ chứa giờ (giờ, phút, giây, nano giây). Không có ngày, không có múi giờ. Ví dụ: Giờ mở cửa cửa hàng.
* **`LocalDateTime`**: Chứa cả ngày và giờ. Không có múi giờ.
* **`ZonedDateTime`**: Chứa ngày, giờ và thông tin múi giờ cụ thể (`ZoneId`).
* **`Instant`**: Đại diện cho một điểm cụ thể trên dòng thời gian theo chuẩn thời gian phối hợp quốc tế **UTC / GMT**.
* **`Period`**: Khoảng thời gian đo bằng **năm, tháng, ngày** (dành cho phần ngày).
* **`Duration`**: Khoảng thời gian đo bằng **ngày, giờ, phút, giây, nano giây** (dành cho phần giờ).

---

### 6.2. Khởi Tạo Đối Tượng Ngày Giờ

> [!CAUTION]
> **BẪY PHÒNG THI KINH ĐIỂN VỀ CONSTRUCTOR:**  
> Tất cả các lớp `LocalDate`, `LocalTime`, `LocalDateTime`, `ZonedDateTime` đều có **constructor là `private`**!  
> `LocalDate d = new LocalDate();` $\rightarrow$ **DOES NOT COMPILE!**  
> Bắt buộc phải sử dụng các static factory method như **`.now()`** hoặc **`.of(...)`**.

```java
import java.time.*;

// 1. Dùng .now() lấy thời điểm hiện tại:
var d = LocalDate.now();
var t = LocalTime.now();
var dt = LocalDateTime.now();
var z = ZonedDateTime.now();

// 2. Dùng .of(...) khởi tạo thời điểm cụ thể:
var date1 = LocalDate.of(2025, Month.JANUARY, 20); // Dùng enum Month (khuyên dùng)
var date2 = LocalDate.of(2025, 1, 20);             // Đánh số tháng từ 1 đến 12 (Khác với Calendar cũ!)

var time1 = LocalTime.of(6, 15);                   // 06:15
var time2 = LocalTime.of(6, 15, 30);               // 06:15:30
var time3 = LocalTime.of(6, 15, 30, 200);          // 06:15:30.000000200

var zone = ZoneId.of("US/Eastern");
var zoned = ZonedDateTime.of(2025, 1, 20, 6, 15, 0, 0, zone);
```

> [!WARNING]
> **Ngoại lệ `DateTimeException`:**  
> Nếu truyền tham số ngày giờ không tồn tại (ví dụ ngày 32, tháng 13, giờ 25, ngày 29 tháng 2 của năm không nhuận):  
> `LocalDate.of(2025, Month.FEBRUARY, 29);` $\rightarrow$ Ném ngoại lệ **`DateTimeException`** tại runtime!

---

### 6.3. Thao Tác Với Ngày và Giờ (Bảng 4.6 & 4.7)

##### BẢNG 4.6: Các phương thức cộng trừ trong các lớp ngày giờ (TABLE 4.6 in book)
| Phương Thức | `LocalDate` | `LocalTime` | `LocalDateTime` | `ZonedDateTime` |
| :--- | :---: | :---: | :---: | :---: |
| `plusYears()` / `minusYears()` | **Có** | Không | **Có** | **Có** |
| `plusMonths()` / `minusMonths()` | **Có** | Không | **Có** | **Có** |
| `plusWeeks()` / `minusWeeks()` | **Có** | Không | **Có** | **Có** |
| `plusDays()` / `minusDays()` | **Có** | Không | **Có** | **Có** |
| `plusHours()` / `minusHours()` | Không | **Có** | **Có** | **Có** |
| `plusMinutes()` / `minusMinutes()` | Không | **Có** | **Có** | **Có** |
| `plusSeconds()` / `minusSeconds()` | Không | **Có** | **Có** | **Có** |
| `plusNanos()` / `minusNanos()` | Không | **Có** | **Có** | **Có** |

> [!IMPORTANT]
> **Nhắc lại tính bất biến:**  
> `LocalDate date = LocalDate.of(2025, 1, 20);`  
> `date.plusDays(10);` // Không gán lại!  
> `System.out.println(date);` $\rightarrow$ Vẫn in ra `2025-01-20`!

##### BẢNG 4.7: Các phương thức chuyển đổi kiểu (TABLE 4.7 in book)
| Lớp Gốc | Phương Thức Chuyển Đổi | Kiểu Trả Về |
| :--- | :--- | :--- |
| **`LocalDate`** | `date.atTime(LocalTime time)` | `LocalDateTime` |
| **`LocalTime`** | `time.atDate(LocalDate date)` | `LocalDateTime` |
| **`LocalDateTime`** | `dateTime.atZone(ZoneId zone)` | `ZonedDateTime` |
| **`LocalDateTime`** | `dateTime.toLocalDate()` | `LocalDate` |
| **`LocalDateTime`** | `dateTime.toLocalTime()` | `LocalTime` |

---

### 6.4. Làm Việc Với `Period` (Khoảng Thời Gian Ngày)
`Period` được dùng để thể hiện chu kỳ ngày/tháng/năm.

#### Khởi Tạo `Period`:
```java
var annually = Period.ofYears(1);             // P1Y
var quarterly = Period.ofMonths(3);           // P3M
var everyThreeWeeks = Period.ofWeeks(3);      // P21D (Tự động chuyển đổi thành 21 ngày)
var everyOtherDay = Period.ofDays(2);         // P2D
var everyYearAndAWeek = Period.of(1, 0, 7);   // P1Y7D
```

> [!CAUTION]
> **BẪY CHAINING ĐẶC BIỆT CỦA `Period`:**  
> Các phương thức `ofYears()`, `ofMonths()`, `ofDays()` đều là **phương thức tĩnh (`static`)**! Do đó bạn **KHÔNG THỂ XÂU CHUỖI (chain)** chúng lại với nhau!  
> ```java
> Period wrong = Period.ofYears(1).ofWeeks(1); // LỪA ĐẢO! Chỉ tạo ra Period của 1 tuần (P7D)!
> ```
> Để tạo chu kỳ kết hợp cả năm và tuần, bắt buộc phải dùng: `Period.of(1, 0, 7);`

---

### 6.5. Làm Việc Với `Duration` (Khoảng Thời Gian Giờ)
`Duration` dùng để thể hiện khoảng thời gian nhỏ hơn theo giờ, phút, giây, nano giây.

#### Khởi Tạo `Duration`:
```java
var daily = Duration.ofDays(1);        // PT24H (Biểu diễn dưới dạng 24 giờ)
var hourly = Duration.ofHours(1);      // PT1H
var everyMinute = Duration.ofMinutes(1);// PT1M
var everyTenSeconds = Duration.ofSeconds(10); // PT10S
var everyMilli = Duration.ofMillis(1); // PT0.001S
var everyNano = Duration.ofNanos(1);   // PT0.000000001S

// Sử dụng đơn vị ChronoUnit:
var custom = Duration.of(2, ChronoUnit.HOURS);
```

#### Định Dạng Chuỗi Của `Period` vs `Duration`:
* `Period`: Luôn bắt đầu bằng chữ cái **`P`** (ví dụ `P1Y2M3D`).
* `Duration`: Bắt đầu bằng chữ cái **`P`** theo sau là chữ **`T`** (*Time separator*) (ví dụ `PT1H2M3S`).

---

### 6.6. Ma Trận Tương Thích Giữa `Period` và `Duration`

##### BẢNG 4.8: Phân biệt đối tượng sử dụng Duration và Period (TABLE 4.8 in book)
| Lớp Ngày Giờ | Sử Dụng Được Với `Period`? | Sử Dụng Được Với `Duration`? |
| :--- | :---: | :---: |
| **`LocalDate`** | **Có (Yes)** | **KHÔNG (No)** $\rightarrow$ Ném `UnsupportedTemporalTypeException` |
| **`LocalTime`** | **KHÔNG (No)** $\rightarrow$ Ném ngoại lệ | **Có (Yes)** |
| **`LocalDateTime`** | **Có (Yes)** | **Có (Yes)** |
| **`ZonedDateTime`** | **Có (Yes)** | **Có (Yes)** |

```java
var date = LocalDate.of(2025, 5, 25);
var period = Period.ofDays(1);
var duration = Duration.ofDays(1);

System.out.println(date.plus(period));   // 2025-05-26
System.out.println(date.plus(duration)); // Ném UnsupportedTemporalTypeException!
```

---

### 6.7. Làm Việc Với `Instant`
`Instant` là một điểm cụ thể trên dòng thời gian theo chuẩn múi giờ GMT/UTC.

```java
var now = Instant.now();
// Thực hiện tác vụ tốn thời gian...
var later = Instant.now();
var duration = Duration.between(now, later);
System.out.println(duration.toMillis()); // Số mili-giây đã trôi qua

// Chuyển đổi ZonedDateTime sang Instant:
var zdt = ZonedDateTime.of(2025, 5, 25, 11, 55, 0, 0, ZoneId.of("US/Eastern"));
Instant instant = zdt.toInstant(); // 2025-05-25T15:55:00Z (Tự động quy đổi chênh lệch múi giờ -04:00 sang UTC 'Z')
```

> [!CAUTION]
> **Bẫy thi:** Không thể gọi `toInstant()` trực tiếp trên một đối tượng `LocalDateTime` vì `LocalDateTime` **hoàn toàn không có thông tin múi giờ**, do đó JVM không thể biết chính xác thời điểm đó là mấy giờ tại mốc chuẩn GMT!

---

### 6.8. Hiện Tượng Đổi Giờ Mùa Hè (Daylight Saving Time - DST)

Kỳ thi OCP Java SE 21 kiểm tra quy tắc đổi giờ mùa hè theo chuẩn **Hoa Kỳ (U.S. Daylight Saving Time)**, diễn ra vào lúc **2:00 sáng ngày Chủ nhật**:

```
MÙA XUÂN (Spring Forward - Tháng 3):
1:59 AM ────────────► [NHẢY VỌT 1 TIẾNG] ────────────► 3:00 AM
(Khoảng thời gian 2:00 AM - 2:59 AM KHÔNG TỒN TẠI!)
Múi giờ đổi từ UTC-5 sang UTC-4

MÙA THU (Fall Back - Tháng 11):
1:59 AM ────────────► [LÙI LẠI 1 TIẾNG]  ────────────► 1:00 AM ──► 1:59 AM ──► 2:00 AM
(Khoảng thời gian 1:00 AM - 1:59 AM BỊ LẶP LẠI 2 LẦN!)
Múi giờ đổi từ UTC-4 sang UTC-5
```

#### 1. Nhảy Giờ Mùa Xuân (Spring Forward - Tháng 3):
* Đồng hồ nhảy vọt từ **1:59 AM lên thẳng 3:00 AM**.
* Ngày này chỉ có **23 giờ**. Khoảng thời gian từ 2:00 AM đến 2:59 AM **hoàn toàn không tồn tại**!
* Nếu bạn cố tình tạo một thời gian lúc `2:30 AM` ngày hôm đó, Java sẽ tự động cuộn lên thành `3:30 AM`!

```java
var date = LocalDate.of(2025, Month.MARCH, 9);
var time = LocalTime.of(1, 30);
var zone = ZoneId.of("US/Eastern");
var dateTime = ZonedDateTime.of(date, time, zone);

System.out.println(dateTime); // 2025-03-09T01:30-05:00[US/Eastern]

dateTime = dateTime.plusHours(1); // Cộng 1 tiếng
System.out.println(dateTime); // 2025-03-09T03:30-04:00[US/Eastern] (Nhảy vọt qua 2:30!)
```

#### 2. Lùi Giờ Mùa Thu (Fall Back - Tháng 11):
* Đồng hồ lùi lại từ **2:00 AM quay về 1:00 AM**.
* Ngày này có tới **25 giờ**. Giờ từ 1:00 AM đến 1:59 AM diễn ra **2 lần** (lần đầu ở múi giờ `-04:00`, lần sau ở múi giờ `-05:00`).

```java
var date = LocalDate.of(2025, Month.NOVEMBER, 2);
var time = LocalTime.of(1, 30);
var zone = ZoneId.of("US/Eastern");
var dateTime = ZonedDateTime.of(date, time, zone);

System.out.println(dateTime); // 2025-11-02T01:30-04:00[US/Eastern]

dateTime = dateTime.plusHours(1);
System.out.println(dateTime); // 2025-11-02T01:30-05:00[US/Eastern] (Vẫn là 1:30 AM nhưng offset đã đổi!)
```

#### 3. Bẫy Cộng `Period` vs `Duration` Qua Ngày Đổi Giờ DST:
* Cộng **`Period.ofDays(1)`**: Java điều chỉnh theo **giờ hiển thị trên mặt đồng hồ dân dụng** (Nếu hôm nay là 12:30 trưa, ngày mai vẫn là 12:30 trưa).
* Cộng **`Duration.ofDays(1)` (tương đương chính xác 24 giờ vật lý)**: Sẽ làm **lệch giờ mặt đồng hồ** nếu đi qua ngày đổi giờ DST (12:30 trưa hôm nay + 24 giờ sẽ thành 1:30 chiều ngày hôm sau nếu đi qua ngày mất 1 tiếng mùa xuân)!

---

## 7. Tóm Tắt Trọng Tâm Phòng Thi (Exam Essentials)

1. **Chuỗi `String` bất biến:** Bất kỳ thao tác cắt, nối, chuyển hoa thường nào trên `String` đều không làm đổi chuỗi gốc nếu không được gán lại vào biến.
2. **`StringBuilder` khả biến:** Các phương thức `append()`, `insert()`, `delete()`, `reverse()` làm thay đổi trực tiếp nội dung `StringBuilder`. Riêng **`substring()`** trả về một đối tượng `String` và **không làm đổi** `StringBuilder`.
3. **So sánh bằng:**
   * `==` so sánh tham chiếu.
   * `equals()` trên `String` so sánh nội dung ký tự.
   * **`equals()` trên `StringBuilder` KHÔNG so sánh nội dung** (mà so sánh tham chiếu `==` vì chưa override).
4. **Mảng (`Array`):**
   * Sử dụng thuộc tính `length` (không có dấu ngoặc).
   * `Arrays.sort()` sắp xếp theo quy tắc "7Up" (Số $<$ Chữ Hoa $<$ Chữ Thường).
   * `Arrays.binarySearch()` **chỉ hoạt động chính xác khi mảng đã sắp xếp**. Không tìm thấy trả về `-insertion_point - 1`.
   * `Arrays.compare()` trả về `0`, số âm hoặc số dương. `Arrays.mismatch()` trả về `-1` nếu bằng nhau hoặc chỉ số sai khác đầu tiên.
5. **API `Math`:**
   * `Math.round(float)` trả về `int`; `Math.round(double)` trả về `long`.
   * `Math.ceil()` và `Math.floor()` luôn nhận và trả về `double`.
   * `Math.pow()` luôn trả về `double`.
6. **API Ngày Giờ `java.time`:**
   * Mọi lớp trong `java.time` đều **bất biến (Immutable)**.
   * Tất cả constructor là `private` $\rightarrow$ Khởi tạo bằng `.now()` hoặc `.of(...)`, **cấm dùng `new`**.
   * Tháng đánh số từ `1` đến `12`.
   * `Period` chỉ dùng cho ngày (năm, tháng, ngày). Cấm xâu chuỗi tĩnh (`Period.ofYears(1).ofDays(2)` chỉ ra 2 ngày).
   * `Duration` chỉ dùng cho giờ (giờ, phút, giây). Ném `UnsupportedTemporalTypeException` nếu cộng vào `LocalDate`.
   * Nắm vững hiện tượng nhảy giờ mùa xuân (mất 1 tiếng lúc 2:00 AM) và lùi giờ mùa thu (lặp lại 1 tiếng lúc 2:00 AM) của múi giờ Hoa Kỳ.
