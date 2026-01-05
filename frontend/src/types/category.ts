export type Category = {
  id: string;        // backend UUID later
  name: string;      // display name
  slug: string;      // URL-safe identifier
  description?: string;
  poster?: string;   // optional hero image
};
