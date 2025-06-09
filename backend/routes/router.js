import { Router } from 'express';
import { body, header } from 'express-validator';

import {
  signup,
  login,
  getAllMembers,
  getOneMember,
  changePassword,
  deleteMember,
  updateMember,
  resetPassword,
  setNewPassword,
  filterMember,
} from '../controllers/members.js';

import { upload, checkToken } from '../common/middlewares.js';

const router = new Router();

// TODO: check token einbauen
router.get('/members', getAllMembers);
router.get('/members/search', filterMember);
router.get('/members/:id', getOneMember);

router.post(
  '/members/signup',
  // upload.single('photo'),
  body('firstName').trim().escape().isLength({ min: 2, max: 50 }),
  body('lastName').trim().escape().isLength({ min: 2, max: 50 }),
  body('username').trim().escape().isLength({ min: 4, max: 50 }),
  body('email').escape().isEmail().toLowerCase().normalizeEmail(),
  body('password').escape().isLength({ min: 6, max: 50 }),
  body('confirmPassword').escape().isLength({ min: 6, max: 50 }),
  signup
);

router.patch(
  '/members/change-password',
  checkToken,
  body('oldPassword').escape().isLength({ min: 6, max: 50 }),
  body('newPassword').escape().isLength({ min: 6, max: 50 }),
  changePassword
);

router.patch(
  '/members/:id',
  checkToken,
  body('firstName').trim().escape().isLength({ min: 2, max: 50 }).optional(),
  body('lastName').trim().escape().isLength({ min: 2, max: 50 }).optional(),
  //  TODO: add email and other
  updateMember
);

router.post(
  '/members/login',
  body('username')
    .escape()
    .notEmpty()
    .withMessage('Username or email is required'),
  body('password').escape().notEmpty().withMessage('Password is required'),
  login
);

router.delete('/members/:id', checkToken, deleteMember);

router.post('/members/reset-password', resetPassword);

router.post(
  '/members/set-new-password',
  body('password').escape().isLength({ min: 6, max: 50 }),
  header('reset-token').escape().isLength({ min: 36, max: 36 }),
  setNewPassword
);

export default router;
