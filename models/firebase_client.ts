import { Auth, getAuth } from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';
import getConfig from 'next/config';

// next.config 에 설정한 환경변수를 getConfig()로 가져온다.
const { publicRuntimeConfig } = getConfig();
//
const FirebaseCredentials = {
  apiKey: publicRuntimeConfig.apiKey,
  authDomain: publicRuntimeConfig.authDomain,
  projectId: publicRuntimeConfig.projectId,
};

export default class FirebaseClient {
  private static instance: FirebaseClient;

  private auth: Auth;

  public constructor() {
    // app이 몇개가 되어있는지 찾는다.
    const apps = getApps();
    // app이 initialize가 되어있지 않다면(안되어 있다는건 app의 개수가 0개 없다는 뜻)initalize를 설정해준다.
    if (apps.length === 0) {
      console.info('firebase client init start ');
      initializeApp(FirebaseCredentials);
    }
    this.auth = getAuth();
    console.info('firebase auth');
  }

  public static getInstance(): FirebaseClient {
    if (FirebaseClient.instance === undefined || FirebaseClient.instance === null) {
      FirebaseClient.instance = new FirebaseClient();
    }
    return FirebaseClient.instance;
  }

  public get Auth(): Auth {
    return this.auth;
  }
}
