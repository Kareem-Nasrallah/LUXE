import { createClient } from "@sanity/client";

export const sanityWriteClient = createClient({
  projectId: "iidkm49g",
  dataset: "production",
  apiVersion: "2023-10-01",
  useCdn: false,
  token: import.meta.env.VITE_SANITY_WRITE_TOKEN,
});
