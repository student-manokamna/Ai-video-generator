import { SidebarDemo } from "@/module/dashboard/Navbar";
import React from "react";

export default function SharedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <SidebarDemo>{children}</SidebarDemo>;
}
