import { Component, OnInit } from '@angular/core';

@Component({
  selector:    'app-demo-geo-targeting',
  templateUrl: './demo-geo-targeting.component.html',
  styleUrls:   ['./demo-geo-targeting.component.css']
})
export class DemoGeoTargetingComponent implements OnInit {

  spec = {
    'geo_locations':          {
      'location_types': [
        'home'
      ],
      // 'countries':      ['RU'],
      'cities':         [
        {
          'key':           '2020916',
          'name':          'Moscow',
          'radius':        25,
          'distance_unit': 'mile'
        }
      ],
      'regions':        [
        {
          'key':  '3153',
          'name': 'Omsk Oblast'
        }
      ],
      /*'cities':         [
       {
       'key':           '1997316',
       'name':          'Krasnogorsk, Moskovskaya Oblast',
       'radius':        25,
       'distance_unit': 'mile'
       },
       {
       'key':           '1997692',
       'name':          'Krasnoyarsk',
       'radius':        25,
       'distance_unit': 'mile'
       },
       {
       'key':           '1997234',
       'name':          'Krasnodar',
       'radius':        25,
       'distance_unit': 'mile'
       },
       {
       'key':           '2036120',
       'name':          'Omskiy, Krasnoyarskiy Kray',
       'radius':        25,
       'distance_unit': 'mile'
       },
       {
       'key':           '2036118',
       'name':          'Omsino, Kirovskaya Oblast',
       'radius':        25,
       'distance_unit': 'mile'
       },
       {
       'key':           '2036121',
       'name':          'Omskiy, Omskaya Oblast',
       'radius':        25,
       'distance_unit': 'mile'
       },
       {
       'key':           '2678662',
       'name':          'Omsk',
       'radius':        25,
       'distance_unit': 'mile'
       },
       {
       'key':           '2036122',
       'name':          'Omsk',
       'radius':        25,
       'distance_unit': 'mile'
       },
       {
       'key':           '2020916',
       'name':          'Moscow',
       'radius':        50,
       'distance_unit': 'kilometer'
       }
       ],*/
      /*'regions':             [
       {
       'key':  '3153',
       'name': 'Omsk Oblast'
       },
       {
       'key':  '3146',
       'name': 'Moscow'
       }
       ],
       'zips':                [
       {
       'key':  'RU:192212',
       'name': '192212'
       },
       {
       'key':  'RU:125222',
       'name': '125222'
       },
       {
       'key':  'US:13439',
       'name': '13439'
       },
       {
       'key':  'US:94062',
       'name': '94062'
       },
       {
       'key':  'US:90028',
       'name': '90028'
       }
       ],
       'cities':              [
       {
       'key':  '2421862',
       'name': 'San Mateo'
       },
       {
       'key':  '2490299',
       'name': 'New York'
       }
       ],
       'geo_markets':         [
       {
       'key':  'DMA:501',
       'name': 'New York'
       },
       {
       'key':  'DMA:803',
       'name': 'Los Angeles'
       }
       ],
       'electoral_districts': [
       {
       'key':  'US:CA14',
       'name': `California's 14th District`
       }
       ]*/
    },
    'excluded_geo_locations': {
      'location_types': [
        'home'
      ],
      'cities':         [
        {
          'key':  '2036122',
          'name': 'Omsk'
        }
      ]
    }
  };

  onChange = (spec) => {
    this.spec = spec;
  };

  constructor () { }

  ngOnInit () {
  }

}
