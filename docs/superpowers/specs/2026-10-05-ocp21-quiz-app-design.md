# Thiết Kế Kiến Trúc: Ứng Dụng Ôn Thi Trắc Nghiệm OCP Java 21 (OCP 21 Quiz Master)

- **Ngày tạo:** 2026-10-05
- **Trạng thái:** Chờ phê duyệt (Draft)
- **Tác giả:** Antigravity & User

---

## 1. Tổng quan & Mục tiêu (Overview & Goals)

Xây dựng ứng dụng Web Standalone (chạy trực tiếp trên trình duyệt, không cần cài đặt server hay phụ thuộc node_modules) để phục vụ việc ôn luyện bộ câu hỏi trắc nghiệm chứng chỉ Oracle Certified Professional Java SE 21 Developer (Exam 1Z0-830), dựa trên nội dung 7 chương trong thư mục `Java/ocp-21-study-guide/`.

### Mục tiêu chính:
1. **Tiện dụng & Di động (Zero Setup):** Mở trực tiếp file `index.html` trên bất kỳ trình duyệt nào là sử dụng được ngay, hoạt động 100% offline.
2. **Giao diện hiện đại & Thẩm mỹ cao:** Thiết kế chuẩn Dark Mode / Light Mode, font chữ hiện đại (Inter, JetBrains Mono cho code Java), giao diện kính mờ (Glassmorphism), micro-animations mượt mà.
3. **Hiển thị Code chuyên nghiệp:** Tích hợp bộ thư viện Prism.js hỗ trợ highlight màu cú pháp code Java trực quan, dễ đọc đề.
4. **Hai chế độ học tập cốt lõi:**
   - **Chế độ Luyện tập (Practice Mode):** Làm từng câu theo chương, kiểm tra đáp án ngay lập tức, hiển thị phân tích chuyên sâu và bẫy thi của Oracle.
   - **Chế độ Thi thử (Mock Exam Mode):** Bấm giờ đếm ngược, thanh lưới câu hỏi (Question Palette) có trạng thái cắm cờ (Flag for review), nộp bài tính điểm chuẩn Oracle (ngưỡng đỗ $\ge 68\%$) kèm phân tích điểm theo từng chương.
5. **Lưu trữ tiến độ (Persistence):** Tự động lưu tiến độ, danh sách câu hỏi đã đánh dấu (Bookmark) và sổ tay câu làm sai (Mistakes Notebook) vào `localStorage`.

---

## 2. Kiến trúc Hệ thống & Cấu trúc Thư mục

Toàn bộ ứng dụng được tổ chức bên trong thư mục `t:/University/Interview/Java/ocp-21-study-guide/quiz-app/`:

```text
ocp-21-study-guide/
├── 01-chapter-1-review-questions.md
├── ... (các file markdown câu hỏi từ chương 1 đến 7)
└── quiz-app/
    ├── index.html              # Trang web chính (Single Page App)
    ├── css/
    │   └── styles.css          # CSS thiết kế hiện đại, responsive, dark/light theme
    ├── js/
    │   ├── quiz-data.js        # Dữ liệu JSON chứa toàn bộ câu hỏi (sinh ra từ parser)
    │   ├── parser.js           # Script Node.js trích xuất tự động từ 7 file Markdown
    │   ├── storage.js          # Module quản lý LocalStorage (lưu bookmark, lịch sử, điểm)
    │   └── app.js              # Module điều khiển luồng ứng dụng, timer, sự kiện bàn phím
    └── lib/
        ├── prism.js            # Thư viện highlight code Java (offline)
        └── prism.css           # Theme Prism One Dark / Twilight đẹp mắt
```

---

## 3. Mô hình Dữ liệu & Script Parser (`parser.js`)

### 3.1. Cấu trúc một câu hỏi (`Question`)
Mỗi câu hỏi trong `quiz-data.js` tuân thủ schema JSON sau:
```typescript
interface Question {
  id: string;               // Ví dụ: "ch1_q1", "ch2_q14"
  chapterId: number;        // 1 đến 7
  chapterTitle: string;     // Ví dụ: "Chapter 1: Building Blocks"
  questionNumber: number;   // Số thứ tự trong chương
  questionText: string;     // Nội dung câu hỏi dạng text/markdown
  codeSnippet: string | null;// Đoạn code Java nếu câu hỏi có chứa block ```java
  isMultipleChoice: boolean;// true nếu câu hỏi yêu cầu chọn nhiều đáp án
  options: {
    key: string;            // "A", "B", "C", "D", ...
    text: string;           // Nội dung phương án
  }[];
  correctAnswers: string[]; // Mảng các đáp án đúng, ví dụ: ["D", "E"]
  explanation: string;      // Nội dung giải thích chuyên sâu trích xuất từ thẻ <details>
}
```

### 3.2. Logic Parser tự động trích xuất
Script `parser.js` duyệt qua 7 file markdown (`01-chapter-1-review-questions.md` đến `07-chapter-7-review-questions.md`) và sử dụng Regex để trích xuất:
1. `### Câu (\d+) \(Question \d+\)` -> Định danh câu hỏi.
2. Tiêu đề câu hỏi và phát hiện có cụm `"Chọn tất cả các đáp án đúng"` hay không -> set `isMultipleChoice`.
3. Code block ````java ... ```` -> trích ra `codeSnippet`.
4. Danh sách các lựa chọn `* ([A-Z])\. (.*)` -> mảng `options`.
5. Thẻ `<details>`:
   - `Đáp án đúng:\*\* \*\*([A-Z, ]+)\*\*` -> tách các ký tự đáp án thành `correctAnswers`.
   - Toàn bộ phần `Giải thích chuyên sâu:` cho đến `</details>` -> lưu vào `explanation`.

File kết quả được ghi vào `quiz-data.js` dưới dạng:
```javascript
window.QUIZ_DATA = {
  chapters: [...],
  questions: [...]
};
```

---

## 4. Thiết kế Giao diện & Trải nghiệm Người dùng (UI/UX)

### 4.1. Hệ thống Màu sắc & Typography
- **Font chữ:** `Inter` / `system-ui` cho văn bản thông thường; `JetBrains Mono` / `Fira Code` / `Consolas` cho code Java.
- **Bảng màu Dark Mode:**
  - Background chính: `#0f172a` (slate-900)
  - Surface/Card: `#1e293b` (slate-800) với viền kính `rgba(255, 255, 255, 0.08)`
  - Accent/Primary: `#38bdf8` (cyan/sky-400) và `#6366f1` (indigo-500)
  - Success (Đáp án đúng): `#22c55e` (green-500)
  - Danger (Đáp án sai): `#ef4444` (red-500)
  - Warning/Flagged: `#f59e0b` (amber-500)
- **Hỗ trợ Light Mode:** Tự động chuyển đổi mượt mà bằng CSS variables.

### 4.2. Màn hình 1: Dashboard (Trang chủ)
- **Header:** Logo OCP 21 Quiz Master, công tắc chuyển Theme (Dark/Light), nút mở "Sổ tay câu sai (Mistakes)" và "Câu đã đánh dấu (Bookmarks)".
- **Banner thống kê:** Thống kê tổng quan (Tổng số câu hỏi ~160 câu, Tỷ lệ trả lời đúng, Số đề thi đã hoàn thành).
- **Lưới danh sách chương (Chapter Cards):**
  - 7 thẻ chương từ Chương 1 đến Chương 7.
  - Mỗi thẻ hiển thị: Tên chương, Số lượng câu hỏi, Thanh tiến độ hoàn thành, Nút "Luyện tập", Nút "Thi thử".
- **Thẻ hành động nhanh:** Nút "Thi thử tổng hợp ngẫu nhiên (Tất cả các chương)".

### 4.3. Màn hình 2: Chế độ Luyện tập (Practice Mode)
- **Thanh trạng thái phía trên:** Tên chương, số thứ tự câu hiện tại (VD: Câu 3 / 23), Nút Bookmark (⭐).
- **Khu vực câu hỏi:**
  - Văn bản câu hỏi rõ ràng, thẻ huy hiệu (Badge): "Chọn 1 đáp án" hoặc "Chọn nhiều đáp án".
  - Khung code Java (nếu có) được tô màu cú pháp bởi Prism.js.
  - Các lựa chọn đáp án hiển thị dạng thẻ tương tác (interactive cards):
    - Khi click: đổi trạng thái checked.
    - Hỗ trợ phím tắt: bấm phím A, B, C, D trên bàn phím để chọn tương ứng.
- **Nút "Kiểm tra đáp án" (Check Answer):**
  - Khi người dùng bấm kiểm tra:
    - Đáp án đúng tô viền xanh lá và icon check ✔️.
    - Đáp án người dùng chọn sai tô viền đỏ và icon gạch chéo ❌.
    - Hộp thoại giải thích (Explanation Card) trượt xuống mềm mại, hiển thị nguyên nhân vì sao đúng, vì sao các phương án khác sai.
- **Thanh điều hướng dưới cùng:** Nút "Câu trước", "Làm lại", "Câu tiếp theo" (hoặc bấm phím mũi tên trái/phải).

### 4.4. Màn hình 3: Chế độ Thi thử tính giờ (Mock Exam Mode)
- **Hộp thoại cấu hình đề thi (Exam Setup Modal):**
  - Chọn các chương tham gia thi (Checkbox từng chương hoặc Chọn tất cả).
  - Chọn số lượng câu: 20 câu, 40 câu, hoặc toàn bộ.
  - Chọn thời gian: 30 phút, 60 phút, 90 phút (mặc định 2.5 phút/câu theo chuẩn Oracle).
- **Giao diện phòng thi:**
  - Đồng hồ đếm ngược nổi (Floating Timer) cố định trên góc màn hình: chuyển màu vàng khi còn dưới 5 phút, nhấp nháy đỏ khi còn dưới 1 phút. Tự động nộp bài khi hết giờ.
  - Thanh lưới câu hỏi (Question Palette Drawer): hiển thị số ô 1..N:
    - Màu xám: Chưa trả lời.
    - Màu xanh dương: Đã chọn phương án.
    - Icon lá cờ 🚩 màu vàng: Đã cắm cờ xem lại sau.
  - Ẩn hoàn toàn kết quả và giải thích trong khi đang thi.
- **Màn hình Kết quả Thi (Exam Result Screen):**
  - Điểm tổng kết: Số câu đúng / Tổng số câu, Điểm phần trăm (%).
  - Huy hiệu kết quả: **PASSED 🎉** (nếu $\ge 68\%$) hoặc **FAILED ⚠️** (nếu $< 68\%$).
  - Biểu đồ thống kê phân tích kết quả theo từng chương (để biết chương nào còn hổng kiến thức).
  - Danh sách toàn bộ câu hỏi của đề thi với bộ lọc: "Tất cả", "Câu làm sai", "Câu làm đúng", "Câu đã cắm cờ" để người dùng xem lại chi tiết từng câu.

---

## 5. Quản lý Trạng thái & Lưu trữ (State & LocalStorage)

Cấu trúc dữ liệu lưu trong `localStorage`:
```javascript
{
  "theme": "dark", // hoặc "light"
  "bookmarks": ["ch1_q3", "ch2_q8"], // Danh sách ID câu hỏi đã đánh dấu
  "mistakes": {
    "ch1_q2": { "wrongCount": 2, "lastAttempt": "2026-10-05T12:00:00Z" }
  },
  "practiceProgress": {
    "ch1_q1": { "answered": true, "isCorrect": true }
  },
  "examHistory": [
    {
      "id": "exam_1728134000",
      "timestamp": "2026-10-05T12:30:00Z",
      "totalQuestions": 25,
      "correctCount": 20,
      "scorePercent": 80,
      "passed": true,
      "chapterBreakdown": { "ch1": { "total": 10, "correct": 9 }, ... }
    }
  ]
}
```

---

## 6. Kế hoạch Kiểm thử & Xác minh (Verification Plan)

1. **Kiểm tra Parser:** Chạy `node parser.js`, xác minh file `quiz-data.js` sinh ra đủ 7 chương, trích xuất chuẩn xác 100% câu hỏi, không bị sót code Java hay đáp án.
2. **Kiểm tra Giao diện trên trình duyệt:** Sử dụng subagent mở trình duyệt thực tế để kiểm tra:
   - Dashboard hiển thị đầy đủ 7 chương.
   - Thử nghiệm Chế độ Luyện tập: chọn đáp án, bấm kiểm tra, xem giải thích và highlight Prism.js.
   - Thử nghiệm Chế độ Thi thử: chọn đề, kiểm tra đồng hồ đếm ngược, cắm cờ 🚩, nộp bài, kiểm tra màn hình tính điểm.
   - Kiểm tra tính năng Dark Mode / Light Mode và tính năng lưu trữ LocalStorage khi refresh trang.
