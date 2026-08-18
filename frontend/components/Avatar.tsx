const avatars: Record<string, string> = {
  Admin: 'A',
  'Ankit Dutta': 'A',
  CN: 'CN',
  Designer: 'D',
  Security: 'S',
  Product: 'P',
  'Dev Team': 'DT',
  Design: 'D'
};

export function Avatar({ name = 'Admin', size = 28 }: { name?: string; size?: number }) {
  const text = avatars[name] || name.slice(0, 2).toUpperCase();
  return (
    <div
      title={name}
      className="flex shrink-0 items-center justify-center rounded-full border border-white bg-gradient-to-br from-fuchsia-500 via-violet-500 to-orange-400 text-[9px] font-bold text-white shadow-sm"
      style={{ width: size, height: size }}
    >
      {text}
    </div>
  );
}
