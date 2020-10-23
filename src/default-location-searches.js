import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
export default [
  {
    id: 'default-hanoi',
    predictionPlace: {
      address: 'Ha Noi, Viet Nam',
      bounds: new LatLngBounds(new LatLng(21.567, 106.214), new LatLng(20.495, 105.492)),
    },
  },
  {
    id: 'default-haiphong',
    predictionPlace: {
      address: 'Hai Phong, Viet Nam',
      bounds: new LatLngBounds(new LatLng(20.982, 106.762), new LatLng(20.714, 106.581)),
    },
  },
  {
    id: 'default-danang',
    predictionPlace: {
      address: 'Da Nang, Viet Nam',
      bounds: new LatLngBounds(new LatLng(16.443, 108.456), new LatLng(15.720, 107.983)),
    },
  },
  {
    id: 'default-thanhphohochiminh',
    predictionPlace: {
      address: 'Ho Chi Minh City, Viet Nam',
      bounds: new LatLngBounds(new LatLng(11.086, 106.924), new LatLng(10.335, 106.444)),
    },
  },
  {
    id: 'default-cantho',
    predictionPlace: {
      address: 'Can Tho, Viet Nam',
      bounds: new LatLngBounds(new LatLng(10.213, 105.895), new LatLng(9.837, 105.655)),
    },
  },
  {
    id: 'default-camau',
    predictionPlace: {
      address: 'Ca Mau, Viet Nam',
      bounds: new LatLngBounds(new LatLng(9.492, 105.362), new LatLng(8.813, 104.930)),
    },
  },
];
