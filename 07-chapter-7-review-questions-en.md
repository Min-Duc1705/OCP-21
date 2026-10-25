# Review Questions (Bộ Câu Hỏi Ôn Tập Tiếng Anh) - Chapter 7: Beyond Classes

> **Source (Nguồn trích dẫn):** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Pages 682–701).  
> **Total Questions (Số lượng):** 30 official Oracle exam-style multiple-choice questions with detailed explanations (Pages 1364–1372).  
> **How to study (Cách học):** Read the verbatim English question and deduce your answer first, then click **"👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)"** to check the official explanation and Vietnamese deep-dive analysis.

---

### Question 1 (Câu 1)
**Which of the following are valid record declarations? (Choose all that apply.)**

```java
public record Iguana(int age) {
   private static final int age = 10; }
 
public final record Gecko() {}
 
public abstract record Chameleon()  {
   private static String name; }
 
public record BeardedDragon(boolean fun) {
   @Override public boolean fun() { return false; } }
 
public record Reptile(long size) {
   public Reptile {
      if(size == 1) throw new IllegalArgumentException();
   } }
 
public record Newt(double age) extends Reptile {
   public Newt(double age) {
      age = this.age % 2 == 0 ? 5 : 10;
   } }
```

* A. `Iguana`
* B. `Gecko`
* C. `Chameleon`
* D. `BeardedDragon`
* E. `Reptile`
* F. `Newt`
* G. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, D, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** `Iguana` does not compile, as it declares a static field with the same name as an instance field. Records are implicitly `final` and cannot be marked `abstract`, which is why `Gecko` compiles and `Chameleon` does not, making option B correct. Notice in `Gecko` that records are not required to declare any fields. `BeardedDragon` also compiles, as records may override any accessor methods, making option D correct. `Reptile` compiles as it contains a valid compact constructor, making option E correct. `Newt` does not compile because it cannot extend another record. It also does not compile because the compact constructor tries to read `this.age`, which is not permitted.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Iguana:** Không biên dịch được vì nó khai báo một trường static có cùng tên `age` với trường instance đã khai báo trong header của record.
    * **Gecko:** Biên dịch thành công! Record ngầm định là `final`, nhưng việc chỉ định tường minh từ khoá `final` là hoàn toàn hợp lệ. Ngoài ra, một record không bắt buộc phải có trường dữ liệu nào (`()`).
    * **Chameleon:** Không biên dịch được vì record ngầm định là `final` nên **tuyệt đối không thể được đánh dấu là `abstract`**.
    * **BeardedDragon:** Biên dịch thành công vì record cho phép người lập trình ghi đè (override) bất kỳ phương thức accessor nào.
    * **Reptile:** Biên dịch thành công vì nó định nghĩa một **compact constructor** hợp lệ để kiểm tra điều kiện dữ liệu (`size == 1`).
    * **Newt:** Không biên dịch được vì 2 lý do: (1) Record ngầm định kế thừa `java.lang.Record`, do đó **không thể `extends` bất kỳ lớp hoặc record nào khác**; (2) Trong constructor thông thường, nó cố gắng truy cập `this.age` trước khi các trường được khởi tạo hợp lệ.
    * **Bẫy thi cần nhớ:** Record luôn luôn ngầm định là final (không thể là abstract) và ngầm định kế thừa java.lang.Record (không thể extends class khác).
</details>

---

### Question 2 (Câu 2)
**Which of the following statements can be inserted in the blank line so that the code will compile successfully? (Choose all that apply.)**

```java
interface CanHop {}
public class Frog implements CanHop {
   public static void main(String[] args) {
      ____________ frog = new TurtleFrog();
   }
}
class BrazilianHornedFrog extends Frog {}
class TurtleFrog extends Frog {}
```

* A. `Frog`
* B. `TurtleFrog`
* C. `BrazilianHornedFrog`
* D. `CanHop`
* E. `var`
* F. `Long`
* G. None of the above; the code contains a compilation error.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, B, D, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles without issue, so option G is incorrect. The blank can be filled with any class or interface that is a supertype of `TurtleFrog`. Option A is the direct superclass of `TurtleFrog`, and option B is the same class, so both are correct. `BrazilianHornedFrog` is not a superclass of `TurtleFrog`, so option C is incorrect. `TurtleFrog` inherits the `CanHop` interface, so option D is correct. Option E is also correct, as `var` is permitted when the type is known. Finally, `Long` is an unrelated class that is not a superclass of `TurtleFrog` and is therefore incorrect.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Đoạn mã khai báo lớp cha `Frog implements CanHop`, và hai lớp con kế thừa từ `Frog` là `BrazilianHornedFrog` và `TurtleFrog`.
    * Biến `frog` được gán đối tượng thực tế trong bộ nhớ là `new TurtleFrog()`.
    * Theo tính đa hình trong Java, kiểu tham chiếu của biến có thể là chính lớp của đối tượng đó (`TurtleFrog` - B), bất kỳ lớp cha nào của nó (`Frog` - A, `Object`), hoặc bất kỳ interface nào mà cây phả hệ của nó triển khai (`CanHop` - D).
    * `BrazilianHornedFrog` (C) là lớp con ngang hàng (sibling), không có quan hệ thừa kế với `TurtleFrog` nên không thể gán.
    * `var` (E) hoàn toàn hợp lệ vì kiểu của vế phải được xác định rõ ràng tại compile-time là `TurtleFrog`.
    * `Long` (F) là lớp hoàn toàn không liên quan, không thể gán.
    * **Bẫy thi cần nhớ:** Kiểu tham chiếu có thể là bất kỳ superclass hoặc superinterface nào của đối tượng thực tế.
</details>

---

### Question 3 (Câu 3)
**What is the result of the following program?**

```java
11: public class Favorites {
12:    enum Flavors {
13:       VANILLA, CHOCOLATE, STRAWBERRY
14:       public Flavors() {}
15:    }
16:    public static void main(String[] args) {
17:       for(final var e : Flavors.values())
18:          System.out.print((e.ordinal() % 2) + " ");
19:    } }
```

* A. `0 1 0`
* B. `1 0 1`
* C. Exactly one line of code does not compile.
* D. More than one line of code does not compile.
* E. The code compiles but produces an exception at runtime.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** When an enum contains only a list of values, the semicolon (`;`) after the list is optional. When an enum contains any other members, such as a constructor or variable, the semicolon is required. For this reason, line 13 does not compile. Line 14 also does not compile, as enum constructors are implicitly `private` and cannot be declared as `public` or `protected`. For this reason, option D is correct. If these two issues were corrected, then the program would print `0 1 0` at runtime.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Dòng 13:** Khi enum chỉ chứa danh sách hằng số, dấu chấm phẩy (`;`) ở cuối danh sách là tuỳ chọn. Tuy nhiên, khi enum có thêm bất kỳ thành viên nào khác (như constructor ở dòng 14), **dấu chấm phẩy (`;`) kết thúc danh sách hằng số là BẮT BUỘC**. Dòng 13 thiếu dấu `;` nên bị lỗi biên dịch.
    * **Dòng 14:** Constructor của enum luôn luôn ngầm định là `private`. Bạn **tuyệt đối không được phép khai báo constructor của enum là `public` hoặc `protected`**. Dòng 14 khai báo `public Flavors()` nên gây lỗi biên dịch.
    * Vì có 2 dòng mã bị lỗi biên dịch (dòng 13 và 14), đáp án đúng là **D**.
    * Nếu sửa 2 lỗi trên, chương trình sẽ in ra: `0 1 0 ` (vì ordinals lần lượt là 0, 1, 2).
    * **Bẫy thi cần nhớ:** Constructor của enum chỉ có thể là private; nếu enum có chứa thêm phương thức hay constructor thì bắt buộc phải có dấu chấm phẩy ';' sau danh sách hằng số.
</details>

---

### Question 4 (Câu 4)
**What is the output of the following program?**

```java
public sealed class ArmoredAnimal permits Armadillo {
   public ArmoredAnimal(int size) {}
   @Override public String toString() { return "Strong"; }
   public static void main(String[] a) {
      var c = new Armadillo(10, null);
      System.out.println(c);
   }
}
class Armadillo extends ArmoredAnimal {
   @Override public String toString() { return "Cute"; }
   public Armadillo(int size, String name) {
      super(size);
   }   
}
```

* A. `Strong`
* B. `Cute`
* C. The program does not compile.
* D. The code compiles but produces an exception at runtime.
* E. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** A class extending a sealed class must be marked `final`, `sealed`, or `non-sealed`. Since `Armadillo` is missing a modifier, the code does not compile, and option C is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * `ArmoredAnimal` là một **sealed class** cho phép lớp `Armadillo` kế thừa (`permits Armadillo`).
    * **Quy tắc bắt buộc của Sealed Class:** Mọi lớp con trực tiếp (`direct subclass`) của một sealed class **bắt buộc phải có chính xác một trong ba modifier**: `final`, `sealed`, hoặc `non-sealed`.
    * Lớp `Armadillo` khai báo là `class Armadillo extends ArmoredAnimal` mà không có modifier nào trong số 3 modifier trên.
    * Do đó, trình biên dịch báo lỗi tại khai báo của lớp `Armadillo`: `sealed, non-sealed or final modifiers expected`.
    * **Bẫy thi cần nhớ:** Lớp con trực tiếp của sealed class bắt buộc phải mang đúng một trong 3 modifier: final, sealed, hoặc non-sealed.
</details>

---

### Question 5 (Câu 5)
**Which statement about the following program is correct?**

```java
1:  interface HasExoskeleton {
2:     double size = 2.0f;
3:     abstract int getNumberOfSections();
4:  }
5:  abstract class Insect implements HasExoskeleton {
6:     abstract int getNumberOfLegs();
7:  }
8:  public class Beetle extends Insect {
9:     int getNumberOfLegs() { return 6; }
10:    int getNumberOfSections(int count) { return 1; }
11: }
```

* A. It compiles without issue.
* B. The code will produce a `ClassCastException` if called at runtime.
* C. The code will not compile because of line 2.
* D. The code will not compile because of line 5.
* E. The code will not compile because of line 8.
* F. The code will not compile because of line 10.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** First, the declarations of `HasExoskeleton` and `Insect` are correct and do not contain any errors, making options C and D incorrect. The concrete class `Beetle` extends `Insect` and inherits two abstract methods, `getNumberOfSections()` and `getNumberOfLegs()`. The `Beetle` class includes an overloaded version of `getNumberOfSections()` that takes an `int` value. The method declaration is valid, making option F incorrect, although it does not satisfy the abstract method requirement inherited from `HasExoskeleton`. For this reason, only one of the two abstract methods is properly overridden. The `Beetle` class therefore does not compile, and option E is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 1–4: Interface `HasExoskeleton` khai báo hằng số `size` (ngầm định `public static final`) và abstract method `getNumberOfSections()` (ngầm định `public abstract`). Hoàn toàn hợp lệ.
    * Dòng 5–7: `Insect` là abstract class kế thừa interface `HasExoskeleton` và thêm abstract method `getNumberOfLegs()`. Hoàn toàn hợp lệ.
    * Dòng 8–11: `Beetle` là concrete class kế thừa `Insect`, do đó nó bắt buộc phải ghi đè (override) tất cả các abstract method chưa được triển khai:
    *   * `getNumberOfLegs()` ở dòng 9: Override hợp lệ.
    *   * `getNumberOfSections()` trong interface không nhận tham số nào. Nhưng dòng 10 lại khai báo `getNumberOfSections(int count)` → Đây là **nạp chồng (overload)**, không phải ghi đè!
    * Vì `Beetle` chưa triển khai phương thức trừu tượng `int getNumberOfSections()` không tham số, nên khai báo lớp `Beetle` ở dòng 8 bị lỗi biên dịch: `Beetle is not abstract and does not override abstract method getNumberOfSections() in HasExoskeleton`.
    * **Bẫy thi cần nhớ:** Lớp cụ thể (concrete class) kế thừa abstract class/interface bắt buộc phải override chính xác chữ ký phương thức (signature) của mọi abstract method.
</details>

---

### Question 6 (Câu 6)
**Which statements about the following program are correct? (Choose all that apply.)**

```java
1: public abstract interface Herbivore {
2:    int amount = 10;
3:    public void eatGrass();
4:    public abstract int chew() { return 13; }
5: }
6:
7: abstract class IsAPlant extends Herbivore {
8:    Object eatGrass(int season) { return null; }
9: }
```

* A. It compiles and runs without issue.
* B. The code will not compile because of line 1.
* C. The code will not compile because of line 2.
* D. The code will not compile because of line 4.
* E. The code will not compile because of line 7.
* F. The code will not compile because line 8 contains an invalid method override.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Line 4 does not compile, since an abstract method cannot include a body. Line 7 also does not compile because the wrong keyword is used. A class implements an interface; it does not extend it. For these reasons, options D and E are correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Dòng 4:** Phương thức `chew()` được đánh dấu là `abstract` nhưng lại có thân hàm `{ return 13; }`. Trong Java, một phương thức abstract **tuyệt đối không được có thân hàm** → Lỗi biên dịch dòng 4.
    * **Dòng 7:** `IsAPlant` là một `class`, còn `Herbivore` là một `interface`. Một class **triển khai (implements)** interface, **không thể kế thừa (extends)** interface! Cú pháp phải là `implements Herbivore` → Lỗi biên dịch dòng 7.
    * Dòng 1 hoàn toàn hợp lệ vì interface ngầm định là `abstract`. Dòng 2 khai báo hằng số ngầm định `public static final`. Dòng 8 là phương thức nạp chồng (overload) bình thường.
    * **Bẫy thi cần nhớ:** Phương thức abstract không được có thân hàm; class không thể 'extends' interface (phải dùng 'implements').
</details>

---

### Question 7 (Câu 7)
**What is the output of the following program?**

```java
1: interface Aquatic {
2:    int getNumOfGills(int p);
3: }
4: public class ClownFish implements Aquatic {
5:    String getNumOfGills() { return "14"; }
6:    int getNumOfGills(int input) { return 15; }
7:    public static void main(String[] args) {
8:       System.out.println(new 
ClownFish().getNumOfGills(-1));
9: } }
```

* A. `14`
* B. `15`
* C. The code will not compile because of line 4.
* D. The code will not compile because of line 5.
* E. The code will not compile because of line 6.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The inherited interface method `getNumOfGills(int)` is implicitly `public`; therefore, it must be declared `public` in any concrete class that implements the interface. Since the method uses the package (default) modifier in the `ClownFish` class, line 6 does not compile, making option E the correct answer. If the method declaration were corrected to include `public` on line 6, then the program would compile and print `15` at runtime, and option B would be the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 2: Phương thức `int getNumOfGills(int p);` trong interface `Aquatic` **ngầm định là `public abstract`**.
    * Dòng 6: Lớp `ClownFish` ghi đè phương thức này nhưng lại khai báo là `int getNumOfGills(int input)` với **quyền truy cập package-private (mặc định)**.
    * **Quy tắc ghi đè phương thức:** Phương thức ghi đè ở lớp con **không được phép thu hẹp quyền truy cập** so với phương thức ở lớp cha (từ `public` xuống package-private là phạm luật).
    * Do đó, dòng 6 gây lỗi biên dịch: `getNumOfGills(int) in ClownFish cannot implement getNumOfGills(int) in Aquatic; attempting to assign weaker access privileges; was public`.
    * Dòng 5 là phương thức nạp chồng (overload) không tham số, hoàn toàn hợp lệ.
    * **Bẫy thi cần nhớ:** Mọi phương thức abstract trong interface đều là public. Khi lớp con triển khai (override) bắt buộc phải khai báo từ khoá 'public'.
</details>

---

### Question 8 (Câu 8)
**Given the following, select the statements that can be inserted into the blank line so that the code will compile and print `true` at runtime? (Choose all that apply.)**

```java
record Walrus(List<String> diet) {}
record Exhibit(Walrus animal, String location) {}
 
var e = new Exhibit(new Walrus(List.of("Wally")), "Artic");
System.out.print(e instanceof _____________);
```

* A. `Exhibit(Walrus(List<Integer> z), Object a)`
* B. `Exhibit(Walrus(List m), Object n)`
* C. `Object w && w.animal().diet().size() == 0`
* D. `Exhibit(Walrus(var i), var i)`
* E. `Exhibit(var p, var q)`
* F. `Exhibit(List<?> g, var h)`
* G. `Exhibit(var x, CharSequence y)`
* H. `Exhibit(Walrus(null), var v)`
* I. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, E, G**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Options A and F do not compile because they are not compatible with `List<String>`. Option C does not compile because the reference type of `w` is `Object`, which doesn’t have an `animal()` method. Option D does not compile because the variable `i` is used twice in the same pattern matching statement. Option H does not compile because you can’t use `null` in a pattern matching statement. Options B, E, and G correctly compile and print `true` at runtime.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Đây là câu hỏi kiểm tra tính năng **Record Patterns (Phân rã cấu trúc Record)** mới của Java 21:
    * `A`: `List<Integer>` không tương thích với `List<String>` → Lỗi biên dịch.
    * `B`: Dùng raw type `List m` tương thích với `List<String>`, và `Object n` tương thích với `String location` → **Biên dịch và in ra `true`**.
    * `C`: Biến `w` có kiểu `Object`, lớp `Object` không có phương thức `animal()` → Lỗi biên dịch.
    * `D`: Biến `i` bị khai báo lặp lại 2 lần trong cùng pattern matching → Lỗi biên dịch.
    * `E`: `Exhibit(var p, var q)` khớp hoàn hảo 2 trường của `Exhibit` bằng `var` → **Biên dịch và in ra `true`**.
    * `F`: Thành phần đầu tiên của `Exhibit` là `Walrus`, không thể khớp với `List<?>` → Lỗi biên dịch.
    * `G`: `var x` khớp với `Walrus`, `CharSequence y` khớp với `String` (vì `String` implements `CharSequence`) → **Biên dịch và in ra `true`**.
    * `H`: Không được sử dụng giá trị `null` bên trong pattern matching record → Lỗi biên dịch.
    * **Bẫy thi cần nhớ:** Trong Record Pattern: kiểu các thành phần phải tương thích, biến phân rã không được trùng tên, và không được dùng literal 'null'.
</details>

---

### Question 9 (Câu 9)
**Which of the following statements can be inserted in the blank so that the code will compile successfully? (Choose all that apply.)**

```java
abstract class Snake {}
class Cobra extends Snake {}
class GardenSnake extends Cobra {}
public class SnakeHandler {
   private Snake snakey;
   public void setSnake(Snake mySnake) { this.snakey = 
mySnake; }
   public static void main(String[] args) {
      new SnakeHandler().setSnake(_____________);
   } }
```

* A. `new Cobra()`
* B. `new Snake()`
* C. `new Object()`
* D. `new String("Snake")`
* E. `new GardenSnake()`
* F. `null`
* G. None of the above. The class does not compile, regardless of the value inserted in the blank.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, E, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `setSnake()` method requires an instance of `Snake`. `Cobra` is a direct subclass, while `GardenSnake` is an indirect subclass. For these reasons, options A and E are correct. Option B is incorrect because `Snake` is abstract and requires a concrete subclass for instantiation. Option C is incorrect because `Object` is a supertype of `Snake`, not a subtype. Option D is incorrect as `String` is an unrelated class and does not inherit `Snake`. Finally, a `null` value can always be passed as an object value, regardless of type, so option F is also correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Phương thức `setSnake(Snake mySnake)` yêu cầu đối số là một đối tượng thuộc kiểu `Snake` hoặc bất kỳ lớp con nào của `Snake`.
    * `A (new Cobra())`: `Cobra` là lớp con trực tiếp của `Snake` → Hợp lệ.
    * `B (new Snake())`: `Snake` là một `abstract class`, **không thể khởi tạo trực tiếp bằng toán tử `new`** → Lỗi biên dịch.
    * `C (new Object())`: `Object` là lớp cha của `Snake`, không thể tự động thu hẹp xuống `Snake` mà không ép kiểu → Lỗi biên dịch.
    * `D (new String("Snake"))`: `String` hoàn toàn không liên quan đến `Snake` → Lỗi biên dịch.
    * `E (new GardenSnake())`: `GardenSnake` kế thừa `Cobra`, gián tiếp kế thừa `Snake` → Hợp lệ.
    * `F (null)`: Giá trị `null` có thể gán cho bất kỳ kiểu tham chiếu đối tượng nào trong Java → Hợp lệ.
    * **Bẫy thi cần nhớ:** Abstract class không thể khởi tạo trực tiếp bằng 'new'; giá trị 'null' luôn hợp lệ cho mọi kiểu tham chiếu đối tượng.
</details>

---

### Question 10 (Câu 10)
**What types can be inserted in the blanks on the lines marked X and Z that allow the code to compile? (Choose all that apply.)**

```java
interface Walk { private static List move() { return null; 
} }
interface Run extends Walk { public ArrayList move(); }
class Leopard implements Walk {
   public ___________ move() {  // X
      return null;
   }
}
class Panther implements Run {
   public ___________ move() {  // Z
      return null;
   }
}
```

* A. `Integer` on the line marked X
* B. `ArrayList` on the line marked X
* C. `List` on the line marked X
* D. `List` on the line marked Z
* E. `ArrayList` on the line marked Z
* F. None of the above, since the `Run` interface does not compile.
* G. Does not compile for a different reason.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, B, C, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** `Walk` declares a private method that is not inherited in any of its subtypes. For this reason, any valid class is supported on line X, making options A, B, and C correct. Line Z is more restrictive, with only `ArrayList` or subtypes of `ArrayList` supported, making option E correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Tại dòng X (`Leopard implements Walk`):** Phương thức `move()` trong interface `Walk` là `private static`, do đó nó **hoàn toàn không được kế thừa** vào các lớp con/triển khai. Lớp `Leopard` định nghĩa phương thức `move()` hoàn toàn mới độc lập, nên kiểu trả về có thể là **bất kỳ kiểu nào** (`Integer` - A, `ArrayList` - B, `List` - C đều hợp lệ).
    * **Tại dòng Z (`Panther implements Run`):** Interface `Run` khai báo `public ArrayList move();`. Lớp `Panther` bắt buộc phải ghi đè phương thức này với kiểu trả về là `ArrayList` hoặc kiểu con của `ArrayList` (Covariant Return Type).
    * Do đó, tại dòng Z: `ArrayList` (E) hợp lệ, còn `List` (D) bị lỗi biên dịch vì `List` là supertype (rộng hơn `ArrayList`), không thỏa mãn quy tắc kiểu trả về hiệp biến.
    * **Bẫy thi cần nhớ:** Phương thức private static trong interface không được kế thừa. Lớp con triển khai có thể tự do định nghĩa phương thức trùng tên mà không bị ràng buộc.
</details>

---

### Question 11 (Câu 11)
**What is the result of compiling and executing the following code?**

```java
1:  public class Movie {
2:     private int butter = 5;
3:     private Movie() {}
4:     protected class Popcorn {
5:        private Popcorn() {}
6:        public static int butter = 10;
7:        public void startMovie() {
8:           System.out.println(butter);
9:        }
10:    }
11:    public static void main(String[] args) {
12:       var movie = new Movie();
13:       Movie.Popcorn in = new Movie().new Popcorn();
14:       in.startMovie();
15:    } }
```

* A. The output is `5`.
* B. The output is `10`.
* C. Line 6 generates a compiler error.
* D. Line 12 generates a compiler error.
* E. Line 13 generates a compiler error.
* F. The code compiles but produces an exception at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Inner classes can contain static variables, so the code compiles. Remember that `private` constructors can be used by any methods within the outer class. The `butter` reference on line 8 refers to the inner class variable defined on line 6, with the output being `10` at runtime, and making option B correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Kể từ Java 16+, một **Inner Class (non-static)** hoàn toàn được phép chứa các thành viên `static` (như biến `public static int butter = 10;` ở dòng 6) → Dòng 6 biên dịch hợp lệ.
    * Dòng 3 & dòng 5: Các constructor dù là `private` nhưng đều nằm bên trong cùng phạm vi của lớp ngoài `Movie`, nên các phương thức trong `Movie` (kể cả `main`) đều có quyền truy cập → Dòng 12 và 13 biên dịch hợp lệ.
    * Dòng 13: Cú pháp khởi tạo inner class `new Movie().new Popcorn()` hoàn toàn chính xác.
    * Dòng 8: Lệnh `System.out.println(butter);` nằm bên trong lớp `Popcorn`. Theo quy tắc che giấu phạm vi (scoping), biến `butter` ở dòng 6 của chính lớp `Popcorn` sẽ che giấu biến `butter` của lớp ngoài `Movie`.
    * Do đó, chương trình in ra giá trị `10`.
    * **Bẫy thi cần nhớ:** Java 16+ cho phép inner class chứa biến static; biến cục bộ/thành viên lớp trong sẽ che giấu biến cùng tên của lớp ngoài.
</details>

---

### Question 12 (Câu 12)
**Which variables or members are accessible from within the `hiss()` method? (Choose all that apply.)**

```java
13: public class BoaConstrictor {
14:    private Body body;
15:    BoaConstrictor(Body b) { this.body = b; }
16:    private long tail = 10; 
17:    record Body(int stripes) {
18:       private static int counter = 0;
19:       int counter() { return counter; }
20:       Body {
21:          stripes = stripes + counter++;
22:       }
23:       private void hiss() {} } }
```

* A. `counter()`
* B. `tail`
* C. `body`
* D. `stripes()`
* E. `stripes`
* F. `counter`
* G. Line 15 does not compile.
* H. Line 17 does not compile.
* I. Lines 20–22 do not compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, D, E, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles, making options G, H, and I incorrect. The `hiss()` method is an instance member, so it can access any visible static members inside itself or the outer class, making option F correct. It can also access instance variables and methods within the record, making options A, D, and E correct. Because nested records are inherently static, it cannot access `body` or `tail`, which are instance members of the outer class, making options B and C incorrect.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Mã nguồn biên dịch hoàn toàn không có lỗi, do đó các lựa chọn G, H, I đều sai.
    * **Bản chất của Record lồng nhau:** Một `record` khi được định nghĩa lồng bên trong một lớp khác thì nó **luôn luôn ngầm định là `static`** (nested record is implicitly static).
    * Vì `record Body` là static, nó **không gắn liền với một đối tượng cụ thể nào của lớp ngoài `BoaConstrictor`**. Do đó, từ bên trong `Body`, nó **KHÔNG THỂ truy cập trực tiếp các biến instance của lớp ngoài** như `body` (C) và `tail` (B) nếu không có tham chiếu cụ thể.
    * Mặt khác, phương thức `hiss()` là một instance method bên trong `Body`, nên nó có thể truy cập:
    *   * Phương thức `counter()` (A)
    *   * Phương thức accessor `stripes()` (D)
    *   * Biến trường instance `stripes` của chính record (E)
    *   * Biến static `counter` (F).
    * **Bẫy thi cần nhớ:** Mọi nested record đều ngầm định là static, do đó không thể truy cập trực tiếp các biến instance của lớp bao ngoài.
</details>

---

### Question 13 (Câu 13)
**What is the result of the following program?**

```java
public class Weather {
   enum Seasons {
      WINTER, SPRING, SUMMER, FALL
   }
 
   public static void main(String[] args) {
      Seasons v = null;
      switch (v) {
         case Seasons.SPRING -> System.out.print("s");
         case Seasons.WINTER -> System.out.print("w");
         case Seasons.SUMMER -> System.out.print("m");
         default -> System.out.println("missing data"); }
   } }
```

* A. `s`
* B. `w`
* C. `m`
* D. `missing data`
* E. Exactly one line of code does not compile.
* F. More than one line of code does not compile.
* G. The code compiles but produces an exception at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **G**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles without issue, so options E and F are incorrect. It prints a `NullPointerException` at runtime, making option G correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Kể từ Java 21, câu lệnh và biểu thức `switch` hỗ trợ Pattern Matching và cho phép sử dụng tên đầy đủ kèm tiền tố enum (Qualified enum constant) như `case Seasons.SPRING ->` → Mã nguồn biên dịch hoàn toàn hợp lệ!
    * Tuy nhiên, biến `v` được gán giá trị bằng `null` (`Seasons v = null;`).
    * Trong Java, khi biểu thức selector của câu lệnh `switch` đánh giá ra `null`, và trong `switch` **không có nhánh `case null`**, JVM sẽ **ném ra ngoại lệ `NullPointerException` ngay lập tức** tại thời điểm chạy!
    * Nhánh `default` KHÔNG bắt giá trị `null` nếu không có `case null`. Do đó, chương trình ném ngoại lệ tại runtime → Chọn **G**.
    * **Bẫy thi cần nhớ:** Switch trên biến null mà không có nhánh 'case null' sẽ ném ra NullPointerException tại runtime, ngay cả khi có nhánh 'default'!
</details>

---

### Question 14 (Câu 14)
**Which statements about sealed classes are correct? (Choose all that apply.)**

* A. A sealed interface restricts which subinterfaces may extend it.
* B. A sealed class cannot be indirectly extended by a class that is not listed in its `permits` clause.
* C. A sealed class can be extended by an abstract class.
* D. A sealed class can be extended by a subclass that uses the `nonsealed` modifier.
* E. A sealed interface restricts which subclasses may implement it.
* F. A sealed class cannot contain any nested subclasses.
* G. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, C, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** A sealed interface restricts which interfaces may extend it, or which classes may implement it, making options A and E correct. Option B is incorrect. For example, a `non-sealed` subclass allows classes not listed in the `permits` clause to indirectly extend the sealed class. Option C is correct. While a sealed class is commonly extended by a subclass marked `final`, it can also be extended by a `sealed` or `non-sealed` subclass marked `abstract`. Option D is incorrect, as the modifier is `non-sealed`, not `nonsealed`. Finally, option F is incorrect, as sealed classes can contain nested subclasses.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * `A`: Đúng. Sealed interface giới hạn các sub-interface được phép `extends` nó.
    * `E`: Đúng. Sealed interface cũng giới hạn các class được phép `implements` nó.
    * `B`: Sai. Nếu một lớp con trực tiếp được khai báo là `non-sealed`, thì các lớp khác không có trong `permits` vẫn có thể kế thừa từ lớp `non-sealed` đó, tức là kế thừa gián tiếp sealed class.
    * `C`: Đúng. Lớp con trực tiếp của sealed class hoàn toàn có thể là `abstract class`, miễn là nó mang thêm một trong các modifier `sealed` hoặc `non-sealed`.
    * `D`: Sai. Từ khoá hợp lệ trong Java phải có dấu gạch nối: **`non-sealed`**, không phải `nonsealed`.
    * `F`: Sai. Sealed class hoàn toàn có thể chứa các nested subclasses.
    * **Bẫy thi cần nhớ:** Từ khóa đúng là 'non-sealed' (có dấu gạch nối). Lớp non-sealed cho phép các lớp ngoài danh sách permits kế thừa gián tiếp.
</details>

---

### Question 15 (Câu 15)
**Which line allows the code to print `Not scared` at runtime?**

```java
public class Ghost {
   public static void boo() {
      System.out.println("Not scared");
   }
   protected final class Spirit {
      public void boo() {
         System.out.println("Booo!!!");
      }
   }
   public static void main(String... haunt) {
      var g = new Ghost().new Spirit() {};
      _______________________________;
   } }
```

* A. `g.boo()`
* B. `g.super.boo()`
* C. `new Ghost().boo()`
* D. `g.Ghost.boo()`
* E. `new Spirit().boo()`
* F. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Trick question—the code does not compile! For this reason, option F is correct. The `Spirit` class is marked `final`, so it cannot be extended. The `main()` method uses an anonymous class that inherits from `Spirit`, which is not allowed. If `Spirit` were not marked `final`, then option C would be correct. Option A would print `Booo!!!`, while options B, D, and E would not compile for various reasons.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Bẫy thi cực kỳ tinh vi của Oracle:** Hãy chú ý dòng khai báo lớp `Spirit`:
    * `protected final class Spirit` được đánh dấu là **`final`**!
    * Trong phương thức `main`, đoạn mã viết: `var g = new Ghost().new Spirit() {};`.
    * Cặp dấu `{}` ở cuối dòng này chính là cú pháp khai báo một **Anonymous Class (lớp vô danh) kế thừa từ lớp `Spirit`**.
    * Vì lớp `Spirit` là `final`, nó **tuyệt đối không thể bị kế thừa**! Trình biên dịch sẽ báo lỗi ngay lập tức: `cannot inherit from final Ghost.Spirit`.
    * Vì đoạn mã không thể biên dịch được, nên không có dòng lệnh nào có thể làm cho chương trình in ra kết quả → Chọn **F**.
    * **Bẫy thi cần nhớ:** Không thể tạo anonymous class từ một class được đánh dấu là 'final'. Đề thi thường gài bẫy biên dịch trước khi bạn kịp suy nghĩ đến logic runtime!
</details>

---

### Question 16 (Câu 16)
**The following code appears in a file named `Ostrich.java`. What is the result of compiling the source file?**

```java
1: public class Ostrich {
2:    private int count;
3:    static class OstrichWrangler {
4:       public int stampede() {
5:          return count;
6:       } } }
```

* A. The code compiles successfully, and one bytecode file is generated: `Ostrich.class`.
* B. The code compiles successfully, and two bytecode files are generated: `Ostrich.class` and `OstrichWrangler.class`.
* C. The code compiles successfully, and two bytecode files are generated: `Ostrich.class` and `Ostrich$OstrichWrangler.class`.
* D. A compiler error occurs on line 3.
* E. A compiler error occurs on line 5.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `OstrichWrangler` class is a static nested class; therefore, it cannot access the instance member `count`. For this reason, line 5 does not compile, and option E is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Lớp `OstrichWrangler` là một **Static Nested Class** (lớp tĩnh lồng nhau).
    * Khác với Inner Class thông thường, một static nested class **không gắn liền với đối tượng instance nào của lớp ngoài**.
    * Tại dòng 5, phương thức `stampede()` cố gắng truy cập trực tiếp biến instance `count` của lớp ngoài `Ostrich` mà không thông qua một đối tượng tham chiếu cụ thể.
    * Do đó, dòng 5 gây lỗi biên dịch: `non-static variable count cannot be referenced from a static context` → Đáp án đúng là **E**.
    * **Bẫy thi cần nhớ:** Static nested class không thể truy cập trực tiếp instance variable của outer class mà không có đối tượng cụ thể.
</details>

---

### Question 17 (Câu 17)
**Which lines of the following interface declarations do not compile? (Choose all that apply.)**

```java
1: public interface Omnivore {
2:    int amount = 10;
3:    static boolean gather = true;
4:    static void eatGrass() {}
5:    int findMore() { return 2; }
6:    default float rest() { return 2; }
7:    protected int chew() { return 13; }
8:    private static void eatLeaves() {}
9: }
```

* A. All of the lines compile without issue.
* B. Line 2.
* C. Line 3.
* D. Line 4.
* E. Line 5.
* F. Line 6.
* G. Line 7.
* H. Line 8.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E, G**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Lines 2 and 3 compile with interface variables implicitly `public`, `static`, and `final`. Line 4 also compiles, as static methods are implicitly `public`. Line 5 does not compile, making option E correct. Non-static interface methods with a body must be explicitly marked `private` or `default`. Line 6 compiles, with the `public` modifier being added by the compiler. Line 7 does not compile, as interfaces do not have `protected` members, making option G correct. Finally, line 8 compiles without issue.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 2 & 3: Biến trong interface ngầm định là `public static final` → Hợp lệ.
    * Dòng 4: Phương thức `static` trong interface có thân hàm `{}` và ngầm định là `public` → Hợp lệ.
    * **Dòng 5:** `int findMore() { return 2; }` là phương thức instance có thân hàm nhưng **không có từ khoá `default` hoặc `private`**. Phương thức trong interface có thân hàm bắt buộc phải là `default`, `static`, hoặc `private` → **Lỗi biên dịch dòng 5**.
    * Dòng 6: Phương thức `default` có thân hàm, ngầm định là `public` → Hợp lệ.
    * **Dòng 7:** Thành viên trong interface **tuyệt đối không bao giờ được phép mang modifier `protected`** → **Lỗi biên dịch dòng 7**.
    * Dòng 8: Phương thức `private static` có thân hàm (hỗ trợ từ Java 9) → Hợp lệ.
    * **Bẫy thi cần nhớ:** Interface không hỗ trợ modifier 'protected'; phương thức instance có thân hàm bắt buộc phải có từ khoá 'default' hoặc 'private'.
</details>

---

### Question 18 (Câu 18)
**What is printed by the following program?**

```java
public class Deer {
   enum Food {APPLES, BERRIES, GRASS}
   protected class Diet {
      private Food getFavorite() {
         return Food.BERRIES;
      }
   }
   public static void main(String[] seasons) {
      System.out.print(switch(new Diet().getFavorite()) {
         case APPLES -> "a";
         case BERRIES -> "b";
         default -> "c";
      });
   } }
```

* A. `a`
* B. `b`
* C. `c`
* D. The code declaration of the `Diet` class does not compile.
* E. The `main()` method does not compile.
* F. The code compiles but produces an exception at runtime.
* G. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** `Diet` is an inner class, which requires an instance of `Deer` to instantiate. Since the `main()` method is static, there is no such instance. Therefore, the `main()` method does not compile, and option E is correct. If a reference to `Deer` were used, such as calling `new Deer().new Diet()`, then the code would compile and print `b` at runtime.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * `Diet` là một **Inner Class (member class non-static)** của lớp `Deer`.
    * Một inner class non-static **bắt buộc phải gắn liền với một đối tượng của lớp ngoài** thì mới có thể khởi tạo.
    * Trong phương thức `main` (là một static method), đoạn mã gọi trực tiếp: `new Diet()` mà không thông qua instance nào của `Deer`.
    * Trình biên dịch sẽ báo lỗi: `an enclosing instance that contains Deer.Diet is required`.
    * Để sửa lỗi, cần viết là: `new Deer().new Diet().getFavorite()`. Do đó, phương thức `main()` không biên dịch được → Chọn **E**.
    * **Bẫy thi cần nhớ:** Từ static context (như main), không thể khởi tạo trực tiếp non-static inner class bằng 'new Inner()' mà phải qua 'outerInstance.new Inner()'.
</details>

---

### Question 19 (Câu 19)
**Which of the following is printed by the `Bear` program?**

```java
public class Bear {
   enum FOOD {
      BERRIES, INSECTS {
         public boolean isHealthy() { return true; }},
      FISH, ROOTS, COOKIES, HONEY;
      public abstract boolean isHealthy();
   }
   public static void main(String[] args) {
      System.out.print(FOOD.INSECTS);
      System.out.print(FOOD.INSECTS.ordinal());
      System.out.print(FOOD.INSECTS.isHealthy());
      System.out.print(FOOD.COOKIES.isHealthy());
   } }
```

* A. `insects`
* B. `Insects`
* C. `0`
* D. `1`
* E. `false`
* F. The code does not compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `isHealthy()` method is marked `abstract` in the enum; therefore, it must be implemented in each enum value declaration. Since only `INSECTS` implements it, the code does not compile, making option F correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Enum `FOOD` khai báo một phương thức trừu tượng: `public abstract boolean isHealthy();`.
    * **Quy tắc vàng của Enum có abstract method:** Khi enum khai báo một phương thức abstract, **MỌI hằng số enum bên trong bắt buộc phải cung cấp phần thân ghi đè phương thức này** trong body riêng của nó!
    * Trong mã nguồn trên, chỉ duy nhất hằng số `INSECTS` triển khai phương thức `isHealthy()`, còn các hằng số khác (`BERRIES`, `FISH`, `ROOTS`, `COOKIES`, `HONEY`) đều không triển khai.
    * Do đó, trình biên dịch báo lỗi tại các hằng số chưa triển khai phương thức abstract → Đoạn mã không biên dịch được.
    * **Bẫy thi cần nhớ:** Khi enum có abstract method, TẤT CẢ các giá trị hằng số enum đều bắt buộc phải ghi đè phương thức đó.
</details>

---

### Question 20 (Câu 20)
**What is the output of this code?**

```java
13: record Gorilla(int x, Double y) {
14:    Gorilla {}
15:    Gorilla() { this(1,2.0); }
16: }
17: record Family(Gorilla parent1, Gorilla parent2) {}
18:
19: var family = new Family(
20:    new Gorilla(1, null), new Gorilla(0, 1.2));
21: System.out.print(switch (family) {
22:    case Family(var a, var b) -> "1";
23:    case Family(Gorilla c, Gorilla (int d, double e)) -> 
"2"; 
24:    case Family(Gorilla (int f, Double g), var h) -> 
"3";
25:    case Family(Gorilla i, Gorilla (int j, Double k)) -> 
"4";
26:    case Family(Object m, Object n) -> "5";
27:    case null -> "6"; 
28:    default -> "7";
29: });
```

* A. `1`
* B. `2`
* C. `3`
* D. `4`
* E. `5`
* F. `6`
* G. `7`
* H. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **H**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The record declarations compile but the `switch` expression does not, making option H correct. First, the second `case` statement does not compile, as `double` is not compatible with `Double`. Next, the pattern matching `case` statement on line 22 dominates the ones on lines 23–25. If three of them were to be removed (including the second one), then the code would compile and print the value associated with the remaining one.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Đoạn mã chứa nhiều lỗi biên dịch trong biểu thức `switch`:
    * 1. **Không tương thích kiểu:** Tại dòng 23, thành phần thứ hai của `Gorilla` được khai báo là kiểu đối tượng `Double y`. Nhưng pattern ở dòng 23 lại khai báo `Gorilla(int d, double e)` với kiểu nguyên thủy `double`. Trong Record Pattern, kiểu wrapper `Double` không tự động unbox để khớp với kiểu primitive `double` → Lỗi biên dịch.
    * 2. **Thống trị mẫu (Pattern Dominance):** Dòng 22 `case Family(var a, var b)` đã bao quát 100% mọi đối tượng kiểu `Family`. Các nhánh `case` từ dòng 23 đến 26 đều là các mẫu con cụ thể hơn của `Family` và bị nhánh ở dòng 22 che khuất hoàn toàn (unreachable code). Trình biên dịch Java cấm điều này và báo lỗi pattern dominance!
    * Vì biểu thức `switch` không biên dịch được, đáp án đúng là **H**.
    * **Bẫy thi cần nhớ:** Nhánh tổng quát hơn (như var a, var b) đứng trước sẽ 'thống trị' (dominate) các nhánh cụ thể đứng sau, gây lỗi biên dịch Unreachable Code.
</details>

---

### Question 21 (Câu 21)
**Given the following record declaration, which line of code can fill in the blank and allow the code to compile?**

```java
public record RabbitFood(int size, String brand, LocalDate 
expires) {
   public static int MAX_STORAGE = 100;
   public RabbitFood() {
      __________________________;
   }
}
```

* A. `size = MAX_STORAGE`
* B. `this.size = 10`
* C. `if(expires.isAfter(LocalDate.now())) throw new RuntimeException()`
* D. `if(brand==null) super.brand = "Unknown"`
* E. `throw new RuntimeException()`
* F. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The record defines an overloaded constructor using parentheses, not a compact one. For this reason, the first line must be a call to another constructor, such as `this(500, "Acme", LocalDate.now())`. For this reason, the code does not compile and option F is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Constructor `public RabbitFood()` là một **constructor nạp chồng (overloaded / non-canonical constructor)** vì nó có danh sách tham số khác với header của record.
    * **Quy tắc bất di bất dịch của Record Constructor:** Mọi non-canonical constructor trong record **bắt buộc phải gọi một constructor khác thông qua `this(...)` ngay tại dòng đầu tiên**, và chuỗi gọi này cuối cùng phải dẫn về Canonical Constructor!
    * Trong các lựa chọn từ A đến E, không có lựa chọn nào chứa lời gọi `this(...)` (ví dụ: `this(MAX_STORAGE, "Default", LocalDate.now())`).
    * Do đó, không có đáp án nào trong A–E có thể làm cho constructor này biên dịch hợp lệ → Chọn **F**.
    * **Bẫy thi cần nhớ:** Constructor nạp chồng trong record BẮT BUỘC phải gọi this(...) ở dòng đầu tiên để ủy quyền khởi tạo cho canonical constructor.
</details>

---

### Question 22 (Câu 22)
**Which of the following can be inserted in the `rest()` method? (Choose all that apply.)**

```java
public class Lion {
   class Cub {}
   static class Den {}
   static void rest() {
      ________________;
   } }
```

* A. `Cub a = Lion.new Cub()`
* B. `Lion.Cub b = new Lion().Cub()`
* C. `Lion.Cub c = new Lion().new Cub()`
* D. `var d = new Den()`
* E. `var e = Lion.new Cub()`
* F. `Lion.Den f = Lion.new Den()`
* G. `Lion.Den g = new Lion.Den()`
* H. `var h = new Cub()`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C, D, G**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Option C correctly creates an instance of an inner class `Cub` using an instance of the outer class `Lion`. Options A, B, E, and H use incorrect syntax for creating an instance of the `Cub` class. Options D and G correctly create an instance of the static nested `Den` class, which does not require an instance of `Lion`, while option F uses invalid syntax.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Phương thức `rest()` là một `static` method:
    * * `Cub` là một non-static inner class: Muốn khởi tạo bên trong static context, bắt buộc phải có đối tượng ngoài: `new Lion().new Cub()` → **C đúng**. Các lựa chọn A, B, E, H đều sai cú pháp.
    * * `Den` là một static nested class: Không cần đối tượng ngoài, có thể khởi tạo trực tiếp bằng `new Den()` (D) hoặc `new Lion.Den()` (G) → **D và G đúng**. Lựa chọn F dùng cú pháp sai (`Lion.new Den()`).
    * **Bẫy thi cần nhớ:** Khởi tạo inner class: 'outerRef.new Inner()'. Khởi tạo static nested class: 'new Outer.StaticNested()'.
</details>

---

### Question 23 (Câu 23)
**Given the following program, what can be inserted into the blank line that would allow it to print `Swim!` at runtime?**

```java
interface Swim {
   default void perform() { System.out.print("Swim!"); }
}
interface Dance {
   default void perform() { System.out.print("Dance!"); }
}
public class Penguin implements Swim, Dance {
   public void perform() { System.out.print("Smile!"); }
   private void doShow() {
      ____________________;
   }
   public static void main(String[] eggs) {
      new Penguin().doShow();
   } }
```

* A. `super.perform()`
* B. `Swim.perform()`
* C. `super.Swim.perform()`
* D. `Swim.super.perform()`
* E. The code does not compile regardless of what is inserted into the blank.
* F. The code compiles, but due to polymorphism, it is not possible to produce the requested output without creating a new object.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** First, if a class or interface inherits two interfaces containing `default` methods with the same signature, it must override the method with its own implementation. The `Penguin` class does this correctly, so option E is incorrect. The way to access an inherited `default` method is by using the syntax `Swim.super.perform()`, making option D correct. We agree that the syntax is bizarre, but you need to learn it. Options A, B, and C are incorrect and result in compiler errors.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Lớp `Penguin` triển khai cả hai interface `Swim` và `Dance` đều có phương thức default `perform()`. Lớp `Penguin` đã ghi đè lại phương thức này để giải quyết xung đột, hoàn toàn hợp lệ.
    * Để gọi phương thức `default` của một interface cha cụ thể, Java cung cấp cú pháp chuẩn mực duy nhất:
    * **`<TênInterface>.super.<tênPhươngThức>()`**
    * Ở đây, để gọi phiên bản của `Swim`, cú pháp chính xác là: `Swim.super.perform();` → Đáp án đúng là **D**.
    * Các cú pháp như `super.perform()`, `Swim.perform()`, hay `super.Swim.perform()` đều là cú pháp sai và gây lỗi biên dịch.
    * **Bẫy thi cần nhớ:** Cú pháp gọi default method của interface cha: InterfaceName.super.methodName().
</details>

---

### Question 24 (Câu 24)
**Which lines of the following interface do not compile? (Choose all that apply.)**

```java
1: public interface BigCat {
2:    abstract String getName();
3:    static int hunt() { getName(); return 5; }
4:    default void climb() { rest(); }
5:    private void roar() { getName();  climb(); hunt(); }
6:    private static boolean sneak() { roar(); return true; 
}
7:    private int rest() { return 2; };
8: }
```

* A. Line 2
* B. Line 3
* C. Line 4
* D. Line 5
* E. Line 6
* F. Line 7
* G. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Line 3 does not compile because the static method `hunt()` cannot access an abstract instance method `getName()`, making option B correct. Line 6 does not compile because the private static method `sneak()` cannot access the private instance method `roar()`, making option E correct. The rest of the lines compile without issue.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Dòng 3:** Phương thức `static int hunt()` là phương thức cấp lớp (static context), nhưng nó lại cố gắng gọi trực tiếp phương thức instance trừu tượng `getName()` mà không có đối tượng. Static method không thể gọi instance method → **Lỗi biên dịch dòng 3**.
    * **Dòng 6:** Phương thức `private static boolean sneak()` là static context, nhưng nó lại gọi trực tiếp phương thức private instance `roar()`. Tương tự, static không thể gọi instance → **Lỗi biên dịch dòng 6**.
    * Các dòng còn lại đều hợp lệ: dòng 4 (default gọi private instance `rest()`), dòng 5 (private instance gọi abstract, default, và static method đều được), dòng 7 (private instance method có thân hàm).
    * **Bẫy thi cần nhớ:** Phương thức static trong interface chỉ có thể gọi các thành viên static khác; không thể gọi instance method (abstract, default, private instance).
</details>

---

### Question 25 (Câu 25)
**What does the following program print?**

```java
1:  public class Zebra {
2:     private int x = 24;
3:     public int hunt() {
4:        String message = "x is ";
5:        abstract class Stripes {
6:           private int x = 0;
7:           public void print() {
8:              System.out.print(message + Zebra.this.x);
9:           }
10:       }
11:       var s = new Stripes() {};
12:       s.print();
13:       return x;
14:    }
15:    public static void main(String[] args) {
16:       new Zebra().hunt();
17:    } }
```

* A. `x is 0`
* B. `x is 24`
* C. Line 6 generates a compiler error.
* D. Line 8 generates a compiler error.
* E. Line 11 generates a compiler error.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** `Zebra.this.x` is the correct way to refer to `x` in the `Zebra` class. Line 5 defines an abstract local class within a method, while line 11 defines a concrete anonymous class that extends the `Stripes` class. The code compiles without issue and prints `x is 24` at runtime, making option B the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 5 định nghĩa một **Local Abstract Class** `Stripes` bên trong phương thức `hunt()`, hoàn toàn hợp lệ.
    * Dòng 11 sử dụng một **Anonymous Class** để kế thừa và khởi tạo lớp trừu tượng `Stripes`: `new Stripes() {}` → Hoàn toàn hợp lệ.
    * Dòng 8: Lệnh in sử dụng biến cục bộ `message` (là `effectively final` vì không bị thay đổi sau khi gán) kết hợp với `Zebra.this.x`.
    * Biểu thức `Zebra.this.x` tham chiếu một cách tường minh đến biến instance `x` của đối tượng lớp ngoài `Zebra` (có giá trị là `24`), bỏ qua biến `x = 0` của lớp `Stripes`.
    * Do đó, chương trình in ra: `x is 24` → Đáp án đúng là **B**.
    * **Bẫy thi cần nhớ:** Cú pháp 'OuterClass.this.variable' cho phép truy cập chính xác biến của lớp ngoài khi bị trùng tên với biến lớp trong.
</details>

---

### Question 26 (Câu 26)
**What is the output of the following program?**

```java
20: public enum Animals {
21:    MAMMAL(List.of(2,4)), 
22:    INVERTEBRATE(List.of(2, 4, 6, 8, 100)), 
23:    BIRD(null) {
24:       public int stand() {
25:          return legs.get(0) + 4;
26:       }
27:    };
28:    List<Integer> legs;
29:    Animals(List<Integer> legs) {
30:       this.legs = legs;
31:    }
32:    public int stand() { return legs.get(0); }
33:    public static void main(String[] a) {
34:       Animals.BIRD.legs = List.of(-1);
35:       System.out.println(Animals.BIRD.stand());
36:    } }
```

* A. `null`
* B. `-1`
* C. `3`
* D. `4`
* E. Compiler error on lines 23.
* F. Compiler error on lines 24.
* G. Compiler error on line 34.
* H. The code compiles but produces a `NullPointerException` at runtime.
* I. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles and runs without issue. The `stand()` method is overridden on line 24, so the code prints `3` (`-1 + 4`) at runtime, making option C correct. Note that unlike records, enums can have mutable members, so the modification of `legs` on line 34 is permitted (albeit not recommended!).
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Khác với Record, các trường trong Enum **không bị bắt buộc phải là `final`**. Trường `legs` ở dòng 28 không có modifier `final`, do đó dòng 34 thay đổi tham chiếu `Animals.BIRD.legs = List.of(-1);` là hoàn toàn hợp lệ (dù trong thực tế đây là bad practice).
    * Hằng số `BIRD` ghi đè phương thức `stand()` ở dòng 24:
    *   `return legs.get(0) + 4;`
    * Tại thời điểm chạy dòng 35, `legs.get(0)` trả về `-1`. Do đó, biểu thức tính toán: `-1 + 4 = 3`.
    * Chương trình in ra số `3` → Đáp án đúng là **C**.
    * **Bẫy thi cần nhớ:** Hằng số enum có thể ghi đè phương thức trong body riêng; biến trong enum nếu không khai báo final thì vẫn có thể bị sửa đổi giá trị.
</details>

---

### Question 27 (Câu 27)
**Assuming a record is defined with at least one field, which components does the compiler always insert, each of which may be overridden or redeclared? (Choose all that apply.)**

* A. A no-argument constructor
* B. An accessor method for each field
* C. The `toString()` method
* D. The `equals()` method
* E. A mutator method for each field
* F. A sort method for each field
* G. The `hashCode()` method

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, C, D, G**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The compiler inserts an accessor for each field, a constructor containing all of the fields in the order they are declared, and useful implementations of `equals()`, `hashCode()`, and `toString()`, making options B, C, D, and G correct. Option A is incorrect, as the compiler would only insert a no-argument constructor if the record had no fields. Option E is incorrect, as records are immutable. Option F is also incorrect and not a property of records.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Khi một record có trường dữ liệu, trình biên dịch sẽ tự động chèn vào:
    * * **Accessor method** cho mỗi trường (tên trùng tên trường, không có tiền tố `get`) → **B đúng**.
    * * Phương thức **`toString()`** in ra tên record và các giá trị trường → **C đúng**.
    * * Phương thức **`equals()`** so sánh toàn bộ các trường → **D đúng**.
    * * Phương thức **`hashCode()`** tính toán mã băm dựa trên các trường → **G đúng**.
    * * Canonical Constructor nhận đầy đủ các tham số tương ứng với các trường trong header (chứ KHÔNG PHẢI constructor không tham số) → A sai.
    * * Record là đối tượng bất biến (immutable), không có phương thức setter/mutator → E sai.
    * **Bẫy thi cần nhớ:** Record không có setter/mutator và không tự động sinh constructor không tham số nếu header có chứa trường.
</details>

---

### Question 28 (Câu 28)
**Which of the following classes and interfaces do not compile? (Choose all that apply.)**

```java
public abstract class Camel { void travel(); }
 
public interface EatsGrass { private abstract int chew(); }
 
public abstract class Elephant {
   abstract private class SleepsAlot {
      abstract int sleep();
   } }
 
public class Eagle { abstract soar(); }
 
public interface Spider { default void crawl() {} }
```

* A. `Camel`
* B. `EatsGrass`
* C. `Elephant`
* D. `Eagle`
* E. `Spider`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, B, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** `Camel` does not compile because the `travel()` method does not declare a body, nor is it marked `abstract`, making option A correct. `EatsGrass` also does not compile because an interface method cannot be marked both `private` and `abstract`, making option B correct. Finally, `Eagle` does not compile because it declares an abstract method `soar()` in a concrete class, making option D correct. The other classes compile without issue.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * `Camel` (A): Phương thức `travel();` không có thân hàm nhưng lại **không có từ khoá `abstract`** trong khai báo phương thức → Lỗi biên dịch.
    * `EatsGrass` (B): Phương thức `chew()` kết hợp cả hai từ khoá **`private` và `abstract`**. Trong Java, phương thức `abstract` yêu cầu phải được kế thừa để ghi đè, còn `private` lại ngăn cấm kế thừa. Hai từ khoá này triệt tiêu lẫn nhau và bị cấm kết hợp → Lỗi biên dịch.
    * `Eagle` (D): Lớp `Eagle` là concrete class nhưng lại chứa phương thức `abstract`, đồng thời phương thức `soar()` còn thiếu kiểu trả về → Lỗi biên dịch.
    * `Elephant` (C): Abstract class có thể chứa abstract member inner class, hoàn toàn hợp lệ.
    * `Spider` (E): Interface chứa default method có thân hàm, hoàn toàn hợp lệ.
    * **Bẫy thi cần nhớ:** Không bao giờ được kết hợp 'private' và 'abstract'; concrete class không được chứa abstract method.
</details>

---

### Question 29 (Câu 29)
**How many lines of the following program contain a compilation error?**

```java
1:  class Primate {
2:     protected int age = 2;
3:     { age = 1; }
4:     public Primate() {
5:        this().age = 3;
6:     }
7:  }
8:  public class Orangutan {
9:     protected int age = 4;
10:    { age = 5; }
11:    public Orangutan() {
12:       this().age = 6;
13:    }
14:    public static void main(String[] bananas) {
15:       final Primate x = (Primate)new Orangutan();
16:       System.out.println(x.age);
17:    }
18: }
```

* A. None, and the program prints `1` at runtime.
* B. None, and the program prints `3` at runtime.
* C. None, but it causes a `ClassCastException` at runtime.
* D. `1`
* E. `2`
* F. `3`
* G. `4`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code does not compile, so options A through options C are incorrect. Both lines 5 and 12 do not compile, as `this()` is used instead of `this`. Remember, `this()` refers to calling a constructor, whereas `this` is a reference to the current instance. Next, the compiler does not allow casting to an unrelated class type. Since `Orangutan` is not a subclass of `Primate`, the cast on line 15 is invalid, and the code does not compile. Due to these three lines containing compilation errors, option F is the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Chương trình chứa chính xác 3 dòng bị lỗi biên dịch:
    * 1. **Dòng 5 (`this().age = 3;`):** Cú pháp `this()` chỉ được dùng để gọi constructor khác ở dòng đầu tiên của constructor. `this()` không phải là một tham chiếu đối tượng để có thể truy xuất thuộc tính `.age` (phải là `this.age = 3;`).
    * 2. **Dòng 12 (`this().age = 6;`):** Mắc lỗi tương tự như dòng 5.
    * 3. **Dòng 15 (`(Primate)new Orangutan();`):** Lớp `Orangutan` và lớp `Primate` là hai lớp hoàn toàn độc lập, không có quan hệ cha - con trong cây kế thừa (`Orangutan` không `extends Primate`). Khi ép kiểu giữa hai lớp không cùng nhánh kế thừa, trình biên dịch sẽ báo lỗi ngay lập tức: `inconvertible types; cannot cast Orangutan to Primate`.
    * Tổng cộng có 3 dòng bị lỗi biên dịch (dòng 5, dòng 12, dòng 15) → Đáp án đúng là **F**.
    * **Bẫy thi cần nhớ:** Cú pháp 'this()' dùng gọi constructor, không thể gọi thuộc tính 'this().field'; trình biên dịch chặn đứng việc ép kiểu giữa 2 class không có quan hệ thừa kế.
</details>

---

### Question 30 (Câu 30)
**Assuming the following classes are declared as top-level types in the same file, which classes contain compiler errors? (Choose all that apply.)**

```java
sealed class Bird {
   public final class Flamingo extends Bird {}   
}
 
sealed class Monkey {}
 
class EmperorTamarin extends Monkey {}
 
non-sealed class Mandrill extends Monkey {}
 
sealed class Friendly extends Mandrill permits Silly {}
 
final class Silly {}
```

* A. `Bird`
* B. `Monkey`
* C. `EmperorTamarin`
* D. `Mandrill`
* E. `Friendly`
* F. `Silly`
* G. All of the classes compile without issue.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** `Bird` and its nested `Flamingo` subclass compile without issue. The `permits` clause is optional if the subclass is nested or declared in the same file. For this reason, `Monkey` and its subclass `Mandrill` also compile without issue. `EmperorTamarin` does not compile, as it is missing a `non-sealed`, `sealed`, or `final` modifier, making option C correct. `Friendly` also does not compile, since it lists a subclass `Silly` that does not extend it, making option E correct. While the `permits` clause is optional, the `extends` clause is not. `Silly` compiles just fine. Even though it does not extend `Friendly`, the compiler error is in the sealed class.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * `Bird` và lớp lồng nhau `Flamingo` biên dịch hợp lệ vì mệnh đề `permits` có thể được lược bỏ khi lớp con là nested class.
    * `Monkey` và lớp con `Mandrill` biên dịch hợp lệ vì trong cùng một tệp, `permits` có thể lược bỏ, và `Mandrill` có modifier `non-sealed` hợp lệ.
    * **`EmperorTamarin` (C):** Kế thừa từ sealed class `Monkey` nhưng **thiếu modifier bắt buộc** (`final`, `sealed`, hoặc `non-sealed`) → Lỗi biên dịch.
    * **`Friendly` (E):** Khai báo `permits Silly`, nhưng lớp `Silly` lại khai báo là `final class Silly {}` mà **không hề có `extends Friendly`**! Lớp được cấp phép trong `permits` bắt buộc phải kế thừa sealed class tương ứng → Lỗi biên dịch tại `Friendly`.
    * Lớp `Silly` tự nó là một lớp final bình thường, không chứa lỗi cú pháp.
    * Do đó, các lớp chứa lỗi biên dịch là `EmperorTamarin` và `Friendly` → Chọn **C và E**.
    * **Bẫy thi cần nhớ:** Lớp con của sealed class phải có 1 trong 3 modifier (final/sealed/non-sealed); các lớp được liệt kê trong 'permits' bắt buộc phải thực sự kế thừa sealed class đó.
</details>

---
