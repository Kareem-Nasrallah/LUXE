import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'iidkm49g',
  dataset: 'production',
  apiVersion: '2023-10-01',
  useCdn: true,
})
