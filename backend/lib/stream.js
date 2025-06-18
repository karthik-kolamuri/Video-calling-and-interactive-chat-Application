// const streamChat = require('stream-chat');
import { StreamChat } from 'stream-chat';
import dotEnv from 'dotenv'
dotEnv.config()
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;
if (!apiKey || !apiSecret) {
  console.error('STREAM_API_KEY and STREAM_API_SECRET must be set in .env file');
  process.exit(1);
}  
const streamClient = StreamChat.getInstance(apiKey, apiSecret);
export const createStreamUser = async (userData) => {
  try {
    console.log('Creating Stream user with data:', userData);
    if (!userData || !userData.id || !userData.name) {
      throw new Error('Invalid user data provided');
    }
    await streamClient.upsertUser({
      id: userData.id,
      name: userData.name,
      image: userData.image || 'https://example.com/default-avatar.png', // Default image if not provided
      // role: 'user' // Set the role as needed
    }); // Pass userData directly
    return userData; // Return the user data for confirmation
  }
  catch (error) {
    console.error('Error creating Stream user:', error);
  }
}

//to generate a Stream token for a user
export const generateStreamToken = (userId) => {
  try{
    const userIdStr= userId.toString();
    return streamClient.createToken(userIdStr);
  }catch (error) {
    console.error('Error generating Stream token:', error);
    throw error; // Re-throw the error for further handling
  }

}