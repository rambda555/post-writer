// マークダウンや MDX などのコンテンツファイルを構造化されたデータに変換するための Node.js 用のライブラリ
import { defineDocumentType, makeSource } from "contentlayer2/source-files";

// Markdown ヘッダーに自動的にリンクを追加する rehype プラグイン
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// コードブロックのシンタックスハイライトを行う rehype プラグイン
import rehypePrettyCode, {
  type LineElement,
  type CharsElement,
} from "rehype-pretty-code";

// ヘッダーの ID を自動生成する rehype プラグイン
import rehypeSlug from "rehype-slug";

// マークダウンの GFM（GitHub Flavored Markdown） をサポートする remark プラグイン
// テーブル記法、タスクリスト、取り消し線などの機能をサポートする
import remarkGfm from "remark-gfm";

// ドキュメントのファイルパス情報の型
// Contentlayer が処理するドキュメントの内部メタデータにアクセスするために使用
type DocumentWithRaw = {
  _raw: {
    flattenedPath: string;
  };
};

/**
 * 自動計算されるフィールドを返却する関数
 * @returns 自動計算されるフィールド (slug, slugAsParams) を含むオブジェクト
 */
const createComputedFields = () => ({
  // ファイルパスを生成するフィールド
  slug: {
    type: "string" as const,
    resolve: (doc: DocumentWithRaw) => `/${doc._raw.flattenedPath}`, // ファイルパスを取得して、 / で結合して返す
  },

  // ファイルパスをパラメータ形式に変換するフィールド
  slugAsParams: {
    type: "string" as const,

    // ドキュメントのパスを / で分割して、最初の要素を除去、残りの要素を再び / で結合して返す
    resolve: (doc: DocumentWithRaw) =>
      doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
});

// Doc タイプのドキュメントの定義
// defineDocumentType - マークダウンや MDX ファイルから構造化されたデータを生成するための関数
export const Doc = defineDocumentType(() => ({
  // ドキュメントの名前
  name: "Doc",

  // ドキュメントのパスパターン (どのファイルを Doc タイプのドキュメントとして処理するかを指定)
  filePathPattern: `docs/**/*.mdx`,

  // ドキュメントのコンテンツタイプ (マークダウンや MDX ファイルを指定)
  contentType: "mdx",

  // ドキュメントのフィールド
  fields: {
    title: {
      // タイトル
      type: "string",
      required: true,
    },
    description: {
      // 説明
      type: "string",
    },
    published: {
      // 公開状態
      type: "boolean",
      default: true,
    },
  },

  // ドキュメントに自動計算されるフィールドを追加する
  computedFields: createComputedFields(),
}));

// Guide タイプのドキュメント (ガイド) の定義
export const Guide = defineDocumentType(() => ({
  // ドキュメントの名前
  name: "Guide",

  // ドキュメントのパスパターン (どのファイルを Guide タイプのドキュメントとして処理するかを指定)
  filePathPattern: `guides/**/*.mdx`,

  // ドキュメントのコンテンツタイプ (マークダウンや MDX ファイルを指定)
  contentType: "mdx",

  // ドキュメントのフィールド
  fields: {
    title: {
      // タイトル
      type: "string",
      required: true,
    },
    description: {
      // 説明
      type: "string",
    },
    date: {
      // 日付
      type: "date",
      required: true,
    },
    published: {
      // 公開状態
      type: "boolean",
      default: true,
    },
    featured: {
      // 特集記事
      type: "boolean",
      default: false,
    },
  },

  // ドキュメントに自動計算されるフィールドを追加する
  computedFields: createComputedFields(),
}));

// Post タイプのドキュメント (ブログ記事) の定義
export const Post = defineDocumentType(() => ({
  // ドキュメントの名前
  name: "Post",

  // ドキュメントのパスパターン (どのファイルを Post タイプのドキュメントとして処理するかを指定)
  filePathPattern: `blog/**/*.mdx`,

  // ドキュメントのコンテンツタイプ (マークダウンや MDX ファイルを指定)
  contentType: "mdx",

  // ドキュメントのフィールド
  fields: {
    title: {
      // タイトル
      type: "string",
      required: true,
    },
    description: {
      // 説明
      type: "string",
    },
    date: {
      // 日付
      type: "date",
      required: true,
    },
    published: {
      // 公開状態
      type: "boolean",
      default: true,
    },
    image: {
      // 画像
      type: "string",
      required: true,
    },
    authors: {
      // 著者
      // Reference types are not embedded.
      // Until this is fixed, we can use a simple list.
      // type: "reference",
      // of: Author,
      type: "list",
      of: { type: "string" },
      required: true,
    },
  },

  // ドキュメントに自動計算されるフィールドを追加する
  computedFields: createComputedFields(),
}));

// Author タイプのドキュメント (著者) の定義
export const Author = defineDocumentType(() => ({
  // ドキュメントの名前
  name: "Author",

  // ドキュメントのパスパターン (どのファイルを Author タイプのドキュメントとして処理するかを指定)
  filePathPattern: `authors/**/*.mdx`,

  // ドキュメントのコンテンツタイプ (マークダウンや MDX ファイルを指定)
  contentType: "mdx",

  // ドキュメントのフィールド
  fields: {
    title: {
      // タイトル
      type: "string",
      required: true,
    },
    description: {
      // 説明
      type: "string",
    },
    avatar: {
      // アバター
      type: "string",
      required: true,
    },
    twitter: {
      // ツイッター
      type: "string",
      required: true,
    },
  },

  // ドキュメントに自動計算されるフィールドを追加する
  computedFields: createComputedFields(),
}));

// Page タイプのドキュメント (ページ) の定義
export const Page = defineDocumentType(() => ({
  // ドキュメントの名前
  name: "Page",

  // ドキュメントのパスパターン (どのファイルを Page タイプのドキュメントとして処理するかを指定)
  filePathPattern: `pages/**/*.mdx`,

  // ドキュメントのコンテンツタイプ (マークダウンや MDX ファイルを指定)
  contentType: "mdx",

  // ドキュメントのフィールド
  fields: {
    title: {
      // タイトル
      type: "string",
      required: true,
    },
    description: {
      // 説明
      type: "string",
    },
  },

  // ドキュメントに自動計算されるフィールドを追加する
  computedFields: createComputedFields(),
}));

// Contentlayer の設定
export default makeSource({
  // コンテンツディレクトリのパス
  contentDirPath: "./src/content",

  // ドキュメントのタイプ
  documentTypes: [Doc, Guide, Post, Author, Page],

  // MDX の設定
  mdx: {
    // remark プラグイン
    remarkPlugins: [
      // GFM をサポートする remark プラグイン
      remarkGfm,
    ],

    // rehype プラグイン
    rehypePlugins: [
      // ヘッダーの ID を自動生成する rehype プラグイン
      rehypeSlug,

      // コードブロックのシンタックスハイライトを行う rehype プラグイン
      [
        rehypePrettyCode,
        {
          // コードブロックの背景色を保持しない
          keepBackground: false,

          // 各行　 (LineElement) を訪問する度に呼び出されるコールバック関数
          onVisitLine(node: LineElement) {
            // display: grid; プロパティが使用されている環境では、空の行 (内容がない行) が視覚的に潰れてしまう問題がある
            // ユーザーが空の行をコピー＆ペーストしようとしても、内容がないため操作が難しくなる

            // 行に子要素がない場合
            if (node.children.length === 0) {
              // 空の行を作成する
              node.children = [{ type: "text", value: " " }];
            }
          },

          // ハイライトされた行を訪問する度に呼び出されるコールバック関数
          onVisitHighlightedLine(node: LineElement) {
            // 行のプロパティを初期化する
            node.properties = node.properties || {};

            // 行のクラス名を初期化する
            node.properties.className = node.properties.className || [];

            // 行のクラス名に "line--highlighted" を追加する
            node.properties.className.push("line--highlighted");
          },

          // ハイライトされた単語を訪問する度に呼び出されるコールバック関数
          onVisitHighlightedWord(node: CharsElement) {
            // 単語のプロパティを初期化する
            node.properties = node.properties || {};

            // 単語のクラス名に "word--highlighted" を追加する
            node.properties.className = ["word--highlighted"];
          },
        },
      ],
      [
        // ヘッダーに自動的にリンクを追加する rehype プラグイン
        rehypeAutolinkHeadings,
        {
          // ヘッダーのリンクのクラス名を指定する
          properties: {
            className: ["subheading-anchor"],

            // ヘッダーのリンクの aria-label を指定する
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
});
