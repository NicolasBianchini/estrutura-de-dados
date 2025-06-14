"use client";

import { CalendarIcon, ClockIcon, DollarSignIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Doctor {
    id: string;
    name: string;
    specialty: string;
    email: string;
    avatarImageUrl?: string;
    availableFromTime: string;
    availableToTime: string;
    availableFromWeekDay: number;
    availableToWeekDay: number;
    appointmentPrice?: string;
    bio?: string;
}

interface DoctorCardPublicProps {
    doctor: Doctor;
}

const DoctorCardPublic = ({ doctor }: DoctorCardPublicProps) => {
    const doctorInitials = doctor.name
        .split(" ")
        .map((name) => name[0])
        .join("");

    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const fromDay = weekDays[doctor.availableFromWeekDay];
    const toDay = weekDays[doctor.availableToWeekDay];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback>{doctorInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-sm font-medium">{doctor.name}</h3>
                        <p className="text-muted-foreground text-sm">{doctor.specialty}</p>
                        {doctor.bio && (
                            <p className="text-xs text-muted-foreground mt-1">{doctor.bio}</p>
                        )}
                    </div>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col gap-2">
                <Badge variant="outline">
                    <CalendarIcon className="mr-1" />
                    {fromDay} a {toDay}
                </Badge>
                <Badge variant="outline">
                    <ClockIcon className="mr-1" />
                    {doctor.availableFromTime} às {doctor.availableToTime}
                </Badge>
                {doctor.appointmentPrice && (
                    <Badge variant="outline">
                        <DollarSignIcon className="mr-1" />
                        {doctor.appointmentPrice}
                    </Badge>
                )}
            </CardContent>
        </Card>
    );
};

export default DoctorCardPublic; 