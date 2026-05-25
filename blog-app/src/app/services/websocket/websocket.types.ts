export interface CommentCreatedPayload {
  commentId: string;
  articleId: string;
  content: string;
  username: string;
  createdAt: string;
}

export interface CommentRatingChangedPayload {
  commentId: string;
  articleId: string;
  rating: number;
  prevRating?: number;
}

export interface ArticleRatingChangedPayload {
  articleId: string;
  rating: number;
  prevRating?: number;
}

export type WebSocketEventData =
  | { type: 'COMMENT_CREATED'; payload: CommentCreatedPayload }
  | { type: 'COMMENT_RATING_CHANGED'; payload: CommentRatingChangedPayload }
  | { type: 'ARTICLE_RATING_CHANGED'; payload: ArticleRatingChangedPayload };

export interface WebSocketEvent {
  eventName: 'comment-created' | 'comment-rating-changed' | 'article-rating-changed';
  data: WebSocketEventData;
}
