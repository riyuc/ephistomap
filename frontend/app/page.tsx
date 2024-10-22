import Image from "next/image";
import Container from "../components/container";
import Navbar from "../components/navbar";
import { GitHubRepoForm } from "@/components/github-repo-form";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <Container>
        <Navbar />
        <GitHubRepoForm />
    </Container>
  );
}
