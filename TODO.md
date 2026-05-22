# learning-hub - OTP Send on Vercel

## Plan
1. Fix frontend production API baseURL so `/api/auth/send-otp` hits the Render backend.
2. After URL fix, validate backend email sending by improving error handling/logging.
3. (Optional but recommended) Replace in-memory OTP storage with Redis/db so OTP works across instances.

## Progress
- [x] Update `frontend/src/services/api.js` to use `https://learning-hub-tkm0.onrender.com` as baseURL.
- [ ] Redeploy frontend.
- [ ] Test “Send OTP” and confirm request URL + 200/400 responses.
- [ ] If still failing, add backend try/catch + logging around SMTP and return meaningful error.
- [ ] If OTP verify fails after send, move OTP storage out of `OtpStorage.otpMap`.
