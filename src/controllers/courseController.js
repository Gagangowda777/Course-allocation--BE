import Course from '../models/courseModel.js';

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    return res.json(courses);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch courses.' });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    return res.json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch course.' });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { code, name, department, credits, capacity, description, faculty, status } = req.body;

    if (!code || !name || !department) {
      return res.status(400).json({ message: 'Course code, name, and department are required.' });
    }

    const existingCourse = await Course.findOne({ code: code.toUpperCase() });
    if (existingCourse) {
      return res.status(409).json({ message: 'Course code already exists.' });
    }

    const course = await Course.create({
      code: code.toUpperCase(),
      name,
      department,
      credits: credits || 3,
      capacity: capacity || 30,
      description: description || '',
      faculty: faculty || 'TBD',
      status: status || 'open',
    });

    return res.status(201).json({ message: 'Course created successfully.', course });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Course creation failed.' });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        course[key] = req.body[key];
      }
    });

    if (course.code) {
      course.code = course.code.toUpperCase();
    }

    await course.save();
    return res.json({ message: 'Course updated successfully.', course });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Course update failed.' });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    return res.json({ message: 'Course deleted successfully.', course });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Course deletion failed.' });
  }
};
