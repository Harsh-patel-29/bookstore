import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:5000/api/books';

  constructor(private http: HttpClient) { }

  getBooks(search?: string, category?: string): Observable<Book[]> {
    let url = this.apiUrl;
    if (search || category) {
      url += '?';
      if (search) url += `search=${search}&`;
      if (category) url += `category=${category}`;
    }
    return this.http.get<Book[]>(url);
  }

  getBook(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  addBook(bookData: FormData): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, bookData);
  }

  updateBook(id: string, bookData: FormData): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, bookData);
  }

  deleteBook(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
