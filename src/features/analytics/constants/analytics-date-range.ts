export const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getDefaultAnalyticsDateRange = () => {
  const toDate = new Date();
  const fromDate = new Date(toDate);
  fromDate.setDate(toDate.getDate() - 6);

  return {
    dateFrom: formatLocalDate(fromDate),
    dateTo: formatLocalDate(toDate),
  };
};

export const getCurrentWeekDateRange = () => {
  const toDate = new Date();
  const fromDate = new Date(toDate);
  fromDate.setDate(toDate.getDate() - toDate.getDay() + 1);

  return {
    dateFrom: formatLocalDate(fromDate),
    dateTo: formatLocalDate(toDate),
  };
};

export const getCurrentMonthDateRange = () => {
  const toDate = new Date();
  const fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1);

  return {
    dateFrom: formatLocalDate(fromDate),
    dateTo: formatLocalDate(toDate),
  };
};
