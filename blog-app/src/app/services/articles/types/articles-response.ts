import { Post } from '../../../models/post.model';
export interface ArticlesResponse {
  articles: Post[];
  totalCount: number;
}
