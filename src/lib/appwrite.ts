import { Client, Account, Databases, ID, Models, Query } from "appwrite";
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "@env"

const APPWRITE_DATABASE_ID = "68b213e7001400dc7f21";
const USERS_COLLECTION_ID = "users";

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

// Interface for your user document structure for better type safety
export interface UserDocument extends Models.Document {
  name: string;
  email: string;
  shareable_id: string;
  canCompanionAddTask?: boolean;
  accountId: string; 
  username: string; 
}

/**
 * Updates the user's permissions to add a task.
 * @param {boolean} canAddTask - Whether the user can add a task.
 * @returns {Promise<Models.Document>} The updated user document.
 */
// export async function updateUserPermissions(canAddTask: boolean): Promise<Models.Document> {
//   try {
//     const user = await account.get(); // Get the currently logged-in user
//     return await databases.updateDocument(
//       APPWRITE_DATABASE_ID,
//       USERS_COLLECTION_ID,
//       user.$id,
//       { canCompanionAddTask: canAddTask } // The data to update
//     );
//   } catch (error) {
//     console.error("Failed to update user permissions:", error);
//     throw error;
//   }
// }

/**
 * Registers a new patient user in your React Native App.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's chosen password.
 * @param {string} name - The user's full name.
 * @returns {Promise<UserDocument>} The newly created user document from the database.
 */
export async function registerNewPatient(email: string, password: string, name: string): Promise<UserDocument> {
  try {
    // Step 1: Create the user in Appwrite's Authentication service.
    const newUserAccount = await account.create(ID.unique(), email, password, name);
    const userId = newUserAccount.$id;

    // Step 2: Generate a simple, shareable ID for the user.
    const shareableId = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Step 3: Create a corresponding document in your 'users' collection.
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

    console.log("Successfully registered and created user record:", newUserDocument);
    
    // Step 4: Log the user in immediately after registration.
    await account.createEmailPasswordSession(email, password);
    
    return newUserDocument;

  } catch (error) {
    console.error("Error during patient registration:", error);
    throw error;
  }
}

// Corresponds to user's 'createUser'
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

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}
