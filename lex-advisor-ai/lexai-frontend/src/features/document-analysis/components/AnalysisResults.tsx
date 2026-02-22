import React from 'react';
import { Brain, CheckCircle, Sparkles, TrendingUp, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalysisResultsProps {
  analysis: {
    documentType?: string;
    summary?: string;
    keyPoints?: string[];
    legalAreas?: string[];
    jurisdiction?: string;
    confidenceScore?: number;
  };
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="text-green-600" size={24} />
          Analysis Complete
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <CheckCircle size={18} />
            <span className="font-medium">Document Type</span>
          </div>
          <p className="text-slate-700">{analysis.documentType}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <Sparkles size={18} />
            <span className="font-medium">Summary</span>
          </div>
          <p className="text-slate-700 text-sm">{analysis.summary}</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-purple-700 mb-2">
            <TrendingUp size={18} />
            <span className="font-medium">Key Points</span>
          </div>
          <ul className="text-slate-700 text-sm space-y-1">
            {analysis.keyPoints?.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-orange-700 mb-2">
            <BarChart3 size={18} />
            <span className="font-medium">Legal Areas</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.legalAreas?.map((area, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Confidence Score</span>
            <span className="text-lg font-bold text-slate-900">
              {analysis.confidenceScore ? Math.round(analysis.confidenceScore * 100) : 0}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
