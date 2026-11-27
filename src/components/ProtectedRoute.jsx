import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// ログイン済みユーザーのみが見られるページを囲むコンポーネント
// 未ログインの場合はログイン画面へリダイレクトする
export function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  // セッション確認中は何も判定せず待つ
  if (loading) return <p className="center-message">読み込み中...</p>

  if (!session) return <Navigate to="/login" replace />

  return children
}

// ログイン・会員登録画面用のコンポーネント
// すでにログイン済みの場合は物件一覧へ移動する
export function GuestRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) return <p className="center-message">読み込み中...</p>

  if (session) return <Navigate to="/properties" replace />

  return children
}
