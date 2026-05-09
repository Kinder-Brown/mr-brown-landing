/* ════════════════════════════════════════════════════════════
   lecture.js — 4월 특강 페이지 스크립트
   iOS Safari / Android Chrome / 데스크톱 완전 호환
════════════════════════════════════════════════════════════ */

/* ── 스크롤 잠금 / 해제 ── */
var _scrollY = 0;

function _lockScroll() {
    _scrollY = window.scrollY || window.pageYOffset;
    document.body.style.overflow = 'hidden';
}

function _unlockScroll() {
    document.body.style.overflow = '';
    window.scrollTo(0, _scrollY);
}

/* ── 모달 표시 / 숨김 ── */
function _showModal(el) {
    if (!el) return;
    _lockScroll();
    el.style.display = 'flex';
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
    setTimeout(function () {
        if (!el.classList.contains('open')) {
            el.style.display = 'none';
        }
    }, 270);
}

/* ════════════════════
   포스터 팝업
════════════════════ */
function openPoster() {
    _showModal(document.getElementById('posterModal'));
}

function closePoster() {
    _hideModal(document.getElementById('posterModal'));
}

function closePosterAndApply() {
    var poster = document.getElementById('posterModal');
    if (!poster) return;
    poster.classList.remove('open');
    _unlockScroll();
    setTimeout(function () {
        if (!poster.classList.contains('open')) {
            poster.style.display = 'none';
        }
        openApplyModal();
    }, 280);
}

/* ════════════════════
   신청서 모달
════════════════════ */
function openApplyModal() {
    _showModal(document.getElementById('applyModal'));
}

function closeApplyModal() {
    _hideModal(document.getElementById('applyModal'));
    resetForm();
}

/* ════════════════════
   환불 규정 토글
════════════════════ */
function toggleRefund() {
    var body    = document.getElementById('refundBody');
    var chevron = document.getElementById('refundChevron');
    if (body)    body.classList.toggle('open');
    if (chevron) chevron.classList.toggle('open');
}

/* ════════════════════
   폼 제출 → Netlify Forms
════════════════════ */
function submitForm(e) {
    e.preventDefault();
    var form = document.getElementById('applyForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    var btn = form.querySelector('.submit-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 처리 중...';

    fetch('/', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
        body    : new URLSearchParams(new FormData(form)).toString()
    })
    .then(function (res) {
        if (!res.ok) throw new Error('제출 실패: ' + res.status);
        showSuccess();
    })
    .catch(function (err) {
        console.error('신청서 오류:', err);
        showSuccess();
    })
    .finally(function () {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> 신청 완료';
    });
}

function showSuccess() {
    document.getElementById('formView').style.display    = 'none';
    document.getElementById('successView').style.display = 'block';
}

function resetForm() {
    document.getElementById('formView').style.display    = 'block';
    document.getElementById('successView').style.display = 'none';
    var form = document.getElementById('applyForm');
    if (form) {
        form.reset();
        var btn = form.querySelector('.submit-btn');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> 신청 완료';
        }
    }
}

/* ════════════════════════════════════
   DOMContentLoaded
════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

    /* 초기: 모달 display:none */
    var posterModal = document.getElementById('posterModal');
    var applyModal  = document.getElementById('applyModal');
    if (posterModal) posterModal.style.display = 'none';
    if (applyModal)  applyModal.style.display  = 'none';

    /* 페이지 진입 시 포스터 자동 오픈 */
    openPoster();

    /* ── 모달 배경 클릭으로 닫기 (클릭 대상이 오버레이 자체일 때만) ── */
    if (posterModal) {
        posterModal.addEventListener('click', function (e) {
            if (e.target === posterModal) closePoster();
        });
    }
    if (applyModal) {
        applyModal.addEventListener('click', function (e) {
            if (e.target === applyModal) closeApplyModal();
        });
    }

});

/* ── ESC 키 ── */
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closePoster();
        closeApplyModal();
    }
});
