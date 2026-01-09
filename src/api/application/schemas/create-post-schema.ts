import { z } from "zod";
import { Category } from "../../domain/entities/enums/Category";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  body: z.string().min(1, "Body is required"),
  tag: z.string().min(1, "Tag is required"),
  category: z.nativeEnum(Category, {
    errorMap: () => ({
      message: "Category must be graduação, extensão, pesquisa, or eventos",
    }),
  }),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
