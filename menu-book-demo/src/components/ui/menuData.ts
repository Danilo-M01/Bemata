/* ============================================================
   BEMATA MENU DATA — Extracted from restaurant menu images
   Each page corresponds to one page in the physical menu
   ============================================================ */

export interface MenuItem {
  name: string;
  desc?: string;
  price: string;
  macros?: string;
  icons?: string[];
  bold?: boolean;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
  header?: string;
}

export interface MenuPageData {
  title: string;
  subtitle?: string;
  sections: MenuSection[];
  footnote?: string;
}

export const menuPages: MenuPageData[] = [
  // ─── PAGE 1: ALKOHOLNA PIĆA ───
  {
    title: 'ALKOHOLNA PIĆA',
    sections: [
      {
        title: 'BELA VINA 0,75L',
        items: [
          { name: 'Kozlović Malvazija, Istra', price: '(0,15L) 890 / 4600' },
          { name: 'Deurić Gewurztraminer, Srbija', price: '(0,15L) 640 / 3300' },
          { name: 'Lastar Tamjanika, Srbija', price: '(0,15L) 700 / 3500' },
        ],
      },
      {
        title: 'CRVENA VINA',
        items: [
          { name: 'Tarantino Primitivo, Italija', price: '(0,15L) 750 / 3400' },
          { name: 'Kremen Matalj, Srbija', price: '(0,15L) 760 / 3800' },
          { name: 'Ivanović Prokupac, Srbija', price: '(0,15L) 750 / 3400' },
        ],
      },
      {
        title: 'ROZE VINA',
        items: [
          { name: 'Dušica Matalj, Srbija', price: '(0,15L) 540 / 2800' },
        ],
      },
      {
        title: 'PENUŠAVA VINA',
        items: [
          { name: 'Prosecco Treviso, Italija', price: '(0,15L) 730 / 3900' },
        ],
      },
      {
        title: 'PIVA',
        items: [
          { name: 'SALTO Ipa', price: '485' },
          { name: 'SALTO Wit', price: '455' },
          { name: 'Kabinet Brkaa', price: '475' },
          { name: 'Heineken', price: '360' },
          { name: 'Heineken Zero', price: '360' },
        ],
      },
      {
        title: 'RAKIJE',
        items: [
          { name: 'Šljiva, Zarić Kraljica', price: '0,04 / 560' },
          { name: 'Šljiva, Stara Sokolova', price: '0,04 / 560' },
          { name: 'Viljamovka, Zlatna', price: '0,04 / 610' },
          { name: 'Dunja, Zlatna', price: '0,04 / 580' },
          { name: 'Kajsija, Zlatna', price: '0,04 / 560' },
        ],
      },
      {
        title: 'ŽESTOKA PIĆA',
        items: [
          { name: "Gin Hendrik's", price: '0,04 / 650' },
          { name: 'Vodka Finlandia', price: '0,04 / 495' },
          { name: 'Jack Daniels Single Barel', price: '0,04 / 730' },
          { name: 'Jameson', price: '0,04 / 625' },
        ],
      },
      {
        title: 'KOKTELI',
        items: [
          { name: 'Whisper of Ginger', desc: 'đumbir, džin, jabuka, nana', price: '790' },
          { name: 'Aperol Spritz', desc: 'aperol, prosecco, gazirana voda', price: '840' },
          { name: 'Hugo', desc: 'limeta, zova, prosecco', price: '790' },
          { name: 'Mojito', desc: 'rum, nana, agava sirup, gazirana voda', price: '870' },
        ],
      },
    ],
  },
  // ─── PAGE 2: POSLASTICE I TORTE ───
  {
    title: 'POSLASTICE I TORTE',
    sections: [
      {
        title: '',
        items: [
          { name: 'POSLASTICA DANA', price: '595', bold: true },
          { name: 'KOLAČ JAFA', desc: 'indijski orah, badem, pomorandža, kakao, agava, urme', price: '595', bold: true },
          { name: 'KOLAČ OD ŠARGAREPE', desc: 'kolač od šargarepe i oraha sa vanil kremom na bazi orašastih plodova i želeom od pomorandže', price: '595', bold: true },
          { name: 'KOLAČ VUNDERDUO', desc: 'čokoladni kolač od indijskog oraha, urmi, badema, banana, kakao', price: '595', bold: true },
          { name: 'ACAI ČINIJA', desc: 'acai prah, banana, kokos, domaće bademovo mleko, šumsko voće, chia seme, domaća granola', price: '895', bold: true },
          { name: 'CHIA PUDING', desc: 'chia seme, domaće bademovo mleko, domaći bademov puter, kakao i krem od indijskog oraha', price: '735', bold: true },
          { name: 'PALAČINKE VUNDERDUO', desc: 'dve ovsene palačinke, namaz na bazi lešnik putera i vanile, agava sirup', price: '695', bold: true },
          { name: 'PALAČINKE SA NUTELOM', desc: 'dve ovsene palačinke sa domaćom veganskom nutelom, posute mrvljenim bademima', price: '580', bold: true },
          { name: 'BEMATA PALAČINKE', desc: 'palačinke od jabuka i ovsenih pahuljica sa bademovim mlekom i zdravim veganskim karamel prelivom', price: '715', bold: true },
        ],
      },
      {
        title: 'TORTE',
        items: [
          { name: 'JAFA TORTA', desc: '1kg', price: '4200', bold: true },
          { name: 'ŠARGAREPA TORTA', desc: '1kg', price: '4200', bold: true },
          { name: 'VUNDERDUO TORTA', desc: '1kg', price: '4200', bold: true },
        ],
      },
    ],
  },
  // ─── PAGE 3: PREDJELA, PRILOZI, SUPE ───
  {
    title: 'PREDJELA, PRILOZI, SUPE, POTAŽI I SENDVIČI',
    sections: [
      {
        title: '',
        items: [
          { name: 'KUVER', desc: '*obavezan uz svaki obrok osim doručka — domaće pločice od heljde sa domaćim humusom', price: '195', bold: true },
          { name: 'GRILOVANI KOZJI SIR', desc: 'grilovani stari kozji sir sa rukolom i cherry paradajzom', price: '596', bold: true },
          { name: 'TZATZIKI UMAK', desc: 'domaći tzatziki, salsa nar, dehidrirana heljda', price: '413', bold: true },
        ],
      },
      {
        title: 'SUPE',
        items: [
          { name: 'PILEĆA SUPA', price: '390', bold: true },
          { name: 'PARADAJZ ČORBA', price: '480', bold: true },
          { name: 'POTAŽ DANA', price: '440', bold: true },
        ],
      },
      {
        title: 'SALATE',
        items: [
          { name: 'BATAT IZ RERNE', desc: 'batat krompir, veganski majonez na bazi orašastih plodova', price: '465', bold: true },
          { name: 'MIKS ZELENIH SALATA', desc: 'rukola, bejbi spanać, iceberg, badem i aceto dresing', price: '395', bold: true },
          { name: 'ŠARENA SALATA', desc: 'avokado, krastavac, paradajz, kukuruz', price: '495', bold: true },
          { name: 'SALATA SA KOZJIM SIROM', desc: 'paradajz, krastavac, masline, kozji sir', price: '525', bold: true },
        ],
      },
      {
        title: 'SENDVIČI',
        items: [
          { name: 'SENDVIČ PILETINA', desc: 'hleb spelta, piletina, kozji sir, miks salata', price: '740', bold: true },
          { name: 'SENDVIČ SEZONSKO VOĆE', desc: 'zemička spelte, veganska rikota, med i sezonsko voće', price: '740', bold: true },
        ],
      },
    ],
    footnote: 'Kroz opis jela u meniju upoznajemo vas sa namirnicama koje sadrže alergene, ali zbog upotrebe više sastojaka u kuhinji, ne možemo da garantujemo da određena hrana nije došla u dodir sa alergenim namirnicama.',
  },
  // ─── PAGE 4: KAFE ───
  {
    title: 'KAFE',
    sections: [
      {
        title: '',
        items: [
          { name: 'Espresso', price: '245' },
          { name: 'Espresso sa mlekom', price: '285' },
          { name: 'Machiato', price: '265' },
          { name: 'Cappuccino', price: '295' },
          { name: 'Espresso sa domaćim bademovim mlekom', price: '355' },
          { name: 'Espresso sa sojinim mlekom', price: '355' },
          { name: 'Cappuccino sa domaćim bademovim mlekom', price: '385' },
          { name: 'Cappuccino sa sojinim mlekom', price: '385' },
          { name: 'Dupli espresso', price: '355' },
          { name: 'Dupli espresso sa mlekom', price: '390' },
          { name: 'Dupli espresso sa domaćim bademovim mlekom', price: '435' },
          { name: 'Dupli espresso sa sojinim mlekom', price: '435' },
          { name: 'Latte', price: '320' },
          { name: 'Latte sa domaćim bademovim mlekom', price: '410' },
          { name: 'Latte sa sojinim mlekom', price: '410' },
          { name: 'Caffe Freddo', price: '400' },
          { name: 'Beskofeinski espresso', price: '265' },
          { name: 'Beskofeinski espresso sa domaćim bademovim mlekom', price: '375' },
          { name: 'Beskofeinski espresso sa mlekom', price: '310' },
          { name: 'Beskofeinski espresso sa sojinim mlekom', price: '375' },
          { name: 'Beskofeinski cappuccino', price: '320' },
        ],
      },
      {
        title: 'BEMATA SPECIALTIES',
        items: [
          { name: 'Matcha Latte sa domaćim bademovim mlekom', price: '465' },
          { name: 'Matcha Latte sa sojinim mlekom', price: '465' },
          { name: 'BEMATA Mocha Coffee', desc: 'espresso, soja, lešnik, cimet', price: '495' },
          { name: 'BEMATA Ledeni Čaj', desc: 'čaj bobičastog voća, agava, limun, nana', price: '355' },
        ],
      },
    ],
  },
  // ─── PAGE 5: ČAJEVI ───
  {
    title: 'Čajevi',
    sections: [
      {
        title: '',
        items: [
          { name: 'GUNPOWDER', desc: 'zeleni čaj', price: '320', bold: true },
          { name: 'MAČAK U ČIZMAMA', desc: 'crni čaj sa aromom karamele i kakaa', price: '320', bold: true },
          { name: 'SICILIJA', desc: 'šipak, jabuka, hibiskus, pomorandža, ružaneven', price: '320', bold: true },
          { name: 'AYURVEDIC YOGI', desc: 'zeleni čaj, đumbir, limun', price: '320', bold: true },
          { name: 'FENG SHUI', desc: 'zeleni čaj, sencha, jasmin, breskva, kurkuma, božur', price: '320', bold: true },
          { name: 'EARL GRAY SUPERIOR', desc: 'crni ruhuna čaj, cvet pomorandže, aroma bergama', price: '320', bold: true },
          { name: 'PAI MU TAN', desc: 'beli čaj', price: '320', bold: true },
          { name: 'CEYLON OP NUWARA', desc: 'crni celonski čaj', price: '320', bold: true },
          { name: 'BORA BORA', desc: 'suvo grožđe, zova, papaja, hibiskus, jabuka, crna ribizla', price: '320', bold: true },
          { name: 'NANA', price: '320', bold: true },
          { name: 'KAMILICA', price: '320', bold: true },
        ],
      },
    ],
  },
  // ─── PAGE 6: BEMATA LOGO (divider page) ───
  {
    title: '',
    sections: [],
  },
  // ─── PAGE 7: DORUČAK ───
  {
    title: 'DORUČAK',
    subtitle: '(služimo do 13h)',
    sections: [
      {
        title: '',
        items: [
          { name: 'KAJGANA SA SPANĆEM I KOZJIM SIROM', desc: '3 jaja, spanać i kozji sir, bejbi miks salata, domaći hleb od heljde', price: '868', bold: true },
          { name: 'KAJGANA SA AVOKADOM', desc: '3 jaja, avokado, paradajz, rukola, domaći hleb od heljde', price: '935', bold: true },
          { name: 'FRITATA', desc: 'pečena jaja sa povrćem, grčkim jogurtom, bejbi miks salata, domaći hleb od heljde', price: '795', bold: true },
          { name: 'JAJA NA OKO', desc: '3 jaja sa prilogom od spanača i belog luka, pečurke, domaći hleb od heljde', price: '868', bold: true },
          { name: 'POŠIRANA JAJA NA PALENTI', desc: '2 poširana jaja na palenti, rukola', price: '685', bold: true },
          { name: 'AVOKADO TOST SA HUMUSOM', desc: 'avokado, domaći humus, domaći hleb od heljde', price: '870', bold: true },
          { name: 'POŠIRANA JAJA NA AVOKADO TOSTU', desc: 'poširana jaja, avokado mus na dva parčeta domaćeg heljdinog hleba', price: '815', bold: true },
        ],
      },
      {
        title: 'KAŠE',
        items: [
          { name: 'BEMATA KAŠA', desc: 'ovsene pahuljice, domaće bademovo mleko, banana, kikiriki puter, šumsko voće, agava', price: '795', bold: true },
          { name: 'ČOKO KAŠA', desc: 'ovsene pahuljice, banana, domaće bademovo mleko, lešnik puter, kakao, agava', price: '795', bold: true },
          { name: 'VOĆNA KAŠA', desc: 'ovsene pahuljice, grčki jogurt, jabuka, agava sirup, badem puter, šumsko voće', price: '795', bold: true },
        ],
      },
      {
        title: '',
        items: [
          { name: 'BEMATA PALAČINKE', desc: 'palačinke od jabuke i ovsenih pahuljica sa bademovim mlekom i zdravim karamel prelivom', price: '715', bold: true },
        ],
      },
    ],
    footnote: 'DODACI JELIMA: kozji sir 40g/270, veganska nutela 60g/195, kikiriki puter 60g/165, dimljeni losos 20g/299, grčki jogurt sa limetom i medom 60g/165, grilovana banana na kokosovom ulju 220, jaje 1 kom/85, tofu sir 250',
  },
  // ─── PAGE 8: GLAVNA JELA ───
  {
    title: 'GLAVNA JELA',
    sections: [
      {
        title: '',
        items: [
          { name: 'PILETINA U CRVENOM SOSU', desc: 'suvidirana piletina sa origano začinom, marinirani šampinjoni, domaći pelat, sos od bosiljka', price: '1605', bold: true },
          { name: 'GIROS SA PILEĆIM BATAKOM', desc: 'tortilja od ovsa, pileći batak, crveni kupus, tzatziki sa grčkim jogurtom, pečeni batat pomfrit', price: '1095', bold: true },
          { name: 'ČINIJA PILETINA', desc: 'pileći file, avokado, kinoa, kozji sir', price: '1695', bold: true },
          { name: 'RAMSTEK', desc: 'juneći ramstek sa musom od batat krompira i spanačem sa belim lukom', price: '2295', bold: true },
          { name: 'TUNA VERDE', desc: 'tuna u kockama marinirana citrusnim sokom, kremasti spanać, kus kus', price: '2125', bold: true },
          { name: 'PILETINA KURKUMA', desc: 'suvidirana piletina sa kurkuma začinom, mus od brokolija, integralna riža', price: '1585', bold: true },
          { name: 'LOSOS VITALITY', desc: 'grilovani file lososa, integralna riža, salsa sa paradajzom, krastavcem i maslinama', price: '1895', bold: true },
          { name: 'ZUDLE PESTO PILETINA', desc: 'špagete od sirovih tikvica sa domaćim alfredo sosom od orašastih plodova, domaći pesto od bosiljka, pileći file', price: '1445', bold: true },
        ],
      },
    ],
    footnote: 'DODACI: PROTEINI — pileći file 100g/399, ramstek 100g/1062, tuna 100g/1016, dimljeni losos 100g/593, jaje 1kom/85, parmezan 40g/295, kozji sir 40g/270 | UGLJENI HIDRATI — humus 100g/235, batat kocke 100g/370, avokado pol./290, pesto boranija 100g/425, paradajz 100g/140, integralni pirinač 100g/240, grilovano povrće 100g/225, heljdine pločice 100g/180, hleb heljda 3 parč./125',
  },
  // ─── PAGE 9: VEGANSKA/VEGETARIJANSKA JELA ───
  {
    title: 'VEGANSKA / VEGETARIJANSKA JELA',
    sections: [
      {
        title: '',
        items: [
          { name: 'KRANČI TOFU', desc: 'tofu sir u kranči korici od kukuruznih pahuljica, miso dresing, integralni pirinač, povrće', price: '1535', bold: true },
          { name: 'LAZANJA', desc: 'pirinčane kore, domaći pelat, pečurke, sos na bazi orašastih plodova, veganski parmezan', price: '1485', bold: true },
          { name: 'VEGE BURGER', desc: 'burger na bazi pasulja, ovsenih pahuljica i speltnog brašna na nana hlebu, iceberg, ljubičasti luk sa veganskim majonezom', price: '1389', bold: true },
          { name: 'RIŽOTO ŠUMSKE PEČURKE', desc: 'integralna riža sa bukovačom, lisičarkama, šampinjonima, mladim lukom, vinom i parmezanom', price: '1175', bold: true },
          { name: 'RIŽOTO SPANAĆ', desc: 'integralna riža, mus od spanača, kozji sir', price: '1170', bold: true },
        ],
      },
    ],
    footnote: 'DODACI: PROTEINI — pileći file 100g/399, ramstek 100g/1062, tuna 100g/1016, dimljeni losos 40g/593, jaje 1kom/85, parmezan 40g/295, kozji sir 40g/270 | UGLJENI HIDRATI — humus 100g/235, batat kocke 100g/370, avokado pol./290, pesto boranija 100g/425, paradajz 100g/140, integralni pirinač 100g/240, grilovano povrće 100g/225, heljdine pločice 100g/180, hleb heljda 3 parč./125',
  },
  // ─── PAGE 10: OBROK SALATE ───
  {
    title: 'OBROK SALATE',
    sections: [
      {
        title: '',
        items: [
          { name: 'PILEĆA SALATA', desc: 'pileći file, edamame, cherry paradajz, kupus, šargarepa, krutoni od spelte, dresing od badema', price: '1195', bold: true },
          { name: 'CEZAR SALATA', desc: 'iceberg miks, matovilac, tofu, veganski parmezan, dresing na bazi indijskog oraha *dodatak piletina', price: '885', bold: true },
          { name: 'BATAT LEBLEBIJA SALATA', desc: 'batat krompir, kuvane leblebije, rukola, cherry paradajz, tahini dresing', price: '845', bold: true },
          { name: 'FALAFEL SALATA SA HUMUSIMA', desc: 'domaći humusi, miks salata iceberg, rukola i matovilac, cherry paradajz, domaći falafel', price: '1115', bold: true },
          { name: 'GOLDEN KARFIOL SALATA', desc: 'miks salata sa pečenim kurkuma karfiolom i leblebijom, crveno sočivo, cherry paradajz, mladi luk, miso dresing', price: '845', bold: true },
        ],
      },
    ],
    footnote: 'DODACI: PROTEINI — pileći file 100g/399, ramstek 100g/1062, tuna 100g/1016, dimljeni losos 100g/593, jaje 1kom/85, parmezan 40g/295, kozji sir 40g/270 | UGLJENI HIDRATI — humus 100g/235, batat kocke 100g/370, avokado pol./290, pesto boranija 100g/425, paradajz 100g/140, integralni pirinač 100g/240, grilovano povrće 100g/225, heljdine pločice 100g/180, hleb heljda 3 parč./125',
  },
  // ─── PAGE 11: PROTEINSKI JELOVNIK 1 ───
  {
    title: 'PROTEINSKI JELOVNIK',
    sections: [
      {
        title: 'Doručak (služimo do 13h)',
        header: 'C-P-F-Cal',
        items: [
          { name: 'PROTEINSKA KAŠA', desc: 'ovsene pahuljice, čija semenke, badem mleko, Whey protein vanile, badem puter, šumsko voće', price: '875', macros: '43-35-14-449', bold: true },
          { name: 'PROTEINSKA TORTILJA', desc: '3 cela jajeta, jedno belance, grčki jogurt, bejbi spanać, paradajz, parmezan, domaći hleb od heljde', price: '695', macros: '33-37-26-519', bold: true },
          { name: 'PROTEINSKA KAJGANA', desc: '3 cela jajeta, jedno belance, ajzberg, avokado mus, dimljeni losos, čeri paradajz na hlebu od sočiva', price: '999', macros: '28-37-25-488', bold: true },
        ],
      },
      {
        title: '',
        items: [
          { name: 'PROTEINSKA ČORBA', desc: 'peršun, leblebije, šampinjoni, kim, kurkuma, protein graška', price: '480', macros: '11-13-11-197', bold: true },
          { name: 'PROTEINSKA PITA', desc: 'pirinčani papir, spanać, kozji sir, tofu, jaje, grčki jogurt', price: '860', macros: '28-29-23-439', bold: true },
          { name: 'PROTEINSKA TORTILJA SA ĆURETINOM', desc: 'tortilja od sočiva sa namazom grčkog jogurta i domaćeg pesto sosa, ćuretina, batat, paradajz', price: '1180', macros: '43-54-4-432', bold: true },
        ],
      },
      {
        title: 'Proteinske salate',
        items: [
          { name: 'PROTEINSKA SALATA SA PILETINOM', desc: 'piletina, ajzberg, čeri paradajz, celer, sos na bazi grčkog jogurta', price: '1399', macros: '25-53-17-478', bold: true },
          { name: 'PROTEINSKA SALATA SA ĆURETINOM', desc: 'mlevena ćuretina, batat kocke, parmezan, sos na bazi grčkog jogurta i veganskog majoneza', price: '1399', macros: '44-54-18-575', bold: true },
        ],
      },
    ],
    footnote: 'MAKRONUTRIJENTI LEGENDA: • C- Ugljeni hidrati • P- Proteini • F- Masti • Cal- Kalorije',
  },
  // ─── PAGE 12: PROTEINSKI JELOVNIK 2 ───
  {
    title: 'PROTEINSKI JELOVNIK',
    sections: [
      {
        title: 'Glavna jela 150g/250g',
        header: 'C-P-F-Cal',
        items: [
          { name: 'RAMSTEK', price: '1911/2940', macros: '0-32,3-10,5-225\n0-53,8-17,5-375', bold: true },
          { name: 'PILETINA', price: '535/825', macros: '0-33,8-3,9-180\n0-56,3-6,5-300', bold: true },
          { name: 'ĆURETINA', price: '880/1388', macros: '0-34,6-1,8-167\n0-57,8-3-276', bold: true },
          { name: 'LOSOS', price: '1412/2244', macros: '0-33-18,6-309\n0-55-31-515', bold: true },
          { name: 'TUNA', price: '990/2144', macros: '0,8-36-1,2-158\n1,3-60-2-263', bold: true },
        ],
      },
      {
        title: 'Prilozi 100g (kuvano)',
        items: [
          { name: 'INTEGRALNI PIRINAČ SA PARMEZANOM', price: '335', macros: '23-4,6-6,9-173', bold: true },
          { name: 'HELJDA ZRNO', price: '216', macros: '19,9-3,4-0,6-92', bold: true },
          { name: 'BATAT KOCKE', price: '350', macros: '21-2-5,1-135', bold: true },
          { name: 'AMARANT', price: '480', macros: '19-3,8-1,6-102', bold: true },
          { name: 'KINOA', price: '556', macros: '21,3-4,1-1,9-120', bold: true },
          { name: 'SOTIRANI SPANAĆ', price: '440', macros: '2-4-7-95', bold: true },
          { name: 'PESTO BORANIJA', price: '255', macros: '7,5-2,5-8,2-110', bold: true },
          { name: 'GRILOVANO POVRĆE', price: '275', macros: '12-2-5,4-100', bold: true },
        ],
      },
      {
        title: 'Poslastice',
        items: [
          { name: 'PROTEINSKI WAFL', desc: 'ovsene pahuljice, jaja, badem mleko, cimet, grčki jogurt, šumsko voće, Whey protein od vanile', price: '999', macros: '55-47-20-597', bold: true },
          { name: 'PROTEINSKI KOLAČ', desc: 'kolač na bazi indijskog oraha, badema, kakaa, Whey protein vanile, šumsko voće, urme', price: '500', macros: '29-26,3-23,1-438', bold: true },
          { name: 'PROTEINSKI SMOOTHIE', desc: 'šumsko voće, čija semenke, badem mleko, Whey protein vanile', price: '865', macros: '18-30-10-292', bold: true },
        ],
      },
    ],
  },
  // ─── PAGE 13: PIĆA ───
  {
    title: 'PIĆA',
    sections: [
      {
        title: 'VODE',
        items: [
          { name: 'Rosa', price: '0,33 / 320' },
          { name: 'Rosa', price: '0,75 / 450' },
          { name: 'Rosa Gazirana', price: '0,33 / 320' },
          { name: 'Rosa Gazirana', price: '0,75 / 450' },
          { name: 'Aqua Panna', price: '0,25 / 390' },
          { name: 'Aqua Panna', price: '0,75 / 600' },
          { name: 'San Pellegrino', price: '0,25 / 400' },
          { name: 'San Pellegrino', price: '0,75 / 600' },
          { name: 'Romequelle', desc: 'limunska trava', price: '0,33 / 340' },
        ],
      },
      {
        title: 'SVEŽE CEĐENI SOKOVI',
        items: [
          { name: 'Jabuka', price: '0,25 / 320' },
          { name: 'Šargarepa', price: '0,25 / 325' },
          { name: 'Celer', price: '0,25 / 590' },
          { name: 'Pomorandža', price: '0,30 / 460' },
          { name: 'Grejp', price: '0,30 / 500' },
          { name: 'Limunada', price: '0,30 / 365' },
          { name: 'Limunada sa mentom', price: '0,30 / 385' },
          { name: 'Limunada sa đumbirom', price: '0,30 / 385' },
        ],
      },
      {
        title: 'MIKS SOKOVI',
        items: [
          { name: 'VITAMINSKI MIKS', desc: 'đumbir, pomorandža, šargarepa, jabuka', price: '0,25 / 490', bold: true },
          { name: 'ČISTAČ', desc: 'celer, krastavac, spanać, peršun, mirođija, jabuka, limun', price: '0,25 / 500', bold: true },
          { name: 'CITRUS MIKS', desc: 'pomorandža, grejp, limun', price: '0,30 / 500', bold: true },
          { name: 'GVOZDENI MIKS', desc: 'cvekla, đumbir, limun, jabuka, spanać', price: '0,25 / 520', bold: true },
        ],
      },
      {
        title: 'SMOOTHIES',
        items: [
          { name: 'ČOKO PROTEIN', desc: 'veganski domaći krem, domaći kikiriki puter, konopljin protein, domaće bademovo mleko, banana', price: '0,30 / 695', bold: true },
          { name: 'BANANA MILKŠEJK', desc: 'banana, pomorandža, kokos krem', price: '0,30 / 545', bold: true },
        ],
      },
    ],
  },
];
