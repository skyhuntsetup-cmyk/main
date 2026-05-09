import { supabase } from './supabase';

export interface UserDocument {
  id: string;
  document_type: 'passport' | 'visa' | 'id_card' | 'other';
  country?: string;
  document_number?: string;
  expiry_date?: string;
  file_url?: string;
  created_at?: string;
}

export async function fetchUserDocuments(): Promise<UserDocument[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('user_documents').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
  return data as UserDocument[];
}

export async function uploadDocument(file: File | null, docType: string, country: string, docNumber: string, expiryDate: string): Promise<UserDocument | null> {
  if (!supabase) return null;
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;
  
  let fileUrl = null;
  if (file) {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userData.user.id}/${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('vault').upload(filePath, file);
    if (!uploadError) {
      const { data } = supabase.storage.from('vault').getPublicUrl(filePath);
      fileUrl = data.publicUrl;
    } else {
      console.error('Upload error:', uploadError);
    }
  }

  const { data, error } = await supabase.from('user_documents').insert({
    user_id: userData.user.id,
    document_type: docType,
    country,
    document_number: docNumber,
    expiry_date: expiryDate || null,
    file_url: fileUrl,
  }).select().single();

  if (error) {
    console.error('Error adding document:', error);
    return null;
  }
  return data as UserDocument;
}

export async function deleteDocument(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('user_documents').delete().eq('id', id);
  return !error;
}
