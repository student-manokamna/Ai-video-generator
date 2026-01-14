-- CreateTable
CREATE TABLE "slide" (
    "id" TEXT NOT NULL,
    "slideIndex" INTEGER NOT NULL,
    "slideId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "audioFileName" TEXT,
    "narration" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "slide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "slide_chapterId_idx" ON "slide"("chapterId");

-- AddForeignKey
ALTER TABLE "slide" ADD CONSTRAINT "slide_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
