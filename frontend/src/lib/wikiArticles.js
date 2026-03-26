import { isSupabaseConfigured, supabase } from './supabaseClient'

const ACCEPTED_STATUSES = ['ap', 'approved']

export async function fetchWikiArticles() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase chua duoc cau hinh.')
  }

  const { data, error } =  await supabase
    .from('articles')
    // 1. SELECT phải đứng ngay sau FROM
    .select('id, created_at, title, content, external_link, cover_image_url, category, status')
    // 2. Sau đó mới đến các hàm Lọc (Filters)
    .ilike('category', 'wiki') 
    .in('status', ACCEPTED_STATUSES)
    // 3. Cuối cùng là hàm Sắp xếp (Modifiers)
    .order('created_at', { ascending: false });
    

  if (error) {
    throw new Error(error.message)
  }

  return (data || []).map((article) => ({
    id: article.id,
    title: article.title || 'Khong co tieu de',
    content: article.content || '',
    externalLink: article.external_link || '',
    coverImageUrl: article.cover_image_url || '',
    createdAt: article.created_at || '',
    category: article.category || '',
    status: article.status || '',
  }))
}
