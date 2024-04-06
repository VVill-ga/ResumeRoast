import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Upload from './pages/Upload'
import About from './pages/About'
import ResumeView from './pages/ResumeView'

import TopBar from './components/TopBar'

function Layout() {
    return (
        <>
            <TopBar />
            <Outlet />
        </>
    );
}

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/login", element: <Login /> },
            { path: "/me", element: <Upload /> },
            { path: "/r/:id", element: <ResumeView/> },
            { path: "/about", element: <About /> }
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
