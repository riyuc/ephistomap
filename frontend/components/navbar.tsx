import Link from "next/link";
import { Button } from "./ui/button";


export default function Navbar(){
    return (
        <nav className="flex justify-between items-center w-full p-4 fixed top-0 z-20 backdrop-blur-lg">
            <div className="flex">Logo</div>
            {/* TODO: add Logo Image */}
            <div className="flex space-x-4 items-center justify-center">
                <Button className="rounded-full h-12 hover:bg-violet-500 bg-transparent shadow-none text-black hover:text-white" asChild>
                    <Link href="/login">Login</Link>
                </Button>
                <Button className="rounded-full h-12 bg-fuchsia-300 hover:bg-violet-500 text-slate-100" asChild>
                    <Link href="/register">Register</Link>
                </Button>
            </div>
        </nav>
    )
}