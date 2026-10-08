# Sổ Tay Chuyên Sâu: Chapter 8 - Lambdas and Functional Interfaces

> **Tài liệu tham chiếu chuẩn OCP Java SE 21:**  
> Sách: *OCP Oracle Certified Professional Java SE 21 Developer Study Guide*  
> Tác giả: Jeanne Boyarsky & Scott Selikoff (Sybex / Wiley)  
> Phạm vi: Trang 702 – 748 (PDF)

---

## 🗺️ Bản Đồ Kiến Thức Chương 8 (Chapter Overview)

Trong các chương trước, Java chủ yếu hoạt động theo mô hình hướng đối tượng truyền thống (OOP). Kể từ Java 8 và tiếp tục hoàn thiện đến Java 21, **Lập trình hàm (Functional Programming)** trở thành trụ cột quan trọng, cho phép chúng ta viết mã khai báo (declarative), tập trung vào biểu thức thay vì vòng lặp và trạng thái biến đổi.

Chương 8 tập trung vào 5 chủ đề cốt lõi liên kết chặt chẽ với nhau:
1. **Biểu thức Lambda (Lambda Expressions):** Cú pháp, các thành phần bắt buộc vs tuỳ chọn, cơ chế thực thi trì hoãn (*deferred execution*).
2. **Giao diện hàm (Functional Interfaces):** Quy tắc phương thức trừu tượng duy nhất (**SAM - Single Abstract Method**), annotation `@FunctionalInterface`, và ngoại lệ đối với các phương thức của `java.lang.Object`.
3. **Tham chiếu phương thức (Method References):** 4 định dạng viết tắt chuẩn xác thay thế lambda.
4. **Các Functional Interface có sẵn (Built-in Interfaces):** 6 giao diện nền tảng (`Supplier`, `Consumer`, `Predicate`, `Function`, `UnaryOperator`, `BinaryOperator`), các phương thức tiện ích (`andThen`, `compose`, `negate`), và họ giao diện tối ưu cho kiểu nguyên thuỷ (*primitives*).
5. **Quy tắc phạm vi biến trong Lambda (Variables in Lambdas):** Quy tắc đặt tên tham số, giới hạn truy cập biến ngoài: quy tắc **`final`** và **`effectively final`**.

---

## PHẦN 1: CÚ PHÁP BIỂU THỨC LAMBDA (WRITING SIMPLE LAMBDAS)

Một **Lambda Expression** là một khối mã ẩn danh (unnamed block of code) có thể được truyền đi khắp nơi như một đối tượng để thực thi sau này (**deferred execution**).

### 1. Cấu Trúc Cơ Bản Của Lambda
Cú pháp tổng quát:
```
(danh_sách_tham_số) -> { thân_hàm; }
```
Ví dụ:
```java
(Animal a) -> { return a.canHop(); }
```
* **Vế trái:** Danh sách tham số đầu vào.
* **Toán tử mũi tên (`->`):** Ngăn cách giữa tham số và thân hàm.
* **Vế phải:** Thân hàm (body) thực hiện xử lý logic.

---

### 2. Các Thành Phần Tuỳ Chọn (Optional Parts)

Cú pháp lambda rất linh hoạt vì nhiều thành phần có thể được lược bỏ, nhưng phải tuân thủ các quy tắc nghiêm ngặt:

#### Quy tắc vế trái (Tham số):
1. **Kiểu dữ liệu:** Kiểu dữ liệu của tham số là tuỳ chọn (trình biên dịch tự động suy luận kiểu từ ngữ cảnh).
   * `(Animal a) -> ...` tương đương `(a) -> ...`.
2. **Dấu ngoặc đơn `()`:**
   * **ĐƯỢC BỎ** khi và chỉ khi: có **duy nhất 1 tham số** VÀ **không khai báo kiểu dữ liệu**: `a -> ...`.
   * **BẮT BUỘC CÓ** khi:
     * Có 0 tham số: `() -> true`.
     * Có từ 2 tham số trở lên: `(x, y) -> ...`.
     * Có khai báo kiểu dữ liệu tường minh: `(Animal a) -> ...` (`Animal a -> ...` $\rightarrow$ **LỖI BIÊN DỊCH**).
     * Sử dụng từ khoá `var`: `(var a) -> ...` (`var a -> ...` $\rightarrow$ **LỖI BIÊN DỊCH**).

#### Quy tắc vế phải (Thân hàm):
1. **Khi thân hàm là một biểu thức đơn (Single Expression):**
   * Có thể bỏ dấu ngoặc nhọn `{}`.
   * Khi đã bỏ `{}`, **KHÔNG ĐƯỢC dùng từ khoá `return`** và **KHÔNG ĐƯỢC có dấu chấm phẩy `;`**:
     * Hợp lệ: `a -> a.canHop()`
     * Lỗi biên dịch: `a -> return a.canHop();`
     * Lỗi biên dịch: `a -> a.canHop();`
2. **Khi thân hàm là một khối lệnh (Block Statement `{}`):**
   * Bắt buộc phải có cặp dấu ngoặc nhọn `{}`.
   * Mọi câu lệnh bên trong phải kết thúc bằng dấu chấm phẩy `;`.
   * Nếu phương thức có kiểu trả về khác `void`, **BẮT BUỘC phải có từ khoá `return` kèm dấu `;`**:
     * Hợp lệ: `a -> { return a.canHop(); }`
     * Lỗi biên dịch: `a -> { a.canHop(); }` (thiếu từ khoá `return`)
     * Lỗi biên dịch: `a -> { return a.canHop() }` (thiếu dấu `;`)

---

### 3. Bảng Tổng Hợp Lambda Hợp Lệ & Không Hợp Lệ (Chuẩn Sách OCP)

#### Bảng 8.1: Các Lambda hợp lệ trả về boolean
| Cú Pháp Lambda | Số Lượng Tham Số | Giải Thích |
| :--- | :---: | :--- |
| `() -> true` | 0 | Không tham số, trả về boolean hằng số `true`. |
| `x -> x.startsWith("test")` | 1 | 1 tham số ngầm định kiểu, không ngoặc đơn, biểu thức đơn. |
| `(String x) -> x.startsWith("test")` | 1 | 1 tham số có kiểu `String`, bắt buộc có ngoặc đơn `()`. |
| `(x, y) -> { return x.startsWith("test"); }` | 2 | 2 tham số, thân hàm khối lệnh `{}` có `return` và `;`. |
| `(String x, String y) -> x.startsWith("test")` | 2 | 2 tham số tường minh kiểu, thân hàm là biểu thức đơn. |

#### Bảng 8.2: Các Lambda SAI cú pháp (Bẫy biên dịch OCP)
| Lambda Bị Lỗi | Nguyên Nhân Lỗi Biên Dịch | Sửa Lại Cho Đúng |
| :--- | :--- | :--- |
| `x, y -> x.startsWith("fish")` | Có 2 tham số nhưng thiếu cặp ngoặc đơn `()` ở vế trái. | `(x, y) -> x.startsWith("fish")` |
| `x -> { x.startsWith("camel"); }` | Dùng khối lệnh `{}` nhưng thiếu từ khoá `return`. | `x -> { return x.startsWith("camel"); }` hoặc `x -> x.startsWith("camel")` |
| `x -> { return x.startsWith("giraffe") }` | Thiếu dấu chấm phẩy `;` bên trong khối `{}`. | `x -> { return x.startsWith("giraffe"); }` |
| `String x -> x.endsWith("eagle")` | Có khai báo kiểu dữ liệu `String` nhưng thiếu cặp ngoặc đơn `()`. | `(String x) -> x.endsWith("eagle")` |
| `(var x, y) -> true` | Trộn lẫn giữa `var` và tham số không kiểu. | `(var x, var y) -> true` hoặc `(x, y) -> true` |
| `(var x, String y) -> true` | Trộn lẫn giữa `var` và kiểu dữ liệu tường minh. | `(String x, String y) -> true` |

> [!CAUTION]
> **Bẫy gán Lambda vào `var`:**
> ```java
> var invalid = (Animal a) -> a.canHop(); // LỖI BIÊN DỊCH!
> ```
> Trình biên dịch không thể xác định được kiểu của biến `invalid` vì bản thân biểu thức lambda không mang kiểu cụ thể mà phải phụ thuộc vào ngữ cảnh đích (*target typing*). Ngược lại, `var` cũng dựa vào vế phải để suy luận kiểu $\rightarrow$ Hai bên đều không có đủ thông tin $\rightarrow$ Lỗi biên dịch.

---

## PHẦN 2: THIẾT KẾ FUNCTIONAL INTERFACE (CODING FUNCTIONAL INTERFACES)

Một **Functional Interface (Giao diện hàm)** là một interface chứa **chính xác duy nhất một phương thức trừu tượng (Single Abstract Method - SAM)**.

### 1. Quy Tắc SAM & Annotation `@FunctionalInterface`

```java
@FunctionalInterface
public interface Sprint {
    void sprint(int speed);
}
```

* **Annotation `@FunctionalInterface`:**
  * Dùng để thông báo cho trình biên dịch biết đây là một giao diện hàm.
  * Nếu interface vi phạm quy tắc SAM (có 0 phương thức trừu tượng hoặc từ 2 phương thức trừu tượng trở lên), trình biên dịch sẽ **báo lỗi ngay lập tức**.
  * **Lưu ý thi OCP:** Annotation này là **tuỳ chọn**. Bất kỳ interface nào thoả mãn quy tắc SAM đều là functional interface, cho dù có gắn annotation này hay không!

---

### 2. Các Thành Phần KHÔNG Tính Vào Quy Tắc SAM

Interface có thể chứa nhiều thành phần khác mà vẫn giữ được tính chất là một Functional Interface:

1. **Phương thức mặc định (`default method`):** Không tính vì đã có phần thân cài đặt sẵn.
2. **Phương thức tĩnh (`static method`):** Không tính vì thuộc về interface, không phải abstract.
3. **Phương thức riêng tư (`private` và `private static method`):** Không tính vì chỉ phục vụ nội bộ interface.

```java
@FunctionalInterface
public interface Climb {
    void reach(); // DUY NHẤT 1 abstract method -> THOẢ MÃN SAM!

    default void fall() {}
    static int getBackUp() { return 100; }
    private static boolean checkHeight() { return true; }
}
```

---

### 3. Ngoại Lệ Cực Kỳ Quan Trọng: Các Phương Thức Của `java.lang.Object`

> [!IMPORTANT]
> **Quy tắc vàng của Oracle:**  
> Nếu một interface khai báo một phương thức trừu tượng trùng khớp hoàn toàn với một **phương thức `public` của lớp `java.lang.Object`**, phương thức đó **KHÔNG ĐƯỢC TÍNH** vào số lượng abstract method của quy tắc SAM!

Lý do: Bất kỳ lớp nào triển khai interface đều mặc nhiên kế thừa các phương thức này từ `java.lang.Object`.

Ba phương thức `public` của `Object` thường gặp nhất:
* `public String toString()`
* `public boolean equals(Object obj)`
* `public int hashCode()`

#### Ví dụ phân tích:
```java
@FunctionalInterface
public interface Dive {
    String toString();              // Của Object -> KHÔNG TÍNH
    public boolean equals(Object o);// Của Object -> KHÔNG TÍNH
    public abstract int hashCode(); // Của Object -> KHÔNG TÍNH
    
    public void dive();             // Abstract method DUY NHẤT -> HỢP LỆ!
}
```

#### Bẫy thi OCP về chữ ký phương thức:
```java
@FunctionalInterface // LỖI BIÊN DỊCH!
public interface Hibernate {
    String toString();
    public boolean equals(Hibernate o); // BẪY: Tham số là Hibernate, KHÔNG PHẢI Object!
    public void rest();
}
```
* Phương thức `equals(Hibernate o)` không khớp với `equals(Object o)` của lớp `Object`. Do đó nó bị tính là một abstract method thông thường.
* Interface `Hibernate` lúc này có 2 abstract method: `equals(Hibernate)` và `rest()` $\rightarrow$ **Vi phạm SAM $\rightarrow$ Báo lỗi biên dịch**!

---

## PHẦN 3: THAM CHIẾU PHƯƠNG THỨC (USING METHOD REFERENCES)

**Method Reference** là một cú pháp ngắn gọn hơn cả biểu thức lambda khi khối mã chỉ đơn giản chuyển tiếp trực tiếp các tham số đầu vào cho một phương thức sẵn có.

Toán tử tham chiếu phương thức là **cặp dấu hai chấm đôi (`::`)**.

Java hỗ trợ chính xác **4 định dạng Method Reference** (Bảng 8.3):

| Loại Tham Chiếu | Trước Dấu `::` | Sau Dấu `::` | Ví Dụ Method Ref | Biểu Thức Lambda Tương Đương |
| :--- | :--- | :--- | :--- | :--- |
| **1. Gọi Static Method** | Tên lớp (`ClassName`) | Tên phương thức | `Math::round` | `n -> Math.round(n)` |
| **2. Gọi Instance Method trên đối tượng cụ thể** | Tên biến đối tượng (`instanceRef`) | Tên phương thức | `str::startsWith` | `s -> str.startsWith(s)` |
| **3. Gọi Instance Method trên tham số runtime** | Tên lớp (`ClassName`) | Tên phương thức | `String::isEmpty` | `s -> s.isEmpty()` |
| **4. Gọi Constructor** | Tên lớp (`ClassName`) | Từ khoá `new` | `ArrayList::new` | `() -> new ArrayList<>()` |

---

### Phân Tích Chi Tiết 4 Loại:

#### Loại 1: Gọi Static Method (`ClassName::staticMethod`)
```java
Consumer<List<Integer>> methodRef = Collections::sort;
Consumer<List<Integer>> lambda = l -> Collections.sort(l);
```

#### Loại 2: Gọi Instance Method trên một đối tượng cụ thể (`instanceRef::method`)
Đối tượng được xác định từ trước, lambda chỉ cần nhận tham số còn lại để truyền vào phương thức:
```java
var str = "Hello";
Predicate<String> methodRef = str::startsWith;
Predicate<String> lambda = s -> str.startsWith(s);
```

#### Loại 3: Gọi Instance Method trên tham số runtime (`ClassName::instanceMethod`)
Đây là loại dễ gây nhầm lẫn nhất vì vế trái là **Tên lớp**, nhìn giống gọi static method nhưng thực chất phương thức được gọi lại là **instance method**:
* **Quy tắc:** Tham số đầu tiên của lambda sẽ được trình biên dịch lấy làm **đối tượng gọi hàm (target instance)**, các tham số phía sau (nếu có) sẽ làm đối số truyền vào hàm:
```java
// 1 tham số:
Predicate<String> methodRef1 = String::isEmpty;
Predicate<String> lambda1 = s -> s.isEmpty(); // s là đối tượng gọi hàm

// 2 tham số:
BiPredicate<String, String> methodRef2 = String::startsWith;
BiPredicate<String, String> lambda2 = (s, prefix) -> s.startsWith(prefix); // s gọi hàm, prefix là tham số
```

#### Loại 4: Tham chiếu Constructor (`ClassName::new`)
```java
Supplier<List<String>> methodRef = ArrayList::new;
Supplier<List<String>> lambda = () -> new ArrayList<>();

Function<Integer, List<String>> methodRef2 = ArrayList::new; // Gọi constructor nhận int initialCapacity
Function<Integer, List<String>> lambda2 = cap -> new ArrayList<>(cap);
```

> [!WARNING]
> **Khi nào KHÔNG THỂ viết thành Method Reference?**
> Nếu bạn cần truyền một tham số cố định vào hàm ngoài danh sách tham số của lambda, bạn không thể dùng method reference:
> ```java
> Predicate<String> lambda = s -> s.startsWith("Zoo"); // Không thể chuyển thành str::startsWith("Zoo")!
> ```

---

## PHẦN 4: CÁC FUNCTIONAL INTERFACE CÓ SẴN (BUILT-IN FUNCTIONAL INTERFACES)

Java cung cấp sẵn các Functional Interface dùng chung trong gói `java.util.function`. Bạn bắt buộc phải thuộc lòng **Bảng 8.4** để làm bài thi OCP.

### 1. Sáu Giao Diện Nền Tảng & Biến Thể Nhị Phân (Bảng 8.4 Chuẩn Sách OCP)

| Functional Interface | Kiểu Trả Về | Tên Phương Thức SAM | Số Lượng Tham Số | Ý Nghĩa / Mục Đích |
| :--- | :---: | :---: | :---: | :--- |
| **`Supplier<T>`** | `T` | **`get()`** | **0** | Cung cấp/sinh ra một đối tượng mà không cần tham số đầu vào. |
| **`Consumer<T>`** | `void` | **`accept(T t)`** | **1 (`T`)** | Nhận vào 1 đối tượng và thực thi hành động, không trả về giá trị. |
| **`BiConsumer<T, U>`** | `void` | **`accept(T t, U u)`** | **2 (`T, U`)** | Nhận vào 2 đối tượng và thực thi hành động, không trả về giá trị. |
| **`Predicate<T>`** | `boolean` | **`test(T t)`** | **1 (`T`)** | Kiểm tra một điều kiện trên đối tượng, trả về `true`/`false`. |
| **`BiPredicate<T, U>`** | `boolean` | **`test(T t, U u)`** | **2 (`T, U`)** | Kiểm tra điều kiện kết hợp giữa 2 đối tượng. |
| **`Function<T, R>`** | `R` | **`apply(T t)`** | **1 (`T`)** | Chuyển đổi một đối tượng từ kiểu `T` sang kiểu `R`. |
| **`BiFunction<T, U, R>`** | `R` | **`apply(T t, U u)`** | **2 (`T, U`)** | Kết hợp 2 đối tượng kiểu `T` và `U` để tạo ra kết quả kiểu `R`. |
| **`UnaryOperator<T>`** | `T` | **`apply(T t)`** | **1 (`T`)** | Là trường hợp đặc biệt của `Function<T, T>` (kiểu đầu vào và đầu ra giống nhau). |
| **`BinaryOperator<T>`** | `T` | **`apply(T t1, T t2)`** | **2 (`T, T`)** | Là trường hợp đặc biệt của `BiFunction<T, T, T>` (2 đầu vào và đầu ra cùng kiểu). |

---

### 2. Các Phương Thức Tiện Ích (Convenience Methods - Bảng 8.5)

Nhiều Functional Interface cung cấp các phương thức `default` và `static` giúp kết hợp logic dễ dàng:

#### 1. Các phương thức của `Predicate`:
* `p1.and(p2)`: Kết hợp logic VÀ (`&&`).
* `p1.or(p2)`: Kết hợp logic HOẶC (`||`).
* `p1.negate()`: Phủ định logic KHÔNG (`!`).
* `Predicate.isEqual(targetRef)`: Phương thức tĩnh kiểm tra bằng `equals()`.

```java
Predicate<String> egg = s -> s.contains("egg");
Predicate<String> brown = s -> s.contains("brown");

Predicate<String> brownEggs = egg.and(brown);
Predicate<String> otherEggs = egg.and(brown.negate());
```

#### 2. Các phương thức của `Consumer`:
* `c1.andThen(c2)`: Chạy `c1` trước, sau đó chạy tiếp `c2` với cùng một dữ liệu đầu vào.

#### 3. Các phương thức của `Function`:
* `f1.andThen(f2)`: Thực thi `f1` trước, sau đó lấy kết quả truyền vào `f2` $\rightarrow$ $f2(f1(x))$.
* `f1.compose(f2)`: Thực thi `f2` trước, sau đó lấy kết quả truyền vào `f1` $\rightarrow$ $f1(f2(x))$.
* `Function.identity()`: Trả về chính đối tượng đầu vào ($f(x) = x$).

```java
Function<Integer, Integer> before = x -> x + 1;
Function<Integer, Integer> after = x -> x * 2;

Function<Integer, Integer> combined = after.compose(before);
System.out.println(combined.apply(3)); // (3 + 1) * 2 = 8
```

---

### 3. Functional Interface Cho Kiểu Nguyên Thuỷ (Primitive Interfaces)

Để tránh hao tổn hiệu năng do cơ chế **Autoboxing / Unboxing**, Java cung cấp các giao diện chuyên biệt cho 3 kiểu nguyên thuỷ: **`int`**, **`long`**, và **`double`** (cộng thêm `BooleanSupplier`).

#### Bảng 8.6: Các giao diện nguyên thuỷ thông dụng
| Interface | Kiểu Trả Về | Tên Phương Thức SAM | Tham Số Đầu Vào |
| :--- | :---: | :---: | :---: |
| `IntSupplier` / `LongSupplier` / `DoubleSupplier` | `int` / `long` / `double` | **`getAsInt()`** / **`getAsLong()`** / **`getAsDouble()`** | 0 |
| `BooleanSupplier` | `boolean` | **`getAsBoolean()`** | 0 |
| `IntConsumer` / `LongConsumer` / `DoubleConsumer` | `void` | **`accept(int/long/double)`** | 1 (`int`/`long`/`double`) |
| `IntPredicate` / `LongPredicate` / `DoublePredicate` | `boolean` | **`test(int/long/double)`** | 1 (`int`/`long`/`double`) |
| `IntFunction<R>` / `LongFunction<R>` / `DoubleFunction<R>` | `R` | **`apply(int/long/double)`** | 1 (`int`/`long`/`double`) |
| `IntUnaryOperator` / `LongUnaryOperator` / `DoubleUnaryOperator` | `int` / `long` / `double` | **`applyAsInt/Long/Double(...)`** | 1 (`int`/`long`/`double`) |
| `IntBinaryOperator` / `LongBinaryOperator` / `DoubleBinaryOperator` | `int` / `long` / `double` | **`applyAsInt/Long/Double(...)`** | 2 (`int, int`,...) |

#### Bảng 8.7: Các giao diện chuyển đổi kiểu nguyên thuỷ đặc thù
* **Chuyển từ Object sang Primitive:** `ToIntFunction<T>`, `ToLongFunction<T>`, `ToDoubleFunction<T>` (phương thức: `applyAsInt(T t)`,...).
* **Chuyển từ 2 Object sang Primitive:** `ToIntBiFunction<T, U>`, `ToLongBiFunction<T, U>`, `ToDoubleBiFunction<T, U>`.
* **Chuyển giữa các Primitive với nhau:** 
  * `IntToDoubleFunction`, `IntToLongFunction`
  * `LongToIntFunction`, `LongToDoubleFunction`
  * `DoubleToIntFunction`, `DoubleToLongFunction`
* **Người tiêu thụ kết hợp Object và Primitive:**
  * `ObjIntConsumer<T>`, `ObjLongConsumer<T>`, `ObjDoubleConsumer<T>` (phương thức: `accept(T t, int value)`).

---

## PHẦN 5: LÀM VIỆC VỚI BIẾN TRONG LAMBDA (VARIABLES IN LAMBDAS)

Biến có thể xuất hiện tại 3 vị trí liên quan đến lambda:
1. Danh sách tham số của lambda.
2. Biến cục bộ được khai báo bên trong thân lambda.
3. Biến được tham chiếu từ bên ngoài phạm vi của lambda.

### 1. Quy Tắc Phạm Vi & Đặt Tên Biến (Variable Scoping)

* Tham số của lambda và biến cục bộ khai báo bên trong thân `{}` của lambda **tuyệt đối KHÔNG ĐƯỢC trùng tên** với bất kỳ biến cục bộ nào đã khai báo trong cùng phương thức bao ngoài:

```java
public void badCode() {
    int a = 10;
    // LỖI BIÊN DỊCH: Biến 'a' đã tồn tại trong phạm vi phương thức!
    Predicate<Integer> p = a -> a > 5; 
}
```

---

### 2. Quy Tắc Truy Cập Biến Bên Ngoài (Bảng 8.8 Chuẩn Sách OCP)

Khi thân lambda sử dụng một biến được khai báo bên ngoài:

| Loại Biến Được Truy Cập | Quy Tắc Truy Cập Từ Thân Lambda |
| :--- | :--- |
| **Biến Instance (`this.x`)** | **LUÔN ĐƯỢC PHÉP** (kể cả khi biến bị thay đổi giá trị). |
| **Biến Static (`Class.x`)** | **LUÔN ĐƯỢC PHÉP** (kể cả khi biến bị thay đổi giá trị). |
| **Biến cục bộ (Local variable)** | **CHỈ ĐƯỢC PHÉP** nếu biến đó là **`final`** hoặc **`effectively final`**! |
| **Tham số của phương thức bao ngoài** | **CHỈ ĐƯỢC PHÉP** nếu là **`final`** hoặc **`effectively final`**! |
| **Tham số của chính lambda** | **LUÔN ĐƯỢC PHÉP**. |

#### Thế nào là một biến `effectively final`?
Một biến cục bộ được coi là **effectively final** nếu giá trị của nó **không bao giờ bị thay đổi** sau khi được gán lần đầu tiên.

```java
public void process(int start) {
    int multiplier = 2; // effectively final
    int counter = 0;
    counter++;          // counter BỊ THAY ĐỔI -> KHÔNG PHẢI effectively final!

    Predicate<Integer> p1 = x -> x * multiplier > start; // HỢP LỆ (start và multiplier là effectively final)
    
    // Predicate<Integer> p2 = x -> x + counter > 0;     // LỖI BIÊN DỊCH do truy cập counter!
}
```

> [!CAUTION]
> **Bẫy thi gán biến bên trong Lambda:**
> Thân lambda **tuyệt đối không được phép sửa đổi giá trị** của bất kỳ biến cục bộ nào bên ngoài nó:
> ```java
> int total = 0;
> Consumer<Integer> c = x -> total += x; // LỖI BIÊN DỊCH: total không còn là effectively final!
> ```

---

## ⚠️ TỔNG KẾT CÁC BẪY THI OCP CHƯƠNG 8 (EXAM TRAPS CHECKLIST)

1. **Ngoặc đơn tham số:** Khai báo kiểu dữ liệu hoặc dùng `var` thì bắt buộc phải có ngoặc đơn `(String s)` hoặc `(var s)`. Cấm viết `var s -> ...`.
2. **Quy tắc pha trộn `var`:** Trong danh sách tham số, hoặc là toàn bộ dùng `var`, hoặc toàn bộ dùng kiểu tường minh, hoặc toàn bộ không khai báo kiểu. Tuyệt đối không được pha trộn `(var a, b)` hay `(var a, String b)`.
3. **Ngoặc nhọn thân hàm:** Có `{}` thì phải có `;`. Nếu có kiểu trả về, có `{}` thì bắt buộc phải có `return;`, không có `{}` thì tuyệt đối cấm dùng `return`.
4. **Gán vào `var`:** `var p = x -> true;` luôn bị lỗi biên dịch do thiếu thông tin kiểu (Target Typing).
5. **Đếm abstract method (SAM):** Các phương thức `public` của `Object` (`equals`, `hashCode`, `toString`) không bao giờ được tính vào quy tắc SAM. Nhưng hãy coi chừng bẫy chữ ký: `boolean equals(MyClass o)` là một abstract method thứ 2!
6. **Tham chiếu phương thức:** `ClassName::instanceMethod` có tham số đầu tiên ngầm định chính là đối tượng gọi phương thức đó tại runtime.
7. **Bảng Built-in Functional Interfaces:**
   * `Supplier<T>`: `get()`
   * `Consumer<T>`: `accept(T)`
   * `Predicate<T>`: `test(T)`
   * `Function<T, R>`: `apply(T)`
8. **Thứ tự của `compose` vs `andThen`:** `f.andThen(g)` thực hiện $g(f(x))$, còn `f.compose(g)` thực hiện $f(g(x))$.
9. **Kiểu trả về của Primitive Supplier:** `getAsInt()`, `getAsLong()`, `getAsDouble()`, `getAsBoolean()` (chú ý tiền tố `getAs`, không phải `get`).
10. **Biến trong Lambda:** Chỉ được đọc biến cục bộ ngoài nếu biến đó là `final` hoặc `effectively final`. Thân lambda không bao giờ được ghi đè/tăng giá trị biến cục bộ ngoài.
