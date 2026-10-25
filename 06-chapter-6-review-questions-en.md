# Review Questions (Bộ Câu Hỏi Ôn Tập Tiếng Anh) - Chapter 6: Class Design

> **Source (Nguồn trích dẫn):** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Pages 569–585).  
> **Quantity (Số lượng):** 26 multiple-choice questions matching the official Oracle exam format with detailed English & Vietnamese explanations (Pages 1353–1364).  
> **How to study (Cách học):** Read the verbatim English question and reason through the options first, then click **"👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)"** to verify your answer and master Oracle's exam traps.

---

### Question 1 (Câu 1)
**Which code can be inserted to have the code print `2`?**

```java
public class BirdSeed {
   private int numberBags;
   boolean call;

   public BirdSeed() {
      // LINE 1
      call = false;
      // LINE 2
   }
   public BirdSeed(int numberBags) {
      this.numberBags = numberBags;
   }
   public static void main(String[] args) {
      var seed = new BirdSeed();
      System.out.print(seed.numberBags);
   } }
```

* A. Replace line 1 with `BirdSeed(2);`
* B. Replace line 2 with `BirdSeed(2);`
* C. Replace line 1 with `new BirdSeed(2);`
* D. Replace line 2 with `new BirdSeed(2);`
* E. Replace line 1 with `this(2);`
* F. Replace line 2 with `this(2);`
* G. The code prints `2` without any changes.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E (Replace line 1 with `this(2);`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Options A and B will not compile because constructors cannot be called without `new`. Options C and D will compile but will create a new object rather than setting the fields in this one. The result is the program will print `0`, not `2`, at runtime. Calling an overloaded constructor, using `this()`, or a parent constructor, using `super()`, is allowed only on the first line of the constructor, making option E correct and option F incorrect. Finally, option G is incorrect because the program prints `0` without any changes, not `2`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Để gọi một constructor nạp chồng khác trong cùng một lớp, ta bắt buộc phải dùng cú pháp `this(...)`. Không thể gọi tên constructor trực tiếp như một hàm thông thường (`BirdSeed(2);` → Lỗi biên dịch, loại A và B).
    * Lời gọi `new BirdSeed(2);` (câu C và D) sẽ tạo ra một đối tượng hoàn toàn mới trên Heap rồi bỏ rơi nó, không hề gán giá trị cho trường `numberBags` của đối tượng hiện tại, nên chương trình sẽ in ra `0`, không phải `2`.
    * Lời gọi `this(...)` **bắt buộc phải là dòng lệnh đầu tiên** trong thân constructor. Do đó chỉ có thể đặt tại **dòng 1** (E đúng, F sai).
    * Mã ban đầu in ra `0` (giá trị mặc định của `int`), nên G sai.
</details>

---

### Question 2 (Câu 2)
**Which modifier pairs can be used together in a method declaration? (Choose all that apply.)**

* A. `static` and `final`
* B. `private` and `static`
* C. `static` and `abstract`
* D. `private` and `abstract`
* E. `abstract` and `final`
* F. `private` and `final`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, B, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `final` modifier can be used with `private` and `static`, making options A and F correct. Marking a `private` method `final` is redundant but allowed. A `private` method may also be marked `static`, making option B correct. Options C, D, and E are incorrect because methods marked `static`, `private`, or `final` cannot be overridden; therefore, they cannot be marked `abstract`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A hợp lệ:** Phương thức static có thể được đánh dấu `final` để ngăn lớp con ẩn (*hide*) phương thức đó.
    * **B hợp lệ:** Phương thức có thể vừa là `private` (chỉ dùng nội bộ) vừa là `static` (thuộc về lớp).
    * **F hợp lệ:** Khai báo một phương thức `private` là `final` là dư thừa (vì phương thức private vốn không thể kế thừa để ghi đè), nhưng trình biên dịch Java vẫn hoàn toàn cho phép.
    * **C, D, E KHÔNG HỢP LỆ (Bổ từ cấm kỵ với `abstract`):**
      * Phương thức `abstract` bắt buộc phải được lớp con ghi đè để hiện thực.
      * `static` không thể ghi đè → Cấm `static abstract`.
      * `private` không cho lớp con nhìn thấy để ghi đè → Cấm `private abstract`.
      * `final` cấm ghi đè → Trực tiếp xung đột với `abstract` → Cấm `final abstract`.
</details>

---

### Question 3 (Câu 3)
**Which of the following statements about methods are true? (Choose all that apply.)**

* A. Overloaded methods must have the same signature.
* B. Overridden methods must have the same signature.
* C. Hidden methods must have the same signature.
* D. Overloaded methods must have the same return type.
* E. Overridden methods must have the same return type.
* F. Hidden methods must have the same return type.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Overloaded methods have the same method name but a different signature (the method parameters differ), making option A incorrect. Overridden instance methods and hidden `static` methods must have the same signature (the name and method parameters must match), making options B and C correct. Overloaded methods can have different return types, while overridden and hidden methods can have covariant return types. None of these methods is required to use the same return type, making options D, E, and F incorrect.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A sai:** Chữ ký phương thức (*Method Signature*) gồm tên hàm + danh sách kiểu tham số. Các phương thức nạp chồng (*Overloaded*) bắt buộc phải có **danh sách tham số khác nhau**, do đó chữ ký của chúng là khác nhau.
    * **B và C đúng:** Cả phương thức ghi đè (*Overridden instance methods*) và phương thức ẩn (*Hidden static methods*) bắt buộc phải có **cùng chữ ký phương thức** (cùng tên và danh sách tham số giống hệt nhau).
    * **D, E, F sai:** Không phương thức nào bắt buộc phải có kiểu trả về giống hệt nhau:
      * Phương thức nạp chồng có thể có kiểu trả về hoàn toàn tùy ý.
      * Phương thức ghi đè và ẩn phương thức chỉ cần có **kiểu trả về đồng biến (Covariant return types)**, tức là kiểu trả về của con có thể là lớp con của kiểu trả về của cha, không bắt buộc phải giống hệt nhau.
</details>

---

### Question 4 (Câu 4)
**What is the output of the following program?**

```java
1:  class Mammal {
2:     private void sneeze() {}
3:     public Mammal(int age) {
4:        System.out.print("Mammal");
5:     } }
6:  public class Platypus extends Mammal {
7:     int sneeze() { return 1; }
8:     public Platypus() {
9:        System.out.print("Platypus");
10:    }
11:    public static void main(String[] args) {
12:       new Mammal(5);
13:    } }
```

* A. `Platypus`
* B. `Mammal`
* C. `PlatypusMammal`
* D. `MammalPlatypus`
* E. The code will compile if line 7 is changed.
* F. The code will compile if line 9 is changed.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code will not compile as is, because the parent class `Mammal` does not define a no-argument constructor. For this reason, the first line of a `Platypus` constructor should be an explicit call to `super(int)`, making option F the correct answer. Option E is incorrect, as line 7 compiles without issue. The `sneeze()` method in the `Mammal` class is marked `private`, meaning it is not inherited and therefore is not overridden in the `Platypus` class. For this reason, the `sneeze()` method in the `Platypus` class is free to define the same method with any return type.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Lớp cha `Mammal` đã tự định nghĩa constructor `public Mammal(int age)` và **không có constructor không tham số**.
    * Lớp con `Platypus` có constructor `public Platypus()`. Vì không có lời gọi `this(...)` hay `super(...)` ở dòng đầu tiên, trình biên dịch sẽ tự động chèn `super();` vào đầu constructor này.
    * Khi gọi `super();`, trình biên dịch không tìm thấy constructor không tham số trong `Mammal` → **Báo lỗi biên dịch ngay tại constructor của `Platypus`**!
    * Do đó code không biên dịch được. Để sửa, ta phải thay đổi dòng đầu tiên trong constructor của `Platypus` (dòng 9) để gọi tường minh `super(5);` → F đúng.
    * Lưu ý về dòng 7: Phương thức `sneeze()` trong `Mammal` là `private`, nên nó không được kế thừa xuống `Platypus`. Phương thức `int sneeze()` ở dòng 7 chỉ là một phương thức mới độc lập, không phải ghi đè, nên dòng 7 hoàn toàn hợp lệ (E sai).
</details>

---

### Question 5 (Câu 5)
**Which of the following completes the constructor so that this code prints out `50`?**

```java
class Speedster {
   int numSpots;
}
public class Cheetah extends Speedster {
   int numSpots;
 
   public Cheetah(int numSpots) {
      // INSERT CODE HERE
   }
 
   public static void main(String[] args) {
      Speedster s = new Cheetah(50);
      System.out.print(s.numSpots);
   }
}
```

* A. `numSpots = numSpots;`
* B. `numSpots = this.numSpots;`
* C. `this.numSpots = numSpots;`
* D. `numSpots = super.numSpots;`
* E. `super.numSpots = numSpots;`
* F. The code does not compile regardless of the code inserted into the constructor.
* G. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E (`super.numSpots = numSpots;`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles, making option F incorrect. An instance variable with the same name as an inherited instance variable is hidden, not overridden. This means that both variables exist, and the one that is used depends on the location and reference type. Because the `main()` method uses a reference type of `Speedster` to access the `numSpots` variable, the variable in the `Speedster` class, not the `Cheetah` class, must be set to `50`. Option A is incorrect, as it reassigns the method parameter to itself. Option B is incorrect, as it assigns the method parameter the value of the instance variable in `Cheetah`, which is `0`. Option C is incorrect, as it assigns the value to the instance variable in `Cheetah`, not `Speedster`. Option D is incorrect, as it assigns the method parameter the value of the instance variable in `Speedster`, which is `0`. Options A, B, C, and D all print `0` at runtime. Option E is the correct answer, as it assigns the instance variable `numSpots` in the `Speedster` class a value of `50`. The `numSpots` variable in the `Speedster` class is then correctly referenced in the `main()` method, printing `50` at runtime.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Trong lớp `Cheetah`, biến `int numSpots` che khuất (*hides*) biến `int numSpots` của lớp cha `Speedster`. Trong bộ nhớ đối tượng `Cheetah` trên Heap thực chất có cả 2 biến `numSpots` riêng biệt.
    * Trong hàm `main`: Biến tham chiếu `s` được khai báo với kiểu **`Speedster`** (`Speedster s = new Cheetah(50);`).
    * **Quy tắc truy cập biến:** Việc truy cập trường dữ liệu `s.numSpots` được quyết định dựa vào **kiểu tham chiếu lúc biên dịch** (`Speedster`), chứ không phụ thuộc vào đối tượng thực tế trên Heap! Do đó, `s.numSpots` sẽ đọc giá trị của trường `numSpots` thuộc về lớp **`Speedster`**!
    * Để `s.numSpots` in ra `50`, constructor của `Cheetah` phải gán giá trị tham số `50` vào trường `numSpots` của lớp cha `Speedster`, cú pháp đúng là: `super.numSpots = numSpots;` → Chọn E.
    * Nếu chọn C (`this.numSpots = numSpots;`), biến của `Cheetah` được gán 50 nhưng biến của `Speedster` vẫn là `0` → in ra `0`.
</details>

---

### Question 6 (Câu 6)
**Which of the following declare immutable classes? (Choose all that apply.)**

```java
public final class Moose {
   private final int antlers; 
}
 
public class Caribou {
   private int antlers = 10; 
}
 
public class Reindeer {
   private final int antlers = 5; 
}
 
public final class Elk {}
 
public final class Deer {
   private final Object o = new Object();
}
```

* A. `Moose`
* B. `Caribou`
* C. `Reindeer`
* D. `Elk`
* E. `Deer`
* F. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `Moose` class doesn’t compile, as the `final` variable `antlers` is not initialized when it is declared, in an instance initializer, or in a constructor. `Caribou` and `Reindeer` are not immutable because they are not marked `final`, which means a subclass could extend them and add mutable fields. `Elk` and `Deer` are both immutable classes since they are marked `final` and only include `private final` members, making options D and E correct. As shown with `Elk`, a class doesn’t need to declare any fields to be considered immutable.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * `Moose`: **Không biên dịch được** vì biến `final int antlers` không được gán giá trị tại khai báo, initializer hay constructor.
    * `Caribou` và `Reindeer`: Không phải lớp bất biến vì **không được đánh dấu `final`**, các lớp con có thể kế thừa và bổ sung các trường khả biến (mutator).
    * `Elk`: Đạt chuẩn lớp bất biến! Lớp được đánh dấu `final`, không có trường nào có thể bị sửa đổi (một lớp không có trường dữ liệu vẫn được coi là immutable).
    * `Deer`: Đạt chuẩn lớp bất biến! Lớp là `final`, trường `o` là `private final` và không cung cấp setter nào.
</details>

---

### Question 7 (Câu 7)
**What is the output of the following code?**

```java
1:  class Arthropod {
2:     protected void printName(long input) {
3:        System.out.print("Arthropod");
4:     }
5:     void printName(int input) {
6:        System.out.print("Spooky");
7:     } }
8:  public class Spider extends Arthropod {
9:     protected void printName(int input) {
10:       System.out.print("Spider");
11:    }
12:    public static void main(String[] args) {
13:       Arthropod a = new Spider();
14:       a.printName((short)4);
15:       a.printName(4);
16:       a.printName(5L);
17:    } }
```

* A. `SpiderSpiderArthropod`
* B. `SpiderSpiderSpider`
* C. `SpiderSpookyArthropod`
* D. `SpookySpiderArthropod`
* E. The code will not compile because of line 5.
* F. The code will not compile because of line 9.
* G. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A (`SpiderSpiderArthropod`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles and runs without issue, so options E and F are incorrect. The `Arthropod` class defines two overloaded versions of the `printName()` method. The `printName()` method that takes an `int` value on line 5 is correctly overridden in the `Spider` class on line 9. Remember, an overridden method can have a broader access modifier, and `protected` access is broader than package access. Because of polymorphism, the overridden method replaces the method on all calls, even if an `Arthropod` reference variable is used, as is done in the `main()` method. For these reasons, the overridden method is called on lines 14 and 15, printing `Spider` twice. Note that the `short` value is automatically cast to the larger type of `int`, which then uses the overridden method. Line 16 calls the overloaded method in the `Arthropod` class, as the `long` value `5L` does not match the overridden method, resulting in `Arthropod` being printed. Therefore, option A is the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Lớp `Arthropod` nạp chồng 2 phương thức: `printName(long)` và `printName(int)`.
    * Tại lớp `Spider`: Phương thức `protected void printName(int)` ở dòng 9 đã **ghi đè (override)** thành công phương thức `void printName(int)` ở dòng 5 (vì cùng chữ ký và quyền `protected` rộng hơn package access).
    * Trong hàm `main`: Biến tham chiếu `a` có kiểu `Arthropod`, nhưng đối tượng thực tế trên Heap là `Spider`. Nhờ cơ chế đa hình động (*Virtual Method Invocation*), bất kỳ lời gọi nào khớp với `printName(int)` sẽ thực thi phiên bản của `Spider`!
    * **Dòng 14 `a.printName((short)4)`:** Giá trị `short` được nới rộng kiểu nguyên thủy sang `int` gần nhất → gọi phương thức ghi đè `printName(int)` của `Spider` → in ra **`Spider`**.
    * **Dòng 15 `a.printName(4)`:** Giá trị `int` khớp chính xác → gọi `printName(int)` của `Spider` → in ra **`Spider`**.
    * **Dòng 16 `a.printName(5L)`:** Giá trị `5L` có kiểu `long`, khớp với `printName(long)` của `Arthropod` (phương thức này không bị Spider ghi đè) → in ra **`Arthropod`**.
    * Kết quả: `SpiderSpiderArthropod`.
</details>

---

### Question 8 (Câu 8)
**What is the result of the following code?**

```java
1:  abstract class Bird {
2:     private final void fly() { System.out.println("Bird"); }
3:     protected Bird() { System.out.print("Wow-"); }
4:  }
5:  public class Pelican extends Bird {
6:     public Pelican() { System.out.print("Oh-"); }
7:     protected void fly() { System.out.println("Pelican"); }
8:     public static void main(String[] args) {
9:        var chirp = new Pelican();
10:       chirp.fly();
11:    } }
```

* A. `Oh-Bird`
* B. `Oh-Pelican`
* C. `Wow-Oh-Bird`
* D. `Wow-Oh-Pelican`
* E. The code contains a compilation error.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D (`Wow-Oh-Pelican`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles without issue. The question is making sure you know that superclass constructors are called in the same manner in `abstract` classes as they are in non-abstract classes. Line 9 calls the constructor on line 6. The compiler automatically inserts `super()` as the first line of the constructor defined on line 6. The program then calls the constructor on line 3 and prints `Wow-`. Control then returns to line 6, and `Oh-` is printed. Finally, the method call on line 10 uses the version of `fly()` in the `Pelican` class, since it is marked `private` and the reference type of `var` is resolved as `Pelican`. The final output is `Wow-Oh-Pelican`, making option D the correct answer. Remember that `private` methods cannot be overridden. If the reference type of `chirp` was `Bird`, then the code would not compile as it would not be accessible outside the class.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Thứ tự gọi Constructor:** Khi thực thi `var chirp = new Pelican();` tại dòng 9, constructor `Pelican()` ở dòng 6 được gọi. Trình biên dịch tự động chèn `super();` ở đầu constructor `Pelican()`, gọi lên constructor `protected Bird()` ở dòng 3 và in ra **`Wow-`**. Sau đó quay lại thân constructor `Pelican()` và in ra **`Oh-`**.
    * **Phương thức `private final void fly()` tại dòng 2:** Vì phương thức `fly()` trong lớp cha `Bird` là `private`, nó **không được kế thừa** xuống lớp con `Pelican`. Do đó từ khóa `final` ở dòng 2 không ngăn cản lớp `Pelican` tự định nghĩa một phương thức `protected void fly()` hoàn toàn mới và độc lập ở dòng 7.
    * **Dòng 10 `chirp.fly()`:** Biến `chirp` khai báo bằng `var` được suy diễn kiểu biên dịch là `Pelican`, do đó nó gọi trực tiếp `Pelican.fly()` ở dòng 7 và in ra **`Pelican`**.
    * Kết quả hoàn chỉnh: `Wow-Oh-Pelican` → Chọn D.
</details>

---

### Question 9 (Câu 9)
**Which of the following statements about overridden methods are true? (Choose all that apply.)**

* A. An overridden method must contain method parameters that are the same or covariant with the method parameters in the inherited method.
* B. An overridden method may declare a new exception, provided it is not checked.
* C. An overridden method must be more accessible than the method in the parent class.
* D. An overridden method may declare a broader checked exception than the method in the parent class.
* E. If an inherited method returns `void`, then the overridden version of the method must return `void`.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The signature must match exactly, making option A incorrect. There is no such thing as a covariant signature. An overridden method must not declare any new checked exceptions or a checked exception that is broader than the inherited method. For this reason, option B is correct, and option D is incorrect. Option C is incorrect because an overridden method may have the same access modifier as the version in the parent class. Finally, overridden methods must have covariant return types, and only `void` is covariant with `void`, making option E correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A sai:** Chữ ký phương thức (*Method Signature* — bao gồm tên phương thức và kiểu các tham số) bắt buộc phải **giống hệt nhau**, trong Java hoàn toàn không tồn tại khái niệm "covariant signature / covariant method parameters" (chỉ có covariant return type).
    * **B đúng, D sai:** Quy tắc 3 của Overriding chỉ giới hạn đối với **checked exceptions** (không được phép ném checked exception mới hoặc có phạm vi bao quát rộng hơn phương thức của lớp cha). Phương thức ghi đè hoàn toàn được phép khai báo mới bất kỳ **unchecked exception** (`RuntimeException`) nào → B đúng, D sai.
    * **C sai:** Phạm vi truy cập ở con phải **rộng bằng hoặc rộng hơn** ở cha (có thể giữ nguyên cùng access modifier), không bắt buộc phải rộng hơn.
    * **E đúng:** Chỉ có kiểu đối tượng mới có quan hệ đồng biến cha/con. Kiểu `void` chỉ đồng biến với chính `void`, nên phương thức ghi đè bắt buộc phải có kiểu trả về là `void`.
</details>

---

### Question 10 (Câu 10)
**Which of the following pairs, when inserted into the blanks, allow the code to compile? (Choose all that apply.)**

```java
1:  public class Howler {
2:     public Howler(long shadow) {
3:        ____________;
4:     }
5:     private Howler(int moon) {
6:        super();
7:     }
8:  }
9:  class Wolf extends Howler {
10:    protected Wolf(String stars) {
11:       super(2L);
12:    }
13:    public Wolf() {
14:       _____________;
15:    }
16: }
```

* A. `this(3)` at line 3, `this("")` at line 14.
* B. `this()` at line 3, `super(1)` at line 14.
* C. `this((short)1)` at line 3, `this(null)` at line 14.
* D. `super()` at line 3, `super()` at line 14.
* E. `this(2L)` at line 3, `super((short)2)` at line 14.
* F. `this(5)` at line 3, `super(null)` at line 14.
* G. Remove lines 3 and 14.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Option A is correct, as `this(3)` calls the constructor declared on line 5, while `this("")` calls the constructor declared on line 10. Option B does not compile, as inserting `this()` at line 3 results in a compiler error, since there is no matching constructor. Option C is correct, as `short` can be implicitly cast to `int`, resulting in `this((short)1)` calling the constructor declared on line 5. In addition, `this(null)` calls the `String` constructor declared on line 10. Option D does not compile because inserting `super()` on line 14 results in an invalid constructor call. The `Howler` class does not contain a no-argument constructor. Option E is also incorrect. Inserting `this(2L)` at line 3 results in a recursive constructor definition. The compiler detects this and reports an error. Option F is incorrect, as using `super(null)` on line 14 does not match any parent constructors. If an explicit cast was used, such as `super((Integer)null)`, then the code would have compiled but would throw an exception at runtime during unboxing. Finally, option G is incorrect because the superclass `Howler` does not contain a no-argument constructor. Therefore, the constructor declared on line 13 will not compile without an explicit call to an overloaded or parent constructor.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A đúng:** Dòng 3 `this(3)` gọi constructor `Howler(int)` ở dòng 5 (phương thức trong cùng lớp có quyền gọi constructor `private`). Dòng 14 `this("")` gọi constructor `Wolf(String)` ở dòng 10.
    * **C đúng:** Dòng 3 `this((short)1)` được nới rộng kiểu tự động sang `int` gọi `Howler(int)`. Dòng 14 `this(null)` khớp với `Wolf(String)` (vì `String` nhận được `null`).
    * **B sai:** Lớp `Howler` không có constructor không tham số, nên dòng 3 `this()` không tìm thấy constructor.
    * **D và G sai:** Lớp cha `Howler` không có constructor không tham số, nên gọi `super()` ở dòng 14 hay để compiler tự động chèn `super();` (khi xóa dòng 14) đều gây lỗi biên dịch.
    * **E sai:** `this(2L)` ở dòng 3 tự gọi chính constructor `Howler(long)` → Lỗi đệ quy vòng tròn (*recursive constructor invocation*).
    * **F sai:** `super(null)` ở dòng 14 không khớp với constructor `Howler(long)` của cha (vì `long` là kiểu nguyên thủy không nhận `null`).
</details>

---

### Question 11 (Câu 11)
**What is the result of the following?**

```java
1:  public class PolarBear {
2:     StringBuilder value = new StringBuilder("t");
3:     { value.append("a"); }
4:     { value.append("c"); }
5:     private PolarBear() {
6:        value.append("b");
7:     }
8:     public PolarBear(String s) {
9:        this();
10:       value.append(s);
11:    }
12:    public PolarBear(CharSequence p) {
13:       value.append(p);
14:    }
15:    public static void main(String[] args) {
16:       Object bear = new PolarBear();
17:       bear = new PolarBear("f");
18:       System.out.println(((PolarBear)bear).value);
19:    } }
```

* A. `tacb`
* B. `tacf`
* C. `tacbf`
* D. `tcafb`
* E. `taftacb`
* F. The code does not compile.
* G. An exception is thrown.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C (`tacbf`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles and runs without issue, making options F and G incorrect. Line 16 initializes a `PolarBear` instance and assigns it to the `bear` reference. The variable declaration and instance initializers are run first, setting `value` to `tac`. The constructor declared on line 5 is called, resulting in `value` being set to `tacb`. Remember, a `static main()` method can access `private` constructors declared in the same class. Line 17 creates another `PolarBear` instance, replacing the `bear` reference declared on line 16. First, `value` is initialized to `tac` as before. Line 17 calls the constructor declared on line 8, since `String` is the narrowest match of a `String` literal. This constructor then calls the overloaded constructor declared on line 5, resulting in `value` being updated to `tacb`. Control returns to the previous constructor, with line 10 updating `value` to `tacbf`, and making option C the correct answer. Note that if the constructor declared on line 8 did not exist, then the constructor on line 12 would match. Finally, the `bear` reference is properly cast to `PolarBear` on line 18, making the `value` parameter accessible.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 16: `new PolarBear()` tạo đối tượng đầu tiên. Khối khai báo biến và initializer chạy trước: `"t"` + `"a"` + `"c"` = `"tac"`. Sau đó constructor `PolarBear()` (dòng 5) chạy nối thêm `"b"` → biến `value` thành `"tacb"`.
    * Dòng 17: `bear = new PolarBear("f")` tạo đối tượng thứ hai gán đè vào biến `bear`:
      * Khối initializer của đối tượng mới chạy trước: tạo lại `"tac"`.
      * Lời gọi constructor: Tham số là literal `"f"` (kiểu `String`). Trình biên dịch ưu tiên chọn constructor nhận `String s` (dòng 8) vì `String` cụ thể hơn `CharSequence`.
      * Dòng 9: Constructor này gọi `this()` → chạy constructor `PolarBear()` (dòng 5) nối thêm `"b"` → chuỗi thành `"tacb"`.
      * Dòng 10: Nối thêm `s` (`"f"`) → chuỗi thành `"tacbf"`.
    * Dòng 18 ép kiểu và in trường `value` của đối tượng thứ hai → in ra **`tacbf`**.
</details>

---

### Question 12 (Câu 12)
**How many lines of the following program contain a compilation error?**

```java
1:  public class Rodent {
2:     public Rodent(Integer x) {}
3:     protected static Integer chew() throws Exception {
4:        System.out.println("Rodent is chewing");
5:        return 1;
6:     }
7:  }
8:  class Beaver extends Rodent {
9:     public Number chew() throws RuntimeException {
10:       System.out.println("Beaver is chewing on wood");
11:       return 2;
12:    } }
```

* A. None
* B. `1`
* C. `2`
* D. `3`
* E. `4`
* F. `5`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C (Có đúng 2 dòng chứa lỗi biên dịch: dòng 8 và dòng 9)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code doesn’t compile, so option A is incorrect. The first compilation error is on line 8. Since `Rodent` declares at least one constructor, and it is not a no-argument constructor, `Beaver` must declare a constructor with an explicit call to a `super()` constructor. Line 9 contains two compilation errors. First, the return types are not covariant since `Number` is a supertype, not a subtype, of `Integer`. Second, the inherited method is `static`, but the overridden method is not, making this an invalid override. The code contains three compilation errors, although they are limited to two lines, making option C the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Lỗi tại dòng 8:** Lớp cha `Rodent` có constructor nhận `Integer`, không có no-arg constructor. Lớp `Beaver` không khai báo constructor nào nên compiler tự chèn constructor mặc định gọi `super();` → Báo lỗi biên dịch tại dòng 8.
    * **Lỗi tại dòng 9:** Dòng 9 có tới 2 lỗi biên dịch:
      1. Phương thức cha `chew()` là `static`, nhưng phương thức con lại là phương thức thể hiện (instance) → Vi phạm quy tắc Method Hiding (không thể override một static method thành instance method).
      2. Kiểu trả về ở cha là `Integer`, ở con là `Number`. `Number` là lớp cha của `Integer` (không phải covariant return type, ở con phải là subtype chứ không được là supertype) → Lỗi biên dịch.
    * Mặc dù có 3 lỗi nhưng các lỗi nằm trên **đúng 2 dòng (dòng 8 và dòng 9)** → Chọn C.
</details>

---

### Question 13 (Câu 13)
**Which of these classes compile and will include a default constructor created by the compiler? (Choose all that apply.)**

* A. `public class Bird {}`
* B. `public class Bird { public bird() {} }`
* C. `public class Bird { public bird(String name) {} }`
* D. `public class Bird { public Bird() {} }`
* E. `public class Bird { Bird(String name) {} }`
* F. `public class Bird { private Bird(int age) {} }`
* G. `public class Bird { public Bird bird() { return null; } }`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, G**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The compiler will insert a default no-argument constructor if the class compiles and does not define any constructors. Options A and G fulfill this requirement, making them the correct answers. The `bird()` declaration in option G is a method declaration, not a constructor. Options B and C do not compile. Since the constructor name does not match the class name, the compiler treats these as methods with missing return types. Options D, E, and F all compile, but since they declare at least one constructor, the compiler does not supply one.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Trình biên dịch chỉ tự động chèn constructor mặc định khi lớp biên dịch được và **hoàn toàn không có bất kỳ constructor nào do người dùng định nghĩa**.
    * **A đúng:** Lớp rỗng, không có constructor → compiler chèn constructor mặc định.
    * **G đúng:** `public Bird bird() { return null; }` có kiểu trả về là `Bird` và tên hàm là `bird` (chữ thường), đây là một **phương thức thông thường**, không phải constructor. Lớp không có constructor nào → compiler tự động chèn constructor mặc định.
    * **B và C không biên dịch được:** Tên `bird()` không trùng chữ hoa với lớp `Bird`, lại không có kiểu trả về → compiler coi là phương thức thiếu kiểu trả về.
    * **D, E, F:** Đều đã tự định nghĩa ít nhất 1 constructor hợp lệ → compiler **không tự động chèn** constructor mặc định nữa.
</details>

---

### Question 14 (Câu 14)
**Which of the following statements about inheritance are correct? (Choose all that apply.)**

* A. A class can directly extend any number of classes.
* B. A class can implement any number of interfaces.
* C. All variables inherit `java.lang.Object`.
* D. If class `A` is extended by `B`, then `B` is a superclass of `A`.
* E. If class `C` implements interface `D`, then `C` is a subtype of `D`.
* F. Multiple inheritance is the property of a class to have multiple direct superclasses.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, E, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** A class can only directly extend a single class, making option A incorrect. A class can implement any number of interfaces, though, making option B correct. Option C is incorrect because primitive variables types do not inherit `java.lang.Object`. If a class extends another class, then it is a subclass, not a superclass, making option D incorrect. A class that implements an interface is a subtype of that interface, making option E correct. Finally, option F is correct as it is an accurate description of multiple inheritance, which is not permitted in Java.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A sai:** Java chỉ hỗ trợ đơn kế thừa lớp (single class inheritance).
    * **B đúng:** Một lớp có thể hiện thực nhiều interface phân tách bởi dấu phẩy (`implements A, B, C`).
    * **C sai:** Các biến kiểu nguyên thủy (`int`, `boolean`...) không kế thừa từ `java.lang.Object`.
    * **D sai:** B kế thừa A thì B là lớp con (*subclass*), A mới là lớp cha (*superclass*).
    * **E đúng:** Lớp hiện thực một interface thì nó là một kiểu con (*subtype*) của interface đó.
    * **F đúng:** Đây là định nghĩa chính xác của đa kế thừa (mà Java không hỗ trợ đối với lớp).
</details>

---

### Question 15 (Câu 15)
**Which statement about the following program is correct?**

```java
1: abstract class Nocturnal {
2:    boolean isBlind();
3: }
4: public class Owl extends Nocturnal {
5:    public boolean isBlind() { return false; }
6:    public static void main(String[] args) {
7:       var nocturnal = (Nocturnal)new Owl();
8:       System.out.println(nocturnal.isBlind());
9:    } }
```

* A. It compiles and prints `true`.
* B. It compiles and prints `false`.
* C. The code will not compile because of line 2.
* D. The code will not compile because of line 5.
* E. The code will not compile because of line 7.
* F. The code will not compile because of line 8.
* G. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code does not compile because the `isBlind()` method in `Nocturnal` is not marked `abstract` and does not contain a method body. The rest of the lines compile without issue, making option C the correct answer. If the `abstract` modifier was added to line 2, then the code would compile and print `false` at runtime, making option B the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Trong lớp trừu tượng `Nocturnal`, phương thức `boolean isBlind();` ở dòng 2 kết thúc bằng dấu chấm phẩy mà không có thân hàm `{}`.
    * Khác với `interface`, bên trong một `abstract class`, một phương thức không có thân hàm **bắt buộc phải được khai báo tường minh với từ khóa `abstract`** (`abstract boolean isBlind();`).
    * Vì dòng 2 thiếu từ khóa `abstract`, trình biên dịch sẽ báo lỗi tại dòng 2 (`missing method body, or declare abstract`) → Chọn C.
</details>

---

### Question 16 (Câu 16)
**What is the result of the following?**

```java
1:  class Arachnid {
2:     static StringBuilder sb = new StringBuilder();
3:     { sb.append("c"); }
4:     static
5:     { sb.append("u"); }
6:     { sb.append("r"); }
7:  }
8:  public class Scorpion extends Arachnid {
9:     static
10:    { sb.append("q"); }
11:    { sb.append("m"); }
12:    public static void main(String[] args) {
13:       System.out.print(Scorpion.sb + " ");
14:       System.out.print(Scorpion.sb + " ");
15:       new Arachnid();
16:       new Scorpion();
17:       System.out.print(Scorpion.sb);
18:    } }
```

* A. `qu qu qumrcrc`
* B. `u u ucrcrm`
* C. `uq uq uqmcrcr`
* D. `uq uq uqcrcrm`
* E. `qu qu qumcrcr`
* F. `qu qu qucrcrm`
* G. The code does not compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D (`uq uq uqcrcrm`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles, so option G is incorrect. Based on order of initialization, the `static` components are initialized first, starting with the `Arachnid` class, since it is the parent of the `Scorpion` class, which initializes the `StringBuilder` to `u`. The `static` initializer in `Scorpion` then updates `sb` to contain `uq`, which is printed twice by lines 13 and 14 along with spaces separating the values. Next, an instance of `Arachnid` is initialized on line 15. There are two instance initializers in `Arachnid`, and they run in order, appending `cr` to the `StringBuilder`, resulting in a value of `uqcr`. An instance of `Scorpion` is then initialized on line 16. The instance initializers in the superclass `Arachnid` run first, appending `cr` again and updating the value of `sb` to `uqcrcr`. Finally, the instance initializer in `Scorpion` runs and appends `m`. The program completes with the final value printed being `uq uq uqcrcrm`, making option D the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    1. **Nạp lớp:** Lớp con `Scorpion` có cha là `Arachnid`.
       * Static của `Arachnid`: Nối `"u"` vào `sb`.
       * Static của `Scorpion`: Nối `"q"` vào `sb`.
       * `sb` hiện tại là `"uq"`.
    2. **Dòng 13 & 14:** In `Scorpion.sb + " "` hai lần → in ra: **`uq uq `**.
    3. **Dòng 15 `new Arachnid()`:** Tạo thể hiện của cha.
       * Khối thể hiện dòng 3 nối `"c"`.
       * Khối thể hiện dòng 6 nối `"r"`.
       * `sb` trở thành `"uqcr"`.
    4. **Dòng 16 `new Scorpion()`:** Tạo thể hiện của con.
       * Thể hiện của cha chạy trước: Khối dòng 3 nối `"c"`, dòng 6 nối `"r"` → `sb` thành `"uqcrcr"`.
       * Thể hiện của con chạy tiếp: Khối dòng 11 nối `"m"` → `sb` thành `"uqcrcrm"`.
    5. **Dòng 17:** In `Scorpion.sb` → in ra **`uqcrcrm`**.
    * Toàn bộ kết quả: `uq uq uqcrcrm`.
</details>

---

### Question 17 (Câu 17)
**Which of the following are true? (Choose all that apply.)**

* A. `this()` can be called from anywhere in a constructor.
* B. `this()` can be called from anywhere in an instance method.
* C. `this.variableName` can be called from any instance method in the class.
* D. `this.variableName` can be called from any `static` method in the class.
* E. You can call the default constructor written by the compiler using `this()`.
* F. You can access a `private` constructor with the `main()` method in the same class.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Calling an overloaded constructor with `this()` may be used only as the first line of a constructor, making options A and B incorrect. Accessing `this.variableName` can be performed from any instance method, constructor, or instance initializer, but not from a `static` method or `static` initializer. For this reason, option C is correct, and option D is incorrect. Option E is tricky. The default constructor is written by the compiler only if no user-defined constructors were provided. And `this()` can only be called from a constructor in the same class. Since there can be no user-defined constructors in the class if a default constructor was created, it is impossible for option E to be true. Since the `main()` method is in the same class, it can call `private` methods in the class, making option F correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **C đúng, D sai:** `this` đại diện cho thể hiện hiện tại, có thể dùng trong các phương thức thể hiện, constructor, khối initializer thể hiện. `this` không thể dùng trong ngữ cảnh static (như static method hay static block).
    * **F đúng:** Phương thức `main()` dù là static nhưng nếu nằm trong cùng một lớp thì vẫn có toàn quyền gọi các thành phần `private` (kể cả constructor private) của chính lớp đó.
    * **A và B sai:** `this()` gọi constructor nạp chồng chỉ được phép đứng ở **dòng lệnh đầu tiên** của một constructor; tuyệt đối không được gọi trong phương thức thường.
    * **E sai:** Compiler chỉ sinh constructor mặc định khi lớp không có bất kỳ constructor nào. Trong khi đó, `this()` chỉ có thể được gọi từ bên trong một constructor của lớp đó. Do đó không bao giờ có trường hợp gọi được constructor mặc định của compiler bằng `this()`.
</details>

---

### Question 18 (Câu 18)
**Which statements about the following classes are correct? (Choose all that apply.)**

```java
1:  public class Mammal {
2:     private void eat() {}
3:     protected static void drink() {}
4:     public Integer dance(String p) { return null; }
5:  }
6:  class Primate extends Mammal {
7:     public void eat(String p) {}
8:  }
9:  class Monkey extends Primate {
10:    public static void drink() throws RuntimeException {}
11:    public Number dance(CharSequence p) { return null; }
12:    public int eat(String p) {}
13: }
```

* A. The `eat()` method in `Mammal` is correctly overridden on line 7.
* B. The `eat()` method in `Mammal` is correctly overloaded on line 7.
* C. The `drink()` method in `Mammal` is correctly overridden on line 10.
* D. The `drink()` method in `Mammal` is correctly hidden on line 10.
* E. The `dance()` method in `Mammal` is correctly overridden on line 11.
* F. The `dance()` method in `Mammal` is correctly overloaded on line 11.
* G. The `eat()` method in `Primate` is correctly hidden on line 12.
* H. The `eat()` method in `Primate` is correctly overloaded on line 12.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `eat()` method is `private` in the `Mammal` class. Since it is not inherited in the `Primate` class, it is neither overridden nor overloaded, making options A and B incorrect. The `drink()` method in `Mammal` is correctly hidden in the `Monkey` class, as the signature is the same and both are `static`, making option D correct and option C incorrect. The version in the `Monkey` class throws a new exception, but it is unchecked; therefore, it is allowed. The `dance()` method in `Mammal` is correctly overloaded in the `Monkey` class because the signatures are not the same, making option E incorrect and option F correct. For methods to be overridden, the signatures must match exactly. Finally, line 12 is an invalid override and does not compile, as `int` is not covariant with `void`, making options G and H both incorrect.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Dòng 2 & 7:** `eat()` trong `Mammal` là `private`, không được kế thừa xuống `Primate`. Do đó phương thức ở dòng 7 là phương thức hoàn toàn độc lập, không phải ghi đè hay nạp chồng (A và B sai).
    * **Dòng 3 & 10 (D đúng, C sai):** Cả hai phương thức `drink()` đều là `static` và có cùng chữ ký `()` → Đây là **Method Hiding**, không phải overriding. Phiên bản ở dòng 10 ném thêm `RuntimeException` (unchecked exception) nên hoàn toàn hợp lệ.
    * **Dòng 4 & 11 (F đúng, E sai):** `dance(String)` ở cha và `dance(CharSequence)` ở con có **kiểu tham số khác nhau** (`String` vs `CharSequence`). Vì chữ ký khác nhau nên đây là **Method Overloading**, không phải overriding!
    * **Dòng 12:** Cùng chữ ký `eat(String)` với dòng 7 nhưng kiểu trả về ở con là `int` trong khi ở cha là `void` (không đồng biến) → Dòng 12 bị lỗi biên dịch (G và H sai).
</details>

---

### Question 19 (Câu 19)
**What is the output of the following code?**

```java
1:  class Reptile {
2:     {System.out.print("A");}
3:     public Reptile(int hatch) {}
4:     void layEggs() {
5:        System.out.print("Reptile");
6:     } }
7:  public class Lizard extends Reptile {
8:     static {System.out.print("B");}
9:     public Lizard(int hatch) {}
10:    public final void layEggs() {
11:       System.out.print("Lizard");
12:    }
13:    public static void main(String[] args) {
14:       var reptile = new Lizard(1);
15:       reptile.layEggs();
16:    } }
```

* A. `AALizard`
* B. `BALizard`
* C. `BLizardA`
* D. `ALizard`
* E. The code will not compile because of line 3.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F (Code không biên dịch được do dòng 9)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `Reptile` class defines a constructor, but it is not a no-argument constructor. Therefore, the `Lizard` constructor must explicitly call `super()`, passing in an `int` value. For this reason, line 9 does not compile, and option F is the correct answer. If the `Lizard` class were corrected to call the appropriate `super()` constructor, then the program would print `BALizard` at runtime, with the `static` initializer running first, followed by the instance initializer, and finally the method call using the overridden method.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Lớp cha `Reptile` chỉ định nghĩa một constructor có tham số `Reptile(int hatch)`. Do đó, lớp `Reptile` không có constructor không tham số.
    * Constructor của lớp con `Lizard` ở dòng 9 không có lời gọi `this(...)` hay `super(...)` tường minh, do đó trình biên dịch tự động chèn `super();` vào dòng đầu tiên.
    * Vì `Reptile` không có constructor không tham số, trình biên dịch báo lỗi tại dòng 9: `constructor Reptile in class Reptile cannot be applied to given types; required: int; found: no arguments`.
    * Nếu sửa dòng 9 thành `public Lizard(int hatch) { super(hatch); }`, chương trình sẽ biên dịch và in ra `BALizard`. Nhưng ở trạng thái hiện tại, code bị lỗi biên dịch → Chọn F.
</details>

---

### Question 20 (Câu 20)
**Which statement about the following program is correct?**

```java
1:  class Bird {
2:     int feathers = 0;
3:     Bird(int x) { this.feathers = x; }
4:     Bird fly() {
5:        return new Bird(1);
6:     } }
7:  class Parrot extends Bird {
8:     protected Parrot(int y) { super(y); }
9:     protected Parrot fly() {
10:       return new Parrot(2);
11:    } }
12: public class Macaw extends Parrot {
13:    public Macaw(int z) { super(z); }
14:    public Macaw fly() {
15:       return new Macaw(3);
16:    }
17:    public static void main(String... sing) {
18:       Bird p = new Macaw(4);
19:       System.out.print(((Parrot)p.fly()).feathers);
20:    } }
```

* A. One line contains a compiler error.
* B. Two lines contain compiler errors.
* C. Three lines contain compiler errors.
* D. The code compiles but throws a `ClassCastException` at runtime.
* E. The program compiles and prints `3`.
* F. The program compiles and prints `0`.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E (The program compiles and prints `3`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The program compiles and runs without issue, making options A through D incorrect. The `fly()` method is correctly overridden in each subclass since the signature is the same, the access modifier is less restrictive, and the return types are covariant. For covariance, `Macaw` is a subtype of `Parrot`, which is a subtype of `Bird`, so overridden return types are valid. Likewise, the constructors are all implemented properly, with explicit calls to the parent constructors as needed. Line 19 calls the overridden version of `fly()` defined in the `Macaw` class, as overriding replaces the method regardless of the reference type. This results in `feathers` being assigned a value of `3`. The `Macaw` object is then cast to `Parrot`, which is allowed because `Macaw` inherits `Parrot`. The `feathers` variable is visible since it is defined in the `Bird` class, and line 19 prints `3`, making option E the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Tính hợp lệ của Overriding & Covariant Return:**
      * `Parrot` kế thừa `Bird`, ghi đè `fly()` với kiểu trả về `Parrot` (lớp con của `Bird`) → hợp lệ.
      * `Macaw` kế thừa `Parrot`, ghi đè `fly()` với kiểu trả về `Macaw` (lớp con của `Parrot`) → hợp lệ.
      * Quyền truy cập mở rộng dần: package → `protected` → `public` → hợp lệ.
    * **Tại hàm `main`:**
      * Dòng 18: `Bird p = new Macaw(4);` tạo đối tượng `Macaw`.
      * Dòng 19: `p.fly()` được gọi. Do tính đa hình động (*Virtual Method Invocation*), phương thức `fly()` của đối tượng thực tế trên Heap (**`Macaw`**) được thực thi!
      * `Macaw.fly()` thực hiện `return new Macaw(3);` → Tạo một đối tượng `Macaw` mới có trường `feathers = 3`.
      * Đối tượng này được ép kiểu sang `Parrot` (hoàn toàn hợp lệ vì `Macaw` kế thừa `Parrot`).
      * Truy cập `.feathers` của đối tượng mới tạo → in ra **`3`**.
</details>

---

### Question 21 (Câu 21)
**Which of the following are properties of immutable classes? (Choose all that apply.)**

* A. The class can contain setter methods, provided they are marked `final`.
* B. The class must not be able to be extended outside the class declaration.
* C. The class may not contain any instance variables.
* D. The class must be marked `static`.
* E. The class may not contain any `static` variables.
* F. The class may only contain `private` constructors.
* G. The data for mutable instance variables may be read, provided they cannot be modified by the caller.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, G**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Immutable objects do not include setter methods, making option A incorrect. An immutable class must be marked `final` or contain only `private` constructors, so no subclass can extend it and make it mutable, making option B correct. Options C and E are incorrect, as immutable classes can contain both instance and `static` variables. Option D is incorrect, as marking a class `static` is not a property of immutable objects. Option F is incorrect. While an immutable class may contain only `private` constructors, this is not a requirement. Finally, option G is correct. It is allowed for the caller to access data in mutable elements of an immutable object, provided they have no ability to modify these elements.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **B đúng:** Để đảm bảo tính bất biến, lớp phải ngăn chặn việc bị lớp con bên ngoài kế thừa và ghi đè phương thức. Điều này đạt được bằng cách gắn từ khóa `final` cho lớp, hoặc đặt tất cả constructor là `private`.
    * **G đúng:** Đối tượng bất biến có thể chứa các đối tượng khả biến (như `ArrayList`), và người gọi được phép đọc dữ liệu từ chúng miễn là không có khả năng sửa đổi chúng (ví dụ: trả về bản sao phòng thủ *defensive copy* hoặc `unmodifiableList`).
    * **A sai:** Lớp bất biến tuyệt đối không có phương thức setter làm thay đổi trạng thái (dù có đánh dấu `final` hay không).
    * **C và E sai:** Lớp bất biến hoàn toàn có thể chứa biến thể hiện (`private final`) và biến static.
    * **D sai:** Top-level class không thể khai báo `static`.
    * **F sai:** Constructor có thể là `public` miễn là lớp được đánh dấu `final`.
</details>

---

### Question 22 (Câu 22)
**What does the following program print?**

```java
1:  class Person {
2:     static String name;
3:     void setName(String q) { name = q; } }
4:  public class Child extends Person {
5:     static String name;
6:     void setName(String w) { name = w; }
7:     public static void main(String[] p) {
8:        final Child m = new Child();
9:        final Person t = m;
10:       m.name = "Elysia";
11:       t.name = "Sophia";
12:       m.setName("Webby");
13:       t.setName("Olivia");
14:       System.out.println(m.name + " " + t.name);
15:    } }
```

* A. `Elysia Sophia`
* B. `Webby Olivia`
* C. `Olivia Olivia`
* D. `Olivia Sophia`
* E. The code does not compile.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D (`Olivia Sophia`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles and runs without issue, making option E incorrect. The `Child` class overrides the `setName()` method and hides the `static name` variable defined in the inherited `Person` class. Since variables are only hidden, not overridden, there are two distinct `name` variables accessible, depending on the location and reference type. Line 8 creates a `Child` instance, which is implicitly cast to a `Person` reference type on line 9. Line 10 uses the `Child` reference type, updating `Child.name` to `Elysia`. Line 11 uses the `Person` reference type, updating `Person.name` to `Sophia`. Lines 12 and 13 both call the overridden `setName()` instance method declared on line 6. This sets `Child.name` to `Webby` on line 12 and then to `Olivia` on line 13. The final values of `Child.name` and `Person.name` are `Olivia` and `Sophia`, respectively, making option D the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Biến `static String name` ở lớp `Child` **ẩn (hides)** biến `static String name` ở lớp `Person`. Có 2 biến riêng biệt: `Person.name` và `Child.name`.
    * Phương thức `setName()` trong `Child` **ghi đè (overrides)** phương thức `setName()` trong `Person`.
    * Dòng 8 & 9: `m` có kiểu tham chiếu `Child`, `t` có kiểu tham chiếu `Person`. Cả hai cùng trỏ vào 1 đối tượng `Child`.
    * Dòng 10: `m.name = "Elysia"` gán vào biến tĩnh của lớp `Child` → `Child.name = "Elysia"`.
    * Dòng 11: `t.name = "Sophia"` gán vào biến tĩnh của lớp `Person` → `Person.name = "Sophia"`.
    * Dòng 12: `m.setName("Webby")` gọi hàm `setName()` của `Child` → gán `Child.name = "Webby"`.
    * Dòng 13: `t.setName("Olivia")`: Do tính đa hình động (*Virtual Method Invocation*), phương thức ghi đè của đối tượng thực tế trên Heap (**`Child`**) được gọi! → gán `Child.name = "Olivia"`.
    * Dòng 14: `m.name` đọc `Child.name` (giá trị **`Olivia`**); `t.name` đọc `Person.name` (giá trị **`Sophia`**).
    * Output in ra: `Olivia Sophia`.
</details>

---

### Question 23 (Câu 23)
**What is the output of the following program?**

```java
1:  class Canine {
2:     public Canine(boolean t) { logger.append("a"); }
3:     public Canine() { logger.append("q"); }
4: 
5:     private StringBuilder logger = new StringBuilder();
6:     protected void print(String v) { logger.append(v); }
7:     protected String view() { return logger.toString(); }
8:  }
9: 
10: class Fox extends Canine {
11:    public Fox(long x) { print("p"); }
12:    public Fox(String name) {
13:       this(2);
14:       print("z");
15:    }
16: }
17: 
18: public class Fennec extends Fox {
19:    public Fennec(int e) {
20:       super("tails");
21:       print("j");
22:    }
23:    public Fennec(short f) {
24:       super("eevee");
25:       print("m");
26:    }
27: 
28:    public static void main(String... unused) {
29:       System.out.println(new Fennec(1).view());
30:    } }
```

* A. `qpz`
* B. `qpzj`
* C. `jzpa`
* D. `apj`
* E. `apjm`
* F. The code does not compile.
* G. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B (`qpzj`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The program compiles, making option F incorrect. The constructors are called from the child class upward, but since each line of a constructor is a call to another constructor, via `this()` or `super()`, they are ultimately executed in a top-down manner. On line 29, the `main()` method calls the `Fennec()` constructor declared on line 19. Remember, integer literals in Java are considered `int` by default. This constructor calls the `Fox()` constructor defined on line 12, which in turn calls the overloaded `Fox()` constructor declared on line 11. Since the constructor on line 11 does not explicitly call a parent constructor, the compiler inserts a call to the no-argument `super()` constructor, which exists on line 3 of the `Canine` class. Line 3 is then executed, adding `q` to the output, and the compiler chain is unwound. Line 11 then executes, adding `p`, followed by line 14, adding `z`. Finally, line 21 is executed, and `j` is added, resulting in a final value for `logger` of `qpzj` and making option B correct. For the exam, remember to follow constructors from the lowest level upward to determine the correct pathway, but then execute them from the top down using the established order.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    1. Dòng 29: Gọi `new Fennec(1)` (đối số kiểu `int`).
    2. Constructor `Fennec(int)` (dòng 19) gọi `super("tails")` ở dòng 20.
    3. Chuyển sang `Fox(String)` (dòng 12) → gặp dòng 13: `this(2)`.
    4. Chuyển sang `Fox(long)` (dòng 11): Dòng đầu không viết gì nên compiler tự chèn `super();`.
    5. Chuyển lên lớp cha cao nhất `Canine()` (dòng 3): Thêm `"q"` vào logger.
    6. Mở ngược lại chuỗi constructor:
       * Thân `Fox(long)` tiếp tục: dòng 11 thêm `"p"`.
       * Thân `Fox(String)` tiếp tục: dòng 14 thêm `"z"`.
       * Thân `Fennec(int)` tiếp tục: dòng 21 thêm `"j"`.
    * Kết quả tích lũy trong logger là: **`qpzj`**.
</details>

---

### Question 24 (Câu 24)
**What is printed by the following program?**

```java
1:  class Antelope {
2:     public Antelope(int p) {
3:        System.out.print("4");
4:     }
5:     { System.out.print("2"); }
6:     static { System.out.print("1"); }
7:  }
8:  public class Gazelle extends Antelope {
9:     public Gazelle(int p) {
10:       super(6);
11:       System.out.print("3");
12:    }
13:    public static void main(String hopping[]) {
14:       new Gazelle(0);
15:    }
16:    static { System.out.print("8"); }
17:    { System.out.print("9"); }
18: }
```

* A. `182640`
* B. `182943`
* C. `182493`
* D. `421389`
* E. The code does not compile.
* F. The output cannot be determined until runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C (`182493`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles and runs without issue, making options E and F incorrect. First, the class is initialized, starting with the superclass `Antelope` and then the subclass `Gazelle`. This involves invoking the `static` variable declarations and `static` initializers. The program first prints `1`, followed by `8`. Then we follow the constructor pathway from the object created on line 14 upward, initializing each class instance using a top-down approach. Within each class, the instance initializers are run, followed by the referenced constructors. The `Antelope` instance is initialized, printing `24`, followed by the `Gazelle` instance, printing `93`. The final output is `182493`, making option C the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    1. **Khởi tạo Class (Static):**
       * Static của cha `Antelope` (dòng 6): in ra **`1`**.
       * Static của con `Gazelle` (dòng 16): in ra **`8`**.
       * (Output hiện tại: `18`).
    2. **Khởi tạo Instance khi gọi `new Gazelle(0)`:**
       * Lớp con gọi `super(6)` lên cha `Antelope`.
       * Khối thể hiện `{}` của `Antelope` (dòng 5) chạy trước → in ra **`2`**.
       * Constructor `Antelope(int)` (dòng 3) chạy → in ra **`4`**.
       * Quay lại lớp con `Gazelle`:
       * Khối thể hiện `{}` của `Gazelle` (dòng 17) chạy → in ra **`9`**.
       * Constructor `Gazelle(int)` (dòng 11) chạy → in ra **`3`**.
    * Kết quả in ra đầy đủ: `182493`.
</details>

---

### Question 25 (Câu 25)
**Which of the following are true about a concrete class? (Choose all that apply.)**

* A. A concrete class can be declared as `abstract`.
* B. A concrete class must implement all inherited `abstract` methods.
* C. A concrete class can be marked as `final`.
* D. A concrete class must be immutable.
* E. A concrete method that implements an `abstract` method must match the method declaration of the `abstract` method exactly.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Concrete classes are, by definition, not `abstract`, so option A is incorrect. A concrete class must implement all inherited `abstract` methods, so option B is correct. Concrete classes can be optionally marked `final`, so option C is correct. Option D is incorrect; concrete classes need not be immutable. A concrete subclass only needs to override the inherited `abstract` method, not match the declaration exactly. For example, a covariant return type can be used. For this reason, option E is incorrect.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **B đúng:** Định nghĩa của concrete class là lớp có thể tạo đối tượng được bằng `new`, do đó nó bắt buộc phải cung cấp phần thân hiện thực cho mọi phương thức abstract mà nó kế thừa.
    * **C đúng:** Concrete class hoàn toàn có thể được đánh dấu là `final` (để cấm kế thừa).
    * **A sai:** Concrete class theo định nghĩa là lớp không phải `abstract`.
    * **D sai:** Concrete class không bắt buộc phải là immutable (hầu hết các lớp là mutable).
    * **E sai:** Khi hiện thực phương thức abstract, phương thức ở lớp con chỉ cần tuân thủ quy tắc ghi đè (overriding), ví dụ có thể mở rộng quyền truy cập hoặc sử dụng kiểu trả về đồng biến (covariant return type), không bắt buộc phải khớp chính xác 100%.
</details>

---

### Question 26 (Câu 26)
**What is the output of the following code?**

```java
4:  public abstract class Whale {
5:     public abstract void dive();
6:     public static void main(String[] args) {
7:        Whale whale = new Orca();
8:        whale.dive(3);
9:     }
10: }
11: class Orca extends Whale {
12:    static public int MAX = 3;
13:    public void dive() {
14:       System.out.println("Orca diving");
15:    }
16:    public void dive(int... depth) {
17:       System.out.println("Orca diving deeper " + MAX);
18: } }
```

* A. `Orca diving`
* B. `Orca diving deeper 3`
* C. The code will not compile because of line 4.
* D. The code will not compile because of line 8.
* E. The code will not compile because of line 11.
* F. The code will not compile because of line 12.
* G. The code will not compile because of line 17.
* H. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D (The code will not compile because of line 8)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The classes are structured correctly, but the body of the `main()` method contains a compiler error. The `Orca` object is implicitly cast to a `Whale` reference on line 7. This is permitted because `Orca` is a subclass of `Whale`. By performing the cast, the `whale` reference on line 8 does not have access to the `dive(int... depth)` method. For this reason, line 8 does not compile, making option D correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 7: `Whale whale = new Orca();` khai báo biến `whale` với **kiểu tham chiếu là `Whale`**.
    * Dòng 8: Lệnh `whale.dive(3);` cố gắng gọi phương thức `dive(int)`.
    * **Quy tắc biên dịch:** Tại thời điểm biên dịch (*compile-time*), trình biên dịch kiểm tra xem trong lớp `Whale` có phương thức nào tên là `dive` nhận tham số số nguyên hay không.
    * Trong lớp `Whale` **chỉ có duy nhất phương thức `public abstract void dive();` không nhận tham số**. Phương thức `dive(int... depth)` chỉ tồn tại ở lớp con `Orca`, lớp `Whale` hoàn toàn không biết đến phương thức này!
    * Do đó, trình biên dịch báo lỗi ngay tại dòng 8: `method dive in class Whale cannot be applied to given types; required: no arguments; found: int` → Chọn D.
</details>
