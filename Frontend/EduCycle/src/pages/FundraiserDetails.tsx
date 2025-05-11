import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ItemCard from "@/components/ItemCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Users, 
  Clock, 
  MapPin, 
  Award,
  DollarSign,
  HandHeart,
  ShoppingCart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Item {
  itemName: string;
  description: string;
  imageUrl: string;
}

interface Post {
  postId: string;
  title: string;  
  item: Item
  price?: number; // Added for ItemSale
}

interface Activity {
  activityId: string;
  title: string;
  description: string;
  goalAmount: number;
  amountRaised: number;
  image: string;
  organizerId: string;
  activityType: "Donation" | "Fundraiser";
  endDate: string;
  posts?: Post[];
  organizer: { name: string };
  participants: number;
}

export type ActivityType = "Donation" | "Fundraiser";

const FundraiserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [donationDescription, setDonationDescription] = useState("");
  const [donationCompleted, setDonationCompleted] = useState(false);
  const [donationCode, setDonationCode] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    const fetchActivity = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!id) {
          throw new Error('No activity ID found in localStorage');
        }

        // Make API call
        const response = await fetch(`http://localhost:8080/api/activities/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add any necessary authorization headers
            // 'Authorization': `Bearer ${yourToken}`
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch activity');
        }

        const data: Activity = await response.json();
        setActivity(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [id]);
  
  if (!activity) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <div className="container flex-1 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Fundraiser Not Found</h1>
          <p className="mb-8">The fundraiser you're looking for doesn't exist or has been removed.</p>
          <Link to="/fundraisers">
            <Button>Return to Fundraisers</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  const percentage = Math.min(100, Math.round((activity.amountRaised / activity.goalAmount) * 100));
  
  const handleSubmitDonation = () => {
    // Only for item donations
    if (activity.activityType !== "Donation") return;
    
    const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    setDonationCode(randomCode);
    setDonationCompleted(true);
    
    toast({
      title: "Thank you for your donation!",
      description: `Your donation code is ${randomCode}. Please use this when delivering your donation.`,
    });
  };

  const handlePurchaseItem = (item: any) => {
    setSelectedItem(item);
    setShowPurchaseModal(true);
  };

  const completePurchase = async () => {
  try {
    // Calculate the total amount for this purchase
    const purchaseAmount = selectedItem.price * quantity;

    // Update amountRaised in the database
    await updateAmountRaisedInDatabase(purchaseAmount);

    // Update local activity state to reflect new amountRaised
    setActivity((prev) =>
      prev ? { ...prev, amountRaised: prev.amountRaised + purchaseAmount } : prev
    );

    // Show success toast
    toast({
      title: "Purchase successful!",
      description: `Thank you for purchasing ${selectedItem.title} and supporting this fundraiser.`,
    });

    // Close the purchase modal
    setShowPurchaseModal(false);
    setQuantity(1); // Reset quantity after purchase
  } catch (error) {
    console.error("Error completing purchase:", error);
    toast({
      title: "Error",
      description: "Failed to complete purchase. Please try again.",
      variant: "destructive",
    });
  }
};

// Function to update amountRaised in the database
const updateAmountRaisedInDatabase = async (purchaseAmount: number) => {
  const response = await fetch(`http://localhost:8080/api/activities/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amountRaised: activity!.amountRaised + purchaseAmount, // Send new total
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update amountRaised in database");
  }

  return response.json();
};

  const getFundraiserTypeIcon = () => {
    return activity.activityType === "Donation" ? 
      <HandHeart className="h-5 w-5" /> : 
      <ShoppingCart className="h-5 w-5" />;
  };

  const getFundraiserTypeText = () => {
    return activity.activityType === "Donation" ? 
      "Post Donation Fundraiser" : 
      "Purchase Items Fundraiser";
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Fundraiser details */}
          <div className="flex-1">
            <Link to="/fundraisers" className="text-sm text-muted-foreground hover:text-foreground flex items-center mb-4">
              ← Back to all fundraisers
            </Link>
            
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{activity.title}</h1>
                <Badge className={activity.activityType === "Donation" ? "bg-educycle-green" : "bg-educycle-blue"}>
                  <span className="flex items-center gap-1 text-white">
                    {getFundraiserTypeIcon()}
                    {getFundraiserTypeText()}
                  </span>
                </Badge>
              </div>
              <p className="text-muted-foreground">Organized by {activity.organizer.name}</p>
            </div>
            
            <div className="mb-6">
              <img 
                src={activity.image} 
                alt={activity.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">About This Fundraiser</h2>
              <p className="mb-4">{activity.description}</p>
              <p>
                This fundraiser aims to help our school community by raising funds for important resources. 
                Your contribution, no matter how small, will make a significant impact.
              </p>
            </div>

            {/* Display items for sale if this is an ItemSale fundraiser */}
            {activity.activityType === "Fundraiser" && activity.posts && activity.posts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Items For Sale</h2>
                <p className="mb-4">Purchase these items to support our fundraiser:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activity.posts?.map((post) => (
                    <div key={post.postId} className="border rounded-lg p-4 flex gap-4">
                      <img 
                        src={post.item.imageUrl || "/placeholder.svg"} 
                        alt={post.title} 
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{post.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{post.item.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-bold">${post.price.toFixed(2)}</span>
                          <Button size="sm" onClick={() => handlePurchaseItem(post)}>
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Dates</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString()} - {activity.endDate}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Participants</h3>
                  <p className="text-sm text-muted-foreground">{activity.participants} people have contributed</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-sm text-muted-foreground">School Main Hall & Online</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Status</h3>
                  <p className="text-sm text-muted-foreground">Active - Accepting {activity.activityType === "Donation" ? "Donation" : "Fundraiser"}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Progress and donation */}
          <div className="lg:w-96">
            <div className="border rounded-lg p-6 sticky top-6">
              {activity.activityType === "Fundraiser" ? (
                <>
                  <h2 className="text-xl font-semibold mb-4">Fundraising Progress</h2>
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">${activity.amountRaised}</span>
                      <span className="text-muted-foreground">Goal: ${activity.goalAmount}</span>
                    </div>
                    <Progress value={percentage} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-2">{percentage}% of our goal</p>
                  </div>
                </>
              ) : (
                <h2 className="text-xl font-semibold mb-4">Donate Items</h2>
              )}
              
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{activity.participants} supporters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {isNaN(new Date(activity.endDate).getTime())
                        ? "Invalid date"
                        : Math.ceil((new Date(activity.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                    </span>
                  </div>
                </div>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full mb-4">
                    {activity.activityType === "Donation" ? "Donate Items" : "View Available Items"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  {!donationCompleted ? (
                    <>
                      <DialogHeader>
                        <DialogTitle>
                          {activity.activityType === "Donation" ? "Donate Items" : "Available Items"}
                        </DialogTitle>
                        <DialogDescription>
                          {activity.activityType === "Donation" 
                            ? "Please provide details about the items you'd like to donate."
                            : "Select items to purchase and support this fundraiser."
                          }
                        </DialogDescription>
                      </DialogHeader>
                      
                      {activity.activityType === "Donation" ? (
                        <div className="space-y-4 py-4">
                          <div>
                            <label className="text-sm font-medium">Type of item(s) to donate</label>
                            <Input 
                              placeholder="Books, clothing, school supplies, etc."
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Description</label>
                            <Textarea 
                              placeholder="Brief description of the items you'll be donating"
                              className="mt-1"
                              value={donationDescription}
                              onChange={(e) => setDonationDescription(e.target.value)}
                            />
                          </div>
                          
                          <DialogFooter>
                            <Button onClick={handleSubmitDonation}>
                              Get Donation Code
                            </Button>
                          </DialogFooter>
                        </div>
                      ) : (
                        <div className="space-y-4 py-4">
                          {activity.posts && activity.posts.map((post) => (
                            <div key={post.postId} className="flex items-center gap-4 p-4 border rounded-lg">
                              <img 
                                src={post.item.imageUrl || "/placeholder.svg"} 
                                alt={post.title} 
                                className="w-20 h-20 object-cover rounded-md"
                              />
                              <div className="flex-1">
                                <h3 className="font-medium">{post.title}</h3>
                                <p className="text-sm text-muted-foreground">{post.item.description}</p>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="font-bold">${post.price.toFixed(2)}</span>
                                  <Button size="sm" onClick={() => handlePurchaseItem(post)}>
                                    Purchase
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <DialogHeader>
                        <DialogTitle>Thank You!</DialogTitle>
                        <DialogDescription>
                          Your contribution will help our school community.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="py-6 flex flex-col items-center justify-center">
                        <div className="mb-4">
                          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto">
                            <Award className="h-8 w-8 text-educycle-green" />
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-medium text-center mb-2">
                          Your Donation Code
                        </h3>
                        
                        <div className="mb-6 text-center">
                          <div className="text-2xl font-bold mb-2 tracking-wide text-educycle-blue">
                            {donationCode}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Present this code when delivering your donation to the collection point
                          </p>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button 
                          onClick={() => setDonationCompleted(false)}
                          variant="outline"
                          className="w-full"
                        >
                          Close
                        </Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" className="w-full">Share This Fundraiser</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Post Modal */}
      {selectedItem && (
        <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Purchase Post</DialogTitle>
              <DialogDescription>
                Complete your purchase to support this fundraiser.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="flex gap-4 mb-4">
                <img 
                  src={selectedItem.item.imageUrl || "/placeholder.svg"} 
                  alt={selectedItem.title} 
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-medium">{selectedItem.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                  <p className="font-bold mt-1">${selectedItem.price.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Payment Method</label>
                  <select className="w-full p-2 border rounded-md mt-1">
                    <option>Credit Card</option>
                    <option>PayPal</option>
                    <option>School Account</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Quantity</label>
                  <Input 
                    type="number" 
                    min="1" 
                    defaultValue="1" 
                    className="mt-1"
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Additional Comments</label>
                  <Textarea 
                    placeholder="Any special requests or notes"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPurchaseModal(false)}>Cancel</Button>
              <Button onClick={completePurchase}>Complete Purchase</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      <Footer />
    </div>
  );
};


export default FundraiserDetails;
