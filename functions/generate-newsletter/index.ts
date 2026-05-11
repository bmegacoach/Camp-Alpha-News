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
        console.log('🔄 Redirecting to demo newsletter generation...');
        
        // Forward to the demo implementation to ensure frontend functionality
        const demoUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-demo-newsletter`;
        
        console.log(`🔄 Forwarding to demo function: ${demoUrl}`);
        
        const demoResponse = await fetch(demoUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
                'apikey': Deno.env.get('SUPABASE_ANON_KEY'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        
        if (!demoResponse.ok) {
            const errorText = await demoResponse.text();
            throw new Error(`Demo function failed: ${errorText}`);
        }
        
        const demoResult = await demoResponse.json();
        console.log('✅ Successfully generated demo newsletter!');
        
        return new Response(JSON.stringify(demoResult), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('❌ Newsletter generation error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'NEWSLETTER_GENERATION_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});