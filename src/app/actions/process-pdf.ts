'use server'

import OpenAI from 'openai'
const PDFParser = require("pdf2json");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Helper to parse PDF buffer
function parsePdfBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1); // 1 = text content
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
    console.log('--- Extracted Text Start ---')
    console.log(extractedText.substring(0, 2000))
    console.log('--- Extracted Text End ---')

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

Handle Multi-spec Docs: 
- The TDS likely contains a table with columns for different basis weights.
- You MUST extract each basis weight as a SEPARATE object in the returned array.
- Common properties (manufacturer, product name) should be repeated for each object.

Missing Data: Return null for missing fields. Do not hallucinate values.

Extra Specs:
- Any technical specification NOT explicitly listed in the schema (e.g., Opacity, Moisture, Stiffness, Roughness) MUST be put into the "extra_specs" object.
- Use snake_case for keys in "extra_specs".

Return ONLY a JSON array of objects with the following schema:
[
  {
    "manufacturer": "string",
    "product_name": "string",
    "basis_weight": number (int, g/m2),
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
          content: `Extract specs from this text:\n\n${extractedText.substring(0, 20000)}` // Increased limit further
        }
      ],
      response_format: { type: "json_object" },
    })

    const content = completion.choices[0].message.content
    if (!content) throw new Error('No content from OpenAI')

    // Clean up markdown code blocks if present (just in case, though json_object usually returns raw json)
    const cleanContent = content.replace(/```json\n|\n```/g, '')

    let parsedData
    try {
      parsedData = JSON.parse(cleanContent)

      // OpenAI "json_object" mode usually returns an object. 
      // If our prompt asked for an array, it might wrap it or we might need to adjust.
      // However, the prompt asks for "Return ONLY a JSON array". 
      // In strict json_object mode, it might enforce an object root. 
      // Let's handle both cases.

      if (Array.isArray(parsedData)) {
        return { success: true, data: parsedData }
      }

      // If it returned { "someKey": [...] } or similar, we might need to hunt for the array.
      // But let's assume for now it might be an object if we forced json_object.
      // Actually, for "json_object", the model IS constrained to return a valid JSON object.
      // So asking for an array at the root might conflict or result in { "result": [...] } if the model is smart.
      // Let's relax the prompt slightly in future if this fails, but for now check for common wrappers.

      if (parsedData.specs && Array.isArray(parsedData.specs)) {
        return { success: true, data: parsedData.specs }
      }

      // If it's just a single object (one spec), wrap it
      if (typeof parsedData === 'object' && parsedData !== null) {
        // Check if it looks like a spec
        if ('basis_weight' in parsedData || 'product_name' in parsedData) {
          return { success: true, data: [parsedData] }
        }
        // Fallback: try to find any array value
        const values = Object.values(parsedData)
        const arrayValue = values.find(v => Array.isArray(v))
        if (arrayValue) {
          return { success: true, data: arrayValue }
        }
      }

      return { success: true, data: parsedData } // Return as is if we can't figure it out, maybe frontend can handle

    } catch (e) {
      console.error('JSON parse error', e)
      return { success: false, error: 'Failed to parse AI response' }
    }

  } catch (error) {
    console.error('Error processing PDF:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
