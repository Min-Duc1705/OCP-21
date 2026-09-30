# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chapter 2: Operators

> **Nguồn trích dẫn:** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Trang 214–223).  
> **Số lượng:** 20 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết.  
> **Cách học:** Bạn hãy tự đọc đề và suy luận đáp án trước, sau đó bấm vào mục **"👉 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và khắc sâu các bẫy thi của Oracle.

---

### Câu 1 (Question 1)
**Toán tử nào sau đây có thể sử dụng được với các biến kiểu `boolean`? (Chọn tất cả các đáp án đúng)**

* A. `==`
* B. `+`
* C. `--`
* D. `!`
* E. `%`
* F. `-`
* G. Ép kiểu với `(boolean)`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, D, G**
* **Giải thích chuyên sâu:**
  * **A đúng (`==`):** Toán tử so sánh bằng có thể so sánh 2 giá trị `boolean` với nhau (`true == false`).
  * **D đúng (`!`):** Toán tử phủ định logic một ngôi chỉ dùng cho kiểu `boolean` (`!true` thành `false`).
  * **G đúng (`(boolean)`):** Cú pháp ép kiểu tường minh `(boolean) true` là hoàn toàn hợp lệ trong Java (dù thường dư thừa).
  * **B, C, E, F sai:** Các toán tử số học (`+`, `-`, `%`) và toán tử tăng giảm (`--`) chỉ áp dụng cho các kiểu dữ liệu số, **cấm tuyệt đối áp dụng cho kiểu `boolean`**.
</details>

---

### Câu 2 (Question 2)
**Kiểu dữ liệu nào sau đây sẽ cho phép đoạn mã sau biên dịch thành công? (Chọn tất cả các đáp án đúng)**

```java
byte apples = 5;
short oranges = 10;
____ bananas = apples + oranges;
```

* A. `int`
* B. `long`
* C. `boolean`
* D. `double`
* E. `short`
* F. `byte`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B, D**
* **Giải thích chuyên sâu:**
  * Theo **Quy tắc Thăng hạng Số học số 3 (Numeric Promotion Rule 3)**: Bất kỳ kiểu số nguyên nào nhỏ hơn `int` (`byte`, `short`, `char`) khi tham gia vào toán tử hai ngôi số học (`+`) đều **tự động bị nâng lên thành `int`** trước khi thực hiện phép tính.
  * Vì vậy, biểu thức `apples + oranges` tạo ra kết quả có kiểu dữ liệu là `int`.
  * Kiểu `int` có thể tự động gán cho chính nó (`int` - **A**), hoặc mở rộng tự động (*widening conversion*) sang các kiểu lớn hơn như `long` (**B**) hoặc `double` (**D**).
  * **E và F sai:** Kết quả là `int` không thể tự động gán ngược về `short` hay `byte` mà không ép kiểu tường minh.
  * **C sai:** Phép tính số học không thể gán cho `boolean`.
</details>

---

### Câu 3 (Question 3)
**Thay đổi nào sau đây, khi được áp dụng độc lập, sẽ cho phép đoạn mã sau biên dịch thành công? (Chọn tất cả các đáp án đúng)**

```java
3: long ear = 10;
4: int hearing = 2 * ear;
```

* A. Đoạn mã đã biên dịch bình thường mà không cần thay đổi.
* B. Ép kiểu `ear` ở dòng 4 thành `int` (`(int)ear`).
* C. Đổi kiểu dữ liệu của `ear` ở dòng 3 thành `short`.
* D. Ép kiểu cả biểu thức `2 * ear` ở dòng 4 thành `int` (`(int)(2 * ear)`).
* E. Đổi kiểu dữ liệu của `hearing` ở dòng 4 thành `short`.
* F. Đổi kiểu dữ liệu của `hearing` ở dòng 4 thành `long`.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, C, D, F**
* **Giải thích chuyên sâu:**
  * Code ban đầu không biên dịch được vì `2 * ear` là phép nhân giữa `int` và `long`, kết quả được thăng hạng lên `long`. Một giá trị `long` không thể tự động gán vào biến `int hearing` $\rightarrow$ **A sai**.
  * **B đúng:** `2 * (int)ear` là phép nhân giữa `int` và `int` $\rightarrow$ kết quả là `int`, gán vào `hearing` hợp lệ.
  * **C đúng:** Nếu `ear` là `short`, thì `2 * ear` (`int * short`) sẽ nâng `ear` lên `int`, kết quả ra `int` $\rightarrow$ gán cho `int hearing` hợp lệ.
  * **D đúng:** Ép kiểu toàn bộ biểu thức `(int)(2 * ear)` biến kết quả thành `int` $\rightarrow$ hợp lệ.
  * **F đúng:** Đổi kiểu `long hearing = 2 * ear;` $\rightarrow$ chứa vừa giá trị `long` $\rightarrow$ hợp lệ.
  * **E sai:** Đổi sang `short` càng làm kiểu nhận nhỏ hơn `int`, gây lỗi biên dịch nghiêm trọng hơn.
</details>

---

### Câu 4 (Question 4)
**Output của đoạn code sau là gì?**

```java
3: boolean canine = true, wolf = true;
4: int teeth = 20;
5: canine = (teeth != 10) ^ (wolf = false);
6: System.out.println(canine + ", " + teeth + ", " + wolf);
```

* A. `true, 20, true`
* B. `true, 20, false`
* C. `false, 10, true`
* D. `false, 20, false`
* E. Code không biên dịch được do dòng 5.
* F. Không có phương án nào đúng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B (`true, 20, false`)**
* **Giải thích chuyên sâu:**
  * **Dòng 5:** Phân tích biểu thức `(teeth != 10) ^ (wolf = false)`:
    * Vế trái: `teeth != 10` $\rightarrow$ `20 != 10` trả về `true`.
    * Vế phải: `(wolf = false)` là một **phép gán**, gán giá trị `false` cho biến `wolf`, đồng thời biểu thức này trả về giá trị vừa gán là `false`.
    * Phép toán XOR (`^`): `true ^ false` $\rightarrow$ Hai giá trị khác nhau thì XOR trả về `true`. Do đó `canine = true`.
  * Sau dòng 5:
    * `canine` là `true`.
    * `teeth` không hề bị thay đổi, vẫn là `20`.
    * `wolf` đã bị gán thành `false`.
  * Khi in ra: `true, 20, false`.
</details>

---

### Câu 5 (Question 5)
**Những dãy toán tử nào sau đây được sắp xếp theo thứ tự độ ưu tiên TĂNG DẦN HOẶC BẰNG NHAU (Increasing or same order of precedence)? Giả sử dấu `+` là phép cộng hai ngôi, không phải một ngôi. (Chọn tất cả các đáp án đúng)**

* A. `+`, `*`, `%`, `--`
* B. `++`, `(int)`, `*`
* C. `=`, `==`, `!`
* D. `(short)`, `=`, `!`, `*`
* E. `*`, `/`, `%`, `+`, `==`
* F. `!`, `||`, `&`
* G. `^`, `+`, `=`, `+=`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C**
* **Giải thích chuyên sâu:**
  * Đề bài yêu cầu thứ tự **Tăng dần hoặc bằng nhau** (thấp đứng trước, cao đứng sau):
  * **A đúng:** `+` (ưu tiên mức 5) $\rightarrow$ `*` và `%` (cùng mức 4) $\rightarrow$ `--` (tiền tố/hậu tố mức 1–2). Đi từ thấp lên cao $\rightarrow$ Tăng dần.
  * **C đúng:** `=` (phép gán mức 15 - thấp nhất) $\rightarrow$ `==` (so sánh mức 8) $\rightarrow$ `!` (phủ định một ngôi mức 3). Đi từ thấp lên cao $\rightarrow$ Tăng dần.
  * **B sai:** `++` (mức 1) $\rightarrow$ `(int)` (mức 3) $\rightarrow$ `*` (mức 4) $\rightarrow$ Đây là thứ tự **giảm dần**!
  * **E sai:** `*`, `/`, `%` (mức 4) $\rightarrow$ `+` (mức 5) $\rightarrow$ `==` (mức 8) $\rightarrow$ Đây là thứ tự **giảm dần**!
  * **D, F, G sai:** Thứ tự lộn xộn không tăng dần cũng không giảm dần.
</details>

---

### Câu 6 (Question 6)
**Output của chương trình sau là gì?**

```java
1: public class CandyCounter {
2:    static long addCandy(double fruit, float vegetables) {
3:       return (int)fruit + vegetables;
4:    }
5:    
6:    public static void main(String[] args) {
7:       System.out.print(addCandy(1.4, 2.4f) + ", ");
8:       System.out.print(addCandy(1.9, (float)4) + ", ");
9:       System.out.print(addCandy((long)(int)(short)2, (float)4));
10:   }
11: }
```

* A. `4, 6, 6.0`
* B. `3, 5, 6`
* C. `3, 6, 6`
* D. `4, 5, 6`
* E. Code không biên dịch được do dòng 9.
* F. Không có phương án nào đúng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (Không có phương án nào đúng - Vì code KHÔNG BIÊN DỊCH ĐƯỢC tại dòng 3)**
* **Giải thích chuyên sâu:**
  * ⚠️ **Bẫy thứ tự ưu tiên của ép kiểu một ngôi:**
    Tại dòng 3: `return (int)fruit + vegetables;`
    * Do toán tử ép kiểu `(int)` có độ ưu tiên cao hơn phép cộng `+`, nên dấu `(int)` chỉ ép riêng cho biến `fruit` (biến `fruit` thành kiểu `int`).
    * Sau đó, biểu thức trở thành `(int) + vegetables` (`int + float`). Theo Quy tắc Thăng hạng Số học số 2, kết quả của phép cộng này được thăng hạng thành **`float`**.
    * Hàm `addCandy` khai báo kiểu trả về là **`long`**. Một giá trị kiểu `float` **không thể tự động chuyển đổi thành `long`** mà không ép kiểu tường minh!
    * Trình biên dịch báo lỗi tại dòng 3: `incompatible types: possible loss of precision from float to long`.
  * Vì vậy chương trình không biên dịch được $\rightarrow$ **F là đáp án đúng**.
  * *(Nếu sửa dòng 3 thành `return (long)(fruit + vegetables);` thì chương trình sẽ in ra `3, 5, 6` tương ứng với đáp án B).*
</details>

---

### Câu 7 (Question 7)
**Output của đoạn code sau là gì?**

```java
int ph = 7, vis = 2;
boolean clear = vis > 1 & (vis < 9 || ph < 2);
boolean safe = (vis > 2) && (ph++ > 1);
boolean tasty = 7 <= --ph;
System.out.println(clear + "-" + safe + "-" + tasty);
```

* A. `true-true-true`
* B. `true-true-false`
* C. `true-false-true`
* D. `true-false-false`
* E. `false-true-true`
* F. `false-true-false`
* G. `false-false-true`
* H. `false-false-false`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D (`true-false-false`)**
* **Giải thích chuyên sâu:**
  * **Biểu thức 1 (`clear`):**
    `vis > 1 & (vis < 9 || ph < 2)` $\rightarrow$ `2 > 1 & (2 < 9 || 7 < 2)` $\rightarrow$ `true & (true || false)` $\rightarrow$ `true & true` $\rightarrow$ `true`.
  * **Biểu thức 2 (`safe`):**
    `(vis > 2) && (ph++ > 1)` $\rightarrow$ Vế trái: `vis > 2` (`2 > 2`) là `false`.
    * Vì toán tử là `&&` (đoản mạch) và vế trái là `false`, JVM **bỏ qua hoàn toàn vế phải**!
    * Lệnh `ph++` không được chạy $\rightarrow$ `ph` **vẫn giữ nguyên giá trị là 7**.
    * `safe = false`.
  * **Biểu thức 3 (`tasty`):**
    `7 <= --ph` $\rightarrow$ Toán tử tiền tố `--ph` giảm `ph` từ 7 xuống **6** ngay lập tức.
    * So sánh: `7 <= 6` là **`false`**.
    * `tasty = false`.
  * Kết quả in ra: `true-false-false`.
</details>

---

### Câu 8 (Question 8)
**Output của đoạn code sau là gì?**

```java
4: int pig = (short)4;
5: pig = pig++;
6: long goat = (int)2;
7: goat -= 1.0;
8: System.out.print(pig + " - " + goat);
```

* A. `4 - 1`
* B. `4 - 2`
* C. `5 - 1`
* D. `5 - 2`
* E. Code không biên dịch được do dòng 7.
* F. Không có phương án nào đúng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A (`4 - 1`)**
* **Giải thích chuyên sâu:**
  * **Dòng 5 (`pig = pig++;`):** Đây là một bẫy kinh điển về hậu tố:
    1. Toán tử hậu tố `pig++` trả về giá trị hiện tại của `pig` là **`4`** để phục vụ phép gán.
    2. Sau đó `pig` được tăng lên thành 5 trong bộ nhớ.
    3. Ngay lập tức phép gán `=` gán giá trị trả về trước đó (**`4`**) đè trở lại vào `pig`!
    4. Kết quả cuối cùng: `pig` vẫn giữ nguyên giá trị là **`4`**.
  * **Dòng 7 (`goat -= 1.0;`):**
    * Toán tử gán phức hợp `-=` tự động ép kiểu ngầm định: `goat = (long)(goat - 1.0);`.
    * `goat` từ 2 giảm đi 1 còn **`1`**. Code biên dịch hoàn toàn hợp lệ.
  * Khi in ra: `4 - 1`.
</details>

---

### Câu 9 (Question 9)
**Các giá trị DUY NHẤT (unique outputs) nào sẽ được in ra bởi đoạn code sau? (Chọn tất cả các đáp án đúng)**

```java
int a = 2, b = 4, c = 2;
System.out.println(a > 2 ? --c : b++);
System.out.println(b = (a != c ? a : b++));
System.out.println(a > b ? b < c ? b : 2 : 1);
```

* A. `1`
* B. `2`
* C. `3`
* D. `4`
* E. `5`
* F. `6`
* G. Code không biên dịch được.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, D, E (In ra các giá trị: 4, 5, 1)**
* **Giải thích chuyên sâu:**
  1. **Lệnh 1:** `a > 2 ? --c : b++` $\rightarrow$ `2 > 2` là `false`.
     * Nhánh `b++` được thực thi. Do là hậu tố, giá trị cũ của `b` là **`4`** được trả về và in ra màn hình (**In ra: 4**).
     * Sau đó `b` tăng lên thành `5`. Biến `c` không bị suy giảm vì chỉ có 1 nhánh được chạy (`c` vẫn là 2).
  2. **Lệnh 2:** `b = (a != c ? a : b++)` $\rightarrow$ `a != c` (`2 != 2`) là `false`.
     * Nhánh `b++` được thực thi. Lúc này `b` đang là 5, hậu tố trả về giá trị **`5`**.
     * Phép gán `b = 5` gán đè lại giá trị 5 vào `b`. Màn hình **in ra: 5**.
  3. **Lệnh 3:** `a > b ? b < c ? b : 2 : 1`
     * Viết lại có ngoặc: `(a > b) ? (b < c ? b : 2) : 1`.
     * Điều kiện `a > b` (`2 > 5`) là `false`.
     * Nhánh sau cùng được chọn trả về trực tiếp giá trị **`1`** (**In ra: 1**). Biểu thức ba ngôi bên trong không hề bị đánh giá.
  * Tập hợp các giá trị duy nhất in ra là: `{4, 5, 1}` $\rightarrow$ **Đáp án A, D, E**.
</details>

---

### Câu 10 (Question 10)
**Giá trị nào sau đây KHÔNG PHẢI là output của đoạn code dưới đây?**

```java
short height = 1, weight = 3;
short zebra = (byte) weight * (byte) height;
double ox = 1 + height * 2 + weight;
long giraffe = 1 + 9 % height + 1;
System.out.println(zebra);
System.out.println(ox);
System.out.println(giraffe);
```

* A. `2`
* B. `3`
* C. `6`
* D. `6.0`
* E. Code không biên dịch được.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (Code không biên dịch được)**
* **Giải thích chuyên sâu:**
  * Đề bài hỏi giá trị nào **không phải** là output.
  * Xét dòng 2: `short zebra = (byte) weight * (byte) height;`
    * Dù cả `weight` và `height` đều được ép kiểu về `byte`, nhưng khi gặp toán tử nhân hai ngôi `*`, cả hai toán hạng đều bị tự động thăng hạng lên thành **`int`** (Quy tắc 3).
    * Phép nhân trả về kiểu `int`, không thể tự động gán vào biến `short zebra` nếu không ép kiểu cả cụm `(short)`.
    * Trình biên dịch báo lỗi: `incompatible types: possible loss of precision from int to short`.
  * Vì code không chạy được nên **E là đáp án chính xác**.
</details>

---

### Câu 11 (Question 11)
**Output của đoạn code sau là gì?**

```java
11: int sample1 = (2 * 4) % 3;
12: int sample2 = 3 * 2 % -3;
13: int sample3 = 5 * (1 % 2);
14: System.out.println(sample1 + ", " + sample2 + ", " + sample3);
```

* A. `0, 0, 5`
* B. `1, 2, 10`
* C. `2, 1, 5`
* D. `2, 0, 5`
* E. `3, 1, 10`
* F. `3, 2, 6`
* G. Code không biên dịch được.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D (`2, 0, 5`)**
* **Giải thích chuyên sâu:**
  * `sample1 = (2 * 4) % 3` $\rightarrow$ `8 % 3 = 2` (8 chia 3 được 2 dư 2).
  * `sample2 = 3 * 2 % -3`:
    * `*` và `%` cùng mức ưu tiên, tính từ trái sang phải: `3 * 2 = 6`.
    * `6 % -3`: Phép chia dư với số âm bên phải thì dấu âm bị bỏ qua $\rightarrow$ tương đương `6 % 3 = 0`.
  * `sample3 = 5 * (1 % 2)`:
    * `1 % 2 = 1` (1 chia 2 được 0 dư 1).
    * `5 * 1 = 5`.
  * In ra: `2, 0, 5`.
</details>

---

### Câu 12 (Question 12)
**Điền vào chỗ trống: Toán tử _________ tăng giá trị lên 1 và trả về giá trị ban đầu (gốc), trong khi toán tử _______ giảm giá trị đi 1 và trả về giá trị mới sau khi giảm.**

* A. post-increment, post-increment
* B. pre-decrement, post-decrement
* C. post-increment, post-decrement
* D. post-increment, pre-decrement
* E. pre-increment, pre-decrement
* F. pre-increment, post-decrement

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D (`post-increment, pre-decrement`)**
* **Giải thích chuyên sâu:**
  * **Hậu tố tăng (Post-increment - `x++`):** Tăng biến lên 1 nhưng trả về giá trị ban đầu trước khi tăng (*original value*).
  * **Tiền tố giảm (Pre-decrement - `--x`):** Giảm biến đi 1 và trả về giá trị mới ngay sau khi giảm (*new value*).
</details>

---

### Câu 13 (Question 13)
**Output của đoạn code sau là gì?**

```java
boolean sunny = true, raining = false, sunday = true;
boolean goingToTheStore = sunny & raining ^ sunday;
boolean goingToTheZoo = sunday && !raining;
boolean stayingHome = !(goingToTheStore && goingToTheZoo);
System.out.println(goingToTheStore + "-" + goingToTheZoo + "-" + stayingHome);
```

* A. `true-false-false`
* B. `false-true-false`
* C. `true-true-true`
* D. `false-true-true`
* E. `false-false-false`
* F. `true-true-false`
* G. Không có phương án nào đúng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F (`true-true-false`)**
* **Giải thích chuyên sâu:**
  * **`goingToTheStore = sunny & raining ^ sunday;`**:
    * Thứ tự ưu tiên: Toán tử `&` (AND - mức 9) có độ ưu tiên cao hơn `^` (XOR - mức 10).
    * Thực hiện `sunny & raining` trước: `true & false = false`.
    * Sau đó thực hiện XOR: `false ^ sunday` $\rightarrow$ `false ^ true = true`.
    * Vậy `goingToTheStore = true`.
  * **`goingToTheZoo = sunday && !raining;`**:
    * `!raining` $\rightarrow$ `!false = true`.
    * `sunday && true` $\rightarrow$ `true && true = true`.
    * Vậy `goingToTheZoo = true`.
  * **`stayingHome = !(goingToTheStore && goingToTheZoo);`**:
    * `!(true && true)` $\rightarrow$ `!true = false`.
  * Kết quả in ra: `true-true-false`.
</details>

---

### Câu 14 (Question 14)
**Các phát biểu nào sau đây là chính xác? (Chọn tất cả các đáp án đúng)**

* A. Giá trị trả về của một biểu thức gán (assignment operation) có thể là `void`.
* B. Toán tử so sánh khác (`!=`) có thể dùng để so sánh các đối tượng (objects).
* C. Toán tử so sánh bằng (`==`) có thể dùng để so sánh một giá trị `boolean` với một giá trị số.
* D. Khi thực thi, các toán tử `&` và `|` có thể chỉ đánh giá duy nhất vế bên trái của biểu thức.
* E. Giá trị trả về của một biểu thức gán chính là giá trị của biến vừa được gán mới.
* F. Trong Java, số `0` và giá trị `false` có thể sử dụng thay thế cho nhau.
* G. Toán tử phủ định logic (`!`) không thể dùng để đổi dấu các giá trị số.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, E, G**
* **Giải thích chuyên sâu:**
  * **B đúng:** Toán tử `==` và `!=` dùng để so sánh địa chỉ tham chiếu giữa 2 đối tượng.
  * **E đúng:** Biểu thức gán `(x = 5)` trả về giá trị `5`.
  * **G đúng:** Toán tử `!` chỉ dùng cho `boolean`, muốn đổi dấu số phải dùng toán tử âm một ngôi `-`.
  * **A sai:** Biểu thức gán luôn trả về kiểu dữ liệu của biến được gán, không bao giờ trả về `void`.
  * **C sai:** Không thể so sánh `boolean == number` (ví dụ `true == 3` bị lỗi biên dịch).
  * **D sai:** `&` và `|` là toán tử logic không đoản mạch, chúng **luôn luôn đánh giá cả 2 vế**.
  * **F sai:** Java là ngôn ngữ định kiểu tĩnh an toàn, không có chuyện coi số 0 là false như C/C++.
</details>

---

### Câu 15 (Question 15)
**Toán tử nào sau đây nhận đúng 3 toán hạng (three operands)?**

* A. `=`
* B. `&&`
* C. `*=`
* D. `? :`
* E. `&`
* F. `++`
* G. `/`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D (`? :`)**
* **Giải thích chuyên sâu:**
  * Toán tử ba ngôi (*Ternary operator*) `booleanExpr ? expr1 : expr2` là toán tử duy nhất trong Java nhận đúng 3 toán hạng.
  * Các phương án A, B, C, E, G là toán tử hai ngôi (*binary*). F là toán tử một ngôi (*unary*).
</details>

---

### Câu 16 (Question 16)
**Có bao nhiêu dòng trong đoạn mã dưới đây chứa lỗi biên dịch (compiler errors)?**

```java
int note = 1 * 2 + (long)3;
short melody = (byte)(double)(note *= 2);
double song = melody;
float symphony = (float)((song == 1_000f) ? song * 2L : song);
```

* A. 0 dòng
* B. 1 dòng
* C. 2 dòng
* D. 3 dòng
* E. 4 dòng

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B (Chỉ có duy nhất 1 dòng bị lỗi biên dịch - Dòng 1)**
* **Giải thích chuyên sâu:**
  * **Dòng 1 bị lỗi:** `1 * 2 + (long)3`. Do có `(long)3`, toàn bộ phép cộng được thăng hạng thành `long`. Gán giá trị `long` cho biến `int note` gây lỗi: `incompatible types: possible loss of precision`.
  * **Dòng 2 hợp lệ:** `note *= 2` trả về `int`, sau đó ép sang `double`, rồi ép sang `byte`. Cuối cùng gán `byte` cho `short melody` là mở rộng hợp lệ.
  * **Dòng 3 hợp lệ:** Gán `short` sang `double` là mở rộng tự nhiên.
  * **Dòng 4 hợp lệ:** Toán tử ba ngôi trả về kiểu số, sau đó được ép tường minh sang `(float)`.
  * Tổng cộng: đúng 1 dòng lỗi $\rightarrow$ **Đáp án B**.
</details>

---

### Câu 17 (Question 17)
**Sau khi thực thi đoạn code sau, giá trị của các biến là bao nhiêu? (Chọn tất cả các đáp án đúng)**

```java
int ticketsTaken = 1;
int ticketsSold = 3;
ticketsSold += 1 + ticketsTaken++;
ticketsTaken *= 2;
ticketsSold += (long)1;
```

* A. `ticketsSold` là 8.
* B. `ticketsTaken` là 2.
* C. `ticketsSold` là 6.
* D. `ticketsTaken` là 6.
* E. `ticketsSold` là 7.
* F. `ticketsTaken` là 4.
* G. Đoạn code không biên dịch được.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, F (`ticketsSold = 6`, `ticketsTaken = 4`)**
* **Giải thích chuyên sâu:**
  * Ban đầu: `ticketsTaken = 1`, `ticketsSold = 3`.
  * **Dòng 3:** `ticketsSold += 1 + ticketsTaken++;`
    * `ticketsTaken++` là hậu tố: trả về giá trị cũ là `1`, sau đó `ticketsTaken` tăng lên thành `2`.
    * Vế phải: `1 + 1 = 2`.
    * `ticketsSold += 2` $\rightarrow$ `ticketsSold = 3 + 2 = 5`.
  * **Dòng 4:** `ticketsTaken *= 2;`
    * `ticketsTaken = 2 * 2 = 4`.
  * **Dòng 5:** `ticketsSold += (long)1;`
    * Nhờ tính năng tự động ép kiểu của compound assignment `+=`, dòng này hoàn toàn hợp lệ mà không bị lỗi biên dịch kiểu số.
    * `ticketsSold = 5 + 1 = 6`.
  * Kết quả cuối cùng: `ticketsTaken = 4` (**F**) và `ticketsSold = 6` (**C**).
</details>

---

### Câu 18 (Question 18)
**Cặp ký hiệu nào sau đây có thể được sử dụng để thay đổi thứ tự ưu tiên thực thi các toán tử trong một biểu thức?**

* A. `[ ]`
* B. `< >`
* C. `( )`
* D. `\ /`
* E. `{ }`
* F. `" "`

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C (`( )`)**
* **Giải thích chuyên sâu:**
  * Trong Java, **chỉ có duy nhất cặp dấu ngoặc đơn `( )`** mới có chức năng ghi đè và thay đổi thứ tự ưu tiên của các toán tử trong biểu thức tính toán.
  * `[ ]` dùng cho mảng, `< >` dùng cho Generics / toán tử quan hệ, `{ }` dùng cho khối code block.
</details>

---

### Câu 19 (Question 19)
**Kết quả của việc thực thi đoạn mã nguồn sau là gì? (Chọn tất cả các đáp án đúng)**

```java
3: int start = 7;
4: int end = 4;
5: end += ++start;
6: start = (byte)(Byte.MAX_VALUE + 1);
```

* A. `start` là 0.
* B. `start` là -128.
* C. `start` là 127.
* D. `end` là 8.
* E. `end` là 11.
* F. `end` là 12.
* G. Đoạn code không biên dịch được.
* H. Đoạn code biên dịch được nhưng ném ngoại lệ tại runtime.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, F (`start = -128`, `end = 12`)**
* **Giải thích chuyên sâu:**
  * **Dòng 5:** `end += ++start;`
    * Tiền tố `++start` tăng `start` từ 7 lên `8` và trả về `8`.
    * `end += 8` $\rightarrow$ `end = 4 + 8 = 12` (**Đáp án F**).
  * **Dòng 6:** `start = (byte)(Byte.MAX_VALUE + 1);`
    * Hằng số `Byte.MAX_VALUE` có giá trị là `127`.
    * `127 + 1 = 128` (kiểu `int`).
    * Khi ép sang `(byte)128`, vượt quá giới hạn cực đại của kiểu `byte` (miền giá trị từ `-128` đến `127`). Hiện tượng tràn số (*overflow*) xảy ra: giá trị quay vòng về cực tiểu là **`-128`** (**Đáp án B**).
</details>

---

### Câu 20 (Question 20)
**Những phát biểu nào sau đây về các toán tử một ngôi (unary operators) là đúng? (Chọn tất cả các đáp án đúng)**

* A. Toán tử một ngôi luôn được thực thi trước bất kỳ toán tử số học hai ngôi hoặc toán tử ba ngôi xung quanh nó.
* B. Toán tử `-` có thể dùng để đảo ngược một giá trị `boolean`.
* C. Toán tử tiền tố tăng (`++x`) trả về giá trị của biến trước khi phép tăng được áp dụng.
* D. Toán tử hậu tố giảm (`x--`) trả về giá trị của biến trước khi phép giảm được áp dụng.
* E. Toán tử `!` không thể sử dụng trên các giá trị số học.
* F. Không có phương án nào đúng.

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, D, E**
* **Giải thích chuyên sâu:**
  * **A đúng:** Theo bảng thứ tự ưu tiên (Table 2.1), toán tử một ngôi nằm ở mức ưu tiên 1, 2, 3 (cao hơn toán tử hai ngôi số học mức 4, 5 và toán tử ba ngôi mức 14).
  * **D đúng:** Toán tử hậu tố (`x--`) trả về giá trị ban đầu trước khi giảm.
  * **E đúng:** Toán tử `!` chỉ dành riêng cho `boolean`, áp dụng lên số học sẽ gây lỗi biên dịch.
  * **B sai:** Toán tử `-` chỉ dùng cho số học, đảo boolean phải dùng `!`.
  * **C sai:** Tiền tố `++x` trả về giá trị mới **sau khi** tăng, không phải trước khi tăng.
</details>
