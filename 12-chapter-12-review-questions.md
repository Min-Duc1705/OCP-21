# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chapter 12: Modules

> **Nguồn trích dẫn:** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Trang 1091–1102).  
> **Số lượng:** 25 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết từ Appendix B (Trang 1398–1403).  
> **Cách học:** Bạn hãy tự đọc đề và suy luận đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và khắc sâu các bẫy thi của Oracle.

---

### Câu 1 (Question 1)
**Phát biểu nào sau đây là đúng về module sau đây?**

```text
|---zoo
   |-- staff
      |-- Vet.java
```

* A. Cấu trúc thư mục được hiển thị là một module hợp lệ.
* B. Cấu trúc thư mục sẽ trở thành module hợp lệ nếu file `module.java` được thêm trực tiếp bên dưới `zoo/staff`.
* C. Cấu trúc thư mục sẽ trở thành module hợp lệ nếu file `module.java` được thêm trực tiếp bên dưới `zoo`.
* D. Cấu trúc thư mục sẽ trở thành module hợp lệ nếu file `module-info.java` được thêm trực tiếp bên dưới `zoo/staff`.
* E. Cấu trúc thư mục sẽ trở thành module hợp lệ nếu file `module-info.java` được thêm trực tiếp bên dưới `zoo`.
* F. Không có thay đổi nào ở trên có thể biến cấu trúc thư mục này thành một module hợp lệ.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E**
* **Phân tích chi tiết:**
  * Để một thư mục được công nhận là một Java module hợp lệ, nó **bắt buộc** phải chứa file mô tả mang tên chính xác là `module-info.java` đặt tại **thư mục gốc (root)** của module đó.
  * Trong cấu trúc trên, thư mục gốc của module là `zoo`. Do đó, file `module-info.java` phải nằm trực tiếp bên dưới `zoo` (ngang hàng với thư mục package `staff`).
  * Đặt `module-info.java` bên dưới `zoo/staff` là sai vị trí vì nó sẽ bị coi là nằm trong package `staff`.
  * Các file có tên `module.java` không có ý nghĩa khai báo module trong Java.
* **Bẫy thi cần nhớ:** File khai báo module bắt buộc phải là `module-info.java` (có dấu gạch ngang `-`, chữ thường) và đặt ở thư mục root (default package), không được chứa dòng khai báo `package`.
</details>

---

### Câu 2 (Question 2)
**Giả sử module `puppy` phụ thuộc vào module `dog`, và module `dog` phụ thuộc vào module `animal`. Điền vào chỗ trống để mã nguồn trong module `dog` có thể truy cập package `animal.behavior` trong module `animal`:**

```java
module animal {
    _________ animal.behavior;
}
```

* A. `export`
* B. `exports`
* C. `require`
* D. `requires`
* E. `require transitive`
* F. `requires transitive`
* G. Không có đáp án nào ở trên

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Phân tích chi tiết:**
  * Để cho phép code bên ngoài module truy cập vào một package công khai, module sở hữu package đó phải sử dụng chỉ thị **`exports <tên_package>;`**.
  * Các từ khóa `export`, `require`, `require transitive` không tồn tại trong cú pháp Java (chúng thiếu chữ `s` ở cuối).
  * `requires` và `requires transitive` dùng để khai báo sự phụ thuộc vào một **module**, không dùng cho package và không dùng để mở quyền truy cập cho module khác.
* **Bẫy thi cần nhớ:** `exports` luôn đi kèm với **tên package**; `requires` luôn đi kèm với **tên module**. Cả hai từ khóa đều kết thúc bằng chữ cái **`s`** (`exports`, `requires`).
</details>

---

### Câu 3 (Question 3)
**Điền vào các chỗ trống để câu lệnh chạy chương trình sau là hợp lệ:**

```bash
java
_________ modules
_________ zoo.animal.talks/zoo/animal/talks/Peacocks
```

* A. `-d` và `-m`
* B. `-d` và `-p`
* C. `-m` và `-d`
* D. `-m` và `-p`
* E. `-p` và `-d`
* F. `-p` và `-m`
* G. Không có đáp án nào ở trên

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **G**
* **Phân tích chi tiết (Bẫy thi kinh điển!):**
  * Thoạt nhìn, ta thấy cờ chỉ định module path là `-p` (hoặc `--module-path`) và cờ chỉ định module khởi chạy là `-m` (hoặc `--module`), khiến nhiều thí sinh vội vàng chọn `F` (`-p` và `-m`).
  * **Tuy nhiên, hãy quan sát kỹ tham số phía sau:**
    `zoo.animal.talks/zoo/animal/talks/Peacocks`
  * Trong Java, cú pháp của cờ `-m` là `<moduleName>/<fullyQualifiedClassName>`.
  * Tên lớp đầy đủ (fully qualified class name) **bắt buộc phải phân tách bằng dấu chấm `.`**, ví dụ: `zoo.animal.talks.Peacocks`.
  * Trong đề bài, tên lớp lại viết bằng dấu gạch chéo `/` (`zoo/animal/talks/Peacocks`). Dấu gạch chéo `/` chỉ dùng duy nhất 1 lần để ngăn cách giữa **tên module** và **tên class**.
  * Do đó, câu lệnh này hoàn toàn sai cú pháp và không thể chạy được $\rightarrow$ Đáp án đúng là **G (None of the above)**.
</details>

---

### Câu 4 (Question 4)
**Cặp thành phần nào sau đây kết hợp lại tạo thành một Dịch vụ (Service)?**

* A. Consumer và service locator
* B. Consumer và service provider interface
* C. Service locator và service provider
* D. Service locator và service provider interface
* E. Service provider và service provider interface

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Phân tích chi tiết:**
  * Theo định nghĩa của giáo trình OCP 21 (Mục *Creating a Service*): Một **Service** được cấu thành từ:
    1. **Service Provider Interface (SPI):** Giao diện (interface) hoặc lớp trừu tượng định nghĩa chức năng, cùng các lớp phụ trợ liên quan.
    2. **Service Locator:** Cơ chế tìm kiếm và nạp các lớp cài đặt (sử dụng `ServiceLoader`).
  * Bản thân **Service Provider** là lớp cài đặt cụ thể (implementation), nó độc lập và **không được coi là một phần của Service**.
  * **Consumer** là ứng dụng khách tiêu dùng dịch vụ, cũng không thuộc về bản thân dịch vụ.
* **Bẫy thi cần nhớ:** Service = SPI + Service Locator. Implementation (Service Provider) nằm riêng biệt để đảm bảo tính phụ thuộc lỏng lẻo (loose coupling).
</details>

---

### Câu 5 (Question 5)
**Một _____________ module nằm trên classpath trong khi một _____________ module nằm trên module path. (Chọn tất cả các đáp án đúng.)**

* A. automatic, named
* B. automatic, unnamed
* C. named, automatic
* D. named, unnamed
* E. unnamed, automatic
* F. unnamed, named
* G. Không có đáp án nào ở trên

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E, F**
* **Phân tích chi tiết:**
  * **Unnamed Module:** Đại diện cho tất cả các file JAR và class truyền thống được đặt trên **Classpath** (`-cp` / `--class-path`).
  * **Named Module:** File JAR đã được module hóa (có `module-info.java`) đặt trên **Module path** (`-p` / `--module-path`).
  * **Automatic Module:** File JAR cũ (không có `module-info.java`) nhưng được đặt trên **Module path** (`-p` / `--module-path`).
  * Vế trước là classpath $\rightarrow$ phải là **unnamed module**. Vế sau là module path $\rightarrow$ có thể là **automatic** hoặc **named** module.
  * Do đó, cả **E** (`unnamed, automatic`) và **F** (`unnamed, named`) đều đúng.
</details>

---

### Câu 6 (Question 6)
**Phát biểu nào sau đây là đúng về các chỉ thị trong file `module-info.java`? (Chọn tất cả các đáp án đúng.)**

* A. Chỉ thị `opens` cho phép sử dụng cơ chế phản chiếu (reflection).
* B. Chỉ thị `opens` khai báo rằng một API đang được gọi.
* C. Chỉ thị `use` cho phép sử dụng cơ chế phản chiếu (reflection).
* D. Chỉ thị `use` khai báo rằng một API đang được gọi.
* E. Chỉ thị `uses` cho phép sử dụng cơ chế phản chiếu (reflection).
* F. Chỉ thị `uses` khai báo rằng một API đang được gọi (tiêu dùng dịch vụ).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, F**
* **Phân tích chi tiết:**
  * Chỉ thị `opens` cho phép các framework truy cập sâu vào package thông qua Reflection tại runtime (kể cả gọi `setAccessible(true)` với thành phần private) $\rightarrow$ **A đúng**.
  * Chỉ thị `uses` dùng trong Service Locator để khai báo rằng module này có nhu cầu nạp và tiêu dùng một Service Provider Interface $\rightarrow$ **F đúng**.
  * Không có chỉ thị nào tên là `use` (thiếu `s`) $\rightarrow$ C và D sai.
</details>

---

### Câu 7 (Question 7)
**Tên Automatic Module sẽ được tự động tạo ra nếu không được chỉ định trong Manifest. Cặp tên file JAR và tên Automatic Module tạo ra nào sau đây là đúng? (Chọn tất cả các đáp án đúng.)**

* A. `emily-1.0.0.jar` và `emily`
* B. `emily-1.0.0-SNAPSHOT.jar` và `emily`
* C. `emily_the_cat-1.0.0.jar` và `emily_the_cat`
* D. `emily_the_cat-1.0.0.jar` và `emily-the-cat`
* E. `emily.$.jar` và `emily`
* F. `emily.$.jar` và `emily.`
* G. `emily.$.jar` và `emily..`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B, E**
* **Phân tích chi tiết (Thuật toán đặt tên Automatic Module):**
  1. Loại bỏ đuôi `.jar`.
  2. Loại bỏ thông tin phiên bản ở cuối tên (phần bắt đầu bằng dấu gạch ngang theo sau bởi số, ví dụ `-1.0.0` hay `-1.0.0-SNAPSHOT`) $\rightarrow$ `emily-1.0.0.jar` và `emily-1.0.0-SNAPSHOT.jar` đều cho ra `emily` $\rightarrow$ **A và B đúng**.
  3. Thay thế tất cả các ký tự không phải chữ/số (như `_`, `-`, `$`) thành dấu chấm `.`. Với `emily_the_cat-1.0.0.jar`, sau khi bỏ version còn `emily_the_cat`, chuyển thành `emily.the.cat` (chứ không giữ nguyên `_` hay đổi thành `-`) $\rightarrow$ C và D sai.
  4. Gộp các dấu chấm liền nhau (`..`) thành một dấu chấm đơn `.`.
  5. Loại bỏ dấu chấm ở đầu hoặc cuối chuỗi. Với `emily.$.jar`, bỏ `.jar` còn `emily.$`, đổi `$` thành `.` thành `emily..`, gộp chấm thành `emily.`, bỏ chấm cuối còn `emily` $\rightarrow$ **E đúng**, F và G sai.
</details>

---

### Câu 8 (Question 8)
**Phát biểu nào sau đây là đúng? (Chọn tất cả các đáp án đúng.)**

* A. Các module có phụ thuộc vòng (cyclic dependencies) sẽ không thể biên dịch.
* B. Các package có phụ thuộc vòng (cyclic dependency) sẽ không thể biên dịch.
* C. Một phụ thuộc vòng luôn luôn chỉ liên quan đến chính xác hai module.
* D. Một phụ thuộc vòng luôn luôn liên quan đến ít nhất hai câu lệnh `requires`.
* E. Một unnamed module có thể tham gia vào một phụ thuộc vòng với một automatic module.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, D**
* **Phân tích chi tiết:**
  * JPMS cấm tuyệt đối phụ thuộc vòng giữa các module. Nếu module A requires B và B requires A (trực tiếp hoặc bắc cầu), trình biên dịch sẽ báo lỗi `cyclic dependence` $\rightarrow$ **A đúng**.
  * Java hoàn toàn cho phép các package phụ thuộc lẫn nhau (Class trong package 1 gọi Class trong package 2 và ngược lại) $\rightarrow$ B sai.
  * Phụ thuộc vòng có thể liên quan đến 2 module (`A -> B -> A`) hoặc nhiều hơn 2 module (`A -> B -> C -> A`), do đó phát biểu "luôn luôn chỉ đúng 2 module" là sai $\rightarrow$ C sai.
  * Để tạo thành vòng lặp phụ thuộc khép kín thì phải có ít nhất 2 liên kết `requires` (ví dụ `A requires B` và `B requires A`) $\rightarrow$ **D đúng**.
  * Unnamed module nằm trên classpath và không có tên, các module trên module path (kể cả automatic module) không thể khai báo `requires` unnamed module $\rightarrow$ Không thể tạo phụ thuộc vòng với unnamed module $\rightarrow$ E sai.
</details>

---

### Câu 9 (Question 9)
**Giả sử bạn đang tạo một Service Provider chứa class sau đây. Dòng mã nào sau đây cần phải có trong file `module-info.java` của bạn?**

```java
package dragon;
import magic.*;

public class Dragon implements Magic {
    public String getPower() {
        return "breathe fire";
    }
}
```

* A. `provides dragon.Dragon by magic.Magic;`
* B. `provides dragon.Dragon using magic.Magic;`
* C. `provides dragon.Dragon with magic.Magic;`
* D. `provides magic.Magic by dragon.Dragon;`
* E. `provides magic.Magic using dragon.Dragon;`
* F. `provides magic.Magic with dragon.Dragon;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F**
* **Phân tích chi tiết:**
  * Cú pháp chuẩn của chỉ thị khai báo Service Provider là:
    `provides <Tên_Interface_Hoặc_Abstract_Class> with <Tên_Class_Cài_Đặt>;`
  * Ở đây, `Magic` là interface (SPI) và `Dragon` là class cài đặt (Provider).
  * Từ khóa đi kèm bắt buộc là **`with`** (không phải `by` hay `using`).
  * Do đó, câu lệnh chính xác là: `provides magic.Magic with dragon.Dragon;` $\rightarrow$ **F đúng**.
</details>

---

### Câu 10 (Question 10)
**Điều gì là đúng về một module chứa file `module-info.java` có nội dung sau đây? (Chọn tất cả các đáp án đúng.)**

```java
module com.food.supplier {}
```

* A. Tất cả các package bên trong module được tự động export.
* B. Không có package nào bên trong module được tự động export.
* C. Phương thức `main` bên trong module vẫn có thể được thực thi bình thường.
* D. Phương thức `main` bên trong module không thể chạy được vì class không được công khai.
* E. File `module-info.java` bị lỗi biên dịch.
* F. Tên file `module-info.java` là không đúng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, C**
* **Phân tích chi tiết:**
  * Một module hoàn toàn có thể để trống thân `{}` (không khai báo `exports` hay `requires` nào). File này biên dịch hoàn toàn hợp lệ $\rightarrow$ E và F sai.
  * Mặc định trong JPMS, cơ chế đóng gói mạnh (strong encapsulation) được áp dụng: Nếu không có chỉ thị `exports` tường minh, **không có package nào được export ra ngoài** $\rightarrow$ **B đúng**, A sai.
  * Việc export package chỉ nhằm mục đích cho phép các module khác truy cập mã nguồn lúc biên dịch/chạy. Nó **không bắt buộc** đối với việc chạy phương thức `main()` từ dòng lệnh bằng cờ `-m com.food.supplier/<className>` $\rightarrow$ **C đúng**, D sai.
</details>

---

### Câu 11 (Question 11)
**Giả sử module `puppy` phụ thuộc vào module `dog`, và module `dog` phụ thuộc vào module `animal`. Những dòng mã nào cho phép module `puppy` truy cập package `animal.behavior` trong module `animal`? (Chọn tất cả các đáp án đúng.)**

```java
module animal {
   exports animal.behavior;
}
module dog {
     _____________ animal;  // line S
}
module puppy {
     _____________ dog;     // line T
}
```

* A. `require` trên dòng S
* B. `require` trên dòng T
* C. `requires` trên dòng S
* D. `requires` trên dòng T
* E. `require transitive` trên dòng S
* F. `require transitive` trên dòng T
* G. `requires transitive` trên dòng S
* H. `requires transitive` trên dòng T

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D, G, H**
* **Phân tích chi tiết:**
  * Các từ khóa `require` và `require transitive` (thiếu `s`) không tồn tại $\rightarrow$ Loại A, B, E, F.
  * Để `puppy` đọc được `animal` gián tiếp thông qua `dog`, module `dog` bắt buộc phải chuyển tiếp quyền đọc bằng **`requires transitive animal;`** trên dòng S $\rightarrow$ **G đúng** (Nếu dòng S chỉ dùng `requires animal;` thì `puppy` sẽ không nhìn thấy `animal`).
  * Khi `dog` đã khai báo `requires transitive animal;`:
    * Module `puppy` chỉ cần viết **`requires dog;`** trên dòng T là đủ để ngầm định đọc được `animal` $\rightarrow$ **D đúng**.
    * Ngoài ra, nếu `puppy` dùng **`requires transitive dog;`** trên dòng T, nó vẫn đọc được `dog` (và cả `animal`) hoàn toàn bình thường, đồng thời chuyển tiếp tiếp cho các module sau $\rightarrow$ **H đúng**.
</details>

---

### Câu 12 (Question 12)
**Những module nào sau đây được cung cấp sẵn bởi JDK? (Chọn tất cả các đáp án đúng.)**

* A. `java.base`
* B. `java.desktop`
* C. `java.logging`
* D. `java.util`
* E. `jdk.base`
* F. `jdk.compiler`
* G. `jdk.xerces`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B, C, F**
* **Phân tích chi tiết:**
  * `java.base`: Module gốc chứa `java.lang`, `java.util`, `java.io`, v.v. $\rightarrow$ **A đúng**.
  * `java.desktop`: Module chứa AWT và Swing $\rightarrow$ **B đúng**.
  * `java.logging`: Module chứa Logging API $\rightarrow$ **C đúng**.
  * `java.util`: Là tên một **Package**, không phải tên Module $\rightarrow$ D sai.
  * `jdk.base`: Tên không tồn tại (chỉ có `java.base`) $\rightarrow$ E sai.
  * `jdk.compiler`: Module chứa trình biên dịch `javac` $\rightarrow$ **F đúng**.
  * `jdk.xerces`: Tên module do tác giả bịa ra $\rightarrow$ G sai.
</details>

---

### Câu 13 (Question 13)
**Đoạn mã nào sau đây biên dịch thành công và tương đương với vòng lặp sau?**

```java
List<Unicorn> all = new ArrayList<>();
for (Unicorn current : ServiceLoader.load(Unicorn.class))
    all.add(current);
```

* A.
```java
List<Unicorn> all = ServiceLoader.load(Unicorn.class)
    .getStream()
    .toList();
```
* B.
```java
List<Unicorn> all = ServiceLoader.load(Unicorn.class)
    .stream()
    .toList();
```
* C.
```java
List<Unicorn> all = ServiceLoader.load(Unicorn.class)
    .getStream()
    .map(Provider::get)
    .toList();
```
* D.
```java
List<Unicorn> all = ServiceLoader.load(Unicorn.class)
    .stream()
    .map(Provider::get)
    .toList();
```
* E. Không có đáp án nào ở trên

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D**
* **Phân tích chi tiết:**
  * Lớp `ServiceLoader` không có phương thức nào tên là `getStream()` (chỉ có phương thức `stream()`) $\rightarrow$ Loại A và C.
  * Phương thức `stream()` của `ServiceLoader<S>` trả về `Stream<ServiceLoader.Provider<S>>` chứ không trả về trực tiếp `Stream<S>`.
  * Do đó, nếu gọi `.stream().toList()` như ở lựa chọn B, kiểu trả về sẽ là `List<Provider<Unicorn>>`, không tương thích với `List<Unicorn>` $\rightarrow$ B lỗi biên dịch.
  * Để lấy đối tượng dịch vụ thực sự từ `Provider`, ta phải gọi phương thức `.get()` thông qua hàm trung gian `.map(Provider::get)`. Đoạn code ở lựa chọn D biên dịch chính xác $\rightarrow$ **D đúng**.
</details>

---

### Câu 14 (Question 14)
**Câu lệnh nào sau đây là hợp lệ để chạy một chương trình modular, trong đó `n` là tên module và `c` là tên đầy đủ (fully qualified name) của class?**

* A. `java --module-path x -m n.c`
* B. `java --module-path x -p n.c`
* C. `java --module-path x-x -m n/c`
* D. `java --module-path x -p n/c`
* E. `java --module-path x-x -m n-c`
* F. `java --module-path x -p n-c`
* G. Không có đáp án nào ở trên

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Phân tích chi tiết:**
  * `-p` chỉ là dạng viết tắt của `--module-path`. Không thể khai báo cả `--module-path` lẫn `-p` cho hai mục đích khác nhau trong cùng một câu lệnh $\rightarrow$ Loại B, D, F.
  * Ký tự phân tách giữa tên module và tên class khi chạy bằng cờ `-m` bắt buộc phải là **dấu gạch chéo `/`** (`n/c`) $\rightarrow$ Loại A và E.
  * Trong lựa chọn C, `x-x` là tên thư mục chứa module path (tên thư mục có dấu gạch ngang là hoàn toàn hợp lệ) và cú pháp `-m n/c` chuẩn xác $\rightarrow$ **C đúng**.
</details>

---

### Câu 15 (Question 15)
**Trong chiến lược Top-Down Migration, tất cả các module ngoại trừ các Named Module đều là _____________ module và được đặt trên _____________.**

* A. automatic, classpath
* B. automatic, module path
* C. unnamed, classpath
* D. unnamed, module path
* E. Không có đáp án nào ở trên

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Phân tích chi tiết:**
  * **Top-Down Migration:** Đưa **tất cả** các file JAR của hệ thống lên **Module path** ngay từ đầu.
  * Khi đó, các JAR chưa được chuyển đổi (chưa có `module-info.java`) tự động trở thành **Automatic Modules**.
  * Sau đó, đội ngũ phát triển bắt đầu thêm `module-info.java` cho module ở tầng trên cùng (top-level) trước, biến nó thành **Named Module**, trong khi các module tầng dưới vẫn tạm thời là Automatic Modules trên Module path.
  * Do đó, đáp án đúng là **B (automatic, module path)**.
</details>

---

### Câu 16 (Question 16)
**Giả sử bạn có các module riêng biệt cho Service Provider Interface, Service Provider, Service Locator, và Consumer. Nếu bạn bổ sung thêm một module Service Provider thứ hai, bạn cần phải biên dịch lại bao nhiêu module đã có từ trước?**

* A. Không module nào (Zero)
* B. Một module (One)
* C. Hai module (Two)
* D. Ba module (Three)
* E. Bốn module (Four)

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Phân tích chi tiết:**
  * Đây chính là vẻ đẹp và sức mạnh của kiến trúc **Loose Coupling (Phụ thuộc lỏng lẻo)** trong JPMS Services!
  * Module Service Provider mới chỉ cần cài đặt SPI và khai báo `provides SPI with NewImplClass;`.
  * Consumer chỉ phụ thuộc vào Service Locator. Service Locator chỉ phụ thuộc vào SPI và dùng `ServiceLoader.load()` để quét động.
  * Khi đặt module Provider mới lên module path lúc runtime, Service Locator sẽ tự động phát hiện ra nó mà **không cần biên dịch lại bất kỳ module nào trong số các module cũ** $\rightarrow$ **A đúng (Zero)**.
</details>

---

### Câu 17 (Question 17)
**Giả sử ta có file JAR tên `cat-1.2.3-RC1.jar`, và thuộc tính `Automatic-Module-Name` trong file `MANIFEST.MF` được đặt là `dog`. Một Unnamed Module tham chiếu đến Automatic Module này cần khai báo điều gì trong `module-info.java`?**

* A. `requires cat;`
* B. `requires cat.RC;`
* C. `requires cat-RC;`
* D. `requires dog;`
* E. Không có đáp án nào ở trên (None of the above)

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E**
* **Phân tích chi tiết (Bẫy đề bài!):**
  * Đề bài hỏi: *"Một **Unnamed Module** tham chiếu đến automatic module này cần khai báo gì trong `module-info.java`?"*
  * Hãy nhớ lại định nghĩa: **Unnamed Module nằm trên Classpath và KHÔNG CÓ file `module-info.java`!** (Nếu có thì file này cũng bị JVM bỏ qua hoàn toàn).
  * Do đó, Unnamed Module không hề viết bất kỳ câu lệnh `requires` nào, nó chỉ đơn thuần sử dụng các class trong JAR như Java truyền thống.
  * Câu hỏi đánh lừa thí sinh vào việc suy diễn tên module giữa `dog` hay `cat`, nhưng bản chất Unnamed Module không có `module-info.java` $\rightarrow$ Đáp án đúng là **E**.
</details>

---

### Câu 18 (Question 18)
**Hai lệnh nào sau đây tạo ra các artifact chứa các phiên bản thu nhỏ của JDK? Lệnh nào được dùng để tạo file `.exe` và lệnh nào tạo một thư mục (theo thứ tự tương ứng)?**

* A. `jimage` và `jlink`
* B. `jimage` và `jpackage`
* C. `jlink` và `jimage`
* D. `jlink` và `jpackage`
* E. `jpackage` và `jimage`
* F. `jpackage` và `jlink`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F**
* **Phân tích chi tiết:**
  * Lệnh tạo tệp thực thi / bộ cài đặt nguyên bản của hệ điều hành (như file `.exe`, `.msi`, `.dmg`, `.deb`) là **`jpackage`**.
  * Lệnh tạo một thư mục chứa môi trường Java Runtime Image tùy biến tối giản (Custom JRE directory) là **`jlink`**.
  * Đề bài hỏi *"tạo file .exe và một thư mục theo thứ tự tương ứng"* $\rightarrow$ **`jpackage` và `jlink`** $\rightarrow$ **F đúng**.
  * (`jimage` là công cụ dùng để kiểm tra, xem nội dung các file jimage trong JDK, không dùng để build app).
</details>

---

### Câu 19 (Question 19)
**Phát biểu nào sau đây là đúng về module sau đây?**

```java
class dragon {
   exports com.dragon.fire;
   exports com.dragon.scales to castle;
}
```

* A. Tất cả các module đều có thể tham chiếu đến package `com.dragon.fire`.
* B. Tất cả các module đều có thể tham chiếu đến package `com.dragon.scales`.
* C. Chỉ có module `castle` mới có thể tham chiếu đến package `com.dragon.fire`.
* D. Chỉ có module `castle` mới có thể tham chiếu đến package `com.dragon.scales`.
* E. Không có phát biểu nào ở trên là đúng (None of the above).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E**
* **Phân tích chi tiết (Bẫy cú pháp!):**
  * Hãy nhìn vào dòng khai báo đầu tiên:
    `class dragon {`
  * Khai báo module bắt buộc phải dùng từ khóa **`module`**, ví dụ: `module dragon {`.
  * Dùng từ khóa `class` kèm các directive `exports` bên trong thân class sẽ gây ra **Lỗi biên dịch** ngay lập tức!
  * Vì mã nguồn không thể biên dịch nên không có phát biểu nào về quyền truy cập ở trên là đúng $\rightarrow$ Đáp án đúng là **E**.
</details>

---

### Câu 20 (Question 20)
**Dòng nào sau đây bạn chắc chắn sẽ nhìn thấy khi chạy lệnh mô tả (describe) bất kỳ một module nào?**

* A. `requires java.base mandated`
* B. `requires java.core mandated`
* C. `requires java.lang mandated`
* D. `requires mandated java.base`
* E. `requires mandated java.core`
* F. `requires mandated java.lang`
* G. Không có đáp án nào ở trên

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Phân tích chi tiết:**
  * Khi chạy `java -p <path> -d <moduleName>` hoặc `jar -f <jarName> -d`, thông tin chi tiết về các module phụ thuộc sẽ được in ra.
  * Vì mọi module đều tự động phụ thuộc vào module nền tảng `java.base` theo quy định của Java, đầu ra luôn luôn hiển thị dòng:
    `requires java.base mandated`
  * Trong đó, `mandated` mang nghĩa phụ thuộc bắt buộc được hệ thống tự chèn vào.
  * `java.lang` là package (không phải module). `java.core` không tồn tại trong JDK. Cú pháp hiển thị tên module trước rồi mới đến chữ `mandated`. Do đó **A đúng**.
</details>

---

### Câu 21 (Question 21)
**Giả sử bạn có các module riêng biệt cho Service Provider Interface, Service Provider, Service Locator, và Consumer. Module nào cần phải khai báo chỉ thị `requires` chỉ đến Service Provider?**

* A. Service locator
* B. Service provider interface
* C. Consumer
* D. Consumer và service locator
* E. Consumer và service provider
* F. Service locator và service provider interface
* G. Consumer, service locator, và service provider interface
* H. Không có module nào ở trên (None of the above)

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **H**
* **Phân tích chi tiết (Bẫy thiết kế Service!):**
  * Trong kiến trúc Service của JPMS:
    * **Consumer:** Chỉ cần `requires` Service Locator (và có thể `requires` SPI).
    * **Service Locator:** Cần `requires` SPI và `uses` SPI.
    * **SPI:** Hoàn toàn độc lập, chỉ `exports` package của nó.
    * **Service Provider:** Cần `requires` SPI và `provides SPI with ImplClass;`.
  * **Tuyệt đối không có bất kỳ module nào khai báo `requires` lên Service Provider!**
  * Nếu một module khai báo `requires` trực tiếp lên Service Provider thì tính chất "phụ thuộc lỏng lẻo" (Loose Coupling) sẽ bị phá vỡ hoàn toàn. Do đó không có module nào cần require Service Provider $\rightarrow$ Chọn **H**.
</details>

---

### Câu 22 (Question 22)
**Các phát biểu nào sau đây là đúng? (Chọn tất cả các đáp án đúng.)**

* A. Một automatic module export tất cả các package cho các named module.
* B. Một automatic module chỉ export các package được chỉ định cho các named module.
* C. Một automatic module không export package nào cho các named module.
* D. Một unnamed module chỉ export các named package cho các named module.
* E. Một unnamed module export tất cả các package cho các named module.
* F. Một unnamed module không export package nào cho các named module.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, F**
* **Phân tích chi tiết (TABLE 12.18):**
  * **Automatic Module:** Nằm trên module path nhưng không có `module-info.java`. Để đảm bảo tương thích tối đa, JVM mặc định cho phép Automatic Module **export tất cả các package** của nó cho các named module truy cập $\rightarrow$ **A đúng**, B và C sai.
  * **Unnamed Module:** Nằm trên classpath. Named module trên module path **không thể nhìn thấy và không thể truy cập** code trong Unnamed module. Do đó Unnamed module **không export bất kỳ package nào** cho named modules $\rightarrow$ **F đúng**, D và E sai.
</details>

---

### Câu 23 (Question 23)
**Dòng nào là dòng đầu tiên xuất hiện lỗi biên dịch trong đoạn code sau?**

```java
1: module snake {
2:    exports com.snake.tail;
3:    exports com.snake.fangs to bird;
4:    requires skin;
5:    requires transitive skin;
6: }
```

* A. Dòng 1
* B. Dòng 2
* C. Dòng 3
* D. Dòng 4
* E. Dòng 5
* F. Mã nguồn không chứa lỗi biên dịch nào

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E**
* **Phân tích chi tiết:**
  * Dòng 1: Tên module `snake` hợp lệ.
  * Dòng 2 & 3: Cú pháp `exports` và qualified `exports ... to ...` đều hợp lệ.
  * Dòng 4: `requires skin;` là hợp lệ.
  * Dòng 5: `requires transitive skin;`. Trong JPMS, **một module không được phép xuất hiện nhiều hơn một lần trong các câu lệnh `requires`** của cùng một `module-info.java`.
  * Vì `skin` đã được khai báo ở dòng 4, dòng 5 tiếp tục khai báo lại `skin` sẽ bị trình biên dịch từ chối: `duplicate requires: skin` $\rightarrow$ Lỗi biên dịch đầu tiên xuất hiện tại **Dòng 5 (Đáp án E)**.
</details>

---

### Câu 24 (Question 24)
**Phát biểu nào sau đây là đúng về một package nằm trong file JAR trên Classpath có chứa file `module-info.java` bên trong?**

* A. Có thể làm cho package này khả dụng đối với tất cả các module khác trên classpath.
* B. Có thể làm cho package này khả dụng đối với tất cả các module khác trên module path.
* C. Có thể làm cho package này khả dụng đối với chính xác một module cụ thể khác trên classpath.
* D. Có thể làm cho package này khả dụng đối với chính xác một module cụ thể khác trên module path.
* E. Có thể đảm bảo rằng package này không khả dụng đối với bất kỳ module nào khác trên classpath.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Phân tích chi tiết:**
  * **Quy tắc vàng của JPMS:** Bất kỳ file JAR nào được đặt trên **Classpath (`-cp`)** đều được JVM coi là thuộc về **Unnamed Module**.
  * Khi nằm trên Classpath, file `module-info.java` (hoặc `module-info.class`) bên trong JAR đó sẽ bị **bỏ qua hoàn toàn**!
  * Do hoạt động như cơ chế Java cũ trên Classpath, tất cả các class `public` trong package đó đều khả dụng cho mọi class/module khác trên Classpath $\rightarrow$ **A đúng**.
  * Classpath không có cơ chế giới hạn quyền truy cập cho một module cụ thể hay giấu package đối với các class khác trên classpath $\rightarrow$ C và E sai.
  * Các module trên Module path không thể đọc được mã nguồn trên Classpath $\rightarrow$ B và D sai.
</details>

---

### Câu 25 (Question 25)
**Giả sử bạn có các module riêng biệt cho Service Provider Interface, Service Provider, Service Locator, và Consumer. Những phát biểu nào sau đây là đúng về các chỉ thị bạn cần khai báo? (Chọn tất cả các đáp án đúng.)**

* A. Consumer bắt buộc phải sử dụng chỉ thị `requires`.
* B. Consumer bắt buộc phải sử dụng chỉ thị `uses`.
* C. Service Locator bắt buộc phải sử dụng chỉ thị `requires`.
* D. Service Locator bắt buộc phải sử dụng chỉ thị `uses`.
* E. Không có phát biểu nào ở trên là đúng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C, D**
* **Phân tích chi tiết:**
  * **Consumer:** Cần gọi Service Locator để lấy dịch vụ, do đó Consumer **bắt buộc phải có `requires`** module chứa Service Locator (và SPI nếu dùng trực tiếp interface) $\rightarrow$ **A đúng**. Consumer không gọi `ServiceLoader.load()` nên không cần `uses` $\rightarrow$ B sai.
  * **Service Locator:** Cần biết giao diện SPI để biên dịch phương thức tìm kiếm, do đó nó **bắt buộc phải có `requires`** module chứa SPI $\rightarrow$ **C đúng**. Đồng thời, để gọi `ServiceLoader.load(SPI.class)`, module của Service Locator **bắt buộc phải khai báo `uses SPI;`** $\rightarrow$ **D đúng**.
</details>
