export const FloatingAiChatButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="fixed bottom-12 right-8 z-40 flex items-center border-3 border-[#FF671F] bg-[#FF671F66] rounded-[48px] px-6 py-4 transition-transform hover:-translate-y-0.5"
  >
    <span className="text-md font-bold text-[#66290C]">무엇이 궁금하신가요?</span>
  </button>
);
