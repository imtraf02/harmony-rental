import type { YogaInitialContext } from "graphql-yoga";
import { prisma } from "./db";
import type { PrismaClient } from "./generated/prisma/client";

export interface Context extends YogaInitialContext {
	prisma: PrismaClient;
}

interface JwtPayload {
	uid: string;
}

export async function createContext(
	initialContext: YogaInitialContext,
): Promise<Context> {
	return {
		...initialContext,
		prisma,
	};
}
