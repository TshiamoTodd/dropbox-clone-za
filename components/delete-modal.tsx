"use client";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "@/firebase";
import { deleteDoc, doc } from "firebase/firestore";

import toast from "react-hot-toast";

export function DeleteModal() {
    const {user} = useUser();

    const [
        setIsDeleteModalOpen, 
        isDeleteModalOpen, 
        fileId, 
        setFileId
    ] = useAppStore(state => [
        state.setIsDeleteModalOpen, 
        state.isDeleteModalOpen, 
        state.fileId, 
        state.setFileId
    ]);

    async function deleteFile() {
        if(!user || !fileId) return;

        const toastId = toast.loading("Deleting...");

        const fileRef = ref(storage, `users/${user.id}/files/${fileId}`);
        try {
            deleteObject(fileRef).then(async() => {
                deleteDoc(doc(db, "users", user.id, "files", fileId)).then(() => {
                    toast.success("File successfully deleted!", {
                        id: toastId,
                    });
                });
            }).finally(() => {
                setIsDeleteModalOpen(false);
            });
        } catch (error) {
            setIsDeleteModalOpen(false);
            toast.error("Something went wrong!", {
                id: toastId,
            });
        }

        setIsDeleteModalOpen(false);
    };

    return (
        <Dialog 
            open={isDeleteModalOpen}
            onOpenChange={(isOpen) => {
                setIsDeleteModalOpen(isOpen);
            }}
        >
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Are you sure you want to delete?</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete your file.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex space-x-2 py-3">
                <Button
                    size={'sm'}
                    className="px-3 flex-1"
                    variant={'ghost'}
                    onClick={() => setIsDeleteModalOpen(false)}
                >
                    <span className="sr-only">Cancel</span>
                    <span>Cancel</span>
                </Button>
                <Button
                    type="submit"
                    size={'sm'}
                    className="px-3 flex-1"
                    variant={'destructive'}
                    onClick={() => deleteFile()}
                >
                    <span className="sr-only">Delete</span>
                    <span>Delete</span>
                </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    );
}
