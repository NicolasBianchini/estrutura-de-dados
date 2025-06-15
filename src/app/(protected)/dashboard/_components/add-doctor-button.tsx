import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AddDoctorButton() {
    return (
        <Link href="/doctors">
            <Button>
                Gerenciar Advogados
            </Button>
        </Link>
    );
} 