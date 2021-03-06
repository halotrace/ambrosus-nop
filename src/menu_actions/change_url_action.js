/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

const changeUrlAction = (stateModel, rolesWrapper, nectarWarningDialog, askForNodeUrlDialog, confirmationDialog, changeUrlSuccessfulDialog) => async () => {
  await nectarWarningDialog();
  const oldUrl = await stateModel.getNodeUrl();
  const {nodeUrl: newUrl} = await askForNodeUrlDialog();
  if (await confirmationDialog(oldUrl, newUrl)) {
    await rolesWrapper.setNodeUrl(await stateModel.getAddress(), newUrl);
    await stateModel.storeNodeUrl(newUrl);
    await changeUrlSuccessfulDialog(newUrl);
  }
  return false;
};

export default changeUrlAction;
