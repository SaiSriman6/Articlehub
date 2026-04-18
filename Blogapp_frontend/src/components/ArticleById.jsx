import React,{useEffect, useState} from 'react'
import {useNavigate, useParams } from 'react-router'
import { useAuth } from '../store/authStore';
import axios from 'axios';
import {toast} from 'react-hot-toast'
import {useForm} from 'react-hook-form'
 
function ArticleById() {
  const id = useParams().id
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null)
  let currentUser = useAuth(state => state.currentUser);
  const { register, handleSubmit, reset,formState:{errors} } = useForm()
 
 
  useEffect(() => {
  const getArticle = async () => {
    try {
      console.log("Article ID:", id);
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/user-api/article/${id}`,
        { withCredentials: true }
      );

      console.log("API response:", res.data); // debug line

      setArticle(res.data.payload);

    } catch (err) {
      console.log(err);
      setError(err.response?.data?.error || "Failed to load article");
    } finally {
      setLoading(false);
    }
  };

  if (id) getArticle();

}, [id]);


 
  const gotoEdit = (articleObj) => {
    navigate("/edit-article", { state: { article: articleObj } })
  }
 
  const deleteArticle = async (articleObj) => {
    const obj = { isArticleActive: !articleObj.isArticleActive }
    const confirmMsg = articleObj.isArticleActive
      ? "Delete this article?"
      : "Restore this article?";
    if (!window.confirm(confirmMsg)) return;
    try {
      setLoading(true);
      let res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/author-api/articles/${id}/status`,
        obj,
        { withCredentials: true }
      )
      if (res.status === 200) {
        toast.success(
          articleObj.isArticleActive ? "Deleted Successfully" : "Restored Successfully"
        )
        setArticle(res.data.payload);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
 
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };
 
  const addComment = async (commentObj) => {
    commentObj.userId = currentUser._id;
    commentObj.articleId = article?._id;
    try {
      setLoading(true);
      let res = await axios.put(
        `${import.meta.env.VITE_API_URL}/user-api/comments`,
        commentObj,
        { withCredentials: true }
      );
      reset();
      if (res.status === 200) {
        toast.success("Comment Added");
        setArticle(res.data.payload);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
 
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl md:text-2xl font-semibold text-blue-600 animate-pulse">
          Loading...
        </p>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl md:text-2xl font-semibold text-red-500 text-center px-4">
          {error}
        </p>
      </div>
    );
  }
 
 return (
   <>
{/* Back Button */}
<div className="w-full px-3 sm:px-6 lg:max-w-5xl lg:mx-auto mt-6">

  <button
    onClick={() =>
      navigate(
        currentUser?.role === "AUTHOR"
          ? "/author-articles"
          : "/articles"
      )
    }
    className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition w-full sm:w-auto"
  >
    ⬅ Back to Articles
  </button>

</div>


{/* Main Layout Wrapper */}
<div className="min-h-screen bg-gray-100 px-2 sm:px-6 lg:px-8 py-4 overflow-hidden">

  <div className="
      w-full
      bg-white
      shadow-lg
      rounded-none sm:rounded-2xl
      p-4 sm:p-6 md:p-8
      sm:max-w-3xl
      lg:max-w-5xl
      sm:mx-auto
      overflow-hidden
  ">


    {/* Author Info */}
    <div className="border-b pb-4 mb-6">

      <h1 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
        Author
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

        <p className="text-gray-600 text-sm sm:text-base break-words">
          <span className="font-medium">Name:</span>{" "}
          {article?.author?.firstName}
        </p>

        <p className="text-gray-600 text-sm sm:text-base break-all">
          <span className="font-medium">Email:</span>{" "}
          {article?.author?.email}
        </p>

        <p className="text-gray-600 text-sm sm:text-base sm:col-span-2">
          <span className="font-medium">Created At:</span>{" "}
          {article?.createdAt && formatDate(article.createdAt)}
        </p>

      </div>

    </div>


    {/* Article Content */}
    <div className="mb-8">

      <h2 className="
        text-xl
        sm:text-2xl
        lg:text-3xl
        font-bold
        text-gray-800
        mb-2
        break-words
      ">
        {article?.title}
      </h2>

      <span className="
        inline-block
        bg-amber-100
        text-amber-700
        text-xs sm:text-sm
        px-3 py-1
        rounded-full
        mb-4
      ">
        {article?.category}
      </span>

      <p className="
        text-gray-700
        text-[15px]
        sm:text-base
        leading-7
        break-words
        overflow-hidden
      ">
        {article?.content}
      </p>

    </div>


    {/* Edit / Delete Buttons */}
    {(article?.author?._id === currentUser._id) && (

      <div className="
        flex
        flex-col sm:flex-row
        gap-3 sm:gap-6
        mb-6
      ">

        <button
          onClick={() => gotoEdit(article)}
          className="
            w-full sm:w-28
            font-bold
            bg-green-500
            hover:bg-green-600
            text-white
            py-2
            rounded-md
            text-sm
          "
        >
          Edit
        </button>

        <button
          onClick={() => deleteArticle(article)}
          className={`w-full sm:w-28 py-2 rounded-md text-sm text-white ${
            article.isArticleActive
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-500 hover:bg-gray-600"
          }`}
        >
          {article?.isArticleActive ? "Delete" : "Restore"}
        </button>

      </div>

    )}


    {/* Comments Section */}
    <div>

      <h3 className="
        text-lg
        sm:text-xl
        font-semibold
        mb-4
        text-gray-800
      ">
        Comments
      </h3>


      {article?.comments?.length > 0 ? (

        <div className="space-y-4">

          {article.comments.map(commentObj => (

            <div
              key={commentObj._id}
              className="
                bg-gray-50
                p-3 sm:p-4
                rounded-lg
                shadow-sm
              "
            >

              <p className="text-sm font-semibold text-gray-800">
                {commentObj?.user?.firstName}
              </p>

              <p className="text-gray-700 mt-1 text-sm sm:text-base break-words">
                {commentObj?.comment}
              </p>

            </div>

          ))}

        </div>

      ) : (

        <p className="text-gray-500 text-sm">
          No comments yet.
        </p>

      )}


      {/* Add Comment Form */}
      {!(article?.author?._id === currentUser?._id) &&
        currentUser.role !== "ADMIN" && (
        <div className="mt-6">

          {error && (
            <p className="text-red-500 text-center mb-3 text-sm">
              {error}
            </p>
          )}
          <form
            onSubmit={handleSubmit(addComment)}
            className="space-y-3"
          >
            <textarea
  {...register("comments", { required: true, minLength: 5 })}
  rows="3"
  placeholder="Write your comment..."
  className="
    w-full
    border border-gray-300
    rounded-lg
    p-3
    focus:outline-none
    focus:ring-2
    focus:ring-amber-400
    transition
    text-sm sm:text-base
    resize-none
  "
/>
{errors.comments?.type === "required" && (
  <p className="text-red-500 text-sm mt-1">Comment is required</p>
)}
{errors.comments?.type === "minLength" && (
  <p className="text-red-500 text-sm mt-1">Minimum 5 characters required</p>
)}
            <button
              type="submit"
              className="
                w-full sm:w-auto
                bg-amber-500
                hover:bg-amber-600
                text-white
                font-semibold
                px-6
                py-2
                rounded-lg
                transition
              "
            >
              Add Comment
            </button>
          </form>
        </div>
      )}
    </div>
  </div>
</div>
</>
  )
}
 
export default ArticleById

// import React,{useEffect, useState} from 'react'
// import { useLocation, useNavigate, useParams } from 'react-router'
// import { useAuth } from '../store/authStore';
// import axios from 'axios';
// import {toast} from 'react-hot-toast'
// import {useForm} from 'react-hook-form'
 
// function ArticleById() {
//   const location = useLocation();
//   const id = useParams().id
//   let navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [article, setArticle] = useState(location.state?.article || location.state || null);
//   const [error, setError] = useState(null)
//   let currentUser = useAuth(state => state.currentUser);
//   const { register, handleSubmit, reset,formState:{errors} } = useForm()
 
//   useEffect(() => {
//     if (article) return;
//     const getArticle = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get(`${import.meta.env.VITE_API_URL}/user-api/article/${id}`, { withCredentials: true });
//         setArticle(res.data.payload);
//       } catch (err) {
//         setError(err.response?.data?.error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getArticle();
//   }, [id, article]);
 
//   const gotoEdit = (articleObj) => {
//     navigate("/edit-article", { state: { article: articleObj } })
//   }
 
//   const deleteArticle = async (articleObj) => {
//     const obj = { isArticleActive: !articleObj.isArticleActive }
//     const confirmMsg = articleObj.isArticleActive
//       ? "Delete this article?"
//       : "Restore this article?";
//     if (!window.confirm(confirmMsg)) return;
//     try {
//       setLoading(true);
//       let res = await axios.patch(
//         `${import.meta.env.VITE_API_URL}/author-api/articles/${id}/status`,
//         obj,
//         { withCredentials: true }
//       )
//       if (res.status === 200) {
//         toast.success(
//           articleObj.isArticleActive ? "Deleted Successfully" : "Restored Successfully"
//         )
//         setArticle(res.data.payload);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }
 
//   const formatDate = (date) => {
//     return new Date(date).toLocaleString("en-IN", {
//       timeZone: "Asia/Kolkata",
//       dateStyle: "medium",
//       timeStyle: "short",
//     });
//   };
 
//   const addComment = async (commentObj) => {
//     commentObj.userId = currentUser._id;
//     commentObj.articleId = article?._id;
//     try {
//       setLoading(true);
//       let res = await axios.put(
//         `${import.meta.env.VITE_API_URL}/user-api/comments`,
//         commentObj,
//         { withCredentials: true }
//       );
//       reset();
//       if (res.status === 200) {
//         toast.success("Comment Added");
//         setArticle(res.data.payload);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <p className="text-xl md:text-2xl font-semibold text-blue-600 animate-pulse">
//           Loading...
//         </p>
//       </div>
//     );
//   }
 
//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <p className="text-xl md:text-2xl font-semibold text-red-500 text-center px-4">
//           {error}
//         </p>
//       </div>
//     );
//   }
 
//  return (
//    <>
// {/* Back Button */}
// <div className="w-full px-3 sm:px-6 lg:max-w-5xl lg:mx-auto mt-6">

//   <button
//     onClick={() =>
//       navigate(
//         currentUser?.role === "AUTHOR"
//           ? "/author-articles"
//           : "/articles"
//       )
//     }
//     className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition w-full sm:w-auto"
//   >
//     ⬅ Back to Articles
//   </button>

// </div>


// {/* Main Layout Wrapper */}
// <div className="min-h-screen bg-gray-100 px-2 sm:px-6 lg:px-8 py-4 overflow-hidden">

//   <div className="
//       w-full
//       bg-white
//       shadow-lg
//       rounded-none sm:rounded-2xl
//       p-4 sm:p-6 md:p-8
//       sm:max-w-3xl
//       lg:max-w-5xl
//       sm:mx-auto
//       overflow-hidden
//   ">


//     {/* Author Info */}
//     <div className="border-b pb-4 mb-6">

//       <h1 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
//         Author
//       </h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

//         <p className="text-gray-600 text-sm sm:text-base break-words">
//           <span className="font-medium">Name:</span>{" "}
//           {article?.author?.firstName}
//         </p>

//         <p className="text-gray-600 text-sm sm:text-base break-all">
//           <span className="font-medium">Email:</span>{" "}
//           {article?.author?.email}
//         </p>

//         <p className="text-gray-600 text-sm sm:text-base sm:col-span-2">
//           <span className="font-medium">Created At:</span>{" "}
//           {article?.createdAt && formatDate(article.createdAt)}
//         </p>

//       </div>

//     </div>


//     {/* Article Content */}
//     <div className="mb-8">

//       <h2 className="
//         text-xl
//         sm:text-2xl
//         lg:text-3xl
//         font-bold
//         text-gray-800
//         mb-2
//         break-words
//       ">
//         {article?.title}
//       </h2>

//       <span className="
//         inline-block
//         bg-amber-100
//         text-amber-700
//         text-xs sm:text-sm
//         px-3 py-1
//         rounded-full
//         mb-4
//       ">
//         {article?.category}
//       </span>

//       <p className="
//         text-gray-700
//         text-[15px]
//         sm:text-base
//         leading-7
//         break-words
//         overflow-hidden
//       ">
//         {article?.content}
//       </p>

//     </div>


//     {/* Edit / Delete Buttons */}
//     {(article?.author?._id === currentUser._id) && (

//       <div className="
//         flex
//         flex-col sm:flex-row
//         gap-3 sm:gap-6
//         mb-6
//       ">

//         <button
//           onClick={() => gotoEdit(article)}
//           className="
//             w-full sm:w-28
//             font-bold
//             bg-green-500
//             hover:bg-green-600
//             text-white
//             py-2
//             rounded-md
//             text-sm
//           "
//         >
//           Edit
//         </button>

//         <button
//           onClick={() => deleteArticle(article)}
//           className={`w-full sm:w-28 py-2 rounded-md text-sm text-white ${
//             article.isArticleActive
//               ? "bg-red-500 hover:bg-red-600"
//               : "bg-gray-500 hover:bg-gray-600"
//           }`}
//         >
//           {article?.isArticleActive ? "Delete" : "Restore"}
//         </button>

//       </div>

//     )}


//     {/* Comments Section */}
//     <div>

//       <h3 className="
//         text-lg
//         sm:text-xl
//         font-semibold
//         mb-4
//         text-gray-800
//       ">
//         Comments
//       </h3>


//       {article?.comments?.length > 0 ? (

//         <div className="space-y-4">

//           {article.comments.map(commentObj => (

//             <div
//               key={commentObj._id}
//               className="
//                 bg-gray-50
//                 p-3 sm:p-4
//                 rounded-lg
//                 shadow-sm
//               "
//             >

//               <p className="text-sm font-semibold text-gray-800">
//                 {commentObj?.user?.firstName}
//               </p>

//               <p className="text-gray-700 mt-1 text-sm sm:text-base break-words">
//                 {commentObj?.comment}
//               </p>

//             </div>

//           ))}

//         </div>

//       ) : (

//         <p className="text-gray-500 text-sm">
//           No comments yet.
//         </p>

//       )}


//       {/* Add Comment Form */}
//       {!(article?.author?._id === currentUser?._id) &&
//         currentUser.role !== "ADMIN" && (
//         <div className="mt-6">

//           {error && (
//             <p className="text-red-500 text-center mb-3 text-sm">
//               {error}
//             </p>
//           )}
//           <form
//             onSubmit={handleSubmit(addComment)}
//             className="space-y-3"
//           >
//             <textarea
//   {...register("comments", { required: true, minLength: 5 })}
//   rows="3"
//   placeholder="Write your comment..."
//   className="
//     w-full
//     border border-gray-300
//     rounded-lg
//     p-3
//     focus:outline-none
//     focus:ring-2
//     focus:ring-amber-400
//     transition
//     text-sm sm:text-base
//     resize-none
//   "
// />
// {errors.comments?.type === "required" && (
//   <p className="text-red-500 text-sm mt-1">Comment is required</p>
// )}
// {errors.comments?.type === "minLength" && (
//   <p className="text-red-500 text-sm mt-1">Minimum 5 characters required</p>
// )}
//             <button
//               type="submit"
//               className="
//                 w-full sm:w-auto
//                 bg-amber-500
//                 hover:bg-amber-600
//                 text-white
//                 font-semibold
//                 px-6
//                 py-2
//                 rounded-lg
//                 transition
//               "
//             >
//               Add Comment
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   </div>
// </div>
// </>
//   )
// }
 
// export default ArticleById