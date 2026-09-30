# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chapter 6: Class Design

> **Nguồn trích dẫn:** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Trang 569–585).  
> **Số lượng:** 26 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết (Trang 1353–1364).  
> **Cách học:** Bạn hãy tự đọc đề và suy luận đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và khắc sâu các bẫy thi của Oracle.

---

### Câu 1 (Question 1)
**Đoạn code nào sau đây có thể thay thế vào dòng 1 hoặc dòng 2 để chương trình in ra `2`?**

```java
public class BirdSeed {
   private int numberBags;
   boolean call;
 
   public BirdSeed() {
      // LINE 1
      // LINE 2
      this.call = false;
   }
   public BirdSeed(int numberBags) {
      this.numberBags = numberBags;
   }
   public static void main(String[] args) {
      var seed = new BirdSeed();
      System.out.println(seed.numberBags);
   } }
```

* A. Thay dòng 1 bằng `BirdSeed(2);`
* B. Thay dòng 2 bằng `BirdSeed(2);`
* C. Thay dòng 1 bằng `new BirdSeed(2);`
* D. Thay dòng 2 bằng `new BirdSeed(2);`
* E. Thay dòng 1 bằng `this(2);`
* F. Thay dòng 2 bằng `this(2);`
* G. Code đã in ra `2` mà không cần thay đổi gì.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (Thay dòng 1 bằng `this(2);`)**
* **Giải thích chuyên sâu:**
  * Để gọi một constructor nạp chồng khác trong cùng một lớp, ta bắt buộc phải dùng cú pháp `this(...)`. Không thể gọi tên constructor trực tiếp như một hàm thông thường (`BirdSeed(2);` → Lỗi biên dịch, loại A và B).
  * Lời gọi `new BirdSeed(2);` (câu C và D) sẽ tạo ra một đối tượng hoàn toàn mới trên Heap rồi bỏ rơi nó, không hề gán giá trị cho trường `numberBags` của đối tượng hiện tại, nên chương trình sẽ in ra `0`, không phải `2`.
  * Lời gọi `this(...)` **bắt buộc phải là dòng lệnh đầu tiên** trong thân constructor. Do đó chỉ có thể đặt tại **dòng 1** (E đúng, F sai).
  * Mã ban đầu in ra `0` (giá trị mặc định của `int`), nên G sai.
</details>

---

### Câu 2 (Question 2)
**Cặp bổ từ (*modifier pairs*) nào sau đây có thể được sử dụng cùng nhau trong một khai báo phương thức? (Chọn tất cả các đáp án đúng)**

* A. `static` và `final`
* B. `private` và `static`
* C. `static` và `abstract`
* D. `private` và `abstract`
* E. `abstract` và `final`
* F. `private` và `final`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B, F**
* **Giải thích chuyên sâu:**
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

### Câu 3 (Question 3)
**Những khẳng định nào sau đây về phương thức là ĐÚNG? (Chọn tất cả các đáp án đúng)**

* A. Các phương thức nạp chồng (overloaded methods) phải có cùng chữ ký phương thức (signature).
* B. Các phương thức ghi đè (overridden methods) phải có cùng chữ ký phương thức.
* C. Các phương thức bị ẩn (hidden methods) phải có cùng chữ ký phương thức.
* D. Các phương thức nạp chồng phải có cùng kiểu trả về.
* E. Các phương thức ghi đè phải có cùng kiểu trả về.
* F. Các phương thức bị ẩn phải có cùng kiểu trả về.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, C**
* **Giải thích chuyên sâu:**
  * **A sai:** Chữ ký phương thức (*Method Signature*) gồm tên hàm + danh sách kiểu tham số. Các phương thức nạp chồng (*Overloaded*) bắt buộc phải có **danh sách tham số khác nhau**, do đó chữ ký của chúng là khác nhau.
  * **B và C đúng:** Cả phương thức ghi đè (*Overridden instance methods*) và phương thức ẩn (*Hidden static methods*) bắt buộc phải có **cùng chữ ký phương thức** (cùng tên và danh sách tham số giống hệt nhau).
  * **D, E, F sai:** Không phương thức nào bắt buộc phải có kiểu trả về giống hệt nhau:
    * Phương thức nạp chồng có thể có kiểu trả về hoàn toàn tùy ý.
    * Phương thức ghi đè và ẩn phương thức chỉ cần có **kiểu trả về đồng biến (Covariant return types)**, tức là kiểu trả về của con có thể là lớp con của kiểu trả về của cha, không bắt buộc phải giống hệt nhau.
</details>

---

### Câu 4 (Question 4)
**Output của chương trình sau là gì?**

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
* E. Code sẽ biên dịch được nếu thay đổi dòng 7.
* F. Code sẽ biên dịch được nếu thay đổi dòng 8 hoặc dòng 9 (chèn gọi `super(int)`).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F**
* **Giải thích chuyên sâu:**
  * Lớp cha `Mammal` đã tự định nghĩa constructor `public Mammal(int age)` và **không có constructor không tham số**.
  * Lớp con `Platypus` có constructor `public Platypus()`. Vì không có lời gọi `this(...)` hay `super(...)` ở dòng đầu tiên, trình biên dịch sẽ tự động chèn `super();` vào đầu constructor này.
  * Khi gọi `super();`, trình biên dịch không tìm thấy constructor không tham số trong `Mammal` → **Báo lỗi biên dịch ngay tại constructor của `Platypus`**!
  * Do đó code không biên dịch được. Để sửa, ta phải thay đổi constructor của `Platypus` để gọi tường minh `super(5);` → F đúng.
  * Lưu ý về dòng 7: Phương thức `sneeze()` trong `Mammal` là `private`, nên nó không được kế thừa xuống `Platypus`. Phương thức `int sneeze()` ở dòng 7 chỉ là một phương thức mới độc lập, không phải ghi đè, nên dòng 7 hoàn toàn hợp lệ (E sai).
</details>

---

### Câu 5 (Question 5)
**Đoạn code nào sau đây có thể điền vào constructor để chương trình in ra `50`?**

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
* F. Code không thể biên dịch bất kể chèn đoạn mã nào.
* G. Không có đáp án nào ở trên.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (`super.numSpots = numSpots;`)**
* **Giải thích chuyên sâu (Bẫy Ẩn Biến - Variable Hiding):**
  * Trong lớp `Cheetah`, biến `int numSpots` che khuất (*hides*) biến `int numSpots` của lớp cha `Speedster`. Trong bộ nhớ đối tượng `Cheetah` trên Heap thực chất có cả 2 biến `numSpots` riêng biệt.
  * Trong hàm `main`: Biến tham chiếu `s` được khai báo với kiểu **`Speedster`** (`Speedster s = new Cheetah(50);`).
  * **Quy tắc truy cập biến:** Việc truy cập trường dữ liệu `s.numSpots` được quyết định dựa vào **kiểu tham chiếu lúc biên dịch** (`Speedster`), chứ không phụ thuộc vào đối tượng thực tế trên Heap! Do đó, `s.numSpots` sẽ đọc giá trị của trường `numSpots` thuộc về lớp **`Speedster`**!
  * Để `s.numSpots` in ra `50`, constructor của `Cheetah` phải gán giá trị tham số `50` vào trường `numSpots` của lớp cha `Speedster`, cú pháp đúng là: `super.numSpots = numSpots;` → Chọn E.
  * Nếu chọn C (`this.numSpots = numSpots;`), biến của `Cheetah` được gán 50 nhưng biến của `Speedster` vẫn là `0` → in ra `0`.
</details>

---

### Câu 6 (Question 6)
**Những lớp nào sau đây khai báo lớp bất biến (immutable classes)? (Chọn tất cả các đáp án đúng)**

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
* F. Không có lớp nào ở trên.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D, E**
* **Giải thích chuyên sâu:**
  * `Moose`: **Không biên dịch được** vì biến `final int antlers` không được gán giá trị tại khai báo, initializer hay constructor.
  * `Caribou` và `Reindeer`: Không phải lớp bất biến vì **không được đánh dấu `final`**, các lớp con có thể kế thừa và bổ sung các trường khả biến (mutator).
  * `Elk`: Đạt chuẩn lớp bất biến! Lớp được đánh dấu `final`, không có trường nào có thể bị sửa đổi (một lớp không có trường dữ liệu vẫn được coi là immutable).
  * `Deer`: Đạt chuẩn lớp bất biến! Lớp là `final`, trường `o` là `private final` và không cung cấp setter nào.
</details>

---

### Câu 7 (Question 7)
**Output của đoạn code sau là gì?**

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
* E. Code không biên dịch được do dòng 5.
* F. Code không biên dịch được do dòng 9.
* G. Không có đáp án nào ở trên.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A (`SpiderSpiderArthropod`)**
* **Giải thích chuyên sâu:**
  * Lớp `Arthropod` nạp chồng 2 phương thức: `printName(long)` và `printName(int)`.
  * Tại lớp `Spider`: Phương thức `protected void printName(int)` ở dòng 9 đã **ghi đè (override)** thành công phương thức `void printName(int)` ở dòng 5 (vì cùng chữ ký và quyền `protected` rộng hơn package access).
  * Trong hàm `main`: Biến tham chiếu `a` có kiểu `Arthropod`, nhưng đối tượng thực tế trên Heap là `Spider`. Nhờ cơ chế đa hình động (*Virtual Method Invocation*), bất kỳ lời gọi nào khớp với `printName(int)` sẽ thực thi phiên bản của `Spider`!
  * **Dòng 14 `a.printName((short)4)`:** Giá trị `short` được nới rộng kiểu nguyên thủy sang `int` gần nhất → gọi phương thức ghi đè `printName(int)` của `Spider` → in ra **`Spider`**.
  * **Dòng 15 `a.printName(4)`:** Giá trị `int` khớp chính xác → gọi `printName(int)` của `Spider` → in ra **`Spider`**.
  * **Dòng 16 `a.printName(5L)`:** Giá trị `5L` có kiểu `long`, khớp với `printName(long)` của `Arthropod` (phương thức này không bị Spider ghi đè) → in ra **`Arthropod`**.
  * Kết quả: `SpiderSpiderArthropod`.
</details>

---

### Câu 8 (Question 8)
**Kết quả của đoạn code sau là gì?**

```java
class Plant {
   static { System.out.print("plant-static "); }
   { System.out.print("plant-instance "); }
   public Plant() {
      System.out.print("plant-constructor ");
   }
}
public class Tree extends Plant {
   static { System.out.print("tree-static "); }
   { System.out.print("tree-instance "); }
   public Tree() {
      System.out.print("tree-constructor ");
   }
   public static void main(String[] args) {
      new Tree();
   }
}
```

* A. `plant-static plant-instance plant-constructor tree-static tree-instance tree-constructor`
* B. `tree-static plant-static plant-instance plant-constructor tree-instance tree-constructor`
* C. `plant-instance plant-constructor tree-instance tree-constructor plant-static tree-static`
* D. `plant-static tree-static plant-instance plant-constructor tree-instance tree-constructor`
* E. `plant-static tree-static tree-instance tree-constructor plant-instance plant-constructor`
* F. Code không biên dịch được.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Giải thích chuyên sâu (Quy trình Thứ tự khởi tạo):**
  1. **Nạp lớp (Static):** Lớp `Tree` có lớp cha là `Plant`. Khởi tạo static của cha trước, con sau:
     * `Plant` static initializer: in ra `"plant-static "`.
     * `Tree` static initializer: in ra `"tree-static "`.
  2. **Khởi tạo thể hiện (Instance):** Lệnh `new Tree()` gọi constructor của `Tree`. Dòng đầu của constructor `Tree()` tự động gọi `super()`.
     * Khởi tạo thể hiện của `Plant`: Khối `{}` chạy trước in ra `"plant-instance "`, sau đó thân constructor `Plant()` chạy in ra `"plant-constructor "`.
     * Khởi tạo thể hiện của `Tree`: Khối `{}` chạy trước in ra `"tree-instance "`, sau đó thân constructor `Tree()` chạy in ra `"tree-constructor "`.
  * Chuỗi in ra hoàn chỉnh: `plant-static tree-static plant-instance plant-constructor tree-instance tree-constructor`.
</details>

---

### Câu 9 (Question 9)
**Những khẳng định nào sau đây về phương thức ghi đè (overridden method) là ĐÚNG? (Chọn tất cả các đáp án đúng)**

* A. Phương thức ghi đè có thể có chữ ký đồng biến (covariant signature).
* B. Phương thức ghi đè không được khai báo checked exception mới hoặc rộng hơn phương thức lớp cha.
* C. Phương thức ghi đè bắt buộc phải có phạm vi truy cập nghiêm ngặt hơn phương thức lớp cha.
* D. Phương thức ghi đè có thể khai báo checked exception rộng hơn phương thức lớp cha.
* E. Nếu phương thức kế thừa trả về `void`, thì phương thức ghi đè bắt buộc phải trả về `void`.
* F. Không có đáp án nào ở trên.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, E**
* **Giải thích chuyên sâu:**
  * **A sai:** Chữ ký phương thức (*Method Signature*) bắt buộc phải **giống hệt nhau**, trong Java hoàn toàn không tồn tại khái niệm "covariant signature".
  * **B đúng, D sai:** Quy tắc 3 của Overriding nêu rõ: Phương thức lớp con không được phép ném checked exception mới hoặc có phạm vi bao quát rộng hơn phương thức của lớp cha.
  * **C sai:** Phạm vi truy cập ở con phải **rộng bằng hoặc rộng hơn** ở cha (lỏng hơn), không được phép nghiêm ngặt (hẹp) hơn.
  * **E đúng:** Chỉ có kiểu đối tượng mới có quan hệ đồng biến cha/con. Kiểu `void` không phải là đối tượng, nên phương thức ghi đè bắt buộc phải có kiểu trả về là `void`.
</details>

---

### Câu 10 (Question 10)
**Cặp lệnh nào sau đây khi chèn vào các chỗ trống sẽ cho phép code biên dịch thành công? (Chọn tất cả các đáp án đúng)**

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

* A. `this(3);` tại dòng 3, và `this("");` tại dòng 14.
* B. `this();` tại dòng 3, và `super(1);` tại dòng 14.
* C. `this((short)1);` tại dòng 3, và `this(null);` tại dòng 14.
* D. `super();` tại dòng 3, và `super();` tại dòng 14.
* E. `this(2L);` tại dòng 3, và `super((short)2);` tại dòng 14.
* F. `this(5);` tại dòng 3, và `super(null);` tại dòng 14.
* G. Xóa bỏ cả dòng 3 và dòng 14.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C**
* **Giải thích chuyên sâu:**
  * **A đúng:** Dòng 3 `this(3)` gọi constructor `Howler(int)` ở dòng 5 (phương thức trong cùng lớp có quyền gọi constructor `private`). Dòng 14 `this("")` gọi constructor `Wolf(String)` ở dòng 10.
  * **C đúng:** Dòng 3 `this((short)1)` được nới rộng kiểu tự động sang `int` gọi `Howler(int)`. Dòng 14 `this(null)` khớp với `Wolf(String)` (vì `String` nhận được `null`).
  * **B sai:** Lớp `Howler` không có constructor không tham số, nên dòng 3 `this()` không tìm thấy constructor.
  * **D và G sai:** Lớp cha `Howler` không có constructor không tham số, nên gọi `super()` ở dòng 14 hay để compiler tự động chèn `super();` (khi xóa dòng 14) đều gây lỗi biên dịch.
  * **E sai:** `this(2L)` ở dòng 3 tự gọi chính constructor `Howler(long)` → Lỗi đệ quy vòng tròn (*recursive constructor invocation*).
</details>

---

### Câu 11 (Question 11)
**Kết quả của đoạn code sau là gì?**

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
* F. Code không biên dịch được.
* G. Ném ra ngoại lệ tại thời điểm runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C (`tacbf`)**
* **Giải thích chuyên sâu:**
  * Dòng 16: `new PolarBear()` tạo đối tượng đầu tiên. Khối khai báo biến và initializer chạy trước: `"t"` + `"a"` + `"c"` = `"tac"`. Sau đó constructor `PolarBear()` (dòng 5) chạy nối thêm `"b"` → biến `value` thành `"tacb"`.
  * Dòng 17: `bear = new PolarBear("f")` tạo đối tượng thứ hai gán đè vào biến `bear`:
    * Khối initializer của đối tượng mới chạy trước: tạo lại `"tac"`.
    * Lời gọi constructor: Tham số là literal `"f"` (kiểu `String`). Trình biên dịch ưu tiên chọn constructor nhận `String s` (dòng 8) vì `String` cụ thể hơn `CharSequence`.
    * Dòng 9: Constructor này gọi `this()` → chạy constructor `PolarBear()` (dòng 5) nối thêm `"b"` → chuỗi thành `"tacb"`.
    * Dòng 10: Nối thêm `s` (`"f"`) → chuỗi thành `"tacbf"`.
  * Dòng 18 ép kiểu và in trường `value` của đối tượng thứ hai → in ra **`tacbf`**.
</details>

---

### Câu 12 (Question 12)
**Có bao nhiêu dòng trong chương trình sau chứa lỗi biên dịch?**

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

* A. 0
* B. 1
* C. 2
* D. 3
* E. 4
* F. 5

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C (Có đúng 2 dòng chứa lỗi biên dịch: dòng 8 và dòng 9)**
* **Giải thích chuyên sâu:**
  * **Lỗi tại dòng 8:** Lớp cha `Rodent` có constructor nhận `Integer`, không có no-arg constructor. Lớp `Beaver` không khai báo constructor nào nên compiler tự chèn constructor mặc định gọi `super();` → Báo lỗi biên dịch tại dòng 8.
  * **Lỗi tại dòng 9:** Dòng 9 có tới 2 lỗi biên dịch:
    1. Phương thức cha `chew()` là `static`, nhưng phương thức con lại là phương thức thể hiện (instance) → Vi phạm quy tắc Method Hiding (không thể override một static method thành instance method).
    2. Kiểu trả về ở cha là `Integer`, ở con là `Number`. `Number` là lớp cha của `Integer` (không phải covariant return type, ở con phải là subtype chứ không được là supertype) → Lỗi biên dịch.
  * Mặc dù có 3 lỗi nhưng các lỗi nằm trên **đúng 2 dòng (dòng 8 và dòng 9)** → Chọn C.
</details>

---

### Câu 13 (Question 13)
**Những lớp nào sau đây biên dịch thành công VÀ sẽ được trình biên dịch tự động chèn một constructor mặc định (default constructor)? (Chọn tất cả các đáp án đúng)**

* A. `public class Bird {}`
* B. `public class Bird { public bird() {} }`
* C. `public class Bird { public bird(String name) {} }`
* D. `public class Bird { public Bird() {} }`
* E. `public class Bird { Bird(String name) {} }`
* F. `public class Bird { private Bird(int age) {} }`
* G. `public class Bird { public Bird bird() { return null; } }`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, G**
* **Giải thích chuyên sâu:**
  * Trình biên dịch chỉ tự động chèn constructor mặc định khi lớp biên dịch được và **hoàn toàn không có bất kỳ constructor nào do người dùng định nghĩa**.
  * **A đúng:** Lớp rỗng, không có constructor → compiler chèn constructor mặc định.
  * **G đúng:** `public Bird bird() { return null; }` có kiểu trả về là `Bird` và tên hàm là `bird` (chữ thường), đây là một **phương thức thông thường**, không phải constructor. Lớp không có constructor nào → compiler tự động chèn constructor mặc định.
  * **B và C không biên dịch được:** Tên `bird()` không trùng chữ hoa với lớp `Bird`, lại không có kiểu trả về → compiler coi là phương thức thiếu kiểu trả về.
  * **D, E, F:** Đều đã tự định nghĩa ít nhất 1 constructor hợp lệ → compiler **không tự động chèn** constructor mặc định nữa.
</details>

---

### Câu 14 (Question 14)
**Những khẳng định nào sau đây về kế thừa trong Java là ĐÚNG? (Chọn tất cả các đáp án đúng)**

* A. Một lớp có thể kế thừa trực tiếp bất kỳ số lượng lớp nào.
* B. Một lớp có thể hiện thực (implement) bất kỳ số lượng interface nào.
* C. Tất cả các biến đều kế thừa từ `java.lang.Object`.
* D. Nếu lớp A được kế thừa bởi B, thì B là lớp cha (superclass) của A.
* E. Nếu lớp C hiện thực interface D, thì C là kiểu con (subtype) của D.
* F. Đa kế thừa (Multiple inheritance) là đặc tính của một lớp có nhiều hơn một lớp cha trực tiếp.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, E, F**
* **Giải thích chuyên sâu:**
  * **A sai:** Java chỉ hỗ trợ đơn kế thừa lớp (single class inheritance).
  * **B đúng:** Một lớp có thể hiện thực nhiều interface phân tách bởi dấu phẩy (`implements A, B, C`).
  * **C sai:** Các biến kiểu nguyên thủy (`int`, `boolean`...) không kế thừa từ `java.lang.Object`.
  * **D sai:** B kế thừa A thì B là lớp con (*subclass*), A mới là lớp cha (*superclass*).
  * **E đúng:** Lớp hiện thực một interface thì nó là một kiểu con (*subtype*) của interface đó.
  * **F đúng:** Đây là định nghĩa chính xác của đa kế thừa (mà Java không hỗ trợ đối với lớp).
</details>

---

### Câu 15 (Question 15)
**Nhận định nào sau đây về chương trình dưới đây là ĐÚNG?**

```java
abstract class Nocturnal {
   boolean isBlind();
}
public class Owl extends Nocturnal {
   public boolean isBlind() { return false; }
   public static void main(String[] args) {
      var o = new Owl();
      System.out.println(o.isBlind());
   } }
```

* A. Chương trình biên dịch và in ra `false`.
* B. Chương trình biên dịch và in ra `true`.
* C. Chương trình không biên dịch được vì phương thức `isBlind()` trong `Nocturnal` thiếu từ khóa `abstract`.
* D. Chương trình không biên dịch được vì `Owl` không thể ghi đè phương thức package-private bằng `public`.
* E. Chương trình không biên dịch được vì lớp `Owl` không có constructor.
* F. Chương trình ném ra ngoại lệ tại thời điểm runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * Trong lớp trừu tượng `Nocturnal`, phương thức `boolean isBlind();` kết thúc bằng dấu chấm phẩy mà không có thân hàm `{}`.
  * Để một phương thức không có thân hàm trong một lớp abstract, nó **bắt buộc phải có từ khóa `abstract`** (`abstract boolean isBlind();`).
  * Vì thiếu từ khóa `abstract`, trình biên dịch sẽ báo lỗi: `missing method body, or declare abstract` → Chọn C.
</details>

---

### Câu 16 (Question 16)
**Kết quả của đoạn chương trình sau là gì?**

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
* G. Code không biên dịch được.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D (`uq uq uqcrcrm`)**
* **Giải thích chuyên sâu (Từng bước Thứ tự khởi tạo):**
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

### Câu 17 (Question 17)
**Những nhận định nào sau đây là ĐÚNG? (Chọn tất cả các đáp án đúng)**

* A. `this()` có thể được gọi từ bất kỳ vị trí nào bên trong constructor.
* B. `this()` có thể được gọi từ bất kỳ vị trí nào bên trong một phương thức thể hiện (instance method).
* C. `this.variableName` có thể được gọi từ bất kỳ phương thức thể hiện nào trong lớp.
* D. `this.variableName` có thể được gọi từ bất kỳ phương thức static nào trong lớp.
* E. Bạn có thể gọi constructor mặc định do trình biên dịch sinh ra bằng `this()`.
* F. Bạn có thể truy cập constructor `private` từ phương thức `main()` nằm trong cùng một lớp.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, F**
* **Giải thích chuyên sâu:**
  * **C đúng, D sai:** `this` đại diện cho thể hiện hiện tại, có thể dùng trong các phương thức thể hiện, constructor, khối initializer thể hiện. `this` không thể dùng trong ngữ cảnh static (như static method hay static block).
  * **F đúng:** Phương thức `main()` dù là static nhưng nếu nằm trong cùng một lớp thì vẫn có toàn quyền gọi các thành phần `private` (kể cả constructor private) của chính lớp đó.
  * **A và B sai:** `this()` gọi constructor nạp chồng chỉ được phép đứng ở **dòng lệnh đầu tiên** của một constructor; tuyệt đối không được gọi trong phương thức thường.
  * **E sai:** Compiler chỉ sinh constructor mặc định khi lớp không có bất kỳ constructor nào. Trong khi đó, `this()` chỉ có thể được gọi từ bên trong một constructor của lớp đó. Do đó không bao giờ có trường hợp gọi được constructor mặc định của compiler bằng `this()`.
</details>

---

### Câu 18 (Question 18)
**Những nhận định nào sau đây về các lớp dưới đây là ĐÚNG? (Chọn tất cả các đáp án đúng)**

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

* A. Phương thức `eat()` trong `Mammal` được ghi đè hợp lệ tại dòng 7.
* B. Phương thức `eat()` trong `Mammal` được nạp chồng hợp lệ tại dòng 7.
* C. Phương thức `drink()` trong `Mammal` được ghi đè hợp lệ tại dòng 10.
* D. Phương thức `drink()` trong `Mammal` được ẩn (hidden) hợp lệ tại dòng 10.
* E. Phương thức `dance()` trong `Mammal` được ghi đè hợp lệ tại dòng 11.
* F. Phương thức `dance()` trong `Mammal` được nạp chồng (overloaded) hợp lệ tại dòng 11.
* G. Phương thức `eat()` trong `Primate` được ẩn hợp lệ tại dòng 12.
* H. Phương thức `eat()` trong `Primate` được nạp chồng hợp lệ tại dòng 12.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D, F**
* **Giải thích chuyên sâu:**
  * **Dòng 2 & 7:** `eat()` trong `Mammal` là `private`, không được kế thừa xuống `Primate`. Do đó phương thức ở dòng 7 là phương thức hoàn toàn độc lập, không phải ghi đè hay nạp chồng (A và B sai).
  * **Dòng 3 & 10 (D đúng, C sai):** Cả hai phương thức `drink()` đều là `static` và có cùng chữ ký `()` → Đây là **Method Hiding**, không phải overriding. Phiên bản ở dòng 10 ném thêm `RuntimeException` (unchecked exception) nên hoàn toàn hợp lệ.
  * **Dòng 4 & 11 (F đúng, E sai):** `dance(String)` ở cha và `dance(CharSequence)` ở con có **kiểu tham số khác nhau** (`String` vs `CharSequence`). Vì chữ ký khác nhau nên đây là **Method Overloading**, không phải overriding!
  * **Dòng 12:** Cùng chữ ký `eat(String)` với dòng 7 nhưng kiểu trả về ở con là `int` trong khi ở cha là `void` (không đồng biến) → Dòng 12 bị lỗi biên dịch (G và H sai).
</details>

---

### Câu 19 (Question 19)
**Output của đoạn code sau là gì?**

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
* E. Code không biên dịch được do dòng 3.
* F. Không có đáp án nào ở trên (Code không biên dịch được do dòng 9).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (Code không biên dịch được do dòng 9)**
* **Giải thích chuyên sâu:**
  * Lớp cha `Reptile` chỉ định nghĩa một constructor có tham số `Reptile(int hatch)`. Do đó, lớp `Reptile` không có constructor không tham số.
  * Constructor của lớp con `Lizard` ở dòng 9 không có lời gọi `this(...)` hay `super(...)` tường minh, do đó trình biên dịch tự động chèn `super();` vào dòng đầu tiên.
  * Vì `Reptile` không có constructor không tham số, trình biên dịch báo lỗi tại dòng 9: `constructor Reptile in class Reptile cannot be applied to given types; required: int; found: no arguments`.
  * Nếu sửa dòng 9 thành `public Lizard(int hatch) { super(hatch); }`, chương trình sẽ biên dịch và in ra `BALizard`. Nhưng ở trạng thái hiện tại, code bị lỗi biên dịch → Chọn F.
</details>

---

### Câu 20 (Question 20)
**Nhận định nào sau đây về chương trình dưới đây là ĐÚNG?**

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

* A. Một dòng chứa lỗi biên dịch.
* B. Hai dòng chứa lỗi biên dịch.
* C. Ba dòng chứa lỗi biên dịch.
* D. Code biên dịch nhưng ném `ClassCastException` tại runtime.
* E. Chương trình biên dịch và in ra `3`.
* F. Chương trình biên dịch và in ra `0`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (Chương trình biên dịch và in ra `3`)**
* **Giải thích chuyên sâu:**
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

### Câu 21 (Question 21)
**Những đặc tính nào sau đây là của một lớp bất biến (immutable object)? (Chọn tất cả các đáp án đúng)**

* A. Phải chứa các phương thức setter để cập nhật giá trị.
* B. Lớp phải được đánh dấu `final` hoặc chỉ chứa các constructor `private`.
* C. Không thể chứa bất kỳ biến thể hiện (instance variables) nào.
* D. Lớp bắt buộc phải được đánh dấu là `static`.
* E. Không thể chứa bất kỳ biến static nào.
* F. Tất cả các constructor bắt buộc phải là `private`.
* G. Người gọi có thể truy cập các phần tử khả biến của đối tượng bất biến miễn là họ không có khả năng sửa đổi chúng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, G**
* **Giải thích chuyên sâu:**
  * **B đúng:** Để đảm bảo tính bất biến, lớp phải ngăn chặn việc bị lớp con kế thừa và ghi đè phương thức. Điều này đạt được bằng cách gắn từ khóa `final` cho lớp, hoặc đặt tất cả constructor là `private` và cung cấp factory method.
  * **G đúng:** Đối tượng bất biến có thể chứa các đối tượng khả biến (như `ArrayList`), miễn là không cho phép người ngoài sửa đổi chúng (ví dụ: trả về `unmodifiableList` hoặc bản sao phòng thủ).
  * **A sai:** Lớp bất biến tuyệt đối không có phương thức setter làm thay đổi trạng thái.
  * **C và E sai:** Lớp bất biến hoàn toàn có thể chứa biến thể hiện (`private final`) và biến static.
  * **D sai:** Top-level class không thể khai báo `static`.
  * **F sai:** Constructor có thể là `public` miễn là lớp được đánh dấu `final`.
</details>

---

### Câu 22 (Question 22)
**Chương trình sau in ra kết quả gì?**

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
* E. Code không biên dịch được.
* F. Không có đáp án nào ở trên.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D (`Olivia Sophia`)**
* **Giải thích chuyên sâu (Phân tích Bẫy Variable Hiding vs Method Overriding):**
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

### Câu 23 (Question 23)
**Output của chương trình sau là gì?**

```java
1:  class Canine {
2:     public Canine(boolean t) { logger.append("a"); }
3:     public Canine() { logger.append("q"); }
4:     private StringBuilder logger = new StringBuilder();
5:     protected void print(String v) { logger.append(v); }
6:     protected String view() { return logger.toString(); }
7:  }
8:  class Fox extends Canine {
9:     public Fox(long x) { print("p"); }
10:    public Fox(String name) {
11:       this(2);
12:       print("z");
13:    } }
14: public class Fennec extends Fox {
15:    public Fennec(int e) {
16:       super("tails");
17:       print("j");
18:    }
19:    public Fennec(short f) {
20:       super("eevee");
21:       print("m");
22:    }
23:    public static void main(String... unused) {
24:       System.out.println(new Fennec(1).view());
25:    } }
```

* A. `qpz`
* B. `qpzj`
* C. `jzpa`
* D. `apj`
* E. `apjm`
* F. Code không biên dịch được.
* G. Không có đáp án nào ở trên.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B (`qpzj`)**
* **Giải thích chuyên sâu (Lần vết chuỗi Constructor Top-Down):**
  1. Dòng 24: Gọi `new Fennec(1)` (đối số kiểu `int`).
  2. Constructor `Fennec(int)` (dòng 15) gọi `super("tails")`.
  3. Chuyển sang `Fox(String)` (dòng 10) → gặp dòng 11: `this(2)`.
  4. Chuyển sang `Fox(long)` (dòng 9): Dòng đầu không viết gì nên compiler tự chèn `super();`.
  5. Chuyển lên lớp cha cao nhất `Canine()` (dòng 3): Thêm `"q"` vào logger.
  6. Mở ngược lại chuỗi constructor:
     * Thân `Fox(long)` tiếp tục: dòng 9 thêm `"p"`.
     * Thân `Fox(String)` tiếp tục: dòng 12 thêm `"z"`.
     * Thân `Fennec(int)` tiếp tục: dòng 17 thêm `"j"`.
  * Kết quả tích lũy trong logger là: **`qpzj`**.
</details>

---

### Câu 24 (Question 24)
**Chương trình sau in ra kết quả gì?**

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
* E. Code không biên dịch được.
* F. Kết quả không thể xác định cho đến lúc runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C (`182493`)**
* **Giải thích chuyên sâu:**
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

### Câu 25 (Question 25)
**Những khẳng định nào sau đây về một lớp cụ thể (concrete class) là ĐÚNG? (Chọn tất cả các đáp án đúng)**

* A. Một concrete class có thể được khai báo là `abstract`.
* B. Một concrete class bắt buộc phải hiện thực (implement) tất cả các phương thức abstract kế thừa.
* C. Một concrete class có thể được đánh dấu là `final`.
* D. Một concrete class bắt buộc phải là một lớp bất biến (immutable).
* E. Một phương thức cụ thể hiện thực một phương thức abstract bắt buộc phải khớp chính xác hoàn toàn khai báo của phương thức abstract đó.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, C**
* **Giải thích chuyên sâu:**
  * **B đúng:** Định nghĩa của concrete class là lớp có thể tạo đối tượng được bằng `new`, do đó nó bắt buộc phải cung cấp phần thân hiện thực cho mọi phương thức abstract mà nó kế thừa.
  * **C đúng:** Concrete class hoàn toàn có thể được đánh dấu là `final` (để cấm kế thừa).
  * **A sai:** Concrete class theo định nghĩa là lớp không phải `abstract`.
  * **D sai:** Concrete class không bắt buộc phải là immutable (hầu hết các lớp là mutable).
  * **E sai:** Khi hiện thực phương thức abstract, phương thức ở lớp con chỉ cần tuân thủ quy tắc ghi đè (overriding), ví dụ có thể mở rộng quyền truy cập hoặc sử dụng kiểu trả về đồng biến (covariant return type), không bắt buộc phải khớp chính xác 100%.
</details>

---

### Câu 26 (Question 26)
**Output của đoạn code sau là gì?**

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
* C. Code không biên dịch được do dòng 4.
* D. Code không biên dịch được do dòng 8.
* E. Code không biên dịch được do dòng 11.
* F. Code không biên dịch được do dòng 12.
* G. Code không biên dịch được do dòng 17.
* H. Không có đáp án nào ở trên.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D (Code không biên dịch được do dòng 8)**
* **Giải thích chuyên sâu:**
  * Dòng 7: `Whale whale = new Orca();` khai báo biến `whale` với **kiểu tham chiếu là `Whale`**.
  * Dòng 8: Lệnh `whale.dive(3);` cố gắng gọi phương thức `dive(int)`.
  * **Quy tắc biên dịch:** Tại thời điểm biên dịch (*compile-time*), trình biên dịch kiểm tra xem trong lớp `Whale` có phương thức nào tên là `dive` nhận tham số số nguyên hay không.
  * Trong lớp `Whale` **chỉ có duy nhất phương thức `public abstract void dive();` không nhận tham số**. Phương thức `dive(int... depth)` chỉ tồn tại ở lớp con `Orca`, lớp `Whale` hoàn toàn không biết đến phương thức này!
  * Do đó, trình biên dịch báo lỗi ngay tại dòng 8: `method dive in class Whale cannot be applied to given types; required: no arguments; found: int` → Chọn D.
</details>
