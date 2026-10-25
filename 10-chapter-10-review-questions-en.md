# Review Questions (Bộ Câu Hỏi Ôn Tập Tiếng Anh) - Chapter 10: Streams

> **Source (Nguồn trích dẫn):** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Pages 895–905).  
> **Quantity (Số lượng):** 21 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle (100% Verbatim English Questions) kèm giải thích gốc từ Sách & phân tích chuyên sâu Tiếng Việt (Pages 1385–1390).  
> **How to study (Cách học):** Bạn hãy tự đọc đề tiếng Anh và suy luận đáp án trước, sau đó bấm vào mục **"👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)"** để kiểm tra và khắc sâu các bẫy thi của Oracle.

---

### Question 1 (Câu 1)
**What could be the output of the following?**

```java
var stream = Stream.iterate("", (s) -> s + "1");
System.out.println(stream.limit(2).map(x -> x + "2"));
```

* A. `12112`
* B. `212`
* C. `212112`
* D. `java.util.stream.ReferencePipeline$3@4517d9a3`
* E. The code does not compile.
* F. An exception is thrown.
* G. The code hangs.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D (`java.util.stream.ReferencePipeline$3@4517d9a3`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** No terminal operation is called, so the stream never executes. The first line creates an infinite stream reference. If the stream were executed on the second line, it would get the first two elements from that infinite stream, `""` and `"1"`, and add an extra character, resulting in `"2"` and `"12"`, respectively. Since the stream is not executed, the reference is printed instead, giving us option D.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
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

### Question 2 (Câu 2)
**What could be the output of the following?**

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
* D. The code does not compile.
* E. An exception is thrown.
* F. The code hangs.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F (The code hangs)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Both streams created in this code snippet are infinite streams. The variable `b1` is set to `true` since `anyMatch()` terminates. Even though the stream is infinite, Java finds a match on the first element and stops looking. However, when `allMatch()` runs, it needs to keep going until the end of the stream since it keeps finding matches. Since all elements continue to match, the program hangs, making option F the answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Cả hai luồng `stream1` và `stream2` đều là **luồng vô hạn (infinite streams)** được tạo bởi `Stream.generate()`, liên tục sinh ra chuỗi `"growl!"`.
    * `predicate` kiểm tra chuỗi có bắt đầu bằng chữ `"g"` hay không: `"growl!".startsWith("g")` luôn luôn trả về `true`.
    * **Với `stream1.anyMatch(predicate)`:**
      * Phương thức `anyMatch()` mang tính chất **ngắt mạch (short-circuiting)**. Nó dừng lại ngay lập tức khi tìm thấy **phần tử đầu tiên** thoả mãn điều kiện.
      * Phần tử đầu tiên là `"growl!"` (bắt đầu bằng `"g"` → `true`), nên `anyMatch()` kết thúc ngay và gán `b1 = true`.
    * **Với `stream2.allMatch(predicate)`:**
      * Phương thức `allMatch()` chỉ có thể dừng sớm nếu gặp ít nhất **một phần tử vi phạm điều kiện (`false`)**.
      * Tuy nhiên, vì mọi phần tử trong `stream2` đều là `"growl!"` (luôn luôn là `true`), `allMatch()` không bao giờ tìm thấy phần tử `false` nào để dừng lại.
      * Do luồng là vô hạn, `allMatch()` tiếp tục duyệt mãi mãi để kiểm tra các phần tử tiếp theo → **Chương trình bị treo vô tận (hangs)** tại dòng gán `b2`!
    * Do đó, dòng in kết quả không bao giờ được chạm tới → Đáp án đúng là **F**.
    * **Bẫy thi cần nhớ:** Trên luồng vô hạn:
      * `anyMatch()` kết thúc nếu tìm thấy `true`.
      * `noneMatch()` kết thúc nếu tìm thấy `true` (khiến kết quả thành `false`).
      * `allMatch()` kết thúc nếu tìm thấy `false`. Nhưng nếu mọi phần tử đều là `true`, `allMatch()` sẽ duyệt vô tận và treo chương trình!
</details>

---

### Question 3 (Câu 3)
**What could be the output of the following?**

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
* D. The code does not compile.
* E. An exception is thrown.
* F. The code hangs.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E (An exception is thrown)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** An infinite stream is generated where each element is twice as long as the previous one. While this code uses the three-parameter `iterate()` method, the condition is never `false`. The variable `b1` is set to `false` because Java finds an element that matches when it gets to the element of length 4. However, the next line tries to operate on the same stream. Since streams can be used only once, this throws an exception that the “stream has already been operated upon or closed,” making option E the answer. If two different streams were used, the result would be option B.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Khởi tạo stream bằng `Stream.iterate("-", s -> !s.isEmpty(), s -> s + s)`:
      * `seed = "-"` (độ dài 1).
      * Mỗi bước tiếp theo nhân đôi chuỗi: `"--"`, `"----"`, `"--------"`...
      * Điều kiện `!s.isEmpty()` luôn luôn đúng → Đây là luồng vô hạn.
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

### Question 4 (Câu 4)
**Which are true statements about terminal operations in a stream that runs successfully? (Choose all that apply.)**

* A. At most one terminal operation can exist in a stream pipeline.
* B. Terminal operations are a required part of the stream pipeline in order to get a result.
* C. Terminal operations have `Stream` as the return type.
* D. The `peek()` method is an example of a terminal operation.
* E. The referenced `Stream` may be used after calling a terminal operation.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, B**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Terminal operations are the final step in a stream pipeline. Exactly one is required, because it triggers the execution of the entire stream pipeline. Therefore, options A and B are correct. Option C is true of intermediate operations rather than terminal operations. Option D is incorrect because `peek()` is an intermediate operation. Finally, option E is incorrect because once a stream pipeline is run, the `Stream` is marked invalid.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A đúng:** Một pipeline chỉ có thể kết thúc bằng duy nhất 1 thao tác kết thúc.
    * **B đúng:** Nếu không có thao tác kết thúc, cơ chế Lazy Evaluation sẽ không kích hoạt pipeline, và bạn không thể lấy được bất kỳ kết quả tính toán nào.
    * **C sai:** Thao tác trung gian (intermediate operation) mới có kiểu trả về là `Stream`. Thao tác kết thúc trả về một kiểu dữ liệu khác (`void`, `long`, `Optional`, `Collection`, `boolean`...).
    * **D sai:** `peek()` là một thao tác trung gian (intermediate operation), trả về `Stream<T>`.
    * **E sai:** Sau khi gọi thao tác kết thúc, Stream bị đóng vĩnh viễn và không thể tái sử dụng.
    * **Bẫy thi cần nhớ:** Phân biệt rõ ràng giữa Intermediate Operation (trả về Stream, lazy) và Terminal Operation (chấm dứt Stream, eager).
</details>

---

### Question 5 (Câu 5)
**Which of the following sets `result` to `8.0`? (Choose all that apply.)**

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
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Yes, we know this question is a lot of reading. Remember to look for the differences between options rather than studying each line. These options all have much in common. All of them start out with a `LongStream` and attempt to convert it to an `IntStream`. However, options B and E are incorrect because they do not cast the `long` to an `int`, resulting in a compiler error on the `mapToInt()` calls. Next, we hit the second difference. Options A and D are incorrect because they are missing `boxed()` before the `collect()` call. Since `groupingBy()` is creating a `Collection`, we need a nonprimitive `Stream`. The final difference is that option F specifies the type of `Collection`. This is allowed, though, meaning both options C and F are correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Đây là dạng câu hỏi dài kiểm tra khả năng phát hiện khác biệt cú pháp của kỳ thi OCP. Hãy so sánh các điểm khác biệt giữa các lựa chọn:
    * **Điểm khác biệt 1: Chuyển đổi từ `LongStream` sang `IntStream`:**
      * Luồng nguồn là `LongStream` (chứa các số kiểu `long`).
      * Phương thức `mapToInt()` nhận một `LongToIntFunction`. Vì chuyển đổi từ `long` sang `int` là phép thu hẹp kiểu (narrowing primitive conversion), Java **bắt buộc phải có ép kiểu tường minh `(int) x`**.
      * Lựa chọn **B** và **E** dùng `x -> x` (không ép kiểu) → **LỖI BIÊN DỊCH** tại `mapToInt()`.
    * **Điểm khác biệt 2: Gọi `collect()` trên Primitive Stream:**
      * Trên `IntStream`, phương thức `collect()` chỉ có dạng 3 tham số `collect(Supplier, ObjIntConsumer, BiConsumer)`. Nó **không có overload nhận 1 tham số `Collector`** như `Stream<T>` đối tượng!
      * Muốn dùng các bộ thu thập của lớp `Collectors` (như `Collectors.groupingBy`), bắt buộc phải chuyển từ `IntStream` sang `Stream<Integer>` bằng cách gọi **`.boxed()`**.
      * Lựa chọn **A** và **D** thiếu `.boxed()` → **LỖI BIÊN DỊCH** tại lệnh gọi `collect(Collectors.groupingBy(...))`.
    * **Điểm khác biệt 3 giữa C và F:**
      * C dùng `groupingBy(x -> x)` trả về `Map<Integer, List<Integer>>`.
      * F dùng `groupingBy(x -> x, Collectors.toSet())` trả về `Map<Integer, Set<Integer>>`. Cả hai đều hoàn toàn hợp lệ!
      * Sau đó, lấy `.keySet()` gồm các số `{6, 8, 10}`, tạo stream và tính trung bình cộng bằng `averagingInt(x -> x)`:
        $$\frac{6 + 8 + 10}{3} = \frac{24}{3} = 8.0$$
    * Do đó, cả **C và F** đều biên dịch thành công và cho ra kết quả `8.0`.
    * **Bẫy thi cần nhớ:** Primitive stream (`IntStream`, `LongStream`, `DoubleStream`) không thể dùng trực tiếp `Collectors.*` nếu chưa gọi `.boxed()` để chuyển thành Stream đối tượng wrapper. Chuyển từ `long` sang `int` phải có cast `(int)`.
</details>

---

### Question 6 (Câu 6)
**Which of the following methods can fill in the blank so that the code prints out `false`?**

```java
var s = Stream.generate(() -> "meow");
var match = s.__________(String::isEmpty);
System.out.println(match);
```

* A. Only `allMatch`
* B. Only `anyMatch`
* C. Only `noneMatch`
* D. Both `allMatch` and `anyMatch`
* E. Both `allMatch` and `noneMatch`
* F. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A (Only `allMatch`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `anyMatch()` and `noneMatch()` methods run infinitely. The stream has no way to know that a match won’t show up later. Option A is correct because only `allMatch()` makes it safe to return `false` as soon as one element passes through the stream that doesn’t match.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * `s` là một stream vô hạn liên tục sinh ra chuỗi `"meow"`.
    * Predicate kiểm tra: `String::isEmpty`. Đối với chuỗi `"meow"`, `isEmpty()` luôn trả về **`false`**.
    * **Xét `allMatch`:**
      * Định nghĩa: Trả về `true` nếu TẤT CẢ các phần tử đều thoả mãn điều kiện; trả về `false` ngay khi gặp phần tử ĐẦU TIÊN KHÔNG thoả mãn điều kiện.
      * Khi phần tử đầu tiên `"meow"` đi qua, nó không rỗng (`isEmpty()` = `false`). `allMatch()` ngắt mạch ngay lập tức và trả về **`false`**.
    * **Xét `anyMatch` và `noneMatch`:**
      * `anyMatch()`: Cần tìm ít nhất 1 phần tử thoả mãn `true` để dừng lại. Vì `"meow"` luôn cho ra `false`, `anyMatch()` không thể biết liệu trong tương lai có chuỗi rỗng nào xuất hiện hay không, nên nó sẽ **chạy vô tận và treo máy**.
      * `noneMatch()`: Cần tìm ít nhất 1 phần tử thoả mãn `true` để dừng lại và trả về `false`. Tương tự, nó cũng sẽ **chạy vô tận và treo máy**.
    * Vì vậy, phương thức duy nhất có thể dừng lại và in ra `false` là **`allMatch`** → Đáp án đúng là **A**.
    * **Bẫy thi cần nhớ:** `allMatch()` ngắt mạch và trả về `false` ngay khi gặp phần tử không khớp.
</details>

---

### Question 7 (Câu 7)
**We have a method that returns a sorted list without changing the original. We want to rewrite it. Which of the following pairs can fill in the blanks in `refactored()` to do the same with streams?**

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

* A. `compare` and `toList()`
* B. `compare` and `sort()`
* C. `compareTo` and `toList()`
* D. `compareTo` and `sort()`
* E. `sorted` and `collect()`
* F. `sorted` and `collect(Collectors.toList())`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F (`sorted` and `collect(Collectors.toList())`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** There is no `Stream<T>` method called `compare()` or `compareTo()`, so options A through D can be eliminated. The `sorted()` method is correct to use in a stream pipeline to return a sorted `Stream` and fills in the first blank. Either `toList()` or `collect(Collectors.toList())` can fill in the second blank. Only one answer correctly fills in both blanks, and therefore option F is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Trên giao diện `Stream<T>`, phương thức dùng để sắp xếp các phần tử là **`sorted(Comparator)`**. Không có phương thức nào trong `Stream` tên là `compare`, `compareTo` hay `sort` → Loại ngay các lựa chọn A, B, C, D.
    * Chỗ trống thứ nhất bắt buộc phải là `sorted`.
    * Chỗ trống thứ hai là thao tác kết thúc để thu thập luồng thành một `List<String>`.
      * Lựa chọn E điền `collect()` không tham số → Bị lỗi biên dịch vì phương thức `collect()` trong `Stream` bắt buộc phải có tham số (`collect(Collector)` hoặc 3 tham số).
      * Lựa chọn F điền `collect(Collectors.toList())` → Hoàn toàn chính xác, biên dịch và chạy đúng yêu cầu trả về `List<String>` đã sắp xếp giảm dần.
    * **Bẫy thi cần nhớ:** Stream sắp xếp bằng phương thức `sorted()`. Lớp `Collections` mới dùng `sort()`.
</details>

---

### Question 8 (Câu 8)
**Which of the following are true given this declaration? (Choose all that apply.)**

```java
var is = IntStream.empty();
```

* A. `is.average()` returns the type `int`.
* B. `is.average()` returns the type `OptionalInt`.
* C. `is.findAny()` returns the type `int`.
* D. `is.findAny()` returns the type `OptionalInt`.
* E. `is.sum()` returns the type `int`.
* F. `is.sum()` returns the type `OptionalInt`.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `average()` method returns an `OptionalDouble` since averages of any type can result in a fraction. Therefore, options A and B are both incorrect. The `findAny()` method returns an `OptionalInt` because there might not be any elements to find. Therefore, option D is correct. The `sum()` method returns an `int` rather than an `OptionalInt` because the sum of an empty stream is zero. Therefore, option E is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Phương thức `average()`:** Trung bình cộng của các số nguyên hoàn toàn có thể là một số thập phân lẻ (ví dụ trung bình của 1 và 2 là 1.5). Do đó, trên `IntStream`, phương thức `average()` trả về kiểu **`OptionalDouble`** (chứ không phải `int` hay `OptionalInt`) → A và B sai.
    * **Phương thức `findAny()`:** Vì stream có thể rỗng, phương thức tìm kiếm phần tử của `IntStream` phải trả về một đối tượng bao bọc kiểu nguyên thuỷ là **`OptionalInt`** → **D đúng**, C sai.
    * **Phương thức `sum()`:** Tổng của một danh sách số nguyên chắc chắn là một số nguyên. Khi stream rỗng, tổng quy ước chuẩn trong toán học và Java là `0`. Do đó, Java thiết kế `sum()` trả về trực tiếp giá trị primitive **`int`** (chứ không trả về Optional) → **E đúng**, F sai.
    * **Bẫy thi cần nhớ:** 
      * `sum()` trên `IntStream` trả về `int` (rỗng trả về `0`).
      * `min()` và `max()` trả về `OptionalInt`.
      * `average()` LUÔN trả về `OptionalDouble` (kể cả trên `IntStream` và `LongStream`).
</details>

---

### Question 9 (Câu 9)
**Which of the following can we add after line 6 for the code to run without error and not produce any output? (Choose all that apply.)**

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
* E. None of these; the code does not compile.
* F. None of these; line 6 throws an exception at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Lines 4–6 compile and run without issue, making options E and F incorrect. Line 4 creates a stream of elements `[1, 2, 3]`. Line 5 maps the stream to a new stream with values `[10, 20, 30]`. Line 6 filters out all items not less than `5`, which in this case results in an empty stream. For this reason, `findFirst()` returns an empty `Optional`. Option A does not compile. It would work for a `Stream<T>` object, but we have a `LongStream` and therefore need to call `getAsLong()`. Option C also does not compile, as it is missing the `::` that would make it a method reference. Options B and D both compile and run without error, although neither produces any output at runtime since the stream is empty.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 4–6: Khởi tạo `LongStream` với các giá trị `[1, 2, 3]`. Sau `map` nhân 10, luồng thành `[10, 20, 30]`. Sau `filter(n -> n < 5)`, không có phần tử nào thoả mãn → Luồng trở thành rỗng.
    * Lệnh `findFirst()` trên `LongStream` rỗng trả về một **`OptionalLong` rỗng** (`OptionalLong.empty()`).
    * Đoạn mã từ dòng 4–6 hoàn toàn biên dịch và chạy thành công mà không ném ngoại lệ → Loại E và F.
    * **Xét A:** `opt` là kiểu `OptionalLong`. Lớp `OptionalLong` **KHÔNG CÓ phương thức `get()`** (chỉ có `getAsLong()`) → Bị lỗi biên dịch!
    * **Xét B:** Sử dụng `opt.getAsLong()` là cú pháp chuẩn của `OptionalLong`. Vì `opt.isPresent()` là `false`, khối lệnh `if` không được thực thi → Không in ra gì, thoả mãn đề bài → **B đúng**.
    * **Xét C:** Cú pháp `System.out.println` thiếu dấu hai chấm kép `::` → Lỗi biên dịch.
    * **Xét D:** `opt.ifPresent(System.out::println)` sử dụng method reference chuẩn. Vì `opt` rỗng, Consumer không được gọi → Không in ra gì, thoả mãn đề bài → **D đúng**.
    * **Bẫy thi cần nhớ:** `OptionalLong` có phương thức `getAsLong()`, không có `get()`. Method reference phải dùng cú pháp `ClassOrObject::methodName`.
</details>

---

### Question 10 (Câu 10)
**Given the four statements (L, M, N, O), select the order that would cause the code to output 10 lines.**

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
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F (N, M)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Only one of the method calls, `forEach()`, is a terminal operation, so any answer in which M is not the last line will not execute the pipeline. This eliminates all but options C, E, and F. Option C is incorrect because `filter()` is called before `limit()`. Since none of the elements of the stream meets the requirement for the `Predicate<String>`, the `filter()` operation will run infinitely, never passing any elements to `limit()`. Option E is incorrect because there is no `limit()` operation, which means that the code would run infinitely. Option F is correct. It first limits the infinite stream to a finite stream of 10 elements and then prints the result.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Nguồn là một luồng vô hạn liên tục sinh ra chuỗi `"1"` (có độ dài bằng 1).
    * Trong bốn câu lệnh, **chỉ duy nhất câu lệnh M (`.forEach(...)`) là thao tác kết thúc (terminal operation)**. Bất kỳ phương án nào không kết thúc bằng M sẽ không kích hoạt pipeline và không in ra gì → Loại ngay A, B, D, G.
    * **Xét C (L, N, M):**
      * Lệnh L (`filter(x -> x.length() > 1)`) đứng trước N (`limit(10)`).
      * Chuỗi `"1"` có độ dài là 1, nên điều kiện `length() > 1` luôn luôn là `false`.
      * Filter không cho bất kỳ phần tử nào đi qua, do đó lệnh `limit(10)` không bao giờ đếm đủ 10 phần tử → Pipeline bị treo và chạy vô hạn! (Loại C).
    * **Xét E (L, O, M):** Không có thao tác giới hạn `limit()`, chương trình sẽ chạy vô hạn.
    * **Xét F (N, M):**
      * Nguồn vô hạn được ngắt ngay bằng N: `.limit(10)`, thu được một luồng hữu hạn chứa đúng 10 chuỗi `"1"`.
      * Sau đó M: `.forEach(System.out::println)` duyệt qua và in ra đúng 10 dòng chữ `"1"` → Hoàn toàn thoả mãn!
    * **Bẫy thi cần nhớ:** Trên luồng vô hạn, phải đặt `limit()` ở vị trí hợp lý để biến luồng vô hạn thành hữu hạn; nếu đặt sau một `filter` luôn trả về `false`, chương trình sẽ bị treo vĩnh viễn.
</details>

---

### Question 11 (Câu 11)
**What changes need to be made together for this code to print the string `12345`? (Choose all that apply.)**

```java
Stream.iterate(1, x -> x++)
   .limit(5).map(x -> x)
   .collect(Collectors.joining());
```

* A. Changing `Collectors.joining()` to `Collectors.joining(",")`
* B. Changing `map(x -> x)` to `map(x -> "" + x)`
* C. Changing `x -> x++` to `x -> ++x`
* D. Adding `.forEach(System.out::print)` after the call to `collect()`
* E. Wrapping the entire line in a `System.out.print` statement
* F. None of the above; the code already prints `12345`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, C, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** As written, the code doesn’t compile because the `Collectors.joining()` expects to get a `Stream<String>`. Option B fixes this, at which point nothing is output because the collector creates a `String` without outputting the result. Option E fixes this and causes the output to be `11111`. Since the post-increment operator is used, the stream contains an infinite number of the character `1`. Option C fixes this and causes the stream to contain increasing numbers.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Hãy phân tích từng vấn đề của đoạn mã ban đầu:
    1. **Lỗi toán tử tăng sau `x++`:**
       * Lambda `x -> x++` sử dụng post-increment: giá trị của biểu thức trả về là giá trị cũ của `x` trước khi tăng. Do đó, hàm này luôn trả về giá trị `1`.
       * Luồng sinh ra sẽ là chuỗi toàn số `1`: `[1, 1, 1, 1, 1]`.
       * Cần đổi thành pre-increment **`x -> ++x`** để sinh ra dãy số tăng dần `1, 2, 3, 4, 5` → **Chọn C**.
    2. **Lỗi kiểu dữ liệu trong `Collectors.joining()`:**
       * Phương thức `Collectors.joining()` **bắt buộc luồng đầu vào phải là `Stream<CharSequence>` (hoặc `Stream<String>`)**.
       * Ở đây, `Stream.iterate(1, ...)` tạo ra một `Stream<Integer>`. Dòng `map(x -> x)` giữ nguyên kiểu `Integer`, khiến dòng `collect(Collectors.joining())` bị **LỖI BIÊN DỊCH**!
       * Cần sửa đổi `map(x -> x)` thành **`map(x -> "" + x)`** để chuyển đổi từng `Integer` thành `String` → **Chọn B**.
    3. **Lỗi thiếu lệnh in ra màn hình:**
       * Lệnh `collect(Collectors.joining())` là một thao tác kết thúc trả về một đối tượng `String`, nhưng giá trị này không được gán cho biến nào và không được in ra.
       * Cần bao bọc toàn bộ biểu thức trong **`System.out.print(...)`** để in chuỗi thu được ra màn hình → **Chọn E**.
    * **Bẫy thi cần nhớ:** `Collectors.joining()` chỉ hoạt động trên `Stream<String>`. Toán tử `x++` trong lambda trả về giá trị trước khi tăng.
</details>

---

### Question 12 (Câu 12)
**Which is true of the following code?**

```java
Set<String> birds = Set.of("oriole", "flamingo");
Stream.concat(birds.stream(), birds.stream(), birds.stream())
   .sorted()       // line X
   .distinct()
   .findAny()
   .ifPresent(System.out::println);
```

* A. It is guaranteed to print `flamingo` as is and when line X is removed.
* B. It is guaranteed to print `oriole` as is and when line X is removed.
* C. It is guaranteed to print `flamingo` as is, but not when line X is removed.
* D. It is guaranteed to print `oriole` as is, but not when line X is removed.
* E. The output may vary as is.
* F. The code does not compile.
* G. It throws an exception because the same list is used as the source for multiple streams.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F (The code does not compile)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code does not compile because `Stream.concat()` takes two parameters, not the three provided. This makes the answer option F.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
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

### Question 13 (Câu 13)
**Which of the following is true?**

```java
List<Integer> x1 = List.of(1, 2, 3);
List<Integer> x2 = List.of(4, 5, 6);
List<Integer> x3 = List.of();
Stream.of(x1, x2, x3).map(x -> x + 1)
   .flatMap(x -> x.stream())
   .forEach(System.out::print);
```

* A. The code compiles and prints `123456`.
* B. The code compiles and prints `234567`.
* C. The code compiles but does not print anything.
* D. The code compiles but prints stream references.
* E. The code runs infinitely.
* F. The code does not compile.
* G. The code throws an exception.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F (The code does not compile)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** If the `map()` and `flatMap()` calls were reversed, option B would be correct. In this case, the `Stream` created from the source is of type `Stream<List>`. Trying to use the addition operator (`+`) on a `List` is not supported in Java. Therefore, the code does not compile, and option F is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Nguồn stream: `Stream.of(x1, x2, x3)` tạo ra một luồng có kiểu là **`Stream<List<Integer>>`** (các phần tử trong luồng là các đối tượng `List`, chứ không phải số nguyên!).
    * Bước tiếp theo gọi: `.map(x -> x + 1)`.
      * Biến `x` ở đây đại diện cho từng phần tử trong luồng, tức là `x` có kiểu **`List<Integer>`**.
      * Trong ngôn ngữ Java, toán tử cộng số học `+` **hoàn toàn không được định nghĩa cho đối tượng `List`** (`List + int` là cú pháp không hợp lệ)!
    * Vì vậy, dòng `.map(x -> x + 1)` bị **LỖI BIÊN DỊCH** → Đáp án đúng là **F**.
    * *(Lưu ý: Nếu đảo ngược thứ tự gọi `flatMap(x -> x.stream())` trước rồi mới `map(x -> x + 1)`, thì đoạn mã mới hợp lệ và in ra `234567`).*
    * **Bẫy thi cần nhớ:** Luôn luôn theo dõi chặt chẽ kiểu dữ liệu của biến `x` tại từng bước trong pipeline. `Stream.of(list1, list2)` là Stream chứa các List.
</details>

---

### Question 14 (Câu 14)
**Which of the following are true? (Choose all that apply.)**

```java
4: Stream<Integer> s = Stream.of(1);
5: IntStream is = s.boxed();
6: DoubleStream ds = s.mapToDouble(x -> x);
7: Stream<Integer> s2 = ds.mapToInt(x -> x);
8: s2.forEach(System.out::print);
```

* A. Line 4 causes a compiler error.
* B. Line 5 causes a compiler error.
* C. Line 6 causes a compiler error.
* D. Line 7 causes a compiler error.
* E. Line 8 causes a compiler error.
* F. The code compiles but throws an exception at runtime.
* G. The code compiles and prints `1`.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Line 4 creates a `Stream` and uses autoboxing to put the `Integer` wrapper of `1` inside. Line 5 does not compile because `boxed()` is available only on primitive streams like `IntStream`, not `Stream<Integer>`. This makes option B one answer. Line 6 converts to a `double` primitive, which works since `Integer` can be unboxed to a value that can be implicitly cast to a `double`. Line 7 does not compile for two reasons, making option D the second answer. First, converting from a `double` to an `int` would require an explicit cast. Also, `mapToInt()` returns an `IntStream`, so the data type of `s2` is incorrect. The rest of the lines compile without issue.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 4: `Stream.of(1)` autobox số `1` thành `Integer`, tạo ra `Stream<Integer>` hợp lệ.
    * **Dòng 5:** Biến `s` có kiểu `Stream<Integer>`. Phương thức `.boxed()` **chỉ tồn tại trên các Primitive Streams** (`IntStream`, `LongStream`, `DoubleStream`) để chuyển thành Stream đối tượng. Nó **không hề tồn tại** trên `Stream<T>` đối tượng → **Dòng 5 bị LỖI BIÊN DỊCH** (chọn **B**).
    * Dòng 6: `mapToDouble(x -> x)` trên `Stream<Integer>` unbox `Integer` thành `int` và tự động mở rộng (widening) thành `double`, trả về `DoubleStream` hợp lệ.
    * **Dòng 7:** Gặp 2 lỗi biên dịch cùng lúc:
      1. `ds` là `DoubleStream`. Biểu thức `x -> x` trả về `double`, không thể ngầm định gán cho `int` trong `mapToInt` mà thiếu ép kiểu tường minh `(int) x`.
      2. Phương thức `mapToInt()` trên `DoubleStream` trả về một **`IntStream`**, chứ không phải `Stream<Integer>`! Không thể gán `IntStream` cho biến `s2` có kiểu `Stream<Integer>`.
      → **Dòng 7 bị LỖI BIÊN DỊCH** (chọn **D**).
    * **Bẫy thi cần nhớ:** `.boxed()` dùng để đổi từ Primitive sang Object Stream. `mapToInt()` luôn trả về `IntStream`, muốn thành `Stream<Integer>` phải gọi `.boxed()`.
</details>

---

### Question 15 (Câu 15)
**Given the generic type `String`, the `partitioningBy()` collector creates a `Map<Boolean, List<String>>` when passed to `collect()` by default. When a downstream collector is passed to `partitioningBy()`, which return types can be created? (Choose all that apply.)**

* A. `Map<boolean, List<String>>`
* B. `Map<Boolean, List<String>>`
* C. `Map<Boolean, Map<String>>`
* D. `Map<Boolean, Set<String>>`
* E. `Map<Long, TreeSet<String>>`
* F. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Options A and C do not compile because they are invalid generic declarations. Primitives are not allowed as generics, and `Map` must have two generic type parameters. Option E is incorrect because partitioning only gives a `Boolean` key. Options B and D are correct because they return a `Map` with a `Boolean` key and a value type that can be customized to any `Collection`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Phương thức `partitioningBy` chia dữ liệu thành 2 nhánh dựa trên boolean:
      * **Khoá (Key) của Map luôn luôn bắt buộc phải là `Boolean` wrapper**.
      * Lựa chọn A dùng primitive `boolean` làm generic type → Lỗi biên dịch (Generics không hỗ trợ kiểu nguyên thuỷ).
      * Lựa chọn E có key là kiểu `Long` → Sai (chỉ có `groupingBy` mới cho phép key kiểu khác `Boolean`).
    * Giao diện `Map` bắt buộc phải có 2 tham số kiểu `<K, V>`. Lựa chọn C khai báo `Map<String>` chỉ có 1 tham số kiểu → Lỗi cú pháp biên dịch.
    * **Giá trị (Value) của Map:** Có thể được tuỳ biến bằng downstream collector:
      * Mặc định là `List<String>` → Khớp lựa chọn **B** (ví dụ downstream là `Collectors.toList()`).
      * Có thể chuyển thành `Set<String>` → Khớp lựa chọn **D** (ví dụ downstream là `Collectors.toSet()`).
    * **Bẫy thi cần nhớ:** `partitioningBy` LUÔN LUÔN trả về `Map<Boolean, ...>`.
</details>

---

### Question 16 (Câu 16)
**Which of the following statements are true about this code? (Choose all that apply.)**

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

* A. It outputs `{}`.
* B. It outputs `{false=[], true=[]}`.
* C. If we changed line 31 from `partitioningBy(notEmpty)` to `groupingBy(n -> n)`, it would output `{}`.
* D. If we changed line 31 from `partitioningBy(notEmpty)` to `groupingBy(n -> n)`, it would output `{false=[], true=[]}`.
* E. The code does not compile.
* F. The code compiles but does not terminate at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** First, this mess of code does compile. While it starts with an infinite stream on line 23, it becomes finite on line 24 thanks to `limit()`, making option F incorrect. The pipeline preserves only nonempty elements on line 25. Since there aren’t any of those, the pipeline is empty. Line 26 converts this to an empty map. Lines 27 and 28 create a `Set` with no elements and then another empty stream. Lines 29 and 30 convert the generic type of the `Stream` to `List<String>` and then `String`. Finally, line 31 gives us another `Map<Boolean, List<String>>`. The `partitioningBy()` operation always returns a map with two `Boolean` keys, even if there are no corresponding values. Therefore, option B is correct if the code is kept as is. By contrast, `groupingBy()` returns only keys that are actually needed, making option C correct if the code is modified on line 31.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 23–24: `Stream.generate(() -> "").limit(10)` tạo ra một stream gồm 10 chuỗi rỗng `""`.
    * Dòng 25: `.filter(notEmpty)` lọc các chuỗi không rỗng. Vì tất cả 10 chuỗi đều rỗng, không có phần tử nào lọt qua → Luồng trở thành luồng rỗng (`empty stream`).
    * Dòng 26: Thu thập bằng `groupingBy` trên luồng rỗng sinh ra một `Map` rỗng `{}`.
    * Dòng 27–30: Lấy `entrySet().stream()` trên Map rỗng, chuyển đổi và `flatMap` lại tiếp tục cho ra một Stream rỗng.
    * **Tại dòng 31 (`partitioningBy(notEmpty)`):**
      * **Đặc tính độc nhất của `partitioningBy`:** Dù luồng đầu vào có rỗng hoàn toàn, `partitioningBy` **luôn luôn trả về một Map có đủ hai khoá `false` và `true`**, với giá trị liên kết tương ứng là hai danh sách rỗng `[]`!
      * Do đó, `result` có giá trị là **`{false=[], true=[]}`** → **B đúng**.
    * **Xét kịch bản thay bằng `groupingBy(n -> n)` (Lựa chọn C & D):**
      * Không giống như `partitioningBy`, bộ thu thập `groupingBy()` **chỉ tạo ra các khoá thực sự có phần tử xuất hiện trong luồng**.
      * Khi luồng đầu vào rỗng, `groupingBy` không tạo ra bất kỳ khoá nào và trả về Map rỗng **`{}`** → **C đúng**.
    * **Bẫy thi cần nhớ:** `partitioningBy` trên stream rỗng trả về `{false=[], true=[]}`. `groupingBy` trên stream rỗng trả về `{}`.
</details>

---

### Question 17 (Câu 17)
**What is the result of the following?**

```java
var s = DoubleStream.of(1.2, 2.4);
s.peek(System.out::println).filter(x -> x > 2).count();
```

* A. `1`
* B. `2`
* C. `2.4`
* D. `1.2` and `2.4`
* E. There is no output.
* F. The code does not compile.
* G. An exception is thrown.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D (`1.2` and `2.4`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The terminal operation is `count()`. Since there is a terminal operation, the intermediate operations run. The `peek()` operation comes before the `filter()`, so both numbers are printed, making option D the answer. After the `filter()`, the `count()` happens to be `1` since one of the numbers is filtered out. However, the result of the stream pipeline isn’t stored in a variable or printed, and it is ignored.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Pipeline gồm: Nguồn `DoubleStream.of(1.2, 2.4)` → Thao tác trung gian `peek(...)` → Thao tác trung gian `filter(...)` → Thao tác kết thúc `count()`.
    * Vì có thao tác kết thúc `count()`, toàn bộ pipeline được kích hoạt chạy.
    * Dữ liệu từ nguồn được truyền tuần tự:
      * Số `1.2` đi vào pipeline, đi qua `peek(System.out::println)` trước tiên → **In ra: `1.2`**.
      * Sau đó `1.2` đi vào `filter(x -> x > 2)`: Vì $1.2 \le 2$, phần tử này bị loại bỏ.
      * Tiếp theo, số `2.4` đi vào pipeline, đi qua `peek` → **In ra: `2.4`**.
      * Sau đó `2.4` đi vào `filter`: $2.4 > 2$ thoả mãn điều kiện, đi tiếp vào `count()`.
    * Thao tác `count()` đếm được 1 phần tử và trả về giá trị `1L`. Tuy nhiên, kết quả trả về của `count()` không được gán cho biến nào và không được in ra màn hình.
    * Do đó, thứ duy nhất được xuất ra màn hình console là kết quả từ lệnh `peek`: `1.2` và `2.4` → Đáp án **D**.
    * **Bẫy thi cần nhớ:** `peek()` nằm trước `filter()`, nên mọi phần tử của stream ban đầu đều đi qua `peek()` và được in ra trước khi bị `filter()` loại bỏ.
</details>

---

### Question 18 (Câu 18)
**What is the output of the following?**

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
* E. The code does not compile due to `Stream.concat()`.
* F. The code does not compile due to `Collectors.teeing()`.
* G. The code does not compile for another reason.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D (`Page[list=[Elmo], count=2]`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** This compiles, ruling out options E, F, and G. Since line 29 filters by names starting with `E`, that rules out options A and B. Finally, line 31 counts the entire list, which is of size 2, giving us option D as the answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 20–21: Tạo 2 stream: `monsters` chứa `Elmo`, `people` chứa `Abby`.
    * Dòng 27: `Stream.concat(monsters, people)` nối 2 stream lại thành một stream duy nhất gồm 2 phần tử: `[Elmo, Abby]`.
    * Dòng 28–32 sử dụng bộ thu thập **`Collectors.teeing()`** (tính năng từ Java 12):
      * **Collector nhánh 1:** `Collectors.filtering(s -> s.name().startsWith("E"), Collectors.toList())`  
        Chỉ giữ lại các nhân vật có tên bắt đầu bằng `"E"`. Trong 2 nhân vật `[Elmo, Abby]`, chỉ có `Elmo` thoả mãn → Thu được danh sách: `[Elmo]`.
      * **Collector nhánh 2:** `Collectors.counting()`  
        Đếm tổng số phần tử đi qua stream. Cả 2 phần tử `Elmo` và `Abby` đều được đếm → Giá trị đếm là `2L`.
      * **Hàm gộp Merger Function:** `(l, c) -> new Page(l, c)`  
        Gộp kết quả từ 2 nhánh: `l = [Elmo]` và `c = 2` thành đối tượng `Page(list=[Elmo], count=2)`.
    * Dòng 33 in ra đối tượng record `page`, hiển thị: `Page[list=[Elmo], count=2]` → Đáp án đúng là **D**.
    * **Bẫy thi cần nhớ:** `Collectors.teeing(c1, c2, merger)` duyệt luồng 1 lần duy nhất nhưng cho phép tính toán song song hai chỉ số độc lập và gộp kết quả lại với nhau.
</details>

---

### Question 19 (Câu 19)
**What is the simplest way of rewriting this code?**

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
* D. None of the above is equivalent.
* E. The provided code does not compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Both lists and streams have `forEach()` methods. There is no reason to collect into a list just to loop through it. Option A is incorrect because it does not contain a terminal operation or print anything. Options B and C both work. However, the question asks about the simplest way, which is option B.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Mục đích duy nhất của đoạn mã gốc là in các số từ 1 đến 5 ra màn hình.
    * Đoạn mã gốc bị dư thừa thao tác: Nó chuyển số nguyên thành đối tượng wrapper (`mapToObj`), sau đó gom vào một `List` trung gian bằng `collect()`, rồi mới duyệt `List` để in.
    * Bản thân giao diện `IntStream` **đã có sẵn phương thức kết thúc `.forEach(IntConsumer)`**!
    * Do đó, ta có thể gọi trực tiếp:
      ```java
      IntStream.range(1, 6).forEach(System.out::println);
      ```
      Phương thức này ngắn gọn nhất, hiệu năng cao nhất (không tốn bộ nhớ cấp phát cho List và Integer boxing).
    * Lựa chọn C tuy chạy được nhưng vẫn bị dư thừa thao tác `.mapToObj()`. Đề bài yêu cầu *"simplest way"* → Lựa chọn **B** là tối ưu nhất.
    * **Bẫy thi cần nhớ:** Tránh việc thu thập dữ liệu vào `Collection` chỉ để duyệt in bằng `forEach`. Hãy gọi `forEach` trực tiếp trên `Stream`.
</details>

---

### Question 20 (Câu 20)
**Which of the following throw an exception when an `Optional` is empty? (Choose all that apply.)**

* A. `opt.orElse("");`
* B. `opt.orElseGet(() -> "");`
* C. `opt.orElseThrow();`
* D. `opt.orElseThrow(() -> throw new Exception());`
* E. `opt.orElseThrow(RuntimeException::new);`
* F. `opt.get();`
* G. `opt.get("");`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C, E, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Options A and B compile and return an empty string without throwing an exception, using a `String` and `Supplier` parameter, respectively. Option G does not compile as the `get()` method does not take a parameter. Options C and F throw a `NoSuchElementException`. Option E throws a `RuntimeException`. Option D looks correct but will compile only if the `throw` is removed. Remember, the `orElseThrow()` should get a lambda expression or method reference that returns an exception, not one that throws an exception.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A & B:** Khi `opt` rỗng, `orElse("")` và `orElseGet(() -> "")` sẽ trả về chuỗi rỗng `""` một cách an toàn mà không ném ra bất kỳ ngoại lệ nào.
    * **C đúng:** `orElseThrow()` không tham số sẽ ném **`NoSuchElementException`** khi Optional rỗng.
    * **D sai cú pháp biên dịch:** `orElseThrow(Supplier)` nhận một Supplier **trả về đối tượng ngoại lệ** (`() -> new Exception()`). Cú pháp `() -> throw new Exception()` chứa từ khoá `throw` bên trong thân biểu thức lambda là sai cú pháp trong ngữ cảnh Supplier → Lỗi biên dịch!
    * **E đúng:** `orElseThrow(RuntimeException::new)` sử dụng constructor reference hợp lệ của Supplier, khi Optional rỗng sẽ ném ra `RuntimeException`.
    * **F đúng:** `opt.get()` khi Optional rỗng sẽ ném ra **`NoSuchElementException`**.
    * **G sai cú pháp:** Phương thức `get()` của `Optional` không nhận bất kỳ tham số nào → Lỗi biên dịch.
    * **Bẫy thi cần nhớ:** `get()` và `orElseThrow()` ném `NoSuchElementException`. Trong lambda truyền vào `orElseThrow`, bạn chỉ trả về instance ngoại lệ (`() -> new MyException()`), KHÔNG viết từ khoá `throw`.
</details>

---

### Question 21 (Câu 21)
**What is the output of the following?**

```java
var spliterator = Stream.generate(() -> "x")
   .spliterator(); 
spliterator.tryAdvance(System.out::print);  
var split = spliterator.trySplit();
split.tryAdvance(System.out::print);
```

* A. `x`
* B. `xx`
* C. A long list of `x`’s.
* D. There is no output.
* E. The code does not compile.
* F. The code compiles but does not terminate at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B (`xx`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** We start with an infinite stream where each element is `x`. The `spliterator()` method is a terminal operation since it returns a `Spliterator` rather than a `Stream`. The `tryAdvance()` method gets the first element and prints a single `x`. The `trySplit()` method takes a large number of elements from the stream. Since this is an infinite stream, it doesn’t attempt to take half. Then `tryAdvance()` is called on the new `split` variable, and another `x` is printed. Since there are two values printed, option B is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 1–2: `Stream.generate(() -> "x").spliterator()`.
      * Nguồn là một luồng vô hạn liên tục sinh ra `"x"`.
      * Phương thức `.spliterator()` là một thao tác kết thúc (terminal operation), trả về một đối tượng `Spliterator<String>`.
    * Dòng 3: `spliterator.tryAdvance(System.out::print);`.
      * Phương thức `tryAdvance()` chỉ xử lý **duy nhất 1 phần tử** tiếp theo.
      * Nó lấy ra một chữ `"x"` đầu tiên và in ra màn hình → Đã in: `x`.
    * Dòng 4: `var split = spliterator.trySplit();`.
      * Phương thức `trySplit()` cố gắng chia tách luồng dữ liệu thành một nhánh mới `split`.
      * Vì đây là luồng vô hạn, `Spliterator` nhận biết được và tách ra một tập hợp con gồm nhiều phần tử cho `split`.
    * Dòng 5: `split.tryAdvance(System.out::print);`.
      * Lại gọi `tryAdvance()` trên nhánh mới `split`, nó chỉ xử lý **đúng 1 phần tử** từ nhánh đó và in ra màn hình → In thêm: `x`.
    * Tổng cộng có đúng 2 ký tự `"x"` được in ra màn hình: `xx`.
    * Chương trình kết thúc bình thường mà không bị treo → Đáp án đúng là **B**.
    * **Bẫy thi cần nhớ:** `tryAdvance()` chỉ xử lý duy nhất 1 phần tử đơn lẻ (an toàn trên luồng vô hạn). Tránh gọi `forEachRemaining()` trên luồng vô hạn vì sẽ gây treo máy!
</details>
