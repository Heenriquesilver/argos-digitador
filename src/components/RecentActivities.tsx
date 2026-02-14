import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

interface Activity {
  title: string;
  time: string;
}

const activities: Activity[] = [
  { title: "Updated 'SalesBot' agent", time: "2 minutes ago" },
  { title: "Workflow 'Onboarding' initiated", time: "45 minutes ago" },
  { title: "Token limit reached (90%)", time: "2 hours ago" },
];

export default function RecentActivities() {
  return (
    <Card>
      <CardContent>
        <Typography fontWeight={600} mb={2}>
          Recent Activities
        </Typography>

        <List>
          {activities.map((activity, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={activity.title}
                secondary={activity.time}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
