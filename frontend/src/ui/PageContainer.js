import { Container } from "@mui/material";

function PageContainer({ children }) {
  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      {children}
    </Container>
  );
}

export default PageContainer;