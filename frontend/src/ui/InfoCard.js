import { Card, CardContent, Typography } from "@mui/material";

function InfoCard({ title, value }) {
  return (
    <Card sx={{ minWidth: 200, boxShadow: 3 }}>
      <CardContent>
        <Typography color="text.secondary">
          {title}
        </Typography>

        <Typography variant="h5">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoCard;