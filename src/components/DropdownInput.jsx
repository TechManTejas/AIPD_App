import { Autocomplete, TextField } from "@mui/material";

export default function DropdownInput({
    fullWidth = false,
    disabled = false,
    label = "label",
    value,
    setValue,
    options = [],
    optionLabel = "label"
}) {
    return (
        <>
            <Autocomplete
                disabled={disabled}
                clearIcon={false}
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                options={options}
                getOptionLabel={(option) => option[optionLabel] }
                isOptionEqualToValue={(option, value) => option.dropdownName === value.dropdownName}
                renderInput={
                    (params) =>
                        <TextField
                            variant="standard"
                            fullWidth={fullWidth}
                            label={label}
                            {...params}
                        />
                }
            />
        </>
    )
}