"use client"

import { COLOR_EXTENTION_MAP } from "@/constant";
import { FileType } from "@/typings"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import prettyBytes from "pretty-bytes";
import {FileIcon, FileIconProps, defaultStyles} from "react-file-icon";

export const columns: ColumnDef<FileType>[] = [
    {
        accessorKey: "type",
        header: "Type",
        cell: ({renderValue, ...props}) => {
            const type = renderValue() as string;
            const extention: string = type.split("/")[1];
            return (
                <div className="w-10">
                    <FileIcon
                        extension={extention}
                        labelColor={COLOR_EXTENTION_MAP[extention]}
                        {...(defaultStyles as Record<string, Partial<FileIconProps>>)[extention]}
                    />
                </div>
            );
        },
    },
    {
        accessorKey: "filename",
        header: "Filename",
    },
    {
        accessorKey: "timestamp",
        header: "Date added",
    },
    {
        accessorKey: "size",
        header: "File size",
        cell: ({renderValue, ...props}) => {
            return<span>{prettyBytes(renderValue() as number)}</span>
        }
    },
    {
        accessorKey: "downloadURL",
        header: "Link",
        cell: ({renderValue, ...props}) => {
            return (
                <a
                    href={renderValue() as string}
                    target="_blank"
                    className="underline cursor-pointer text-blue-500 hover:text-blue-600"
                >
                    Download
                </a>
            )
        }
    },
]
