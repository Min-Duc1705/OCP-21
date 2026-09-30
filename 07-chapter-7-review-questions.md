# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chapter 7: Beyond Classes

> **Nguồn trích dẫn:** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Trang 682–701).  
> **Số lượng:** 30 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết (Trang 1364–1372).  
> **Cách học:** Bạn hãy tự đọc đề và suy luận đáp án trước, sau đó bấm vào mục **"🔍 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và khắc sâu các bẫy thi của Oracle.

---

### Câu 1 (Question 1)
**Khai báo nào sau đây là khai báo `record` hợp lệ? (Chọn tất cả các đáp án đúng)**

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

* A. Iguana
* B. Gecko
* C. Chameleon
* D. BeardedDragon
* E. Reptile
* F. Newt
* G. Không có khai báo nào ở trên

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, D, E**
* **Phân tích chi tiết:**
  * **Iguana:** Không biên dịch được vì nó khai báo một trường static có cùng tên `age` với trường instance đã khai báo trong header của record.
  * **Gecko:** Biên dịch thành công! Record ngầm định là `final`, nhưng việc chỉ định tường minh từ khoá `final` là hoàn toàn hợp lệ. Ngoài ra, một record không bắt buộc phải có trường dữ liệu nào (`()`).
  * **Chameleon:** Không biên dịch được vì record ngầm định là `final` nên **tuyệt đối không thể được đánh dấu là `abstract`**.
  * **BeardedDragon:** Biên dịch thành công vì record cho phép người lập trình ghi đè (override) bất kỳ phương thức accessor nào.
  * **Reptile:** Biên dịch thành công vì nó định nghĩa một **compact constructor** hợp lệ để kiểm tra điều kiện dữ liệu (`size == 1`).
  * **Newt:** Không biên dịch được vì 2 lý do: (1) Record ngầm định kế thừa `java.lang.Record`, do đó **không thể `extends` bất kỳ lớp hoặc record nào khác**; (2) Trong constructor thông thường, nó cố gắng truy cập `this.age` trước khi các trường được khởi tạo hợp lệ.
* **Bẫy thi cần nhớ:** Record luôn luôn ngầm định là final (không thể là abstract) và ngầm định kế thừa java.lang.Record (không thể extends class khác).
</details>

---

### Câu 2 (Question 2)
**Những khai báo nào sau đây có thể điền vào chỗ trống để đoạn mã có thể biên dịch thành công? (Chọn tất cả các đáp án đúng)**

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

* A. Frog
* B. TurtleFrog
* C. BrazilianHornedFrog
* D. CanHop
* E. var
* F. Long
* G. Không có đáp án nào ở trên; mã nguồn chứa lỗi biên dịch.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B, D, E**
* **Phân tích chi tiết:**
  * Đoạn mã khai báo lớp cha `Frog implements CanHop`, và hai lớp con kế thừa từ `Frog` là `BrazilianHornedFrog` và `TurtleFrog`.
  * Biến `frog` được gán đối tượng thực tế trong bộ nhớ là `new TurtleFrog()`.
  * Theo tính đa hình trong Java, kiểu tham chiếu của biến có thể là chính lớp của đối tượng đó (`TurtleFrog` - B), bất kỳ lớp cha nào của nó (`Frog` - A, `Object`), hoặc bất kỳ interface nào mà cây phả hệ của nó triển khai (`CanHop` - D).
  * `BrazilianHornedFrog` (C) là lớp con ngang hàng (sibling), không có quan hệ thừa kế với `TurtleFrog` nên không thể gán.
  * `var` (E) hoàn toàn hợp lệ vì kiểu của vế phải được xác định rõ ràng tại compile-time là `TurtleFrog`.
  * `Long` (F) là lớp hoàn toàn không liên quan, không thể gán.
* **Bẫy thi cần nhớ:** Kiểu tham chiếu có thể là bất kỳ superclass hoặc superinterface nào của đối tượng thực tế.
</details>

---

### Câu 3 (Question 3)
**Kết quả của chương trình sau là gì?**

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

* A. 0 1 0
* B. 1 0 1
* C. Chính xác một dòng mã không biên dịch được.
* D. Nhiều hơn một dòng mã không biên dịch được.
* E. Mã biên dịch nhưng phát sinh ngoại lệ tại thời điểm chạy (runtime).
* F. Không có đáp án nào ở trên.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D (Nhiều hơn một dòng mã không biên dịch được)**
* **Phân tích chi tiết:**
  * **Dòng 13:** Khi enum chỉ chứa danh sách hằng số, dấu chấm phẩy (`;`) ở cuối danh sách là tuỳ chọn. Tuy nhiên, khi enum có thêm bất kỳ thành viên nào khác (như constructor ở dòng 14), **dấu chấm phẩy (`;`) kết thúc danh sách hằng số là BẮT BUỘC**. Dòng 13 thiếu dấu `;` nên bị lỗi biên dịch.
  * **Dòng 14:** Constructor của enum luôn luôn ngầm định là `private`. Bạn **tuyệt đối không được phép khai báo constructor của enum là `public` hoặc `protected`**. Dòng 14 khai báo `public Flavors()` nên gây lỗi biên dịch.
  * Vì có 2 dòng mã bị lỗi biên dịch (dòng 13 và 14), đáp án đúng là **D**.
  * Nếu sửa 2 lỗi trên, chương trình sẽ in ra: `0 1 0 ` (vì ordinals lần lượt là 0, 1, 2).
* **Bẫy thi cần nhớ:** Constructor của enum chỉ có thể là private; nếu enum có chứa thêm phương thức hay constructor thì bắt buộc phải có dấu chấm phẩy ';' sau danh sách hằng số.
</details>

---

### Câu 4 (Question 4)
**Kết quả xuất ra của chương trình sau là gì?**

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

* A. Strong
* B. Cute
* C. Chương trình không biên dịch được.
* D. Mã biên dịch nhưng phát sinh ngoại lệ tại runtime.
* E. Không có đáp án nào ở trên.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C (Chương trình không biên dịch được)**
* **Phân tích chi tiết:**
  * `ArmoredAnimal` là một **sealed class** cho phép lớp `Armadillo` kế thừa (`permits Armadillo`).
  * **Quy tắc bắt buộc của Sealed Class:** Mọi lớp con trực tiếp (`direct subclass`) của một sealed class **bắt buộc phải có chính xác một trong ba modifier**: `final`, `sealed`, hoặc `non-sealed`.
  * Lớp `Armadillo` khai báo là `class Armadillo extends ArmoredAnimal` mà không có modifier nào trong số 3 modifier trên.
  * Do đó, trình biên dịch báo lỗi tại khai báo của lớp `Armadillo`: `sealed, non-sealed or final modifiers expected`.
* **Bẫy thi cần nhớ:** Lớp con trực tiếp của sealed class bắt buộc phải mang đúng một trong 3 modifier: final, sealed, hoặc non-sealed.
</details>

---

### Câu 5 (Question 5)
**Phát biểu nào sau đây về chương trình dưới đây là chính xác?**

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

* A. Chương trình biên dịch không có lỗi.
* B. Đoạn mã phát sinh ClassCastException tại runtime.
* C. Đoạn mã không biên dịch được do dòng 2.
* D. Đoạn mã không biên dịch được do dòng 5.
* E. Đoạn mã không biên dịch được do dòng 8.
* F. Đoạn mã không biên dịch được do dòng 10.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (Đoạn mã không biên dịch được do dòng 8)**
* **Phân tích chi tiết:**
  * Dòng 1–4: Interface `HasExoskeleton` khai báo hằng số `size` (ngầm định `public static final`) và abstract method `getNumberOfSections()` (ngầm định `public abstract`). Hoàn toàn hợp lệ.
  * Dòng 5–7: `Insect` là abstract class kế thừa interface `HasExoskeleton` và thêm abstract method `getNumberOfLegs()`. Hoàn toàn hợp lệ.
  * Dòng 8–11: `Beetle` là concrete class kế thừa `Insect`, do đó nó bắt buộc phải ghi đè (override) tất cả các abstract method chưa được triển khai:
  *   * `getNumberOfLegs()` ở dòng 9: Override hợp lệ.
  *   * `getNumberOfSections()` trong interface không nhận tham số nào. Nhưng dòng 10 lại khai báo `getNumberOfSections(int count)` → Đây là **nạp chồng (overload)**, không phải ghi đè!
  * Vì `Beetle` chưa triển khai phương thức trừu tượng `int getNumberOfSections()` không tham số, nên khai báo lớp `Beetle` ở dòng 8 bị lỗi biên dịch: `Beetle is not abstract and does not override abstract method getNumberOfSections() in HasExoskeleton`.
* **Bẫy thi cần nhớ:** Lớp cụ thể (concrete class) kế thừa abstract class/interface bắt buộc phải override chính xác chữ ký phương thức (signature) của mọi abstract method.
</details>

---

### Câu 6 (Question 6)
**Các phát biểu nào về chương trình sau là đúng? (Chọn tất cả các đáp án đúng)**

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

* A. Mã biên dịch và chạy không có lỗi.
* B. Mã không biên dịch được do dòng 1.
* C. Mã không biên dịch được do dòng 2.
* D. Mã không biên dịch được do dòng 4.
* E. Mã không biên dịch được do dòng 7.
* F. Mã không biên dịch được vì dòng 8 ghi đè phương thức không hợp lệ.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D, E**
* **Phân tích chi tiết:**
  * **Dòng 4:** Phương thức `chew()` được đánh dấu là `abstract` nhưng lại có thân hàm `{ return 13; }`. Trong Java, một phương thức abstract **tuyệt đối không được có thân hàm** → Lỗi biên dịch dòng 4.
  * **Dòng 7:** `IsAPlant` là một `class`, còn `Herbivore` là một `interface`. Một class **triển khai (implements)** interface, **không thể kế thừa (extends)** interface! Cú pháp phải là `implements Herbivore` → Lỗi biên dịch dòng 7.
  * Dòng 1 hoàn toàn hợp lệ vì interface ngầm định là `abstract`. Dòng 2 khai báo hằng số ngầm định `public static final`. Dòng 8 là phương thức nạp chồng (overload) bình thường.
* **Bẫy thi cần nhớ:** Phương thức abstract không được có thân hàm; class không thể 'extends' interface (phải dùng 'implements').
</details>

---

### Câu 7 (Question 7)
**Kết quả của chương trình sau là gì?**

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

* A. 14
* B. 15
* C. Mã không biên dịch được do dòng 4.
* D. Mã không biên dịch được do dòng 5.
* E. Mã không biên dịch được do dòng 6.
* F. Không có đáp án nào ở trên.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (Mã không biên dịch được do dòng 6)**
* **Phân tích chi tiết:**
  * Dòng 2: Phương thức `int getNumOfGills(int p);` trong interface `Aquatic` **ngầm định là `public abstract`**.
  * Dòng 6: Lớp `ClownFish` ghi đè phương thức này nhưng lại khai báo là `int getNumOfGills(int input)` với **quyền truy cập package-private (mặc định)**.
  * **Quy tắc ghi đè phương thức:** Phương thức ghi đè ở lớp con **không được phép thu hẹp quyền truy cập** so với phương thức ở lớp cha (từ `public` xuống package-private là phạm luật).
  * Do đó, dòng 6 gây lỗi biên dịch: `getNumOfGills(int) in ClownFish cannot implement getNumOfGills(int) in Aquatic; attempting to assign weaker access privileges; was public`.
  * Dòng 5 là phương thức nạp chồng (overload) không tham số, hoàn toàn hợp lệ.
* **Bẫy thi cần nhớ:** Mọi phương thức abstract trong interface đều là public. Khi lớp con triển khai (override) bắt buộc phải khai báo từ khoá 'public'.
</details>

---

### Câu 8 (Question 8)
**Cho các khai báo sau, câu lệnh nào có thể điền vào chỗ trống để đoạn mã biên dịch và in ra `true` tại thời điểm chạy? (Chọn tất cả các đáp án đúng)**

```java
record Walrus(List<String> diet) {}
record Exhibit(Walrus animal, String location) {}
 
var e = new Exhibit(new Walrus(List.of("Wally")), "Artic");
System.out.print(e instanceof _____________);
```

* A. Exhibit(Walrus(List<Integer> z), Object a)
* B. Exhibit(Walrus(List m), Object n)
* C. Object w && w.animal().diet().size() == 0
* D. Exhibit(Walrus(var i), var i)
* E. Exhibit(var p, var q)
* F. Exhibit(List<?> g, var h)
* G. Exhibit(var x, CharSequence y)
* H. Exhibit(Walrus(null), var v)
* I. Không có đáp án nào ở trên

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, E, G**
* **Phân tích chi tiết:**
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

### Câu 9 (Question 9)
**Những câu lệnh nào sau đây có thể điền vào chỗ trống để đoạn mã có thể biên dịch thành công? (Chọn tất cả các đáp án đúng)**

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

* A. new Cobra()
* B. new Snake()
* C. new Object()
* D. new String("Snake")
* E. new GardenSnake()
* F. null
* G. Không có đáp án nào ở trên. Lớp không biên dịch được bất kể giá trị nào được điền vào.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, E, F**
* **Phân tích chi tiết:**
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

### Câu 10 (Question 10)
**Những kiểu dữ liệu nào có thể điền vào chỗ trống trên các dòng được đánh dấu X và Z để đoạn mã có thể biên dịch? (Chọn tất cả các đáp án đúng)**

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

* A. Integer trên dòng đánh dấu X
* B. ArrayList trên dòng đánh dấu X
* C. List trên dòng đánh dấu X
* D. List trên dòng đánh dấu Z
* E. ArrayList trên dòng đánh dấu Z
* F. Không có đáp án nào ở trên, vì interface Run không biên dịch được.
* G. Không biên dịch được vì một lý do khác.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B, C, E**
* **Phân tích chi tiết:**
  * **Tại dòng X (`Leopard implements Walk`):** Phương thức `move()` trong interface `Walk` là `private static`, do đó nó **hoàn toàn không được kế thừa** vào các lớp con/triển khai. Lớp `Leopard` định nghĩa phương thức `move()` hoàn toàn mới độc lập, nên kiểu trả về có thể là **bất kỳ kiểu nào** (`Integer` - A, `ArrayList` - B, `List` - C đều hợp lệ).
  * **Tại dòng Z (`Panther implements Run`):** Interface `Run` khai báo `public ArrayList move();`. Lớp `Panther` bắt buộc phải ghi đè phương thức này với kiểu trả về là `ArrayList` hoặc kiểu con của `ArrayList` (Covariant Return Type).
  * Do đó, tại dòng Z: `ArrayList` (E) hợp lệ, còn `List` (D) bị lỗi biên dịch vì `List` là supertype (rộng hơn `ArrayList`), không thỏa mãn quy tắc kiểu trả về hiệp biến.
* **Bẫy thi cần nhớ:** Phương thức private static trong interface không được kế thừa. Lớp con triển khai có thể tự do định nghĩa phương thức trùng tên mà không bị ràng buộc.
</details>

---

### Câu 11 (Question 11)
**Kết quả của việc biên dịch và thực thi đoạn mã sau là gì?**

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

* A. Kết quả in ra là 5.
* B. Kết quả in ra là 10.
* C. Dòng 6 phát sinh lỗi biên dịch.
* D. Dòng 12 phát sinh lỗi biên dịch.
* E. Dòng 13 phát sinh lỗi biên dịch.
* F. Mã biên dịch nhưng phát sinh ngoại lệ tại runtime.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B (Kết quả in ra là 10)**
* **Phân tích chi tiết:**
  * Kể từ Java 16+, một **Inner Class (non-static)** hoàn toàn được phép chứa các thành viên `static` (như biến `public static int butter = 10;` ở dòng 6) → Dòng 6 biên dịch hợp lệ.
  * Dòng 3 & dòng 5: Các constructor dù là `private` nhưng đều nằm bên trong cùng phạm vi của lớp ngoài `Movie`, nên các phương thức trong `Movie` (kể cả `main`) đều có quyền truy cập → Dòng 12 và 13 biên dịch hợp lệ.
  * Dòng 13: Cú pháp khởi tạo inner class `new Movie().new Popcorn()` hoàn toàn chính xác.
  * Dòng 8: Lệnh `System.out.println(butter);` nằm bên trong lớp `Popcorn`. Theo quy tắc che giấu phạm vi (scoping), biến `butter` ở dòng 6 của chính lớp `Popcorn` sẽ che giấu biến `butter` của lớp ngoài `Movie`.
  * Do đó, chương trình in ra giá trị `10`.
* **Bẫy thi cần nhớ:** Java 16+ cho phép inner class chứa biến static; biến cục bộ/thành viên lớp trong sẽ che giấu biến cùng tên của lớp ngoài.
</details>

---

### Câu 12 (Question 12)
**Những biến hoặc thành viên nào sau đây có thể truy cập được từ bên trong phương thức `hiss()`? (Chọn tất cả các đáp án đúng)**

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

* A. counter()
* B. tail
* C. body
* D. stripes()
* E. stripes
* F. counter
* G. Dòng 15 không biên dịch được.
* H. Dòng 17 không biên dịch được.
* I. Các dòng 20–22 không biên dịch được.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, D, E, F**
* **Phân tích chi tiết:**
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

### Câu 13 (Question 13)
**Kết quả của chương trình sau là gì?**

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

* A. s
* B. w
* C. m
* D. missing data
* E. Chính xác một dòng mã không biên dịch được.
* F. Nhiều hơn một dòng mã không biên dịch được.
* G. Mã biên dịch nhưng phát sinh ngoại lệ tại thời điểm chạy (runtime).

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **G (Mã biên dịch nhưng phát sinh ngoại lệ tại runtime)**
* **Phân tích chi tiết:**
  * Kể từ Java 21, câu lệnh và biểu thức `switch` hỗ trợ Pattern Matching và cho phép sử dụng tên đầy đủ kèm tiền tố enum (Qualified enum constant) như `case Seasons.SPRING ->` → Mã nguồn biên dịch hoàn toàn hợp lệ!
  * Tuy nhiên, biến `v` được gán giá trị bằng `null` (`Seasons v = null;`).
  * Trong Java, khi biểu thức selector của câu lệnh `switch` đánh giá ra `null`, và trong `switch` **không có nhánh `case null`**, JVM sẽ **ném ra ngoại lệ `NullPointerException` ngay lập tức** tại thời điểm chạy!
  * Nhánh `default` KHÔNG bắt giá trị `null` nếu không có `case null`. Do đó, chương trình ném ngoại lệ tại runtime → Chọn **G**.
* **Bẫy thi cần nhớ:** Switch trên biến null mà không có nhánh 'case null' sẽ ném ra NullPointerException tại runtime, ngay cả khi có nhánh 'default'!
</details>

---

### Câu 14 (Question 14)
**Những phát biểu nào về sealed class là đúng? (Chọn tất cả các đáp án đúng)**

* A. Một sealed interface giới hạn những sub-interface nào được phép mở rộng (extend) nó.
* B. Một sealed class không thể bị kế thừa gián tiếp bởi một lớp không được liệt kê trong mệnh đề permits của nó.
* C. Một sealed class có thể được kế thừa bởi một abstract class.
* D. Một sealed class có thể được kế thừa bởi một lớp con sử dụng modifier nonsealed.
* E. Một sealed interface giới hạn những lớp con nào được phép triển khai (implement) nó.
* F. Một sealed class không thể chứa bất kỳ lớp con lồng nhau (nested subclasses) nào.
* G. Không có phát biểu nào ở trên là đúng.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C, E**
* **Phân tích chi tiết:**
  * `A`: Đúng. Sealed interface giới hạn các sub-interface được phép `extends` nó.
  * `E`: Đúng. Sealed interface cũng giới hạn các class được phép `implements` nó.
  * `B`: Sai. Nếu một lớp con trực tiếp được khai báo là `non-sealed`, thì các lớp khác không có trong `permits` vẫn có thể kế thừa từ lớp `non-sealed` đó, tức là kế thừa gián tiếp sealed class.
  * `C`: Đúng. Lớp con trực tiếp của sealed class hoàn toàn có thể là `abstract class`, miễn là nó mang thêm một trong các modifier `sealed` hoặc `non-sealed`.
  * `D`: Sai. Từ khoá hợp lệ trong Java phải có dấu gạch nối: **`non-sealed`**, không phải `nonsealed`.
  * `F`: Sai. Sealed class hoàn toàn có thể chứa các nested subclasses.
* **Bẫy thi cần nhớ:** Từ khóa đúng là 'non-sealed' (có dấu gạch nối). Lớp non-sealed cho phép các lớp ngoài danh sách permits kế thừa gián tiếp.
</details>

---

### Câu 15 (Question 15)
**Dòng lệnh nào có thể điền vào chỗ trống để đoạn mã in ra `Not scared` tại thời điểm chạy?**

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

* A. g.boo()
* B. g.super.boo()
* C. new Ghost().boo()
* D. g.Ghost.boo()
* E. new Spirit().boo()
* F. Không có đáp án nào ở trên

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (Không có đáp án nào ở trên)**
* **Phân tích chi tiết:**
  * **Bẫy thi cực kỳ tinh vi của Oracle:** Hãy chú ý dòng khai báo lớp `Spirit`:
  * `protected final class Spirit` được đánh dấu là **`final`**!
  * Trong phương thức `main`, đoạn mã viết: `var g = new Ghost().new Spirit() {};`.
  * Cặp dấu `{}` ở cuối dòng này chính là cú pháp khai báo một **Anonymous Class (lớp vô danh) kế thừa từ lớp `Spirit`**.
  * Vì lớp `Spirit` là `final`, nó **tuyệt đối không thể bị kế thừa**! Trình biên dịch sẽ báo lỗi ngay lập tức: `cannot inherit from final Ghost.Spirit`.
  * Vì đoạn mã không thể biên dịch được, nên không có dòng lệnh nào có thể làm cho chương trình in ra kết quả → Chọn **F**.
* **Bẫy thi cần nhớ:** Không thể tạo anonymous class từ một class được đánh dấu là 'final'. Đề thi thường gài bẫy biên dịch trước khi bạn kịp suy nghĩ đến logic runtime!
</details>

---

### Câu 16 (Question 16)
**Đoạn mã sau nằm trong tệp `Ostrich.java`. Kết quả của việc biên dịch tệp nguồn này là gì?**

```java
1: public class Ostrich {
2:    private int count;
3:    static class OstrichWrangler {
4:       public int stampede() {
5:          return count;
6:       } } }
```

* A. Mã biên dịch thành công và tạo ra 1 tệp bytecode: Ostrich.class.
* B. Mã biên dịch thành công và tạo ra 2 tệp bytecode: Ostrich.class và OstrichWrangler.class.
* C. Mã biên dịch thành công và tạo ra 2 tệp bytecode: Ostrich.class và Ostrich$OstrichWrangler.class.
* D. Lỗi biên dịch xảy ra tại dòng 3.
* E. Lỗi biên dịch xảy ra tại dòng 5.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (Lỗi biên dịch xảy ra tại dòng 5)**
* **Phân tích chi tiết:**
  * Lớp `OstrichWrangler` là một **Static Nested Class** (lớp tĩnh lồng nhau).
  * Khác với Inner Class thông thường, một static nested class **không gắn liền với đối tượng instance nào của lớp ngoài**.
  * Tại dòng 5, phương thức `stampede()` cố gắng truy cập trực tiếp biến instance `count` của lớp ngoài `Ostrich` mà không thông qua một đối tượng tham chiếu cụ thể.
  * Do đó, dòng 5 gây lỗi biên dịch: `non-static variable count cannot be referenced from a static context` → Đáp án đúng là **E**.
* **Bẫy thi cần nhớ:** Static nested class không thể truy cập trực tiếp instance variable của outer class mà không có đối tượng cụ thể.
</details>

---

### Câu 17 (Question 17)
**Những dòng nào trong khai báo interface sau không biên dịch được? (Chọn tất cả các đáp án đúng)**

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

* A. Tất cả các dòng đều biên dịch không có lỗi.
* B. Dòng 2.
* C. Dòng 3.
* D. Dòng 4.
* E. Dòng 5.
* F. Dòng 6.
* G. Dòng 7.
* H. Dòng 8.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E, G**
* **Phân tích chi tiết:**
  * Dòng 2 & 3: Biến trong interface ngầm định là `public static final` → Hợp lệ.
  * Dòng 4: Phương thức `static` trong interface có thân hàm `{}` và ngầm định là `public` → Hợp lệ.
  * **Dòng 5:** `int findMore() { return 2; }` là phương thức instance có thân hàm nhưng **không có từ khoá `default` hoặc `private`**. Phương thức trong interface có thân hàm bắt buộc phải là `default`, `static`, hoặc `private` → **Lỗi biên dịch dòng 5**.
  * Dòng 6: Phương thức `default` có thân hàm, ngầm định là `public` → Hợp lệ.
  * **Dòng 7:** Thành viên trong interface **tuyệt đối không bao giờ được phép mang modifier `protected`** → **Lỗi biên dịch dòng 7**.
  * Dòng 8: Phương thức `private static` có thân hàm (hỗ trợ từ Java 9) → Hợp lệ.
* **Bẫy thi cần nhớ:** Interface không hỗ trợ modifier 'protected'; phương thức instance có thân hàm bắt buộc phải có từ khoá 'default' hoặc 'private'.
</details>

---

### Câu 18 (Question 18)
**Kết quả in ra của chương trình sau là gì?**

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

* A. a
* B. b
* C. c
* D. Khai báo của lớp Diet không biên dịch được.
* E. Phương thức main() không biên dịch được.
* F. Mã biên dịch nhưng phát sinh ngoại lệ tại runtime.
* G. Không có đáp án nào ở trên.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (Phương thức main() không biên dịch được)**
* **Phân tích chi tiết:**
  * `Diet` là một **Inner Class (member class non-static)** của lớp `Deer`.
  * Một inner class non-static **bắt buộc phải gắn liền với một đối tượng của lớp ngoài** thì mới có thể khởi tạo.
  * Trong phương thức `main` (là một static method), đoạn mã gọi trực tiếp: `new Diet()` mà không thông qua instance nào của `Deer`.
  * Trình biên dịch sẽ báo lỗi: `an enclosing instance that contains Deer.Diet is required`.
  * Để sửa lỗi, cần viết là: `new Deer().new Diet().getFavorite()`. Do đó, phương thức `main()` không biên dịch được → Chọn **E**.
* **Bẫy thi cần nhớ:** Từ static context (như main), không thể khởi tạo trực tiếp non-static inner class bằng 'new Inner()' mà phải qua 'outerInstance.new Inner()'.
</details>

---

### Câu 19 (Question 19)
**Chương trình `Bear` sau đây in ra kết quả gì?**

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

* A. insects
* B. Insects
* C. 0
* D. 1
* E. false
* F. Đoạn mã không biên dịch được.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (Đoạn mã không biên dịch được)**
* **Phân tích chi tiết:**
  * Enum `FOOD` khai báo một phương thức trừu tượng: `public abstract boolean isHealthy();`.
  * **Quy tắc vàng của Enum có abstract method:** Khi enum khai báo một phương thức abstract, **MỌI hằng số enum bên trong bắt buộc phải cung cấp phần thân ghi đè phương thức này** trong body riêng của nó!
  * Trong mã nguồn trên, chỉ duy nhất hằng số `INSECTS` triển khai phương thức `isHealthy()`, còn các hằng số khác (`BERRIES`, `FISH`, `ROOTS`, `COOKIES`, `HONEY`) đều không triển khai.
  * Do đó, trình biên dịch báo lỗi tại các hằng số chưa triển khai phương thức abstract → Đoạn mã không biên dịch được.
* **Bẫy thi cần nhớ:** Khi enum có abstract method, TẤT CẢ các giá trị hằng số enum đều bắt buộc phải ghi đè phương thức đó.
</details>

---

### Câu 20 (Question 20)
**Kết quả xuất ra của đoạn mã sau là gì?**

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

* A. 1
* B. 2
* C. 3
* D. 4
* E. 5
* F. 6
* G. 7
* H. Không có đáp án nào ở trên (Lỗi biên dịch)

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **H (Không có đáp án nào ở trên)**
* **Phân tích chi tiết:**
  * Đoạn mã chứa nhiều lỗi biên dịch trong biểu thức `switch`:
  * 1. **Không tương thích kiểu:** Tại dòng 23, thành phần thứ hai của `Gorilla` được khai báo là kiểu đối tượng `Double y`. Nhưng pattern ở dòng 23 lại khai báo `Gorilla(int d, double e)` với kiểu nguyên thủy `double`. Trong Record Pattern, kiểu wrapper `Double` không tự động unbox để khớp với kiểu primitive `double` → Lỗi biên dịch.
  * 2. **Thống trị mẫu (Pattern Dominance):** Dòng 22 `case Family(var a, var b)` đã bao quát 100% mọi đối tượng kiểu `Family`. Các nhánh `case` từ dòng 23 đến 26 đều là các mẫu con cụ thể hơn của `Family` và bị nhánh ở dòng 22 che khuất hoàn toàn (unreachable code). Trình biên dịch Java cấm điều này và báo lỗi pattern dominance!
  * Vì biểu thức `switch` không biên dịch được, đáp án đúng là **H**.
* **Bẫy thi cần nhớ:** Nhánh tổng quát hơn (như var a, var b) đứng trước sẽ 'thống trị' (dominate) các nhánh cụ thể đứng sau, gây lỗi biên dịch Unreachable Code.
</details>

---

### Câu 21 (Question 21)
**Cho khai báo record sau, dòng mã nào có thể điền vào chỗ trống để mã có thể biên dịch thành công?**

```java
public record RabbitFood(int size, String brand, LocalDate 
expires) {
   public static int MAX_STORAGE = 100;
   public RabbitFood() {
      __________________________;
   }
}
```

* A. size = MAX_STORAGE
* B. this.size = 10
* C. if(expires.isAfter(LocalDate.now())) throw new RuntimeException()
* D. if(brand==null) super.brand = "Unknown"
* E. throw new RuntimeException()
* F. Không có đáp án nào ở trên

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (Không có đáp án nào ở trên)**
* **Phân tích chi tiết:**
  * Constructor `public RabbitFood()` là một **constructor nạp chồng (overloaded / non-canonical constructor)** vì nó có danh sách tham số khác với header của record.
  * **Quy tắc bất di bất dịch của Record Constructor:** Mọi non-canonical constructor trong record **bắt buộc phải gọi một constructor khác thông qua `this(...)` ngay tại dòng đầu tiên**, và chuỗi gọi này cuối cùng phải dẫn về Canonical Constructor!
  * Trong các lựa chọn từ A đến E, không có lựa chọn nào chứa lời gọi `this(...)` (ví dụ: `this(MAX_STORAGE, "Default", LocalDate.now())`).
  * Do đó, không có đáp án nào trong A–E có thể làm cho constructor này biên dịch hợp lệ → Chọn **F**.
* **Bẫy thi cần nhớ:** Constructor nạp chồng trong record BẮT BUỘC phải gọi this(...) ở dòng đầu tiên để ủy quyền khởi tạo cho canonical constructor.
</details>

---

### Câu 22 (Question 22)
**Những câu lệnh nào sau đây có thể điền vào phương thức `rest()`? (Chọn tất cả các đáp án đúng)**

```java
public class Lion {
   class Cub {}
   static class Den {}
   static void rest() {
      ________________;
   } }
```

* A. Cub a = Lion.new Cub()
* B. Lion.Cub b = new Lion().Cub()
* C. Lion.Cub c = new Lion().new Cub()
* D. var d = new Den()
* E. var e = Lion.new Cub()
* F. Lion.Den f = Lion.new Den()
* G. Lion.Den g = new Lion.Den()
* H. var h = new Cub()

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, D, G**
* **Phân tích chi tiết:**
  * Phương thức `rest()` là một `static` method:
  * * `Cub` là một non-static inner class: Muốn khởi tạo bên trong static context, bắt buộc phải có đối tượng ngoài: `new Lion().new Cub()` → **C đúng**. Các lựa chọn A, B, E, H đều sai cú pháp.
  * * `Den` là một static nested class: Không cần đối tượng ngoài, có thể khởi tạo trực tiếp bằng `new Den()` (D) hoặc `new Lion.Den()` (G) → **D và G đúng**. Lựa chọn F dùng cú pháp sai (`Lion.new Den()`).
* **Bẫy thi cần nhớ:** Khởi tạo inner class: 'outerRef.new Inner()'. Khởi tạo static nested class: 'new Outer.StaticNested()'.
</details>

---

### Câu 23 (Question 23)
**Cho chương trình sau, câu lệnh nào có thể điền vào chỗ trống để chương trình in ra `Swim!` tại thời điểm chạy?**

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

* A. super.perform()
* B. Swim.perform()
* C. super.Swim.perform()
* D. Swim.super.perform()
* E. Mã không biên dịch được bất kể điền gì vào chỗ trống.
* F. Mã biên dịch nhưng do tính đa hình, không thể tạo ra kết quả yêu cầu mà không tạo đối tượng mới.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D (Swim.super.perform())**
* **Phân tích chi tiết:**
  * Lớp `Penguin` triển khai cả hai interface `Swim` và `Dance` đều có phương thức default `perform()`. Lớp `Penguin` đã ghi đè lại phương thức này để giải quyết xung đột, hoàn toàn hợp lệ.
  * Để gọi phương thức `default` của một interface cha cụ thể, Java cung cấp cú pháp chuẩn mực duy nhất:
  * **`<TênInterface>.super.<tênPhươngThức>()`**
  * Ở đây, để gọi phiên bản của `Swim`, cú pháp chính xác là: `Swim.super.perform();` → Đáp án đúng là **D**.
  * Các cú pháp như `super.perform()`, `Swim.perform()`, hay `super.Swim.perform()` đều là cú pháp sai và gây lỗi biên dịch.
* **Bẫy thi cần nhớ:** Cú pháp gọi default method của interface cha: InterfaceName.super.methodName().
</details>

---

### Câu 24 (Question 24)
**Những dòng nào trong interface sau không biên dịch được? (Chọn tất cả các đáp án đúng)**

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

* A. Dòng 2
* B. Dòng 3
* C. Dòng 4
* D. Dòng 5
* E. Dòng 6
* F. Dòng 7
* G. Không có dòng nào ở trên

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, E**
* **Phân tích chi tiết:**
  * **Dòng 3:** Phương thức `static int hunt()` là phương thức cấp lớp (static context), nhưng nó lại cố gắng gọi trực tiếp phương thức instance trừu tượng `getName()` mà không có đối tượng. Static method không thể gọi instance method → **Lỗi biên dịch dòng 3**.
  * **Dòng 6:** Phương thức `private static boolean sneak()` là static context, nhưng nó lại gọi trực tiếp phương thức private instance `roar()`. Tương tự, static không thể gọi instance → **Lỗi biên dịch dòng 6**.
  * Các dòng còn lại đều hợp lệ: dòng 4 (default gọi private instance `rest()`), dòng 5 (private instance gọi abstract, default, và static method đều được), dòng 7 (private instance method có thân hàm).
* **Bẫy thi cần nhớ:** Phương thức static trong interface chỉ có thể gọi các thành viên static khác; không thể gọi instance method (abstract, default, private instance).
</details>

---

### Câu 25 (Question 25)
**Chương trình sau in ra kết quả gì?**

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

* A. x is 0
* B. x is 24
* C. Dòng 6 phát sinh lỗi biên dịch.
* D. Dòng 8 phát sinh lỗi biên dịch.
* E. Dòng 11 phát sinh lỗi biên dịch.
* F. Không có đáp án nào ở trên.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B (x is 24)**
* **Phân tích chi tiết:**
  * Dòng 5 định nghĩa một **Local Abstract Class** `Stripes` bên trong phương thức `hunt()`, hoàn toàn hợp lệ.
  * Dòng 11 sử dụng một **Anonymous Class** để kế thừa và khởi tạo lớp trừu tượng `Stripes`: `new Stripes() {}` → Hoàn toàn hợp lệ.
  * Dòng 8: Lệnh in sử dụng biến cục bộ `message` (là `effectively final` vì không bị thay đổi sau khi gán) kết hợp với `Zebra.this.x`.
  * Biểu thức `Zebra.this.x` tham chiếu một cách tường minh đến biến instance `x` của đối tượng lớp ngoài `Zebra` (có giá trị là `24`), bỏ qua biến `x = 0` của lớp `Stripes`.
  * Do đó, chương trình in ra: `x is 24` → Đáp án đúng là **B**.
* **Bẫy thi cần nhớ:** Cú pháp 'OuterClass.this.variable' cho phép truy cập chính xác biến của lớp ngoài khi bị trùng tên với biến lớp trong.
</details>

---

### Câu 26 (Question 26)
**Kết quả xuất ra của chương trình sau là gì?**

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

* A. null
* B. -1
* C. 3
* D. 4
* E. Lỗi biên dịch tại dòng 23.
* F. Lỗi biên dịch tại dòng 24.
* G. Lỗi biên dịch tại dòng 34.
* H. Mã biên dịch nhưng phát sinh NullPointerException tại runtime.
* I. Không có đáp án nào ở trên.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C (3)**
* **Phân tích chi tiết:**
  * Khác với Record, các trường trong Enum **không bị bắt buộc phải là `final`**. Trường `legs` ở dòng 28 không có modifier `final`, do đó dòng 34 thay đổi tham chiếu `Animals.BIRD.legs = List.of(-1);` là hoàn toàn hợp lệ (dù trong thực tế đây là bad practice).
  * Hằng số `BIRD` ghi đè phương thức `stand()` ở dòng 24:
  *   `return legs.get(0) + 4;`
  * Tại thời điểm chạy dòng 35, `legs.get(0)` trả về `-1`. Do đó, biểu thức tính toán: `-1 + 4 = 3`.
  * Chương trình in ra số `3` → Đáp án đúng là **C**.
* **Bẫy thi cần nhớ:** Hằng số enum có thể ghi đè phương thức trong body riêng; biến trong enum nếu không khai báo final thì vẫn có thể bị sửa đổi giá trị.
</details>

---

### Câu 27 (Question 27)
**Giả sử một record được định nghĩa có ít nhất một trường dữ liệu, những thành phần nào sau đây luôn được trình biên dịch tự động chèn vào (và mỗi thành phần đều có thể được ghi đè hoặc khai báo lại)? (Chọn tất cả các đáp án đúng)**

* A. Một constructor không tham số (no-argument constructor)
* B. Một phương thức accessor cho mỗi trường dữ liệu
* C. Phương thức toString()
* D. Phương thức equals()
* E. Một phương thức mutator (setter) cho mỗi trường dữ liệu
* F. Phương thức sắp xếp sort() cho mỗi trường dữ liệu
* G. Phương thức hashCode()

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, C, D, G**
* **Phân tích chi tiết:**
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

### Câu 28 (Question 28)
**Những lớp và interface nào sau đây không biên dịch được? (Chọn tất cả các đáp án đúng)**

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

* A. Camel
* B. EatsGrass
* C. Elephant
* D. Eagle
* E. Spider

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B, D**
* **Phân tích chi tiết:**
  * `Camel` (A): Phương thức `travel();` không có thân hàm nhưng lại **không có từ khoá `abstract`** trong khai báo phương thức → Lỗi biên dịch.
  * `EatsGrass` (B): Phương thức `chew()` kết hợp cả hai từ khoá **`private` và `abstract`**. Trong Java, phương thức `abstract` yêu cầu phải được kế thừa để ghi đè, còn `private` lại ngăn cấm kế thừa. Hai từ khoá này triệt tiêu lẫn nhau và bị cấm kết hợp → Lỗi biên dịch.
  * `Eagle` (D): Lớp `Eagle` là concrete class nhưng lại chứa phương thức `abstract`, đồng thời phương thức `soar()` còn thiếu kiểu trả về → Lỗi biên dịch.
  * `Elephant` (C): Abstract class có thể chứa abstract member inner class, hoàn toàn hợp lệ.
  * `Spider` (E): Interface chứa default method có thân hàm, hoàn toàn hợp lệ.
* **Bẫy thi cần nhớ:** Không bao giờ được kết hợp 'private' và 'abstract'; concrete class không được chứa abstract method.
</details>

---

### Câu 29 (Question 29)
**Có bao nhiêu dòng trong chương trình sau chứa lỗi biên dịch?**

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

* A. Không có dòng nào, chương trình in ra 1 tại runtime.
* B. Không có dòng nào, chương trình in ra 3 tại runtime.
* C. Không có dòng nào, nhưng gây ra ClassCastException tại runtime.
* D. 1
* E. 2
* F. 3
* G. 4

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (3)**
* **Phân tích chi tiết:**
  * Chương trình chứa chính xác 3 dòng bị lỗi biên dịch:
  * 1. **Dòng 5 (`this().age = 3;`):** Cú pháp `this()` chỉ được dùng để gọi constructor khác ở dòng đầu tiên của constructor. `this()` không phải là một tham chiếu đối tượng để có thể truy xuất thuộc tính `.age` (phải là `this.age = 3;`).
  * 2. **Dòng 12 (`this().age = 6;`):** Mắc lỗi tương tự như dòng 5.
  * 3. **Dòng 15 (`(Primate)new Orangutan();`):** Lớp `Orangutan` và lớp `Primate` là hai lớp hoàn toàn độc lập, không có quan hệ cha - con trong cây kế thừa (`Orangutan` không `extends Primate`). Khi ép kiểu giữa hai lớp không cùng nhánh kế thừa, trình biên dịch sẽ báo lỗi ngay lập tức: `inconvertible types; cannot cast Orangutan to Primate`.
  * Tổng cộng có 3 dòng bị lỗi biên dịch (dòng 5, dòng 12, dòng 15) → Đáp án đúng là **F**.
* **Bẫy thi cần nhớ:** Cú pháp 'this()' dùng gọi constructor, không thể gọi thuộc tính 'this().field'; trình biên dịch chặn đứng việc ép kiểu giữa 2 class không có quan hệ thừa kế.
</details>

---

### Câu 30 (Question 30)
**Giả sử các lớp sau được khai báo là top-level types trong cùng một tệp mã nguồn (.java), những lớp nào chứa lỗi biên dịch? (Chọn tất cả các đáp án đúng)**

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

* A. Bird
* B. Monkey
* C. EmperorTamarin
* D. Mandrill
* E. Friendly
* F. Silly
* G. Tất cả các lớp đều biên dịch không có lỗi.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, E**
* **Phân tích chi tiết:**
  * `Bird` và lớp lồng nhau `Flamingo` biên dịch hợp lệ vì mệnh đề `permits` có thể được lược bỏ khi lớp con là nested class.
  * `Monkey` và lớp con `Mandrill` biên dịch hợp lệ vì trong cùng một tệp, `permits` có thể lược bỏ, và `Mandrill` có modifier `non-sealed` hợp lệ.
  * **`EmperorTamarin` (C):** Kế thừa từ sealed class `Monkey` nhưng **thiếu modifier bắt buộc** (`final`, `sealed`, hoặc `non-sealed`) → Lỗi biên dịch.
  * **`Friendly` (E):** Khai báo `permits Silly`, nhưng lớp `Silly` lại khai báo là `final class Silly {}` mà **không hề có `extends Friendly`**! Lớp được cấp phép trong `permits` bắt buộc phải kế thừa sealed class tương ứng → Lỗi biên dịch tại `Friendly`.
  * Lớp `Silly` tự nó là một lớp final bình thường, không chứa lỗi cú pháp.
  * Do đó, các lớp chứa lỗi biên dịch là `EmperorTamarin` và `Friendly` → Chọn **C và E**.
* **Bẫy thi cần nhớ:** Lớp con của sealed class phải có 1 trong 3 modifier (final/sealed/non-sealed); các lớp được liệt kê trong 'permits' bắt buộc phải thực sự kế thừa sealed class đó.
</details>

---
