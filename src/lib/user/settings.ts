import { supabase } from '$lib/shared/supabase';
import { sudokuSettings } from '$lib/sudoku/stores';
import type { SettingsKey } from '$lib/types/settings';
import type { Difficulty } from '$lib/types/sudoku';
import { setMode } from 'mode-watcher';

export const upsertSettings = async (
  settings: SettingsKey,
  value: string | number | boolean
): Promise<void> => {
  await supabase.from('settings').upsert({
    key: settings,
    value: value.toString()
  });
};

export const getAllSettings = async (): Promise<{
  [key: string]: string;
}> => {
  const { data, error } = await supabase.from('settings').select('key, value');
  if (error) {
    console.error('Error fetching settings:', error);
    return {};
  }

  return data.reduce(
    (acc, { key, value }) => {
      acc[key] = value;
      return acc;
    },
    {} as { [key: string]: string }
  );
};

export const getSetting = async (key: SettingsKey): Promise<string | null> => {
  const { data, error } = await supabase.from('settings').select('value').eq('key', key);
  if (error) {
    console.error('Error fetching setting:', error);
    return null;
  }
  return data[0]?.value;
};

export const loadAllSettings = async (): Promise<void> => {
  const settings = await getAllSettings();
  for (const key in settings) {
    switch (key) {
      case 'theme':
        setMode(settings[key] as 'light' | 'dark' | 'system');
        break;
      case key.match(/^sudoku\./)?.input:
        sudokuSettings.update((s) => {
          const newSettings = { ...s };
          const setting = key.split('.')[1];
          switch (setting) {
            case 'autoCandidates':
            case 'showCorrect':
            case 'autoDeselect':
            case 'autoDeleteCandidates':
              newSettings[setting] = settings[key] === 'true';
              break;
            case 'difficulty':
              newSettings[setting] = settings[key] as Difficulty;
              break;
          }
          return newSettings;
        });
        break;
    }
  }
};
