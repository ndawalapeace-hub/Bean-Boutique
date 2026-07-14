// Search bar

function filterCoffee() {
                const input = document.getElementById('search').value.toLowerCase();
                const cards = document.querySelectorAll('.block');
                cards.forEach(block => {
                    if (block.textContent.toLowerCase().includes(input)) {
                        block.style.display = '';
                    } else {
                        block.style.display = 'none';
                    }
                });
            }   

function filterEquipment() {
            const input = document.getElementById('search').value.toLowerCase();
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                if (card.textContent.toLowerCase().includes(input)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        }    


// Cart 

const buttons = document.querySelectorAll(".cart-btn");
const countDisplay = document.getElementById("cart-count");

let currentCount = localStorage.getItem("cartTotal");
if (!currentCount) {
    currentCount = 0;
}
countDisplay.textContent = currentCount;

buttons.forEach(button => {
    button.addEventListener("click", () => {
       
        currentCount = Number(currentCount) + 1;
        
        
        localStorage.setItem("cartTotal", currentCount);
        
        
        countDisplay.textContent = currentCount;
    });
});
