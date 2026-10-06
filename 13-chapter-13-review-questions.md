# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chapter 13: Concurrency

> **Nguồn trích dẫn:** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Trang 1182–1196).  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết từ Appendix B (Trang 1403–1410).  
> **Cách học:** Bạn hãy tự đọc đề và suy luận đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và khắc sâu các bẫy thi của Oracle.

---

### Câu 1 (Question 1)
**Cho đoạn mã sau, những lựa chọn nào sau đây tạo ra một parallel stream một cách chính xác? (Chọn tất cả các đáp án đúng.)**

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
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D, F**
* **Phân tích chi tiết:**
  * Trong Java API, **không hề tồn tại** lớp nào tên là `ParallelStream` $\rightarrow$ Loại A và E.
  * Đối với một đối tượng thuộc họ `Collection` (như `List`, `Set`), phương thức để tạo parallel stream là **`collection.parallelStream()`** $\rightarrow$ **D đúng**. (Phương thức `.parallel()` không nằm trên interface `Collection` $\rightarrow$ B sai).
  * Đối với một đối tượng đã là `Stream` hoặc primitive stream (như `DoubleStream` trả về từ `doubles()`), phương thức chuyển đổi sang stream song song là **`stream.parallel()`** $\rightarrow$ **F đúng**. (Phương thức `parallelStream()` không tồn tại trên interface `Stream` $\rightarrow$ C sai).
</details>

---

### Câu 2 (Question 2)
**Biết rằng tổng các số từ 1 (bao gồm) đến 10 (không bao gồm) là 45. Những kết quả nào sau đây có thể xảy ra khi thực thi chương trình sau? (Chọn tất cả các đáp án đúng.)**

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

* A. In ra 45.
* B. In ra một số nhỏ hơn 45.
* C. In ra một số lớn hơn 45.
* D. Ném ngoại lệ (Exception) lúc runtime.
* E. Không có đáp án nào ở trên vì mã nguồn không biên dịch.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, D**
* **Phân tích chi tiết (Bẫy thi `tryLock()` kinh điển!):**
  * Phương thức `vault.tryLock()` là phương thức không chặn (non-blocking): Nó thử lấy khóa, nếu khóa đã bị luồng khác giữ, nó lập tức trả về `false` mà **không chờ đợi**.
  * Ở dòng 8, mã nguồn **không kiểm tra giá trị boolean trả về** từ `tryLock()`. Do đó, ngay cả khi không lấy được khóa, luồng vẫn lao vào thực thi dòng 9 và sau đó nhảy vào khối `finally` ở dòng 10.
  * Khi luồng không nắm giữ khóa mà lại gọi `vault.unlock()`, máy ảo JVM sẽ ném ngay lập tức ngoại lệ **`IllegalMonitorStateException`** lúc runtime $\rightarrow$ **D đúng**.
  * Trong một số lần chạy hiếm hoi (khi các luồng không hề xung đột thời gian và mỗi lần gọi `tryLock()` đều may mắn trả về `true`), toàn bộ 9 số sẽ được cộng thành công và in ra **45** $\rightarrow$ **A đúng**.
  * Lựa chọn B không thể xảy ra vì nếu có luồng thất bại khi lấy khóa thì ngoại lệ ở dòng 10 đã làm gián đoạn chương trình trước khi kịp in ra tổng cuối cùng.
</details>

---

### Câu 3 (Question 3)
**Những phát biểu nào sau đây về phương thức `call()` của `Callable` và `run()` của `Runnable` là đúng? (Chọn tất cả các đáp án đúng.)**

* A. Cả hai phương thức đều trả về `void`.
* B. Cả hai phương thức đều có thể ném Unchecked Exception.
* C. Cả hai đều có thể được triển khai bằng biểu thức Lambda.
* D. `Runnable` trả về một kiểu generic.
* E. Cả hai đều có thể ném Checked Exception.
* F. `Callable` trả về một kiểu generic.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, C, F**
* **Phân tích chi tiết:**
  * Chữ ký phương thức:
    * `Runnable`: `public void run()`
    * `Callable<V>`: `public V call() throws Exception`
  * `Runnable` trả về `void`, còn `Callable` trả về kiểu dữ liệu generic `V` $\rightarrow$ **F đúng**, A và D sai.
  * Mọi phương thức trong Java đều có thể ném Unchecked Exception (Runtime Exception) $\rightarrow$ **B đúng**.
  * Chỉ có `Callable` mới khai báo `throws Exception` (Checked Exception); `Runnable` không thể ném checked exception $\rightarrow$ E sai.
  * Cả hai đều là Functional Interface (có đúng 1 phương thức trừu tượng) nên đều có thể dùng với biểu thức Lambda $\rightarrow$ **C đúng**.
</details>

---

### Câu 4 (Question 4)
**Những dòng mã nào cần phải thay đổi để đoạn code sau có thể biên dịch thành công?**

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

* A. Chỉ dòng w1.
* B. Chỉ dòng w2.
* C. Chỉ dòng w3.
* D. Dòng w1 và dòng w2.
* E. Dòng w2 và dòng w3.
* F. Dòng w1 và dòng w3.
* G. Không có dòng nào; mã nguồn tự biên dịch thành công.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Phân tích chi tiết:**
  * **Lỗi 1 (Dòng w1):** `Executors.newSingleThreadScheduledExecutor()` trả về một `ScheduledExecutorService`. Tuy nhiên, biến được gán lại có kiểu tham chiếu là `ExecutorService`. Interface cha `ExecutorService` **không có** phương thức `scheduleWithFixedDelay()`. Do đó dòng w1 phải sửa kiểu biến thành `ScheduledExecutorService` (hoặc dùng `var service = ...`).
  * **Lỗi 2 (Dòng w2):** Phương thức `scheduleWithFixedDelay()` chỉ chấp nhận tham số là một **`Runnable`**, không hỗ trợ `Callable`. Một biểu thức Lambda kiểu Runnable không được phép trả về giá trị (`return null;` là không hợp lệ trong Runnable lambda). Cần xóa bỏ dòng `return null;`.
  * Dòng w3 hợp lệ vì `submit(Runnable)` có sẵn trên `ExecutorService`.
  * Do đó, hai dòng cần sửa là **w1 và w2** $\rightarrow$ **D đúng**.
</details>

---

### Câu 5 (Question 5)
**Phát biểu nào sau đây là đúng về đoạn mã sau?**

```java
var value1 = new AtomicLong(0);
final long[] value2 = {0};
IntStream.iterate(1, i -> 1).limit(100).parallel()
   .forEach(i -> value1.incrementAndGet());
IntStream.iterate(1, i -> 1).limit(100).parallel()
   .forEach(i -> ++value2[0]);
System.out.println(value1 + " " + value2[0]);
```

* A. Đoạn mã in ra `100 100`.
* B. Đoạn mã in ra `100 99`.
* C. Giá trị in ra không thể xác định trước được lúc chạy.
* D. Đoạn mã không biên dịch.
* E. Đoạn mã biên dịch nhưng ném ngoại lệ lúc runtime.
* F. Đoạn mã biên dịch nhưng rơi vào vòng lặp vô tận lúc runtime.
* G. Không có đáp án nào ở trên.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Phân tích chi tiết:**
  * Đoạn mã biên dịch và chạy bình thường không ném lỗi hay lặp vô tận $\rightarrow$ D, E, F sai.
  * Biến `value1` là đối tượng `AtomicLong`. Phương thức `incrementAndGet()` thực hiện thao tác tăng nguyên tử trên phần cứng (CAS), đảm bảo an toàn tuyệt đối khi chạy song song qua 100 phần tử $\rightarrow$ `value1` chắc chắn luôn bằng **100**.
  * Tuy nhiên, `++value2[0]` là một toán tử tăng không nguyên tử (non-atomic). Khi 100 tác vụ song song cùng đọc - tăng - ghi đè lên phần tử mảng `value2[0]`, sẽ xảy ra hiện tượng **Lost Update (xung đột dữ liệu / race condition)**.
  * Kết quả của `value2[0]` sẽ là một số ngẫu nhiên dao động từ 1 đến 100, không thể đoán trước được $\rightarrow$ **C đúng**.
</details>

---

### Câu 6 (Question 6)
**Những phát biểu nào về đoạn mã sau đây là đúng? (Chọn tất cả các đáp án đúng.)**

```java
var data = List.of(2, 5, 1, 9, 8);
data.stream().parallel()
   .mapToInt(s -> s)
   .peek(System.out::print)
   .forEachOrdered(System.out::print);
```

* A. Phương thức `peek()` sẽ in các phần tử theo thứ tự đã sắp xếp: `12589`.
* B. Phương thức `peek()` sẽ in các phần tử theo thứ tự ban đầu: `25198`.
* C. Phương thức `peek()` sẽ in các phần tử theo thứ tự không thể xác định trước.
* D. Phương thức `forEachOrdered()` sẽ in các phần tử theo thứ tự đã sắp xếp: `12589`.
* E. Phương thức `forEachOrdered()` sẽ in các phần tử theo thứ tự ban đầu: `25198`.
* F. Phương thức `forEachOrdered()` sẽ in các phần tử theo thứ tự không thể xác định trước.
* G. Đoạn mã không biên dịch.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, E**
* **Phân tích chi tiết:**
  * Đoạn stream được chuyển sang song song bằng `.parallel()`.
  * Phương thức `peek()` là một thao tác trung gian được thực thi song song độc lập trên các luồng con, do đó thứ tự in của `peek()` là **hoàn toàn ngẫu nhiên và không thể đoán trước** $\rightarrow$ **C đúng**, A và B sai.
  * Phương thức kết thúc `forEachOrdered()` có nhiệm vụ ép buộc việc xử lý và xuất kết quả theo **đúng thứ tự gốc của stream** (encounter order), tức thứ tự ban đầu trong danh sách `List.of(2, 5, 1, 9, 8)` là `25198` $\rightarrow$ **E đúng**, D và F sai (lưu ý stream không hề gọi `.sorted()`).
</details>

---

### Câu 7 (Question 7)
**Điền vào chỗ trống: __________ xảy ra khi hai hoặc nhiều luồng bị chặn vĩnh viễn nhưng cả hai đều xuất hiện như đang hoạt động. _______ xảy ra khi hai hoặc nhiều luồng cố gắng hoàn thành một nhiệm vụ liên quan cùng một lúc, dẫn đến dữ liệu không hợp lệ hoặc không mong muốn.**

* A. Livelock, Deadlock
* B. Deadlock, Starvation
* C. Race conditions, Deadlock
* D. Livelock, Race conditions
* E. Starvation, Race conditions
* F. Deadlock, Livelock

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Phân tích chi tiết:**
  * **Livelock (Tắc nghẽn động):** Các luồng liên tục hoạt động (active, không bị BLOCKED) và phản ứng với nhau nhưng không bao giờ đạt được tiến triển công việc (bị kẹt vĩnh viễn về mặt logic).
  * **Race condition (Xung đột dữ liệu):** Xảy ra khi nhiều luồng truy cập và sửa đổi dữ liệu chung đồng thời mà thiếu đồng bộ, dẫn đến dữ liệu bị sai lệch hoặc không nhất quán.
  * Do đó cặp khái niệm chính xác là **Livelock và Race conditions** $\rightarrow$ **D đúng**.
</details>

---

### Câu 8 (Question 8)
**Giả sử lớp này chỉ được truy cập bởi một luồng duy nhất tại một thời điểm, kết quả của việc gọi phương thức `countIceCreamFlavors()` là gì?**

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

* A. Phương thức luôn luôn in ra một số nhỏ hơn 500.
* B. Phương thức luôn luôn in ra 500.
* C. Phương thức biên dịch và in ra một giá trị, nhưng giá trị đó không thể đoán trước được.
* D. Phương thức không biên dịch.
* E. Phương thức biên dịch nhưng ném ngoại lệ lúc runtime.
* F. Không có đáp án nào ở trên.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Phân tích chi tiết (Bẫy thi `run()` vs. `start()`):**
  * Hãy quan sát kỹ dòng gọi thực thi:
    `.unstarted(task).run()`
  * Trong Java, gọi phương thức **`run()`** trực tiếp trên một đối tượng `Thread` sẽ thực thi phương thức đó một cách **tuần tự (synchronous) ngay trên luồng hiện tại**, chứ **KHÔNG HỀ** khởi chạy một luồng mới chạy ngầm! (Muốn chạy đa luồng thì phải gọi `.start()`).
  * Vì `LongStream.range(0, 500)` là một sequential stream (không gọi `.parallel()`), 500 lần lặp sẽ lần lượt gọi `task.run()` nối tiếp nhau trên luồng chính, tăng biến `counter` từ 0 lên 500 mà không hề có xung đột dữ liệu.
  * Do đó, chương trình luôn luôn in ra chính xác **500** $\rightarrow$ **B đúng**.
</details>

---

### Câu 9 (Question 9)
**Những phát biểu nào sau đây là đúng về `ExecutorService`? (Chọn tất cả các đáp án đúng.)**

* A. Nếu một tác vụ được gửi đến khi không có luồng nào rảnh, executor sẽ hủy bỏ tác vụ đó mà không thực hiện.
* B. Nếu một tác vụ được gửi đến khi không có luồng nào rảnh, executor sẽ thêm tác vụ vào hàng đợi nội bộ và thực hiện khi có luồng rảnh.
* C. Nếu một tác vụ được gửi đến khi không có luồng nào rảnh, luồng gửi tác vụ sẽ bị chặn tại lệnh submit cho đến khi có luồng rảnh mới tiếp tục.
* D. Các Platform Thread có thể được đưa vào nhóm luồng (pooled) bằng `ExecutorService`, nhưng Virtual Thread thì không.
* E. Các Virtual Thread có thể được đưa vào nhóm luồng (pooled) bằng `ExecutorService`, nhưng Platform Thread thì không.
* F. Cả Platform Thread và Virtual Thread đều có thể được đưa vào nhóm luồng (pooled) bằng `ExecutorService`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, D**
* **Phân tích chi tiết:**
  * Khi các luồng trong Thread Pool đều đang bận, phương thức `submit()` hoặc `execute()` vẫn trả về ngay lập tức; tác vụ mới được lưu vào hàng đợi (BlockingQueue) nội bộ của executor để chờ luồng rảnh xử lý $\rightarrow$ **B đúng**, A và C sai.
  * Platform Thread có chi phí khởi tạo và bộ nhớ cao nên cần cơ chế gom nhóm (Thread Pool) để tái sử dụng luồng (`newFixedThreadPool`, `newCachedThreadPool`).
  * Virtual Thread siêu nhẹ (~vài KB), chi phí tạo mới không đáng kể và được thiết kế theo triết lý "mỗi tác vụ một luồng ảo", do đó chúng **không bao giờ được đưa vào pool** (như trong `Executors.newVirtualThreadPerTaskExecutor()`) $\rightarrow$ **D đúng**, E và F sai.
</details>

---

### Câu 10 (Question 10)
**Kết quả của việc thực thi đoạn mã sau là gì?**

```java
SequencedCollection<Integer> lions = new ArrayList<>(List.of(1, 2, 3));
SequencedCollection<Integer> tigers = new CopyOnWriteArrayList<>(lions);
Set<Integer> bears = new ConcurrentSkipListSet<>();
bears.addAll(lions);
for (Integer item: tigers) tigers.add(4); // x1
for (Integer item: bears) bears.add(5);   // x2
System.out.println(lions.size() + " " + tigers.size() + " " + bears.size());
```

* A. Đoạn mã in ra `3 6 4`.
* B. Đoạn mã in ra `6 6 6`.
* C. Đoạn mã in ra `6 3 4`.
* D. Đoạn mã không biên dịch.
* E. Đoạn mã biên dịch nhưng ném ngoại lệ lúc runtime tại dòng x1.
* F. Đoạn mã biên dịch nhưng ném ngoại lệ lúc runtime tại dòng x2.
* G. Đoạn mã biên dịch nhưng rơi vào vòng lặp vô tận lúc runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Phân tích chi tiết:**
  * Đoạn mã biên dịch hoàn toàn hợp lệ từ Java 21 (sử dụng interface `SequencedCollection`) $\rightarrow$ D sai.
  * **Vòng lặp x1 trên `tigers` (`CopyOnWriteArrayList`):**
    * Ban đầu có 3 phần tử `[1, 2, 3]`.
    * Khi bắt đầu duyệt, Iterator chụp một bản snapshot gồm đúng 3 phần tử ban đầu. Vòng lặp chạy đúng 3 lần. Mỗi lần thêm một số 4 vào danh sách thực tế.
    * Kích thước của `tigers` sau vòng lặp là $3 + 3 = 6$.
  * **Vòng lặp x2 trên `bears` (`ConcurrentSkipListSet`):**
    * Ban đầu chứa 3 phần tử `[1, 2, 3]`.
    * Vòng lặp duyệt qua các phần tử và gọi `bears.add(5)`. Vì `bears` là một `Set` (tập hợp không chứa phần tử trùng lặp), số 5 chỉ được thêm vào một lần duy nhất dù `add(5)` được gọi nhiều lần.
    * Kích thước của `bears` sau vòng lặp là $3 + 1 = 4$.
  * Danh sách gốc `lions` hoàn toàn độc lập nên kích thước vẫn là 3.
  * Kết quả in ra là `3 6 4` $\rightarrow$ **A đúng**.
</details>

---

### Câu 11 (Question 11)
**Phát biểu nào sau đây là đúng về đoạn mã sau?**

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

* A. Giá trị đầu tiên được in ra luôn luôn là 1.
* B. Giá trị thứ hai được in ra luôn luôn là 6.
* C. Đoạn mã không biên dịch vì dòng y1.
* D. Đoạn mã không biên dịch vì dòng y2.
* E. Đoạn mã biên dịch nhưng ném ngoại lệ lúc runtime.
* F. Đầu ra không thể xác định trước được.
* G. Đoạn mã biên dịch nhưng chờ đợi vô hạn lúc runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F**
* **Phân tích chi tiết:**
  * Đoạn mã biên dịch và chạy bình thường $\rightarrow$ Loại C, D, E, G.
  * Khối `synchronized(i1)` chỉ khóa trên đối tượng `i1`, hoàn toàn không ảnh hưởng đến việc xử lý stream bên trong.
  * Phương thức **`findAny()`** trên stream (kể cả serial stream hay parallel stream) có quyền trả về **bất kỳ phần tử nào** mà luồng đầu tiên tìm thấy, không có bất kỳ cam kết nào về việc phải trả về phần tử đầu tiên (muốn chắc chắn phần tử đầu tiên phải dùng `findFirst()`).
  * Gọi `.sorted()` trên parallel stream cũng không ép `findAny()` phải trả về phần tử nhỏ nhất `6`.
  * Do đó, cả `i1` và `i2` đều là các giá trị ngẫu nhiên trong danh sách của chúng $\rightarrow$ Đầu ra không thể xác định trước $\rightarrow$ **F đúng**.
</details>

---

### Câu 12 (Question 12)
**Giả sử mỗi lần gọi `takeNap()` mất 5 giây để thực thi mà không ném ngoại lệ. Kết quả mong đợi khi thực thi đoạn mã sau là gì? (Chọn tất cả các đáp án đúng.)**

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

* A. `shutdown()` sẽ dừng chờ khoảng 2 giây rồi in `DONE!`.
* B. `shutdown()` sẽ dừng chờ khoảng 5 giây rồi in `DONE!`.
* C. `shutdown()` sẽ dừng chờ khoảng 15 giây rồi in `DONE!`.
* D. `refactored()` sẽ dừng chờ khoảng 2 giây rồi in `DONE!`.
* E. `refactored()` sẽ dừng chờ khoảng 5 giây rồi in `DONE!`.
* F. `refactored()` sẽ dừng chờ khoảng 15 giây rồi in `DONE!`.
* G. Một trong hai phương thức trả về kết quả ngay lập tức.
* H. Một trong hai phương thức ném ngoại lệ.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, E**
* **Phân tích chi tiết:**
  * **Với phương thức `shutdown()`:**
    * 3 tác vụ chạy trên nhóm 4 luồng nên chúng chạy song song cùng lúc (mỗi tác vụ mất 5 giây).
    * Lệnh `service.awaitTermination(2, TimeUnit.SECONDS)` chỉ chờ tối đa 2 giây. Sau 2 giây, dù các tác vụ chưa kết thúc, `awaitTermination()` vẫn trả về `false` và chương trình lập tức thực thi dòng tiếp theo để in `DONE!` $\rightarrow$ Mất khoảng **2 giây** $\rightarrow$ **A đúng**, B và C sai.
  * **Với phương thức `refactored()`:**
    * Phương thức sử dụng khối `try-with-resources` với `ExecutorService`.
    * Khi thoát khỏi khối `try`, phương thức `service.close()` được tự động gọi. Theo tài liệu đặc tả của Java 19+, `close()` sẽ phát lệnh `shutdown()` và **chờ đợi cho đến khi tất cả các tác vụ đang thực thi hoàn tất** (tương đương `awaitTermination` vô hạn).
    * Vì 3 tác vụ chạy song song trên 4 luồng và mất 5 giây, khối `try` sẽ chờ đúng 5 giây cho các tác vụ xong rồi mới in `DONE!` $\rightarrow$ Mất khoảng **5 giây** $\rightarrow$ **E đúng**, D và F sai.
</details>

---

### Câu 13 (Question 13)
**Phát biểu nào sau đây về đoạn mã sau là đúng?**

```java
System.out.print(List.of("duck","flamingo","pelican")
   .parallelStream().parallel()   // q1
   .reduce(0,
      (c1, c2) -> c1.length() + c2.length(),  // q2
      (s1, s2) -> s1 + s2));      // q3
```

* A. Đoạn mã biên dịch và chạy bình thường, in ra tổng độ dài của tất cả các chuỗi trong stream.
* B. Đoạn mã không biên dịch vì dòng q1.
* C. Đoạn mã không biên dịch vì dòng q2.
* D. Đoạn mã không biên dịch vì dòng q3.
* E. Đoạn mã biên dịch nhưng ném ngoại lệ lúc runtime.
* F. Không có đáp án nào ở trên.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Phân tích chi tiết (Bẫy kiểu dữ liệu của hàm `reduce()`):**
  * Phương thức `reduce(identity, accumulator, combiner)` có chữ ký:
    `<U> U reduce(U identity, BiFunction<U, ? super T, U> accumulator, BinaryOperator<U> combiner)`
  * Ở đây, `identity` là `0` (kiểu `Integer`), phần tử trong stream là kiểu `String` (`T = String`).
  * Do đó trong hàm `accumulator (c1, c2)`:
    * `c1` có kiểu là `Integer` (kiểu tích lũy `U`).
    * `c2` có kiểu là `String` (kiểu phần tử `T`).
  * Trên dòng q2, biểu thức lại viết `c1.length() + c2.length()`. Lớp `Integer` **không hề có phương thức `length()`**!
  * Trình biên dịch sẽ báo lỗi: `cannot find symbol: method length() on Integer` $\rightarrow$ Lỗi biên dịch tại **dòng q2 (Đáp án C)**.
  * (Lưu ý: Dòng q1 gọi `.parallel()` trên một stream đã song song là hoàn toàn hợp lệ).
</details>

---

### Câu 14 (Question 14)
**Những phát biểu nào sau đây về đoạn mã sau là đúng? (Chọn tất cả các đáp án đúng.)**

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

* A. Đoạn mã luôn luôn in `Tortoise` theo sau bởi `Hare`.
* B. Đoạn mã luôn luôn in `Hare` theo sau bởi `Tortoise`.
* C. Nếu đoạn mã có in ra bất kỳ điều gì, thứ tự in là không thể xác định trước.
* D. Đoạn mã không biên dịch.
* E. Đoạn mã biên dịch nhưng có thể tạo ra Deadlock lúc runtime.
* F. Đoạn mã biên dịch nhưng có thể tạo ra Livelock lúc runtime.
* G. Đoạn mã biên dịch nhưng ném ngoại lệ lúc runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, E**
* **Phân tích chi tiết:**
  * Hai tác vụ được gửi đồng thời vào nhóm 2 luồng. Tác vụ 1 yêu cầu khóa `o1` rồi đến `o2`. Tác vụ 2 yêu cầu khóa `o2` rồi đến `o1`.
  * Đây là ví dụ kinh điển về **Deadlock (Bế tắc)**: Nếu luồng 1 giành được khóa `o1` trong khi luồng 2 cùng lúc giành được khóa `o2`, cả hai luồng sẽ chờ nhau nhả khóa còn lại vô thời hạn $\rightarrow$ Chương trình bị treo (Deadlock) $\rightarrow$ **E đúng**.
  * Trong trường hợp một luồng chạy nhanh và giành được cả hai khóa trước luồng kia, luồng đó sẽ in trước. Do hai luồng chạy song song, thứ tự in (nếu có) là không thể xác định trước $\rightarrow$ **C đúng**.
  * Cả hai luồng bị kẹt ở trạng thái `BLOCKED` (chờ khóa) chứ không phải đang hoạt động liên tục thay đổi trạng thái, do đó đây không phải là Livelock $\rightarrow$ F sai. Khi Deadlock xảy ra, JVM không ném ngoại lệ $\rightarrow$ G sai.
</details>

---

### Câu 15 (Question 15)
**Phát biểu nào sau đây về đoạn mã sau là đúng?**

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

* A. Đoạn mã in ra `3 4`.
* B. Đoạn mã in ra `4 3`.
* C. Đoạn mã không biên dịch vì dòng 6.
* D. Đoạn mã không biên dịch vì dòng 7.
* E. Đoạn mã không biên dịch vì dòng 8.
* F. Đoạn mã biên dịch nhưng ném ngoại lệ lúc runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Phân tích chi tiết:**
  * Đoạn mã biên dịch và chạy song song hoàn toàn hợp lệ $\rightarrow$ C, D, E, F sai.
  * Phép gom nhóm `groupingByConcurrent` phân chia các chuỗi theo điều kiện:
    `s -> !s.startsWith("p")`
    * Nhóm có key là `false`: Nghĩa là `!s.startsWith("p") == false`, tương đương với các con vật **BẮT ĐẦU bằng chữ 'p'**: `"puma"`, `"panda"`, `"polar"`. Có tất cả **3** con vật.
    * Nhóm có key là `true`: Nghĩa là các con vật **KHÔNG bắt đầu bằng chữ 'p'**: `"leopard"`, `"lynx"`, `"ocelot"`, `"grizzly"`. Có tất cả **4** con vật.
  * Dòng 8 và 9 in `data.get(false).size()` theo sau bởi `data.get(true).size()` $\rightarrow$ In ra **`3 4`** $\rightarrow$ **A đúng**.
</details>

---

### Câu 16 (Question 16)
**Những API nào sau đây tồn tại để tạo hoặc làm việc với Platform Threads? (Chọn tất cả các đáp án đúng.)**

* A. `Executors.newCachedThreadPool()`
* B. `Executors.newPlatformThreadPool()`
* C. `Executors.newPlatformThreadPerTaskExecutor()`
* D. `new Thread()`
* E. `Thread.ofPlatform()`
* F. `Thread.ofPlatformThread()`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, D, E**
* **Phân tích chi tiết:**
  * Trong lớp `Executors`, hầu hết các phương thức factory truyền thống như `newCachedThreadPool()`, `newFixedThreadPool()`, `newSingleThreadExecutor()` đều tạo ra các Platform Thread $\rightarrow$ **A đúng**. (Không có phương thức nào tên là `newPlatformThreadPool()` hay `newPlatformThreadPerTaskExecutor()` $\rightarrow$ B và C sai).
  * Hàm dựng truyền thống `new Thread()` tạo ra một Platform Thread $\rightarrow$ **D đúng**.
  * Phương thức factory trong Java 21 là `Thread.ofPlatform()` trả về builder để cấu hình và tạo Platform Thread $\rightarrow$ **E đúng**. (Không có phương thức nào tên là `Thread.ofPlatformThread()` $\rightarrow$ F sai).
</details>

---

### Câu 17 (Question 17)
**Phát biểu nào sau đây về các phương thức trong `ReentrantLock` là đúng?**

* A. Phương thức `lock()` sẽ cố gắng lấy khóa mà không chờ đợi vô hạn.
* B. Phương thức `testLock()` sẽ cố gắng lấy khóa mà không chờ đợi vô hạn.
* C. Phương thức `attemptLock()` sẽ cố gắng lấy khóa mà không chờ đợi vô hạn.
* D. Mặc định, một `ReentrantLock` sẽ nhả khóa một cách công bằng (fairly) cho từng luồng theo đúng thứ tự yêu cầu.
* E. Gọi phương thức `unlock()` một lần duy nhất sẽ giải phóng tài nguyên để các luồng khác có thể giành được khóa.
* F. Không có phát biểu nào ở trên là đúng (None of the above).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F**
* **Phân tích chi tiết:**
  * `lock()` sẽ chặn luồng và chờ đợi vô thời hạn cho đến khi lấy được khóa $\rightarrow$ A sai.
  * Các phương thức tên `testLock()` hay `attemptLock()` không hề tồn tại trong Java (tên đúng là `tryLock()`) $\rightarrow$ B và C sai.
  * Mặc định, tính công bằng (fairness) của `ReentrantLock` là `false` (Non-fair lock để tối ưu thông lượng). Muốn kích hoạt fair lock phải gọi hàm tạo `new ReentrantLock(true)` $\rightarrow$ D sai.
  * Nếu một luồng đã gọi `lock()` hoặc `tryLock()` thành công $N$ lần (tính chất tái nhập - reentrancy), nó bắt buộc phải gọi `unlock()` đủ $N$ lần thì khóa mới thực sự được giải phóng hoàn toàn cho luồng khác $\rightarrow$ E sai.
  * Do đó, đáp án đúng là **F (None of the above)**.
</details>

---

### Câu 18 (Question 18)
**Những biểu thức Lambda nào sau đây là các biểu thức `Callable` hợp lệ? (Chọn tất cả các đáp án đúng.)**

* A. `a -> {return 10;}`
* B. `() -> {String s = "";}`
* C. `() -> 5`
* D. `() -> {return null}`
* E. `() -> "The" + "Zoo"`
* F. `(int count) -> count+1`
* G. `() -> {System.out.print("Giraffe"); return 10;}`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, E, G**
* **Phân tích chi tiết:**
  * Giao diện `Callable<V>` có phương thức duy nhất: `V call() throws Exception`.
  * Đặc điểm: **Không nhận tham số đầu vào `()`** và **bắt buộc phải trả về một giá trị**.
  * A và F nhận tham số đầu vào (`a -> ...` và `(int count) -> ...`) $\rightarrow$ Sai cú pháp Callable.
  * B có thân hàm rỗng không trả về giá trị (tương đương `void`, là Runnable) $\rightarrow$ Sai.
  * D thiếu dấu chấm phẩy `;` sau `return null` bên trong khối `{}` $\rightarrow$ Lỗi cú pháp biên dịch.
  * C (`() -> 5`), E (`() -> "The" + "Zoo"`), và G (`() -> { ... return 10;}`) đều không nhận tham số và trả về giá trị hợp lệ $\rightarrow$ **C, E, G đúng**.
</details>

---

### Câu 19 (Question 19)
**Kết quả của việc thực thi ứng dụng sau là gì? (Chọn tất cả các đáp án đúng.)**

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

* A. Đoạn mã biên dịch và in ra 2 số theo sau bởi chữ `Printed`.
* B. Đoạn mã không biên dịch vì dòng b1.
* C. Đoạn mã không biên dịch vì dòng b2.
* D. Đoạn mã không biên dịch vì dòng b3.
* E. Đoạn mã biên dịch, nhưng đầu ra không thể xác định trước được.
* F. Đoạn mã biên dịch nhưng ném ngoại lệ lúc runtime.
* G. Đoạn mã biên dịch nhưng chờ đợi mãi mãi lúc runtime (không bao giờ kết thúc).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E, G**
* **Phân tích chi tiết:**
  * Đoạn mã biên dịch hoàn toàn hợp lệ $\rightarrow$ B, C, D sai.
  * Dù `DoubleStream` là tuần tự, nhưng các tác vụ in được gửi vào `ExecutorService` để chạy trên các luồng ảo song song độc lập. Các tác vụ này có thể hoàn thành theo bất kỳ thứ tự nào, do đó đầu ra không thể đoán trước $\rightarrow$ **E đúng**, A sai.
  * **Điểm mấu chốt thứ hai:** Đối tượng `ExecutorService` được tạo ra nhưng **không hề được gọi lệnh `shutdown()`** và cũng không nằm trong khối `try-with-resources`. Do đó, JVM duy trì executor và tiến trình sẽ chạy mãi mãi mà **không bao giờ tự kết thúc** $\rightarrow$ **G đúng**.
</details>

---

### Câu 20 (Question 20)
**Kết quả của việc thực thi chương trình sau là gì?**

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

* A. In ra `0 1 2 3 4`.
* B. In ra `1 2 3 4 5`.
* C. In ra `null null null null null`.
* D. Chương trình bị treo vô hạn lúc runtime.
* E. Đầu ra không thể xác định trước được.
* F. Đoạn mã không biên dịch vì dòng n1.
* G. Đoạn mã không biên dịch vì dòng n2.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F**
* **Phân tích chi tiết (Bẫy kiểu trả về của `execute()`):**
  * Phương thức **`service.execute(Runnable)`** có kiểu trả về là **`void`**.
  * Tại dòng n1: `r.add(service.execute(...))`. Danh sách `r` là một `ArrayList<Future<?>>`. Bạn không thể truyền giá trị `void` vào phương thức `add()` của một danh sách!
  * Trình biên dịch sẽ báo lỗi: `'void' type not allowed here` $\rightarrow$ Lỗi biên dịch tại **dòng n1 (Đáp án F)**.
  * (Nếu dòng n1 đổi thành `service.submit(...)`, mã nguồn sẽ biên dịch thành công và in ra `null null null null null` vì `submit(Runnable)` trả về `Future<?>` và gọi `.get()` trên đó luôn trả về `null`).
</details>

---

### Câu 21 (Question 21)
**Cho đoạn mã sau với hai chỗ trống tại p1 và p2. Những giá trị nào đảm bảo rằng số 1 chắc chắn sẽ được in ra lúc runtime? (Chọn tất cả các đáp án đúng.)**

```java
var data = List.of(List.of(1, 2),
   List.of(3, 4),
   List.of(5, 6));
data._______________  // p1
   .flatMap(s -> s.stream())
   .________________  // p2
   .ifPresent(System.out::print);
```

* A. `stream()` trên dòng p1, `findFirst()` trên dòng p2.
* B. `stream()` trên dòng p1, `findAny()` trên dòng p2.
* C. `parallelStream()` trên dòng p1, `findAny()` trên dòng p2.
* D. `parallelStream()` trên dòng p1, `findFirst()` trên dòng p2.
* E. Đoạn mã không biên dịch bất kể điền giá trị nào vào chỗ trống.
* F. Không có đáp án nào ở trên.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, D**
* **Phân tích chi tiết:**
  * Phương thức **`findFirst()`** được đặc tả để **luôn luôn đảm bảo trả về phần tử đầu tiên** theo thứ tự xuất hiện của stream, bất kể stream đó là tuần tự (`stream()`) hay song song (`parallelStream()`) $\rightarrow$ **A và D đúng**.
  * Ngược lại, phương thức **`findAny()`** không cam kết trả về phần tử đầu tiên (đặc biệt trên parallel stream nó trả về phần tử của luồng nào hoàn thành trước ngẫu nhiên) $\rightarrow$ B và C sai.
</details>

---

### Câu 22 (Question 22)
**Giả sử một phút là đủ thời gian để các tác vụ gửi đến service hoàn thành. Kết quả của việc thực thi `countSheep()` là gì?**

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

* A. Phương thức luôn luôn in ra `100 99`.
* B. Phương thức luôn luôn in ra `100 100`.
* C. Đầu ra không thể xác định trước được.
* D. Đoạn mã không biên dịch vì dòng w1.
* E. Đoạn mã không biên dịch vì dòng w2.
* F. Đoạn mã không biên dịch vì dòng w3.
* G. Đoạn mã biên dịch nhưng ném ngoại lệ lúc runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Phân tích chi tiết:**
  * Điểm mấu chốt của bài toán nằm ở dòng w2:
    `Executors.newSingleThreadExecutor()`
  * Executor này **chỉ có duy nhất một luồng thực thi**. Tất cả 100 tác vụ được xếp hàng đợi và chạy **lần lượt tuần tự từng tác vụ một**, hoàn toàn không có hai tác vụ nào chạy đồng thời!
  * Do không có sự can thiệp đồng thời giữa các luồng, biến nguyên thủy `s2++` không hề bị xung đột dữ liệu (no race conditions).
  * Cả `s1` và `s2` đều được tăng chính xác 100 lần $\rightarrow$ Chương trình luôn luôn in ra kết quả nhất quán là **`100 100`** $\rightarrow$ **B đúng**.
  * (Lưu ý: Nếu ở đây dùng pool nhiều luồng như `newFixedThreadPool(4)`, thì `s2` sẽ bị race condition và đáp án khi đó mới là C).
</details>

---

### Câu 23 (Question 23)
**Kết quả của việc thực thi ứng dụng sau là gì?**

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

* A. Đoạn mã in ra `Stock Room Full!`.
* B. Đoạn mã không biên dịch vì dòng j1.
* C. Đoạn mã không biên dịch vì dòng j2.
* D. Đoạn mã không biên dịch vì dòng j3.
* E. Đoạn mã biên dịch nhưng ném ngoại lệ lúc runtime.
* F. Đoạn mã biên dịch nhưng chờ đợi mãi mãi lúc runtime (bị treo).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F**
* **Phân tích chi tiết (Bẫy giới hạn của `CyclicBarrier`):**
  * Đối tượng `CyclicBarrier` được khởi tạo với giới hạn là **10** luồng: `new CyclicBarrier(10, ...)`. Nghĩa là rào chắn chỉ mở khi có đủ 10 luồng cùng gọi `await()`.
  * Tuy nhiên, dòng j3 giới hạn stream chỉ tạo ra tối đa **9** phần tử (`limit(9)`). Do đó, chỉ có tối đa 9 lần gọi `cb.await()`.
  * Rào chắn không bao giờ nhận đủ 10 luồng tập kết, khiến cả 9 luồng đều rơi vào trạng thái chờ vô thời hạn $\rightarrow$ Chương trình bị **treo vĩnh viễn (waits forever / hang)** $\rightarrow$ **F đúng**.
</details>

---

### Câu 24 (Question 24)
**Những phát biểu nào sau đây về định nghĩa lớp sau là đúng? (Chọn tất cả các đáp án đúng.)**

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

* A. Lớp biên dịch hoàn toàn bình thường.
* B. Lớp không biên dịch vì dòng k2.
* C. Lớp không biên dịch vì dòng k3.
* D. Các khóa được chiếm giữ tại k1 và k4 là trên cùng một đối tượng.
* E. Lớp này bảo vệ dữ liệu `tickets` an toàn khỏi các xung đột dữ liệu (race conditions).
* F. Tối đa chỉ có một thể hiện của `TicketManager` được tạo ra trong một ứng dụng sử dụng lớp này.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, F**
* **Phân tích chi tiết:**
  * Lớp biên dịch hoàn toàn hợp lệ $\rightarrow$ **A đúng**, B và C sai.
  * Dòng k1 là phương thức `static synchronized`, nó sử dụng khóa trên đối tượng lớp: **`TicketManager.class`**. Dòng k4 đồng bộ hóa trên đối tượng thực thể: **`this`**. Hai khóa này là hai đối tượng hoàn toàn khác nhau $\rightarrow$ D sai.
  * Phương thức `addTickets()` ở dòng k3 **không hề được đồng bộ hóa** (không có `synchronized`). Một luồng có thể gọi `sellTickets()` trong khi luồng khác gọi `addTickets()`, dẫn đến xung đột dữ liệu $\rightarrow$ Lớp không an toàn đa luồng $\rightarrow$ E sai.
  * Vì hàm dựng là `private` và phương thức `getInstance()` được đồng bộ hóa tĩnh (`static synchronized`), luồng đầu tiên truy cập sẽ khởi tạo `instance`, các luồng sau sẽ dùng chung thể hiện đó (mô hình Singleton an toàn) $\rightarrow$ Tối đa chỉ có 1 instance được tạo $\rightarrow$ **F đúng**.
</details>

---

### Câu 25 (Question 25)
**Giả sử phương thức `performCount()` đã có cài đặt hoàn chỉnh trước khi chạy. Những kết quả nào sau đây có thể xảy ra khi thực thi ứng dụng sau? (Chọn tất cả các đáp án đúng.)**

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

* A. Đoạn mã in ra một số 10 lần.
* B. Đoạn mã in ra một giá trị Boolean 10 lần.
* C. Đoạn mã in ra giá trị `null` 10 lần.
* D. Đoạn mã in ra `Exception!` 10 lần.
* E. Đoạn mã không biên dịch vì dòng o1.
* F. Đoạn mã không biên dịch vì dòng o2.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, D**
* **Phân tích chi tiết:**
  * Phương thức `performCount(int)` có kiểu trả về là `void`.
  * Khi truyền biểu thức Lambda `() -> performCount(animal)` vào `s.submit()`, compiler hiểu đây là một **`Runnable`**.
  * Khi gửi một `Runnable` vào `submit()`, kiểu trả về là `Future<?>`. Gọi phương thức `.get()` trên `Future` của Runnable luôn luôn trả về **`null`** khi hoàn thành thành công. Do đó nếu các tác vụ đều chạy bình thường, chương trình sẽ in ra `null` 10 lần $\rightarrow$ **C đúng**, A và B sai.
  * Nếu phần thân của `performCount()` ném ra một Runtime Exception trong mỗi lần gọi, lệnh `f.get()` sẽ bọc exception đó trong một `ExecutionException` và ném ra, bị bắt bởi khối `catch` và in ra `Exception!` 10 lần $\rightarrow$ **D đúng**.
  * Cả hai dòng o1 và o2 đều biên dịch hoàn toàn hợp lệ $\rightarrow$ E và F sai.
</details>
