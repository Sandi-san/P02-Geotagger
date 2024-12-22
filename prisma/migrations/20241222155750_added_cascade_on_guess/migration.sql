-- DropForeignKey
ALTER TABLE "guesses" DROP CONSTRAINT "guesses_locationId_fkey";

-- AddForeignKey
ALTER TABLE "guesses" ADD CONSTRAINT "guesses_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
