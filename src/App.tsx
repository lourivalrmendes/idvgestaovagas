import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AppProvider } from "@/data/store";
import { AuthGate } from "@/components/AuthGate";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import JobsPanel from "./pages/JobsPanel";
import JobsKanban from "./pages/JobsKanban";
import JobDetail from "./pages/JobDetail";
import CreateJob from "./pages/CreateJob";
import Candidates from "./pages/Candidates";
import CandidateDetail from "./pages/CandidateDetail";
import Administration from "./pages/Administration";
import MyProfile from "./pages/MyProfile";
import MyRecords from "./pages/MyRecords";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthGate>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/vagas" element={<JobsPanel />} />
                  <Route path="/vagas/nova" element={<CreateJob />} />
                  <Route path="/vagas/:id" element={<JobDetail />} />
                  <Route path="/kanban" element={<JobsKanban />} />
                  <Route path="/candidatos" element={<Candidates />} />
                  <Route path="/candidatos/:id" element={<CandidateDetail />} />
                  <Route path="/meus-registros" element={<MyRecords />} />
                  <Route path="/administracao" element={<Administration />} />
                  <Route path="/perfil" element={<MyProfile />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthGate>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
