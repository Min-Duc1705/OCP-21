# Sổ Tay Chuyên Sâu: Chapter 7 - Beyond Classes

> **Tài liệu tham chiếu chuẩn OCP Java SE 21:**  
> Sách: *OCP Oracle Certified Professional Java SE 21 Developer Study Guide*  
> Tác giả: Jeanne Boyarsky & Scott Selikoff (Sybex / Wiley)  
> Phạm vi: Trang 586 – 681 (PDF)

---

## 🗺️ Bản Đồ Kiến Thức Chương 7 (Chapter Overview)

Trong Chương 6, chúng ta đã nắm vững cách thiết kế một lớp (Class Design) với các cơ chế kế thừa, constructor, và thứ tự khởi tạo. Tuy nhiên, lập trình Java hiện đại không chỉ dừng lại ở các lớp thông thường. Chương 7 đưa chúng ta vượt ra ngoài các class truyền thống (**Beyond Classes**) để làm chủ các cấu trúc dữ liệu và kiểu dữ liệu cấp cao:

1. **Giao diện (Interfaces):** Không chỉ có phương thức abstract mà còn hỗ trợ hằng số, `default method`, `static method`, `private method` và `private static method`.
2. **Lớp liệt kê (Enums):** Tập hợp các hằng số bất biến an toàn về kiểu (type-safe), tích hợp constructor riêng, phương thức và abstract method.
3. **Lớp bị niêm phong (Sealed Classes & Interfaces):** Tính năng định hình cây kế thừa có kiểm soát với bộ ba từ khoá `sealed`, `permits`, và `non-sealed`.
4. **Bản ghi (Records):** Cấu trúc đóng gói dữ liệu bất biến (immutable data carrier) một dòng cực kỳ mạnh mẽ, cùng tính năng mới của Java 21: **Record Patterns** (Pattern Matching for Records).
5. **Lớp lồng nhau (Nested Classes):** 4 loại lớp lồng nhau gồm Inner Class, Static Nested Class, Local Class và Anonymous Class cùng các quy tắc phạm vi truy cập biến `final` / `effectively final`.
6. **Tính đa hình chuyên sâu (Polymorphism):** Phân biệt bản chất giữa đối tượng thực tế trong bộ nhớ Heap và kiểu tham chiếu trong Stack; quy tắc ép kiểu Class vs Interface; và sự khác biệt sống còn giữa **Method Overriding** (đa hình tại runtime) với **Member Hiding** (tĩnh tại compile-time).

---

## 📌 Các Quy Tắc Cấp Tệp (Top-Level Types Rules) & Annotations Bắt Buộc

Trước khi đi sâu vào từng loại kiểu dữ liệu, Oracle yêu cầu lập trình viên ghi nhớ các quy tắc nền tảng sau:

### 1. Quy tắc tệp mã nguồn Java (.java file)
* Mỗi tệp mã nguồn Java (`.java`) **chỉ có thể chứa tối đa một kiểu dữ liệu `public` ở cấp cao nhất (top-level type)** (có thể là `class`, `interface`, `enum`, `record`).
* Tên của kiểu `public` này **bắt buộc phải trùng khớp tuyệt đối** với tên tệp (ví dụ: `public record Crane` phải nằm trong tệp `Crane.java`).
* Các top-level type chỉ được phép khai báo với 2 mức truy cập: **`public`** hoặc **package-private** (mặc định, không có từ khoá). Khai báo top-level type với `private` hoặc `protected` sẽ gây **lỗi biên dịch**.

### 2. Ba Annotation Cần Biết Trong Kỳ Thi OCP
Ngoài `@Override` và `@FunctionalInterface`, đề thi OCP kiểm tra kiến thức về 3 annotation phổ biến:

| Annotation | Phạm Vi Áp Dụng | Mục Đích & Ảnh Hưởng Lên Trình Biên Dịch |
| :--- | :--- | :--- |
| **`@Deprecated`** | Class, Interface, Method, Field, Variable | Báo cho lập trình viên biết phần tử này đã lỗi thời và có thể bị loại bỏ trong tương lai. Trình biên dịch sẽ **phát sinh cảnh báo (compiler warning)** nếu mã nguồn sử dụng phần tử có gắn `@Deprecated`. |
| **`@SuppressWarnings`** | Class, Method, Variable | Yêu cầu trình biên dịch **tắt/bỏ qua các thông báo cảnh báo (warning)** thuộc nhóm chỉ định (ví dụ: `@SuppressWarnings("deprecation")` hoặc `@SuppressWarnings("unchecked")`). |
| **`@SafeVarargs`** | Method, Constructor | Khẳng định với trình biên dịch rằng phương thức không thực hiện bất kỳ thao tác nào gây mất an toàn kiểu dữ liệu trên tham số varargs kiểu Generic. **Lưu ý OCP:** Chỉ có thể áp dụng cho các phương thức không thể bị ghi đè: phương thức `static`, phương thức `final`, hoặc phương thức `private`. |

---

## PHẦN 1: GIAO DIỆN TRONG JAVA (IMPLEMENTING INTERFACES)

Một giao diện (**Interface**) là một kiểu dữ liệu trừu tượng định nghĩa một hợp đồng (contract) chứa các hành vi mà các lớp triển khai bắt buộc phải cung cấp.

### 1. Khai Báo và Các Modifier Ngầm Định (Implicit Modifiers)
Trình biên dịch tự động chèn các modifier ngầm định vào interface. Bạn bắt buộc phải thuộc lòng bảng sau để không bị đề thi đánh lừa:

```java
public interface WalkOnTwoLegs {
    int MAXIMUM_COUNT = 100; // Ngầm định: public static final int MAXIMUM_COUNT = 100;
    void walk();             // Ngầm định: public abstract void walk();
}
```

#### Quy tắc ngầm định cốt lõi:
1. **Mọi biến khai báo trong interface (Constant Variable):**
   * Đều ngầm định là **`public static final`**.
   * Bắt buộc phải **gán giá trị khởi tạo ngay khi khai báo**.
   * Không thể là `private`, `protected`, `transient`, hay `volatile`.
2. **Mọi phương thức trừu tượng (Abstract Method):**
   * Đều ngầm định là **`public abstract`**.
   * Không được phép có thân hàm `{}`.
   * Không thể kết hợp với các từ khoá: `final`, `static`, `private`, `native`, `synchronized`, `strictfp`.
3. **Bản thân Interface:**
   * Luôn luôn ngầm định là **`abstract`**.
   * Không thể đánh dấu là `final` (lỗi biên dịch).
4. **Không hỗ trợ `protected` hay `package-private`:**
   * Các thành viên bên trong interface không bao giờ có thể là `protected`. Phương thức không có modifier ngầm định là `public`, KHÔNG PHẢI package-private như trong class thông thường!

---

### 2. So Sánh Interface vs Abstract Class

| Đặc Điểm | Interface | Abstract Class |
| :--- | :--- | :--- |
| **Kế thừa / Triển khai** | Một lớp có thể `implements` **nhiều interface** | Một lớp chỉ có thể `extends` **duy nhất 1 abstract class** |
| **Biến thành viên (Variables)** | Chỉ có hằng số: `public static final` | Có thể có cả biến instance thông thường, biến `private`, `protected`, `final` hoặc non-final |
| **Constructor** | **KHÔNG CÓ CONSTRUCTOR** (lỗi biên dịch nếu khai báo) | Có constructor (chạy trong chuỗi khởi tạo của lớp con) |
| **Khối khởi tạo (Initializers)** | Không có khối khởi tạo instance | Có thể có cả static và instance initializer blocks |
| **Phương thức có thân hàm** | Chỉ có `default`, `static`, hoặc `private` | Mọi phương thức non-abstract đều có thân hàm bình thường |

---

### 3. Kế Thừa Giao Diện & Trùng Lặp Phương Thức Abstract

#### Quy tắc cú pháp:
* Một lớp dùng từ khoá **`implements`** để triển khai một hoặc nhiều interface:
  ```java
  public class Dog implements CanRun, CanBark {}
  ```
* Một interface dùng từ khoá **`extends`** để kế thừa một hoặc nhiều interface khác (đa kế thừa giao diện):
  ```java
  public interface CanHunt extends CanRun, CanSmell {}
  ```
* Khi một lớp vừa kế thừa lớp cha vừa triển khai giao diện, từ khoá `extends` **phải đứng trước** `implements`:
  ```java
  public class GoldenRetriever extends Dog implements Playful {} // HỢP LỆ
  public class Cat implements Playful extends Animal {}           // LỖI BIÊN DỊCH
  ```

#### Bẫy kế thừa các phương thức abstract trùng tên (Duplicate Abstract Methods):
Khi một lớp implement nhiều interface cùng khai báo phương thức có tên giống nhau:
1. **Cùng tên, cùng danh sách tham số, cùng kiểu trả về:**
   * Hợp lệ hoàn toàn. Lớp con chỉ cần override phương thức đó **một lần duy nhất**.
2. **Cùng tên, cùng tham số, kiểu trả về hiệp biến (Covariant Returns):**
   * Nếu Interface A trả về `CharSequence` và Interface B trả về `String`, lớp con triển khai bắt buộc phải chọn kiểu trả về hẹp hơn (`String`).
3. **Cùng tên, cùng tham số, nhưng kiểu trả về KHÔNG TƯƠNG THÍCH:**
   * **LỖI BIÊN DỊCH!** Không một lớp nào có thể triển khai đồng thời cả hai interface:
   ```java
   interface Herbivore { int eatPlants(); }
   interface Omnivore { void eatPlants(); }
   
   // LỖI BIÊN DỊCH: eatPlants() trong Herbivore và Omnivore xung đột kiểu trả về!
   public class Bear implements Herbivore, Omnivore {}
   ```

---

### 4. Sáu Loại Thành Viên Trong Interface (Bảng 7.1 Chuẩn Sách OCP)

Kể từ Java 9, một interface hỗ trợ chính xác 6 loại thành viên:

| Loại Thành Viên | Cấp Độ | Modifier Bắt Buộc | Modifier Ngầm Định | Có Thân Hàm / Giá Trị? |
| :--- | :--- | :--- | :--- | :---: |
| **Constant variable** | Class | Không | `public static final` | **CÓ** (bắt buộc gán trị) |
| **abstract method** | Instance | Không | `public abstract` | **KHÔNG** (kết thúc bằng `;`) |
| **default method** | Instance | `default` | `public` | **CÓ** `{}` |
| **static method** | Class | `static` | `public` | **CÓ** `{}` |
| **private method** | Instance | `private` | Không | **CÓ** `{}` |
| **private static method** | Class | `private static` | Không | **CÓ** `{}` |

---

### 5. Phương Thức Mặc Định (Default Methods)

Được giới thiệu từ Java 8 để hỗ trợ tính tương thích ngược (backward compatibility) cho Collection Framework (như phương thức `forEach()`, `stream()`).

#### Các quy tắc vàng cho `default` method:
1. **Chỉ được khai báo bên trong `interface`**, không được phép xuất hiện trong `class`!
2. Bắt buộc phải có từ khoá `default` và **phải có thân hàm `{}`**.
3. Ngầm định là `public`. Không thể đánh dấu là `private`, `protected`, `static`, `final`, hay `abstract`.
4. Lớp con triển khai có thể chọn:
   * Kế thừa nguyên vẹn cách cài đặt mặc định của interface.
   * Ghi đè (override) lại phương thức `default` như một phương thức instance thông thường.
   * Tái khai báo phương thức đó thành `abstract` (nếu lớp con là interface hoặc abstract class).

#### Xung đột đa kế thừa Default Methods (Multiple Inheritance Conflict):
Nếu một lớp implement 2 interface có cùng chữ ký `default method`, trình biên dịch sẽ báo lỗi xung đột trừ khi lớp con **tự mình ghi đè (override)** phương thức đó:

```java
interface Walk {
    default int getSpeed() { return 5; }
}
interface Run {
    default int getSpeed() { return 10; }
}

public class Athlete implements Walk, Run {
    // BẮT BUỘC ghi đè để giải quyết xung đột
    public int getSpeed() {
        // Cú pháp gọi implementation của một interface cụ thể:
        return Walk.super.getSpeed(); // Trả về 5
    }
}
```
> [!WARNING]
> **Cú pháp gọi cha:** Để gọi phương thức default của interface cha, bạn phải dùng cú pháp:  
> `<TênInterface>.super.<tênPhươngThức>()`. Ví dụ: `Walk.super.getSpeed()`. Gọi `super.getSpeed()` sẽ bị lỗi biên dịch!

---

### 6. Phương Thức Tĩnh Trong Interface (Static Interface Methods)

#### Quy tắc sống còn trong kỳ thi OCP:
1. Phương thức `static` trong interface ngầm định là `public` (trừ khi đánh dấu tường minh là `private static`).
2. Phải có từ khoá `static` và bắt buộc có thân hàm `{}`.
3. **KHÔNG ĐƯỢC KẾ THỪA BỞI LỚP TRIỂN KHAI:**
   * Một phương thức `static` trong interface **không được kế thừa** vào lớp con hay interface con.
   * Để gọi phương thức static của interface, **bắt buộc phải dùng tên interface trực tiếp**:
   ```java
   interface Hop {
       static int getJumpHeight() { return 8; }
   }
   public class Bunny implements Hop {
       public void printHeight() {
           System.out.println(Hop.getJumpHeight()); // HỢP LỆ
           System.out.println(getJumpHeight());     // LỖI BIÊN DỊCH!
           System.out.println(Bunny.getJumpHeight());// LỖI BIÊN DỊCH!
       }
   }
   ```

---

### 7. Phương Thức Private và Private Static Trong Interface

* **`private` method (Instance):** Dùng để chia sẻ mã dùng chung giữa các phương thức `default` trong cùng interface. Không thể truy cập từ bên ngoài interface hay từ các lớp triển khai.
* **`private static` method (Class):** Dùng để chia sẻ mã dùng chung giữa các phương thức `static` (hoặc cả `default`) trong cùng interface. Có thể gọi mà không cần instance.

#### Bảng Ma Trận Quyền Truy Cập Thành Viên Interface (Bảng 7.2 Chuẩn Sách OCP):

| Thành Viên Interface | Gọi được từ `default` & `private` method cùng interface? | Gọi được từ `static` method cùng interface? | Kế thừa vào lớp con triển khai? | Gọi được mà không cần đối tượng? |
| :--- | :---: | :---: | :---: | :---: |
| **Constant variable** | **Có** | **Có** | **Có** | **Có** |
| **abstract method** | **Có** | **Không** | **Có** | **Không** |
| **default method** | **Có** | **Không** | **Có** | **Không** |
| **static method** | **Có** | **Có** | **Chỉ khi dùng TênInterface** | **Chỉ khi dùng TênInterface** |
| **private method** | **Có** | **Không** | **Không** | **Không** |
| **private static method** | **Có** | **Có** | **Không** | **Không** |

---

## PHẦN 2: LỚP LIỆT KÊ (WORKING WITH ENUMS)

Một kiểu liệt kê (**`enum`**) là một kiểu dữ liệu đặc biệt đại diện cho một tập hợp cố định các hằng số được định nghĩa trước.

### 1. Khai Báo Enum Đơn Giản & Các Phương Thức Tích Hợp Sẵn

```java
public enum Season {
    WINTER, SPRING, SUMMER, FALL; // Dấu chấm phẩy ';' là tuỳ chọn nếu không có thành viên nào khác
}
```

* Các giá trị enum được viết theo chuẩn **`UPPER_SNAKE_CASE`**.
* Mỗi giá trị enum là một đối tượng duy nhất (Singleton) được JVM nạp và khởi tạo một lần duy nhất.
* Ta có thể so sánh hai biến enum bằng toán tử **`==`** hoặc phương thức **`.equals()`** (cả hai đều an toàn và cho kết quả như nhau).

#### Các phương thức có sẵn trong mọi Enum:
```java
Season s = Season.SUMMER;

// 1. name(): Trả về tên hằng số dưới dạng String
System.out.println(s.name()); // "SUMMER"

// 2. ordinal(): Trả về chỉ số thứ tự khai báo (bắt đầu từ 0)
System.out.println(s.ordinal()); // 2

// 3. values(): Trả về mảng chứa tất cả giá trị enum theo thứ tự khai báo
for (Season season : Season.values()) {
    System.out.println(season.name() + " at " + season.ordinal());
}

// 4. valueOf(String): Chuyển đổi từ chuỗi String sang hằng số Enum
Season summer = Season.valueOf("SUMMER"); // HỢP LỆ
Season bad = Season.valueOf("summer");    // NÉM RA IllegalArgumentException (phân biệt hoa thường!)
```

> [!CAUTION]
> **Quy tắc kế thừa của Enum:**
> * Bạn **KHÔNG THỂ kế thừa một enum** (`public enum SubSeason extends Season` → LỖI BIÊN DỊCH).
> * Enum **ngầm định kế thừa `java.lang.Enum`**, do đó enum không thể `extends` bất kỳ class nào khác.
> * Enum **CÓ THỂ implement một hoặc nhiều interface**!

---

### 2. Sử Dụng Enum Trong Lệnh `switch` (Switch Statements & Expressions)

Khi dùng enum trong biểu thức hoặc câu lệnh `switch`:
* Trong nhãn `case`, bạn **chỉ được phép sử dụng tên ngắn của hằng số** (Unqualified constant name).
* Bạn **KHÔNG ĐƯỢC PHÉP** thêm tiền tố tên Enum vào nhãn `case` (sẽ bị lỗi biên dịch):

```java
Season season = Season.SUMMER;
switch (season) {
    case SUMMER: // HỢP LỆ
        System.out.println("Nóng bức!");
        break;
    case Season.FALL: // LỖI BIÊN DỊCH: Không được có tiền tố Season.
        System.out.println("Mát mẻ!");
        break;
    case 0: // LỖI BIÊN DỊCH: Không được dùng giá trị int/ordinal() trong case
        System.out.println("Lạnh!");
        break;
}
```

---

### 3. Enum Phức Tạp: Fields, Constructors và Methods

Một enum có thể chứa các thuộc tính instance, biến static, constructor và các phương thức nghiệp vụ.

```java
public enum SeasonWithVisitors {
    WINTER("Low"), SPRING("Medium"), SUMMER("High"), FALL("Medium"); // Bắt buộc kết thúc bằng ';'

    private final String expectedVisitors;

    // Constructor của enum LUÔN LUÔN là private (dù có ghi hay không)
    private SeasonWithVisitors(String expectedVisitors) {
        this.expectedVisitors = expectedVisitors;
    }

    public void printExpectedVisitors() {
        System.out.println(expectedVisitors);
    }
}
```

#### Bốn quy tắc vàng của Enum phức tạp:
1. **Danh sách hằng số PHẢI ĐỨNG ĐẦU TIÊN:** Bất kỳ biến, constructor hay method nào cũng phải được đặt **sau** danh sách các hằng số enum.
2. **Dấu chấm phẩy (`;`) là bắt buộc:** Nếu enum có chứa bất kỳ thành viên nào khác (biến, method, constructor), dấu `;` kết thúc danh sách hằng số là bắt buộc.
3. **Constructor của Enum ngầm định là `private`:** Đặt `public` hay `protected` cho constructor của enum sẽ gây **lỗi biên dịch**. Bạn không bao giờ có thể tự gọi `new Season(...)`.
4. **Vòng đời khởi tạo của Enum:** Tất cả các constructor của các hằng số enum sẽ được JVM thực thi **một lần duy nhất khi enum được tham chiếu lần đầu tiên**.

```java
// Ví dụ về thời điểm chạy Constructor:
public enum OnlyOnce {
    ONCE(true);
    OnlyOnce(boolean b) {
        System.out.print("constructing,");
    }
}
// Khi thực thi:
System.out.print("begin,");
OnlyOnce first = OnlyOnce.ONCE;  // In ra: constructing,
OnlyOnce second = OnlyOnce.ONCE; // Không in gì thêm!
System.out.print("end");
// Kết quả: begin,constructing,end
```

---

### 4. Phương Thức Trừu Tượng Trong Enum (Abstract Methods in Enums)

Enum có thể định nghĩa một phương thức `abstract`. Khi đó, **mỗi hằng số enum bắt buộc phải cung cấp thân hàm ghi đè phương thức này** trong phần thân riêng của hằng số:

```java
public enum Size {
    SMALL {
        public double getMultiplier() { return 1.0; }
    },
    MEDIUM {
        public double getMultiplier() { return 1.5; }
    },
    LARGE {
        public double getMultiplier() { return 2.0; }
    };

    public abstract double getMultiplier(); // Phương thức abstract
}
```

---

## PHẦN 3: LỚP BỊ NIÊM PHONG (SEALING CLASSES & INTERFACES)

Được hoàn thiện trong Java 17 và là trọng tâm lớn trong kỳ thi Java 21, **Sealed Classes** cho phép người thiết kế lớp **giới hạn chính xác những lớp con nào được phép kế thừa** từ nó.

### 1. Cú Pháp Khai Báo & Ba Modifier Lớp Con Trực Tiếp

```java
// Khai báo sealed class với danh sách lớp con được phép kế thừa
public sealed class Animal permits Bear, Monkey, Wolf {}

// Mỗi lớp con trực tiếp BẮT BUỘC phải chọn 1 trong 3 modifier:
public final class Bear extends Animal {}              // 1. final: Dừng kế thừa
public sealed class Monkey extends Animal permits Baboon {} // 2. sealed: Tiếp tục niêm phong
public non-sealed class Wolf extends Animal {}         // 3. non-sealed: Mở toang kế thừa
```

#### Bộ Ba Modifier Bắt Buộc Của Lớp Con Trực Tiếp:
* **`final`:** Lớp con đóng hoàn toàn cây kế thừa, không một lớp nào khác có thể kế thừa từ nó nữa.
* **`sealed`:** Lớp con tiếp tục cơ chế niêm phong và phải khai báo danh sách `permits` riêng của mình.
* **`non-sealed`:** Lớp con mở toang cây phả hệ, cho phép bất kỳ lớp nào trong hệ thống kế thừa tự do từ nó.

> [!IMPORTANT]
> **Quy tắc thi OCP:** Mọi lớp con trực tiếp (`direct subclass`) của một `sealed class` **bắt buộc phải có chính xác một trong ba modifier: `final`, `sealed`, hoặc `non-sealed`**. Nếu thiếu, trình biên dịch sẽ báo lỗi ngay lập tức!

---

### 2. Quy Tắc Vị Trí (Colocation Rules) & Lược Bỏ Mệnh Đề `permits`

1. **Quy tắc cùng Package / Module:**
   * Một `sealed class` và tất cả các direct subclasses của nó **bắt buộc phải nằm trong cùng một package** (hoặc trong cùng một named module nếu dùng Java Module System).
2. **Quy tắc lược bỏ mệnh đề `permits` (Omitting permits):**
   * Nếu `sealed class` và các lớp con được khai báo trong **cùng một tệp mã nguồn (.java)** HOẶC các lớp con là **nested classes** bên trong sealed class, mệnh đề `permits` có thể được **lược bỏ hoàn toàn**:

```java
// Trong cùng một tệp Snake.java:
public sealed class Snake { // Không cần permits!
    final class Cobra extends Snake {}
    final class Python extends Snake {}
}
```

#### Bảng 7.3: Khi Nào Được Phép Lược Bỏ Mệnh Đề `permits`:
| Vị Trí Của Lớp Con Trực Tiếp | Mệnh đề `permits` |
| :--- | :--- |
| Nằm ở **tệp khác** so với sealed class (nhưng cùng package) | **Bắt buộc** |
| Nằm trong **cùng một tệp** với sealed class | **Tuỳ chọn** (có thể lược bỏ) |
| Là **nested class** bên trong sealed class | **Tuỳ chọn** (có thể lược bỏ) |

---

### 3. Sealed Interfaces

Giao diện cũng có thể được niêm phong bằng từ khoá `sealed`:

```java
public sealed interface Swims permits Duck, Swan, Floats {}

// 1. Lớp triển khai: có thể là final, sealed, hoặc non-sealed
public final class Duck implements Swims {}
public sealed class Swan implements Swims permits BlackSwan {}

// 2. Interface con kế thừa:
public non-sealed interface Floats extends Swims {}
```

> [!WARNING]
> **Quy tắc cấm `final` đối với Interface:**
> Một interface con kế thừa từ sealed interface **chỉ có thể là `sealed` hoặc `non-sealed`**.  
> Interface **TUYỆT ĐỐI KHÔNG ĐƯỢC ĐÁNH DẤU LÀ `final`** (vì interface bản chất luôn luôn là trừu tượng, không thể là final).

---

### 4. Áp Dụng Pattern Matching Trong `switch` Với Sealed Class

Nhờ trình biên dịch biết trước danh sách tất cả các lớp con được phép kế thừa, ta có thể viết biểu thức `switch` pattern matching mà **không cần nhánh `default`** nếu đã liệt kê đầy đủ các lớp con (*Exhaustiveness*):

```java
public sealed class Shape permits Circle, Square, Rectangle {}
final class Circle extends Shape {}
final class Square extends Shape {}
final class Rectangle extends Shape {}

public String getShapeName(Shape s) {
    return switch (s) {
        case Circle c -> "Hình tròn";
        case Square sq -> "Hình vuông";
        case Rectangle r -> "Hình chữ nhật";
        // KHÔNG CẦN default vì 100% các lớp con của Shape đã được bao quát!
    };
}
```
* Nếu bỏ bớt nhánh `Rectangle r`, trình biên dịch sẽ báo lỗi: `the switch expression does not cover all possible input values` trừ khi bạn thêm nhánh `default`!

---

## PHẦN 4: ĐÓNG GÓI DỮ LIỆU VỚI BẢN GHI (RECORDS)

Trước Java 14, để tạo một đối tượng truyền dữ liệu (POJO / DTO), lập trình viên phải viết hàng chục dòng mã boilerplate: trường private final, constructor, getter, `equals()`, `hashCode()`, và `toString()`.  
**`Record`** ra đời như một giải pháp bất biến (immutable data carrier) chuẩn mực chỉ với 1 dòng mã!

### 1. Khai Báo Record & Các Thành Phần Compiler Tự Động Sinh

```java
public record Crane(int numberEggs, String name) {}
```

Chỉ với dòng mã ngắn ngủi trên, trình biên dịch sẽ tự động sinh ra:
1. Hai trường dữ liệu instance: `private final int numberEggs;` và `private final String name;`.
2. Một constructor chuẩn nhận đầy đủ tham số (**Canonical Constructor**): `public Crane(int numberEggs, String name)`.
3. Hai phương thức đọc dữ liệu (Accessor Methods) **không có tiền tố `get`**:
   * `public int numberEggs()`
   * `public String name()`
4. Các phương thức `equals()` và `hashCode()` so sánh dựa trên toàn bộ các thành phần của record.
5. Phương thức `toString()` in ra định dạng trực quan: `Crane[numberEggs=2, name=Cammy]`.

---

### 2. Các Quy Tắc Bất Di Bất Dịch Của Record

* **Record ngầm định là `final`:** Bạn không thể kế thừa một record, và không thể mở rộng record bằng `extends` (`public record SubCrane() extends Crane` → LỖI BIÊN DỊCH).
* **Record ngầm định kế thừa `java.lang.Record`:** Vì Java không hỗ trợ đa kế thừa lớp, record **không thể `extends` bất kỳ lớp nào khác**.
* **Record CÓ THỂ triển khai bất kỳ interface nào:**
  ```java
  public record Crane(int numberEggs, String name) implements Bird, Serializable {} // HỢP LỆ
  ```
* **Không được phép khai báo thêm biến instance:** Bạn **KHÔNG THỂ** thêm bất kỳ biến instance nào ngoài danh sách tham số khai báo trên header của record:
  ```java
  public record Crane(int numberEggs, String name) {
      private int age; // LỖI BIÊN DỊCH: record cannot contain instance fields outside header
  }
  ```
* **Record KHÔNG hỗ trợ khối khởi tạo instance (`{}`):** Mọi khởi tạo instance phải diễn ra trong constructor.
* **Record CÓ THỂ chứa:** Các trường `static`, phương thức `static`, khối khởi tạo `static`, và các phương thức instance tự tạo thêm.

---

### 3. Ba Loại Constructor Trong Record

#### Loại 1: Canonical Constructor (Tường minh)
Lập trình viên tự viết lại constructor đầy đủ tham số để tuỳ biến:
```java
public record Crane(int numberEggs, String name) {
    public Crane(int numberEggs, String name) {
        if (numberEggs < 0) throw new IllegalArgumentException();
        this.numberEggs = numberEggs;
        this.name = name;
    }
}
```

#### Loại 2: Compact Constructor (Đặc trưng của Record)
Là dạng constructor rút gọn **không có dấu ngoặc đơn chứa tham số**, chuyên dùng để kiểm tra tính hợp lệ (validation) hoặc chuẩn hoá dữ liệu (transformation):
```java
public record Crane(int numberEggs, String name) {
    public Crane { // KHÔNG CÓ ()
        if (numberEggs < 0) throw new IllegalArgumentException();
        name = name.toUpperCase(); // Chuẩn hoá tham số
        // KHÔNG ĐƯỢC gán this.numberEggs = ... ở đây!
        // Compiler sẽ tự động chèn phép gán this.field = param ở dòng cuối cùng!
    }
}
```
> [!CAUTION]
> **Bẫy thi Compact Constructor:**  
> Trong compact constructor, bạn được phép thay đổi giá trị của các tham số (ví dụ: `name = name.trim()`), nhưng **KHÔNG ĐƯỢC PHÉP gán trực tiếp vào biến trường `this.name = ...`** (sẽ gây lỗi biên dịch!).

#### Loại 3: Non-canonical / Overloaded Constructor
Constructor nhận danh sách tham số khác:
```java
public record Crane(int numberEggs, String name) {
    // Constructor nạp chồng
    public Crane(String name) {
        this(0, name); // BẮT BUỘC dòng đầu tiên phải gọi Canonical Constructor!
    }
}
```
* **Quy tắc OCP:** Constructor nạp chồng trong record **bắt buộc phải gọi constructor khác bằng `this(...)` ở dòng đầu tiên**, và điểm kết thúc của chuỗi gọi này phải là Canonical Constructor.

---

### 4. Tính Năng Mới Java 21: Record Patterns (Pattern Matching for Records)

Java 21 giới thiệu tính năng phân rã cấu trúc bản ghi (**Record Deconstruction Patterns**) kết hợp với `instanceof` và `switch`:

```java
record Point(int x, int y) {}

public void printPoint(Object obj) {
    // Phân rã trực tiếp các trường x, y ra biến cục bộ mà không cần gọi p.x(), p.y():
    if (obj instanceof Point(int x, int y)) {
        System.out.println("Tọa độ: " + x + ", " + y);
    }
}
```

#### Quy tắc của Record Patterns:
1. **Khớp toàn bộ thành phần:** Nếu đã phân rã thì phải liệt kê **đầy đủ tất cả các trường** theo đúng thứ tự khai báo của record. Không được bỏ bớt trường.
2. **Khớp kiểu tương thích:** Kiểu khai báo trong pattern phải tương thích với kiểu trong record (hoặc dùng từ khoá `var`):
   ```java
   if (obj instanceof Point(var x, var y)) { ... } // Rất linh hoạt và hợp lệ
   ```
3. **Phân rã lồng nhau (Nested Record Patterns):**
   ```java
   record Center(Point point, int radius) {}
   
   if (obj instanceof Center(Point(int x, int y), int r)) {
       System.out.println("Tâm đường tròn tại: (" + x + ", " + y + ") với bán kính: " + r);
   }
   ```

---

## PHẦN 5: CÁC LỚP LỒNG NHAU (CREATING NESTED CLASSES)

Một **Nested Class** là một lớp được định nghĩa bên trong một lớp khác. Java hỗ trợ chính xác 4 loại:

```
Nested Classes
├── 1. Inner Class (Member Inner Class - non-static)
├── 2. Static Nested Class
├── 3. Local Class (định nghĩa trong method / block)
└── 4. Anonymous Class (lớp vô danh không tên)
```

---

### 1. Lớp Thành Viên Bên Trong (Inner Class / Member Class)
* Là lớp non-static định nghĩa ở cấp độ thành viên của Outer Class.
* **Yêu cầu đối tượng của Outer Class để khởi tạo:**
  ```java
  public class Outer {
      private String greeting = "Hi";
      protected class Inner {
          public void go() { System.out.println(greeting); }
      }
      public static void main(String[] args) {
          Outer outer = new Outer();
          Inner inner = outer.new Inner(); // Cú pháp khởi tạo đặc biệt: outer.new Inner()
          inner.go();
      }
  }
  ```
* **Truy cập thành viên bị trùng tên:** Dùng cú pháp `OuterClass.this.variable`:
  ```java
  public class A {
      private int x = 10;
      class B {
          private int x = 20;
          class C {
              private int x = 30;
              public void allX() {
                  System.out.println(x);        // 30
                  System.out.println(this.x);   // 30
                  System.out.println(B.this.x); // 20
                  System.out.println(A.this.x); // 10
              }
          }
      }
  }
  ```

---

### 2. Lớp Tĩnh Lồng Nhau (Static Nested Class)
* Là một lớp tĩnh được đặt bên trong một lớp khác.
* **Không yêu cầu instance của Outer Class để khởi tạo:**
  ```java
  public class Park {
      static class Ride {
          private int price = 6;
      }
      public static void main(String[] args) {
          var ride = new Park.Ride(); // Khởi tạo trực tiếp mà không cần đối tượng Park
          System.out.println(ride.price);
      }
  }
  ```
* **Giới hạn truy cập:** Không thể truy cập trực tiếp các biến instance non-static của lớp ngoài.

---

### 3. Lớp Cục Bộ (Local Class)
* Là lớp được định nghĩa bên trong một thân phương thức, constructor hoặc khối lệnh `{}`.
* Không có access modifier (`public`, `private`, `protected`).
* Chỉ tồn tại trong phạm vi khối lệnh khai báo.
* **QUY TẮC VÀNG VỀ BIẾN CỤC BỘ (Effectively Final Rule):**
  * Local class chỉ có thể truy cập các biến cục bộ của phương thức chứa nó nếu biến đó là **`final`** hoặc **`effectively final`** (nghĩa là giá trị của biến không bao giờ bị thay đổi sau khi khởi tạo).

```java
public void printMultiply(int base) {
    int factor = 2; // effectively final
    int counter = 0;
    counter++;      // counter BỊ THAY ĐỔI -> KHÔNG PHẢI effectively final!

    class Calculator {
        public int multiply() {
            return base * factor; // HỢP LỆ vì base và factor là effectively final
            // int c = counter;   // LỖI BIÊN DỊCH: counter không phải effectively final!
        }
    }
}
```

---

### 4. Lớp Vô Danh (Anonymous Class)
* Là lớp cục bộ không có tên, được khai báo và khởi tạo đồng thời bằng từ khoá `new`.
* **Bắt buộc phải kế thừa chính xác 1 lớp HOẶC triển khai chính xác 1 interface**:
  ```java
  public class ZooClimber {
      interface Climb { void climb(); }
      
      public void checkClimb() {
          Climb c = new Climb() { // Anonymous class implement Climb
              public void climb() { System.out.println("Climbing high!"); }
          };
          c.climb();
      }
  }
  ```
* Giống như Local Class, Anonymous Class chỉ được truy cập các biến cục bộ là `final` hoặc `effectively final`.

---

### 5. So Sánh 4 Loại Nested Classes (Bảng 7.4 & 7.5 Chuẩn Sách OCP)

| Đặc Điểm | Inner Class | Static Nested Class | Local Class | Anonymous Class |
| :--- | :---: | :---: | :---: | :---: |
| **Access Modifiers cho phép** | `public`, `protected`, package, `private` | `public`, `protected`, package, `private` | **Không có** (lỗi biên dịch nếu ghi) | **Không có** |
| **Có thể là `abstract` hoặc `final`?** | Có | Có | Có | **Không** |
| **Có thể chứa biến static & method static?** | Có (từ Java 16+) | Có | Có (từ Java 16+) | Có (từ Java 16+) |
| **Truy cập instance member của outer class?** | **Có** | **Không** | Có (nếu nằm trong instance method) | Có (nếu nằm trong instance method) |
| **Truy cập biến cục bộ của enclosing method?** | N/A | N/A | **Chỉ khi `final` hoặc effectively final** | **Chỉ khi `final` hoặc effectively final** |

---

## PHẦN 6: TÍNH ĐA HÌNH CHUYÊN SÂU (UNDERSTANDING POLYMORPHISM)

Tính đa hình (**Polymorphism**) là khả năng một đối tượng trong bộ nhớ có thể xuất hiện dưới nhiều hình thức thông qua các kiểu tham chiếu khác nhau.

### 1. Phân Biệt Đối Tượng Thực Tế (Object) vs Kiểu Tham Chiếu (Reference)

```java
Lemur lemur = new Lemur();
Primate primate = lemur;
HasTail hasTail = lemur;
Object obj = lemur;
```
* **Chỉ có duy nhất một đối tượng `Lemur` được tạo ra trong bộ nhớ Heap!**
* Cả 4 biến trên đều trỏ vào cùng một đối tượng trong bộ nhớ.
* **Kiểu tham chiếu** quy định những phương thức và biến nào bạn được phép gọi tại thời điểm biên dịch (*compile-time*).
* **Đối tượng thực tế** quy định phiên bản phương thức nào sẽ được chạy tại thời điểm thực thi (*runtime*).

---

### 2. Ép Kiểu Đối Tượng (Casting Objects) & Ngoại Lệ `ClassCastException`

1. **Ép kiểu ngầm định (Upcasting):** Chuyển từ kiểu con lên kiểu cha → Luôn an toàn, không cần cú pháp đặc biệt (`Primate p = lemur;`).
2. **Ép kiểu tường minh (Downcasting):** Chuyển từ kiểu cha xuống kiểu con → Cần ép kiểu rõ ràng: `Lemur l = (Lemur) primate;`.
3. **Ngoại lệ `ClassCastException` tại Runtime:** Xảy ra khi ép kiểu đối tượng thực tế sang một kiểu con mà nó không phải là instance:
   ```java
   Rodent rodent = new Rodent();
   Capybara c = (Capybara) rodent; // Biên dịch OK, nhưng NÉM RA ClassCastException tại runtime!
   ```

---

### 3. Quy Tắc Biên Dịch Sống Còn Khi Ép Kiểu Với Interface

Trình biên dịch Java xử lý ép kiểu với Class và Interface hoàn toàn khác nhau:
* **Ép kiểu giữa 2 Class:** Nếu 2 class không cùng nằm trên một nhánh quan hệ kế thừa (không phải cha - con), trình biên dịch sẽ **báo lỗi ngay tại thời điểm biên dịch**:
  ```java
  class Bird {}
  class Fish {}
  Bird b = new Bird();
  Fish f = (Fish) b; // LỖI BIÊN DỊCH: Inconvertible types!
  ```
* **Ép kiểu với Interface:** Trình biên dịch **LUÔN LUÔN CHO PHÉP ép kiểu sang Interface**, ngay cả khi class đó không implement interface:
  ```java
  interface Swims {}
  class Wolf {}
  Wolf w = new Wolf();
  Swims s = (Swims) w; // BIÊN DỊCH THÀNH CÔNG! (Dù tại runtime ném ClassCastException)
  ```
  * *Tại sao?* Vì trình biên dịch suy luận rằng một lớp con của `Wolf` trong tương lai có thể `implements Swims`!
* **NGOẠI LỆ DUY NHẤT:** Nếu lớp đó là **`final`** và không implement interface, trình biên dịch biết chắc chắn 100% không thể có lớp con nào triển khai interface này, nên sẽ báo **LỖI BIÊN DỊCH**:
  ```java
  final class Wolf {}
  Swims s = (Swims) w; // LỖI BIÊN DỊCH: Wolf cannot be cast to Swims!
  ```

---

### 4. Đa Hình Và Ghi Đè Phương Thức (Method Overriding)

Khi một phương thức instance bị ghi đè, **mọi lời gọi đến phương thức đó đều được thay thế tại runtime bởi phiên bản của đối tượng con**, kể cả lời gọi xuất phát từ bên trong lớp cha!

```java
class Penguin {
    public int getHeight() { return 3; }
    public void printInfo() {
        System.out.print(this.getHeight()); // Gọi phương thức bị ghi đè
    }
}
public class EmperorPenguin extends Penguin {
    public int getHeight() { return 8; }
    public static void main(String[] args) {
        new EmperorPenguin().printInfo(); // IN RA 8, KHÔNG PHẢI 3!
    }
}
```

---

### 5. Sự Khác Biệt Giữa Ghi Đè (Overriding) vs Che Giấu (Hiding)

Đây là bẫy thi thường xuyên xuất hiện nhất trong các đề thi OCP:

| Đặc Tính | Method Overriding (Ghi Đè) | Member Hiding (Che Giấu Biến & Static Method) |
| :--- | :--- | :--- |
| **Áp dụng cho** | **Instance method** non-private, non-final | **Biến (Instance & Static variable)** và **Phương thức tĩnh (`static`)** |
| **Cơ chế quyết định** | **Runtime (Dynamic binding)** dựa trên kiểu đối tượng thực tế trong bộ nhớ Heap | **Compile-time (Static binding)** dựa trên kiểu tham chiếu của biến |
| **Tính đa hình** | Có tính đa hình thực sự | **Không có tính đa hình** |

#### Ví dụ kinh điển phân tích rõ bản chất:
```java
class Marsupial {
    protected int age = 2;
    public static boolean isBiped() { return false; }
}

public class Kangaroo extends Marsupial {
    protected int age = 6;
    public static boolean isBiped() { return true; }

    public static void main(String[] args) {
        Kangaroo joey = new Kangaroo();
        Marsupial moey = joey; // Cùng trỏ vào 1 đối tượng Kangaroo duy nhất!

        System.out.println(joey.isBiped()); // true  (Kiểu tham chiếu Kangaroo)
        System.out.println(moey.isBiped()); // false (Kiểu tham chiếu Marsupial -> Static method bị ẩn!)

        System.out.println(joey.age);      // 6      (Kiểu tham chiếu Kangaroo)
        System.out.println(moey.age);      // 2      (Kiểu tham chiếu Marsupial -> Biến bị ẩn!)
    }
}
```

---

## ⚠️ TỔNG KẾT CÁC BẪY THI OCP CHƯƠNG 7 (EXAM TRAPS CHECKLIST)

1. **Interface Variables:** Luôn là `public static final`. Không được gán lại giá trị, bắt buộc khởi tạo khi khai báo.
2. **Interface Static Methods:** Không được kế thừa vào lớp con. Chỉ có thể gọi qua tên `InterfaceName.methodName()`.
3. **Default Methods Conflict:** Lớp con implement 2 interface có cùng default method bắt buộc phải ghi đè lại, nếu không sẽ bị lỗi biên dịch.
4. **Enum Constructors:** Luôn luôn là `private`. Đặt `public` hay `protected` là lỗi biên dịch ngay lập tức.
5. **Enum in Switch:** Trong nhãn `case`, chỉ dùng tên hằng số ngắn (ví dụ: `case SUMMER:`), dùng `case Season.SUMMER:` sẽ bị lỗi biên dịch.
6. **Sealed Subclasses:** Lớp con trực tiếp của sealed class bắt buộc phải mang 1 trong 3 modifier: `final`, `sealed`, hoặc `non-sealed`. Interface con chỉ được là `sealed` hoặc `non-sealed` (cấm `final`).
7. **Record Constraints:** Record không thể `extends` class khác, không thể có thêm biến instance ngoài header, không thể có instance initializer block.
8. **Compact Constructor:** Không có `()`, không được gán `this.field = ...`.
9. **Local & Anonymous Classes:** Chỉ được phép truy cập biến cục bộ của phương thức nếu biến đó là `final` hoặc `effectively final`.
10. **Hiding vs Overriding:** Biến và static method được gọi theo kiểu tham chiếu tại thời điểm biên dịch; chỉ có instance method ghi đè mới được gọi theo đối tượng thực tế tại runtime.
