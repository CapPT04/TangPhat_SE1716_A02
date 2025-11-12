// News Article Types
export interface NewsArticle {
  newsArticleId: number;
  newsTitle: string;
  headline?: string;
  createdDate: string;
  newsContent: string;
  newsSource?: string;
  categoryId: number;
  categoryName: string;
  newsStatus: boolean;
  createdById: number;
  createdByName: string;
  updatedById?: number;
  updatedByName?: string;
  modifiedDate?: string;
  tags: Tag[];
}

export interface CreateNewsArticleRequest {
  newsTitle: string;
  headline?: string;
  newsContent: string;
  newsSource?: string;
  categoryId: number;
  newsStatus?: boolean;
  tagIds?: number[];
}

export interface UpdateNewsArticleRequest {
  newsTitle: string;
  headline?: string;
  newsContent: string;
  newsSource?: string;
  categoryId: number;
  newsStatus?: boolean;
  tagIds?: number[];
}

// Tag Types
export interface Tag {
  tagId: number;
  tagName: string;
  note?: string;
}

export interface CreateTagRequest {
  tagName: string;
  note?: string;
}

export interface UpdateTagRequest {
  tagName: string;
  note?: string;
}
