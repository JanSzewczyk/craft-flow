export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      roles?: string[];
      onboardingComplete?: boolean;
    };
  }

  interface UserPublicMetadata {
    roles?: string[];
    onboardingComplete?: boolean;
  }
}
