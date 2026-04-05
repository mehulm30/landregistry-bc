// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract LandRegistry {
    struct Land {
        uint256 id;
        string name;
        string pdfHash;
        address owner;
        bool exists;
    }

    mapping(uint256 => Land) private lands;
    mapping(address => uint256[]) private ownedLands;

    event LandRegistered(uint256 indexed id, address indexed owner, string pdfHash, string name);
    event LandTransferred(uint256 indexed id, address indexed from, address indexed to);

    function registerLand(uint256 _id, string calldata _name, string calldata _pdfHash) external {
        require(_id != 0, "Invalid land id");
        require(bytes(_name).length > 0, "Name required");
        require(bytes(_pdfHash).length > 0, "PDF hash required");
        require(!lands[_id].exists, "Land already registered");

        lands[_id] = Land({
            id: _id,
            name: _name,
            pdfHash: _pdfHash,
            owner: msg.sender,
            exists: true
        });

        ownedLands[msg.sender].push(_id);
        emit LandRegistered(_id, msg.sender, _pdfHash, _name);
    }

    function transferLand(uint256 _id, address _to) external {
        require(_to != address(0), "Invalid recipient");
        require(lands[_id].exists, "Land not registered");
        require(lands[_id].owner == msg.sender, "Only owner can transfer");

        address previousOwner = lands[_id].owner;
        lands[_id].owner = _to;
        ownedLands[_to].push(_id);

        emit LandTransferred(_id, previousOwner, _to);
    }

    function getLand(uint256 _id) external view returns (uint256, string memory, string memory, address) {
        require(lands[_id].exists, "Land not registered");
        Land storage land = lands[_id];
        return (land.id, land.name, land.pdfHash, land.owner);
    }

    function getOwner(uint256 _id) external view returns (address) {
        require(lands[_id].exists, "Land not registered");
        return lands[_id].owner;
    }

    function getLandsByOwner(address _owner) external view returns (uint256[] memory) {
        return ownedLands[_owner];
    }
}
