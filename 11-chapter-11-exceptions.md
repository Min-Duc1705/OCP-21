# Sổ Tay Chuyên Sâu: Chapter 11 - Exceptions and Localization

> **Tài liệu tham chiếu chuẩn OCP Java SE 21:**  
> Sách: *OCP Oracle Certified Professional Java SE 21 Developer Study Guide*  
> Tác giả: Jeanne Boyarsky & Scott Selikoff (Sybex / Wiley)  
> Phạm vi: Trang 905 – 990 (PDF)

---

## 🗺️ Bản Đồ Kiến Thức Chương 11 (Chapter Overview)

Trong quá trình phát triển ứng dụng Java thực tế cũng như trong bài thi chứng chỉ OCP 21, việc xử lý lỗi (Exception Handling) và khả năng thích ứng với các thị trường toàn cầu (Localization & Formatting) là hai thước đo quan trọng đánh giá độ tin cậy và chuyên nghiệp của một lập trình viên cấp cao.

Chương này được cấu trúc thành 6 trụ cột cốt lõi:
1. **Bản chất của Ngoại lệ & Cây phân cấp (Exception Hierarchy):** `Throwable`, `Error`, `Exception`, Checked Exception vs `RuntimeException` (Unchecked Exception), Quy tắc Handle or Declare, và Quy tắc ghi đè phương thức.
2. **Nhận diện các loại Ngoại lệ & Lỗi phổ biến:** Bảng tổng hợp các `RuntimeException`, `Checked Exception`, và `Error` thường gặp trong đề thi Oracle.
3. **Câu lệnh `try-catch-finally` & Khối `multi-catch`:** Thứ tự bắt ngoại lệ (từ hẹp đến rộng), quy tắc unreachable code với checked exception, hành vi của `finally`, và cú pháp `multi-catch` (biến final, disjoint types).
4. **Câu lệnh `try-with-resources` & Ngoại lệ bị nén (Suppressed Exceptions):** Giao diện `AutoCloseable` vs `Closeable`, quy tắc đóng ngược LIFO, thứ tự thực thi toàn diện, và cách xử lý `getSuppressed()`.
5. **Định dạng & Đa văn hoá bản địa (Formatting & Localization):** `Locale`, `Locale.Category`, định dạng số/tiền tệ với `NumberFormat` & `DecimalFormat`, tính năng mới Java 12 `CompactNumberFormat`, và định dạng ngày giờ với `DateTimeFormatter`.
6. **Gói tài nguyên đa ngôn ngữ (`ResourceBundle`):** Quy tắc đặt tên, thuật toán tìm kiếm Bundle chuẩn OCP (Lookup Order), và cơ chế kế thừa thuộc tính (Property Inheritance).

---

## PHẦN 1: BẢN CHẤT CỦA NGOẠI LỆ & CÂY PHÂN CẤP (EXCEPTION HIERARCHY)

Một ngoại lệ (Exception) là một sự kiện bất thường làm thay đổi luồng thực thi thông thường của chương trình.

```
                    java.lang.Throwable
                       /          \
                      /            \
       java.lang.Exception      java.lang.Error (Nghiêm trọng, không nên bắt)
          /            \
         /              \
Checked Exceptions    java.lang.RuntimeException (Unchecked Exceptions)
(Bắt buộc xử lý)     (Không bắt buộc xử lý)
```

### 1. Phân Biệt Checked vs Unchecked Exceptions

* **Checked Exceptions (Ngoại lệ kiểm tra):**
  * Bao gồm lớp `Exception` và tất cả các lớp con kế thừa từ nó, **NGOẠI TRỪ `RuntimeException` và các con của nó**.
  * Đại diện cho các tình huống bất thường có thể lường trước được (ví dụ: file không tồn tại `FileNotFoundException`, lỗi mạng `IOException`, cú pháp parse lỗi `ParseException`).
  * **Quy tắc Bắt buộc (Handle or Declare Rule):** Mọi lời gọi đến phương thức có thể ném ra checked exception bắt buộc phải:
    1. Bọc trong khối `try-catch` để xử lý (**Handle**), HOẶC
    2. Khai báo trên chữ ký phương thức bằng từ khoá `throws` (**Declare**).
* **Unchecked Exceptions (Ngoại lệ không kiểm tra / RuntimeException):**
  * Bao gồm lớp `RuntimeException` và toàn bộ các lớp con của nó.
  * Thường phát sinh do lỗi logic của lập trình viên (chia cho 0 `ArithmeticException`, con trỏ rỗng `NullPointerException`, truy cập ngoài biên mảng `ArrayIndexOutOfBoundsException`).
  * Trình biên dịch **không bắt buộc** phải xử lý hoặc khai báo bằng `throws`.
* **Errors (Lỗi hệ thống):**
  * Kế thừa trực tiếp từ `Throwable`. Đại diện cho các lỗi hệ thống nghiêm trọng của máy ảo JVM mà chương trình không nên cố gắng bắt hoặc khôi phục (như tràn ngăn xếp `StackOverflowError`, hết bộ nhớ `OutOfMemoryError`).

---

### 2. Phân Biệt Từ Khoá: `throw` vs `throws`

| Từ Khoá | Mục Đích | Vị Trí Sử Dụng | Ví Dụ |
| :--- | :--- | :--- | :--- |
| **`throw`** | Hành động chủ động **ném ra một đối tượng ngoại lệ cụ thể** tại thời điểm chạy. | Bên trong thân phương thức hoặc khối code. | `throw new IllegalArgumentException("Tuổi âm!");` |
| **`throws`** | Lời **khai báo trên chữ ký phương thức** cho biết phương thức này có thể làm phát sinh checked exception. | Ngay sau danh sách tham số phương thức. | `public void readFile() throws IOException` |

---

### 3. Quy Tắc Ghi Đè Phương Thức (Method Overriding) Với Ngoại Lệ

Khi một lớp con ghi đè một phương thức từ lớp cha hoặc interface:
1. **Về Checked Exception:** Phương thức ở lớp con **TUYỆT ĐỐI KHÔNG ĐƯỢC khai báo checked exception mới hơn hoặc rộng hơn (cha của)** checked exception đã khai báo ở lớp cha!
   * *Được phép:* Không khai báo exception nào; khai báo ít hơn; hoặc khai báo ngoại lệ là lớp con (narrower / subclass).
2. **Về Unchecked Exception (`RuntimeException`):** Phương thức ở lớp con **hoàn toàn có quyền khai báo bất kỳ `RuntimeException` nào** (dù lớp cha không hề khai báo).

```java
class Hopper {
   public void hop() throws IOException {}
}

class Bunny extends Hopper {
   // HỢP LỆ: Khai báo lớp con của IOException
   public void hop() throws FileNotFoundException {} 
}

class Kangaroo extends Hopper {
   // HỢP LỆ: Không khai báo exception nào
   public void hop() {} 
}

class Frog extends Hopper {
   // HỢP LỆ: Khai báo RuntimeException bất kỳ
   public void hop() throws NullPointerException, IllegalStateException {} 
}

class Toad extends Hopper {
   // LỖI BIÊN DỊCH: Exception rộng hơn IOException của lớp cha!
   public void hop() throws Exception {} 
}

class Turtle extends Hopper {
   // LỖI BIÊN DỊCH: SQLException là checked exception mới hoàn toàn!
   public void hop() throws SQLException {} 
}
```

---

### 4. Ba Cách In Thông Tin Ngoại Lệ

```java
try {
   hop();
} catch (Exception e) {
   // Cách 1: In tên lớp ngoại lệ kèm message
   System.out.println(e); 
   // Ví dụ: java.lang.IllegalStateException: Cannot hop
   
   // Cách 2: Chỉ in chuỗi thông điệp lỗi (message)
   System.out.println(e.getMessage()); 
   // Ví dụ: Cannot hop
   
   // Cách 3: In toàn bộ vết ngăn xếp (stack trace) ra System.err
   e.printStackTrace(); 
}
```

---

## PHẦN 2: NHẬN DIỆN CÁC LOẠI NGOẠI LỆ TRONG KỲ THI OCP

### 1. Bảng 11.2: Các Unchecked Exceptions Phổ Biến (`RuntimeException`)

| Ngoại Lệ | Hoàn Cảnh Phát Sinh |
| :--- | :--- |
| **`ArithmeticException`** | Phép toán số học nguyên thuỷ không hợp lệ (ví dụ: chia số nguyên cho `0`). *(Lưu ý: số thực `double` chia cho `0.0` cho ra `Infinity`, KHÔNG ném ngoại lệ!)* |
| **`ArrayIndexOutOfBoundsException`** | Truy cập mảng với chỉ số âm hoặc $\ge$ độ dài mảng (`array.length`). |
| **`ClassCastException`** | Ép kiểu đối tượng sang một kiểu không tương thích trong cây kế thừa. |
| **`NullPointerException`** | Gọi phương thức, truy cập thuộc tính trên tham chiếu `null`. *(Java 21 cung cấp Friendly NPE chỉ rõ chính xác biến nào bị null)*. |
| **`IllegalArgumentException`** | Phương thức nhận tham số không hợp lệ do caller truyền vào (ví dụ set tuổi $< 0$). |
| **`NumberFormatException`** | Cố gắng chuyển đổi một chuỗi không hợp lệ thành số (`Integer.parseInt("abc")`). Là lớp con của `IllegalArgumentException`. |
| **`IllegalStateException`** | Đối tượng đang ở trạng thái không phù hợp để thực thi hành động (ví dụ: gọi phương thức trên Stream đã đóng, hoặc `Iterator.remove()` trước khi gọi `next()`). |
| **`UnsupportedOperationException`** | Phương thức không được hỗ trợ bởi đối tượng hiện tại (ví dụ: gọi `add()` trên danh sách bất biến `List.of()`, hoặc gọi `addFirst()` trên `TreeSet`). |
| **`MissingResourceException`** | Không tìm thấy file `ResourceBundle` hoặc không tìm thấy `key` trong bundle. |
| **`DateTimeParseException`** | Parse chuỗi ngày giờ không khớp định dạng (`LocalDate.parse("invalid")`). |

---

### 2. Bảng 11.3: Các Checked Exceptions Phổ Biến (`Exception`)

| Ngoại Lệ | Hoàn Cảnh Phát Sinh |
| :--- | :--- |
| **`IOException`** | Sự cố đọc/ghi dữ liệu, mạng, đĩa cứng hoặc stream I/O bị ngắt. |
| **`FileNotFoundException`** | Cố gắng truy cập file không tồn tại trên ổ đĩa. Là lớp con trực tiếp của `IOException`. |
| **`ParseException`** | Parse chuỗi văn bản không thành công khi dùng `NumberFormat.parse()` hoặc `SimpleDateFormat`. |
| **`SQLException`** | Lỗi truy vấn cơ sở dữ liệu JDBC, kết nối DB thất bại hoặc câu lệnh SQL sai cú pháp. |

---

### 3. Bảng 11.4: Các Lỗi Hệ Thống Nghiêm Trọng (`Error`)

| Lỗi (Error) | Hoàn Cảnh Phát Sinh |
| :--- | :--- |
| **`ExceptionInInitializerError`** | Phát sinh khi có một **ngoại lệ xảy ra trong khối khởi tạo tĩnh (`static { ... }`)** hoặc khi gán giá trị cho một biến tĩnh `static`. |
| **`StackOverflowError`** | Ngăn xếp hàm bị tràn bộ nhớ do **đệ quy vô tận (infinite recursion)** hoặc gọi phương thức lồng nhau quá sâu. |
| **`NoClassDefFoundError`** | Lớp đã tồn tại lúc biên dịch (compile-time) nhưng máy ảo JVM không thể tìm thấy file `.class` lúc thực thi (runtime). |
| **`OutOfMemoryError`** | Bộ nhớ Heap của JVM bị cạn kiệt, không thể cấp phát thêm đối tượng mới dù Garbage Collector đã dọn dẹp. |

> [!CAUTION]
> **Bẫy thi về `ExceptionInInitializerError`:**
> ```java
> public class StaticTest {
>    static {
>       int x = 10 / 0; // Gây ra ArithmeticException bên trong khối static!
>    }
>    public static void main(String[] args) {}
> }
> ```
> *Chương trình khi chạy sẽ ném ra:* **`java.lang.ExceptionInInitializerError`**, bên trong nó bọc nguyên nhân gốc là `ArithmeticException`!

---

## PHẦN 3: CÂU LỆNH `try-catch-finally` & KHỐI `multi-catch`

### 1. Cú Pháp Cơ Bản Của Khối `try`

Một câu lệnh `try` truyền thống **bắt buộc phải có ít nhất một khối `catch` HOẶC một khối `finally`** (hoặc cả hai):
* `try-catch`
* `try-finally` (vẫn hợp lệ về mặt biên dịch!)
* `try-catch-finally`

---

### 2. Quy Tắc Sắp Xếp Thứ Tự Các Khối `catch`

> [!IMPORTANT]
> **Quy tắc: Từ Hẹp đến Rộng (Subclass đứng trước Superclass)**  
> Java kiểm tra các khối `catch` tuần tự từ trên xuống dưới. Do đó, các lớp con chuyên biệt phải được bắt trước, lớp cha tổng quát phải đặt ở dưới cùng. Nếu đặt lớp cha trước lớp con, lớp con sẽ trở thành **mã chết (unreachable code)** và dẫn đến **LỖI BIÊN DỊCH**!

```java
try {
   openFile();
} catch (FileNotFoundException e) { // Lớp con bắt trước: HỢP LỆ!
   System.out.println("File không tìm thấy!");
} catch (IOException e) {           // Lớp cha bắt sau: HỢP LỆ!
   System.out.println("Lỗi IO chung!");
} catch (Exception e) {            // Lớp cha cao nhất ở cuối cùng: HỢP LỆ!
   System.out.println("Lỗi ngoại lệ khác!");
}
```

---

### 3. Bẫy Thi: Bắt Checked Exception Không Bao Giờ Xảy Ra

Trình biên dịch Java rất nghiêm ngặt: Nếu trong khối `try` **hoàn toàn không có bất kỳ dòng lệnh nào có khả năng ném ra một checked exception cụ thể**, thì việc bạn cố tình viết `catch` cho checked exception đó sẽ bị **LỖI BIÊN DỊCH**!

```java
public void test() {
   try {
      System.out.println("Hello");
   } catch (IOException e) { // LỖI BIÊN DỊCH: IOException không bao giờ được ném trong try!
      System.out.println("Catch");
   }
}
```
*(Lưu ý: Quy tắc này **KHÔNG ÁP DỤNG** cho `Exception` chung hoặc `RuntimeException`! Bạn luôn luôn được phép bắt `catch (Exception e)` hoặc `catch (RuntimeException e)`).*

---

### 4. Hành Vi Của Khối `finally`

* Khối `finally` **LUÔN LUÔN ĐƯỢC THỰC THI**, bất kể:
  * Khối `try` chạy thành công không có ngoại lệ.
  * Khối `try` phát sinh ngoại lệ và được bắt bởi `catch`.
  * Khối `try` phát sinh ngoại lệ nhưng KHÔNG được bắt.
  * Trong `try` hoặc `catch` có lệnh `return`.
* **Trường hợp duy nhất `finally` KHÔNG chạy:** Khi máy ảo JVM bị dừng cưỡng bức bằng lệnh **`System.exit(0)`** hoặc mất nguồn điện, hệ điều hành kill process.
* **Bẫy thi giá trị trả về trong `finally`:**
  ```java
  public static int calculate() {
     try {
        return 10;
     } catch (Exception e) {
        return 20;
     } finally {
        return 30; // Ghi đè toàn bộ các lệnh return trước đó!
     }
  }
  // Lời gọi calculate() sẽ trả về: 30!
  ```

---

### 5. Khối `multi-catch` (Java 7+)

Cú pháp cho phép gộp nhiều kiểu ngoại lệ vào chung một khối `catch` bằng dấu gạch đứng `|`:

```java
try {
   parseData();
} catch (NumberFormatException | DateTimeParseException e) {
   System.out.println("Dữ liệu định dạng sai: " + e.getMessage());
}
```

> [!CAUTION]
> **Hai quy tắc vàng của `multi-catch` trong kỳ thi OCP:**
> 1. **Biến ngoại lệ `e` là NGẦM ĐỊNH `final`:** Bạn không được phép gán lại giá trị cho `e` bên trong khối multi-catch (`e = new Exception();` $\rightarrow$ LỖI BIÊN DỊCH).
> 2. **Quy tắc không quan hệ kế thừa (Disjoint Types):** Không được liệt kê hai ngoại lệ có quan hệ cha-con trong cùng một multi-catch:
> ```java
> catch (FileNotFoundException | IOException e) {} // LỖI BIÊN DỊCH!
> // FileNotFoundException là con của IOException -> Vi phạm tính rời rạc (Redundant)!
> ```

---

## PHẦN 4: CÂU LỆNH `try-with-resources` & NGOẠI LỆ BỊ NÉN (SUPPRESSED EXCEPTIONS)

### 1. Bản Chất Của `try-with-resources`

Trước Java 7, việc đóng file, đóng socket, đóng database trong khối `finally` rất cồng kềnh và dễ phát sinh lỗi lồng nhau.  
`try-with-resources` cho phép khai báo một hoặc nhiều tài nguyên trong cặp ngoặc đơn `try (...)`. Khi khối `try` kết thúc (bình thường hoặc do ngoại lệ), Java sẽ **tự động gọi phương thức `close()`** trên các tài nguyên đó.

#### Điều Kiện Tiên Quyết:
Đối tượng tài nguyên bắt buộc phải triển khai giao diện **`java.lang.AutoCloseable`** (hoặc `java.io.Closeable`):
```java
public interface AutoCloseable {
   void close() throws Exception;
}
```

---

### 2. Cú Pháp Khai Báo Tài Nguyên

```java
// Khai báo nhiều tài nguyên (phân cách bằng dấu chấm phẩy ;):
try (var is = new FileInputStream("in.txt");
     var os = new FileOutputStream("out.txt")) {
   // Đọc ghi file...
} // Tự động đóng os trước, sau đó đóng is!
```

> [!NOTE]
> **Các đặc điểm cú pháp quan trọng:**
> * Không bắt buộc phải có `catch` hay `finally` (`try (Resource r = ...) {}` là câu lệnh hoàn chỉnh).
> * Biến tài nguyên chỉ có phạm vi (**scope**) bên trong khối `try`, không nhìn thấy trong `catch` và `finally`.
> * **Tính năng Java 9:** Cho phép truyền biến đã khai báo bên ngoài vào `try (...)` nếu biến đó là `final` hoặc **`effectively final`**:
> ```java
> var reader = new FileReader("zoo.txt");
> try (reader) { // HỢP LỆ trong Java 9+ (miễn là không gán lại reader)
>    // ...
> }
> ```

---

### 3. Quy Tắc Thứ Tự Đóng Tài Nguyên (LIFO) & Thứ Tự Thực Thi Toàn Diện

> [!IMPORTANT]
> **Thứ tự thực thi bất di bất dịch của `try-with-resources`:**
> 1. Khởi tạo tài nguyên theo thứ tự từ trái qua phải.
> 2. Thực thi phần thân khối `try`.
> 3. **Tự động đóng tài nguyên theo thứ tự NGƯỢC LẠI (LIFO - Last In, First Out)**!
> 4. Thực thi các khối `catch` do lập trình viên viết (nếu có).
> 5. Thực thi khối `finally` do lập trình viên viết (nếu có).
>
> *(Điều này đồng nghĩa: Khi khối `catch` hoặc `finally` chạy, TẤT CẢ TÀI NGUYÊN ĐÃ BỊ ĐÓNG XONG TỪ TRƯỚC!).*

```java
public class Cage implements AutoCloseable {
   String name;
   public Cage(String name) { this.name = name; }
   public void close() { System.out.print("Close " + name + " -> "); }

   public static void main(String[] args) {
      try (Cage c1 = new Cage("1"); Cage c2 = new Cage("2")) {
         System.out.print("Inside Try -> ");
      } finally {
         System.out.print("Finally");
      }
   }
}
// Kết quả in ra: Inside Try -> Close 2 -> Close 1 -> Finally
```

---

### 4. Ngoại Lệ Bị Nén (Suppressed Exceptions)

Điều gì xảy ra nếu khối `try` ném ra ngoại lệ, và trong lúc tự động đóng tài nguyên, phương thức `close()` **lại tiếp tục ném ra một ngoại lệ khác**?

```java
public class JammedCage implements AutoCloseable {
   public void close() throws IllegalStateException {
      throw new IllegalStateException("Cửa lồng bị kẹt!"); // Ngoại lệ khi đóng
   }

   public static void main(String[] args) {
      try (JammedCage cage = new JammedCage()) {
         throw new RuntimeException("Gấu xổng chuồng!"); // Ngoại lệ chính (Primary)
      } catch (Exception e) {
         System.out.println("Ngoại lệ chính: " + e.getMessage());
         for (Throwable t : e.getSuppressed()) {
            System.out.println("Ngoại lệ bị nén: " + t.getMessage());
         }
      }
   }
}
```
* **Ngoại lệ chính (Primary Exception):** Là ngoại lệ ném ra trong khối `try` (`"Gấu xổng chuồng!"`). Nó sẽ được chuyển đến khối `catch`.
* **Ngoại lệ bị nén (Suppressed Exception):** Ngoại lệ phát sinh khi gọi `close()` (`"Cửa lồng bị kẹt!"`) không bị nuốt mất mà được Java tự động đính kèm vào ngoại lệ chính.
* Truy xuất thông qua phương thức: **`e.getSuppressed()`** (trả về mảng `Throwable[]`).

---

## PHẦN 5: ĐỊNH DẠNG DỮ LIỆU & ĐA VĂN HOÁ BẢN ĐỊA (FORMATTING & LOCALIZATION)

Quốc tế hoá (Internationalization - i18n) và Bản địa hoá (Localization - l10n) giúp phần mềm có thể tự điều chỉnh theo ngôn ngữ, ký hiệu tiền tệ, định dạng ngày tháng của từng quốc gia.

### 1. Khởi Tạo `Locale`

Một `Locale` bao gồm mã ngôn ngữ (chữ thường, ví dụ `en`, `vi`, `fr`) và mã quốc gia tuỳ chọn (chữ hoa, ví dụ `US`, `VN`, `FR`):

```java
// 1. Factory method hiện đại (Khuyến nghị từ Java 19+):
Locale l1 = Locale.of("fr", "FR"); // Pháp
Locale l2 = Locale.of("vi", "VN"); // Việt Nam
Locale l3 = Locale.of("en");       // Chỉ ngôn ngữ tiếng Anh

// 2. Các hằng số định sẵn:
Locale l4 = Locale.US;      // en_US
Locale l5 = Locale.GERMANY; // de_DE (Quốc gia Đức)
Locale l6 = Locale.GERMAN;  // de (Tiếng Đức nói chung)

// 3. Sử dụng Builder:
Locale l7 = new Locale.Builder().setLanguage("en").setRegion("US").build();
```

#### Phân biệt `Locale.Category` (Bảng 11.10):
* `Locale.Category.DISPLAY`: Điều khiển ngôn ngữ hiển thị giao diện, tên quốc gia, tên tháng.
* `Locale.Category.FORMAT`: Điều khiển quy cách định dạng số, tiền tệ, ngày giờ.

---

### 2. Định Dạng Số: `NumberFormat` & `DecimalFormat`

#### Bảng 11.8: Các Factory Method Của `NumberFormat`
* `NumberFormat.getInstance()` / `getNumberInstance(locale)`: Định dạng số thông thường.
* `NumberFormat.getCurrencyInstance(locale)`: Định dạng tiền tệ (kèm ký hiệu $, €, đ...).
* `NumberFormat.getPercentInstance(locale)`: Định dạng phần trăm (tự nhân với 100 và thêm `%`).
* `NumberFormat.getIntegerInstance(locale)`: Định dạng số nguyên (tự làm tròn).

```java
double price = 48.25;
var us = NumberFormat.getCurrencyInstance(Locale.US);
System.out.println(us.format(price)); // $48.25

var de = NumberFormat.getCurrencyInstance(Locale.GERMANY);
System.out.println(de.format(price)); // 48,25 €
```

#### Bảng 11.5: Các Ký Tự Mẫu Của `DecimalFormat`
* `0`: Chữ số bắt buộc (hiển thị `0` nếu không có giá trị).
* `#`: Chữ số tuỳ chọn (bỏ qua nếu là số 0 dư thừa).
* `.`: Dấu phân cách thập phân.
* `,`: Dấu phân cách nhóm hàng nghìn.

```java
double d = 123456.7;
var f1 = new DecimalFormat("###,###.00");
System.out.println(f1.format(d)); // 123,456.70
```

#### Phương thức `parse()` trên `NumberFormat`:
* Phương thức `parse()` ném ra **checked exception `ParseException`**.
* **Quy tắc đọc chuỗi của `parse()`:** Nó sẽ đọc từ đầu chuỗi và dừng lại ngay khi gặp ký tự đầu tiên không hợp lệ:
```java
NumberFormat nf = NumberFormat.getInstance(Locale.US);
System.out.println(nf.parse("456.78abc")); // Đọc được: 456.78
System.out.println(nf.parse("abc456"));    // NÉM ParseException ngay vị trí 0!
```

---

### 3. Tính Năng Mới Java 12: `CompactNumberFormat`

Được thiết kế để hiển thị số lượng lớn một cách thu gọn trong không gian hẹp (như giao diện mobile, dashboard):

```java
var formatShort = NumberFormat.getCompactNumberInstance(Locale.US, NumberFormat.Style.SHORT);
var formatLong = NumberFormat.getCompactNumberInstance(Locale.US, NumberFormat.Style.LONG);

System.out.println(formatShort.format(7_123_456)); // 7M
System.out.println(formatLong.format(7_123_456));  // 7 million

var formatDe = NumberFormat.getCompactNumberInstance(Locale.GERMANY, NumberFormat.Style.SHORT);
System.out.println(formatDe.format(7_123_456));    // 7 Mio.
```

---

### 4. Định Dạng Ngày Giờ Với `DateTimeFormatter`

#### Bảng 11.6: Các Ký Tự Quy Ước
* `y`: Năm (`yyyy` $\rightarrow$ 2026, `yy` $\rightarrow$ 26)
* `M`: Tháng (`M` $\rightarrow$ 1, `MM` $\rightarrow$ 01, `MMM` $\rightarrow$ Jan, `MMMM` $\rightarrow$ January)
* `d`: Ngày trong tháng (`d` $\rightarrow$ 5, `dd` $\rightarrow$ 05)
* `h`: Giờ định dạng 12 giờ (`1-12`); `H`: Giờ định dạng 24 giờ (`0-23`)
* `m`: Phút; `s`: Giây
* `a`: Ký hiệu sáng/chiều (am/pm)
* `'Text'`: Sử dụng nháy đơn để in chuỗi chữ nguyên bản mà không bị hiểu nhầm thành mã định dạng.

```java
LocalDate date = LocalDate.of(2026, Month.OCTOBER, 20);
LocalTime time = LocalTime.of(14, 30);
LocalDateTime dt = LocalDateTime.of(date, time);

DateTimeFormatter f = DateTimeFormatter.ofPattern("dd/MM/yyyy 'lúc' hh:mm a");
System.out.println(dt.format(f)); // 20/10/2026 lúc 02:30 PM
```

> [!CAUTION]
> **Bẫy thi không tương thích kiểu của `DateTimeFormatter`:**
> Nếu bạn dùng một mẫu định dạng chứa cả ngày và giờ để format một đối tượng chỉ có ngày (`LocalDate`), Java sẽ ném ra **`UnsupportedTemporalTypeException`** tại runtime!
> ```java
> DateTimeFormatter f = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
> LocalDate date = LocalDate.now();
> f.format(date); // NÉM UnsupportedTemporalTypeException vì LocalDate không có giờ/phút!
> ```

---

## PHẦN 6: GÓI TÀI NGUYÊN ĐA NGÔN NGỮ (`ResourceBundle`)

`ResourceBundle` chứa các cặp Key-Value định nghĩa chuỗi văn bản cho từng ngôn ngữ, giúp tách rời mã nguồn khỏi giao diện dịch thuật.

### 1. Quy Tắc Đặt Tên File Properties

File thuộc tính được đặt theo định dạng:  
**`BaseName + "_" + language + "_" + COUNTRY + ".properties"`**
* Ví dụ:
  * `Zoo.properties` (File gốc mặc định - fallback)
  * `Zoo_en.properties` (Tiếng Anh nói chung)
  * `Zoo_en_US.properties` (Tiếng Anh - Mỹ)
  * `Zoo_fr.properties` (Tiếng Pháp nói chung)
  * `Zoo_fr_FR.properties` (Tiếng Pháp - Pháp)

---

### 2. Thuật Toán Tìm Kiếm File Resource Bundle (Bảng 11.11 - Cực Kỳ Quan Trọng)

Giả sử chương trình yêu cầu Locale là **`fr_FR`** (`Locale.of("fr", "FR")`), và Locale mặc định của hệ thống máy tính đang chạy là **`en_US`**.  
Java sẽ tìm kiếm file properties theo thứ tự nghiêm ngặt sau:

| Bước | Tên File Được Tìm Kiếm | Lý Do |
| :---: | :--- | :--- |
| **1** | `Zoo_fr_FR.properties` | Khớp chính xác cả **Ngôn ngữ + Quốc gia** được yêu cầu |
| **2** | `Zoo_fr.properties` | Khớp **Ngôn ngữ** được yêu cầu (bỏ qua quốc gia) |
| **3** | `Zoo_en_US.properties` | Khớp cả **Ngôn ngữ + Quốc gia MẶC ĐỊNH của hệ thống** |
| **4** | `Zoo_en.properties` | Khớp **Ngôn ngữ MẶC ĐỊNH của hệ thống** |
| **5** | `Zoo.properties` | Khớp **Tên gốc cơ sở (Base Name)** |
| **6** | *(Không tìm thấy file nào)* | **Ném ra ngoại lệ `MissingResourceException`!** |

---

### 3. Quy Tắc Kế Thừa Thuộc Tính (Property Inheritance - Bảng 11.12)

Một khi Java đã chọn được một file bundle phù hợp ở các bước trên, khi gọi `rb.getString("hello")`, việc tìm kiếm giá trị của `key` sẽ đi ngược lên cây phả hệ cha:

$$\text{Zoo\_fr\_FR} \longrightarrow \text{Zoo\_fr} \longrightarrow \text{Zoo}$$

> [!WARNING]
> **Bẫy thi kinh điển số 1 về `ResourceBundle` trong kỳ thi OCP:**
> Nếu Java đã tìm thấy file `Zoo_fr.properties`, nhưng trong file này không có key `"hello"`, Java sẽ **tìm tiếp lên file cha `Zoo.properties`**.  
> **TUYỆT ĐỐI KHÔNG BAO GIỜ** Java quay sang tìm trong file ngôn ngữ mặc định hệ thống (`Zoo_en_US.properties` hay `Zoo_en.properties`)! Một khi đã bước vào nhánh ngôn ngữ yêu cầu (`fr`), nhánh mặc định hệ thống (`en`) bị loại bỏ hoàn toàn khỏi cây kế thừa!

---

## ⚠️ TỔNG KẾT CÁC BẪY THI OCP CHƯƠNG 11 (EXAM TRAPS CHECKLIST)

1. **Ghi đè phương thức:** Lớp con không được khai báo checked exception mới hơn hoặc rộng hơn lớp cha.
2. **`catch (FileNotFoundException | IOException e)`:** Bị lỗi biên dịch trong `multi-catch` vì 2 exception có quan hệ cha-con.
3. **Biến trong `multi-catch`:** Ngầm định là `final`, không được gán lại giá trị.
4. **Bắt Checked Exception không tồn tại:** Khối `try` không thể ném ra checked exception mà viết `catch` ngoại lệ đó sẽ bị lỗi biên dịch.
5. **Khối `finally` có lệnh `return`:** Sẽ nuốt mọi ngoại lệ và ghi đè giá trị return của `try`/`catch`.
6. **`try-with-resources` không cần `catch`/`finally`:** Chỉ cần `try (Resource r = ...) {}` là câu lệnh hợp lệ.
7. **Thứ tự đóng tài nguyên:** Luôn đóng theo thứ tự LIFO (ngược với thứ tự khai báo).
8. **Thứ tự chạy của `close()`:** Tài nguyên tự động đóng XONG XUÔI thì các khối `catch` và `finally` mới bắt đầu chạy.
9. **Ngoại lệ bị nén (`Suppressed`):** Ngoại lệ trong `close()` bị nén vào ngoại lệ trong `try`, lấy ra bằng `e.getSuppressed()`.
10. **`ExceptionInInitializerError`:** Xảy ra khi có lỗi ném ra từ khối `static` initializer.
11. **`NumberFormat.parse()`:** Ném checked exception `ParseException`, dừng đọc ngay khi gặp ký tự lạ đầu tiên.
12. **`ResourceBundle` Lookup:** Nếu tìm thấy file ngôn ngữ yêu cầu (ví dụ `_fr`), Java chỉ fallback lên file gốc (`Base.properties`), tuyệt đối KHÔNG fallback sang ngôn ngữ mặc định (`_en`).
