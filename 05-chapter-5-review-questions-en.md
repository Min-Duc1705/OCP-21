# Review Questions (Bộ Câu Hỏi Ôn Tập Tiếng Anh) - Chapter 5: Methods

> **Source (Nguồn trích dẫn):** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Pages 480–491).  
> **Quantity (Số lượng):** 21 multiple-choice questions matching the official Oracle exam format with detailed English & Vietnamese explanations (Pages 1347–1353).  
> **How to study (Cách học):** Read the verbatim English question and reason through the options first, then click **"👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)"** to verify your answer and master Oracle's exam traps.

---

### Question 1 (Câu 1)
**Which statements about the `final` modifier are correct? (Choose all that apply.)**

* A. Instance and `static` variables can be marked `final`.
* B. A variable is effectively final only if it is marked `final`.
* C. An object that is marked `final` cannot be modified.
* D. Local variables cannot be declared with type `var` and the `final` modifier.
* E. A primitive that is marked `final` cannot be modified.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Instance and `static` variables can be marked `final`, making option A correct. Effectively final means a local variable is not marked `final` but whose value does not change after it is set, making option B incorrect. Option C is incorrect, as `final` refers only to the reference to an object, not its contents. Option D is incorrect, as `var` and `final` can be used together. Finally, option E is correct: once a primitive is marked `final`, it cannot be modified.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A đúng:** Cả biến thể hiện và biến tĩnh đều có thể được khai báo với từ khóa `final`.
    * **E đúng:** Đối với biến kiểu nguyên thủy mang từ khóa `final`, giá trị bit của nó một khi đã gán thì không thể gán lại hay thay đổi.
    * **B sai:** `Effectively final` là khái niệm áp dụng cho một biến cục bộ **không được gắn từ khóa `final`**, nhưng giá trị của nó không bao giờ bị thay đổi hay gán lại sau lần khởi tạo đầu tiên.
    * **C sai:** Từ khóa `final` áp dụng cho một biến tham chiếu đối tượng chỉ đảm bảo **biến tham chiếu đó không thể trỏ sang đối tượng khác**, nó hoàn toàn không ngăn cản việc thay đổi trạng thái nội bộ của đối tượng đó (ví dụ: `final StringBuilder sb = new StringBuilder(); sb.append("abc");` hoàn toàn hợp lệ!).
    * **D sai:** Java cho phép kết hợp `final` với `var` cho biến cục bộ: `final var x = 10;` là cú pháp hoàn toàn hợp lệ.
</details>

---

### Question 2 (Câu 2)
**Which of the following can fill in the blank in this code to make it compile? (Choose all that apply.)**

```java
public class Ant {
    _________ void method() {}
}
```

* A. `default`
* B. `final`
* C. `private`
* D. `Public`
* E. `String`
* F. `zzz:`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The keyword `void` is a return type. Only the access modifier or optional specifiers are allowed before the return type. Option C is correct, creating a method with `private` access. Option B is also correct, creating a method with package access and the optional specifier `final`. Since package access does not use a modifier, we get to jump right to `final`. Option A is incorrect because package access omits the access modifier rather than specifying `default`. Option D is incorrect because Java is case sensitive. It would have been correct if `public` were the choice. Option E is incorrect because the method already has a `void` return type. Option F is incorrect because labels are not allowed for methods.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Từ khóa `void` là **kiểu trả về (return type)**. Vị trí đứng trước kiểu trả về chỉ có thể là **phạm vi truy cập (Access Modifier)** hoặc **từ khóa tùy chọn (Optional Specifiers)**.
    * **C đúng:** `private void method() {}` khai báo phương thức với phạm vi truy cập `private`.
    * **B đúng:** `final void method() {}` khai báo phương thức với phạm vi truy cập mặc định (*package-private*, do không có access modifier) kèm theo specifier tùy chọn là `final`.
    * **A sai:** Từ khóa `default` dùng trong switch hoặc trong interface, **không phải là một access modifier hợp lệ trong class**. Để có package access, chỉ cần bỏ trống không ghi gì.
    * **D sai:** Java phân biệt chữ hoa chữ thường (*case-sensitive*). Từ khóa đúng phải là `public` chữ thường, `Public` viết hoa sẽ báo lỗi biên dịch.
    * **E sai:** Phương thức đã có kiểu trả về là `void`, không thể thêm kiểu trả về thứ hai là `String`.
    * **F sai:** Nhãn lệnh (*Labels*) không được phép đặt trước khai báo phương thức.
</details>

---

### Question 3 (Câu 3)
**Which of the following methods compile? (Choose all that apply.)**

* A. `final static void rain() {}`
* B. `public final int void snow() {}`
* C. `private void int hail() {}`
* D. `static final void sleet() {}`
* E. `void final ice() {}`
* F. `void public slush() {}`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Options A and D are correct because the optional specifiers are allowed in any order. Options B and C are incorrect because they each have two return types. Options E and F are incorrect because the return type is before the optional specifier and access modifier, respectively.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A và D đúng:** Các từ khóa tùy chọn (*Optional Specifiers*) như `final` và `static` có thể xuất hiện theo **bất kỳ thứ tự nào** (`final static` hay `static final` đều hợp lệ), và cả hai đều đứng trước kiểu trả về `void` với phạm vi truy cập package-private.
    * **B và C sai:** Mỗi phương thức chỉ được phép có duy nhất một kiểu trả về. Ở câu B có cả `int` và `void`, câu C có cả `void` và `int`.
    * **E và F sai:** Kiểu trả về (`void`) bắt buộc phải đứng **ngay trước tên phương thức**. Ở câu E, `void` lại đứng trước `final`; ở câu F, `void` lại đứng trước `public` → Đều gây lỗi cú pháp biên dịch.
</details>

---

### Question 4 (Câu 4)
**Which of the following can fill in the blank and allow the code to compile? (Choose all that apply.)**

```java
final ______ song = 6;
```

* A. `int`
* B. `Integer`
* C. `long`
* D. `Long`
* E. `double`
* F. `Double`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, B, C, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The value `6` can be implicitly promoted to any of the primitive types, making options A, C, and E correct. It can also be autoboxed to `Integer`, making option B correct. It cannot be both promoted and autoboxed, making options D and F incorrect.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Giá trị literal `6` có kiểu mặc định là `int`.
    * **A hợp lệ:** Khớp chính xác kiểu nguyên thủy `int`.
    * **B hợp lệ:** Java tự động bao gói (*Autoboxing*) từ `int` sang `Integer`.
    * **C và E hợp lệ:** Java thực hiện nới rộng kiểu nguyên thủy (*Widening primitive conversion*): từ `int` có thể nới rộng ngầm định sang `long` (C) hoặc sang `double` (E).
    * **D và F KHÔNG HỢP LỆ (Bẫy thi cực lớn):** Java **không bao giờ thực hiện đồng thời 2 bước chuyển đổi liên tiếp**! Literal `6` là `int`, để gán vào `Long` nó phải vừa nới rộng sang `long` vừa autobox sang `Long` → Trình biên dịch không hỗ trợ và báo lỗi `incompatible types: int cannot be converted to Long`. Tương tự với `Double`.
</details>

---

### Question 5 (Câu 5)
**Which of the following methods compile? (Choose all that apply.)**

* A. `public void january() { return; }`
* B. `public int february() { return null;}`
* C. `public void march() {}`
* D. `public int april() { return 9;}`
* E. `public int may() { return 9.0;}`
* F. `public int june() { return;}`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, C, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Options A and C are correct because a `void` method is optionally allowed to have a `return` statement as long as it doesn’t try to return a value. Option B does not compile because `null` requires a reference object as the return type. Since `int` is primitive, it is not a reference object. Option D is correct because it returns an `int` value. Option E does not compile because it tries to return a `double` when the return type is `int`. Since a `double` cannot be assigned to an `int`, it cannot be returned as one either. Option F does not compile because no value is actually returned.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A và C đúng:** Phương thức có kiểu trả về `void` có thể không có lệnh `return` (như câu C), hoặc có lệnh `return;` rỗng để thoát sớm (như câu A).
    * **D đúng:** Phương thức trả về kiểu `int`, giá trị trả về `9` khớp chính xác kiểu `int`.
    * **B sai:** Giá trị `null` chỉ có thể gán hoặc trả về cho các kiểu đối tượng tham chiếu (*reference types*). Kiểu `int` là kiểu nguyên thủy nên không thể nhận `null` → Lỗi biên dịch.
    * **E sai:** Giá trị `9.0` là kiểu số thực `double`, không thể tự động ép kiểu thu hẹp (*narrowing*) về kiểu số nguyên `int` mà không có ép kiểu tường minh `(int)` → Lỗi biên dịch.
    * **F sai:** Phương thức khai báo trả về `int` bắt buộc phải trả về một giá trị số nguyên, không được dùng lệnh `return;` rỗng → Lỗi biên dịch.
</details>

---

### Question 6 (Câu 6)
**Which of the following methods compile? (Choose all that apply.)**

* A. `public void violin(int... nums) {}`
* B. `public void viola(String values, int... nums) {}`
* C. `public void cello(int... nums, String values) {}`
* D. `public void bass(String... values, int... nums) {}`
* E. `public void flute(String[] values, ...int nums) {}`
* F. `public void oboe(String[] values, int[] nums) {}`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, B, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Options A and B are correct because the single varargs parameter is the last parameter declared. Option F is correct because it doesn’t use any varargs parameters. Option C is incorrect because the varargs parameter is not last. Option D is incorrect because two varargs parameters are not allowed in the same method. Option E is incorrect because the `...` for a varargs must be after the type, not before it.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A và B đúng:** Tuân thủ chuẩn 2 quy tắc của varargs: Chỉ có đúng một tham số varargs và tham số đó đứng ở vị trí cuối cùng trong danh sách tham số.
    * **F đúng:** Khai báo nhận hai mảng thông thường (`String[]` và `int[]`), không dùng varargs nên hoàn toàn hợp lệ.
    * **C sai:** Tham số varargs `int... nums` không đứng ở vị trí cuối cùng (`String values` đứng sau).
    * **D sai:** Phương thức có tới 2 tham số varargs (`String...` và `int...`).
    * **E sai:** Ba dấu chấm `...` phải đặt **sau kiểu dữ liệu** (`int... nums`), không được đặt trước kiểu dữ liệu (`...int nums`).
</details>

---

### Question 7 (Câu 7)
**Given the following method, which of the method calls return `2`? (Choose all that apply.)**

```java
public int juggle(boolean b, boolean... b2) {
   return b2.length;
}
```

* A. `juggle();`
* B. `juggle(true);`
* C. `juggle(true, true);`
* D. `juggle(true, true, true);`
* E. `juggle(true, {true, true});`
* F. `juggle(true, new boolean[2]);`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Options D and F are correct. Option D passes the initial parameter plus two more to turn into a varargs array of size 2. Option F passes the initial parameter plus an array of size 2. Option A does not compile because it does not pass the initial parameter. Option E does not compile because it does not declare an array properly. It should be `new boolean[] {true, true}`. Option B creates a varargs array of size 0, and option C creates a varargs array of size 1.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Phương thức nhận 1 tham số bắt buộc `boolean b` và theo sau là tham số biến đổi `boolean... b2`. Giá trị trả về chính là độ dài mảng `b2.length`.
    * **D đúng:** Đối số thứ nhất (`true`) gán cho `b`. Hai đối số tiếp theo (`true, true`) được gom vào mảng `b2`, do đó `b2.length == 2`.
    * **F đúng:** Đối số thứ nhất gán cho `b`, đối số thứ hai truyền trực tiếp một mảng `new boolean[2]` có độ dài 2 → `b2.length == 2`.
    * **A sai:** Không biên dịch được vì thiếu tham số bắt buộc đầu tiên `b`.
    * **B sai:** Truyền 1 đối số cho `b`, `b2` rỗng → `b2.length == 0`.
    * **C sai:** Truyền 1 đối số cho `b`, 1 đối số cho `b2` → `b2.length == 1`.
    * **E sai:** Cú pháp viết tắt `{true, true}` chỉ hợp lệ khi khai báo mảng đồng thời, không được dùng làm đối số trong lời gọi hàm mà phải viết là `new boolean[] {true, true}` → Lỗi biên dịch.
</details>

---

### Question 8 (Câu 8)
**Which of the following statements is correct?**

* A. Package access is more lenient than `protected` access.
* B. A `public` class that has `private` fields and package methods is not visible to classes outside the package.
* C. You can use access modifiers so only some of the classes in a package see a particular package class.
* D. You can use access modifiers to allow access to all methods and not any instance variables.
* E. You can use access modifiers to restrict access to all classes that begin with the word `Test`.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Option D is correct. A common practice is to set all fields to be `private` and all methods to be `public`. Option A is incorrect because `protected` access allows everything that package access allows and additionally allows subclasses access. Option B is incorrect because the class is `public`. This means that other classes can see the class. However, they cannot call any of the methods or read any of the fields. It is essentially a useless class. Option C is incorrect because package access applies to the whole package. Option E is incorrect because Java has no such wildcard access capability.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **D đúng:** Đây chính là nguyên lý đóng gói (*Encapsulation*) kinh điển trong Java: Đặt tất cả các trường dữ liệu là `private` (không cho bên ngoài truy cập) và cung cấp các phương thức `public` để thao tác dữ liệu.
    * **A sai:** `protected` lỏng hơn package access vì nó cho phép tất cả các lớp trong cùng package truy cập VÀ thêm cả các lớp con ở các package khác.
    * **B sai:** Lớp là `public` nên mọi lớp ở package khác đều nhìn thấy và import được lớp đó (chỉ là không gọi được các phương thức package-private hay trường private).
    * **C sai:** Package access áp dụng bình đẳng cho TOÀN BỘ các lớp trong cùng một package, không thể phân biệt lớp này được xem còn lớp kia thì không.
    * **E sai:** Java không hỗ trợ cơ chế lọc quyền truy cập theo mẫu tên lớp (*wildcard naming*).
</details>

---

### Question 9 (Câu 9)
**Given the following class definitions, which lines in the `main()` method generate a compiler error? (Choose all that apply.)**

```java
// Classroom.java 
package my.school;
public class Classroom {
   private int roomNumber;
   protected static String teacherName;
   static int globalKey = 54321;
   public static int floor = 3;
   Classroom(int r, String t) {
      roomNumber = r;
      teacherName = t; } }
 
// School.java 
1: package my.city;
2: import my.school.*;
3: public class School {
4:    public static void main(String[] args) {
5:       System.out.println(Classroom.globalKey);
6:       Classroom room = new Classroom(101, "Mrs. Anderson");
7:       System.out.println(room.roomNumber);
8:       System.out.println(Classroom.floor);
9:       System.out.println(Classroom.teacherName); } }
```

* A. None: the code compiles fine.
* B. Line 5.
* C. Line 6.
* D. Line 7.
* E. Line 8.
* F. Line 9.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, C, D, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The two classes are in different packages, which means `private` access and package access will not compile. This causes compiler errors on lines 5, 6, and 7, making options B, C, and D correct answers. Additionally, `protected` access will not compile since `School` does not inherit from `Classroom`. This causes the compiler error on line 9, making option F a correct answer as well.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Hai lớp `Classroom` và `School` nằm ở **hai package khác nhau** (`my.school` vs `my.city`), và `School` **không kế thừa** `Classroom`.
    * **Dòng 5 LỖI BIÊN DỊCH (B đúng):** `globalKey` có quyền truy cập package-private (mặc định), không thể truy cập từ package khác.
    * **Dòng 6 LỖI BIÊN DỊCH (C đúng):** Constructor của `Classroom` có quyền package-private (`Classroom(int, String)`), do đó lớp `School` ở package khác không thể gọi constructor này để tạo đối tượng!
    * **Dòng 7 LỖI BIÊN DỊCH (D đúng):** `roomNumber` là `private`, chỉ có thể truy cập bên trong lớp `Classroom`.
    * **Dòng 8 HỢP LỆ (E sai):** `floor` là `public static`, có thể truy cập từ bất kỳ đâu.
    * **Dòng 9 LỖI BIÊN DỊCH (F đúng):** `teacherName` là `protected`. Vì `School` không phải là lớp con kế thừa từ `Classroom`, nên không có quyền truy cập thành phần `protected` từ package khác.
</details>

---

### Question 10 (Câu 10)
**What is the output of executing the `Chimp` program?**

```java
// Rope.java 
1: package rope;
2: public class Rope {
3:    public static int LENGTH = 5;
4:    static { 
5:       LENGTH = 10;
6:    }
7:    public static void swing() {
8:       System.out.print("swing ");
9:    } }
 
// Chimp.java 
1: import rope.*;
2: import static rope.Rope.*;
3: public class Chimp {
4:    public static void main(String[] args) {
5:       Rope.swing();
6:       new Rope().swing();
7:       System.out.println(LENGTH);
8:    } }
```

* A. `swing swing 5`
* B. `swing swing 10`
* C. Compiler error on line 2 of `Chimp`
* D. Compiler error on line 5 of `Chimp`
* E. Compiler error on line 6 of `Chimp`
* F. Compiler error on line 7 of `Chimp`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B (`swing swing 10`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** `Rope` runs line 3, setting `LENGTH` to 5, and then immediately after that runs the `static` initializer, which sets it to 10. Line 5 in the `Chimp` class calls the `static` method normally and prints `swing` and a space. Line 6 also calls the `static` method. Java allows calling a `static` method through an instance variable, although it is not recommended. Line 7 uses the `static` import on line 2 to reference `LENGTH`. For these reasons, option B is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Trong lớp `Rope`: Dòng 3 khởi tạo `LENGTH = 5`. Ngay sau đó, khối `static { LENGTH = 10; }` chạy khi lớp được nạp và gán lại `LENGTH = 10`.
    * Trong lớp `Chimp`:
      * Dòng 2: `import static rope.Rope.*;` là cú pháp static import hợp lệ.
      * Dòng 5: `Rope.swing()` gọi phương thức static qua tên lớp → in ra `"swing "`.
      * Dòng 6: `new Rope().swing()` gọi phương thức static qua biến thể hiện → Java vẫn cho phép và dịch thành lời gọi static → in ra `"swing "`.
      * Dòng 7: `System.out.println(LENGTH)` in ra giá trị hiện tại của biến static `LENGTH` là `10`.
    * Kết quả hiển thị: `swing swing 10`.
</details>

---

### Question 11 (Câu 11)
**Which statements are true of the following code? (Choose all that apply.)**

```java
1:  public class Rope {
2:     public static void swing() {
3:        System.out.print("swing");
4:     }
5:     public void climb() {
6:        System.out.println("climb");
7:     }
8:     public static void play() {
9:        swing();
10:       climb();
11:    }
12:    public static void main(String[] args) {
13:       Rope rope = new Rope();
14:       rope.play();
15:       Rope rope2 = null;
16:       System.out.print("-");
17:       rope2.play();
18:    } }
```

* A. The code compiles as is.
* B. There is exactly one compiler error in the code.
* C. There are exactly two compiler errors in the code.
* D. If the line(s) with compiler errors are removed, the output is `swing-climb`.
* E. If the line(s) with compiler errors are removed, the output is `swing-swing`.
* F. If the line(s) with compile errors are removed, the code throws a `NullPointerException`.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Line 10 does not compile because `static` methods are not allowed to call instance methods. Even though we are calling `play()` as if it were an instance method and an instance exists, Java knows `play()` is really a `static` method and treats it as such. Since this is the only line that does not compile, option B is correct. If line 10 is removed, the code prints `swing-swing`, making option E correct. It does not throw a `NullPointerException` on line 17 because `play()` is a `static` method. Java looks at the type of the reference for `rope2` and translates the call to `Rope.play()`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Lỗi biên dịch tại dòng 10:** Phương thức `play()` là một `static method`. Một phương thức static **không thể gọi trực tiếp một instance method (`climb()`)** mà không có đối tượng cụ thể (`non-static method climb() cannot be referenced from a static context`). Vì chỉ có duy nhất dòng 10 lỗi → B đúng (và A, C sai).
    * **Phân tích luồng chạy sau khi xóa dòng 10:**
      * Dòng 14: `rope.play()`: Dù gọi qua biến `rope`, nhưng vì `play()` là static nên Java gọi trực tiếp `Rope.play()` → gọi `swing()` in ra `"swing"`.
      * Dòng 16: In ra `"-"`.
      * Dòng 17: `rope2.play()`: **BẪY THI KINH ĐIỂN!** `rope2` có giá trị là `null`. Nhưng vì `play()` là phương thức `static`, trình biên dịch chỉ căn cứ vào kiểu của biến (`Rope`) và dịch thành `Rope.play()`. Do đó lệnh này **KHÔNG HỀ ném `NullPointerException`**, mà chạy bình thường và in ra `"swing"`.
    * Toàn bộ output in ra là `swing-swing` → E đúng.
</details>

---

### Question 12 (Câu 12)
**How many variables in the following method are effectively final?**

```java
10: public void feed() {
11:    int monkey = 0;
12:    if(monkey > 0) {
13:       var giraffe = monkey++;
14:       String name;
15:       name = "geoffrey";
16:    }
17:    String name = "milly";
18:    var food = 10;
19:    while(monkey <= 10) {
20:       food = 0;
21:    }
22:    name = null;
23: }
```

* A. 1.
* B. 2.
* C. 3.
* D. 4.
* E. 5.
* F. None of the above. The code does not compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B (Có đúng 2 biến là effectively final: `giraffe` dòng 13 và `name` dòng 14)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The test for effectively final is if the `final` modifier can be added to the local variable and the code still compiles. The `monkey` variable declared on line 11 is not effectively final because it is modified on line 13. The `giraffe` and `name` variables declared on lines 13 and 14, respectively, are effectively final and not modified after they are set. The `name` variable declared on line 17 is not effectively final since it is modified on line 22. Finally, the `food` variable on line 18 is not effectively final since it is modified on line 20. Since there are two effectively final variables, option B is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Một biến cục bộ là `effectively final` nếu nó không hề bị gán lại giá trị sau khi được khởi tạo lần đầu (thêm từ khóa `final` vào vẫn biên dịch được).
    * `monkey` (dòng 11): Bị tăng giá trị ở dòng 13 (`monkey++`) → **Không phải** effectively final.
    * `giraffe` (dòng 13): Khởi tạo một lần và không bị thay đổi ở đâu → **Effectively final (1)**.
    * `name` (dòng 14–15): Nằm trong khối `{}` của `if`, chỉ được gán đúng 1 lần giá trị `"geoffrey"` → **Effectively final (2)**.
    * `name` (dòng 17): Nằm ở phạm vi phương thức ngoài `if`, bị gán lại bằng `null` ở dòng 22 → **Không phải** effectively final.
    * `food` (dòng 18): Bị gán lại bằng `0` ở dòng 20 trong vòng lặp → **Không phải** effectively final.
    * Tổng cộng có đúng 2 biến thỏa mãn → Chọn B.
</details>

---

### Question 13 (Câu 13)
**What is the output of the following code?**

```java
// RopeSwing.java 
import rope.*;
import static rope.Rope.*;
public class RopeSwing {
   private static Rope rope1 = new Rope();
   private static Rope rope2 = new Rope();
   {
      System.out.println(rope1.length);
   }
   public static void main(String[] args) {
      rope1.length = 2;
      rope2.length = 8;
      System.out.println(rope1.length);
   }
}
 
// Rope.java 
package rope;
public class Rope {
   public static int length = 0;
}
```

* A. `02`
* B. `08`
* C. `2`
* D. `8`
* E. The code does not compile.
* F. An exception is thrown.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D (`8`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** There are two details to notice in this code. First, note that `RopeSwing` has an instance initializer and not a `static` initializer. Since `RopeSwing` is never constructed, the instance initializer does not run. The other detail is that `length` is `static`. Changes from any object update this common `static` variable. The code prints `8`, making option D correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Chi tiết 1:** Khối `{ System.out.println(rope1.length); }` trong `RopeSwing` là một **khối khởi tạo thể hiện (*Instance Initializer*)**, không phải `static initializer` (vì không có từ khóa `static`). Khối này chỉ chạy khi một đối tượng `new RopeSwing()` được tạo ra. Trong hàm `main`, không có đối tượng `RopeSwing` nào được tạo, do đó khối này **hoàn toàn không được chạy**!
    * **Chi tiết 2:** Biến `length` trong lớp `Rope` được khai báo là **`public static int length = 0;`**. Vì nó là biến tĩnh `static`, chỉ có duy nhất một vùng nhớ được chia sẻ chung.
    * Lệnh `rope1.length = 2;` gán giá trị chung thành 2.
    * Lệnh kế tiếp `rope2.length = 8;` ghi đè giá trị chung thành 8.
    * Lệnh `System.out.println(rope1.length);` đọc giá trị chung đó và in ra **`8`**.
</details>

---

### Question 14 (Câu 14)
**How many lines in the following code have compiler errors?**

```java
1:  public class RopeSwing {
2:     private static final String leftRope;
3:     private static final String rightRope;
4:     private static final String bench;
5:     private static final String name = "name";
6:     static {
7:        leftRope = "left";
8:        rightRope = "right";
9:     }
10:    static {
11:       name = "name";
12:       rightRope = "right";
13:    }
14:    public static void main(String[] args) {
15:       bench = "bench";
16:    }
17: }
```

* A. `0`
* B. `1`
* C. `2`
* D. `3`
* E. `4`
* F. `5`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E (Có đúng 4 dòng chứa lỗi biên dịch: 4, 11, 12, 15)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** If a variable is `static final`, it must be set exactly once, and it must be in the declaration line or in a `static` initialization block. Line 4 doesn’t compile because `bench` is not set in either of these locations. Line 15 doesn’t compile because `final` variables are not allowed to be set after that point. Line 11 doesn’t compile because `name` is set twice: once in the declaration and again in the `static` block. Line 12 doesn’t compile because `rightRope` is set twice as well. Both are in `static` initialization blocks. Since four lines do not compile, option E is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Quy tắc đối với biến `static final`: Bắt buộc phải được gán giá trị **đúng 1 lần duy nhất** ngay tại dòng khai báo hoặc trong khối khởi tạo tĩnh `static { }`.
    * **Dòng 4 LỖI:** Biến `bench` là `static final` nhưng không hề được khởi tạo tại khai báo hay trong bất kỳ khối `static { }` nào (`variable bench might not have been initialized`).
    * **Dòng 11 LỖI:** Biến `name` đã được gán tại dòng 5, cố tình gán lại lần thứ hai trong khối `static` (`cannot assign a value to final variable name`).
    * **Dòng 12 LỖI:** Biến `rightRope` đã được gán tại dòng 8, cố tình gán lại lần thứ hai ở dòng 12 (`cannot assign a value to final variable rightRope`).
    * **Dòng 15 LỖI:** Cố tình gán giá trị cho biến `static final bench` bên trong phương thức `main()` (biến `static final` tuyệt đối không được gán trong phương thức thường).
    * Tổng cộng có đúng 4 dòng lỗi biên dịch → Chọn E.
</details>

---

### Question 15 (Câu 15)
**Which of the following can replace line 2 to make this code compile?**

```java
1: import java.util.*;
2: // INSERT CODE HERE
3: public class Imports {
4:    public void method(ArrayList<String> list) {
5:       sort(list);
6:    }
7: }
```

* A. `import static java.util.Collections;`
* B. `import static java.util.Collections.*;`
* C. `import static java.util.Collections.sort(ArrayList<String>);`
* D. `static import java.util.Collections;`
* E. `static import java.util.Collections.*;`
* F. `static import java.util.Collections.sort(ArrayList<String>);`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The two valid ways to do this are `import static java.util.Collections.*;` and `import static java.util.Collections.sort;`, making option B correct. Option A is incorrect because you can do a `static` import only on `static` members. Classes such as `Collections` require a regular import. Option C is nonsense as method parameters have no business in an import. Options D, E, and F try to trick you into reversing the syntax of `import static`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 5 gọi trực tiếp phương thức tĩnh `sort(list)` của lớp `java.util.Collections`. Để làm được điều này, ta cần dùng cơ chế **Static Import**.
    * Cú pháp bắt buộc của static import là: `import static ...`, do đó các đáp án D, E, F viết `static import` đều **sai cú pháp**.
    * **B đúng:** `import static java.util.Collections.*;` nhập tất cả các thành viên tĩnh của `Collections`, bao gồm phương thức tĩnh `sort()`.
    * **A sai:** `Collections` là một lớp, không phải là một thành viên tĩnh. Nhập tên lớp phải dùng `import java.util.Collections;` thông thường.
    * **C sai:** Static import chỉ khai báo tên phương thức (`sort`), không được đưa tham số kiểu dữ liệu vào cú pháp import.
</details>

---

### Question 16 (Câu 16)
**What is the result of the following statements?**

```java
1:  public class Test {
2:     public void print(byte x) {
3:        System.out.print("byte-");
4:     }
5:     public void print(int x) {
6:        System.out.print("int-");
7:     }
8:     public void print(float x) {
9:        System.out.print("float-");
10:    }
11:    public void print(Object x) {
12:       System.out.print("Object-");
13:    }
14:    public static void main(String[] args) {
15:       Test t = new Test();
16:       short s = 123;
17:       t.print(s);
18:       t.print(true);
19:       t.print(6.789);
20:    }
21: }
```

* A. `byte-float-Object-`
* B. `int-float-Object-`
* C. `byte-Object-float-`
* D. `int-Object-float-`
* E. `int-Object-Object-`
* F. `byte-Object-Object-`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E (`int-Object-Object-`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The argument on line 17 is a `short`. It can be promoted to an `int`, so `print()` on line 5 is invoked. The argument on line 18 is a `boolean`. It can be autoboxed to a `Boolean`, so `print()` on line 11 is invoked. The argument on line 19 is a `double`. It can be autoboxed to a `Double`, so `print()` on line 11 is invoked. Therefore, the output is `int-Object-Object-`, and the correct answer is option E.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    1. **Dòng 17 `t.print(s)`:** Đối số `s` có kiểu `short`. Không có phương thức nào nhận `short`. Java sẽ tìm kiểu nguyên thủy lớn hơn tiếp theo (*Widening primitive*): `short` → `int`. Phương thức `print(int)` (dòng 5) được chọn → in ra **`int-`**. (Lưu ý: `short` không thể tự thu hẹp về `byte`!).
    2. **Dòng 18 `t.print(true)`:** Đối số mang giá trị `boolean`. Không có phương thức nhận `boolean`. Java thực hiện Autoboxing thành đối tượng `Boolean`. `Boolean` là một lớp con kế thừa từ `Object`, do đó phương thức `print(Object)` (dòng 11) được chọn → in ra **`Object-`**.
    3. **Dòng 19 `t.print(6.789)`:** Giá trị `6.789` là một số thực dấu phẩy động kiểu `double`. Kiểu `double` không thể nới rộng sang `float` (vì `float` nhỏ hơn `double`). Java autobox `6.789` thành đối tượng `Double`. `Double` kế thừa từ `Object`, do đó phương thức `print(Object)` được chọn → in ra **`Object-`**.
    * Kết quả ghép lại: `int-Object-Object-`.
</details>

---

### Question 17 (Câu 17)
**What is the result of the following program?**

```java
1:  public class Squares {
2:     public static long square(int x) {
3:        var y = x * (long) x;
4:        x = -1;
5:        return y;
6:     }
7:     public static void main(String[] args) {
8:        var value = 9;
9:        var result = square(value);
10:       System.out.println(value);
11:    } }
```

* A. `-1`
* B. `9`
* C. `81`
* D. Compiler error on line 9
* E. Compiler error on a different line

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B (`9`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Since Java is pass-by-value and the variable on line 8 never gets reassigned, it stays as `9`. In the method `square`, `x` starts as `9`. The `y` value becomes `81`, and then `x` gets set to `-1`. Line 9 does set `result` to `81`. However, we are printing out `value`, and that is still `9`, making option B correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Java **luôn luôn truyền tham số theo giá trị (*Pass-by-value*)**.
    * Khi gọi `square(value)`, một bản sao của giá trị `9` được gán cho biến tham số `x`.
    * Bên trong phương thức `square()`, lệnh `x = -1;` chỉ làm thay đổi giá trị của biến cục bộ `x`, hoàn toàn **không ảnh hưởng gì đến biến `value`** trong hàm `main()`.
    * Dòng 10 in ra giá trị của biến `value`, giá trị của nó vẫn nguyên vẹn là **`9`**.
</details>

---

### Question 18 (Câu 18)
**Which of the following are output by the following code? (Choose all that apply.)**

```java
public class StringBuilders {
   public static StringBuilder work(StringBuilder a, StringBuilder b) {
      a = new StringBuilder("a");
      b.append("b");
      return a;
   }
   public static void main(String[] args) {
      var s1 = new StringBuilder("s1");
      var s2 = new StringBuilder("s2");
      var s3 = work(s1, s2);
      System.out.println("s1 = " + s1);
      System.out.println("s2 = " + s2);
      System.out.println("s3 = " + s3);
   }
}
```

* A. `s1 = a`
* B. `s1 = s1`
* C. `s2 = s2`
* D. `s2 = s2b`
* E. `s3 = a`
* F. The code does not compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, D, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Since Java is pass-by-value, assigning a new object to `a` does not change the caller. Calling `append()` does affect the caller because both the method parameter and the caller have a reference to the same object. Finally, returning a value does pass the reference to the caller for assignment to `s3`. For these reasons, options B, D, and E are correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Trong phương thức `main`, `s1` trỏ tới `"s1"`, `s2` trỏ tới `"s2"`.
    * Khi gọi `work(s1, s2)`:
      * Bản sao của tham chiếu `s1` được chuyển cho biến tham số `a`. Dòng `a = new StringBuilder("a");` trỏ biến cục bộ `a` sang một đối tượng mới trên Heap. Điều này **hoàn toàn không làm đổi biến `s1` của `main`**. Do đó `s1` vẫn là `"s1"` → **`s1 = s1` (B đúng)**.
      * Bản sao của tham chiếu `s2` được chuyển cho biến tham số `b`. Dòng `b.append("b");` thao tác trực tiếp trên chính đối tượng mà `s2` đang cùng trỏ tới trên Heap, nối thêm `"b"`. Do đó `s2` bị biến đổi thành `"s2b"` → **`s2 = s2b` (D đúng)**.
      * Phương thức trả về tham chiếu `a` (đối tượng `"a"` mới tạo) và được gán cho `s3` → **`s3 = a` (E đúng)**.
</details>

---

### Question 19 (Câu 19)
**Which of the following will compile when independently inserted in the following code? (Choose all that apply.)**

```java
1:  public class Order3 {
2:     final String value1 = "red";
3:     static String value2 = "blue";
4:     String value3 = "yellow";
5:     {
6:        // CODE SNIPPET 1
7:     }
8:     static {
9:        // CODE SNIPPET 2
10:    } }
```

* A. Insert at line 6: `value1 = "green";`
* B. Insert at line 6: `value2 = "purple";`
* C. Insert at line 6: `value3 = "orange";`
* D. Insert at line 9: `value1 = "magenta";`
* E. Insert at line 9: `value2 = "cyan";`
* F. Insert at line 9: `value3 = "turquoise";`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, C, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The variable `value1` is a `final` instance variable. It can be set only once: in the variable declaration, an instance initializer, or a constructor. Option A does not compile because the `final` variable was already set in the declaration. The variable `value2` is a `static` variable. Both instance and `static` initializers are able to access `static` variables, making options B and E correct. The variable `value3` is an instance variable, making option C correct. Options D and F do not compile because a `static` initializer does not have access to instance variables.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 6 nằm trong **khối khởi tạo thể hiện (*Instance Initializer*)**:
      * Có quyền truy cập cả biến thể hiện lẫn biến tĩnh.
      * Biến `value1` là `final` và đã được gán giá trị `"red"` tại dòng 2 → Không thể gán lại (A sai).
      * `value2` là biến tĩnh, khối thể hiện có quyền sửa đổi nó → `value2 = "purple";` hợp lệ (B đúng).
      * `value3` là biến thể hiện thông thường, khối thể hiện có quyền gán lại → `value3 = "orange";` hợp lệ (C đúng).
    * Dòng 9 nằm trong **khối khởi tạo tĩnh (*Static Initializer*)**:
      * Chỉ có quyền truy cập các thành phần tĩnh (`static`), **hoàn toàn KHÔNG THỂ truy cập các biến thể hiện (`value1`, `value3`)**. Do đó D và F đều báo lỗi biên dịch!
      * `value2` là biến tĩnh, khối static có toàn quyền thay đổi nó → `value2 = "cyan";` hợp lệ (E đúng).
</details>

---

### Question 20 (Câu 20)
**Which of the following are true about the following code? (Choose all that apply.)**

```java
public class Run {
   static void execute() {
      System.out.print("1-");
   }
   static void execute(int num) {
      System.out.print("2-");
   }
   static void execute(Integer num) {
      System.out.print("3-");
   }
   static void execute(Object num) {
      System.out.print("4-");
   }
   static void execute(int... nums) {
      System.out.print("5-");
   }
   public static void main(String[] args) {
      Run.execute(100);
      Run.execute(100L);
   }
}
```

* A. The code prints out `2-4-`.
* B. The code prints out `3-4-`.
* C. The code prints out `4-2-`.
* D. The code prints out `4-4-`.
* E. The code prints `3-4-` if you remove the method `static void execute(int num)`.
* F. The code prints `4-4-` if you remove the method `static void execute(int num)`.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `100` parameter is an `int` and so calls the matching `int` method, making option A correct. When this method is removed, Java looks for the next most specific constructor. Java prefers autoboxing to varargs, so it chooses the `Integer` constructor. The `100L` parameter is a `long`. Since it can’t be converted into a smaller type, it is autoboxed into a `Long`, and then the method for `Object` is called, making option E correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Lời gọi 1: `Run.execute(100)`:** Đối số `100` là kiểu `int`. Phương thức `execute(int num)` khớp chính xác kiểu dữ liệu (*Exact match*) nên được chọn đầu tiên → in ra **`2-`**.
    * **Lời gọi 2: `Run.execute(100L)`:** Đối số `100L` là kiểu `long`. Trong các phương thức không có hàm nào nhận `long` hoặc kiểu nguyên thủy lớn hơn `long` (`float`, `double`). Java sẽ autobox `100L` thành đối tượng `Long`. `Long` không thể gán vào `Integer`, nhưng `Long` kế thừa từ `Object`, do đó phương thức `execute(Object num)` được gọi → in ra **`4-`**.
    * Kết hợp lại in ra **`2-4-`** → A đúng.
    * **Trường hợp xóa phương thức `execute(int num)`:**
      * Khi gọi `execute(100)`, không còn hàm nhận `int`. Java sẽ tìm ưu tiên tiếp theo theo Bảng 5.6: Nới rộng primitive (không có) → **Autoboxing** → Varargs.
      * Do Java ưu tiên Autoboxing hơn Varargs, đối số `100` được autobox thành `Integer` và gọi phương thức `execute(Integer num)` → in ra **`3-`**.
      * Lời gọi `execute(100L)` vẫn gọi `execute(Object num)` in ra **`4-`**.
      * Kết quả khi xóa hàm `execute(int)` là **`3-4-`** → E đúng.
</details>

---

### Question 21 (Câu 21)
**Which method signatures are valid overloads of the following method signature? (Choose all that apply.)**

```java
public void moo(int m, int... n)
```

* A. `public void moo(int a, int... b)`
* B. `public int moo(char ch)`
* C. `public void moooo(int... z)`
* D. `private void moo(int... x)`
* E. `public void moooo(int y)`
* F. `public void moo(int... c, int d)`
* G. `public void moo(int... i, int j...)`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Option A is incorrect because it has the same parameter list of types and therefore the same signature as the original method. Options B and D are the correct answers, as they are valid method overloads in which the types of parameters change. When overloading methods, the return type and access modifiers do not need to be the same. Options C and E are incorrect because the method name is different. Options F and G do not compile. There can be at most one varargs parameter, and it must be the last element in the parameter list.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Hai phương thức được coi là **nạp chồng (Overload)** khi chúng có **cùng tên phương thức** nhưng **khác nhau về danh sách kiểu dữ liệu của tham số**. Kiểu trả về và access modifier không ảnh hưởng đến tính hợp lệ của việc overload.
    * Phương thức gốc có chữ ký: `moo(int, int...)`.
    * **B đúng:** Cùng tên `moo`, tham số là `(char)` khác với danh sách ban đầu. Việc đổi kiểu trả về sang `int` là hoàn toàn hợp lệ.
    * **D đúng:** Cùng tên `moo`, tham số là `(int...)` (1 tham số varargs duy nhất, khác với phương thức gốc có 1 int thường và 1 int varargs). Việc đổi phạm vi sang `private` là hợp lệ.
    * **A sai:** Chỉ đổi tên biến tham số từ `m, n` thành `a, b`, danh sách kiểu tham số vẫn là `(int, int...)` → Báo lỗi trùng lặp phương thức (*duplicate method*).
    * **C và E sai:** Tên phương thức bị đổi thành `moooo` (thừa chữ o), đây là phương thức hoàn toàn mới chứ không phải nạp chồng phương thức `moo`.
    * **F và G sai:** Bản thân các khai báo F và G đều **không biên dịch được** do vi phạm cú pháp varargs: Tham số varargs phải đứng ở vị trí cuối cùng (câu F sai vị trí) và một phương thức chỉ được có tối đa 1 varargs (câu G có 2 varargs).
</details>
