import { CheckCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { fetchOrderByNumber } from "@/store/slices/orderSlice";
import OrderNotFound from "./OrderNotFound";

const SuccessCheckout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { orderNumber } = useParams();
  const dispatch = useAppDispatch();
  const { currentOrder } = useAppSelector((state) => state.orders);

  useEffect(() => {
    if (orderNumber) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, []);

  if (orderNumber && !currentOrder) {
    return <OrderNotFound />;
  } else {
    return (
      <>
        <Helmet>
          <title>Order Confirmed - LUXE</title>
        </Helmet>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-4">
              {t("checkout.success")}
            </h1>
            <p className="text-muted-foreground mb-2">
              {t("checkout.order_done")}
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              {t("checkout.order_number")}:{" "}
              <span className="font-mono font-medium">{orderNumber}</span>
            </p>
            <Button onClick={() => navigate("/shop")}>
              {t("cart.continue_shopping")}
            </Button>
          </motion.div>
        </div>
      </>
    );
  }
};

export default SuccessCheckout;
