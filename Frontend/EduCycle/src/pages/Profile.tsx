import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, AlertTriangle, Star, UserCheck, ShoppingBag, Heart, Coins, ArrowLeftRight } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { User, Transaction, TransactionType } from "@/types/user";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import type { Post } from "@/types/user";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentTab, setCurrentTab] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast.error("User not logged in");
        navigate("/login");
        return;
      }

      try {
        const userRes = await fetch(`http://localhost:8080/api/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });

        const txRes = await fetch(`http://localhost:8080/api/users/${userId}/transactions`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });

        console.log("Transaction Response Status:", txRes.status);
        console.log("Transaction Response Headers:", [...txRes.headers.entries()]);

        if (userRes.ok && txRes.ok) {
          const userData = await userRes.json();
          const txData = await txRes.json();
          console.log("Transaction Data:", txData); // Debug the raw data
          setUser(userData);
          setTransactions(txData);
        } else {
          console.error("User Response Status:", userRes.status, userRes.statusText);
          console.error("Transaction Response Status:", txRes.status, txRes.statusText);
          toast.error("Failed to load user or transactions");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("An error occurred while loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const filteredTransactions = currentTab === "all"
    ? transactions
    : transactions.filter((tx) => tx.type.toLowerCase() === currentTab.toLowerCase());

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case "Liquidation":
        return <ShoppingBag className="h-4 w-4 text-blue-500" />;
      case "Donation":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "Fundraiser":
        return <Coins className="h-4 w-4 text-yellow-500" />;
      case "Exchange":
        return <ArrowLeftRight className="h-4 w-4 text-green-500" />;
      default:
        return <ShoppingBag className="h-4 w-4 text-blue-500" />;
    }
  };

  const renderAmountCell = (tx: Transaction) => {
    if (tx.type === "Exchange") {
      return <span className="text-sm">{tx.transactionId || "1"}</span>;
    } else if (tx.type === "Donation") {
      return <span className="text-sm text-muted-foreground">-</span>;
    } else {
      return <span className="text-sm font-medium">{tx.transactionId || "1"}</span>;
    }
  };

  // Helper function to safely get the owner name
  const getOwnerName = (tx: Post): string => {
    if (tx.item?.owner?.name) {
      return tx.item?.owner?.name;
    }
    return "Unknown"; // Fallback for missing or null data
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="container py-8 flex-1">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">{localStorage.getItem("userRole")}</Badge>
                <Badge variant={user.status === "Active" ? "default" : "destructive"}>{user.status}</Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rating</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.rating.toFixed(1)}/5.0</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reputation Score</CardTitle>
                <Award className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.reputationScore}/100</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Violations</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.violationCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                <UserCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{user.status}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="liquidation">Liquidations</TabsTrigger>
                  <TabsTrigger value="exchange">Exchanges</TabsTrigger>
                  <TabsTrigger value="donation">Donations</TabsTrigger>
                  <TabsTrigger value="fundraiser">Fundraisers</TabsTrigger>
                </TabsList>
                <TabsContent value={currentTab} className="mt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((tx) => (
                          <TableRow key={tx.transactionId}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getTransactionIcon(tx.type)}
                                {tx.type}
                              </div>
                            </TableCell>
                            <TableCell>
                              {tx.item?.itemName ?? "None"}
                            </TableCell>
                            <TableCell>
                              {getOwnerName(tx)}
                            </TableCell>
                            <TableCell>
                              {tx.createdAt ? format(new Date(tx.createdAt), "yyyy-MM-dd HH:mm:ss") : "N/A"}
                            </TableCell>
                            <TableCell>{renderAmountCell(tx)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  tx.status === "Completed"
                                    ? "default"
                                    : tx.status === "Pending"
                                    ? "outline"
                                    : tx.status === "In Progress"
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {tx.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {tx.type === "Fundraiser" ? (
                                <Link to={`/fundraisers/${tx.item?.itemId?.replace("a", "")}`}>
                                  <Button variant="outline" size="sm">View</Button>
                                </Link>
                              ) : (
                                <Button variant="outline" size="sm">Details</Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                            No {currentTab !== "all" ? currentTab.toLowerCase() : ""} transactions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;