document.addEventListener("DOMContentLoaded", async () => {

    // =====================================================
    // BANCO PIX
    // Cadastro + Login + Sessão
    // =====================================================

    const supabaseClient = window.supabase
        ? window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        )
        : null;

    if (!supabaseClient) {
        console.error("Supabase não foi carregado.");
        return;
    }


    // =====================================================
    // ELEMENTOS
    // =====================================================

    const registerForm =
        document.getElementById("registerForm");

    const loginForm =
        document.getElementById("loginForm");

    const registerMessage =
        document.getElementById("message");

    const loginMessage =
        document.getElementById("loginMessage");

    const registerButton =
        document.getElementById("registerButton");

    const loginButton =
        document.getElementById("loginButton");


    // =====================================================
    // CADASTRO
    // =====================================================

    if (registerForm) {

        registerForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            const nome =
                document.getElementById("nome").value.trim();

            const cpf =
                document.getElementById("cpf").value.trim();

            const cep =
                document.getElementById("cep").value.trim();

            const dataNascimento =
                document.getElementById("dataNascimento").value;

            const email =
                document.getElementById("email").value.trim();

            const senha =
                document.getElementById("senha").value;

            const tipoPix =
                document.getElementById("tipoPix").value;


            if (
                !nome ||
                !cpf ||
                !cep ||
                !dataNascimento ||
                !email ||
                !senha ||
                !tipoPix
            ) {

                registerMessage.textContent =
                    "Preencha todos os campos.";

                registerMessage.style.color =
                    "#dc2626";

                return;
            }


            if (senha.length < 6) {

                registerMessage.textContent =
                    "A senha precisa ter pelo menos 6 caracteres.";

                registerMessage.style.color =
                    "#dc2626";

                return;
            }


            registerButton.disabled = true;

            registerButton.textContent =
                "Criando conta...";


            try {

                // -----------------------------------------
                // CRIAR USUÁRIO NO SUPABASE AUTH
                // -----------------------------------------

                const {
                    data,
                    error
                } = await supabaseClient.auth.signUp({

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


                // -----------------------------------------
                // CRIAR PERFIL
                // -----------------------------------------

                const {
                    error: profileError
                } = await supabaseClient
                    .from("profiles")
                    .insert({

                        id: data.user.id,

                        nome_completo: nome,

                        cpf: cpf,

                        cep: cep,

                        data_nascimento:
                            dataNascimento,

                        tipo_chave_pix:
                            tipoPix

                    });


                if (profileError) {
                    throw profileError;
                }


                registerMessage.style.color =
                    "#16a34a";


                if (data.session) {

                    registerMessage.textContent =
                        "Conta criada com sucesso!";

                    setTimeout(() => {

                        window.location.href =
                            "index.html";

                    }, 1000);

                } else {

                    registerMessage.textContent =
                        "Conta criada! Verifique seu e-mail para confirmar o cadastro.";

                    registerForm.reset();

                }


            } catch (error) {

                console.error(
                    "Erro no cadastro:",
                    error
                );


                registerMessage.style.color =
                    "#dc2626";


                registerMessage.textContent =
                    traduzirErroSupabase(error);


            } finally {

                registerButton.disabled =
                    false;

                registerButton.textContent =
                    "Criar minha conta";

            }

        });

    }


    // =====================================================
    // LOGIN
    // =====================================================

    if (loginForm) {

        loginForm.addEventListener("submit", async (event) => {

            event.preventDefault();


            const email =
                document.getElementById("email")
                    .value
                    .trim();


            const senha =
                document.getElementById("senha")
                    .value;


            if (!email || !senha) {

                loginMessage.textContent =
                    "Digite seu e-mail e sua senha.";

                loginMessage.style.color =
                    "#dc2626";

                return;
            }


            loginButton.disabled = true;

            loginButton.textContent =
                "Entrando...";


            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth
                        .signInWithPassword({

                            email: email,

                            password: senha

                        });


                if (error) {
                    throw error;
                }


                if (!data.user) {

                    throw new Error(
                        "Usuário não encontrado."
                    );

                }


                loginMessage.style.color =
                    "#16a34a";


                loginMessage.textContent =
                    "Login realizado!";


                setTimeout(() => {

                    window.location.href =
                        "index.html";

                }, 700);


            } catch (error) {

                console.error(
                    "Erro no login:",
                    error
                );


                loginMessage.style.color =
                    "#dc2626";


                loginMessage.textContent =
                    traduzirErroSupabase(error);


            } finally {

                loginButton.disabled =
                    false;

                loginButton.textContent =
                    "Entrar";

            }

        });

    }


    // =====================================================
    // VERIFICAR SESSÃO
    // =====================================================

    const paginaAtual =
        window.location.pathname
            .split("/")
            .pop();


    const paginasPublicas = [
        "",
        "index.html",
        "login.html",
        "cadastro.html"
    ];


    const {
        data: {
            session
        }
    } = await supabaseClient.auth.getSession();


    // =====================================================
    // LOGOUT
    // =====================================================

    const logoutButton =
        document.getElementById("logoutButton");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async () => {

                await supabaseClient.auth.signOut();

                window.location.href =
                    "login.html";

            }
        );

    }


    // =====================================================
    // PROTEGER PAINEL
    // =====================================================

    const painel =
        document.querySelector(".container");


    if (
        paginaAtual === "index.html" &&
        painel
    ) {

        if (!session) {

            window.location.href =
                "login.html";

            return;

        }

    }


    // =====================================================
    // MOSTRAR USUÁRIO LOGADO
    // =====================================================

    if (session) {

        const userEmail =
            session.user.email;


        const emailElements =
            document.querySelectorAll(
                "[data-user-email]"
            );


        emailElements.forEach((element) => {

            element.textContent =
                userEmail;

        });

    }


    // =====================================================
    // OCULTAR / MOSTRAR SALDO
    // =====================================================

    const balance =
        document.getElementById("balance");


    const toggleBalance =
        document.getElementById("toggleBalance");


    let balanceVisible = true;


    if (
        balance &&
        toggleBalance
    ) {

        toggleBalance.addEventListener(
            "click",
            () => {

                balanceVisible =
                    !balanceVisible;


                if (balanceVisible) {

                    balance.textContent =
                        "R$ 0,00";

                    toggleBalance.textContent =
                        "👁️";

                } else {

                    balance.textContent =
                        "R$ •••••";

                    toggleBalance.textContent =
                        "🙈";

                }

            }
        );

    }

});


// =========================================================
// TRADUZIR ERROS DO SUPABASE
// =========================================================

function traduzirErroSupabase(error) {

    if (!error) {
        return "Ocorreu um erro.";
    }


    const mensagem =
        error.message
            ? error.message.toLowerCase()
            : "";


    if (
        mensagem.includes("user already registered")
    ) {

        return "Este e-mail já está cadastrado.";

    }


    if (
        mensagem.includes("invalid login credentials")
    ) {

        return "E-mail ou senha incorretos.";

    }


    if (
        mensagem.includes("email not confirmed")
    ) {

        return "Confirme seu e-mail antes de entrar.";

    }


    if (
        mensagem.includes("password")
    ) {

        return "A senha informada não é válida.";

    }


    if (
        mensagem.includes("rate limit")
    ) {

        return "Muitas tentativas. Aguarde um pouco.";

    }


    return (
        error.message ||
        "Não foi possível concluir a operação."
    );

}
