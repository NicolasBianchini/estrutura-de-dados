import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AddDoctorButton() {
    return (
        <Link href="/doctors">
            <Button>
                <Plus className="h-4 w-4 mr-2" />
                Gerenciar Advogados
            </Button>
        </Link>
    );
} 