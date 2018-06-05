const routes = {
  '/': 'Home',

  '/master': '구름관리서버설정',
  '/master/domain': '도메인관리',
  '/master/admin': '관리자관리',
  '/master/server': '서버정보설정',
  
  '/clients': '단말관리',
  '/clients/clientmanage': '등록관리',
  '/clients/clientgroupmanage': '그룹관리',
  '/package/packagemanage': '패키지관리',
  '/jobs/jobmanage': '작업관리',

  '/clientconfig': '단말설정',
  '/clientconfig/desktop': '데스크톱환경',
  '/clientconfig/update': '업데이트서버설정',
  '/clientconfig/host': 'HOSTS설정',
  '/clientconfig/setting': '단말정책설정',
  '/clientconfig/regkey': '단말등록키',
  

  '/userconfig': '사용자정책관리',
  '/userconfig/media': '매체제어정책관리',
  '/userconfig/browser': '브라우저제어정책관리',
  '/userconfig/security': '단말보안정책관리',

  '/user': '사용자관리',
  '/user/deptmanage': '조직관리',
  '/user/usermanage': '사용자계정관리',
  '/user/role': '사용자롤관리',

  
};
export default routes;
