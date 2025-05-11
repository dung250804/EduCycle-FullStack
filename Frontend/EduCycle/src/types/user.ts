// Interface for User, matching Users table
export interface User {
  userId: string; // Matches user_id (VARCHAR)
  name: string;
  email: string;
  role: string; // As per frontend requirement
  reputationScore: number; // Matches reputation_score
  violationCount: number; // Matches violation_count
  walletBalance: number; // Matches wallet_balance (DECIMAL)
  rating: number; // Matches rating (DECIMAL)
  status: "Active" | "Banned"; // Matches status
  avatar: string; // Matches avatar
}

// Type for ItemType, matching Sell_Exchange_Posts.type
export type ItemType = "Liquidation" | "Exchange" | "Donation";

// Interface for Post, matching Sell_Exchange_Posts table
export interface Post {
  postId: string;
  seller: {
    userId: string; // Matches seller_id (VARCHAR)
    name: string;
    avatar: string; // Matches seller_avatar (VARCHAR)
  };
  item: {
    itemName: string; // Matches item_name (VARCHAR)
    category: {
      name: string; // Matches category_name (VARCHAR)
      description: string; // Matches category_description (VARCHAR)
    };
    imageUrl: string; // Matches item_image (VARCHAR)
  };
  title: string;
  description: string;
  price: number;
  type: 'Liquidation' | 'Exchange';
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Type for ActivityType, matching Activities.activity_type
export type ActivityType = "Donation" | "Fundraiser";

// Interface for Fundraiser, matching Activities table
export interface Fundraiser {
  id: string; // Matches activity_id (VARCHAR)
  title: string;
  description: string;
  goalAmount: number; // Matches goal_amount (DECIMAL)
  amountRaised: number; // Matches amount_raised (DECIMAL)
  image: string;
  organizerId: string; // Matches organizer_id (VARCHAR)
  endDate: string; // Matches end_date (TIMESTAMP, ISO string)
  activityType: ActivityType; // Matches activity_type
  items?: Post[]; // Matches Activity_Item relationship
}

// Type for TransactionType, matching Transactions.type with Sale mapped from Purchase
export type TransactionType = "Purchase" | "Exchange" | "Donation" | "Fundraiser";

// Interface for Transaction, matching Transactions table and backend DTO
export interface Transaction {
  transactionId: string; // Changed to string to match transaction_id (VARCHAR)
  type: TransactionType; // Sale maps to Purchase in backend
  createdAt: string; // Matches created_at (ISO string, e.g., "2025-05-10T10:00:00")
  amount: string; // Derived from post.price or activity.amount_raised, as string
  status: "Pending" | "Completed" | "In Progress" | "Cancelled"; // Matches status
  item: {
    itemId: string;
    itemName: string;
  }| null;
  post: {
    seller: {
      userId: string;
      name: string;
    }
  } | null; 
  activity: {
    organizer: {
      userId: string;
      name: string;
    }
  } | null; 
}

export interface ItemToBackend {
  item_id: string;
  item_name: string;
  description: string;
  image_url: string;
  owner_id: string;
  category_id: string;
  created_at: string;
}