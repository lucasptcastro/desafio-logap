import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { auth } from "@/lib/auth";

import { LoginForm } from "./_components/login-form";

export default async function AuthenticationPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/dashboard");
  }

  const roles = await db.query.rolesTable.findMany();

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <LoginForm roles={roles} />
    </div>
  );
}
