// schemas/user.schema.ts

import { z as zod } from "zod";

// Main User Schema
export const UserSchema = zod
  .object({
    id: zod.string(),
    userId: zod.string().regex(/^USR\d{6}\d{4}$/, {
      message: "User ID must follow the format USRYYMMDDCOUNTER",
    }),
    googleId: zod.string(),
    name: zod.string().optional(),
    username: zod.string().optional(),
    email: zod
      .string()
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),
    profilePhoto: zod
      .string()
      .url({ message: "Invalid URL for profile photo" }),
    gender: zod.enum(["male", "female", "other", "prefer-not-to-say"]),
    verified: zod.boolean(),
  })
  .strict();

// Derived Schemas
export const CreateUserSchema = UserSchema.pick({
  username: true,
  email: true,
  name: true,
}).extend({
  password: zod
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const LogInUserSchema = UserSchema.pick({
  email: true,
}).extend({
  password: zod
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const UpdateUserSchema = UserSchema.pick({
  id: true,
  userId: true,
  username: true,
  email: true,
  name: true,
  profilePhoto: true,
})
  .partial()
  .required({
    id: true,
  });
