import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, LogIn, ShoppingBag, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Navigation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Mock auth state - in a real app, this would come from your auth system
  const isAuthenticated = true;
  const userRole = localStorage.getItem("userRole");
  const isMember = userRole?.includes("Member");
  const isAdmin = userRole?.includes("Admin");
  const isManager = userRole?.includes("Approval Manager") || userRole?.includes("Warehouse Manager");

  const handleSignOut = () => {
    // In a real app, this would call your auth service's logout method
    toast.success("You have been signed out");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/home" className="flex items-center">
            <span className="text-2xl font-bold text-educycle-green">
              Edu<span className="text-educycle-blue">Cycle</span>
            </span>
          </Link>
        </div>

        <div className="hidden flex-1 max-w-md mx-8 lg:block">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for items..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/browse">
            <Button variant="ghost" size="sm">
              Browse
            </Button>
          </Link>
          <Link to="/fundraisers">
            <Button variant="ghost" size="sm">
              Fundraisers
            </Button>
          </Link>
          {(isMember || isAdmin) && (
            <Link to="/sell">
              <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Sell Item
              </Button>
            </Link>
          )}
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 p-0">
                  <Avatar>
                    <AvatarImage src={localStorage.getItem("userAvatar") || 'https://api.dicebear.com/7.x/avataaars/svg?seed=LilPump'} alt={localStorage.getItem("userName") || 'User'} />
                    <AvatarFallback>{localStorage.getItem("userName")?.substring(0, 2).toUpperCase() || 'User'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{localStorage.getItem("userName") || 'User'}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={isAdmin ? "/admin/users" : isManager ? "/admin/items" : "/profile"} className="w-full cursor-pointer">  
                    <UserRound className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleSignOut}
                >
                  <LogIn className="mr-2 h-4 w-4 rotate-180" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="icon">
                <LogIn className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;