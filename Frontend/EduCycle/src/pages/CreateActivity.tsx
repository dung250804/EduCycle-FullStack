import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, Calendar } from "lucide-react";

interface ActivityFormData {
  name: string;
  type: "fundraising" | "donation";
  purpose: string;
  dateStart: string;
  dateEnd: string;
  location: string;
  itemTypes: string;
  target: string;
  image?: FileList;
}

// Load Cloudinary environment variables
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const CreateActivity = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // State for drag feedback

  const form = useForm<ActivityFormData>({
    defaultValues: {
      name: "",
      type: "fundraising",
      purpose: "",
      dateStart: "",
      dateEnd: "",
      location: "",
      itemTypes: "",
      target: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB) and type
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size must be less than 2MB",
          variant: "destructive",
        });
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please upload an image file (PNG, JPG)",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    try {
      // Step 1: Request a signature from the backend
      const timestamp = Math.round(new Date().getTime() / 1000).toString();
      const signatureResponse = await fetch("http://localhost:8080/api/cloudinary/signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ timestamp }),
      });

      if (!signatureResponse.ok) {
        throw new Error("Failed to get Cloudinary signature");
      }

      const { signature, timestamp: returnedTimestamp } = await signatureResponse.json();

      // Step 2: Upload the image to Cloudinary
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
      return data.secure_url; // Return the secure URL
    } catch (error) {
      throw new Error("Cloudinary upload failed: " + (error as Error).message);
    }
  };

  const onSubmit = async (data: ActivityFormData) => {
    setIsSubmitting(true);

    try {
      let imageUrl = "";
      if (data.image && data.image[0]) {
        imageUrl = await uploadToCloudinary(data.image[0]);
      }

      // Map form data to ActivityDTO
      const activityDTO = {
        title: data.name,
        description: data.purpose,
        goalAmount: data.type === "fundraising" ? parseFloat(data.target) : 0,
        amountRaised: 0,
        image: imageUrl || "https://www.whatdowedoallday.com/wp-content/uploads/2013/11/charity-fb.jpg",
        activityType: data.type === "fundraising" ? "Fundraiser" : "Donation",
        startDate: data.dateStart + "T00:00:00",
        endDate: data.dateEnd + "T23:59:59",
        organizerId: localStorage.getItem("userId") || "u3",
        location: data.location,
        itemTypes: data.type === "donation" ? data.itemTypes : "",
      };

      // Send POST request to backend
      const response = await fetch("http://localhost:8080/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(activityDTO),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create activity");
      }

      toast({
        title: "Activity Submitted",
        description: "Your activity has been submitted for approval.",
      });

      setTimeout(() => {
        navigate("/fundraisers");
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create activity. Please try again.",
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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Create a Fundraising/Donation Activity</h1>
          <p className="text-muted-foreground mb-6">
            Fill out this form to start a new fundraising or donation activity for your school.
            All activities require approval before being published.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Activity Name */}
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Activity name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a clear, descriptive name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a name that clearly describes your activity
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Activity Type */}
              <FormField
                control={form.control}
                name="type"
                rules={{ required: "Activity type is required" }}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Activity Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fundraising" id="fundraising" />
                          <FormLabel htmlFor="fundraising" className="font-normal cursor-pointer">
                            Fundraising - Collect money for a specific cause
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="donation" id="donation" />
                          <FormLabel htmlFor="donation" className="font-normal cursor-pointer">
                            Donation - Collect physical items for a cause
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Purpose */}
              <FormField
                control={form.control}
                name="purpose"
                rules={{ required: "Purpose description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what this activity is for and who it will benefit"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be specific about how funds or donations will be used
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="dateStart"
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type="date" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateEnd"
                  rules={{
                    required: "End date is required",
                    validate: (value) => {
                      const start = form.getValues("dateStart");
                      return (
                        !start ||
                        new Date(value) >= new Date(start) ||
                        "End date must be after start date"
                      );
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type="date" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Activity Image */}
              <FormField
                control={form.control}
                name="image"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Activity Image</FormLabel>
                    <FormControl>
                      <div
                        className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 transition-colors ${
                          isDragging ? "border-blue-500 bg-blue-50" : ""
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          const files = e.dataTransfer.files;
                          if (files && files.length > 0) {
                            onChange(files);
                            handleImageChange({
                              target: { files },
                            } as React.ChangeEvent<HTMLInputElement>);
                          }
                        }}
                      >
                        {imagePreview ? (
                          <div className="mb-4">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-h-48 rounded-md"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center p-4">
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground mb-1">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG (max. 2MB)
                            </p>
                          </div>
                        )}
                        <Input
                          type="file"
                          accept="image/png,image/jpeg"
                          className={imagePreview ? "" : "sr-only"}
                          onChange={(e) => {
                            if (e.target.files) {
                              onChange(e.target.files);
                              handleImageChange(e);
                            }
                          }}
                          {...fieldProps}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload an image that represents your activity
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                rules={{ required: "Location is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Where will this activity take place?" {...field} />
                    </FormControl>
                    <FormDescription>
                      Specify where donations can be dropped off or events will be held
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Item Types (for donation) or Fundraising Target (for fundraising) */}
              {form.watch("type") === "donation" ? (
                <FormField
                  control={form.control}
                  name="itemTypes"
                  rules={{ required: "Item types are required for donations" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Types of Items Needed</FormLabel>
                      <FormControl>
                        <Input placeholder="Books, clothing, school supplies, etc." {...field} />
                      </FormControl>
                      <FormDescription>
                        List the types of items you're collecting
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="target"
                  rules={{ required: "Fundraising target is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fundraising Target ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" min="1" step="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Set a realistic fundraising goal amount
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Activity for Review"}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Your activity will be reviewed by an administrator before being published
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateActivity;