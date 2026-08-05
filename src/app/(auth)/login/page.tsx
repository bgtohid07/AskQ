import { LoginForm } from "@/components/auth/LoginForm";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-[var(--secondary)] mt-2">Log in to your account</p>
      </div>
      <LoginForm />
      <div className="my-6 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-[var(--border)] after:mt-0.5 after:flex-1 after:border-t after:border-[var(--border)]">
        <p className="mx-4 mb-0 text-center text-sm font-semibold text-[var(--secondary)]">OR</p>
      </div>
      <GoogleSignInButton />
      <p className="text-center mt-6 text-sm text-[var(--secondary)]">
        Don't have an account? <Link href="/signup" className="text-[var(--accent)] hover:underline font-medium">Sign up</Link>
      </p>
    </>
  );
}
