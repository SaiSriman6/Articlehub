//import { useState } from 'react'

import './App.css'
import AddArticle from './components/AddArticle'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import RootLayout from './components/RootLayout'
import {createBrowserRouter,RouterProvider} from 'react-router'
import UserDashboard from './components/UserDashboard'
import AuthorDashboard from './components/AuthorDashboard'
import { Toaster } from 'react-hot-toast'
import Articles from './components/Articles'
import ArticleOfAuthor from './components/ArticleOfAuthor'
import ArticleById from './components/ArticleById'
import EditArticle from './components/EditArticle'
import AdminDashboard from './components/AdminDashboard'
import UsersList from './components/UsersList'
import ProtectedRoute from './components/ProtectedRoute'
import Errorboundary from './components/Errorboundary'

function App() {
  const routerObj=createBrowserRouter([
    {path:"/",
    element:<RootLayout/>,
    errorElement:<Errorboundary/>,
    children:[
      {
        path:"",
        element:<Home/>
      },
      {
        path:"register",
        element:<Register/>
      },
      {
        path:"login",
        element:<Login/> 
      },{
        path:"user-profile",
        element:
        <ProtectedRoute allowedRoles={["USER"]}><UserDashboard/></ProtectedRoute>
      },
      {
        path:"author-profile",
        element:<ProtectedRoute allowedRoles={["AUTHOR"]}><AuthorDashboard/></ProtectedRoute>
      },
      {
        path:"admin-profile",
        element:<AdminDashboard/>
      },{
        path:"add-article",
        element:<AddArticle/>
      },
      {
        path:"articles",
        element:<Articles/>
      },
      {
        path:"author-articles",
        element:<ArticleOfAuthor/>
      },
      {
       path:'article/:id',
       element:<ArticleById/>  
      },
      {
        path:"edit-article",
        element:<EditArticle/>
      },
      {
        path:"users",
        element:<UsersList/>
      }
    ]
    }
  ])
  return (
    <>    
    <Toaster position='top-center' reverseOrder={false} />  
    <RouterProvider router={routerObj}/>
    </>
  )
}

export default App
