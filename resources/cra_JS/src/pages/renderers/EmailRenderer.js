import Stack from '@mui/material/Stack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'

export default function ImageRenderer(props) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" >
      <FontAwesomeIcon icon={faEnvelope} />
      {/* <Avatar alt={props.data.name} sx={{ height: 33, width:33 }}/> */}
      <span> {props?.data?.email || ''}</span>
    </Stack>
  );
}
