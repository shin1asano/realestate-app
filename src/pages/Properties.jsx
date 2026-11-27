import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PropertyForm from '../components/PropertyForm'
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  updateProperty,
} from '../lib/propertiesApi'

// 家賃を「¥128,000」の形式に整える
const formatRent = (rent) =>
  new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(rent)

// 物件一覧画面（ログイン後に表示）
export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // 編集中の物件ID（編集していないときは null）
  const [editingId, setEditingId] = useState(null)

  // 画面表示時に Supabase から物件一覧を取得する
  useEffect(() => {
    fetchProperties()
      .then(setProperties)
      .catch((err) => setError(`物件の取得に失敗しました：${err.message}`))
      .finally(() => setLoading(false))
  }, [])

  // 新規登録：登録した物件を一覧の先頭に追加する
  const handleCreate = async (values) => {
    const created = await createProperty(values)
    setProperties((prev) => [created, ...prev])
  }

  // 編集：更新後のデータで一覧を置き換え、編集モードを終了する
  const handleUpdate = async (id, values) => {
    const updated = await updateProperty(id, values)
    setProperties((prev) => prev.map((p) => (p.id === id ? updated : p)))
    setEditingId(null)
  }

  // 削除：確認ダイアログで OK のときだけ削除する
  const handleDelete = async (property) => {
    if (!window.confirm(`「${property.name}」を削除しますか？`)) return

    try {
      await deleteProperty(property.id)
      setProperties((prev) => prev.filter((p) => p.id !== property.id))
    } catch (err) {
      setError(`削除に失敗しました：${err.message}`)
    }
  }

  // ログアウトしてログイン画面へ戻る
  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="page">
      <header className="header">
        <h1>物件一覧</h1>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleLogout} className="logout-button">
            ログアウト
          </button>
        </div>
      </header>

      {/* 新規登録フォーム */}
      <section className="panel">
        <h2>物件を登録する</h2>
        <PropertyForm submitLabel="登録する" onSubmit={handleCreate} />
      </section>

      {error && <p className="error">{error}</p>}

      {/* 物件一覧 */}
      {loading ? (
        <p className="center-message">読み込み中...</p>
      ) : properties.length === 0 ? (
        <p className="center-message">まだ物件が登録されていません。</p>
      ) : (
        <ul className="property-grid">
          {properties.map((property) => (
            <li key={property.id} className="property-card">
              {editingId === property.id ? (
                // 編集フォーム
                <PropertyForm
                  initialValues={property}
                  submitLabel="保存する"
                  onSubmit={(values) => handleUpdate(property.id, values)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                // 表示モード
                <>
                  <h2>{property.name}</h2>
                  <p className="rent">
                    {formatRent(property.rent)}
                    <span> / 月</span>
                  </p>
                  <p className="area">
                    {property.area}・{property.layout}
                  </p>
                  <div className="card-actions">
                    <button
                      className="secondary-button"
                      onClick={() => setEditingId(property.id)}
                    >
                      編集
                    </button>
                    <button className="danger-button" onClick={() => handleDelete(property)}>
                      削除
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
