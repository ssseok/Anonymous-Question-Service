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
    const screenName = (email as string).replace('@gmail.com', '');
    const addResult = await FirebaseAdmin.getInstance().Firebase.runTransaction(async (transaction) => {
      const memberRef = FirebaseAdmin.getInstance().Firebase.collection('members').doc(uid);
      const screenNameRef = FirebaseAdmin.getInstance().Firebase.collection('screen_names').doc(screenName);
      const memberDoc = await transaction.get(memberRef);
      // memberDoc 문서가 존재하면
      if (memberDoc.exists) {
        // 이미 추가된 상태
        return false; // 실패
      }

      const addData = { uid, email, displayName: displayName ?? '', photoURL: photoURL ?? '' };
      await transaction.set(memberRef, addData);
      await transaction.set(screenNameRef, addData);
      return true; // 성공
    });
    if (addResult === false) {
      return res.status(201).json({ result: true, id: uid });
    }
    return res.status(200).json({ result: true, id: uid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false });
  }
}
