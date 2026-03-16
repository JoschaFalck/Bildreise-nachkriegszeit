/* ============================================================
   DATA.JS – Lerninhalt: Interaktive Bildreise Nachkriegszeit
   Alle Stationsdaten, Aufgaben und Übungen in einem Objekt.
   Basiert auf: stations_interaktive_bildreise_nachkriegszeit.json
   ============================================================ */

'use strict';

/* -- Asset-Map: ID -> Dateiname ----------------------------- */
const ASSETS = {
  img_truemmer:      'Bundesarchiv_Bild_183-J31347,_Berlin,_Ruinen_und_zerstörte_Autos.jpg',
  img_besatzungszonen: 'Map-Germany-1945.svg.png',
  img_tempelhof_people: 'Germans-airlift-1948.jpg',
  img_tempelhof_planes: 'C-47s_at_Tempelhof_Airport_Berlin_1948.jpg',
  img_mauer:         'Bundesarchiv_Bild_B_145_Bild-P061246.jpg',
  img_brd_ddr:       'Deutschland_Bundeslaender_1949.png',
  img_airlift_alt:   '1948_Berlin_airlift.jpg'
};

/* -- Bildunterschriften (Lizenz) ---------------------------- */
const ASSET_CAPTIONS = {
  img_truemmer:         'Bundesarchiv, Bild 183-J31347 / CC-BY-SA 3.0',
  img_besatzungszonen:  'Besatzungszonen 1945, gemeinfrei',
  img_tempelhof_people: 'Berliner Luftbrücke 1948, gemeinfrei / US Air Force',
  img_tempelhof_planes: 'C-47 Flugzeuge am Flughafen Tempelhof, 1948 / gemeinfrei',
  img_mauer:            'Bundesarchiv, Bild B 145 Bild-P061246 / CC-BY-SA 3.0',
  img_brd_ddr:          'Deutschland 1949 – BRD und DDR, gemeinfrei',
  img_airlift_alt:      'Berlin Luftbrücke 1948, gemeinfrei / US Air Force'
};

/* ============================================================
   STARTSEITE
   ============================================================ */
const START_PAGE = {
  title: 'Nachkriegszeit und Teilung Deutschlands',
  subtitle: 'Eine interaktive Bildreise',
  intro: 'Du arbeitest dich durch historische Fotos, Hotspots, Aufgaben und Übungen. Dabei lernst du, wie Menschen nach 1945 lebten, warum Deutschland geteilt wurde und welche Folgen das für den Alltag hatte.',
  learningGoals: [
    'Ich kann beschreiben, wie Deutschland nach dem Krieg aussah.',
    'Ich kann erklären, warum Deutschland in Besatzungszonen aufgeteilt wurde.',
    'Ich kann die Luftbrücke erklären.',
    'Ich kann BRD und DDR unterscheiden.',
    'Ich kann die Folgen von Teilung und Grenze für Menschen erklären.'
  ],
  journeyHint: 'In jedem Bild findest du farbige Punkte – die Hotspots. Klicke darauf, um Informationen, Aufgaben und Reflexionsfragen zu öffnen. Schreibe deine Antworten in die Textfelder – sie werden automatisch gespeichert.'
};

/* ============================================================
   CHECK-IN
   ============================================================ */
const CHECK_IN = {
  title: 'Check-in – Was weißt du schon?',
  instructions: 'Bevor wir beginnen: Kreuze bei jeder Aussage an, was du denkst.',
  statements: [
    {
      id: 'c1',
      text: 'Deutschland war nach 1945 stark zerstört.',
      correct: 'stimmt',
      feedback: 'Richtig! Viele deutsche Städte waren nach dem Zweiten Weltkrieg stark beschädigt oder fast vollständig zerstört.'
    },
    {
      id: 'c2',
      text: 'Nach dem Krieg wurde Deutschland in Besatzungszonen aufgeteilt.',
      correct: 'stimmt',
      feedback: 'Richtig! Die vier Siegermächte USA, Großbritannien, Frankreich und die Sowjetunion teilten Deutschland in vier Zonen auf.'
    },
    {
      id: 'c3',
      text: 'Die Berliner Mauer wurde direkt 1945 gebaut.',
      correct: 'stimmt nicht',
      feedback: 'Das stimmt nicht! Die Berliner Mauer wurde erst 1961 errichtet. 1945 begann zunächst die Besatzungszeit – die sichtbare Teilung kam viel später.'
    }
  ],
  openPrompt: 'Was wäre für dich am schwersten, wenn deine Stadt nach einem Krieg zerstört wäre?'
};

/* ============================================================
   STATIONEN
   ============================================================ */
const STATIONS = [

  /* -------- STATION 1: Deutschland in Trümmern -------- */
  {
    id: 'station_1',
    title: 'Deutschland 1945 – Leben in den Trümmern',
    shortTitle: 'Trümmer',
    image: 'img_truemmer',
    guidingQuestion: 'Wie lebten Menschen direkt nach dem Krieg?',
    introText: 'Nach dem Ende des Zweiten Weltkriegs waren viele Städte in Deutschland stark zerstört. Häuser lagen in Trümmern, Straßen waren kaputt und viele Menschen hatten kaum genug zu essen. Viele Familien hatten ihre Wohnung verloren. Es fehlte an Sicherheit, Ordnung und Hoffnung.',
    learningGoals: [
      'Zerstörung als Folge des Krieges beschreiben',
      'Alltagsprobleme der Menschen nach 1945 benennen',
      'Sich in Jugendliche der Nachkriegszeit hineinversetzen'
    ],
    hotspots: [
      {
        id: 's1_h1',
        type: 'info',
        label: 'Trümmer auf der Straße',
        position: { x: 0.40, y: 0.72 },
        title: 'Trümmer und Zerstörung',
        content: 'Auf vielen Straßen lagen Schutt und Trümmer. Gebäude waren zerstört oder beschädigt. Die Menschen mussten sich in einer kaputten Umgebung zurechtfinden – und trotzdem versuchen, weiterzuleben.'
      },
      {
        id: 's1_h2',
        type: 'task',
        label: 'Zerstörte Fahrzeuge',
        position: { x: 0.23, y: 0.48 },
        title: 'Bild genau ansehen',
        content: 'Sieh dir die Fahrzeuge und die Umgebung genau an. Was zeigt dir das über die Folgen des Krieges?',
        task: 'Nenne zwei Dinge, an denen man erkennt, dass der Krieg große Zerstörung hinterlassen hat.'
      },
      {
        id: 's1_h3',
        type: 'reflection',
        label: 'Fehlendes Alltagsleben',
        position: { x: 0.70, y: 0.42 },
        title: 'Nachdenken',
        content: 'Auf dem Bild sieht man kaum normales Stadtleben. Das zeigt: Der Alltag war nach dem Krieg nicht mehr so wie früher.',
        task: 'Wie würdest du dich fühlen, wenn deine Stadt plötzlich so aussehen würde?'
      },
      {
        id: 's1_h4',
        type: 'source',
        label: 'Probleme nach dem Krieg',
        position: { x: 0.82, y: 0.18 },
        title: 'Typische Probleme nach dem Krieg',
        contentList: [
          'Wenig Essen – viele Menschen hungerten',
          'Zerstörte Wohnungen – Obdachlosigkeit',
          'Fehlende Sicherheit – kein funktionierender Staat',
          'Verletzte oder vermisste Familienangehörige',
          'Angst vor der Zukunft – wie geht es weiter?'
        ]
      }
    ],
    requiredTasks: [
      {
        id: 's1_rt1',
        format: 'shortText',
        prompt: '1. Beschreibe das Bild in 3 ganzen Sätzen. Was siehst du? Wie wirkt das Bild auf dich?'
      },
      {
        id: 's1_rt2',
        format: 'shortText',
        prompt: '2. Nenne 3 Probleme, die Menschen nach dem Krieg hatten, und erkläre kurz, warum das so schwer war.'
      },
      {
        id: 's1_rt3',
        format: 'shortText',
        prompt: '3. Erkläre, warum der Alltag für Jugendliche nach dem Krieg besonders schwer gewesen sein könnte.'
      }
    ],
    extraTasks: [
      {
        id: 's1_et1',
        format: 'creativeWriting',
        prompt: 'Stell dir vor, du bist 14 Jahre alt und lebst 1945 in dieser Stadt. Schreibe 5 Sätze über deinen Tag – was erlebst du, was brauchst du, was hoffst du?'
      }
    ],
    collaboration: {
      title: 'Partnerauftrag',
      prompt: 'Vergleicht eure Bildbeschreibungen mit einem Partner / einer Partnerin.\n\n• Was habt ihr beide gesehen?\n• Was hat nur eine Person bemerkt?\n• Welche Dinge habt ihr unterschiedlich gedeutet?\n\nDiskutiert kurz und ergänzt ggf. eure Notizen.'
    },
    reflection: {
      prompt: 'Was wäre für dich schlimmer: kein sicheres Zuhause, wenig Essen oder ständige Angst? Begründe kurz deine Antwort.'
    },
    lifeWorldConnection: 'Sicherheit, Wohnen und Versorgung sind nicht selbstverständlich. Frieden prägt den Alltag stärker, als man oft bemerkt.',
    interactiveExercises: [
      {
        id: 's1_ex1',
        type: 'multipleChoice',
        prompt: 'Welche Probleme passen zur Zeit direkt nach dem Krieg? (Mehrere Antworten möglich)',
        options: [
          { text: 'Wohnungsnot', correct: true },
          { text: 'Lebensmittelmangel', correct: true },
          { text: 'Zerstörte Schulen', correct: true },
          { text: 'Ferienreisen', correct: false }
        ],
        feedbackCorrect: 'Richtig! Nach dem Krieg fehlten Wohnungen, Essen und oft auch funktionierende Schulen. Ferienreisen waren undenkbar.',
        feedbackPartial: 'Fast richtig. Überlege noch einmal, welche Probleme wirklich zur Nachkriegszeit passen.'
      }
    ],
    sources: [
      { label: 'Deutsches Historisches Museum: Nachkriegszeit', url: 'https://www.dhm.de/lemo/kapitel/nachkriegsjahre' },
      { label: 'bpb: Deutschland nach 1945', url: 'https://www.bpb.de/themen/nachkriegszeit' }
    ]
  },

  /* -------- STATION 2: Besatzungszonen -------- */
  {
    id: 'station_2',
    title: 'Vier Siegermächte – Deutschland unter Besatzung',
    shortTitle: 'Besatzungszonen',
    image: 'img_besatzungszonen',
    guidingQuestion: 'Wer entschied nach dem Krieg über Deutschland?',
    introText: 'Nach dem Krieg übernahmen die Siegermächte die Kontrolle über Deutschland. Das Land wurde in vier Besatzungszonen aufgeteilt: eine amerikanische, eine britische, eine französische und eine sowjetische Zone. Auch Berlin wurde in vier Sektoren geteilt. Dadurch entstand später viel Streit zwischen Ost und West.',
    learningGoals: [
      'Die vier Siegermächte benennen',
      'Besatzungszonen in einfachen Worten erklären',
      'Berlin als besonderen Ort erkennen'
    ],
    hotspots: [
      {
        id: 's2_h1',
        type: 'info',
        label: 'Amerikanische Zone',
        position: { x: 0.38, y: 0.70 },
        title: 'USA – Amerikanische Besatzungszone',
        content: 'Die USA verwalteten den Süden und Teile des Westens von Deutschland. Sie brachten demokratische Ideen mit und unterstützten später den Wiederaufbau.'
      },
      {
        id: 's2_h2',
        type: 'info',
        label: 'Britische Zone',
        position: { x: 0.22, y: 0.34 },
        title: 'Großbritannien – Britische Besatzungszone',
        content: 'Großbritannien übernahm den Nordwesten des Landes, darunter Städte wie Hamburg. Auch hier wurden demokratische Strukturen aufgebaut.'
      },
      {
        id: 's2_h3',
        type: 'info',
        label: 'Französische Zone',
        position: { x: 0.14, y: 0.80 },
        title: 'Frankreich – Französische Besatzungszone',
        content: 'Frankreich verwaltete einen kleineren Teil im Südwesten – unter anderem das heutige Saarland. Frankreich war besonders darauf bedacht, sicher zu sein, dass Deutschland nicht wieder zur Gefahr wird.'
      },
      {
        id: 's2_h4',
        type: 'info',
        label: 'Sowjetische Zone',
        position: { x: 0.67, y: 0.34 },
        title: 'Sowjetunion – Sowjetische Besatzungszone',
        content: 'Die Sowjetunion kontrollierte den Osten Deutschlands. Sie brachte ein anderes politisches System mit – den Kommunismus. Dieser Unterschied führte später zum Konflikt mit den Westmächten.'
      },
      {
        id: 's2_h5',
        type: 'task',
        label: 'Berlin als Sonderfall',
        position: { x: 0.53, y: 0.43 },
        title: 'Berlin – Sonderfall',
        content: 'Berlin lag mitten in der sowjetischen Zone, wurde aber selbst auch in vier Sektoren aufgeteilt. Das machte Berlin zu einem besonders spannungsreichen Ort.',
        task: 'Erkläre, warum Berlins Lage mitten in der sowjetischen Zone später zu Problemen führen konnte.'
      }
    ],
    requiredTasks: [
      {
        id: 's2_rt1',
        format: 'shortText',
        prompt: '1. Erkläre in 2 Sätzen, was eine Besatzungszone ist. Was bedeutet das für die Menschen, die dort leben?'
      },
      {
        id: 's2_rt2',
        format: 'shortText',
        prompt: '2. Beschreibe, warum Berlin ein Sonderfall war. Nutze das Bild der Karte als Hilfe.'
      },
      {
        id: 's2_rt3',
        format: 'shortText',
        prompt: '3. Warum konnte es zwischen Ost und West leicht zu Konflikten kommen? Erkläre in 2–3 Sätzen.'
      }
    ],
    extraTasks: [
      {
        id: 's2_et1',
        format: 'argumentation',
        prompt: 'Ist es fair oder unfair, wenn ein besiegtes Land von anderen Mächten verwaltet wird? Schreibe je ein Argument dafür und eines dagegen.'
      }
    ],
    collaboration: {
      title: 'Partnerdiskussion',
      prompt: 'Nennt je ein Argument dafür und eines dagegen, dass Deutschland nach dem Krieg von anderen Staaten kontrolliert wurde.\n\nNotiert eure Argumente und vergleicht sie mit einem anderen Paar.'
    },
    reflection: {
      prompt: 'Wie würdest du dich fühlen, wenn andere Länder plötzlich über dein Land und dein Leben entscheiden?'
    },
    lifeWorldConnection: 'Die Station fragt nach Mitbestimmung: Wie wichtig ist es, selbst über Regeln und Politik mitbestimmen zu können?',
    interactiveExercises: [
      {
        id: 's2_ex1',
        type: 'dragAndDrop',
        prompt: 'Ordne die vier Siegermächte den richtigen Zonen zu.',
        targets: ['Amerikanische Zone', 'Britische Zone', 'Französische Zone', 'Sowjetische Zone'],
        items: [
          { text: 'USA', correct: 'Amerikanische Zone' },
          { text: 'Großbritannien', correct: 'Britische Zone' },
          { text: 'Frankreich', correct: 'Französische Zone' },
          { text: 'Sowjetunion', correct: 'Sowjetische Zone' }
        ]
      },
      {
        id: 's2_ex2',
        type: 'fillInTheBlank',
        prompt: 'Ergänze den Lückentext.',
        template: 'Nach dem Krieg wurde Deutschland in [BLANK1] Besatzungszonen aufgeteilt. Berlin war ein besonderer Ort, weil [BLANK2].',
        answers: [
          { id: 'b1', correct: 'vier', accept: ['4', 'vier', '4 '] },
          { id: 'b2', correct: 'es selbst auch in vier Teile aufgeteilt wurde', accept: ['es selbst aufgeteilt', 'die Stadt aufgeteilt wurde', 'auch geteilt', 'mitten in der sowjetischen Zone lag'] }
        ]
      }
    ],
    sources: [
      { label: 'bpb: Deutschland unter alliierter Besatzung', url: 'https://www.bpb.de/themen/nachkriegszeit' },
      { label: 'DHM: Besatzungszonen', url: 'https://www.dhm.de/lemo/kapitel/nachkriegsjahre' }
    ]
  },

  /* -------- STATION 3: Luftbrücke – Hoffnung -------- */
  {
    id: 'station_3',
    title: 'Die Menschen schauen nach oben – Hoffnung in Berlin',
    shortTitle: 'Hoffnung am Himmel',
    image: 'img_tempelhof_people',
    guidingQuestion: 'Warum wurden Flugzeuge für viele Menschen in Berlin zu einem Hoffnungszeichen?',
    introText: '1948 sperrte die Sowjetunion viele Wege nach West-Berlin. Die Menschen dort brauchten aber weiter Lebensmittel, Kohle und andere wichtige Dinge. Deshalb versorgten die Westmächte (USA, Großbritannien, Frankreich) die Stadt mit Flugzeugen. Für viele Berliner:innen wurden die Flugzeuge zu einem Zeichen von Hoffnung und Hilfe.',
    learningGoals: [
      'Bildbeobachtungen gezielt formulieren',
      'Den Zusammenhang zwischen Blockade und Versorgung erklären',
      'Hoffnung als historische Erfahrung deuten'
    ],
    hotspots: [
      {
        id: 's3_h1',
        type: 'info',
        label: 'Flugzeug am Himmel',
        position: { x: 0.60, y: 0.44 },
        title: 'Das Symbol der Luftbrücke',
        content: 'Dieses Flugzeug steht für die Berliner Luftbrücke. Mit solchen Maschinen wurden täglich wichtige Güter nach West-Berlin gebracht – Kohle, Lebensmittel, Medikamente. Die Flugzeuge kamen in kurzen Abständen, Tag und Nacht.'
      },
      {
        id: 's3_h2',
        type: 'task',
        label: 'Menschenmenge',
        position: { x: 0.18, y: 0.55 },
        title: 'Bildbeobachtung',
        content: 'Die Menschen auf dem Bild schauen alle in dieselbe Richtung – nach oben, zum Flugzeug.',
        task: 'Was sagt dir das über die Bedeutung der Flugzeuge für die Menschen in Berlin?'
      },
      {
        id: 's3_h3',
        type: 'info',
        label: 'Tempelhof',
        position: { x: 0.78, y: 0.73 },
        title: 'Flughafen Tempelhof',
        content: 'Tempelhof war einer der wichtigsten Flughäfen der Luftbrücke. Hier landeten die Versorgungsflugzeuge und wurden sofort entladen. Der Betrieb lief ohne Unterbrechung.'
      },
      {
        id: 's3_h4',
        type: 'reflection',
        label: 'Kinder in der Krise',
        position: { x: 0.83, y: 0.32 },
        title: 'Kinder und Hoffnung',
        content: 'Auch Kinder erlebten die Blockade mit. Für viele war unklar, wie es weitergehen würde. Die Flugzeuge bedeuteten für manche Kinder Versorgung, für andere Spannung und Abenteuer.',
        task: 'Was könnte ein Kind in dieser Situation gedacht oder gefühlt haben?'
      }
    ],
    requiredTasks: [
      {
        id: 's3_rt1',
        format: 'shortText',
        prompt: '1. Beschreibe, was die Menschen auf dem Bild tun und wie sie wirken. Nutze mindestens 3 Beobachtungen.'
      },
      {
        id: 's3_rt2',
        format: 'shortText',
        prompt: '2. Erkläre, warum die Flugzeuge für West-Berlin so wichtig waren. Was wäre ohne sie passiert?'
      },
      {
        id: 's3_rt3',
        format: 'sentenceStarter',
        starter: 'Dieses Bild zeigt Hoffnung, weil …',
        prompt: 'Vervollständige den Satz und begründe ihn.'
      }
    ],
    extraTasks: [
      {
        id: 's3_et1',
        format: 'sentenceStarter',
        starter: 'Wenn ich damals in Berlin gewesen wäre, hätte ich …',
        prompt: 'Wie hättest du auf die Situation reagiert?'
      }
    ],
    collaboration: {
      title: 'Austauschauftrag',
      prompt: 'Besprecht zu zweit folgende Fragen:\n\n• Warum ist Hoffnung in Krisen wichtig?\n• Reicht Hoffnung allein aus – oder braucht man noch mehr?\n\nNotiert euch je einen wichtigen Gedanken aus dem Gespräch.'
    },
    reflection: {
      prompt: 'Wie würdest du dich fühlen, wenn deine Stadt nur noch aus der Luft versorgt werden könnte? Was würdest du vermissen?'
    },
    lifeWorldConnection: 'Was hilft Menschen, wenn der Alltag unsicher wird? Hoffnung, Gemeinschaft, Verlässlichkeit – all das zeigt dieses Bild.',
    interactiveExercises: [
      {
        id: 's3_ex1',
        type: 'multipleChoice',
        prompt: 'Warum war West-Berlin in Gefahr? (Mehrere Antworten möglich)',
        options: [
          { text: 'Weil es keine Schulen mehr gab', correct: false },
          { text: 'Weil wichtige Zufahrtswege blockiert wurden', correct: true },
          { text: 'Weil die Menschen die Stadt sofort verlassen mussten', correct: false },
          { text: 'Weil die Versorgung mit Lebensmitteln und Kohle schwierig wurde', correct: true }
        ],
        feedbackCorrect: 'Richtig! Die sowjetische Blockade machte die Land- und Wasserversorgung West-Berlins unmöglich – deshalb war die Luftbrücke so wichtig.',
        feedbackPartial: 'Überlege noch einmal, was „Blockade" für eine Stadt bedeutet. Was ist gesperrt worden?'
      }
    ],
    sources: [
      { label: 'bpb: Berliner Blockade und Luftbrücke', url: 'https://www.bpb.de/kurz-knapp/hintergrund-aktuell/39598' },
      { label: 'Bundeszentrale: Luftbrücke für Schüler', url: 'https://www.bpb.de/kurz-knapp/lexika/politiklexikon/17801' }
    ]
  },

  /* -------- STATION 4: Rosinenbomber -------- */
  {
    id: 'station_4',
    title: 'Rosinenbomber – Wie die Luftbrücke funktionierte',
    shortTitle: 'Rosinenbomber',
    image: 'img_tempelhof_planes',
    secondaryImage: 'img_airlift_alt',
    guidingQuestion: 'Wie konnte eine ganze Stadt aus der Luft versorgt werden?',
    introText: 'Während der Berlin-Blockade brachten Flugzeuge Tag und Nacht wichtige Güter nach West-Berlin. Sie transportierten vor allem Kohle, Lebensmittel und Medikamente. Manche Pilot:innen warfen für Kinder kleine Süßigkeiten an kleinen Fallschirmen ab. Deshalb nannten die Kinder diese Flugzeuge liebevoll „Rosinenbomber".',
    learningGoals: [
      'Erklären, was mit den Flugzeugen transportiert wurde',
      'Die Luftbrücke als logistische und politische Leistung beschreiben',
      'Den Begriff „Rosinenbomber" erklären'
    ],
    hotspots: [
      {
        id: 's4_h1',
        type: 'info',
        label: 'Flugzeuge im Dauerbetrieb',
        position: { x: 0.27, y: 0.56 },
        title: 'Rund um die Uhr',
        content: 'Die Flugzeuge landeten in kurzem Abstand – manchmal alle drei Minuten. Alles musste schnell gehen. Das erforderte präzise Planung und viel Personal. Über 270.000 Flüge wurden während der Luftbrücke durchgeführt.'
      },
      {
        id: 's4_h2',
        type: 'task',
        label: 'Ladung und Kisten',
        position: { x: 0.18, y: 0.73 },
        title: 'Versorgung statt Reise',
        content: 'Die Flugzeuge waren nicht für Reisen da, sondern für Versorgung. Kisten mit lebenswichtigen Gütern wurden ein- und ausgeladen.',
        task: 'Was könnte in diesen Kisten gewesen sein? Schreibe deine Vermutungen auf.'
      },
      {
        id: 's4_h3',
        type: 'info',
        label: 'Flughafen Tempelhof',
        position: { x: 0.72, y: 0.42 },
        title: 'Der wichtigste Knotenpunkt',
        content: 'Der Flughafen Tempelhof war das Zentrum der Luftbrücke in West-Berlin. Hier wurden Hunderte Tonnen an Gütern täglich umgeschlagen. Der Betrieb lief ohne Unterbrechung, auch nachts und bei schlechtem Wetter.'
      },
      {
        id: 's4_h4',
        type: 'source',
        label: 'Rosinenbomber',
        position: { x: 0.52, y: 0.18 },
        title: 'Woher kommt der Name „Rosinenbomber"?',
        content: 'US-Pilot Gail Halvorsen beobachtete Kinder am Flughafenzaun. Er warf ihnen Schokolade und Kaugummi an kleinen Taschentuch-Fallschirmen ab. Andere Pilot:innen machten mit. Die Kinder nannten diese Flugzeuge „Rosinenbomber" oder „Candy Bomber". Das wurde zum Symbol für Freundschaft in der Krise.'
      },
      {
        id: 's4_h5',
        type: 'reflection',
        label: 'Politische Bedeutung',
        position: { x: 0.86, y: 0.70 },
        title: 'Mehr als nur Technik',
        content: 'Die Luftbrücke zeigte der Welt: Die Westmächte wollten West-Berlin nicht aufgeben. Es war nicht nur eine logistische Leistung – es war ein politisches Signal: „Wir lassen euch nicht im Stich."',
        task: 'Warum können technische Lösungen manchmal auch politische Bedeutung haben?'
      }
    ],
    requiredTasks: [
      {
        id: 's4_rt1',
        format: 'shortText',
        prompt: '1. Erkläre in 3 Sätzen, warum die Luftbrücke so wichtig war – sowohl für die Versorgung als auch politisch.'
      },
      {
        id: 's4_rt2',
        format: 'shortText',
        prompt: '2. Erkläre den Begriff „Rosinenbomber". Was steckt dahinter – und was sagt das über die Beziehung zwischen Berlinern und Alliierten?'
      },
      {
        id: 's4_rt3',
        format: 'shortText',
        prompt: '3. Was war schwieriger: die technische Logistik der Luftbrücke oder die politische Entscheidung, sie durchzuführen? Begründe deine Meinung.'
      }
    ],
    extraTasks: [
      {
        id: 's4_et1',
        format: 'judgement',
        prompt: 'War die Luftbrücke eher eine technische Leistung oder ein politisches Zeichen? Schreibe einen kurzen Aufsatz (5–8 Sätze) und nimm eine klare Position ein.'
      }
    ],
    collaboration: {
      title: 'Partnerauftrag',
      prompt: 'Einigt euch auf eine gemeinsame Antwort:\n\nWas war wichtiger – die Versorgung selbst oder das politische Signal?\n\nBegründet eure Entscheidung gemeinsam und präsentiert sie der Klasse in 2–3 Sätzen.'
    },
    reflection: {
      prompt: 'Warum können technische Lösungen manchmal auch politische Bedeutung haben? Fällt dir ein Beispiel aus der Gegenwart ein?'
    },
    lifeWorldConnection: 'Was passiert, wenn Verkehrswege ausfallen oder die Versorgung unterbrochen wird? Stell dir vor, was das für dein Alltagsleben bedeuten würde.',
    interactiveExercises: [
      {
        id: 's4_ex1',
        type: 'multipleChoice',
        prompt: 'Was wurde nach Berlin eingeflogen? (Mehrere Antworten richtig)',
        options: [
          { text: 'Kohle zum Heizen', correct: true },
          { text: 'Lebensmittel (Mehl, Milchpulver, Konserven)', correct: true },
          { text: 'Medikamente', correct: true },
          { text: 'Urlauber und Touristen', correct: false }
        ],
        feedbackCorrect: 'Richtig! Kohle, Lebensmittel und Medikamente waren die wichtigsten Güter. West-Berlin brauchte täglich Hunderte Tonnen, um die Bevölkerung zu versorgen.'
      },
      {
        id: 's4_ex2',
        type: 'timeline',
        prompt: 'Ordne die Ereignisse der Berliner Luftbrücke in die richtige Reihenfolge. Nutze die Pfeile zum Verschieben.',
        items: [
          'Die Sowjetunion blockiert alle Land- und Wasserwege nach West-Berlin',
          'Die Westmächte beginnen die Luftbrücke',
          'Täglich landen Hunderte Flugzeuge – Versorgung läuft',
          'Die Sowjetunion beendet die Blockade'
        ],
        correctOrder: [0, 1, 2, 3]
      }
    ],
    sources: [
      { label: 'bpb: Berliner Luftbrücke', url: 'https://www.bpb.de/kurz-knapp/hintergrund-aktuell/39598' },
      { label: 'Deutsches Historisches Museum: Rosinenbomber', url: 'https://www.dhm.de/lemo/kapitel/nachkriegsjahre/westzonen/berlin-blockade-und-luftbruecke.html' }
    ]
  },

  /* -------- STATION 5: BRD und DDR -------- */
  {
    id: 'station_5',
    title: 'BRD und DDR – Deutschland wird geteilt',
    shortTitle: 'Zwei Staaten',
    image: 'img_brd_ddr',
    guidingQuestion: 'Warum entstanden zwei deutsche Staaten?',
    introText: 'Aus den Spannungen zwischen Ost und West entstanden 1949 zwei deutsche Staaten: die Bundesrepublik Deutschland (BRD) im Westen und die Deutsche Demokratische Republik (DDR) im Osten. Beide Staaten hatten sehr unterschiedliche politische Systeme. Damit war Deutschland nicht nur besetzt, sondern nun auch dauerhaft politisch geteilt.',
    learningGoals: [
      'BRD und DDR als zwei Staaten benennen',
      'Grundlegende politische Unterschiede erklären',
      'Auswirkungen auf den Alltag erschließen'
    ],
    hotspots: [
      {
        id: 's5_h1',
        type: 'info',
        label: 'BRD',
        position: { x: 0.26, y: 0.54 },
        title: 'Die Bundesrepublik Deutschland (BRD)',
        content: 'Die BRD entstand 1949 im Westen. Die Hauptstadt war Bonn. Es entwickelte sich eine parlamentarische Demokratie mit freien Wahlen, Grundrechten und Meinungsfreiheit. Das Grundgesetz sicherte die Rechte der Bürger:innen.'
      },
      {
        id: 's5_h2',
        type: 'info',
        label: 'DDR',
        position: { x: 0.70, y: 0.38 },
        title: 'Die Deutsche Demokratische Republik (DDR)',
        content: 'Die DDR entstand 1949 im Osten. Die SED (Sozialistische Einheitspartei Deutschlands) kontrollierte den Staat. Es gab keine freien Wahlen, die Meinungsfreiheit war stark eingeschränkt, und ein Geheimdienst (Stasi) überwachte die Bevölkerung.'
      },
      {
        id: 's5_h3',
        type: 'task',
        label: 'Berlin als Konfliktort',
        position: { x: 0.56, y: 0.49 },
        title: 'Berlin – immer noch im Zentrum',
        content: 'Berlin blieb auch nach 1949 ein Sonderfall: Die Stadt lag tief in der DDR, war aber selbst in Ost- und West-Berlin geteilt. Das führte immer wieder zu Spannungen.',
        task: 'Warum war Berlin auch nach der Gründung von BRD und DDR weiter ein Konfliktort?'
      },
      {
        id: 's5_h4',
        type: 'task',
        label: 'Unterschiede Ost/West',
        position: { x: 0.46, y: 0.21 },
        title: 'Alltag im Ost-West-Vergleich',
        content: 'Die beiden Staaten unterschieden sich nicht nur politisch, sondern auch im Wirtschaftssystem und im Alltag der Menschen.',
        task: 'Notiere mindestens zwei Unterschiede zwischen BRD und DDR, die du bisher gelernt hast.'
      },
      {
        id: 's5_h5',
        type: 'reflection',
        label: 'Politische Systeme',
        position: { x: 0.84, y: 0.78 },
        title: 'Alltag und Politik',
        content: 'Wenn Menschen in verschiedenen politischen Systemen leben, prägt das ihren Alltag stark: Welche Nachrichten sie sehen, wohin sie reisen dürfen, was sie sagen können – das alles hängt vom politischen System ab.',
        task: 'Was könnte für Jugendliche im Alltag in der DDR anders gewesen sein als in der BRD?'
      }
    ],
    requiredTasks: [
      {
        id: 's5_rt1',
        format: 'shortText',
        prompt: '1. Erkläre in 2–3 Sätzen, warum Deutschland 1949 in zwei Staaten geteilt wurde.'
      },
      {
        id: 's5_rt2',
        format: 'shortText',
        prompt: '2. Beschreibe einen Unterschied zwischen BRD und DDR im politischen System und einen Unterschied im Alltag der Menschen.'
      },
      {
        id: 's5_rt3',
        format: 'shortText',
        prompt: '3. Warum ist es wichtig, in einem Staat Rechte, Freiheit und Mitbestimmung zu sichern? Erkläre anhand des historischen Beispiels.'
      }
    ],
    extraTasks: [
      {
        id: 's5_et1',
        format: 'reflection',
        prompt: 'Was könnte für Jugendliche im Alltag unterschiedlich gewesen sein, wenn sie in der BRD oder in der DDR gelebt hätten? Nenne mindestens 3 Beispiele (z.B. Schule, Reisen, Medien).'
      }
    ],
    collaboration: {
      title: 'Gruppenauftrag',
      prompt: 'Sammelt gemeinsam Beispiele zu diesen Lebensbereichen:\n\n• Schule\n• Reisen\n• Politische Meinung\n• Mitbestimmung\n• Medien / Nachrichten\n\nWo würden Unterschiede im Alltag zwischen BRD und DDR besonders schnell sichtbar werden?'
    },
    reflection: {
      prompt: 'Welche Rechte erlebst du heute als selbstverständlich – die du aber in der DDR nicht gehabt hättest?'
    },
    lifeWorldConnection: 'Demokratie bedeutet: Du kannst wählen, deine Meinung sagen, reisen und mitbestimmen. Das ist keine Selbstverständlichkeit.',
    interactiveExercises: [
      {
        id: 's5_ex1',
        type: 'dragAndDrop',
        prompt: 'Ordne die Begriffe den richtigen Staaten zu – BRD oder DDR.',
        targets: ['BRD', 'DDR'],
        items: [
          { text: 'Demokratie', correct: 'BRD' },
          { text: 'Einparteienherrschaft (SED)', correct: 'DDR' },
          { text: 'Bonn (Hauptstadt)', correct: 'BRD' },
          { text: 'Ost-Berlin (Hauptstadt)', correct: 'DDR' },
          { text: 'Grundgesetz', correct: 'BRD' },
          { text: 'Stasi (Geheimpolizei)', correct: 'DDR' }
        ]
      },
      {
        id: 's5_ex2',
        type: 'trueFalse',
        prompt: 'Richtig oder falsch? Bewertet jede Aussage.',
        statements: [
          { text: '1949 entstand nur ein einziger deutscher Staat.', correct: false, explanation: 'Falsch! Es entstanden zwei Staaten: BRD im Westen und DDR im Osten.' },
          { text: 'BRD und DDR hatten dasselbe politische System.', correct: false, explanation: 'Falsch! Die BRD war eine Demokratie, die DDR ein sozialistischer Einparteienstaat.' },
          { text: 'Die Teilung Deutschlands war eng mit dem Ost-West-Konflikt verbunden.', correct: true, explanation: 'Richtig! Der Konflikt zwischen den USA und der Sowjetunion führte zur dauerhaften Teilung.' }
        ]
      }
    ],
    sources: [
      { label: 'bpb: BRD und DDR im Vergleich', url: 'https://www.bpb.de/themen/deutschlandarchiv' },
      { label: 'Bundeszentrale: DDR für Schüler', url: 'https://www.bpb.de/kurz-knapp/lexika/politiklexikon/17347' }
    ]
  },

  /* -------- STATION 6: Mauer und Grenze -------- */
  {
    id: 'station_6',
    title: 'Grenze durch Berlin – sichtbare Teilung',
    shortTitle: 'Grenze und Mauer',
    image: 'img_mauer',
    guidingQuestion: 'Wie wurde aus einem politischen Konflikt eine sichtbare Grenze?',
    introText: 'Die Spannungen zwischen Ost und West wurden immer stärker. Immer mehr DDR-Bürger:innen verließen die DDR über West-Berlin – allein 1961 waren es Hunderttausende. Am 13. August 1961 ließ die DDR-Führung eine Mauer bauen. Über Nacht wurde Berlin geteilt. Die Berliner Mauer stand bis 1989 – und wurde zum Symbol für Trennung, Kontrolle und fehlende Freiheit.',
    learningGoals: [
      'Grenzen als Eingriff in den Alltag verstehen',
      'Die Mauer als Symbol des Kalten Krieges deuten',
      'Folgen für Familien und Freundschaften benennen'
    ],
    hotspots: [
      {
        id: 's6_h1',
        type: 'info',
        label: 'Brandenburger Tor',
        position: { x: 0.26, y: 0.60 },
        title: 'Das Brandenburger Tor – Symbol der Teilung',
        content: 'Das Brandenburger Tor in Berlin wurde zum bekanntesten Symbol der deutschen Teilung. Es lag direkt an der Grenze zwischen Ost- und West-Berlin und war jahrzehntelang nicht zugänglich. Erst 1989, mit dem Fall der Mauer, wurde es wieder ein Symbol – diesmal für die Wiedervereinigung.'
      },
      {
        id: 's6_h2',
        type: 'task',
        label: 'Grenzlinie mitten durch die Stadt',
        position: { x: 0.48, y: 0.68 },
        title: 'Grenze mitten durch Berlin',
        content: 'Die Mauer teilte Berlin in zwei Hälften. Familien wurden voneinander getrennt, Wege wurden unterbrochen, Freundschaften rissen ab.',
        task: 'Beschreibe, was eine Grenze mitten durch eine Stadt für die Menschen bedeutete, die dort lebten.'
      },
      {
        id: 's6_h3',
        type: 'task',
        label: 'Unterbrochene Straßen',
        position: { x: 0.70, y: 0.74 },
        title: 'Plötzlich keine Verbindung mehr',
        content: 'Wege, Straßen und öffentliche Verkehrsmittel wurden von einem Tag auf den anderen unterbrochen. Menschen, die im Osten arbeiteten und im Westen wohnten – oder umgekehrt – konnten plötzlich nicht mehr pendeln.',
        task: 'Welche Folgen hätte das für Schule, Arbeit oder Familie, wenn du plötzlich nicht mehr auf die andere Seite der Stadt kommen könntest?'
      },
      {
        id: 's6_h4',
        type: 'reflection',
        label: 'Trennung von Menschen',
        position: { x: 0.80, y: 0.28 },
        title: 'Mehr als eine Linie auf der Karte',
        content: 'Eine Grenze trennt nicht nur Orte, sondern auch Menschen. Eltern, Kinder, Geschwister, Freunde – viele sahen sich jahrzehntelang nicht oder nur unter strengen Bedingungen.',
        task: 'Was wäre für dich am schlimmsten, wenn du Freund:innen oder Familie plötzlich nicht mehr erreichen könntest?'
      }
    ],
    requiredTasks: [
      {
        id: 's6_rt1',
        format: 'shortText',
        prompt: '1. Beschreibe das Bild in 3 Sätzen. Was siehst du? Was fällt dir auf?'
      },
      {
        id: 's6_rt2',
        format: 'shortText',
        prompt: '2. Erkläre, welche Folgen eine Grenze mitten durch eine Stadt für die Menschen hatte. Nenne mindestens 3 konkrete Folgen.'
      },
      {
        id: 's6_rt3',
        format: 'shortText',
        prompt: '3. Erkläre, warum die Berliner Mauer zum Symbol des Kalten Krieges wurde. Was hat sie für die Welt bedeutet?'
      }
    ],
    extraTasks: [
      {
        id: 's6_et1',
        format: 'judgement',
        prompt: 'Kann ein Staat Sicherheit schützen, wenn er dafür die Freiheit der Menschen stark einschränkt? Schreibe deine Meinung in 4–6 Sätzen – und beziehe das historische Beispiel der Berliner Mauer mit ein.'
      }
    ],
    collaboration: {
      title: 'Partneraustausch',
      prompt: 'Diskutiert miteinander:\n\n„Ist Sicherheit wichtiger als Freiheit – oder Freiheit wichtiger als Sicherheit?"\n\nNutzt das historische Beispiel als Grundlage. Notiert je ein Argument für eure Seite und teilt eure Ergebnisse mit der Klasse.'
    },
    reflection: {
      prompt: 'Was zeigt dieses Bild über die Folgen politischer Entscheidungen für das Leben einzelner Menschen? Was nimmst du aus dieser Station mit?'
    },
    lifeWorldConnection: 'Wo erleben wir Grenzen heute – physisch oder unsichtbar? Wann schützen Regeln Menschen, und wann schränken sie sie zu stark ein?',
    interactiveExercises: [
      {
        id: 's6_ex1',
        type: 'multipleChoice',
        prompt: 'Welche Folgen hatte die Berliner Mauer? (Mehrere Antworten richtig)',
        options: [
          { text: 'Familien wurden voneinander getrennt', correct: true },
          { text: 'Straßen und Verbindungen wurden unterbrochen', correct: true },
          { text: 'Reisen zwischen Ost und West wurden stark erschwert', correct: true },
          { text: 'Menschen konnten frei zwischen Ost und West pendeln', correct: false }
        ],
        feedbackCorrect: 'Richtig! Die Mauer hat das Leben der Berliner:innen radikal verändert – Familien wurden getrennt, Wege unterbrochen, Freiheit eingeschränkt.'
      },
      {
        id: 's6_ex2',
        type: 'sentenceStarter',
        starter: 'Die Berliner Mauer wurde zu einem Symbol des Kalten Krieges, weil …',
        prompt: 'Vervollständige den Satz und erkläre in 2–3 weiteren Sätzen, was du meinst.'
      }
    ],
    sources: [
      { label: 'bpb: Berliner Mauer', url: 'https://www.bpb.de/themen/deutschlandarchiv/507184' },
      { label: 'Stiftung Berliner Mauer', url: 'https://www.berliner-mauer-gedenkstaette.de' }
    ]
  }
];

/* ============================================================
   CHECK-OUT
   ============================================================ */
const CHECK_OUT = {
  title: 'Check-out – Was hast du gelernt?',
  subtitle: 'Schau zurück auf deine Bildreise und überprüfe, was du jetzt weißt.',
  quiz: [
    { id: 'q1', question: 'Warum war Deutschland nach 1945 in einer so schwierigen Lage?' },
    { id: 'q2', question: 'Wer verwaltete Deutschland nach dem Krieg – und in wie viele Zonen wurde es aufgeteilt?' },
    { id: 'q3', question: 'Was war die Berliner Luftbrücke? Erkläre in 2–3 Sätzen.' },
    { id: 'q4', question: 'Welche zwei deutschen Staaten entstanden 1949 – und was war der wichtigste Unterschied zwischen ihnen?' },
    { id: 'q5', question: 'Warum wurde die Berliner Mauer zu einem Symbol des Kalten Krieges?' }
  ],
  timeline: [
    'Kriegsende 1945 – Deutschland ist zerstört',
    'Besatzungszonen – Siegermächte übernehmen die Kontrolle',
    'Berlin-Blockade und Luftbrücke 1948/49',
    'Gründung von BRD und DDR 1949',
    'Bau der Berliner Mauer 1961 – sichtbare Teilung'
  ],
  selfAssessment: [
    { id: 'sa1', text: 'Ich kann beschreiben, wie Deutschland nach 1945 aussah.', emojis: ['😕', '🤔', '😊'] },
    { id: 'sa2', text: 'Ich kann die Besatzungszonen und die vier Siegermächte erklären.', emojis: ['😕', '🤔', '😊'] },
    { id: 'sa3', text: 'Ich kann erklären, was die Berliner Luftbrücke war.', emojis: ['😕', '🤔', '😊'] },
    { id: 'sa4', text: 'Ich kann BRD und DDR unterscheiden.', emojis: ['😕', '🤔', '😊'] },
    { id: 'sa5', text: 'Ich kann erklären, warum die Teilung für Menschen so schwer war.', emojis: ['😕', '🤔', '😊'] }
  ],
  reflectionPrompts: [
    'Was hat dich am meisten überrascht auf dieser Bildreise?',
    'Welche Station fandest du am eindrücklichsten – und warum?',
    'Was hat dieses Thema mit Freiheit, Grenzen und Zusammenleben heute zu tun?'
  ],
  transferPrompt: 'Wo gibt es heute noch Grenzen, Konflikte oder Spaltungen, die das Leben von Menschen stark beeinflussen?'
};

/* ============================================================
   TEACHER PAGE DATA
   ============================================================ */
const TEACHER_DATA = {
  learningGoals: [
    'Lernende können die Nachkriegssituation Deutschlands beschreiben',
    'Lernende können die vier Besatzungszonen und Siegermächte benennen',
    'Lernende können die Berliner Luftbrücke in ihrem Kontext erklären',
    'Lernende können BRD und DDR politisch unterscheiden',
    'Lernende können die Bedeutung der Berliner Mauer deuten',
    'Lernende können Bezüge zwischen Vergangenheit und Gegenwart herstellen'
  ],
  lehrplanbezug: 'Geschichte 8. Klasse, Mittelschule Bayern – LehrplanPLUS: Lernbereich 3: Die Welt nach dem Zweiten Weltkrieg',
  methodenhinweise: [
    'Die Bildreise eignet sich für Einzel- und Partnerarbeit',
    'Kooperationsaufgaben sind entsprechend markiert',
    'Antworten werden lokal im Browser gespeichert (keine Anmeldung nötig)',
    'Lernende können das Journal drucken oder als PDF speichern',
    'Pflichtaufgaben: klar markiert; Zusatzaufgaben: optional für schnellere Lernende'
  ],
  zeitrahmen: 'ca. 2 Unterrichtsstunden (Doppelstunde) oder 3×45 Minuten aufgeteilt auf mehrere Stunden'
};
