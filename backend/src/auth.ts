import passport from 'passport';
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import type { Profile } from 'passport';
import dotenv from 'dotenv';
import { DynamoDB } from 'aws-sdk';
import { VerifyCallback } from 'passport-oauth2';

dotenv.config();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  MICROSOFT_CLIENT_ID,
  MICROSOFT_CLIENT_SECRET,
  FRONTEND_URL = 'http://localhost:8080',
} = process.env;

// Initialize DynamoDB client
const dynamodb = new DynamoDB.DocumentClient();
const USER_TABLE = process.env.USER_TABLE || 'Users';

interface AppUser {
  id: string;
  displayName: string;
  email: string;
  provider: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Extend Express User type
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends AppUser {}
  }
}

// Store user in DynamoDB and return session user
const createOrUpdateUser = async (profile: Profile, provider: string): Promise<AppUser> => {
  const email = profile.emails?.[0]?.value;
  const id = profile.id || (profile as any).sub || email;
  
  if (!email) {
    throw new Error('Email is required');
  }

  const user: AppUser = {
    id,
    displayName: profile.displayName || email.split('@')[0],
    email,
    provider,
    photoUrl: profile.photos?.[0]?.value,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    // Check if user exists
    const existingUser = await dynamodb.get({
      TableName: USER_TABLE,
      Key: { id },
    }).promise();

    if (existingUser.Item) {
      // Update existing user
      await dynamodb.update({
        TableName: USER_TABLE,
        Key: { id },
        UpdateExpression: 'SET displayName = :displayName, photoUrl = :photoUrl, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':displayName': user.displayName,
          ':photoUrl': user.photoUrl,
          ':updatedAt': user.updatedAt,
        },
      }).promise();
    } else {
      // Create new user
      await dynamodb.put({
        TableName: USER_TABLE,
        Item: user,
      }).promise();
    }

    return user;
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw new Error('Failed to create/update user');
  }
};

// Serialize user to session
passport.serializeUser((user: Express.User, done: (err: any, id?: string) => void) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done: (err: any, user?: Express.User | false | null) => void) => {
  try {
    const result = await dynamodb.get({
      TableName: USER_TABLE,
      Key: { id },
    }).promise();

    if (!result.Item) {
      return done(new Error('User not found'));
    }

    done(null, result.Item as AppUser);
  } catch (error) {
    done(error);
  }
});

// Google Strategy
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/auth/google/callback',
    scope: ['profile', 'email'],
  }, async (
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback
  ) => {
    try {
      const user = await createOrUpdateUser(profile, 'google');
      done(null, user);
    } catch (error) {
      done(error as Error);
    }
  }));
}

// Microsoft Strategy
if (MICROSOFT_CLIENT_ID && MICROSOFT_CLIENT_SECRET) {
  passport.use(new MicrosoftStrategy({
    clientID: MICROSOFT_CLIENT_ID,
    clientSecret: MICROSOFT_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/auth/microsoft/callback',
    scope: ['user.read'],
  }, async (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) => {
    try {
      const user = await createOrUpdateUser(profile, 'microsoft');
      done(null, user);
    } catch (error) {
      done(error as Error);
    }
  }));
}

export default passport;
