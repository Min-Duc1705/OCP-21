# Sổ Tay Giải Đề & Phân Tích Bẫy Thi Enthuware — OCP Java SE 21 (Exam 1Z0-830)

> **Mục tiêu:** Chinh phục chứng chỉ Oracle Certified Professional Java SE 21 Developer với điểm số $\ge 80\%$ (ngưỡng đỗ chuẩn của Oracle: $68\%$).  
> Thư mục này dành riêng để ghi chép, mổ xẻ bẫy, phân tích chuyên sâu từng câu hỏi khó và câu làm sai từ bộ đề thi thử nổi tiếng **Enthuware ETS-Viewer (OCPJP 21 - 1Z0-830)**.

---

## 📊 Bảng Theo Dõi Tiến Độ & Điểm Số (Scorecard)

| Đề Thi (Test Name) | Số Câu | Lần 1 (%) | Lần 2 (%) | Ngày Hoàn Thành | Trạng Thái | File Ghi Chép Lời Giải |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Foundation Test 1** | ~50 | | | | ⏳ Chưa làm | [foundation-test-1.md](file:///t:/University/Interview/Java/ocp-21-study-guide/enthuware/00-foundation-test/foundation-test-1.md) |
| **Standard Test 1** | 50 | | | | ⏳ Chưa làm | [test-1-analysis.md](file:///t:/University/Interview/Java/ocp-21-study-guide/enthuware/01-standard-tests/test-1-analysis.md) |
| **Standard Test 2** | 50 | | | | ⏳ Chưa làm | [test-2-analysis.md](file:///t:/University/Interview/Java/ocp-21-study-guide/enthuware/01-standard-tests/test-2-analysis.md) |
| **Standard Test 3** | 50 | | | | ⏳ Chưa làm | [test-3-analysis.md](file:///t:/University/Interview/Java/ocp-21-study-guide/enthuware/01-standard-tests/test-3-analysis.md) |
| **Standard Test 4** | 50 | | | | ⏳ Chưa làm | [test-4-analysis.md](file:///t:/University/Interview/Java/ocp-21-study-guide/enthuware/01-standard-tests/test-4-analysis.md) |
| **Standard Test 5** | 50 | | | | ⏳ Chưa làm | [test-5-analysis.md](file:///t:/University/Interview/Java/ocp-21-study-guide/enthuware/01-standard-tests/test-5-analysis.md) |
| **Standard Test 6** | 50 | | | | ⏳ Chưa làm | [test-6-analysis.md](file:///t:/University/Interview/Java/ocp-21-study-guide/enthuware/01-standard-tests/test-6-analysis.md) |
| **Unique / Final Test** | 50 | | | | ⏳ Chưa làm | [unique-test-analysis.md](file:///t:/University/Interview/Java/ocp-21-study-guide/enthuware/03-unique-test/unique-test-analysis.md) |

---

## 🗂️ Sơ Đồ Cấu Trúc Thư Mục

```text
enthuware/
├── README.md                          # Dashboard này
├── TEMPLATE-QUESTION.md               # Khung mẫu chuẩn phân tích câu hỏi
├── 00-foundation-test/
│   └── foundation-test-1.md           # Khởi động & củng cố nền tảng (Foundation Test 1)
├── 01-standard-tests/                 # 6 bài thi chuẩn (Full mock test 50 câu)
│   ├── test-1-analysis.md
│   ├── test-2-analysis.md
│   ├── test-3-analysis.md
│   ├── test-4-analysis.md
│   ├── test-5-analysis.md
│   └── test-6-analysis.md
├── 02-objective-wise-tests/           # Luyện sâu theo chuyên đề Java 21
│   ├── 01-virtual-threads-concurrency.md
│   ├── 02-sequenced-collections.md
│   ├── 03-pattern-matching-switch-records.md
│   └── 04-streams-io-modules.md
├── 03-unique-test/
│   └── unique-test-analysis.md        # Đề thi chốt hạ sát thực tế nhất
└── notes-and-gotchas/
    ├── enthuware-classic-traps.md     # Cheatsheet tổng hợp các bẫy tinh vi nhất
    └── error-log.md                   # Sổ tay lỗi sai tổng hợp (Mistakes Notebook)
```

---

## 💡 Phương Pháp Ghi Chép & Giải Đề Hiệu Quả (RCA Method)

Khi gửi đề và giải thích vào file, mỗi câu hỏi sẽ được bóc tách theo **Root Cause Analysis (RCA)**:
1. **Trích dẫn đề bài & Code:** Đầy đủ, rõ ràng và có tô màu cú pháp Java.
2. **Xác định loại bẫy:**
   * 🛑 *Compilation Error:* Lỗi kiểu dữ liệu, phạm vi truy cập (access modifier), thiếu import, unreachable code, switch completeness, var restrictions...
   * ⚠️ *Runtime Exception:* `NullPointerException`, `IndexOutOfBoundsException`, `UnsupportedOperationException`, `ClassCastException`...
   * 🎯 *Tricky Logic:* Thứ tự toán tử, short-circuit `&&` / `||`, vòng lặp vô tận, shadowing variable...
   * ☕ *Java 21 Specifics:* Sequenced Collections, Record Patterns, Pattern Matching for switch, Virtual Threads.
3. **Quy tắc cốt lõi (Core Rule):** Trích dẫn chuẩn từ tài liệu Java Language Specification (JLS) hoặc Java API Doc để nhớ bản chất thay vì học vẹt.
4. **Code thực nghiệm:** Đoạn code tối giản có thể copy chạy ngay bằng `jshell` hoặc `javac` để kiểm chứng.

---

> [!TIP]
> Bạn chỉ cần copy đề bài hoặc chụp gửi câu hỏi từ Enthuware, hệ thống sẽ tự động phân tích chi tiết và ghi đúng vào file đề tương ứng!
