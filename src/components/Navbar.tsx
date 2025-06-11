import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import { UserCircleIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";
import { mailApi } from "../api/mailApi";
import { useAuth } from "../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";

const navigation = [
    { name: "Dashboard", href: "#", current: true },
    { name: "Team", href: "#", current: false },
    { name: "Projects", href: "#", current: false },
    { name: "Calendar", href: "#", current: false },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export function Navbar() {
    const auth = useAuth();

    const userLogoutMutation = useMutation({
        mutationFn: () => mailApi.post("/logout"),
        onSettled: () => auth.changeUser(null),
    });

    return (
        <Disclosure as="nav" className="bg-gray-800">
            <div className="w-full px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <Link to={"/"}>
                                {/* <img
                                    alt="Your Company"
                                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                                    className="h-8 w-auto"
                                /> */}

                                <EnvelopeIcon
                                    aria-hidden="true"
                                    className="size-9 text-indigo-500"
                                />
                            </Link>
                        </div>
                    </div>

                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                            <div>
                                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-offset-gray-800 focus:outline-hidden cursor-pointer">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">
                                        Open user menu
                                    </span>
                                    {/* <img
                                        alt=""
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        className="size-8 rounded-full"
                                    /> */}
                                    <UserCircleIcon
                                        aria-hidden="true"
                                        className="size-9 rounded-full text-white"
                                    />
                                </MenuButton>
                            </div>
                            <MenuItems
                                transition
                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                            >
                                <MenuItem>
                                    <Link
                                        to={"/profile"}
                                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-200 data-focus:outline-hidden"
                                    >
                                        Perfil
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        href="#logout"
                                        onClick={() =>
                                            userLogoutMutation.mutate()
                                        }
                                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-200 data-focus:outline-hidden"
                                    >
                                        Logout
                                    </a>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            aria-current={item.current ? "page" : undefined}
                            className={classNames(
                                item.current
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                "block rounded-md px-3 py-2 text-base font-medium",
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}
