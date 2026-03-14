import { Book } from './book';

export interface Order {
    _id?: string;
    userId: any;
    books: { bookId: Book; quantity: number; price: number }[];
    totalPrice: number;
    status: string;
    address: string;
    createdAt?: Date;
}
