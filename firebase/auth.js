import { auth } from './config';

// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) => {
  return auth.createUserWithEmailAndPassword(email, password);
}

// Sign In
export const doSignInWithEmailAndPassword = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password);
}

// Sign out
export const doSignOut = () => {
  return auth.signOut();
}

// Password Reset
export const doPasswordReset = (email) => {
  return auth.sendPasswordResetEmail(email);
}

// Password Change
export const doPasswordUpdate = (password) => {
  return auth.currentUser.updatePassword(password);
}