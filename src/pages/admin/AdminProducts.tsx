import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '@/store/slices/productsSlice';
import { toast } from '@/hooks/use-toast';
import { Product } from '@/types';
import { mockCategories } from '@/data/mockData';

const AdminProducts = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { items: products, loading } = useAppSelector((state) => state.products);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  const filteredProducts = products.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (product: Product) => {
    dispatch(deleteProduct(product._id));
    toast({ title: 'Product deleted', description: `${product.title} has been removed` });
  };

  const handleSave = (formData: any) => {
    const productData: Product = {
      _id: editingProduct?._id || `prod-${Date.now()}`,
      title: formData.title,
      slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
      description: formData.description,
      images: [formData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
      onSale: formData.onSale,
      category: mockCategories[0],
      rating: 4.5,
      stock: Number(formData.stock) || 100,
    };

    if (editingProduct) {
      dispatch(updateProduct(productData));
      toast({ title: 'Product updated' });
    } else {
      dispatch(addProduct(productData));
      toast({ title: 'Product created' });
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">{t('admin.products')}</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProduct(null)}><Plus className="h-4 w-4 mr-2" />{t('admin.add_product')}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{editingProduct ? t('admin.edit_product') : t('admin.add_product')}</DialogTitle></DialogHeader>
            <ProductForm product={editingProduct} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            <motion.div key={product._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                      <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{product.title}</h3>
                      <p className="text-sm text-muted-foreground">{product.category.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold">${product.price}</span>
                        {product.onSale && <span className="badge-sale text-xs">Sale</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => { setEditingProduct(product); setIsDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                      <Button variant="outline" size="icon" className="text-destructive" onClick={() => handleDelete(product)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductForm = ({ product, onSave, onCancel }: { product: Product | null; onSave: (data: any) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    oldPrice: product?.oldPrice?.toString() || '',
    image: product?.images[0] || '',
    stock: product?.stock?.toString() || '100',
    onSale: product?.onSale || false,
  });

  return (
    <div className="space-y-4">
      <div><Label>Title</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
      <div><Label>Description</Label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Price</Label><Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} /></div>
        <div><Label>Old Price</Label><Input type="number" value={formData.oldPrice} onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })} /></div>
      </div>
      <div><Label>Image URL</Label><Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} /></div>
      <div><Label>Stock</Label><Input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} /></div>
      <div className="flex items-center gap-2"><Switch checked={formData.onSale} onCheckedChange={(checked) => setFormData({ ...formData, onSale: checked })} /><Label>On Sale</Label></div>
      <div className="flex gap-2 pt-4">
        <Button onClick={() => onSave(formData)} className="flex-1">Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default AdminProducts;
