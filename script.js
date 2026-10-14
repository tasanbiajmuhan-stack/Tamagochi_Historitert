const STORAGE_KEY = 'historical_tamagotchi_save_v2';
const SPEEDS = { pause: 0, normal: 1, fast: 2 };

function getSaveKeyForCharacter(characterId = state.selectedCharacter) {
  return `${STORAGE_KEY}_${characterId || 'default'}`;
}

const PROFILES = {
  stalin: {
    id: 'stalin',
    name: 'Иосиф Сталин',
    era: 'Кремлёвский кабинет',
    location: 'Кремлёвский кабинет',
    subtitle: 'Подозрительный бюрократ и знаток отчётности',
    intro: 'Товарищ разработчик, сегодня мы не празднуем свободу — мы обеспечиваем порядок. Ваши отчёты будут проверены, а хаос — расстрелян шуткой.',
    consoleTitle: 'Архивные отчёты',
    startSupplies: 62,
    resources: { food: 55, gold: 40, steel: 32 },
    baseStats: { hunger: 76, energy: 68, mood: 70, patience: 74, order: 80, trust: 60, plans: 70, bureaucracy: 52 },
    specialStats: [
      { key: 'order', label: 'Порядок' },
      { key: 'trust', label: 'Доверие' },
      { key: 'plans', label: 'Планы' },
      { key: 'bureaucracy', label: 'Бюрократия' }
    ],
    actions: {
      feed: 'Потребовать отчёт',
      rest: 'Устроить перерыв',
      strategy: 'Провести совещание',
      conquest: 'Исправить план',
      map: 'Проверить карту',
      praise: 'Подтвердить порядок',
      code: 'Проверить журнал ошибок',
      complaint: 'Выслушать ропот',
      decree: 'Подписать приказ',
      leave: 'Проверить аппаратуру'
    },
    scrollPool: [
      { category: 'жалобы', text: 'Товарищ разработчик, почему отчёт пустой? Вы собираетесь отчитаться перед компьютером?' },
      { category: 'критика', text: 'План выполнен на 40 процентов. Зато кнопка сохранения выглядит уверенно.' },
      { category: 'история', text: 'У вас бумажная волокита работает быстрее, чем ваш сервер, и это уже слишком много для одной страны.' },
      { category: 'код', text: 'Ваш код не пройдёт проверку. Даже архивный документ выглядит более управляемым.' },
      { category: 'гордость', text: 'Мы не делаем революцию в каждый коммит. Мы делаем порядок.' },
      { category: 'претензии', text: 'Если вы снова забыли сохранить результат, я сам уйду на бумагу.' },
      { category: 'шутка', text: 'План есть, но одно из его условий — ваш JavaScript следует переписать, как будто это смертельно важно.' },
      { category: 'события', text: 'Без чёткого распоряжения даже печатная машинка начинает управлять нами.' }
    ],
    taskPool: [
      { title: 'Разобрать накопившиеся отчёты', description: 'Нужно сократить бюрократическую задержку и найти, где потерялись документы.', difficulty: 2, reward: 18, effect: { order: 12, trust: 8, bureaucracy: -10 }, dueIn: 5 },
      { title: 'Проверить план выполнения', description: 'Уточнить, что реально сделано, а что лишь обещано на бумаге.', difficulty: 3, reward: 22, effect: { plans: 16, trust: 7, bureaucracy: -12 }, dueIn: 5 },
      { title: 'Собрать совещание о дисциплине', description: 'Объяснить подчинённым, что хаос и свобода — разные вещи.', difficulty: 2, reward: 14, effect: { mood: 10, order: 10, patience: 4 }, dueIn: 4 },
      { title: 'Проверить очереди на снабжение', description: 'Убрать лишние задержки и сократить электронную волокиту.', difficulty: 2, reward: 16, effect: { trust: 8, plans: 10, bureaucracy: -9 }, dueIn: 5 },
      { title: 'Усилить контроль за лагерем', description: 'Установить ясный порядок в разрастающемся штабе.', difficulty: 3, reward: 20, effect: { order: 16, patience: 8 }, dueIn: 6 },
      { title: 'Отредактировать резолюцию', description: 'Исправить неточности и убедиться, что документ звучит строго.', difficulty: 2, reward: 15, effect: { plans: 12, mood: 6 }, dueIn: 4 }
    ],
    eventPool: [
      {
        title: 'Набежавший хаос в канцелярии',
        description: 'Куда-то исчезли три рапорта и один важный приказ. Вокруг лайкают занятые чиновники.',
        choices: [
          { label: 'Объявить строгую проверку', effect: { order: 14, trust: -4, bureaucracy: 8 } },
          { label: 'Назначить ревизию', effect: { trust: 10, plans: 8, bureaucracy: -8 } },
          { label: 'Скрыть инцидент до времени', effect: { mood: -10, patience: -8, plans: -5 } }
        ]
      },
      {
        title: 'Документы уехали в другой отдел',
        description: 'Весь кабинет в панике из-за перепутанных папок и придуманных сроков.',
        choices: [
          { label: 'Провести разборку', effect: { order: 12, patience: -6, trust: 3 } },
          { label: 'Перекинуть ответственность дальше', effect: { trust: -10, bureaucracy: 6, plans: -6 } },
          { label: 'Собрать мини-переговоры', effect: { mood: 8, plans: 10, trust: 6 } }
        ]
      },
      {
        title: 'Ревизор в штабе',
        description: 'Пришёл строгий проверяющий с видом человека, который видит все ошибки в системе.',
        choices: [
          { label: 'Показать порядок', effect: { order: 15, trust: 10, mood: 5 } },
          { label: 'Признать недостатки', effect: { trust: 7, mood: -5, bureaucracy: -8 } },
          { label: 'Списать на обстоятельства', effect: { patience: -10, plans: -8 } }
        ]
      }
    ],
    endings: [
      { title: 'Порядок навсегда', requirement: (s) => s.stats.order >= 85 && s.stats.plans >= 75, summary: 'Кабинет выжил, бумажная волокита стала инструментом, а хаос исчез.' },
      { title: 'Бюрократическая революция', requirement: (s) => s.stats.bureaucracy >= 80 && s.stats.trust <= 30, summary: 'Порядок стал всеобъемлющим, но даже канцелярия устала от него.' },
      { title: 'Маленькая победа над хаосом', requirement: (s) => s.stats.order >= 65 && s.stats.mood >= 55, summary: 'Проверки прекратились, и кабинет наконец начал работать без ссор.' }
    ],
    achievements: [
      { id: 'paperwork', title: 'Папка закрыта', description: 'Успешно разобрали документы.' },
      { id: 'discipline', title: 'Дисциплина достигнута', description: 'Контроль стал нормой.' },
      { id: 'order', title: 'Нормальный порядок', description: 'Хаос ушёл в архив.' }
    ],
    moodTexts: ['Сдержанный', 'Пролистывает архив', 'Бюрократия в порядке', 'Подтверждённый', 'Точно по форме']
  },

  alexander: {
    id: 'alexander',
    name: 'Александр III Великий',
    era: 'Степи саков',
    location: 'Степи саков',
    subtitle: 'Амбициозный захватчик и главный спорный руководитель',
    intro: 'Я не задержался в степях для отдыха. Я задержался здесь, чтобы доказать, что даже ветер должен помнить моё имя.',
    consoleTitle: 'Царские свитки',
    startSupplies: 64,
    resources: { food: 58, gold: 38, horses: 24 },
    baseStats: { hunger: 73, energy: 70, mood: 72, patience: 68, ambition: 78, glory: 66, morale: 68, diplomacy: 58 },
    specialStats: [
      { key: 'ambition', label: 'Амбиции' },
      { key: 'glory', label: 'Слава' },
      { key: 'morale', label: 'Воинский дух' },
      { key: 'diplomacy', label: 'Дипломатия' }
    ],
    actions: {
      feed: 'Накормить полководца',
      rest: 'Приказать отдохнуть',
      strategy: 'Обсудить стратегию',
      conquest: 'Предложить завоевание',
      map: 'Показать карту похода',
      praise: 'Похвалить Александра',
      code: 'Проверить код',
      complaint: 'Выслушать жалобы',
      decree: 'Отправить царский указ',
      leave: 'Уйти по делам'
    },
    scrollPool: [
      { category: 'голод', text: 'О, великий разработчик, ты снова оставил своего царя без ужина! Даже персы обращались со мной лучше!' },
      { category: 'погода', text: 'Здесь холоднее, чем в твоём CSS без адаптивной вёрстки!' },
      { category: 'завоевания', text: 'Где новые земли? Где армия? Где нормальная документация?!' },
      { category: 'философия', text: 'Аристотель учил меня философии, а тебя кто-нибудь учил закрывать фигурные скобки?' },
      { category: 'код', text: 'Я покорил державу Ахеменидов, а ты не способен исправить одну ошибку в JavaScript?' },
      { category: 'хвастовство', text: 'Я не просто великий — я единственный, кто знает, как делать великие дела даже в сырой степи.' },
      { category: 'жалобы', text: 'Мне обещали край света, а привели в степь. Надеюсь, хотя бы твой код имеет конец.' },
      { category: 'история', text: 'Кто ещё мог бы сказать: я иду к цели, даже если мой лагерь похож на болото из обещаний?' }
    ],
    taskPool: [
      { title: 'Найти безопасный маршрут через степь', description: 'Выбрать путь так, чтобы лагерь не остался в песках навсегда.', difficulty: 2, reward: 18, effect: { diplomacy: 10, glory: 8, mood: 6 }, dueIn: 5 },
      { title: 'Организовать снабжение лагеря', description: 'Найти продовольствие и уменьшить гнев армии.', difficulty: 2, reward: 16, effect: { hunger: 14, morale: 8 }, dueIn: 4 },
      { title: 'Поднять боевой дух воинов', description: 'Поговорить с воинами, чтобы они перестали спорить с ветром.', difficulty: 2, reward: 17, effect: { morale: 16, mood: 10 }, dueIn: 5 },
      { title: 'Устроить стратегический совет', description: 'Собрать мнения, не дав им превратиться в драку за трон.', difficulty: 3, reward: 20, effect: { diplomacy: 12, ambition: 10 }, dueIn: 6 },
      { title: 'Подготовить обоз к переходу', description: 'Проверить, всё ли упряжки и припасы готовы к дальнейшему пути.', difficulty: 2, reward: 15, effect: { glory: 10, patience: 6 }, dueIn: 5 },
      { title: 'Договориться с местными соплеменниками', description: 'Найти союзников и не дать всему походу превратиться в спор о власти.', difficulty: 3, reward: 22, effect: { diplomacy: 14, ambition: 8, mood: 8 }, dueIn: 6 }
    ],
    eventPool: [
      {
        title: 'Песчаная буря уходит на запад',
        description: 'Мимо лагеря проносится песчаная буря, и даже телеги дрожат от её грома.',
        choices: [
          { label: 'Найти укрытие и не спорить', effect: { patience: 8, mood: 5, energy: -6 } },
          { label: 'Дожидаться бури в пути', effect: { morale: 10, patience: -8, hunger: -6 } },
          { label: 'Укрепить лагерь и дать приказ', effect: { ambition: 8, glory: 10, mood: -4 } }
        ]
      },
      {
        title: 'Посланник принёс странное письмо',
        description: 'Древняя грамота обещает земли, покорность и поддержку соседей.',
        choices: [
          { label: 'Принять предложение', effect: { diplomacy: 16, mood: 7, ambition: 6 } },
          { label: 'Отложить и чеканить свитки', effect: { glory: 8, patience: -6, mood: 3 } },
          { label: 'Игнорировать и идти дальше', effect: { ambition: 12, mood: -6, patience: -5 } }
        ]
      },
      {
        title: 'Артефакт в степи',
        description: 'Виднеется древний клад и таинственный древний щит, будто оставленный небом.',
        choices: [
          { label: 'Возить артефакт в лагерь', effect: { glory: 14, mood: 8, morale: 10 } },
          { label: 'Оставить, чтобы он не мешал', effect: { diplomacy: 10, patience: 6 } },
          { label: 'Публично объявить себя владельцем всех древностей', effect: { ambition: 16, mood: 5, patience: -7 } }
        ]
      }
    ],
    endings: [
      { title: 'Великий поход', requirement: (s) => s.stats.ambition >= 80 && s.stats.glory >= 70 && s.stats.morale >= 72, summary: 'Вы провели Александра через испытания и наполнили степь его славой.' },
      { title: 'Царь степных холмов', requirement: (s) => s.stats.ambition >= 85 && s.stats.diplomacy <= 30, summary: 'Александр решил, что холмы и степи достойны новых владений, и обнародовал титул.' },
      { title: 'Философский поворот', requirement: (s) => s.stats.diplomacy >= 80 && s.stats.ambition <= 40, summary: 'Мир перестал быть войной, и Александр на время отказался от завоеваний ради смысла.' }
    ],
    achievements: [
      { id: 'march', title: 'Путь открыт', description: 'Сделали первый шаг в степь.' },
      { id: 'glory', title: 'Слава слышна', description: 'Заметно растут амбиции и репутация.' },
      { id: 'policy', title: 'Переход к дипломатии', description: 'Найдены союзники и тёплые слова.' }
    ],
    moodTexts: ['Упорный', 'Уверенный', 'Гордый', 'Пламенный', 'Императорский']
  },

  napoleon: {
    id: 'napoleon',
    name: 'Наполеон Бонапарт',
    era: 'Остров Святой Елены',
    location: 'Остров Святой Елены',
    subtitle: 'Организатор, самоуверенный стратег и автор мемуаров',
    intro: 'Даже здесь я могу организовать порядок. Если у меня нет империи, то хотя бы будет дисциплина — и она будет лучшей в мире.',
    consoleTitle: 'Военный журнал',
    startSupplies: 60,
    resources: { food: 46, gold: 35, paper: 58 },
    baseStats: { hunger: 72, energy: 74, mood: 68, patience: 64, authority: 80, discipline: 76, reputation: 70, boredom: 46 },
    specialStats: [
      { key: 'authority', label: 'Авторитет' },
      { key: 'discipline', label: 'Дисциплина' },
      { key: 'reputation', label: 'Репутация' },
      { key: 'boredom', label: 'Скука' }
    ],
    actions: {
      feed: 'Составить рацион',
      rest: 'Организовать распорядок',
      strategy: 'Составить план',
      conquest: 'Провести военную игру',
      map: 'Проверить карту',
      praise: 'Подтвердить гений',
      code: 'Реформировать интерфейс',
      complaint: 'Спорить с историком',
      decree: 'Написать приказ',
      leave: 'Писать мемуары'
    },
    scrollPool: [
      { category: 'жалобы', text: 'Я управлял империей, а теперь не могу добиться от тебя работающей кнопки.' },
      { category: 'организация', text: 'Этот интерфейс требует реорганизации. Начнём с твоего JavaScript.' },
      { category: 'история', text: 'Моя империя была больше этого острова. Хотя твой список ошибок ещё длиннее.' },
      { category: 'подъем', text: 'Скука — враг величия. Сделай хоть что-то, чтобы не превратить день в историю без побед.' },
      { category: 'код', text: 'Код напоминает мне армию — слишком много форм, и всё это не умеет держать строй.' },
      { category: 'хвастовство', text: 'Я даже в ссылке сохраняю ясность мысли и превосходство над скукой.' },
      { category: 'реакция', text: 'Недавно я разработал план, а ты всё ещё хочешь обслуживать чёрный ящик.' },
      { category: 'историческая', text: 'Даже мой тюремный остров выглядит лучше, чем этот набор случайных действий.' }
    ],
    taskPool: [
      { title: 'Построить распорядок дня', description: 'Воскресить смысл в скучном дне и дать каждой минуте роль.', difficulty: 2, reward: 18, effect: { discipline: 12, authority: 8 }, dueIn: 4 },
      { title: 'Написать мемуарную главу', description: 'Выбрать между искренней критикой и достойным оправданием.', difficulty: 3, reward: 20, effect: { reputation: 14, mood: 8 }, dueIn: 6 },
      { title: 'Провести военную игру на острове', description: 'Даже в ссылке можно вести победоносную кампанию на бумаге.', difficulty: 3, reward: 22, effect: { authority: 14, discipline: 8 }, dueIn: 6 },
      { title: 'Организовать снабжение острова', description: 'Обеспечить порядок и смысл в работе вокруг рощи и дома.', difficulty: 2, reward: 16, effect: { mood: 8, authority: 8 }, dueIn: 5 },
      { title: 'Объявить новый план управления', description: 'Небольшой, но эффектный документ о том, как держать всё под контролем.', difficulty: 2, reward: 17, effect: { plans: 10, reputation: 9 }, dueIn: 5 },
      { title: 'Поспорить с историком', description: 'Доказать, что великая политика требует больше убеждения, чем скучных фактов.', difficulty: 3, reward: 19, effect: { reputation: 12, mood: 10 }, dueIn: 5 }
    ],
    eventPool: [
      {
        title: 'Дни тянутся как бесконечный приказ',
        description: 'На острове не хватает события — всё слишком спокойно, и это ужасно раздражает.',
        choices: [
          { label: 'Преобразовать рутину', effect: { discipline: 12, boredom: -12, mood: 6 } },
          { label: 'Возобновить парад', effect: { authority: 10, mood: 8, reputation: 6 } },
          { label: 'Поругать всех и писать мемуары', effect: { reputation: 8, mood: -8, patience: -6 } }
        ]
      },
      {
        title: 'Посетитель из исторической школы',
        description: 'Историк утверждает, что он знает, что было с императорами лучше, чем сами императоры.',
        choices: [
          { label: 'Поспорить с ним', effect: { reputation: 12, mood: 10, authority: 8 } },
          { label: 'Признать победу историка', effect: { mood: -8, discipline: -6, authority: -5 } },
          { label: 'Пустить его к мемуарам', effect: { mood: 5, reputation: 8, patience: 5 } }
        ]
      },
      {
        title: 'Письмо из далёкого мира',
        description: 'Пришло послание с громким обещанием вернуть славу и внимание к императору.',
        choices: [
          { label: 'Подписать ответ с достоинством', effect: { reputation: 14, mood: 8, authority: 8 } },
          { label: 'Негативно отозваться о письме', effect: { mood: -4, patience: -6, authority: 5 } },
          { label: 'Использовать письмо в мемуарах', effect: { reputation: 10, discipline: 8, boredom: -8 } }
        ]
      }
    ],
    endings: [
      { title: 'Империя на бумаге', requirement: (s) => s.stats.authority >= 85 && s.stats.reputation >= 75, summary: 'Наполеон создал идеальную систему управления и оставил славу в тексте.' },
      { title: 'Великий мемуарист', requirement: (s) => s.stats.reputation >= 80 && s.stats.boredom <= 35, summary: 'Скука была побеждена, а память о завоеваниях стала легендой.' },
      { title: 'Островная реформа', requirement: (s) => s.stats.discipline >= 85 && s.stats.mood >= 60, summary: 'Под влиянием дисциплины и спокойствия даже ссылка стала лёгкой задачей.' }
    ],
    achievements: [
      { id: 'memoirs', title: 'Глава написана', description: 'Мемуары уже звучат величественно.' },
      { id: 'law', title: 'Порядок в резиденции', description: 'Каждую минуту назначили место.' },
      { id: 'legend', title: 'Легенда живёт', description: 'Имя уже слишком громкое, чтобы молчать.' }
    ],
    moodTexts: ['Подвитый', 'Собранный', 'Дисциплинированный', 'Победный', 'Императорский']
  },

  peter: {
    id: 'peter',
    name: 'Пётр I',
    era: 'Мастерская реформатора',
    location: 'Мастерская реформатора',
    subtitle: 'Практичный реформатор и любитель кораблей',
    intro: 'Не спорьте со мной о словах. Где корабль, где проект, где результат? Только практика способна сделать историю.',
    consoleTitle: 'Записи мастерской',
    startSupplies: 58,
    resources: { food: 50, gold: 62, timber: 42 },
    baseStats: { hunger: 74, energy: 78, mood: 71, patience: 63, progress: 76, craft: 70, treasury: 58, satisfaction: 62 },
    specialStats: [
      { key: 'progress', label: 'Прогресс реформ' },
      { key: 'craft', label: 'Мастерство' },
      { key: 'treasury', label: 'Казна' },
      { key: 'satisfaction', label: 'Удовлетворённость' }
    ],
    actions: {
      feed: 'Построить рацион',
      rest: 'Проверить мастерскую',
      strategy: 'Провести реформу',
      conquest: 'Построить модель корабля',
      map: 'Проверить чертёж',
      praise: 'Подтвердить прогресс',
      code: 'Исправить механизм',
      complaint: 'Проверить казну',
      decree: 'Отправить приказ',
      leave: 'Отправить помощника учиться'
    },
    scrollPool: [
      { category: 'реформа', text: 'Меньше разговоров! Покажи результат. Где мой корабль?' },
      { category: 'технологии', text: 'Новая технология — хорошо. Но кто-нибудь проверял, работает ли она?' },
      { category: 'казна', text: 'Опять расходы превышают бюджет. Даже твой CSS требует слишком много ресурсов.' },
      { category: 'процесс', text: 'Мастерская должна работать, а не сыпать красивыми обещаниями.' },
      { category: 'критика', text: 'Пока вы мечтали, я уже начал строить инструмент, а вы до сих пор спорите о теории.' },
      { category: 'история', text: 'Судно надо строить, а не обсуждать его идеальное расположение на берегу.' },
      { category: 'дарование', text: 'Небольшой проект — это уже победа, если он отчётливо работает.' },
      { category: 'шутка', text: 'Ваша легенда о том, что всё «надо сделать красиво» — это слишком много красивой гнили.' }
    ],
    taskPool: [
      { title: 'Построить модель корабля', description: 'Сделать прототип и проверить, выдержит ли он движение вперед.', difficulty: 2, reward: 18, effect: { craft: 14, progress: 10 }, dueIn: 5 },
      { title: 'Распределить бюджет реформ', description: 'Потратить средства так, чтобы работа не становилась хаосом.', difficulty: 3, reward: 22, effect: { treasury: 12, progress: 10 }, dueIn: 6 },
      { title: 'Организовать мастерскую', description: 'Сделать пространство полезным, а не декоративным.', difficulty: 2, reward: 16, effect: { craft: 11, satisfaction: 8 }, dueIn: 5 },
      { title: 'Проверить финансовый отчёт', description: 'Выяснить, не развелось ли лишних расходов.', difficulty: 2, reward: 15, effect: { treasury: 10, mood: 8 }, dueIn: 4 },
      { title: 'Провести реформу обучения', description: 'Обучить подмастерьев быстрее, чем он сам осваивал ремёсла.', difficulty: 3, reward: 20, effect: { progress: 12, craft: 10 }, dueIn: 6 },
      { title: 'Обновить чертёж механизма', description: 'Исправить слабые точки и сделать инструмент полезнее.', difficulty: 2, reward: 17, effect: { craft: 12, satisfaction: 7 }, dueIn: 5 }
    ],
    eventPool: [
      {
        title: 'Корабль на берегу не уходит',
        description: 'Модель корабля требует правок, а рабочие спорят, кто вообще построит всё вовремя.',
        choices: [
          { label: 'Сразу исправить конструкцию', effect: { craft: 14, progress: 10, mood: 6 } },
          { label: 'Проверить бюджет и потратить меньше', effect: { treasury: 12, satisfaction: -6, mood: 3 } },
          { label: 'Мобилизовать всех на учёбу', effect: { progress: 10, craft: 10, patience: -4 } }
        ]
      },
      {
        title: 'Строители требуют новых материалов',
        description: 'Нехватка дерева и металла ставит под удар всю мастерскую.',
        choices: [
          { label: 'Найти материалы из запасов', effect: { treasury: -8, progress: 12, satisfaction: 8 } },
          { label: 'Ужесточить план закупок', effect: { treasury: 8, craft: 8, mood: -5 } },
          { label: 'Немного уменьшить темпы', effect: { patience: 10, mood: 7, progress: -6 } }
        ]
      },
      {
        title: 'Помощник предлагает смелую идею',
        description: 'Помощник хочет ввести новый метод, и он заходит слишком далеко.',
        choices: [
          { label: 'Испытать идею на практике', effect: { craft: 12, progress: 10, satisfaction: 8 } },
          { label: 'Оставить в черновиках', effect: { patience: 10, craft: -4, mood: 6 } },
          { label: 'Объявить эксперимент реформой', effect: { progress: 15, treasury: -10, mood: -6 } }
        ]
      }
    ],
    endings: [
      { title: 'Модернизация завершена', requirement: (s) => s.stats.progress >= 84 && s.stats.craft >= 78, summary: 'Мастерская преобразилась, а новое ремесло уже работает на благо державы.' },
      { title: 'Флот и реформы', requirement: (s) => s.stats.craft >= 86 && s.stats.treasury >= 70, summary: 'Реформы дали результат, и корабли начали приносить славу и пользу.' },
      { title: 'Трудолюбивый конец', requirement: (s) => s.stats.satisfaction >= 80 && s.stats.mood >= 60, summary: 'Пётр I убедился, что не всегда стоит делать всё быстро — иногда надо делать это хорошо.' }
    ],
    achievements: [
      { id: 'ship', title: 'Первый корабль', description: 'Модель корабля готова к испытаниям.' },
      { id: 'shop', title: 'Мастерская работает', description: 'Ремёсла перестали быть хаосом.' },
      { id: 'reform', title: 'Реформа сделана', description: 'Действие заменило слова.' }
    ],
    moodTexts: ['Практичный', 'Решительный', 'Новый двор', 'Победный', 'Реформатор']
  },

  caesar: {
    id: 'caesar',
    name: 'Гай Юлий Цезарь',
    era: 'Сенатские интриги',
    location: 'Римский форум',
    subtitle: 'Харизматичный политик и мастер речи',
    intro: 'Республика ждёт решения, а вы всё ещё выбираете курс и цвет кнопки. Время — это политика, а политика — это власть.',
    consoleTitle: 'Сенатские протоколы',
    startSupplies: 56,
    resources: { food: 54, gold: 44, influence: 50 },
    baseStats: { hunger: 72, energy: 70, mood: 73, patience: 67, senate: 76, popularity: 72, influence: 68, tension: 54 },
    specialStats: [
      { key: 'senate', label: 'Поддержка сената' },
      { key: 'popularity', label: 'Популярность' },
      { key: 'influence', label: 'Влияние' },
      { key: 'tension', label: 'Политическое напряжение' }
    ],
    actions: {
      feed: 'Проверить продовольствие',
      rest: 'Устроить тайную паузу',
      strategy: 'Подготовить речь',
      conquest: 'Заключить соглашение',
      map: 'Изучить настроение сенаторов',
      praise: 'Наделить популярностью',
      code: 'Исправить политический текст',
      complaint: 'Разрядить конфликт',
      decree: 'Обратиться к гражданам',
      leave: 'Посетить форум'
    },
    scrollPool: [
      { category: 'сенат', text: 'Ты называешь это речью? Даже камни на форуме убедительнее.' },
      { category: 'политика', text: 'Сенат ждёт решения, а ты уже десять минут выбираешь цвет кнопки.' },
      { category: 'критика', text: 'Запомни: иногда правильно выбранное слово эффективнее длинного отчёта.' },
      { category: 'слово', text: 'Я говорил тебе: политика — это не шум, а правильная пауза в нужный момент.' },
      { category: 'шутка', text: 'Если вы снова заведёте спор вместо решения, сенат решит, что это не политика, а цирк.' },
      { category: 'популярность', text: 'Мой народ любит ясность и силу, а не длинные объяснения без результата.' },
      { category: 'история', text: 'Даже в Риме есть место для слова, если оно надоумило всех за столом.' },
      { category: 'гордость', text: 'Я не люблю хаос, но нашёл бы способ сделать его политически выгодным.' }
    ],
    taskPool: [
      { title: 'Выступить перед сенатом', description: 'Подготовить речь, которая способна решить спор и не вызвать хаос.', difficulty: 3, reward: 20, effect: { senate: 12, popularity: 8 }, dueIn: 5 },
      { title: 'Заключить соглашение', description: 'Найти компромисс, который не превращает форум в бойню.', difficulty: 2, reward: 16, effect: { influence: 12, mood: 8 }, dueIn: 4 },
      { title: 'Обратиться к гражданам', description: 'Договориться с народом так, чтобы победа выглядела естественно.', difficulty: 2, reward: 17, effect: { popularity: 12, influence: 10 }, dueIn: 5 },
      { title: 'Изучить настроения сенаторов', description: 'Понять, кто готов сотрудничать, а кто жаждет интриги.', difficulty: 2, reward: 15, effect: { senate: 10, tension: -8 }, dueIn: 4 },
      { title: 'Подготовить речь воям', description: 'Собрать слова, которые дадут эффект и не спровоцируют драку.', difficulty: 3, reward: 22, effect: { popularity: 14, mood: 8 }, dueIn: 6 },
      { title: 'Разрядить конфликт в столице', description: 'Найти умеренное решение, удерживая поддержку в обществе.', difficulty: 3, reward: 19, effect: { tension: -12, influence: 10 }, dueIn: 6 }
    ],
    eventPool: [
      {
        title: 'Мятеж на форуме',
        description: 'Кому-то в толпе хочется громкого решения, а кому-то — спокойного компромисса.',
        choices: [
          { label: 'Успокоить толпу речью', effect: { popularity: 12, mood: 8, tension: -8 } },
          { label: 'Подкупить лидеров мнений', effect: { influence: 12, senate: 8, tension: 4 } },
          { label: 'Сделать резкий приказ', effect: { senate: -8, tension: 10, mood: -8 } }
        ]
      },
      {
        title: 'Сенаторы спорят в зале',
        description: 'Небольшое разногласие быстро превращается в большую громкую драму.',
        choices: [
          { label: 'Подтвердить меры консенсуса', effect: { senate: 14, influence: 10 } },
          { label: 'Заставить себя слушать', effect: { mood: 8, patience: -6, tension: 6 } },
          { label: 'Пояснить в частной беседе', effect: { mood: 6, influence: 8, tension: -6 } }
        ]
      },
      {
        title: 'Письмо от союзника',
        description: 'Друзья предлагают прямую поддержку, но это может сильно изменить баланс сил.',
        choices: [
          { label: 'Принять поддержку', effect: { influence: 12, popularity: 8, senate: 6 } },
          { label: 'Сохранить нейтралитет', effect: { mood: 7, tension: -10, influence: 4 } },
          { label: 'Использовать поддержку для давления', effect: { influence: 14, tension: 12, mood: -6 } }
        ]
      }
    ],
    endings: [
      { title: 'Триумф в Риме', requirement: (s) => s.stats.popularity >= 84 && s.stats.influence >= 78, summary: 'Народ и сенат поддержали политику, а правящий язык стал мощнее оружия.' },
      { title: 'Компромисс над древностью', requirement: (s) => s.stats.senate >= 85 && s.stats.tension <= 35, summary: 'Сенат согласился, а республика пережила спор без катастрофы.' },
      { title: 'Речь, которая меняет эпоху', requirement: (s) => s.stats.popularity >= 80 && s.stats.mood >= 68, summary: 'Грамотное слово стало главным оружием, за которым шли люди.' }
    ],
    achievements: [
      { id: 'forum', title: 'Первое слово', description: 'Форум услышал первую речь.' },
      { id: 'consensus', title: 'Согласие', description: 'Политика наконец стала делом, а не шумом.' },
      { id: 'legacy', title: 'Легенда публичной речи', description: 'Общество запомнило слова.' }
    ],
    moodTexts: ['Харизматичный', 'Увлечённый', 'Убедительный', 'Гордый', 'Римлянин в фокусе']
  },

  diogen: {
    id: 'diogen',
    name: 'Диоген Синопский',
    era: 'Песчаный шатёр',
    location: 'Песчаный шатёр',
    subtitle: 'Философ-сатирик, презирающий роскошь и амбиции',
    intro: 'Я не против власти — я против того, чтобы она громко кричала. Простота смиряет гордыню лучше любой победы.',
    consoleTitle: 'Простые записи',
    startSupplies: 52,
    resources: { food: 44, gold: 20, water: 48 },
    baseStats: { hunger: 70, energy: 76, mood: 78, patience: 80, simplicity: 82, serenity: 74, dignity: 68, rhetoric: 62 },
    specialStats: [
      { key: 'simplicity', label: 'Простота' },
      { key: 'serenity', label: 'Спокойствие' },
      { key: 'dignity', label: 'Достоинство' },
      { key: 'rhetoric', label: 'Речь' }
    ],
    actions: {
      feed: 'Поделиться простым ужином',
      rest: 'Провести медитацию',
      strategy: 'Обсудить смысл',
      conquest: 'Отвергнуть царскую роскошь',
      map: 'Изучить горизонты',
      praise: 'Похвалить без пафоса',
      code: 'Оценить простоту кода',
      complaint: 'Обсудить пустоту',
      decree: 'Написать короткий указ',
      leave: 'Подождать в тишине'
    },
    scrollPool: [
      { category: 'философия', text: 'Гордыня — это искусство тратить больше воздуха, чем смысла.' },
      { category: 'простота', text: 'Пирамида не нужна, если можно жить с одним кувшином и ясным рассуждением.' },
      { category: 'критика', text: 'Единственная настоящая тронная корона — это ясность ума.' },
      { category: 'история', text: 'Люди мечтают о славе, пока не поймут, что у опоры есть собственный вес.' },
      { category: 'шутка', text: 'Если ты хочешь управлять миром, начни с того, чтобы не шуметь в чужом шатре.' },
      { category: 'внутреннее', text: 'Мне приятнее пустой сосуд, чем шумный дворец, переполненный чужими идеями.' },
      { category: 'достоинство', text: 'Смысл не в том, кто больше кричит, а в том, кто способен молчать без страха.' },
      { category: 'практика', text: 'Люди строят империи, а я смотрю на воду и вспоминаю, что в ней нет честолюбия.' }
    ],
    taskPool: [
      { title: 'Провести беседу о простоте', description: 'Показать, что ясность важнее пышных обещаний.', difficulty: 2, reward: 16, effect: { simplicity: 12, serenity: 8 }, dueIn: 5 },
      { title: 'Отделить смысл от роскоши', description: 'Выбрать, что действительно важно в жизни и управлении.', difficulty: 2, reward: 17, effect: { dignity: 10, serenity: 8 }, dueIn: 4 },
      { title: 'Найти комфорт в скромности', description: 'Проверить, может ли ум оставаться чистым без лишнего шума.', difficulty: 2, reward: 15, effect: { simplicity: 10, mood: 7 }, dueIn: 4 },
      { title: 'Сопоставить труды и славу', description: 'Показать, что награда не всегда требует тирании.', difficulty: 3, reward: 18, effect: { rhetoric: 10, serenity: 8 }, dueIn: 5 },
      { title: 'Поговорить с царём о скромности', description: 'Укусить амбиции максимально спокойно и без лишней помпы.', difficulty: 3, reward: 20, effect: { dignity: 12, simplicity: 10 }, dueIn: 6 },
      { title: 'Записать короткую мудрость', description: 'Всё лучше, когда слово кратко, а мысль глубока.', difficulty: 2, reward: 14, effect: { rhetoric: 12, mood: 7 }, dueIn: 4 }
    ],
    eventPool: [
      {
        title: 'Шатёр окружён шумом роскоши',
        description: 'Вокруг всё шумит и пышно; Диоген замечает, что громкость не делает людей сильнее.',
        choices: [
          { label: 'Сократить всё до простого', effect: { simplicity: 14, serenity: 10, mood: 6 } },
          { label: 'Проверить, кто действительно важен', effect: { dignity: 10, rhetoric: 8, mood: 5 } },
          { label: 'Поддразнить стольных покровителей', effect: { mood: 8, rhetoric: 12, serenity: -4 } }
        ]
      },
      {
        title: 'Сосед просит поддержать честолюбие',
        description: 'Кто-то желает славы, но предлагает за неё слишком много шума.',
        choices: [
          { label: 'Отвергнуть этот путь', effect: { simplicity: 12, serenity: 10, dignity: 8 } },
          { label: 'Согласиться без лишней пышности', effect: { mood: 7, rhetoric: 10, dignity: 7 } },
          { label: 'Уморить спор шуткой', effect: { rhetoric: 12, mood: 10, serenity: 6 } }
        ]
      },
      {
        title: 'Пауза в мире и взгляде',
        description: 'Снова тишина — и это самое ценное, что случается в расхлябанной эпохе.',
        choices: [
          { label: 'Отдохнуть и оценить ясность', effect: { serenity: 12, mood: 8, patience: 7 } },
          { label: 'Коротко поговорить о смысле', effect: { rhetoric: 12, dignity: 8, simplicity: 6 } },
          { label: 'Игнорировать и ждать', effect: { patience: 8, mood: 4, serenity: -5 } }
        ]
      }
    ],
    endings: [
      { title: 'Путь без трона', requirement: (s) => s.stats.simplicity >= 86 && s.stats.serenity >= 78, summary: 'Диоген вышел победителем, оставив важное — без роскоши и с ясным взглядом.' },
      { title: 'Мудрость поверх власти', requirement: (s) => s.stats.dignity >= 80 && s.stats.rhetoric >= 68, summary: 'Он отказался от продуктивного шума и зарядил мир спокойствием.' },
      { title: 'Пустой дворец, полный смысла', requirement: (s) => s.stats.mood >= 75 && s.stats.patience >= 75, summary: 'Даже без империи и пышных столов страну можно прожить с достоинством.' }
    ],
    achievements: [
      { id: 'simple', title: 'Простота есть', description: 'Даже в шуме нашлась ясность.' },
      { id: 'quiet', title: 'Тишина побеждает', description: 'Пауза была использована с пользой.' },
      { id: 'wisdom', title: 'Молчание — сила', description: 'Слова перестали быть пустыми.' }
    ],
    moodTexts: ['Спокойный', 'Сдержанный', 'Мудрый', 'Неподкупный', 'Простой и сильный']
  }
};

const ALL_PROFILE_IDS = Object.keys(PROFILES);

let state = createFreshState('stalin');
let audioContext = null;

function createFreshState(characterId = 'stalin') {
  const profile = PROFILES[characterId] || PROFILES.stalin;
  const base = { ...profile.baseStats };
  return {
    selectedCharacter: profile.id,
    themeMode: 'dark',
    day: 1,
    speed: 'pause',
    supplies: profile.startSupplies,
    resources: { ...profile.resources },
    stats: base,
    tasks: [buildTask(profile.taskPool[0]), buildTask(profile.taskPool[1])],
    scrolls: [],
    eventLog: [profile.intro],
    achievements: [],
    soundEnabled: true,
    gameOver: false,
    activeEvent: null,
    records: { bestDay: 1, bestMood: 70, lastEnding: 'Новая кампания' },
    lastComplaintAt: 0,
    lastEventAt: 0,
    actionCount: 0,
    taskCompletionCount: 0,
    codeFixes: 0,
    tick: 0,
    loopId: null,
    currentEnding: ''
  };
}

function buildTask(template) {
  return {
    id: `task-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    status: 'available',
    title: template.title,
    description: template.description,
    difficulty: template.difficulty,
    reward: template.reward,
    effect: template.effect,
    dueIn: template.dueIn,
    timeLeft: template.dueIn
  };
}

function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getProfile() {
  return PROFILES[state.selectedCharacter] || PROFILES.stalin;
}

function getMoodLabel() {
  const profile = getProfile();
  const common = [state.stats.hunger, state.stats.energy, state.stats.mood, state.stats.patience];
  const avg = average(common);
  if (avg >= 75) return profile.moodTexts[4] || 'Величественное';
  if (avg >= 60) return profile.moodTexts[3] || 'Подъём';
  if (avg >= 45) return profile.moodTexts[2] || 'Стабильное';
  if (avg >= 25) return profile.moodTexts[1] || 'Неприятное';
  return profile.moodTexts[0] || 'Критическое';
}

function getCampStatus() {
  const profile = getProfile();
  if (state.stats.hunger < 25 || state.stats.energy < 20 || state.stats.patience < 18) {
    return profile.id === 'diogen' ? 'Шатёр на краю спокойствия' : 'Лагерь на грани мятежа';
  }
  const specialAverage = average(profile.specialStats.map((entry) => state.stats[entry.key] ?? 50));
  if (specialAverage > 70 && state.stats.mood > 60) {
    return profile.id === 'stalin' ? 'Канцелярия работает без сбоев' : profile.id === 'diogen' ? 'Порядок на уровне простоты' : 'Граждане готовы к решению';
  }
  return profile.id === 'diogen' ? 'Совсем без лишнего шума' : 'Много обещаний, мало порядка';
}

function updateSelectionCards() {
  const container = document.getElementById('characterCards');
  if (!container) return;
  container.innerHTML = ALL_PROFILE_IDS.map((id) => {
    const profile = PROFILES[id];
    const active = state.selectedCharacter === id ? 'active' : '';
    return `
      <article class="character-card-shell ${profile.id}">
        <div class="card-portrait"><div class="avatar ${profile.id}"></div></div>
        <div class="card-body">
          <div class="card-header">
            <h3>${profile.name}</h3>
            <span class="card-era">${profile.era}</span>
          </div>
          <div class="card-scenario">Сценарий: «${profile.subtitle}»</div>
          <p class="card-description">${profile.intro}</p>
          <ul class="card-features">
            ${profile.specialStats.slice(0, 3).map((item) => `<li>${item.label}</li>`).join('')}
          </ul>
          <button class="switch-character ${active}" data-character="${profile.id}">Выбрать персонажа</button>
        </div>
      </article>
    `;
  }).join('');
}

function renderActionButtons() {
  const profile = getProfile();
  const buttons = [
    { key: 'feed', label: profile.actions.feed },
    { key: 'rest', label: profile.actions.rest },
    { key: 'strategy', label: profile.actions.strategy },
    { key: 'conquest', label: profile.actions.conquest },
    { key: 'map', label: profile.actions.map },
    { key: 'praise', label: profile.actions.praise },
    { key: 'code', label: profile.actions.code },
    { key: 'complaint', label: profile.actions.complaint },
    { key: 'decree', label: profile.actions.decree },
    { key: 'leave', label: profile.actions.leave }
  ];
  document.getElementById('actionButtons').innerHTML = buttons.map((button) => `
    <button class="action-button" data-action="${button.key}">${button.label}</button>
  `).join('');
  document.getElementById('consoleTitle').textContent = profile.consoleTitle;
  document.getElementById('decreeInput').placeholder = `Напишите приказ ${profile.name.toLowerCase()}...`;
}

function renderStats() {
  const profile = getProfile();
  const items = [
    ['hunger', 'Сытость'],
    ['energy', 'Энергия'],
    ['mood', 'Настроение'],
    ['patience', 'Терпение'],
    ...profile.specialStats.map((item) => [item.key, item.label])
  ];

  document.getElementById('statsContainer').innerHTML = items.map(([key, label]) => {
    const value = clamp(Math.round(state.stats[key] ?? 50));
    return `
      <div class="stat-block">
        <div class="stat-head"><span>${label}</span><span>${value}</span></div>
        <div class="bar"><div class="fill" style="width:${value}%"></div></div>
      </div>
    `;
  }).join('');
}

function applyTheme() {
  const theme = state.themeMode === 'light' ? 'light' : 'dark';
  document.body.dataset.character = state.selectedCharacter;
  document.body.dataset.theme = theme;

  const themeButtons = [
  document.getElementById('gameThemeToggle'),
  document.getElementById('menuThemeToggle')
  ].filter(Boolean);

  themeButtons.forEach((button) => {
  button.textContent = theme === 'dark' ? '🌙 Тёмная' : '☀️ Светлая';
  });
}

function renderOverview() {
  const profile = getProfile();
  const portrait = document.getElementById('bigAvatar');
  if (portrait) {
    portrait.className = `avatar-figure ${profile.id} ${state.stats.mood < 30 ? 'angry' : state.stats.energy < 25 ? 'tired' : 'neutral'}`;
  }

  const nameField = document.getElementById('characterName');
  if (nameField) nameField.textContent = profile.name;

  const locationField = document.getElementById('characterLocation');
  if (locationField) locationField.textContent = profile.location;

  const dayField = document.getElementById('dayValue');
  if (dayField) dayField.textContent = String(Math.max(1, Math.round(state.day)));

  const moodField = document.getElementById('moodValue');
  if (moodField) moodField.textContent = getMoodLabel();

  const statusField = document.getElementById('stateStatus');
  if (statusField) statusField.textContent = getCampStatus();

  const suppliesField = document.getElementById('suppliesValue');
  if (suppliesField) suppliesField.textContent = String(Math.round(state.supplies));

  const speedButtons = document.querySelectorAll('.speed-button');
  if (speedButtons && speedButtons.length) {
    speedButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.speed === state.speed);
    });
  }

  const soundToggle = document.getElementById('soundToggleButton');
  if (soundToggle) {
    soundToggle.textContent = `🔊 Звук: ${state.soundEnabled ? 'вкл' : 'выкл'}`;
  }

  applyTheme();
}

function addConsoleMessage(text, sender = 'Система', tone = 'general') {
  const output = document.getElementById('consoleOutput');
  if (!output) return;
  const line = document.createElement('div');
  line.className = `console-line ${tone}`;
  line.innerHTML = `
    <span class="sender">${sender}</span>
    <span class="meta">[${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}]</span>
    <span class="message"></span>
  `;
  output.appendChild(line);
  const messageNode = line.querySelector('.message');
  let index = 0;
  const paint = () => {
    if (index <= text.length) {
      messageNode.textContent = text.slice(0, index);
      index += 1;
      setTimeout(paint, 18);
    }
  };
  paint();
  output.scrollTop = output.scrollHeight;
}

function addScroll(category, text, sender = 'Царь') {
  state.scrolls.unshift({ id: `scroll-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`, category, text, sender, day: state.day });
  renderScrolls();
}

function renderScrolls() {
  const scrollLog = document.getElementById('scrollLog');
  if (!scrollLog) return;
  scrollLog.innerHTML = (state.scrolls.slice(0, 8)).map((scroll) => `
    <article class="scroll-card">
      <div class="scroll-head"><span>${scroll.sender}</span><span>День ${Math.round(scroll.day)}</span></div>
      <div class="scroll-head"><span>${scroll.category}</span></div>
      <p>${scroll.text}</p>
    </article>
  `).join('');
}

function renderAchievements() {
  const list = document.getElementById('achievementList');
  if (!list) return;
  const profile = getProfile();
  list.innerHTML = profile.achievements.map((achievement) => `
    <li class="achievement-item ${state.achievements.includes(achievement.id) ? 'unlocked' : ''}"><span>${achievement.title}</span><span>${state.achievements.includes(achievement.id) ? '✓' : '•'}</span></li>
  `).join('');
}

function renderEventJournal() {
  const journal = document.getElementById('eventJournal');
  if (!journal) return;
  journal.innerHTML = state.eventLog.slice(0, 8).map((entry) => `<div class="journal-entry">${entry}</div>`).join('');
}

function renderTasks() {
  const taskList = document.getElementById('taskList');
  if (!taskList) return;
  taskList.innerHTML = state.tasks.map((task) => `
    <div class="task-card">
      <h4>${task.title}</h4>
      <p>${task.description}</p>
      <div class="task-meta"><span>Сложность: ${task.difficulty}</span><span>Награда: +${task.reward}</span></div>
      <div class="task-meta"><span>До: ${task.timeLeft} дн.</span><span>${task.status === 'active' ? 'В работе' : task.status === 'done' ? 'Выполнено' : 'Доступно'}</span></div>
      <div class="task-actions">
        ${task.status === 'available' ? `<button data-task-accept="${task.id}">Принять</button>` : ''}
        ${task.status === 'active' ? `<button data-task-complete="${task.id}">Выполнить</button>` : ''}
      </div>
    </div>
  `).join('');
}

function applyEffects(effect) {
  if (!effect || typeof effect !== 'object') return;
  Object.entries(effect).forEach(([key, value]) => {
    if (key in state.stats) {
      state.stats[key] = clamp((state.stats[key] ?? 50) + Number(value));
    }
  });
}

function generateScrollFromProfile() {
  const profile = getProfile();
  if (!profile.scrollPool || !profile.scrollPool.length) return;
  const item = randomItem(profile.scrollPool);
  addScroll(item.category || 'общий', item.text, profile.name);
  addConsoleMessage(item.text, profile.name, 'scroll');
}

function triggerComplaintScroll() {
  if (state.gameOver) return;
  const profile = getProfile();
  const complaint = randomItem(profile.scrollPool);
  addScroll(complaint.category || 'жалобы', complaint.text, profile.name);
  addConsoleMessage(complaint.text, profile.name, 'warning');
}

function maybeSpawnRandomEvent() {
  if (state.gameOver || state.activeEvent) return;
  const profile = getProfile();
  if (!profile.eventPool || !profile.eventPool.length) return;
  const event = randomItem(profile.eventPool);
  state.activeEvent = event;
  const content = `
    <div class="modal-header">
      <h3>${event.title}</h3>
      <button class="ghost-button" data-close-modal="true">Закрыть</button>
    </div>
    <div class="modal-body">
      <p>${event.description}</p>
      <div class="choice-list">
        ${event.choices.map((choice, index) => `<button data-event-choice="${index}">${choice.label}</button>`).join('')}
      </div>
    </div>
  `;
  openModal(content);
}

function openModal(content) {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;
  overlay.innerHTML = `<div class="modal-content">${content}</div>`;
  overlay.classList.remove('hidden');
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;
  overlay.classList.add('hidden');
  overlay.innerHTML = '';
  state.activeEvent = null;
}

function acceptTask(taskId) {
  const task = state.tasks.find((entry) => entry.id === taskId);
  if (!task) return;
  task.status = 'active';
  addConsoleMessage(`Задание принято: ${task.title}.`, 'Канцелярия', 'task');
  renderTasks();
}

function completeTask(taskId) {
  const task = state.tasks.find((entry) => entry.id === taskId);
  if (!task) return;
  const successChance = clamp(0.42 + (state.stats.mood + state.stats.energy + (state.stats.hunger || 50)) / 300 + task.difficulty * 0.08, 0.2, 0.93);
  const success = Math.random() < successChance;

  if (success) {
    applyEffects(task.effect);
    state.taskCompletionCount += 1;
    state.supplies = clamp(state.supplies + task.reward / 5, 0, 100);
    addConsoleMessage(`Задание выполнено: ${task.title}.`, 'Штаб', 'success');
    if (state.selectedCharacter === 'diogen') {
      addConsoleMessage('Диоген заметил: «Это хоть что-то, что не требует тирании.»', 'Диоген', 'success');
    }
    state.achievements = Array.from(new Set([...state.achievements, 'task_complete']));
  } else {
    state.stats.mood = clamp(state.stats.mood - 10);
    state.stats.patience = clamp(state.stats.patience - 12);
    addConsoleMessage(`Задание провалилось: ${task.title}. Слишком много обещаний и слишком мало результата.`, 'Штаб', 'warning');
    triggerComplaintScroll();
  }

  state.tasks = state.tasks.filter((entry) => entry.id !== taskId);
  if (state.tasks.length < 2 && Math.random() < 0.9) {
    const profile = getProfile();
    state.tasks.push(buildTask(profile.taskPool[Math.floor(Math.random() * profile.taskPool.length)]));
  }

  checkAchievements();
  checkEnding();
  renderAll();
}

function addEventEntry(message) {
  state.eventLog.unshift(message);
  renderEventJournal();
}

function generateDecreeReply(inputText) {
  const text = inputText.trim();
  if (!text) return 'Пустой приказ — это не порядок, это мечта без формы.';
  const profile = getProfile();
  const lower = text.toLowerCase();
  if (profile.id === 'stalin' && /отчёт|план|порядок/i.test(lower)) {
    return 'Порядок восстанавливается. Один документ — и весь хаос становится управляемым.';
  }
  if (profile.id === 'alexander' && /слава|земля|завоев|победа/i.test(lower)) {
    return 'Подобное желание к славе — достойное. Но даже величайший не торопится без припасов.';
  }
  if (profile.id === 'napoleon' && /план|дисциплина|импер/i.test(lower)) {
    return 'Надо действовать чётко. Даже самый блестящий план проигрывает плохой дисциплине.';
  }
  if (profile.id === 'peter' && /корабль|реформа|работа|труд/i.test(lower)) {
    return 'Хорошо. Практика важнее речи. Но по фактам и результатам, а не по обещаниям.';
  }
  if (profile.id === 'caesar' && /речь|сенат|народ|согласие/i.test(lower)) {
    return 'Слова должны звучать ясно, если вы хотите влиять на сердца и политику.';
  }
  if (profile.id === 'diogen' && /простота|смысл|тишина|слава/i.test(lower)) {
    return 'Небольшой разум всегда важнее громкой славы. Слово должно быть чистым, а не пышным.';
  }
  return `Указ принят: «${text}». История заметит это, даже если все остальные пока ещё спорят.`;
}

function processDecree() {
  const input = document.getElementById('decreeInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) {
    addConsoleMessage('Пустой указ. Получается, вы решили править тишиной.', 'Канцелярия', 'warning');
    return;
  }
  const reply = generateDecreeReply(text);
  const sender = getProfile().name;
  addConsoleMessage(text, 'Игрок', 'decree');
  addConsoleMessage(reply, sender, 'decree');
  addEventEntry(`Указ: ${text} → ${reply}`);
  state.stats.mood = clamp(state.stats.mood + 4);
  state.stats.patience = clamp(state.stats.patience + 2);
  input.value = '';
  renderAll();
}

function checkAchievements() {
  const profile = getProfile();
  const unlocked = new Set(state.achievements);
  profile.achievements.forEach((achievement) => {
    if (!unlocked.has(achievement.id)) {
      const ok =
        (achievement.id === 'paperwork' && state.stats.order >= 70) ||
        (achievement.id === 'discipline' && state.stats.order >= 80) ||
        (achievement.id === 'order' && state.stats.order >= 85) ||
        (achievement.id === 'march' && state.day >= 3) ||
        (achievement.id === 'glory' && state.stats.glory >= 70) ||
        (achievement.id === 'policy' && state.stats.diplomacy >= 70) ||
        (achievement.id === 'memoirs' && state.stats.reputation >= 70) ||
        (achievement.id === 'law' && state.stats.discipline >= 75) ||
        (achievement.id === 'legend' && state.stats.authority >= 75) ||
        (achievement.id === 'ship' && state.stats.craft >= 70) ||
        (achievement.id === 'shop' && state.stats.progress >= 70) ||
        (achievement.id === 'reform' && state.stats.satisfaction >= 75) ||
        (achievement.id === 'forum' && state.stats.popularity >= 70) ||
        (achievement.id === 'consensus' && state.stats.senate >= 75) ||
        (achievement.id === 'legacy' && state.stats.influence >= 75) ||
        (achievement.id === 'simple' && state.stats.simplicity >= 78) ||
        (achievement.id === 'quiet' && state.stats.serenity >= 72) ||
        (achievement.id === 'wisdom' && state.stats.rhetoric >= 70);
      if (ok) {
        state.achievements.push(achievement.id);
        addConsoleMessage(`Новое достижение: ${achievement.title}`, 'Система', 'success');
      }
    }
  });
}

function checkEnding() {
  if (state.gameOver) return;
  const profile = getProfile();
  const maybe = profile.endings.find((ending) => ending.requirement(state));
  if (maybe) {
    state.gameOver = true;
    state.currentEnding = maybe.title;
    state.records.lastEnding = maybe.title;
    const content = `
      <div class="modal-header">
        <h3>Концовка: ${maybe.title}</h3>
      </div>
      <div class="modal-body">
        <p>${maybe.summary}</p>
        <div class="summary-box">
          <div>День: ${Math.round(state.day)}</div>
          <div>Сытость: ${Math.round(state.stats.hunger)}</div>
          <div>Настроение: ${Math.round(state.stats.mood)}</div>
          <div>Терпение: ${Math.round(state.stats.patience)}</div>
        </div>
        <button data-new-game="true">Начать новый поход</button>
      </div>
    `;
    openModal(content);
    addConsoleMessage(`Концовка: ${maybe.title}. ${maybe.summary}`, 'Система', 'success');
  }
}

function saveGame() {
  try {
    const key = getSaveKeyForCharacter(state.selectedCharacter);
    const payload = {
      selectedCharacter: state.selectedCharacter,
      themeMode: state.themeMode,
      day: state.day,
      speed: state.speed,
      supplies: state.supplies,
      resources: state.resources,
      stats: state.stats,
      tasks: state.tasks,
      scrolls: state.scrolls,
      eventLog: state.eventLog,
      achievements: state.achievements,
      soundEnabled: state.soundEnabled,
      gameOver: state.gameOver,
      currentEnding: state.currentEnding,
      records: state.records,
      actionCount: state.actionCount,
      taskCompletionCount: state.taskCompletionCount,
      codeFixes: state.codeFixes
    };
    localStorage.setItem(key, JSON.stringify(payload));
    addConsoleMessage('Игра сохранена в локальное хранилище.', 'Система', 'success');
  } catch (error) {
    addConsoleMessage('Ошибка сохранения: ' + error.message, 'Система', 'warning');
  }
}

function loadGame() {
  try {
    const key = getSaveKeyForCharacter(state.selectedCharacter || 'stalin');
    const raw = localStorage.getItem(key);
    if (!raw) {
      addConsoleMessage('Сохранённая игра для этого правителя не найдена.', 'Система', 'warning');
      return;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Некорректный формат сохранения');
    }

    const safeCharacter = PROFILES[parsed.selectedCharacter] ? parsed.selectedCharacter : (state.selectedCharacter || 'stalin');
    const fresh = createFreshState(safeCharacter);
    const merged = {
      ...fresh,
      ...parsed,
      selectedCharacter: safeCharacter,
      themeMode: parsed.themeMode === 'light' ? 'light' : 'dark',
      stats: { ...fresh.stats, ...(parsed.stats || {}) },
      resources: { ...fresh.resources, ...(parsed.resources || {}) },
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : fresh.tasks,
      scrolls: Array.isArray(parsed.scrolls) ? parsed.scrolls : fresh.scrolls,
      eventLog: Array.isArray(parsed.eventLog) ? parsed.eventLog : fresh.eventLog,
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : fresh.achievements,
      records: { ...fresh.records, ...(parsed.records || {}) },
      soundEnabled: parsed.soundEnabled !== false,
      activeEvent: null
    };

    Object.assign(state, merged);
    setGameSpeed(state.speed || 'pause');
    renderAll();
    addConsoleMessage('Сохранённая кампания восстановлена.', 'Система', 'success');
  } catch (error) {
    addConsoleMessage('Ошибка загрузки: ' + error.message, 'Система', 'warning');
  }
}

function resetGame() {
  const fresh = createFreshState(state.selectedCharacter);
  Object.assign(state, fresh);
  closeModal();
  renderAll();
  addConsoleMessage('Прогресс сброшен. Новый поход начинается с чистого листа.', 'Система', 'success');
}

function setGameSpeed(speed) {
  state.speed = speed;
  document.querySelectorAll('.speed-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.speed === speed);
  });
  if (state.loopId) {
    clearInterval(state.loopId);
    state.loopId = null;
  }
  if (SPEEDS[speed] > 0) {
    state.loopId = setInterval(() => {
      gameTick();
    }, 1000 / SPEEDS[speed]);
  }
}

function gameTick() {
  if (state.gameOver || !SPEEDS[state.speed]) return;
  const multiplier = SPEEDS[state.speed];
  state.tick += 1;
  state.day += 0.15 * multiplier;

  const profile = getProfile();
  state.stats.hunger = clamp(state.stats.hunger - 1.7 * multiplier);
  state.stats.patience = clamp(state.stats.patience - 1.3 * multiplier);
  state.stats.energy = clamp(state.stats.energy + 0.8 * multiplier, 0, 100);
  state.stats.mood = clamp(state.stats.mood - (0.6 + Math.random() * 0.8) * multiplier, 0, 100);

  profile.specialStats.forEach((entry) => {
    const key = entry.key;
    if (key in state.stats) {
      const v = state.stats[key] ?? 50;
      state.stats[key] = clamp(v - (0.5 + Math.random() * 0.8) * multiplier, 0, 100);
    }
  });

  state.supplies = clamp(state.supplies - 0.2 * multiplier, 0, 100);
  state.resources.food = clamp((state.resources.food || 0) - 0.12 * multiplier, 0, 100);

  state.tasks.forEach((task) => {
    if (task.status === 'active') {
      task.timeLeft = Math.max(0, task.timeLeft - 1 * multiplier);
      if (task.timeLeft === 0) {
        task.status = 'failed';
        addConsoleMessage(`Время вышло для задания: ${task.title}.`, 'Канцелярия', 'warning');
        state.stats.patience = clamp(state.stats.patience - 10);
      }
    }
  });
  state.tasks = state.tasks.filter((task) => task.status !== 'failed');

  if (state.stats.hunger <= 25 && Date.now() - state.lastComplaintAt > 14000) {
    triggerComplaintScroll();
    state.lastComplaintAt = Date.now();
  }

  if (state.stats.mood <= 20 || state.stats.patience <= 18) {
    if (Date.now() - state.lastEventAt > 15000) {
      const warningText = profile.id === 'diogen' ? 'Молчание ломается. Сдаться ли шуму или вернуть тишину?' : 'Нервное состояние растёт. Пора остановить хаос.';
      addConsoleMessage(warningText, 'Система', 'warning');
      state.lastEventAt = Date.now();
      maybeSpawnRandomEvent();
    }
  }

  if (Math.random() < 0.12 * multiplier) {
    generateScrollFromProfile();
  }

  if (Math.random() < 0.15 * multiplier) {
    maybeSpawnRandomEvent();
  }

  state.records.bestDay = Math.max(state.records.bestDay, Math.round(state.day));
  state.records.bestMood = Math.max(state.records.bestMood || 0, Math.round(state.stats.mood));
  checkAchievements();
  checkEnding();
  renderAll();
}

function renderAll() {
  updateSelectionCards();
  renderOverview();
  renderStats();
  renderActionButtons();
  renderTasks();
  renderScrolls();
  renderAchievements();
  renderEventJournal();
  applyTheme();
}

function handleCharacterSelect(button) {
  const characterId = button.dataset.character;
  if (!PROFILES[characterId]) return;
  const fresh = createFreshState(characterId);
  Object.assign(state, fresh);
  state.themeMode = state.themeMode || 'dark';
  const selectionScreen = document.getElementById('selectionScreen');
  const gameScreen = document.getElementById('gameScreen');
  if (selectionScreen) {
    selectionScreen.classList.remove('active');
    selectionScreen.classList.add('hidden');
  }
  if (gameScreen) {
    gameScreen.classList.remove('hidden');
    gameScreen.classList.add('active');
  }
  addConsoleMessage(`${PROFILES[characterId].name} вступил в игру. ${PROFILES[characterId].intro}`, 'Система', 'success');
  renderAll();
  setGameSpeed(state.speed);
}

function bindEvents() {
  document.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-action]');
    if (actionButton) {
      const action = actionButton.dataset.action;
      const profile = getProfile();
      switch (action) {
        case 'feed': {
          const food = state.resources.food || 0;
          if (food <= 0) {
            addConsoleMessage('Припасы закончились. Нужен новый обоз, чтобы не превратить лагерь в пустой Парад обещаний.', 'Снабжение', 'warning');
            return;
          }
          state.resources.food = clamp(food - 5, 0, 100);
          state.supplies = clamp(state.supplies - 4, 0, 100);
          state.stats.hunger = clamp(state.stats.hunger + 18, 0, 100);
          state.stats.mood = clamp(state.stats.mood + 8, 0, 100);
          state.stats.patience = clamp(state.stats.patience - 2, 0, 100);
          addConsoleMessage(profile.name + ' принимает решение поесть и становится чуть менее прожорливым.', profile.name, 'feed');
          break;
        }
        case 'rest': {
          state.stats.energy = clamp(state.stats.energy + 18, 0, 100);
          state.stats.mood = clamp(state.stats.mood + 6, 0, 100);
          state.stats.patience = clamp(state.stats.patience + 5, 0, 100);
          addConsoleMessage(profile.name + ' берёт паузу и успокаивается.', profile.name, 'rest');
          break;
        }
        case 'strategy': {
          state.stats.mood = clamp(state.stats.mood + 10, 0, 100);
          state.stats.energy = clamp(state.stats.energy - 4, 0, 100);
          state.stats.patience = clamp(state.stats.patience + 3, 0, 100);
          addConsoleMessage('Стратегия выслушана. Разговоры оказались полезнее, чем все дикие обещания.', profile.name, 'strategy');
          break;
        }
        case 'conquest': {
          state.stats.mood = clamp(state.stats.mood - 2, 0, 100);
          state.stats.patience = clamp(state.stats.patience + 2, 0, 100);
          const key = profile.specialStats[0]?.key || 'mood';
          state.stats[key] = clamp((state.stats[key] ?? 50) + 10, 0, 100);
          addConsoleMessage('Решение принято: пора действовать. Времени на сомнения почти не осталось.', profile.name, 'conquest');
          if (state.tasks.length < 3) {
            const taskTemplate = randomItem(profile.taskPool);
            state.tasks.push(buildTask(taskTemplate));
          }
          break;
        }
        case 'map': {
          const mapContent = `
            <div class="modal-header">
              <h3>Карта похода</h3>
              <button class="ghost-button" data-close-modal="true">Закрыть</button>
            </div>
            <div class="modal-body">
              <p>Карта показывает четыре маршрута: короткий, безопасный, рискованный и «славу ради».</p>
              <div class="map-grid">
                <div class="map-cell route">Тропа</div>
                <div class="map-cell camp">Штаб</div>
                <div class="map-cell risk">Пески</div>
                <div class="map-cell route">Река</div>
                <div class="map-cell risk">Буря</div>
                <div class="map-cell route">Крепость</div>
              </div>
            </div>
          `;
          openModal(mapContent);
          addConsoleMessage('Карта передана. Теперь хотя бы маршрут кажется решением.', profile.name, 'map');
          break;
        }
        case 'praise': {
          state.stats.mood = clamp(state.stats.mood + 12, 0, 100);
          state.stats.patience = clamp(state.stats.patience + 4, 0, 100);
          addConsoleMessage('Похвала принята. Он уже в принципе готов к новым свершениям, а голос от этого стал ещё громче.', profile.name, 'success');
          break;
        }
        case 'code': {
          state.codeFixes += 1;
          state.stats.mood = clamp(state.stats.mood + 5, 0, 100);
          state.stats.patience = clamp(state.stats.patience + 3, 0, 100);
          addConsoleMessage('Код проверен. Небольшое улучшение уже вызывает впечатление, что всё ещё можно исправить.', profile.name, 'code');
          break;
        }
        case 'complaint': {
          triggerComplaintScroll();
          break;
        }
        case 'decree': {
          processDecree();
          return;
        }
        case 'leave': {
          state.day += 1;
          state.stats.energy = clamp(state.stats.energy + 6, 0, 100);
          state.stats.hunger = clamp(state.stats.hunger - 5, 0, 100);
          addConsoleMessage('Вы ушли по делам. Пауза оказалась короткой, но её хватило, чтобы история всё же двигалась.', 'Система', 'success');
          break;
        }
        default:
          break;
      }
      state.actionCount += 1;
      state.records.bestMood = Math.max(state.records.bestMood || 0, Math.round(state.stats.mood));
      renderAll();
      return;
    }

    const speedButton = event.target.closest('[data-speed]');
    if (speedButton) {
      setGameSpeed(speedButton.dataset.speed);
      return;
    }

    const characterButton = event.target.closest('[data-character]');
    if (characterButton) {
      handleCharacterSelect(characterButton);
      return;
    }

    const taskAcceptButton = event.target.closest('[data-task-accept]');
    if (taskAcceptButton) {
      acceptTask(taskAcceptButton.dataset.taskAccept);
      return;
    }

    const taskCompleteButton = event.target.closest('[data-task-complete]');
    if (taskCompleteButton) {
      completeTask(taskCompleteButton.dataset.taskComplete);
      return;
    }

    const eventChoiceButton = event.target.closest('[data-event-choice]');
    if (eventChoiceButton && state.activeEvent) {
      const chosenIndex = Number(eventChoiceButton.dataset.eventChoice);
      const choice = state.activeEvent.choices[chosenIndex];
      if (choice) {
        applyEffects(choice.effect);
        addEventEntry(`Решение: ${choice.label} — ${state.activeEvent.title}`);
        addConsoleMessage(`Выбрано: ${choice.label}`, 'Игрок', 'event');
      }
      closeModal();
      checkAchievements();
      checkEnding();
      renderAll();
      return;
    }

    if (event.target.closest('[data-close-modal]')) {
      closeModal();
      return;
    }

    if (event.target.closest('#saveGameButton')) {
      saveGame();
      return;
    }

    if (event.target.closest('#loadGameButton')) {
      loadGame();
      return;
    }

    if (event.target.closest('#resetGameButton')) {
      if (window.confirm('Вы уверены, что хотите сбросить прогресс?')) {
        resetGame();
      }
      return;
    }

    if (event.target.closest('#backToMenuButton')) {
      const selectionScreen = document.getElementById('selectionScreen');
      const gameScreen = document.getElementById('gameScreen');
      if (selectionScreen) {
        selectionScreen.classList.remove('hidden');
        selectionScreen.classList.add('active');
      }
      if (gameScreen) {
        gameScreen.classList.remove('active');
        gameScreen.classList.add('hidden');
      }
      addConsoleMessage('Вы вернулись к выбору правителя. История подождёт, а порядок — нет.', 'Система', 'success');
      return;
    }

    if (event.target.closest('#gameThemeToggle') || event.target.closest('#menuThemeToggle')) {
      toggleTheme();
      addConsoleMessage(state.themeMode === 'dark' ? 'Тёмная тема активирована.' : 'Светлая тема активирована.', 'Система', 'success');
      return;
    }

    if (event.target.closest('#soundToggleButton')) {
      state.soundEnabled = !state.soundEnabled;
      document.getElementById('soundToggleButton').textContent = `Звук: ${state.soundEnabled ? 'вкл' : 'выкл'}`;
      addConsoleMessage(state.soundEnabled ? 'Звук включён. Снова слышен гул лагеря.' : 'Звук отключён. Тишина вернулась к штабу.', 'Система', 'success');
      return;
    }

    if (event.target.closest('#clearConsoleButton')) {
      const output = document.getElementById('consoleOutput');
      if (output) output.innerHTML = '';
      addConsoleMessage('Журнал очищен. Пыль и слова всплыли снова.', 'Система', 'success');
      return;
    }

    if (event.target.closest('[data-new-game]')) {
      resetGame();
      closeModal();
      return;
    }
  });

  document.getElementById('decreeForm').addEventListener('submit', (event) => {
    event.preventDefault();
    processDecree();
  });
}

function toggleTheme() {
  state.themeMode = state.themeMode === 'dark' ? 'light' : 'dark';
  applyTheme();
  renderOverview();
}

function onInit() {
  const selectionScreen = document.getElementById('selectionScreen');
  const gameScreen = document.getElementById('gameScreen');
  if (selectionScreen) {
    selectionScreen.classList.add('active');
    selectionScreen.classList.remove('hidden');
  }
  if (gameScreen) {
    gameScreen.classList.remove('active');
    gameScreen.classList.add('hidden');
  }
  applyTheme();
  renderAll();
  bindEvents();
  setGameSpeed('pause');
  addConsoleMessage('Система готова. Выберите правителя и начните новый поход.', 'Система', 'success');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onInit);
} else {
  onInit();
}
