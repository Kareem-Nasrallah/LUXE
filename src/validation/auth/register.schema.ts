import * as Yup from "yup";
import { vt } from "../validationTranslation";

export const registerSchema = (t: (key: string) => string) => {
  const v = (key: string) => vt(t, key);

  return Yup.object().shape({
    name: Yup.string().required(v("required")),
    email: Yup.string().email(v("invalid_email")).required(v("required_email")),
    password: Yup.string()
      .min(6, v("min_password"))
      .required(v("required_password")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], v("password_mismatch"))
      .required(v("required")),
  });
};
