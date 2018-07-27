const routes = {
  '/': 'Home',

  '/master/': '구름관리서버설정',
  '/master/domain/': '도메인관리',
  '/master/admin/': '관리자관리',
  '/master/server/': '서버정보설정',
  
  '/clients/': '단말관리',
  '/clients/clientmastermanage/GRM0101': '통합관리',
  '/clients/clientmanage/GRM0102': '등록관리',
  '/clients/clientgroupmanage/GRM0103': '그룹관리',
  '/package/packagemanage/GRM0104': '패키지관리',
  '/jobs/jobmanage/GRM0105': '작업관리',

  '/clientconfig': '단말설정',
  '/clientconfig/desktop/': '데스크톱환경',
  '/clientconfig/update/GRM0302': '업데이트서버설정',
  '/clientconfig/host/GRM0303': 'HOSTS설정',
  '/clientconfig/setting/GRM0304': '단말정책설정',
  
  '/clientconfig/regkey/GRM0201': '단말등록키',
  '/clientconfig/profileset/GRM0202': '단말프로파일',
  

  '/userconfig/': '사용자정책관리',
  '/userconfig/media/GRM0401': '매체제어정책관리',
  '/userconfig/browser/GRM0402': '브라우저제어정책관리',
  '/userconfig/security/GRM0403': '단말보안정책관리',

  '/user/': '사용자관리',
  '/user/deptmanage/GRM0501': '조직관리',
  '/user/usermanage/GRM0502': '사용자계정관리',
  '/user/role/GRM0503': '사용자롤관리',

  
};
export default routes;
