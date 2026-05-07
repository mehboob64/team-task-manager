export const formatDate = (date) => {
  if (!date) return 'No date';
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));
};

export const isOverdue = (date, status) => {
  return status !== 'completed' && new Date(date) < new Date();
};
