import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#1A1A2E] flex items-center justify-center">
      <SignIn />
    </main>
  );
}
