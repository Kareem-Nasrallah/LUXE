import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { User, Package, Heart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import {
  selectUser,
  selectIsAuthenticated,
  updateUser,
} from "@/store/slices/authSlice";
import { selectWishlistItems } from "@/store/slices/wishlistSlice";
import { toast } from "@/hooks/use-toast";
import { Order } from "@/types";
import { urlFor } from "@/lib/image";

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const wishlistItems = useAppSelector(selectWishlistItems);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Load orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const userOrders = savedOrders.filter((o: Order) => o.userId === user?.id);
    setOrders(userOrders);
  }, [isAuthenticated, navigate, user]);

  const handleSaveProfile = () => {
    dispatch(updateUser({ name: editedName }));
    setIsEditing(false);
    toast({
      title: t("common.success"),
      description: t("toast.profile_updated"),
      variant: "success",
    });
  };

  if (!user) return null;

  return (
    <>
      <Helmet>
        <title>{t("profile.title")} - LUXE</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-4xl font-bold mb-8"
          >
            {t("profile.title")}
          </motion.h1>

          <Tabs defaultValue="info" className="space-y-8">
            <TabsList>
              <TabsTrigger value="info" className="gap-2">
                <User className="h-4 w-4" />
                {t("profile.personal_info")}
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <Package className="h-4 w-4" />
                {t("profile.orders")}
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="gap-2">
                <Heart className="h-4 w-4" />
                {t("nav.wishlist")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-6 max-w-lg"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-semibold">
                    {t("profile.personal_info")}
                  </h2>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      {t("profile.edit")}
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>{t("auth.name")}</Label>
                    {isEditing ? (
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                      />
                    ) : (
                      <p className="mt-1 text-foreground">{user.name}</p>
                    )}
                  </div>
                  <div>
                    <Label>{t("auth.email")}</Label>
                    <p className="mt-1 text-foreground">{user.email}</p>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 mt-6">
                    <Button onClick={handleSaveProfile}>
                      {t("profile.save")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      {t("common.cancel")}
                    </Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="orders">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {orders.length === 0 ? (
                  <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-card rounded-xl border border-border p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium capitalize">
                            {order.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((item) => (
                            <div
                              key={item.product._id}
                              className="w-12 h-12 rounded-lg overflow-hidden bg-muted"
                            >
                              <img
                                src={
                                  item.product.image
                                    ? urlFor(item.product.image)
                                        .width(660)
                                        .height(660)
                                        .url()
                                    : ""
                                }
                                alt={item.product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        <p className="mt-4 font-bold">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="wishlist">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Your wishlist is empty
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {wishlistItems.map((product) => (
                      <div
                        key={product._id}
                        className="bg-card rounded-xl border border-border overflow-hidden"
                      >
                        <div className="aspect-square bg-muted">
                          <img
                            src={
                              product.image
                                ? urlFor(product.image)
                                    .width(660)
                                    .height(660)
                                    .url()
                                : ""
                            }
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium line-clamp-1">
                            {product.title}
                          </h3>
                          <p className="font-bold mt-1">${product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Profile;
