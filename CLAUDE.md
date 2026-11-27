# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code 向けのガイドです。

## プロジェクト概要

不動産管理 Web アプリ（realestate-app）。Supabase 認証（メールアドレス＋パスワード）でログインし、物件一覧を表示する。

- `/login` ログイン、`/signup` 会員登録（ログイン済みなら `/properties` へ移動する）
- `/properties` 物件一覧（ログインが必要。未ログインなら `/login` へリダイレクト）
- 物件データは現在 [src/data/properties.js](src/data/properties.js) のダミーデータ

## 技術スタック

- React + Vite（JavaScript / JSX）
- React Router（ルーティング）
- Supabase（`@supabase/supabase-js`、認証）

### 構成

- [src/lib/supabase.js](src/lib/supabase.js) — Supabase クライアント
- [src/contexts/AuthContext.jsx](src/contexts/AuthContext.jsx) — ログイン状態の管理（`useAuth`）
- [src/components/ProtectedRoute.jsx](src/components/ProtectedRoute.jsx) — ログインが必要なページ・ゲスト向けページのガード
- [src/pages/](src/pages/) — 各画面

### 環境変数

`.env`（Git 管理外）に設定する。テンプレートは `.env.example`。

- `VITE_SUPABASE_URL` — Supabase の Project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase の Publishable key

## 開発コマンド

```bash
npm install      # 依存関係のインストール
npm run dev      # 開発サーバー起動（http://localhost:5173）
npm run build    # 本番ビルド（dist/）
npm run preview  # ビルド結果の確認
```

## Git 運用ルール

### 基本方針: コードを変更するたびに GitHub へプッシュする

- コードを変更したら、作業単位ごとに **コミットして GitHub（`origin`）へプッシュ** すること。変更をローカルに溜め込まない。
- 1 つのコミットには 1 つの論理的な変更のみを含める。
- プッシュ前に、可能であればテスト・Lint を実行し、失敗している状態ではプッシュしない（失敗した場合はユーザーに報告する）。

### 手順

```bash
git status                # 変更内容を確認
git add <変更したファイル>   # 関係するファイルのみをステージ（git add . は避ける）
git commit -m "<種別>: <変更内容の要約>"
git push origin <現在のブランチ>
```

### コミットメッセージ

日本語で、先頭に種別を付ける。

| 種別 | 用途 |
| --- | --- |
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `refactor` | 動作を変えないコード改善 |
| `style` | 見た目・フォーマットのみの変更 |
| `docs` | ドキュメントの変更 |
| `test` | テストの追加・修正 |
| `chore` | 設定・依存関係などの雑務 |

例: `feat: 物件一覧に価格での絞り込みを追加`

### 注意事項

- `.env`、API キー、認証情報などの秘密情報は **絶対にコミットしない**。`.gitignore` に含めること。
- `git push --force`、`git reset --hard` などの履歴を破壊する操作は、ユーザーの明示的な指示がない限り行わない。
- プッシュが失敗した場合（認証エラー、リモートとの競合など）は、無理に解決せずユーザーに状況を報告する。

## コーディング規約

- 既存コードのスタイル・構成に合わせる。
- 不要なファイルや未使用コードを残さない。
- コード中のコメントは日本語で書く。
