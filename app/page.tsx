// app/page.tsx

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

// サーバー側で実行される投稿アクション
async function postData(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const content = formData.get("content") as string;
  await sql`INSERT INTO posts (name, content) VALUES (${name}, ${content});`;
  revalidatePath("/"); // 投稿後にページを再読み込み
}

export default async function Home() {
  // 投稿を新しい順に取得
  const { rows } = await sql`SELECT * FROM posts ORDER BY created_at DESC;`;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        ひとこと掲示板
      </h1>

      {/* 投稿フォーム */}
      <form
        action={postData}
        className="mb-8 p-6 bg-white rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
            ニックネーム
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">
            投稿内容
          </label>
          <textarea
            id="content"
            name="content"
            rows={4}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
        >
          投稿する
        </button>
      </form>

      {/* 投稿一覧 */}
      <div className="space-y-4">
        {rows.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow">
            <p className="font-bold text-gray-800">{post.name || "名無しさん"}</p>
            <p className="text-gray-600 my-2">{post.content}</p>
            <p className="text-xs text-gray-400 text-right">
              {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}