import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrderNotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{t("orderNotFound.pageTitle")}</title>
      </Helmet>

      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>

          <h1 className="text-3xl font-bold mb-4">
            {t("orderNotFound.title")}
          </h1>

          <p className="text-muted-foreground mb-3">
            {t("orderNotFound.description")}
          </p>

          <p className="text-sm text-muted-foreground mb-8">
            {t("orderNotFound.checkNumber")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate("/profile")}>
              {t("orderNotFound.goToProfile")}
            </Button>

            <Button variant="outline" onClick={() => navigate("/contact")}>
              {t("orderNotFound.contactUs")}
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default OrderNotFound;
