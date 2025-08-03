-- Update existing listings to use Nepali Rupees and Nepal locations

-- Update currency to NPR and adjust prices (rough conversion: 1 USD ≈ 133 NPR)
UPDATE user_listings 
SET 
  currency = 'NPR',
  price = CASE 
    WHEN currency = 'USD' THEN ROUND(price * 133)
    WHEN currency = 'EUR' THEN ROUND(price * 145)
    WHEN currency = 'GBP' THEN ROUND(price * 170)
    ELSE price
  END,
  location = CASE 
    WHEN location LIKE '%New York%' THEN 'Kathmandu, Nepal'
    WHEN location LIKE '%London%' THEN 'Pokhara, Nepal'
    WHEN location LIKE '%Paris%' THEN 'Lalitpur, Nepal'
    WHEN location LIKE '%Tokyo%' THEN 'Bharatpur, Nepal'
    WHEN location LIKE '%Sydney%' THEN 'Birgunj, Nepal'
    WHEN location IS NULL OR location = '' THEN 'Kathmandu, Nepal'
    ELSE location
  END
WHERE currency IN ('USD', 'EUR', 'GBP') OR location NOT LIKE '%Nepal%';

-- Update any remaining USD prices to reasonable NPR values
UPDATE user_listings 
SET price = CASE 
  WHEN price < 1000 THEN 1500  -- Minimum reasonable price in NPR
  WHEN price > 50000 THEN 15000 -- Maximum reasonable price in NPR
  ELSE price
END
WHERE currency = 'NPR' AND (price < 1000 OR price > 50000); 