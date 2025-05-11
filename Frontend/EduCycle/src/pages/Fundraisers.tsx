import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FundraiserCard from "@/components/FundraiserCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { HandHeart, ShoppingCart } from "lucide-react";
import { ActivityType } from "@/types/user";

interface Item {
  itemName: string;
  description: string;
  imageUrl: string;
}

interface Post {
  postId: string;
  item: Item;
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

const Fundraisers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ActivityType | "all">("all");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userRole = localStorage.getItem("userRole");
  const isRepresentative = userRole?.includes("Representative");
  const isAdmin = userRole?.includes("Admin");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/activities");
        if (!response.ok) throw new Error("Failed to fetch activities");
        const data: Activity[] = await response.json();

        // Không cần fetch posts riêng vì posts đã có trong data
        setActivities(data);
      } catch (err) {
        setError("Error fetching fundraisers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const filteredFundraisers = activities.filter((fundraiser) => {
    const matchesSearch =
      fundraiser.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fundraiser.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fundraiser.organizer.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "Donation" && fundraiser.activityType === "Donation") ||
      (typeFilter === "Fundraiser" && fundraiser.activityType === "Fundraiser");

    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <div className="container py-8 text-center">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <div className="container py-8 text-center text-red-500">{error}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">School Fundraisers</h1>
            <p className="text-muted-foreground mt-1">Support important causes at our school</p>
          </div>
          <div className="w-full md:w-auto">
            <Input
              placeholder="Search fundraisers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64"
            />
          </div>
        </div>

        {(isRepresentative || isAdmin) && (
          <div className="bg-educycle-blue/10 rounded-lg p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-medium">Have a cause you care about?</h2>
              <p className="text-muted-foreground">Teachers and student clubs can start fundraising campaigns.</p>
            </div>
            <Link to="/create-activity">
              <Button>Start a Fundraiser</Button>
            </Link>
          </div>
        )}

        <div className="flex gap-2 mb-6">
          <Button
            variant={typeFilter === "all" ? "default" : "outline"}
            onClick={() => setTypeFilter("all")}
          >
            All Fundraisers
          </Button>
          <Button
            variant={typeFilter === "Donation" ? "default" : "outline"}
            onClick={() => setTypeFilter("Donation")}
            className="flex items-center gap-2"
          >
            <HandHeart className="h-4 w-4" />
            Post Donations
          </Button>
          <Button
            variant={typeFilter === "Fundraiser" ? "default" : "outline"}
            onClick={() => setTypeFilter("Fundraiser")}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Purchase Items
          </Button>
        </div>

        {filteredFundraisers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFundraisers.map((fundraiser) => (
              <div key={fundraiser.activityId}>
                <FundraiserCard
                  id={fundraiser.activityId}
                  title={fundraiser.title}
                  description={fundraiser.description}
                  goalAmount={fundraiser.goalAmount}
                  amountRaised={fundraiser.amountRaised}
                  image={fundraiser.image}
                  organizer={fundraiser.organizer.name}
                  endDate={new Date(fundraiser.endDate)}
                  participants={fundraiser.participants}
                  activityType={
                    fundraiser.activityType === "Donation" ? "Donation" : "Fundraiser"
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium">No fundraisers found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Fundraisers;