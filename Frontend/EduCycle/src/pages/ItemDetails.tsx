import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, DollarSign, MessageCircle, Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ExchangeRequestDialog from "@/components/ExchangeRequestDialog";
import type { Post } from "@/types/user";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ItemDetails = () => {
  const [post, setPost] = useState<Post | null>(null);
  const { toast } = useToast();
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      const postId = localStorage.getItem("postId");

      try {
        const postRes = await fetch(`http://localhost:8080/api/posts/${postId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });

        if (postRes.ok) {
          const postData = await postRes.json();
          setPost(postData);
        } else {
          console.error("Post Response Status:", postRes.status, postRes.statusText);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, []);

  if (!post) {
    return <div>Loading...</div>;
  }

  const handleBuyNow = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/transactions/create?postId=${post.postId}&userId=${localStorage.getItem("userId")}&type=Liquidation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      if (response.ok) {
        toast({
          title: "Purchase initiated",
          description: "Your transaction has been created successfully.",
        });
      } else {
        throw new Error("Failed to create transaction");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to initiate purchase. Please try again.",
        variant: "destructive",
      });
      console.error("Transaction error:", err);
    }
  };

  const handleRequestExchange = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/transactions/create?postId=${post.postId}&userId=${localStorage.getItem("userId")}&type=Exchange`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      if (response.ok) {
        toast({
          title: "Exchange requested",
          description: "Your exchange request has been submitted.",
        });
        setShowExchangeDialog(false);
      } else {
        throw new Error("Failed to create transaction");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to request exchange. Please try again.",
        variant: "destructive",
      });
      console.error("Transaction error:", err);
    }
  };

  const handleContactSeller = () => {
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${post.item.owner.name}.`,
    });
  };

  const handleReportItem = () => {
    toast({
      title: "Report submitted",
      description: "Thank you for helping keep EduCycle safe.",
    });
  };

  const getTypeIcon = () => {
    switch (post.type) {
      case "Liquidation":
        return <DollarSign className="h-4 w-4" />;
      case "Exchange":
        return <ArrowLeftRight className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTypeText = () => {
    switch (post.type) {
      case "Liquidation":
        return "For Sale";
      case "Exchange":
        return "For Exchange";
      default:
        return post.type;
    }
  };

  const getTypeColor = () => {
    switch (post?.type) {
      case "Liquidation":
        return "bg-educycle-blue text-white";
      case "Exchange":
        return "bg-educycle-yellow text-black";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const isExchangeItem = post?.type === "Exchange";
  const isSaleItem = post?.type === "Liquidation";

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <div className="container py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left column - Item image */}
          <div>
            <div className="rounded-lg overflow-hidden">
              <img
                src={post?.item?.imageUrl || "/placeholder.svg"}
                alt={post?.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right column - Item details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Badge className={getTypeColor()}>
                  <span className="flex items-center gap-1">
                    {getTypeIcon()}
                    {getTypeText()}
                  </span>
                </Badge>
                <Badge variant="outline">{post.status}</Badge>
              </div>
              <h1 className="text-3xl font-bold mt-2">{post.title}</h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <span>Category: {post.item.category.name}</span>
                <span>•</span>
                <span>Type: {post.item.category.name}</span>
              </div>
            </div>

            {isSaleItem && (
              <div className="text-3xl font-bold">${post.price.toFixed(2)}</div>
            )}

            <div>
              <h2 className="font-medium mb-2">Description</h2>
              <p className="text-muted-foreground">{post.description}</p>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={post.item.owner.avatar} alt={post.item.owner.name} />
                      <AvatarFallback>{post.item.owner.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h3 className="font-medium">{post.item.owner.name}</h3>
                    <p className="text-sm text-muted-foreground">Seller</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {isSaleItem && post.status === "Approved" && (
                <Button className="w-full" onClick={handleBuyNow}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Buy Now
                </Button>
              )}

              {isExchangeItem && (
                <Button className="w-full" onClick={() => setShowExchangeDialog(true)}>
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  Request Exchange
                </Button>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleContactSeller}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Seller
                </Button>
                <Button variant="outline" onClick={handleReportItem}>
                  <Flag className="h-4 w-4 mr-2" />
                  Report Item
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>

      <ExchangeRequestDialog
        isOpen={showExchangeDialog}
        onClose={() => setShowExchangeDialog(false)}
        recipientId={post.item.owner.userId}
        itemId={post.postId}
        itemName={post.title}
        onSubmit={handleRequestExchange}
      />
    </div>
  );
};

export default ItemDetails;