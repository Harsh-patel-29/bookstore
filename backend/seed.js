const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');
const User = require('./models/User');

dotenv.config();

const books = [
  {
    title: "The Silent Forest",
    author: "Elena Rivers",
    price: 18.99,
    category: "Fiction",
    description: "A haunting tale of mystery and survival in the deep woods of the Pacific Northwest.",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400&h=600",
    stock: 25
  },
  {
    title: "Beyond the Cosmos",
    author: "Dr. Arthur Vance",
    price: 24.50,
    category: "Science",
    description: "An exploration of the latest discoveries in astrophysics and the potential for extraterrestrial life.",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=400&h=600",
    stock: 15
  },
  {
    title: "The Code Master",
    author: "Julia Zhang",
    price: 35.00,
    category: "Technology",
    description: "A comprehensive guide to modern software engineering best practices and architectural patterns.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400&h=600",
    stock: 50
  },
  {
    title: "Echoes of History",
    author: "Marcus Aurelius Smith",
    price: 22.00,
    category: "History",
    description: "Revisiting the forgotten civilizations that shaped the modern world.",
    image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=400&h=600",
    stock: 10
  },
  {
    title: "In the Mind of a Genius",
    author: "Sarah Jenkins",
    price: 19.99,
    category: "Biography",
    description: "The official biography of one of the 21st century's most influential innovators.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400&h=600",
    stock: 30
  },
  {
    title: "The Last Horizon",
    author: "David Moore",
    price: 15.75,
    category: "Fiction",
    description: "A sweeping saga of adventure and betrayal set across three continents.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400&h=600",
    stock: 40
  },
  {
    title: "Future of AI",
    author: "Dr. Karen Hope",
    price: 29.99,
    category: "Technology",
    description: "Addressing the ethical and practical implications of artificial general intelligence.",
    image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=400&h=600",
    stock: 20
  },
  {
    title: "The Great War",
    author: "Robert Hanson",
    price: 26.50,
    category: "History",
    description: "A detailed account of the events leading up to and during the first global conflict.",
    image: "https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&q=80&w=400&h=600",
    stock: 12
  },
  {
    title: "Quantum Leap",
    author: "Lisa Thorne",
    price: 21.00,
    category: "Science",
    description: "Making quantum physics accessible to everyone through simple analogies and experiments.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400&h=600",
    stock: 18
  },
  {
    title: "Shadow of the King",
    author: "Liam Thorne",
    price: 17.50,
    category: "Fiction",
    description: "A high-fantasy epic featuring dragons, magic, and political intrigue.",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400&h=600",
    stock: 60
  }
];

// Add more to reach 30
while(books.length < 30) {
    const base = books[books.length % 10];
    books.push({
        ...base,
        title: `${base.title} (Vol ${Math.floor(books.length / 10) + 1})`,
        price: parseFloat((base.price + Math.random() * 5).toFixed(2)),
        stock: Math.floor(Math.random() * 100)
    });
}

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');
    
    // Clear existing users and books
    await Book.deleteMany({});
    await User.deleteMany({});
    console.log('Deleted old books and users.');
    
    // Add new books
    await Book.insertMany(books);
    console.log('Added 30 demo books!');

    // Add default admin user
    const adminUser = new User({
        name: 'Admin User',
        email: 'admin@bookstore.com',
        password: 'adminpassword123',
        role: 'admin'
    });
    await adminUser.save();
    console.log('Added default admin user (admin@bookstore.com / adminpassword123)!');
    
    mongoose.connection.close();
    console.log('Database seeded and connection closed.');
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

seedDB();
