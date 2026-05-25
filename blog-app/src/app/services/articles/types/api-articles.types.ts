export interface BackendArticle {
  id: string;
  title: string;
  content: string;
  imgSrc: string | null;
  categoryId: string | null;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface BackendArticlesResponse {
  items: BackendArticle[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateArticleData {
  title: string;
  text: string;
  categoryId?: string;
  imageFile?: File | null;
  img?: string;
}
