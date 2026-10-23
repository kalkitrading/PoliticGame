// Ne Pas Déranger — ce qui change selon le gouvernement que tu formes :
// tes ministres, ta première décision, ton budget, et qui pousse la loi « Sécurité Absolue ».

(() => {
  const C = window.CONTENT;
  const prog = id => C.programmes.find(p => p.id === id);

  // ---------------------------------------------------------------- CASTING
  // names : remplace le nom d'un personnage dans tous les textes affichés.
  // contacts : remplace la fiche du contact. flags : état de départ.
  // Les gouvernements de gauche et écolos n'ont pas Lebâton à l'Intérieur, mais Mme Douce.
  Object.assign(prog("social"), {
    names: { Rabot: "M. Partage" },
    contacts: {
      rabot: { name: "M. Partage", role: "Ministre de l’Économie et du Partage", av: "🧺", col: "#b5452f" },
      parti: { name: "Groupe Hexagonie Indomptée", role: "Ton groupe à l’Assemblée", av: "⚡", col: "#d1342f" },
    },
    flags: { lebatonVire: true },
  });
  Object.assign(prog("climat"), {
    names: { Rabot: "M. Sobriété" },
    contacts: {
      rabot: { name: "M. Sobriété", role: "Ministre de l’Économie et de la Transition", av: "🚲", col: "#2f7a4a" },
      parti: { name: "Groupe des Verts Pâles", role: "Ton groupe à l’Assemblée", av: "🌱", col: "#3aa864" },
    },
    flags: { lebatonVire: true },
  });
  Object.assign(prog("liberal"), {
    contacts: { parti: { name: "Groupe Droite Patrimoniale", role: "Ton groupe à l’Assemblée", av: "🏰", col: "#4a86e0" } },
  });
  Object.assign(prog("ordre"), {
    names: { Rabot: "M. Souverain" },
    contacts: {
      rabot: { name: "M. Souverain", role: "Ministre de l’Économie et de la Souveraineté", av: "🪙", col: "#22356f" },
      parti: { name: "Groupe Rassemblement Hexagonal", role: "Ton groupe à l’Assemblée", av: "🧱", col: "#22356f" },
    },
  });

  // ---------------------------------------------------------------- PREMIÈRE DÉCISION ÉCONOMIQUE
  // Les drapeaux restent les mêmes (rigueur, gelPensions, taxeRiches) : la suite du jeu en dépend.
  const w1 = C.events.find(e => e.id === "w1_rabot");
  w1.alt = "w1_eco";
  w1.when = S => S.programme === "centre";

  const RIGUEUR_DEFAULT = { budget: 10, ouvriers: -8, retraites: -6, jeunes: -5, patrons: 8, colere: 10 };

  C.events.push(
    { id: "w1_eco_social", w: 1, at: 0.1, from: "rabot", alt: "w1_eco", when: S => S.programme === "social",
      m: ["Président, M. Partage. Notre programme coûte 60 milliards : SMIC, hôpitaux, écoles.",
          "Bercy a fait trois malaises en lisant le chiffrage. On le finance comment ?"],
      c: [
        { t: "Taxer les super-riches et les dividendes.", cost: 10, r: "Vallon-Dividende vient d’appeler son avocat. Puis son deuxième avocat.",
          fx: { budget: 10, patrons: -14, ouvriers: 8, jeunes: 6, colere: -6 }, set: { taxeRiches: true }, rel: { VP: 5, DP: -10, CA: -5 },
          news: "Le gouvernement taxe les dividendes : la Bourse perd 4 %, les yachts quittent les ports" },
        { t: "Emprunter. On verra plus tard.", cost: 8, r: "Plus tard, c’est le prochain gouvernement. C’est pratique.",
          fx: { budget: -6, ouvriers: 6, jeunes: 3, patrons: -6, colere: -4 }, set: { emprunt: true },
          news: "Plan social financé par l’emprunt : les agences de notation froncent les sourcils" },
        { t: "Reporter les mesures, rassurer Bruxelles.", cost: 8, r: "Rassurer Bruxelles. Tu as été élu pour ça ? Moi non plus.",
          fx: RIGUEUR_DEFAULT, set: { rigueur: true }, rel: { HI: -10, CA: 5 },
          news: "À peine élu, le gouvernement de gauche reporte ses promesses « pour rassurer les marchés »" },
      ],
      d: { r: "Pas de réponse. Bercy a choisi pour toi : on reporte. Bercy choisit toujours ça.", fx: RIGUEUR_DEFAULT, set: { rigueur: true },
           news: "Le Président « injoignable », Bercy reporte les mesures sociales" } },

    { id: "w1_eco_climat", w: 1, at: 0.1, from: "rabot", alt: "w1_eco", when: S => S.programme === "climat",
      m: ["Président, M. Sobriété. La transition coûte 50 milliards : trains, isolation, énergies propres.",
          "Il faut choisir qui paie. Je préviens : la dernière fois qu’on a taxé l’essence, il y avait des gilets partout."],
      c: [
        { t: "Taxe carbone sur les plus riches et leurs jets.", cost: 10, r: "Les 1 % émettent comme les 50 % les plus pauvres. Ils vont adorer l’apprendre.",
          fx: { budget: 10, patrons: -12, jeunes: 6, ouvriers: 4, eco: -6 }, set: { taxeRiches: true },
          news: "Taxe carbone sur les plus riches : les jets privés cherchent un pays d’adoption" },
        { t: "Taxe carbone pour tout le monde.", cost: 8, r: "Pour tout le monde. Même ceux qui font 60 km pour aller travailler. Courage.",
          fx: { budget: 12, ouvriers: -10, retraites: -6, eco: -8, colere: 12 }, set: { taxeCarbone: true, rigueur: true },
          news: "Taxe carbone généralisée : colère dans les campagnes, « on n’a pas de train, nous »" },
        { t: "Reporter la transition, rassurer les marchés.", cost: 8, r: "Reporter. Le climat, lui, ne reporte rien.",
          fx: { budget: 8, jeunes: -8, eco: 4, patrons: 6 }, set: { rigueur: true },
          news: "Le gouvernement écologiste reporte la transition. Les glaciers prennent note." },
      ],
      d: { r: "Pas de réponse. Bercy a choisi de reporter. Bercy reporte toujours.", fx: { budget: 8, jeunes: -8, eco: 4, patrons: 6 }, set: { rigueur: true } } },

    { id: "w1_eco_liberal", w: 1, at: 0.1, from: "rabot", alt: "w1_eco", when: S => S.programme === "liberal",
      m: ["Président, Rabot. Pour baisser les impôts des entreprises de 20 milliards, il faut couper ailleurs.",
          "J’ai trois pistes. Elles font toutes mal, mais pas aux mêmes personnes."],
      c: [
        { t: "Couper dans les services publics.", cost: 10, r: "Hôpitaux, écoles, trains. On appelle ça « optimiser ».",
          fx: { budget: 12, ouvriers: -10, retraites: -8, jeunes: -4, patrons: 12, colere: 12 }, set: { rigueur: true },
          news: "Baisse d’impôts pour les entreprises financée par des coupes dans les services publics" },
        { t: "Supprimer deux jours fériés.", cost: 8, r: "Le lundi de Pâques et le 8 Mai. Les entreprises vous remercient, les anciens combattants un peu moins.",
          fx: { budget: 10, ouvriers: -10, retraites: -6, patrons: 10, colere: 12, feries: 2 }, set: { rigueur: true },
          news: "PLAN RIGUEUR : le gouvernement supprime le lundi de Pâques et le 8 Mai" },
        { t: "Ne rien couper. Creuser la dette.", cost: 6, r: "Le libéralisme à crédit. Audacieux.",
          fx: { budget: -8, patrons: 6 }, set: { emprunt: true },
          news: "Baisses d’impôts à crédit : la dette bat un record, les marchés applaudissent quand même" },
      ],
      d: { r: "Pas de réponse. J’ai coupé dans les services publics. C’était dans mes notes depuis 2019.",
           fx: { budget: 12, ouvriers: -10, retraites: -8, jeunes: -4, patrons: 12, colere: 12 }, set: { rigueur: true } } },

    { id: "w1_eco_ordre", w: 1, at: 0.1, from: "rabot", alt: "w1_eco", when: S => S.programme === "ordre",
      m: ["Président, M. Souverain. Pour financer 20 000 policiers et le Bouclier Hexagonal, il faut 30 milliards.",
          "Je propose de supprimer l’aide médicale aux étrangers, la contribution européenne et « les associations ». Ça fait 4 milliards. Pour le reste, j’improvise."],
      c: [
        { t: "Tout supprimer.", cost: 8, r: "Fait. Il manque toujours 26 milliards, mais le symbole est fort.",
          fx: { budget: 4, police: 8, jeunes: -8, retraites: 3, colere: 6, overton: 5 }, set: { souverainete: true }, rel: { HI: -10, VP: -8 },
          news: "Fin de l’aide médicale aux étrangers : les médecins dénoncent « une mise en danger »" },
        { t: "Augmenter la TVA.", cost: 8, r: "La TVA. L’impôt que tout le monde paie sans le voir. Surtout ceux qui n’ont rien.",
          fx: { budget: 12, ouvriers: -10, retraites: -6, colere: 10 }, set: { rigueur: true },
          news: "Hausse de la TVA pour financer la police : « Chaque baguette paie un CRS »" },
        { t: "Taxer les super-riches, par patriotisme.", cost: 10, r: "Par patriotisme. Vallon-Dividende découvre qu’il n’était pas si patriote.",
          fx: { budget: 10, patrons: -12, ouvriers: 6, overton: -2 }, set: { taxeRiches: true },
          news: "Le gouvernement d’ordre taxe les super-riches « par patriotisme »" },
      ],
      d: { r: "Pas de réponse. J’ai augmenté la TVA. Personne ne s’en rendra compte avant la caisse.",
           fx: { budget: 12, ouvriers: -10, retraites: -6, colere: 10 }, set: { rigueur: true } } },
  );

  // ---------------------------------------------------------------- SEMAINE 3 : LA POLICE ET LES MANIFS
  // Avec Lebâton, c'est lui qui veut tout interdire. Sans lui, ce sont les syndicats de police.
  const w3 = C.events.find(e => e.id === "w3_lebaton");
  w3.alt = "w3_interieur";
  w3.when = S => !S.flags.lebatonVire;

  C.events.push(
    { id: "w3_police", w: 3, at: 0.42, from: "policesyn", alt: "w3_interieur", when: S => !!S.flags.lebatonVire,
      m: ["Président, Syndicat Police Unie. Les collègues n’en peuvent plus depuis Jeudi Noir.",
          "On exige l’interdiction des manifestations. Sinon, grève du zèle. Votre ministre, Mme Douce, ne nous écoute pas."],
      c: [
        { t: "Interdire les manifestations.", cost: 6, r: "Merci. On savait que vous aviez du bon sens, au fond. Très au fond.",
          fx: { ordre: 10, jeunes: -12, colere: 12, police: 8, gav: 1200 }, set: { interdiction: true }, rel: { HI: -10, VP: -8 },
          news: "Un gouvernement de gauche interdit les manifestations : ses électeurs n’en reviennent pas" },
        { t: "Encadrer, sans interdire.", cost: 5, r: "Encadrer. On va encadrer fort.", fx: { ordre: 4, colere: 2, police: 2, gav: 200 } },
        { t: "Non. Et on retire les LBD des manifs.", cost: 8, r: "Vous allez le regretter. Pas nous. Vous.",
          fx: { police: -12, ordre: -6, jeunes: 8, colere: -6 }, set: { desarmement: true },
          news: "Le gouvernement retire les LBD des manifestations, les syndicats de police fulminent" },
      ],
      d: { r: "Pas de réponse. Grève du zèle à partir de demain.", fx: { police: -6, ordre: -6 } } },
  );

  // ---------------------------------------------------------------- SEMAINE 7 : QUI POUSSE « SÉCURITÉ ABSOLUE » ?
  const w7 = C.events.find(e => e.id === "w7_securite");
  const w7m = w7.m;
  w7.m = S => (S.flags.lebatonVire && ["HI", "VP"].includes(S.me)
    ? ["Président, Mme Douce. Les syndicats de police et le RH exigent une loi « Sécurité Absolue ». Ils menacent de bloquer les commissariats.",
       "Reconnaissance faciale partout, fichage des manifestants, et report des élections « si nécessaire ». Je suis contre. Évidemment."]
    : w7m(S));

  // Mme Douce n'est « nouvelle » que si elle remplace Lebâton
  const w5d = C.events.find(e => e.id === "w5_douce");
  const w5dm = w5d.m;
  w5d.m = S => (["social", "climat"].includes(S.programme)
    ? ["Président, Mme Douce, ministre de l’Intérieur. Les syndicats de police veulent ma démission. Je prends ça pour un compliment.",
       "Je propose… rien. On respire. On désescalade. On arrête de gazer des lycéens."]
    : w5dm);

  // ---------------------------------------------------------------- LE BUDGET DE TON GOUVERNEMENT
  const budget = C.laws.find(l => l.id === "l_budget");
  const BUDGETS = {
    centre: { title: "Budget 2027", desc: budget.desc, yes: budget.yes },
    social: { title: "Budget 2027 « de rupture »",
      desc: "Hôpitaux, écoles, revalorisation des fonctionnaires, financés par la taxe sur les dividendes. Bercy fait des malaises en série.",
      yes: { fx: { budget: 6, ouvriers: 4, retraites: 3, patrons: -6, overton: -2 }, news: "Budget de rupture adopté : « Enfin un budget pour ceux qui n’ont pas de budget »" } },
    climat: { title: "Budget vert 2027",
      desc: "Trains, isolation, vélos, énergies propres. Les SUV paient la note. Le lobby automobile a demandé un rendez-vous à 7 h du matin.",
      yes: { fx: { budget: 6, eco: -6, jeunes: 3, patrons: -4 }, news: "Budget vert adopté : les trains reviennent, les SUV pleurent" } },
    liberal: { title: "Budget 2027 « d’efficacité »",
      desc: "Moins d’État, moins d’impôts, moins de tout. Sauf de dividendes. La Cour des comptes cherche encore où sont passés les services publics.",
      yes: { fx: { budget: 12, patrons: 6, ouvriers: -4, retraites: -2 }, news: "Budget d’efficacité adopté : « Moins de dépenses, plus de résultats », promet le gouvernement" } },
    ordre: { title: "Budget de souveraineté",
      desc: "Plus de police, plus d’armée, moins d’Europe, zéro aide aux « associations ». La Cour des comptes demande où est passé le reste.",
      yes: { fx: { budget: 8, police: 6, jeunes: -4, overton: 3 }, news: "Budget de souveraineté adopté : 20 000 policiers, et une ligne « divers » de 4 milliards" } },
  };
  budget.title = S => (BUDGETS[S.programme] || BUDGETS.centre).title;
  budget.desc = S => (BUDGETS[S.programme] || BUDGETS.centre).desc;
  budget.yes = S => (BUDGETS[S.programme] || BUDGETS.centre).yes;

})();
