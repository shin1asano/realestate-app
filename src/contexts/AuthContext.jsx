import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// ログイン状態をアプリ全体で共有するためのコンテキスト
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  // 初回のセッション確認が終わるまでは true
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 起動時に保存済みのセッションを取得する
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // ログイン・ログアウトなど認証状態の変化を監視する
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    // アンマウント時に監視を解除する
    return () => listener.subscription.unsubscribe()
  }, [])

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    // 会員登録
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    // ログイン
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    // ログアウト
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 各コンポーネントから認証情報を取り出すためのフック
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth は AuthProvider の内側で使用してください')
  }
  return context
}
