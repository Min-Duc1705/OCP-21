# Hướng Dẫn Ôn Tập OCP Java SE 21 - Chương 14: I/O (NIO.2 & Serialization)

> **Trọng tâm bài thi Oracle Certified Professional Java SE 21 Developer (Exam 1Z0-830):**
> 1. Hiểu cấu trúc hệ thống tập tin: Phân biệt đường dẫn tương đối (Relative Path) và tuyệt đối (Absolute Path); ký tự `.` (thư mục hiện tại) và `..` (thư mục cha).
> 2. Thành thạo **Path API** (`java.nio.file.Path`): Các phương thức `getNameCount()`, `getName()`, `getFileName()`, `getParent()`, `getRoot()`, `subpath()`, `isAbsolute()`, `toAbsolutePath()`, `relativize()`, `resolve()`, `normalize()`, và `toRealPath()`.
> 3. Phân loại toàn diện các luồng I/O trong `java.io`: Byte Streams vs. Character Streams, Input vs. Output, Low-Level vs. High-Level Streams (mẫu thiết kế Decorator).
> 4. Thao tác tập tin & thư mục với **`java.nio.file.Files`**: `copy()`, `move()`, `delete()`, `deleteIfExists()`, `createDirectory()`, `createDirectories()`, `isSameFile()`, `mismatch()`, `readAllLines()`, `lines()`, `readString()`, `writeString()`.
> 5. Cầu nối giữa I/O Streams và NIO.2: `Files.copy(InputStream, Path)` và `Files.copy(Path, OutputStream)`.
> 6. Cơ chế tuần tự hóa dữ liệu (**Java Serialization**): Giao diện `Serializable`, từ khóa `transient`, `serialVersionUID`, phương thức tùy biến `writeObject()`/`readObject()`, quy tắc gọi hàm dựng khi giải tuần tự hóa (đối với Class thường vs. Record).
> 7. Tương tác với người dùng qua console: `System.in`, `System.out`, `System.err`, và lớp **`java.io.Console`** (`readLine()`, `readPassword()`, kiểm tra `null`).
> 8. Phân tích thuộc tính nâng cao & duyệt cây thư mục: `BasicFileAttributes`, `BasicFileAttributeView`, `Files.readAttributes()`, `Files.list()`, `Files.walk()`, `Files.find()`, và xử lý liên kết tượng trưng (Symbolic Links / `FOLLOW_LINKS`).

---

## 1. Cấu Trúc File System, `File` (I/O) & `Path` (NIO.2)

### Hệ Thống Tập Tin & Biểu Tượng Đường Dẫn (TABLE 14.1)
* **Root Directory (Thư mục gốc):** Thư mục cao nhất trong hệ thống (`/` trên Linux/macOS; `C:\`, `D:\` trên Windows).
* **Đường dẫn tuyệt đối (Absolute Path):** Bắt đầu từ thư mục gốc, xác định vị trí duy nhất của file/thư mục mà không phụ thuộc vào thư mục làm việc hiện tại (Current Working Directory).
* **Đường dẫn tương đối (Relative Path):** Bắt đầu từ thư mục làm việc hiện tại, không bắt đầu bằng thư mục gốc.
* **Ký tự đặc biệt:**
  * `.` (Dấu chấm đơn): Đại diện cho **thư mục hiện tại**.
  * `..` (Dấu chấm kép): Đại diện cho **thư mục cha** (lùi lại một cấp thư mục).

---

### `java.io.File` (Cũ) vs. `java.nio.file.Path` (NIO.2 - Mới)
* `File` (từ Java 1.0): Là một lớp cụ thể đại diện cho một file/thư mục. Nhiều phương thức trả về `boolean` thay vì ném ngoại lệ khi thất bại (khó gỡ lỗi).
* `Path` (từ Java 7): Là một **`interface` bất biến (immutable)** nằm trong package `java.nio.file`. Hỗ trợ các thao tác đường dẫn phong phú và tích hợp chặt chẽ với lớp tiện ích tĩnh `Files`.

```java
// Khởi tạo Path trong Java 21 (Cách chuẩn):
Path p1 = Path.of("pandas/cuddly.png");
Path p2 = Path.of("c:", "zoos", "animals"); // Nối nhiều phần tử

// Khởi tạo Path qua lớp Paths (Cách cũ từ Java 7, vẫn xuất hiện trong đề thi):
Path p3 = Paths.get("pandas/cuddly.png");

// Khởi tạo Path qua FileSystem:
Path p4 = FileSystems.getDefault().getPath("pandas/cuddly.png");

// Chuyển đổi qua lại giữa File và Path:
File file = p1.toFile();
Path path = file.toPath();
```

---

## 2. Thao Tác Với `Path` API (TABLE 14.5)

Đối tượng `Path` là **bất biến (Immutable)**: Mọi phương thức biến đổi đường dẫn đều trả về một đối tượng `Path` mới, đối tượng ban đầu không hề bị thay đổi!

### 1. Truy Xuất Các Thành Phần Đường Dẫn
* **`int getNameCount()`:** Trả về số lượng phần tử trong đường dẫn (**KHÔNG bao gồm Root!**).
* **`Path getName(int index)`:** Lấy phần tử tại vị trí `index` (0-indexed, không bao gồm Root).
* **`Path getFileName()`:** Trả về phần tử cuối cùng của đường dẫn (tên file hoặc tên thư mục cuối).
* **`Path getParent()`:** Trả về đường dẫn cha (loại bỏ phần tử cuối cùng). Trả về `null` nếu là đường dẫn gốc hoặc đường dẫn tương đối chỉ có 1 phần tử.
* **`Path getRoot()`:** Trả về phần tử gốc (`/` hoặc `C:\`). Trả về `null` nếu là đường dẫn tương đối!
* **`Path subpath(int beginIndex, int endIndex)`:** Cắt đường dẫn con từ `beginIndex` (bao gồm) đến `endIndex` (không bao gồm). **Không bao gồm Root**, 0-indexed.

```java
Path path = Path.of("/zoo/armadillo/shells.txt");
System.out.println(path.getNameCount()); // 3 (zoo, armadillo, shells.txt)
System.out.println(path.getName(0));      // zoo
System.out.println(path.getFileName());   // shells.txt
System.out.println(path.getParent());     // /zoo/armadillo
System.out.println(path.getRoot());       // /
System.out.println(path.subpath(0, 2));   // zoo/armadillo (bỏ root /)
```

> [!CAUTION]
> **Bẫy thi `subpath()` & `getName()`:**
> - Chỉ số của `getName(int)` và `subpath(int, int)` **không bao giờ tính Root**.
> - Gọi `subpath(0, 3)` trên `/zoo/armadillo/shells.txt` sẽ trả về `zoo/armadillo/shells.txt` (đường dẫn tương đối, không có dấu `/` ở đầu!).
> - Chỉ số vượt giới hạn sẽ ném `IllegalArgumentException`.

---

### 2. Nối Đường Dẫn (`resolve`)
* `p1.resolve(p2)`: Nối đường dẫn `p2` vào sau `p1`.
* **Quy tắc vàng:**
  * Nếu `p2` là **đường dẫn tương đối**: Nối bình thường (`p1/p2`).
  * Nếu `p2` là **đường dẫn tuyệt đối**: Phương thức sẽ **trả về trực tiếp `p2`** (bỏ qua hoàn toàn `p1`!).

```java
Path p1 = Path.of("/cats/big");
Path p2 = Path.of("lion.jpg");
System.out.println(p1.resolve(p2)); // /cats/big/lion.jpg

Path p3 = Path.of("/dogs/dog.jpg"); // Tuyệt đối
System.out.println(p1.resolve(p3)); // /dogs/dog.jpg (p1 bị bỏ qua!)
```

---

### 3. Tìm Đường Dẫn Tương Đối Giữa 2 Path (`relativize`)
* `p1.relativize(p2)`: Trả về đường dẫn để đi từ vị trí `p1` đến vị trí `p2`.
* > [!WARNING]
  > **Bẫy thi cực kỳ quan trọng:**
  > 1. Cả hai đường dẫn **bắt buộc phải cùng là tuyệt đối hoặc cùng là tương đối**. Nếu một bên là tuyệt đối và một bên là tương đối, phương thức sẽ ném **`IllegalArgumentException`**!
  > 2. Trên hệ điều hành Windows, nếu cả hai là đường dẫn tuyệt đối nhưng **khác ổ đĩa** (ví dụ `C:\` và `D:\`), phương thức cũng ném **`IllegalArgumentException`**!

```java
Path p1 = Path.of("fish.txt");
Path p2 = Path.of("birds.txt");
System.out.println(p1.relativize(p2)); // ../birds.txt

Path p3 = Path.of("/habitat/tropical");
Path p4 = Path.of("/habitat/arctic/polar.bear");
System.out.println(p3.relativize(p4)); // ../arctic/polar.bear
```

---

### 4. Chuẩn Hóa (`normalize`) & Đường Dẫn Thật (`toRealPath`)
* **`normalize()`:** Loại bỏ các phần tử dư thừa như `.` và `..` bằng việc tính toán chuỗi ký tự thuần túy. **Không hề truy cập ổ cứng** (file không tồn tại vẫn normalize được).
  * Ví dụ: `Path.of("/a/b/../c/./d").normalize()` $\rightarrow$ `/a/c/d`.
* **`toRealPath(LinkOption...)`:**
  * Chuẩn hóa đường dẫn và giải quyết các liên kết tượng trưng (Symbolic Links) để trỏ đến file vật lý thực sự trên đĩa.
  * **Bắt buộc file phải tồn tại trên đĩa!** Nếu file/thư mục không tồn tại, phương thức sẽ ném **`NoSuchFileException`** (hoặc `IOException`).

---

## 3. Thao Tác File & Thư Mục Với `java.nio.file.Files`

Hầu hết các phương thức trong `Files` đều là phương thức tĩnh (`static`) và đều khai báo `throws IOException`.

### 1. Kiểm Tra Tồn Tại & So Sánh File
* **`Files.exists(Path, LinkOption...)`:** Trả về `boolean` kiểm tra file có tồn tại hay không.
* **`Files.isSameFile(Path p1, Path p2)`:** Kiểm tra xem hai đường dẫn có trỏ tới cùng một file vật lý trên đĩa hay không (tự động phân giải symlink và normalize).
* **`Files.mismatch(Path p1, Path p2)` (Java 12+):** So sánh nội dung hai file từng byte một:
  * Trả về **`-1L`** nếu nội dung hai file **hoàn toàn giống hệt nhau**.
  * Trả về chỉ số vị trí byte đầu tiên khác nhau (0-indexed) nếu có sai khác.

---

### 2. Tạo, Di Chuyển & Xóa File/Thư Mục
* **`Files.createDirectory(Path)`:** Tạo một thư mục đơn. Nếu thư mục cha chưa tồn tại $\rightarrow$ Ném ngoại lệ!
* **`Files.createDirectories(Path)`:** Tạo thư mục cùng tất cả các thư mục cha chưa tồn tại (tương tự `mkdir -p`).
* **`Files.copy(Path source, Path target, CopyOption...)`:**
  * Sao chép file/thư mục. Nếu `target` đã tồn tại mà không truyền `StandardCopyOption.REPLACE_EXISTING` $\rightarrow$ Ném `FileAlreadyExistsException`.
  * > [!IMPORTANT]
    > **Sao chép thư mục là sao chép nông (Shallow Copy):** Khi copy một thư mục, `Files.copy` chỉ tạo một thư mục mới cùng tên, **không hề sao chép các file và thư mục con bên trong**!
* **`Files.move(Path source, Path target, CopyOption...)`:** Di chuyển hoặc đổi tên file/thư mục. Có thể truyền `StandardCopyOption.ATOMIC_MOVE` để đảm bảo thao tác di chuyển diễn ra nguyên tử.
* **`Files.delete(Path)`:** Xóa file hoặc thư mục rỗng.
  * Nếu file không tồn tại $\rightarrow$ Ném `NoSuchFileException`.
  * Nếu thư mục **không rỗng** $\rightarrow$ Ném **`DirectoryNotEmptyException`**.
* **`Files.deleteIfExists(Path)`:** Trả về `true` nếu xóa thành công, `false` nếu file không tồn tại (không ném ngoại lệ nếu thiếu file).

---

### 3. Cầu Nối Giữa I/O Streams và NIO.2
`Files` cung cấp các phương thức tiện ích cực mạnh để kết nối trực tiếp với Stream truyền thống:
* **`Files.copy(InputStream in, Path target, CopyOption...)`:** Đọc dữ liệu từ luồng nhập (ví dụ từ mạng Internet hoặc file ZIP) và ghi trực tiếp ra file trên đĩa.
* **`Files.copy(Path source, OutputStream out)`:** Đọc dữ liệu từ file trên đĩa và đẩy thẳng vào luồng xuất (ví dụ gửi qua HTTP response).
* **`Files.newBufferedReader(Path)` / `Files.newBufferedWriter(Path)`:** Mở nhanh luồng đọc/ghi có bộ đệm.
* **`Files.newInputStream(Path)` / `Files.newOutputStream(Path)`:** Mở nhanh luồng byte.

---

### 4. Đọc & Ghi Nội Dung Tập Tin (TABLE 14.9)

#### Dành cho tập tin nhỏ (Tải toàn bộ vào bộ nhớ):
* `byte[] Files.readAllBytes(Path)`: Đọc toàn bộ nội dung thành mảng byte.
* `String Files.readString(Path)` (Java 11+): Đọc toàn bộ nội dung thành một `String`.
* `List<String> Files.readAllLines(Path)`: Đọc từng dòng thành danh sách `List<String>`.
* `Files.writeString(Path, String)`: Ghi chuỗi vào file.
* `Files.write(Path, byte[])` hoặc `Files.write(Path, Iterable<String>)`: Ghi dữ liệu vào file.

> [!CAUTION]
> **Cảnh báo OutOfMemoryError:** Không bao giờ dùng `readAllLines()` hoặc `readAllBytes()` cho các file lớn (vài GB) vì nó sẽ nạp toàn bộ file vào RAM cùng một lúc.

#### Dành cho tập tin lớn (Xử lý lười - Lazy Loading):
* **`Stream<String> Files.lines(Path)`:** Trả về một `Stream<String>` đọc từng dòng một cách lười (lazy-evaluated). Bắt buộc phải bọc trong khối **`try-with-resources`** để đóng kết nối file khi đọc xong, tránh rò rỉ tài nguyên!
```java
try (Stream<String> lines = Files.lines(Path.of("large.log"))) {
    lines.filter(s -> s.contains("ERROR"))
         .forEach(System.out::println);
}
```

---

## 4. Hệ Thống I/O Streams Truyền Thống (`java.io`)

```
                                java.io I/O Streams
                                         |
            +----------------------------+----------------------------+
            |                                                         |
      Byte Streams                                            Character Streams
   (Binary data, ảnh, video, zip)                           (Text, chuỗi UTF-8, ký tự)
            |                                                         |
     +------+------+                                           +------+------+
     |             |                                           |             |
InputStream   OutputStream                                  Reader         Writer
```

### 1. Phân Loại Luồng (TABLE 14.6 & 14.7)
* **Byte Streams (hậu tố `Stream`):** `InputStream`, `OutputStream`, `FileInputStream`, `FileOutputStream`, `BufferedInputStream`, `BufferedOutputStream`, `ObjectInputStream`, `ObjectOutputStream`, `PrintStream`.
* **Character Streams (hậu tố `Reader`/`Writer`):** `Reader`, `Writer`, `FileReader`, `FileWriter`, `BufferedReader`, `BufferedWriter`, `PrintWriter`.
* **Low-Level Streams (Luồng cấp thấp):** Kết nối trực tiếp với nguồn dữ liệu vật lý (file, console, memory): `FileInputStream`, `FileOutputStream`, `FileReader`, `FileWriter`.
* **High-Level Streams (Luồng cấp cao):** Bọc lấy một luồng khác để cung cấp tính năng nâng cao (bộ đệm, tuần tự hóa đối tượng, định dạng): `BufferedReader`, `BufferedWriter`, `ObjectInputStream`, `ObjectOutputStream`, `PrintStream`, `PrintWriter`.

---

### 2. Mẫu Thiết Kế Decorator (Bọc Luồng)
```java
// Bọc FileInputStream -> BufferedInputStream -> ObjectInputStream:
try (var ois = new ObjectInputStream(
        new BufferedInputStream(
            new FileInputStream("data.bin")))) {
    Object obj = ois.readObject();
}
```

### 3. Đánh Dấu Vị Trí Đọc Với `mark()` & `reset()` (TABLE 14.10)
* **`boolean markSupported()`:** Kiểm tra xem luồng có hỗ trợ đánh dấu hay không (các lớp `Buffered*` luôn hỗ trợ; các luồng raw file thường không hỗ trợ).
* **`void mark(int readLimit)`:** Đánh dấu vị trí hiện tại trong luồng. `readLimit` là số lượng byte/ký tự tối đa được phép đọc trước khi dấu đánh dấu này mất hiệu lực.
* **`void reset()`:** Tua ngược con trỏ đọc về vị trí vừa được `mark()`.
* **`long skip(long n)`:** Bỏ qua $n$ byte/ký tự tiếp theo.

### 4. `PrintStream` vs. `PrintWriter`
* `System.out` và `System.err` là các đối tượng `PrintStream` (luồng byte).
* `PrintWriter` là luồng ký tự tương ứng.
* Cả hai lớp này đều có đặc điểm nổi bật: **Không bao giờ ném Checked Exception** từ các phương thức `print()`, `println()`, `printf()`, `format()`. Muốn kiểm tra có lỗi hay không, gọi `checkError()`.

---

## 5. Tuần Tự Hóa Dữ Liệu (Java Serialization)

Tuần tự hóa (**Serialization**) là quá trình chuyển đổi một đồ thị đối tượng Java (Object Graph) trong bộ nhớ thành một chuỗi byte để ghi xuống đĩa hoặc truyền qua mạng. Giải tuần tự hóa (**Deserialization**) là quá trình ngược lại.

```
+------------------+   ObjectOutputStream.writeObject()   +------------------+
| Java Object      | ===================================> | Byte Stream      |
| (RAM / Heap)     | <=================================== | (File / Network) |
+------------------+    ObjectInputStream.readObject()    +------------------+
```

### 1. Điều Kiện Để Một Class Có Thể Tuần Tự Hóa
1. Lớp đó bắt buộc phải `implements java.io.Serializable` (đây là một **Marker Interface**, không chứa bất kỳ phương thức nào).
2. Tất cả các trường thành viên (instance fields) không phải kiểu nguyên thủy đều phải trỏ đến các đối tượng **cũng `implements Serializable`**.
3. Nếu một trường không thể tuần tự hóa, nó bắt buộc phải được đánh dấu bằng từ khóa **`transient`** (nếu không sẽ ném **`NotSerializableException`** lúc chạy!).
4. Nên khai báo trường nhận diện phiên bản: `private static final long serialVersionUID = 1L;`.

---

### 2. Hành Xử Của Trường `transient` & `static`
* **Trường `static`:** Thuộc về lớp chứ không thuộc về đối tượng cá thể $\rightarrow$ **Không bao giờ được lưu** trong quá trình tuần tự hóa.
* **Trường `transient`:** Bị bỏ qua khi tuần tự hóa. Khi giải tuần tự hóa (Deserialization), trường `transient` sẽ được khôi phục về **giá trị mặc định** của kiểu dữ liệu (`0`, `0.0`, `false`, `null`).

---

### 3. Tùy Biến Quá Trình Tuần Tự Hóa
Lớp có thể định nghĩa 2 phương thức private sau để tự kiểm soát dữ liệu ghi/đọc:
```java
private void writeObject(ObjectOutputStream out) throws IOException {
    out.defaultWriteObject(); // Ghi các trường thông thường
    // Ghi thêm dữ liệu tùy biến...
}

private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
    in.defaultReadObject(); // Đọc các trường thông thường
    // Khôi phục trường transient hoặc giải mã...
}
```

---

### 4. Quy Tắc Gọi Hàm Dựng Khi Deserialization (Bẫy Thi Cực Hiểm!)

#### Đối với Lớp Thông Thường (Class):
* Trong quá trình Deserialization, Java **KHÔNG HỀ GỌI BẤT KỲ CONSTRUCTOR NÀO** của lớp đang được giải tuần tự hóa!
* Thay vào đó, Java sẽ đi ngược lên cây kế thừa và **gọi constructor không tham số (no-arg constructor) của LỚP CHA ĐẦU TIÊN KHÔNG IMPLEMENTS `Serializable`**!
* Nếu lớp cha không implement `Serializable` mà lại thiếu no-arg constructor $\rightarrow$ Ném **`InvalidClassException`** lúc runtime!

#### Đối với Bản Ghi (Record) trong Java:
* Từ Java 14/16+, cơ chế tuần tự hóa Record được thiết kế an toàn hơn: Quá trình Deserialization của Record **BẮT BUỘC PHẢI GỌI CANONICAL CONSTRUCTOR** để khởi tạo đối tượng!

---

## 6. Tương Tác Người Dùng & Lớp `java.io.Console`

### Các Luồng Hệ Thống Chuẩn
* `System.in`: Luồng nhập chuẩn (kiểu `InputStream` byte stream).
* `System.out`: Luồng xuất chuẩn (kiểu `PrintStream`).
* `System.err`: Luồng xuất lỗi chuẩn (kiểu `PrintStream`).

---

### Làm Việc Với Lớp `Console`

Lớp `java.io.Console` được thiết kế chuyên biệt để tương tác với người dùng qua màn hình dòng lệnh.

```java
Console console = System.console();
if (console != null) {
    String username = console.readLine("Enter username: ");
    char[] password = console.readPassword("Enter password: ");
    
    console.format("Hello %s%n", username);
    
    // Bảo mật: Xóa mảng mật khẩu khỏi RAM sau khi dùng xong
    java.util.Arrays.fill(password, 'x');
} else {
    System.err.println("Console is not available!");
}
```

> [!IMPORTANT]
> **3 Bẫy thi kinh điển về `Console`:**
> 1. **Kiểm tra `null`:** Lệnh `System.console()` sẽ trả về **`null`** nếu chương trình chạy trong môi trường không tương tác (như chạy trong Eclipse/IntelliJ console, chạy ngầm background, hoặc bị redirect I/O). Luôn phải kiểm tra `console != null`.
> 2. **Kiểu trả về của `readPassword()`:** Trả về **`char[]`** (mảng ký tự), **KHÔNG PHẢI `String`**! Lý do bảo mật: Mảng ký tự có thể bị ghi đè/xóa rỗng ngay lập tức trong RAM, trong khi `String` là bất biến và lưu trong String Pool, có thể bị tin tặc dump bộ nhớ để lộ mật khẩu.
> 3. **Lấy Reader/Writer:** `console.reader()` trả về `Reader`; `console.writer()` trả về `PrintWriter`.

---

## 7. Phân Tích Thuộc Tính Nâng Cao & Duyệt Cây Thư Mục

### 1. Đọc & Cập Nhật Thuộc Tính Với `BasicFileAttributes` (TABLE 14.11)
Thay vì gọi từng phương thức kiểm tra đĩa riêng lẻ gây chậm hiệu năng, NIO.2 cho phép đọc toàn bộ thuộc tính trong 1 lần gọi:

```java
Path path = Path.of("sample.txt");
BasicFileAttributes attr = Files.readAttributes(path, BasicFileAttributes.class);

System.out.println("Is Directory: " + attr.isDirectory());
System.out.println("Is Regular File: " + attr.isRegularFile());
System.out.println("Is Symbolic Link: " + attr.isSymbolicLink());
System.out.println("Size (bytes): " + attr.size());
System.out.println("Last Modified: " + attr.lastModifiedTime());
System.out.println("Creation Time: " + attr.creationTime());
```

Nếu muốn chỉnh sửa thời gian sửa đổi/truy cập file, dùng View:
```java
BasicFileAttributeView view = Files.getFileAttributeView(path, BasicFileAttributeView.class);
FileTime now = FileTime.fromMillis(System.currentTimeMillis());
view.setTimes(now, null, null); // Cập nhật lastModifiedTime
```

---

### 2. Các Phương Thức Duyệt Cây Thư Mục Trả Về Stream

Tất cả các phương thức duyệt thư mục của `Files` đều trả về `Stream<Path>` và **phải được đóng trong `try-with-resources`**:

* **`Files.list(Path dir)`:** Duyệt nông (Shallow listing - độ sâu đúng 1 cấp). Tương tự lệnh `dir` hoặc `ls`.
* **`Files.walk(Path start, int maxDepth, FileVisitOption... options)`:** Duyệt sâu toàn bộ cây thư mục theo thuật toán Depth-First Search.
  * Mặc định, `Files.walk` **không đi theo Symbolic Links**.
  * Nếu truyền cờ `FileVisitOption.FOLLOW_LINKS` vào một thư mục có liên kết tượng trưng vòng tròn (Circular symlink) $\rightarrow$ Ném **`FileSystemLoopException`**!
* **`Files.find(Path start, int maxDepth, BiPredicate<Path, BasicFileAttributes> matcher)`:** Duyệt cây thư mục và lọc trực tiếp dựa trên thuộc tính của từng file trong 1 thao tác duy nhất (hiệu năng cao hơn `walk().filter(...)`).

```java
// Tìm tất cả các file .java có kích thước > 1000 bytes trong độ sâu tối đa 5 cấp:
try (Stream<Path> stream = Files.find(Path.of("src"), 5,
        (path, attr) -> path.toString().endsWith(".java") && attr.size() > 1000)) {
    stream.forEach(System.out::println);
}
```

---

## 8. Bảng Tổng Hợp Bẫy Thi & Ghi Nhớ Nhanh (Exam Traps Checklist)

> [!TIP]
> ### 10 Bẫy Thi Cực Kỳ Trọng Tâm Chương 14
> 1. **`Path` là bất biến:** Mọi thao tác `resolve()`, `relativize()`, `subpath()` đều trả về `Path` mới; không bao giờ làm đổi `Path` gốc.
> 2. **Bẫy `resolve()`:** Nếu truyền một đường dẫn **tuyệt đối** vào `p.resolve(absolutePath)`, kết quả trả về chính là `absolutePath` (bỏ qua `p`).
> 3. **Bẫy `relativize()`:** Không bao giờ được trộn lẫn giữa đường dẫn tương đối và đường dẫn tuyệt đối (ném `IllegalArgumentException`). Trên Windows, hai đường dẫn tuyệt đối khác ổ đĩa cũng ném `IllegalArgumentException`.
> 4. **Bẫy `Files.copy()` với thư mục:** Chỉ sao chép vỏ thư mục rỗng (**Shallow Copy**), không copy file con bên trong.
> 5. **Bẫy `Files.delete()`:** Thư mục có chứa file bên trong sẽ ném `DirectoryNotEmptyException`.
> 6. **Bẫy `Files.lines()`:** Luôn phải bọc trong `try-with-resources` để đóng file descriptor ngầm định của Stream.
> 7. **`Console.readPassword()`:** Luôn trả về kiểu **`char[]`**, không bao giờ trả về `String`.
> 8. **`System.console()` trả về `null`:** Trong IDE hoặc môi trường background, `System.console()` trả về `null`.
> 9. **Constructor khi Deserialization:** Lớp được giải tuần tự hóa **không chạy constructor**; chỉ có constructor không tham số của **lớp cha không serializable đầu tiên** mới được chạy. (Record thì bắt buộc gọi canonical constructor).
> 10. **`Files.mismatch()`:** Trả về **`-1L`** nếu hai file có nội dung hoàn toàn trùng khớp nhau từng byte một.
