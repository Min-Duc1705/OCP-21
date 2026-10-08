# Chương 5: Methods (Phương Thức)

> **Tài liệu tham khảo chính:** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff.  
> **Mục tiêu kỳ thi Oracle 1Z0-830:**
> * Thiết kế và khai báo phương thức: Phạm vi truy cập (*Access modifiers*), các từ khóa tùy chọn (*Optional specifiers*), kiểu trả về (*Return types*), chữ ký phương thức (*Method signature*), danh sách ngoại lệ (*Exception list*).
> * Khai báo và sử dụng biến cục bộ (*Local variables*), biến thể hiện (*Instance variables*), từ khóa `final` và khái niệm biến `effectively final`.
> * Khai báo và gọi phương thức có tham số biến đổi (*Varargs*), các ràng buộc vị trí và số lượng varargs.
> * Áp dụng và phân biệt 4 cấp độ truy cập (`private`, package-private, `protected`, `public`), đặc biệt là các quy tắc phức tạp của `protected` giữa các package khác nhau.
> * Thiết kế và sử dụng thành phần tĩnh (*Static fields & Static methods*), quy tắc truy cập giữa static và instance, bẫy gọi static qua tham chiếu `null`, khối khởi tạo tĩnh và `static import`.
> * Cơ chế truyền tham số trong Java (*Pass-by-value* cho cả kiểu nguyên thủy và kiểu tham chiếu).
> * Nạp chồng phương thức (*Method Overloading*), thứ tự ưu tiên phân giải nạp chồng (Exact match $\rightarrow$ Widening primitive $\rightarrow$ Autoboxing $\rightarrow$ Varargs) và các bẫy biên dịch.

---

## 1. Thiết Kế Phương Thức (Designing Methods)

### 1.1. Cấu Trúc Khai Báo Phương Thức

Một khai báo phương thức (*Method Declaration*) hoàn chỉnh xác định toàn bộ thông tin cần thiết để trình biên dịch và người gọi phương thức có thể sử dụng.

```
┌─────────────────┬───────────────────┬─────────────┬─────────────┬─────────────────┬──────────────────────────┬──────────────┐
│ Access Modifier │ Optional Specifier│ Return Type │ Method Name │ Parameter List  │ Exception List (Optional)│ Method Body  │
├─────────────────┼───────────────────┼─────────────┼─────────────┼─────────────────┼──────────────────────────┼──────────────┤
│     public      │       final       │    void     │     nap     │  (int minutes)  │ throws InterruptedException│ { /* Code */ }│
└─────────────────┴───────────────────┴─────────────┴─────────────┴─────────────────┴──────────────────────────┴──────────────┘
                                                    └───────────────────────────────┘
                                                            METHOD SIGNATURE
```

##### BẢNG 5.1: Các thành phần trong khai báo phương thức (TABLE 5.1 in book)
| Thành Phần (*Element*) | Bắt Buộc? (*Required?*) | Mô Tả & Ví Dụ |
| :--- | :---: | :--- |
| **Access modifier** (Phạm vi truy cập) | Không (No) | Mặc định là package access nếu không ghi. Ví dụ: `public`, `protected`, `private`. |
| **Optional specifier** (Từ khóa tùy chọn) | Không (No) | Có thể có 0 hoặc nhiều từ khóa: `static`, `final`, `abstract`, `synchronized`... |
| **Return type** (Kiểu trả về) | **CÓ (Yes)** | Kiểu dữ liệu cụ thể (`int`, `String`...) hoặc `void` nếu không trả về giá trị. |
| **Method name** (Tên phương thức) | **CÓ (Yes)** | Tuân thủ quy tắc đặt tên định danh của Java. |
| **Parameter list** (Danh sách tham số) | **CÓ (Yes)** | Cặp dấu ngoặc đơn `()` là bắt buộc, bên trong có thể rỗng hoặc chứa các tham số. |
| **Method signature** (Chữ ký phương thức) | **CÓ (Yes)** | Bao gồm **Tên phương thức + Danh sách kiểu tham số**: `nap(int)`. |
| **Exception list** (Danh sách ngoại lệ) | Không (No) | Bắt đầu bằng từ khóa `throws`, phân tách bởi dấu phẩy. |
| **Method body** (Thân phương thức) | **CÓ (Yes)** | Khối lệnh `{ ... }`. Ngoại lệ: Phương thức `abstract` hoặc `native` kết thúc bằng dấu chấm phẩy `;`. |

---

### 1.2. Chữ Ký Phương Thức (Method Signature)
> [!IMPORTANT]
> **Chữ ký phương thức (Method Signature)** là căn cứ duy nhất để Java phân biệt các phương thức trong cùng một lớp:
> $$\text{Method Signature} = \text{Tên phương thức} + \text{Danh sách kiểu dữ liệu tham số}$$
> * **KHÔNG bao gồm:** Phạm vi truy cập (`public`/`private`), từ khóa tùy chọn (`static`/`final`), kiểu trả về (`return type`), danh sách ngoại lệ (`throws`), hay tên của các tham số.

---

### 1.3. Phạm Vi Truy Cập (Access Modifiers)
Java cung cấp 4 cấp độ truy cập (chi tiết xem tại Mục 4):
* `private`: Chỉ truy cập được bên trong cùng một lớp.
* **Package Access (Package-private / Default):** Chỉ truy cập được từ các lớp trong cùng package. **Không có từ khóa đại diện** (chỉ cần bỏ trống).
* `protected`: Truy cập được từ cùng package và các lớp con ở bất kỳ package nào.
* `public`: Truy cập được từ mọi nơi.

```java
public class ParkTrip {
   public void skip1() {}
   default void skip2() {} // DOES NOT COMPILE (default không phải access modifier trong class!)
   void public skip3() {}  // DOES NOT COMPILE (access modifier phải đứng trước return type!)
   void skip4() {}         // Hợp lệ (Package-private access)
}
```

---

### 1.4. Các Từ Khóa Tùy Chọn (Optional Specifiers)

##### BẢNG 5.2: Các từ khóa tùy chọn cho phương thức (TABLE 5.2 in book)
| Từ Khóa (*Modifier*) | Ý Nghĩa (*Description*) |
| :--- | :--- |
| **`static`** | Đánh dấu phương thức thuộc về đối tượng lớp dùng chung (*class member*), không phụ thuộc vào thể hiện cụ thể. |
| **`final`** | Ngăn không cho lớp con ghi đè (*override*) phương thức này. |
| **`abstract`** | Dùng trong lớp trừu tượng hoặc interface; phương thức **không có thân hàm** mà kết thúc bằng dấu chấm phẩy `;`. |
| **`default`** | Cung cấp phần thân mặc định cho phương thức bên trong **interface** (từ Java 8). Tuyệt đối không dùng cho class! |
| **`synchronized`** | Dùng trong lập trình đa luồng để khóa tiến trình truy cập đồng thời. |
| **`native`** | Phương thức được viết bằng ngôn ngữ khác (C, C++) thông qua JNI (không có thân hàm). |
| **`strictfp`** | Đảm bảo tính toán số thực dấu phẩy động nhất quán giữa các nền tảng phần cứng. |

> [!CAUTION]
> **Quy tắc thứ tự và tính tương thích:**
> * Bạn có thể khai báo **nhiều specifier tùy chọn** trên cùng một phương thức theo **bất kỳ thứ tự nào**, nhưng tất cả chúng phải đứng **trước kiểu trả về (`return type`)**.
> * **Các từ khóa xung đột:** Không bao giờ được kết hợp `abstract` với `final`, `abstract` với `static`, hoặc `abstract` với `private`!

---

### 1.5. Kiểu Trả Về (Return Type) và Lệnh `return`

1. **Bắt buộc phải có kiểu trả về:** Đứng ngay trước tên phương thức. Nếu không có giá trị trả về, bắt buộc phải dùng từ khóa `void`.
2. **CẤM DÙNG `var` LÀM KIỂU TRẢ VỀ:**
   ```java
   public var getNumber() { return 42; } // DOES NOT COMPILE!
   ```
3. **Quy tắc lệnh `return`:**
   * Phương thức `void`: Có thể không có lệnh `return`, hoặc có lệnh `return;` rỗng để thoát sớm. Tuyệt đối không được trả về giá trị (ví dụ `return 5;` $\rightarrow$ Lỗi biên dịch).
   * Phương thức có kiểu trả về khác `void`: **Mọi luồng thực thi có thể xảy ra** đều bắt buộc phải kết thúc bằng một lệnh `return` mang giá trị có thể chuyển đổi ngầm định sang kiểu trả về đó.

```java
int bad() {
   if (Math.random() > 0.5) return 1;
   // DOES NOT COMPILE: Thiếu return nếu điều kiện if là false!
}

int good() {
   if (Math.random() > 0.5) return 1;
   return 0; // Hợp lệ!
}
```

> [!WARNING]
> **Bẫy Unreachable Code:** Bất kỳ dòng lệnh nào đặt ngay sau lệnh `return` vô điều kiện bên trong cùng một khối lệnh đều khiến trình biên dịch báo lỗi `unreachable statement`.

---

### 1.6. Danh Sách Tham Số (Parameter List)
* Được bọc trong cặp dấu ngoặc đơn `()`. Ngay cả khi phương thức không nhận tham số nào, cặp ngoặc đơn `()` vẫn là bắt buộc.
* **CẤM DÙNG `var` LÀM THAM SỐ PHƯƠNG THỨC:**
   ```java
   public void play(var count) {} // DOES NOT COMPILE!
   ```

---

## 2. Biến Cục Bộ và Biến Thể Hiện (Local and Instance Variables)

### 2.1. Biến Cục Bộ và Từ Khóa `final`
* Biến cục bộ (*Local variables*) được khai báo bên trong một phương thức, constructor, hoặc khối lệnh `{ }`.
* Biến cục bộ **chỉ được phép sử dụng duy nhất một modifier là `final`** (không được dùng `public`, `protected`, `private`, `static`).
* Nếu biến cục bộ được đánh dấu `final`, nó chỉ được gán giá trị **đúng 1 lần duy nhất**:
  ```java
  final int y = 10;
  y = 20; // DOES NOT COMPILE: Không thể gán lại biến final!
  ```

---

### 2.2. Khái Niệm Biến "Effectively Final"
* Một biến cục bộ được coi là **effectively final** nếu giá trị của nó **không hề bị thay đổi sau khi được khởi tạo lần đầu**, bất kể biến đó có được gắn từ khóa `final` hay không.
* **Mẹo thi kiểm tra nhanh:** Hãy thử thêm từ khóa `final` vào trước khai báo biến đó. Nếu code vẫn biên dịch thành công thì biến đó là *effectively final*.

```java
public String zooFriends() {
   String name = "Harry the Hippo"; // Effectively final (không bị gán lại)
   var size = 10;                   // KHÔNG effectively final (bị thay đổi ở dòng dưới)
   boolean wet;                     // Effectively final (chỉ gán đúng 1 lần)
   if (size > 100) size++;
   name.substring(0);               // String là immutable, không làm đổi name!
   wet = true;
   return name;
}
```

---

### 2.3. Biến Thể Hiện (Instance Variables) và Khởi Tạo `final`

##### BẢNG 5.3: Các từ khóa tùy chọn cho biến thể hiện (TABLE 5.3 in book)
| Từ Khóa (*Modifier*) | Mô Tả (*Description*) |
| :--- | :--- |
| **`final`** | Biến thể hiện phải được gán giá trị xác định đúng một lần cho mỗi đối tượng. |
| **`volatile`** | Báo hiệu cho JVM biết biến này có thể bị sửa đổi bởi nhiều luồng khác nhau (bảo đảm tính hiển thị trong bộ nhớ). |
| **`transient`** | Đánh dấu biến không được tuần tự hóa (*serialization*) khi ghi đối tượng ra luồng I/O. |

#### Quy Tắc Sống Còn Của Biến Thể Hiện `final`:
1. Biến `final` thể hiện **KHÔNG được tự động gán giá trị mặc định** (`0`, `null`, `false`).
2. Nó bắt buộc phải được gán giá trị **đúng 1 lần duy nhất** tại một trong ba vị trí sau:
   * **Vị trí 1:** Ngay tại dòng khai báo biến.
   * **Vị trí 2:** Bên trong khối khởi tạo thể hiện (*Instance Initializer* `{ }`).
   * **Vị trí 3:** Bên trong **mọi constructor** của lớp đó.

```java
public class PolarBear {
   final int age = 10;       // Cách 1: Gán ngay lúc khai báo
   final int fishEaten;      // Cách 2: Gán trong khối initializer
   final String name;        // Cách 3: Gán trong constructor

   { fishEaten = 10; }

   public PolarBear() {
      name = "Robert";
   }

   public PolarBear(int height) {
      name = "Baby Bear";    // Mọi constructor đều phải gán giá trị cho name!
   }
}
```

> [!CAUTION]
> Nếu có bất kỳ constructor nào quên không gán giá trị cho biến `final name`, hoặc gán giá trị 2 lần $\rightarrow$ Trình biên dịch báo lỗi ngay lập tức!

---

## 3. Tham Số Biến Đổi (Working with Varargs)

### 3.1. Hai Quy Tắc Vàng Của Varargs (`...`)
Khi khai báo một phương thức nhận tham số biến đổi (*Variable Arguments*):
1. **Một phương thức chỉ được phép có TỐI ĐA MỘT tham số varargs.**
2. **Tham số varargs BẮT BUỘC PHẢI LÀ THAM SỐ CUỐI CÙNG trong danh sách tham số.**

```java
public void walk1(int... nums) {}        // HỢP LỆ
public void walk2(int start, int... nums) {} // HỢP LỆ (varargs đứng cuối)
public void walk3(int... nums, int end) {}   // DOES NOT COMPILE (varargs không đứng cuối!)
public void walk4(int... m, int... n) {}    // DOES NOT COMPILE (có nhiều hơn 1 varargs!)
```

---

### 3.2. Gọi Phương Thức Có Varargs
Bên trong thân phương thức, Java đối xử với `int... nums` tương tự như một mảng `int[] nums`. Người gọi có thể truyền theo các cách sau:

```java
public static void run(int... steps) {
   System.out.print(steps.length + " ");
}

public static void main(String[] args) {
   run(1, 2, 3);               // In ra: 3 (Truyền danh sách phân tách dấu phẩy)
   run(new int[] {10, 20});    // In ra: 2 (Truyền trực tiếp một mảng)
   run();                      // In ra: 0 (Không truyền gì -> Java tự tạo mảng rỗng length = 0)
   run(null);                  // Ném NullPointerException nếu phương thức truy cập steps.length!
}
```

---

## 4. Áp Dụng Phạm Vi Truy Cập (Applying Access Modifiers)

Phạm vi truy cập quyết định lớp nào có quyền gọi phương thức hoặc đọc/ghi trường dữ liệu.

##### BẢNG 5.4: Ma trận cấp độ truy cập (TABLE 5.4 in book)
> *"Một phương thức nằm trong `[Cột 1]` có thể truy cập thành phần `[Hàng]` hay không?"*

| Vị Trí Gọi Phương Thức | Thành Phần `private` | Thành Phần Package (Mặc định) | Thành Phần `protected` | Thành Phần `public` |
| :--- | :---: | :---: | :---: | :---: |
| **Cùng một lớp (*Same class*)** | **Có (Yes)** | **Có (Yes)** | **Có (Yes)** | **Có (Yes)** |
| **Lớp khác trong cùng package** | **Không (No)** | **Có (Yes)** | **Có (Yes)** | **Có (Yes)** |
| **Lớp con ở package khác (*Subclass*)** | **Không (No)** | **Không (No)** | **Có (Yes)** | **Có (Yes)** |
| **Lớp bất kỳ ở package khác** | **Không (No)** | **Không (No)** | **Không (No)** | **Có (Yes)** |

---

### 4.1. BẪY THI TỬ THẦN: Quy Tắc `protected` Khi Kế Thừa Khác Package
Đây là một trong những câu hỏi bẫy khó nhất trong kỳ thi OCP!
* Một lớp con ở package khác chỉ có thể truy cập thành phần `protected` của lớp cha **thông qua tính kế thừa** (sử dụng từ khóa `super.`, `this.` hoặc truy cập trực tiếp tên trường).
* Lớp con **KHÔNG ĐƯỢC PHÉP truy cập thành phần `protected` thông qua một biến tham chiếu trỏ tới đối tượng cha (`Parent`)**!

#### Ví Dụ Minh Họa Bẫy Phòng Thi:
```java
package pond.shore;
public class Bird {
   protected String text = "floating";
   protected void floatInWater() {
      System.out.print(text);
   }
}

package pond.goose;
import pond.shore.Bird;

public class Goose extends Bird {
   public void helpGoose() {
      Goose other = new Goose();
      other.floatInWater(); // HỢP LỆ: other là kiểu Goose (chính lớp con đó)
      System.out.print(other.text); // HỢP LỆ
   }

   public void helpOtherBird() {
      Bird other = new Bird();
      other.floatInWater(); // DOES NOT COMPILE! (Không được gọi qua tham chiếu Bird!)
      System.out.print(other.text); // DOES NOT COMPILE!
   }
}
```

> [!CAUTION]
> **Quy tắc thi OCP:** Lớp con `Goose` chỉ có thể kế thừa và truy cập thành phần `protected` của chính nó hoặc một thể hiện `Goose` khác. Nó không có quyền truy cập vào thành phần `protected` của một đối tượng `Bird` độc lập bất kỳ!

---

## 5. Truy Cập Dữ Liệu Tĩnh (Accessing Static Data)

### 5.1. Khái Niệm Thành Phần Tĩnh (`static`)
* Khi từ khóa `static` được áp dụng cho biến hoặc phương thức, thành phần đó **thuộc về lớp** chứ không thuộc về một thể hiện cụ thể nào của lớp.
* Biến tĩnh (*static variable*) chỉ có duy nhất một bản sao trong bộ nhớ và được chia sẻ chung cho toàn bộ các đối tượng của lớp đó.

---

### 5.2. Gọi Thành Phần `static` Qua Tham Chiếu `null` — BẪY PHÒNG THI KINH ĐIỂN!
Bạn có thể truy cập thành phần tĩnh thông qua tên lớp: `Koala.count` (cách tốt nhất), hoặc thông qua một biến tham chiếu: `k.count`.

> [!CAUTION]
> **CỰC KỲ QUAN TRỌNG:**  
> Trình biên dịch Java kiểm tra kiểu dữ liệu của biến tham chiếu tại **thời điểm biên dịch (*compile-time*)**, và tự động thay thế lời gọi qua biến thành lời gọi qua tên lớp!  
> **Ngay cả khi biến tham chiếu mang giá trị `null`, Java vẫn thực thi bình thường và KHÔNG HỀ NÉM `NullPointerException`!**

```java
public class Koala {
   public static int count = 0;
}

public class Test {
   public static void main(String[] args) {
      Koala k = null;
      System.out.println(k.count); // IN RA 0! Hoàn toàn KHÔNG bị NullPointerException!
      // Trình biên dịch chuyển đổi k.count trực tiếp thành Koala.count!
   }
}
```

---

### 5.3. Ma Trận Quan Hệ Giữa Static và Instance

##### BẢNG 5.5: Quan hệ gọi giữa static và instance (TABLE 5.5 in book)
| Phương Thức Gọi | Thành Phần Được Gọi | Tính Hợp Lệ (*Legal?*) | Giải Thích |
| :--- | :--- | :---: | :--- |
| **Static method** | **Static method / variable** | **CÓ (Yes)** | Cả hai đều thuộc về lớp, không cần đối tượng. |
| **Static method** | **Instance method / variable** | **KHÔNG (No)** | **Lỗi biên dịch:** Không thể gọi thành phần thể hiện nếu không tạo đối tượng (`new`) cụ thể! |
| **Instance method**| **Static method / variable** | **CÓ (Yes)** | Thể hiện có toàn quyền gọi thành phần của lớp. |
| **Instance method**| **Instance method / variable**| **CÓ (Yes)** | Cùng thuộc thể hiện của lớp. |

```java
public class Gorilla {
   public static int count;
   public int total;

   public static void addGorilla() { count++; }
   public void babyGorilla() { count++; }

   public static void announceBabies() {
      addGorilla();     // Hợp lệ (static gọi static)
      babyGorilla();    // DOES NOT COMPILE! (static không thể gọi trực tiếp instance method!)
   }

   public static double average = total / count; // DOES NOT COMPILE! (biến static dùng biến instance!)
}
```

---

### 5.4. Biến `static final` và Khối Khởi Tạo Tĩnh (`static { }`)
* Biến `static final` phải được khởi tạo đúng **1 lần duy nhất**:
  * Hoặc ngay tại dòng khai báo.
  * Hoặc bên trong một **khối khởi tạo tĩnh (*Static Initializer*)**.
* **TUYỆT ĐỐI KHÔNG ĐƯỢC khởi tạo biến `static final` trong constructor** (vì constructor chỉ chạy khi tạo đối tượng mới, trong khi biến static tồn tại độc lập với đối tượng).

```java
public class Panda {
   public static final int MAXIMUM_EMPERORS = 10;
   public static final int TOTAL_BEARS;

   static {
      TOTAL_BEARS = 20; // Khởi tạo trong khối static initializer
   }
}
```

---

### 5.5. Nhập Tĩnh (Static Imports)
Dùng để nhập trực tiếp các thành viên tĩnh (phương thức, hằng số) của lớp khác vào file hiện tại.

```java
import static java.util.Arrays.asList; // Nhập 1 phương thức tĩnh cụ thể
import static java.util.Arrays.*;      // Nhập tất cả các thành viên tĩnh của Arrays

// BẪY BIÊN DỊCH THƯỜNG GẶP TRONG BÀI THI:
static import java.util.Arrays.*;      // DOES NOT COMPILE (sai thứ tự: phải là 'import static')
import static java.util.Arrays;        // DOES NOT COMPILE (Arrays là tên lớp, không phải thành viên tĩnh!)
```

---

## 6. Truyền Dữ Liệu Giữa Các Phương Thức (Passing Data among Methods)

### 6.1. Bản Chất: Java LUÔN LUÔN Là Pass-by-Value
> [!IMPORTANT]
> **Quy tắc tuyệt đối:** Java **luôn luôn truyền theo giá trị (*Pass-by-value*)**. Một bản sao (*copy*) của đối số luôn được tạo ra và truyền vào phương thức.

#### 1. Truyền Kiểu Nguyên Thủy (Primitive Types):
Bản sao của giá trị bit được truyền đi. Mọi phép gán lại hoặc biến đổi bên trong phương thức **hoàn toàn không làm ảnh hưởng** đến biến gốc ở phương thức gọi.
```java
public static void addOne(int num) {
   num = num + 1;
}

public static void main(String[] args) {
   int num = 4;
   addOne(num);
   System.out.println(num); // Vẫn in ra 4!
}
```

#### 2. Truyền Kiểu Đối Tượng Tham Chiếu (Reference Types):
Bản sao của **địa chỉ tham chiếu (pointer)** được truyền đi. Cả hai biến tham chiếu (ở `main` và trong tham số hàm) đều đang cùng trỏ tới một vùng nhớ đối tượng duy nhất trên Heap.

* **Trường hợp 1 (Thay đổi trạng thái đối tượng):** Gọi phương thức làm biến đổi nội dung đối tượng (như `sb.append()`, `list.add()`) $\rightarrow$ **Đối tượng gốc trên Heap BỊ THAY ĐỔI**!
* **Trường hợp 2 (Gán lại biến tham chiếu):** Dùng toán tử gán `=` trỏ biến tham số sang một đối tượng mới trên Heap $\rightarrow$ **Biến gốc ở phương thức gọi HOÀN TOÀN KHÔNG BỊ ẢNH HƯỞNG**!

```java
public static void modify(StringBuilder sb, String s) {
   sb.append(" added"); // Thay đổi trực tiếp đối tượng trên Heap!
   s = s + " added";    // Tạo String mới và gán lại cho biến tham số cục bộ s!
}

public static void main(String[] args) {
   var sb = new StringBuilder("start");
   var s = "start";
   modify(sb, s);
   System.out.println(sb); // In ra: "start added" (Bị thay đổi!)
   System.out.println(s);  // In ra: "start" (Không hề thay đổi!)
}
```

---

### 6.2. Autoboxing và Unboxing Trong Lời Gọi Hàm
* **Autoboxing:** Java tự động chuyển kiểu nguyên thủy sang Wrapper tương ứng (`int` $\rightarrow$ `Integer`).
* **Unboxing:** Chuyển từ Wrapper sang kiểu nguyên thủy (`Integer` $\rightarrow$ `int`).

> [!WARNING]
> **Bẫy `NullPointerException` khi Unboxing:**  
> Nếu đối tượng Wrapper mang giá trị `null` và được truyền vào vị trí đòi hỏi kiểu nguyên thủy, Java sẽ tự động gọi `.intValue()` và ném ngay ngoại lệ **`NullPointerException`** tại runtime!
> ```java
> Integer value = null;
> int x = value; // Throws NullPointerException at runtime!
> ```

---

## 7. Nạp Chồng Phương Thức (Overloading Methods)

### 7.1. Định Nghĩa
**Nạp chồng phương thức (Method Overloading)** xảy ra khi trong cùng một lớp có nhiều phương thức mang **cùng tên** nhưng có **chữ ký phương thức khác nhau** (tức là khác nhau về **danh sách tham số**).

* **Hợp lệ khi:** Khác nhau về kiểu dữ liệu tham số, số lượng tham số, hoặc thứ tự các kiểu dữ liệu tham số.
* **KHÔNG TẠO NÊN OVERLOAD (Gây lỗi biên dịch nếu trùng tên & tham số):**
  * Chỉ khác nhau về kiểu trả về (`return type`).
  * Chỉ khác nhau về phạm vi truy cập (`access modifier`).
  * Chỉ khác nhau về từ khóa `static`.
  * Chỉ khác nhau về tên biến tham số.
  * Chỉ khác nhau về danh sách ngoại lệ `throws`.

```java
public void fly(int numMiles) {}
public int fly(int numMiles) {} // DOES NOT COMPILE: Trùng tên và tham số, chỉ khác kiểu trả về!
```

---

### 7.2. Thứ Tự Ưu Tiên Phân Giải Nạp Chồng (Overloading Resolution Order)

Khi có nhiều phương thức nạp chồng, Java sẽ chọn phương thức "cụ thể nhất" (*most specific*) theo thứ tự ưu tiên nghiêm ngặt sau:

##### BẢNG 5.6: Thứ tự lựa chọn phương thức nạp chồng của Java (TABLE 5.6 in book)
| Thứ Tự Ưu Tiên | Quy Tắc Lựa Chọn (*Rule*) | Ví Dụ Gọi Với `glide(1, 2)` (kiểu `int, int`) |
| :---: | :--- | :--- |
| **1 (Cao nhất)** | **Khớp chính xác kiểu dữ liệu (*Exact match by type*)** | `String glide(int i, int j)` |
| **2** | **Nới rộng kiểu nguyên thủy (*Larger primitive type / Widening*)** | `String glide(long i, long j)` |
| **3** | **Tự động bao gói đối tượng (*Autoboxed type*)** | `String glide(Integer i, Integer j)` |
| **4 (Thấp nhất)**| **Tham số biến đổi (*Varargs*)** | `String glide(int... nums)` |

#### Minh Họa Bài Toán Phân Giải:
```java
public class Glider {
   public static String glide(String s) { return "1"; }
   public static String glide(String... s) { return "2"; }
   public static String glide(Object o) { return "3"; }
   public static String glide(String s, String t) { return "4"; }

   public static void main(String[] args) {
      System.out.print(glide("a"));           // In ra: "1" (Exact match 1 String)
      System.out.print(glide("a", "b"));      // In ra: "4" (Exact match 2 Strings)
      System.out.print(glide("a", "b", "c")); // In ra: "2" (Varargs)
   }
}
```

---

### 7.3. Các Bẫy Nạp Chồng Nâng Cao

#### Bẫy 1: Java CẤM 2 Bước Chuyển Đổi Liên Tiếp!
Java cho phép:
* Widening primitive: `int` $\rightarrow$ `long`.
* Autoboxing: `int` $\rightarrow$ `Integer`.
* Widening reference: `Integer` $\rightarrow$ `Number` $\rightarrow$ `Object`.

**TUYỆT ĐỐI KHÔNG CHO PHÉP:** Widening rồi Autoboxing (hoặc ngược lại) trong cùng một đối số!
```java
void play(Long x) {}

// Gọi hàm:
play(4); // DOES NOT COMPILE!
// 4 là int. Java không thể vừa nới rộng int -> long vừa autobox long -> Long!
```

#### Bẫy 2: Phân Biệt `List.remove(int)` vs `List.remove(Object)`
```java
var list = new ArrayList<Integer>();
list.add(1);
list.add(2);

list.remove(1); // Gọi phiên bản remove(int index) -> Xóa phần tử tại index 1 (số 2)!
System.out.println(list); // In ra: [1]

list.remove(Integer.valueOf(1)); // Gọi remove(Object o) -> Xóa đối tượng mang giá trị 1!
System.out.println(list); // In ra: []
```

#### Bẫy 3: Mảng và Varargs Có Cùng Chữ Ký Bytecode
```java
public void fly(int[] lengths) {}
public void fly(int... lengths) {} // DOES NOT COMPILE!
// Trình biên dịch coi cả hai đều có chữ ký tham số là int[], báo lỗi duplicate method!
```

---

## 8. Tóm Tắt Trọng Tâm Phòng Thi (Exam Essentials)

1. **Hiểu rõ các thành phần của phương thức:** Phương thức bắt buộc phải có kiểu trả về, tên phương thức, cặp ngoặc đơn danh sách tham số `()`, và thân hàm `{}` (trừ khi là `abstract`/`native`). Kiểu trả về và tham số **không bao giờ được phép dùng `var`**.
2. **Nắm vững quy tắc biến `final` và `effectively final`:** Biến `final` không thể gán lại giá trị. Biến thể hiện `final` bắt buộc phải được khởi tạo đúng một lần tại khai báo, khối khởi tạo `{}` hoặc trong mọi constructor. Biến cục bộ được coi là *effectively final* nếu giá trị không bị đổi sau lần gán đầu tiên.
3. **Quy tắc Varargs:** Tối đa 1 tham số varargs và bắt buộc phải nằm ở vị trí cuối cùng trong danh sách tham số.
4. **Bảng phân quyền truy cập Access Modifiers:**
   * `private` (cùng class) $\rightarrow$ Package-private (cùng package) $\rightarrow$ `protected` (cùng package + lớp con khác package) $\rightarrow$ `public` (mọi nơi).
   * Lớp con ở package khác chỉ được truy cập thành viên `protected` thông qua cơ chế kế thừa, không được truy cập qua tham chiếu biến cha.
5. **Đặc tính của thành phần tĩnh (`static`):**
   * Thuộc về lớp, chia sẻ giữa tất cả các instance.
   * Gọi qua biến tham chiếu `null` **không gây lỗi `NullPointerException`** vì Java dùng kiểu dữ liệu tĩnh lúc biên dịch.
   * Phương thức static **không thể gọi trực tiếp thành phần instance** mà không tạo đối tượng.
   * `import static` đúng cú pháp; cấm dùng `static import` hoặc import tên lớp trực tiếp.
6. **Bản chất Pass-by-Value:** Java chỉ sao chép giá trị. Thay đổi trạng thái đối tượng sẽ được lưu lại, nhưng gán lại biến tham chiếu sang đối tượng mới sẽ không ảnh hưởng đến caller.
7. **Thứ tự ưu tiên nạp chồng (Overloading Priority):**
   $$\text{Exact match} \longrightarrow \text{Widening primitive} \longrightarrow \text{Autoboxing} \longrightarrow \text{Varargs}$$
   Java không bao giờ thực hiện 2 bước chuyển đổi liên tiếp (như `int` sang `Long`).
