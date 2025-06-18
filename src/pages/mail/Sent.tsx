import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { LayoutInner } from "../../components/LayoutInner";

export function Sent() {
    return (
        <LayoutInner>
            <div className="flex flex-col h-full bg-neutral-700 rounded-xl overflow-hidden">
                <div className="flex items-center h-12 px-4">
                    {/* Actions */}
                    <div className="flex items-center gap-2 cursor-pointer select-none">
                        <ArrowPathIcon className="text-neutral-400 size-5" />
                        <span className="text-sm text-white">Atualizar</span>
                    </div>
                </div>

                <div className="flex flex-col border-t-1 border-neutral-500">
                    <ul className="divide-y divide-neutral-500"></ul>
                </div>
            </div>
        </LayoutInner>
    );
}
