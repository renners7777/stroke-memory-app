import { Query } from 'appwrite';
import { APPWRITE_DATABASE_ID, MESSAGES_COLLECTION_ID, Message, databases } from './appwrite';
import { handleAppwriteError } from './errorHandling';

export async function testCompanionConnection() {
  try {
    // Try to fetch the most recent message to test connection
    const messages = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      MESSAGES_COLLECTION_ID,
      [
        Query.orderDesc('$createdAt'),
        Query.limit(1)
      ]
    );

    return {
      success: true,
      connected: true,
      latestMessage: messages.documents[0] as Message | undefined,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    const handledError = handleAppwriteError(error);
    return {
      success: false,
      connected: false,
      error: handledError.message,
      timestamp: new Date().toISOString()
    };
  }
}

export async function sendTestMessage(userId: string) {
  try {
    const testMessage = {
      senderID: userId,
      receiverID: userId, // Sending to self for testing
      message: `Test message from mobile app - ${new Date().toISOString()}`
    };

    const response = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      MESSAGES_COLLECTION_ID,
      'unique()',
      testMessage
    );

    return {
      success: true,
      message: response as Message,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    const handledError = handleAppwriteError(error);
    return {
      success: false,
      error: handledError.message,
      timestamp: new Date().toISOString()
    };
  }
}