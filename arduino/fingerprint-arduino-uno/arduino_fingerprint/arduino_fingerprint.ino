/*
 * Fingerprint Attendance System - Arduino Code
 * Compatible with: Arduino Uno, Nano, Mega
 * Sensor: R307/AS608 Fingerprint Sensor
 * 
 * WIRING (Arduino Uno):
 * Fingerprint Sensor -> Arduino
 * VCC (Red)    -> 5V
 * GND (Black)  -> GND
 * TX (Green)   -> Pin 2 (RX)
 * RX (White)   -> Pin 3 (TX)
 */

#include <Adafruit_Fingerprint.h>
#include <SoftwareSerial.h>

// Software Serial pins for fingerprint sensor
SoftwareSerial mySerial(2, 3);  // RX, TX

Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

// Global variables
uint8_t id = 1;  // Current enrollment ID

void setup() {
  Serial.begin(9600);
  while (!Serial);
  
  delay(100);
  Serial.println("Fingerprint Attendance System");
  Serial.println("Arduino Ready");
  
  // Initialize fingerprint sensor
  finger.begin(57600);
  
  if (finger.verifyPassword()) {
    Serial.println("Sensor found!");
  } else {
    Serial.println("ERROR:Sensor not found");
    while (1) { delay(1); }
  }
  
  Serial.println("System initialized. Waiting for commands...");
  Serial.println("Commands: ENROLL:id or VERIFY");
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    
    if (command.startsWith("ENROLL:")) {
      // Extract ID from command
      int enrollId = command.substring(7).toInt();
      if (enrollId > 0) {
        enrollFingerprint(enrollId);
      } else {
        Serial.println("ERROR:Invalid ID");
      }
    } 
    else if (command == "VERIFY") {
      verifyFingerprint();
    }
    else if (command == "STATUS") {
      Serial.println("STATUS:READY");
    }
    else if (command == "COUNT") {
      getTemplateCount();
    }
    else if (command.startsWith("DELETE:")) {
      int deleteId = command.substring(7).toInt();
      deleteFingerprint(deleteId);
    }
    else if (command == "EMPTY") {
      emptyDatabase();
    }
    else {
      Serial.println("ERROR:Unknown command");
    }
  }
  
  delay(50);
}

// Enroll new fingerprint
void enrollFingerprint(int id) {
  Serial.print("ENROLL_START:");
  Serial.println(id);
  Serial.println("Place finger on sensor...");
  
  int p = -1;
  
  // Wait for finger
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    
    if (p == FINGERPRINT_OK) {
      Serial.println("Image taken");
    } else if (p == FINGERPRINT_NOFINGER) {
      // Still waiting
    } else {
      Serial.println("ERROR:Image capture failed");
      return;
    }
  }
  
  // Convert image to template
  p = finger.image2Tz(1);
  if (p != FINGERPRINT_OK) {
    Serial.println("ERROR:Image conversion failed");
    return;
  }
  
  Serial.println("Remove finger");
  delay(2000);
  
  // Wait for finger removal
  p = 0;
  while (p != FINGERPRINT_NOFINGER) {
    p = finger.getImage();
  }
  
  Serial.println("Place same finger again...");
  
  // Wait for second scan
  p = -1;
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    
    if (p == FINGERPRINT_OK) {
      Serial.println("Image taken");
    } else if (p == FINGERPRINT_NOFINGER) {
      // Still waiting
    } else {
      Serial.println("ERROR:Second image failed");
      return;
    }
  }
  
  // Convert second image
  p = finger.image2Tz(2);
  if (p != FINGERPRINT_OK) {
    Serial.println("ERROR:Second conversion failed");
    return;
  }
  
  // Create model
  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
    Serial.println("Prints matched!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("ERROR:Communication error");
    return;
  } else if (p == FINGERPRINT_ENROLLMISMATCH) {
    Serial.println("ERROR:Fingerprints did not match");
    return;
  } else {
    Serial.println("ERROR:Unknown error");
    return;
  }
  
  // Store model
  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.print("SUCCESS:");
    Serial.println(id);
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("ERROR:Communication error");
  } else if (p == FINGERPRINT_BADLOCATION) {
    Serial.println("ERROR:Invalid storage location");
  } else {
    Serial.println("ERROR:Storage failed");
  }
}

// Verify fingerprint
void verifyFingerprint() {
  Serial.println("VERIFY_START");
  Serial.println("Place finger on sensor...");
  
  int p = -1;
  
  // Wait for finger
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    
    if (p == FINGERPRINT_NOFINGER) {
      // Still waiting
    } else if (p == FINGERPRINT_OK) {
      Serial.println("Image taken");
    } else {
      Serial.println("ERROR:Image capture failed");
      return;
    }
  }
  
  // Convert to template
  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) {
    Serial.println("ERROR:Image conversion failed");
    return;
  }
  
  // Search for match
  p = finger.fingerSearch();
  
  if (p == FINGERPRINT_OK) {
    Serial.print("FOUND:");
    Serial.println(finger.fingerID);
    Serial.print("Confidence: ");
    Serial.println(finger.confidence);
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("ERROR:Communication error");
  } else if (p == FINGERPRINT_NOTFOUND) {
    Serial.println("ERROR:No match found");
  } else {
    Serial.println("ERROR:Search failed");
  }
}

// Get template count
void getTemplateCount() {
  finger.getTemplateCount();
  Serial.print("COUNT:");
  Serial.println(finger.templateCount);
}

// Delete specific fingerprint
void deleteFingerprint(int id) {
  uint8_t p = finger.deleteModel(id);
  
  if (p == FINGERPRINT_OK) {
    Serial.print("DELETE_SUCCESS:");
    Serial.println(id);
  } else {
    Serial.print("DELETE_FAILED:");
    Serial.println(id);
  }
}

// Empty entire database
void emptyDatabase() {
  finger.emptyDatabase();
  Serial.println("DATABASE_CLEARED");
}