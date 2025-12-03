import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchCategories } from '@/store/slices/categoriesSlice';

const Categories = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { items: categories, loading } = useAppSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>{t('nav.categories')} - LUXE</title>
        <meta name="description" content="Browse all product categories at LUXE. Find electronics, fashion, home goods, and more." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                {t('nav.categories')}
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our curated categories to find exactly what you're looking for
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-muted rounded-2xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/category/${category.slug}`}
                    className="group block relative aspect-[4/3] overflow-hidden rounded-2xl"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h2 className="font-display text-2xl md:text-3xl font-bold text-background mb-2">
                        {category.name}
                      </h2>
                      <div className="flex items-center justify-between">
                        <p className="text-background/80">
                          {category.productCount} products
                        </p>
                        <span className="inline-flex items-center gap-2 text-background font-medium group-hover:gap-3 transition-all">
                          Shop Now
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Categories;
