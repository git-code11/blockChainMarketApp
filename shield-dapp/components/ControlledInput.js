import { useController } from "react-hook-form";
import TextInput from "./BootstrapInput";

export default ({form, control, name, ...props})=>{
    const {field, fieldState:{error}} = useController({name, control, defaultValue:''})

    return (
        <TextInput 
            {...props}
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            name={field.name}
            inputRef={field.ref}
            //error={!!error}
            helperText={error?.message}
            FormHelperTextProps={{error:!!error}}
        />
    )
}