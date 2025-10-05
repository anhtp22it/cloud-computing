# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Event Management System - Frontend

## Cập nhật mới nhất (Latest Updates)

### 🔧 Sửa chữa Mapping Status, Description/Title Truncation và Rich Text Editor

#### 1. **Mapping giữa Backend Enum và Frontend Display**

**Vấn đề:** Backend sử dụng enum uppercase (`UPCOMING`, `ONGOING`, `COMPLETED`, `CANCELLED`) nhưng frontend hiển thị lowercase (`upcoming`, `ongoing`, `completed`, `cancelled`).

**Giải pháp:** Tạo mapping functions trong `src/utils/eventHelpers.js`:

```javascript
// Mapping từ backend enum sang frontend display
export function mapBackendStatusToFrontend(backendStatus) {
  const statusMap = {
    "UPCOMING": "upcoming",
    "ONGOING": "ongoing", 
    "COMPLETED": "completed",
    "CANCELLED": "cancelled"
  };
  return statusMap[backendStatus] || "upcoming";
}

// Mapping từ frontend display sang backend enum
export function mapFrontendStatusToBackend(frontendStatus) {
  const statusMap = {
    "upcoming": "UPCOMING",
    "ongoing": "ONGOING",
    "completed": "COMPLETED", 
    "cancelled": "CANCELLED"
  };
  return statusMap[frontendStatus] || "UPCOMING";
}
```

#### 2. **Cắt bớt Title và Description**

**Vấn đề:** Title và description quá dài làm vỡ layout và khó đọc.

**Giải pháp:** Tạo functions `truncateTitle()` và `truncateDescription()`:

```javascript
// Cắt bớt title nếu quá dài
export function truncateTitle(title, maxLength = 50) {
  if (!title) return "";
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + "...";
}

// Cắt bớt description nếu quá dài (tăng lên 300 ký tự)
export function truncateDescription(description, maxLength = 300) {
  if (!description) return "";
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + "...";
}
```

#### 3. **Rich Text Editor cho Description**

**Vấn đề:** Cần hỗ trợ định dạng phong phú cho mô tả sự kiện.

**Giải pháp:** Tạo component `RichTextEditor` với các tính năng:

- **In đậm (Bold):** Ctrl+B hoặc click button
- **In nghiêng (Italic):** Ctrl+I hoặc click button  
- **Gạch chân (Underline):** Ctrl+U hoặc click button
- **Danh sách (List):** Click button để tạo bullet points
- **Liên kết (Link):** Click button để thêm URL
- **Xóa định dạng:** Click button để reset

#### 4. **Bỏ hiển thị QR Token**

**Thay đổi:** Loại bỏ hiển thị QR Token trong danh sách sự kiện để giao diện gọn gàng hơn.

#### 5. **Cập nhật các Components**

**EventModal.jsx:**
- Sử dụng `mapBackendStatusToFrontend` khi load event từ API
- Sử dụng `mapFrontendStatusToBackend` khi gửi data lên API
- Thêm `RichTextEditor` cho description field
- Tăng character counter lên 300 ký tự
- Cập nhật statusOptions để sử dụng frontend values

**EventManagement.jsx:**
- Sử dụng `mapBackendStatusToFrontend` để convert status
- Thêm `title_short` và `description_short` fields với truncation
- Tăng description truncation lên 300 ký tự
- Cải thiện event mapping logic

**EventList.jsx:**
- Hiển thị `title_short` và `description_short` thay vì full content
- Bỏ hiển thị QR Token
- Sử dụng `dangerouslySetInnerHTML` để hiển thị HTML content
- Bỏ indicator "(đã cắt bớt)" để giao diện sạch sẽ hơn

**Dashboard.jsx:**
- Sử dụng mapping functions cho status display
- Cập nhật `statusColor` object để phù hợp với mapping
- Cải thiện alert generation logic

**dashboardStats.js:**
- Import và sử dụng `mapBackendStatusToFrontend`
- Cập nhật tất cả status counting logic
- Đảm bảo consistency giữa backend và frontend

**RichTextEditor.jsx:**
- Component mới với toolbar formatting
- Hỗ trợ keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U)
- Real-time HTML content generation
- Responsive design cho mobile

**EventManagement.css:**
- Thêm CSS cho rich text editor
- Styling cho toolbar buttons và editor content
- Responsive design cho mobile devices
- Đảm bảo title và description chỉ hiển thị 1 dòng

#### 6. **Status Mapping Table**

| Backend Enum | Frontend Display | Vietnamese Label |
|--------------|------------------|------------------|
| UPCOMING     | upcoming         | Sắp diễn ra      |
| ONGOING      | ongoing          | Đang diễn ra     |
| COMPLETED    | completed        | Đã kết thúc      |
| CANCELLED    | cancelled        | Đã hủy           |

#### 7. **Truncation Features**

- **Title truncation:** 40 ký tự cho list, 50 ký tự cho form
- **Description truncation:** 300 ký tự cho list và form
- **Character counter:** Hiển thị độ dài hiện tại trong form
- **Warning color:** Đỏ khi vượt quá giới hạn
- **Single line display:** CSS đảm bảo chỉ hiển thị 1 dòng
- **Clean UI:** Bỏ indicator "(đã cắt bớt)" và QR Token

#### 8. **Rich Text Editor Features**

- **Toolbar buttons:** Bold, Italic, Underline, List, Link, Clear Format
- **Keyboard shortcuts:** Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+U (Underline)
- **HTML output:** Tự động tạo HTML content
- **Placeholder text:** Hướng dẫn người dùng
- **Active state:** Hiển thị trạng thái active của buttons
- **Mobile responsive:** Tối ưu cho thiết bị di động

### 🚀 Cách sử dụng

1. **Khi load data từ API:**
   ```javascript
   const displayStatus = mapBackendStatusToFrontend(event.status);
   ```

2. **Khi gửi data lên API:**
   ```javascript
   const backendStatus = mapFrontendStatusToBackend(form.status);
   ```

3. **Khi hiển thị title và description:**
   ```javascript
   const shortTitle = truncateTitle(event.title, 40);
   const shortDesc = truncateDescription(event.description, 300);
   ```

4. **Khi sử dụng Rich Text Editor:**
   ```javascript
   <RichTextEditor 
     value={description} 
     onChange={handleDescriptionChange}
     placeholder="Nhập mô tả sự kiện với định dạng phong phú..."
   />
   ```

### 🔍 Testing

- ✅ EventModal: Load và edit event với status mapping
- ✅ EventManagement: Hiển thị events với title/description truncation
- ✅ Dashboard: Thống kê và charts với status mapping
- ✅ API calls: Gửi đúng enum values lên backend
- ✅ UI: Title và description chỉ hiển thị 1 dòng, không có indicator
- ✅ Rich Text Editor: Định dạng text hoạt động đúng
- ✅ QR Token: Đã bỏ hiển thị trong danh sách

### 📝 Notes

- Tất cả status mapping được centralize trong `eventHelpers.js`
- Title và description truncation có thể customize length parameter
- CSS đảm bảo layout consistent với single-line display
- Character counters giúp user hiểu content length
- Rich text editor hỗ trợ HTML content với định dạng phong phú
- Backward compatibility được đảm bảo với fallback logic

---

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables:**
   ```bash
   VITE_BASE_URL=http://localhost:8080/api
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

## Issues Found and Fixed

### ✅ Đã sửa:
- **API Status Enum Mismatch:** Backend expects uppercase enum values, frontend was sending lowercase
- **Title/Description Length:** Long titles and descriptions were breaking UI layout
- **Status Consistency:** Inconsistent status handling across components
- **API Endpoint:** Fixed PUT endpoint from `/events/{id}` to `/events/modify/{id}`
- **UI Cleanliness:** Removed "(đã cắt bớt)" indicators for cleaner interface
- **Single Line Display:** CSS ensures title and description display in single line
- **QR Token Display:** Removed QR Token from event list for cleaner UI
- **Description Length:** Increased description truncation to 300 characters
- **Rich Text Editor:** Added formatting capabilities for description field

### 🔄 Ongoing:
- **Real-time Updates:** Consider implementing WebSocket for live updates
- **Advanced Filtering:** Add more sophisticated search and filter options
- **Performance:** Optimize for large datasets

## Debug Steps

1. **Check API Response:**
   ```javascript
   console.log("API Events:", apiEvents);
   ```

2. **Verify Status Mapping:**
   ```javascript
   console.log("Backend Status:", event.status);
   console.log("Frontend Status:", mapBackendStatusToFrontend(event.status));
   ```

3. **Test Title/Description Truncation:**
   ```javascript
   console.log("Original Title:", event.title);
   console.log("Truncated Title:", truncateTitle(event.title, 40));
   console.log("Original Description:", event.description);
   console.log("Truncated Description:", truncateDescription(event.description, 300));
   ```

4. **Test Rich Text Editor:**
   ```javascript
   console.log("HTML Content:", form.description);
   ```

## File Structure

```
src/
├── api/
│   ├── eventApi.js          # RTK Query endpoints
│   └── rootApi.js           # Base API configuration
├── components/
│   ├── admin/               # Admin-specific components
│   └── common/
│       └── RichTextEditor.jsx  # Rich text editor component
├── pages/
│   ├── admin/
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── EventManagement.jsx  # Event list management
│   │   └── EventModal.jsx   # Event create/edit modal
│   └── auth/                # Authentication pages
├── utils/
│   ├── eventHelpers.js      # Status mapping & utilities
│   └── dashboardStats.js    # Dashboard statistics
└── store/                   # Redux store configuration
```
