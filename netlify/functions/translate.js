// netlify/functions/translate.js
// REMOVE THIS LINE: const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      }
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { word, service } = JSON.parse(event.body);
    
    if (!word) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Word parameter is required' })
      };
    }

    let result = null;

    switch (service) {
      case 'mymemory':
        result = await translateWithMyMemory(word);
        break;
      case 'libretranslate':
        result = await translateWithLibreTranslate(word);
        break;
      default:
        // Try all services in order
        result = await translateWithFallback(word);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Translation error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Translation failed',
        definition: 'Translation not available',
        confidence: 0,
        source: 'Error',
        sourceType: 'error'
      })
    };
  }
};

async function translateWithMyMemory(word) {
  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=kn|en`,
      { 
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'KannadaReader/1.0'
        },
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      if (data.responseData && 
          data.responseData.translatedText && 
          data.responseData.translatedText !== word &&
          data.responseData.translatedText.toLowerCase() !== 'null') {
        return {
          definition: data.responseData.translatedText,
          confidence: data.responseData.match || 0.7,
          source: 'MyMemory Translation Service',
          sourceType: 'mymemory'
        };
      }
    }
    throw new Error('MyMemory translation failed');
  } catch (error) {
    throw new Error(`MyMemory: ${error.message}`);
  }
}

async function translateWithLibreTranslate(word) {
  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'KannadaReader/1.0'
      },
      body: JSON.stringify({
        q: word,
        source: 'kn',
        target: 'en',
        format: 'text'
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      if (data.translatedText && 
          data.translatedText !== word && 
          data.translatedText.toLowerCase() !== 'null') {
        return {
          definition: data.translatedText,
          confidence: 0.6,
          source: 'LibreTranslate (Open Source)',
          sourceType: 'libretranslate'
        };
      }
    }
    throw new Error('LibreTranslate translation failed');
  } catch (error) {
    throw new Error(`LibreTranslate: ${error.message}`);
  }
}

async function translateWithFallback(word) {
  // Try MyMemory first
  try {
    return await translateWithMyMemory(word);
  } catch (error) {
    console.warn('MyMemory failed:', error);
  }

  // Try LibreTranslate as fallback
  try {
    return await translateWithLibreTranslate(word);
  } catch (error) {
    console.warn('LibreTranslate failed:', error);
  }

  // Return fallback response
  return {
    definition: 'Translation not available',
    confidence: 0,
    source: 'Local fallback',
    sourceType: 'none'
  };
}