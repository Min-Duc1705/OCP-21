# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chapter 14: I/O (NIO.2 & Serialization)

> **Nguồn trích dẫn:** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Trang 1302–1316).  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết từ Appendix B (Trang 1411–1418).  
> **Cách học:** Bạn hãy tự đọc đề và suy luận đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và khắc sâu các bẫy thi của Oracle.

---

### Câu 1 (Question 1)
**Lớp nào sau đây là phù hợp nhất để đọc một file nhị phân (binary file) chuyển thành một đối tượng Java (Java object)?**

* A. `BufferedStream`
* B. `FileReader`
* C. `ObjectInputStream`
* D. `ObjectReader`
* E. `ObjectOutputStream`
* F. `ObjectWriter`
* G. Không có đáp án nào ở trên

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Phân tích chi tiết:**
  * Yêu cầu của đề bài là đọc dữ liệu từ một tập tin nhị phân và tái tạo lại thành một đối tượng Java có cấu trúc (**Deserialization** - giải tuần tự hóa). Lớp chịu trách nhiệm cho việc này trong thư viện I/O của Java chính là **`ObjectInputStream`** (thông qua phương thức `readObject()`) $\rightarrow$ **C đúng**.
  * `ObjectOutputStream` (E) là lớp I/O dùng để **tuần tự hóa** (serialize/ghi) đối tượng ra stream, chứ không phải để đọc.
  * `FileReader` (B) là character stream dùng để đọc ký tự từ file văn bản text, không phải nhị phân.
  * Các lớp `BufferedStream`, `ObjectReader`, `ObjectWriter` (A, D, F) là các tên giả mạo, **không hề tồn tại** trong gói `java.io`.
</details>

---

### Câu 2 (Question 2)
**Giả sử `/` là thư mục gốc (root directory) trong hệ thống tập tin, những phát biểu nào sau đây là ĐÚNG? (Chọn tất cả các đáp án đúng.)**

* A. `/home/parrot` là một đường dẫn tuyệt đối (absolute path).
* B. `/home/parrot` chắc chắn là một thư mục (directory).
* C. `/home/parrot` là một đường dẫn tương đối (relative path).
* D. `new File("/home")` sẽ ném ngoại lệ nếu `/home` không tồn tại trên đĩa.
* E. `new File("/home").delete()` sẽ ném ngoại lệ nếu `/home` không tồn tại trên đĩa.
* F. Một `Reader` cung cấp cơ chế mã hóa ký tự (character encoding), giúp nó hữu ích hơn khi làm việc với chuỗi `String` so với `InputStream`.
* G. Một `Reader` cung cấp khả năng hỗ trợ đa luồng (multithreading support), giúp nó hữu ích hơn `InputStream`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, F**
* **Phân tích chi tiết:**
  * Đường dẫn bắt đầu bằng dấu `/` (root directory) là đường dẫn tuyệt đối $\rightarrow$ **A đúng**, C sai.
  * B sai vì `/home/parrot` hoàn toàn có thể là một file thông thường (không có phần mở rộng). Java và OS không bắt buộc file phải có đuôi mở rộng.
  * D sai vì việc khởi tạo `new File(...)` hay `Path.of(...)` chỉ tạo một đối tượng tham chiếu trong bộ nhớ, **không kiểm tra** sự tồn tại vật lý trên đĩa và không ném ngoại lệ nếu file/thư mục chưa tồn tại.
  * E sai vì phương thức `delete()` của `File` trả về kiểu `boolean`: trả về `false` nếu không xóa được (hoặc file không tồn tại), chứ **không ném ngoại lệ**. (Khác với `Files.delete(path)` của NIO.2 ném `NoSuchFileException`).
  * **F đúng**: Character streams (`Reader`/`Writer`) được thiết kế chuyên biệt để tự động xử lý character encoding (như UTF-8, UTF-16) khi chuyển đổi giữa byte và char/String.
  * G sai vì `Reader` không hề có tính năng đặc biệt nào tối ưu hóa riêng cho multithreading so với `InputStream`.
</details>

---

### Câu 3 (Question 3)
**Những kết quả nào sau đây có thể xảy ra khi thực thi đoạn mã sau? (Chọn tất cả các đáp án đúng.)**

```java
public static void main(String[] args) throws IOException {
   String line;
   var c = System.console();
   Writer w = c.writer();
   try (w) {
      if ((line = c.readLine("Enter your name: ")) != null)
         w.append(line);
      w.flush();
   }
}
```

* A. Mã chạy bình thường nhưng không in ra gì.
* B. Mã in ra nội dung được người dùng nhập vào.
* C. Mã hoạt động y hệt nếu bỏ `throws IOException`.
* D. Ngoại lệ `NullPointerException` có thể bị ném ra.
* E. Ngoại lệ `NullPointerException` luôn luôn bị ném ra.
* F. Ngoại lệ `NullPointerException` không bao giờ bị ném ra.
* G. Mã nguồn không biên dịch được.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, D**
* **Phân tích chi tiết:**
  * Nếu chương trình được chạy trong môi trường không có text console tương tác (ví dụ chạy trong IDE như Eclipse/IntelliJ hoặc chạy dưới dạng background service/daemon), `System.console()` sẽ trả về `null`. Khi đó, dòng `c.writer()` sẽ lập tức ném ra **`NullPointerException`** $\rightarrow$ **D đúng** (E và F sai).
  * Nếu chạy từ dòng lệnh (Terminal/Command Prompt) có console tương tác: `c` khác null, `c.readLine(...)` hiển thị lời nhắc và đọc chuỗi người dùng gõ vào, sau đó `w.append(line)` ghi chuỗi đó ra console writer và `w.flush()` đẩy ký tự ra màn hình $\rightarrow$ **B đúng** (A sai).
  * C sai vì các phương thức của `Writer` (`append`, `flush`, `close`) khai báo ném checked exception `IOException`. Nếu bỏ `throws IOException` khỏi khai báo `main`, mã sẽ không biên dịch được.
</details>

---

### Câu 4 (Question 4)
**Với giá trị nào của `path` truyền vào phương thức dưới đây thì đoạn mã được đảm bảo sẽ in ra `Success`?**

```java
public void removeBadFile(Path path) {
   if(Files.isDirectory(path))
      System.out.println(Files.deleteIfExists(path)
         ? "Success": "Try Again");
}
```

* A. `path` trỏ tới một file thông thường (regular file) trong hệ thống tập tin.
* B. `path` trỏ tới một symbolic link trong hệ thống tập tin.
* C. `path` trỏ tới một thư mục rỗng (empty directory) trong hệ thống tập tin.
* D. `path` trỏ tới một thư mục có chứa nội dung (directory with content) trong hệ thống tập tin.
* E. `path` không trỏ tới bản ghi nào tồn tại trong hệ thống tập tin.
* F. Đoạn mã không biên dịch được.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F**
* **Phân tích chi tiết:**
  * **Bẫy kinh điển OCP:** Hầu hết các phương thức thao tác file trong lớp `java.nio.file.Files` (đặc biệt là các phương thức chỉnh sửa/xóa/đọc như `delete()`, `deleteIfExists()`, `copy()`, `move()`) đều khai báo ném checked exception **`IOException`**.
  * Trong đoạn mã trên, phương thức `removeBadFile` **không** khai báo `throws IOException` và cũng **không** bọc lời gọi `Files.deleteIfExists(path)` trong khối `try-catch` $\rightarrow$ Trình biên dịch báo lỗi ngay tại dòng gọi `Files.deleteIfExists` $\rightarrow$ **F đúng**.
</details>

---

### Câu 5 (Question 5)
**Giả sử thư mục `/animals` đã tồn tại và rỗng. Kết quả của việc thực thi đoạn mã sau là gì?**

```java
Path path = Path.of("/animals");
try (var z = Files.walk(path)) {
   boolean b = z
      .filter((p,a) -> a.isDirectory() && !path.equals(p)) // x
      .findFirst().isPresent();                            // y
   System.out.print(b ? "No Sub": "Has Sub");
}
```

* A. In ra `No Sub`.
* B. In ra `Has Sub`.
* C. Mã không biên dịch được do dòng `x`.
* D. Mã không biên dịch được do dòng `y`.
* E. Kết quả không thể xác định được.
* F. Tạo ra một vòng lặp vô tận tại runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Phân tích chi tiết:**
  * Phương thức `Files.walk(path)` trả về một `Stream<Path>`.
  * Trên interface `Stream<T>`, phương thức `.filter(...)` nhận vào một `Predicate<T>` (chỉ nhận đúng **1 tham số** `T`).
  * Ở dòng `x`, lambda được truyền vào là `(p, a) -> ...` có **2 tham số** (dạng `BiPredicate`), cú pháp này là của phương thức `Files.find(Path, int, BiPredicate)` chứ không phải `Files.walk`!
  * Do đó, trình biên dịch báo lỗi tại dòng `x` vì không thể khớp `BiPredicate` với `Predicate<Path>` $\rightarrow$ **C đúng**.
</details>

---

### Câu 6 (Question 6)
**Giá trị của biến `name` sẽ là gì nếu đối tượng `Eagle` được tạo trong phương thức `main()` được tuần tự hóa (serialized) rồi giải tuần tự hóa (deserialized)?**

```java
import java.io.Serializable;

class Bird {
   protected transient String name;
   public void setName(String name) { this.name = name; }
   public String getName() { return name; }
   public Bird() {
      this.name = "Matt";
   }
}

public class Eagle extends Bird implements Serializable {
   { this.name = "Olivia"; }
   public Eagle() {
      this.name = "Bridget";
   }
   public static void main(String[] args) {
      var e = new Eagle();
      e.name = "Adeline";
   }
}
```

* A. `Adeline`
* B. `Bridget`
* C. `Matt`
* D. `Olivia`
* E. `null`
* F. Mã nguồn không biên dịch được.
* G. Mã nguồn biên dịch được nhưng ném ngoại lệ tại runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Phân tích chi tiết:**
  * Lớp con `Eagle` có `implements Serializable`, nhưng lớp cha `Bird` thì **không** implement `Serializable`.
  * **Quy tắc giải tuần tự hóa (Deserialization Rule) trong Java:**
    1. Khi giải tuần tự hóa một đối tượng, JVM **không gọi** bất kỳ constructor nào của các lớp có implement `Serializable` (ở đây là `Eagle`). Do đó, cả block khởi tạo `{ this.name = "Olivia"; }` và constructor `Eagle()` đều **không chạy**!
    2. Thay vào đó, JVM sẽ tìm lớp cha đầu tiên trong cây kế thừa **không implement Serializable** (ở đây là `Bird`) và gọi **no-argument constructor** của lớp cha đó để khởi tạo trạng thái kế thừa!
    3. Trong constructor `Bird()`, lệnh `this.name = "Matt";` được thực thi.
  * Vì vậy, sau khi deserialize, giá trị của `name` là `"Matt"` $\rightarrow$ **C đúng**.
</details>

---

### Câu 7 (Question 7)
**Giả sử rằng `/kang` tồn tại dưới dạng một symbolic link trỏ tới thư mục `/mammal/kangaroo` trong hệ thống tập tin. Những phát biểu nào sau đây là ĐÚNG về đoạn mã sau? (Chọn tất cả các đáp án đúng.)**

```java
var path = Path.of("/kang");
if(Files.isDirectory(path) && Files.isSymbolicLink(path))
   Files.createDirectory(path.resolve("joey"));
```

* A. Một thư mục mới sẽ luôn luôn được tạo thành công.
* B. Một thư mục mới có thể được tạo ra.
* C. Nếu mã tạo ra thư mục, nó có thể truy cập được tại đường dẫn `/kang/joey`.
* D. Nếu mã tạo ra thư mục, nó có thể truy cập được tại đường dẫn `/mammal/joey`.
* E. Mã nguồn không biên dịch được.
* F. Mã nguồn biên dịch được nhưng sẽ luôn luôn ném ngoại lệ tại runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, C**
* **Phân tích chi tiết:**
  * Theo mặc định trong NIO.2, `Files.isDirectory(path)` đi theo symbolic link để kiểm tra đối tượng đích (`/mammal/kangaroo`). Vì đích là thư mục nên trả về `true`. Đồng thời `Files.isSymbolicLink(path)` kiểm tra bản thân `/kang` là symbolic link nên cũng trả về `true`.
  * Biểu thức `path.resolve("joey")` trả về `/kang/joey`. Khi gọi `Files.createDirectory(...)`:
    * Nếu thư mục `/mammal/kangaroo/joey` chưa tồn tại, nó sẽ được tạo mới thành công $\rightarrow$ **B đúng** (A sai vì nếu đã tồn tại sẵn thì sẽ ném `FileAlreadyExistsException`).
    * Vì `/kang` là link trỏ tới `/mammal/kangaroo`, thư mục mới tạo sẽ nằm thực tế tại `/mammal/kangaroo/joey` và đồng thời truy cập được thông qua symlink tại `/kang/joey` $\rightarrow$ **C đúng** (D sai vì phải là `/mammal/kangaroo/joey`, không phải `/mammal/joey`).
</details>

---

### Câu 8 (Question 8)
**Giả sử file `/fox/food-schedule.csv` tồn tại với nội dung như bên dưới, kết quả đầu ra khi gọi `printData()` là gì?**

```text
/fox/food-schedule.csv 
6am,Breakfast
9am,SecondBreakfast
12pm,Lunch
6pm,Dinner
```

```java
void printData(Path path) throws IOException {
   Files.readAllLines(path) // r1
      .flatMap(p -> Stream.of(p.split(","))) // r2
       .map(q -> q.toUpperCase())            // r3
       .forEach(System.out::println);
}
```

* A. Mã không biên dịch được do dòng `r1`.
* B. Mã không biên dịch được do dòng `r2`.
* C. Mã không biên dịch được do dòng `r3`.
* D. Ném ngoại lệ tại runtime.
* E. Không in ra bất kỳ nội dung nào.
* F. Không có đáp án nào ở trên.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Phân tích chi tiết:**
  * Phương thức `Files.readAllLines(path)` trả về một **`List<String>`**, chứ **không phải** một `Stream<String>`.
  * Trên interface `List` (hoặc `Collection`), **không có** phương thức `flatMap(...)`! Phương thức `flatMap` chỉ tồn tại trên `Stream`.
  * Do đó, dòng `r2` cố gắng gọi `.flatMap(...)` trực tiếp trên đối tượng `List<String>` dẫn đến lỗi biên dịch $\rightarrow$ **B đúng**.
  * *(Lưu ý: Nếu đề dùng `Files.lines(path)`, nó mới trả về `Stream<String>` và mã sẽ chạy in ra từng từ viết hoa).*
</details>

---

### Câu 9 (Question 9)
**Cho phương thức và dữ liệu của `file1` như sau, những phát biểu nào sau đây là ĐÚNG? (Chọn tất cả các đáp án đúng.)**

```text
// file1 data
ABCDEF
```

```java
public void copyFile(File file1, File file2) throws Exception {
   var reader = new InputStreamReader(new FileInputStream(file1));
   try (var writer = new FileWriter(file2)) {
      char[] buffer = new char[5];
      while(reader.read(buffer) != -1) {
          writer.write(buffer);
          // n1
      }
   }
}
```

* A. Mã không biên dịch được vì `reader` không phải là buffered stream.
* B. Mã không biên dịch được vì `writer` không phải là buffered stream.
* C. Nội dung của file được copy là: `ABCDEF`
* D. Nội dung của file được copy là: `ABCDEFBCDE`
* E. Nội dung của file được copy không thể xác định được.
* F. Nếu ta kiểm tra `file2` tại dòng `n1` trong file system sau 5 lần lặp của vòng `while`, nó có thể vẫn đang rỗng.
* G. Nếu ta kiểm tra `file2` tại dòng `n1` trong file system sau 5 lần lặp, nó sẽ chứa chính xác 50 ký tự.
* H. Phương thức này có chứa lỗi rò rỉ tài nguyên (resource leak).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D, F, H**
* **Phân tích chi tiết:**
  * **Lỗi logic khi đọc buffer:**
    * File gốc có 6 ký tự: `ABCDEF`.
    * Lần lặp 1: `reader.read(buffer)` đọc 5 ký tự đầu $\rightarrow$ `buffer` chứa `['A', 'B', 'C', 'D', 'E']`. Ghi toàn bộ buffer vào file $\rightarrow$ file có `ABCDE`.
    * Lần lặp 2: `reader.read(buffer)` đọc 1 ký tự còn lại là `'F'` ghi đè vào vị trí `buffer[0]`. 4 vị trí còn lại trong buffer vẫn giữ nguyên giá trị cũ `['B', 'C', 'D', 'E']`. Lệnh `writer.write(buffer)` ghi toàn bộ mảng 5 ký tự `['F', 'B', 'C', 'D', 'E']`.
    * Tổng nội dung ghi ra `file2`: `ABCDEFBCDE` $\rightarrow$ **D đúng**. (Để đúng, phải dùng `writer.write(buffer, 0, length)`).
  * **F đúng**: `FileWriter` sử dụng bộ đệm (buffering). Dữ liệu có thể vẫn nằm trong bộ đệm của OS/Stream và chưa được flush/sync xuống đĩa vật lý, do đó file có thể vẫn rỗng khi kiểm tra giữa chừng.
  * **H đúng**: `reader` được mở trước khối try nhưng **không** được đưa vào try-with-resources và cũng không được gọi `.close()`, gây rò rỉ tài nguyên (resource leak).
</details>

---

### Câu 10 (Question 10)
**Những lựa chọn nào sau đây tạo ra các đối tượng `Path` một cách hợp lệ? (Chọn tất cả các đáp án đúng.)**

* A. `new Path("jaguar.txt")`
* B. `Path.get("cats","lynx.txt")`
* C. `new java.io.File("tiger.txt").toPath()`
* D. `Paths.get("ocelot.txt")`
* E. `Path.of(".")`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, D, E**
* **Phân tích chi tiết:**
  * `Path` là một **interface**, không thể khởi tạo trực tiếp bằng toán tử `new` $\rightarrow$ A sai.
  * Trên interface `Path`, phương thức factory tĩnh là `Path.of(...)`, không có `Path.get(...)` $\rightarrow$ B sai.
  * Lớp `java.io.File` có phương thức `.toPath()` để chuyển đổi sang `Path` $\rightarrow$ **C đúng**.
  * Lớp tiện ích `java.nio.file.Paths` có phương thức tĩnh `Paths.get(...)` $\rightarrow$ **D đúng**.
  * Phương thức tiện ích hiện đại `Path.of(...)` (từ Java 11) dùng để tạo `Path` $\rightarrow$ **E đúng**.
</details>

---

### Câu 11 (Question 11)
**Những lớp nào sau đây khi điền vào chỗ trống sẽ cho phép đoạn mã biên dịch thành công? (Chọn tất cả các đáp án đúng.)**

```java
var is = new BufferedInputStream(new FileInputStream("z.txt"));
InputStream wrapper = new ____________________________________________ (is);
try (wrapper) {}
```

* A. `BufferedInputStream`
* B. `BufferedReader`
* C. `BufferedWriter`
* D. `FileInputStream`
* E. `ObjectInputStream`
* F. `ObjectOutputStream`
* G. Không có lớp nào ở trên, vì dòng đầu tiên không biên dịch được.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, E**
* **Phân tích chi tiết:**
  * Biến `wrapper` có kiểu khai báo là `InputStream`, do đó lớp cần điền phải kế thừa từ `InputStream`. Ta lập tức loại `BufferedReader`, `BufferedWriter` (kế thừa từ `Reader`/`Writer`) và `ObjectOutputStream` (kế thừa từ `OutputStream`).
  * Lớp cần điền nhận vào tham số là một `InputStream` khác (`is`), nghĩa là nó phải là một **High-Level Stream** (Decorator pattern):
    * `BufferedInputStream` có constructor nhận `InputStream` $\rightarrow$ **A đúng** (hoàn toàn hợp lệ khi bọc một `BufferedInputStream` bên ngoài một `BufferedInputStream` khác).
    * `ObjectInputStream` có constructor nhận `InputStream` $\rightarrow$ **E đúng**.
  * `FileInputStream` (D) là một **Low-Level Stream**, constructor của nó nhận `File`, `String` (path) hoặc `FileDescriptor`, chứ không nhận `InputStream`.
</details>

---

### Câu 12 (Question 12)
**Kết quả của việc thực thi đoạn mã sau là gì? (Chọn tất cả các đáp án đúng.)**

```java
4: var p = Path.of("sloth.schedule");
5: var a = Files.readAttributes(p, BasicFileAttributes.class);
6: Files.mkdir(p.resolve(".backup"));
7: if(a.size()>0 && a.isDirectory()) {
8:    a.setTimes(null,null,null);
9: }
```

* A. Biên dịch và thực thi không có lỗi.
* B. Mã không biên dịch được do dòng 5.
* C. Mã không biên dịch được do dòng 6.
* D. Mã không biên dịch được do dòng 7.
* E. Mã không biên dịch được do dòng 8.
* F. Không có đáp án nào ở trên.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, E**
* **Phân tích chi tiết:**
  * Ở dòng 6: Lớp `Files` **không có** phương thức nào tên là `mkdir()`. Tên phương thức chuẩn trong NIO.2 là `Files.createDirectory()` hoặc `Files.createDirectories()`. (`mkdir()` là phương thức của lớp cũ `java.io.File`). Do đó dòng 6 không biên dịch được $\rightarrow$ **C đúng**.
  * Ở dòng 8: `BasicFileAttributes` là interface **chỉ đọc (read-only)** các thuộc tính. Để sửa đổi thời gian (set file times), ta phải dùng view tương ứng là `BasicFileAttributeView` thông qua `Files.getFileAttributeView(...)`. Đối tượng `BasicFileAttributes` không có phương thức `setTimes()` $\rightarrow$ Dòng 8 không biên dịch được $\rightarrow$ **E đúng**.
</details>

---

### Câu 13 (Question 13)
**Những phát biểu nào sau đây là ĐÚNG về Serialization trong Java? (Chọn tất cả các đáp án đúng.)**

* A. Tất cả các thành viên instance không null (non-null instance members) của lớp đều phải serializable hoặc được đánh dấu `transient`.
* B. Các `Record` tự động có khả năng serializable mà không cần khai báo gì.
* C. Serialization là quá trình chuyển đổi dữ liệu thành các đối tượng Java.
* D. `Serializable` là một functional interface.
* E. Lớp bắt buộc phải khai báo một biến static `serialVersionUID`.
* F. Lớp phải kế thừa (extend) lớp `Serializable`.
* G. Lớp phải hiện thực (implement) interface `Serializable`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, G**
* **Phân tích chi tiết:**
  * Để một class có thể serialize được, nó phải `implements Serializable` $\rightarrow$ **G đúng** (F sai vì `Serializable` là interface, không phải class).
  * Trong quá trình serialization, mọi trường instance không phải `transient` và không phải `static` đều phải là kiểu tuần tự hóa được (nếu trỏ tới một object không serializable sẽ ném `NotSerializableException` tại runtime) $\rightarrow$ **A đúng**.
  * B sai vì ngay cả `record` cũng bắt buộc phải khai báo `implements Serializable` mới được phép serialize.
  * C sai vì chuyển đổi byte/data thành Java object gọi là **Deserialization** (giải tuần tự hóa).
  * D sai vì `java.io.Serializable` là một **Marker Interface** (interface rỗng, không chứa bất kỳ phương thức nào, do đó không phải functional interface).
  * E sai vì khai báo `serialVersionUID` là khuyến nghị thực hành tốt (best practice), không bắt buộc về mặt cú pháp.
</details>

---

### Câu 14 (Question 14)
**Kết quả đầu ra của đoạn mã sau là gì? (Chọn ba đáp án.)**

```java
22: var p1 = Path.of("/zoo/./bear","../food.txt");
23: p1.normalize().relativize(Path.of("/lion"));
24: System.out.println(p1);
25:
26: var p2 = Path.of("/zoo/animals/bear/koala/food.txt");
27: System.out.println(p2.subpath(1,3).getName(1));
28:
29: var p3 = Path.of("/pets/../cat.txt");
30: var p4 = Path.of("./dog.txt");
31: System.out.println(p4.resolve(p3));
```

* A. `../../lion`
* B. `/zoo/./bear/../food.txt`
* C. `animals`
* D. `bear`
* E. `/pets/../cat.txt`
* F. `/pets/../cat.txt/./dog.txt`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, D, E**
* **Phân tích chi tiết:**
  * **Phần 1 (dòng 22-24):** `Path` là đối tượng **bất biến (immutable)**. Dòng 23 gọi `p1.normalize().relativize(...)` nhưng **không gán lại** kết quả cho `p1`. Do đó `p1` giữ nguyên giá trị ban đầu là `/zoo/./bear/../food.txt` $\rightarrow$ **B đúng**.
  * **Phần 2 (dòng 26-27):** Các phần tử của `p2` gồm: `[0]=zoo`, `[1]=animals`, `[2]=bear`, `[3]=koala`, `[4]=food.txt`.
    * `p2.subpath(1, 3)` lấy từ index 1 đến trước index 3 $\rightarrow$ trả về relative path `animals/bear`.
    * Trên đường dẫn `animals/bear`, index `[0]` là `animals`, index `[1]` là `bear`.
    * Do đó `.getName(1)` trả về `bear` $\rightarrow$ **D đúng**.
  * **Phần 3 (dòng 29-31):** Quy tắc của phương thức `resolve()`: Nếu đối tượng truyền vào là một **đường dẫn tuyệt đối (absolute path)**, thì `resolve()` sẽ trả về chính đường dẫn tuyệt đối đó! Ở đây `p3` bắt đầu bằng `/` nên là đường dẫn tuyệt đối $\rightarrow$ `p4.resolve(p3)` trả về chính `p3` là `/pets/../cat.txt` $\rightarrow$ **E đúng**.
</details>

---

### Câu 15 (Question 15)
**Giả sử thư mục làm việc hiện tại là `/weather` và đường dẫn tuyệt đối `/weather/winter/snow.dat` đại diện cho một file tồn tại trong hệ thống tập tin. Những dòng mã nào sau đây tạo ra một đối tượng đại diện cho file này? (Chọn tất cả các đáp án đúng.)**

* A. `new File("/weather", "winter", "snow.dat")`
* B. `new File("/weather/winter/snow.dat")`
* C. `new File("/weather/winter", new File("snow.dat"))`
* D. `new File("weather", "/winter/snow.dat")`
* E. `new File(new File("/weather/winter"), "snow.dat")`
* F. `Path.of("/weather/winter/snow.dat").toFile()`
* G. Không có đáp án nào ở trên.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, E, F**
* **Phân tích chi tiết:**
  * Lớp `File` chỉ có các constructor: `File(String pathname)`, `File(String parent, String child)`, `File(File parent, String child)`.
  * A sai vì không có constructor nhận 3 tham số `String`.
  * **B đúng**: Dùng constructor `File(String pathname)`.
  * C sai vì không có constructor `File(String parent, File child)`.
  * D sai vì `"weather"` là đường dẫn tương đối (thiếu dấu `/`), kết hợp với `/winter/snow.dat` không đảm bảo trỏ đúng nếu thư mục làm việc không phải root.
  * **E đúng**: Dùng constructor `File(File parent, String child)`.
  * **F đúng**: Tạo `Path` tuyệt đối rồi gọi `.toFile()` chuyển sang đối tượng `File`.
</details>

---

### Câu 16 (Question 16)
**Giả sử `zoo-data.txt` tồn tại và không rỗng. Những phát biểu nào sau đây về phương thức dưới đây là ĐÚNG? (Chọn tất cả các đáp án đúng.)**

```java
private void echo() throws IOException {
   var o = new FileWriter("new-zoo.txt");
   try (var f = new FileReader("zoo-data.txt");
      var b = new BufferedReader(f); o) {
   
      o.write(b.readLine());
   }
   o.write("");
}
```

* A. Khi chạy, phương thức tạo ra một file mới chứa một dòng văn bản.
* B. Khi chạy, phương thức tạo ra một file mới chứa hai dòng văn bản.
* C. Khi chạy, phương thức tạo ra một file mới có cùng số dòng với file gốc.
* D. Phương thức biên dịch được nhưng sẽ ném ngoại lệ tại runtime.
* E. Phương thức không biên dịch được.
* F. Phương thức sử dụng các lớp byte stream.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, D**
* **Phân tích chi tiết:**
  * Cú pháp try-with-resources cho phép đưa biến `o` đã khai báo trước đó vào danh sách tài nguyên quản lý (từ Java 9) $\rightarrow$ Mã biên dịch hoàn toàn hợp lệ (E sai).
  * Trong khối `try`: Lệnh `o.write(b.readLine())` đọc dòng đầu tiên của `zoo-data.txt` và ghi vào `new-zoo.txt` $\rightarrow$ File mới được tạo với 1 dòng văn bản $\rightarrow$ **A đúng**.
  * Khi khối `try` kết thúc, try-with-resources sẽ tự động gọi `.close()` trên tất cả các tài nguyên theo thứ tự ngược lại, bao gồm cả biến `o` (`FileWriter`).
  * Ngay sau khối try, lệnh `o.write("")` cố gắng ghi vào một `Writer` đã bị đóng $\rightarrow$ Ném ra ngoại lệ **`IOException: Stream closed`** tại runtime $\rightarrow$ **D đúng**.
  * F sai vì `FileReader`, `BufferedReader`, `FileWriter` đều là **character streams** (kế thừa từ `Reader`/`Writer`), không phải byte stream.
</details>

---

### Câu 17 (Question 17)
**Những phát biểu nào sau đây là ĐÚNG? (Chọn tất cả các đáp án đúng.)**

* A. NIO.2 bao gồm một phương thức để xóa toàn bộ một cây thư mục (directory tree).
* B. NIO.2 bao gồm một phương thức để duyệt (traverse) qua một cây thư mục.
* C. NIO.2 bao gồm các phương thức có khả năng nhận biết và xử lý symbolic link.
* D. `Files.readAttributes()` không thể truy cập các thuộc tính phụ thuộc vào hệ thống tập tin (file system dependent attributes).
* E. `Files.readAttributes()` thường mang lại hiệu năng cao hơn vì nó đọc nhiều thuộc tính cùng lúc thay vì truy cập từng thuộc tính riêng lẻ.
* F. `Files.readAttributes()` làm việc trực tiếp với đối tượng `File`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, C, E**
* **Phân tích chi tiết:**
  * A sai vì cả `Files.delete()` và `File.delete()` đều **chỉ xóa được thư mục rỗng**. Để xóa cả cây thư mục, lập trình viên phải tự viết mã duyệt và xóa từ dưới lên (hoặc dùng `walkFileTree`).
  * **B đúng**: NIO.2 cung cấp các phương thức duyệt cây thư mục mạnh mẽ như `Files.walk()`, `Files.find()`, `Files.walkFileTree()`.
  * **C đúng**: NIO.2 hỗ trợ quản lý symbolic link thông qua `Files.isSymbolicLink()`, `Files.createSymbolicLink()`, và các tùy chọn `LinkOption.NOFOLLOW_LINKS`.
  * D sai vì NIO.2 cung cấp các view chuyên biệt theo từng hệ điều hành như `DosFileAttributes`, `PosixFileAttributes` để đọc các thuộc tính riêng của file system.
  * **E đúng**: Gọi `Files.readAttributes()` đọc trọn vẹn toàn bộ thuộc tính trong **một lần gọi hệ thống (single system call)**, giảm thiểu chi phí round-trip so với việc gọi riêng lẻ `Files.size()`, `Files.isDirectory()`, `Files.getLastModifiedTime()`.
  * F sai vì `Files.readAttributes()` nhận tham số là `Path`, không phải `File`.
</details>

---

### Câu 18 (Question 18)
**Giả sử `reader` là một stream hợp lệ có các ký tự tiếp theo là `PEACOCKS`. Phát biểu nào sau đây là ĐÚNG về kết quả của đoạn mã sau?**

```java
var sb = new StringBuilder();
sb.append((char)reader.read());
reader.mark(10);
for(int i=0; i<2; i++) {
   sb.append((char)reader.read());
   reader.skip(2);
}
reader.reset();
reader.skip(0);
sb.append((char)reader.read());
System.out.println(sb.toString());
```

* A. Mã có thể in ra `PEAE`.
* B. Mã có thể in ra `PEOA`.
* C. Mã có thể in ra `PEOE`.
* D. Mã có thể in ra `PEOS`.
* E. Mã luôn luôn in ra `PEAE`.
* F. Mã luôn luôn in ra `PEOA`.
* G. Mã luôn luôn in ra `PEOE`.
* H. Mã luôn luôn in ra `PEOS`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Phân tích chi tiết:**
  * Dòng dữ liệu: `P E A C O C K S`
  * `sb.append((char)reader.read())`: Đọc ký tự đầu tiên `'P'` $\rightarrow$ `sb = "P"`. Vị trí con trỏ hiện tại đang đứng trước `'E'`.
  * `reader.mark(10)`: Đánh dấu vị trí hiện tại (ngay trước ký tự `'E'`).
  * Vòng lặp `for`:
    * Lần 1 (`i = 0`): Đọc `'E'` $\rightarrow$ `sb = "PE"`. Sau đó `skip(2)` bỏ qua `'A'` và `'C'`. Con trỏ đứng trước `'O'`.
    * Lần 2 (`i = 1`): Đọc `'O'` $\rightarrow$ `sb = "PEO"`. Sau đó `skip(2)` bỏ qua `'C'` và `'K'`. Con trỏ đứng trước `'S'`.
  * `reader.reset()`: Quay con trỏ đọc về vị trí đã đánh dấu bởi `mark(10)` (ngay trước ký tự `'E'`).
  * `reader.skip(0)`: Không bỏ qua ký tự nào.
  * `sb.append((char)reader.read())`: Đọc ký tự tiếp theo tại vị trí reset là `'E'` $\rightarrow$ `sb = "PEOE"`.
  * **Tại sao là C mà không phải G?** Phương thức `mark()` và `reset()` không được hỗ trợ bởi mọi stream. Nếu stream không hỗ trợ `markSupported()`, lời gọi `reset()` sẽ ném ngoại lệ tại runtime. Do đó kết quả là **"Mã có thể in ra PEOE" (The code may print PEOE)** $\rightarrow$ **C đúng** (G sai).
</details>

---

### Câu 19 (Question 19)
**Giả sử các thư mục và tập tin được tham chiếu đều tồn tại và không phải là symbolic links, kết quả của việc thực thi đoạn mã sau là gì?**

```java
var p1 = Path.of("/lizard",".").resolve(Path.of("walking.txt"));
var p2 = new File("/lizard/././actions/../walking.txt").toPath();
System.out.print(Files.isSameFile(p1,p2));
System.out.print(" ");
System.out.print(p1.equals(p2));
System.out.print(" ");
System.out.print(Files.mismatch(p1,p2));
```

* A. `true true -1`
* B. `true true 0`
* C. `true false -1`
* D. `true false 0`
* E. `false true -1`
* F. `false true 0`
* G. Mã không biên dịch được.
* H. Kết quả không thể xác định được.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Phân tích chi tiết:**
  * **1. `Files.isSameFile(p1, p2)`:** Phương thức này truy cập vào hệ thống tập tin vật lý và chuẩn hóa các ký hiệu dư thừa (`.` và `..`). Cả `p1` (`/lizard/./walking.txt`) và `p2` (`/lizard/././actions/../walking.txt`) đều trỏ đến cùng một tập tin thực tế `/lizard/walking.txt` $\rightarrow$ Trả về **`true`**.
  * **2. `p1.equals(p2)`:** Phương thức `equals()` của `Path` chỉ so sánh chuỗi ký tự biểu diễn đường dẫn thuần túy (syntactically) mà **không chuẩn hóa** các dấu vết `.` hay `..`. Do chuỗi biểu diễn của `p1` và `p2` khác nhau $\rightarrow$ Trả về **`false`**.
  * **3. `Files.mismatch(p1, p2)`:** Phương thức so sánh nội dung từng byte của hai tập tin. Vì hai path trỏ tới cùng một file vật lý, nội dung của chúng giống hệt nhau $\rightarrow$ Trả về **`-1`** (quy ước giống nhau hoàn toàn trả về -1; nếu khác nhau trả về vị trí byte đầu tiên bị lệch).
  * Kết hợp lại in ra: `true false -1` $\rightarrow$ **C đúng**.
</details>

---

### Câu 20 (Question 20)
**Giả sử `monkey.txt` là một file tồn tại trong thư mục làm việc hiện tại. Phát biểu nào sau đây về đoạn mã dưới đây là ĐÚNG?**

```java
Files.move(Path.of("monkey.txt"), Path.of("/animals"),
   StandardCopyOption.ATOMIC_MOVE);
```

* A. Nếu `/animals/monkey.txt` đã tồn tại, nó sẽ bị ghi đè tại runtime.
* B. Nếu `/animals` tồn tại dưới dạng một thư mục rỗng, `/animals/monkey.txt` sẽ là vị trí mới của file.
* C. Nếu thao tác di chuyển thành công và có một tiến trình khác đang theo dõi hệ thống tập tin, nó sẽ không bao giờ nhìn thấy một file ở trạng thái chưa hoàn thiện (incomplete file) tại runtime.
* D. Không có đáp án nào ở trên.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Phân tích chi tiết:**
  * Trong phương thức `Files.move(source, target)`, tham số `target` chính là **đường dẫn đầy đủ của file đích**, chứ không phải là thư mục cha chứa file!
  * Nếu `/animals` đã tồn tại và là một thư mục, `Files.move` sẽ ném ngoại lệ `FileAlreadyExistsException` tại runtime (A và B đều sai).
  * **C đúng**: Tùy chọn **`StandardCopyOption.ATOMIC_MOVE`** đảm bảo thao tác di chuyển/đổi tên file diễn ra theo tính chất nguyên tử (atomic). Bất kỳ tiến trình hoặc luồng nào khác đang quan sát hệ thống file sẽ thấy file ở vị trí cũ hoặc vị trí mới hoàn chỉnh, không bao giờ thấy file bị hỏng hoặc ở trạng thái dở dang.
</details>

---

### Câu 21 (Question 21)
**Giả sử `/monkeys` tồn tại dưới dạng một thư mục chứa nhiều file, symbolic link và thư mục con. Phát biểu nào sau đây về đoạn mã dưới đây là ĐÚNG?**

```java
var f = Path.of("/monkeys");
try (var m =
   Files.find(f, 0, (p,a) -> a.isSymbolicLink())) { // y1
      m.map(s -> s.toString())
         .collect(Collectors.toList())
         .stream()
         .filter(s -> s.toString().endsWith(".txt")) // y2
         .forEach(System.out::println);
}
```

* A. Nó sẽ in ra tất cả các symbolic link trong cây thư mục có đuôi `.txt`.
* B. Nó sẽ in ra đối tượng đích của tất cả symbolic link trong thư mục có đuôi `.txt`.
* C. Nó sẽ không in ra bất kỳ nội dung nào.
* D. Mã không biên dịch được do dòng `y1`.
* E. Mã không biên dịch được do dòng `y2`.
* F. Mã biên dịch được nhưng ném ngoại lệ tại runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Phân tích chi tiết:**
  * Hãy chú ý tham số thứ hai của `Files.find(f, 0, ...)`: **`maxDepth = 0`**!
  * Tham số độ sâu bằng `0` có nghĩa là `Files.find` **chỉ kiểm tra duy nhất bản thân đường dẫn gốc bắt đầu** (chính là `/monkeys`), nó không hề đi sâu vào bất kỳ file hay thư mục con nào bên trong.
  * Bản thân `/monkeys` là một thư mục thông thường, do đó điều kiện `a.isSymbolicLink()` trả về `false`.
  * Vì vậy, Stream `m` trả về hoàn toàn rỗng. Khi xử lý tiếp và in ra, không có phần tử nào được in $\rightarrow$ **C đúng**.
</details>

---

### Câu 22 (Question 22)
**Trường nào sau đây sẽ có giá trị `null` sau khi một đối tượng của lớp được tạo ở dòng 17 được serialize rồi deserialize bằng `ObjectOutputStream` và `ObjectInputStream`?**

```java
1:  import java.io.Serializable;
2:  import java.util.List;
3:  public class Zebra implements Serializable {
4:     private transient String name = "George";
5:     private static String birthPlace = "Africa";
6:     private transient Integer age;
7:     List<Zebra> friends = new java.util.ArrayList<>();
8:     private Object stripes = new Object();
9:     { age = 10;}
10:    public Zebra() {
11:       this.name = "Sophia";
12:    }
13:    static Zebra writeAndRead(Zebra z) {
14:       // Implementation omitted
15:    }
16:    public static void main(String[] args) {
17:       var zebra = new Zebra();
18:       zebra = writeAndRead(zebra);
19:    } }
```

* A. `age`
* B. `birthPlace`
* C. `friends`
* D. `name`
* E. `stripes`
* F. Mã nguồn không biên dịch được.
* G. Mã nguồn biên dịch được nhưng ném ngoại lệ tại runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **G**
* **Phân tích chi tiết:**
  * Lớp `Zebra` có `implements Serializable`.
  * Tuy nhiên, hãy nhìn vào dòng 8: `private Object stripes = new Object();`.
  * `stripes` là một trường instance **không được đánh dấu `transient`**, và kiểu dữ liệu của nó là `java.lang.Object`.
  * Bản thân lớp `java.lang.Object` **không hề implement `Serializable`**! (Nếu `Object` implement `Serializable` thì mọi class trong Java đều tự động serializable).
  * Khi gọi `ObjectOutputStream.writeObject(zebra)`, JVM duyệt qua các trường instance và phát hiện đối tượng `stripes` không tuần tự hóa được, lập tức ném ra **`java.io.NotSerializableException`** tại runtime $\rightarrow$ **G đúng**.
  * *(Lưu ý: Nếu bỏ trường `stripes` đi, khi deserialize thành công thì các trường `transient` như `name` và `age` sẽ nhận giá trị mặc định là `null`).*
</details>

---

### Câu 23 (Question 23)
**Những kết quả nào sau đây có thể xảy ra khi thực thi đoạn mã dưới đây? (Chọn tất cả các đáp án đúng.)**

```java
var x = Path.of("/animals/fluffy/..");
Files.walk(x.toRealPath().getParent())       // u1
   .map(p -> p.toAbsolutePath().toString()) // u2
   .filter(s -> s.endsWith(".java")) 
   .forEach(System.out::println);
```

* A. In ra một số tập tin trong thư mục gốc (root directory).
* B. In ra toàn bộ tất cả tập tin trong thư mục gốc.
* C. Ngoại lệ `FileSystemLoopException` bị ném ra tại runtime.
* D. Một ngoại lệ khác bị ném ra tại runtime.
* E. Mã không biên dịch được do dòng `u1`.
* F. Mã không biên dịch được do dòng `u2`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, D**
* **Phân tích chi tiết:**
  * Mã biên dịch hoàn toàn bình thường (E, F sai).
  * Phương thức `toRealPath()` thực hiện chuẩn hóa đường dẫn trên đĩa thực tế: `/animals/fluffy/..` trở thành `/animals`. Nếu đường dẫn này không tồn tại trong hệ thống file thực, nó sẽ lập tức ném ra `NoSuchFileException` (một checked exception con của `IOException`) $\rightarrow$ **D đúng**.
  * Nếu `/animals` tồn tại, `getParent()` của `/animals` chính là thư mục gốc `/`.
  * `Files.walk(/)` sẽ duyệt đệ quy qua toàn bộ cây thư mục bắt đầu từ thư mục gốc. Biểu thức `.filter(s -> s.endsWith(".java"))` lọc ra các file có đuôi `.java`. Nó sẽ in ra các file `.java` tìm thấy (chứ không phải in tất cả mọi file, vì các file không đuôi `.java` bị bỏ qua) $\rightarrow$ **A đúng** (B sai).
  * C sai vì `Files.walk` theo mặc định **không đi theo symbolic links** (chỉ đi theo khi truyền tùy chọn `FileVisitOption.FOLLOW_LINKS`), do đó không thể gây ra vòng lặp vô tận `FileSystemLoopException`.
</details>

---

### Câu 24 (Question 24)
**Giả sử đối tượng `source` truyền vào phương thức đại diện cho một file tồn tại. Đồng thời giả sử file `/flip/sounds.txt` cũng đã tồn tại từ trước khi thực thi phương thức này. Khi phương thức được thực thi, câu lệnh nào sau đây sao chép file chính xác tới đường dẫn `/flip/sounds.txt`?**

```java
void copyIntoFlipDirectory(Path source) throws IOException {
   var dolphinDir = Path.of("/flip");
   dolphinDir = Files.createDirectories(dolphinDir);
   var n = Path.of("sounds.txt");
   
   Files.copy(source, ____________________________________________);
}
```

* A. `dolphinDir`
* B. `dolphinDir.resolve(n), StandardCopyOption.REPLACE_EXISTING`
* C. `dolphinDir, StandardCopyOption.REPLACE_EXISTING`
* D. `dolphinDir.resolve(n)`
* E. Phương thức không biên dịch được, bất kể điền gì vào chỗ trống.
* F. Phương thức biên dịch được nhưng luôn ném ngoại lệ tại runtime, bất kể điền gì vào chỗ trống.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Phân tích chi tiết:**
  * Lệnh `Files.createDirectories(...)` không ném ngoại lệ nếu thư mục đích đã tồn tại sẵn (khác với `createDirectory`).
  * Trong lệnh `Files.copy(source, target)`, tham số `target` phải là **đường dẫn đầy đủ của file đích**, chứ không thể là đường dẫn của thư mục cha. Do đó `target` phải là `dolphinDir.resolve(n)` (tương đương `/flip/sounds.txt`) $\rightarrow$ Loại A và C.
  * Vì đề bài nêu rõ file `/flip/sounds.txt` **đã tồn tại từ trước**, nếu không cung cấp tùy chọn `StandardCopyOption.REPLACE_EXISTING`, phương thức `Files.copy` sẽ ném ngoại lệ `FileAlreadyExistsException` tại runtime (do đó D sai).
  * Vì vậy, cú pháp đầy đủ và chính xác bắt buộc phải là `dolphinDir.resolve(n), StandardCopyOption.REPLACE_EXISTING` $\rightarrow$ **B đúng**.
</details>

---

### Câu 25 (Question 25)
**Giả sử bạn cần đọc dữ liệu văn bản (text data) từ một tập tin và muốn đạt hiệu năng cao trên các file có dung lượng lớn. Hai lớp stream nào trong gói `java.io` có thể được kết nối chuỗi (chained together) với nhau để đạt kết quả tốt nhất? (Chọn hai đáp án.)**

* A. `BufferedInputStream`
* B. `BufferedReader`
* C. `FileInputStream`
* D. `FileReader`
* E. `PrintInputStream`
* F. `ObjectInputStream`
* G. `PrintReader`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, D**
* **Phân tích chi tiết:**
  * Đề bài yêu cầu đọc dữ liệu dạng văn bản ký tự (**text data**), do đó ta phải sử dụng nhóm **Character Streams** (`Reader`/`Writer`), loại bỏ các lớp byte streams: `BufferedInputStream`, `FileInputStream`, `ObjectInputStream` (A, C, F).
  * Các lớp `PrintInputStream` và `PrintReader` (E, G) là các tên giả mạo, **không hề tồn tại** trong Java.
  * Để đọc từ file text với hiệu năng cao (đệm dữ liệu vào bộ nhớ thay vì đọc từng ký tự từ đĩa vật lý), mô hình chuẩn trong `java.io` là bọc một `BufferedReader` (High-Level Stream) quanh một `FileReader` (Low-Level Stream):
    ```java
    var reader = new BufferedReader(new FileReader("large-file.txt"));
    ```
  * Do đó, hai lớp cần chọn là **`BufferedReader`** và **`FileReader`** $\rightarrow$ **B, D đúng**.
</details>
