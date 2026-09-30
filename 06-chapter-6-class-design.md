# Chương 6: Class Design (Thiết Kế Lớp)

> **Tài liệu tham khảo chính:** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff.  
> **Mục tiêu kỳ thi Oracle 1Z0-830:**
> * Hiểu và vận dụng mô hình kế thừa đơn trong Java, lớp gốc `java.lang.Object`, các bổ từ lớp (*Class Modifiers*).
> * Thiết kế và triển khai Constructor: Constructor mặc định, gọi nạp chồng với `this(...)`, gọi constructor cha với `super(...)`.
> * Nắm vững thứ tự khởi tạo đối tượng hoàn chỉnh (*Order of Initialization*): Khởi tạo lớp cha/con, biến static, khối initializer và constructor.
> * Kế thừa thành viên và 4 quy tắc vàng của ghi đè phương thức (*Method Overriding*), kiểu trả về đồng biến (*Covariant Return Types*), quy tắc ngoại lệ checked.
> * Phân biệt ẩn phương thức static (*Method Hiding*) và ẩn trường dữ liệu (*Variable Hiding*), cơ chế đa hình động (*Polymorphism / Virtual Method Invocation*) so với truy cập biến theo kiểu tham chiếu lúc biên dịch.
> * Khai báo và sử dụng lớp trừu tượng (*Abstract Classes*) và phương thức trừu tượng (*Abstract Methods*), các ràng buộc bổ từ không tương thích.
> * Thiết kế đối tượng bất biến (*Immutable Objects*) và kỹ thuật sao chép phòng thủ (*Defensive Copying*).

---

## 1. Hiểu Về Kế Thừa (Understanding Inheritance)

### 1.1. Kế Thừa Đơn Trong Java
* **Kế thừa (Inheritance)** là cơ chế cho phép một lớp con (*subclass / child class*) tái sử dụng các trường dữ liệu và phương thức từ một lớp cha (*superclass / parent class*) bằng từ khóa `extends`.
* Java áp dụng mô hình **kế thừa đơn (Single Inheritance)** cho các lớp: Mỗi lớp trong Java chỉ được phép kế thừa trực tiếp từ **duy nhất một lớp cha**.
* **Lớp gốc `java.lang.Object`:** Mọi lớp trong Java (ngoại trừ chính lớp `Object`) đều có đúng một lớp cha trực tiếp. Nếu bạn không khai báo mệnh đề `extends`, trình biên dịch Java sẽ tự động chèn `extends java.lang.Object`.

```java
public class Animal {} // Trình biên dịch tự động dịch thành: public class Animal extends java.lang.Object {}
public class Mammal extends Animal {}
public class Elephant extends Mammal {} // Hợp lệ: Chuỗi kế thừa nhiều tầng
public class Bat extends Mammal, Bird {} // DOES NOT COMPILE: Java không hỗ trợ đa kế thừa lớp!
```

---

### 1.2. Các Bổ Từ Dành Cho Lớp (Class Modifiers)

##### BẢNG 6.1: Các bổ từ áp dụng cho Top-Level Class (TABLE 6.1 in book)
| Bổ Từ (*Modifier*) | Cho Phép Kế Thừa? | Cho Phép Khởi Tạo (`new`)? | Mô Tả & Ý Nghĩa |
| :--- | :---: | :---: | :--- |
| **(Không ghi - Package-private)** | Có (trong package) | Có (trong package) | Lớp chỉ có thể nhìn thấy và truy cập bởi các lớp trong cùng package. |
| **`public`** | **Có** | **Có** | Lớp có thể nhìn thấy và truy cập từ bất kỳ package nào. |
| **`final`** | **KHÔNG (No)** | **Có** | Đánh dấu lớp **không thể bị kế thừa** bởi bất kỳ lớp con nào (ví dụ: `String`, `Integer`, `System`). |
| **`abstract`** | **Có** | **KHÔNG (No)** | Lớp trừu tượng, **không thể khởi tạo trực tiếp bằng từ khóa `new`**. Bắt buộc phải có lớp con kế thừa. |

> [!CAUTION]
> **Bẫy biên dịch về bổ từ lớp cấp cao nhất (Top-Level Class):**
> * Một top-level class **chỉ có thể có phạm vi truy cập là `public` hoặc package-private**. Tuyệt đối không được dùng `private` hay `protected` (chúng chỉ áp dụng cho Inner/Nested Class ở Chương 7)!
> * **CẤM KẾT HỢP `final` VÀ `abstract`:** Khai báo `public final abstract class Hippo {}` sẽ gây **LỖI BIÊN DỊCH** ngay lập tức, vì `final` cấm kế thừa trong khi `abstract` bắt buộc phải được kế thừa!

---

## 2. Tạo Lớp và Sử Dụng `this` / `super` (Creating Classes)

### 2.1. Phân Biệt Tham Chiếu `this` và `super`
* **Từ khóa `this`:** Đại diện cho thể hiện của lớp hiện tại. Có thể dùng để:
  * Truy cập biến thể hiện hoặc phương thức của chính lớp đó (hoặc các thành viên kế thừa từ lớp cha): `this.name`, `this.eat()`.
  * Gọi constructor nạp chồng trong cùng lớp: `this(...)`.
* **Từ khóa `super`:** Đại diện cho lớp cha trực tiếp. Dùng để:
  * Truy cập thành viên của lớp cha khi bị lớp con che khuất hoặc ghi đè: `super.name`, `super.eat()`.
  * Gọi constructor của lớp cha: `super(...)`.

```java
class Animal {
   public int age = 1;
}

class Horse extends Animal {
   public int age = 2; // Che khuất biến age của cha (Variable Hiding)

   public void printAge() {
      System.out.print(this.age + "-");  // In ra: 2- (Biến của Horse)
      System.out.print(super.age + "-"); // In ra: 1- (Biến của Animal)
      System.out.print(age);             // In ra: 2  (Mặc định là this.age)
   }
}
```

---

## 3. Khai Báo Constructor (Declaring Constructors)

### 3.1. Cấu Trúc Constructor và Constructor Mặc Định
* **Quy tắc constructor:**
  1. Tên của constructor **bắt buộc phải trùng khớp hoàn toàn** với tên của lớp.
  2. Constructor **tuyệt đối KHÔNG ĐƯỢC CÓ KIỂU TRẢ VỀ** (kể cả `void`).

> [!WARNING]
> **Bẫy constructor có kiểu trả về:**  
> Nếu bạn viết `public void Dog() {}`, đây **không phải là constructor** mà là một phương thức thông thường có tên là `Dog`! Trình biên dịch vẫn cho phép nhưng lớp sẽ không có constructor này!

* **Constructor mặc định (Default Constructor):**
  * Trình biên dịch sẽ **tự động sinh ra** một constructor không tham số rỗng `public ClassName() { super(); }` **KHI VÀ CHỈ KHI lập trình viên không khai báo bất kỳ constructor nào** trong lớp.
  * Nếu bạn đã tự viết **bất kỳ một constructor nào** (kể cả constructor có tham số), trình biên dịch sẽ **KHÔNG TỰ ĐỘNG SINH** constructor mặc định nữa!

```java
public class Rabbit {
   public Rabbit(int age) {} // Lập trình viên đã định nghĩa constructor có tham số
}

public class Test {
   public static void main(String[] args) {
      Rabbit r1 = new Rabbit(5); // Hợp lệ
      Rabbit r2 = new Rabbit();  // DOES NOT COMPILE! Lớp Rabbit không còn constructor không tham số!
   }
}
```

---

### 3.2. Gọi Constructor Nạp Chồng Bằng `this(...)`
* Để gọi một constructor khác trong cùng một lớp, ta dùng cú pháp `this(...)`.
* **Quy tắc bắt buộc:** Lời gọi `this(...)` **phải là câu lệnh đầu tiên** trong thân constructor!
* **Bẫy đệ quy vòng tròn (*Circular / Recursive Constructor Invocation*):** Nếu constructor A gọi constructor B và constructor B lại gọi ngược lại constructor A $\rightarrow$ Trình biên dịch báo lỗi `recursive constructor invocation`.

```java
public class Hamster {
   private String color;
   private int weight;

   public Hamster(int weight, String color) {
      this.weight = weight;
      this.color = color;
   }

   public Hamster(int weight) {
      this(weight, "brown"); // Hợp lệ: this(...) là dòng lệnh đầu tiên
      // this.weight = weight; // Không cần thiết vì this() đã xử lý
   }

   public Hamster() {
      System.out.println("Building");
      this(5); // DOES NOT COMPILE: this() không phải dòng lệnh đầu tiên!
   }
}
```

---

### 3.3. Gọi Constructor Cha Bằng `super(...)`

#### Các Quy Tắc Sống Còn Của `super(...)`:
1. Lời gọi `super(...)` **bắt buộc phải là câu lệnh đầu tiên** trong thân constructor của lớp con.
2. Một constructor chỉ có thể có **tối đa một** lời gọi `this(...)` hoặc `super(...)` ở dòng đầu tiên (không thể có cả hai).
3. **Quy tắc tự động chèn:** Nếu dòng đầu tiên của constructor không có `this(...)` và cũng không có `super(...)`, trình biên dịch sẽ **tự động chèn `super();` (gọi constructor không tham số của cha)** vào dòng đầu tiên!

#### BẪY PHÒNG THI KINH ĐIỂN VỚI LỚP CHA KHÔNG CÓ NO-ARG CONSTRUCTOR:
Nếu lớp cha định nghĩa constructor có tham số và **không có constructor không tham số**, thì mọi lớp con **bắt buộc phải tự định nghĩa constructor và gọi tường minh `super(args);`**!

```java
class Mammal {
   public Mammal(int age) {} // Lớp cha CHỈ có constructor nhận int
}

class Elephant extends Mammal {
   // DOES NOT COMPILE nếu để trống!
   // Vì compiler tự chèn constructor mặc định:
   // public Elephant() { super(); } -> LỖI vì Mammal không có constructor không tham số!
}

class ElephantFixed extends Mammal {
   public ElephantFixed() {
      super(10); // HỢP LỆ: Gọi tường minh constructor có tham số của cha
   }
}
```

---

## 4. Thứ Tự Khởi Tạo Đối Tượng (Order of Initialization)

Đây là một trong những chủ đề trọng tâm, thường xuyên xuất hiện trong các câu hỏi phân tích output phức tạp nhất của kỳ thi OCP!

### 4.1. Quy Trình Khởi Tạo Hoàn Chỉnh (2 Giai Đoạn)

```
GIAI ĐOẠN 1: KHỞI TẠO LỚP (Class Loading - Chạy 1 lần duy nhất khi lớp được nạp vào JVM)
   1. Khởi tạo Superclass trước (nếu chưa nạp):
      └─ Biến static & khối static { } của Superclass (theo thứ tự xuất hiện).
   2. Khởi tạo Subclass:
      └─ Biến static & khối static { } của Subclass (theo thứ tự xuất hiện).

GIAI ĐOẠN 2: KHỞI TẠO ĐỐI TƯỢNG (Instance Initialization - Chạy mỗi khi gọi 'new')
   3. Khởi tạo thể hiện của Superclass trước:
      a. Biến thể hiện (instance variables) & khối { } của Superclass (theo thứ tự xuất hiện).
      b. Thân Constructor của Superclass chạy.
   4. Khởi tạo thể hiện của Subclass:
      a. Biến thể hiện (instance variables) & khối { } của Subclass (theo thứ tự xuất hiện).
      b. Thân Constructor của Subclass chạy.
```

---

### 4.2. Phân Tích Bài Toán Mẫu Kinh Điển (Exam Walkthrough: GiraffeFamily & Okapi)

Hãy cùng phân tích đoạn code thực tế từ trang 531–533 của sách giáo trình:

```java
1:  class GiraffeFamily {
2:     static { System.out.print("A"); }
3:     { System.out.print("B"); }
4:     public GiraffeFamily(String name) {
5:        this(1);
6:        System.out.print("C");
7:     }
8:     public GiraffeFamily() {
9:        System.out.print("D");
10:    }
11:    public GiraffeFamily(int stripes) {
12:       System.out.print("E");
13:    }
14: }
15: public class Okapi extends GiraffeFamily {
16:    static { System.out.print("F"); }
17:    public Okapi(int stripes) {
18:       super("sugar");
19:       System.out.print("G");
20:    }
21:    { System.out.print("H"); }
22:    public static void main(String[] grass) {
23:       new Okapi(1);
24:       System.out.println();
25:       new Okapi(2);
26:    }
27: }
```

#### Từng Bước Lần Vết (Trace Step-by-Step):
1. **Khởi tạo Class:** Lớp `Okapi` chứa hàm `main()`, có lớp cha là `GiraffeFamily`.
   * Chạy `static` của `GiraffeFamily`: Dòng 2 in ra **`A`**.
   * Chạy `static` của `Okapi`: Dòng 16 in ra **`F`**.
   * (Hoàn thành nạp lớp: Output tạm thời là `AF`).
2. **Khởi tạo đối tượng 1: `new Okapi(1)` (Dòng 23):**
   * Constructor `Okapi(int)` bắt đầu chạy $\rightarrow$ gặp dòng 18: `super("sugar")`.
   * Chuyển lên lớp cha `GiraffeFamily`:
     * Khối thể hiện `{ System.out.print("B"); }` (dòng 3) chạy $\rightarrow$ in ra **`B`**.
     * Constructor `GiraffeFamily(String)` chạy $\rightarrow$ dòng 5: `this(1)` gọi sang `GiraffeFamily(int)`.
     * Constructor `GiraffeFamily(int)` chạy $\rightarrow$ dòng 12 in ra **`E`**.
     * Quay lại `GiraffeFamily(String)` $\rightarrow$ dòng 6 in ra **`C`**.
   * Quay lại lớp con `Okapi`:
     * Khối thể hiện `{ System.out.print("H"); }` (dòng 21) chạy $\rightarrow$ in ra **`H`**.
     * Thân constructor `Okapi(int)` tiếp tục $\rightarrow$ dòng 19 in ra **`G`**.
   * Kết quả lần 1: **`AFBECHG`**.
3. **Dòng 24:** In dấu xuống dòng `\n`.
4. **Khởi tạo đối tượng 2: `new Okapi(2)` (Dòng 25):**
   * Vì lớp đã được nạp rồi nên **các khối static KHÔNG CHẠY LẠI**!
   * Quá trình khởi tạo thể hiện lặp lại y hệt lần 1: In ra **`BECHG`**.

$$\text{TỔNG KẾT OUTPUT:} \quad \mathbf{\text{AFBECHG}} \quad / \quad \mathbf{\text{BECHG}}$$

---

### 4.3. Quy Tắc Khởi Tạo Biến Thể Hiện `final`
* Bất kỳ biến thể hiện nào được đánh dấu `final` bắt buộc phải được gán giá trị xác định **đúng 1 lần duy nhất** trước khi constructor hoàn tất.
* Không được để sót bất kỳ nhánh rẽ constructor nào mà biến `final` không được gán!
* Nếu đã gán giá trị ở dòng khai báo hoặc trong khối `{ }`, **cấm gán lại lần thứ hai trong constructor**.

---

## 5. Kế Thừa Thành Viên & Ghi Đè Phương Thức (Inheriting Members)

### 5.1. Bốn Quy Tắc Vàng Của Ghi Đè Phương Thức (Method Overriding)

Khi lớp con định nghĩa một phương thức có cùng chữ ký với phương thức của lớp cha, nó phải tuân thủ nghiêm ngặt **4 quy tắc sau để code có thể biên dịch**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        4 QUY TẮC METHOD OVERRIDING TRONG JAVA                         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Quy tắc 1: Cùng Chữ Ký (Method Signature)                                              │
│   • Phải có cùng tên phương thức và danh sách kiểu dữ liệu tham số giống hệt nhau.     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Quy tắc 2: Phạm Vi Truy Cập (Access Modifier)                                          │
│   • Phải rộng bằng hoặc rộng hơn lớp cha: private ─► package ─► protected ─► public.   │
│   • Tuyệt đối KHÔNG ĐƯỢC thu hẹp quyền truy cập!                                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Quy tắc 3: Ngoại Lệ Kiểm Tra (Checked Exceptions)                                      │
│   • KHÔNG ĐƯỢC ném ngoại lệ Checked mới hoặc rộng hơn lớp cha.                         │
│   • Được phép: Ném ít hơn, ném ngoại lệ hẹp hơn (subclass), không ném,                 │
│     hoặc ném bất kỳ ngoại lệ Unchecked (RuntimeException) nào!                         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Quy tắc 4: Kiểu Trả Về Đồng Biến (Covariant Return Types)                              │
│   • Kiểu trả về ở lớp con phải là cùng kiểu hoặc là LỚP CON của kiểu trả về ở lớp cha. │
│   • Với kiểu nguyên thủy (primitive): BẮT BUỘC PHẢI GIỐNG HỆT NHAU!                    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Ví Dụ Phân Tích Covariant Return Types:
```java
class Rhino {
   protected CharSequence getName() { return "rhino"; }
   protected int getWeight() { return 1000; }
}

class JavanRhino extends Rhino {
   // HỢP LỆ: String là lớp con của CharSequence (Covariant return type)
   public String getName() { return "javan rhino"; }

   // DOES NOT COMPILE: Kiểu nguyên thủy không hỗ trợ covariant, phải là int chính xác!
   public long getWeight() { return 2000L; } 
}
```

#### Quy Tắc Về Ngoại Lệ Checked:
```java
class Bird {
   public void fly() throws IOException {}
}

class Eagle extends Bird {
   // HỢP LỆ: FileNotFoundException là lớp con của IOException (hẹp hơn)
   public void fly() throws FileNotFoundException {} 
}

class Hawk extends Bird {
   // HỢP LỆ: Không ném checked exception nào
   public void fly() {} 
}

class Crow extends Bird {
   // DOES NOT COMPILE: Exception là cha của IOException (rộng hơn -> vi phạm quy tắc 3!)
   public void fly() throws Exception {} 
}
```

---

### 5.2. Các Phương Thức Không Thể Ghi Đè

1. **Phương thức `final`:** Lớp con tuyệt đối không thể ghi đè phương thức có gắn từ khóa `final` ở lớp cha (`cannot override final method`).
2. **Phương thức `private`:** Vì phương thức `private` không thể nhìn thấy từ lớp con, lớp con định nghĩa một phương thức cùng tên chỉ được coi là một **phương thức mới độc lập**, hoàn toàn không phải là ghi đè.

---

### 5.3. Ẩn Phương Thức Tĩnh (Method Hiding)
* Xảy ra khi cả lớp cha và lớp con cùng định nghĩa một phương thức **`static` có cùng chữ ký**.
* Phương thức ẩn tuân thủ đầy đủ 4 quy tắc của Overriding, kèm theo **Quy tắc thứ 5**:
  * **Cả hai phương thức ở cha và con BẮT BUỘC PHẢI CÙNG LÀ `static`!**
  * Nếu một bên là `static` còn bên kia là `instance` $\rightarrow$ **DOES NOT COMPILE!**

```java
class Bear {
   public static void eat() { System.out.println("Bear is eating"); }
   public static void sneeze() { System.out.println("Bear sneezes"); }
   public void hibernate() { System.out.println("Bear hibernates"); }
}

class SunBear extends Bear {
   public static void eat() { System.out.println("Sun bear is eating"); } // HỢP LỆ: Method Hiding
   public void sneeze() {}        // DOES NOT COMPILE: Không thể override static method thành instance!
   public static void hibernate() {} // DOES NOT COMPILE: Không thể hide instance method thành static!
}
```

---

### 5.4. Ẩn Biến Thể Hiện (Variable Hiding) — BẪY PHÒNG THI TỬ THẦN!

> [!CAUTION]
> **QUY TẮC VÀNG KHÁC BIỆT GIỮA BIẾN VÀ PHƯƠNG THỨC:**
> * Trong Java, **phương thức thì được GHI ĐÈ (Overridden)** và tuân theo cơ chế **Đa hình động (*Virtual Method Invocation*)**: Phương thức nào được gọi phụ thuộc vào **đối tượng thực tế trên Heap lúc runtime**.
> * Nhưng **biến thì KHÔNG BAO GIỜ bị ghi đè, biến chỉ bị ẨN (Hidden)**! Việc truy cập biến nào hoàn toàn phụ thuộc vào **KIỂU THAM CHIẾU LÚC BIÊN DỊCH (Reference Type / Compile-time Type)**!

#### Bài Toán Minh Họa So Sánh Biến vs Phương Thức:
```java
class Rodent {
   protected int tailLength = 4;
   public void getRodentDetails() {
      System.out.println("[parentTail=" + tailLength + "]");
   }
}

public class Mouse extends Rodent {
   protected int tailLength = 8; // Ẩn biến của cha!
   public void getRodentDetails() {
      System.out.println("[childTail=" + tailLength + "]");
   }

   public static void main(String[] args) {
      Mouse mouse = new Mouse();
      Rodent rodent = mouse; // Biến tham chiếu kiểu Rodent trỏ vào đối tượng Mouse

      // 1. TRUY CẬP PHƯƠNG THỨC (Đa hình động):
      rodent.getRodentDetails(); // IN RA: [childTail=8] (Gọi hàm của Mouse trên Heap!)

      // 2. TRUY CẬP BIẾN (Theo kiểu tham chiếu lúc biên dịch):
      System.out.println(rodent.tailLength); // IN RA: 4 (Lấy biến của Rodent!)
      System.out.println(mouse.tailLength);  // IN RA: 8 (Lấy biến của Mouse!)
   }
}
```

---

## 6. Lớp Trừu Tượng (Creating Abstract Classes)

### 6.1. Khái Niệm Lớp Trừu Tượng (`abstract class`)
* Lớp trừu tượng được khai báo với từ khóa `abstract`.
* **Không thể khởi tạo trực tiếp bằng từ khóa `new`** (`Animal a = new Animal();` $\rightarrow$ Lỗi biên dịch).
* Lớp trừu tượng có thể chứa: Biến thể hiện, biến static, constructor (dùng cho lớp con gọi thông qua `super()`), phương thức thông thường có thân hàm, và phương thức trừu tượng.

---

### 6.2. Phương Thức Trừu Tượng (`abstract method`)
* Phương thức có từ khóa `abstract`, **hoàn toàn không có thân hàm `{}`**, kết thúc bằng dấu chấm phẩy `;`.
* Phương thức abstract **chỉ có thể được khai báo bên trong một `abstract class`** (hoặc interface).
* **Quy tắc hiện thực:** Lớp con cụ thể đầu tiên (*first concrete subclass*) kế thừa từ lớp abstract **bắt buộc phải ghi đè và hiện thực toàn bộ** các phương thức abstract kế thừa. Nếu lớp con cũng là `abstract`, nó có thể bỏ qua không cần hiện thực.

```java
public abstract class Mammal {
   public abstract void eat(); // Abstract method kết thúc bằng dấu ;
}

public abstract class Platypus extends Mammal {
   // HỢP LỆ: Lớp con là abstract nên chưa bắt buộc phải implement eat()
}

public class Walrus extends Mammal {
   // BẮT BUỘC: Walrus là concrete class nên phải implement eat()
   public void eat() {
      System.out.println("Walrus eats clams");
   }
}
```

> [!CAUTION]
> **Các tổ hợp bổ từ cấm kỵ với `abstract`:**
> * `abstract final`: Cấm (vì `final` chặn ghi đè, `abstract` ép ghi đè).
> * `abstract private`: Cấm (vì `private` không cho lớp con nhìn thấy để ghi đè).
> * `abstract static`: Cấm (vì `static` không thể ghi đè).

---

## 7. Thiết Kế Lớp Bất Biến (Creating Immutable Objects)

Lớp bất biến (*Immutable Class*) là lớp mà trạng thái bên trong của đối tượng một khi đã được tạo trên Heap thì **không bao giờ có thể bị thay đổi** (tương tự như `String`, `LocalDate`).

### 7.1. Năm Quy Tắc Vàng Thiết Kế Lớp Bất Biến

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        5 QUY TẮC THIẾT KẾ LỚP BẤT BIẾN TRONG JAVA                     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Đánh dấu lớp là `final` (hoặc tạo constructor `private` và dùng factory method)      │
│    để ngăn không cho lớp con kế thừa và ghi đè phương thức.                            │
│ 2. Khai báo tất cả các trường dữ liệu là `private` và `final`.                         │
│ 3. Không cung cấp bất kỳ phương thức setter / mutator nào làm thay đổi dữ liệu.        │
│ 4. Không cho phép sửa đổi các đối tượng khả biến được tham chiếu:                      │
│    • Không trả về tham chiếu trực tiếp trong getter. Hãy trả về bản sao phòng thủ      │
│      (Defensive Copy).                                                                 │
│ 5. Thực hiện sao chép phòng thủ đối với các đối tượng khả biến truyền vào constructor. │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Minh Họa Bản Sao Phòng Thủ (Defensive Copying):
```java
import java.util.*;

public final class Animal {
   private final List<String> favoriteFoods;

   public Animal(List<String> favoriteFoods) {
      if (favoriteFoods == null) {
         throw new RuntimeException("favoriteFoods is required");
      }
      // QUY TẮC 5: Tạo bản sao phòng thủ khi nhận dữ liệu vào
      this.favoriteFoods = new ArrayList<>(favoriteFoods);
   }

   public int getFavoriteFoodsCount() {
      return favoriteFoods.size();
   }

   public List<String> getFavoriteFoods() {
      // QUY TẮC 4: Trả về bản sao phòng thủ hoặc unmodifiableList, KHÔNG trả về biến gốc!
      return new ArrayList<>(this.favoriteFoods);
   }
}
```

---

## 8. Tóm Tắt Trọng Tâm Phòng Thi (Exam Essentials)

1. **Hiểu rõ mô hình kế thừa:** Java áp dụng đơn kế thừa lớp, gốc là `java.lang.Object`. Top-level class chỉ có thể là `public` hoặc package-private; không bao giờ kết hợp `final` với `abstract`.
2. **Quy tắc Constructor:**
   * Constructor không có kiểu trả về. Nếu có kiểu trả về, nó là phương thức thường.
   * `this(...)` và `super(...)` bắt buộc phải là dòng lệnh đầu tiên trong constructor.
   * Compiler tự động chèn `super();` không tham số nếu không viết. Nếu lớp cha không có constructor không tham số, lớp con bắt buộc phải gọi `super(args)` tường minh.
3. **Thứ tự khởi tạo (Order of Initialization):**
   * Static của lớp cha $\rightarrow$ Static của lớp con (chỉ chạy 1 lần khi nạp lớp).
   * Khối thể hiện `{ }` & biến instance của lớp cha $\rightarrow$ Constructor của lớp cha $\rightarrow$ Khối thể hiện `{ }` & biến instance của lớp con $\rightarrow$ Constructor của lớp con.
4. **Bốn quy tắc ghi đè phương thức (Method Overriding):**
   * Cùng chữ ký (`signature`).
   * Access modifier rộng bằng hoặc rộng hơn.
   * Không ném checked exception mới hoặc rộng hơn.
   * Kiểu trả về đồng biến (`covariant return type`) cho kiểu đối tượng; kiểu nguyên thủy phải giống hệt nhau.
5. **Ẩn phương thức và ẩn biến:**
   * Ẩn phương thức static: Cả cha và con đều phải là `static`.
   * **Ẩn biến (Field Hiding):** Truy cập biến phụ thuộc vào **kiểu tham chiếu lúc biên dịch**, không phụ thuộc đối tượng thực tế trên Heap (khác hoàn toàn với phương thức đa hình).
6. **Lớp trừu tượng và phương thức trừu tượng:**
   * Lớp `abstract` không thể `new`. Phương thức `abstract` không có thân hàm.
   * Lớp con cụ thể đầu tiên phải hiện thực tất cả các phương thức abstract.
   * Cấm kết hợp `abstract` với `final`, `private`, hoặc `static`.
7. **Đối tượng bất biến (Immutable):** Lớp `final`, trường `private final`, không có setter, luôn sử dụng bản sao phòng thủ (*Defensive Copy*) khi truyền vào constructor và khi trả về từ getter đối với các đối tượng khả biến (như `List`, `Date`).
