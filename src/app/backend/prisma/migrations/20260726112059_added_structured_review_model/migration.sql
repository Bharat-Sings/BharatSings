-- CreateTable
CREATE TABLE "structured_review" (
    "id" SERIAL NOT NULL,
    "melody" TEXT NOT NULL,
    "rhythm" TEXT NOT NULL,
    "Pitch" TEXT NOT NULL,
    "Voice" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "songId" INTEGER NOT NULL,

    CONSTRAINT "structured_review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "structured_review" ADD CONSTRAINT "structured_review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "structured_review" ADD CONSTRAINT "structured_review_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
