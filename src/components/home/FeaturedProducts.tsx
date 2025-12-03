import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';

interface FeaturedProductsProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

const FeaturedProducts = ({ title, products, viewAllLink }: FeaturedProductsProps) => {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            {title}
          </h2>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="hidden md:inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              {t('home.view_all')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>

        {viewAllLink && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10 md:hidden"
          >
            <Link
              to={viewAllLink}
              className="inline-flex items-center gap-2 text-primary font-medium"
            >
              {t('home.view_all')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
