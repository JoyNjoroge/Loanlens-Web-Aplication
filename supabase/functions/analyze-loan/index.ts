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
    const { documentText, documentType, imageBase64, fileName } = await req.json();

    if (!documentText && !imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Document text or image is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
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

    // Build the messages array based on whether we have an image or text
    const messages: any[] = [
      { role: 'system', content: systemPrompt }
    ];

    if (imageBase64) {
      // Use vision capabilities for image-based documents
      console.log('Using vision capabilities for OCR');
      
      // Determine the media type
      let mediaType = 'image/jpeg';
      if (documentType === 'application/pdf') {
        mediaType = 'application/pdf';
      } else if (documentType?.includes('png')) {
        mediaType = 'image/png';
      } else if (documentType?.includes('webp')) {
        mediaType = 'image/webp';
      }

      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Please analyze this loan document image. First, use OCR to extract all visible text from the document, then analyze the loan terms. Document name: ${fileName || 'Unknown'}\n\nProvide your analysis as valid JSON only, no additional text.`
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mediaType};base64,${imageBase64}`
            }
          }
        ]
      });
    } else {
      // Text-based document
      messages.push({
        role: 'user',
        content: `Analyze this loan document and provide the structured analysis:

Document Type: ${documentType || 'Unknown'}
Document Name: ${fileName || 'Unknown'}

Document Content:
${documentText}

Provide your analysis as valid JSON only, no additional text.`
      });
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI usage limit reached. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to analyze document' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in AI response');
      return new Response(
        JSON.stringify({ error: 'Invalid AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AI response received, parsing...');

    // Parse the JSON from the response
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
    console.error('Error in analyze-loan function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
