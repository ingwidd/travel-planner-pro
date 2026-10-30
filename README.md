# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Private diary image storage

Diary images are stored in a **private Supabase Storage bucket**. The browser
sends a signed-in Firebase ID token to the API for a one-use upload token, then
uploads directly to Supabase. The API checks trip ownership, stores the object
path in the diary row, and returns short-lived signed image URLs. This keeps
large image files out of the API request body. Never put the Supabase
service-role key in this frontend project or in a `VITE_` variable.

1. Create a private Supabase bucket named `diary-images` (or set
   `SUPABASE_DIARY_BUCKET` to a different name). Set its file size limit to
   10 MB and its allowed MIME types to `image/avif`, `image/gif`, `image/jpeg`,
   `image/png`, and `image/webp`. Browser clients should not have bucket
   policies granting direct access; the API uses the service-role key.
2. Configure these variables on the API server:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_DIARY_BUCKET` (optional; defaults to `diary-images`)
   - `FIREBASE_SERVICE_ACCOUNT` (the Firebase Admin service-account JSON)
3. Configure these frontend variables:
   - `VITE_SUPABASE_URL` (the same Supabase project URL)
   - `VITE_SUPABASE_ANON_KEY` (the project's public anon/publishable key)
   - `VITE_SUPABASE_DIARY_BUCKET` (optional; defaults to `diary-images`)
   - `VITE_API_URL` (the API deployment URL)
4. Install and deploy the API repository after adding its server-only
   variables. The bucket name must match in both projects.

The frontend rejects images over 10 MB, and the API allowlists image MIME types
before issuing an upload token. Configure the bucket itself to enforce the
10 MB maximum and allowed MIME types. New images are stored as user-owned
object paths; database rows keep those paths, not signed URLs. Previously saved
Firebase image URLs continue to display, but are not automatically migrated
to Supabase.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
