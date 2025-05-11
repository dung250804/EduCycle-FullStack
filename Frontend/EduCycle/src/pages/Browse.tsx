import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ItemCard from "@/components/ItemCard";
import { ItemType } from "@/types/user";
import CategoryFilter from "@/components/CategoryFilter";
import { categories } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeftRight, HandHeart, DollarSign } from "lucide-react";
import type { Post } from "@/types/user";
import debounce from "lodash/debounce"; // Import lodash debounce (install via npm install lodash)

const Browse = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [fullPosts, setFullPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ItemType | null>(null);
  const [loading, setLoading] = useState(false); // Add loading state for better UX

  // Fetch data from API with query parameters
  const fetchData = useCallback(async (query: string, category: string | null, type: ItemType | null) => {
    setLoading(true);
    try {
      // Build query string for API
      const params = new URLSearchParams();
      if (query) params.append("search", query);
      if (category) params.append("category", category);
      if (type) params.append("type", type);

      const postRes = await fetch(`http://localhost:8080/api/posts?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      if (postRes.ok) {
        const postData = await postRes.json();
        setFullPosts(postData);
      } else {
        console.error("Post Response Status:", postRes.status, postRes.statusText);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search handler
  const debouncedFetchData = useCallback(
    debounce((query: string, category: string | null, type: ItemType | null) => {
      fetchData(query, category, type);
    }, 500), // 500ms debounce delay
    [fetchData]
  );

  // Fetch data on initial load and when filters change
  useEffect(() => {
    fetchData(searchQuery, selectedCategory, selectedType);
  }, [selectedCategory, selectedType, fetchData]); // Dependencies for category and type

  // Handle search query changes with debounce
  useEffect(() => {
    debouncedFetchData(searchQuery, selectedCategory, selectedType);
    return () => {
      debouncedFetchData.cancel(); // Cleanup debounce on unmount
    };
  }, [searchQuery, selectedCategory, selectedType, debouncedFetchData]);

  // Reset filters handler
  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setSelectedType(null);
    fetchData("", null, null); // Fetch all posts on reset
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Browse Items</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-3">Search</h2>
                <div className="relative">
                  <Input
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                    disabled={loading}
                  />
                </div>
              </div>

              <CategoryFilter
                categories={categories.map((c) => c.name)}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              <div className="mb-6">
                <h2 className="text-lg font-medium mb-3">Item Type</h2>
                <div className="flex flex-col gap-2">
                  <Button
                    variant={selectedType === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(null)}
                    className="justify-start"
                    disabled={loading}
                  >
                    All Types
                  </Button>
                  <Button
                    variant={selectedType === "Liquidation" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType("Liquidation")}
                    className="justify-start"
                    disabled={loading}
                  >
                    <DollarSign className="h-4 w-4 mr-2" /> For Sale
                  </Button>
                  <Button
                    variant={selectedType === "Exchange" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType("Exchange")}
                    className="justify-start"
                    disabled={loading}
                  >
                    <ArrowLeftRight className="h-4 w-4 mr-2" /> For Exchange
                  </Button>
                </div>
              </div>

              <Button variant="outline" onClick={handleResetFilters} disabled={loading}>
                Reset Filters
              </Button>
            </div>
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : fullPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullPosts.map((post) => (
                  <ItemCard key={post.postId || "none"} {...post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium">No items found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your filters or search query.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Browse;