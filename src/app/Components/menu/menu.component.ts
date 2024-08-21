import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerCameraDirection, CapacitorBarcodeScannerScanOrientation } from '@capacitor/barcode-scanner';
import { Capacitor } from '@capacitor/core';
import { detectBarcode } from 'barcode-tool';
import Quagga from 'quagga';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @ViewChild('video') video!: ElementRef;

  devices: MediaDeviceInfo[] = [];
  selectedDevice?: MediaDeviceInfo;
  localStream?: MediaStream

  constructor(private router: Router) {
  }
  
  ngAfterViewInit() {
    this.initDevices();
    this.startCameraAndScan();
  }
  allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.PDF_417];

  scannedBarcode(e: any) {
    this.scanResult = e
  }

  async handleDetectBarcode() {
    try {
        const elementWithBarcode = document.getElementById('video');

         // Specify optional formats to detect
        const formats = ['ean_13', 'qr_code', 'pdf417'];
        const barcodes = await detectBarcode({ image: this.video.nativeElement, formats });
        console.log("handleDetectBarcode ~ barcodes:", barcodes)
        this.scanResult = barcodes.length ? barcodes[0].rawValue : 'no success';
    } catch (error:any) {
      this.message = error.message;
        console.error('Error on detecting barcodes:', error.message);
    }
}

  scanResult: string = "";
  message: string = "no read yet";

  takePhoto() {
    this.router.navigateByUrl("/photo");
  }

  // async scan() {
  //   if (Capacitor.getPlatform() == 'hybrid') { // Checks if running in native environment
  //   try {
  //     console.log("scanning...");
  //     let scanner = CapacitorBarcodeScanner;
  //     console.log(scanner);
  //     let scan = await scanner.scanBarcode({hint: 17, cameraDirection: CapacitorBarcodeScannerCameraDirection.FRONT, scanOrientation: CapacitorBarcodeScannerScanOrientation.PORTRAIT});
  //     if (scan) this.scanResult = scan.ScanResult;
  //   } catch(e: any) {
  //     this.message = e;
  //   }
  // } else {
  //   let platform = Capacitor.getPlatform()
  //   console.log(platform);
  //   this.message = Capacitor.isPluginAvailable('BarcodeScanner').toString();
  // }}

  getDevices() {
    return navigator.mediaDevices?.enumerateDevices()
  }

  async initDevices() {
    let promise = this.getDevices()
    if (promise) {
      return promise
        .then(devices => devices.filter(device => device.kind == "videoinput")
        .forEach(device => this.devices.push(device)))
    }
  }

//   start() {
//     if (window.stream) {
//         window.stream.getTracks().forEach(track => {
//             track.stop();
//         });
//     }
//     //const audioSource = audioInputSelect.value;
//     const videoSource = videoSelect.value;
//     const constraints = {
//         //audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
//         video: {
//             deviceId: videoSource ? { exact: videoSource } : undefined,
//             width: currentWidth,
//             height: currentHeight,
//         }
//     };
//     navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleSelectVideoError);
// }

//   getMedia(dimensionConstraints: any) {
//     if (stream) {
//         stream.getTracks().forEach(track => {
//             track.stop();
//         });
//     }

//     clearErrorMessage();
//     videoblock.style.display = 'none';
//     const constraints = {
//         ...dimensionConstraints,
//     }
//     constraints.video.deviceId = videoSelect.value ? { exact: videoSelect.value } : undefined;
//     navigator.mediaDevices.getUserMedia(constraints)
//         .then(gotStream)
//         .catch(e => {
//             errorMessage('getUserMedia', e.message, e.name);
//         });
// }

//   gotStream(mediaStream) {
//     stream = window.stream = mediaStream; // stream available to console
//     video.srcObject = mediaStream;
//     messagebox.style.display = 'none';
//     videoblock.style.display = 'block';
//     const track = mediaStream.getVideoTracks()[0];
//     const constraints = track.getConstraints();
//     console.log('Result constraints: ' + JSON.stringify(constraints));
//     if (constraints && constraints.width && constraints.width.exact) {
//         //widthInput.value = constraints.width.exact;
//         //widthOutput.textContent = constraints.width.exact;
//     } else if (constraints && constraints.width && constraints.width.min) {
//         //widthInput.value = constraints.width.min;
//         //widthOutput.textContent = constraints.width.min;
//     }
//     return navigator.mediaDevices.enumerateDevices();
// }

  startCameraAndScan() {
    let constraints = {
      audio: false,
      video: {
        facingMode: "environment",
        // FullHD quality:
        width: 1920,
        height: 1080
      }
    };

    navigator.mediaDevices?.getUserMedia(constraints)
      .then(stream => {
        this.localStream = stream;
        stream.getVideoTracks().forEach((track: MediaStreamTrack) => {
          track.enabled = true;
        });

        this.video.nativeElement.srcObject = stream;
        this.video.nativeElement.play();

        // Quagga.init({
        //   inputStream: {
        //     name: "Live",
        //     type: "LiveStream",
        //     target: this.video.nativeElement, // Use the video element
        //     constraints: {
        //       // width: 640,
        //       // height: 480,
        //       facingMode: "environment" // Use rear camera
        //     },
        //   },
        //   decoder: {
        //     readers: ["code_128_reader"] // Specify the barcode types you want to decode
        //   }
        // }, (err: any) => {
        //   if (err) {
        //     console.error(err);
        //     return;
        //   }
        //   Quagga.start();
        // });

        // Quagga.onDetected((result: any) => {
        //   console.log("Barcode detected and processed: ", result.codeResult.code);
        //   Quagga.stop(); // Stop scanning once a barcode is detected
        // });
      })
      .catch(err => {
        console.error("Error accessing the camera: ", err);
      });
  }

  // ngOnDestroy(): void {
  //   Quagga.stop(); // Stop Quagga when the component is destroyed
  // }

}
