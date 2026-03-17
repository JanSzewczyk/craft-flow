import { SignUp } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: PageProps<"/sign-up/[[...sign-up]]">) {
  const params = await searchParams;
  if (!params.plan) redirect("/pricing");

  return <SignUp />;
}
