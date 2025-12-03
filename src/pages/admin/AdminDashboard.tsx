import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Package, FolderTree, DollarSign, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchProducts } from '@/store/slices/productsSlice';
import { fetchCategories } from '@/store/slices/categoriesSlice';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { items: products } = useAppSelector((state) => state.products);
  const { items: categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.total, 0);

  const stats = [
    { title: t('admin.total_products'), value: products.length, icon: Package, color: 'text-primary' },
    { title: t('admin.categories'), value: categories.length, icon: FolderTree, color: 'text-accent' },
    { title: t('admin.total_orders'), value: orders.length, icon: ShoppingCart, color: 'text-success' },
    { title: t('admin.total_revenue'), value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-gold' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">{t('admin.dashboard')}</h1>
        <p className="text-muted-foreground mt-1">Overview of your store</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>{t('admin.recent_orders')}</CardTitle></CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-muted-foreground">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${order.total.toFixed(2)}</p>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full capitalize">{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
