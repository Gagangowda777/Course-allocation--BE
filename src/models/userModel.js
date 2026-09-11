import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty'],
      default: 'student',
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export const seedDefaultUsers = async () => {
  const defaultUsers = [
    {
      name: 'Admin User',
      email: 'admin@courseallocation.edu',
      password: 'admin123',
      role: 'admin',
    },
    {
      name: 'Student User',
      email: 'student@courseallocation.edu',
      password: 'student123',
      role: 'student',
    },
    {
      name: 'Faculty User',
      email: 'faculty@courseallocation.edu',
      password: 'faculty123',
      role: 'faculty',
    },
  ];

  for (const user of defaultUsers) {
    const existingUser = await User.findOne({ email: user.email.toLowerCase() });

    if (!existingUser) {
      await User.create(user);
    }
  }
};

export default User;
