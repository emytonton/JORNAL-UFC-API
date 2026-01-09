import { User } from "./User";
import { Category } from "./enums/Category";

export interface PostProps {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  tag: string;
  media: string; // URL
  category: Category;
  user: User;
  createdAt: Date;
}

export class Post {
  private constructor(private props: PostProps) {}

  static create(
    props: Omit<PostProps, "id" | "createdAt"> & {
      id?: string;
      createdAt?: Date;
    }
  ): Post {
    return new Post({
      id: props.id || crypto.randomUUID(),
      title: props.title,
      subtitle: props.subtitle,
      body: props.body,
      tag: props.tag,
      media: props.media,
      category: props.category,
      user: props.user,
      createdAt: props.createdAt || new Date(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get subtitle(): string {
    return this.props.subtitle;
  }

  get body(): string {
    return this.props.body;
  }

  get tag(): string {
    return this.props.tag;
  }

  get media(): string {
    return this.props.media;
  }

  get category(): Category {
    return this.props.category;
  }

  get user(): User {
    return this.props.user;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toJSON() {
    return {
      id: this.props.id,
      title: this.props.title,
      subtitle: this.props.subtitle,
      body: this.props.body,
      tag: this.props.tag,
      media: this.props.media,
      category: this.props.category,
      user: this.props.user.toJSON(),
      createdAt: this.props.createdAt,
    };
  }
}
