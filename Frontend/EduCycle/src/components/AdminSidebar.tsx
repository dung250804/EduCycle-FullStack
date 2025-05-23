import { Link } from "react-router-dom";
import { User, DollarSign, ShoppingCart, Settings, FileText } from "lucide-react";

const AdminSidebar = () => {
  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole?.includes("Admin");
  const isApprovalManager = userRole?.includes("Approval Manager");
  const hasItemAccess = userRole?.includes("Warehouse Manager") || 
                       isApprovalManager || 
                       isAdmin;

  return (
    <div className="w-56 shrink-0">
      <div className="p-4 bg-card border rounded-lg">
        <h2 className="font-semibold text-lg mb-4">Admin Panel</h2>
        <nav className="space-y-2">
          {isAdmin && (
            <Link 
              to="/admin/users" 
              className="flex items-center gap-2 p-2 hover:bg-muted rounded-md text-sm font-medium"
            >
              <User className="h-4 w-4" />
              User Management
            </Link>
          )}
          {(isAdmin || isApprovalManager) && (
            <Link 
              to="/admin/donations" 
              className="flex items-center gap-2 p-2 hover:bg-muted rounded-md text-sm font-medium"
            >
              <DollarSign className="h-4 w-4" />
              Donations
            </Link>
          )}
          {hasItemAccess && (
            <Link 
              to="/admin/items" 
              className="flex items-center gap-2 p-2 hover:bg-muted rounded-md text-sm font-medium"
            >
              <ShoppingCart className="h-4 w-4" />
              Item Listings
            </Link>
          )}
          {isAdmin && (
            <Link 
              to="/admin/reports" 
              className="flex items-center gap-2 p-2 hover:bg-muted rounded-md text-sm font-medium"
            >
              <FileText className="h-4 w-4" />
              Reports
            </Link>
          )}
          <Link 
            to="/admin/settings" 
            className="flex items-center gap-2 p-2 hover:bg-muted rounded-md text-sm font-medium"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;