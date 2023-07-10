import { Router } from 'express';
import * as controller from './controller';
import passport from 'passport';

const router: Router = Router();

router.post('/signup', controller.signUp);
router.post('/signin', controller.signIn);
router.post('/verify-otp', controller.verifyOTP);
router.post('/generate-signature', controller.generateSignature);
router.post('/signin/walletAddress', controller.signinWithWalletAddress);

router.put('/update-user', controller.updateUser);
router.get('/me', controller.userInfo);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }),
);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/signin' }),
  (req: any, res: any) => {
    res.cookie('token', req.user.token);
    res.redirect('/auth/me');
  },
);

router.get('/google/link', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});
router.post('/logout', controller.logout);
export default router;
