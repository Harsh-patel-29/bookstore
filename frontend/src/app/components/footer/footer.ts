import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <h3>📚 BookStore</h3>
            <p>Your one-stop destination for all your reading needs. Discover, explore, and order books from thousands of titles.</p>
          </div>
          <div class="footer-links-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/books">Browse Books</a></li>
              <li><a href="/cart">My Cart</a></li>
              <li><a href="/orders">My Orders</a></li>
            </ul>
          </div>
          <div class="footer-links-col">
            <h4>Account</h4>
            <ul>
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Register</a></li>
              <li><a href="/profile">My Profile</a></li>
            </ul>
          </div>
          <div class="footer-links-col">
            <h4>Categories</h4>
            <ul>
              <li><a href="/books?category=Fiction">Fiction</a></li>
              <li><a href="/books?category=Science">Science</a></li>
              <li><a href="/books?category=Technology">Technology</a></li>
              <li><a href="/books?category=History">History</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 BookStore. All rights reserved. Built with ❤️</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #1a1d23;
      color: #a0aab4;
      padding: 60px 0 0;
      margin-top: 80px;
    }
    .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; }
    .footer-brand h3 { color: white; font-size: 1.4rem; margin: 0 0 15px; }
    .footer-brand p { line-height: 1.7; font-size: 14px; }
    .footer-links-col h4 { color: white; margin: 0 0 15px; font-size: 1rem; }
    .footer-links-col ul { list-style: none; padding: 0; margin: 0; }
    .footer-links-col li { margin-bottom: 10px; }
    .footer-links-col a { color: #a0aab4; text-decoration: none; font-size: 14px; transition: 0.2s; }
    .footer-links-col a:hover { color: white; }
    .footer-bottom { border-top: 1px solid #2d3038; margin-top: 50px; padding: 20px 0; text-align: center; font-size: 14px; }
    @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
  `]
})
export class FooterComponent {}
