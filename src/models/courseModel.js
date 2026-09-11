import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    credits: {
      type: Number,
      default: 3,
    },
    capacity: {
      type: Number,
      default: 30,
    },
    description: {
      type: String,
      default: '',
    },
    faculty: {
      type: String,
      default: 'TBD',
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);

export const seedDefaultCourses = async () => {
  const defaults = [
    {
      code: 'CS101',
      name: 'Introduction to Programming',
      department: 'Computer Science',
      credits: 3,
      capacity: 40,
      faculty: 'Faculty User',
      description: 'Foundations of programming and software problem solving.',
      status: 'open',
    },
    {
      code: 'MATH201',
      name: 'Discrete Mathematics',
      department: 'Mathematics',
      credits: 4,
      capacity: 35,
      faculty: 'Faculty User',
      description: 'Logic, sets, combinatorics, and proof techniques.',
      status: 'open',
    },
    {
      code: 'ENG301',
      name: 'Academic Writing',
      department: 'English',
      credits: 2,
      capacity: 25,
      faculty: 'Faculty User',
      description: 'Writing, research, and communication in academic contexts.',
      status: 'open',
    },
  ];

  for (const course of defaults) {
    const existingCourse = await Course.findOne({ code: course.code.toUpperCase() });
    if (!existingCourse) {
      await Course.create(course);
    }
  }
};

export default Course;
