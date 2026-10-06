# Hướng Dẫn Ôn Tập OCP Java SE 21 - Chương 12: Modules (JPMS & CLI Tools)

> **Mục tiêu trọng tâm kỳ thi 1Z0-830 (Exam Objectives):**
> * Hiểu động lực, kiến trúc và các lợi ích cốt lõi của **Java Platform Module System (JPMS)**.
> * Khai báo và cấu hình file **`module-info.java`** với đầy đủ các chỉ thị (directives): `exports`, `exports ... to`, `requires`, `requires transitive`, `requires static`, `opens`, `opens ... to`, `provides ... with`, `uses`.
> * Biên dịch (`javac`), đóng gói (`jar`), và thực thi (`java`) ứng dụng modular độc lập hoặc có liên kết đa module qua dòng lệnh.
> * Thiết kế và triển khai kiến trúc dịch vụ lỏng lẻo (**Service Provider Architecture**) với 4 thành phần kết hợp `java.util.ServiceLoader`.
> * Sử dụng thành thạo các công cụ phân tích và đóng gói CLI: `java` (`--list-modules`, `--describe-module`, `--show-module-resolution`), `jar`, `jdeps`, `jmod`, `jlink`, `jpackage`.
> * Nắm vững bản chất và sự khác biệt giữa 3 loại module: **Named Module**, **Automatic Module**, và **Unnamed Module**; thuật toán suy diễn tên Automatic Module từ file JAR.
> * Nắm chắc các chiến lược di chuyển hệ thống (**Bottom-Up Migration** vs. **Top-Down Migration**), xử lý phụ thuộc vòng (**Cyclic Dependencies**), gói phân mảnh (**Split Packages**), và các cờ ghi đè cấu hình runtime.

---

## 1. Tổng Quan Về Java Platform Module System (JPMS)

Trước Java 9, toàn bộ mã nguồn ứng dụng và các thư viện phụ thuộc (JARs) đều được nạp chung vào một không gian phẳng gọi là **Classpath**. Cơ chế này bộc lộ 3 vấn đề cố hữu (thường gọi là **"Classpath Hell"** hay **"JAR Hell"**):
1. **Thiếu cấu hình tin cậy (No Reliable Configuration):** JVM không hề kiểm tra xem tất cả các lớp phụ thuộc có mặt đầy đủ hay không lúc khởi động. Nếu thiếu một thư viện, chương trình vẫn chạy cho đến khi thực thi đến dòng mã cần nạp lớp đó mới bất ngờ văng lỗi `NoClassDefFoundError` hoặc `ClassNotFoundException`.
2. **Đóng gói lỏng lẻo (Weak Encapsulation):** Trong Java truyền thống, mọi lớp khai báo `public` đều có thể được truy cập bởi bất kỳ lớp nào khác trên Classpath. Các nhà phát triển thư viện không có cách nào để giấu kín các gói nội bộ (internal implementation packages) nếu muốn các gói trong cùng thư viện chia sẻ mã nguồn với nhau.
3. **Môi trường Runtime cồng kềnh (Monolithic Runtime):** Dù ứng dụng chỉ viết một hàm `println` đơn giản, nó vẫn phải nạp toàn bộ thư viện chuẩn của Java (file `rt.jar` khổng lồ > 60MB). Điều này gây lãng phí tài nguyên bộ nhớ và hạn chế tối đa việc đóng gói ứng dụng nhẹ cho Cloud / Docker containers / IoT.

Từ Java 9, **Project Jigsaw** chính thức mang **JPMS** vào Java với các lợi ích vượt trội:
* **Kiểm soát truy cập cấp độ Module (Better Access Control):** Xuất hiện thêm tầng bảo vệ: Một class `public` chỉ có thể được gọi từ module khác nếu package chứa nó được **export** tường minh trong `module-info.java`.
* **Cấu hình tin cậy & Báo lỗi sớm (Reliable Configuration & Fail-Fast):** Khi ứng dụng khởi động, JVM dựng đồ thị module (module graph). Nếu thiếu bất kỳ module phụ thuộc nào, JVM sẽ lập tức báo lỗi và dừng chương trình ngay tại thời điểm khởi động.
* **Tùy biến môi trường thực thi (`jlink`):** Cho phép tạo một bản Java Runtime Image tối giản, chỉ đóng gói đúng các module JDK mà ứng dụng thực sự sử dụng (giảm kích thước từ ~300MB xuống còn 30–40MB).
* **Cải thiện hiệu năng:** Lập chỉ mục module hóa giúp tăng tốc độ nạp lớp (class loading) và tối ưu hóa bộ nhớ runtime.

```
+-------------------------------------------------------------------------+
|                               MODULE                                    |
|                                                                         |
|  +--------------------------------+  +-------------------------------+  |
|  |        Exported Package        |  |       Internal Package        |  |
|  |     (Public API for World)     |  |   (Hidden from other modules) |  |
|  +--------------------------------+  +-------------------------------+  |
|                                                                         |
|         module-info.java (Root descriptor: requires, exports...)        |
+-------------------------------------------------------------------------+
```

---

## 2. Xây Dựng & Vận Hành Chương Trình Modular Đầu Tiên

### Cấu Trúc Thư Mục Chuẩn (Directory Structure)
Mỗi module bắt buộc phải có một file mô tả mang tên **`module-info.java`** đặt tại **thư mục gốc (root)** của module đó.

Giả sử ta xây dựng module `zoo.animal.feeding`:
```text
feeding/
|-- module-info.java
|-- zoo/
    |-- animal/
        |-- feeding/
            |-- Task.java
```

* File `feeding/module-info.java`:
```java
module zoo.animal.feeding {
    exports zoo.animal.feeding;
}
```

* File `feeding/zoo/animal/feeding/Task.java`:
```java
package zoo.animal.feeding;

public class Task {
    public static void main(String... args) {
        System.out.println("All fed!");
    }
}
```

> [!WARNING]
> **Bẫy thi Oracle:**
> 1. Tên file mô tả module bắt buộc phải là **`module-info.java`** (có dấu gạch ngang `-`). Nếu đề thi viết `module_info.java` hoặc `ModuleInfo.java` $\rightarrow$ **Lỗi biên dịch**.
> 2. File `module-info.java` nằm ở thư mục root (default package), **không bao giờ** được chứa dòng khai báo `package ...;`.
> 3. Cụm khai báo module kết thúc bằng dấu ngoặc nhọn `{ }`, **không có** dấu chấm phẩy `;` sau ngoặc nhọn đóng.

---

### Quy Trình Dòng Lệnh: Compile $\rightarrow$ Package $\rightarrow$ Run

#### 1. Biên dịch với `javac`
```bash
javac -d feeding feeding/zoo/animal/feeding/*.java feeding/module-info.java
```
* Cờ `-d feeding`: Chỉ định thư mục lưu trữ các file `.class` sau khi biên dịch (bao gồm cả `module-info.class`).
* Nếu module phụ thuộc vào các module khác đã được đóng gói thành file JAR trong thư mục `mods`, ta thêm cờ `-p` (hoặc `--module-path`):
```bash
javac -p mods -d feeding feeding/zoo/animal/feeding/*.java feeding/module-info.java
```

#### 2. Đóng gói JAR với `jar`
```bash
jar -cvf mods/zoo.animal.feeding.jar -C feeding .
```
* `-c` (`--create`): Tạo file JAR mới.
* `-v` (`--verbose`): In chi tiết tiến trình nén file ra console.
* `-f` (`--file`): Đường dẫn và tên file JAR đầu ra.
* `-C feeding .`: Chuyển con trỏ làm việc vào thư mục `feeding` và nén toàn bộ nội dung bên trong (`.`).

#### 3. Thực thi với `java`
Chạy trực tiếp từ thư mục chứa file class đã biên dịch:
```bash
java -p feeding -m zoo.animal.feeding/zoo.animal.feeding.Task
```
Hoặc chạy từ file JAR trong thư mục `mods`:
```bash
java -p mods -m zoo.animal.feeding/zoo.animal.feeding.Task
```
* `-p` (hoặc `--module-path`): Đường dẫn module path chỉ đến thư mục chứa JAR hoặc thư mục class.
* `-m` (hoặc `--module`): Định danh lớp khởi chạy theo định dạng chuẩn: `<moduleName>/<fullyQualifiedClassName>`.
* > [!CAUTION]
  > Ký tự phân cách giữa tên module và tên class bắt buộc là **dấu gạch chéo `/`**. Trong đề thi, nếu dùng dấu chấm `.`, hai chấm `:`, hay gạch chéo ngược `\` đều là **sai cú pháp**!

---

## 3. Quản Lý Nhiều Module & Đầy Đủ Directives Trong `module-info.java`

Để minh họa sự tương tác giữa các module, giáo trình OCP 21 xây dựng hệ thống quản lý sở thú gồm 4 module:
1. `zoo.animal.feeding`: Cung cấp thức ăn (`exports zoo.animal.feeding;`).
2. `zoo.animal.care`: Chăm sóc y tế. Có 2 package:
   - `zoo.animal.care.medical`: Chứa lớp `Diet`, là API công khai $\rightarrow$ **được export**.
   - `zoo.animal.care.details`: Chứa lớp `HippoBirthday`, là dữ liệu nội bộ $\rightarrow$ **không export** (được giấu kín).
   - Khai báo:
     ```java
     module zoo.animal.care {
         exports zoo.animal.care.medical;
         requires zoo.animal.feeding;
     }
     ```
3. `zoo.animal.talks`: Thuyết trình cho khách tham quan. Cần cả thức ăn và hồ sơ y tế:
   ```java
   module zoo.animal.talks {
       exports zoo.animal.talks.content;
       exports zoo.animal.talks.media;
       requires zoo.animal.feeding;
       requires zoo.animal.care;
   }
   ```
4. `zoo.staff`: Nhân viên quản lý vườn thú:
   ```java
   module zoo.staff {
       requires zoo.animal.talks;
       requires zoo.animal.care;
       requires zoo.animal.feeding;
   }
   ```

---

### Phân Tích Chi Tiết Toàn Bộ Directives (TABLE 12.5)

Các từ khóa trong `module-info.java` được gọi là **Restricted Keywords**: Chúng chỉ đóng vai trò từ khóa bên trong file `module-info.java`; trong các file `.java` thông thường, bạn vẫn có thể đặt tên biến hoặc phương thức là `module`, `exports`, `requires`, v.v.

#### 1. `exports <package>;`
* Cho phép các module bên ngoài truy cập vào các class/interface `public` (và `protected` qua kế thừa) trong package được chỉ định.
* **Quy tắc bắt buộc:** Sau `exports` **luôn luôn là TÊN PACKAGE**, không bao giờ là tên class hay tên module!
* Các package không được export sẽ được bảo vệ tuyệt đối: Ngay cả khi class trong package đó là `public`, code bên ngoài cũng không thể import hay nhìn thấy.

#### 2. `exports <package> to <module1>, <module2>;` (Qualified Exports)
* Giới hạn quyền truy cập: Chỉ những module có tên được liệt kê sau từ khóa `to` mới được phép truy cập package này. Các module khác ngoài danh sách vẫn bị chặn.

#### 3. `requires <module>;`
* Khai báo sự phụ thuộc: Module hiện tại cần module được chỉ định ở cả compile-time và runtime.
* **Quy tắc bắt buộc:** Sau `requires` **luôn luôn là TÊN MODULE**, không bao giờ là tên package!
* Mọi module đều tự động có khai báo ngầm định `requires java.base;`. Khai báo tường minh dòng này không lỗi nhưng là dư thừa (redundant).

#### 4. `requires transitive <module>;` (Implied Readability / Phụ Thuộc Bắc Cầu)
* Khi module `B` khai báo `requires transitive A;`, bất kỳ module `C` nào khai báo `requires B;` sẽ **tự động nhìn thấy và đọc được module `A`** mà không cần phải tự mình viết `requires A;`.
* **Kịch bản thực tế:** Khi một method `public` của module `B` nhận tham số hoặc trả về một đối tượng có kiểu dữ liệu thuộc module `A`, `B` **bắt buộc** phải dùng `requires transitive A;` để module `C` gọi method đó không bị lỗi thiếu kiểu dữ liệu.

*Áp dụng vào ví dụ Zoo:*
```java
// Trong zoo.animal.care:
module zoo.animal.care {
    exports zoo.animal.care.medical;
    requires transitive zoo.animal.feeding; // Bắc cầu feeding!
}

// Trong zoo.animal.talks:
module zoo.animal.talks {
    exports zoo.animal.talks.content;
    requires zoo.animal.care; // Tự động đọc được cả zoo.animal.feeding!
}
```

#### 5. `requires static <module>;` (Optional Dependency)
* Khai báo phụ thuộc **bắt buộc ở compile-time**, nhưng **tùy chọn (optional) ở runtime**.
* Thường dùng cho các thư viện logging, code generation, hoặc annotation processors (như Lombok) vốn chỉ cần thiết khi biên dịch mà không bắt buộc phải có mặt khi chạy ứng dụng.

#### 6. `opens <package>;` & `opens <package> to <module>;` (Deep Reflection)
* Cho phép package được truy cập qua cơ chế **Phản Chiếu (Reflection)** lúc runtime (bao gồm cả việc gọi `setAccessible(true)` để đọc/ghi các trường `private`).
* Tại thời điểm biên dịch, package được `opens` **không hề** được mở cho code thường gọi trực tiếp.
* Rất quan trọng khi làm việc với các framework như Spring, Hibernate, Jackson, JUnit.

#### 7. `open module <moduleName> { ... }` (Open Modules)
* Mở **toàn bộ** các package trong module cho reflection lúc runtime.
* > [!CAUTION]
  > **Bẫy thi cực hiểm:** Một `open module` **KHÔNG ĐƯỢC CHỨA** directive `opens` bên trong khối `{ }`. Việc viết `opens` bên trong `open module` sẽ gây ra **Lỗi biên dịch** (`redundant opens statement in open module`)! Nhưng bên trong `open module` hoàn toàn được chứa `exports`, `requires`, `provides`, `uses`.

---

### Ma Trận Kiểm Soát Truy Cập Với Modules (TABLE 12.3)

| Modifier | Trong cùng một class | Trong cùng một package | Phân cấp package trong cùng Module | Module bên ngoài (Package KHÔNG export) | Module bên ngoài (Package ĐƯỢC export) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `private` | Có | Không | Không | Không | Không |
| Package-private | Có | Có | Không | Không | Không |
| `protected` | Có | Có | Có (qua kế thừa) | Không | **Chỉ qua kế thừa (Subclassing)** |
| `public` | Có | Có | Có | **KHÔNG** | **CÓ** |

---

## 4. Kiến Trúc Dịch Vụ (Services & ServiceLoader)

Dịch vụ (Service) trong Java triển khai nguyên lý **Loose Coupling (Phụ thuộc lỏng lẻo)**: Module tiêu dùng (Consumer) chỉ biết đến giao diện trừu tượng và không cần biết lớp nào cài đặt cụ thể ở bên dưới.

```
       +-------------------------------------------------------+
       | 1. Service Provider Interface (SPI): Interface        |
       |    Module: zoo.tours.api                              |
       |    File: Tour.java, Souvenir.java                     |
       |    module-info: exports zoo.tours.api;                |
       +-------------------------------------------------------+
                     ^                           ^
           cài đặt (implements)                  | lookup
                     |                           |
+------------------------------------+   +------------------------------------+
| 2. Service Provider (Impl)         |   | 3. Service Locator                 |
|    Module: zoo.tours.agency        |   |    Module: zoo.tours.reservations  |
|    File: SouvenirTourImpl.java     |   |    File: TourFinder.java           |
|    module-info:                    |   |    module-info:                    |
|      requires zoo.tours.api;       |   |      requires zoo.tours.api;       |
|      provides Tour with ImplClass; |   |      uses zoo.tours.api.Tour;      |
+------------------------------------+   |      exports ...;                  |
                                         +------------------------------------+
                                                           ^
                                                     gọi service
                                                           |
                                         +------------------------------------+
                                         | 4. Consumer                        |
                                         |    Module: zoo.visitor             |
                                         |    module-info:                    |
                                         |      requires zoo.tours.res;       |
                                         +------------------------------------+
```

### 4 Thành Phần Của Một Service (TABLE 12.4)

#### Thành phần 1: Service Provider Interface (SPI)
Là một `interface` hoặc `abstract class` định nghĩa tập hợp các chức năng.
* Module `zoo.tours.api`:
```java
// Tour.java
package zoo.tours.api;

public interface Tour {
    String name();
    int length();
}

// module-info.java
module zoo.tours.api {
    exports zoo.tours.api;
}
```

#### Thành phần 2: Service Provider (Implementation)
Là lớp cụ thể hiện thực hóa SPI.
* Module `zoo.tours.agency`:
```java
// SouvenirTourImpl.java
package zoo.tours.agency;
import zoo.tours.api.Tour;

public class SouvenirTourImpl implements Tour {
    public SouvenirTourImpl() {} // Bắt buộc phải có public no-arg constructor!
    public String name() { return "Souvenir Tour"; }
    public int length() { return 60; }
}

// module-info.java
module zoo.tours.agency {
    requires zoo.tours.api;
    provides zoo.tours.api.Tour with zoo.tours.agency.SouvenirTourImpl;
}
```
* **Quy tắc về Provider Class:**
  1. Phải có một **`public` constructor không tham số (no-arg constructor)**.
  2. HOẶC phải có một phương thức tĩnh public mang tên `provider()` trả về đối tượng cài đặt (`public static Tour provider() { return ...; }`).

#### Thành phần 3: Service Locator
Chịu trách nhiệm quét và nạp các Service Provider đang có mặt trên module path bằng `java.util.ServiceLoader`.
* Module `zoo.tours.reservations`:
```java
// TourFinder.java
package zoo.tours.reservations;
import java.util.*;
import zoo.tours.api.Tour;

public class TourFinder {
    public static List<Tour> findAllTours() {
        List<Tour> tours = new ArrayList<>();
        ServiceLoader<Tour> loader = ServiceLoader.load(Tour.class);
        for (Tour tour : loader) {
            tours.add(tour);
        }
        return tours;
    }
}

// module-info.java
module zoo.tours.reservations {
    requires zoo.tours.api;
    uses zoo.tours.api.Tour; // BẮT BUỘC KHAI BÁO USES!
    exports zoo.tours.reservations;
}
```

#### Thành phần 4: Consumer
Module người dùng cuối gọi Service Locator để thực thi nghiệp vụ:
```java
module zoo.visitor {
    requires zoo.tours.reservations;
}
```
* **Điểm đột phá:** Consumer **hoàn toàn không cần require** module `zoo.tours.agency`! Bạn có thể thêm, bớt hoặc thay thế module Provider mà không cần sửa hay biên dịch lại module Consumer.

> [!IMPORTANT]
> **Bẫy thi Service Directives:**
> 1. Trong module chứa Service Locator, nếu gọi `ServiceLoader.load(Tour.class)` mà quên khai báo `uses zoo.tours.api.Tour;` trong `module-info.java`: Code vẫn biên dịch thành công nhưng khi chạy sẽ văng **`ServiceConfigurationError`**!
> 2. Cú pháp `provides <SPI> with <ImplClass>;`:
>    - Trước `with` là **Interface / Abstract class**.
>    - Sau `with` là **Implementation Class**.
> 3. Cú pháp `uses <SPI>;`:
>    - Sau `uses` **luôn luôn là Interface / Abstract class**, không bao giờ là class implementation!

---

## 5. Khám Phá Module & Các Công Cụ CLI (Command-Line Tools)

### Các Module Có Sẵn Của JDK (Built-in Modules)
* **`java.base`:** Chứa các thư viện nền tảng (`java.lang`, `java.util`, `java.io`, `java.time`, `java.math`, `java.net`, `java.nio`, `java.util.stream`). Tự động được require bởi mọi module.
* **`java.desktop`:** Chứa AWT và Swing.
* **`java.logging`:** Chứa Logging API (`java.util.logging`).
* **`java.sql`:** Chứa JDBC API.
* **`java.xml`:** Chứa XML processing APIs.
* **`jdk.unsupported`:** Module chứa các API nội bộ cũ (như `sun.misc.Unsafe`). Không nên sử dụng vì có thể bị xóa ở các bản Java tương lai.

---

### Bảng Tổng Hợp Tùy Chọn CLI Chuẩn OCP (TABLE 12.10 - 12.16)

#### 1. Lệnh `javac` (Biên dịch)
* `-d <dir>`: Thư mục đích lưu trữ file `.class`.
* `-p <path>` hoặc `--module-path <path>`: Đường dẫn đến các module phụ thuộc.
* `-cp <path>` hoặc `-classpath` hoặc `--class-path`: Đường dẫn Classpath truyền thống cho non-modular code.

#### 2. Lệnh `java` (Thực thi & Tra cứu)
* `-m <name>` hoặc `--module <name>`: Module và class khởi chạy (`<module>/<class>`).
* `-d <name>` hoặc `--describe-module <name>`: In ra cấu trúc của module (exports gì, requires gì, provides gì).
  * Ví dụ lệnh: `java -p mods -d zoo.animal.feeding`
  * Đầu ra mẫu:
    ```text
    zoo.animal.feeding file:///path/mods/zoo.animal.feeding.jar
    exports zoo.animal.feeding
    requires java.base mandated
    ```
* `--list-modules`: Liệt kê các module khả dụng trong JDK và module path.
* `--show-module-resolution`: Hiển thị chi tiết quá trình phân giải đồ thị module khi ứng dụng nạp vào bộ nhớ.

#### 3. Lệnh `jar` (Đóng gói)
* `-c` (`--create`): Tạo file JAR mới.
* `-v` (`--verbose`): Hiển thị chi tiết.
* `-f <name>` (`--file <name>`): Chỉ định tên file JAR.
* `-C <dir>`: Chuyển thư mục nguồn.
* `-d` hoặc `--describe-module`: In thông tin `module-info.class` bên trong file JAR mà không cần giải nén.
  * Ví dụ: `jar -f mods/zoo.animal.feeding.jar -d`

#### 4. Lệnh `jdeps` (Java Dependency Analysis Tool)
* Dùng để phân tích các phụ thuộc tĩnh của ứng dụng:
* `-s` hoặc `-summary`: In tóm tắt ngắn gọn các module phụ thuộc.
* `--module-path <path>`: Chỉ định module path khi phân tích.
* `--jdk-internals` (hoặc `-jdkinternals`): Quét xem ứng dụng có đang gọi các API nội bộ bị khóa của JDK hay không (ví dụ gọi `sun.misc.Unsafe`), đồng thời gợi ý API chuẩn thay thế.

#### 5. Lệnh `jmod` (JMOD Tool)
* Đóng gói các tài nguyên đặc biệt: Native code (`.dll`, `.so`), header files C/C++, cấu hình người dùng vào định dạng `.jmod`.
* Các mode: `create`, `extract`, `list`, `describe`, `hash`.
* > [!WARNING]
  > **Bẫy thi:** File `.jmod` chỉ phục vụ lúc biên dịch hoặc liên kết (`jlink`). Bạn **KHÔNG THỂ** dùng lệnh `java` để chạy file `.jmod`!

#### 6. Lệnh `jlink` (Java Linker)
* Tạo ra một môi trường **Custom Java Runtime Image** độc lập, chỉ chứa đúng các module cần thiết để chạy ứng dụng:
  ```bash
  jlink -p $JAVA_HOME/jmods:mods --add-modules zoo.animal.feeding --output custom-jre
  ```
* Thư mục `custom-jre/bin` sẽ chứa sẵn file chạy `java` độc lập, không cần cài JDK trên máy khách.
* > [!CAUTION]
  > **Điều kiện nghiêm ngặt của `jlink`:** `jlink` **CHỈ** hoạt động với **Named Modules**! Nếu trên module path có bất kỳ **Automatic Module** hay Unnamed Module nào, lệnh `jlink` sẽ lập tức báo lỗi và thất bại.

#### 7. Lệnh `jpackage` (Java Application Packaging Tool)
* Đóng gói mã nguồn Java kèm theo Runtime Image thành tệp cài đặt nguyên bản (Native Installer) theo hệ điều hành:
  * Windows: `.exe`, `.msi`
  * macOS: `.dmg`, `.pkg`
  * Linux: `.deb`, `.rpm`
* Tùy chọn cho modular app:
  ```bash
  jpackage -n ZooApp -p mods -m zoo.animal.feeding/zoo.animal.feeding.Task
  ```
* Tùy chọn cho non-modular app:
  ```bash
  jpackage -n MyApp -i inputDir --main-class com.foo.Main --main-jar app.jar
  ```
* Cờ quan trọng: `-n` (`--name`), `-p` (`--module-path`), `-m` (`--module`), `-i` (`--input`), `--main-class`, `--main-jar`, `--app-version`.

---

## 6. So Sánh 3 Loại Module (Types of Modules)

Một trong những nội dung có nhiều câu hỏi nhất trong đề thi OCP 21 là so sánh giữa **Named Module**, **Automatic Module**, và **Unnamed Module**.

```
+-----------------------------------------------------------------------------------------------+
|                                      3 LOẠI MODULE TRONG JAVA                                 |
+--------------------+---------------------------------------+----------------------------------+
| 1. Named Module    | Đặt trên Module Path (-p)             | BẮT BUỘC có module-info.java     |
+--------------------+---------------------------------------+----------------------------------+
| 2. Automatic Module| Đặt trên Module Path (-p)             | KHÔNG có module-info.java        |
+--------------------+---------------------------------------+----------------------------------+
| 3. Unnamed Module  | Đặt trên Classpath (-cp)              | KHÔNG quan tâm module-info       |
|                    | (Code cũ / Legacy code)               | (nếu có cũng BỊ BỎ QUA)          |
+--------------------+---------------------------------------+----------------------------------+
```

### Thuật Toán Xác Định Tên Cho Automatic Module (TABLE 12.17)
Khi đưa một file JAR cũ (không có `module-info.class`) lên Module Path (`-p`), JVM tự động xem nó là Automatic Module với quy tắc đặt tên như sau:
1. **Kiểm tra file `MANIFEST.MF`:** Nếu có cặp khóa `Automatic-Module-Name: com.mycompany.mylib`, JVM dùng giá trị này làm tên module.
2. **Nếu Manifest không khai báo, suy diễn từ tên file JAR:**
   * **Bước 1:** Bỏ phần mở rộng `.jar`.
   * **Bước 2:** Bỏ thông tin phiên bản (phần bắt đầu bằng dấu gạch ngang theo sau bởi chữ số, ví dụ `-1.0.0-SNAPSHOT` hoặc `-2.1`).
   * **Bước 3:** Thay thế tất cả các ký tự đặc biệt (không phải chữ cái và chữ số, như `-`, `_`, `$`) bằng dấu chấm `.`.
   * **Bước 4:** Gộp các dấu chấm liền kề (`..`) thành một dấu chấm đơn `.`.
   * **Bước 5:** Bỏ dấu chấm ở đầu hoặc cuối chuỗi nếu có.

*Ví dụ trong sách giáo trình:*
| Tên file JAR ban đầu | Bỏ `.jar` | Bỏ version | Thay ký tự đặc biệt | Gộp chấm & bỏ đầu/cuối | Tên Automatic Module |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `commons2-x-1.0.0-SNAPSHOT.jar` | `commons2-x-1.0.0-SNAPSHOT` | `commons2-x` | `commons2.x` | `commons2.x` | **`commons2.x`** |
| `mod_$-1.0.jar` | `mod_$-1.0` | `mod_$` | `mod..` | `mod` | **`mod`** |

---

### Bảng Đối Chiếu Tính Chất Của 3 Loại Module (TABLE 12.18)

| Thuộc Tính (Property) | Named Module | Automatic Module | Unnamed Module |
| :--- | :--- | :--- | :--- |
| **Vị trí lưu trữ** | Module path (`-p` / `--module-path`) | Module path (`-p` / `--module-path`) | Classpath (`-cp` / `--class-path`) |
| **Có `module-info.java` không?** | **Bắt buộc có** | **Không** | Bị **BỎ QUA** nếu có |
| **Xác định tên module từ đâu?** | Được đặt tên trong `module-info.java` | Từ `MANIFEST.MF` hoặc tên file JAR | Không có tên (Unnamed) |
| **Export những package nào cho Named Module?** | Chỉ những package được khai báo trong `exports` | **TẤT CẢ** các package | **KHÔNG** export package nào |
| **Export những package nào cho Automatic Module?** | Chỉ những package được khai báo trong `exports` | **TẤT CẢ** các package | **TẤT CẢ** các package |
| **Đọc được (Read) những module nào khác?** | Chỉ những module khai báo trong `requires` (+ `java.base`) | **TẤT CẢ** các module (Named, Automatic, Unnamed) | **TẤT CẢ** các module (trên cả module-path và classpath) |
| **Được require bởi Named Module không?** | **CÓ** (`requires <namedMod>;`) | **CÓ** (`requires <autoName>;`) | **KHÔNG THỂ** (Named module không thể require unnamed module!) |

---

## 7. Chiến Lược Chuyển Đổi Hệ Thống (Migration Strategies & Traps)

Khi nâng cấp ứng dụng cũ sang JPMS, Oracle đề xuất 2 chiến lược chuyển đổi chính (TABLE 12.19):

### Bottom-Up Migration (Từ Dưới Lên)
* **Quy trình:** Bắt đầu chuyển đổi từ các module ở tầng thấp nhất (các thư viện không phụ thuộc vào bất kỳ thư viện nào khác).
  1. Thêm `module-info.java` cho các thư viện tầng dưới và đặt chúng lên **Module path** $\rightarrow$ Chúng trở thành **Named Modules**.
  2. Các module tầng trên (chưa nâng cấp) vẫn giữ nguyên trên **Classpath** $\rightarrow$ Chúng hoạt động như **Unnamed Module**.
  3. Vì Unnamed Module có thể đọc mọi thứ trên Module path, toàn bộ ứng dụng vẫn biên dịch và hoạt động bình thường trong suốt quá trình chuyển đổi.
* **Ưu điểm:** Cấu trúc chặt chẽ, kiểm soát hoàn toàn mã nguồn từ gốc.

### Top-Down Migration (Từ Trên Xuống)
* **Quy trình:** Bắt đầu chuyển đổi từ module ứng dụng cấp cao nhất (ví dụ Main/UI Application).
  1. Đưa tất cả các thư viện tầng dưới cũ (chưa có `module-info.java`) lên **Module path** $\rightarrow$ Chúng tự động trở thành **Automatic Modules**.
  2. Thêm `module-info.java` cho module cấp cao nhất, khai báo `requires` tên của các Automatic Module.
  3. Dần dần bổ sung `module-info.java` cho từng Automatic Module để biến chúng thành Named Module hoàn chỉnh.
* **Ưu điểm:** Phù hợp khi ứng dụng phụ thuộc vào nhiều thư viện bên thứ ba (Third-party JARs) chưa được tác giả module hóa.

---

### Hai Vấn Đề Lỗi Phổ Biến Khi Migration

#### 1. Phụ Thuộc Vòng (Cyclic Dependencies)
* JPMS **nghiêm cấm** phụ thuộc vòng giữa các module (ví dụ: Module A requires Module B, và Module B lại requires Module A, trực tiếp hoặc gián tiếp).
* Trình biên dịch sẽ lập tức báo lỗi: `cyclic dependence involving module ...`.
* **Cách khắc phục:**
  1. Tách các lớp dùng chung giữa A và B ra một module thứ ba độc lập (Module C), sau đó cả A và B cùng `requires C`.
  2. Gộp Module A và Module B thành một Module duy nhất.
  3. Sử dụng mô hình **Services (`uses` / `provides`)** để loại bỏ phụ thuộc trực tiếp.

#### 2. Xung Đột Gói Phân Mảnh (Split Packages)
* JPMS bắt buộc: **Một package không được phép nằm trong nhiều hơn một module**.
* Nếu Module 1 và Module 2 cùng chứa package `com.company.util`, JVM sẽ báo lỗi ngay khi khởi chạy.
* **Cách khắc phục:** Đổi tên package ở một trong hai module hoặc sáp nhập chúng lại.

---

### Các Cờ CLI Ghi Đè Cấu Hình (Override Flags)
Dùng khi chạy hoặc kiểm thử ứng dụng mà không muốn sửa đổi file `module-info.java`:
* **`--add-exports <source-module>/<package>=<target-module>`:** Ép buộc export một package cho module khác lúc runtime.
* **`--add-opens <source-module>/<package>=<target-module>`:** Ép buộc mở package cho reflection lúc runtime.
* **`--add-reads <source-module>=<target-module>`:** Cấp quyền đọc module mục tiêu cho module nguồn lúc runtime.

---

## 8. Bảng Tổng Hợp Bẫy Thi & Ghi Nhớ Nhanh (Exam Traps Checklist)

> [!TIP]
> ### 10 Bẫy Thi Trọng Tâm Cần Nằm Lòng Khi Làm Bài
> 1. **Tên file:** Bắt buộc là `module-info.java` (dấu gạch ngang `-`, chữ thường, đặt tại root directory).
> 2. **Tham số của các Directives:**
>    - Sau `exports`, `opens`: Luôn là **PACKAGE NAME**.
>    - Sau `requires`, `requires transitive`, `requires static`: Luôn là **MODULE NAME**.
>    - Sau `uses`: Luôn là **INTERFACE / ABSTRACT CLASS NAME**.
>    - Sau `provides`: Luôn là **INTERFACE / ABSTRACT CLASS**, theo sau bởi `with` rồi đến **IMPLEMENTATION CLASS**.
> 3. **Open Module:** Trong `open module`, **TUYỆT ĐỐI CẤM** dùng chỉ thị `opens` bên trong khối `{ }` (gây lỗi biên dịch: redundant opens).
> 4. **Service Locator:** Quên khai báo `uses` trong `module-info.java` khi gọi `ServiceLoader.load()` $\rightarrow$ Vẫn biên dịch thành công nhưng ném **`ServiceConfigurationError`** lúc runtime!
> 5. **Service Provider Constructor:** Class Provider bắt buộc phải có **`public` no-arg constructor** hoặc phương thức static `provider()`.
> 6. **Giới hạn của `jlink`:** `jlink` chỉ hỗ trợ **Named Modules**; không thể đóng gói Automatic Module hoặc Unnamed Module.
> 7. **Lệnh `jmod`:** File `.jmod` **không thể** chạy trực tiếp bằng lệnh `java`.
> 8. **Named Module và Unnamed Module:** Named module **không thể** `requires` Unnamed module (lỗi biên dịch).
> 9. **JAR có `module-info.class` trên classpath:** Nếu đặt trên `-cp`, JVM xem nó là **Unnamed Module** và **bỏ qua hoàn toàn** file `module-info.class`.
> 10. **Cú pháp chạy module:** Lệnh `java -m <module>/<class>` dùng dấu **gạch chéo `/`** giữa module và class (không dùng dấu chấm hay hai chấm).
