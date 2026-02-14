import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { fetchProducts } from "@/store/slices/productsSlice";
import { urlFor } from "@/lib/image";

const AdminOffers = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { items: products } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const saleProducts = products.filter((p) => p.onSale);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">{t("admin.sale_products")}</h1>
      <p className="text-muted-foreground">
        {t("admin.products_on_sale", { count: saleProducts.length })}
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {saleProducts.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img
                      src={
                        product.image
                          ? urlFor(product.image).width(660).height(660).url()
                          : ""
                      }
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium line-clamp-1">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-sale">
                        ${product.price}
                      </span>
                      {product.oldPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.oldPrice}
                        </span>
                      )}
                    </div>
                    <span className="badge-sale mt-2 inline-block">
                      {product.oldPrice
                        ? `-${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%`
                        : "Sale"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminOffers;
