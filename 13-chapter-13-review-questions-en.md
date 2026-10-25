# Review Questions (Bộ Câu Hỏi Ôn Tập Tiếng Anh) - Chapter 13: Concurrency

> **Source (Nguồn trích dẫn):** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Pages 1182–1196).  
> **Total Questions (Số lượng):** 25 multiple-choice questions matching the official Oracle exam format, with detailed explanations from Appendix B (Pages 1403–1410).  
> **How to study (Cách học):** Read the verbatim English question and reason through the options first, then click **"👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)"** to check the official answer and deep-dive explanations in both English and Vietnamese.

---

### Question 1 (Câu 1)
**Given the following code snippet, which options correctly create a parallel stream? (Choose all that apply.)**

```java
var c = List.of(19, 66);
var s = ThreadLocalRandom.current().doubles();
var p = ________________;
```

* A. `new ParallelStream(s)`
* B. `c.parallel()`
* C. `s.parallelStream()`
* D. `c.parallelStream()`
* E. `new ParallelStream(c)`
* F. `s.parallel()`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** There is no such class within the Java API called `ParallelStream`, so options A and E are incorrect. The method defined in the `Stream` class to create a parallel stream from an existing stream is `parallel()`; therefore, option F is correct, and option C is incorrect. The method defined in the `Collection` class to create a parallel stream from a collection is `parallelStream()`; therefore, option D is correct, and option B is incorrect.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Trong Java API, **không hề tồn tại** lớp nào tên là `ParallelStream` → Loại A và E.
    * Đối với một đối tượng thuộc họ `Collection` (như `List`, `Set`), phương thức để tạo parallel stream là **`collection.parallelStream()`** → **D đúng**. (Phương thức `.parallel()` không nằm trên interface `Collection` → B sai).
    * Đối với một đối tượng đã là `Stream` hoặc primitive stream (như `DoubleStream` trả về từ `doubles()`), phương thức chuyển đổi sang stream song song là **`stream.parallel()`** → **F đúng**. (Phương thức `parallelStream()` không tồn tại trên interface `Stream` → C sai).
</details>

---

### Question 2 (Câu 2)
**Given that the sum of the numbers from 1 (inclusive) to 10 (exclusive) is 45, what are the possible results of executing the following program? (Choose all that apply.)**

```java
1:  import java.util.concurrent.locks.*;
2:  import java.util.stream.*;
3:  public class Bank {
4:     private Lock vault = new ReentrantLock();
5:     private int total = 0;
6:     public void deposit(int value) {
7:        try {
8:           vault.tryLock();
9:           total += value;
10:       } finally { vault.unlock(); }
11:    }
12:    public static void main(String[] unused) {
13:       var bank = new Bank();
14:       IntStream.range(1, 10).parallel()
15:          .forEach(s -> bank.deposit(s));
16:       System.out.println(bank.total);
17:    } }
```

* A. `45` is printed.
* B. A number less than `45` is printed.
* C. A number greater than `45` is printed.
* D. An exception is thrown.
* E. None of the above, as the code does not compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `tryLock()` method returns immediately with a value of `false` if the lock cannot be acquired. Unlike `lock()`, it does not wait for a lock to become available. This code fails to check the return value on line 8, resulting in the protected code being entered regardless of whether the lock is obtained. In some executions (when `tryLock()` returns `true` on every call), the code will complete successfully and print `45` at runtime, making option A correct. On other executions (when `tryLock()` returns `false` at least once), the `unlock()` method on line 10 will throw an `IllegalMonitorStateException` at runtime, making option D correct. Option B would be possible if line 10 did not throw an exception.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Bẫy thi `tryLock()` kinh điển!**
    * Phương thức `vault.tryLock()` là phương thức không chặn (non-blocking): Nó thử lấy khóa, nếu khóa đã bị luồng khác giữ, nó lập tức trả về `false` mà **không chờ đợi**.
    * Ở dòng 8, mã nguồn **không kiểm tra giá trị boolean trả về** từ `tryLock()`. Do đó, ngay cả khi không lấy được khóa, luồng vẫn lao vào thực thi dòng 9 và sau đó nhảy vào khối `finally` ở dòng 10.
    * Khi luồng không nắm giữ khóa mà lại gọi `vault.unlock()`, máy ảo JVM sẽ ném ngay lập tức ngoại lệ **`IllegalMonitorStateException`** lúc runtime → **D đúng**.
    * Trong một số lần chạy hiếm hoi (khi các luồng không hề xung đột thời gian và mỗi lần gọi `tryLock()` đều may mắn trả về `true`), toàn bộ 9 số sẽ được cộng thành công và in ra **45** → **A đúng**.
    * Lựa chọn B không thể xảy ra vì nếu có luồng thất bại khi lấy khóa thì ngoại lệ ở dòng 10 đã làm gián đoạn chương trình trước khi kịp in ra tổng cuối cùng.
</details>

---

### Question 3 (Câu 3)
**Which of the following statements about the `Callable` `call()` and `Runnable` `run()` methods are correct? (Choose all that apply.)**

* A. Both methods return `void`.
* B. Both can throw unchecked exceptions.
* C. Both can be implemented with lambda expressions.
* D. `Runnable` returns a generic type.
* E. Both can throw checked exceptions.
* F. `Callable` returns a generic type.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, C, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** `Runnable` returns `void` and `Callable` returns a generic type, making options A and D incorrect and option F correct. All methods are capable of throwing unchecked exceptions, so option B is correct. Only `Callable` is capable of throwing checked exceptions, so option E is incorrect. Both `Runnable` and `Callable` are functional interfaces that can be implemented with a lambda expression, so option C is also correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Chữ ký phương thức:
      * `Runnable`: `public void run()`
      * `Callable<V>`: `public V call() throws Exception`
    * `Runnable` trả về `void`, còn `Callable` trả về kiểu dữ liệu generic `V` → **F đúng**, A và D sai.
    * Mọi phương thức trong Java đều có thể ném Unchecked Exception (Runtime Exception) → **B đúng**.
    * Chỉ có `Callable` mới khai báo `throws Exception` (Checked Exception); `Runnable` không thể ném checked exception → E sai.
    * Cả hai đều là Functional Interface (có đúng 1 phương thức trừu tượng) nên đều có thể dùng với biểu thức Lambda → **C đúng**.
</details>

---

### Question 4 (Câu 4)
**Which lines need to be changed to make the code compile?**

```java
try (ExecutorService service =         // w1
   Executors.newSingleThreadScheduledExecutor()) {
   service.scheduleWithFixedDelay(() -> {
      System.out.println("Open Zoo");
      return null;                     // w2
   }, 0, 1, TimeUnit.MINUTES);
   var result = service.submit(() ->   // w3
      System.out.println("Wake Staff"));
   System.out.println(result.get());
}
```

* A. Only line `w1`.
* B. Only line `w2`.
* C. Only line `w3`.
* D. Line `w1` and `w2`.
* E. Line `w1` and `w2`.
* F. Line `w1` and `w3`.
* G. None of the above; the code compiles.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The first problem is that although a `ScheduledExecutorService` is created, it is assigned to an `ExecutorService`. The type of the variable on line `w1` would have to be updated to `ScheduledExecutorService` for the code to compile. The second problem is that `scheduleWithFixedDelay()` supports only `Runnable`, not `Callable`, and any attempt to return a value is invalid in a `Runnable` lambda expression; therefore, line `w2` will also not compile, and option D is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Lỗi 1 (Dòng w1):** `Executors.newSingleThreadScheduledExecutor()` trả về một `ScheduledExecutorService`. Tuy nhiên, biến được gán lại có kiểu tham chiếu là `ExecutorService`. Interface cha `ExecutorService` **không có** phương thức `scheduleWithFixedDelay()`. Do đó dòng w1 phải sửa kiểu biến thành `ScheduledExecutorService` (hoặc dùng `var service = ...`).
    * **Lỗi 2 (Dòng w2):** Phương thức `scheduleWithFixedDelay()` chỉ chấp nhận tham số là một **`Runnable`**, không hỗ trợ `Callable`. Một biểu thức Lambda kiểu Runnable không được phép trả về giá trị (`return null;` là không hợp lệ trong Runnable lambda). Cần xóa bỏ dòng `return null;`.
    * Dòng w3 hợp lệ vì `submit(Runnable)` có sẵn trên `ExecutorService`.
    * Do đó, hai dòng cần sửa là **w1 và w2** → **D đúng**.
</details>

---

### Question 5 (Câu 5)
**What statement about the following code is true?**

```java
var value1 = new AtomicLong(0);
final long[] value2 = {0};
IntStream.iterate(1, i -> 1).limit(100).parallel()
   .forEach(i -> value1.incrementAndGet());
IntStream.iterate(1, i -> 1).limit(100).parallel()
   .forEach(i -> ++value2[0]);
System.out.println(value1 + " " + value2[0]);
```

* A. It outputs `100 100`.
* B. It outputs `100 99`.
* C. The output cannot be determined ahead of time.
* D. The code does not compile.
* E. It compiles but throws an exception at runtime.
* F. It compiles but enters an infinite loop at runtime.
* G. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles and runs without throwing an exception or entering an infinite loop, so options D, E, and F are incorrect. The key here is that the increment operator `++` is not atomic. While the first part of the output will always be `100`, the second part is nondeterministic. It may output any value from `1` to `100`, because the threads can overwrite each other’s work. Therefore, option C is the correct answer, and options A and B are incorrect.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Đoạn mã biên dịch và chạy bình thường không ném lỗi hay lặp vô tận → D, E, F sai.
    * Biến `value1` là đối tượng `AtomicLong`. Phương thức `incrementAndGet()` thực hiện thao tác tăng nguyên tử trên phần cứng (CAS), đảm bảo an toàn tuyệt đối khi chạy song song qua 100 phần tử → `value1` chắc chắn luôn bằng **100**.
    * Tuy nhiên, `++value2[0]` là một toán tử tăng không nguyên tử (non-atomic). Khi 100 tác vụ song song cùng đọc - tăng - ghi đè lên phần tử mảng `value2[0]`, sẽ xảy ra hiện tượng **Lost Update (xung đột dữ liệu / race condition)**.
    * Kết quả của `value2[0]` sẽ là một số ngẫu nhiên dao động từ 1 đến 100, không thể đoán trước được → **C đúng**.
</details>

---

### Question 6 (Câu 6)
**Which statements about the following code are correct? (Choose all that apply.)**

```java
var data = List.of(2, 5, 1, 9, 8);
data.stream().parallel()
   .mapToInt(s -> s)
   .peek(System.out::print)
   .forEachOrdered(System.out::print);
```

* A. The `peek()` method will print the entries in the sorted order: `12589`.
* B. The `peek()` method will print the entries in the original order: `25198`.
* C. The `peek()` method will print the entries in an order that cannot be determined ahead of time.
* D. The `forEachOrdered()` method will print the entries in the sorted order: `12589`.
* E. The `forEachOrdered()` method will print the entries in the original order: `25198`.
* F. The `forEachOrdered()` method will print the entries in an order that cannot be determined ahead of time.
* G. The code does not compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles, so option G is incorrect. The `peek()` method on a parallel stream will process the elements concurrently, so the order cannot be determined ahead of time, and option C is correct. The `forEachOrdered()` method will process the elements in the order in which they are stored in the stream, making option E correct. None of the methods sort the elements, so options A and D are incorrect.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Đoạn stream được chuyển sang song song bằng `.parallel()`.
    * Phương thức `peek()` là một thao tác trung gian được thực thi song song độc lập trên các luồng con, do đó thứ tự in của `peek()` là **hoàn toàn ngẫu nhiên và không thể đoán trước** → **C đúng**, A và B sai.
    * Phương thức kết thúc `forEachOrdered()` có nhiệm vụ ép buộc việc xử lý và xuất kết quả theo **đúng thứ tự gốc của stream** (encounter order), tức thứ tự ban đầu trong danh sách `List.of(2, 5, 1, 9, 8)` là `25198` → **E đúng**, D và F sai (lưu ý stream không hề gọi `.sorted()`).
</details>

---

### Question 7 (Câu 7)
**Fill in the blanks: __________ occur(s) when two or more threads are blocked forever but both appear active. _______ occur(s) when two or more threads try to complete a related task at the same time, resulting in invalid or unexpected data.**

* A. Livelock, Deadlock
* B. Deadlock, Starvation
* C. Race conditions, Deadlock
* D. Livelock, Race conditions
* E. Starvation, Race conditions
* F. Deadlock, Livelock

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Livelock occurs when two or more threads are conceptually blocked forever, although they are each still active and trying to complete their task. A race condition is an undesirable result that occurs when two tasks that should have been completed sequentially are completed at the same time. For these reasons, option D is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Livelock (Tắc nghẽn động):** Các luồng liên tục hoạt động (active, không bị BLOCKED) và phản ứng với nhau nhưng không bao giờ đạt được tiến triển công việc (bị kẹt vĩnh viễn về mặt logic).
    * **Race condition (Xung đột dữ liệu):** Xảy ra khi nhiều luồng truy cập và sửa đổi dữ liệu chung đồng thời mà thiếu đồng bộ, dẫn đến dữ liệu bị sai lệch hoặc không nhất quán.
    * Do đó cặp khái niệm chính xác là **Livelock và Race conditions** → **D đúng**.
</details>

---

### Question 8 (Câu 8)
**Assuming this class is accessed by only a single thread at a time, what is the result of calling the `countIceCreamFlavors()` method?**

```java
import java.util.stream.LongStream;
public class Flavors {
   private static int counter;
   public static void countIceCreamFlavors()  {
      counter = 0;
      Runnable task = () -> counter++;
      LongStream.range(0, 500)
         .forEach(m -> Thread.ofPlatform()
           .priority(1)
           .unstarted(task)
           .run());
      System.out.println(counter);
   } }
```

* A. The method consistently prints a number less than `500`.
* B. The method consistently prints `500`.
* C. The method compiles and prints a value, but that value cannot be determined ahead of time.
* D. The method does not compile.
* E. The method compiles but throws an exception at runtime.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Be wary of `run()` vs. `start()` on the exam! The method looks like it executes a task concurrently, but it runs synchronously. In each iteration of the `forEach()` loop, the process waits for the `run()` method to complete before moving on. For this reason, the code is thread-safe. Since the program consistently prints `500` at runtime, option B is correct. Note that if `start()` had been used instead of `run()` (or the stream was parallel), then the output would be indeterminate, and option C would have been correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Bẫy thi `run()` vs. `start()`:**
    * Hãy quan sát kỹ dòng gọi thực thi: `.unstarted(task).run()`
    * Trong Java, gọi phương thức **`run()`** trực tiếp trên một đối tượng `Thread` sẽ thực thi phương thức đó một cách **tuần tự (synchronous) ngay trên luồng hiện tại**, chứ **KHÔNG HỀ** khởi chạy một luồng mới chạy ngầm! (Muốn chạy đa luồng thì phải gọi `.start()`).
    * Vì `LongStream.range(0, 500)` là một sequential stream (không gọi `.parallel()`), 500 lần lặp sẽ lần lượt gọi `task.run()` nối tiếp nhau trên luồng chính, tăng biến `counter` từ 0 lên 500 mà không hề có xung đột dữ liệu.
    * Do đó, chương trình luôn luôn in ra chính xác **500** → **B đúng**.
</details>

---

### Question 9 (Câu 9)
**Which are true of `ExecutorService`? (Choose all that apply.)**

* A. If a task is submitted when no threads are available, the executor discards the task without completing it.
* B. If a task is submitted when no threads are available, the executor adds the task to an internal queue and completes when there is an available thread.
* C. If a task is submitted when no threads are available, the thread submitting the task waits on the submit call until a thread is available before continuing.
* D. Platform threads can be pooled using `ExecutorService`, but not virtual threads.
* E. Virtual threads can be pooled using `ExecutorService`, but not platform threads.
* F. Both platform threads and virtual threads can be pooled using `ExecutorService`.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** If a task is submitted to a thread executor and the thread executor does not have any available threads, the call to the task will return immediately with the task being queued internally by the thread executor. For this reason, option B is correct. Additionally, only platform threads can be pooled, making option D correct as well. Virtual threads are lightweight so they don’t benefit from pooling.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Khi các luồng trong Thread Pool đều đang bận, phương thức `submit()` hoặc `execute()` vẫn trả về ngay lập tức; tác vụ mới được lưu vào hàng đợi (BlockingQueue) nội bộ của executor để chờ luồng rảnh xử lý → **B đúng**, A và C sai.
    * Platform Thread có chi phí khởi tạo và bộ nhớ cao nên cần cơ chế gom nhóm (Thread Pool) để tái sử dụng luồng (`newFixedThreadPool`, `newCachedThreadPool`).
    * Virtual Thread siêu nhẹ (~vài KB), chi phí tạo mới không đáng kể và được thiết kế theo triết lý "mỗi tác vụ một luồng ảo", do đó chúng **không bao giờ được đưa vào pool** (như trong `Executors.newVirtualThreadPerTaskExecutor()`) → **D đúng**, E và F sai.
</details>

---

### Question 10 (Câu 10)
**What is the result of executing the following code snippet?**

```java
SequencedCollection<Integer> lions = new ArrayList<>(List.of(1, 2, 3));
SequencedCollection<Integer> tigers = new CopyOnWriteArrayList<>(lions);
Set<Integer> bears = new ConcurrentSkipListSet<>();
bears.addAll(lions);
for (Integer item: tigers) tigers.add(4); // x1
for (Integer item: bears) bears.add(5);   // x2
System.out.println(lions.size() + " " + tigers.size() + " " + bears.size());
```

* A. It outputs `3 6 4`.
* B. It outputs `6 6 6`.
* C. It outputs `6 3 4`.
* D. The code does not compile.
* E. It compiles but throws an exception at runtime on line `x1`.
* F. It compiles but throws an exception at runtime on line `x2`.
* G. It compiles but enters an infinite loop at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles without issue, so option D is incorrect. The `CopyOnWriteArrayList` class is designed to preserve the original list on iteration, so the first loop will be executed exactly three times and, in the process, will increase the size of `tigers` to six elements. The `ConcurrentSkipListSet` class allows modifications, and since it enforces the uniqueness of its elements, the value `5` is added only once, leading to a total of four elements in `bears`. Finally, despite using the elements of `lions` to populate the collections, `tigers` and `bears` are not backed by the original list, so the size of `lions` is `3` throughout this program. For these reasons, the program prints `3 6 4`, and option A is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Đoạn mã biên dịch hoàn toàn hợp lệ từ Java 21 (sử dụng interface `SequencedCollection`) → D sai.
    * **Vòng lặp x1 trên `tigers` (`CopyOnWriteArrayList`):**
      * Ban đầu có 3 phần tử `[1, 2, 3]`.
      * Khi bắt đầu duyệt, Iterator chụp một bản snapshot gồm đúng 3 phần tử ban đầu. Vòng lặp chạy đúng 3 lần. Mỗi lần thêm một số 4 vào danh sách thực tế.
      * Kích thước của `tigers` sau vòng lặp là $3 + 3 = 6$.
    * **Vòng lặp x2 trên `bears` (`ConcurrentSkipListSet`):**
      * Ban đầu chứa 3 phần tử `[1, 2, 3]`.
      * Vòng lặp duyệt qua các phần tử và gọi `bears.add(5)`. Vì `bears` là một `Set` (tập hợp không chứa phần tử trùng lặp), số 5 chỉ được thêm vào một lần duy nhất dù `add(5)` được gọi nhiều lần.
      * Kích thước của `bears` sau vòng lặp là $3 + 1 = 4$.
    * Danh sách gốc `lions` hoàn toàn độc lập nên kích thước vẫn là 3.
    * Kết quả in ra là `3 6 4` → **A đúng**.
</details>

---

### Question 11 (Câu 11)
**What statement about the following code is true?**

```java
Integer i1 = List.of(1, 2, 3, 4, 5).stream().findAny().get();
synchronized(i1) { // y1
   Integer i2 = List.of(6, 7, 8, 9, 10)
      .parallelStream()
      .sorted()
      .findAny().get(); // y2
   System.out.println(i1 + " " + i2);
}
```

* A. The first value printed is always `1`.
* B. The second value printed is always `6`.
* C. The code will not compile because of line `y1`.
* D. The code will not compile because of line `y2`.
* E. The code compiles but throws an exception at runtime.
* F. The output cannot be determined ahead of time.
* G. It compiles but waits forever at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles and runs without issue, so options C, D, E, and G are incorrect. There are two important things to notice. First, synchronizing on the first variable doesn’t impact the results of the code. Second, sorting on a parallel stream does not mean that `findAny()` will return the first record. The `findAny()` method will return the value from the first thread that retrieves a record. Therefore, the output is not guaranteed, and option F is correct. Option A looks correct, but even on serial streams, `findAny()` is free to select any element.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Đoạn mã biên dịch và chạy bình thường → Loại C, D, E, G.
    * Khối `synchronized(i1)` chỉ khóa trên đối tượng `i1`, hoàn toàn không ảnh hưởng đến việc xử lý stream bên trong.
    * Phương thức **`findAny()`** trên stream (kể cả serial stream hay parallel stream) có quyền trả về **bất kỳ phần tử nào** mà luồng đầu tiên tìm thấy, không có bất kỳ cam kết nào về việc phải trả về phần tử đầu tiên (muốn chắc chắn phần tử đầu tiên phải dùng `findFirst()`).
    * Gọi `.sorted()` trên parallel stream cũng không ép `findAny()` phải trả về phần tử nhỏ nhất `6`.
    * Do đó, cả `i1` và `i2` đều là các giá trị ngẫu nhiên trong danh sách của chúng → Đầu ra không thể xác định trước → **F đúng**.
</details>

---

### Question 12 (Câu 12)
**Assuming each call to `takeNap()` takes five seconds to execute without throwing an exception, what is the expected result of executing the following code snippet? (Choose all that apply.)**

```java
public void shutdown() throws InterruptedException {
   var service = Executors.newFixedThreadPool(4);
   try {
      service.execute(() -> takeNap());
      service.execute(() -> takeNap());
      service.execute(() -> takeNap());
   } finally {
      service.shutdown();
   }
   service.awaitTermination(2, TimeUnit.SECONDS);
   System.out.println("DONE!");
}
public void refactored() {
   try (var service = Executors.newFixedThreadPool(4)) {
      service.execute(() -> takeNap());
      service.execute(() -> takeNap());
      service.execute(() -> takeNap());
   }
   System.out.println("DONE!");
}
```

* A. `shutdown()` will pause for approximately 2 seconds and then print `DONE!`.
* B. `shutdown()` will pause for approximately 5 seconds and then print `DONE!`.
* C. `shutdown()` will pause for approximately 15 seconds and then print `DONE!`.
* D. `refactored()` will pause for approximately 2 seconds and then print `DONE!`.
* E. `refactored()` will pause for approximately 5 seconds and then print `DONE!`.
* F. `refactored()` will pause for approximately 15 seconds and then print `DONE!`.
* G. One of the methods returns the result immediately.
* H. One of the methods throws an exception.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `shutdown()` method submits three tasks to an `ExecutorService`, shuts it down, and then waits for the results. The `awaitTermination()` method waits a specified amount of time for all tasks to complete and the service to finish shutting down. Since each five-second task is still executing, the `awaitTermination()` method will return with a value of `false` after two seconds but not throw an exception making option A correct. The `refactored()` method uses a try-with-resources, which allows the tasks to gracefully finish and option E to be the other answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Với phương thức `shutdown()`:**
      * 3 tác vụ chạy trên nhóm 4 luồng nên chúng chạy song song cùng lúc (mỗi tác vụ mất 5 giây).
      * Lệnh `service.awaitTermination(2, TimeUnit.SECONDS)` chỉ chờ tối đa 2 giây. Sau 2 giây, dù các tác vụ chưa kết thúc, `awaitTermination()` vẫn trả về `false` và chương trình lập tức thực thi dòng tiếp theo để in `DONE!` → Mất khoảng **2 giây** → **A đúng**, B và C sai.
    * **Với phương thức `refactored()`:**
      * Phương thức sử dụng khối `try-with-resources` với `ExecutorService`.
      * Khi thoát khỏi khối `try`, phương thức `service.close()` được tự động gọi. Theo tài liệu đặc tả của Java 19+, `close()` sẽ phát lệnh `shutdown()` và **chờ đợi cho đến khi tất cả các tác vụ đang thực thi hoàn tất** (tương đương `awaitTermination` vô hạn).
      * Vì 3 tác vụ chạy song song trên 4 luồng và mất 5 giây, khối `try` sẽ chờ đúng 5 giây cho các tác vụ xong rồi mới in `DONE!` → Mất khoảng **5 giây** → **E đúng**, D và F sai.
</details>

---

### Question 13 (Câu 13)
**What statement about the following code is true?**

```java
System.out.print(List.of("duck","flamingo","pelican")
   .parallelStream().parallel()   // q1
   .reduce(0,
      (c1, c2) -> c1.length() + c2.length(),  // q2
      (s1, s2) -> s1 + s2));      // q3
```

* A. It compiles and runs without issue, outputting the total length of all strings in the stream.
* B. The code will not compile because of line `q1`.
* C. The code will not compile because of line `q2`.
* D. The code will not compile because of line `q3`.
* E. It compiles but throws an exception at runtime.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code does not compile, so options A and E are incorrect. The problem here is that `c1` is an `Integer` and `c2` is a `String`, so the code fails to combine on line `q2`, since calling `length()` on an `Integer` is not allowed, and option C is correct. The rest of the lines compile without issue. Note that calling `parallel()` on an already parallel stream is allowed, and it may return the same object.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Bẫy kiểu dữ liệu của hàm `reduce()`:**
    * Phương thức `reduce(identity, accumulator, combiner)` có chữ ký:
      `<U> U reduce(U identity, BiFunction<U, ? super T, U> accumulator, BinaryOperator<U> combiner)`
    * Ở đây, `identity` là `0` (kiểu `Integer`), phần tử trong stream là kiểu `String` (`T = String`).
    * Do đó trong hàm `accumulator (c1, c2)`:
      * `c1` có kiểu là `Integer` (kiểu tích lũy `U`).
      * `c2` có kiểu là `String` (kiểu phần tử `T`).
    * Trên dòng q2, biểu thức lại viết `c1.length() + c2.length()`. Lớp `Integer` **không hề có phương thức `length()`**!
    * Trình biên dịch sẽ báo lỗi: `cannot find symbol: method length() on Integer` → Lỗi biên dịch tại **dòng q2 (Đáp án C)**.
    * (Lưu ý: Dòng q1 gọi `.parallel()` trên một stream đã song song là hoàn toàn hợp lệ).
</details>

---

### Question 14 (Câu 14)
**What statements about the following code snippet are true? (Choose all that apply.)**

```java
Object o1 = new Object();
Object o2 = new Object();
try (var service = Executors.newFixedThreadPool(2)) {
   var f1 = service.submit(() -> {
      synchronized (o1) {
         synchronized (o2) { System.out.print("Tortoise"); }
      }
   });
   var f2 = service.submit(() -> {
      synchronized (o2) {
         synchronized (o1) { System.out.print("Hare"); }
      }
   });
   f1.get();
   f2.get();
}
```

* A. The code will always output `Tortoise` followed by `Hare`.
* B. The code will always output `Hare` followed by `Tortoise`.
* C. If the code does output anything, the order cannot be determined.
* D. The code does not compile.
* E. The code compiles but may produce a deadlock at runtime.
* F. The code compiles but may produce a livelock at runtime.
* G. It compiles but throws an exception at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles without issue, so option D is incorrect. Since both tasks are submitted to the same thread executor pool, the order cannot be determined, so options A and B are incorrect, and option C is correct. The key here is that the order in which the resources `o1` and `o2` are synchronized could result in a deadlock. For example, if the first thread gets a lock on `o1` and the second thread gets a lock on `o2` before either thread can get their second lock, the code will hang at runtime, making option E correct. The code cannot produce a livelock, since both threads are waiting, so option F is incorrect. Finally, if a deadlock does occur, an exception will not be thrown, so option G is incorrect.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Hai tác vụ được gửi đồng thời vào nhóm 2 luồng. Tác vụ 1 yêu cầu khóa `o1` rồi đến `o2`. Tác vụ 2 yêu cầu khóa `o2` rồi đến `o1`.
    * Đây là ví dụ kinh điển về **Deadlock (Bế tắc)**: Nếu luồng 1 giành được khóa `o1` trong khi luồng 2 cùng lúc giành được khóa `o2`, cả hai luồng sẽ chờ nhau nhả khóa còn lại vô thời hạn → Chương trình bị treo (Deadlock) → **E đúng**.
    * Trong trường hợp một luồng chạy nhanh và giành được cả hai khóa trước luồng kia, luồng đó sẽ in trước. Do hai luồng chạy song song, thứ tự in (nếu có) là không thể xác định trước → **C đúng**.
    * Cả hai luồng bị kẹt ở trạng thái `BLOCKED` (chờ khóa) chứ không phải đang hoạt động liên tục thay đổi trạng thái, do đó đây không phải là Livelock → F sai. Khi Deadlock xảy ra, JVM không ném ngoại lệ → G sai.
</details>

---

### Question 15 (Câu 15)
**Which statement about the following code snippet is correct?**

```java
2: var cats = Stream.of("leopard", "lynx", "ocelot", "puma")
3:    .parallel();
4: var bears = Stream.of("panda","grizzly","polar").parallel();
5: var data = Stream.of(cats,bears).flatMap(s -> s)
6:    .collect(Collectors.groupingByConcurrent(
7:       s -> !s.startsWith("p")));
8: System.out.println(data.get(false).size()
9:    + " " + data.get(true).size());
```

* A. It outputs `3 4`.
* B. It outputs `4 3`.
* C. The code will not compile because of line 6.
* D. The code will not compile because of line 7.
* E. The code will not compile because of line 8.
* F. It compiles but throws an exception at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles and runs without issue, so options C, D, E, and F are incorrect. The `collect()` operation groups the animals into those that do and do not start with the letter `p`. Note that there are four animals that do not start with the letter `p` and three animals that do. Therefore, the output is `3 4`, and option A is correct, making option B incorrect.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Đoạn mã biên dịch và chạy song song hoàn toàn hợp lệ → C, D, E, F sai.
    * Phép gom nhóm `groupingByConcurrent` phân chia các chuỗi theo điều kiện:
      `s -> !s.startsWith("p")`
      * Nhóm có key là `false`: Nghĩa là `!s.startsWith("p") == false`, tương đương với các con vật **BẮT ĐẦU bằng chữ 'p'**: `"puma"`, `"panda"`, `"polar"`. Có tất cả **3** con vật.
      * Nhóm có key là `true`: Nghĩa là các con vật **KHÔNG bắt đầu bằng chữ 'p'**: `"leopard"`, `"lynx"`, `"ocelot"`, `"grizzly"`. Có tất cả **4** con vật.
    * Dòng 8 và 9 in `data.get(false).size()` theo sau bởi `data.get(true).size()` → In ra **`3 4`** → **A đúng**.
</details>

---

### Question 16 (Câu 16)
**Which APIs exist for creating or working with platform threads? (Choose all that apply.)**

* A. `Executors.newCachedThreadPool()`
* B. `Executors.newPlatformThreadPool()`
* C. `Executors.newPlatformThreadPerTaskExecutor()`
* D. `new Thread()`
* E. `Thread.ofPlatform()`
* F. `Thread.ofPlatformThread()`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, D, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** All the factory methods on `Executors` work with platform threads except `newVirtualThreadPerTaskExecutor()`, making option A correct. You can also create a platform thread using the constructor or factory method `Thread.ofPlatform()`, making options D and E the other answers.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Trong lớp `Executors`, hầu hết các phương thức factory truyền thống như `newCachedThreadPool()`, `newFixedThreadPool()`, `newSingleThreadExecutor()` đều tạo ra các Platform Thread → **A đúng**. (Không có phương thức nào tên là `newPlatformThreadPool()` hay `newPlatformThreadPerTaskExecutor()` → B và C sai).
    * Hàm dựng truyền thống `new Thread()` tạo ra một Platform Thread → **D đúng**.
    * Phương thức factory trong Java 21 là `Thread.ofPlatform()` trả về builder để cấu hình và tạo Platform Thread → **E đúng**. (Không có phương thức nào tên là `Thread.ofPlatformThread()` → F sai).
</details>

---

### Question 17 (Câu 17)
**Which statement about methods in `ReentrantLock` is correct?**

* A. The `lock()` method will attempt to acquire a lock without waiting indefinitely for it.
* B. The `testLock()` method will attempt to acquire a lock without waiting indefinitely for it.
* C. The `attemptLock()` method will attempt to acquire a lock without waiting indefinitely for it.
* D. By default, a `ReentrantLock` fairly releases to each thread in the order in which it was requested.
* E. Calling the `unlock()` method once will release a resource so that other threads can obtain the lock.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `lock()` method will wait indefinitely for a lock, so option A is incorrect. Options B and C are also incorrect, as the correct method name to attempt to acquire a lock is `tryLock()`. Option D is incorrect, as fairness is set to `false` by default and must be enabled by using an overloaded constructor. Finally, option E is incorrect because a thread that holds the lock may have called `lock()` or `tryLock()` multiple times. A thread needs to call `unlock()` once for each call to `lock()` and successful `tryLock()`. Option F is the correct answer since none of the other options is a valid statement.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * `lock()` sẽ chặn luồng và chờ đợi vô thời hạn cho đến khi lấy được khóa → A sai.
    * Các phương thức tên `testLock()` hay `attemptLock()` không hề tồn tại trong Java (tên đúng là `tryLock()`) → B và C sai.
    * Mặc định, tính công bằng (fairness) của `ReentrantLock` là `false` (Non-fair lock để tối ưu thông lượng). Muốn kích hoạt fair lock phải gọi hàm tạo `new ReentrantLock(true)` → D sai.
    * Nếu một luồng đã gọi `lock()` hoặc `tryLock()` thành công $N$ lần (tính chất tái nhập - reentrancy), nó bắt buộc phải gọi `unlock()` đủ $N$ lần thì khóa mới thực sự được giải phóng hoàn toàn cho luồng khác → E sai.
    * Do đó, đáp án đúng là **F (None of the above)**.
</details>

---

### Question 18 (Câu 18)
**Which of the following lambda expressions are valid `Callable` expressions? (Choose all that apply.)**

* A. `a -> {return 10;}`
* B. `() -> {String s = "";}`
* C. `() -> 5`
* D. `() -> {return null}`
* E. `() -> "The" + "Zoo"`
* F. `(int count) -> count+1`
* G. `() -> {System.out.print("Giraffe"); return 10;}`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C, E, G**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** A `Callable` lambda expression takes no values and returns a generic type; therefore, options C, E, and G are correct. Options A and F are incorrect because they both take an input parameter. Option B is incorrect because it does not return a value. Option D is not a valid lambda expression, because it is missing a semicolon at the end of the `return` statement, which is required when inside braces, `{}`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Giao diện `Callable<V>` có phương thức duy nhất: `V call() throws Exception`.
    * Đặc điểm: **Không nhận tham số đầu vào `()`** và **bắt buộc phải trả về một giá trị**.
    * A và F nhận tham số đầu vào (`a -> ...` và `(int count) -> ...`) → Sai cú pháp Callable.
    * B có thân hàm rỗng không trả về giá trị (tương đương `void`, là Runnable) → Sai.
    * D thiếu dấu chấm phẩy `;` sau `return null` bên trong khối `{}` → Lỗi cú pháp biên dịch.
    * C (`() -> 5`), E (`() -> "The" + "Zoo"`), và G (`() -> { ... return 10;}`) đều không nhận tham số và trả về giá trị hợp lệ → **C, E, G đúng**.
</details>

---

### Question 19 (Câu 19)
**What is the result of executing the following application? (Choose all that apply.)**

```java
import java.util.concurrent.*;
import java.util.stream.*;
public class PrintConstants {
   public static void main(String[] args) {
      var s = Executors.newVirtualThreadPerTaskExecutor();
      DoubleStream.of(3.14159, 2.71828)   // b1
         .forEach(c -> s.submit(          // b2
            () -> System.out.println(10 * c))); // b3
      s.execute(() -> System.out.println("Printed"));
   } }
```

* A. It compiles and outputs the two numbers followed by `Printed`.
* B. The code will not compile because of line `b1`.
* C. The code will not compile because of line `b2`.
* D. The code will not compile because of line `b3`.
* E. It compiles, but the output cannot be determined ahead of time.
* F. It compiles but throws an exception at runtime.
* G. It compiles but waits forever at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E, G**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The application compiles and does not throw an exception. Even though the stream is processed in sequential order, the tasks are submitted to a thread executor, which may complete the tasks in any order. Therefore, the output cannot be determined ahead of time, and option E is correct. Finally, the thread executor is never shut down; therefore, the code will run but never terminate, making option G also correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Đoạn mã biên dịch hoàn toàn hợp lệ → B, C, D sai.
    * Dù `DoubleStream` là tuần tự, nhưng các tác vụ in được gửi vào `ExecutorService` để chạy trên các luồng ảo song song độc lập. Các tác vụ này có thể hoàn thành theo bất kỳ thứ tự nào, do đó đầu ra không thể đoán trước → **E đúng**, A sai.
    * **Điểm mấu chốt thứ hai:** Đối tượng `ExecutorService` được tạo ra nhưng **không hề được gọi lệnh `shutdown()`** và cũng không nằm trong khối `try-with-resources`. Do đó, JVM duy trì executor và tiến trình sẽ chạy mãi mãi mà **không bao giờ tự kết thúc** → **G đúng**.
</details>

---

### Question 20 (Câu 20)
**What is the result of executing the following program?**

```java
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.*;
public class PrintCounter {
   static int count = 0;
   public static void main(String[] args) throws
                     InterruptedException, ExecutionException 
{
      try (var service = Executors.newSingleThreadExecutor()) 
{
         var r = new ArrayList<Future<?>>();
         IntStream.iterate(0,i -> i + 1).limit(5).forEach(
            i -> r.add(service.execute(() -> {count++;})) // n1
         );
         for (Future<?> result : r) {
            System.out.print(result.get() + " "); // n2
         }
      }
   } }
```

* A. It prints `0 1 2 3 4`
* B. It prints `1 2 3 4 5`
* C. It prints `null null null null null`
* D. It hangs indefinitely at runtime.
* E. The output cannot be determined.
* F. The code will not compile because of line `n1`.
* G. The code will not compile because of line `n2`.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The key to solving this question is to remember that the `execute()` method returns `void`, not a `Future` object. Therefore, line `n1` does not compile, and option F is the correct answer. If the `submit()` method had been used instead of `execute()`, option C would have been the correct answer, as the output of the `submit(Runnable)` task is a `Future<?>` object that can only return `null` on its `get()` method.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Bẫy kiểu trả về của `execute()`:**
    * Phương thức **`service.execute(Runnable)`** có kiểu trả về là **`void`**.
    * Tại dòng n1: `r.add(service.execute(...))`. Danh sách `r` là một `ArrayList<Future<?>>`. Bạn không thể truyền giá trị `void` vào phương thức `add()` của một danh sách!
    * Trình biên dịch sẽ báo lỗi: `'void' type not allowed here` → Lỗi biên dịch tại **dòng n1 (Đáp án F)**.
    * (Nếu dòng n1 đổi thành `service.submit(...)`, mã nguồn sẽ biên dịch thành công và in ra `null null null null null` vì `submit(Runnable)` trả về `Future<?>` và gọi `.get()` trên đó luôn trả về `null`).
</details>

---

### Question 21 (Câu 21)
**Given the following code snippet and blank lines on `p1` and `p2`, which values guarantee that `1` is printed at runtime? (Choose all that apply.)**

```java
var data = List.of(List.of(1, 2),
   List.of(3, 4),
   List.of(5, 6));
data._______________  // p1
   .flatMap(s -> s.stream())
   .________________  // p2
   .ifPresent(System.out::print);
```

* A. `stream()` on line `p1`, `findFirst()` on line `p2`.
* B. `stream()` on line `p1`, `findAny()` on line `p2`.
* C. `parallelStream()` on line `p1`, `findAny()` on line `p2`.
* D. `parallelStream()` on line `p1`, `findFirst()` on line `p2`.
* E. The code does not compile regardless of what is inserted into the blanks.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `findFirst()` method guarantees the first element in the stream will be returned, whether it is serial or parallel, making options A and D correct. While option B may consistently print `1` at runtime, the behavior of `findAny()` on a serial stream is not guaranteed, so option B is incorrect. Option C is likewise incorrect, with the output being random at runtime.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Phương thức **`findFirst()`** được đặc tả để **luôn luôn đảm bảo trả về phần tử đầu tiên** theo thứ tự xuất hiện của stream, bất kể stream đó là tuần tự (`stream()`) hay song song (`parallelStream()`) → **A và D đúng**.
    * Ngược lại, phương thức **`findAny()`** không cam kết trả về phần tử đầu tiên (đặc biệt trên parallel stream nó trả về phần tử của luồng nào hoàn thành trước ngẫu nhiên) → B và C sai.
</details>

---

### Question 22 (Câu 22)
**Assuming one minute is enough time for the tasks submitted to the service executor to complete, what is the result of executing `countSheep()`?**

```java
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
public class BedTime {
   private AtomicInteger s1 = new AtomicInteger(0); // w1
   private int s2 = 0;
 
   private void countSheep() throws InterruptedException {
      try (var service = Executors.newSingleThreadExecutor()) { // w2
         for (int i = 0; i < 100; i++)
         service.execute(() -> {
            s1.getAndIncrement(); s2++; }); // w3
         Thread.sleep(60_000);
         System.out.println(s1 + " " + s2);
      }
   }
   public static void main(String... nap) throws InterruptedException {
      new BedTime().countSheep();
   } }
```

* A. The method consistently prints `100 99`.
* B. The method consistently prints `100 100`.
* C. The output cannot be determined ahead of time.
* D. The code will not compile because of line `w1`.
* E. The code will not compile because of line `w2`.
* F. The code will not compile because of line `w3`.
* G. It compiles but throws an exception at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles and runs without issue. The key aspect to notice in the code is that a single-thread executor is used, meaning that no task will be executed concurrently. Therefore, the results are valid and predictable, with `100 100` being the output, and option B is the correct answer. If a thread executor with more threads was used, then the `s2++` operations could overwrite each other, making the second value indeterminate at the end of the program. In this case, option C would be the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Điểm mấu chốt của bài toán nằm ở dòng w2:
      `Executors.newSingleThreadExecutor()`
    * Executor này **chỉ có duy nhất một luồng thực thi**. Tất cả 100 tác vụ được xếp hàng đợi và chạy **lần lượt tuần tự từng tác vụ một**, hoàn toàn không có hai tác vụ nào chạy đồng thời!
    * Do không có sự can thiệp đồng thời giữa các luồng, biến nguyên thủy `s2++` không hề bị xung đột dữ liệu (no race conditions).
    * Cả `s1` và `s2` đều được tăng chính xác 100 lần → Chương trình luôn luôn in ra kết quả nhất quán là **`100 100`** → **B đúng**.
    * (Lưu ý: Nếu ở đây dùng pool nhiều luồng như `newFixedThreadPool(4)`, thì `s2` sẽ bị race condition và đáp án khi đó mới là C).
</details>

---

### Question 23 (Câu 23)
**What is the result of executing the following application?**

```java
import java.util.concurrent.*;
import java.util.stream.*;
public class StockRoomTracker {
   public static void await(CyclicBarrier cb) { // j1
      try { cb.await(); } catch (Exception e) {}
   }
   public static void main(String[] args) {
      var cb = new CyclicBarrier(10,
         () -> System.out.println("Stock Room Full!")); // j2
      IntStream.iterate(1, i -> 1).limit(9).parallel()
         .forEach(i -> await(cb)); // j3
   } }
```

* A. It outputs `Stock Room Full!`
* B. The code will not compile because of line `j1`.
* C. The code will not compile because of line `j2`.
* D. The code will not compile because of line `j3`.
* E. It compiles but throws an exception at runtime.
* F. It compiles but waits forever at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles without issue, so options B, C, and D are incorrect. The limit on the cyclic barrier is 10, but the stream can generate only up to 9 threads that reach the barrier; therefore, the limit can never be reached, and option F is the correct answer, making options A and E incorrect. Even if the `limit(9)` statement was changed to `limit(10)`, the program could still hang since the JVM might not allocate 10 threads to the parallel stream.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Bẫy giới hạn của `CyclicBarrier`:**
    * Đối tượng `CyclicBarrier` được khởi tạo với giới hạn là **10** luồng: `new CyclicBarrier(10, ...)`. Nghĩa là rào chắn chỉ mở khi có đủ 10 luồng cùng gọi `await()`.
    * Tuy nhiên, dòng j3 giới hạn stream chỉ tạo ra tối đa **9** phần tử (`limit(9)`). Do đó, chỉ có tối đa 9 lần gọi `cb.await()`.
    * Rào chắn không bao giờ nhận đủ 10 luồng tập kết, khiến cả 9 luồng đều rơi vào trạng thái chờ vô thời hạn → Chương trình bị **treo vĩnh viễn (waits forever / hang)** → **F đúng**.
</details>

---

### Question 24 (Câu 24)
**What statements about the following class definition are true? (Choose all that apply.)**

```java
public final class TicketManager {
   private int tickets;
   private static TicketManager instance;
   private TicketManager() {}
   static synchronized TicketManager getInstance() {      // k1
      if (instance==null) instance = new TicketManager(); // k2
      return instance;
   }
 
   public int getTicketCount() { return tickets; }
   public void addTickets(int value) {tickets += value;}  // k3
   public void sellTickets(int value) {
      synchronized (this) {                               // k4
         tickets -= value;
      } } }
```

* A. It compiles without issue.
* B. The code will not compile because of line `k2`.
* C. The code will not compile because of line `k3`.
* D. The locks acquired on `k1` and `k4` are on the same object.
* E. The class correctly protects the `tickets` data from race conditions.
* F. At most one instance of `TicketManager` will be created in an application that uses this class.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The class compiles without issue, so option A is correct. Since `getInstance()` is a `static` method and `sellTickets()` is an instance method, lines `k1` and `k4` synchronize on different objects, making option D incorrect. The class is not thread-safe because the `addTickets()` method is not `synchronized`, and option E is incorrect. One thread could call `sellTickets()` while another thread calls `addTickets()`, possibly resulting in bad data. Finally, option F is correct because the `getInstance()` method is `synchronized`. Since the constructor is `private`, this method is the only way to create an instance of `TicketManager` outside the class. The first thread to enter the method will set the `instance` variable, and all other threads will use the existing value. This is a singleton pattern.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Lớp biên dịch hoàn toàn hợp lệ → **A đúng**, B và C sai.
    * Dòng k1 là phương thức `static synchronized`, nó sử dụng khóa trên đối tượng lớp: **`TicketManager.class`**. Dòng k4 đồng bộ hóa trên đối tượng thực thể: **`this`**. Hai khóa này là hai đối tượng hoàn toàn khác nhau → D sai.
    * Phương thức `addTickets()` ở dòng k3 **không hề được đồng bộ hóa** (không có `synchronized`). Một luồng có thể gọi `sellTickets()` trong khi luồng khác gọi `addTickets()`, dẫn đến xung đột dữ liệu → Lớp không an toàn đa luồng → E sai.
    * Vì hàm dựng là `private` và phương thức `getInstance()` được đồng bộ hóa tĩnh (`static synchronized`), luồng đầu tiên truy cập sẽ khởi tạo `instance`, các luồng sau sẽ dùng chung thể hiện đó (mô hình Singleton an toàn) → Tối đa chỉ có 1 instance được tạo → **F đúng**.
</details>

---

### Question 25 (Câu 25)
**Assuming an implementation of the `performCount()` method is provided prior to runtime, which of the following are possible results of executing the following application? (Choose all that apply.)**

```java
import java.util.*;
import java.util.concurrent.*;
public class CountZooAnimals {
   public static void performCount(int animal) {
      // IMPLEMENTATION OMITTED
   }
   public static void printResults(Future<?> f) {
      try {
         System.out.println(f.get(1, TimeUnit.DAYS)); // o1
      } catch (Exception e) {
         System.out.println("Exception!");
      }
   }
   public static void main(String[] args) throws Exception {
      final var r = new ArrayList<Future<?>>();
      try (var s = Executors.newSingleThreadExecutor()) {
         for (int i = 0; i < 10; i++) {
            final int animal = i;
            r.add(s.submit(() -> performCount(animal))); // o2
         }
         r.forEach(f -> printResults(f));
      }
   } }
```

* A. It outputs a number 10 times.
* B. It outputs a Boolean value 10 times.
* C. It outputs a `null` value 10 times.
* D. It outputs `Exception!` 10 times.
* E. The code will not compile because of line `o1`.
* F. The code will not compile because of line `o2`.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles and runs without issue, so options F and G are incorrect. The return type of `performCount()` is `void`, so `submit()` is interpreted as being applied to a `Runnable` expression. While `submit(Runnable)` does return a `Future<?>`, calling `get()` on it always returns `null`. For this reason, options A and B are incorrect, and option C is correct. The `performCount()` method can also throw a runtime exception, which will then be thrown by the `get()` call as an `ExecutionException`; therefore, option D is also a correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Phương thức `performCount(int)` có kiểu trả về là `void`.
    * Khi truyền biểu thức Lambda `() -> performCount(animal)` vào `s.submit()`, compiler hiểu đây là một **`Runnable`**.
    * Khi gửi một `Runnable` vào `submit()`, kiểu trả về là `Future<?>`. Gọi phương thức `.get()` trên `Future` của Runnable luôn luôn trả về **`null`** khi hoàn thành thành công. Do đó nếu các tác vụ đều chạy bình thường, chương trình sẽ in ra `null` 10 lần → **C đúng**, A và B sai.
    * Nếu phần thân của `performCount()` ném ra một Runtime Exception trong mỗi lần gọi, lệnh `f.get()` sẽ bọc exception đó trong một `ExecutionException` và ném ra, bị bắt bởi khối `catch` và in ra `Exception!` 10 lần → **D đúng**.
    * Cả hai dòng o1 và o2 đều biên dịch hoàn toàn hợp lệ → E và F sai.
</details>
