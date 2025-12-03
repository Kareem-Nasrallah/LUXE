import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Heart, Minus, Plus, ShoppingCart, Star, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchProductBySlug, fetchProducts } from '@/store/slices/productsSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from '@/store/slices/wishlistSlice';
import { toast } from '@/hooks/use-toast';
import ProductCard from '@/components/products/ProductCard';
import { mockReviews } from '@/data/mockData';
import { cn } from '@/lib/utils';

const ProductDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { currentProduct: product, items: allProducts, loading, error } = useAppSelector((state) => state.products);
  const isInWishlist = useAppSelector(selectIsInWishlist(product?._id || ''));

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
      dispatch(fetchProducts());
    }
  }, [slug, dispatch]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        dispatch(addToCart(product));
      }
      toast({
        title: t('common.success'),
        description: `${product.title} added to cart`,
      });
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      if (isInWishlist) {
        dispatch(removeFromWishlist(product._id));
        toast({
          title: t('product.remove_from_wishlist'),
          description: `${product.title} removed from wishlist`,
        });
      } else {
        dispatch(addToWishlist(product));
        toast({
          title: t('product.add_to_wishlist'),
          description: `${product.title} added to wishlist`,
        });
      }
    }
  };

  const relatedProducts = allProducts
    .filter((p) => p.category._id === product?.category._id && p._id !== product?._id)
    .slice(0, 4);

  const productReviews = mockReviews.filter((r) => r.productId === product?._id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">{t('common.loading')}</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Product not found'}</p>
          <Button asChild>
            <Link to="/shop">{t('common.back')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <>
      <Helmet>
        <title>{product.title} - LUXE</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('common.back')} to Shop
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-4">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={cn(
                        'w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                        selectedImage === idx ? 'border-primary' : 'border-transparent'
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Badges */}
              <div className="flex gap-2">
                {product.onSale && (
                  <span className="badge-sale">-{discountPercentage}% OFF</span>
                )}
                {product.isNew && <span className="badge-new">{t('product.new')}</span>}
              </div>

              {/* Category */}
              <Link
                to={`/category/${product.category.slug}`}
                className="text-sm text-muted-foreground uppercase tracking-wider hover:text-primary"
              >
                {product.category.name}
              </Link>

              {/* Title */}
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-5 w-5',
                        i < Math.floor(product.rating)
                          ? 'fill-gold text-gold'
                          : 'text-muted'
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({productReviews.length} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold">${product.price}</span>
                {product.oldPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.oldPrice}
                  </span>
                )}
              </div>

              {/* Stock */}
              <p className={cn(
                'text-sm font-medium',
                product.stock > 0 ? 'text-success' : 'text-destructive'
              )}>
                {product.stock > 0 ? `${t('product.in_stock')} (${product.stock})` : t('product.out_of_stock')}
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{t('product.quantity')}:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {t('product.add_to_cart')}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleToggleWishlist}
                  className={cn(isInWishlist && 'bg-sale/10 border-sale text-sale')}
                >
                  <Heart className={cn('h-5 w-5', isInWishlist && 'fill-current')} />
                </Button>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="description" className="mt-8">
                <TabsList className="w-full">
                  <TabsTrigger value="description" className="flex-1">
                    {t('product.description')}
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="flex-1">
                    {t('product.reviews')} ({productReviews.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </TabsContent>
                <TabsContent value="reviews" className="mt-4">
                  {productReviews.length > 0 ? (
                    <div className="space-y-4">
                      {productReviews.map((review) => (
                        <div key={review._id} className="bg-muted/30 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{review.userName}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    'h-4 w-4',
                                    i < review.rating ? 'fill-gold text-gold' : 'text-muted'
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground text-sm">{review.comment}</p>
                          <p className="text-xs text-muted-foreground mt-2">{review.date}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">{t('product.no_reviews')}</p>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="font-display text-2xl font-bold mb-8">
                {t('product.related_products')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p, idx) => (
                  <ProductCard key={p._id} product={p} index={idx} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
