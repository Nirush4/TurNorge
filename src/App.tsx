import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { AppStateProvider } from '@/context/AppStateContext';
import { ExplorePage } from '@/pages/Explore';
import { HomePage } from '@/pages/Home';
import { PlannerPage } from '@/pages/Planner';
import { ToolkitPage } from '@/pages/Toolkit';
import { theme } from '@/theme/theme';
import { Favorites } from './pages/Favorites';

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications position="top-right" />
      <AppStateProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/planner" element={<PlannerPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/toolkit" element={<ToolkitPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppStateProvider>
    </MantineProvider>
  );
}
