# Sổ Tay Chuyên Sâu: Chapter 9 - Collections and Generics

> **Tài liệu tham chiếu chuẩn OCP Java SE 21:**  
> Sách: *OCP Oracle Certified Professional Java SE 21 Developer Study Guide*  
> Tác giả: Jeanne Boyarsky & Scott Selikoff (Sybex / Wiley)  
> Phạm vi: Trang 761 – 831 (PDF)

---

## 🗺️ Bản Đồ Kiến Thức Chương 9 (Chapter Overview)

Trong Chương 8, chúng ta đã thành thạo Lambda, Functional Interface và Method Reference. Chương 9 là nơi toàn bộ các kiến thức này được đưa vào thực chiến thông qua **Java Collections Framework (JCF)** và hệ thống **Generics (Kiểu tổng quát)**.

Đặc biệt, kỳ thi OCP Java SE 21 (1Z0-830) đánh dấu bước ngoặt lớn với sự xuất hiện của **Sequenced Collections (JEP 431)** — tính năng mới ra mắt trong Java 21 giúp chuẩn hoá việc thao tác với các tập hợp có thứ tự.

Chương này gồm 4 khối kiến thức nền tảng:
1. **Các giao diện Collections cốt lõi:** `List`, `Set`, `Queue`, `Deque`, `Map` cùng các phương thức chung, các phương thức khởi tạo bất biến (`List.of`, `Set.copyOf`, `Arrays.asList`).
2. **Tính năng mới Java 21: Sequenced Collections:** `SequencedCollection`, `SequencedSet`, `SequencedMap` và các thao tác đầu/cuối (`addFirst`, `removeLast`, `reversed()`).
3. **Sắp xếp dữ liệu (Sorting Data):** `Comparable` (thứ tự tự nhiên) vs `Comparator` (thứ tự tuỳ biến), các phương thức tiện ích `Comparator.comparing()`, và thuật toán `Collections.binarySearch()`.
4. **Hệ thống Generics & Ký tự đại diện (Wildcards):** Generic Classes, Generic Methods, Unbounded (`<?>`), Upper-bounded (`<? extends T>`), Lower-bounded (`<? super T>`), và các bẫy xoá kiểu (*Type Erasure*).

---

## PHẦN 1: CÁC GIAO DIỆN & PHƯƠNG THỨC CHUNG TRONG COLLECTIONS (COMMON APIS)

Một `Collection` là một nhóm các đối tượng được chứa trong một đối tượng duy nhất. Giao diện gốc `java.util.Collection<E>` là cha của `List`, `Set`, và `Queue`. *(Lưu ý: `Map` thuộc Collections Framework nhưng không kế thừa `Collection`).*

### 1. Tám Phương Thức Chung Của `Collection<E>`

| Phương Thức | Mô Tả & Hành Vi |
| :--- | :--- |
| `boolean add(E element)` | Thêm phần tử vào tập hợp. Trả về `true` nếu tập hợp bị thay đổi (luôn trả về `true` với List, có thể trả về `false` với Set nếu phần tử đã tồn tại). |
| `boolean remove(Object element)` | Xoá một phần tử khớp giá trị (`equals()`). Trả về `true` nếu xoá thành công. Với List, chỉ xoá phần tử đầu tiên tìm thấy. |
| `boolean isEmpty()` | Kiểm tra tập hợp có rỗng không (`size() == 0`). |
| `int size()` | Trả về số lượng phần tử hiện có. |
| `void clear()` | Xoá toàn bộ phần tử trong tập hợp. |
| `boolean contains(Object element)` | Kiểm tra phần tử có tồn tại trong tập hợp không (dựa trên `equals()`). |
| `boolean removeIf(Predicate<? super E> filter)` | Xoá tất cả các phần tử thoả mãn điều kiện của Predicate. Trả về `true` nếu có ít nhất 1 phần tử bị xoá. |
| `void forEach(Consumer<? super E> action)` | Duyệt qua từng phần tử và thực thi một `Consumer`. |

---

### 2. Giao Diện `List` & Các Phương Thức Đặc Thù

Một **`List`** là một tập hợp **có thứ tự (ordered by index)** và **cho phép phần tử trùng lặp (duplicate elements)**.

#### Hai lớp triển khai chính:
* **`ArrayList`:** Dựa trên mảng động (resizable array). Truy cập ngẫu nhiên theo chỉ số cực nhanh $O(1)$, nhưng chèn/xoá ở đầu hoặc giữa mảng chậm $O(n)$ do phải dịch chuyển các phần tử.
* **`LinkedList`:** Dựa trên danh sách liên kết kép (doubly linked list). Vừa triển khai `List` vừa triển khai `Deque`. Chèn/xoá ở hai đầu cực nhanh $O(1)$, nhưng truy cập theo chỉ số chậm $O(n)$.

#### Các phương thức khởi tạo List (Factory Methods - Bảng 9.1 Chuẩn Sách OCP):

| Phương Thức Khởi Tạo | Khả Năng Thay Đổi Kích Thước (`add`/`remove`) | Khả Năng Sửa Giá Trị (`set`) | Cho Phép Chứa `null`? | Ảnh Hưởng Mảng Gốc? |
| :--- | :---: | :---: | :---: | :---: |
| `new ArrayList<>()` | **CÓ** | **CÓ** | **CÓ** | Độc lập |
| `Arrays.asList(varargs)` | **KHÔNG** (Fixed-size) | **CÓ** | **CÓ** | **CÓ** (thay đổi list là mảng đổi theo) |
| `List.of(varargs)` | **KHÔNG** (Immutable) | **KHÔNG** (Immutable) | **CẤM `null`** (ném `NPE`) | Độc lập |
| `List.copyOf(collection)` | **KHÔNG** (Immutable) | **KHÔNG** (Immutable) | **CẤM `null`** (ném `NPE`) | Độc lập |

> [!CAUTION]
> **Bẫy thi `Arrays.asList()` vs `List.of()`:**
> ```java
> String[] array = {"a", "b"};
> List<String> list1 = Arrays.asList(array);
> list1.set(0, "c"); // HỢP LỆ! array[0] cũng đổi thành "c"!
> list1.add("d");    // NÉM UnsupportedOperationException tại runtime!
> 
> List<String> list2 = List.of(array);
> list2.set(0, "c"); // NÉM UnsupportedOperationException (List.of là bất biến tuyệt đối)!
> ```

#### Bẫy thi kinh điển: `remove(int index)` vs `remove(Object o)` trong `List`:
```java
var numbers = new ArrayList<Integer>();
numbers.add(1);
numbers.add(2);

numbers.remove(1); // BẪY: 1 ở đây là primitive int -> Xoá phần tử tại CHỈ SỐ 1 (xoá số 2)!
System.out.println(numbers); // [1]

numbers.remove(Integer.valueOf(1)); // Xoá đối tượng có GIÁ TRỊ bằng 1!
System.out.println(numbers); // []
```

---

### 3. Giao Diện `Set` (Tập Hợp Không Trùng Lặp)

Một **`Set`** là tập hợp **không cho phép phần tử trùng lặp (no duplicates)**.

#### Hai lớp triển khai chính:
* **`HashSet`:** Dựa trên bảng băm (hash table). Thêm/xoá/kiểm tra tồn tại cực nhanh $O(1)$. **Không đảm bảo bất kỳ thứ tự nào** của các phần tử.
* **`TreeSet`:** Dựa trên cây đỏ-đen tự cân bằng. Các phần tử **luôn luôn được sắp xếp theo thứ tự (sorted order)** ($O(\log n)$). Vừa là `Set`, vừa là `NavigableSet` và `SequencedSet`.
  * **Quy tắc của `TreeSet`:** Các phần tử thêm vào bắt buộc phải triển khai `Comparable` (hoặc phải truyền `Comparator` vào constructor của TreeSet), và **tuyệt đối không được chứa `null`** (ném `NullPointerException`).

#### Khởi tạo Set bất biến:
* `Set.of("a", "b", "c")` hoặc `Set.copyOf(collection)`:
  * Nếu truyền phần tử trùng lặp vào `Set.of("a", "a")` $\rightarrow$ **Ném `IllegalArgumentException` ngay tại thời điểm chạy!**
  * Chứa `null` $\rightarrow$ Ném `NullPointerException`.

---

### 4. Giao Diện `Queue` và `Deque` (Hàng Đợi)

* **`Queue` (Hàng đợi thông thường):** Hoạt động theo nguyên tắc **FIFO (First-In, First-Out)**: thêm vào ở đuôi (tail), lấy ra ở đầu (head).
* **`Deque` (Double-Ended Queue):** Cho phép thêm và lấy phần tử ở **cả hai đầu** (vừa dùng làm FIFO Queue, vừa dùng làm LIFO Stack).

#### Lớp triển khai:
* **`ArrayDeque`:** Cấu trúc mảng vòng hai đầu, hiệu năng cao hơn `LinkedList`, **không cho phép lưu trữ `null`**.
* **`LinkedList`:** Cho phép lưu trữ `null`.

#### Bảng 9.3: Các phương thức của `Queue` (Bẫy thi Exception vs Giá trị đặc biệt)
| Hành Động | Ném Ngoại Lệ Nếu Thất Bại / Rỗng | Trả Về Giá Trị Đặc Biệt (`false` / `null`) |
| :--- | :---: | :---: |
| **Thêm phần tử vào đuôi** | `add(e)` (ném `IllegalStateException`) | `offer(e)` (trả về `false`) |
| **Đọc phần tử ở đầu (không xoá)** | `element()` (ném `NoSuchElementException`) | `peek()` (trả về `null`) |
| **Lấy và xoá phần tử ở đầu** | `remove()` (ném `NoSuchElementException`) | `poll()` (trả về `null`) |

#### Bảng 9.5: Sử dụng `Deque` như một Ngăn Xếp (LIFO Stack)
Để làm việc với Stack, Java khuyến nghị dùng `Deque` thay vì lớp cũ `Stack`:
* **`push(e)`:** Đẩy phần tử vào đỉnh stack (tương đương `addFirst(e)`).
* **`pop()`:** Lấy và xoá phần tử ở đỉnh stack (tương đương `removeFirst()`). Ném `NoSuchElementException` nếu rỗng.
* **`peek()`:** Đọc phần tử ở đỉnh stack mà không xoá (tương đương `peekFirst()`). Trả về `null` nếu rỗng.

---

### 5. Giao Diện `Map` (Ánh Xạ Key - Value)

Lưu trữ dữ liệu theo cặp **Khoá (Key)** và **Giá trị (Value)**. Các Key là duy nhất (không trùng lặp), mỗi Key ánh xạ tới tối đa một Value.

#### Ba lớp triển khai chính:
* **`HashMap`:** Dựa trên bảng băm, không có thứ tự, cho phép 1 key `null` và nhiều value `null`.
* **`LinkedHashMap`:** Duy trì **thứ tự chèn (insertion order)**, triển khai `SequencedMap`.
* **`TreeMap`:** Sắp xếp các phần tử theo **thứ tự tự nhiên của Key**, triển khai `SequencedMap`. **CẤM key `null`** (ném `NullPointerException`).

#### Phương thức cực kỳ quan trọng trong kỳ thi OCP: `merge()`
Cú pháp: `map.merge(key, value, BiFunction<V, V, V> remappingFunction)`
* Nếu `key` chưa tồn tại trong map (hoặc đang có giá trị `null`): Gán trực tiếp `value` mới vào map (không thèm gọi `BiFunction`).
* Nếu `key` đã tồn tại với giá trị khác `null`: Gọi `BiFunction(giá_trị_cũ, giá_trị_mới)`:
  * Nếu `BiFunction` trả về một giá trị khác `null`: Cập nhật giá trị của `key` thành giá trị mới này.
  * Nếu `BiFunction` trả về **`null`**: **Key này sẽ bị XOÁ HOÀN TOÀN** khỏi Map!

```java
Map<String, String> favorites = new HashMap<>();
favorites.put("Jenny", "Bus Tour");
favorites.put("Tom", null);

BiFunction<String, String, String> mapper = (v1, v2) -> v1.length() > v2.length() ? v1 : v2;

favorites.merge("Jenny", "Skyride", mapper); // Jenny -> "Bus Tour" (dài hơn)
favorites.merge("Tom", "Skyride", mapper);   // Tom đang null -> Gán thẳng "Skyride" (không gọi mapper)
favorites.merge("Sam", "Skyride", mapper);   // Sam chưa có -> Gán thẳng "Skyride"

favorites.merge("Jenny", "Skyride", (v1, v2) -> null); // mapper trả về null -> XOÁ Jenny khỏi map!
```

---

## PHẦN 2: TÍNH NĂNG MỚI JAVA 21: SEQUENCED COLLECTIONS (JEP 431)

Trước Java 21, việc thao tác với phần tử đầu và cuối của các collection có thứ tự rất lộn xộn: `list.get(0)`, `deque.getFirst()`, `sortedSet.first()`.  
Java 21 giới thiệu **Sequenced Collections** để đồng nhất toàn bộ thao tác trên các tập hợp có **thứ tự xác định (well-defined encounter order)**.

```
Collection
    └── SequencedCollection (Java 21)
            ├── List
            ├── Deque
            └── SequencedSet (Java 21)
                    ├── LinkedHashSet
                    └── TreeSet

Map
    └── SequencedMap (Java 21)
            ├── LinkedHashMap
            └── TreeMap
```

### 1. Giao Diện `SequencedCollection<E>`

Định nghĩa một tập hợp có phần tử đầu tiên và cuối cùng được xác định rõ ràng.

#### Bảng 9.11: Các phương thức của `SequencedCollection`:
* `void addFirst(E e)`: Thêm vào đầu tập hợp.
* `void addLast(E e)`: Thêm vào cuối tập hợp.
* `E getFirst()`: Lấy phần tử đầu tiên (ném `NoSuchElementException` nếu rỗng).
* `E getLast()`: Lấy phần tử cuối cùng (ném `NoSuchElementException` nếu rỗng).
* `E removeFirst()`: Xoá và trả về phần tử đầu tiên.
* `E removeLast()`: Xoá và trả về phần tử cuối cùng.
* **`SequencedCollection<E> reversed()`:** Trả về một **chế độ xem đảo ngược (reverse-ordered view)** của tập hợp.

```java
SequencedCollection<String> list = new ArrayList<>(List.of("A", "B", "C"));
list.addFirst("Z"); // [Z, A, B, C]
list.addLast("D");  // [Z, A, B, C, D]
System.out.println(list.getFirst()); // Z
System.out.println(list.getLast());  // D

SequencedCollection<String> rev = list.reversed();
System.out.println(rev); // [D, C, B, A, Z]
```

> [!WARNING]
> **Bẫy thi cực kỳ quan trọng về `TreeSet`:**
> `TreeSet` triển khai `SequencedCollection`, nhưng vì các phần tử trong `TreeSet` luôn bị ép buộc theo quy tắc sắp xếp của `Comparator`, việc bạn cố tình can thiệp gọi `treeSet.addFirst(e)` hoặc `treeSet.addLast(e)` sẽ **ném ra `UnsupportedOperationException` tại runtime**!

---

### 2. Giao Diện `SequencedMap<K, V>`

Áp dụng cho các Map có thứ tự xác định (`LinkedHashMap` theo thứ tự chèn, `TreeMap` theo thứ tự sắp xếp).

#### Bảng 9.12: Các phương thức của `SequencedMap`:
* `Entry<K, V> firstEntry()` / `Entry<K, V> lastEntry()`: Đọc cặp đầu/cuối (trả về `null` nếu rỗng).
* `Entry<K, V> pollFirstEntry()` / `Entry<K, V> pollLastEntry()`: Lấy và xoá cặp đầu/cuối.
* `V putFirst(K k, V v)` / `V putLast(K k, V v)`: Thêm cặp vào đầu/cuối.
* `SequencedMap<K, V> reversed()`: View ánh xạ đảo ngược.
* `SequencedSet<K> sequencedKeySet()`
* `SequencedCollection<V> sequencedValues()`
* `SequencedSet<Entry<K, V>> sequencedEntrySet()`

> [!NOTE]
> **Ai KHÔNG PHẢI là Sequenced?**  
> `HashSet` và `HashMap` **KHÔNG PHẢI** là Sequenced Collections vì chúng không có thứ tự xác định! Đoạn mã gán `SequencedCollection s = new HashSet();` hoặc `SequencedMap m = new HashMap();` sẽ bị **LỖI BIÊN DỊCH**.

---

### 3. Ma Trận So Sánh Các Kiểu Collections (Bảng 9.14 Chuẩn Sách OCP)

| Kiểu Lớp | Triển Khai Interfaces | Có Thứ Tự (Ordered)? | Có Sắp Xếp (Sorted)? | Gọi `hashCode()`? | Gọi `compareTo()`? |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **`ArrayList`** | `List`, `SequencedCollection` | **Có** (theo index) | Không | Không | Không |
| **`LinkedList`** | `List`, `Deque`, `SequencedCollection` | **Có** (theo index) | Không | Không | Không |
| **`ArrayDeque`** | `Deque`, `SequencedCollection` | **Có** (theo thứ tự thêm) | Không | Không | Không |
| **`HashSet`** | `Set` | **Không** | Không | **Có** | Không |
| **`LinkedHashSet`**| `Set`, `SequencedSet` | **Có** (thứ tự chèn) | Không | **Có** | Không |
| **`TreeSet`** | `Set`, `SequencedSet`, `SequencedCollection`| **Có** (thứ tự sắp xếp)| **Có** | Không | **Có** |
| **`HashMap`** | `Map` | **Không** | Không | **Có** | Không |
| **`LinkedHashMap`**| `Map`, `SequencedMap` | **Có** (thứ tự chèn) | Không | **Có** | Không |
| **`TreeMap`** | `Map`, `SequencedMap` | **Có** (thứ tự sắp xếp)| **Có** | Không | **Có** |

---

## PHẦN 3: SẮP XẾP DỮ LIỆU (SORTING DATA: COMPARABLE & COMPARATOR)

### 1. `Comparable<T>` (Thứ Tự Tự Nhiên - Natural Ordering)
* Nằm trong gói **`java.lang`** (không cần import).
* Lớp tự định nghĩa thứ tự cho chính nó bằng cách triển khai `Comparable<T>` và override phương thức:
  ```java
  public int compareTo(T o);
  ```
* **Quy ước giá trị trả về:**
  * **Số âm (`< 0`):** Đối tượng hiện tại (`this`) đứng **trước** đối tượng `o`.
  * **Số không (`== 0`):** Hai đối tượng bằng nhau về mặt sắp xếp.
  * **Số dương (`> 0`):** Đối tượng hiện tại (`this`) đứng **sau** đối tượng `o`.
* **Tính nhất quán với `equals()`:** Khuyến nghị chuẩn: `(x.compareTo(y) == 0) == (x.equals(y))`. Nếu không nhất quán, `TreeSet` hoặc `TreeMap` có thể hoạt động bất thường (vì chúng dùng `compareTo` chứ không dùng `equals` để kiểm tra trùng lặp).

```java
public class Duck implements Comparable<Duck> {
    private String name;
    private int weight;

    public int compareTo(Duck d) {
        return this.name.compareTo(d.name); // So sánh theo tên
    }
}
```

---

### 2. `Comparator<T>` (Thứ Tự Tuỳ Biến)
* Nằm trong gói **`java.util`** (phải import).
* Dùng khi muốn sắp xếp một lớp theo nhiều tiêu chí khác nhau, hoặc khi lớp đó không triển khai `Comparable`.
* Là một **Functional Interface** với phương thức SAM:
  ```java
  public int compare(T o1, T o2);
  ```

#### Bảng 9.8: So Sánh `Comparable` vs `Comparator` (Bắt Buộc Nhớ Cho Kỳ Thi)
| Đặc Điểm | `Comparable` | `Comparator` |
| :--- | :--- | :--- |
| **Gói (Package)** | `java.lang` | `java.util` |
| **Tên phương thức** | `compareTo(T o)` | `compare(T o1, T o2)` |
| **Số lượng tham số** | **1** | **2** |
| **Có phải Functional Interface?** | **Không** | **CÓ** (dùng được với Lambda / Method Ref) |
| **Cách dùng với `Collections.sort()`** | `Collections.sort(list)` | `Collections.sort(list, comparator)` hoặc `list.sort(comparator)` |

---

### 3. Các Phương Thức Tiện Ích Xây Dựng `Comparator` (Bảng 9.9 & 9.10)

Java cung cấp sẵn các phương thức tiện ích cực kỳ mạnh mẽ:

```java
// Sắp xếp tăng dần theo weight
Comparator<Duck> byWeight = Comparator.comparingInt(Duck::getWeight);

// Sắp xếp theo name, nếu trùng name thì sắp xếp tiếp theo weight giảm dần:
Comparator<Duck> multi = Comparator.comparing(Duck::getName)
                                   .thenComparing(Duck::getWeight, Comparator.reverseOrder());
```

---

### 4. Thuật Toán Tìm Kiếm Nhị Phân (`Collections.binarySearch`)

* **Điều kiện tiên quyết:** Danh sách **bắt buộc phải được sắp xếp trước** theo đúng thứ tự mà thuật toán sử dụng. Nếu chưa sắp xếp, kết quả trả về là **không thể đoán trước (undefined)**.
* **Kết quả trả về:**
  * **Nếu tìm thấy:** Trả về chỉ số vị trí tìm thấy (`>= 0`).
  * **Nếu KHÔNG tìm thấy:** Trả về: **`-(vị_trí_chèn_dự_kiến) - 1`**.
    * *Vị trí chèn dự kiến:* Là vị trí phần tử đó nên xuất hiện nếu được đưa vào danh sách để bảo toàn tính sắp xếp.

```java
List<Integer> list = Arrays.asList(2, 4, 6, 8); // Đã sắp xếp tăng dần

System.out.println(Collections.binarySearch(list, 4)); // Tìm thấy tại index 1 -> In ra: 1
System.out.println(Collections.binarySearch(list, 5)); // 5 nên nằm giữa 4 (index 1) và 6 (index 2).
                                                       // Vị trí chèn là 2.
                                                       // Trả về: -2 - 1 = -3 -> In ra: -3
```

---

## PHẦN 4: HỆ THỐNG GENERICS & KÝ TỰ ĐẠI DIỆN (WILDCARDS)

Generics giúp kiểm tra an toàn kiểu dữ liệu ngay tại **thời điểm biên dịch (compile-time)** và tự động chèn các thao tác ép kiểu.

### 1. Lớp, Giao Diện & Phương Thức Generic

#### Generic Class & Interface:
```java
public class Crate<T> {
    private T contents;
    public T emptyCrate() { return contents; }
    public void packCrate(T contents) { this.contents = contents; }
}
```

#### Generic Method (Phương thức tổng quát):
> [!IMPORTANT]
> **Vị trí khai báo tham số kiểu `<T>`:**  
> Tham số kiểu `<T>` **bắt buộc phải đứng TRƯỚC kiểu trả về** của phương thức!
```java
public static <T> Crate<T> ship(T t) {
    return new Crate<T>();
}
```

---

### 2. Ba Loại Ký Tự Đại Diện Wildcard `?` (Bảng 9.15 Chuẩn Sách OCP)

Ký tự đại diện `?` biểu thị một kiểu dữ liệu chưa xác định.

| Loại Wildcard | Cú Pháp | Ví Dụ | Khả Năng Thêm Phần Tử (`add`) |
| :--- | :--- | :--- | :---: |
| **1. Không Giới Hạn (Unbounded)** | `<?>` | `List<?> list` | **CHỈ ĐỌC** (Không thể thêm phần tử, trừ `null`) |
| **2. Giới Hạn Trên (Upper-bounded)** | `<? extends T>` | `List<? extends Number>` | **CHỈ ĐỌC** (Không thể thêm phần tử, trừ `null`) |
| **3. Giới Hạn Dưới (Lower-bounded)** | `<? super T>` | `List<? super Integer>` | **ĐỌC & GHI** (Có thể thêm `T` hoặc lớp con của `T`) |

---

### 3. Phân Tích Chuyên Sâu 3 Loại Wildcard

#### 1. Tại sao `List<String>` KHÔNG THỂ gán cho `List<Object>`?
```java
List<String> strings = new ArrayList<>();
List<Object> objects = strings; // LỖI BIÊN DỊCH!
```
* *Giải thích:* Nếu Java cho phép dòng trên, bạn có thể gọi `objects.add(10)` (thêm số int vào danh sách). Khi đó, danh sách `strings` sẽ chứa số nguyên $\rightarrow$ Phá vỡ cam kết an toàn kiểu của Java!
* Để nhận danh sách của bất kỳ kiểu nào, ta phải dùng **Unbounded Wildcard**: `List<?>`.

#### 2. Upper-Bounded Wildcard (`<? extends T>`) - Ràng Buộc Trên
* Ý nghĩa: Danh sách chứa các đối tượng thuộc kiểu `T` hoặc bất kỳ lớp con nào kế thừa từ `T`.
* Áp dụng từ khoá `extends` cho **cả Class và Interface** (`List<? extends Flyer>`).
* **Tính chất Read-only:** Bạn có thể đọc các phần tử ra dưới dạng kiểu `T`, nhưng **tuyệt đối không thể thêm phần tử mới** (ngoại trừ `null`) vì trình biên dịch không biết chính xác kiểu cụ thể bên dưới là gì:
```java
List<? extends Number> list = new ArrayList<Integer>();
list.add(5); // LỖI BIÊN DỊCH! Không thể add Integer vào List<? extends Number>!
```

#### 3. Lower-Bounded Wildcard (`<? super T>`) - Ràng Buộc Dưới
* Ý nghĩa: Danh sách chứa các đối tượng thuộc kiểu `T` hoặc bất kỳ **lớp cha** nào của `T`.
* **Khả năng ghi (Writeable):** Vì danh sách chắc chắn là một lớp cha của `T`, nên việc **thêm đối tượng kiểu `T` hoặc các lớp con của `T` vào danh sách luôn luôn an toàn 100%**:
```java
List<? super IOException> list = new ArrayList<Exception>();
list.add(new IOException());           // HỢP LỆ!
list.add(new FileNotFoundException()); // HỢP LỆ! (vì là lớp con của IOException)
// list.add(new Exception());          // LỖI BIÊN DỊCH! (Exception là lớp cha, không thể add vào)
```

---

### 4. Những Điều Cấm Kỵ Của Generics (Do Cơ Chế Type Erasure)

Tại thời điểm biên dịch, Java sẽ thực hiện cơ chế **xoá kiểu (Type Erasure)**, biến các tham số `<T>` thành `Object` (hoặc upper bound của nó). Do đó:
1. ❌ **Không thể khởi tạo trực tiếp instance của kiểu T:** `new T()` $\rightarrow$ Lỗi biên dịch.
2. ❌ **Không thể tạo mảng của kiểu generic:** `new T[10]` $\rightarrow$ Lỗi biên dịch.
3. ❌ **Không thể dùng kiểu nguyên thuỷ với generics:** `List<int>` $\rightarrow$ Lỗi biên dịch (phải dùng `List<Integer>`).
4. ❌ **Không thể tạo biến `static` có kiểu T:** `private static T member;` $\rightarrow$ Lỗi biên dịch (vì biến static được chia sẻ cho toàn bộ class, không gắn với type parameter của từng instance).
5. ❌ **Không thể dùng `instanceof` với generic type:** `list instanceof ArrayList<String>` $\rightarrow$ Lỗi biên dịch (chỉ được kiểm tra `list instanceof ArrayList<?>`).

---

## ⚠️ TỔNG KẾT CÁC BẪY THI OCP CHƯƠNG 9 (EXAM TRAPS CHECKLIST)

1. **`List.of()` và `Set.of()`:** Bất biến tuyệt đối, cấm chứa `null`. `Set.of()` có phần tử trùng lặp sẽ ném `IllegalArgumentException`.
2. **`Arrays.asList()`:** Kích thước cố định (không thể `add`/`remove`), nhưng cho phép `set()` và làm thay đổi trực tiếp mảng gốc.
3. **`list.remove(1)`:** Với `List<Integer>`, tham số primitive `int` sẽ xoá theo **chỉ số (index)**, không phải xoá theo giá trị!
4. **Sequenced Collections:** `addFirst`, `addLast`, `getFirst`, `getLast`, `removeFirst`, `removeLast`, `reversed()`. `HashSet` và `HashMap` KHÔNG PHẢI là Sequenced!
5. **`TreeSet.addFirst()`:** Ném `UnsupportedOperationException` tại runtime vì vi phạm trật tự sắp xếp của TreeSet.
6. **`Map.merge()`:** Nếu remapping function trả về `null`, key sẽ bị xoá khỏi map.
7. **`Comparable` vs `Comparator`:** `Comparable` có `compareTo(o)` trong `java.lang`; `Comparator` có `compare(o1, o2)` trong `java.util` (là Functional Interface).
8. **`Collections.binarySearch()`:** Danh sách chưa sắp xếp thì kết quả tìm kiếm là undefined; nếu không tìm thấy trả về `-(vị_trí_chèn) - 1`.
9. **Khai báo Generic Method:** `<T>` phải đứng **trước kiểu trả về** (`public static <T> void test(T t)`).
10. **Wildcard `<? extends T>` vs `<? super T>`:** `extends` chỉ cho phép đọc (read-only); `super` cho phép thêm phần tử kiểu `T` hoặc con của `T`.
