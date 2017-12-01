'use babel';

import FooparTreeView from '../lib/foopar-tree-view';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('FooparTreeView', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('foopar-tree-view');
  });

  describe('when the foopar-tree-view:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.foopar-tree-view')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'foopar-tree-view:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.foopar-tree-view')).toExist();

        let fooparTreeViewElement = workspaceElement.querySelector('.foopar-tree-view');
        expect(fooparTreeViewElement).toExist();

        let fooparTreeViewPanel = atom.workspace.panelForItem(fooparTreeViewElement);
        expect(fooparTreeViewPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'foopar-tree-view:toggle');
        expect(fooparTreeViewPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.foopar-tree-view')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'foopar-tree-view:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let fooparTreeViewElement = workspaceElement.querySelector('.foopar-tree-view');
        expect(fooparTreeViewElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'foopar-tree-view:toggle');
        expect(fooparTreeViewElement).not.toBeVisible();
      });
    });
  });
});
