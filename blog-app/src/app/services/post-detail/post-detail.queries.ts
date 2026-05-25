import { gql } from 'apollo-angular';

export const GET_POST_WITH_COMMENTS = gql`
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

export const CREATE_COMMENT = gql`
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

export const COMMENT_RATING_UP = gql`
  mutation CommentRatingUp($id: ID!) {
    commentRatingUp(id: $id) {
      id
      rating
    }
  }
`;

export const COMMENT_RATING_DOWN = gql`
  mutation CommentRatingDown($id: ID!) {
    commentRatingDown(id: $id) {
      id
      rating
    }
  }
`;

export const VOTE_ARTICLE = gql`
  mutation VoteArticle($id: ID!, $vote: Float!) {
    voteArticle(id: $id, vote: $vote) {
      id
      avgRating
      rating
    }
  }
`;
