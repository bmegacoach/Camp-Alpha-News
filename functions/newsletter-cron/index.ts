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
        const startTime = Date.now();
        const triggerTime = new Date().toISOString();
        
        console.log('🔄 Starting automated CoachAI newsletter generation via cron...');
        
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Required environment variables missing');
        }

        // Log cron job start
        const startLogId = crypto.randomUUID();
        await fetch(`${supabaseUrl}/rest/v1/cron_job_logs`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: startLogId,
                job_name: 'coachai-newsletter-generation',
                status: 'started',
                executed_at: new Date().toISOString(),
                details: {
                    trigger_time: triggerTime,
                    trigger_type: 'cron',
                    generation_strategy: 'completely_fresh_searches'
                }
            })
        });

        // Call the enhanced fresh newsletter generation function
        const generateResponse = await fetch(`${supabaseUrl}/functions/v1/generate-newsletter`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        const duration = Date.now() - startTime;
        
        if (!generateResponse.ok) {
            const errorText = await generateResponse.text();
            
            // Log failure
            await fetch(`${supabaseUrl}/rest/v1/cron_job_logs`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: crypto.randomUUID(),
                    job_name: 'coachai-newsletter-generation',
                    status: 'failed',
                    executed_at: new Date().toISOString(),
                    duration_ms: duration,
                    error_message: errorText,
                    details: {
                        trigger_time: triggerTime,
                        trigger_type: 'cron',
                        completion_time: new Date().toISOString(),
                        generation_strategy: 'completely_fresh_searches'
                    }
                })
            });
            
            throw new Error(`CoachAI newsletter generation failed: ${errorText}`);
        }

        const result = await generateResponse.json();
        
        // Log successful completion with fresh search metrics
        await fetch(`${supabaseUrl}/rest/v1/cron_job_logs`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: crypto.randomUUID(),
                job_name: 'coachai-newsletter-generation',
                status: 'success',
                executed_at: new Date().toISOString(),
                duration_ms: duration,
                details: {
                    trigger_time: triggerTime,
                    trigger_type: 'cron',
                    completion_time: new Date().toISOString(),
                    newsletter_id: result.data?.newsletter_id,
                    fresh_articles_processed: result.data?.fresh_articles_processed || 0,
                    unique_searches_performed: result.data?.unique_searches_performed || 0,
                    content_tracked: result.data?.content_tracked || 0,
                    generation_strategy: 'completely_fresh_searches',
                    freshness_guarantee: '100_percent_new_content'
                }
            })
        });
        
        console.log('✅ Automated CoachAI newsletter generation completed successfully');

        return new Response(JSON.stringify({
            success: true,
            message: 'CoachAI newsletter generated successfully via cron',
            newsletter_id: result.data?.newsletter_id,
            duration_ms: duration,
            timestamp: new Date().toISOString(),
            fresh_search_metrics: {
                articles_processed: result.data?.fresh_articles_processed,
                searches_performed: result.data?.unique_searches_performed,
                content_tracked: result.data?.content_tracked
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('❌ Cron newsletter generation error:', error);
        
        return new Response(JSON.stringify({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});