import type { PropsWithChildren } from "react";
import { Sidebar } from "./Siderbar";

type LayoutProps = PropsWithChildren;

export function LayoutInner({ children }: LayoutProps) {
    return (
        <div className="flex flex-row grow">
            <Sidebar />
            <main className="flex flex-col flex-1 py-4 px-2 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
