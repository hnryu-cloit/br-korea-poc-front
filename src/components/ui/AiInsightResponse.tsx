import React from 'react';

interface AiResponseProps {
  text: string;
  evidence: string[];
  actions: string[];
  confidenceScore?: number;
  semanticLogic?: string;
  sources?: string[];
}

const AiInsightResponse: React.FC<AiResponseProps> = ({ 
  text, 
  evidence, 
  actions, 
  confidenceScore, 
  semanticLogic, 
  sources 
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
      {/* 1. 시맨틱 레이어 알림 (Semantic Logic) */}
      {semanticLogic && (
        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mb-2 inline-block font-medium">
          {semanticLogic}
        </div>
      )}

      {/* 2. 주 분석 텍스트 */}
      <p className="text-gray-800 text-sm mb-4 leading-relaxed">{text}</p>

      {/* 3. 데이터 근거 및 신뢰도 (Confidence & Evidence) */}
      <div className="bg-gray-50 p-3 rounded-md mb-4 border-l-4 border-blue-400">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">주요 분석 근거</span>
          {confidenceScore !== undefined && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              confidenceScore >= 0.8 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            }`}>
              신뢰지수: {Math.round(confidenceScore * 100)}%
            </span>
          )}
        </div>
        <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
          {evidence.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      </div>

      {/* 4. 출처 정보 (RAG Citations) */}
      {sources && sources.length > 0 && (
        <div className="text-[10px] text-gray-400 mb-4 italic">
          근거 문서: {sources.join(', ')}
        </div>
      )}

      {/* 5. 실행 가능 액션 (Actionable UX) */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
        {actions.map((action, idx) => (
          <button 
            key={idx}
            className="text-xs px-3 py-1.5 bg-white border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AiInsightResponse;
