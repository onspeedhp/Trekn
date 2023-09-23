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
      status: 'readyToMint',
      Icon: ReadyToMintIcon,
      label: 'Ready to mint',
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
