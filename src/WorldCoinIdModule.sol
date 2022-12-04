// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {IReferenceModule} from "lens-protocol/contracts/interfaces/IReferenceModule.sol";
import {ModuleBase} from "lens-protocol/contracts/core/modules/ModuleBase.sol";

interface IHumanCheck {
    function isVerified(uint256 _profileId) external view returns (bool);
}

contract WorldCoinIdModule is IReferenceModule, ModuleBase {

    IHumanCheck public immutable humanCheck;
    constructor(address hub, address _humanCheck) ModuleBase(hub) {
        humanCheck = IHumanCheck(_humanCheck);
    }

    function initializeReferenceModule(
        uint256 /*profileId*/,
        uint256 /*pubId*/,
        bytes calldata /*data*/
    ) external pure override returns (bytes memory) {
        return new bytes(0);
    }

    function processComment(
        uint256 profileId,
        uint256 /*profileIdPointed*/,
        uint256 /*pubIdPointed*/,
        bytes calldata /*data*/
    ) external view override {
        _checkIfHuman(profileId);
    }

    function processMirror(
        uint256 profileId,
        uint256 /*profileIdPointed*/,
        uint256 /*pubIdPointed*/,
        bytes calldata /*data*/
    ) external view override {
        _checkIfHuman(profileId);
    }

    function _checkIfHuman(uint256 profileId) internal view {
        require(humanCheck.isVerified(profileId), "PollModule: Not a human");
    }

}