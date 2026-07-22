import React, { useState } from 'react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Upload, Camera, Check, AlertCircle } from 'lucide-react';

interface AvatarUploadProps {
  currentUrl?: string;
  name: string;
  onSelectUrl: (url: string) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentUrl, name, onSelectUrl }) => {
  const [selected, setSelected] = useState(currentUrl || '');
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSupabaseConfigured) {
      setErrorMsg('Supabase is not configured for storage uploads.');
      return;
    }

    setUploading(true);
    setErrorMsg('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 10)}_${Date.now()}.${fileExt}`;
      const filePath = `user_avatars/${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadErr) {
        setErrorMsg(`Upload failed: ${uploadErr.message}`);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      if (data?.publicUrl) {
        setSelected(data.publicUrl);
        onSelectUrl(data.publicUrl);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <Avatar src={selected} name={name} size="xl" />
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-zinc-200">Profile Picture</h4>
          <p className="text-xs text-zinc-400">Upload a custom image to Supabase Storage bucket (`avatars`).</p>
          <div className="pt-1">
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 cursor-pointer transition-colors border border-zinc-700">
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
