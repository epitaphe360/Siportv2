import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Lazy load pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ExhibitorsPage = React.lazy(() => import('./pages/ExhibitorsPage'));
const NetworkingPage = React.lazy(() => import('./pages/NetworkingPage'));
const LoginPage = React.lazy(() => import('./components/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./components/auth/RegisterPage'));
const ProfilePage = React.lazy(() => import('./components/profile/ProfilePage'));
const DashboardPage = React.lazy(() => import('./components/dashboard/DashboardPage'));
const EventsPage = React.lazy(() => import('./components/events/EventsPage'));
const ChatInterface = React.lazy(() => import('./components/chat/ChatInterface'));
const AppointmentCalendar = React.lazy(() => import('./components/appointments/AppointmentCalendar'));
const MiniSiteBuilder = React.lazy(() => import('./components/minisite/MiniSiteBuilder'));
const MiniSitePreview = React.lazy(() => import('./components/minisite/MiniSitePreview'));
const ExhibitorDetailPage = React.lazy(() => import('./components/exhibitor/ExhibitorDetailPage'));
const PartnersPage = React.lazy(() => import('./pages/PartnersPage'));
const PartnerDetailPage = React.lazy(() => import('./pages/PartnerDetailPage'));
const PavillonsPage = React.lazy(() => import('./components/pavilions/PavillonsPage'));
const MetricsPage = React.lazy(() => import('./components/metrics/MetricsPage'));
const DetailedProfilePage = React.lazy(() => import('./components/profile/DetailedProfilePage'));
const VisitorDashboard = React.lazy(() => import('./components/visitor/VisitorDashboard'));
const VisitorProfileSettings = React.lazy(() => import('./components/visitor/VisitorProfileSettings'));
const AdminDashboard = React.lazy(() => import('./components/dashboard/AdminDashboard'));
const ExhibitorDashboard = React.lazy(() => import('./components/dashboard/ExhibitorDashboard'));
const ExhibitorValidation = React.lazy(() => import('./components/admin/ExhibitorValidation'));
const ModerationPanel = React.lazy(() => import('./components/admin/ModerationPanel'));
const MiniSiteEditor = React.lazy(() => import('./components/minisite/MiniSiteEditor'));
const NewsPage = React.lazy(() => import('./pages/NewsPage'));
const ArticleDetailPage = React.lazy(() => import('./pages/ArticleDetailPage'));
const ExhibitorCreationSimulator = React.lazy(() => import('./components/admin/ExhibitorCreationSimulator'));
const PartnerCreationForm = React.lazy(() => import('./components/admin/PartnerCreationForm'));
const NewsArticleCreationForm = React.lazy(() => import('./components/admin/NewsArticleCreationForm'));
const UserManagementPage = React.lazy(() => import('./pages/UserManagementPage'));
const ExhibitorSignUpPage = React.lazy(() => import('./pages/auth/ExhibitorSignUpPage'));
const PartnerSignUpPage = React.lazy(() => import('./pages/auth/PartnerSignUpPage'));
const SignUpSuccessPage = React.lazy(() => import('./pages/auth/SignUpSuccessPage'));
const PendingAccountPage = React.lazy(() => import('./pages/auth/PendingAccountPage'));

import { ChatBot } from './components/chatbot/ChatBot';
import { ChatBotToggle } from './components/chatbot/ChatBotToggle';
import { useLanguageStore } from './store/languageStore';

function App() {
  const [isChatBotOpen, setIsChatBotOpen] = React.useState(false);
  const { currentLanguage, getCurrentLanguage } = useLanguageStore();
  
  // Appliquer la direction du texte selon la langue
  React.useEffect(() => {
    const currentLang = getCurrentLanguage();
    document.documentElement.dir = currentLang.rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang.code;
  }, [currentLanguage, getCurrentLanguage]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<div className="flex justify-center items-center h-full"><div>Chargement...</div></div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/exhibitors" element={<ExhibitorsPage />} />
              <Route path="/exhibitors/:id" element={<ExhibitorDetailPage />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/partners/:id" element={<PartnerDetailPage />} />
              <Route path="/pavilions" element={<PavillonsPage />} />
              <Route path="/metrics" element={<MetricsPage />} />
              <Route path="/networking" element={<NetworkingPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/register/exhibitor" element={<ExhibitorSignUpPage />} />
              <Route path="/register/partner" element={<PartnerSignUpPage />} />
              <Route path="/signup-success" element={<SignUpSuccessPage />} />
              <Route path="/pending-account" element={<PendingAccountPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/detailed" element={<DetailedProfilePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/exhibitor/profile" element={<ProfilePage />} />
              <Route path="/exhibitor/dashboard" element={<ExhibitorDashboard />} />
              <Route path="/visitor/dashboard" element={<VisitorDashboard />} />
              <Route path="/visitor/settings" element={<VisitorProfileSettings />} />
              <Route path="/messages" element={<ChatInterface />} />
              <Route path="/chat" element={<ChatInterface />} />
              <Route path="/appointments" element={<AppointmentCalendar />} />
              <Route path="/calendar" element={<AppointmentCalendar />} />
              <Route path="/minisite" element={<MiniSiteBuilder />} />
              <Route path="/minisite/editor" element={<MiniSiteEditor />} />
              <Route path="/admin/create-exhibitor" element={<ExhibitorCreationSimulator />} />
              <Route path="/admin/create-partner" element={<PartnerCreationForm />} />
              <Route path="/admin/create-news" element={<NewsArticleCreationForm />} />
              <Route path="/minisite/:exhibitorId" element={<MiniSitePreview />} />
              <Route path="/admin/validation" element={<ExhibitorValidation />} />
              <Route path="/admin/moderation" element={<ModerationPanel />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:id" element={<ArticleDetailPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        
        {/* ChatBot */}
        <ChatBot 
          isOpen={isChatBotOpen} 
          onToggle={() => setIsChatBotOpen(!isChatBotOpen)} 
        />
        
        {/* ChatBot Toggle Button */}
        {!isChatBotOpen && (
          <ChatBotToggle 
            onClick={() => setIsChatBotOpen(true)}
            hasUnreadMessages={false}
          />
        )}
      </div>
    </Router>
  );
}

export default App;