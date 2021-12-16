// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract TasksContract {

    uint256 public taskCounter = 0;

    constructor () {
        createTask("First Task", "You have to do something don't forget it!");
    }

    event TaskCreated(
        uint id,
        string title,
        string description,
        bool done,
        uint256 createdAt
    );

    event TaskToggleDone(
        uint id, 
        bool done
    );

    struct Task {
        uint id;
        string title;
        string description;
        bool done;
        uint256 createdAt;
    }

    mapping(uint256 => Task) public tasks;

    function createTask(string memory _title, string memory _description) public {
        taskCounter++; 
        tasks[taskCounter] = Task(taskCounter, _title, _description, false, block.timestamp);
        emit TaskCreated(taskCounter, _title, _description, false, block.timestamp);
    }

    function getCounter() public view returns(uint256) {
        return taskCounter;
    }

    function toggleDone(uint _id) public {
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;
        emit TaskToggleDone(_id, _task.done);
    }

}
