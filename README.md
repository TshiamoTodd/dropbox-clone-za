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

```env
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-auth-domain
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
FIREBASE_APP_ID=your-app-id

```

4. **Set up Clerk Authentication**
- Sign up for Clerk at [Clerk.com](https://clerk.com/).
- Create a Clerk application and get your Frontend API.
- Add your Clerk Frontend API to your .env.local file.

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
```

## Project structure
```
dropbox-clone/
├── app/
│   ├── layout.tsx
│   ├── favicon.ico
│   ├── global.css
│   ├── page.tsx
│   ├── dashboard/
│       └── page.tsx
├── components/
│   ├── delete-modal.tsx
│   ├── dropzone.tsx
│   ├── header.tsx
│   ├── rename-modal.tsx
│   ├── theme-provider.tsx
│   ├── theme-toggler.tsx
│   ├── table/
│       ├── columns.tsx
│       ├── table-wrapper.tsx
│       └── table.tsx
│   ├── ui/
├── lib/
│   ├── utils.ts
├── public/
├── store/
│   └── store.ts
├── .env.local
├── firebase.ts
├── next.config.js
├── package.json
└── README.md

```

# Authentication with Clerk
For more information on setting up Clerk with your Next.js application check out the official [Clerk Nextjs Docs](https://clerk.com/docs/quickstarts/nextjs) or My Blog on "[How to set up user authentication with clerk](#)"

1. **Install the clerk SDK**
```
npm install @clerk/nextjs
```

2. **Set up your environment variables**
On your Clerk dashboard you will find clerk publishable and secret key in your API keys tab, paste them in your `.env` file
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_SECRET_KEY
```

# Storing files in Firebase Firestore
1. **Configuring Firebase**
In your firebase.js file, initialize Firebase:

```typescript
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const storage = firebase.storage();

export { db, storage };
```

2. **Set up react-dropzone to upload files**
We created a Dropzone component using react-dropzone that runs an onDrop function when a file is dragged and dropped on it.
```tsx
"use client";
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import React, { use, useState } from 'react';
import DropzoneComponent from 'react-dropzone';

import toast from 'react-hot-toast';

function Dropzone() {
    const [loading, setLoading] = useState(false);
    const {isLoaded, isSignedIn, user} = useUser();

    const onDrop = (acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();

            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');
            reader.onload = async () => {
                console.log('upload files');
                //await uploadPost(file);
            };
            reader.readAsArrayBuffer(file);
        });
    };

    //const uploadPost = async () => {}

    const maxSize = 20971520; // 20MB
    

    return (
        <DropzoneComponent 
            minSize={0} 
            maxFiles={maxSize} 
            onDrop={onDrop}
        >
            {({
                getRootProps, 
                getInputProps,
                isDragActive,
                isDragReject,
                fileRejections,
            }) => {

                const isFileTooLarge = fileRejections.length > 0 && fileRejections[0].file.size > maxSize;

                return (
                    <section className='m-6'>
                        <div {...getRootProps()}
                            className={cn(
                                'w-full h-52 flex justify-center items-center border border-dashed rounded-lg text-center',
                                isDragActive 
                                ? 'bg-[#035FFE] text-white animate-pulse' 
                                : 'bg-slate-100/50 dark:bg-slate-800 text-slate-400',
                            )}
                        >
                            <input {...getInputProps()} />
                            {!isDragActive && 'Click here or drop a file to upload!'}
                            {isDragActive && !isDragReject && "Drop to upload this file!"}
                            {isDragReject && "File type not accepted, sorry!"}
                            {isFileTooLarge && (
                                <div className='text-danger mt-2'>File is too large</div>
                            )}
                        </div>
                    </section>
            )}}
        </DropzoneComponent>
    );
}

export default Dropzone;
```

3. **Upload Files to Firebase Firestore**
To upload the file to Firebase we use this fuction that creates a document that contains metadata about the file we want to store and the file itself is stored in a storage bucket on Firebase storage.
```typescript
const uploadPost = async (selectedFile: File) => {
    if(loading) return;
    if(!user) return;
  
    const toastId = toast.loading("Uploading...");
  
    setLoading(true); 
  
    // TODO: Upload file to server
    //addDoc -> users/[userId]/files
    const docRef = await addDoc(collection(db, "users", user.id, "files"), {
        userId: user.id,
        filename: selectedFile.name,
        fullName: user.fullName,
        profileImg: user.imageUrl,
        timestamp: serverTimestamp(),
        type: selectedFile.type,
        size: selectedFile.size,
    });
  
    const imageRef = ref(storage, `users/${user.id}/files/${docRef.id!}`);
  
    await uploadBytes(imageRef, selectedFile).then(async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "users", user.id, "files", docRef.id), {
            downloadURL: downloadURL,
        }).then(() => {
            toast.success("File successfully uploaded!", {
                id: toastId,
            });
        });
    });
  
    setLoading(false);
};
```

4. **Run the Application**

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

# Conclusion
This documentation covers the setup and implementation of a Dropbox clone application using Next.js, Clerk for authentication, React Dropzone for file upload, and Firebase Firestore for storing files. This guide provides a foundation for building a robust file storage application.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out my [Blog](#) for more details.
