# Review Questions (Bộ Câu Hỏi Ôn Tập Tiếng Anh) - Chapter 12: Modules

> **Source (Nguồn trích dẫn):** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Pages 1091–1102).  
> **Total Questions (Số lượng):** 25 original Oracle exam-style multiple-choice questions with official English & detailed Vietnamese explanations (Pages 1398–1402).  
> **How to study (Cách học):** Read the English question prompt and options carefully to familiarize yourself with the real exam terminology, then click **"👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)"** to review both the official book explanation and the in-depth Vietnamese breakdown.

---

### Question 1 (Câu 1)
**Which statement is true of the following module?**

```text
|---zoo
   |-- staff
      |-- Vet.java
```

* A. The directory structure shown is a valid module.
* B. The directory structure would be a valid module if `module.java` were added directly underneath `zoo/staff`.
* C. The directory structure would be a valid module if `module.java` were added directly underneath `zoo`.
* D. The directory structure would be a valid module if `module-info.java` were added directly underneath `zoo/staff`.
* E. The directory structure would be a valid module if `module-info.java` were added directly underneath `zoo`.
* F. None of these changes would make this directory structure a valid module.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Modules are required to have a `module-info.java` file at the root directory of the module. Option E matches this requirement.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Để một thư mục được công nhận là một Java module hợp lệ, nó **bắt buộc** phải chứa file mô tả mang tên chính xác là `module-info.java` đặt tại **thư mục gốc (root)** của module đó.
    * Trong cấu trúc trên, thư mục gốc của module là `zoo`. Do đó, file `module-info.java` phải nằm trực tiếp bên dưới `zoo` (ngang hàng với thư mục package `staff`).
    * Đặt `module-info.java` bên dưới `zoo/staff` là sai vị trí vì nó sẽ bị coi là nằm trong package `staff`.
    * Các file có tên `module.java` không có ý nghĩa khai báo module trong Java.
    * **Bẫy thi cần nhớ:** File khai báo module bắt buộc phải là `module-info.java` (có dấu gạch ngang `-`, chữ thường) và đặt ở thư mục root (default package), không được chứa dòng khai báo `package`.
</details>

---

### Question 2 (Câu 2)
**Suppose module `puppy` depends on module `dog` and module `dog` depends on module `animal`. Fill in the blank so that code in module `dog` can access the `animal.behavior` package in module `animal`.**

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
* G. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Options A, C, and E are incorrect because they refer to directives that don't exist. The `exports` directive is used when allowing a package to be called by code outside of the module, making option B the correct answer. Notice that options D and F are incorrect because `requires` is the wrong keyword to use.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Để cho phép code bên ngoài module truy cập vào một package công khai, module sở hữu package đó phải sử dụng chỉ thị **`exports <tên_package>;`**.
    * Các từ khóa `export`, `require`, `require transitive` không tồn tại trong cú pháp Java (chúng thiếu chữ `s` ở cuối).
    * `requires` và `requires transitive` dùng để khai báo sự phụ thuộc vào một **module**, không dùng cho package và không dùng để mở quyền truy cập cho module khác.
    * **Bẫy thi cần nhớ:** `exports` luôn đi kèm với **tên package**; `requires` luôn đi kèm với **tên module**. Cả hai từ khóa đều kết thúc bằng chữ cái **`s`** (`exports`, `requires`).
</details>

---

### Question 3 (Câu 3)
**Fill in the blanks so this command to run the program is correct:**

```bash
java
_________ modules
_________ zoo.animal.talks/zoo/animal/talks/Peacocks
```

* A. `-d` and `-m`
* B. `-d` and `-p`
* C. `-m` and `-d`
* D. `-m` and `-p`
* E. `-p` and `-d`
* F. `-p` and `-m`
* G. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **G**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `-p` or `--module-path` option is used to specify the location of the modules. The `-m` or `--module` option is used to specify the module and class name. However, running a program requires the package name to be specified with periods (`.`) instead of slashes. Since the command is incorrect, option G is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Thoạt nhìn, ta thấy cờ chỉ định module path là `-p` (hoặc `--module-path`) và cờ chỉ định module khởi chạy là `-m` (hoặc `--module`), khiến nhiều thí sinh vội vàng chọn `F` (`-p` và `-m`).
    * **Tuy nhiên, hãy quan sát kỹ tham số phía sau:**
      `zoo.animal.talks/zoo/animal/talks/Peacocks`
    * Trong Java, cú pháp của cờ `-m` là `<moduleName>/<fullyQualifiedClassName>`.
    * Tên lớp đầy đủ (fully qualified class name) **bắt buộc phải phân tách bằng dấu chấm `.`**, ví dụ: `zoo.animal.talks.Peacocks`.
    * Trong đề bài, tên lớp lại viết bằng dấu gạch chéo `/` (`zoo/animal/talks/Peacocks`). Dấu gạch chéo `/` chỉ dùng duy nhất 1 lần để ngăn cách giữa **tên module** và **tên class**.
    * Do đó, câu lệnh này hoàn toàn sai cú pháp và không thể chạy được → Đáp án đúng là **G (None of the above)**.
</details>

---

### Question 4 (Câu 4)
**Which of the following pairs make up a service?**

* A. Consumer and service locator
* B. Consumer and service provider interface
* C. Service locator and service provider
* D. Service locator and service provider interface
* E. Service provider and service provider interface

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** A service consists of the service provider interface and logic to look up implementations using a service locator. This makes option D correct. Make sure you know that the service provider itself is the implementation, which is not considered part of the service.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Theo định nghĩa của giáo trình OCP 21 (Mục *Creating a Service*): Một **Service** được cấu thành từ:
      1. **Service Provider Interface (SPI):** Giao diện (interface) hoặc lớp trừu tượng định nghĩa chức năng, cùng các lớp phụ trợ liên quan.
      2. **Service Locator:** Cơ chế tìm kiếm và nạp các lớp cài đặt (sử dụng `ServiceLoader`).
    * Bản thân **Service Provider** là lớp cài đặt cụ thể (implementation), nó độc lập và **không được coi là một phần của Service**.
    * **Consumer** là ứng dụng khách tiêu dùng dịch vụ, cũng không thuộc về bản thân dịch vụ.
    * **Bẫy thi cần nhớ:** Service = SPI + Service Locator. Implementation (Service Provider) nằm riêng biệt để đảm bảo tính phụ thuộc lỏng lẻo (loose coupling).
</details>

---

### Question 5 (Câu 5)
**A(n) _____________ module is on the classpath while a(n) _____________ module is on the module path. (Choose all that apply.)**

* A. automatic, named
* B. automatic, unnamed
* C. named, automatic
* D. named, unnamed
* E. unnamed, automatic
* F. unnamed, named
* G. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Automatic modules are on the module path but do not have a `module-info.java` file. Named modules are on the module path and do have a `module-info.java`. Unnamed modules are on the classpath. Therefore, options E and F are correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Unnamed Module:** Đại diện cho tất cả các file JAR và class truyền thống được đặt trên **Classpath** (`-cp` / `--class-path`).
    * **Named Module:** File JAR đã được module hóa (có `module-info.java`) đặt trên **Module path** (`-p` / `--module-path`).
    * **Automatic Module:** File JAR cũ (không có `module-info.java`) nhưng được đặt trên **Module path** (`-p` / `--module-path`).
    * Vế trước là classpath → phải là **unnamed module**. Vế sau là module path → có thể là **automatic** hoặc **named** module.
    * Do đó, cả **E** (`unnamed, automatic`) và **F** (`unnamed, named`) đều đúng.
</details>

---

### Question 6 (Câu 6)
**Which of the following statements are true in a `module-info.java` file? (Choose all that apply.)**

* A. The `opens` directive allows the use of reflection.
* B. The `opens` directive declares that an API is called.
* C. The `use` directive allows the use of reflection.
* D. The `use` directive declares that an API is called.
* E. The `uses` directive allows the use of reflection.
* F. The `uses` directive declares that an API is called.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Options C and D are incorrect because there is no `use` directive. Options A and F are correct because `opens` is for reflection and `uses` declares that an API consumes a service.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Chỉ thị `opens` cho phép các framework truy cập sâu vào package thông qua Reflection tại runtime (kể cả gọi `setAccessible(true)` với thành phần private) → **A đúng**.
    * Chỉ thị `uses` dùng trong Service Locator để khai báo rằng module này có nhu cầu nạp và tiêu dùng một Service Provider Interface → **F đúng**.
    * Không có chỉ thị nào tên là `use` (thiếu `s`) → C và D sai.
</details>

---

### Question 7 (Câu 7)
**An automatic module name is generated if one is not supplied. Which of the following JAR filenames and generated automatic module name pairs are correct? (Choose all that apply.)**

* A. `emily-1.0.0.jar` and `emily`
* B. `emily-1.0.0-SNAPSHOT.jar` and `emily`
* C. `emily_the_cat-1.0.0.jar` and `emily_the_cat`
* D. `emily_the_cat-1.0.0.jar` and `emily-the-cat`
* E. `emily.$.jar` and `emily`
* F. `emily.$.jar` and `emily.`
* G. `emily.$.jar` and `emily..`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, B, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Any version information at the end of the JAR filename is removed, making options A and B correct. Underscores (`_`) are turned into dots (`.`), making options C and D incorrect. Other special characters like a dollar sign (`$`) are also turned into dots. However, adjacent dots are merged, and leading/trailing dots are removed. Therefore, option E is also correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Thuật toán đặt tên Automatic Module:**
      1. Loại bỏ đuôi `.jar`.
      2. Loại bỏ thông tin phiên bản ở cuối tên (phần bắt đầu bằng dấu gạch ngang theo sau bởi số, ví dụ `-1.0.0` hay `-1.0.0-SNAPSHOT`) → `emily-1.0.0.jar` và `emily-1.0.0-SNAPSHOT.jar` đều cho ra `emily` → **A và B đúng**.
      3. Thay thế tất cả các ký tự không phải chữ/số (như `_`, `-`, `$`) thành dấu chấm `.`. Với `emily_the_cat-1.0.0.jar`, sau khi bỏ version còn `emily_the_cat`, chuyển thành `emily.the.cat` (chứ không giữ nguyên `_` hay đổi thành `-`) → C và D sai.
      4. Gộp các dấu chấm liền nhau (`..`) thành một dấu chấm đơn `.`.
      5. Loại bỏ dấu chấm ở đầu hoặc cuối chuỗi. Với `emily.$.jar`, bỏ `.jar` còn `emily.$`, đổi `$` thành `.` thành `emily..`, gộp chấm thành `emily.`, bỏ chấm cuối còn `emily` → **E đúng**, F và G sai.
</details>

---

### Question 8 (Câu 8)
**Which of the following statements are true? (Choose all that apply.)**

* A. Modules with cyclic dependencies will not compile.
* B. Packages with a cyclic dependency will not compile.
* C. A cyclic dependency always involves exactly two modules.
* D. A cyclic dependency always involves at least two `requires` statements.
* E. An unnamed module can be involved in a cyclic dependency with an automatic module.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** A cyclic dependency is when a module graph forms a circle. Option A is correct because the Java Platform Module System does not allow cyclic dependencies between modules. No such restriction exists for packages, making option B incorrect. A cyclic dependency can involve two or more modules that require each other, making option D correct, while option C is incorrect. Finally, option E is incorrect because unnamed modules cannot be referenced from an automatic module.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * JPMS cấm tuyệt đối phụ thuộc vòng giữa các module. Nếu module A requires B và B requires A (trực tiếp hoặc bắc cầu), trình biên dịch sẽ báo lỗi `cyclic dependence` → **A đúng**.
    * Java hoàn toàn cho phép các package phụ thuộc lẫn nhau (Class trong package 1 gọi Class trong package 2 và ngược lại) → B sai.
    * Phụ thuộc vòng có thể liên quan đến 2 module (`A -> B -> A`) hoặc nhiều hơn 2 module (`A -> B -> C -> A`), do đó phát biểu "luôn luôn chỉ đúng 2 module" là sai → C sai.
    * Để tạo thành vòng lặp phụ thuộc khép kín thì phải có ít nhất 2 liên kết `requires` (ví dụ `A requires B` và `B requires A`) → **D đúng**.
    * Unnamed module nằm trên classpath và không có tên, các module trên module path (kể cả automatic module) không thể khai báo `requires` unnamed module → Không thể tạo phụ thuộc vòng với unnamed module → E sai.
</details>

---

### Question 9 (Câu 9)
**Suppose you are creating a service provider that contains the following class. Which line of code needs to be in your `module-info.java`?**

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
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `provides` directive takes the interface name first and the implementing class name second and also uses `with`. Only option F meets these two criteria, making it the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Cú pháp chuẩn của chỉ thị khai báo Service Provider là:
      `provides <Tên_Interface_Hoặc_Abstract_Class> with <Tên_Class_Cài_Đặt>;`
    * Ở đây, `Magic` là interface (SPI) và `Dragon` là class cài đặt (Provider).
    * Từ khóa đi kèm bắt buộc là **`with`** (không phải `by` hay `using`).
    * Do đó, câu lệnh chính xác là: `provides magic.Magic with dragon.Dragon;` → **F đúng**.
</details>

---

### Question 10 (Câu 10)
**What is true of a module containing a file named `module-info.java` with the following contents? (Choose all that apply.)**

```java
module com.food.supplier {}
```

* A. All packages inside the module are automatically exported.
* B. No packages inside the module are automatically exported.
* C. A `main` method inside the module can be run.
* D. A `main` method inside the module cannot be run since the class is not exposed.
* E. The `module-info.java` file contains a compiler error.
* F. The `module-info.java` filename is incorrect.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Packages inside a module are not exported by default, making option B correct and option A incorrect. Exporting is necessary for other code to use the packages; it is not necessary to call the `main()` method at the command line, making option C correct and option D incorrect. The `module-info.java` file has the correct name and compiles, making options E and F incorrect.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Một module hoàn toàn có thể để trống thân `{}` (không khai báo `exports` hay `requires` nào). File này biên dịch hoàn toàn hợp lệ → E và F sai.
    * Mặc định trong JPMS, cơ chế đóng gói mạnh (strong encapsulation) được áp dụng: Nếu không có chỉ thị `exports` tường minh, **không có package nào được export ra ngoài** → **B đúng**, A sai.
    * Việc export package chỉ nhằm mục đích cho phép các module khác truy cập mã nguồn lúc biên dịch/chạy. Nó **không bắt buộc** đối với việc chạy phương thức `main()` từ dòng lệnh bằng cờ `-m com.food.supplier/<className>` → **C đúng**, D sai.
</details>

---

### Question 11 (Câu 11)
**Suppose module `puppy` depends on module `dog` and module `dog` depends on module `animal`. Which lines allow module `puppy` to access the `animal.behavior` package in module `animal`? (Choose all that apply.)**

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

* A. `require` on line S
* B. `require` on line T
* C. `requires` on line S
* D. `requires` on line T
* E. `require transitive` on line S
* F. `require transitive` on line T
* G. `requires transitive` on line S
* H. `requires transitive` on line T

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D, G, H**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Options A, B, E, and F are incorrect because they refer to directives that don't exist. The `requires transitive` directive is used when specifying a module to be used by the requesting module and any other modules that use the requesting module. Therefore, `dog` needs to specify the transitive relationship, and option G is correct. The module `puppy` just needs `requires dog`, and it gets the transitive dependencies, making option D correct. However, `requires transitive` does everything `requires` does and more, which makes option H the final correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Các từ khóa `require` và `require transitive` (thiếu `s`) không tồn tại → Loại A, B, E, F.
    * Để `puppy` đọc được `animal` gián tiếp thông qua `dog`, module `dog` bắt buộc phải chuyển tiếp quyền đọc bằng **`requires transitive animal;`** trên dòng S → **G đúng** (Nếu dòng S chỉ dùng `requires animal;` thì `puppy` sẽ không nhìn thấy `animal`).
    * Khi `dog` đã khai báo `requires transitive animal;`:
      * Module `puppy` chỉ cần viết **`requires dog;`** trên dòng T là đủ để ngầm định đọc được `animal` → **D đúng**.
      * Ngoài ra, nếu `puppy` dùng **`requires transitive dog;`** trên dòng T, nó vẫn đọc được `dog` (và cả `animal`) hoàn toàn bình thường, đồng thời chuyển tiếp tiếp cho các module sau → **H đúng**.
</details>

---

### Question 12 (Câu 12)
**Which of the following modules are provided by the JDK? (Choose all that apply.)**

* A. `java.base`
* B. `java.desktop`
* C. `java.logging`
* D. `java.util`
* E. `jdk.base`
* F. `jdk.compiler`
* G. `jdk.xerces`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, B, C, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Option D is incorrect because it is a package name rather than a module name. Option E is incorrect because `java.base` is the module name, not `jdk.base`. Option G is wrong because we made it up. Options A, B, C, and F are correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * `java.base`: Module gốc chứa `java.lang`, `java.util`, `java.io`, v.v. → **A đúng**.
    * `java.desktop`: Module chứa AWT và Swing → **B đúng**.
    * `java.logging`: Module chứa Logging API → **C đúng**.
    * `java.util`: Là tên một **Package**, không phải tên Module → D sai.
    * `jdk.base`: Tên không tồn tại (chỉ có `java.base`) → E sai.
    * `jdk.compiler`: Module chứa trình biên dịch `javac` → **F đúng**.
    * `jdk.xerces`: Tên module do tác giả bịa ra → G sai.
</details>

---

### Question 13 (Câu 13)
**Which of the following compiles and is equivalent to this loop?**

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
* E. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** There is no `getStream()` method on a `ServiceLoader`, making options A and C incorrect. Option B does not compile because the `stream()` method returns a list of `Provider` interfaces and needs to be converted to the `Unicorn` interface we are interested in. Therefore, option D is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Lớp `ServiceLoader` không có phương thức nào tên là `getStream()` (chỉ có phương thức `stream()`) → Loại A và C.
    * Phương thức `stream()` của `ServiceLoader<S>` trả về `Stream<ServiceLoader.Provider<S>>` chứ không trả về trực tiếp `Stream<S>`.
    * Do đó, nếu gọi `.stream().toList()` như ở lựa chọn B, kiểu trả về sẽ là `List<Provider<Unicorn>>`, không tương thích với `List<Unicorn>` → B lỗi biên dịch.
    * Để lấy đối tượng dịch vụ thực sự từ `Provider`, ta phải gọi phương thức `.get()` thông qua hàm trung gian `.map(Provider::get)`. Đoạn code ở lựa chọn D biên dịch chính xác → **D đúng**.
</details>

---

### Question 14 (Câu 14)
**Which of the following is a legal command to run a modular program where `n` is the module name and `c` is the fully qualified class name?**

* A. `java --module-path x -m n.c`
* B. `java --module-path x -p n.c`
* C. `java --module-path x-x -m n/c`
* D. `java --module-path x -p n/c`
* E. `java --module-path x-x -m n-c`
* F. `java --module-path x -p n-c`
* G. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `-p` option is a shorter form of `--module-path`. Since the same option cannot be specified twice, options B, D, and F are incorrect. The module name and class name are separated with a slash, making option C the answer. Note that `x-x` is legal because the module path is a folder name, so dashes are allowed.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * `-p` chỉ là dạng viết tắt của `--module-path`. Không thể khai báo cả `--module-path` lẫn `-p` cho hai mục đích khác nhau trong cùng một câu lệnh → Loại B, D, F.
    * Ký tự phân tách giữa tên module và tên class khi chạy bằng cờ `-m` bắt buộc phải là **dấu gạch chéo `/`** (`n/c`) → Loại A và E.
    * Trong lựa chọn C, `x-x` là tên thư mục chứa module path (tên thư mục có dấu gạch ngang là hoàn toàn hợp lệ) và cú pháp `-m n/c` chuẩn xác → **C đúng**.
</details>

---

### Question 15 (Câu 15)
**For a top-down migration, all modules other than named modules are _____________ modules and are on the _____________.**

* A. automatic, classpath
* B. automatic, module path
* C. unnamed, classpath
* D. unnamed, module path
* E. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** A top-down migration strategy first places all JARs on the module path. Then it migrates the top-level module to be a named module, leaving the other modules as automatic modules. Option B is correct as it matches both of those characteristics.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Top-Down Migration:** Đưa **tất cả** các file JAR của hệ thống lên **Module path** ngay từ đầu.
    * Khi đó, các JAR chưa được chuyển đổi (chưa có `module-info.java`) tự động trở thành **Automatic Modules**.
    * Sau đó, đội ngũ phát triển bắt đầu thêm `module-info.java` cho module ở tầng trên cùng (top-level) trước, biến nó thành **Named Module**, trong khi các module tầng dưới vẫn tạm thời là Automatic Modules trên Module path.
    * Do đó, đáp án đúng là **B (automatic, module path)**.
</details>

---

### Question 16 (Câu 16)
**Suppose you have separate modules for a service provider interface, service provider, service locator, and consumer. If you add a second service provider module, how many of the existing modules do you need to recompile?**

* A. Zero
* B. One
* C. Two
* D. Three
* E. Four

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Since this is a new module, you need to compile it. However, none of the existing modules needs to be recompiled, making option A correct. The service locator will see the new service provider simply by having that new service provider on the module path.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Đây chính là vẻ đẹp và sức mạnh của kiến trúc **Loose Coupling (Phụ thuộc lỏng lẻo)** trong JPMS Services!
    * Module Service Provider mới chỉ cần cài đặt SPI và khai báo `provides SPI with NewImplClass;`.
    * Consumer chỉ phụ thuộc vào Service Locator. Service Locator chỉ phụ thuộc vào SPI và dùng `ServiceLoader.load()` để quét động.
    * Khi đặt module Provider mới lên module path lúc runtime, Service Locator sẽ tự động phát hiện ra nó mà **không cần biên dịch lại bất kỳ module nào trong số các module cũ** → **A đúng (Zero)**.
</details>

---

### Question 17 (Câu 17)
**Suppose we have a JAR file named `cat-1.2.3-RC1.jar`, and `Automatic-Module-Name` in the `MANIFEST.MF` is set to `dog`. What should an unnamed module referencing this automatic module include in `module-info.java`?**

* A. `requires cat;`
* B. `requires cat.RC;`
* C. `requires cat-RC;`
* D. `requires dog;`
* E. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Trick question! An unnamed module doesn't use a `module-info.java` file. Therefore, option E is correct. An unnamed module can access an automatic module. The unnamed module would simply treat the automatic module as a regular JAR without involving the `module-info.java` file.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Đề bài hỏi: *"Một **Unnamed Module** tham chiếu đến automatic module này cần khai báo gì trong `module-info.java`?"*
    * Hãy nhớ lại định nghĩa: **Unnamed Module nằm trên Classpath và KHÔNG CÓ file `module-info.java`!** (Nếu có thì file này cũng bị JVM bỏ qua hoàn toàn).
    * Do đó, Unnamed Module không hề viết bất kỳ câu lệnh `requires` nào, nó chỉ đơn thuần sử dụng các class trong JAR như Java truyền thống.
    * Câu hỏi đánh lừa thí sinh vào việc suy diễn tên module giữa `dog` hay `cat`, nhưng bản chất Unnamed Module không có `module-info.java` → Đáp án đúng là **E**.
</details>

---

### Question 18 (Câu 18)
**Two commands create artifacts that include smaller versions of the JDK. Which are used to create an `.exe` file and a directory, respectively?**

* A. `jimage` and `jlink`
* B. `jimage` and `jpackage`
* C. `jlink` and `jimage`
* D. `jlink` and `jpackage`
* E. `jpackage` and `jimage`
* F. `jpackage` and `jlink`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `jpackage` command creates self-contained application such as an `.exe`. The `jlink` command creates a directory with a smaller Java runtime containing just what is needed. The `jimage` command is used to inspect a Java image file. Therefore, option F is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Lệnh tạo tệp thực thi / bộ cài đặt nguyên bản của hệ điều hành (như file `.exe`, `.msi`, `.dmg`, `.deb`) là **`jpackage`**.
    * Lệnh tạo một thư mục chứa môi trường Java Runtime Image tùy biến tối giản (Custom JRE directory) là **`jlink`**.
    * Đề bài hỏi *"tạo file .exe và một thư mục theo thứ tự tương ứng"* → **`jpackage` và `jlink`** → **F đúng**.
    * (`jimage` là công cụ dùng để kiểm tra, xem nội dung các file jimage trong JDK, không dùng để build app).
</details>

---

### Question 19 (Câu 19)
**Which is a true statement about the following module?**

```java
class dragon {
   exports com.dragon.fire;
   exports com.dragon.scales to castle;
}
```

* A. All modules can reference the `com.dragon.fire` package.
* B. All modules can reference the `com.dragon.scales` package.
* C. Only the `castle` module can reference the `com.dragon.fire` package.
* D. Only the `castle` module can reference the `com.dragon.scales` package.
* E. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** There is a trick here. A module definition uses the keyword `module` rather than `class`. Since the code does not compile, option E is correct. If the code did compile, options A and D would be correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Hãy nhìn vào dòng khai báo đầu tiên:
      `class dragon {`
    * Khai báo module bắt buộc phải dùng từ khóa **`module`**, ví dụ: `module dragon {`.
    * Dùng từ khóa `class` kèm các directive `exports` bên trong thân class sẽ gây ra **Lỗi biên dịch** ngay lập tức!
    * Vì mã nguồn không thể biên dịch nên không có phát biểu nào về quyền truy cập ở trên là đúng → Đáp án đúng là **E**.
</details>

---

### Question 20 (Câu 20)
**Which would you expect to see when describing any module?**

* A. `requires java.base mandated`
* B. `requires java.core mandated`
* C. `requires java.lang mandated`
* D. `requires mandated java.base`
* E. `requires mandated java.core`
* F. `requires mandated java.lang`
* G. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** When running `java` with the `-d` option, all the required modules are listed. Additionally, the `java.base` module is listed since it is included automatically. The line ends with `mandated`, making option A correct. The `java.lang` is a trick since it is a package that is imported by default in a class rather than a module.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Khi chạy `java -p <path> -d <moduleName>` hoặc `jar -f <jarName> -d`, thông tin chi tiết về các module phụ thuộc sẽ được in ra.
    * Vì mọi module đều tự động phụ thuộc vào module nền tảng `java.base` theo quy định của Java, đầu ra luôn luôn hiển thị dòng:
      `requires java.base mandated`
    * Trong đó, `mandated` mang nghĩa phụ thuộc bắt buộc được hệ thống tự chèn vào.
    * `java.lang` là package (không phải module). `java.core` không tồn tại trong JDK. Cú pháp hiển thị tên module trước rồi mới đến chữ `mandated`. Do đó **A đúng**.
</details>

---

### Question 21 (Câu 21)
**Suppose you have separate modules for a service provider interface, service provider, service locator, and consumer. Which module(s) need to specify a `requires` directive on the service provider?**

* A. Service locator
* B. Service provider interface
* C. Consumer
* D. Consumer and service locator
* E. Consumer and service provider
* F. Service locator and service provider interface
* G. Consumer, service locator, and service provider interface
* H. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **H**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** This question is tricky. The service locator must have a `uses` directive, but that is on the service provider interface. No modules need to specify `requires` on the service provider since that is the implementation. Since none of the options are correct, option H is the answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Trong kiến trúc Service của JPMS:
      * **Consumer:** Chỉ cần `requires` Service Locator (và có thể `requires` SPI).
      * **Service Locator:** Cần `requires` SPI và `uses` SPI.
      * **SPI:** Hoàn toàn độc lập, chỉ `exports` package của nó.
      * **Service Provider:** Cần `requires` SPI và `provides SPI with ImplClass;`.
    * **Tuyệt đối không có bất kỳ module nào khai báo `requires` lên Service Provider!**
    * Nếu một module khai báo `requires` trực tiếp lên Service Provider thì tính chất "phụ thuộc lỏng lẻo" (Loose Coupling) sẽ bị phá vỡ hoàn toàn. Do đó không có module nào cần require Service Provider → Chọn **H**.
</details>

---

### Question 22 (Câu 22)
**Which are true statements? (Choose all that apply.)**

* A. An automatic module exports all packages to named modules.
* B. An automatic module exports only the specified packages to named modules.
* C. An automatic module exports no packages to named modules.
* D. An unnamed module exports only the named packages to named modules.
* E. An unnamed module exports all packages to named modules.
* F. An unnamed module exports no packages to named modules.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** An automatic module exports all packages, making option A correct. An unnamed module is not available to any modules on the module path. Therefore, it doesn't export any packages, and option F is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Automatic Module:** Nằm trên module path nhưng không có `module-info.java`. Để đảm bảo tương thích tối đa, JVM mặc định cho phép Automatic Module **export tất cả các package** của nó cho các named module truy cập → **A đúng**, B và C sai.
    * **Unnamed Module:** Nằm trên classpath. Named module trên module path **không thể nhìn thấy và không thể truy cập** code trong Unnamed module. Do đó Unnamed module **không export bất kỳ package nào** cho named modules → **F đúng**, D và E sai.
</details>

---

### Question 23 (Câu 23)
**Which is the first line to contain a compiler error?**

```java
1: module snake {
2:    exports com.snake.tail;
3:    exports com.snake.fangs to bird;
4:    requires skin;
5:    requires transitive skin;
6: }
```

* A. Line 1.
* B. Line 2.
* C. Line 3.
* D. Line 4.
* E. Line 5.
* F. The code does not contain any compiler errors.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The module name is valid, as are the `exports` statements. Lines 4 and 5 are tricky because each is valid independently. However, the same module name is not allowed to be used in two `requires` statements. The second one fails to compile on line 5, making option E the answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 1: Tên module `snake` hợp lệ.
    * Dòng 2 & 3: Cú pháp `exports` và qualified `exports ... to ...` đều hợp lệ.
    * Dòng 4: `requires skin;` là hợp lệ.
    * Dòng 5: `requires transitive skin;`. Trong JPMS, **một module không được phép xuất hiện nhiều hơn một lần trong các câu lệnh `requires`** của cùng một `module-info.java`.
    * Vì `skin` đã được khai báo ở dòng 4, dòng 5 tiếp tục khai báo lại `skin` sẽ bị trình biên dịch từ chối: `duplicate requires: skin` → Lỗi biên dịch đầu tiên xuất hiện tại **Dòng 5 (Đáp án E)**.
</details>

---

### Question 24 (Câu 24)
**Which is a true statement about a package in a JAR on the classpath containing a `module-info.java` file?**

* A. It is possible to make the package available to all other modules on the classpath.
* B. It is possible to make the package available to all other modules on the module path.
* C. It is possible to make the package available to exactly one other specific module on the classpath.
* D. It is possible to make the package available to exactly one other specific module on the module path.
* E. It is possible to make sure the package is not available to any other modules on the classpath.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Since the JAR is on the classpath, it is treated as a regular unnamed module even though it has a `module-info.java` file inside. Remember from learning about top-down migration that modules on the module path are not allowed to refer to the classpath, making options B and D incorrect. The classpath does not have a facility to restrict packages, making option A correct and options C and E incorrect.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Quy tắc vàng của JPMS:** Bất kỳ file JAR nào được đặt trên **Classpath (`-cp`)** đều được JVM coi là thuộc về **Unnamed Module**.
    * Khi nằm trên Classpath, file `module-info.java` (hoặc `module-info.class`) bên trong JAR đó sẽ bị **bỏ qua hoàn toàn**!
    * Do hoạt động như cơ chế Java cũ trên Classpath, tất cả các class `public` trong package đó đều khả dụng cho mọi class/module khác trên Classpath → **A đúng**.
    * Classpath không có cơ chế giới hạn quyền truy cập cho một module cụ thể hay giấu package đối với các class khác trên classpath → C và E sai.
    * Các module trên Module path không thể đọc được mã nguồn trên Classpath → B và D sai.
</details>

---

### Question 25 (Câu 25)
**Suppose you have separate modules for a service provider interface, service provider, service locator, and consumer. Which statements are true about the directives you need to specify? (Choose all that apply.)**

* A. The consumer must use the `requires` directive.
* B. The consumer must use the `uses` directive.
* C. The service locator must use the `requires` directive.
* D. The service locator must use the `uses` directive.
* E. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, C, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Options A and C are correct because both the consumer and the service locator depend on the service provider interface. Additionally, option D is correct because the service locator must specify that it uses the service provider interface to look it up.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Consumer:** Cần gọi Service Locator để lấy dịch vụ, do đó Consumer **bắt buộc phải có `requires`** module chứa Service Locator (và SPI nếu dùng trực tiếp interface) → **A đúng**. Consumer không gọi `ServiceLoader.load()` nên không cần `uses` → B sai.
    * **Service Locator:** Cần biết giao diện SPI để biên dịch phương thức tìm kiếm, do đó nó **bắt buộc phải có `requires`** module chứa SPI → **C đúng**. Đồng thời, để gọi `ServiceLoader.load(SPI.class)`, module của Service Locator **bắt buộc phải khai báo `uses SPI;`** → **D đúng**.
</details>
