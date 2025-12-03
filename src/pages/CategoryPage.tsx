import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import ProductGrid from '@/components/products/ProductGrid';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchProducts, setCategory } from '@/store/slices/productsSlice';
import { fetchCategories } from '@/store/slices/categoriesSlice';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();

  const { filteredItems: products, loading } = useAppSelector((state) => state.products);
  const { items: categories } = useAppSelector((state) => state.categories);

  const category = categories.find((c) => c.slug === slug);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (slug) {
      dispatch(setCategory(slug));
    }
  }, [slug, dispatch]);

  return (
    <>
      <Helmet>
        <title>{category?.name || 'Category'} - LUXE</title>
        <meta name="description" content={`Shop ${category?.name} products at LUXE.`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div 
          className="relative py-16 md:py-24 bg-cover bg-center"
          style={{ backgroundImage: category ? `url(${category.image})` : undefined }}
        >
          <div className="absolute inset-0 bg-foreground/70" />
          <div className="container mx-auto px-4 relative z-10">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-background/80 hover:text-background mb-4"
            >
              <ChevronLeft className="h-4 w-4" />
              All Categories
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold text-background mb-4">
                {category?.name || 'Category'}
              </h1>
              <p className="text-background/80">
                {products.length} products
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
