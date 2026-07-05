"use client";

import { createContext, useCallback, useContext, useEffect } from "react";

export type Lang = "ro" | "ru" | "en";
export const LANGS: Lang[] = ["ro", "ru", "en"];

type Dict = Record<string, string>;

const ro: Dict = {
  "tagline": "Livrare beton — Chișinău",
  "nav.prices": "Prețuri",
  "nav.how": "Cum funcționează",
  "nav.why": "De ce noi",
  "nav.gallery": "Galerie",
  "nav.contact": "Contact",
  "cta.call": "Sună",
  "cta.whatsapp": "WhatsApp",

  "hero.intro": "Află costul livrării de beton la locația ta. Mută punctul cu un click pe hartă pentru a recalcula.",
  "hero.useLocation": "Folosește locația mea",
  "hero.calculating": "Se calculează…",
  "hero.fallback": "Nu am primit acces la locația ta — am folosit Ialoveni ca punct implicit. Apasă butonul de mai sus sau alege un punct pe hartă.",
  "hero.yourLocation": "Locația ta",
  "hero.locating": "se determină…",

  "calc.grade": "Marca betonului",
  "calc.volume": "Volum (m³)",
  "calc.selectHint": "Selectează marca betonului și volumul pentru prețul betonului.",
  "calc.resultPlaceholder": "Alege locația (butonul de mai sus sau un click pe hartă) ca să vezi prețul.",
  "calc.perM3": "lei/m³",

  "cost.total": "Cost total estimat",
  "cost.loadedDistance": "Distanță stație → client",
  "cost.tariff": "Tarif (după distanță)",
  "cost.tariffPerTruck": "Tarif / mașină",
  "cost.trucks": "Mașini necesare",
  "cost.trucksWord": "mașini",
  "cost.over20": "Peste 20 km",
  "cost.note": "Estimare: beton (marcă × volum) + livrare (fixă, după distanța de la stație până la tine). Fără TVA.",
  "cost.concrete": "Beton",
  "cost.transport": "Transport",
  "cost.delivery": "Livrare",
  "cost.zone.city": "în oraș",
  "cost.zone.outside": "în afara orașului",
  "cost.baseFee": "Taxă de bază",
  "cost.distanceOneWay": "Distanță (o direcție)",
  "cost.transportRound": "Transport (dus-întors)",
  "cost.transportOne": "Transport",
  "cost.kmCost": "Cost transport",
  "cost.totalDelivery": "Total livrare",
  "cost.note.city": "Estimare transport în Chișinău, fără preț beton și fără TVA.",
  "cost.note.outside": "Estimare în afara orașului (taxă de bază + preț pe km de la bază), fără preț beton și fără TVA.",

  "plan.chosenStation": "Stație aleasă",
  "map.stationLabel": "Stație beton",

  "district.deliveryFrom": "Livrare de la",
  "district.calcCta": "Calculează prețul exact",
  "district.faqHeading": "Întrebări frecvente",
  "district.nearbyHeading": "Livrăm și în localitățile vecine",
  "district.deliveryIn": "Livrare beton în",
  "areas.title": "Zone de livrare",
  "areas.subtitle": "Livrăm beton, nisip și pietriș în Chișinău și localitățile din jur — alege zona ta.",
  "plan.totalRoute": "Total drum",
  "word.truck": "Camion",
  "word.client": "Client",

  "pill.transportTo": "Preț livrare: ~{price} lei",
  "pill.tap": "atinge pentru detalii",

  "prices.title": "Prețuri livrare",
  "prices.grade": "Marca",
  "prices.distance": "Distanță (stație → tine)",
  "prices.price": "Preț",
  "prices.note": "Preț per livrare (autobetonieră), în funcție de distanța de la stație până la tine. Marca și volumul nu schimbă prețul afișat. Fără TVA.",
  "prices.gradeGuide": "Ghid mărci beton",
  "prices.useCol": "Pentru ce",
  "prices.popular": "Populară",
  "grade.M150.use": "Egalizări, straturi de pregătire, umpluturi.",
  "grade.M200.use": "Fundații ușoare, trotuare, pardoseli, garduri.",
  "grade.M250.use": "Fundații, plăci, scări — cel mai folosit la case.",
  "grade.M300.use": "Elemente structurale: planșee, stâlpi, grinzi.",
  "grade.M350.use": "Structuri cu cerințe înalte, beton armat portant.",

  "how.title": "Cum funcționează",
  "how.subtitle": "Trei pași simpli — de la locație la comandă.",
  "how.s1.t": "Alegi locația",
  "how.s1.d": "Pe hartă, automat sau cu un click.",
  "how.s2.t": "Vezi prețul",
  "how.s2.d": "Preț după distanță, instant.",
  "how.s3.t": "Ne suni",
  "how.s3.d": "Confirmăm și livrăm.",

  "why.title": "De ce noi",
  "why.subtitle": "De ce ne aleg clienții și ce îți garantăm la fiecare livrare.",
  "why.cert.t": "Certificat la livrare",
  "why.cert.d": "La fiecare livrare primești certificat de calitate, ca să ai siguranța că marca de beton comandată corespunde standardelor.",
  "why.fleet.t": "Flotă proprie",
  "why.fleet.d": "Livrăm cu autobetoniere proprii și avem pompă de beton la cerere, ca să turnăm rapid chiar și în locuri greu accesibile.",
  "why.coverage.t": "Acoperire largă",
  "why.coverage.d": "Acoperim Chișinăul și suburbiile, alegând automat cea mai apropiată stație ca să reducem timpul și costul transportului.",
  "why.fast.t": "Preț pe loc",
  "why.fast.d": "Vezi prețul estimat direct pe hartă, fără telefoane — transparent, în funcție de distanță.",

  "mat.title": "Nu doar beton",
  "mat.subtitle": "Cu aceeași flotă îți aducem și nisip, și pietriș — pentru fundații, betoane și amenajări.",
  "mat.sand.t": "Nisip",
  "mat.sand.d": "Nisip de râu și de carieră, spălat — pentru betoane, mortare și tencuieli.",
  "mat.gravel.t": "Pietriș",
  "mat.gravel.d": "Pietriș și piatră spartă, în diverse fracții — pentru fundații, drenaj și betoane.",
  "mat.note": "Nisipul și pietrișul se comandă telefonic. Sună-ne pentru preț și disponibilitate:",

  "gallery.title": "Galerie",
  "gallery.alt": "Autobetonieră DARSAN — livrare beton în Chișinău",
  "slogan.title": "Livrăm beton din cel mai apropiat punct de tine, pentru un preț cât mai mic",
  "slogan.text": "Harta alege automat cea mai apropiată stație de betoane, ca tu să plătești cât mai puțin pe transport.",
  "prices.kicker": "Tarife",
  "how.kicker": "Simplu",
  "why.kicker": "Avantaje",
  "gallery.kicker": "Flota noastră",
  "cta.title": "Ai nevoie de beton?",
  "cta.text": "Sună-ne și îți confirmăm prețul și livrarea rapid.",
  "footer.contact": "Contact",
  "footer.hours": "Program",
  "footer.hoursValue": "Luni–Sâmbătă, 08:00–18:00",
  "footer.area": "Zonă de livrare",
  "footer.areaValue": "Chișinău și suburbiile",
  "footer.rights": "Toate drepturile rezervate.",
};

const ru: Dict = {
  "tagline": "Доставка бетона — Кишинёв",
  "nav.prices": "Цены",
  "nav.how": "Как это работает",
  "nav.why": "Почему мы",
  "nav.gallery": "Галерея",
  "nav.contact": "Контакты",
  "cta.call": "Позвонить",
  "cta.whatsapp": "WhatsApp",

  "hero.intro": "Узнайте стоимость доставки бетона на ваш адрес. Кликните по карте, чтобы пересчитать.",
  "hero.useLocation": "Моё местоположение",
  "hero.calculating": "Расчёт…",
  "hero.fallback": "Доступ к геолокации не получен — выбран Яловены по умолчанию. Нажмите кнопку выше или выберите точку на карте.",
  "hero.yourLocation": "Ваш адрес",
  "hero.locating": "определяется…",

  "calc.grade": "Марка бетона",
  "calc.volume": "Объём (м³)",
  "calc.selectHint": "Выберите марку бетона и объём для расчёта стоимости бетона.",
  "calc.resultPlaceholder": "Выберите адрес (кнопка выше или клик по карте), чтобы увидеть цену.",
  "calc.perM3": "лей/м³",

  "cost.total": "Итоговая оценка",
  "cost.loadedDistance": "Расстояние завод → клиент",
  "cost.tariff": "Тариф (по расстоянию)",
  "cost.tariffPerTruck": "Тариф / машина",
  "cost.trucks": "Нужно машин",
  "cost.trucksWord": "машин",
  "cost.over20": "Свыше 20 км",
  "cost.note": "Оценка: бетон (марка × объём) + доставка (фиксированная, по расстоянию от завода до вас). Без НДС.",
  "cost.concrete": "Бетон",
  "cost.transport": "Доставка",
  "cost.delivery": "Доставка",
  "cost.zone.city": "в городе",
  "cost.zone.outside": "за городом",
  "cost.baseFee": "Базовый тариф",
  "cost.distanceOneWay": "Расстояние (в одну сторону)",
  "cost.transportRound": "Доставка (туда-обратно)",
  "cost.transportOne": "Доставка",
  "cost.kmCost": "Стоимость доставки",
  "cost.totalDelivery": "Итого доставка",
  "cost.note.city": "Оценка доставки по Кишинёву, без цены бетона и без НДС.",
  "cost.note.outside": "Оценка за городом (базовый тариф + цена за км от базы), без цены бетона и без НДС.",

  "plan.chosenStation": "Выбранный завод",
  "map.stationLabel": "Бетонный узел",

  "district.deliveryFrom": "Доставка от",
  "district.calcCta": "Рассчитать точную цену",
  "district.faqHeading": "Частые вопросы",
  "district.nearbyHeading": "Доставляем и в соседние населённые пункты",
  "district.deliveryIn": "Доставка бетона в",
  "areas.title": "Зоны доставки",
  "areas.subtitle": "Доставляем бетон, песок и щебень по Кишинёву и окрестным населённым пунктам — выберите свой район.",
  "plan.totalRoute": "Весь маршрут",
  "word.truck": "Машина",
  "word.client": "Клиент",

  "pill.transportTo": "Цена доставки: ~{price} лей",
  "pill.tap": "нажмите для деталей",

  "prices.title": "Цены на доставку",
  "prices.grade": "Марка",
  "prices.distance": "Расстояние (завод → вы)",
  "prices.price": "Цена",
  "prices.note": "Цена за доставку (автобетоносмеситель), в зависимости от расстояния от завода до вас. Марка и объём не меняют указанную цену. Без НДС.",
  "prices.gradeGuide": "Гид по маркам бетона",
  "prices.useCol": "Применение",
  "prices.popular": "Популярная",
  "grade.M150.use": "Выравнивание, подготовительные слои, заполнение.",
  "grade.M200.use": "Лёгкие фундаменты, дорожки, полы, заборы.",
  "grade.M250.use": "Фундаменты, плиты, лестницы — чаще всего для домов.",
  "grade.M300.use": "Несущие элементы: перекрытия, колонны, балки.",
  "grade.M350.use": "Конструкции с высокими требованиями, армированный бетон.",

  "how.title": "Как это работает",
  "how.subtitle": "Три простых шага — от адреса до заказа.",
  "how.s1.t": "Выберите адрес",
  "how.s1.d": "На карте, авто или кликом.",
  "how.s2.t": "Узнайте цену",
  "how.s2.d": "Цена по расстоянию, мгновенно.",
  "how.s3.t": "Позвоните",
  "how.s3.d": "Подтверждаем и доставляем.",

  "why.title": "Почему мы",
  "why.subtitle": "Почему клиенты выбирают нас и что мы гарантируем при каждой доставке.",
  "why.cert.t": "Сертификат при доставке",
  "why.cert.d": "При каждой доставке вы получаете сертификат качества — гарантия, что заказанная марка бетона соответствует стандартам.",
  "why.fleet.t": "Свой автопарк",
  "why.fleet.d": "Доставляем собственными автобетоносмесителями, а бетононасос подаём по запросу — заливаем быстро даже в труднодоступных местах.",
  "why.coverage.t": "Широкий охват",
  "why.coverage.d": "Охватываем Кишинёв и пригороды, автоматически выбирая ближайший узел, чтобы снизить время и стоимость доставки.",
  "why.fast.t": "Цена сразу",
  "why.fast.d": "Цену вы видите прямо на карте, без звонков — прозрачно, в зависимости от расстояния.",

  "mat.title": "Не только бетон",
  "mat.subtitle": "Той же техникой привезём вам и песок, и щебень — для фундаментов, бетона и благоустройства.",
  "mat.sand.t": "Песок",
  "mat.sand.d": "Речной и карьерный песок, мытый — для бетона, растворов и штукатурки.",
  "mat.gravel.t": "Щебень",
  "mat.gravel.d": "Щебень и гравий разных фракций — для фундаментов, дренажа и бетона.",
  "mat.note": "Песок и щебень заказываются по телефону. Звоните для уточнения цены и наличия:",

  "gallery.title": "Галерея",
  "gallery.alt": "Автобетоносмеситель DARSAN — доставка бетона в Кишинёве",
  "slogan.title": "Доставляем бетон с ближайшей к вам точки — по минимальной цене",
  "slogan.text": "Карта автоматически выбирает ближайший бетонный узел, чтобы вы меньше платили за доставку.",
  "prices.kicker": "Тарифы",
  "how.kicker": "Просто",
  "why.kicker": "Преимущества",
  "gallery.kicker": "Наш автопарк",
  "cta.title": "Нужен бетон?",
  "cta.text": "Позвоните — быстро подтвердим цену и доставку.",
  "footer.contact": "Контакты",
  "footer.hours": "Часы работы",
  "footer.hoursValue": "Пн–Сб, 08:00–18:00",
  "footer.area": "Зона доставки",
  "footer.areaValue": "Кишинёв и пригороды",
  "footer.rights": "Все права защищены.",
};

const en: Dict = {
  "tagline": "Concrete delivery — Chișinău",
  "nav.prices": "Prices",
  "nav.how": "How it works",
  "nav.why": "Why us",
  "nav.gallery": "Gallery",
  "nav.contact": "Contact",
  "cta.call": "Call",
  "cta.whatsapp": "WhatsApp",

  "hero.intro": "Find out the concrete delivery cost to your location. Click the map to recalculate.",
  "hero.useLocation": "Use my location",
  "hero.calculating": "Calculating…",
  "hero.fallback": "We couldn't access your location — using Ialoveni as default. Tap the button above or pick a point on the map.",
  "hero.yourLocation": "Your location",
  "hero.locating": "locating…",

  "calc.grade": "Concrete grade",
  "calc.volume": "Volume (m³)",
  "calc.selectHint": "Select a concrete grade and volume to see the concrete price.",
  "calc.resultPlaceholder": "Pick a location (the button above or a click on the map) to see the price.",
  "calc.perM3": "lei/m³",

  "cost.total": "Estimated total",
  "cost.loadedDistance": "Plant → client distance",
  "cost.tariff": "Tariff (by distance)",
  "cost.tariffPerTruck": "Tariff / truck",
  "cost.trucks": "Trucks needed",
  "cost.trucksWord": "trucks",
  "cost.over20": "Over 20 km",
  "cost.note": "Estimate: concrete (grade × volume) + delivery (flat, by distance from the plant to you). VAT excluded.",
  "cost.concrete": "Concrete",
  "cost.transport": "Delivery",
  "cost.delivery": "Delivery",
  "cost.zone.city": "in town",
  "cost.zone.outside": "out of town",
  "cost.baseFee": "Base fee",
  "cost.distanceOneWay": "Distance (one way)",
  "cost.transportRound": "Transport (round trip)",
  "cost.transportOne": "Transport",
  "cost.kmCost": "Transport cost",
  "cost.totalDelivery": "Delivery total",
  "cost.note.city": "Delivery estimate within Chișinău, concrete price and VAT excluded.",
  "cost.note.outside": "Out-of-town estimate (base fee + per-km from base), concrete price and VAT excluded.",

  "plan.chosenStation": "Chosen plant",
  "map.stationLabel": "Concrete plant",

  "district.deliveryFrom": "Delivery from",
  "district.calcCta": "Calculate the exact price",
  "district.faqHeading": "Frequently asked questions",
  "district.nearbyHeading": "We also deliver to nearby localities",
  "district.deliveryIn": "Concrete delivery in",
  "areas.title": "Delivery areas",
  "areas.subtitle": "We deliver concrete, sand and gravel across Chișinău and the surrounding localities — pick your area.",
  "plan.totalRoute": "Total route",
  "word.truck": "Truck",
  "word.client": "Client",

  "pill.transportTo": "Delivery price: ~{price} lei",
  "pill.tap": "tap for details",

  "prices.title": "Delivery prices",
  "prices.grade": "Grade",
  "prices.distance": "Distance (plant → you)",
  "prices.price": "Price",
  "prices.note": "Price per delivery (mixer truck), based on the distance from the plant to you. Grade and volume don't change the shown price. VAT excluded.",
  "prices.gradeGuide": "Concrete grade guide",
  "prices.useCol": "Used for",
  "prices.popular": "Popular",
  "grade.M150.use": "Leveling, blinding layers, fill.",
  "grade.M200.use": "Light foundations, walkways, floors, fences.",
  "grade.M250.use": "Foundations, slabs, stairs — most common for houses.",
  "grade.M300.use": "Structural elements: floors, columns, beams.",
  "grade.M350.use": "High-requirement structures, load-bearing reinforced concrete.",

  "how.title": "How it works",
  "how.subtitle": "Three simple steps — from location to order.",
  "how.s1.t": "Pick a location",
  "how.s1.d": "On the map, automatically or by click.",
  "how.s2.t": "See the price",
  "how.s2.d": "Price by distance, instantly.",
  "how.s3.t": "Call us",
  "how.s3.d": "We confirm and deliver.",

  "why.title": "Why us",
  "why.subtitle": "Why clients choose us and what we guarantee on every delivery.",
  "why.cert.t": "Certificate on delivery",
  "why.cert.d": "Every delivery comes with a quality certificate, so you're sure the ordered concrete grade meets the standards.",
  "why.fleet.t": "Own fleet",
  "why.fleet.d": "We deliver with our own mixer trucks and offer a concrete pump on request, pouring fast even in hard-to-reach spots.",
  "why.coverage.t": "Wide coverage",
  "why.coverage.d": "We cover Chișinău and its suburbs, automatically picking the nearest plant to cut delivery time and cost.",
  "why.fast.t": "Instant price",
  "why.fast.d": "You see the estimated price right on the map, no calls — transparent, based on distance.",

  "mat.title": "Not just concrete",
  "mat.subtitle": "The same fleet brings you sand and gravel too — for foundations, concrete and landscaping.",
  "mat.sand.t": "Sand",
  "mat.sand.d": "River and quarry sand, washed — for concrete, mortars and plaster.",
  "mat.gravel.t": "Gravel",
  "mat.gravel.d": "Gravel and crushed stone in various fractions — for foundations, drainage and concrete.",
  "mat.note": "Sand and gravel are ordered by phone. Call us for price and availability:",

  "gallery.title": "Gallery",
  "gallery.alt": "DARSAN concrete mixer truck — concrete delivery in Chișinău",
  "slogan.title": "We deliver concrete from the point nearest you, at the lowest price",
  "slogan.text": "The map automatically picks the nearest concrete plant so you pay less for transport.",
  "prices.kicker": "Pricing",
  "how.kicker": "Simple",
  "why.kicker": "Advantages",
  "gallery.kicker": "Our fleet",
  "cta.title": "Need concrete?",
  "cta.text": "Call us — we'll confirm price and delivery fast.",
  "footer.contact": "Contact",
  "footer.hours": "Hours",
  "footer.hoursValue": "Mon–Sat, 08:00–18:00",
  "footer.area": "Delivery area",
  "footer.areaValue": "Chișinău and suburbs",
  "footer.rights": "All rights reserved.",
};

export const translations: Record<Lang, Dict> = { ro, ru, en };

export function translate(
  lang: Lang,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const s = translations[lang]?.[key] ?? translations.ro[key] ?? key;
  return vars
    ? s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""))
    : s;
}

type Ctx = {
  lang: Lang;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  // The URL is the source of truth for language (ro at /, ru at /ru, en at /en).
  // Keep the <html lang> attribute in sync on the client for a11y/SEO.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      translate(lang, key, vars),
    [lang],
  );

  return (
    <LangContext.Provider value={{ lang, t }}>{children}</LangContext.Provider>
  );
}

export function useI18n(): Ctx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
