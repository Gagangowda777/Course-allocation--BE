import User from '../models/userModel.js';
import Course from '../models/courseModel.js';
import Allocation from '../models/allocationModel.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const [
      courseCount,
      studentCount,
      facultyCount,
      pendingAllocations,
      approvedAllocations,
      courses,
      students,
      pendingRequests,
    ] = await Promise.all([
      Course.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'faculty' }),
      Allocation.countDocuments({ status: 'pending' }),
      Allocation.countDocuments({ status: 'approved' }),
      Course.find().sort({ createdAt: -1 }),
      User.find({ role: 'student' }).select('name email role').sort({ createdAt: -1 }),
      Allocation.find({ status: 'pending' })
        .populate('student', 'name email role')
        .populate('course', 'name code department faculty status')
        .sort({ createdAt: -1 }),
    ]);

    return res.json({
      user: req.user,
      summary: {
        courseCount,
        studentCount,
        facultyCount,
        pendingAllocations,
        approvedAllocations,
      },
      courses,
      students,
      pendingRequests,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch admin dashboard data.' });
  }
};

export const getStudentDashboard = async (req, res) => {
  try {
    const [openCourses, myAllocations] = await Promise.all([
      Course.find({ status: 'open' }).sort({ createdAt: -1 }),
      Allocation.find({ student: req.user.id }).populate('course').sort({ createdAt: -1 }),
    ]);

    return res.json({
      user: req.user,
      openCourses,
      myAllocations,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch student dashboard data.' });
  }
};

export const getFacultyDashboard = async (req, res) => {
  try {
    const [assignedCourses, allocations] = await Promise.all([
      Course.find({ faculty: req.user.name }).sort({ createdAt: -1 }),
      Allocation.find({ faculty: req.user.name })
        .populate('student', 'name email')
        .populate('course', 'name code department')
        .sort({ createdAt: -1 }),
    ]);

    return res.json({
      user: req.user,
      assignedCourses,
      allocations,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch faculty dashboard data.' });
  }
};
