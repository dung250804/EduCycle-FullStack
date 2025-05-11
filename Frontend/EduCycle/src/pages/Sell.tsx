import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, DollarSign, ArrowLeftRight } from "lucide-react";
import { categories } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

// Load environment variable
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const Sell = () => {
  const { toast } = useToast();
  const [itemType, setItemType] = useState<"sale" | "exchange">("sale");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    exchangePreferences: "",
    imageUrl: "",
    owner: localStorage.getItem("userId") || "",
    categoryId: "",
  });
  const [imageData, setImageData] = useState({
    image: null as File | null,
    api_key: "",
    timestamp: "",
    signature: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (file: File | null) => {
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
      setFormData((prev) => ({ ...prev, imageUrl: "" }));
    }
  };

  const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
      categoryId: value,
    }));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    try {
      // Step 1: Request a signature from the backend
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

      // Step 2: Upload the image to Cloudinary with the signature
      const imageData = new FormData();
      imageData.append("file", file);
      imageData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
      imageData.append("timestamp", returnedTimestamp);
      imageData.append("signature", signature);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: imageData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const data = await uploadResponse.json();
      return data.secure_url; // Return the secure URL of the uploaded image
    } catch (error) {
      throw new Error("Cloudinary upload failed: " + (error as Error).message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    console.log("formData.category:", formData.category);
    console.log("categories:", categories);
    // Validate category
    if (!formData.category || !categories.find((cat) => cat.id === formData.category)) {
      throw new Error("Please select a valid category");
    }

    let imageUrl = formData.imageUrl;
    if (imageData.image) {
      // Upload image to Cloudinary and get the URL
      imageUrl = await uploadToCloudinary(imageData.image);
    }

    // Prepare the payload as a JSON object
    const payload = {
      title: formData.title,
      description: formData.description,
      sellerId: formData.owner,
      categoryId: formData.category,
      ...(itemType === "sale" && { price: parseFloat(formData.price) }),
      ...(imageUrl && { imageUrl }),
      type: itemType === "sale" ? "Liquidation" : "Exchange",
      status: "Pending",
      state: "Pending",
    };
    console.log("Payload:", JSON.stringify(payload, null, 2));
    const response = await fetch("http://localhost:8080/api/posts", { 
      method: "POST",
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

    // Reset form
    setFormData({
      title: "",
      category: "",
      description: "",
      price: "",
      exchangePreferences: "",
      imageUrl: "",
      owner: localStorage.getItem("userId") || "",
      categoryId: "",
    });
    setImageData({ image: null, api_key: "", timestamp: "", signature: "" });
    setPreviewImage(null);
    setItemType("sale");
  } catch (error) {
    toast({
      title: "Error",
      description: error.message || "Failed to submit listing. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Create a New Listing</h1>
          <p className="text-muted-foreground mb-6">Fill out the form below to list your item.</p>
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
              <CardDescription>
                Provide clear information about your item to help others find it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="listing-type">Listing Type</Label>
                    <RadioGroup
                      defaultValue="sale"
                      value={itemType}
                      onValueChange={(value) => setItemType(value as "sale" | "exchange")}
                      className="flex flex-col sm:flex-row gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sale" id="sale" />
                        <Label htmlFor="sale" className="flex items-center gap-1 cursor-pointer">
                          <DollarSign className="h-4 w-4" /> For Sale
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="exchange" id="exchange" />
                        <Label htmlFor="exchange" className="flex items-center gap-1 cursor-pointer">
                          <ArrowLeftRight className="h-4 w-4" /> For Exchange
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Give your listing a clear title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={handleCategoryChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your item in detail (condition, features, etc.)"
                      rows={5}
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {itemType === "sale" && (
                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  )}
                  {itemType === "exchange" && (
                    <div>
                      <Label htmlFor="exchangePreferences">Exchange Preferences</Label>
                      <Textarea
                        id="exchangePreferences"
                        placeholder="What are you looking to exchange this item for? List specific items or categories you're interested in."
                        rows={3}
                        value={formData.exchangePreferences}
                        onChange={handleInputChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Be specific about what you're willing to trade for. This helps potential exchangers know if their items match your interests.
                      </p>
                    </div>
                  )}
                  <div>
                    <Label>Photo</Label>
                    <div
                      className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center ${
                        dragActive ? "bg-muted/80" : "bg-muted/50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
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
                            onClick={() => handleFileChange(null)}
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
                            id="image-upload"
                            type="file"
                            accept="image/png,image/jpeg"
                            onChange={handleInputFileChange}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() =>
                              document.getElementById("image-upload")?.click()
                            }
                          >
                            Select Image
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit for Review"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    All listings are subject to review before being published.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Sell;