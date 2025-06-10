eleitores = {
    "Ana": "11111111111",
    "Bruno": "22222222222",
    "Carla": "33333333333"
}

candidatos = {
    "Giovana": {"numero": 1608, "votos": 0},
    "Gustavo": {"numero": 3115, "votos": 0},
    "Nulo": {"numero": 0, "votos": 0}
}

print("Bem-vindo ao sistema de votação!")

while True:
    print("\n--- Identificação do Eleitor ---")
    nome = input("Digite o seu nome: ")
    cpf = input("Digite o seu CPF: ")

    if nome not in eleitores or eleitores[nome] != cpf:
        print("Eleitor não cadastrado ou CPF incorreto. Não pode votar.\n" \
        "Realize o pagamento da multa para ter seus diteiros regularizados")
        

    print("\nCandidatos:")
    for nome_cand, info in candidatos.items():
        print(f"{nome_cand} - Número: {info['numero']}")

    voto = int(input("Digite o número do seu candidato: "))

    votou = False
    for nome_cand, info in candidatos.items():
        if voto == info["numero"]:
            info["votos"] += 1
            votou = True
            print(f"Voto computado para {nome_cand}!")
            break

    if not votou:
        print("Número inválido. Voto não computado.")

    if input("Deseja encerrar a votação? (s/n): ") == "s":
        break

print("\nResultado da votação:")
for nome_cand, info in candidatos.items():
    print(f"{nome_cand}: {info['votos']} voto(s)")