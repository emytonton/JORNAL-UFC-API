import { failure, Result, success } from "@wave-telecom/framework/core";
import { PostRepository } from "../../../domain/repository/PostRepository";

export interface ListPostsOutput {
  posts: Array<{
    id: string;
    title: string;
    subtitle: string;
    body: string;
    tag: string;
    media: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      createdAt: Date;
    };
    createdAt: Date;
  }>;
}

export class ListPostsUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(): Promise<Result<ListPostsOutput, Error>> {
    try {
      const posts = await this.postRepository.findAll();

      return success({
        posts: posts.map((post) => post.toJSON()),
      });
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to list posts")
      );
    }
  }
}
