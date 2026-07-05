import type { Lang } from "@/lib/i18n";

/**
 * District / locality landing pages (programmatic local SEO).
 *
 * Each district ships ≥ 800 words of UNIQUE content per locale (intro + two
 * sections + FAQ) so Google treats every page as distinct, not a doorway clone.
 * Bodies may contain the tokens `{km}` and `{price}` — DistrictPage replaces them
 * with the live build-time estimate so the prose always matches the calculator.
 *
 * Plant names are never mentioned (kept anonymous, like the rest of the site).
 *
 * To add a locality: copy a block below, fill `content` per locale (ro/ru/en),
 * set `lat`/`lng` (centroid) and `nearby` (existing slugs). A reference list of
 * the remaining proposed localities + coordinates is at the bottom of this file.
 */

export type DistrictContent = {
  title: string; // ≤ 60 chars
  description: string; // ~150 chars
  h1: string;
  intro: string;
  sectionA: { title: string; body: string };
  sectionB: { title: string; body: string };
  faq: { q: string; a: string }[];
};

export type District = {
  slug: string; // shared ascii slug across locales
  lat: number;
  lng: number;
  name: Record<Lang, string>;
  nearby: string[]; // slugs → "localități vecine" links (non-existent ones are ignored)
  content: Record<Lang, DistrictContent>;
};

export const DISTRICTS: District[] = [
  {
    slug: "ialoveni",
    lat: 46.9469,
    lng: 28.777,
    name: { ro: "Ialoveni", ru: "Яловены", en: "Ialoveni" },
    nearby: ["botanica", "sangera", "codru"],
    content: {
      ro: {
        title: "Livrare beton Ialoveni — preț și livrare rapidă | DARSAN",
        description:
          "Livrare beton în Ialoveni cu autobetoniera, la cel mai bun preț pe transport. Calculează instant costul pe hartă. Aducem și nisip și pietriș.",
        h1: "Livrare beton în Ialoveni",
        intro:
          "Ai nevoie de beton în Ialoveni? DARSAN livrează beton gata preparat direct la șantierul tău din oraș și din împrejurimi, cu autobetoniere proprii. Calculezi prețul transportului în câteva secunde pe hartă, alegem automat cea mai apropiată stație și îți aducem betonul cât mai repede și mai ieftin. Livrăm și nisip și pietriș.",
        sectionA: {
          title: "Livrare beton în Ialoveni — cât costă și cât durează",
          body:
            "Ialoveni se află la doar câțiva kilometri sud de Chișinău, așa că livrarea betonului aici este rapidă și ieftină. De la cea mai apropiată stație de betoane a noastră până în oraș sunt aproximativ {km} km de drum, iar prețul transportului pornește de la {price} lei pentru o cursă de autobetonieră. Costul exact depinde de adresa ta: cu cât ești mai aproape de stație, cu atât plătești mai puțin pe transport — poți vedea suma reală mutând punctul pe hartă în calculatorul de mai jos.\n\nAcoperim tot orașul Ialoveni și cartierele din jur — de la zona centrală și străzile Alexandru cel Bun, Ștefan cel Mare și Alexandru Ioan Cuza, până la mahalalele de case individuale de la marginea orașului și satele vecine precum Sociteni, Costești sau Nimoreni. Betonul proaspăt are un timp de lucru limitat, de aceea sistemul nostru alege întotdeauna stația cea mai apropiată de tine, ca betonul să ajungă turnabil și să nu plătești în plus pe kilometri inutili.\n\nO autobetonieră transportă până la 8 m³ de beton într-o singură cursă. Dacă ai nevoie de un volum mai mare — de exemplu pentru o placă sau o fundație întreagă — organizăm mai multe curse, iar prețul livrării se înmulțește cu numărul de mașini. La cerere punem la dispoziție și pompă de beton, utilă când turnarea se face în spații greu accesibile sau la înălțime, situație frecventă la casele cu subsol sau la etaj din Ialoveni. Spune-ne adresa exactă și accesul la șantier, iar noi îți confirmăm ora de livrare și numărul de curse necesare.",
        },
        sectionB: {
          title: "Beton, nisip și pietriș pentru proiectele din Ialoveni",
          body:
            "În Ialoveni se construiește mult — case individuale, anexe, garaje, fundații, platforme și împrejmuiri. Pentru fiecare tip de lucrare există o marcă de beton potrivită. Pentru fundațiile caselor și pentru plăci se folosește cel mai des betonul M250 (C16/20) sau M300 (C20/25), care oferă rezistența necesară structurilor portante. Pentru platforme, trotuare, alei și pardoseli este suficient betonul M200 (C12/15), iar pentru straturi de egalizare și umpluturi se poate folosi M150 (C8/10). Dacă nu ești sigur ce marcă îți trebuie, spune-ne ce vrei să torni și te sfătuim la telefon.\n\nPe lângă beton, livrăm în Ialoveni și materialele de bază pentru construcții: nisip de râu și de carieră, spălat, pentru betoane, mortare și tencuieli, precum și pietriș și piatră spartă în diverse fracții, pentru fundații, drenaje și betoane. Aducem totul cu aceeași flotă, astfel încât să nu fii nevoit să comanzi de la mai mulți furnizori — o singură comandă, o singură livrare.\n\nȚinem cont și de sezon: pe timp de vară planificăm livrările dimineața devreme, ca betonul să nu se usuce prea repede pe drum sau la turnare, iar în perioadele reci recomandăm rețete și aditivi potriviți pentru temperaturi scăzute. La fiecare livrare primești certificat de calitate, ca să ai siguranța că marca de beton comandată corespunde standardelor. Fie că ridici o casă nouă la marginea Ialovenilor sau torni o simplă platformă în curte, îți livrăm exact cantitatea și marca de care ai nevoie, la timp și la un preț corect.",
        },
        faq: [
          {
            q: "Cât costă livrarea betonului în Ialoveni?",
            a: "Transportul pornește de la {price} lei pentru o cursă de autobetonieră până în Ialoveni (~{km} km de la cea mai apropiată stație). Prețul exact depinde de adresa ta și de volum și se calculează instant pe hartă. La transport se adaugă prețul mărcii de beton alese, pe m³.",
          },
          {
            q: "Cât de repede ajunge betonul în Ialoveni?",
            a: "Fiind aproape de Chișinău, livrăm de regulă în aceeași zi. Alegem automat stația cea mai apropiată, ca betonul să ajungă proaspăt și turnabil. Sună-ne pentru a confirma ora exactă a livrării.",
          },
          {
            q: "Livrați și nisip sau pietriș în Ialoveni?",
            a: "Da. Pe lângă beton aducem nisip și pietriș (piatră spartă) în Ialoveni, cu aceeași flotă. Sună-ne pentru preț și disponibilitate.",
          },
          {
            q: "Ce marcă de beton îmi trebuie pentru fundație?",
            a: "Pentru fundațiile caselor recomandăm de obicei M250 (C16/20) sau M300 (C20/25). Spune-ne tipul lucrării și îți recomandăm marca potrivită.",
          },
        ],
      },
      ru: {
        title: "Доставка бетона Яловены — цена и быстрая доставка | DARSAN",
        description:
          "Доставка бетона в Яловены автобетоносмесителем по лучшей цене за транспорт. Рассчитайте стоимость на карте. Привозим песок и щебень.",
        h1: "Доставка бетона в Яловены",
        intro:
          "Нужен бетон в Яловены? DARSAN доставляет готовый бетон прямо на ваш объект в городе и окрестностях собственными автобетоносмесителями. Стоимость транспорта вы рассчитываете за секунды на карте, мы автоматически выбираем ближайший завод и привозим бетон быстро и недорого. Доставляем также песок и щебень.",
        sectionA: {
          title: "Доставка бетона в Яловены — цена и сроки",
          body:
            "Яловены находятся всего в нескольких километрах к югу от Кишинёва, поэтому доставка бетона сюда быстрая и недорогая. От ближайшего бетонного узла до города примерно {km} км, а стоимость транспорта начинается от {price} лей за один рейс автобетоносмесителя. Точная сумма зависит от вашего адреса: чем ближе к заводу, тем меньше вы платите за транспорт — реальную цену видно, если передвинуть точку на карте в калькуляторе ниже.\n\nМы охватываем весь город Яловены и окрестные районы — от центра и улиц Александру чел Бун, Штефан чел Маре и Александру Иоан Куза до частного сектора на окраине и соседних сёл, таких как Сочитень, Костешть или Ниморень. У свежего бетона ограниченное рабочее время, поэтому система всегда выбирает ближайший к вам завод, чтобы бетон приезжал пригодным для укладки и вы не переплачивали за лишние километры.\n\nОдин автобетоносмеситель перевозит до 8 м³ бетона за рейс. Если нужен больший объём — например, для плиты или всего фундамента — организуем несколько рейсов, и стоимость доставки умножается на число машин. По запросу предоставляем бетононасос — он полезен при заливке в труднодоступных местах или на высоте, что часто встречается у домов с подвалом или вторым этажом в Яловены. Сообщите точный адрес и условия подъезда, а мы подтвердим время доставки и нужное число рейсов.",
        },
        sectionB: {
          title: "Бетон, песок и щебень для проектов в Яловены",
          body:
            "В Яловены много строят — частные дома, пристройки, гаражи, фундаменты, площадки и ограждения. Для каждого вида работ есть подходящая марка бетона. Для фундаментов домов и плит чаще всего используют бетон M250 (C16/20) или M300 (C20/25), обеспечивающий нужную прочность несущим конструкциям. Для площадок, тротуаров, дорожек и полов достаточно M200 (C12/15), а для выравнивающих слоёв и засыпок — M150 (C8/10). Если не уверены, какая марка нужна, расскажите, что заливаете, и мы подскажем по телефону.\n\nПомимо бетона, мы доставляем в Яловены и основные стройматериалы той же техникой: речной и карьерный песок, мытый, для бетона, растворов и штукатурки, а также щебень и гравий разных фракций для фундаментов, дренажа и бетона. Так вы заказываете всё в одном месте, одной доставкой.\n\nМы учитываем и сезон: летом планируем доставку рано утром, чтобы бетон не подсыхал в дороге и при укладке, а в холодное время рекомендуем рецептуры и добавки для низких температур. При каждой доставке вы получаете сертификат качества — гарантию, что заказанная марка соответствует стандартам. Строите ли вы новый дом на окраине Яловены или заливаете простую площадку во дворе — мы привезём ровно тот объём и марку, что вам нужны, вовремя и по честной цене.",
        },
        faq: [
          {
            q: "Сколько стоит доставка бетона в Яловены?",
            a: "Транспорт начинается от {price} лей за рейс автобетоносмесителя до Яловены (~{km} км от ближайшего завода). Точная цена зависит от адреса и объёма и рассчитывается на карте мгновенно. К транспорту добавляется цена выбранной марки бетона за м³.",
          },
          {
            q: "Как быстро приедет бетон в Яловены?",
            a: "Так как это рядом с Кишинёвом, обычно доставляем в тот же день. Система выбирает ближайший завод, чтобы бетон приехал свежим. Позвоните, чтобы уточнить точное время.",
          },
          {
            q: "Доставляете ли песок и щебень в Яловены?",
            a: "Да. Помимо бетона привозим в Яловены песок и щебень той же техникой. Позвоните, чтобы узнать цену и наличие.",
          },
          {
            q: "Какая марка бетона нужна для фундамента?",
            a: "Для фундаментов домов обычно рекомендуем M250 (C16/20) или M300 (C20/25). Расскажите о работе — подскажем подходящую марку.",
          },
        ],
      },
      en: {
        title: "Concrete delivery Ialoveni — price & fast delivery | DARSAN",
        description:
          "Concrete delivery in Ialoveni by mixer truck at the best transport price. Calculate the cost on the map. We also deliver sand and gravel.",
        h1: "Concrete delivery in Ialoveni",
        intro:
          "Need concrete in Ialoveni? DARSAN delivers ready-mixed concrete straight to your site in the town and around it with our own mixer trucks. You calculate the transport price in seconds on the map, we automatically pick the nearest plant, and deliver fast and cheap. We also deliver sand and gravel.",
        sectionA: {
          title: "Concrete delivery in Ialoveni — cost and timing",
          body:
            "Ialoveni sits just a few kilometres south of Chișinău, so concrete delivery here is fast and cheap. From our nearest concrete plant to the town it is about {km} km, and transport starts at {price} lei for one mixer-truck trip. The exact cost depends on your address: the closer you are to the plant, the less you pay for transport — you can see the real amount by moving the point on the map in the calculator below.\n\nWe cover the whole town of Ialoveni and the surrounding areas — from the centre and the Alexandru cel Bun, Ștefan cel Mare and Alexandru Ioan Cuza streets to the private-house neighbourhoods on the edge of town and nearby villages such as Sociteni, Costești or Nimoreni. Fresh concrete has a limited working time, so our system always picks the plant closest to you, so the concrete arrives workable and you don't overpay for needless kilometres.\n\nOne mixer truck carries up to 8 m³ of concrete per trip. If you need a larger volume — for a slab or a whole foundation, say — we arrange several trips, and the delivery price is multiplied by the number of trucks. On request we also provide a concrete pump, useful when pouring in hard-to-reach spots or at height, common with basement or upper-floor houses in Ialoveni. Tell us the exact address and site access, and we confirm the delivery time and the number of trips needed.",
        },
        sectionB: {
          title: "Concrete, sand and gravel for projects in Ialoveni",
          body:
            "There is a lot of building in Ialoveni — private houses, annexes, garages, foundations, platforms and fences. Each type of work has a suitable concrete grade. For house foundations and slabs, M250 (C16/20) or M300 (C20/25) is used most often, giving the strength load-bearing structures need. For platforms, pavements, paths and floors, M200 (C12/15) is enough, and for levelling layers and fills, M150 (C8/10). If you're unsure which grade you need, tell us what you're pouring and we'll advise you by phone.\n\nBesides concrete, we deliver the basic building materials to Ialoveni with the same fleet: river and quarry sand, washed, for concrete, mortars and plaster, as well as gravel and crushed stone in various fractions for foundations, drainage and concrete. So you order everything in one place, in a single delivery.\n\nWe also account for the season: in summer we schedule deliveries early in the morning so the concrete doesn't dry out on the way or during pouring, and in cold periods we recommend mixes and admixtures suited to low temperatures. With every delivery you get a quality certificate, so you're sure the ordered grade meets the standards. Whether you're raising a new house on the edge of Ialoveni or pouring a simple yard platform, we deliver exactly the volume and grade you need, on time and at a fair price.",
        },
        faq: [
          {
            q: "How much does concrete delivery to Ialoveni cost?",
            a: "Transport starts at {price} lei for one mixer-truck trip to Ialoveni (~{km} km from the nearest plant). The exact price depends on your address and volume and is calculated instantly on the map. The chosen concrete grade is added per m³.",
          },
          {
            q: "How fast does concrete arrive in Ialoveni?",
            a: "Being close to Chișinău, we usually deliver the same day. We automatically pick the nearest plant so the concrete arrives fresh. Call us to confirm the exact time.",
          },
          {
            q: "Do you also deliver sand or gravel to Ialoveni?",
            a: "Yes. Besides concrete we bring sand and gravel (crushed stone) to Ialoveni with the same fleet. Call us for price and availability.",
          },
          {
            q: "Which concrete grade do I need for a foundation?",
            a: "For house foundations we usually recommend M250 (C16/20) or M300 (C20/25). Tell us the type of work and we'll recommend the right grade.",
          },
        ],
      },
    },
  },
  {
    slug: "botanica",
    lat: 46.9817,
    lng: 28.873,
    name: { ro: "Botanica", ru: "Ботаника", en: "Botanica" },
    nearby: ["ialoveni", "centru", "codru"],
    content: {
      ro: {
        title: "Livrare beton Botanica, Chișinău — preț instant | DARSAN",
        description:
          "Livrare beton în sectorul Botanica din Chișinău, la cel mai mic preț pe transport. Calculează costul pe hartă. Aducem și nisip și pietriș.",
        h1: "Livrare beton în sectorul Botanica",
        intro:
          "Torni beton în Botanica? DARSAN livrează beton gata preparat în tot sectorul Botanica din Chișinău, cu autobetoniere proprii și la cel mai mic preț pe transport. Fiind un sector din oraș, livrarea este rapidă și ieftină. Calculează costul exact pe hartă și comandă în câteva secunde — aducem și nisip și pietriș.",
        sectionA: {
          title: "Livrare beton în Botanica — rapid și la preț mic",
          body:
            "Botanica este unul dintre cele mai mari sectoare ale Chișinăului, iar stațiile noastre de betoane sunt aproape, așa că livrarea aici costă puțin pe transport — de la {price} lei pentru o cursă de autobetonieră, la aproximativ {km} km de cea mai apropiată stație. Pentru că ești în oraș, drumul betonului este scurt și betonul ajunge proaspăt, gata de turnat. Prețul real îl vezi imediat, mutând punctul pe hartă la adresa ta din Botanica.\n\nLivrăm în toată Botanica — de la bulevardele Dacia, Traian și Decebal, până la Aeroport, Muncești și zonele de case individuale din sudul sectorului. Deservim atât șantiere mari, cât și lucrări mici de curte. Dacă blocul sau curtea ta are acces mai dificil pentru autobetonieră, spune-ne din timp — la cerere venim cu pompă de beton, care permite turnarea la distanță sau la înălțime fără să aducem mașina lângă cofraj.\n\nO cursă de autobetonieră duce până la 8 m³ de beton. Pentru plăci mari, radiere sau fundații de bloc organizăm mai multe curse, iar prețul livrării se înmulțește cu numărul de mașini necesare. Îți confirmăm din timp ora exactă și numărul de curse, ca turnarea să decurgă fără pauze. Comanda se face simplu: alegi locația pe hartă, vezi prețul și ne suni.",
        },
        sectionB: {
          title: "Beton, nisip și pietriș pentru lucrările din Botanica",
          body:
            "În Botanica se lucrează de toate: de la renovări și consolidări la blocuri, la platforme, parcări, fundații și case în sectorul privat din sudul orașului. Pentru fiecare avem marca potrivită de beton. Pentru fundații și plăci portante se folosește de regulă M250 (C16/20) sau M300 (C20/25); pentru pardoseli, platforme, alei și trotuare este suficient M200 (C12/15); iar pentru egalizări și umpluturi, M150 (C8/10). Pentru elemente cu cerințe mai mari — planșee, stâlpi, grinzi — recomandăm M350 (C25/30). Dacă nu ești sigur, spune-ne ce torni și te sfătuim.\n\nAducem în Botanica și materialele de construcție de bază, cu aceeași flotă: nisip de râu și de carieră, spălat, pentru betoane, mortare și tencuieli, dar și pietriș și piatră spartă în diverse fracții, pentru fundații, drenaje și betoane. Astfel comanzi tot dintr-un singur loc, cu o singură livrare.\n\nLa fiecare livrare primești certificat de calitate pentru marca de beton comandată. Planificăm livrările în funcție de sezon și de programul șantierului, iar în sezonul cald pornim mai devreme, ca betonul să ajungă în condiții optime. Fie că renovezi un apartament, torni o platformă de parcare sau ridici o casă în Botanica, îți livrăm exact cantitatea și marca de care ai nevoie, la timp și transparent la preț.",
        },
        faq: [
          {
            q: "Cât costă livrarea betonului în Botanica?",
            a: "Fiind un sector din oraș, transportul este ieftin — de la {price} lei pe cursă (~{km} km de la cea mai apropiată stație). Prețul exact depinde de adresă și volum și se calculează instant pe hartă; la el se adaugă prețul betonului pe m³.",
          },
          {
            q: "Livrați în toată Botanica?",
            a: "Da, acoperim tot sectorul Botanica — de la Dacia și Decebal până la Muncești, Aeroport și zonele de case din sud. Spune-ne adresa exactă pentru un preț precis.",
          },
          {
            q: "Aveți pompă de beton pentru blocuri?",
            a: "Da, la cerere venim cu pompă de beton, utilă la turnarea în spații greu accesibile sau la înălțime. Anunță-ne din timp despre accesul la șantier.",
          },
          {
            q: "Aduceți și nisip și pietriș în Botanica?",
            a: "Da, livrăm nisip și pietriș în Botanica cu aceeași flotă. Sună-ne pentru preț și disponibilitate.",
          },
        ],
      },
      ru: {
        title: "Доставка бетона Ботаника, Кишинёв — цена онлайн | DARSAN",
        description:
          "Доставка бетона в сектор Ботаника, Кишинёв, по минимальной цене за транспорт. Рассчитайте стоимость на карте. Привозим песок и щебень.",
        h1: "Доставка бетона в секторе Ботаника",
        intro:
          "Заливаете бетон в Ботанике? DARSAN доставляет готовый бетон по всему сектору Ботаника в Кишинёве собственными автобетоносмесителями и по минимальной цене за транспорт. Так как это городской сектор, доставка быстрая и недорогая. Рассчитайте стоимость на карте и закажите за секунды — привозим также песок и щебень.",
        sectionA: {
          title: "Доставка бетона в Ботанике — быстро и недорого",
          body:
            "Ботаника — один из крупнейших секторов Кишинёва, а наши бетонные узлы рядом, поэтому доставка сюда стоит недорого — от {price} лей за рейс автобетоносмесителя, примерно в {km} км от ближайшего завода. Так как вы в городе, путь бетона короткий, и он приезжает свежим, готовым к укладке. Реальную цену видно сразу, если передвинуть точку на карте на ваш адрес в Ботанике.\n\nМы доставляем по всей Ботанике — от бульваров Дачия, Траян и Дечебал до Аэропорта, Мунчешт и частного сектора на юге. Обслуживаем как крупные объекты, так и небольшие дворовые работы. Если к дому или двору сложный подъезд для автобетоносмесителя, сообщите заранее — по запросу приедем с бетононасосом, который позволяет заливать на расстоянии или на высоте, не подгоняя машину к опалубке.\n\nОдин рейс автобетоносмесителя перевозит до 8 м³ бетона. Для больших плит, фундаментных плит или фундаментов зданий организуем несколько рейсов, и стоимость доставки умножается на число машин. Заранее подтверждаем точное время и число рейсов, чтобы заливка шла без пауз. Заказать просто: выбираете место на карте, видите цену и звоните нам.",
        },
        sectionB: {
          title: "Бетон, песок и щебень для работ в Ботанике",
          body:
            "В Ботанике выполняют самые разные работы: от ремонта и усиления в домах до площадок, парковок, фундаментов и домов в частном секторе на юге. Для каждой есть подходящая марка бетона. Для фундаментов и несущих плит обычно используют M250 (C16/20) или M300 (C20/25); для полов, площадок, дорожек и тротуаров достаточно M200 (C12/15); для выравнивания и засыпок — M150 (C8/10). Для элементов с повышенными требованиями — перекрытий, колонн, балок — рекомендуем M350 (C25/30). Если не уверены, расскажите, что заливаете, и мы подскажем.\n\nПривозим в Ботанику и основные стройматериалы той же техникой: речной и карьерный песок, мытый, для бетона, растворов и штукатурки, а также щебень и гравий разных фракций для фундаментов, дренажа и бетона. Так вы заказываете всё в одном месте, одной доставкой.\n\nПри каждой доставке вы получаете сертификат качества на заказанную марку бетона. Планируем доставку с учётом сезона и графика объекта, а в тёплое время выезжаем раньше, чтобы бетон приехал в оптимальном состоянии. Ремонтируете ли вы квартиру, заливаете парковочную площадку или строите дом в Ботанике — привезём ровно тот объём и марку, что нужны, вовремя и прозрачно по цене.",
        },
        faq: [
          {
            q: "Сколько стоит доставка бетона в Ботанике?",
            a: "Так как это городской сектор, транспорт недорогой — от {price} лей за рейс (~{km} км от ближайшего завода). Точная цена зависит от адреса и объёма и считается на карте мгновенно; к ней добавляется цена бетона за м³.",
          },
          {
            q: "Доставляете по всей Ботанике?",
            a: "Да, охватываем весь сектор Ботаника — от Дачии и Дечебала до Мунчешт, Аэропорта и частного сектора на юге. Сообщите точный адрес для точной цены.",
          },
          {
            q: "Есть ли бетононасос для домов?",
            a: "Да, по запросу приезжаем с бетононасосом — он полезен при заливке в труднодоступных местах или на высоте. Сообщите заранее об условиях подъезда.",
          },
          {
            q: "Привозите песок и щебень в Ботанику?",
            a: "Да, доставляем песок и щебень в Ботанику той же техникой. Позвоните, чтобы узнать цену и наличие.",
          },
        ],
      },
      en: {
        title: "Concrete delivery Botanica, Chișinău — instant price | DARSAN",
        description:
          "Concrete delivery in the Botanica district of Chișinău at the lowest transport price. Calculate the cost on the map. We also deliver sand and gravel.",
        h1: "Concrete delivery in the Botanica district",
        intro:
          "Pouring concrete in Botanica? DARSAN delivers ready-mixed concrete across the whole Botanica district of Chișinău with our own mixer trucks and at the lowest transport price. Being a city district, delivery is fast and cheap. Calculate the exact cost on the map and order in seconds — we also deliver sand and gravel.",
        sectionA: {
          title: "Concrete delivery in Botanica — fast and low-cost",
          body:
            "Botanica is one of the largest districts of Chișinău, and our concrete plants are close by, so delivery here is low-cost on transport — from {price} lei for one mixer-truck trip, about {km} km from the nearest plant. Because you're in the city, the concrete's journey is short and it arrives fresh, ready to pour. You see the real price straight away by moving the point on the map to your Botanica address.\n\nWe deliver across all of Botanica — from the Dacia, Traian and Decebal boulevards to the Airport, Muncești and the private-house areas in the south of the district. We serve both large sites and small yard jobs. If your building or yard has awkward access for a mixer truck, tell us in advance — on request we come with a concrete pump, which lets us pour at a distance or at height without bringing the truck up to the formwork.\n\nOne mixer-truck trip carries up to 8 m³ of concrete. For large slabs, raft foundations or building foundations we arrange several trips, and the delivery price is multiplied by the number of trucks needed. We confirm the exact time and the number of trips in advance so the pour runs without pauses. Ordering is simple: pick the location on the map, see the price and call us.",
        },
        sectionB: {
          title: "Concrete, sand and gravel for work in Botanica",
          body:
            "All kinds of work happen in Botanica: from renovations and reinforcement in apartment blocks to platforms, car parks, foundations and houses in the private sector to the south. For each there is a suitable concrete grade. For foundations and load-bearing slabs, M250 (C16/20) or M300 (C20/25) is usually used; for floors, platforms, paths and pavements, M200 (C12/15) is enough; for levelling and fills, M150 (C8/10). For higher-demand elements — floors, columns, beams — we recommend M350 (C25/30). If you're unsure, tell us what you're pouring and we'll advise.\n\nWe also bring the basic building materials to Botanica with the same fleet: river and quarry sand, washed, for concrete, mortars and plaster, plus gravel and crushed stone in various fractions for foundations, drainage and concrete. So you order everything in one place, in a single delivery.\n\nWith every delivery you get a quality certificate for the ordered concrete grade. We plan deliveries around the season and the site schedule, and in warm weather we set out earlier so the concrete arrives in optimal condition. Whether you're renovating a flat, pouring a parking platform or building a house in Botanica, we deliver exactly the volume and grade you need, on time and transparently priced.",
        },
        faq: [
          {
            q: "How much does concrete delivery in Botanica cost?",
            a: "Being a city district, transport is cheap — from {price} lei per trip (~{km} km from the nearest plant). The exact price depends on the address and volume and is calculated on the map instantly; the concrete price per m³ is added on top.",
          },
          {
            q: "Do you deliver across all of Botanica?",
            a: "Yes, we cover the whole Botanica district — from Dacia and Decebal to Muncești, the Airport and the private-house areas in the south. Tell us the exact address for a precise price.",
          },
          {
            q: "Do you have a concrete pump for buildings?",
            a: "Yes, on request we come with a concrete pump, useful for pouring in hard-to-reach spots or at height. Let us know the site access in advance.",
          },
          {
            q: "Do you also bring sand and gravel to Botanica?",
            a: "Yes, we deliver sand and gravel to Botanica with the same fleet. Call us for price and availability.",
          },
        ],
      },
    },
  },
];

export function getDistrict(slug: string): District | undefined {
  return DISTRICTS.find((d) => d.slug === slug);
}

export const DISTRICT_SLUGS = DISTRICTS.map((d) => d.slug);

/**
 * Reference list of remaining proposed localities to add (fill `content` per
 * locale, ≥ 800 words each, then move into DISTRICTS). Coordinates are centroids.
 *
 *   Sectoare Chișinău:  centru 47.023,28.833 · ciocana 47.048,28.905 ·
 *                       buiucani 47.043,28.792 · riscani 47.045,28.855
 *   Suburbii:           codru 46.972,28.812 · durlesti 47.028,28.769 ·
 *                       vatra 47.070,28.762 · stauceni 47.083,28.831 ·
 *                       bacioi 46.921,28.891 · sangera 46.911,28.977 ·
 *                       cricova 47.148,28.858 · ghidighici 47.070,28.700 ·
 *                       truseni 47.075,28.663 · gratiesti 47.093,28.828
 *   Orașe apropiate:    straseni 47.141,28.610 · anenii-noi 46.879,29.229
 */
