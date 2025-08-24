import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to your environment variables');
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.text();
  const body = JSON.parse(payload);

  // Create new Svix instance with secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log('📧 Webhook received:', eventType);

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url, username } = evt.data;

    try {
      // Generate a temporary username if not provided
      const tempUsername = `user_${Math.random().toString(36).substring(2, 10)}`;
      
      // Check if user exists
      const existingUser = await db.user.findUnique({
        where: { clerkId: id },
      });

      if (existingUser) {
        // Update existing user
        await db.user.update({
          where: { id: existingUser.id },
          data: {
            email: email_addresses[0]?.email_address || existingUser.email,
            firstName: first_name || existingUser.firstName,
            lastName: last_name || existingUser.lastName,
            avatar: image_url || existingUser.avatar,
            // Don't update username here as it will be set during onboarding
          },
        });
        console.log('✅ Updated user in database:', id);
      } else {
        // Create new user with a temporary username
        const newUser = await db.user.create({
          data: {
            clerkId: id,
            email: email_addresses[0]?.email_address || '',
            firstName: first_name || '',
            lastName: last_name || '',
            avatar: image_url || '',
            username: tempUsername,
            isOnline: false
          },
        });

        console.log('✅ Created new user in database:', {
          clerkId: id,
          email: email_addresses[0]?.email_address,
          username: tempUsername,
          databaseId: newUser.id
        });
      }
    } catch (error) {
      console.error('❌ Error saving user to Aiven database:', error);
      return new Response('Error creating user', { status: 500 });
    }
  }

  return new Response('Webhook processed successfully', { status: 200 });
}
