-- AddForeignKey
ALTER TABLE "course_review" ADD CONSTRAINT "course_review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
