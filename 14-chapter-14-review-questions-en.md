# Review Questions (Bộ Câu Hỏi Ôn Tập Tiếng Anh) - Chapter 14: I/O (NIO.2 & Serialization)

> **Source (Nguồn trích dẫn):** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Pages 1302–1316).  
> **Total Questions (Số lượng):** 25 multiple-choice questions matching the official Oracle exam format, with detailed explanations from Appendix B (Pages 1411–1418).  
> **How to study (Cách học):** Read the verbatim English question and reason through the options first, then click **"👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)"** to check the official answer and deep-dive explanations in both English and Vietnamese.

---

### Question 1 (Câu 1)
**Which class would be best to use to read a binary file into a Java object?**

* A. `BufferedStream`
* B. `FileReader`
* C. `ObjectInputStream`
* D. `ObjectReader`
* E. `ObjectOutputStream`
* F. `ObjectWriter`
* G. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Since the question asks about putting data into a structured object, the best class would be one that deserializes the data. Therefore, `ObjectInputStream` is the best choice, which is option C. `ObjectWriter`, `BufferedStream`, and `ObjectReader` are not I/O stream classes. `ObjectOutputStream` is an I/O class but is used to serialize data, not deserialize it. `FileReader` can be used to read text file data and construct an object, but the question asks what would be the best class to use for binary data.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Yêu cầu của đề bài là đọc dữ liệu từ một tập tin nhị phân và tái tạo lại thành một đối tượng Java có cấu trúc (**Deserialization** - giải tuần tự hóa). Lớp chịu trách nhiệm cho việc này trong thư viện I/O của Java chính là **`ObjectInputStream`** (thông qua phương thức `readObject()`) → **C đúng**.
    * `ObjectOutputStream` (E) là lớp I/O dùng để **tuần tự hóa** (serialize/ghi) đối tượng ra stream, chứ không phải để đọc.
    * `FileReader` (B) là character stream dùng để đọc ký tự từ file văn bản text, không phải nhị phân.
    * Các lớp `BufferedStream`, `ObjectReader`, `ObjectWriter` (A, D, F) là các tên giả mạo, **không hề tồn tại** trong gói `java.io`.
</details>

---

### Question 2 (Câu 2)
**Assuming that `/` is the root directory within the file system, which of the following are true statements? (Choose all that apply.)**

* A. `/home/parrot` is an absolute path.
* B. `/home/parrot` is a directory.
* C. `/home/parrot` is a relative path.
* D. `new File("/home")` will throw an exception if `/home` does not exist.
* E. `new File("/home").delete()` will throw an exception if `/home` does not exist.
* F. A `Reader` offers character encoding, making it more useful when working with `String` data than an `InputStream`.
* G. A `Reader` offers multithreading support, making it more useful than an `InputStream`.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Paths that begin with the root directory are absolute paths, so option A is correct, and option C is incorrect. Option B is incorrect because the path could be a file or directory within the file system. There is no rule that files have to end with a file extension. Option D is incorrect, as it is possible to create a `File` reference to files and directories that do not exist. Option E is also incorrect. The `delete()` method returns `false` if the file or directory cannot be deleted. Character stream classes often include built-in convenience methods for working with `String` data, so option F is correct. There is no such optimization for multithreading, making option G incorrect.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Đường dẫn bắt đầu bằng dấu `/` (root directory) là đường dẫn tuyệt đối → **A đúng**, C sai.
    * B sai vì `/home/parrot` hoàn toàn có thể là một file thông thường (không có phần mở rộng). Java và OS không bắt buộc file phải có đuôi mở rộng.
    * D sai vì việc khởi tạo `new File(...)` hay `Path.of(...)` chỉ tạo một đối tượng tham chiếu trong bộ nhớ, **không kiểm tra** sự tồn tại vật lý trên đĩa và không ném ngoại lệ nếu file/thư mục chưa tồn tại.
    * E sai vì phương thức `delete()` của `File` trả về kiểu `boolean`: trả về `false` nếu không xóa được (hoặc file không tồn tại), chứ **không ném ngoại lệ**. (Khác với `Files.delete(path)` của NIO.2 ném `NoSuchFileException`).
    * **F đúng**: Character streams (`Reader`/`Writer`) được thiết kế chuyên biệt để tự động xử lý character encoding (như UTF-8, UTF-16) khi chuyển đổi giữa byte và char/String.
    * G sai vì `Reader` không hề có tính năng đặc biệt nào tối ưu hóa riêng cho multithreading so với `InputStream`.
</details>

---

### Question 3 (Câu 3)
**What are possible results of executing the following code? (Choose all that apply.)**

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

* A. The code runs, but nothing is printed.
* B. The code prints what was entered by the user.
* C. The code behaves the same if `throws IOException` is removed.
* D. A `NullPointerException` may be thrown.
* E. A `NullPointerException` will always be thrown.
* F. A `NullPointerException` will never be thrown.
* G. The code does not compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** If the console is unavailable, `System.console()` will return `null`, making option D correct and options E and F incorrect. The writer methods throw a checked `IOException`, making option C incorrect. The code works correctly, prompting for input and printing it. Therefore, option A is incorrect and option B is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Nếu chương trình được chạy trong môi trường không có text console tương tác (ví dụ chạy trong IDE như Eclipse/IntelliJ hoặc chạy dưới dạng background service/daemon), `System.console()` sẽ trả về `null`. Khi đó, dòng `c.writer()` sẽ lập tức ném ra **`NullPointerException`** → **D đúng** (E và F sai).
    * Nếu chạy từ dòng lệnh (Terminal/Command Prompt) có console tương tác: `c` khác null, `c.readLine(...)` hiển thị lời nhắc và đọc chuỗi người dùng gõ vào, sau đó `w.append(line)` ghi chuỗi đó ra console writer và `w.flush()` đẩy ký tự ra màn hình → **B đúng** (A sai).
    * C sai vì các phương thức của `Writer` (`append`, `flush`, `close`) khai báo ném checked exception `IOException`. Nếu bỏ `throws IOException` khỏi khai báo `main`, mã sẽ không biên dịch được.
</details>

---

### Question 4 (Câu 4)
**For which value of `path` sent to this method would it be guaranteed for the following code to output `Success`?**

```java
public void removeBadFile(Path path) {
   if(Files.isDirectory(path))
      System.out.println(Files.deleteIfExists(path)
         ? "Success": "Try Again");
}
```

* A. `path` refers to a regular file in the file system.
* B. `path` refers to a symbolic link in the file system.
* C. `path` refers to an empty directory in the file system.
* D. `path` refers to a directory with content in the file system.
* E. `path` does not refer to a record that exists within the file system.
* F. The code does not compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code does not compile, as `Files.deleteIfExists()` declares the checked `IOException` that must be handled or declared. Remember, most `Files` methods declare `IOException`, especially the ones that modify a file or directory. For this reason, option F is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Bẫy kinh điển OCP:** Hầu hết các phương thức thao tác file trong lớp `java.nio.file.Files` (đặc biệt là các phương thức chỉnh sửa/xóa/đọc như `delete()`, `deleteIfExists()`, `copy()`, `move()`) đều khai báo ném checked exception **`IOException`**.
    * Trong đoạn mã trên, phương thức `removeBadFile` **không** khai báo `throws IOException` và cũng **không** bọc lời gọi `Files.deleteIfExists(path)` trong khối `try-catch` → Trình biên dịch báo lỗi ngay tại dòng gọi `Files.deleteIfExists` → **F đúng**.
</details>

---

### Question 5 (Câu 5)
**Assume that the directory `/animals` exists and is empty. What is the result of executing the following code?**

```java
Path path = Path.of("/animals");
try (var z = Files.walk(path)) {
   boolean b = z
      .filter((p,a) -> a.isDirectory() && !path.equals(p)) // x
      .findFirst().isPresent();                            // y
   System.out.print(b ? "No Sub": "Has Sub");
}
```

* A. It prints `No Sub`.
* B. It prints `Has Sub`.
* C. The code will not compile because of line `x`.
* D. The code will not compile because of line `y`.
* E. The output cannot be determined.
* F. It produces an infinite loop at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `filter()` operation applied to a `Stream<Path>` takes only one parameter, not two, so the code does not compile, and option C is correct. If the code were rewritten to use the `Files.find()` method with the `BiPredicate` as input (along with a `maxDepth` value), the output would be option B, `Has Sub`, since the directory is given to be empty. For fun, we reversed the expected output of the ternary operation.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Phương thức `Files.walk(path)` trả về một `Stream<Path>`.
    * Trên interface `Stream<T>`, phương thức `.filter(...)` nhận vào một `Predicate<T>` (chỉ nhận đúng **1 tham số** `T`).
    * Ở dòng `x`, lambda được truyền vào là `(p, a) -> ...` có **2 tham số** (dạng `BiPredicate`), cú pháp này là của phương thức `Files.find(Path, int, BiPredicate)` chứ không phải `Files.walk`!
    * Do đó, trình biên dịch báo lỗi tại dòng `x` vì không thể khớp `BiPredicate` với `Predicate<Path>` → **C đúng**.
</details>

---

### Question 6 (Câu 6)
**What would be the value of `name` if the instance of `Eagle` created in the `main()` method were serialized and then deserialized?**

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
* F. The code does not compile.
* G. The code compiles but throws an exception at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles and runs without issue, so options F and G are incorrect. The key here is that while `Eagle` is serializable, its parent class, `Bird`, is not. Therefore, none of the members of `Bird` will be serialized. Even if you didn’t know that, you should know what happens on deserialization. During deserialization, Java calls the constructor of the first nonserializable parent. In this case, the `Bird` constructor is called, with `name` being set to `Matt`, making option C correct. Note that none of the constructors or instance initializers in `Eagle` is executed as part of deserialization.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Lớp con `Eagle` có `implements Serializable`, nhưng lớp cha `Bird` thì **không** implement `Serializable`.
    * **Quy tắc giải tuần tự hóa (Deserialization Rule) trong Java:**
      1. Khi giải tuần tự hóa một đối tượng, JVM **không gọi** bất kỳ constructor nào của các lớp có implement `Serializable` (ở đây là `Eagle`). Do đó, cả block khởi tạo `{ this.name = "Olivia"; }` và constructor `Eagle()` đều **không chạy**!
      2. Thay vào đó, JVM sẽ tìm lớp cha đầu tiên trong cây kế thừa **không implement Serializable** (ở đây là `Bird`) và gọi **no-argument constructor** của lớp cha đó để khởi tạo trạng thái kế thừa!
      3. Trong constructor `Bird()`, lệnh `this.name = "Matt";` được thực thi.
    * Vì vậy, sau khi deserialize, giá trị của `name` là `"Matt"` → **C đúng**.
</details>

---

### Question 7 (Câu 7)
**Assume that `/kang` exists as a symbolic link to the directory `/mammal/kangaroo` within the file system. Which of the following statements are correct about this code snippet? (Choose all that apply.)**

```java
var path = Path.of("/kang");
if(Files.isDirectory(path) && Files.isSymbolicLink(path))
   Files.createDirectory(path.resolve("joey"));
```

* A. A new directory will always be created.
* B. A new directory may be created.
* C. If the code creates a directory, it will be reachable at `/kang/joey`.
* D. If the code creates a directory, it will be reachable at `/mammal/joey`.
* E. The code does not compile.
* F. The code will compile but will always throw an exception at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code snippet will attempt to create a directory if the target of the symbolic link exists and is a directory. If the directory already exists, though, it will throw an exception. For this reason, option A is incorrect, and option B is correct. It will be created in `/mammal/kangaroo/joey` and also reachable at `/kang/joey` because of the symbolic link, making option C correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Theo mặc định trong NIO.2, `Files.isDirectory(path)` đi theo symbolic link để kiểm tra đối tượng đích (`/mammal/kangaroo`). Vì đích là thư mục nên trả về `true`. Đồng thời `Files.isSymbolicLink(path)` kiểm tra bản thân `/kang` là symbolic link nên cũng trả về `true`.
    * Biểu thức `path.resolve("joey")` trả về `/kang/joey`. Khi gọi `Files.createDirectory(...)`:
      * Nếu thư mục `/mammal/kangaroo/joey` chưa tồn tại, nó sẽ được tạo mới thành công → **B đúng** (A sai vì nếu đã tồn tại sẵn thì sẽ ném `FileAlreadyExistsException`).
      * Vì `/kang` là link trỏ tới `/mammal/kangaroo`, thư mục mới tạo sẽ nằm thực tế tại `/mammal/kangaroo/joey` và đồng thời truy cập được thông qua symlink tại `/kang/joey` → **C đúng** (D sai vì phải là `/mammal/kangaroo/joey`, không phải `/mammal/joey`).
</details>

---

### Question 8 (Câu 8)
**Assuming that the `/fox/food-schedule.csv` file exists with the specified contents, what is the expected output of calling `printData()` on it?**

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

* A. The code will not compile because of line `r1`.
* B. The code will not compile because of line `r2`.
* C. The code will not compile because of line `r3`.
* D. It throws an exception at runtime.
* E. It does not print anything at runtime.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `readAllLines()` method returns a `List`, not a `Stream`. Therefore, the call to `flatMap()` is invalid, and option B is correct. If the `Files.lines()` method were used instead, it would print the contents of the file one capitalized word at a time with the commas removed.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Phương thức `Files.readAllLines(path)` trả về một **`List<String>`**, chứ **không phải** một `Stream<String>`.
    * Trên interface `List` (hoặc `Collection`), **không có** phương thức `flatMap(...)`! Phương thức `flatMap` chỉ tồn tại trên `Stream`.
    * Do đó, dòng `r2` cố gắng gọi `.flatMap(...)` trực tiếp trên đối tượng `List<String>` dẫn đến lỗi biên dịch → **B đúng**.
    * *(Lưu ý: Nếu đề dùng `Files.lines(path)`, nó mới trả về `Stream<String>` và mã sẽ chạy in ra từng từ viết hoa).*
</details>

---

### Question 9 (Câu 9)
**Given the following method and `file1` data, which statements are correct? (Choose all that apply.)**

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

* A. The code does not compile because `reader` is not a buffered stream.
* B. The code does not compile because `writer` is not a buffered stream.
* C. The contents of the copied file are: `ABCDEF`
* D. The contents of the copied file are: `ABCDEFBCDE`
* E. The contents of the copied file cannot be determined.
* F. If we check `file2` on line `n1` within the file system after five iterations of the `while` loop, it may be empty.
* G. If we check `file2` on line `n1` within the file system after five iterations, it will contain exactly 50 characters.
* H. This method contains a resource leak.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D, F, H**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** First, the method does compile, so options A and B are incorrect. Methods to read/write `byte[]` values exist in the abstract parent of all I/O stream classes. This implementation is not correct, though, as the return value of `read(buffer)` is not used properly. It will only correctly copy files whose character count is a multiple of 5, making option D correct and options C and E incorrect. Option F is also correct as the data may not have made it to disk yet. Option G would be correct if the `flush()` method were called after every write. Finally, option H is correct as the `reader` stream is never closed.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Lỗi logic khi đọc buffer:**
      * File gốc có 6 ký tự: `ABCDEF`.
      * Lần lặp 1: `reader.read(buffer)` đọc 5 ký tự đầu → `buffer` chứa `['A', 'B', 'C', 'D', 'E']`. Ghi toàn bộ buffer vào file → file có `ABCDE`.
      * Lần lặp 2: `reader.read(buffer)` đọc 1 ký tự còn lại là `'F'` ghi đè vào vị trí `buffer[0]`. 4 vị trí còn lại trong buffer vẫn giữ nguyên giá trị cũ `['B', 'C', 'D', 'E']`. Lệnh `writer.write(buffer)` ghi toàn bộ mảng 5 ký tự `['F', 'B', 'C', 'D', 'E']`.
      * Tổng nội dung ghi ra `file2`: `ABCDEFBCDE` → **D đúng**. (Để đúng, phải dùng `writer.write(buffer, 0, length)`).
    * **F đúng**: `FileWriter` sử dụng bộ đệm (buffering). Dữ liệu có thể vẫn nằm trong bộ đệm của OS/Stream và chưa được flush/sync xuống đĩa vật lý, do đó file có thể vẫn rỗng khi kiểm tra giữa chừng.
    * **H đúng**: `reader` được mở trước khối try nhưng **không** được đưa vào try-with-resources và cũng không được gọi `.close()`, gây rò rỉ tài nguyên (resource leak).
</details>

---

### Question 10 (Câu 10)
**Which of the following correctly create `Path` instances? (Choose all that apply.)**

* A. `new Path("jaguar.txt")`
* B. `Path.get("cats","lynx.txt")`
* C. `new java.io.File("tiger.txt").toPath()`
* D. `Paths.get("ocelot.txt")`
* E. `Path.of(".")`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C, D, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Option A is incorrect because `Path` is an abstract type so there is no constructor. Option B is incorrect because the static method in the `Path` interface is `of()`, not `get()`. Options C, D, and E are correct ways to obtain a `Path` instance.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * `Path` là một **interface**, không thể khởi tạo trực tiếp bằng toán tử `new` → A sai.
    * Trên interface `Path`, phương thức factory tĩnh là `Path.of(...)`, không có `Path.get(...)` → B sai.
    * Lớp `java.io.File` có phương thức `.toPath()` để chuyển đổi sang `Path` → **C đúng**.
    * Lớp tiện ích `java.nio.file.Paths` có phương thức tĩnh `Paths.get(...)` → **D đúng**.
    * Phương thức tiện ích hiện đại `Path.of(...)` (từ Java 11) dùng để tạo `Path` → **E đúng**.
</details>

---

### Question 11 (Câu 11)
**Which classes will allow the following to compile? (Choose all that apply.)**

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
* G. None of the above, as the first line does not compile

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code will compile if the correct classes are used, so option G is incorrect. Remember, a try-with-resources statement can use resources declared before the start of the statement. The reference type of `wrapper` is `InputStream`, so we need a class that inherits `InputStream`. We can eliminate `BufferedWriter`, `ObjectOutputStream`, and `BufferedReader` since their names do not end in `InputStream`. Next, we see the class must take another stream as input, so we need to choose the remaining streams that are high-level streams. `BufferedInputStream` is a high-level stream, so option A is correct. Even though the instance is already a `BufferedInputStream`, there’s no rule that it can’t be wrapped multiple times by a high-level stream. Option D is incorrect, as `FileInputStream` operates on a file, not another stream. Finally, option E is correct—an `ObjectInputStream` is a high-level stream that operates on other streams.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Biến `wrapper` có kiểu khai báo là `InputStream`, do đó lớp cần điền phải kế thừa từ `InputStream`. Ta lập tức loại `BufferedReader`, `BufferedWriter` (kế thừa từ `Reader`/`Writer`) và `ObjectOutputStream` (kế thừa từ `OutputStream`).
    * Lớp cần điền nhận vào tham số là một `InputStream` khác (`is`), nghĩa là nó phải là một **High-Level Stream** (Decorator pattern):
      * `BufferedInputStream` có constructor nhận `InputStream` → **A đúng** (hoàn toàn hợp lệ khi bọc một `BufferedInputStream` bên ngoài một `BufferedInputStream` khác).
      * `ObjectInputStream` có constructor nhận `InputStream` → **E đúng**.
    * `FileInputStream` (D) là một **Low-Level Stream**, constructor của nó nhận `File`, `String` (path) hoặc `FileDescriptor`, chứ không nhận `InputStream`.
</details>

---

### Question 12 (Câu 12)
**What is the result of executing the following code? (Choose all that apply.)**

```java
4: var p = Path.of("sloth.schedule");
5: var a = Files.readAttributes(p, BasicFileAttributes.class);
6: Files.mkdir(p.resolve(".backup"));
7: if(a.size()>0 && a.isDirectory()) {
8:    a.setTimes(null,null,null);
9: }
```

* A. It compiles and runs without issue.
* B. The code will not compile because of line 5.
* C. The code will not compile because of line 6.
* D. The code will not compile because of line 7.
* E. The code will not compile because of line 8.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The method to create a directory in the `Files` class is `createDirectory()`, not `mkdir()`. For this reason, line 6 does not compile, and option C is correct. In addition, the `setTimes()` method is available only on `BasicFileAttributeView`, not the read-only `BasicFileAttributes`, so line 8 will also not compile, making option E correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Ở dòng 6: Lớp `Files` **không có** phương thức nào tên là `mkdir()`. Tên phương thức chuẩn trong NIO.2 là `Files.createDirectory()` hoặc `Files.createDirectories()`. (`mkdir()` là phương thức của lớp cũ `java.io.File`). Do đó dòng 6 không biên dịch được → **C đúng**.
    * Ở dòng 8: `BasicFileAttributes` là interface **chỉ đọc (read-only)** các thuộc tính. Để sửa đổi thời gian (set file times), ta phải dùng view tương ứng là `BasicFileAttributeView` thông qua `Files.getFileAttributeView(...)`. Đối tượng `BasicFileAttributes` không có phương thức `setTimes()` → Dòng 8 không biên dịch được → **E đúng**.
</details>

---

### Question 13 (Câu 13)
**Which of the following are true statements about serialization in Java? (Choose all that apply.)**

* A. All non-null instance members of the class must be serializable or marked `transient`.
* B. Records are automatically serializable.
* C. Serialization involves converting data into Java objects.
* D. `Serializable` is a functional interface.
* E. The class must declare a static `serialVersionUID` variable.
* F. The class must extend the `Serializable` class.
* G. The class must implement the `Serializable` interface.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, G**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** For a class to be serialized, it must implement the `Serializable` interface and contain instance members that are serializable or marked `transient`. For these reasons, options A and G are correct, and option F is incorrect. Option B is incorrect because even records are required to implement `Serializable` to be serialized. Option C is incorrect because it describes deserialization. The `Serializable` interface is a marker interface that does not contain any abstract methods, making option D incorrect. While it is a good practice for a serializable class to include a static `serialVersionUID` variable, it is not required. Therefore, option E is incorrect as well.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Để một class có thể serialize được, nó phải `implements Serializable` → **G đúng** (F sai vì `Serializable` là interface, không phải class).
    * Trong quá trình serialization, mọi trường instance không phải `transient` và không phải `static` đều phải là kiểu tuần tự hóa được (nếu trỏ tới một object không serializable sẽ ném `NotSerializableException` tại runtime) → **A đúng**.
    * B sai vì ngay cả `record` cũng bắt buộc phải khai báo `implements Serializable` mới được phép serialize.
    * C sai vì chuyển đổi byte/data thành Java object gọi là **Deserialization** (giải tuần tự hóa).
    * D sai vì `java.io.Serializable` là một **Marker Interface** (interface rỗng, không chứa bất kỳ phương thức nào, do đó không phải functional interface).
    * E sai vì khai báo `serialVersionUID` là khuyến nghị thực hành tốt (best practice), không bắt buộc về mặt cú pháp.
</details>

---

### Question 14 (Câu 14)
**What is the output of the following code? (Choose three.)**

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
* C. `animal`
* D. `bear`
* E. `/pets/../cat.txt`
* F. `/pets/../cat.txt/./dog.txt`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, D, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** `Path` is immutable, so line 23 is ignored. If it were assigned to `p1`, option A would be correct. Since it is not assigned, the original value is still present, which is option B. Moving on to the second section, the `subpath()` method on line 27 is applied to the absolute path, which returns the relative path `animals/bear`. Next, the `getName()` method is applied to the relative path, and since this is indexed from 0, it returns the relative path `bear`. Therefore, option D is correct. Finally, remember calling `resolve()` with an absolute path as a parameter returns the absolute path, so option E is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Phần 1 (dòng 22-24):** `Path` là đối tượng **bất biến (immutable)**. Dòng 23 gọi `p1.normalize().relativize(...)` nhưng **không gán lại** kết quả cho `p1`. Do đó `p1` giữ nguyên giá trị ban đầu là `/zoo/./bear/../food.txt` → **B đúng**.
    * **Phần 2 (dòng 26-27):** Các phần tử của `p2` gồm: `[0]=zoo`, `[1]=animals`, `[2]=bear`, `[3]=koala`, `[4]=food.txt`.
      * `p2.subpath(1, 3)` lấy từ index 1 đến trước index 3 → trả về relative path `animals/bear`.
      * Trên đường dẫn `animals/bear`, index `[0]` là `animals`, index `[1]` là `bear`.
      * Do đó `.getName(1)` trả về `bear` → **D đúng**.
    * **Phần 3 (dòng 29-31):** Quy tắc của phương thức `resolve()`: Nếu đối tượng truyền vào là một **đường dẫn tuyệt đối (absolute path)**, thì `resolve()` sẽ trả về chính đường dẫn tuyệt đối đó! Ở đây `p3` bắt đầu bằng `/` nên là đường dẫn tuyệt đối → `p4.resolve(p3)` trả về chính `p3` là `/pets/../cat.txt` → **E đúng**.
</details>

---

### Question 15 (Câu 15)
**Suppose that the working directory is `/weather` and the absolute path `/weather/winter/snow.dat` represents a file that exists within the file system. Which of the following lines of code create an object that represents the file? (Choose all that apply.)**

* A. `new File("/weather", "winter", "snow.dat")`
* B. `new File("/weather/winter/snow.dat")`
* C. `new File("/weather/winter", new File("snow.dat"))`
* D. `new File("weather", "/winter/snow.dat")`
* E. `new File(new File("/weather/winter"), "snow.dat")`
* F. `Path.of("/weather/winter/snow.dat").toFile()`
* G. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, E, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Option A does not compile, as there is no `File` constructor that takes three parameters. Option B is correct and is the proper way to create a `File` instance with a single `String` parameter. Option C is incorrect, as there is no constructor that takes a `String` followed by a `File`. There is a constructor that takes a `File` followed by a `String`, making option E correct. Option D is incorrect because the first parameter is missing a slash (`/`) to indicate it is an absolute path. Since it’s a relative path, it is correct only when the user’s current directory is the root directory. Finally, option F is correct as it creates a `File` from a `Path`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Lớp `File` chỉ có các constructor: `File(String pathname)`, `File(String parent, String child)`, `File(File parent, String child)`.
    * A sai vì không có constructor nhận 3 tham số `String`.
    * **B đúng**: Dùng constructor `File(String pathname)`.
    * C sai vì không có constructor `File(String parent, File child)`.
    * D sai vì `"weather"` là đường dẫn tương đối (thiếu dấu `/`), kết hợp với `/winter/snow.dat` không đảm bảo trỏ đúng nếu thư mục làm việc không phải root.
    * **E đúng**: Dùng constructor `File(File parent, String child)`.
    * **F đúng**: Tạo `Path` tuyệt đối rồi gọi `.toFile()` chuyển sang đối tượng `File`.
</details>

---

### Question 16 (Câu 16)
**Assuming `zoo-data.txt` exists and is not empty, what statements about the following method are correct? (Choose all that apply.)**

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

* A. When run, the method creates a new file with one line of text in it.
* B. When run, the method creates a new file with two lines of text in it.
* C. When run, the method creates a new file with the same number of lines as the original file.
* D. The method compiles but will produce an exception at runtime.
* E. The method does not compile.
* F. The method uses byte stream classes.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The method compiles, so option E is incorrect. The method creates a `new-zoo.txt` file and copies the first line from `zoo-data.txt` into it, making option A correct. The try-with-resources statement closes all of the declared resources, including the `FileWriter` `o`. For this reason, the `Writer` is closed when the last `o.write()` is called, resulting in an `IOException` at runtime and making option D correct. Option F is incorrect because this implementation uses the character stream classes, which inherit from `Reader` or `Writer`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Cú pháp try-with-resources cho phép đưa biến `o` đã khai báo trước đó vào danh sách tài nguyên quản lý (từ Java 9) → Mã biên dịch hoàn toàn hợp lệ (E sai).
    * Trong khối `try`: Lệnh `o.write(b.readLine())` đọc dòng đầu tiên của `zoo-data.txt` và ghi vào `new-zoo.txt` → File mới được tạo với 1 dòng văn bản → **A đúng**.
    * Khi khối `try` kết thúc, try-with-resources sẽ tự động gọi `.close()` trên tất cả các tài nguyên theo thứ tự ngược lại, bao gồm cả biến `o` (`FileWriter`).
    * Ngay sau khối try, lệnh `o.write("")` cố gắng ghi vào một `Writer` đã bị đóng → Ném ra ngoại lệ **`IOException: Stream closed`** tại runtime → **D đúng**.
    * F sai vì `FileReader`, `BufferedReader`, `FileWriter` đều là **character streams** (kế thừa từ `Reader`/`Writer`), không phải byte stream.
</details>

---

### Question 17 (Câu 17)
**Which are true statements? (Choose all that apply.)**

* A. NIO.2 includes a method to delete an entire directory tree.
* B. NIO.2 includes a method to traverse a directory tree.
* C. NIO.2 includes methods that are aware of symbolic links.
* D. `Files.readAttributes()` cannot access file system dependent attributes.
* E. `Files.readAttributes()` is often more performant since it reads multiple attributes rather than accessing individual attributes.
* F. `Files.readAttributes()` works with the `File` object.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, C, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Options B and C are properties of NIO.2 and are good reasons to use it over the `java.io.File` class. Option A is incorrect as both APIs can delete only empty directories, not a directory tree. Using a view to read multiple attributes leads to fewer round-trips between the process and the file system and better performance, making option E correct. Views can be used to access file system–specific attributes that are not available in `Files` methods; therefore, option D is incorrect. `Files` is part of NIO.2, whereas `File` is part of `java.io`, which means option F is incorrect.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * A sai vì cả `Files.delete()` và `File.delete()` đều **chỉ xóa được thư mục rỗng**. Để xóa cả cây thư mục, lập trình viên phải tự viết mã duyệt và xóa từ dưới lên (hoặc dùng `walkFileTree`).
    * **B đúng**: NIO.2 cung cấp các phương thức duyệt cây thư mục mạnh mẽ như `Files.walk()`, `Files.find()`, `Files.walkFileTree()`.
    * **C đúng**: NIO.2 hỗ trợ quản lý symbolic link thông qua `Files.isSymbolicLink()`, `Files.createSymbolicLink()`, và các tùy chọn `LinkOption.NOFOLLOW_LINKS`.
    * D sai vì NIO.2 cung cấp các view chuyên biệt theo từng hệ điều hành như `DosFileAttributes`, `PosixFileAttributes` để đọc các thuộc tính riêng của file system.
    * **E đúng**: Gọi `Files.readAttributes()` đọc trọn vẹn toàn bộ thuộc tính trong **một lần gọi hệ thống (single system call)**, giảm thiểu chi phí round-trip so với việc gọi riêng lẻ `Files.size()`, `Files.isDirectory()`, `Files.getLastModifiedTime()`.
    * F sai vì `Files.readAttributes()` nhận tham số là `Path`, không phải `File`.
</details>

---

### Question 18 (Câu 18)
**Assume that `reader` is a valid stream whose next characters are `PEACOCKS`. Which is true about the output of the following code snippet?**

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

* A. The code may print `PEAE`.
* B. The code may print `PEOA`.
* C. The code may print `PEOE`.
* D. The code may print `PEOS`.
* E. The code will always print `PEAE`.
* F. The code will always print `PEOA`.
* G. The code will always print `PEOE`.
* H. The code will always print `PEOS`.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** To begin with, `P` is added to the `StringBuilder` first. Next, assuming `mark()` is supported, the position in the stream is marked before `E`. The `E` is added to the `StringBuilder`, with `AC` being skipped, and then the `O` is added to the `StringBuilder`, with `CK` being skipped. The stream is then `reset()` to the position before the `E`. The call to `skip(0)` doesn’t do anything since there are no characters to skip, so `E` is added onto the `StringBuilder` in the next `read()` call. The value `PEOE` is printed, and option C is correct. Option G is incorrect because `mark()` may not be supported.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng dữ liệu: `P E A C O C K S`
    * `sb.append((char)reader.read())`: Đọc ký tự đầu tiên `'P'` → `sb = "P"`. Vị trí con trỏ hiện tại đang đứng trước `'E'`.
    * `reader.mark(10)`: Đánh dấu vị trí hiện tại (ngay trước ký tự `'E'`).
    * Vòng lặp `for`:
      * Lần 1 (`i = 0`): Đọc `'E'` → `sb = "PE"`. Sau đó `skip(2)` bỏ qua `'A'` và `'C'`. Con trỏ đứng trước `'O'`.
      * Lần 2 (`i = 1`): Đọc `'O'` → `sb = "PEO"`. Sau đó `skip(2)` bỏ qua `'C'` và `'K'`. Con trỏ đứng trước `'S'`.
    * `reader.reset()`: Quay con trỏ đọc về vị trí đã đánh dấu bởi `mark(10)` (ngay trước ký tự `'E'`).
    * `reader.skip(0)`: Không bỏ qua ký tự nào.
    * `sb.append((char)reader.read())`: Đọc ký tự tiếp theo tại vị trí reset là `'E'` → `sb = "PEOE"`.
    * **Tại sao là C mà không phải G?** Phương thức `mark()` và `reset()` không được hỗ trợ bởi mọi stream. Nếu stream không hỗ trợ `markSupported()`, lời gọi `reset()` sẽ ném ngoại lệ tại runtime. Do đó kết quả là **"Mã có thể in ra PEOE" (The code may print PEOE)** → **C đúng** (G sai).
</details>

---

### Question 19 (Câu 19)
**Assuming that the directories and files referenced exist and are not symbolic links, what is the result of executing the following code?**

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
* G. The code does not compile.
* H. The result cannot be determined.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles and runs without issue, so option G is incorrect. If you simplify the redundant path symbols, `p1` and `p2` represent the same path, `/lizard/walking.txt`. Therefore, `isSameFile()` returns `true`. The second output is `false`, because `equals()` checks only if the path values are the same, without reducing the path symbols. Finally, `mismatch()` sees that the contents are the same and returns `-1`. For these reasons, option C is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **1. `Files.isSameFile(p1, p2)`:** Phương thức này truy cập vào hệ thống tập tin vật lý và chuẩn hóa các ký hiệu dư thừa (`.` và `..`). Cả `p1` (`/lizard/./walking.txt`) và `p2` (`/lizard/././actions/../walking.txt`) đều trỏ đến cùng một tập tin thực tế `/lizard/walking.txt` → Trả về **`true`**.
    * **2. `p1.equals(p2)`:** Phương thức `equals()` của `Path` chỉ so sánh chuỗi ký tự biểu diễn đường dẫn thuần túy (syntactically) mà **không chuẩn hóa** các dấu vết `.` hay `..`. Do chuỗi biểu diễn của `p1` và `p2` khác nhau → Trả về **`false`**.
    * **3. `Files.mismatch(p1, p2)`:** Phương thức so sánh nội dung từng byte của hai tập tin. Vì hai path trỏ tới cùng một file vật lý, nội dung của chúng giống hệt nhau → Trả về **`-1`** (quy ước giống nhau hoàn toàn trả về -1; nếu khác nhau trả về vị trí byte đầu tiên bị lệch).
    * Kết hợp lại in ra: `true false -1` → **C đúng**.
</details>

---

### Question 20 (Câu 20)
**Assume that `monkey.txt` is a file that exists in the current working directory. Which statement about the following code snippet is correct?**

```java
Files.move(Path.of("monkey.txt"), Path.of("/animals"),
   StandardCopyOption.ATOMIC_MOVE);
```

* A. If `/animals/monkey.txt` exists, it will be overwritten at runtime.
* B. If `/animals` exists as an empty directory, `/animals/monkey.txt` will be the new location of the file.
* C. If the move is successful and another process is monitoring the file system, it will not see an incomplete file at runtime.
* D. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The target path of the file after the `move()` operation is `/animals`, not `/animals/monkey.txt`, so options A and B are both incorrect. Both will throw an exception at runtime since `/animals` already exists and is a directory. The option `ATOMIC_MOVE` means that any process monitoring the file system will not see an incomplete file during the move, so option C is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Trong phương thức `Files.move(source, target)`, tham số `target` chính là **đường dẫn đầy đủ của file đích**, chứ không phải là thư mục cha chứa file!
    * Nếu `/animals` đã tồn tại và là một thư mục, `Files.move` sẽ ném ngoại lệ `FileAlreadyExistsException` tại runtime (A và B đều sai).
    * **C đúng**: Tùy chọn **`StandardCopyOption.ATOMIC_MOVE`** đảm bảo thao tác di chuyển/đổi tên file diễn ra theo tính chất nguyên tử (atomic). Bất kỳ tiến trình hoặc luồng nào khác đang quan sát hệ thống file sẽ thấy file ở vị trí cũ hoặc vị trí mới hoàn chỉnh, không bao giờ thấy file bị hỏng hoặc ở trạng thái dở dang.
</details>

---

### Question 21 (Câu 21)
**Assume that `/monkeys` exists as a directory containing multiple files, symbolic links, and subdirectories. Which statement about the following code is correct?**

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

* A. It will print all symbolic links in the directory tree ending in `.txt`.
* B. It will print the target of all symbolic links in the directory ending in `.txt`.
* C. It will print nothing.
* D. It does not compile because of line `y1`.
* E. It does not compile because of line `y2`.
* F. It compiles but throws an exception at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles and runs without issue, so options D, E, and F are incorrect. The most important thing to notice is that the depth parameter specified as the second argument to `find()` is `0`, meaning the only record that will be searched is the top-level directory. Since we know that the top directory is a directory and not a symbolic link, no other paths will be visited, and nothing will be printed. For these reasons, option C is the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Hãy chú ý tham số thứ hai của `Files.find(f, 0, ...)`: **`maxDepth = 0`**!
    * Tham số độ sâu bằng `0` có nghĩa là `Files.find` **chỉ kiểm tra duy nhất bản thân đường dẫn gốc bắt đầu** (chính là `/monkeys`), nó không hề đi sâu vào bất kỳ file hay thư mục con nào bên trong.
    * Bản thân `/monkeys` là một thư mục thông thường, do đó điều kiện `a.isSymbolicLink()` trả về `false`.
    * Vì vậy, Stream `m` trả về hoàn toàn rỗng. Khi xử lý tiếp và in ra, không có phần tử nào được in → **C đúng**.
</details>

---

### Question 22 (Câu 22)
**Which of the following fields will be `null` after an instance of the class created on line 17 is serialized and then deserialized using `ObjectOutputStream` and `ObjectInputStream`?**

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
* B. `birthplace`
* C. `friends`
* D. `name`
* E. `stripes`
* F. The code does not compile.
* G. The code compiles but throws an exception at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **G**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles, so option F is incorrect. To be serializable, a class must implement the `Serializable` interface, which `Zebra` does. It must also contain instance members that either are marked `transient` or are serializable. The instance member `stripes` is of type `Object`, which is not serializable. If `Object` implemented `Serializable`, all objects would be serializable by default, defeating the purpose of having the `Serializable` interface. Therefore, the `Zebra` class is not serializable, with the program throwing an exception at runtime if serialized and making option G correct. If `stripes` were removed from the class, options A and D would be the correct answers, as `name` and `age` are both marked `transient`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Lớp `Zebra` có `implements Serializable`.
    * Tuy nhiên, hãy nhìn vào dòng 8: `private Object stripes = new Object();`.
    * `stripes` là một trường instance **không được đánh dấu `transient`**, và kiểu dữ liệu của nó là `java.lang.Object`.
    * Bản thân lớp `java.lang.Object` **không hề implement `Serializable`**! (Nếu `Object` implement `Serializable` thì mọi class trong Java đều tự động serializable).
    * Khi gọi `ObjectOutputStream.writeObject(zebra)`, JVM duyệt qua các trường instance và phát hiện đối tượng `stripes` không tuần tự hóa được, lập tức ném ra **`java.io.NotSerializableException`** tại runtime → **G đúng**.
    * *(Lưu ý: Nếu bỏ trường `stripes` đi, khi deserialize thành công thì các trường `transient` như `name` và `age` sẽ nhận giá trị mặc định là `null`).*
</details>

---

### Question 23 (Câu 23)
**What are some possible results of executing the following code? (Choose all that apply.)**

```java
var x = Path.of("/animals/fluffy/..");
Files.walk(x.toRealPath().getParent())       // u1
   .map(p -> p.toAbsolutePath().toString()) // u2
   .filter(s -> s.endsWith(".java")) 
   .forEach(System.out::println);
```

* A. It prints some files in the root directory.
* B. It prints all files in the root directory.
* C. `FileSystemLoopException` is thrown at runtime.
* D. Another exception is thrown at runtime.
* E. The code will not compile because of line `u1`.
* F. The code will not compile because of line `u2`.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles without issue, so options E and F are incorrect. The `toRealPath()` method will simplify the path to `/animals` and throw an exception if it does not exist, making option D correct. If the path does exist, calling `getParent()` on it returns the root directory. Walking the root directory with the filter expression will print all `.java` files in the root directory (along with all `.java` files in the directory tree), making option A correct. Option B is incorrect because it will skip files and directories that do not end in the `.java` extension. Option C is also incorrect as `Files.walk()` does not follow symbolic links by default. Only if the `FOLLOW_LINKS` option is provided and a cycle is encountered will the exception be thrown.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Mã biên dịch hoàn toàn bình thường (E, F sai).
    * Phương thức `toRealPath()` thực hiện chuẩn hóa đường dẫn trên đĩa thực tế: `/animals/fluffy/..` trở thành `/animals`. Nếu đường dẫn này không tồn tại trong hệ thống file thực, nó sẽ lập tức ném ra `NoSuchFileException` (một checked exception con của `IOException`) → **D đúng**.
    * Nếu `/animals` tồn tại, `getParent()` của `/animals` chính là thư mục gốc `/`.
    * `Files.walk(/)` sẽ duyệt đệ quy qua toàn bộ cây thư mục bắt đầu từ thư mục gốc. Biểu thức `.filter(s -> s.endsWith(".java"))` lọc ra các file có đuôi `.java`. Nó sẽ in ra các file `.java` tìm thấy (chứ không phải in tất cả mọi file, vì các file không đuôi `.java` bị bỏ qua) → **A đúng** (B sai).
    * C sai vì `Files.walk` theo mặc định **không đi theo symbolic links** (chỉ đi theo khi truyền tùy chọn `FileVisitOption.FOLLOW_LINKS`), do đó không thể gây ra vòng lặp vô tận `FileSystemLoopException`.
</details>

---

### Question 24 (Câu 24)
**Assume that the `source` instance passed to the following method represents a file that exists. Also assume that `/flip/sounds.txt` exists as a file prior to executing this method. When this method is executed, which statement correctly copies the file to the path specified by `/flip/sounds.txt`?**

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
* E. The method does not compile, regardless of what is placed in the blank.
* F. The method compiles but throws an exception at runtime, regardless of what is placed in the blank.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The method compiles without issue, so option E is incorrect. Option F is also incorrect. Even though `/flip` exists, `createDirectories()` does not throw an exception if the path already exists. If `createDirectory()` were used instead, option F would be correct. Next, the `copy()` command takes a target that is the path to the new file location, not the directory to be copied into. Therefore, the target path should be `/flip/sounds.txt`, not `/flip`. For this reason, options A and C are incorrect. Since the question says the file already exists, the `REPLACE_EXISTING` option must be specified or an exception will be thrown at runtime, making option B the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Lệnh `Files.createDirectories(...)` không ném ngoại lệ nếu thư mục đích đã tồn tại sẵn (khác với `createDirectory`).
    * Trong lệnh `Files.copy(source, target)`, tham số `target` phải là **đường dẫn đầy đủ của file đích**, chứ không thể là đường dẫn của thư mục cha. Do đó `target` phải là `dolphinDir.resolve(n)` (tương đương `/flip/sounds.txt`) → Loại A và C.
    * Vì đề bài nêu rõ file `/flip/sounds.txt` **đã tồn tại từ trước**, nếu không cung cấp tùy chọn `StandardCopyOption.REPLACE_EXISTING`, phương thức `Files.copy` sẽ ném ngoại lệ `FileAlreadyExistsException` tại runtime (do đó D sai).
    * Vì vậy, cú pháp đầy đủ và chính xác bắt buộc phải là `dolphinDir.resolve(n), StandardCopyOption.REPLACE_EXISTING` → **B đúng**.
</details>

---

### Question 25 (Câu 25)
**Suppose that you need to read text data from a file and want the data to be performant on large files. Which two `java.io` stream classes can be chained together to best achieve this result? (Choose two.)**

* A. `BufferedInputStream`
* B. `BufferedReader`
* C. `FileInputStream`
* D. `FileReader`
* E. `PrintInputStream`
* F. `ObjectInputStream`
* G. `PrintReader`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Since you need to read characters, the `Reader` classes are appropriate. Therefore, you can eliminate options A, C, and F. Additionally, options E and G are incorrect, as they reference classes that do not exist. Options B and D are correct since they read from a file and buffer for performance.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Đề bài yêu cầu đọc dữ liệu dạng văn bản ký tự (**text data**), do đó ta phải sử dụng nhóm **Character Streams** (`Reader`/`Writer`), loại bỏ các lớp byte streams: `BufferedInputStream`, `FileInputStream`, `ObjectInputStream` (A, C, F).
    * Các lớp `PrintInputStream` và `PrintReader` (E, G) là các tên giả mạo, **không hề tồn tại** trong Java.
    * Để đọc từ file text với hiệu năng cao (đệm dữ liệu vào bộ nhớ thay vì đọc từng ký tự từ đĩa vật lý), mô hình chuẩn trong `java.io` là bọc một `BufferedReader` (High-Level Stream) quanh một `FileReader` (Low-Level Stream):
      ```java
      var reader = new BufferedReader(new FileReader("large-file.txt"));
      ```
    * Do đó, hai lớp cần chọn là **`BufferedReader`** và **`FileReader`** → **B, D đúng**.
</details>
