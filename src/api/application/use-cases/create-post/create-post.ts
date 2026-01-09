import { failure, Result, success } from "@wave-telecom/framework/core";
import { Post } from "../../../domain/entities/Post";
import { PostRepository } from "../../../domain/repository/PostRepository";
import { UserRepository } from "../../../domain/repository/UserRepository";
import { CreatePostInput } from "../../schemas/create-post-schema";
import { FileStorage } from "../../service/file-storage";
import { Category } from "../../../domain/entities/enums/Category";

export interface CreatePostOutput {
  post: {
    id: string;
    title: string;
    subtitle: string;
    body: string;
    tag: string;
    media: string;
    category: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      createdAt: Date;
    };
    createdAt: Date;
  };
}

export class CreatePostUseCase {
  constructor(
    private postRepository: PostRepository,
    private userRepository: UserRepository,
    private fileStorage: FileStorage
  ) {}

  async execute(
    input: CreatePostInput,
    userId: string,
    file?: Express.Multer.File
  ): Promise<Result<CreatePostOutput, Error>> {
    try {
      // Verificar se o usuário existe
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return failure(new Error("User not found"));
      }

      // Upload do arquivo para AWS S3
      if (!file) {
        return failure(new Error("Media file is required"));
      }

      const uploadResult = await this.fileStorage.saveFile({
        taskId: userId,
        file: file,
      });

      // Criar post
      const post = Post.create({
        title: String(input.title),
        subtitle: String(input.subtitle),
        body: String(input.body),
        tag: String(input.tag),
        media: uploadResult.url,
        category: input.category as Category,
        user: user,
      });

      // Salvar post
      await this.postRepository.save(post);

      return success({
        post: post.toJSON(),
      });
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to create post")
      );
    }
  }
}
