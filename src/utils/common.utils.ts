import { convertDistance } from '../functions/calculateDistance';
import { AwayIcon, MileageIcon, ReadyToMintIcon } from '../icons';

export const getStatusLocation = (distance?: number, radius = 500) => {
  if (!distance)
    return {
      status: 'nearBy',
      Icon: AwayIcon,
      label: '-- away',
      title: '-- away',
    };

  if (distance - radius <= 0) {
    return {
      status: 'ReadyToCollect',
      Icon: ReadyToMintIcon,
      label: 'Ready to collect',
      title: "You've entered the zone!",
    };
  } else {
    if (distance - radius > 0 && distance - radius < 50000) {
      return {
        status: 'nearBy',
        Icon: AwayIcon,
        label: `${
          Number((distance - radius).toFixed(2)) < 1000
            ? `${(distance - radius).toFixed(2)}m`
            : `${((distance - radius) / 1000).toFixed(2)}km`
        } away`,
        title: `${
          Number((distance - radius).toFixed(2)) < 1000
            ? `${(distance - radius).toFixed(2)}m`
            : `${((distance - radius) / 1000).toFixed(2)}km`
        } away`,
      };
    } else {
      return {
        status: 'mileageAway',
        Icon: MileageIcon,
        label: 'Mileage away',
        title: 'Mileage away',
      };
    }
  }
};

export const getLabelLocation = (status: any, distance?: number) => {
  if (status === 'ReadyToCollect') {
    const Icon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
    <g clip-path="url(#clip0_357_1056)">
    <path d="M8.62266 7.72875C8.51437 7.85297 8.39344 7.96547 8.25 8.04867V8.58633C9.80906 8.80523 10.875 9.24375 10.875 9.75C10.875 10.4749 8.6925 11.0625 6 11.0625C3.3075 11.0625 1.125 10.4749 1.125 9.75C1.125 9.24375 2.19094 8.80547 3.75 8.58633V8.04867C3.60656 7.96547 3.48563 7.85297 3.37734 7.72875C1.37977 8.09391 0 8.86055 0 9.75C0 10.9927 2.68641 12 6 12C9.31359 12 12 10.9927 12 9.75C12 8.86055 10.6202 8.09391 8.62266 7.72875ZM6 3C6.82852 3 7.5 2.32852 7.5 1.5C7.5 0.671484 6.82852 0 6 0C5.17148 0 4.5 0.671484 4.5 1.5C4.5 2.32852 5.17148 3 6 3ZM4.5 7.5V9.75C4.5 10.1641 4.83586 10.5 5.25 10.5H6.75C7.16414 10.5 7.5 10.1641 7.5 9.75V7.5C7.91414 7.5 8.25 7.16414 8.25 6.75V4.5C8.25 3.87867 7.74633 3.375 7.125 3.375H6.84844C6.58898 3.49289 6.30328 3.5625 6 3.5625C5.69672 3.5625 5.41102 3.49289 5.15156 3.375H4.875C4.25367 3.375 3.75 3.87867 3.75 4.5V6.75C3.75 7.16414 4.08586 7.5 4.5 7.5Z" fill="black"/>
    </g>
    <defs>
    <clipPath id="clip0_357_1056">
    <rect width="12" height="12" fill="white"/>
    </clipPath>
    </defs>
    </svg>`;
    return {
      Icon: Icon,
      label: '5m',
    };
  } else if (status === 'Nearby' && distance) {
    const Icon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
<g clip-path="url(#clip0_357_1412)">
<path d="M6.13595 10.0265C6.43829 10.3007 6.92579 10.8069 6.91407 11.2147C6.91407 11.2335 6.91173 11.2522 6.91173 11.2733C6.86954 11.7374 6.4711 12.0022 5.99532 11.9999C5.40938 11.9976 5.06016 11.6061 5.08829 11.1608C5.11173 10.7811 5.56876 10.3007 5.84766 10.0452C5.90157 9.99599 5.91095 9.98193 5.97891 9.96083C6.0586 9.96083 6.07032 9.96786 6.13595 10.0265V10.0265ZM9.27892 1.57724C8.89688 0.974899 8.37423 0.62568 7.79532 0.356149C7.19766 0.105368 6.51563 -0.00478836 6.00001 -0.000100864C4.96641 -0.000100864 4.33126 0.309274 4.09923 0.405368C2.84298 1.05927 2.1211 2.04365 2.15626 3.71709C2.32266 5.64365 4.42969 7.84208 5.80782 9.19677C5.84766 9.23427 5.91329 9.30224 5.95313 9.3163L6.03048 9.31865C6.0797 9.30224 6.07266 9.30693 6.11251 9.26943C7.33829 8.1163 9.41017 5.85224 9.76642 4.21396C9.93048 3.29521 9.83907 2.51474 9.27892 1.57724V1.57724ZM5.87813 8.24755C5.22188 7.0499 4.35001 5.18427 4.25391 3.81787C4.17423 2.70459 4.5211 0.742868 5.87813 0.613961V8.24755ZM9.20392 4.21865C8.81954 5.5499 7.3922 7.21865 6.4172 8.21005C7.06876 6.99365 7.94532 5.08583 7.9922 3.7124C8.0297 2.63662 7.76251 1.23271 6.8672 0.632711C8.94845 1.06162 9.57423 2.93193 9.20392 4.21865Z" fill="black"/>
</g>
<defs>
<clipPath id="clip0_357_1412">
<rect width="12" height="12" fill="white"/>
</clipPath>
</defs>
</svg>`;
    return {
      Icon: Icon,
      label: convertDistance(distance),
    };
  } else {
    return {
      Icon: `<div></div>`,
      label: 'Haha',
    };
  }
};

export const formatNumber = (
  numberValue?: number,
  maximumFractionDigits = 3,
  fallbackLabel = '',
  localeOption = {},
  minimumFractionDigits = 0
) => {
  try {
    if (!numberValue && numberValue !== 0) return fallbackLabel;
    const num = Number(numberValue);
    return num.toLocaleString('en-US', {
      maximumFractionDigits,
      minimumFractionDigits,
      ...localeOption,
    });
  } catch (error) {
    return String(numberValue);
  }
};
