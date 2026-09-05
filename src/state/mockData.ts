import {
  DashboardMetrics,
  Product,
  User,
  ExpenseByCategorySummary,
} from "./api";

// Using picsum.photos as reliable placeholder images (S3 bucket returns 301)
export const PRODUCT_IMAGE_URLS = [
  "https://picsum.photos/seed/prod1/150/150",
  "https://picsum.photos/seed/prod2/150/150",
  "https://picsum.photos/seed/prod3/150/150",
];

/** Returns a deterministic image index (0-2) based on productId — no Math.random() */
export const getProductImageIndex = (productId: string): number => {
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = (hash * 31 + productId.charCodeAt(i)) % 3;
  }
  return hash;
};

export const mockProducts: Product[] = [
  { productId: "p1", name: "Wireless Headphones", price: 79.99, stockQuantity: 240, rating: 4.5 },
  { productId: "p2", name: "Mechanical Keyboard", price: 119.99, stockQuantity: 85, rating: 4.8 },
  { productId: "p3", name: "USB-C Hub", price: 34.99, stockQuantity: 412, rating: 4.2 },
  { productId: "p4", name: "Laptop Stand", price: 49.99, stockQuantity: 175, rating: 4.6 },
  { productId: "p5", name: "Webcam HD 1080p", price: 89.99, stockQuantity: 63, rating: 4.3 },
  { productId: "p6", name: "Desk Lamp LED", price: 29.99, stockQuantity: 320, rating: 4.1 },
];

export const mockUsers: User[] = [
  { userId: "u1", name: "Alice Johnson", email: "alice@example.com" },
  { userId: "u2", name: "Bob Smith", email: "bob@example.com" },
  { userId: "u3", name: "Carol White", email: "carol@example.com" },
  { userId: "u4", name: "David Brown", email: "david@example.com" },
  { userId: "u5", name: "Emma Davis", email: "emma@example.com" },
];

export const mockExpenses: ExpenseByCategorySummary[] = [
  { expenseByCategorySummaryId: "e1", category: "Office", amount: "1500", date: "2024-01-15T00:00:00Z" },
  { expenseByCategorySummaryId: "e2", category: "Salaries", amount: "8000", date: "2024-01-15T00:00:00Z" },
  { expenseByCategorySummaryId: "e3", category: "Professional", amount: "2500", date: "2024-01-15T00:00:00Z" },
  { expenseByCategorySummaryId: "e4", category: "Office", amount: "900", date: "2024-02-15T00:00:00Z" },
  { expenseByCategorySummaryId: "e5", category: "Salaries", amount: "8000", date: "2024-02-15T00:00:00Z" },
  { expenseByCategorySummaryId: "e6", category: "Professional", amount: "1800", date: "2024-02-15T00:00:00Z" },
];

export const mockDashboardMetrics: DashboardMetrics = {
  popularProducts: mockProducts.slice(0, 4),
  salesSummary: [
    { salesSummaryId: "s1", totalValue: 1200000, changePercentage: 5.2, date: "2024-01-01T00:00:00Z" },
    { salesSummaryId: "s2", totalValue: 980000, changePercentage: -2.1, date: "2024-02-01T00:00:00Z" },
    { salesSummaryId: "s3", totalValue: 1450000, changePercentage: 8.7, date: "2024-03-01T00:00:00Z" },
    { salesSummaryId: "s4", totalValue: 1100000, changePercentage: 3.4, date: "2024-04-01T00:00:00Z" },
    { salesSummaryId: "s5", totalValue: 1680000, changePercentage: 12.5, date: "2024-05-01T00:00:00Z" },
    { salesSummaryId: "s6", totalValue: 1350000, changePercentage: 6.1, date: "2024-06-01T00:00:00Z" },
  ],
  purchaseSummary: [
    { purchaseSummaryId: "pu1", totalPurchased: 540000, changePercentage: 3.1, date: "2024-01-01T00:00:00Z" },
    { purchaseSummaryId: "pu2", totalPurchased: 620000, changePercentage: 7.5, date: "2024-02-01T00:00:00Z" },
    { purchaseSummaryId: "pu3", totalPurchased: 480000, changePercentage: -4.2, date: "2024-03-01T00:00:00Z" },
    { purchaseSummaryId: "pu4", totalPurchased: 710000, changePercentage: 9.8, date: "2024-04-01T00:00:00Z" },
    { purchaseSummaryId: "pu5", totalPurchased: 590000, changePercentage: 2.3, date: "2024-05-01T00:00:00Z" },
    { purchaseSummaryId: "pu6", totalPurchased: 780000, changePercentage: 11.2, date: "2024-06-01T00:00:00Z" },
  ],
  expenseSummary: [
    { expenseSummarId: "ex1", totalExpenses: 12000, date: "2024-01-01T00:00:00Z" },
    { expenseSummarId: "ex2", totalExpenses: 10500, date: "2024-02-01T00:00:00Z" },
    { expenseSummarId: "ex3", totalExpenses: 13200, date: "2024-03-01T00:00:00Z" },
    { expenseSummarId: "ex4", totalExpenses: 9800, date: "2024-04-01T00:00:00Z" },
    { expenseSummarId: "ex5", totalExpenses: 11500, date: "2024-05-01T00:00:00Z" },
    { expenseSummarId: "ex6", totalExpenses: 14000, date: "2024-06-01T00:00:00Z" },
  ],
  expenseByCategorySummary: mockExpenses,
};
