import MuiTextField from "@mui/material/TextField"
import { useController } from "react-hook-form"

export default ({name, ...props})=>{
    const {field, fieldState:{error}} = useController({name})

    return (
        <MuiTextField
            {...props}
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value===undefined?"":field.value}
            name={field.name}
            inputRef={field.ref}
            error={Boolean(error)}
            helperText={error?.message}
        />
    )
}