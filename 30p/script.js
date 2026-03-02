let students = [
  { id: 1, name: "Nguyễn Văn A", score: 8.5, gender: "Nam" },
  { id: 2, name: "Trần Thị B", score: 4.2, gender: "Nữ" },
  { id: 3, name: "Lê Văn C", score: 9.0, gender: "Nam" },
  { id: 4, name: "Phạm Thị D", score: 5.5, gender: "Nữ" },
  { id: 5, name: "Hoàng Văn E", score: 3.8, gender: "Nam" },
];
const getTopFemaleStudents = (list) => {
  const result = list
    .filter((student) => student.gender === "Nữ")
    .sort((a, b) => b.score - a.score);
  console.log("Danh sách nữ sinh (điểm giảm dần):", result);
  return result;
};
const getPassedStudentNames = (list) => {
  const result = list
    .filter((student) => student.score >= 5.0)
    .map((student) => student.name);
  console.log("Tên các sinh viên đạt yêu cầu:", result);
  return result;
};
const calculateAverageMaleScore = (list) => {
  const maleStudents = list.filter((student) => student.gender === "Nam");

  if (maleStudents.length === 0) {
    return 0;
  }

  const totalScore = maleStudents.reduce(
    (sum, student) => sum + student.score,
    0,
  );
  const average = totalScore / maleStudents.length;

  console.log("Điểm trung bình nhóm nam:", average.toFixed(1));
  return average;
};
getTopFemaleStudents(students);
getPassedStudentNames(students);
calculateAverageMaleScore(students);
