import { Client, Account, Databases, ID, Models, Query } from "appwrite";
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "@env"

const APPWRITE_DATABASE_ID = "68b213e7001400dc7f21";
const USERS_COLLECTION_ID = "users";
const MESSAGES_COLLECTION_ID = "messages_table"; // Use the existing collection name

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

// Interface for your user document structure
export interface UserDocument extends Models.Document {
  name: string;
  email: string;
  shareable_id: string;
  canCompanionAddTask?: boolean;
  accountId: string; 
  username: string; 
}

// Interface for the message document structure, matching your companion site
export interface Message extends Models.Document {
  senderID: string;
  receiverID: string;
  message: string;
}

/**
 * Sends a message to another user.
 * @param {string} senderId - The sender's user ID.
 * @param {string} receiverId - The receiver's user ID.
 * @param {string} content - The message content.
 * @returns {Promise<Models.Document>} The created message document.
 */
export async function sendMessage(senderId: string, receiverId: string, content: string): Promise<Models.Document> {
  try {
    const messageDoc = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      MESSAGES_COLLECTION_ID,
      ID.unique(),
      {
        senderID: senderId,
        receiverID: receiverId,
        message: content,
      }
    );
    return messageDoc;
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
}

/**
 * Fetches the conversation between two users.
 * @param {string} userId1 - The first user's ID.
 * @param {string} userId2 - The second user's ID.
 * @returns {Promise<Message[]>} A list of message documents.
 */
export async function getMessages(userId1: string, userId2: string): Promise<Message[]> {
  try {
    const response = await databases.listDocuments<Message>(
      APPWRITE_DATABASE_ID,
      MESSAGES_COLLECTION_ID,
      [
        Query.equal('senderID', [userId1, userId2]),
        Query.equal('receiverID', [userId1, userId2]),
        Query.orderAsc('$createdAt')
      ]
    );
    return response.documents;
  } catch (error) {
    console.error("Failed to get messages:", error);
    throw error;
  }
}

/**
 * Subscribes to new messages in the collection for real-time updates.
 * @param {function} callback - The function to execute with the new message payload.
 * @returns {function} An unsubscribe function.
 */
export function subscribeToMessages(callback: (payload: any) => void) {
  return client.subscribe<Message>(`databases.${APPWRITE_DATABASE_ID}.collections.${MESSAGES_COLLECTION_ID}.documents`, response => {
      // Ensure the event is a document creation
      if (response.events.includes("databases.*.collections.*.documents.*.create")) {
          callback(response);
      }
  });
}

// --- Existing User Functions ---

export async function registerNewPatient(email: string, password: string, name: string): Promise<UserDocument> {
  try {
    const newUserAccount = await account.create(ID.unique(), email, password, name);
    const userId = newUserAccount.$id;
    const shareableId = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newUserDocument = await databases.createDocument<UserDocument>(
      APPWRITE_DATABASE_ID,
      USERS_COLLECTION_ID,
      userId,
      {
        name: name,
        email: email,
        shareable_id: shareableId,
        accountId: userId,
        username: name
      }
    );
    
    await account.createEmailPasswordSession(email, password);
    
    return newUserDocument;
  } catch (error) {
    console.error("Error during patient registration:", error);
    throw error;
  }
}

export async function createUser(email: string, password: string, username: string) {
    return registerNewPatient(email, password, username)
}

export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error as string);
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    throw new Error(error as string);
  }
}

export async function getCurrentUser(): Promise<UserDocument | null> {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw new Error("No user account found");

    const userDocs = await databases.listDocuments<UserDocument>(
      APPWRITE_DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (userDocs.documents.length === 0) throw new Error("User document not found");

    return userDocs.documents[0];
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
