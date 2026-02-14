import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from "@/store/slices/cartSlice";
import { selectUser } from "@/store/slices/authSlice";
import { toast } from "@/hooks/use-toast";
import { urlFor } from "@/lib/image";
import { checkoutSchema } from "@/validation/checkout.schema";
import { sanityWriteClient } from "@/../sanityWriteClient";

interface CheckoutFormValues {
  name: string;
  email: string;
  address: string;
  city: string;
  phone: string;
}

const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, []);

  const shipping = cartTotal >= 100 ? 0 : 10;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  const handleSubmit = async (values: CheckoutFormValues) => {
    const newOrderNumber = `ORD-${Date.now()}`;

    const orderData = {
      _type: "order",

      user: {
        type: "reference",
        ref: user?.id ?? "guest",
      },

      userSnapshot: {
        name: user?.name ?? values.name,
        email: user?.email ?? values.email,
      },

      items: cartItems.map((item) => ({
        type: "object",
        product: {
          type: "reference",
          ref: item.product._id,
        },
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
      })),

      total,
      status: "pending",
      createdAt: new Date().toISOString(),
      orderNumber: newOrderNumber,
      shippingInfo: values,
    };

    try {
      await sanityWriteClient.create(orderData);
      toast({
        title: t("checkout.success"),
        description: t("toast.order_placed", { orderNumber: newOrderNumber }),
        variant: "success",
      });
      dispatch(clearCart());
      navigate(`/checkout/success/${newOrderNumber}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("checkout.title")} - LUXE</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-4xl font-bold mb-8"
          >
            {t("checkout.title")}
          </motion.h1>
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display text-xl font-semibold mb-6">
                  {t("checkout.shipping_info")}
                </h2>
                <Formik<CheckoutFormValues>
                  initialValues={{
                    name: user?.name || "",
                    email: user?.email || "",
                    address: "",
                    city: "",
                    phone: "",
                  }}
                  validationSchema={checkoutSchema(t)}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-4">
                      <div>
                        <Label htmlFor="name">{t("auth.name")}</Label>
                        <Field
                          as={Input}
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          className={
                            errors.name && touched.name
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.name && touched.name && (
                          <p className="text-sm text-destructive mt-1">
                            {String(errors.name)}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">{t("auth.email")}</Label>
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          className={
                            errors.email && touched.email
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.email && touched.email && (
                          <p className="text-sm text-destructive mt-1">
                            {String(errors.email)}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="address">{t("checkout.address")}</Label>
                        <Field
                          as={Input}
                          id="address"
                          name="address"
                          placeholder="123 Main Street"
                          className={
                            errors.address && touched.address
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.address && touched.address && (
                          <p className="text-sm text-destructive mt-1">
                            {String(errors.address)}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="city">{t("checkout.city")}</Label>
                        <Field
                          as={Input}
                          id="city"
                          name="city"
                          placeholder="New York"
                          className={
                            errors.city && touched.city
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.city && touched.city && (
                          <p className="text-sm text-destructive mt-1">
                            {String(errors.city)}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">{t("checkout.phone")}</Label>
                        <Field
                          as={Input}
                          id="phone"
                          name="phone"
                          placeholder="01$23456789"
                          className={
                            errors.phone && touched.phone
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.phone && touched.phone && (
                          <p className="text-sm text-destructive mt-1">
                            {String(errors.phone)}
                          </p>
                        )}
                      </div>
                      <Button type="submit" className="w-full" size="lg">
                        {t("checkout.place_order")}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <h2 className="font-display text-xl font-semibold mb-6">
                  {t("checkout.order_summary")}
                </h2>
                <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                  {cartItems.map((item) => (
                    <div key={item.product._id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                        <img
                          src={
                            item.product.image
                              ? urlFor(item.product.image)
                                  .width(440)
                                  .height(330)
                                  .url()
                              : ""
                          }
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium line-clamp-1">
                          {item.product.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("cart.subtotal")}
                    </span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("cart.shipping")}
                    </span>
                    <span>
                      {shipping === 0
                        ? t("cart.free_shipping")
                        : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("cart.tax")}
                    </span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t("cart.total")}</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
