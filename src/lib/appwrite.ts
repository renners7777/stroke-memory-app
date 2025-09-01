import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "@env";
import { Account, Client, Databases, ID, Models, Query } from "appwrite";

export const APPWRITE_DATABASE_ID = "68b213e7001400dc7f21";
export const USERS_COLLECTION_ID = "users";
export const MESSAGES_COLLECTION_ID = "messages_table";
export const TASKS_COLLECTION_ID = "tasks";

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

// Interface for a task document
export interface Task extends Models.Document {
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate: string; // ISO 8601 string
  patientId: string; // The user this task is for
  addedBy: string; // Who added the task (patient or companion)
  isAcknowledged: boolean; // To track if the user has stopped the alarm
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

// --- Task Functions ---

/**
 * Creates a new task for a user.
 * @param {object} taskData - The data for the new task.
 * @returns {Promise<Task>} The created task document.
 */
export async function createTask(taskData: {
  patientId: string;
  addedById: string;
  title: string;
  dueDate: Date;
  description?: string;
}): Promise<Task> {
  try {
    const { patientId, addedById, title, dueDate, description } = taskData;
    const taskDoc = await databases.createDocument<Task>(
      APPWRITE_DATABASE_ID,
      TASKS_COLLECTION_ID,
      ID.unique(),
      {
        patientId: patientId,
        addedBy: addedById,
        title: title,
        description: description,
        dueDate: dueDate.toISOString(),
        isCompleted: false,
        isAcknowledged: false,
      }
    );
    return taskDoc;
  } catch (error) {
    console.error("Failed to create task:", error);
    throw error;
  }
}

/**
 * Fetches all tasks for a specific patient.
 * @param {string} patientId - The user's ID.
 * @returns {Promise<Task[]>} A list of task documents.
 */
export async function getTasks(patientId: string): Promise<Task[]> {
  try {
    const response = await databases.listDocuments<Task>(
      APPWRITE_DATABASE_ID,
      TASKS_COLLECTION_ID,
      [Query.equal('patientId', patientId), Query.orderAsc('dueDate')]
    );
    return response.documents;
  } catch (error) {
    console.error("Failed to get tasks:", error);
    throw error;
  }
}

/**
 * Updates the status of a task.
 * @param {string} taskId - The ID of the task to update.
 * @param {Partial<Pick<Task, 'isCompleted' | 'isAcknowledged'>>} data - The fields to update.
 * @returns {Promise<Models.Document>} The updated task document.
 */
export async function updateTask(taskId: string, data: Partial<Pick<Task, 'isCompleted' | 'isAcknowledged'>>) {
    try {
        return await databases.updateDocument(APPWRITE_DATABASE_ID, TASKS_COLLECTION_ID, taskId, data);
    } catch (error) {
        console.error("Failed to update task:", error);
        throw error;
    }
}
