import { supabase } from './supabase'

// properties テーブルへの CRUD 操作をまとめたモジュール
// どの操作も RLS により「ログイン中のユーザー自身の物件」だけが対象になる

// 取得・返却する列
const COLUMNS = 'id, name, rent, area, layout, created_at'

// 一覧取得（SELECT）：新しく登録した順に並べる
export async function fetchProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select(COLUMNS)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// 新規登録（INSERT）
// user_id はテーブルの既定値（auth.uid()）で自動的にログイン中のユーザーになる
export async function createProperty(property) {
  const { data, error } = await supabase
    .from('properties')
    .insert(property)
    .select(COLUMNS)
    .single()

  if (error) throw error
  return data
}

// 編集（UPDATE）
export async function updateProperty(id, property) {
  const { data, error } = await supabase
    .from('properties')
    .update(property)
    .eq('id', id)
    .select(COLUMNS)
    .single()

  if (error) throw error
  return data
}

// 削除（DELETE）
export async function deleteProperty(id) {
  const { error } = await supabase.from('properties').delete().eq('id', id)

  if (error) throw error
}
