import { z } from "zod"

const isGitHubRepoUrl = (url: string) => {
    const githubRepoPattern = /^https:\/\/github\.com\/[^\/]+\/[^\/]+$/;
    return githubRepoPattern.test(url);
};

export const FormSchema = z.object({
    repoUrl: z
      .string()
      .min(10, {
        message: "URL must be at least 10 characters.",
      })
      .max(160, {
        message: "URL must not be longer than 160 characters.",
      })
      .refine(isGitHubRepoUrl, {
        message: "URL must be a valid GitHub repository.",
      }),
  });