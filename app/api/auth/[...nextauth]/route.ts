// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";

// Export GET and POST handlers for NextAuth
export const { GET, POST } = handlers;
