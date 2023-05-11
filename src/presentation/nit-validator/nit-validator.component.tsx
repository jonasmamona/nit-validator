import { Grid, TextField } from "@mui/material";
import { CustomPaper } from "../../components/custom-paper.component";
import { useState } from "react";
import {
  assembleErrorString,
  calculateNITVerificationDigit,
} from "../../domain/nit-validator";
import { isLeft } from "../../helper/either-monad";

export function NitValidator() {
  //this is not good react, but it's just a demo :)
  const [nit, setNit] = useState("");
  const [verificationDigit, setVerificationDigit] = useState("");
  const [errors, setErrors] = useState<string>("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if(event.target.value.length > 9) return;

    setNit(event.target.value);
    let result = calculateNITVerificationDigit(event.target.value);
    if (isLeft(result)) {
      setErrors(assembleErrorString(result.left));
      setVerificationDigit("");
    } else {
      setVerificationDigit(result.right.verificationDigit);
      setErrors("");
    }
  }

  return (
    <Grid
      container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CustomPaper>
        <Grid container spacing={2} justifyContent={"center"}>
          <Grid item xs={10}>
            <TextField
              variant="outlined"
              id="title"
              fullWidth
              inputProps={{ maxLength: 10 }}
              InputLabelProps={{ shrink: true }}
              label="NIT"
              onChange={handleChange}
              error={errors.length > 0}
              helperText={errors}
              type="number"
              value={nit}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              variant="outlined"
              id="title"
              fullWidth
              value={verificationDigit}
              inputProps={{ maxLength: 1 }}
              InputLabelProps={{ shrink: true }}
              label="DV"
              error={errors.length > 0}
              disabled
            />
          </Grid>
        </Grid>
      </CustomPaper>
    </Grid>
  );
}
