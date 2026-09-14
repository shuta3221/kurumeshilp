(() => {
  const host = document.getElementById('service-guide');
  if (!host) return;
  const questions = [
    ['主にどんな場面で利用しますか？', ['日常の社内利用', '会議・研修', '撮影・イベント', 'その他・複数']],
    ['お弁当の手配は、どのように進めたいですか？', ['自分で選んで注文したい', '大量・継続的な手配を相談したい', 'まだ分からない']],
    ['支払いについて、改善したいことはありますか？', ['複数の注文の請求をまとめたい', '立替・領収書処理を減らしたい', '今のままでよい', '相談したい']],
    ['社内のお弁当利用を、どこまで把握したいですか？', ['請求がまとまれば十分', '部署・利用者別の実績を把握したい', '予算と実績を比較したい', 'まだ分からない']]
  ];
  let step = 0;
  let answers = Array(4).fill(null);
  function recommendation(a) {
    // Policy B: an undecided answer in Q2 or Q4 routes to general consultation.
    if (a[1] === 2 || a[3] === 3) return ['法人利用の総合相談', 'まだ決まっていない手配や利用管理のご希望を含め、今の利用方法に合うサポートを一緒に整理します。', '利用方法を相談する', '#contact'];
    const bulk = a[1] === 1;
    const management = a[3] === 1 || a[3] === 2;
    if (bulk && management) return ['大口発注＋管理のご相談', '手配の支援と、社内の利用管理の両方をご希望のため、まとめてご相談いただく方法がおすすめです。', '大口発注・管理についてまとめて相談する →', '#contact'];
    if (management) {
      const payment = ['請求の集約も含めて、', '立替・領収書処理の負担軽減も含めて、', '', '支払い方法のご相談も含めて、'][a[2]];
      return ['管理向けサービスのご相談', '利用実績の把握や予算管理をご希望のため、' + payment + '集計単位や運用方法から相談できる窓口をご案内します。', '管理について相談する', '#contact'];
    }
    if (bulk) return ['大口発注向けサービスのご相談', '大量・継続的な手配の支援をご希望のため、お弁当選びや発注を相談できる窓口がおすすめです。', '大口発注について相談する', '#contact'];
    if (a[1] === 0 && (a[2] === 0 || a[2] === 1 || (a[2] === 2 && a[3] === 0))) return ['通常の一括精算', 'ご自身で注文でき、請求の集約が主なご希望のため、まずは一括精算の利用方法をご確認ください。', '一括精算の詳細を見る', 'https://www.kurumesi-bentou.com/business/'];
    return ['法人利用の総合相談', '今の利用方法やお困りごとを伺い、必要なサポートを一緒に整理します。', '利用方法を相談する', '#contact'];
  }
  function render(focus = true) {
    host.replaceChildren();
    const el = (tag, text, cls) => { const node = document.createElement(tag); if (text) node.textContent = text; if (cls) node.className = cls; return node; };
    if (step < 4) {
      host.append(el('p', `質問 ${step + 1} ／ 4`, 'guide-progress'));
      const progress = el('progress'); progress.max = 4; progress.value = step + 1; progress.setAttribute('aria-label', '質問の進行状況'); host.append(progress);
      const fieldset = el('fieldset'); const legend = el('legend', questions[step][0]); legend.tabIndex = -1; fieldset.append(legend);
      const choices = el('div', null, 'guide-choices');
      questions[step][1].forEach((text, i) => {
        const label = el('label'); const input = el('input'); input.type = 'radio'; input.name = 'guide-choice'; input.value = i; input.checked = answers[step] === i;
        input.addEventListener('change', () => { answers[step] = i; next.disabled = false; });
        label.append(input, el('span', text)); choices.append(label);
      });
      fieldset.append(choices); host.append(fieldset);
      const actions = el('div', null, 'guide-actions');
      const back = el('button', '戻る', 'guide-back'); back.type = 'button'; back.disabled = step === 0; back.onclick = () => { step--; render(); };
      const next = el('button', step === 3 ? 'おすすめの相談先を見る →' : '次へ →', 'button'); next.type = 'button'; next.disabled = answers[step] === null; next.onclick = () => { step++; render(); };
      actions.append(back, next); host.append(actions); if (focus) legend.focus();
    } else {
      const result = recommendation(answers);
      const sceneIntro = [
        '日常の社内利用に向けて、次の利用方法をご案内します。',
        '会議・研修でのご利用に向けて、次の利用方法をご案内します。',
        '撮影・イベントでのご利用に向けて、次の利用方法をご案内します。',
        'その他の場面や複数のシーンでのご利用に向けて、次の利用方法をご案内します。'
      ];
      host.append(el('p', 'あなたにおすすめの利用方法', 'guide-progress'));
      const title = el('h3', result[0]); title.tabIndex = -1; host.append(title, el('p', sceneIntro[answers[0]] + result[1]));
      const summary = el('dl', null, 'guide-summary'); questions.forEach((q, i) => { summary.append(el('dt', ['利用シーン', '手配', '支払い', '利用管理'][i]), el('dd', q[1][answers[i]])); }); host.append(summary);
      const link = el('a', result[2].replace(/ →$/, ''), 'button'); link.href = result[3];
      if (result[3] === '#contact') {
        link.classList.add('icon-cta');
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('class', 'cta-icon');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('aria-hidden', 'true');
        icon.setAttribute('focusable', 'false');
        icon.setAttribute('fill', 'none');
        icon.setAttribute('stroke', 'currentColor');
        icon.setAttribute('stroke-width', '1.7');
        icon.setAttribute('stroke-linejoin', 'round');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M3 5h18v14H3Z M3 5l9 8 9-8');
        icon.append(path);
        const label = el('span', link.textContent);
        link.replaceChildren(icon, label);
      }
      link.onclick = () => {
        let note = document.getElementById('guide-contact-summary');
        if (!note) { note = el('p'); note.id = 'guide-contact-summary'; document.querySelector('#contact .wrap').append(note); }
        note.textContent = `ご相談の候補：${result[0]}（${questions[0][1][answers[0]]}）`;
      };
      host.append(link, el('p', '回答に基づく目安です。適用条件や対応範囲は、ご相談時に確認します。', 'note'));
      const back = el('button', '回答を見直す', 'guide-back'); back.type = 'button'; back.onclick = () => { step = 3; render(); };
      const restart = el('button', '最初からやり直す', 'guide-back'); restart.type = 'button'; restart.onclick = () => { answers = Array(4).fill(null); step = 0; document.getElementById('guide-contact-summary')?.remove(); render(); };
      host.append(back, restart); if (focus) title.focus();
    }
  }
  render(false);
})();
