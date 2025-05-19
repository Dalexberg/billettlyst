import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanity = createClient({
  projectId: 'e0ntvzr5',
  dataset: 'production',
  apiVersion: '2024-05-01',
  useCdn: true,
});

const builder = imageUrlBuilder(sanity);

export function urlFor(source) {
  return builder.image(source);
}
