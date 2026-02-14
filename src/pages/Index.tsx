import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { fetchProducts } from "@/store/slices/productsSlice";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import OffersSection from "@/components/home/OffersSection";

const Index = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { items: products, loading: productsLoading } = useAppSelector(
    (state) => state.products,
  );
  const { items: categories, loading: categoriesLoading } = useAppSelector(
    (state) => state.categories,
  );

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const newProducts = products.filter((p) => p.isNew);
  const popularProducts = [...products].sort((a, b) => b.rating - a.rating);

  return (
    <>
      <Helmet>
        <title>LUXE - Premium E-Commerce | Discover Your Style</title>
        <meta
          name="description"
          content="Shop premium products from around the world. Discover curated collections for the modern lifestyle at LUXE."
        />
      </Helmet>

      <HeroSection />

      {!categoriesLoading && categories.length > 0 && (
        <CategorySection categories={categories} />
      )}

      {!productsLoading && newProducts.length > 0 && (
        <FeaturedProducts
          title={t("home.new_arrivals")}
          products={newProducts}
          viewAllLink="/shop?new=true"
        />
      )}

      {!productsLoading && products.length > 0 && (
        <OffersSection products={products} />
      )}

      {!productsLoading && popularProducts.length > 0 && (
        <div className="bg-muted/30">
          <FeaturedProducts
            title={t("home.best_sellers")}
            products={popularProducts}
            viewAllLink="/shop?sort=popular"
          />
        </div>
      )}
    </>
  );
};

export default Index;
