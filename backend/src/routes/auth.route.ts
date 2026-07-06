import { Router } from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/auth.controller";

const router = Router();

// Register
router.post("/register", registerController);

// Login
router.post("/login", loginController);

// Forgot Password
router.post("/forgot-password", forgotPasswordController);

// Reset Password
router.post("/reset-password", resetPasswordController);

// Deep Link Redirect
router.get("/reset", (req, res) => {
  const email = req.query.email;

  res.send(`
    <!DOCTYPE html>
    <html>
      <body>
        <script>
          window.location.href = "myapp://resetpassword?email=${email}";
        </script>

        <h3>Opening App...</h3>
      </body>
    </html>
  `);
});

export default router;