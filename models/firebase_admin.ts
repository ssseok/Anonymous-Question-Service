import * as admin from 'firebase-admin';

interface Config {
  credential: {
    privateKey: string;
    clientEmail: string;
    projectId: string;
  };
}

export default class FirebaseAdmin {
  public static instance: FirebaseAdmin;

  // 최기화가 되었는지 확인
  private init = false;

  // getInstance 접근하면 계속해서 같은 instance를 반환 받을 수 있다.
  public static getInstance(): FirebaseAdmin {
    // FirebaseAdmin.instance 값이 undefined 이거나 null 값이 없다면 초기화 진행
    if (FirebaseAdmin.instance === undefined || FirebaseAdmin.instance === null) {
      // 환경 초기화
      FirebaseAdmin.instance = new FirebaseAdmin();

      FirebaseAdmin.instance.bootstrap();
    }
    return FirebaseAdmin.instance;
  }

  // 환경을 초기화 할 때 메서드
  private bootstrap(): void {
    // 어플리케이션이 등록이 되어있는지 확인
    // 즉 admin의 app 길이가 0이 아니면 app이 존재한다는 뜻
    const haveApp = admin.apps.length !== 0;
    // app이 존재하면 init 초기화 값을 true로 설정하고 빠져나온다.
    if (haveApp) {
      this.init = true;
      return;
    }

    // Config interface를 통해 초기화
    const config: Config = {
      credential: {
        projectId: process.env.projectId || '',
        clientEmail: process.env.clientEmail || '',
        // privateKey는 replace를 해줘야한다 왜냐하면 개행문자(ex -> \n,\t) 같은 경우에는 JSON에서 해석이 불가하기 때문에 개행문자가 들어가 있기 때문에 정규식 개행이 될 수 있게 해주는 작업을 해줘야한다.
        privateKey: (process.env.privateKey || '').replace(/\\n/g, '\n'),
      },
    };
    admin.initializeApp({ credential: admin.credential.cert(config.credential) });
    console.info('bootstrap firebase admin');
  }

  /** firestore 반환 */
  public get Firebase(): FirebaseFirestore.Firestore {
    // init 이 false이면 bootstrap을 실행
    if (this.init === false) {
      this.bootstrap();
    }
    // true라면 admin에 있는 firestore를 실행
    return admin.firestore();
  }

  /** auth 반환 */
  public get Auth(): admin.auth.Auth {
    // init 이 false이면 bootstrap을 실행
    if (this.init === false) {
      this.bootstrap();
    }
    return admin.auth();
  }
}
