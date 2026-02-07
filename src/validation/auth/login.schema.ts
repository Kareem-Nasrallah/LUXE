import * as Yup from "yup";
import { vt } from "../validationTranslation";

export const loginSchema = (t: (key: string) => string) => {
  const v = (key: string) => vt(t, key);

  return Yup.object().shape({
    email: Yup.string()
      .email(v("invalid_email"))
      .required(v("required_email")),
    password: Yup.string()
      .min(6, v("min_password"))
      .required(v("required_password")),
  });
};
