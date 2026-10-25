# Review Questions (Bộ Câu Hỏi Ôn Tập Tiếng Anh) - Chapter 11: Exceptions and Localization

> **Source (Nguồn trích dẫn):** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Pages 991–1007).  
> **Total Questions (Số lượng):** 26 original Oracle exam-style multiple-choice questions with official English & detailed Vietnamese explanations (Pages 1391–1397).  
> **How to study (Cách học):** Read the English question prompt and options carefully to familiarize yourself with the real exam terminology, then click **"👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)"** to review both the official book explanation and the in-depth Vietnamese breakdown.

---

### Question 1 (Câu 1)
**Which of the following can be inserted on line 8 to make this code compile? (Choose all that apply.)**

```java
7: public void whatHappensNext() throws IOException {
8:    // INSERT CODE HERE
9: }
```

* A. `System.out.println("it's ok");`
* B. `throw new Exception();`
* C. `throw new IllegalArgumentException();`
* D. `throw new java.io.IOException();`
* E. `throw new RuntimeException();`
* F. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, C, D, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** A method that declares an exception isn't required to throw one, making option A correct. Unchecked exceptions can be thrown in any method, making options C and E correct. Option D matches the exception type declared, so it's also correct. Option B is incorrect because a broader exception is not allowed.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Phương thức khai báo `throws IOException` trên chữ ký:
      * **Xét A:** Một phương thức khai báo ngoại lệ bằng `throws` **không bắt buộc** phải thực sự ném ra ngoại lệ đó. Việc thân hàm chỉ in ra chuỗi và kết thúc bình thường là hoàn toàn hợp lệ → **A đúng**.
      * **Xét B:** `Exception` là lớp cha (rộng hơn) của `IOException`. Bạn không thể ném một checked exception rộng hơn loại đã khai báo trên chữ ký hàm nếu không xử lý nó → **B sai (Lỗi biên dịch)**.
      * **Xét C & E:** `IllegalArgumentException` và `RuntimeException` là các **Unchecked Exceptions**. Một phương thức có thể ném bất kỳ unchecked exception nào vào bất cứ lúc nào mà không cần khai báo → **C và E đúng**.
      * **Xét D:** Khớp chính xác với kiểu checked exception `IOException` đã được khai báo trên chữ ký → **D đúng**.
    * **Bẫy thi cần nhớ:** Khai báo `throws` không bắt buộc phải ném; Unchecked exceptions có thể ném tự do ở bất kỳ đâu; Checked exception ném ra phải cùng kiểu hoặc là lớp con của kiểu đã khai báo.
</details>

---

### Question 2 (Câu 2)
**Which statement about the following class is correct?**

```java
1:  class Problem extends Exception {
2:     public Problem() {}
3:  }
4:  class YesProblem extends Problem {}
5:  public class MyDatabase {
6:     public static void connectToDatabase() throw Problem {
7:        throws new YesProblem();
8:     }
9:     public static void main(String[] c) throw Exception {
10:       connectToDatabase();
11:    }
12: }
```

* A. The code compiles and prints a stack trace for `YesProblem` at runtime.
* B. The code compiles and prints a stack trace for `Problem` at runtime.
* C. The code does not compile because `Problem` defines a constructor.
* D. The code does not compile because `YesProblem` does not define a constructor.
* E. The code does not compile but would if `Problem` and `YesProblem` were switched on lines 6 and 7.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F (None of the above)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code does not compile because the `throw` and `throws` keywords are incorrectly used on lines 6, 7, and 9. If the keywords were fixed, the rest of the code would compile and print a stack trace with `YesProblem` at runtime. For this reason, option F is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Hãy quan sát kỹ các từ khoá:
      * Dòng 6: `public static void connectToDatabase() throw Problem` → Sử dụng sai từ khoá! Trên chữ ký hàm phải dùng **`throws`** (có 's'), ở đây lại dùng `throw`.
      * Dòng 7: `throws new YesProblem();` → Sử dụng sai từ khoá! Khi thực hiện hành động ném ngoại lệ trong thân hàm phải dùng **`throw`** (không có 's'), ở đây lại dùng `throws`.
      * Dòng 9: `public static void main(String[] c) throw Exception` → Tiếp tục dùng sai `throw` thay vì `throws`.
    * Vì cả ba dòng 6, 7, và 9 đều bị lỗi cú pháp từ khoá, chương trình **không biên dịch được**.
    * Lựa chọn E sai vì việc hoán đổi tên lớp không khắc phục được lỗi sai từ khoá cú pháp (`throw` vs `throws`).
    * Do đó, đáp án đúng là **F**.
    * **Bẫy thi cần nhớ:** `throws` đi kèm chữ ký phương thức; `throw` dùng để ném đối tượng exception trong thân hàm. Đề thi OCP rất hay đánh đố sự nhầm lẫn giữa hai từ khoá này.
</details>

---

### Question 3 (Câu 3)
**Which of the following are common types to localize? (Choose all that apply.)**

* A. Dates
* B. Lambda expressions
* C. Class names
* D. Currency
* E. Numbers
* F. Variable names

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, D, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Localization refers to user-facing elements. Dates, currency, and numbers are commonly used in different formats for different countries, making options A, D, and E correct. Class and variable names, along with lambda expressions, are internal to the application, so there is no need to translate them for users.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Bản địa hoá (Localization - l10n) nhằm mục đích phục vụ **người dùng cuối (user-facing)**:
      * **Ngày tháng (Dates):** Mỗi quốc gia hiển thị thứ tự ngày/tháng/năm khác nhau (ví dụ Mỹ dùng `MM/dd/yyyy`, Việt Nam dùng `dd/MM/yyyy`).
      * **Tiền tệ (Currency):** Ký hiệu và vị trí đặt ký hiệu tiền tệ khác nhau (`$100` vs `100 €` vs `100 đ`).
      * **Con số (Numbers):** Dấu phân cách thập phân và hàng nghìn khác nhau (`1,234.56` ở Mỹ vs `1.234,56` ở Đức/Việt Nam).
    * Tên lớp, tên biến và biểu thức Lambda là cấu trúc mã nguồn nội bộ của lập trình viên, không hiển thị cho người dùng và không bao giờ được bản địa hoá.
    * **Bẫy thi cần nhớ:** Localization chỉ áp dụng cho dữ liệu giao diện người dùng: Ngày giờ, Số, Tiền tệ, và Chuỗi văn bản dịch thuật (`ResourceBundle`).
</details>

---

### Question 4 (Câu 4)
**What is the output of the following snippet, assuming `a` and `b` are both `0`?**

```java
3:  try {
4:     System.out.print(a / b);
5:  } catch (RuntimeException e) {
6:     System.out.print(-1);
7:  } catch (ArithmeticException e) {
8:     System.out.print(0);
9:  } finally {
10:    System.out.print("done");
11: }
```

* A. `-1`
* B. `0`
* C. `done-1`
* D. `done0`
* E. The code does not compile.
* F. An uncaught exception is thrown.
* G. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E (The code does not compile)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The order of `catch` blocks is important because they're checked in the order they appear after the `try` block. Because `ArithmeticException` is a child class of `RuntimeException`, the `catch` block on line 7 is unreachable (if an `ArithmeticException` is thrown in the `try` block, it will be caught on line 5). Line 7 generates a compiler error because it is unreachable code, making option E correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Trong cây kế thừa ngoại lệ: `ArithmeticException` là lớp con trực tiếp của `RuntimeException`.
    * Khi bắt ngoại lệ, Java yêu cầu các khối `catch` phải được sắp xếp theo thứ tự **từ lớp con (hẹp) đến lớp cha (rộng)**.
    * Ở đoạn mã trên, dòng 5 bắt lớp cha `RuntimeException` TRƯỚC, sau đó dòng 7 mới bắt lớp con `ArithmeticException`.
    * Bất kỳ ngoại lệ `ArithmeticException` nào xảy ra đều đã bị dòng 5 tóm gọn, khiến cho khối `catch (ArithmeticException e)` ở dòng 7 trở thành **mã không bao giờ chạm tới (unreachable code)**.
    * Trình biên dịch Java không chấp nhận unreachable code và báo **LỖI BIÊN DỊCH tại dòng 7** → Đáp án **E**.
    * **Bẫy thi cần nhớ:** Bắt lớp cha trước lớp con luôn gây lỗi biên dịch *unreachable catch block*.
</details>

---

### Question 5 (Câu 5)
**Assuming the current locale uses dollars ($) and the following method is called with a `double` value of `100_102.2`, which of the following values are printed? (Choose all that apply.)**

```java
public void print(double t) {
   System.out.print(NumberFormat.getCompactNumberInstance().format(t));
 
   System.out.print(
      NumberFormat.getCompactNumberInstance(
         Locale.getDefault(), Style.SHORT).format(t));
 
   System.out.print(NumberFormat.getCurrencyInstance().format(t));
}
```

* A. `100`
* B. `$100,000.00`
* C. `100K`
* D. `100 thousand`
* E. `100M`
* F. `$100,102.20`
* G. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles and runs without issue. When a `CompactNumberFormat` instance is requested without a style, it uses the `SHORT` style by default. This results in both of the first two statements printing `100K`, making option C correct. If the `LONG` style were used, then `100 thousand` would be printed. Option F is also correct, as the full value is printed with a currency formatter.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Giá trị đầu vào: `t = 100_102.2`.
    * **Lệnh 1:** `NumberFormat.getCompactNumberInstance().format(t)`  
      Khi không chỉ định tham số Style, `CompactNumberFormat` mặc định sử dụng kiểu thu gọn **`Style.SHORT`**. Với số khoảng 100 nghìn, nó rút gọn thành chuỗi **`100K`** → **Chọn C**.
    * **Lệnh 2:** Chỉ định tường minh `Style.SHORT` và locale mặc định → Tiếp tục in ra **`100K`** (giống hệt lệnh 1).
    * *(Ghi chú: Nếu dùng `Style.LONG`, nó mới in ra `100 thousand`)*.
    * **Lệnh 3:** `NumberFormat.getCurrencyInstance().format(t)`  
      Định dạng tiền tệ theo locale hiện tại (dùng đồng đô-la $). Định dạng tiền tệ hiển thị đầy đủ các chữ số và làm tròn đến 2 chữ số thập phân → in ra **`$100,102.20`** → **Chọn F**.
    * **Bẫy thi cần nhớ:** `getCompactNumberInstance()` mặc định là `Style.SHORT` (ví dụ `100K`, `7M`). Định dạng tiền tệ `getCurrencyInstance()` không thu gọn số mà hiển thị đầy đủ kèm 2 chữ số thập phân.
</details>

---

### Question 6 (Câu 6)
**What is the output of the following code?**

```java
LocalDate date = LocalDate.parse("2025-04-30", 
   DateTimeFormatter.ISO_LOCAL_DATE_TIME);
System.out.println(date.getYear() + " " 
   + date.getMonth() + " "+ date.getDayOfMonth());
```

* A. `2025 APRIL 2`
* B. `2025 APRIL 30`
* C. `2025 MAY 2`
* D. The code does not compile.
* E. A runtime exception is thrown.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E (A runtime exception is thrown)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** A `LocalDate` does not have a time element. Therefore, a date/time formatter is not appropriate. The code compiles but throws an exception at runtime, making option E correct. If `ISO_LOCAL_DATE` were used, the code would print `2025 APRIL 30`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Hãy nhìn vào đối tượng được parse: `LocalDate date = LocalDate.parse(...)`.
    * Chuỗi đầu vào `"2025-04-30"` chỉ chứa thông tin ngày tháng, hoàn toàn không có thành phần giờ/phút/giây.
    * Nhưng formatter được truyền vào lại là **`DateTimeFormatter.ISO_LOCAL_DATE_TIME`** (formatter này yêu cầu chuỗi phải có cả ngày VÀ giờ, ví dụ `"2025-04-30T10:15:30"`).
    * Khi chạy, phương thức parse không thể tìm thấy thành phần thời gian (time component) để khớp với `ISO_LOCAL_DATE_TIME`, dẫn đến **`java.time.format.DateTimeParseException`** (một `RuntimeException`) được ném ra!
    * Vì vậy, chương trình bị dừng do ngoại lệ tại thời điểm chạy → Đáp án **E**.
    * *(Lưu ý: Nếu dùng đúng `DateTimeFormatter.ISO_LOCAL_DATE`, kết quả sẽ in ra `2025 APRIL 30`)*.
    * **Bẫy thi cần nhớ:** `LocalDate` chỉ tương thích với các formatter ngày (Date formatters). Sử dụng Date-Time formatter cho chuỗi chỉ có ngày sẽ ném `DateTimeParseException`.
</details>

---

### Question 7 (Câu 7)
**What does the following method print?**

```java
11: public void tryAgain(String s) {
12:    try (FileReader r = null, p = new FileReader("")) {
13:       System.out.print("X");
14:       throw new IllegalArgumentException();
15:    } catch (Exception s) {
16:       System.out.print("A");
17:       throw new FileNotFoundException();
18:    } finally {
19:       System.out.print("O");
20:    }
21: }
```

* A. `XAO`
* B. `XOA`
* C. One line of this method contains a compiler error.
* D. Two lines of this method contain compiler errors.
* E. Three or more lines of this method contain compiler errors.
* F. The code compiles, but a `NullPointerException` is thrown at runtime.
* G. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E (Three or more lines)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The first compiler error is on line 12 because each resource in a try-with-resources statement must have its own data type and be separated by a semicolon (`;`). Line 15 does not compile because the variable `s` is already declared in the method. Line 17 also does not compile. The `FileNotFoundException`, which inherits from `IOException` and `Exception`, is a checked exception, so it must be handled or declared by the method. Because these three lines of code do not compile, option E is the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Lỗi 1 (Dòng 12):** Trong câu lệnh `try-with-resources`, mỗi biến tài nguyên bắt buộc phải có khai báo kiểu dữ liệu riêng biệt và phải được **phân cách bằng dấu chấm phẩy (`;`)**, chứ không được dùng dấu phẩy (`,`) như khai báo biến mảng thông thường:
      * `try (FileReader r = null, p = new FileReader(""))` → **LỖI BIÊN DỊCH DÒNG 12**!
    * **Lỗi 2 (Dòng 15):** Tham số của phương thức đã khai báo biến `String s`. Trong khối catch lại khai báo tiếp `catch (Exception s)`. Điều này vi phạm quy tắc trùng tên biến trong cùng phạm vi (duplicate local variable `s`) → **LỖI BIÊN DỊCH DÒNG 15**!
    * **Lỗi 3 (Dòng 17):** Dòng 17 ném `throw new FileNotFoundException()`. Đây là một **Checked Exception**. Phương thức `tryAgain()` không khai báo `throws FileNotFoundException` và cũng không có khối `try-catch` nào bao bọc để xử lý nó → Vi phạm quy tắc Handle or Declare → **LỖI BIÊN DỊCH DÒNG 17**!
    * Có tổng cộng ít nhất 3 dòng bị lỗi biên dịch → Đáp án đúng là **E**.
    * **Bẫy thi cần nhớ:** Tài nguyên trong `try-with-resources` ngăn cách bằng dấu `;`; biến trong `catch` không được trùng tên tham số phương thức; ném Checked Exception bắt buộc phải khai báo `throws`.
</details>

---

### Question 8 (Câu 8)
**Assume that all of the files mentioned in the answer choices exist and define the same keys. Which one will be used to find the key in line 8?**

```java
6: Locale.setDefault(Locale.of("en", "US"));
7: var b = ResourceBundle.getBundle("Dolphins");
8: System.out.println(b.getString("name"));
```

* A. `Dolphins.properties`
* B. `Dolphins_US.properties`
* C. `Dolphins_en.properties`
* D. `Whales.properties`
* E. `Whales_en_US.properties`
* F. The code does not compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C (Dolphins_en.properties)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Java will first look for the most specific matches it can find, starting with `Dolphins_en_US.properties`. Since that is not an answer choice, it drops the country and looks for `Dolphins_en.properties`, making option C correct. Option B is incorrect because a country without a language is not a valid locale.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 7 gọi `ResourceBundle.getBundle("Dolphins")` không truyền tham số Locale, do đó Java sẽ sử dụng **Locale mặc định của hệ thống** đã được thiết lập ở dòng 6 là: `en_US` (`language = en`, `country = US`).
    * Thứ tự tìm kiếm file của Java cho locale `en_US` với BaseName `"Dolphins"`:
      1. Khớp cả ngôn ngữ và quốc gia: `Dolphins_en_US.properties` (Không có trong danh sách đáp án).
      2. Bỏ quốc gia, khớp ngôn ngữ: **`Dolphins_en.properties`** → Có trong lựa chọn **C**!
      3. File gốc mặc định: `Dolphins.properties` (Chỉ dùng khi không tìm thấy file có mã ngôn ngữ).
    * Lựa chọn B (`Dolphins_US.properties`) là một file không hợp lệ về mặt quy chuẩn Locale (Java không bao giờ tìm kiếm file chỉ có quốc gia mà thiếu ngôn ngữ).
    * Do đó, file được ưu tiên sử dụng là `Dolphins_en.properties` → Đáp án **C**.
    * **Bẫy thi cần nhớ:** Thứ tự tìm kiếm Locale luôn là: `Language + Country` → `Language` → `BaseName`. Không bao giờ có bước tìm kiếm chỉ theo `Country`.
</details>

---

### Question 9 (Câu 9)
**For what value of `pattern` will the following print `<005.21> <008.49> <1,234.0>`?**

```java
String pattern = "____________________";
var message = DoubleStream.of(5.21, 8.49, 1234)
   .mapToObj(v -> new DecimalFormat(pattern).format(v))
   .collect(Collectors.joining("> <"));
System.out.println("<" + message + ">");
```

* A. `##.#`
* B. `0,000.0#`
* C. `#,###.0`
* D. `#,###,000.0#`
* E. The code does not compile regardless of what is placed in the blank.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D (#,###,000.0#)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** When working with a custom number formatter, the `0` symbol displays the digit as `0`, even if it's not present, while the `#` symbol omits the digit from the start or end of the `String` if it is not present. Based on the requested output, a format that displays at least three digits before the decimal (including a comma) and at least one after the decimal is required. It should display a second digit after the decimal if one is available. For this reason, option D is the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Quan sát kết quả đầu ra mong muốn:
      * `5.21` → `005.21` (Phần nguyên có ít nhất 3 chữ số với các số 0 đứng trước, phần thập phân có 2 chữ số).
      * `8.49` → `008.49` (Tương tự, có tiền tố `00`).
      * `1234` → `1,234.0` (Phần nguyên có dấu phẩy phân cách nhóm hàng nghìn; phần thập phân có ít nhất 1 chữ số 0).
    * **Phân tích các ký hiệu của `DecimalFormat`:**
      * Ký hiệu `0`: Bắt buộc hiển thị chữ số (nếu thiếu số thì bù số 0).
      * Ký hiệu `#`: Tuỳ chọn (chỉ hiển thị nếu có giá trị khác 0).
    * Để phần nguyên luôn hiển thị ít nhất 3 chữ số, ta cần **`000`** trước dấu chấm thập phân.
    * Để hiển thị dấu phân cách hàng nghìn khi số lớn hơn 999, ta thêm **`#,###,`** ở phía trước.
    * Ở phần thập phân: `1234` in ra `.0` (ít nhất 1 chữ số), nhưng `5.21` in ra `.21` (tối đa 2 chữ số) → Cần mẫu **`.0#`** (1 số 0 bắt buộc, 1 số # tuỳ chọn).
    * Ghép lại, mẫu chính xác là: **`#,###,000.0#`** → Đáp án **D**.
    * **Bẫy thi cần nhớ:** Ký hiệu `0` bắt buộc hiển thị; ký hiệu `#` bỏ qua các số 0 vô nghĩa ở đầu/cuối.
</details>

---

### Question 10 (Câu 10)
**Which scenario is the best use of an exception?**

* A. An element is not found when searching a list.
* B. An unexpected parameter is passed into a method.
* C. The computer caught fire.
* D. You want to loop through a list.
* E. You don't know how to code a method.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** An `IllegalArgumentException` is used when an unexpected parameter is passed into a method, making option B correct. Option A is incorrect because returning `null` or `-1` is a common return value for searching for data. Option D is incorrect because a `for` loop is typically used for this scenario. Option E is incorrect because you should find out how to code the method and not leave it for the unsuspecting programmer who calls your method. Option C is incorrect because you should run!
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A sai:** Khi tìm kiếm không thấy phần tử, trả về `null`, `-1` hoặc `Optional.empty()` là thiết kế chuẩn, không nên lạm dụng ném ngoại lệ làm ảnh hưởng luồng chương trình.
    * **B đúng:** Khi caller truyền tham số không hợp lệ (ví dụ: số lượng âm, chuỗi null), việc ném ngoại lệ (như `IllegalArgumentException`) là chuẩn mực thiết kế trong Java để bảo vệ tính toàn vẹn của ứng dụng.
    * **C sai:** Máy tính cháy thì phải chạy thoát thân, không phần mềm nào xử lý được!
    * **D sai:** Duyệt danh sách phải dùng vòng lặp `for-each` hoặc Stream, không dùng ngoại lệ để điều khiển luồng lặp.
    * **E sai:** Chưa biết code thì phải tìm hiểu cách code, không được để code ném lỗi cho người gọi gánh chịu.
    * **Bẫy thi cần nhớ:** Ngoại lệ chỉ dùng cho các điều kiện bất thường; không dùng ngoại lệ để kiểm soát luồng điều khiển thông thường.
</details>

---

### Question 11 (Câu 11)
**Which of the following exceptions must be handled or declared in the method in which they are thrown? (Choose all that apply.)**

```java
class Apple extends RuntimeException {}
class Orange extends Exception {}
class Banana extends Error {}
class Pear extends Apple {}
class Tomato extends Orange {}
class Peach extends Throwable {}
```

* A. `Apple`
* B. `Orange`
* C. `Banana`
* D. `Pear`
* E. `Tomato`
* F. `Peach`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, E, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** An exception that must be handled or declared is a checked exception. A checked exception inherits `Exception` but not `RuntimeException`. The entire hierarchy counts, so options B and E are both correct. Option F is also correct, as a class that inherits `Throwable` but not `RuntimeException` or `Error` is also checked.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Ngoại lệ bắt buộc phải xử lý hoặc khai báo (*Handle or Declare*) chính là **Checked Exception**.
    * **Định nghĩa Checked Exception:** Bất kỳ lớp nào kế thừa từ `Throwable` (hoặc `Exception`) mà **KHÔNG kế thừa từ `RuntimeException` hoặc `Error`**.
    * Phân tích từng lớp:
      * `Apple`: Kế thừa `RuntimeException` → Unchecked.
      * `Orange`: Kế thừa trực tiếp `Exception` → **Checked Exception** → **Chọn B**.
      * `Banana`: Kế thừa `Error` → Unchecked Error.
      * `Pear`: Kế thừa `Apple` (là con của `RuntimeException`) → Unchecked.
      * `Tomato`: Kế thừa `Orange` (là con của `Exception`) → **Checked Exception** → **Chọn E**.
      * `Peach`: Kế thừa trực tiếp `Throwable`. Vì nó không phải là `Error` và cũng không phải là `RuntimeException`, theo đặc tả Java, nó được đối xử như một **Checked Exception** → **Chọn F**.
    * **Bẫy thi cần nhớ:** Bất kỳ lớp nào kế thừa trực tiếp từ `Throwable` đều là Checked Exception!
</details>

---

### Question 12 (Câu 12)
**Which of the following changes, when made independently, would make this code compile? (Choose all that apply.)**

```java
1:  import java.io.*; 
2:  public class StuckTurkeyCage implements AutoCloseable {
3:     public void close() throws IOException {
4:        throw new FileNotFoundException("Cage not closed");
5:     }
6:     public static void main(String[] args) {
7:        try (StuckTurkeyCage t = new StuckTurkeyCage()) {
8:           System.out.println("put turkeys in");
9:        }
10:    } }
```

* A. Remove `throws IOException` from the declaration on line 3.
* B. Add `throws Exception` to the declaration on line 6.
* C. Change line 9 to `} catch (Exception e) {}`.
* D. Change line 9 to `} finally {}`.
* E. The code compiles as is.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code does not compile as is because the exception declared by the `close()` method must be handled or declared. Option A is incorrect because removing the exception from the declaration causes a compilation error on line 4, as `FileNotFoundException` is a checked exception that must be handled or declared. Option B is correct because the unhandled exception within the `main()` method becomes declared. Option C is also correct because the exception becomes handled. Option D is incorrect because the exception remains unhandled.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Phương thức `close()` của `StuckTurkeyCage` khai báo ném checked exception `IOException`.
    * Trong câu lệnh `try-with-resources` ở dòng 7, phương thức `close()` sẽ được ngầm định gọi khi khối `try` kết thúc.
    * Vì `close()` ném ra checked exception, phương thức `main` bao bọc nó bắt buộc phải tuân theo quy tắc **Handle or Declare**:
      1. Khai báo ném ngoại lệ trên `main`: Thêm `throws Exception` (hoặc `throws IOException`) vào dòng 6 → **B đúng**.
      2. Bắt ngoại lệ bằng khối `catch`: Thêm `catch (Exception e) {}` (hoặc `catch (IOException e) {}`) → **C đúng**.
    * Lựa chọn A sai vì dòng 4 ném `FileNotFoundException` (checked exception), nếu dòng 3 bỏ `throws IOException` thì chính dòng 4 sẽ bị lỗi biên dịch.
    * Lựa chọn D sai vì khối `finally` không bắt ngoại lệ, nên checked exception vẫn chưa được xử lý.
    * **Bẫy thi cần nhớ:** Ngoại lệ ném ra bởi phương thức `close()` trong `try-with-resources` cũng bắt buộc phải được Handle hoặc Declare như một lệnh gọi hàm bình thường!
</details>

---

### Question 13 (Câu 13)
**Which of the following are true statements about exception handling in Java? (Choose all that apply.)**

* A. A traditional `try` statement without a `catch` block requires a `finally` block.
* B. A traditional `try` statement without a `finally` block requires a `catch` block.
* C. A traditional `try` statement with only one statement can omit the `{}`.
* D. A `try`-with-resources statement without a `catch` block requires a `finally` block.
* E. A `try`-with-resources statement without a `finally` block requires a `catch` block.
* F. A `try`-with-resources statement with only one statement can omit the `{}`.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, B**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** A try-with-resources statement does not require a `catch` or `finally` block. A traditional `try` statement requires at least one of the two. Neither statement can be written without a body encased in braces, `{}`. For these reasons, options A and B are correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Với câu lệnh `try` truyền thống:** Bắt buộc phải có ít nhất một khối `catch` HOẶC một khối `finally`. Không thể đứng trơ trọi một mình → **A và B đúng**.
    * **Với `try-with-resources`:** Cả hai khối `catch` và `finally` đều là **tuỳ chọn**, không khối nào là bắt buộc (vì bản thân câu lệnh đã tự động gọi `close()`) → D và E sai.
    * **Về cặp dấu ngoặc nhọn `{}`:** Khác với `if`, `while`, `for`, các khối lệnh `try`, `catch`, `finally` **bắt buộc luôn luôn phải có cặp ngoặc nhọn `{}`**, dù bên trong chỉ có duy nhất 1 câu lệnh → C và F sai.
    * **Bẫy thi cần nhớ:** Khối `try` luôn luôn bắt buộc phải có ngoặc nhọn `{}`. `try-with-resources` không bắt buộc phải có cả `catch` lẫn `finally`.
</details>

---

### Question 14 (Câu 14)
**Assuming `-g:vars` is used when the code is compiled to include debug information, what is the output of the following code snippet?**

```java
var huey = (String)null;
Integer dewey = null;
Object louie = null;
if (louie == huey.substring(dewey.intValue())) {
   System.out.println("Quack!");
}
```

* A. A `NullPointerException` that does not include any variable names in the stack trace
* B. A `NullPointerException` naming `huey` in the stack trace
* C. A `NullPointerException` naming `dewey` in the stack trace
* D. A `NullPointerException` naming `louie` in the stack trace
* E. A `NullPointerException` naming `huey` and `louie` in the stack trace
* F. A `NullPointerException` naming `huey` and `dewey` in the stack trace
* G. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C (NullPointerException naming dewey)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** `NullPointerException` stack traces include the name of the variable that is `null` by default, making option A incorrect. The first `NullPointerException` encountered at runtime is when `dewey.intValue()` is called, making option C correct. Options E and F are incorrect as only one `NullPointerException` exception can be thrown at a time.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Từ Java 14 trở đi (và chuẩn trong Java 21), tính năng *Helpful NullPointerExceptions* tự động phân tích và chỉ ra chính xác tên biến nào mang giá trị `null`.
    * Hãy xem xét thứ tự đánh giá biểu thức trong câu lệnh `if`:
      ```java
      if (louie == huey.substring(dewey.intValue()))
      ```
      * Để gọi phương thức `huey.substring(...)`, Java **bắt buộc phải tính toán giá trị của tham số truyền vào trước**!
      * Biểu thức tham số là: `dewey.intValue()`.
      * Tại thời điểm này, biến `dewey` đang có giá trị là `null`. Việc gọi `.intValue()` trên `dewey` ngay lập tức làm phát sinh **`NullPointerException`**.
      * Vì ngoại lệ đã xảy ra ngay tại tham số, lời gọi `huey.substring()` chưa từng được thực hiện!
    * Do đó, stack trace chỉ ra chính xác tên biến gây lỗi đầu tiên là **`dewey`** → Đáp án **C**.
    * **Bẫy thi cần nhớ:** Tham số của phương thức luôn được đánh giá trước khi bản thân phương thức đó được gọi.
</details>

---

### Question 15 (Câu 15)
**Which of the following, when inserted independently in the blank, use locale parameters that are properly formatted? (Choose all that apply.)**

```java
import java.util.Locale;
public class ReadMap implements AutoCloseable {
   private Locale locale;
   private boolean closed = false;
   @Override public void close() {
      System.out.println("Folding map");
      locale = null;
      closed = true;
   }
   public void open() {
      this.locale = ____________;
   }
   public void use() {
      // Implementation omitted
   }
}
```

* A. `Locale.of("xM")`
* B. `Locale.of("MQ", "ks")`
* C. `Locale.of("qw")`
* D. `Locale.of("wp", "VW")`
* E. `Locale.create("zp")`
* F. `new Locale.Builder().setLanguage("yw").setRegion("PM")`
* G. The code does not compile regardless of what is placed in the blank.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles with the appropriate locale, so option G is incorrect. A locale consists of a required lowercase language code and optional uppercase country code. In the `Locale.of()` method, the language code is provided first. For these reasons, options C and D are correct. Option E is incorrect because a `Locale` is created using the `Locale.of()` method or `Locale.Builder` class. Option F is really close but is missing `build()` at the end. Without that, option F does not compile.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Quy chuẩn mã hoá của Locale trong Java:**
      * Mã ngôn ngữ (Language code): Bắt buộc viết bằng **chữ thường (lowercase)** (ví dụ `en`, `vi`, `qw`).
      * Mã quốc gia (Country/Region code): Viết bằng **chữ hoa (uppercase)** (ví dụ `US`, `VN`, `VW`).
    * Xét các lựa chọn:
      * **A sai:** `"xM"` có chữ cái hoa 'M' trong mã ngôn ngữ.
      * **B sai:** `"MQ"` là chữ hoa (ngôn ngữ không được viết hoa), `"ks"` là chữ thường (quốc gia không được viết thường).
      * **C đúng:** `Locale.of("qw")` truyền mã ngôn ngữ 2 ký tự chữ thường hợp lệ.
      * **D đúng:** `Locale.of("wp", "VW")` có ngôn ngữ chữ thường `"wp"` và quốc gia chữ hoa `"VW"` hợp lệ.
      * **E sai:** Lớp `Locale` không có phương thức factory nào tên là `create()`.
      * **F sai cú pháp:** Dùng `new Locale.Builder()...` nhưng thiếu lệnh gọi kết thúc **`.build()`** ở cuối, nên trả về đối tượng Builder chứ không phải `Locale`.
    * **Bẫy thi cần nhớ:** Mã ngôn ngữ luôn viết thường (`en`), mã quốc gia luôn viết hoa (`US`). Dùng `Builder` bắt buộc phải kết thúc bằng `.build()`.
</details>

---

### Question 16 (Câu 16)
**Which of the following can be inserted into the blank to allow the code to compile and run without throwing an exception?**

```java
var f = DateTimeFormatter.ofPattern("hh o'clock");
System.out.println(f.format(___________________.now()));
```

* A. `ZonedTime`
* B. `LocalDate`
* C. `LocalTimestamp`
* D. `LocalTime`
* E. The code does not compile regardless of what is placed in the blank.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F (None of the above)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** When creating a custom formatter, any nonsymbol code must be properly escaped using pairs of single quotes (`'`). In this case, it fails because `o` is not a symbol. Even if you didn't know `o` wasn't a symbol, the code contains an unmatched single quote. If the properly escaped value of `"hh' o''clock'"` were used, then the correct answer would be option D, `LocalTime`. Without this change, though, the code throws an exception at runtime, making option F the correct answer. Option B would not be correct because `LocalDate` values do not have an hour part. Options A and C are incorrect because `ZonedTime` and `LocalTimestamp` are not valid date/time classes.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Hãy quan sát thật kỹ chuỗi mẫu định dạng ở dòng 1:
      ```java
      DateTimeFormatter.ofPattern("hh o'clock");
      ```
    * Quy tắc của `DateTimeFormatter`: Bất kỳ ký tự chữ cái nào (A–Z, a–z) nằm trong chuỗi pattern đều được hiểu là **ký tự quy ước định dạng (format symbol)**.
    * Trong mẫu trên:
      * Chữ cái `o` không phải là một ký tự quy ước hợp lệ của Java DateTime.
      * Dấu nháy đơn `'` trong `'clock` bị lẻ (không có dấu đóng nháy đơn đối xứng).
    * Muốn in chữ `"o'clock"` dưới dạng văn bản nguyên bản, bạn bắt buộc phải bọc trong cặp nháy đơn và escape dấu nháy đơn: `"hh 'o''clock'"`.
    * Vì chuỗi pattern sai cú pháp, dòng 1 sẽ ném ra **`IllegalArgumentException` ngay tại thời điểm tạo formatter**, trước khi kịp format bất cứ đối tượng nào!
    * Do đó, dù bạn có điền bất kỳ lớp nào vào chỗ trống ở dòng 2, chương trình vẫn luôn luôn bị ném ngoại lệ → Đáp án đúng là **F**.
    * **Bẫy thi cần nhớ:** Chữ cái không phải symbol trong pattern của DateTimeFormatter phải được bọc trong cặp nháy đơn `'...'`. Dấu nháy đơn đơn lẻ sẽ ném `IllegalArgumentException`.
</details>

---

### Question 17 (Câu 17)
**Which of the following statements about resource bundles are correct? (Choose all that apply.)**

* A. All keys must be in the same resource bundle to be used.
* B. A resource bundle is loaded by calling the `new ResourceBundle()` constructor.
* C. Resource bundle values are always read using the `Properties` class.
* D. Changing the default locale lasts for only a single run of the program.
* E. If a resource bundle for a specific locale is requested, then the resource bundle for the default locale will not be used.
* F. It is possible to use a resource bundle for a locale without specifying a default locale.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Option A is incorrect because Java will look at parent bundles if a key is not found in a specified resource bundle. Option B is incorrect because resource bundles are loaded from static factory methods. Option C is incorrect, as resource bundle values are read from the `ResourceBundle` object directly. Option D is correct because the locale is changed only in memory. Option E is incorrect, as the resource bundle for the default locale may be used if there is no resource bundle for the specified locale (or its locale without a country code). Finally, option F is correct. The JVM will set a default locale automatically.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A sai:** Java hỗ trợ cơ chế kế thừa thuộc tính (Property Inheritance), nếu file con không có key, Java sẽ tìm ngược lên file cha và file gốc `BaseName.properties`.
    * **B sai:** `ResourceBundle` là lớp trừu tượng, được tải thông qua phương thức static factory: `ResourceBundle.getBundle(...)`.
    * **C sai:** Dữ liệu được đọc trực tiếp từ đối tượng `ResourceBundle` bằng các hàm `getString("key")`, `getObject("key")`.
    * **D đúng:** `Locale.setDefault()` chỉ thay đổi cấu hình trong bộ nhớ JVM của tiến trình hiện tại, không làm thay đổi vĩnh viễn hệ điều hành và sẽ biến mất khi tắt chương trình.
    * **E sai:** Nếu locale yêu cầu không tìm thấy file nào, Java sẽ fallback sang tìm file của Locale mặc định.
    * **F đúng:** Nếu bạn gọi `ResourceBundle.getBundle("Zoo", locale)`, bạn không cần quan tâm locale mặc định là gì, chương trình vẫn chạy bình thường.
    * **Bẫy thi cần nhớ:** `ResourceBundle` tải bằng factory method `getBundle()`, không dùng toán tử `new`.
</details>

---

### Question 18 (Câu 18)
**What is the output of the following code?**

```java
import java.io.*;
public class FamilyCar {
   static class Door implements AutoCloseable {
      public void close() {
         System.out.print("D");
   } }
   static class Window implements Closeable {
      public void close() {
         System.out.print("W");
         throw new RuntimeException();
   } }
   public static void main(String[] args) {
      var d = new Door();
      try (d; var w = new Window()) {
         System.out.print("T");
      } catch (Exception e) {
         System.out.print("E");
      } finally {
         System.out.print("F");
      } } }
```

* A. `TWF`
* B. `TWDF`
* C. `TWDEF`
* D. `TWF` followed by an exception
* E. `TWDF` followed by an exception
* F. `TWEF` followed by an exception
* G. The code does not compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C (TWDEF)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** After both resources are declared and created in the try-with-resources statement, `T` is printed as part of the body. Then the try-with-resources completes and closes the resources in the reverse of the order in which they were declared. After `W` is printed, an exception is thrown. However, the remaining resource still needs to be closed, so `D` is printed. Once all the resources are closed, the exception is thrown and swallowed in the `catch` block, causing `E` to be printed. Last, the `finally` block is run, printing `F`. Therefore, the answer is `TWDEF` and option C is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Hai tài nguyên được khai báo trong `try`: `d` (Door) và `w` (Window).
    * **Bước 1:** Khối `try` thực thi → In ra chữ **`T`**.
    * **Bước 2: Tự động đóng tài nguyên theo thứ tự LIFO (ngược lại):**
      * `w` (Window) được khai báo sau nên được gọi `close()` trước → In ra chữ **`W`**.
      * Trong `Window.close()`, một `RuntimeException` được ném ra.
      * **Lưu ý cốt lõi:** Java vẫn đảm bảo **gọi tiếp phương thức `close()` cho các tài nguyên còn lại**!
      * `d` (Door) được gọi `close()` → In ra chữ **`D`**.
    * **Bước 3: Xử lý ngoại lệ trong `catch`:**
      * Ngoại lệ `RuntimeException` ném ra từ `Window.close()` được bắt bởi `catch (Exception e)` → In ra chữ **`E`**.
    * **Bước 4: Khối `finally` thực thi:**
      * Luôn luôn chạy cuối cùng → In ra chữ **`F`**.
    * Kết hợp toàn bộ chuỗi in lại: **`TWDEF`** → Đáp án **C**.
    * **Bẫy thi cần nhớ:** Tài nguyên đóng theo thứ tự LIFO; một tài nguyên ném lỗi khi close thì các tài nguyên trước đó VẪN ĐƯỢC ĐÓNG đầy đủ; ngoại lệ khi close vẫn được bắt bởi khối `catch` của câu lệnh `try`.
</details>

---

### Question 19 (Câu 19)
**Suppose that we have the following three properties files and code. Which bundles are used on lines 8 and 9, respectively?**

```properties
# Dolphins.properties 
name=The Dolphin
age=0
 
# Dolphins_en.properties 
name=Dolly
age=4
 
# Dolphins_fr.properties 
name=Dolly
```

```java
5: var fr = Locale.of("fr");
6: Locale.setDefault(Locale.of("en", "US"));
7: var b = ResourceBundle.getBundle("Dolphins", fr);
8: b.getString("name");
9: b.getString("age");
```

* A. `Dolphins.properties` and `Dolphins.properties`
* B. `Dolphins.properties` and `Dolphins_en.properties`
* C. `Dolphins_en.properties` and `Dolphins_en.properties`
* D. `Dolphins_fr.properties` and `Dolphins.properties`
* E. `Dolphins_fr.properties` and `Dolphins_en.properties`
* F. The code does not compile.
* G. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D (Dolphins_fr.properties and Dolphins.properties)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Java will use `Dolphins_fr.properties` as the matching resource bundle on line 7 because it is an exact match on the language of the requested locale. Line 8 finds a matching key in this file. Line 9 does not find a match in that file; therefore, it has to look higher up in the hierarchy. Once a bundle is chosen, only resources in that hierarchy are allowed. It cannot use the default locale anymore, but it can use the default resource bundle specified by `Dolphins.properties`. For these reasons, option D is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 7: Gọi `getBundle("Dolphins", fr)` yêu cầu locale tiếng Pháp `fr`.
    * Java tìm thấy file khớp chính xác là **`Dolphins_fr.properties`** và chọn làm bundle đại diện.
    * **Dòng 8 (`b.getString("name")`):**
      * File `Dolphins_fr.properties` có định nghĩa key `name=Dolly`.
      * Do đó giá trị được lấy ngay từ **`Dolphins_fr.properties`**.
    * **Dòng 9 (`b.getString("age")`):**
      * Trong file `Dolphins_fr.properties` **hoàn toàn không có key `age`**!
      * Theo cơ chế kế thừa thuộc tính (Property Inheritance), Java tìm ngược lên file cha gốc là **`Dolphins.properties`**.
      * File `Dolphins.properties` có định nghĩa `age=0`. Do đó giá trị được lấy từ `Dolphins.properties`.
    * **Tại sao không lấy từ `Dolphins_en.properties`?**  
      Bởi vì một khi Java đã chọn được bundle của ngôn ngữ tiếng Pháp (`fr`), nhánh ngôn ngữ tiếng Anh (`en`) bị loại bỏ hoàn toàn, Java không bao giờ tìm kiếm sang ngôn ngữ mặc định!
    * Vì vậy, thứ tự sử dụng là: `Dolphins_fr.properties` và `Dolphins.properties` → Đáp án **D**.
    * **Bẫy thi cần nhớ:** Khi đã match được file ngôn ngữ yêu cầu, nếu thiếu key Java chỉ fallback về file Base gốc (`Base.properties`), TUYỆT ĐỐI KHÔNG fallback sang file ngôn ngữ mặc định.
</details>

---

### Question 20 (Câu 20)
**What is printed by the following program?**

```java
1:  public class DriveBus {
2:     public void go() {
3:        System.out.print("A");
4:        try {
5:           stop();
6:        } catch (ArithmeticException e) {
7:           System.out.print("B");
8:        } finally {
9:           System.out.print("C");
10:       }
11:       System.out.print("D");
12:    }
13:    public void stop() {
14:       System.out.print("E");
15:       Object x = null;
16:       x.toString();
17:       System.out.print("F");
18:    }
19:    public static void main(String n[]) {
20:       new DriveBus().go();
21:    } }
```

* A. `AE`
* B. `AEBCD`
* C. `AEC`
* D. `AECD`
* E. `AE` followed by a stack trace
* F. `AEBCD` followed by a stack trace
* G. `AEC` followed by a stack trace
* H. A stack trace with no other output

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **G (AEC followed by a stack trace)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `main()` method invokes `go()`, and `A` is printed on line 3. The `stop()` method is invoked, and `E` is printed on line 14. Line 16 throws a `NullPointerException`, so `stop()` immediately ends, and line 17 doesn't execute. The exception isn't caught in `go()`, so the `go()` method ends as well, but not before its `finally` block executes and `C` is printed on line 9. Because `main()` doesn't catch the exception, the stack trace displays, and no further output occurs. For these reasons, `AEC` is printed followed by a stack trace for a `NullPointerException`, making option G correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 20 gọi `go()`: Dòng 3 in ra chữ **`A`**.
    * Dòng 5 gọi `stop()`: Dòng 14 in ra chữ **`E`**.
    * Dòng 16: Gọi `x.toString()` trên tham chiếu `null` → Phát sinh **`NullPointerException`**.
    * Phương thức `stop()` bị ngắt đột ngột (dòng 17 không chạy, không in `F`). Ngoại lệ bắn ngược về phương thức `go()`.
    * Khối `catch` ở dòng 6 chỉ bắt `ArithmeticException`, không khớp với `NullPointerException` → Khối catch bị bỏ qua (không in `B`).
    * Khối `finally` ở dòng 8 **luôn luôn thực thi** → Dòng 9 in ra chữ **`C`**.
    * Sau khối `finally`, vì ngoại lệ `NullPointerException` chưa được xử lý, chương trình bị sập ngay tại đây (dòng 11 không chạy, không in `D`) và in stack trace ra màn hình console.
    * Toàn bộ chuỗi in ra: `AEC` theo sau bởi stack trace của `NullPointerException` → Đáp án **G**.
    * **Bẫy thi cần nhớ:** Ngoại lệ không được bắt trong `catch` thì khối `finally` vẫn chạy xong rồi chương trình mới bị dừng và xuất stack trace.
</details>

---

### Question 21 (Câu 21)
**Which change allows the following program to compile?**

```java
1: public class AhChoo {
2:    static class SneezeException extends Exception {}
3:    static class SniffleException extends SneezeException {}
4:    public static void main(String[] args) {
5:       try {
6:          throw new SneezeException();
7:       } catch (SneezeException | SniffleException e) {
8:       } finally {}
9:    } }
```

* A. Add `throws SneezeException` to the declaration on line 4.
* B. Add `throws Throwable` to the declaration on line 4.
* C. Change line 7 to `} catch (SneezeException e) {`.
* D. Change line 7 to `} catch (SniffleException e) {`.
* E. Remove line 7.
* F. The code compiles correctly as is.
* G. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code does not compile because the multi-catch block on line 7 cannot catch both a superclass and a related subclass. Options A and B do not address this problem, so they are incorrect. Since the `try` body throws `SneezeException`, it can be caught in a `catch` block, making option C correct. Option D allows the `catch` block to compile but causes a compiler error on line 6. Both of the custom exceptions are checked and must be handled or declared in the `main()` method. A `SneezeException` is not a `SniffleException`, so the exception is not handled. Likewise, option E leads to an unhandled exception compiler error on line 6.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Lớp `SniffleException` kế thừa từ `SneezeException` (quan hệ con - cha).
    * Dòng 7 viết: `catch (SneezeException | SniffleException e)`.
      * Đây là cú pháp `multi-catch`.
      * **Quy tắc cốt lõi của multi-catch:** Không được phép chứa hai ngoại lệ có quan hệ kế thừa (cha - con) với nhau, vì điều đó làm cho lớp con bị dư thừa (*redundant*).
      * Do đó, dòng 7 bị **LỖI BIÊN DỊCH**.
    * **Để sửa lỗi:**
      * Nếu chọn **C**: Đổi thành `catch (SneezeException e)`. Vì `SneezeException` là lớp cha, nó có thể bắt hợp lệ ngoại lệ được ném ra từ dòng 6 (`new SneezeException()`) → Biên dịch thành công → **C đúng**.
      * Nếu chọn D: Đổi thành `catch (SniffleException e)`. Dòng 6 ném ra `SneezeException` (lớp cha), lớp con `SniffleException` không thể bắt được lớp cha, dẫn đến dòng 6 bị lỗi vì ném checked exception mà không được handle or declare.
    * Vì vậy, đáp án đúng duy nhất là **C**.
    * **Bẫy thi cần nhớ:** Multi-catch cấm các ngoại lệ có quan hệ thừa kế.
</details>

---

### Question 22 (Câu 22)
**What is the output of the following code?**

```java
try {
   LocalDateTime book = LocalDateTime.of(2025, 4, 5, 12, 30, 20);
   System.out.print(book.format(DateTimeFormatter.ofPattern("m")));
   System.out.print(book.format(DateTimeFormatter.ofPattern("z")));
   System.out.print(DateTimeFormatter.ofPattern("y").format(book));
} catch (Throwable e) {}
```

* A. `4`
* B. `30`
* C. `402`
* D. `3002`
* E. `3002025`
* F. `402025`
* G. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B (30)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** For this question, the date used is April 5, 2025, at 12:30:20 p.m. The code compiles, and either form of the formatter is correct: `dateTime.format(formatter)` or `formatter.format(dateTime)`. The custom format `m` returns the minute, so `30` is output first. The next line throws an exception as `z` relates to time zone, and date/time does not have a zone component. This exception is then swallowed by the `try`/`catch` block. Since this is the only value printed, option B is correct. If the code had not thrown an exception, the last line would have printed `2025`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Thời gian khởi tạo: Ngày 5 tháng 4 năm 2025, lúc 12 giờ 30 phút 20 giây (`LocalDateTime`).
    * **Lệnh 1:** `book.format(DateTimeFormatter.ofPattern("m"))`  
      Ký tự `m` biểu diễn **phút (minute)**. Phút hiện tại là `30` → **In ra: `30`**.
    * **Lệnh 2:** `book.format(DateTimeFormatter.ofPattern("z"))`  
      Ký tự `z` biểu diễn **múi giờ (time zone name)**.  
      Tuy nhiên, đối tượng `book` thuộc kiểu `LocalDateTime`, **hoàn toàn không có thông tin về múi giờ** (Time Zone)!  
      Do đó, dòng này ném ra ngoại lệ **`java.time.DateTimeException`** (UnsupportedTemporalTypeException)!
    * **Xử lý ngoại lệ:** Khối `catch (Throwable e) {}` bắt được ngoại lệ này và nuốt im lặng (không làm gì cả).
    * Lệnh in thứ 3 không bao giờ được chạm tới.
    * Vì vậy, giá trị duy nhất kịp in ra màn hình là **`30`** → Đáp án **B**.
    * **Bẫy thi cần nhớ:** Format ký tự `z` (time zone) trên `LocalDateTime` sẽ ném ngoại lệ vì nó không có thông tin múi giờ.
</details>

---

### Question 23 (Câu 23)
**Fill in the blank: A class that implements _________________ may be in a `try`-with-resources statement. (Choose all that apply.)**

* A. `AutoCloseable`
* B. `Resource`
* C. `Exception`
* D. `AutomaticResource`
* E. `Closeable`
* F. `RuntimeException`
* G. `Serializable`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Resources must inherit `AutoCloseable` to be used in a try-with-resources block. Since `Closeable`, which is used for I/O classes, extends `AutoCloseable`, both may be used, making options A and E correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Tài nguyên trong `try-with-resources` bắt buộc phải triển khai giao diện **`java.lang.AutoCloseable`** → **A đúng**.
    * Giao diện `java.io.Closeable` (dành cho các luồng I/O) kế thừa từ `AutoCloseable`. Do đó, bất kỳ lớp nào triển khai **`Closeable`** cũng gián tiếp triển khai `AutoCloseable` và hoàn toàn được dùng trong `try-with-resources` → **E đúng**.
    * Các giao diện `Resource`, `AutomaticResource` không tồn tại trong thư viện chuẩn Java.
    * **Bẫy thi cần nhớ:** `AutoCloseable` (Java 7) và `Closeable` (kế thừa từ `AutoCloseable`) là 2 giao diện duy nhất được hỗ trợ trong `try-with-resources`.
</details>

---

### Question 24 (Câu 24)
**What is the output of the following program?**

```java
public class SnowStorm {
   static class WalkToSchool implements AutoCloseable {
      public void close() {
         throw new RuntimeException("flurry");
      } }
   public static void main(String[] args) {
      WalkToSchool walk1 = new WalkToSchool();
      try (walk1; WalkToSchool walk2 = new WalkToSchool()) {
         throw new RuntimeException("blizzard");
      } catch(Exception e) {
         System.out.println(e.getMessage()
            + " " + e.getSuppressed().length);
      }
      walk1 = null;
   } }
```

* A. `blizzard 0`
* B. `blizzard 1`
* C. `blizzard 2`
* D. `flurry 0`
* E. `flurry 1`
* F. `flurry 2`
* G. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **G (None of the above)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code does not compile because the resource `walk1` is not `final` or effectively `final` and cannot be used in the declaration of a try-with-resources statement. For this reason, option G is correct. If the line that set `walk1` to `null` were removed, then the code would compile and print `blizzard 2` at runtime, with the exception inside the `try` block being the primary exception since it is thrown first. Then two suppressed exceptions would be added to it when trying to close the `AutoCloseable` resources.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Từ Java 9, bạn có thể truyền biến tài nguyên đã khai báo trước vào `try-with-resources`: `try (walk1; ...)` với **điều kiện tiên quyết: biến đó bắt buộc phải là `final` hoặc `effectively final`**!
    * Hãy nhìn xuống dòng cuối cùng của phương thức `main`:
      ```java
      walk1 = null;
      ```
    * Biến `walk1` đã bị gán lại giá trị thành `null`. Do bị gán lại, biến `walk1` **KHÔNG CÒN LÀ effectively final nữa**!
    * Vì vi phạm quy tắc effectively final, trình biên dịch báo **LỖI BIÊN DỊCH ngay tại dòng khai báo `try (walk1; ...)`**!
    * Chương trình không thể chạy được → Đáp án đúng là **G**.
    * *(Lưu ý: Nếu xoá dòng `walk1 = null;`, mã sẽ biên dịch và in ra `blizzard 2` do có 2 ngoại lệ bị nén từ 2 lần gọi close)*.
    * **Bẫy thi cần nhớ:** Biến đặt trong `try-with-resources` bắt buộc phải là `final` hoặc `effectively final`. Nếu có bất kỳ phép gán lại nào ở sau, code sẽ bị lỗi biên dịch ngay lập tức!
</details>

---

### Question 25 (Câu 25)
**Assuming U.S. currency is in dollars ($) and German currency is in euros (€), what is the output of the following program?**

```java
import java.text.NumberFormat;
import java.util.Locale;
import java.util.Locale.Category;
public record Wallet(double money) {
   private String openWallet() {
      Locale.setDefault(Category.DISPLAY,
         new Locale.Builder().setRegion("us").build());
      Locale.setDefault(Category.FORMAT,
         new Locale.Builder().setLanguage("en").build());
      return NumberFormat.getCurrencyInstance(Locale.GERMANY)
         .format(money);
   }
   public void printBalance() {
      System.out.println(openWallet());
   }   
   public static void main(String... unused) {
      new Wallet(2.4).printBalance();
   } }
```

* A. `2,40 €`
* B. `$2.40`
* C. `2.4`
* D. The code does not compile.
* E. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A (2,40 €)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles and prints the value for Germany, `2,40 €`, making option A the correct answer. Note that the default locale category is ignored since an explicit currency locale is selected.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Phương thức `openWallet()` gọi thiết lập Locale mặc định cho `Category.DISPLAY` và `Category.FORMAT`.
    * Tuy nhiên, dòng lệnh định dạng tiền tệ gọi trực tiếp:
      ```java
      NumberFormat.getCurrencyInstance(Locale.GERMANY).format(money);
      ```
    * Lời gọi này truyền vào một Locale tường minh là **`Locale.GERMANY`**!
    * Khi một Locale cụ thể được truyền vào factory method, Java sẽ **bỏ qua hoàn toàn Locale mặc định của hệ thống** và định dạng chính xác theo quy chuẩn của Locale được chỉ định (`GERMANY`).
    * Ở Đức, số thập phân dùng dấu phẩy `,` và ký hiệu tiền tệ euro `€` đặt ở sau: `2,40 €` → Đáp án đúng là **A**.
    * **Bẫy thi cần nhớ:** Khi truyền Locale cụ thể vào `NumberFormat.getInstance(locale)`, các thiết lập `Locale.setDefault()` không còn bất kỳ tác dụng nào.
</details>

---

### Question 26 (Câu 26)
**Which lines can fill in the blank to make the following code compile? (Choose all that apply.)**

```java
void rollOut() throws ClassCastException {}
 
public void transform(String c) {
   try {
      rollOut();
   } catch (IllegalArgumentException | ________________________) {
   }
}
```

* A. `IOException a`
* B. `Error b`
* C. `NullPointerException c`
* D. `RuntimeException d`
* E. `NumberFormatException e`
* F. `ClassCastException f`
* G. None of the above. The code contains a compiler error regardless of what is inserted into the blank.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `try` block is not capable of throwing an `IOException`, making the `catch` block unreachable code and option A incorrect. Options B and F are correct, as both are unchecked exceptions that do not extend or inherit from `IllegalArgumentException`. Remember, it is not a good idea to catch `Error` in practice, although because it is possible, it may come up on the exam. Option C is incorrect because the variable `c` is declared already in the method declaration. Option D is incorrect because the `IllegalArgumentException` inherits from `RuntimeException`, making the first declaration unnecessary. Similarly, option E is incorrect because `NumberFormatException` inherits from `IllegalArgumentException`, making the second declaration unnecessary. Since options B and F are correct, option G is incorrect.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Trong khối `try`, phương thức `rollOut()` chỉ ném `ClassCastException` (unchecked exception).
    * Xét các lựa chọn điền vào vị trí multi-catch:
      * **A (`IOException a`):** `IOException` là một checked exception. Vì trong `try` không có lệnh nào ném `IOException`, việc viết `catch (IOException)` sẽ bị **Lỗi biên dịch: Unreachable catch block**.
      * **B (`Error b`):** `Error` là unchecked và không có quan hệ thừa kế với `IllegalArgumentException` → Hợp lệ về mặt cú pháp → **Chọn B**.
      * **C (`NullPointerException c`):** Khai báo tên biến là `c`. Nhưng tham số của phương thức đã có `String c` → **Lỗi biên dịch: Trùng tên biến local**.
      * **D (`RuntimeException d`):** `IllegalArgumentException` kế thừa từ `RuntimeException` → Vi phạm quy tắc Disjoint types của multi-catch → Lỗi biên dịch.
      * **E (`NumberFormatException e`):** `NumberFormatException` kế thừa từ `IllegalArgumentException` → Tiếp tục vi phạm quy tắc Disjoint types → Lỗi biên dịch.
      * **F (`ClassCastException f`):** `ClassCastException` là unchecked exception, không có quan hệ cha-con với `IllegalArgumentException`, tên biến `f` không bị trùng → **Hợp lệ hoàn toàn** → **Chọn F**.
    * **Bẫy thi cần nhớ:** Multi-catch cấm các ngoại lệ có quan hệ thừa kế; không được trùng tên biến đã có trong scope; không được bắt checked exception không thể xảy ra.
</details>
