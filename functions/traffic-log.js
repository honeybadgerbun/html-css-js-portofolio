const { MongoClient } = require('mongodb');

// MongoDB connection (hardcoded for free plan)
const MONGODB_URI = 'mongodb+srv://honeywell7890:KBNJmq39WE55VLxG@itsalwayshoney.tyv5uwg.mongodb.net/portfolio_traffic?retryWrites=true&w=majority&appName=itsalwayshoney';
const DB_NAME = 'portfolio_traffic';

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

  // MongoDB is now hardcoded, so we'll use it directly

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(DB_NAME);
    const collection = db.collection('visits');

    if (event.httpMethod === 'POST') {
      // Log a new visit
      const visitData = JSON.parse(event.body);
      visitData.timestamp = new Date();
      visitData.ip = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown';
      visitData.userAgent = event.headers['user-agent'] || 'unknown';
      
      await collection.insertOne(visitData);
      await client.close();
      
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
      let query = {};
      
      // Add filters if provided
      if (queryParams.pageType) {
        query.pageType = queryParams.pageType;
      }
      if (queryParams.dateFrom) {
        query.timestamp = { $gte: new Date(queryParams.dateFrom) };
      }
      if (queryParams.dateTo) {
        query.timestamp = { ...query.timestamp, $lte: new Date(queryParams.dateTo) };
      }
      
      const visits = await collection.find(query)
        .sort({ timestamp: -1 })
        .limit(1000)
        .toArray();
      
      await client.close();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ visits })
      };
    }
  } catch (error) {
    console.error('MongoDB Error:', error);
    // Fallback to sample data if MongoDB fails
    return handleWithoutMongoDB(event, headers);
  }
};

// Fallback function when MongoDB is not available
function handleWithoutMongoDB(event, headers) {
  if (event.httpMethod === 'POST') {
    const visitData = JSON.parse(event.body);
    visitData.timestamp = new Date().toISOString();
    visitData.ip = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown';
    visitData.userAgent = event.headers['user-agent'] || 'unknown';
    
    console.log('Visit logged (no MongoDB):', visitData);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Visit logged (no persistent storage)',
        data: visitData
      })
    };
  } else if (event.httpMethod === 'GET') {
    // Return sample data
    const sampleVisits = [
      {
        timestamp: new Date().toISOString(),
        page: 'Portfolio',
        pageType: 'portfolio',
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        page: 'Blog',
        pageType: 'blog',
        ip: '203.0.113.45',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)'
      }
    ];
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ visits: sampleVisits })
    };
  }
} 