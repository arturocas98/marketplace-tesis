import { AbstractControl, FormGroup } from '@angular/forms';

export class MyValidators{
    public form : FormGroup;
    static isPriceValid(control: AbstractControl){
        const value = control.value;
        console.log(value);
        if(value > 10000){
            return { price_invalid:true };
        }
        return null;
    }

    public validatorErrorField(field, form) {
		return form.get(field).errors && form.get(field).dirty;
	}
}