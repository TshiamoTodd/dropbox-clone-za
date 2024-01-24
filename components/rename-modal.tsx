"use client";
import { db, storage } from '@/firebase';
import { useAppStore } from '@/store/store';
import { useUser } from '@clerk/nextjs';
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import toast from 'react-hot-toast';
import { doc, updateDoc } from 'firebase/firestore';


function RenameModal() {
    const {user} = useUser();
    const [input, setInput] = useState("");

    const [
        setIsRenameModalOpen, 
        isRenameModalOpen, 
        fileId,
        filename, 
    ] = useAppStore(state => [
        state.setIsRenameModalOpen, 
        state.isRenameModalOpen, 
        state.fileId,
        state.filename, 
    ]);

    const renameFile = async () => {
        if(!user || !fileId) return;

        const toastId = toast.loading("Renaming...");

        try {
            await updateDoc(doc(db, `users/${user.id}/files/${fileId}`), {
                filename: input,
            });
    
            toast.success("File successfully renamed!", {
                id: toastId,
            });
        } catch (error) {
            toast.error("Something went wrong!", {
                id: toastId,
            });
        }

        setInput("");
        setIsRenameModalOpen(false);
    }

    return (
        <Dialog
            open={isRenameModalOpen}
            onOpenChange={(isOpen) => {
                setIsRenameModalOpen(isOpen);
            }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Rename the file</DialogTitle>
                <Input
                    id="link"
                    defaultValue={filename}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDownCapture={(e) => {
                        if (e.key === "Enter") {
                            renameFile();
                        }
                    }}
                />

                <div className='flex justify-end space-x-2 py-3'>
                    <Button
                        size={'sm'}
                        className='px-3'
                        variant={'ghost'}
                        onClick={() => {
                            setIsRenameModalOpen(false);
                        }}
                    >
                        <span className="sr-only">Cancel</span>
                        <span>Cancel</span>
                    </Button>
                    <Button
                        size={'sm'}
                        className='px-3'
                        onClick={() => {
                            renameFile();
                        }}
                    >
                        <span className="sr-only">Rename</span>
                        <span>Rename</span>
                    </Button>
                </div>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
            </DialogFooter>
          </DialogContent>
        </Dialog>
    );
}

export default RenameModal