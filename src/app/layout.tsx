import type { Metadata } from "next";
import { ClerkProvider, Show, SignInButton, UserButton } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "trainNerd",
  description: "A life-list for trackside obsessives.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full antialiased">
        <body className="min-h-full flex flex-col">
          <header className="site-header">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="btn btn-ghost">Sign in</button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
