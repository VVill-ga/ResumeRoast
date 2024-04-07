import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { css, Global } from '@emotion/react'

import Home from './pages/Home'
import Login from './pages/Login'
import Upload from './pages/Upload'
import About from './pages/About'
import ResumeView from './pages/ResumeView'

import TopBar from './components/TopBar'

const globalStyle = css`
    @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Manjari:wght@100;400;700&display=swap');
    body {
        margin: 0;
        background: #ccc;
        font-family: "Lato", sans-serif;
    }
`

function Layout() {
    return (
        <>
            <Global styles={globalStyle} />
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
