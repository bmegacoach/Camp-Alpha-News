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
        console.log('🚀 Starting demo newsletter generation...');
        
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
        
        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }
        
        const currentDate = new Date();
        const todayDate = currentDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Demo newsletter content with current date
        const demoContent = {
            title: `CoachAI Daily Newsletter - ${todayDate} - AI Insights for Business Building`,
            sections: {
                top_stories: [
                    {
                        title: "OpenAI Announces GPT-4 Enterprise Features for Business Applications",
                        summary: "Fresh from OpenAI's latest announcement, the new enterprise features promise enhanced business integration capabilities. This development offers entrepreneurs immediate opportunities to integrate advanced AI into their business operations with improved security and scalability.",
                        link: "https://openai.com/enterprise",
                        source: "OpenAI"
                    },
                    {
                        title: "Meta AI Releases Open Source Language Model for Commercial Use",
                        summary: "Breaking this week, Meta has released a powerful open-source language model specifically designed for commercial applications. Business builders can now leverage this technology without licensing fees, opening new possibilities for AI-powered startups and products.",
                        link: "https://ai.meta.com/blog/",
                        source: "Meta AI"
                    },
                    {
                        title: "Google Cloud Launches AI-Powered Business Intelligence Platform",
                        summary: "Just announced, Google's new BI platform combines machine learning with business analytics to provide real-time insights. Entrepreneurs can now access enterprise-level AI analytics tools to make data-driven decisions and accelerate business growth.",
                        link: "https://cloud.google.com/ai",
                        source: "Google Cloud"
                    }
                ],
                ai_tools: [
                    {
                        title: "Claude for Business: New API Pricing Model Released",
                        summary: "Recently launched, Anthropic's new business pricing model makes Claude more accessible for startups and growing companies. The updated API structure offers cost-effective solutions for businesses looking to integrate conversational AI into their products.",
                        link: "https://anthropic.com/claude",
                        source: "Anthropic"
                    },
                    {
                        title: "Midjourney Introduces Business License for Commercial Image Generation",
                        summary: "Fresh commercial licensing options from Midjourney now allow businesses to use AI-generated images for marketing and product development. This opens new creative possibilities for entrepreneurs in design-heavy industries.",
                        link: "https://midjourney.com/business",
                        source: "Midjourney"
                    }
                ],
                research: [
                    {
                        title: "MIT Study Reveals AI Impact on Small Business Productivity",
                        summary: "Cutting-edge research from MIT demonstrates how AI implementation can increase small business productivity by up to 40%. The study provides actionable insights for entrepreneurs looking to leverage AI for competitive advantage in 2025.",
                        link: "https://mit.edu/ai-research",
                        source: "MIT Research"
                    },
                    {
                        title: "Stanford AI Lab Publishes Framework for Responsible AI in Business",
                        summary: "Newly published research provides businesses with a practical framework for implementing AI ethically and effectively. This timely guidance helps entrepreneurs navigate AI adoption while maintaining customer trust and regulatory compliance.",
                        link: "https://stanford.edu/ai-ethics",
                        source: "Stanford AI Lab"
                    }
                ],
                insights: [
                    {
                        title: "AI Startup Funding Reaches Record High in Q3 2025",
                        summary: "Latest market data shows AI startups secured unprecedented funding this quarter, indicating massive investor confidence in AI business applications. This trend suggests numerous opportunities for AI-focused entrepreneurs in the coming months.",
                        link: "https://crunchbase.com/ai-funding-2025",
                        source: "Crunchbase"
                    },
                    {
                        title: "Fortune 500 Companies Double AI Investment in Business Operations",
                        summary: "Recent survey reveals major corporations are significantly increasing AI budgets for 2025, creating opportunities for B2B AI solution providers. Smart entrepreneurs can capitalize on this growing demand for AI-powered business tools and services.",
                        link: "https://fortune.com/ai-investment-trends",
                        source: "Fortune"
                    }
                ]
            }
        };
        
        console.log('📝 Saving demo newsletter to database...');
        
        const newsletterId = crypto.randomUUID();
        const today = currentDate.toISOString().split('T')[0];
        
        const newsletterResponse = await fetch(`${supabaseUrl}/rest/v1/newsletters`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                id: newsletterId,
                title: demoContent.title,
                content: demoContent,
                newsletter_date: today,
                published: true,
                generated_at: new Date().toISOString()
            })
        });

        if (!newsletterResponse.ok) {
            const errorText = await newsletterResponse.text();
            throw new Error(`Failed to save newsletter: ${errorText}`);
        }

        const savedNewsletter = await newsletterResponse.json();
        
        console.log('✅ Demo newsletter saved successfully!');
        
        // Track demo content
        const demoSources = [];
        Object.values(demoContent.sections).flat().forEach(article => {
            if (article.link) {
                demoSources.push({
                    source_url: article.link,
                    title: article.title,
                    snippet: article.summary,
                    newsletter_id: newsletterId,
                    processed_at: new Date().toISOString()
                });
            }
        });
        
        if (demoSources.length > 0) {
            await fetch(`${supabaseUrl}/rest/v1/content_history`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(demoSources)
            });
        }

        return new Response(JSON.stringify({
            data: {
                newsletter_id: newsletterId,
                title: demoContent.title,
                articles_processed: demoSources.length,
                content: demoContent,
                generation_strategy: 'demo_content',
                message: 'Demo newsletter generated successfully! Ready for Serper API integration.'
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('❌ Demo newsletter generation error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'DEMO_NEWSLETTER_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});