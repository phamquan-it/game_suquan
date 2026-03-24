// app/admin/currencies/utils/formatters.ts
export const formatCurrency = (value: number | null): string => {
  if (value === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(value);
};

export const formatPercentage = (value: number | null): string => {
  if (value === null) return 'N/A';
  return `${value}%`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getCategoryLabel = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};
