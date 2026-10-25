// Ne Pas Déranger — la partie vue depuis un gouvernement d'extrême droite (programme « L'Ordre »).
// Ici, le curseur est poussé au bout : chaque proposition vient du réel, et un polémiste encore plus à droite,
// Hugues de Souche, surenchérit à chaque semaine. Le jeu ne récompense rien : il montre où ça mène.
// Clins d'œil au réel : « On est chez nous », la loi de 1803 sur les prénoms (2021), le ministère de la Remigration (2022),
// les binationaux écartés des « postes sensibles » (2024), le démontage des éoliennes, la privatisation de l'audiovisuel public,
// l'affaire des assistants parlementaires européens et le « gouvernement des juges » (2025), le prêt d'une banque russe (2014),
// le référendum de l'article 11 pour contourner le Parlement, la sortie de la CEDH, la TVA à 5,5 % sur l'énergie.
// Chaque message garde une réponse « dédiabolisée » ou humaniste pour pouvoir trahir son camp.

(() => {
  const C = window.CONTENT;
  const P = "ordre";
  const passed = (S, id) => !!S.laws[id] && ["adopted", "493"].includes(S.laws[id].status);
  const all = () => [...C.events, ...C.pool, ...(C.alerts || [])];
  const V = (id, v) => { const e = all().find(x => x.id === id); e.variants = { ...(e.variants || {}), [P]: v.c ? { ov: false, ...v } : v }; };

  Object.assign(C.contacts, {
    souche: { name: "Hugues de Souche", role: "Polémiste, « plus patriote que toi »", av: "📜", col: "#3b2f2f" },
    ue: { name: "Commission de l’Union", role: "Bruxelles", av: "⭐", col: "#1f3a93" },
  });

  // ---------------------------------------------------------------- LES SEMAINES
  C.weeksBy = C.weeksBy || {};
  C.weeksBy[P] = {
    1: { title: "Le Grand Ménage", agenda: ["Lun — Premier Conseil des ministres « patriote »", "Jeu — Les ambassadeurs ne rappellent pas"] },
    2: { title: "Jeudi Noir", agenda: ["Jeu — Grande marche contre l’extrême droite", "Ven — Dîner avec le patronat (qui hésite)"] },
    4: { title: "Le Climat ? Quel Climat ?", agenda: ["Lun — Vigilance rouge sur tout le Sud", "Mer — Moratoire sur les éoliennes"] },
    5: { title: "L’Affaire des Assistants", agenda: ["Mar — L’Écho publie", "Jeu — Le Conseil constitutionnel se prononce"] },
    6: { title: "La Remigration", agenda: ["Lun — Émeutes en banlieue", "Mer — Hugues de Souche présente son « plan »"] },
    7: { title: "L’Article 7", agenda: ["Mar — Bruxelles gèle les fonds", "Jeu — Débat télévisé"] },
  };

  // ================================================================ SEMAINE 1
  V("w1_intro", {
    m: ["Félicitations Président. Le plafond de verre a cédé : 50,3 %. Les marchés ont perdu 6 %, Bruxelles convoque un sommet d’urgence, trois ambassadeurs ne répondent plus.",
        "Rappel : chaque réponse vide ta batterie 🔋. Quand elle meurt, tes ministres décident à ta place. Ils ont des idées.",
        "Règle n° 1 de la dédiabolisation : en public, on ne dit jamais « remigration ». On dit « retour ». Les réponses 🔓 peuvent fuiter."],
    c: [
      { t: "Compris. Cravate, sourire, chats.", cost: 2, r: "Parfait. J’ai commandé un calendrier avec tes chats. Il se vend mieux que le programme." },
      { t: "On dira ce qu’on pense. On est chez nous.", cost: 2, r: "Le chant de meeting dès le premier SMS. Les éditorialistes vont avoir du travail. Et les avocats.",
        fx: { retraites: 1, jeunes: -3, overton: 2 }, set: { onEstChezNous: true } },
    ],
  });

  V("w1_maman", {
    m: ["Mon chéri, tu passes à la télé jeudi ? Mets la cravate bleu marine.",
        "Et ne parle pas de ton grand-père. Tu sais pourquoi."],
  });

  V("w1_josy", {
    m: ["Josy Martel, Union des Travailleurs Fatigués. On ne négociera pas avec un gouvernement d’extrême droite.",
        "Grande marche jeudi. Syndicats, associations, étudiants. Toute la France qui ne vous a pas élu, et un peu celle qui l’a fait."],
    c: [
      { t: "Venez négocier à l’Élysée. La porte est ouverte.", cost: 8, r: "On viendra. On fouillera nous-mêmes les couloirs.",
        fx: { colere: -6, ouvriers: 4, overton: -1 }, set: { negoW1: true } },
      { t: "Les syndicats sont des officines gauchistes.", cost: 5, r: "Les officines gauchistes ont six millions d’adhérents. Rendez-vous jeudi.",
        fx: { colere: 8, ouvriers: -6, retraites: 2, overton: 3 } },
      { t: "Je vais dissoudre l’UTF.", cost: 5, r: "Essayez. On a survécu à pire. Enfin, nos grands-parents.",
        fx: { colere: 12, ouvriers: -10, police: 3, overton: 5 }, set: { menaceDissolution: true },
        news: "Le Président menace de dissoudre le premier syndicat du pays" },
    ],
    d: { r: "Pas de réponse. On s’y attendait. On marche jeudi.", fx: { colere: 5 } },
  });

  V("w1_prefet", {
    m: ["Préfet Garrot. Le ministre Lebâton me demande d’interdire la marche de jeudi « à titre préventif ». Et de dissoudre trois collectifs « antifas ».",
        "Je préviens : le tribunal administratif va casser l’interdiction. Mais ça prendra trois jours."],
    c: [
      { t: "Interdisez. Et dissolvez.", cost: 6, r: "Avec plaisir. Le tribunal cassera vendredi. La marche, elle, aura été interdite jeudi.",
        fx: { ordre: 8, police: 8, jeunes: -8, colere: 8, gav: 500, overton: 6 }, set: { repression: true, interdiction: true }, rel: { HI: -8, VP: -6 } },
      { t: "Dispositif léger. On laisse défiler.", cost: 6, r: "Léger. Le ministre Lebâton va me demander pourquoi. Je lui dirai que c’est vous.",
        fx: { ordre: -6, police: -8, colere: -4, jeunes: 3, overton: -2 }, set: { leger: true } },
      { t: "Faites ce qu’il faut.", cost: 4, r: "Avec plaisir, Président. Avec un immense plaisir.",
        fx: { ordre: 10, police: 10, colere: 10, gav: 600, overton: 6 }, set: { carteBlanche: true },
        leak: { p: 0.4, fx: { jeunes: -8, ouvriers: -5, colere: 8 }, news: "Le Président au préfet : « Faites ce qu’il faut. » Le préfet a fait." } },
    ],
    d: { r: "Pas de réponse. J’ai interdit. Le ministre m’a félicité. Ça m’inquiète.", fx: { ordre: 8, police: 8, jeunes: -8, colere: 8, gav: 500, overton: 6 }, set: { interdiction: true } },
  });

  V("w1_kevin", {
    m: ["yo le Président 🔥 c Kévin (3,2M d’abonnés)",
        "jte propose un live : une tournée des kebabs pour montrer que t’es pas raciste. 50k€ le placement"],
    c: [
      { t: "Banco.", cost: 6, r: "t’as demandé au patron si le kebab était « bien de chez nous ». 6M de vues. il t’a offert une canette quand même",
        fx: { jeunes: -2, retraites: 1 }, news: "Le Président en tournée des kebabs : « Je n’ai rien contre la sauce blanche »" },
      { t: "Plutôt un apéro saucisson-pinard.", cost: 5, r: "frère c’était un concept de 2010. t’es le président le plus vintage de l’histoire",
        fx: { retraites: 3, jeunes: -4, overton: 2 } },
      { t: "Non. Je suis le Président.", cost: 2, r: "ok monsieur le président de la France d’avant 🙄", fx: { jeunes: -2 } },
    ],
  });

  // ================================================================ SEMAINE 2
  V("w2_video_a", {
    m: ["🚨 Une vidéo cartonne : un CRS frappe un manifestant à terre. 4 millions de vues. #JeudiNoir",
        "Le ministre Lebâton propose de le décorer. On dit quoi ?"],
    c: [
      { t: "Il sera décoré. Soutien total à nos forces de l’ordre.", cost: 5, r: "La Légion d’honneur pour un coup de matraque. La médaille ne précise pas où il a frappé.",
        fx: { police: 10, retraites: 2, jeunes: -12, colere: 10, overton: 6 }, set: { decore: true },
        news: "Le CRS de la vidéo décoré par l’Élysée : « Un exemple pour la Nation »" },
      { t: "Il faut attendre l’enquête.", cost: 5, r: "L’enquête. Le ministre a déjà écrit la conclusion. Elle tient sur un post-it.",
        fx: { police: 4, jeunes: -6, colere: 6, overton: 2 } },
      { t: "Inacceptable. Suspension immédiate.", cost: 6, r: "Les syndicats de police ne comprennent plus rien. Hugues de Souche parle de « trahison ».",
        fx: { police: -12, jeunes: 8, colere: -6, overton: -3 }, image: { me: -1 },
        news: "Le Président d’extrême droite suspend un CRS : sa propre base sidérée" },
    ],
    d: { r: "Pas de réponse. Le ministre l’a décoré. Par défaut.", fx: { police: 8, jeunes: -10, colere: 8, overton: 5 }, set: { decore: true } },
  });

  // ================================================================ SEMAINE 3
  V("w3_rabot", {
    m: ["Président, M. Souverain. Les raffineries sont bloquées : grève reconductible « contre le gouvernement d’extrême droite ». 60 % des stations à sec.",
        "Le ministre Lebâton propose la réquisition, puis la dissolution du syndicat. Moi je propose de baisser la TVA sur l’essence. Ça coûte 12 milliards, mais c’était dans le programme."],
    c: [
      { t: "Réquisition. Et dissolution de l’UTF.", cost: 8, r: "Réquisitionnés. Dissous. Le syndicat se reforme sous un autre nom en 48 heures. Il s’appelle « UTF ».",
        fx: { ordre: 8, police: 4, ouvriers: -12, colere: 10, gav: 300, overton: 6 }, set: { requisition: true, menaceDissolution: true },
        news: "Réquisition des raffineries et dissolution du premier syndicat du pays" },
      { t: "TVA à 5,5 % sur l’essence. Casser la grève par le portefeuille.", cost: 6, r: "Les gens font le plein. Les grévistes, eux, continuent. Et le budget fond plus vite que les stocks.",
        fx: { budget: -10, ouvriers: 6, retraites: 4, eco: 3, colere: -6 }, news: "TVA à 5,5 % sur l’énergie : « Le pouvoir d’achat d’abord »" },
      { t: "On ouvre les stocks stratégiques.", cost: 8, r: "Les stocks de guerre. Pour aller au boulot. C’est une guerre, finalement.",
        fx: { budget: -6, colere: -3, ordre: 2 } },
    ],
    d: { r: "Sans instruction, le ministre Lebâton a réquisitionné. Et un peu plus.", fx: { ordre: 8, ouvriers: -10, colere: 9, overton: 5 }, set: { requisition: true } },
  });

  // ================================================================ SEMAINE 4
  V("w4_clemence", {
    m: ["Il faut aller sur place. Des bottes, un air grave, une main sur une épaule.",
        "Et prépare une explication. Notre programme dit que le réchauffement est « exagéré ». Le fleuve n’a pas lu le programme."],
    c: [
      { t: "J’y vais en bottes.", cost: 12, r: "Parfait. Les sinistrés t’ont parlé du climat. Tu as parlé des clandestins. Ils n’ont pas vu le lien.",
        fx: { retraites: 6, ouvriers: 3 }, news: "Le Président les pieds dans l’eau : « Je suis là »" },
      { t: "C’est la faute des normes européennes : on n’a plus le droit de curer les rivières.", cost: 4, r: "Les hydrologues ont fait un communiqué. Personne ne l’a lu. Ton tweet, si.",
        fx: { retraites: 3, jeunes: -4, eco: 2, overton: 2 }, news: "Inondations : le Président accuse « les normes de Bruxelles »" },
      { t: "Le climat a toujours changé.", cost: 3, r: "C’est vrai. Pas aussi vite, pas avec des villages dedans.",
        fx: { jeunes: -6, retraites: -2, eco: 2 } },
    ],
  });

  // ================================================================ SEMAINE 5 : l'affaire des assistants
  V("w5_chloe", {
    m: ["Chloé Ferrand, L’Écho. Ton parti a payé pendant dix ans ses employés avec l’argent du Parlement européen. 4 millions d’euros. Le parquet requiert l’inéligibilité de M. Souverain.",
        "On publie demain. Un commentaire ?"],
    c: [
      { t: "C’est le gouvernement des juges. Une tyrannie.", cost: 4, r: "La tyrannie des juges. Tu viens d’expliquer à la télé que la loi ne s’applique pas à toi. Tes électeurs ont applaudi.",
        fx: { retraites: -2, jeunes: -6, colere: 4, overton: 4 }, image: { me: -1 },
        news: "« Tyrannie des juges » : le Président attaque la justice après l’affaire des assistants" },
      { t: "M. Souverain démissionne. La justice passera.", cost: 6, r: "Un ministre d’extrême droite qui démissionne pour une affaire. Les éditorialistes ne savent plus quoi penser.",
        fx: { colere: -4, jeunes: 3, overton: -2 }, set: { rabotVire: true }, image: { me: 2 },
        news: "Affaire des assistants : M. Souverain démissionne" },
      { t: "Faites perquisitionner L’Écho. « Secret défense ».", cost: 5, r: "Les policiers sont déjà en bas. La presse internationale aussi. Elle filme.",
        fx: { ordre: 4, jeunes: -10, colere: 10, overton: 6 }, set: { perquisition: true }, image: { me: -3 },
        news: "Perquisition chez L’Écho : Reporters sans frontières parle d’un « tournant »" },
      { t: "Combien pour ne pas publier ?", cost: 4, r: "Merci. Je viens d’ajouter un paragraphe.",
        leak: { p: 0.95, soon: true, fx: { jeunes: -8, ouvriers: -8, retraites: -8, colere: 15 }, news: "EXCLUSIF : le Président tente d’acheter le silence de L’Écho" } },
    ],
    d: { r: "Pas de réponse. J’écris : « L’Élysée n’a pas souhaité répondre ». Mes lecteurs adorent.", fx: { retraites: -4, jeunes: -4, colere: 5 } },
  });

  // ================================================================ SEMAINE 6
  V("w6_prefet", {
    m: ["Banlieue Nord : émeutes après la mort d’un jeune de 17 ans lors d’un contrôle routier. Deuxième nuit, 300 voitures brûlées.",
        "Le ministre Lebâton propose l’armée, le couvre-feu, et l’expulsion des familles des émeutiers « quand elles sont étrangères »."],
    c: [
      { t: "Armée, couvre-feu, expulsions. Tout.", cost: 6, r: "Les blindés sont dans les rues. Les familles dans des centres. Le monde entier regarde. Tes électeurs aussi, et ils applaudissent.",
        fx: { ordre: 12, police: 8, jeunes: -16, colere: 14, gav: 2500, blesses: 300, overton: 10 }, set: { armee: true },
        news: "Émeutes : l’armée déployée, couvre-feu, premières familles expulsées" },
      { t: "Supprimer les allocations des parents d’émeutiers.", cost: 5, r: "Supprimées. Les émeutiers ont 15 ans. Leurs petites sœurs n’ont plus de cantine.",
        fx: { ordre: 4, retraites: 3, jeunes: -8, colere: 6, budget: 1, overton: 5 } },
      { t: "J’y vais. Je parle aux habitants. Et le policier sera suspendu.", cost: 12, r: "Ils t’ont jeté des œufs, puis ils t’ont écouté. Hugues de Souche t’a traité de « sous-préfet de Molenbeek ».",
        fx: { jeunes: 8, police: -8, colere: -8, retraites: -3, overton: -4 }, image: { me: -2 } },
    ],
    d: { r: "Pas d’instruction. Le ministre Lebâton a appliqué la doctrine. Toute la doctrine.", fx: { ordre: 8, jeunes: -12, colere: 12, gav: 1500, blesses: 200, overton: 8 }, set: { armee: true } },
  });

  V("w6_call_atlantique", {
    m: ["Hey buddy ! Finally a real leader in Europe ! You’re my favorite. Very strong. Like me.",
        "Petite chose : vous achetez nos avions F-55 ? 12 milliards. Pour un ami, je ne taxe pas le fromage. Pas trop."],
    c: [
      { t: "Deal. Entre patriotes.", cost: 4, r: "Great ! Les avions ne volent pas encore, mais ils ont des drapeaux partout.",
        fx: { budget: -12, police: 3, patrons: 4, eco: 3 }, news: "12 milliards d’avions : « Un partenariat entre patriotes »" },
      { t: "Non. On achète hexagonien. Souveraineté.", cost: 4, r: "Ok. Bye bye camembert. You’re not my favorite anymore.",
        fx: { patrons: -6, ouvriers: 2, retraites: 3 }, news: "Guerre du fromage : l’Union Atlantique taxe le camembert à 400 %" },
      { t: "Non. Nos vrais amis sont à l’Est.", cost: 4, r: "The East ? …I have to call someone. Bye.",
        fx: { patrons: -8, jeunes: -4, overton: 4 }, rel: { CA: -6, DP: -6 }, news: "Le Président refuse les avions atlantiques et vante « nos amis de l’Est »" },
    ],
  });

  V("w6_clemence", {
    m: ["Idée : le Conseil constitutionnel bloque tout. On fait un référendum sur l’immigration par l’article 11. Sans passer par le Parlement.",
        "Les juristes disent que c’est illégal. Le peuple, lui, ne lit pas les juristes."],
    c: [
      { t: "Référendum. Le peuple contre les juges.", cost: 6, r: "Annoncé. Le Conseil constitutionnel dit qu’il ne peut pas l’empêcher. Il le regrette déjà.",
        fx: { retraites: 4, police: 3, jeunes: -8, colere: 8, overton: 8 }, rel: { CA: -8, DP: -4, HI: -10, VP: -8 }, set: { referendumImmig: true },
        news: "Référendum sur l’immigration par l’article 11 : « Le peuple au-dessus des juges »" },
      { t: "Un Grand Débat plutôt : des cahiers, et on ne lit rien.", cost: 5, r: "Je commande 40 000 cahiers. Et une benne.",
        fx: { colere: -8 }, set: { grandDebat: true } },
      { t: "Non. On respecte la Constitution.", cost: 3, r: "Une phrase inattendue. Hugues de Souche l’a déjà imprimée sur un t-shirt « traître ».",
        fx: { jeunes: 3, retraites: -2, overton: -3 }, image: { me: -1 } },
    ],
  });

  // ================================================================ SEMAINE 7
  V("w7_eco_high", {
    m: ["Bonne nouvelle : un petit surplus, une semaine avant l’élection.", "On en fait quoi ? Lebâton veut des drones. Hugues de Souche veut des charters."],
    c: [
      { t: "Une prime de 300 € réservée aux nationaux.", cost: 6, r: "Réservée. Aminata, infirmière depuis trente ans, n’y a pas droit. Elle a soigné ton père la semaine dernière.",
        fx: { budget: -9, retraites: 5, ouvriers: 3, jeunes: -6, overton: 5 }, news: "Prime de 300 € « préférence nationale » : le Conseil d’État saisi" },
      { t: "Baisse de la TVA sur l’énergie. Pour tous.", cost: 6, r: "Pour tous. Même les étrangers. Hugues de Souche est furieux. Les caissières, ravies.",
        fx: { budget: -10, ouvriers: 6, retraites: 4, eco: 3, colere: -5 } },
      { t: "20 000 policiers de plus.", cost: 6, r: "Recrutés en une semaine. Formés en une demi-journée. Ils sont très motivés.",
        fx: { budget: -10, police: 10, retraites: 3, jeunes: -4, overton: 2 } },
    ],
  });

  V("w7_debat", {
    m: ["Débat télé jeudi, le dernier avant l’élection. Ils vont te parler de ton grand-père, des assistants et de l’Est.", "Ta stratégie ?"],
    c: [
      { t: "Dédiabolisation : cravate, sourire, on parle pouvoir d’achat.", cost: 6, r: "Tu as parlé de la baguette pendant 40 minutes. Les sondages adorent. Hugues de Souche vomit.",
        fx: { retraites: 4, ouvriers: 4, colere: -4, overton: -2 }, image: { me: 2 } },
      { t: "Tout dire : le « grand remplacement », la remigration.", cost: 6, r: "Tu l’as dit. Les fact-checkeurs ont démonté la théorie en direct. Ça ne change jamais rien, et c’est le problème.",
        fx: { retraites: 2, police: 3, jeunes: -12, colere: 8, overton: 10 }, image: { me: -1 },
        news: "Débat : le Président reprend la théorie du « grand remplacement » en direct" },
      { t: "L’ordre, l’ordre, l’ordre.", cost: 6, r: "Les retraités vont adorer. Les jeunes vont s’abstenir. Parfait, en fait.",
        fx: { police: 8, retraites: 8, jeunes: -8, overton: 3 } },
    ],
  });

  // ================================================================ ÉVÉNEMENTS ALÉATOIRES
  V("p_culture", {
    m: ["Président, je passe sur un plateau ce soir.", "Je peux annoncer qu’on coupe les subventions au rap et qu’on rebaptise la Fête de la musique « Fête de l’accordéon » ?"],
    c: [
      { t: "Surtout pas !", cost: 3, r: "Dommage. Je dirai « valoriser le patrimoine sonore ». Ça veut dire la même chose." },
      { t: "Vas-y, ça va buzzer.", cost: 3, r: "Ça a buzzé. Le rappeur le plus écouté du pays a sorti un morceau sur toi. Il est numéro un.",
        fx: { jeunes: -8, retraites: 3, overton: 2 }, news: "La ministre de la Culture coupe les subventions au rap : « Place à l’accordéon »" },
    ],
    d: { r: "Pas de réponse, donc j’y vais. Je l’ai dit. Le morceau est déjà numéro un.", fx: { jeunes: -6, overton: 2 } },
  });

  V("p_vente", {
    m: ["Les caisses fondent. Idée du programme : on privatise l’audiovisuel public. Les chaînes, les radios, tout.",
        "Vallon-Dividende est candidat. Il possède déjà InfoChoc 24. Il dit qu’il « garantira le pluralisme », il a souri en le disant."],
    c: [
      { t: "Vendez à Vallon-Dividende.", cost: 5, r: "Vendu. Le journal de 20 h s’ouvre désormais sur « l’insécurité ». Même quand il ne se passe rien.",
        fx: { budget: 12, patrons: 6, jeunes: -6, retraites: -3, overton: 5 }, news: "L’audiovisuel public vendu à Vallon-Dividende : « Le pluralisme est garanti », jure-t-il" },
      { t: "On garde, mais on nomme des directeurs « patriotes ».", cost: 4, r: "Nommés. La météo a été confiée à un ancien militant. Il annonce des « vagues de chaleur venues du Sud ».",
        fx: { budget: 2, jeunes: -4, overton: 4 } },
      { t: "Non. Une démocratie a besoin d’un audiovisuel libre.", cost: 3, r: "Le service public te remercie. Il te critiquera quand même demain. C’est le principe.",
        fx: { budget: -2, jeunes: 2, overton: -2 } },
    ],
  });

  // ================================================================ HUGUES DE SOUCHE ET LES DINGUERIES DU PROGRAMME
  C.events.push(
    { id: "h_souche", w: 1, at: 0.9, from: "souche", when: S => S.programme === P, ov: false,
      m: ["Président, Hugues de Souche. Félicitations. Maintenant, faites tout ce que vous avez promis. Tout.",
          "Je préviens : au premier recul, je dirai partout que vous êtes devenu centriste. C’est la pire insulte que je connaisse."],
      c: [
        { t: "Tout sera fait. Et plus encore.", cost: 3, r: "Plus encore ? J’ai une liste. Elle est longue. Elle commence par les prénoms.",
          fx: { retraites: 1, overton: 2 } },
        { t: "Je gouverne pour tous les Hexagoniens.", cost: 3, r: "Tous ? Même ceux « de papier » ? Je note. Je note tout.",
          fx: { overton: -1 }, image: { me: -1 } },
      ],
      d: { r: "Pas de réponse. Le mépris des élites, déjà. Vous apprenez vite." } },

    // la loi de 1803 sur les prénoms
    { id: "h_prenoms", w: 2, at: 0.88, from: "souche", when: S => S.programme === P, ov: false,
      m: ["Président, il faut rétablir la loi de 1803 : des prénoms « du calendrier » uniquement. Pour assimiler.",
          "J’ai vérifié : votre ministre Lebâton a pour deuxième prénom Moussa. Votre influenceur s’appelle Kévin. Kévin n’est pas dans le calendrier. On commence par eux ?"],
      c: [
        { t: "Rétablissons la loi de 1803.", cost: 5, r: "Votée. Les mairies refusent les Kylian, les Inès et les Kévin. Les bébés ne savent pas encore qu’ils sont illégaux.",
          fx: { retraites: 2, jeunes: -10, colere: 6, overton: 7 }, set: { prenoms: true }, rel: { HI: -8, VP: -6, CA: -4 },
          news: "Retour de la loi de 1803 : les prénoms « hors calendrier » refusés à l’état civil",
          posts: [["@Kevontop", "frère ils ont interdit mon prénom. je m’appelle comment maintenant ? Saint-Kévin ?"]] },
        { t: "Juste une « recommandation » aux mairies.", cost: 4, r: "Une recommandation. Les officiers d’état civil de 4 000 communes l’ont appliquée comme une loi. C’est toujours comme ça.",
          fx: { jeunes: -4, overton: 3 } },
        { t: "Non. C’est grotesque.", cost: 3, r: "Lebâton te remercie. Moussa aussi, le livreur. Hugues de Souche te traite de « Président Kévin ».",
          fx: { jeunes: 3, overton: -2 }, image: { me: -1 } },
      ],
      d: { r: "Pas de réponse. Je l’annonce quand même sur InfoChoc 24. Ils adorent.", fx: { overton: 2 } } },

    // les binationaux écartés des « postes sensibles »
    { id: "h_binationaux", w: 3, at: 0.86, from: "lebaton", when: S => S.programme === P, ov: false,
      m: ["Président, Lebâton. Je propose d’écarter les binationaux des postes sensibles. Préfets, ambassadeurs, défense.",
          "Et je propose d’ajouter les profs. Et les infirmières de nuit. On ne sait jamais, la nuit."],
      c: [
        { t: "Tous les postes publics. Les binationaux, c’est des demi-nationaux.", cost: 5, r: "Aminata a reçu sa lettre. Trente ans de nuits, une double nationalité, un « poste sensible » : le service de réanimation.",
          fx: { retraites: 2, jeunes: -10, ouvriers: -3, colere: 8, overton: 8 }, set: { binationaux: true }, rel: { HI: -8, VP: -6, CA: -6 },
          news: "Les binationaux exclus de la fonction publique : 3 millions d’Hexagoniens « à demi »" },
        { t: "Seulement une cinquantaine de postes. Défense, renseignement.", cost: 4, r: "Une cinquantaine. On fera la liste par décret. Elle s’allongera par décret aussi.",
          fx: { retraites: 1, jeunes: -4, overton: 4 } },
        { t: "Non. Un Hexagonien est un Hexagonien.", cost: 3, r: "Une phrase de la République. Hugues de Souche l’a trouvée « suspecte ».",
          fx: { jeunes: 3, overton: -3 }, image: { me: -1 } },
      ],
      d: { r: "Pas de réponse. J’ai lancé une « liste provisoire ». Elle fait 4 000 postes." , fx: { overton: 4 } } },

    // les éoliennes
    { id: "h_eoliennes", w: 4, at: 0.86, from: "rabot", when: S => S.programme === P, ov: false,
      m: ["Président, le programme dit : démontage des éoliennes. Elles « défigurent nos paysages ».",
          "Coût : 9 milliards, et on rallume des centrales à charbon en attendant. Les paysages autour des centrales, on n’en parle pas."],
      c: [
        { t: "Démontez tout.", cost: 6, r: "Démontées. On a gardé une pale devant l’Élysée, comme trophée. Le charbon fume derrière.",
          fx: { budget: -9, eco: 8, retraites: 3, jeunes: -6, overton: 2 }, news: "Démontage des éoliennes : le pays rallume ses centrales à charbon" },
        { t: "Moratoire : plus de nouvelles, on garde les anciennes.", cost: 4, r: "Un moratoire. Le mot préféré de ceux qui ne veulent ni faire ni défaire.",
          fx: { eco: 3, retraites: 1 } },
        { t: "On les garde. On a besoin d’électricité.", cost: 3, r: "Pragmatique. Hugues de Souche dit que tu as été « acheté par le lobby du vent ».",
          fx: { jeunes: 2, overton: -1 }, image: { me: -1 } },
      ] },

    // le Conseil constitutionnel censure la Préférence
    { id: "h_juges", w: 5, at: 0.5, from: "clemence", when: S => S.programme === P && passed(S, "l_preference"), ov: false,
      m: ["Le Conseil constitutionnel vient de censurer la Préférence Hexagonale. Motif : « l’égalité devant la loi ». Un détail, selon Lebâton.",
          "On fait quoi ? Hugues de Souche propose de « dissoudre le Conseil ». Je précise que ce n’est pas possible. Enfin, pas encore."],
      c: [
        { t: "Révision de la Constitution par référendum. Sans le Parlement.", cost: 6, r: "Annoncé. Les professeurs de droit constitutionnel signent des tribunes. Personne ne lit les tribunes.",
          fx: { retraites: 3, jeunes: -8, colere: 8, overton: 8 }, rel: { CA: -8, DP: -6, HI: -10 }, set: { revisionPref: true },
          news: "Censure de la Préférence : le Président lance un référendum pour réviser la Constitution" },
        { t: "Nommer trois juges « patriotes » au Conseil.", cost: 5, r: "Nommés. Le premier n’a pas de diplôme de droit. Il a un podcast.",
          fx: { jeunes: -6, overton: 6 }, set: { jugesAmis: true },
          leak: { p: 0.5, fx: { jeunes: -6, retraites: -4 }, news: "FUITE : l’Élysée cherchait des juges « sûrs » pour le Conseil constitutionnel" } },
        { t: "On s’incline. C’est l’État de droit.", cost: 3, r: "L’État de droit. Tes électeurs découvrent qu’il existe. Ils sont déçus.",
          fx: { retraites: -3, jeunes: 2, overton: -4 }, image: { me: -2 } },
      ] },

    // la Cour européenne bloque les expulsions
    { id: "h_cedh", w: 5, at: 0.82, from: "lebaton", when: S => S.programme === P, ov: false,
      m: ["Président, la Cour européenne des droits de l’homme vient de bloquer nos expulsions vers un pays « où l’on torture ».",
          "Je propose de quitter la Convention. On serait le premier pays à le faire depuis la Grèce des colonels. Et la Russie. Bonne compagnie."],
      c: [
        { t: "On quitte la Convention européenne des droits de l’homme.", cost: 6, r: "Partis. Strasbourg nous range entre deux pays qu’on ne cite pas dans les dîners.",
          fx: { retraites: 2, jeunes: -8, patrons: -4, overton: 8 }, rel: { CA: -8, DP: -4 }, set: { sortieCEDH: true },
          news: "L’Hexagonie quitte la Convention européenne des droits de l’homme" },
        { t: "On ignore l’arrêt. On expulse quand même.", cost: 5, r: "Expulsés. L’un d’eux a disparu à l’arrivée. Le ministère parle d’un « retour réussi ».",
          fx: { police: 3, jeunes: -6, overton: 6 } },
        { t: "On applique l’arrêt.", cost: 3, r: "Appliqué. Lebâton a cassé un crayon. Hugues de Souche a cassé un plateau télé.",
          fx: { jeunes: 2, police: -3, overton: -3 }, image: { me: -1 } },
      ],
      d: { r: "Pas de réponse. Lebâton a expulsé quand même. Il demandera pardon après. Il ne demande jamais.", fx: { overton: 5 } } },

    // le ministère de la Remigration
    { id: "h_remigration", w: 6, at: 0.55, from: "souche", when: S => S.programme === P, ov: false,
      m: ["Président, j’ai écrit votre plan : un ministère de la Remigration. Un million de départs en cinq ans. Des charters. Des « accords » avec les pays d’origine.",
          "Ceux qui ont des papiers ? On verra au cas par cas. Le cas par cas, c’est la partie amusante."],
      c: [
        { t: "Créez le ministère. Vous serez ministre.", cost: 6, r: "Merci, Président. Mon premier décret est prêt. Il commence par un recensement. Tout commence toujours par un recensement.",
          fx: { retraites: 3, police: 4, jeunes: -14, ouvriers: -4, colere: 12, overton: 12 }, rel: { HI: -15, VP: -12, PP: -10, CA: -12, DP: -6 }, image: { me: 3 },
          set: { remigration: true }, news: "Création d’un ministère de la Remigration, confié à Hugues de Souche" },
        { t: "Un « Haut-Commissariat au retour ». Même chose, mot plus doux.", cost: 5, r: "Le mot est plus doux. Les charters sont les mêmes.",
          fx: { retraites: 2, jeunes: -8, colere: 6, overton: 7 }, rel: { CA: -6, HI: -8 }, set: { remigration: true } },
        { t: "Non. Ça, jamais.", cost: 4, r: "Alors je me présente contre vous. Les vrais patriotes choisiront l’original.",
          fx: { jeunes: 4, retraites: -3, overton: -4 }, image: { me: -4 }, set: { soucheCandidat: true },
          news: "Hugues de Souche rompt avec le Président et annonce sa candidature" },
      ],
      d: { r: "Pas de réponse. Je l’annonce quand même sur InfoChoc 24. Qui ne dit mot consent.", fx: { overton: 5 }, image: { me: -1 } } },

    // le prêt de l'Est
    { id: "h_banque", w: 6, at: 0.82, from: "inconnu", when: S => S.programme === P, ov: false,
      m: ["Bonjour Président. Une grande banque d’un pays ami de l’Est peut refinancer votre dette. 20 milliards, taux très doux.",
          "En échange, rien. Juste un peu d’amitié. Et quelques votes à Bruxelles. Votre parti nous connaît déjà, d’ailleurs."],
      c: [
        { t: "Avec plaisir. Entre amis.", cost: 4, r: "Merveilleux. Les 20 milliards arrivent. Les votes à Bruxelles aussi, dans l’autre sens.",
          fx: { budget: 15, patrons: -4, overton: 4 }, rel: { CA: -10, DP: -8 }, set: { pretEst: true },
          leak: { p: 0.7, fx: { retraites: -8, jeunes: -8, colere: 8 }, image: { me: -3 }, news: "RÉVÉLATIONS : l’Hexagonie refinancée par une banque proche du Kremlin" } },
        { t: "Non. Notre souveraineté ne se vend pas.", cost: 3, r: "Dommage. On a la photo de votre trésorier avec notre banquier. Elle est jolie.", fx: { patrons: 2 } },
      ],
      d: { r: "Pas de réponse. L’offre reste ouverte. Nos offres restent toujours ouvertes." } },

    // Bruxelles déclenche l'article 7
    { id: "h_article7", w: 7, at: 0.3, from: "ue", when: S => S.programme === P && (S.flags.prenoms || S.flags.binationaux || S.flags.sortieCEDH || S.flags.remigration || S.flags.perquisition || passed(S, "l_preference")), ov: false,
      m: ["Commission de l’Union. Nous déclenchons l’article 7 contre l’Hexagonie pour « atteintes graves à l’État de droit ». Vos droits de vote sont suspendus.",
          "20 milliards de fonds européens sont gelés. Ce n’est pas personnel. Enfin, si, un peu."],
      c: [
        { t: "Référendum sur l’Hexit.", cost: 6, r: "Annoncé. Les marchés s’effondrent, les retraités regardent leur épargne, les agriculteurs leurs subventions. Hugues de Souche danse.",
          fx: { budget: -10, patrons: -12, retraites: -6, ouvriers: -2, colere: 8, overton: 6 }, set: { hexit: true },
          news: "Le Président annonce un référendum sur la sortie de l’Union : l’euro chute de 9 %" },
        { t: "Négocier. On recule sur deux mesures, on garde le reste.", cost: 5, r: "Bruxelles dégèle la moitié. Hugues de Souche parle de « capitulation ». Il le dit pour tout.",
          fx: { budget: 8, patrons: 4, overton: -2 }, image: { me: -1 } },
        { t: "Tout retirer. On rentre dans le rang.", cost: 4, r: "Retiré. Les fonds reviennent. Tes électeurs se demandent pourquoi ils ont voté pour toi.",
          fx: { budget: 12, patrons: 6, retraites: -4, police: -4, overton: -6 }, image: { me: -3 } },
      ],
      d: { r: "Pas de réponse. Les fonds restent gelés. Bruxelles a tout son temps.", fx: { budget: -8, patrons: -4 } } },

    // Hugues de Souche, candidat, si tu as refusé ses idées
    { id: "h_souche_final", w: 8, at: 0.2, from: "souche", when: S => S.programme === P && !!S.flags.soucheCandidat, ov: false,
      m: ["Président, je suis à 9 % dans les sondages. Avec moi, vous ne passerez pas le premier tour.",
          "Dernière offre : vous me nommez Premier ministre, je retire ma candidature."],
      c: [
        { t: "Marché conclu. Premier ministre.", cost: 4, r: "Excellent. Mon premier décret concerne les prénoms. Le deuxième, les charters. Le troisième, vous verrez.",
          fx: { jeunes: -10, colere: 8, overton: 10 }, image: { me: 5 }, set: { soucheCandidat: false, remigration: true },
          news: "Hugues de Souche nommé Premier ministre et retire sa candidature" },
        { t: "Présentez-vous. Vous ferez 3 %.", cost: 3, r: "On verra dimanche. Les sondages disent 9 %. Vos électeurs écoutent les sondages.",
          image: { me: -3 } },
      ],
      d: { r: "Pas de réponse. Je maintiens ma candidature. Les vrais patriotes savent pour qui voter.", image: { me: -3 } } },
  );

  // ================================================================ LE FIL, VU DE L'EXTRÊME DROITE AU POUVOIR
  C.ambientBy = C.ambientBy || {};
  C.ambientBy[P] = {
    calm: [
      ["@Edito_Hexagone", "Enfin. Enfin. Enfin. (Je l’écris depuis le plateau d’InfoChoc 24, c’est plus rapide.)"],
      ["@Mamie_Ginette", "Mon infirmière de nuit a reçu une lettre du ministère. Elle pleurait en me faisant ma piqûre. J’ai demandé pourquoi. Elle a dit « rien »."],
      ["@MiloDu93", "contrôlé 4 fois ce matin. le policier m’a dit « c’est le nouveau gouvernement ». au moins il était honnête"],
      ["@Lea_Sciences_Po", "Thread 🧵 : comment les démocraties meurent, étape 1 (1/63)"],
      ["@Moussa_Livre", "Livraison ce soir rue de l’Élysée. Je prends l’autre rue. Celle sans contrôle."],
      ["@CRS_Anonyme", "Pour la première fois, on se sent soutenus. On ne sait pas si c’est bon signe."],
    ],
    tense: [
      ["@HuguesDeSouche", "Le Président a reculé. Encore. On ne fait pas de remigration avec des « recommandations »."],
      ["@JosyMartelUTF", "Ils ont dissous notre syndicat. On s’est reformés en 48 heures. Sous le même nom. #JeudiNoir"],
      ["@Lea_Sciences_Po", "Thread 🧵 : comment les démocraties meurent, étape 4 : les juges (1/71)"],
      ["@Kevontop", "ils veulent interdire mon prénom. je vais m’appeler Clovis. ça marche Clovis ?"],
      ["@InfoChoc24", "🔴 « Insécurité » : notre édition spéciale entre dans sa 300e heure."],
      ["@EntrepreneurDuDim", "Les marchés baissent, les étrangers partent, mes serveurs aussi. Qui va servir en terrasse ?"],
      ["@Agri_Colere", "On a voté pour eux. Maintenant on cherche qui va ramasser les fraises."],
    ],
    angry: [
      ["@MiloDu93", "ils ont emmené le père de mon pote. il est né ici. #Résistance"],
      ["@Lea_Sciences_Po", "Thread 🧵 : comment les démocraties meurent, étape 7. Il n’y aura pas d’étape 8 sur ce réseau. (1/1)"],
      ["@PatriceDu59", "J’ai voté pour eux pour la vie chère. On a eu les charters. La vie est toujours chère."],
      ["@Mamie_Ginette", "J’ai 84 ans. J’ai déjà vu des listes et des trains, petite. Je n’avais pas prévu de les revoir."],
      ["@InfoChoc24", "🔴 ALERTE : barricades dans 40 villes. « Des casseurs d’ultragauche », selon notre envoyé spécial resté au studio."],
      ["@CRS_Anonyme", "On nous demande des choses qu’on ne nous avait jamais demandées. Certains collègues disent oui. Trop facilement."],
      ["@Anonymous_Hex", "Nous publierons bientôt les SMS du gouvernement. Et la liste. Nous savons qu’il y a une liste. 👁️"],
    ],
  };

  // ================================================================ TES PUBLICATIONS
  C.postsBy = C.postsBy || {};
  C.postsBy[P] = [
    null,
    [ { t: "On est chez nous. 🇭🇽", fx: { retraites: 3, jeunes: -6, overton: 3 }, rep: ["@MiloDu93", "moi aussi je suis chez moi frère, je suis né à Bondy"] },
      { t: "Je serai le Président de tous les Hexagoniens.", fx: { jeunes: 2, overton: -1 }, rep: ["@HuguesDeSouche", "« Tous ». Le premier recul. Déjà."] },
      { t: "Le pouvoir d’achat d’abord. Le reste suivra.", fx: { ouvriers: 3, retraites: 2 }, rep: ["@Lea_Sciences_Po", "« Le reste », c’est ce qui m’inquiète."] } ],
    [ { t: "Force restera à la loi. Et à nos policiers. #JeudiNoir", fx: { police: 6, jeunes: -6, colere: 4, overton: 2 }, rep: ["@CRS_Anonyme", "Merci Président. On se sent… autorisés."] },
      { t: "L’ultragauche ne fera pas la loi dans la rue.", fx: { retraites: 3, jeunes: -6, colere: 4, overton: 3 }, rep: ["@JosyMartelUTF", "L’« ultragauche », ce sont des infirmières et des cheminots."] },
      { t: "Le droit de manifester est sacré. Même contre moi.", fx: { jeunes: 3, colere: -3, overton: -2 }, rep: ["@HuguesDeSouche", "Sacré ? Le Président a trop lu de manuels de droit."] } ],
    [ { t: "Les grévistes sont les idiots utiles du chaos.", fx: { retraites: 3, ouvriers: -6, colere: 5, overton: 2 }, rep: ["@PatriceDu59", "L’idiot utile a 37 ans de boîte."] },
      { t: "Préférence Hexagonale : les nôtres d’abord.", fx: { retraites: 3, jeunes: -6, overton: 4 }, rep: ["@Aminata_Nuit", "« Les nôtres ». Je soigne les vôtres depuis trente ans."] },
      { t: "TVA à 5,5 % sur l’énergie : promesse tenue.", fx: { ouvriers: 4, retraites: 3, budget: -2 }, rep: ["@EntrepreneurDuDim", "Enfin une mesure de gauche que j’aime."] } ],
    [ { t: "Les normes de Bruxelles ont noyé nos villages.", fx: { retraites: 3, jeunes: -4, overton: 2 }, rep: ["@Lea_Sciences_Po", "Non. C’est la pluie. Et le climat. Et le béton."] },
      { t: "Pensées pour les sinistrés. Les nôtres d’abord, pour les secours aussi ?", fx: { retraites: 1, jeunes: -6, overton: 4 }, rep: ["@Mamie_Ginette", "Ma voisine sur le toit s’appelle Fatima. Elle attend aussi."] },
      { t: "Le climat change. On s’adaptera. Ensemble.", fx: { jeunes: 2, retraites: 2 }, rep: ["@HuguesDeSouche", "« Ensemble ». Mot de gauche."] } ],
    [ { t: "Gouvernement des juges : le peuple doit avoir le dernier mot.", fx: { retraites: 3, jeunes: -5, overton: 4 }, rep: ["@Lea_Sciences_Po", "Le peuple a aussi voté la Constitution. Il avait le dernier mot à ce moment-là."] },
      { t: "Je respecte la justice. Elle se trompe, mais je la respecte.", fx: { overton: -1 }, rep: ["@InfoChoc24", "🔴 Le Président « respecte » la justice qui le poursuit."] },
      { t: "La presse ment. La vraie information, c’est InfoChoc 24.", fx: { retraites: 2, jeunes: -5, overton: 3 }, rep: ["@Edito_Hexagone", "Merci Président. (Ce n’est pas sponsorisé. Enfin, pas que.)"] } ],
    [ { t: "Les fauteurs de troubles rentreront chez eux. Chez eux, c’est ailleurs.", fx: { retraites: 3, jeunes: -10, colere: 6, overton: 6 }, rep: ["@MiloDu93", "chez moi c’est ici. j’ai la carte vitale et tout"] },
      { t: "L’ordre sera rétabli. Pour tous, partout.", fx: { police: 5, retraites: 3, jeunes: -5, overton: 2 }, rep: ["@Lea_Sciences_Po", "« Partout » inclut les commissariats ?"] },
      { t: "Un jeune est mort. La justice doit passer, pour tout le monde.", fx: { jeunes: 4, police: -5, overton: -3 }, rep: ["@HuguesDeSouche", "Il présente ses condoléances maintenant. Il est perdu."] } ],
    [ { t: "Bruxelles ne dictera plus rien à l’Hexagonie.", fx: { retraites: 2, patrons: -5, overton: 3 }, rep: ["@EntrepreneurDuDim", "Bruxelles payait nos routes. Qui paie maintenant ?"] },
      { t: "Je n’ai jamais voulu quitter l’Union. Jamais. (Sauf en 2017.)", fx: { patrons: 3, retraites: 2 }, rep: ["@Lea_Sciences_Po", "Les archives de 2017 sont restées en ligne."] },
      { t: "Le grand remplacement n’est pas une théorie. C’est un constat.", fx: { retraites: 2, jeunes: -12, colere: 8, overton: 10 }, rep: ["@Lea_Sciences_Po", "C’est une théorie complotiste. Démontée cent fois. Ça ne change rien, et c’est le problème."] } ],
    [ { t: "Dimanche, votez pour la France des clochers.", fx: { retraites: 4, jeunes: -4, overton: 2 }, rep: ["@MiloDu93", "y’a aussi des minarets et des HLM dans la France, juste pour info"] },
      { t: "Dimanche, votez pour le pouvoir d’achat.", fx: { ouvriers: 3, retraites: 2 }, rep: ["@PatriceDu59", "Le pouvoir d’achat ou les charters ? Je ne sais plus ce que j’ai acheté."] },
      { t: "Si je perds, le pays sera remplacé. Littéralement.", fx: { retraites: 2, jeunes: -8, overton: 6 }, rep: ["@Lea_Sciences_Po", "Le pays sera « remplacé » par un autre président. Ça s’appelle une élection."] } ],
  ];

  // ================================================================ MODE NE PAS DÉRANGER
  const act = id => C.dndActs.find(a => a.id === id);
  act("d_rabot").variants = { ...(act("d_rabot").variants || {}), [P]: { t: "a renommé Bercy « ministère de la Souveraineté économique ». Coût : 4 millions de papier à en-tête.", fx: { budget: -3 } } };
})();
