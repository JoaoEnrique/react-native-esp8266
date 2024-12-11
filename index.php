<?php
// arquivo: atualiza.php

// Define o caminho do arquivo para armazenar o estado
$estadoFile = 'estado.txt';

// Verifica se o arquivo de estado existe, se não cria com valor padrão
if (!file_exists($estadoFile)) {
    file_put_contents($estadoFile, 'desligado'); // valor padrão
}

// Verifica se a variável 'novoEstado' foi passada via GET
if (isset($_GET['novoEstado'])) {
    $novoEstado = $_GET['novoEstado'];
    
    if ($novoEstado === 'ligar') {
        file_put_contents($estadoFile, 'ligado'); // Atualiza o estado para ligado
        echo "ligar"; // Resposta que o ESP8266 vai receber
    } elseif ($novoEstado === 'desligar') {
        file_put_contents($estadoFile, 'desligado'); // Atualiza o estado para desligado
        echo "desligar"; // Resposta que o ESP8266 vai receber
    } else {
        echo file_get_contents($estadoFile); // Retorna o estado atual se o comando não for válido
    }
} else {
    // Retorna o estado atual se nenhum comando for recebido
    echo file_get_contents($estadoFile);
}
?>
