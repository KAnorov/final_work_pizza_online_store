

import { cn } from "@/shared/lib/utils";
import { Container } from "./container";
import Image from "next/image";
import { Button } from "../ui";
import { User } from "lucide-react";
import Link from "next/link";
import { CartButton, SearchInput } from ".";


interface Props {
    className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
    return <>
        <header className={cn('border border-b', className)}>
            <Container className="flex items-center justify-between py-12">

                {/* {Левоя часть } */}
            

                <Link href="/">
                    <div className="flex items-center gap-4">
                        <Image src="/logo.png" alt="logo" width={35} height={35} />
                        <div>
                            <h1 className="text-2xl uppercase font-black">Konstantin's pizzeria</h1>
                            <p className="text-sm text-gray-400 leading-3">вкусно и торчка!</p>
                        </div>
                    </div>
                </Link>

            {/* {Середина } */}
            <div className="mx-10 flex-1">
                <SearchInput />
            </div>

                {/* {Правая часть } */}
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="flex items-center gap-1">
                        <User size={16} />
                        Войти
                    </Button>
                    
                       <CartButton />
                    

                </div>
            </Container>
        </header>

    </>
}