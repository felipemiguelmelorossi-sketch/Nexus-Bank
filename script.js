// BancoPix
// Esta versão é apenas o protótipo.
// O PIX real será conectado posteriormente através de uma API Pix segura.

document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // SALDO
    // =========================

    const balance = document.getElementById("balance");
    const toggleBalance = document.getElementById("toggleBalance");

    let balanceVisible = true;

    if (toggleBalance && balance) {

        toggleBalance.addEventListener("click", () => {

            balanceVisible = !balanceVisible;

            if (balanceVisible) {
                balance.textContent = "R$ 0,00";
                toggleBalance.textContent = "👁️";
            } else {
                balance.textContent = "R$ •••••";
                toggleBalance.textContent = "🙈";
            }

        });

    }

    // =========================
    // CADASTRO
    // =========================

    const registerForm = document.getElementById("registerForm");
    const message = document.getElementById("message");

    if (registerForm) {

        registerForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const nome = document.getElementById("nome").value.trim();
            const cpf = document.getElementById("cpf").value.trim();
            const cep = document.getElementById("cep").value.trim();
            const dataNascimento =
                document.getElementById("dataNascimento").value;
            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("senha").value;
            const tipoPix = document.getElementById("tipoPix").value;

            if (
                !nome ||
                !cpf ||
                !cep ||
                !dataNascimento ||
                !email ||
                !senha ||
                !tipoPix
            ) {
                message.textContent = "Preencha todos os campos.";
                message.style.color = "#dc2626";
                return;
            }

            if (cpf.length < 11) {
                message.textContent = "Digite um CPF válido.";
                message.style.color = "#dc2626";
                return;
            }

            if (senha.length < 6) {
                message.textContent =
                    "A senha precisa ter pelo menos 6 caracteres.";
                message.style.color = "#dc2626";
                return;
            }

            message.textContent =
                "Cadastro recebido! Nesta versão, a conta ainda não é real.";
            message.style.color = "#16a34a";

        });

    }

});
