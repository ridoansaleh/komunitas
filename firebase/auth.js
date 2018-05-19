import { auth } from './config';

// Sign Up
export function doCreateUserWithEmailAndPassword(email, password) {
  return auth.createUserWithEmailAndPassword(email, password);
}

// Sign In
export function doSignInWithEmailAndPassword(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

// Sign out
export function doSignOut() {
  return auth.signOut();
}

// Password Reset
export function doPasswordReset(email) {
  return auth.sendPasswordResetEmail(email);
}

// Password Change
export function doPasswordUpdate(password) {
  return auth.currentUser.updatePassword(password);
}