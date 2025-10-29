<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details. -->



# Image Editor

A minimal image editor built with Next.js and Konva.js for client-side canvas manipulation.

## Tech Stack

- **Next.js 14** - App Router
- **Konva.js** - Canvas rendering
- **Zustand** - State management
- **PostgreSQL** - Design persistence
- **Prisma** - Database ORM
- **Tailwind CSS** - Styling


I chose client-side compositing because it allows instant previews and exports directly in the browser without putting extra load on the server. It’s also simpler to implement and works offline, which is sufficient for the image sizes and layer complexity in this project.

The canvas state is saved to PostgreSQL only when explicitly requested, keeping the design persistent while maintaining smooth client-side editing.

## Setup

1. **Install dependencies**
```bash
npm install
```

2. **Create `.env` file**
```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/youanai_editor?schema=public"
UPLOAD_DIR="./uploads"
```

3. **Start PostgreSQL**
```bash
docker compose up -d
```

4. **Setup Prisma**
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

5. **Run dev server**
```bash
npm run dev
```

## Features

### Layer Management
- **Add Base Image** - Set a background layer for your design
- **Upload Images** - Add new images to asset library
- **Multiple Layers** - Stack and organize multiple image layers
- **Reorder Layers** - Move layers up/down in the stack (z-index control)
- **Toggle Visibility** - Show/hide individual layers
- **Layer Selection** - Click to select and manipulate specific layers

### Image Transformations
- **Flip Horizontally** - Mirror image on horizontal axis
- **Flip Vertically** - Mirror image on vertical axis  
- **Crop Mode** - Interactive crop tool with visual overlay
- **Crop Layer** - Apply crop to selected layer
- **Drag & Position** - Move layers anywhere on canvas
- **Delete Layer** - Remove unwanted layers

### Asset Library
- Upload and store multiple images
- Grid view of all assets
- Click any asset to add as new layer
- Persistent storage in database

### Save & Export
- **Save Design** - Persist entire design state (layers, positions, transforms)
- **Export PNG** - High-quality PNG output
- **Export JPEG** - Compressed JPEG output

## Future Improvements

- **Fix Crop Bounding Box** - Currently the crop mode with bounding box needs refinement
- **Undo/Redo History** - Implement history stack to undo and redo actions for better workflow
- **Unit Tests** - Add tests for transform utilities and core canvas operations