document.addEventListener('DOMContentLoaded', () => {
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');
  const appContainer = document.getElementById('appContainer');

  const selectionOverlay = document.getElementById('selectionOverlay');
  const selectionSheet = document.getElementById('selectionSheet');
  const sheetHandle = document.getElementById('sheetHandle');

  const buttons = document.querySelectorAll('.circle-btn');
  const selectedLogoImg = document.querySelector('#selectedLogo img');
  const gradeGrid = document.getElementById('gradeGrid');
  const nextBtn = document.getElementById('nextBtn');

  // 통신사별 등급 데이터
  const gradeData = {
    'SKT': [
      { name: 'VIP', img: 'assets/grade_vip.png' },
      { name: 'GOLD', img: 'assets/grade_gold.png' },
      { name: 'SILVER', img: 'assets/grade_silver.png' }
    ],
    'LGU+': [
      { name: 'VVIP', img: 'assets/grade_vvip.png' },
      { name: 'VIP', img: 'assets/grade_vip.png' },
      { name: '우수', img: 'assets/grade_gold.png' }
    ],
    'KT': [
      { name: 'VVIP', img: 'assets/grade_vvip.png' },
      { name: 'VIP', img: 'assets/grade_vip.png' },
      { name: 'GOLD', img: 'assets/grade_gold.png' },
      { name: 'SILVER', img: 'assets/grade_silver.png' },
      { name: 'WHITE', img: 'assets/grade_white.png' },
      { name: '일반', img: 'assets/grade_bronze.png' }
    ]
  };

  const logoData = {
    'SKT': 'assets/logo-skt.svg',
    'LGU+': 'assets/logo-lgu.svg',
    'KT': 'assets/logo-kt.svg'
  };

  let selectedTelecom = null;
  let selectedGrade = null;

  // ─── 바텀 시트 열기/닫기 함수 ────────────────────────
  function openBottomSheet() {
    selectionSheet.style.display = 'flex';
    selectionOverlay.classList.add('active');
    // force reflow so transition works
    void selectionSheet.offsetWidth;
    selectionSheet.classList.add('open');
  }

  function closeBottomSheet() {
    selectionSheet.classList.remove('open');
    selectionOverlay.classList.remove('active');
    setTimeout(() => {
      selectionSheet.style.display = 'none';
    }, 400);
  }

  // ─── Step 1 → Step 2 전환 ────────────────────────────
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof navigator.vibrate === 'function') navigator.vibrate(15);
      selectedTelecom = btn.getAttribute('data-telecom');
      btn.style.transform = 'scale(0.9)';
      setTimeout(() => {
        btn.style.transform = '';
        goToStep2();
      }, 150);
    });
  });

  function goToStep2() {
    step1.style.display = 'none';
    step2.style.display = 'flex';
    if (logoData[selectedTelecom]) selectedLogoImg.src = logoData[selectedTelecom];
    renderGrades(selectedTelecom);
  }

  function renderGrades(telecom) {
    gradeGrid.innerHTML = '';
    const grades = gradeData[telecom] || [];
    grades.forEach(grade => {
      const card = document.createElement('div');
      card.className = 'grade-card';
      card.innerHTML = `
        <img src="${grade.img}" alt="${grade.name}" onerror="this.src='assets/grade_silver.png'">
        <span>${grade.name}</span>
      `;
      card.addEventListener('click', () => {
        document.querySelectorAll('.grade-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedGrade = grade.name;
        nextBtn.classList.add('active');
        nextBtn.disabled = false;
        if (typeof navigator.vibrate === 'function') navigator.vibrate(10);
      });
      gradeGrid.appendChild(card);
    });
  }

  // ─── Step 2 → Step 3 전환 ────────────────────────────
  const finalTelecomSpan = document.getElementById('finalTelecom');
  const finalGradeSpan = document.getElementById('finalGrade');
  const resetBtn = document.getElementById('resetBtn');
  const categoryTabs = document.querySelectorAll('.tab-btn');
  const benefitList = document.getElementById('benefitList');

  nextBtn.addEventListener('click', () => {
    if (!selectedGrade) return;
    if (typeof navigator.vibrate === 'function') navigator.vibrate(20);

    finalTelecomSpan.textContent = selectedTelecom;
    finalGradeSpan.textContent = selectedGrade;

    // 바텀 시트 닫기 → Step 3 표시
    closeBottomSheet();
    step3.style.display = 'flex';

    // 이후 재선택 시 바텀 시트 모드로 동작하도록 설정
    selectionSheet.classList.add('bottom-sheet-mode');
    sheetHandle.style.display = 'block';

    renderBenefitList('all');
  });

  // ─── 재선택 버튼 ──────────────────────────────────────
  resetBtn.addEventListener('click', () => {
    // 선택 상태 초기화
    step2.style.display = 'none';
    step1.style.display = 'flex';
    selectedTelecom = null;
    selectedGrade = null;
    nextBtn.classList.remove('active');
    nextBtn.disabled = true;
    document.querySelectorAll('.grade-card').forEach(c => c.classList.remove('selected'));

    // 바텀 시트 열기
    openBottomSheet();
  });

  // 오버레이 클릭 시 닫기 (재선택 모드일 때만)
  selectionOverlay.addEventListener('click', () => {
    if (selectionSheet.classList.contains('bottom-sheet-mode')) {
      closeBottomSheet();
    }
  });

  // ─── 카테고리 탭 ──────────────────────────────────────
  let currentCategory = 'all';
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-category');
      renderBenefitList(currentCategory);
    });
  });

  // ─── 혜택 데이터 (20개) ───────────────────────────────
  const benefitsData = [
    { id: 1, category: 'play', brand: 'CGV', limit: '1일 1회', title: '무료 관람 연 3회', logo: 'assets/logo_cgv.png', telecom: ['SKT', 'LGU+', 'KT'] },
    { id: 2, category: 'food', brand: '베스킨라빈스', limit: '1일 1회', title: '50% 할인(2,000원)', logo: 'assets/logo_baskin.png', telecom: ['SKT', 'KT'] },
    { id: 3, category: 'food', brand: '파리바게뜨', limit: '1일 1회', title: '천원당 100원 할인(모바일카드)', logo: 'assets/logo_paris.png', telecom: ['SKT', 'LGU+'] },
    { id: 4, category: 'life', brand: 'CU', limit: '1일 1회', title: '천원당 100원 할인', logo: 'assets/logo_cu.png', telecom: ['SKT', 'KT', 'LGU+'] },
    { id: 5, category: 'shopping', brand: '이마트', limit: '월 1회', title: '5,000원 할인 쿠폰', logo: 'assets/logo_emart.png', telecom: ['KT', 'LGU+'] },
    { id: 6, category: 'life', brand: 'GS25', limit: '1일 1회', title: '결제 시 10% 할인', logo: 'assets/logo_gs25.png', telecom: ['SKT', 'KT', 'LGU+'] },
    { id: 7, category: 'play', brand: '메가박스', limit: '월 1회', title: '영화 1+1 예매권', logo: 'assets/logo_megabox.png', telecom: ['SKT', 'KT'] },
    { id: 8, category: 'food', brand: '스타벅스', limit: '월 1회', title: '아메리카노 무료', logo: 'assets/logo_starbucks.png', telecom: ['KT', 'LGU+'] },
    { id: 9, category: 'food', brand: '뚜레쥬르', limit: '1일 1회', title: '1,000원당 150원 할인', logo: 'assets/logo_touslesjours.png', telecom: ['SKT', 'LGU+'] },
    { id: 10, category: 'shopping', brand: '11번가', limit: '월 1회', title: '11% 장바구니 쿠폰', logo: 'assets/logo_11st.png', telecom: ['SKT'] },
    { id: 11, category: 'play', brand: '롯데시네마', limit: '월 1회', title: '무료 팝콘 콤보 세트', logo: 'assets/logo_lottecinema.png', telecom: ['KT', 'LGU+'] },
    { id: 12, category: 'food', brand: '도미노피자', limit: '일 1회', title: '방문 포장 30% 할인', logo: 'assets/logo_dominos.png', telecom: ['SKT', 'KT'] },
    { id: 13, category: 'life', brand: '세븐일레븐', limit: '1일 1회', title: '천원당 100원 할인', logo: 'assets/logo_seveneleven.png', telecom: ['SKT', 'LGU+'] },
    { id: 14, category: 'shopping', brand: '올리브영', limit: '월 1회', title: '3,000원 할인권', logo: 'assets/logo_oliveyoung.png', telecom: ['SKT', 'KT', 'LGU+'] },
    { id: 15, category: 'food', brand: '버거킹', limit: '주 1회', title: '와퍼 세트 단품 시 업글', logo: 'assets/logo_burgerking.png', telecom: ['SKT', 'KT'] },
    { id: 16, category: 'life', brand: '쏘카', limit: '월 1회', title: '대여료 20% 할인', logo: 'assets/logo_socar.png', telecom: ['KT', 'LGU+'] },
    { id: 17, category: 'shopping', brand: '무신사', limit: '월 1회', title: '5% 추가 중복 할인 쿠폰', logo: 'assets/logo_musinsa.png', telecom: ['SKT'] },
    { id: 18, category: 'play', brand: '에버랜드', limit: '연 1회', title: '자유이용권 40% 할인', logo: 'assets/logo_everland.png', telecom: ['SKT', 'KT', 'LGU+'] },
    { id: 19, category: 'life', brand: '이마트24', limit: '1일 1회', title: '특정 상품 1+1 혜택', logo: 'assets/logo_emart24.png', telecom: ['KT', 'LGU+'] },
    { id: 20, category: 'food', brand: '던킨도너츠', limit: '월 1회', title: '커피 구매시 아메리카노', logo: 'assets/logo_dunkin.png', telecom: ['SKT', 'LGU+'] }
  ];

  function renderBenefitList(category) {
    benefitList.innerHTML = '';
    let filtered = benefitsData.filter(b => b.telecom.includes(selectedTelecom));
    if (category !== 'all') filtered = filtered.filter(b => b.category === category);

    if (filtered.length === 0) {
      benefitList.innerHTML = `<div style="text-align:center; padding: 40px; color: #8C8D9B;">해당하는 혜택이 없습니다.</div>`;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'benefit-card';
      card.innerHTML = `
        <div class="benefit-info">
          <div class="benefit-brand-row">
            <span class="brand-name">${item.brand}</span>
            <span class="usage-limit">${item.limit}</span>
          </div>
          <div class="benefit-title">${item.title}</div>
        </div>
        <div class="benefit-logo">
          <img src="${item.logo}" alt="${item.brand}" onerror="this.style.display='none'; this.parentNode.innerHTML='<span style=\\'color:#111;font-weight:bold;font-size:10px;\\'>${item.brand.substring(0, 2)}</span>'">
        </div>
      `;
      benefitList.appendChild(card);
    });
  }
});
