import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookService } from '../../../services/book';
import { NavbarComponent } from '../../../components/navbar/navbar';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="container admin-container">
      <div class="admin-sidebar card">
        <h3>Admin Menu</h3>
        <ul>
          <li><a routerLink="/admin/dashboard">Dashboard</a></li>
          <li><a routerLink="/admin/books" class="active">Manage Books</a></li>
          <li><a routerLink="/admin/orders">Manage Orders</a></li>
          <li><a routerLink="/admin/users">Manage Users</a></li>
        </ul>
      </div>

      <div class="admin-content">
        <h1>{{ isEdit ? 'Edit' : 'Add' }} Book</h1>
        <div class="card form-card">
          <form (submit)="onSubmit()" #bookForm="ngForm">
            <div class="form-row">
              <div class="form-group">
                <label>Title</label>
                <input type="text" [(ngModel)]="book.title" name="title" required minlength="3" #titleCtrl="ngModel">
                <div *ngIf="titleCtrl.invalid && (titleCtrl.dirty || titleCtrl.touched)" class="validation-error">
                  <span *ngIf="titleCtrl.errors?.['required']">Title is required.</span>
                  <span *ngIf="titleCtrl.errors?.['minlength']">Title must be at least 3 characters.</span>
                </div>
              </div>
              <div class="form-group">
                <label>Author</label>
                <input type="text" [(ngModel)]="book.author" name="author" required minlength="2" #authorCtrl="ngModel">
                <div *ngIf="authorCtrl.invalid && (authorCtrl.dirty || authorCtrl.touched)" class="validation-error">
                  <span *ngIf="authorCtrl.errors?.['required']">Author is required.</span>
                  <span *ngIf="authorCtrl.errors?.['minlength']">Author must be at least 2 characters.</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Price</label>
                <input type="number" [(ngModel)]="book.price" name="price" required min="1" #priceCtrl="ngModel">
                <div *ngIf="priceCtrl.invalid && (priceCtrl.dirty || priceCtrl.touched)" class="validation-error">
                  <span *ngIf="priceCtrl.errors?.['required']">Price is required.</span>
                  <span *ngIf="priceCtrl.errors?.['min']">Price must be greater than 0.</span>
                </div>
              </div>
              <div class="form-group">
                <label>Category</label>
                <select [(ngModel)]="book.category" name="category" required #categoryCtrl="ngModel">
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Technology">Technology</option>
                </select>
                <div *ngIf="categoryCtrl.invalid && (categoryCtrl.dirty || categoryCtrl.touched)" class="validation-error">
                  <span *ngIf="categoryCtrl.errors?.['required']">Category is required.</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="book.description" name="description" required minlength="10" #descCtrl="ngModel"></textarea>
              <div *ngIf="descCtrl.invalid && (descCtrl.dirty || descCtrl.touched)" class="validation-error">
                <span *ngIf="descCtrl.errors?.['required']">Description is required.</span>
                <span *ngIf="descCtrl.errors?.['minlength']">Description must be at least 10 characters.</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Stock</label>
                <input type="number" [(ngModel)]="book.stock" name="stock" required min="0" #stockCtrl="ngModel">
                <div *ngIf="stockCtrl.invalid && (stockCtrl.dirty || stockCtrl.touched)" class="validation-error">
                  <span *ngIf="stockCtrl.errors?.['required']">Stock is required.</span>
                  <span *ngIf="stockCtrl.errors?.['min']">Stock cannot be negative.</span>
                </div>
              </div>
              <div class="form-group">
                <label>Book Image</label>
                <input type="file" (change)="onFileSelect($event)" name="image">
              </div>
            </div>

            <div *ngIf="errorMsg" class="error-msg" style="margin-bottom: 10px;">{{ errorMsg }}</div>
            <button type="submit" class="btn btn-primary" [disabled]="bookForm.invalid || loading">
              {{ isEdit ? 'Update' : 'Add' }} Book
            </button>
          </form>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .admin-container { display: flex; gap: 30px; margin-top: 30px; }
    .admin-sidebar { width: 250px; height: fit-content; }
    .admin-sidebar ul { list-style: none; padding: 0; }
    .admin-sidebar li { margin-bottom: 10px; }
    .admin-sidebar a { text-decoration: none; color: var(--text-dark); display: block; padding: 10px; border-radius: 5px; }
    .admin-sidebar a.active { background: var(--bg-light); color: var(--primary-blue); font-weight: bold; }
    .admin-content { flex: 1; }
    .form-card { padding: 30px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-weight: 600; margin-bottom: 5px; }
    input[type="text"], input[type="number"], select, textarea { width: 100%; padding: 10px; border: 1.5px solid #ddd; border-radius: 8px; box-sizing: border-box; }
    textarea { height: 100px; resize: vertical; }
    .validation-error { color: #dc2626; font-size: 12px; margin-top: 5px; }
    input.ng-invalid.ng-touched, select.ng-invalid.ng-touched, textarea.ng-invalid.ng-touched { border-color: #dc2626; }
    .error-msg { background: #fee2e2; color: #dc2626; padding: 10px 15px; border-radius: 8px; font-size: 14px; }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class AddBookComponent implements OnInit {
  book: any = {
    title: '',
    author: '',
    price: 0,
    category: 'Fiction',
    description: '',
    stock: 0
  };
  selectedFile: File | null = null;
  isEdit = false;
  bookId: string | null = null;
  loading = false;
  errorMsg = '';

  constructor(
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.bookId = this.route.snapshot.paramMap.get('id');
    if (this.bookId) {
      this.isEdit = true;
      this.bookService.getBook(this.bookId).subscribe(book => {
        this.book = book;
      });
    }
  }

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    this.errorMsg = '';
    
    // Additional validation logic
    if (!this.book.title || this.book.title.trim().length < 3) {
      this.errorMsg = 'Title must be at least 3 characters.';
      return;
    }
    if (!this.book.author || this.book.author.trim().length < 2) {
      this.errorMsg = 'Author must be at least 2 characters.';
      return;
    }
    if (this.book.price <= 0) {
      this.errorMsg = 'Price must be greater than 0.';
      return;
    }
    if (this.book.stock < 0) {
      this.errorMsg = 'Stock cannot be negative.';
      return;
    }

    this.loading = true;
    const formData = new FormData();
    Object.keys(this.book).forEach(key => {
      formData.append(key, this.book[key]);
    });
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const obs = this.isEdit 
      ? this.bookService.updateBook(this.bookId!, formData)
      : this.bookService.addBook(formData);

    obs.subscribe({
      next: () => {
        this.loading = false;
        alert(`Book ${this.isEdit ? 'updated' : 'added'} successfully`);
        this.router.navigate(['/admin/books']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.error || 'Failed to save book.';
      }
    });
  }
}
