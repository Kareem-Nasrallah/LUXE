import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchCategories } from '@/store/slices/categoriesSlice';

const AdminCategories = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { items: categories, loading } = useAppSelector((state) => state.categories);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">{t('admin.categories')}</h1>
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div key={category._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-display text-xl font-bold text-background">{category.name}</h3>
                    <p className="text-background/80 text-sm">{category.productCount} products</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
