import Allocation from '../models/allocationModel.js';
import Course from '../models/courseModel.js';

export const createAllocationRequest = async (req, res) => {
  try {
    const { courseId, faculty, preferenceRank, reason } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required.' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const existingRequest = await Allocation.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (existingRequest) {
      return res.status(409).json({ message: 'You already submitted a request for this course.' });
    }

    const allocation = await Allocation.create({
      student: req.user.id,
      course: courseId,
      faculty: faculty || course.faculty,
      preferenceRank: preferenceRank || 1,
      reason: reason || '',
      status: 'pending',
    });

    return res.status(201).json({
      message: 'Course allocation request submitted successfully.',
      allocation,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Allocation request failed.' });
  }
};

export const getMyAllocations = async (req, res) => {
  try {
    const allocations = await Allocation.find({ student: req.user.id })
      .populate('course')
      .sort({ createdAt: -1 });

    return res.json(allocations);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch your allocations.' });
  }
};

export const getAllAllocations = async (req, res) => {
  try {
    const allocations = await Allocation.find()
      .populate('student', 'name email role')
      .populate('course', 'name code department faculty status')
      .sort({ createdAt: -1 });

    return res.json(allocations);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch allocations.' });
  }
};

export const getFacultyAllocations = async (req, res) => {
  try {
    const allocations = await Allocation.find({ faculty: req.user.name })
      .populate('student', 'name email')
      .populate('course', 'name code department faculty status')
      .sort({ createdAt: -1 });

    return res.json(allocations);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch faculty allocations.' });
  }
};

export const approveAllocation = async (req, res) => {
  try {
    const allocation = await Allocation.findById(req.params.id).populate('course');

    if (!allocation) {
      return res.status(404).json({ message: 'Allocation request not found.' });
    }

    allocation.status = 'approved';
    allocation.adminNotes = req.body.adminNotes || 'Approved by admin.';

    await allocation.save();

    return res.json({
      message: 'Allocation approved successfully.',
      allocation,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Approval failed.' });
  }
};

export const rejectAllocation = async (req, res) => {
  try {
    const allocation = await Allocation.findById(req.params.id);

    if (!allocation) {
      return res.status(404).json({ message: 'Allocation request not found.' });
    }

    allocation.status = 'rejected';
    allocation.adminNotes = req.body.adminNotes || 'Rejected by admin.';

    await allocation.save();

    return res.json({
      message: 'Allocation rejected successfully.',
      allocation,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Rejection failed.' });
  }
};
