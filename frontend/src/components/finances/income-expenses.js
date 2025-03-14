export class IncomeExpense {
    constructor() {
        const buttons = document.querySelectorAll(".buttons-layout a");
        buttons.forEach(button => {
            button.addEventListener("click", function() {
                buttons.forEach(btn => btn.classList.remove("btn-secondary"));
                buttons.forEach(btn => btn.classList.add("btn-outline-secondary"));
                this.classList.add("btn-secondary");
                this.classList.remove("btn-outline-secondary");
            });
        });
    }
}