import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';

// Admin Function Page
import UserManager from './pages/Admin/UserManager';
import ProjectManager from './pages/Admin/ProjectManager';

import PrivateRouter from './middlewares/PrivateRouter';
import PublicRouter from './middlewares/PublicRouter';

import Error from './pages/Error';

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <PrivateRouter enabled={['admin', 'user']}>
                        <Home />
                    </PrivateRouter>
                } />
                <Route path="/files" element={
                    <PrivateRouter>
                        <Home />
                    </PrivateRouter>
                } />
                <Route path="/login" element={
                    <PublicRouter>
                        <Login />
                    </PublicRouter>
                } />
                <Route path="/admin/user-manager" element={
                    <PrivateRouter enabled={['admin']}>
                        <UserManager />
                    </PrivateRouter>
                } />
                <Route path="/admin/project-manager" element={
                    <PrivateRouter enabled={['admin']}>
                        <ProjectManager />
                    </PrivateRouter>
                } />


                <Route path="*" element={
                    <Error />
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default App;