import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { login, logout } from "@/store/slices/authSlice";
import { toast } from "@/hooks/use-toast";
import { loginUser } from "@/services/authService";
import { client } from "../../../client";
import { loadWishlist } from "@/store/slices/wishlistSlice";
import { loadCart } from "@/store/slices/cartSlice";
import { loginSchema } from "@/validation/auth/login.schema";
import { useState } from "react";

const AdminLogin = () => {
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

      if (sanityUser == null || sanityUser?.role === "user") {
        dispatch(logout());

        return toast({
          title: "Access Denied",
          description: "You do not have admin privileges.",
          variant: "destructive",
        });
      }

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
        title: t("toast.auth.login_success_admin"),
        description: t("toast.auth.welcome_back", { name: sanityUser?.name }),
        variant: "success",
      });

      navigate("/admin");
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/invalid-credential") {
        setInvalidAuth(true);
        toast({
          title: t("toast.auth.auth_error"),
          description: t("toast.auth.invalid_credential"),
          variant: "destructive",
        });
      }
    }
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
                <span className="font-display text-3xl font-bold text-gradient">
                  LUXE
                </span>
              </Link>
              <h1 className="font-display text-2xl font-bold mb-2">
                {t("auth.admin_login")}
              </h1>
              <p className="text-muted-foreground">
                {t("auth.access_dashboard")}
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
                      placeholder="admin@luxe.com"
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
                    {invalidAuth && (
                      <p className="text-sm text-destructive w-fit mt-1 mx-auto">
                        {t("auth.invalid_credential")}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {t("auth.access_dashboard_btn")}
                  </Button>
                </Form>
              )}
            </Formik>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {t("auth.not_admin")}{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                {t("auth.user_login")}
              </Link>
            </p>

            <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
              <p className="font-medium mb-2">{t("auth.demo_credentials")}:</p>
              <p className="text-muted-foreground">
                {t("auth.email")}:{" "}
                <span className="font-mono">admin1@luxe.com</span>
              </p>
              <p className="text-muted-foreground">
                {t("auth.password")}: 123456
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin;
