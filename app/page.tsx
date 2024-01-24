import { UserButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="">
      <div className="flex flex-col lg:flex-row items-center bg-[#2B2929] dark:bg-slate-800">
        <div className="p-10 flex flex-col bg-[#2B2929] dark:bg-slate-800 text-white space-y-5">
          <h1 className="text-5xl font-bold">
            Welcome to Dropbox. <br /> <br />
            Storing everything for you and your business needs. All in one palce.
          </h1>

          <p className="pb-20">
            Enhance your personal storage with Dropbox file storage and sharing, offering a simple and efficient way
            to upload, organize, and access files from anywhere. Securely store important documents and media
            files, collaborate with coworkers on shared files, and access your files from any device.
          </p>

          <Link href="/dashboard" className="flex cursor-pointer bg-blue-500 p-5 w-fit">
            Try it for free!
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>

        <div className="bg-[#1E1919] dark:bg-slate-800 h-full p-10">
          <video
            autoPlay
            loop
            muted
            className="rounded-lg"
          >
            <source src="https://aem.dropbox.com/cms/content/dam/dropbox/warp/en-us/overview/lp-header-graphite200-1920x1080.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <p className="text-center font-bold text-xl pt-5">
        Disclaimer
      </p>
      <p className="text-center font-light p-2">
        This website is a clone of Dropbox. It is not affiliated with Dropbox or any of its subsidiaries in any way.
        It is a project for learning purposes only.
      </p>
    </main>
  );
}
