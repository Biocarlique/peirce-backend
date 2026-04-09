-- CreateEnum
CREATE TYPE "HypothesisStatus" AS ENUM ('TESTING', 'SUCCESS', 'REFUTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Observation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "situation" TEXT NOT NULL,
    "trigger" TEXT NOT NULL,
    "thoughts" TEXT NOT NULL,
    "emotions" TEXT NOT NULL,
    "actions" TEXT NOT NULL,
    "consequences" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Observation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hypothesis" (
    "id" TEXT NOT NULL,
    "observationId" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "successCondition" TEXT NOT NULL,
    "failCondition" TEXT NOT NULL,
    "preparation" TEXT NOT NULL,
    "heuristic" TEXT NOT NULL,
    "status" "HypothesisStatus" NOT NULL DEFAULT 'TESTING',
    "minDays" INTEGER NOT NULL DEFAULT 7,
    "maxFailures" INTEGER NOT NULL DEFAULT 2,
    "maxSkips" INTEGER NOT NULL DEFAULT 2,
    "targetWinRate" INTEGER NOT NULL DEFAULT 80,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Hypothesis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingEntry" (
    "id" TEXT NOT NULL,
    "hypothesisId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "situationDetails" TEXT,
    "attemptMade" BOOLEAN NOT NULL,
    "isSuccess" BOOLEAN,
    "notes" TEXT,
    "isExternalFactor" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackingEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuccessVault" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hypothesisId" TEXT NOT NULL,
    "heuristicText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuccessVault_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hypothesis" ADD CONSTRAINT "Hypothesis_observationId_fkey" FOREIGN KEY ("observationId") REFERENCES "Observation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingEntry" ADD CONSTRAINT "TrackingEntry_hypothesisId_fkey" FOREIGN KEY ("hypothesisId") REFERENCES "Hypothesis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuccessVault" ADD CONSTRAINT "SuccessVault_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuccessVault" ADD CONSTRAINT "SuccessVault_hypothesisId_fkey" FOREIGN KEY ("hypothesisId") REFERENCES "Hypothesis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
