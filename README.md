# 002_貸し借りマップ

他人との貸し借り状況を、マインドマップのように可視化して管理するアプリ案。

## 現在の優先事項
1. 必要機能の整理
2. 画面構成の整理
3. HTMLでのページ構成提案
4. 承認後、Expoアプリとして実装開始

## ファイル
- `docs/requirements-and-screens.md`: 要件と画面構成
- `prototype/index.html`: HTML構成案
- `.ai-dlc/units-of-work/20260628-initial-html-information-architecture.md`: 初期タスク記録

## ローカル確認
現在は以下でHTMLプロトタイプを確認できます。

```bash
cd /tmp/kashikari_map_prototype
python3 -m http.server 4173 --bind 127.0.0.1
```

URL: http://127.0.0.1:4173/index.html

## GitHub Pages

公開URL: https://seiyakobori.github.io/kashikari-map/

ローカル原稿: `prototype/index.html`
公開用トップ: `index.html`

## 提案ページ運用

今後は設計メモだけでなく、ユーザーが直接FBできるように `prototype/index.html` へ実アプリ画面モックを追加して提案する。
現在の画面モック: ホーム、追加、一覧、詳細、通知。
アプリモックは `mock.html` として概要ページとは別に公開し、毎回の報告には概要URLとモックURLを併記する。モックは静的な画面カード集やレビュー用ページではなく、概要へ戻るリンク・説明サイドバー等を置かずに、実際に起動したアプリの見た目と画面遷移/CTAのつながりを再現する。
