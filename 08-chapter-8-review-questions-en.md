# Review Questions (Bộ Câu Hỏi Ôn Tập Tiếng Anh) - Chapter 8: Lambdas and Functional Interfaces

> **Source (Nguồn trích dẫn):** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Pages 749–760).  
> **Total Questions (Số lượng):** 21 official Oracle exam-style multiple-choice questions with detailed explanations (Pages 1372–1378).  
> **How to study (Cách học):** Read the verbatim English question and deduce your answer first, then click **"👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)"** to check the official explanation and Vietnamese deep-dive analysis.

---

### Question 1 (Câu 1)
**What is the result of the following class?**

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

* A. `match`
* B. `not match`
* C. Compiler error on line 8
* D. Compiler error on lines 10 and 11
* E. Compiler error on lines 12 and 13
* F. A runtime exception

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** This code is correct. Line 8 creates a lambda expression that checks whether the age is less than 5, making option A correct. Since there is only one parameter and it does not specify a type, the parentheses around the parameter are optional. Lines 11 and 13 use the `Predicate` interface, which declares a `test()` method.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 8: Khai báo lambda `p -> p.age < 5`. Vì chỉ có một tham số và không chỉ định kiểu nên việc bỏ cặp ngoặc đơn `()` là hoàn toàn hợp lệ.
    * Thân hàm là một biểu thức đơn giản trả về giá trị kiểu `boolean`, hoàn toàn tương thích với phương thức SAM `boolean test(T t)` của `Predicate<Panda>`.
    * Dòng 12: `pred.test(panda)` nhận đối tượng `p1` có `age = 1`. Biểu thức `1 < 5` trả về `true`.
    * Toán tử ba ngôi đánh giá ra chuỗi `"match"` và in ra màn hình → Đáp án đúng là **A**.
    * **Bẫy thi cần nhớ:** Lambda có đúng 1 tham số không khai báo kiểu được phép bỏ ngoặc đơn; thân hàm là biểu thức đơn không được dùng return và dấu chấm phẩy.
</details>

---

### Question 2 (Câu 2)
**What is the result of the following code?**

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

* A. `ok`
* B. `too high`
* C. Compiler error on line 7.
* D. Compiler error on line 10.
* E. Compiler error on a different line.
* F. A runtime exception is thrown.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The interface takes two `int` parameters. The code on line 7 attempts to use them as if `h` is a `StringBuilder`, making option C correct. It is tricky to use types in a lambda when they are implicitly specified. Remember to check the interface for the real type.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Interface `Climb` định nghĩa phương thức SAM: `boolean isTooHigh(int height, int limit);` nhận vào **hai tham số kiểu nguyên thuỷ `int`**.
    * Tại dòng 7, phương thức `check` mong đợi một đối tượng `Climb`. Do đó, trình biên dịch suy luận rằng tham số `h` và `m` trong lambda `(h, m) -> ...` đều có kiểu `int`.
    * Tuy nhiên, thân lambda lại gọi `h.append(m).isEmpty()`. Trong Java, kiểu nguyên thuỷ `int` không phải là một đối tượng, không có phương thức `append()` hay `isEmpty()` (những phương thức này thuộc về `StringBuilder`).
    * Do đó, trình biên dịch báo lỗi tại dòng 7: `int cannot be dereferenced` → Đáp án đúng là **C**.
    * **Bẫy thi cần nhớ:** Kiểu của tham số lambda được suy luận ngầm định từ phương thức SAM của Functional Interface mục tiêu. Hãy luôn đối chiếu kiểu tham số của interface!
</details>

---

### Question 3 (Câu 3)
**Which statements about functional interfaces are true? (Choose all that apply.)**

* A. A functional interface can contain `default` and `private` methods.
* B. A functional interface can be defined as a class or an interface.
* C. Abstract methods with signatures that are contained in `public` methods of `java.lang.Object` do not count toward the abstract method count for a functional interface.
* D. A functional interface cannot contain `static` or `private static` methods.
* E. A functional interface must be marked with the `@FunctionalInterface` annotation.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** A functional interface can contain any number of nonabstract methods, including `default`, `private`, `static`, and `private static`. For this reason, option A is correct, and option D is incorrect. Option B is incorrect, as classes are never considered functional interfaces. A functional interface contains exactly one abstract method, although methods that have matching signatures as `public` methods in `java.lang.Object` do not count toward the single method test. For these reasons, option C is correct. Finally, option E is incorrect. While a functional interface can be marked with the `@FunctionalInterface` annotation, it is not required.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * `A` đúng: Functional interface có thể chứa bất kỳ số lượng phương thức `default`, `static`, `private` hoặc `private static` nào.
    * `B` sai: Functional interface **chỉ có thể là `interface`**, tuyệt đối không thể là `class` (dù là abstract class).
    * `C` đúng: Các phương thức `public` của `java.lang.Object` (như `equals(Object)`, `hashCode()`, `toString()`) không được tính vào số lượng abstract method của quy tắc SAM.
    * `D` sai: Functional interface chỉ giới hạn **duy nhất 1 phương thức trừu tượng (abstract)**, còn các phương thức non-abstract khác thì không giới hạn.
    * `E` sai: Annotation `@FunctionalInterface` là tuỳ chọn, không bắt buộc.
    * **Bẫy thi cần nhớ:** Functional interface chỉ có thể là interface (không phải class), và các phương thức public của Object không tính vào SAM.
</details>

---

### Question 4 (Câu 4)
**Which lambda can replace the `MySecret` class to return the same value? (Choose all that apply.)**

```java
interface Secret {
   String magic(double d);
}
 
class MySecret implements Secret {
   public String magic(double d) {
      return "Poof";
   } }
```

* A. `(e) -> "Poof"`
* B. `(e) -> {"Poof"}`
* C. `(e) -> { String e = ""; "Poof" }`
* D. `(e) -> { String e = ""; return "Poof"; }`
* E. `(e) -> { String e = ""; return "Poof" }`
* F. `(e) -> { String f = ""; return "Poof"; }`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Option B is incorrect because it does not use the `return` keyword. Options C, D, and E are incorrect because the variable `e` is already in use from the lambda and cannot be redefined. Additionally, option C is missing the `return` keyword, and option E is missing the semicolon. Therefore, options A and F are correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Phương thức SAM là `String magic(double d);` nhận 1 tham số `double` và trả về một `String`.
    * `A`: `(e) -> "Poof"` nhận 1 tham số, thân hàm là biểu thức đơn trả về `"Poof"` → Hợp lệ.
    * `B`: Dùng khối ngoặc nhọn `{}` nhưng thiếu từ khoá `return` và dấu chấm phẩy `;` → Lỗi biên dịch.
    * `C` và `D`: Biến `e` đã được khai báo làm tham số của lambda, việc khai báo lại `String e` bên trong thân hàm gây lỗi trùng tên biến (duplicate variable) → Lỗi biên dịch.
    * `E`: Dòng lệnh `return "Poof"` bên trong khối `{}` thiếu dấu chấm phẩy `;` ở cuối → Lỗi biên dịch.
    * `F`: `(e) -> { String f = ""; return "Poof"; }` khai báo biến `f` không trùng tên tham số `e` và có đầy đủ `return` cùng dấu `;` → Hợp lệ.
    * **Bẫy thi cần nhớ:** Không được khai báo biến cục bộ bên trong thân lambda trùng tên với tham số lambda; trong khối {} bắt buộc phải có return và dấu ';'.
</details>

---

### Question 5 (Câu 5)
**Which of the following functional interfaces contain an abstract method that returns a primitive value? (Choose all that apply.)**

* A. `BooleanSupplier`
* B. `CharSupplier`
* C. `DoubleSupplier`
* D. `FloatSupplier`
* E. `IntSupplier`
* F. `StringSupplier`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, C, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Java includes support for three primitive streams, along with numerous functional interfaces to go with them: `int`, `double`, and `long`. For this reason, options C and E are correct. Additionally, there is a `BooleanSupplier` functional interface, making option A correct. Java does not include primitive streams or related functional interfaces for other numeric data types, making options B and D incorrect. Option F is incorrect because `String` is not a primitive but an object. Only primitives have custom suppliers.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Java cung cấp các primitive functional interface chuyên biệt cho 3 kiểu số học: **`int`**, **`long`**, **`double`** và kiểu logic **`boolean`**:
    * * `BooleanSupplier` có phương thức `boolean getAsBoolean()` → Trả về primitive `boolean` (A đúng).
    * * `DoubleSupplier` có phương thức `double getAsDouble()` → Trả về primitive `double` (C đúng).
    * * `IntSupplier` có phương thức `int getAsInt()` → Trả về primitive `int` (E đúng).
    * * Các interface `CharSupplier`, `FloatSupplier`, `StringSupplier` **hoàn toàn không tồn tại** trong thư viện chuẩn `java.util.function` (B, D, F sai).
    * **Bẫy thi cần nhớ:** Java chỉ hỗ trợ primitive streams và primitive functional interfaces cho int, long, double (và BooleanSupplier). Không có char, float, short, hay byte.
</details>

---

### Question 6 (Câu 6)
**Which of the following lambda expressions can be passed to a function of `Predicate<String>` type? (Choose all that apply.)**

* A. `s -> s.isEmpty()`
* B. `s --> s.isEmpty()`
* C. `(String s) -> s.isEmpty()`
* D. `(String s) --> s.isEmpty()`
* E. `(StringBuilder s) -> s.isEmpty()`
* F. `(StringBuilder s) --> s.isEmpty()`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** `Predicate<String>` takes a parameter list of one parameter using the specified type. Options E and F are incorrect because they specify the wrong type. Options B, D, and F are incorrect because they use the wrong syntax for the arrow operator. This leaves us with options A and C as the answers.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * `Predicate<String>` có phương thức SAM là: `boolean test(String t);`, nghĩa là nhận vào 1 tham số kiểu `String` và trả về `boolean`.
    * `A`: `s -> s.isEmpty()` nhận 1 tham số (suy luận kiểu `String`), gọi phương thức `isEmpty()` trả về `boolean` → Hợp lệ.
    * `B`, `D`, `F`: Sử dụng toán tử mũi tên sai cú pháp (`-->` thay vì `->`) → Lỗi biên dịch.
    * `C`: `(String s) -> s.isEmpty()` khai báo tường minh kiểu `String` với cặp ngoặc đơn `()` hợp lệ → Hợp lệ.
    * `E`: Khai báo kiểu tham số là `StringBuilder`, không tương thích với kiểu `String` của `Predicate<String>` → Lỗi biên dịch.
    * **Bẫy thi cần nhớ:** Toán tử lambda là '->' (1 dấu trừ), không phải '-->'. Kiểu tham số nếu khai báo tường minh phải khớp chính xác với kiểu generic.
</details>

---

### Question 7 (Câu 7)
**Which of these statements is true about the following code?**

```java
public void method() {
   x((var x) -> {}, (var x, var y) -> false);
}
public void x(Consumer<String> x, BinaryOperator<Boolean> y) {}
```

* A. The code does not compile because of one of the variables named `x`.
* B. The code does not compile because of one of the variables named `y`.
* C. The code does not compile for another reason.
* D. The code compiles, and the `x` in each lambda refers to the same type.
* E. The code compiles, and the `x` in each lambda refers to a different type.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** While there appears to have been a variable name shortage when this code was written, it does compile. Lambda variables and method names are allowed to be the same. The `x` lambda parameter is scoped to within each lambda, so it is allowed to be reused. The type is inferred by the method it calls. The first lambda maps `x` to a `String` and the second to a `Boolean`. Therefore, option E is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Đoạn mã tuy lạm dụng việc đặt tên `x` gây rối mắt, nhưng hoàn toàn tuân thủ các quy tắc của ngôn ngữ Java:
    * 1. Tên phương thức `x(...)` và tên tham số `Consumer<String> x` hoàn toàn có thể trùng nhau vì Java phân biệt rõ ngữ cảnh gọi phương thức và định danh biến.
    * 2. Biến `(var x) -> {}` là tham số của lambda thứ nhất, phạm vi của nó chỉ giới hạn bên trong lambda thứ nhất (kiểu được suy luận là `String`).
    * 3. Biến `(var x, var y) -> false` là tham số của lambda thứ hai, hoàn toàn độc lập và không xung đột phạm vi với lambda thứ nhất (kiểu của `x` được suy luận là `Boolean`).
    * 4. Thân hàm `{}` rỗng hợp lệ với `Consumer<String>` (vì phương thức `accept` trả về `void`). Thân hàm `false` hợp lệ với `BinaryOperator<Boolean>` (trả về `Boolean`).
    * Do đó, đoạn mã biên dịch thành công và `x` trong mỗi lambda tham chiếu đến một kiểu khác nhau → Chọn **E**.
    * **Bẫy thi cần nhớ:** Hai biểu thức lambda độc lập cùng nằm trong một lời gọi hàm có thể dùng chung tên tham số vì phạm vi (scope) của chúng không lồng vào nhau.
</details>

---

### Question 8 (Câu 8)
**Which of the following is equivalent to this code?**

```java
UnaryOperator<Integer> u = x -> x * x;
```

* A. `BiFunction<Integer> f = x -> x*x;`
* B. `BiFunction<Integer, Integer> f = x -> x*x;`
* C. `BinaryOperator<Integer, Integer> f = x -> x*x;`
* D. `Function<Integer> f = x -> x*x;`
* E. `Function<Integer, Integer> f = x -> x*x;`
* F. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The question starts with a `UnaryOperator<Integer>`, which takes one parameter and returns a value of the same type. Therefore, option E is correct, as `UnaryOperator` extends `Function`. Notice that other options don’t even compile because they have the wrong number of generic types for the functional interface provided. You should know that a `BiFunction<T,U,R>` takes three generic arguments, a `BinaryOperator<T>` takes one generic argument, and a `Function<T,R>` takes two generic arguments.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * `UnaryOperator<T>` là một functional interface kế thừa từ `Function<T, T>`. Nó nhận vào 1 tham số kiểu `T` và trả về kết quả cùng kiểu `T`.
    * Do đó, `UnaryOperator<Integer>` hoàn toàn tương đương với `Function<Integer, Integer>` (nhận vào `Integer`, trả về `Integer`) → **E đúng**.
    * `A` và `B`: `BiFunction` yêu cầu 3 tham số generic `BiFunction<T, U, R>` và nhận 2 đối số đầu vào (ở đây lambda chỉ có 1 đối số `x`).
    * `C`: `BinaryOperator` chỉ nhận 1 tham số generic `BinaryOperator<T>` và nhận 2 đối số đầu vào.
    * `D`: `Function` bắt buộc phải có 2 tham số generic `Function<T, R>` (kiểu đầu vào và kiểu đầu ra).
    * **Bẫy thi cần nhớ:** UnaryOperator<T> kế thừa Function<T, T>; UnaryOperator chỉ có 1 tham số generic, còn Function bắt buộc có 2 tham số generic.
</details>

---

### Question 9 (Câu 9)
**Which statements are true? (Choose all that apply.)**

* A. The `Consumer` interface is good for printing out an existing value.
* B. The `Supplier` interface is good for printing out an existing value.
* C. The `IntegerSupplier` interface returns an `int`.
* D. The `Predicate` interface returns an `int`.
* E. The `Function` interface has a method named `test()`.
* F. The `Predicate` interface has a method named `test()`.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Option A is correct, and option B is incorrect because a `Supplier` returns a value while a `Consumer` takes one and acts on it. Option C is tricky. `IntSupplier` does return an `int`. However, the option asks about `IntegerSupplier`, which doesn’t exist. Option D is incorrect because a `Predicate` returns a `boolean`. It does have a method named `test()`, making option F correct. Finally, option E is incorrect because `Function` has an `apply()` method.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * `A` đúng: `Consumer<T>` nhận vào 1 đối tượng và thực thi hành động (như `System.out.println(x)`), không trả về kết quả.
    * `B` sai: `Supplier<T>` không nhận tham số đầu vào mà chỉ sinh ra/trả về một giá trị (`T get()`).
    * `C` sai: Tên interface đúng trong Java là **`IntSupplier`**, không hề có interface nào tên là `IntegerSupplier`!
    * `D` sai: `Predicate<T>` luôn trả về kiểu `boolean`, không phải `int`.
    * `E` sai và `F` đúng: `Function<T, R>` có phương thức `apply()`, còn `Predicate<T>` có phương thức `test()`.
    * **Bẫy thi cần nhớ:** Tên interface chuẩn là IntSupplier, không phải IntegerSupplier. Đề thi Oracle rất hay bẫy bằng các tên interface giả mạo!
</details>

---

### Question 10 (Câu 10)
**Which of the following can be inserted without causing a compilation error? (Choose all that apply.)**

```java
public void remove(List<Character> chars) {
   char end = 'z';
   Predicate<Character> predicate = c -> {
      char start = 'a'; return start <= c && c <= end; };
 
   // INSERT LINE HERE
}
```

* A. `char start = 'a';`
* B. `char c = 'x';`
* C. `chars = null;`
* D. `end = '1';`
* E. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, B, C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Since the scope of `start` and `c` is within the lambda, the variables can be declared or updated after it without issue, making options A, B, and C correct. Option D is incorrect because setting `end` prevents it from being effectively final.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Vị trí `// INSERT LINE HERE` nằm **sau** biểu thức lambda:
    * `A` và `B` đúng: Các biến `c` và `start` có phạm vi (scope) chỉ nằm bên trong thân lambda. Sau khi lambda kết thúc, việc khai báo các biến cục bộ mới có tên `c` hoặc `start` trong phương thức là hoàn toàn hợp lệ.
    * `C` đúng: Biến `chars` không được tham chiếu bên trong thân lambda, nên việc gán lại `chars = null;` hoàn toàn hợp lệ.
    * `D` sai: Biến `end` được tham chiếu từ bên trong thân lambda. Do đó, `end` bắt buộc phải là **`effectively final`**. Phép gán `end = '1';` làm cho `end` bị thay đổi giá trị, dẫn đến trình biên dịch báo lỗi tại dòng lambda: `local variables referenced from a lambda expression must be final or effectively final`.
    * **Bẫy thi cần nhớ:** Biến bên ngoài được lambda sử dụng bắt buộc phải là final hoặc effectively final; việc sửa đổi biến đó ở bất kỳ đâu trong phương thức đều làm lambda bị lỗi biên dịch.
</details>

---

### Question 11 (Câu 11)
**How many times is `true` printed out by this code?**

```java
import java.util.function.Predicate;
public class Fantasy {
   public static void scary(String animal) {
      var dino = s -> "dino".equals(animal);
      var dragon = s -> "dragon".equals(animal);
      var combined = dino.or(dragon);
      System.out.println(combined.test(animal));
   }
   public static void main(String[] args) {
      scary("dino");
      scary("dragon");
      scary("unicorn");
   }
}
```

* A. One.
* B. Two.
* C. Three.
* D. The code does not compile.
* E. A runtime exception is thrown.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code does not compile because the lambdas are assigned to `var`. The compiler does not have enough information to determine they are of type `Predicate<String>`. Therefore, option D is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Bẫy thi kinh điển của Oracle:** Hãy chú ý hai dòng khai báo:
    * `var dino = s -> "dino".equals(animal);`
    * `var dragon = s -> "dragon".equals(animal);`
    * Cả biểu thức lambda và từ khoá `var` đều đòi hỏi ngữ cảnh đích để suy luận kiểu dữ liệu. Khi gán trực tiếp một biểu thức lambda cho một biến khai báo bằng `var`, trình biên dịch không thể xác định được kiểu của Functional Interface là gì (có thể là `Predicate<String>`, `Function<String, Boolean>`,...).
    * Trình biên dịch sẽ báo lỗi ngay lập tức: `cannot infer type for local variable dino (lambda expression needs an explicit target-type)`.
    * Vì đoạn mã không thể biên dịch được, đáp án đúng là **D**.
    * **Bẫy thi cần nhớ:** Tuyệt đối không thể gán một biểu thức lambda trực tiếp cho biến kiểu 'var' do thiếu thông tin kiểu đích (target-type).
</details>

---

### Question 12 (Câu 12)
**What does the following code output?**

```java
Function<Integer, Integer> s = a -> a + 4;
Function<Integer, Integer> t = a -> a * 3;
Function<Integer, Integer> c = s.compose(t);
System.out.print(c.apply(1));
```

* A. `7`
* B. `15`
* C. The code does not compile because of the data types in the lambda expressions.
* D. The code does not compile because of the `compose()` call.
* E. The code does not compile for another reason.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `a.compose(b)` method calls the `Function` parameter `b` before the reference `Function` variable `a`. In this case, that means we multiply by 3 before adding 4. This gives a result of `7`, making option A correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
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

### Question 13 (Câu 13)
**Which is true of the following code?**

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

* A. The first compiler error is on line A.
* B. The first compiler error is on line B.
* C. The first compiler error is on line C.
* D. The first compiler error is on line D.
* E. The code compiles successfully.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Lambdas are only allowed to reference `final` or effectively final variables. You can tell the variable `j` is effectively final because adding a `final` keyword before it wouldn’t introduce a compiler error. Each time the `else` statement is executed, the variable is redeclared and goes out of scope. Therefore, it is not reassigned. Similarly, `length` is effectively final. There are no compiler errors, and option E is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Biến `length` được khai báo ngoài vòng lặp và không bao giờ bị gán lại → Là biến **effectively final** → Dòng A hợp lệ.
    * Biến `i` trong vòng lặp `for` bị thay đổi sau mỗi bước lặp (`i++`), do đó `i` **KHÔNG PHẢI** là effectively final. Nếu lambda trực tiếp tham chiếu đến `i`, mã sẽ bị lỗi.
    * Tuy nhiên, ở nhánh `else`, tác giả đã khai báo một biến mới `int j = i;`. Mỗi lần vòng lặp chạy vào nhánh `else`, một biến `j` độc lập mới được tạo ra và không bao giờ bị thay đổi → `j` là **effectively final** → Dòng C hoàn toàn hợp lệ!
    * Chương trình chạy vòng lặp với `i = 0, 1, 2`:
    *   * `i = 0`: In ra `length` là `3`.
    *   * `i = 1`: In ra `j` là `1`.
    *   * `i = 2`: In ra `length` là `3`.
    * Mã biên dịch thành công → Đáp án đúng là **E**.
    * **Bẫy thi cần nhớ:** Biến đếm của vòng for không phải effectively final; nhưng một biến cục bộ mới gán từ biến đếm bên trong thân vòng lặp thì là effectively final.
</details>

---

### Question 14 (Câu 14)
**Which of the following are valid lambda expressions? (Choose all that apply.)**

* A. `(Wolf w, var c) -> 39`
* B. `(final Camel c) -> {}`
* C. `(a,b,c) -> {int b = 3; return 2;}`
* D. `(x,y) -> new RuntimeException()`
* E. `(var y) -> return 0;`
* F. `() -> {float r}`
* G. `(Cat a, b) -> {}`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Option B is a valid functional interface, one that could be assigned to a `Consumer<Camel>` reference. Notice that the `final` modifier is permitted on variables in the parameter list. Option D is correct, as the exception is being returned as an object and not thrown. This would be compatible with a `BiFunction` that included `RuntimeException` as its return type. Options A and G are incorrect because they mix format types for the parameters. Option C is invalid because the variable `b` is used twice. Option E is incorrect, as a `return` statement is permitted only inside braces (`{}`). Option F is incorrect because the variable declaration requires a semicolon (`;`) after it.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
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

### Question 15 (Câu 15)
**Which lambda expression, when entered into the blank line in the following code, causes the program to print `hahaha`? (Choose all that apply.)**

```java
import java.util.function.Predicate;
public class Hyena {
   private int age = 1;
   public static void main(String[] args) {
      var p = new Hyena();
      double height = 10;
      int age = 1;
      testLaugh(p, ________________);
      age = 2;
   }
   static void testLaugh(Hyena panda, Predicate<Hyena> joke) {
      var r = joke.test(panda) ? "hahaha" : "silence";
      System.out.print(r);
   }
}
```

* A. `var -> p.age <= 10`
* B. `shenzi -> age==1`
* C. `p -> true`
* D. `age==1`
* E. `shenzi -> age==2`
* F. `h -> h.age < 5`
* G. None of the above, as the code does not compile

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Option A is a valid lambda expression. While `main()` is a static method, it can access `age` since it is using a reference to an instance of `Hyena`, which is effectively final in this method. Since `var` is not a reserved word, it may be used for variable names. Option F is also correct, with the lambda variable being a reference to a `Hyena` object. The variable is processed using deferred execution in the `testLaugh()` method. Options B and E are incorrect; since the local variable `age` is not effectively final, this would lead to a compilation error. Option C would also cause a compilation error, since the expression uses the variable name `p`, which is already declared within the method. Finally, option D is incorrect, as this is not even a lambda expression.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * `Predicate<Hyena>` yêu cầu lambda nhận 1 tham số có kiểu `Hyena` và trả về `boolean`.
    * `A` đúng: `var` trong Java là một **từ khoá ngữ cảnh (contextual keyword)**, không phải là từ khoá bảo lưu (reserved word). Do đó, bạn hoàn toàn có thể dùng `var` làm **tên của một tham số**! Thân hàm kiểm tra `p.age <= 10` (`1 <= 10` là `true`) → in ra `hahaha`.
    * `F` đúng: Khai báo `h -> h.age < 5`. Đối tượng truyền vào có `age = 1 < 5` → in ra `hahaha`.
    * `B` và `E`: Sử dụng biến cục bộ `age` của phương thức `main`, nhưng biến `age` bị gán lại (`age = 2;`) nên không phải là effectively final → Lỗi biên dịch.
    * `C`: Lỗi biên dịch vì tên biến `p` trùng với biến cục bộ `p` đã khai báo trước đó trong phương thức `main`.
    * `D`: Không phải là biểu thức lambda → Lỗi biên dịch.
    * **Bẫy thi cần nhớ:** 'var' không phải là từ khóa bảo lưu (reserved keyword) nên có thể đặt làm tên biến hoặc tên tham số lambda!
</details>

---

### Question 16 (Câu 16)
**Which of the following can be inserted without causing a compilation error?**

```java
public void remove(List<Character> chars) {
   char end = 'z';
 
   // INSERT LINE HERE
 
   Predicate<Character> predicate =  c -> {
      char start = 'a'; return start <= c && c <= end; };
}
```

* A. `char start = 'a';`
* B. `char c = 'x';`
* C. `chars = null;`
* D. `end = '1';`
* E. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Lambdas are not allowed to redeclare local variables, making options A and B incorrect. Option D is incorrect because setting `end` prevents it from being effectively final. Lambdas are only allowed to reference `final` or effectively final variables. Option C compiles since `chars` is not used.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Vị trí `// INSERT LINE HERE` nằm **trước** khai báo lambda:
    * `A` sai: Nếu khai báo biến cục bộ `char start = 'a';` ở đây, thì bên trong thân lambda dòng lệnh `char start = 'a';` sẽ bị lỗi biên dịch do trùng tên biến cục bộ trong cùng phạm vi.
    * `B` sai: Nếu khai báo `char c = 'x';` ở đây, tham số của lambda `c -> ...` sẽ bị lỗi biên dịch do trùng tên với biến cục bộ `c` đã có.
    * `D` sai: Nếu gán `end = '1';`, biến `end` sẽ bị mất tính chất **effectively final**, khiến cho lambda bên dưới không thể sử dụng `end` nữa.
    * `C` đúng: Biến `chars` là tham số của phương thức `remove` nhưng **hoàn toàn không được sử dụng bên trong lambda**. Do đó, việc gán `chars = null;` hoàn toàn không ảnh hưởng gì đến lambda và biên dịch thành công.
    * **Bẫy thi cần nhớ:** Tham số lambda không được trùng tên với biến cục bộ đã khai báo trước đó trong cùng phương thức.
</details>

---

### Question 17 (Câu 17)
**What is the result of running the following class?**

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

* A. `match`
* B. `not match`
* C. Compiler error on line 8.
* D. Compiler error on line 10.
* E. Compiler error on line 12.
* F. A runtime exception is thrown.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Line 8 uses braces around the body. This means the `return` keyword and semicolon are required. Since the code doesn’t compile, option C is the answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
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

### Question 18 (Câu 18)
**Which functional interfaces complete the following code? For line 7, assume `m` and `n` are instances of functional interfaces that exist and have the same type as `y`. (Choose three.)**

```java
6:  _____________ x = String::new;
7:  _____________ y = m.andThen(n);
8:  _____________ z = a -> a + a;
```

* A. `BinaryConsumer<String, String>`
* B. `BiConsumer<String, String>`
* C. `BinaryFunction<String, String>`
* D. `BiFunction<String, String>`
* E. `Predicate<String>`
* F. `Supplier<String>`
* G. `UnaryOperator<String>`
* H. `UnaryOperator<String, String>`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, F, G**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** We can eliminate four choices right away. Options A and C are there to mislead you; these interfaces don’t exist. Option D is incorrect because a `BiFunction<T,U,R>` takes three generic arguments, not two. Option E is incorrect because none of the examples returns a `boolean`. The declaration on line 6 doesn’t take any parameters, and it returns a `String`, so a `Supplier<String>` can fill in the blank, making option F correct. The declaration on line 7 requires you to recognize that `Consumer` and `Function`, along with their binary equivalents, have an `andThen()` method. This makes option B correct. Finally, line 8 takes a single parameter, and it returns the same type, which is a `UnaryOperator`. Since the types are the same, only one generic parameter is needed, making option G correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Trước hết, loại trừ các interface không tồn tại hoặc sai số lượng generic:
    *   * `BinaryConsumer` và `BinaryFunction` (A, C) hoàn toàn không tồn tại trong thư viện chuẩn Java.
    *   * `BiFunction` (D) bắt buộc phải có 3 kiểu generic `BiFunction<T, U, R>`, không thể có 2 kiểu.
    *   * `UnaryOperator` (H) chỉ có 1 kiểu generic `UnaryOperator<T>`, không thể có 2 kiểu.
    * Xét từng dòng mã:
    *   * **Dòng 6:** `String::new` tham chiếu đến constructor không tham số của `String` (`() -> new String()`), không nhận tham số và trả về `String` → Khớp với **`Supplier<String>`** (F đúng).
    *   * **Dòng 7:** `m.andThen(n)` là phương thức tiện ích có trong `Consumer`, `BiConsumer` và `Function`. Trong các phương án còn lại, **`BiConsumer<String, String>`** là lựa chọn hợp lệ (B đúng).
    *   * **Dòng 8:** `a -> a + a` nhận vào 1 đối tượng kiểu String và trả về chuỗi String ghép → Nhận vào và trả về cùng một kiểu → Khớp với **`UnaryOperator<String>`** (G đúng).
    * **Bẫy thi cần nhớ:** BiConsumer có andThen; UnaryOperator chỉ có 1 tham số generic (UnaryOperator<T>); không tồn tại BinaryConsumer hay BinaryFunction.
</details>

---

### Question 19 (Câu 19)
**Which of the following compiles and prints out the entire set?**

```java
Set<?> set = Set.of("lion", "tiger", "bear");
var s = Set.copyOf(set);
Consumer<Object> consumer =  ________________;
s.forEach(consumer);
```

* A. `() -> System.out.println(s)`
* B. `s -> System.out.println(s)`
* C. `(s) -> System.out.println(s)`
* D. `System.out.println(s)`
* E. `System::out::println`
* F. `System.out::println`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** While there is a lot in this question trying to confuse you, note that there are no options about the code not compiling. This allows you to focus on the lambdas and method references. Option A is incorrect because a `Consumer` requires one parameter. Options B and C are close. The syntax for the lambda is correct. However, `s` is already defined as a local variable, and therefore the lambda can’t redefine it. Options D and E use incorrect syntax for a method reference. Option F is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * `consumer` có kiểu `Consumer<Object>`, phương thức SAM `void accept(Object o)` yêu cầu nhận 1 tham số đầu vào và trả về `void`.
    * `A` sai: `() -> ...` có 0 tham số, không khớp với `Consumer`.
    * `B` và `C` sai: Biến `s` đã được khai báo làm biến cục bộ ở dòng trên (`var s = Set.copyOf(set);`). Việc đặt tên tham số lambda là `s` hoặc `(s)` sẽ bị **lỗi biên dịch do trùng tên biến (variable shadowing)**.
    * `D` sai: Đây là lời gọi phương thức thực thi ngay lập tức, không phải biểu thức lambda hay method reference.
    * `E` sai: Cú pháp dùng 2 cặp dấu `::` (`System::out::println`) là hoàn toàn không tồn tại trong Java.
    * `F` đúng: `System.out::println` là một Method Reference hợp lệ thuộc dạng 2 (gọi instance method trên đối tượng cụ thể `System.out`), nhận 1 tham số và in ra màn hình.
    * **Bẫy thi cần nhớ:** Tham số lambda không được trùng tên với biến cục bộ đã khai báo; cú pháp method reference chỉ có 1 cặp dấu hai chấm '::'.
</details>

---

### Question 20 (Câu 20)
**Which lambda can replace the `new Sloth()` call in the `main()` method and produce the same output at runtime?**

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

* A. `(z,f) -> { String x = ""; return "Sleep: " + x }`
* B. `(t,s) -> { String t = ""; return "Sleep: " + t; }`
* C. `(w,q) -> {"Sleep: " + w}`
* D. `(e,u) -> { String g = ""; "Sleep: " + e }`
* E. `(a,b) -> "Sleep: " + (double)(b==null ? a : a)`
* F. `(r,k) -> { String g = ""; return "Sleep:"; }`
* G. None of the above, as the program does not compile

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Option A does not compile because the second statement within the block is missing a semicolon (`;`) at the end. Option B is an invalid lambda expression because `t` is defined twice: in the parameter list and within the lambda expression. Options C and D are both missing a `return` statement and semicolon. Options E and F are both valid lambda expressions, although only option E matches the behavior of the `Sloth` class. In particular, option F only prints `Sleep:`, not `Sleep: 10.0`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
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

### Question 21 (Câu 21)
**Which of the following are valid functional interfaces? (Choose all that apply.)**

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

* A. `Boat`
* B. `Car`
* C. `Locomotive`
* D. `Spaceship`
* E. `Transport`
* F. `Train`
* G. None of these is a valid functional interface.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, E, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** A valid functional interface is one that contains a single abstract method, excluding any `public` methods that are already defined in the `java.lang.Object` class. `Transport` and `Boat` are valid functional interfaces, as they each contain a single abstract method: `go()` and `hashCode(String)`, respectively. This gives us options A and E. Since the other methods are part of `Object`, they do not count as abstract methods. `Train` is also a functional interface since it extends `Transport` and does not define any additional abstract methods. This adds option F as the final correct answer. `Car` is not a functional interface because it is an abstract class. `Locomotive` is not a functional interface because it includes two abstract methods, one of which is inherited. Finally, `Spaceship` is not a valid interface, let alone a functional interface, because a `default` method must provide a body. A quick way to test whether an interface is a functional interface is to apply the `@FunctionalInterface` annotation and check if the code still compiles.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * `Transport` (E) đúng: Có phương thức `go()` là SAM. Phương thức `equals(Object o)` là phương thức public của `java.lang.Object` nên không tính vào SAM.
    * `Train` (F) đúng: Kế thừa `Transport` và không khai báo thêm phương thức trừu tượng nào, kế thừa trọn vẹn duy nhất phương thức abstract `go()` → Là Functional Interface hợp lệ.
    * `Boat` (A) đúng: Phương thức `hashCode()` là của `Object` nên không tính; phương thức `hashCode(String input)` nhận tham số `String` là một abstract method duy nhất → Thỏa mãn SAM!
    * `Car` (B) sai: `Car` là một **`abstract class`**, không phải là `interface`.
    * `Locomotive` (C) sai: Kế thừa `go()` từ `Train/Transport` và khai báo thêm `getSpeed()` → Có 2 abstract methods → Vi phạm SAM.
    * `Spaceship` (D) sai: Khai báo `default int blastOff();` nhưng **không có thân hàm `{}`** → Đây là lỗi cú pháp biên dịch (phương thức default bắt buộc phải có thân hàm).
    * **Bẫy thi cần nhớ:** Phương thức default bắt buộc phải có thân hàm {}; abstract class không bao giờ là functional interface; interface kế thừa có thể là functional interface nếu không thêm abstract method mới.
</details>

---
