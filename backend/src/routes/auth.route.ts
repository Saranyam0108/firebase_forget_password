import { Router } from "express";

import {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/forgot-password", forgotPasswordController);

router.post("/reset-password", resetPasswordController);

router.get("/reset", (req, res) => {
  const email = req.query.email;

  res.send(`
  <!DOCTYPE html>
  <html>
  <body>
  <script>
    window.location.href="myapp://resetpassword?email=${email}";
  </script>

  <h3>Opening App...</h3>

  </body>
  </html>
  `);
});

export default router;