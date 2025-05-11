
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  User, 
  Search, 
  Lock, 
  Unlock, 
  UserX, 
  UserPlus,
  Edit,
  Trash2,
  Shield
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

// Mock user data for demonstration
const mockUsers = [
  {
    id: "USR001",
    name: "John Smith",
    email: "john.smith@school.edu",
    role: "student",
    class: "10A",
    status: "active",
    violations: 0,
    reputation: 4.8
  },
  {
    id: "USR002",
    name: "Emma Johnson",
    email: "emma.j@school.edu",
    role: "student",
    class: "11B",
    status: "active",
    violations: 1,
    reputation: 4.5
  },
  {
    id: "USR003",
    name: "Michael Brown",
    email: "m.brown@school.edu",
    role: "teacher",
    class: "Science Dept",
    status: "locked",
    violations: 3,
    reputation: 3.2
  },
  {
    id: "USR004",
    name: "Sarah Williams",
    email: "s.williams@school.edu",
    role: "student",
    class: "9C",
    status: "active",
    violations: 0,
    reputation: 5.0
  },
  {
    id: "USR005",
    name: "David Lee",
    email: "d.lee@school.edu",
    role: "club_rep",
    class: "Chess Club",
    status: "active",
    violations: 0,
    reputation: 4.7
  },
];

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [userToAction, setUserToAction] = useState<any | null>(null);
  const [dialogAction, setDialogAction] = useState<"delete" | "lock" | "unlock" | "permission" | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      // Search filter
      const searchMatch = 
        user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.class.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Role filter
      const roleMatch = filterRole ? user.role === filterRole : true;
      
      // Status filter
      const statusMatch = filterStatus ? user.status === filterStatus : true;
      
      return searchMatch && roleMatch && statusMatch;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      // Get values to compare based on sort field
      const valA = a[sortField as keyof typeof a];
      const valB = b[sortField as keyof typeof b];
      
      // Compare values
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      } else {
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        return sortDirection === "asc" 
          ? strA.localeCompare(strB) 
          : strB.localeCompare(strA);
      }
    });

  // Action handlers
  const openDeleteDialog = (user: any) => {
    setUserToAction(user);
    setDialogAction("delete");
    setDialogOpen(true);
  };

  const openLockDialog = (user: any) => {
    setUserToAction(user);
    setDialogAction(user.status === 'locked' ? "unlock" : "lock");
    setDialogOpen(true);
  };

  const openPermissionDialog = (user: any) => {
    setUserToAction(user);
    setDialogAction("permission");
    setDialogOpen(true);
  };

  const executeAction = () => {
    if (!userToAction || !dialogAction) return;

    // Implementation would connect to backend in a real app
    // For now, we'll just show a toast message
    switch(dialogAction) {
      case "delete":
        setUsers(users.filter(user => user.id !== userToAction.id));
        toast({
          title: "User Deleted",
          description: `User ${userToAction.name} has been deleted.`
        });
        break;
      case "lock":
        setUsers(users.map(user => 
          user.id === userToAction.id ? {...user, status: "locked"} : user
        ));
        toast({
          title: "User Locked",
          description: `User ${userToAction.name} has been locked.`
        });
        break;
      case "unlock":
        setUsers(users.map(user => 
          user.id === userToAction.id ? {...user, status: "active"} : user
        ));
        toast({
          title: "User Unlocked",
          description: `User ${userToAction.name} has been unlocked.`
        });
        break;
      case "permission":
        toast({
          title: "Permissions Updated",
          description: `Permissions for ${userToAction.name} have been updated.`
        });
        break;
    }

    setDialogOpen(false);
    setUserToAction(null);
    setDialogAction(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <div className="container py-8 flex-1">
        <div className="flex">
          <AdminSidebar />
          
          <div className="flex-1 ml-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">User Management</h1>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
            
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="col-span-1 md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by ID, name, email or class..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              
              <div>
                <select 
                  className="w-full h-10 rounded-md border border-input px-3 py-2"
                  onChange={(e) => setFilterRole(e.target.value || null)}
                >
                  <option value="">All Roles</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                  <option value="club_rep">Club Rep</option>
                </select>
              </div>
              
              <div>
                <select 
                  className="w-full h-10 rounded-md border border-input px-3 py-2"
                  onChange={(e) => setFilterStatus(e.target.value || null)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="locked">Locked</option>
                </select>
              </div>
            </div>
            
            {/* User Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                      Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Class/Group</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('violations')}>
                      Violations {sortField === 'violations' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('reputation')}>
                      Reputation {sortField === 'reputation' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-32">
                        No users found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className={user.status === 'locked' ? 'bg-muted/50' : ''}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell>{user.class}</TableCell>
                        <TableCell>
                          {user.violations > 0 ? (
                            <span className={user.violations > 2 ? 'text-destructive font-medium' : ''}>
                              {user.violations}
                            </span>
                          ) : '0'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={
                              user.reputation > 4.5 ? 'text-educycle-green font-medium' : 
                              user.reputation < 3.5 ? 'text-destructive font-medium' : ''
                            }>
                              {user.reputation}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="outline" onClick={() => openLockDialog(user)}>
                              {user.status === 'locked' ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                            </Button>
                            <Button size="icon" variant="outline" onClick={() => openPermissionDialog(user)}>
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => openDeleteDialog(user)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Showing {filteredUsers.length} of {users.length} users
              </div>
              <div>
                Page 1 of 1
              </div>
            </div>
            
            {/* Stats Summary */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <div className="text-lg font-medium">Total Users</div>
                <div className="text-3xl font-bold mt-1">{users.length}</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-lg font-medium">Active Users</div>
                <div className="text-3xl font-bold mt-1 text-educycle-green">
                  {users.filter(u => u.status === 'active').length}
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-lg font-medium">Locked Accounts</div>
                <div className="text-3xl font-bold mt-1 text-destructive">
                  {users.filter(u => u.status === 'locked').length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogAction === "delete" ? "Delete User" : 
               dialogAction === "lock" ? "Lock User Account" :
               dialogAction === "unlock" ? "Unlock User Account" :
               "Update User Permissions"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogAction === "delete" ? 
                `Are you sure you want to delete ${userToAction?.name}? This action cannot be undone.` : 
               dialogAction === "lock" ? 
                `Are you sure you want to lock ${userToAction?.name}'s account? They will not be able to log in or use the platform.` :
               dialogAction === "unlock" ? 
                `Are you sure you want to unlock ${userToAction?.name}'s account? They will regain access to the platform.` :
                `Update permissions for ${userToAction?.name}. This will change what they can do on the platform.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {dialogAction === "permission" && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="perm-create-fundraising" className="rounded" />
                  <label htmlFor="perm-create-fundraising">Create fundraising campaigns</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="perm-approve-posts" className="rounded" />
                  <label htmlFor="perm-approve-posts">Approve item posts</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="perm-admin-access" className="rounded" />
                  <label htmlFor="perm-admin-access">Admin access</label>
                </div>
              </div>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeAction}
              className={dialogAction === "delete" ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {dialogAction === "delete" ? "Delete" : 
               dialogAction === "lock" ? "Lock Account" :
               dialogAction === "unlock" ? "Unlock Account" :
               "Update Permissions"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
};

export default AdminUsers;
