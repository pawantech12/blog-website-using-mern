const { z } = require("zod");

// Define a Zod schema for user validation
const userSchemaValidation = z.object({
  name: z
    .string()
    .min(1, "Name is required") // Required and should not be empty
    .max(50, "Name must be less than 50 characters") // Max length
    .optional(), // Optional

  username: z
    .string()
    .max(30, "Username must be less than 30 characters")
    .optional(), // Optional

  email: z
    .string()
    .email("Invalid email address") // Valid email format
    .nonempty("Email is required") // Required and should not be empty
    .max(100, "Email must be less than 100 characters") // Max length
    .optional(), // Optional

  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be 10 digits") // Valid phone number format (10 digits)
    .max(10, "Phone number must be 10 digits") // Max length for validation
    .optional(), // Optional

  profileImg: z.string().url("Invalid URL for profile image").optional(), // Optional and must be a valid URL

  bannerImg: z.string().url("Invalid URL for banner image").optional(), // Optional and must be a valid URL

  password: z
    .string()
    .min(6, "Password must be at least 6 characters long") // Minimum length
    .max(100, "Password must be less than 100 characters") // Max length
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter") // At least one uppercase letter
    .regex(/[a-z]/, "Password must contain at least one lowercase letter") // At least one lowercase letter
    .regex(/[0-9]/, "Password must contain at least one number") // At least one number
    .regex(/[@$!%*?&]/, "Password must contain at least one special character") // At least one special character
    .optional(), // Optional

  resetCode: z.string().optional(),

  city: z.string().max(50, "City must be less than 50 characters").optional(), // Max length and optional

  state: z.string().max(50, "State must be less than 50 characters").optional(), // Max length and optional

  country: z
    .string()
    .max(50, "Country must be less than 50 characters") // Max length
    .optional(), // Optional

  dob: z
    .date()
    .refine((date) => date < new Date(), "Date of birth must be in the past") // Must be a past date
    .optional(), // Optional

  gender: z.enum(["male", "female", "other"]).optional(), // Only specific values allowed and optional

  age: z.number().min(0, "Age must be a positive number").optional(), // Minimum value and optional

  headline: z
    .string()
    .max(100, "Headline must be less than 100 characters") // Max length
    .optional(), // Optional

  summary: z
    .string()
    .max(500, "Summary must be less than 500 characters") // Max length
    .optional(), // Optional

  savedPosts: z.array(z.string()).optional(), // Array of saved posts IDs

  likedPosts: z.array(z.string()).optional(), // Array of liked posts IDs

  following: z.array(z.string()).optional(), // Array of following user IDs

  followers: z.array(z.string()).optional(), // Array of follower user IDs
});

module.exports = userSchemaValidation;
