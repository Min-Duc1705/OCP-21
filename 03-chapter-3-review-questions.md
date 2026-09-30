# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chapter 3: Making Decisions

> **Nguồn trích dẫn:** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Trang 293–309).  
> **Số lượng:** 30 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết.  
> **Cách học:** Bạn hãy tự đọc đề và suy luận đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và khắc sâu các bẫy thi của Oracle.

---

### Câu 1 (Question 1)
**Output của đoạn code sau là gì?**

```java
32: Object skips = 10;
33: switch (skips) {
34:    case a when a < 10   -> System.out.print(2);
35:    case b when b >= 10  -> System.out.print(4);
36:    case null            -> System.out.print(6);
37:    default              -> System.out.print(8);
38: }
```

* A. `2`
* B. `4`
* C. `6`
* D. `8`
* E. Đúng một dòng không biên dịch được.
* F. Đúng hai dòng không biên dịch được.
* G. Không có phương án nào đúng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (Đúng hai dòng không biên dịch được - Dòng 34 và 35)**
* **Giải thích chuyên sâu:**
  * Trong tính năng Pattern Matching cho `switch` (Java 21), mỗi nhánh mẫu kiểu dữ liệu (*Type Pattern*) bắt buộc phải khai báo rõ **Kiểu dữ liệu** đi kèm với **Tên biến mẫu** (ví dụ: `case Integer a when a < 10`).
  * Tại dòng 34 (`case a when...`) và dòng 35 (`case b when...`), người viết đã bỏ quên kiểu dữ liệu (chỉ có tên biến `a` và `b`). Trình biên dịch sẽ báo lỗi cú pháp ở cả 2 dòng này.
  * Nếu sửa lại thành `case Integer a when a < 10` và `case Integer b when b >= 10`, code sẽ biên dịch thành công và in ra `4`.
</details>

---

### Câu 2 (Question 2)
**Kiểu dữ liệu nào sau đây có thể sử dụng được trong một biểu thức `switch` truyền thống? (Chọn tất cả các đáp án đúng)**

* A. `enum`
* B. `int`
* C. `Byte`
* D. `long`
* E. `boolean`
* F. `double`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B, C**
* **Giải thích chuyên sâu:**
  * Câu lệnh hoặc biểu thức `switch` truyền thống (không dùng Pattern Matching) hỗ trợ:
    * Các kiểu số nguyên nhỏ: `byte`, `short`, `char`, `int`.
    * Các lớp Wrapper tương ứng: `Byte` (**C**), `Short`, `Character`, `Integer` (**B**).
    * Kiểu chuỗi: `String`.
    * Kiểu liệt kê: `enum` (**A**).
  * ❌ `long` (**D**), `boolean` (**E**), `float`, `double` (**F**) không được hỗ trợ trong switch truyền thống.
</details>

---

### Câu 3 (Question 3)
**Output của đoạn code sau là gì?**

```java
3: int temperature = 4;
4: long humidity = -temperature + temperature * 3;
5: if (temperature >= 4)
6:    if (humidity < 6) System.out.println("Too Low");
7:    else System.out.println("Just Right");
8: else System.out.println("Too High");
```

* A. `Too Low`
* B. `Just Right`
* C. `Too High`
* D. Ném ngoại lệ `NullPointerException` tại runtime.
* E. Code không biên dịch được do dòng 7.
* F. Code không biên dịch được do dòng 8.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B (`Just Right`)**
* **Giải thích chuyên sâu:**
  * Tính toán giá trị: `temperature = 4`.
  * `humidity = -4 + (4 * 3) = -4 + 12 = 8`.
  * Xét điều kiện:
    * Dòng 5: `if (temperature >= 4)` $ightarrow$ `4 >= 4` là `true`. Code tiếp tục đi vào câu lệnh con bên trong.
    * Dòng 6: `if (humidity < 6)` $ightarrow$ `8 < 6` là `false`.
    * Theo quy tắc **Dangling Else**, nhánh `else` ở dòng 7 thuộc về `if` ở dòng 6. Do đó khối `else` dòng 7 được chạy và in ra `"Just Right"`.
    * Nhánh `else` ở dòng 8 thuộc về `if` ở dòng 5 (nhưng vì dòng 5 là `true` nên dòng 8 bị bỏ qua).
</details>

---

### Câu 4 (Question 4)
**Kiểu dữ liệu nào sau đây được phép đặt ở vế bên phải của vòng lặp `for-each`? (Chọn tất cả các đáp án đúng)**

* A. `Double[][]`
* B. `Object`
* C. `Map`
* D. `List`
* E. `String`
* F. `char[]`
* G. `Exception`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, D, F**
* **Giải thích chuyên sâu:**
  * Cú pháp `for-each` yêu cầu biểu thức bên phải dấu `:` phải là một **Mảng (Array)** hoặc một đối tượng cài đặt interface **`java.lang.Iterable`**.
  * **A đúng (`Double[][]`):** Là mảng 2 chiều. Mỗi phần tử lặp là một mảng 1 chiều `Double[]`.
  * **F đúng (`char[]`):** Là mảng 1 chiều kiểu nguyên thủy `char`.
  * **D đúng (`List`):** Interface `List` kế thừa từ `Collection`, và `Collection` kế thừa từ `Iterable`.
  * **B, G sai:** `Object` và `Exception` không phải mảng và không cài đặt `Iterable`.
  * **C sai:** `Map` trong Java **không cài đặt interface `Iterable`** (muốn duyệt map phải dùng `map.keySet()` hoặc `map.entrySet()`).
  * **E sai:** `String` là một chuỗi ký tự nhưng **không cài đặt `Iterable`**.
</details>

---

### Câu 5 (Question 5)
**Output khi gọi phương thức `printReptile(6)` là gì?**

```java
void printReptile(int category) {
   var type = switch (category) {
      case 1, 2 -> "Snake";
      case 3, 4 -> "Lizard";
      case 5, 6 -> "Turtle";
      case 7, 8 -> "Alligator";
   };
   System.out.print(type);
}
```

* A. `Snake`
* B. `Lizard`
* C. `Turtle`
* D. `Alligator`
* E. `TurtleAlligator`
* F. Không có phương án nào đúng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (Không có phương án nào đúng - Code KHÔNG BIÊN DỊCH ĐƯỢC)**
* **Giải thích chuyên sâu:**
  * Đây là một **Switch Expression** (vì kết quả được gán vào biến `type`).
  * Mọi Switch Expression **bắt buộc phải có tính vét cạn (Exhaustiveness)** — tức là phải bao quát hết mọi giá trị có thể có của biến đầu vào.
  * Biến `category` có kiểu `int` (có hàng tỷ giá trị từ `-2^31` đến `2^31 - 1`). Việc chỉ liệt kê các case từ 1 đến 8 mà không có nhánh `default` khiến biểu thức switch không vét cạn.
  * Trình biên dịch báo lỗi: `the switch expression does not cover all possible input values`. Vì vậy **F** là đáp án đúng.
</details>

---

### Câu 6 (Question 6)
**Output của đoạn code sau là gì?**

```java
List<Integer> myFavoriteNumbers = new ArrayList<>();
myFavoriteNumbers.add(10);
myFavoriteNumbers.add(14);

for (var a : myFavoriteNumbers) {
   System.out.print(a + ", ");
   break;
}

for (int b : myFavoriteNumbers) {
   continue;
   System.out.print(b + ", ");
}

for (Object c : myFavoriteNumbers)
   System.out.print(c + ", ");
```

* A. Code in ra `10, 10, 14, `
* B. Code in ra `10, 14, `
* C. Code in ra `10, `
* D. Vòng for đầu tiên sinh lỗi biên dịch.
* E. Vòng for thứ hai sinh lỗi biên dịch.
* F. Vòng for thứ ba sinh lỗi biên dịch.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (Vòng for thứ hai sinh lỗi biên dịch)**
* **Giải thích chuyên sâu:**
  * Xét vòng for thứ hai:
    ```java
    for (int b : myFavoriteNumbers) {
       continue;
       System.out.print(b + ", "); // ⚠️ Mã không thể chạm tới!
    }
    ```
    Lệnh `continue;` được đặt vô điều kiện ngay đầu thân vòng lặp. Dòng lệnh in `System.out.print(b + ", ");` ngay phía sau nó không bao giờ có thể được thực thi.
  * Trình biên dịch Java phát hiện và báo lỗi: **`unreachable statement`**.
</details>

---

### Câu 7 (Question 7)
**Giả sử `weather` là một mảng số nguyên hợp lệ và không rỗng, đoạn code nào sau đây khi điền vào chỗ trống sẽ in ra toàn bộ phần tử của `weather`? (Chọn tất cả các đáp án đúng)**

```java
private void print(int[] weather) {
   for (________) {
      System.out.println(weather[i]);
   }
}
```

* A. `int i = weather.length; i > 0; i--`
* B. `int i = 0; i <= weather.length - 1; ++i`
* C. `int i = 0; i <= weather.length; i++`
* D. `int i = 0; i < weather.length; i++`
* E. `int i = weather.length - 1; i >= 0; i--`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, D, E**
* **Giải thích chuyên sâu:**
  * Mảng trong Java có chỉ số từ `0` đến `length - 1`.
  * **B đúng:** Bắt đầu từ 0 đến `<=` `length - 1` (duyệt xuôi).
  * **D đúng:** Bắt đầu từ 0 đến `<` `length` (cách viết chuẩn tắc duyệt xuôi).
  * **E đúng:** Bắt đầu từ `length - 1` lùi dần về 0 (duyệt ngược toàn bộ phần tử).
  * **A sai:** Lần lặp đầu tiên gọi `weather[weather.length]` ném ngoại lệ `ArrayIndexOutOfBoundsException`.
  * **C sai:** Ở lần lặp cuối cùng khi `i == weather.length`, việc gọi `weather[weather.length]` sẽ ném ra `ArrayIndexOutOfBoundsException`.
</details>

---

### Câu 8 (Question 8)
**Output khi gọi phương thức `printType(11)` là gì?**

```java
31: void printType(Object o) {
32:    if (o instanceof Integer bat) {
33:       System.out.print("int");
34:    } else if (o instanceof Integer bat && bat < 10) {
35:       System.out.print("small int");
36:    } else if (o instanceof Long bat || bat <= 20) {
37:       System.out.print("long");
38:    } default {
39:       System.out.print("unknown");
40:    }
41: }
```

* A. `int`
* B. `small int`
* C. `long`
* D. `unknown`
* E. Dòng 32 không biên dịch được.
* F. Dòng 34 không biên dịch được.
* G. Code không biên dịch được do các dòng khác.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **G (Code không biên dịch được do nhiều lỗi)**
* **Giải thích chuyên sâu:**
  * **Lỗi 1 (Dòng 36):** `o instanceof Long bat || bat <= 20`. Theo quy tắc Flow Scoping, **cấm dùng biến mẫu ở vế phải của toán tử `||`** vì khi vế trái `false`, biến `bat` chưa được khởi tạo.
  * **Lỗi 2 (Dòng 38):** Cú pháp `default { ... }` là của cấu trúc `switch`, **không tồn tại** từ khóa `default` đi kèm với cấu trúc `if-else` (phải dùng `else { ... }`).
  * Do đó code có nhiều lỗi biên dịch $ightarrow$ **G là đáp án đúng**.
</details>

---

### Câu 9 (Question 9)
**Câu lệnh nào sau đây khi được điền độc lập vào chỗ trống sẽ khiến chương trình in ra số `2` khi chạy? (Chọn tất cả các đáp án đúng)**

```java
int count = 0;
BUNNY: for (int row = 1; row <= 3; row++)
   RABBIT: for (int col = 0; col < 3; col++) {
      if ((col + row) % 2 == 0)
         ________;
      count++;
   }
System.out.println(count);
```

* A. `break BUNNY`
* B. `break RABBIT`
* C. `continue BUNNY`
* D. `continue RABBIT`
* E. `break`
* F. `continue`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, C, E**
* **Giải thích chuyên sâu:**
  * Phân tích các bước:
    * `row = 1, col = 0`: `(1 + 0) % 2 != 0` $ightarrow$ không thỏa `if` $ightarrow$ `count++` thành **1**.
    * `row = 1, col = 1`: `(1 + 1) % 2 == 0` $ightarrow$ Thỏa mãn điều kiện `if`!
  * Ta cần chọn lệnh làm sao để `count` tăng thêm đúng 1 lần nữa rồi dừng lại ở giá trị **2**:
    * **B (`break RABBIT`) và E (`break`):** Thoát khỏi vòng lặp `col` hiện tại (`RABBIT`), quay lại vòng ngoài `row = 2`.
      * Với `row = 2, col = 0`: `(2 + 0) % 2 == 0` $ightarrow$ lại `break`, không tăng `count`.
      * Với `row = 3, col = 0`: `(3 + 0) % 2 != 0` $ightarrow$ `count++` thành **2**.
      * Sau đó `col = 1`: `(3 + 1) % 2 == 0` $ightarrow$ lại `break`. Hết vòng lặp $ightarrow$ in ra đúng **2**. (B và E đúng!).
    * **C (`continue BUNNY`):** Bỏ qua phần còn lại của `BUNNY`, tăng thẳng `row` lên giá trị tiếp theo. Hành vi này hoàn toàn tương đương với việc thoát khỏi vòng lặp con `RABBIT` $ightarrow$ cũng cho ra `count = 2`.
</details>

---

### Câu 10 (Question 10)
**Cho phương thức sau, có bao nhiêu dòng chứa lỗi biên dịch (compilation errors)?**

```java
8:  enum DayOfWeek {
9:     SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY;
10:    private DayOfWeek getWeekDay(int day, final int thursday) {
11:       int otherDay = day;
12:       int Sunday = 0;
13:       switch (otherDay) {
14:          default:
15:          case 1: continue;
16:          case thursday: return DayOfWeek.THURSDAY;
17:          case int i when i <= 0: return DayOfWeek.SUNDAY;
18:       }
19:       case null -> DayOfWeek.MONDAY;
20:       return DayOfWeek.FRIDAY;
21:    }
22: }
```

* A. 0 dòng
* B. 1 dòng
* C. 2 dòng
* D. 3 dòng
* E. 4 dòng
* F. 5 dòng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (Có đúng 4 dòng chứa lỗi biên dịch: Dòng 15, 16, 17, 19)**
* **Giải thích chuyên sâu:**
  1. **Dòng 15 lỗi:** Lệnh `continue` chỉ được phép nằm trong vòng lặp (`for`, `while`, `do-while`), **cấm dùng trong cấu trúc `switch` độc lập**.
  2. **Dòng 16 lỗi:** `thursday` là tham số của phương thức. Dù có từ khóa `final`, giá trị của nó chỉ được truyền vào khi chạy hàm nên **không phải là hằng số thời điểm biên dịch (compile-time constant)**. `switch` truyền thống yêu cầu hằng số biên dịch.
  3. **Dòng 17 lỗi:** Dòng này dùng cú pháp pattern matching (`case int i when...`). Trong Java 21, **không được phép trộn lẫn cú pháp pattern matching với cú pháp case nhãn hai chấm kiểu cũ** và kiểu `int` nguyên thủy không thể dùng pattern matching kiểu này.
  4. **Dòng 19 lỗi:** `case null -> ...` nằm trơ trọi **bên ngoài** cặp dấu ngoặc nhọn `{}` của khối lệnh `switch`!
  * Tổng cộng: đúng 4 dòng lỗi.
</details>

---

### Câu 11 (Question 11)
**Output khi gọi phương thức `printLocation(Animal.MAMMAL)` là gì?**

```java
10: class Zoo {
11:    enum Animal { BIRD, FISH, MAMMAL }
12:    void printLocation(Animal a) {
13:       long type = switch (a) {
14:          case BIRD   -> 1;
15:          case FISH   -> 2;
16:          case MAMMAL -> 3;
17:          default     -> 4;
18:       };
19:       System.out.print(type);
20:    }
21: }
```

* A. `3`
* B. `4`
* C. `34`
* D. Code không biên dịch được do dòng 17.
* E. Code không biên dịch được do dòng 18.
* F. Ném ra ngoại lệ tại runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A (`3`)**
* **Giải thích chuyên sâu:**
  * Đây là một Switch Expression hợp lệ dùng cú pháp mũi tên `->`.
  * Biến truyền vào là `Animal.MAMMAL`, khớp chính xác với `case MAMMAL -> 3;`.
  * Biểu thức trả về giá trị `3` và gán vào `long type`.
  * Nhánh `default` ở dòng 17 là tùy chọn (vì toàn bộ giá trị enum đã được bao phủ hết), việc có thêm `default` không gây lỗi.
  * In ra màn hình: `3`.
</details>

---

### Câu 12 (Question 12)
**Kết quả của đoạn code sau là gì?**

```java
3: int sing = 8, squawk = 2, notes = 0;
4: while (sing > squawk) {
5:    sing--;
6:    squawk += 2;
7:    notes += sing + squawk;
8: }
9: System.out.println(notes);
```

* A. `11`
* B. `13`
* C. `23`
* D. `33`
* E. `50`
* F. Code không biên dịch được do dòng 7.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C (`23`)**
* **Giải thích chuyên sâu:**
  * Khởi tạo: `sing = 8`, `squawk = 2`, `notes = 0`.
  * **Lần lặp 1:** Điều kiện `8 > 2` là `true`.
    * `sing--` $ightarrow$ `sing = 7`.
    * `squawk += 2` $ightarrow$ `squawk = 4`.
    * `notes += 7 + 4` $ightarrow$ `notes = 0 + 11 = 11`.
  * **Lần lặp 2:** Điều kiện `7 > 4` là `true`.
    * `sing--` $ightarrow$ `sing = 6`.
    * `squawk += 2` $ightarrow$ `squawk = 6`.
    * `notes += 6 + 6` $ightarrow$ `notes = 11 + 12 = 23`.
  * **Lần lặp 3:** Điều kiện `6 > 6` là `false` $ightarrow$ Vòng lặp dừng lại.
  * In ra: `23`.
</details>

---

### Câu 13 (Question 13)
**Kết quả khi gọi `getHatSize(9f)` trên đoạn mã sau là gì?**

```java
10: int getHatSize(Number measurement) {
11:    return switch (measurement) {
12:       case Double d            -> 1 + d.intValue();
13:       case null                -> 11;
14:       case !(Number n)         -> 3 + n.intValue();
15:       case Float f when f < 10 -> 4 + f.intValue();
16:       default                  -> 0;
17:    };
18: }
```

* A. `5`
* B. `13`
* C. `14`
* D. Code không biên dịch được do dòng 12.
* E. Code không biên dịch được do dòng 13.
* F. Code không biên dịch được do dòng 14.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (Code không biên dịch được do dòng 14)**
* **Giải thích chuyên sâu:**
  * Tại dòng 14: `case !(Number n) -> ...`.
  * Trong cú pháp Pattern Matching của Java 21, **không hỗ trợ toán tử phủ định `!` đặt trước mẫu kiểu dữ liệu**.
  * Trình biên dịch sẽ báo lỗi cú pháp ngay tại dòng 14.
</details>

---

### Câu 14 (Question 14)
**Output của đoạn code sau là gì?**

```java
2: boolean keepGoing = true;
3: int result = 15, meters = 10;
4: do {
5:    meters--;
6:    if (meters == 8) keepGoing = false;
7:    result -= 2;
8: } while keepGoing;
9: System.out.println(result);
```

* A. `7`
* B. `9`
* C. `10`
* D. `11`
* E. `15`
* F. Code không biên dịch được do dòng 6.
* G. Code không biên dịch được do dòng 8.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **G (Code không biên dịch được do dòng 8)**
* **Giải thích chuyên sâu:**
  * Nhìn kỹ dòng 8: `} while keepGoing;`
  * Trong cú pháp Java, biểu thức điều kiện của vòng lặp `do-while` **bắt buộc phải được đặt trong cặp dấu ngoặc đơn `( )`**:
    `while (keepGoing);`
  * Việc thiếu dấu ngoặc đơn `( )` khiến trình biên dịch báo lỗi cú pháp: `error: '(' expected`.
</details>

---

### Câu 15 (Question 15)
**Các phát biểu nào về đoạn code sau đây là chính xác? (Chọn tất cả các đáp án đúng)**

```java
for (var penguin : new int[2])
   System.out.println(penguin);

var ostrich = new Character[3];
for (var emu : ostrich)
   System.out.println(emu);

List<Integer> parrots = new ArrayList<Integer>();
for (var macaw : parrots)
   System.out.println(macaw);
```

* A. Kiểu dữ liệu của `penguin` là `Integer`.
* B. Kiểu dữ liệu của `penguin` là `int`.
* C. Kiểu dữ liệu của `emu` là `char`.
* D. Kiểu dữ liệu của `emu` là `Character`.
* E. Kiểu dữ liệu của `macaw` là `Object`.
* F. Kiểu dữ liệu của `macaw` là `Integer`.
* G. Đoạn code không biên dịch được.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, D, F**
* **Giải thích chuyên sâu:**
  * Vòng lặp 1: `new int[2]` là mảng các số nguyên nguyên thủy `int[]`, do đó `var penguin` được suy luận là kiểu **`int`** (**B đúng**).
  * Vòng lặp 2: `ostrich` có kiểu `Character[]` (mảng wrapper), do đó `var emu` được suy luận là kiểu **`Character`** (**D đúng**).
  * Vòng lặp 3: `parrots` là `List<Integer>`, do đó `var macaw` được suy luận là kiểu phần tử của danh sách: **`Integer`** (**F đúng**).
</details>

---

### Câu 16 (Question 16)
**Kết quả của đoạn code sau là gì?**

```java
final char a = 'A', d = 'D';
char grade = 'B';
switch (grade) {
   case a:
   case 'B': System.out.print("great");
   case 'C': System.out.print("good"); break;
   case d:
   case final Middle: System.out.print(13);
   case 'F': System.out.print("not good");
}
```

* A. In ra `great`
* B. In ra `greatgood`
* C. In ra `13not good`
* D. Dòng khai báo `final Middle` gây lỗi biên dịch vì chưa khai báo kiểu.
* E. Dòng `case d:` gây lỗi biên dịch.
* F. Dòng `case final Middle:` sinh lỗi biên dịch.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (Dòng `case final Middle:` sinh lỗi biên dịch)**
* **Giải thích chuyên sâu:**
  * Cú pháp nhãn `case` trong switch truyền thống chỉ nhận một hằng số biểu thức.
  * Cú pháp `case final Middle:` hoàn toàn sai ngữ pháp trong Java vì không được phép dùng từ khóa `final` đứng trước tên biến như vậy trong nhãn case.
</details>

---

### Câu 17 (Question 17)
**Cho mảng sau, đoạn code nào sẽ in ra các phần tử của mảng `wolf` theo THỨ TỰ NGƯỢC LẠI (Reverse order)? (Chọn tất cả các đáp án đúng)**

```java
String[] wolf = { "W", "e", "b", "b", "y" };
```

* A.
  ```java
  for (int m = wolf.length - 1; m >= 0; m--)
     System.out.print(wolf[m]);
  ```
* B.
  ```java
  for (int m = wolf.length - 1; m >= 0; --m)
     System.out.print(wolf[m]);
  ```
* C.
  ```java
  for (int m = 0; m < wolf.length; m++)
     System.out.print(wolf[wolf.length - m]);
  ```
* D.
  ```java
  for (int m = wolf.length; m > 0; --m)
     System.out.print(wolf[m - 1]);
  ```

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B, D**
* **Giải thích chuyên sâu:**
  * Mảng có chỉ số từ 0 đến `wolf.length - 1` (từ 0 đến 4). Muốn in ngược cần truy cập từ index 4 về 0:
  * **A và B đúng:** Bắt đầu từ `wolf.length - 1`, điều kiện `>= 0`, bước nhảy `m--` hoặc `--m` đều giảm biến sau mỗi lần lặp.
  * **D đúng:** Bắt đầu từ `wolf.length`, điều kiện `> 0`, truy cập phần tử `wolf[m - 1]` (chính là từ index 4 về 0).
  * **C sai:** Ở lần lặp đầu tiên `m = 0`, truy cập `wolf[wolf.length - 0]` ném ra `ArrayIndexOutOfBoundsException`.
</details>

---

### Câu 18 (Question 18)
**Những số phân biệt nào (distinct numbers) sẽ được in ra khi thực thi phương thức sau? (Chọn tất cả các đáp án đúng)**

```java
private void countAttendees() {
   int participants = 4, animals = 2, performers = -1;

   while ((participants = participants + 1) < 10) {}
   do {} while (animals++ <= 1);
   for ( ; performers < 2; performers += 2) {}

   System.out.println(participants);
   System.out.println(animals);
   System.out.println(performers);
}
```

* A. `2`
* B. `3`
* C. `4`
* D. `5`
* E. `10`
* F. Code không biên dịch được.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, E (Các số phân biệt được in ra là 3 và 10)**
* **Giải thích chuyên sâu:**
  1. Vòng lặp 1: `while ((participants = participants + 1) < 10) {}`
     * Khi `participants` tăng lên 9: `9 < 10` là true $ightarrow$ lặp tiếp.
     * Khi `participants` tăng lên 10: `10 < 10` là false $ightarrow$ dừng. Giá trị của `participants = 10`.
  2. Vòng lặp 2: `do {} while (animals++ <= 1);`
     * Ban đầu `animals = 2`. Thân rỗng chạy lần 1.
     * Kiểm tra điều kiện: `animals++ <= 1` lấy giá trị cũ `2 <= 1` là `false` $ightarrow$ dừng ngay. Sau đó `animals` tăng lên thành `3`.
  3. Vòng lặp 3: `for ( ; performers < 2; performers += 2) {}`
     * `performers = -1 < 2` $ightarrow$ lặp, tăng thêm 2 thành `1`.
     * `performers = 1 < 2` $ightarrow$ lặp, tăng thêm 2 thành `3`.
     * `performers = 3 < 2` là false $ightarrow$ dừng. Giá trị của `performers = 3`.
  * Ba giá trị in ra là: `10`, `3`, `3`. Các số phân biệt là **10** (**E**) và **3** (**B**).
</details>

---

### Câu 19 (Question 19)
**Output của đoạn code sau là gì?**

```java
2: double iguana = 0;
3: do {
4:    int snake = 1;
5:    System.out.print(snake++ + " ");
6:    iguana--;
7: } while (snake <= 5);
8: System.out.println(iguana);
```

* A. `1 2 3 4 -4.0`
* B. `1 2 3 4 -5.0`
* C. `1 2 3 4 5 -4.0`
* D. `0 1 2 3 4 5 -5.0`
* E. Code không biên dịch được do dòng 7.
* F. Code biên dịch được nhưng lặp vô tận.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (Code không biên dịch được do dòng 7)**
* **Giải thích chuyên sâu:**
  * Biến `snake` được khai báo ở dòng 4, tức là **bên trong thân của khối lệnh `do { ... }`**.
  * Phạm vi của `snake` kết thúc tại dấu đóng ngoặc nhọn `}` ở dòng 6.
  * Tại dòng 7, điều kiện `while (snake <= 5);` nằm ngoài phạm vi khối lệnh nên không thể nhìn thấy biến `snake`.
  * Trình biên dịch báo lỗi: `cannot find symbol: variable snake`.
</details>

---

### Câu 20 (Question 20)
**Câu lệnh nào khi điền vào chỗ trống sẽ cho phép đoạn mã biên dịch và chạy mà KHÔNG BỊ RƠI VÀO VÒNG LẶP VÔ HẠN? (Chọn tất cả các đáp án đúng)**

```java
4:  int height = 1;
5:  L1: while (height++ < 10) {
6:     long humidity = 12;
7:     L2: do {
8:        if (humidity-- % 12 == 0) ________;
9:        int temperature = 30;
10:       L3: while (true) {
11:          // ...
12:       }
13:    } while (humidity > 0);
14: }
```

* A. `break L1`
* B. `break L2`
* C. `continue L2`
* D. `continue L3`
* E. `continue L1`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, E**
* **Giải thích chuyên sâu:**
  * Vòng lặp trong cùng `L3: while (true)` là một vòng lặp vô hạn. Nếu luồng điều khiển đi tới dòng 10, chương trình sẽ bị treo vĩnh viễn trong `L3`.
  * Do đó, điều kiện `if (humidity-- % 12 == 0)` ở dòng 8 (thỏa mãn ngay ở lần chạy đầu tiên vì 12 % 12 == 0) bắt buộc phải nhảy thoát ra khỏi hoặc bỏ qua toàn bộ khối bên dưới:
    * **A (`break L1`):** Thoát hẳn khỏi vòng lặp ngoài cùng `L1` $ightarrow$ Kết thúc an toàn.
    * **E (`continue L1`):** Nhảy sang lần lặp tiếp theo của `L1`, bỏ qua việc đi xuống `L3` $ightarrow$ Không bị vô hạn.
    * Các phương án khác vẫn để chương trình trôi xuống hoặc lặp vô tận.
</details>

---

### Câu 21 (Question 21)
**Cần sửa TỐI THIỂU bao nhiêu dòng để phương thức sau có thể biên dịch thành công?**

```java
21: void findZookeeper(Integer id) {
22:    System.out.print(switch (id) {
23:       case 10 -> {"Jane";}
24:       case 20 -> {yield "Lisa";};
25:       case 30 -> "Kelly";
26:       case 30 -> "Sarah";
27:       default -> "Unassigned";
28:    });
29: }
```

* A. 1 dòng
* B. 2 dòng
* C. 3 dòng
* D. 4 dòng
* E. 5 dòng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D (Tối thiểu 4 dòng cần sửa)**
* **Giải thích chuyên sâu:**
  1. **Dòng 23:** Khối `{ "Jane"; }` thiếu từ khóa `yield` $ightarrow$ Phải sửa thành `{ yield "Jane"; }`.
  2. **Dòng 24:** Thừa dấu chấm phẩy sau dấu ngoặc nhọn `{ yield "Lisa"; };` $ightarrow$ Phải bỏ dấu `;` thừa bên ngoài.
  3. **Dòng 25 và 26:** Trùng lặp giá trị `case 30` (Duplicate case label) $ightarrow$ Phải sửa một trong hai dòng (ví dụ đổi thành `case 40`) hoặc xóa đi 1 dòng.
  * Tổng cộng có đúng 4 dòng cần sửa đổi/xóa bỏ.
</details>

---

### Câu 22 (Question 22)
**Output của đoạn code sau là gì?**

```java
2: var tailFeathers = 3;
3: final var one = 1;
4: switch (tailFeathers) {
5:    case one: System.out.print(3 + " ");
6:    default: case 3: System.out.print(5 + " ");
7: }
8: while (tailFeathers > 1) {
9:    System.out.print(--tailFeathers + " ");
10: }
```

* A. `3 `
* B. `5 1 `
* C. `5 2 `
* D. `3 5 1 `
* E. `5 2 1 `
* F. Code không biên dịch được do dòng 3.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (`5 2 1 `)**
* **Giải thích chuyên sâu:**
  * Dòng 3: `final var one = 1;` là hằng số biên dịch hợp lệ.
  * Dòng 4: `tailFeathers = 3`. Khớp với `case 3:` ở dòng 6 $ightarrow$ in ra: `5 `.
  * Hết khối `switch` (dòng 7).
  * Dòng 8: Vòng lặp `while (tailFeathers > 1)`:
    * Lần 1: `--tailFeathers` giảm từ 3 xuống 2 $ightarrow$ in ra: `2 `.
    * Lần 2: `--tailFeathers` giảm từ 2 xuống 1 $ightarrow$ in ra: `1 `.
    * Lần 3: `1 > 1` là false $ightarrow$ dừng.
  * Toàn bộ chuỗi in ra: `5 2 1 `.
</details>

---

### Câu 23 (Question 23)
**Output của đoạn code sau là gì?**

```java
15: int penguin = 50, turtle = 75;
16: boolean older = penguin >= turtle;
17: if (older = true) System.out.println("Success");
18: else System.out.println("Failure");
19: else if (penguin != 50) System.out.println("Other");
```

* A. `Success`
* B. `Failure`
* C. `Other`
* D. Code không biên dịch được do dòng 16.
* E. Code không biên dịch được do dòng 17.
* F. Code không biên dịch được do dòng 19.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (Code không biên dịch được do dòng 19)**
* **Giải thích chuyên sâu:**
  * Cấu trúc `if-else` chỉ có thể kết thúc bằng một nhánh `else` duy nhất.
  * Nhánh `else` ở dòng 18 đã khép lại toàn bộ câu lệnh `if` bắt đầu từ dòng 17.
  * Dòng 19 lại tiếp tục viết `else if (...)` trơ trọi mà không có `if` nào đứng trước để ghép nối.
  * Trình biên dịch báo lỗi: `'else' without 'if'`.
</details>

---

### Câu 24 (Question 24)
**Output của đoạn code sau là gì?**

```java
22: String zooStatus = "Closed";
23: int visitors = switch (zooStatus) {
24:    case String s when s.equals("Open")            -> 10;
25:    case Object s when s != null && !s.equals("") -> 20;
26:    case null                                     -> { yield 30; }
27:    default                                       -> 40;
28: };
29: System.out.print(visitors);
```

* A. `10`
* B. `20`
* C. `30`
* D. `40`
* E. Code không biên dịch được do dòng 25.
* F. Code không biên dịch được do dòng 26.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B (`20`)**
* **Giải thích chuyên sâu:**
  * Đây là tính năng Pattern Matching cho `switch` của Java 21:
  * Biến `zooStatus = "Closed"`.
  * Dòng 24: `s.equals("Open")` là `false` $ightarrow$ bỏ qua.
  * Dòng 25: `s` thuộc kiểu `Object`, điều kiện `s != null && !s.equals("")` kiểm tra `"Closed"` khác null và không rỗng $ightarrow$ `true`!
  * Nhánh này được chọn và trả về giá trị `20`.
  * Các nhánh được sắp xếp hợp lệ (không có nhánh nào bị dominate) nên code biên dịch và in ra `20`.
</details>

---

### Câu 25 (Question 25)
**Output của đoạn code sau là gì?**

```java
6:  String instrument = "violin";
7:  final String CELLO = "cello";
8:  String viola = "viola";
9:  int p = -1;
10: switch (instrument) {
11:    case "bass" : break;
12:    case CELLO  : p++;
13:    default     : p++;
14:    case "VIOLIN": p++;
15:    case "viola" : ++p; break;
16: }
17: System.out.print(p);
```

* A. `-1`
* B. `0`
* C. `1`
* D. `2`
* E. `3`
* F. Code không biên dịch được do dòng 12.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D (`2`)**
* **Giải thích chuyên sâu:**
  * `instrument = "violin"`.
  * So sánh với các case: `"bass"`, `"cello"` (từ `CELLO`), `"VIOLIN"` (viết hoa), `"viola"` đều không khớp (Java phân biệt hoa thường).
  * Do không khớp case nào, chương trình nhảy vào nhánh **`default:`** ở dòng 13:
    * `p++` $ightarrow$ `p` từ `-1` tăng lên `0`.
    * ⚠️ **Do không có lệnh `break`**, code rơi tự do (*fall-through*) xuống dòng 14:
      * `p++` $ightarrow$ `p` từ `0` tăng lên `1`.
    * Tiếp tục rơi tự do xuống dòng 15:
      * `++p` $ightarrow$ `p` từ `1` tăng lên `2`.
      * Gặp lệnh `break;` $ightarrow$ thoát switch.
  * In ra: `2`.
</details>

---

### Câu 26 (Question 26)
**Output của đoạn code sau là gì?**

```java
9:  int w = 0, r = 1;
10: String name = "";
11: while (w < 2) {
12:    name += "A";
13:    do {
14:       name += "B";
15:       if (name.length() > 0) name += "C";
16:       else break;
17:    } while (r <= 1);
18:    r++; w++;
19: }
20: System.out.println(name);
```

* A. `ABC`
* B. `ABCABC`
* C. `ABCABCABC`
* D. Dòng 15 chứa lỗi biên dịch.
* E. Dòng 18 chứa lỗi biên dịch.
* F. Code biên dịch được nhưng lặp vô hạn tại runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (Code biên dịch được nhưng lặp vô hạn tại runtime)**
* **Giải thích chuyên sâu:**
  * Nhìn vào vòng lặp con `do { ... } while (r <= 1);` (dòng 13–17):
    * Biến `r` có giá trị ban đầu là `1`.
    * Lệnh tăng `r++` nằm ở dòng 18 (bên ngoài vòng `do-while`).
    * Bên trong thân `do-while`, biến `r` hoàn toàn không hề bị thay đổi, điều kiện `r <= 1` luôn luôn là `true`.
    * Nhánh `if (name.length() > 0)` luôn luôn chạy và không bao giờ chạm tới nhánh `else break;`.
  * Vì vậy vòng lặp `do-while` chạy vô tận và chương trình không bao giờ dừng.
</details>

---

### Câu 27 (Question 27)
**Output của đoạn code sau là gì?**

```java
23: byte amphibian = 2;
24: String name = "Salamander";
25: String color = switch (amphibian) {
26:    case 1 -> { yield "Red"; }
27:    case 2 -> { if (name.equals("Frog")) yield "Green";
28:                yield "Blue"; }
29:    case 3 -> { yield "Purple"; }
30:    default -> throw new RuntimeException();
31: };
32: System.out.print(color);
```

* A. `Red`
* B. `Green`
* C. `Purple`
* D. `Blue`
* E. Code không biên dịch được.
* F. Ném ra ngoại lệ tại runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D (`Blue`)**
* **Giải thích chuyên sâu:**
  * `amphibian = 2`, khớp với `case 2 -> { ... }`.
  * Trong khối lệnh của `case 2`:
    * Kiểm tra: `name.equals("Frog")` $ightarrow$ `"Salamander".equals("Frog")` là `false`.
    * Lệnh `yield "Green";` bị bỏ qua.
    * Dòng tiếp theo chạy: `yield "Blue";` trả về giá trị `"Blue"` cho switch.
  * In ra: `Blue`.
</details>

---

### Câu 28 (Question 28)
**Output khi gọi phương thức `getFish("goldie")` là gì?**

```java
40: void getFish(Object fish) {
41:    if (!(fish instanceof String guppy))
42:       System.out.print("Eat!");
43:    else if (!(fish instanceof String guppy)) {
44:       throw new RuntimeException();
45:    }
46:    System.out.print("Swim!");
47: }
```

* A. `Eat!`
* B. `Swim!`
* C. `Eat!` kèm theo ném ngoại lệ
* D. `Eat!Swim!`
* E. Ném ngoại lệ ra màn hình
* F. Không có phương án nào đúng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (Không có phương án nào đúng - Code KHÔNG BIÊN DỊCH ĐƯỢC)**
* **Giải thích chuyên sâu:**
  * Hãy phân tích cơ chế Flow Scoping:
    * Dòng 41: `if (!(fish instanceof String guppy))`
    * Khi rẽ vào nhánh `else` (dòng 43), điều đó có nghĩa là `fish` **CHẮC CHẮN LÀ `String`**, và biến mẫu `guppy` đã tồn tại trong phạm vi của khối `else` này!
    * Tại dòng 43, lại tiếp tục khai báo: `else if (!(fish instanceof String guppy))`.
    * Trình biên dịch báo lỗi: **`variable guppy is already defined in method getFish(Object)`** (Trùng lặp tên biến cục bộ trong cùng một phạm vi).
</details>

---

### Câu 29 (Question 29)
**Kết quả của đoạn code sau là gì?**

```java
1: public class PrintIntegers {
2:    public static void main(String[] args) {
3:       int y = -2;
4:       do System.out.print(++y + " ");
5:       while (y <= 5);
6:    }
7: }
```

* A. `-2 -1 0 1 2 3 4 5 `
* B. `-2 -1 0 1 2 3 4 `
* C. `-1 0 1 2 3 4 5 6 `
* D. `-1 0 1 2 3 4 5 `
* E. Code không biên dịch được do dòng 5.
* F. Code lặp vô tận.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C (`-1 0 1 2 3 4 5 6 `)**
* **Giải thích chuyên sâu:**
  * Ban đầu: `y = -2`.
  * **Lần 1:** Tiền tố `++y` tăng `y` lên `-1` và in ra `-1 `. Kiểm tra: `-1 <= 5` là true $ightarrow$ Lặp tiếp.
  * Tiếp tục tăng và in ra: `0 1 2 3 4`.
  * Khi `y = 4`, `++y` in ra `5 `. Kiểm tra: `5 <= 5` là `true` $ightarrow$ Vẫn tiếp tục lặp!
  * Lần lặp cuối: `++y` tăng `y` lên `6` và in ra `6 `. Kiểm tra: `6 <= 5` là `false` $ightarrow$ Dừng vòng lặp.
  * Chuỗi in ra hoàn chỉnh: `-1 0 1 2 3 4 5 6 `.
</details>

---

### Câu 30 (Question 30)
**Số dòng TỐI THIỂU cần phải thay đổi hoặc xóa bỏ để đoạn code sau biên dịch và trả về giá trị khi gọi `dance(10)` là bao nhiêu?**

```java
41: double dance(Object speed) {
42:    return switch (speed) {
43:       case 5 -> { yield 4 };
44:       case 10 -> 8;
45:       case 15, 20 -> 12;
46:       default -> 20;
47:       case null -> 16;
48:    }
49: }
```

* A. 0 dòng (code biên dịch bình thường)
* B. 1 dòng
* C. 2 dòng
* D. 3 dòng
* E. 4 dòng
* F. 5 dòng
* G. 6 dòng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (Tối thiểu 4 dòng)**
* **Giải thích chuyên sâu:**
  Các lỗi biên dịch cần sửa:
  1. **Dòng 43:** Thiếu dấu chấm phẩy sau lệnh yield: `{ yield 4; }`.
  2. **Dòng 46 & 47:** Nhánh `default` đứng trước `case null` $ightarrow$ `default` thống trị `case null` khiến trình biên dịch báo lỗi `dominated case label`. Phải đổi chỗ hoặc sửa 2 dòng này.
  3. **Dòng 48:** Lệnh `return switch (...) { ... };` bắt buộc phải có **dấu chấm phẩy `;`** sau dấu ngoặc nhọn đóng `}` của switch expression.
  * Tổng cộng cần sửa đổi/điều chỉnh tối thiểu **4 dòng** $ightarrow$ Đáp án **E**.
</details>
