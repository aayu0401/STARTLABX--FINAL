// User migration service - No longer needed (removed Firebase dependency)
// This file is kept for backward compatibility but does nothing

export async function migrateUserIfNeeded(user: any): Promise<void> {
  // No migration needed - using backend API directly
  console.log('Migration not needed - using backend API');
  return Promise.resolve();
}

export async function createBasicUserProfile(user: any): Promise<any> {
  // Return mock profile - actual profile comes from backend
  return {
    id: user.uid || user.id,
    fullName: user.displayName || user.name || 'User',
    email: user.email,
    accountType: 'professional',
    createdAt: new Date().toISOString(),
  };
}