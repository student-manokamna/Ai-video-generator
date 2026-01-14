import { requiredAuth } from "@/module/auth/utils/auth-utils";
import Image from "next/image";

export default async function Home() {
  await requiredAuth()
  return (
    <div>hi</div>
  );
}
