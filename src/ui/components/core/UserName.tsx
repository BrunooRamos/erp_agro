interface Props {       
  name: string;
  isCollapsed?: boolean;
}

export const UserName = ({ name, isCollapsed = false }: Props) => {
  return (
    <div className="p-4 border-t border-zinc-200 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center text-sm">
          {name.charAt(0)}
        </div>
        {!isCollapsed && <span className="text-zinc-700">{name}</span>}
      </div>
  );
};