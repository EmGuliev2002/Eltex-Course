import { Injectable, inject } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { Post } from '../../models/post.model';
import { PostComment } from '../../models/comment.model';
import { PostDetailStoreService } from './post-detail-store.service';
import { PostDetailService } from './post-detail.service';
import {
  GET_POST_WITH_COMMENTS,
  CREATE_COMMENT,
  COMMENT_RATING_UP,
  COMMENT_RATING_DOWN,
  VOTE_ARTICLE,
} from './post-detail.queries';

interface GraphQLComment {
  id: string;
  username: string;
  content: string;
  rating: number;
  createdAt: string;
}

interface GraphQLArticle {
  id: string;
  title: string;
  content: string;
  imgSrc: string | null;
  avgRating: number;
  rating: number;
  createdAt: string;
  categoryId?: string | null;
  comments: GraphQLComment[];
}

interface GetPostWithCommentsResponse {
  article: GraphQLArticle | null;
}

interface CreateCommentResponse {
  createComment: GraphQLComment & { articleId: string };
}

interface CommentRatingUpResponse {
  commentRatingUp: {
    id: string;
    rating: number;
  };
}

interface CommentRatingDownResponse {
  commentRatingDown: {
    id: string;
    rating: number;
  };
}

interface VoteArticleResponse {
  voteArticle: {
    id: string;
    avgRating: number;
    rating: number;
  };
}

@Injectable()
export class ApiPostDetailService implements PostDetailService {
  private apollo = inject(Apollo);
  private store = inject(PostDetailStoreService);

  public getPostWithComments(
    id: string,
  ): Observable<{ post: Post | null; comments: PostComment[] }> {
    return this.apollo
      .query<GetPostWithCommentsResponse>({
        query: GET_POST_WITH_COMMENTS,
        variables: { id },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((res) => {
          const article = res.data ? res.data.article : null;
          return this.mapPostAndComments(article);
        }),
        tap((res) => {
          this.store.setPost(res.post);
          this.store.setComments(res.comments);
        }),
      );
  }

  public addComment(postId: string, author: string, text: string): Observable<PostComment[]> {
    return this.apollo
      .mutate<CreateCommentResponse>({
        mutation: CREATE_COMMENT,
        variables: {
          createComment: {
            articleId: postId,
            username: author || 'Анонимный режиссер',
            content: text,
          },
        },
      })
      .pipe(
        map(() => {
          return this.store.comments();
        }),
      );
  }

  public updateCommentRating(
    postId: string,
    commentId: string | number,
    newRating: number,
  ): Observable<PostComment[]> {
    const currentComments = this.store.comments();
    const targetComment = currentComments.find((c) => c.id.toString() === commentId.toString());
    const isUp = targetComment ? newRating > targetComment.rating : true;

    return this.apollo
      .mutate<CommentRatingUpResponse | CommentRatingDownResponse>({
        mutation: isUp ? COMMENT_RATING_UP : COMMENT_RATING_DOWN,
        variables: {
          id: commentId.toString(),
        },
      })
      .pipe(
        map((res) => {
          let updatedRating = newRating;
          const data = res.data;

          if (data) {
            if ('commentRatingUp' in data && data.commentRatingUp) {
              updatedRating = data.commentRatingUp.rating;
            } else if ('commentRatingDown' in data && data.commentRatingDown) {
              updatedRating = data.commentRatingDown.rating;
            }
          }

          const updated = currentComments.map((c) =>
            c.id.toString() === commentId.toString() ? { ...c, rating: updatedRating } : c,
          );
          this.store.setComments(updated);
          return updated;
        }),
      );
  }

  public updatePostRating(postId: string, newRating: number): Observable<void> {
    return this.apollo
      .mutate<VoteArticleResponse>({
        mutation: VOTE_ARTICLE,
        variables: {
          id: postId,
          vote: newRating,
        },
      })
      .pipe(
        map((res) => {
          const updatedArticle = res.data?.voteArticle;
          if (updatedArticle) {
            const rating =
              updatedArticle.avgRating !== undefined && updatedArticle.avgRating !== null
                ? updatedArticle.avgRating
                : updatedArticle.rating;
            this.store.updatePostRating(rating);
          }
          return void 0;
        }),
      );
  }

  private mapPostAndComments(article: GraphQLArticle | null): {
    post: Post | null;
    comments: PostComment[];
  } {
    if (!article) {
      return { post: null, comments: [] };
    }

    const post: Post = {
      id: article.id,
      title: article.title,
      text: article.content,
      date: new Date(article.createdAt).toLocaleDateString('ru-RU'),
      img: article.imgSrc ? article.imgSrc : 'rickroll.jpg',
      rating:
        article.avgRating !== undefined && article.avgRating !== null
          ? article.avgRating
          : article.rating,
      categoryId: article.categoryId || undefined,
    };

    const comments: PostComment[] = (article.comments || []).map((c) => ({
      id: c.id,
      author: c.username,
      text: c.content,
      date: new Date(c.createdAt).toLocaleDateString('ru-RU'),
      rating: c.rating,
    }));

    return { post, comments };
  }
}
