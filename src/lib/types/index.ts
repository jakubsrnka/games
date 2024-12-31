export type ApiResponse<T> = { data: T; error?: never } | { data?: never; error: string };

export type AsyncApiResponse<T> = Promise<ApiResponse<T>>;
