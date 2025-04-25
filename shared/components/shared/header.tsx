'use client';

import { cn } from "@/shared/lib/utils";
import { Container } from "./container";
import Image from "next/image";
import Link from "next/link";
import { CartButton, ProfileButton, SearchInput } from ".";
import { useState } from "react";
import { AuthModal } from "./modals/auth-modal/auth-modal";



interface Props {
    className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
 const [open, setOpen] = useState(false);

    return <>
        <header className={cn('border border-b', className)}>
            <Container className="flex items-center justify-between py-12">

                {/* {Левоя часть } */}


                <Link href="/">
                    <div className="flex items-center gap-4">
                        <Image src="/logo.png" alt="logo" width={35} height={35} />
                        <div>
                            <h1 className="text-2xl uppercase font-black">Konstantin&apos;s pizzeria</h1>
                            <p className="text-sm text-gray-400 leading-3">вкусно и точка!</p>
                        </div>
                    </div>
                </Link>

                {/* {Середина } */}
                <div className="mx-10 flex-1">
                    <SearchInput />
                </div>

                {/* {Правая часть } */}
                <div className="flex items-center gap-3">
                   <AuthModal
                    open={open} 
                    onClose={() => setOpen(false)}
                   />
                   <ProfileButton
                   onClickSignIn={() => setOpen(true)}
                   />

                    <CartButton />


                </div>
            </Container>
        </header>

    </>
}