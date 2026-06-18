// World Cup 2026 API Proxy for Vercel
// This backend fetches scores and returns them to the frontend

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    // Fetch World Cup 2026 matches from api-football
    // Using free tier - no API key needed for basic requests
    const apiUrl = 'https://api.api-sports.io/v3/fixtures?league=1&season=2026&status=FT'
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      // Try alternative endpoint
      const altUrl = 'https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=133606'
      const altResponse = await fetch(altUrl)
      
      if (!altResponse.ok) {
        throw new Error('Both APIs unavailable')
      }
      
      const data = await altResponse.json()
      return res.status(200).json({
        success: true,
        source: 'thesportsdb',
        data: data
      })
    }

    const data = await response.json()
    
    res.status(200).json({
      success: true,
      source: 'api-football',
      data: data
    })
  } catch (error) {
    console.error('API Error:', error.message)
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to fetch World Cup 2026 scores'
    })
  }
}
