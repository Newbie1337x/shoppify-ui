import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-help',
  imports: [ReactiveFormsModule],
  templateUrl: './help.html',
  styleUrl: './help.css'
})
export class Help {

  private fb = inject(FormBuilder)
  showFaq = false
  showContact = false
  activeQuestion = signal<number | null>(null)

  wpp = 'https://wa.me/' // cvariable para el numero de dueño

  contactForm: FormGroup

  constructor() {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    })
  }

  toggleFaq() {
    this.showFaq = !this.showFaq
  }

  toggleContact() {
    this.showContact= !this.showContact
  }

  toggleQuestion(i: number) {
    this.activeQuestion.update(current => (current === i ? null : i))
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Consulta enviada:', this.contactForm.value)
      Swal.fire({
        icon: "success",
        title: "Consulta enviada",
        text: "Gracias por contactarnos. Te responderemos en breve"
      })
      this.contactForm.reset()
    }
  }
}
