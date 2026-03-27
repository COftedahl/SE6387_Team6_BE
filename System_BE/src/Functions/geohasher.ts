// Ported from https://github.com/JacksonTian/geohasher
// to ESM as it was not bundling properly via Rollup as a CJS

// Geohash library for Javascript
// (c) 2008 David Troy
// (c) 2010 Chris Williams
// (c) 2013 Jackson Tian
// Distributed under the MIT License

interface evenodd {
  even: string, 
  odd?: string, 
}

interface directions {
  [key: string]: evenodd,
  right: evenodd, 
  left: evenodd, 
  top: evenodd, 
  bottom: evenodd, 
}

const BITS: number[] = [16, 8, 4, 2, 1];

const BASE32: string = '0123456789bcdefghjkmnpqrstuvwxyz';

const NEIGHBORS: directions = {
  right: { even: 'bc01fg45238967deuvhjyznpkmstqrwx' },
  left: { even: '238967debc01fg45kmstqrwxuvhjyznp' },
  top: { even: 'p0r21436x8zb9dcf5h7kjnmqesgutwvy' },
  bottom: { even: '14365h7k9dcfesgujnmqp0r2twvyx8zb' },
};

const BORDERS: directions = {
  right: { even: 'bcfguvyz' },
  left: { even: '0145hjnp' },
  top: { even: 'prxz' },
  bottom: { even: '028b' },
};

NEIGHBORS.bottom.odd = NEIGHBORS.left.even;
NEIGHBORS.top.odd = NEIGHBORS.right.even;
NEIGHBORS.left.odd = NEIGHBORS.bottom.even;
NEIGHBORS.right.odd = NEIGHBORS.top.even;

BORDERS.bottom.odd = BORDERS.left.even;
BORDERS.top.odd = BORDERS.right.even;
BORDERS.left.odd = BORDERS.bottom.even;
BORDERS.right.odd = BORDERS.top.even;

function refineInterval(interval: any[], cd: any, mask: any): void {
  if (cd & mask) {
    interval[0] = (interval[0] + interval[1]) / 2;
  } else {
    interval[1] = (interval[0] + interval[1]) / 2;
  }
}

function calculateAdjacent(srcHash: string, dir: string) {
  srcHash = srcHash.toLowerCase();
  const lastChr = srcHash.charAt(srcHash.length - 1);
  const type = srcHash.length % 2 ? 'odd' : 'even';
  let base = srcHash.substring(0, srcHash.length - 1);
  if ((BORDERS[dir][type] as string).indexOf(lastChr) !== -1) {
    base = calculateAdjacent(base, dir);
  }
  return base + BASE32[(BORDERS[dir][type] as string).indexOf(lastChr)];
}

function encode(latitude: number, longitude: number, precision: number): string {
  let isEven: boolean = true;
  const lat = [-90.0, 90.0];
  const lng = [-180.0, 180.0];
  let bit = 0;
  let ch = 0;
  precision = precision || 12;

  let geohash = '';
  while (geohash.length < precision) {
    let mid;
    if (isEven) {
      mid = (lng[0] + lng[1]) / 2;
      if (longitude > mid) {
        ch |= BITS[bit];
        lng[0] = mid;
      } else {
        lng[1] = mid;
      }
    } else {
      mid = (lat[0] + lat[1]) / 2;
      if (latitude > mid) {
        ch |= BITS[bit];
        lat[0] = mid;
      } else {
        lat[1] = mid;
      }
    }

    isEven = !isEven;
    if (bit < 4) {
      bit++;
    } else {
      geohash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }
  return geohash;
}

function decode(geohash: string): {latitude: number[], longitude: number[]} {
  let isEven: boolean = true;
  const lat = [-90.0, 90.0];
  const lng = [-180.0, 180.0];
  // let latErr = 90.0
  // let lonErr = 180.0

  for (let i = 0; i < geohash.length; i++) {
    const c = geohash[i];
    const cd = BASE32.indexOf(c);
    for (let j = 0; j < 5; j++) {
      const mask = BITS[j];
      if (isEven) {
        // lonErr /= 2
        refineInterval(lng, cd, mask);
      } else {
        // latErr /= 2
        refineInterval(lat, cd, mask);
      }
      isEven = !isEven;
    }
  }
  lat[2] = (lat[0] + lat[1]) / 2;
  lng[2] = (lng[0] + lng[1]) / 2;

  return { latitude: lat, longitude: lng };
}

export { encode, decode, calculateAdjacent };
