// Interface for User, matching Users table
export interface User {
  userId: string;              // Matches userId
  name: string;                // Matches name
  email: string;               // Matches email
  roles: string[];             // Matches roles (List<String>)
  className: string;           // Matches className
  thClass: string;             // Matches thClass
  reputationScore: number;     // Matches reputationScore (int)
  violationCount: number;      // Matches violationCount (int)
  walletBalance: number;       // Matches walletBalance (BigDecimal)
  rating: number;              // Matches rating (BigDecimal)
  status: string;              // Matches status
  avatar: string;              // Matches avatar
}

// Type for ItemType, matching Sell_Exchange_Posts.type
export type ItemType = "Liquidation" | "Exchange" | "Donation";

// Interface for Post, matching Sell_Exchange_Posts table
export interface Post {
  postId: string;

  item: {
    itemName: string; // Matches item_name (VARCHAR)
    owner: {
      userId: string; // Matches owner_id (VARCHAR)
      name: string; // Matches owner_name (VARCHAR)
      avatar: string; // Matches owner_avatar (VARCHAR)
    }
    category: {
      categoryId: string; // Matches category_id (VARCHAR)
      name: string; // Matches category_name (VARCHAR)
      description: string; // Matches category_description (VARCHAR)
    };
    imageUrl: string; // Matches item_image (VARCHAR)
  };
  price: number;
  title: string;
  description: string;
  type: 'Liquidation' | 'Exchange' | 'Fundraiser';
  status: string;
  createdAt: string;
  updatedAt: string;
  state: string; // Matches state (VARCHAR)
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
   price: number;
}