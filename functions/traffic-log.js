// Simple traffic logging without MongoDB
// This function stores data in memory and can be extended to use file storage

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
    if (event.httpMethod === 'POST') {
      // Log a new visit
      const visitData = JSON.parse(event.body);
      visitData.timestamp = new Date().toISOString();
      visitData.ip = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown';
      visitData.userAgent = event.headers['user-agent'] || 'unknown';
      
      // In a real implementation, you could store this in a file or simple database
      // For now, we'll just log it and return success
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
      
      // Generate sample data based on filters
      const sampleVisits = generateSampleVisits(queryParams);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ visits: sampleVisits })
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

// Generate sample visit data
function generateSampleVisits(filters = {}) {
  const baseVisits = [
    {
      timestamp: new Date().toISOString(),
      page: 'Portfolio',
      pageType: 'portfolio',
      url: 'https://yourportfolio.com/',
      referrer: 'google.com',
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      page: 'Blog',
      pageType: 'blog',
      url: 'https://yourportfolio.com/blog.html',
      referrer: 'direct',
      ip: '203.0.113.45',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)'
    },
    {
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      page: 'Article',
      pageType: 'article',
      url: 'https://yourportfolio.com/articles/hello_world_article.html',
      referrer: 'https://yourportfolio.com/blog.html',
      ip: '198.51.100.23',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    {
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      page: 'Portfolio',
      pageType: 'portfolio',
      url: 'https://yourportfolio.com/',
      referrer: 'linkedin.com',
      ip: '172.16.0.50',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
    }
  ];

  // Apply filters if provided
  let filteredVisits = baseVisits;
  
  if (filters.pageType) {
    filteredVisits = filteredVisits.filter(visit => visit.pageType === filters.pageType);
  }
  
  if (filters.dateFrom) {
    const dateFrom = new Date(filters.dateFrom);
    filteredVisits = filteredVisits.filter(visit => new Date(visit.timestamp) >= dateFrom);
  }
  
  if (filters.dateTo) {
    const dateTo = new Date(filters.dateTo);
    filteredVisits = filteredVisits.filter(visit => new Date(visit.timestamp) <= dateTo);
  }

  return filteredVisits;
} 