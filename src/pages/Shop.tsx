import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import ProductGrid from '@/components/products/ProductGrid';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchProducts, setCategory, setSortBy, setOnSale, setPriceRange, clearFilters } from '@/store/slices/productsSlice';
import { fetchCategories } from '@/store/slices/categoriesSlice';

const Shop = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [priceValue, setPriceValue] = useState([0, 1000]);

  const { filteredItems: products, loading, filters } = useAppSelector((state) => state.products);
  const { items: categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const saleParam = searchParams.get('sale');
    const sortParam = searchParams.get('sort');

    if (categoryParam) dispatch(setCategory(categoryParam));
    if (saleParam === 'true') dispatch(setOnSale(true));
    if (sortParam) dispatch(setSortBy(sortParam as any));
  }, [searchParams, dispatch]);

  const handlePriceChange = (value: number[]) => {
    setPriceValue(value);
    dispatch(setPriceRange([value[0], value[1]]));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setPriceValue([0, 1000]);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-medium mb-3">{t('nav.categories')}</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <Checkbox
              id="all-categories"
              checked={!filters.category}
              onCheckedChange={() => dispatch(setCategory(null))}
            />
            <Label htmlFor="all-categories" className="ml-2 cursor-pointer">
              All Categories
            </Label>
          </div>
          {categories.map((cat) => (
            <div key={cat._id} className="flex items-center">
              <Checkbox
                id={cat.slug}
                checked={filters.category === cat.slug}
                onCheckedChange={() => dispatch(setCategory(cat.slug))}
              />
              <Label htmlFor={cat.slug} className="ml-2 cursor-pointer">
                {cat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-3">{t('product.price')}</h3>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={priceValue}
          onValueChange={handlePriceChange}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${priceValue[0]}</span>
          <span>${priceValue[1]}</span>
        </div>
      </div>

      {/* On Sale */}
      <div>
        <div className="flex items-center">
          <Checkbox
            id="on-sale"
            checked={filters.onSale}
            onCheckedChange={(checked) => dispatch(setOnSale(checked as boolean))}
          />
          <Label htmlFor="on-sale" className="ml-2 cursor-pointer">
            {t('product.sale')} Only
          </Label>
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" className="w-full" onClick={handleClearFilters}>
        <X className="h-4 w-4 mr-2" />
        Clear Filters
      </Button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Shop All Products - LUXE</title>
        <meta name="description" content="Browse our complete collection of premium products. Find electronics, fashion, home goods, and more." />
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
                {t('nav.shop')}
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our premium collection of products curated just for you
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="h-5 w-5" />
                  <h2 className="font-semibold">{t('common.filter')}</h2>
                </div>
                <FilterContent />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {products.length} products
                </p>
                <div className="flex items-center gap-4">
                  {/* Mobile Filter */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        {t('common.filter')}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>{t('common.filter')}</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Sort */}
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => dispatch(setSortBy(value as any))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t('common.sort')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">{t('common.newest')}</SelectItem>
                      <SelectItem value="price-low">{t('common.price_low_high')}</SelectItem>
                      <SelectItem value="price-high">{t('common.price_high_low')}</SelectItem>
                      <SelectItem value="popular">{t('common.popular')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products */}
              <ProductGrid products={products} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
