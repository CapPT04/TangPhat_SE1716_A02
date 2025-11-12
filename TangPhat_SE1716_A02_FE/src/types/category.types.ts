// Category Management Types
export interface Category {
  categoryId: number;
  categoryName: string;
  categoryDescription?: string;
  parentCategoryId?: number;
  parentCategoryName?: string;
  isActive: boolean;
}

export interface CreateCategoryRequest {
  categoryName: string;
  categoryDescription?: string;
  parentCategoryId?: number;
  isActive?: boolean;
}

export interface UpdateCategoryRequest {
  categoryName: string;
  categoryDescription?: string;
  parentCategoryId?: number;
  isActive?: boolean;
}
