import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { selectWishlistItems, removeFromWishlist } from '@/store/slices/wishlistSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { toast } from '@/hooks/use-toast';

const Wishlist = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector(selectWishlistItems);

  const handleRemove = (productId: string, productName: string) => {
    dispatch(removeFromWishlist(productId));
    toast({
      title: t('product.remove_from_wishlist'),
      description: `${productName} removed from wishlist`,
    });
  };

  const handleMoveToCart = (product: any) => {
    dispatch(addToCart(product));
    dispatch(removeFromWishlist(product._id));
    toast({
      title: t('common.success'),
      description: `${product.title} moved to cart`,
    });
  };

  if (wishlistItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>{t('wishlist.title')} - LUXE</title>
        </Helmet>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Heart className="h-24 w-24 text-muted-foreground/30 mx-auto mb-6" />
            <h1 className="font-display text-3xl font-bold mb-4">{t('wishlist.empty')}</h1>
            <p className="text-muted-foreground mb-8">
              Save items you love by clicking the heart icon on any product.
            </p>
            <Button asChild size="lg">
              <Link to="/shop">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('wishlist.title')} - LUXE</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-4xl font-bold mb-8"
          >
            {t('wishlist.title')} ({wishlistItems.length})
          </motion.h1>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border overflow-hidden group"
              >
                <Link to={`/product/${product.slug}`}>
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {product.category.name}
                  </p>
                  <Link to={`/product/${product.slug}`}>
                    <h3 className="font-medium line-clamp-1 hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold">${product.price}</span>
                    {product.oldPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.oldPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      className="flex-1"
                      size="sm"
                      onClick={() => handleMoveToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {t('wishlist.move_to_cart')}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0 text-destructive hover:text-destructive"
                      onClick={() => handleRemove(product._id, product.title)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
