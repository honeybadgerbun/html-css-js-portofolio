// Simple traffic logging with JSON file storage
// This function stores real visitor data in a JSON file

const fs = require('fs').promises;
const path = require('path');

// Path to the JSON file for storing visit data
const DATA_FILE = path.join(__dirname, 'visits.json');

// Ensure the data file exists
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    // File doesn't exist, create it with empty array
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
  }
}

// Read visit data from file
async function readVisits() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading visits file:', error);
    return [];
  }
}

// Write visit data to file
async function writeVisits(visits) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(visits, null, 2));
  } catch (error) {
    console.error('Error writing visits file:', error);
  }
}

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Ensure data file exists
    await ensureDataFile();

    if (event.httpMethod === 'POST') {
      // Log a new visit
      const visitData = JSON.parse(event.body);
      visitData.timestamp = new Date().toISOString();
      visitData.ip = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown';
      visitData.userAgent = event.headers['user-agent'] || 'unknown';
      visitData.id = Date.now().toString(); // Simple unique ID
      
      // Read existing visits
      const visits = await readVisits();
      
      // Add new visit
      visits.unshift(visitData); // Add to beginning of array
      
      // Keep only last 1000 visits to prevent file from getting too large
      if (visits.length > 1000) {
        visits.splice(1000);
      }
      
      // Write updated visits back to file
      await writeVisits(visits);
      
      console.log('Visit logged:', visitData);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Visit logged successfully',
          data: visitData
        })
      };
    } else if (event.httpMethod === 'GET') {
      // Retrieve visit data with filtering
      const queryParams = event.queryStringParameters || {};
      
      // Read all visits
      let visits = await readVisits();
      
      // Apply filters if provided
      if (queryParams.pageType) {
        visits = visits.filter(visit => visit.pageType === queryParams.pageType);
      }
      
      if (queryParams.dateFrom) {
        const dateFrom = new Date(queryParams.dateFrom);
        visits = visits.filter(visit => new Date(visit.timestamp) >= dateFrom);
      }
      
      if (queryParams.dateTo) {
        const dateTo = new Date(queryParams.dateTo);
        visits = visits.filter(visit => new Date(visit.timestamp) <= dateTo);
      }
      
      // Limit results to prevent overwhelming response
      if (visits.length > 500) {
        visits = visits.slice(0, 500);
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ visits })
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 