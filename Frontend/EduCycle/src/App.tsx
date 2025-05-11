
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import Browse from "./pages/Browse";
import Fundraisers from "./pages/Fundraisers";
import Sell from "./pages/Sell";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AdminUsers from "./pages/AdminUsers";
import AdminDonations from "./pages/AdminDonations";
import AdminItems from "./pages/AdminItems";
import CreateActivity from "./pages/CreateActivity";
import FundraiserDetails from "./pages/FundraiserDetails";
import ItemDetails from "./pages/ItemDetails";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Index />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/fundraisers" element={<Fundraisers />} />
          <Route path="/fundraisers/:id" element={<FundraiserDetails />} />
          <Route path="/create-activity" element={<CreateActivity />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post/:id" element={<ItemDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/donations" element={<AdminDonations />} />
          <Route path="/admin/items" element={<AdminItems />} />
          {/* Redirect root path to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
