const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

    const CONFIG = {
      apiEndpoint: window.MENU_SAFE_LENS_API || '',
      stripeCheckoutUrl: window.MENU_SAFE_LENS_STRIPE_URL || '',
      demoMode: Boolean(window.MENU_SAFE_LENS_DEMO) || new URLSearchParams(location.search).has('demo'),
      launchPaused: Boolean(window.MENU_SAFE_LENS_LAUNCH_PAUSED)
    };

    const state = {
      file: null,
      objectUrl: null,
      imageMeta: null,
      results: null,
      activeFilter: 'all',
      currency: localStorage.getItem('msl.currency') || 'USD',
      profile: loadProfile(),
      usage: loadUsage()
    };

    const allergies = [
      ['egg', 'Egg'], ['milk', 'Milk'], ['wheat', 'Wheat'], ['soba', 'Soba'],
      ['peanut', 'Peanut'], ['shrimp_crab', 'Shrimp / Crab'], ['fish', 'Fish'], ['sesame', 'Sesame'], ['soy', 'Soy']
    ];
    const rules = [
      ['vegetarian', 'Vegetarian'], ['vegan', 'Vegan'], ['halal', 'Halal'], ['kosher', 'Kosher'],
      ['no_pork', 'No pork'], ['no_beef', 'No beef'], ['no_alcohol', 'No alcohol'], ['jain', 'Jain']
    ];
    const strictness = [
      ['normal', 'Normal', 'Use visible menu text and common Japanese food risks.'],
      ['careful', 'Careful', 'Ask staff when sauce, broth, or oil may matter.'],
      ['strict', 'Strict', 'Unknown recipes become Ask staff. Best for serious needs.']
    ];
    const rates = { USD: 150, EUR: 162, GBP: 190, AUD: 98, CAD: 110 };
    const symbols = { USD: '$', EUR: '€', GBP: '£', AUD: 'A$', CAD: 'C$' };
    const FREE_CHECKS = 3;

    // Demo data is split into assets/js/demo-data.js and loaded only by preview.html.


    function init() {
      buildProfileControls();
      updateProfileStatus();
      updateUsageCopy();
      $('#currencySelect').value = state.currency;
      bindEvents();
      updateLaunchState();
      if (CONFIG.demoMode) toast('Demo preview mode. Real production should use the analysis API.');
    }

    function bindEvents() {
      $('#profileStatus').addEventListener('click', () => openProfileSheet(false));
      $('#openInfo').addEventListener('click', () => $('#infoDialog').showModal());
      $('#choosePhoto').addEventListener('click', () => $('#photoInput').click());
      $('#takePhoto').addEventListener('click', () => $('#cameraInput').click());
      $('#newPhoto').addEventListener('click', () => $('#photoInput').click());
      $('#clearPhoto').addEventListener('click', resetPhoto);
      $('#photoInput').addEventListener('change', handleFileInput);
      $('#cameraInput').addEventListener('change', handleFileInput);
      $('#checkMenu').addEventListener('click', checkMenu);
      $$('[data-close-sheet]').forEach(el => el.addEventListener('click', closeProfileSheet));
      $('#saveProfile').addEventListener('click', saveProfileFromControls);
      $('#resetProfile').addEventListener('click', resetProfile);
      $('#skipProfile').addEventListener('click', skipProfileAndScan);
      $('#currencySelect').addEventListener('change', event => {
        state.currency = event.target.value;
        localStorage.setItem('msl.currency', state.currency);
        if (state.results) renderResults();
      });
      $('#openPaywall').addEventListener('click', openPayDialog);
      $('#startCheckout').addEventListener('click', startCheckout);
      $('#restorePass').addEventListener('click', restorePass);
    }

    function buildProfileControls() {
      $('#allergyGrid').innerHTML = allergies.map(([value, label]) => chipMarkup('allergy', value, label, state.profile.allergies.includes(value))).join('');
      $('#ruleGrid').innerHTML = rules.map(([value, label]) => chipMarkup('rule', value, label, state.profile.rules.includes(value))).join('');
      $('#strictnessGrid').innerHTML = strictness.map(([value, label, note]) => `
        <label class="strictness-card">
          <input type="radio" name="strictness" value="${value}" ${state.profile.strictness === value ? 'checked' : ''}>
          <span><strong>${label}</strong><small>${note}</small></span>
        </label>
      `).join('');
      $('#severeMode').checked = Boolean(state.profile.severe);
    }

    function chipMarkup(type, value, label, checked) {
      return `<label class="choice-chip"><input type="checkbox" data-profile-type="${type}" value="${value}" ${checked ? 'checked' : ''}><span>${label}</span></label>`;
    }

    function updateProfileStatus() {
      const total = state.profile.allergies.length + state.profile.rules.length + (state.profile.severe ? 1 : 0);
      const button = $('#profileStatus');
      if (total > 0) {
        button.textContent = `${total} profile rule${total > 1 ? 's' : ''}`;
        button.classList.add('is-set');
      } else {
        button.textContent = 'Set food profile';
        button.classList.remove('is-set');
      }
      renderQualityChips();
    }

    function openProfileSheet(gated) {
      buildProfileControls();
      $('#profileGateNote').classList.toggle('is-visible', Boolean(gated));
      $('#profileSheet').classList.add('is-open');
      $('#profileSheet').setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
    }

    function closeProfileSheet() {
      $('#profileSheet').classList.remove('is-open');
      $('#profileSheet').setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
    }

    function resetProfile() {
      state.profile = { allergies: [], rules: [], strictness: 'careful', severe: false };
      saveProfileToStorage();
      buildProfileControls();
      updateProfileStatus();
      toast('Food profile reset.');
      if (state.results) renderResults();
    }

    function saveProfileFromControls() {
      state.profile = {
        allergies: $$('input[data-profile-type="allergy"]:checked').map(input => input.value),
        rules: $$('input[data-profile-type="rule"]:checked').map(input => input.value),
        strictness: $('input[name="strictness"]:checked')?.value || 'careful',
        severe: $('#severeMode').checked
      };
      saveProfileToStorage();
      updateProfileStatus();
      closeProfileSheet();
      toast('Food profile saved.');
      if (state.results) renderResults();
    }

    function skipProfileAndScan() {
      closeProfileSheet();
      toast('Scanning without a food profile.');
      checkMenu({ allowNoProfile: true });
    }

    async function handleFileInput(event) {
      const file = event.target.files && event.target.files[0];
      event.target.value = '';
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        toast('Please choose an image file.');
        return;
      }
      const preparedFile = await compressImageForUpload(file);
      setSelectedPhoto(preparedFile);
    }

    async function compressImageForUpload(file) {
      const maxSide = 1200;
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;

      const meta = await readImageMeta(file);
      if (!meta.width || Math.max(meta.width, meta.height) <= maxSide) return file;

      return new Promise(resolve => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(url);
          const scale = maxSide / Math.max(img.naturalWidth, img.naturalHeight);
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.naturalWidth * scale);
          canvas.height = Math.round(img.naturalHeight * scale);
          const context = canvas.getContext('2d');
          if (!context) {
            resolve(file);
            return;
          }
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(blob => {
            if (!blob) {
              resolve(file);
              return;
            }
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
          }, 'image/jpeg', 0.82);
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(file);
        };
        img.src = url;
      });
    }

    async function setSelectedPhoto(file) {
      if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
      state.file = file;
      state.objectUrl = URL.createObjectURL(file);
      state.results = null;
      state.activeFilter = 'all';
      state.imageMeta = await readImageMeta(file);
      $('#photoPreview').src = state.objectUrl;
      $('#photoPreview').classList.add('is-active');
      $('#emptyState').classList.add('is-hidden');
      $('#readout').classList.remove('is-hidden');
      $('#photoActions').classList.remove('is-hidden');
      $('#checkMenu').disabled = false;
      $('#results').classList.remove('is-visible');
      $('#scanner').scrollIntoView({ block: 'start' });
      $('#readoutTitle').textContent = 'Photo ready';
      $('#readoutHint').textContent = state.imageMeta.width ? `${state.imageMeta.width}×${state.imageMeta.height}` : 'Image selected';
      renderQualityChips();
      if (CONFIG.launchPaused) {
        $('#checkMenu').disabled = true;
        toast('Menu scanning opens in about one week.');
      } else {
        toast('Photo selected. Tap Scan menu.');
      }
    }

    function renderQualityChips() {
      const chips = [];
      const hasProfile = hasFoodProfile();
      if (!state.file) {
        chips.push(['is-warn', 'Choose photo']);
      } else if (state.imageMeta?.width && Math.min(state.imageMeta.width, state.imageMeta.height) < 900) {
        chips.push(['is-warn', 'Small photo']);
      } else if (state.file) {
        chips.push(['is-good', 'Text should be readable']);
      }
      chips.push(hasProfile ? ['is-good', 'Profile set'] : ['is-warn', 'Profile recommended']);
      chips.push(CONFIG.launchPaused
        ? ['is-warn', 'Launch soon']
        : [CONFIG.apiEndpoint ? 'is-good' : CONFIG.demoMode ? 'is-warn' : 'is-bad', CONFIG.apiEndpoint ? 'API connected' : CONFIG.demoMode ? 'Demo mode' : 'API required']);
      $('#qualityChips').innerHTML = chips.map(([cls, text]) => `<b class="${cls}">${text}</b>`).join('');
    }

    function resetPhoto() {
      if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
      state.file = null;
      state.objectUrl = null;
      state.imageMeta = null;
      state.results = null;
      $('#photoPreview').removeAttribute('src');
      $('#photoPreview').classList.remove('is-active');
      $('#emptyState').classList.remove('is-hidden');
      $('#readout').classList.add('is-hidden');
      $('#photoActions').classList.add('is-hidden');
      $('#checkMenu').disabled = true;
      $('#results').classList.remove('is-visible');
      toast('Ready for a new menu photo.');
    }

    async function checkMenu(options = {}) {
      if (CONFIG.launchPaused) {
        renderAnalysisFailure('Menu scanning is paused before launch. Full service is planned to start in about one week.');
        toast('Menu scanning opens in about one week.');
        return;
      }
      if (!state.file) {
        toast('Choose a menu photo first.');
        return;
      }
      if (!hasFoodProfile() && !options.allowNoProfile) {
        openProfileSheet(true);
        toast('Set a food profile before checking.');
        return;
      }
      if (!hasActivePass() && state.usage.readableChecks >= FREE_CHECKS) {
        openPayDialog();
        return;
      }
      $('#scanner').classList.add('is-busy');
      $('#checkMenu').disabled = true;
      try {
        const result = await analyzeMenu(state.file, state.profile);
        const normalized = normalizeResult(result);
        state.results = applyProfileToResult(normalized);
        renderResults();
        $('#results').classList.add('is-visible');
        $('#results').scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (state.results.analysisStatus !== 'retake') incrementUsage();
      } catch (error) {
        console.error(error);
        renderAnalysisFailure(error.message || 'Menu check failed. Try a clearer photo.');
      } finally {
        $('#scanner').classList.remove('is-busy');
        $('#checkMenu').disabled = false;
      }
    }

    async function analyzeMenu(file, profile) {
      if (CONFIG.apiEndpoint) {
        const form = new FormData();
        form.append('image', file);
        form.append('profile', JSON.stringify(profile));
        const response = await fetch(CONFIG.apiEndpoint, { method: 'POST', body: form });
        if (!response.ok) throw new Error('Analysis service is unavailable. Please try again.');
        return await response.json();
      }
      if (CONFIG.demoMode) {
        await wait(1000);
        if (!window.MENU_SAFE_LENS_DEMO_DATA) throw new Error('Demo data is not loaded. Open preview.html or use ?demo with demo-data.js loaded.');
        return JSON.parse(JSON.stringify(window.MENU_SAFE_LENS_DEMO_DATA));
      }
      throw new Error('Analysis API is not connected yet. Connect Gemini / Vision API before production launch.');
    }

    function updateLaunchState() {
      if (!CONFIG.launchPaused) return;
      $('#checkMenu').disabled = true;
      $('#checkMenu').textContent = 'Coming soon';
      $('#dockNote').textContent = 'Menu scanning is paused before launch. Full service is planned to start in about one week.';
      $('#emptyState h1').textContent = 'Menu scanning opens soon.';
      $('#emptyState p').textContent = 'Menu Safe Lens is in final preparation. Photo scanning and Gemini analysis are paused until launch.';
      renderQualityChips();
    }

    function normalizeResult(result) {
      const items = Array.isArray(result.items) ? result.items : [];
      if (!items.length) {
        return {
          menuType: result.menuType || 'Unknown menu',
          summary: result.summary || 'No menu items could be read.',
          analysisStatus: 'retake',
          analysisNote: 'No readable items were found. Move closer, improve lighting, or crop around the menu text.',
          items: []
        };
      }
      return {
        menuType: result.menuType || 'Menu',
        summary: result.summary || 'Menu items were extracted from the photo.',
        analysisStatus: ['readable', 'partial', 'retake'].includes(result.analysisStatus) ? result.analysisStatus : 'partial',
        analysisNote: result.analysisNote || 'Some small text may be missed. Ask staff for severe allergies.',
        items: items.map((item, index) => ({
          id: item.id || index + 1,
          status: ['ok', 'ask', 'avoid'].includes(item.status) ? item.status : 'ask',
          nameEn: item.nameEn || item.name_en || 'Unknown item',
          price: Number(item.price || item.price_jpy || 0),
          tags: Array.isArray(item.tags) ? item.tags : [],
          reason: item.reason || item.why || 'This item needs review based on visible text or hidden-risk rules.',
          action: item.action || item.whatToDo || item.what_to_do || 'Ask staff before ordering if this matters to your profile.',
          askJa: item.askJa || item.staff_question_ja || 'この料理の材料と調理方法を確認してもらえますか？',
          orderJa: item.orderJa || item.order_phrase_ja || 'これを1つください。'
        }))
      };
    }

    function applyProfileToResult(result) {
      const copy = JSON.parse(JSON.stringify(result));
      const allergySet = new Set(state.profile.allergies);
      const ruleSet = new Set(state.profile.rules);
      const strict = state.profile.strictness || 'careful';
      const severe = Boolean(state.profile.severe);

      copy.items = copy.items.map(item => {
        const text = [item.nameEn, item.reason, item.action, ...(item.tags || [])].join(' ').toLowerCase();
        let status = item.status;
        const directAvoid =
          (allergySet.has('milk') && /乳|milk|cheese|cream|latte|chowder/.test(text)) ||
          (allergySet.has('wheat') && /小麦|wheat|soy sauce|カレー|curry|sandwich|macaroni|batter/.test(text)) ||
          (allergySet.has('egg') && /卵|egg|温玉|batter/.test(text)) ||
          (allergySet.has('fish') && /魚|fish|mackerel|saba|ネギトロ|bonito|dashi|だし|clam|shellfish/.test(text)) ||
          (allergySet.has('soy') && /soy|醤油|miso|味噌/.test(text)) ||
          (allergySet.has('sesame') && /sesame|ごま/.test(text)) ||
          (allergySet.has('shrimp_crab') && /shrimp|crab|shellfish|clam|貝|えび|かに/.test(text)) ||
          (allergySet.has('soba') && /soba|そば|蕎麦/.test(text)) ||
          (allergySet.has('peanut') && /peanut|ピーナッツ|落花生/.test(text));
        const ruleConflict =
          ((ruleSet.has('no_pork') || ruleSet.has('halal') || ruleSet.has('kosher')) && /豚|pork|ham|麓山高原豚/.test(text)) ||
          (ruleSet.has('no_beef') && /牛|beef/.test(text)) ||
          ((ruleSet.has('vegetarian') || ruleSet.has('vegan') || ruleSet.has('jain')) && /豚|pork|ham|fish|mackerel|saba|ネギトロ|egg|卵|milk|乳|cheese|cream|clam|shellfish/.test(text)) ||
          (ruleSet.has('no_alcohol') && /mirin|sake|alcohol|みりん|酒/.test(text));
        const hiddenRisk = /sauce|broth|だし|スープ|curry|カレー|soy|醤油|miso|味噌|shared|fryer|oil|batter|たれ|ソース/.test(text);

        if (directAvoid || ruleConflict) status = (strict === 'normal' && !directAvoid && !severe) ? 'ask' : 'avoid';
        else if (severe || ((strict === 'careful' || strict === 'strict') && hiddenRisk)) status = 'ask';
        else if (strict === 'strict') status = 'ask';

        return { ...item, status };
      });
      return copy;
    }

    function renderResults() {
      const data = state.results;
      if (!data) return;
      const counts = countStatuses(data.items);
      $('#resultTitle').textContent = data.analysisStatus === 'retake' ? 'Take a clearer photo.' : 'Review before ordering.';
      $('#menuSummaryTitle').textContent = `${data.items.length} item${data.items.length === 1 ? '' : 's'} found`;
      $('#menuSummaryText').textContent = data.summary || 'Menu structure, prices, and visible labels were extracted.';
      $('#scanStatusPill').textContent = scanLabel(data.analysisStatus);
      renderAnalysisStatus(data.analysisStatus, data.analysisNote);
      $('#stats').innerHTML = `
        ${statMarkup('avoid', counts.avoid, 'Avoid', 'Selected conflict found')}
        ${statMarkup('ask', counts.ask, 'Ask staff', 'Hidden or unclear risk')}
        ${statMarkup('ok', counts.ok, 'No obvious issue', 'No selected conflict detected')}
      `;
      renderTabs(counts);
      renderCards(data.items);
    }

    function renderAnalysisStatus(status, note) {
      const panel = $('#analysisStatus');
      panel.className = 'status-panel is-visible';
      if (status === 'partial') panel.classList.add('is-warn');
      if (status === 'retake') panel.classList.add('is-error');
      const title = status === 'readable' ? 'Readable scan' : status === 'partial' ? 'Partially readable' : 'Retake recommended';
      panel.innerHTML = `<strong>${title}</strong><span>${escapeHtml(note || 'Check the extracted text and ask staff when unsure.')}</span>`;
    }

    function renderAnalysisFailure(message) {
      state.results = null;
      $('#results').classList.add('is-visible');
      $('#resultTitle').textContent = 'Menu check unavailable.';
      $('#menuSummaryTitle').textContent = 'No chargeable check';
      $('#menuSummaryText').textContent = 'The app did not return a menu result.';
      $('#scanStatusPill').textContent = 'Not counted';
      $('#analysisStatus').className = 'status-panel is-visible is-error';
      $('#analysisStatus').innerHTML = `<strong>Could not check this menu</strong><span>${escapeHtml(message)} Failed or unreadable checks should not count against a paid plan.</span>`;
      $('#stats').innerHTML = '';
      $('#tabs').innerHTML = '';
      $('#groupedCards').innerHTML = `<article class="notice-card"><h3>Try again</h3><p>Use a brighter photo, move closer to the text, or crop around the item you want to check.</p></article>`;
      $('#results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function scanLabel(status) {
      if (status === 'readable') return 'Readable';
      if (status === 'partial') return 'Partial';
      if (status === 'retake') return 'Retake';
      return 'Review';
    }

    function statMarkup(type, count, label, note) {
      const cls = type === 'avoid' ? 'stat-card--avoid' : type === 'ask' ? 'stat-card--ask' : 'stat-card--ok';
      return `<div class="stat-card ${cls}"><b>${count}</b><strong>${label}</strong><span>${note}</span></div>`;
    }

    function renderTabs(counts) {
      const total = state.results.items.length;
      const tabs = [['all', `All ${total}`], ['ok', `Best options ${counts.ok}`], ['ask', `Ask staff ${counts.ask}`], ['avoid', `Avoid ${counts.avoid}`]];
      $('#tabs').innerHTML = tabs.map(([key, label]) => `<button class="tab ${state.activeFilter === key ? 'is-active' : ''}" type="button" data-filter="${key}">${label}</button>`).join('');
      $$('.tab').forEach(tab => tab.addEventListener('click', () => {
        state.activeFilter = tab.dataset.filter;
        renderResults();
      }));
    }

    function renderCards(items) {
      const groups = [['ok', 'Best options', 'No selected conflict detected'], ['ask', 'Ask staff first', 'Confirm hidden ingredients before ordering'], ['avoid', 'Avoid', 'Selected conflict found']];
      const html = groups.map(([status, title, note]) => {
        if (state.activeFilter !== 'all' && state.activeFilter !== status) return '';
        const list = items.filter(item => item.status === status);
        if (!list.length) return '';
        return `<div class="group-title"><h3>${title}</h3><span>${note}</span></div><div class="cards">${list.map(cardMarkup).join('')}</div>`;
      }).join('');
      $('#groupedCards').innerHTML = html || `<div class="notice-card"><h3>No items in this filter</h3><p>Try another filter or check your food profile.</p></div>`;
      $$('[data-staff-id]').forEach(btn => btn.addEventListener('click', () => openStaffDialog(btn.dataset.staffId)));
      $$('[data-order-id]').forEach(btn => btn.addEventListener('click', () => openOrderDialog(btn.dataset.orderId)));
    }

    function cardMarkup(item) {
      const badge = statusBadge(item.status);
      const riskClass = item.status === 'avoid' ? 'dish-card--avoid' : item.status === 'ask' ? 'dish-card--ask' : '';
      const orderDisabled = item.status === 'avoid' || (item.status === 'ask' && state.profile.severe);
      const primary = item.status === 'ok'
        ? `<button class="small-button small-button--primary" type="button" data-order-id="${item.id}">Show order phrase</button><button class="small-button" type="button" data-staff-id="${item.id}">Ask staff question</button>`
        : `<button class="small-button ${item.status === 'avoid' ? 'small-button--danger' : 'small-button--primary'}" type="button" data-staff-id="${item.id}">Ask staff question</button><button class="small-button" type="button" data-order-id="${item.id}" ${orderDisabled ? 'disabled' : ''}>${item.status === 'avoid' ? 'Do not order' : 'Order after confirmation'}</button>`;
      return `
        <article class="dish-card ${riskClass}" tabindex="0">
          ${badge}
          <div class="dish-head">
            <div class="dish-title-box">
              <span class="dish-index">#${item.id}</span>
              <h3 class="dish-ja">${escapeHtml(item.nameEn)}</h3>
            </div>
            ${priceMarkup(item.price)}
          </div>
          <div class="tags">${(item.tags || []).map(tag => `<span class="tag ${tagClass(tag)}">${escapeHtml(tag)}</span>`).join('')}</div>
          <div class="reason-box"><strong>Possible hidden risk</strong><span>${escapeHtml(item.reason)}</span></div>
          <div class="reason-box"><strong>What to do</strong><span class="what-to-do">${escapeHtml(item.action)}</span></div>
          <div class="card-actions">${primary}</div>
        </article>
      `;
    }

    function statusBadge(status) {
      if (status === 'avoid') return '<span class="status-badge status-badge--avoid">Avoid</span>';
      if (status === 'ask') return '<span class="status-badge status-badge--ask">Ask staff</span>';
      return '<span class="status-badge status-badge--ok">No obvious issue</span>';
    }

    function tagClass(tag) {
      const lower = String(tag).toLowerCase();
      if (/pork|allergen|egg|milk|wheat|fish|soy|crab|shrimp|shellfish|soba|peanut/.test(lower)) return 'tag--risk';
      if (/choice|included|possible|shown|hidden|ask/.test(lower)) return 'tag--ask';
      return '';
    }

    function priceMarkup(price) {
      if (!price) return '<span class="price">Price unclear</span>';
      const converted = Math.max(1, Math.round(price / rates[state.currency]));
      return `<span class="price">¥${Number(price).toLocaleString()} / about ${symbols[state.currency]}${converted}</span>`;
    }

    function openStaffDialog(id) {
      const item = findItem(id);
      if (!item) return;
      const title = item.status === 'avoid' ? 'Avoid' : item.status === 'ask' ? 'Ask first' : 'Confirm';
      $('#dialogContent').innerHTML = `
        <p class="eyebrow">Show this to staff</p>
        <h2>${title}</h2>
        <p>${escapeHtml(item.nameEn)}</p>
        <div class="staff-card"><strong>Show this to staff</strong><span class="ja-large">${escapeHtml(item.askJa)}</span></div>
        <div class="dialog-actions"><button class="button button--accent" type="button" id="copyStaff">Copy Japanese</button></div>
      `;
      $('#staffDialog').showModal();
      $('#copyStaff').addEventListener('click', () => copyText(item.askJa));
    }

    function openOrderDialog(id) {
      const item = findItem(id);
      if (!item || item.status === 'avoid') return;
      $('#dialogContent').innerHTML = `
        <p class="eyebrow">Order phrase</p>
        <h2>Order</h2>
        <p>${escapeHtml(item.nameEn)} · ${priceText(item.price)}</p>
        ${item.status === 'ask' ? '<div class="status-panel status-panel--dialog is-visible is-warn"><strong>Confirm first</strong><span>This item had an Ask staff result. Use the staff question before ordering.</span></div>' : ''}
        <div class="staff-card"><strong>Show this to staff</strong><span class="ja-large">${escapeHtml(item.orderJa)}</span></div>
        <div class="dialog-actions"><button class="button button--accent" type="button" id="copyOrder">Copy Japanese</button></div>
      `;
      $('#staffDialog').showModal();
      $('#copyOrder').addEventListener('click', () => copyText(item.orderJa));
    }

    function priceText(price) {
      if (!price) return 'price unclear';
      return `¥${Number(price).toLocaleString()} / about ${symbols[state.currency]}${Math.max(1, Math.round(price / rates[state.currency]))}`;
    }

    function findItem(id) { return state.results?.items.find(item => String(item.id) === String(id)); }
    function countStatuses(items) { return items.reduce((acc, item) => { acc[item.status] = (acc[item.status] || 0) + 1; return acc; }, { avoid: 0, ask: 0, ok: 0 }); }

    function hasFoodProfile() { return state.profile.allergies.length > 0 || state.profile.rules.length > 0 || state.profile.severe; }
    function hasActivePass() { return localStorage.getItem('msl.pass') === 'active'; }
    function openPayDialog() { $('#payDialog').showModal(); }
    function startCheckout() {
      if (CONFIG.stripeCheckoutUrl) location.href = CONFIG.stripeCheckoutUrl;
      else toast('Connect Stripe Checkout URL before launch.');
    }
    function restorePass() { toast('Pass restore needs server-side account or receipt validation.'); }

    function loadProfile() {
      try { return { allergies: [], rules: [], strictness: 'careful', severe: false, ...JSON.parse(localStorage.getItem('msl.profile') || '{}') }; }
      catch { return { allergies: [], rules: [], strictness: 'careful', severe: false }; }
    }
    function saveProfileToStorage() { localStorage.setItem('msl.profile', JSON.stringify(state.profile)); }
    function loadUsage() {
      try { return { readableChecks: 0, ...JSON.parse(localStorage.getItem('msl.usage') || '{}') }; }
      catch { return { readableChecks: 0 }; }
    }
    function incrementUsage() {
      if (hasActivePass()) return;
      state.usage.readableChecks += 1;
      localStorage.setItem('msl.usage', JSON.stringify(state.usage));
      updateUsageCopy();
    }
    function updateUsageCopy() {
      const left = Math.max(0, FREE_CHECKS - state.usage.readableChecks);
      $('#dockNote').textContent = hasActivePass()
        ? 'Trip pass active. Severe allergies still need staff confirmation.'
        : `${left} free readable check${left === 1 ? '' : 's'} left. Unreadable or failed checks should not count.`;
    }

    function readImageMeta(file) {
      return new Promise(resolve => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => { URL.revokeObjectURL(url); resolve({ width: img.naturalWidth, height: img.naturalHeight, size: file.size }); };
        img.onerror = () => { URL.revokeObjectURL(url); resolve({ width: 0, height: 0, size: file.size }); };
        img.src = url;
      });
    }

    function copyText(text) {
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => toast('Copied.'));
      else toast('Copy is not available in this browser.');
    }
    function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    function toast(message) {
      const el = $('#toast');
      el.textContent = message;
      el.classList.add('is-visible');
      clearTimeout(toast.timer);
      toast.timer = setTimeout(() => el.classList.remove('is-visible'), 2600);
    }
    function escapeHtml(value) {
      return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
    }

    init();
