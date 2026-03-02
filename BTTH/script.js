// Khởi tạo mảng dữ liệu sinh viên
let students = [];

// Hàm tạo ID ngẫu nhiên
const generateId = () => Math.random().toString(36).substr(2, 9);

// Hàm lấy timestamp hiện tại
const getTimestamp = () => Date.now();

// --- YÊU CẦU 1: QUẢN TRỊ DỮ LIỆU ---

// Create Student [cite: 15]
function createStudent() {
  const name = prompt("Nhập tên sinh viên:");
  const age = parseInt(prompt("Nhập tuổi (16-60):"));
  const gpa = parseFloat(prompt("Nhập điểm GPA (0.0 - 10.0):"));

  // Validate đầy đủ dữ liệu
  if (
    !name ||
    isNaN(age) ||
    age < 16 ||
    age > 60 ||
    isNaN(gpa) ||
    gpa < 0 ||
    gpa > 10
  ) {
    alert("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!");
    return;
  }

  const newStudent = {
    id: generateId(),
    name: name,
    age: age,
    gpa: gpa,
    status: "active", // Trạng thái mặc định
    createdAt: getTimestamp(), // Tự động sinh createdAt
    updatedAt: getTimestamp(),
    deletedAt: null,
  };

  students.push(newStudent);
  alert("Thêm sinh viên thành công!");
}

// Update Student (Partial Update)
function updateStudent() {
  const id = prompt("Nhập ID sinh viên cần cập nhật:");
  const student = students.find((s) => s.id === id);

  if (!student) {
    alert("Không tìm thấy sinh viên!");
    return;
  }

  // Cho phép bỏ trống trường không muốn sửa
  const newName = prompt(
    `Nhập tên mới (để trống nếu giữ nguyên '${student.name}'):`,
  );
  const newAge = prompt(
    `Nhập tuổi mới (để trống nếu giữ nguyên '${student.age}'):`,
  );
  const newGpa = prompt(
    `Nhập GPA mới (để trống nếu giữ nguyên '${student.gpa}'):`,
  );

  if (newName) student.name = newName;
  if (newAge && !isNaN(newAge)) student.age = parseInt(newAge);
  if (newGpa && !isNaN(newGpa)) student.gpa = parseFloat(newGpa);

  student.updatedAt = getTimestamp(); // Cập nhật updatedAt
  alert("Cập nhật thành công!");
}

// Soft Delete Student [cite: 23]
function softDeleteStudent() {
  const id = prompt("Nhập ID sinh viên cần xóa:");
  const student = students.find((s) => s.id === id);

  if (!student) {
    alert("Không tìm thấy sinh viên!");
    return;
  }

  // Phải có bước xác nhận trước khi thực hiện
  const confirmDelete = confirm(
    `Bạn có chắc muốn xóa sinh viên ${student.name}?`,
  );
  if (confirmDelete) {
    student.status = "inactive"; // Chuyển status sang "inactive"
    student.deletedAt = getTimestamp(); // Gán deletedAt
    alert("Đã xóa (soft delete) sinh viên!"); // Không xóa khỏi mảng
  }
}

// Restore Student
function restoreStudent() {
  const id = prompt("Nhập ID sinh viên cần phục hồi:");
  const student = students.find((s) => s.id === id && s.status === "inactive");

  if (!student) {
    alert("Không tìm thấy sinh viên bị xóa!");
    return;
  }

  // Phục hồi sinh viên đã bị soft delete
  student.status = "active"; // Gán lại status = "active"
  student.deletedAt = null;
  student.updatedAt = getTimestamp(); // Cập nhật updatedAt
  alert("Phục hồi sinh viên thành công!");
}

// --- YÊU CẦU 2: DATA PIPELINE --- [

// Hàm callback định dạng hiển thị, giúp không fix cứng logic vào bên trong map
const formatStudentDisplay = (s) =>
  `[${s.id}] ${s.name} - Tuổi: ${s.age} - GPA: ${s.gpa} - Trạng thái: ${s.status}`;

// View Students (Pipeline Mode) [cite: 31]
function viewStudents() {
  // Toàn bộ pipeline phải xử lý trên bản sao dữ liệu
  let pipeline = [...students];

  // Search theo tên không phân biệt hoa thường
  const keyword = prompt("Tìm kiếm theo tên (để trống để bỏ qua):");
  if (keyword) {
    pipeline = pipeline.filter((s) =>
      s.name.toLowerCase().includes(keyword.toLowerCase()),
    );
  }

  // Filter theo trạng thái sinh viên
  const statusFilter = prompt(
    "Lọc theo trạng thái (active/inactive, để trống để bỏ qua):",
  );
  if (statusFilter === "active" || statusFilter === "inactive") {
    pipeline = pipeline.filter((s) => s.status === statusFilter);
  }

  // Sort theo điểm gpa
  const sortOrder = prompt("Sắp xếp theo GPA (asc/desc, để trống để bỏ qua):");
  if (sortOrder === "asc") {
    pipeline.sort((a, b) => a.gpa - b.gpa);
  } else if (sortOrder === "desc") {
    pipeline.sort((a, b) => b.gpa - a.gpa);
  }

  // Pagination
  const limit = 5; // Mặc định 5 bản ghi/trang
  const totalRecords = pipeline.length;
  const totalPages = Math.ceil(totalRecords / limit) || 1;
  let currentPage = 1;

  let continueViewing = true;
  do {
    const startIndex = (currentPage - 1) * limit;
    // Chia kết quả thành trang
    const paginatedData = pipeline.slice(startIndex, startIndex + limit);

    // Sử dụng map với callback linh hoạt để render dữ liệu
    const displayData = paginatedData.map(formatStudentDisplay).join("\n");

    // Hiển thị: Trang hiện tại / Tổng trang / Tổng bản ghi
    const message = `--- DANH SÁCH SINH VIÊN ---\n${displayData || "Không có dữ liệu"}\n\nTrang ${currentPage}/${totalPages} (Tổng: ${totalRecords})\nNhập 'n' (Next), 'p' (Prev), 'f' (First), 'l' (Last), hoặc 'q' (Thoát):`;

    const action = prompt(message);
    // Hỗ trợ: First, Last, Next, Prev
    switch (action) {
      case "n":
        if (currentPage < totalPages) currentPage++;
        break;
      case "p":
        if (currentPage > 1) currentPage--;
        break;
      case "f":
        currentPage = 1;
        break;
      case "l":
        currentPage = totalPages;
        break;
      case "q":
      case null:
        continueViewing = false;
        break;
      default:
        alert("Lựa chọn không hợp lệ!");
    }
  } while (continueViewing);
}

// --- YÊU CẦU 3: ANALYTICS & REPORTING --- [cite: 44]

// Analytics Dashboard
function analyticsDashboard() {
  if (students.length === 0) {
    alert("Chưa có dữ liệu để thống kê!");
    return;
  }

  const stats = students.reduce(
    (acc, curr) => {
      // Dashboard Overview
      acc.total++; // Tổng số sinh viên
      curr.status === "active" ? acc.active++ : acc.inactive++; // Số lượng active / inactive

      // GPA Metrics [cite: 52]
      acc.totalGpa += curr.gpa;
      if (curr.status === "active") acc.activeGpa += curr.gpa;

      // Risk Report [cite: 58]
      if (curr.gpa === 0) acc.riskZero.push(curr.name); // Danh sách sinh viên có GPA = 0
      if (curr.gpa < 3.0) acc.riskLow.push(curr.name); // Danh sách sinh viên có GPA < 3.0

      return acc;
    },
    {
      total: 0,
      active: 0,
      inactive: 0,
      totalGpa: 0,
      activeGpa: 0,
      riskZero: [],
      riskLow: [],
    },
  );

  const avgGpa = (stats.totalGpa / stats.total).toFixed(2); // GPA trung bình toàn hệ thống
  const activePercent = ((stats.active / stats.total) * 100).toFixed(2); // Tỷ lệ phần trăm
  const totalRisk = stats.riskLow.length; // Tổng số sinh viên có nguy cơ

  let report = `=== ANALYTICS DASHBOARD ===\n`;
  report += `- Tổng SV: ${stats.total}\n`;
  report += `- Active: ${stats.active} (${activePercent}%) | Inactive: ${stats.inactive}\n`;
  report += `- GPA trung bình toàn hệ thống: ${avgGpa}\n`;
  report += `- SV có nguy cơ (GPA < 3.0): ${totalRisk} sinh viên\n`;

  alert(report);
}

// --- MENU CHÍNH ---
function main() {
  let choice;
  do {
    const menu = `==== STUDENT MANAGER ADVANCED ==== [cite: 65]
1. Create Student [cite: 66]
2. Update Student [cite: 67]
3. Soft Delete Student [cite: 68]
4. Restore Student [cite: 69]
5. View Students [cite: 70]
6. Analytics Dashboard [cite: 71]
7. Exit [cite: 72]
Nhập lựa chọn của bạn (1-7):`;

    choice = prompt(menu);

    switch (choice) {
      case "1":
        createStudent();
        break;
      case "2":
        updateStudent();
        break;
      case "3":
        softDeleteStudent();
        break;
      case "4":
        restoreStudent();
        break;
      case "5":
        viewStudents();
        break;
      case "6":
        analyticsDashboard();
        break;
      case "7":
        console.log("Thoát chương trình.");
        break;
      case null:
        choice = "7";
        break; // Hỗ trợ nút Cancel
      default:
        alert("Lựa chọn không hợp lệ!");
    }
  } while (choice !== "7");
}
