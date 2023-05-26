import { NextApiRequest, NextApiResponse } from 'next';
import FirebaseAdmin from '@/models/firebase_admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 필요한 정보들은 req.body에 전부 들어있기 때문에 가져온다.
  const { uid, email, displayName, photoURL } = req.body;

  // 사용자가 보내는거기 때문에 값이 존재할 수 도있고 안할 수 도있기 때문에 존재하지 않으면 에러
  // uid는 반드시 존재해야하는 값이기 때문
  if (uid === undefined || uid === null) {
    return res.status(400).json({ result: false, message: 'uid가 누락되었습니다.' });
  }

  // email도 uid랑 똑같이 값이 undefined, null 일 수 있으니 에러를 띄어준다.
  if (email === undefined || email === null) {
    return res.status(400).json({ result: false, message: 'email이 누락되었습니다.' });
  }

  // 비동기 처리 과정에서 에러가 날 수 있으므로 try.
  try {
    // 받은 정보들을 저장하는 코드
    // members 라는 콜렉션에다가 저장하고 add로 어떤 정보를 넣을 수 있을지 특정할 수 있다.
    // add의 특징은 추가를 해주면 특정 key로 나올 수 있게 반환해준다.
    // uid 빼고는 존재하지 않을 수 있기 때문에 옵셔널로 빈 string 값을 준다.
    // promise 이기 때문에 비동기 처리가 가능.
    // doc(uid).set 즉 문서의 uid를 넣고 set 한다.
    const addResult = await FirebaseAdmin.getInstance()
      .Firebase.collection('members')
      .doc(uid)
      .set({
        uid,
        email,
        displayName: displayName ?? '',
        photoURL: photoURL ?? '',
      });

    // addResult 랑 코드가 비슷하지만, 다른점은 email 저장하는 방법이 다르다.
    // screenName 변수를 보면 replace로 @gmail.com 을 떼고 email 을 저장한다는 뜻
    // 예를 들어 luckseok1@gmail.com -> luckseok1
    const screenName = (email as string).replace('@gmail.com', '');
    await FirebaseAdmin.getInstance()
      .Firebase.collection('screen_names')
      .doc(screenName)
      .set({
        uid,
        email,
        displayName: displayName ?? '',
        photoURL: photoURL ?? '',
      });

    return res.status(200).json({ result: true, id: addResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false });
  }
}
