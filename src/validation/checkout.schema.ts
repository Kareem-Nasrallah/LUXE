import * as Yup from "yup";
import { vt } from "./validationTranslation";

export const checkoutSchema = (t: (key: string) => string) => {
  const v = (key: string) => vt(t, key);

  return Yup.object().shape({
    name: Yup.string().required(v("required")),
    email: Yup.string().email(v("invalid_email")).required(v("required_email")),
    address: Yup.string().required(v("required")),
    city: Yup.string().required(v("required")),
    phone: Yup.string().required(v("required")),
  });
};
