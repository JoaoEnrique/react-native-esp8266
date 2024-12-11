#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h> // Para HTTPS

const char* ssid = "seu-ssid-wifi";
const char* password = "sua-senha-wifi";

const char* serverIP = "seu-servidor"; // Endereço do seu servidor
const int relePin = 4; // GPIO para o relé

void setup() {
  Serial.begin(115200);
  pinMode(relePin, OUTPUT);
  digitalWrite(relePin, HIGH); // Inicialmente desligado

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando ao WiFi...");
  }
  Serial.println("Conectado ao WiFi");
}

void loop() {  
  WiFiClientSecure client; // Usando WiFiClientSecure para HTTPS

  // Para conexões seguras, você pode precisar adicionar o certificado do servidor:
   client.setInsecure(); // Descomente esta linha se você não tiver o certificado
  // Ou, para maior segurança, você pode usar o fingerprint do certificado:
  // const char* fingerprint = "xx xx xx xx xx xx xx xx xx xx xx xx xx xx xx xx xx xx xx xx";
  // client.setFingerprint(fingerprint);

  if (client.connect(serverIP, 443)) { // Conecta ao servidor na porta 443
    client.print("GET /atualiza.php HTTP/1.1\r\n");
    client.print("Host: ");
    client.print(serverIP);
    client.print("\r\n");
    client.print("Connection: close\r\n\r\n");

    Serial.println("Requisição enviada para o servidor.");
    
    // Aguardar a resposta do servidor
    while (client.connected() || client.available()) {
      if (client.available()) {
        String line = client.readStringUntil('\n');
        Serial.println(line); // Mostra a resposta do servidor

        // Controla o relé com base na resposta do servidor
        if (line.indexOf("desligado") >= 0) {
          digitalWrite(relePin, HIGH);
          Serial.println("Relé desligado.");
        } else if (line.indexOf("ligado") >= 0) {
          digitalWrite(relePin, LOW);
          Serial.println("Relé ligado.");
        }
      }
    }
  } else {
    Serial.println("Falha na conexão com o servidor.");
  }

  delay(10); // Aguarda 5 segundos antes da próxima verificação
}
