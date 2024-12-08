export interface LibraryService {
    getAllBooks(): Promise<any>;
    getBookById(id: string): Promise<any>;
    createBook(data: any): Promise<any>;
    updateBook(id: string, data: any): Promise<any>;
    deleteBook(id: string): Promise<any>;
    getUserBorrowingInfo(userId: string): Promise<any>;
}
