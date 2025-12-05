import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { login } from '@/store/slices/authSlice';
import { toast } from '@/hooks/use-toast';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const AdminLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = (values: { email: string; password: string }, { setFieldError }: any) => {
    // Only allow admin@luxe.com as admin
    if (values.email !== 'admin@luxe.com') {
      setFieldError('email', 'Access denied. Admin credentials required.');
      return;
    }

    const user = {
      id: `admin-${Date.now()}`,
      name: 'Admin',
      email: values.email,
      isAdmin: true,
    };

    dispatch(login(user));
    toast({
      title: 'Welcome Admin!',
      description: 'You have successfully logged in.',
    });
    navigate('/admin');
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - LUXE</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <Link to="/" className="inline-block mb-4">
                <span className="font-display text-3xl font-bold text-gradient">LUXE</span>
              </Link>
              <h1 className="font-display text-2xl font-bold mb-2">Admin Login</h1>
              <p className="text-muted-foreground">Access the admin dashboard</p>
            </div>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@luxe.com"
                      className={errors.email && touched.email ? 'border-destructive' : ''}
                    />
                    {errors.email && touched.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className={errors.password && touched.password ? 'border-destructive' : ''}
                    />
                    {errors.password && touched.password && (
                      <p className="text-sm text-destructive mt-1">{errors.password}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    Access Dashboard
                  </Button>
                </Form>
              )}
            </Formik>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Not an admin?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                User Login
              </Link>
            </p>

            <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
              <p className="font-medium mb-2">Admin Credentials:</p>
              <p className="text-muted-foreground">
                Email: <span className="font-mono">admin@luxe.com</span>
              </p>
              <p className="text-muted-foreground">Password: Any 6+ characters</p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin;
