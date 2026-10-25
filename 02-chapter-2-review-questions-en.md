# Review Questions (Bộ Câu Hỏi Ôn Tập Tiếng Anh) - Chapter 2: Operators

> **Source (Nguồn trích dẫn):** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Pages 214–223).  
> **Total Questions (Số lượng):** 20 original English multiple-choice questions with official English & detailed Vietnamese explanations.  
> **How to study (Cách học):** Read the verbatim English question and select your answer first, then click **"👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)"** to check the official answer and master exam traps.

---

### Question 1 (Câu 1)
**Which of the following Java operators can be used with `boolean` variables? (Choose all that apply.)**

* A. `==`
* B. `+`
* C. `--`
* D. `!`
* E. `%`
* F. `-`
* G. Cast with `(boolean)`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, D, G**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Option A is the equality operator and can be used on primitives and object references. Options B and C are both arithmetic operators and cannot be applied to a `boolean` value. Option D is the logical complement operator and is used exclusively with `boolean` values. Option E is the modulus operator, which can be used only with numeric primitives. Option F is a negation/subtraction operator and can be applied only to numeric values. Finally, option G is correct, as you can cast a `boolean` variable since `boolean` is a type.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A đúng (`==`):** Toán tử so sánh bằng có thể so sánh 2 giá trị `boolean` với nhau (`true == false`).
    * **D đúng (`!`):** Toán tử phủ định logic một ngôi chỉ dùng cho kiểu `boolean` (`!true` thành `false`).
    * **G đúng (`(boolean)`):** Cú pháp ép kiểu tường minh `(boolean) true` là hoàn toàn hợp lệ trong Java (dù thường dư thừa).
    * **B, C, E, F sai:** Các toán tử số học (`+`, `-`, `%`) và toán tử tăng giảm (`--`) chỉ áp dụng cho các kiểu dữ liệu số, **cấm tuyệt đối áp dụng cho kiểu `boolean`**.
</details>

---

### Question 2 (Câu 2)
**What data type (or types) will allow the following code snippet to compile? (Choose all that apply.)**

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
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, B, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The expression `apples + oranges` is automatically promoted to `int`, so `int` and data types that can be promoted automatically from `int` will work, making options A, B, and D correct. Option C will not work because `boolean` is not a numeric data type. Options E and F will not work without an explicit cast to a smaller data type.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Theo **Quy tắc Thăng hạng Số học số 3 (Numeric Promotion Rule 3)**: Bất kỳ kiểu số nguyên nào nhỏ hơn `int` (`byte`, `short`, `char`) khi tham gia vào toán tử hai ngôi số học (`+`) đều **tự động bị nâng lên thành `int`** trước khi thực hiện phép tính.
    * Vì vậy, biểu thức `apples + oranges` tạo ra kết quả có kiểu dữ liệu là `int`.
    * Kiểu `int` có thể tự động gán cho chính nó (`int` - **A**), hoặc mở rộng tự động (*widening conversion*) sang các kiểu lớn hơn như `long` (**B**) hoặc `double` (**D**).
    * **E và F sai:** Kết quả là `int` không thể tự động gán ngược về `short` hay `byte` mà không ép kiểu tường minh.
    * **C sai:** Phép tính số học không thể gán cho `boolean`.
</details>

---

### Question 3 (Câu 3)
**What change, when applied independently, would allow the following code snippet to compile? (Choose all that apply.)**

```java
3: long ear = 10;
4: int hearing = 2 * ear;
```

* A. No change; it compiles as is.
* B. Cast `ear` on line 4 to `int`.
* C. Change the data type of `ear` on line 3 to `short`.
* D. Cast `2 * ear` on line 4 to `int`.
* E. Change the data type of `hearing` on line 4 to `short`.
* F. Change the data type of `hearing` on line 4 to `long`.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, C, D, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code will not compile as is, so option A is not correct. The value `2 * ear` is automatically promoted to `long` and cannot be automatically stored in `hearing`, which is an `int` value. Options B, C, and D solve this problem by reducing the `long` value to `int`. Option E does not solve the problem and actually makes it worse by attempting to place the value in a smaller data type. Option F solves the problem by increasing the data type of the declaration so that `long` is allowed.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Code ban đầu không biên dịch được vì `2 * ear` là phép nhân giữa `int` và `long`, kết quả được thăng hạng lên `long`. Một giá trị `long` không thể tự động gán vào biến `int hearing` → **A sai**.
    * **B đúng:** `2 * (int)ear` là phép nhân giữa `int` và `int` → kết quả là `int`, gán vào `hearing` hợp lệ.
    * **C đúng:** Nếu `ear` là `short`, thì `2 * ear` (`int * short`) sẽ nâng `ear` lên `int`, kết quả ra `int` → gán cho `int hearing` hợp lệ.
    * **D đúng:** Ép kiểu toàn bộ biểu thức `(int)(2 * ear)` biến kết quả thành `int` → hợp lệ.
    * **F đúng:** Đổi kiểu `long hearing = 2 * ear;` → chứa vừa giá trị `long` → hợp lệ.
    * **E sai:** Đổi sang `short` càng làm kiểu nhận nhỏ hơn `int`, gây lỗi biên dịch nghiêm trọng hơn.
</details>

---

### Question 4 (Câu 4)
**What is the output of the following code snippet?**

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
* E. The code will not compile because of line 5.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B (`true, 20, false`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles and runs without issue, so option E is not correct. This example is tricky because of the second assignment operator embedded in line 5. The expression `(wolf=false)` assigns the value `false` to `wolf` and returns `false` for the entire expression. Since `teeth` does not equal `10`, the left side returns `true`; therefore, the exclusive or (`^`) of the entire expression assigned to `canine` is `true`. The output reflects these assignments, with no change to `teeth`, so option B is the only correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Dòng 5:** Phân tích biểu thức `(teeth != 10) ^ (wolf = false)`:
      * Vế trái: `teeth != 10` → `20 != 10` trả về `true`.
      * Vế phải: `(wolf = false)` là một **phép gán**, gán giá trị `false` cho biến `wolf`, đồng thời biểu thức này trả về giá trị vừa gán là `false`.
      * Phép toán XOR (`^`): `true ^ false` → Hai giá trị khác nhau thì XOR trả về `true`. Do đó `canine = true`.
    * Sau dòng 5:
      * `canine` là `true`.
      * `teeth` không hề bị thay đổi, vẫn là `20`.
      * `wolf` đã bị gán thành `false`.
    * Khi in ra: `true, 20, false`.
</details>

---

### Question 5 (Câu 5)
**Which of the following operators are ranked in increasing or the same order of precedence? Assume the `+` operator is binary addition, not the unary form. (Choose all that apply.)**

* A. `+`, `*`, `%`, `--`
* B. `++`, `(int)`, `*`
* C. `=`, `==`, `!`
* D. `(short)`, `=`, `!`, `*`
* E. `*`, `/`, `%`, `+`, `==`
* F. `!`, `||`, `&`
* G. `^`, `+`, `=`, `+=`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Options A and C are correct, as they show operators in increasing or the same order of precedence. Options B and E are in decreasing or the same order of precedence. Options D, F, and G are in neither increasing nor decreasing order of precedence. In option D, the assignment operator (`=`) is between two unary operators, with the multiplication operator (`*`) incorrectly being in place of highest precedence. In option F, the logical complement operator (`!`) has the highest order of precedence, so it should be last. In option G, the assignment operators have the lowest order of precedence, not the highest, so the last two operators should be first.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Đề bài yêu cầu thứ tự **Tăng dần hoặc bằng nhau** (thấp đứng trước, cao đứng sau):
    * **A đúng:** `+` (ưu tiên mức 5) → `*` và `%` (cùng mức 4) → `--` (tiền tố/hậu tố mức 1–2). Đi từ thấp lên cao → Tăng dần.
    * **C đúng:** `=` (phép gán mức 15 - thấp nhất) → `==` (so sánh mức 8) → `!` (phủ định một ngôi mức 3). Đi từ thấp lên cao → Tăng dần.
    * **B sai:** `++` (mức 1) → `(int)` (mức 3) → `*` (mức 4) → Đây là thứ tự **giảm dần**!
    * **E sai:** `*`, `/`, `%` (mức 4) → `+` (mức 5) → `==` (mức 8) → Đây là thứ tự **giảm dần**!
    * **D, F, G sai:** Thứ tự lộn xộn không tăng dần cũng không giảm dần.
</details>

---

### Question 6 (Câu 6)
**What is the output of the following program?**

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
* E. The code does not compile because of line 9.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F (None of the above - compilation error on line 3)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code does not compile because line 3 contains a compilation error. The cast `(int)` is applied to `fruit`, not the expression `fruit+vegetables`. Since the cast operator has a higher operator precedence than the addition operator, it is applied to `fruit`, but the expression is promoted to a `float`, due to `vegetables` being `float`. The result cannot be returned as `long` in the `addCandy()` method without a cast. For this reason, option F is correct. If parentheses were added around `fruit+vegetables`, then the output would be `3, 5, 6`, and option B would be correct. Remember that casting floating-point numbers to integral values results in truncation, not rounding.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * ⚠️ **Bẫy thứ tự ưu tiên của ép kiểu một ngôi:**
      Tại dòng 3: `return (int)fruit + vegetables;`
      * Do toán tử ép kiểu `(int)` có độ ưu tiên cao hơn phép cộng `+`, nên dấu `(int)` chỉ ép riêng cho biến `fruit` (biến `fruit` thành kiểu `int`).
      * Sau đó, biểu thức trở thành `(int) + vegetables` (`int + float`). Theo Quy tắc Thăng hạng Số học số 2, kết quả của phép cộng này được thăng hạng thành **`float`**.
      * Hàm `addCandy` khai báo kiểu trả về là **`long`**. Một giá trị kiểu `float` **không thể tự động chuyển đổi thành `long`** mà không ép kiểu tường minh!
      * Trình biên dịch báo lỗi tại dòng 3: `incompatible types: possible loss of precision from float to long`.
    * Vì vậy chương trình không biên dịch được → **F là đáp án đúng**.
    * *(Nếu sửa dòng 3 thành `return (long)(fruit + vegetables);` thì chương trình sẽ in ra `3, 5, 6` tương ứng với đáp án B).*
</details>

---

### Question 7 (Câu 7)
**What is the output of the following code snippet?**

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
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D (`true-false-false`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** In the first boolean expression, `vis` is `2` and `ph` is `7`, so this expression evaluates to `true & (true || false)`, which reduces to `true`. The second boolean expression uses the conditional operator, and since `(vis > 2)` is `false`, the right side is not evaluated, leaving `ph` at `7`. In the last assignment, `ph` is `7`, and the pre-decrement operator is applied first, reducing the expression to `7 <= 6` and resulting in an assignment of `false`. For these reasons, option D is the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Biểu thức 1 (`clear`):**
      `vis > 1 & (vis < 9 || ph < 2)` → `2 > 1 & (2 < 9 || 7 < 2)` → `true & (true || false)` → `true & true` → `true`.
    * **Biểu thức 2 (`safe`):**
      `(vis > 2) && (ph++ > 1)` → Vế trái: `vis > 2` (`2 > 2`) là `false`.
      * Vì toán tử là `&&` (đoản mạch) và vế trái là `false`, JVM **bỏ qua hoàn toàn vế phải**!
      * Lệnh `ph++` không được chạy → `ph` **vẫn giữ nguyên giá trị là 7**.
      * `safe = false`.
    * **Biểu thức 3 (`tasty`):**
      `7 <= --ph` → Toán tử tiền tố `--ph` giảm `ph` từ 7 xuống **6** ngay lập tức.
      * So sánh: `7 <= 6` là **`false`**.
      * `tasty = false`.
    * Kết quả in ra: `true-false-false`.
</details>

---

### Question 8 (Câu 8)
**What is the output of the following code snippet?**

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
* E. The code does not compile due to line 7.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A (`4 - 1`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles and runs without issue, so option E is incorrect. Line 7 does not produce a compilation error since the compound operator applies casting automatically. Line 5 increments `pig` by `1`, but it returns the original value of `4` since it is using the post-increment operator. The `pig` variable is then assigned this value, and the increment operation is discarded. Line 7 just reduces the value of `goat` by `1`, resulting in an output of `4 - 1` and making option A the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
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

### Question 9 (Câu 9)
**What are the unique outputs of the following code snippet? (Choose all that apply.)**

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
* G. The code does not compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, D, E (Outputs: `4`, `5`, `1`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles without issue, so option G is incorrect. In the first expression, `a > 2` is `false`, so `b` is incremented to `5`; but since the post-increment operator is used, `4` is printed, making option D correct. The `--c` was not applied, because only one of the right-hand expressions was evaluated. In the second expression, `a!=c` is `false` since `c` was never modified. Since `b` is `5` due to the previous line and the post-increment operator is used, `b++` returns `5`. The result is then assigned to `b` using the assignment operator, overriding the incremented value for `b` and printing `5`, making option E correct. In the last expression, parentheses are not required, but lack of parentheses can make ternary expressions difficult to read. From the previous lines, `a` is `2`, `b` is `5`, and `c` is `2`. We can rewrite this expression with parentheses as `(2 > 5 ? (5 < 2 ? 5 : 2) : 1)`. The second ternary expression is never evaluated since `2 > 5` is `false`, and the expression returns `1`, making option A correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    1. **Lệnh 1:** `a > 2 ? --c : b++` → `2 > 2` là `false`.
       * Nhánh `b++` được thực thi. Do là hậu tố, giá trị cũ của `b` là **`4`** được trả về và in ra màn hình (**In ra: 4**).
       * Sau đó `b` tăng lên thành `5`. Biến `c` không bị suy giảm vì chỉ có 1 nhánh được chạy (`c` vẫn là 2).
    2. **Lệnh 2:** `b = (a != c ? a : b++)` → `a != c` (`2 != 2`) là `false`.
       * Nhánh `b++` được thực thi. Lúc này `b` đang là 5, hậu tố trả về giá trị **`5`**.
       * Phép gán `b = 5` gán đè lại giá trị 5 vào `b`. Màn hình **in ra: 5**.
    3. **Lệnh 3:** `a > b ? b < c ? b : 2 : 1`
       * Viết lại có ngoặc: `(a > b) ? (b < c ? b : 2) : 1`.
       * Điều kiện `a > b` (`2 > 5`) là `false`.
       * Nhánh sau cùng được chọn trả về trực tiếp giá trị **`1`** (**In ra: 1**). Biểu thức ba ngôi bên trong không hề bị đánh giá.
    * Tập hợp các giá trị duy nhất in ra là: `{4, 5, 1}` → **Đáp án A, D, E**.
</details>

---

### Question 10 (Câu 10)
**Which is not an output of the following code snippet?**

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
* E. The code does not compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E (The code does not compile)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code does not compile due to an error on the second line, making option E correct. Even though both `height` and `weight` are cast to `byte`, the multiplication operator automatically promotes them to `int`, resulting in an attempt to store an `int` in a `short` variable.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Đề bài hỏi giá trị nào **không phải** là output.
    * Xét dòng 2: `short zebra = (byte) weight * (byte) height;`
      * Dù cả `weight` và `height` đều được ép kiểu về `byte`, nhưng khi gặp toán tử nhân hai ngôi `*`, cả hai toán hạng đều bị tự động thăng hạng lên thành **`int`** (Quy tắc 3).
      * Phép nhân trả về kiểu `int`, không thể tự động gán vào biến `short zebra` nếu không ép kiểu cả cụm `(short)`.
      * Trình biên dịch báo lỗi: `incompatible types: possible loss of precision from int to short`.
    * Vì code không chạy được nên **E là đáp án chính xác**.
</details>

---

### Question 11 (Câu 11)
**What is the output of the following code?**

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
* G. The code does not compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D (`2, 0, 5`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** First, `*` and `%` have the same operator precedence, so the expression is evaluated from left to right unless parentheses are present. The first expression evaluates to `8 % 3`, which leaves a remainder of `2`. The second expression is evaluated left to right since `*` and `%` have the same operator precedence, and it reduces to `6 % -3`, which is `0`. The last expression reduces to `5 * 1`, which is `5`. Therefore, the output on line 14 is `2, 0, 5`, making option D the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * `sample1 = (2 * 4) % 3` → `8 % 3 = 2` (8 chia 3 được 2 dư 2).
    * `sample2 = 3 * 2 % -3`:
      * `*` và `%` cùng mức ưu tiên, tính từ trái sang phải: `3 * 2 = 6`.
      * `6 % -3`: Phép chia dư với số âm bên phải thì dấu âm bị bỏ qua → tương đương `6 % 3 = 0`.
    * `sample3 = 5 * (1 % 2)`:
      * `1 % 2 = 1` (1 chia 2 được 0 dư 1).
      * `5 * 1 = 5`.
    * In ra: `2, 0, 5`.
</details>

---

### Question 12 (Câu 12)
**The _________ operator increases a value and returns the original value, while the _______ operator decreases a value and returns the new value.**

* A. post-increment, post-increment
* B. pre-decrement, post-decrement
* C. post-increment, post-decrement
* D. post-increment, pre-decrement
* E. pre-increment, pre-decrement
* F. pre-increment, post-decrement

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D (`post-increment, pre-decrement`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `pre-` prefix indicates the operation is applied first, and the new value is returned, while the `post-` prefix indicates the original value is returned prior to the operation. Next, increment increases the value, while decrement decreases the value. For these reasons, option D is the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Hậu tố tăng (Post-increment - `x++`):** Tăng biến lên 1 nhưng trả về giá trị ban đầu trước khi tăng (*original value*).
    * **Tiền tố giảm (Pre-decrement - `--x`):** Giảm biến đi 1 và trả về giá trị mới ngay sau khi giảm (*new value*).
</details>

---

### Question 13 (Câu 13)
**What is the output of the following code snippet?**

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
* G. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F (`true-true-false`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The first expression is evaluated from left to right, letting us reduce it to `false ^ sunday`, which is `true`, because `sunday` is `true`. In the second expression, we apply the negation operator (`!`) first, reducing the expression to `sunday && true`, which evaluates to `true`. In the last expression, both variables are `true`, so they reduce to `!(true && true)`, which further reduces to `!true`, aka `false`. For these reasons, option F is the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **`goingToTheStore = sunny & raining ^ sunday;`**:
      * Thứ tự ưu tiên: Toán tử `&` (AND - mức 9) có độ ưu tiên cao hơn `^` (XOR - mức 10).
      * Thực hiện `sunny & raining` trước: `true & false = false`.
      * Sau đó thực hiện XOR: `false ^ sunday` → `false ^ true = true`.
      * Vậy `goingToTheStore = true`.
    * **`goingToTheZoo = sunday && !raining;`**:
      * `!raining` → `!false = true`.
      * `sunday && true` → `true && true = true`.
      * Vậy `goingToTheZoo = true`.
    * **`stayingHome = !(goingToTheStore && goingToTheZoo);`**:
      * `!(true && true)` → `!true = false`.
    * Kết quả in ra: `true-true-false`.
</details>

---

### Question 14 (Câu 14)
**Which of the following statements are correct? (Choose all that apply.)**

* A. The return value of an assignment operation expression can be `void`.
* B. The inequality operator (`!=`) can be used to compare objects.
* C. The equality operator (`==`) can be used to compare a `boolean` value with a numeric value.
* D. During runtime, the `&` and `|` operators may cause only the left side of the expression to be evaluated.
* E. The return value of an assignment operation expression is the value of the newly assigned variable.
* F. In Java, `0` and `false` may be used interchangeably.
* G. The logical complement operator (`!`) cannot be used to flip numeric values.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, E, G**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The return value of an assignment operation in the expression is the same as the value of the newly assigned variable. For this reason, option A is incorrect, and option E is correct. Option B is correct, as the equality (`==`) and inequality (`!=`) operators can both be used with objects. Option C is incorrect, as `boolean` and numeric types are not comparable. For example, you can’t say `true == 3` without a compilation error. Option D is incorrect, as logical operators evaluate both sides of the expression. Option F is incorrect, as Java does not accept numbers for `boolean` values. Finally, option G is correct, as you need to use the negation operator (`-`) to flip or negate numeric values, not the logical complement operator (`!`).
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **B đúng:** Toán tử `==` và `!=` dùng để so sánh địa chỉ tham chiếu giữa 2 đối tượng.
    * **E đúng:** Biểu thức gán `(x = 5)` trả về giá trị `5`.
    * **G đúng:** Toán tử `!` chỉ dùng cho `boolean`, muốn đổi dấu số phải dùng toán tử âm một ngôi `-`.
    * **A sai:** Biểu thức gán luôn trả về kiểu dữ liệu của biến được gán, không bao giờ trả về `void`.
    * **C sai:** Không thể so sánh `boolean == number` (ví dụ `true == 3` bị lỗi biên dịch).
    * **D sai:** `&` và `|` là toán tử logic không đoản mạch, chúng **luôn luôn đánh giá cả 2 vế**.
    * **F sai:** Java là ngôn ngữ định kiểu tĩnh an toàn, không có chuyện coi số 0 là false như C/C++.
</details>

---

### Question 15 (Câu 15)
**Which operator takes three operands or values?**

* A. `=`
* B. `&&`
* C. `*=`
* D. `? :`
* E. `&`
* F. `++`
* G. `/`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **D (`? :`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The ternary operator is the only operator that takes three values, making option D the only correct choice. Options A, B, C, E, and G are all binary operators. While they can be strung together in longer expressions, each operation uses only two values at a time. Option F is a unary operator and takes only one value.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Toán tử ba ngôi (*Ternary operator*) `booleanExpr ? expr1 : expr2` là toán tử duy nhất trong Java nhận đúng 3 toán hạng.
    * Các phương án A, B, C, E, G là toán tử hai ngôi (*binary*). F là toán tử một ngôi (*unary*).
</details>

---

### Question 16 (Câu 16)
**How many lines of the following code contain compiler errors?**

```java
int note = 1 * 2 + (long)3;
short melody = (byte)(double)(note *= 2);
double song = melody;
float symphony = (float)((song == 1_000f) ? song * 2L : song);
```

* A. 0
* B. 1
* C. 2
* D. 3
* E. 4

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B (1 line)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The first line contains a compilation error. The value `3` is cast to `long`. The `1 * 2` value is evaluated as `int` but promoted to `long` when added to the `3`. Trying to store a `long` value in an `int` variable triggers a compiler error. The other lines do not contain any compilation errors, as they store smaller values in larger or same-size data types, with lines 2 and 4 using casting to do so. Since only one line does not compile, option B is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Dòng 1 bị lỗi:** `1 * 2 + (long)3`. Do có `(long)3`, toàn bộ phép cộng được thăng hạng thành `long`. Gán giá trị `long` cho biến `int note` gây lỗi: `incompatible types: possible loss of precision`.
    * **Dòng 2 hợp lệ:** `note *= 2` trả về `int`, sau đó ép sang `double`, rồi ép sang `byte`. Cuối cùng gán `byte` cho `short melody` là mở rộng hợp lệ.
    * **Dòng 3 hợp lệ:** Gán `short` sang `double` là mở rộng tự nhiên.
    * **Dòng 4 hợp lệ:** Toán tử ba ngôi trả về kiểu số, sau đó được ép tường minh sang `(float)`.
    * Tổng cộng: đúng 1 dòng lỗi → **Đáp án B**.
</details>

---

### Question 17 (Câu 17)
**Given the following code snippet, what are the values of the variables after it is executed? (Choose all that apply.)**

```java
int ticketsTaken = 1;
int ticketsSold = 3;
ticketsSold += 1 + ticketsTaken++;
ticketsTaken *= 2;
ticketsSold += (long)1;
```

* A. `ticketsSold` is 8.
* B. `ticketsTaken` is 2.
* C. `ticketsSold` is 6.
* D. `ticketsTaken` is 6.
* E. `ticketsSold` is 7.
* F. `ticketsTaken` is 4.
* G. The code does not compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C, F (`ticketsSold = 6`, `ticketsTaken = 4`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The starting values of `ticketsTaken` and `ticketsSold` are `1` and `3`, respectively. After the first compound assignment, `ticketsTaken` is incremented to `2`. The `ticketsSold` value is increased from `3` to `5`; since the post-increment operator was used, the value of `ticketsTaken++` returns `1`. On the next line, `ticketsTaken` is doubled to `4`. On the final line, `ticketsSold` is increased by `1` to `6`. The final values of the variables are `4` and `6`, for `ticketsTaken` and `ticketsSold`, respectively, making options C and F the correct answers. Note the last line does not trigger a compilation error as the compound operator automatically casts the right-hand operand.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Ban đầu: `ticketsTaken = 1`, `ticketsSold = 3`.
    * **Dòng 3:** `ticketsSold += 1 + ticketsTaken++;`
      * `ticketsTaken++` là hậu tố: trả về giá trị cũ là `1`, sau đó `ticketsTaken` tăng lên thành `2`.
      * Vế phải: `1 + 1 = 2`.
      * `ticketsSold += 2` → `ticketsSold = 3 + 2 = 5`.
    * **Dòng 4:** `ticketsTaken *= 2;`
      * `ticketsTaken = 2 * 2 = 4`.
    * **Dòng 5:** `ticketsSold += (long)1;`
      * Nhờ tính năng tự động ép kiểu của compound assignment `+=`, dòng này hoàn toàn hợp lệ mà không bị lỗi biên dịch kiểu số.
      * `ticketsSold = 5 + 1 = 6`.
    * Kết quả cuối cùng: `ticketsTaken = 4` (**F**) và `ticketsSold = 6` (**C**).
</details>

---

### Question 18 (Câu 18)
**Which of the following can be used to change the order of operation in an expression?**

* A. `[ ]`
* B. `< >`
* C. `( )`
* D. `\ /`
* E. `{ }`
* F. `" "`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C (`( )`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Only parentheses, `( )`, can be used to change the order of operation in an expression, making option C correct. The other operators, such as `[ ]`, `< >`, and `{ }`, cannot be used to change the order of precedence in Java.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Trong Java, **chỉ có duy nhất cặp dấu ngoặc đơn `( )`** mới có chức năng ghi đè và thay đổi thứ tự ưu tiên của các toán tử trong biểu thức tính toán.
    * `[ ]` dùng cho mảng, `< >` dùng cho Generics / toán tử quan hệ, `{ }` dùng cho khối code block.
</details>

---

### Question 19 (Câu 19)
**What is the result of executing the following code snippet? (Choose all that apply.)**

```java
3: int start = 7;
4: int end = 4;
5: end += ++start;
6: start = (byte)(Byte.MAX_VALUE + 1);
```

* A. `start` is 0.
* B. `start` is -128.
* C. `start` is 127.
* D. `end` is 8.
* E. `end` is 11.
* F. `end` is 12.
* G. The code does not compile.
* H. The code compiles but throws an exception at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, F (`start = -128`, `end = 12`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles and runs successfully, so options G and H are incorrect. On line 5, the pre-increment operator is executed first, so `start` is incremented to `8`, and the new value is returned as the right side of the expression. The value of `end` is computed by adding `8` to the original value of `4`, leaving a new value of `12` for `end` and making option F a correct answer. On line 6, we are incrementing one past the maximum `byte` value. Due to overflow, this will result in a negative number, making option B the correct answer. Even if you didn’t know the maximum value of `byte`, you should have known the code compiles and runs and looked for the answer for `start` with a negative number.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Dòng 5:** `end += ++start;`
      * Tiền tố `++start` tăng `start` từ 7 lên `8` và trả về `8`.
      * `end += 8` → `end = 4 + 8 = 12` (**Đáp án F**).
    * **Dòng 6:** `start = (byte)(Byte.MAX_VALUE + 1);`
      * Hằng số `Byte.MAX_VALUE` có giá trị là `127`.
      * `127 + 1 = 128` (kiểu `int`).
      * Khi ép sang `(byte)128`, vượt quá giới hạn cực đại của kiểu `byte` (miền giá trị từ `-128` đến `127`). Hiện tượng tràn số (*overflow*) xảy ra: giá trị quay vòng về cực tiểu là **`-128`** (**Đáp án B**).
</details>

---

### Question 20 (Câu 20)
**Which of the following statements about unary operators are true? (Choose all that apply.)**

* A. Unary operators are always executed before any surrounding numeric binary or ternary operators.
* B. The `-` operator can be used to flip a `boolean` value.
* C. The pre-increment operator (`++`) returns the value of the variable before the increment is applied.
* D. The post-decrement operator (`--`) returns the value of the variable before the decrement is applied.
* E. The `!` operator cannot be used on numeric values.
* F. None of the above.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, D, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Unary operators have the highest order of precedence, making option A correct. The negation operator (`-`) is used only for numeric values, while the logical complement operator (`!`) is used exclusively for `boolean` values. For these reasons, option B is incorrect, and option E is correct. Finally, the pre-increment/pre-decrement operators return the new value of the variable, while the post-increment/post-decrement operators return the original variable. For these reasons, option C is incorrect, and option D is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A đúng:** Theo bảng thứ tự ưu tiên (Table 2.1), toán tử một ngôi nằm ở mức ưu tiên 1, 2, 3 (cao hơn toán tử hai ngôi số học mức 4, 5 và toán tử ba ngôi mức 14).
    * **D đúng:** Toán tử hậu tố (`x--`) trả về giá trị ban đầu trước khi giảm.
    * **E đúng:** Toán tử `!` chỉ dành riêng cho `boolean`, áp dụng lên số học sẽ gây lỗi biên dịch.
    * **B sai:** Toán tử `-` chỉ dùng cho số học, đảo boolean phải dùng `!`.
    * **C sai:** Tiền tố `++x` trả về giá trị mới **sau khi** tăng, không phải trước khi tăng.
</details>
