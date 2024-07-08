# Table of context
1. Introduction
2. Installation
3. Project Structure
4. Authentication with clerk
5. File Upload with React Dropzone
6. Storing Files in Firebase Firestore
7. Running the Application
8. Deployment

# Introduction
This documentation provides an overview of a Dropbox clone application built using Next.js. The application allows users to authenticate using Clerk and upload files using the React Dropzone component. Uploaded files are stored in Firebase Firestore.

## Installation
To set up the application, follow these steps:
1. **Clone the repository:**

```
git clone https://github.com/TshiamoTodd/dropbox-clone-za.git
cd dropbox-clone-za
```
2. **Install dependencies:**
```
npm install
```

3. **Set up Firebase:**

- Create a Firebase project at Firebase Console.
- Add a web app to your Firebase project.
- Copy your Firebase configuration and add it to your .env.local file.

```
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-auth-domain
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
FIREBASE_APP_ID=your-app-id

```

3. **Set up Clerk Authentication**
- Sign up for Clerk at Clerk.dev.
- Create a Clerk application and get your Frontend API.
- Add your Clerk Frontend API to your .env.local file.

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
```

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
