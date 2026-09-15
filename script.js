document.addEventListener("DOMContentLoaded", () => {

    const registerForm = document.getElementById("registerForm");
    const message = document.getElementById("message");
    const registerButton = document.getElementById("registerButton");

    if (registerForm) {

        registerForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            const nome = document.getElementById("nome").value.trim();
            const cpf = document.getElementById("cpf").value.trim();
            const cep = document.getElementById("cep").value.trim();
            const dataNascimento =
                document.getElementById("dataNascimento").value;
            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("senha").value;
            const tipoPix = document.getElementById("tipoPix").value;

            message.textContent = "";
            registerButton.disabled = true;
            registerButton.textContent = "Criando conta...";

            try {

                // Cria o usuário no Supabase Auth
                const { data, error } =
                    await supabaseClient.auth.signUp({
                        email: email,
                        password: senha
                    });

                if (error) {
                    throw error;
                }

                if (!data.user) {
                    throw new Error(
                        "Não foi possível criar o usuário."
                    );
                }

                // Salva o perfil associado ao usuário
                const { error: profileError } =
                    await supabaseClient
                        .from("profiles")
                        .insert({
                            id: data.user.id,
                            nome_completo: nome,
                            cpf: cpf,
                            cep: cep,
                            data_nascimento: dataNascimento,
                            tipo_chave_pix: tipoPix
                        });

                if (profileError) {
                    throw profileError;
                }

                message.style.color = "#16a34a";

                message.textContent =
                    "Conta criada com sucesso! Verifique seu e-mail para confirmar o cadastro.";

                registerForm.reset();

            } catch (error) {

                console.error(error);

                message.style.color = "#dc2626";

                message.textContent =
                    error.message ||
                    "Não foi possível criar sua conta.";

            } finally {

                registerButton.disabled = false;
                registerButton.textContent = "Criar minha conta";

            }

        });

    }

});
