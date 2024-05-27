import { DateTime } from 'luxon';

function formatDate(date: string) {
  return DateTime.fromISO(date)
    .plus({ hours: 7 }) // TODO: Currently the timezone is based on Database timezone (For now is Singapore UTC+7)
    .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
}

export { formatDate };
