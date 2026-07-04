import prisma from "../config/prisma";
import { sendResetEmail } from "./mail.services";

export const registerService = async (email: string, password: string) => {

  // Validation
  if (!email || !password) {
    throw new Error("Email and Password are required");
  }

  return await prisma.user.create({
    data: {
      email,
      password,
    },
  });
};

export const loginService = async (email: string, password: string) => {

  // Validation
  if (!email || !password) {
    throw new Error("Email and Password are required");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.password !== password) {
    throw new Error("Invalid password");
  }

  return user;
};

export const forgotPasswordService = async (email: string) => {

  // Validation
  if (!email) {
    throw new Error("Email is required");
  }

  console.log("Email received:", email);

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Current Deep Link
  const resetLink = `myapp://resetpassword?email=${email}`;

  console.log("RESET LINK =", resetLink);

  console.log("BEFORE SEND EMAIL");

  await sendResetEmail(email, resetLink);

  console.log("AFTER SEND EMAIL");

  console.log("Reset Link:");

  console.log(resetLink);

  return "Password reset email sent successfully";
};

export const resetPasswordService = async (
  email: string,
  password: string
) => {

  // Validation
  if (!email || !password) {
    throw new Error("Email and Password are required");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      password,
    },
  });

  return "Password Updated Successfully";
};