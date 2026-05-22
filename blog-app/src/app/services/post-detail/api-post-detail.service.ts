import { Injectable, inject } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { Post } from '../../models/post.model';
import { PostComment } from '../../models/comment.model';
import { PostDetailStoreService } from './post-detail-store.service';
import { PostDetailService } from './post-detail.service';

const GET_POST_WITH_COMMENTS = gql`
  query GetPostWithComments($id: ID!) {
    article(id: $id) {
      id
      title
      content
      imgSrc
      avgRating
      rating
      createdAt
      comments {
        id
        username
        content
        rating
        createdAt
      }
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($createComment: CreateCommentInput!) {
    createComment(createComment: $createComment) {
      id
      username
      content
      rating
      createdAt
      articleId
    }
  }
`;

const COMMENT_RATING_UP = gql`
  mutation CommentRatingUp($id: ID!) {
    commentRatingUp(id: $id) {
      id
      rating
    }
  }
`;

const COMMENT_RATING_DOWN = gql`
  mutation CommentRatingDown($id: ID!) {
    commentRatingDown(id: $id) {
      id
      rating
    }
  }
`;

const VOTE_ARTICLE = gql`
  mutation VoteArticle($id: ID!, $vote: Float!) {
    voteArticle(id: $id, vote: $vote) {
      id
      avgRating
      rating
    }
  }
`;

@Injectable()
export class ApiPostDetailService implements PostDetailService {
  private apollo = inject(Apollo);
  private store = inject(PostDetailStoreService);

  public getPostWithComments(
    id: string,
  ): Observable<{ post: Post | null; comments: PostComment[] }> {
    return this.apollo
      .query<any>({
        query: GET_POST_WITH_COMMENTS,
        variables: { id },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((res) => {
          const article = res.data.article;
          if (!article) {
            return { post: null, comments: [] };
          }

          const post: Post = {
            id: article.id,
            title: article.title,
            text: article.content,
            date: new Date(article.createdAt).toLocaleDateString('ru-RU'),
            img: article.imgSrc ? article.imgSrc : 'rickroll.jpg',
            // 5-звездочный рейтинг соответствует avgRating в сущности на бэкенде
            rating:
              article.avgRating !== undefined && article.avgRating !== null
                ? article.avgRating
                : article.rating,
            categoryId: article.categoryId || undefined,
          };

          const comments: PostComment[] = (article.comments || []).map((c: any) => ({
            id: c.id,
            author: c.username,
            text: c.content,
            date: new Date(c.createdAt).toLocaleDateString('ru-RU'),
            rating: c.rating,
          }));

          return { post, comments };
        }),
        tap((res) => {
          this.store.setPost(res.post);
          this.store.setComments(res.comments);
        }),
      );
  }

  public addComment(postId: string, author: string, text: string): Observable<PostComment[]> {
    return this.apollo
      .mutate<any>({
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
        map((res) => {
          const newCommentData = res.data.createComment;
          const newComment: PostComment = {
            id: newCommentData.id,
            author: newCommentData.username,
            text: newCommentData.content,
            date: new Date(newCommentData.createdAt).toLocaleDateString('ru-RU'),
            rating: newCommentData.rating,
          };

          const currentComments = this.store.comments();
          const updated = [...currentComments, newComment];
          this.store.setComments(updated);
          return updated;
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
      .mutate<any>({
        mutation: isUp ? COMMENT_RATING_UP : COMMENT_RATING_DOWN,
        variables: {
          id: commentId.toString(),
        },
      })
      .pipe(
        map((res) => {
          const updatedComment = isUp ? res.data.commentRatingUp : res.data.commentRatingDown;
          const updated = currentComments.map((c) =>
            c.id.toString() === commentId.toString() ? { ...c, rating: updatedComment.rating } : c,
          );
          this.store.setComments(updated);
          return updated;
        }),
      );
  }

  public updatePostRating(postId: string, newRating: number): Observable<void> {
    return this.apollo
      .mutate<any>({
        mutation: VOTE_ARTICLE,
        variables: {
          id: postId,
          vote: newRating,
        },
      })
      .pipe(
        map((res) => {
          const updatedArticle = res.data.voteArticle;
          const rating =
            updatedArticle.avgRating !== undefined && updatedArticle.avgRating !== null
              ? updatedArticle.avgRating
              : updatedArticle.rating;
          this.store.updatePostRating(rating);
          return void 0;
        }),
      );
  }
}
