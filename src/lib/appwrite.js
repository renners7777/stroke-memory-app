import { Client, Account, Databases, ID } from "appwrite";
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from '@env'; // Import from @env

const APPWRITE_DATABASE_ID = "68b213e7001400dc7f21";
const USERS_COLLECTION_ID = "users";

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)   // Use the imported variable
    .setProject(APPWRITE_PROJECT_ID); // Use the imported variable

export const account = new Account(client);
export const databases = new Databases(client);

/**
 * Registers a new patient user in your React Native App.
 * Creates both an authentication entry and a database record in Appwrite.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's chosen password.
 * @param {string} name - The user's full name.
 * @returns {Promise<object>} The newly created user document from the database.
 */
export async function registerNewPatient(email, password, name) {
  try {
    // Step 1: Create the user in Appwrite's Authentication service.
    const newUserAccount = await account.create(ID.unique(), email, password, name);
    const userId = newUserAccount.$id;

    // Step 2: Generate a simple, shareable ID for the user.
    const shareableId = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Step 3: Create a corresponding document in your 'users' collection.
    const newUserDocument = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      USERS_COLLECTION_ID,
      userId,
      {
        name: name,
        email: email,
        shareable_id: shareableId
      }
    );

    console.log("Successfully registered and created user record:", newUserDocument);
    
    // Step 4: Log the user in immediately after registration.
    await account.createEmailPasswordSession(email, password);
    
    return newUserDocument;

  } catch (error) {
    console.error("Error during patient registration:", error);
    // Propagate the error to be handled by the UI component
    throw error;
  }
}
