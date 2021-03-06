import Queue from 'promise-queue';
import getUploadImages from '../../../../tools/getUploadImages';
import saveLocalStorageItems from '../../../../tools/saveLocalStorageItems';
import DropboxClient from '../../../../tools/DropboxClient';

let dropboxClient;
let addToQueue = () => {};

const middleware = (store, tokens) => {

  const queue = new Queue(1, Infinity);
  addToQueue = (who) => (what, throttle, fn) => (
    queue.add(() => (
      new Promise((resolve, reject) => {
        window.setTimeout(() => {
          store.dispatch({
            type: 'DROPBOX_LOG_ACTION',
            payload: {
              timestamp: (new Date()).getTime() / 1000,
              message: `${who} runs ${what}`,
            },
          });

          fn()
            .then(resolve)
            .catch(reject);
        }, throttle);
      })
    ))
  );

  dropboxClient = new DropboxClient(tokens, addToQueue('Dropbox'));

  dropboxClient.checkLoginStatus()
    .then((loggedIn) => {
      if (loggedIn) {
        store.dispatch({
          type: 'SET_DROPBOX_STORAGE',
          payload: tokens,
        });
      } else {
        store.dispatch({
          type: 'DROPBOX_LOGOUT',
        });
      }
    });

  return (action) => {
    if (
      action.type === 'STORAGE_SYNC_START' &&
      action.payload.storageType === 'dropbox'
    ) {
      dropboxClient.getRemoteContents()
        .then((repoContents) => {
          switch (action.payload.direction) {
            case 'up':
              return getUploadImages(store, repoContents, addToQueue('GBPrinter'))
                .then((changes) => dropboxClient.upload(changes));
            case 'down':
              return saveLocalStorageItems(repoContents)
                .then((result) => {
                  store.dispatch({
                    type: 'DROPBOX_SETTINGS_IMPORT',
                    payload: repoContents.settings,
                  });

                  return result;
                });
            default:
              return Promise.reject(new Error('dropbox sync: wrong sync case'));
          }
        })
        .then((syncResult) => {
          store.dispatch({
            type: 'STORAGE_SYNC_DONE',
            payload: {
              syncResult,
              storageType: 'dropbox',
            },
          });
        })
        .catch((error) => {
          console.error(error);
          store.dispatch({
            type: 'ERROR',
            payload: error.message,
          });
        });
    } else if (action.type === 'DROPBOX_START_AUTH') {
      dropboxClient.startAuth();
    }
  };
};

export default middleware;
