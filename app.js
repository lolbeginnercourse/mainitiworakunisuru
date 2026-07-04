(() => {
      "use strict";

      const STORAGE_KEY = "dailyQuestRpgState_v1";
      const EXP_TO_LEVEL = 100;

      const $ = (selector) => document.querySelector(selector);
      const els = {
        levelText: $("#levelText"),
        goldText: $("#goldText"),
        hpText: $("#hpText"),
        expText: $("#expText"),
        hpBar: $("#hpBar"),
        expBar: $("#expBar"),
        habitsCount: $("#habitsCount"),
        dailiesCount: $("#dailiesCount"),
        todosCount: $("#todosCount"),
        rewardsCount: $("#rewardsCount"),
        habitsList: $("#habitsList"),
        dailiesList: $("#dailiesList"),
        todosList: $("#todosList"),
        rewardList: $("#rewardList"),
        addHabitArea: $("#addHabitArea"),
        addDailyArea: $("#addDailyArea"),
        addTodoArea: $("#addTodoArea"),
        addRewardArea: $("#addRewardArea"),
        toggleHabitForm: $("#toggleHabitForm"),
        toggleDailyForm: $("#toggleDailyForm"),
        toggleTodoForm: $("#toggleTodoForm"),
        toggleRewardForm: $("#toggleRewardForm"),
        logBox: $("#logBox"),
        toast: $("#toast")
      };

      let state = null;
      let addOpen = {
        habits: false,
        dailies: false,
        todos: false,
        rewards: false
      };
      let toastTimer = null;

      function uid(prefix) {
        if (window.crypto && crypto.randomUUID) return prefix + "_" + crypto.randomUUID();
        return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2);
      }

      function todayKey(date = new Date()) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      }

      function escapeHtml(value) {
        return String(value ?? "")
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");
      }

      function clampNumber(value, min, max, fallback) {
        const n = Number.parseInt(value, 10);
        if (Number.isNaN(n)) return fallback;
        return Math.min(max, Math.max(min, n));
      }

      function newInitialState() {
        const today = todayKey();
        return {
          activeTab: "habits",
          lastDailyCheck: today,
          player: {
            level: 1,
            hp: 100,
            maxHp: 100,
            exp: 0,
            gold: 0
          },
          tasks: {
            habits: [
              {
                id: uid("habit"),
                plusText: "1回深呼吸した",
                minusText: "謎の不安に襲われた",
                exp: 5,
                gold: 5,
                damage: 10,
                createdAt: Date.now()
              },
              {
                id: uid("habit"),
                plusText: "ネットで有益な情報を調べた",
                minusText: "SNSを無目的で1時間スクロールした",
                exp: 5,
                gold: 5,
                damage: 10,
                createdAt: Date.now()
              }
            ],
            dailies: [
              {
                id: uid("daily"),
                title: "とりあえず布団から出た",
                difficulty: "低",
                exp: 10,
                gold: 10,
                damage: 15,
                completedDate: null,
                createdAt: Date.now()
              },
              {
                id: uid("daily"),
                title: "スマホを充電器に挿した",
                difficulty: "低",
                exp: 10,
                gold: 10,
                damage: 15,
                completedDate: null,
                createdAt: Date.now()
              },
              {
                id: uid("daily"),
                title: "太陽の光を3秒以上浴びた",
                difficulty: "中",
                exp: 20,
                gold: 20,
                damage: 20,
                completedDate: null,
                createdAt: Date.now()
              },
              {
                id: uid("daily"),
                title: "今日も生き抜いた",
                difficulty: "高",
                exp: 40,
                gold: 40,
                damage: 35,
                completedDate: null,
                createdAt: Date.now()
              }
            ],
            todos: []
          },
          rewards: [
            {
              id: uid("reward"),
              title: "好きな動画・アニメを1話見て良い",
              cost: 50,
              createdAt: Date.now()
            },
            {
              id: uid("reward"),
              title: "今日はもう1歩も動かなくて良い",
              cost: 100,
              createdAt: Date.now()
            }
          ],
          log: [
            {
              id: uid("log"),
              text: "冒険開始。まずは生存確認から。",
              at: Date.now()
            }
          ]
        };
      }

      function normalizeState(raw) {
        const base = newInitialState();
        const next = { ...base, ...raw };
        next.player = { ...base.player, ...(raw?.player || {}) };
        next.tasks = { ...base.tasks, ...(raw?.tasks || {}) };
        next.tasks.habits = Array.isArray(next.tasks.habits) ? next.tasks.habits : [];
        next.tasks.dailies = Array.isArray(next.tasks.dailies) ? next.tasks.dailies : [];
        next.tasks.todos = Array.isArray(next.tasks.todos) ? next.tasks.todos : [];
        next.rewards = Array.isArray(next.rewards) ? next.rewards : [];
        next.log = Array.isArray(next.log) ? next.log : [];
        next.activeTab = ["habits", "dailies", "todos"].includes(next.activeTab) ? next.activeTab : "habits";
        next.lastDailyCheck = next.lastDailyCheck || todayKey();
        next.player.maxHp = 100;
        next.player.hp = clampNumber(next.player.hp, 0, 100, 100);
        next.player.exp = clampNumber(next.player.exp, 0, 9999, 0);
        next.player.gold = clampNumber(next.player.gold, 0, 999999, 0);
        next.player.level = clampNumber(next.player.level, 1, 999, 1);
        return next;
      }

      function loadState() {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (!saved) return newInitialState();
          return normalizeState(JSON.parse(saved));
        } catch (error) {
          console.warn("LocalStorageの読み込みに失敗したため初期化します", error);
          return newInitialState();
        }
      }

      function saveState() {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
          showToast("保存に失敗しました。ブラウザの容量制限を確認してください。");
          console.warn(error);
        }
      }

      function addLog(text) {
        state.log.unshift({ id: uid("log"), text, at: Date.now() });
        state.log = state.log.slice(0, 40);
      }

      function showToast(message) {
        els.toast.textContent = message;
        els.toast.classList.add("show");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => els.toast.classList.remove("show"), 2200);
      }

      function gain(exp, gold, reason) {
        const player = state.player;
        player.exp += exp;
        player.gold += gold;
        addLog(`＋ ${reason}：EXP ${exp} / ${gold}G 獲得`);

        let levelUps = 0;
        while (player.exp >= EXP_TO_LEVEL) {
          player.exp -= EXP_TO_LEVEL;
          player.level += 1;
          player.hp = player.maxHp;
          levelUps += 1;
        }

        if (levelUps > 0) {
          addLog(`LEVEL UP！ Lv.${player.level} になった。HP全回復。`);
          showToast(`レベルアップ！ Lv.${player.level} / HP全回復`);
        } else {
          showToast(`EXP+${exp} / ${gold}G 獲得`);
        }
        saveState();
        render();
      }

      function takeDamage(amount, reason) {
        const player = state.player;
        player.hp -= amount;
        addLog(`－ ${reason}：HP ${amount} ダメージ`);

        if (player.hp <= 0) {
          const oldGold = player.gold;
          player.level = Math.max(1, player.level - 1);
          player.gold = Math.floor(player.gold / 2);
          player.exp = 0;
          player.hp = player.maxHp;
          addLog(`HPが0になった。Lv.${player.level} に低下、ゴールドは ${oldGold}G → ${player.gold}G。だが生きてる。`);
          showToast("HPが0。レベル低下＆ゴールド半減。でも再開できる。");
        } else {
          showToast(`HP-${amount}。まだ冒険は続く。`);
        }
        saveState();
        render();
      }

      function checkDailyPenalty() {
        const today = todayKey();
        const last = state.lastDailyCheck || today;
        if (last === today) return;

        const missed = state.tasks.dailies.filter(daily => daily.completedDate !== last);
        if (missed.length > 0) {
          const totalDamage = missed.reduce((sum, daily) => sum + Number(daily.damage || 0), 0);
          const names = missed.map(daily => `「${daily.title}」`).join(" ");
          takeDamage(totalDamage, `日付変更ペナルティ ${names}`);
        } else {
          addLog("日付が変わった。昨日の日課は全部クリア済み。偉業。");
        }
        state.lastDailyCheck = today;
        saveState();
      }

      function difficultyClass(difficulty) {
        if (difficulty === "高") return "bad";
        if (difficulty === "中") return "warn";
        return "ok";
      }

      function renderStatus() {
        const p = state.player;
        els.levelText.textContent = p.level;
        els.goldText.textContent = p.gold;
        els.hpText.textContent = `${p.hp}/${p.maxHp}`;
        els.expText.textContent = `${p.exp}/${EXP_TO_LEVEL}`;
        els.hpBar.style.width = `${Math.max(0, Math.min(100, (p.hp / p.maxHp) * 100))}%`;
        els.expBar.style.width = `${Math.max(0, Math.min(100, (p.exp / EXP_TO_LEVEL) * 100))}%`;
      }

      function renderCounts() {
        els.habitsCount.textContent = `${state.tasks.habits.length} QUEST`;
        els.dailiesCount.textContent = `${state.tasks.dailies.length} QUEST`;
        els.todosCount.textContent = `${state.tasks.todos.length} QUEST`;
        els.rewardsCount.textContent = `${state.rewards.length} ITEM`;
      }

      function renderHabits() {
        const tasks = state.tasks.habits;
        if (tasks.length === 0) {
          els.habitsList.innerHTML = `<div class="empty">まだ習慣がありません。<br>押すだけで自分を褒められる行動を追加してください。</div>`;
          return;
        }

        els.habitsList.innerHTML = tasks.map(habit => `
          <article class="task-card habit-card">
            <button class="side-action plus" data-action="habit-plus" data-id="${escapeHtml(habit.id)}" type="button" aria-label="${escapeHtml(habit.plusText)}を達成">＋</button>
            <div class="task-core">
              <div class="habit-labels">
                <span class="plus-label">＋ ${escapeHtml(habit.plusText)}</span>
                <span class="minus-label">－ ${escapeHtml(habit.minusText)}</span>
              </div>
              <div class="task-meta">
                <span class="badge ok">EXP ${escapeHtml(habit.exp)}</span>
                <span class="badge warn">G ${escapeHtml(habit.gold)}</span>
                <span class="badge bad">DMG ${escapeHtml(habit.damage)}</span>
              </div>
              <button class="delete-btn" data-action="delete-task" data-type="habits" data-id="${escapeHtml(habit.id)}" type="button" aria-label="習慣を削除">×</button>
            </div>
            <button class="side-action minus" data-action="habit-minus" data-id="${escapeHtml(habit.id)}" type="button" aria-label="${escapeHtml(habit.minusText)}でダメージ">−</button>
          </article>
        `).join("");
      }

      function renderDailies() {
        const tasks = state.tasks.dailies;
        if (tasks.length === 0) {
          els.dailiesList.innerHTML = `<div class="empty">まだ日課がありません。<br>1日1回だけ押せる生存クエストを追加できます。</div>`;
          return;
        }

        const today = todayKey();
        els.dailiesList.innerHTML = tasks.map(daily => {
          const done = daily.completedDate === today;
          return `
            <article class="task-card check-card ${done ? "done" : ""}">
              <label class="check-row">
                <input class="quest-check" type="checkbox" data-action="daily-complete" data-id="${escapeHtml(daily.id)}" ${done ? "checked disabled" : ""}>
                <span>
                  <span class="task-name">${escapeHtml(daily.title)}</span>
                  <span class="task-meta">
                    <span class="badge ${difficultyClass(daily.difficulty)}">難易度 ${escapeHtml(daily.difficulty)}</span>
                    <span class="badge ok">EXP ${escapeHtml(daily.exp)}</span>
                    <span class="badge warn">G ${escapeHtml(daily.gold)}</span>
                    <span class="badge bad">サボりDMG ${escapeHtml(daily.damage)}</span>
                  </span>
                </span>
              </label>
              <button class="delete-btn" data-action="delete-task" data-type="dailies" data-id="${escapeHtml(daily.id)}" type="button" aria-label="日課を削除">×</button>
            </article>
          `;
        }).join("");
      }

      function renderTodos() {
        const tasks = state.tasks.todos;
        if (tasks.length === 0) {
          els.todosList.innerHTML = `<div class="empty">まだToDoがありません。<br>期限付きの単発クエストを置けます。</div>`;
          return;
        }

        const today = todayKey();
        els.todosList.innerHTML = tasks.map(todo => {
          const done = Boolean(todo.completed);
          const overdue = todo.dueDate && todo.dueDate < today && !done;
          return `
            <article class="task-card check-card ${done ? "done" : ""}">
              <label class="check-row">
                <input class="quest-check" type="checkbox" data-action="todo-complete" data-id="${escapeHtml(todo.id)}" ${done ? "checked disabled" : ""}>
                <span>
                  <span class="task-name">${escapeHtml(todo.title)}</span>
                  <span class="task-meta">
                    <span class="badge ${overdue ? "bad" : "blue"}">期限 ${escapeHtml(todo.dueDate || "なし")}</span>
                    <span class="badge ok">EXP ${escapeHtml(todo.exp)}</span>
                    <span class="badge warn">G ${escapeHtml(todo.gold)}</span>
                    ${overdue ? `<span class="badge bad">期限切れ</span>` : ""}
                  </span>
                </span>
              </label>
              <button class="delete-btn" data-action="delete-task" data-type="todos" data-id="${escapeHtml(todo.id)}" type="button" aria-label="ToDoを削除">×</button>
            </article>
          `;
        }).join("");
      }

      function renderRewards() {
        if (state.rewards.length === 0) {
          els.rewardList.innerHTML = `<div class="empty empty--full">ご褒美がありません。<br>「5分だけ横になる」くらいの報酬からどうぞ。</div>`;
          return;
        }

        els.rewardList.innerHTML = state.rewards.map(reward => `
          <article class="reward-card">
            <button class="delete-btn" data-action="delete-reward" data-id="${escapeHtml(reward.id)}" type="button" aria-label="ご褒美を削除">×</button>
            <div>
              <p class="reward-title">${escapeHtml(reward.title)}</p>
              <p class="reward-cost">🪙 ${escapeHtml(reward.cost)}G</p>
            </div>
            <button class="buy-btn" data-action="buy-reward" data-id="${escapeHtml(reward.id)}" type="button">購入</button>
          </article>
        `).join("");
      }

      function habitFormHtml() {
        if (!addOpen.habits) return "";
        return `
          <form class="form-box" id="habitForm">
            <div class="form-grid">
              <div class="field"><label for="plusText">プラス行動</label><input id="plusText" name="plusText" required maxlength="40" placeholder="例：水を一杯飲んだ"></div>
              <div class="field"><label for="minusText">マイナス行動</label><input id="minusText" name="minusText" required maxlength="40" placeholder="例：現実逃避で2時間溶けた"></div>
              <div class="field"><label for="habitExp">EXP</label><input id="habitExp" name="exp" type="number" min="1" max="100" value="5"></div>
              <div class="field"><label for="habitGold">ゴールド</label><input id="habitGold" name="gold" type="number" min="0" max="999" value="5"></div>
              <div class="field"><label for="habitDamage">マイナス時ダメージ</label><input id="habitDamage" name="damage" type="number" min="1" max="100" value="10"></div>
            </div>
            <div class="form-actions"><button class="submit-btn" type="submit">保存</button><button class="ghost-btn" data-action="close-form" data-form="habits" type="button">閉じる</button></div>
          </form>`;
      }

      function dailyFormHtml() {
        if (!addOpen.dailies) return "";
        return `
          <form class="form-box" id="dailyForm">
            <div class="form-grid">
              <div class="field"><label for="dailyTitle">日課名</label><input id="dailyTitle" name="title" required maxlength="48" placeholder="例：玄関まで行った"></div>
              <div class="field"><label for="difficulty">難易度</label><select id="difficulty" name="difficulty"><option value="低">低</option><option value="中">中</option><option value="高">高</option></select></div>
              <div class="field"><label for="dailyExp">EXP</label><input id="dailyExp" name="exp" type="number" min="1" max="100" value="10"></div>
              <div class="field"><label for="dailyGold">ゴールド</label><input id="dailyGold" name="gold" type="number" min="0" max="999" value="10"></div>
              <div class="field"><label for="dailyDamage">サボりダメージ</label><input id="dailyDamage" name="damage" type="number" min="1" max="100" value="15"></div>
            </div>
            <div class="form-actions"><button class="submit-btn" type="submit">保存</button><button class="ghost-btn" data-action="close-form" data-form="dailies" type="button">閉じる</button></div>
          </form>`;
      }

      function todoFormHtml() {
        if (!addOpen.todos) return "";
        return `
          <form class="form-box" id="todoForm">
            <div class="form-grid">
              <div class="field"><label for="todoTitle">ToDo名</label><input id="todoTitle" name="title" required maxlength="60" placeholder="例：求人を1件だけ見る"></div>
              <div class="field"><label for="dueDate">期限</label><input id="dueDate" name="dueDate" type="date"></div>
              <div class="field"><label for="todoExp">EXP</label><input id="todoExp" name="exp" type="number" min="1" max="100" value="15"></div>
              <div class="field"><label for="todoGold">ゴールド</label><input id="todoGold" name="gold" type="number" min="0" max="999" value="15"></div>
            </div>
            <div class="form-actions"><button class="submit-btn" type="submit">保存</button><button class="ghost-btn" data-action="close-form" data-form="todos" type="button">閉じる</button></div>
          </form>`;
      }

      function rewardFormHtml() {
        if (!addOpen.rewards) return "";
        return `
          <form class="form-box" id="rewardForm">
            <div class="form-grid">
              <div class="field"><label for="rewardTitle">ご褒美名</label><input id="rewardTitle" name="title" required maxlength="60" placeholder="例：ポテチを食べる"></div>
              <div class="field"><label for="rewardCost">必要ゴールド</label><input id="rewardCost" name="cost" type="number" min="1" max="9999" value="30"></div>
            </div>
            <div class="form-actions"><button class="submit-btn" type="submit">保存</button><button class="ghost-btn" data-action="close-form" data-form="rewards" type="button">閉じる</button></div>
          </form>`;
      }

      function renderForms() {
        els.addHabitArea.innerHTML = habitFormHtml();
        els.addDailyArea.innerHTML = dailyFormHtml();
        els.addTodoArea.innerHTML = todoFormHtml();
        els.addRewardArea.innerHTML = rewardFormHtml();
        els.toggleHabitForm.textContent = addOpen.habits ? "入力欄を閉じる" : "＋ 習慣を追加";
        els.toggleDailyForm.textContent = addOpen.dailies ? "入力欄を閉じる" : "＋ 日課を追加";
        els.toggleTodoForm.textContent = addOpen.todos ? "入力欄を閉じる" : "＋ ToDoを追加";
        els.toggleRewardForm.textContent = addOpen.rewards ? "入力欄を閉じる" : "＋ ご褒美を追加";
      }

      function renderLog() {
        if (!state.log.length) {
          els.logBox.innerHTML = `<p class="log-line">まだ何も起きていません。</p>`;
          return;
        }
        els.logBox.innerHTML = state.log.slice(0, 16).map(item => {
          const time = new Date(item.at).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
          return `<p class="log-line">[${time}] ${escapeHtml(item.text)}</p>`;
        }).join("");
      }

      function render() {
        renderStatus();
        renderCounts();
        renderForms();
        renderHabits();
        renderDailies();
        renderTodos();
        renderRewards();
        renderLog();
      }

      function findById(list, id) {
        return list.find(item => item.id === id);
      }

      function deleteTask(type, id) {
        state.tasks[type] = state.tasks[type].filter(task => task.id !== id);
        addLog("クエストを削除した。なかったことにする勇気。正直大事。");
        saveState();
        render();
      }

      function deleteReward(id) {
        state.rewards = state.rewards.filter(reward => reward.id !== id);
        addLog("ご褒美を削除した。誘惑との距離感を調整。");
        saveState();
        render();
      }

      function closeAllFormsExcept(key) {
        Object.keys(addOpen).forEach(name => {
          if (name !== key) addOpen[name] = false;
        });
      }

      function handleHabitSubmit(event) {
        event.preventDefault();
        const fd = new FormData(event.currentTarget);
        state.tasks.habits.push({
          id: uid("habit"),
          plusText: String(fd.get("plusText") || "").trim(),
          minusText: String(fd.get("minusText") || "").trim(),
          exp: clampNumber(fd.get("exp"), 1, 100, 5),
          gold: clampNumber(fd.get("gold"), 0, 999, 5),
          damage: clampNumber(fd.get("damage"), 1, 100, 10),
          createdAt: Date.now()
        });
        addOpen.habits = false;
        addLog("習慣クエストを追加した。自分を褒める口実が増えた。");
        saveState();
        render();
      }

      function handleDailySubmit(event) {
        event.preventDefault();
        const fd = new FormData(event.currentTarget);
        state.tasks.dailies.push({
          id: uid("daily"),
          title: String(fd.get("title") || "").trim(),
          difficulty: String(fd.get("difficulty") || "低"),
          exp: clampNumber(fd.get("exp"), 1, 100, 10),
          gold: clampNumber(fd.get("gold"), 0, 999, 10),
          damage: clampNumber(fd.get("damage"), 1, 100, 15),
          completedDate: null,
          createdAt: Date.now()
        });
        addOpen.dailies = false;
        addLog("日課クエストを追加した。明日の自分に軽く圧をかけた。");
        saveState();
        render();
      }

      function handleTodoSubmit(event) {
        event.preventDefault();
        const fd = new FormData(event.currentTarget);
        state.tasks.todos.push({
          id: uid("todo"),
          title: String(fd.get("title") || "").trim(),
          dueDate: String(fd.get("dueDate") || ""),
          exp: clampNumber(fd.get("exp"), 1, 100, 15),
          gold: clampNumber(fd.get("gold"), 0, 999, 15),
          completed: false,
          createdAt: Date.now()
        });
        addOpen.todos = false;
        addLog("ToDoクエストを追加した。未来の自分に丸投げ。 ");
        saveState();
        render();
      }

      function handleRewardSubmit(event) {
        event.preventDefault();
        const fd = new FormData(event.currentTarget);
        state.rewards.push({
          id: uid("reward"),
          title: String(fd.get("title") || "").trim(),
          cost: clampNumber(fd.get("cost"), 1, 9999, 30),
          createdAt: Date.now()
        });
        addOpen.rewards = false;
        addLog("ご褒美を追加した。ご自愛の在庫が増えた。優勝。 ");
        saveState();
        render();
      }

      document.addEventListener("click", (event) => {
        const target = event.target.closest("button");
        if (!target) return;

        const action = target.dataset.action;
        const id = target.dataset.id;
        const type = target.dataset.type;
        const formKey = target.dataset.form;

        if (target.id === "toggleHabitForm") {
          addOpen.habits = !addOpen.habits;
          closeAllFormsExcept("habits");
          renderForms();
          return;
        }

        if (target.id === "toggleDailyForm") {
          addOpen.dailies = !addOpen.dailies;
          closeAllFormsExcept("dailies");
          renderForms();
          return;
        }

        if (target.id === "toggleTodoForm") {
          addOpen.todos = !addOpen.todos;
          closeAllFormsExcept("todos");
          renderForms();
          return;
        }

        if (target.id === "toggleRewardForm") {
          addOpen.rewards = !addOpen.rewards;
          closeAllFormsExcept("rewards");
          renderForms();
          return;
        }

        if (action === "close-form" && formKey) {
          addOpen[formKey] = false;
          renderForms();
          return;
        }

        if (action === "habit-plus") {
          const habit = findById(state.tasks.habits, id);
          if (habit) gain(Number(habit.exp), Number(habit.gold), habit.plusText);
          return;
        }

        if (action === "habit-minus") {
          const habit = findById(state.tasks.habits, id);
          if (habit) takeDamage(Number(habit.damage), habit.minusText);
          return;
        }

        if (action === "delete-task") {
          deleteTask(type, id);
          return;
        }

        if (action === "delete-reward") {
          deleteReward(id);
          return;
        }

        if (action === "buy-reward") {
          const reward = findById(state.rewards, id);
          if (!reward) return;
          if (state.player.gold < Number(reward.cost)) {
            showToast(`ゴールド不足。あと ${Number(reward.cost) - state.player.gold}G 必要です。`);
            addLog(`ご褒美「${reward.title}」に手を伸ばしたが、財布が虚無だった。`);
            saveState();
            renderLog();
            return;
          }
          state.player.gold -= Number(reward.cost);
          addLog(`ご褒美アンロック：「${reward.title}」に ${reward.cost}G 使った。堂々と楽しめ。`);
          showToast(`ご褒美アンロック：${reward.title}`);
          saveState();
          render();
        }
      });

      document.addEventListener("change", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) return;
        const action = target.dataset.action;
        const id = target.dataset.id;

        if (action === "daily-complete") {
          const daily = findById(state.tasks.dailies, id);
          const today = todayKey();
          if (!daily) return;
          if (daily.completedDate === today) {
            showToast("この日課は今日もうクリア済みです。");
            target.checked = true;
            return;
          }
          daily.completedDate = today;
          gain(Number(daily.exp), Number(daily.gold), daily.title);
          return;
        }

        if (action === "todo-complete") {
          const todo = findById(state.tasks.todos, id);
          if (!todo) return;
          if (todo.completed) {
            showToast("このToDoはもうクリア済みです。");
            target.checked = true;
            return;
          }
          todo.completed = true;
          todo.completedAt = Date.now();
          gain(Number(todo.exp), Number(todo.gold), todo.title);
        }
      });

      document.addEventListener("submit", (event) => {
        if (event.target.id === "habitForm") handleHabitSubmit(event);
        if (event.target.id === "dailyForm") handleDailySubmit(event);
        if (event.target.id === "todoForm") handleTodoSubmit(event);
        if (event.target.id === "rewardForm") handleRewardSubmit(event);
      });

      window.addEventListener("storage", (event) => {
        if (event.key !== STORAGE_KEY) return;
        state = loadState();
        checkDailyPenalty();
        render();
      });

      state = loadState();
      checkDailyPenalty();
      saveState();
      render();
    })();
