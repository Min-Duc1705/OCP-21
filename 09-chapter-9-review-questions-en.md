# Review Questions (Bộ Câu Hỏi Ôn Tập Tiếng Anh) - Chapter 9: Collections and Generics

> **Source (Nguồn trích dẫn):** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Pages 831–842).  
> **Quantity (Số lượng):** 23 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle (100% Verbatim English Questions) kèm giải thích gốc từ Sách & phân tích chuyên sâu Tiếng Việt (Pages 1378–1384).  
> **How to study (Cách học):** Bạn hãy tự đọc đề tiếng Anh và suy luận đáp án trước, sau đó bấm vào mục **"👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)"** để kiểm tra và khắc sâu các bẫy thi của Oracle.

---

### Question 1 (Câu 1)
**Suppose you need to display a collection of products for sale, which may contain duplicates. Additionally, you have a collection of sales that you need to track, sorted by the natural order of the sale ID, and you need to retrieve the text of each. Which two of the following classes best suit your needs for each of these scenarios? (Choose two.)**

* A. `ArrayList`
* B. `HashMap`
* C. `HashSet`
* D. `LinkedList`
* E. `SequencedTreeSet`
* F. `TreeMap`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Option E is incorrect for both scenarios, as `SequencedTreeSet` does not exist. For the first scenario, the answer needs to implement `List` because the scenario allows duplicates, narrowing it down to options A and D. Option A is a better answer than option D because `LinkedList` is both a `List` and a `Queue`, and you just need a regular `List`. For the second scenario, the answer needs to implement `Map` because you are dealing with key/value pairs per the unique `id` field. This narrows it down to options B and F. Since the question talks about ordering, you need the `TreeMap`. Therefore, the answer is option F.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Kịch bản 1 (Tập hợp sản phẩm cho phép trùng lặp):** Cần một tập hợp triển khai `List` vì List cho phép phần tử trùng lặp (`duplicates`). Lựa chọn thu hẹp về `ArrayList` (A) và `LinkedList` (D). Ở đây `ArrayList` là lựa chọn chuẩn xác và tối ưu nhất cho kịch bản hiển thị danh sách sản phẩm thông thường (`LinkedList` vừa là List vừa là Queue/Deque, không cần thiết cho mục đích chỉ hiển thị danh sách).
    * **Kịch bản 2 (Tập hợp đơn hàng có ID duy nhất và được sắp xếp):** Vì mỗi đơn hàng có sale ID duy nhất làm khoá và chuỗi văn bản mô tả làm giá trị, ta cần một cấu trúc dạng Key-Value (triển khai giao diện `Map`). Điều này thu hẹp về `HashMap` (B) và `TreeMap` (F). Đề bài yêu cầu sắp xếp theo thứ tự tự nhiên của sale ID (*"sorted by the natural order of the sale ID"*), do đó cấu trúc bắt buộc phải dùng là `TreeMap` (F).
    * Lựa chọn E (`SequencedTreeSet`) là đáp án bẫy vì Java **hoàn toàn không có lớp nào tên là `SequencedTreeSet`** (chỉ có giao diện `SequencedSet` và lớp `TreeSet`).
    * **Bẫy thi cần nhớ:** `TreeSet` và `TreeMap` luôn sắp xếp phần tử/khoá theo thứ tự tự nhiên (`Comparable`) hoặc theo `Comparator`. Không có lớp nào tên là `SequencedTreeSet`.
</details>

---

### Question 2 (Câu 2)
**Which of the following are true? (Choose all that apply.)**

```java
12: List<?> q = List.of("mouse", "parrot");
13: var v = List.of("mouse", "parrot");
14:
15: q.removeIf(String::isEmpty);
16: q.removeIf(s -> s.length() == 4);
17: v.removeIf(String::isEmpty);
18: v.removeIf(s -> s.length() == 4);
```

* A. This code compiles and runs without error.
* B. Exactly one of these lines contains a compiler error.
* C. Exactly two of these lines contain a compiler error.
* D. Exactly three of these lines contain a compiler error.
* E. Exactly four of these lines contain a compiler error.
* F. If any lines with compiler errors are removed, this code runs without throwing an exception.
* G. If any lines with compiler errors are removed, this code throws an exception.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C, G**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Line 12 creates a `List<?>`, which means it is treated as if all the elements are of type `Object` rather than `String`. Lines 15 and 16 do not compile since they call the `String` methods `isEmpty()` and `length()`, which are not defined on `Object`. Line 13 creates a `List<String>` because `var` uses the type that it deduces from the context. Lines 17 and 18 do compile. However, `List.of()` creates an immutable list, so both of those lines would throw an `UnsupportedOperationException` if run. Therefore, options C and G are correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 12 khai báo `List<?> q`. Vì sử dụng Unbounded Wildcard `<?>`, trình biên dịch coi các phần tử trong `q` thuộc kiểu tổng quát `Object`.
    * Phương thức `removeIf(Predicate<? super E> filter)` trên `List<?>` sẽ kỳ vọng một predicate nhận `Object`.
    * Dòng 15 (`String::isEmpty`) và dòng 16 (`s -> s.length() == 4`) đều gọi các phương thức chỉ có ở `String` (`isEmpty()`, `length()`). Trình biên dịch không cho phép vì kiểu phần tử trong `q` chỉ được suy luận là `Object` → **Dòng 15 và dòng 16 bị LỖI BIÊN DỊCH** (Có đúng 2 dòng lỗi biên dịch → chọn **C**).
    * Dòng 13 dùng `var v = List.of(...)` nên `v` được suy luận chính xác là `List<String>`. Do đó, dòng 17 và 18 hoàn toàn hợp lệ về mặt biên dịch.
    * **Tuy nhiên:** `List.of()` tạo ra một danh sách **bất biến tuyệt đối (immutable list)**. Việc gọi `removeIf()` cố gắng sửa đổi danh sách sẽ khiến Java ném ra **`UnsupportedOperationException` tại runtime** → chọn **G**.
    * **Bẫy thi cần nhớ:** Với `List<?>`, bạn không thể gọi các phương thức đặc thù của kiểu con ngoài `Object`. Ngoài ra, các collection tạo bởi `List.of()`, `Set.of()`, `Map.of()` là bất biến; bất kỳ thao tác thay đổi nào (`add`, `remove`, `removeIf`, `replaceAll`) đều ném `UnsupportedOperationException`.
</details>

---

### Question 3 (Câu 3)
**What is the result of the following statements?**

```java
3:  var greetings = new ArrayDeque<String>();
4:  greetings.offerLast("hello");
5:  greetings.offerLast("hi");
6:  greetings.offerFirst("ola");
7:  greetings.pop();
8:  greetings.peek();
9:  while (greetings.peek() != null)
10:    System.out.print(greetings.pop());
```

* A. `hello`
* B. `hellohi`
* C. `hellohiola`
* D. `hiola`
* E. The code does not compile.
* F. An exception is thrown.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B (`hellohi`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** This is a double-ended queue. On lines 4 and 5, we add to the back, giving us `[hello, hi]`. On line 6, we add to the front and have `[ola, hello, hi]`. On line 7, we remove the first element, which is `"ola"`. On line 8, we look at the new first element (`"hello"`) but don’t remove it. On lines 9 and 10, we remove each element in turn until no elements are left, printing `hello` and `hi` together, which makes option B the answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 3 khởi tạo `ArrayDeque<String>`: `greetings = []`.
    * Dòng 4: `offerLast("hello")` → thêm vào đuôi: `["hello"]`.
    * Dòng 5: `offerLast("hi")` → thêm vào đuôi: `["hello", "hi"]`.
    * Dòng 6: `offerFirst("ola")` → thêm vào đầu: `["ola", "hello", "hi"]`.
    * Dòng 7: `pop()` tương đương với thao tác ngăn xếp (Stack LIFO), lấy và xoá phần tử ở đỉnh/đầu deque → xoá `"ola"`. Danh sách còn lại: `["hello", "hi"]`.
    * Dòng 8: `peek()` xem phần tử ở đầu danh sách mà không xoá → trả về `"hello"`, không làm thay đổi deque.
    * Dòng 9–10: Vòng lặp `while (peek() != null)` liên tục gọi `pop()`:
      * Lần 1: Lấy và in `"hello"`.
      * Lần 2: Lấy và in `"hi"`.
      * Lần 3: `peek()` trả về `null`, vòng lặp kết thúc.
    * Kết quả in ra liền nhau: `hellohi` → Đáp án **B**.
    * **Bẫy thi cần nhớ:** Với `Deque`:
      * `push()` = `addFirst()` (đẩy vào đầu).
      * `pop()` = `removeFirst()` (lấy từ đầu).
      * `peek()` = `peekFirst()` (nhìn phần tử đầu).
      * `offer()` = `offerLast()` (thêm vào đuôi).
</details>

---

### Question 4 (Câu 4)
**Which of these statements compile? (Choose all that apply.)**

* A. `HashSet<Number> hs = new HashSet<Integer>();`
* B. `HashSet<? super ClassCastException> set = new HashSet<Exception>();`
* C. `List<> list = new ArrayList<String>();`
* D. `List<Object> values = new HashSet<Object>();`
* E. `List<Object> objects = new ArrayList<? extends Object>();`
* F. `Map<String, ? extends Number> hm = new HashMap<String, Integer>();`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** Option A does not compile because the generic types are not compatible. We could say `HashSet<? extends Number> hs2 = new HashSet<Integer>();`. Option B uses a lower bound, so it allows superclass generic types. Option C does not compile because the diamond operator is allowed only on the right side. Option D does not compile because a `Set` is not a `List`. Option E does not compile because upper bounds are not allowed when instantiating the type. Finally, option F does compile because the upper bound is on the correct side of the `=`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **A sai:** Generics trong Java là bất biến (invariant). Mặc dù `Integer` kế thừa `Number`, `HashSet<Integer>` **không phải** là kiểu con của `HashSet<Number>`. Muốn gán được phải dùng `HashSet<? extends Number>`.
    * **B đúng:** `<? super ClassCastException>` là Lower-bounded Wildcard, chấp nhận `ClassCastException` hoặc bất kỳ lớp cha nào của nó. Vì `Exception` là lớp cha của `ClassCastException`, phép gán này hoàn toàn hợp lệ.
    * **C sai:** Diamond operator `<>` chỉ được phép nằm ở phía bên phải toán tử gán khi khởi tạo đối tượng, không được phép nằm ở kiểu khai báo tham chiếu bên trái.
    * **D sai:** `HashSet` triển khai `Set`, không triển khai `List`, không có quan hệ kế thừa trực tiếp.
    * **E sai:** Ký tự đại diện `?` (wildcard) **tuyệt đối không được xuất hiện ở vế phải khi gọi toán tử `new`**. Khởi tạo đối tượng bắt buộc phải xác định kiểu cụ thể (`new ArrayList<Object>()`).
    * **F đúng:** `? extends Number` cho phép vế phải có kiểu giá trị là `Integer` (vì `Integer` là con của `Number`). Vế trái dùng kiểu giao diện `Map`, vế phải dùng lớp triển khai `HashMap`, kiểu khoá `String` khớp nhau → Hợp lệ 100%.
    * **Bẫy thi cần nhớ:** Wildcard `?` chỉ được dùng trong khai báo tham chiếu (vế trái, tham số phương thức, kiểu trả về), KHÔNG BAO GIỜ được dùng sau từ khoá `new` ở vế phải!
</details>

---

### Question 5 (Câu 5)
**What is the result of the following code?**

```java
1: public record Hello<T>(T t) {
2:    public Hello(T t) { this.t = t; }
3:    private <T> void println(T message) {
4:       System.out.print(t + "-" + message);
5:    }
6:    public static void main(String[] args) {
7:       new Hello<String>("hi").println(1);
8:       new Hello("hola").println(true);
9:    } }
```

* A. `hi` followed by a runtime exception.
* B. `hi-1hola-true`
* C. The first compiler error is on line 1.
* D. The first compiler error is on line 3.
* E. The first compiler error is on line 8.
* F. The first compiler error is on another line.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B (`hi-1hola-true`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The record compiles and runs without issue. Line 8 gives a compiler warning for not using generics but not a compiler error. Line 7 creates the `Hello` class with the generic type `String`. It also passes an `int` to the `println()` method, which gets autoboxed into an `Integer`. While the `println()` method takes a generic parameter of type `T`, it is not the same `<T>` defined for the class on line 1. Instead, it is a different `T` defined as part of the method declaration on line 3. Therefore, the `String` argument on line 7 applies only to the class. The method can take any object as a parameter, including autoboxed primitives. Line 8 creates the `Hello` class with the generic type `Object` since no type is specified for that instance. It passes a `boolean` to `println()`, which gets autoboxed into a `Boolean`. The result is that `hi-1hola-true` is printed, making option B correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 1 định nghĩa generic record `Hello<T>(T t)`. Record có thể sử dụng type parameter `<T>` như một generic class thông thường.
    * Dòng 2 là canonical constructor tường minh, hợp lệ.
    * Dòng 3 khai báo một **generic method** `private <T> void println(T message)`.
      * **Bẫy thi lớn:** Tham số kiểu `<T>` được khai báo tại dòng 3 là một tham số kiểu **hoàn toàn độc lập** với tham số `<T>` của record tại dòng 1 (nó làm bóng mờ - shadow - type parameter của class trong phạm vi phương thức này).
      * Do đó, `message` có thể nhận bất kỳ kiểu dữ liệu nào, không bị ràng buộc bởi kiểu `T` của đối tượng `Hello`!
    * Dòng 7: Khởi tạo `Hello<String>` với `t = "hi"`. Gọi `println(1)`, số nguyên nguyên thuỷ `1` được autobox thành `Integer` và truyền vào phương thức `println`. Dòng 4 in: `"hi" + "-" + 1` → `hi-1`.
    * Dòng 8: Khởi tạo `Hello` dưới dạng raw type (không chỉ định generic type parameter). Trình biên dịch đưa ra cảnh báo (warning) nhưng **không gây lỗi biên dịch**. Giá trị `t = "hola"`. Gọi `println(true)`, giá trị `true` autobox thành `Boolean`. Dòng 4 in: `"hola" + "-" + true` → `hola-true`.
    * Tổng kết in ra: `hi-1hola-true`.
    * **Bẫy thi cần nhớ:** Khi một generic method tự khai báo `<T>`, nó che lấp `<T>` của class. Cảnh báo raw type không phải là lỗi biên dịch.
</details>

---

### Question 6 (Câu 6)
**Which of the following can fill in the blank to print `[7, 5, 3]`? (Choose all that apply.)**

```java
8:  public record Platypus(String name, int beakLength) {
9:     @Override public String toString() {return "" + beakLength;}
10:
11:    public static void main(String[] args) {
12:       Platypus p1 = new Platypus("Paula", 3);
13:       Platypus p2 = new Platypus("Peter", 5);
14:       Platypus p3 = new Platypus("Peter", 7);
15:
16:       List<Platypus> list = Arrays.asList(p1, p2, p3);
17:
18:       Collections.sort(list, Comparator.comparing_______________);
19:
20:       System.out.println(list);
21:    }
22: }
```

* A. `(Platypus::beakLength)`
* B. `(Platypus::beakLength).reversed()`
* C. `(Platypus::name).thenComparing(Platypus::beakLength)`
* D. `(Platypus::name).thenComparing(Comparator.comparing(Platypus::beakLength).reversed())`
* E. `(Platypus::name).thenComparingNumber(Platypus::beakLength).reversed()`
* F. `(Platypus::name).thenComparingInt(Platypus::beakLength).reversed()`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** We’re looking for a `Comparator` definition that sorts in descending order by `beakLength`. Option A is incorrect because it sorts in ascending order by `beakLength`. Similarly, option C is incorrect because it sorts by `beakLength` in ascending order within those matches that have the same `name`. Option E is incorrect because there is no `thenComparingNumber()` method. Option B is a correct answer, as it sorts by `beakLength` in descending order. Options D and F are trickier. First, notice that we can call either `thenComparing()` or `thenComparingInt()` because the former will simply autobox the `int` into an `Integer`. Then observe what `reversed()` applies to. Option D is incorrect because it sorts by `name` in ascending order and only reverses the beak length of those with the same `name`. Option F creates a comparator that sorts by `name` in ascending order and then by beak size in ascending order. Finally, it reverses the result. This is just what we want, so option F is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Ba đối tượng: `p1("Paula", 3)`, `p2("Peter", 5)`, `p3("Peter", 7)`.
    * Đề bài muốn in ra: `[7, 5, 3]`, tức là danh sách theo thứ tự giảm dần của `beakLength`: `p3 (7) -> p2 (5) -> p1 (3)`.
    * **Xét lựa chọn A:** `comparing(Platypus::beakLength)` sắp xếp tăng dần theo độ dài mỏ → in `[3, 5, 7]` (Sai).
    * **Xét lựa chọn B:** Thêm `.reversed()` đảo ngược lại thành giảm dần theo `beakLength` → in `[7, 5, 3]` (Đúng!).
    * **Xét lựa chọn C:** Sắp xếp theo tên tăng dần ("Paula" trước "Peter"), với tên trùng nhau sắp xếp theo beakLength tăng dần → in `[3, 5, 7]` (Sai).
    * **Xét lựa chọn D:** Sắp xếp theo tên tăng dần ("Paula" đứng đầu), chỉ đảo ngược beakLength với những ai trùng tên → "Paula" (3) vẫn đứng đầu → in `[3, 7, 5]` (Sai).
    * **Xét lựa chọn E:** Không tồn tại phương thức nào tên là `thenComparingNumber()` trong `Comparator` → Lỗi biên dịch.
    * **Xét lựa chọn F:** 
      * `Comparator.comparing(Platypus::name)`: Sắp xếp theo tên tăng dần ("Paula" < "Peter").
      * `.thenComparingInt(Platypus::beakLength)`: Tên trùng nhau thì sắp xếp theo beakLength tăng dần (5 < 7). Thứ tự lúc này: `p1("Paula", 3) -> p2("Peter", 5) -> p3("Peter", 7)`.
      * `.reversed()`: **Đảo ngược toàn bộ comparator trước đó**. Thứ tự bị đảo ngược hoàn toàn: `p3("Peter", 7) -> p2("Peter", 5) -> p1("Paula", 3)`.
      * In ra: `[7, 5, 3]` → Hoàn toàn chính xác!
    * **Bẫy thi cần nhớ:** Phương thức `.reversed()` áp dụng lên toàn bộ chuỗi so sánh đứng trước nó. Không có phương thức `thenComparingNumber()` (chỉ có `thenComparing`, `thenComparingInt`, `thenComparingLong`, `thenComparingDouble`).
</details>

---

### Question 7 (Câu 7)
**Which of the following method signatures are valid overrides of the `hairy()` method in the `Alpaca` class? (Choose all that apply.)**

```java
import java.util.*;
public class Alpaca {
   public List<String> hairy(List<String> list) { return null; }
}
```

* A. `public List<String> hairy(List<CharSequence> list) { return null; }`
* B. `public List<String> hairy(List<String> list) { return null; }`
* C. `public List<String> hairy(List<Integer> list) { return null; }`
* D. `public List<CharSequence> hairy(List<String> list) { return null; }`
* E. `public Object hairy(List<String> list) { return null; }`
* F. `public ArrayList<String> hairy(List<String> list) { return null; }`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** A valid override of a method with generic arguments must have a return type that is covariant, with matching generic type parameters. Options D and E are incorrect because the return type is too broad. Additionally, the generic arguments must have the same signature with the same generic types. This eliminates options A and C. The remaining options are correct, making the answer options B and F.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Quy tắc ghi đè phương thức có Generics trong Java:**
      1. **Danh sách tham số (Parameters):** Phải có chữ ký giống hệt sau cơ chế xoá kiểu (*Type Erasure*). Vì lớp cha nhận `List<String>`, phương thức ở lớp con cũng bắt buộc phải nhận tham số có kiểu khớp chính xác là `List<String>`. Các lựa chọn A (`List<CharSequence>`) và C (`List<Integer>`) đều làm thay đổi tham số → Sau khi xoá kiểu đều thành `hairy(List)` nhưng lại khác chữ ký generic, gây lỗi biên dịch (vừa không phải override, vừa không thể overload vì cùng raw type).
      2. **Kiểu trả về (Return Type):** Phải là kiểu hiệp biến (**Covariant return type**), nghĩa là cùng kiểu hoặc là lớp con của kiểu trả về ở lớp cha (`List<String>`).
    * Xét B: Kiểu trả về `List<String>` khớp hoàn toàn → Override hợp lệ.
    * Xét D: `List<CharSequence>` không phải là kiểu con của `List<String>` (Generics là invariant) → Sai.
    * Xét E: `Object` là kiểu cha của `List`, không phải kiểu con hiệp biến → Sai.
    * Xét F: `ArrayList<String>` là lớp con của `List<String>` → Là kiểu trả về hiệp biến hợp lệ!
    * **Bẫy thi cần nhớ:** Để override phương thức có generics: tham số đầu vào phải giữ nguyên generic type, kiểu trả về được phép là subtype hiệp biến.
</details>

---

### Question 8 (Câu 8)
**Which of the following fills in the blank, allowing the code to compile and run without issue?**

```java
11: SequencedCollection<String> animals = new _____________<>();
12: animals.addFirst("lions");
13: animals.addLast("tigers");
14: for(var a : animals)
15:    System.out.println(a);
16: System.out.println(animals.get(0));
```

* A. `HashSet`
* B. `LinkedList`
* C. `TreeSetMap`
* D. `HashMap`
* E. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E (None of the above)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** There is no `get(int)` method defined in `SequencedCollection`, meaning line 16 does not compile, regardless of what is placed in the blank. For this reason, option E is correct. If line 16 was removed or corrected to use `getFirst()`, then `LinkedList` would be the correct answer.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Nhìn vào dòng 16: `System.out.println(animals.get(0));`.
    * Tham chiếu `animals` có kiểu khai báo là **`SequencedCollection<String>`**.
    * Giao diện `SequencedCollection` của Java 21 chỉ định nghĩa các phương thức: `addFirst()`, `addLast()`, `getFirst()`, `getLast()`, `removeFirst()`, `removeLast()`, và `reversed()`.
    * **Trong `SequencedCollection` KHÔNG HỀ CÓ phương thức `get(int index)`!** Phương thức `get(int)` chỉ thuộc về giao diện `List`.
    * Do đó, dù bạn có điền bất kỳ lớp nào vào chỗ trống ở dòng 11, **dòng 16 vẫn luôn luôn bị LỖI BIÊN DỊCH**.
    * Vì vậy, đáp án đúng bắt buộc phải là **E**.
    * **Bẫy thi cần nhớ:** `SequencedCollection` cung cấp `getFirst()` và `getLast()`, chứ không có `get(int)`. Muốn dùng `get(int)` tham chiếu phải là `List`.
</details>

---

### Question 9 (Câu 9)
**What is the result of the following program?**

```java
3:  public class MyComparator implements Comparator<String> {
4:     public int compare(String a, String b) {
5:        return b.toLowerCase().compareTo(a.toLowerCase());
6:     }
7:     public static void main(String[] args) {
8:        String[] values = { "123", "Abb", "aab" };
9:        Arrays.sort(values, new MyComparator());
10:       for (var s: values)
11:          System.out.print(s + " ");
12:    }
13: }
```

* A. `Abb aab 123 `
* B. `aab Abb 123 `
* C. `123 Abb aab `
* D. `123 aab Abb `
* E. The code does not compile.
* F. A runtime exception is thrown.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A (`Abb aab 123 `)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The array is sorted using `MyComparator`, which sorts the elements in reverse alphabetical order in a case-insensitive fashion. Normally, numbers sort before letters. This code reverses that by calling the `compareTo()` method on `b` instead of `a`. Therefore, option A is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 5: `b.toLowerCase().compareTo(a.toLowerCase())`.
      * Chú ý thứ tự so sánh: `b` được gọi `compareTo` với `a` → Đây là sắp xếp theo thứ tự **giảm dần (reverse order)**, không phân biệt hoa thường.
    * Các chuỗi ban đầu khi chuyển về chữ thường:
      * `"123"` → `"123"`
      * `"Abb"` → `"abb"`
      * `"aab"` → `"aab"`
    * Theo bảng mã ASCII tự nhiên (tăng dần): Các chữ số luôn đứng trước chữ cái: `"123"` < `"aab"` < `"abb"`.
    * Nhưng vì Comparator này đảo ngược thứ tự (`b.compareTo(a)`), thứ tự sắp xếp giảm dần sẽ là:
      1. `"abb"` lớn nhất (tương ứng với chuỗi gốc `"Abb"`)
      2. `"aab"` tiếp theo (tương ứng với chuỗi gốc `"aab"`)
      3. `"123"` nhỏ nhất (tương ứng với chuỗi gốc `"123"`)
    * Vòng lặp duyệt qua mảng đã sắp xếp và in ra: `Abb aab 123 ` → Đáp án đúng là **A**.
    * **Bẫy thi cần nhớ:** So sánh `b.compareTo(a)` tương đương với việc đảo ngược thứ tự tự nhiên. Chữ cái đứng sau chữ số, nên khi đảo ngược chữ cái sẽ lên đầu.
</details>

---

### Question 10 (Câu 10)
**Which of these statements can fill in the blank so that the `Helper` class compiles successfully? (Choose all that apply.)**

```java
2:  public class Helper {
3:     public static <U extends Exception>
4:        void printException(U u) {
5:
6:        System.out.println(u.getMessage());
7:     }
8:     public static void main(String[] args) {
9:        Helper.____________________________________________;
10:    } }
```

* A. `printException(new FileNotFoundException("A"))`
* B. `printException(new Exception("B"))`
* C. `<Throwable>printException(new Exception("C"))`
* D. `<NullPointerException>printException(new NullPointerException("D"))`
* E. `printException(new Throwable("E"))`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, B, D**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The generic type must be `Exception` or a subclass of `Exception` since this is an upper bound, making options A and B correct. Options C and E are wrong because `Throwable` is a superclass of `Exception`. Additionally, option D is correct despite the odd syntax by explicitly listing the type. You should still be able to recognize it as acceptable.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Phương thức `printException` có khai báo kiểu generic: `<U extends Exception>`. Đây là một **Upper Bound**, nghĩa là kiểu `U` bắt buộc phải là `Exception` hoặc một lớp con kế thừa từ `Exception`.
    * **Xét A:** `FileNotFoundException` là con của `IOException`, kế thừa từ `Exception` → Hợp lệ.
    * **Xét B:** `Exception` khớp chính xác với upper bound `Exception` → Hợp lệ.
    * **Xét C:** Chỉ định tường minh `<Throwable>` trước tên phương thức. Vì `Throwable` là lớp cha của `Exception` (không thoả mãn điều kiện `extends Exception`) → Bị lỗi biên dịch.
    * **Xét D:** Cú pháp chỉ định generic type tường minh: `Helper.<NullPointerException>printException(...)`. Kiểu `NullPointerException` là lớp con của `Exception`, thoả mãn hoàn toàn ràng buộc → Hợp lệ.
    * **Xét E:** `Throwable` là lớp cha của `Exception`, vi phạm upper bound → Bị lỗi biên dịch.
    * **Bẫy thi cần nhớ:** Cú pháp gọi generic method với type argument tường minh được đặt ngay trước tên phương thức: `ClassName.<Type>methodName()`.
</details>

---

### Question 11 (Câu 11)
**Which of the following will compile when filling in the blank? (Choose all that apply.)**

```java
var list = List.of(1, 2, 3);
var set = Set.of(1, 2, 3);
var map = Map.of(1, 2, 3, 4);

____________.forEach(System.out::println);
```

* A. `list`
* B. `set`
* C. `map`
* D. `map.keys()`
* E. `map.keySet()`
* F. `map.values()`
* G. `map.valueSet()`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, B, E, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `forEach()` method works with a `Collection`, such as `List` or a `Set`. Therefore, options A and B are correct. Additionally, options E and F return a `Set` and `Collection`, respectively, and can be used as well. Options D and G refer to methods that do not exist. Option C is tricky because a `Map` does have a `forEach()` method. However, it uses two lambda parameters rather than one. Since there is no matching `System.out.println` method, it does not compile.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Phương thức `forEach` của `Iterable` / `Collection` nhận vào một `Consumer<T>` (1 tham số) → Hoàn toàn tương thích với method reference `System.out::println`.
    * Do đó, `list` (List) và `set` (Set) điền vào đều biên dịch thành công → Chọn **A, B**.
    * `map.keySet()` trả về một `Set<K>`, `map.values()` trả về một `Collection<V>` → Cả hai đều là Collection và có `forEach(Consumer)` → Chọn **E, F**.
    * **Xét C (`map`):** Giao diện `Map` cũng có phương thức `forEach()`, nhưng nó nhận vào một **`BiConsumer<K, V>`** (nhận 2 tham số: key và value). Trong khi đó, `System.out::println` chỉ nhận 0 hoặc 1 tham số, không có overload nào nhận 2 tham số → Bị lỗi biên dịch!
    * **Xét D & G:** Không có phương thức nào tên là `keys()` hay `valueSet()` trong giao diện `Map` (chỉ có `keySet()` và `values()`).
    * **Bẫy thi cần nhớ:** `Collection.forEach` nhận `Consumer<T>` (1 tham số). `Map.forEach` nhận `BiConsumer<K, V>` (2 tham số).
</details>

---

### Question 12 (Câu 12)
**Which of these statements can fill in the blank so that the `Wildcard` class compiles successfully? (Choose all that apply.)**

```java
3:  public class Wildcard {
4:     public void showSize(List<?> list) {
5:        System.out.println(list.size());
6:     }
7:     public static void main(String[] args) {
8:        Wildcard card = new Wildcard();
9:        _________________________________________;
10:       card.showSize(list);
11:    } }
```

* A. `List<?> list = new HashSet <String>()`
* B. `ArrayList<? super Date> list = new ArrayList<Date>()`
* C. `List<?> list = new ArrayList<?>()`
* D. `List<Exception> list = new LinkedList<java.io.IOException>()`
* E. `ArrayList <? extends Number> list = new ArrayList <Integer>()`
* F. None of the above

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `showSize()` method can take any type of `List` since it uses an unbounded wildcard. Option A is incorrect because it is a `Set` and not a `List`. Option C is incorrect because the wildcard is not allowed to be on the right side of an assignment. Option D is incorrect because the generic types are not compatible. Option B is correct because a lower-bounded wildcard allows that same type to be the generic. Option E is correct because `Integer` is a subclass of `Number`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Phương thức `showSize(List<?> list)` nhận bất kỳ đối tượng nào triển khai `List`.
    * **Xét A:** `new HashSet<String>()` là một `Set`, không phải `List` → Lỗi biên dịch ở dòng 9.
    * **Xét B:** `<? super Date>` cho phép vế phải là `Date` hoặc lớp cha của nó. Vế phải là `ArrayList<Date>` → Dòng 9 hợp lệ. `ArrayList` là kiểu con của `List` nên dòng 10 gọi `showSize(list)` hoàn toàn hợp lệ → Chọn **B**.
    * **Xét C:** Ký tự đại diện `?` không được phép xuất hiện ở vế phải toán tử `new` (`new ArrayList<?>()` bị lỗi biên dịch) → Sai.
    * **Xét D:** Generics là invariant, `LinkedList<IOException>` không thể gán cho `List<Exception>` → Lỗi biên dịch ở dòng 9.
    * **Xét E:** `<? extends Number>` cho phép vế phải là `Integer` (vì `Integer` là con của `Number`). Vế phải là `ArrayList<Integer>` → Dòng 9 hợp lệ. Dòng 10 truyền `list` vào phương thức nhận `List<?>` hoàn toàn hợp lệ → Chọn **E**.
    * **Bẫy thi cần nhớ:** Toán tử `new` không bao giờ đi kèm wildcard `<?>`. Muốn dùng generic polymorphism giữa các kiểu lồng nhau bắt buộc phải có wildcard (`? extends` hoặc `? super`).
</details>

---

### Question 13 (Câu 13)
**What is the result of the following program?**

```java
3:  public record Sorted(int num, String text)
4:     implements Comparable<Sorted>, Comparator<Sorted> {
5:
6:     public String toString() { return "" + num; }
7:     public int compareTo(Sorted s) {
8:        return text.compareTo(s.text);
9:     }
10:    public int compare(Sorted s1, Sorted s2) {
11:       return s1.num - s2.num;
12:    }
13:    public static void main(String[] args) {
14:       var s1 = new Sorted(88, "a");
15:       var s2 = new Sorted(55, "b");
16:       SequencedSet<Sorted> t1 = new TreeSet<Sorted>();
17:       t1.add(s1); t1.add(s2);
18:       var t2 = new TreeSet<Sorted>(s1);
19:       t2.add(s1); t2.add(s2);
20:       System.out.println(t1 + " " + t2);
21:    } }
```

* A. `[55, 88] [55, 88]`
* B. `[55, 88] [88, 55]`
* C. `[88, 55] [55, 88]`
* D. `[88, 55] [88, 55]`
* E. The code does not compile.
* F. A runtime exception is thrown.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **C (`[88, 55] [55, 88]`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** This question is difficult because it defines both `Comparable` and `Comparator` on the same object. The `t1` object doesn’t specify a `Comparator`, so it uses the `Comparable` object’s `compareTo()` method. This sorts by the `text` instance variable. The `t2` object does specify a `Comparator` when calling the constructor, so it uses the `compare()` method, which sorts by the `int`. This gives us option C as the answer. Note that the `SequencedSet` reference on line 16 does not change the ordering, as the underlying object is still a `TreeSet`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Lớp `Sorted` vừa triển khai `Comparable<Sorted>` (so sánh theo `text` ở dòng 8) vừa triển khai `Comparator<Sorted>` (so sánh theo `num` ở dòng 11).
    * Hai đối tượng được tạo: `s1(88, "a")` và `s2(55, "b")`.
    * **Với `t1` (Dòng 16–17):**
      * Khởi tạo `new TreeSet<Sorted>()` bằng constructor mặc định không truyền `Comparator`.
      * Do đó, `t1` sẽ sắp xếp theo **thứ tự tự nhiên** thông qua `Comparable.compareTo()`.
      * Phương thức `compareTo` so sánh theo trường `text`: `"a".compareTo("b") < 0`, tức là `s1` ("a") đứng trước `s2` ("b").
      * In ra `t1` (gọi `toString()` in ra trường `num`): `[88, 55]`.
    * **Với `t2` (Dòng 18–19):**
      * Khởi tạo `new TreeSet<Sorted>(s1)`. Vì `s1` triển khai giao diện `Comparator<Sorted>`, nó được truyền vào constructor của `TreeSet` như một **Comparator tuỳ biến**.
      * Do đó, `t2` sẽ sắp xếp dựa trên phương thức `compare()` của `s1`.
      * Phương thức `compare` so sánh theo trường `num`: `s1.num - s2.num` = `88 - 55 > 0`, tức là số 55 đứng trước số 88 (`s2` đứng trước `s1`).
      * In ra `t2`: `[55, 88]`.
    * Kết hợp lại in ra: `[88, 55] [55, 88]` → Đáp án **C**.
    * **Bẫy thi cần nhớ:** Nếu `TreeSet` không được truyền `Comparator` vào constructor, nó dùng `Comparable.compareTo()`. Nếu có truyền `Comparator`, nó ưu tiên dùng `Comparator.compare()`.
</details>

---

### Question 14 (Câu 14)
**What is the result of the following code?**

```java
Comparator<Integer> c1 = (o1, o2) -> o2 - o1;
Comparator<Integer> c2 = Comparator.naturalOrder();
Comparator<Integer> c3 = Comparator.reverseOrder();

var list = Arrays.asList(5, 4, 7, 2);
Collections.sort(list, _____________);
Collections.reverse(list);
Collections.reverse(list);
System.out.println(Collections.binarySearch(list, 2));
```

* A. One or more of the comparators can fill in the blank so that the code prints `0`.
* B. One or more of the comparators can fill in the blank so that the code prints `1`.
* C. One or more of the comparators can fill in the blank so that the code prints `2`.
* D. The result is undefined regardless of which comparator is used.
* E. A runtime exception is thrown regardless of which comparator is used.
* F. The code does not compile.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** When using `binarySearch()`, the `List` must be sorted in the same order that the `Comparator` uses. Since the `binarySearch()` method does not specify a `Comparator` explicitly, the default sort order is used. Only `c2` uses that sort order and correctly identifies that the value `2` is at index `0`. Therefore, option A is correct. The other two comparators sort in descending order. Therefore, the precondition for `binarySearch()` is not met, and the result is undefined for those two. The two calls to `reverse()` are just there to distract you; they cancel each other out.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Danh sách ban đầu: `[5, 4, 7, 2]`.
    * Hai dòng `Collections.reverse(list); Collections.reverse(list);` liên tiếp sẽ đảo ngược 2 lần, triệt tiêu lẫn nhau và giữ nguyên trật tự danh sách như ngay sau khi gọi `Collections.sort`.
    * Dòng cuối gọi: `Collections.binarySearch(list, 2)`.
      * **Lưu ý quy tắc của `binarySearch`:** Khi không truyền `Comparator` vào `binarySearch()`, phương thức này mặc định coi danh sách đã được sắp xếp theo **thứ tự tự nhiên (tăng dần)**!
      * Nếu danh sách chưa được sắp xếp tăng dần, kết quả tìm kiếm là **không xác định (undefined)**.
    * Bây giờ xét các comparator điền vào chỗ trống:
      * `c1` (`o2 - o1`) sắp xếp giảm dần: `[7, 5, 4, 2]` → Không phải thứ tự tự nhiên → Kết quả undefined.
      * `c3` (`reverseOrder()`) sắp xếp giảm dần → Kết quả undefined.
      * `c2` (`naturalOrder()`) sắp xếp tăng dần theo thứ tự tự nhiên: `[2, 4, 5, 7]`.
      * Khi danh sách là `[2, 4, 5, 7]`, số `2` nằm ngay tại **chỉ số 0 (index 0)**. `binarySearch(list, 2)` tìm thấy và trả về kết quả là `0`.
    * Do đó, khi điền `c2`, chương trình in ra `0` → Đáp án đúng là **A**.
    * **Bẫy thi cần nhớ:** `Collections.binarySearch(list, key)` yêu cầu danh sách phải sắp xếp tăng dần tự nhiên. Nếu sắp xếp bằng Comparator tuỳ biến, phải dùng overload `Collections.binarySearch(list, key, comparator)`.
</details>

---

### Question 15 (Câu 15)
**Which of the following lines can be inserted to make the code compile? (Choose all that apply.)**

```java
class W {}
class X extends W {}
class Y extends X {}
class Z<Y> {
   // INSERT CODE HERE
}
```

* A. `W w1 = new W();`
* B. `W w2 = new X();`
* C. `W w3 = new Y();`
* D. `Y y1 = new W();`
* E. `Y y2 = new X();`
* F. `Y y3 = new Y();`

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, B**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** `Y` is both a class and a type parameter. This means that within the class `Z`, when we refer to `Y`, it uses the type parameter. All of the choices that mention class `Y` are incorrect because it no longer means the class `Y`. Only options A and B are correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Hãy quan sát kỹ khai báo lớp: `class Z<Y>`.
    * Chữ cái `Y` ở đây là một **Generic Type Parameter (tham số kiểu)** của lớp `Z`, chứ **không phải** là lớp `class Y extends X` đã khai báo ở trên! Tham số kiểu `Y` này đã che khuất (*shadow*) hoàn toàn lớp `Y`.
    * Bên trong thân lớp `Z`:
      * `Y` được đối xử như một kiểu dữ liệu generic chưa xác định (tương tự như `T` hay `E`).
      * Vì `Y` là type parameter, bạn **không thể** gọi `new Y()` (bị cấm do cơ chế xoá kiểu). Do đó các dòng C và F (`new Y()`) đều bị lỗi biên dịch.
      * Bạn cũng không thể gán một đối tượng cụ thể `new W()` hay `new X()` cho biến kiểu generic `Y` mà không ép kiểu. Do đó các dòng D và E đều bị lỗi biên dịch.
    * Trong khi đó:
      * Dòng A: `W w1 = new W();` khởi tạo bình thường lớp `W` → Hợp lệ.
      * Dòng B: `W w2 = new X();` gán đối tượng lớp con `X` cho tham chiếu lớp cha `W` → Đa hình thông thường, hoàn toàn hợp lệ.
    * Vì vậy, chỉ có **A và B** biên dịch thành công.
    * **Bẫy thi cần nhớ:** Đặt tên Type Parameter trùng với tên một Class có sẵn (ví dụ `<Y>`) sẽ che khuất Class đó trong phạm vi thân lớp generic. Bạn không bao giờ được phép `new T()`.
</details>

---

### Question 16 (Câu 16)
**Which options are true of the following code? (Choose all that apply.)**

```java
_____________ q = new LinkedList<>();
var u = Collections.unmodifiableCollection(q);
q.add(10);
q.add(12);
q.remove(1);
System.out.print(u);
```

* A. If we fill in the blank with `List<Integer>`, the output is `[10]`.
* B. If we fill in the blank with `Queue<Integer>`, the output is `[10]`.
* C. If we fill in the blank with `var`, the output is `[10]`.
* D. One or more of the scenarios does not compile.
* E. One or more of the scenarios throws a runtime exception.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, C**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** A `LinkedList` implements both `List` and `Queue`. The `List` interface has a method to remove by index. Since this method exists, Java does not autobox to call the other method, making the output `[10]` and option A correct. Similarly, option C is correct because the method to remove an element by index is available on a `LinkedList<Object>` (which is what `var` represents here). By contrast, `Queue` has only the remove by object method, so Java does autobox there. Since the number `1` is not in the list, Java does not remove anything for the `Queue`, and the output is `[10, 12]`. The `unmodifiableCollection()` call is a distractor as it is an unmodifiable view and the underlying connection can be changed.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Lớp `LinkedList` triển khai cả hai giao diện `List` và `Queue`.
    * **Kịch bản 1: Điền `List<Integer>`:**
      * Giao diện `List` có 2 phương thức `remove`: `remove(int index)` và `remove(Object o)`.
      * Lệnh `q.remove(1)` nhận tham số nguyên thuỷ `1` (primitive `int`), Java ưu tiên gọi chính xác `remove(int index)` mà không autobox.
      * Ban đầu `q` có `[10, 12]`. Gọi `remove(1)` sẽ xoá phần tử tại **chỉ số 1** (là số 12).
      * `q` còn lại `[10]`. Biến `u` là một unmodifiable view của `q` (vẫn phản ánh sự thay đổi của collection gốc). In `u` ra `[10]` → **A đúng**.
    * **Kịch bản 2: Điền `Queue<Integer>`:**
      * Giao diện `Queue` **KHÔNG CÓ** phương thức `remove(int index)`. Nó chỉ kế thừa phương thức `boolean remove(Object o)` từ `Collection`.
      * Do đó, khi gọi `q.remove(1)`, Java bắt buộc phải **autobox** số `1` thành `Integer.valueOf(1)`.
      * Phương thức sẽ tìm đối tượng có giá trị bằng `1` để xoá. Nhưng trong danh sách chỉ có `10` và `12`, không có số `1`. Vì vậy không có phần tử nào bị xoá!
      * `q` vẫn giữ nguyên `[10, 12]`, in ra `[10, 12]` → **B sai**.
    * **Kịch bản 3: Điền `var`:**
      * Với `var`, kiểu của `q` được suy luận là `LinkedList<Object>`.
      * Lớp `LinkedList` có sẵn phương thức `remove(int index)` của `List`, do đó nó gọi `remove(int index)` xoá phần tử tại vị trí 1 → In ra `[10]` → **C đúng**.
    * **Bẫy thi cần nhớ:** `List` có `remove(int index)` (xoá theo vị trí). `Queue` chỉ có `remove(Object o)` (xoá theo giá trị đối tượng).
</details>

---

### Question 17 (Câu 17)
**What is the result of the following code?**

```java
4: Map m = new HashMap();
5: m.put(123, "456");
6: m.put("abc", "def");
7: System.out.println(m.contains("123"));
```

* A. `false`
* B. `true`
* C. Compiler error on line 4.
* D. Compiler error on line 5.
* E. Compiler error on line 7.
* F. A runtime exception is thrown.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **E (Compiler error on line 7)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** This question looks like it is about generics, but it’s not. It is trying to see whether you noticed that `Map` does not have a `contains()` method. It has `containsKey()` and `containsValue()` instead, making option E the answer. If `containsKey()` were called, the answer would be `false` because `123` is an `Integer` key in the `Map`, rather than a `String`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Câu hỏi này thoạt nhìn như kiểm tra về raw type và ép kiểu generics, nhưng thực chất là kiểm tra API của `Map`.
    * Giao diện `Collection` có phương thức `contains(Object o)`.
    * **Giao diện `Map` KHÔNG CÓ phương thức nào tên là `contains(Object o)`!**
    * Thay vào đó, `Map` tách biệt thành hai phương thức riêng biệt:
      * `boolean containsKey(Object key)`
      * `boolean containsValue(Object value)`
    * Vì vậy, lời gọi `m.contains("123")` tại dòng 7 dẫn đến **LỖI BIÊN DỊCH** → Đáp án **E**.
    * **Bẫy thi cần nhớ:** `Collection` dùng `contains()`. `Map` KHÔNG CÓ `contains()`, chỉ có `containsKey()` và `containsValue()`.
</details>

---

### Question 18 (Câu 18)
**What is the result of the following code? (Choose all that apply.)**

```java
48: var map = Map.of(1, 2, 3, 6);
49: var list = List.copyOf(map.entrySet());
50:
51: List<Integer> one = List.of(8, 16, 2);
52: var copy = List.copyOf(one);
53: var copyOfCopy = List.copyOf(copy);
54: var thirdCopy = new ArrayList<>(copyOfCopy);
55:
56: list.replaceAll(x -> x * 2);
57: one.replaceAll(x -> x * 2);
58: thirdCopy.replaceAll(x -> x * 2);
59:
60: System.out.println(thirdCopy);
```

* A. One line fails to compile.
* B. Two lines fail to compile.
* C. Three lines fail to compile.
* D. The code compiles but throws an exception at runtime.
* E. If any lines with compiler errors are removed, the code throws an exception at runtime.
* F. If any lines with compiler errors are removed, the code prints `[16, 32, 4]`.
* G. The code compiles and prints `[16, 32, 4]` without any changes.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **A, E**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The key to this question is keeping track of the types. Line 48 is a `Map<Integer, Integer>`. Line 49 builds a `List` out of a `Set` of `Entry` objects, giving us `List<Entry<Integer, Integer>>`. This causes a compiler error on line 56 since we can’t multiply an `Entry` object by two. Lines 51–54 are all of type `List<Integer>`. The first three are immutable, and the one on line 54 is mutable. This means line 57 throws an `UnsupportedOperationException` since we attempt to modify the list. Line 58 would work if we could get to it. Since there is one compiler error and one runtime error, options A and E are correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 48: `Map.of(1, 2, 3, 6)` tạo ra một `Map<Integer, Integer>`.
    * Dòng 49: `map.entrySet()` trả về `Set<Map.Entry<Integer, Integer>>`. Do đó `list` có kiểu là `List<Map.Entry<Integer, Integer>>`.
    * Dòng 56: `list.replaceAll(x -> x * 2);`. Biến `x` ở đây là một đối tượng `Map.Entry`, **không thể thực hiện phép nhân toán học `x * 2`** → **Dòng 56 bị LỖI BIÊN DỊCH** (chỉ có duy nhất dòng 56 lỗi biên dịch → chọn **A**).
    * Dòng 51–53: `one`, `copy`, `copyOfCopy` đều là các danh sách bất biến (**immutable lists**) được tạo bởi `List.of()` và `List.copyOf()`.
    * Dòng 57: `one.replaceAll(x -> x * 2);`. Mặc dù biên dịch được, nhưng vì `one` là danh sách bất biến, thao tác `replaceAll` sửa đổi phần tử sẽ ném ra **`UnsupportedOperationException` tại runtime** → chọn **E**.
    * Dòng 54: `thirdCopy` được bọc trong `new ArrayList<>()` nên nó là một danh sách có thể thay đổi (**mutable**). Nếu dòng 56 và 57 được loại bỏ, dòng 58 sẽ nhân đôi từng phần tử và dòng 60 in ra `[16, 32, 4]`.
    * **Bẫy thi cần nhớ:** `List.copyOf()` luôn tạo ra collection bất biến. `replaceAll()` cố gắng sửa danh sách bất biến sẽ ném `UnsupportedOperationException`.
</details>

---

### Question 19 (Câu 19)
**What code change is needed to make the method compile, assuming there is no class named `T`?**

```java
public static T identity(T t) {
   return t;
}
```

* A. Add `<T>` after the `public` keyword.
* B. Add `<T>` after the `static` keyword.
* C. Add `<T>` after `T`.
* D. Add `<?>` after the `public` keyword.
* E. Add `<?>` after the `static` keyword.
* F. No change is required. The code already compiles.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** When using generic types in a method, the generic specification goes before the return type, so option B is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Trong một **Generic Method (phương thức tổng quát)**, việc khai báo tham số kiểu `<T>` bắt buộc phải nằm **ngay trước kiểu trả về** của phương thức.
    * Ở đây, kiểu trả về là `T`, trước nó là các bổ từ `public static`.
    * Do đó, vị trí hợp lệ duy nhất để khai báo `<T>` là ngay sau `static` và trước kiểu trả về:
      ```java
      public static <T> T identity(T t) { return t; }
      ```
    * Vì vậy, lựa chọn chính xác là **B**.
    * **Bẫy thi cần nhớ:** Cú pháp generic method luôn là: `[access_specifier] [static/final] <T> ReturnType methodName(params)`.
</details>

---

### Question 20 (Câu 20)
**Assuming keys are printed in order, what is the result of the following?**

```java
var map = new HashMap<Integer, Integer>();
map.put(1, 10);
map.put(2, 20);
map.put(3, null);
map.merge(1, 3, (a, b) -> a + b);
map.merge(3, 3, (a, b) -> a + b);
System.out.println(map);
```

* A. `{1=10, 2=20}`
* B. `{1=10, 2=20, 3=null}`
* C. `{1=10, 2=20, 3=3}`
* D. `{1=13, 2=20}`
* E. `{1=13, 2=20, 3=null}`
* F. `{1=13, 2=20, 3=3}`
* G. The code does not compile.
* H. An exception is thrown.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **F (`{1=13, 2=20, 3=3}`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The first call to `merge()` calls the mapping function and adds the numbers to get `13`. It then updates the map. The second call to `merge()` sees that the map currently has a `null` value for that key. It does not call the mapping function but instead replaces it with the new value of `3`. Therefore, option F is correct.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Ban đầu: `map = {1=10, 2=20, 3=null}`.
    * **Lệnh `map.merge(1, 3, (a, b) -> a + b)`:**
      * Key `1` đã tồn tại với giá trị hiện tại là `10` (khác `null`).
      * Hàm ánh xạ `BiFunction` được gọi: `a = 10` (giá trị cũ), `b = 3` (giá trị mới).
      * `10 + 3 = 13`. Giá trị của key `1` được cập nhật thành `13`.
    * **Lệnh `map.merge(3, 3, (a, b) -> a + b)`:**
      * Key `3` đang có giá trị liên kết là **`null`**.
      * **Quy tắc đặc thù của `Map.merge()`:** Nếu key chưa tồn tại, HOẶC đang có giá trị liên kết là `null`, thì `merge()` sẽ **không gọi hàm ánh xạ (mapping function)**! Thay vào đó, nó gán trực tiếp giá trị mới (`3`) vào map cho key đó.
      * Do đó, key `3` được cập nhật giá trị mới là `3`.
    * Kết quả trong map: `{1=13, 2=20, 3=3}` → Đáp án **F**.
    * **Bẫy thi cần nhớ:** Nếu key chưa có hoặc giá trị hiện tại là `null`, `map.merge()` sẽ gán thẳng giá trị mới mà không thèm gọi mapping function!
</details>

---

### Question 21 (Câu 21)
**Which of the following statements are true? (Choose all that apply.)**

* A. `Comparable` is in the `java.util` package.
* B. `Comparator` is in the `java.util` package.
* C. `compare()` is in the `Comparable` interface.
* D. `compare()` is in the `Comparator` interface.
* E. `compare()` takes one method parameter.
* F. `compare()` takes two method parameters.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B, D, F**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The `java.lang.Comparable` interface is implemented on the object to compare. It specifies the `compareTo()` method, which takes one parameter. The `java.util.Comparator` interface specifies the `compare()` method, which takes two parameters. This gives us options B, D, and F as the answers.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Bảng so sánh kinh điển của kỳ thi OCP giữa `Comparable` và `Comparator`:
      * `Comparable`: Nằm trong gói **`java.lang`** (không cần import). Phương thức trừu tượng duy nhất là **`compareTo(T o)`** (nhận **1** tham số).
      * `Comparator`: Nằm trong gói **`java.util`** (phải import). Phương thức trừu tượng duy nhất là **`compare(T o1, T o2)`** (nhận **2** tham số).
    * Do đó:
      * A sai (`Comparable` ở `java.lang`).
      * B đúng (`Comparator` ở `java.util`).
      * C sai (`Comparable` chứa `compareTo`, không phải `compare`).
      * D đúng (`Comparator` chứa `compare`).
      * E sai (`compare` nhận 2 tham số).
      * F đúng (`compare` nhận 2 tham số).
    * **Bẫy thi cần nhớ:** `Comparable` → `java.lang` → `compareTo(1 tham số)`. `Comparator` → `java.util` → `compare(2 tham số)`.
</details>

---

### Question 22 (Câu 22)
**What is the output of the following code snippet?**

```java
21: SequencedMap<Integer, String> cats = new TreeMap<>();
22: cats.put(3, "Snowball");
23: cats.put(2, "Sugar");
24: cats.put(1, "Minnie Mouse");
25: cats.pollFirstEntry();
26: var id = cats.lastEntry().getKey();
27: cats.pollFirstEntry();
28: System.out.print(cats.firstEntry().getValue());
```

* A. `Minnie Mouse`
* B. `Snowball`
* C. `Sugar`
* D. The code does not compile.
* E. The code compiles, but an exception is thrown at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **B (`Snowball`)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** The code compiles and runs without issue, so options D and E are incorrect. A `TreeMap` sorts its items in the natural order of keys (not the values). Therefore, lines 25 and 27 remove `[1, Minnie Mouse]` and `[2, Sugar]`, respectively. Line 26 has no impact on the map. On line 28, `Snowball` is printed, making option B correct. If line 26 were changed to use `pollLastEntry()`, then the map would be empty and line 28 would throw a `NullPointerException` trying to call `getValue()`.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * Dòng 21 khai báo `SequencedMap` tham chiếu đến `TreeMap`. Trong Java 21, `TreeMap` triển khai `SequencedMap` → Biên dịch hoàn toàn hợp lệ.
    * Dòng 22–24 đưa 3 cặp key-value vào `TreeMap`. Vì là `TreeMap`, các cặp được tự động sắp xếp theo thứ tự tự nhiên của **Key**:
      * Entry đầu: `1 -> "Minnie Mouse"`
      * Entry giữa: `2 -> "Sugar"`
      * Entry cuối: `3 -> "Snowball"`
    * Dòng 25: `cats.pollFirstEntry()` lấy và xoá entry đầu tiên (`1 -> "Minnie Mouse"`).
      * Map còn lại: `[2 -> "Sugar", 3 -> "Snowball"]`.
    * Dòng 26: `cats.lastEntry().getKey()` lấy key của entry cuối cùng (trả về `3`). Chú ý: `lastEntry()` chỉ đọc chứ **không xoá**.
    * Dòng 27: `cats.pollFirstEntry()` tiếp tục lấy và xoá entry đầu tiên hiện tại (`2 -> "Sugar"`).
      * Map còn lại duy nhất một entry: `[3 -> "Snowball"]`.
    * Dòng 28: `cats.firstEntry().getValue()` đọc giá trị của entry đầu tiên còn lại → chính là `"Snowball"`.
    * In ra màn hình: `Snowball` → Đáp án **B**.
    * **Bẫy thi cần nhớ:** `pollFirstEntry()` vừa lấy vừa xoá; `firstEntry()` và `lastEntry()` chỉ đọc mà không làm thay đổi Map.
</details>

---

### Question 23 (Câu 23)
**What is the output of the following code snippet?**

```java
var fishes = new TreeSet<String>();
fishes.add("Koi");
fishes.addFirst("clown");
fishes.add("carp");
for(var fish : fishes)
   System.out.print(fish + ", ");
```

* A. `carp, clown, Koi, `
* B. `carp, Koi, clown, `
* C. `clown, carp, Koi, `
* D. `clown, Koi, carp, `
* E. `Koi, carp, clown, `
* F. `Koi, clown, carp, `
* G. The code does not compile.
* H. The code compiles but throws an exception at runtime.

<details>
<summary><b>👉 View Answer & Detailed Explanation (Xem Đáp Án & Giải Thích Chi Tiết)</b></summary>

* **Đáp án đúng (Correct Answer):** **H (The code compiles but throws an exception at runtime)**
* **Giải thích chuyên sâu:**
  * **📘 Official Book Explanation (English):** `TreeSet` is a `SequencedSet`, so it does have an `addFirst()` method. For this reason, the code does compile. Unfortunately, `addFirst()` is not supported at runtime, as inserting an element at the front of the `TreeSet` could violate the `Comparator` of the `TreeSet`. For this reason, the code program throws an `UnsupportedOperationException` on the third line.
  * **🇻🇳 Phân tích chi tiết (Tiếng Việt):**
    * **Về mặt biên dịch:** Trong Java 21, `TreeSet` triển khai `NavigableSet`, và `NavigableSet` kế thừa giao diện mới `SequencedSet`. Giao diện `SequencedSet` định nghĩa phương thức `addFirst(E e)`. Do đó, `fishes.addFirst("clown")` **hoàn toàn hợp lệ về mặt cú pháp biên dịch** (không bị lỗi compiler).
    * **Về mặt thời điểm chạy (Runtime):**
      * Cấu trúc `TreeSet` yêu cầu tất cả các phần tử phải tuân thủ nghiêm ngặt theo trật tự sắp xếp đã định (`Comparable` hoặc `Comparator`).
      * Việc ép buộc chèn một phần tử vào vị trí đầu tiên (`addFirst`) hoặc cuối cùng (`addLast`) có thể phá vỡ tính đúng đắn của cây tìm kiếm tự cân bằng.
      * Vì lý do này, tài liệu đặc tả Java 21 (JEP 431) quy định rằng phương thức `addFirst()` và `addLast()` trên `TreeSet` sẽ **ném ra `UnsupportedOperationException`** tại thời điểm chạy!
    * Do đó, chương trình biên dịch thành công nhưng bị dừng lại ngay tại dòng `fishes.addFirst("clown")` vì ngoại lệ runtime → Chọn **H**.
    * **Bẫy thi cần nhớ:** Đây là bẫy thi đặc trưng số 1 về Sequenced Collections trong Java 21: `TreeSet` có phương thức `addFirst()` / `addLast()` nhưng khi gọi sẽ ném `UnsupportedOperationException`!
</details>
