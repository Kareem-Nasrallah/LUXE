import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import {
  addCategory,
  createSanitycategory,
  deleteCategory,
  deleteSanityCategory,
  fetchCategories,
  updateCategory,
  updateSanitycategory,
} from "@/store/slices/categoriesSlice";
import { urlFor } from "@/lib/image";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";
import { Edit, Plus, Trash2 } from "lucide-react";
import CategoryForm from "@/components/admin/CategoryForm";
import { toast } from "@/hooks/use-toast";

const AdminCategories = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { items: categories, loading } = useAppSelector(
    (state) => state.categories,
  );
  const [editingcategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const handleDelete = (category: Category) => {
    dispatch(deleteCategory(category._id));
    deleteSanityCategory(category._id);
    toast({
      title: t("toast.admin.category_deleted"),
      description: t("toast.admin.category_removed", {
        category: category.title,
      }),
      variant: "destructive",
    });
  };

  const handleSave = async (formData: any) => {
    const categoryData: Category = {
      _id: editingcategory?._id,
      title: formData.title,
      slug: formData.title.toLowerCase().replace(/\s+/g, "_"),
      description: formData.description,
      image: formData.image,
    };
    if (editingcategory) {
      updateSanitycategory(editingcategory?._id, formData);
      dispatch(updateCategory(categoryData));
      toast({
        title: t("toast.admin.category_updated"),
        description: formData.title,
        variant: "success",
      });
    } else {
      createSanitycategory(formData);
      dispatch(addCategory(categoryData));
      toast({
        title: t("toast.admin.category_created"),
        description: formData.title,
        variant: "success",
      });
    }
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">
          {t("admin.categories")}
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCategory(null)}>
              <Plus className="h-4 w-4 mr-2" />
              {t("admin.add_category")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingcategory
                  ? t("admin.edit_category")
                  : t("admin.add_category")}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm
              category={editingcategory}
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          {t("commen.loading")}
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
              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={
                      category?.image
                        ? urlFor(category.image).width(500).height(500).url()
                        : ""
                    }
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute top-0 bottom-0 w-full p-4 bg-black/10 hover:bg-black/30 transition-opacity">
                    <div className="flex items-center justify-between w-ful">
                      <div className=" bg-black/20 px-2 rounded-lg">
                        <h3 className="font-display text-xl font-bold text-background">
                          {category.title}
                        </h3>
                        <p className="text-background/80 text-sm">
                          {t("common.product", {
                            count: category.productCount,
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-white/70"
                          onClick={() => {
                            setEditingCategory(category);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive bg-white/70"
                          onClick={() => handleDelete(category)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="w-full h-2/3 mt-4 p-2 flex items-center justify-center">
                      <p className="text-background text-center bg-black/20 px-2 rounded-lg">
                        {category.description}
                      </p>
                    </div>
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
