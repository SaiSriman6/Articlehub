import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { useAuth } from '../store/authStore';

function Articles() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  let currentUser=useAuth(state=>state.currentUser);
  const navigate = useNavigate();
  const gotoArticle = (articleObj) => {
    navigate(`/article/${articleObj._id}`, { state: articleObj })
  }

  useEffect(() => {
    async function getArticles() {
      setLoading(true);
      try {
        if(currentUser.role==="USER"){
            let res = await axios.get(
            "http://localhost:4000/user-api/articles",
            { withCredentials: true }
          )
          setArticles(res.data?.payload);
        }
        if(currentUser.role==="ADMIN"){
            let res = await axios.get(
            "http://localhost:4000/admin-api/articles",
            { withCredentials: true }
            )
            setArticles(res.data?.payload);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    getArticles();
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-xl font-semibold text-blue-600 animate-pulse">
          Loading articles...
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <button
  onClick={() =>
    navigate(
      currentUser.role === "ADMIN"
        ? "/admin-profile"
        : "/user-profile"
    )
  }
  className="mb-8 px-5 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
  >
  ⬅ Back to Dashboard
</button>
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
        Explore Articles
      </h1>
      {error && (
        <p className="text-red-500 text-center mb-4">{error}</p>
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
  )
}

export default Articles