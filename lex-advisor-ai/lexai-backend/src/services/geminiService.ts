import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import pdf from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Safety settings for legal document analysis
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Get Gemini models
const getEmbeddingModel = () => {
  return genAI.getGenerativeModel({ 
    model: 'text-embedding-004',
    safetySettings 
  });
};

const getChatModel = () => {
  return genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp',
    safetySettings,
    generationConfig: {
      temperature: 0.1,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8192,
    }
  });
};

/**
 * Extract text from PDF buffer
 */
export const extractTextFromPDF = async (fileBuffer: Buffer): Promise<string> => {
  try {
    const data = await pdf(fileBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Generate embeddings for text using Gemini
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    const model = getEmbeddingModel();
    const result = await model.embedContent(text);
    const embedding = result.embedding;
    return Array.from(embedding.values);
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
};

/**
 * Analyze document content with Gemini AI
 * Extracts key legal information, summaries, and insights
 */
export const analyzeDocument = async (text: string, fileName: string) => {
  try {
    const model = getChatModel();
    
    const analysisPrompt = `
You are a legal document analysis expert. Analyze the following legal document and provide a comprehensive analysis.

Document Name: ${fileName}

Document Content:
${text.substring(0, 15000)} ${text.length > 15000 ? '... (document truncated for analysis)' : ''}

Please provide a JSON response with the following structure:
{
  "documentType": "Type of legal document (e.g., Contract, Statute, Regulation, Case Law, Legal Opinion)",
  "summary": "A concise summary of the document (2-3 sentences)",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5"],
  "legalAreas": ["Area of law 1", "Area of law 2"],
  "jurisdiction": "Jurisdiction mentioned or applicable",
  "parties": ["Party 1", "Party 2"] if applicable,
  "effectiveDate": "Date mentioned or null",
  "importantClauses": [
    {
      "type": "Clause type",
      "description": "Brief description",
      "reference": "Section or paragraph reference if available"
    }
  ],
  "risks": ["Potential risk 1", "Potential risk 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "confidenceScore": 0.95
}

Provide only the JSON response, no additional text.
`;

    const result = await model.generateContent(analysisPrompt);
    const responseText = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse analysis response');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    return analysis;
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw new Error('Failed to analyze document');
  }
};

/**
 * Generate a detailed summary of legal document
 */
export const generateDocumentSummary = async (text: string, maxLength: number = 500) => {
  try {
    const model = getChatModel();
    
    const summaryPrompt = `
Summarize the following legal document in ${maxLength} words or less. Focus on the most important legal aspects, obligations, and rights.

Document:
${text.substring(0, 10000)}

Provide a clear, professional summary.
`;

    const result = await model.generateContent(summaryPrompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary');
  }
};

/**
 * Extract entities from legal document (dates, amounts, parties, etc.)
 */
export const extractLegalEntities = async (text: string) => {
  try {
    const model = getChatModel();
    
    const entityPrompt = `
Extract the following entities from this legal document and return as JSON:
{
  "dates": ["date1", "date2"],
  "amounts": ["$amount1", "$amount2"],
  "parties": ["Party 1", "Party 2"],
  "locations": ["Location 1", "Location 2"],
  "caseNumbers": ["Case 1", "Case 2"],
  "statutes": ["Statute 1", "Statute 2"],
  "citations": ["Citation 1", "Citation 2"]
}

Document:
${text.substring(0, 8000)}

Provide only the JSON response.
`;

    const result = await model.generateContent(entityPrompt);
    const responseText = result.response.text();
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { dates: [], amounts: [], parties: [], locations: [], caseNumbers: [], statutes: [], citations: [] };
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error extracting entities:', error);
    return { dates: [], amounts: [], parties: [], locations: [], caseNumbers: [], statutes: [], citations: [] };
  }
};

/**
 * Answer questions about a document
 */
export const answerDocumentQuestion = async (documentText: string, question: string) => {
  try {
    const model = getChatModel();
    
    const qaPrompt = `
You are a legal expert. Answer the following question based ONLY on the provided document. If the answer is not in the document, say "The information is not available in this document."

Document:
${documentText.substring(0, 12000)}

Question: ${question}

Provide a clear, accurate answer with references to specific sections if applicable.
`;

    const result = await model.generateContent(qaPrompt);
    return {
      answer: result.response.text().trim(),
      confidence: 0.85
    };
  } catch (error) {
    console.error('Error answering question:', error);
    throw new Error('Failed to answer question');
  }
};

/**
 * Compare two documents and highlight differences
 */
export const compareDocuments = async (doc1Text: string, doc2Text: string, doc1Name: string, doc2Name: string) => {
  try {
    const model = getChatModel();
    
    const comparisonPrompt = `
Compare the following two legal documents and provide a detailed comparison.

Document 1 (${doc1Name}):
${doc1Text.substring(0, 8000)}

Document 2 (${doc2Name}):
${doc2Text.substring(0, 8000)}

Provide a JSON response with the following structure:
{
  "overallSimilarity": 0.75,
  "similarities": ["Similarity 1", "Similarity 2", "Similarity 3"],
  "differences": [
    {
      "aspect": "Aspect name",
      "doc1": "Value in document 1",
      "doc2": "Value in document 2",
      "significance": "high" or "medium" or "low"
    }
  ],
  "recommendation": "Brief recommendation based on comparison"
}

Provide only the JSON response.
`;

    const result = await model.generateContent(comparisonPrompt);
    const responseText = result.response.text();
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse comparison response');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error comparing documents:', error);
    throw new Error('Failed to compare documents');
  }
};

/**
 * Generate AI response for chat with document context
 */
export const generateAIResponse = async (conversation: any[], contextDocuments: string[] = []) => {
  try {
    const model = getChatModel();
    
    let contextText = '';
    if (contextDocuments.length > 0) {
      contextText = `\n\nRelevant Legal Context:\n${contextDocuments.join('\n\n---\n\n')}`;
    }
    
    const conversationHistory = conversation.map(msg => {
      const role = msg.role === 'system' ? 'System' : (msg.role === 'user' ? 'User' : 'Assistant');
      return `${role}: ${msg.content}`;
    }).join('\n\n');

    const fullPrompt = `${conversationHistory}${contextText}\n\nAssistant:`;

    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response');
  }
};

/**
 * Batch process documents for analysis
 */
export const batchAnalyzeDocuments = async (documents: Array<{ text: string; fileName: string }>) => {
  const results = [];
  
  for (const doc of documents) {
    try {
      const analysis = await analyzeDocument(doc.text, doc.fileName);
      const summary = await generateDocumentSummary(doc.text);
      const entities = await extractLegalEntities(doc.text);
      
      results.push({
        fileName: doc.fileName,
        analysis,
        summary,
        entities,
        status: 'success'
      });
    } catch (error) {
      results.push({
        fileName: doc.fileName,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return results;
};
