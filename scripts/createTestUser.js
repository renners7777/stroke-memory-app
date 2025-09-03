require('@babel/register')({
  presets: ['babel-preset-expo'],
  extensions: ['.ts', '.tsx', '.js', '.jsx']
});
require('dotenv').config();

// Now that babel is registered, we can import the typescript file
const { registerNewPatient } = require('../src/lib/appwrite');

// --- Configuration ---
// You can change these values for your test user
const TEST_EMAIL = 'testuser-' + Date.now() + '@example.com';
const TEST_PASSWORD = 'password123';
const TEST_NAME = 'Test User';
// ---------------------

async function createTestUser() {
  if (!process.env.APPWRITE_ENDPOINT || !process.env.APPWRITE_PROJECT_ID) {
    console.error("Please ensure you have a .env file in the project root with APPWRITE_ENDPOINT and APPWRITE_PROJECT_ID defined.");
    return;
  }

  console.log(`Attempting to register a new user: ${TEST_NAME} (${TEST_EMAIL})`);

  try {
    const newUser = await registerNewPatient(TEST_EMAIL, TEST_PASSWORD, TEST_NAME);
    console.log("\n--- Test User Created! ---");
    console.log("User ID:", newUser.accountId);
    console.log("Name:", newUser.name);
    console.log("Email:", newUser.email);
    console.log("Shareable ID:", newUser.shareable_id);
    console.log("\nThis Shareable ID can be used to connect with the companion app.");

  } catch (error) {
    console.error("\n--- Error ---");
    console.error("Failed to create test user.");
    // Appwrite often returns helpful error messages
    if (error.response) {
      console.error("Appwrite Response:", JSON.stringify(error.response, null, 2));
    } else {
      console.error("Details:", error);
    }
    console.error("\nPlease check your Appwrite project settings and .env file.");
  }
}

createTestUser();