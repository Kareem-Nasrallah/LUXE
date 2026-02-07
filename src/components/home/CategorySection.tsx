import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types";
import { urlFor } from "@/lib/image";

interface CategorySectionProps {
  categories: Category[];
}

const CategorySection = ({ categories }: CategorySectionProps) => {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            {t("home.featured_categories")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("home.featured_categories_discription")}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/category/${category.slug.current}`}
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                  <img
                    src={
                      category?.image
                        ? urlFor(category.image)
                            .width(208)
                            .height(208)
                            .quality(80)
                            .url()
                        : ""
                    }
                    alt={category?.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display text-lg font-semibold text-background mb-1">
                      {category?.title}
                    </h3>
                    <p className="text-sm text-background/80">
                      {category.productCount} {t("admin.products")}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all flex-row rtl:flex-row-reverse"
          >
            {t("home.view_all")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;
