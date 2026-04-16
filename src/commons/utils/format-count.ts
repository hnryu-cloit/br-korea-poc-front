const countFormatter = new Intl.NumberFormat("ko-KR");

export const formatCount = (value: number): string => countFormatter.format(value);

export const formatCountWithUnit = (value: number, unit: string): string => `${formatCount(value)}${unit}`;
