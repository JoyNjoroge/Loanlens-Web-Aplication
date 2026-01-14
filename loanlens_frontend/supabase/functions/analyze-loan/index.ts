import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== Function invoked ===');
    const body = await req.json();
    console.log('Request body keys:', Object.keys(body));
    const { documentText, documentType, imageBase64, fileName } = body;

    if (!documentText && !imageBase64) {
      console.log('ERROR: No documentText or imageBase64');
      return new Response(
        JSON.stringify({ error: 'Document text or image is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');
    console.log('GOOGLE_API_KEY exists:', !!GOOGLE_API_KEY);
    console.log('GOOGLE_API_KEY length:', GOOGLE_API_KEY?.length);
    
    if (!GOOGLE_API_KEY) {
      console.error('GOOGLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing loan document, type:', documentType, 'hasImage:', !!imageBase64);

    const systemPrompt = `You are a financial expert specializing in loan document analysis with OCR capabilities. Your task is to:
1. If given an image, first extract all visible text using OCR
2. Analyze the loan document and extract key information
3. Assess fairness and identify potential predatory terms
4. Calculate repayment details

You MUST respond with valid JSON in this exact format:
{
  "loanSummary": {
    "loanAmount": <number>,
    "interestRate": <number as percentage>,
    "termMonths": <number>,
    "lender": "<string>",
    "loanType": "<string: Personal/Auto/Mortgage/Business/Other>",
    "summary": "<plain English summary of the loan terms, 2-3 sentences>"
  },
  "fairnessScore": {
    "score": <number 0-100>,
    "breakdown": [
      { "label": "Interest Rate", "score": <number 0-100> },
      { "label": "Fee Structure", "score": <number 0-100> },
      { "label": "Term Clarity", "score": <number 0-100> },
      { "label": "Penalty Terms", "score": <number 0-100> }
    ]
  },
  "repaymentBreakdown": {
    "monthlyPayment": <number>,
    "totalRepayment": <number>,
    "totalInterest": <number>,
    "numberOfInstallments": <number>,
    "effectiveAPR": <number as percentage>
  },
  "predatoryTerms": [
    {
      "id": "<unique string>",
      "title": "<short title>",
      "description": "<explanation of why this is concerning>",
      "severity": "<high/medium/low>"
    }
  ],
  "extractedText": "<if OCR was performed, include the extracted text here, otherwise null>"
}

Guidelines for scoring:
- Interest rates above 15% for personal loans are concerning, above 25% are predatory
- Hidden fees, unclear penalty terms, and complex language reduce scores
- Look for balloon payments, prepayment penalties, variable rate clauses
- Score 80+ is Fair, 60-79 is Borderline, below 60 is Predatory

If information is missing from the document, make reasonable estimates based on industry standards and note the uncertainty in the summary.`;

    const parts: any[] = [
      { text: systemPrompt }
    ];

    if (imageBase64) {
      console.log('Using vision capabilities for OCR');
      
      let mimeType = 'image/jpeg';
      if (documentType === 'application/pdf') {
        mimeType = 'application/pdf';
      } else if (documentType?.includes('png')) {
        mimeType = 'image/png';
      } else if (documentType?.includes('webp')) {
        mimeType = 'image/webp';
      }

      parts.push({
        text: `Please analyze this loan document image. First, use OCR to extract all visible text from the document, then analyze the loan terms. Document name: ${fileName || 'Unknown'}\n\nProvide your analysis as valid JSON only, no additional text.`
      });

      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: imageBase64
        }
      });
    } else {
      parts.push({
        text: `Analyze this loan document and provide the structured analysis:

Document Type: ${documentType || 'Unknown'}
Document Name: ${fileName || 'Unknown'}

Document Content:
${documentText}

Provide your analysis as valid JSON only, no additional text.`
      });
    }

    const requestBody = {
      contents: [
        {
          parts: parts
        }
      ]
    };

    console.log('Calling Google API...');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GOOGLE_API_KEY}`;
    console.log('URL:', url.substring(0, 80) + '...');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Google API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google API error:', response.status);
      console.error('Error response:', errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 403) {
        return new Response(
          JSON.stringify({ error: 'API key invalid or quota exceeded.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `Failed to analyze document: ${response.status} ${errorText}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    console.log('AI response received');
    const content = aiResponse.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error('No content in AI response');
      console.error('Full AI response:', JSON.stringify(aiResponse));
      return new Response(
        JSON.stringify({ error: 'Invalid AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Parsing JSON response...');

    let analysisData;
    try {
      let jsonStr = content.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.slice(7);
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.slice(3);
      }
      if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.slice(0, -3);
      }
      jsonStr = jsonStr.trim();
      
      analysisData = JSON.parse(jsonStr);
      console.log('JSON parsed successfully');
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('Raw content:', content);
      return new Response(
        JSON.stringify({ error: 'Failed to parse analysis results' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analysis complete, OCR performed:', !!imageBase64);

    return new Response(
      JSON.stringify(analysisData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('=== Caught error ===');
    console.error('Error:', error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'no stack');
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
