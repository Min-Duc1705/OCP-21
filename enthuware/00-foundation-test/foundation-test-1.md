# Enthuware: Foundation Test 1 — Phân Tích & Giải Chi Tiết

> **Bài thi:** Foundation Test 1 (Rà soát & kiểm tra kiến thức nền tảng Java SE 21 - 1Z0-830)  
> **Số lượng câu:** ~50 câu  
> **Mục tiêu:** $\ge 80\%$ để đảm bảo chắc chắn các kiến thức cốt lõi.

---

## 📈 Tổng Kết Kết Quả Bài Làm

* **Lần 1:** ... / 50 câu (... %) — *Thời gian: ... phút — Ngày làm: DD/MM/YYYY*
* **Lần 2 (Ôn lại):** ... / 50 câu (... %) — *Ngày làm: DD/MM/YYYY*
* **Ghi chú chung:** [Ghi lại các chủ đề bị nhầm lẫn nhiều nhất trong đề này]

---

## 📑 Danh Sách Câu Hỏi Phân Tích

### Câu 01: Vòng Lặp Lồng Nhau & Phạm Vi Của Biến `var` (Nested Loops & Scope Trap)

**Chủ đề:** Java Basics / Loops & Control Flow / Local Variable Type Inference (`var`)  
**Mức độ bẫy:** ⭐⭐ (Cơ bản nhưng dễ nhầm phạm vi biến)

#### 📄 Đề Bài:
> Consider the following code:

```java
public static void main(String[] args) {
    int[] values = { 10, 30, 50 };
    for( var val : values ){
        var x = 0;
        while(x < values.length){
            System.out.println(x + " " + val);
            x++;
        }
    }
}
```

> **How many times is 2 printed out in the output?**

#### 🔘 Các Lựa Chọn:
- [ ] **A.** 0
- [ ] **B.** 1
- [ ] **C.** 2
- [x] **D.** 3

**Đáp án đúng:** **D. 3**

---

#### 🔍 Mổ Xẻ Chi Tiết & Bẫy Đề Thi:

1. **Kiểm tra tính hợp lệ cú pháp (`var`):**
   * `for( var val : values )`: Từ Java 10 trở lên, từ khóa `var` hoàn toàn hợp lệ trong vòng lặp enhanced-for. Ở đây `val` được suy luận kiểu tự động là `int`.
   * `var x = 0;`: Khai báo biến cục bộ hợp lệ, `x` được suy luận là `int`.
   * Code biên dịch thành công 100%, không có lỗi Compile Error.

2. **Bẫy phạm vi khai báo `var x = 0;` (The Scope Trap):**
   * Điểm mấu chốt: `var x = 0;` nằm **bên trong** thân vòng lặp `for`.
   * Điều này đồng nghĩa với việc mỗi khi vòng lặp `for` chuyển sang một phần tử mới của mảng `values`, biến `x` lại được **khởi tạo lại từ đầu về 0**.
   * *(Nếu `var x = 0;` được đặt ở bên ngoài vòng lặp `for`, `x` sẽ không được reset và số `2` chỉ in ra đúng 1 lần).*

3. **Truy vết từng bước thực thi (Step-by-step Trace):**
   * Mảng `values = { 10, 30, 50 }` có `values.length = 3`.
   * Vòng lặp `while(x < 3)` lặp qua các giá trị: `x = 0, 1, 2` (khi `x = 3` thì dừng).
   * **Lần 1 (`val = 10`):**
     * `x = 0` $\rightarrow$ In: `0 10`
     * `x = 1` $\rightarrow$ In: `1 10`
     * `x = 2` $\rightarrow$ In: `2 10`  *(Chứa số 2)*
   * **Lần 2 (`val = 30`):** `x` được reset về `0`!
     * `x = 0` $\rightarrow$ In: `0 30`
     * `x = 1` $\rightarrow$ In: `1 30`
     * `x = 2` $\rightarrow$ In: `2 30`  *(Chứa số 2)*
   * **Lần 3 (`val = 50`):** `x` tiếp tục được reset về `0`!
     * `x = 0` $\rightarrow$ In: `0 50`
     * `x = 1` $\rightarrow$ In: `1 50`
     * `x = 2` $\rightarrow$ In: `2 50`  *(Chứa số 2)*

   * Các phần tử trong mảng là `10, 30, 50` (không chứa ký tự/số `2`). Do đó số `2` chỉ xuất hiện ở cột giá trị của `x`.
   * Tổng cộng số `2` được in ra chính xác **3 lần**.

---

#### 💡 Nguyên Tắc Cốt Lõi Cần Nhớ (Core Rules):

> [!IMPORTANT]
> 1. **Vị trí khai báo biến:** Biến khai báo trong thân vòng lặp ngoài sẽ được cấp phát & khởi tạo lại ở mỗi bước lặp của vòng ngoài.
> 2. **Cú pháp `var`:** `var` dùng được trong biến cục bộ, enhanced for-loop `for(var item : list)`, và basic for-loop `for(var i = 0; i < n; i++)`.

---

#### 🧪 Mã Nguồn Kiểm Chứng Thực Nghiệm:

```java
public class LoopTrapDemo {
    public static void main(String[] args) {
        int[] values = { 10, 30, 50 };
        int count2 = 0;
        for (var val : values) {
            var x = 0;
            while (x < values.length) {
                String line = x + " " + val;
                System.out.println(line);
                if (line.contains("2")) {
                    count2++;
                }
                x++;
            }
        }
        System.out.println("-> Số lần in ra 2: " + count2); // In ra 3
    }
}
```

---

### Câu 02: Phương Thức Của Interface `Callable` (`Callable` vs `Runnable`)

**Chủ đề:** Concurrency / `java.util.concurrent` / Functional Interfaces  
**Mức độ bẫy:** ⭐ (Cơ bản - Trọng tâm ghi nhớ định nghĩa API)

#### 📄 Đề Bài:
> Which method must be implemented by a class implementing the `Callable` interface?

#### 🔘 Các Lựa Chọn:
- [ ] **A.** `run()`
- [ ] **B.** `execute()`
- [x] **C.** `call()`
- [ ] **D.** `do()`

**Đáp án đúng:** **C. `call()`**

---

#### 🔍 Mổ Xẻ Chi Tiết & Bẫy Đề Thi:

1. **Định nghĩa của `java.util.concurrent.Callable<V>`:**
   ```java
   @FunctionalInterface
   public interface Callable<V> {
       V call() throws Exception;
   }
   ```
   * Phương thức duy nhất cần implement là **`V call() throws Exception`**.

2. **Tại sao các đáp án khác sai:**
   * **`run()`:** Là phương thức của interface `java.lang.Runnable` (`public void run()`), không trả về giá trị (`void`) và không thể ném checked exception.
   * **`execute()`:** Là phương thức của interface `java.util.concurrent.Executor` (`void execute(Runnable command)`), dùng để gửi một tác vụ Runnable đi chạy.
   * **`do()`:** Không tồn tại phương thức này trong Java Concurrency API; hơn nữa `do` là từ khóa dành riêng (reserved keyword) của ngôn ngữ Java (dùng trong vòng lặp `do-while`).

---

#### ⚖️ Bảng So Sánh Vàng Cần Thuộc Lòng Trong Kỳ Thi OCP 21:

| Tiêu Chí | `java.lang.Runnable` | `java.util.concurrent.Callable<V>` |
| :--- | :--- | :--- |
| **Tên phương thức** | `run()` | **`call()`** |
| **Giá trị trả về** | `void` | Kiểu Generic **`V`** (hoặc `Object`) |
| **Checked Exception** | **Không được ném** (chỉ ném được `RuntimeException`) | **Được phép ném `throws Exception`** |
| **Package** | `java.lang` (không cần import) | `java.util.concurrent` (phải import) |
| **Nạp vào ExecutorService** | Dùng `submit(runnable)` hoặc `execute(runnable)` | Chỉ dùng **`submit(callable)`** (trả về `Future<V>`) |

---

#### 💡 Nguyên Tắc Cốt Lõi Cần Nhớ (Core Rules):

> [!IMPORTANT]
> 1. Nhớ câu thần chú: **"Runnable runs, Callable calls"**.
> 2. `Callable.call()` có 2 điểm nâng cấp vượt trội so với `Runnable.run()`: **Có kiểu trả về** và **được ném Checked Exception**.

---

#### 🧪 Mã Nguồn Kiểm Chứng Thực Nghiệm:

```java
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class CallableDemo {
    public static void main(String[] args) throws Exception {
        // Implement Callable với lambda biểu thức (trả về String, ném được Exception)
        Callable<String> task = () -> {
            Thread.sleep(100);
            return "Hoàn thành tác vụ!";
        };

        try (ExecutorService executor = Executors.newSingleThreadExecutor()) {
            Future<String> future = executor.submit(task);
            System.out.println("Kết quả từ call(): " + future.get());
        }
    }
}
```

---

