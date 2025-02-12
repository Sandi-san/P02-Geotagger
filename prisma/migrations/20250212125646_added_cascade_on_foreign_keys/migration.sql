-- DropForeignKey
ALTER TABLE "guesses" DROP CONSTRAINT "guesses_userId_fkey";

-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_userId_fkey";

-- DropForeignKey
ALTER TABLE "userActions" DROP CONSTRAINT "userActions_userId_fkey";

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guesses" ADD CONSTRAINT "guesses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userActions" ADD CONSTRAINT "userActions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
