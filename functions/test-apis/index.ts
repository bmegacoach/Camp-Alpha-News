Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        console.log('🧪 Testing Serper API with exact credentials...');
        
        const serperApiKey = Deno.env.get('SERPER_API_KEY');
        
        if (!serperApiKey) {
            throw new Error('SERPER_API_KEY not found in environment');
        }
        
        console.log('✅ Found API key:', serperApiKey.substring(0, 10) + '...');
        
        // Test with basic search
        console.log('🔍 Making Serper API request...');
        const searchResponse = await fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: {
                'X-API-KEY': serperApiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: 'artificial intelligence news',
                num: 3
            })
        });
        
        console.log('📊 Response status:', searchResponse.status);
        console.log('📊 Response headers:', Object.fromEntries(searchResponse.headers.entries()));
        
        const responseText = await searchResponse.text();
        console.log('📊 Raw response:', responseText);
        
        let searchData;
        try {
            searchData = JSON.parse(responseText);
        } catch (e) {
            console.log('❌ Failed to parse JSON:', e.message);
            searchData = { error: 'Invalid JSON response', raw: responseText };
        }
        
        const success = searchResponse.ok;
        
        return new Response(JSON.stringify({
            success: success,
            status_code: searchResponse.status,
            api_key_preview: serperApiKey.substring(0, 10) + '...',
            response_data: searchData,
            articles_found: success ? (searchData.organic?.length || 0) : 0
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('❌ Serper test error:', error);
        
        return new Response(JSON.stringify({
            success: false,
            error: error.message,
            stack: error.stack
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});