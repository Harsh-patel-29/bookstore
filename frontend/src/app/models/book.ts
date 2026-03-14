export interface Book {
    _id?: string;
    title: string;
    author: string;
    price: number;
    category: string;
    description: string;
    image: string;
    stock: number;
    createdAt?: Date;
}
