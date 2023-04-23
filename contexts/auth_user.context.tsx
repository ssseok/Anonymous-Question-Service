/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useContext } from 'react';
import { InAuthUser } from '@/types/in_auth_user';
import useFirebaseAuth from '@/hooks/use_firebase_auth';

interface InAuthUserContext {
  authUser: InAuthUser | null;
  loading: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
}

const AuthUserContext = createContext<InAuthUserContext>({
  // 초기 값 설정
  authUser: null,
  loading: true,
  signInWithGoogle: async () => ({ user: null, credential: null }),
  signOut: () => {},
});

export const AuthUserProvider = function ({ children }: { children: React.ReactNode }) {
  // value 를 꼭 넣어줘야하는데 매번 변경되는 값이기 때문에 커스텀 훅으로 빼줘서 사용하였다.
  const auth = useFirebaseAuth();
  return <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>;
};

export const useAuth = () => useContext(AuthUserContext);
