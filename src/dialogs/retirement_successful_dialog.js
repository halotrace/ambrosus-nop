/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chalk from 'chalk';

const retirementSuccessfulDialog = (messages, outputDir) => async () => {
  console.log(chalk.green(messages.retirementSuccessful(chalk.yellow(messages.dockerDownCommand), chalk.yellow(outputDir))));
};

export default retirementSuccessfulDialog;
