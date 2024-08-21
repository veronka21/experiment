import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-photo-test',
  templateUrl: './photo-test.component.html',
  styleUrls: ['./photo-test.component.scss']
})
export class PhotoTestComponent {
  @ViewChild('cameraInput') camera!:ElementRef;
  @ViewChild('canvas') canvas!:ElementRef;
  previewSrc: SafeUrl | string | null = null;
  fileBlob?: Blob;
  b64Blob?: Blob;

  capturedImageSrc: string | ArrayBuffer | null = null;

  constructor(private sanitizer : DomSanitizer) {}

  valChange(event: Event) {
    let target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      let file = target.files[0];
      let type = target.files[0].type;
      if (file) {
        this.displayCapturedImage(file);
      }
    }
  }

  displayCapturedImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.capturedImageSrc = reader.result;
    };
    reader.readAsDataURL(file);
  }

  saveImage() {
    if (this.capturedImageSrc) {
      // Convert the base64 data URL to a Blob if needed
      const blob = this.dataURItoBlob(this.capturedImageSrc as string);
      console.log(blob); 
    }
  }
  
  dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  deleteImage() {
    this.capturedImageSrc = null;
    if (this.camera) {
      this.camera.nativeElement.value = "";
    }
  }

  valChange2(event: Event) {
    let target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      let file = target.files[0];
      let type = target.files[0].type;
      let newFile;
      let preview = this.canvas.nativeElement;
      let ctx = preview.getContext('2d');

      // let reader = new FileReader();
      // reader.readAsDataURL(file);
      // let base64data;
      //   let sanitizer = this.sanitizer;
      //   let previewSrc = this.previewSrc;
      //   reader.onloadend = function() {
      //     base64data = reader.result;   
      //     // previewSrc = 'data:' + type + ';base64,' + base64data;  
      //     this.previewSrc = sanitizer.bypassSecurityTrustUrl('data:' + type + ';base64,' + base64data);  
      //   }

      // this.changeFile(file).then((base64: any) => {
      //   this.fileBlob = new Blob([base64], {type: type});

      //   var reader = new FileReader();
      //   reader.readAsDataURL(this.fileBlob); 
      //   let base64data;
      //   let sanitizer = this.sanitizer;
      //   let previewSrc = this.previewSrc;
      //   reader.onloadend = function() {
      //     base64data = reader.result;   
      //     previewSrc = 'data:' + type + ';base64,' + base64data;  
      //     // previewSrc = sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + base64data);  
      //   }

        let img = new Image;
        img.src = URL.createObjectURL(file);
        console.log("after create:" + img.src);
        let previewSrc = this.previewSrc;
        img.onload = function() {
          preview.width = img.width;
          preview.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);
          previewSrc = (preview as HTMLCanvasElement).toDataURL();
          URL.revokeObjectURL(img.src);
          console.log("onload after revoke:" + img.src);
        }

        // this.previewSrc = URL.createObjectURL(file);
        // this.canvas.nativeElement.getContext('2d').drawImage(this.camera.nativeElement, 0, 0);

        // });

        // target.value = "";
    } else {
      console.log("nothing");
    }

  }
  
  changeFile(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  
  clear() {
    this.camera.nativeElement.value = "";
    this.canvas.nativeElement.getContext("2d").clearRect(0,0,this.canvas.nativeElement.width,this.canvas.nativeElement.height);
  }
}
