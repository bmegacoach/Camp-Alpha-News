Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        // Get environment variables
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Get latest cron job logs
        const logsResponse = await fetch(`${supabaseUrl}/rest/v1/cron_job_logs?job_name=eq.fresh-newsletter-generation&order=executed_at.desc&limit=10`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        if (!logsResponse.ok) {
            throw new Error('Failed to fetch cron job logs');
        }

        const logs = await logsResponse.json();
        
        // Get latest successful run
        const latestSuccess = logs.find(log => log.status === 'success');
        const latestRun = logs[0];
        
        // Calculate next scheduled runs (8 AM and 4 PM daily)
        const now = new Date();
        const today8AM = new Date(now);
        today8AM.setHours(8, 0, 0, 0);
        
        const today4PM = new Date(now);
        today4PM.setHours(16, 0, 0, 0);
        
        const tomorrow8AM = new Date(now);
        tomorrow8AM.setDate(now.getDate() + 1);
        tomorrow8AM.setHours(8, 0, 0, 0);
        
        let nextRun;
        if (now < today8AM) {
            nextRun = today8AM;
        } else if (now < today4PM) {
            nextRun = today4PM;
        } else {
            nextRun = tomorrow8AM;
        }

        // Calculate system statistics
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentLogs = logs.filter(log => new Date(log.executed_at) >= last24Hours);
        const successfulRuns = recentLogs.filter(log => log.status === 'success').length;
        const failedRuns = recentLogs.filter(log => log.status === 'failed').length;
        
        // System health status
        let healthStatus = 'healthy';
        if (failedRuns > successfulRuns) {
            healthStatus = 'degraded';
        } else if (failedRuns > 0 && successfulRuns === 0) {
            healthStatus = 'unhealthy';
        }
        
        // Check if we're overdue for a run
        const lastSuccessTime = latestSuccess ? new Date(latestSuccess.executed_at) : null;
        const isOverdue = lastSuccessTime && (now.getTime() - lastSuccessTime.getTime()) > 13 * 60 * 60 * 1000; // More than 13 hours
        
        if (isOverdue) {
            healthStatus = 'overdue';
        }

        return new Response(JSON.stringify({
            data: {
                latest_success: latestSuccess ? {
                    executed_at: latestSuccess.executed_at,
                    duration_ms: latestSuccess.duration_ms,
                    newsletter_id: latestSuccess.details?.newsletter_id,
                    articles_processed: latestSuccess.details?.articles_processed
                } : null,
                latest_run: latestRun ? {
                    executed_at: latestRun.executed_at,
                    status: latestRun.status,
                    duration_ms: latestRun.duration_ms,
                    error_message: latestRun.error_message
                } : null,
                next_scheduled_run: nextRun.toISOString(),
                system_health: {
                    status: healthStatus,
                    successful_runs_24h: successfulRuns,
                    failed_runs_24h: failedRuns,
                    is_overdue: isOverdue
                },
                automation_schedule: {
                    frequency: 'twice_daily',
                    times: ['08:00', '16:00'],
                    timezone: 'UTC'
                }
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get cron status error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'CRON_STATUS_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});