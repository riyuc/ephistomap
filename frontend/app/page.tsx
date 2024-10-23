import Image from "next/image";
import Container from "../components/container";
import Navbar from "../components/navbar";
import { GitHubRepoForm } from "@/components/github-repo-form";
import Hero from "@/components/hero";
import ProductDemo from "@/components/product-demo";

export default function Home() {
  return (
    <Container>
        <Navbar />
        <ProductDemo />
    </Container>
  );
}
