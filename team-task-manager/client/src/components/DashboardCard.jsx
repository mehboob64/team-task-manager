const DashboardCard = ({ label, value, tone = 'blue' }) => {
  const tones = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-rose-50 text-rose-700'
  };

  return (
    <div className="panel p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-3 inline-flex rounded-md px-3 py-1 text-3xl font-bold ${tones[tone]}`}>
        {value}
      </p>
    </div>
  );
};

export default DashboardCard;
