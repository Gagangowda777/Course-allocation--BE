import express from 'express';
import {
  approveAllocation,
  createAllocationRequest,
  getAllAllocations,
  getFacultyAllocations,
  getMyAllocations,
  rejectAllocation,
} from '../controllers/allocationController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createAllocationRequest);
router.get('/me', protect, getMyAllocations);
router.get('/all', protect, authorize('admin'), getAllAllocations);
router.get('/faculty', protect, authorize('faculty'), getFacultyAllocations);
router.patch('/:id/approve', protect, authorize('admin'), approveAllocation);
router.patch('/:id/reject', protect, authorize('admin'), rejectAllocation);

export default router;
