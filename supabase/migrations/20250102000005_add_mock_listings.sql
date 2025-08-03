-- Add mock listings data for marketplace

-- First, let's ensure we have some plants to reference
INSERT INTO plants (id, user_id, name, species, location, health_score, notes, created_at, updated_at) 
VALUES 
  ('mock-plant-1', 'c2704533-a6b2-4f17-88e5-015d333d2e53', 'Monstera Deliciosa', 'Monstera deliciosa', 'Living Room', 95, 'Beautiful Swiss cheese plant with large fenestrated leaves', now(), now()),
  ('mock-plant-2', 'c2704533-a6b2-4f17-88e5-015d333d2e53', 'Snake Plant', 'Sansevieria trifasciata', 'Bedroom', 90, 'Low maintenance snake plant, perfect for beginners', now(), now()),
  ('mock-plant-3', 'c2704533-a6b2-4f17-88e5-015d333d2e53', 'Peace Lily', 'Spathiphyllum', 'Office', 88, 'Air-purifying peace lily with white flowers', now(), now()),
  ('mock-plant-4', 'c2704533-a6b2-4f17-88e5-015d333d2e53', 'ZZ Plant', 'Zamioculcas zamiifolia', 'Corner', 92, 'Drought-tolerant ZZ plant, very hardy', now(), now()),
  ('mock-plant-5', 'c2704533-a6b2-4f17-88e5-015d333d2e53', 'Pothos', 'Epipremnum aureum', 'Kitchen', 87, 'Golden pothos with trailing vines', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Now add mock listings
INSERT INTO user_listings (id, user_id, plant_id, title, description, price, currency, condition, location, shipping_available, local_pickup, status, views_count, created_at, updated_at) 
VALUES 
  ('mock-listing-1', 'c2704533-a6b2-4f17-88e5-015d333d2e53', 'mock-plant-1', 'Stunning Monstera Deliciosa - Large Leaves', 'Beautiful mature Monstera with large fenestrated leaves. Perfect for plant enthusiasts. Comes in a 12-inch pot. Very healthy and well-cared for.', 6120, 'NPR', 'excellent', 'Kathmandu, Nepal', true, true, 'active', 12, now(), now()),
  
  ('mock-listing-2', 'c2704533-a6b2-4f17-88e5-015d333d2e53', 'mock-plant-2', 'Snake Plant - Low Maintenance Beauty', 'Perfect snake plant for beginners. Very low maintenance and air-purifying. Comes in a decorative 8-inch pot. Great for offices or bedrooms.', 3320, 'NPR', 'good', 'Pokhara, Nepal', false, true, 'active', 8, now(), now()),
  
  ('mock-listing-3', 'c2704533-a6b2-4f17-88e5-015d333d2e53', 'mock-plant-3', 'Peace Lily - Air Purifying Plant', 'Beautiful peace lily with white flowers. Excellent air purifier. Perfect for offices or living rooms. Comes in a 10-inch pot.', 4390, 'NPR', 'excellent', 'Lalitpur, Nepal', true, true, 'active', 15, now(), now()),
  
  ('mock-listing-4', 'c2704533-a6b2-4f17-88e5-015d333d2e53', 'mock-plant-4', 'ZZ Plant - Hardy & Drought Tolerant', 'Very hardy ZZ plant that requires minimal care. Perfect for busy people or plant beginners. Comes in a 6-inch pot.', 3790, 'NPR', 'good', 'Bharatpur, Nepal', false, true, 'active', 6, now(), now()),
  
  ('mock-listing-5', 'c2704533-a6b2-4f17-88e5-015d333d2e53', 'mock-plant-5', 'Golden Pothos - Trailing Beauty', 'Beautiful golden pothos with long trailing vines. Perfect for hanging baskets or shelves. Very easy to care for. Comes in a 8-inch pot.', 2660, 'NPR', 'fair', 'Birgunj, Nepal', true, true, 'active', 10, now(), now())
ON CONFLICT (id) DO NOTHING; 