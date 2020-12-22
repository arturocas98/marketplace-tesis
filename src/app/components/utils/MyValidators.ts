import { AbstractControl, FormGroup } from '@angular/forms';
declare var $;
export class MyValidators {
    public form: FormGroup;
    static isPriceValid(control: AbstractControl) {
        const value = control.value;
        console.log(value);
        if (value > 10000) {
            return { price_invalid: true };
        }
        return null;
    }

    public soloLetras(e) {
        console.log(e);
        let key = e.keyCode || e.which;
        let tecla = String.fromCharCode(key).toLowerCase();
        let letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
        let especiales: any;
        especiales = "8-37-39-46";

        let tecla_especial = false
        for (var i in especiales) {
            if (key == especiales[i]) {
                tecla_especial = true;
                break;
            }
        }

        if (letras.indexOf(tecla) == -1 && !tecla_especial) {
            return false;
        }
    }

    public needValidation() {
        (function () {
            'use strict';
            window.addEventListener('load', function () {
              // Get the forms we want to add validation styles to
              var forms = document.getElementsByClassName('needs-validation');
              // Loop over them and prevent submission
              var validation = Array.prototype.filter.call(forms, function (form) {
                form.addEventListener('submit', function (event) {
                  if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                  form.classList.add('was-validated');
                }, false);
              });
            }, false);
          })();
    };

    public tooltip() {
        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
    }

    public validatorErrorField(field, form) {
        return form.get(field).errors && form.get(field).dirty;
    }
}