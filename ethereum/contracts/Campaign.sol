// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract CampaignFactory {
    address[] public deployedCampaigns;

    // functions
    function createCampaign(uint minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(address(newCampaign));
    }

    function getDeployedCampaigns() public view returns(address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    
    // struct
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    // local variables
    Request[] public requests; // Using the struct to create a variable that can be used locally within the class
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    uint public requestsCount;
    address public contractAddress = address(this);

    // modifier
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    // constructor
    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum; // minimum in wei
    }

    // functions
    function contribute() public payable {
        // msg.value is amount in wei of how much is being sent
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;

        // approversCount is just the number of people who have contributed
        // currently it is not tied to a request i.e. who contributed to what request
        // meaning, anyone who makes a contribution has a say in all requests
        approversCount++;
    }

    function createRequest(string memory description, uint value, address payable recipient) public restricted {
        Request storage newRequest = requests.push(); // newRequest now points to same location in hard drive as requests.push()?
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;

        requestsCount++;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]); // if it returns true then account has already approved, therefore !true

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finaliseRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (uint , uint, uint, uint, address) {
        return (
            minimumContribution,
            contractAddress.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount () public view returns (uint) {
        return requests.length;
    }
}