import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

export default function ImageRenderer(props) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" >
      <Avatar alt={props.data.name} src={props.data.image} sx={{ height: 33, width:33 }}/>
      <span> {props?.data?.name || ''}</span>
    </Stack>
  );
}
