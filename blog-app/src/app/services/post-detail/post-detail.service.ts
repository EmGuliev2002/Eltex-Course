import { Observable } from 'rxjs';
import { Post } from '../../models/post.model';
import { PostComment } from '../../models/comment.model';

export abstract class PostDetailService {
  abstract getPostWithComments(
    id: string,
  ): Observable<{ post: Post | null; comments: PostComment[] }>;

  abstract addComment(postId: string, author: string, text: string): Observable<PostComment[]>;

  abstract updateCommentRating(
    postId: string,
    commentId: string | number,
    newRating: number,
  ): Observable<PostComment[]>;

  abstract updatePostRating(postId: string, newRating: number): Observable<void>;
}
