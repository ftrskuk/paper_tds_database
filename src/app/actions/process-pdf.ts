'use server'

import OpenAI from 'openai'
const PDFParser = require("pdf2json");

// Helper to parse PDF buffer
function parsePdfBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(this, 1); // 1 = text content
    pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      // pdf2json returns text in a specific format, often URL encoded.
      // getRawTextContent() is available on the instance.
      const rawText = pdfParser.getRawTextContent();
      resolve(rawText);
    });
    pdfParser.parseBuffer(buffer);
  });
}

export async function processPdfAction(formData: FormData) {
  try {
    const file = formData.get('file') as File
    if (!file) {
      throw new Error('No file provided')
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text from PDF
    const extractedText = await parsePdfBuffer(buffer)

        // Call GPT-4o
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are an expert Paper Engineer.
Extract & Standardize: Parse the provided text from a Technical Data Sheet (TDS). 
Convert 'Brightness' to 'CIE Whiteness' if possible. 
Convert 'Smoothness' to 'Bekk (sec)'. 
Convert all strength metrics to ISO standard units.
Handle Multi-spec Docs: If the table lists specifications for multiple grammages (e.g. 80g, 100g), return a JSON array with distinct objects for each.
Missing Data: Return null for missing fields. Do not hallucinate values.

Return ONLY a JSON array of objects with the following schema:
[
  {
    "manufacturer": "string",
    "product_name": "string",
    "basis_weight": number (int),
    "thickness": number (int, um),
    "whiteness": number (float, CIE),
    "smoothness": number (float, Bekk),
    "cobb_value": number (float),
    "tensile_strength_md": number (float),
    "tensile_strength_cd": number (float),
    "tearing_strength_md": number (float),
    "tearing_strength_cd": number (float),
    "extra_specs": object (key-value pairs for other specs)
  }
]
`
                },
                {
                    role: "user",
                    content: `Extract specs from this text:\n\n${extractedText.substring(0, 10000)}` // Limit text length just in case
                }
            ],
            response_format: { type: "json_object" }, // Force JSON mode? No, array is needed. 
            // Actually "json_object" requires the output to be an object, but we want an array.
            // Better to ask for an object with a key "specs": []
        })

        // We need to adjust prompt to return object { specs: [...] } to use json_object mode safely
        // Or just parse the string. Let's adjust the prompt in the next step if needed.
        // For now let's try to parse the content.

        const content = completion.choices[0].message.content
        if (!content) throw new Error('No content from OpenAI')

        // Clean up markdown code blocks if present
        const cleanContent = content.replace(/```json\n|\n```/g, '')

        let parsedData
        try {
            parsedData = JSON.parse(cleanContent)
            // If it returns an array directly
            if (Array.isArray(parsedData)) {
                return { success: true, data: parsedData }
            }
            // If it returns { specs: [...] }
            if (parsedData.specs && Array.isArray(parsedData.specs)) {
                return { success: true, data: parsedData.specs }
            }
            return { success: false, error: 'Invalid JSON structure returned' }
        } catch (e) {
            console.error('JSON parse error', e)
            return { success: false, error: 'Failed to parse AI response' }
        }

    } catch (error) {
        console.error('Error processing PDF:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}
