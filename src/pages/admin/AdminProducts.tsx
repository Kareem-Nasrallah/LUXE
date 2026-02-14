import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  createNewProduct,
  updateSanityProduct,
  deleteSanityProduct,
} from "@/store/slices/productsSlice";
import { toast } from "@/hooks/use-toast";
import { Category, Product } from "@/types";
import { urlFor } from "@/lib/image";
import ProductForm from "@/components/admin/ProductForm";

const AdminProducts = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { items: products, loading } = useAppSelector(
    (state) => state.products,
  );
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (product: Product) => {
    dispatch(deleteProduct(product._id));
    deleteSanityProduct(product._id);
    toast({
      title: t("toast.admin.product_deleted"),
      description: t("toast.admin.product_removed", { product: product.title }),
      variant: "destructive",
    });
  };

  const handleSave = async (formData: any) => {
    const productData: Product = {
      _id: editingProduct?._id,
      title: formData.title,
      slug: formData.title.toLowerCase().replace(/\s+/g, "_"),
      description: formData.description,
      image: formData.image,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : formData.price,
      onSale: formData.onSale,
      category: {} as Category,
      rating: 4.5,
      stock: Number(formData.stock) || 1,
    };
    if (editingProduct) {
      updateSanityProduct(editingProduct?._id, formData);
      dispatch(updateProduct(productData));
      toast({
        title: t("toast.admin.product_updated"),
        description: formData.title,
        variant: "success",
      });
    } else {
      createNewProduct(formData);
      dispatch(addProduct(productData));
      toast({
        title: t("toast.admin.product_created"),
        description: formData.title,
        variant: "success",
      });
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">
          {t("common.products")}
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProduct(null)}>
              <Plus className="h-4 w-4 mr-2" />
              {t("admin.add_product")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProduct
                  ? t("admin.edit_product")
                  : t("admin.add_product")}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("nav.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          {t("common.loading")}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
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
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{product.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {product.category?.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold">${product.price}</span>
                        {product.onSale && (
                          <span className="badge-sale text-xs">
                            {t("product.sale")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditingProduct(product);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

export default AdminProducts;
