# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chapter 11: Exceptions and Localization

> **Nguồn trích dẫn:** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Trang 991–1005).  
> **Số lượng:** 26 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết (Trang 1390–1396).  
> **Cách học:** Bạn hãy tự đọc đề và suy luận đáp án trước, sau đó bấm vào mục **"🔍 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và khắc sâu các bẫy thi của Oracle.

---

### Câu 1 (Question 1)
**Lựa chọn nào sau đây có thể chèn vào dòng 8 để đoạn mã sau biên dịch thành công? (Chọn tất cả các đáp án đúng.)**

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
* F. Không có đáp án nào ở trên

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C, D, E**
* **Phân tích chi tiết:**
  * Phương thức khai báo `throws IOException` trên chữ ký:
    * **Xét A:** Một phương thức khai báo ngoại lệ bằng `throws` **không bắt buộc** phải thực sự ném ra ngoại lệ đó. Việc thân hàm chỉ in ra chuỗi và kết thúc bình thường là hoàn toàn hợp lệ $\rightarrow$ **A đúng**.
    * **Xét B:** `Exception` là lớp cha (rộng hơn) của `IOException`. Bạn không thể ném một checked exception rộng hơn loại đã khai báo trên chữ ký hàm nếu không xử lý nó $\rightarrow$ **B sai (Lỗi biên dịch)**.
    * **Xét C & E:** `IllegalArgumentException` và `RuntimeException` là các **Unchecked Exceptions**. Một phương thức có thể ném bất kỳ unchecked exception nào vào bất cứ lúc nào mà không cần khai báo $\rightarrow$ **C và E đúng**.
    * **Xét D:** Khớp chính xác với kiểu checked exception `IOException` đã được khai báo trên chữ ký $\rightarrow$ **D đúng**.
* **Bẫy thi cần nhớ:** Khai báo `throws` không bắt buộc phải ném; Unchecked exceptions có thể ném tự do ở bất kỳ đâu; Checked exception ném ra phải cùng kiểu hoặc là lớp con của kiểu đã khai báo.
</details>

---

### Câu 2 (Question 2)
**Nhận định nào sau đây về lớp sau là chính xác?**

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

* A. Mã nguồn biên dịch và in ra stack trace của `YesProblem` tại thời điểm chạy.
* B. Mã nguồn biên dịch và in ra stack trace của `Problem` tại thời điểm chạy.
* C. Mã nguồn không biên dịch được vì `Problem` định nghĩa một constructor.
* D. Mã nguồn không biên dịch được vì `YesProblem` không định nghĩa constructor.
* E. Mã nguồn không biên dịch được nhưng sẽ biên dịch nếu đổi chỗ `Problem` và `YesProblem` ở dòng 6 và 7.
* F. Không có nhận định nào ở trên (None of the above).

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (None of the above)**
* **Phân tích chi tiết:**
  * Hãy quan sát kỹ các từ khoá:
    * Dòng 6: `public static void connectToDatabase() throw Problem` $\rightarrow$ Sử dụng sai từ khoá! Trên chữ ký hàm phải dùng **`throws`** (có 's'), ở đây lại dùng `throw`.
    * Dòng 7: `throws new YesProblem();` $\rightarrow$ Sử dụng sai từ khoá! Khi thực hiện hành động ném ngoại lệ trong thân hàm phải dùng **`throw`** (không có 's'), ở đây lại dùng `throws`.
    * Dòng 9: `public static void main(String[] c) throw Exception` $\rightarrow$ Tiếp tục dùng sai `throw` thay vì `throws`.
  * Vì cả ba dòng 6, 7, và 9 đều bị lỗi cú pháp từ khoá, chương trình **không biên dịch được**.
  * Lựa chọn E sai vì việc hoán đổi tên lớp không khắc phục được lỗi sai từ khoá cú pháp (`throw` vs `throws`).
  * Do đó, đáp án đúng là **F**.
* **Bẫy thi cần nhớ:** `throws` đi kèm chữ ký phương thức; `throw` dùng để ném đối tượng exception trong thân hàm. Đề thi OCP rất hay đánh đố sự nhầm lẫn giữa hai từ khoá này.
</details>

---

### Câu 3 (Question 3)
**Những kiểu dữ liệu nào sau đây là các đối tượng thường được bản địa hoá (localize)? (Chọn tất cả các đáp án đúng.)**

* A. Ngày tháng (Dates)
* B. Biểu thức Lambda
* C. Tên lớp (Class names)
* D. Tiền tệ (Currency)
* E. Các con số (Numbers)
* F. Tên biến (Variable names)

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, D, E**
* **Phân tích chi tiết:**
  * Bản địa hoá (Localization - l10n) nhằm mục đích phục vụ **người dùng cuối (user-facing)**:
    * **Ngày tháng (Dates):** Mỗi quốc gia hiển thị thứ tự ngày/tháng/năm khác nhau (ví dụ Mỹ dùng `MM/dd/yyyy`, Việt Nam dùng `dd/MM/yyyy`).
    * **Tiền tệ (Currency):** Ký hiệu và vị trí đặt ký hiệu tiền tệ khác nhau (`$100` vs `100 €` vs `100 đ`).
    * **Con số (Numbers):** Dấu phân cách thập phân và hàng nghìn khác nhau (`1,234.56` ở Mỹ vs `1.234,56` ở Đức/Việt Nam).
  * Tên lớp, tên biến và biểu thức Lambda là cấu trúc mã nguồn nội bộ của lập trình viên, không hiển thị cho người dùng và không bao giờ được bản địa hoá.
* **Bẫy thi cần nhớ:** Localization chỉ áp dụng cho dữ liệu giao diện người dùng: Ngày giờ, Số, Tiền tệ, và Chuỗi văn bản dịch thuật (`ResourceBundle`).
</details>

---

### Câu 4 (Question 4)
**Kết quả của đoạn mã sau là gì, giả định `a` và `b` đều bằng `0`?**

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
* E. Đoạn mã không biên dịch được (The code does not compile).
* F. Một ngoại lệ không được bắt được ném ra.
* G. Không có đáp án nào ở trên.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (The code does not compile)**
* **Phân tích chi tiết:**
  * Trong cây kế thừa ngoại lệ: `ArithmeticException` là lớp con trực tiếp của `RuntimeException`.
  * Khi bắt ngoại lệ, Java yêu cầu các khối `catch` phải được sắp xếp theo thứ tự **từ lớp con (hẹp) đến lớp cha (rộng)**.
  * Ở đoạn mã trên, dòng 5 bắt lớp cha `RuntimeException` TRƯỚC, sau đó dòng 7 mới bắt lớp con `ArithmeticException`.
  * Bất kỳ ngoại lệ `ArithmeticException` nào xảy ra đều đã bị dòng 5 tóm gọn, khiến cho khối `catch (ArithmeticException e)` ở dòng 7 trở thành **mã không bao giờ chạm tới (unreachable code)**.
  * Trình biên dịch Java không chấp nhận unreachable code và báo **LỖI BIÊN DỊCH tại dòng 7** $\rightarrow$ Đáp án **E**.
* **Bẫy thi cần nhớ:** Bắt lớp cha trước lớp con luôn gây lỗi biên dịch *unreachable catch block*.
</details>

---

### Câu 5 (Question 5)
**Giả định locale hiện tại sử dụng đồng đô-la ($) và phương thức sau được gọi với giá trị `double` là `100_102.2`, những giá trị nào sau đây sẽ được in ra? (Chọn tất cả các đáp án đúng.)**

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
* G. Không có đáp án nào ở trên

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, F**
* **Phân tích chi tiết:**
  * Giá trị đầu vào: `t = 100_102.2`.
  * **Lệnh 1:** `NumberFormat.getCompactNumberInstance().format(t)`  
    Khi không chỉ định tham số Style, `CompactNumberFormat` mặc định sử dụng kiểu thu gọn **`Style.SHORT`**. Với số khoảng 100 nghìn, nó rút gọn thành chuỗi **`100K`** $\rightarrow$ **Chọn C**.
  * **Lệnh 2:** Chỉ định tường minh `Style.SHORT` và locale mặc định $\rightarrow$ Tiếp tục in ra **`100K`** (giống hệt lệnh 1).
  * *(Ghi chú: Nếu dùng `Style.LONG`, nó mới in ra `100 thousand`)*.
  * **Lệnh 3:** `NumberFormat.getCurrencyInstance().format(t)`  
    Định dạng tiền tệ theo locale hiện tại (dùng đồng đô-la $). Định dạng tiền tệ hiển thị đầy đủ các chữ số và làm tròn đến 2 chữ số thập phân $\rightarrow$ in ra **`$100,102.20`** $\rightarrow$ **Chọn F**.
* **Bẫy thi cần nhớ:** `getCompactNumberInstance()` mặc định là `Style.SHORT` (ví dụ `100K`, `7M`). Định dạng tiền tệ `getCurrencyInstance()` không thu gọn số mà hiển thị đầy đủ kèm 2 chữ số thập phân.
</details>

---

### Câu 6 (Question 6)
**Kết quả của đoạn mã sau là gì?**

```java
LocalDate date = LocalDate.parse("2025-04-30", 
   DateTimeFormatter.ISO_LOCAL_DATE_TIME);
System.out.println(date.getYear() + " " 
   + date.getMonth() + " "+ date.getDayOfMonth());
```

* A. `2025 APRIL 2`
* B. `2025 APRIL 30`
* C. `2025 MAY 2`
* D. Đoạn mã không biên dịch được.
* E. Một ngoại lệ được ném ra tại thời điểm chạy (A runtime exception is thrown).

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (A runtime exception is thrown)**
* **Phân tích chi tiết:**
  * Hãy nhìn vào đối tượng được parse: `LocalDate date = LocalDate.parse(...)`.
  * Chuỗi đầu vào `"2025-04-30"` chỉ chứa thông tin ngày tháng, hoàn toàn không có thành phần giờ/phút/giây.
  * Nhưng formatter được truyền vào lại là **`DateTimeFormatter.ISO_LOCAL_DATE_TIME`** (formatter này yêu cầu chuỗi phải có cả ngày VÀ giờ, ví dụ `"2025-04-30T10:15:30"`).
  * Khi chạy, phương thức parse không thể tìm thấy thành phần thời gian (time component) để khớp với `ISO_LOCAL_DATE_TIME`, dẫn đến **`java.time.format.DateTimeParseException`** (một `RuntimeException`) được ném ra!
  * Vì vậy, chương trình bị dừng do ngoại lệ tại thời điểm chạy $\rightarrow$ Đáp án **E**.
  * *(Lưu ý: Nếu dùng đúng `DateTimeFormatter.ISO_LOCAL_DATE`, kết quả sẽ in ra `2025 APRIL 30`)*.
* **Bẫy thi cần nhớ:** `LocalDate` chỉ tương thích với các formatter ngày (Date formatters). Sử dụng Date-Time formatter cho chuỗi chỉ có ngày sẽ ném `DateTimeParseException`.
</details>

---

### Câu 7 (Question 7)
**Phương thức sau in ra kết quả gì?**

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
* C. Có đúng một dòng trong phương thức chứa lỗi biên dịch.
* D. Có đúng hai dòng trong phương thức chứa lỗi biên dịch.
* E. Có từ ba dòng trở lên chứa lỗi biên dịch (Three or more lines).
* F. Đoạn mã biên dịch được, nhưng `NullPointerException` bị ném ra tại thời điểm chạy.
* G. Không có đáp án nào ở trên.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (Có từ ba dòng trở lên bị lỗi biên dịch)**
* **Phân tích chi tiết:**
  * **Lỗi 1 (Dòng 12):** Trong câu lệnh `try-with-resources`, mỗi biến tài nguyên bắt buộc phải có khai báo kiểu dữ liệu riêng biệt và phải được **phân cách bằng dấu chấm phẩy (`;`)**, chứ không được dùng dấu phẩy (`,`) như khai báo biến mảng thông thường:
    * `try (FileReader r = null, p = new FileReader(""))` $\rightarrow$ **LỖI BIÊN DỊCH DÒNG 12**!
  * **Lỗi 2 (Dòng 15):** Tham số của phương thức đã khai báo biến `String s`. Trong khối catch lại khai báo tiếp `catch (Exception s)`. Điều này vi phạm quy tắc trùng tên biến trong cùng phạm vi (duplicate local variable `s`) $\rightarrow$ **LỖI BIÊN DỊCH DÒNG 15**!
  * **Lỗi 3 (Dòng 17):** Dòng 17 ném `throw new FileNotFoundException()`. Đây là một **Checked Exception**. Phương thức `tryAgain()` không khai báo `throws FileNotFoundException` và cũng không có khối `try-catch` nào bao bọc để xử lý nó $\rightarrow$ Vi phạm quy tắc Handle or Declare $\rightarrow$ **LỖI BIÊN DỊCH DÒNG 17**!
  * Có tổng cộng ít nhất 3 dòng bị lỗi biên dịch $\rightarrow$ Đáp án đúng là **E**.
* **Bẫy thi cần nhớ:** Tài nguyên trong `try-with-resources` ngăn cách bằng dấu `;`; biến trong `catch` không được trùng tên tham số phương thức; ném Checked Exception bắt buộc phải khai báo `throws`.
</details>

---

### Câu 8 (Question 8)
**Giả sử tất cả các tệp được đề cập trong các đáp án đều tồn tại và định nghĩa cùng các khoá. Tệp nào sẽ được sử dụng để tìm khoá ở dòng 8?**

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
* F. Đoạn mã không biên dịch được.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C (Dolphins_en.properties)**
* **Phân tích chi tiết:**
  * Dòng 7 gọi `ResourceBundle.getBundle("Dolphins")` không truyền tham số Locale, do đó Java sẽ sử dụng **Locale mặc định của hệ thống** đã được thiết lập ở dòng 6 là: `en_US` (`language = en`, `country = US`).
  * Thứ tự tìm kiếm file của Java cho locale `en_US` với BaseName `"Dolphins"`:
    1. Khớp cả ngôn ngữ và quốc gia: `Dolphins_en_US.properties` (Không có trong danh sách đáp án).
    2. Bỏ quốc gia, khớp ngôn ngữ: **`Dolphins_en.properties`** $\rightarrow$ Có trong lựa chọn **C**!
    3. File gốc mặc định: `Dolphins.properties` (Chỉ dùng khi không tìm thấy file có mã ngôn ngữ).
  * Lựa chọn B (`Dolphins_US.properties`) là một file không hợp lệ về mặt quy chuẩn Locale (Java không bao giờ tìm kiếm file chỉ có quốc gia mà thiếu ngôn ngữ).
  * Do đó, file được ưu tiên sử dụng là `Dolphins_en.properties` $\rightarrow$ Đáp án **C**.
* **Bẫy thi cần nhớ:** Thứ tự tìm kiếm Locale luôn là: `Language + Country` $\rightarrow$ `Language` $\rightarrow$ `BaseName`. Không bao giờ có bước tìm kiếm chỉ theo `Country`.
</details>

---

### Câu 9 (Question 9)
**Với giá trị nào của `pattern`, đoạn mã sau sẽ in ra: `<005.21> <008.49> <1,234.0>`?**

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
* E. Đoạn mã không biên dịch được bất kể điền giá trị nào vào chỗ trống.
* F. Không có đáp án nào ở trên.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D (#,###,000.0#)**
* **Phân tích chi tiết:**
  * Quan sát kết quả đầu ra mong muốn:
    * `5.21` $\rightarrow$ `005.21` (Phần nguyên có ít nhất 3 chữ số với các số 0 đứng trước, phần thập phân có 2 chữ số).
    * `8.49` $\rightarrow$ `008.49` (Tương tự, có tiền tố `00`).
    * `1234` $\rightarrow$ `1,234.0` (Phần nguyên có dấu phẩy phân cách nhóm hàng nghìn; phần thập phân có ít nhất 1 chữ số 0).
  * **Phân tích các ký hiệu của `DecimalFormat`:**
    * Ký hiệu `0`: Bắt buộc hiển thị chữ số (nếu thiếu số thì bù số 0).
    * Ký hiệu `#`: Tuỳ chọn (chỉ hiển thị nếu có giá trị khác 0).
  * Để phần nguyên luôn hiển thị ít nhất 3 chữ số, ta cần **`000`** trước dấu chấm thập phân.
  * Để hiển thị dấu phân cách hàng nghìn khi số lớn hơn 999, ta thêm **`#,###,`** ở phía trước.
  * Ở phần thập phân: `1234` in ra `.0` (ít nhất 1 chữ số), nhưng `5.21` in ra `.21` (tối đa 2 chữ số) $\rightarrow$ Cần mẫu **`.0#`** (1 số 0 bắt buộc, 1 số # tuỳ chọn).
  * Ghép lại, mẫu chính xác là: **`#,###,000.0#`** $\rightarrow$ Đáp án **D**.
* **Bẫy thi cần nhớ:** Ký hiệu `0` bắt buộc hiển thị; ký hiệu `#` bỏ qua các số 0 vô nghĩa ở đầu/cuối.
</details>

---

### Câu 10 (Question 10)
**Tình huống nào sau đây là trường hợp sử dụng ngoại lệ hợp lý nhất?**

* A. Không tìm thấy một phần tử khi tìm kiếm trong danh sách.
* B. Một tham số không mong muốn hoặc không hợp lệ được truyền vào phương thức.
* C. Máy tính bốc cháy.
* D. Bạn muốn duyệt qua một danh sách.
* E. Bạn chưa biết cách viết mã cho phương thức đó.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Phân tích chi tiết:**
  * **A sai:** Khi tìm kiếm không thấy phần tử, trả về `null`, `-1` hoặc `Optional.empty()` là thiết kế chuẩn, không nên lạm dụng ném ngoại lệ làm ảnh hưởng luồng chương trình.
  * **B đúng:** Khi caller truyền tham số không hợp lệ (ví dụ: số lượng âm, chuỗi null), việc ném ngoại lệ (như `IllegalArgumentException`) là chuẩn mực thiết kế trong Java để bảo vệ tính toàn vẹn của ứng dụng.
  * **C sai:** Máy tính cháy thì phải chạy thoát thân, không phần mềm nào xử lý được!
  * **D sai:** Duyệt danh sách phải dùng vòng lặp `for-each` hoặc Stream, không dùng ngoại lệ để điều khiển luồng lặp.
  * **E sai:** Chưa biết code thì phải tìm hiểu cách code, không được để code ném lỗi cho người gọi gánh chịu.
* **Bẫy thi cần nhớ:** Ngoại lệ chỉ dùng cho các điều kiện bất thường; không dùng ngoại lệ để kiểm soát luồng điều khiển thông thường.
</details>

---

### Câu 11 (Question 11)
**Ngoại lệ nào sau đây BẮT BUỘC phải được xử lý hoặc khai báo trong phương thức mà nó được ném ra? (Chọn tất cả các đáp án đúng.)**

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
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, E, F**
* **Phân tích chi tiết:**
  * Ngoại lệ bắt buộc phải xử lý hoặc khai báo (*Handle or Declare*) chính là **Checked Exception**.
  * **Định nghĩa Checked Exception:** Bất kỳ lớp nào kế thừa từ `Throwable` (hoặc `Exception`) mà **KHÔNG kế thừa từ `RuntimeException` hoặc `Error`**.
  * Phân tích từng lớp:
    * `Apple`: Kế thừa `RuntimeException` $\rightarrow$ Unchecked.
    * `Orange`: Kế thừa trực tiếp `Exception` $\rightarrow$ **Checked Exception** $\rightarrow$ **Chọn B**.
    * `Banana`: Kế thừa `Error` $\rightarrow$ Unchecked Error.
    * `Pear`: Kế thừa `Apple` (là con của `RuntimeException`) $\rightarrow$ Unchecked.
    * `Tomato`: Kế thừa `Orange` (là con của `Exception`) $\rightarrow$ **Checked Exception** $\rightarrow$ **Chọn E**.
    * `Peach`: Kế thừa trực tiếp `Throwable`. Vì nó không phải là `Error` và cũng không phải là `RuntimeException`, theo đặc tả Java, nó được đối xử như một **Checked Exception** $\rightarrow$ **Chọn F**.
* **Bẫy thi cần nhớ:** Bất kỳ lớp nào kế thừa trực tiếp từ `Throwable` đều là Checked Exception!
</details>

---

### Câu 12 (Question 12)
**Những thay đổi nào sau đây, khi được thực hiện độc lập, sẽ giúp đoạn mã sau biên dịch thành công? (Chọn tất cả các đáp án đúng.)**

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

* A. Xoá bỏ `throws IOException` khỏi khai báo ở dòng 3.
* B. Thêm `throws Exception` vào khai báo ở dòng 6.
* C. Thay đổi dòng 9 thành `} catch (Exception e) {}`.
* D. Thay đổi dòng 9 thành `} finally {}`.
* E. Đoạn mã đã biên dịch được mà không cần thay đổi.
* F. Không có đáp án nào ở trên.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, C**
* **Phân tích chi tiết:**
  * Phương thức `close()` của `StuckTurkeyCage` khai báo ném checked exception `IOException`.
  * Trong câu lệnh `try-with-resources` ở dòng 7, phương thức `close()` sẽ được ngầm định gọi khi khối `try` kết thúc.
  * Vì `close()` ném ra checked exception, phương thức `main` bao bọc nó bắt buộc phải tuân theo quy tắc **Handle or Declare**:
    1. Khai báo ném ngoại lệ trên `main`: Thêm `throws Exception` (hoặc `throws IOException`) vào dòng 6 $\rightarrow$ **B đúng**.
    2. Bắt ngoại lệ bằng khối `catch`: Thêm `catch (Exception e) {}` (hoặc `catch (IOException e) {}`) $\rightarrow$ **C đúng**.
  * Lựa chọn A sai vì dòng 4 ném `FileNotFoundException` (checked exception), nếu dòng 3 bỏ `throws IOException` thì chính dòng 4 sẽ bị lỗi biên dịch.
  * Lựa chọn D sai vì khối `finally` không bắt ngoại lệ, nên checked exception vẫn chưa được xử lý.
* **Bẫy thi cần nhớ:** Ngoại lệ ném ra bởi phương thức `close()` trong `try-with-resources` cũng bắt buộc phải được Handle hoặc Declare như một lệnh gọi hàm bình thường!
</details>

---

### Câu 13 (Question 13)
**Các nhận định nào sau đây là đúng về xử lý ngoại lệ trong Java? (Chọn tất cả các đáp án đúng.)**

* A. Câu lệnh `try` truyền thống nếu không có khối `catch` thì bắt buộc phải có khối `finally`.
* B. Câu lệnh `try` truyền thống nếu không có khối `finally` thì bắt buộc phải có khối `catch`.
* C. Câu lệnh `try` truyền thống nếu chỉ có một câu lệnh bên trong thì có thể bỏ cặp dấu ngoặc nhọn `{}`.
* D. Câu lệnh `try-with-resources` nếu không có khối `catch` thì bắt buộc phải có khối `finally`.
* E. Câu lệnh `try-with-resources` nếu không có khối `finally` thì bắt buộc phải có khối `catch`.
* F. Câu lệnh `try-with-resources` nếu chỉ có một câu lệnh bên trong thì có thể bỏ cặp dấu ngoặc nhọn `{}`.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B**
* **Phân tích chi tiết:**
  * **Với câu lệnh `try` truyền thống:** Bắt buộc phải có ít nhất một khối `catch` HOẶC một khối `finally`. Không thể đứng trơ trọi một mình $\rightarrow$ **A và B đúng**.
  * **Với `try-with-resources`:** Cả hai khối `catch` và `finally` đều là **tuỳ chọn**, không khối nào là bắt buộc (vì bản thân câu lệnh đã tự động gọi `close()`) $\rightarrow$ D và E sai.
  * **Về cặp dấu ngoặc nhọn `{}`:** Khác với `if`, `while`, `for`, các khối lệnh `try`, `catch`, `finally` **bắt buộc luôn luôn phải có cặp ngoặc nhọn `{}`**, dù bên trong chỉ có duy nhất 1 câu lệnh $\rightarrow$ C và F sai.
* **Bẫy thi cần nhớ:** Khối `try` luôn luôn bắt buộc phải có ngoặc nhọn `{}`. `try-with-resources` không bắt buộc phải có cả `catch` lẫn `finally`.
</details>

---

### Câu 14 (Question 14)
**Giả sử cờ `-g:vars` được sử dụng khi biên dịch mã để lưu thông tin gỡ lỗi, kết quả đầu ra của đoạn mã sau là gì?**

```java
var huey = (String)null;
Integer dewey = null;
Object louie = null;
if (louie == huey.substring(dewey.intValue())) {
   System.out.println("Quack!");
}
```

* A. `NullPointerException` không kèm theo tên biến trong stack trace.
* B. `NullPointerException` chỉ rõ tên biến `huey` trong stack trace.
* C. `NullPointerException` chỉ rõ tên biến `dewey` trong stack trace.
* D. `NullPointerException` chỉ rõ tên biến `louie` trong stack trace.
* E. `NullPointerException` chỉ rõ tên biến `huey` và `louie` trong stack trace.
* F. `NullPointerException` chỉ rõ tên biến `huey` và `dewey` trong stack trace.
* G. Không có đáp án nào ở trên.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C (NullPointerException chỉ rõ tên biến dewey)**
* **Phân tích chi tiết:**
  * Từ Java 14 trở đi (và chuẩn trong Java 21), tính năng *Helpful NullPointerExceptions* tự động phân tích và chỉ ra chính xác tên biến nào mang giá trị `null`.
  * Hãy xem xét thứ tự đánh giá biểu thức trong câu lệnh `if`:
    ```java
    if (louie == huey.substring(dewey.intValue()))
    ```
    * Để gọi phương thức `huey.substring(...)`, Java **bắt buộc phải tính toán giá trị của tham số truyền vào trước**!
    * Biểu thức tham số là: `dewey.intValue()`.
    * Tại thời điểm này, biến `dewey` đang có giá trị là `null`. Việc gọi `.intValue()` trên `dewey` ngay lập tức làm phát sinh **`NullPointerException`**.
    * Vì ngoại lệ đã xảy ra ngay tại tham số, lời gọi `huey.substring()` chưa từng được thực hiện!
  * Do đó, stack trace chỉ ra chính xác tên biến gây lỗi đầu tiên là **`dewey`** $\rightarrow$ Đáp án **C**.
* **Bẫy thi cần nhớ:** Tham số của phương thức luôn được đánh giá trước khi bản thân phương thức đó được gọi.
</details>

---

### Câu 15 (Question 15)
**Những câu lệnh nào sau đây, khi được chèn độc lập vào chỗ trống, sử dụng các tham số Locale đúng định dạng chuẩn? (Chọn tất cả các đáp án đúng.)**

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
* G. Đoạn mã không biên dịch được bất kể điền giá trị nào vào chỗ trống.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, D**
* **Phân tích chi tiết:**
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

### Câu 16 (Question 16)
**Lựa chọn nào sau đây có thể chèn vào chỗ trống để đoạn mã biên dịch và thực thi mà không ném ra ngoại lệ?**

```java
var f = DateTimeFormatter.ofPattern("hh o'clock");
System.out.println(f.format(___________________.now()));
```

* A. `ZonedTime`
* B. `LocalDate`
* C. `LocalTimestamp`
* D. `LocalTime`
* E. Đoạn mã không biên dịch được bất kể điền giá trị nào vào chỗ trống.
* F. Không có đáp án nào ở trên (None of the above).

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (None of the above)**
* **Phân tích chi tiết:**
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
  * Do đó, dù bạn có điền bất kỳ lớp nào vào chỗ trống ở dòng 2, chương trình vẫn luôn luôn bị ném ngoại lệ $\rightarrow$ Đáp án đúng là **F**.
* **Bẫy thi cần nhớ:** Chữ cái không phải symbol trong pattern của DateTimeFormatter phải được bọc trong cặp nháy đơn `'...'`. Dấu nháy đơn đơn lẻ sẽ ném `IllegalArgumentException`.
</details>

---

### Câu 17 (Question 17)
**Những phát biểu nào sau đây về `ResourceBundle` là chính xác? (Chọn tất cả các đáp án đúng.)**

* A. Tất cả các khoá (keys) bắt buộc phải nằm trong cùng một file resource bundle thì mới sử dụng được.
* B. Một resource bundle được tải bằng cách gọi constructor `new ResourceBundle()`.
* C. Các giá trị trong resource bundle luôn luôn được đọc bằng lớp `Properties`.
* D. Việc thay đổi Locale mặc định (`Locale.setDefault`) chỉ có hiệu lực trong một lần chạy duy nhất của chương trình.
* E. Nếu yêu cầu một bundle cho một locale cụ thể, thì bundle của locale mặc định chắc chắn sẽ không được sử dụng.
* F. Hoàn toàn có thể sử dụng một resource bundle cho một locale mà không cần chỉ định locale mặc định.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D, F**
* **Phân tích chi tiết:**
  * **A sai:** Java hỗ trợ cơ chế kế thừa thuộc tính (Property Inheritance), nếu file con không có key, Java sẽ tìm ngược lên file cha và file gốc `BaseName.properties`.
  * **B sai:** `ResourceBundle` là lớp trừu tượng, được tải thông qua phương thức static factory: `ResourceBundle.getBundle(...)`.
  * **C sai:** Dữ liệu được đọc trực tiếp từ đối tượng `ResourceBundle` bằng các hàm `getString("key")`, `getObject("key")`.
  * **D đúng:** `Locale.setDefault()` chỉ thay đổi cấu hình trong bộ nhớ JVM của tiến trình hiện tại, không làm thay đổi vĩnh viễn hệ điều hành và sẽ biến mất khi tắt chương trình.
  * **E sai:** Nếu locale yêu cầu không tìm thấy file nào, Java sẽ fallback sang tìm file của Locale mặc định.
  * **F đúng:** Nếu bạn gọi `ResourceBundle.getBundle("Zoo", locale)`, bạn không cần quan tâm locale mặc định là gì, chương trình vẫn chạy bình thường.
* **Bẫy thi cần nhớ:** `ResourceBundle` tải bằng factory method `getBundle()`, không dùng toán tử `new`.
</details>

---

### Câu 18 (Question 18)
**Kết quả đầu ra của đoạn mã sau là gì?**

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
* D. `TWF` theo sau bởi một ngoại lệ
* E. `TWDF` theo sau bởi một ngoại lệ
* F. `TWEF` theo sau bởi một ngoại lệ
* G. Đoạn mã không biên dịch được.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C (TWDEF)**
* **Phân tích chi tiết:**
  * Hai tài nguyên được khai báo trong `try`: `d` (Door) và `w` (Window).
  * **Bước 1:** Khối `try` thực thi $\rightarrow$ In ra chữ **`T`**.
  * **Bước 2: Tự động đóng tài nguyên theo thứ tự LIFO (ngược lại):**
    * `w` (Window) được khai báo sau nên được gọi `close()` trước $\rightarrow$ In ra chữ **`W`**.
    * Trong `Window.close()`, một `RuntimeException` được ném ra.
    * **Lưu ý cốt lõi:** Java vẫn đảm bảo **gọi tiếp phương thức `close()` cho các tài nguyên còn lại**!
    * `d` (Door) được gọi `close()` $\rightarrow$ In ra chữ **`D`**.
  * **Bước 3: Xử lý ngoại lệ trong `catch`:**
    * Ngoại lệ `RuntimeException` ném ra từ `Window.close()` được bắt bởi `catch (Exception e)` $\rightarrow$ In ra chữ **`E`**.
  * **Bước 4: Khối `finally` thực thi:**
    * Luôn luôn chạy cuối cùng $\rightarrow$ In ra chữ **`F`**.
  * Kết hợp toàn bộ chuỗi in lại: **`TWDEF`** $\rightarrow$ Đáp án **C**.
* **Bẫy thi cần nhớ:** Tài nguyên đóng theo thứ tự LIFO; một tài nguyên ném lỗi khi close thì các tài nguyên trước đó VẪN ĐƯỢC ĐÓNG đầy đủ; ngoại lệ khi close vẫn được bắt bởi khối `catch` của câu lệnh `try`.
</details>

---

### Câu 19 (Question 19)
**Giả sử chúng ta có ba tệp thuộc tính và đoạn mã sau. Những gói tài nguyên (bundles) nào được sử dụng tương ứng tại dòng 8 và dòng 9?**

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

* A. `Dolphins.properties` và `Dolphins.properties`
* B. `Dolphins.properties` và `Dolphins_en.properties`
* C. `Dolphins_en.properties` và `Dolphins_en.properties`
* D. `Dolphins_fr.properties` và `Dolphins.properties`
* E. `Dolphins_fr.properties` và `Dolphins_en.properties`
* F. Đoạn mã không biên dịch được.
* G. Không có đáp án nào ở trên.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D (Dolphins_fr.properties và Dolphins.properties)**
* **Phân tích chi tiết:**
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
  * Vì vậy, thứ tự sử dụng là: `Dolphins_fr.properties` và `Dolphins.properties` $\rightarrow$ Đáp án **D**.
* **Bẫy thi cần nhớ:** Khi đã match được file ngôn ngữ yêu cầu, nếu thiếu key Java chỉ fallback về file Base gốc (`Base.properties`), TUYỆT ĐỐI KHÔNG fallback sang file ngôn ngữ mặc định.
</details>

---

### Câu 20 (Question 20)
**Chương trình sau in ra kết quả gì?**

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
* E. `AE` theo sau bởi một stack trace
* F. `AEBCD` theo sau bởi một stack trace
* G. `AEC` theo sau bởi một stack trace
* H. Một stack trace không kèm kết quả in nào khác

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **G (AEC theo sau bởi một stack trace)**
* **Phân tích chi tiết:**
  * Dòng 20 gọi `go()`: Dòng 3 in ra chữ **`A`**.
  * Dòng 5 gọi `stop()`: Dòng 14 in ra chữ **`E`**.
  * Dòng 16: Gọi `x.toString()` trên tham chiếu `null` $\rightarrow$ Phát sinh **`NullPointerException`**.
  * Phương thức `stop()` bị ngắt đột ngột (dòng 17 không chạy, không in `F`). Ngoại lệ bắn ngược về phương thức `go()`.
  * Khối `catch` ở dòng 6 chỉ bắt `ArithmeticException`, không khớp với `NullPointerException` $\rightarrow$ Khối catch bị bỏ qua (không in `B`).
  * Khối `finally` ở dòng 8 **luôn luôn thực thi** $\rightarrow$ Dòng 9 in ra chữ **`C`**.
  * Sau khối `finally`, vì ngoại lệ `NullPointerException` chưa được xử lý, chương trình bị sập ngay tại đây (dòng 11 không chạy, không in `D`) và in stack trace ra màn hình console.
  * Toàn bộ chuỗi in ra: `AEC` theo sau bởi stack trace của `NullPointerException` $\rightarrow$ Đáp án **G**.
* **Bẫy thi cần nhớ:** Ngoại lệ không được bắt trong `catch` thì khối `finally` vẫn chạy xong rồi chương trình mới bị dừng và xuất stack trace.
</details>

---

### Câu 21 (Question 21)
**Thay đổi nào sau đây cho phép chương trình biên dịch thành công?**

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

* A. Thêm `throws SneezeException` vào khai báo ở dòng 4.
* B. Thêm `throws Throwable` vào khai báo ở dòng 4.
* C. Thay đổi dòng 7 thành `} catch (SneezeException e) {`.
* D. Thay đổi dòng 7 thành `} catch (SniffleException e) {`.
* E. Xoá bỏ dòng 7.
* F. Đoạn mã hiện tại đã biên dịch thành công.
* G. Không có đáp án nào ở trên.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C**
* **Phân tích chi tiết:**
  * Lớp `SniffleException` kế thừa từ `SneezeException` (quan hệ con - cha).
  * Dòng 7 viết: `catch (SneezeException | SniffleException e)`.
    * Đây là cú pháp `multi-catch`.
    * **Quy tắc cốt lõi của multi-catch:** Không được phép chứa hai ngoại lệ có quan hệ kế thừa (cha - con) với nhau, vì điều đó làm cho lớp con bị dư thừa (*redundant*).
    * Do đó, dòng 7 bị **LỖI BIÊN DỊCH**.
  * **Để sửa lỗi:**
    * Nếu chọn **C**: Đổi thành `catch (SneezeException e)`. Vì `SneezeException` là lớp cha, nó có thể bắt hợp lệ ngoại lệ được ném ra từ dòng 6 (`new SneezeException()`) $\rightarrow$ Biên dịch thành công $\rightarrow$ **C đúng**.
    * Nếu chọn D: Đổi thành `catch (SniffleException e)`. Dòng 6 ném ra `SneezeException` (lớp cha), lớp con `SniffleException` không thể bắt được lớp cha, dẫn đến dòng 6 bị lỗi vì ném checked exception mà không được handle or declare.
  * Vì vậy, đáp án đúng duy nhất là **C**.
* **Bẫy thi cần nhớ:** Multi-catch cấm các ngoại lệ có quan hệ thừa kế.
</details>

---

### Câu 22 (Question 22)
**Kết quả đầu ra của đoạn mã sau là gì?**

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
* G. Không có đáp án nào ở trên

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B (30)**
* **Phân tích chi tiết:**
  * Thời gian khởi tạo: Ngày 5 tháng 4 năm 2025, lúc 12 giờ 30 phút 20 giây (`LocalDateTime`).
  * **Lệnh 1:** `book.format(DateTimeFormatter.ofPattern("m"))`  
    Ký tự `m` biểu diễn **phút (minute)**. Phút hiện tại là `30` $\rightarrow$ **In ra: `30`**.
  * **Lệnh 2:** `book.format(DateTimeFormatter.ofPattern("z"))`  
    Ký tự `z` biểu diễn **múi giờ (time zone name)**.  
    Tuy nhiên, đối tượng `book` thuộc kiểu `LocalDateTime`, **hoàn toàn không có thông tin về múi giờ** (Time Zone)!  
    Do đó, dòng này ném ra ngoại lệ **`java.time.DateTimeException`** (UnsupportedTemporalTypeException)!
  * **Xử lý ngoại lệ:** Khối `catch (Throwable e) {}` bắt được ngoại lệ này và nuốt im lặng (không làm gì cả).
  * Lệnh in thứ 3 không bao giờ được chạm tới.
  * Vì vậy, giá trị duy nhất kịp in ra màn hình là **`30`** $\rightarrow$ Đáp án **B**.
* **Bẫy thi cần nhớ:** Format ký tự `z` (time zone) trên `LocalDateTime` sẽ ném ngoại lệ vì nó không có thông tin múi giờ.
</details>

---

### Câu 23 (Question 23)
**Điền vào chỗ trống: Một lớp triển khai giao diện _________________ có thể được sử dụng trong câu lệnh `try-with-resources`. (Chọn tất cả các đáp án đúng.)**

* A. `AutoCloseable`
* B. `Resource`
* C. `Exception`
* D. `AutomaticResource`
* E. `Closeable`
* F. `RuntimeException`
* G. `Serializable`

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, E**
* **Phân tích chi tiết:**
  * Tài nguyên trong `try-with-resources` bắt buộc phải triển khai giao diện **`java.lang.AutoCloseable`** $\rightarrow$ **A đúng**.
  * Giao diện `java.io.Closeable` (dành cho các luồng I/O) kế thừa từ `AutoCloseable`. Do đó, bất kỳ lớp nào triển khai **`Closeable`** cũng gián tiếp triển khai `AutoCloseable` và hoàn toàn được dùng trong `try-with-resources` $\rightarrow$ **E đúng**.
  * Các giao diện `Resource`, `AutomaticResource` không tồn tại trong thư viện chuẩn Java.
* **Bẫy thi cần nhớ:** `AutoCloseable` (Java 7) và `Closeable` (kế thừa từ `AutoCloseable`) là 2 giao diện duy nhất được hỗ trợ trong `try-with-resources`.
</details>

---

### Câu 24 (Question 24)
**Kết quả đầu ra của chương trình sau là gì?**

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
* G. Không có đáp án nào ở trên (None of the above)

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **G (None of the above - Lỗi biên dịch)**
* **Phân tích chi tiết:**
  * Từ Java 9, bạn có thể truyền biến tài nguyên đã khai báo trước vào `try-with-resources`: `try (walk1; ...)` với **điều kiện tiên quyết: biến đó bắt buộc phải là `final` hoặc `effectively final`**!
  * Hãy nhìn xuống dòng cuối cùng của phương thức `main`:
    ```java
    walk1 = null;
    ```
  * Biến `walk1` đã bị gán lại giá trị thành `null`. Do bị gán lại, biến `walk1` **KHÔNG CÒN LÀ effectively final nữa**!
  * Vì vi phạm quy tắc effectively final, trình biên dịch báo **LỖI BIÊN DỊCH ngay tại dòng khai báo `try (walk1; ...)`**!
  * Chương trình không thể chạy được $\rightarrow$ Đáp án đúng là **G**.
  * *(Lưu ý: Nếu xoá dòng `walk1 = null;`, mã sẽ biên dịch và in ra `blizzard 2` do có 2 ngoại lệ bị nén từ 2 lần gọi close)*.
* **Bẫy thi cần nhớ:** Biến đặt trong `try-with-resources` bắt buộc phải là `final` hoặc `effectively final`. Nếu có bất kỳ phép gán lại nào ở sau, code sẽ bị lỗi biên dịch ngay lập tức!
</details>

---

### Câu 25 (Question 25)
**Giả định tiền tệ của Mỹ là đô-la ($) và tiền tệ của Đức là euro (€), kết quả đầu ra của chương trình sau là gì?**

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
* D. Đoạn mã không biên dịch được.
* E. Không có đáp án nào ở trên.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A (2,40 €)**
* **Phân tích chi tiết:**
  * Phương thức `openWallet()` gọi thiết lập Locale mặc định cho `Category.DISPLAY` và `Category.FORMAT`.
  * Tuy nhiên, dòng lệnh định dạng tiền tệ gọi trực tiếp:
    ```java
    NumberFormat.getCurrencyInstance(Locale.GERMANY).format(money);
    ```
  * Lời gọi này truyền vào một Locale tường minh là **`Locale.GERMANY`**!
  * Khi một Locale cụ thể được truyền vào factory method, Java sẽ **bỏ qua hoàn toàn Locale mặc định của hệ thống** và định dạng chính xác theo quy chuẩn của Locale được chỉ định (`GERMANY`).
  * Ở Đức, số thập phân dùng dấu phẩy `,` và ký hiệu tiền tệ euro `€` đặt ở sau: `2,40 €` $\rightarrow$ Đáp án đúng là **A**.
* **Bẫy thi cần nhớ:** Khi truyền Locale cụ thể vào `NumberFormat.getInstance(locale)`, các thiết lập `Locale.setDefault()` không còn bất kỳ tác dụng nào.
</details>

---

### Câu 26 (Question 26)
**Dòng mã nào sau đây có thể điền vào chỗ trống để đoạn mã biên dịch thành công? (Chọn tất cả các đáp án đúng.)**

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

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, F**
* **Phân tích chi tiết:**
  * Trong khối `try`, phương thức `rollOut()` chỉ ném `ClassCastException` (unchecked exception).
  * Xét các lựa chọn điền vào vị trí multi-catch:
    * **A (`IOException a`):** `IOException` là một checked exception. Vì trong `try` không có lệnh nào ném `IOException`, việc viết `catch (IOException)` sẽ bị **Lỗi biên dịch: Unreachable catch block**.
    * **B (`Error b`):** `Error` là unchecked và không có quan hệ thừa kế với `IllegalArgumentException` $\rightarrow$ Hợp lệ về mặt cú pháp $\rightarrow$ **Chọn B**.
    * **C (`NullPointerException c`):** Khai báo tên biến là `c`. Nhưng tham số của phương thức đã có `String c` $\rightarrow$ **Lỗi biên dịch: Trùng tên biến local**.
    * **D (`RuntimeException d`):** `IllegalArgumentException` kế thừa từ `RuntimeException` $\rightarrow$ Vi phạm quy tắc Disjoint types của multi-catch $\rightarrow$ Lỗi biên dịch.
    * **E (`NumberFormatException e`):** `NumberFormatException` kế thừa từ `IllegalArgumentException` $\rightarrow$ Tiếp tục vi phạm quy tắc Disjoint types $\rightarrow$ Lỗi biên dịch.
    * **F (`ClassCastException f`):** `ClassCastException` là unchecked exception, không có quan hệ cha-con với `IllegalArgumentException`, tên biến `f` không bị trùng $\rightarrow$ **Hợp lệ hoàn toàn** $\rightarrow$ **Chọn F**.
* **Bẫy thi cần nhớ:** Multi-catch cấm các ngoại lệ có quan hệ thừa kế; không được trùng tên biến đã có trong scope; không được bắt checked exception không thể xảy ra.
</details>
