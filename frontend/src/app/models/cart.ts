import { Book } from './book';

export interface Cart {
    _id?: string;
    userId: string;
    items: { bookId: Book; quantity: number }[];
}
