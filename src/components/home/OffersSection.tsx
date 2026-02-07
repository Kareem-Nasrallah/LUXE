import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";

interface OffersSectionProps {
  products: Product[];
}

const OffersSection = ({ products }: OffersSectionProps) => {
  const { t } = useTranslation();
  const saleProducts = products.filter((p) => p.onSale);

  if (saleProducts.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Promo Banner */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-24"
          >
            <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-3xl p-8 md:p-10">
              <div className="inline-flex items-center gap-2 bg-primary-foreground/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Percent className="h-4 w-4" />
                <span>{t("home.limited_time")}</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {t("home.special_offers")}
              </h2>
              <p className="text-primary-foreground/80 mb-6">
                {t("home.offers_discription")}
              </p>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{t("home.end_in")}</span>
                </div>
              </div>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="w-full inline-flex flex-row rtl:flex-row-reverse sm:w-auto"
              >
                <Link to="/shop?sale=true">
                  {t("home.shop_sale")}
                  <ArrowRight className="ms-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Sale Products Grid */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {saleProducts.slice(0, 4).map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
