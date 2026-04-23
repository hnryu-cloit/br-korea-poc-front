export const FloatingAiChatButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="fixed bottom-6 right-6 z-40 flex items-center border-[#99115C] bg-[#99115C]/80 rounded-[48px] text-[#F2F4F5] px-6 py-4 transition-transform hover:-translate-y-0.5"
  >
    <span className="text-md font-bold text-[#F2F4F5]">무엇이 궁금하신가요?</span>
  </button>
);
