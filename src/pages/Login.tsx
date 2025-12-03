import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
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

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = (values: { email: string; password: string }) => {
    // Fake authentication - check for admin
    const isAdmin = values.email === 'admin@luxe.com';
    
    const user = {
      id: `user-${Date.now()}`,
      name: isAdmin ? 'Admin' : values.email.split('@')[0],
      email: values.email,
      isAdmin,
    };

    dispatch(login(user));
    toast({
      title: t('auth.login_success'),
      description: `Welcome, ${user.name}!`,
    });

    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('auth.login')} - LUXE</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-6">
                <span className="font-display text-3xl font-bold text-gradient">LUXE</span>
              </Link>
              <h1 className="font-display text-2xl font-bold mb-2">{t('auth.login')}</h1>
              <p className="text-muted-foreground">Welcome back! Please sign in to continue.</p>
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
                      placeholder="you@example.com"
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

                  <div className="flex justify-end">
                    <button type="button" className="text-sm text-primary hover:underline">
                      {t('auth.forgot_password')}
                    </button>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {t('auth.login')}
                  </Button>
                </Form>
              )}
            </Formik>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {t('auth.no_account')}{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                {t('auth.register')}
              </Link>
            </p>

            {/* Demo hint */}
            <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
              <p className="font-medium mb-2">Demo Credentials:</p>
              <p className="text-muted-foreground">
                Admin: <span className="font-mono">admin@luxe.com</span>
              </p>
              <p className="text-muted-foreground">
                User: Any email (e.g., <span className="font-mono">user@test.com</span>)
              </p>
              <p className="text-muted-foreground">Password: Any 6+ characters</p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
