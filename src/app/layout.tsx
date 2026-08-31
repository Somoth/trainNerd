import type { Metadata } from "next";
import Link from "next/link";
import { ClerkProvider, Show, SignInButton, UserButton } from "@clerk/nextjs";
import "leaflet/dist/leaflet.css";
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
              <Link href="/rides" className="btn-ghost">
                Planned rides
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    userButtonTrigger: "cn-user-trigger",
                    userButtonAvatarBox: "cn-flap-avatar",
                    userButtonAvatarBox__open: "cn-flap-avatar-open",
                    userButtonAvatarImage: "cn-flap-avatar-image",
                    userButtonPopoverCard: "cn-user-popover",
                    userButtonPopoverActionButton: "cn-user-popover-action",
                    userButtonPopoverActionButtonIcon: "cn-user-popover-action",
                    userPreviewMainIdentifier: "cn-user-popover-identifier",
                  },
                }}
              />
            </Show>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
