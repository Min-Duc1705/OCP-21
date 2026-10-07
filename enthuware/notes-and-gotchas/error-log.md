# 📓 Sổ Tay Lỗi Sai & Rút Kinh Nghiệm (Mistakes Notebook)

> "Người thông minh học từ sai lầm của mình. Người xuất sắc không để mình vấp ngã 2 lần ở cùng một bẫy."  
> Bảng này tổng hợp các câu hỏi làm sai từ tất cả các đề Enthuware để xem lại cấp tốc trước khi thi.

---

## 📋 Danh Sách Các Câu Đã Làm Sai

| STT | Đề Thi & Mã Câu | Chủ Đề | Nguyên Nhân Sai (Bẫy Gì?) | Quy Tắc Khắc Cốt Ghi Tâm | Link Chi Tiết |
| :---: | :--- | :--- | :--- | :--- | :--- |
| *Ví dụ* | *Standard Test 1 - Q15* | *Virtual Threads* | *Tưởng vThread có thể setDaemon(false)* | *Virtual Threads luôn là daemon threads, setDaemon(false) ném IllegalArgumentException* | [Xem chi tiết](file:///t:/University/Interview/Java/ocp-21-study-guide/enthuware/01-standard-tests/test-1-analysis.md#câu-15) |
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |

---

## 🎯 Phân Loại Nguyên Nhân Sai Phổ Biến

```text
[ ] Đọc ẩu / Không đọc kỹ đề (Ví dụ: hỏi "Which TWO...", chọn 1; hỏi "DOES NOT compile", chọn câu compile được)
[ ] Bẫy cú pháp (Không để ý lỗi biên dịch hiển nhiên: thiếu dấu chấm phẩy, sai access modifier)
[ ] Chưa nắm vững tính năng mới Java 21 (Record patterns, switch when, Sequenced Collections)
[ ] Nhầm lẫn giữa Runtime Exception và Compile Error
[ ] Bẫy Toán tử & Thứ tự ưu tiên (pre-increment, short-circuit &&, ||)
```
