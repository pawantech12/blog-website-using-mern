const { z } = require("zod");

const socialMediaSchemaValidation = z.object({
  facebook: z.string().url("Invalid Facebook URL").optional(),
  twitter: z.string().url("Invalid Twitter URL").optional(),
  instagram: z.string().url("Invalid Instagram URL").optional(),
  linkedin: z.string().url("Invalid LinkedIn URL").optional(),
  createdAt: z.date().optional(), // Optional, defaults to Date.now in schema
});

module.exports = socialMediaSchemaValidation;
