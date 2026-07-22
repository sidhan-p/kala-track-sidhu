import React, { useState } from 'react';
import { Avatar } from '../../components/ui/Avatar';
import { Camera, Check } from 'lucide-react';

interface AvatarUploadProps {
  currentUrl?: string;
  name: string;
  onSelectUrl: (url: string) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
];

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentUrl, name, onSelectUrl }) => {
  const [selected, setSelected] = useState(currentUrl || PRESET_AVATARS[0]);

  const handleSelect = (url: string) => {
    setSelected(url);
    onSelectUrl(url);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <Avatar src={selected} name={name} size="xl" />
        <div>
          <h4 className="text-xs font-semibold text-zinc-200">Avatar Selection</h4>
          <p className="text-xs text-zinc-400">Choose a preset avatar image or paste custom image URL.</p>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 pt-2">
        {PRESET_AVATARS.map((url, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelect(url)}
            className={`relative rounded-full overflow-hidden border-2 transition-all p-0.5 ${
              selected === url ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-zinc-800 hover:border-zinc-600'
            }`}
          >
            <img src={url} alt={`Preset ${idx + 1}`} className="w-10 h-10 rounded-full object-cover" />
            {selected === url && (
              <div className="absolute inset-0 bg-indigo-600/40 flex items-center justify-center rounded-full">
                <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
