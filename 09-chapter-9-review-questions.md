# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chapter 9: Collections and Generics

> **Nguồn trích dẫn:** *OCP Oracle Certified Professional Java SE 21 Developer Study Guide (Exam 1Z0-830)* — Jeanne Boyarsky & Scott Selikoff (Trang 831–842).  
> **Số lượng:** 23 câu hỏi trắc nghiệm chuẩn kỳ thi Oracle kèm phân tích & đáp án chi tiết (Trang 1377–1383).  
> **Cách học:** Bạn hãy tự đọc đề và suy luận đáp án trước, sau đó bấm vào mục **"🔍 Xem Đáp Án & Giải Thích Chi Tiết"** để kiểm tra và khắc sâu các bẫy thi của Oracle.

---

### Câu 1 (Question 1)
**Giả sử bạn cần hiển thị một tập hợp các sản phẩm đang bán (có thể chứa các phần tử trùng lặp). Ngoài ra, bạn có một tập hợp các đơn hàng cần theo dõi, được sắp xếp theo thứ tự tự nhiên của mã đơn hàng (sale ID), và bạn cần lấy ra phần mô tả văn bản của mỗi đơn hàng. Hai lớp nào sau đây phù hợp nhất cho mỗi kịch bản trên? (Chọn hai đáp án.)**

* A. `ArrayList`
* B. `HashMap`
* C. `HashSet`
* D. `LinkedList`
* E. `SequencedTreeSet`
* F. `TreeMap`

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, F**
* **Phân tích chi tiết:**
  * **Kịch bản 1 (Tập hợp sản phẩm cho phép trùng lặp):** Cần một tập hợp triển khai `List` vì List cho phép phần tử trùng lặp (`duplicates`). Lựa chọn thu hẹp về `ArrayList` (A) và `LinkedList` (D). Ở đây `ArrayList` là lựa chọn chuẩn xác và tối ưu nhất cho kịch bản hiển thị danh sách sản phẩm thông thường (`LinkedList` vừa là List vừa là Queue/Deque, không cần thiết cho mục đích chỉ hiển thị danh sách).
  * **Kịch bản 2 (Tập hợp đơn hàng có ID duy nhất và được sắp xếp):** Vì mỗi đơn hàng có sale ID duy nhất làm khoá và chuỗi văn bản mô tả làm giá trị, ta cần một cấu trúc dạng Key-Value (triển khai giao diện `Map`). Điều này thu hẹp về `HashMap` (B) và `TreeMap` (F). Đề bài yêu cầu sắp xếp theo thứ tự tự nhiên của sale ID (*"sorted by the natural order of the sale ID"*), do đó cấu trúc bắt buộc phải dùng là `TreeMap` (F).
  * Lựa chọn E (`SequencedTreeSet`) là đáp án bẫy vì Java **hoàn toàn không có lớp nào tên là `SequencedTreeSet`** (chỉ có giao diện `SequencedSet` và lớp `TreeSet`).
* **Bẫy thi cần nhớ:** `TreeSet` và `TreeMap` luôn sắp xếp phần tử/khoá theo thứ tự tự nhiên (`Comparable`) hoặc theo `Comparator`. Không có lớp nào tên là `SequencedTreeSet`.
</details>

---

### Câu 2 (Question 2)
**Các nhận định nào sau đây là đúng về đoạn mã bên dưới? (Chọn tất cả các đáp án đúng.)**

```java
12: List<?> q = List.of("mouse", "parrot");
13: var v = List.of("mouse", "parrot");
14:
15: q.removeIf(String::isEmpty);
16: q.removeIf(s -> s.length() == 4);
17: v.removeIf(String::isEmpty);
18: v.removeIf(s -> s.length() == 4);
```

* A. Đoạn mã biên dịch và thực thi thành công không có lỗi.
* B. Có đúng 1 dòng bị lỗi biên dịch.
* C. Có đúng 2 dòng bị lỗi biên dịch.
* D. Có đúng 3 dòng bị lỗi biên dịch.
* E. Có đúng 4 dòng bị lỗi biên dịch.
* F. Nếu xoá bỏ các dòng bị lỗi biên dịch, đoạn mã chạy mà không ném ra ngoại lệ.
* G. Nếu xoá bỏ các dòng bị lỗi biên dịch, đoạn mã sẽ ném ra ngoại lệ tại thời điểm chạy (runtime).

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C, G**
* **Phân tích chi tiết:**
  * Dòng 12 khai báo `List<?> q`. Vì sử dụng Unbounded Wildcard `<?>`, trình biên dịch coi các phần tử trong `q` thuộc kiểu tổng quát `Object`.
  * Phương thức `removeIf(Predicate<? super E> filter)` trên `List<?>` sẽ kỳ vọng một predicate nhận `Object`.
  * Dòng 15 (`String::isEmpty`) và dòng 16 (`s -> s.length() == 4`) đều gọi các phương thức chỉ có ở `String` (`isEmpty()`, `length()`). Trình biên dịch không cho phép vì kiểu phần tử trong `q` chỉ được suy luận là `Object` $\rightarrow$ **Dòng 15 và dòng 16 bị LỖI BIÊN DỊCH** (Có đúng 2 dòng lỗi biên dịch $\rightarrow$ chọn **C**).
  * Dòng 13 dùng `var v = List.of(...)` nên `v` được suy luận chính xác là `List<String>`. Do đó, dòng 17 và 18 hoàn toàn hợp lệ về mặt biên dịch.
  * **Tuy nhiên:** `List.of()` tạo ra một danh sách **bất biến tuyệt đối (immutable list)**. Việc gọi `removeIf()` cố gắng sửa đổi danh sách sẽ khiến Java ném ra **`UnsupportedOperationException` tại runtime** $\rightarrow$ chọn **G**.
* **Bẫy thi cần nhớ:** Với `List<?>`, bạn không thể gọi các phương thức đặc thù của kiểu con ngoài `Object`. Ngoài ra, các collection tạo bởi `List.of()`, `Set.of()`, `Map.of()` là bất biến; bất kỳ thao tác thay đổi nào (`add`, `remove`, `removeIf`, `replaceAll`) đều ném `UnsupportedOperationException`.
</details>

---

### Câu 3 (Question 3)
**Kết quả của các câu lệnh sau là gì?**

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
* E. Đoạn mã không biên dịch được.
* F. Một ngoại lệ được ném ra tại thời điểm chạy.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B (hellohi)**
* **Phân tích chi tiết:**
  * Dòng 3 khởi tạo `ArrayDeque<String>`: `greetings = []`.
  * Dòng 4: `offerLast("hello")` $\rightarrow$ thêm vào đuôi: `["hello"]`.
  * Dòng 5: `offerLast("hi")` $\rightarrow$ thêm vào đuôi: `["hello", "hi"]`.
  * Dòng 6: `offerFirst("ola")` $\rightarrow$ thêm vào đầu: `["ola", "hello", "hi"]`.
  * Dòng 7: `pop()` tương đương với thao tác ngăn xếp (Stack LIFO), lấy và xoá phần tử ở đỉnh/đầu deque $\rightarrow$ xoá `"ola"`. Danh sách còn lại: `["hello", "hi"]`.
  * Dòng 8: `peek()` xem phần tử ở đầu danh sách mà không xoá $\rightarrow$ trả về `"hello"`, không làm thay đổi deque.
  * Dòng 9–10: Vòng lặp `while (peek() != null)` liên tục gọi `pop()`:
    * Lần 1: Lấy và in `"hello"`.
    * Lần 2: Lấy và in `"hi"`.
    * Lần 3: `peek()` trả về `null`, vòng lặp kết thúc.
  * Kết quả in ra liền nhau: `hellohi` $\rightarrow$ Đáp án **B**.
* **Bẫy thi cần nhớ:** Với `Deque`:
  * `push()` = `addFirst()` (đẩy vào đầu).
  * `pop()` = `removeFirst()` (lấy từ đầu).
  * `peek()` = `peekFirst()` (nhìn phần tử đầu).
  * `offer()` = `offerLast()` (thêm vào đuôi).
</details>

---

### Câu 4 (Question 4)
**Các câu lệnh nào sau đây biên dịch được? (Chọn tất cả các đáp án đúng.)**

* A. `HashSet<Number> hs = new HashSet<Integer>();`
* B. `HashSet<? super ClassCastException> set = new HashSet<Exception>();`
* C. `List<> list = new ArrayList<String>();`
* D. `List<Object> values = new HashSet<Object>();`
* E. `List<Object> objects = new ArrayList<? extends Object>();`
* F. `Map<String, ? extends Number> hm = new HashMap<String, Integer>();`

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, F**
* **Phân tích chi tiết:**
  * **A sai:** Generics trong Java là bất biến (invariant). Mặc dù `Integer` kế thừa `Number`, `HashSet<Integer>` **không phải** là kiểu con của `HashSet<Number>`. Muốn gán được phải dùng `HashSet<? extends Number>`.
  * **B đúng:** `<? super ClassCastException>` là Lower-bounded Wildcard, chấp nhận `ClassCastException` hoặc bất kỳ lớp cha nào của nó. Vì `Exception` là lớp cha của `ClassCastException`, phép gán này hoàn toàn hợp lệ.
  * **C sai:** Diamond operator `<>` chỉ được phép nằm ở phía bên phải toán tử gán khi khởi tạo đối tượng, không được phép nằm ở kiểu khai báo tham chiếu bên trái.
  * **D sai:** `HashSet` triển khai `Set`, không triển khai `List`, không có quan hệ kế thừa trực tiếp.
  * **E sai:** Ký tự đại diện `?` (wildcard) **tuyệt đối không được xuất hiện ở vế phải khi gọi toán tử `new`**. Khởi tạo đối tượng bắt buộc phải xác định kiểu cụ thể (`new ArrayList<Object>()`).
  * **F đúng:** `? extends Number` cho phép vế phải có kiểu giá trị là `Integer` (vì `Integer` là con của `Number`). Vế trái dùng kiểu giao diện `Map`, vế phải dùng lớp triển khai `HashMap`, kiểu khoá `String` khớp nhau $\rightarrow$ Hợp lệ 100%.
* **Bẫy thi cần nhớ:** Wildcard `?` chỉ được dùng trong khai báo tham chiếu (vế trái, tham số phương thức, kiểu trả về), KHÔNG BAO GIỜ được dùng sau từ khoá `new` ở vế phải!
</details>

---

### Câu 5 (Question 5)
**Kết quả của đoạn mã sau là gì?**

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

* A. `hi` theo sau bởi một ngoại lệ tại thời điểm chạy.
* B. `hi-1hola-true`
* C. Lỗi biên dịch đầu tiên xuất hiện ở dòng 1.
* D. Lỗi biên dịch đầu tiên xuất hiện ở dòng 3.
* E. Lỗi biên dịch đầu tiên xuất hiện ở dòng 8.
* F. Lỗi biên dịch đầu tiên xuất hiện ở một dòng khác.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B (hi-1hola-true)**
* **Phân tích chi tiết:**
  * Dòng 1 định nghĩa generic record `Hello<T>(T t)`. Record có thể sử dụng type parameter `<T>` như một generic class thông thường.
  * Dòng 2 là canonical constructor tường minh, hợp lệ.
  * Dòng 3 khai báo một **generic method** `private <T> void println(T message)`.
    * **Bẫy thi lớn:** Tham số kiểu `<T>` được khai báo tại dòng 3 là một tham số kiểu **hoàn toàn độc lập** với tham số `<T>` của record tại dòng 1 (nó làm bóng mờ - shadow - type parameter của class trong phạm vi phương thức này).
    * Do đó, `message` có thể nhận bất kỳ kiểu dữ liệu nào, không bị ràng buộc bởi kiểu `T` của đối tượng `Hello`!
  * Dòng 7: Khởi tạo `Hello<String>` với `t = "hi"`. Gọi `println(1)`, số nguyên nguyên thuỷ `1` được autobox thành `Integer` và truyền vào phương thức `println`. Dòng 4 in: `"hi" + "-" + 1` $\rightarrow$ `hi-1`.
  * Dòng 8: Khởi tạo `Hello` dưới dạng raw type (không chỉ định generic type parameter). Trình biên dịch đưa ra cảnh báo (warning) nhưng **không gây lỗi biên dịch**. Giá trị `t = "hola"`. Gọi `println(true)`, giá trị `true` autobox thành `Boolean`. Dòng 4 in: `"hola" + "-" + true` $\rightarrow$ `hola-true`.
  * Tổng kết in ra: `hi-1hola-true`.
* **Bẫy thi cần nhớ:** Khi một generic method tự khai báo `<T>`, nó che lấp `<T>` của class. Cảnh báo raw type không phải là lỗi biên dịch.
</details>

---

### Câu 6 (Question 6)
**Lựa chọn nào sau đây có thể điền vào chỗ trống để chương trình in ra `[7, 5, 3]`? (Chọn tất cả các đáp án đúng.)**

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
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, F**
* **Phân tích chi tiết:**
  * Ba đối tượng: `p1("Paula", 3)`, `p2("Peter", 5)`, `p3("Peter", 7)`.
  * Đề bài muốn in ra: `[7, 5, 3]`, tức là danh sách theo thứ tự giảm dần của `beakLength`: `p3 (7) -> p2 (5) -> p1 (3)`.
  * **Xét lựa chọn A:** `comparing(Platypus::beakLength)` sắp xếp tăng dần theo độ dài mỏ $\rightarrow$ in `[3, 5, 7]` (Sai).
  * **Xét lựa chọn B:** Thêm `.reversed()` đảo ngược lại thành giảm dần theo `beakLength` $\rightarrow$ in `[7, 5, 3]` (Đúng!).
  * **Xét lựa chọn C:** Sắp xếp theo tên tăng dần ("Paula" trước "Peter"), với tên trùng nhau sắp xếp theo beakLength tăng dần $\rightarrow$ in `[3, 5, 7]` (Sai).
  * **Xét lựa chọn D:** Sắp xếp theo tên tăng dần ("Paula" đứng đầu), chỉ đảo ngược beakLength với những ai trùng tên $\rightarrow$ "Paula" (3) vẫn đứng đầu $\rightarrow$ in `[3, 7, 5]` (Sai).
  * **Xét lựa chọn E:** Không tồn tại phương thức nào tên là `thenComparingNumber()` trong `Comparator` $\rightarrow$ Lỗi biên dịch.
  * **Xét lựa chọn F:** 
    * `Comparator.comparing(Platypus::name)`: Sắp xếp theo tên tăng dần ("Paula" < "Peter").
    * `.thenComparingInt(Platypus::beakLength)`: Tên trùng nhau thì sắp xếp theo beakLength tăng dần (5 < 7). Thứ tự lúc này: `p1("Paula", 3) -> p2("Peter", 5) -> p3("Peter", 7)`.
    * `.reversed()`: **Đảo ngược toàn bộ comparator trước đó**. Thứ tự bị đảo ngược hoàn toàn: `p3("Peter", 7) -> p2("Peter", 5) -> p1("Paula", 3)`.
    * In ra: `[7, 5, 3]` $\rightarrow$ Hoàn toàn chính xác!
* **Bẫy thi cần nhớ:** Phương thức `.reversed()` áp dụng lên toàn bộ chuỗi so sánh đứng trước nó. Không có phương thức `thenComparingNumber()` (chỉ có `thenComparing`, `thenComparingInt`, `thenComparingLong`, `thenComparingDouble`).
</details>

---

### Câu 7 (Question 7)
**Chữ ký phương thức nào sau đây là ghi đè (override) hợp lệ của phương thức `hairy()` trong lớp `Alpaca`? (Chọn tất cả các đáp án đúng.)**

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
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, F**
* **Phân tích chi tiết:**
  * **Quy tắc ghi đè phương thức có Generics trong Java:**
    1. **Danh sách tham số (Parameters):** Phải có chữ ký giống hệt sau cơ chế xoá kiểu (*Type Erasure*). Vì lớp cha nhận `List<String>`, phương thức ở lớp con cũng bắt buộc phải nhận tham số có kiểu khớp chính xác là `List<String>`. Các lựa chọn A (`List<CharSequence>`) và C (`List<Integer>`) đều làm thay đổi tham số $\rightarrow$ Sau khi xoá kiểu đều thành `hairy(List)` nhưng lại khác chữ ký generic, gây lỗi biên dịch (vừa không phải override, vừa không thể overload vì cùng raw type).
    2. **Kiểu trả về (Return Type):** Phải là kiểu hiệp biến (**Covariant return type**), nghĩa là cùng kiểu hoặc là lớp con của kiểu trả về ở lớp cha (`List<String>`).
  * Xét B: Kiểu trả về `List<String>` khớp hoàn toàn $\rightarrow$ Override hợp lệ.
  * Xét D: `List<CharSequence>` không phải là kiểu con của `List<String>` (Generics là invariant) $\rightarrow$ Sai.
  * Xét E: `Object` là kiểu cha của `List`, không phải kiểu con hiệp biến $\rightarrow$ Sai.
  * Xét F: `ArrayList<String>` là lớp con của `List<String>` $\rightarrow$ Là kiểu trả về hiệp biến hợp lệ!
* **Bẫy thi cần nhớ:** Để override phương thức có generics: tham số đầu vào phải giữ nguyên generic type, kiểu trả về được phép là subtype hiệp biến.
</details>

---

### Câu 8 (Question 8)
**Lựa chọn nào sau đây điền vào chỗ trống giúp đoạn mã biên dịch và chạy thành công mà không gặp lỗi?**

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
* E. Không có đáp án nào ở trên (None of the above)

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (None of the above)**
* **Phân tích chi tiết:**
  * Nhìn vào dòng 16: `System.out.println(animals.get(0));`.
  * Tham chiếu `animals` có kiểu khai báo là **`SequencedCollection<String>`**.
  * Giao diện `SequencedCollection` của Java 21 chỉ định nghĩa các phương thức: `addFirst()`, `addLast()`, `getFirst()`, `getLast()`, `removeFirst()`, `removeLast()`, và `reversed()`.
  * **Trong `SequencedCollection` KHÔNG HỀ CÓ phương thức `get(int index)`!** Phương thức `get(int)` chỉ thuộc về giao diện `List`.
  * Do đó, dù bạn có điền bất kỳ lớp nào vào chỗ trống ở dòng 11, **dòng 16 vẫn luôn luôn bị LỖI BIÊN DỊCH**.
  * Vì vậy, đáp án đúng bắt buộc phải là **E**.
* **Bẫy thi cần nhớ:** `SequencedCollection` cung cấp `getFirst()` và `getLast()`, chứ không có `get(int)`. Muốn dùng `get(int)` tham chiếu phải là `List`.
</details>

---

### Câu 9 (Question 9)
**Kết quả của chương trình sau là gì?**

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
* E. Đoạn mã không biên dịch được.
* F. Một ngoại lệ được ném ra tại thời điểm chạy.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A (Abb aab 123 )**
* **Phân tích chi tiết:**
  * Dòng 5: `b.toLowerCase().compareTo(a.toLowerCase())`.
    * Chú ý thứ tự so sánh: `b` được gọi `compareTo` với `a` $\rightarrow$ Đây là sắp xếp theo thứ tự **giảm dần (reverse order)**, không phân biệt hoa thường.
  * Các chuỗi ban đầu khi chuyển về chữ thường:
    * `"123"` $\rightarrow$ `"123"`
    * `"Abb"` $\rightarrow$ `"abb"`
    * `"aab"` $\rightarrow$ `"aab"`
  * Theo bảng mã ASCII tự nhiên (tăng dần): Các chữ số luôn đứng trước chữ cái: `"123"` < `"aab"` < `"abb"`.
  * Nhưng vì Comparator này đảo ngược thứ tự (`b.compareTo(a)`), thứ tự sắp xếp giảm dần sẽ là:
    1. `"abb"` lớn nhất (tương ứng với chuỗi gốc `"Abb"`)
    2. `"aab"` tiếp theo (tương ứng với chuỗi gốc `"aab"`)
    3. `"123"` nhỏ nhất (tương ứng với chuỗi gốc `"123"`)
  * Vòng lặp duyệt qua mảng đã sắp xếp và in ra: `Abb aab 123 ` $\rightarrow$ Đáp án đúng là **A**.
* **Bẫy thi cần nhớ:** So sánh `b.compareTo(a)` tương đương với việc đảo ngược thứ tự tự nhiên. Chữ cái đứng sau chữ số, nên khi đảo ngược chữ cái sẽ lên đầu.
</details>

---

### Câu 10 (Question 10)
**Những câu lệnh nào sau đây có thể điền vào chỗ trống để lớp `Helper` biên dịch thành công? (Chọn tất cả các đáp án đúng.)**

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
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B, D**
* **Phân tích chi tiết:**
  * Phương thức `printException` có khai báo kiểu generic: `<U extends Exception>`. Đây là một **Upper Bound**, nghĩa là kiểu `U` bắt buộc phải là `Exception` hoặc một lớp con kế thừa từ `Exception`.
  * **Xét A:** `FileNotFoundException` là con của `IOException`, kế thừa từ `Exception` $\rightarrow$ Hợp lệ.
  * **Xét B:** `Exception` khớp chính xác với upper bound `Exception` $\rightarrow$ Hợp lệ.
  * **Xét C:** Chỉ định tường minh `<Throwable>` trước tên phương thức. Vì `Throwable` là lớp cha của `Exception` (không thoả mãn điều kiện `extends Exception`) $\rightarrow$ Bị lỗi biên dịch.
  * **Xét D:** Cú pháp chỉ định generic type tường minh: `Helper.<NullPointerException>printException(...)`. Kiểu `NullPointerException` là lớp con của `Exception`, thoả mãn hoàn toàn ràng buộc $\rightarrow$ Hợp lệ.
  * **Xét E:** `Throwable` là lớp cha của `Exception`, vi phạm upper bound $\rightarrow$ Bị lỗi biên dịch.
* **Bẫy thi cần nhớ:** Cú pháp gọi generic method với type argument tường minh được đặt ngay trước tên phương thức: `ClassName.<Type>methodName()`.
</details>

---

### Câu 11 (Question 11)
**Lựa chọn nào sau đây điền vào chỗ trống sẽ biên dịch thành công? (Chọn tất cả các đáp án đúng.)**

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
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B, E, F**
* **Phân tích chi tiết:**
  * Phương thức `forEach` của `Iterable` / `Collection` nhận vào một `Consumer<T>` (1 tham số) $\rightarrow$ Hoàn toàn tương thích với method reference `System.out::println`.
  * Do đó, `list` (List) và `set` (Set) điền vào đều biên dịch thành công $\rightarrow$ Chọn **A, B**.
  * `map.keySet()` trả về một `Set<K>`, `map.values()` trả về một `Collection<V>` $\rightarrow$ Cả hai đều là Collection và có `forEach(Consumer)` $\rightarrow$ Chọn **E, F**.
  * **Xét C (`map`):** Giao diện `Map` cũng có phương thức `forEach()`, nhưng nó nhận vào một **`BiConsumer<K, V>`** (nhận 2 tham số: key và value). Trong khi đó, `System.out::println` chỉ nhận 0 hoặc 1 tham số, không có overload nào nhận 2 tham số $\rightarrow$ Bị lỗi biên dịch!
  * **Xét D & G:** Không có phương thức nào tên là `keys()` hay `valueSet()` trong giao diện `Map` (chỉ có `keySet()` và `values()`).
* **Bẫy thi cần nhớ:** `Collection.forEach` nhận `Consumer<T>` (1 tham số). `Map.forEach` nhận `BiConsumer<K, V>` (2 tham số).
</details>

---

### Câu 12 (Question 12)
**Những câu lệnh nào sau đây có thể điền vào chỗ trống để lớp `Wildcard` biên dịch thành công? (Chọn tất cả các đáp án đúng.)**

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

* A. `List<?> list = new HashSet<String>()`
* B. `ArrayList<? super Date> list = new ArrayList<Date>()`
* C. `List<?> list = new ArrayList<?>()`
* D. `List<Exception> list = new LinkedList<java.io.IOException>()`
* E. `ArrayList<? extends Number> list = new ArrayList<Integer>()`
* F. Không có đáp án nào ở trên

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, E**
* **Phân tích chi tiết:**
  * Phương thức `showSize(List<?> list)` nhận bất kỳ đối tượng nào triển khai `List`.
  * **Xét A:** `new HashSet<String>()` là một `Set`, không phải `List` $\rightarrow$ Lỗi biên dịch ở dòng 9.
  * **Xét B:** `<? super Date>` cho phép vế phải là `Date` hoặc lớp cha của nó. Vế phải là `ArrayList<Date>` $\rightarrow$ Dòng 9 hợp lệ. `ArrayList` là kiểu con của `List` nên dòng 10 gọi `showSize(list)` hoàn toàn hợp lệ $\rightarrow$ Chọn **B**.
  * **Xét C:** Ký tự đại diện `?` không được phép xuất hiện ở vế phải toán tử `new` (`new ArrayList<?>()` bị lỗi biên dịch) $\rightarrow$ Sai.
  * **Xét D:** Generics là invariant, `LinkedList<IOException>` không thể gán cho `List<Exception>` $\rightarrow$ Lỗi biên dịch ở dòng 9.
  * **Xét E:** `<? extends Number>` cho phép vế phải là `Integer` (vì `Integer` là con của `Number`). Vế phải là `ArrayList<Integer>` $\rightarrow$ Dòng 9 hợp lệ. Dòng 10 truyền `list` vào phương thức nhận `List<?>` hoàn toàn hợp lệ $\rightarrow$ Chọn **E**.
* **Bẫy thi cần nhớ:** Toán tử `new` không bao giờ đi kèm wildcard `<?>`. Muốn dùng generic polymorphism giữa các kiểu lồng nhau bắt buộc phải có wildcard (`? extends` hoặc `? super`).
</details>

---

### Câu 13 (Question 13)
**Kết quả của chương trình sau là gì?**

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
* E. Đoạn mã không biên dịch được.
* F. Một ngoại lệ được ném ra tại thời điểm chạy.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **C ([88, 55] [55, 88])**
* **Phân tích chi tiết:**
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
  * Kết hợp lại in ra: `[88, 55] [55, 88]` $\rightarrow$ Đáp án **C**.
* **Bẫy thi cần nhớ:** Nếu `TreeSet` không được truyền `Comparator` vào constructor, nó dùng `Comparable.compareTo()`. Nếu có truyền `Comparator`, nó ưu tiên dùng `Comparator.compare()`.
</details>

---

### Câu 14 (Question 14)
**Kết quả của đoạn mã sau là gì?**

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

* A. Một hoặc nhiều bộ so sánh có thể điền vào chỗ trống để mã in ra `0`.
* B. Một hoặc nhiều bộ so sánh có thể điền vào chỗ trống để mã in ra `1`.
* C. Một hoặc nhiều bộ so sánh có thể điền vào chỗ trống để mã in ra `2`.
* D. Kết quả là không xác định (undefined) bất kể dùng bộ so sánh nào.
* E. Một ngoại lệ được ném ra tại thời điểm chạy bất kể dùng bộ so sánh nào.
* F. Đoạn mã không biên dịch được.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Phân tích chi tiết:**
  * Danh sách ban đầu: `[5, 4, 7, 2]`.
  * Hai dòng `Collections.reverse(list); Collections.reverse(list);` liên tiếp sẽ đảo ngược 2 lần, triệt tiêu lẫn nhau và giữ nguyên trật tự danh sách như ngay sau khi gọi `Collections.sort`.
  * Dòng cuối gọi: `Collections.binarySearch(list, 2)`.
    * **Lưu ý quy tắc của `binarySearch`:** Khi không truyền `Comparator` vào `binarySearch()`, phương thức này mặc định coi danh sách đã được sắp xếp theo **thứ tự tự nhiên (tăng dần)**!
    * Nếu danh sách chưa được sắp xếp tăng dần, kết quả tìm kiếm là **không xác định (undefined)**.
  * Bây giờ xét các comparator điền vào chỗ trống:
    * `c1` (`o2 - o1`) sắp xếp giảm dần: `[7, 5, 4, 2]` $\rightarrow$ Không phải thứ tự tự nhiên $\rightarrow$ Kết quả undefined.
    * `c3` (`reverseOrder()`) sắp xếp giảm dần $\rightarrow$ Kết quả undefined.
    * `c2` (`naturalOrder()`) sắp xếp tăng dần theo thứ tự tự nhiên: `[2, 4, 5, 7]`.
    * Khi danh sách là `[2, 4, 5, 7]`, số `2` nằm ngay tại **chỉ số 0 (index 0)**. `binarySearch(list, 2)` tìm thấy và trả về kết quả là `0`.
  * Do đó, khi điền `c2`, chương trình in ra `0` $\rightarrow$ Đáp án đúng là **A**.
* **Bẫy thi cần nhớ:** `Collections.binarySearch(list, key)` yêu cầu danh sách phải sắp xếp tăng dần tự nhiên. Nếu sắp xếp bằng Comparator tuỳ biến, phải dùng overload `Collections.binarySearch(list, key, comparator)`.
</details>

---

### Câu 15 (Question 15)
**Dòng mã nào sau đây có thể chèn vào vị trí chú thích để đoạn mã biên dịch thành công? (Chọn tất cả các đáp án đúng.)**

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
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, B**
* **Phân tích chi tiết:**
  * Hãy quan sát kỹ khai báo lớp: `class Z<Y>`.
  * Chữ cái `Y` ở đây là một **Generic Type Parameter (tham số kiểu)** của lớp `Z`, chứ **không phải** là lớp `class Y extends X` đã khai báo ở trên! Tham số kiểu `Y` này đã che khuất (*shadow*) hoàn toàn lớp `Y`.
  * Bên trong thân lớp `Z`:
    * `Y` được đối xử như một kiểu dữ liệu generic chưa xác định (tương tự như `T` hay `E`).
    * Vì `Y` là type parameter, bạn **không thể** gọi `new Y()` (bị cấm do cơ chế xoá kiểu). Do đó các dòng C và F (`new Y()`) đều bị lỗi biên dịch.
    * Bạn cũng không thể gán một đối tượng cụ thể `new W()` hay `new X()` cho biến kiểu generic `Y` mà không ép kiểu. Do đó các dòng D và E đều bị lỗi biên dịch.
  * Trong khi đó:
    * Dòng A: `W w1 = new W();` khởi tạo bình thường lớp `W` $\rightarrow$ Hợp lệ.
    * Dòng B: `W w2 = new X();` gán đối tượng lớp con `X` cho tham chiếu lớp cha `W` $\rightarrow$ Đa hình thông thường, hoàn toàn hợp lệ.
  * Vì vậy, chỉ có **A và B** biên dịch thành công.
* **Bẫy thi cần nhớ:** Đặt tên Type Parameter trùng với tên một Class có sẵn (ví dụ `<Y>`) sẽ che khuất Class đó trong phạm vi thân lớp generic. Bạn không bao giờ được phép `new T()`.
</details>

---

### Câu 16 (Question 16)
**Những nhận định nào sau đây là đúng về đoạn mã bên dưới? (Chọn tất cả các đáp án đúng.)**

```java
_____________ q = new LinkedList<>();
var u = Collections.unmodifiableCollection(q);
q.add(10);
q.add(12);
q.remove(1);
System.out.print(u);
```

* A. Nếu điền vào chỗ trống `List<Integer>`, kết quả in ra là `[10]`.
* B. Nếu điền vào chỗ trống `Queue<Integer>`, kết quả in ra là `[10]`.
* C. Nếu điền vào chỗ trống `var`, kết quả in ra là `[10]`.
* D. Một hoặc nhiều kịch bản không biên dịch được.
* E. Một hoặc nhiều kịch bản ném ra ngoại lệ tại thời điểm chạy.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, C**
* **Phân tích chi tiết:**
  * Lớp `LinkedList` triển khai cả hai giao diện `List` và `Queue`.
  * **Kịch bản 1: Điền `List<Integer>`:**
    * Giao diện `List` có 2 phương thức `remove`: `remove(int index)` và `remove(Object o)`.
    * Lệnh `q.remove(1)` nhận tham số nguyên thuỷ `1` (primitive `int`), Java ưu tiên gọi chính xác `remove(int index)` mà không autobox.
    * Ban đầu `q` có `[10, 12]`. Gọi `remove(1)` sẽ xoá phần tử tại **chỉ số 1** (là số 12).
    * `q` còn lại `[10]`. Biến `u` là một unmodifiable view của `q` (vẫn phản ánh sự thay đổi của collection gốc). In `u` ra `[10]` $\rightarrow$ **A đúng**.
  * **Kịch bản 2: Điền `Queue<Integer>`:**
    * Giao diện `Queue` **KHÔNG CÓ** phương thức `remove(int index)`. Nó chỉ kế thừa phương thức `boolean remove(Object o)` từ `Collection`.
    * Do đó, khi gọi `q.remove(1)`, Java bắt buộc phải **autobox** số `1` thành `Integer.valueOf(1)`.
    * Phương thức sẽ tìm đối tượng có giá trị bằng `1` để xoá. Nhưng trong danh sách chỉ có `10` và `12`, không có số `1`. Vì vậy không có phần tử nào bị xoá!
    * `q` vẫn giữ nguyên `[10, 12]`, in ra `[10, 12]` $\rightarrow$ **B sai**.
  * **Kịch bản 3: Điền `var`:**
    * Với `var`, kiểu của `q` được suy luận là `LinkedList<Object>`.
    * Lớp `LinkedList` có sẵn phương thức `remove(int index)` của `List`, do đó nó gọi `remove(int index)` xoá phần tử tại vị trí 1 $\rightarrow$ In ra `[10]` $\rightarrow$ **C đúng**.
* **Bẫy thi cần nhớ:** `List` có `remove(int index)` (xoá theo vị trí). `Queue` chỉ có `remove(Object o)` (xoá theo giá trị đối tượng).
</details>

---

### Câu 17 (Question 17)
**Kết quả của đoạn mã sau là gì?**

```java
4: Map m = new HashMap();
5: m.put(123, "456");
6: m.put("abc", "def");
7: System.out.println(m.contains("123"));
```

* A. `false`
* B. `true`
* C. Lỗi biên dịch tại dòng 4.
* D. Lỗi biên dịch tại dòng 5.
* E. Lỗi biên dịch tại dòng 7.
* F. Một ngoại lệ được ném ra tại thời điểm chạy.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **E (Lỗi biên dịch tại dòng 7)**
* **Phân tích chi tiết:**
  * Câu hỏi này thoạt nhìn như kiểm tra về raw type và ép kiểu generics, nhưng thực chất là kiểm tra API của `Map`.
  * Giao diện `Collection` có phương thức `contains(Object o)`.
  * **Giao diện `Map` KHÔNG CÓ phương thức nào tên là `contains(Object o)`!**
  * Thay vào đó, `Map` tách biệt thành hai phương thức riêng biệt:
    * `boolean containsKey(Object key)`
    * `boolean containsValue(Object value)`
  * Vì vậy, lời gọi `m.contains("123")` tại dòng 7 dẫn đến **LỖI BIÊN DỊCH** $\rightarrow$ Đáp án **E**.
* **Bẫy thi cần nhớ:** `Collection` dùng `contains()`. `Map` KHÔNG CÓ `contains()`, chỉ có `containsKey()` và `containsValue()`.
</details>

---

### Câu 18 (Question 18)
**Kết quả của đoạn mã sau là gì? (Chọn tất cả các đáp án đúng.)**

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

* A. Có đúng một dòng không biên dịch được.
* B. Có hai dòng không biên dịch được.
* C. Có ba dòng không biên dịch được.
* D. Đoạn mã biên dịch được nhưng ném ra ngoại lệ tại thời điểm chạy.
* E. Nếu xoá các dòng bị lỗi biên dịch, đoạn mã sẽ ném ra ngoại lệ tại thời điểm chạy.
* F. Nếu xoá các dòng bị lỗi biên dịch, đoạn mã in ra `[16, 32, 4]`.
* G. Đoạn mã biên dịch và in ra `[16, 32, 4]` mà không cần thay đổi gì.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A, E**
* **Phân tích chi tiết:**
  * Dòng 48: `Map.of(1, 2, 3, 6)` tạo ra một `Map<Integer, Integer>`.
  * Dòng 49: `map.entrySet()` trả về `Set<Map.Entry<Integer, Integer>>`. Do đó `list` có kiểu là `List<Map.Entry<Integer, Integer>>`.
  * Dòng 56: `list.replaceAll(x -> x * 2);`. Biến `x` ở đây là một đối tượng `Map.Entry`, **không thể thực hiện phép nhân toán học `x * 2`** $\rightarrow$ **Dòng 56 bị LỖI BIÊN DỊCH** (chỉ có duy nhất dòng 56 lỗi biên dịch $\rightarrow$ chọn **A**).
  * Dòng 51–53: `one`, `copy`, `copyOfCopy` đều là các danh sách bất biến (**immutable lists**) được tạo bởi `List.of()` và `List.copyOf()`.
  * Dòng 57: `one.replaceAll(x -> x * 2);`. Mặc dù biên dịch được, nhưng vì `one` là danh sách bất biến, thao tác `replaceAll` sửa đổi phần tử sẽ ném ra **`UnsupportedOperationException` tại runtime** $\rightarrow$ chọn **E**.
  * Dòng 54: `thirdCopy` được bọc trong `new ArrayList<>()` nên nó là một danh sách có thể thay đổi (**mutable**). Nếu dòng 56 và 57 được loại bỏ, dòng 58 sẽ nhân đôi từng phần tử và dòng 60 in ra `[16, 32, 4]`.
* **Bẫy thi cần nhớ:** `List.copyOf()` luôn tạo ra collection bất biến. `replaceAll()` cố gắng sửa danh sách bất biến sẽ ném `UnsupportedOperationException`.
</details>

---

### Câu 19 (Question 19)
**Cần thay đổi mã nguồn như thế nào để phương thức sau biên dịch được, giả định không có lớp nào tên là `T`?**

```java
public static T identity(T t) {
   return t;
}
```

* A. Thêm `<T>` ngay sau từ khoá `public`.
* B. Thêm `<T>` ngay sau từ khoá `static`.
* C. Thêm `<T>` ngay sau `T`.
* D. Thêm `<?>` ngay sau từ khoá `public`.
* E. Thêm `<?>` ngay sau từ khoá `static`.
* F. Không cần thay đổi gì, đoạn mã đã biên dịch được.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B**
* **Phân tích chi tiết:**
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

### Câu 20 (Question 20)
**Giả sử các khoá được in theo thứ tự tăng dần, kết quả của đoạn mã sau là gì?**

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
* G. Đoạn mã không biên dịch được.
* H. Một ngoại lệ được ném ra tại thời điểm chạy.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **F ({1=13, 2=20, 3=3})**
* **Phân tích chi tiết:**
  * Ban đầu: `map = {1=10, 2=20, 3=null}`.
  * **Lệnh `map.merge(1, 3, (a, b) -> a + b)`:**
    * Key `1` đã tồn tại với giá trị hiện tại là `10` (khác `null`).
    * Hàm ánh xạ `BiFunction` được gọi: `a = 10` (giá trị cũ), `b = 3` (giá trị mới).
    * `10 + 3 = 13`. Giá trị của key `1` được cập nhật thành `13`.
  * **Lệnh `map.merge(3, 3, (a, b) -> a + b)`:**
    * Key `3` đang có giá trị liên kết là **`null`**.
    * **Quy tắc đặc thù của `Map.merge()`:** Nếu key chưa tồn tại, HOẶC đang có giá trị liên kết là `null`, thì `merge()` sẽ **không gọi hàm ánh xạ (mapping function)**! Thay vào đó, nó gán trực tiếp giá trị mới (`3`) vào map cho key đó.
    * Do đó, key `3` được cập nhật giá trị mới là `3`.
  * Kết quả trong map: `{1=13, 2=20, 3=3}` $\rightarrow$ Đáp án **F**.
* **Bẫy thi cần nhớ:** Nếu key chưa có hoặc giá trị hiện tại là `null`, `map.merge()` sẽ gán thẳng giá trị mới mà không thèm gọi mapping function!
</details>

---

### Câu 21 (Question 21)
**Những phát biểu nào sau đây là đúng? (Chọn tất cả các đáp án đúng.)**

* A. `Comparable` nằm trong gói `java.util`.
* B. `Comparator` nằm trong gói `java.util`.
* C. `compare()` nằm trong giao diện `Comparable`.
* D. `compare()` nằm trong giao diện `Comparator`.
* E. `compare()` nhận một tham số phương thức.
* F. `compare()` nhận hai tham số phương thức.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B, D, F**
* **Phân tích chi tiết:**
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
* **Bẫy thi cần nhớ:** `Comparable` $\rightarrow$ `java.lang` $\rightarrow$ `compareTo(1 tham số)`. `Comparator` $\rightarrow$ `java.util` $\rightarrow$ `compare(2 tham số)`.
</details>

---

### Câu 22 (Question 22)
**Kết quả đầu ra của đoạn mã sau là gì?**

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
* D. Đoạn mã không biên dịch được.
* E. Đoạn mã biên dịch được nhưng ném ra ngoại lệ tại thời điểm chạy.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **B (Snowball)**
* **Phân tích chi tiết:**
  * Dòng 21 khai báo `SequencedMap` tham chiếu đến `TreeMap`. Trong Java 21, `TreeMap` triển khai `SequencedMap` $\rightarrow$ Biên dịch hoàn toàn hợp lệ.
  * Dòng 22–24 đưa 3 cặp key-value vào `TreeMap`. Vì là `TreeMap`, các cặp được tự động sắp xếp theo thứ tự tự nhiên của **Key**:
    * Entry đầu: `1 -> "Minnie Mouse"`
    * Entry giữa: `2 -> "Sugar"`
    * Entry cuối: `3 -> "Snowball"`
  * Dòng 25: `cats.pollFirstEntry()` lấy và xoá entry đầu tiên (`1 -> "Minnie Mouse"`).
    * Map còn lại: `[2 -> "Sugar", 3 -> "Snowball"]`.
  * Dòng 26: `cats.lastEntry().getKey()` lấy key của entry cuối cùng (trả về `3`). Chú ý: `lastEntry()` chỉ đọc chứ **không xoá**.
  * Dòng 27: `cats.pollFirstEntry()` tiếp tục lấy và xoá entry đầu tiên hiện tại (`2 -> "Sugar"`).
    * Map còn lại duy nhất một entry: `[3 -> "Snowball"]`.
  * Dòng 28: `cats.firstEntry().getValue()` đọc giá trị của entry đầu tiên còn lại $\rightarrow$ chính là `"Snowball"`.
  * In ra màn hình: `Snowball` $\rightarrow$ Đáp án **B**.
* **Bẫy thi cần nhớ:** `pollFirstEntry()` vừa lấy vừa xoá; `firstEntry()` và `lastEntry()` chỉ đọc mà không làm thay đổi Map.
</details>

---

### Câu 23 (Question 23)
**Kết quả đầu ra của đoạn mã sau là gì?**

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
* G. Đoạn mã không biên dịch được.
* H. Đoạn mã biên dịch được nhưng ném ra ngoại lệ tại thời điểm chạy.

<details>
<summary><b>🔍 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **H (Đoạn mã biên dịch được nhưng ném ra ngoại lệ tại thời điểm chạy)**
* **Phân tích chi tiết:**
  * **Về mặt biên dịch:** Trong Java 21, `TreeSet` triển khai `NavigableSet`, và `NavigableSet` kế thừa giao diện mới `SequencedSet`. Giao diện `SequencedSet` định nghĩa phương thức `addFirst(E e)`. Do đó, `fishes.addFirst("clown")` **hoàn toàn hợp lệ về mặt cú pháp biên dịch** (không bị lỗi compiler).
  * **Về mặt thời điểm chạy (Runtime):**
    * Cấu trúc `TreeSet` yêu cầu tất cả các phần tử phải tuân thủ nghiêm ngặt theo trật tự sắp xếp đã định (`Comparable` hoặc `Comparator`).
    * Việc ép buộc chèn một phần tử vào vị trí đầu tiên (`addFirst`) hoặc cuối cùng (`addLast`) có thể phá vỡ tính đúng đắn của cây tìm kiếm tự cân bằng.
    * Vì lý do này, tài liệu đặc tả Java 21 (JEP 431) quy định rằng phương thức `addFirst()` và `addLast()` trên `TreeSet` sẽ **ném ra `UnsupportedOperationException`** tại thời điểm chạy!
  * Do đó, chương trình biên dịch thành công nhưng bị dừng lại ngay tại dòng `fishes.addFirst("clown")` vì ngoại lệ runtime $\rightarrow$ Chọn **H**.
* **Bẫy thi cần nhớ:** Đây là bẫy thi đặc trưng số 1 về Sequenced Collections trong Java 21: `TreeSet` có phương thức `addFirst()` / `addLast()` nhưng khi gọi sẽ ném `UnsupportedOperationException`!
</details>
