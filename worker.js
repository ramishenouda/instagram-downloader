/**
 * Cloudflare Worker - Instagram Downloader CORS Proxy
 * 
 * Deploy this to Cloudflare Workers to bypass CORS issues.
 * 
 * Steps:
 * 1. Go to https://dash.cloudflare.com/sign-up/workers-and-pages
 * 2. Create an account (free)
 * 3. Create a new Worker
 * 4. Copy this entire file into the Worker editor
 * 5. Click "Deploy"
 * 6. Copy the Worker URL (e.g., https://instagram-proxy.your-subdomain.workers.dev)
 * 7. Update VITE_WORKER_URL in .env.local with your Worker URL
 */

export default {
  async fetch(request) {
    // Only allow POST requests
    if (request.method !== 'POST' && request.method !== 'OPTIONS') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, PUT, POST, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    try {
      const body = await request.json();
      const { url } = body;

      if (!url) {
        return new Response(JSON.stringify({ error: 'URL parameter required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      // Forward request to Cobalt API v8+
      const cobaltResponse = await fetch('https://api.cobalt.tools/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const cobaltData = await cobaltResponse.json();

      // Return response with CORS headers
      return new Response(JSON.stringify(cobaltData), {
        status: cobaltResponse.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  },
};
