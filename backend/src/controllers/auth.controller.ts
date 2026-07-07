import { Request, Response } from "express";
import {
  registerService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
} from "../services/auth.service";

// REGISTER
export const registerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await registerService(email, password);
    res.status(201).json({
      message: "User Registered Successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// LOGIN
export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await loginService(email, password);
    res.status(200).json({
      message: "Login Successful",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// FORGOT PASSWORD
export const forgotPasswordController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const result = await forgotPasswordService(email);

    // String wrapped in JSON layout format match for Flutter client
    res.status(200).json({
      message: result, 
    });
  } catch (error: any) {
    console.error("Forgot Password Controller Catch Triggered:", error.message);
    res.status(400).json({
      message: error.message,
    });
  }
};

// RESET PASSWORD
export const resetPasswordController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await resetPasswordService(email, password);
    res.status(200).json({
      message: result,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};