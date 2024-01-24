import Dropzone from '@/components/dropzone';
import TableWrapper from '@/components/table/table-wrapper';
import { db } from '@/firebase';
import { FileType } from '@/typings';
import { auth } from '@clerk/nextjs'
import { collection, getDocs } from 'firebase/firestore';
import React from 'react'

async function Dashboard() {
  const {userId} = auth();

  const docResults = await getDocs(collection(db, "users", userId!, "files"));
  
  const skeletonFiles: FileType[] = docResults.docs.map((doc) => ({
    id: doc.id,
    filename: doc.data().filename || doc.id,
    timestamp: new Date(doc.data().timestamp.seconds * 1000) || undefined,
    fullName: doc.data().fullName,
    type: doc.data().type,
    size: doc.data().size,
    downloadURL: doc.data().downloadURL,
  }));

  return (
    <div>
      <Dropzone/>

      <section className='container space-y-5'>
        <h2 className='font-bold'>All files</h2>
        <div>
          {/* Table wrapper */}
          <TableWrapper
            skeletonFiles={skeletonFiles}
          />
        </div>
      </section>
    </div>
  )
}

export default Dashboard