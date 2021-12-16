App = {

    contracts: {},

    init: async () => {
        console.log('Loaded');
        await App.loadEthereum();
        await App.loadContracts();
        await App.loadAccount();
        await App.render();
        await App.renderTasks();
    },

    loadEthereum: async () => {
        if(window.ethereum) {
            App.web3Provider = window.ethereum;
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } else if (window.web3) {
            web3 = new Web3(window.web3.currentProvider)
        } else {
            console.log('No ethereum browser is installed. Try with MetaMask');
        } 
    },

    loadAccount: async () => {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        App.account = accounts[0];
    },

    loadContracts: async () => {
        const res = await fetch("TasksContract.json");
        const tasksContractJSON = await res.json();

        App.contracts.tasksContract = TruffleContract(tasksContractJSON)

        App.contracts.tasksContract.setProvider(App.web3Provider);

        App.tasksContract = await App.contracts.tasksContract.deployed();
    },

    render: () => {
        document.getElementById('account').innerText = App.account;
    },

    createTask: async (title, description) => {
        await App.tasksContract.createTask(title, description, {
            from: App.account
        })
        window.location.reload();
    },

    renderTasks: async () => {
        const counter = await App.tasksContract.taskCounter();
        const taskCounter = counter.toNumber()
        let html = "";
        for (let i = 1; i <= taskCounter; i++) {
            const task = await App.tasksContract.tasks(i);
            const taskId = task[0];
            const taskTitle = task[1];
            const taskDescription = task[2];
            const taskDone = task[3];
            const taskCreated = task[4];

            let taskElement = `
            <div class="card bg-dark rounded-0 mb-2">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>${taskTitle}</span> 
                    <div class="form-check form-switch">
                        <input class="form-check-input" data-id="${taskId}" type="checkbox" ${taskDone && "checked"} onchange="App.toggleDone(this)">
                    </div>
                </div>
                <div class="card-body">
                    <span>${taskDescription}</span> 
                    <p class="text-muted">Task was created ${new Date(taskCreated*1000).toLocaleString()}</span> 
                </div>
                
               
                
                
            </div>
            `;

            html+=taskElement;
             
        }

        document.getElementById('tasks-list').innerHTML = html;
    },

    toggleDone: async (element) => {
        const taskId = element.dataset.id;

        await App.tasksContract.toggleDone(taskId, {
            from: App.account
        });

        window.location.reload()
    }

    
};

