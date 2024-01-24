"use client";
import { db, storage } from '@/firebase';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { use, useState } from 'react'
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
                await uploadPost(file);
            };
            reader.readAsArrayBuffer(file);
        });
    };

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