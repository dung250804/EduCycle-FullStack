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
import { ArrowLeftRight, DollarSign } from "lucide-react";
import type { Post } from "@/types/user";
import debounce from "lodash/debounce";

const Browse = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const initialCategoryId = categories.find((c) => c.name === initialCategory)?.id || initialCategory || null;

  const [fullPosts, setFullPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategoryId);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ItemType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (query: string, category: string | null, type: ItemType | null) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (query) params.append("search", query);
        if (type) params.append("type", type);

        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
          throw new Error("No JWT token found. Please log in.");
        }

        const url = category
          ? `http://localhost:8080/api/posts/category/${category}${
              params.toString() ? `?${params.toString()}` : ""
            }`
          : `http://localhost:8080/api/posts${params.toString() ? `?${params.toString()}` : ""}`;

        console.log("Fetching URL:", url);
        const postRes = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (postRes.ok) {
          const postData = await postRes.json();
          console.log("API Response:", postData);
          setFullPosts(postData);
        } else if (postRes.status === 401) {
          throw new Error("Unauthorized: Please log in again.");
        } else {
          throw new Error(`API error: ${postRes.status} ${postRes.statusText}`);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const debouncedFetchData = useCallback(
    debounce((query: string, category: string | null, type: ItemType | null) => {
      fetchData(query, category, type);
    }, 500),
    [fetchData]
  );

  useEffect(() => {
    console.log("Fetching with:", { searchQuery, selectedCategory, selectedType });
    fetchData(searchQuery, selectedCategory, selectedType);
  }, [selectedCategory, selectedType, fetchData]);

  useEffect(() => {
    debouncedFetchData(searchQuery, selectedCategory, selectedType);
    return () => {
      debouncedFetchData.cancel();
    };
  }, [searchQuery, selectedCategory, selectedType, debouncedFetchData]);

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setSelectedType(null);
    fetchData("", null, null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Browse Items</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-3">Search</h2>
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                  disabled={loading}
                />
              </div>
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(categoryId) => {
                  console.log("Selected Category ID:", categoryId);
                  setSelectedCategory(categoryId);
                }}
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
                {fullPosts
                  .filter((post) => post.type !== "Fundraiser")
                  .map((post) => (
                    <ItemCard key={post.postId || "none"} {...post} />
                  ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium">No items found</h3>
                <p className="text-muted-foreground mt-2">
                  {selectedCategory
                    ? `No items found for category "${
                        categories.find((c) => c.id === selectedCategory)?.name || selectedCategory
                      }".`
                    : "No items match the selected filters."}
                  Try adjusting your search or category.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Browse;