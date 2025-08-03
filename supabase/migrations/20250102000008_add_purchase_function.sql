-- Add secure function for completing purchases

-- Create function to complete a purchase
CREATE OR REPLACE FUNCTION complete_purchase(
  listing_id_param UUID,
  buyer_id_param UUID,
  buyer_name_param TEXT,
  buyer_email_param TEXT,
  buyer_phone_param TEXT,
  delivery_address_param TEXT,
  delivery_instructions_param TEXT
) RETURNS JSON AS $$
DECLARE
  listing_record user_listings%ROWTYPE;
  result JSON;
BEGIN
  -- Get the listing details
  SELECT * INTO listing_record 
  FROM user_listings 
  WHERE id = listing_id_param AND status = 'active';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Listing not found or not available for purchase';
  END IF;
  
  -- Update the listing status to sold
  UPDATE user_listings 
  SET status = 'sold', updated_at = now()
  WHERE id = listing_id_param;
  
  -- Send notification to seller
  PERFORM send_notification(
    listing_record.user_id,
    'New Purchase! 🎉',
    format('Your listing "%s" has been purchased by %s for रु %s %s. Payment method: Cash on Delivery.', 
           listing_record.title, 
           buyer_name_param, 
           listing_record.price, 
           listing_record.currency),
    'sale',
    listing_id_param,
    buyer_id_param
  );
  
  -- Return success response
  result := json_build_object(
    'success', true,
    'listing_id', listing_id_param,
    'buyer_id', buyer_id_param,
    'message', 'Purchase completed successfully'
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 