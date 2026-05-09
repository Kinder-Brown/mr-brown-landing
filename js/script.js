/* ════════════════════════════════════════════════════════════
   브라운쌤 랜딩페이지 스크립트
   iOS Safari / Android Chrome / 데스크톱 완전 호환
════════════════════════════════════════════════════════════ */

/* ── 스크롤 잠금 / 해제 (iOS body:fixed 방식 제거) ── */
var _scrollY = 0;

function _lockScroll() {
    _scrollY = window.scrollY || window.pageYOffset;
    document.body.style.overflow = 'hidden';
    /* iOS: fixed 대신 overflow hidden만 사용 (position:fixed 제거) */
}

function _unlockScroll() {
    document.body.style.overflow = '';
    /* 스크롤 위치 복원 */
    window.scrollTo(0, _scrollY);
}

/* ── 모달 열기 / 닫기 ── */
function _showModal(el) {
    if (!el) return;
    _lockScroll();
    el.style.display = 'flex';  /* visibility 방식 대신 display 직접 제어 */
    /* requestAnimationFrame으로 transition이 확실히 적용되게 */
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            el.classList.add('open');
        });
    });
}

function _hideModal(el) {
    if (!el) return;
    el.classList.remove('open');
    _unlockScroll();
    /* transition 완료 후 display:none — iOS에서 안전하게 숨김 */
    var dur = 260; /* transition 시간(ms)보다 약간 길게 */
    setTimeout(function () {
        /* 이미 다시 열렸으면 건너뜀 */
        if (!el.classList.contains('open')) {
            el.style.display = 'none';
        }
    }, dur);
}

/* ── 수업 신청 모달 ── */
function openModal() {
    _showModal(document.getElementById('contactModal'));
}

function closeModal() {
    _hideModal(document.getElementById('contactModal'));
}


/* ════════════════════════════════════
   DOMContentLoaded 이후 이벤트 바인딩
════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

    /* 초기 상태: 모달을 display:none으로 설정 */
    var contactModal = document.getElementById('contactModal');
    if (contactModal) {
        contactModal.style.display = 'none';
    }

    /* ── 수업 신청 버튼: button 태그의 onclick이 직접 openModal() 호출 ── */
    /* 중복 이벤트 리스너 등록하지 않음 (iOS 이중 실행 방지) */

    /* ── 모달 닫기: 오버레이(배경) 클릭/터치 ── */
    if (contactModal) {
        contactModal.addEventListener('click', function (e) {
            if (e.target === contactModal) {
                closeModal();
            }
        });
    }

    /* ── 모달 닫기: 닫기 버튼 ── */
    var closeBtn = document.querySelector('#contactModal .modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
    }

});

/* ── ESC 키로 닫기 ── */
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});
