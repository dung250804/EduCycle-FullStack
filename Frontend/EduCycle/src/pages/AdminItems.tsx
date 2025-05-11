
import { useEffect, useState } from "react";
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
import { Search, CheckCircle, XCircle, Image, DollarSign, ArrowLeftRight, HandHeart } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import { Post, ItemType } from "@/types/user";
import { format } from "date-fns";

const AdminItems = () => {
  const [adminPosts, setFeaturedItems] = useState<Post[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await fetch("http://localhost:8080/api/posts  ", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });


        if (postRes.ok) {
          const postData = await postRes.json();
          setFeaturedItems(postData);
        } else {
          console.error("Post Response Status:", postRes.status, postRes.statusText);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, []);

  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedPost, setSelectedItem] = useState<Post | null>(null);
  const [dialogAction, setDialogAction] = useState<"approve" | "reject" | "view" | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter adminPosts
  const filteredItems = adminPosts.filter(post => {
    // Search filter
    const searchMatch = 
      post.postId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const typeMatch = filterType ? post.type === filterType : true;
    
    // Status filter
    const statusMatch = filterStatus ? post.status === filterStatus : true;
    
    return searchMatch && typeMatch && statusMatch;
  });

  // Get type icon
  const getTypeIcon = (type: ItemType) => {
    switch (type) {
      case "Liquidation":
        return <DollarSign className="h-4 w-4" />;
      case "Exchange":
        return <ArrowLeftRight className="h-4 w-4" />;
      case "Donation":
        return <HandHeart className="h-4 w-4" />;
    }
  };

  // Get type text
  const getTypeText = (type: ItemType) => {
    switch (type) {
      case "Liquidation":
        return "For Sale";
      case "Exchange":
        return "For Exchange";
      case "Donation":
        return "Free Donation";
    }
  };

  // Action handlers
  const openApprovalDialog = (post: Post) => {
    setSelectedItem(post);
    setDialogAction("approve");
    setDialogOpen(true);
  };

  const openRejectDialog = (post: Post) => {
    setSelectedItem(post);
    setDialogAction("reject");
    setDialogOpen(true);
  };

  const openViewDialog = (post: Post) => {
    setSelectedItem(post);
    setDialogAction("view");
    setDialogOpen(true);
  };

  const executeAction = async (e: React.FormEvent) => {
    if (!selectedPost || !dialogAction) return;
    
    // Implementation would connect to backend in a real app
    if (dialogAction === "approve") {
      try {
        setFeaturedItems(adminPosts.map(post => 
          post.postId === selectedPost.postId ? {...post, status: "Approved" as const} : post
        ));
        const updatedPost = adminPosts.find(post => post.postId === selectedPost.postId);
        toast({
          title: "Item Approved",
          description: `${selectedPost.title} has been approved and is now live.`
        });
        const payload = {
          itemName: updatedPost.title,
          description: updatedPost.description,
          sellerId: updatedPost.seller.userId,
          categoryId: updatedPost.item.category.categoryId,
          price: updatedPost.item.price,
          imageUrl: updatedPost.item.imageUrl,
          type: updatedPost.type === "Liquidation" ? "Liquidation" : "Exchange",
          status: "Approved",
          state: updatedPost.state, 
        };

        const response = await fetch(`http://localhost:8080/api/posts/${updatedPost.postId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    
        if (!response.ok) {
          throw new Error(`Failed to submit listing: ${response.statusText}`);
        }
    
        toast({
          title: "Listing submitted successfully!",
          description: "Your item is now pending review and will be published soon.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to submit listing. Please try again.",
          variant: "destructive",
        });    
      }
    } else if (dialogAction === "reject") {
      setFeaturedItems(adminPosts.map(post => 
        post.postId === selectedPost.postId ? {...post, status: "Rejected" as const} : post
      ));
      toast({
        title: "Item Rejected",
        description: `${selectedPost.title} has been rejected.`
      });
      try {
        const updatedPost = adminPosts.find(post => post.postId === selectedPost.postId);
        const payload = {
          itemName: updatedPost.title,
          description: updatedPost.description,
          sellerId: updatedPost.seller.userId,
          categoryId: updatedPost.item.category.categoryId,
          price: updatedPost.item.price,
          imageUrl: updatedPost.item.imageUrl,
          type: updatedPost.type === "Liquidation" ? "Liquidation" : "Exchange",
          status: "Rejected",
          state: updatedPost.state, 
        };

        const response = await fetch(`http://localhost:8080/api/posts/${updatedPost.postId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    
        if (!response.ok) {
          throw new Error(`Failed to submit listing: ${response.statusText}`);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to submit listing. Please try again.",
          variant: "destructive",
        });    
      }
    }

    setDialogOpen(false);
    setSelectedItem(null);
    setDialogAction(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <div className="container py-8 flex-1">
        <div className="flex">
          <AdminSidebar />
          
          <div className="flex-1 ml-6">
            <div className="flex justify-between adminPosts-center mb-6">
              <h1 className="text-3xl font-bold">Item Listings Management</h1>
            </div>
            
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by ID, title, or seller..." 
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
                  <option value="Liquidation">For Sale</option>
                  <option value="Exchange">For Exchange</option>
                  <option value="Donation">Donation</option>
                </select>
              </div>
              
              <div>
                <select 
                  className="w-full h-10 rounded-md border border-input px-3 py-2"
                  onChange={(e) => setFilterStatus(e.target.value || null)}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            {/* Items Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-32">
                        No adminPosts found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((post) => (
                      <TableRow key={post.postId}>
                        <TableCell className="font-medium">{post.postId}</TableCell>
                        <TableCell>
                          <div className="flex adminPosts-center gap-2">
                            <div className="w-10 h-10 rounded bg-muted flex adminPosts-center justify-center overflow-hidden">
                              {post.item.imageUrl ? (
                                <img 
                                  src={post.item.imageUrl} 
                                  alt={post.title} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Image className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium truncate max-w-[200px]">{post.title}</div>
                              {post.type === "Liquidation" && post.item.price && (
                                <div className="text-xs text-muted-foreground">${post.item.price.toFixed(2)}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex adminPosts-center gap-1">
                            {getTypeIcon(post.type)}
                            <span>{getTypeText(post.type)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{post.item.category.name}</TableCell>
                        <TableCell>{post.seller.name}</TableCell>
                        <TableCell>
                          {post.updatedAt ? format(new Date(post.updatedAt), "yyyy-MM-dd HH:mm:ss") : "N/A"}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex adminPosts-center px-2 py-1 rounded-full text-xs font-medium ${
                            post.status === 'Approved' ? 'bg-educycle-green/10 text-educycle-green' :
                            post.status === 'Pending' ? 'bg-educycle-yellow/10 text-educycle-yellow' :
                            'bg-destructive/10 text-destructive'
                          }`}>
                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {post.status === "Pending" && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-educycle-green hover:bg-educycle-green/10"
                                  onClick={() => openApprovalDialog(post)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-destructive hover:bg-destructive/10"
                                  onClick={() => openRejectDialog(post)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" /> Reject
                                </Button>
                              </>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openViewDialog(post)}
                            >
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 flex adminPosts-center justify-between text-sm text-muted-foreground">
              <div>
                Showing {filteredItems.length} of {adminPosts.length} adminPosts
              </div>
              <div>
                Page 1 of 1
              </div>
            </div>
            
            {/* Stats Summary */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <div className="text-lg font-medium">Total Items</div>
                <div className="text-3xl font-bold mt-1">{adminPosts.length}</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-lg font-medium">Pending Review</div>
                <div className="text-3xl font-bold mt-1 text-educycle-yellow">
                  {adminPosts.filter(post => post.status === 'Pending').length}
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-lg font-medium">Active Listings</div>
                <div className="text-3xl font-bold mt-1 text-educycle-green">
                  {adminPosts.filter(post => post.status === 'Approved').length}
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
              {dialogAction === "approve" ? "Approve Item" : 
               dialogAction === "reject" ? "Reject Item" :
               "Item Details"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogAction === "approve" ? 
                `Are you sure you want to approve "${selectedPost?.title}"? This will make it visible to all users.` : 
               dialogAction === "reject" ? 
                `Are you sure you want to reject "${selectedPost?.title}"? You may provide a reason for rejection.` :
                `Details for ${selectedPost?.title}`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {dialogAction === "view" && selectedPost && (
            <div className="py-4">
              <div className="overflow-hidden rounded-md mb-4">
                <img 
                  src={selectedPost.item.imageUrl || "https://via.placeholder.com/150"} 
                  alt={selectedPost.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <div className="flex adminPosts-center gap-1">
                    {getTypeIcon(selectedPost.type)}
                    <p className="capitalize">{getTypeText(selectedPost.type)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Price</p>
                  <p>{selectedPost.type === "Liquidation" && selectedPost.item.price ? `$${selectedPost.item.price.toFixed(2)}` : "N/A"}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p>{selectedPost.item.category.name}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Seller</p>
                  <p>{selectedPost.seller.name}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-sm">{selectedPost.description}</p>
                </div>
              </div>
            </div>
          )}
          
          {dialogAction === "reject" && (
            <div className="py-4">
              <label className="text-sm font-medium">Reason for rejection</label>
              <textarea 
                className="w-full mt-2 p-3 border rounded-md h-24"
                placeholder="Please provide a reason for rejecting this post"
              />
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
                {dialogAction === "approve" ? "Approve Item" : "Reject Item"}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
};

export default AdminItems;
