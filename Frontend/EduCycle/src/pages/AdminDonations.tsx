
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
import { Search, CheckCircle, XCircle, FileText } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

// Mock fundraising/donation activities data
const mockActivities = [
  {
    id: "FUN001",
    name: "School Library Books",
    type: "fundraising",
    organizer: "School Council",
    dateStart: "2024-05-01",
    dateEnd: "2024-06-01",
    status: "active",
    totalRaised: 1250,
    participants: 32,
    target: 2000,
  },
  {
    id: "DON002",
    name: "Winter Clothing Drive",
    type: "donation",
    organizer: "Student Council",
    dateStart: "2024-05-10",
    dateEnd: "2024-05-30",
    status: "pending",
    totalRaised: 0,
    participants: 0,
    target: null,
  },
  {
    id: "FUN003",
    name: "Science Lab Equipment",
    type: "fundraising",
    organizer: "Science Club",
    dateStart: "2024-04-15",
    dateEnd: "2024-05-15",
    status: "active",
    totalRaised: 875,
    participants: 18,
    target: 1500,
  },
  {
    id: "DON004",
    name: "School Supplies Drive",
    type: "donation",
    organizer: "Teachers Association",
    dateStart: "2024-03-01",
    dateEnd: "2024-04-01",
    status: "completed",
    totalRaised: null,
    participants: 56,
    target: null,
  },
  {
    id: "FUN005",
    name: "Sports Equipment Fundraiser",
    type: "fundraising",
    organizer: "Athletics Department",
    dateStart: "2024-04-01",
    dateEnd: "2024-05-01",
    status: "rejected",
    totalRaised: 0,
    participants: 0,
    target: 3000,
  },
];

const AdminDonations = () => {
  const { toast } = useToast();
  const [activities, setActivities] = useState(mockActivities);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [dialogAction, setDialogAction] = useState<"approve" | "reject" | "view" | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    // Search filter
    const searchMatch = 
      activity.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const typeMatch = filterType ? activity.type === filterType : true;
    
    // Status filter
    const statusMatch = filterStatus ? activity.status === filterStatus : true;
    
    return searchMatch && typeMatch && statusMatch;
  });

  // Action handlers
  const openApprovalDialog = (activity: any) => {
    setSelectedActivity(activity);
    setDialogAction("approve");
    setDialogOpen(true);
  };

  const openRejectDialog = (activity: any) => {
    setSelectedActivity(activity);
    setDialogAction("reject");
    setDialogOpen(true);
  };

  const openViewDialog = (activity: any) => {
    setSelectedActivity(activity);
    setDialogAction("view");
    setDialogOpen(true);
  };

  const executeAction = () => {
    if (!selectedActivity || !dialogAction) return;

    // Implementation would connect to backend in a real app
    if (dialogAction === "approve") {
      setActivities(activities.map(activity => 
        activity.id === selectedActivity.id ? {...activity, status: "active"} : activity
      ));
      toast({
        title: "Activity Approved",
        description: `${selectedActivity.name} has been approved and is now active.`
      });
    } else if (dialogAction === "reject") {
      setActivities(activities.map(activity => 
        activity.id === selectedActivity.id ? {...activity, status: "rejected"} : activity
      ));
      toast({
        title: "Activity Rejected",
        description: `${selectedActivity.name} has been rejected.`
      });
    }

    setDialogOpen(false);
    setSelectedActivity(null);
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
              <h1 className="text-3xl font-bold">Donation & Fundraising Management</h1>
            </div>
            
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by ID, name, or organizer..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              
              <div>
                <select 
                  className="w-full h-10 rounded-md border border-input px-3 py-2"
                  onChange={(e) => setFilterType(e.target.value || null)}
                >
                  <option value="">All Types</option>
                  <option value="fundraising">Fundraising</option>
                  <option value="donation">Donation</option>
                </select>
              </div>
              
              <div>
                <select 
                  className="w-full h-10 rounded-md border border-input px-3 py-2"
                  onChange={(e) => setFilterStatus(e.target.value || null)}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending Approval</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            {/* Activity Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-32">
                        No activities found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.id}</TableCell>
                        <TableCell>{activity.name}</TableCell>
                        <TableCell className="capitalize">{activity.type}</TableCell>
                        <TableCell>{activity.organizer}</TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div>Start: {new Date(activity.dateStart).toLocaleDateString()}</div>
                            <div>End: {new Date(activity.dateEnd).toLocaleDateString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            activity.status === 'active' ? 'bg-educycle-green/10 text-educycle-green' :
                            activity.status === 'pending' ? 'bg-educycle-yellow/10 text-educycle-yellow' :
                            activity.status === 'completed' ? 'bg-educycle-blue/10 text-educycle-blue' :
                            'bg-destructive/10 text-destructive'
                          }`}>
                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {activity.type === "fundraising" && activity.target ? (
                            <div className="text-sm">
                              <div className="flex justify-between text-xs mb-1">
                                <span>${activity.totalRaised || 0}</span>
                                <span>${activity.target}</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-educycle-green" 
                                  style={{ width: `${Math.min(100, (activity.totalRaised / activity.target) * 100)}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {activity.participants} participants
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">
                              {activity.status === "completed" ? `${activity.participants} participants` : "Not started yet"}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {activity.status === "pending" && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-educycle-green hover:bg-educycle-green/10"
                                  onClick={() => openApprovalDialog(activity)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-destructive hover:bg-destructive/10"
                                  onClick={() => openRejectDialog(activity)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" /> Reject
                                </Button>
                              </>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openViewDialog(activity)}
                            >
                              <FileText className="h-4 w-4 mr-1" /> View
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
                Showing {filteredActivities.length} of {activities.length} activities
              </div>
              <div>
                Page 1 of 1
              </div>
            </div>
            
            {/* Stats Summary */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="border rounded-lg p-4">
                <div className="text-lg font-medium">Total Activities</div>
                <div className="text-3xl font-bold mt-1">{activities.length}</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-lg font-medium">Active</div>
                <div className="text-3xl font-bold mt-1 text-educycle-green">
                  {activities.filter(a => a.status === 'active').length}
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-lg font-medium">Pending</div>
                <div className="text-3xl font-bold mt-1 text-educycle-yellow">
                  {activities.filter(a => a.status === 'pending').length}
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-lg font-medium">Total Raised</div>
                <div className="text-3xl font-bold mt-1 text-educycle-blue">
                  ${activities.reduce((sum, act) => sum + (act.totalRaised || 0), 0)}
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
              {dialogAction === "approve" ? "Approve Activity" : 
               dialogAction === "reject" ? "Reject Activity" :
               "Activity Details"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogAction === "approve" ? 
                `Are you sure you want to approve "${selectedActivity?.name}"? This will make it visible to all users.` : 
               dialogAction === "reject" ? 
                `Are you sure you want to reject "${selectedActivity?.name}"? You may provide a reason for rejection.` :
                `Details for ${selectedActivity?.name}`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {dialogAction === "reject" && (
            <div className="py-4">
              <label className="text-sm font-medium">Reason for rejection</label>
              <textarea 
                className="w-full mt-2 p-3 border rounded-md h-24"
                placeholder="Please provide a reason for rejecting this activity"
              />
            </div>
          )}
          
          {dialogAction === "view" && selectedActivity && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Activity Type</p>
                    <p className="capitalize">{selectedActivity.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p className="capitalize">{selectedActivity.status}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Organizer</p>
                  <p>{selectedActivity.organizer}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Timeline</p>
                  <p>{new Date(selectedActivity.dateStart).toLocaleDateString()} to {new Date(selectedActivity.dateEnd).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-sm">
                    {selectedActivity.description || "No description provided. This would typically contain details about the purpose and goals of the activity."}
                  </p>
                </div>
                
                {selectedActivity.type === "fundraising" && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fundraising Goal</p>
                    <p>${selectedActivity.target} ({selectedActivity.totalRaised ? `${Math.round((selectedActivity.totalRaised / selectedActivity.target) * 100)}% complete` : '0% complete'})</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Participants</p>
                  <p>{selectedActivity.participants} users have participated so far</p>
                </div>
              </div>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {dialogAction === "view" ? (
              <AlertDialogAction onClick={() => setDialogOpen(false)}>
                Close
              </AlertDialogAction>
            ) : (
              <AlertDialogAction 
                onClick={executeAction}
                className={dialogAction === "reject" ? "bg-destructive hover:bg-destructive/90" : ""}
              >
                {dialogAction === "approve" ? "Approve Activity" : "Reject Activity"}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
};

export default AdminDonations;
