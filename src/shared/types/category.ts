// Category shape returned by `GET /api/categories`. The backend
// prepends the synthetic "All" entry so the client doesn't have to
// special-case it in the chip strip.
export interface Category {
  name: string;
  count: number;
}
