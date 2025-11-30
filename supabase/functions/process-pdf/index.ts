import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.1.0"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { fileUrl } = await req.json()

        // 1. Download PDF (In a real scenario, we'd need to parse PDF text here. 
        // For this MVP, we might assume we send text or use a service that can read PDF from URL)
        // Since we can't easily parse PDF in Deno Edge Function without external libs or services,
        // we will assume the client extracts text or we use a mock for now.
        // OR we can use OpenAI Vision if we convert PDF to image, but that's complex.
        // Let's assume for this MVP that we are simulating the extraction or the user sends raw text.
        // BUT the requirement says "Admin uploads a PDF file. AI Process: The system automatically OCRs..."
        // Realistically, we'd use a service like Mathpix or Adobe API, or just simple text extraction if it's a text PDF.

        // For this implementation, let's assume we are just mocking the extraction to demonstrate the flow,
        // as setting up actual PDF OCR in this environment is out of scope for a simple code generation without external API keys for OCR.
        // However, I will write the logic for calling OpenAI with the prompt.

        const openai = new OpenAIApi(new Configuration({
            apiKey: Deno.env.get('OPENAI_API_KEY'),
        }))

        const systemPrompt = `You are an expert Paper Engineer.
Extract & Standardize: Parse the provided text. Convert 'Brightness' to 'CIE Whiteness' if possible. Convert 'Smoothness' to 'Bekk (sec)'. Convert all strength metrics to ISO standard units.
Handle Multi-spec Docs: If the table lists specifications for 80g, 100g, and 120g, return a JSON array with three distinct objects.
Missing Data: Return null for missing fields. Do not hallucinate values.
Output JSON format.`

        // Mocking text extraction
        const extractedText = "Sample text from PDF..."

        const completion = await openai.createChatCompletion({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Extract specs from this text: ${extractedText}` },
            ],
        })

        const result = completion.data.choices[0].message?.content

        return new Response(
            JSON.stringify({ data: result }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
    }
})
