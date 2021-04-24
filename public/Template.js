class Template {
  constructor(html, data, scope) {
    this.html = html;
    this.data = data;
    this.events = {};
    this.scope = scope;
  }

  assemble(literal, params) {
    return new Function(params, 'return `' + literal + '`;');
  }

  compile(target) {
    let html,
      template;

    html = this.compileFor(this.html);
    html = this.compileEvents(html);

    // console.log(this.events);
    // console.log(html);

    template = this.assemble(html, 'data').bind(this);
    html = template(this.data);
    // console.log(html);

    target.outerHTML = html;

    this.executeEvents(this.events);
  }

  compileEvents(html) {
    const regex = /\s+data-on-(\w+)=\"(\w+)\(?(\'?\w+\.?\w+?\'?)\)?\"/gm,
      matches = this.matchAll(html, regex); // Match all events in the template

    let index,
      length
      /*,
                  list*/
      ;

    // Analize the matched events and build a suitable list of them
    index = 0;
    length = matches.length;
    while (index < length) {
      // list = this.events[matches[index][1]] || [];

      // list.push({
      //     method: matches[index][2],
      //     params: matches[index][3]
      // });

      // this.events[matches[index][1]] = list;

      // Allocate events in the template events space
      this.events[matches[index][1]] = [];

      html = html.replace(
        // /\s+data-on-\w+=\"\w+\(?\'?\w+\.?\w+\'?\)?\"/m,
        matches[index][0],
        ` \${this.registerEvent('${matches[index][0]}', '${matches[index][1]}', '${matches[index][2]}', ${matches[index][3]})}`
      );

      ++index;
    }

    return html;
  }

  compileFor(html) {
    let forStatement = this.parseFor(html);

    // Clean the data-for statement from the template HTML
    html = html.replace(/\s+data-for=\"(\w+)\s+in\s+(\w+)\"/gm, '');

    html = '${' + 'data' + '.map((' + forStatement.iterator + ', index) => ' +
      '`' + html + '`).join(\'\')}';

    return html
  }

  executeEvents(events) {
    const eventTypes = Object.keys(events);
    // console.log(eventTypes);

    let index,
      length,
      elements;

    index = 0;
    length = eventTypes.length;
    while (index < length) {
      let eventType = eventTypes[index];

      elements = Array.from(document.querySelectorAll(`[data-on-${eventType}]`));

      elements.map((element, elementIndex) => {
        // console.log(elementIndex, scope[events[eventType][elementIndex].method]);
        element.addEventListener(eventType, event => {
          this.scope[events[eventType][elementIndex].method](event, events[eventType][elementIndex].params)
        });
      });

      // console.log(elements);
      ++index;
    }
  }

  matchAll(str, regex) {
    let match,
      result = [];

    while ((match = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      result.push(match);
    }

    return result;
  }

  parseFor(html) {
    const regex = /\s+data-for=\"(\w+)\s+in\s+(\w+)\"/gm,
      match = regex.exec(html),
      result = {
        iterator: match[1],
        collection: match[2]
      };

    return result;
  }

  registerEvent(eventSignature, type, method, params) {
    this.events[type].push({
      method: method,
      params: params
    });

    // console.log(Array.from(arguments));

    // return `data-on-${type}="${method}"`;
    return eventSignature.trim();
  }
}

const target = document.querySelector('#people')
const html = target.innerHTML
const scope = {
  select: function () {
    console.log(arguments);
  },
  onMouseOver: function () {
    console.log(arguments);
  }
}

const data = [
  {
    "index": 0,
    "firstName": "Barrera",
    "lastName": "Mendez",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (929) 549-2859",
    "address": "943 Saratoga Avenue, Belgreen, California, 3948"
  },
  {
    "index": 1,
    "firstName": "Greta",
    "lastName": "Graham",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (828) 554-2479",
    "address": "402 Garden Street, Herlong, Washington, 690"
  },
  {
    "index": 2,
    "firstName": "Rosetta",
    "lastName": "Pugh",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (805) 529-3721",
    "address": "483 Krier Place, Freelandville, Missouri, 6527"
  },
  {
    "index": 3,
    "firstName": "Terrie",
    "lastName": "Andrews",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (878) 579-3797",
    "address": "279 Kingsway Place, Roulette, Colorado, 7584"
  },
  {
    "index": 4,
    "firstName": "Hood",
    "lastName": "Dunn",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (934) 463-3520",
    "address": "552 Howard Avenue, Bennett, Arkansas, 3311"
  },
  {
    "index": 5,
    "firstName": "Banks",
    "lastName": "Hays",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (847) 528-2427",
    "address": "660 Chase Court, Ribera, Northern Mariana Islands, 7503"
  },
  {
    "index": 6,
    "firstName": "Marion",
    "lastName": "Chambers",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (976) 415-2460",
    "address": "440 Olive Street, Ahwahnee, Louisiana, 9021"
  },
  {
    "index": 7,
    "firstName": "Casandra",
    "lastName": "Carlson",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (885) 581-3950",
    "address": "340 Batchelder Street, Odessa, Virginia, 834"
  },
  {
    "index": 8,
    "firstName": "Victoria",
    "lastName": "Short",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (866) 563-2904",
    "address": "633 Baughman Place, Durham, New York, 4304"
  },
  {
    "index": 9,
    "firstName": "Webb",
    "lastName": "Martin",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (893) 510-3163",
    "address": "272 Eastern Parkway, Rivereno, Illinois, 7121"
  },
  {
    "index": 10,
    "firstName": "King",
    "lastName": "Mendoza",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (946) 510-2467",
    "address": "332 Canal Avenue, Riverton, Puerto Rico, 9715"
  },
  {
    "index": 11,
    "firstName": "Wendi",
    "lastName": "Preston",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (996) 462-2745",
    "address": "623 Emerald Street, Aurora, Virgin Islands, 2659"
  },
  {
    "index": 12,
    "firstName": "Murphy",
    "lastName": "Sparks",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (998) 506-2710",
    "address": "926 Bayview Avenue, Groveville, South Carolina, 8651"
  },
  {
    "index": 13,
    "firstName": "Ella",
    "lastName": "Patrick",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (980) 412-2553",
    "address": "938 Powers Street, Longbranch, North Dakota, 9513"
  },
  {
    "index": 14,
    "firstName": "Blanca",
    "lastName": "Fulton",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (894) 584-2280",
    "address": "729 Meadow Street, Cornfields, Federated States Of Micronesia, 3277"
  },
  {
    "index": 15,
    "firstName": "Karyn",
    "lastName": "Ramsey",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (974) 457-2678",
    "address": "753 Bayview Place, Garnet, Rhode Island, 4404"
  },
  {
    "index": 16,
    "firstName": "Huber",
    "lastName": "Nelson",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (991) 520-3411",
    "address": "383 Amboy Street, Bascom, Maryland, 4501"
  },
  {
    "index": 17,
    "firstName": "Amanda",
    "lastName": "Bates",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (995) 582-3757",
    "address": "398 India Street, Statenville, Marshall Islands, 8486"
  },
  {
    "index": 18,
    "firstName": "Lesley",
    "lastName": "Grant",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (985) 429-2145",
    "address": "309 Crystal Street, Brule, Alaska, 4611"
  },
  {
    "index": 19,
    "firstName": "Fannie",
    "lastName": "Holland",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (803) 438-3684",
    "address": "866 Eckford Street, Coalmont, Wyoming, 7011"
  },
  {
    "index": 20,
    "firstName": "Lois",
    "lastName": "Scott",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (850) 534-3623",
    "address": "239 Kimball Street, Savage, Kansas, 8581"
  },
  {
    "index": 21,
    "firstName": "Mendoza",
    "lastName": "Adams",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (961) 520-3705",
    "address": "641 Neptune Court, Diaperville, Idaho, 3467"
  },
  {
    "index": 22,
    "firstName": "Mendez",
    "lastName": "Daniels",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (922) 494-2960",
    "address": "128 Grand Street, Lawrence, Massachusetts, 5221"
  },
  {
    "index": 23,
    "firstName": "Johns",
    "lastName": "Silva",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (914) 495-3036",
    "address": "265 Kenmore Terrace, Bedias, Montana, 2659"
  },
  {
    "index": 24,
    "firstName": "Teresa",
    "lastName": "Robinson",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (865) 478-2274",
    "address": "142 Kings Hwy, Sparkill, New Hampshire, 5165"
  },
  {
    "index": 25,
    "firstName": "Ester",
    "lastName": "Levy",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (972) 444-2604",
    "address": "284 Beaver Street, Romeville, Iowa, 6221"
  },
  {
    "index": 26,
    "firstName": "Angie",
    "lastName": "Phillips",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (995) 475-3925",
    "address": "244 Bushwick Avenue, Clarence, North Carolina, 3639"
  },
  {
    "index": 27,
    "firstName": "Malinda",
    "lastName": "Mccullough",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (995) 496-3142",
    "address": "350 Cedar Street, Elbert, Tennessee, 962"
  },
  {
    "index": 28,
    "firstName": "Ava",
    "lastName": "Bridges",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (951) 456-3399",
    "address": "795 Dean Street, Coleville, Kentucky, 1347"
  },
  {
    "index": 29,
    "firstName": "Myrtle",
    "lastName": "Chandler",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (963) 589-2095",
    "address": "598 Lacon Court, Valmy, Delaware, 1192"
  },
  {
    "index": 30,
    "firstName": "Lena",
    "lastName": "Myers",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (923) 427-3173",
    "address": "876 Sutter Avenue, Jamestown, Oklahoma, 381"
  },
  {
    "index": 31,
    "firstName": "Latisha",
    "lastName": "Webb",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (917) 458-2444",
    "address": "114 Greene Avenue, Rowe, Connecticut, 415"
  },
  {
    "index": 32,
    "firstName": "Mccall",
    "lastName": "Banks",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (900) 501-2685",
    "address": "171 Truxton Street, Sultana, Georgia, 7481"
  },
  {
    "index": 33,
    "firstName": "Carly",
    "lastName": "Yang",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (980) 479-3762",
    "address": "824 Aitken Place, Goodville, Wisconsin, 9896"
  },
  {
    "index": 34,
    "firstName": "Avis",
    "lastName": "Roach",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (821) 441-3130",
    "address": "736 Lois Avenue, Felt, Michigan, 9527"
  },
  {
    "index": 35,
    "firstName": "Pearl",
    "lastName": "Osborne",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (914) 600-3641",
    "address": "231 Engert Avenue, Neahkahnie, Mississippi, 3938"
  },
  {
    "index": 36,
    "firstName": "Battle",
    "lastName": "Campos",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (962) 559-2751",
    "address": "964 Vanderbilt Street, Berlin, Maine, 2017"
  },
  {
    "index": 37,
    "firstName": "Garrison",
    "lastName": "Olson",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (992) 460-3483",
    "address": "850 Ralph Avenue, Wright, Alabama, 233"
  },
  {
    "index": 38,
    "firstName": "Mooney",
    "lastName": "Barlow",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (837) 455-3092",
    "address": "529 Ridge Court, Dalton, District Of Columbia, 230"
  },
  {
    "index": 39,
    "firstName": "Craft",
    "lastName": "Spencer",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (832) 500-2281",
    "address": "889 Kosciusko Street, Aguila, Pennsylvania, 7688"
  },
  {
    "index": 40,
    "firstName": "Hopkins",
    "lastName": "Riley",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (877) 420-3598",
    "address": "954 Reeve Place, Mammoth, Nebraska, 6063"
  },
  {
    "index": 41,
    "firstName": "Trujillo",
    "lastName": "Christensen",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (892) 471-2648",
    "address": "794 Halsey Street, Katonah, Palau, 1172"
  },
  {
    "index": 42,
    "firstName": "Lavonne",
    "lastName": "Hopkins",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (920) 577-3017",
    "address": "547 Dare Court, Mathews, South Dakota, 3938"
  },
  {
    "index": 43,
    "firstName": "Ruiz",
    "lastName": "Erickson",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (891) 534-3564",
    "address": "758 Matthews Court, Sharon, New Mexico, 5909"
  },
  {
    "index": 44,
    "firstName": "Gertrude",
    "lastName": "Simmons",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (948) 565-3879",
    "address": "382 Orient Avenue, Juarez, Nevada, 1199"
  },
  {
    "index": 45,
    "firstName": "Faith",
    "lastName": "Franco",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (974) 408-3158",
    "address": "967 Arion Place, Umapine, Indiana, 7053"
  },
  {
    "index": 46,
    "firstName": "Earlene",
    "lastName": "Molina",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (961) 531-3907",
    "address": "732 Chestnut Avenue, Grazierville, Arizona, 7652"
  },
  {
    "index": 47,
    "firstName": "June",
    "lastName": "Payne",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (920) 532-3522",
    "address": "446 Grimes Road, Nicholson, Ohio, 5724"
  },
  {
    "index": 48,
    "firstName": "Wallace",
    "lastName": "Melendez",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (817) 492-2768",
    "address": "514 Linwood Street, Darrtown, Oregon, 1584"
  },
  {
    "index": 49,
    "firstName": "Iva",
    "lastName": "Caldwell",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (894) 488-2926",
    "address": "202 Withers Street, Richford, West Virginia, 1516"
  },
  {
    "index": 50,
    "firstName": "Lisa",
    "lastName": "Hill",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (964) 566-3626",
    "address": "723 Schermerhorn Street, Brady, American Samoa, 869"
  },
  {
    "index": 51,
    "firstName": "Jaime",
    "lastName": "Maddox",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (938) 435-3067",
    "address": "927 Seagate Avenue, Beaverdale, Vermont, 6243"
  },
  {
    "index": 52,
    "firstName": "Felicia",
    "lastName": "Rojas",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (821) 576-2100",
    "address": "830 Hooper Street, Woodruff, Utah, 151"
  },
  {
    "index": 53,
    "firstName": "Tamera",
    "lastName": "Irwin",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (932) 521-2264",
    "address": "909 Radde Place, Rew, Florida, 4425"
  },
  {
    "index": 54,
    "firstName": "Clements",
    "lastName": "Carr",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (811) 477-2424",
    "address": "243 Caton Avenue, Roy, Minnesota, 9128"
  },
  {
    "index": 55,
    "firstName": "Manuela",
    "lastName": "Reid",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (815) 584-3127",
    "address": "391 Roosevelt Place, Robinette, New Jersey, 9353"
  },
  {
    "index": 56,
    "firstName": "Terra",
    "lastName": "Lindsey",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (808) 436-3258",
    "address": "336 Bartlett Place, Geyserville, Guam, 7685"
  },
  {
    "index": 57,
    "firstName": "Maria",
    "lastName": "Clements",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (935) 436-3796",
    "address": "647 Tennis Court, Wauhillau, Texas, 5591"
  },
  {
    "index": 58,
    "firstName": "Krista",
    "lastName": "Guthrie",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (883) 484-3523",
    "address": "658 Prince Street, Garfield, California, 9178"
  },
  {
    "index": 59,
    "firstName": "Jody",
    "lastName": "Turner",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (919) 462-2220",
    "address": "702 Moore Street, Ypsilanti, Washington, 7765"
  },
  {
    "index": 60,
    "firstName": "Fletcher",
    "lastName": "Gardner",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (931) 542-2329",
    "address": "543 Highlawn Avenue, Belmont, Missouri, 4828"
  },
  {
    "index": 61,
    "firstName": "Crane",
    "lastName": "Hatfield",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (889) 428-2917",
    "address": "517 Beayer Place, Steinhatchee, Colorado, 8277"
  },
  {
    "index": 62,
    "firstName": "Minerva",
    "lastName": "Conway",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (900) 474-2671",
    "address": "488 Ira Court, Galesville, Arkansas, 1641"
  },
  {
    "index": 63,
    "firstName": "Fowler",
    "lastName": "Perez",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (849) 444-2627",
    "address": "225 Cranberry Street, Enetai, Northern Mariana Islands, 9300"
  },
  {
    "index": 64,
    "firstName": "Buckley",
    "lastName": "Diaz",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (997) 423-2419",
    "address": "455 Mermaid Avenue, Unionville, Louisiana, 5158"
  },
  {
    "index": 65,
    "firstName": "Debora",
    "lastName": "Drake",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (806) 442-2253",
    "address": "890 Falmouth Street, Adamstown, Virginia, 1707"
  },
  {
    "index": 66,
    "firstName": "Lee",
    "lastName": "Morrow",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (820) 496-3840",
    "address": "214 Quentin Road, Emory, New York, 6818"
  },
  {
    "index": 67,
    "firstName": "Ina",
    "lastName": "Wright",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (955) 472-2936",
    "address": "920 Varet Street, Faxon, Illinois, 8759"
  },
  {
    "index": 68,
    "firstName": "Paul",
    "lastName": "Lancaster",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (981) 494-3631",
    "address": "338 Matthews Place, Welch, Puerto Rico, 2608"
  },
  {
    "index": 69,
    "firstName": "Ferrell",
    "lastName": "Alford",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (838) 402-2654",
    "address": "766 Lott Place, Eagleville, Virgin Islands, 8891"
  },
  {
    "index": 70,
    "firstName": "Vance",
    "lastName": "Harmon",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (898) 530-3170",
    "address": "980 Guider Avenue, Needmore, South Carolina, 215"
  },
  {
    "index": 71,
    "firstName": "Reid",
    "lastName": "Stanton",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (902) 430-3754",
    "address": "668 Sapphire Street, Hatteras, North Dakota, 4632"
  },
  {
    "index": 72,
    "firstName": "Meghan",
    "lastName": "Salas",
    "gender": "<TypeError: this.gender is not a function>",
    "email": "<TypeError: this.email is not a function>",
    "phone": "+1 (891) 504-2361",
    "address": "528 Windsor Place, Whitestone, Federated States Of Micronesia, 5846"
  }
]

let template = new Template(html, data, scope);
template.compile(document.querySelector('#people'));
