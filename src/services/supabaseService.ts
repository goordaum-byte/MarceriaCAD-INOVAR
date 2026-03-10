import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Project {
  id: string;
  name: string;
  data: any;
  user_id: string;
  created_at: string;
}

export const saveProject = async (name: string, data: any) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase not configured. Project saved locally.');
    localStorage.setItem(`project_${name}`, JSON.stringify(data));
    return { success: true, local: true };
  }

  const { data: result, error } = await supabase
    .from('projects')
    .upsert({ name, data, updated_at: new Date().toISOString() })
    .select();

  if (error) throw error;
  return result;
};

export const loadProjects = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return [];
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
