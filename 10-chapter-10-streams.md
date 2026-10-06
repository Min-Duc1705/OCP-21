# Sổ Tay Chuyên Sâu: Chapter 10 - Streams

> **Tài liệu tham chiếu chuẩn OCP Java SE 21:**  
> Sách: *OCP Oracle Certified Professional Java SE 21 Developer Study Guide*  
> Tác giả: Jeanne Boyarsky & Scott Selikoff (Sybex / Wiley)  
> Phạm vi: Trang 843 – 894 (PDF)

---

## 🗺️ Bản Đồ Kiến Thức Chương 10 (Chapter Overview)

Trong Chương 8 (Lambdas) và Chương 9 (Collections & Generics), chúng ta đã làm quen với việc lưu trữ dữ liệu và lập trình hàm. Chương 10 đưa toàn bộ các khái niệm này lên đỉnh cao với **Java Stream API** — công cụ mạnh mẽ bậc nhất giúp xử lý luồng dữ liệu theo phong cách khai báo (declarative) và lập trình hàm (functional programming).

Chương này gồm 6 khối kiến thức trọng tâm:
1. **Lớp `Optional<T>`:** Giải pháp thay thế `null`, các phương thức khởi tạo, kiểm tra, lấy giá trị mặc định và biến đổi chuỗi.
2. **Kiến trúc Stream Pipeline & Đánh giá trễ (Lazy Evaluation):** Mô hình dây chuyền sản xuất (Assembly Line), phân biệt thao tác trung gian (Intermediate) và thao tác kết thúc (Terminal), quy tắc chỉ dùng một lần (Stream reuse).
3. **Các Thao Tác Kết Thúc (Terminal Operations):** Đếm (`count`), Cực trị (`min`/`max`), Tìm kiếm (`findAny`/`findFirst`), Khớp điều kiện (`anyMatch`/`allMatch`/`noneMatch`), Thu giảm (`reduce`), và Thu thập (`collect`).
4. **Các Thao Tác Trung Gian Phổ Biến (Common Intermediate Operations):** `filter`, `distinct`, `limit`, `skip`, `map`, `flatMap`, `sorted`, và `peek`.
5. **Primitive Streams & Primitive Optionals:** `IntStream`, `LongStream`, `DoubleStream`, các hàm tính toán số học (`sum`, `average`, `summaryStatistics`), và chuyển đổi kiểu luồng (`boxed()`, `mapToInt()`).
6. **Pipeline Nâng Cao, Bộ Thu Thập `Collectors` & `Spliterator`:** `Collectors.groupingBy`, `partitioningBy`, `mapping`, `teeing` (Java 12), và cơ chế phân tách luồng dữ liệu bằng `Spliterator`.

---

## PHẦN 1: BẢN CHẤT CỦA `Optional<T>` & CÁC THAO TÁC CỐT LÕI

Một `Optional<T>` là một đối tượng bao bọc (wrapper) chứa một giá trị khác `null`, hoặc **rỗng (empty)**. Nó được thiết kế nhằm mục đích diễn đạt rõ ràng trong API rằng: *"Phương thức này có thể không trả về giá trị nào cả"*, giúp loại bỏ các lỗi chết người `NullPointerException` (NPE).

### 1. Khởi Tạo `Optional` (Static Factory Methods)

```java
// 1. Tạo một Optional rỗng:
Optional<Double> optEmpty = Optional.empty();

// 2. Bọc một giá trị KHÁC NULL (Nếu truyền null -> ném NullPointerException ngay lập tức!):
Optional<Double> optVal = Optional.of(95.5);
// Optional.of(null); // NÉM NullPointerException!

// 3. Bọc một giá trị có thể null (Nếu null -> trả về Optional.empty, ngược lại bọc giá trị):
Double score = getScoreFromDatabase(); // có thể null
Optional<Double> optSafe = Optional.ofNullable(score);
```

---

### 2. Bảng 10.1: Các Phương Thức Thực Thể Của `Optional` (Chuẩn Sách OCP)

| Phương Thức | Khi `Optional` RỖNG (`empty`) | Khi `Optional` CÓ GIÁ TRỊ |
| :--- | :--- | :--- |
| `T get()` | **Ném `NoSuchElementException`** | Trả về giá trị bên trong |
| `boolean isPresent()` | Trả về `false` | Trả về `true` |
| `boolean isEmpty()` *(Java 11)* | Trả về `true` | Trả về `false` |
| `void ifPresent(Consumer<? super T> c)` | Không làm gì cả | Thực thi `Consumer` với giá trị bên trong |
| `void ifPresentOrElse(Consumer c, Runnable r)` *(Java 9)* | Thực thi `Runnable r` | Thực thi `Consumer c` với giá trị |
| `T orElse(T other)` | Trả về giá trị tham số `other` | Trả về giá trị bên trong |
| `T orElseGet(Supplier<? extends T> s)` | Gọi `Supplier.get()` và trả về kết quả | Trả về giá trị bên trong (không gọi Supplier) |
| `T orElseThrow()` *(Java 10)* | **Ném `NoSuchElementException`** | Trả về giá trị bên trong |
| `T orElseThrow(Supplier<? extends X> s)` | **Ném ngoại lệ do `Supplier` tạo ra** | Trả về giá trị bên trong |

> [!CAUTION]
> **Bẫy thi kinh điển 1: `orElse` vs `orElseGet` (Eager Evaluation vs Lazy Evaluation)**
> ```java
> Optional<String> opt = Optional.of("Antigravity");
> 
> // orElse() LUÔN LUÔN thực thi biểu thức bên trong ngoặc dù Optional có giá trị hay không!
> String r1 = opt.orElse(expensiveDatabaseCall()); // VẪN GỌI expensiveDatabaseCall()!
> 
> // orElseGet() CHỈ THỰC THI Supplier khi Optional thực sự rỗng!
> String r2 = opt.orElseGet(() -> expensiveDatabaseCall()); // KHÔNG HỀ GỌI!
> ```

> [!CAUTION]
> **Bẫy thi kinh điển 2: `orElseGet` không tương thích với ngoại lệ**
> ```java
> Optional<Double> opt = Optional.empty();
> System.out.println(opt.orElseGet(() -> new IllegalStateException())); // LỖI BIÊN DỊCH!
> // Giải thích: opt có kiểu Optional<Double>, Supplier trong orElseGet bắt buộc phải trả về Double!
> // Muốn ném ngoại lệ do Supplier tạo ra, bắt buộc phải dùng: opt.orElseThrow(() -> new IllegalStateException());
> ```

---

### 3. Bảng 10.9: Các Phương Thức Biến Đổi & Nối Chuỗi Nâng Cao Của `Optional`

| Phương Thức | Mục Đích & Hành Vi |
| :--- | :--- |
| `Optional<T> filter(Predicate<? super T> p)` | Nếu có giá trị và khớp với Predicate $\rightarrow$ giữ nguyên. Ngược lại $\rightarrow$ trả về `Optional.empty()`. |
| `Optional<U> map(Function<? super T, ? extends U> f)` | Nếu có giá trị $\rightarrow$ áp dụng hàm chuyển đổi và bọc kết quả vào `Optional`. Nếu rỗng $\rightarrow$ trả về `Optional.empty()`. |
| `Optional<U> flatMap(Function<? super T, Optional<U>> f)` | Tương tự `map`, nhưng áp dụng khi hàm chuyển đổi **đã tự trả về một `Optional`** (giúp không bị lồng thành `Optional<Optional<U>>`). |
| `Optional<T> or(Supplier<Optional<T>> s)` *(Java 9)* | Nếu có giá trị $\rightarrow$ trả về chính nó. Nếu rỗng $\rightarrow$ trả về một `Optional` khác do `Supplier` cung cấp. |

```java
// Ví dụ thực tế: Tìm độ dài của chuỗi có 3 ký tự trở lên
Optional<String> name = Optional.of("Java21");
Optional<Integer> len = name.filter(s -> s.length() >= 3)
                            .map(String::length);
System.out.println(len.orElse(0)); // 6
```

---

## PHẦN 2: KIẾN TRÚC STREAM PIPELINE & CƠ CHẾ ĐÁNH GIÁ TRỄ (LAZY EVALUATION)

### 1. Khái Niệm Stream & Mô Hình Dây Chuyền Sản Xuất (Assembly Line)

Một **`Stream`** trong Java là một chuỗi các phần tử dữ liệu được truyền qua một đường ống xử lý theo một chiều duy nhất.
Tác giả Jeanne Boyarsky & Scott Selikoff đưa ra hình tượng: Hãy tưởng tượng Stream như một **dây chuyền sản xuất trong nhà máy**:
* **Nguồn (Source):** Người công nhân số 1 lấy từng biển hiệu con vật ra khỏi hộp.
* **Các thao tác trung gian (Intermediate Operations):** Người số 2 sơn biển hiệu; người số 3 khắc chữ lên biển hiệu.
* **Thao tác kết thúc (Terminal Operation):** Người cuối cùng xếp các biển hiệu đã hoàn thiện vào một chiếc hộp để mang đi trưng bày.

```
+------------+       +-------------------------+       +--------------------+
|   SOURCE   | ----> | INTERMEDIATE OPERATIONS | ----> | TERMINAL OPERATION |
| (Tạo luồng)|       |  (Biến đổi, lọc, sắp xếp) |       |  (Sinh kết quả/đóng) |
+------------+       +-------------------------+       +--------------------+
```

---

### 2. Bảng 10.2: So Sánh Intermediate vs Terminal Operations (Bắt Buộc Thuộc Lòng)

| Đặc Điểm | Thao Tác Trung Gian (Intermediate) | Thao Tác Kết Thúc (Terminal) |
| :--- | :---: | :---: |
| **Bắt buộc phải có để pipeline hoạt động?** | **Không** (có thể có 0 hoặc nhiều) | **CÓ** (Bắt buộc phải có đúng 1) |
| **Số lần xuất hiện trong 1 pipeline?** | Nhiều lần | **Duy nhất 1 lần ở cuối** |
| **Kiểu trả về?** | Luôn là một `Stream` (`Stream<T>`, `IntStream`...) | Khác Stream (Primitive, Object, Collection, `void`...) |
| **Được thực thi ngay khi gọi phương thức?** | **KHÔNG** (Đánh giá trễ - Lazy Evaluation) | **CÓ** (Kích hoạt toàn bộ pipeline chạy) |
| **Stream còn hợp lệ sau khi gọi?** | **CÓ** (Trả về stream mới cho bước tiếp theo) | **KHÔNG** (Stream bị đóng vĩnh viễn) |

> [!IMPORTANT]
> **Quy Tắc "Chỉ Dùng Một Lần" (Stream Reuse Rule):**
> Một khi thao tác kết thúc (terminal operation) đã được gọi trên một stream, **stream đó đã bị đóng và không thể sử dụng lại**. Bất kỳ nỗ lực nào gọi tiếp thao tác khác trên stream cũ sẽ ném ra **`IllegalStateException`** tại runtime!
> ```java
> Stream<String> s = Stream.of("a", "b", "c");
> s.forEach(System.out::print); // Terminal operation 1 -> Đóng stream!
> s.forEach(System.out::print); // NÉM IllegalStateException: stream has already been operated upon or closed!
> ```

---

### 3. Bảng 10.3: Các Cách Khởi Tạo Nguồn Stream (Creating Stream Sources)

| Phương Pháp Khởi Tạo | Hữu Hạn / Vô Hạn | Mô Tả & Ví Dụ |
| :--- | :---: | :--- |
| `Stream.empty()` | Hữu hạn | Tạo stream rỗng không chứa phần tử nào (`count = 0`). |
| `Stream.of(varargs)` | Hữu hạn | Tạo stream từ danh sách phần tử liệt kê: `Stream.of(1, 2, 3)`. |
| `collection.stream()` | Hữu hạn | Tạo tuần tự từ bất kỳ Collection nào (`List`, `Set`...). |
| `collection.parallelStream()` | Hữu hạn | Tạo stream có khả năng xử lý song song đa luồng. |
| `Stream.generate(Supplier<T> s)` | **Vô hạn (Infinite)** | Gọi `Supplier.get()` liên tục theo nhu cầu: `Stream.generate(Math::random)`. |
| `Stream.iterate(seed, UnaryOperator<T> f)` | **Vô hạn (Infinite)** | Bắt đầu từ giá trị gốc `seed`, mỗi phần tử tiếp theo là `f(giá_trị_trước)`: `Stream.iterate(1, n -> n + 2)`. |
| `Stream.iterate(seed, Predicate<T> hasNext, UnaryOperator<T> f)` *(Java 9)* | **Hữu hạn (hoặc Vô hạn)** | Tương tự vòng lặp for 3 vế: `Stream.iterate(1, n -> n < 100, n -> n + 2)`. Nếu điều kiện `hasNext` sai thì dừng. |

---

### 4. Cơ Chế Đánh Giá Trễ & Vai Trò "Người Quản Đốc" (The Foreperson)

Người quản đốc thông minh điều hành nhà máy:
* Khi bạn định nghĩa các thao tác trung gian (`filter`, `map`, `sorted`), người quản đốc **chưa cho dây chuyền chạy**. Họ chỉ đứng ghi chép các chỉ dẫn và yêu cầu công nhân đứng chờ.
* Khi bạn gọi một thao tác kết thúc (`findFirst`, `count`, `forEach`), người quản đốc mới hô: *"Khởi động dây chuyền!"*.
* Từng phần tử từ nguồn được kéo qua toàn bộ chuỗi mắt xích (filter $\rightarrow$ map $\rightarrow$ terminal) từng cái một, **chứ không phải xử lý xong cả danh sách ở filter rồi mới chuyển sang map**.

---

## PHẦN 3: CÁC THAO TÁC KẾT THÚC (TERMINAL OPERATIONS)

Một thao tác kết thúc sẽ tạo ra kết quả cuối cùng hoặc một tác dụng phụ (side-effect). Sau khi hoàn tất, luồng dữ liệu bị tiêu thụ hoàn toàn.

### Bảng 10.4: Toàn Bộ Các Thao Tác Kết Thúc Trong Chuẩn OCP

| Phương Thức | Hành Vi Đối Với Stream Vô Hạn | Kiểu Trả Về | Có Phải Là Phép Thu Giảm (Reduction)? |
| :--- | :---: | :---: | :---: |
| `long count()` | **Treo vĩnh viễn (hangs)** | `long` | **CÓ** |
| `Optional<T> min(Comparator c)` | **Treo vĩnh viễn (hangs)** | `Optional<T>` | **CÓ** |
| `Optional<T> max(Comparator c)` | **Treo vĩnh viễn (hangs)** | `Optional<T>` | **CÓ** |
| `Optional<T> findAny()` | **Dừng (Terminates)** | `Optional<T>` | **KHÔNG** |
| `Optional<T> findFirst()` | **Dừng (Terminates)** | `Optional<T>` | **KHÔNG** |
| `boolean allMatch(Predicate p)` | **Có thể dừng** (dừng ngay khi gặp 1 phần tử `false`) | `boolean` | **KHÔNG** |
| `boolean anyMatch(Predicate p)` | **Có thể dừng** (dừng ngay khi gặp 1 phần tử `true`) | `boolean` | **KHÔNG** |
| `boolean noneMatch(Predicate p)` | **Có thể dừng** (dừng ngay khi gặp 1 phần tử `true`) | `boolean` | **KHÔNG** |
| `void forEach(Consumer c)` | **Treo vĩnh viễn (hangs)** | `void` | **KHÔNG** |
| `reduce(...)` *(3 overloads)* | **Treo vĩnh viễn (hangs)** | `T` hoặc `Optional<T>` hoặc `U` | **CÓ** |
| `collect(...)` *(2 overloads)* | **Treo vĩnh viễn (hangs)** | Thay đổi (`R`) | **CÓ (Mutable reduction)** |

---

### Chi Tiết Từng Nhóm Thao Tác Kết Thúc

#### 1. Đếm & Cực Trị (`count`, `min`, `max`)
* `count()`: Đếm số phần tử.
* `min(Comparator)` / `max(Comparator)`: Tìm phần tử nhỏ/lớn nhất. Trả về `Optional.empty()` nếu stream rỗng.
```java
Stream<String> s = Stream.of("monkey", "ape", "bonobo");
Optional<String> min = s.min((s1, s2) -> s1.length() - s2.length());
min.ifPresent(System.out::println); // ape
```

#### 2. Tìm Kiếm & Ngắt Mạch (Short-Circuiting: `findAny`, `findFirst`)
* Trả về một phần tử bất kỳ (`findAny`) hoặc phần tử đầu tiên (`findFirst`).
* Hoạt động an toàn trên cả Stream vô hạn vì dừng ngay sau khi lấy được 1 phần tử.
```java
Stream<String> infinite = Stream.generate(() -> "chimp");
infinite.findAny().ifPresent(System.out::println); // chimp (kết thúc ngay!)
```

#### 3. Khớp Điều Kiện (`anyMatch`, `allMatch`, `noneMatch`)
* Nhận vào một `Predicate` và trả về `boolean`.
* Chú ý với Stream vô hạn:
  * `anyMatch` dừng nếu tìm thấy ít nhất 1 phần tử thoả mãn `true`.
  * `allMatch` dừng nếu tìm thấy ít nhất 1 phần tử vi phạm `false`. Nhưng nếu mọi phần tử đều là `true`, nó sẽ chạy vô tận!
  * `noneMatch` dừng nếu tìm thấy ít nhất 1 phần tử thoả mãn `true`.

#### 4. Phép Thu Giảm Chung: `reduce()` (3 Phiên Bản Quá Tải)
`reduce()` gom toàn bộ stream thành một giá trị đơn lẻ:
1. **1 tham số:** `Optional<T> reduce(BinaryOperator<T> accumulator)`  
   Không có giá trị khởi đầu (identity). Nếu stream rỗng, trả về `Optional.empty()`.
2. **2 tham số:** `T reduce(T identity, BinaryOperator<T> accumulator)`  
   Có giá trị khởi đầu `identity`. Nếu stream rỗng, trả về chính `identity`.
3. **3 tham số (Dành cho xử lý song song Parallel):**  
   `<U> U reduce(U identity, BiFunction<U,? super T,U> accumulator, BinaryOperator<U> combiner)`  
   Cho phép gom các phần tử kiểu `T` thành một kiểu dữ liệu trung gian `U`, sau đó dùng `combiner` kết hợp các luồng nhánh song song lại với nhau.

```java
// Ghép chuỗi bằng reduce 2 tham số:
Stream<String> stream = Stream.of("w", "o", "l", "f");
String word = stream.reduce("", (s, c) -> s + c); // wolf

// Nhân các số nguyên bằng reduce 2 tham số:
Stream<Integer> numbers = Stream.of(3, 5, 6);
int product = numbers.reduce(1, (a, b) -> a * b); // 90
```

#### 5. Thu Giảm Có Thể Đột Biến: `collect()`
`collect()` là một dạng thu giảm đặc biệt (Mutable Reduction) hiệu năng cao vì nó tích luỹ dữ liệu vào một đối tượng khả biến duy nhất (như `StringBuilder`, `ArrayList`, `TreeSet`) thay vì liên tục tạo đối tượng mới như `reduce`.
* **Cú pháp 3 tham số:**
  `collect(Supplier<R> supplier, BiConsumer<R, ? super T> accumulator, BiConsumer<R, R> combiner)`
```java
Stream<String> stream = Stream.of("w", "o", "l", "f");
TreeSet<String> set = stream.collect(
   TreeSet::new,     // Supplier: Tạo đối tượng chứa
   TreeSet::add,     // Accumulator: Thêm từng phần tử vào tập hợp
   TreeSet::addAll   // Combiner: Gộp hai tập hợp khi chạy song song
);
System.out.println(set); // [f, l, o, w] (tự sắp xếp)
```

---

## PHẦN 4: CÁC THAO TÁC TRUNG GIAN PHỔ BIẾN (INTERMEDIATE OPERATIONS)

Thao tác trung gian luôn nhận vào một Stream và trả về một Stream mới. Chúng mang tính chất "Lazy" (chưa thực thi cho tới khi gặp terminal operation).

### 1. `filter(Predicate<? super T> predicate)`
Chỉ cho phép các phần tử thoả mãn điều kiện của Predicate đi tiếp xuống pipeline.
```java
Stream.of("monkey", "gorilla", "bonobo")
      .filter(x -> x.startsWith("m"))
      .forEach(System.out::print); // monkey
```

### 2. `distinct()`
Loại bỏ các phần tử trùng lặp dựa trên phương thức `equals()`. Các phần tử không cần phải nằm liền kề nhau để bị loại bỏ.
```java
Stream.of("duck", "duck", "goose").distinct().forEach(System.out::print); // duckgoose
```

### 3. `limit(long maxSize)` & `skip(long n)`
* `limit(maxSize)`: Giữ lại tối đa `maxSize` phần tử đầu tiên (thao tác ngắt mạch short-circuiting).
* `skip(n)`: Bỏ qua `n` phần tử đầu tiên, cho phép các phần tử từ vị trí $n+1$ đi tiếp.
```java
Stream.iterate(1, n -> n + 1)
      .skip(5)   // Bỏ qua 1, 2, 3, 4, 5 -> Luồng bắt đầu từ 6
      .limit(2)  // Lấy 2 phần tử -> 6, 7
      .forEach(System.out::print); // 67
```

### 4. `map(Function<? super T, ? extends R> mapper)`
Tạo ánh xạ chuyển đổi 1-1: Mỗi phần tử kiểu `T` được chuyển đổi thành một phần tử kiểu `R`.
```java
Stream.of("monkey", "gorilla", "bonobo")
      .map(String::length)
      .forEach(System.out::print); // 676
```

### 5. `flatMap(Function<? super T, ? extends Stream<? extends R>> mapper)`
Làm phẳng dữ liệu (Flattening): Chuyển đổi mỗi phần tử phức tạp (như List, mảng, tập hợp con) thành một Stream riêng biệt, rồi **gộp tất cả các Stream con đó thành một Stream duy nhất ở cấp độ cao nhất**.
```java
List<String> zero = List.of();
var one = List.of("Bonobo");
var two = List.of("Mama Gorilla", "Baby Gorilla");

Stream<List<String>> animals = Stream.of(zero, one, two);
animals.flatMap(m -> m.stream())
       .forEach(System.out::println);
// In ra từng con vật trên từng dòng: Bonobo, Mama Gorilla, Baby Gorilla
```

### 6. `sorted()` & `sorted(Comparator<? super T> comparator)`
Sắp xếp các phần tử theo thứ tự tự nhiên (`Comparable`) hoặc theo `Comparator` truyền vào.
> [!WARNING]
> **Bẫy thi treo luồng với `sorted()`:**
> Để sắp xếp được, `sorted()` **bắt buộc phải gom đủ toàn bộ các phần tử** trong stream rồi mới tiến hành so sánh. Do đó, nếu gọi `sorted()` trên một Stream vô hạn mà chưa qua `limit()`, chương trình sẽ **chạy vô tận (hangs)** hoặc bị `OutOfMemoryError`!
> ```java
> Stream.generate(() -> "Elsa")
>       .filter(n -> n.length() == 4)
>       .sorted() // TREO VÔ HẠN Ở ĐÂY vì không bao giờ thấy điểm kết thúc!
>       .limit(2)
>       .forEach(System.out::println);
> 
> // Sửa đúng: Phải đặt limit() TRƯỚC sorted():
> Stream.generate(() -> "Elsa")
>       .filter(n -> n.length() == 4)
>       .limit(2) // Thu gọn thành luồng hữu hạn gồm 2 phần tử
>       .sorted() // Sắp xếp an toàn!
>       .forEach(System.out::println);
> ```

### 7. `peek(Consumer<? super T> action)`
Được thiết kế phục vụ mục đích **gỡ lỗi (debugging)**. Cho phép thực thi một hành động trên từng phần tử khi nó đi qua mà không làm thay đổi bản thân phần tử đó trong luồng.
> [!CAUTION]
> **Bẫy thi về `peek`:**
> 1. `peek` chỉ chạy khi có Terminal Operation kích hoạt. Nếu không có terminal operation, `peek` không in ra bất cứ thứ gì!
> 2. `peek` không nên thay đổi trạng thái bên trong của các đối tượng trong collection (vi phạm tính thuần khiết của functional programming).

---

## PHẦN 5: PRIMITIVE STREAMS & PRIMITIVE OPTIONALS

Xử lý luồng với các kiểu đóng gói `Stream<Integer>`, `Stream<Double>` gây tiêu tốn bộ nhớ và giảm hiệu năng đáng kể do liên tục phải Autoboxing/Unboxing. Java cung cấp 3 lớp chuyên biệt dành cho dữ liệu nguyên thuỷ:
* **`IntStream`:** Dành cho các kiểu `int`, `short`, `byte`, `char`.
* **`LongStream`:** Dành cho kiểu `long`.
* **`DoubleStream`:** Dành cho kiểu `double`, `float`.

### 1. Khởi Tạo Primitive Streams

```java
IntStream empty = IntStream.empty();
IntStream one = IntStream.of(1);
IntStream range1 = IntStream.range(1, 6);       // [1, 2, 3, 4, 5] (Loại trừ số 6)
IntStream range2 = IntStream.rangeClosed(1, 6); // [1, 2, 3, 4, 5, 6] (Bao gồm cả số 6)
```

---

### 2. Bảng 10.5: Các Phương Thức Tính Toán Đặc Thù Của Primitive Streams

| Phương Thức | Kiểu Trả Về | Mô Tả |
| :--- | :--- | :--- |
| `sum()` | `int` / `long` / `double` | Tính tổng các phần tử. Nếu stream rỗng $\rightarrow$ trả về `0`. |
| `average()` | `OptionalDouble` | Tính giá trị trung bình cộng. Nếu rỗng $\rightarrow$ trả về `OptionalDouble.empty()`. |
| `min()` | `OptionalInt` / `OptionalLong` / `OptionalDouble` | Tìm giá trị nhỏ nhất (không cần truyền Comparator). |
| `max()` | `OptionalInt` / `OptionalLong` / `OptionalDouble` | Tìm giá trị lớn nhất. |
| `summaryStatistics()` | `IntSummaryStatistics` / `Long...` / `Double...` | Trả về một đối tượng tổng hợp duy nhất chứa: `count`, `sum`, `min`, `average`, `max`! |

```java
IntStream ints = IntStream.of(10, 20, 30);
IntSummaryStatistics stats = ints.summaryStatistics();
System.out.println("Max: " + stats.getMax());         // 30
System.out.println("Min: " + stats.getMin());         // 10
System.out.println("Average: " + stats.getAverage()); // 20.0
System.out.println("Sum: " + stats.getSum());         // 60
System.out.println("Count: " + stats.getCount());     // 3
```

---

### 3. Bảng 10.6 & 10.7: Chuyển Đổi Qua Lại Giữa Các Kiểu Stream

| Từ Luồng Nguồn | Chuyển Sang `Stream<T>` | Chuyển Sang `IntStream` | Chuyển Sang `LongStream` | Chuyển Sang `DoubleStream` |
| :--- | :--- | :--- | :--- | :--- |
| **`Stream<T>`** | `map()` | `mapToInt()` | `mapToLong()` | `mapToDouble()` |
| **`IntStream`** | `mapToObj()` hoặc `.boxed()` | `map()` | `mapToLong()` | `mapToDouble()` |
| **`LongStream`** | `mapToObj()` hoặc `.boxed()` | `mapToInt()` | `map()` | `mapToDouble()` |
| **`DoubleStream`** | `mapToObj()` hoặc `.boxed()` | `mapToInt()` | `mapToLong()` | `map()` |

* Phương thức **`boxed()`**: Biến đổi nhanh từ `IntStream` thành `Stream<Integer>`, từ `DoubleStream` thành `Stream<Double>`.

---

### 4. Bảng 10.8: Các Lớp `Optional` Cho Kiểu Nguyên Thuỷ

* Ba lớp: **`OptionalInt`**, **`OptionalLong`**, **`OptionalDouble`**.
* Không chứa phương thức `get()`, thay vào đó là:
  * `int getAsInt()`
  * `long getAsLong()`
  * `double getAsDouble()`
* Phương thức `orElseGet` nhận functional interface nguyên thuỷ: `IntSupplier`, `LongSupplier`, `DoubleSupplier`.

---

## PHẦN 6: PIPELINE NÂNG CAO, BỘ THU THẬP `COLLECTORS` & `SPLITERATOR`

### 1. Sự Phụ Thuộc Giữa Stream & Cấu Trúc Dữ Liệu Gốc

Vì Stream áp dụng cơ chế đánh giá trễ (lazy evaluation), luồng dữ liệu **không chụp ảnh nhanh (snapshot)** dữ liệu tại thời điểm tạo stream. Nếu collection gốc bị thay đổi trước khi terminal operation được gọi, stream sẽ phản ánh dữ liệu mới nhất đó:

```java
var cats = new ArrayList<String>();
cats.add("Annie");
cats.add("Ripley");

var stream = cats.stream(); // Tạo stream (chưa chạy!)

cats.add("KC"); // Thêm phần tử vào danh sách gốc

System.out.println(stream.count()); // In ra: 3 (chứ không phải 2)!
```

---

### 2. Bảng 10.10: Toàn Diện Về Các `Collector` Thu Thập Dữ Liệu (`Collectors`)

Lớp `java.util.stream.Collectors` cung cấp hàng loạt các bộ thu thập cực kỳ mạnh mẽ:

#### 1. Thu Thập Cơ Bản & Chuyển Đổi Kiểu
* `Collectors.toList()`: Thu thập vào `List` thông thường.
* `Collectors.toSet()`: Thu thập vào `Set` (tự khử trùng lặp).
* `Collectors.toCollection(Supplier)`: Tuỳ biến kiểu collection cụ thể (`TreeSet::new`, `LinkedList::new`).
* `Collectors.toUnmodifiableList()` / `toUnmodifiableSet()`: Tạo tập hợp bất biến tuyệt đối.
* `Collectors.joining(delimiter, prefix, suffix)`: Nối các chuỗi ký tự lại với nhau.

#### 2. Thu Thập Dạng Ánh Xạ: `Collectors.toMap()`
* Cú pháp 2 tham số: `toMap(Function keyMapper, Function valueMapper)`  
  *Nếu gặp key trùng lặp $\rightarrow$ Ném `IllegalStateException`!*
* Cú pháp 3 tham số (Quy tắc xử lý trùng key):  
  `toMap(keyMapper, valueMapper, BinaryOperator mergeRule)`
* Cú pháp 4 tham số:  
  `toMap(keyMapper, valueMapper, mergeRule, Supplier mapSupplier)` (chỉ định tạo `TreeMap::new`).

```java
Stream<String> s = Stream.of("lions", "tigers", "bears");
Map<Integer, String> map = s.collect(
   Collectors.toMap(
      String::length,
      k -> k,
      (s1, s2) -> s1 + "," + s2, // Nối hai con thú nếu cùng độ dài tên
      TreeMap::new
   )
);
System.out.println(map); // {5=lions,bears, 6=tigers}
```

---

### 3. Phân Nhóm (`groupingBy`) & Phân Vùng (`partitioningBy`)

#### A. `Collectors.groupingBy()`: Gom nhóm đa nhánh
Kết quả trả về một `Map<Key, List<T>>` (hoặc cấu trúc khác tuỳ downstream collector):
1. **1 tham số:** `groupingBy(Function classifier)`
   ```java
   var s = Stream.of("lions", "tigers", "bears");
   Map<Integer, List<String>> map = s.collect(Collectors.groupingBy(String::length));
   // Kết quả: {5=[lions, bears], 6=[tigers]}
   ```
2. **2 tham số (Kèm downstream collector):** `groupingBy(classifier, downstream)`
   ```java
   // Đếm số lượng con thú ở mỗi độ dài:
   Map<Integer, Long> countMap = s.collect(
      Collectors.groupingBy(String::length, Collectors.counting())
   );
   // Kết quả: {5=2, 6=1}
   ```
3. **3 tham số (Kèm map supplier):** `groupingBy(classifier, mapFactory, downstream)`
   Cho phép trả về một `TreeMap` thay vì `HashMap` mặc định.

#### B. `Collectors.partitioningBy()`: Phân vùng nhị phân
Phân chia luồng thành đúng 2 phần dựa trên một `Predicate`: thoả mãn (`true`) và không thoả mãn (`false`).
> [!IMPORTANT]
> **Đặc trưng số 1 của `partitioningBy`:**  
> Kết quả trả về luôn luôn là một `Map<Boolean, ...>` với **đầy đủ 2 khoá `true` và `false`**, ngay cả khi một trong hai nhóm không có bất kỳ phần tử nào (nhóm đó sẽ chứa danh sách rỗng `[]`)!
> ```java
> var s = Stream.of("lions", "tigers", "bears");
> Map<Boolean, List<String>> part = s.collect(
>    Collectors.partitioningBy(s -> s.length() <= 7)
> );
> System.out.println(part); // {false=[], true=[lions, tigers, bears]}
> ```

---

### 4. Thu Thập Lồng Nhau: `mapping()` & `teeing()` (Java 12)

#### `Collectors.mapping()`:
Áp dụng một hàm chuyển đổi trước khi chuyển dữ liệu cho downstream collector:
```java
var s = Stream.of("lions", "tigers", "bears");
// Lấy chữ cái đầu tiên nhỏ nhất theo bảng chữ cái của mỗi độ dài:
Map<Integer, Optional<Character>> map = s.collect(
   Collectors.groupingBy(
      String::length,
      Collectors.mapping(
         str -> str.charAt(0),
         Collectors.minBy((c1, c2) -> c1 - c2)
      )
   )
);
System.out.println(map); // {5=Optional[b], 6=Optional[t]}
```

#### `Collectors.teeing()` (Tính Năng Mới Java 12):
Cho phép áp dụng **đồng thời hai Collectors khác nhau** trên cùng một luồng dữ liệu trong một lần duyệt duy nhất, sau đó gộp kết quả của cả hai bằng một hàm `BiFunction`:
```java
record Result(String spaceSeparated, String commaSeparated) {}

var list = List.of("x", "y", "z");
Result result = list.stream().collect(
   Collectors.teeing(
      Collectors.joining(" "), // Collector 1
      Collectors.joining(","), // Collector 2
      (s, c) -> new Result(s, c) // Merger Function
   )
);
System.out.println(result); // Result[spaceSeparated=x y z, commaSeparated=x,y,z]
```

---

### 5. Bảng 10.11: Kiểm Soát Luồng Dữ Liệu Với `Spliterator`

Một `Spliterator` (Split + Iterator) là công cụ nền tảng bên dưới của Java Collections và Streams dùng để duyệt và phân tách dữ liệu cho các tác vụ song song:

| Phương Thức Cốt Lõi | Mô Tả |
| :--- | :--- |
| `Spliterator<T> trySplit()` | Tách lấy lý tưởng là **một nửa dữ liệu** từ Spliterator hiện tại sang một Spliterator mới. Nếu không thể chia tách tiếp (hoặc đã hết) $\rightarrow$ trả về `null`. |
| `boolean tryAdvance(Consumer<? super T> action)` | Xử lý **duy nhất 1 phần tử** tiếp theo nếu còn. Trả về `true` nếu có phần tử được xử lý, `false` nếu đã hết dữ liệu. |
| `void forEachRemaining(Consumer<? super T> action)` | Duyệt và thực thi Consumer trên **toàn bộ các phần tử còn lại** trong Spliterator hiện tại. |
| `long estimateSize()` | Ước tính số lượng phần tử còn lại cần xử lý. |

```java
var list = List.of("bird-", "bunny-", "cat-", "dog-", "fish-", "lamb-", "mouse-");
Spliterator<String> original = list.spliterator(); // Có 7 phần tử

Spliterator<String> bag1 = original.trySplit(); // Tách khoảng 1 nửa ở đầu: bird, bunny, cat
bag1.forEachRemaining(System.out::print);       // In: bird-bunny-cat-

Spliterator<String> bag2 = original.trySplit(); // Tách tiếp từ phần còn lại: dog, fish
bag2.tryAdvance(System.out::print);             // In đúng 1 phần tử: dog-
bag2.forEachRemaining(System.out::print);       // In nốt phần tử còn lại: fish-

original.forEachRemaining(System.out::print);   // In nốt phần tử gốc còn lại: lamb-mouse-
```

---

## ⚠️ TỔNG KẾT CÁC BẪY THI OCP CHƯƠNG 10 (EXAM TRAPS CHECKLIST)

1. **`Optional.of(null)`:** Ném ngay `NullPointerException`. Muốn an toàn với `null` bắt buộc phải dùng `Optional.ofNullable()`.
2. **`opt.get()` trên Optional rỗng:** Ném `NoSuchElementException`.
3. **`orElse()` vs `orElseGet()`:** `orElse(call())` luôn luôn gọi phương thức ngay lập tức (eager evaluation). `orElseGet(() -> call())` chỉ thực thi khi Optional thực sự rỗng (lazy evaluation).
4. **Tái sử dụng Stream đã đóng:** Một khi terminal operation đã chạy, stream bị đóng. Gọi bất kỳ thao tác nào tiếp theo trên stream đó sẽ ném `IllegalStateException`.
5. **Stream vô hạn (Infinite Streams):**
   * Các hàm `count()`, `min()`, `max()`, `sorted()`, `reduce()`, `collect()`, `forEach()` sẽ khiến chương trình bị **treo vĩnh viễn (hangs)** nếu không có `limit()` đứng trước.
   * `findAny()`, `findFirst()`, `anyMatch()` có thể ngắt mạch và kết thúc bình thường trên stream vô hạn.
6. **Vị trí của `sorted()` và `limit()`:** Gọi `stream.sorted().limit(2)` trên stream vô hạn sẽ bị treo. Phải gọi `stream.limit(2).sorted()`.
7. **`peek()`:** Không chạy nếu pipeline không có Terminal Operation. Không dùng `peek()` để sửa đổi đối tượng.
8. **`reduce()` 1 tham số vs 2 tham số:** 1 tham số trả về `Optional<T>`. 2 tham số trả về giá trị kiểu `T` (nếu rỗng trả về identity).
9. **`IntStream.range(1, 5)` vs `rangeClosed(1, 5)`:** `range` chạy từ 1 đến 4 (loại trừ 5); `rangeClosed` chạy từ 1 đến 5.
10. **`Collectors.toMap()`:** Nếu xuất hiện key trùng lặp mà không cung cấp tham số merge rule thứ 3, Java sẽ ném `IllegalStateException` tại runtime.
11. **`Collectors.partitioningBy()`:** Luôn luôn trả về Map chứa đủ 2 khoá `Boolean.TRUE` và `Boolean.FALSE`, dù một nhóm có thể là danh sách rỗng.
12. **`Spliterator` trên Stream vô hạn:** Gọi `tryAdvance()` vài lần sẽ an toàn; nhưng gọi `forEachRemaining()` trên stream vô hạn sẽ gây treo chương trình mãi mãi!
