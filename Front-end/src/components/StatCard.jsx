import Icon from './Icon';

export default function StatCard({ label, value, sub, accent = false, icon }) {
  return (
    <div className={`rounded-xl p-[20px_22px] flex flex-col gap-2 ${accent ? 'bg-accent border-0' : 'bg-surface border border-border'}`}>
      <div className="flex justify-between items-start">
        <span className={`text-[12px] font-medium tracking-wide ${accent ? 'text-white/70' : 'text-muted'}`}>{label}</span>
        <span className={accent ? 'opacity-80' : 'opacity-40'}>
          <Icon name={icon} size={15} color={accent ? '#fff' : '#1a1a1a'} />
        </span>
      </div>
      <div className={`text-[32px] font-bold font-mono leading-none ${accent ? 'text-white' : 'text-primary'}`}>{value}</div>
      {sub && <div className={`text-[12px] ${accent ? 'text-white/60' : 'text-muted'}`}>{sub}</div>}
    </div>
  );
}