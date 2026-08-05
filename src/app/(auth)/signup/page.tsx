import { SignupForm } from "@/components/auth/SignupForm";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import Link from "next/link";

export default function SignupPage() {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-[var(--secondary)] mt-2">Start receiving questions</p>
      </div>
      <SignupForm />
      <div className="my-6 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-[var(--border)] after:mt-0.5 after:flex-1 after:border-t after:border-[var(--border)]">
        <p className="mx-4 mb-0 text-center text-sm font-semibold text-[var(--secondary)]">OR</p>
      </div>
      <GoogleSignInButton />
      <p className="text-center mt-6 text-sm text-[var(--secondary)]">
        Already have an account? <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">Log in</Link>
      </p>
    </>
  );
}
