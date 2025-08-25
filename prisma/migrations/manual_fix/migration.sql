-- Add sentMessages relation to User
ALTER TABLE "direct_messages" ADD CONSTRAINT "direct_messages_senderId_fkey" 
  FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add receivedMessages relation to User
ALTER TABLE "direct_messages" ADD CONSTRAINT "direct_messages_receiverId_fkey" 
  FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create indexes
CREATE INDEX IF NOT EXISTS "direct_messages_senderId_idx" ON "direct_messages"("senderId");
CREATE INDEX IF NOT EXISTS "direct_messages_receiverId_idx" ON "direct_messages"("receiverId");
CREATE INDEX IF NOT EXISTS "direct_messages_senderId_receiverId_idx" ON "direct_messages"("senderId", "receiverId");
CREATE INDEX IF NOT EXISTS "direct_messages_createdAt_idx" ON "direct_messages"("createdAt");
