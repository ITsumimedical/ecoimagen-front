import { initAuth } from "@/services/auth";

export default async (context) => {
    await initAuth(context);
};
