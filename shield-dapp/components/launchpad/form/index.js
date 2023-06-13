
import { useController } from "react-hook-form";
import  TextField from "@mui/material/TextField";

 export const Input =  ({name, ...props})=>{
    const {field, fieldState:{error}} = useController({name})

    return (
        <TextField 
            {...props}
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            name={field.name}
            inputRef={field.ref}
            error={Boolean(error)}
            helperText={error?.message ?? props.helperText}
        />
    )
}