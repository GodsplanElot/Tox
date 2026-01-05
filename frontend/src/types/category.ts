export type Category = {
  id: number;        // backend UUID later
  name: string;      // display name
  slug: string;      // URL-safe identifier
  description?: string;
  poster?: string;   // optional hero image
};

