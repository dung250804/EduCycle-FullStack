DROP DATABASE IF EXISTS EduCycle;
CREATE DATABASE EduCycle;
USE EduCycle;
CREATE TABLE Users (
  user_id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  className VARCHAR(36),
  thClass VARCHAR(36),
  password_hash VARCHAR(255) NOT NULL,
  reputation_score INT NOT NULL DEFAULT 100,
  violation_count INT NOT NULL DEFAULT 0,
  wallet_balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
  rating DECIMAL(3, 2) NOT NULL DEFAULT 0,
  status ENUM('Active', 'Banned') NOT NULL DEFAULT 'Active',
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE User_Role (
    user_id VARCHAR(36),
    role_id INT,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) 
);

CREATE TABLE Categories (
  category_id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

	CREATE TABLE Items (
		item_id VARCHAR(36) PRIMARY KEY,
		item_name VARCHAR(100) NOT NULL,
		description TEXT,
		image_url VARCHAR(255),
		owner_id VARCHAR(36),
		category_id VARCHAR(36),
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (owner_id) REFERENCES Users(user_id),
		FOREIGN KEY (category_id) REFERENCES Categories(category_id)
	);

CREATE TABLE Sell_Exchange_Posts (
  post_id VARCHAR(36) PRIMARY KEY,
  seller_id VARCHAR(36) NOT NULL,
  item_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  type ENUM('Liquidation', 'Exchange', 'Fundraiser') NOT NULL,
  product_type VARCHAR(100) NOT NULL,
  status ENUM('Pending', 'Approved', 'Rejected', 'Completed') NOT NULL DEFAULT 'Pending',
  state ENUM('Pending','SellerSent', 'BuyerSent', 'BothSent', 'SellerReceived','BuyerReceived', 'Completed') NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES Users(user_id),
  FOREIGN KEY (item_id) REFERENCES Items(item_id)
);

CREATE TABLE Activities (
  activity_id VARCHAR(36) PRIMARY KEY,
  organizer_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  goal_amount DECIMAL(10, 2) NOT NULL,
  amount_raised DECIMAL(10, 2) NOT NULL DEFAULT 0,
  image VARCHAR(255) NOT NULL,
  activity_type ENUM('Donation', 'Fundraiser') NOT NULL,
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES Users(user_id)
);

CREATE TABLE Activity_Post (
  activity_id VARCHAR(36),
  post_id VARCHAR(36),
  quantity INT DEFAULT 1,
  PRIMARY KEY (activity_id, post_id),
  FOREIGN KEY (activity_id) REFERENCES Activities(activity_id),
  FOREIGN KEY (post_id) REFERENCES Sell_Exchange_Posts(post_id)
);

CREATE TABLE Transactions (
  transaction_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  post_id VARCHAR(36),
  activity_id VARCHAR(36),
  item_id VARCHAR(36),
  type ENUM('Purchase', 'Exchange', 'Donation', 'Fundraiser') NOT NULL,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (post_id) REFERENCES Sell_Exchange_Posts(post_id),
  FOREIGN KEY (activity_id) REFERENCES Activities(activity_id),
  FOREIGN KEY (item_id) REFERENCES Items(item_id)
);

CREATE TABLE Reviews (
  review_id VARCHAR(36) PRIMARY KEY,
  transaction_id VARCHAR(36) NOT NULL,
  reviewer_id VARCHAR(36) NOT NULL,
  reviewee_id VARCHAR(36) NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES Transactions(transaction_id) ,
  FOREIGN KEY (reviewer_id) REFERENCES Users(user_id),
  FOREIGN KEY (reviewee_id) REFERENCES Users(user_id)
);

CREATE TABLE Violations (
  violation_id VARCHAR(36) PRIMARY KEY,
  reporter_id VARCHAR(36) NOT NULL,
  reported_id VARCHAR(36) NOT NULL,
  post_id VARCHAR(36),
  reason TEXT NOT NULL,
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  FOREIGN KEY (reporter_id) REFERENCES Users(user_id),
  FOREIGN KEY (reported_id) REFERENCES Users(user_id),
  FOREIGN KEY (post_id) REFERENCES Sell_Exchange_Posts(post_id) 
);

CREATE TABLE Warehouse_items (
  warehouse_item_id VARCHAR(36) PRIMARY KEY,
  post_id VARCHAR(36),       -- NULL nếu là item từ transaction
  transaction_id VARCHAR(36),-- NULL nếu là item từ post
  quantity INT NOT NULL DEFAULT 1,
  item_condition TEXT,                          -- Mô tả tình trạng vật lý
  status ENUM('Stored', 'CheckedOut', 'Returned', 'Disposed') DEFAULT 'Stored',
  stored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES Sell_Exchange_Posts(post_id)  ,
  FOREIGN KEY (transaction_id) REFERENCES Transactions(transaction_id) 
);