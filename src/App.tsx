import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';

import { AppStateProvider } from '@/context/AppStateContext';
import { AuthProvider } from '@/context/AuthContext';
import { ExplorePage } from '@/pages/Explore';
import { HomePage } from '@/pages/Home';
import { PlannerPage } from '@/pages/Planner';
import { ToolkitPage } from '@/pages/Toolkit';
import { theme } from '@/theme/theme';
import { Favorites } from './pages/Favorites';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { Login } from './pages/LoginPage';
import { Register } from './pages/RegisterPage';
import { Profile } from './pages/ProfilePage';
import { ProtectedRoute } from './components/Protectedroute';
import { TermsPage } from './pages/TermsPage';

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications position="top-right" />
      <AuthProvider>
        <AppStateProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/planner" element={<PlannerPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/articles/:id" element={<ArticleDetailPage />} />
                <Route path="/toolkit" element={<ToolkitPage />} />
                <Route path="/terms" element={<TermsPage />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Profile />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppStateProvider>
      </AuthProvider>
    </MantineProvider>
  );
}
