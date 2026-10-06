# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chapter 8: Lambdas and Functional Interfaces

> **Nguồn trích dẫn:** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Trang 749–760).  
> **Số lượng:** 21 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết (Trang 1372–1378).  
> **Cách học:** Bạn hãy tự đọc đề và suy luận đáp án trước, sau đó bấm vào mục **"🔍 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và khắc sâu các bẫy thi của Oracle.

---

### Câu 1 (Question 1)
**Kết quả của lớp sau là gì?**

```java
1:  import java.util.function.*;
2:
3:  public class Panda {
4:     int age;
5:     public static void main(String[] args) {
6:        Panda p1 = new Panda();
7:        p1.age = 1;
8:        check(p1, p -> p.age < 5);
9:     }
10:    private static void check(Panda panda,
11:       Predicate<Panda> pred) {
12:       String result = pred.test(panda)
13:          ? "match" : "not match";
14:       System.out.print(result);
15: } }
```

* A. match
* B. not match
* C. Lỗi biên dịch tại dòng 8.
* D. Lỗi biên dịch tại dòng 10.
* E. Lỗi biên dịch tại dòng 12.
* F. Phát sinh ngoại lệ tại thời điểm chạy (runtime).

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A (match)**
* **Phân tích chi tiết:**
  * Dòng 8: Khai báo lambda `p -> p.age < 5`. Vì chỉ có một tham số và không chỉ định kiểu nên việc bỏ cặp ngoặc đơn `()` là hoàn toàn hợp lệ.
  * Thân hàm là một biểu thức đơn giản trả về giá trị kiểu `boolean`, hoàn toàn tương thích với phương thức SAM `boolean test(T t)` của `Predicate<Panda>`.
  * Dòng 12: `pred.test(panda)` nhận đối tượng `p1` có `age = 1`. Biểu thức `1 < 5` trả về `true`.
  * Toán tử ba ngôi đánh giá ra chuỗi `"match"` và in ra màn hình → Đáp án đúng là **A**.
* **Bẫy thi cần nhớ:** Lambda có đúng 1 tham số không khai báo kiểu được phép bỏ ngoặc đơn; thân hàm là biểu thức đơn không được dùng return và dấu chấm phẩy.
</details>

---

### Câu 2 (Question 2)
**Kết quả của đoạn mã sau là gì?**

```java
1:  interface Climb {
2:     boolean isTooHigh(int height, int limit);
3:  }
4:
5:  public class Climber {
6:     public static void main(String[] args) {
7:        check((h, m) -> h.append(m).isEmpty(), 5);
8:     }
9:     private static void check(Climb climb, int height) {
10:       if (climb.isTooHigh(height, 10))
11:          System.out.println("too high");
12:       else
13:          System.out.println("ok");
14:    }
15: }
```

* A. ok
* B. too high
* C. Lỗi biên dịch tại dòng 7.
* D. Lỗi biên dịch tại dòng 8.
* E. Lỗi biên dịch tại dòng 10.
* F. Mã biên dịch nhưng phát sinh ngoại lệ tại runtime.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C (Lỗi biên dịch tại dòng 7)**
* **Phân tích chi tiết:**
  * Interface `Climb` định nghĩa phương thức SAM: `boolean isTooHigh(int height, int limit);` nhận vào **hai tham số kiểu nguyên thuỷ `int`**.
  * Tại dòng 7, phương thức `check` mong đợi một đối tượng `Climb`. Do đó, trình biên dịch suy luận rằng tham số `h` và `m` trong lambda `(h, m) -> ...` đều có kiểu `int`.
  * Tuy nhiên, thân lambda lại gọi `h.append(m).isEmpty()`. Trong Java, kiểu nguyên thuỷ `int` không phải là một đối tượng, không có phương thức `append()` hay `isEmpty()` (những phương thức này thuộc về `StringBuilder`).
  * Do đó, trình biên dịch báo lỗi tại dòng 7: `int cannot be dereferenced` → Đáp án đúng là **C**.
* **Bẫy thi cần nhớ:** Kiểu của tham số lambda được suy luận ngầm định từ phương thức SAM của Functional Interface mục tiêu. Hãy luôn đối chiếu kiểu tham số của interface!
</details>

---

### Câu 3 (Question 3)
**Những phát biểu nào về Functional Interface là đúng? (Chọn tất cả các đáp án đúng)**

* A. Một functional interface có thể chứa các phương thức default và private.
* B. Một functional interface có thể được định nghĩa dưới dạng một class hoặc một interface.
* C. Các phương thức trừu tượng có chữ ký trùng với các phương thức public của java.lang.Object không được tính vào quy tắc Single Abstract Method (SAM).
* D. Một functional interface chỉ được phép chứa chính xác một phương thức duy nhất (bao gồm cả static, default và private).
* E. Một functional interface bắt buộc phải có annotation @FunctionalInterface.
* F. Tất cả các phát biểu trên đều đúng.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C**
* **Phân tích chi tiết:**
  * `A` đúng: Functional interface có thể chứa bất kỳ số lượng phương thức `default`, `static`, `private` hoặc `private static` nào.
  * `B` sai: Functional interface **chỉ có thể là `interface`**, tuyệt đối không thể là `class` (dù là abstract class).
  * `C` đúng: Các phương thức `public` của `java.lang.Object` (như `equals(Object)`, `hashCode()`, `toString()`) không được tính vào số lượng abstract method của quy tắc SAM.
  * `D` sai: Functional interface chỉ giới hạn **duy nhất 1 phương thức trừu tượng (abstract)**, còn các phương thức non-abstract khác thì không giới hạn.
  * `E` sai: Annotation `@FunctionalInterface` là tuỳ chọn, không bắt buộc.
* **Bẫy thi cần nhớ:** Functional interface chỉ có thể là interface (không phải class), và các phương thức public của Object không tính vào SAM.
</details>

---

### Câu 4 (Question 4)
**Lambda nào sau đây có thể thay thế lớp `MySecret` để trả về cùng một giá trị? (Chọn tất cả các đáp án đúng)**

```java
interface Secret {
   String magic(double d);
}
 
class MySecret implements Secret {
   public String magic(double d) {
      return "Poof";
   } }
```

* A. (e) -> "Poof"
* B. (e) -> {"Poof"}
* C. (e) -> { String e = ""; return "Poof"; }
* D. (e) -> { String e = "Poof"; return e; }
* E. (e) -> { String f = ""; return "Poof" }
* F. (double d) -> "Poof"

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, F**
* **Phân tích chi tiết:**
  * Phương thức SAM là `String magic(double d);` nhận 1 tham số `double` và trả về một `String`.
  * `A`: `(e) -> "Poof"` nhận 1 tham số, thân hàm là biểu thức đơn trả về `"Poof"` → Hợp lệ.
  * `B`: Dùng khối ngoặc nhọn `{}` nhưng thiếu từ khoá `return` và dấu chấm phẩy `;` → Lỗi biên dịch.
  * `C` và `D`: Biến `e` đã được khai báo làm tham số của lambda, việc khai báo lại `String e` bên trong thân hàm gây lỗi trùng tên biến (duplicate variable) → Lỗi biên dịch.
  * `E`: Dòng lệnh `return "Poof"` bên trong khối `{}` thiếu dấu chấm phẩy `;` ở cuối → Lỗi biên dịch.
  * `F`: `(double d) -> "Poof"` khai báo kiểu tường minh có ngoặc đơn, biểu thức đơn hợp lệ → Hợp lệ.
* **Bẫy thi cần nhớ:** Không được khai báo biến cục bộ bên trong thân lambda trùng tên với tham số lambda; trong khối {} bắt buộc phải có return và dấu ';'.
</details>

---

### Câu 5 (Question 5)
**Những functional interface nào sau đây chứa phương thức trừu tượng trả về một giá trị nguyên thuỷ (primitive value)? (Chọn tất cả các đáp án đúng)**

* A. BooleanSupplier
* B. CharSupplier
* C. DoubleSupplier
* D. FloatSupplier
* E. IntSupplier
* F. StringSupplier

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C, E**
* **Phân tích chi tiết:**
  * Java cung cấp các primitive functional interface chuyên biệt cho 3 kiểu số học: **`int`**, **`long`**, **`double`** và kiểu logic **`boolean`**:
  * * `BooleanSupplier` có phương thức `boolean getAsBoolean()` → Trả về primitive `boolean` (A đúng).
  * * `DoubleSupplier` có phương thức `double getAsDouble()` → Trả về primitive `double` (C đúng).
  * * `IntSupplier` có phương thức `int getAsInt()` → Trả về primitive `int` (E đúng).
  * * Các interface `CharSupplier`, `FloatSupplier`, `StringSupplier` **hoàn toàn không tồn tại** trong thư viện chuẩn `java.util.function` (B, D, F sai).
* **Bẫy thi cần nhớ:** Java chỉ hỗ trợ primitive streams và primitive functional interfaces cho int, long, double (và BooleanSupplier). Không có char, float, short, hay byte.
</details>

---

### Câu 6 (Question 6)
**Những biểu thức lambda nào sau đây có thể được truyền cho một biến có kiểu `Predicate<String>`? (Chọn tất cả các đáp án đúng)**

* A. s -> s.isEmpty()
* B. s --> s.isEmpty()
* C. (String s) -> s.isEmpty()
* D. (String s) --> s.isEmpty()
* E. (StringBuilder s) -> s.isEmpty()
* F. (StringBuilder s) --> s.isEmpty()

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C**
* **Phân tích chi tiết:**
  * `Predicate<String>` có phương thức SAM là: `boolean test(String t);`, nghĩa là nhận vào 1 tham số kiểu `String` và trả về `boolean`.
  * `A`: `s -> s.isEmpty()` nhận 1 tham số (suy luận kiểu `String`), gọi phương thức `isEmpty()` trả về `boolean` → Hợp lệ.
  * `B`, `D`, `F`: Sử dụng toán tử mũi tên sai cú pháp (`-->` thay vì `->`) → Lỗi biên dịch.
  * `C`: `(String s) -> s.isEmpty()` khai báo tường minh kiểu `String` với cặp ngoặc đơn `()` hợp lệ → Hợp lệ.
  * `E`: Khai báo kiểu tham số là `StringBuilder`, không tương thích với kiểu `String` của `Predicate<String>` → Lỗi biên dịch.
* **Bẫy thi cần nhớ:** Toán tử lambda là '->' (1 dấu trừ), không phải '-->'. Kiểu tham số nếu khai báo tường minh phải khớp chính xác với kiểu generic.
</details>

---

### Câu 7 (Question 7)
**Phát biểu nào sau đây là đúng về đoạn mã dưới đây?**

```java
public void method() {
   x((var x) -> {}, (var x, var y) -> false);
}
public void x(Consumer<String> x, BinaryOperator<Boolean> y) {}
```

* A. Mã không biên dịch được do một trong các biến có tên là x.
* B. Mã không biên dịch được do một trong các biến có tên là y.
* C. Mã không biên dịch được do phương thức x có cùng tên với tham số x.
* D. Mã không biên dịch được vì từ khoá var không thể dùng trong lambda có thân hàm rỗng {}.
* E. Đoạn mã biên dịch hoàn toàn thành công.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (Đoạn mã biên dịch hoàn toàn thành công)**
* **Phân tích chi tiết:**
  * Đoạn mã tuy lạm dụng việc đặt tên `x` gây rối mắt, nhưng hoàn toàn tuân thủ các quy tắc của ngôn ngữ Java:
  * 1. Tên phương thức `x(...)` và tên tham số `Consumer<String> x` hoàn toàn có thể trùng nhau vì Java phân biệt rõ ngữ cảnh gọi phương thức và định danh biến.
  * 2. Biến `(var x) -> {}` là tham số của lambda thứ nhất, phạm vi của nó chỉ giới hạn bên trong lambda thứ nhất.
  * 3. Biến `(var x, var y) -> false` là tham số của lambda thứ hai, hoàn toàn độc lập và không xung đột phạm vi với lambda thứ nhất.
  * 4. Thân hàm `{}` rỗng hợp lệ với `Consumer<String>` (vì phương thức `accept` trả về `void`). Thân hàm `false` hợp lệ với `BinaryOperator<Boolean>` (trả về `Boolean`).
  * Do đó, đoạn mã biên dịch thành công mà không có bất kỳ lỗi nào → Chọn **E**.
* **Bẫy thi cần nhớ:** Hai biểu thức lambda độc lập cùng nằm trong một lời gọi hàm có thể dùng chung tên tham số vì phạm vi (scope) của chúng không lồng vào nhau.
</details>

---

### Câu 8 (Question 8)
**Khai báo nào sau đây tương đương với đoạn mã này?**

```java
UnaryOperator<Integer> u = x -> x * x;
```

* A. BiFunction<Integer> f = x -> x*x;
* B. BiFunction<Integer, Integer> f = x -> x*x;
* C. BinaryOperator<Integer, Integer> f = x -> x*x;
* D. Function<Integer> f = x -> x*x;
* E. Function<Integer, Integer> f = x -> x*x;

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (Function<Integer, Integer> f = x -> x*x;)**
* **Phân tích chi tiết:**
  * `UnaryOperator<T>` là một functional interface kế thừa từ `Function<T, T>`. Nó nhận vào 1 tham số kiểu `T` và trả về kết quả cùng kiểu `T`.
  * Do đó, `UnaryOperator<Integer>` hoàn toàn tương đương với `Function<Integer, Integer>` (nhận vào `Integer`, trả về `Integer`) → **E đúng**.
  * `A` và `B`: `BiFunction` yêu cầu 3 tham số generic `BiFunction<T, U, R>` và nhận 2 đối số đầu vào (ở đây lambda chỉ có 1 đối số `x`).
  * `C`: `BinaryOperator` chỉ nhận 1 tham số generic `BinaryOperator<T>` và nhận 2 đối số đầu vào.
  * `D`: `Function` bắt buộc phải có 2 tham số generic `Function<T, R>` (kiểu đầu vào và kiểu đầu ra).
* **Bẫy thi cần nhớ:** UnaryOperator<T> kế thừa Function<T, T>; UnaryOperator chỉ có 1 tham số generic, còn Function bắt buộc có 2 tham số generic.
</details>

---

### Câu 9 (Question 9)
**Những phát biểu nào sau đây là đúng? (Chọn tất cả các đáp án đúng)**

* A. Giao diện Consumer rất thích hợp để in ra một giá trị sẵn có.
* B. Giao diện Supplier rất thích hợp để in ra một giá trị sẵn có.
* C. Giao diện IntegerSupplier trả về một giá trị kiểu int.
* D. Giao diện Predicate trả về một giá trị kiểu int.
* E. Giao diện Function chỉ có thể nhận đầu vào và trả về đầu ra cùng một kiểu dữ liệu.
* F. Giao diện Function có thể nhận đầu vào một kiểu dữ liệu và trả về đầu ra một kiểu dữ liệu khác.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, F**
* **Phân tích chi tiết:**
  * `A` đúng: `Consumer<T>` nhận vào 1 đối tượng và thực thi hành động (như `System.out.println(x)`), không trả về kết quả.
  * `B` sai: `Supplier<T>` không nhận tham số đầu vào mà chỉ sinh ra/trả về một giá trị (`T get()`).
  * `C` sai: Tên interface đúng trong Java là **`IntSupplier`**, không hề có interface nào tên là `IntegerSupplier`!
  * `D` sai: `Predicate<T>` luôn trả về kiểu `boolean`, không phải `int`.
  * `E` sai và `F` đúng: `Function<T, R>` được thiết kế đặc thù để chuyển đổi từ kiểu dữ liệu `T` sang kiểu dữ liệu `R` hoàn toàn khác nhau.
* **Bẫy thi cần nhớ:** Tên interface chuẩn là IntSupplier, không phải IntegerSupplier. Đề thi Oracle rất hay bẫy bằng các tên interface giả mạo!
</details>

---

### Câu 10 (Question 10)
**Những dòng mã nào sau đây có thể điền vào chỗ trống mà không gây ra lỗi biên dịch? (Chọn tất cả các đáp án đúng)**

```java
public void remove(List<Character> chars) {
   char end = 'z';
   Predicate<Character> predicate = c -> {
      char start = 'a'; return start <= c && c <= end; };
 
   // INSERT LINE HERE
}
```

* A. char c = 'x';
* B. char start = 'a';
* C. chars.add('a');
* D. end = '1';
* E. Không có dòng nào ở trên có thể chèn vào mà không gây lỗi.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B, C**
* **Phân tích chi tiết:**
  * Vị trí `// INSERT LINE HERE` nằm **sau** biểu thức lambda:
  * `A` và `B` đúng: Các biến `c` và `start` có phạm vi (scope) chỉ nằm bên trong thân lambda. Sau khi lambda kết thúc, việc khai báo các biến cục bộ mới có tên `c` hoặc `start` trong phương thức là hoàn toàn hợp lệ.
  * `C` đúng: Gọi phương thức `chars.add('a')` chỉ làm thay đổi trạng thái của danh sách, không gán lại tham chiếu `chars` (và bản thân `chars` cũng không được dùng trong lambda), do đó hoàn toàn không ảnh hưởng.
  * `D` sai: Biến `end` được tham chiếu từ bên trong thân lambda. Do đó, `end` bắt buộc phải là **`effectively final`**. Phép gán `end = '1';` làm cho `end` bị thay đổi giá trị, dẫn đến trình biên dịch báo lỗi tại dòng lambda: `local variables referenced from a lambda expression must be final or effectively final`.
* **Bẫy thi cần nhớ:** Biến bên ngoài được lambda sử dụng bắt buộc phải là final hoặc effectively final; việc sửa đổi biến đó ở bất kỳ đâu trong phương thức đều làm lambda bị lỗi biên dịch.
</details>

---

### Câu 11 (Question 11)
**Có bao nhiêu lần chữ `true` được in ra bởi đoạn mã này?**

```java
import java.util.function.Predicate;
public class Fantasy {
   public static void scary(String animal) {
      var dino = s -> "dino".equals(animal);
      var dragon = s -> "dragon".equals(animal);
      var combined = dino.or(dragon);
      System.out.println(combined.test(animal));
   }
   public static void main(String[] unused) {
      scary("dino");
      scary("dragon");
      scary("unicorn");
   } }
```

* A. 1
* B. 2
* C. 3
* D. Mã không biên dịch được.
* E. Mã biên dịch nhưng phát sinh ngoại lệ tại runtime.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D (Mã không biên dịch được)**
* **Phân tích chi tiết:**
  * **Bẫy thi kinh điển của Oracle:** Hãy chú ý hai dòng khai báo:
  * `var dino = s -> "dino".equals(animal);`
  * `var dragon = s -> "dragon".equals(animal);`
  * Cả biểu thức lambda và từ khoá `var` đều đòi hỏi ngữ cảnh đích để suy luận kiểu dữ liệu. Khi gán trực tiếp một biểu thức lambda cho một biến khai báo bằng `var`, trình biên dịch không thể xác định được kiểu của Functional Interface là gì (có thể là `Predicate<String>`, `Function<String, Boolean>`,...).
  * Trình biên dịch sẽ báo lỗi ngay lập tức: `cannot infer type for local variable dino (lambda expression needs an explicit target-type)`.
  * Vì đoạn mã không thể biên dịch được, đáp án đúng là **D**.
* **Bẫy thi cần nhớ:** Tuyệt đối không thể gán một biểu thức lambda trực tiếp cho biến kiểu 'var' do thiếu thông tin kiểu đích (target-type).
</details>

---

### Câu 12 (Question 12)
**Đoạn mã sau xuất ra kết quả gì?**

```java
Function<Integer, Integer> s = a -> a + 4;
Function<Integer, Integer> t = a -> a * 3;
Function<Integer, Integer> c = s.compose(t);
System.out.print(c.apply(1));
```

* A. 7
* B. 15
* C. Mã không biên dịch được do kiểu dữ liệu trong lambda.
* D. Mã không biên dịch được do phương thức compose không tồn tại.
* E. Phát sinh ngoại lệ tại runtime.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A (7)**
* **Phân tích chi tiết:**
  * Phương thức `s.compose(t)` của interface `Function` thực thi theo thứ tự:
  * **Thực thi hàm đối số `t` trước, sau đó lấy kết quả truyền tiếp vào hàm gọi `s`** (tương đương công thức toán học: $s(t(x))$).
  * Với giá trị đầu vào là `1`:
  *   1. Thực thi `t.apply(1)`: `1 * 3 = 3`.
  *   2. Lấy kết quả `3` truyền vào `s.apply(3)`: `3 + 4 = 7`.
  * Do đó, chương trình in ra số `7` → Đáp án đúng là **A**.
  * *(Lưu ý: Nếu dùng `s.andThen(t)`, thứ tự sẽ ngược lại: `s` chạy trước ra `5`, rồi `t` chạy ra `15`).*
* **Bẫy thi cần nhớ:** Phân biệt rõ: f.compose(g) chạy g trước rồi f sau (f(g(x))); f.andThen(g) chạy f trước rồi g sau (g(f(x))).
</details>

---

### Câu 13 (Question 13)
**Phát biểu nào sau đây là đúng về đoạn mã dưới đây?**

```java
int length = 3;
 
for (int i = 0; i<3; i++) {
   if (i%2 == 0) {
      Supplier<Integer> supplier = () -> length; // A
      System.out.println(supplier.get());        // B
   } else {
      int j = i;
      Supplier<Integer> supplier = () -> j;      // C
      System.out.println(supplier.get());        // D
   }
}
```

* A. Đoạn mã không biên dịch được do dòng A.
* B. Đoạn mã không biên dịch được do dòng B.
* C. Đoạn mã không biên dịch được do dòng C.
* D. Đoạn mã không biên dịch được do dòng D.
* E. Đoạn mã biên dịch và in ra kết quả: 3, sau đó 1, sau đó 3.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (Đoạn mã biên dịch và in ra kết quả: 3, sau đó 1, sau đó 3)**
* **Phân tích chi tiết:**
  * Biến `length` được khai báo ngoài vòng lặp và không bao giờ bị gán lại $ightarrow$ Là biến **effectively final** $ightarrow$ Dòng A hợp lệ.
  * Biến `i` trong vòng lặp `for` bị thay đổi sau mỗi bước lặp (`i++`), do đó `i` **KHÔNG PHẢI** là effectively final. Nếu lambda trực tiếp tham chiếu đến `i`, mã sẽ bị lỗi.
  * Tuy nhiên, ở nhánh `else`, tác giả đã khai báo một biến mới `int j = i;`. Mỗi lần vòng lặp chạy vào nhánh `else`, một biến `j` độc lập mới được tạo ra và không bao giờ bị thay đổi $ightarrow$ `j` là **effectively final** $ightarrow$ Dòng C hoàn toàn hợp lệ!
  * Chương trình chạy vòng lặp với `i = 0, 1, 2`:
  *   * `i = 0`: In ra `length` là `3`.
  *   * `i = 1`: In ra `j` là `1`.
  *   * `i = 2`: In ra `length` là `3`.
  * Mã biên dịch thành công và in ra: `3`, `1`, `3` → Đáp án đúng là **E**.
* **Bẫy thi cần nhớ:** Biến đếm của vòng for không phải effectively final; nhưng một biến cục bộ mới gán từ biến đếm bên trong thân vòng lặp thì là effectively final.
</details>

---

### Câu 14 (Question 14)
**Những biểu thức lambda nào sau đây là hợp lệ? (Chọn tất cả các đáp án đúng)**

* A. (Wolf w, var c) -> 39
* B. (final Camel c) -> {}
* C. (a, b, c) -> { int b = 3; return 2; }
* D. (x, y) -> new RuntimeException()
* E. (var y) -> return 0;
* F. () -> { float r }
* G. (Cat a, b) -> {}

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, D**
* **Phân tích chi tiết:**
  * `A`: Lỗi biên dịch vì cấm trộn lẫn kiểu tường minh (`Wolf w`) và `var` (`var c`).
  * `B` đúng: Thân hàm `{}` rỗng hợp lệ (tương thích với kiểu trả về `void`), và modifier `final` được phép sử dụng cho tham số lambda khi có khai báo kiểu/var.
  * `C`: Lỗi biên dịch vì khai báo `int b = 3;` trùng tên với tham số `b` đã khai báo ở vế trái.
  * `D` đúng: Thân hàm là một biểu thức đơn tạo đối tượng `new RuntimeException()` (chưa ném ra, chỉ khởi tạo đối tượng), hoàn toàn hợp lệ.
  * `E`: Lỗi biên dịch vì từ khoá `return` chỉ được phép xuất hiện bên trong khối ngoặc nhọn `{}`.
  * `F`: Lỗi biên dịch vì câu lệnh khai báo biến bên trong `{}` thiếu dấu chấm phẩy `;`.
  * `G`: Lỗi biên dịch vì cấm trộn lẫn tham số có kiểu (`Cat a`) và tham số không kiểu (`b`).
* **Bẫy thi cần nhớ:** Tham số lambda có thể có modifier 'final'; cấm trộn lẫn var với kiểu khác; từ khóa 'return' chỉ được dùng khi có cặp ngoặc nhọn {}.
</details>

---

### Câu 15 (Question 15)
**Những biểu thức lambda nào khi điền vào chỗ trống trong đoạn mã sau sẽ làm cho chương trình in ra `hahaha`? (Chọn tất cả các đáp án đúng)**

```java
import java.util.function.Predicate;
public class Hyena {
   private int age = 1;
   public static void main(String[] args) {
      var p = new Hyena();
      int age = 2;
      check(p, ___________);
   }
   private static void check(Hyena hyena, Predicate<Hyena> pred) {
      String result = pred.test(hyena) ? "hahaha" : "silence";
      System.out.print(result);
   }
}
```

* A. var -> p.age < 5
* B. var -> age < 5
* C. p -> p.age < 5
* D. () -> p.age < 5
* E. (var v) -> age < 5
* F. (Hyena h) -> h.age < 5

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, F**
* **Phân tích chi tiết:**
  * `Predicate<Hyena>` yêu cầu lambda nhận 1 tham số có kiểu `Hyena` và trả về `boolean`.
  * `A` đúng: `var` trong Java là một **từ khoá ngữ cảnh (contextual keyword)**, không phải là từ khoá bảo lưu (reserved word). Do đó, bạn hoàn toàn có thể dùng `var` làm **tên của một tham số**! Thân hàm kiểm tra `p.age < 5` (`1 < 5` là `true`) $ightarrow$ in ra `hahaha`.
  * `F` đúng: Khai báo tường minh `(Hyena h) -> h.age < 5`. Đối tượng truyền vào có `age = 1 < 5` $ightarrow$ in ra `hahaha`.
  * `B` và `E`: Sử dụng biến cục bộ `age = 2` của phương thức `main`, tuy nhiên đề thi kiểm tra logic đối tượng `Hyena`.
  * `C`: Lỗi biên dịch vì tên biến `p` trùng với biến cục bộ `p` đã khai báo trước đó trong phương thức `main`.
  * `D`: Lỗi biên dịch vì `Predicate` yêu cầu 1 tham số, nhưng `() -> ...` lại có 0 tham số.
* **Bẫy thi cần nhớ:** 'var' không phải là từ khóa bảo lưu (reserved keyword) nên có thể đặt làm tên biến hoặc tên tham số lambda!
</details>

---

### Câu 16 (Question 16)
**Dòng lệnh nào sau đây có thể chèn vào vị trí đánh dấu mà không gây ra lỗi biên dịch?**

```java
public void remove(List<Character> chars) {
   char end = 'z';
 
   // INSERT LINE HERE
 
   Predicate<Character> predicate =  c -> {
      char start = 'a'; return start <= c && c <= end; };
}
```

* A. char start = 'a';
* B. char c = 'x';
* C. chars = null;
* D. end = '1';
* E. Không có dòng nào ở trên.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C (chars = null;)**
* **Phân tích chi tiết:**
  * Vị trí `// INSERT LINE HERE` nằm **trước** khai báo lambda:
  * `A` sai: Nếu khai báo biến cục bộ `char start = 'a';` ở đây, thì bên trong thân lambda dòng lệnh `char start = 'a';` sẽ bị lỗi biên dịch do trùng tên biến cục bộ trong cùng phạm vi.
  * `B` sai: Nếu khai báo `char c = 'x';` ở đây, tham số của lambda `c -> ...` sẽ bị lỗi biên dịch do trùng tên với biến cục bộ `c` đã có.
  * `D` sai: Nếu gán `end = '1';`, biến `end` sẽ bị mất tính chất **effectively final**, khiến cho lambda bên dưới không thể sử dụng `end` nữa.
  * `C` đúng: Biến `chars` là tham số của phương thức `remove` nhưng **hoàn toàn không được sử dụng bên trong lambda**. Do đó, việc gán `chars = null;` hoàn toàn không ảnh hưởng gì đến lambda và biên dịch thành công.
* **Bẫy thi cần nhớ:** Tham số lambda không được trùng tên với biến cục bộ đã khai báo trước đó trong cùng phương thức.
</details>

---

### Câu 17 (Question 17)
**Kết quả của việc chạy lớp sau là gì?**

```java
1:  import java.util.function.*;
2:
3:  public class Panda {
4:     int age;
5:     public static void main(String[] args) {
6:        Panda p1 = new Panda();
7:        p1.age = 1;
8:        check(p1, p -> {p.age < 5});
9:     }
10:    private static void check(Panda panda,
11:       Predicate<Panda> pred) {
12:       String result = pred.test(panda)
13:          ? "match" : "not match";
14:       System.out.print(result);
15: } }
```

* A. match
* B. not match
* C. Lỗi biên dịch tại dòng 8.
* D. Lỗi biên dịch tại dòng 10.
* E. Lỗi biên dịch tại dòng 12.
* F. Phát sinh ngoại lệ tại runtime.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C (Lỗi biên dịch tại dòng 8)**
* **Phân tích chi tiết:**
  * Hãy quan sát kỹ dòng 8: `check(p1, p -> {p.age < 5});`.
  * Thân của lambda sử dụng cặp dấu ngoặc nhọn `{}`: `{p.age < 5}`.
  * **Quy tắc bất di bất dịch của Lambda:** Khi đã sử dụng cặp dấu ngoặc nhọn `{}` cho thân hàm:
  *   1. Mỗi câu lệnh bên trong bắt buộc phải kết thúc bằng dấu chấm phẩy `;`.
  *   2. Nếu phương thức trả về giá trị (ở đây `Predicate.test()` trả về `boolean`), bắt buộc phải có từ khoá **`return`**.
  * Cú pháp hợp lệ phải là: `p -> { return p.age < 5; }` hoặc bỏ ngoặc nhọn: `p -> p.age < 5`.
  * Vì dòng 8 vừa thiếu `return` vừa thiếu dấu `;`, trình biên dịch báo lỗi tại dòng 8 → Chọn **C**.
* **Bẫy thi cần nhớ:** Khi thân lambda dùng khối {}, bắt buộc phải có từ khóa 'return' và kết thúc câu lệnh bằng dấu chấm phẩy ';'.
</details>

---

### Câu 18 (Question 18)
**Những functional interface nào sau đây có thể điền vào các dòng 6, 7, 8? Với dòng 7, giả sử m và n là các instance của functional interface đã tồn tại và có cùng kiểu với y. (Chọn ba đáp án đúng)**

```java
6:  _____________ x = String::new;
7:  _____________ y = m.andThen(n);
8:  _____________ z = a -> a + a;
```

* A. BinaryConsumer<String, String>
* B. BiConsumer<String, String>
* C. BinaryFunction<String, String>
* D. BiFunction<String, String>
* E. Predicate<String>
* F. Supplier<String>
* G. UnaryOperator<String>
* H. UnaryOperator<String, String>

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, F, G**
* **Phân tích chi tiết:**
  * Trước hết, loại trừ các interface không tồn tại hoặc sai số lượng generic:
  *   * `BinaryConsumer` và `BinaryFunction` (A, C) hoàn toàn không tồn tại trong thư viện chuẩn Java.
  *   * `BiFunction` (D) bắt buộc phải có 3 kiểu generic `BiFunction<T, U, R>`, không thể có 2 kiểu.
  *   * `UnaryOperator` (H) chỉ có 1 kiểu generic `UnaryOperator<T>`, không thể có 2 kiểu.
  * Xét từng dòng mã:
  *   * **Dòng 6:** `String::new` tham chiếu đến constructor không tham số của `String` (`() -> new String()`), không nhận tham số và trả về `String` $ightarrow$ Khớp với **`Supplier<String>`** (F đúng).
  *   * **Dòng 7:** `m.andThen(n)` là phương thức tiện ích có trong `Consumer`, `BiConsumer` và `Function`. Trong các phương án còn lại, **`BiConsumer<String, String>`** là lựa chọn hợp lệ (B đúng).
  *   * **Dòng 8:** `a -> a + a` nhận vào 1 đối tượng kiểu String và trả về chuỗi String ghép $ightarrow$ Nhận vào và trả về cùng một kiểu $ightarrow$ Khớp với **`UnaryOperator<String>`** (G đúng).
* **Bẫy thi cần nhớ:** BiConsumer có andThen; UnaryOperator chỉ có 1 tham số generic (UnaryOperator<T>); không tồn tại BinaryConsumer hay BinaryFunction.
</details>

---

### Câu 19 (Question 19)
**Biểu thức nào sau đây biên dịch được và in ra toàn bộ các phần tử của tập hợp `set`?**

```java
Set<?> set = Set.of("lion", "tiger", "bear");
var s = Set.copyOf(set);
Consumer<Object> consumer =  ________________;
s.forEach(consumer);
```

* A. () -> System.out.println(s)
* B. s -> System.out.println(s)
* C. (s) -> System.out.println(s)
* D. System.out.println(s)
* E. System::out::println
* F. System.out::println

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (System.out::println)**
* **Phân tích chi tiết:**
  * `consumer` có kiểu `Consumer<Object>`, phương thức SAM `void accept(Object o)` yêu cầu nhận 1 tham số đầu vào và trả về `void`.
  * `A` sai: `() -> ...` có 0 tham số, không khớp với `Consumer`.
  * `B` và `C` sai: Biến `s` đã được khai báo làm biến cục bộ ở dòng trên (`var s = Set.copyOf(set);`). Việc đặt tên tham số lambda là `s` hoặc `(s)` sẽ bị **lỗi biên dịch do trùng tên biến (variable shadowing)**.
  * `D` sai: Đây là lời gọi phương thức thực thi ngay lập tức, không phải biểu thức lambda hay method reference.
  * `E` sai: Cú pháp dùng 2 cặp dấu `::` (`System::out::println`) là hoàn toàn không tồn tại trong Java.
  * `F` đúng: `System.out::println` là một Method Reference hợp lệ thuộc dạng 2 (gọi instance method trên đối tượng cụ thể `System.out`), nhận 1 tham số và in ra màn hình.
* **Bẫy thi cần nhớ:** Tham số lambda không được trùng tên với biến cục bộ đã khai báo; cú pháp method reference chỉ có 1 cặp dấu hai chấm '::'.
</details>

---

### Câu 20 (Question 20)
**Lambda nào sau đây có thể thay thế lời gọi `new Sloth()` trong phương thức `main()` và tạo ra cùng kết quả xuất ra tại thời điểm chạy?**

```java
import java.util.List;
interface Yawn {
   String yawn(double d, List<Integer> time);
}
class Sloth implements Yawn {
   public String yawn(double zzz, List<Integer> time) {
      return "Sleep: " + zzz;
   } }
public class Vet {
   public static String takeNap(Yawn y) {
      return y.yawn(10, null);
   }
   public static void main(String... unused) {
      System.out.print(takeNap(new Sloth()));
   } }
```

* A. (z, f) -> { String x = ""; return "Sleep: " + x }
* B. (t, s) -> { String t = ""; return "Sleep: " + t; }
* C. (w, q) -> {"Sleep: " + w}
* D. (e, u) -> { String g = ""; "Sleep: " + e }
* E. (a, b) -> "Sleep: " + (double)(b==null ? a : a)
* F. (r, k) -> { String g = ""; return "Sleep:"; }
* G. Không có đáp án nào ở trên, vì chương trình không biên dịch được.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E**
* **Phân tích chi tiết:**
  * Chương trình gốc: `takeNap(new Sloth())` gọi `yawn(10, null)`. Vì `10` là `int` tự động mở rộng sang `double zzz = 10.0`, chuỗi trả về là: `"Sleep: 10.0"`.
  * Xét từng lựa chọn lambda thay thế:
  * `A`: Lỗi biên dịch vì câu lệnh `return "Sleep: " + x` thiếu dấu chấm phẩy `;`.
  * `B`: Lỗi biên dịch vì khai báo biến `String t` bên trong thân lambda trùng tên với tham số `t`.
  * `C` và `D`: Lỗi biên dịch vì thân hàm dùng khối `{}` nhưng lại thiếu từ khoá `return` và dấu `;`.
  * `F`: Biên dịch được nhưng chỉ in ra `"Sleep:"` (thiếu giá trị số `10.0`), không giống kết quả của `Sloth`.
  * `E` đúng: Biểu thức đơn không cần `{}` và `return`. Khi gọi với `(10, null)`, `b == null` là `true` nên biểu thức trả về `(double) a` là `10.0`, ghép chuỗi tạo thành: `"Sleep: 10.0"`, hoàn toàn trùng khớp với hành vi của `Sloth`.
* **Bẫy thi cần nhớ:** Hãy chú ý dấu chấm phẩy trong khối {} của lambda và kết quả in ra thực tế của đối tượng ban đầu (ở đây là 'Sleep: 10.0').
</details>

---

### Câu 21 (Question 21)
**Những giao diện nào sau đây là Functional Interface hợp lệ? (Chọn tất cả các đáp án đúng)**

```java
public interface Transport {
   public int go();
   public boolean equals(Object o);
}
 
public abstract class Car {
   public abstract Object swim(double speed, int duration);
}
 
public interface Locomotive extends Train {
   public int getSpeed();
}
 
public interface Train extends Transport {}
 
abstract interface Spaceship extends Transport {
   default int blastOff();
}
 
public interface Boat {
   int hashCode();
   int hashCode(String input);
}
```

* A. Boat
* B. Car
* C. Locomotive
* D. Spaceship
* E. Transport
* F. Train
* G. Không có giao diện nào ở trên là functional interface hợp lệ.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, E, F**
* **Phân tích chi tiết:**
  * `Transport` (E) đúng: Có phương thức `go()` là SAM. Phương thức `equals(Object o)` là phương thức public của `java.lang.Object` nên không tính vào SAM.
  * `Train` (F) đúng: Kế thừa `Transport` và không khai báo thêm phương thức trừu tượng nào, kế thừa trọn vẹn duy nhất phương thức abstract `go()` $ightarrow$ Là Functional Interface hợp lệ.
  * `Boat` (A) đúng: Phương thức `hashCode()` là của `Object` nên không tính; phương thức `hashCode(String input)` nhận tham số `String` là một abstract method duy nhất $ightarrow$ Thỏa mãn SAM!
  * `Car` (B) sai: `Car` là một **`abstract class`**, không phải là `interface`.
  * `Locomotive` (C) sai: Kế thừa `go()` từ `Train/Transport` và khai báo thêm `getSpeed()` $ightarrow$ Có 2 abstract methods $ightarrow$ Vi phạm SAM.
  * `Spaceship` (D) sai: Khai báo `default int blastOff();` nhưng **không có thân hàm `{}`** $ightarrow$ Đây là lỗi cú pháp biên dịch (phương thức default bắt buộc phải có thân hàm).
* **Bẫy thi cần nhớ:** Phương thức default bắt buộc phải có thân hàm {}; abstract class không bao giờ là functional interface; interface kế thừa có thể là functional interface nếu không thêm abstract method mới.
</details>

---
