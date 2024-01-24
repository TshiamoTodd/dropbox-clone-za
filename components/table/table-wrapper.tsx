"use client";
import { FileType } from '@/typings';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton"

import { DataTable } from './table';
import { columns } from './columns';
import { useUser } from '@clerk/nextjs';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase';

function TableWrapper({
    skeletonFiles
}: {
    skeletonFiles: FileType[]
}) {
    const {user} = useUser();
    const [initialFiles, setInitialFiles] = useState<FileType[]>([]);
    const [sort, setSort] = useState<"asc"| "desc">("desc");

    const [docs, loading, error] = useCollection(
        user &&
            query(
                collection(db, "users", user.id, "files"),
                orderBy("timestamp", sort)
            )
    );

    useEffect(() => {
        if(!docs) return;

        const files: FileType[] = docs.docs.map((doc) => ({
            id: doc.id,
            filename: doc.data().filename || doc.id,
            timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
            fullName: doc.data().fullName,
            downloadURL: doc.data().downloadURL,
            type: doc.data().type,
            size: doc.data().size,
        }));

        setInitialFiles(files);
    }, [docs]);

    if(docs?.docs.length === undefined) return (
        <div className='flex flex-col'>
            <Button variant={'outline'} className='ml-auto w-36 h-10 mb-5'>
                <Skeleton className='w-full h-5'/>
            </Button>

            <div className='border rounded-lg'>
                <div className='border-b h-12'/>
                    {skeletonFiles.map((file) => (
                        <div
                            key={file.id}
                            className='flex items-center w-full space-x-4 p-5'
                        >
                            <Skeleton className='w-12 h-12'/>
                            <Skeleton className='w-full h-12'/>

                        </div>
                    ))}

                    {skeletonFiles.length === 0 && (
                        <div className='flex items-center w-full space-x-4 p-5'>
                            <Skeleton className='w-12 h-12'/>
                            <Skeleton className='w-full h-12'/>
                        </div>
                    )}
            </div>
        </div>
    );

    return (
        <div className='flex flex-col space-y-5 pb-10'>
            <Button
                onClick={() => setSort(sort === "desc" ? "asc" : "desc")}
                variant={'outline'}
                className='ml-auto w-fit'
            >
                Sort By {sort === "desc" ? "Newest" : "Oldest"}
            </Button>
            <DataTable columns={columns} data={initialFiles}/>
        </div>
    );
}

export default TableWrapper