"use client";

import Head from "@/components/head";
import BodyCenter from "@/components/bodyCenter";
import { ContractContextProvider } from "@/components/Contents";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full">
      <ContractContextProvider>
        <Head />
        <BodyCenter />
      </ContractContextProvider>
    </div>
  );
}
