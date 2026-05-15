export interface Post {
  id: string;
  title: string;
  text: string;
  date: string;
  img: string;
  rating: number;
  categoryId?: string;
}
