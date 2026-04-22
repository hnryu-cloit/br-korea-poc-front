import { LowStockProductCard } from "@/features/dashboard/components/LowStockProductCard";
import { OrderDeadlineCard } from "@/features/dashboard/components/OrderDeadlineCard";

export interface Product {
  name: string;
  count: string;
}

const products: Product[] = [
  { name: "글레이ㄹㅇㄴㅇㄹㄴ즈도넛", count: "11" },
  { name: "헤이ㅇㄴㄹ즐넛", count: "12" },
  { name: "초코파우더ㄴㅇㄹ", count: "4" },
  { name: "요즘유행버터ㄴㅇㄹㅇㄴ떡", count: "5" },
  { name: "두쫀ㄴㄹㅇ쿠두쫀쿠", count: "6" },
  { name: "집에ㄴㄹㅇㅇㄴ가고싶다", count: "7" },
  { name: "야근ㄴㅇㄹㅇㄴㄹ그만해", count: "1" },
  { name: "삶이피폐ㄴㅇㄹㅇㄴㄹㅇ해", count: "2" },
  { name: "아오언제끝나", count: "2" },
  { name: "글레이즈도넛1", count: "11" },
  { name: "헤이즐넛1", count: "12" },
  { name: "초코파우1더", count: "4" },
  { name: "요즘유행1버터떡", count: "5" },
  { name: "두쫀쿠두1쫀쿠", count: "6" },
  { name: "집에가고1싶다", count: "7" },
  { name: "야근그만1해", count: "1" },
  { name: "삶이피폐1해", count: "2" },
  { name: "아오언제1끝나", count: "2" },
];

export const DashboardAlertSummary = () => {
  return (
    <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-[16px]">
      <LowStockProductCard products={products} />
      <OrderDeadlineCard />
    </div>
  );
};
