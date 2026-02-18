const folderInput = document.getElementById('folderInput');
const listLocal = document.getElementById('list-local');

folderInput.addEventListener('change', (event) => {
    const files = event.target.files;
    listLocal.innerHTML = ''; // Limpa a lista atual

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Filtra apenas arquivos de áudio
        if (file.type.startsWith('audio/')) {
            const url = URL.createObjectURL(file); // Cria um caminho temporário para o áudio
            
            // Cria o item da lista usando sua estrutura
            const li = document.createElement('li');
            li.className = 'music-item d-flex align-items-center justify-content-between';
            li.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="default-cover.png" class="music-img-list">
                    <div class="ms-3 d-flex flex-column">
                        <span class="music-name-list">${file.name.replace(/\.[^/.]+$/, "")}</span>
                        <span class="producer-name-list">Arquivo Local</span>
                    </div>
                </div>
                <span class="duration-list">--:--</span>
            `;
            
            // Evento para tocar ao clicar
            li.onclick = () => playMusic(file.name, "Local", "default-cover.png", url);
            listLocal.appendChild(li);
        }
    }
    alert(`${files.length} arquivos analisados!`);
});

document.getElementById('folderInput').addEventListener('change', function(event) {
    const files = event.target.files; // Todos os arquivos da pasta
    const listaLocalUI = document.getElementById('list-local');
    const totalLocalDisplay = document.querySelector('.card-b-p h2');
    
    // Limpa a lista atual para carregar a nova pasta
    listaLocalUI.innerHTML = '';
    let musicCount = 0;

    // Converter a lista de arquivos em um array e filtrar apenas áudios
    Array.from(files).forEach(file => {
        if (file.type.startsWith('audio/') || file.name.endsWith('.mp3') || file.name.endsWith('.wav')) {
            musicCount++;
            
            // Criar a URL temporária para tocar a música
            const musicURL = URL.createObjectURL(file);
            
            // Criar o elemento visual (sua estrutura de lista)
            const li = document.createElement('li');
            li.className = 'music-item d-flex align-items-center justify-content-between';
            
            li.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="image.png" alt="Capa" class="music-img-list">
                    <div class="ms-3 d-flex flex-column text-start">
                        <span class="music-name-list">${file.name.replace(/\.[^/.]+$/, "")}</span>
                        <span class="producer-name-list text-secondary">Arquivo Local</span>
                    </div>
                </div>
                <span class="duration-list">--:--</span>
            `;

            // Evento de clique para tocar a música
            li.onclick = function() {
                tocarMusica(file.name, "Local", "image.png", musicURL);
            };

            listaLocalUI.appendChild(li);
        }
    });

    // Atualiza o contador de músicas no card do topo
    totalLocalDisplay.innerText = musicCount;

    // Fechar o modal automaticamente após selecionar (usando Bootstrap)
    const modalElement = document.getElementById('configModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
});

// Função para atualizar o Player Inferior
function tocarMusica(nome, autor, capa, url) {
    const audioPlayer = document.querySelector('audio') || new Audio();
    
    // Atualiza a interface do Player
    document.querySelector('.music-name').innerText = nome;
    document.querySelector('.producer-name').innerText = autor;
    document.querySelector('.plaing-cover').src = capa;
    
    // Toca o som
    audioPlayer.src = url;
    audioPlayer.play();
    
    // Se o seu botão de play tiver um ícone, mude para "Pause"
    document.getElementById('btnPlay').innerHTML = "<span>⏸️</span>";
}