
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import ProductosPage from "./pages/ProductosPage";
import VentasPage from "./pages/VentasPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import AppSidebar from "./components/AppSidebar";

const queryClient = new QueryClient();

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" closeButton richColors />
        <BrowserRouter>
          <div className="flex min-h-screen">
            <AppSidebar 
              collapsed={sidebarCollapsed} 
              setCollapsed={setSidebarCollapsed} 
            />
            <div 
              className="flex-1 transition-all duration-300"
              style={{ marginLeft: sidebarCollapsed ? "70px" : "240px" }}
            >
              <Navbar />
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/productos" element={<ProductosPage />} />
                  <Route path="/ventas" element={<VentasPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
