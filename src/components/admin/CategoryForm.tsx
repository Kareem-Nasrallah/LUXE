import { Label } from "@/components/ui/label";
import { Category } from "@/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { sanityWriteClient } from "@/../sanityWriteClient";
import { urlFor } from "@/lib/image";

const CategoryForm = ({
  category,
  onSave,
  onCancel,
}: {
  category: Category | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: category?.title || "",
    description: category?.description || "",
    image: category?.image?.asset?._ref || "",
  });

  const { t } = useTranslation();

  const [preview, setPreview] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const imageAsset = await sanityWriteClient.assets.upload("image", file, {
        filename: file.name,
      });
      setPreview(URL.createObjectURL(file));
      setFormData({ ...formData, image: imageAsset._id });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>{t("common.title")}</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div>
        <Label>{t("common.description")}</Label>
        <Input
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div>
        <Label>{t("common.image")}</Label>
        <div className="w-60 mx-auto h-40 bg-gray-300 flex justify-center items-center hover:opacity-85 overflow-hidden">
          {preview || category?.image ? (
            ""
          ) : (
            <p className="fixed">{t("category.upload_image")}</p>
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute bg-gray-200 cursor-pointer w-60 h-40 opacity-0"
          />
          {preview ? (
            <img src={preview} className="max-w-60 max-h-40 rounded" />
          ) : (
            category?.image && (
              <img
                src={urlFor(category.image).width(660).height(660).url()}
                alt={category.title}
                className="max-w-60 max-h-40 rounded"
              />
            )
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={() => onSave(formData)} className="flex-1">
          {t("common.save")}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
      </div>
    </div>
  );
};

export default CategoryForm;
