import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleBasedRedirect } from './components/RoleBasedRedirect';

import { LoginPage } from './pages/LoginPage';

import { SignupPage } from './pages/SignupPage';
import { VerifyPaymentPage } from './pages/VerifyPaymentPage';
import { AssessmentTestPage } from './pages/AssessmentTestPage';
import { AwaitingApprovalPage } from './pages/AwaitingApprovalPage';
import { AccountDeniedPage } from './pages/AccountDeniedPage';
import { UserDashboard } from './pages/UserDashboard';
import { TasksPage } from './pages/TasksPage';
import { SubmissionsPage } from './pages/SubmissionsPage';
import { ProfilePage } from './pages/ProfilePage';
import { PaymentsPage } from './pages/PaymentsPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminPlatformsPage } from './pages/AdminPlatformsPage';
import { AdminSubmissionsPage } from './pages/AdminSubmissionsPage';
import { AdminCleanupPage } from './pages/AdminCleanupPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AccountPage } from './pages/AccountPage';
import { LandingPage } from './pages/LandingPage';
import { PendingApprovalPage } from './pages/PendingApprovalPage';
import { SecureProtectedRoute } from './components/SecureProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/verify-payment"
            element={
              <ProtectedRoute>
                <VerifyPaymentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/assessment-test"
            element={
              <ProtectedRoute>
                <AssessmentTestPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/awaiting-approval"
            element={
              <ProtectedRoute>
                <AwaitingApprovalPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/account-denied"
            element={
              <ProtectedRoute>
                <AccountDeniedPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/submissions"
            element={
              <ProtectedRoute>
                <SubmissionsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pending-approval"
            element={
              <ProtectedRoute>
                <PendingApprovalPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/feedback/:platformId"
            element={
              <SecureProtectedRoute requireFeature="tasks">
                <FeedbackPage />
              </SecureProtectedRoute>
            }
          />

          <Route
            path="/control"
            element={
              <SecureProtectedRoute requireFeature="admin">
                <AdminDashboard />
              </SecureProtectedRoute>
            }
          />

          <Route
            path="/control/accounts"
            element={
              <SecureProtectedRoute requireFeature="admin">
                <AdminUsersPage />
              </SecureProtectedRoute>
            }
          />

          <Route
            path="/control/accounts/:userId"
            element={
              <SecureProtectedRoute requireFeature="admin">
                <UserProfilePage />
              </SecureProtectedRoute>
            }
          />

          <Route
            path="/control/systems"
            element={
              <SecureProtectedRoute requireFeature="admin">
                <AdminPlatformsPage />
              </SecureProtectedRoute>
            }
          />

          <Route
            path="/control/reports"
            element={
              <SecureProtectedRoute requireFeature="admin">
                <AdminSubmissionsPage />
              </SecureProtectedRoute>
            }
          />

          <Route
            path="/control/cleanup"
            element={
              <SecureProtectedRoute requireFeature="admin">
                <AdminCleanupPage />
              </SecureProtectedRoute>
            }
          />

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/home" element={<RoleBasedRedirect />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
      <SpeedInsights />
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
