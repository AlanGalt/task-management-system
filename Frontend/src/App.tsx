import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import DashboardView from './views/DashboardView';
import MyTasksView from './views/MyTasksView';
import CalendarView from './views/CalendarView';
import AnalyticsView from './views/AnalyticsView';

const App = () => {
  return (
    <div className="h-screen overflow-hidden bg-base-100 text-base-content">
      <Header />
      <Routes>
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/my-tasks" element={<MyTasksView />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/analytics" element={<AnalyticsView />} />

        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
};

export default App;
