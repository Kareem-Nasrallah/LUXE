import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { addToCart } from '@/store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from '@/store/slices/wishlistSlice';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isInWishlist = useAppSelector(selectIsInWishlist(product._id));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
    toast({
      title: t('common.success'),
      description: `${product.title} added to cart`,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
  };

  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.slug}`}>
        <Card className="group overflow-hidden border-border/50 hover:border-primary/30 card-hover bg-card">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.onSale && (
                <span className="badge-sale">
                  -{discountPercentage}%
                </span>
              )}
              {product.isNew && (
                <span className="badge-new">
                  {t('product.new')}
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="secondary"
                className={cn(
                  'h-9 w-9 rounded-full shadow-lg',
                  isInWishlist && 'bg-sale text-sale-foreground hover:bg-sale/90'
                )}
                onClick={handleToggleWishlist}
              >
                <Heart className={cn('h-4 w-4', isInWishlist && 'fill-current')} />
              </Button>
            </div>

            {/* Add to Cart Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-background/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <Button
                className="w-full"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.stock === 0 ? t('product.out_of_stock') : t('product.add_to_cart')}
              </Button>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {product.category.name}
              </p>
              <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {product.title}
              </h3>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-gold text-gold" />
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">
                  ${product.price}
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.oldPrice}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
