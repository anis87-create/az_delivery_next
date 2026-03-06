export interface Category {
    _id?: string,
    name: string
}

export interface CategoryForm {
    name: string
}

export interface CategoryState {
    category: Category | null,
    isError: boolean,
    isLoading: boolean,
    categories: Category[],
    message: string
}
