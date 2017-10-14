import { createTransform, persistStore as reduxPersistStore } from 'redux-persist';
import * as R from 'ramda';

const mapPath = R.curry((path, f, obj) =>
  R.assocPath(path, f(R.path(path, obj)), obj),
);

const dateTransform = createTransform(null, (outboundState, key) => {
  const convertDate = R.map(mapPath(['date'], dateString => new Date(dateString)));
  if (key === 'transactions') {
    const temp = R.map(mapPath(['trades'], convertDate))(outboundState);
    return R.map(mapPath(['transfers'], convertDate))(temp);
  }
  return outboundState;
});

export default function persistStore(store) {
  return reduxPersistStore(store, {
    transforms: [dateTransform],
    blacklist: ['router'],
  });
}
