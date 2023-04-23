import { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { InAuthUser } from '@/types/in_auth_user';
import FirebaseClient from '@/models/firebase_client';

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<InAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /** 로그인 */
  async function signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    // async,await를 사용하기 때문에 try,catch 를 사용하여 비동기 처리 되는거를 마치 동기처럼 사용
    try {
      const signInResult = await signInWithPopup(FirebaseClient.getInstance().Auth, provider);
      if (signInResult.user) {
        console.info(signInResult.user);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };

  /** 로그아웃 */
  // signOut 즉 로그아웃을 처리하면 값들을 clear함수로 초기화 시킨다.
  const signOut = () => FirebaseClient.getInstance().Auth.signOut().then(clear);

  /** 유저 값이 바뀔 때 마다 */
  //
  const authStateChanged = async (authState: User | null) => {
    // authState 값이 존재하지 않는 경우
    if (authState === null) {
      setAuthUser(null);
      setLoading(false);
      return;
    }
    // authState 값이 존재하는 경우
    setLoading(true);
    setAuthUser({
      uid: authState?.uid ?? '',
      email: authState?.email ?? '',
      photoURL: authState?.photoURL ?? '',
      displayName: authState?.displayName ?? '',
    });
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = FirebaseClient.getInstance().Auth.onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signOut,
    signInWithGoogle,
  };
}
