# ⚡ Tổng Hợp Các Bẫy Kinh Điển Trong Enthuware — OCP Java 21

> Cheatsheet này đúc kết những "mánh khóe" và góc khuất ngôn ngữ mà Enthuware thường xuyên khai thác để gài thí sinh trong kỳ thi 1Z0-830.

---

## 1. 🔀 Pattern Matching for Switch & Records

1. **Thứ tự Dominance (Case Subtype phải đứng trước Supertype):**
   * Nếu `case CharSequence` đứng trước `case String`, code sẽ **không compile** (Compile Error: *this case label is dominated by a preceding case label*).
2. **Exhaustiveness (Tính bao quát):**
   * Trong Switch Expression (`var res = switch(obj)...`) hoặc switch với kiểu selector là generic `Object`, bắt buộc phải bao quát hết mọi trường hợp (`default` hoặc `case Object o`).
   * Nếu switch trên **Sealed Hierarchy** mà đã liệt kê đủ tất cả các permitted subclasses trực tiếp thì **không cần** `default`. Nhưng nếu thêm 1 class con mới sau này thì switch sẽ báo lỗi compile!
3. **Guard with `when`:**
   * `case String s when s.length() > 5 -> ...`
   * Trong mệnh đề `when`, biểu thức **bắt buộc phải trả về kiểu `boolean` (primitive hoặc Boolean)**. Không được gán hay dùng kiểu số như C.
4. **Xử lý `null` trong switch:**
   * Theo mặc định từ xưa đến nay, nếu biến selector là `null` và switch không có `case null`, lệnh switch sẽ ném ngay **`NullPointerException`** trước khi vào bất kỳ case nào hay default!
   * Java 21 cho phép: `case null -> ...` hoặc gộp `case null, default -> ...`.

---

## 2. 📚 Sequenced Collections (Mới trong Java 21)

1. **Unmodifiable Collections:**
   * Gọi `list.reversed()` trên `List.of("A", "B")` hoạt động bình thường (trả về view đảo ngược).
   * **NHƯNG** gọi `addFirst()` hoặc `addLast()` trên `List.of()` hoặc `Collections.unmodifiableList()` sẽ ném **`UnsupportedOperationException`** ở Runtime!
2. **Fixed-Size Collections:**
   * `Arrays.asList("A", "B")`: Có kích thước cố định.
   * `reversed()` hoạt động tốt. `getFirst()`, `getLast()` tốt.
   * Nhưng `addFirst()` hay `removeFirst()` sẽ ném **`UnsupportedOperationException`**.
3. **Empty Collection:**
   * Gọi `getFirst()` hoặc `getLast()` trên một SequencedCollection rỗng (`new ArrayList<>()`) sẽ ném **`NoSuchElementException`** (KHÔNG phải `IndexOutOfBoundsException` hay `null`!).

---

## 3. 🧵 Virtual Threads & Concurrency

1. **Virtual Threads luôn là Daemon Threads:**
   * Cố gắng gọi `vThread.setDaemon(false)` sẽ ném **`IllegalArgumentException`**.
2. **Virtual Thread Priority:**
   * Virtual Threads luôn có priority cố định là `Thread.NORM_PRIORITY` (5). Gọi `setPriority(...)` không có tác dụng gì (bị bỏ qua âm thầm).
3. **Thread Pinning (Kẹt Carrier Thread):**
   * Virtual Thread sẽ bị "pinned" vào carrier platform thread khi:
     * Chạy code bên trong khối **`synchronized`** (block hoặc method).
     * Gọi native method hoặc foreign function.
   * Khắc phục trong Java 21: Dùng `ReentrantLock` thay thế `synchronized`.
4. **Virtual Threads không có ThreadGroup riêng biệt:**
   * Virtual threads thuộc về một `ThreadGroup` mặc định và không thể thay đổi.

---

## 4. 📦 Java Platform Module System (JPMS)

1. **`exports` vs `opens`:**
   * `exports <package>`: Cho phép các module khác truy cập các public/protected types lúc compile và runtime.
   * `opens <package>`: Cho phép truy cập **deep reflection** (kể cả private members) ở runtime. Module khai báo dạng `open module X` thì tất cả các package đều tự động được open.
2. **`requires transitive`:**
   * Module A `requires transitive B;`
   * Nếu Module C `requires A;` thì Module C tự động được "thừa hưởng" khả năng truy cập vào Module B mà không cần viết `requires B;`.
3. **Service Provider:**
   * Module tiêu thụ: `uses <interface>;`
   * Module cung cấp: `provides <interface> with <implementation_class>;`
   * Cả 2 đều phải khai báo đúng chính xác trong `module-info.java`.

---

## 5. ⏳ Core APIs & Dates

1. **`Period` vs `Duration`:**
   * `Period`: Dùng cho ngày/tháng/năm (date-based: days, months, years).
   * `Duration`: Dùng cho thời gian (time-based: seconds, nanos).
   * Truyền `Duration` vào `LocalDate` hoặc `Period` vào `LocalTime` sẽ ném **`UnsupportedTemporalTypeException`** ở Runtime!
2. **Tính bất biến (Immutability):**
   * Các method `date.plusDays(5)` KHÔNG sửa `date` mà trả về một instance mới. Nếu không gán lại `date = date.plusDays(5);` thì giá trị vẫn như cũ.
