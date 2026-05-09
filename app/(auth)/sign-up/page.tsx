import { redirect } from "next/navigation";
import { SignUpCard, completeSignUp } from "~/features/auth";
import { completeClientSignUp } from "~/features/auth/server/actions/complete-client-sign-up";

export default async function SignUpPage({ searchParams }: PageProps<"/sign-up">) {
  const params = await searchParams;

  if (params.invite) {
    const inviteToken = (Array.isArray(params.invite) ? params.invite[0] : params.invite) ?? null;
    const rawEmail = Array.isArray(params.email) ? params.email[0] : params.email;

    async function completeClientSignUpAction(userId: string) {
      "use server";
      return completeClientSignUp({ inviteToken, userId });
    }

    return (
      <SignUpCard
        onCompleteSignUpAction={completeClientSignUpAction}
        redirectTo="/client"
        variant="client"
        defaultEmail={rawEmail}
      />
    );
  }

  if (!params.plan) redirect("/pricing");

  return <SignUpCard onCompleteSignUpAction={completeSignUp} />;
}
