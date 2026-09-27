# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chapter 1: Building Blocks

> **Nguồn trích dẫn:** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Trang 157–168).  
> **Số lượng:** 23 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết.  
> **Cách học:** Bạn hãy tự đọc đề và chọn đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và nắm vững bẫy thi.

---

### Câu 1 (Question 1)
**Phương thức nào sau đây là điểm khởi đầu (entry point) hợp lệ có thể chạy từ dòng lệnh? (Chọn tất cả các đáp án đúng)**

* A. `private static void main(String[] args)`
* B. `public static final main(String[] args)`
* C. `public void main(String[] args)`
* D. `public static final void main(String[] args)`
* E. `public static void main(String[] args)`
* F. `public static main(String[] args)`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D, E**
* **Giải thích chuyên sâu:**
  * **E** là chữ ký chuẩn tắc (*canonical signature*) của phương thức `main`: `public static void main(String[] args)`.
  * **D** hoàn toàn hợp lệ vì Java cho phép thêm bổ từ `final` vào trước kiểu trả về của phương thức `main`. Thứ tự các bổ từ (`public static final`) có thể hoán đổi cho nhau.
  * **A sai** vì `main()` để JVM gọi từ ngoài bắt buộc phải có phạm vi truy cập là `public`, không được là `private`.
  * **B và F sai** vì thiếu kiểu trả về `void`. Trong Java mọi phương thức bắt buộc phải có kiểu trả về.
  * **C sai** vì thiếu từ khóa `static`. JVM gọi trực tiếp phương thức `main` mà không khởi tạo instance của class.
</details>

---

### Câu 2 (Question 2)
**Các lựa chọn nào sau đây thể hiện đúng thứ tự sắp xếp của các câu lệnh để chương trình biên dịch thành công? (Chọn tất cả các đáp án đúng)**

Cho 3 câu lệnh sau:
* `X: class Rabbit {}`
* `Y: import java.util.*;`
* `Z: package animals;`

* A. X, Y, Z
* B. Y, Z, X
* C. Z, Y, X
* D. Y, X
* E. Z, X
* F. X, Z
* G. Không có phương án nào đúng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, D, E**
* **Giải thích chuyên sâu:**
  * Quy tắc cấu trúc file Java là **P - I - C**: `Package` $\rightarrow$ `Import` $\rightarrow$ `Class`.
  * Cả `package` và `import` đều là **tùy chọn (optional)**:
    * Nếu có cả 3: Bắt buộc theo thứ tự `Z, Y, X` (**Đáp án C**).
    * Nếu không khai báo `package` (sử dụng default package): Thứ tự là `Y, X` (**Đáp án D**).
    * Nếu không có `import`: Thứ tự là `Z, X` (**Đáp án E**).
  * **A, B, F sai** vì vi phạm thứ tự: `class` không thể đứng trước `package` hay `import`, và `import` không thể đứng trước `package`.
</details>

---

### Câu 3 (Question 3)
**Các phát biểu nào sau đây là đúng về đoạn mã nguồn dưới đây? (Chọn tất cả các đáp án đúng)**

```java
public class Bunny {
   public static void main(String[] x) {
      Bunny bun = new Bunny();
   }
}
```

* A. `Bunny` là một class.
* B. `bun` là một class.
* C. `main` là một class.
* D. `Bunny` là một tham chiếu trỏ đến đối tượng (reference to an object).
* E. `bun` là một tham chiếu trỏ đến đối tượng (reference to an object).
* F. `main` là một tham chiếu trỏ đến đối tượng (reference to an object).
* G. Phương thức `main()` không chạy được vì tên tham số (`x`) không đúng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, E**
* **Giải thích chuyên sâu:**
  * **A đúng:** `Bunny` được khai báo bằng `public class Bunny` nên nó là một class.
  * **E đúng:** `bun` là một biến tham chiếu (`Bunny bun`) trỏ đến instance mới tạo `new Bunny()`.
  * **B sai:** `bun` là tên biến, không phải tên class.
  * **C, F sai:** `main` là tên phương thức.
  * **D sai:** `Bunny` là tên kiểu dữ liệu (class), không phải biến tham chiếu.
  * **G sai:** Tên tham số của `main` có thể đặt tùy ý (ở đây là `x`), miễn kiểu dữ liệu là mảng String `String[]`.
</details>

---

### Câu 4 (Question 4)
**Những tên nào sau đây là định danh (identifier) hợp lệ trong Java? (Chọn tất cả các đáp án đúng)**

* A. `_`
* B. `_helloWorld$`
* C. `true`
* D. `java.lang`
* E. `Public`
* F. `1980_s`
* G. `_Q2_`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, E, G**
* **Giải thích chuyên sâu:**
  * **B và G đúng:** Tên bắt đầu bằng dấu gạch dưới `_`, theo sau là chữ cái, số hoặc ký tự `$`.
  * **E đúng:** Java phân biệt hoa thường (*case-sensitive*). `public` là từ khóa dành riêng, nhưng `Public` (chữ P hoa) là tên định danh hoàn toàn hợp lệ.
  * **A sai:** Từ Java 9 trở đi, một dấu gạch dưới đơn lẻ `_` là từ khóa dành riêng (*reserved keyword*), không được dùng làm định danh.
  * **C sai:** `true` là từ khóa literal dành riêng của kiểu boolean.
  * **D sai:** Dấu chấm `.` không được phép xuất hiện trong tên định danh.
  * **F sai:** Định danh trong Java không được phép bắt đầu bằng chữ số (`1980_s`).
</details>

---

### Câu 5 (Question 5)
**Các phát biểu nào về chương trình sau là chính xác? (Chọn tất cả các đáp án đúng)**

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

* A. Đối tượng được tạo ở dòng 9 bắt đầu đủ điều kiện thu gom rác sau dòng 13.
* B. Đối tượng được tạo ở dòng 9 bắt đầu đủ điều kiện thu gom rác sau dòng 14.
* C. Đối tượng được tạo ở dòng 10 bắt đầu đủ điều kiện thu gom rác sau dòng 12.
* D. Đối tượng được tạo ở dòng 10 bắt đầu đủ điều kiện thu gom rác sau dòng 13.
* E. Garbage collection chắc chắn sẽ chạy.
* F. Garbage collection có thể chạy hoặc không chạy.
* G. Code không biên dịch được.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, D, F**
* **Giải thích chuyên sâu:**
  * **F đúng, E sai:** Phương thức `System.gc()` chỉ là một lời đề xuất tới JVM, không có gì đảm bảo Garbage Collector sẽ chạy ngay lập tức.
  * **A đúng:** Đối tượng tạo ở dòng 9 chỉ có duy nhất biến tham chiếu `brownBear` trỏ tới. Đến dòng 13 khi `brownBear = null`, đối tượng này không còn tham chiếu nào $\rightarrow$ đủ điều kiện GC sau dòng 13.
  * **D đúng, C sai:** Đối tượng tạo ở dòng 10 được trỏ bởi `polarBear` VÀ đồng thời được trường `brownBear.pandaBear` trỏ tới (sau dòng 11). Khi dòng 12 gán `polarBear = null`, đối tượng này vẫn còn sống thông qua `brownBear.pandaBear`. Chỉ sau dòng 13 khi `brownBear = null`, toàn bộ chuỗi tham chiếu bị đứt $\rightarrow$ đủ điều kiện GC sau dòng 13.
</details>

---

### Câu 6 (Question 6)
**Giả sử class sau biên dịch thành công, có bao nhiêu biến được định nghĩa trong class hoặc method còn trong phạm vi (in scope) tại dòng 14 (`// SCOPE`)?**

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
* G. Không có phương án nào đúng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (7 biến)**
* **Giải thích chuyên sâu:**
  Để giải câu này, ta lần lượt kiểm tra các biến và dấu ngoặc nhọn `{}`:
  1. `hairs` (dòng 2): Đã ra khỏi khối initializer block $\rightarrow$ **Hết scope**.
  2. `water` (dòng 3): Instance variable $\rightarrow$ **Còn trong scope (1)**.
  3. `air` (dòng 3): Instance variable $\rightarrow$ **Còn trong scope (2)**.
  4. `twoHumps` (dòng 4): Instance variable $\rightarrow$ **Còn trong scope (3)**.
  5. `distance` (dòng 5): Tham số của hàm `spit` $\rightarrow$ **Còn trong scope (4)**.
  6. `path` (dòng 6): Biến cục bộ của hàm `spit` $\rightarrow$ **Còn trong scope (5)**.
  7. `teeth` (dòng 7): Nằm trong khối ngoặc nhọn riêng `{}` đã đóng $\rightarrow$ **Hết scope**.
  8. `age` (dòng 9): Biến cục bộ trong vòng lặp `while` $\rightarrow$ **Còn trong scope (6)**.
  9. `i` (dòng 10): Khai báo trước vòng `for`, nằm trong `while` $\rightarrow$ **Còn trong scope (7)**.
  10. `Private` (dòng 12): Khai báo trong vòng `for`, khi vòng for kết thúc thì đã ra khỏi scope $\rightarrow$ **Hết scope**.
  * **Tổng cộng: đúng 7 biến**.
</details>

---

### Câu 7 (Question 7)
**Các phát biểu nào sau đây là đúng về đoạn code này? (Chọn tất cả các đáp án đúng)**

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

* A. Output có chứa `# forks = 0`.
* B. Output có chứa `# knives = 0`.
* C. Output có chứa `# cups = 0`.
* D. Output có chứa một dòng trống.
* E. Output có chứa một hoặc nhiều dòng bắt đầu bằng khoảng trắng.
* F. Đoạn code không biên dịch được.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, E**
* **Giải thích chuyên sâu:**
  * Điểm mấu chốt: Toàn bộ nội dung bên trong dấu `"""` là một **Text Block** (chuỗi ký tự thuần túy). Các biến `numForks`, `numKnives` và toán tử `+` chỉ là **chữ viết trong chuỗi**, Java không thực hiện phép tính hay đọc biến tại đây!
  * Do không đọc giá trị biến cục bộ `numKnives` (dù chưa khởi tạo), code **hoàn toàn biên dịch bình thường**.
  * **C đúng:** Dòng cuối cùng chứa nguyên văn chữ `# cups = 0`.
  * **E đúng:** Dòng thứ 2 `" # knives = "` có thụt lề so với lề chuẩn của `"""` nên khi in ra sẽ bắt đầu bằng khoảng trắng.
  * **A, B sai:** Chuỗi in ra nguyên văn các dấu cộng `+ numForks +` chứ không thay thế bằng số `0`.
  * **D sai:** Dấu đóng `"""` nằm ngay sát chữ `0` của dòng thứ 3, không tạo thêm dòng trống nào ở cuối.
</details>

---

### Câu 8 (Question 8)
**Đoạn code nào sau đây sử dụng `var` có thể biên dịch thành công khi đặt bên trong một phương thức? (Chọn tất cả các đáp án đúng)**

* A. `var spring = null;`
* B. `var fall = "leaves";`
* C. `var evening = 2; evening = null;`
* D. `var night = Integer.valueOf(3);`
* E. `var day = 1/0;`
* F. `var winter = 12, cold;`
* G. `var fall = 2, autumn = 2;`
* H. `var morning = ""; morning = null;`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, D, E, H**
* **Giải thích chuyên sâu:**
  * **B đúng:** `fall` được suy luận là `String`.
  * **D đúng:** `night` được suy luận là `Integer`.
  * **E đúng:** `1/0` là một biểu thức số nguyên hợp lệ về mặt ngữ pháp tại thời điểm biên dịch (compiler suy luận `day` là kiểu `int`). Dù khi chạy sẽ quăng `ArithmeticException`, nhưng đề bài chỉ hỏi **code có biên dịch được hay không**.
  * **H đúng:** `morning` được suy luận là kiểu `String` (kiểu tham chiếu). Sau đó gán `morning = null` hoàn toàn hợp lệ với kiểu tham chiếu!
  * **A sai:** Không thể khởi tạo `var` trực tiếp bằng `null` vì trình biên dịch không thể suy luận ra kiểu dữ liệu cụ thể.
  * **C sai:** `evening` được suy luận là kiểu nguyên thủy `int`. Kiểu nguyên thủy không thể gán bằng `null`.
  * **F và G sai:** `var` bị cấm dùng để khai báo nhiều biến ngăn cách bằng dấu phẩy trong cùng một câu lệnh.
</details>

---

### Câu 9 (Question 9)
**Phát biểu nào sau đây là chính xác?**

* A. Biến thực thể (instance variable) kiểu `float` có giá trị mặc định là `0`.
* B. Biến thực thể (instance variable) kiểu `char` có giá trị mặc định là `null`.
* C. Biến cục bộ (local variable) kiểu `double` có giá trị mặc định là `0.0`.
* D. Biến cục bộ (local variable) kiểu `int` có giá trị mặc định là `null`.
* E. Biến lớp (class / static variable) kiểu `String` có giá trị mặc định là `null`.
* F. Biến lớp (class / static variable) kiểu `String` có giá trị mặc định là chuỗi rỗng `""`.
* G. Không có phương án nào đúng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E**
* **Giải thích chuyên sâu:**
  * **E đúng:** `String` là một kiểu dữ liệu tham chiếu (*reference type*). Mọi biến instance hoặc static thuộc kiểu tham chiếu đều có giá trị mặc định ban đầu là `null`.
  * **C và D sai:** Biến cục bộ (*local variables*) **không có giá trị mặc định**.
  * **A sai:** Giá trị mặc định của `float` là `0.0f` (có dấu chấm thập phân), `0` là của số nguyên.
  * **B sai:** `char` là kiểu dữ liệu nguyên thủy (*primitive*), giá trị mặc định là `'\u0000'`, không thể là `null`.
  * **F sai:** Giá trị mặc định là `null`, không phải chuỗi rỗng `""`.
</details>

---

### Câu 10 (Question 10)
**Biểu thức nào sau đây, khi được điền độc lập vào chỗ trống, sẽ cho phép đoạn mã biên dịch thành công? (Chọn tất cả các đáp án đúng)**

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
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, E, F**
* **Giải thích chuyên sâu:**
  * Quy tắc dấu gạch dưới `_` trong số học: Dấu `_` có thể đặt ở bất kỳ đâu giữa hai chữ số. Có thể đặt nhiều dấu gạch dưới liên tiếp cạnh nhau (**F đúng: `9___6`**).
  * **A đúng (`3_1`)** và **E đúng (`2_234.0_0`)**: Dấu `_` nằm hợp lệ giữa các chữ số.
  * **B và D sai:** Dấu `_` đặt ngay trước hoặc ngay sau dấu chấm thập phân `.`.
  * **C sai:** Dấu `_` đặt ở cuối cùng của số.
  * **G sai:** Dấu `_` đặt ở đầu của số.
</details>

---

### Câu 11 (Question 11)
**Cho hai file class dưới đây, số lượng import TỐI ĐA có thể xóa bỏ mà code vẫn biên dịch thành công là bao nhiêu?**

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
* F. Code không biên dịch được

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (Xóa tối đa được 4 imports - tức là xóa sạch toàn bộ!)**
* **Giải thích chuyên sâu:**
  1. `import java.lang.*;` và `import java.lang.System;`: Package `java.lang` được Java **tự động import ngầm** vào mọi class. Hai dòng này hoàn toàn thừa.
  2. `import aquarium.Water;` và `import aquarium.*;`: Cả `Tank` và `Water` đều nằm chung trong cùng một package là `aquarium`. Các class trong cùng một package luôn nhìn thấy nhau mà **không cần bất kỳ dòng import nào**.
  * Do đó, cả 4 câu lệnh import đều dư thừa và có thể xóa hết.
</details>

---

### Câu 12 (Question 12)
**Các phát biểu nào về class sau đây là chính xác? (Chọn tất cả các đáp án đúng)**

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

* A. Dòng 2 sinh lỗi biên dịch.
* B. Dòng 3 sinh lỗi biên dịch.
* C. Dòng 4 sinh lỗi biên dịch.
* D. Dòng 7 sinh lỗi biên dịch.
* E. Code in ra 0.
* F. Code in ra 2.0.
* G. Code in ra 2.
* H. Code in ra 3.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C, D**
* **Giải thích chuyên sâu:**
  * **A đúng (Lỗi dòng 2):** Java không cho phép khai báo hai kiểu dữ liệu khác nhau (`int` và `double`) trong cùng một câu lệnh phân cách bằng dấu phẩy.
  * **B sai (Dòng 3 hợp lệ):** Khối initializer khai báo biến cục bộ `fins = gills` hợp lệ (dù không dùng đến).
  * **C đúng (Lỗi dòng 4):** Java **không hỗ trợ tham số mặc định (default parameter values)** như C++ hay Python. Cú pháp `int length = 3` trong danh sách tham số của hàm là lỗi cú pháp.
  * **D đúng (Lỗi dòng 7):** Biến `fins` được khai báo trong khối `{}` ở dòng 3 nên phạm vi của nó chỉ tồn tại trong khối đó. Dòng 7 cố tình truy cập `fins` sẽ báo lỗi `cannot find symbol`.
</details>

---

### Câu 13 (Question 13)
**Cho các class sau, snippet nào có thể chèn độc lập vào vị trí `INSERT IMPORTS HERE` để code biên dịch thành công? (Chọn tất cả các đáp án đúng)**

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

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B, C**
* **Giải thích chuyên sâu:**
  * **A đúng:** Import tất cả class trong `aquarium` bằng wildcard, trong đó có `aquarium.Water`. Vì không có `Water` nào khác được import nên không xung đột.
  * **B đúng:** Import rõ đích danh `aquarium.Water`.
  * **C đúng:** Import rõ đích danh `aquarium.Water` kết hợp với wildcard `aquarium.jellies.*`. Theo quy tắc phân giải của Java: **Import đích danh (explicit single-type import) luôn có độ ưu tiên cao hơn import bằng Wildcard**. Do đó `Water` ở đây được hiểu chính xác là `aquarium.Water`.
  * **D sai:** Dùng 2 wildcard của 2 package đều có class `Water`. Khi trình biên dịch thấy khai báo `Water water;`, nó sẽ báo lỗi mơ hồ: `reference to Water is ambiguous`.
  * **E sai:** Import đích danh 2 class trùng tên trong cùng 1 file sẽ gây lỗi biên dịch ngay tại dòng import thứ hai.
</details>

---

### Câu 14 (Question 14)
**Phát biểu nào sau đây về đoạn mã nguồn dưới đây là đúng? (Chọn tất cả các đáp án đúng)**

```java
3: short numPets = 5L;
4: int numGrains = 2.0;
5: String name = "Scruffy";
6: int d = numPets.length();
7: int e = numGrains.length;
8: int f = name.length();
```

* A. Dòng 3 sinh lỗi biên dịch.
* B. Dòng 4 sinh lỗi biên dịch.
* C. Dòng 5 sinh lỗi biên dịch.
* D. Dòng 6 sinh lỗi biên dịch.
* E. Dòng 7 sinh lỗi biên dịch.
* F. Dòng 8 sinh lỗi biên dịch.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B, D, E**
* **Giải thích chuyên sâu:**
  * **A đúng (Dòng 3 lỗi):** `5L` là hằng số kiểu `long` (64-bit), không thể tự động gán vào biến kiểu `short` (16-bit) mà không ép kiểu (narrowing conversion).
  * **B đúng (Dòng 4 lỗi):** `2.0` là số thực kiểu `double` (64-bit), không thể tự động gán vào biến số nguyên `int` (32-bit).
  * **C sai (Dòng 5 hợp lệ):** Khai báo String chuẩn.
  * **D đúng (Dòng 6 lỗi) & E đúng (Dòng 7 lỗi):** `numPets` và `numGrains` là các **kiểu nguyên thủy (primitives)**. Các kiểu nguyên thủy không phải là Object, do đó không có thuộc tính hay phương thức nào (không thể gọi `.length()` hay `.length`).
  * **F sai (Dòng 8 hợp lệ):** `name` là một đối tượng `String`, gọi phương thức `name.length()` là hoàn toàn chuẩn xác.
</details>

---

### Câu 15 (Question 15)
**Những phát biểu nào về cơ chế Garbage Collection là chính xác? (Chọn tất cả các đáp án đúng)**

* A. Gọi `System.gc()` đảm bảo sẽ giải phóng bộ nhớ bằng cách hủy các đối tượng đủ điều kiện.
* B. Garbage collection chạy theo một lịch trình định sẵn cố định.
* C. Garbage collection cho phép JVM tái sử dụng bộ nhớ cho các đối tượng khác.
* D. Garbage collection chạy khi chương trình dùng hết một nửa bộ nhớ khả dụng.
* E. Một đối tượng có thể đủ điều kiện dọn rác nhưng không bao giờ bị xóa khỏi heap.
* F. Một đối tượng đủ điều kiện dọn rác ngay khi không còn tham chiếu nào có thể truy cập được đến nó.
* G. Đánh dấu một biến là `final` đồng nghĩa đối tượng liên kết với nó sẽ không bao giờ bị dọn rác.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, E, F**
* **Giải thích chuyên sâu:**
  * **C đúng:** Đây là mục đích chính của bộ thu gom rác (reclaim memory).
  * **E đúng:** Nếu chương trình Java chạy nhanh và không thiếu bộ nhớ, JVM có thể kết thúc tiến trình mà không cần chạy GC lần nào, do đó đối tượng có thể không bao giờ bị xóa khỏi heap trước khi JVM tắt.
  * **F đúng:** Định nghĩa chuẩn của việc đủ điều kiện thu gom rác (*eligible for garbage collection*).
  * **A, B, D sai:** JVM tự do quyết định khi nào chạy GC; `System.gc()` không đảm bảo điều gì và không hề có lịch trình hay mốc 50% cố định nào cả.
  * **G sai:** Biến `final` chỉ không thể gán lại cho đối tượng khác, nhưng khi biến đó ra khỏi scope thì đối tượng nó trỏ tới vẫn bị GC bình thường.
</details>

---

### Câu 16 (Question 16)
**Các phát biểu nào đúng về đoạn code sau? (Chọn tất cả các đáp án đúng)**

```java
var blocky = """
   squirrel \s
   pigeon   \
   termite""";
System.out.print(blocky);
```

* A. Code in ra 2 dòng.
* B. Code in ra 3 dòng.
* C. Code in ra 4 dòng.
* D. Có một dòng có khoảng trắng thừa ở cuối (trailing whitespace).
* E. Có hai dòng có khoảng trắng thừa ở cuối.
* F. Nếu ta thụt lề mỗi dòng thêm 5 khoảng trắng, output sẽ thay đổi.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, D**
* **Giải thích chuyên sâu:**
  * **A đúng (In ra 2 dòng):**
    * Dòng 1: bắt đầu bằng `squirrel` và có `\s`.
    * Dòng 2: có ký tự gạch chéo ngược `\` ở cuối dòng sau chữ `pigeon`. Ký tự `\` có tác dụng **triệt tiêu ký tự xuống dòng** (nối dòng tiếp theo vào dòng hiện tại). Vì vậy `pigeon` và `termite` sẽ được gộp chung thành một dòng!
    * Kết quả chỉ có 2 dòng được in ra.
  * **D đúng:** Ký tự `\s` có tác dụng ép Java giữ lại khoảng trắng ở cuối dòng thay vì tự động xóa đi (strip trailing whitespace). Vì vậy chỉ có dòng 1 chứa trailing whitespace.
  * **F sai:** Nếu thụt lề cả 3 dòng thêm cùng một số khoảng trắng, đó là khoảng trắng ngẫu nhiên (*incidental whitespace*) và trình biên dịch sẽ tự động loại bỏ đi, kết quả in ra không đổi.
</details>

---

### Câu 17 (Question 17)
**Những dòng nào sẽ được in ra bởi chương trình sau? (Chọn tất cả các đáp án đúng)**

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

* A. Dòng 8 sinh lỗi biên dịch.
* B. Dòng 9 sinh lỗi biên dịch.
* C. `Empty = `
* D. `Empty = false`
* E. `Brand = `
* F. `Brand = null`
* G. `Code = 0.0`
* H. `Code = 0f`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D, F, G**
* **Giải thích chuyên sâu:**
  * Chương trình biên dịch và chạy bình thường:
    * `empty` là trường kiểu nguyên thủy `boolean` $\rightarrow$ giá trị mặc định là `false` (**D đúng**).
    * `brand` là trường kiểu tham chiếu `String` $\rightarrow$ giá trị mặc định là `null` (**F đúng**).
    * `code` là trường tĩnh kiểu `float` $\rightarrow$ giá trị mặc định là `0.0` (**G đúng**). Khi in số thực ra màn hình, Java không in hậu tố `f` (nên H sai).
</details>

---

### Câu 18 (Question 18)
**Những phát biểu nào sau đây về `var` là đúng? (Chọn tất cả các đáp án đúng)**

* A. `var` có thể được sử dụng làm tham số hàm khởi tạo (constructor parameter).
* B. Kiểu dữ liệu của `var` được xác định tại thời điểm biên dịch (compile time).
* C. `var` không thể dùng làm biến thực thể (instance variable).
* D. `var` có thể dùng trong câu lệnh khai báo gán nhiều biến cùng lúc.
* E. Giá trị của một biến `var` không thể thay đổi khi runtime.
* F. Kiểu dữ liệu của một biến `var` không thể thay đổi khi runtime.
* G. Từ `var` là một từ khóa dành riêng (reserved word) trong Java.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, C, F**
* **Giải thích chuyên sâu:**
  * **B và F đúng:** Kiểu của `var` được xác định tại compile-time và cố định suốt vòng đời chương trình.
  * **C đúng:** `var` chỉ được dùng cho biến cục bộ (local variable), không dùng cho instance field hay class field.
  * **A sai:** `var` không được dùng cho tham số của method hay constructor.
  * **D sai:** `var a = 1, b = 2;` bị cấm hoàn toàn.
  * **E sai:** Giá trị của biến `var` hoàn toàn có thể thay đổi trong quá trình chạy (miễn là cùng kiểu dữ liệu), trừ khi được đánh dấu là `final var`.
  * **G sai:** `var` là một *reserved type name*, không phải là *reserved keyword* (bạn vẫn có thể đặt tên biến là `var`).
</details>

---

### Câu 19 (Question 19)
**Các phát biểu nào đúng về đoạn code sau đây? (Chọn tất cả các đáp án đúng)**

```java
var num1 = Integer.parseInt("11");
var num2 = Integer.valueOf("B", 16);
System.out.println(Integer.max(num1, num2));
```

* A. Kết quả in ra màn hình là `11`.
* B. Kết quả in ra màn hình là `B`.
* C. Code không biên dịch được.
* D. `num1` là kiểu nguyên thủy (primitive).
* E. `num2` là kiểu nguyên thủy (primitive).
* F. Ném ra ngoại lệ `NumberFormatException` khi chạy.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, D**
* **Giải thích chuyên sâu:**
  * `Integer.parseInt("11")`: Trả về kiểu nguyên thủy `int` có giá trị là 11 $\rightarrow$ **D đúng** (`num1` là kiểu primitive `int`).
  * `Integer.valueOf("B", 16)`: Chuyển đổi ký tự `"B"` trong hệ thập lục phân (cơ số 16) sang số nguyên. Trong hệ 16: A=10, B=11. Phương thức `valueOf` trả về đối tượng Wrapper `Integer` có giá trị là 11 $\rightarrow$ **E sai** (`num2` là kiểu reference).
  * `Integer.max(num1, num2)`: Nhận hai số `11` và `11`, trả về số lớn nhất là `11` $\rightarrow$ **A đúng**.
</details>

---

### Câu 20 (Question 20)
**Phát biểu nào về class sau đây là chính xác?**

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

* A. Chương trình in ra `Q1=blue`.
* B. Chương trình in ra `Q2=1200`.
* C. Chương trình in ra `P1=null`.
* D. Chương trình in ra `P2=1400`.
* E. Dòng 4 không biên dịch được.
* F. Dòng 12 không biên dịch được.
* G. Dòng 13 không biên dịch được.
* H. Không có phương án nào đúng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Giải thích chuyên sâu:**
  * ⚠️ **Bẫy kinh điển:** Nhìn vào dòng 4: `public void PoliceBox()`. Do có kiểu trả về `void`, đây là một **method bình thường**, **KHÔNG PHẢI Constructor**!
  * Khi gọi `new PoliceBox()`, Java gọi constructor mặc định ngầm định của compiler, phương thức `PoliceBox()` ở dòng 4 không hề được gọi.
  * Vì vậy, ban đầu cả `p` và `q` đều có giá trị mặc định: `color = null`, `age = 0L`.
  * Dòng 11, 12 gán cho đối tượng của `p`: `color = "green"`, `age = 1400`.
  * Đến dòng 13: `p = q;` $\rightarrow$ biến `p` đổi sang trỏ vào đối tượng của `q` (đối tượng có giá trị mặc định `null` và `0L`).
  * Do đó khi in ra:
    * `Q1=null`, `Q2=0`
    * `P1=null`, `P2=0`
  * Đối chiếu các đáp án, chỉ có **C (`P1=null`)** là chính xác.
</details>

---

### Câu 21 (Question 21)
**Output của chương trình sau khi thực thi là gì?**

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
* F. Class không biên dịch được do dòng 3.
* G. Class không biên dịch được do dòng 4.
* H. Không có phương án nào đúng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D (In ra: `7-0-2-4-`)**
* **Giải thích chuyên sâu:**
  Thứ tự thực thi từng bước:
  1. Chương trình bắt đầu tại hàm `main()`: dòng 10 in ra `7-`.
  2. Dòng 11 tạo đối tượng `new Salmon()`. Trước khi chạy constructor, các khối **Instance Initializer** sẽ chạy theo thứ tự từ trên xuống:
     * Dòng 3: in ra giá trị hiện tại của `count`. Do là instance field kiểu `int`, giá trị mặc định ban đầu là `0` $\rightarrow$ in tiếp `0-`.
     * Dòng 4: `count++` tăng lên thành `1`.
  3. Sau khi khối initializer chạy xong, Constructor `Salmon()` mới được thực thi:
     * Dòng 6: gán `count = 4`.
     * Dòng 7: in tiếp `2-`.
  4. Quay lại hàm `main()`, dòng 12 in giá trị của `s.count` (hiện đang là 4) $\rightarrow$ in tiếp `4-`.
  * Ghép toàn bộ chuỗi lại: `7-0-2-4-`.
</details>

---

### Câu 22 (Question 22)
**Cho class sau, dòng code nào có thể thay thế độc lập vào vị trí `INSERT CODE HERE` để code biên dịch thành công? (Chọn tất cả các đáp án đúng)**

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
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, F, G**
* **Giải thích chuyên sâu:**
  * **C đúng:** `0xE` là số hệ thập lục phân (giá trị 14), gán cho `int` hợp lệ.
  * **F đúng:** `0b101` là số hệ nhị phân (giá trị 5), gán cho `int` hợp lệ.
  * **G đúng:** `9_2.1_2` có dấu `_` nằm hợp lệ giữa các chữ số, kiểu `double` hợp lệ.
  * **A sai:** Tên biến khai báo là `Amount` (chữ A hoa), trong khi dòng sau in ra `amount` (chữ a thường) $\rightarrow$ lỗi biên dịch `cannot find symbol: variable amount`.
  * **B sai:** `9L` là kiểu `long`, không thể tự động gán cho biến kiểu `int`.
  * **D sai:** `1_2.0` là số thực `double`, không thể gán cho biến `int`.
  * **E và H sai:** Dấu `_` nằm ngay cạnh dấu chấm thập phân (`_.` hoặc `._`).
</details>

---

### Câu 23 (Question 23)
**Các phát biểu nào về class sau đây là đúng? (Chọn tất cả các đáp án đúng)**

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

* A. Dòng 3 sinh lỗi biên dịch.
* B. Dòng 6 sinh lỗi biên dịch.
* C. Dòng 7 sinh lỗi biên dịch.
* D. Dòng 10 sinh lỗi biên dịch.
* E. Chương trình in ra `3` ở dòng 10.
* F. Chương trình in ra `4` ở dòng 10.
* G. Chương trình in ra `50.0` ở dòng 11.
* H. Chương trình in ra `49.0` ở dòng 11.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, D**
* **Giải thích chuyên sâu:**
  * **A đúng (Lỗi dòng 3):** `50.0` mặc định là kiểu `double`. Muốn gán cho `float`, bắt buộc phải có hậu tố `f` hoặc `F` (`50.0f`).
  * **D đúng (Lỗi dòng 10):** Biến `depth` được khai báo bên trong vòng lặp `for` (dòng 6), do đó phạm vi sống của nó chỉ nằm trong vòng `for`. Ra ngoài vòng `for` ở dòng 10, biến `depth` không còn tồn tại $\rightarrow$ lỗi biên dịch `cannot find symbol: variable depth`. (Chú ý: ở dòng 2 có biến `Depth` viết hoa chữ D, nhưng Java phân biệt hoa thường nên không thể thay thế cho `depth`).
</details>
