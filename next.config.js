module.exports = {
  reactStrictMode: true,
  // next_public은 next.js가 브라우저나 node.js 환경 모두에서 쓸 수 있도록 변수
  //  .env는 순수하게 서버사이드에서만 사용가능한 정보가 포함되어있는
  publicRuntimeConfig: {
    apiKey: process.env.publicApiKey || '',
    authDomain: process.env.FIREBASE_AUTH_HOST || '',
    projectId: process.env.projectId || '',
  },
};
