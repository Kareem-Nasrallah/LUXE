import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { removeFromCart, updateQuantity, selectCartItems, selectCartTotal } from '@/store/slices/cartSlice';
import { toast } from '@/hooks/use-toast';

const Cart = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);

  const handleRemove = (productId: string, productName: string) => {
    dispatch(removeFromCart(productId));
    toast({
      title: t('cart.remove'),
      description: `${productName} removed from cart`,
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const shipping = cartTotal >= 100 ? 0 : 10;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>{t('cart.title')} - LUXE</title>
        </Helmet>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <ShoppingBag className="h-24 w-24 text-muted-foreground/30 mx-auto mb-6" />
            <h1 className="font-display text-3xl font-bold mb-4">{t('cart.empty')}</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button asChild size="lg">
              <Link to="/shop">
                {t('cart.continue_shopping')}
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
        <title>{t('cart.title')} - LUXE</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-4xl font-bold mb-8"
          >
            {t('cart.title')}
          </motion.h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl border border-border p-4 md:p-6"
                >
                  <div className="flex gap-4 md:gap-6">
                    {/* Image */}
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="shrink-0"
                    >
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product.slug}`}>
                        <h3 className="font-medium hover:text-primary transition-colors line-clamp-2">
                          {item.product.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.product.category.name}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold">${item.product.price}</span>
                        {item.product.oldPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${item.product.oldPrice}
                          </span>
                        )}
                      </div>

                      {/* Quantity & Remove - Mobile */}
                      <div className="flex items-center justify-between mt-4 md:hidden">
                        <div className="flex items-center border border-border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRemove(item.product._id, item.product.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Quantity & Remove - Desktop */}
                    <div className="hidden md:flex items-center gap-6">
                      <div className="flex items-center border border-border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="w-24 text-right">
                        <p className="font-bold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleRemove(item.product._id, item.product.title)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <h2 className="font-display text-xl font-semibold mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('cart.shipping')}</span>
                    <span className="font-medium">
                      {shipping === 0 ? t('cart.free_shipping') : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('cart.tax')}</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">{t('cart.total')}</span>
                    <span className="font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>

                {cartTotal < 100 && (
                  <p className="text-sm text-muted-foreground mt-4 p-3 bg-muted rounded-lg">
                    Add ${(100 - cartTotal).toFixed(2)} more for free shipping!
                  </p>
                )}

                <Button asChild className="w-full mt-6" size="lg">
                  <Link to="/checkout">
                    {t('cart.checkout')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full mt-3">
                  <Link to="/shop">{t('cart.continue_shopping')}</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
