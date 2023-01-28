import Header from './components/Header';
import { Routes, Route, Navigate } from 'react-router-dom';

import DashboardView from './views/DashboardView';
import MyTasksView from './views/MyTasksView';
import CalendarView from './views/CalendarView';
import AnalyticsView from './views/AnalyticsView';

const App = () => {
  return (
    <div className="h-screen bg-base-300 text-base-content">
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
