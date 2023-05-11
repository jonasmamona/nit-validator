import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

const MyPaper = styled(Paper)({
  borderRadius: "10px",
  color: "#FFFFFF",
  minWidth: "700px",
  height: "60px",
  padding: "20px"
});

type CustomPaperProps = {
  children: React.ReactNode;
};

export function CustomPaper({ children }: CustomPaperProps) {
  return <MyPaper elevation={3}>{children}</MyPaper>;
}
