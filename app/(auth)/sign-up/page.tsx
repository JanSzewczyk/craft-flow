import { redirect } from "next/navigation";
import { SignUpCard } from "~/features/auth";

export default async function SignUpPage({ searchParams }: PageProps<"/sign-up">) {
  const params = await searchParams;
  if (!params.plan) redirect("/pricing");

  return <SignUpCard />;
}
