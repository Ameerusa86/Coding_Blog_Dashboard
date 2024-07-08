export interface Blog {
  id: string;
  title: string;
  body: string;
  author: string;
  date: string;
  comments: BlogComment[];
  slug: string;
  createdAt: {
    seconds: number;
  };
}

export interface BlogComment {
  id: string;
  text: string;
  username: string;
}
