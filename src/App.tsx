import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PWAInstall } from "@/components/PWAInstall";
import { PWAUpdateNotification } from "@/components/PWAUpdateNotification";
import updateSW from "./registerSW";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import InfoEvento from "./pages/InfoEvento";
import ScannerPage from "./pages/ScannerPage";
import { Dashboard } from "./pages/Dashboard";
import { queryClient } from "@/lib/queryClient";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PWAUpdateNotification updateSW={updateSW} />
      <BrowserRouter>
        <div className="fixed bottom-4 right-4 z-50">
          <PWAInstall />
        </div>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/info-evento" element={<InfoEvento />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
