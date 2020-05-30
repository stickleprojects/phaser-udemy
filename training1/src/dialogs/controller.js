import Actions from './actions';
import Inventory from './inventory';

export default class DialogController {


  constructor() {

  }

  doIt(parent, key, dialog, answersSoFar) {
    return new Promise((resolve, reject) => {

      // show child
      if (!parent.scene.get(key)) {
        parent.scene.add(key, dialog);
      }

      // pause parent

      console.log('launching scene');
      parent.scene.launch(key, (data) => {


        if (data && data.src && data.src.name) {
          answersSoFar.push(data.src.name);

          parent.scene.resume();

          resolve(dialog, answersSoFar);
        } else {
          reject(parent);
        }
      });

      // parent.scene.pause();
    });

  }

  async GetCommand(parent, cursorKeys) {

    // wait for callback
    // act on callback
    // resolve
    const action = await this.doIt(parent, 'action', new Actions('actions', cursorKeys), []);
    if (action) {
      const inventory = await this.doIt(parent, 'inventory', new Inventory('inventory', cursorKeys), action);

      return action + inventory;
    } else {
      return '';
    }

  }
}