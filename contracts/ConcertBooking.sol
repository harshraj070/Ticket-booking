// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ConcertBooking {
    struct Concert {
        string name;
        uint256 date;
        uint256 price;
        bool booked;
    }

    mapping(uint256 => Concert) public concerts;

    function addConcert(
        uint256 id,
        string memory name,
        uint256 date,
        uint256 price
    ) public {
        concerts[id] = Concert(name, date, price, false);
    }

    function bookConcert(uint256 id) public payable {
        require(!concerts[id].booked, "Already booked");
        require(msg.value >= concerts[id].price, "Insufficient ETH");

        concerts[id].booked = true;
    }
}
