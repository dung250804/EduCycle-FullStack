import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  Search, 
  Lock, 
  Unlock, 
  UserPlus,
  Edit,
  Trash2,
  Shield,
  Upload
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface User {
  userId: string;
  name: string;
  email: string;
  roles: string[];
  className: string;
  status: "Active" | "Banned";
  violationCount: number;
  reputationScore: number;
  walletBalance: number; // Added
  rating: number; // Added
  permissions?: string[];
  avatar?: string;
} 

const addUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  roles: z.array(z.string()).min(1, "Select at least one role"),
  className: z.string().min(1, "Please enter a class or department"),
  thClass: z.string().min(1, "Please enter a TH class"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  avatar: z.string().optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  roles: z.array(z.string()).min(1, "Select at least one role"),
  className: z.string().min(1, "Please enter a class or department"),
  avatar: z.string().optional()
});

const permissionSchema = z.object({
  permissions: z.array(z.string()),
});

const availableRoles = [
  { id: "1", label: "Admin" },
  { id: "2", label: "Approval Manager" },
  { id: "3", label: "Member" },
  { id: "4", label: "Representative" },
  { id: "5", label: "Warehouse Manager" },
];

const availablePermissions = [
  { id: "create_fundraising", label: "Create fundraising campaigns" },
  { id: "approve_posts", label: "Approve item posts" },
  { id: "admin_access", label: "Admin access" },
];

const API_BASE_URL = "http://localhost:8080/api/users";

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [userToAction, setUserToAction] = useState<User | null>(null);
  const [dialogAction, setDialogAction] = useState<"delete" | "lock" | "unlock" | "permission" | "edit" | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageData, setImageData] = useState<{
    image: File | null;
    api_key: string;
    timestamp: string;
    signature: string;
  }>({
    image: null,
    api_key: "",
    timestamp: "",
    signature: "",
  });

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const addForm = useForm<z.infer<typeof addUserSchema>>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: "",
      email: "",
      roles: ["3"], // Default to "Member"
      className: "",
      thClass: "",
      password: "",
      avatar: "",
    },
  });

  const updateForm = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      roles: [],
      className: "",
      avatar: "",
    },
  });

  const permissionForm = useForm<z.infer<typeof permissionSchema>>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      permissions: [],
    },
  });

  const handleFileChange = (file: File | null, form: any) => {
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please upload an image file (PNG, JPG).",
          variant: "destructive",
        });
        return;
      }
      setImageData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageData((prev) => ({ ...prev, image: null }));
      setPreviewImage(null);
      form.setValue("avatar", "");
    }
  };

  const handleInputFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    form: any
  ) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file, form);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, form: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFileChange(file, form);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000).toString();
      const signatureResponse = await fetch("http://localhost:8080/api/cloudinary/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timestamp }),
      });

      if (!signatureResponse.ok) {
        throw new Error("Failed to get Cloudinary signature");
      }

      const { signature, timestamp: returnedTimestamp } = await signatureResponse.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
      formData.append("timestamp", returnedTimestamp);
      formData.append("signature", signature);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) { 
        throw new Error("Failed to upload image to Cloudinary");
      }

      const data = await uploadResponse.json();
      return data.secure_url;
    } catch (error) {
      throw new Error("Cloudinary upload failed: " + (error as Error).message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      // Transform roles to an array of role IDs
      const normalizedUsers = data.map((user: any) => ({
        ...user,
        roles: user.roles.map((role: any) => role.roleName || role), // Extract roleId or use role as fallback
      }));
      setUsers(normalizedUsers);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredUsers = users
    .filter(user => {
      const searchMatch =
        user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.className.toLowerCase().includes(searchTerm.toLowerCase());
      
      const roleMatch = filterRole ? user.roles.includes(filterRole) : true;
      const statusMatch = filterStatus ? user.status === filterStatus : true;
      
      return searchMatch && roleMatch && statusMatch;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      const valA = a[sortField];
      const valB = b[sortField];
      
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return sortDirection === "asc" 
        ? strA.localeCompare(strB) 
        : strB.localeCompare(strA);
    });

  const openDeleteDialog = (user: User) => {
    setUserToAction(user);
    setDialogAction("delete");
    setDialogOpen(true);
  };

  const openLockDialog = (user: User) => {
    setUserToAction(user);
    setDialogAction(user.status === "Banned" ? "unlock" : "lock");
    setDialogOpen(true);
  };

  const openPermissionDialog = (user: User) => {
    setUserToAction(user);
    setDialogAction("permission");
    permissionForm.reset({ permissions: user.permissions || [] });
    setDialogOpen(true);
  };

  const openEditDialog = (user: User) => {
    setUserToAction(user);
    setDialogAction("edit");
    updateForm.reset({
      name: user.name,
      email: user.email,
      roles: user.roles,
      className: user.className,
      avatar: user.avatar || "",
    });
    setPreviewImage(user.avatar || null);
    setImageData({ image: null, api_key: "", timestamp: "", signature: "" });
    setDialogOpen(true);
  };

  const executeAction = async () => {
    if (!userToAction || !dialogAction) return;

    setLoading(true);
    try {
      switch(dialogAction) {
        case "delete":
          const deleteResponse = await fetch(`${API_BASE_URL}/${userToAction.userId}`, {
            method: "DELETE",
          });
          if (!deleteResponse.ok) {
            throw new Error("Failed to delete user");
          }
          setUsers(users.filter(user => user.userId !== userToAction.userId));
          toast({
            title: "User Deleted",
            description: `User ${userToAction.name} has been deleted.`,
          });
          break;
        case "lock":
          const lockResponse = await fetch(`${API_BASE_URL}/${userToAction.userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...userToAction,
              status: "Banned",
            }),
          });
          if (!lockResponse.ok) {
            throw new Error("Failed to lock user");
          }
          setUsers(users.map(user => 
            user.userId === userToAction.userId ? { ...user, status: "Banned" } : user
          ));
          toast({
            title: "User Locked",
            description: `User ${userToAction.name} has been locked.`,
          });
          break;
        case "unlock":
          const unlockResponse = await fetch(`${API_BASE_URL}/${userToAction.userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...userToAction,
              status: "Active",
            }),
          });
          if (!unlockResponse.ok) {
            throw new Error("Failed to unlock user");
          }
          setUsers(users.map(user => 
            user.userId === userToAction.userId ? { ...user, status: "Active" } : user
          ));
          toast({
            title: "User Unlocked",
            description: `User ${userToAction.name} has been unlocked.`,
          });
          break;
        case "permission":
          const permissionsData = permissionForm.getValues();
          const permissionResponse = await fetch(`${API_BASE_URL}/${userToAction.userId}/permissions`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              permissions: permissionsData.permissions,
            }),
          });
          if (!permissionResponse.ok) {
            throw new Error("Failed to update permissions");
          }
          setUsers(users.map(user => 
            user.userId === userToAction.userId ? { ...user, permissions: permissionsData.permissions } : user
          ));
          toast({
            title: "Permissions Updated",
            description: `Permissions for ${userToAction.name} have been updated.`,
          });
          break;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Operation failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDialogOpen(false);
      setUserToAction(null);
      setDialogAction(null);
    }
  };

  const onAddUser = async (data: z.infer<typeof addUserSchema>) => {
    setLoading(true);
    try {
      let avatarUrl = data.avatar;
      if (imageData.image) {
        avatarUrl = await uploadToCloudinary(imageData.image);
      }

      // Map role IDs to role names
      const roleNames = data.roles.map(roleId => {
        const role = availableRoles.find(r => r.id === roleId);
        return role ? role.label : roleId; // Fallback to roleId if not found
      });

      const response = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          roles: roleNames, // Send role names instead of IDs
          avatar: avatarUrl,
          reputationScore: 0,
          violationCount: 0,
          walletBalance: "0", // Send as string to ensure BigDecimal compatibility
          rating: "5", // Send as string to ensure BigDecimal compatibility
          status: "Active", // Match backend enum case
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        toast({
          title: "Error",
          description: `Failed to add user: ${errorData.message || "Invalid request"}`,
          variant: "destructive",
        });
        throw new Error("Failed to add user");
      }

      const newUser = await response.json();
      setUsers([...users, newUser]);
      setAddUserDialogOpen(false);
      toast({
        title: "User Added",
        description: `${data.name} has been added successfully.`,
      });
      addForm.reset();
      setPreviewImage(null);
      setImageData({ image: null, api_key: "", timestamp: "", signature: "" });
    } catch (error) {
      console.error("Add user error:", error);
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update the onUpdateUser function
  const onUpdateUser = async (data: z.infer<typeof updateUserSchema>) => {
    if (!userToAction) return;
    setLoading(true);
    try {
      let avatarUrl = data.avatar;
      if (imageData.image) {
        avatarUrl = await uploadToCloudinary(imageData.image);
      }

      const response = await fetch(`${API_BASE_URL}/${userToAction.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          avatar: avatarUrl,
          reputationScore: userToAction.reputationScore, // Preserve existing value
          violationCount: userToAction.violationCount, // Preserve existing value
          walletBalance: userToAction.walletBalance || 0, // Preserve or default to 0
          rating: userToAction.rating || 5, // Preserve or default to 5
          status: userToAction.status, // Preserve existing value
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      const updatedUser = await response.json();
      setUsers(users.map(user => 
        user.userId === userToAction.userId ? updatedUser : user
      ));
      setDialogOpen(false);
      toast({
        title: "User Updated",
        description: `${data.name} has been updated successfully.`,
      });
      setPreviewImage(null);
      setImageData({ image: null, api_key: "", timestamp: "", signature: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
              <Button onClick={() => {
                setAddUserDialogOpen(true);
                setPreviewImage(null);
                setImageData({ image: null, api_key: "", timestamp: "", signature: "" });
              }} disabled={loading}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="col-span-1 md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by ID, name, email or class..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={handleSearch}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div>
                <select 
                  className="w-full h-10 rounded-md border border-input px-3 py-2"
                  onChange={(e) => setFilterRole(e.target.value || null)}
                  disabled={loading}
                >
                  <option value="">All Roles</option>
                  {availableRoles.map(role => (
                    <option key={role.id} value={role.id}>{role.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <select 
                  className="w-full h-10 rounded-md border border-input px-3 py-2"
                  onChange={(e) => setFilterStatus(e.target.value || null)}
                  disabled={loading}
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Banned">Banned</option>
                </select>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                      Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Class/Group</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('violationCount')}>
                      Violations {sortField === 'violationCount' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('reputationScore')}>
                      Reputation {sortField === 'reputationScore' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-32">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-32">
                        No users found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.userId} className={user.status === 'Banned' ? 'bg-muted/50' : ''}>
                        <TableCell className="font-medium">{user.userId}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role) => (
                              <Badge 
                                key={`${user.userId}-${role}`} 
                                variant="outline" 
                                className="capitalize"
                              >
                                {availableRoles.find(r => r.id === role)?.label || role}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{user.className}</TableCell>
                        <TableCell>
                          {user.violationCount > 0 ? (
                            <span className={user.violationCount > 2 ? 'text-destructive font-medium' : ''}>
                              {user.violationCount}
                            </span>
                          ) : '0'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={
                              user.reputationScore > 4.5 ? 'text-green-600 font-medium' : 
                              user.reputationScore < 3.5 ? 'text-destructive font-medium' : ''
                            }>
                              {user.reputationScore}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="outline" onClick={() => openLockDialog(user)} disabled={loading}>
                              {user.status === 'Banned' ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                            </Button>
                            <Button size="icon" variant="outline" onClick={() => openPermissionDialog(user)} disabled={loading}>
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="outline" onClick={() => openEditDialog(user)} disabled={loading}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => openDeleteDialog(user)}
                              disabled={loading}
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
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <div className="text-lg font-medium">Total Users</div>
                <div className="text-3xl font-bold mt-1">{users.length}</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-lg font-medium">Active Users</div>
                <div className="text-3xl font-bold mt-1 text-green-600">
                  {users.filter(u => u.status === 'Active').length}
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-lg font-medium">Banned Accounts</div>
                <div className="text-3xl font-bold mt-1 text-destructive">
                  {users.filter(u => u.status === 'Banned').length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AlertDialog open={dialogOpen && dialogAction !== "edit"} onOpenChange={setDialogOpen}>
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
            <Form {...permissionForm}>
              <form onSubmit={permissionForm.handleSubmit(executeAction)} className="py-4">
                <FormField
                  control={permissionForm.control}
                  name="permissions"
                  render={() => (
                    <FormItem>
                      <div className="space-y-4">
                        {availablePermissions.map((perm) => (
                          <FormField
                            key={perm.id}
                            control={permissionForm.control}
                            name="permissions"
                            render={({ field }) => (
                              <FormItem
                                key={perm.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(perm.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, perm.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== perm.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {perm.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeAction}
              className={dialogAction === "delete" ? "bg-destructive hover:bg-destructive/90" : ""}
              disabled={loading}
            >
              {dialogAction === "delete" ? "Delete" : 
               dialogAction === "lock" ? "Lock Account" :
               dialogAction === "unlock" ? "Unlock Account" :
               "Update Permissions"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[100vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddUser)} className="space-y-4 py-2">
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@school.edu" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addForm.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <FormControl>
                      <div
                        className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center ${
                          dragActive ? "bg-muted/80" : "bg-muted/50"
                        }`}
                        onDragOver={(e) => handleDragOver(e)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, addForm)}
                      >
                        {previewImage ? (
                          <div className="relative">
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="max-h-48 mx-auto object-contain"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => handleFileChange(null, addForm)}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">
                              Drag and drop an image here or click to upload
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Only one image (PNG, JPG)
                            </p>
                            <Input
                              id="image-upload-add"
                              type="file"
                              accept="image/png,image/jpeg"
                              onChange={(e) => handleInputFileChange(e, addForm)}
                              className="hidden"
                            />
                            <Button
                              variant="outline"
                              className="mt-4"
                              onClick={() =>
                                document.getElementById("image-upload-add")?.click()
                              }
                              disabled={loading}
                            >
                              Select Image
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addForm.control}
                name="roles"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Roles</FormLabel>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {availableRoles.map((role) => (
                        <FormField
                          key={role.id}
                          control={addForm.control}
                          name="roles"
                          render={({ field }) => (
                            <FormItem
                              key={role.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(role.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, role.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== role.id
                                          )
                                        );
                                  }}
                                  disabled={loading}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {role.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addForm.control}
                name="className"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class/Department</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="10A or Science Department"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addForm.control}
                name="thClass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TH Class</FormLabel>
                    <FormControl>
                      <Input placeholder="TH101" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddUserDialogOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  Save User
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={dialogOpen && dialogAction === "edit"} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...updateForm}>
            <form onSubmit={updateForm.handleSubmit(onUpdateUser)} className="space-y-4 py-2">
              <FormField
                control={updateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={updateForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@school.edu" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={updateForm.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <FormControl>
                      <div
                        className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center ${
                          dragActive ? "bg-muted/80" : "bg-muted/50"
                        }`}
                        onDragOver={(e) => handleDragOver(e)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, updateForm)}
                      >
                        {previewImage ? (
                          <div className="relative">
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="max-h-48 mx-auto object-contain"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => handleFileChange(null, updateForm)}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">
                              Drag and drop an image here or click to upload
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Only one image (PNG, JPG)
                            </p>
                            <Input
                              id="image-upload-edit"
                              type="file"
                              accept="image/png,image/jpeg"
                              onChange={(e) => handleInputFileChange(e, updateForm)}
                              className="hidden"
                            />
                            <Button
                              variant="outline"
                              className="mt-4"
                              onClick={() =>
                                document.getElementById("image-upload-edit")?.click()
                              }
                              disabled={loading}
                            >
                              Select Image
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={updateForm.control}
                name="roles"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Roles</FormLabel>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {availableRoles.map((role) => (
                        <FormField
                          key={role.id}
                          control={updateForm.control}
                          name="roles"
                          render={({ field }) => (
                            <FormItem
                              key={role.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(role.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, role.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== role.id
                                          )
                                        )
                                  }}
                                  disabled={loading}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {role.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={updateForm.control}
                name="className"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class/Department</FormLabel>
                    <FormControl>
                      <Input placeholder="10A or Science Department" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default AdminUsers;