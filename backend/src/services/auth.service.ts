import prisma from "../config/prisma";
import { sendResetEmail } from "./mail.services";

export const registerService = async (email: string, password: string) => {
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

  if (!email) {
    throw new Error("Email is required");
  }

  console.log("Email received:", email);

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  console.log("User found:", user);

  if (!user) {
    throw new Error("User not found");
  }

  const resetLink =
    `https://firebase-forget-password.onrender.com/auth/reset?email=${encodeURIComponent(email)}`;

  console.log("RESET LINK =", resetLink);

await sendResetEmail(email, resetLink);

return "Password reset email sent successfully";
};
export const resetPasswordService = async (
  email: string,
  password: string
) => {
  if (!email || !password) {
    throw new Error("Email and Password are required");
  }

console.log("Email received:", email);

const allUsers = await prisma.user.findMany();

console.log("All Users:", allUsers);

const user = await prisma.user.findUnique({
  where: {
    email,
  },
});

console.log("User found:", user);

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