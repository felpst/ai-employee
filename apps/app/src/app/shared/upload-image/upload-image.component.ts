import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UploadsService } from '../../services/uploads/uploads.service';
import { validatorFile } from '../validations';

@Component({
  selector: 'cognum-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent implements OnInit {
  @Input() helpMessage = 'Help teammates know that this is right place.';
  @Input() image = '';
  @Input() parentId = '';
  @Input() fieldName = 'avatar';
  @Input({ required: true }) folder!: string;
  @Output() finishedUpload = new EventEmitter();
  selectedImage: string | null = null;
  uploadForm = this.formBuilder.group({
    image: [this.image, []],
  });

  constructor(private uploadsService: UploadsService, private formBuilder: FormBuilder) { }


  ngOnInit(): void {
    if (this.image) {
      this.selectedImage = this.image
    }
  }

  onFileSelected(event: any) {
    try {
      const [file] = event.target.files;
      if (file) {
        const { name } = file;
        const extension = name.split('.')?.pop() || 'png';
        const filename = `${this.fieldName}.${extension}`;
        const selected = URL.createObjectURL(file);
        console.log({ selected });

        this.selectedImage = selected;
        const control = this.uploadForm.get('image');
        control?.patchValue(file);
        control?.setValidators(validatorFile);
        control?.updateValueAndValidity();
        this.uploadsService
          .single({
            file,
            folder: this.folder,
            filename,
            parentId: this.parentId,
          })
          .subscribe((result) => {
            const { url } = result
            this.finishedUpload.emit(url);
          });
      }
    } catch (error) {
      console.log('An error ocurring: ', { error });
    }
  }

  hasInputError(inputName: string, errorName: string) {
    return (
      this.uploadForm.get(inputName)?.invalid &&
      this.uploadForm.get(inputName)?.touched &&
      this.uploadForm.get(inputName)?.hasError(errorName)
    );
  }

}
