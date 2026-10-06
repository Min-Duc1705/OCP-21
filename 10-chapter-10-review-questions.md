# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chapter 10: Streams

> **Nguồn trích dẫn:** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Trang 895–905).  
> **Số lượng:** 21 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết (Trang 1384–1390).  
> **Cách học:** Bạn hãy tự đọc đề và suy luận đáp án trước, sau đó bấm vào mục **"🔍 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và khắc sâu các bẫy thi của Oracle.

---

### Câu 1 (Question 1)
**Kết quả có thể có của đoạn mã sau là gì?**

```java
var stream = Stream.iterate("", (s) -> s + "1");
System.out.println(stream.limit(2).map(x -> x + "2"));
```

* A. `12112`
* B. `212`
* C. `212112`
* D. `java.util.stream.ReferencePipeline$3@4517d9a3` (hoặc chuỗi tham chiếu tương tự)
* E. Đoạn mã không biên dịch được.
* F. Một ngoại lệ được ném ra tại thời điểm chạy.
* G. Đoạn mã bị treo (hangs).

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D (Chuỗi tham chiếu Stream)**
* **Phân tích chi tiết:**
  * Dòng 1 khởi tạo một tham chiếu stream vô hạn: `Stream.iterate("", (s) -> s + "1")`.
  * Dòng 2 gọi các thao tác trung gian (intermediate operations):
    * `.limit(2)` trả về một `Stream<String>`.
    * `.map(x -> x + "2")` tiếp tục trả về một `Stream<String>`.
  * **Quan sát mấu chốt:** Đoạn mã **hoàn toàn KHÔNG gọi bất kỳ thao tác kết thúc (terminal operation) nào** (như `collect`, `forEach`, `count`...)!
  * Do cơ chế **đánh giá trễ (lazy evaluation)** của Stream, nếu không có terminal operation, toàn bộ pipeline sẽ không bao giờ được kích hoạt để sinh ra dữ liệu.
  * Lệnh `System.out.println(...)` chỉ đơn thuần in ra đối tượng `Stream` hiện tại (gọi phương thức `toString()` mặc định của `java.lang.Object`), sinh ra chuỗi đại diện tham chiếu của lớp nội bộ trong gói `java.util.stream`, ví dụ: `java.util.stream.ReferencePipeline$3@4517d9a3`.
  * Do đó, đáp án đúng là **D**.
* **Bẫy thi cần nhớ:** Stream không tự động in ra các phần tử bên trong như `Collection`. Muốn in phần tử, bắt buộc phải có terminal operation (ví dụ `.forEach(System.out::print)`). Nếu in trực tiếp biến Stream, kết quả chỉ là chuỗi hashcode/tham chiếu đối tượng.
</details>

---

### Câu 2 (Question 2)
**Kết quả có thể có của đoạn mã sau là gì?**

```java
Predicate<String> predicate = s -> s.startsWith("g");
var stream1 = Stream.generate(() -> "growl!");
var stream2 = Stream.generate(() -> "growl!");
var b1 = stream1.anyMatch(predicate);
var b2 = stream2.allMatch(predicate);
System.out.println(b1 + " " + b2);
```

* A. `true false`
* B. `true true`
* C. `java.util.stream.ReferencePipeline$3@4517d9a3`
* D. Đoạn mã không biên dịch được.
* E. Một ngoại lệ được ném ra tại thời điểm chạy.
* F. Đoạn mã bị treo vĩnh viễn (The code hangs).

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (The code hangs - Đoạn mã bị treo)**
* **Phân tích chi tiết:**
  * Cả hai luồng `stream1` và `stream2` đều là **luồng vô hạn (infinite streams)** được tạo bởi `Stream.generate()`, liên tục sinh ra chuỗi `"growl!"`.
  * `predicate` kiểm tra chuỗi có bắt đầu bằng chữ `"g"` hay không: `"growl!".startsWith("g")` luôn luôn trả về `true`.
  * **Với `stream1.anyMatch(predicate)`:**
    * Phương thức `anyMatch()` mang tính chất **ngắt mạch (short-circuiting)**. Nó dừng lại ngay lập tức khi tìm thấy **phần tử đầu tiên** thoả mãn điều kiện.
    * Phần tử đầu tiên là `"growl!"` (bắt đầu bằng `"g"` $\rightarrow$ `true`), nên `anyMatch()` kết thúc ngay và gán `b1 = true`.
  * **Với `stream2.allMatch(predicate)`:**
    * Phương thức `allMatch()` chỉ có thể dừng sớm nếu gặp ít nhất **một phần tử vi phạm điều kiện (`false`)**.
    * Tuy nhiên, vì mọi phần tử trong `stream2` đều là `"growl!"` (luôn luôn là `true`), `allMatch()` không bao giờ tìm thấy phần tử `false` nào để dừng lại.
    * Do luồng là vô hạn, `allMatch()` tiếp tục duyệt mãi mãi để kiểm tra các phần tử tiếp theo $\rightarrow$ **Chương trình bị treo vô tận (hangs)** tại dòng gán `b2`!
  * Do đó, dòng in kết quả không bao giờ được chạm tới $\rightarrow$ Đáp án đúng là **F**.
* **Bẫy thi cần nhớ:** Trên luồng vô hạn:
  * `anyMatch()` kết thúc nếu tìm thấy `true`.
  * `noneMatch()` kết thúc nếu tìm thấy `true` (khiến kết quả thành `false`).
  * `allMatch()` kết thúc nếu tìm thấy `false`. Nhưng nếu mọi phần tử đều là `true`, `allMatch()` sẽ duyệt vô tận và treo chương trình!
</details>

---

### Câu 3 (Question 3)
**Kết quả có thể có của đoạn mã sau là gì?**

```java
Predicate<String> predicate = s -> s.length() > 3;
var stream = Stream.iterate("-", 
   s -> !s.isEmpty(), (s) -> s + s);
var b1 = stream.noneMatch(predicate);
var b2 = stream.anyMatch(predicate);
System.out.println(b1 + " " + b2);
```

* A. `false false`
* B. `false true`
* C. `java.util.stream.ReferencePipeline$3@4517d9a3`
* D. Đoạn mã không biên dịch được.
* E. Một ngoại lệ được ném ra tại thời điểm chạy (An exception is thrown).
* F. Đoạn mã bị treo (hangs).

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (An exception is thrown)**
* **Phân tích chi tiết:**
  * Khởi tạo stream bằng `Stream.iterate("-", s -> !s.isEmpty(), s -> s + s)`:
    * `seed = "-"` (độ dài 1).
    * Mỗi bước tiếp theo nhân đôi chuỗi: `"--"`, `"----"`, `"--------"`...
    * Điều kiện `!s.isEmpty()` luôn luôn đúng $\rightarrow$ Đây là luồng vô hạn.
  * Dòng gán `b1`: `stream.noneMatch(predicate)`:
    * `predicate`: kiểm tra độ dài chuỗi có lớn hơn 3 hay không.
    * Phần tử thứ ba `"----"` có độ dài là 4 ($> 3$). Do tìm thấy phần tử thoả mãn, `noneMatch()` ngắt mạch thành công và trả về `b1 = false`.
    * **Quan trọng:** `noneMatch()` là một **thao tác kết thúc (terminal operation)**. Sau khi dòng này chạy xong, đối tượng `stream` **ĐÃ BỊ ĐÓNG VĨNH VIỄN**!
  * Dòng gán `b2`: `stream.anyMatch(predicate)`:
    * Cố gắng gọi tiếp một thao tác kết thúc khác (`anyMatch`) trên cùng một đối tượng `stream` đã bị đóng.
    * Quy tắc cốt lõi của Stream API: **Stream chỉ được tiêu thụ duy nhất 1 lần**.
    * Java sẽ ném ra ngoại lệ **`java.lang.IllegalStateException: stream has already been operated upon or closed`** tại thời điểm chạy!
  * Do đó, đáp án đúng là **E**.
* **Bẫy thi cần nhớ:** Tái sử dụng một Stream instance sau khi đã gọi Terminal Operation luôn ném `IllegalStateException`.
</details>

---

### Câu 4 (Question 4)
**Các nhận định nào sau đây là đúng về các thao tác kết thúc (terminal operations) trong một stream hoạt động thành công? (Chọn tất cả các đáp án đúng.)**

* A. Có tối đa một thao tác kết thúc có thể tồn tại trong một stream pipeline.
* B. Thao tác kết thúc là thành phần bắt buộc phải có trong stream pipeline để thu được kết quả.
* C. Thao tác kết thúc có kiểu trả về là `Stream`.
* D. Phương thức `peek()` là một ví dụ của thao tác kết thúc.
* E. Tham chiếu `Stream` vẫn có thể tiếp tục được sử dụng sau khi gọi thao tác kết thúc.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B**
* **Phân tích chi tiết:**
  * **A đúng:** Một pipeline chỉ có thể kết thúc bằng duy nhất 1 thao tác kết thúc.
  * **B đúng:** Nếu không có thao tác kết thúc, cơ chế Lazy Evaluation sẽ không kích hoạt pipeline, và bạn không thể lấy được bất kỳ kết quả tính toán nào.
  * **C sai:** Thao tác trung gian (intermediate operation) mới có kiểu trả về là `Stream`. Thao tác kết thúc trả về một kiểu dữ liệu khác (`void`, `long`, `Optional`, `Collection`, `boolean`...).
  * **D sai:** `peek()` là một thao tác trung gian (intermediate operation), trả về `Stream<T>`.
  * **E sai:** Sau khi gọi thao tác kết thúc, Stream bị đóng vĩnh viễn và không thể tái sử dụng.
* **Bẫy thi cần nhớ:** Phân biệt rõ ràng giữa Intermediate Operation (trả về Stream, lazy) và Terminal Operation (chấm dứt Stream, eager).
</details>

---

### Câu 5 (Question 5)
**Lựa chọn nào sau đây gán giá trị `result` bằng `8.0`? (Chọn tất cả các đáp án đúng.)**

* A. 
  ```java
  double result = LongStream.of(6L, 8L, 10L)
     .mapToInt(x -> (int) x)
     .collect(Collectors.groupingBy(x -> x))
     .keySet()
     .stream()
     .collect(Collectors.averagingInt(x -> x));
  ```
* B. 
  ```java
  double result = LongStream.of(6L, 8L, 10L)
     .mapToInt(x -> x)
     .boxed()
     .collect(Collectors.groupingBy(x -> x))
     .keySet()
     .stream()
     .collect(Collectors.averagingInt(x -> x));
  ```
* C. 
  ```java
  double result = LongStream.of(6L, 8L, 10L)
     .mapToInt(x -> (int) x)
     .boxed()
     .collect(Collectors.groupingBy(x -> x))
     .keySet()
     .stream()
     .collect(Collectors.averagingInt(x -> x));
  ```
* D. 
  ```java
  double result = LongStream.of(6L, 8L, 10L)
     .mapToInt(x -> (int) x)
     .collect(Collectors.groupingBy(x -> x, Collectors.toSet()))
     .keySet()
     .stream()
     .collect(Collectors.averagingInt(x -> x));
  ```
* E. 
  ```java
  double result = LongStream.of(6L, 8L, 10L)
     .mapToInt(x -> x)
     .boxed()
     .collect(Collectors.groupingBy(x -> x, Collectors.toSet()))
     .keySet()
     .stream()
     .collect(Collectors.averagingInt(x -> x));
  ```
* F. 
  ```java
  double result = LongStream.of(6L, 8L, 10L)
     .mapToInt(x -> (int) x)
     .boxed()
     .collect(Collectors.groupingBy(x -> x, Collectors.toSet()))
     .keySet()
     .stream()
     .collect(Collectors.averagingInt(x -> x));
  ```

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, F**
* **Phân tích chi tiết:**
  * Đây là dạng câu hỏi dài kiểm tra khả năng phát hiện khác biệt cú pháp của kỳ thi OCP. Hãy so sánh các điểm khác biệt giữa các lựa chọn:
  * **Điểm khác biệt 1: Chuyển đổi từ `LongStream` sang `IntStream`:**
    * Luồng nguồn là `LongStream` (chứa các số kiểu `long`).
    * Phương thức `mapToInt()` nhận một `LongToIntFunction`. Vì chuyển đổi từ `long` sang `int` là phép thu hẹp kiểu (narrowing primitive conversion), Java **bắt buộc phải có ép kiểu tường minh `(int) x`**.
    * Lựa chọn **B** và **E** dùng `x -> x` (không ép kiểu) $\rightarrow$ **LỖI BIÊN DỊCH** tại `mapToInt()`.
  * **Điểm khác biệt 2: Gọi `collect()` trên Primitive Stream:**
    * Trên `IntStream`, phương thức `collect()` chỉ có dạng 3 tham số `collect(Supplier, ObjIntConsumer, BiConsumer)`. Nó **không có overload nhận 1 tham số `Collector`** như `Stream<T>` đối tượng!
    * Muốn dùng các bộ thu thập của lớp `Collectors` (như `Collectors.groupingBy`), bắt buộc phải chuyển từ `IntStream` sang `Stream<Integer>` bằng cách gọi **`.boxed()`**.
    * Lựa chọn **A** và **D** thiếu `.boxed()` $\rightarrow$ **LỖI BIÊN DỊCH** tại lệnh gọi `collect(Collectors.groupingBy(...))`.
  * **Điểm khác biệt 3 giữa C và F:**
    * C dùng `groupingBy(x -> x)` trả về `Map<Integer, List<Integer>>`.
    * F dùng `groupingBy(x -> x, Collectors.toSet())` trả về `Map<Integer, Set<Integer>>`. Cả hai đều hoàn toàn hợp lệ!
    * Sau đó, lấy `.keySet()` gồm các số `{6, 8, 10}`, tạo stream và tính trung bình cộng bằng `averagingInt(x -> x)`:
      $$\frac{6 + 8 + 10}{3} = \frac{24}{3} = 8.0$$
  * Do đó, cả **C và F** đều biên dịch thành công và cho ra kết quả `8.0`.
* **Bẫy thi cần nhớ:** Primitive stream (`IntStream`, `LongStream`, `DoubleStream`) không thể dùng trực tiếp `Collectors.*` nếu chưa gọi `.boxed()` để chuyển thành Stream đối tượng wrapper. Chuyển từ `long` sang `int` phải có cast `(int)`.
</details>

---

### Câu 6 (Question 6)
**Phương thức nào sau đây có thể điền vào chỗ trống để đoạn mã in ra `false`?**

```java
var s = Stream.generate(() -> "meow");
var match = s.__________(String::isEmpty);
System.out.println(match);
```

* A. Chỉ `allMatch` (Only allMatch)
* B. Chỉ `anyMatch` (Only anyMatch)
* C. Chỉ `noneMatch` (Only noneMatch)
* D. Cả `allMatch` và `anyMatch`
* E. Cả `allMatch` và `noneMatch`
* F. Không có phương thức nào ở trên

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A (Chỉ allMatch)**
* **Phân tích chi tiết:**
  * `s` là một stream vô hạn liên tục sinh ra chuỗi `"meow"`.
  * Predicate kiểm tra: `String::isEmpty`. Đối với chuỗi `"meow"`, `isEmpty()` luôn trả về **`false`**.
  * **Xét `allMatch`:**
    * Định nghĩa: Trả về `true` nếu TẤT CẢ các phần tử đều thoả mãn điều kiện; trả về `false` ngay khi gặp phần tử ĐẦU TIÊN KHÔNG thoả mãn điều kiện.
    * Khi phần tử đầu tiên `"meow"` đi qua, nó không rỗng (`isEmpty()` = `false`). `allMatch()` ngắt mạch ngay lập tức và trả về **`false`**.
  * **Xét `anyMatch` và `noneMatch`:**
    * `anyMatch()`: Cần tìm ít nhất 1 phần tử thoả mãn `true` để dừng lại. Vì `"meow"` luôn cho ra `false`, `anyMatch()` không thể biết liệu trong tương lai có chuỗi rỗng nào xuất hiện hay không, nên nó sẽ **chạy vô tận và treo máy**.
    * `noneMatch()`: Cần tìm ít nhất 1 phần tử thoả mãn `true` để dừng lại và trả về `false`. Tương tự, nó cũng sẽ **chạy vô tận và treo máy**.
  * Vì vậy, phương thức duy nhất có thể dừng lại và in ra `false` là **`allMatch`** $\rightarrow$ Đáp án đúng là **A**.
* **Bẫy thi cần nhớ:** `allMatch()` ngắt mạch và trả về `false` ngay khi gặp phần tử không khớp.
</details>

---

### Câu 7 (Question 7)
**Chúng ta có một phương thức trả về một danh sách đã sắp xếp mà không làm thay đổi danh sách gốc. Chúng ta muốn viết lại phương thức này bằng Stream. Cặp phương thức nào sau đây có thể điền vào hai chỗ trống trong `refactored()` để thực hiện cùng chức năng?**

```java
private static List<String> sort(List<String> list) {
   var copy = new ArrayList<String>(list);
   Collections.sort(copy, (a, b) -> b.compareTo(a));
   return copy;
}

private static List<String> refactored(List<String> list) {
   return list.stream()
      ._______((a, b) -> b.compareTo(a))
      .__________;
}
```

* A. `compare` và `toList()`
* B. `compare` và `sort()`
* C. `compareTo` và `toList()`
* D. `compareTo` và `sort()`
* E. `sorted` và `collect()`
* F. `sorted` và `collect(Collectors.toList())`

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F**
* **Phân tích chi tiết:**
  * Trên giao diện `Stream<T>`, phương thức dùng để sắp xếp các phần tử là **`sorted(Comparator)`**. Không có phương thức nào trong `Stream` tên là `compare`, `compareTo` hay `sort` $\rightarrow$ Loại ngay các lựa chọn A, B, C, D.
  * Chỗ trống thứ nhất bắt buộc phải là `sorted`.
  * Chỗ trống thứ hai là thao tác kết thúc để thu thập luồng thành một `List<String>`.
    * Lựa chọn E điền `collect()` không tham số $\rightarrow$ Bị lỗi biên dịch vì phương thức `collect()` trong `Stream` bắt buộc phải có tham số (`collect(Collector)` hoặc 3 tham số).
    * Lựa chọn F điền `collect(Collectors.toList())` $\rightarrow$ Hoàn toàn chính xác, biên dịch và chạy đúng yêu cầu trả về `List<String>` đã sắp xếp giảm dần.
* **Bẫy thi cần nhớ:** Stream sắp xếp bằng phương thức `sorted()`. Lớp `Collections` mới dùng `sort()`.
</details>

---

### Câu 8 (Question 8)
**Các nhận định nào sau đây là đúng với khai báo bên dưới? (Chọn tất cả các đáp án đúng.)**

```java
var is = IntStream.empty();
```

* A. `is.average()` trả về kiểu `int`.
* B. `is.average()` trả về kiểu `OptionalInt`.
* C. `is.findAny()` trả về kiểu `int`.
* D. `is.findAny()` trả về kiểu `OptionalInt`.
* E. `is.sum()` trả về kiểu `int`.
* F. `is.sum()` trả về kiểu `OptionalInt`.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D, E**
* **Phân tích chi tiết:**
  * **Phương thức `average()`:** Trung bình cộng của các số nguyên hoàn toàn có thể là một số thập phân lẻ (ví dụ trung bình của 1 và 2 là 1.5). Do đó, trên `IntStream`, phương thức `average()` trả về kiểu **`OptionalDouble`** (chứ không phải `int` hay `OptionalInt`) $\rightarrow$ A và B sai.
  * **Phương thức `findAny()`:** Vì stream có thể rỗng, phương thức tìm kiếm phần tử của `IntStream` phải trả về một đối tượng bao bọc kiểu nguyên thuỷ là **`OptionalInt`** $\rightarrow$ **D đúng**, C sai.
  * **Phương thức `sum()`:** Tổng của một danh sách số nguyên chắc chắn là một số nguyên. Khi stream rỗng, tổng quy ước chuẩn trong toán học và Java là `0`. Do đó, Java thiết kế `sum()` trả về trực tiếp giá trị primitive **`int`** (chứ không trả về Optional) $\rightarrow$ **E đúng**, F sai.
* **Bẫy thi cần nhớ:** 
  * `sum()` trên `IntStream` trả về `int` (rỗng trả về `0`).
  * `min()` và `max()` trả về `OptionalInt`.
  * `average()` LUÔN trả về `OptionalDouble` (kể cả trên `IntStream` và `LongStream`).
</details>

---

### Câu 9 (Question 9)
**Các đoạn mã nào sau đây có thể thêm vào sau dòng 6 để chương trình chạy không có lỗi và không sinh ra bất kỳ kết quả in nào? (Chọn tất cả các đáp án đúng.)**

```java
4: var stream = LongStream.of(1, 2, 3);
5: var opt = stream.map(n -> n * 10)
6:    .filter(n -> n < 5).findFirst();
```

* A. 
  ```java
  if (opt.isPresent())
     System.out.println(opt.get());
  ```
* B. 
  ```java
  if (opt.isPresent())
     System.out.println(opt.getAsLong());
  ```
* C. 
  ```java
  opt.ifPresent(System.out.println);
  ```
* D. 
  ```java
  opt.ifPresent(System.out::println);
  ```
* E. Không có đoạn mã nào; mã nguồn bị lỗi biên dịch.
* F. Không có đoạn mã nào; dòng 6 ném ngoại lệ tại thời điểm chạy.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, D**
* **Phân tích chi tiết:**
  * Dòng 4–6: Khởi tạo `LongStream` với các giá trị `[1, 2, 3]`. Sau `map` nhân 10, luồng thành `[10, 20, 30]`. Sau `filter(n -> n < 5)`, không có phần tử nào thoả mãn $\rightarrow$ Luồng trở thành rỗng.
  * Lệnh `findFirst()` trên `LongStream` rỗng trả về một **`OptionalLong` rỗng** (`OptionalLong.empty()`).
  * Đoạn mã từ dòng 4–6 hoàn toàn biên dịch và chạy thành công mà không ném ngoại lệ $\rightarrow$ Loại E và F.
  * **Xét A:** `opt` là kiểu `OptionalLong`. Lớp `OptionalLong` **KHÔNG CÓ phương thức `get()`** (chỉ có `getAsLong()`) $\rightarrow$ Bị lỗi biên dịch!
  * **Xét B:** Sử dụng `opt.getAsLong()` là cú pháp chuẩn của `OptionalLong`. Vì `opt.isPresent()` là `false`, khối lệnh `if` không được thực thi $\rightarrow$ Không in ra gì, thoả mãn đề bài $\rightarrow$ **B đúng**.
  * **Xét C:** Cú pháp `System.out.println` thiếu dấu hai chấm kép `::` $\rightarrow$ Lỗi biên dịch.
  * **Xét D:** `opt.ifPresent(System.out::println)` sử dụng method reference chuẩn. Vì `opt` rỗng, Consumer không được gọi $\rightarrow$ Không in ra gì, thoả mãn đề bài $\rightarrow$ **D đúng**.
* **Bẫy thi cần nhớ:** `OptionalLong` có phương thức `getAsLong()`, không có `get()`. Method reference phải dùng cú pháp `ClassOrObject::methodName`.
</details>

---

### Câu 10 (Question 10)
**Cho bốn câu lệnh (L, M, N, O), hãy chọn thứ tự sắp xếp giúp đoạn mã in ra đúng 10 dòng?**

```java
Stream.generate(() -> "1")
   L: .filter(x -> x.length() > 1)
   M: .forEach(System.out::println)
   N: .limit(10)
   O: .peek(System.out::println);
```

* A. L, N
* B. L, N, O
* C. L, N, M
* D. L, N, M, O
* E. L, O, M
* F. N, M
* G. N, O

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (N, M)**
* **Phân tích chi tiết:**
  * Nguồn là một luồng vô hạn liên tục sinh ra chuỗi `"1"` (có độ dài bằng 1).
  * Trong bốn câu lệnh, **chỉ duy nhất câu lệnh M (`.forEach(...)`) là thao tác kết thúc (terminal operation)**. Bất kỳ phương án nào không kết thúc bằng M sẽ không kích hoạt pipeline và không in ra gì $\rightarrow$ Loại ngay A, B, D, G.
  * **Xét C (L, N, M):**
    * Lệnh L (`filter(x -> x.length() > 1)`) đứng trước N (`limit(10)`).
    * Chuỗi `"1"` có độ dài là 1, nên điều kiện `length() > 1` luôn luôn là `false`.
    * Filter không cho bất kỳ phần tử nào đi qua, do đó lệnh `limit(10)` không bao giờ đếm đủ 10 phần tử $\rightarrow$ Pipeline bị treo và chạy vô hạn! (Loại C).
  * **Xét E (L, O, M):** Không có thao tác giới hạn `limit()`, chương trình sẽ chạy vô hạn.
  * **Xét F (N, M):**
    * Nguồn vô hạn được ngắt ngay bằng N: `.limit(10)`, thu được một luồng hữu hạn chứa đúng 10 chuỗi `"1"`.
    * Sau đó M: `.forEach(System.out::println)` duyệt qua và in ra đúng 10 dòng chữ `"1"` $\rightarrow$ Hoàn toàn thoả mãn!
* **Bẫy thi cần nhớ:** Trên luồng vô hạn, phải đặt `limit()` ở vị trí hợp lý để biến luồng vô hạn thành hữu hạn; nếu đặt sau một `filter` luôn trả về `false`, chương trình sẽ bị treo vĩnh viễn.
</details>

---

### Câu 11 (Question 11)
**Cần thực hiện những thay đổi nào sau đây cùng nhau để đoạn mã in ra chuỗi `12345`? (Chọn tất cả các đáp án đúng.)**

```java
Stream.iterate(1, x -> x++)
   .limit(5).map(x -> x)
   .collect(Collectors.joining());
```

* A. Thay đổi `Collectors.joining()` thành `Collectors.joining(",")`.
* B. Thay đổi `map(x -> x)` thành `map(x -> "" + x)`.
* C. Thay đổi `x -> x++` thành `x -> ++x`.
* D. Thêm `.forEach(System.out::print)` ngay sau lệnh gọi `collect()`.
* E. Bao bọc toàn bộ dòng lệnh trong một câu lệnh `System.out.print(...)`.
* F. Không cần thay đổi nào, đoạn mã hiện tại đã in ra `12345`.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, C, E**
* **Phân tích chi tiết:**
  * Hãy phân tích từng vấn đề của đoạn mã ban đầu:
  1. **Lỗi toán tử tăng sau `x++`:**
     * Lambda `x -> x++` sử dụng post-increment: giá trị của biểu thức trả về là giá trị cũ của `x` trước khi tăng. Do đó, hàm này luôn trả về giá trị `1`.
     * Luồng sinh ra sẽ là chuỗi toàn số `1`: `[1, 1, 1, 1, 1]`.
     * Cần đổi thành pre-increment **`x -> ++x`** để sinh ra dãy số tăng dần `1, 2, 3, 4, 5` $\rightarrow$ **Chọn C**.
  2. **Lỗi kiểu dữ liệu trong `Collectors.joining()`:**
     * Phương thức `Collectors.joining()` **bắt buộc luồng đầu vào phải là `Stream<CharSequence>` (hoặc `Stream<String>`)**.
     * Ở đây, `Stream.iterate(1, ...)` tạo ra một `Stream<Integer>`. Dòng `map(x -> x)` giữ nguyên kiểu `Integer`, khiến dòng `collect(Collectors.joining())` bị **LỖI BIÊN DỊCH**!
     * Cần sửa đổi `map(x -> x)` thành **`map(x -> "" + x)`** để chuyển đổi từng `Integer` thành `String` $\rightarrow$ **Chọn B**.
  3. **Lỗi thiếu lệnh in ra màn hình:**
     * Lệnh `collect(Collectors.joining())` là một thao tác kết thúc trả về một đối tượng `String`, nhưng giá trị này không được gán cho biến nào và không được in ra.
     * Cần bao bọc toàn bộ biểu thức trong **`System.out.print(...)`** để in chuỗi thu được ra màn hình $\rightarrow$ **Chọn E**.
* **Bẫy thi cần nhớ:** `Collectors.joining()` chỉ hoạt động trên `Stream<String>`. Toán tử `x++` trong lambda trả về giá trị trước khi tăng.
</details>

---

### Câu 12 (Question 12)
**Nhận định nào sau đây là đúng về đoạn mã bên dưới?**

```java
Set<String> birds = Set.of("oriole", "flamingo");
Stream.concat(birds.stream(), birds.stream(), birds.stream())
   .sorted()       // line X
   .distinct()
   .findAny()
   .ifPresent(System.out::println);
```

* A. Chắc chắn in ra `flamingo` ở cả trường hợp giữ nguyên và khi xoá dòng X.
* B. Chắc chắn in ra `oriole` ở cả trường hợp giữ nguyên và khi xoá dòng X.
* C. Chắc chắn in ra `flamingo` khi giữ nguyên, nhưng không đảm bảo khi xoá dòng X.
* D. Chắc chắn in ra `oriole` khi giữ nguyên, nhưng không đảm bảo khi xoá dòng X.
* E. Kết quả đầu ra có thể thay đổi tuỳ thời điểm chạy.
* F. Đoạn mã không biên dịch được (The code does not compile).
* G. Đoạn mã ném ngoại lệ vì cùng một Set được dùng làm nguồn cho nhiều streams.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (The code does not compile)**
* **Phân tích chi tiết:**
  * Hãy nhìn kỹ dòng gọi `Stream.concat(...)`:
    ```java
    Stream.concat(birds.stream(), birds.stream(), birds.stream())
    ```
  * Trong Java API, phương thức `Stream.concat()` chỉ có **duy nhất một chữ ký nhận đúng HAI tham số**:
    ```java
    public static <T> Stream<T> concat(Stream<? extends T> a, Stream<? extends T> b)
    ```
  * Phương thức này **KHÔNG CÓ overload nào nhận 3 tham số** (varargs)!
  * Do truyền 3 tham số vào `Stream.concat()`, chương trình bị **LỖI BIÊN DỊCH** ngay tại dòng này.
  * Vì vậy, đáp án đúng là **F**.
* **Bẫy thi cần nhớ:** `Stream.concat(a, b)` chỉ nối được đúng 2 stream một lúc. Muốn nối nhiều hơn phải gọi lồng nhau hoặc dùng `Stream.of(s1, s2, s3).flatMap(s -> s)`.
</details>

---

### Câu 13 (Question 13)
**Nhận định nào sau đây là đúng về đoạn mã bên dưới?**

```java
List<Integer> x1 = List.of(1, 2, 3);
List<Integer> x2 = List.of(4, 5, 6);
List<Integer> x3 = List.of();
Stream.of(x1, x2, x3).map(x -> x + 1)
   .flatMap(x -> x.stream())
   .forEach(System.out::print);
```

* A. Đoạn mã biên dịch và in ra `123456`.
* B. Đoạn mã biên dịch và in ra `234567`.
* C. Đoạn mã biên dịch được nhưng không in ra gì.
* D. Đoạn mã biên dịch được nhưng in ra các tham chiếu của stream.
* E. Đoạn mã chạy vô hạn.
* F. Đoạn mã không biên dịch được (The code does not compile).
* G. Đoạn mã ném ra ngoại lệ tại thời điểm chạy.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (The code does not compile)**
* **Phân tích chi tiết:**
  * Nguồn stream: `Stream.of(x1, x2, x3)` tạo ra một luồng có kiểu là **`Stream<List<Integer>>`** (các phần tử trong luồng là các đối tượng `List`, chứ không phải số nguyên!).
  * Bước tiếp theo gọi: `.map(x -> x + 1)`.
    * Biến `x` ở đây đại diện cho từng phần tử trong luồng, tức là `x` có kiểu **`List<Integer>`**.
    * Trong ngôn ngữ Java, toán tử cộng số học `+` **hoàn toàn không được định nghĩa cho đối tượng `List`** (`List + int` là cú pháp không hợp lệ)!
  * Vì vậy, dòng `.map(x -> x + 1)` bị **LỖI BIÊN DỊCH** $\rightarrow$ Đáp án đúng là **F**.
  * *(Lưu ý: Nếu đảo ngược thứ tự gọi `flatMap(x -> x.stream())` trước rồi mới `map(x -> x + 1)`, thì đoạn mã mới hợp lệ và in ra `234567`).*
* **Bẫy thi cần nhớ:** Luôn luôn theo dõi chặt chẽ kiểu dữ liệu của biến `x` tại từng bước trong pipeline. `Stream.of(list1, list2)` là Stream chứa các List.
</details>

---

### Câu 14 (Question 14)
**Các nhận định nào sau đây là đúng về đoạn mã bên dưới? (Chọn tất cả các đáp án đúng.)**

```java
4: Stream<Integer> s = Stream.of(1);
5: IntStream is = s.boxed();
6: DoubleStream ds = s.mapToDouble(x -> x);
7: Stream<Integer> s2 = ds.mapToInt(x -> x);
8: s2.forEach(System.out::print);
```

* A. Dòng 4 gây lỗi biên dịch.
* B. Dòng 5 gây lỗi biên dịch.
* C. Dòng 6 gây lỗi biên dịch.
* D. Dòng 7 gây lỗi biên dịch.
* E. Dòng 8 gây lỗi biên dịch.
* F. Đoạn mã biên dịch được nhưng ném ngoại lệ tại thời điểm chạy.
* G. Đoạn mã biên dịch và in ra `1`.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, D**
* **Phân tích chi tiết:**
  * Dòng 4: `Stream.of(1)` autobox số `1` thành `Integer`, tạo ra `Stream<Integer>` hợp lệ.
  * **Dòng 5:** Biến `s` có kiểu `Stream<Integer>`. Phương thức `.boxed()` **chỉ tồn tại trên các Primitive Streams** (`IntStream`, `LongStream`, `DoubleStream`) để chuyển thành Stream đối tượng. Nó **không hề tồn tại** trên `Stream<T>` đối tượng $\rightarrow$ **Dòng 5 bị LỖI BIÊN DỊCH** (chọn **B**).
  * Dòng 6: `mapToDouble(x -> x)` trên `Stream<Integer>` unbox `Integer` thành `int` và tự động mở rộng (widening) thành `double`, trả về `DoubleStream` hợp lệ.
  * **Dòng 7:** Gặp 2 lỗi biên dịch cùng lúc:
    1. `ds` là `DoubleStream`. Biểu thức `x -> x` trả về `double`, không thể ngầm định gán cho `int` trong `mapToInt` mà thiếu ép kiểu tường minh `(int) x`.
    2. Phương thức `mapToInt()` trên `DoubleStream` trả về một **`IntStream`**, chứ không phải `Stream<Integer>`! Không thể gán `IntStream` cho biến `s2` có kiểu `Stream<Integer>`.
    $\rightarrow$ **Dòng 7 bị LỖI BIÊN DỊCH** (chọn **D**).
* **Bẫy thi cần nhớ:** `.boxed()` dùng để đổi từ Primitive sang Object Stream. `mapToInt()` luôn trả về `IntStream`, muốn thành `Stream<Integer>` phải gọi `.boxed()`.
</details>

---

### Câu 15 (Question 15)
**Với kiểu tổng quát `String`, bộ thu thập `partitioningBy()` mặc định tạo ra kiểu trả về `Map<Boolean, List<String>>`. Khi một downstream collector được truyền vào `partitioningBy()`, những kiểu trả về nào sau đây có thể được tạo ra? (Chọn tất cả các đáp án đúng.)**

* A. `Map<boolean, List<String>>`
* B. `Map<Boolean, List<String>>`
* C. `Map<Boolean, Map<String>>`
* D. `Map<Boolean, Set<String>>`
* E. `Map<Long, TreeSet<String>>`
* F. Không có đáp án nào ở trên

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, D**
* **Phân tích chi tiết:**
  * Phương thức `partitioningBy` chia dữ liệu thành 2 nhánh dựa trên boolean:
    * **Khoá (Key) của Map luôn luôn bắt buộc phải là `Boolean` wrapper**.
    * Lựa chọn A dùng primitive `boolean` làm generic type $\rightarrow$ Lỗi biên dịch (Generics không hỗ trợ kiểu nguyên thuỷ).
    * Lựa chọn E có key là kiểu `Long` $\rightarrow$ Sai (chỉ có `groupingBy` mới cho phép key kiểu khác `Boolean`).
  * Giao diện `Map` bắt buộc phải có 2 tham số kiểu `<K, V>`. Lựa chọn C khai báo `Map<String>` chỉ có 1 tham số kiểu $\rightarrow$ Lỗi cú pháp biên dịch.
  * **Giá trị (Value) của Map:** Có thể được tuỳ biến bằng downstream collector:
    * Mặc định là `List<String>` $\rightarrow$ Khớp lựa chọn **B** (ví dụ downstream là `Collectors.toList()`).
    * Có thể chuyển thành `Set<String>` $\rightarrow$ Khớp lựa chọn **D** (ví dụ downstream là `Collectors.toSet()`).
* **Bẫy thi cần nhớ:** `partitioningBy` LUÔN LUÔN trả về `Map<Boolean, ...>`.
</details>

---

### Câu 16 (Question 16)
**Các nhận định nào sau đây là đúng về đoạn mã bên dưới? (Chọn tất cả các đáp án đúng.)**

```java
20: Predicate<String> empty = String::isEmpty;
21: Predicate<String> notEmpty = empty.negate();
22:
23: var result = Stream.generate(() -> "")
24:    .limit(10)
25:    .filter(notEmpty)
26:    .collect(Collectors.groupingBy(k -> k))
27:    .entrySet()
28:    .stream()
29:    .map(Entry::getValue)
30:    .flatMap(Collection::stream)
31:    .collect(Collectors.partitioningBy(notEmpty));
32: System.out.println(result);
```

* A. Đoạn mã in ra `{}`.
* B. Đoạn mã in ra `{false=[], true=[]}`.
* C. Nếu thay đổi dòng 31 từ `partitioningBy(notEmpty)` thành `groupingBy(n -> n)`, đoạn mã sẽ in ra `{}`.
* D. Nếu thay đổi dòng 31 từ `partitioningBy(notEmpty)` thành `groupingBy(n -> n)`, đoạn mã sẽ in ra `{false=[], true=[]}`.
* E. Đoạn mã không biên dịch được.
* F. Đoạn mã biên dịch được nhưng không bao giờ kết thúc tại thời điểm chạy.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, C**
* **Phân tích chi tiết:**
  * Dòng 23–24: `Stream.generate(() -> "").limit(10)` tạo ra một stream gồm 10 chuỗi rỗng `""`.
  * Dòng 25: `.filter(notEmpty)` lọc các chuỗi không rỗng. Vì tất cả 10 chuỗi đều rỗng, không có phần tử nào lọt qua $\rightarrow$ Luồng trở thành luồng rỗng (`empty stream`).
  * Dòng 26: Thu thập bằng `groupingBy` trên luồng rỗng sinh ra một `Map` rỗng `{}`.
  * Dòng 27–30: Lấy `entrySet().stream()` trên Map rỗng, chuyển đổi và `flatMap` lại tiếp tục cho ra một Stream rỗng.
  * **Tại dòng 31 (`partitioningBy(notEmpty)`):**
    * **Đặc tính độc nhất của `partitioningBy`:** Dù luồng đầu vào có rỗng hoàn toàn, `partitioningBy` **luôn luôn trả về một Map có đủ hai khoá `false` và `true`**, với giá trị liên kết tương ứng là hai danh sách rỗng `[]`!
    * Do đó, `result` có giá trị là **`{false=[], true=[]}`** $\rightarrow$ **B đúng**.
  * **Xét kịch bản thay bằng `groupingBy(n -> n)` (Lựa chọn C & D):**
    * Không giống như `partitioningBy`, bộ thu thập `groupingBy()` **chỉ tạo ra các khoá thực sự có phần tử xuất hiện trong luồng**.
    * Khi luồng đầu vào rỗng, `groupingBy` không tạo ra bất kỳ khoá nào và trả về Map rỗng **`{}`** $\rightarrow$ **C đúng**.
* **Bẫy thi cần nhớ:** `partitioningBy` trên stream rỗng trả về `{false=[], true=[]}`. `groupingBy` trên stream rỗng trả về `{}`.
</details>

---

### Câu 17 (Question 17)
**Kết quả của đoạn mã sau là gì?**

```java
var s = DoubleStream.of(1.2, 2.4);
s.peek(System.out::println).filter(x -> x > 2).count();
```

* A. `1`
* B. `2`
* C. `2.4`
* D. `1.2` và `2.4` (in trên từng dòng)
* E. Không có kết quả in nào.
* F. Đoạn mã không biên dịch được.
* G. Một ngoại lệ được ném ra tại thời điểm chạy.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D (1.2 và 2.4)**
* **Phân tích chi tiết:**
  * Pipeline gồm: Nguồn `DoubleStream.of(1.2, 2.4)` $\rightarrow$ Thao tác trung gian `peek(...)` $\rightarrow$ Thao tác trung gian `filter(...)` $\rightarrow$ Thao tác kết thúc `count()`.
  * Vì có thao tác kết thúc `count()`, toàn bộ pipeline được kích hoạt chạy.
  * Dữ liệu từ nguồn được truyền tuần tự:
    * Số `1.2` đi vào pipeline, đi qua `peek(System.out::println)` trước tiên $\rightarrow$ **In ra: `1.2`**.
    * Sau đó `1.2` đi vào `filter(x -> x > 2)`: Vì $1.2 \le 2$, phần tử này bị loại bỏ.
    * Tiếp theo, số `2.4` đi vào pipeline, đi qua `peek` $\rightarrow$ **In ra: `2.4`**.
    * Sau đó `2.4` đi vào `filter`: $2.4 > 2$ thoả mãn điều kiện, đi tiếp vào `count()`.
  * Thao tác `count()` đếm được 1 phần tử và trả về giá trị `1L`. Tuy nhiên, kết quả trả về của `count()` không được gán cho biến nào và không được in ra màn hình.
  * Do đó, thứ duy nhất được xuất ra màn hình console là kết quả từ lệnh `peek`: `1.2` và `2.4` $\rightarrow$ Đáp án **D**.
* **Bẫy thi cần nhớ:** `peek()` nằm trước `filter()`, nên mọi phần tử của stream ban đầu đều đi qua `peek()` và được in ra trước khi bị `filter()` loại bỏ.
</details>

---

### Câu 18 (Question 18)
**Kết quả đầu ra của đoạn mã sau là gì?**

```java
11: public class Paging {
12:    record Sesame(String name, boolean human)  {
13:       @Override public String toString() {
14:          return name();
15:       }
16:    } 
17:    record Page(List<Sesame> list, long count)  {}
18:
19:    public static void main(String[] args) {
20:       var monsters = Stream.of(new Sesame("Elmo", false));
21:       var people = Stream.of(new Sesame("Abby", true));
22:       printPage(monsters, people);
23:    }
24:
25:    private static void printPage(Stream<Sesame> monsters, 
26:          Stream<Sesame> people) {
27:       Page page = Stream.concat(monsters, people)
28:          .collect(Collectors.teeing(
29:             Collectors.filtering(s -> s.name().startsWith("E"), 
30:                Collectors.toList()),
31:             Collectors.counting(),
32:             (l, c) -> new Page(l, c)));
33:       System.out.println(page);
34:    } }
```

* A. `Page[list=[Abby], count=1]`
* B. `Page[list=[Abby], count=2]`
* C. `Page[list=[Elmo], count=1]`
* D. `Page[list=[Elmo], count=2]`
* E. Đoạn mã không biên dịch được do lỗi ở `Stream.concat()`.
* F. Đoạn mã không biên dịch được do lỗi ở `Collectors.teeing()`.
* G. Đoạn mã không biên dịch được vì lý do khác.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D (Page[list=[Elmo], count=2])**
* **Phân tích chi tiết:**
  * Dòng 20–21: Tạo 2 stream: `monsters` chứa `Elmo`, `people` chứa `Abby`.
  * Dòng 27: `Stream.concat(monsters, people)` nối 2 stream lại thành một stream duy nhất gồm 2 phần tử: `[Elmo, Abby]`.
  * Dòng 28–32 sử dụng bộ thu thập **`Collectors.teeing()`** (tính năng từ Java 12):
    * **Collector nhánh 1:** `Collectors.filtering(s -> s.name().startsWith("E"), Collectors.toList())`  
      Chỉ giữ lại các nhân vật có tên bắt đầu bằng `"E"`. Trong 2 nhân vật `[Elmo, Abby]`, chỉ có `Elmo` thoả mãn $\rightarrow$ Thu được danh sách: `[Elmo]`.
    * **Collector nhánh 2:** `Collectors.counting()`  
      Đếm tổng số phần tử đi qua stream. Cả 2 phần tử `Elmo` và `Abby` đều được đếm $\rightarrow$ Giá trị đếm là `2L`.
    * **Hàm gộp Merger Function:** `(l, c) -> new Page(l, c)`  
      Gộp kết quả từ 2 nhánh: `l = [Elmo]` và `c = 2` thành đối tượng `Page(list=[Elmo], count=2)`.
  * Dòng 33 in ra đối tượng record `page`, hiển thị: `Page[list=[Elmo], count=2]` $\rightarrow$ Đáp án đúng là **D**.
* **Bẫy thi cần nhớ:** `Collectors.teeing(c1, c2, merger)` duyệt luồng 1 lần duy nhất nhưng cho phép tính toán song song hai chỉ số độc lập và gộp kết quả lại với nhau.
</details>

---

### Câu 19 (Question 19)
**Cách viết lại đoạn mã sau đây một cách đơn giản nhất là gì?**

```java
List<Integer> x = IntStream.range(1, 6)
   .mapToObj(i -> i)
   .collect(Collectors.toList());
x.forEach(System.out::println);
```

* A. 
  ```java
  IntStream.range(1, 6);
  ```
* B. 
  ```java
  IntStream.range(1, 6)
     .forEach(System.out::println);
  ```
* C. 
  ```java
  IntStream.range(1, 6)
     .mapToObj(i -> i)
     .forEach(System.out::println);
  ```
* D. Không có cách nào ở trên tương đương.
* E. Đoạn mã đề bài không biên dịch được.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Phân tích chi tiết:**
  * Mục đích duy nhất của đoạn mã gốc là in các số từ 1 đến 5 ra màn hình.
  * Đoạn mã gốc bị dư thừa thao tác: Nó chuyển số nguyên thành đối tượng wrapper (`mapToObj`), sau đó gom vào một `List` trung gian bằng `collect()`, rồi mới duyệt `List` để in.
  * Bản thân giao diện `IntStream` **đã có sẵn phương thức kết thúc `.forEach(IntConsumer)`**!
  * Do đó, ta có thể gọi trực tiếp:
    ```java
    IntStream.range(1, 6).forEach(System.out::println);
    ```
    Phương thức này ngắn gọn nhất, hiệu năng cao nhất (không tốn bộ nhớ cấp phát cho List và Integer boxing).
  * Lựa chọn C tuy chạy được nhưng vẫn bị dư thừa thao tác `.mapToObj()`. Đề bài yêu cầu *"simplest way"* $\rightarrow$ Lựa chọn **B** là tối ưu nhất.
* **Bẫy thi cần nhớ:** Tránh việc thu thập dữ liệu vào `Collection` chỉ để duyệt in bằng `forEach`. Hãy gọi `forEach` trực tiếp trên `Stream`.
</details>

---

### Câu 20 (Question 20)
**Những câu lệnh nào sau đây sẽ ném ra ngoại lệ khi đối tượng `Optional` rỗng (`empty`)? (Chọn tất cả các đáp án đúng.)**

* A. `opt.orElse("");`
* B. `opt.orElseGet(() -> "");`
* C. `opt.orElseThrow();`
* D. `opt.orElseThrow(() -> throw new Exception());`
* E. `opt.orElseThrow(RuntimeException::new);`
* F. `opt.get();`
* G. `opt.get("");`

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, E, F**
* **Phân tích chi tiết:**
  * **A & B:** Khi `opt` rỗng, `orElse("")` và `orElseGet(() -> "")` sẽ trả về chuỗi rỗng `""` một cách an toàn mà không ném ra bất kỳ ngoại lệ nào.
  * **C đúng:** `orElseThrow()` không tham số sẽ ném **`NoSuchElementException`** khi Optional rỗng.
  * **D sai cú pháp biên dịch:** `orElseThrow(Supplier)` nhận một Supplier **trả về đối tượng ngoại lệ** (`() -> new Exception()`). Cú pháp `() -> throw new Exception()` chứa từ khoá `throw` bên trong thân biểu thức lambda là sai cú pháp trong ngữ cảnh Supplier $\rightarrow$ Lỗi biên dịch!
  * **E đúng:** `orElseThrow(RuntimeException::new)` sử dụng constructor reference hợp lệ của Supplier, khi Optional rỗng sẽ ném ra `RuntimeException`.
  * **F đúng:** `opt.get()` khi Optional rỗng sẽ ném ra **`NoSuchElementException`**.
  * **G sai cú pháp:** Phương thức `get()` của `Optional` không nhận bất kỳ tham số nào $\rightarrow$ Lỗi biên dịch.
* **Bẫy thi cần nhớ:** `get()` và `orElseThrow()` ném `NoSuchElementException`. Trong lambda truyền vào `orElseThrow`, bạn chỉ trả về instance ngoại lệ (`() -> new MyException()`), KHÔNG viết từ khoá `throw`.
</details>

---

### Câu 21 (Question 21)
**Kết quả đầu ra của đoạn mã sau là gì?**

```java
var spliterator = Stream.generate(() -> "x")
   .spliterator(); 
spliterator.tryAdvance(System.out::print);  
var split = spliterator.trySplit();
split.tryAdvance(System.out::print);
```

* A. `x`
* B. `xx`
* C. Một danh sách dài vô tận các chữ x.
* D. Không có kết quả đầu ra.
* E. Đoạn mã không biên dịch được.
* F. Đoạn mã biên dịch được nhưng không bao giờ dừng lại tại thời điểm chạy.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B (xx)**
* **Phân tích chi tiết:**
  * Dòng 1–2: `Stream.generate(() -> "x").spliterator()`.
    * Nguồn là một luồng vô hạn liên tục sinh ra `"x"`.
    * Phương thức `.spliterator()` là một thao tác kết thúc (terminal operation), trả về một đối tượng `Spliterator<String>`.
  * Dòng 3: `spliterator.tryAdvance(System.out::print);`.
    * Phương thức `tryAdvance()` chỉ xử lý **duy nhất 1 phần tử** tiếp theo.
    * Nó lấy ra một chữ `"x"` đầu tiên và in ra màn hình $\rightarrow$ Đã in: `x`.
  * Dòng 4: `var split = spliterator.trySplit();`.
    * Phương thức `trySplit()` cố gắng chia tách luồng dữ liệu thành một nhánh mới `split`.
    * Vì đây là luồng vô hạn, `Spliterator` nhận biết được và tách ra một tập hợp con gồm nhiều phần tử cho `split`.
  * Dòng 5: `split.tryAdvance(System.out::print);`.
    * Lại gọi `tryAdvance()` trên nhánh mới `split`, nó chỉ xử lý **đúng 1 phần tử** từ nhánh đó và in ra màn hình $\rightarrow$ In thêm: `x`.
  * Tổng cộng có đúng 2 ký tự `"x"` được in ra màn hình: `xx`.
  * Chương trình kết thúc bình thường mà không bị treo $\rightarrow$ Đáp án đúng là **B**.
* **Bẫy thi cần nhớ:** `tryAdvance()` chỉ xử lý duy nhất 1 phần tử đơn lẻ (an toàn trên luồng vô hạn). Tránh gọi `forEachRemaining()` trên luồng vô hạn vì sẽ gây treo máy!
</details>
