let imagesMap = {
  eska: 'images/forgeddraw/eska.png',
  eskaNarrow: 'images/forgeddraw/eskaNarrow.png',
  bubl: 'images/forgeddraw/bubl.png',
  koma: 'images/forgeddraw/koma.png',
  usy: 'images/forgeddraw/usy.png',
  ring: 'images/forgeddraw/ring.png',
  orchidea: 'images/forgeddraw/orchidea.png',
  romashka: 'images/forgeddraw/romashka.png',
  barvinok: 'images/forgeddraw/barvinok.png',
  romashkamalenkaya: 'images/forgeddraw/romashkamalenkaya.png',
  hrizantema: 'images/forgeddraw/hrizantema.png',

  vetka16533p: 'images/forgeddraw/vetka16533p.png',
  vetka16532l: 'images/forgeddraw/vetka16532l.png',
  golub16675p: 'images/forgeddraw/golub16675p.png',
  golub16674l: 'images/forgeddraw/golub16674l.png',
  listdub: 'images/forgeddraw/listdub.png',
  utka16515L: 'images/forgeddraw/utka16515L.png',
  utka16514R: 'images/forgeddraw/utka16514R.png',
  lebed16510L: 'images/forgeddraw/lebed16510L.png',
  lebed16511R: 'images/forgeddraw/lebed16511R.png',
  bereza: 'images/forgeddraw/bereza.png',
  lilia: 'images/forgeddraw/lilia.png',
  topol: 'images/forgeddraw/topol.png',
  vetka: 'images/forgeddraw/vetka.png',
  vinogradlist: 'images/forgeddraw/vinogradlist.png',

  babochka16512L: 'images/forgeddraw/babochka16512L.png',
  babochka16513R: 'images/forgeddraw/babochka16513R.png',

  balyasina16561: 'images/forgeddraw/balyasina16561.png',
  balyasina16562: 'images/forgeddraw/balyasina16562.png',
  balyasina16567: 'images/forgeddraw/balyasina16567.png',

  balyasina16564: 'images/forgeddraw/balyasina16564.png',
  balyasina16566: 'images/forgeddraw/balyasina16566.png',
  balyasina16569: 'images/forgeddraw/balyasina16569.png',
  balyasina16570: 'images/forgeddraw/balyasina16570.png',

  orellevy: 'images/forgeddraw/orellevy.png',
  orelpravy: 'images/forgeddraw/orelpravy.png',
  podkova: 'images/forgeddraw/podkova.png',
  vinogradgronalevy: 'images/forgeddraw/vinogradgronalevy.png',
  vinogradgronapravy: 'images/forgeddraw/vinogradgronapravy.png',

  filenka16544: 'images/forgeddraw/filenka16544.png',
  filenka16545: 'images/forgeddraw/filenka16545.png',
  filenka16546: 'images/forgeddraw/filenka16546.png',
  filenka16547: 'images/forgeddraw/filenka16547.png'
};

let mainSourceImagesArr = [
  {
    style: '10x10',
    styleItems: [
      {
        type: 'bubl',
        items: [
          {
            vendorId: '16629',
            width: 70,
            height: 95
          },
          {
            vendorId: '16630',
            width: 80,
            height: 125
          },
          {
            vendorId: '16631',
            width: 95,
            height: 150
          },
          {
            vendorId: '16632',
            width: 125,
            height: 210
          }
        ]
      },
      {
        type: 'eskaNarrow',
        items: [
          {
            vendorId: '16638',
            width: 100,
            height: 270
          },
          {
            vendorId: '16639',
            width: 150,
            height: 450
          }
        ]
      },
      {
        type: 'eska',
        items: [
          {
            vendorId: '16642',
            width: 70,
            height: 190
          },
          {
            vendorId: '16647',
            width: 120,
            height: 340
          },
          {
            vendorId: '16644',
            width: 150,
            height: 450
          }
        ]
      },
      {
        type: 'koma',
        items: [
          {
            vendorId: '16658',
            width: 110,
            height: 150
          }
        ]
      },
      {
        type: 'usy',
        items: [
          {
            vendorId: '16662',
            width: 80,
            height: 480
          }
        ]
      },
      {
        type: 'ring',
        items: [
          {
            vendorId: '16689',
            width: 100,
            height: 100
          },
          {
            vendorId: '16692',
            width: 130,
            height: 130
          },
          {
            vendorId: '16695',
            width: 150,
            height: 150
          }
        ]
      }
    ]
  },
  {
    style: 'Цветы',
    styleItems: [
      {
        type: 'barvinok',
        items: [
          {
            vendorId: '16522',
            width: 140,
            height: 140
          }
        ]
      },
      {
        type: 'romashkamalenkaya',
        items: [
          {
            vendorId: '16523',
            width: 40,
            height: 40
          }
        ]
      },
      {
        type: 'orchidea',
        items: [
          {
            vendorId: '16665',
            width: 143,
            height: 130
          }
        ]
      },
      {
        type: 'hrizantema',
        items: [
          {
            vendorId: '16527',
            width: 92,
            height: 92
          }
        ]
      },

      {
        type: 'romashka',
        items: [
          {
            vendorId: '16503',
            width: 70,
            height: 70
          },
          {
            vendorId: '16504',
            width: 100,
            height: 100
          },
          {
            vendorId: '16505',
            width: 120,
            height: 120
          }
        ]
      }
    ]
  },

  {
    style: 'Листья',

    styleItems: [
      {
        type: 'vetka16533p',
        items: [
          {
            vendorId: '16533',
            width: 130,
            height: 230
          }
        ]
      },
      {
        type: 'vetka16532l',
        items: [
          {
            vendorId: '16532',
            width: 130,
            height: 230
          }
        ]
      },
      {
        type: 'golub16675p',
        items: [
          {
            vendorId: '16675',
            width: 60,
            height: 80
          }
        ]
      },
      {
        type: 'golub16674l',
        items: [
          {
            vendorId: '16674',
            width: 60,
            height: 80
          }
        ]
      },
      {
        type: 'listdub',
        items: [
          {
            vendorId: '16507',
            width: 55,
            height: 100
          },
          {
            vendorId: '16508',
            width: 75,
            height: 145
          },
          {
            vendorId: '16509',
            width: 95,
            height: 175
          }
        ]
      },
      {
        type: 'utka16515L',
        items: [
          {
            vendorId: '16515',
            width: 50,
            height: 100
          }
        ]
      },
      {
        type: 'utka16514R',
        items: [
          {
            vendorId: '16514',
            width: 50,
            height: 100
          }
        ]
      },
      {
        type: 'lebed16510L',
        items: [
          {
            vendorId: '16510',
            width: 40,
            height: 110
          }
        ]
      },
      {
        type: 'lebed16511R',
        items: [
          {
            vendorId: '16511',
            width: 40,
            height: 110
          }
        ]
      },
      {
        type: 'babochka16512L',
        items: [
          {
            vendorId: '16512',
            width: 67,
            height: 65
          }
        ]
      },
      {
        type: 'babochka16513R',
        items: [
          {
            vendorId: '16513',
            width: 67,
            height: 65
          }
        ]
      },
      {
        type: 'bereza',
        items: [
          {
            vendorId: '16525',
            width: 40,
            height: 75
          }
        ]
      },
      {
        type: 'lilia',
        items: [
          {
            vendorId: '16526',
            width: 75,
            height: 115
          }
        ]
      },
      {
        type: 'topol',
        items: [
          {
            vendorId: '16518',
            width: 50,
            height: 85
          },
          {
            vendorId: '16517',
            width: 70,
            height: 115
          },
          {
            vendorId: '16516',
            width: 90,
            height: 145
          }
        ]
      },
      {
        type: 'vetka',
        items: [
          {
            vendorId: '16535',
            width: 60,
            height: 305
          }
        ]
      },
      {
        type: 'vinogradlist',
        items: [
          {
            vendorId: '16521',
            width: 90,
            height: 95
          },
          {
            vendorId: '16520',
            width: 115,
            height: 125
          },
          {
            vendorId: '16519',
            width: 145,
            height: 155
          }
        ]
      }
    ]
  },

  {
    style: 'Балясины',

    styleItems: [
      {
        type: 'balyasina16561',
        items: [
          {
            vendorId: '16561',
            width: 240,
            height: 950
          }
        ]
      },
      {
        type: 'balyasina16562',
        items: [
          {
            vendorId: '16562',
            width: 240,
            height: 950
          }
        ]
      },
      {
        type: 'balyasina16567',
        items: [
          {
            vendorId: '16567',
            width: 60,
            height: 950
          }
        ]
      },
      {
        type: 'balyasina16564',
        items: [
          {
            vendorId: '16564',
            width: 150,
            height: 950
          }
        ]
      },
      {
        type: 'balyasina16566',
        items: [
          {
            vendorId: '16566',
            width: 165,
            height: 950
          }
        ]
      },
      {
        type: 'balyasina16569',
        items: [
          {
            vendorId: '16569',
            width: 230,
            height: 900
          }
        ]
      },
      {
        type: 'balyasina16570',
        items: [
          {
            vendorId: '16570',
            width: 12,
            height: 950
          }
        ]
      }
    ]
  },

  {
    style: 'Фигууры',

    styleItems: [
      {
        type: 'orellevy',
        items: [
          {
            vendorId: '16537',
            width: 160,
            height: 200
          }
        ]
      },
      {
        type: 'orelpravy',
        items: [
          {
            vendorId: '16538',
            width: 160,
            height: 200
          }
        ]
      },
      {
        type: 'podkova',
        items: [
          {
            vendorId: '16542',
            width: 115,
            height: 130
          }
        ]
      },
      {
        type: 'vinogradgronalevy',
        items: [
          {
            vendorId: '16541',
            width: 70,
            height: 145
          }
        ]
      },
      {
        type: 'vinogradgronapravy',
        items: [
          {
            vendorId: '16540',
            width: 70,
            height: 145
          }
        ]
      }
    ]
  },

  {
    style: 'Филенки',

    styleItems: [
      {
        type: 'filenka16547',
        items: [
          {
            vendorId: '16547',
            width: 295,
            height: 295
          }
        ]
      },
      {
        type: 'filenka16545',
        items: [
          {
            vendorId: '16545',
            width: 495,
            height: 495
          }
        ]
      },
      {
        type: 'filenka16546',
        items: [
          {
            vendorId: '16546',
            width: 495,
            height: 295
          }
        ]
      },
      {
        type: 'filenka16544',
        items: [
          {
            vendorId: '16544',
            width: 795,
            height: 495
          }
        ]
      }
    ]
  }
];

module.exports = {
  imagesMap: imagesMap,
  mainSourceImagesArr: mainSourceImagesArr
};
