import Image from "next/image";
import Container from "../components/container";
import Navbar from "../components/navbar";
import { GitHubRepoForm } from "@/components/github_repo_form";

export default function Home() {
  return (
    <Container>
      <Navbar />
      <GitHubRepoForm />
    </Container>
  );
}
