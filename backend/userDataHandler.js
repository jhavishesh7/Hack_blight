const fs = require('fs');
const path = require('path');

// Create inputs.json file if it doesn't exist
const inputsFilePath = path.join(__dirname, 'inputs.json');

// Initialize inputs.json with empty array if it doesn't exist
if (!fs.existsSync(inputsFilePath)) {
  fs.writeFileSync(inputsFilePath, JSON.stringify([], null, 2));
}

// Function to save user data to inputs.json
function saveUserDataToInputs(userData) {
  try {
    // Read existing inputs
    let inputs = [];
    if (fs.existsSync(inputsFilePath)) {
      const fileContent = fs.readFileSync(inputsFilePath, 'utf-8');
      inputs = JSON.parse(fileContent);
    }

    // Create a message from user data for the chatbot
    const userMessage = {
      timestamp: userData.timestamp,
      sessionId: userData.sessionId,
      userId: userData.user.id,
      userEmail: userData.user.email,
      message: generateUserMessage(userData),
      userData: userData // Store full user data for context
    };

    // Add to inputs array
    inputs.push(userMessage);

    // Save back to file
    fs.writeFileSync(inputsFilePath, JSON.stringify(inputs, null, 2));
    
    console.log('✅ User data saved to inputs.json');
    return { success: true, message: 'User data saved successfully' };
  } catch (error) {
    console.error('❌ Error saving user data:', error);
    return { success: false, error: error.message };
  }
}

// Function to generate a user message from user data
function generateUserMessage(userData) {
  const { plants, careSchedules, userListings, appUsage } = userData;
  
  let message = `I'm a plant care user with the following profile:\n\n`;
  
  // User profile
  message += `**User Profile:**\n`;
  message += `- Total Plants: ${appUsage.totalPlants}\n`;
  message += `- Active Care Tasks: ${appUsage.totalTasks}\n`;
  message += `- Marketplace Listings: ${appUsage.totalListings}\n`;
  message += `- Completed Tasks Today: ${appUsage.completedTasksToday}\n\n`;
  
  // Plants information
  if (plants.length > 0) {
    message += `**My Plants:**\n`;
    plants.forEach((plant, index) => {
      message += `${index + 1}. ${plant.name} (${plant.species}) - ${plant.health_status}\n`;
    });
    message += `\n`;
  }
  
  // Care schedules
  if (careSchedules.length > 0) {
    message += `**Active Care Tasks:**\n`;
    careSchedules.filter(schedule => schedule.is_active).forEach((schedule, index) => {
      message += `${index + 1}. ${schedule.task_type} for ${schedule.plant_name} - ${schedule.frequency}\n`;
    });
    message += `\n`;
  }
  
  // Marketplace listings
  if (userListings.length > 0) {
    message += `**My Marketplace Listings:**\n`;
    userListings.forEach((listing, index) => {
      message += `${index + 1}. ${listing.title} - $${listing.price}\n`;
    });
    message += `\n`;
  }
  
  message += `Please provide personalized plant care advice based on my profile and help me optimize my plant care routine.`;
  
  return message;
}

// Express.js endpoint handler (if using Express)
function handleUserDataLog(req, res) {
  try {
    const userData = req.body;
    
    if (!userData || !userData.user || !userData.user.id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid user data format' 
      });
    }
    
    const result = saveUserDataToInputs(userData);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('❌ Error handling user data log:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}

// Simple HTTP server handler (if not using Express)
function handleRequest(req, res) {
  if (req.method === 'POST' && req.url === '/api/user-data-log') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const userData = JSON.parse(body);
        const result = saveUserDataToInputs(userData);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        console.error('❌ Error parsing request body:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: false, 
          error: 'Invalid JSON data' 
        }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      success: false, 
      error: 'Endpoint not found' 
    }));
  }
}

module.exports = {
  saveUserDataToInputs,
  generateUserMessage,
  handleUserDataLog,
  handleRequest
}; 