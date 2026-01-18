export interface Category {
    _id?: string,
    name: string
}

export interface CategoryForm {
    name: string
}

export interface CategoryState {
    category: Category,
    isError:  boolean |null,
    isLoading: boolean | null,
    isSuccess: boolean | null,
    categories: Category[]
}

