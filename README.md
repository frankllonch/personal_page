# Frank Llonch — personal page

One page: a statement, the projects, experience, education, contact. Next.js, Tailwind, Inter, and a text scramble. Content lives in `lib/data.ts` and `lib/projects.ts`.

## 🚀 Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Project Structure

```
next-app/
├── app/
│   ├── page.tsx          # Main home page with all content
│   ├── layout.tsx        # Root layout with metadata
│   └── globals.css       # Global styles
├── components/
│   ├── Bio.tsx           # Bio section component
│   ├── Project.tsx       # Project card component (client component)
│   ├── ExperienceCard.tsx # Work/education card component
│   └── Timeline.tsx      # Timeline component with line paths
└── public/
    └── images/           # All project images
```

## 🎨 Features

- **Modern Stack**: Next.js 15 with App Router, TypeScript, and Tailwind CSS
- **Responsive Design**: Mobile-first design that works on all devices
- **Interactive Elements**: Hover animations and clickable project cards
- **Optimized Images**: Using Next.js Image component for automatic optimization
- **Clean Architecture**: Separated components for easy maintenance

## 📝 Customization

### Update Content

All content is in `app/page.tsx`. You can easily modify:
- Bio text
- Projects list
- Work experience
- Education history

### Styling

The project uses Tailwind CSS. You can:
- Modify colors in `tailwind.config.js`
- Update global styles in `app/globals.css`
- Add custom animations and effects

## 🔧 Build for Production

```bash
npm run build
npm start
```

## 📦 Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React 19** - Latest React features

## 🎯 Key Improvements from Vue Version

1. **Type Safety**: Full TypeScript support
2. **Server Components**: Better performance with React Server Components
3. **Modern Standards**: Uses latest Next.js best practices
4. **Simplified Structure**: Cleaner component hierarchy
5. **Better DX**: Hot module replacement and fast refresh

## 📄 License

Feel free to fork and customize for your own use!
