import { completeSignUp, SSOCallbackHandler } from "~/features/auth";

export default function SSOCallbackPage() {
  return <SSOCallbackHandler onCompleteSignUpAction={completeSignUp} />;
}
