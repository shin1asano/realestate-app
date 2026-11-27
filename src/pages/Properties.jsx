import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { properties } from '../data/properties'

// 家賃を「¥128,000」の形式に整える
const formatRent = (rent) =>
  new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(rent)

// 物件一覧画面（ログイン後に表示）
export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

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

      <ul className="property-grid">
        {properties.map((property) => (
          <li key={property.id} className="property-card">
            <h2>{property.name}</h2>
            <p className="rent">
              {formatRent(property.rent)}
              <span> / 月</span>
            </p>
            <p className="area">{property.area}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
