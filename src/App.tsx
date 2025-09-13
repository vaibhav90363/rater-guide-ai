import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import WorkflowBuilder from "./pages/WorkflowBuilder";
import KnowledgeBase from "./pages/KnowledgeBase";
import RaterProfiles from "./pages/RaterProfiles";
import QCDashboard from "./pages/QCDashboard";
import RaterPlugin from "./pages/RaterPlugin";
import QCPlugin from "./pages/QCPlugin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="workflow-builder" element={<WorkflowBuilder />} />
            <Route path="knowledge-base" element={<KnowledgeBase />} />
            <Route path="rater-profiles" element={<RaterProfiles />} />
            <Route path="qc-dashboard" element={<QCDashboard />} />
            <Route path="rater-plugin" element={<RaterPlugin />} />
            <Route path="qc-plugin" element={<QCPlugin />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
