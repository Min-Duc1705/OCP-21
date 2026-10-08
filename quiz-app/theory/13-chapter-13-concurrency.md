# Hướng Dẫn Ôn Tập OCP Java SE 21 - Chương 13: Concurrency (Đa Luồng & Xử Lý Đồng Thời)

> **Trọng tâm bài thi Oracle Certified Professional Java SE 21 Developer (Exam 1Z0-830):**
> 1. Hiểu bản chất tiến trình (Process) và luồng (Thread); vòng đời của luồng (6 trạng thái `Thread.State`).
> 2. **Điểm mới cốt lõi của Java 21:** Phân biệt **Platform Threads** và **Virtual Threads** (Project Loom); cơ chế Carrier Threads; cách tạo luồng qua `Thread.ofPlatform()` và `Thread.ofVirtual()`.
> 3. Quản lý tác vụ với **Concurrency API** (`java.util.concurrent`): `ExecutorService`, `ScheduledExecutorService`, `Callable`, `Future`, và `Executors.newVirtualThreadPerTaskExecutor()`.
> 4. Quy trình đóng mở an toàn ExecutorService: `shutdown()`, `shutdownNow()`, `awaitTermination()`, và việc hỗ trợ `AutoCloseable` từ Java 19+.
> 5. Viết mã an toàn đa luồng (**Thread-Safety**): Các lớp biến nguyên tử (**Atomic Classes**), khối và phương thức đồng bộ hóa (**`synchronized`**), **Lock Framework** (`ReentrantLock`, `tryLock()`), và điều phối luồng với **`CyclicBarrier`**.
> 6. Sử dụng thành thạo các bộ sưu tập đồng thời (**Concurrent Collections**): `ConcurrentHashMap`, `CopyOnWriteArrayList`, `ConcurrentSkipListMap`, `LinkedBlockingQueue`, và Synchronized Wrappers.
> 7. Nhận diện 4 vấn đề nghiêm trọng trong đa luồng: **Deadlock**, **Starvation**, **Livelock**, và **Race Condition**.
> 8. Tối ưu hóa hiệu năng với **Parallel Streams**: Phân biệt `forEach()` vs `forEachOrdered()`, quy tắc hàm rút gọn song song (`reduce()` và `collect()`), `groupingByConcurrent()`.

---

## 1. Bản Chất Luồng & Điểm Mới Virtual Threads Trong Java 21

### Tiến Trình (Process) vs. Luồng (Thread)
* **Tiến trình (Process):** Là một thể hiện của chương trình đang chạy trên hệ điều hành, sở hữu không gian bộ nhớ riêng biệt. Hai tiến trình không chia sẻ trực tiếp bộ nhớ với nhau.
* **Luồng (Thread):** Là đơn vị thực thi nhỏ nhất bên trong một tiến trình. Các luồng trong cùng một tiến trình chia sẻ chung vùng nhớ Heap (các đối tượng được tạo ra), nhưng mỗi luồng có ngăn xếp gọi hàm (Call Stack) riêng biệt.

---

### Platform Threads vs. Virtual Threads (BẢNG SO SÁNH CỐT LÕI)

Trong Java truyền thống (trước Java 21), mỗi Java Thread là một **Platform Thread** (luồng nền tảng), tương ứng 1:1 với một luồng của Hệ điều hành (Kernel/OS Thread). Từ Java 21, **Virtual Threads** (Luồng ảo) chính thức trở thành tính năng chuẩn hóa của ngôn ngữ.

```
MÔ HÌNH PLATFORM THREADS (1:1 với OS):
[Java Platform Thread 1] <==== 1:1 ====> [OS Kernel Thread 1]
[Java Platform Thread 2] <==== 1:1 ====> [OS Kernel Thread 2]

MÔ HÌNH VIRTUAL THREADS (M:N qua Carrier Threads):
[Virtual Thread 1] --+
[Virtual Thread 2] --+===> [Carrier Thread A (OS Thread)]
[Virtual Thread 3] --+
[Virtual Thread 4] -------> [Carrier Thread B (OS Thread)]
```

* **Ẩn dụ "Phục vụ bàn" (Server) vs. "Quản gia riêng" (Butler):**
  * **Platform Thread giống như một "quản gia riêng":** Luôn túc trực bên một người, ngay cả khi người đó đang ngủ hoặc chờ đợi. Tốn kém tài nguyên nếu luồng bị chặn (blocked) chờ I/O.
  * **Virtual Thread giống như "nhân viên phục vụ tại nhà hàng":** Một nhân viên phục vụ (**Carrier Thread**) có thể phục vụ hàng chục bàn (**Virtual Threads**). Khi một bàn đang chờ món ăn nấu xong (chờ I/O, Database, Network), nhân viên phục vụ lập tức chuyển sang phục vụ bàn khác!

| Tiêu Chí So Sánh | Platform Thread (OS Thread) | Virtual Thread (Java 21) |
| :--- | :--- | :--- |
| **Bản chất** | Bao bọc trực tiếp 1:1 luồng của Hệ điều hành | Được quản lý hoàn toàn bởi JVM, chạy trên luồng nền (Carrier Thread) |
| **Chi phí bộ nhớ** | Nặng (~1MB stack cho mỗi luồng) | Siêu nhẹ (~vài KB stack) |
| **Số lượng tối đa** | Giới hạn (vài ngàn luồng là cạn RAM / ném `OutOfMemoryError`) | Hàng triệu luồng cùng lúc trên máy thông thường |
| **Thời gian khởi tạo** | Chậm (cần gọi System Call tới OS) | Cực nhanh (chỉ là đối tượng Java trong Heap) |
| **Phù hợp nhất với** | Tác vụ nặng tính toán CPU (CPU-bound) | Tác vụ chờ đợi I/O, Database, Web Requests (I/O-bound) |
| **Trạng thái Daemon** | Mặc định là **non-daemon** (có thể đổi) | **LUÔN LUÔN LÀ DAEMON THREAD** (không thể đổi!) |
| **Độ ưu tiên (Priority)**| Tùy chỉnh từ 1 đến 10 (`Thread.setPriority()`) | **Cố định là 5 (`NORM_PRIORITY`)** (gọi đổi không có tác dụng) |
| **Thread Pooling** | **Cần thiết** (`Executors.newFixedThreadPool`) | **KHÔNG BAO GIỜ POOL**; tạo mới mỗi khi có tác vụ |

---

### Khởi Tạo Luồng Trong Java 21 (TABLE 13.1)

Java 21 giới thiệu mẫu thiết kế Builder thông qua các factory method `Thread.ofPlatform()` và `Thread.ofVirtual()`:

```java
// 1. Tạo Platform Thread chạy ngay:
Thread p1 = Thread.ofPlatform().name("worker-1").start(runnable);

// 2. Tạo Virtual Thread chạy ngay:
Thread v1 = Thread.ofVirtual().name("v-worker-1").start(runnable);

// 3. Tạo Virtual Thread qua hàm static ngắn gọn:
Thread v2 = Thread.startVirtualThread(runnable);

// 4. Tạo đối tượng Thread nhưng CHƯA CHẠY (gọi .start() sau):
Thread v3 = Thread.ofVirtual().unstarted(runnable);
// ... làm việc khác ...
v3.start();

// 5. Cú pháp truyền thống (Legacy Platform Thread):
Thread legacy = new Thread(runnable);
legacy.start();
```

> [!CAUTION]
> **Bẫy thi cực kỳ quan trọng về Virtual Threads:**
> 1. Virtual Threads **luôn luôn là daemon threads**. Nếu bạn cố gắng gọi `.daemon(false)` trên `Thread.ofVirtual()`, JVM sẽ ném **`IllegalArgumentException`**!
> 2. Virtual Threads có độ ưu tiên cố định là **5 (`Thread.NORM_PRIORITY`)**. Nếu bạn gọi `.priority(10)` hoặc `thread.setPriority(10)`, JVM sẽ **bỏ qua mà không báo lỗi**, priority vẫn là 5.

---

### Vòng Đời Của Luồng (6 Trạng Thái `Thread.State`)

JVM định nghĩa 6 trạng thái trong enum `java.lang.Thread.State` (kiểm tra bằng `thread.getState()`):
1. **`NEW`:** Luồng vừa được khởi tạo bằng `new Thread()` hoặc `.unstarted()`, chưa gọi `start()`.
2. **`RUNNABLE`:** Luồng đã gọi `start()` và sẵn sàng chạy (hoặc đang chạy trên CPU).
3. **`BLOCKED`:** Luồng đang chờ để giành lấy một Monitor Lock (chờ vào khối `synchronized`).
4. **`WAITING`:** Luồng đang chờ vô thời hạn tín hiệu từ luồng khác (`Object.wait()`, `Thread.join()`, `LockSupport.park()`).
5. **`TIMED_WAITING`:** Luồng đang ngủ hoặc chờ có thời hạn (`Thread.sleep(ms)`, `Object.wait(ms)`, `Thread.join(ms)`).
6. **`TERMINATED`:** Luồng đã hoàn thành xong phương thức `run()` hoặc bị kết thúc do một Exception không được bắt.

```
       [ NEW ]
          | .start()
          v
   +-> [ RUNNABLE ] <--------------------------------+
   |      |        \                                 |
   |      |         \ sleep(), wait(t), join(t)      | Lock acquired /
   |      |          +--> [ TIMED_WAITING ] ---------+ Notified
   |      |         /                                |
   |      |        / wait(), join()                  |
   |      |       +-----> [ WAITING ] ---------------+
   |      |
   |      | Chờ khóa synchronized
   |      +-------------> [ BLOCKED ] ---------------+
   |
   +--- (Khi kết thúc run() / Exception) ---> [ TERMINATED ]
```

---

## 2. Quản Lý Đa Luồng Với Concurrency API (`ExecutorService`)

Tự tạo và quản lý `new Thread()` thủ công gây tốn kém chi phí khởi tạo, khó kiểm soát số lượng luồng và dễ làm sập ứng dụng. `ExecutorService` trừu tượng hóa việc quản lý luồng bằng các nhóm luồng (Thread Pools).

### Khởi Tạo ExecutorService (`java.util.concurrent.Executors`) (TABLE 13.8)
* **`Executors.newSingleThreadExecutor()`:** Tạo nhóm chỉ có 1 luồng duy nhất. Các tác vụ được xếp hàng đợi (Queue) không giới hạn và chạy tuần tự theo thứ tự gửi.
* **`Executors.newFixedThreadPool(int n)`:** Tạo nhóm có số lượng `n` luồng cố định. Khi tất cả các luồng bận, tác vụ mới sẽ chờ trong hàng đợi.
* **`Executors.newCachedThreadPool()`:** Tạo nhóm luồng linh hoạt: Tạo luồng mới khi cần và tái sử dụng các luồng rảnh rỗi (thu hồi luồng sau 60s không hoạt động). Thích hợp cho nhiều tác vụ ngắn.
* **`Executors.newVirtualThreadPerTaskExecutor()` (Java 21):** Mỗi tác vụ gửi vào sẽ khởi chạy trên một **Virtual Thread mới độc lập**. Không tái sử dụng luồng (vì virtual thread quá nhẹ, không cần pool).

---

### `Runnable` vs. `Callable`

| Đặc Điểm | `java.lang.Runnable` | `java.util.concurrent.Callable<V>` |
| :--- | :--- | :--- |
| **Phương thức khai báo** | `public void run()` | `public V call() throws Exception` |
| **Giá trị trả về** | `void` (không trả về kết quả) | Trả về kiểu dữ liệu generic `V` |
| **Ném ngoại lệ** | Không được ném Checked Exception | Được phép ném bất kỳ **Checked Exception** nào |
| **Giới thiệu từ bản** | Java 1.0 | Java 5.0 |

---

### Các Phương Thức Thực Thi Của `ExecutorService` (TABLE 13.3)

* **`void execute(Runnable)`:** Chạy tác vụ kiểu "bắn rồi quên" (fire-and-forget). Không trả về kết quả hay trạng thái.
* **`Future<?> submit(Runnable)`:** Gửi tác vụ Runnable và trả về đối tượng `Future`. Khi tác vụ xong, gọi `future.get()` sẽ trả về `null`.
* **`<T> Future<T> submit(Callable<T>)`:** Gửi tác vụ Callable và trả về `Future<T>` để nhận kết quả tính toán.
* **`invokeAll(Collection<Callable<T>>)`:** Thực thi đồng loạt tất cả các tác vụ và **chặn chờ cho đến khi TẤT CẢ hoàn thành**. Trả về `List<Future<T>>` theo đúng thứ tự truyền vào.
* **`invokeAny(Collection<Callable<T>>)`:** Thực thi đồng loạt và **chờ kết quả của tác vụ đầu tiên hoàn thành thành công**; tự động hủy (cancel) tất cả các tác vụ còn lại.

---

### Làm Việc Với `Future<V>` (TABLE 13.4)

* **`V get()`:** Lấy kết quả trả về. Phương thức này **sẽ chặn luồng hiện tại vô thời hạn** cho đến khi tác vụ hoàn thành. Ném `InterruptedException` hoặc `ExecutionException`.
* **`V get(long timeout, TimeUnit unit)`:** Chặn chờ kết quả trong một khoảng thời gian tối đa. Nếu hết thời gian mà chưa xong, ném **`TimeoutException`** (Checked Exception).
* **`boolean isDone()`:** Trả về `true` nếu tác vụ đã kết thúc (dù thành công, ném exception, hay bị cancel).
* **`boolean isCancelled()`:** Trả về `true` nếu tác vụ bị hủy trước khi hoàn tất.
* **`boolean cancel(boolean mayInterruptIfRunning)`:** Cố gắng hủy thực thi tác vụ.

---

### Lập Lịch Định Kỳ Với `ScheduledExecutorService` (TABLE 13.7)

* **`schedule(Callable/Runnable, delay, unit)`:** Chạy tác vụ một lần duy nhất sau khoảng thời gian `delay`.
* **`scheduleAtFixedRate(Runnable, initialDelay, period, unit)`:** Chạy lặp lại theo chu kỳ cố định `period`. Bắt đầu lần 2 sau `period` tính từ thời điểm **lần 1 BẮT ĐẦU** (không quan tâm lần 1 chạy mất bao lâu).
* **`scheduleWithFixedDelay(Runnable, initialDelay, delay, unit)`:** Chạy lặp lại với khoảng nghỉ cố định `delay` giữa các lần. Lần 2 chỉ bắt đầu sau khi **lần 1 KẾT THÚC** cộng thêm khoảng `delay`.

---

### Quy Trình Dừng ExecutorService An Toàn (TABLE 13.6)

Một lỗi rất phổ biến khiến ứng dụng Java chạy mãi không dừng là quên tắt ExecutorService (do nó duy trì các non-daemon platform threads).
* **`shutdown()`:** Không nhận thêm tác vụ mới; các tác vụ đang chạy hoặc đang chờ trong hàng đợi vẫn được tiếp tục thực thi cho đến khi hoàn tất.
* **`shutdownNow()`:** Cố gắng dừng ngay lập tức các tác vụ đang chạy (bằng `Thread.interrupt()`), hủy tất cả các tác vụ đang chờ trong hàng đợi và trả về danh sách `List<Runnable>` các tác vụ chưa chạy.
* **`isShutdown()`:** Trả về `true` ngay sau khi gọi `shutdown()` hoặc `shutdownNow()`.
* **`isTerminated()`:** Chỉ trả về `true` khi **toàn bộ** các tác vụ đã hoàn thành sau lệnh shutdown.
* **`awaitTermination(timeout, unit)`:** Chặn chờ tối đa một khoảng thời gian để toàn bộ tác vụ kết thúc.

> [!TIP]
> **Điểm mới từ Java 19/21:** `ExecutorService` hiện đã kế thừa **`AutoCloseable`**! Bạn có thể sử dụng `ExecutorService` bên trong khối **`try-with-resources`**:
> ```java
> try (var service = Executors.newVirtualThreadPerTaskExecutor()) {
>     service.submit(() -> System.out.println("Running task"));
> } // Tự động gọi service.close() -> thực hiện shutdown() và chờ tác vụ kết thúc!
> ```

---

## 3. Viết Mã An Toàn Đa Luồng (Thread-Safety)

Khi nhiều luồng cùng đọc và ghi lên một vùng nhớ chung mà không có sự đồng bộ, sẽ xảy ra lỗi **Race Condition (Xung đột dữ liệu)** dẫn đến giá trị bị sai lệch. Thao tác tưởng như đơn giản `count++` thực chất gồm 3 bước riêng biệt: Đọc giá trị $\rightarrow$ Tăng lên 1 $\rightarrow$ Ghi lại giá trị. Nếu hai luồng cùng đọc một giá trị, cả hai sẽ ghi đè lên nhau (Lost Update).

### 1. Các Lớp Biến Nguyên Tử (Atomic Classes) (TABLE 13.9 & 13.10)
Nằm trong package `java.util.concurrent.atomic`, sử dụng lệnh phần cứng ở mức CPU (Compare-And-Swap - CAS) để đảm bảo các thao tác đọc-ghi diễn ra nguyên tử (atomic), không thể bị ngắt quãng giữa chừng mà không cần khóa (lock-free):
* `AtomicBoolean`, `AtomicInteger`, `AtomicLong`, `AtomicReference<V>`.

*Các phương thức quan trọng:*
* `get()` / `set(newValue)`: Đọc và ghi giá trị.
* `getAndSet(newValue)`: Ghi giá trị mới và trả về giá trị cũ.
* `incrementAndGet()`: Tương đương `++value` (tăng rồi trả về).
* `getAndIncrement()`: Tương đương `value++` (trả về rồi mới tăng).
* `decrementAndGet()`: Tương đương `--value`.
* `getAndDecrement()`: Tương đương `value--`.

> [!NOTE]
> **Từ khóa `volatile` vs. `Atomic`:**
> * `volatile` chỉ đảm bảo tính hiển thị bộ nhớ (**Visibility**): Khi một luồng thay đổi giá trị, các luồng khác lập tức nhìn thấy giá trị mới trong RAM thay vì đọc cache của CPU.
> * Tuy nhiên, `volatile` **KHÔNG** đảm bảo tính nguyên tử cho các thao tác phức hợp (như `count++`). Muốn nguyên tử hóa các phép toán số học, bạn bắt buộc phải dùng **Atomic Classes** hoặc **Synchronization**.

---

### 2. Từ Khóa `synchronized` (Monitor Lock)
Đảm bảo tại một thời điểm, chỉ có **duy nhất một luồng** được phép thực thi đoạn mã được bảo vệ. Luồng khác muốn vào phải chuyển sang trạng thái `BLOCKED` để chờ.

#### Đồng bộ hóa cấp độ Thực thể (Instance Synchronization):
Khóa trên đối tượng hiện tại (`this`):
```java
// Cách 1: Khối synchronized
public void addSheep() {
    synchronized (this) {
        sheepCount++;
    }
}

// Cách 2: Phương thức synchronized (tương đương hoàn toàn cách 1)
public synchronized void addSheep() {
    sheepCount++;
}
```

#### Đồng bộ hóa cấp độ Lớp (Static Synchronization):
Khóa trên đối tượng `Class<?>` của lớp đó:
```java
// Cách 1: Khối synchronized khóa trên đối tượng Class
public static void printReport() {
    synchronized (SheepManager.class) {
        System.out.println("Total: " + totalSheep);
    }
}

// Cách 2: Phương thức static synchronized (tương đương cách 1)
public static synchronized void printReport() {
    System.out.println("Total: " + totalSheep);
}
```

> [!WARNING]
> **Bẫy thi về đối tượng khóa:** Hai luồng chỉ thực sự đồng bộ nếu chúng **dùng chung một đối tượng khóa (lock object)**. Nếu luồng 1 khóa trên `lockObj1` còn luồng 2 khóa trên `lockObj2`, chúng vẫn chạy song song và xung đột dữ liệu!

---

### 3. Khung Khóa Nâng Cao (`java.util.concurrent.locks.Lock` & `ReentrantLock`) (TABLE 13.11)

Khung giao diện `Lock` mang lại nhiều ưu thế vượt trội so với khối `synchronized`: Khả năng kiểm tra khóa không bị chặn (`tryLock`), hỗ trợ khóa công bằng (Fairness), và giới hạn thời gian chờ.

```java
Lock lock = new ReentrantLock();

public void performTask() {
    lock.lock(); // Chặn chờ cho đến khi giành được khóa
    try {
        // Vùng nguy hiểm (Critical Section)
        count++;
    } finally {
        lock.unlock(); // BẮT BUỘC đặt trong finally để tránh rò rỉ khóa!
    }
}
```

#### Thử Giành Khóa Không Chặn Với `tryLock()`
```java
if (lock.tryLock()) { // Thử lấy khóa, trả về ngay lập tức true/false
    try {
        System.out.println("Acquired lock!");
    } finally {
        lock.unlock();
    }
} else {
    System.out.println("Unable to acquire lock, doing something else");
}
```
* **`tryLock(long timeout, TimeUnit unit)`:** Chờ tối đa khoảng thời gian quy định trước khi từ bỏ.
* **Tính chất tái nhập (Reentrancy):** Một luồng đang giữ khóa có thể gọi tiếp `lock.lock()` hoặc `lock.tryLock()` nhiều lần mà không bị tự khóa chính mình. Tuy nhiên, số lần gọi `unlock()` **phải bằng đúng số lần đã lấy khóa** thì khóa mới thực sự được giải phóng.

---

### 4. Điều Phối Luồng Với `CyclicBarrier`

`CyclicBarrier` cho phép một nhóm luồng cùng chờ đợi nhau tại một "điểm tập kết" (barrier) trước khi cùng tiến hành bước tiếp theo. Rất hữu ích cho các tác vụ phối hợp nhiều giai đoạn (multi-step tasks).

```java
import java.util.concurrent.*;

public class LionPenManager {
    private void removeLions() { System.out.println("Removing lions"); }
    private void cleanPen()     { System.out.println("Cleaning the pen"); }
    private void addLions()      { System.out.println("Adding lions"); }

    public void performTask(CyclicBarrier c1, CyclicBarrier c2) {
        try {
            removeLions();
            c1.await(); // Điểm tập kết 1: Chờ tất cả dọn sư tử xong
            cleanPen();
            c2.await(); // Điểm tập kết 2: Chờ tất cả vệ sinh chuồng xong
            addLions();
        } catch (InterruptedException | BrokenBarrierException e) {
            // Xử lý ngoại lệ
        }
    }

    public static void main(String[] args) {
        var c1 = new CyclicBarrier(4);
        var c2 = new CyclicBarrier(4, () -> System.out.println("*** Chuồng đã sạch hoàn toàn!"));
        try (var service = Executors.newFixedThreadPool(4)) {
            var manager = new LionPenManager();
            for (int i = 0; i < 4; i++)
                service.submit(() -> manager.performTask(c1, c2));
        }
    }
}
```

> [!CAUTION]
> **Bẫy thi nguy hiểm về kích thước Thread Pool và `CyclicBarrier`:**
> Nếu số lượng luồng trong Thread Pool **nhỏ hơn** giới hạn quy định của `CyclicBarrier` (ví dụ `new CyclicBarrier(4)` mà Thread Pool chỉ có 2 luồng: `newFixedThreadPool(2)`), chương trình sẽ bị **treo vĩnh viễn (Hang/Deadlock-like state)** vì không bao giờ có đủ 4 luồng cùng tới điểm `await()`!

---

## 4. Các Bộ Sưu Tập Đồng Thời (Concurrent Collections)

Khi nhiều luồng truy cập các collection thông thường (`ArrayList`, `HashMap`), ứng dụng sẽ văng `ConcurrentModificationException` hoặc bị hỏng cấu trúc dữ liệu. JPMS cung cấp bộ sưu tập chuyên dụng an toàn đa luồng trong `java.util.concurrent` (TABLE 13.12).

| Tên Lớp (Class) | Interface Kế Thừa | Đặc Điểm Hoạt Động | Cho Phép `null`? |
| :--- | :--- | :--- | :---: |
| **`ConcurrentHashMap`** | `Map`, `ConcurrentMap` | Khóa phân đoạn (bucket-level locking). Cho phép nhiều luồng đọc và ghi cùng lúc với hiệu năng cực cao. | **CẤM `null` cả key lẫn value!** |
| **`CopyOnWriteArrayList`** | `List`, `SequencedCollection`| Sao chép toàn bộ mảng gốc sang mảng mới mỗi khi có thao tác ghi (`add`, `set`, `remove`). Iterator duyệt trên ảnh chụp (snapshot) nên **không bao giờ văng `ConcurrentModificationException`**. | Có |
| **`CopyOnWriteArraySet`** | `Set` | Tương tự như trên nhưng đảm bảo phần tử không trùng lặp. | Có |
| **`ConcurrentSkipListMap`** | `SortedMap`, `NavigableMap` | Phiên bản an toàn đa luồng của `TreeMap` (các phần tử luôn được sắp xếp theo thứ tự tự nhiên hoặc Comparator). | **CẤM `null`** |
| **`ConcurrentSkipListSet`** | `SortedSet`, `NavigableSet` | Phiên bản an toàn đa luồng của `TreeSet`. | **CẤM `null`** |
| **`ConcurrentLinkedQueue`** | `Queue` | Hàng đợi FIFO không chặn (non-blocking, lock-free queue). | **CẤM `null`** |
| **`LinkedBlockingQueue`** | `BlockingQueue` | Hàng đợi có hỗ trợ cơ chế chặn: Phương thức `offer(e, timeout, unit)` và `poll(timeout, unit)` sẽ chờ khi hàng đợi đầy hoặc rỗng. | **CẤM `null`** |

### Synchronized Collection Wrappers (TABLE 13.13)
Nếu bạn có một collection thông thường và muốn đồng bộ hóa, `java.util.Collections` cung cấp các wrapper:
* `Collections.synchronizedList(list)`
* `Collections.synchronizedMap(map)`
* `Collections.synchronizedSet(set)`
* > [!CAUTION]
  > **Bẫy thi về duyệt phần tử:** Các wrapper này chỉ đồng bộ hóa từng phương thức riêng lẻ (như `add`, `get`). Khi **lặp qua collection bằng vòng lặp `for-each` hoặc `Iterator`**, bạn **bắt buộc phải tự bọc trong khối `synchronized(list)`**, nếu không vẫn sẽ bị ném `ConcurrentModificationException`!

---

## 5. Nhận Diện 4 Vấn Đề Liveness & Safety Trong Đa Luồng

1. **Deadlock (Bế Tắc / Khóa Chết):**
   * Xảy ra khi hai hoặc nhiều luồng bị chặn vĩnh viễn vì mỗi luồng đang nắm giữ một khóa mà luồng kia đang chờ để lấy (vòng tròn chờ khóa).
   * *Ví dụ:* Luồng A giữ khóa 1 chờ khóa 2; Luồng B giữ khóa 2 chờ khóa 1. Cả hai chờ nhau mãi mãi.
2. **Starvation (Bỏ Đói):**
   * Xảy ra khi một luồng bị tước đoạt quyền truy cập tài nguyên liên tục trong một thời gian dài vì các luồng khác có độ ưu tiên cao hơn hoặc "tham lam" hơn liên tục chiếm giữ tài nguyên.
3. **Livelock (Tắc Nghẽn Động):**
   * Hai hoặc nhiều luồng liên tục phản ứng lại hành động của luồng khác và thay đổi trạng thái của mình nhưng **không thể tiến triển công việc** (giống như hai người lịch sự cùng bước sang trái rồi cùng bước sang phải liên tục trong hành lang hẹp để nhường đường nhau). Các luồng vẫn đang chạy (không bị `BLOCKED`) nhưng bị kẹt vĩnh viễn.
4. **Race Condition (Xung Đột Dữ Liệu):**
   * Xảy ra khi nhiều luồng truy cập và chỉnh sửa dữ liệu chung mà không có đồng bộ hóa. Kết quả phụ thuộc vào thứ tự thực thi ngẫu nhiên của các luồng, gây sai lệch dữ liệu.

---

## 6. Xử Lý Song Song Với Parallel Streams

Parallel Stream chia nhỏ luồng dữ liệu thành nhiều luồng con và thực thi đồng thời trên các nhân CPU thông qua **Common ForkJoinPool**.

### Khởi Tạo Parallel Stream
* Từ Collection: `List.of(1, 2, 3).parallelStream()`
* Từ Sequential Stream hiện có: `stream.parallel()`

---

### Thứ Tự Thực Thi: `forEach()` vs. `forEachOrdered()`
* **`stream.parallel().forEach(...)`:** Các phần tử được xử lý và in ra theo **thứ tự ngẫu nhiên không thể đoán trước** (tùy thuộc vào luồng nào xong trước).
* **`stream.parallel().forEachOrdered(...)`:** Ép buộc các phần tử phải được xử lý hoặc xuất ra theo đúng thứ tự xuất hiện ban đầu trong stream. (Lưu ý: Làm mất đi phần lớn lợi thế tốc độ của xử lý song song).

---

### Phép Rút Gọn Song Song (`reduce()`)

Cú pháp 3 tham số của hàm `reduce()` khi chạy song song:
```java
<U> U reduce(U identity, 
             BiFunction<U, ? super T, U> accumulator, 
             BinaryOperator<U> combiner);
```

> [!IMPORTANT]
> **Quy Tắc Vàng Của Parallel Reduction:**
> 1. **Phần tử đồng nhất (Identity):** Với mọi giá trị `u`, ta phải có: `combiner.apply(identity, u) == u`.
> 2. **Tính kết hợp (Associative):** Thứ tự gom nhóm phép toán không được làm đổi kết quả:
>    `(a op b) op c == a op (b op c)`.
>    * Phép cộng (`+`), nhân (`*`), tìm max/min có tính kết hợp $\rightarrow$ An toàn cho parallel stream.
>    * Phép trừ (`-`) và phép chia (`/`) **KHÔNG** có tính kết hợp $\rightarrow$ Cho kết quả sai lệch ngẫu nhiên khi chạy parallel stream!

---

### Phép Thu Gom Song Song (`collect()`) & Concurrent Collectors
Khi thực hiện gom nhóm trên Parallel Stream, thay vì mỗi luồng tạo một container riêng rồi ghép lại, ta có thể dùng **Concurrent Collectors** để tất cả các luồng ghi trực tiếp vào cùng một Map dùng chung:
* **`Collectors.toConcurrentMap()`**
* **`Collectors.groupingByConcurrent()`**
* Để một Collector hoạt động đồng thời hiệu quả, nó phải có đặc tính `Characteristics.CONCURRENT` và Stream phải là không sắp xếp (`stream.unordered()`).

> [!WARNING]
> **Bẫy thi tác dụng phụ (Side Effects) trong Parallel Stream:**
> Tuyệt đối không được thay đổi trạng thái của biến bên ngoài trong các biểu thức Lambda của Parallel Stream:
> ```java
> List<Integer> data = Collections.synchronizedList(new ArrayList<>());
> List.of(1, 2, 3, 4, 5).parallelStream()
>     .map(i -> { data.add(i); return i; }) // NGUY HIỂM: Gây race condition hoặc kết quả không xác định!
>     .forEachOrdered(i -> {});
> ```

---

## 7. Bảng Tổng Hợp Bẫy Thi & Ghi Nhớ Nhanh (Exam Traps Checklist)

> [!TIP]
> ### 10 Bẫy Thi Cực Kỳ Trọng Tâm Chương 13
> 1. **Virtual Thread luôn là Daemon:** Cố tình gọi `builder.daemon(false)` trên virtual thread sẽ bị ném `IllegalArgumentException`.
> 2. **Priority của Virtual Thread:** Luôn cố định là 5 (`NORM_PRIORITY`), không thể thay đổi.
> 3. **Cú pháp `ReentrantLock.tryLock()`:** Trả về `boolean` ngay lập tức; không tự động giải phóng khóa. Bạn bắt buộc phải gọi `lock.unlock()` trong khối `finally` nếu `tryLock()` trả về `true`.
> 4. **Quên gọi `unlock()`:** Gọi `tryLock()` hoặc `lock()` mà quên `unlock()` $\rightarrow$ Các luồng sau sẽ bị kẹt vĩnh viễn hoặc văng `IllegalMonitorStateException` nếu gọi `unlock()` khi chưa giữ khóa.
> 5. **`CyclicBarrier` và số lượng luồng:** Kích thước thread pool nhỏ hơn số lượng bên đợi của `CyclicBarrier` sẽ khiến ứng dụng bị treo vĩnh viễn.
> 6. **`ConcurrentHashMap` cấm `null`:** Khác với `HashMap` cho phép 1 key `null` và nhiều value `null`, `ConcurrentHashMap` sẽ ném **`NullPointerException`** ngay lập tức nếu put `null` key hoặc `null` value.
> 7. **`CopyOnWriteArrayList` hiệu năng:** Thao tác đọc siêu nhanh, nhưng thao tác ghi (`add`/`remove`) rất tốn kém vì phải sao chép toàn bộ mảng.
> 8. **Duyệt `Collections.synchronizedList()`:** Duyệt qua wrapper này bằng `Iterator` / `for-each` vẫn có thể văng `ConcurrentModificationException` nếu không tự bọc khối `synchronized(list)`.
> 9. **Phép toán `reduce` song song:** Phép trừ `(a, b) -> a - b` không có tính kết hợp $\rightarrow$ chạy parallel stream sẽ ra kết quả sai lệch!
> 10. **Tắt `ExecutorService`:** Nếu không gọi `shutdown()` hoặc không dùng trong `try-with-resources`, ứng dụng sẽ chạy mãi không dừng vì các non-daemon threads của executor.
