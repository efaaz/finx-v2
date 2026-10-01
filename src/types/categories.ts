export type CategoryType = "income" | "spending";

export type Category = {
  _id: string;
  categoryName: string;
  type: CategoryType;
  userId: string | null;
};

export type CategoriesResponse = {
  statusCode: number;
  message: string;
  data: {
    categories: Category[];
  };
  secure: boolean;
};

export type CategoryFormValues = {
  categoryName: string;
  type: CategoryType;
};

export type ManagedCategory = Category & {
  isDefault: boolean;
  isDisabled: boolean;
};

export type ManageCategoriesResponse = {
  defaultCategories: ManagedCategory[];
  userCategories: ManagedCategory[];
};

export type CategoryResponse = {
  data: ManageCategoriesResponse;
};