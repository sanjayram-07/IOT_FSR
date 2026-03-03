ESP8266 sketch (Arduino) - Fallback WiFi and POST/WS sample

This snippet demonstrates connecting an ESP8266 to multiple SSIDs (primary + fallback). It shows how to send FSR readings as JSON via WebSocket or HTTP POST to the Node.js server. Replace SSID/PASS and SERVER_IP.

```cpp
#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>
#include <ESP8266HTTPClient.h>

const char* ssidList[][2] = {
  {"HOME_SSID","HOME_PASS"},
  {"MOBILE_HOTSPOT","HOTSPOT_PASS"}
};
const int ssidCount = 2;

const char* fallbackServerIp = "192.168.4.1"; // IP to try if DNS fails
const int serverPort = 8080;

WebSocketsClient webSocket;

void connectWiFi(){
  for(int i=0;i<ssidCount;i++){
    WiFi.begin(ssidList[i][0], ssidList[i][1]);
    unsigned long start = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - start < 8000) delay(200);
    if (WiFi.status() == WL_CONNECTED) break;
  }
}

void setup(){
  Serial.begin(115200);
  connectWiFi();

  if (WiFi.status() == WL_CONNECTED){
    webSocket.begin(WiFi.localIP().toString().c_str(), serverPort, "/");
  } else {
    // try direct IP fallback
    webSocket.begin(fallbackServerIp, serverPort, "/");
  }

  webSocket.onEvent([](WStype_t type, uint8_t * payload, size_t length){
    // handle messages if needed
  });
}

int readFSR(){
  // Replace with actual analog read pin
  return analogRead(A0);
}

void loop(){
  webSocket.loop();
  int raw = readFSR();
  int maxValue = 1023; // calibrate per device
  float percentage = (float)raw / (float)maxValue * 100.0;

  // Build JSON
  String payload = "{";
  payload += "\"deviceId\":\"esp01\",";
  payload += "\"exercise\":\"shoulder press\",";
  payload += "\"variation\":\"arnold press\",";
  payload += "\"rawValue\":" + String(raw) + ",";
  payload += "\"maxValue\":" + String(maxValue) + ",";
  payload += "\"timestamp\":\"" + String(millis()) + "\"}";

  if (webSocket.isConnected()){
    webSocket.sendTXT(payload);
  } else {
    // fallback: HTTP POST
    if (WiFi.status() == WL_CONNECTED){
      HTTPClient http;
      String url = String("http://") + (WiFi.status()==WL_CONNECTED?WiFi.gatewayIP().toString():fallbackServerIp) + ":" + String(serverPort) + "/api/ingest";
      http.begin(url);
      http.addHeader("Content-Type", "application/json");
      int code = http.POST(payload);
      http.end();
    }
  }

  delay(1000);
}
```

Notes:

- Calibrate `maxValue` per sensor and per user / session.
- The Node server accepts WebSocket JSON messages; a POST endpoint `/api/ingest` can also be implemented.
