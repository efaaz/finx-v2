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