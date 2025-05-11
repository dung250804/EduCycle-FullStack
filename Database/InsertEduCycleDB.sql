INSERT INTO Roles (role_name) VALUES 
('Admin'),
('Member'),
('Representative'),
('Approval Manager'),
('Warehouse Manager');	
-- Password: user123
INSERT INTO Users (user_id, name, email, password_hash,className, thClass, reputation_score, violation_count, wallet_balance, rating, status, avatar)
VALUES 
('u1', 'Alice Smith', 'alice@vnu.edu.vn', '$2a$10$upOTDavgVyZfYrtNUWHYr.tZw43DDCz.P8/cNDuq3OYuMQbfnBEky', null, null, 100, 0, 100.00, 4.5, 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'),
('u2', 'Bob Johnson', 'bob@vnu.edu.vn', '$2a$10$upOTDavgVyZfYrtNUWHYr.tZw43DDCz.P8/cNDuq3OYuMQbfnBEky', '11A3', '67th', 90, 1, 50.00, 4.0, 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'),
('u3', 'Charlie Lee', 'charlie@vnu.edu.vn', '$2a$10$upOTDavgVyZfYrtNUWHYr.tZw43DDCz.P8/cNDuq3OYuMQbfnBEky', '10A5', '67th', 85, 2, 0.00, 3.8, 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'),
('u4', 'Dung Nguyen', 'dungnguyen@vnu.edu.vn', '$2a$10$upOTDavgVyZfYrtNUWHYr.tZw43DDCz.P8/cNDuq3OYuMQbfnBEky', null, null, 80, 2, 0.00, 3.8, 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=LilPump'),
('u5', 'XXXTentacion', 'xxxtentacion@vnu.edu.vn', '$2a$10$upOTDavgVyZfYrtNUWHYr.tZw43DDCz.P8/cNDuq3OYuMQbfnBEky', null, null, 99, 2, 0.00, 3.8, 'Active', 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Xxxtentacion_mugshot.jpg'),
('u6', 'He He', 'hehe@vnu.edu.vn', '$2a$10$upOTDavgVyZfYrtNUWHYr.tZw43DDCz.P8/cNDuq3OYuMQbfnBEky', '10A5', '67th', 10, 2, 0.00, 3.8, 'Banned', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom');

INSERT INTO User_Role (user_id, role_id) VALUES
('u1', 1),  -- Alice is Admin
('u2', 2),  -- Bob is Member
('u3', 2), -- Charlie is Member
('u3', 3),  -- Charlie is Representative
('u4', 4),  
('u5', 5),  
('u6', 2), 
('u4', 3), 
('u5', 4);

INSERT INTO Categories (category_id, name, description) VALUES
('c1', 'Textbooks', 'Educational books and study materials'),
('c2', 'Electronics', 'Electronic devices and gadgets for academic use'),
('c3', 'School Supplies', 'General supplies needed for school activities'),
('c4', 'Sports Equipment', 'Gear and equipment for sports and physical education'),
('c5', 'Musical Instruments', 'Instruments used for music classes and performances'),
('c6', 'Uniforms', 'Standardized clothing for school use'),
('c7', 'Lab Equipment', 'Tools and equipment for science laboratories');

INSERT INTO Items (item_id, item_name, description, image_url, owner_id, category_id) VALUES
('i1', 'Physics Textbook', 'Grade 12 physics textbook, gently used', 'https://media.kijiji.ca/api/v1/ca-prod-fsbo-ads/images/12/12101086-a4a9-4232-8c69-0d357f20bc5b?rule=kijijica-960-jpg', 'u2', 'c1'),
('i2', 'Scientific Calculator', 'Casio FX-991ES Plus, fully functional', 'https://www.garnerstationery.com/wp-content/uploads/2023/04/Casio-Scientific-calcu-FX-991ES-plus-scaled.jpg', 'u3', 'c2'),
('i3', 'Notebook Pack', 'Set of 5 ruled notebooks', 'https://m.media-amazon.com/images/I/815l1fPVlWL._AC_UF1000,1000_QL80_.jpg', 'u3', 'c3'),
('i4', 'Football', 'Standard football, slightly worn', 'https://imageresizer.static9.net.au/PUM9M021BilSq0PfI87f6pHc0hQ=/1200x900/https%3A%2F%2Fprod.static9.net.au%2Ffs%2F9817dc30-63cf-46f2-8001-5a5d5faa6089', 'u2', 'c4'),
('i5', 'Guitar', 'Acoustic guitar suitable for beginners', 'https://www.martinguitar.com/dw/image/v2/BGJT_PRD/on/demandware.static/-/Library-Sites-MartinSharedLibrary/default/dw53fd4052/images/blog/102023-tone-woods/blog-top-woods-3.jpg', 'u2', 'c5'),
('i6', 'School Uniform Set', 'Includes shirt, trousers, and tie', 'https://dongphuchaianh.vn/wp-content/uploads/2023/06/bo-dong-phuc-dai-hoc-quoc-gia-ha-noi-vnu.jpg', 'u3', 'c6'),
('i7', 'Microscope', 'Functional lab microscope, ideal for students', 'https://i.ebayimg.com/images/g/SUsAAOSwE9hcbfTk/s-l1200.jpg', 'u2', 'c7');

ALTER TABLE Sell_Exchange_Posts MODIFY price DECIMAL(10,2) NULL;

INSERT INTO Sell_Exchange_Posts 
(post_id, seller_id, item_id, title, description, price, type, product_type, status, state)
VALUES
('p1', 'u2', 'i1', 'Physics Textbook for Sale', 'Used textbook in good condition.', 15.00, 'Liquidation', 'book',  'Approved', 'SellerSent'),
('p2', 'u3', 'i2', 'Calculator for Exchange', 'Casio FX calculator, trade for newer model.', NULL, 'Exchange', 'electronics', 'Approved', 'BuyerSent'),
('p3', 'u3', 'i3', 'Notebook Pack for Sale', 'Set of 5 notebooks, barely used.', 5.00, 'Liquidation', 'supplies', 'Approved', 'SellerSent'),
('p4', 'u2', 'i4', 'Football for Sale', 'Durable football for school games.', 10.00, 'Liquidation', 'sports', 'Approved', 'SellerSent'),
('p5', 'u2', 'i5', 'Acoustic Guitar Exchange', 'Looking to trade my guitar for a keyboard.', NULL, 'Exchange', 'music', 'Approved', 'BuyerSent'),
('p6', 'u3', 'i6', 'School Uniform Set', 'Clean, barely worn uniform.', 20.00, 'Liquidation', 'clothing', 'Approved', 'SellerSent'),
('p7', 'u2', 'i7', 'Lab Microscope for Sale', 'Perfect for biology lab work.', 50.00, 'Liquidation', 'equipment', 'Approved', 'SellerSent'),
('p8', 'u3', 'i1', 'Lab Microscope for Sale', 'Perfect for biology lab work.', 50.00, 'Liquidation', 'equipment', 'Approved', 'SellerSent'),
('p9', 'u3', 'i3', 'Notebook Pack for Sale', 'Set of 5 notebooks, barely used.', 5.00, 'Liquidation', 'supplies', 'Approved', 'SellerSent'),
('p10', 'u3', 'i1', 'Lab Microscope for Sale', 'Perfect for biology lab work.', 50.00, 'Fundraiser', 'supplies', 'Completed', 'Completed');
INSERT INTO Activities (activity_id, organizer_id, title, description, goal_amount, image, activity_type, end_date) VALUES
('a1', 'u3', 'Textbook Drive', 'Sell textbooks to collect funds for underprivileged students.', 400.00, 'https://www.whatdowedoallday.com/wp-content/uploads/2013/11/charity-fb.jpg', 'fundraiser', '2025-07-01'),
('a2', 'u4', 'Tech for All', 'Providing basic electronics to students who need them.', 10, 'https://cdn.prod.website-files.com/61d6943d6b59241863c825d6/640c9aa77845384901115932_teach-electronic-to-kids.jpg', 'donation', '2025-06-15');

INSERT INTO Activity_Post (activity_id, post_id, quantity) VALUES
('a1', 'p3', 50),
('a1', 'p8', 50);

INSERT INTO Transactions (transaction_id, user_id, post_id, activity_id, item_id, type, status)
VALUES
('t1', 'u3', 'p1', NULL, NULL, 'Purchase', 'Completed'),
('t2', 'u3', NULL, 'a2', 'i2', 'Donation', 'Pending');

INSERT INTO Reviews (review_id, transaction_id, reviewer_id, reviewee_id, rating, comment)
VALUES
('r1', 't1', 'u3', 'u2', 5, 'Great coordination and fast delivery.');

INSERT INTO Violations (violation_id, reporter_id, reported_id, post_id, reason, admin_notes)
VALUES
('v1', 'u4', 'u3', 'p2', 'Suspicious item description', 'Under review');

INSERT INTO Warehouse_items (warehouse_item_id, post_id, transaction_id, quantity, item_condition, status)
VALUES
('w1', 'p1', NULL, 1, 'Good condition', 'Stored'),
('w2', NULL, 't2', 1, 'Used but functional', 'CheckedOut');
