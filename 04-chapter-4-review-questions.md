# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chapter 4: Core APIs

> **Nguồn trích dẫn:** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Trang 400–411).  
> **Số lượng:** 22 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết (Trang 1341–1347).  
> **Cách học:** Bạn hãy tự đọc đề và suy luận đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và khắc sâu các bẫy thi của Oracle.

---

### Câu 1 (Question 1)
**Output của đoạn code sau là gì?**

```java
1: public class Fish {
2:    public static void main(String[] args) {
3:       int numFish = 4;
4:       String fishType = "tuna";
5:       String anotherFish = numFish + 1;
6:       System.out.println(anotherFish + " " + fishType);
7:       System.out.println(numFish + " " + 1);
8: } }
```

* A. `4 1`
* B. `5`
* C. `5 tuna`
* D. `5tuna`
* E. `51tuna`
* F. Code không biên dịch được (The code does not compile).

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (Code không biên dịch được - Lỗi tại dòng 5)**
* **Giải thích chuyên sâu:**
  * Câu hỏi này kiểm tra sự chú ý của bạn về **kiểu dữ liệu** và **toán tử `+`**.
  * Tại dòng 5: `numFish` là kiểu `int` (giá trị 4) và `1` là một số nguyên kiểu `int`. Vì cả hai toán hạng đều là số nguyên, phép toán `numFish + 1` là **phép cộng số học**, trả về kết quả số nguyên là `5` (kiểu `int`).
  * Trình biên dịch sẽ báo lỗi tại dòng 5 vì Java **không cho phép gán trực tiếp một giá trị `int` vào một biến tham chiếu kiểu `String`** mà không có chuyển đổi kiểu (`incompatible types: int cannot be converted to String`).
  * Nếu dòng 5 được sửa thành: `String anotherFish = numFish + 1 + "";` hoặc `String anotherFish = "" + (numFish + 1);`, code sẽ biên dịch thành công và in ra:
    ```
    5 tuna
    4 1
    ```
</details>

---

### Câu 2 (Question 2)
**Khai báo mảng nào sau đây là KHÔNG hợp lệ? (Chọn tất cả các đáp án đúng)**

* A. `int[][] scores = new int[5][];`
* B. `Object[][][] cubbies = new Object[3][0][5];`
* C. `String beans[] = new beans[6];`
* D. `java.util.Date[] dates[] = new java.util.Date[2][];`
* E. `int[][] types = new int[];`
* F. `int[][] java = new int[][];`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, E, F**
* **Giải thích chuyên sâu:**
  * **C không hợp lệ:** Phía sau từ khóa `new` bắt buộc phải là một kiểu dữ liệu hợp lệ (ví dụ `new String[6]`), nhưng ở đây lại dùng `beans` (vốn là tên biến) làm kiểu dữ liệu $\rightarrow$ Lỗi biên dịch.
  * **E và F không hợp lệ:** Khi khởi tạo mảng đa chiều bằng từ khóa `new`, **chiều đầu tiên bắt buộc phải có kích thước xác định**. Java cho phép bỏ trống kích thước ở các chiều phía sau (như câu A: `new int[5][]`), nhưng tuyệt đối không được bỏ trống chiều đầu tiên. Do đó cả `new int[]` (câu E - thiếu kích thước và sai số chiều) và `new int[][]` (câu F - bỏ trống kích thước chiều đầu tiên) đều không biên dịch được.
  * **A hợp lệ:** Khai báo mảng 2 chiều hợp lệ với chiều thứ nhất có kích thước 5.
  * **B hợp lệ:** Khai báo mảng 3 chiều có kích thước hợp lệ (kích thước mảng bằng 0 vẫn hợp lệ trong Java).
  * **D hợp lệ:** Cú pháp đặt dấu `[]` phân tán: `java.util.Date[] dates[]` tương đương với `java.util.Date[][] dates`, đây là một mảng 2 chiều hợp lệ.
</details>

---

### Câu 3 (Question 3)
**Biết rằng ngày 12 tháng 3 năm 2028 là cuối tuần đổi giờ mùa xuân (*spring forward*), và ngày 5 tháng 11 năm 2028 là cuối tuần lùi giờ mùa thu (*fall back*) cho giờ mùa hè (*Daylight Saving Time - DST*). Lựa chọn nào sau đây có thể điền vào chỗ trống mà KHÔNG làm code ném ra ngoại lệ? (Chọn tất cả các đáp án đúng)**

```java
var zone = ZoneId.of("US/Eastern");
var date = ______________________;
var time = LocalTime.of(2, 15);
var z = ZonedDateTime.of(date, time, zone);
```

* A. `LocalDate.of(2028, 3, 12)`
* B. `LocalDate.of(2028, 3, 40)`
* C. `LocalDate.of(2028, 11, 5)`
* D. `LocalDate.of(2028, 11, 6)`
* E. `LocalDate.of(2029, 2, 29)`
* F. `LocalDate.of(2028, MonthEnum.MARCH, 12);`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C, D**
* **Giải thích chuyên sâu:**
  * **B ném ngoại lệ:** Tháng 3 chỉ có tối đa 31 ngày, giá trị ngày 40 ném `DateTimeException`.
  * **E ném ngoại lệ:** Năm 2029 không phải là năm nhuận (2029 không chia hết cho 4), tháng 2 chỉ có 28 ngày $\rightarrow$ ném `DateTimeException`.
  * **F không biên dịch được:** Enum biểu diễn tháng trong gói `java.time` có tên là `Month`, không tồn tại enum nào tên là `MonthEnum`.
  * **D hợp lệ:** Ngày 6/11/2028 là một ngày bình thường, không liên quan đến chuyển đổi DST.
  * **A và C hợp lệ:** Đây là điểm nhấn thông minh của `java.time`: Vào ngày đổi giờ mùa xuân (12/3/2028), khoảng thời gian từ 2:00 AM đến 2:59 AM thực tế không tồn tại trên mặt đồng hồ địa phương. Tuy nhiên, phương thức `ZonedDateTime.of(...)` **không hề ném ngoại lệ**! Thay vào đó, nó tự động cuộn thời gian sang múi giờ mới và nhảy vọt về phía trước (cuộn thành 3:15 AM). Tương tự vào ngày lùi giờ mùa thu (5/11/2028), Java sẽ tự động chọn thời điểm trước khi lùi giờ mà không ném lỗi.
</details>

---

### Câu 4 (Question 4)
**Các giá trị nào sau đây sẽ được in ra bởi đoạn code này? (Chọn tất cả các đáp án đúng)**

```java
3: var s = "Hello";
4: var t = new String(s);
5: if ("Hello".equals(s)) System.out.println("one");
6: if (t == s) System.out.println("two");
7: if (t.intern() == s) System.out.println("three");
8: if ("Hello" == s) System.out.println("four");
9: if ("Hello".intern() == t) System.out.println("five");
```

* A. `one`
* B. `two`
* C. `three`
* D. `four`
* E. `five`
* F. Code không biên dịch được.
* G. Không có đáp án nào ở trên.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C, D**
* **Giải thích chuyên sâu:**
  * Dòng 3: `s` trỏ tới literal `"Hello"` trong String Pool.
  * Dòng 4: `t` được tạo bằng từ khóa `new String(s)`, tạo một đối tượng chuỗi độc lập mới ngoài Heap (khác tham chiếu với `s`).
  * Dòng 5: `"Hello".equals(s)` so sánh nội dung ký tự $\rightarrow$ trả về `true` $\rightarrow$ in ra **`one`** (A đúng).
  * Dòng 6: `t == s` so sánh tham chiếu. Vì `t` là đối tượng ngoài Heap còn `s` nằm trong String Pool $\rightarrow$ `false` (B sai).
  * Dòng 7: `t.intern()` trả về tham chiếu chuẩn của `"Hello"` trong String Pool (chính là tham chiếu `s`) $\rightarrow$ `t.intern() == s` là `true` $\rightarrow$ in ra **`three`** (C đúng).
  * Dòng 8: `"Hello" == s` so sánh hai tham chiếu cùng trỏ tới chuỗi literal trong String Pool $\rightarrow$ trả về `true` $\rightarrow$ in ra **`four`** (D đúng).
  * Dòng 9: `"Hello".intern()` trả về tham chiếu từ String Pool, trong khi `t` là đối tượng ngoài Heap $\rightarrow$ so sánh `==` trả về `false` (E sai).
</details>

---

### Câu 5 (Question 5)
**Kết quả của đoạn code sau là gì?**

```java
7: var sb = new StringBuilder();
8: sb.append("aaa").insert(1, "bb").insert(4, "ccc");
9: System.out.println(sb);
```

* A. `abbaaccc`
* B. `abbaccca`
* C. `bbaaaccc`
* D. `bbaaccca`
* E. Một dòng trống.
* F. Code không biên dịch được.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B (`abbaccca`)**
* **Giải thích chuyên sâu (Từng bước thực thi Method Chaining):**
  1. Ban đầu: `sb` rỗng `""`.
  2. `append("aaa")`: `sb` trở thành `"aaa"` (chỉ số 0: 'a', 1: 'a', 2: 'a').
  3. `insert(1, "bb")`: Chèn chuỗi `"bb"` vào vị trí index 1:
     * Ký tự tại index 0 giữ nguyên: `'a'`.
     * Chèn 2 ký tự: `'b'`, `'b'` vào vị trí 1 và 2.
     * Các ký tự cũ từ index 1 (`'a'`, `'a'`) bị dịch sang vị trí 3 và 4.
     * Nội dung `sb` hiện tại: `"abbaa"`.
  4. `insert(4, "ccc")`: Chèn chuỗi `"ccc"` vào vị trí index 4:
     * Ký tự từ index 0 đến 3 giữ nguyên: `"abba"`.
     * Chèn `"ccc"` vào vị trí 4, 5, 6.
     * Ký tự tại index 4 cũ (`'a'`) bị đẩy sang index 7.
     * Kết quả cuối cùng: `"abbaccca"`.
</details>

---

### Câu 6 (Question 6)
**Có bao nhiêu dòng trong đoạn code sau chứa lỗi biên dịch?**

```java
23: double one = Math.pow(1, 2);
24: int two = Math.round(1.0);
25: float three = Math.random();
26: var doubles = new double[] {one, two, three};
```

* A. `0`
* B. `1`
* C. `2`
* D. `3`
* E. `4`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C (Có đúng 2 dòng lỗi: dòng 24 và dòng 25)**
* **Giải thích chuyên sâu:**
  * **Dòng 23 hợp lệ:** `Math.pow(1, 2)` nhận và trả về kiểu `double`, gán vào biến `double one` hoàn toàn hợp lệ.
  * **Dòng 24 LỖI BIÊN DỊCH:** Phương thức `Math.round()` khi truyền đối số là `double` (`1.0`) sẽ **trả về kiểu `long`** (không phải `int`). Không thể gán trực tiếp một giá trị `long` vào biến `int` mà không ép kiểu tường minh!
  * **Dòng 25 LỖI BIÊN DỊCH:** Phương thức `Math.random()` luôn **trả về kiểu `double`** (nằm trong khoảng $[0.0, 1.0)$). Gán `double` vào biến `float` gây lỗi mất mát dữ liệu (*narrowing conversion*).
  * **Dòng 26 hợp lệ:** Nếu sửa các lỗi trên, mảng `double[]` có thể chứa các giá trị `double`, `int` hoặc `long` (nhờ nới rộng kiểu ngầm định).
  * Vì có đúng 2 dòng lỗi (24 và 25), đáp án chính xác là C.
</details>

---

### Câu 7 (Question 7)
**Nhận định nào sau đây là ĐÚNG về hai giá trị ngày giờ sau? (Chọn tất cả các đáp án đúng)**

```
2025-08-28T05:00 GMT-04:00
2025-08-28T09:00 GMT-06:00
```

* A. Giá trị ngày/giờ thứ nhất xảy ra sớm hơn (The first date/time is earlier).
* B. Giá trị ngày/giờ thứ hai xảy ra sớm hơn (The second date/time is earlier).
* C. Cả hai ngày/giờ đều đại diện cho cùng một thời điểm.
* D. Hai ngày/giờ cách nhau 2 tiếng.
* E. Hai ngày/giờ cách nhau 6 tiếng.
* F. Hai ngày/giờ cách nhau 10 tiếng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, E**
* **Giải thích chuyên sâu:**
  * Để so sánh hai mốc thời gian có múi giờ khác nhau, cách chuẩn xác nhất là **quy đổi cả hai về mốc giờ chuẩn quốc tế GMT (UTC)** bằng công thức:  
    $$	ext{GMT Time} = 	ext{Local Time} - (	ext{Offset})$$
  * **Mốc 1:** `05:00` tại `GMT-04:00`  
    $\rightarrow 	ext{GMT} = 05:00 - (-04:00) = 05:00 + 04:00 =$ **`09:00 GMT`** ngày 28/08/2025.
  * **Mốc 2:** `09:00` tại `GMT-06:00`  
    $\rightarrow 	ext{GMT} = 09:00 - (-06:00) = 09:00 + 06:00 =$ **`15:00 GMT`** ngày 28/08/2025.
  * So sánh trên trục thời gian GMT:
    * `09:00 GMT` xảy ra sớm hơn `15:00 GMT` $\rightarrow$ **Mốc thứ nhất sớm hơn (A đúng)**.
    * Chênh lệch thực tế: $15:00 - 09:00 =$ **6 tiếng (E đúng)**.
</details>

---

### Câu 8 (Question 8)
**Lệnh nào sau đây sẽ trả về giá trị hoặc in ra `5` khi chạy độc lập? (Chọn tất cả các đáp án đúng)**

```java
var string = "12345";
var builder = new StringBuilder("12345");
```

* A. `builder.charAt(4)`
* B. `builder.replace(2, 4, "6").charAt(3)`
* C. `builder.replace(2, 5, "6").charAt(2)`
* D. `string.charAt(5)`
* E. `string.length`
* F. `string.replace("123", "1").charAt(2)`
* G. Không có đáp án nào ở trên.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B, F**
* **Giải thích chuyên sâu:**
  * **A đúng:** Chỉ số bắt đầu từ 0. Với chuỗi `"12345"`, chỉ số 4 chính là ký tự `'5'`.
  * **B đúng:** `builder.replace(2, 4, "6")` thay thế các ký tự tại index 2 và 3 (`"34"`) bằng chuỗi `"6"`. Nội dung tạm thời trở thành `"1265"`. Khi gọi `charAt(3)` trên chuỗi này, ta thu được ký tự `'5'`.
  * **C sai:** `builder.replace(2, 5, "6")` thay thế index 2, 3, 4 (`"345"`) bằng `"6"`, chuỗi trở thành `"126"`. Gọi `charAt(2)` trả về ký tự `'6'`.
  * **D sai:** Độ dài chuỗi là 5 (chỉ số từ 0 đến 4). `string.charAt(5)` ném ngoại lệ `StringIndexOutOfBoundsException`.
  * **E sai:** `length` là phương thức `length()` của String, thiếu cặp dấu ngoặc tròn `()` nên không biên dịch được.
  * **F đúng:** `string.replace("123", "1")` thay thế `"123"` bằng `"1"`, kết quả trả về là `"145"`. Gọi `charAt(2)` trả về ký tự `'5'`.
</details>

---

### Câu 9 (Question 9)
**Các nhận định nào sau đây là ĐÚNG về mảng (arrays) trong Java? (Chọn tất cả các đáp án đúng)**

* A. Phần tử đầu tiên có chỉ số (index) là 0.
* B. Phần tử đầu tiên có chỉ số (index) là 1.
* C. Mảng có kích thước cố định (fixed size).
* D. Mảng là bất biến (immutable).
* E. Gọi `equals()` trên hai mảng khác nhau chứa cùng các giá trị nguyên thủy luôn trả về `true`.
* F. Gọi `equals()` trên hai mảng khác nhau chứa cùng các giá trị nguyên thủy luôn trả về `false`.
* G. Gọi `equals()` trên hai mảng khác nhau chứa cùng các giá trị nguyên thủy có thể trả về `true` hoặc `false`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C, F**
* **Giải thích chuyên sâu:**
  * **A đúng, B sai:** Mảng trong Java luôn được đánh chỉ số bắt đầu từ 0 (0-indexed).
  * **C đúng, D sai:** Mảng là đối tượng có kích thước cố định (*fixed size*) một khi đã được tạo ra trên Heap, nhưng **nội dung các phần tử bên trong mảng có thể thay đổi** (mutable), do đó mảng không phải là immutable.
  * **F đúng, E và G sai:** Lớp mảng trong Java **KHÔNG override phương thức `equals()`** từ `java.lang.Object`! Do đó, việc gọi `arr1.equals(arr2)` thực chất là so sánh tham chiếu (`==`). Hai đối tượng mảng riêng biệt trên Heap luôn có địa chỉ ô nhớ khác nhau, vì vậy luôn trả về `false`! Để so sánh nội dung mảng, phải dùng `Arrays.equals(arr1, arr2)`.
</details>

---

### Câu 10 (Question 10)
**Có bao nhiêu dòng trong đoạn code sau chứa lỗi biên dịch?**

```java
23: int one = Math.min(5, 3);
24: long two = Math.round(5.5);
25: double three = Math.floor(6.6);
26: var doubles = new double[] {one, two, three};
```

* A. `0`
* B. `1`
* C. `2`
* D. `3`
* E. `4`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A (0 dòng lỗi - Code biên dịch hoàn toàn thành công)**
* **Giải thích chuyên sâu:**
  * Dòng 23: `Math.min(5, 3)` nhận hai số `int` và trả về `int` (giá trị 3), gán vào `int one` hợp lệ.
  * Dòng 24: `Math.round(5.5)` nhận đối số `double` và trả về kiểu `long` (giá trị 6L), gán vào `long two` hoàn toàn chuẩn xác.
  * Dòng 25: `Math.floor(6.6)` nhận và trả về kiểu `double` (giá trị 6.0), gán vào `double three` hợp lệ.
  * Dòng 26: Mảng `double[]` có thể nhận các giá trị kiểu `int` (`one`) và `long` (`two`) nhờ cơ chế nới rộng kiểu ngầm định (*widening primitive conversion* sang `double`).
  * Tất cả các dòng đều hợp lệ, do đó có 0 dòng lỗi $\rightarrow$ Chọn A.
</details>

---

### Câu 11 (Question 11)
**Output của đoạn code sau là gì?**

```java
var date = LocalDate.of(2025, 4, 3);
date.plusDays(2);
date.plusHours(3);
System.out.println(date.getYear() + " " + date.getMonth()
    + " " + date.getDayOfMonth());
```

* A. `2025 MARCH 4`
* B. `2025 MARCH 6`
* C. `2025 APRIL 3`
* D. `2025 APRIL 5`
* E. Code không biên dịch được (The code does not compile).
* F. Ném ra ngoại lệ tại thời điểm runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (Code không biên dịch được)**
* **Giải thích chuyên sâu:**
  * Lớp `LocalDate` **chỉ đại diện cho ngày (năm, tháng, ngày) và hoàn toàn không chứa thông tin về thời gian (giờ, phút, giây)**.
  * Do đó, trong lớp `LocalDate` **không hề tồn tại phương thức `plusHours()`**!
  * Lệnh `date.plusHours(3)` sẽ khiến trình biên dịch báo lỗi ngay lập tức: `cannot find symbol: method plusHours(int)`.
</details>

---

### Câu 12 (Question 12)
**Các giá trị nào sau đây sẽ được in ra bởi đoạn code sau (bỏ qua ký tự xuống dòng)? (Chọn tất cả các đáp án đúng)**

```java
var numbers = "012345678".indent(1);
numbers = numbers.stripLeading();
System.out.println(numbers.substring(1, 3));
System.out.println(numbers.substring(7, 7));
System.out.println(numbers.substring(7));
```

* A. `12`
* B. `123`
* C. `7`
* D. `78`
* E. Một dòng trống (A blank line).
* F. Ném ra ngoại lệ.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, D, E**
* **Giải thích chuyên sâu:**
  * Lệnh `"012345678".indent(1)` thêm 1 dấu cách vào đầu dòng và thêm `
` ở cuối dòng.
  * Lệnh kế tiếp `numbers = numbers.stripLeading();` xóa dấu cách ở đầu dòng, đưa chuỗi về lại bắt đầu bằng `"012345678..."`.
  * `numbers.substring(1, 3)`: Cắt từ index 1 đến index 2 (dừng trước 3) $\rightarrow$ thu được `"12"` (A đúng).
  * `numbers.substring(7, 7)`: Chỉ số bắt đầu và kết thúc bằng nhau $\rightarrow$ trả về chuỗi rỗng `""`. Lệnh `println("")` sẽ in ra một dòng trống (E đúng).
  * `numbers.substring(7)`: Cắt từ index 7 đến hết chuỗi $\rightarrow$ thu được `"78"` (kèm theo ký tự ngắt dòng) (D đúng).
</details>

---

### Câu 13 (Question 13)
**Kết quả của đoạn code sau là gì?**

```java
public class Lion {
   public void roar(String roar1, StringBuilder roar2) {
      roar1.concat("!!!");
      roar2.append("!!!");
   }
   public static void main(String[] args) {
      var roar1 = "roar";
      var roar2 = new StringBuilder("roar");
      new Lion().roar(roar1, roar2);
      System.out.println(roar1 + " " + roar2);
} }
```

* A. `roar roar`
* B. `roar roar!!!`
* C. `roar!!! roar`
* D. `roar!!! roar!!!`
* E. Ném ra ngoại lệ.
* F. Code không biên dịch được.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B (`roar roar!!!`)**
* **Giải thích chuyên sâu:**
  * `String` là lớp **bất biến (Immutable)**. Gọi `roar1.concat("!!!")` tạo ra một đối tượng `String` mới mang giá trị `"roar!!!"`, nhưng kết quả này không được gán lại vào biến `roar1`. Do đó chuỗi ban đầu `roar1` vẫn giữ nguyên là `"roar"`.
  * `StringBuilder` là lớp **khả biến (Mutable)**. Gọi `roar2.append("!!!")` sẽ sửa đổi trực tiếp dữ liệu trên mảng ký tự của đối tượng đó trên Heap. Do đó biến `roar2` ở phương thức `main` sẽ nhìn thấy sự thay đổi thành `"roar!!!"`.
  * Kết quả in ra là `"roar roar!!!"`.
</details>

---

### Câu 14 (Question 14)
**Cho các biến sau, lựa chọn nào có thể điền vào hai chỗ trống để code biên dịch thành công? (Chọn tất cả các đáp án đúng)**

```java
var date = LocalDate.now();
var time = LocalTime.now();
var dateTime = date.______(time);
var zoneId = ZoneId.systemDefault();
var zonedDateTime = ZonedDateTime.of(dateTime, zoneId);
Instant instant = ___________________________;
```

* A. `asTime` cho chỗ trống thứ nhất.
* B. `atTime` cho chỗ trống thứ nhất.
* C. `withTime` cho chỗ trống thứ nhất.
* D. `dateTime.toInstant()` cho chỗ trống thứ hai.
* E. `new Instant()` cho chỗ trống thứ hai.
* F. `zonedDateTime.toInstant()` cho chỗ trống thứ hai.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, F**
* **Giải thích chuyên sâu:**
  * **Tại chỗ trống thứ nhất:** Lớp `LocalDate` cung cấp phương thức `date.atTime(time)` để kết hợp một `LocalDate` với một `LocalTime` thành một `LocalDateTime`. Không tồn tại phương thức `asTime()` hay `withTime()` trên `LocalDate`. Do đó B đúng.
  * **Tại chỗ trống thứ hai:**
    * **F đúng:** `zonedDateTime.toInstant()` là cách chuyển đổi chuẩn xác từ `ZonedDateTime` (đã có thông tin múi giờ) sang `Instant` (chuẩn UTC).
    * **D sai:** `LocalDateTime` không chứa thông tin múi giờ, do đó JVM không thể biết được thời điểm đó ứng với mấy giờ GMT, nên không thể gọi trực tiếp `dateTime.toInstant()`.
    * **E sai:** `Instant` có constructor `private`, không thể khởi tạo bằng `new Instant()`.
</details>

---

### Câu 15 (Question 15)
**Output của đoạn code sau là gì? (Chọn tất cả các đáp án đúng)**

```java
var arr = new String[] { "PIG", "pig", "123"};
Arrays.sort(arr);
System.out.println(Arrays.toString(arr));
System.out.println(Arrays.binarySearch(arr, "Pippa"));
```

* A. `[pig, PIG, 123]`
* B. `[PIG, pig, 123]`
* C. `[123, PIG, pig]`
* D. `[123, pig, PIG]`
* E. `-3`
* F. `-2`
* G. Kết quả của `binarySearch()` là không xác định.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, E**
* **Giải thích chuyên sâu:**
  * **Quy tắc sắp xếp "7Up":** Ký tự số xếp trước chữ cái, chữ in HOA xếp trước chữ thường.
    * `"123"` bắt đầu bằng chữ số $\rightarrow$ đứng đầu tiên (index 0).
    * `"PIG"` bắt đầu bằng chữ HOA `'P'` $\rightarrow$ đứng thứ hai (index 1).
    * `"pig"` bắt đầu bằng chữ thường `'p'` $\rightarrow$ đứng cuối cùng (index 2).
    * Mảng sau khi sort: `[123, PIG, pig]` $\rightarrow$ C đúng.
  * **Tìm kiếm nhị phân `Arrays.binarySearch(arr, "Pippa")`:**
    * So sánh từ điển: `"123"` $<$ `"PIG"` $<$ `"Pippa"` $<$ `"pig"` (vì ký tự thứ hai của `"Pippa"` là `'i'` [mã ASCII 105], lớn hơn ký tự thứ hai của `"PIG"` là `'I'` [mã ASCII 73]).
    * Như vậy, chuỗi `"Pippa"` nếu được chèn vào mảng để bảo toàn thứ tự sắp xếp thì nó phải đứng giữa `"PIG"` và `"pig"`, tức tại vị trí **chỉ số 2 (insertion point = 2)**.
    * Áp dụng công thức: $$	ext{Result} = -	ext{insertion\_point} - 1 = -2 - 1 = -3$$
    * Do đó trả về `-3` $\rightarrow$ E đúng.
</details>

---

### Câu 16 (Question 16)
**Các nhận định nào sau đây là ĐÚNG? (Chọn tất cả các đáp án đúng)**

```java
var letters = new StringBuilder("abcdefg");
```

* A. `letters.substring(1, 2)` trả về một `String` có độ dài 1 ký tự.
* B. `letters.substring(2, 2)` trả về một `String` có độ dài 1 ký tự.
* C. `letters.substring(6, 5)` trả về một `String` có độ dài 1 ký tự.
* D. `letters.substring(6, 6)` trả về một `String` có độ dài 1 ký tự.
* E. `letters.substring(1, 2)` ném ra ngoại lệ.
* F. `letters.substring(2, 2)` ném ra ngoại lệ.
* G. `letters.substring(6, 5)` ném ra ngoại lệ.
* H. `letters.substring(6, 6)` ném ra ngoại lệ.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, G**
* **Giải thích chuyên sâu:**
  * Phương thức `substring(start, end)` lấy chuỗi con từ `start` đến `end - 1`.
  * **A đúng, E sai:** `substring(1, 2)` lấy ký tự tại index 1 (`"b"`), trả về `String` có độ dài 1.
  * **B và F sai:** `substring(2, 2)` có chỉ số bắt đầu bằng chỉ số kết thúc, phương thức trả về chuỗi rỗng `""` (độ dài 0), không ném lỗi.
  * **G đúng, C sai:** Java không cho phép chỉ số kết thúc nhỏ hơn chỉ số bắt đầu (`end < start`). Lệnh `substring(6, 5)` ném ngay ngoại lệ `StringIndexOutOfBoundsException`.
  * **D và H sai:** `substring(6, 6)` trả về chuỗi rỗng `""`, không ném ngoại lệ vì index 6 nằm trong phạm vi hợp lệ (`<= length()`).
</details>

---

### Câu 17 (Question 17)
**Kết quả của đoạn code sau là gì? (Chọn tất cả các đáp án đúng)**

```java
13: String s1 = """
14:    purr""";
15: String s2 = "";
16: 
17: s1.toUpperCase();
18: s1.trim();
19: s1.substring(1, 3);
20: s1 += "two";
21: 
22: s2 += 2;
23: s2 += 'c';
24: s2 += false;
25: 
26: if ( s2 == "2cfalse") System.out.println("==");
27: if ( s2.equals("2cfalse")) System.out.println("equals");
28: System.out.println(s1.length());
```

* A. `2`
* B. `4`
* C. `7`
* D. `10`
* E. `==`
* F. `equals`
* G. Ném ra ngoại lệ.
* H. Code không biên dịch được.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, F**
* **Giải thích chuyên sâu:**
  * **Xử lý `s1`:**
    * Dòng 13–14: Text block `s1` chứa 4 ký tự `"purr"` (không có dấu xuống dòng ở cuối).
    * Dòng 17, 18, 19: Các lời gọi `toUpperCase()`, `trim()`, `substring(1, 3)` đều trả về `String` mới nhưng **không được gán lại vào `s1`**, do đó `s1` vẫn là `"purr"`.
    * Dòng 20: `s1 += "two"` nối thêm 3 ký tự `"two"`, biến `s1` trở thành `"purrtwo"` có độ dài bằng **7** $\rightarrow$ Dòng 28 in ra **`7`** (C đúng).
  * **Xử lý `s2`:**
    * Dòng 22–24: `s2 += 2` $\rightarrow$ `"2"`; `s2 += 'c'` $\rightarrow$ `"2c"`; `s2 += false` $\rightarrow$ `"2cfalse"`.
    * Dòng 26: `s2 == "2cfalse"` so sánh tham chiếu. Vì `s2` được tạo từ các phép nối chuỗi runtime nên nó là một đối tượng mới trên Heap, không cùng tham chiếu với literal `"2cfalse"` trong String Pool $\rightarrow$ điều kiện `false`, không in ra `==` (E sai).
    * Dòng 27: `s2.equals("2cfalse")` so sánh nội dung ký tự $\rightarrow$ trả về `true` $\rightarrow$ in ra **`equals`** (F đúng).
</details>

---

### Câu 18 (Question 18)
**Lệnh nào sau đây điền vào chỗ trống sẽ in ra một số nguyên DƯƠNG? (Chọn tất cả các đáp án đúng)**

```java
String[] s1 = { "Camel", "Peacock", "Llama"};
String[] s2 = { "Camel", "Llama", "Peacock"};
String[] s3 = { "Camel"};
String[] s4 = { "Camel", null};
System.out.println(Arrays.____________________________);
```

* A. `compare(s1, s2)`
* B. `mismatch(s1, s2)`
* C. `compare(s3, s4)`
* D. `mismatch(s3, s4)`
* E. `compare(s4, s4)`
* F. `mismatch(s4, s4)`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B, D**
* **Giải thích chuyên sâu:**
  * **A đúng:** `Arrays.compare(s1, s2)` so sánh từng phần tử. Tại index 0 cả hai đều là `"Camel"`. Tại index 1, `"Peacock"` so với `"Llama"`: chữ `'P'` đứng sau chữ `'L'` trong bảng chữ cái $\rightarrow$ `"Peacock"` lớn hơn `"Llama"` $\rightarrow$ mảng `s1` lớn hơn `s2`, trả về **số nguyên dương**.
  * **B đúng:** `Arrays.mismatch(s1, s2)` tìm vị trí khác biệt đầu tiên. Index 0 giống nhau, index 1 khác nhau (`"Peacock"` vs `"Llama"`) $\rightarrow$ trả về chỉ số **`1`** (là một số nguyên dương).
  * **C sai:** `s3` có độ dài 1, là tiền tố của `s4` (độ dài 2) $\rightarrow$ `s3` nhỏ hơn `s4`, phương thức trả về **số âm**.
  * **D đúng:** `Arrays.mismatch(s3, s4)` khác biệt tại index 1 (vì `s3` không có phần tử tại index 1 còn `s4` có giá trị `null`) $\rightarrow$ trả về **`1`** (số nguyên dương).
  * **E sai:** So sánh hai mảng giống hệt nhau trả về **`0`**.
  * **F sai:** Hai mảng giống hệt nhau không có vị trí sai khác, `mismatch()` trả về **`-1`** (số âm).
</details>

---

### Câu 19 (Question 19)
**Biết rằng ngày 12 tháng 3 năm 2028 là cuối tuần đổi giờ mùa xuân (*clocks spring ahead*) cho giờ mùa hè (DST). Output của đoạn code sau là gì? (Chọn tất cả các đáp án đúng)**

```java
var date = LocalDate.of(2028, Month.MARCH, 12);
var time = LocalTime.of(1, 30);
var zone = ZoneId.of("US/Eastern");
var dateTime1 = ZonedDateTime.of(date, time, zone);
var dateTime2 = dateTime1.plus(1, ChronoUnit.HOURS);

long diff = ChronoUnit.HOURS.between(dateTime1, dateTime2);
int hour = dateTime2.getHour();
boolean offset = dateTime1.getOffset() == dateTime2.getOffset();
System.out.println("diff = " + diff);
System.out.println("hour = " + hour);
System.out.println("offset = " + offset);
```

* A. `diff = 1`
* B. `diff = 2`
* C. `hour = 2`
* D. `hour = 3`
* E. `offset = true`
* F. Code không biên dịch được.
* G. Ném ra ngoại lệ tại thời điểm runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, D**
* **Giải thích chuyên sâu:**
  * Ban đầu `dateTime1` có thời gian là `01:30` múi giờ `US/Eastern` (offset là `-05:00`).
  * Thực hiện cộng thêm 1 giờ vật lý: `dateTime2 = dateTime1.plus(1, ChronoUnit.HOURS)`.
  * Khoảng cách thời gian thực tế giữa hai thời điểm là đúng 1 giờ: `diff = 1` (A đúng, B sai).
  * Tuy nhiên, vì ngày 12/3/2028 là ngày đổi giờ mùa xuân, đồng hồ lúc 2:00 AM sẽ nhảy vọt lên 3:00 AM (khoảng 2:00 AM - 2:59 AM không tồn tại). Vì vậy, 1 giờ sau 1:30 AM sẽ hiển thị trên mặt đồng hồ là **3:30 AM** $\rightarrow$ `dateTime2.getHour()` trả về **`3`** (D đúng, C sai).
  * Đồng thời, múi giờ chuyển từ giờ mùa đông (`-05:00`) sang giờ mùa hè (`-04:00`), do đó hai offset khác nhau $\rightarrow$ `offset = false` (E sai).
</details>

---

### Câu 20 (Question 20)
**Lựa chọn nào sau đây có thể điền vào dòng 4 để in ra `avaJ`? (Chọn tất cả các đáp án đúng)**

```java
3: var puzzle = new StringBuilder("Java");
4: puzzle._________________________;
5: System.out.println(puzzle);
```

* A. `reverse()`
* B. `append("vaJ$").substring(0, 4)`
* C. `append("vaJ$").delete(0, 3).deleteCharAt(puzzle.length() - 1)`
* D. `append("vaJ$").delete(0, 3).deleteCharAt(puzzle.length())`
* E. Không có đáp án nào ở trên.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C**
* **Giải thích chuyên sâu:**
  * **A đúng:** Phương thức `puzzle.reverse()` đảo ngược chuỗi trực tiếp tại chỗ từ `"Java"` thành `"avaJ"`.
  * **B sai:** `substring(0, 4)` trả về một đối tượng `String` mới và **hoàn toàn không làm thay đổi** `StringBuilder`. Do đó `puzzle` sẽ mang giá trị `"JavavaJ$"`.
  * **C đúng (Từng bước phân tích):**
    1. `puzzle.append("vaJ$")` $\rightarrow$ biến `puzzle` thành `"JavavaJ$"`.
    2. `.delete(0, 3)` $\rightarrow$ xóa index 0, 1, 2 (`"Jav"`), chuỗi còn lại `"avaJ$"`.
    3. `.deleteCharAt(puzzle.length() - 1)` $\rightarrow$ xóa ký tự cuối cùng (`'$'`), chuỗi còn lại `"avaJ"`.
  * **D sai:** `deleteCharAt(puzzle.length())` cố gắng xóa ký tự tại vị trí bằng với độ dài chuỗi, vượt quá chỉ số tối đa hợp lệ (`length() - 1`), ném `StringIndexOutOfBoundsException`.
</details>

---

### Câu 21 (Question 21)
**Output của đoạn code sau là gì?**

```java
var date = LocalDate.of(2025, Month.APRIL, 30);
date.plusDays(2);
date.plusYears(3);
System.out.println(date.getYear() + " " + date.getMonth() 
   + " " + date.getDayOfMonth());
```

* A. `2025 APRIL 30`
* B. `2025 MAY 2`
* C. `2028 APRIL 2`
* D. `2028 APRIL 30`
* E. `2028 MAY 2`
* F. Code không biên dịch được.
* G. Ném ra ngoại lệ tại thời điểm runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A (`2025 APRIL 30`)**
* **Giải thích chuyên sâu:**
  * Tất cả các lớp trong gói `java.time` (bao gồm `LocalDate`) đều là **các lớp bất biến (Immutable)**.
  * Các phương thức `date.plusDays(2)` và `date.plusYears(3)` tính toán và trả về đối tượng `LocalDate` mới, nhưng **không hề được gán lại vào biến `date`**.
  * Đối tượng `date` ban đầu hoàn toàn giữ nguyên giá trị: Năm 2025, tháng APRIL, ngày 30.
</details>

---

### Câu 22 (Question 22)
**Output của đoạn code sau là gì?**

```java
var result = LocalDate.of(2025, Month.OCTOBER, 31)
   .plusYears(1)
   .plusMonths(-5)
   .plusMonths(1)
   .withYear(2026)
   .atTime(LocalTime.of(13, 4));
System.out.println(result);
```

* A. `2025-06-30T13:04`
* B. `2026-04-304`
* C. `2026-04-30T13:04`
* D. `2026-06-30T`
* E. `2026-06-30T13:04`
* F. Code không biên dịch được.
* G. Ném ra ngoại lệ tại thời điểm runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (`2026-06-30T13:04`)**
* **Giải thích chuyên sâu (Từng bước tính toán chuỗi phương thức):**
  1. `LocalDate.of(2025, Month.OCTOBER, 31)`: Khởi tạo ngày `2025-10-31`.
  2. `.plusYears(1)`: Cộng 1 năm $\rightarrow$ `2026-10-31`.
  3. `.plusMonths(-5)`: Trừ 5 tháng (tháng 10 trừ 5 là tháng 5 - May) $\rightarrow$ `2026-05-31`.
  4. `.plusMonths(1)`: Cộng 1 tháng (từ tháng 5 sang tháng 6 - June). **Lưu ý bẫy ngày cuối tháng:** Tháng 6 chỉ có 30 ngày, Java tự động điều chỉnh ngày 31 thành ngày cuối cùng hợp lệ của tháng 6 là ngày 30 $\rightarrow$ `2026-06-30`.
  5. `.withYear(2026)`: Thiết lập lại năm là 2026 (vốn đã là 2026) $\rightarrow$ giữ nguyên `2026-06-30`.
  6. `.atTime(LocalTime.of(13, 4))`: Kết hợp với giờ `13:04` tạo thành `LocalDateTime` $\rightarrow$ `2026-06-30T13:04`.
  7. In ra màn hình: `2026-06-30T13:04`.
</details>
