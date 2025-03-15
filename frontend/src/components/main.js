import {AuthUtils} from "../utils/auth-utils";

export class Main {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/sign-in');
        }
        this.setupButtonListeners();
        this.drawPie();
    }

    setupButtonListeners() {
        const buttons = document.querySelectorAll(".buttons-layout a");
        buttons.forEach(button => {
            button.addEventListener("click", (event) => {
                this.handleButtonClick(event, buttons);
            });
        });
    }
    handleButtonClick(event, buttons) {
        buttons.forEach(btn => btn.classList.remove("btn-secondary"));
        buttons.forEach(btn => btn.classList.add("btn-outline-secondary"));
        event.currentTarget.classList.add("btn-secondary");
        event.currentTarget.classList.remove("btn-outline-secondary");
    }

    drawPie() {
        const incomeData = {
            labels: ['Red', 'Blue', 'Yellow'],
            datasets: [{
                label: 'Income Dataset',
                data: [300, 50, 100],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
            }]
        };

        const expensesData = {
            labels: ['Green', 'Purple', 'Orange'],
            datasets: [{
                label: 'Expenses Dataset',
                data: [150, 250, 100],
                backgroundColor: [
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)',
                    'rgb(255, 159, 64)'
                ],
                hoverOffset: 4
            }]
        };

        const incomeConfig = {
            type: 'pie',
            data: incomeData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                }
            },
        };
        const incomeCtx = document.getElementById('incomeChart').getContext('2d');
        const incomeChart = new Chart(incomeCtx, incomeConfig);

        const expensesConfig = {
            type: 'pie',
            data: expensesData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                }
            },
        };
        const expensesCtx = document.getElementById('expensesChart').getContext('2d');
        const expensesChart = new Chart(expensesCtx, expensesConfig);
    }
}