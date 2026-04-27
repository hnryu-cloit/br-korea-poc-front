import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownAnswerProps = {
  text: string;
};

export const MarkdownAnswer = ({ text }: MarkdownAnswerProps) => {
  return (
    <div className="text-[16px] leading-8 text-[#41352E]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          h3: ({ children }) => (
            <h3 className="mt-6 mb-3 text-[17px] font-bold text-[#41352E]">{children}</h3>
          ),
          p: ({ children }) => <p className="mb-4 text-[#41352E]">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-bold text-[#BF430A]">{children}</strong>
          ),
          ul: ({ children }) => <ul className="mb-4 list-disc space-y-2 pl-5">{children}</ul>,
          li: ({ children }) => <li className="text-[#41352E]">{children}</li>,
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-xl border border-[#F2E4DC] bg-white">
              <table className="w-full min-w-[560px] border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#FFF4EC] text-[#983307]">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border-b border-[#F2E4DC] px-4 py-3 text-left font-bold whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-[#F2E4DC] px-4 py-3 text-[#41352E] whitespace-nowrap">
              {children}
            </td>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};
