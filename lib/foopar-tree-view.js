'use babel';

import FooparTreeViewView from './foopar-tree-view-view';
import { CompositeDisposable } from 'atom';

const fileOrder = [
  'index.js',
  'styles.scss',
  'actions.js',
];

export default {

  fooparTreeViewView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.fooparTreeViewView = new FooparTreeViewView(state.fooparTreeViewViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.fooparTreeViewView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'foopar-tree-view:toggle': () => this.toggle()
    }));

    atom.packages.activatePackage('tree-view')
    .then((pkg) => {
      if (pkg && pkg.mainModule && pkg.mainModule.treeView) {
        this.treeView = pkg.mainModule.treeView;
        this.init();
      }
    });
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.fooparTreeViewView.destroy();
  },

  serialize() {
    return {
      fooparTreeViewViewState: this.fooparTreeViewView.serialize()
    };
  },

  toggle() {
    console.log('FooparTreeView was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  sortEntries(entries) {
    if (!entries.length || || !entries[0].path || entries[0].path.indexOf('src\\pages') === -1) return entries;
    const filesB = [];
    const folders = [];
    entries.forEach((child) => {
      if (child.name && child.name.indexOf('.') === -1) {
        folders.push(child);
      } else {
        filesB.push(child);
      }
    });
    const files = [];
    fileOrder.forEach((fileName) => {
      filesB.forEach((child) => {
        if (child.name === fileName) {
          files.push(child);
          return false;
        }
      })
    });
    return files.concat(folders);
  },

  init() {
    if (this.wInit) return;
    this.treeView.roots[0].directory.constructor.prototype.sortEntries = this.sortEntries;
    this.treeView.updateRoots();
  },
};
