import React, { useEffect, useState } from 'react'
import { useAuth } from '../store/authStore'
import axios from 'axios'
import { useNavigate } from 'react-router'

function ArticleOfAuthor() {
  let [articles, setArticles] = useState([])
  let [error, setError] = useState(null)
  let [loading, setLoading] = useState(false)

  let currentUser = useAuth(state => state.currentUser)
  let navigate = useNavigate();

  const gotoArticle = (articleObj) => {
    navigate(`/article/${articleObj._id}`, { state: articleObj })
  }

  useEffect(() => {
    async function getAuthorArticles() {
      if (!currentUser) return;

      setLoading(true);
      try {
        let res = await axios.get(
          `${import.meta.env.VITE_API_URL}/author-api/articles/${currentUser._id}`,
          { withCredentials: true }
        )
        setArticles(res.data?.payload);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false)
      }
    }
    getAuthorArticles();
  }, [currentUser])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-xl font-semibold text-blue-600 animate-pulse">
          Loading articles...
        </p>
      </div>
    )
  }

  return (
    <>
   <div className="bg-white shadow-sm sticky top-0 z-10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 
                  flex flex-col sm:flex-row 
                  gap-3 sm:gap-0 
                  justify-between items-center">

    <button
      onClick={() => navigate("/author-profile")}
      className="w-full sm:w-auto text-blue-600 font-semibold 
                 hover:text-blue-800 transition text-center"
    >
      ← Dashboard
    </button>

    <button
      onClick={() => navigate("/add-article")}
      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 
                 text-white px-5 py-2 rounded-lg 
                 font-medium shadow transition"
    >
      + Create Article
    </button>

  </div>
</div>
  <div className="min-h-screen bg-gray-100 px-6 py-10">
    <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
      Your Articles
    </h1>
    {error && (
      <p className="text-red-500 text-center mb-6">
        {error}
      </p>
    )}
    <div className="max-w-7xl mx-auto grid gap-6 
                    grid-cols-1 
                    sm:grid-cols-2 
                    md:grid-cols-3 
                    lg:grid-cols-4">

      {articles.length > 0 ? (
        articles.map((article) => (

          <div
            key={article._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-5 flex flex-col justify-between"
          >

            <div>

              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {article.title}
              </h2>

              <span className="inline-block bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full mb-3">
                {article.category}
              </span>

              <p className="text-gray-600 text-sm line-clamp-3">
                {article.content}
              </p>

            </div>


            <button
              onClick={() => gotoArticle(article)}
              className="mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium transition"
            >
              View Article
            </button>

          </div>

        ))
      ) : (

        <p className="text-center col-span-full text-gray-500">
          No articles found.
        </p>

      )}

    </div>
  </div>
</>
  )
}

export default ArticleOfAuthor