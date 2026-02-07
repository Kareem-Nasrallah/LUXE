import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { sanityWriteClient } from "@/../sanityWriteClient";
import { registerUser } from "@/services/authService";
import { useState } from "react";
import { registerSchema } from "@/validation/auth/register.schema";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { login } from "@/store/slices/authSlice";
import { loadCart } from "@/store/slices/cartSlice";
import { loadWishlist } from "@/store/slices/wishlistSlice";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [emailError, setEmailError] = useState<null | string>(null);

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      const res = await registerUser(values.email, values.password);
      const token = await res.user.getIdToken();

      await sanityWriteClient.create({
        _type: "user",
        id: res.user.uid,
        email: res.user.email,
        name: values.name,
        isAdmin: false,
      });

      dispatch(
        login({
          email: res.user.email,
          name: values.name,
          isAdmin: false,
          id: res.user.uid,
        }),
      );
      dispatch(loadCart());
      dispatch(loadWishlist());

      toast({
        title: t("auth.register_success"),
        description: t("auth.welcome", { name: values.name }),
        variant: "success",
      });

      navigate("/");
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        setEmailError(t("auth.email_in_use"));

        toast({
          title: t("auth.auth_error"),
          description: t("auth.email_in_use"),
          variant: "destructive",
        });
      }
    }
  };
  return (
    <>
      <Helmet>
        <title>{t("auth.register")} - LUXE</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-6">
                <span className="font-display text-3xl font-bold text-gradient">
                  LUXE
                </span>
              </Link>
              <h1 className="font-display text-2xl font-bold mb-2">
                {t("auth.register")}
              </h1>
              <p className="text-muted-foreground">
                {t("auth.description_register")}
              </p>
            </div>
            <Formik<RegisterFormValues>
              initialValues={{
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={registerSchema(t)}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t("auth.name")}</Label>
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      className={
                        errors.name && touched.name ? "border-destructive" : ""
                      }
                    />
                    {errors.name && touched.name && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">{t("auth.email")}</Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className={
                        errors.email && touched.email
                          ? "border-destructive"
                          : ""
                      }
                    />
                    {errors.email && touched.email && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.email}
                      </p>
                    )}
                    {emailError && touched.email && (
                      <p className="text-sm text-destructive mt-1">
                        {emailError}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="password">{t("auth.password")}</Label>
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className={
                        errors.password && touched.password
                          ? "border-destructive"
                          : ""
                      }
                    />
                    {errors.password && touched.password && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">
                      {t("auth.confirm_password")}
                    </Label>
                    <Field
                      as={Input}
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className={
                        errors.confirmPassword && touched.confirmPassword
                          ? "border-destructive"
                          : ""
                      }
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {t("auth.register")}
                  </Button>
                </Form>
              )}
            </Formik>
            <p className="text-center text-sm text-muted-foreground mt-6">
              {t("auth.have_account")}{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                {t("auth.login")}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Register;
