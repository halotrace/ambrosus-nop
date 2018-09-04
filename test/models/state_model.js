/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import StateModel from '../../src/models/state_model';
import {APOLLO} from '../../src/consts';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('State Model', () => {
  let cryptoStub;
  let storeStub;
  let stateModel;

  const examplePrivateKey = '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709';
  const exampleAddress = '0xB1D28124D5771dD347a0BDECbC72CFb2BFf4B2D7';
  const exampleRole = APOLLO;
  const exampleUrl = 'https://amb-node.com';
  const exampleEmail = 'amb_node_operator@mail.com';

  beforeEach(async () => {
    storeStub = {
      has: sinon.stub(),
      read: sinon.stub(),
      write: sinon.stub()
    };
    cryptoStub = {
      generatePrivateKey: sinon.stub().resolves(examplePrivateKey),
      addressForPrivateKey: sinon.stub().withArgs(examplePrivateKey)
        .resolves(exampleAddress)
    };
    stateModel = new StateModel(storeStub, cryptoStub);
  });

  describe('generateAndStoreNewPrivateKey', () => {
    it('generates new private key', async () => {
      await expect(stateModel.generateAndStoreNewPrivateKey()).to.be.eventually.fulfilled;
      await expect(cryptoStub.generatePrivateKey).to.have.been.calledOnce;
    });

    it('stores newly generated private key', async () => {
      await expect(stateModel.generateAndStoreNewPrivateKey()).to.be.eventually.fulfilled;
      await expect(storeStub.write).to.have.been.calledOnceWith('privateKey', examplePrivateKey);
    });
  });

  describe('getExistingPrivateKey', () => {
    beforeEach(async () => {
      storeStub.read.resolves(examplePrivateKey);
    });

    it('returns private key if one exists', async () => {
      storeStub.has.resolves(true);
      expect(await stateModel.getExistingPrivateKey()).to.equal(examplePrivateKey);
      await expect(storeStub.has).to.have.been.calledOnceWith('privateKey');
      await expect(storeStub.read).to.have.been.calledOnceWith('privateKey');
    });

    it('returns null if private key does not exist yet', async () => {
      storeStub.has.resolves(false);
      expect(await stateModel.getExistingPrivateKey()).to.equal(null);
      await expect(storeStub.has).to.have.been.calledOnceWith('privateKey');
      await expect(storeStub.read).to.have.been.not.been.calledOnceWith('privateKey');
    });
  });

  describe('storePrivateKey', () => {
    it('stores private key', async () => {
      await expect(stateModel.storePrivateKey(examplePrivateKey)).to.be.eventually.fulfilled;
      await expect(storeStub.write).to.have.been.calledOnceWith('privateKey', examplePrivateKey);
    });
  });

  describe('getExistingRole', () => {
    beforeEach(async () => {
      storeStub.read.resolves(exampleRole);
    });

    it('returns role if one exists', async () => {
      storeStub.has.resolves(true);
      expect(await stateModel.getExistingRole()).to.equal(exampleRole);
      await expect(storeStub.has).to.have.been.calledOnceWith('role');
      await expect(storeStub.read).to.have.been.calledOnceWith('role');
    });

    it('returns null if role does not exist yet', async () => {
      storeStub.has.resolves(false);
      expect(await stateModel.getExistingRole()).to.equal(null);
      await expect(storeStub.has).to.have.been.calledOnceWith('role');
      await expect(storeStub.read).to.have.been.not.been.calledOnceWith('role');
    });
  });

  describe('storeRole', () => {
    it('stores role', async () => {
      await expect(stateModel.storeRole(exampleRole)).to.be.eventually.fulfilled;
      await expect(storeStub.write).to.have.been.calledOnceWith('role', exampleRole);
    });
  });

  describe('getExistingNodeUrl', () => {
    beforeEach(async () => {
      storeStub.read.resolves(exampleUrl);
    });

    it('returns node url if one exists', async () => {
      storeStub.has.resolves(true);
      expect(await stateModel.getExistingNodeUrl()).to.equal(exampleUrl);
      await expect(storeStub.has).to.have.been.calledOnceWith('url');
      await expect(storeStub.read).to.have.been.calledOnceWith('url');
    });

    it('returns null if node url does not exist yet', async () => {
      storeStub.has.resolves(false);
      expect(await stateModel.getExistingNodeUrl()).to.equal(null);
      await expect(storeStub.has).to.have.been.calledOnceWith('url');
      await expect(storeStub.read).to.have.been.not.been.calledOnceWith('url');
    });
  });

  describe('storeNodeUrl', () => {
    it('stores url', async () => {
      await expect(stateModel.storeNodeUrl(exampleUrl)).to.be.eventually.fulfilled;
      await expect(storeStub.write).to.have.been.calledOnceWith('url', exampleUrl);
    });
  });

  describe('getExistingUserEmail', () => {
    beforeEach(async () => {
      storeStub.read.resolves(exampleEmail);
    });

    it('returns user email if one exists', async () => {
      storeStub.has.resolves(true);
      expect(await stateModel.getExistingUserEmail()).to.equal(exampleEmail);
      await expect(storeStub.has).to.have.been.calledOnceWith('email');
      await expect(storeStub.read).to.have.been.calledOnceWith('email');
    });

    it('returns null if user email does not exist yet', async () => {
      storeStub.has.resolves(false);
      expect(await stateModel.getExistingUserEmail()).to.equal(null);
      await expect(storeStub.has).to.have.been.calledOnceWith('email');
      await expect(storeStub.read).to.have.been.not.been.calledOnceWith('email');
    });
  });

  describe('storeUserEmail', () => {
    it('stores user email', async () => {
      await expect(stateModel.storeUserEmail(exampleEmail)).to.be.eventually.fulfilled;
      await expect(storeStub.write).to.have.been.calledOnceWith('email', exampleEmail);
    });
  });

  describe('assembleSubmission', () => {
    const assembledSubmission = {
      address: exampleAddress,
      role: exampleRole,
      url: exampleUrl,
      email: exampleEmail
    };

    beforeEach(async () => {
      storeStub.has.withArgs('privateKey').resolves(true);
      storeStub.has.withArgs('role').resolves(true);
      storeStub.has.withArgs('url').resolves(true);
      storeStub.has.withArgs('email').resolves(true);
      storeStub.read.withArgs('privateKey').resolves(examplePrivateKey);
      storeStub.read.withArgs('role').resolves(exampleRole);
      storeStub.read.withArgs('url').resolves(exampleUrl);
      storeStub.read.withArgs('email').resolves(exampleEmail);
    });
    it('assembles submission', async () => {
      expect(await stateModel.assembleSubmission()).to.deep.equal(assembledSubmission);
      await expect(storeStub.has).to.have.been.calledWith('privateKey');
      await expect(storeStub.has).to.have.been.calledWith('role');
      await expect(storeStub.has).to.have.been.calledWith('url');
      await expect(storeStub.has).to.have.been.calledWith('email');
      await expect(storeStub.read).to.have.been.calledWith('privateKey');
      await expect(storeStub.read).to.have.been.calledWith('role');
      await expect(storeStub.read).to.have.been.calledWith('url');
      await expect(storeStub.read).to.have.been.calledWith('email');
      await expect(cryptoStub.addressForPrivateKey).to.have.been.calledOnceWith(examplePrivateKey);
    });
  });
});