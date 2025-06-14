import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function getLawyerByUserId(userId: string) {
    const q = query(
        collection(db, "users"),
        where("role", "==", "admin"),
        where("id", "==", userId)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const data = snapshot.docs[0].data();
    return { id: data.id || snapshot.docs[0].id, ...data };
} 