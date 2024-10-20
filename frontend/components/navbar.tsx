import Link from "next/link";
import { Button } from "./ui/button";


export default function Navbar(){
    return (
        <nav className="flex justify-between items-center p-4">
            <div className="flex">Logo</div>
            {/* TODO: add Logo Image */}
            <div className="flex space-x-4 items-center justify-center">
                <Button className="rounded-full h-12 bg-violet-500 hover:bg-fuchsia-300 bg-transparent shadow-none text-black hover:text-white" asChild>
                    <Link href="/login">Login</Link>
                </Button>
                <Button className="rounded-full h-12 bg-fuchsia-300 hover:bg-violet-500 text-slate-100" asChild>
                    <Link href="/register">Register</Link>
                </Button>
            </div>
        </nav>
    )
}