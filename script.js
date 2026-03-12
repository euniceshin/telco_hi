document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.circle-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1. Light 햅틱 피드백 (navigator.vibrate 지원 기기)
      if (typeof navigator.vibrate === 'function') {
        // 15ms의 짧은 진동으로 Light 햅틱 질감 구현
        navigator.vibrate(15);
      }

      const telecom = btn.getAttribute('data-telecom');
      
      // 2. 임시 로그로 다음 단계 전환 시뮬레이션
      console.log(`${telecom} 통신사 선택됨 - 다음 화면으로 이동`);

      // 3. 자바스크립트를 이용한 터치 시각적 스케일 피드백 (CSS :active와 함께 작동하여 부드러움을 더함)
      btn.style.transform = 'scale(0.9)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 150);
    });
  });
});
