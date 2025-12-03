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

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registerSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
});

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = (values: RegisterFormValues) => {
    const user = { id: `user-${Date.now()}`, name: values.name, email: values.email, isAdmin: false };
    dispatch(login(user));
    toast({ title: t('auth.register_success'), description: `Welcome to LUXE, ${user.name}!` });
    navigate('/');
  };

  return (
    <>
      <Helmet><title>{t('auth.register')} - LUXE</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-6"><span className="font-display text-3xl font-bold text-gradient">LUXE</span></Link>
              <h1 className="font-display text-2xl font-bold mb-2">{t('auth.register')}</h1>
              <p className="text-muted-foreground">Create an account to get started.</p>
            </div>
            <Formik<RegisterFormValues>
              initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
              validationSchema={registerSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t('auth.name')}</Label>
                    <Field as={Input} id="name" name="name" placeholder="John Doe" className={errors.name && touched.name ? 'border-destructive' : ''} />
                    {errors.name && touched.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <Field as={Input} id="email" name="email" type="email" placeholder="you@example.com" className={errors.email && touched.email ? 'border-destructive' : ''} />
                    {errors.email && touched.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <Field as={Input} id="password" name="password" type="password" placeholder="••••••••" className={errors.password && touched.password ? 'border-destructive' : ''} />
                    {errors.password && touched.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">{t('auth.confirm_password')}</Label>
                    <Field as={Input} id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" className={errors.confirmPassword && touched.confirmPassword ? 'border-destructive' : ''} />
                    {errors.confirmPassword && touched.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>{t('auth.register')}</Button>
                </Form>
              )}
            </Formik>
            <p className="text-center text-sm text-muted-foreground mt-6">
              {t('auth.have_account')}{' '}<Link to="/login" className="text-primary hover:underline font-medium">{t('auth.login')}</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Register;
