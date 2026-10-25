# Review Questions (Bộ Câu Hỏi Ôn Tập Tiếng Anh) - Chapter 1: Building Blocks

> **Source (Nguồn trích dẫn):** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Pages 157–168).  
> **Total Questions (Số lượng):** 23 original English multiple-choice questions with official English & detailed Vietnamese explanations.  
> **How to study (Cách học):** Read the verbatim English question and select your answer first, then click **"👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)"** to check the official answer and master exam traps.

---

### Question 1 (Câu 1)
**Which of the following are legal entry point methods that can be run from the command line? (Choose all that apply.)**

* A. `private static void main(String[] args)`
* B. `public static final main(String[] args)`
* C. `public void main(String[] args)`
* D. `public static final void main(String[] args)`
* E. `public static void main(String[] args)`
* F. `public static main(String[] args)`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Option E is the canonical `main()` method signature. You need to memorize it. Option D is an alternate form with the redundant `final`. Option A is incorrect because the `main()` method must be `public`. Options B and F are incorrect because the `main()` method must have a `void` return type. Option C is incorrect because the `main()` method must be `static`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **E** là chữ ký chuẩn tắc (*canonical signature*) của phương thức `main`: `public static void main(String[] args)`.
    * **D** hoàn toàn hợp lệ vì Java cho phép thêm bổ từ `final` vào trước kiểu trả về của phương thức `main`. Thứ tự các bổ từ (`public static final`) có thể hoán đổi cho nhau.
    * **A sai** vì `main()` để JVM gọi từ ngoài bắt buộc phải có phạm vi truy cập là `public`, không được là `private`.
    * **B và F sai** vì thiếu kiểu trả về `void`. Trong Java mọi phương thức bắt buộc phải có kiểu trả về.
    * **C sai** vì thiếu từ khóa `static`. JVM gọi trực tiếp phương thức `main` mà không khởi tạo instance của class.
</details>

---

### Question 2 (Câu 2)
**Which answer options represent the order in which the following statements can be assembled into a program that will compile successfully? (Choose all that apply.)**

* `X: class Rabbit {}`
* `Y: import java.util.*;`
* `Z: package animals;`

* A. X, Y, Z
* B. Y, Z, X
* C. Z, Y, X
* D. Y, X
* E. Z, X
* F. X, Z
* G. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C, D, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `package` and `import` statements are both optional. If both are present, the order must be `package`, then `import`, and then `class`. Option A is incorrect because `class` is before `package` and `import`. Option B is incorrect because `import` is before `package`. Option F is incorrect because `class` is before `package`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Quy tắc cấu trúc file Java là **P - I - C**: `Package` → `Import` → `Class`.
    * Cả `package` và `import` đều là **tùy chọn (optional)**:
      * Nếu có cả 3: Bắt buộc theo thứ tự `Z, Y, X` (**Đáp án C**).
      * Nếu không khai báo `package` (sử dụng default package): Thứ tự là `Y, X` (**Đáp án D**).
      * Nếu không có `import`: Thứ tự là `Z, X` (**Đáp án E**).
    * **A, B, F sai** vì vi phạm thứ tự: `class` không thể đứng trước `package` hay `import`, và `import` không thể đứng trước `package`.
</details>

---

### Question 3 (Câu 3)
**Which of the following are true? (Choose all that apply.)**

```java
public class Bunny {
   public static void main(String[] x) {
      Bunny bun = new Bunny();
   }
}
```

* A. `Bunny` is a class.
* B. `bun` is a class.
* C. `main` is a class.
* D. `Bunny` is a reference to an object.
* E. `bun` is a reference to an object.
* F. `main` is a reference to an object.
* G. The `main()` method doesn’t run because the parameter name is incorrect.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** `Bunny` is a class, which can be seen from the declaration: `public class Bunny`. The variable `bun` is a reference to an object. The method `main()` is the standard entry point to a program. Option G is incorrect because the parameter type matters, not the parameter name.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A đúng:** `Bunny` được khai báo bằng `public class Bunny` nên nó là một class.
    * **E đúng:** `bun` là một biến tham chiếu (`Bunny bun`) trỏ đến instance mới tạo `new Bunny()`.
    * **B sai:** `bun` là tên biến, không phải tên class.
    * **C, F sai:** `main` là tên phương thức.
    * **D sai:** `Bunny` là tên kiểu dữ liệu (class), không phải biến tham chiếu.
    * **G sai:** Tên tham số của `main` có thể đặt tùy ý (ở đây là `x`), miễn kiểu dữ liệu là mảng String `String[]`.
</details>

---

### Question 4 (Câu 4)
**Which of the following are valid Java identifiers? (Choose all that apply.)**

* A. `_`
* B. `_helloWorld$`
* C. `true`
* D. `java.lang`
* E. `Public`
* F. `1980_s`
* G. `_Q2_`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, E, G**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Option A is invalid because a single underscore is not allowed. Option C is not a valid identifier because `true` is a Java reserved word. Option D is not valid because a period (`.`) is not allowed in identifiers. Option F is not valid because the first character is not a letter, dollar sign (`$`), or underscore (`_`). Options B, E, and G are valid because they contain only valid characters.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **B và G đúng:** Tên bắt đầu bằng dấu gạch dưới `_`, theo sau là chữ cái, số hoặc ký tự `$`.
    * **E đúng:** Java phân biệt hoa thường (*case-sensitive*). `public` là từ khóa dành riêng, nhưng `Public` (chữ P hoa) là tên định danh hoàn toàn hợp lệ.
    * **A sai:** Từ Java 9 trở đi, một dấu gạch dưới đơn lẻ `_` là từ khóa dành riêng (*reserved keyword*), không được dùng làm định danh.
    * **C sai:** `true` là từ khóa literal dành riêng của kiểu boolean.
    * **D sai:** Dấu chấm `.` không được phép xuất hiện trong tên định danh.
    * **F sai:** Định danh trong Java không được phép bắt đầu bằng chữ số (`1980_s`).
</details>

---

### Question 5 (Câu 5)
**Which statements about the following program are correct? (Choose all that apply.)**

```java
2:  public class Bear {
3:     private Bear pandaBear;
4:     private void roar(Bear b) {
5:        System.out.println("Roar!");
6:        pandaBear = b;
7:     }
8:     public static void main(String[] args) {
9:        Bear brownBear = new Bear();
10:       Bear polarBear = new Bear();
11:       brownBear.roar(polarBear);
12:       polarBear = null;
13:       brownBear = null;
14:       System.gc();
15:    }
16: }
```

* A. The object created on line 9 is first eligible for garbage collection after line 13.
* B. The object created on line 9 is first eligible for garbage collection after line 14.
* C. The object created on line 10 is first eligible for garbage collection after line 12.
* D. The object created on line 10 is first eligible for garbage collection after line 13.
* E. Garbage collection is guaranteed to run.
* F. Garbage collection might or might not run.
* G. The code does not compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, D, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Garbage collection is never guaranteed to run, making option F correct and option E incorrect. Next, the class compiles and runs without issue, so option G is incorrect. The `Bear` object created on line 9 is accessible until line 13 via the `brownBear` reference variable, which is option A. The `Bear` object created on line 10 is accessible via both the `polarBear` reference and the `brownBear.pandaBear` reference. After line 12, the object is still accessible via `brownBear.pandaBear`. After line 13, though, it is no longer accessible since `brownBear` is no longer accessible, which makes option D the final correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **F đúng, E sai:** Phương thức `System.gc()` chỉ là một lời đề xuất tới JVM, không có gì đảm bảo Garbage Collector sẽ chạy ngay lập tức.
    * **A đúng:** Đối tượng tạo ở dòng 9 chỉ có duy nhất biến tham chiếu `brownBear` trỏ tới. Đến dòng 13 khi `brownBear = null`, đối tượng này không còn tham chiếu nào → đủ điều kiện GC sau dòng 13.
    * **D đúng, C sai:** Đối tượng tạo ở dòng 10 được trỏ bởi `polarBear` VÀ đồng thời được trường `brownBear.pandaBear` trỏ tới (sau dòng 11). Khi dòng 12 gán `polarBear = null`, đối tượng này vẫn còn sống thông qua `brownBear.pandaBear`. Chỉ sau dòng 13 khi `brownBear = null`, toàn bộ chuỗi tham chiếu bị đứt → đủ điều kiện GC sau dòng 13.
</details>

---

### Question 6 (Câu 6)
**Assuming the following class compiles, how many variables defined in the class or method are in scope on the line marked on line 14?**

```java
1:  public class Camel {
2:     { int hairs = 3_000_0; }
3:     long water, air = 2;
4:     boolean twoHumps = true;
5:     public void spit(float distance) {
6:        var path = "";
7:        { double teeth = 32 + distance++; }
8:        while(water > 0) {
9:           int age = twoHumps ? 1 : 2;
10:          short i = -1;
11:          for(i = 0; i < 10; i++) {
12:             var Private = 2;
13:          }
14:          // SCOPE
15:       }
16:    }
17: }
```

* A. 2
* B. 3
* C. 4
* D. 5
* E. 6
* F. 7
* G. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F (7 variables)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** To solve this problem, you need to trace the braces (`{}`) and see when variables go in and out of scope. The variables on lines 2 and 7 are only in scope for a single line block. The variable on line 12 is only in scope for the `for` loop. None of these is in scope on line 14. By contrast, the three instance variables on lines 3 and 4 are available in all instance methods. Additionally, the variables on lines 6, 9, and 10 are available since the method and `while` loop are still in scope. This is a total of 7 variables, which is option F.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    Để giải câu này, ta lần lượt kiểm tra các biến và dấu ngoặc nhọn `{}`:
    1. `hairs` (dòng 2): Đã ra khỏi khối initializer block → **Hết scope**.
    2. `water` (dòng 3): Instance variable → **Còn trong scope (1)**.
    3. `air` (dòng 3): Instance variable → **Còn trong scope (2)**.
    4. `twoHumps` (dòng 4): Instance variable → **Còn trong scope (3)**.
    5. `distance` (dòng 5): Tham số của hàm `spit` → **Còn trong scope (4)**.
    6. `path` (dòng 6): Biến cục bộ của hàm `spit` → **Còn trong scope (5)**.
    7. `teeth` (dòng 7): Nằm trong khối ngoặc nhọn riêng `{}` đã đóng → **Hết scope**.
    8. `age` (dòng 9): Biến cục bộ trong vòng lặp `while` → **Còn trong scope (6)**.
    9. `i` (dòng 10): Khai báo trước vòng `for`, nằm trong `while` → **Còn trong scope (7)**.
    10. `Private` (dòng 12): Khai báo trong vòng `for`, khi vòng for kết thúc thì đã ra khỏi scope → **Hết scope**.
    * **Tổng cộng: đúng 7 biến**.
</details>

---

### Question 7 (Câu 7)
**Which are true about this code? (Choose all that apply.)**

```java
public class KitchenSink {
    private int numForks;
    public static void main(String[] args) {
       int numKnives;
       System.out.print("""
          "# forks = " + numForks +
           " # knives = " + numKnives +
          # cups = 0""");
    }
}
```

* A. The output includes `# forks = 0`.
* B. The output includes `# knives = 0`.
* C. The output includes `# cups = 0`.
* D. The output includes a blank line.
* E. The output includes one or more lines that begin with whitespace.
* F. The code does not compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The first thing to recognize is that this is a text block and the code inside the `"""` is just text. Options A and B are incorrect because the `numForks` and `numKnives` variables are not used. This is convenient since `numKnives` is not initialized and would not compile if it were referenced. Option C is correct as it is matching text. Option D is incorrect because the text block does not have a trailing blank line. Finally, option E is also an answer since `" # knives` is indented.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Điểm mấu chốt: Toàn bộ nội dung bên trong dấu `"""` là một **Text Block** (chuỗi ký tự thuần túy). Các biến `numForks`, `numKnives` và toán tử `+` chỉ là **chữ viết trong chuỗi**, Java không thực hiện phép tính hay đọc biến tại đây!
    * Do không đọc giá trị biến cục bộ `numKnives` (dù chưa khởi tạo), code **hoàn toàn biên dịch bình thường**.
    * **C đúng:** Dòng cuối cùng chứa nguyên văn chữ `# cups = 0`.
    * **E đúng:** Dòng thứ 2 `" # knives = "` có thụt lề so với lề chuẩn của `"""` nên khi in ra sẽ bắt đầu bằng khoảng trắng.
    * **A, B sai:** Chuỗi in ra nguyên văn các dấu cộng `+ numForks +` chứ không thay thế bằng số `0`.
    * **D sai:** Dấu đóng `"""` nằm ngay sát chữ `0` của dòng thứ 3, không tạo thêm dòng trống nào ở cuối.
</details>

---

### Question 8 (Câu 8)
**Which of the following code snippets about `var` compile without issue when used in a method? (Choose all that apply.)**

* A. `var spring = null;`
* B. `var fall = "leaves";`
* C. `var evening = 2; evening = null;`
* D. `var night = Integer.valueOf(3);`
* E. `var day = 1/0;`
* F. `var winter = 12, cold;`
* G. `var fall = 2, autumn = 2;`
* H. `var morning = ""; morning = null;`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, D, E, H**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** A `var` cannot be initialized with a `null` value without a type, but it can be assigned a `null` value later if the underlying type is not a primitive. For these reasons, option H is correct, but options A and C are incorrect. Options B and D are correct as the underlying types are `String` and `Integer`, respectively. Option E is correct as this is a valid numeric expression. You might know that dividing by zero produces a runtime exception, but the question was only about whether the code compiled. Finally, options F and G are incorrect as `var` cannot be used in a multiple-variable assignment.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **B đúng:** `fall` được suy luận là `String`.
    * **D đúng:** `night` được suy luận là `Integer`.
    * **E đúng:** `1/0` là một biểu thức số nguyên hợp lệ về mặt ngữ pháp tại thời điểm biên dịch (compiler suy luận `day` là kiểu `int`). Dù khi chạy sẽ quăng `ArithmeticException`, nhưng đề bài chỉ hỏi **code có biên dịch được hay không**.
    * **H đúng:** `morning` được suy luận là kiểu `String` (kiểu tham chiếu). Sau đó gán `morning = null` hoàn toàn hợp lệ với kiểu tham chiếu!
    * **A sai:** Không thể khởi tạo `var` trực tiếp bằng `null` vì trình biên dịch không thể suy luận ra kiểu dữ liệu cụ thể.
    * **C sai:** `evening` được suy luận là kiểu nguyên thủy `int`. Kiểu nguyên thủy không thể gán bằng `null`.
    * **F và G sai:** `var` bị cấm dùng để khai báo nhiều biến ngăn cách bằng dấu phẩy trong cùng một câu lệnh.
</details>

---

### Question 9 (Câu 9)
**Which of the following is correct?**

* A. An instance variable of type `float` defaults to `0`.
* B. An instance variable of type `char` defaults to `null`.
* C. A local variable of type `double` defaults to `0.0`.
* D. A local variable of type `int` defaults to `null`.
* E. A class variable of type `String` defaults to `null`.
* F. A class variable of type `String` defaults to the empty string `""`.
* G. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Options C and D are incorrect because local variables don’t have default values. Option A is incorrect because `float` should have a decimal point. Option B is incorrect because primitives do not default to `null`. Option E is correct and option F incorrect because reference types in class variables default to `null`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **E đúng:** `String` là một kiểu dữ liệu tham chiếu (*reference type*). Mọi biến instance hoặc static thuộc kiểu tham chiếu đều có giá trị mặc định ban đầu là `null`.
    * **C và D sai:** Biến cục bộ (*local variables*) **không có giá trị mặc định**.
    * **A sai:** Giá trị mặc định của `float` là `0.0f` (có dấu chấm thập phân), `0` là của số nguyên.
    * **B sai:** `char` là kiểu dữ liệu nguyên thủy (*primitive*), giá trị mặc định là `'\u0000'`, không thể là `null`.
    * **F sai:** Giá trị mặc định là `null`, không phải chuỗi rỗng `""`.
</details>

---

### Question 10 (Câu 10)
**Which of the following expressions, when inserted independently into the blank line, allow the code to compile? (Choose all that apply.)**

```java
public void printMagicData() {
   var magic = ________;
   System.out.println(magic);
}
```

* A. `3_1`
* B. `1_329_.0`
* C. `3_13.0_`
* D. `5_291._2`
* E. `2_234.0_0`
* F. `9___6`
* G. `_1_3_5_0`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, E, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** An underscore (`_`) can be placed in any numeric literal, as long as it is not at the beginning, at the end, or next to a decimal point (`.`). Underscores can even be placed next to each other. For these reasons, options A, E, and F are correct. Options B and D are incorrect as the underscore (`_`) is next to a decimal point (`.`). Options C and G are incorrect because an underscore (`_`) cannot be placed at the beginning or end of the literal.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Quy tắc dấu gạch dưới `_` trong số học: Dấu `_` có thể đặt ở bất kỳ đâu giữa hai chữ số. Có thể đặt nhiều dấu gạch dưới liên tiếp cạnh nhau (**F đúng: `9___6`**).
    * **A đúng (`3_1`)** và **E đúng (`2_234.0_0`)**: Dấu `_` nằm hợp lệ giữa các chữ số.
    * **B và D sai:** Dấu `_` đặt ngay trước hoặc ngay sau dấu chấm thập phân `.`.
    * **C sai:** Dấu `_` đặt ở cuối cùng của số.
    * **G sai:** Dấu `_` đặt ở đầu của số.
</details>

---

### Question 11 (Câu 11)
**Given the following two class files, what is the maximum number of imports that can be removed and have the code still compile?**

```java
// Water.java
package aquarium;
public class Water { }

// Tank.java
package aquarium;
import java.lang.*;
import java.lang.System;
import aquarium.Water;
import aquarium.*;

public class Tank {
   public void print(Water water) {
      System.out.println(water);
   }
}
```

* A. 0
* B. 1
* C. 2
* D. 3
* E. 4
* F. Does not compile

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E (4 imports)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The first two imports can be removed because `java.lang` is automatically imported. The following two imports can be removed because `Tank` and `Water` are in the same package, making the correct option E. If `Tank` and `Water` were in different packages, exactly one of these two imports could be removed. In that case, the answer would be option D.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    1. `import java.lang.*;` và `import java.lang.System;`: Package `java.lang` được Java **tự động import ngầm** vào mọi class. Hai dòng này hoàn toàn thừa.
    2. `import aquarium.Water;` và `import aquarium.*;`: Cả `Tank` và `Water` đều nằm chung trong cùng một package là `aquarium`. Các class trong cùng một package luôn nhìn thấy nhau mà **không cần bất kỳ dòng import nào**.
    * Do đó, cả 4 câu lệnh import đều dư thừa và có thể xóa hết.
</details>

---

### Question 12 (Câu 12)
**Which statements about the following class are correct? (Choose all that apply.)**

```java
1: public class ClownFish {
2:    int gills = 0, double weight = 2;
3:    { int fins = gills; }
4:    void print(int length = 3) {
5:       System.out.println(gills);
6:       System.out.println(weight);
7:       System.out.println(fins);
8:       System.out.println(length);
9:    }
10: }
```

* A. Line 2 generates a compiler error.
* B. Line 3 generates a compiler error.
* C. Line 4 generates a compiler error.
* D. Line 7 generates a compiler error.
* E. The code prints 0.
* F. The code prints 2.0.
* G. The code prints 2.
* H. The code prints 3.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, C, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Line 2 does not compile as only one type should be specified, making option A correct. Line 3 compiles without issue as it declares a local variable inside an instance initializer that is never used. Line 4 does not compile because Java does not support setting default method parameter values, making option C correct. Finally, line 7 does not compile because `fins` is in scope and accessible only inside the instance initializer on line 3, making option D correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A đúng (Lỗi dòng 2):** Java không cho phép khai báo hai kiểu dữ liệu khác nhau (`int` và `double`) trong cùng một câu lệnh phân cách bằng dấu phẩy.
    * **B sai (Dòng 3 hợp lệ):** Khối initializer khai báo biến cục bộ `fins = gills` hợp lệ (dù không dùng đến).
    * **C đúng (Lỗi dòng 4):** Java **không hỗ trợ tham số mặc định (default parameter values)** như C++ hay Python. Cú pháp `int length = 3` trong danh sách tham số của hàm là lỗi cú pháp.
    * **D đúng (Lỗi dòng 7):** Biến `fins` được khai báo trong khối `{}` ở dòng 3 nên phạm vi của nó chỉ tồn tại trong khối đó. Dòng 7 cố tình truy cập `fins` sẽ báo lỗi `cannot find symbol`.
</details>

---

### Question 13 (Câu 13)
**Given the following classes, which of the following snippets can independently be inserted in place of `INSERT IMPORTS HERE` and have the code compile? (Choose all that apply.)**

```java
// File 1:
package aquarium;
public class Water {
   boolean salty = false;
}

// File 2:
package aquarium.jellies;
public class Water {
   boolean salty = true;
}

// File 3:
package employee;
// INSERT IMPORTS HERE
public class WaterFiller {
   Water water;
}
```

* A. `import aquarium.*;`
* B. `import aquarium.Water;`
* C.
  ```java
  import aquarium.jellies.*;
  import aquarium.Water;
  ```
* D.
  ```java
  import aquarium.*;
  import aquarium.jellies.*;
  ```
* E.
  ```java
  import aquarium.Water;
  import aquarium.jellies.Water;
  ```
* F. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, B, C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Option A is correct because it imports all the classes in the `aquarium` package including `aquarium.Water`. Options B and C are correct because they import `Water` by class name. Since importing by class name takes precedence over wildcards, these compile. Option D is incorrect because Java doesn’t know which of the two wildcard `Water` classes to use. Option E is incorrect because you cannot specify the same class name in two imports.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A đúng:** Import tất cả class trong `aquarium` bằng wildcard, trong đó có `aquarium.Water`. Vì không có `Water` nào khác được import nên không xung đột.
    * **B đúng:** Import rõ đích danh `aquarium.Water`.
    * **C đúng:** Import rõ đích danh `aquarium.Water` kết hợp với wildcard `aquarium.jellies.*`. Theo quy tắc phân giải của Java: **Import đích danh (explicit single-type import) luôn có độ ưu tiên cao hơn import bằng Wildcard**. Do đó `Water` ở đây được hiểu chính xác là `aquarium.Water`.
    * **D sai:** Dùng 2 wildcard của 2 package đều có class `Water`. Khi trình biên dịch thấy khai báo `Water water;`, nó sẽ báo lỗi mơ hồ: `reference to Water is ambiguous`.
    * **E sai:** Import đích danh 2 class trùng tên trong cùng 1 file sẽ gây lỗi biên dịch ngay tại dòng import thứ hai.
</details>

---

### Question 14 (Câu 14)
**Which of the following statements about the code snippet are true? (Choose all that apply.)**

```java
3: short numPets = 5L;
4: int numGrains = 2.0;
5: String name = "Scruffy";
6: int d = numPets.length();
7: int e = numGrains.length;
8: int f = name.length();
```

* A. Line 3 generates a compiler error.
* B. Line 4 generates a compiler error.
* C. Line 5 generates a compiler error.
* D. Line 6 generates a compiler error.
* E. Line 7 generates a compiler error.
* F. Line 8 generates a compiler error.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, B, D, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Line 3 does not compile because the `L` suffix makes the literal value a `long`, which cannot be stored inside a `short` directly, making option A correct. Line 4 does not compile because `int` is an integral type, but `2.0` is a `double` literal value, making option B correct. Line 5 compiles without issue. Lines 6 and 7 do not compile because `numPets` and `numGrains` are both primitives, and you can call methods only on reference types, not primitive values, making options D and E correct, respectively. Finally, line 8 compiles because there is a `length()` method defined on `String`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A đúng (Dòng 3 lỗi):** `5L` là hằng số kiểu `long` (64-bit), không thể tự động gán vào biến kiểu `short` (16-bit) mà không ép kiểu (narrowing conversion).
    * **B đúng (Dòng 4 lỗi):** `2.0` là số thực kiểu `double` (64-bit), không thể tự động gán vào biến số nguyên `int` (32-bit).
    * **C sai (Dòng 5 hợp lệ):** Khai báo String chuẩn.
    * **D đúng (Dòng 6 lỗi) & E đúng (Dòng 7 lỗi):** `numPets` và `numGrains` là các **kiểu nguyên thủy (primitives)**. Các kiểu nguyên thủy không phải là Object, do đó không có thuộc tính hay phương thức nào (không thể gọi `.length()` hay `.length`).
    * **F sai (Dòng 8 hợp lệ):** `name` là một đối tượng `String`, gọi phương thức `name.length()` là hoàn toàn chuẩn xác.
</details>

---

### Question 15 (Câu 15)
**Which of the following statements about garbage collection are correct? (Choose all that apply.)**

* A. Calling `System.gc()` is guaranteed to free up memory by destroying objects eligible for garbage collection.
* B. Garbage collection runs on a set schedule.
* C. Garbage collection allows the JVM to reclaim memory for other objects.
* D. Garbage collection runs when your program has used up half the available memory.
* E. An object may be eligible for garbage collection but never removed from the heap.
* F. An object is eligible for garbage collection once no references to it are accessible in the program.
* G. Marking a variable `final` means its associated object will never be garbage collected.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C, E, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** In Java, there are no guarantees about when garbage collection will run. The JVM is free to ignore calls to `System.gc()`. For this reason, options A, B, and D are incorrect. Option C is correct as the purpose of garbage collection is to reclaim used memory. Option E is also correct that an object may never be garbage collected, such as if the program ends before garbage collection runs. Option F is correct and is the primary means by which garbage collection algorithms determine whether an object is eligible for garbage collection. Finally, option G is incorrect as marking a variable `final` means it is constant within its own scope. For example, a local variable marked `final` will be eligible for garbage collection after the method ends, assuming there are no other references to the object that exist outside the method.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **C đúng:** Đây là mục đích chính của bộ thu gom rác (reclaim memory).
    * **E đúng:** Nếu chương trình Java chạy nhanh và không thiếu bộ nhớ, JVM có thể kết thúc tiến trình mà không cần chạy GC lần nào, do đó đối tượng có thể không bao giờ bị xóa khỏi heap trước khi JVM tắt.
    * **F đúng:** Định nghĩa chuẩn của việc đủ điều kiện thu gom rác (*eligible for garbage collection*).
    * **A, B, D sai:** JVM tự do quyết định khi nào chạy GC; `System.gc()` không đảm bảo điều gì và không hề có lịch trình hay mốc 50% cố định nào cả.
    * **G sai:** Biến `final` chỉ không thể gán lại cho đối tượng khác, nhưng khi biến đó ra khỏi scope thì đối tượng nó trỏ tới vẫn bị GC bình thường.
</details>

---

### Question 16 (Câu 16)
**Which are true about this code? (Choose all that apply.)**

```java
var blocky = """
   squirrel \s
   pigeon   \
   termite""";
System.out.print(blocky);
```

* A. It outputs two lines.
* B. It outputs three lines.
* C. It outputs four lines.
* D. There is one line with trailing whitespace.
* E. There are two lines with trailing whitespace.
* F. If we indented each line five characters, it would change the output.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Option A is correct. There are two lines. One starts with `squirrel`, and the other starts with `pigeon`. Remember that a backslash means to skip the line break. Option D is also correct as `\s` means to keep whitespace. In a text block, incidental indentation is ignored, making option F incorrect.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A đúng (In ra 2 dòng):**
      * Dòng 1: bắt đầu bằng `squirrel` và có `\s`.
      * Dòng 2: có ký tự gạch chéo ngược `\` ở cuối dòng sau chữ `pigeon`. Ký tự `\` có tác dụng **triệt tiêu ký tự xuống dòng** (nối dòng tiếp theo vào dòng hiện tại). Vì vậy `pigeon` và `termite` sẽ được gộp chung thành một dòng!
      * Kết quả chỉ có 2 dòng được in ra.
    * **D đúng:** Ký tự `\s` có tác dụng ép Java giữ lại khoảng trắng ở cuối dòng thay vì tự động xóa đi (strip trailing whitespace). Vì vậy chỉ có dòng 1 chứa trailing whitespace.
    * **F sai:** Nếu thụt lề cả 3 dòng thêm cùng một số khoảng trắng, đó là khoảng trắng ngẫu nhiên (*incidental whitespace*) và trình biên dịch sẽ tự động loại bỏ đi, kết quả in ra không đổi.
</details>

---

### Question 17 (Câu 17)
**What lines are printed by the following program? (Choose all that apply.)**

```java
1:  public class WaterBottle {
2:     private String brand;
3:     private boolean empty;
4:     public static float code;
5:     public static void main(String[] args) {
6:        WaterBottle wb = new WaterBottle();
7:        System.out.println("Empty = " + wb.empty);
8:        System.out.println("Brand = " + wb.brand);
9:        System.out.println("Code = " + code);
10:    }
11: }
```

* A. Line 8 generates a compiler error.
* B. Line 9 generates a compiler error.
* C. `Empty = `
* D. `Empty = false`
* E. `Brand = `
* F. `Brand = null`
* G. `Code = 0.0`
* H. `Code = 0f`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D, F, G**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles and runs without issue, so options A and B are incorrect. A `boolean` field initializes to `false`, making option D correct with `Empty = false` being printed. Object references initialize to `null`, not the empty `String`, so option F is correct with `Brand = null` being printed. Finally, the default value of floating-point numbers is `0.0`. Although `float` values can be declared with an `f` suffix, they are not printed with an `f` suffix. For these reasons, option G is correct and `Code = 0.0` is printed.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Chương trình biên dịch và chạy bình thường:
      * `empty` là trường kiểu nguyên thủy `boolean` → giá trị mặc định là `false` (**D đúng**).
      * `brand` là trường kiểu tham chiếu `String` → giá trị mặc định là `null` (**F đúng**).
      * `code` là trường tĩnh kiểu `float` → giá trị mặc định là `0.0` (**G đúng**). Khi in số thực ra màn hình, Java không in hậu tố `f` (nên H sai).
</details>

---

### Question 18 (Câu 18)
**Which of the following statements about `var` are true? (Choose all that apply.)**

* A. A `var` can be used as a constructor parameter.
* B. The type of a `var` is known at compile time.
* C. A `var` cannot be used as an instance variable.
* D. A `var` can be used in a multiple variable assignment statement.
* E. The value of a `var` cannot change at runtime.
* F. The type of a `var` cannot change at runtime.
* G. The word `var` is a reserved word in Java.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, C, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** A `var` cannot be used for a constructor or method parameter or for an instance or class variable, making option A incorrect and option C correct. The type of a `var` is known at compile time, and the type cannot be changed at runtime, although its value can change at runtime. For these reasons, options B and F are correct, and option E is incorrect. Option D is incorrect, as `var` is not permitted in multiple-variable declarations. Finally, option G is incorrect, as `var` is not a reserved word in Java.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **B và F đúng:** Kiểu của `var` được xác định tại compile-time và cố định suốt vòng đời chương trình.
    * **C đúng:** `var` chỉ được dùng cho biến cục bộ (local variable), không dùng cho instance field hay class field.
    * **A sai:** `var` không được dùng cho tham số của method hay constructor.
    * **D sai:** `var a = 1, b = 2;` bị cấm hoàn toàn.
    * **E sai:** Giá trị của biến `var` hoàn toàn có thể thay đổi trong quá trình chạy (miễn là cùng kiểu dữ liệu), trừ khi được đánh dấu là `final var`.
    * **G sai:** `var` là một *reserved type name*, không phải là *reserved keyword* (bạn vẫn có thể đặt tên biến là `var`).
</details>

---

### Question 19 (Câu 19)
**Which are true about the following code? (Choose all that apply.)**

```java
var num1 = Integer.parseInt("11");
var num2 = Integer.valueOf("B", 16);
System.out.println(Integer.max(num1, num2));
```

* A. The output is `11`.
* B. The output is `B`.
* C. The code does not compile.
* D. `num1` is a primitive.
* E. `num2` is a primitive.
* F. A `NumberFormatException` is thrown.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The first two lines provide a way to convert a `String` into a number. The first is a `int` primitive, and the second is a `Integer` reference object, making option D one of the answers. Remember that `B` is 11 in base 16. The code is correct, and the maximum is `11`, which is option A.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * `Integer.parseInt("11")`: Trả về kiểu nguyên thủy `int` có giá trị là 11 → **D đúng** (`num1` là kiểu primitive `int`).
    * `Integer.valueOf("B", 16)`: Chuyển đổi ký tự `"B"` trong hệ thập lục phân (cơ số 16) sang số nguyên. Trong hệ 16: A=10, B=11. Phương thức `valueOf` trả về đối tượng Wrapper `Integer` có giá trị là 11 → **E sai** (`num2` là kiểu reference).
    * `Integer.max(num1, num2)`: Nhận hai số `11` và `11`, trả về số lớn nhất là `11` → **A đúng**.
</details>

---

### Question 20 (Câu 20)
**Which statement about the following class is correct?**

```java
1:  public class PoliceBox {
2:     String color;
3:     long age;
4:     public void PoliceBox() {
5:        color = "blue";
6:        age = 1200;
7:     }
8:     public static void main(String[] time) {
9:        var p = new PoliceBox();
10:       var q = new PoliceBox();
11:       p.color = "green";
12:       p.age = 1400;
13:       p = q;
14:       System.out.println("Q1=" + q.color);
15:       System.out.println("Q2=" + q.age);
16:       System.out.println("P1=" + p.color);
17:       System.out.println("P2=" + p.age);
18:    }
19: }
```

* A. It prints `Q1=blue`.
* B. It prints `Q2=1200`.
* C. It prints `P1=null`.
* D. It prints `P2=1400`.
* E. Line 4 does not compile.
* F. Line 12 does not compile.
* G. Line 13 does not compile.
* H. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The key thing to notice is that line 4 does not define a constructor but instead a method named `PoliceBox()`, since it has a return type of `void`. This method is never executed during the program run, and `color` and `age` are assigned the default values `null` and `0L`, respectively. Lines 11 and 12 change the values for an object associated with `p`, but then, on line 13, the `p` variable is changed to point to the object associated with `q`, which still has the default values. For this reason, the program prints `Q1=null`, `Q2=0`, `P1=null`, and `P2=0`, making option C the only correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * ⚠️ **Bẫy kinh điển:** Nhìn vào dòng 4: `public void PoliceBox()`. Do có kiểu trả về `void`, đây là một **method bình thường**, **KHÔNG PHẢI Constructor**!
    * Khi gọi `new PoliceBox()`, Java gọi constructor mặc định ngầm định của compiler, phương thức `PoliceBox()` ở dòng 4 không hề được gọi.
    * Vì vậy, ban đầu cả `p` và `q` đều có giá trị mặc định: `color = null`, `age = 0L`.
    * Dòng 11, 12 gán cho đối tượng của `p`: `color = "green"`, `age = 1400`.
    * Đến dòng 13: `p = q;` → biến `p` đổi sang trỏ vào đối tượng của `q` (đối tượng có giá trị mặc định `null` và `0L`).
    * Do đó khi in ra:
      * `Q1=null`, `Q2=0`
      * `P1=null`, `P2=0`
    * Đối chiếu các đáp án, chỉ có **C (`P1=null`)** là chính xác.
</details>

---

### Question 21 (Câu 21)
**What is the output of executing the following class?**

```java
1:  public class Salmon {
2:     int count;
3:     { System.out.print(count + "-"); }
4:     { count++; }
5:     public Salmon() {
6:        count = 4;
7:        System.out.print(2 + "-");
8:     }
9:     public static void main(String[] args) {
10:       System.out.print(7 + "-");
11:       var s = new Salmon();
12:       System.out.print(s.count + "-");
13:    }
14: }
```

* A. `7-0-2-1-`
* B. `7-0-1-`
* C. `0-7-2-1-`
* D. `7-0-2-4-`
* E. `0-7-1-`
* F. The class does not compile because of line 3.
* G. The class does not compile because of line 4.
* H. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D (`7-0-2-4-`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** We start with the `main()` method, which prints `7-` on line 10. Next, a new `Salmon` instance is created on line 11. This causes the two instance initializers on lines 3 and 4 to be executed in order. The default value of an instance variable of type `int` is `0`, so `0-` is printed next, and `count` is assigned a value of `1`. Next, the constructor is called. This assigns a value of `4` to `count` and prints `2-`. Finally, line 12 prints `4-`, since that is the value of `count`. Putting it all together, we have `7-0-2-4-`, making option D the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    Thứ tự thực thi từng bước:
    1. Chương trình bắt đầu tại hàm `main()`: dòng 10 in ra `7-`.
    2. Dòng 11 tạo đối tượng `new Salmon()`. Trước khi chạy constructor, các khối **Instance Initializer** sẽ chạy theo thứ tự từ trên xuống:
       * Dòng 3: in ra giá trị hiện tại của `count`. Do là instance field kiểu `int`, giá trị mặc định ban đầu là `0` → in tiếp `0-`.
       * Dòng 4: `count++` tăng lên thành `1`.
    3. Sau khi khối initializer chạy xong, Constructor `Salmon()` mới được thực thi:
       * Dòng 6: gán `count = 4`.
       * Dòng 7: in tiếp `2-`.
    4. Quay lại hàm `main()`, dòng 12 in giá trị của `s.count` (hiện đang là 4) → in tiếp `4-`.
    * Ghép toàn bộ chuỗi lại: `7-0-2-4-`.
</details>

---

### Question 22 (Câu 22)
**Given the following class, which of the following lines of code can independently replace `INSERT CODE HERE` to make the code compile? (Choose all that apply.)**

```java
public class Price {
   public void admission() {
      INSERT CODE HERE
      System.out.print(amount);
   }
}
```

* A. `int Amount = 0b11;`
* B. `int amount = 9L;`
* C. `int amount = 0xE;`
* D. `int amount = 1_2.0;`
* E. `double amount = 1_0_.0;`
* F. `int amount = 0b101;`
* G. `double amount = 9_2.1_2;`
* H. `double amount = 1_2_.0_0;`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C, F, G**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** First, `0b` is the prefix for a binary value, and `0x` is the prefix for a hexadecimal value. These values can be assigned to many primitive types, including `int` and `double`, making options C and F correct. Option A is incorrect because naming the variable `Amount` will cause the `System.out.print(amount)` call on the next line to not compile. Option B is incorrect because `9L` is a `long` value. If the type was changed to `long amount = 9L`, then it would compile. Option D is incorrect because `1_2.0` is a `double` value. If the type was changed to `double amount = 1_2.0`, then it would compile. Options E and H are incorrect because the underscore (`_`) appears next to the decimal point (`.`), which is not allowed. Finally, option G is correct, and the underscore and assignment usage is valid.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **C đúng:** `0xE` là số hệ thập lục phân (giá trị 14), gán cho `int` hợp lệ.
    * **F đúng:** `0b101` là số hệ nhị phân (giá trị 5), gán cho `int` hợp lệ.
    * **G đúng:** `9_2.1_2` có dấu `_` nằm hợp lệ giữa các chữ số, kiểu `double` hợp lệ.
    * **A sai:** Tên biến khai báo là `Amount` (chữ A hoa), trong khi dòng sau in ra `amount` (chữ a thường) → lỗi biên dịch `cannot find symbol: variable amount`.
    * **B sai:** `9L` là kiểu `long`, không thể tự động gán cho biến kiểu `int`.
    * **D sai:** `1_2.0` là số thực `double`, không thể gán cho biến `int`.
    * **E và H sai:** Dấu `_` nằm ngay cạnh dấu chấm thập phân (`_.` hoặc `._`).
</details>

---

### Question 23 (Câu 23)
**Which statements about the following class are true? (Choose all that apply.)**

```java
1:  public class River {
2:     int Depth = 1;
3:     float temp = 50.0;
4:     public void flow() {
5:        for (int i = 0; i < 1; i++) {
6:           int depth = 2;
7:           depth++;
8:           temp--;
9:        }
10:       System.out.println(depth);
11:       System.out.println(temp);
12:    }
13:    public static void main(String... s) {
14:       new River().flow();
15:    }
16: }
```

* A. Line 3 generates a compiler error.
* B. Line 6 generates a compiler error.
* C. Line 7 generates a compiler error.
* D. Line 10 generates a compiler error.
* E. The program prints `3` on line 10.
* F. The program prints `4` on line 10.
* G. The program prints `50.0` on line 11.
* H. The program prints `49.0` on line 11.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The first compiler error is on line 3. The variable `temp` is declared as a `float`, but the assigned value is `50.0`, which is a `double` without the `F`/`f` postfix. Since a `double` doesn’t fit inside a `float`, line 3 does not compile. Next, `depth` is declared inside the `for` loop and has scope only inside this loop. Therefore, reading the value on line 10 triggers a compiler error. For these reasons, options A and D are the correct answers.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A đúng (Lỗi dòng 3):** `50.0` mặc định là kiểu `double`. Muốn gán cho `float`, bắt buộc phải có hậu tố `f` hoặc `F` (`50.0f`).
    * **D đúng (Lỗi dòng 10):** Biến `depth` được khai báo bên trong vòng lặp `for` (dòng 6), do đó phạm vi sống của nó chỉ nằm trong vòng `for`. Ra ngoài vòng `for` ở dòng 10, biến `depth` không còn tồn tại → lỗi biên dịch `cannot find symbol: variable depth`. (Chú ý: ở dòng 2 có biến `Depth` viết hoa chữ D, nhưng Java phân biệt hoa thường nên không thể thay thế cho `depth`).
</details>
