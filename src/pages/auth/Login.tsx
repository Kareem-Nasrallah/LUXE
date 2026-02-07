import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { login } from "@/store/slices/authSlice";
import { toast } from "@/hooks/use-toast";
import { loginUser } from "@/services/authService";
import { client } from "@/../client";
import { loginSchema } from "@/validation/auth/login.schema";
import { useState } from "react";
import { loadCart } from "@/store/slices/cartSlice";
import { loadWishlist } from "@/store/slices/wishlistSlice";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [invalidAuth, setInvalidAuth] = useState(false);

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const res = await loginUser(values.email, values.password);

      const sanityUser = await client.fetch(
        `*[_type == "user" && id == $uid][0]`,
        { uid: res.user.uid },
      );

      dispatch(
        login({
          id: res.user.uid,
          email: res.user.email,
          ...sanityUser,
        }),
      );
      dispatch(loadCart());
      dispatch(loadWishlist());

      toast({
        title: t("auth.login_success"),
        description: t("auth.welcome_back", { name: sanityUser?.name }),
        variant: "success",
      });
      navigate("/");
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/invalid-credential") {
        setInvalidAuth(true);
        toast({
          title: t("auth.auth_error"),
          description: t("auth.invalid_credential"),
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("auth.login")} - LUXE</title>
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
                <span className="font-display text-3xl font-bold text-gradient">
                  LUXE
                </span>
              </Link>
              <h1 className="font-display text-2xl font-bold mb-2">
                {t("auth.login")}
              </h1>
              <p className="text-muted-foreground">
                {t("auth.description_login")}
              </p>
            </div>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginSchema(t)}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
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
                  {invalidAuth && (
                    <p className="text-sm text-destructive w-fit mt-1 mx-auto">
                      {t("auth.invalid_credential")}
                    </p>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                    >
                      {t("auth.forgot_password")}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {t("auth.login")}
                  </Button>
                </Form>
              )}
            </Formik>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {t("auth.no_account")}{" "}
              <Link
                to="/register"
                className="text-primary hover:underline font-medium"
              >
                {t("auth.register")}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
