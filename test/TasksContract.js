const _tasksContract = require("../migrations/2_tasksContract");

const TasksContract = artifacts.require("TasksContract");

contract("TasksContract", () => {
    before(async () => {
        this.tasksContract = await TasksContract.deployed();
    })

    it('migrate deployed successfully', async () => {
        const address = this.tasksContract.address;
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
    })

    it('get tasks list', async () => {
        const taskCounter = await this.tasksContract.getCounter();
        const task = await this.tasksContract.tasks(taskCounter);

        assert.equal(task.id.toNumber(), taskCounter);
        assert.equal(task.title, "First Task");
        assert.equal(task.description, "You have to do something don't forget it!");
        assert.equal(task.done, false);
        assert.equal(task.done, false);
        assert.equal(taskCounter, 1);
    })

    it("task created successfully", async () => {
        const result = await this.tasksContract.createTask("some task", "description two");
        const taskEvent = result.logs[0].args;
        const taskCounter = await this.tasksContract.getCounter();


        assert.equal(taskCounter, 2);
        assert.equal(taskEvent.id.toNumber(), 2);
        assert.equal(taskEvent.title, "some task");
        assert.equal(taskEvent.description, "description two");
        assert.equal(taskEvent.done, false);

    })

    it("task toggle done", async () => {
        const result = await this.tasksContract.toggleDone(1);
        const taskEvent = result.logs[0].args;
        const task = await this.tasksContract.tasks(1);

        assert.equal(taskEvent.done, true);
        assert.equal(task.done, true);
        assert.equal(task.id, 1);
    })
})