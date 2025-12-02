import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Direct connection string for local development
    url: "postgresql://postgres:postgres@localhost:5432/study_planner",
  },
});
